import { useState, useEffect, useMemo, useRef } from 'react'
import { ArrowLeft, CheckCircle, XCircle, Trophy, RotateCcw, ChevronRight, Sparkles, RefreshCw, BookOpen, ChevronDown, Target } from 'lucide-react'
import type { ReviewLesson, DailyExercise } from '../../data/dailyLessons'
import { useStore } from '../../store/useStore'
import { checkAnswer, getExerciseContext, getCorrectText } from './helpers'
import { checkDailyExerciseAnswers } from '../../lib/claude'
import type { DailyExerciseCheckItem } from '../../lib/claude'
import ExerciseCard from './ExerciseCard'
import { monitoring } from '../../lib/monitoring'
import {
  pushLessonProgress, pushTestProgress, getLessonProgress,
  saveExerciseAnswersToDB, clearExerciseAnswersFromDB,
} from '../../services/lessonService'

type Answers = Record<number, string[]>
type Tab = 'exercises' | 'tests'

export default function ReviewView({ lesson, onBack }: { lesson: ReviewLesson; onBack: () => void }) {
  const { addXP, setLessonProgress } = useStore()

  const [tab, setTab] = useState<Tab>('exercises')
  const [currentSection, setCurrentSection] = useState(0)
  const [testSection, setTestSection] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [completedSections, setCompletedSections] = useState<Record<number, number>>({})
  const [aiResults, setAiResults] = useState<Record<number, boolean>>({})
  const [isAiChecking, setIsAiChecking] = useState(false)
  const [testAnswers, setTestAnswers] = useState<Record<number, string>>({})
  const [testSubmitted, setTestSubmitted] = useState(false)
  const [testScore, setTestScore] = useState(0)
  const [testResults, setTestResults] = useState<Record<number, boolean>>({})
  const [completedTestSections, setCompletedTestSections] = useState<Record<number, number>>({})
  const [prevScore, setPrevScore] = useState<number | null>(null)

  // ── Key Rules: individual accordion + Tushundim tracking ──
  const [expandedRules, setExpandedRules] = useState<Record<string, boolean>>({})
  const [understoodRules, setUnderstoodRules] = useState<Record<string, boolean>>(() => {
    try { return JSON.parse(localStorage.getItem(`review-rules-${lesson.id}`) ?? '{}') }
    catch { return {} }
  })

  // ── Smart Review: faqat xato mashqlarni qayta ko'rsatish ──
  const [smartReviewMode, setSmartReviewMode] = useState(false)
  const [wrongExerciseIds, setWrongExerciseIds] = useState<number[]>([])
  const [lastCheckedCount, setLastCheckedCount] = useState(0)

  // ── Smart Review: cross-section consolidation ──
  const consolidatedWrongIdsRef = useRef<Set<number>>(new Set())
  const [showWrongReview, setShowWrongReview] = useState(false)

  const section = lesson.exerciseSections[currentSection]
  const sectionExercises = lesson.exercises.filter(ex => section?.ids.includes(ex.id))
  const displayExercises = smartReviewMode
    ? sectionExercises.filter(ex => wrongExerciseIds.includes(ex.id))
    : sectionExercises
  const isLastSection = currentSection === lesson.exerciseSections.length - 1
  const allSectionsDone = lesson.exerciseSections.every((_, i) => completedSections[i] !== undefined)

  const shuffledTestOptionsMap = useMemo(() => {
    const map = new Map<number, string[]>()
    const sec = lesson.testSections[testSection]
    if (!sec) return map
    const tests = lesson.tests.filter((t): t is Extract<DailyExercise, { type: 'multiple-choice' }> => sec.ids.includes(t.id))
    for (const t of tests) {
      const opts = [...t.options]
      for (let i = opts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [opts[i], opts[j]] = [opts[j], opts[i]]
      }
      map.set(t.id, opts)
    }
    return map
  }, [lesson.tests, lesson.testSections, testSection])

  useEffect(() => {
    getLessonProgress(lesson.id).then(p => { if (p !== null) setPrevScore(p) })
  }, [lesson.id])

  // ── Persist understood rules ──
  useEffect(() => {
    try { localStorage.setItem(`review-rules-${lesson.id}`, JSON.stringify(understoodRules)) }
    catch { /* ignore */ }
  }, [understoodRules, lesson.id])

  const exerciseDBSaveTimerRef = useRef<ReturnType<typeof setTimeout>>()
  const testDBSaveTimerRef = useRef<ReturnType<typeof setTimeout>>()

  useEffect(() => () => {
    if (exerciseDBSaveTimerRef.current) clearTimeout(exerciseDBSaveTimerRef.current)
    if (testDBSaveTimerRef.current) clearTimeout(testDBSaveTimerRef.current)
  }, [])

  const toggleRuleExpand = (topic: string) => {
    setExpandedRules(prev => ({ ...prev, [topic]: !prev[topic] }))
  }

  const toggleRuleUnderstood = (topic: string) => {
    setUnderstoodRules(prev => ({ ...prev, [topic]: !prev[topic] }))
  }

  const understoodCount = lesson.keyRules
    ? lesson.keyRules.filter(kr => understoodRules[kr.topic]).length
    : 0
  const totalRules = lesson.keyRules?.length ?? 0

  const handleChangeAnswer = (exId: number, blankIdx: number, val: string) => {
    setAnswers(prev => {
      const cur = [...(prev[exId] ?? [])]
      cur[blankIdx] = val
      return { ...prev, [exId]: cur }
    })
  }

  const handleJumpToSection = (idx: number) => {
    if (idx === currentSection) return
    setAnswers({}); setSubmitted(false); setScore(0); setAiResults({}); setSmartReviewMode(false)
    try {
      const saved = localStorage.getItem(`review-ex-${lesson.id}-${idx}`)
      if (saved) {
        const data = JSON.parse(saved)
        if (data.answers) setAnswers(data.answers)
        if (data.submitted != null) setSubmitted(data.submitted)
        if (data.score != null) setScore(data.score)
      }
    } catch { /* ignore */ }
    setCurrentSection(idx)
    setTimeout(() => { try { window.scrollTo({ top: 0, behavior: 'smooth' }) } catch {/* jsdom */} }, 50)
  }

  const handleJumpToTestSection = (idx: number) => {
    if (idx === testSection) return
    setTestAnswers({}); setTestSubmitted(false); setTestScore(0); setTestResults({})
    try {
      const saved = localStorage.getItem(`review-test-${lesson.id}-${idx}`)
      if (saved) {
        const data = JSON.parse(saved)
        if (data.testAnswers) setTestAnswers(data.testAnswers)
        if (data.testSubmitted != null) setTestSubmitted(data.testSubmitted)
        if (data.testScore != null) setTestScore(data.testScore)
        if (data.testResults) setTestResults(data.testResults)
      }
    } catch { /* ignore */ }
    setTestSection(idx)
    setTimeout(() => { try { window.scrollTo({ top: 0, behavior: 'smooth' }) } catch {/* jsdom */} }, 50)
  }

  const handleSubmitSection = async () => {
    setIsAiChecking(true)
    let correct = 0
    const answerPayloads: { exerciseId: number; exerciseType: string; answer: string[]; isCorrect: boolean }[] = []
    const wrongItems: DailyExerciseCheckItem[] = []

    // Smart Review: faqat xato mashqlarni tekshirish
    const exercisesToCheck = smartReviewMode ? displayExercises : sectionExercises

    for (const ex of exercisesToCheck) {
      const userAns = answers[ex.id] ?? []
      const ok = checkAnswer(ex, userAns)
      if (ok) correct++
      else {
        const context = getExerciseContext(ex)
        const correctStr = getCorrectText(ex)
        let userAnsStr = ''
        if (ex.type === 'fill-blank' || ex.type === 'passage') { userAnsStr = userAns.join(' / ') }
        else if (ex.type === 'fill-table') { userAnsStr = '' }
        else { userAnsStr = userAns[0] ?? '' }
        wrongItems.push({ id: ex.id, context, correct: correctStr, userAnswer: userAnsStr, type: ex.type })
      }
      answerPayloads.push({ exerciseId: ex.id, exerciseType: ex.type, answer: userAns, isCorrect: ok })
    }

    const newAiResults: Record<number, boolean> = {}
    if (wrongItems.length > 0) {
      try {
        const aiResultsList = await checkDailyExerciseAnswers(wrongItems)
        for (let i = 0; i < wrongItems.length; i++) {
          if (aiResultsList[i]) {
            const exId = wrongItems[i].id
            newAiResults[exId] = true
            correct++
            const payload = answerPayloads.find(p => p.exerciseId === exId)
            if (payload) payload.isCorrect = true
          }
        }
      } catch {
        monitoring.captureMessage('AI check failed in ReviewView', 'warn')
      }
    }

    setAiResults(newAiResults)
    setScore(correct)
    setSubmitted(true)
    setLastCheckedCount(exercisesToCheck.length)

    // Smart Review: skorni jamlash (xatolar tuzatilganini hisobga olish)
    const effectiveScore = smartReviewMode
      ? (completedSections[currentSection] ?? 0) + correct
      : correct

    const updatedSections = { ...completedSections, [currentSection]: effectiveScore }
    setCompletedSections(updatedSections)
    addXP(correct * 10)
    saveExerciseAnswersToDB(lesson.id, currentSection, 'exercise', answerPayloads)

    // Smart Review: xato mashqlarni eslab qolish
    if (!smartReviewMode) {
      const wrongIds = answerPayloads
        .filter(p => !p.isCorrect)
        .map(p => p.exerciseId)
      setWrongExerciseIds(wrongIds)
      // Accumulate wrong IDs across ALL sections for consolidated review
      for (const id of wrongIds) {
        consolidatedWrongIdsRef.current.add(id)
      }
    } else {
      // Smart Review tugadi — normal rejimga qaytish
      setSmartReviewMode(false)
      setWrongExerciseIds([])
    }

    try {
      localStorage.setItem(`review-ex-${lesson.id}-${currentSection}`, JSON.stringify({ answers, submitted: true, score: correct }))
    } catch { /* ignore */ }

    const exerciseCorrect = Object.values(updatedSections).reduce((a, b) => a + b, 0)
    const testStarted = lesson.tests.length > 0 && Object.keys(completedTestSections).length > 0
    const testCorrect = testStarted
      ? Object.values(completedTestSections).reduce((a, b) => a + b, 0)
      : 0
    const testTotal = testStarted ? lesson.tests.length : 0
    const combinedCorrect = exerciseCorrect + testCorrect
    const combinedMax = lesson.exercises.length + testTotal
    const combinedPct = combinedMax > 0 ? Math.round((combinedCorrect / combinedMax) * 100) : 0
    setLessonProgress(lesson.id, combinedPct)
    pushLessonProgress(lesson.id, exerciseCorrect, lesson.exercises.length).catch(() => {
      monitoring.captureMessage('pushLessonProgress (review) failed', 'warn')
    })
    setIsAiChecking(false)
  }

  const handleNextSection = () => {
    setAnswers({}); setSubmitted(false); setScore(0); setAiResults({})
    setCurrentSection(prev => prev + 1)
    setTimeout(() => { try { window.scrollTo({ top: 0, behavior: 'smooth' }) } catch {/* jsdom */} }, 50)
  }

  const handleSubmitTest = () => {
    const sec = lesson.testSections[testSection]
    if (!sec) return
    const sectionTests = lesson.tests.filter((t): t is Extract<DailyExercise, { type: 'multiple-choice' }> => sec.ids.includes(t.id))
    let correct = 0
    const results: Record<number, boolean> = {}
    const answerPayloads: { exerciseId: number; exerciseType: string; answer: string[]; isCorrect: boolean }[] = []
    for (const t of sectionTests) {
      const ans = testAnswers[t.id] || ''
      const ok = ans === t.correct
      results[t.id] = ok
      if (ok) correct++
      answerPayloads.push({ exerciseId: t.id, exerciseType: t.type, answer: [ans], isCorrect: ok })
    }
    setTestScore(correct); setTestResults(results); setTestSubmitted(true)
    const newCompleted = { ...completedTestSections, [testSection]: correct }
    setCompletedTestSections(newCompleted)
    addXP(correct * 10)
    saveExerciseAnswersToDB(lesson.id, testSection, 'test', answerPayloads)

    try {
      localStorage.setItem(`review-test-${lesson.id}-${testSection}`, JSON.stringify({ testAnswers, testSubmitted: true, testScore: correct, testResults: results }))
    } catch { /* ignore */ }

    pushTestProgress(lesson.id, sec.title, correct, sectionTests.length).catch(() => {
      monitoring.captureMessage('pushTestProgress (review) failed', 'warn')
    })
    const testCorrectAll = Object.values(newCompleted).reduce((a, b) => a + b, 0)
    const exerciseCorrectAll = Object.values(completedSections).reduce((a, b) => a + b, 0)
    const combinedCorrect = testCorrectAll + exerciseCorrectAll
    const combinedMax = lesson.exercises.length + lesson.tests.length
    const combinedPct = combinedMax > 0 ? Math.round((combinedCorrect / combinedMax) * 100) : 0
    setLessonProgress(lesson.id, combinedPct)
  }

  const LEVEL_COLOR: Record<string, string> = {
    A1: 'bg-emerald-600', A2: 'bg-blue-600', B1: 'bg-violet-600', 'B1+': 'bg-purple-700', B2: 'bg-rose-700',
  }

  // ── Mastery meter: hisoblash ──
  const totalExerciseCorrect = Object.values(completedSections).reduce((a, b) => a + b, 0)
  const totalTestCorrect = Object.values(completedTestSections).reduce((a, b) => a + b, 0)
  const combinedPct = lesson.exercises.length + lesson.tests.length > 0
    ? Math.round(((totalExerciseCorrect + totalTestCorrect) / (lesson.exercises.length + lesson.tests.length)) * 100)
    : 0

  const getMasteryLevel = (pct: number): { emoji: string; label: string; color: string } => {
    if (pct >= 90) return { emoji: '🏆', label: 'Mukammal', color: 'text-green-600 dark:text-green-400' }
    if (pct >= 70) return { emoji: '👍', label: 'Zo\'r', color: 'text-blue-600 dark:text-blue-400' }
    if (pct >= 50) return { emoji: '📚', label: 'Yaxshi', color: 'text-amber-600 dark:text-amber-400' }
    return { emoji: '💪', label: 'O\'rganilmoqda', color: 'text-red-500 dark:text-red-400' }
  }

  const mastery = getMasteryLevel(combinedPct)

  // ── Wrong Review View ──
  if (showWrongReview) {
    const consolidatedWrongIds = [...consolidatedWrongIdsRef.current]
    const wrongExercises = lesson.exercises.filter(ex => consolidatedWrongIds.includes(ex.id))
    return (
      <div className="p-3 sm:p-6 max-w-4xl mx-auto space-y-4">
        <div className="flex items-center gap-2">
          <button onClick={() => setShowWrongReview(false)} className="btn-ghost flex items-center gap-1 text-sm">
            <ArrowLeft size={16} /> Mashqlarga qaytish
          </button>
        </div>
        <div className="card bg-gradient-to-br from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 border-red-200 dark:border-red-800">
          <div className="flex items-center gap-2 mb-2">
            <Target size={18} className="text-red-600 dark:text-red-400" />
            <span className="text-xs font-bold text-red-700 dark:text-red-400 uppercase tracking-wider">Xatolar tahlili</span>
          </div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">Qayta ko'rib chiqish</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {consolidatedWrongIds.length} ta xato — barcha bo'limlar bo'yicha jamlangan
          </p>
        </div>
        <div className="space-y-3">
          {wrongExercises.map((ex, i) => {
            const correctStr = getCorrectText(ex)
            return (
              <div key={ex.id} className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-4 animate-slide-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="flex items-start gap-3">
                  <span className="w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center text-xs font-bold flex-shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 mb-1">
                      {getExerciseContext(ex)}
                    </p>
                    <p className="text-xs text-green-600 dark:text-green-400 font-semibold mt-1">
                      ✓ {correctStr}
                    </p>
                    {'explanation' in ex && <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-1">{ex.explanation}</p>}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
        {consolidatedWrongIds.length > 0 && (
          <button onClick={() => setShowWrongReview(false)}
            className="btn-primary w-full bg-amber-600 hover:bg-amber-700 border-amber-600">
            Mashqlarga qaytish
          </button>
        )}
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto space-y-4 sm:space-y-5">
      {/* ── Header ── */}
      <div className="flex items-center gap-2 sm:gap-3">
        <button onClick={onBack} className="btn-ghost flex items-center gap-1 text-sm">
          <ArrowLeft size={16} /> Boshqa dars
        </button>
        <div className="h-5 w-px bg-gray-200 dark:bg-gray-700" />
        <span className={`badge text-white text-xs font-bold ${LEVEL_COLOR[lesson.level] ?? 'bg-gray-600'}`}>{lesson.level}</span>
        {prevScore !== null && (
          <span className={`badge text-xs font-bold ${prevScore >= 80 ? 'bg-green-100 text-green-700' : prevScore >= 50 ? 'bg-yellow-100 text-yellow-700' : 'bg-red-100 text-red-700'}`}>
            {prevScore}% ✅
          </span>
        )}
      </div>

      {/* ── Title + topics ── */}
      <div className="card bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 border-amber-200 dark:border-amber-800">
        <div className="flex items-center gap-2 mb-2">
          <RefreshCw size={18} className="text-amber-600 dark:text-amber-400" />
          <span className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-wider">Takrorlash darsi</span>
        </div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{lesson.title}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1">{lesson.subtitle}</p>
        <div className="flex flex-wrap gap-1.5 mt-3">
          {lesson.coversTopics.map(topic => (
            <span key={topic} className="badge bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 text-xs">{topic}</span>
          ))}
        </div>
      </div>

      {/* ── Key Rules: Individual Accordion Cards + Tushundim Progress ── */}
      {lesson.keyRules && lesson.keyRules.length > 0 && (
        <div className="space-y-3">
          {/* Progress bar */}
          <div className="flex items-center gap-3">
            <BookOpen size={16} className="text-indigo-500 flex-shrink-0" />
            <span className="text-sm font-bold text-indigo-700 dark:text-indigo-300 whitespace-nowrap">Qoidalar eslatmasi</span>
            <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-400 to-indigo-600 rounded-full transition-all duration-500"
                style={{ width: `${totalRules > 0 ? (understoodCount / totalRules) * 100 : 0}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-indigo-500 dark:text-indigo-400 whitespace-nowrap">
              {understoodCount}/{totalRules}
            </span>
          </div>

          {/* Individual accordion cards */}
          <div className="animate-stagger space-y-2">
            {lesson.keyRules.map(kr => {
              const isExpanded = expandedRules[kr.topic] ?? false
              const isUnderstood = understoodRules[kr.topic] ?? false
              const colorMap: Record<string, string> = {
                blue: 'border-blue-200 dark:border-blue-800',
                green: 'border-green-200 dark:border-green-800',
                orange: 'border-orange-200 dark:border-orange-800',
                purple: 'border-purple-200 dark:border-purple-800',
                red: 'border-red-200 dark:border-red-800',
                teal: 'border-teal-200 dark:border-teal-800',
              }
              const bgMap: Record<string, string> = {
                blue: 'bg-blue-50 dark:bg-blue-900/20',
                green: 'bg-green-50 dark:bg-green-900/20',
                orange: 'bg-orange-50 dark:bg-orange-900/20',
                purple: 'bg-purple-50 dark:bg-purple-900/20',
                red: 'bg-red-50 dark:bg-red-900/20',
                teal: 'bg-teal-50 dark:bg-teal-900/20',
              }
              const titleColorMap: Record<string, string> = {
                blue: 'text-blue-700 dark:text-blue-300',
                green: 'text-green-700 dark:text-green-300',
                orange: 'text-orange-700 dark:text-orange-300',
                purple: 'text-purple-700 dark:text-purple-300',
                red: 'text-red-700 dark:text-red-300',
                teal: 'text-teal-700 dark:text-teal-300',
              }
              return (
                <div
                  key={kr.topic}
                  className={`rounded-xl border overflow-hidden transition-all duration-200 ${isUnderstood ? 'opacity-75' : ''} ${colorMap[kr.color] ?? colorMap.blue}`}
                >
                  {/* Header — click to expand */}
                  <button
                    onClick={() => toggleRuleExpand(kr.topic)}
                    className={`w-full flex items-center justify-between px-4 py-3 text-left transition-colors ${bgMap[kr.color] ?? bgMap.blue} hover:opacity-80`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <span className={`text-sm font-bold ${titleColorMap[kr.color] ?? titleColorMap.blue} truncate`}>
                        {kr.icon} {kr.topic}
                      </span>
                      {isUnderstood && (
                        <span className="text-xs text-green-600 dark:text-green-400 font-semibold flex-shrink-0">✓ Tushundim</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      {/* Tushundim toggle (stop propagation to not trigger expand) */}
                      <button
                        onClick={e => { e.stopPropagation(); toggleRuleUnderstood(kr.topic) }}
                        className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                          isUnderstood
                            ? 'bg-green-500 border-green-500 text-white'
                            : 'border-gray-300 dark:border-gray-600 hover:border-green-400'
                        }`}
                        title={isUnderstood ? "Tushunmadim deb belgilash" : "Tushundim deb belgilash"}
                      >
                        {isUnderstood && <span className="text-[10px]">✓</span>}
                      </button>
                      <ChevronDown size={15} className={`text-gray-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
                    </div>
                  </button>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div className="px-4 pb-3 bg-white dark:bg-gray-900 animate-slide-up">
                      <ul className="space-y-1 pt-1">
                        {kr.rules.map((rule, i) => (
                          <li key={i} className="text-xs text-gray-700 dark:text-gray-300 flex gap-1.5 leading-relaxed">
                            <span className="text-gray-400 flex-shrink-0 mt-0.5">•</span>
                            <span>{rule}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Mastery Meter ── */}
      {(Object.keys(completedSections).length > 0 || Object.keys(completedTestSections).length > 0) && (
        <div className="card bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-900/20 dark:to-purple-900/20 border-indigo-100 dark:border-indigo-800">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <span className="text-xl">{mastery.emoji}</span>
              <div>
                <p className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">O'zlashtirish</p>
                <p className={`text-sm font-bold ${mastery.color}`}>{mastery.label}</p>
              </div>
            </div>
            <div className="text-right">
              <p className={`text-2xl font-bold font-mono ${mastery.color}`}>{combinedPct}%</p>
              <p className="text-[10px] text-gray-400 dark:text-gray-500">{totalExerciseCorrect + totalTestCorrect} / {lesson.exercises.length + lesson.tests.length}</p>
            </div>
          </div>
          {/* Overall progress bar */}
          <div className="h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden mb-3">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-700 animate-count-up"
              style={{ width: `${combinedPct}%` }}
            />
          </div>
          {/* Per-section breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {lesson.exerciseSections.map((s, i) => {
              const sectionScore = completedSections[i]
              const sectionTotal = s.ids.length
              const sectionPct = sectionScore !== undefined && sectionTotal > 0
                ? Math.round((sectionScore / sectionTotal) * 100)
                : null
              return (
                <div key={s.title} className={`rounded-lg p-2 text-center transition-all ${sectionPct !== null ? 'bg-white dark:bg-gray-800' : 'bg-gray-50 dark:bg-gray-800/50'}`}>
                  <p className="text-xs mb-0.5">{s.icon}</p>
                  <p className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 truncate">{s.title}</p>
                  {sectionPct !== null ? (
                    <p className={`text-xs font-bold font-mono ${
                      sectionPct >= 80 ? 'text-green-600 dark:text-green-400' :
                      sectionPct >= 50 ? 'text-amber-600 dark:text-amber-400' :
                      'text-red-500 dark:text-red-400'
                    }`}>
                      {sectionPct}%
                    </p>
                  ) : (
                    <p className="text-[11px] text-gray-300 dark:text-gray-600">—</p>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* ── Tabs ── */}
      <div className="flex gap-2 border-b border-gray-100 dark:border-gray-700 pb-0 overflow-x-auto scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-0">
        {([
          { id: 'exercises' as const, label: '✍️ Mashqlar', desc: `${lesson.exercises.length} ta` },
          { id: 'tests' as const,     label: '🧪 Testlar',  desc: `${lesson.tests.length} ta` },
        ]).map(t => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              tab === t.id ? 'border-amber-500 text-amber-700 dark:text-amber-400' : 'border-transparent text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
            }`}>
            {t.label}
            <span className="ml-1 text-[10px] text-gray-400">({t.desc})</span>
          </button>
        ))}
      </div>

      {/* ── EXERCISES TAB ── */}
      {tab === 'exercises' && (
        <div className="space-y-4">
          {/* Section nav */}
          <div className="flex items-center gap-1.5">
            {lesson.exerciseSections.map((s, i) => {
              const done = completedSections[i] !== undefined
              const active = i === currentSection
              return (
                <button key={s.title} className="flex-1 text-left cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleJumpToSection(i)}>
                  <div className={`h-1.5 rounded-full transition-all ${done ? 'bg-green-500' : active ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                  <p className={`text-[11px] mt-0.5 text-center font-medium ${active ? 'text-amber-700 dark:text-amber-400' : done ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>
                    {s.icon} <span className="hidden sm:inline">{s.title}</span>
                  </p>
                </button>
              )
            })}
          </div>

          {/* Section header */}
          {section && (
            <div className={`rounded-xl p-4 text-white ${section.color}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold opacity-80">Bo'lim {currentSection + 1} / {lesson.exerciseSections.length}</p>
                  <p className="font-bold text-lg">{section.icon} {section.title}</p>
                  <p className="text-sm opacity-80">{section.desc}</p>
                </div>
                <div className="text-right"><p className="text-2xl font-bold">{sectionExercises.length}</p><p className="text-xs opacity-80">ta mashq</p></div>
              </div>
            </div>
          )}

          {submitted ? (
            <>
              <div className={`card border text-center py-5 ${score >= lastCheckedCount * 0.8 ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800' : score >= lastCheckedCount * 0.5 ? 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800' : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'}`}>
                <p className={`text-3xl font-bold font-mono ${score >= lastCheckedCount * 0.8 ? 'text-green-600 dark:text-green-400' : score >= lastCheckedCount * 0.5 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-500 dark:text-red-400'} mb-1`}>
                  {score}<span className="text-lg text-gray-400 dark:text-gray-500">/{lastCheckedCount}</span>
                </p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  {score === sectionExercises.length && lastCheckedCount === sectionExercises.length ? '🎯 Mukammal! Hammasi to\'g\'ri!' : score >= lastCheckedCount * 0.8 ? '👍 Zo\'r! Davom eting!' : score >= lastCheckedCount * 0.5 ? '📚 Yaxshi, qayta o\'qib chiqing' : '💪 Mavzuni takrorlang va urinib ko\'ring'}
                </p>
                <div className="flex items-center justify-center gap-3 text-xs">
                  <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 font-bold"><Trophy size={14} /> +{score * 10} XP</span>
                  <span className="flex items-center gap-1 text-green-600 dark:text-green-400"><CheckCircle size={14} /> {score}</span>
                  <span className="flex items-center gap-1 text-red-500 dark:text-red-400"><XCircle size={14} /> {lastCheckedCount - score}</span>
                </div>
                <div className="flex flex-wrap gap-2 mt-4">
                  <button onClick={() => {
                    if (exerciseDBSaveTimerRef.current) { clearTimeout(exerciseDBSaveTimerRef.current); exerciseDBSaveTimerRef.current = undefined }
                    setAnswers({}); setSubmitted(false); setScore(0); setAiResults({}); setSmartReviewMode(false); setWrongExerciseIds([])
                    try { localStorage.removeItem(`review-ex-${lesson.id}-${currentSection}`) } catch { /* ignore */ }
                    clearExerciseAnswersFromDB(lesson.id, currentSection, 'exercise')
                  }} className="btn-secondary flex-1 text-sm py-2">
                    <RotateCcw size={14} /> Tozlash
                  </button>
                  {/* Smart Review — faqat xato mashqlar */}
                  {wrongExerciseIds.length > 0 && !smartReviewMode && (
                    <button onClick={() => { setSmartReviewMode(true); setAnswers({}); setSubmitted(false); setScore(0); setAiResults({}) }}
                      className="btn-ghost flex-1 text-sm py-2 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center justify-center gap-1">
                      <Sparkles size={14} /> Xatolar ({wrongExerciseIds.length})
                    </button>
                  )}
                  {!isLastSection && (
                    <button onClick={handleNextSection} className="btn-primary flex-1 text-sm py-2 bg-amber-600 hover:bg-amber-700 border-amber-600">
                      Keyingi bo'lim <ChevronRight size={14} />
                    </button>
                  )}
                  {/* Cross-section wrong review — all sections done + there are wrong exercises */}
                  {isLastSection && allSectionsDone && consolidatedWrongIdsRef.current.size > 0 && (
                    <button onClick={() => setShowWrongReview(true)}
                      className="btn-ghost flex-1 text-sm py-2 border-red-300 text-red-600 hover:bg-red-50 dark:hover:bg-red-900/30 flex items-center justify-center gap-1">
                      <Target size={14} /> Barcha xatolar ({consolidatedWrongIdsRef.current.size})
                    </button>
                  )}
                </div>
              </div>

              {/* Batafsil natija */}
              <div className="card border-gray-200 dark:border-gray-700 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                    <Trophy size={14} className="text-yellow-600 dark:text-yellow-400" /> Batafsil natija
                  </p>
                  {wrongExerciseIds.length > 0 && (
                    <button onClick={() => { setSmartReviewMode(true); setAnswers({}); setSubmitted(false); setScore(0); setAiResults({}) }}
                      className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors flex items-center gap-1">
                      <Sparkles size={12} /> Faqat xatolarni ko'rsat
                    </button>
                  )}
                </div>
                <div className="space-y-3">
                  {sectionExercises.map((ex, i) => {
                    const userAnsArr = answers[ex.id] ?? []
                    const ok = aiResults[ex.id] ?? checkAnswer(ex, userAnsArr)
                    let userAnsStr: string; const correctStr = getCorrectText(ex)
                    if (ex.type === 'fill-blank' || ex.type === 'passage') { userAnsStr = userAnsArr.join(' / ') || "(bo'sh)" }
                    else if (ex.type === 'fill-table') { userAnsStr = '(jadval)' }
                    else { userAnsStr = userAnsArr[0] || "(bo'sh)" }
                    return (
                      <div key={ex.id} className={`rounded-xl border p-3 ${ok ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800' : 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'}`}>
                        <div className="flex items-start gap-2">
                          <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5 ${ok ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>{i + 1}</span>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs text-gray-700 dark:text-gray-300 font-medium leading-snug">
                              {getExerciseContext(ex)}
                            </p>
                            {!ok && (
                              <div className="mt-1.5 space-y-0.5">
                                <p className="text-xs"><span className="text-red-600 font-semibold">Sizniki:</span> <span className="font-mono">{userAnsStr}</span></p>
                                <p className="text-xs"><span className="text-green-600 font-semibold">To'g'ri:</span> <span className="font-mono">{correctStr}</span></p>
                                {'explanation' in ex && <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-1">{ex.explanation}</p>}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="space-y-4">
                {(smartReviewMode ? displayExercises : sectionExercises).map((ex, i) => (
                  <ExerciseCard key={ex.id} ex={ex} num={i + 1} total={sectionExercises.length} answers={answers[ex.id] ?? []}
                    onChange={(blankIdx, val) => handleChangeAnswer(ex.id, blankIdx, val)} submitted={false} />
                ))}
              </div>
              <button onClick={handleSubmitSection} disabled={isAiChecking}
                className={`btn-primary w-full flex items-center justify-center gap-2 py-3 bg-amber-600 hover:bg-amber-700 border-amber-600 ${isAiChecking ? 'opacity-70 cursor-wait' : ''}`}>
                {isAiChecking ? <><Sparkles size={18} className="animate-pulse" /> AI tekshirilmoqda...</> : <><CheckCircle size={18} /> Tekshirish (+{(smartReviewMode ? displayExercises.length : sectionExercises.length) * 10} XP)</>}
              </button>
            </>
          )}

          {Object.keys(completedSections).length > 0 && (
            <div className="card bg-amber-50 dark:bg-amber-900/20 border-amber-100 dark:border-amber-800 text-center">
              <p className="text-xs text-amber-700 dark:text-amber-400">
                Umumiy: {Object.values(completedSections).reduce((a, b) => a + b, 0)} / {lesson.exercises.length} to'g'ri
                {' · '}
                {Object.keys(completedSections).length} / {lesson.exerciseSections.length} bo'lim
              </p>
            </div>
          )}
        </div>
      )}

      {/* ── TESTS TAB ── */}
      {tab === 'tests' && (
        <div className="space-y-4">
          {/* Section nav */}
          <div className="flex items-center gap-1.5">
            {lesson.testSections.map((s, i) => {
              const done = completedTestSections[i] !== undefined
              const active = i === testSection
              return (
                <button key={s.title} className="flex-1 text-left cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleJumpToTestSection(i)}>
                  <div className={`h-1.5 rounded-full transition-all ${done ? 'bg-green-500' : active ? 'bg-amber-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                  <p className={`text-[11px] mt-0.5 text-center font-medium ${active ? 'text-amber-700 dark:text-amber-400' : done ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>
                    {s.icon} <span className="hidden sm:inline">{s.title}</span>
                  </p>
                </button>
              )
            })}
          </div>

          {(() => {
            const sec = lesson.testSections[testSection]
            if (!sec) return null
            const sectionTests = lesson.tests.filter((t): t is Extract<DailyExercise, { type: 'multiple-choice' }> => sec.ids.includes(t.id))
            return (
              <>
                <div className={`rounded-xl p-4 text-white ${sec.color}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold opacity-80">Test {testSection + 1} / {lesson.testSections.length}</p>
                      <p className="font-bold text-lg">{sec.icon} {sec.title}</p>
                      <p className="text-sm opacity-80">{sec.desc}</p>
                    </div>
                    <div className="text-right"><p className="text-2xl font-bold">{sectionTests.length}</p><p className="text-xs opacity-80">savol</p></div>
                  </div>
                </div>

                {testSubmitted ? (
                  <>
                    <div className={`card border text-center py-5 ${testScore >= sectionTests.length * 0.8 ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800' : testScore >= sectionTests.length * 0.5 ? 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800' : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'}`}>
                      <p className={`text-3xl font-bold font-mono ${testScore >= sectionTests.length * 0.8 ? 'text-green-600 dark:text-green-400' : testScore >= sectionTests.length * 0.5 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-500 dark:text-red-400'} mb-1`}>
                        {testScore}<span className="text-lg text-gray-400 dark:text-gray-500">/{sectionTests.length}</span>
                      </p>
                      <div className="flex items-center justify-center gap-3 text-xs mt-2">
                        <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 font-bold"><Trophy size={14} /> +{testScore * 10} XP</span>
                        <span className="flex items-center gap-1 text-green-600 dark:text-green-400"><CheckCircle size={14} /> {testScore}</span>
                        <span className="flex items-center gap-1 text-red-500 dark:text-red-400"><XCircle size={14} /> {sectionTests.length - testScore}</span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button onClick={() => {
                          if (testDBSaveTimerRef.current) { clearTimeout(testDBSaveTimerRef.current); testDBSaveTimerRef.current = undefined }
                          setTestAnswers({}); setTestSubmitted(false); setTestScore(0); setTestResults({})
                          try { localStorage.removeItem(`review-test-${lesson.id}-${testSection}`) } catch { /* ignore */ }
                          clearExerciseAnswersFromDB(lesson.id, testSection, 'test')
                        }} className="btn-secondary flex-1 text-sm py-2">
                          <RotateCcw size={14} /> Tozlash
                        </button>
                        {testSection < lesson.testSections.length - 1 && (
                          <button onClick={() => { setTestSection(p => p + 1); setTestAnswers({}); setTestSubmitted(false); setTestScore(0); setTestResults({}) }}
                            className="btn-primary flex-1 text-sm py-2 bg-amber-600 hover:bg-amber-700 border-amber-600">
                            Keyingi <ChevronRight size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Noto'g'ri javoblar izohi */}
                    <div className="space-y-2">
                      {sectionTests.filter(t => !testResults[t.id]).map((t, i) => (
                        <div key={t.id} className="rounded-xl border border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20 p-3">
                          <p className="text-xs font-bold text-red-600 dark:text-red-400 mb-1">✗ Savol {i + 1}: {t.question}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400"><span className="font-semibold text-red-600">Sizniki:</span> {testAnswers[t.id] || '(tanlanmadi)'}</p>
                          <p className="text-xs text-gray-600 dark:text-gray-400"><span className="font-semibold text-green-600">To'g'ri:</span> {t.correct}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400 italic mt-1">{t.explanation}</p>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-4">
                      {sectionTests.map((t, i) => {
                        const selected = testAnswers[t.id] || ''
                        return (
                          <div key={t.id} className="relative rounded-2xl border border-gray-200 dark:border-gray-700 p-4">
                            <div className="absolute -left-3 -top-3 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm bg-amber-500 text-white">{i + 1}</div>
                            <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider mb-3">🧪 Test savoli</p>
                            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-3 leading-relaxed">{t.question}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {(shuffledTestOptionsMap.get(t.id) ?? t.options).map((opt, oi) => {
                                const sel = selected === opt
                                const cls = sel
                                  ? 'border-amber-500 bg-amber-100 dark:bg-amber-900/40 text-amber-800 dark:text-amber-300 font-semibold'
                                  : 'border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-amber-400 hover:bg-amber-50 dark:hover:bg-amber-900/20'
                                return (
                                  <button key={opt} onClick={() => setTestAnswers(prev => ({ ...prev, [t.id]: opt }))}
                                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${cls}`}>
                                    <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold flex-shrink-0">{['A', 'B', 'C', 'D'][oi]}</span>
                                    {opt}
                                  </button>
                                )
                              })}
                            </div>
                          </div>
                        )
                      })}
                    </div>
                    <button onClick={handleSubmitTest} disabled={Object.keys(testAnswers).length < sectionTests.length}
                      className={`btn-primary w-full flex items-center justify-center gap-2 py-3 bg-amber-600 hover:bg-amber-700 border-amber-600 ${Object.keys(testAnswers).length < sectionTests.length ? 'opacity-50 cursor-not-allowed' : ''}`}>
                      <CheckCircle size={18} /> Testni tekshirish (+{sectionTests.length * 10} XP)
                    </button>
                  </>
                )}
              </>
            )
          })()}
        </div>
      )}
    </div>
  )
}
