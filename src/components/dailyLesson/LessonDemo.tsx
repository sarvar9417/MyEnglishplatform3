import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { X, Check, Volume2, Lightbulb, ChevronRight, Trophy, RotateCcw, Sparkles, Wand2, Mic, Square } from 'lucide-react'
import { DEMO_LESSON, type DemoStep, type DemoLesson } from '../../data/lessonDemoContent'
import { useStore } from '../../store/useStore'
import { feelAnswer, feelLevelUp, feelTap, rollCritical } from '../../lib/gameFeel'
import { emitXpBurst } from '../ui/XpBurst'
import { speak } from '../../lib/tts'
import { scheduleReview } from '../../lib/grammarSrs'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'

type Phase = 'context' | 'intro' | 'examples' | 'vocab' | 'practice' | 'result'

interface Mistake { q: string; your: string; correct: string; explanation: string }

// Savol matni va to'g'ri javobni step turidan chiqaramiz (xatolar ro'yxati uchun)
function stepQuestion(step: DemoStep): string {
  switch (step.type) {
    case 'build':  return step.uz
    case 'choose': return step.sentence
    case 'listen': return '🔊 ' + step.audio
    case 'judge':  return step.sentence
    case 'match':  return "So'z–tarjima moslash"
  }
}
function stepCorrectText(step: DemoStep): string {
  switch (step.type) {
    case 'build':  return step.correct.join(' ')
    case 'choose': return step.correct
    case 'listen': return step.correct
    case 'judge':  return step.isCorrect ? "To'g'ri" : "Noto'g'ri"
    case 'match':  return step.pairs.map(p => `${p.en} = ${p.uz}`).join(', ')
  }
}

export default function LessonDemo({ onExit, lesson = DEMO_LESSON }: { onExit: () => void; lesson?: DemoLesson }) {
  const { addXP } = useStore()
  const navigate = useNavigate()

  const [phase, setPhase] = useState<Phase>('context')
  const [idx, setIdx]     = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [sessionXp, setSessionXp] = useState(0)
  const [combo, setCombo] = useState(0)
  const [mistakes, setMistakes] = useState<Mistake[]>([])

  // Vocab talaffuz mashqi
  const sr = useSpeechRecognition()
  const [spokenWords, setSpokenWords] = useState<Set<string>>(new Set())
  useEffect(() => {
    if (!sr.isRecording) return
    const heard = (sr.transcript + ' ' + sr.interim).toLowerCase()
    const newly = lesson.vocab.filter(v => {
      const w = v.en.split(/[^a-z']/i)[0].toLowerCase()  // "go → went" dan "go"
      return w.length > 1 && heard.includes(w)
    }).map(v => v.en)
    if (newly.length) setSpokenWords(prev => new Set([...prev, ...newly]))
  }, [sr.transcript, sr.interim, sr.isRecording, lesson.vocab])

  function toggleVocabMic() {
    if (sr.isRecording) { sr.stop() }
    else { if ('speechSynthesis' in window) speechSynthesis.cancel(); sr.reset(); sr.start() }
  }

  const total = lesson.steps.length
  const step  = lesson.steps[idx]

  function onAnswer(ok: boolean, your?: string) {
    if (!ok) {
      // Xatoni ro'yxatga yozamiz (natijada "xatolar ustida ishlash")
      setMistakes(m => [...m, {
        q: stepQuestion(step),
        your: your ?? '—',
        correct: stepCorrectText(step),
        explanation: step.explanation,
      }])
    }
    if (ok) {
      const newCombo = combo + 1
      setCombo(newCombo)
      const critical = rollCritical()
      const base = 10
      const bonus = critical ? base : Math.round(base * (newCombo >= 5 ? 0.5 : newCombo >= 3 ? 0.25 : 0))
      const earned = base + bonus
      feelAnswer({ correct: true, combo: newCombo, critical })
      emitXpBurst(earned, critical)
      setCorrectCount(c => c + 1)
      setSessionXp(x => x + earned)
      addXP(earned)
    } else {
      // O'rganishda xato uchun jon yo'qotilmaydi — xato qilish o'rganishning
      // tabiiy qismi (audit tavsiyasi). Ijobiy mustahkamlash combo orqali beriladi.
      setCombo(0)
      feelAnswer({ correct: false })
    }
  }

  function nextStep() {
    if (idx < total - 1) {
      setIdx(i => i + 1)
    } else {
      if (correctCount === total) feelLevelUp()
      // Spaced repetition: dars natijasini takror jadvaliga yozamiz
      const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0
      scheduleReview(lesson.id, pct)
      setPhase('result')
    }
  }

  // ═══ CONTEXT (hayotiy vaziyat kirish) ═══
  if (phase === 'context') {
    return (
      <Shell onExit={onExit}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-5 animate-slide-up">
          <div className="text-6xl">{lesson.emoji}</div>
          <div>
            <span className="badge bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 mb-2">{lesson.level}</span>
            <h1 className="text-2xl font-black text-gray-900 dark:text-white">{lesson.skill}</h1>
          </div>
          <div className="card bg-gradient-to-r from-violet-50 to-indigo-50 dark:from-violet-900/20 dark:to-indigo-900/20 border-violet-100 dark:border-violet-800 max-w-md">
            <p className="text-[10px] font-bold text-violet-500 uppercase tracking-wider mb-1.5">
              📖 {lesson.context.location}
            </p>
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{lesson.context.text}</p>
          </div>
          <button onClick={() => { feelTap(); setPhase('intro') }} className="btn-primary px-8 py-3 font-bold flex items-center gap-2">
            Boshlash <ChevronRight size={18} />
          </button>
        </div>
      </Shell>
    )
  }

  // ═══ INTRO (mavzu haqida qisqa tushuntirish) ═══
  if (phase === 'intro') {
    return (
      <Shell onExit={onExit}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-5 animate-slide-up">
          <div className="text-center">
            <div className="text-5xl mb-2">{lesson.emoji}</div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white">{lesson.intro.title}</h2>
          </div>
          <div className="w-full max-w-md space-y-2.5">
            {lesson.intro.points.map((point, i) => (
              <div key={i} className="card flex items-start gap-3 py-3">
                <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-400 text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                  {i + 1}
                </span>
                <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">{point}</p>
              </div>
            ))}
          </div>
          <button onClick={() => { feelTap(); setPhase('examples') }} className="btn-primary px-8 py-3 font-bold flex items-center gap-2">
            Misollarni ko'rish <ChevronRight size={18} />
          </button>
        </div>
      </Shell>
    )
  }

  // ═══ EXAMPLES (induktiv — naqsh sezish) ═══
  if (phase === 'examples') {
    return (
      <Shell onExit={onExit}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-5 animate-slide-up">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-cyan-600 uppercase tracking-wider mb-2">
              <Sparkles size={14} /> Avval misollarni ko'ring
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Naqshni o'zingiz seziб ko'ring — qoidani keyin tushuntiramiz
            </p>
          </div>
          <div className="w-full max-w-md space-y-3">
            {lesson.examples.map((ex, i) => (
              <div key={i} className="card flex items-center gap-3">
                <button
                  onClick={() => speak(ex.en)}
                  aria-label="Tinglash"
                  className="w-9 h-9 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-500 hover:bg-blue-100 shrink-0"
                >
                  <Volume2 size={16} />
                </button>
                <div className="min-w-0">
                  <p className="text-base font-bold text-gray-900 dark:text-white">
                    {highlightKey(ex.en, ex.key)}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 italic">{ex.uz}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="text-xs text-gray-400">
            🔵 <span className="text-blue-500 font-semibold">can</span> — qobiliyatni bildiradi
          </p>
          <button onClick={() => { feelTap(); setPhase('vocab') }} className="btn-primary px-8 py-3 font-bold flex items-center gap-2">
            Yangi so'zlar <ChevronRight size={18} />
          </button>
        </div>
      </Shell>
    )
  }

  // ═══ VOCAB (yangi so'zlar) ═══
  if (phase === 'vocab') {
    return (
      <Shell onExit={onExit}>
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-5 animate-slide-up">
          <div className="text-center">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-500 uppercase tracking-wider mb-2">
              <Sparkles size={14} /> Yangi so'zlar
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
              Bu fe'llar "can" bilan ishlatiladi — tinglab eslab qoling
            </p>
          </div>
          <div className="w-full max-w-md grid grid-cols-2 gap-2.5">
            {lesson.vocab.map((v) => {
              const spoken = spokenWords.has(v.en)
              return (
                <button
                  key={v.en}
                  onClick={() => speak(v.en)}
                  className={`card flex items-center gap-2.5 text-left transition-colors py-3 ${spoken ? 'border-green-300 dark:border-green-700 bg-green-50/50 dark:bg-green-900/10' : 'hover:border-pink-200'}`}
                >
                  <span className="text-2xl shrink-0">{v.emoji}</span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-bold text-gray-900 dark:text-white flex items-center gap-1">
                      {v.en} {spoken ? <Check size={13} className="text-green-500" /> : <Volume2 size={12} className="text-blue-400" />}
                    </p>
                    <p className="text-[11px] text-gray-500 dark:text-gray-400 truncate">{v.uz}</p>
                  </div>
                </button>
              )
            })}
          </div>

          {/* Talaffuz mashqi */}
          {sr.isSupported && (
            <div className="flex flex-col items-center gap-1.5">
              {sr.isRecording && <p className="text-[11px] text-rose-500 font-semibold animate-pulse">🎤 So'zlarni ovoz chiqarib o'qing…</p>}
              <button
                onClick={toggleVocabMic}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-semibold text-sm transition active:scale-95 ${
                  sr.isRecording ? 'bg-rose-500 text-white animate-pulse' : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300'
                }`}
              >
                {sr.isRecording ? <><Square size={15} /> To'xtatish</> : <><Mic size={16} /> Talaffuzni mashq qilish</>}
              </button>
              {spokenWords.size > 0 && <p className="text-[10px] text-green-500">{spokenWords.size}/{lesson.vocab.length} so'z aytildi ✅</p>}
            </div>
          )}

          <button onClick={() => { feelTap(); if (sr.isRecording) sr.stop(); setPhase('practice') }} className="btn-primary px-8 py-3 font-bold flex items-center gap-2">
            Mashq qilaman <ChevronRight size={18} />
          </button>
        </div>
      </Shell>
    )
  }

  // ═══ RESULT (xulosa) ═══
  if (phase === 'result') {
    const pct = Math.round((correctCount / total) * 100)
    const perfect = correctCount === total
    return (
      <Shell onExit={onExit}>
        <div className="flex flex-col items-center justify-center min-h-[70vh] p-2 text-center space-y-4">
          <div className={`text-7xl ${perfect ? 'animate-bounce' : ''}`}>{perfect ? '🏆' : pct >= 70 ? '🎉' : '💪'}</div>
          <h2 className="text-2xl font-black text-gray-900 dark:text-white">
            {perfect ? 'Mukammal!' : pct >= 70 ? "Zo'r natija!" : 'Yaxshi urinish!'}
          </h2>
          <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
            <div className="card text-center py-4">
              <Trophy size={20} className="text-yellow-500 mx-auto mb-1" />
              <p className="text-2xl font-black text-gray-800 dark:text-white">+{sessionXp}</p>
              <p className="text-[10px] text-gray-400 uppercase">XP</p>
            </div>
            <div className="card text-center py-4">
              <Check size={20} className="text-green-500 mx-auto mb-1" />
              <p className="text-2xl font-black text-gray-800 dark:text-white">{correctCount}/{total}</p>
              <p className="text-[10px] text-gray-400 uppercase">To'g'ri</p>
            </div>
          </div>

          {/* Xatolar ustida ishlash */}
          {mistakes.length > 0 && (
            <div className="card w-full max-w-md text-left bg-red-50 dark:bg-red-900/15 border-red-100 dark:border-red-900/40">
              <p className="text-xs font-bold text-red-600 dark:text-red-400 uppercase tracking-wide mb-2.5">
                📌 Xatolar ustida ishlash ({mistakes.length})
              </p>
              <div className="space-y-2.5">
                {mistakes.map((m, i) => (
                  <div key={i} className="text-xs border-b border-red-100/60 dark:border-red-900/30 last:border-0 pb-2 last:pb-0">
                    <p className="text-gray-500 dark:text-gray-400 mb-0.5">{m.q}</p>
                    {m.your && m.your !== '—' && <p className="text-red-500 line-through">{m.your}</p>}
                    <p className="text-green-600 dark:text-green-400 font-semibold">✓ {m.correct}</p>
                    <p className="text-gray-500 dark:text-gray-400 mt-0.5">💡 {m.explanation}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Dars yakuni — mustahkamlash */}
          <div className="card w-full max-w-md text-left bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800">
            <p className="text-xs font-bold text-green-700 dark:text-green-400 uppercase tracking-wide mb-2">
              ✅ Bugun o'rgandingiz
            </p>
            <ul className="space-y-1.5">
              {lesson.summary.map((s, i) => (
                <li key={i} className="text-sm text-gray-700 dark:text-gray-300 flex items-start gap-2">
                  <Check size={15} className="text-green-500 shrink-0 mt-0.5" /> {s}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-2 w-full max-w-xs">
            <button onClick={onExit} className="btn-primary py-3 font-bold">Tugatish →</button>
            <button
              onClick={() => navigate(`/ai-practice?topic=${encodeURIComponent(lesson.skill)}`)}
              className="py-3 font-bold rounded-xl bg-gradient-to-r from-fuchsia-500 to-purple-600 text-white flex items-center justify-center gap-1.5"
            >
              <Wand2 size={15} /> Shu mavzuda AI bilan mashq
            </button>
            <button
              onClick={() => { setPhase('context'); setIdx(0); setCorrectCount(0); setSessionXp(0); setCombo(0); setMistakes([]) }}
              className="btn-ghost flex items-center justify-center gap-1.5 text-sm"
            >
              <RotateCcw size={14} /> Qayta o'ynash
            </button>
          </div>
        </div>
      </Shell>
    )
  }

  // ═══ PRACTICE (mashqlar) ═══
  return (
    <Shell onExit={onExit}>
      {/* Progress + combo (jon tizimi o'rganishdan olib tashlandi — xatoga xavfsiz) */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex-1 h-3 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-green-400 to-emerald-500 rounded-full transition-all duration-300"
            style={{ width: `${(idx / total) * 100}%` }} />
        </div>
        {combo >= 2 && <span className="text-orange-500 font-bold text-sm animate-combo-pop">🔥{combo}</span>}
      </div>

      <StepRenderer key={idx} step={step} stepIndex={idx} rule={lesson.rule} onAnswer={onAnswer} onNext={nextStep} isLast={idx === total - 1} />

      <p className="text-center text-xs text-gray-400 mt-4">{idx + 1} / {total}</p>
    </Shell>
  )
}

// ─── Shell (umumiy o'rash) ───────────────────────────────────────────────────
function Shell({ children, onExit }: { children: React.ReactNode; onExit: () => void }) {
  return (
    <div className="max-w-xl mx-auto px-4 py-3">
      <button onClick={onExit} aria-label="Chiqish" className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 mb-2">
        <X size={22} />
      </button>
      {children}
    </div>
  )
}

// ─── Step renderer (qaysi savol turi) ────────────────────────────────────────
function StepRenderer({ step, stepIndex, rule, onAnswer, onNext, isLast }: {
  step: DemoStep
  stepIndex: number
  rule: { title: string; body: string }
  onAnswer: (ok: boolean, your?: string) => void
  onNext: () => void
  isLast: boolean
}) {
  const [answered, setAnswered] = useState(false)
  const [correct, setCorrect]   = useState(false)
  const [showRule, setShowRule] = useState(false)

  function finish(ok: boolean, your?: string) {
    if (answered) return
    setAnswered(true)
    setCorrect(ok)
    onAnswer(ok, your)
  }

  // "Yozib javob berish": bir so'zli javobli choose mashqlarining ~1/3 qismi
  // tugma o'rniga input bo'ladi (kuchliroq esda saqlash — desirable difficulty)
  const typeMode = step.type === 'choose'
    && /^[a-z']{2,14}$/i.test(step.correct)
    && stepIndex % 3 === 2

  const explanation = step.explanation

  return (
    <div className="animate-fade-in">
      {step.type === 'build'  && <BuildStep  step={step} answered={answered} onFinish={finish} />}
      {step.type === 'choose' && <ChooseStep step={step} answered={answered} correct={correct} typeMode={typeMode} onFinish={finish} />}
      {step.type === 'listen' && <ListenStep step={step} answered={answered} correct={correct} onFinish={finish} />}
      {step.type === 'judge'  && <JudgeStep  step={step} answered={answered} onFinish={finish} />}
      {step.type === 'match'  && <MatchStep  step={step} answered={answered} onFinish={finish} />}

      {/* Feedback + tushuntirish */}
      {answered && (
        <div className={`mt-4 p-3 rounded-xl border animate-fade-in ${
          correct ? 'bg-green-50 dark:bg-green-900/20 border-green-100 dark:border-green-800'
                  : 'bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-800'}`}>
          <p className={`text-xs leading-relaxed ${correct ? 'text-green-700 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
            {correct ? '✅ ' : '❌ '}{explanation}
          </p>
        </div>
      )}

      {/* "Nega?" qoida (xato bo'lganda yoki ixtiyoriy) */}
      {answered && (
        <div className="mt-3">
          <button onClick={() => setShowRule(s => !s)} className="text-xs text-indigo-500 hover:text-indigo-700 flex items-center gap-1">
            <Lightbulb size={13} /> {showRule ? 'Qoidani yashirish' : 'Nega? Qoidani ko\'rish'}
          </button>
          {showRule && (
            <div className="mt-2 p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/20 border border-indigo-100 dark:border-indigo-800 animate-fade-in">
              <p className="text-xs font-bold text-indigo-700 dark:text-indigo-400 mb-1">{rule.title}</p>
              <p className="text-xs text-gray-600 dark:text-gray-300 whitespace-pre-line leading-relaxed">{rule.body}</p>
            </div>
          )}
        </div>
      )}

      {/* Davom etish */}
      {answered && (
        <button onClick={onNext} className="btn-primary w-full mt-4 py-3 font-bold">
          {isLast ? 'Yakunlash' : 'Davom etish →'}
        </button>
      )}
    </div>
  )
}

// ─── build: so'zlardan gap tuzish ────────────────────────────────────────────
function BuildStep({ step, answered, onFinish }: {
  step: Extract<DemoStep, { type: 'build' }>; answered: boolean; onFinish: (ok: boolean, your?: string) => void
}) {
  const [picked, setPicked] = useState<number[]>([])   // bank indekslari (tartib bilan)
  // So'z banki aralashtiriladi — aks holda javob to'g'ri tartibda turadi (oson bo'ladi)
  const [bank] = useState(() => shuffleArr(step.words))

  function pick(i: number) {
    if (answered || picked.includes(i)) return
    feelTap()
    setPicked(p => [...p, i])
  }
  function unpick(i: number) {
    if (answered) return
    setPicked(p => p.filter(x => x !== i))
  }
  function check() {
    const result = picked.map(i => bank[i])
    const ok = result.length === step.correct.length && result.every((w, i) => w === step.correct[i])
    onFinish(ok, result.join(' '))
  }

  return (
    <div>
      <p className="text-[11px] font-semibold text-amber-500 uppercase tracking-wider mb-2 text-center">
        So'zlardan gap tuzing
      </p>
      <div className="card text-center py-4 mb-4">
        <p className="text-sm text-gray-500 dark:text-gray-400 italic">"{step.uz}"</p>
      </div>

      {/* Tanlangan so'zlar */}
      <div className="min-h-[52px] flex flex-wrap gap-2 items-center justify-center border-b-2 border-dashed border-gray-200 dark:border-gray-700 pb-3 mb-4">
        {picked.length === 0
          ? <span className="text-xs text-gray-300">Pastdagi so'zlarni bosing...</span>
          : picked.map(i => (
              <button key={i} onClick={() => unpick(i)} disabled={answered}
                className="px-3 py-1.5 rounded-xl bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300 text-sm font-semibold">
                {bank[i]}
              </button>
            ))}
      </div>

      {/* So'z banki */}
      <div className="flex flex-wrap gap-2 justify-center mb-4">
        {bank.map((w, i) => (
          <button key={i} onClick={() => pick(i)} disabled={answered || picked.includes(i)}
            className={`px-3 py-1.5 rounded-xl border-2 text-sm font-semibold transition-all
              ${picked.includes(i)
                ? 'border-gray-100 dark:border-gray-800 text-gray-300 dark:text-gray-600'
                : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:border-primary-300'}`}>
            {w}
          </button>
        ))}
      </div>

      {!answered && (
        <button onClick={check} disabled={picked.length === 0}
          className="btn-primary w-full py-3 font-bold disabled:opacity-40">
          Tekshirish
        </button>
      )}
    </div>
  )
}

// ─── choose: bo'shliqqa so'z tanlash (yoki yozish) ───────────────────────────
function ChooseStep({ step, answered, correct, typeMode, onFinish }: {
  step: Extract<DemoStep, { type: 'choose' }>; answered: boolean; correct: boolean; typeMode?: boolean; onFinish: (ok: boolean, your?: string) => void
}) {
  const [chosen, setChosen] = useState<string | null>(null)
  const [typed, setTyped] = useState('')
  const [opts] = useState(() => shuffleArr(step.options))

  // Yozib javob berish rejimi
  if (typeMode) {
    const checkTyped = () => {
      const ok = typed.trim().toLowerCase() === step.correct.toLowerCase()
      onFinish(ok, typed.trim() || '—')
    }
    return (
      <div>
        <p className="text-[11px] font-semibold text-fuchsia-500 uppercase tracking-wider mb-2 text-center flex items-center justify-center gap-1">
          ✏️ Javobni yozing
        </p>
        <div className="card text-center py-6 mb-2">
          <p className="text-lg font-bold text-gray-900 dark:text-white">{step.sentence}</p>
        </div>
        <p className="text-center text-xs text-gray-400 italic mb-4">"{step.uz}"</p>
        <input
          value={typed}
          onChange={e => setTyped(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter' && !answered && typed.trim()) checkTyped() }}
          disabled={answered}
          autoFocus
          placeholder="Bo'shliqqa mos so'zni yozing…"
          className={`w-full px-4 py-3 rounded-xl text-center text-lg font-bold outline-none border-2 ${
            answered
              ? (correct ? 'border-green-400 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
                         : 'border-red-400 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400')
              : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 focus:border-fuchsia-400'
          }`}
        />
        {answered && !correct && (
          <p className="text-center text-sm text-green-600 dark:text-green-400 font-semibold mt-2">✓ {step.correct}</p>
        )}
        {!answered && (
          <button onClick={checkTyped} disabled={!typed.trim()} className="btn-primary w-full mt-4 py-3 font-bold disabled:opacity-40">
            Tekshirish
          </button>
        )}
      </div>
    )
  }

  return (
    <div>
      <p className="text-[11px] font-semibold text-primary-500 uppercase tracking-wider mb-2 text-center">
        To'g'ri so'zni tanlang
      </p>
      <div className="card text-center py-6 mb-2">
        <p className="text-lg font-bold text-gray-900 dark:text-white">{step.sentence}</p>
      </div>
      <p className="text-center text-xs text-gray-400 italic mb-4">"{step.uz}"</p>
      <div className="grid grid-cols-1 gap-3">
        {opts.map(opt => {
          const isC = opt === step.correct
          const cls = !answered ? 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-primary-300 text-gray-800 dark:text-gray-200'
            : isC ? 'border-green-400 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
            : opt === chosen ? 'border-red-400 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
            : 'border-gray-200 dark:border-gray-700 opacity-50 text-gray-500'
          return (
            <button key={opt} disabled={answered}
              onClick={() => { setChosen(opt); onFinish(isC, opt) }}
              className={`p-4 rounded-2xl border-2 text-sm font-semibold transition-all flex items-center justify-between ${cls}`}>
              <span>{opt}</span>
              {answered && isC && <Check size={18} className="text-green-500" />}
              {answered && !isC && opt === chosen && <X size={18} className="text-red-500" />}
            </button>
          )
        })}
      </div>
      {answered && !correct && <span className="hidden" />}
    </div>
  )
}

// ─── listen: tinglab tanlash ─────────────────────────────────────────────────
function ListenStep({ step, answered, correct, onFinish }: {
  step: Extract<DemoStep, { type: 'listen' }>; answered: boolean; correct: boolean; onFinish: (ok: boolean, your?: string) => void
}) {
  const [chosen, setChosen] = useState<string | null>(null)
  const [opts] = useState(() => shuffleArr(step.options))
  return (
    <div>
      <p className="text-[11px] font-semibold text-blue-500 uppercase tracking-wider mb-3 text-center">
        Tinglang va to'g'ri yozuvni tanlang
      </p>
      <div className="flex justify-center mb-5">
        <button onClick={() => speak(step.audio)}
          className="w-16 h-16 rounded-full bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600 transition-colors shadow-lg">
          <Volume2 size={28} />
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3">
        {opts.map(opt => {
          const isC = opt === step.correct
          const cls = !answered ? 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-blue-300 text-gray-800 dark:text-gray-200'
            : isC ? 'border-green-400 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-400'
            : opt === chosen ? 'border-red-400 bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400'
            : 'border-gray-200 dark:border-gray-700 opacity-50 text-gray-500'
          return (
            <button key={opt} disabled={answered}
              onClick={() => { setChosen(opt); onFinish(isC, opt) }}
              className={`p-4 rounded-2xl border-2 text-sm font-semibold transition-all ${cls}`}>
              {opt}
            </button>
          )
        })}
      </div>
      {answered && !correct && <span className="hidden" />}
    </div>
  )
}

// ─── judge: to'g'ri / noto'g'ri ──────────────────────────────────────────────
function JudgeStep({ step, answered, onFinish }: {
  step: Extract<DemoStep, { type: 'judge' }>; answered: boolean; onFinish: (ok: boolean, your?: string) => void
}) {
  const [choice, setChoice] = useState<boolean | null>(null)
  return (
    <div>
      <p className="text-[11px] font-semibold text-purple-500 uppercase tracking-wider mb-3 text-center">
        Bu gap to'g'rimi?
      </p>
      <div className="card text-center py-8 mb-5">
        <p className="text-lg font-bold text-gray-900 dark:text-white">{step.sentence}</p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <button disabled={answered}
          onClick={() => { setChoice(true); onFinish(step.isCorrect === true, "To'g'ri") }}
          className={`p-4 rounded-2xl border-2 font-bold transition-all
            ${!answered ? 'border-green-200 hover:border-green-400 text-green-600'
              : step.isCorrect ? 'border-green-400 bg-green-50 dark:bg-green-900/30 text-green-600'
              : choice === true ? 'border-red-400 bg-red-50 dark:bg-red-900/30 text-red-500' : 'opacity-40 border-gray-200'}`}>
          ✓ To'g'ri
        </button>
        <button disabled={answered}
          onClick={() => { setChoice(false); onFinish(step.isCorrect === false, "Noto'g'ri") }}
          className={`p-4 rounded-2xl border-2 font-bold transition-all
            ${!answered ? 'border-red-200 hover:border-red-400 text-red-500'
              : !step.isCorrect ? 'border-green-400 bg-green-50 dark:bg-green-900/30 text-green-600'
              : choice === false ? 'border-red-400 bg-red-50 dark:bg-red-900/30 text-red-500' : 'opacity-40 border-gray-200'}`}>
          ✗ Noto'g'ri
        </button>
      </div>
    </div>
  )
}

// ─── match: so'z–tarjima moslash ─────────────────────────────────────────────
function MatchStep({ step, answered, onFinish }: {
  step: Extract<DemoStep, { type: 'match' }>; answered: boolean; onFinish: (ok: boolean, your?: string) => void
}) {
  const pairs = step.pairs
  // O'ng ustun aralashtirilgan (bir marta)
  const [shuffled] = useState(() => [...pairs].sort(() => Math.random() - 0.5))
  const [selEn, setSelEn]   = useState<string | null>(null)
  const [matched, setMatched] = useState<Set<string>>(new Set())
  const [wrongPair, setWrongPair] = useState<string | null>(null)
  const mistakesRef = useRef(0)

  function pickEn(en: string) {
    if (answered || matched.has(en)) return
    feelTap()
    setSelEn(en)
  }
  function pickUz(uz: string) {
    if (answered || !selEn) return
    const pair = pairs.find(p => p.en === selEn)
    if (pair && pair.uz === uz) {
      // To'g'ri moslik
      const next = new Set(matched); next.add(selEn)
      setMatched(next)
      setSelEn(null)
      if (next.size === pairs.length) {
        onFinish(mistakesRef.current === 0)
      }
    } else {
      // Xato moslik
      mistakesRef.current += 1
      setWrongPair(uz)
      setSelEn(null)
      setTimeout(() => setWrongPair(null), 500)
    }
  }

  return (
    <div>
      <p className="text-[11px] font-semibold text-emerald-500 uppercase tracking-wider mb-3 text-center">
        So'zlarni tarjimasi bilan moslang
      </p>
      <div className="grid grid-cols-2 gap-3">
        {/* Chap: inglizcha */}
        <div className="space-y-2">
          {pairs.map(p => (
            <button key={p.en} onClick={() => pickEn(p.en)} disabled={answered || matched.has(p.en)}
              className={`w-full p-3 rounded-xl border-2 text-sm font-semibold transition-all
                ${matched.has(p.en) ? 'border-green-300 bg-green-50 dark:bg-green-900/20 text-green-600 opacity-60'
                  : selEn === p.en ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300'
                  : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 hover:border-primary-300'}`}>
              {p.en}
            </button>
          ))}
        </div>
        {/* O'ng: tarjima (aralash) */}
        <div className="space-y-2">
          {shuffled.map(p => {
            const done = matched.has(p.en)
            return (
              <button key={p.uz} onClick={() => pickUz(p.uz)} disabled={answered || done}
                className={`w-full p-3 rounded-xl border-2 text-sm font-medium transition-all
                  ${done ? 'border-green-300 bg-green-50 dark:bg-green-900/20 text-green-600 opacity-60'
                    : wrongPair === p.uz ? 'border-red-400 bg-red-50 dark:bg-red-900/30 text-red-500'
                    : 'border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-emerald-300'}`}>
                {p.uz}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// Massivni aralashtirish (Fisher-Yates)
function shuffleArr<T>(arr: T[]): T[] {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// So'zdagi kalit qismni rangli qilish (induktiv vizual)
function highlightKey(text: string, key: string) {
  const parts = text.split(new RegExp(`(${key})`, 'gi'))
  return parts.map((p, i) =>
    p.toLowerCase() === key.toLowerCase()
      ? <span key={i} className="text-blue-500 font-black">{p}</span>
      : <span key={i}>{p}</span>
  )
}
