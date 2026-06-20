import { useState, useEffect, useMemo, useRef, lazy, Suspense } from 'react'
import { ArrowRight, FlaskConical } from 'lucide-react'
import { useI18n } from '../i18n'
import { supabase } from '../lib/supabase'
import { monitoring } from '../lib/monitoring'
import { db } from '../lib/db'
import { useStore } from '../store/useStore'
import { useVocabStore, getBatchWords, type GameWord, type ViewMode } from '../store/vocabularyStore'
import {
  saveSession,
  fetchMonthSessions,
  getCachedLevelTotals,
  type Rating,
  type DailyWordRow,
  type DaySession,
} from '../services/vocabularyService'
import { getTodayTashkent } from '../utils/tashkentDate'
import WordTest from '../components/vocabulary/WordTest'
import WordGame from '../components/vocabulary/WordGame'
import VocabProgress from '../components/vocabulary/VocabProgress'
import VocabCalendar from '../components/vocabulary/VocabCalendar'
import VocabTypingGame from '../components/vocabulary/VocabTypingGame'
import VocabSentenceGame from '../components/vocabulary/VocabSentenceGame'
import WordRow from '../components/vocabulary/WordRow'
import { useToastStore } from '../utils/toastStore'
import { generateUzbekSentence, analyzeGrammar } from '../lib/claude'
import GrammarAnalysisPanel from '../components/vocabulary/GrammarAnalysisPanel'
import { BATCH_SIZE } from '../utils/vocabConfig'
const VocabAnalytics = lazy(() => import('../components/vocabulary/VocabAnalytics'))
import VocabExportModal from '../components/vocabulary/VocabExportModal'
import { type VocabExportRow } from '../services/vocabularyExport'
import VocabHeader from './vocabulary/VocabHeader'
import FilterBar from './vocabulary/FilterBar'
import { VocabLoading, VocabEmpty, VocabBatchComplete } from './vocabulary/VocabViews'
import FlashCardRenderer from './vocabulary/FlashCardRenderer'
import { feelAnswer, feelTap } from '../lib/gameFeel'
import { emitXpBurst } from '../components/ui/XpBurst'
const WORDS_PER_DAY = 100

const LEVEL_ORDER = ['A1', 'A2', 'B1', 'B2']

export default function Vocabulary() {
  const { t } = useI18n()
  const { addXP, addLearnedWords, updateSkillProgress } = useStore()
  const {
    dailyWords, reviewWords, currentBatch, batchWords, currentIdx, viewMode,
    loading, correctCount,
    setDailyWords, setReviewWords, setLoading,
    selectBatch, selectReview, nextWord, rateWord, finishBatch, tick, reset,
  } = useVocabStore()

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
  const [showSentenceGame, setShowSentenceGame] = useState(false)
  const [monthSessions, setMonthSessions] = useState<Map<string, DaySession>>(new Map())
  const [showExportModal, setShowExportModal] = useState(false)

  // ── Filter state ──
  const [filterText, setFilterText] = useState('')
  const [filterLevel, setFilterLevel] = useState<Set<string>>(new Set())
  const [filterMastery, setFilterMastery] = useState<'all' | 'new' | 'learning' | 'learned'>('all')
  const [showFilters, setShowFilters] = useState(false)

  const filteredBatchWords = useMemo(() => {
    let result = batchWords

    // Text filter
    if (filterText.trim()) {
      const q = filterText.trim().toLowerCase()
      result = result.filter(w =>
        w.english.toLowerCase().includes(q) ||
        w.uzbek.toLowerCase().includes(q)
      )
    }

    // Level filter
    if (filterLevel.size > 0) {
      result = result.filter(w => filterLevel.has(w.level))
    }

    // Mastery filter
    switch (filterMastery) {
      case 'new':
        result = result.filter(w => w.is_new)
        break
      case 'learning':
        result = result.filter(w => !w.is_new && !w.is_learned)
        break
      case 'learned':
        result = result.filter(w => w.is_learned)
        break
    }

    return result
  }, [batchWords, filterText, filterLevel, filterMastery])

  // WordTest Grammar Analysis state
  const [testAnalysisText, setTestAnalysisText] = useState('')
  const [testAnalysisLoading, setTestAnalysisLoading] = useState(false)
  const [testAnalysisShown, setTestAnalysisShown] = useState(false)
  const [testAnswered, setTestAnswered] = useState(false)
  const [testWordForAnalysis, setTestWordForAnalysis] = useState<GameWord | null>(null)

  useEffect(() => {
    const today = getTodayTashkent()
    setStudyDate(today)
    setSelectedDate(today)
    loadDailyData(today)
    return () => { reset() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studyDate])

  useEffect(() => {
    if (viewMode === 'flashcard' || viewMode === 'test') {
      const interval = setInterval(tick, 1000)
      return () => clearInterval(interval)
    }
  }, [viewMode, tick])

  const [levelCounts, setLevelCounts] = useState<Map<string, number>>(new Map())
  const [learnedCounts, setLearnedCounts] = useState<Map<string, number>>(new Map())
  const [rpcError, setRpcError] = useState<string | null>(null)

  function handleRating(wordId: number, rating: Rating) {
    const srsRate = rateWord(wordId, rating)
    // ── GAME FEEL: bildim/yodladim = to'g'ri, qiynaldim/bilmadim = neytral/xato ──
    if (rating === 'bildim' || rating === 'yodladim') {
      feelAnswer({ correct: true, combo: 0 })
      emitXpBurst(rating === 'yodladim' ? 15 : 5)
    } else if (rating === 'bilmadim') {
      feelAnswer({ correct: false })
    } else {
      feelTap()
    }
    const p = saveProgressToDB(wordId, rating, { box: srsRate.newBox, next_review: srsRate.nextReview, is_learned: srsRate.isLearned })
    pendingSavesRef.current.add(p); p.finally(() => pendingSavesRef.current.delete(p))
  }

  function reloadMonthSessions(uid: string, year: number, month: number) {
    fetchMonthSessions(uid, year, month).then(setMonthSessions)
  }

  async function loadDailyData(_targetDate?: string) {
    setLoading(true)
    setRpcError(null)
    // Wait for any in-flight catalog rating saves before reading DB
    if (pendingSavesRef.current.size > 0) {
      await Promise.allSettled([...pendingSavesRef.current])
    }
    try {
      const { data: { session } } = await supabase.auth.getSession()
      const uid = session?.user?.id
      if (!uid) { setLoading(false); return }
      setUserId(uid)
      const tk = getTodayTashkent().split('-').map(Number)
      reloadMonthSessions(uid, tk[0], tk[1] - 1)
      const today = getTodayTashkent()

      // ── PARALLEL (faza A): faqat uid ga bog'liq, bir-biriga bog'liq bo'lmagan
      //    so'rovlar BIRGA yuboriladi (oldin 8+ ta ketma-ket edi). ──
      const [userData, allProgressRes, totals, reviewProgressRes, studiedRowsRes, learnedDataRes] = await Promise.all([
        supabase.from('users').select('start_date').eq('id', uid).maybeSingle(),
        supabase.from('vocabulary_progress').select('word_id, is_learned').eq('user_id', uid),
        getCachedLevelTotals('words', LEVEL_ORDER),
        supabase.from('vocabulary_progress')
          .select('word_id, box, next_review, correct_count, wrong_count, is_learned, last_rating')
          .eq('user_id', uid).lte('next_review', today).eq('is_learned', false),
        supabase.from('vocabulary_progress').select('word_id, words(level)').eq('user_id', uid),
        supabase.rpc('get_learned_counts_by_level', { user_uuid: uid }),
      ])

      const dbStartDate = userData.data?.start_date ?? today
      useStore.setState({ startDate: dbStartDate })

      // ── Ko'rilgan so'zlar (har qanday progress) va to'liq yodlangan to'plamlar ──
      // seenSet: DB da progressi bor BARCHA so'zlar (har qachon baholangan).
      // Kunlik 100 ta so'z tanlashda seenSet chiqariladi — shu kun davomida
      // baholangan so'zlar ertaga qayta chiqmaydi.
      const allProgress = allProgressRes.data ?? []
      const seenSet = new Set(allProgress.map(p => p.word_id))
      const learnedSet = new Set(
        allProgress.filter(p => p.is_learned).map(p => p.word_id)
      )
      const setCounts = new Map<number, number>()
      for (const wid of learnedSet) {
        const sn = Math.floor((wid - 1) / WORDS_PER_DAY)
        setCounts.set(sn, (setCounts.get(sn) ?? 0) + 1)
      }
      let compSets = 0
      for (const [sn, cnt] of setCounts) {
        if (cnt >= WORDS_PER_DAY) compSets = Math.max(compSets, sn + 1)
      }
      // Level totals — keshlangan statik katalog (faza A da parallel olingan)
      const totalsMap = new Map<string, number>(LEVEL_ORDER.map(l => [l, totals[l] ?? 0]))

      // ── 2. Kunlik 100 so'z ──
      // KUNLIK SNAPSHOT: bugungi to'plam kun davomida QAT'IY. Agar shu kun uchun
      // snapshot mavjud bo'lsa — aynan o'sha so'zlar qaytariladi (bugun baholangan
      // so'zlar ham kun oxirigacha qoladi). Faqat YANGI kunda seenSet (DB da
      // progressi bor so'zlar) chiqariladi va yangi 100 ta so'z tanlanadi.
      const dailyWordRows: { id: number; english: string; uzbek: string; level: string; example: string | null; phonetic: string | null }[] = []
      const vocabSnap = useVocabStore.getState()
      const hasSnapshot = vocabSnap.dailyDate === today && vocabSnap.dailyWords.length > 0

      if (hasSnapshot) {
        // Bugungi snapshot — o'sha so'zlarni (snapshot tartibida) qayta olamiz
        const ids = vocabSnap.dailyWords.map(w => w.word_id)
        const { data: rows } = await supabase
          .from('words')
          .select('id, english, uzbek, level, example, phonetic')
          .in('id', ids)
        const byId = new Map((rows ?? []).map(w => [w.id, w]))
        for (const id of ids) {
          const w = byId.get(id)
          if (w) dailyWordRows.push(w)
        }
      } else {
        // Yangi kun — keyingi 100 ta yodlanmagan so'z (daraja+id tartibida)
        let setNum = compSets
        while (dailyWordRows.length < WORDS_PER_DAY) {
          const off = setNum * WORDS_PER_DAY
          const { data: rows, error: we } = await supabase
            .from('words')
            .select('id, english, uzbek, level, example, phonetic')
            .order('level', { ascending: true })
            .order('id', { ascending: true })
            .range(off, off + WORDS_PER_DAY - 1)
          if (we) setRpcError(`words query error: ${we.message}`)
          if (!rows || rows.length === 0) break
          const unlearned = rows.filter(w => !seenSet.has(w.id))
          const need = WORDS_PER_DAY - dailyWordRows.length
          dailyWordRows.push(...unlearned.slice(0, need))
          setNum++
        }
      }

      // reviewProgress faza A da olingan
      const reviewProgress = reviewProgressRes.data
      const dailyIds = dailyWordRows.map(w => w.id)
      const reviewCandidates = (reviewProgress ?? []).filter(r => !dailyIds.includes(r.word_id))
      const reviewIds = reviewCandidates.map(r => r.word_id)

      // ── PARALLEL (faza C): kunlik so'zlar progressi + takror so'zlar matni ──
      const [dailyProgressRes, reviewWordRes] = await Promise.all([
        dailyIds.length > 0
          ? supabase.from('vocabulary_progress')
              .select('word_id, box, next_review, correct_count, wrong_count, is_learned, last_rating')
              .eq('user_id', uid).in('word_id', dailyIds)
          : Promise.resolve({ data: [] as typeof reviewProgress }),
        reviewIds.length > 0
          ? supabase.from('words').select('id, english, uzbek, level, example, phonetic').in('id', reviewIds)
          : Promise.resolve({ data: [] as { id: number; english: string; uzbek: string; level: string; example: string | null; phonetic: string | null }[] }),
      ])
      const progressByWord = new Map((dailyProgressRes.data ?? []).map(p => [p.word_id, p]))
      const reviewWordsMap = new Map((reviewWordRes.data ?? []).map(w => [w.id, w]))

      // ── 5. DailyWordRow build ──
      const todayWords: DailyWordRow[] = dailyWordRows.map(w => {
        const prog = progressByWord.get(w.id)
        return {
          word_id: w.id, english: w.english, uzbek: w.uzbek,
          level: w.level as DailyWordRow['level'], box: prog?.box ?? 1, next_review: prog?.next_review ?? today,
          correct_count: prog?.correct_count ?? 0, wrong_count: prog?.wrong_count ?? 0,
          is_new: !prog, is_learned: prog?.is_learned ?? false, example: w.example ?? '',
          phonetic: w.phonetic ?? '',
          last_rating: prog?.last_rating ?? undefined,
        }
      })

      const reviewDueWords: DailyWordRow[] = reviewCandidates
        .map(prog => {
          const w = reviewWordsMap.get(prog.word_id)
          if (!w) return null
          return {
            word_id: w.id, english: w.english, uzbek: w.uzbek,
            level: w.level, box: prog.box, next_review: prog.next_review,
            correct_count: prog.correct_count, wrong_count: prog.wrong_count,
            is_new: false, is_learned: prog.is_learned, example: w.example ?? '',
            phonetic: w.phonetic ?? '',
            last_rating: prog.last_rating,
          } as DailyWordRow
        })
        .filter((r): r is DailyWordRow => r !== null)
        .sort((a, b) => a.next_review.localeCompare(b.next_review) || a.box - b.box)

      // ── O'rganilgan so'zlar soni (faza A da olingan studiedRows dan) ──
      const learnedCountsMap = new Map<string, number>()
      const studied = db.cast<{ word_id: string; words: { level: string } | null }[]>(studiedRowsRes.data ?? [])
      for (const row of studied) {
        const lvl = row.words?.level
        if (typeof lvl === 'string') {
          learnedCountsMap.set(lvl, (learnedCountsMap.get(lvl) ?? 0) + 1)
        }
      }
      // Store uchun: faqat to'liq yodlangan (is_learned=true) so'zlar soni (faza A RPC)
      const totalFromDb = ((learnedDataRes.data ?? []) as { learned: number }[]).reduce((acc, l) => acc + Number(l.learned), 0)

      // Reset transition guard after data reload
      learnedTransitioned.current.clear()
      setDailyWords(todayWords)
      setReviewWords(reviewDueWords)
      setLevelCounts(totalsMap)
      setLearnedCounts(learnedCountsMap)
      // totalWordsLearned ni DB bilan sinxronlash
      useStore.setState({ totalWordsLearned: totalFromDb })
      setSessionStart(Date.now())
    } catch (e) {
      monitoring.captureException(e instanceof Error ? e : new Error(String(e)), { context: 'Vocabulary:loadDailyData' })
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
  const dueTodayCount = dailyWords.filter((w) => !w.is_new && !w.is_learned && w.next_review <= todayStr).length
  const dueCount = dueTodayCount + reviewWords.length

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
    const base = s.currentBatch === 0
      ? s.batchWords
      : s.batchWords.filter(w => !w.is_learned)
    if (base.length === 0) return
    // Tartib QAT'IY (random emas) — har refresh'da bir xil so'zlar bir xil
    // tartibda ko'rinsin. Kunlik snapshot bilan birga to'plam barqaror bo'ladi.
    const studyWords = [...base]
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

  async function saveProgressToDB(
    wordId: number,
    rating: Rating,
    srsResult: { box: number; next_review: string; is_learned: boolean }
  ) {
    const { data: { session } } = await supabase.auth.getSession()
    const uid = session?.user?.id
    if (!uid) { monitoring.captureMessage('saveProgressToDB: no uid'); return }

    // correct_count/wrong_count from store (rateWord() has already updated them)
    const store = useVocabStore.getState()
    const sw = [...store.dailyWords, ...store.reviewWords].find((d) => d.word_id === wordId)
    const newCorrect = sw?.correct_count ?? 0
    const newWrong = sw?.wrong_count ?? 0

    // w from render closure for pre-update is_learned/level (XP calculation below)
    // Render-scoped dailyWords/reviewWords have the values BEFORE rateWord() updated the store
    const renderWords = [...dailyWords, ...reviewWords]
    const w = renderWords.find((d) => d.word_id === wordId)

    const { error } = await supabase.from('vocabulary_progress').upsert({
      user_id: uid,
      word_id: wordId,
      box: srsResult.box,
      next_review: srsResult.next_review,
      correct_count: newCorrect,
      wrong_count: newWrong,
      is_learned: srsResult.is_learned,
      last_rating: rating,
      last_reviewed: new Date().toISOString(),
    }, { onConflict: 'user_id,word_id' })

    if (error) {
      monitoring.captureMessage('saveProgressToDB upsert error: ' + error.message, 'warn')
      useToastStore.getState().toast(t('common.error'), 'error')
      return
    }

    if (w) {
      // Progress bar: to'liq yodlangan (box=6) so'zlar soni + XP
      if (srsResult.is_learned && !w.is_learned) {
        if (!learnedTransitioned.current.has(wordId)) {
          learnedTransitioned.current.add(wordId)
          addLearnedWords(1)
          addXP(5)
          setLearnedCounts((prev) => {
            const next = new Map(prev)
            next.set(w.level, (next.get(w.level) ?? 0) + 1)
            return next
          })
        }
      } else if (!srsResult.is_learned && w.is_learned) {
        learnedTransitioned.current.delete(wordId)
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
    if (batch <= 0 || batch > 4) return
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
      const rating: Rating = !correct ? 'bilmadim' : (word.last_rating === 'yodladim' ? 'yodladim' : 'bildim')
      const srs = rateWord(word.word_id, rating)
      await saveProgressToDB(word.word_id, rating, { box: srs.newBox, next_review: srs.nextReview, is_learned: srs.isLearned })
    }

    const answeredSoFar = useVocabStore.getState().totalAnswered + 1
    updateSkillProgress('todayVocabPct', Math.round((answeredSoFar / Math.max(batchWords.length, 1)) * 100))

    // Don't auto-advance — show analysis option
    setTestAnswered(true)
    if (word) setTestWordForAnalysis(word)
  }

  async function handleTestAdvance() {
    const totalInBatch = batchWords.length
    setTestAnswered(false)
    setTestAnalysisShown(false)
    setTestAnalysisText('')
    setTestWordForAnalysis(null)

    if (useVocabStore.getState().currentIdx + 1 >= totalInBatch) {
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
    // addLearnedWords is handled per-word inside saveProgressToDB below
    updateSkillProgress('todayVocabPct', Math.round((score / total) * 100))

    useVocabStore.setState({ correctCount: score, totalAnswered: total })

    // Save each game word progress to DB (game completes only when all matched)
    const { data: { session } } = await supabase.auth.getSession()
    const uid = session?.user?.id
    if (uid) {
      for (const w of batchWords.slice(0, total)) {
        const rating: Rating = w.last_rating === 'yodladim' ? 'yodladim' : 'bildim'
        const srs = rateWord(w.word_id, rating)
        await saveProgressToDB(w.word_id, rating, { box: srs.newBox, next_review: srs.nextReview, is_learned: srs.isLearned })
      }
      await saveBatchSession(uid)
      reloadMonthSessions(uid, new Date().getFullYear(), new Date().getMonth())
    }

    finishBatch()
  }

  async function handleImport(rows: VocabExportRow[]) {
    const { data: { session } } = await supabase.auth.getSession()
    const uid = session?.user?.id
    if (!uid) { return }

    // Upsert each imported word as vocabulary_progress
    let imported = 0
    for (const row of rows) {
      // First find the word_id from words table
      const { data: wordData } = await supabase
        .from('words')
        .select('id')
        .eq('english', row.english)
        .maybeSingle()

      const wordId = wordData?.id
      if (!wordId) {
        // Word doesn't exist in catalog — skip (could insert as user_word, but keeping it simple)
        continue
      }

      const { error } = await supabase.from('vocabulary_progress').upsert({
        user_id: uid,
        word_id: wordId,
        box: row.box ?? 1,
        next_review: row.next_review ?? new Date().toISOString().split('T')[0],
        correct_count: row.correct_count ?? 0,
        wrong_count: row.wrong_count ?? 0,
        is_learned: row.is_learned ?? false,
        last_rating: row.last_rating ?? null,
        last_reviewed: new Date().toISOString(),
      }, { onConflict: 'user_id,word_id' })

      if (!error) imported++
    }

    if (imported > 0) {
      useToastStore.getState().toast(`${imported} ${t('common.words')} ${t('common.saved')}`, 'success')
      // Reload data
      loadDailyData()
      setShowExportModal(false)
    }
  }

  function handleBatchComplete() {
    const today = getTodayTashkent()
    setStudyDate(today)
    setSelectedDate(today)
    loadDailyData(today)
  }

  // ── Loading ────────────────────────────────────────────────

  if (loading) {
    return <VocabLoading />
  }

  // ── No words / empty state ─────────────────────────────────

  if (dailyWords.length === 0 && !loading) {
    return (
      <VocabEmpty
        rpcError={rpcError}
        levelStats={levelStats}
        totalLearned={totalLearned}
        totalWords={levelStats.reduce((a, s) => a + s.total, 0)}
        dueCount={dueCount}
        streak={useStore.getState().streak}
        loadDailyData={() => loadDailyData()}
      />
    )
  }

  // ── Batch complete view ────────────────────────────────────

  if (viewMode === 'complete') {
    return (
      <VocabBatchComplete
        batchWordsLength={batchWords.length}
        correctCount={correctCount}
        currentBatch={currentBatch}
        handleBatchComplete={handleBatchComplete}
        selectBatch={selectBatch}
      />
    )
  }

  // ── FlashCard view ─────────────────────────────────────────

  if (viewMode === 'flashcard' && currentWord) {
    return (
      <div className="p-3 sm:p-6 max-w-lg mx-auto select-none">
        <div className="flex items-center justify-between mb-4">
          <button onClick={goToCatalog} aria-label={t('accessibility.vocab.exitFlashcard')} className="btn-ghost text-sm px-2 py-1">
            {t('vocabPage.exitButton')}
          </button>
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-gray-500">{currentIdx + 1} / {batchWords.length}</span>
            <div className="w-28 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
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
            const srs = rateWord(wordId, rating)
            await saveProgressToDB(wordId, rating, { box: srs.newBox, next_review: srs.nextReview, is_learned: srs.isLearned })
            const answered = useVocabStore.getState().totalAnswered + 1
            updateSkillProgress('todayVocabPct', Math.round((answered / Math.max(batchWords.length, 1)) * 100))
          }}
          onAdvance={async () => {
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
          <button onClick={goToCatalog} aria-label={t('accessibility.vocab.exitTest')} className="btn-ghost text-sm px-2 py-1">
            {t('vocabPage.exitButton')}
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

        {!testAnswered ? (
          <WordTest
            word={currentWord}
            allWords={dailyWords}
            onAnswer={handleTestAnswer}
          />
        ) : (
          <div className="space-y-3">
            {/* Analysis toggle */}
            {!testAnalysisShown ? (
              <button
                onClick={async () => {
                  setTestAnalysisShown(true)
                  setTestAnalysisText('')
                  setTestAnalysisLoading(true)
                  try {
                    const w = testWordForAnalysis!
                    const sentence = await generateUzbekSentence(w.english, w.uzbek, w.level)
                    analyzeGrammar(
                      sentence,
                      w.english,
                      w.level,
                      (token) => setTestAnalysisText((p) => p + token),
                      () => setTestAnalysisLoading(false),
                      (err) => { monitoring.captureException(err instanceof Error ? err : new Error(String(err)), { context: 'Vocabulary:analyzeGrammar' }); setTestAnalysisLoading(false) }
                    )
                  } catch (e) {
                    monitoring.captureMessage('Vocabulary: test analysis failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
                    setTestAnalysisLoading(false)
                  }
                }}
                aria-label={t('accessibility.vocab.grammarAnalysis')}
                className="w-full py-2.5 px-3 rounded-xl border-2 border-indigo-200 dark:border-indigo-700 text-indigo-600 dark:text-indigo-400 font-semibold hover:bg-indigo-50 dark:hover:bg-indigo-900/20 hover:border-indigo-400 transition-all text-sm flex items-center justify-center gap-2"
              >
                <FlaskConical size={15} />
                {t('vocabPage.grammarAnalysis')}
              </button>
            ) : (
              <GrammarAnalysisPanel text={testAnalysisText} loading={testAnalysisLoading} />
            )}

            {/* Next button */}
            <button
              onClick={handleTestAdvance}
              aria-label={t('accessibility.vocab.nextWord')}
              className="w-full py-3 bg-b1-500 text-white font-bold rounded-xl hover:bg-b1-600 transition-all text-sm flex items-center justify-center gap-2"
            >
              {t('vocabPage.nextButton')} <ArrowRight size={16} />
            </button>
          </div>
        )}
      </div>
    )
  }

  // ── Game view ──────────────────────────────────────────────

  if (viewMode === 'game') {
    return (
      <div className="p-3 sm:p-6 max-w-lg mx-auto">
        <div className="flex items-center justify-between mb-4">
          <button onClick={goToCatalog} aria-label={t('accessibility.vocab.exitGame')} className="btn-ghost text-sm px-2 py-1">
            {t('vocabPage.exitButton')}
          </button>
          <span className="text-sm font-medium text-gray-500">{t('vocabPage.batchLabel', { num: currentBatch })}</span>
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

  // ── Sentence Game view ────────────────────────────────────────

  if (showSentenceGame) {
    return (
      <div className="p-3 sm:p-6 max-w-2xl mx-auto">
        <VocabSentenceGame onClose={() => setShowSentenceGame(false)} />
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
      <VocabHeader
        showCalendar={showCalendar}
        showAnalytics={showAnalytics}
        setShowCalendar={setShowCalendar}
        setShowAnalytics={setShowAnalytics}
        setShowTypingGame={setShowTypingGame}
        setShowSentenceGame={setShowSentenceGame}
        setShowExportModal={setShowExportModal}
        loadDailyData={() => loadDailyData()}
      />

      <VocabProgress
        stats={levelStats}
        totalLearned={totalLearned}
        totalWords={levelStats.reduce((a, s) => a + s.total, 0)}
        dueCount={dueCount}
        streak={useStore.getState().streak}
      />

      {showAnalytics ? (
        <div className="mt-4">
          <Suspense fallback={
            <div className="flex items-center justify-center py-16">
              <div className="animate-spin rounded-full h-8 w-8 border-2 border-b1-500 border-t-transparent" />
            </div>
          }>
            <VocabAnalytics userId={userId!} sessions={monthSessions} levelCounts={levelCounts} />
          </Suspense>
        </div>
      ) : showCalendar ? (
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
          {/* ── Takrorlash bo'limi (ixcham) ── */}
          {reviewWords.length > 0 && (
            <div className="mt-3 flex items-center justify-between gap-2 rounded-xl border border-orange-200 bg-orange-50 dark:bg-orange-900/10 dark:border-orange-800 px-3 py-2">
              <p className="text-xs font-medium text-orange-700 dark:text-orange-400">
                {t('vocabPage.reviewBanner', { count: reviewWords.length })}
              </p>
              <button
                onClick={() => { selectReview(); setTimeout(() => enterStudyMode('flashcard'), 0) }}
                aria-label={t('accessibility.vocab.startReview', { count: reviewWords.length })}
                className="shrink-0 px-3 py-1 bg-orange-500 text-white font-bold rounded-lg text-xs hover:bg-orange-600 transition-all"
              >
                {t('vocabPage.reviewStart')}
              </button>
            </div>
          )}

          {/* Batch tabs */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-3">
            {[0, 1, 2, 3].map((i) => {
              const batchNum = i + 1
              const batchWordsSlice = getBatchWords(dailyWords, batchNum)
              const isCurrent = currentBatch === batchNum
              const batchIds = batchWordsSlice.map(w => w.word_id)
              const bStart = batchIds.length > 0 ? Math.min(...batchIds) : 0
              const bEnd = batchIds.length > 0 ? Math.max(...batchIds) : 0
              return (
                <button
                  key={batchNum}
                  onClick={() => selectBatch(batchNum)}
                  disabled={batchWordsSlice.length === 0}
                  aria-label={t('accessibility.vocab.batch', { num: batchNum })}
                  className={`card py-3 text-center transition-all ${
                    isCurrent ? 'ring-2 ring-b1-500 border-b1-500' : ''
                  } ${batchWordsSlice.length === 0 ? 'opacity-40 cursor-not-allowed' : ''}`}
                >
                  <p className={`text-sm font-bold ${isCurrent ? 'text-b1-600' : 'text-gray-700'}`}>
                    {t('vocabPage.batchLabel', { num: batchNum })}
                  </p>
                  <p className="text-xs text-gray-400">{bStart}-{bEnd}</p>
                  <p className="text-xs font-medium text-b1-500 mt-0.5">
                    {t('vocabPage.reviewCount', { count: batchWordsSlice.filter((w) => !w.is_new && !w.is_learned).length })}
                    {batchWordsSlice.filter((w) => w.is_learned).length > 0 && (
                      <> · {t('vocabPage.learnedCount', { count: batchWordsSlice.filter((w) => w.is_learned).length })}</>
                    )}
                  </p>
                </button>
              )
            })}
          </div>

          {/* Phase navigation */}
          {batchWords.length > 0 && (
            <div className="mt-3 space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
                {t('vocabPage.batchPhaseName', { num: currentBatch, count: batchWords.length })}
              </p>
              <div className="grid grid-cols-3 gap-2">
                {([
                  { mode: 'flashcard' as const, label: t('vocabPage.modeFlashcard'), icon: '🃏', desc: t('vocabPage.modeFlashcardDesc') },
                  { mode: 'test' as const, label: t('vocabPage.modeTest'), icon: '📝', desc: t('vocabPage.modeTestDesc') },
                  { mode: 'game' as const, label: t('vocabPage.modeGame'), icon: '🎮', desc: t('vocabPage.modeGameDesc') },
                ]).map((phase) => (
                  <button
                    key={phase.mode}
                    onClick={() => enterStudyMode(phase.mode)}
                    aria-label={phase.label}
                    className="card py-3 text-center hover:shadow-sm hover:border-b1-200 transition-all"
                  >
                    <span className="text-xl">{phase.icon}</span>
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mt-0.5">{phase.label}</p>
                    <p className="text-[9px] text-gray-400">{phase.desc}</p>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── Filter bar ── */}
          <FilterBar
            filterText={filterText}
            setFilterText={setFilterText}
            filterLevel={filterLevel}
            setFilterLevel={setFilterLevel}
            filterMastery={filterMastery}
            setFilterMastery={setFilterMastery}
            showFilters={showFilters}
            setShowFilters={setShowFilters}
          />

          {/* Word list for current batch */}
          <div className="mt-4 space-y-1">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs text-gray-400">
                {filteredBatchWords.length} / {batchWords.length} {t('common.words')}
              </p>
              <div className="flex items-center gap-2 text-xs text-gray-400">
                <span>{t('vocabPage.newCount', { count: batchWords.filter((w) => w.is_new).length })}</span>
                {batchWords.filter((w) => !w.is_new && !w.is_learned).length > 0 && (
                  <span>· {t('vocabPage.reviewCount', { count: batchWords.filter((w) => !w.is_new && !w.is_learned).length })}</span>
                )}
                {batchWords.filter((w) => w.is_learned).length > 0 && (
                  <span>· {t('vocabPage.learnedCount', { count: batchWords.filter((w) => w.is_learned).length })}</span>
                )}
              </div>
            </div>
            {filteredBatchWords.length === 0 ? (
              <div className="py-8 text-center">
                <p className="text-sm text-gray-400">{t('vocabPage.noResults')}</p>
                <button
                  onClick={() => { setFilterText(''); setFilterLevel(new Set()); setFilterMastery('all') }}
                  className="mt-2 text-xs text-b1-500 font-semibold hover:underline"
                >
                  {t('vocabPage.filterClear')}
                </button>
              </div>
            ) : (
              filteredBatchWords.map((w) => (
                <WordRow
                  key={w.word_id}
                  word={w}
                  globalIndex={(currentBatch - 1) * BATCH_SIZE + batchWords.indexOf(w) + 1}
                  onRate={handleRating}
                />
              ))
            )}
          </div>
        </>
      )}

      {/* Export/Import Modal */}
      <VocabExportModal
        words={[...dailyWords, ...reviewWords]}
        open={showExportModal}
        onClose={() => setShowExportModal(false)}
        onImport={handleImport}
      />

    </div>
  )
}

