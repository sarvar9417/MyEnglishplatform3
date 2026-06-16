// ═══════════════════════════════════════════════════════════════════════════
// RoleplayDuoPlayer — Tandem AI Roleplay Duo: 2 do'st + AI hakam
// ═══════════════════════════════════════════════════════════════════════════

import { useState, useEffect, useRef } from 'react'
import {
  ArrowLeft, Send, Sparkles, Trophy, Volume2, Lightbulb, Mic, Square,
  Loader2, Users, AlertCircle, BookOpen,
} from 'lucide-react'
import { useStore } from '../../store/useStore'
import { monitoring } from '../../lib/monitoring'
import { supabase } from '../../lib/supabase'
import { CONVERSATION_SCENARIOS, type ConversationScenario } from '../../data/conversationScenarios'
import { startScenarioConversation } from '../../lib/claude'
import { speak } from '../../lib/tts'
import { feelLevelUp, feelTap } from '../../lib/gameFeel'
import { useSpeechRecognition } from '../../hooks/useSpeechRecognition'
import { useToastStore } from '../../utils/toastStore'
import {
  getRoleplaySession,
  saveUserAMessages,
  saveUserBMessages,
  updateSessionStatus,
  updateSessionScenario,
  evaluateDuoRoleplay,
  notifyUserBRoleplayPending,
} from '../../services/roleplayDuoService'
import type { RoleplaySession, RoleplayEvaluation } from '../../types/tandem'

// ─── Types ────────────────────────────────────────────────────────────────────

interface Props {
  session: RoleplaySession
  currentUserId: string
  currentUserName: string
  isCreator: boolean        // User A?
  onBack: () => void
  onComplete: () => void
}

type View = 'scenario-select' | 'playing' | 'waiting' | 'waiting_partner' | 'loading-report' | 'results'

interface Msg { role: 'user' | 'assistant'; content: string }

const CATEGORY_LABEL: Record<ConversationScenario['category'], string> = {
  kundalik: 'Kundalik', sayohat: 'Sayohat', ish: 'Ish', ijtimoiy: 'Ijtimoiy',
}
const CATEGORY_COLOR: Record<ConversationScenario['category'], string> = {
  kundalik: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300',
  sayohat:  'bg-sky-100 text-sky-700 dark:bg-sky-900/40 dark:text-sky-300',
  ish:      'bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300',
  ijtimoiy: 'bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300',
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Evaluation Display
// ═══════════════════════════════════════════════════════════════════════════════

function EvalSection({
  label, evaluation, userName,
}: {
  label: string
  evaluation: RoleplayEvaluation
  userName: string
}) {
  const avgScore = Math.round((evaluation.fluency + evaluation.taskSuccess) / 2)
  return (
    <div className="card p-5 space-y-4 border-2 border-indigo-100 dark:border-indigo-900/50">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
          {userName.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="font-bold text-sm text-gray-900 dark:text-white">{label}</p>
          <p className="text-xs text-gray-500">{userName}</p>
        </div>
      </div>

      {/* Score */}
      <div className="text-center">
        <span className="text-4xl font-bold text-indigo-600 dark:text-indigo-400">{avgScore}</span>
        <span className="text-gray-400 text-sm">/10</span>
      </div>

      {/* Bars */}
      <div className="space-y-2">
        <Bar label="Ravonlik" value={evaluation.fluency} color="bg-blue-500" />
        <Bar label="Maqsad bajarilishi" value={evaluation.taskSuccess} color="bg-emerald-500" />
      </div>

      {/* Encouragement */}
      <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/30 text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
        {evaluation.encouragement}
      </div>

      {/* New Words */}
      {evaluation.newWords.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <BookOpen size={14} className="text-emerald-500" />
            <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300">Yangi so'zlar</h4>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {evaluation.newWords.map((w) => (
              <span key={w.word} className="text-xs px-2 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/30 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
                {w.word} — {w.meaning}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Mistakes */}
      {evaluation.mistakes.length > 0 && (
        <div className="space-y-1.5">
          <div className="flex items-center gap-2 mb-1">
            <AlertCircle size={14} className="text-rose-500" />
            <h4 className="text-xs font-bold text-gray-700 dark:text-gray-300">Tuzatishlar</h4>
          </div>
          {evaluation.mistakes.map((m, i) => (
            <div key={i} className="p-2 rounded-lg bg-rose-50 dark:bg-rose-950/30 text-xs space-y-0.5">
              <p className="text-rose-500 line-through">{m.wrong}</p>
              <p className="text-emerald-600 dark:text-emerald-400 font-semibold">{m.correct}</p>
              <p className="text-gray-500">💡 {m.tip}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

function Bar({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="flex justify-between text-xs mb-1">
        <span className="text-gray-500">{label}</span>
        <span className="font-bold text-gray-700 dark:text-gray-300">{value}/10</span>
      </div>
      <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${color} transition-all duration-700`}
          style={{ width: `${value * 10}%` }}
        />
      </div>
    </div>
  )
}

// ═══════════════════════════════════════════════════════════════════════════════
//  Main Component
// ═══════════════════════════════════════════════════════════════════════════════

export default function RoleplayDuoPlayer({ session, currentUserId, currentUserName, isCreator, onBack, onComplete }: Props) {
  const currentLevel = useStore(s => s.currentLevel)
  const level = (currentLevel || 'B1').replace('+', '')

  const [view, setView] = useState<View>('scenario-select')
  const [scenario, setScenario] = useState<ConversationScenario | null>(null)
  const [messages, setMessages] = useState<Msg[]>([])
  const [streaming, setStreaming] = useState('')
  const [loading, setLoading] = useState(false)
  const [input, setInput] = useState('')
  const [voiceOn, setVoiceOn] = useState(true)
  const [showHints, setShowHints] = useState(false)
  const [partnerName, setPartnerName] = useState('')
  const [myEval, setMyEval] = useState<RoleplayEvaluation | null>(null)
  const [partnerEval, setPartnerEval] = useState<RoleplayEvaluation | null>(null)
  const [xpEarned, setXpEarned] = useState(0)

  const sr = useSpeechRecognition()
  const scrollRef = useRef<HTMLDivElement>(null)
  const turnCount = messages.filter(m => m.role === 'user').length

  // ── Auto-scroll ──────────────────────────────────────────────────────────
  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' })
  }, [messages, streaming])

  // ── Voice input ──────────────────────────────────────────────────────────
  useEffect(() => {
    if (sr.isRecording) setInput((sr.transcript + ' ' + sr.interim).trim())
  }, [sr.transcript, sr.interim, sr.isRecording])

  // ── Init: Check session status ───────────────────────────────────────────
  useEffect(() => {
    const init = async () => {
      // Get partner name — tandem pairdagi boshqa foydalanuvchi
      const { data: pair } = await supabase
        .from('tandem_pairs')
        .select('user_a, user_b')
        .or(`user_a.eq.${currentUserId},user_b.eq.${currentUserId}`)
        .maybeSingle()

      if (pair) {
        const partnerId = pair.user_a === currentUserId ? pair.user_b : pair.user_a
        const { data: partnerData } = await supabase
          .from('users')
          .select('name')
          .eq('id', partnerId)
          .single()
        if (partnerData?.name) setPartnerName(partnerData.name)
      }

      // Agar session boshlangan bo'lsa, xabarlarni yuklash
      const fresh = await getRoleplaySession(session.id)
      if (!fresh) return

      // Scenario'ni topish
      const found = CONVERSATION_SCENARIOS.find(s => s.id === fresh.scenario_id)
      if (found) {
        setScenario(found)
      }

      if (isCreator) {
        // User A — davom etish yoki yangi boshlash
        if (fresh.user_a_messages.length > 0) {
          setMessages(fresh.user_a_messages)
          setView('playing')
        } else {
          // Scenario select ko'rsatamiz
        }
      } else {
        // User B — davom etish yoki boshlash
        if (fresh.user_b_messages.length > 0) {
          setMessages(fresh.user_b_messages)
          setView('playing')
        } else if (fresh.user_a_messages.length > 0) {
          // User A o'ynagan — User B boshlashi mumkin
          setView('playing')
        } else if (!found) {
          // Scenario hali tanlanmagan (scenario_id = 'pending') — User B kutaveradi
          setView('waiting_partner')
        }
      }

      // Agar tugagan bo'lsa, natijalarni ko'rsatish
      if (fresh.status === 'completed' && fresh.user_a_evaluation && fresh.user_b_evaluation) {
        if (isCreator) {
          setMyEval(fresh.user_a_evaluation)
          setPartnerEval(fresh.user_b_evaluation)
        } else {
          setMyEval(fresh.user_b_evaluation)
          setPartnerEval(fresh.user_a_evaluation)
        }
        setView('results')
      }
    }
    init()
  }, [session.id, currentUserId, isCreator])

  const toggleMic = () => {
    if (sr.isRecording) {
      sr.stop()
    } else {
      if ('speechSynthesis' in window) speechSynthesis.cancel()
      setInput('')
      sr.reset()
      sr.start()
    }
  }

  function sceneCtx(s: ConversationScenario) {
    return { aiRole: s.aiRole, userRole: s.userRole, opening: s.opening, title: s.title }
  }

  // ── Start scenario (User A selects) ────────────────────────────────────
  async function handleStartScenario(s: ConversationScenario) {
    feelTap()
    setScenario(s)
    setMessages([{ role: 'assistant' as const, content: s.opening }])
    setView('playing')
    setShowHints(false)

    // Session scenario_id va statusini yangilash
    await Promise.all([
      updateSessionScenario(session.id, s.id),
      updateSessionStatus(session.id, 'user_a_playing'),
    ])
    // Save opening message
    await saveUserAMessages(session.id, [{ role: 'assistant' as const, content: s.opening }])

    if (voiceOn) {
      speak(s.opening, { rate: 0.95 }).catch((e: unknown) => {
        monitoring.captureMessage('TTS speak (roleplay opening) failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
      })
    }
  }

  // ── User B starts playing ──────────────────────────────────────────────
  async function handleUserBStart() {
    if (!scenario) return
    await updateSessionStatus(session.id, 'user_b_playing')
    setMessages([{ role: 'assistant', content: scenario.opening }])
    setView('playing')
    setShowHints(false)
    await saveUserBMessages(session.id, [{ role: 'assistant', content: scenario.opening }])

    if (voiceOn) {
      speak(scenario.opening, { rate: 0.95 }).catch((e: unknown) => {
        monitoring.captureMessage('TTS speak (roleplay B opening) failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
      })
    }
  }

  // ── Send message ──────────────────────────────────────────────────────
  function send() {
    const text = input.trim()
    if (!text || loading || !scenario) return
    if (sr.isRecording) sr.stop()
    sr.reset()

    const history: Msg[] = [...messages, { role: 'user', content: text }]
    setMessages(history)
    setInput('')
    setStreaming('')
    setLoading(true)

    const chatHistory: { role: 'user' | 'assistant'; content: string }[] = history.map(m => ({ role: m.role as 'user' | 'assistant', content: m.content }))

    startScenarioConversation(
      sceneCtx(scenario), level,
      chatHistory,
      (token) => setStreaming(prev => prev + token),
      async (full) => {
        const newMsgs: Msg[] = [...history, { role: 'assistant', content: full }]
        setMessages(newMsgs)
        setStreaming('')
        setLoading(false)

        // Save to DB
        if (isCreator) {
          await saveUserAMessages(session.id, newMsgs)
        } else {
          await saveUserBMessages(session.id, newMsgs)
        }

        if (voiceOn) {
          speak(full, { rate: 0.95 }).catch((e: unknown) => {
            monitoring.captureMessage('TTS speak (roleplay AI response) failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
          })
        }
      },
      () => { setLoading(false); setStreaming('') },
    )
  }

  // ── Finish turn ────────────────────────────────────────────────────────
  async function finishTurn() {
    if (!scenario) return
    if (sr.isRecording) sr.stop()
    if ('speechSynthesis' in window) speechSynthesis.cancel()

    if (isCreator) {
      // User A tugatdi
      await updateSessionStatus(session.id, 'user_a_done')
      await notifyUserBRoleplayPending(session.id)
      setView('waiting')
      useToastStore.getState().toast(
        "✅ Sizning rolingiz tugadi! Do'stingizning navbati — u boshlaganida sizga bildirishnoma keladi.",
        'success', 6000,
      )
    } else {
      // User B tugatdi — baholashni boshlaymiz
      setView('loading-report')
      const result = await evaluateDuoRoleplay(session.id)
      if (result.success) {
        // Yangilangan sessionni olish
        const fresh = await getRoleplaySession(session.id)
        if (fresh && fresh.user_a_evaluation && fresh.user_b_evaluation) {
          if (isCreator) {
            setMyEval(fresh.user_a_evaluation)
            setPartnerEval(fresh.user_b_evaluation)
          } else {
            setMyEval(fresh.user_b_evaluation)
            setPartnerEval(fresh.user_a_evaluation)
          }

          const myAvg = isCreator
            ? Math.round((fresh.user_a_evaluation.fluency + fresh.user_a_evaluation.taskSuccess) / 2)
            : Math.round((fresh.user_b_evaluation.fluency + fresh.user_b_evaluation.taskSuccess) / 2)
          const xp = 10 + myAvg * 2
          setXpEarned(xp)
          useStore.getState().addXP(xp)
          feelLevelUp()
        }
        setView('results')
      } else {
        useToastStore.getState().toast('Baholashda xatolik', 'error')
        setView('playing')
      }
    }
  }

  // ── Render: Scenario Select ───────────────────────────────────────────
  if (view === 'scenario-select' && isCreator) {
    return (
      <div className="max-w-2xl mx-auto p-4 space-y-4">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 min-h-[44px] min-w-[44px] flex items-center justify-center">
            <ArrowLeft size={18} />
          </button>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <Users size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white">AI Roleplay Duo</h1>
            <p className="text-xs text-gray-500">Juftingiz bilan birga rol o'ynang</p>
          </div>
        </div>

        <div className="rounded-2xl p-3.5 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/20 text-xs text-purple-800 dark:text-purple-200 flex gap-2 border border-purple-200 dark:border-purple-800">
          <Lightbulb size={16} className="shrink-0 mt-0.5" />
          <span>Stsenariy tanlang. Siz avval o'ynaysiz, keyin juftingiz davom etadi. Oxirida AI ikkalangizni baholaydi!</span>
        </div>

        <div className="grid sm:grid-cols-2 gap-3">
          {CONVERSATION_SCENARIOS.map(s => (
            <button
              key={s.id}
              onClick={() => handleStartScenario(s)}
              className="text-left p-4 rounded-2xl bg-white dark:bg-gray-900 border border-gray-100 dark:border-gray-800 hover:border-purple-300 hover:shadow-md transition-all active:scale-[0.98]"
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-3xl">{s.emoji}</span>
                <div className="flex items-center gap-1.5">
                  <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded-full ${CATEGORY_COLOR[s.category]}`}>{CATEGORY_LABEL[s.category]}</span>
                  <span className="text-[11px] font-bold px-1.5 py-0.5 rounded-full bg-gray-100 dark:bg-gray-800 text-gray-500">{s.minLevel}+</span>
                </div>
              </div>
              <p className="font-bold text-sm text-gray-900 dark:text-white">{s.titleUz}</p>
              <p className="text-[11px] text-gray-500 mt-0.5 line-clamp-2">{s.goalUz}</p>
            </button>
          ))}
        </div>
      </div>
    )
  }

  // ── Render: Waiting for partner (scenario not selected yet) ────────────
  if (view === 'waiting_partner') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-yellow-100 to-amber-100 dark:from-yellow-900/30 dark:to-amber-900/30 flex items-center justify-center">
          <Users size={36} className="text-yellow-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">⏳ Juftingizni kutish...</h2>
        <p className="text-sm text-gray-500 max-w-md">
          <strong>{partnerName || 'Juftingiz'}</strong> hali stsenariy tanlamadi.
          U scenario tanlab, o'ynaganidan so'ng sizga bildirishnoma keladi.
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Loader2 size={14} className="animate-spin" />
          <span>Juftingizni kutish...</span>
        </div>
        <button onClick={onBack} className="btn-secondary mt-4 py-2.5 px-6 text-sm">
          Tandemga qaytish
        </button>
      </div>
    )
  }

  // ── Render: Waiting (after finishing turn) ────────────────────────────
  if (view === 'waiting') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center space-y-4">
        <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center">
          <Users size={36} className="text-purple-500" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Ajoyib! Sizning navbatingiz tugadi 🎉</h2>
        <p className="text-sm text-gray-500 max-w-md">
          Endi <strong>{partnerName || 'juftingiz'}</strong> ning navbati. U boshlaganida sizga bildirishnoma keladi va natijalarni ko'rishingiz mumkin bo'ladi.
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Loader2 size={14} className="animate-spin" />
          <span>Juftingizni kutish...</span>
        </div>
        <button onClick={onBack} className="btn-secondary mt-4 py-2.5 px-6 text-sm">
          Tandemga qaytish
        </button>
      </div>
    )
  }

  // ── Render: Loading Report ────────────────────────────────────────────
  if (view === 'loading-report') {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
        <div className="text-6xl mb-4 animate-bounce">🧠</div>
        <h2 className="text-lg font-bold text-gray-900 dark:text-white mb-1">Claude ikkalangizni tahlil qilyapti…</h2>
        <p className="text-sm text-gray-500">Ravonlik, yangi so'zlar va xatolar aniqlanmoqda</p>
      </div>
    )
  }

  // ── Render: Results ──────────────────────────────────────────────────
  if (view === 'results' && myEval && partnerEval) {
    return (
      <div className="max-w-2xl mx-auto p-4 space-y-4 animate-page-enter">
        <div className="text-center pt-2 space-y-2">
          <div className="text-5xl mb-1">🎭</div>
          <h1 className="text-xl font-black text-gray-900 dark:text-white">
            Roleplay Duo — yakunlandi!
          </h1>
          {xpEarned > 0 && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 font-bold text-sm">
              <Trophy size={15} /> +{xpEarned} XP
            </div>
          )}
          <p className="text-xs text-gray-400">AI ikkala o'yinchini baholadi</p>
        </div>

        {/* My evaluation */}
        <EvalSection
          label="Sizning natijangiz"
          evaluation={myEval}
          userName={currentUserName}
        />

        {/* Partner evaluation */}
        <EvalSection
          label="Juftingizning natijasi"
          evaluation={partnerEval}
          userName={partnerName || 'Juftingiz'}
        />

        {/* Comparison */}
        <div className="card p-4 bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 border border-amber-200 dark:border-amber-800/50">
          <h3 className="font-bold text-sm text-gray-900 dark:text-white mb-2 flex items-center gap-2">
            <Trophy size={16} className="text-amber-500" />
            Umumiy natija
          </h3>
          <div className="flex items-center justify-center gap-6 text-sm">
            <div className="text-center">
              <p className="text-xs text-gray-500">{currentUserName}</p>
              <p className="text-2xl font-bold text-amber-600">
                {Math.round((myEval.fluency + myEval.taskSuccess) / 2)}
              </p>
            </div>
            <span className="text-gray-300 font-bold text-lg">VS</span>
            <div className="text-center">
              <p className="text-xs text-gray-500">{partnerName || 'Juft'}</p>
              <p className="text-2xl font-bold text-purple-600">
                {Math.round((partnerEval.fluency + partnerEval.taskSuccess) / 2)}
              </p>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          <button onClick={onBack} className="btn-secondary flex-1 py-3 font-bold text-sm">
            Tandemga qaytish
          </button>
          <button onClick={onComplete} className="btn-primary flex-1 py-3 font-bold text-sm">
            Yakunlash
          </button>
        </div>
      </div>
    )
  }

  // ── Render: User B hasn't started yet ────────────────────────────────
  if (!isCreator && view === 'playing' && messages.length === 0 && scenario) {
    return (
      <div className="max-w-2xl mx-auto p-4 space-y-6 animate-fade-in">
        <div className="flex items-center gap-3">
          <button onClick={onBack} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 min-h-[44px] min-w-[44px] flex items-center justify-center">
            <ArrowLeft size={18} />
          </button>
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center">
            <Users size={22} className="text-white" />
          </div>
          <div>
            <h1 className="text-xl font-black text-gray-900 dark:text-white">{scenario.emoji} {scenario.titleUz}</h1>
            <p className="text-xs text-gray-500">Navbat sizda!</p>
          </div>
        </div>

        <div className="card p-6 space-y-4 text-center">
          <div className="text-6xl mb-2">{scenario.emoji}</div>
          <h2 className="text-lg font-bold text-gray-900 dark:text-white">Sizning navbatingiz!</h2>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            <strong>{partnerName || 'Juftingiz'}</strong> allaqachon o'ynadi. Endi sizning rolingizni o'ynash vaqti!
          </p>
          <div className="bg-purple-50 dark:bg-purple-950/30 rounded-xl p-4 text-left text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
            <p className="font-bold mb-1">🎯 Maqsad:</p>
            <p>{scenario.goalUz}</p>
            <p className="font-bold mt-3 mb-1">👤 Sizning rolingiz:</p>
            <p>{scenario.userRole}</p>
          </div>
          <button
            onClick={handleUserBStart}
            className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2"
          >
            <Sparkles size={18} />
            Boshlash!
          </button>
        </div>
      </div>
    )
  }

  // ── Render: Playing (chat) ────────────────────────────────────────────
  return (
    <div className="flex flex-col max-w-2xl mx-auto" style={{ height: 'calc(var(--vh, 1vh) * 100)' }}>
      {/* Header */}
      <div className="flex items-center gap-2 p-3 border-b border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950">
        <button
          onClick={async () => {
            if ('speechSynthesis' in window) speechSynthesis.cancel()
            if (sr.isRecording) sr.stop()
            sr.reset()

            // Save messages before leaving
            if (messages.length > 0 && scenario) {
              if (isCreator) {
                await saveUserAMessages(session.id, messages)
              } else {
                await saveUserBMessages(session.id, messages)
              }
            }
            onBack()
          }}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <ArrowLeft size={18} />
        </button>
        <span className="text-2xl">{scenario?.emoji}</span>
        <div className="flex-1 min-w-0">
          <p className="font-bold text-sm text-gray-900 dark:text-white truncate">
            {scenario?.titleUz}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {isCreator ? '✋ Siz 1-o\'yinchisiz' : '✋ Siz 2-o\'yinchisiz'}
            {' · '}
            {turnCount > 0 && `${turnCount} ta xabar`}
          </p>
        </div>
        <button
          onClick={() => setVoiceOn(v => !v)}
          className={`p-2 rounded-lg min-h-[44px] min-w-[44px] flex items-center justify-center ${
            voiceOn ? 'text-purple-500 bg-purple-50 dark:bg-purple-950/40' : 'text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
          }`}
        >
          <Volume2 size={18} />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] px-3.5 py-2 rounded-2xl text-sm ${
              m.role === 'user'
                ? 'bg-purple-500 text-white rounded-br-md'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-bl-md'
            }`}>
              {m.content}
            </div>
          </div>
        ))}
        {streaming && (
          <div className="flex justify-start">
            <div className="max-w-[80%] px-3.5 py-2 rounded-2xl rounded-bl-md text-sm bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
              {streaming}<span className="animate-pulse">▋</span>
            </div>
          </div>
        )}
        {loading && !streaming && (
          <div className="flex justify-start">
            <div className="px-3.5 py-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 flex gap-1">
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
              <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
            </div>
          </div>
        )}
      </div>

      {/* Hints */}
      {showHints && scenario && (
        <div className="px-3 pb-1 flex flex-wrap gap-1.5">
          {scenario.hints.map((h) => (
            <button
              key={h}
              onClick={() => { setInput(h); setShowHints(false) }}
              className="text-xs px-3 py-1.5 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-300 border border-purple-200 dark:border-purple-800"
            >
              {h}
            </button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="p-3 border-t border-gray-100 dark:border-gray-800 bg-white dark:bg-gray-950 space-y-2">
        <div className="flex items-center justify-between">
          <button
            onClick={() => setShowHints(v => !v)}
            className="text-xs text-purple-500 font-semibold flex items-center gap-1 min-h-[44px]"
          >
            <Lightbulb size={14} /> Yordam iboralari
          </button>
          {turnCount >= 2 && (
            <button
              onClick={finishTurn}
              className="text-xs text-gray-500 font-semibold underline min-h-[44px]"
            >
              {isCreator ? "Rolimni tugatish →" : "Yakunlash →"}
            </button>
          )}
        </div>

        {sr.isRecording && (
          <p className="text-xs text-rose-500 font-semibold flex items-center gap-1.5 animate-pulse">
            <span className="w-2 h-2 bg-rose-500 rounded-full" /> Tinglayapman… gapiring
          </p>
        )}

        <div className="flex items-center gap-2">
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') send() }}
            placeholder={sr.isRecording ? 'Gapiring…' : 'Yozing yoki 🎤 bosib gapiring…'}
            className="flex-1 px-3.5 py-2.5 rounded-xl bg-gray-100 dark:bg-gray-800 text-sm outline-none focus:ring-2 ring-purple-400"
          />
          {sr.isSupported && (
            <button
              onClick={toggleMic}
              disabled={loading}
              className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition active:scale-95 disabled:opacity-40 ${
                sr.isRecording ? 'bg-rose-500 text-white animate-pulse' : 'bg-gray-100 dark:bg-gray-800 text-purple-500'
              }`}
            >
              {sr.isRecording ? <Square size={16} /> : <Mic size={18} />}
            </button>
          )}
          <button
            onClick={send}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl bg-purple-500 text-white flex items-center justify-center disabled:opacity-40 active:scale-95 transition shrink-0"
          >
            <Send size={17} />
          </button>
        </div>
      </div>
    </div>
  )
}
