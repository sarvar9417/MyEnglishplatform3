import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Send, Bot, User, Trash2,
  Zap, AlertCircle, ChevronDown,
} from 'lucide-react'
import { sendMessageStream, type ChatMessage, MODEL } from '../lib/claude'
import { QUICK_PROMPTS, type TutorMode } from '../lib/prompts'
import { useStore } from '../store/useStore'
import { addSession } from '../db/database'
import { getTodayTashkent } from '../utils/tashkentDate'

// ─── Types ────────────────────────────────────────────────────────────────────

interface UIMessage extends ChatMessage {
  id: number
  timestamp: Date
  isStreaming?: boolean
  error?: boolean
}

// ─── Markdown-lite renderer (bold, inline code, lists) ────────────────────────

function renderContent(text: string) {
  const lines = text.split('\n')
  return lines.map((line, i) => {
    const parts: (string | JSX.Element)[] = []
    let remaining = line
    let keyIdx = 0

    // Bold **text**
    remaining = remaining.replace(/\*\*(.+?)\*\*/g, (_, inner) => `‹b›${inner}‹/b›`)
    // Inline code `code`
    remaining = remaining.replace(/`([^`]+)`/g, (_, inner) => `‹code›${inner}‹/code›`)

    const segments = remaining.split(/(‹b›.+?‹\/b›|‹code›.+?‹\/code›)/g)
    for (const seg of segments) {
      if (seg.startsWith('‹b›')) {
        parts.push(<strong key={keyIdx++}>{seg.slice(3, -4)}</strong>)
      } else if (seg.startsWith('‹code›')) {
        parts.push(
          <code key={keyIdx++}
            className="bg-gray-100 text-primary-700 px-1.5 py-0.5 rounded text-xs font-mono">
            {seg.slice(6, -7)}
          </code>
        )
      } else {
        parts.push(seg)
      }
    }

    const isListItem = /^[①②③④\-•\d+\.]/.test(line.trimStart())
    return (
      <span key={i} className={`block ${isListItem ? 'pl-3' : ''} ${i > 0 ? 'mt-1' : ''}`}>
        {parts}
      </span>
    )
  })
}

// ─── Message Bubble ───────────────────────────────────────────────────────────

function MessageBubble({ msg }: { msg: UIMessage }) {
  const isUser = msg.role === 'user'

  return (
    <div className={`flex gap-3 ${isUser ? 'flex-row-reverse' : ''}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5
        ${isUser ? 'bg-primary-100 text-primary-700' : 'bg-b2-100 text-b2-700'}`}>
        {isUser ? <User size={15} /> : <Bot size={15} />}
      </div>

      {/* Bubble */}
      <div className={`max-w-[78%] ${isUser ? 'items-end' : 'items-start'} flex flex-col gap-1`}>
        <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed
          ${isUser
            ? 'bg-primary-600 text-white rounded-tr-sm'
            : msg.error
              ? 'bg-red-50 border border-red-200 text-red-700 rounded-tl-sm'
              : 'bg-white border border-gray-100 text-gray-800 rounded-tl-sm shadow-sm'
          }`}
        >
          {msg.error && <AlertCircle size={14} className="inline mr-1.5 mb-0.5" />}
          {isUser
            ? msg.content
            : renderContent(msg.content)
          }
          {msg.isStreaming && (
            <span className="inline-block w-1 h-4 bg-b2-500 ml-0.5 rounded-sm animate-pulse" />
          )}
        </div>
        <span className="text-[10px] text-gray-400 px-1">
          {msg.timestamp.toLocaleTimeString('uz-UZ', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  )
}

// ─── Mode Selector ────────────────────────────────────────────────────────────

const MODES: { id: TutorMode; label: string; color: string }[] = [
  { id: 'general',          label: '💬 Free talk',     color: 'text-primary-600' },
  { id: 'grammar-check',    label: '✍️ Grammar',        color: 'text-orange-600'  },
  { id: 'vocabulary',       label: '📖 Vocab',          color: 'text-b1-600'      },
  { id: 'writing-feedback', label: '📝 Writing',        color: 'text-b2-600'      },
  { id: 'lesson-explain',   label: '📚 Lesson',         color: 'text-indigo-600'  },
]

// ─── API Key Banner ───────────────────────────────────────────────────────────

function ApiKeyBanner() {
  return (
    <div className="mx-4 my-3 p-4 bg-amber-50 border border-amber-200 rounded-xl text-sm">
      <p className="font-semibold text-amber-800 flex items-center gap-2">
        <AlertCircle size={16} /> API kaliti sozlanmagan
      </p>
      <p className="text-amber-700 mt-1 text-xs">
        <code className="bg-amber-100 px-1 py-0.5 rounded">.env</code> faylida{' '}
        <code className="bg-amber-100 px-1 py-0.5 rounded">VITE_ANTHROPIC_API_KEY</code>{' '}
        ni haqiqiy kalit bilan almashtiring, so'ng serverni qayta ishga tushiring.
      </p>
      <a
        href="https://console.anthropic.com/"
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-2 text-xs text-amber-900 underline"
      >
        → console.anthropic.com dan kalit olish
      </a>
    </div>
  )
}

// ─── Main Chat ────────────────────────────────────────────────────────────────

const INITIAL_MESSAGE: UIMessage = {
  id: 0,
  role: 'assistant',
  content: `Hello! I'm your **EnglishPath AI Tutor** powered by ${MODEL}. 🎓

I can help you with:
① **Grammar** — I'll correct your mistakes and explain the rules
② **Vocabulary** — deep explanations with examples and collocations
③ **Writing** — detailed feedback and scoring
④ **Free conversation** — practice real-life English

What would you like to work on today?`,
  timestamp: new Date(),
}

const API_KEY_MISSING =
  !import.meta.env.VITE_ANTHROPIC_API_KEY ||
  import.meta.env.VITE_ANTHROPIC_API_KEY === 'your_key_here'

export default function Chat() {
  const [messages, setMessages] = useState<UIMessage[]>([INITIAL_MESSAGE])
  const [input, setInput] = useState('')
  const [mode, setMode] = useState<TutorMode>('general')
  const [isStreaming, setIsStreaming] = useState(false)
  const [showModes, setShowModes] = useState(false)
  const [sessionStart] = useState(Date.now())

  const bottomRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const { addXP, incrementStreak, updateSkillProgress, todayGrammarPct } = useStore()

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Auto-resize textarea
  useEffect(() => {
    const ta = textareaRef.current
    if (!ta) return
    ta.style.height = 'auto'
    ta.style.height = `${Math.min(ta.scrollHeight, 160)}px`
  }, [input])

  // Save session on unmount
  useEffect(() => {
    return () => {
      const mins = Math.round((Date.now() - sessionStart) / 60000)
      if (mins < 1) return
      addSession({
        date: getTodayTashkent(),
        type: 'ai-chat',
        durationMinutes: mins,
        xpEarned: mins * 5,
        createdAt: Date.now(),
      }).catch(() => {})
    }
  }, [sessionStart])

  const send = useCallback(async (overrideText?: string) => {
    const text = (overrideText ?? input).trim()
    if (!text || isStreaming) return
    if (!overrideText) setInput('')

    const userMsg: UIMessage = {
      id: Date.now(),
      role: 'user',
      content: text,
      timestamp: new Date(),
    }

    const assistantId = Date.now() + 1
    const assistantMsg: UIMessage = {
      id: assistantId,
      role: 'assistant',
      content: '',
      timestamp: new Date(),
      isStreaming: true,
    }

    setMessages((prev) => [...prev, userMsg, assistantMsg])
    setIsStreaming(true)

    // Build history for API (skip the initial greeting)
    const history: ChatMessage[] = messages
      .slice(1)
      .concat(userMsg)
      .map(({ role, content }) => ({ role, content }))

    await sendMessageStream(
      history,
      mode,
      (token) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: m.content + token }
              : m
          )
        )
      },
      (_full) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId ? { ...m, isStreaming: false } : m
          )
        )
        setIsStreaming(false)
        addXP(10)
        incrementStreak()
        if (mode === 'grammar-check') {
          updateSkillProgress('todayGrammarPct', Math.min(100, todayGrammarPct + 10))
        } else if (mode === 'writing-feedback') {
          updateSkillProgress('todayWritingPct', Math.min(100, useStore.getState().todayWritingPct + 10))
        }
      },
      (err) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === assistantId
              ? { ...m, content: err.message, isStreaming: false, error: true }
              : m
          )
        )
        setIsStreaming(false)
      }
    )
  }, [input, isStreaming, messages, mode, addXP, incrementStreak, updateSkillProgress, todayGrammarPct])

  const clearChat = () => {
    setMessages([INITIAL_MESSAGE])
  }

  const currentMode = MODES.find((m) => m.id === mode) ?? MODES[0]

  return (
    <div className="flex flex-col h-screen bg-gray-50">

      {/* ── Header ── */}
      <div className="flex items-center justify-between px-5 py-3.5
        border-b border-gray-100 bg-white shadow-sm flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-gradient-to-br from-b2-500 to-primary-600
            rounded-xl flex items-center justify-center shadow-sm">
            <Bot size={18} className="text-white" />
          </div>
          <div>
            <p className="font-bold text-gray-900 text-sm">EnglishPath AI Tutor</p>
            <p className="text-[11px] text-green-500 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 bg-green-500 rounded-full inline-block" />
              {MODEL}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          {/* Mode pill */}
          <div className="relative">
            <button
              onClick={() => setShowModes((v) => !v)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl
                bg-gray-100 hover:bg-gray-200 transition-colors text-xs font-semibold
                ${currentMode.color}`}
            >
              {currentMode.label}
              <ChevronDown size={12} />
            </button>
            {showModes && (
              <div className="absolute right-0 top-9 z-20 bg-white border border-gray-100
                rounded-xl shadow-lg py-1 min-w-[160px]">
                {MODES.map((m) => (
                  <button
                    key={m.id}
                    onClick={() => { setMode(m.id); setShowModes(false) }}
                    className={`w-full text-left px-4 py-2 text-xs font-medium hover:bg-gray-50
                      transition-colors ${m.color} ${mode === m.id ? 'bg-gray-50' : ''}`}
                  >
                    {m.label}
                  </button>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={clearChat}
            className="p-2 rounded-xl text-gray-400 hover:text-red-500
              hover:bg-red-50 transition-colors"
            title="Suhbatni tozalash"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {/* ── API key warning ── */}
      {API_KEY_MISSING && <ApiKeyBanner />}

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto px-5 py-5 space-y-5 scrollbar-hide">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} msg={msg} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* ── Quick prompts ── */}
      <div className="flex gap-2 px-5 pb-2 overflow-x-auto scrollbar-hide flex-shrink-0">
        {QUICK_PROMPTS.map((qp) => (
          <button
            key={qp.label}
            disabled={isStreaming}
            onClick={() => {
              setMode(qp.mode)
              setInput(qp.text)
              textareaRef.current?.focus()
            }}
            className="flex-shrink-0 px-3 py-1.5 bg-white border border-gray-200
              rounded-xl text-xs font-medium text-gray-600
              hover:border-primary-400 hover:text-primary-700 hover:bg-primary-50
              transition-all disabled:opacity-40"
          >
            {qp.label}
          </button>
        ))}
      </div>

      {/* ── Input ── */}
      <div className="px-5 pb-5 flex-shrink-0">
        <div className="flex gap-3 bg-white border border-gray-200
          rounded-2xl shadow-sm focus-within:border-primary-400
          focus-within:ring-2 focus-within:ring-primary-100 transition-all p-3">
          <textarea
            ref={textareaRef}
            className="flex-1 resize-none outline-none text-sm text-gray-800
              placeholder-gray-400 bg-transparent leading-relaxed min-h-[40px] max-h-[160px]"
            placeholder={
              API_KEY_MISSING
                ? 'API kalitini .env ga qo\'ying...'
                : mode === 'grammar-check'
                  ? 'Grammatikasini tekshirishim kerak bo\'lgan gapni yozing...'
                  : mode === 'writing-feedback'
                    ? 'Yozgan matnimni bu yerga joylashtiring...'
                    : mode === 'vocabulary'
                      ? 'So\'z yoki ibora haqida so\'rang...'
                      : 'Inglizcha yozing yoki savol bering...'
            }
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                send()
              }
            }}
            disabled={isStreaming || API_KEY_MISSING}
            rows={1}
          />
          <div className="flex flex-col items-end justify-between gap-1">
            <span className="text-[10px] text-gray-300 font-mono">
              {input.length > 0 ? `${input.length}` : ''}
            </span>
            <button
              onClick={() => send()}
              disabled={isStreaming || !input.trim() || API_KEY_MISSING}
              className="w-9 h-9 bg-primary-600 hover:bg-primary-700
                rounded-xl flex items-center justify-center text-white
                transition-all hover:scale-105 active:scale-95
                disabled:opacity-40 disabled:cursor-not-allowed disabled:scale-100
                shadow-sm"
            >
              {isStreaming
                ? <Zap size={16} className="animate-pulse" />
                : <Send size={16} />
              }
            </button>
          </div>
        </div>
        <p className="text-[10px] text-gray-400 text-center mt-1.5">
          Enter — yuborish &nbsp;·&nbsp; Shift+Enter — yangi qator
        </p>
      </div>
    </div>
  )
}
