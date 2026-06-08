import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import {
  Play, Pause, Square, CheckCircle, XCircle, Volume2,
  Eye, EyeOff, Trophy, RotateCcw, Headphones,
  ChevronRight, ChevronLeft, BookOpen, Target,
  BarChart3, RefreshCw, AlertCircle, SkipForward,
} from 'lucide-react'
import type { ListeningSection as ListeningSectionType, ListeningQuestion } from '../../data/dailyLessons'
import { AudioButton } from '../ui/AudioButton'
import { assignSpeakerVoices, type SpeakerVoice } from '../../lib/voiceGender'

interface Props {
  section: ListeningSectionType
  addXP?: (amount: number) => void
}

type Phase = 'pre' | 'listen' | 'post' | 'result'
type ListenStep = 'first' | 'questions' | 'dictation'

const YT_BASE = 'https://www.youtube.com/embed/'
const SS = typeof window !== 'undefined' ? window.speechSynthesis : null

interface SpeakerSegment {
  speaker: string
  text: string
}

const SPEAKER_COLORS = [
  { text: 'text-sky-600 dark:text-sky-400', bg: 'bg-sky-100 dark:bg-sky-900/40', dot: 'bg-sky-500', border: 'border-sky-300 dark:border-sky-700' },
  { text: 'text-violet-600 dark:text-violet-400', bg: 'bg-violet-100 dark:bg-violet-900/40', dot: 'bg-violet-500', border: 'border-violet-300 dark:border-violet-700' },
  { text: 'text-emerald-600 dark:text-emerald-400', bg: 'bg-emerald-100 dark:bg-emerald-900/40', dot: 'bg-emerald-500', border: 'border-emerald-300 dark:border-emerald-700' },
  { text: 'text-orange-600 dark:text-orange-400', bg: 'bg-orange-100 dark:bg-orange-900/40', dot: 'bg-orange-500', border: 'border-orange-300 dark:border-orange-700' },
]

const SPEED_OPTIONS = [0.75, 1, 1.25, 1.5]

const DIFFICULTY_LABEL: Record<string, { label: string; color: string }> = {
  easy: { label: 'Oson', color: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-400' },
  medium: { label: "O'rtacha", color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-400' },
  hard: { label: 'Qiyin', color: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-400' },
}

function parseTranscript(transcript: string): SpeakerSegment[] {
  const lines = transcript.split('\n').map(l => l.trim()).filter(Boolean)
  const segments: SpeakerSegment[] = []
  for (const line of lines) {
    const match = line.match(/^([A-Za-z\u0400-\u04FF' -]+?):\s*(.+)/)
    if (match) {
      segments.push({ speaker: match[1].trim(), text: match[2].trim() })
    } else if (segments.length > 0) {
      segments[segments.length - 1].text += ' ' + line
    }
  }
  return segments
}

function getVoices(segments: SpeakerSegment[]): Map<string, SpeakerVoice> {
  const unique = [...new Set(segments.map(s => s.speaker))]
  return assignSpeakerVoices(unique)
}

function extractVocabulary(segments: SpeakerSegment[]): string[] {
  const words = segments.flatMap(s => s.text.split(/\s+/))
  const midFreq = words.filter(w => w.length > 4 && /^[a-z]+$/i.test(w))
  const unique = [...new Set(midFreq.map(w => w.toLowerCase()))]
  return unique.slice(0, 6)
}

export default function ListeningSection({ section, addXP }: Props) {
  const [phase, setPhase] = useState<Phase>('pre')
  const [listenStep, setListenStep] = useState<ListenStep>('first')
  const [showTranscript, setShowTranscript] = useState(false)
  const [answers, setAnswers] = useState<Record<string, number | number[] | string | boolean | string[]>>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [total, setTotal] = useState(0)
  const [xpAwarded, setXpAwarded] = useState(false)
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null)
  const [activeSegIdx, setActiveSegIdx] = useState<number | null>(null)
  const [playCount, setPlayCount] = useState(0)
  const [speed, setSpeed] = useState(1)
  const [dictationInputs, setDictationInputs] = useState<string[]>([])
  const [prediction, setPrediction] = useState('')

  const stoppedRef = useRef(false)
  const segmentsRef = useRef<SpeakerSegment[]>([])
  const transcriptEndRef = useRef<HTMLDivElement>(null)

  const segments = useMemo(() => parseTranscript(section.transcript), [section.transcript])
  segmentsRef.current = segments

  const uniqueSpeakers = [...new Set(segments.map(s => s.speaker))]
  const speakerColorMap = Object.fromEntries(
    uniqueSpeakers.map((spk, i) => [spk, SPEAKER_COLORS[i % SPEAKER_COLORS.length]])
  )

  // Shuffle question options once
  const shuffledMap = useMemo(() => {
    const map = new Map<number, { options: string[]; correctIndex: number }>()
    for (const q of section.questions) {
      if (q.options && q.correctIndex !== undefined) {
        const indices = q.options.map((_, i) => i)
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]]
        }
        map.set(q.id, {
          options: indices.map(i => q.options![i]),
          correctIndex: indices.indexOf(q.correctIndex),
        })
      }
    }
    return map
  }, [section.questions])

  useEffect(() => {
    if (!SS) return
    const cleanup = () => { SS.cancel(); stoppedRef.current = true }
    cleanup()
    return cleanup
  }, [section.transcript])

  const stopSpeech = useCallback(() => {
    if (!SS) return
    stoppedRef.current = true
    SS.cancel()
    setPlaying(false)
    setPaused(false)
    setActiveSpeaker(null)
    setActiveSegIdx(null)
  }, [])

  const playNext = useCallback((idx: number) => {
    if (!SS || stoppedRef.current) return
    const segs = segmentsRef.current
    if (idx >= segs.length) {
      setPlaying(false)
      setActiveSpeaker(null)
      setActiveSegIdx(null)
      setPlayCount(p => p + 1)
      return
    }
    const seg = segs[idx]
    const voices = getVoices(segs)
    const prof = voices.get(seg.speaker)
    const u = new SpeechSynthesisUtterance(seg.text)
    u.lang = 'en-US'
    u.pitch = prof?.pitch ?? 1
    u.rate = (prof?.rate ?? 0.88) * speed
    u.volume = 1
    if (prof?.voice) u.voice = prof.voice
    u.onstart = () => {
      if (!stoppedRef.current) {
        setActiveSpeaker(seg.speaker)
        setActiveSegIdx(idx)
        if (transcriptEndRef.current && showTranscript) {
          const el = document.getElementById(`seg-${idx}`)
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' })
        }
      }
    }
    u.onend = () => { if (!stoppedRef.current) playNext(idx + 1) }
    u.onerror = () => { if (!stoppedRef.current) playNext(idx + 1) }
    SS.speak(u)
  }, [speed, showTranscript])

  const playSpeech = useCallback(() => {
    if (!SS) return
    if (paused) { SS.resume(); setPaused(false); return }
    stopSpeech()
    stoppedRef.current = false
    setPlaying(true)
    setPaused(false)
    playNext(0)
  }, [paused, stopSpeech, playNext])

  const togglePause = useCallback(() => {
    if (!SS) return
    if (paused) { SS.resume(); setPaused(false) }
    else { SS.pause(); setPaused(true) }
  }, [paused])

  const playSegment = useCallback((idx: number) => {
    if (!SS) return
    stopSpeech()
    stoppedRef.current = false
    setPlaying(true)
    setPaused(false)
    playNext(idx)
  }, [stopSpeech, playNext])

  // ── Answer handlers ──

  const handleChoice = (qId: number, optionIdx: number) => {
    setAnswers(prev => ({ ...prev, [`mc-${qId}`]: optionIdx }))
  }

  const handleMultiChoice = (qId: number, optionIdx: number) => {
    setAnswers(prev => {
      const key = `ma-${qId}`
      const current = (prev[key] as number[]) || []
      const updated = current.includes(optionIdx)
        ? current.filter(i => i !== optionIdx)
        : [...current, optionIdx]
      return { ...prev, [key]: updated }
    })
  }

  const handleFillBlank = (qId: number, value: string) => {
    setAnswers(prev => ({ ...prev, [`fb-${qId}`]: value }))
  }

  const handleOrdering = (qId: number, items: number[]) => {
    setAnswers(prev => ({ ...prev, [`ord-${qId}`]: items }))
  }

  const handleTrueFalse = (qId: number, value: boolean) => {
    setAnswers(prev => ({ ...prev, [`tf-${qId}`]: value }))
  }

  const handleMatching = (qId: number, pairIdx: number, value: string) => {
    setAnswers(prev => {
      const key = `mat-${qId}`
      const current = (prev[key] as string[]) || []
      const updated = [...current]
      updated[pairIdx] = value
      return { ...prev, [key]: updated }
    })
  }

  const handleDictation = (idx: number, value: string) => {
    const updated = [...dictationInputs]
    updated[idx] = value
    setDictationInputs(updated)
  }

  // ── Scoring ──

  const gradeQuestions = useCallback(() => {
    let correct = 0
    let totalQ = 0

    for (const q of section.questions) {
      totalQ++
      const key = q.type === 'multiple-choice' ? `mc-${q.id}`
        : q.type === 'true-false' ? `tf-${q.id}`
        : q.type === 'multiple-answer' ? `ma-${q.id}`
        : q.type === 'fill-blank' ? `fb-${q.id}`
        : q.type === 'ordering' ? `ord-${q.id}`
        : q.type === 'matching' ? `mat-${q.id}`
        : ''

      const userAns = answers[key]

      switch (q.type) {
        case 'multiple-choice':
          if (userAns === q.correctIndex) correct++
          break
        case 'true-false':
          if (userAns === q.answer) correct++
          break
        case 'fill-blank':
          if (typeof userAns === 'string' && typeof q.answer === 'string' && userAns.toLowerCase().trim() === q.answer.toLowerCase().trim()) correct++
          break
        case 'multiple-answer':
          if (Array.isArray(userAns) && Array.isArray(q.correctIndices) &&
              userAns.length === q.correctIndices.length &&
              userAns.every(i => q.correctIndices!.includes(i as number))) correct++
          break
        case 'ordering':
          if (Array.isArray(userAns) && Array.isArray(q.correctOrder) &&
              userAns.length === q.correctOrder.length &&
              userAns.every((v, i) => v === q.correctOrder![i])) correct++
          break
        case 'matching':
          if (Array.isArray(userAns) && Array.isArray(q.pairs) &&
              userAns.length === q.pairs.length &&
              userAns.every((v, i) => v === q.pairs![i].right)) correct++
          break
      }
    }

    // Dictation scoring
    if (section.dictation && dictationInputs.length > 0) {
      for (let i = 0; i < section.dictation.length; i++) {
        totalQ++
        const { startLine } = section.dictation[i]
        const seg = segments[startLine]
        if (seg && dictationInputs[i]?.toLowerCase().trim() === seg.text.toLowerCase().trim()) {
          correct++
        }
      }
    }

    setScore(correct)
    setTotal(totalQ)
    return { correct, total: totalQ }
  }, [section, answers, dictationInputs, segments])

  const handleSubmit = () => {
    const { correct, total: totalQ } = gradeQuestions()
    setSubmitted(true)
    setScore(correct)
    setTotal(totalQ)
    if (!xpAwarded && addXP) {
      addXP(correct * 10)
      setXpAwarded(true)
    }
  }

  const handleRetry = () => {
    setAnswers({})
    setDictationInputs([])
    setSubmitted(false)
    setXpAwarded(false)
  }

  const pct = total > 0 ? Math.round((score / total) * 100) : 0

  const allAnswered = useMemo(() => {
    for (const q of section.questions) {
      const key = q.type === 'multiple-choice' ? `mc-${q.id}`
        : q.type === 'true-false' ? `tf-${q.id}`
        : q.type === 'multiple-answer' ? `ma-${q.id}`
        : q.type === 'fill-blank' ? `fb-${q.id}`
        : q.type === 'ordering' ? `ord-${q.id}`
        : q.type === 'matching' ? `mat-${q.id}`
        : ''
      if (answers[key] === undefined || (Array.isArray(answers[key]) && (answers[key] as Array<unknown>).length === 0)) return false
    }
    if (section.dictation && dictationInputs.some(d => !d.trim())) return false
    return true
  }, [section, answers, dictationInputs])

  // ── Pre-Listening: vocabulary extraction ──
  const previewVocab = useMemo(() => {
    if (section.vocabulary) return section.vocabulary
    return extractVocabulary(segments).map(word => ({ word, definition: '...', example: '' }))
  }, [section.vocabulary, segments])

  // ── Render helpers ──

  const renderDifficulty = (q: ListeningQuestion) => {
    const d = DIFFICULTY_LABEL[q.difficulty || 'easy']
    return <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${d.color}`}>{d.label}</span>
  }

  const renderQuestionCard = (q: ListeningQuestion, index: number) => {
    const isSubmitted = submitted
    const key = q.type === 'multiple-choice' ? `mc-${q.id}`
      : q.type === 'true-false' ? `tf-${q.id}`
      : q.type === 'multiple-answer' ? `ma-${q.id}`
      : q.type === 'fill-blank' ? `fb-${q.id}`
      : q.type === 'ordering' ? `ord-${q.id}`
      : q.type === 'matching' ? `mat-${q.id}`
      : ''
    const userAns = answers[key]

    let isCorrect = false
    if (isSubmitted) {
      switch (q.type) {
        case 'multiple-choice': isCorrect = userAns === q.correctIndex; break
        case 'true-false': isCorrect = userAns === q.answer; break
        case 'fill-blank': isCorrect = typeof userAns === 'string' && typeof q.answer === 'string' && userAns.toLowerCase().trim() === q.answer.toLowerCase().trim(); break
        case 'multiple-answer': isCorrect = Array.isArray(userAns) && Array.isArray(q.correctIndices) && userAns.length === q.correctIndices.length && userAns.every(i => q.correctIndices!.includes(i as number)); break
        case 'ordering': isCorrect = Array.isArray(userAns) && Array.isArray(q.correctOrder) && userAns.length === q.correctOrder.length && userAns.every((v, i) => v === q.correctOrder![i]); break
        case 'matching': isCorrect = Array.isArray(userAns) && Array.isArray(q.pairs) && userAns.length === q.pairs.length && userAns.every((v, i) => v === q.pairs![i].right); break
      }
    }

    const renderOptions = () => {
      switch (q.type) {
        case 'multiple-choice':
        case 'true-false': {
          const options = q.type === 'true-false'
            ? ['True', 'False']
            : (shuffledMap.get(q.id)?.options ?? q.options ?? [])
          const correctIdx = q.type === 'true-false'
            ? ((q.answer as unknown as boolean) === true ? 0 : 1)
            : (shuffledMap.get(q.id)?.correctIndex ?? q.correctIndex!)
          return (
            <div className="space-y-1.5">
              {options.map((opt, i) => {
                const isSelected = userAns === i
                let cls = 'border-gray-200 dark:border-gray-600 hover:border-primary-300 dark:hover:border-primary-700 text-gray-700 dark:text-gray-300'
                if (isSubmitted) {
                  if (i === correctIdx) cls = 'border-green-400 dark:border-green-600 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 font-semibold'
                  else if (isSelected && !isCorrect) cls = 'border-red-400 dark:border-red-600 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  else cls = 'border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-600'
                } else if (isSelected) {
                  cls = 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300'
                }
                return (
                  <button key={i} onClick={() => !isSubmitted && (q.type === 'true-false' ? handleTrueFalse(q.id, i === 0) : handleChoice(q.id, i))}
                    disabled={isSubmitted}
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm transition-all ${cls}`}>
                    <span className={`w-5 h-5 rounded-full border flex items-center justify-center text-[10px] font-bold shrink-0 ${isSelected && !isSubmitted ? 'bg-primary-500 border-primary-500 text-white' : isSubmitted && i === correctIdx ? 'bg-green-500 border-green-500 text-white' : isSubmitted && isSelected && !isCorrect ? 'bg-red-500 border-red-500 text-white' : 'border-current'}`}>
                      {String.fromCharCode(65 + i)}
                    </span>
                    <span className="flex-1">{opt}</span>
                    {isSubmitted && i === correctIdx && <CheckCircle size={14} className="text-green-600 dark:text-green-400 shrink-0" />}
                    {isSubmitted && isSelected && !isCorrect && <XCircle size={14} className="text-red-500 shrink-0" />}
                  </button>
                )
              })}
            </div>
          )
        }
        case 'fill-blank':
          return (
            <div className="space-y-2">
              <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed italic bg-gray-50 dark:bg-gray-800 rounded-xl p-3">
                {q.question.split('_____').map((part, i, arr) => (
                  <span key={i}>
                    {part}
                    {i < arr.length - 1 && (
                      <input
                        type="text"
                        value={(typeof userAns === 'string' ? userAns : '') || ''}
                        onChange={e => handleFillBlank(q.id, e.target.value)}
                        disabled={isSubmitted}
                        className={`inline-block mx-1 px-2 py-0.5 border-b-2 text-center font-semibold min-w-[100px] bg-transparent focus:outline-none ${isSubmitted ? (isCorrect ? 'border-green-500 text-green-700 dark:text-green-400' : 'border-red-500 text-red-700 dark:text-red-400') : 'border-primary-400 dark:border-primary-600 text-primary-700 dark:text-primary-300'}`}
                        placeholder="type here..."
                        autoComplete="off"
                      />
                    )}
                  </span>
                ))}
              </div>
              {isSubmitted && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  To'g'ri javob: <span className="font-bold text-green-700 dark:text-green-400">{q.answer}</span>
                </p>
              )}
            </div>
          )

        case 'multiple-answer': {
          const options = q.options ?? []
          const correctIndices = q.correctIndices ?? []
          const selected = (userAns as number[]) || []
          return (
            <div className="space-y-1.5">
              <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold mb-2">Bir nechta to'g'ri javobni tanlang:</p>
              {options.map((opt, i) => {
                const isSelected = selected.includes(i)
                let cls = 'border-gray-200 dark:border-gray-600 hover:border-primary-300 text-gray-700 dark:text-gray-300'
                if (isSubmitted) {
                  if (correctIndices.includes(i) && isSelected) cls = 'border-green-400 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 font-semibold'
                  else if (correctIndices.includes(i)) cls = 'border-green-400 bg-green-50/50 dark:bg-green-900/20 text-green-700 dark:text-green-400'
                  else if (isSelected) cls = 'border-red-400 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
                  else cls = 'border-gray-100 dark:border-gray-800 text-gray-400 dark:text-gray-600'
                } else if (isSelected) {
                  cls = 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-800 dark:text-primary-300'
                }
                return (
                  <button key={i} onClick={() => !isSubmitted && handleMultiChoice(q.id, i)} disabled={isSubmitted}
                    className={`w-full text-left flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-sm transition-all ${cls}`}>
                    <span className={`w-5 h-5 rounded flex items-center justify-center text-[10px] font-bold shrink-0 border ${isSelected && !isSubmitted ? 'bg-primary-500 border-primary-500 text-white' : isSubmitted && correctIndices.includes(i) ? 'bg-green-500 border-green-500 text-white' : isSubmitted && isSelected ? 'bg-red-500 border-red-500 text-white' : 'border-current'}`}>
                      {isSelected ? '✓' : String.fromCharCode(65 + i)}
                    </span>
                    {opt}
                    {isSubmitted && correctIndices.includes(i) && <CheckCircle size={14} className="text-green-600 ml-auto shrink-0" />}
                  </button>
                )
              })}
            </div>
          )
        }
        case 'ordering': {
          const items = q.options ?? []
          const currentOrder = (userAns as number[]) || items.map((_, i) => i)
          return (
            <div className="space-y-1.5">
              <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold mb-2">Voqealarni tartib bilan joylashtiring:</p>
              {currentOrder.map((itemIdx, pos) => (
                <div key={pos} className="flex items-center gap-2 px-3 py-2 rounded-xl border border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800">
                  <span className="w-6 h-6 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-xs font-bold shrink-0">{pos + 1}</span>
                  <span className="flex-1 text-sm text-gray-700 dark:text-gray-300">{items[itemIdx]}</span>
                  {!isSubmitted && (
                    <div className="flex gap-1">
                      <button onClick={() => { if (pos === 0) return; const upd = [...currentOrder]; [upd[pos], upd[pos - 1]] = [upd[pos - 1], upd[pos]]; handleOrdering(q.id, upd) }}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
                        <ChevronLeft size={14} />
                      </button>
                      <button onClick={() => { if (pos === currentOrder.length - 1) return; const upd = [...currentOrder]; [upd[pos], upd[pos + 1]] = [upd[pos + 1], upd[pos]]; handleOrdering(q.id, upd) }}
                        className="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400">
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        }
        case 'matching': {
          const pairs = q.pairs ?? []
          const matchAnswers = (userAns as string[]) || []
          return (
            <div className="space-y-3">
              <p className="text-xs text-primary-600 dark:text-primary-400 font-semibold mb-2">Har bir gapni to'g'ri kishiga moslang:</p>
              {pairs.map((pair, i) => (
                <div key={i} className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 w-1/3">{pair.left}</span>
                  <ChevronRight size={14} className="text-gray-400 shrink-0" />
                  <select
                    value={matchAnswers[i] || ''}
                    onChange={e => handleMatching(q.id, i, e.target.value)}
                    disabled={isSubmitted}
                    className={`flex-1 px-3 py-2 rounded-xl border text-sm bg-white dark:bg-gray-800 ${isSubmitted ? (matchAnswers[i] === pair.right ? 'border-green-400 text-green-700' : 'border-red-400 text-red-700') : 'border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300'}`}
                  >
                    <option value="">-- Tanlang --</option>
                    {pairs.map((p, j) => (
                      <option key={j} value={p.right}>{p.right}</option>
                    ))}
                  </select>
                  {isSubmitted && matchAnswers[i] === pair.right && <CheckCircle size={14} className="text-green-500 shrink-0" />}
                  {isSubmitted && matchAnswers[i] !== pair.right && matchAnswers[i] !== '' && <XCircle size={14} className="text-red-500 shrink-0" />}
                </div>
              ))}
              {isSubmitted && (
                <div className="text-xs text-gray-500 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-2.5 mt-2">
                  To'g'ri moslamalar: {pairs.map(p => `${p.left} → ${p.right}`).join(', ')}
                </div>
              )}
            </div>
          )
        }
        default:
          return null
      }
    }

    return (
      <div key={q.id} className={`card ${isSubmitted ? (isCorrect ? 'ring-1 ring-green-300 dark:ring-green-700' : 'ring-1 ring-red-300 dark:ring-red-700') : ''}`}>
        <div className="flex items-start justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 transition-colors ${isSubmitted ? (isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white') : 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300'}`}>
              {index + 1}
            </span>
            <p className="text-sm font-semibold text-gray-900 dark:text-gray-100">{q.question}</p>
          </div>
          {renderDifficulty(q)}
        </div>
        {renderOptions()}
        {isSubmitted && (
          <div className="mt-2.5 flex items-start gap-1.5 bg-blue-50 dark:bg-blue-900/20 rounded-xl p-2.5">
            <span className="text-blue-500 text-xs mt-0.5">💡</span>
            <p className="text-xs text-blue-700 dark:text-blue-300 italic">{q.explanation}</p>
          </div>
        )}
      </div>
    )
  }

  // ── Main render ──

  return (
    <div className="space-y-5">
      {/* ═══ PHASE INDICATOR ═══ */}
      <div className="flex items-center gap-2">
        {(['pre', 'listen', 'post', 'result'] as const).map((p, i) => {
          const isActive = phase === p
          const isPast = ['pre', 'listen', 'post', 'result'].indexOf(phase) > i
          return (
            <div key={p} className="flex items-center gap-2 flex-1">
              <div className={`flex items-center gap-1.5 ${isActive ? 'text-primary-600 dark:text-primary-400' : isPast ? 'text-green-600 dark:text-green-400' : 'text-gray-300 dark:text-gray-600'}`}>
                <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-all ${isActive ? 'bg-primary-600 text-white' : isPast ? 'bg-green-500 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-400'}`}>
                  {isPast ? '✓' : i + 1}
                </div>
                <span className="text-[10px] font-semibold hidden sm:inline">
                  {p === 'pre' ? 'Tayyorgarlik' : p === 'listen' ? 'Tinglash' : p === 'post' ? 'Mashqlar' : 'Natija'}
                </span>
              </div>
              {i < 3 && <div className={`flex-1 h-px ${isPast ? 'bg-green-400' : 'bg-gray-200 dark:bg-gray-700'}`} />}
            </div>
          )
        })}
      </div>

      {/* ═══ PRE-LISTENING ═══ */}
      {phase === 'pre' && (
        <div className="space-y-4">
          <div className="card bg-gradient-to-br from-sky-50 to-indigo-50 dark:from-sky-900/20 dark:to-indigo-900/20 border-sky-100 dark:border-sky-800">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen size={16} className="text-sky-600" />
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Tinglashga Tayyorgarlik</h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-3">
              Tinglashdan oldin quyidagi so'zlar bilan tanishib oling. Ular matnda uchraydi.
            </p>
            <div className="flex flex-wrap gap-2">
              {previewVocab.map((v, i) => (
                <div key={i} className="bg-white dark:bg-gray-800 rounded-xl px-3 py-2 border border-sky-100 dark:border-sky-800">
                  <span className="text-sm font-bold text-gray-900 dark:text-gray-100">{v.word}</span>
                  {v.definition !== '...' && v.definition && (
                    <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">— {v.definition}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {section.topic && (
            <div className="card">
              <div className="flex items-center gap-2 mb-2">
                <Target size={16} className="text-primary-600" />
                <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Mavzu</h3>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300">{section.topic}</p>
              {section.source && (
                <p className="text-xs text-gray-400 mt-1">Manba: {section.source} {section.duration ? `· ${section.duration}` : ''}</p>
              )}
            </div>
          )}

          <div className="card">
            <div className="flex items-center gap-2 mb-2">
              <BarChart3 size={16} className="text-amber-600" />
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Bashorat Qiling</h3>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              Sizningcha, bu dialog nima haqida? Yuqoridagi so'z va mavzuga qarab fikr bildiring.
            </p>
            <textarea
              value={prediction}
              onChange={e => setPrediction(e.target.value)}
              placeholder="Menimcha, bu dialog ... haqida, chunki ..."
              className="input text-sm min-h-[60px] resize-none"
              rows={2}
            />
          </div>

          <button onClick={() => setPhase('listen')} className="btn-primary w-full py-3 flex items-center justify-center gap-2">
            <Headphones size={16} /> Tinglashni Boshlash
          </button>
        </div>
      )}

      {/* ═══ LISTENING ═══ */}
      {phase === 'listen' && (
        <div className="space-y-4">
          {/* YouTube video embed */}
          {section.youtubeId && (
            <div className="rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-sm">
              <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
                <iframe
                  src={`${YT_BASE}${section.youtubeId}?rel=0&modestbranding=1`}
                  title="YouTube video"
                  className="absolute inset-0 w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
          )}

          {/* Audio player */}
          <div className="rounded-2xl bg-gradient-to-r from-primary-600 to-violet-600 p-5 text-white shadow-lg">
            <div className="flex items-center justify-between mb-3">
              <p className="text-[11px] font-bold uppercase tracking-widest opacity-80 flex items-center gap-1.5">
                <Headphones size={12} /> Listening Exercise
              </p>
              {section.difficulty && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${DIFFICULTY_LABEL[section.difficulty]?.color} text-white/90`}>
                  {DIFFICULTY_LABEL[section.difficulty]?.label}
                </span>
              )}
            </div>

            {/* Speaker badges + Speed */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex flex-wrap gap-1.5">
                {uniqueSpeakers.map((spk, i) => (
                  <span key={spk}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-white/20 ${activeSpeaker === spk ? 'ring-2 ring-white' : ''}`}>
                    <span className={`w-2 h-2 rounded-full ${SPEAKER_COLORS[i % SPEAKER_COLORS.length].dot}`} />
                    {spk}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-1">
                {SPEED_OPTIONS.map(s => (
                  <button key={s} onClick={() => setSpeed(s)}
                    className={`text-[10px] font-bold px-2 py-1 rounded-md transition-all ${speed === s ? 'bg-white/30 text-white' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
                    {s}×
                  </button>
                ))}
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {!playing ? (
                <button onClick={playSpeech}
                  className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95 backdrop-blur-sm">
                  <Play size={26} className="ml-1" />
                </button>
              ) : (
                <>
                  <button onClick={togglePause}
                    className="w-14 h-14 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center shadow-lg transition-all hover:scale-105 active:scale-95">
                    {paused ? <Play size={22} className="ml-1" /> : <Pause size={22} />}
                  </button>
                  <button onClick={stopSpeech}
                    className="w-10 h-10 rounded-full bg-white/15 hover:bg-white/25 flex items-center justify-center transition-all">
                    <Square size={16} />
                  </button>
                </>
              )}

              {/* Waveform */}
              {playing && !paused && (
                <div className="flex items-end gap-0.5 h-8">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className="w-1 rounded-full bg-white/80 animate-pulse"
                      style={{ height: `${14 + Math.abs(Math.sin(i * 0.9)) * 14 + 6}px`, animationDelay: `${i * 0.1}s`, animationDuration: `${0.6 + i * 0.08}s` }} />
                  ))}
                </div>
              )}

              <div className="ml-auto text-right text-xs opacity-80">
                {playCount > 0 && <p>Eshitildi: {playCount}×</p>}
                <p>{segments.length} qator</p>
              </div>
            </div>

            {playing && activeSpeaker && (
              <p className="mt-3 text-xs font-semibold opacity-80 flex items-center gap-1.5">
                <Volume2 size={12} /> {activeSpeaker} gapirishi...
              </p>
            )}
          </div>

          {/* Transcript toggle */}
          <button onClick={() => setShowTranscript(p => !p)}
            className={`w-full flex items-center justify-between px-4 py-3 rounded-2xl border text-sm font-semibold transition-all ${showTranscript ? 'border-primary-300 dark:border-primary-700 text-primary-700 dark:text-primary-300 bg-primary-50 dark:bg-primary-900/20' : 'border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400 hover:border-primary-200 dark:hover:border-primary-800'}`}>
            <span className="flex items-center gap-2">
              {showTranscript ? <EyeOff size={15} /> : <Eye size={15} />}
              {showTranscript ? 'Transkriptni Yashirish' : 'Transkriptni Ko\'rsatish'}
            </span>
            <span className="text-xs font-normal text-gray-400">(faqat tinglagandan keyin)</span>
          </button>

          {showTranscript && (
            <div className="card max-h-[400px] overflow-y-auto">
              <div className="flex items-center justify-between mb-3 sticky top-0 bg-white dark:bg-gray-900 py-2 z-10">
                <div className="flex items-center gap-2">
                  <Volume2 size={14} className="text-primary-500" />
                  <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Transkript</p>
                </div>
                <AudioButton text={segments.map(s => `${s.speaker}: ${s.text}`).join('. ')} size="sm" rate={0.85} label="Butun matnni tinglash" />
              </div>
              <div className="space-y-1">
                {segments.map((seg, i) => {
                  const colors = speakerColorMap[seg.speaker] ?? SPEAKER_COLORS[0]
                  const isActive = activeSegIdx === i
                  return (
                    <div key={i} id={`seg-${i}`}
                      className={`flex gap-2.5 rounded-xl p-2.5 transition-all cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 ${isActive ? `${colors.bg} ring-1 ${colors.border}` : ''}`}
                      onClick={() => playSegment(i)}>
                      <span className={`text-xs font-bold shrink-0 w-20 pt-0.5 ${colors.text}`}>{seg.speaker}:</span>
                      <p className={`text-sm text-gray-700 dark:text-gray-300 leading-relaxed ${isActive ? 'font-semibold' : ''}`}>{seg.text}</p>
                    </div>
                  )
                })}
              </div>
            </div>
          )}

          {/* Step navigation */}
          <div className="flex justify-between items-center pt-2">
            <p className="text-xs text-gray-400">
              {listenStep === 'first' ? '1/2 · Audio tinglang va tushuning' : '2/2 · Savollarga javob bering'}
            </p>
            <div className="flex gap-2">
              {listenStep === 'first' ? (
                <button onClick={() => setPhase('post')} className="btn-primary py-2 px-4 text-sm flex items-center gap-1.5">
                  Savollarga O'tish <ChevronRight size={14} />
                </button>
              ) : (
                <button onClick={() => setListenStep('first')} className="btn-ghost py-2 px-4 text-sm flex items-center gap-1.5">
                  <ChevronLeft size={14} /> Qayta Tinglash
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* ═══ QUESTIONS (Post-Listening) ═══ */}
      {phase === 'post' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Target size={16} className="text-primary-600" />
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Tushunish Savollari</h3>
            </div>
            <span className="text-xs text-gray-400 dark:text-gray-500">
              {Object.keys(answers).filter(k => answers[k] !== undefined && !(Array.isArray(answers[k]) && (answers[k] as Array<unknown>).length === 0)).length}/{section.questions.length + (section.dictation?.length || 0)} javob berildi
            </span>
          </div>

          {/* Progress bar */}
          <div className="flex gap-1">
            {section.questions.map(q => {
              const key = q.type === 'multiple-choice' ? `mc-${q.id}` : q.type === 'true-false' ? `tf-${q.id}` : q.type === 'multiple-answer' ? `ma-${q.id}` : q.type === 'fill-blank' ? `fb-${q.id}` : q.type === 'ordering' ? `ord-${q.id}` : q.type === 'matching' ? `mat-${q.id}` : ''
              const isAnswered = answers[key] !== undefined && !(Array.isArray(answers[key]) && (answers[key] as Array<unknown>).length === 0)
              return <div key={q.id} className={`h-1.5 flex-1 rounded-full transition-all ${isAnswered ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
            })}
            {section.dictation?.map((_, i) => (
              <div key={`dict-${i}`} className={`h-1.5 flex-1 rounded-full transition-all ${dictationInputs[i]?.trim() ? 'bg-primary-500' : 'bg-gray-200 dark:bg-gray-700'}`} />
            ))}
          </div>

          {/* Audio replay button */}
          <button onClick={playSpeech} className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 text-sm text-gray-500 dark:text-gray-400 hover:border-primary-300 hover:text-primary-600 transition-all">
            <RefreshCw size={14} /> Matnni qayta tinglash ({speed}×)
          </button>

          {/* Questions */}
          {!submitted ? (
            <div className="space-y-4">
              {section.questions.map((q, i) => renderQuestionCard(q, i))}

              {/* Dictation section */}
              {section.dictation && section.dictation.length > 0 && (
                <div className="card border-primary-200 dark:border-primary-800">
                  <div className="flex items-center gap-2 mb-3">
                    <Headphones size={16} className="text-primary-600" />
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Diktant</h3>
                    <span className="text-xs text-gray-400">Eshitganingizni yozing</span>
                  </div>
                  <div className="space-y-3">
                    {section.dictation.map((d, i) => {
                      const seg = segments[d.startLine]
                      return (
                        <div key={i} className="flex items-start gap-2">
                          <button onClick={() => playSegment(d.startLine)}
                            className="mt-1.5 p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-primary-600 shrink-0">
                            <Play size={14} />
                          </button>
                          <div className="flex-1">
                            <p className="text-[10px] text-gray-400 mb-1">{seg?.speaker || `Qator ${d.startLine + 1}`}</p>
                            <input
                              type="text"
                              value={dictationInputs[i] || ''}
                              onChange={e => handleDictation(i, e.target.value)}
                              placeholder="Eshitganingizni yozing..."
                              className="input text-sm py-2"
                              autoComplete="off"
                            />
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Discussion questions */}
              {section.discussion && section.discussion.length > 0 && (
                <div className="card bg-amber-50/50 dark:bg-amber-900/10 border-amber-200 dark:border-amber-800">
                  <div className="flex items-center gap-2 mb-3">
                    <AlertCircle size={16} className="text-amber-600" />
                    <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Mulohaza</h3>
                  </div>
                  {section.discussion.map((d, i) => (
                    <div key={i} className="mb-3 last:mb-0">
                      <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 mb-1">{d.question}</p>
                      {d.hints.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {d.hints.map((h, j) => (
                            <span key={j} className="text-[10px] bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 px-1.5 py-0.5 rounded">{h}</span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}

              <button onClick={handleSubmit}
                disabled={!allAnswered}
                className={`btn-primary w-full py-3 flex items-center justify-center gap-2 text-sm ${!allAnswered ? 'opacity-50 cursor-not-allowed' : ''}`}>
                <CheckCircle size={18} />
                Javoblarni Tekshirish
                {addXP && ` (+${((section.questions.length + (section.dictation?.length || 0)) * 10)} XP)`}
              </button>
            </div>
          ) : (
            /* ═══ RESULTS ═══ */
            <div className="space-y-4">
              <div className={`rounded-2xl border p-5 text-center ${pct === 100 ? 'bg-green-50 dark:bg-green-900/30 border-green-200 dark:border-green-800' : pct >= 60 ? 'bg-yellow-50 dark:bg-yellow-900/30 border-yellow-200 dark:border-yellow-800' : 'bg-red-50 dark:bg-red-900/30 border-red-200 dark:border-red-800'}`}>
                <p className={`text-4xl font-bold font-mono mb-1 ${pct === 100 ? 'text-green-600 dark:text-green-400' : pct >= 60 ? 'text-yellow-600 dark:text-yellow-400' : 'text-red-500 dark:text-red-400'}`}>
                  {score}<span className="text-xl text-gray-400 dark:text-gray-500">/{total}</span>
                </p>
                <div className="h-2 bg-gray-200 dark:bg-gray-700 rounded-full max-w-xs mx-auto mb-3">
                  <div className={`h-2 rounded-full transition-all ${pct === 100 ? 'bg-green-500' : pct >= 60 ? 'bg-yellow-500' : 'bg-red-500'}`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {pct === 100 ? '🎧 Zo\'r! Ajoyib tinglash qobiliyati!' :
                   pct >= 80 ? '👍 Yaxshi! Kichik kamchiliklarni tuzating.' :
                   pct >= 60 ? '📚 Qoniqarli. Yana bir bor tinglab ko\'ring.' :
                   '💪 Diqqat bilan qayta tinglang va qayta urinib ko\'ring.'}
                </p>
                {addXP && (
                  <div className="inline-flex items-center gap-1.5 text-sm font-bold text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-900/30 rounded-xl px-3 py-1.5 mb-3">
                    <Trophy size={14} /> +{score * 10} XP
                  </div>
                )}
                <div className="flex gap-2 justify-center">
                  <button onClick={handleRetry} className="btn-secondary text-sm py-2 px-5 inline-flex items-center gap-2">
                    <RotateCcw size={14} /> Qayta Urinish
                  </button>
                  <button onClick={() => { handleRetry(); setPhase('listen'); }} className="btn-secondary text-sm py-2 px-5 inline-flex items-center gap-2">
                    <SkipForward size={14} /> Qayta Tinglash
                  </button>
                </div>
              </div>

              {/* Answer review */}
              <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Javoblar Tahlili</p>
              {section.questions.map((q, i) => renderQuestionCard(q, i))}

              {/* Dictation review */}
              {section.dictation && dictationInputs.some(d => d.trim()) && (
                <div className="card">
                  <div className="flex items-center gap-2 mb-3">
                    <Headphones size={14} className="text-primary-600" />
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Diktant Natijalari</p>
                  </div>
                  <div className="space-y-2">
                    {section.dictation.map((d, i) => {
                      const seg = segments[d.startLine]
                      if (!dictationInputs[i]?.trim()) return null
                      const isCorrect = dictationInputs[i]?.toLowerCase().trim() === seg?.text.toLowerCase().trim()
                      return (
                        <div key={i} className={`flex items-start gap-2 p-2 rounded-xl ${isCorrect ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
                          {isCorrect ? <CheckCircle size={16} className="text-green-500 mt-0.5 shrink-0" /> : <XCircle size={16} className="text-red-500 mt-0.5 shrink-0" />}
                          <div className="flex-1">
                            <div className={`text-sm ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300 line-through'}`}>{dictationInputs[i]}</div>
                            {!isCorrect && <div className="text-sm text-green-700 dark:text-green-400 font-semibold">{seg?.text}</div>}
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Navigation */}
          <div className="flex justify-between pt-2">
            <button onClick={() => setPhase('listen')} className="btn-ghost py-2 px-4 text-sm flex items-center gap-1.5">
              <ChevronLeft size={14} /> Tinglashga Qaytish
            </button>
            {submitted && pct >= 60 && (
              <button onClick={() => setPhase('result')} className="btn-primary py-2 px-4 text-sm flex items-center gap-1.5">
                Keyingi Bosqich <ChevronRight size={14} />
              </button>
            )}
          </div>
        </div>
      )}

      {/* ═══ RESULT SUMMARY ═══ */}
      {phase === 'result' && (
        <div className="card text-center py-8">
          <div className="text-5xl mb-4">{pct === 100 ? '🏆' : pct >= 60 ? '👍' : '💪'}</div>
          <h3 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-2">Listening Complete!</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
            {pct >= 80 ? "Ajoyib natija! Ingliz tili listening qobiliyatingiz o'sib bormoqda." : "Yaxshi urinish! Qayta tinglash orqali natijangizni yaxshilang."}
          </p>
          <div className="flex items-center justify-center gap-2 mb-6">
            <div className={`text-3xl font-bold font-mono ${pct === 100 ? 'text-green-600' : pct >= 60 ? 'text-yellow-600' : 'text-red-500'}`}>
              {score}/{total}
            </div>
            <div className="h-8 w-px bg-gray-200" />
            <div className="text-sm text-gray-400">
              <p>{Math.round(pct)}% to'g'ri</p>
              <p>Eshitildi: {playCount}×</p>
            </div>
          </div>
          <button onClick={() => { handleRetry(); setPhase('pre'); setListenStep('first'); setPlayCount(0) }}
            className="btn-secondary text-sm py-2 px-5 inline-flex items-center gap-2">
            <RotateCcw size={14} /> Boshidan Boshlash
          </button>
        </div>
      )}
    </div>
  )
}
