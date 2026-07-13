import { useState, useCallback, useRef, useEffect } from 'react'
import { Send, Loader2, Shuffle, Volume2, ArrowLeftRight } from 'lucide-react'
import { startRoleplayGame } from '../../lib/claudeChat'
import type { ChallengeExercise, RoleplayExercise } from '../../data/30dayChallenge'
import { inferScenario } from './AiConversationSection'

interface Props {
  exercises: ChallengeExercise[]
}

interface ChatMsg {
  role: 'user' | 'assistant'
  content: string
}

export default function RoleplayGame({ exercises }: Props) {
  const roleplays = exercises.filter((e): e is RoleplayExercise => e.type === 'roleplay')

  const [phase, setPhase] = useState<1 | 2>(1)
  const [activeEx, setActiveEx] = useState<RoleplayExercise | null>(null)
  const [messages, setMessages] = useState<ChatMsg[]>([])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [gameStarted, setGameStarted] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, streamingText])

  const startGame = useCallback((ex: RoleplayExercise) => {
    setActiveEx(ex)
    setPhase(1)
    setMessages([])
    setGameStarted(true)
    setStreamingText('')
    setIsLoading(true)

    const s = inferScenario(ex)
    startRoleplayGame(
      { title: s.title, aiRole: s.aiRole, userRole: s.userRole },
      1,
      [],
      (token) => setStreamingText(prev => prev + token),
      (full) => {
        setMessages([{ role: 'assistant', content: full }])
        setStreamingText('')
        setIsLoading(false)
      },
      (err) => {
        setMessages([{ role: 'assistant', content: `Xatolik: ${err.message}` }])
        setIsLoading(false)
      }
    )
  }, [])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || isLoading || !activeEx) return
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: text }])
    setIsLoading(true)
    setStreamingText('')

    const history: { role: 'user' | 'assistant'; content: string }[] = [
      ...messages,
      { role: 'user', content: text },
    ]

    const s = inferScenario(activeEx)
    startRoleplayGame(
      { title: s.title, aiRole: s.aiRole, userRole: s.userRole },
      phase,
      history,
      (token) => setStreamingText(prev => prev + token),
      (full) => {
        setMessages(prev => [...prev, { role: 'assistant', content: full }])
        setStreamingText('')
        setIsLoading(false)
        // Auto switch phase if AI says all questions done
        if (full.includes('2-BOSQICH') || full.includes('2-bosqich') || full.includes('keyingi bosqich')) {
          setPhase(2)
        }
      },
      (err) => {
        setMessages(prev => [...prev, { role: 'assistant', content: `Xatolik: ${err.message}` }])
        setIsLoading(false)
      }
    )
  }, [input, isLoading, activeEx, messages, phase])

  const speakText = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      u.lang = 'en-US'
      u.rate = 0.8
      window.speechSynthesis.speak(u)
    }
  }, [])

  if (roleplays.length === 0) {
    return (
      <div className="rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700 p-6 text-center">
        <p className="text-gray-500 dark:text-gray-400 text-sm">Bu kunda role-play mashqlari mavjud emas.</p>
      </div>
    )
  }

  if (!gameStarted) {
    return (
      <div className="space-y-3">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          🎭 Role-play o'yini
        </h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Har bir role-play ikki bosqichdan iborat: avval AI savol beradi siz javob berasiz, keyin siz savol berib AI javob beradi.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {roleplays.map(ex => {
            const s = inferScenario(ex)
            return (
              <button
                key={ex.id}
                onClick={() => startGame(ex)}
                className="text-left p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 hover:border-purple-300 dark:hover:border-purple-700 transition-all hover:shadow-md active:scale-[0.98]"
              >
                <p className="font-bold text-sm text-gray-900 dark:text-gray-100 mb-1">{s.title}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  🤖 {s.aiRole} ↔️ 🧑 {s.userRole}
                </p>
                {ex.tips && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {ex.tips.slice(0, 2).map((t, i) => (
                      <span key={i} className="text-[10px] px-1.5 py-0.5 rounded-full bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-400">
                        {t}
                      </span>
                    ))}
                  </div>
                )}
              </button>
            )
          })}
        </div>
      </div>
    )
  }

  return (
    <div className="rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden">
      {/* Header */}
      <div className={`flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-700 ${
        phase === 1
          ? 'bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20'
          : 'bg-gradient-to-r from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20'
      }`}>
        <div>
          <p className="text-sm font-bold text-gray-900 dark:text-gray-100 flex items-center gap-1.5">
            {phase === 1 ? '🤖 AI so\'raydi' : '🧑 Siz so\'raysiz'}
            <span className="text-xs font-normal text-gray-400">— Bosqich {phase}/2</span>
          </p>
          {activeEx && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
              {activeEx.instruction}
            </p>
          )}
        </div>
        <button
          onClick={() => { setGameStarted(false); setActiveEx(null) }}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 transition-all border border-gray-200 dark:border-gray-600"
        >
          <Shuffle size={12} /> Boshqa
        </button>
      </div>

      {/* Phase indicator */}
      <div className="px-4 py-2 bg-gray-50 dark:bg-gray-700/30 border-b border-gray-200 dark:border-gray-700 flex items-center gap-2 text-xs text-gray-500 dark:text-gray-400">
        <span className={`px-2 py-0.5 rounded-full font-bold ${phase === 1 ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300' : 'bg-gray-200 dark:bg-gray-600 text-gray-500'}`}>
          1. AI so'raydi
        </span>
        <ArrowLeftRight size={12} />
        <span className={`px-2 py-0.5 rounded-full font-bold ${phase === 2 ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300' : 'bg-gray-200 dark:bg-gray-600 text-gray-500'}`}>
          2. Siz so'raysiz
        </span>
      </div>

      {/* Messages */}
      <div className="max-h-[400px] overflow-y-auto p-4 space-y-3">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[85%] rounded-xl px-3.5 py-2.5 ${
              m.role === 'user'
                ? phase === 1
                  ? 'bg-purple-50 dark:bg-purple-900/30 border border-purple-200 dark:border-purple-800 rounded-tr-sm'
                  : 'bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200 dark:border-emerald-800 rounded-tr-sm'
                : 'bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-tl-sm'
            }`}>
              {m.role === 'assistant' && (
                <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">
                  🤖 {activeEx ? inferScenario(activeEx).aiRole : 'AI'}
                </p>
              )}
              <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">{m.content}</p>
              {m.role === 'assistant' && (
                <button
                  onClick={() => speakText(m.content.replace(/[^a-zA-Z\s.!?]/g, ''))}
                  className="mt-1 p-1 rounded-md text-gray-400 hover:text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/30 transition-all"
                >
                  <Volume2 size={11} />
                </button>
              )}
            </div>
          </div>
        ))}

        {streamingText && (
          <div className="flex justify-start">
            <div className="max-w-[85%] rounded-xl px-3.5 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-tl-sm">
              <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500 mb-1">
                🤖 {activeEx ? inferScenario(activeEx).aiRole : 'AI'}
              </p>
              <p className="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap leading-relaxed">
                {streamingText}
                <span className="inline-block w-1.5 h-4 bg-purple-500 ml-0.5 animate-pulse" />
              </p>
            </div>
          </div>
        )}

        {isLoading && !streamingText && (
          <div className="flex justify-start">
            <div className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600">
              <Loader2 size={14} className="animate-spin text-purple-500" />
              <span className="text-xs text-gray-500">AI o'ylamoqda...</span>
            </div>
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-gray-700 p-3">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMessage() } }}
            placeholder={phase === 1 ? 'Ingliz tilida javob yozing...' : 'Ingliz tilida savol yozing...'}
            disabled={isLoading}
            className="flex-1 px-4 py-2.5 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all placeholder-gray-400 disabled:opacity-50"
          />
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className={`p-2.5 rounded-xl text-white transition-all active:scale-95 disabled:opacity-40 ${
              phase === 1
                ? 'bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700'
            }`}
          >
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  )
}