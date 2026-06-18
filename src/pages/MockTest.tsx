import { useState, useEffect, useRef, useMemo } from 'react'
import { ClipboardList, Clock, ChevronRight, CheckCircle, Loader2, Mic, MicOff, AlertTriangle, Play, Pause } from 'lucide-react'
import { MockTestSkeleton } from '../components/ui/PageSkeleton'
import {
  pctToBand, scoreToBand, roundBand,
} from '@/data/mockTestData'
import type { TQ } from '@/data/mockTestData'
import { fetchMockTestData, saveMockTestResult, type MockTestData } from '@/services/mockTestService'
import { fetchReadingTexts } from '@/services/readingService'
import { fetchSpeakingPrompts } from '@/services/speakingService'
import { evaluateWriting, evaluateSpeech } from '@/lib/claude'
import { useSpeechSynthesis, SPEED_OPTIONS } from '@/hooks/useSpeechSynthesis'
import { db } from '@/db/database'
import { useStore } from '@/store/useStore'
import { useI18n } from '../i18n'
import { useNavigate } from 'react-router-dom'
import { getTodayTashkent } from '@/utils/tashkentDate'
import { supabase } from '@/lib/supabase'
import { monitoring } from '@/lib/monitoring'

// ── Types ─────────────────────────────────────────────────────────────────────

type TestType = 'a1' | 'b1' | 'b2' | 'ielts'
type View     = 'select' | 'weekly' | 'ielts-reading' | 'ielts-listening' | 'ielts-writing' | 'ielts-speaking' | 'result'

interface SpeechTypes {
  SpeechRecognition?: new () => SpeechRec
  webkitSpeechRecognition?: new () => SpeechRec
}
interface SpeechRecognitionEventType extends Event {
  results: {
    length: number
    [index: number]: {
      [index: number]: {
        transcript: string
      }
    }
  }
}

interface SpeechRec {
  lang: string; continuous: boolean; interimResults: boolean
  start(): void; stop(): void
  onresult: ((ev: SpeechRecognitionEventType) => void) | null
  onend: (() => void) | null
  onerror: ((ev: Event) => void) | null
}
declare const window: Window & SpeechTypes

interface IELTSScores {
  reading:   number   // 0-100 pct
  listening: number
  writingT1: number   // 1-10 Claude score
  writingT2: number
  speaking1: number
  speaking2: number
}

interface ResultData {
  type:         TestType
  weeklyScore?: number   // 0-100 for B1/B2
  weeklyTotal?: number
  ielts?:       IELTSScores
  overallBand:  number   // IELTS band 1-9, or pct for weekly
  prevScore?:   number
  savedId?:     number
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function useCountdown(seconds: number) {
  const [left, setLeft] = useState(seconds)
  const [active, setActive] = useState(false)

  useEffect(() => {
    setLeft(seconds)
    setActive(false)
  }, [seconds])

  useEffect(() => {
    if (!active || left <= 0) return
    const id = setInterval(() => setLeft((n) => n - 1), 1000)
    return () => clearInterval(id)
  }, [active, left])

  const fmt = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  return { left, fmt: fmt(left), pct: (left / seconds) * 100, start: () => setActive(true) }
}

function wordCount(t: string) {
  return t.trim().split(/\s+/).filter(Boolean).length
}

function parseAIScore(text: string, key: string) {
  const m = text.match(new RegExp(`${key}:\\s*(\\d+)`))
  if (!m) return 5
  const n = parseInt(m[1], 10)
  return Number.isNaN(n) ? 5 : Math.min(10, Math.max(0, n))
}

// ── Sub-components ────────────────────────────────────────────────────────────

function Timer({ fmt, warn }: { fmt: string; pct?: number; warn?: boolean }) {
  return (
    <div aria-live="polite" className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-mono font-semibold
      ${warn ? 'bg-red-50 dark:bg-red-900/20 text-red-600' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300'}`}>
      <Clock size={13} /> {fmt}
    </div>
  )
}

function BandBadge({ band }: { band: number }) {
  const color = band >= 7 ? 'text-green-700 bg-green-100' : band >= 6 ? 'text-b1-700 bg-b1-100' : 'text-orange-700 bg-orange-100'
  return <span className={`font-bold px-3 py-1 rounded-full text-sm ${color}`}>{band.toFixed(1)}</span>
}

function SectionBar({ label, pct, band }: { label: string; pct: number; band: number }) {
  const color = band >= 7 ? 'bg-green-500' : band >= 6 ? 'bg-b1-500' : 'bg-orange-500'
  return (
    <div className="mb-3">
      <div className="flex justify-between mb-1">
        <span className="text-sm text-gray-700">{label}</span>
        <BandBadge band={band} />
      </div>
      <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

// ── Select screen ─────────────────────────────────────────────────────────────

function SelectScreen({ onStart, loading }: { onStart: (t: TestType) => void; loading?: boolean }) {
  const { t } = useI18n()
  if (loading) {
    return <MockTestSkeleton />
  }
  const tests = [
    { type:'a1' as TestType, title: t('mockTest.a1Title'), emoji:'🌱',
      sub: t('mockTest.a1Sub'), qs:20, mins:25,
      color:'bg-emerald-50 border-emerald-100', tc:'text-emerald-700' },
    { type:'b1' as TestType, title: t('mockTest.weeklyB1Title'), emoji:'📝',
      sub: t('mockTest.weeklyB1Sub'), qs:30, mins:45,
      color:'bg-primary-50 border-primary-100', tc:'text-primary-700' },
    { type:'b2' as TestType, title: t('mockTest.weeklyB2Title'), emoji:'📋',
      sub: t('mockTest.weeklyB2Sub'), qs:30, mins:60,
      color:'bg-b2-50 border-b2-100', tc:'text-b2-700' },
    { type:'ielts' as TestType, title: t('mockTest.ieltsTitle'), emoji:'🎓',
      sub: t('mockTest.ieltsSub'), qs:4, mins:120,
      color:'bg-purple-50 border-purple-100', tc:'text-purple-700' },
  ]
  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
          <ClipboardList size={20} className="text-primary-600" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{t('mockTest.title')}</h1>
          <p className="text-xs text-gray-500">{t('mockTest.subtitle')}</p>
        </div>
      </div>
      <div className="space-y-3">
        {tests.map((test) => (
          <button key={test.type} onClick={() => onStart(test.type)}
            className={`w-full card text-left border hover:shadow-md hover:-translate-y-0.5 transition-all ${test.color}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{test.emoji}</span>
                <div>
                  <p className={`font-bold ${test.tc}`}>{test.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{test.sub}</p>
                  <div className="flex gap-3 mt-1.5">
                    <span className="text-xs text-gray-400">{t('mockTest.minutes', { mins: String(test.mins) })}</span>
                    <span className="text-xs text-gray-400">{t('mockTest.questions', { count: String(test.type === 'ielts' ? 4 : test.qs) })}</span>
                  </div>
                </div>
              </div>
              <ChevronRight size={18} className="text-gray-300" />
            </div>
          </button>
        ))}
      </div>

      {/* IELTS format info */}
      <div className="card bg-purple-50 border-purple-100 mt-4">
        <p className="text-xs font-semibold text-purple-700 mb-2">{t('mockTest.ieltsSectionsTitle')}</p>
        {[
          { name: t('mockTest.ieltsSectionReading'),   time: t('mockTest.minutes', { mins: '30' }),   desc: '10 savol — 2 matn' },
          { name: t('mockTest.ieltsSectionListening'), time: t('mockTest.minutes', { mins: '20' }),   desc: 'Audio — eshitib javob bering' },
          { name: t('mockTest.ieltsSectionWriting'),   time: t('mockTest.minutes', { mins: '40' }),   desc: 'Task 1 + Task 2 (Claude baholaydi)' },
          { name: t('mockTest.ieltsSectionSpeaking'),  time: t('mockTest.minutes', { mins: '15' }),   desc: '2 ta prompt — Web Speech + Claude' },
        ].map((s) => (
          <div key={s.name} className="flex items-center justify-between py-1.5 border-b border-purple-100 last:border-0">
            <span className="text-xs font-medium text-purple-800">{s.name}</span>
            <span className="text-xs text-purple-500">{s.time} · {s.desc}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Weekly MCQ test ───────────────────────────────────────────────────────────

function WeeklyTest({ questions, level, mins, onDone }: {
  questions: TQ[]; level: 'A1' | 'B1' | 'B2'; mins: number
  onDone: (correct: number, total: number) => void
}) {
  const { t } = useI18n()
  const [idx,     setIdx]     = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(Array(questions.length).fill(null))
  const [chosen,  setChosen]  = useState<number | null>(null)
  const timer = useCountdown(mins * 60)

  // eslint-disable-next-line react-hooks/exhaustive-deps -- faqat mount/mins o'zgarganda boshlanadi
  useEffect(() => { timer.start() }, [mins])

  const q    = questions[idx]
  const done = idx >= questions.length

  function selectAnswer(opt: number) { setChosen(opt) }

  function next() {
    const updated = [...answers]
    updated[idx] = chosen
    setAnswers(updated)
    if (idx + 1 >= questions.length) {
      const correct = updated.filter((a, i) => a === questions[i].ans).length
      onDone(correct, questions.length)
    } else {
      setIdx(idx + 1)
      setChosen(null)
    }
  }

  if (done) return null

  const sectionLabel = { grammar: t('mockTest.sectionGrammar'), vocabulary: t('mockTest.sectionVocab'), reading: t('mockTest.sectionReading') }

  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-500">{t('mockTest.weeklyLabel', { level })}</p>
          <p className="text-sm font-semibold text-gray-700">{t('mockTest.questionOf', { current: String(idx + 1), total: String(questions.length) })}</p>
        </div>
        <Timer fmt={timer.fmt} pct={timer.pct} warn={timer.left < 300} />
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100 dark:bg-gray-700 rounded-full mb-5 overflow-hidden">
        <div className="h-full bg-primary-500 rounded-full transition-all"
          style={{ width: `${(idx / questions.length) * 100}%` }} />
      </div>

      {/* Section badge */}
      <span className="text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full mb-3 inline-block">
        {sectionLabel[q.section]}
      </span>

      {/* Passage */}
      {q.passage && (
        <div className="card bg-gray-50 dark:bg-gray-800/50 border-gray-200 dark:border-gray-700 mb-4">
          <p className="text-sm text-gray-700 leading-relaxed">{q.passage}</p>
        </div>
      )}

      {/* Question */}
      <div className="card mb-4">
        <p className="text-base font-medium text-gray-900 dark:text-gray-100 leading-relaxed">{q.q}</p>
      </div>

      {/* Options */}
      <div className="space-y-2 mb-5">
        {q.opts.map((opt, i) => (
          <button key={i} onClick={() => selectAnswer(i)}
            className={`w-full text-left p-3.5 rounded-xl border text-sm transition-all
              ${chosen === i
                ? 'bg-primary-50 border-primary-400 text-primary-800 font-semibold'
                : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:border-primary-200'}`}>
            <span className="font-semibold mr-2 text-gray-400">{['A','B','C','D'][i]}.</span>
            {opt}
          </button>
        ))}
      </div>

      <button onClick={next} disabled={chosen === null}
        className="w-full btn-primary text-sm flex items-center justify-center gap-2">
        {idx + 1 >= questions.length ? t('mockTest.finishButton') : <>{t('mockTest.nextButton')} <ChevronRight size={14} /></>}
      </button>
    </div>
  )
}

// ── IELTS Reading ─────────────────────────────────────────────────────────────

function IELTSReading({ texts, onDone }: { texts: import('@/data/reading').ReadingText[]; onDone: (pct: number) => void }) {
  const { t } = useI18n()
  type RText = import('@/data/reading').ReadingText
  // IELTS: 3 ta passage qiyinlik oshib boradi (B1 → B1+ → B2). Daraja topilmasa birinchi 3 ta.
  const selected = useMemo<RText[]>(() => {
    const pick = (lv: string) => texts.find(t => t.level === lv)
    const wanted = ['B1', 'B1+', 'B2'].map(pick).filter((t): t is RText => !!t)
    return wanted.length >= 3 ? wanted : texts.slice(0, 3)
  }, [texts])
  const offsets = useMemo(() => {
    const o: number[] = []; let acc = 0
    for (const t of selected) { o.push(acc); acc += t.questions.length }
    return o
  }, [selected])
  const totalQ = selected.reduce((a, t) => a + t.questions.length, 0)

  const [pIdx, setPIdx]       = useState(0)
  const [answers, setAnswers] = useState<(number | null)[]>(Array(totalQ).fill(null))
  const timer = useCountdown(30 * 60)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { timer.start() }, [])

  if (selected.length === 0) return null
  const passage = selected[pIdx]
  const base    = offsets[pIdx]
  const isLast  = pIdx + 1 >= selected.length
  const answeredTotal = answers.filter(a => a !== null).length
  const answeredHere  = passage.questions.filter((_, i) => answers[base + i] !== null).length

  function pick(localIdx: number, oi: number) {
    setAnswers(prev => { const u = [...prev]; u[base + localIdx] = oi; return u })
  }
  function next() {
    if (isLast) {
      const allQ = selected.flatMap(t => t.questions)
      const correct = answers.filter((a, i) => a === allQ[i].correctIndex).length
      onDone(Math.round((correct / Math.max(1, totalQ)) * 100))
    } else {
      setPIdx(pIdx + 1)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-semibold text-b1-600">{t('mockTest.ieltsReadingTitle', { current: String(pIdx + 1), total: String(selected.length) })}</span>
          <p className="text-xs text-gray-500 mt-0.5">{t('mockTest.answersGiven', { count: String(answeredTotal), total: String(totalQ) })}</p>
        </div>
        <Timer fmt={timer.fmt} pct={timer.pct} warn={timer.left < 180} />
      </div>
      <div className="h-1 bg-gray-100 dark:bg-gray-700 rounded-full mb-4 overflow-hidden">
        <div className="h-full bg-b1-500 rounded-full transition-all" style={{ width: `${(answeredTotal / Math.max(1, totalQ)) * 100}%` }} />
      </div>

      {/* Passage */}
      <div className="card bg-gray-50 dark:bg-gray-800/50 mb-4 max-h-72 overflow-y-auto">
        <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mb-2">
          {passage.title} <span className="text-xs font-normal text-gray-400">· {passage.level}</span>
        </p>
        {passage.paragraphs.map((p, i) => (
          <p key={i} className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-2">{p}</p>
        ))}
      </div>

      {/* Shu matnning barcha savollari — IELTS uslubi */}
      <div className="space-y-3">
        {passage.questions.map((q, li) => (
          <div key={li} className="card">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">{li + 1}. {q.question}</p>
            <div className="space-y-2" role="radiogroup">
              {q.options.map((opt, oi) => (
                <button key={oi} onClick={() => pick(li, oi)} role="radio" aria-checked={answers[base + li] === oi}
                  className={`w-full text-left p-2.5 rounded-xl border text-sm transition-all
                    ${answers[base + li] === oi ? 'bg-b1-50 border-b1-400 text-b1-800 font-semibold' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-b1-200'}`}>
                  <span className="font-semibold mr-2 text-gray-400">{['A','B','C','D'][oi]}.</span>{opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button onClick={next} disabled={answeredHere === 0} className="w-full btn-primary text-sm mt-4">
        {isLast ? t('mockTest.ieltsReadingFinish') : t('mockTest.ieltsReadingNext')}
      </button>
    </div>
  )
}

// ── IELTS Listening ───────────────────────────────────────────────────────────

function IELTSListening({ data, onDone }: { data: MockTestData | null; onDone: (pct: number) => void }) {
  const { t } = useI18n()
  const listeningMCQ = data?.listeningMCQ ?? []
  const listeningText = data?.listeningText ?? ''
  const tts = useSpeechSynthesis('en-US')
  const [answers, setAnswers] = useState<(number | null)[]>(Array(listeningMCQ.length).fill(null))
  const [plays, setPlays]     = useState(0)
  const [showScript, setShowScript] = useState(false)
  const timer = useCountdown(20 * 60)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { timer.start(); return () => tts.stop() }, [])

  const MAX_PLAYS = 2
  const answered = answers.filter(a => a !== null).length

  function togglePlay() {
    if (tts.playing) { tts.stop(); return }
    if (plays >= MAX_PLAYS) return
    setPlays(p => p + 1)
    tts.speak(listeningText)
  }
  function pick(qi: number, oi: number) {
    setAnswers(prev => { const u = [...prev]; u[qi] = oi; return u })
  }
  function submit() {
    tts.stop()
    const correct = answers.filter((a, i) => a === listeningMCQ[i].ans).length
    onDone(Math.round((correct / Math.max(1, listeningMCQ.length)) * 100))
  }

  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-semibold text-orange-600">{t('mockTest.ieltsListeningTitle')}</span>
        <Timer fmt={timer.fmt} pct={timer.pct} warn={timer.left < 120} />
      </div>
      <div className="h-1 bg-gray-100 rounded-full mb-4 overflow-hidden">
        <div className="h-full bg-orange-500 rounded-full transition-all"
          style={{ width: `${(answered / Math.max(1, listeningMCQ.length)) * 100}%` }} />
      </div>

      {/* ── Audio pleyer (TTS — real audio) ── */}
      <div className="card bg-orange-50 dark:bg-orange-900/20 border-orange-100 dark:border-orange-800 mb-4">
        {tts.supported ? (
          <>
            <div className="flex items-center gap-3">
              <button onClick={togglePlay} disabled={!tts.playing && plays >= MAX_PLAYS}
                aria-label={tts.playing ? t('mockTest.speakingStop') : 'Audio'}
                className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center flex-shrink-0 disabled:opacity-40 hover:bg-orange-600 transition-colors">
                {tts.playing ? <Pause size={22} /> : <Play size={22} />}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-orange-800 dark:text-orange-200">
                  {tts.playing ? t('common.loading') : plays >= MAX_PLAYS ? t('mockTest.listenPlayed') : plays === 0 ? t('mockTest.listenPrompt') : t('speaking.retryButton')}
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-0.5">
                  {t('mockTest.listenPlays', { used: String(plays), max: String(MAX_PLAYS) })}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 flex-wrap">
              <span className="text-xs text-gray-500">Tezlik:</span>
              {SPEED_OPTIONS.map(sp => (
                <button key={sp.value} onClick={() => tts.setSpeed(sp.value)}
                  className={`text-xs px-2 py-1 rounded-lg border transition-colors ${tts.speed === sp.value ? 'bg-orange-500 text-white border-orange-500' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'}`}>
                  {sp.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="text-xs font-semibold text-orange-700 mb-2">{t('mockTest.listenNotSupported')}</p>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{listeningText}</p>
          </>
        )}
      </div>

      {/* ── Transkript (faqat tinglagandan keyin) ── */}
      {plays > 0 && tts.supported && (
        <div className="mb-4">
          <button onClick={() => setShowScript(s => !s)} className="text-xs font-semibold text-orange-600 hover:underline">
            📄 {showScript ? 'Transkript yashirish' : 'Transkript ko\'rsatish'}
          </button>
          {showScript && (
            <div className="card bg-gray-50 dark:bg-gray-800/50 mt-2">
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">{listeningText}</p>
            </div>
          )}
        </div>
      )}

      {/* ── Savollar (hammasi birga — audio bilan javob bering) ── */}
      <div className="space-y-3">
        {listeningMCQ.map((q, qi) => (
          <div key={qi} className="card">
            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-2">{qi + 1}. {q.q}</p>
            <div className="space-y-2" role="radiogroup">
              {q.opts.map((opt, oi) => (
                <button key={oi} onClick={() => pick(qi, oi)} role="radio" aria-checked={answers[qi] === oi}
                  className={`w-full text-left p-2.5 rounded-xl border text-sm transition-all
                    ${answers[qi] === oi ? 'bg-orange-50 border-orange-400 text-orange-800 font-semibold' : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-600 hover:border-orange-200'}`}>
                  <span className="font-semibold mr-2 text-gray-400">{['A','B','C','D'][oi]}.</span>{opt}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>          <button onClick={submit} disabled={answered === 0} className="w-full btn-primary text-sm mt-4">
        {t('mockTest.ieltsListeningFinish', { count: String(answered), total: String(listeningMCQ.length) })}
      </button>
    </div>
  )
}

// ── IELTS Writing ─────────────────────────────────────────────────────────────

function IELTSWriting({ data, onDone }: { data: MockTestData | null; onDone: (t1: number, t2: number) => void }) {
  const { t } = useI18n()
  const writingTask1 = data?.writingTask1 ?? { prompt: '', instruction: '' }
  const writingTask2 = data?.writingTask2 ?? { prompt: '', instruction: '' }
  const [task,     setTask]     = useState<1 | 2>(1)
  const [text1,    setText1]    = useState('')
  const [text2,    setText2]    = useState('')
  const [score1,   setScore1]   = useState(0)
  const [loading1, setLoading1] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [done1,    setDone1]    = useState(false)
  const timer = useCountdown(40 * 60)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { timer.start() }, [])

  async function submitTask1() {
    setLoading1(true)
    let full = ''
    await evaluateWriting(writingTask1.prompt, text1, 'B2',
      (tok) => { full += tok },
      (text) => {
        const avg = Math.round(
          (parseAIScore(text,'TASK_ACHIEVEMENT') + parseAIScore(text,'COHERENCE') +
           parseAIScore(text,'VOCABULARY') + parseAIScore(text,'GRAMMAR')) / 4
        )
        setScore1(avg); setLoading1(false); setDone1(true); setTask(2)
      },
      () => setLoading1(false)
    )
    void full
  }

  async function submitTask2() {
    setLoading2(true)
    let full = ''
    await evaluateWriting(writingTask2.prompt, text2, 'B2',
      (tok) => { full += tok },
      (text) => {
        const avg = Math.round(
          (parseAIScore(text,'TASK_ACHIEVEMENT') + parseAIScore(text,'COHERENCE') +
           parseAIScore(text,'VOCABULARY') + parseAIScore(text,'GRAMMAR')) / 4
        )
        setLoading2(false); onDone(score1, avg)
      },
      () => setLoading2(false)
    )
    void full
  }

  const curText    = task === 1 ? text1 : text2
  const setCurText = task === 1 ? setText1 : setText2
  const curPrompt  = task === 1 ? writingTask1 : writingTask2
  const wc         = wordCount(curText)
  const minWords   = task === 1 ? 150 : 250
  const canSubmit  = wc >= minWords && !(task === 1 ? loading1 : loading2)

  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-semibold text-b2-600">✍️ Writing</span>
          <div className="flex gap-2 mt-1">
            {[1, 2].map((t) => (
              <span key={t} className={`text-xs px-2 py-0.5 rounded-full font-semibold
                ${task === t ? 'bg-b2-100 text-b2-700' : done1 && t === 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'}`}>
                Task {t} {done1 && t === 1 ? '✓' : ''}
              </span>
            ))}
          </div>
        </div>
        <Timer fmt={timer.fmt} pct={timer.pct} warn={timer.left < 300} />
      </div>

      <div className="card bg-b2-50 border-b2-100 mb-3">
        <p className="text-xs font-semibold text-b2-700 mb-1">{t('mockTest.ieltsWritingTask', { n: String(task), title: task === 1 ? 'Data Description' : 'Essay', min: task === 1 ? '150' : '250' })}</p>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{curPrompt.prompt}</p>
      </div>

      <div className="card mb-3">
        <textarea
          className="w-full min-h-[200px] text-sm text-gray-800 dark:text-gray-100 dark:bg-transparent leading-relaxed resize-none outline-none placeholder-gray-300 dark:placeholder-gray-600"
          placeholder={t('mockTest.writingPlaceholder')}
          value={curText}
          onChange={(e) => setCurText(e.target.value)}
          disabled={task === 1 ? loading1 : loading2}
        />
        <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-700 mt-2">
          <span className={`text-xs font-semibold ${wc >= minWords ? 'text-green-600' : 'text-gray-400'}`}>
            {t('mockTest.wordCount', { count: String(wc) })} / {minWords}
          </span>
        </div>
      </div>

      <button onClick={task === 1 ? submitTask1 : submitTask2} disabled={!canSubmit}
        className="w-full btn-primary text-sm flex items-center justify-center gap-2">
        {(task === 1 ? loading1 : loading2)
          ? <><Loader2 size={14} className="animate-spin" /> {t('mockTest.writingEval')}</>
          : task === 1 ? t('mockTest.writingSubmit1') : t('mockTest.writingSubmit2')}
      </button>
    </div>
  )
}

// ── IELTS Speaking ────────────────────────────────────────────────────────────

function IELTSSpeaking({ prompts, onDone }: { prompts: import('@/services/speakingService').SpeakingPrompt[]; onDone: (s1: number, s2: number) => void }) {
  const { t } = useI18n()
  const [pIdx,      setPIdx]      = useState(0)
  const [recording, setRecording] = useState(false)
  const [transcript,setTranscript]= useState('')
  const [score1,    setScore1]    = useState(0)
  const [loading,   setLoading]   = useState(false)
  const recRef = useRef<SpeechRec | null>(null)
  const timer  = useCountdown(15 * 60)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => { timer.start() }, [])

  function startRec() {
    const Ctor = window.SpeechRecognition || window.webkitSpeechRecognition
    if (!Ctor) return
    const r: SpeechRec = new (Ctor as new () => SpeechRec)()
    r.lang     = 'en-US'; r.continuous = true; r.interimResults = true
    r.onresult = (e) => {
      let t = ''
      for (let i = 0; i < e.results.length; i++) t += e.results[i][0].transcript
      setTranscript(t)
    }
    r.onend = () => setRecording(false)
    r.onerror = () => { setRecording(false) }
    r.start(); recRef.current = r; setRecording(true)
  }

  function stopRec() { recRef.current?.stop(); setRecording(false) }

  async function submit() {
    setLoading(true)
    let full = ''
    await evaluateSpeech(prompts[pIdx].prompt, transcript, 'B2',
      (tok) => { full += tok },
      (text) => {
        const avg = Math.round(
          (parseAIScore(text, 'FLUENCY') + parseAIScore(text, 'GRAMMAR') + parseAIScore(text, 'VOCABULARY')) / 3
        )
        setLoading(false)
        if (pIdx === 0) {
          setScore1(avg); setPIdx(1); setTranscript('')
        } else {
          onDone(score1, avg)
        }
      },
      () => setLoading(false)
    )
    void full
  }

  const p = prompts[pIdx]
  const noSpeech = !((window.SpeechRecognition || window.webkitSpeechRecognition))

  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between mb-3">
        <div>
          <span className="text-xs font-semibold text-purple-600">{t('mockTest.ieltsSpeakingTitle', { current: String(pIdx + 1), total: '2' })}</span>
        </div>
        <Timer fmt={timer.fmt} pct={timer.pct} warn={timer.left < 120} />
      </div>

      {noSpeech && (
        <div className="card bg-orange-50 border-orange-100 mb-3 flex items-center gap-2">
          <AlertTriangle size={14} className="text-orange-500 flex-shrink-0" />
          <p className="text-xs text-orange-700">{t('mockTest.speakingNoSpeech')}</p>
        </div>
      )}

      <div className="card bg-purple-50 border-purple-100 mb-4">
        <p className="text-xs text-purple-500 mb-1">{t('mockTest.speakingQuestion')}</p>
        <p className="text-sm font-medium text-purple-900 leading-relaxed">{p.prompt}</p>
        <div className="mt-2 space-y-1">
          {p.tips.map((tip, i) => (
            <p key={i} className="text-xs text-purple-600">💡 {tip}</p>
          ))}
        </div>
      </div>

      <div className="card mb-3">
        {noSpeech ? (
          <textarea
            className="w-full min-h-[120px] text-sm text-gray-800 leading-relaxed resize-none outline-none placeholder-gray-300"
            placeholder={t('mockTest.speakingPlaceholder')}
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          />
        ) : (
          <div className="min-h-[80px]">
            {transcript
              ? <p className="text-sm text-gray-700 leading-relaxed">{transcript}</p>
              : <p className="text-sm text-gray-400 italic">{t('mockTest.speakingMicHint')}</p>}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {!noSpeech && (
          <button onClick={recording ? stopRec : startRec}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border transition-all
              ${recording ? 'bg-red-50 dark:bg-red-900/20 border-red-200 text-red-600' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
            {recording ? <><MicOff size={14} /> {t('mockTest.speakingStop')}</> : <><Mic size={14} /> {t('mockTest.speakingRecord')}</>}
          </button>
        )}
        <button onClick={submit} disabled={!transcript.trim() || loading || recording}
          className="flex-1 btn-primary text-sm flex items-center justify-center gap-2">
          {loading
            ? <><Loader2 size={14} className="animate-spin" /> {t('mockTest.speakingEval')}</>
            : pIdx === 0 ? t('mockTest.speakingNext') : t('mockTest.speakingFinish')}
        </button>
      </div>
    </div>
  )
}

// ── Result screen ─────────────────────────────────────────────────────────────

function ResultScreen({ data, onRetry }: { data: ResultData; onRetry: () => void }) {
  const { t } = useI18n()
  const navigate  = useNavigate()
  const isIELTS   = data.type === 'ielts'
  const band      = data.overallBand

  const weakSection = (() => {
    if (!isIELTS || !data.ielts) return null
    const s = data.ielts
    const sections = [
      { label: 'Reading',   band: pctToBand(s.reading),   path: '/reading'    },
      { label: 'Listening', band: pctToBand(s.listening),  path: '/listening'  },
      { label: 'Writing',   band: scoreToBand((s.writingT1 + s.writingT2) / 2), path: '/writing' },
      { label: 'Speaking',  band: scoreToBand((s.speaking1 + s.speaking2) / 2), path: '/speaking' },
    ]
    return sections.reduce((a, b) => (a.band < b.band ? a : b))
  })()

  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto">
      {/* Overall score */}
      <div className="card bg-gradient-to-br from-primary-50 to-b2-50 border-primary-100 text-center mb-5">
        <CheckCircle size={36} className="text-primary-600 mx-auto mb-2" />
        <p className="text-xs text-gray-500 mb-1">
          {isIELTS ? 'IELTS Band Score' : t('mockTest.resultTitle')}
        </p>
        <p className="text-5xl font-bold text-primary-700">
          {isIELTS ? band.toFixed(1) : `${Math.round(band)}%`}
        </p>
        {!isIELTS && (
          <p className="text-sm text-gray-500 mt-1">
            {t('mockTest.progressLabel', { correct: String(data.weeklyScore), total: String(data.weeklyTotal) })} ·{' '}
            {band >= 80 ? t('mockTest.resultB2') : band >= 65 ? t('mockTest.resultB1Plus') : t('mockTest.resultB1')}
          </p>
        )}
        {data.prevScore !== undefined && (
          <p className={`text-xs mt-2 font-semibold ${band > data.prevScore ? 'text-green-600' : 'text-orange-500'}`}>
            {band > data.prevScore ? t('mockTest.resultUp', { diff: (band - data.prevScore).toFixed(1) }) : t('mockTest.resultDown', { diff: (data.prevScore - band).toFixed(1) })} {t('mockTest.resultPrev')}
          </p>
        )}
      </div>

      {/* IELTS section breakdown */}
      {isIELTS && data.ielts && (
        <div className="card mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">{t('mockTest.sectionBreakdown')}</p>
          {[
            { label: '📖 Reading',   pct: data.ielts.reading,  band: roundBand(pctToBand(data.ielts.reading))  },
            { label: '🎧 Listening', pct: data.ielts.listening, band: roundBand(pctToBand(data.ielts.listening)) },
            { label: '✍️ Writing',   pct: Math.round(((data.ielts.writingT1 + data.ielts.writingT2) / 2) * 10),
              band: roundBand(scoreToBand((data.ielts.writingT1 + data.ielts.writingT2) / 2)) },
            { label: '🎤 Speaking',  pct: Math.round(((data.ielts.speaking1 + data.ielts.speaking2) / 2) * 10),
              band: roundBand(scoreToBand((data.ielts.speaking1 + data.ielts.speaking2) / 2)) },
          ].map((s) => <SectionBar key={s.label} {...s} />)}
        </div>
      )}

      {/* Weakness + lesson suggestion */}
      {weakSection && (
        <div className="card bg-orange-50 border-orange-100 mb-4">
          <p className="text-sm font-semibold text-orange-700 mb-1">
            {t('mockTest.weaknessTitle', { label: weakSection.label })}
          </p>
          <p className="text-xs text-orange-600 mb-2">
            {t('mockTest.weaknessDesc')}
          </p>
          <button onClick={() => navigate(weakSection.path)} className="text-xs font-semibold text-orange-700 underline">
            {t('mockTest.weaknessLink', { label: weakSection.label })}
          </button>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <button onClick={onRetry} className="btn-secondary flex-1 text-sm">
          {t('mockTest.retryButton')}
        </button>
        <button onClick={() => navigate('/')} className="btn-primary flex-1 text-sm">
          {t('mockTest.homeButton')}
        </button>
      </div>
    </div>
  )
}

// ── Main orchestrator ─────────────────────────────────────────────────────────

export default function MockTest() {
  const { addXP, currentDay } = useStore()
  const [view,      setView]      = useState<View>('select')
  const [testType,  setTestType]  = useState<TestType>('b1')
  const [result,    setResult]    = useState<ResultData | null>(null)
  const [mockData,  setMockData]  = useState<MockTestData | null>(null)
  const [readingTexts, setReadingTexts] = useState<import('@/data/reading').ReadingText[]>([])
  const [speakingPrompts, setSpeakingPrompts] = useState<import('@/services/speakingService').SpeakingPrompt[]>([])

  useEffect(() => {
    const err = (ctx: string) => (e: unknown) => monitoring.captureException(e instanceof Error ? e : new Error(String(e)), { context: ctx })
    fetchMockTestData('B1').then(setMockData).catch(err('fetchMockTestData'))
    fetchReadingTexts().then(setReadingTexts).catch(err('fetchReadingTexts'))
    fetchSpeakingPrompts().then(setSpeakingPrompts).catch(err('fetchSpeakingPrompts'))
  }, [])

  // IELTS intermediate scores
  const ieltsRef = useRef<Partial<IELTSScores>>({})

  async function saveResult(data: ResultData): Promise<number | undefined> {
    const prev = await db.mockTests.orderBy('createdAt').last()

    const isIELTS = data.type === 'ielts'
    const score = isIELTS ? Math.round(data.overallBand * 100 / 9) : Math.round(data.overallBand)
    const prevScore = prev ? prev.totalScore : undefined

    const level = isIELTS
      ? data.overallBand >= 7 ? 'B2' : data.overallBand >= 6 ? 'B1+' : 'B1'
      : data.overallBand >= 80 ? 'B2' : data.overallBand >= 65 ? 'B1+' : 'B1'

    const sections = {
      reading:  data.ielts?.reading ?? 0,
      listening:data.ielts?.listening ?? 0,
      grammar:  0,
      writing:  data.ielts ? Math.round(((data.ielts.writingT1 + data.ielts.writingT2) / 2) * 10) : 0,
      speaking: data.ielts ? Math.round(((data.ielts.speaking1 + data.ielts.speaking2) / 2) * 10) : 0,
    }
    const todayDate = getTodayTashkent()
    const week = Math.ceil(currentDay / 7)

    await db.mockTests.add({
      date: todayDate,
      day:  currentDay,
      week,
      type: isIELTS ? 'monthly' : 'weekly',
      sections,
      totalScore:      score,
      level,
      durationMinutes: isIELTS ? 105 : data.type === 'b2' ? 60 : 45,
      createdAt:       Date.now(),
    })

    addXP(Math.round(score / 2))

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user.id) {
        saveMockTestResult({
          userId: session.user.id,
          date: todayDate,
          day: currentDay,
          week,
          type: isIELTS ? 'monthly' : 'weekly',
          sections,
          totalScore: score,
          level,
        })
      }
    })
    return prevScore
  }

  function startTest(type: TestType) {
    setTestType(type)
    ieltsRef.current = {}
    const level = type === 'a1' ? 'A1' : type === 'b2' ? 'B2' : 'B1'
    fetchMockTestData(level).then(setMockData)
    if (type === 'a1' || type === 'b1' || type === 'b2') setView('weekly')
    else setView('ielts-reading')
  }

  async function handleWeeklyDone(correct: number, total: number) {
    const pct = Math.round((correct / total) * 100)
    const data: ResultData = {
      type: testType,
      weeklyScore: correct,
      weeklyTotal: total,
      overallBand: pct,
    }
    const prevScore = await saveResult(data)
    setResult({ ...data, prevScore })
    setView('result')
  }

  function handleReadingDone(pct: number) {
    ieltsRef.current.reading = pct
    setView('ielts-listening')
  }

  function handleListeningDone(pct: number) {
    ieltsRef.current.listening = pct
    setView('ielts-writing')
  }

  function handleWritingDone(t1: number, t2: number) {
    ieltsRef.current.writingT1 = t1
    ieltsRef.current.writingT2 = t2
    setView('ielts-speaking')
  }

  async function handleSpeakingDone(s1: number, s2: number) {
    ieltsRef.current.speaking1 = s1
    ieltsRef.current.speaking2 = s2
    const sc   = ieltsRef.current as IELTSScores
    const bands = [
      pctToBand(sc.reading),
      pctToBand(sc.listening),
      scoreToBand((sc.writingT1 + sc.writingT2) / 2),
      scoreToBand((sc.speaking1 + sc.speaking2) / 2),
    ]
    const overall = roundBand(bands.reduce((a, b) => a + b, 0) / bands.length)
    const data: ResultData = { type: 'ielts', ielts: sc, overallBand: overall }
    const prevScore = await saveResult(data)
    setResult({ ...data, prevScore })
    setView('result')
  }

  const selectedQuestions = mockData?.questions ?? []
  const mins      = testType === 'b1' ? 45 : 60

  if (view === 'result' && result) {
    return <ResultScreen data={result} onRetry={() => { setView('select'); setResult(null) }} />
  }
  if (view === 'weekly') {
    return <WeeklyTest questions={selectedQuestions} level={testType === 'a1' ? 'A1' : testType === 'b1' ? 'B1' : 'B2'} mins={mins} onDone={handleWeeklyDone} />
  }
  if (view === 'ielts-reading')   return <IELTSReading   texts={readingTexts} onDone={handleReadingDone}   />
  if (view === 'ielts-listening') return <IELTSListening  data={mockData} onDone={handleListeningDone} />
  if (view === 'ielts-writing')   return <IELTSWriting    data={mockData} onDone={handleWritingDone}   />
  if (view === 'ielts-speaking')  return <IELTSSpeaking   prompts={speakingPrompts} onDone={handleSpeakingDone}  />

  return <SelectScreen onStart={startTest} loading={!mockData} />
}
