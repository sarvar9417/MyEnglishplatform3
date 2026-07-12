import { useState, useRef, useEffect, useCallback } from 'react'
import { Send, Bot, User, Mic, Square, Volume2, Sparkles, Zap, AlertCircle, Drama, MessageCircle, ArrowLeft, Lightbulb, BarChart3, X, Heart, Trash2 } from 'lucide-react'
import { startDayConversation, startDayRoleplay, generateConversationFeedback } from '../../lib/claudeChat'
import type { ChallengeDay, RoleplayExercise } from '../../data/30dayChallenge'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'
import { useSpeechSynthesis } from '../../hooks/useSpeechSynthesis'
import { useLifeMemory } from '../../hooks/useLifeMemory'

interface Props {
  day: ChallengeDay
}

interface ChatMsg {
  role: 'user' | 'assistant'
  content: string
  isStreaming?: boolean
}

type ConversationMode = 'free' | 'roleplay'

/** Infer scenario fields from a roleplay exercise */
function inferScenario(ex: RoleplayExercise) {
  const s = ex.scenario.toLowerCase()
  const i = ex.instruction.toLowerCase()

  let aiRole = 'a helpful person'
  let userRole = 'a student'
  let title = ex.scenario.split('.')[0]?.trim() || 'Role-Play'

  if (s.includes('restaurant') || s.includes('waiter') || s.includes('order')) {
    aiRole = 'a friendly waiter or waitress'
    userRole = 'a customer at the restaurant'
  } else if (s.includes('coffee') || s.includes('cafe') || s.includes('barista') || s.includes('shop')) {
    aiRole = 'a friendly barista'
    userRole = 'a customer at the coffee shop'
  } else if (s.includes('direction') || s.includes('lost') || s.includes('stranger') || s.includes('train station') || s.includes('street')) {
    aiRole = 'a friendly local person'
    userRole = 'a traveler asking for help'
  } else if (s.includes('friend') || s.includes('meet') || s.includes('talking') || s.includes('catch')) {
    aiRole = 'a close friend'
    userRole = 'a friend catching up'
  } else if (s.includes('hotel') || s.includes('check')) {
    aiRole = 'a hotel receptionist'
    userRole = 'a guest checking in'
  } else if (s.includes('shop') || s.includes('store') || s.includes('buy')) {
    aiRole = 'a friendly shop assistant'
    userRole = 'a customer looking to buy something'
  } else if (s.includes('doctor') || s.includes('hospital') || s.includes('appointment')) {
    aiRole = 'a doctor or nurse'
    userRole = 'a patient at the clinic'
  } else if (s.includes('interview') || s.includes('job')) {
    aiRole = 'an interviewer'
    userRole = 'a job candidate'
  }

  // Extract a clean title
  const lines = ex.scenario.split(/[.!?]/)
  const firstLine = lines[0]?.trim()
  if (firstLine && firstLine.length > 5 && firstLine.length < 80) {
    title = firstLine
  }

  const opening = ex.tips && ex.tips.length > 0
    ? ex.tips[0]
    : `Hi there! Welcome! How can I help you today?`

  return { aiRole, userRole, title, opening }
}

export default function AiConversationSection({ day }: Props) {
  const [mode, setMode] = useState<ConversationMode>('free')
  const [activeRoleplay, setActiveRoleplay] = useState<RoleplayExercise | null>(null)
  const [showRoleplayPicker, setShowRoleplayPicker] = useState(true)

  const [messages, setMessages] = useState<ChatMsg[]>([
    { role: 'assistant', content: `👋 Let's practice speaking about **${day.title}**!\n\nYou can **type** or use the **microphone** 🎤 to reply. I'll respond like a real conversation partner.\n\nWant a role-play? Click the 🎭 **Role-play** button above!` },
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [streamingText, setStreamingText] = useState('')
  const [voiceEnabled, setVoiceEnabled] = useState(true)
  const [showFeedback, setShowFeedback] = useState(false)
  const [feedbackResult, setFeedbackResult] = useState('')
  const [isFeedbackLoading, setIsFeedbackLoading] = useState(false)
  const [showLifeMemory, setShowLifeMemory] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  const lifeMemory = useLifeMemory()
  const abortRef = useRef<AbortController | null>(null)
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const sr = useSpeechRecognition()
  const tts = useSpeechSynthesis()

  // Extract roleplay exercises from the day
  const roleplayExercises = day.exercises.filter(
    (ex): ex is RoleplayExercise => ex.type === 'roleplay'
  )

  // Auto-scroll
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, streamingText])

  // Count user messages (exclude system prompts)
  const userMsgCount = messages.filter(m => m.role === 'user').length

  // Request AI feedback on the conversation so far
  const requestFeedback = useCallback(() => {
    if (isFeedbackLoading) return
    tts.stop()
    if (sr.isRecording) sr.stop()
    setShowFeedback(true)
    setFeedbackResult('')
    setIsFeedbackLoading(true)

    const userMsgs = messages
      .filter(m => m.role === 'user' && !m.content.startsWith('(Begin)'))
      .map(m => m.content)

    generateConversationFeedback(
      userMsgs,
      day.level,
      day.title,
      day.vocabulary,
      day.learningObjectives,
      (token: string) => {
        setFeedbackResult(prev => prev + token)
      },
      (full: string) => {
        setFeedbackResult(full)
        setIsFeedbackLoading(false)

        // Extract facts from user messages and save them
        const extracted = lifeMemory.extractFactsFromMessages(userMsgs, day.title)
        for (const f of extracted) {
          lifeMemory.addFact(f.key, f.value, day.title)
        }
      },
      (err: Error) => {
        setFeedbackResult(`❌ Feedback olishda xatolik: ${err.message}`)
        setIsFeedbackLoading(false)
      },
    )
  }, [messages, day, sr, tts, isFeedbackLoading, lifeMemory])

  // Cleanup on unmount — abort any in-flight stream
  useEffect(() => {
    return () => {
      abortRef.current?.abort()
      tts.stop()
    }
  }, [tts])

  // Voice input → text
  useEffect(() => {
    if (sr.isRecording && sr.transcript) {
      setInput(prev => {
        const combined = (sr.transcript + ' ' + sr.interim).trim()
        return combined || prev
      })
    }
  }, [sr.transcript, sr.interim, sr.isRecording])

  const sendMessage = useCallback(async () => {
    const text = input.trim()
    if (!text || isLoading) return

    setInput('')
    if (sr.isRecording) sr.stop()

    const userMsg: ChatMsg = { role: 'user', content: text }
    const updatedMessages = [...messages, userMsg]
    setMessages(updatedMessages)
    setStreamingText('')
    setIsLoading(true)

    const controller = new AbortController()
    abortRef.current = controller

    const history = updatedMessages.map(m => ({ role: m.role, content: m.content }))

    if (mode === 'roleplay' && activeRoleplay) {
      // ── Role-play mode ──────────────────────────────────────────────
      const scenario = inferScenario(activeRoleplay)
      await startDayRoleplay(
        scenario,
        day.level,
        day.title,
        day.vocabulary,
        history,
        (token: string) => {
          setStreamingText(prev => prev + token)
        },
        (full: string) => {
          setMessages(prev => [...prev, { role: 'assistant', content: full }])
          setStreamingText('')
          setIsLoading(false)
          if (voiceEnabled) tts.speak(full).catch(() => {})
        },
        (err: Error) => {
          setStreamingText('')
          setIsLoading(false)
          setMessages(prev => [...prev, { role: 'assistant', content: `❌ Xatolik: ${err.message}` }])
        },
      )
    } else {
      // ── Free conversation mode ─────────────────────────────────────
      const factsText = lifeMemory.buildFactsText()
      await startDayConversation(
        {
          day: day.day,
          title: day.title,
          level: day.level,
          vocabulary: day.vocabulary,
          sentenceBank: day.sentenceBank,
          learningObjectives: day.learningObjectives,
          speaking: day.speaking,
          highlights: day.highlights,
        },
        history,
        (token: string) => {
          setStreamingText(prev => prev + token)
        },
        (full: string) => {
          setMessages(prev => [...prev, { role: 'assistant', content: full }])
          setStreamingText('')
          setIsLoading(false)
          if (voiceEnabled) tts.speak(full).catch(() => {})
        },
        (err: Error) => {
          setStreamingText('')
          setIsLoading(false)
          setMessages(prev => [...prev, { role: 'assistant', content: `❌ Xatolik yuz berdi: ${err.message}`, isStreaming: false }])
        },
        factsText || undefined,
      )
    }
  }, [input, isLoading, messages, day, voiceEnabled, sr, tts, mode, activeRoleplay, lifeMemory])

  const toggleMic = useCallback(() => {
    if (sr.isRecording) {
      sr.stop()
    } else {
      tts.stop()
      setInput('')
      sr.reset()
      sr.start()
    }
  }, [sr, tts])

  const stopSpeaking = useCallback(() => {
    tts.stop()
  }, [tts])

  const clearChat = useCallback(() => {
    tts.stop()
    if (sr.isRecording) sr.stop()
    if (abortRef.current) abortRef.current.abort()
    const msg = mode === 'roleplay' && activeRoleplay
      ? `🔄 Role-play tozalandi. Keling, "${inferScenario(activeRoleplay).title}" ni qaytadan boshlaymiz!`
      : `🔄 Suhbat tozalandi. Keling, ${day.title} mavzusida davom etamiz!`
    setMessages([{ role: 'assistant', content: msg }])
    setInput('')
    setStreamingText('')
    setIsLoading(false)
  }, [day.title, sr, tts, mode, activeRoleplay])

  /** Start a role-play with the given exercise */
  const startRoleplay = useCallback((ex: RoleplayExercise) => {
    tts.stop()
    if (sr.isRecording) sr.stop()
    if (abortRef.current) abortRef.current.abort()
    const scenario = inferScenario(ex)
    setActiveRoleplay(ex)
    setMode('roleplay')
    setShowRoleplayPicker(false)
    setMessages([
      { role: 'assistant', content: `🎭 **${scenario.title}**\n\nI'll be **${scenario.aiRole}** and you'll be **${scenario.userRole}**.\n\n${ex.tips?.map(t => `💡 ${t}`).join('\n') || ''}\n\nLet's begin! Reply to start the conversation. 🎬` },
    ])
    setInput('')
    setStreamingText('')
    setIsLoading(false)
  }, [sr, tts])

  /** Switch back to free conversation */
  const switchToFree = useCallback(() => {
    tts.stop()
    if (sr.isRecording) sr.stop()
    if (abortRef.current) abortRef.current.abort()
    setMode('free')
    setActiveRoleplay(null)
    setShowRoleplayPicker(false)
    setMessages([
      { role: 'assistant', content: `🔄 Back to free conversation. Let's keep talking about **${day.title}**!` },
    ])
    setInput('')
    setStreamingText('')
    setIsLoading(false)
  }, [day.title, sr, tts])

  // Auto-resize textarea
  useEffect(() => {
    const ta = inputRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, 120)}px`
  }, [input])

  return (
    <div className="relative flex flex-col rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden" style={{ height: '540px' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
            mode === 'roleplay'
              ? 'bg-gradient-to-br from-purple-500 to-fuchsia-600'
              : 'bg-gradient-to-br from-primary-500 to-primary-700'
          }`}>
            {mode === 'roleplay' ? <Drama size={16} className="text-white" /> : <Bot size={16} className="text-white" />}
          </div>
          <div className="min-w-0">
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100 truncate">
              {mode === 'roleplay' ? '🎭 Role-Play' : 'AI Conversation'}
            </p>
            <p className="text-xs text-gray-500 truncate">
              {mode === 'roleplay' && activeRoleplay
                ? inferScenario(activeRoleplay).title
                : `${day.level} • ${day.title}`
              }
            </p>
          </div>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          {/* Mode toggle */}
          {roleplayExercises.length > 0 && (
            <button
              onClick={() => {
                if (mode === 'roleplay') {
                  switchToFree()
                } else {
                  setShowRoleplayPicker(prev => !prev)
                }
              }}
              className={`p-2 rounded-lg transition-all text-xs font-bold flex items-center gap-1 ${
                mode === 'roleplay'
                  ? 'bg-purple-100 dark:bg-purple-900/40 text-purple-700 dark:text-purple-300'
                  : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'
              }`}
              title={mode === 'roleplay' ? 'Free suhbatga qaytish' : 'Role-play rejimi'}
            >
              {mode === 'roleplay' ? (
                <><MessageCircle size={14} /><span className="hidden sm:inline text-xs">Free</span></>
              ) : (
                <><Drama size={14} /><span className="hidden sm:inline text-xs">Role-play</span></>
              )}
            </button>
          )}
          {/* Life Memory button */}
          {lifeMemory.factCount > 0 && (
            <button
              onClick={() => setShowLifeMemory(prev => !prev)}
              className={`p-2 rounded-lg transition-all ${showLifeMemory ? 'text-rose-600 bg-rose-100 dark:bg-rose-900/40' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
              title="Life Memory - faktlar"
            >
              <Heart size={15} />
            </button>
          )}
          <button
            onClick={() => setVoiceEnabled(v => !v)}
            className={`p-2 rounded-lg transition-colors ${voiceEnabled ? 'text-primary-600 bg-primary-100 dark:bg-primary-900/40' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            title={voiceEnabled ? "Ovoz o'chirish" : "Ovoz yoqish"}
          >
            <Volume2 size={15} />
          </button>
          <button
            onClick={clearChat}
            className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors"
            title="Suhbatni tozalash"
          >
            <Sparkles size={15} />
          </button>
        </div>
      </div>

      {/* Role-play picker */}
      {(showRoleplayPicker || (mode === 'free' && roleplayExercises.length > 0 && messages.length <= 1)) && (
        <div className="px-3 py-3 bg-gradient-to-r from-purple-50 to-fuchsia-50 dark:from-purple-900/20 dark:to-fuchsia-900/20 border-b border-purple-100 dark:border-purple-800/30">
          <div className="flex items-center gap-1.5 mb-2 text-xs font-bold text-purple-700 dark:text-purple-300">
            <Drama size={14} />
            Role-play bilan mashq qiling
          </div>
          <div className="flex flex-wrap gap-2">
            {roleplayExercises.map(ex => {
              const scenario = inferScenario(ex)
              return (
                <button
                  key={ex.id}
                  onClick={() => startRoleplay(ex)}
                  className="group relative flex items-start gap-2 p-2.5 rounded-xl bg-white dark:bg-gray-800 border border-purple-200 dark:border-purple-700/50 hover:border-purple-400 dark:hover:border-purple-500 transition-all hover:shadow-md active:scale-[0.97] text-left"
                >
                  <div className="mt-0.5">
                    <Drama size={14} className="text-purple-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-800 dark:text-gray-200 truncate max-w-[160px]">{scenario.title}</p>
                    <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-0.5">{scenario.aiRole} ↔ {scenario.userRole}</p>
                  </div>
                </button>
              )
            })}
          </div>
          <button
            onClick={() => setShowRoleplayPicker(false)}
            className="mt-1.5 text-[10px] text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline"
          >
            Yopish
          </button>
        </div>
      )}

      {/* Life Memory overlay */}
      {showLifeMemory && (
        <div className="absolute inset-0 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm overflow-y-auto scrollbar-thin">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Heart size={18} className="text-rose-500" />
                <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
                  Life Memory ({lifeMemory.factCount})
                </h3>
              </div>
              <button
                onClick={() => setShowLifeMemory(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={16} className="text-gray-400" />
              </button>
            </div>

            {lifeMemory.facts.length === 0 ? (
              <div className="py-8 text-center">
                <Heart size={32} className="mx-auto text-gray-300 dark:text-gray-600 mb-2" />
                <p className="text-sm text-gray-500">Hali faktlar yo'q</p>
                <p className="text-xs text-gray-400 mt-1">Suhbat davomida o'zingiz haqingizda gapirishingiz bilan AI eslab qoladi</p>
              </div>
            ) : (
              <div className="space-y-2">
                {lifeMemory.facts.map(fact => (
                  <div key={fact.id} className="flex items-start gap-2.5 p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800/30">
                    <div className="flex-1 min-w-0">
                      <p className="text-[10px] font-bold text-rose-600 dark:text-rose-400 uppercase tracking-wider">
                        {fact.key}
                      </p>
                      <p className="text-sm font-bold text-gray-800 dark:text-gray-200 mt-0.5">
                        {fact.value}
                      </p>
                      <p className="text-[10px] text-gray-400 mt-1">
                        {fact.learnedFrom}
                      </p>
                    </div>
                    <button
                      onClick={() => lifeMemory.deleteFact(fact.id)}
                      className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/30 transition-colors shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
                  </div>
                ))}

                <button
                  onClick={() => {
                    lifeMemory.clearFacts()
                    setShowLifeMemory(false)
                  }}
                  className="w-full py-2 text-xs text-gray-400 hover:text-red-500 transition-colors"
                >
                  Barcha faktlarni o'chirish
                </button>
              </div>
            )}

            <button
              onClick={() => setShowLifeMemory(false)}
              className="w-full py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Suhbatga qaytish
            </button>
          </div>
        </div>
      )}

      {/* Feedback overlay */}
      {showFeedback && (
        <div className="absolute inset-0 z-10 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm overflow-y-auto scrollbar-thin">
          <div className="p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 size={18} className="text-primary-600" />
                <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">Suhbat tahlili</h3>
              </div>
              <button
                onClick={() => setShowFeedback(false)}
                className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <X size={16} className="text-gray-400" />
              </button>
            </div>

            {isFeedbackLoading && !feedbackResult && (
              <div className="flex items-center gap-2 py-8 justify-center">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="w-2 h-2 bg-primary-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
                <span className="text-sm text-gray-500">Tahlil qilinmoqda...</span>
              </div>
            )}

            {feedbackResult && (
              <div className="space-y-3">
                {/* Parse structured feedback */}
                {['GRAMMAR', 'VOCABULARY', 'FLUENCY'].map(label => {
                  const match = feedbackResult.match(new RegExp(`${label}:\\s*\\d+`))
                  const scoreMatch = feedbackResult.match(new RegExp(`${label}:\\s*(\\d+)\\/(\\d+)`)) ||
                                    feedbackResult.match(new RegExp(`${label}:\\s*(\\d+)`))
                  const score = scoreMatch ? parseInt(scoreMatch[1]) : null
                  const maxScore = scoreMatch && scoreMatch[2] ? parseInt(scoreMatch[2]) : 10

                  // Get the sentence after the score
                  const afterLabel = feedbackResult.split(`${label}:`)[1]
                  const sentence = afterLabel
                    ? afterLabel.split('\n').find(l => l.trim() && !l.trim().match(/^\d+\/?\d*$/))?.trim() || ''
                    : ''

                  if (!match && !sentence) return null

                  const percentage = score ? (score / maxScore) * 100 : 0
                  const color = percentage >= 70 ? 'from-emerald-500 to-green-500' :
                                percentage >= 50 ? 'from-amber-500 to-yellow-500' :
                                'from-red-500 to-rose-500'

                  return (
                    <div key={label} className="p-3 rounded-xl bg-gray-50 dark:bg-gray-800 border border-gray-100 dark:border-gray-700">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-gray-700 dark:text-gray-300 uppercase tracking-wide">{label}</span>
                        {score !== null && (
                          <span className="text-sm font-black text-gray-900 dark:text-gray-100">{score}/{maxScore}</span>
                        )}
                      </div>
                      {score !== null && (
                        <div className="h-1.5 rounded-full bg-gray-200 dark:bg-gray-700 mb-2 overflow-hidden">
                          <div
                            className={`h-full rounded-full bg-gradient-to-r ${color} transition-all duration-700`}
                            style={{ width: `${percentage}%` }}
                          />
                        </div>
                      )}
                      {sentence && (
                        <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">{sentence}</p>
                      )}
                    </div>
                  )
                })}

                {/* Strengths */}
                {feedbackResult.includes('STRENGTHS:') && (
                  <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-100 dark:border-emerald-800/30">
                    <p className="text-xs font-bold text-emerald-700 dark:text-emerald-300 mb-1.5">✅ Kuchli tomonlari</p>
                    <div className="space-y-0.5">
                      {(() => {
                        const parts = feedbackResult.split('STRENGTHS:')[1]?.split('IMPROVE:')[0]
                        if (!parts) return null
                        return parts.split('\n').filter(l => l.trim().startsWith('•')).map((line, i) => (
                          <p key={i} className="text-xs text-emerald-600 dark:text-emerald-400">{line.trim()}</p>
                        ))
                      })()}
                    </div>
                  </div>
                )}

                {/* Improve */}
                {feedbackResult.includes('IMPROVE:') && (
                  <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30">
                    <p className="text-xs font-bold text-amber-700 dark:text-amber-300 mb-1.5">📈 Yaxshilash uchun</p>
                    <div className="space-y-0.5">
                      {(() => {
                        const parts = feedbackResult.split('IMPROVE:')[1]?.split('ENCOURAGEMENT:')[0]
                        if (!parts) return null
                        return parts.split('\n').filter(l => l.trim().startsWith('•')).map((line, i) => (
                          <p key={i} className="text-xs text-amber-600 dark:text-amber-400">{line.trim()}</p>
                        ))
                      })()}
                    </div>
                  </div>
                )}

                {/* Encouragement */}
                {feedbackResult.includes('ENCOURAGEMENT:') && (
                  <div className="p-3 rounded-xl bg-primary-50 dark:bg-primary-900/20 border border-primary-100 dark:border-primary-800/30">
                    <p className="text-xs font-bold text-primary-700 dark:text-primary-300 mb-1">💪 Rag'bat</p>
                    <p className="text-xs text-primary-600 dark:text-primary-400 leading-relaxed">
                      {feedbackResult.split('ENCOURAGEMENT:')[1]?.split('\n').filter(l => l.trim())[0]?.trim() || ''}
                    </p>
                  </div>
                )}
              </div>
            )}

            <button
              onClick={() => setShowFeedback(false)}
              className="w-full py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm font-bold text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              Suhbatga qaytish
            </button>
          </div>
        </div>
      )}

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin relative">
        {messages.map((msg, i) => (
          <div key={i} className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
              msg.role === 'user'
                ? 'bg-primary-100 dark:bg-primary-900/50 text-primary-700 dark:text-primary-300'
                : mode === 'roleplay'
                  ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300'
                  : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300'
            }`}>
              {msg.role === 'user' ? <User size={13} /> : mode === 'roleplay' ? <Drama size={13} /> : <Bot size={13} />}
            </div>
            <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
              msg.role === 'user'
                ? 'bg-primary-600 text-white rounded-tr-sm'
                : mode === 'roleplay'
                  ? 'bg-purple-50 dark:bg-purple-900/30 text-gray-800 dark:text-gray-200 rounded-tl-sm border border-purple-100 dark:border-purple-800/50'
                  : 'bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 rounded-tl-sm border border-gray-100 dark:border-gray-700'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}

        {/* Streaming */}
        {streamingText && (
          <div className="flex gap-2.5">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
              mode === 'roleplay'
                ? 'bg-purple-100 dark:bg-purple-900/50 text-purple-600 dark:text-purple-300'
                : 'bg-indigo-100 dark:bg-indigo-900/50 text-indigo-600 dark:text-indigo-300'
            }`}>
              {mode === 'roleplay' ? <Drama size={13} /> : <Bot size={13} />}
            </div>
            <div className={`max-w-[80%] px-3.5 py-2.5 rounded-2xl rounded-tl-sm text-sm ${
              mode === 'roleplay'
                ? 'bg-purple-50 dark:bg-purple-900/30 text-gray-800 dark:text-gray-200 border border-purple-100 dark:border-purple-800/50'
                : 'bg-gray-50 dark:bg-gray-700/50 text-gray-800 dark:text-gray-200 border border-gray-100 dark:border-gray-700'
            }`}>
              {streamingText}
              <span className="inline-block w-1.5 h-4 bg-primary-500 ml-0.5 rounded-sm animate-pulse" />
            </div>
          </div>
        )}

        {/* Loading dots */}
        {isLoading && !streamingText && (
          <div className="flex gap-2.5">
            <div className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
              mode === 'roleplay'
                ? 'bg-purple-100 dark:bg-purple-900/50'
                : 'bg-indigo-100 dark:bg-indigo-900/50'
            }`}>
              {mode === 'roleplay' ? <Drama size={13} className="text-purple-600 dark:text-purple-300" /> : <Bot size={13} className="text-indigo-600 dark:text-indigo-300" />}
            </div>
            <div className={`px-3.5 py-2.5 rounded-2xl border flex gap-1 ${
              mode === 'roleplay'
                ? 'bg-purple-50 dark:bg-purple-900/30 border-purple-100 dark:border-purple-800/50'
                : 'bg-gray-50 dark:bg-gray-700/50 border-gray-100 dark:border-gray-700'
            }`}>
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}

        {/* Mic permission error */}
        {sr.permissionError && !sr.isRecording && (
          <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 text-xs text-amber-700 dark:text-amber-300">
            <p className="flex items-center gap-1 font-medium">
              <AlertCircle size={12} /> Mikrofon ruxsati yo'q
            </p>
            <button onClick={() => { sr.reset(); sr.start() }} className="mt-1 text-xs font-bold text-amber-800 dark:text-amber-200 underline">
              Qayta urinish
            </button>
          </div>
        )}

        {/* Feedback button */}
        {userMsgCount >= 2 && !showFeedback && (
          <div className="text-center py-1">
            <button
              onClick={requestFeedback}
              disabled={isFeedbackLoading}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-green-600 text-white text-xs font-bold hover:from-emerald-600 hover:to-green-700 transition-all active:scale-95 shadow-md hover:shadow-lg"
            >
              <BarChart3 size={14} />
              {isFeedbackLoading ? 'Tahlil qilinmoqda...' : 'Suhbat tahlili 📊'}
            </button>
            <p className="text-[10px] text-gray-400 mt-1">So'nggi {userMsgCount} ta xabaringiz tahlil qilinadi</p>
          </div>
        )}

        {/* Role-play tip */}
        {mode === 'free' && roleplayExercises.length > 0 && !showRoleplayPicker && (
          <div className="text-center">
            <button
              onClick={() => setShowRoleplayPicker(true)}
              className="text-xs text-purple-500 hover:text-purple-700 dark:hover:text-purple-300 underline transition-colors"
            >
              🎭 Role-play rejimiga o'tish
            </button>
          </div>
        )}

        {mode === 'roleplay' && (
          <div className="text-center">
            <button
              onClick={switchToFree}
              className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 underline transition-colors flex items-center gap-1 justify-center"
            >
              <ArrowLeft size={12} /> Free suhbatga qaytish
            </button>
          </div>
        )}

        {/* Tips in role-play mode */}
        {mode === 'roleplay' && activeRoleplay?.tips && activeRoleplay.tips.length > 0 && (
          <div className="p-3 rounded-xl bg-purple-50/50 dark:bg-purple-900/10 border border-purple-100 dark:border-purple-800/30">
            <p className="text-[10px] font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1 mb-1.5">
              <Lightbulb size={11} /> Maslahatlar
            </p>
            <ul className="space-y-0.5">
              {activeRoleplay.tips.map((tip, i) => (
                <li key={i} className="text-[11px] text-gray-600 dark:text-gray-400">💡 {tip}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
        <div className="flex items-center gap-2">
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                sendMessage()
              }
            }}
            placeholder={mode === 'roleplay' ? "Role-play dialogini yozing..." : "Xabar yozing yoki mikrofonni bosing..."}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 text-sm text-gray-900 dark:text-gray-100 placeholder-gray-400 outline-none focus:ring-2 focus:ring-primary-500 resize-none max-h-[100px]"
            rows={1}
            disabled={isLoading}
          />

          {/* Mic button */}
          <button
            onClick={toggleMic}
            disabled={isLoading}
            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all active:scale-90 disabled:opacity-40 ${
              sr.isRecording
                ? 'bg-red-500 text-white animate-pulse shadow-lg'
                : 'bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-500'
            }`}
            title={sr.isRecording ? "Yozib olishni to'xtatish" : "Mikrofon"}
          >
            {sr.isRecording ? <Square size={15} /> : <Mic size={16} />}
          </button>

          {/* Send button */}
          <button
            onClick={sendMessage}
            disabled={!input.trim() || isLoading}
            className={`w-10 h-10 rounded-xl flex items-center justify-center disabled:opacity-40 disabled:cursor-not-allowed active:scale-90 transition-all shadow-md shrink-0 ${
              mode === 'roleplay'
                ? 'bg-gradient-to-br from-purple-600 to-fuchsia-700 text-white'
                : 'bg-gradient-to-br from-primary-600 to-primary-700 text-white'
            }`}
          >
            {isLoading ? <Zap size={16} className="animate-pulse" /> : <Send size={16} />}
          </button>
        </div>

        {/* Recording indicator */}
        {sr.isRecording && (
          <p className="text-xs text-red-500 font-semibold flex items-center gap-1.5 mt-1.5 animate-pulse">
            <span className="w-1.5 h-1.5 bg-red-500 rounded-full" />
            Gapiryapsiz... to'xtatish uchun 🎤 bosing
          </p>
        )}

        {tts.isSpeaking && (
          <p className="text-xs text-primary-500 font-semibold flex items-center gap-1.5 mt-1.5">
            <Volume2 size={12} className="animate-pulse" />
            AI gapiryapti...
            <button onClick={stopSpeaking} className="text-xs underline ml-1">To'xtatish</button>
          </p>
        )}
      </div>
    </div>
  )
}
