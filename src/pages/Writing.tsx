import { useState, useEffect } from 'react'
import { PenLine, Clock, ChevronDown, ChevronUp, Loader2 } from 'lucide-react'
import { TYPE_LABEL, TYPE_COLOR } from '@/data/writingPrompts'
import { fetchWritingPrompts, getDailyWritingPrompt } from '@/services/writingService'
import type { WritingPrompt } from '@/services/writingService'
import { evaluateWriting } from '@/lib/claude'
import { useStore } from '@/store/useStore'

// ── Types ─────────────────────────────────────────────────────────────────────

type View = 'write' | 'result'

interface WritingScores {
  taskAchievement: number
  coherence:       number
  vocabulary:      number
  grammar:         number
}

function parseScores(text: string): WritingScores {
  const get = (key: string) =>
    Math.min(10, Math.max(0, parseInt(text.match(new RegExp(`${key}:\\s*(\\d+)`))?.[1] ?? '0')))
  return {
    taskAchievement: get('TASK_ACHIEVEMENT'),
    coherence:       get('COHERENCE'),
    vocabulary:      get('VOCABULARY'),
    grammar:         get('GRAMMAR'),
  }
}

function parseFeedback(text: string): string {
  return (text.split(/FEEDBACK:/)[1] ?? '').split(/IMPROVED:/)[0].trim()
}

function parseImproved(text: string): string {
  return (text.split(/IMPROVED:/)[1] ?? '').trim()
}

function wordCount(text: string): number {
  return text.trim().split(/\s+/).filter(Boolean).length
}

// ── Score card ────────────────────────────────────────────────────────────────

function ScoreCard({ label: lbl, score, color }: { label: string; score: number; color: string }) {
  return (
    <div className="card text-center py-4">
      <p className={`text-2xl font-bold ${color}`}>
        {score}<span className="text-sm font-normal text-gray-400">/10</span>
      </p>
      <p className="text-xs text-gray-500 mt-0.5">{lbl}</p>
      <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-700 ${color.replace('text-', 'bg-')}`}
          style={{ width: `${score * 10}%` }}
        />
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Writing() {
  const { addXP, updateSkillProgress, currentDay } = useStore()

  const [prompts,       setPrompts]       = useState<WritingPrompt[]>([])
  const [promptsLoaded, setPromptsLoaded] = useState(false)

  useEffect(() => {
    fetchWritingPrompts().then((data) => {
      setPrompts(data)
      setPromptsLoaded(true)
    })
  }, [])

  const prompt = promptsLoaded ? getDailyWritingPrompt(currentDay, prompts) : null

  const [view,         setView]         = useState<View>('write')
  const [essay,        setEssay]        = useState('')
  const [timer,        setTimer]        = useState(0)
  const [timerActive,  setTimerActive]  = useState(false)
  const [evaluating,   setEvaluating]   = useState(false)
  const [streamText,   setStreamText]   = useState('')
  const [scores,       setScores]       = useState<WritingScores | null>(null)
  const [feedback,     setFeedback]     = useState('')
  const [improved,     setImproved]     = useState('')
  const [showImproved, setShowImproved] = useState(false)

  const wc      = wordCount(essay)
  const minWords = 150
  const canSubmit = wc >= minWords && !evaluating

  // Timer counts up while writing
  useEffect(() => {
    if (!timerActive) return
    const id = setInterval(() => setTimer((t) => t + 1), 1000)
    return () => clearInterval(id)
  }, [timerActive])

  // Auto-start timer on first keystroke
  useEffect(() => {
    if (essay.length > 0 && !timerActive && view === 'write') {
      setTimerActive(true)
    }
  }, [essay, timerActive, view])

  function formatTimer(s: number) {
    return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`
  }

  async function handleSubmit() {
    if (!canSubmit || !prompt) return
    setEvaluating(true)
    setTimerActive(false)
    setStreamText('')
    let full = ''

    evaluateWriting(
      prompt.prompt,
      essay,
      'B1',
      (token) => { full += token; setStreamText(full) },
      (text)  => {
        const s = parseScores(text)
        const f = parseFeedback(text)
        const imp = parseImproved(text)
        setScores(s)
        setFeedback(f)
        setImproved(imp)
        const avg = Math.round((s.taskAchievement + s.coherence + s.vocabulary + s.grammar) / 4)
        addXP(avg * 4)
        updateSkillProgress('todayWritingPct', avg * 10)
        setEvaluating(false)
        setView('result')
      },
      () => setEvaluating(false),
    )
  }

  // ── RESULT view ─────────────────────────────────────────────────────────

  if (view === 'result' && scores) {
    const avg = Math.round((scores.taskAchievement + scores.coherence + scores.vocabulary + scores.grammar) / 4)

    return (
      <div className="p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 bg-b2-100 rounded-xl flex items-center justify-center">
            <PenLine size={20} className="text-b2-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Writing natijasi</h1>
            <p className="text-xs text-gray-500">{wc} so'z · {formatTimer(timer)}</p>
          </div>
        </div>

        {/* Overall */}
        <div className="card bg-gradient-to-r from-b2-50 to-primary-50 border-b2-100 text-center mb-4">
          <p className="text-xs text-gray-500 mb-1">Umumiy ball</p>
          <p className="text-4xl font-bold text-b2-600">
            {avg}<span className="text-xl font-normal text-gray-400">/10</span>
          </p>
          <p className="text-xs text-gray-500 mt-1">+{avg * 4} XP qazonlandi</p>
        </div>

        {/* Score grid */}
        <div className="grid grid-cols-2 gap-2 mb-4">
          <ScoreCard label="Task Achievement" score={scores.taskAchievement} color="text-primary-600" />
          <ScoreCard label="Coherence"         score={scores.coherence}       color="text-b1-600"     />
          <ScoreCard label="Vocabulary"        score={scores.vocabulary}      color="text-orange-600" />
          <ScoreCard label="Grammar"           score={scores.grammar}         color="text-b2-600"     />
        </div>

        {/* Feedback */}
        {feedback && (
          <div className="card bg-primary-50 border-primary-100 mb-4">
            <p className="text-xs font-semibold text-primary-700 mb-1">💡 Feedback</p>
            <p className="text-sm text-gray-700 leading-relaxed">{feedback}</p>
          </div>
        )}

        {/* Original essay */}
        <div className="card mb-4">
          <p className="text-xs font-semibold text-gray-500 mb-2">Sizning esseyingiz</p>
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{essay}</p>
        </div>

        {/* Improved version */}
        {improved && (
          <div className="card mb-4 border-green-100">
            <button
              onClick={() => setShowImproved((v) => !v)}
              className="w-full flex items-center justify-between"
            >
              <p className="text-sm font-semibold text-green-700">✨ Yaxshilangan versiya</p>
              {showImproved ? <ChevronUp size={16} className="text-gray-400" /> : <ChevronDown size={16} className="text-gray-400" />}
            </button>
            {showImproved && (
              <div className="mt-3 pt-3 border-t border-green-100">
                <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{improved}</p>
              </div>
            )}
          </div>
        )}

        <div className="flex gap-2">
          <button
            onClick={() => { setEssay(''); setTimer(0); setTimerActive(false); setStreamText(''); setView('write') }}
            className="btn-secondary flex-1 text-sm"
          >
            Qayta yozish
          </button>
          <button
            onClick={() => { window.history.back() }}
            className="btn-primary flex-1 text-sm"
          >
            Tugatish
          </button>
        </div>
      </div>
    )
  }

  // ── WRITE view ───────────────────────────────────────────────────────────

  if (!promptsLoaded || !prompt) {
    return (
      <div className="p-4 max-w-2xl mx-auto flex items-center justify-center min-h-[300px]">
        <div className="text-gray-400 animate-pulse">Vazifa yuklanmoqda...</div>
      </div>
    )
  }

  return (
    <div className="p-4 max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-b2-100 rounded-xl flex items-center justify-center">
            <PenLine size={20} className="text-b2-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Writing</h1>
            <p className="text-xs text-gray-500">Bugungi vazifa · {currentDay}-kun</p>
          </div>
        </div>
        {timerActive && (
          <span className="flex items-center gap-1 text-sm font-mono font-semibold text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
            <Clock size={13} /> {formatTimer(timer)}
          </span>
        )}
      </div>

      {/* Prompt */}
      <div className="card mb-4">
        <div className="flex items-center gap-2 mb-2">
          <span className={`badge text-[10px] ${TYPE_COLOR[prompt.type]}`}>
            {TYPE_LABEL[prompt.type]}
          </span>
          <span className="text-xs text-gray-400">~{prompt.wordLimit} so'z · {prompt.timeMinutes} daqiqa</span>
        </div>
        <p className="text-sm text-gray-800 leading-relaxed font-medium">{prompt.prompt}</p>
      </div>

      {/* Tips */}
      <div className="card bg-b2-50 border-b2-100 mb-4">
        <p className="text-xs font-semibold text-b2-700 mb-1.5">📝 Yozish bo'yicha maslahatlar:</p>
        <ul className="space-y-1">
          {prompt.tips.map((tip, i) => (
            <li key={i} className="text-xs text-b2-800 flex items-start gap-1.5">
              <span className="text-b2-400 flex-shrink-0">{i + 1}.</span>{tip}
            </li>
          ))}
        </ul>
      </div>

      {/* Editor */}
      <div className="card mb-3">
        <textarea
          className="w-full min-h-[240px] text-sm text-gray-800 leading-relaxed resize-none outline-none placeholder-gray-300"
          placeholder="Bu yerda yozing..."
          value={essay}
          onChange={(e) => setEssay(e.target.value)}
          disabled={evaluating}
        />
        <div className="flex items-center justify-between pt-2 border-t border-gray-100 mt-2">
          <span className={`text-xs font-semibold ${wc >= prompt.wordLimit ? 'text-green-600' : wc >= minWords ? 'text-orange-500' : 'text-gray-400'}`}>
            {wc} / {prompt.wordLimit} so'z
          </span>
          <div className="w-32 h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-300 ${wc >= prompt.wordLimit ? 'bg-green-500' : 'bg-b2-400'}`}
              style={{ width: `${Math.min(100, (wc / prompt.wordLimit) * 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Minimum words hint */}
      {wc < minWords && essay.length > 0 && (
        <p className="text-xs text-orange-500 mb-3 text-center">
          Yuborish uchun kamida {minWords} ta so'z yozing ({minWords - wc} ta qoldi)
        </p>
      )}

      {/* Evaluating stream */}
      {evaluating && streamText && (
        <div className="card bg-primary-50 border-primary-100 mb-3">
          <p className="text-xs font-semibold text-primary-700 mb-1 flex items-center gap-1">
            <Loader2 size={12} className="animate-spin" /> Baholanmoqda...
          </p>
          <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
            {streamText}
            <span className="inline-block w-1 h-3 bg-primary-400 ml-0.5 animate-pulse align-middle" />
          </pre>
        </div>
      )}

      {/* Submit */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className="w-full btn-primary text-sm flex items-center justify-center gap-2"
      >
        {evaluating
          ? <><Loader2 size={14} className="animate-spin" /> Claude baholamoqda...</>
          : '✨ Claude baholaydi'
        }
      </button>
    </div>
  )
}
