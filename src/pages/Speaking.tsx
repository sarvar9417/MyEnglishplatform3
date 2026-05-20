import { useState, useRef, useEffect } from 'react'
import { Mic, MicOff, RotateCcw, ChevronLeft, Loader2, Volume2 } from 'lucide-react'
import { CATEGORY_LABEL, CATEGORY_COLOR } from '@/data/speakingPrompts'
import { fetchSpeakingPrompts, getDailyPrompts, saveSpeakingResult } from '@/services/speakingService'
import type { SpeakingPrompt } from '@/services/speakingService'
import { evaluateSpeech } from '@/lib/claude'
import { useStore } from '@/store/useStore'
import { supabase } from '@/db/supabase'

// ── Web Speech API types ───────────────────────────────────────────────────────

interface SrAlternative { readonly transcript: string }
interface SrResult      { readonly isFinal: boolean; readonly length: number; readonly [i: number]: SrAlternative }
interface SrResultList  { readonly length: number; readonly [i: number]: SrResult }
interface SrEvent extends Event { readonly results: SrResultList; readonly resultIndex: number }
type SrCtor = new () => {
  lang: string; continuous: boolean; interimResults: boolean
  start(): void; stop(): void; abort(): void
  onresult: ((e: SrEvent) => void) | null
  onend:    (() => void) | null
  onerror:  ((e: Event) => void) | null
}
declare global {
  interface Window { SpeechRecognition?: SrCtor; webkitSpeechRecognition?: SrCtor }
}

// ── Types ─────────────────────────────────────────────────────────────────────

type View        = 'select' | 'record' | 'result'
type RecordState = 'idle' | 'recording' | 'evaluating' | 'done'

interface Scores { fluency: number; grammar: number; vocabulary: number }

function parseScores(text: string): Scores {
  const get = (key: string) =>
    Math.min(10, Math.max(0, parseInt(text.match(new RegExp(`${key}:\\s*(\\d+)`))?.[1] ?? '0')))
  return { fluency: get('FLUENCY'), grammar: get('GRAMMAR'), vocabulary: get('VOCABULARY') }
}

function parseFeedback(text: string): string {
  return text.split('FEEDBACK:')[1]?.trim() ?? ''
}

function ScoreCard({ label, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="card text-center">
      <div className={`text-2xl font-bold ${color}`}>{score}<span className="text-base font-normal text-gray-400">/10</span></div>
      <p className="text-xs text-gray-500 mt-0.5">{label}</p>
      <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color.replace('text-', 'bg-')}`}
          style={{ width: `${score * 10}%` }} />
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Speaking() {
  const { addXP, updateSkillProgress, currentDay } = useStore()

  const [view,        setView]        = useState<View>('select')
  const [prompt,      setPrompt]      = useState<SpeakingPrompt | null>(null)
  const [recordState, setRecordState] = useState<RecordState>('idle')
  const [transcript,  setTranscript]  = useState('')
  const [interim,     setInterim]     = useState('')
  const [evaluation,  setEvaluation]  = useState('')
  const [scores,      setScores]      = useState<Scores>({ fluency: 0, grammar: 0, vocabulary: 0 })
  const [feedback,    setFeedback]    = useState('')
  const [timer,       setTimer]       = useState(0)
  const [srSupported, setSrSupported] = useState(true)
  const [prompts,     setPrompts]     = useState<SpeakingPrompt[]>([])
  const [promptsLoading, setPromptsLoading] = useState(true)

  const recognitionRef = useRef<InstanceType<SrCtor> | null>(null)
  const timerRef       = useRef<ReturnType<typeof setInterval> | null>(null)

  // Check Web Speech API support
  useEffect(() => {
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition
    if (!Ctor) setSrSupported(false)
  }, [])

  // Fetch prompts from Supabase
  useEffect(() => {
    fetchSpeakingPrompts().then((data) => {
      setPrompts(data)
      setPromptsLoading(false)
    })
  }, [])

  // Cleanup on unmount
  useEffect(() => () => {
    recognitionRef.current?.abort()
    if (timerRef.current) clearInterval(timerRef.current)
  }, [])

  const dailyPrompts = prompts.length > 0 ? getDailyPrompts(currentDay, prompts) : []

  // ── Recording ──────────────────────────────────────────────────────────────

  function startRecording() {
    const Ctor = window.SpeechRecognition ?? window.webkitSpeechRecognition
    if (!Ctor) return

    const rec = new Ctor()
    rec.lang           = 'en-US'
    rec.continuous     = true
    rec.interimResults = true

    rec.onresult = (e: SrEvent) => {
      let final = ''
      let inter = ''
      for (let i = 0; i < e.results.length; i++) {
        const r = e.results[i]
        if (r.isFinal) final += r[0].transcript + ' '
        else            inter  = r[0].transcript
      }
      setTranscript(final)
      setInterim(inter)
    }

    rec.onend = () => {
      setInterim('')
      if (recordState === 'recording') {
        setRecordState('done')
        if (timerRef.current) clearInterval(timerRef.current)
      }
    }

    rec.onerror = () => {
      setRecordState('done')
      if (timerRef.current) clearInterval(timerRef.current)
    }

    recognitionRef.current = rec
    rec.start()
    setRecordState('recording')
    setTimer(0)
    timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000)
  }

  function stopRecording() {
    recognitionRef.current?.stop()
    if (timerRef.current) clearInterval(timerRef.current)
    setRecordState('done')
    setInterim('')
  }

  function resetRecording() {
    recognitionRef.current?.abort()
    if (timerRef.current) clearInterval(timerRef.current)
    setTranscript('')
    setInterim('')
    setTimer(0)
    setRecordState('idle')
  }

  async function evaluate() {
    if (!prompt || !transcript.trim()) return
    setRecordState('evaluating')
    setEvaluation('')
    let full = ''

    evaluateSpeech(
      prompt.prompt,
      transcript,
      'B1',
      (token) => { full += token; setEvaluation(full) },
      (text) => {
        const s = parseScores(text)
        const f = parseFeedback(text)
        setScores(s)
        setFeedback(f)
        const avg = Math.round((s.fluency + s.grammar + s.vocabulary) / 3)
        addXP(avg * 3)
        updateSkillProgress('todaySpeakingPct', avg * 10)
        // Save to Supabase
        supabase.auth.getSession().then(({ data: { session } }) => {
          if (session?.user.id && prompt) {
            saveSpeakingResult({
              userId:          session.user.id,
              promptId:        prompt.id,
              promptText:      prompt.prompt,
              fluencyScore:    s.fluency,
              grammarScore:    s.grammar,
              vocabularyScore: s.vocabulary,
              avgScore:        avg,
              xpEarned:        avg * 3,
              feedback:        f,
            })
          }
        })
        setRecordState('done')
        setView('result')
      },
      () => setRecordState('done'),
    )
  }

  // ── SELECT view ───────────────────────────────────────────────────────────

  if (view === 'select') {
    return (
      <div className="p-3 sm:p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          <div className="w-10 h-10 bg-b2-100 rounded-xl flex items-center justify-center">
            <Mic size={20} className="text-b2-600" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">Speaking</h1>
            <p className="text-xs text-gray-500">Kundalik 3 ta savol · Web Speech API · Claude baholaydi</p>
          </div>
        </div>

        {!srSupported && (
          <div className="card bg-red-50 border-red-100 mb-4">
            <p className="text-sm text-red-700 font-medium">
              ⚠️ Brauzeringiz Web Speech API-ni qo'llab-quvvatlamaydi.
              Chrome yoki Edge ishlatishingizni tavsiya qilamiz.
            </p>
          </div>
        )}

        {/* Daily prompts */}
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
          Bugungi savollar ({currentDay}-kun)
        </p>
        <div className="space-y-3 mb-6">
          {dailyPrompts.map((p) => (
            <button
              key={p.id}
              onClick={() => { setPrompt(p); resetRecording(); setView('record') }}
              className="w-full card text-left hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={`badge text-[10px] ${CATEGORY_COLOR[p.category]}`}>
                      {CATEGORY_LABEL[p.category]}
                    </span>
                    <span className="text-xs text-gray-400">{Math.floor(p.timeSeconds / 60)}:{String(p.timeSeconds % 60).padStart(2, '0')} daqiqa</span>
                  </div>
                  <p className="text-sm text-gray-800 leading-snug">{p.prompt}</p>
                  <div className="flex gap-1 mt-2">
                    {p.tips.slice(0, 2).map((tip, i) => (
                      <span key={i} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                        {tip}
                      </span>
                    ))}
                  </div>
                </div>
                <Mic size={16} className="text-b2-400 flex-shrink-0 mt-1" />
              </div>
            </button>
          ))}
        </div>

        {/* All prompts */}
        <details className="card">
          <summary className="cursor-pointer text-sm font-semibold text-gray-700 select-none">
            Barcha savollar ({prompts.length} ta)
          </summary>
          {promptsLoading ? (
            <div className="text-gray-400 animate-pulse text-center py-4">Savollar yuklanmoqda...</div>
          ) : (
            <div className="space-y-0.5 mt-2">
              {prompts.map((p) => (
                <button
                  key={p.id}
                  onClick={() => { setPrompt(p); resetRecording(); setView('record') }}
                  className="w-full text-left text-sm text-gray-600 hover:text-gray-900 py-1.5 border-b border-gray-50 last:border-0 flex items-center gap-2"
                >
                  <span className={`badge text-[10px] flex-shrink-0 ${CATEGORY_COLOR[p.category]}`}>
                    {CATEGORY_LABEL[p.category]}
                  </span>
                  <span className="line-clamp-1">{p.prompt}</span>
                </button>
              ))}
            </div>
          )}
        </details>
      </div>
    )
  }

  // ── RESULT view ───────────────────────────────────────────────────────────

  if (view === 'result') {
    const avg = Math.round((scores.fluency + scores.grammar + scores.vocabulary) / 3)

    return (
      <div className="p-3 sm:p-6 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => setView('select')} className="btn-ghost p-2 rounded-xl">
            <ChevronLeft size={18} />
          </button>
          <h2 className="font-bold text-gray-900">Baholash natijalari</h2>
        </div>

        {/* Overall */}
        <div className="card bg-gradient-to-r from-b2-50 to-primary-50 border-b2-100 text-center mb-4">
          <p className="text-xs text-gray-500 mb-1">Umumiy ball</p>
          <p className="text-4xl font-bold text-b2-600">{avg}<span className="text-xl font-normal text-gray-400">/10</span></p>
          <p className="text-xs text-gray-500 mt-1">+{avg * 3} XP qazonlandi</p>
        </div>

        {/* Score cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
          <ScoreCard label="Fluency"    score={scores.fluency}    color="text-orange-600" />
          <ScoreCard label="Grammar"    score={scores.grammar}    color="text-green-600"  />
          <ScoreCard label="Vocabulary" score={scores.vocabulary} color="text-b2-600"     />
        </div>

        {/* Feedback */}
        {feedback && (
          <div className="card bg-primary-50 border-primary-100 mb-4">
            <p className="text-xs font-semibold text-primary-700 mb-1">💡 Feedback</p>
            <p className="text-sm text-gray-700 leading-relaxed">{feedback}</p>
          </div>
        )}

        {/* Transcript */}
        <div className="card mb-4">
          <p className="text-xs font-semibold text-gray-500 mb-1">Sizning javobingiz</p>
          <p className="text-sm text-gray-700 italic leading-relaxed">"{transcript}"</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => { resetRecording(); setEvaluation(''); setView('record') }}
            className="btn-secondary flex-1 text-sm flex items-center justify-center gap-1"
          >
            <RotateCcw size={14} /> Qayta yozish
          </button>
          <button
            onClick={() => setView('select')}
            className="btn-primary flex-1 text-sm"
          >
            Boshqa savol
          </button>
        </div>
      </div>
    )
  }

  // ── RECORD view ───────────────────────────────────────────────────────────

  if (!prompt) return null

  const isRecording  = recordState === 'recording'
  const isDone       = recordState === 'done'
  const isEvaluating = recordState === 'evaluating'
  const mins         = Math.floor(timer / 60)
  const secs         = timer % 60

  return (
    <div className="p-3 sm:p-6 max-w-lg mx-auto">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => { resetRecording(); setView('select') }}
          className="btn-ghost p-2 rounded-xl"
        >
          <ChevronLeft size={18} />
        </button>
        <div>
          <span className={`badge text-[10px] ${CATEGORY_COLOR[prompt.category]}`}>
            {CATEGORY_LABEL[prompt.category]}
          </span>
        </div>
      </div>

      {/* Prompt */}
      <div className="card bg-b2-50 border-b2-100 mb-5">
        <div className="flex items-start gap-2">
          <Volume2 size={16} className="text-b2-500 flex-shrink-0 mt-0.5" />
          <p className="text-sm text-gray-800 leading-relaxed font-medium">{prompt.prompt}</p>
        </div>
      </div>

      {/* Tips */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 mb-1.5">Maslahatlar:</p>
        <ul className="space-y-1">
          {prompt.tips.map((tip, i) => (
            <li key={i} className="text-xs text-gray-500 flex items-start gap-1.5">
              <span className="text-b2-400 flex-shrink-0">•</span>{tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Mic button */}
      <div className="flex flex-col items-center gap-4 mb-5">
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!srSupported || isEvaluating}
          className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-200
            shadow-lg active:scale-95
            ${isRecording
              ? 'bg-red-500 hover:bg-red-600 animate-pulse'
              : 'bg-b2-600 hover:bg-b2-700'
            }
            disabled:opacity-40 disabled:cursor-not-allowed`}
        >
          {isRecording
            ? <MicOff size={36} className="text-white" />
            : <Mic    size={36} className="text-white" />
          }
        </button>

        <div className="text-center">
          {isRecording && (
            <p className="text-sm font-mono text-red-500 font-semibold">
              ● {mins}:{String(secs).padStart(2, '0')} yozilmoqda...
            </p>
          )}
          {!isRecording && !isDone && (
            <p className="text-sm text-gray-400">Mikrofon tugmasini bosing va gapiring</p>
          )}
          {isDone && (
            <p className="text-sm text-green-600 font-medium">✓ Yozib olindi — {Math.floor(timer / 60)}:{String(timer % 60).padStart(2, '0')}</p>
          )}
        </div>
      </div>

      {/* Transcript display */}
      {(transcript || interim) && (
        <div className="card mb-4 min-h-[60px]">
          <p className="text-xs font-semibold text-gray-400 mb-1">Transcript:</p>
          <p className="text-sm text-gray-800 leading-relaxed">
            {transcript}
            {interim && <span className="text-gray-400">{interim}</span>}
          </p>
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {(isDone || isRecording) && (
          <button
            onClick={resetRecording}
            className="btn-secondary flex-1 text-sm flex items-center justify-center gap-1"
          >
            <RotateCcw size={14} /> Qayta
          </button>
        )}
        {isDone && transcript.trim() && (
          <button
            onClick={evaluate}
            disabled={isEvaluating}
            className="btn-primary flex-1 text-sm flex items-center justify-center gap-1.5"
          >
            {isEvaluating
              ? <><Loader2 size={14} className="animate-spin" /> Baholanmoqda...</>
              : '✨ Claude baholaydi'
            }
          </button>
        )}
      </div>

      {/* Evaluation streaming */}
      {isEvaluating && evaluation && (
        <div className="mt-4 card bg-primary-50 border-primary-100">
          <p className="text-xs font-semibold text-primary-700 mb-1">Baholanmoqda...</p>
          <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
            {evaluation}
            <span className="inline-block w-1 h-3 bg-primary-400 ml-0.5 animate-pulse align-middle" />
          </pre>
        </div>
      )}
    </div>
  )
}
