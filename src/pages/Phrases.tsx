import { useState, useEffect, useMemo, useRef, lazy, Suspense } from 'react'
import { BookText, RotateCcw, CheckCircle, ArrowRight, CalendarDays, BarChart3, Download, Search, Filter } from 'lucide-react'
import { useI18n } from '../i18n'
import { DictionarySkeleton } from '../components/ui/PageSkeleton'
import { SkeletonCard } from '../components/ui/Skeleton'
import { supabase } from '../lib/supabase'
import { monitoring } from '../lib/monitoring'
import { useStore } from '../store/useStore'
import { usePhrasesStore, getBatchPhrases, type GamePhrase, type PhraseViewMode } from '../store/phrasesStore'
import {
  savePhraseSession,
  fetchMonthPhraseSessions,
  type PhraseRating,
  type DailyPhraseRow,
  type DaySession,
} from '../services/phrasesService'
import { getCachedLevelTotals } from '../services/vocabularyService'
import { getTodayTashkent } from '../utils/tashkentDate'
import PhraseFlashCard from '../components/phrases/PhraseFlashCard'
import PhraseTest from '../components/phrases/PhraseTest'
import PhraseProgress from '../components/phrases/PhraseProgress'
import PhraseCalendar from '../components/phrases/PhraseCalendar'
import PhraseTypingGame from '../components/phrases/PhraseTypingGame'
import PhraseScrambleGame from '../components/phrases/PhraseScrambleGame'
import PhraseRow from '../components/phrases/PhraseRow'
import PhraseExportModal from '../components/phrases/PhraseExportModal'
import { useToastStore } from '../utils/toastStore'
import { PHRASE_BATCH_SIZE, PHRASES_PER_DAY } from '../utils/phraseConfig'
const PhraseAnalytics = lazy(() => import('../components/phrases/PhraseAnalytics'))

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2']

export default function Phrases() {
  const { t } = useI18n()
  const { addXP, addLearnedWords, updateSkillProgress, toggleChecklistItem } = useStore()
  const {
    dailyPhrases, reviewPhrases, currentBatch, batchPhrases, currentIdx, viewMode,
    loading, correctCount,
    setDailyPhrases, setReviewPhrases, setLoading,
    selectBatch, selectReview, nextPhrase, ratePhrase, finishBatch, reset,
  } = usePhrasesStore()

  const learnedTransitioned = useRef<Set<number>>(new Set())
  const pendingSavesRef = useRef<Set<Promise<void>>>(new Set())
  const [sessionStart, setSessionStart] = useState<number>(0)
  const todayStr = getTodayTashkent()
  const [studyDate, setStudyDate] = useState(todayStr)

  const [selectedDate, setSelectedDate] = useState(todayStr)
  const [userId, setUserId] = useState<string | null>(null)
  const [showCalendar, setShowCalendar] = useState(false)
  const [showAnalytics, setShowAnalytics] = useState(false)
  const [showTypingGame, setShowTypingGame] = useState(false)
  const [showScrambleGame, setShowScrambleGame] = useState(false)
  const [monthSessions, setMonthSessions] = useState<Map<string, DaySession>>(new Map())
  const [showExportModal, setShowExportModal] = useState(false)

  const [filterText, setFilterText] = useState('')
  const [filterLevel, setFilterLevel] = useState<Set<string>>(new Set())
  const [filterMastery, setFilterMastery] = useState<'all' | 'new' | 'learning' | 'learned'>('all')
  const [showFilters, setShowFilters] = useState(false)

  const filteredBatchPhrases = useMemo(() => {
    let result = batchPhrases
    if (filterText.trim()) {
      const q = filterText.trim().toLowerCase()
      result = result.filter(p =>
        p.english.toLowerCase().includes(q) ||
        p.uzbek.toLowerCase().includes(q)
      )
    }
    if (filterLevel.size > 0) {
      result = result.filter(p => filterLevel.has(p.level))
    }
    switch (filterMastery) {
      case 'new':
        result = result.filter(p => p.is_new)
        break
      case 'learning':
        result = result.filter(p => !p.is_new && !p.is_learned)
        break
      case 'learned':
        result = result.filter(p => p.is_learned)
        break
    }
    return result
  }, [batchPhrases, filterText, filterLevel, filterMastery])

  useEffect(() => {
    const today = getTodayTashkent()
    setStudyDate(today)
    setSelectedDate(today)
    loadDailyData(today)
    return () => { reset() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studyDate])

  const [levelCounts, setLevelCounts] = useState<Map<string, number>>(new Map())
  const [learnedCounts, setLearnedCounts] = useState<Map<string, number>>(new Map())

  function handleRating(phraseId: number, rating: PhraseRating) {
    const srsRate = ratePhrase(phraseId, rating)
    const p = savePhraseProgressToDB(phraseId, rating, { box: srsRate.newBox, next_review: srsRate.nextReview, is_learned: srsRate.isLearned })
    pendingSavesRef.current.add(p); p.finally(() => pendingSavesRef.current.delete(p))
  }

  function reloadMonthSessions(uid: string, year: number, month: number) {
    fetchMonthPhraseSessions(uid, year, month).then(setMonthSessions)
  }

  async function loadDailyData(targetDate?: string) {
    setLoading(true)
    if (pendingSavesRef.current.size > 0) {
      await Promise.allSettled([...pendingSavesRef.current])
    }
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const uid = session?.user?.id
      if (!uid) { setLoading(false); return }
      setUserId(uid)
      const target = targetDate ?? getTodayTashkent()
      const tk = target.split('-').map(Number)
      reloadMonthSessions(uid, tk[0], tk[1] - 1)

      // ── PARALLEL (faza A): faqat uid ga bog'liq mustaqil so'rovlar BIRGA ──
      const [allPhraseProgressRes, totals, reviewProgressRes, studiedRowsRes] = await Promise.all([
        supabase.from('phrase_progress').select('phrase_id').eq('user_id', uid),
        getCachedLevelTotals('phrases', LEVEL_ORDER),
        supabase.from('phrase_progress')
          .select('phrase_id, box, next_review, correct_count, wrong_count, is_learned, last_rating')
          .eq('user_id', uid).lte('next_review', target).eq('is_learned', false),
        supabase.from('phrase_progress').select('phrase_id, phrases(level)').eq('user_id', uid),
      ])

      const studiedPhraseSet = new Set((allPhraseProgressRes.data ?? []).map(p => p.phrase_id))
      const phraseSetCounts = new Map<number, number>()
      for (const pid of studiedPhraseSet) {
        const sn = Math.floor((pid - 1) / PHRASES_PER_DAY)
        phraseSetCounts.set(sn, (phraseSetCounts.get(sn) ?? 0) + 1)
      }
      let completedPhraseSets = 0
      for (const [sn, cnt] of phraseSetCounts) {
        if (cnt >= PHRASES_PER_DAY) completedPhraseSets = Math.max(completedPhraseSets, sn + 1)
      }
      const totalsMap = new Map<string, number>(LEVEL_ORDER.map(l => [l, totals[l] ?? 0]))

      // ── 2. O'rganilmagan iboralarni yig'ish (PHRASES_PER_DAY tagacha) ──
      interface PhraseRow { id: number; english: string; uzbek: string; level: string; category: string | null }
      const dailyPhraseRows: PhraseRow[] = []
      let setNum = completedPhraseSets
      while (dailyPhraseRows.length < PHRASES_PER_DAY) {
        const off = setNum * PHRASES_PER_DAY
        const { data: rows, error: pe } = await supabase
          .from('phrases')
          .select('id, english, uzbek, level, category')
          .order('level', { ascending: true })
          .order('id', { ascending: true })
          .range(off, off + PHRASES_PER_DAY - 1)
        if (pe) monitoring.captureMessage(`phrases query error: ${pe.message}`, 'error')
        if (!rows || rows.length === 0) break
        const unstudied = rows.filter(p => !studiedPhraseSet.has(p.id))
        const need = PHRASES_PER_DAY - dailyPhraseRows.length
        dailyPhraseRows.push(...unstudied.slice(0, need))
        setNum++
      }

      // reviewProgress faza A da olingan
      const reviewProgress = reviewProgressRes.data
      const dailyIds = dailyPhraseRows.map(p => p.id)
      const reviewCandidates = (reviewProgress ?? []).filter(r => !dailyIds.includes(r.phrase_id))
      const reviewIds = reviewCandidates.map(r => r.phrase_id)

      // ── PARALLEL (faza C): kunlik iboralar progressi + takror iboralar matni ──
      const [dailyProgressRes, reviewPhraseRes] = await Promise.all([
        dailyIds.length > 0
          ? supabase.from('phrase_progress')
              .select('phrase_id, box, next_review, correct_count, wrong_count, is_learned, last_rating')
              .eq('user_id', uid).in('phrase_id', dailyIds)
          : Promise.resolve({ data: [] as typeof reviewProgress }),
        reviewIds.length > 0
          ? supabase.from('phrases').select('id, english, uzbek, level, category').in('id', reviewIds)
          : Promise.resolve({ data: [] as { id: number; english: string; uzbek: string; level: string; category: string | null }[] }),
      ])
      const progressByPhrase = new Map((dailyProgressRes.data ?? []).map(p => [p.phrase_id, p]))
      const reviewPhrasesMap = new Map((reviewPhraseRes.data ?? []).map(p => [p.id, p]))

      const todayPhrases: DailyPhraseRow[] = dailyPhraseRows.map(p => {
        const prog = progressByPhrase.get(p.id)
        return {
          phrase_id: p.id, english: p.english, uzbek: p.uzbek,
          level: p.level as DailyPhraseRow['level'], category: p.category as DailyPhraseRow['category'],
          box: prog?.box ?? 1, next_review: prog?.next_review ?? target,
          correct_count: prog?.correct_count ?? 0, wrong_count: prog?.wrong_count ?? 0,
          is_new: !prog, is_learned: prog?.is_learned ?? false,
          last_rating: prog?.last_rating ?? undefined,
        }
      })

      const reviewDuePhrases: DailyPhraseRow[] = reviewCandidates
        .map(prog => {
          const p = reviewPhrasesMap.get(prog.phrase_id)
          if (!p) return null
          return {
            phrase_id: p.id, english: p.english, uzbek: p.uzbek,
            level: p.level, category: p.category,
            box: prog.box, next_review: prog.next_review,
            correct_count: prog.correct_count, wrong_count: prog.wrong_count,
            is_new: false, is_learned: prog.is_learned,
            last_rating: prog.last_rating,
          } as DailyPhraseRow
        })
        .filter((r): r is DailyPhraseRow => r !== null)
        .sort((a, b) => a.next_review.localeCompare(b.next_review) || a.box - b.box)

      // studiedRows faza A da olingan
      const studiedRows = studiedRowsRes.data
      const learnedCountsMap = new Map<string, number>()
      const studied = (studiedRows ?? []) as unknown as { phrase_id: string; phrases: { level: string } | null }[]
      for (const row of studied) {
        const lvl = row.phrases?.level
        if (typeof lvl === 'string') {
          learnedCountsMap.set(lvl, (learnedCountsMap.get(lvl) ?? 0) + 1)
        }
      }

      learnedTransitioned.current.clear()
      setDailyPhrases(todayPhrases)
      setReviewPhrases(reviewDuePhrases)
      setLevelCounts(totalsMap)
      setLearnedCounts(learnedCountsMap)
      setSessionStart(Date.now())
    } catch (e) {
      monitoring.captureMessage('loadPhraseData error: ' + (e instanceof Error ? e.message : String(e)), 'error')
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
  const dueTodayCount = dailyPhrases.filter((p) => !p.is_new && !p.is_learned && p.next_review <= todayStr).length
  const dueCount = dueTodayCount + reviewPhrases.length

  const currentPhrase = batchPhrases[currentIdx]

  function goToCatalog() {
    const s = usePhrasesStore.getState()
    usePhrasesStore.setState({
      viewMode: 'catalog',
      batchPhrases: getBatchPhrases(s.dailyPhrases, s.currentBatch),
      currentIdx: 0,
      correctCount: 0,
      totalAnswered: 0,
      batchResults: {},
    })
  }

  function enterStudyMode(mode: PhraseViewMode) {
    const s = usePhrasesStore.getState()
    const base = s.currentBatch === 0
      ? s.batchPhrases
      : s.batchPhrases.filter(p => !p.is_learned)
    if (base.length === 0) return
    const studyPhrases = [...base].sort(() => Math.random() - 0.5)
    usePhrasesStore.setState({
      viewMode: mode,
      batchPhrases: studyPhrases,
      currentIdx: 0,
      correctCount: 0,
      totalAnswered: 0,
      batchResults: {},
    })
  }

  async function savePhraseProgressToDB(
    phraseId: number,
    rating: PhraseRating,
    srsResult: { box: number; next_review: string; is_learned: boolean }
  ) {
    const { data: { session } } = await supabase.auth.getSession()
    const uid = session?.user?.id
    if (!uid) { monitoring.captureMessage('savePhraseProgressToDB: no uid', 'warn'); return }

    const store = usePhrasesStore.getState()
    const sp = [...store.dailyPhrases, ...store.reviewPhrases].find((d) => d.phrase_id === phraseId)
    const newCorrect = sp?.correct_count ?? 0
    const newWrong = sp?.wrong_count ?? 0

    const renderPhrases = [...dailyPhrases, ...reviewPhrases]
    const p = renderPhrases.find((d) => d.phrase_id === phraseId)

    const { error } = await supabase.from('phrase_progress').upsert({
      user_id: uid,
      phrase_id: phraseId,
      box: srsResult.box,
      next_review: srsResult.next_review,
      correct_count: newCorrect,
      wrong_count: newWrong,
      is_learned: srsResult.is_learned,
      last_rating: rating,
      last_reviewed: new Date().toISOString(),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any, { onConflict: 'user_id,phrase_id' })

    if (error) {
      monitoring.captureMessage('savePhraseProgressToDB upsert error: ' + error.message, 'error')
      useToastStore.getState().toast('Natijani saqlashda xatolik', 'error')
      return
    }

    if (p) {
      if (srsResult.is_learned && !p.is_learned) {
        if (!learnedTransitioned.current.has(phraseId)) {
          learnedTransitioned.current.add(phraseId)
          addLearnedWords(1)
          addXP(5)
          setLearnedCounts((prev) => {
            const next = new Map(prev)
            next.set(p.level, (next.get(p.level) ?? 0) + 1)
            return next
          })
        }
      } else if (!srsResult.is_learned && p.is_learned) {
        learnedTransitioned.current.delete(phraseId)
        setLearnedCounts((prev) => {
          const next = new Map(prev)
          next.set(p.level, Math.max(0, (next.get(p.level) ?? 0) - 1))
          return next
        })
      }
    }
  }

  async function saveBatchSession(uid: string) {
    const batch = currentBatch
    if (batch <= 0 || batch > 3) return
    const allPhrases = dailyPhrases.slice((batch - 1) * PHRASE_BATCH_SIZE, batch * PHRASE_BATCH_SIZE)
    const phrasesJson: Record<string, PhraseRating> = {}
    allPhrases.forEach((p) => {
      const result = usePhrasesStore.getState().batchResults[p.phrase_id]
      if (result) phrasesJson[p.phrase_id.toString()] = result
    })
    const score = usePhrasesStore.getState().correctCount
    const time = Math.round((Date.now() - sessionStart) / 1000)
    await savePhraseSession(uid, batch, phrasesJson, score, time, selectedDate)
  }

  async function handleTestAnswer(correct: boolean) {
    if (correct) addXP(2)
    const phrase = batchPhrases[currentIdx]
    if (phrase) {
      const rating: PhraseRating = !correct ? 'bilmadim' : (phrase.last_rating === 'yodladim' ? 'yodladim' : 'bildim')
      const srs = ratePhrase(phrase.phrase_id, rating)
      await savePhraseProgressToDB(phrase.phrase_id, rating, { box: srs.newBox, next_review: srs.nextReview, is_learned: srs.isLearned })
    }
    const answeredSoFar = usePhrasesStore.getState().totalAnswered + 1
    updateSkillProgress('todayPhrasesPct', Math.round((answeredSoFar / Math.max(batchPhrases.length, 1)) * 100))
  }

  async function handleTestAdvance() {
    const totalInBatch = batchPhrases.length
    if (usePhrasesStore.getState().currentIdx + 1 >= totalInBatch) {
      const { data: { session } } = await supabase.auth.getSession()
      if (session?.user?.id) {
        const uid = session.user.id
        await saveBatchSession(uid)
        reloadMonthSessions(uid, new Date().getFullYear(), new Date().getMonth())
      }
      finishBatch()
    } else {
      nextPhrase()
    }
  }

  async function handleGameComplete(score: number, total: number) {
    addXP(score * 3)
    updateSkillProgress('todayPhrasesPct', Math.round((score / total) * 100))
    usePhrasesStore.setState({ correctCount: score, totalAnswered: total })
    const { data: { session } } = await supabase.auth.getSession()
    const uid = session?.user?.id
    if (uid) {
      for (const p of batchPhrases.slice(0, total)) {
        const rating: PhraseRating = p.last_rating === 'yodladim' ? 'yodladim' : 'bildim'
        const srs = ratePhrase(p.phrase_id, rating)
        await savePhraseProgressToDB(p.phrase_id, rating, { box: srs.newBox, next_review: srs.nextReview, is_learned: srs.isLearned })
      }
      await saveBatchSession(uid)
      reloadMonthSessions(uid, new Date().getFullYear(), new Date().getMonth())
    }
    finishBatch()
  }

  function handleBatchComplete() {
    toggleChecklistItem('phrases')
    const today = getTodayTashkent()
    setStudyDate(today)
    setSelectedDate(today)
    loadDailyData(today)
  }

  if (loading) {
    return (
      <div className="p-3 sm:p-6 max-w-2xl mx-auto">
        <DictionarySkeleton />
      </div>
    )
  }

  if (dailyPhrases.length === 0 && !loading) {
    const hasPhrasesInDB = levelStats.some((s) => s.total > 0)
    return (
      <div className="p-3 sm:p-6 max-w-2xl mx-auto">
        <PhraseProgress
          stats={levelStats}
          totalLearned={totalLearned}
          totalPhrases={levelStats.reduce((a, s) => a + s.total, 0)}
          dueCount={dueCount}
          streak={useStore.getState().streak}
        />
        <div className="mt-6 flex flex-col items-center gap-4 py-16 text-center">
          {hasPhrasesInDB ? (
            <>
              <div className="text-6xl mb-2">🎉</div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">{t('phrases.emptyTitleToday')}</h2>
              <p className="text-sm text-gray-500 max-w-xs">
                {t('phrases.emptyDescToday')}
              </p>
            </>
          ) : (
            <>
              <div className="text-6xl mb-2">📚</div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-900">{t('phrases.emptyTitleEmpty')}</h2>
              <p className="text-sm text-gray-500 max-w-xs">
                {t('phrases.emptyDescEmpty')}
              </p>
              <code className="bg-gray-100 px-3 py-2 rounded-lg text-sm font-mono text-gray-700">
                npx tsx scripts/seed-phrases.ts
              </code>
            </>
          )}
          <button onClick={() => loadDailyData()} className="mt-4 py-4 px-10 bg-gradient-to-r from-b1-500 to-b1-600 text-white font-bold text-lg rounded-2xl shadow-lg hover:shadow-xl transition-all flex items-center gap-3">
            <RotateCcw size={20} /> {t('phrases.emptyRefresh')}
          </button>
        </div>
      </div>
    )
  }

  if (viewMode === 'complete') {
    const pct = batchPhrases.length > 0 ? Math.round((correctCount / batchPhrases.length) * 100) : 0
    const isReviewMode = currentBatch === 0
    const isLastBatch = isReviewMode || currentBatch >= 3
    return (
      <div className="p-3 sm:p-6 max-w-md mx-auto flex flex-col items-center justify-center min-h-[60vh] text-center">
        <div className="text-6xl mb-4">{pct >= 80 ? '🏆' : pct >= 50 ? '👍' : '💪'}</div>          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-1">
            {isReviewMode ? t('phrases.completeTitleReview') : isLastBatch ? t('phrases.completeTitleDone') : t('phrases.completeTitleBatch', { batch: String(currentBatch) })}
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            {t('phrases.completeDesc', { total: String(batchPhrases.length), correct: String(correctCount) })}
          </p>
        <div className="flex items-center gap-3 mb-8">
          <div className="card text-center px-4 sm:px-8 py-4">
            <p className="text-2xl sm:text-3xl font-bold text-b1-600">{pct}%</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('phrases.completeCorrect')}</p>
          </div>
          <div className="card text-center px-4 sm:px-8 py-4">
            <p className="text-2xl sm:text-3xl font-bold text-primary-600">{correctCount * 5}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{t('phrases.completeXP')}</p>
          </div>
        </div>
        {isLastBatch ? (
          <button onClick={handleBatchComplete} className="btn-primary flex items-center gap-2">
            <CheckCircle size={16} /> {t('phrases.completeFinish')}
          </button>
        ) : (
          <button onClick={() => selectBatch(currentBatch + 1)} className="btn-primary flex items-center gap-2">
            {t('phrases.completeNextBatch')} <ArrowRight size={16} className="inline" />
          </button>
        )}
      </div>
    )
  }

  if (viewMode === 'flashcard' && currentPhrase) {
    return (
      <div className="p-3 sm:p-6 max-w-lg mx-auto select-none">
        <div className="flex items-center justify-between mb-4">
          <button onClick={goToCatalog} className="btn-ghost text-sm px-2 py-1">{t('phrases.flashcardExit')}</button>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500">{currentIdx + 1} / {batchPhrases.length}</span>
            <div className="w-28 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-b1-500 rounded-full transition-all duration-300" style={{ width: `${((currentIdx + 1) / batchPhrases.length) * 100}%` }} />
            </div>
          </div>
        </div>
        <PhraseFlashCardRenderer
          phrase={currentPhrase}
          onRate={async (phraseId, rating) => {
            const srs = ratePhrase(phraseId, rating)
            await savePhraseProgressToDB(phraseId, rating, { box: srs.newBox, next_review: srs.nextReview, is_learned: srs.isLearned })
            const answered = usePhrasesStore.getState().totalAnswered + 1
            updateSkillProgress('todayPhrasesPct', Math.round((answered / Math.max(batchPhrases.length, 1)) * 100))
          }}
          onAdvance={async () => {
            if (currentIdx + 1 >= batchPhrases.length) {
              const { data: { session } } = await supabase.auth.getSession()
              if (session?.user?.id) {
                const uid = session.user.id
                await saveBatchSession(uid)
                const tk = getTodayTashkent().split('-').map(Number)
                reloadMonthSessions(uid, tk[0], tk[1] - 1)
              }
              finishBatch()
            } else {
              nextPhrase()
            }
          }}
        />
      </div>
    )
  }

  if (viewMode === 'test' && currentPhrase) {
    return (
      <div className="p-3 sm:p-6 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button onClick={goToCatalog} className="btn-ghost text-sm px-2 py-1">{t('phrases.testExit')}</button>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500">{currentIdx + 1} / {batchPhrases.length}</span>
            <div className="w-28 h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-b1-500 rounded-full transition-all duration-300" style={{ width: `${((currentIdx + 1) / batchPhrases.length) * 100}%` }} />
            </div>
          </div>
        </div>
        <PhraseTest
          phrase={currentPhrase}
          allPhrases={dailyPhrases}
          onAnswer={handleTestAnswer}
        />
        <button onClick={handleTestAdvance} className="w-full mt-4 py-3 bg-b1-500 text-white font-bold rounded-xl hover:bg-b1-600 transition-all text-sm flex items-center justify-center gap-2">
          {t('phrases.testNext')} <ArrowRight size={16} />
        </button>
      </div>
    )
  }

  if (viewMode === 'game') {
    return (
      <div className="p-3 sm:p-6 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button onClick={goToCatalog} className="btn-ghost text-sm px-2 py-1">{t('phrases.gameExit')}</button>
          <span className="text-sm font-medium text-gray-500">{t('phrases.batchLabel', { num: String(currentBatch) })}</span>
        </div>
        <PhraseScrambleGame
          phrases={batchPhrases}
          onComplete={handleGameComplete}
          onClose={goToCatalog}
        />
      </div>
    )
  }

  if (showScrambleGame) {
    return (
      <div className="p-3 sm:p-6 max-w-2xl mx-auto">
        <PhraseScrambleGame
          phrases={dailyPhrases}
          onComplete={(score) => {
            addXP(score * 3)
            setShowScrambleGame(false)
            loadDailyData()
          }}
          onClose={() => setShowScrambleGame(false)}
        />
      </div>
    )
  }

  if (showTypingGame) {
    return (
      <div className="p-3 sm:p-6 max-w-2xl mx-auto">
        <PhraseTypingGame onClose={() => setShowTypingGame(false)} />
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-b1-100 dark:bg-b1-900/40 rounded-lg flex items-center justify-center">
            <BookText size={16} className="text-b1-600 dark:text-b1-400" />
          </div>
          <h1 className="text-base sm:text-lg font-bold text-gray-900 dark:text-gray-100">Gap o'rganish</h1>
        </div>
        <div className="flex items-center gap-1">
          <button onClick={() => setShowTypingGame(true)} className="btn-secondary p-2 rounded-lg" title={t('phrases.tooltipTyping')}>
            <span className="text-sm">⌨️</span>
          </button>
          <button onClick={() => setShowScrambleGame(true)} className="btn-secondary p-2 rounded-lg" title={t('phrases.tooltipScramble')}>
            <span className="text-sm">🧩</span>
          </button>
          <button onClick={() => { setShowCalendar(!showCalendar); if (showCalendar) setSelectedDate(getTodayTashkent()) }}
            className={`btn-secondary p-2 rounded-lg ${showCalendar ? 'ring-2 ring-b1-500 border-b1-500' : ''}`} title={t('phrases.tooltipCalendar')}>
            <CalendarDays size={15} />
          </button>
          <button onClick={() => { setShowAnalytics(!showAnalytics); if (!showAnalytics) setShowCalendar(false) }}
            className={`btn-secondary p-2 rounded-lg ${showAnalytics ? 'ring-2 ring-b1-500 border-b1-500' : ''}`} title={t('phrases.tooltipAnalytics')}>
            <BarChart3 size={15} />
          </button>
          <button onClick={() => setShowExportModal(true)} className="btn-secondary p-2 rounded-lg" title={t('phrases.tooltipExport')}>
            <Download size={15} />
          </button>
          <button onClick={() => loadDailyData()} className="btn-secondary p-2 rounded-lg" title={t('phrases.tooltipRefresh')}>
            <RotateCcw size={15} />
          </button>
        </div>
      </div>

      <PhraseProgress
        stats={levelStats}
        totalLearned={totalLearned}
        totalPhrases={levelStats.reduce((a, s) => a + s.total, 0)}
        dueCount={dueCount}
        streak={useStore.getState().streak}
      />

      {showAnalytics ? (
        <div className="mt-4">
          <Suspense fallback={
            <div className="flex flex-col gap-3 py-8">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          }>
            <PhraseAnalytics userId={userId!} sessions={monthSessions} levelCounts={levelCounts} />
          </Suspense>
        </div>
      ) : showCalendar ? (
        <div className="mt-4">
          <PhraseCalendar
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
          {reviewPhrases.length > 0 && (
            <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-orange-200 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-800 px-3 py-2">
              <p className="text-xs font-medium text-orange-700 dark:text-orange-400">
                {t('phrases.reviewDue', { count: String(reviewPhrases.length) })}
              </p>
              <button
                onClick={() => { selectReview(); setTimeout(() => enterStudyMode('flashcard'), 0) }}
                className="shrink-0 px-3 py-1 bg-orange-500 text-white font-bold rounded-lg text-xs hover:bg-orange-600 transition-all"
              >
                {t('phrases.reviewStart')}
              </button>
            </div>
          )}

          <div className="grid grid-cols-3 gap-2 mt-4">
            {[1, 2, 3].map((batchNum) => {
              const batchSlice = getBatchPhrases(dailyPhrases, batchNum)
              const batchIds = batchSlice.map(p => p.phrase_id)
              const startNum = batchIds.length > 0 ? Math.min(...batchIds) : 0
              const endNum = batchIds.length > 0 ? Math.max(...batchIds) : 0
              const isCurrent = currentBatch === batchNum
              return (
                <button
                  key={batchNum}
                  onClick={() => selectBatch(batchNum)}
                  disabled={batchSlice.length === 0}
                  className={`card py-3 text-center transition-all ${isCurrent ? 'ring-2 ring-b1-500 border-b1-500' : ''} ${batchSlice.length === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <p className={`text-sm font-bold ${isCurrent ? 'text-b1-600' : 'text-gray-700'}`}>{t('phrases.batchLabel', { num: String(batchNum) })}</p>
                  <p className="text-[10px] text-gray-400">{t('phrases.batchRange', { start: String(startNum), end: String(endNum) })}</p>
                  <p className="text-[10px] font-medium text-b1-500 mt-0.5">
                    {t('phrases.batchReviewLabel', { count: String(batchSlice.filter(p => !p.is_new && !p.is_learned).length) })}
                    {batchSlice.filter(p => p.is_learned).length > 0 && <> · {t('phrases.batchLearnedLabel', { count: String(batchSlice.filter(p => p.is_learned).length) }) }</>}
                  </p>
                </button>
              )
            })}
          </div>

          {batchPhrases.length > 0 && (
            <div className="mt-4 space-y-3">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('phrases.batchLabel', { num: String(currentBatch) })} · {batchPhrases.length} ta gap
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {([
                  { mode: 'flashcard' as const, label: t('phrases.modeFlashcard'), icon: '🃏', desc: t('phrases.modeFlashcardDesc') },
                  { mode: 'test' as const, label: t('phrases.modeTest'), icon: '📝', desc: t('phrases.modeTestDesc') },
                  { mode: 'game' as const, label: t('phrases.modeGame'), icon: '🧩', desc: t('phrases.modeGameDesc') },
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

          <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-2">
              <div className="relative flex-1">
                <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  value={filterText}
                  onChange={e => setFilterText(e.target.value)}
                  placeholder={t('phrases.searchPlaceholder')}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-200 rounded-xl focus:ring-2 focus:ring-b1-500 focus:border-b1-500 outline-none transition-all"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`p-2 rounded-xl border transition-all ${showFilters || filterLevel.size > 0 || filterMastery !== 'all' ? 'border-b1-300 bg-b1-50 text-b1-600 dark:bg-b1-900/30 dark:text-b1-400' : 'border-gray-200 dark:border-gray-600 text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
              >
                <Filter size={16} />
              </button>
            </div>

            {showFilters && (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {['A1', 'A2', 'B1', 'B2'].map(lvl => (
                  <button
                    key={lvl}
                    onClick={() => { const next = new Set(filterLevel); if (next.has(lvl)) next.delete(lvl); else next.add(lvl); setFilterLevel(next) }}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${filterLevel.has(lvl) ? (lvl === 'A1' ? 'bg-gray-200 border-gray-400 text-gray-700' : lvl === 'A2' ? 'bg-primary-100 border-primary-400 text-primary-700' : lvl === 'B1' ? 'bg-b1-100 border-b1-400 text-b1-700' : 'bg-b2-100 border-b2-400 text-b2-700') : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                  >
                    {lvl}
                  </button>
                ))}
                <span className="text-[10px] text-gray-300 dark:text-gray-600">|</span>
                {([
                  { key: 'all' as const, label: t('phrases.filterAll') },
                  { key: 'new' as const, label: t('phrases.filterNew') },
                  { key: 'learning' as const, label: t('phrases.filterLearning') },
                  { key: 'learned' as const, label: t('phrases.filterLearned') },
                ]).map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setFilterMastery(key)}
                    className={`text-xs font-semibold px-3 py-1.5 rounded-xl border transition-all ${filterMastery === key ? 'border-b1-400 bg-b1-50 text-b1-700 dark:bg-b1-900/30 dark:text-b1-400' : 'border-gray-200 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800'}`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="mt-4 space-y-1">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-400">{filteredBatchPhrases.length} / {batchPhrases.length} {t('common.words')}</p>
              <div className="flex items-center gap-2 text-[10px] text-gray-400">
                <span>{t('phrases.statsNew', { count: String(batchPhrases.filter(p => p.is_new).length) })}</span>
                {batchPhrases.filter(p => !p.is_new && !p.is_learned).length > 0 && (
                  <span>· {t('phrases.statsReview', { count: String(batchPhrases.filter(p => !p.is_new && !p.is_learned).length) })}</span>
                )}
                {batchPhrases.filter(p => p.is_learned).length > 0 && (
                  <span>· {t('phrases.statsLearned', { count: String(batchPhrases.filter(p => p.is_learned).length) })}</span>
                )}
              </div>
            </div>
            {filteredBatchPhrases.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-gray-400">{t('phrases.noResults')}</p>
                <button onClick={() => { setFilterText(''); setFilterLevel(new Set()); setFilterMastery('all') }} className="mt-2 text-xs text-b1-500 font-semibold hover:underline">
                  {t('phrases.filterClear')}
                </button>
              </div>
            ) : (
              filteredBatchPhrases.map((p) => (
                <PhraseRow
                  key={p.phrase_id}
                  phrase={p}
                  globalIndex={(currentBatch - 1) * PHRASE_BATCH_SIZE + batchPhrases.indexOf(p) + 1}
                  onRate={handleRating}
                />
              ))
            )}
          </div>
        </>
      )}

      <PhraseExportModal
        phrases={[...dailyPhrases, ...reviewPhrases]}
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
      />
    </div>
  )
}

function PhraseFlashCardRenderer({
  phrase,
  onRate,
  onAdvance,
}: {
  phrase: GamePhrase
  onRate: (phraseId: number, rating: PhraseRating) => void
  onAdvance: () => void
}) {
  const [flipped, setFlipped] = useState(false)
  const [rated, setRated] = useState(false)

  useEffect(() => {
    setFlipped(false)
    setRated(false)
  }, [phrase.phrase_id])

  return (
    <div>
      <PhraseFlashCard phrase={phrase} flipped={flipped} onFlip={() => setFlipped(true)} />

      {!rated && (
        <div className="mt-4 flex gap-2">
          {([
            { key: 'yodladim' as PhraseRating, label: 'Yodladim', emoji: '⭐', bg: 'bg-yellow-50 hover:bg-yellow-100 border-yellow-300', color: 'text-yellow-600' },
            { key: 'bildim' as PhraseRating, label: 'Bildim', emoji: '😊', bg: 'bg-green-50 hover:bg-green-100 border-green-200', color: 'text-green-600' },
            { key: 'qiynaldim' as PhraseRating, label: 'Qiynaldim', emoji: '🤔', bg: 'bg-orange-50 hover:bg-orange-100 border-orange-200', color: 'text-orange-600' },
            { key: 'bilmadim' as PhraseRating, label: 'Bilmadim', emoji: '😕', bg: 'bg-red-50 hover:bg-red-100 border-red-200', color: 'text-red-600' },
          ]).map(({ key, label, emoji, bg, color }) => (
            <button
              key={key}
              onClick={() => { setRated(true); onRate(phrase.phrase_id, key) }}
              className={`flex-1 flex flex-col items-center gap-1 py-3 rounded-xl border text-xs font-medium transition-all ${bg} ${color}`}
            >
              <span className="text-lg">{emoji}</span>
              <span className="font-semibold">{label}</span>
            </button>
          ))}
        </div>
      )}

      {rated && (
        <div className="mt-4">
          <button
            onClick={onAdvance}
            className="w-full py-3 bg-b1-500 text-white font-bold rounded-xl hover:bg-b1-600 transition-all text-sm flex items-center justify-center gap-2"
          >
            Keyingi <ArrowRight size={16} />
          </button>
        </div>
      )}
    </div>
  )
}
