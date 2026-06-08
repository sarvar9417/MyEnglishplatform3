import { useState, useEffect, useRef, useMemo } from 'react'
import { ArrowLeft, CheckCircle, XCircle, Star, Trophy, Lightbulb, RotateCcw, ChevronRight, BookOpen, Sparkles, Volume2, MessageCircle } from 'lucide-react'
import type { DailyLesson, DailyExercise } from '../../data/dailyLessons'
import type { ReadingSection as ReadingSectionType, WritingSection as WritingSectionType, ListeningSection as ListeningSectionType } from '../../data/dailyLessons'

import { useStore } from '../../store/useStore'
import { COLOR_STYLES, checkAnswer } from './helpers'
import { checkDailyExerciseAnswers } from '../../lib/claude'
import type { DailyExerciseCheckItem } from '../../lib/claude'
import { getStoryBeat, ACT_DISPLAY } from '../../data/narrative/storyline'
import { getStoryForLesson } from '../../data/narrative/storyLessonMapping'
import ExerciseCard from './ExerciseCard'
import RuleCard from './RuleCard'
import VocabLearner from './VocabLearner'
import SpecialCaseCard from './SpecialCaseCard'
import ReadingSection from './ReadingSection'
import WritingSection from './WritingSection'
import ListeningSection from './ListeningSection'
import SpeakingSection from './SpeakingSection'
import { monitoring } from '../../lib/monitoring'
import LessonImage from './LessonImage'
import LessonDemo from './LessonDemo'
import { DEMO_LESSONS } from '../../data/lessonDemoContent'

import { AudioButton } from '../ui/AudioButton'
import DialogueCard from './DialogueCard'
import CulturalNoteCard from './CulturalNoteCard'
import LessonChallengeButton from './LessonChallengeButton'
import { speak } from '../../lib/tts'
import {
  pushLessonProgress, pushTestProgress, getLessonProgress,
  loadLessonSessionFromDB, saveExerciseAnswersToDB,
  saveViewedTabsToDB, loadViewedTabsFromDB,
  loadExerciseAnswersFromDB, fetchLessonSkills, clearExerciseAnswersFromDB,
  type LoadedExerciseAnswer,
} from '../../services/lessonService'



type Answers = Record<number, string[]>

export default function LessonView({ lesson: lessonProp, onBack }: { lesson: DailyLesson; onBack: () => void }) {
  const [skillsData, setSkillsData] = useState<Record<string, { reading?: ReadingSectionType; writing?: WritingSectionType; listening?: ListeningSectionType }>>({})
  const skills = skillsData[lessonProp.id] || {}
  const lesson = { ...lessonProp, ...skills } as DailyLesson & { reading?: ReadingSectionType; writing?: WritingSectionType; listening?: ListeningSectionType }

  useEffect(() => {
    fetchLessonSkills().then(setSkillsData).catch(() => {
      monitoring.captureMessage('Failed to fetch lesson skills from DB', 'warn')
    })
  }, [])
  const { addXP, addLearnedWords, updateSkillProgress, setLessonProgress, saveLessonSession, clearLessonSession, lessonSessions } = useStore()
  const savedSession = lessonSessions[lesson.id]

  type Tab = 'theory' | 'drill' | 'reading' | 'speaking' | 'writing' | 'listening'
  // tab ham sinxron tiklanadi (avval har doim 'theory'dan boshlanardi → davom
  // etishda foydalanuvchi noto'g'ri tabga tushardi). savedSession localStorage'dan
  // store init paytida seed qilingani uchun refresh'da ham mavjud bo'ladi.
  const [tab, setTab] = useState<Tab>((savedSession?.tab as Tab) ?? 'theory')
  const [currentSection, setCurrentSection] = useState(savedSession?.currentSection ?? 0)
  const [testSection, setTestSection] = useState(savedSession?.testSection ?? 0)
  const [, setTestShuffleKey] = useState(0)
  const [testAnswers, setTestAnswers] = useState<Record<number, string>>({})
  const [testSubmitted, setTestSubmitted] = useState(false)
  const [testScore, setTestScore] = useState(0)
  const [testResults, setTestResults] = useState<Record<number, boolean>>({})
  const [completedTestSections, setCompletedTestSections] = useState<Record<number, number>>(savedSession?.completedTestSections ?? {})
  const [answers, setAnswers] = useState<Answers>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [completedSections, setCompletedSections] = useState<Record<number, number>>(savedSession?.completedSections ?? {})
  const [prevScore, setPrevScore] = useState<number | null>(null)
  const rewardedSectionsRef = useRef<Set<string>>(new Set())
  const rewardedTestSectionsRef = useRef<Set<number>>(new Set())
  // Mount'da DB'dan yuklangan BARCHA javoblar (autoritativ manba). Bo'lim almashganda
  // localStorage bo'sh bo'lsa, shu yerdan tiklanadi — localStorage'ga bog'liq emas.
  const dbAnswersRef = useRef<LoadedExerciseAnswer[]>([])
  const [, setViewedTabs] = useState<string[]>([])
  const [aiResults, setAiResults] = useState<Record<number, boolean>>({})
  const [isAiChecking, setIsAiChecking] = useState(false)
  const [vocabDone, setVocabDone] = useState(savedSession?.vocabDone ?? false)
  const [vocabPushedCount, setVocabPushedCount] = useState(savedSession?.vocabPushedCount ?? 0)
  // Boshlang'ich yuklash (local + Supabase merge) tugamaguncha saqlamaymiz —
  // aks holda mount'dagi save-effekt saqlangan sessiyani default qiymat bilan
  // ustidan yozib yuborardi (resume buziladigan poyga).
  const [hydrated, setHydrated] = useState(false)

  // Namunaviy (yangi ko'rinish) dars — agar shu dars uchun demo mavjud bo'lsa
  const demoLesson = DEMO_LESSONS[lesson.id]
  const [demoMode, setDemoMode] = useState(false)

  const section = lesson.exerciseSections[currentSection]
  const sectionExercises = lesson.exercises.filter((ex) => section?.ids.includes(ex.id))
  const isLastSection = currentSection === lesson.exerciseSections.length - 1
  const storyBeat = lesson.day ? getStoryBeat(lesson.day) : null
  const allExercisesDone = Object.keys(completedSections).length === lesson.exerciseSections.length
  const allTestsDone = Object.keys(completedTestSections).length === lesson.testSections.length
  const allDone = allExercisesDone && allTestsDone && vocabDone

  // Darsdagi umumiy foiz natija (LessonChallengeButton uchun)
  const testStarted = lesson.tests.length > 0 && Object.keys(completedTestSections).length > 0
  const totalExerciseCount = lesson.exercises.length + (testStarted ? lesson.tests.length : 0)
  const totalCorrectCount =
    Object.values(completedSections).reduce((a, b) => a + b, 0) +
    Object.values(completedTestSections).reduce((a, b) => a + b, 0)
  const currentLessonScore = totalExerciseCount > 0
    ? Math.round((totalCorrectCount / totalExerciseCount) * 100)
    : null

  const shuffledTestOptionsMap = useMemo(() => {
    const map = new Map<number, string[]>()
    const sec = lesson.testSections[testSection]
    if (!sec) return map
    const tests = lesson.tests.filter((t): t is Extract<DailyExercise, { type: 'multiple-choice' }> => sec.ids.includes(t.id) && t.type === 'multiple-choice')
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
    getLessonProgress(lesson.id).then((p) => {
      if (p !== null) setPrevScore(p)
    })
     
  }, [lesson.id])

  useEffect(() => {
    Promise.all([
      loadLessonSessionFromDB(lesson.id),
      loadExerciseAnswersFromDB(lesson.id),
      loadViewedTabsFromDB(lesson.id),
    ]).then(([remote, dbAnswers, tabs]) => {
      dbAnswersRef.current = dbAnswers   // bo'lim almashishlari uchun autoritativ manba
      let resolvedSection = savedSession?.currentSection ?? 0
      let resolvedTestSection = savedSession?.testSection ?? 0
      let resolvedCompletedSections: Record<number, number> = savedSession?.completedSections ?? {}
      let resolvedCompletedTestSections: Record<number, number> = savedSession?.completedTestSections ?? {}

      if (remote) {
        const mergedCompleted = { ...resolvedCompletedSections }
        for (const [k, v] of Object.entries(remote.completedSections)) {
          mergedCompleted[Number(k)] = Math.max(mergedCompleted[Number(k)] ?? 0, v as number)
        }
        const mergedTestCompleted = { ...resolvedCompletedTestSections }
        for (const [k, v] of Object.entries(remote.completedTestSections)) {
          mergedTestCompleted[Number(k)] = Math.max(mergedTestCompleted[Number(k)] ?? 0, v as number)
        }
        const localUpdated = savedSession?.updatedAt ?? 0
        if (remote.updatedAt > localUpdated) {
          setTab(remote.tab as Tab)
          setCurrentSection(remote.currentSection)
          setTestSection(remote.testSection)
          resolvedSection = remote.currentSection
          resolvedTestSection = remote.testSection
          if (remote.vocabDone) setVocabDone(true)
        }
        setCompletedSections(mergedCompleted)
        setCompletedTestSections(mergedTestCompleted)
        resolvedCompletedSections = mergedCompleted
        resolvedCompletedTestSections = mergedTestCompleted
      }

      const currentSectionDbEx = dbAnswers.filter(a => a.sectionIndex === resolvedSection && a.sectionType === 'exercise')
      const currentSectionDbTest = dbAnswers.filter(a => a.sectionIndex === resolvedTestSection && a.sectionType === 'test')

      if (currentSectionDbEx.length > 0) {
        const exMap: Answers = {}
        for (const a of currentSectionDbEx) exMap[a.exerciseId] = a.answer
        setAnswers(exMap)
        if (resolvedSection in resolvedCompletedSections) {
          setSubmitted(true)
          setScore(resolvedCompletedSections[resolvedSection] ?? 0)
        }
      } else {
        try {
          const saved = localStorage.getItem(`exercise-answers-${lesson.id}-${resolvedSection}`)
          if (saved) {
            const data = JSON.parse(saved)
            if (data.answers) setAnswers(data.answers)
            if (data.submitted != null) setSubmitted(data.submitted)
            if (data.score != null) setScore(data.score)
          }
        } catch {
          monitoring.captureMessage('Failed to parse localStorage exercise state', 'warn')
        }
      }

      if (currentSectionDbTest.length > 0) {
        const tMap: Record<number, string> = {}
        const tRes: Record<number, boolean> = {}
        for (const a of currentSectionDbTest) {
          tMap[a.exerciseId] = a.answer[0] ?? ''
          tRes[a.exerciseId] = a.isCorrect
        }
        setTestAnswers(tMap)
        if (resolvedTestSection in resolvedCompletedTestSections) {
          setTestResults(tRes); setTestSubmitted(true); setTestScore(resolvedCompletedTestSections[resolvedTestSection] ?? 0)
        }
      } else {
        try {
          const saved = localStorage.getItem(`test-state-${lesson.id}-${resolvedTestSection}`)
          if (saved) {
            const data = JSON.parse(saved)
            if (data.testAnswers) setTestAnswers(data.testAnswers)
            if (data.testSubmitted != null) setTestSubmitted(data.testSubmitted)
            if (data.testScore != null) setTestScore(data.testScore)
            if (data.testResults) setTestResults(data.testResults)
          }
        } catch {
          monitoring.captureMessage('Failed to parse localStorage test state', 'warn')
        }
      }

      // ── BARCHA bo'limlar javoblarini DB dan localStorage'ga hidratsiya ──
      // (mount faqat joriy bo'limni state'ga yuklaydi; handleJumpToSection esa
      //  localStorage'dan o'qiydi. Bu yerda har bo'lim javobini localStorage'ga
      //  yozamiz, shunda istalgan bo'limga o'tilganda javoblar tiklanadi — faqat
      //  birinchi bo'lim emas. Mavjud localStorage ustiga yozilmaydi — u ustun.)
      const exBySection = new Map<number, Answers>()
      for (const a of dbAnswers.filter(a => a.sectionType === 'exercise')) {
        if (!exBySection.has(a.sectionIndex)) exBySection.set(a.sectionIndex, {})
        exBySection.get(a.sectionIndex)![a.exerciseId] = a.answer
      }
      for (const [idx, ansMap] of exBySection) {
        const key = `exercise-answers-${lesson.id}-${idx}`
        const existing = localStorage.getItem(key)
        if (existing) { try { const d = JSON.parse(existing); if (d?.answers && Object.keys(d.answers).length > 0) continue } catch { /* buzuq — qayta yozamiz */ } }
        try {
          localStorage.setItem(key, JSON.stringify({
            answers: ansMap,
            submitted: idx in resolvedCompletedSections,
            score: resolvedCompletedSections[idx] ?? 0,
          }))
        } catch { /* ignore */ }
      }

      const tsBySection = new Map<number, Record<number, string>>()
      const tsResBySection = new Map<number, Record<number, boolean>>()
      for (const a of dbAnswers.filter(a => a.sectionType === 'test')) {
        if (!tsBySection.has(a.sectionIndex)) { tsBySection.set(a.sectionIndex, {}); tsResBySection.set(a.sectionIndex, {}) }
        tsBySection.get(a.sectionIndex)![a.exerciseId] = a.answer[0] ?? ''
        tsResBySection.get(a.sectionIndex)![a.exerciseId] = a.isCorrect
      }
      for (const [idx, tMap] of tsBySection) {
        const key = `test-state-${lesson.id}-${idx}`
        const existing = localStorage.getItem(key)
        if (existing) { try { const d = JSON.parse(existing); if (d?.testAnswers && Object.keys(d.testAnswers).length > 0) continue } catch { /* buzuq — qayta yozamiz */ } }
        try {
          localStorage.setItem(key, JSON.stringify({
            testAnswers: tMap,
            testSubmitted: idx in resolvedCompletedTestSections,
            testScore: resolvedCompletedTestSections[idx] ?? 0,
            testResults: tsResBySection.get(idx) ?? {},
          }))
        } catch { /* ignore */ }
      }

      if (tabs.length > 0) setViewedTabs(tabs)
    }).catch(() => {
      monitoring.captureMessage('Failed to load lesson data from DB', 'warn')
    }).finally(() => {
      setHydrated(true)
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lesson.id])

  const prevTabRef = useRef(tab)
  useEffect(() => {
    if (prevTabRef.current !== tab) {
      prevTabRef.current = tab
      setViewedTabs(prev => {
        const newViewed = prev.includes(tab) ? prev : [...prev, tab]
        saveViewedTabsToDB(lesson.id, newViewed)
        return newViewed
      })
    }
  }, [tab, lesson.id])

  useEffect(() => {
    if (allDone) {
      clearLessonSession(lesson.id)
    }
  }, [allDone, lesson.id, clearLessonSession])

  useEffect(() => {
    if (!hydrated || allDone) return
    saveLessonSession(lesson.id, { tab, currentSection, testSection, completedSections, completedTestSections, vocabDone, vocabPushedCount, updatedAt: Date.now() })
  }, [hydrated, tab, currentSection, testSection, completedSections, completedTestSections, vocabDone, vocabPushedCount, allDone, lesson.id, saveLessonSession])

  const exerciseStorageKey = `exercise-answers-${lesson.id}-${currentSection}`
  const prevExerciseStateRef = useRef({ answers, submitted, score })
  const exerciseDBSaveTimerRef = useRef<ReturnType<typeof setTimeout>>()
  const scrollTimerRef = useRef<ReturnType<typeof setTimeout>>()
  useEffect(() => {
    const cur = { answers, submitted, score }
    if (JSON.stringify(cur) === JSON.stringify(prevExerciseStateRef.current)) return
    prevExerciseStateRef.current = cur
    try { localStorage.setItem(exerciseStorageKey, JSON.stringify(cur)) } catch {
      monitoring.captureMessage('localStorage write failed (exercise state)', 'warn')
    }
    if (exerciseDBSaveTimerRef.current) clearTimeout(exerciseDBSaveTimerRef.current)
    if (!submitted && sectionExercises.length > 0) {
      const payloads = sectionExercises.filter(ex => (answers[ex.id] ?? []).some(a => a.trim())).map(ex => ({
        exerciseId: ex.id, exerciseType: ex.type, answer: answers[ex.id] ?? [], isCorrect: false,
      }))
      if (payloads.length > 0) {
        exerciseDBSaveTimerRef.current = setTimeout(() => {
          saveExerciseAnswersToDB(lesson.id, currentSection, 'exercise', payloads)
        }, 2000)
      }
    }
  }, [answers, submitted, score, exerciseStorageKey, currentSection, lesson.id, sectionExercises])

  const testStorageKey = `test-state-${lesson.id}-${testSection}`
  const prevTestStateRef = useRef({ testAnswers, testSubmitted, testScore, testResults })
  const testDBSaveTimerRef = useRef<ReturnType<typeof setTimeout>>()
  useEffect(() => {
    const cur = { testAnswers, testSubmitted, testScore, testResults }
    if (JSON.stringify(cur) === JSON.stringify(prevTestStateRef.current)) return
    prevTestStateRef.current = cur
    try { localStorage.setItem(testStorageKey, JSON.stringify(cur)) } catch {
      monitoring.captureMessage('localStorage write failed (test state)', 'warn')
    }
    if (testDBSaveTimerRef.current) clearTimeout(testDBSaveTimerRef.current)
    if (!testSubmitted && Object.keys(testAnswers).length > 0) {
      testDBSaveTimerRef.current = setTimeout(() => {
        const section = lesson.testSections[testSection]
        if (!section) return
        const sectionTests = lesson.tests.filter(t => section.ids.includes(t.id))
        const payloads = sectionTests.filter(t => testAnswers[t.id]).map(t => ({
          exerciseId: t.id, exerciseType: t.type, answer: [testAnswers[t.id]], isCorrect: false,
        }))
        if (payloads.length > 0) saveExerciseAnswersToDB(lesson.id, testSection, 'test', payloads)
      }, 1000)
    }
  }, [testAnswers, testSubmitted, testScore, testResults, testStorageKey, testSection, lesson.id, lesson.testSections, lesson.tests])

  useEffect(() => {
    return () => {
      if (exerciseDBSaveTimerRef.current) clearTimeout(exerciseDBSaveTimerRef.current)
      if (testDBSaveTimerRef.current) clearTimeout(testDBSaveTimerRef.current)
      if (scrollTimerRef.current) clearTimeout(scrollTimerRef.current)
    }
  }, [])

  const handleChangeAnswer = (exId: number, blankIdx: number, val: string) => {
    setAnswers((prev) => {
      const cur = [...(prev[exId] ?? [])]
      cur[blankIdx] = val
      return { ...prev, [exId]: cur }
    })
  }

  const handleSubmitSection = async () => {
    setIsAiChecking(true)
    let correct = 0
    const answerPayloads: { exerciseId: number; exerciseType: string; answer: string[]; isCorrect: boolean }[] = []
    const wrongItems: DailyExerciseCheckItem[] = []

    for (const ex of sectionExercises) {
      const userAns = answers[ex.id] ?? []
      const ok = checkAnswer(ex, userAns)
      if (ok) correct++
      else {
        let context = ''
        let correctStr = ''
        let userAnsStr = ''
        if (ex.type === 'fill-blank') {
          context = ex.question
          correctStr = ex.blanks.join(' / ')
          userAnsStr = userAns.join(' / ')
        } else if (ex.type === 'fill-table') {
          context = ex.instruction
          correctStr = ex.rows.map(r => `${r.adj}: comp=${r.comp}, sup=${r.sup}`).join('; ')
          userAnsStr = ex.rows.map((r, idx) => `${r.adj}: comp=${userAns[idx * 2] || '—'}, sup=${userAns[idx * 2 + 1] || '—'}`).join('; ')
        } else {
          context = ex.type === 'vocab-match' ? ex.word : ex.question
          correctStr = ex.correct
          userAnsStr = userAns[0] ?? ''
        }
        wrongItems.push({ id: ex.id, context, correct: correctStr, userAnswer: userAnsStr, type: ex.type })
      }
      answerPayloads.push({ exerciseId: ex.id, exerciseType: ex.type, answer: userAns, isCorrect: ok })
    }

    try {
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
      monitoring.captureMessage('AI check failed, using deterministic results', 'warn')
    }
    }

    setAiResults(newAiResults)
    setScore(correct)
    setSubmitted(true)
    setCompletedSections((prev) => ({ ...prev, [currentSection]: correct }))
    const sectionKey = `${currentSection}`
    if (!rewardedSectionsRef.current.has(sectionKey)) {
      rewardedSectionsRef.current.add(sectionKey)
      addXP(correct * 10)
    }
    saveExerciseAnswersToDB(lesson.id, currentSection, 'exercise', answerPayloads)
    } finally {
      setIsAiChecking(false)
    }

    // Har bo'lim tugagach progress yangilanadi
    // Testlar faqat BOSHLANGAN bo'lsa  (hech bo'lmaganda 1 section topshirilgan) combined hisobga qo'shiladi.
    // Aks holda faqat exercise'lar bo'yicha hisoblanadi — bu cross-device sync'da
    // test hali bajarilmagan dars 100% ko'rinishi uchun kerak.
    const updatedSections = { ...completedSections, [currentSection]: correct }
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

    if (isLastSection) {
      updateSkillProgress('todayGrammarPct', combinedPct)
      pushLessonProgress(lesson.id, exerciseCorrect, lesson.exercises.length).catch(() => {
        monitoring.captureMessage('pushLessonProgress failed (non-critical)', 'warn')
      })
    }
  }

  // ── Bo'lim holatini tiklash: localStorage (jonli, joriy sessiya) → bo'sh bo'lsa
  //    mount'da DB'dan yuklangan javoblar (autoritativ). localStorage'ga bog'liq emas. ──
  const loadExerciseSectionState = (idx: number): { answers: Answers; submitted: boolean; score: number } => {
    try {
      const saved = localStorage.getItem(`exercise-answers-${lesson.id}-${idx}`)
      if (saved) {
        const d = JSON.parse(saved)
        if (d?.answers && Object.keys(d.answers).length > 0) {
          return { answers: d.answers, submitted: !!d.submitted, score: d.score ?? 0 }
        }
      }
    } catch { /* ignore */ }
    const rows = dbAnswersRef.current.filter(a => a.sectionIndex === idx && a.sectionType === 'exercise')
    if (rows.length > 0) {
      const ans: Answers = {}
      for (const a of rows) ans[a.exerciseId] = a.answer
      return { answers: ans, submitted: idx in completedSections, score: completedSections[idx] ?? 0 }
    }
    return { answers: {}, submitted: false, score: 0 }
  }

  const loadTestSectionState = (idx: number): { testAnswers: Record<number, string>; testSubmitted: boolean; testScore: number; testResults: Record<number, boolean> } => {
    try {
      const saved = localStorage.getItem(`test-state-${lesson.id}-${idx}`)
      if (saved) {
        const d = JSON.parse(saved)
        if (d?.testAnswers && Object.keys(d.testAnswers).length > 0) {
          return { testAnswers: d.testAnswers, testSubmitted: !!d.testSubmitted, testScore: d.testScore ?? 0, testResults: d.testResults ?? {} }
        }
      }
    } catch { /* ignore */ }
    const rows = dbAnswersRef.current.filter(a => a.sectionIndex === idx && a.sectionType === 'test')
    if (rows.length > 0) {
      const ta: Record<number, string> = {}
      const tr: Record<number, boolean> = {}
      for (const a of rows) { ta[a.exerciseId] = a.answer[0] ?? ''; tr[a.exerciseId] = a.isCorrect }
      return { testAnswers: ta, testSubmitted: idx in completedTestSections, testScore: completedTestSections[idx] ?? 0, testResults: tr }
    }
    return { testAnswers: {}, testSubmitted: false, testScore: 0, testResults: {} }
  }

  const handleNextSection = () => {
    if (exerciseDBSaveTimerRef.current) { clearTimeout(exerciseDBSaveTimerRef.current); exerciseDBSaveTimerRef.current = undefined }
    const payloads = sectionExercises.filter(ex => (answers[ex.id] ?? []).some(a => a.trim())).map(ex => ({
      exerciseId: ex.id, exerciseType: ex.type, answer: answers[ex.id] ?? [], isCorrect: false,
    }))
    if (payloads.length > 0) saveExerciseAnswersToDB(lesson.id, currentSection, 'exercise', payloads)
    const nextIdx = currentSection + 1
    const st = loadExerciseSectionState(nextIdx)
    setAnswers(st.answers); setSubmitted(st.submitted); setScore(st.score); setAiResults({})
    setCurrentSection(nextIdx); scrollToTop()
  }

  const scrollToTop = () => {
    clearTimeout(scrollTimerRef.current)
    scrollTimerRef.current = setTimeout(() => { try { window.scrollTo({ top: 0, behavior: 'smooth' }) } catch {/* jsdom guard */} }, 50)
  }

  // "Tozlash" — shu bo'lim javoblarini ekran + localStorage + DB dan butunlay o'chiradi
  const handleClearSection = () => {
    if (exerciseDBSaveTimerRef.current) { clearTimeout(exerciseDBSaveTimerRef.current); exerciseDBSaveTimerRef.current = undefined }
    setAnswers({}); setSubmitted(false); setScore(0); setAiResults({})
    try { localStorage.removeItem(exerciseStorageKey) } catch { /* ignore */ }
    clearExerciseAnswersFromDB(lesson.id, currentSection, 'exercise')
  }

  const handleJumpToSection = (idx: number) => {
    if (idx === currentSection) return
    if (exerciseDBSaveTimerRef.current) { clearTimeout(exerciseDBSaveTimerRef.current); exerciseDBSaveTimerRef.current = undefined }
    const payloads = sectionExercises.filter(ex => (answers[ex.id] ?? []).some(a => a.trim())).map(ex => ({
      exerciseId: ex.id, exerciseType: ex.type, answer: answers[ex.id] ?? [], isCorrect: false,
    }))
    if (payloads.length > 0) saveExerciseAnswersToDB(lesson.id, currentSection, 'exercise', payloads)
    const st = loadExerciseSectionState(idx)
    setAnswers(st.answers); setSubmitted(st.submitted); setScore(st.score); setAiResults({})
    setCurrentSection(idx)
    scrollToTop()
  }

  const handleJumpToTestSection = (idx: number) => {
    if (idx === testSection) return
    if (testDBSaveTimerRef.current) { clearTimeout(testDBSaveTimerRef.current); testDBSaveTimerRef.current = undefined }
    // joriy test bo'limini DB'ga saqlash (almashganda yo'qotmaslik uchun)
    const curSec = lesson.testSections[testSection]
    if (curSec) {
      const payloads = lesson.tests.filter(t => curSec.ids.includes(t.id) && testAnswers[t.id]).map(t => ({
        exerciseId: t.id, exerciseType: t.type, answer: [testAnswers[t.id]], isCorrect: !!testResults[t.id],
      }))
      if (payloads.length > 0) saveExerciseAnswersToDB(lesson.id, testSection, 'test', payloads)
    }
    const st = loadTestSectionState(idx)
    setTestAnswers(st.testAnswers); setTestSubmitted(st.testSubmitted); setTestScore(st.testScore); setTestResults(st.testResults)
    setTestSection(idx)
    scrollToTop()
  }

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'theory',    label: 'Nazariya',  icon: '📖' },
    { id: 'drill',     label: 'Mashqlar',  icon: '⚡' },
    ...(lesson.reading ? [{ id: 'reading' as Tab, label: "O'qish", icon: '📰' }] : []),
    { id: 'speaking' as Tab, label: 'Gapirish', icon: '🎤' },  // AI tomonidan mavzuga oid generatsiya
    ...(lesson.writing ? [{ id: 'writing' as Tab, label: 'Yozish', icon: '✍️' }] : []),
    ...(lesson.listening ? [{ id: 'listening' as Tab, label: 'Tinglash', icon: '🎧' }] : []),
  ]

  // ── Namunaviy (yangi ko'rinish) dars rejimi ──
  if (demoMode && demoLesson) {
    return <LessonDemo lesson={demoLesson} onExit={() => setDemoMode(false)} />
  }

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto space-y-4 sm:space-y-5">
      <div className="flex items-center gap-2 sm:gap-3">
        <button onClick={onBack} className="btn-ghost flex items-center gap-1 text-sm">
          <ArrowLeft size={16} /> Boshqa dars
        </button>
        <div className="h-5 w-px bg-gray-200 dark:bg-gray-700" />
        <span className="badge border bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700">{lesson.level}</span>
        <span className="text-xs text-gray-400 dark:text-gray-500">Kun {lesson.day}</span>
        {prevScore !== null && (
          <span className={`badge text-xs font-bold ${prevScore >= 80 ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400' : prevScore >= 50 ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400' : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'}`}>
            {prevScore}% ✅
          </span>
        )}
      </div>

      {/* ── Namunaviy (yangi ko'rinish) dars tugmasi — faqat demo bor darslarda ── */}
      {demoLesson && (
        <button
          onClick={() => setDemoMode(true)}
          className="w-full rounded-2xl p-4 flex items-center gap-4 text-left
            bg-gradient-to-r from-violet-500 to-purple-600
            hover:from-violet-600 hover:to-purple-700 transition-all shadow-lg active:scale-[0.98]"
        >
          <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shrink-0">🎮</div>
          <div className="flex-1 min-w-0">
            <p className="text-white font-black text-base">Yangi ko'rinishda o'rganish</p>
            <p className="text-white/80 text-xs">Duolingo uslubida — qiziqarli, qadam-qadam, o'yin shaklida</p>
          </div>
          <span className="text-white/90 font-bold text-sm bg-white/20 px-3 py-1.5 rounded-xl shrink-0">Boshlash →</span>
        </button>
      )}
      {/* ── Dars boshida do'stni chaqirish ── */}
      <LessonChallengeButton
        lesson={lesson}
        lessonCompleted={allDone}
        lessonScore={currentLessonScore}
      />

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{lesson.title}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1">{lesson.subtitle}</p>
      </div>

      {/* Pill-style tab bar */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-700 rounded-xl">
        {tabs.map((t) => (
          <button key={t.id} onClick={() => setTab(t.id)}
            className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
              tab === t.id
                ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-white shadow-sm'
                : 'text-gray-500 hover:text-gray-700 dark:text-gray-400'
            }`}>
            <span>{t.icon}</span>
            <span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>

      {/* ── THEORY TAB ── */}
      {tab === 'theory' && (
        <div className="space-y-6">
          {/* O'rganish yo'li konteksti — dars boshida */}
          {storyBeat && (() => {
            const act = ACT_DISPLAY[storyBeat.act] ?? ACT_DISPLAY.prologue
            const progress = Math.min(100, Math.round(((lesson.day ?? 1) / 99) * 100))
            const link = getStoryForLesson(lesson.id)
            return (
              <div className={`rounded-xl border ${act.borderClass} overflow-hidden`}>
                {/* Colored top strip */}
                <div className={`h-1.5 w-full ${act.bgClass}`} />

                <div className="p-4 bg-white dark:bg-gray-800">
                  <div className="flex items-start gap-4">
                    {/* Act emoji circle */}
                    <div
                      className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shrink-0 ${act.lightBgClass}`}
                      style={{ border: `2px solid ${act.color}` }}
                    >
                      {storyBeat.emoji}
                    </div>

                    <div className="min-w-0 flex-1">
                      {/* Badge row */}
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full text-white ${act.bgClass}`}>
                          {act.emoji} {act.label}
                        </span>
                        <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
                          {storyBeat.location}
                        </span>
                        <span className="text-[11px] font-medium text-gray-300 dark:text-gray-600">·</span>
                        <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500">
                          Kun {lesson.day}/99
                        </span>
                      </div>

                      {/* Lesson hint */}
                      <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
                        {storyBeat.lessonHint}
                      </p>

                      {/* Scene description */}
                      {link && (
                        <p className={`text-xs mt-2 italic leading-relaxed ${act.textClass}`}>
                          🎬 {link.scene}
                        </p>
                      )}

                      {/* Mini progress bar */}
                      <div className="mt-3 flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-500`}
                            style={{
                              width: `${progress}%`,
                              background: `linear-gradient(90deg, ${act.color}, ${act.color}dd)`,
                            }}
                          />
                        </div>
                        <span className="text-[11px] font-medium text-gray-400 dark:text-gray-500 whitespace-nowrap">
                          {progress}% yo'l
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })()}


          {/* Lesson image — dars ochilganda eng tepada vizual sxema */}
          {lesson.image && <LessonImage filename={lesson.image} title={lesson.title} />}

          {/* Grammar: Formulas */}
          <div className="bg-gradient-to-br from-primary-600 to-b2-600 rounded-2xl p-5 text-white">
            <p className="text-xs font-semibold opacity-70 mb-3 uppercase tracking-wider">Formulalar</p>
            <div className="grid grid-cols-1 gap-2">
              {lesson.formulas.map((row) => {
                const s = COLOR_STYLES[row.color] ?? COLOR_STYLES.blue
                return (
                  <div key={row.label} className={`flex items-center gap-3 ${s.bg} ${s.border} border rounded-xl px-3 py-2`}>
                    <span className={`text-xs font-semibold ${s.text} w-32 flex-shrink-0`}>{row.label}</span>
                    <span className={`font-mono text-sm font-bold ${s.text}`}>{row.structure}</span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Grammar: Rules */}
          <div className="space-y-4">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen size={14} /> Qoidalar
            </p>
            {lesson.rules.map((r, i) => <RuleCard key={i} rule={r} index={i} />)}
          </div>

          {/* Special table (only comparatives-superlatives) */}
          {lesson.id === 'comparatives-superlatives' && (
            <div className="card border-primary-200">
              <p className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-3 flex items-center gap-1">
                <Star size={14} /> Tezkor eslatma — yodda saqlash uchun
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b-2 border-primary-200 text-left text-xs text-primary-700 uppercase tracking-wider">
                      <th className="pb-2 pr-3">Sifat turi</th>
                      <th className="pb-2 pr-3">Comparative</th>
                      <th className="pb-2 pr-3">Superlative</th>
                      <th className="pb-2">Misol</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[
                      { type: '1 bo\'g\'in (qisqa)', comp: 'adj + -er', sup: 'the adj + -est', ex: 'tall → taller → the tallest' },
                      { type: '-y bilan tugagan', comp: '-y → -i + -er', sup: 'the -y → -i + -est', ex: 'happy → happier → the happiest' },
                      { type: 'CVC (undosh+unli+undosh)', comp: 'undosh ikki marta + -er', sup: 'the undosh×2 + -est', ex: 'big → bigger → the biggest' },
                      { type: '-e bilan tugagan', comp: 'adj + -r', sup: 'the adj + -st', ex: 'large → larger → the largest' },
                      { type: '2+ bo\'g\'in (uzun)', comp: 'more + adj', sup: 'the most + adj', ex: 'expensive → more expensive → the most expensive' },
                      { type: 'Noto\'g\'ri', comp: 'maxsus shakl', sup: 'maxsus shakl', ex: 'good → better → the best' },
                    ].map((r) => (
                      <tr key={r.type} className="border-b border-gray-50">
                        <td className="py-1.5 pr-3 font-semibold text-gray-800 text-xs">{r.type}</td>
                        <td className="py-1.5 pr-3 font-mono text-xs text-purple-700">{r.comp}</td>
                        <td className="py-1.5 pr-3 font-mono text-xs text-indigo-700">{r.sup}</td>
                        <td className="py-1.5 font-mono text-xs text-gray-600">{r.ex}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Vocabulary */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
            <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">📝 Lug'at — {lesson.vocabulary.length} ta so'z</p>
            <VocabLearner vocab={lesson.vocabulary} addXP={addXP} lessonId={lesson.id} lessonLevel={lesson.level} onVocabDone={(pushedCount) => { setVocabDone(true); setVocabPushedCount(prev => Math.max(prev, pushedCount)); if (pushedCount > 0) addLearnedWords(pushedCount) }} />
          </div>

          {/* Examples — with AudioButton for pronunciation */}
          <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">📖 Misollar — {lesson.examples.length} ta gap</p>
              <button
                onClick={() => {
                  const allText = lesson.examples.map(e => e.en).join('. ')
                  speak(allText, { rate: 0.85 }).catch((e) => monitoring.captureMessage('LessonView speak all failed: ' + (e instanceof Error ? e.message : String(e)), 'warn'))
                }}
                className="flex items-center gap-1 text-[11px] font-medium text-primary-600 hover:text-primary-700 transition-colors"
                title="Barcha misollarni tinglash"
                aria-label="Barcha misollarni tinglash"
              >
                <Volume2 size={12} /> Hammasini tinglash
              </button>
            </div>
            <div className="space-y-3">
              {lesson.examples.map((ex, i) => (
                <div key={i} className="flex items-start gap-3 border-l-4 border-primary-300 pl-4">
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-gray-100 text-sm leading-relaxed">{ex.en}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 italic">{ex.uz}</p>
                  </div>
                  <AudioButton text={ex.en} size="sm" className="mt-0.5 shrink-0" label={`${ex.en} ni tinglash`} />
                </div>
              ))}
            </div>
          </div>

          {/* Special Cases */}
          {lesson.specialCases.length > 0 && (
            <div className="pt-2 border-t border-gray-100 dark:border-gray-700">
              <p className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-3 flex items-center gap-1">
                <Star size={14} /> Maxsus holatlar — yodda saqlash uchun alohida e'tibor
              </p>
              {lesson.specialCases.map((sc) => <SpecialCaseCard key={sc.id} sc={sc} addXP={addXP} lessonId={lesson.id} />)}
            </div>
          )}

          {/* Dialogues section */}
          {lesson.dialogues && lesson.dialogues.length > 0 && (
            <div className="pt-2 border-t border-gray-100 dark:border-gray-700 space-y-3">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <MessageCircle size={14} /> Real-life dialogues — {lesson.dialogues.length} ta
              </p>
              {lesson.dialogues.map((d) => (
                <DialogueCard key={d.id} dialogue={d} />
              ))}
            </div>
          )}

          {/* Cultural notes section */}
          {lesson.culturalNotes && lesson.culturalNotes.length > 0 && (
            <div className="pt-2 border-t border-gray-100 dark:border-gray-700 space-y-3">
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                <Lightbulb size={14} /> Cultural context — {lesson.culturalNotes.length} ta
              </p>
              {lesson.culturalNotes.map((n) => (
                <CulturalNoteCard key={n.id} note={n} />
              ))}
            </div>
          )}


          <div className="card bg-gradient-to-r from-primary-50 dark:from-primary-900/30 to-b2-50 dark:to-b2-900/30 border-primary-100 dark:border-primary-800">
            <p className="text-sm text-primary-800 dark:text-primary-300 font-medium flex items-center gap-2">
              <Lightbulb size={16} />
              Keyingi bosqichda <strong>{lesson.vocabulary.length} ta so'z</strong> va <strong>{lesson.exercises.length} ta mashq</strong> bor. Har to'g'ri javob <strong>+10 XP</strong>.
            </p>
          </div>
        </div>
      )}

      {/* ── DRILL TAB: Exercises ── */}
      {tab === 'drill' && (
        <div className="space-y-5">
          {/* Exercise sections progress */}
          <div className="space-y-4">
            <div className="flex items-center gap-1.5">
              {lesson.exerciseSections.map((s, i) => {
                const done = completedSections[i] !== undefined
                const active = i === currentSection
                return (
                  <button key={s.title} className="flex-1 text-left cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleJumpToSection(i)}>
                    <div className={`h-1.5 rounded-full transition-all ${done ? 'bg-green-500' : active ? 'bg-primary-500' : 'bg-gray-200'}`} />
                    <p className={`text-[11px] mt-0.5 text-center font-medium ${active ? 'text-primary-700' : done ? 'text-green-600' : 'text-gray-400'}`}>
                      {s.icon} <span className="hidden sm:inline">{s.title}</span>
                    </p>
                  </button>
                )
              })}
            </div>

            {section && (
              <div className={`rounded-xl p-4 text-white ${section.color}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs font-semibold opacity-80">Bosqich {currentSection + 1} / {lesson.exerciseSections.length}</p>
                    <p className="font-bold text-lg">{section.icon} {section.title}</p>
                    <p className="text-sm opacity-80">{section.desc}</p>
                  </div>
                  <div className="text-right"><p className="text-2xl font-bold">{sectionExercises.length}</p><p className="text-xs opacity-80">ta mashq</p></div>
                </div>
              </div>
            )}

            {submitted ? (
              <>
                <div className={`card border text-center py-5 ${score >= 8 ? 'bg-green-50 border-green-200' : score >= 5 ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
                  <p className={`text-3xl font-bold font-mono ${score >= 8 ? 'text-green-600' : score >= 5 ? 'text-yellow-600' : 'text-red-500'} mb-1`}>
                    {score}<span className="text-lg text-gray-400">/{sectionExercises.length}</span>
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                    {score === sectionExercises.length ? '🎯 Mukammal! Hech qanday xato yo\'q!' :
                     score >= 8 ? '👍 Zo\'r! Davom eting!' :
                     score >= 5 ? '📚 Yaxshi, biroz ko\'proq e\'tibor kerak' :
                     '💪 Qiyin bo\'ldimi? Qayta urinib ko\'ring'}
                  </p>
                  <div className="flex items-center justify-center gap-3 text-xs">
                    <span className="flex items-center gap-1 text-yellow-600 font-bold"><Trophy size={14} /> +{score * 10} XP</span>
                    <span className="flex items-center gap-1 text-green-600"><CheckCircle size={14} /> {score}</span>
                    <span className="flex items-center gap-1 text-red-500"><XCircle size={14} /> {sectionExercises.length - score}</span>
                  </div>
                  <div className="flex gap-2 mt-4">
                    <button onClick={handleClearSection} className="btn-secondary flex-1 text-sm py-2"><RotateCcw size={14} /> Tozlash</button>
                    {!isLastSection && <button onClick={handleNextSection} className="btn-primary flex-1 text-sm py-2">Keyingi bosqich <ChevronRight size={14} /></button>}
                  </div>
                </div>

                <div className="card border-gray-200 dark:border-gray-700 overflow-hidden">
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                      <Trophy size={14} className="text-yellow-600 dark:text-yellow-400" /> Batafsil natija
                    </p>
                    <span className="text-[11px] text-gray-400 dark:text-gray-500">{sectionExercises.length} ta mashq</span>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b-2 border-gray-100 dark:border-gray-700 text-left text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                          <th className="pb-2 pr-2 font-semibold w-8">#</th>
                          <th className="pb-2 pr-3 font-semibold">Savol</th>
                          <th className="pb-2 pr-3 font-semibold">Sizning javobingiz</th>
                          <th className="pb-2 pr-3 font-semibold">To'g'ri javob</th>
                          <th className="pb-2 font-semibold w-10">Natija</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sectionExercises.map((ex, i) => {
                          const userAnsArr = answers[ex.id] ?? []
                          const ok = aiResults[ex.id] ?? checkAnswer(ex, userAnsArr)
                          let userAnsStr: string; let correctStr: string
                          if (ex.type === 'fill-blank') { userAnsStr = userAnsArr.join(' / ') || "(bo'sh)"; correctStr = ex.blanks.join(' / ') }
                          else if (ex.type === 'fill-table') {
                            const parts = ex.rows.map((r, idx) => `${r.adj}: C=${userAnsArr[idx * 2] ?? '—'} S=${userAnsArr[idx * 2 + 1] ?? '—'}`)
                            userAnsStr = parts.join('; ')
                            correctStr = ex.rows.map((r) => `${r.adj}: C=${r.comp || '—'} S=${r.sup || '—'}`).join('; ')
                          } else { userAnsStr = userAnsArr[0] || "(bo'sh)"; correctStr = ex.correct }
                          return (
                            <tr key={ex.id} className={`border-b border-gray-50 dark:border-gray-800 ${ok ? 'bg-green-50/40 dark:bg-green-900/20' : 'bg-red-50/40 dark:bg-red-900/20'}`}>
                              <td className="py-2.5 pr-2 text-xs font-bold text-gray-600">{i + 1}</td>
                              <td className="py-2.5 pr-3"><p className="text-xs text-gray-800 font-medium leading-snug line-clamp-2">
                                {ex.type === 'fill-blank' ? ex.question.replace(/_{3,}/g, '___') : ex.type === 'fill-table' ? ex.instruction : ex.type === 'vocab-match' ? ex.word : ex.question}
                              </p></td>
                              <td className="py-2.5 pr-3"><span className={`inline-block text-xs font-mono font-semibold px-1.5 py-0.5 rounded max-w-[400px] ${ok ? 'text-green-700' : 'bg-red-100 text-red-700'}`}>{userAnsStr}</span></td>
                              <td className="py-2.5 pr-3"><span className="inline-block text-xs font-mono font-semibold text-green-700 bg-green-100 px-1.5 py-0.5 rounded max-w-[400px]">{correctStr}</span></td>
                              <td className="py-2.5"><span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${ok ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>{ok ? '✓' : '✗'}</span></td>
                            </tr>
                          )
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-4">
                  {sectionExercises.map((ex, i) => (
                    <ExerciseCard key={ex.id} ex={ex} num={i + 1} total={sectionExercises.length} answers={answers[ex.id] ?? []}
                      onChange={(blankIdx, val) => handleChangeAnswer(ex.id, blankIdx, val)} submitted={false} />
                  ))}
                </div>
                <button onClick={handleSubmitSection} disabled={isAiChecking} className={`btn-primary w-full flex items-center justify-center gap-2 py-3 ${isAiChecking ? 'opacity-70 cursor-wait' : ''}`}>
                  {isAiChecking ? <><Sparkles size={18} className="animate-pulse" /> AI tekshirilmoqda...</> : <><CheckCircle size={18} /> Tekshirish (+{sectionExercises.length * 10} XP)</>}
                </button>
              </>
            )}

            {Object.keys(completedSections).length > 0 && (
              <div className="card bg-gray-50 border-gray-100 text-center">
                <p className="text-xs text-gray-500">
                  Umumiy: {Object.values(completedSections).reduce((a, b) => a + b, 0)} / {lesson.exercises.length} ta to'g'ri
                  {' · '}
                  {lesson.exerciseSections.filter((_, i) => completedSections[i] !== undefined).length} / {lesson.exerciseSections.length} bosqich
                </p>
              </div>
            )}
          </div>

          {/* Test sections divider */}
          {lesson.testSections.length > 0 && (
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
                <span className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">🧪 Testlar</span>
                <div className="h-px flex-1 bg-gray-200 dark:bg-gray-700" />
              </div>

              {/* Test sections progress */}
              <div className="flex items-center gap-1.5 mb-4">
                {lesson.testSections.map((s, i) => {
                  const done = completedTestSections[i] !== undefined
                  const active = i === testSection
                  return (
                    <button key={s.title} className="flex-1 text-left cursor-pointer hover:opacity-80 transition-opacity" onClick={() => handleJumpToTestSection(i)}>
                      <div className={`h-1.5 rounded-full transition-all ${done ? 'bg-green-500' : active ? 'bg-yellow-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
                      <p className={`text-[11px] mt-0.5 text-center font-medium ${active ? 'text-yellow-700 dark:text-yellow-400' : done ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'}`}>
                        {s.icon} <span className="hidden sm:inline">{s.title}</span>
                      </p>
                    </button>
                  )
                })}
              </div>

              {(() => {
                const section = lesson.testSections[testSection]
                if (!section) return null
                const sectionTests = lesson.tests.filter(t => section.ids.includes(t.id))
                return (
                  <>
                    <div className={`rounded-xl p-4 text-white ${section.color}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-xs font-semibold opacity-80">Test {testSection + 1} / {lesson.testSections.length}</p>
                          <p className="font-bold text-lg">{section.icon} {section.title}</p>
                          <p className="text-sm opacity-80">{section.desc}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold">{sectionTests.length}</p>
                          <p className="text-xs opacity-80">savol</p>
                        </div>
                      </div>
                    </div>

                    {testSubmitted ? (
                      <>
                        <div className={`card border text-center py-5 ${testScore >= 8 ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800' : testScore >= 5 ? 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800' : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'}`}>
                          <p className={`text-3xl font-bold font-mono ${testScore >= 8 ? 'text-green-600 dark:text-green-400' : testScore >= 5 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-500 dark:text-red-400'} mb-1`}>
                            {testScore}<span className="text-lg text-gray-400 dark:text-gray-500">/{sectionTests.length}</span>
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                            {testScore === sectionTests.length ? '🎯 Mukammal! Barcha savollarga to\'g\'ri javob berdingiz!' :
                             testScore >= 8 ? '👍 Zo\'r! Davom eting!' :
                             testScore >= 5 ? '📚 Yaxshi, biroz ko\'proq takrorlash kerak' :
                             '💪 Qayta urinib ko\'ring — qoidalarni takrorlang'}
                          </p>
                          <div className="flex items-center justify-center gap-3 text-xs">
                            <span className="flex items-center gap-1 text-yellow-600 dark:text-yellow-400 font-bold"><Trophy size={14} /> +{testScore * 10} XP</span>
                            <span className="flex items-center gap-1 text-green-600 dark:text-green-400"><CheckCircle size={14} /> {testScore}</span>
                            <span className="flex items-center gap-1 text-red-500 dark:text-red-400"><XCircle size={14} /> {sectionTests.length - testScore}</span>
                          </div>
                          <div className="flex gap-2 mt-4">
                            <button onClick={() => {
                              if (testDBSaveTimerRef.current) { clearTimeout(testDBSaveTimerRef.current); testDBSaveTimerRef.current = undefined }
                              setTestAnswers({}); setTestSubmitted(false); setTestScore(0); setTestResults({}); setTestShuffleKey((k) => k + 1)
                              try { localStorage.removeItem(testStorageKey) } catch { /* ignore */ }
                              clearExerciseAnswersFromDB(lesson.id, testSection, 'test')
                            }} className="btn-secondary flex-1 text-sm py-2">
                              <RotateCcw size={14} /> Tozlash
                            </button>
                            {testSection < lesson.testSections.length - 1 && (
                              <button onClick={() => handleJumpToTestSection(testSection + 1)} className="btn-primary flex-1 text-sm py-2">
                                Keyingi bosqich <ChevronRight size={14} />
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="card border-gray-200 overflow-hidden">
                          <div className="flex items-center justify-between mb-4">
                            <p className="text-xs font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
                              <Trophy size={14} className="text-yellow-600 dark:text-yellow-400" /> Batafsil natija
                            </p>
                            <span className="text-[11px] text-gray-400 dark:text-gray-500">{sectionTests.length} ta savol</span>
                          </div>
                          <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                              <thead>
                                <tr className="border-b-2 border-gray-100 text-left text-[11px] text-gray-500 uppercase tracking-wider">
                                  <th className="pb-2 pr-2 font-semibold w-8">#</th>
                                  <th className="pb-2 pr-3 font-semibold">Savol</th>
                                  <th className="pb-2 pr-3 font-semibold">Sizning javobingiz</th>
                                  <th className="pb-2 pr-3 font-semibold">To'g'ri javob</th>
                                  <th className="pb-2 font-semibold w-10">Natija</th>
                                </tr>
                              </thead>
                              <tbody>
                                  {sectionTests.map((t, i) => {
                                    const ans = testAnswers[t.id] || ''
                                    const ok = testResults[t.id]
                                    const correctAnswer = t.type === 'fill-blank' ? t.blanks.join(' / ') : t.type === 'multiple-choice' || t.type === 'error-correction' || t.type === 'transformation' ? t.correct : ''
                                    return (
                                      <tr key={t.id} className={`border-b border-gray-50 dark:border-gray-800 ${ok ? 'bg-green-50/40 dark:bg-green-900/20' : 'bg-red-50/40 dark:bg-red-900/20'}`}>
                                        <td className="py-2.5 pr-2 text-xs font-bold text-gray-600">{i + 1}</td>
                                        <td className="py-2.5 pr-3"><p className="text-xs text-gray-800 dark:text-gray-200 font-medium leading-snug line-clamp-2">{t.type === 'fill-table' ? t.instruction : t.type === 'vocab-match' ? t.word : t.question}</p></td>
                                        <td className="py-2.5 pr-3">
                                          <span className={`inline-block text-xs font-mono font-semibold px-1.5 py-0.5 rounded ${ok ? 'text-green-700' : ans ? 'bg-red-100 text-red-700' : 'bg-gray-100 text-gray-500'}`}>
                                            {ans || '(tanlanmadi)'}
                                          </span>
                                        </td>
                                        <td className="py-2.5 pr-3">
                                          <span className="inline-block text-xs font-mono font-semibold text-green-700 bg-green-100 px-1.5 py-0.5 rounded">{correctAnswer}</span>
                                        </td>
                                        <td className="py-2.5 pr-3">
                                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${ok ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'}`}>
                                            {ok ? '✓' : '✗'}
                                          </span>
                                        </td>
                                      </tr>
                                    )
                                  })}
                              </tbody>
                            </table>
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-4">
                          {sectionTests.map((t, i) => {
                            const selected = testAnswers[t.id] || ''
                            const isCorrect = testResults[t.id]
                            const correctOpt = t.type === 'multiple-choice' || t.type === 'error-correction' || t.type === 'transformation' ? t.correct : ''
                            return (
                              <div key={t.id} className={`relative rounded-2xl border p-4 transition-colors ${testSubmitted ? isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50' : ''}`}>
                                <div className={`absolute -left-3 -top-3 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${testSubmitted ? isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white' : 'bg-yellow-600 text-white'}`}>
                                  {i + 1}
                                </div>
                                <p className="text-[11px] font-bold text-yellow-600 uppercase tracking-wider mb-3">🧪 Test savoli</p>
                                {t.instruction && (
                                  <p className="text-xs text-yellow-700 dark:text-yellow-300 font-medium mb-2 bg-yellow-50 dark:bg-yellow-900/20 px-2.5 py-1.5 rounded-lg border border-yellow-200 dark:border-yellow-800">
                                    {t.instruction}
                                  </p>
                                )}
                                <p className="text-sm font-semibold text-gray-800 mb-3 leading-relaxed">{t.type === 'fill-blank' ? t.question.replace(/_{3,}/g, '___') : t.type === 'fill-table' ? t.instruction : t.type === 'vocab-match' ? t.word : t.question}</p>
                                {t.type === 'multiple-choice' ? (
                                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {(shuffledTestOptionsMap.get(t.id) ?? t.options).map((opt, oi) => {
                                      const sel = selected === opt
                                      let cls = 'border border-gray-200 bg-white text-gray-700 dark:text-gray-300 hover:border-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20'
                                      if (testSubmitted) {
                                        if (opt === correctOpt) cls = 'border-green-400 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 font-bold'
                                        else if (sel) cls = 'border-red-400 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                                        else cls = 'border-gray-100 bg-gray-50 text-gray-400'
                                      } else if (sel) {
                                        cls = 'border-yellow-500 bg-yellow-100 dark:bg-yellow-900/40 text-yellow-800 dark:text-yellow-300 font-semibold'
                                      }
                                      return (
                                        <button key={opt} disabled={testSubmitted} onClick={() => setTestAnswers((prev) => ({ ...prev, [t.id]: opt }))}
                                          className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${cls}`}>
                                          <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[11px] font-bold flex-shrink-0">{['A','B','C','D'][oi]}</span>
                                          {opt}
                                        </button>
                                      )
                                    })}
                                  </div>
                                ) : (
                                  <div>
                                    <input
                                      type="text"
                                      value={selected}
                                      onChange={(e) => setTestAnswers((prev) => ({ ...prev, [t.id]: e.target.value }))}
                                      disabled={testSubmitted}
                                      placeholder="Javobingizni yozing..."
                                      className={`w-full px-3 py-2.5 rounded-xl text-sm border transition-all outline-none ${testSubmitted ? (testResults[t.id] ? 'border-green-400 bg-green-50 dark:bg-green-900/20' : 'border-red-400 bg-red-50 dark:bg-red-900/20') : 'border-gray-200 bg-white dark:bg-gray-800 dark:border-gray-600 hover:border-yellow-400 focus:border-primary-500 focus:ring-1 focus:ring-primary-500'}`}
                                    />
                                  </div>
                                )}
                              </div>
                            )
                          })}
                        </div>

                        <button onClick={() => {
                          let correct = 0; const results: Record<number, boolean> = {}
                          const answerPayloads: { exerciseId: number; exerciseType: string; answer: string[]; isCorrect: boolean }[] = []
                          for (const t of sectionTests) {
                            const ans = testAnswers[t.id] || ''
                            const ok = checkAnswer(t, [ans])
                            results[t.id] = ok
                            if (ok) correct++
                            answerPayloads.push({ exerciseId: t.id, exerciseType: t.type, answer: [ans], isCorrect: ok })
                          }
                          setTestScore(correct); setTestResults(results); setTestSubmitted(true)
                          const newCompleted = { ...completedTestSections, [testSection]: correct }
                          setCompletedTestSections(newCompleted)
                          if (!rewardedTestSectionsRef.current.has(testSection)) {
                            rewardedTestSectionsRef.current.add(testSection)
                            addXP(correct * 10)
                          }
                          saveExerciseAnswersToDB(lesson.id, testSection, 'test', answerPayloads)
                          pushTestProgress(lesson.id, section.title, correct, sectionTests.length).catch(() => {
                            monitoring.captureMessage('pushTestProgress failed (non-critical)', 'warn')
                          })
                          const testCorrectAll = Object.values(newCompleted).reduce((a, b) => a + b, 0)
                          const exerciseCorrectAll = Object.values(completedSections).reduce((a, b) => a + b, 0)
                          const combinedCorrect = testCorrectAll + exerciseCorrectAll
                          const combinedMax = lesson.exercises.length + lesson.tests.length
                          const combinedPct = combinedMax > 0 ? Math.round((combinedCorrect / combinedMax) * 100) : 0
                          setLessonProgress(lesson.id, combinedPct)
                          if (Object.keys(newCompleted).length === lesson.testSections.length) {
                            updateSkillProgress('todayGrammarPct', combinedPct)
                            pushTestProgress(lesson.id, '__all__', testCorrectAll, lesson.tests.length).catch(() => {
                              monitoring.captureMessage('pushTestProgress (all) failed (non-critical)', 'warn')
                            })
                            pushLessonProgress(lesson.id, combinedCorrect, combinedMax).catch(() => {
                              monitoring.captureMessage('pushLessonProgress (final) failed (non-critical)', 'warn')
                            })
                          }
                        }} disabled={Object.keys(testAnswers).length < sectionTests.length}
                          className={`btn-primary w-full flex items-center justify-center gap-2 py-3 ${Object.keys(testAnswers).length < sectionTests.length ? 'opacity-50 cursor-not-allowed' : ''}`}>
                          <CheckCircle size={18} /> Testni tekshirish (+{sectionTests.length * 10} XP)
                        </button>
                      </>
                    )}

                    {Object.keys(completedTestSections).length > 0 && (
                      <div className="card bg-gray-50 border-gray-100 text-center">
                        <p className="text-xs text-gray-500">
                          Umumiy: {Object.values(completedTestSections).reduce((a, b) => a + b, 0)} / {lesson.tests.length} ta to'g'ri
                          {' · '}
                          {lesson.testSections.filter((_, i) => completedTestSections[i] !== undefined).length} / {lesson.testSections.length} bosqich
                        </p>
                      </div>
                    )}
                  </>
                )
              })()}
            </div>
          )}
        </div>
      )}

      {/* ── READING TAB ── */}
      {tab === 'reading' && lesson.reading && (
        <div className="pt-2">
          <ReadingSection section={lesson.reading} addXP={addXP} />
        </div>
      )}

      {/* ── SPEAKING TAB (AI mavzuga oid generatsiya) ── */}
      {tab === 'speaking' && (
        <div className="pt-2">
          <SpeakingSection
            topic={lesson.title}
            level={lesson.level}
            addXP={addXP}
            onSkillProgress={(pct) => updateSkillProgress('todaySpeakingPct', pct)}
          />
        </div>
      )}

      {/* ── WRITING TAB ── */}
      {tab === 'writing' && lesson.writing && (
        <div className="pt-2">
          <WritingSection section={lesson.writing} level={lesson.level} addXP={addXP} />
        </div>
      )}

      {/* ── LISTENING TAB ── */}
      {tab === 'listening' && lesson.listening && (
        <div className="pt-2">
          <ListeningSection section={lesson.listening} addXP={addXP} />
        </div>
      )}
    </div>
  )
}
