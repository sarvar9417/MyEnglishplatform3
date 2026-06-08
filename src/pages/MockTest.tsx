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
  if (loading) {
    return <MockTestSkeleton />
  }
  const tests = [
    { type:'a1' as TestType, title:'A1 darajasi testi', emoji:'🌱',
      sub:'Asosiy Grammar + Vocabulary + Reading', qs:20, mins:25,
      color:'bg-emerald-50 border-emerald-100', tc:'text-emerald-700' },
    { type:'b1' as TestType, title:'Haftalik B1 testi', emoji:'📝',
      sub:'Grammar + Vocabulary + Reading', qs:30, mins:45,
      color:'bg-primary-50 border-primary-100', tc:'text-primary-700' },
    { type:'b2' as TestType, title:'Haftalik B2 testi', emoji:'📋',
      sub:'Advanced Grammar + Vocabulary', qs:30, mins:60,
      color:'bg-b2-50 border-b2-100', tc:'text-b2-700' },
    { type:'ielts' as TestType, title:"To'liq IELTS Simulatsiya", emoji:'🎓',
      sub:'Reading · Listening · Writing · Speaking', qs:4, mins:120,
      color:'bg-purple-50 border-purple-100', tc:'text-purple-700' },
  ]
  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
          <ClipboardList size={20} className="text-primary-600" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">Mock Imtihon</h1>
          <p className="text-xs text-gray-500">Daraja aniqlash va IELTS tayyorgarlik</p>
        </div>
      </div>
      <div className="space-y-3">
        {tests.map((t) => (
          <button key={t.type} onClick={() => onStart(t.type)}
            className={`w-full card text-left border hover:shadow-md hover:-translate-y-0.5 transition-all ${t.color}`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-3xl">{t.emoji}</span>
                <div>
                  <p className={`font-bold ${t.tc}`}>{t.title}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{t.sub}</p>
                  <div className="flex gap-3 mt-1.5">
                    <span className="text-[11px] text-gray-400">⏱ {t.mins} daqiqa</span>
                    <span className="text-[11px] text-gray-400">📊 {t.type === 'ielts' ? '4 bo\'lim' : `${t.qs} savol`}</span>
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
        <p className="text-xs font-semibold text-purple-700 mb-2">🎓 IELTS Simulatsiya bo'limlari:</p>
        {[
          ['📖 Reading',   '30 daqiqa', '10 savol — 2 matn'],
          ['🎧 Listening', '20 daqiqa', 'Audio (ovoz) — eshitib javob bering'],
          ['✍️ Writing',   '40 daqiqa', 'Task 1 + Task 2 (Claude baholaydi)'],
          ['🎤 Speaking',  '15 daqiqa', '2 ta prompt — Web Speech + Claude'],
        ].map(([name, time, desc]) => (
          <div key={name} className="flex items-center justify-between py-1.5 border-b border-purple-100 last:border-0">
            <span className="text-xs font-medium text-purple-800">{name}</span>
            <span className="text-[11px] text-purple-500">{time} · {desc}</span>
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

  const sectionLabel = { grammar: '📚 Grammar', vocabulary: '📝 Vocabulary', reading: '📖 Reading' }

  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <p className="text-xs text-gray-500">{level} testi</p>
          <p className="text-sm font-semibold text-gray-700">{idx + 1} / {questions.length}</p>
        </div>
        <Timer fmt={timer.fmt} pct={timer.pct} warn={timer.left < 300} />
      </div>

      {/* Progress bar */}
      <div className="h-1 bg-gray-100 dark:bg-gray-700 rounded-full mb-5 overflow-hidden">
        <div className="h-full bg-primary-500 rounded-full transition-all"
          style={{ width: `${(idx / questions.length) * 100}%` }} />
      </div>

      {/* Section badge */}
      <span className="text-[11px] font-semibold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-0.5 rounded-full mb-3 inline-block">
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
        {idx + 1 >= questions.length ? 'Testni yakunlash ✓' : <>Keyingi <ChevronRight size={14} /></>}
      </button>
    </div>
  )
}

// ── IELTS Reading ─────────────────────────────────────────────────────────────

function IELTSReading({ texts, onDone }: { texts: import('@/data/reading').ReadingText[]; onDone: (pct: number) => void }) {
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
          <span className="text-xs font-semibold text-b1-600">📖 Reading · Matn {pIdx + 1}/{selected.length}</span>
          <p className="text-xs text-gray-500 mt-0.5">Javob berildi: {answeredTotal}/{totalQ}</p>
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
        {isLast ? "Reading'ni yakunlash →" : 'Keyingi matn →'}
      </button>
    </div>
  )
}

// ── IELTS Listening ───────────────────────────────────────────────────────────

function IELTSListening({ data, onDone }: { data: MockTestData | null; onDone: (pct: number) => void }) {
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
        <span className="text-xs font-semibold text-orange-600">🎧 Listening</span>
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
                aria-label={tts.playing ? 'To\'xtatish' : 'Audio'}
                className="w-12 h-12 rounded-full bg-orange-500 text-white flex items-center justify-center flex-shrink-0 disabled:opacity-40 hover:bg-orange-600 transition-colors">
                {tts.playing ? <Pause size={22} /> : <Play size={22} />}
              </button>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-orange-800 dark:text-orange-200">
                  {tts.playing ? 'Audio yangramoqda…' : plays >= MAX_PLAYS ? 'Audio tugadi' : plays === 0 ? "Audio'ni boshlash uchun bosing" : 'Yana tinglash'}
                </p>
                <p className="text-xs text-orange-600 dark:text-orange-400 mt-0.5">
                  Tinglash: {plays}/{MAX_PLAYS} marta · savollar bilan birga tinglang
                </p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 mt-3 flex-wrap">
              <span className="text-xs text-gray-500">Tezlik:</span>
              {SPEED_OPTIONS.map(sp => (
                <button key={sp.value} onClick={() => tts.setSpeed(sp.value)}
                  className={`text-[11px] px-2 py-1 rounded-lg border transition-colors ${tts.speed === sp.value ? 'bg-orange-500 text-white border-orange-500' : 'bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 border-gray-200 dark:border-gray-600'}`}>
                  {sp.label}
                </button>
              ))}
            </div>
          </>
        ) : (
          <>
            <p className="text-xs font-semibold text-orange-700 mb-2">⚠️ Brauzer audio'ni qo'llab-quvvatlamaydi — matnni o'qing</p>
            <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{listeningText}</p>
          </>
        )}
      </div>

      {/* ── Transkript (faqat tinglagandan keyin) ── */}
      {plays > 0 && tts.supported && (
        <div className="mb-4">
          <button onClick={() => setShowScript(s => !s)} className="text-xs font-semibold text-orange-600 hover:underline">
            📄 Transkript {showScript ? 'yashirish' : "ko'rsatish"}
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
      </div>

      <button onClick={submit} disabled={answered === 0} className="w-full btn-primary text-sm mt-4">
        Listening'ni yakunlash ({answered}/{listeningMCQ.length}) →
      </button>
    </div>
  )
}

// ── IELTS Writing ─────────────────────────────────────────────────────────────

function IELTSWriting({ data, onDone }: { data: MockTestData | null; onDone: (t1: number, t2: number) => void }) {
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
              <span key={t} className={`text-[11px] px-2 py-0.5 rounded-full font-semibold
                ${task === t ? 'bg-b2-100 text-b2-700' : done1 && t === 1 ? 'bg-green-100 text-green-700' : 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500'}`}>
                Task {t} {done1 && t === 1 ? '✓' : ''}
              </span>
            ))}
          </div>
        </div>
        <Timer fmt={timer.fmt} pct={timer.pct} warn={timer.left < 300} />
      </div>

      <div className="card bg-b2-50 border-b2-100 mb-3">
        <p className="text-xs font-semibold text-b2-700 mb-1">{task === 1 ? 'Task 1 — Data Description (150+ so\'z)' : 'Task 2 — Essay (250+ so\'z)'}</p>
        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{curPrompt.prompt}</p>
      </div>

      <div className="card mb-3">
        <textarea
          className="w-full min-h-[200px] text-sm text-gray-800 dark:text-gray-100 dark:bg-transparent leading-relaxed resize-none outline-none placeholder-gray-300 dark:placeholder-gray-600"
          placeholder="Bu yerda yozing..."
          value={curText}
          onChange={(e) => setCurText(e.target.value)}
          disabled={task === 1 ? loading1 : loading2}
        />
        <div className="flex justify-between pt-2 border-t border-gray-100 dark:border-gray-700 mt-2">
          <span className={`text-xs font-semibold ${wc >= minWords ? 'text-green-600' : 'text-gray-400'}`}>
            {wc} / {minWords} so'z
          </span>
        </div>
      </div>

      <button onClick={task === 1 ? submitTask1 : submitTask2} disabled={!canSubmit}
        className="w-full btn-primary text-sm flex items-center justify-center gap-2">
        {(task === 1 ? loading1 : loading2)
          ? <><Loader2 size={14} className="animate-spin" /> Claude baholamoqda...</>
          : task === 1 ? 'Task 1 yakunlash → Task 2' : "Writing'ni yakunlash ✓"}
      </button>
    </div>
  )
}

// ── IELTS Speaking ────────────────────────────────────────────────────────────

function IELTSSpeaking({ prompts, onDone }: { prompts: import('@/services/speakingService').SpeakingPrompt[]; onDone: (s1: number, s2: number) => void }) {
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
          <span className="text-xs font-semibold text-purple-600">🎤 Speaking · Prompt {pIdx + 1}/2</span>
        </div>
        <Timer fmt={timer.fmt} pct={timer.pct} warn={timer.left < 120} />
      </div>

      {noSpeech && (
        <div className="card bg-orange-50 border-orange-100 mb-3 flex items-center gap-2">
          <AlertTriangle size={14} className="text-orange-500 flex-shrink-0" />
          <p className="text-xs text-orange-700">Brauzer Web Speech API ni qo'llab-quvvatlamaydi. Javobingizni matn sifatida kiriting.</p>
        </div>
      )}

      <div className="card bg-purple-50 border-purple-100 mb-4">
        <p className="text-xs text-purple-500 mb-1">Savol:</p>
        <p className="text-sm font-medium text-purple-900 leading-relaxed">{p.prompt}</p>
        <div className="mt-2 space-y-1">
          {p.tips.map((tip, i) => (
            <p key={i} className="text-[11px] text-purple-600">💡 {tip}</p>
          ))}
        </div>
      </div>

      <div className="card mb-3">
        {noSpeech ? (
          <textarea
            className="w-full min-h-[120px] text-sm text-gray-800 leading-relaxed resize-none outline-none placeholder-gray-300"
            placeholder="Javobingizni bu yerga yozing..."
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
          />
        ) : (
          <div className="min-h-[80px]">
            {transcript
              ? <p className="text-sm text-gray-700 leading-relaxed">{transcript}</p>
              : <p className="text-sm text-gray-400 italic">Mikrofon tugmasini bosib gapiring...</p>}
          </div>
        )}
      </div>

      <div className="flex gap-2">
        {!noSpeech && (
          <button onClick={recording ? stopRec : startRec}
            className={`flex-1 py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 border transition-all
              ${recording ? 'bg-red-50 dark:bg-red-900/20 border-red-200 text-red-600' : 'bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'}`}>
            {recording ? <><MicOff size={14} /> To'xtatish</> : <><Mic size={14} /> Yozish</>}
          </button>
        )}
        <button onClick={submit} disabled={!transcript.trim() || loading || recording}
          className="flex-1 btn-primary text-sm flex items-center justify-center gap-2">
          {loading
            ? <><Loader2 size={14} className="animate-spin" /> Baholanmoqda...</>
            : pIdx === 0 ? 'Keyingi prompt →' : "Speaking'ni yakunlash ✓"}
        </button>
      </div>
    </div>
  )
}

// ── Result screen ─────────────────────────────────────────────────────────────

function ResultScreen({ data, onRetry }: { data: ResultData; onRetry: () => void }) {
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
          {isIELTS ? 'IELTS Band Score' : `${data.type.toUpperCase()} testi natijasi`}
        </p>
        <p className="text-5xl font-bold text-primary-700">
          {isIELTS ? band.toFixed(1) : `${Math.round(band)}%`}
        </p>
        {!isIELTS && (
          <p className="text-sm text-gray-500 mt-1">
            {data.weeklyScore}/{data.weeklyTotal} to'g'ri ·{' '}
            {band >= 80 ? 'B2 darajasi 🎉' : band >= 65 ? 'B1+ darajasi' : 'B1 darajasi'}
          </p>
        )}
        {data.prevScore !== undefined && (
          <p className={`text-xs mt-2 font-semibold ${band > data.prevScore ? 'text-green-600' : 'text-orange-500'}`}>
            {band > data.prevScore ? `▲ +${(band - data.prevScore).toFixed(1)} o'sish` : `▼ ${(data.prevScore - band).toFixed(1)} kamayish`} oldingi testga nisbatan
          </p>
        )}
      </div>

      {/* IELTS section breakdown */}
      {isIELTS && data.ielts && (
        <div className="card mb-4">
          <p className="text-sm font-semibold text-gray-700 mb-3">Bo'limlar bo'yicha</p>
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
            ⚠️ Zaif tomon: {weakSection.label}
          </p>
          <p className="text-xs text-orange-600 mb-2">
            Bu bo'limni kuchaytirish uchun qo'shimcha mashqlar bajaring.
          </p>
          <button onClick={() => navigate(weakSection.path)} className="text-xs font-semibold text-orange-700 underline">
            {weakSection.label} darslariga o'tish →
          </button>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <button onClick={onRetry} className="btn-secondary flex-1 text-sm">
          Qayta testlash
        </button>
        <button onClick={() => navigate('/')} className="btn-primary flex-1 text-sm">
          Bosh sahifa
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
