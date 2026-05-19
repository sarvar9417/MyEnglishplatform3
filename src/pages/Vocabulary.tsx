import { useState, useEffect, useMemo } from 'react'
import { BookMarked, Loader2, RotateCcw, CheckCircle, ArrowLeft, CalendarDays } from 'lucide-react'
import { supabase } from '../db/supabase'
import { useStore } from '../store/useStore'
import { useVocabStore, getBatchWords, type GameWord, type ViewMode } from '../store/vocabularyStore'
import {
  saveSession,
  computeNextReview,
  fetchMonthSessions,
  type Rating,
  type DailyWordRow,
  type DaySession,
} from '../services/vocabularyService'
import { getTodayTashkent } from '../utils/tashkentDate'
import FlashCard from '../components/vocabulary/FlashCard'
import WordTest from '../components/vocabulary/WordTest'
import WordGame from '../components/vocabulary/WordGame'
import VocabProgress from '../components/vocabulary/VocabProgress'
import VocabCalendar from '../components/vocabulary/VocabCalendar'
import VocabTypingGame from '../components/vocabulary/VocabTypingGame'

const BATCH_SIZE = 25
const WORDS_PER_DAY = 100

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2']

export default function Vocabulary() {
  const { addXP, addLearnedWords, updateSkillProgress } = useStore()
  const {
    dailyWords, reviewWords, currentBatch, batchWords, currentIdx, viewMode,
    loading, correctCount,
    setDailyWords, setReviewWords, setLoading,
    selectBatch, selectReview, nextWord, rateWord, finishBatch, tick, reset,
  } = useVocabStore()

  const [sessionStart, setSessionStart] = useState<number>(0)
  const todayStr = getTodayTashkent()
  const [studyDate, setStudyDate] = useState(todayStr)
  const startDate = useStore.getState().startDate
  const dayNumber = startDate
    ? Math.max(1, Math.round((Date.parse(studyDate + 'T00:00:00Z') - Date.parse(startDate + 'T00:00:00Z')) / 86400000) + 1)
    : 1
  const wordOffset = (dayNumber - 1) * WORDS_PER_DAY

  const [selectedDate, setSelectedDate] = useState(todayStr)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showTypingGame, setShowTypingGame] = useState(false)
  const [monthSessions, setMonthSessions] = useState<Map<string, DaySession>>(new Map())

  useEffect(() => {
    const today = getTodayTashkent()
    setStudyDate(today)
    setSelectedDate(today)
    loadDailyData(today)
    return () => { reset() }
  }, [])

  // Sahifa orqaga qaytganda yoki ko'rinib qolganda sanani yangilash
  useEffect(() => {
    const handleVisibility = () => {
      if (document.visibilityState === 'visible') {
        const today = getTodayTashkent()
        if (studyDate !== today) {
          setStudyDate(today)
          setSelectedDate(today)
          loadDailyData(today)
        }
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [studyDate])

  useEffect(() => {
    if (viewMode === 'flashcard' || viewMode === 'test') {
      const interval = setInterval(tick, 1000)
      return () => clearInterval(interval)
    }
  }, [viewMode])

  const [levelCounts, setLevelCounts] = useState<Map<string, number>>(new Map())
  const [learnedCounts, setLearnedCounts] = useState<Map<string, number>>(new Map())
  const [rpcError, setRpcError] = useState<string | null>(null)
  const [ratingFlash, setRatingFlash] = useState<{ wordId: number; rating: Rating } | null>(null)

  interface VP { word_id: number; box: number; next_review: string; correct_count: number; wrong_count: number; is_learned: boolean; last_rating?: string }

  function reloadMonthSessions(uid: string, year: number, month: number) {
    fetchMonthSessions(uid, year, month).then(setMonthSessions)
  }

  async function loadDailyData(targetDate?: string) {
    const sd = targetDate ?? getTodayTashkent()
    const dayNum = startDate
      ? Math.max(1, Math.round((Date.parse(sd + 'T00:00:00Z') - Date.parse(startDate + 'T00:00:00Z')) / 86400000) + 1)
      : 1
    const wordOff = (dayNum - 1) * WORDS_PER_DAY

    setLoading(true)
    setRpcError(null)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const uid = session?.user?.id
      if (!uid) { setLoading(false); return }
      const tk = getTodayTashkent().split('-').map(Number)
      reloadMonthSessions(uid, tk[0], tk[1] - 1)

      // ── 1. Level counts (words per level) ──
      const totalsMap = new Map<string, number>()
      for (const lvl of LEVEL_ORDER) {
        const { count, error: ce } = await supabase
          .from('words')
          .select('*', { count: 'exact', head: true })
          .eq('level', lvl)
        if (ce) console.error(`${lvl} count error:`, ce.message)
        totalsMap.set(lvl, count ?? 0)
      }

      // ── 2. Get user's progress + words in DB order ──
      const { data: myProgress, error: pe } = await supabase
        .from('vocabulary_progress')
        .select('word_id, box, next_review, correct_count, wrong_count, is_learned, last_rating')
        .eq('user_id', uid)
      if (pe) {
        console.error('vocabulary_progress error:', pe.message)
        setRpcError(`progress query error: ${pe.message}`)
      }
      const progressRows = (myProgress ?? []) as VP[]
      const progressByWord = new Map(progressRows.map(p => [p.word_id, p]))

      const today = getTodayTashkent()
      const ALL_LIMIT = 1000
      const { data: allWords, error: we } = await supabase
        .from('words')
        .select('*')
        .order('id', { ascending: true })
        .limit(ALL_LIMIT)
      if (we) setRpcError(`words query error: ${we.message}`)

      // ── 3. Bugungi yangi so'zlar va takrorlash so'zlarini ajratish ──
      const todayWords: DailyWordRow[] = []
      const reviewDueWords: DailyWordRow[] = []
      const learnedCountsMap: Record<string, number> = {}
      const wordList = allWords ?? []
      for (let i = 0; i < wordList.length; i++) {
        const w = wordList[i]
        const prog = progressByWord.get(w.id)
        const inToday = i >= wordOff && i < wordOff + WORDS_PER_DAY
        if (!prog) {
          if (!inToday) continue
          todayWords.push({
            word_id: w.id, english: w.english, uzbek: w.uzbek,
            level: w.level, box: 1, next_review: today,
            correct_count: 0, wrong_count: 0,
            is_new: true, is_learned: false, example: w.example ?? '',
            last_rating: undefined,
          })
        } else {
          if (prog.is_learned) {
            learnedCountsMap[w.level] = (learnedCountsMap[w.level] || 0) + 1
          }
          const row: DailyWordRow = {
            word_id: w.id, english: w.english, uzbek: w.uzbek,
            level: w.level, box: prog.box, next_review: prog.next_review,
            correct_count: prog.correct_count, wrong_count: prog.wrong_count,
            is_new: false, is_learned: prog.is_learned, example: w.example ?? '',
            last_rating: prog.last_rating,
          }
          if (inToday) {
            todayWords.push(row)
          } else if (prog.next_review <= today) {
            // Oldingi kunlardan: takrorlash vaqti kelgan so'zlar
            reviewDueWords.push(row)
          }
        }
      }

      const learned = LEVEL_ORDER.map(lvl => ({ level: lvl, learned: learnedCountsMap[lvl] || 0 }))
      setDailyWords(todayWords)
      setReviewWords(reviewDueWords)
      setLevelCounts(totalsMap)
      setLearnedCounts(new Map(learned.map((l) => [l.level, l.learned])))
      setSessionStart(Date.now())
    } catch (e) {
      console.error('loadDailyData xatosi:', e)
      setRpcError(`Umumiy xatolik: ${e instanceof Error ? e.message : e}`)
    } finally {
      setLoading(false)
    }
  }

  const levelStats = useMemo(() => {
    return LEVEL_ORDER.map((lvl) => ({
      level: lvl,
      total: levelCounts.get(lvl) ?? 0,
      learned: learnedCounts.get(lvl) ?? 0,
      color: lvl === 'A1' ? 'bg-gray-400' : lvl === 'A2' ? 'bg-primary-500' : lvl === 'B1' ? 'bg-b1-500' : 'bg-b2-500',
    }))
  }, [levelCounts, learnedCounts])

  const totalLearned = Array.from(learnedCounts.values()).reduce((a, b) => a + b, 0)
  const dueCount = dailyWords.filter((w) => !w.is_new && !w.is_learned && w.next_review <= todayStr).length

  const currentWord = batchWords[currentIdx]

  function goToCatalog() {
    const s = useVocabStore.getState()
    useVocabStore.setState({
      viewMode: 'catalog',
      batchWords: getBatchWords(s.dailyWords, s.currentBatch),
      currentIdx: 0,
      correctCount: 0,
      totalAnswered: 0,
      batchResults: {},
      sessionTime: 0,
    })
  }

  function enterStudyMode(mode: ViewMode) {
    const s = useVocabStore.getState()
    // Takrorlash rejimida (batch=0) yodlangan so'zlar ham ko'rsatiladi (ular qayta ko'rib chiqilishi kerak)
    const studyWords = s.currentBatch === 0
      ? s.batchWords
      : s.batchWords.filter(w => !w.is_learned)
    if (studyWords.length === 0) return
    useVocabStore.setState({
      viewMode: mode,
      batchWords: studyWords,
      currentIdx: 0,
      correctCount: 0,
      totalAnswered: 0,
      batchResults: {},
      sessionTime: 0,
    })
  }

  async function saveProgressToDB(wordId: number, rating: Rating, box: number) {
    const { data: { session } } = await supabase.auth.getSession()
    const uid = session?.user?.id
    if (!uid) { console.error('saveProgressToDB: no uid'); return }

    const srs = computeNextReview(box, rating)
    const allWords = [...dailyWords, ...reviewWords]
    const w = allWords.find((d) => d.word_id === wordId)
    const correct = rating === 'bildim' || rating === 'yodladim'
    const newCorrect = (w?.correct_count ?? 0) + (correct ? 1 : 0)
    const newWrong = (w?.wrong_count ?? 0) + (correct ? 0 : 1)

    const isLearned = srs.is_learned

    const { error } = await supabase.from('vocabulary_progress').upsert({
      user_id: uid,
      word_id: wordId,
      box: srs.box,
      next_review: srs.next_review,
      correct_count: newCorrect,
      wrong_count: newWrong,
      is_learned: isLearned,
      last_rating: rating,
      last_reviewed: new Date().toISOString(),
    } as never, { onConflict: 'user_id,word_id' })

    if (error) {
      console.error('saveProgressToDB upsert error:', error.message)
      setRpcError(`DB saqlash xatosi: ${error.message}`)
      return
    }

    if (w) {
      if (isLearned && !w.is_learned) {
        addLearnedWords(1)
        addXP(5)
        setLearnedCounts((prev) => {
          const next = new Map(prev)
          next.set(w.level, (next.get(w.level) ?? 0) + 1)
          return next
        })
      } else if (!isLearned && w.is_learned) {
        setLearnedCounts((prev) => {
          const next = new Map(prev)
          next.set(w.level, Math.max(0, (next.get(w.level) ?? 0) - 1))
          return next
        })
      }
    }
  }

  async function saveBatchSession(uid: string) {
    const batch = currentBatch
    const allWords = dailyWords.slice((batch - 1) * BATCH_SIZE, batch * BATCH_SIZE)
    const wordsJson: Record<string, Rating> = {}
    allWords.forEach((w) => {
      const result = useVocabStore.getState().batchResults[w.word_id]
      if (result) wordsJson[w.word_id.toString()] = result
    })
    const score = useVocabStore.getState().correctCount
    const time = Math.round((Date.now() - sessionStart) / 1000)
    await saveSession(uid, batch, wordsJson, score, time, selectedDate)
  }

  async function handleTestAnswer(correct: boolean) {
    if (correct) addXP(2)

    const word = batchWords[currentIdx]
    if (word) {
      const rating = correct ? 'bildim' : 'bilmadim'
      rateWord(word.word_id, rating)
      await saveProgressToDB(word.word_id, rating, word.box)
    }

    const totalInBatch = batchWords.length
    const answeredSoFar = useVocabStore.getState().totalAnswered + 1
    updateSkillProgress('todayVocabPct', Math.round((answeredSoFar / Math.max(totalInBatch, 1)) * 100))

    if (currentIdx + 1 >= totalInBatch) {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.id) {
        const uid = session.user.id
        await saveBatchSession(uid)
        reloadMonthSessions(uid, new Date().getFullYear(), new Date().getMonth())
      }
      finishBatch()
    } else {
      nextWord()
    }
  }

  async function handleGameComplete(score: number, total: number) {
    addXP(score * 3)
    addLearnedWords(score)
    updateSkillProgress('todayVocabPct', Math.round((score / total) * 100))

    // Update store for correct completion view
    useVocabStore.setState({ correctCount: score, totalAnswered: total })

    // Save each game word progress to DB (treat matched as "bildim")
    const { data: { session } } = await supabase.auth.getSession()
    const uid = session?.user?.id
    if (uid) {
      const store = useVocabStore.getState()
      for (const w of batchWords.slice(0, total)) {
        const rating = store.batchResults[w.word_id]
        if (rating) {
          await saveProgressToDB(w.word_id, rating, w.box)
        }
      }
      // Save session for calendar tracking
      if (uid) {
        await saveBatchSession(uid)
      }
      // Reload month sessions so calendar updates
      reloadMonthSessions(uid, new Date().getFullYear(), new Date().getMonth())
    }

    finishBatch()
  }

  function handleBatchComplete() {
    const today = getTodayTashkent()
    setStudyDate(today)
    setSelectedDate(today)
    loadDailyData(today)
  }

  // ── Loading ────────────────────────────────────────────────

  if (loading) {
    return (
      <div className="p-3 sm:p-6 max-w-2xl mx-auto flex items-center justify-center h-60">
        <div className="flex flex-col items-center gap-3">
          <Loader2 size={28} className="animate-spin text-b1-500" />
          <p className="text-sm text-gray-500">So'zlar yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  // ── No words / empty state ─────────────────────────────────

  if (dailyWords.length === 0 && !loading) {
    const hasWordsInDB = levelStats.some((s) => s.total > 0)

    if (rpcError) {
      return (
        <div className="p-3 sm:p-6 max-w-2xl mx-auto">
        <VocabProgress
          stats={levelStats}
          totalLearned={totalLearned}
          totalWords={levelStats.reduce((a, s) => a + s.total, 0)}
          dueCount={dueCount}
          streak={useStore.getState().streak}
        />
        <div className="mt-6 flex flex-col items-center gap-4 py-16 text-center">
            <div className="text-6xl mb-2">⚠️</div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-900">RPC funksiyalari topilmadi</h2>
            <p className="text-sm text-gray-500 max-w-sm">
              {rpcError}
            </p>
            <button
              onClick={() => loadDailyData()}
              className="mt-4 py-4 px-10 bg-gradient-to-r from-b1-500 to-b1-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-3"
            >
              <RotateCcw size={20} /> Qayta urinish
            </button>
          </div>
        </div>
      )
    }

    return (
      <div className="p-3 sm:p-6 max-w-2xl mx-auto">
        <VocabProgress
          stats={levelStats}
          totalLearned={totalLearned}
          totalWords={levelStats.reduce((a, s) => a + s.total, 0)}
          dueCount={dueCount}
          streak={useStore.getState().streak}
        />
        <div className="mt-6 flex flex-col items-center gap-4 py-16 text-center">
          {hasWordsInDB ? (
            <>
              <div className="text-6xl mb-2">🎉</div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">Bugungi so'zlar tugadi</h2>
              <p className="text-sm text-gray-500 max-w-xs">
                Barcha so'zlar o'rganildi! Ertaga yangi so'zlar avtomatik keladi.
              </p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-2">📚</div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">So'zlar yuklanmadi</h2>
              <p className="text-sm text-gray-500 max-w-xs">
                So'zlar bazasi bo'sh. Terminalda yugurting:
              </p>
              <code className="bg-gray-100 px-3 py-2 rounded-lg text-sm font-mono text-gray-700">
                npx tsx scripts/seed-words-table.ts
              </code>
            </>
          )}
          <button
            onClick={() => loadDailyData()}
            className="mt-4 py-4 px-10 bg-gradient-to-r from-b1-500 to-b1-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-3"
          >
            <RotateCcw size={20} /> Yangilash
          </button>
        </div>
      </div>
    )
  }

  // ── Batch complete view ────────────────────────────────────

  if (viewMode === 'complete') {
    const pct = batchWords.length > 0 ? Math.round((correctCount / batchWords.length) * 100) : 0
    const isReviewMode = currentBatch === 0
    const isLastBatch = isReviewMode || currentBatch >= 4
    return (
      <div className="p-3 sm:p-6 max-w-md mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-6xl mb-4">{pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '💪'}</div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">
          {isReviewMode ? "Takrorlash tugadi!" : isLastBatch ? "Bugungi mashq tugadi!" : `${currentBatch}-Batch tugadi!`}
        </h2>
        <p className="text-gray-500 mb-6">
          {batchWords.length} so'zdan <span className="font-semibold text-gray-800">{correctCount}</span> tasini to'g'ri topding
        </p>
          <div className="flex items-center gap-3 mb-8">
          <div className="card text-center px-4 sm:px-8 py-4">
            <p className="text-2xl sm:text-3xl font-bold text-b1-600">{pct}%</p>
            <p className="text-xs text-gray-500 mt-0.5">To'g'ri</p>
          </div>
          <div className="card text-center px-4 sm:px-8 py-4">
            <p className="text-2xl sm:text-3xl font-bold text-primary-600">{correctCount * 5}</p>
            <p className="text-xs text-gray-500 mt-0.5">XP</p>
          </div>
        </div>
        {isLastBatch ? (
          <button onClick={handleBatchComplete} className="btn-primary flex items-center gap-2">
            <CheckCircle size={16} /> Yakunlash
          </button>
        ) : (
          <button
            onClick={() => selectBatch(currentBatch + 1)}
            className="btn-primary flex items-center gap-2"
          >
            Keyingi batch <ArrowLeft size={16} className="rotate-180" />
          </button>
        )}
      </div>
    )
  }

  // ── FlashCard view ─────────────────────────────────────────

  if (viewMode === 'flashcard' && currentWord) {
    return (
      <div className="p-3 sm:p-6 max-w-lg mx-auto select-none">
        <div className="flex items-center justify-between mb-4">
          <button onClick={goToCatalog} className="btn-ghost text-sm px-2 py-1">
            ← Chiqish
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500">{currentIdx + 1} / {batchWords.length}</span>
            <div className="w-28 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-b1-500 rounded-full transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / batchWords.length) * 100}%` }}
              />
            </div>
          </div>
        </div>

        <FlashCardRenderer
          word={currentWord}
          onRate={async (wordId, rating) => {
            const word = batchWords.find((w) => w.word_id === wordId)
            if (!word) return
            rateWord(wordId, rating)
            await saveProgressToDB(wordId, rating, word.box)
            // Yodladim → progressni darhol yangilash
            if (rating === 'yodladim') {
              addLearnedWords(1)
              addXP(5)
              setLearnedCounts((prev) => {
                const next = new Map(prev)
                next.set(word.level, (next.get(word.level) ?? 0) + 1)
                return next
              })
            }
            const answered = useVocabStore.getState().totalAnswered + 1
            updateSkillProgress('todayVocabPct', Math.round((answered / Math.max(batchWords.length, 1)) * 100))
            if (currentIdx + 1 >= batchWords.length) {
              const { data: { session } } = await supabase.auth.getSession()
              if (session?.user?.id) {
                const uid = session.user.id
                await saveBatchSession(uid)
      const tk = getTodayTashkent().split('-').map(Number)
      reloadMonthSessions(uid, tk[0], tk[1] - 1)
              }
              finishBatch()
            } else {
              nextWord()
            }
          }}
        />
      </div>
    )
  }

  // ── Test view ──────────────────────────────────────────────

  if (viewMode === 'test' && currentWord) {
    return (
      <div className="p-3 sm:p-6 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button onClick={goToCatalog} className="btn-ghost text-sm px-2 py-1">
            ← Chiqish
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500">{currentIdx + 1} / {batchWords.length}</span>
            <div className="w-28 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-b1-500 rounded-full transition-all duration-300"
                style={{ width: `${((currentIdx + 1) / batchWords.length) * 100}%` }}
              />
            </div>
          </div>
        </div>
        <WordTest
          word={currentWord}
          allWords={dailyWords}
          onAnswer={handleTestAnswer}
        />
      </div>
    )
  }

  // ── Game view ──────────────────────────────────────────────

  if (viewMode === 'game') {
    return (
      <div className="p-3 sm:p-6 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button onClick={goToCatalog} className="btn-ghost text-sm px-2 py-1">
            ← Chiqish
          </button>
          <span className="text-sm font-medium text-gray-500">{currentBatch}-Batch</span>
        </div>
        <WordGame
          words={batchWords}
          onComplete={handleGameComplete}
          onMatch={(wordId, correct) => {
            const store = useVocabStore.getState()
            store.batchResults[wordId] = correct ? 'bildim' : 'bilmadim'
          }}
        />
      </div>
    )
  }

  // ── Typing Game view ──────────────────────────────────────────

  if (showTypingGame) {
    return (
      <div className="p-3 sm:p-6 max-w-2xl mx-auto">
        <VocabTypingGame onClose={() => setShowTypingGame(false)} />
      </div>
    )
  }

  // ── Catalog (default) view ─────────────────────────────────

  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-b1-100 rounded-xl flex items-center justify-center">
            <BookMarked size={20} className="text-b1-600" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Vocabulary</h1>
            <p className="text-xs text-gray-500">SRS Spaced Repetition</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowTypingGame(true)}
            className="btn-secondary text-xs flex items-center gap-1.5 px-3 py-2 transition-all"
          >
            🎮 O'yin
          </button>
          <button
            onClick={() => {
              setShowCalendar(!showCalendar)
              if (showCalendar) setSelectedDate(getTodayTashkent())
            }}
            className={`btn-secondary text-xs flex items-center gap-1.5 px-3 py-2 transition-all ${showCalendar ? 'ring-2 ring-b1-500 border-b1-500' : ''}`}
          >
            <CalendarDays size={13} /> Kalendar
          </button>
          <button onClick={() => loadDailyData()} className="btn-secondary text-xs flex items-center gap-1.5 px-3 py-2">
            <RotateCcw size={13} /> Yangilash
          </button>
        </div>
      </div>

      <VocabProgress
        stats={levelStats}
        totalLearned={totalLearned}
        totalWords={levelStats.reduce((a, s) => a + s.total, 0)}
        dueCount={dueCount}
        streak={useStore.getState().streak}
      />

      {showCalendar ? (
        <div className="mt-4">
          <VocabCalendar
            sessions={monthSessions}
            selectedDate={selectedDate}
            onDateSelect={setSelectedDate}
            onContinue={() => {
              setShowCalendar(false)
              setStudyDate(selectedDate)
              loadDailyData(selectedDate)
              selectBatch(1)
              setTimeout(() => enterStudyMode('flashcard'), 0)
            }}
            onClose={() => {
              const today = getTodayTashkent()
              setShowCalendar(false)
              setSelectedDate(today)
              setStudyDate(today)
              loadDailyData(today)
            }}
          />
        </div>
      ) : (
        <>
          {/* Start button */}
          {batchWords.length > 0 && (
              <button
                onClick={() => {
                  selectBatch(1)
                  setTimeout(() => enterStudyMode('flashcard'), 0)
                }}
                className="w-full mt-4 py-4 bg-gradient-to-r from-b1-500 to-b1-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl hover:from-b1-600 hover:to-b1-700 transition-all flex items-center justify-center gap-3"
              >
                <span className="text-2xl">🚀</span>
                Bugungi so'zlarni boshlash
                <span className="text-sm opacity-75">({batchWords.filter(w => !w.is_learned).length} ta)</span>
              </button>
          )}

          {/* ── Takrorlash bo'limi ── */}
          {reviewWords.length > 0 && (
            <div className="mt-4 rounded-2xl border border-orange-200 bg-orange-50 p-4">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold text-orange-700 flex items-center gap-1.5">
                    <span>🔄</span> Takrorlash vaqti keldi
                  </p>
                  <p className="text-xs text-orange-600 mt-0.5">
                    {reviewWords.length} ta so'z takrorlanishi kerak
                  </p>
                </div>
                <button
                  onClick={() => {
                    selectReview()
                    setTimeout(() => enterStudyMode('flashcard'), 0)
                  }}
                  className="shrink-0 px-4 py-2 bg-orange-500 text-white font-bold rounded-xl text-sm hover:bg-orange-600 transition-all"
                >
                  Boshlash
                </button>
              </div>
              <div className="mt-3 grid grid-cols-3 gap-2 text-center">
                {[
                  { label: 'Box 1–2', count: reviewWords.filter(w => w.box <= 2).length, color: 'text-red-500' },
                  { label: 'Box 3–4', count: reviewWords.filter(w => w.box === 3 || w.box === 4).length, color: 'text-yellow-600' },
                  { label: 'Box 5–6', count: reviewWords.filter(w => w.box >= 5).length, color: 'text-green-600' },
                ].map(({ label, count, color }) => (
                  <div key={label} className="bg-white rounded-xl py-2">
                    <p className={`text-sm font-bold ${color}`}>{count}</p>
                    <p className="text-[10px] text-gray-400">{label}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Batch tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
            {[0, 1, 2, 3].map((i) => {
              const batchNum = i + 1
              const startNum = wordOffset + i * BATCH_SIZE + 1
              const endNum = wordOffset + (i + 1) * BATCH_SIZE
              const batchWordsSlice = getBatchWords(dailyWords, batchNum)
              const isCurrent = currentBatch === batchNum
              return (
                <button
                  key={batchNum}
                  onClick={() => selectBatch(batchNum)}
                  className={`card py-3 text-center transition-all ${
                    isCurrent ? 'ring-2 ring-b1-500 border-b1-500' : ''
                  } ${batchWordsSlice.length === 0 ? 'opacity-40' : ''}`}
                >
                  <p className={`text-sm font-bold ${isCurrent ? 'text-b1-600' : 'text-gray-700'}`}>
                    {batchNum}
                  </p>
                  <p className="text-[10px] text-gray-400">{startNum}-{endNum}</p>
                  <p className="text-[10px] font-medium text-b1-500 mt-0.5">
                    {batchWordsSlice.filter((w) => !w.is_new && !w.is_learned).length} takror
                    {batchWordsSlice.filter((w) => w.is_learned).length > 0 && (
                      <> · {batchWordsSlice.filter((w) => w.is_learned).length} yodlangan</>
                    )}
                  </p>
                </button>
              )
            })}
          </div>

          {/* Phase navigation */}
          {batchWords.length > 0 && (
            <div className="mt-4 space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {currentBatch}-Batch · {batchWords.length} ta so'z
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {([
                  { mode: 'flashcard' as const, label: 'FlashCard', icon: '🃏', desc: 'Ko\'rish' },
                  { mode: 'test' as const, label: 'Test', icon: '📝', desc: 'Topshiriq' },
                  { mode: 'game' as const, label: 'O\'yin', icon: '🎮', desc: 'Mustahkamlash' },
                ]).map((phase) => (
                  <button
                    key={phase.mode}
                    onClick={() => enterStudyMode(phase.mode)}
                    className="card py-4 text-center hover:shadow-sm hover:border-b1-200 transition-all"
                  >
                    <span className="text-2xl">{phase.icon}</span>
                    <p className="text-sm font-semibold text-gray-800 mt-1">{phase.label}</p>
                    <p className="text-[10px] text-gray-400">{phase.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Word list for current batch */}
          <div className="mt-4 space-y-1">
            <p className="text-xs text-gray-400 mb-2">
              {batchWords.filter((w) => w.is_new).length} ta yangi
              {batchWords.filter((w) => !w.is_new && !w.is_learned).length > 0 && (
                <> · {batchWords.filter((w) => !w.is_new && !w.is_learned).length} ta takror</>
              )}
              {batchWords.filter((w) => w.is_learned).length > 0 && (
                <> · {batchWords.filter((w) => w.is_learned).length} ta yodlangan</>
              )}
            </p>
            {batchWords.map((w, idx) => (
              <div
                key={w.word_id}
                className="card flex items-center justify-between py-2.5 px-4"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <span className="text-[10px] font-mono text-gray-300 w-5 text-right shrink-0">
                    {(currentBatch - 1) * BATCH_SIZE + idx + 1}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-gray-900 text-sm truncate flex items-center gap-1">
                      {w.english}
                      {w.is_learned && <span className="text-yellow-500 text-xs">⭐</span>}
                    </p>
                    <p className="text-xs text-gray-400 truncate">{w.uzbek}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0 ml-2">
                  {/* Status badges */}
                  <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                    w.is_learned ? 'bg-yellow-50 text-yellow-700' :
                    w.level === 'A1' ? 'bg-gray-100 text-gray-500' :
                    w.level === 'A2' ? 'bg-primary-50 text-primary-600' :
                    w.level === 'B1' ? 'bg-b1-50 text-b1-600' :
                    'bg-b2-50 text-b2-600'
                  }`}>
                    {w.is_learned ? '⭐ Yodlagan' : w.level}
                  </span>
                  {!w.is_learned && (
                    <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded ${
                      w.is_new ? 'bg-gray-50 text-gray-400' : 'bg-orange-50 text-orange-600'
                    }`}>
                      {w.is_new ? 'Yangi' : `Box ${w.box}`}
                    </span>
                  )}

                  {/* Quick rating buttons - always visible */}
                  <div className="relative flex items-center gap-1 sm:gap-0.5 ml-1 sm:ml-1.5 border-l border-gray-200 pl-1 sm:pl-1.5">
                    {ratingFlash?.wordId === w.word_id && (
                      <span className="absolute -top-4 right-0 text-[10px] font-semibold whitespace-nowrap animate-bounce text-green-600">
                        {ratingFlash.rating === 'yodladim' ? '⭐' : ratingFlash.rating === 'bildim' ? '😊' : ratingFlash.rating === 'qiynaldim' ? '🤔' : '😕'}
                      </span>
                    )}
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        rateWord(w.word_id, 'yodladim')
                        saveProgressToDB(w.word_id, 'yodladim', w.box)
                        setRatingFlash({ wordId: w.word_id, rating: 'yodladim' })
                        setTimeout(() => setRatingFlash(null), 500)
                      }}
                      className={`w-6 h-6 sm:w-5 sm:h-5 flex items-center justify-center rounded text-xs sm:text-xs transition-all active:scale-90 ${
                        w.last_rating === 'yodladim' ? 'scale-110 ring-2 ring-yellow-400 bg-yellow-100' : 'hover:bg-yellow-100 hover:scale-110'
                      }`}
                      title="Yodladim"
                    >⭐</button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        rateWord(w.word_id, 'bildim')
                        saveProgressToDB(w.word_id, 'bildim', w.box)
                        setRatingFlash({ wordId: w.word_id, rating: 'bildim' })
                        setTimeout(() => setRatingFlash(null), 500)
                      }}
                      className={`w-6 h-6 sm:w-5 sm:h-5 flex items-center justify-center rounded text-xs sm:text-xs transition-all active:scale-90 ${
                        w.last_rating === 'bildim' ? 'scale-110 ring-2 ring-green-400 bg-green-100' : 'hover:bg-green-100 hover:scale-110'
                      }`}
                      title="Bildim"
                    >😊</button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        rateWord(w.word_id, 'qiynaldim')
                        saveProgressToDB(w.word_id, 'qiynaldim', w.box)
                        setRatingFlash({ wordId: w.word_id, rating: 'qiynaldim' })
                        setTimeout(() => setRatingFlash(null), 500)
                      }}
                      className={`w-6 h-6 sm:w-5 sm:h-5 flex items-center justify-center rounded text-xs sm:text-xs transition-all active:scale-90 ${
                        w.last_rating === 'qiynaldim' ? 'scale-110 ring-2 ring-orange-400 bg-orange-100' : 'hover:bg-orange-100 hover:scale-110'
                      }`}
                      title="Qiynaldim"
                    >🤔</button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        rateWord(w.word_id, 'bilmadim')
                        saveProgressToDB(w.word_id, 'bilmadim', w.box)
                        setRatingFlash({ wordId: w.word_id, rating: 'bilmadim' })
                        setTimeout(() => setRatingFlash(null), 500)
                      }}
                      className={`w-6 h-6 sm:w-5 sm:h-5 flex items-center justify-center rounded text-xs sm:text-xs transition-all active:scale-90 ${
                        w.last_rating === 'bilmadim' ? 'scale-110 ring-2 ring-red-400 bg-red-100' : 'hover:bg-red-100 hover:scale-110'
                      }`}
                      title="Bilmadim"
                    >😕</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

    </div>
  )
}

// ── FlashCard renderer with rating buttons ───────────────────

const FC_RATINGS: { key: Rating; label: string; emoji: string; color: string; bg: string }[] = [
  { key: 'yodladim',  label: 'Yodladim',  emoji: '⭐', color: 'text-yellow-600', bg: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-300' },
  { key: 'bildim',    label: 'Bildim',    emoji: '😊', color: 'text-green-600', bg: 'bg-green-50 hover:bg-green-100 border-green-200' },
  { key: 'qiynaldim', label: 'Qiynaldim', emoji: '🤔', color: 'text-orange-600', bg: 'bg-orange-50 hover:bg-orange-100 border-orange-200' },
  { key: 'bilmadim',  label: 'Bilmadim',  emoji: '😕', color: 'text-red-600', bg: 'bg-red-50 hover:bg-red-100 border-red-200' },
]

function FlashCardRenderer({
  word,
  onRate,
}: {
  word: GameWord
  onRate: (wordId: number, rating: Rating) => void
}) {
  const [flipped, setFlipped] = useState(false)

  useEffect(() => {
    setFlipped(false)
  }, [word.word_id])

  return (
    <div>
      <FlashCard word={word} flipped={flipped} onFlip={() => setFlipped(true)} />

      <div className="mt-4 flex gap-2">
        {FC_RATINGS.map(({ key, ...cfg }) => (
          <button
            key={key}
            onClick={() => onRate(word.word_id, key)}
            className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-medium transition-all ${cfg.bg} ${cfg.color}`}
          >
            <span className="text-lg">{cfg.emoji}</span>
            <span className="font-semibold">{cfg.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}
