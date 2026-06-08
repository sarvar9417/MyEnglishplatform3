// Speaking Path — Qadam 4: AI suhbat (rol o'yini)
// Reja: docs/speaking-path-roadmap.md (6-bo'lim)
// Kunning stsenariysi bilan Claude bilan jonli suhbat → yakunda fikr.

import { useState, useEffect, useRef, useCallback } from 'react'
import { Send, Loader2, Sparkles, ArrowRight, Bot } from 'lucide-react'
import { startSpeakingChat, getSpeakingChatFeedback } from '../../../lib/claude'
import { monitoring } from '../../../lib/monitoring'
import MicButton from '../MicButton'
import type { SpeakingDay } from '../../../data/speakingPath/types'

interface Props {
  day: SpeakingDay
  level: string
  onNext: () => void
}

type Msg = { role: 'user' | 'assistant'; content: string }

const MIN_USER_TURNS = 3

export default function ConverseStep({ day, level, onNext }: Props) {
  const topic = `${day.scenario.topic}. You play ${day.scenario.aiRole}; I play ${day.scenario.userRole}.`

  const [history, setHistory] = useState<Msg[]>([])
  const [streaming, setStreaming] = useState('')
  const [busy, setBusy] = useState(false)
  const [userTurns, setUserTurns] = useState(0)
  const [typed, setTyped] = useState('')
  const [feedback, setFeedback] = useState<string | null>(null)
  const [finishing, setFinishing] = useState(false)
  const startedRef = useRef(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const runAi = useCallback((hist: Msg[]) => {
    setBusy(true)
    setStreaming('')
    let acc = ''
    startSpeakingChat(
      topic, level, hist,
      (token) => { acc += token; setStreaming(acc) },
      (full) => {
        setHistory(prev => [...prev, { role: 'assistant', content: full || acc }])
        setStreaming('')
        setBusy(false)
      },
      (err) => {
        monitoring.captureException(err, { context: 'ConverseStep.startSpeakingChat' })
        setStreaming('')
        setBusy(false)
        setHistory(prev => [...prev, { role: 'assistant', content: "(Aloqa uzildi — yana urinib ko'ring)" }])
      },
    )
  }, [topic, level])

  // ochilishda AI suhbatni boshlaydi
  useEffect(() => {
    if (startedRef.current) return
    startedRef.current = true
    runAi([])
  }, [runAi])

  // pastga skroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [history, streaming])

  const sendUser = useCallback((text: string) => {
    if (busy || !text.trim()) return
    const next = [...history, { role: 'user' as const, content: text.trim() }]
    setHistory(next)
    setUserTurns(t => t + 1)
    setTyped('')
    runAi(next)
  }, [busy, history, runAi])

  const finish = useCallback(async () => {
    setFinishing(true)
    try {
      const fb = await getSpeakingChatFeedback(level, history)
      setFeedback(fb || "Ajoyib mashq! Har bir suhbat sizni kuchaytiradi.")
    } catch (err) {
      monitoring.captureException(err instanceof Error ? err : new Error(String(err)), { context: 'ConverseStep.feedback' })
      setFeedback("Ajoyib mashq! Har bir suhbat sizni kuchaytiradi.")
    }
  }, [level, history])

  // ── Yakuniy fikr ekrani ──
  if (feedback) {
    return (
      <div className="rounded-2xl p-6 bg-gradient-to-br from-primary-50 to-emerald-50 dark:from-primary-900/20 dark:to-emerald-900/20 border border-primary-200 dark:border-primary-800/50 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500 flex items-center justify-center">
          <Sparkles size={28} className="text-white" />
        </div>
        <p className="mt-3 font-black text-gray-900 dark:text-gray-100">Suhbat tugadi! 🎉</p>
        <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 whitespace-pre-line text-left">{feedback}</p>
        <button onClick={onNext} className="mt-4 w-full py-3 rounded-2xl bg-primary-600 text-white font-bold text-sm hover:bg-primary-700 active:scale-[0.98] transition-all">
          Kunni yakunlash
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      <div className="text-center">
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">🤖 AI bilan suhbat</p>
        <p className="text-xs text-primary-600 dark:text-primary-400 mt-0.5">🎯 {day.scenario.goalUz}</p>
      </div>

      {/* Suhbat */}
      <div ref={scrollRef} className="min-h-[50vh] lg:h-72 overflow-y-auto space-y-2 p-3 rounded-2xl bg-gray-50 dark:bg-gray-800/60 border border-gray-100 dark:border-gray-700">
        {history.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-3 py-2 rounded-2xl text-sm ${m.role === 'user'
              ? 'bg-primary-600 text-white rounded-br-sm'
              : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 rounded-bl-sm'}`}>
              {m.content}
            </div>
          </div>
        ))}
        {streaming && (
          <div className="flex justify-start">
            <div className="max-w-[80%] px-3 py-2 rounded-2xl rounded-bl-sm text-sm bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100">{streaming}</div>
          </div>
        )}
        {busy && !streaming && (
          <div className="flex items-center gap-1.5 text-gray-400 text-xs"><Bot size={14} /> <Loader2 size={12} className="animate-spin" /> yozmoqda…</div>
        )}
      </div>

      {/* Kirish */}
      <div className="space-y-2">
        <MicButton onResult={sendUser} disabled={busy} label="Javob bering" />
        <div className="flex items-center gap-2">
          <input
            value={typed}
            onChange={e => setTyped(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') sendUser(typed) }}
            disabled={busy}
            placeholder="…yoki javobni yozing"
            className="flex-1 px-3 py-2.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-400 disabled:opacity-50"
          />
          <button onClick={() => sendUser(typed)} disabled={busy || !typed.trim()} className="p-2.5 rounded-xl bg-primary-600 text-white disabled:opacity-40" aria-label="Yuborish">
            <Send size={18} />
          </button>
        </div>
      </div>

      {/* Yakunlash (yetarli suhbatdan keyin) */}
      {userTurns >= MIN_USER_TURNS && !busy && (
        <button onClick={finish} disabled={finishing} className="w-full flex items-center justify-center gap-2 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-sm hover:from-emerald-600 hover:to-green-700 active:scale-[0.98] transition-all disabled:opacity-60">
          {finishing ? <><Loader2 size={16} className="animate-spin" /> Fikr tayyorlanmoqda…</> : <>Suhbatni yakunlash <ArrowRight size={16} /></>}
        </button>
      )}
    </div>
  )
}
