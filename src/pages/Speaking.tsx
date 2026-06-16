import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Mic, MicOff, RotateCcw, ChevronLeft, Loader2, Volume2, MessageCircle, Sparkles, Square, Send, Brain } from 'lucide-react'
import { useI18n } from '../i18n'
import { SkeletonText } from '../components/ui/Skeleton'
import SpeakingHistory from '../components/speaking/SpeakingHistory'
import { CATEGORY_LABEL, CATEGORY_COLOR } from '@/data/speakingPrompts'
import { fetchSpeakingPrompts, getDailyPrompts, saveSpeakingResult, saveChatResult } from '@/services/speakingService'
import type { SpeakingPrompt } from '@/services/speakingService'
import { evaluateSpeech, startSpeakingChat, getSpeakingChatFeedback } from '@/lib/claude'
import { useStore } from '@/store/useStore'
import { supabase } from '@/lib/supabase'
import { useSpeechRecognition, isMobileDevice } from '@/hooks/useSpeechRecognition'
import { useAudioRecorder } from '@/hooks/useAudioRecorder'
import AudioPlayback from '@/components/speaking/AudioPlayback'
import { monitoring } from '../lib/monitoring'
import { analyzeAudio } from '@/hooks/useAudioAnalyser'

// ── Types ─────────────────────────────────────────────────────────────────────

type View        = 'select' | 'record' | 'result' | 'chat-conversation' | 'chat-feedback'
type RecordState = 'idle' | 'recording' | 'evaluating' | 'done'
type Mode        = 'prompt' | 'chat'

interface Scores { fluency: number; grammar: number; vocabulary: number }

interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
  timestamp: number
}

interface ChatTopic {
  id: string
  title: string
  category: SpeakingPrompt['category']
  prompt: string
}

function speakText(text: string) {
  if ('speechSynthesis' in window) {
    const u = new SpeechSynthesisUtterance(text)
    u.lang = 'en-US'; u.rate = 0.85
    speechSynthesis.speak(u)
  }
}

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
      <div className="mt-2 h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-700 ${color.replace('text-', 'bg-')}`}
          style={{ width: `${score * 10}%` }} />
      </div>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Speaking() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const location = useLocation()
  const fromSkills = location.state?.from === '/skills'
  const { addXP, updateSkillProgress, currentDay, currentLevel, toggleChecklistItem, todayChecklist } = useStore()
  const sr = useSpeechRecognition()
  const ar = useAudioRecorder()

  const [view,        setView]        = useState<View>('select')
  const [prompt,      setPrompt]      = useState<SpeakingPrompt | null>(null)
  const [recordState, setRecordState] = useState<RecordState>('idle')
  const [evaluation,  setEvaluation]  = useState('')
  const [scores,      setScores]      = useState<Scores>({ fluency: 0, grammar: 0, vocabulary: 0 })
  const [feedback,    setFeedback]    = useState('')
  const [timer,       setTimer]       = useState(0)
  const [prompts,     setPrompts]     = useState<SpeakingPrompt[]>([])
  const [promptsLoading, setPromptsLoading] = useState(true)

  // Chat mode state
  const [mode,           setMode]           = useState<Mode>('prompt')
  const [chatMessages,   setChatMessages]   = useState<ChatMessage[]>([])
  const [chatFeedback,   setChatFeedback]   = useState('')
  const [chatLoading,    setChatLoading]    = useState(false)
  const [chatTopic,      setChatTopic]      = useState<ChatTopic | null>(null)
  const [streamingText,  setStreamingText]  = useState('')
  const [srReady,        setSrReady]        = useState(false)
  const [turnCount,      setTurnCount]      = useState(0)

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const chatEndRef = useRef<HTMLDivElement | null>(null)

  // Fetch prompts from Supabase
  useEffect(() => {
    fetchSpeakingPrompts().then((data) => {
      setPrompts(data)
      setPromptsLoading(false)
    })
  }, [])

  const dailyPrompts = prompts.length > 0 ? getDailyPrompts(currentDay, prompts) : []

  // ── Recording ──────────────────────────────────────────────────────────────

  function startRecording() {
    sr.start()
    // Mobilда MediaRecorder STT bilan mikrofonni talashadi — faqat desktop'da yozamiz.
    if (!isMobileDevice()) ar.start()
    setRecordState('recording')
    setTimer(0)
    timerRef.current = setInterval(() => setTimer((t) => t + 1), 1000)
  }

  function stopRecording() {
    sr.stop()
    ar.stop()
    if (timerRef.current) clearInterval(timerRef.current)
    setRecordState('done')
  }

  function resetRecording() {
    sr.reset()
    ar.reset()
    if (timerRef.current) clearInterval(timerRef.current)
    setTimer(0)
    setRecordState('idle')
  }

  async function evaluate() {
    if (!prompt || !sr.transcript.trim()) return
    setRecordState('evaluating')
    setEvaluation('')
    let full = ''

    let acoustic
    if (ar.audioUrl) {
      try { acoustic = await analyzeAudio(ar.audioUrl, sr.transcript) } catch (e) { monitoring.captureMessage('analyzeAudio failed (non-critical): ' + (e instanceof Error ? e.message : String(e)), 'warn') }
    }

    evaluateSpeech(
      prompt.prompt,
      sr.transcript,
      currentLevel || 'B1',
      (token) => { full += token; setEvaluation(full) },
      (text) => {
        const s = parseScores(text)
        const f = parseFeedback(text)
        setScores(s)
        setFeedback(f)
        const avg = Math.round((s.fluency + s.grammar + s.vocabulary) / 3)
        addXP(avg * 3)
        updateSkillProgress('todaySpeakingPct', avg * 10)
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
      acoustic ? {
        speechRate: acoustic.fluency.speechRate,
        pauseCount: acoustic.fluency.pauseCount,
        avgPauseDuration: acoustic.fluency.avgPauseDuration,
        totalPauseRatio: acoustic.fluency.totalPauseRatio,
        pitchMean: acoustic.pitchMean,
        pitchStddev: acoustic.pitchStddev,
      } : undefined,
    )
  }

  // ── Chat handlers ────────────────────────────────────────────────────────────

  function startChat(topic: ChatTopic) {
    setChatTopic(topic)
    setChatMessages([])
    setChatFeedback('')
    setStreamingText('')
    setTurnCount(0)
    setView('chat-conversation')
    setChatLoading(true)

    // Stop any existing speech
    if ('speechSynthesis' in window) speechSynthesis.cancel()

    // Start the conversation with Claude
    startSpeakingChat(
      topic.prompt,
      currentLevel || 'B1',
      [],
      (token) => setStreamingText((prev) => prev + token),
      (full) => {
        setChatMessages((prev) => [...prev, { role: 'assistant', content: full, timestamp: Date.now() }])
        setStreamingText('')
        setChatLoading(false)
        setSrReady(true)
        // Auto-speak Claude's first message
        speakText(full)
      },
      () => { setChatLoading(false); setSrReady(true) }
    )
  }

  function sendChatMessage() {
    const text = sr.transcript.trim()
    if (!text || chatLoading) return

    // Add user message
    const userMsg: ChatMessage = { role: 'user', content: text, timestamp: Date.now() }
    const updatedHistory = [...chatMessages, userMsg]
    setChatMessages(updatedHistory)
    setTurnCount((t) => t + 1)
    setSrReady(false)
    setStreamingText('')

    // Reset speech recognition for next turn
    sr.reset()

    // Stop any existing speech
    if ('speechSynthesis' in window) speechSynthesis.cancel()

    // Get Claude's response
    setChatLoading(true)
    startSpeakingChat(
      chatTopic?.prompt || '',
      currentLevel || 'B1',
      updatedHistory.map((m) => ({ role: m.role, content: m.content })),
      (token) => setStreamingText((prev) => prev + token),
      (full) => {
        setChatMessages((prev) => [...prev, { role: 'assistant', content: full, timestamp: Date.now() }])
        setStreamingText('')
        setChatLoading(false)
        setSrReady(true)
        speakText(full)
      },
      () => { setChatLoading(false); setSrReady(true) }
    )
  }

  async function endChat() {
    setChatLoading(true)
    setSrReady(false)
    if ('speechSynthesis' in window) speechSynthesis.cancel()
    sr.reset()

    // If no messages were exchanged, just go back without awarding anything
    if (turnCount < 1 && chatMessages.length === 0) {
      setChatLoading(false)
      setView('select')
      return
    }

    // Calculate XP based on turn count
    const userTurns = turnCount
    const xpEarned = Math.max(5, Math.min(30, userTurns * 3))
    const estimatedScore = Math.max(5, Math.min(10, Math.round(userTurns * 0.7 + 3)))
    const progressPct = Math.min(100, Math.max(30, userTurns * 10))

    const feedback = await getSpeakingChatFeedback(
      currentLevel || 'B1',
      [...chatMessages, ...(streamingText ? [{ role: 'assistant' as const, content: streamingText }] : [])],
    )
    setChatFeedback(feedback)

    // Award XP and update progress
    addXP(xpEarned)
    updateSkillProgress('todaySpeakingPct', progressPct)
    if (!todayChecklist.speaking) {
      toggleChecklistItem('speaking')
    }

    // Save to Supabase
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user.id && chatTopic && chatTopic.id) {
        saveChatResult({
          userId:     session.user.id,
          promptId:   `chat_${chatTopic.id}`,
          promptText: chatTopic.prompt,
          turnCount:  userTurns,
          xpEarned,
          feedback,
          userScore:  estimatedScore,
        })
      }
    })

    setChatLoading(false)
    setView('chat-feedback')
  }

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatMessages, streamingText])

  // ── SELECT view ───────────────────────────────────────────────────────────

  if (view === 'select') {
    return (
      <div className="p-3 sm:p-6 max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-4 sm:mb-6">
          {fromSkills && (
            <button onClick={() => navigate('/skills')} className="btn-ghost p-2 rounded-xl -ml-2" aria-label={t('common.backToSkills')}>
              <ChevronLeft size={18} />
            </button>
          )}
          <div className="w-10 h-10 bg-b2-100 rounded-xl flex items-center justify-center">
            <Mic size={20} className="text-b2-600" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white">{t('speaking.title')}</h1>
            <p className="text-xs text-gray-500">{t('speaking.subtitle')}</p>
          </div>
        </div>

        {/* AI Suhbat Hamrohi — roleplay banner */}
        <button
          onClick={() => navigate('/conversation')}
          className="w-full mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white text-left flex items-center gap-3 shadow-lg active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Sparkles size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-sm flex items-center gap-1.5">{t('speaking.bannerRoleplay')} <span className="text-[11px] bg-white/25 px-1.5 py-0.5 rounded-full font-bold">{t('speaking.bannerNew')}</span></p>
            <p className="text-[11px] text-white/85">{t('speaking.bannerRoleplayDesc')}</p>
          </div>
          <ChevronLeft size={18} className="rotate-180 shrink-0 text-white/70" />
        </button>

        {/* AI Talaffuz Murabbiysi banner */}
        <button
          onClick={() => navigate('/pronunciation')}
          className="w-full mb-4 p-3.5 rounded-2xl bg-gradient-to-r from-rose-500 to-pink-600 text-white text-left flex items-center gap-3 shadow-lg active:scale-[0.98] transition-transform"
        >
          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Mic size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-black text-sm flex items-center gap-1.5">{t('speaking.bannerPronunciation')} <span className="text-[11px] bg-white/25 px-1.5 py-0.5 rounded-full font-bold">{t('speaking.bannerNew')}</span></p>
            <p className="text-[11px] text-white/85">{t('speaking.bannerPronunciationDesc')}</p>
          </div>
          <ChevronLeft size={18} className="rotate-180 shrink-0 text-white/70" />
        </button>

        {/* Mode switcher */}
        <div className="flex bg-gray-100 dark:bg-gray-800 rounded-xl p-1 mb-4">
          <button
            onClick={() => setMode('prompt')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
              mode === 'prompt'
                ? 'bg-white dark:bg-gray-700 text-b2-700 dark:text-b2-400 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Mic size={14} className="inline mr-1" /> {t('speaking.modePrompt')}
          </button>
          <button
            onClick={() => setMode('chat')}
            className={`flex-1 py-2 text-xs font-semibold rounded-lg transition-all duration-200 ${
              mode === 'chat'
                ? 'bg-white text-b2-700 shadow-sm'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <MessageCircle size={14} className="inline mr-1" /> {t('speaking.modeChat')}
          </button>
        </div>

        {sr.permissionError && (
          <div className="card bg-amber-50 border-amber-100 mb-4">
            <p className="text-sm text-amber-700 font-medium flex items-center gap-2">
              <MicOff size={16} className="text-amber-500 shrink-0" />
              {t('speaking.micPermissionDenied')}
            </p>
            <button
              onClick={() => { sr.reset(); sr.start() }}
              className="mt-2 text-xs font-semibold text-amber-800 bg-amber-200/60 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <RotateCcw size={12} className="inline mr-1" />
              {t('speaking.micRetry')}
            </button>
          </div>
        )}
        {!sr.isSupported && (
          <div className="card bg-red-50 border-red-100 mb-4">
            <p className="text-sm text-red-700 font-medium">
              {t('speaking.browserWarn')}
            </p>
          </div>
        )}

        {/* ── Prompt Mode ────────────────────────────────────────────────── */}
        {mode === 'prompt' && (
          <>
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {t('speaking.todayPrompts', { day: String(currentDay) })}
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
                        <span className={`badge text-[11px] ${CATEGORY_COLOR[p.category]}`}>
                          {CATEGORY_LABEL[p.category]}
                        </span>
                        <span className="text-xs text-gray-400">{Math.floor(p.timeSeconds / 60)}:{String(p.timeSeconds % 60).padStart(2, '0')} {t('common.minutes')}</span>
                      </div>
                      <p className="text-sm text-gray-800 dark:text-gray-200 leading-snug">{p.prompt}</p>
                      <div className="flex gap-1 mt-2">
                        {p.tips.slice(0, 2).map((tip, i) => (
                          <span key={i} className="text-[11px] bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400 px-2 py-0.5 rounded-full">
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

            <details className="card">
              <summary className="cursor-pointer text-sm font-semibold text-gray-700 select-none">              {t('speaking.allPrompts', { count: String(prompts.length) })}
            </summary>
              {promptsLoading ? (
                <div className="text-gray-400 animate-pulse text-center py-4 text-sm">{t('speaking.loadingPrompts')}</div>
              ) : (
                <div className="space-y-0.5 mt-2">
                  {prompts.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => { setPrompt(p); resetRecording(); setView('record') }}
                      className="w-full text-left text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 py-1.5 border-b border-gray-50 dark:border-gray-800 last:border-0 flex items-center gap-2"
                    >
                      <span className={`badge text-[11px] flex-shrink-0 ${CATEGORY_COLOR[p.category]}`}>
                        {CATEGORY_LABEL[p.category]}
                      </span>
                      <span className="line-clamp-1">{p.prompt}</span>
                    </button>
                  ))}
                </div>
              )}
            </details>
          </>
        )}

        {/* ── Chat Mode ──────────────────────────────────────────────────── */}
        {mode === 'chat' && (
          <>
            <div className="card bg-gradient-to-br from-primary-50 to-primary-100/50 border-primary-100 mb-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 bg-primary-200 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MessageCircle size={18} className="text-primary-700" />
                </div>
                <div>
                  <p className="text-sm font-bold text-primary-800">{t('speaking.chatDescription')}</p>
                  <p className="text-xs text-primary-600 mt-0.5">
                    {t('speaking.chatDescriptionDetail')}
                  </p>
                </div>
              </div>
            </div>

            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
              {t('speaking.chatTopics')}
            </p>
            <div className="space-y-2 mb-6">
              {prompts.map((p) => {
                const topic: ChatTopic = {
                  id: p.id,
                  title: p.prompt.slice(0, 80) + (p.prompt.length > 80 ? '...' : ''),
                  category: p.category,
                  prompt: p.prompt,
                }
                return (
                  <button
                    key={p.id}
                    onClick={() => startChat(topic)}
                    className="w-full card text-left hover:shadow-card-hover hover:-translate-y-0.5 transition-all duration-200 cursor-pointer"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5">
                          <span className={`badge text-[11px] ${CATEGORY_COLOR[p.category]}`}>
                            {CATEGORY_LABEL[p.category]}
                          </span>
                          <span className="text-xs text-gray-400">{p.level}</span>
                        </div>
                        <p className="text-sm text-gray-800 dark:text-gray-200 leading-snug line-clamp-2">{p.prompt}</p>
                      </div>
                      <MessageCircle size={16} className="text-primary-400 flex-shrink-0 mt-1" />
                    </div>
                  </button>
                )
              })}
            </div>
          </>
        )}
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
          <h2 className="font-bold text-gray-900 dark:text-white">{t('speaking.resultTitle')}</h2>
        </div>

        {/* Overall */}
        <div className="card bg-gradient-to-r from-b2-50 to-primary-50 border-b2-100 text-center mb-4">
          <p className="text-xs text-gray-500 mb-1">{t('speaking.overallScore')}</p>
          <p className="text-4xl font-bold text-b2-600">{avg}<span className="text-xl font-normal text-gray-400">/10</span></p>
          <p className="text-xs text-gray-500 mt-1">{t('speaking.xpEarned', { xp: String(avg * 3) })}</p>
        </div>

        {/* Score cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4">
          <ScoreCard label={t('speaking.scoreFluency')}    score={scores.fluency}    color="text-orange-600" />
          <ScoreCard label={t('speaking.scoreGrammar')}    score={scores.grammar}    color="text-green-600"  />
          <ScoreCard label={t('speaking.scoreVocabulary')} score={scores.vocabulary} color="text-b2-600"     />
        </div>

        {/* WPM metric */}
        {timer > 0 && (
          <div className="card bg-gray-50 dark:bg-gray-800/50 mb-4">
            <p className="text-xs font-semibold text-gray-500 mb-1">{t('speaking.speechRate')}</p>
            <p className="text-sm font-bold text-gray-800 dark:text-gray-200">
              {Math.round(sr.transcript.trim().split(/\s+/).filter(Boolean).length / (timer / 60))} {t('speaking.wpmLabel')}
            </p>
            <p className="text-[11px] text-gray-400 mt-0.5">
              {Math.round(timer / 60)}:{String(timer % 60).padStart(2, '0')} {t('common.minutes')} · {sr.transcript.trim().split(/\s+/).filter(Boolean).length} {t('common.words')}
            </p>
          </div>
        )}

        {/* Feedback */}
        {feedback && (
          <div className="card bg-primary-50 border-primary-100 mb-4">
            <p className="text-xs font-semibold text-primary-700 mb-1">{t('speaking.feedback')}</p>
            <p className="text-sm text-gray-700 leading-relaxed">{feedback}</p>
          </div>
        )}

        {/* Audio playback */}
        {ar.audioUrl && (
          <div className="mb-4">
            <AudioPlayback audioUrl={ar.audioUrl} label={t('speaking.yourAnswer')} color="text-b2-600" />
          </div>
        )}

        {/* Transcript */}
        <div className="card mb-4">
          <p className="text-xs font-semibold text-gray-500 mb-1">{t('speaking.yourAnswer')}</p>
          <p className="text-sm text-gray-700 italic leading-relaxed">"{sr.transcript}"</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => { resetRecording(); setEvaluation(''); setView('record') }}
            className="btn-secondary flex-1 text-sm flex items-center justify-center gap-1"
          >
            <RotateCcw size={14} /> {t('speaking.retryButton')}
          </button>
          <button
            onClick={() => setView('select')}
            className="btn-primary flex-1 text-sm"
          >
            {t('speaking.nextPromptButton')}
          </button>
        </div>

        {/* Speaking History */}
        <div className="mt-6">
          <SpeakingHistory />
        </div>
      </div>
    )
  }

  // ── CHAT CONVERSATION view ─────────────────────────────────────────────────

  if (view === 'chat-conversation') {
    const canSend = sr.transcript.trim().length > 0 && !chatLoading && srReady

    return (
      <div className="p-3 sm:p-6 max-w-2xl mx-auto flex flex-col" style={{ height: 'calc(var(--vh, 1vh) * 100 - 8rem)' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-3 flex-shrink-0">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setView('select'); if ('speechSynthesis' in window) speechSynthesis.cancel(); sr.reset() }}
              className="btn-ghost p-2 rounded-xl"
            >
              <ChevronLeft size={18} />
            </button>
            <div>
              <h2 className="font-bold text-sm text-gray-900 dark:text-white">{t('speaking.chatDescription')}</h2>
              {chatTopic && (
                <span className={`badge text-[11px] ${CATEGORY_COLOR[chatTopic.category]}`}>
                  {CATEGORY_LABEL[chatTopic.category]}
                </span>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[11px] text-gray-400">{t('speaking.chatTurn', { count: String(turnCount) })}</span>
            <button
              onClick={endChat}
              disabled={chatLoading}
              className="btn-ghost text-xs text-red-500 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-lg font-medium disabled:opacity-40"
            >
              <Square size={12} className="inline mr-1" /> {t('speaking.chatEnd')}
            </button>
          </div>
        </div>

        {/* Topic card */}
        {chatTopic && (
          <div className="card bg-b2-50 border-b2-100 mb-3 flex-shrink-0">
            <div className="flex items-start gap-2">
              <Brain size={16} className="text-b2-500 flex-shrink-0 mt-0.5" />
              <p className="text-xs text-gray-700 leading-relaxed">{chatTopic.prompt}</p>
            </div>
          </div>
        )}

        {/* Messages area */}
        <div className="flex-1 overflow-y-auto space-y-3 mb-3 px-0.5 scroll-smooth mobile-safe-bottom">
          {chatMessages.length === 0 && !chatLoading && (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-14 h-14 bg-primary-100 rounded-2xl flex items-center justify-center mb-3 animate-pulse">
                <MessageCircle size={28} className="text-primary-500" />
              </div>
              <p className="text-sm font-medium text-gray-700">{t('speaking.chatWaiting')}</p>
              <p className="text-xs text-gray-400 mt-1">{t('speaking.chatPleaseWait')}</p>
            </div>
          )}

          {chatMessages.map((msg) => (
            <div
              key={msg.timestamp}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[85%] rounded-2xl px-4 py-2.5 ${
                  msg.role === 'user'
                    ? 'bg-b2-600 text-white rounded-br-md'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-md'
                }`}
              >
                {msg.role === 'assistant' && (
                  <div className="flex items-center gap-1.5 mb-1">
                    <Brain size={12} className="text-primary-500" />
                    <span className="text-[11px] font-semibold text-primary-600">{t('speaking.chatClaude')}</span>
                  </div>
                )}
                <p className="text-sm leading-relaxed">{msg.content}</p>
                <p className={`text-[11px] mt-1 ${msg.role === 'user' ? 'text-white/60' : 'text-gray-400'}`}>
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </p>
              </div>
            </div>
          ))}

          {/* Streaming message */}
          {chatLoading && streamingText && (
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-2xl px-4 py-2.5 bg-gray-100 text-gray-800 rounded-bl-md">
                <div className="flex items-center gap-1.5 mb-1">
                  <Brain size={12} className="text-primary-500" />
                  <span className="text-[11px] font-semibold text-primary-600">Claude AI</span>
                </div>
                <p className="text-sm leading-relaxed">
                  {streamingText}
                  <span className="inline-block w-1.5 h-4 bg-primary-400 ml-0.5 animate-pulse align-middle" />
                </p>
              </div>
            </div>
          )}

          {/* Loading indicator (no text yet) */}
          {chatLoading && !streamingText && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-2xl rounded-bl-md px-4 py-3">
                <div className="flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-gray-400 dark:bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={chatEndRef} />
        </div>

        {/* Input area */}
        <div className="flex-shrink-0">
          {/* Speech recognition transcript */}
          {sr.isRecording && (
            <div className="card bg-b2-50 border-b2-100 mb-2">
              <div className="flex items-start gap-2">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-1.5 animate-pulse flex-shrink-0" />
                <p className="text-sm text-gray-700 leading-relaxed">
                  {sr.transcript}
                  {sr.interim && <span className="text-gray-400">{sr.interim}</span>}
                </p>
              </div>
            </div>
          )}

          {/* Last sent transcript preview */}
          {!sr.isRecording && sr.transcript.trim() && (
            <div className="card bg-gray-50 dark:bg-gray-800/50 border-gray-100 dark:border-gray-700 mb-2">
              <p className="text-xs text-gray-700 leading-relaxed">{sr.transcript}</p>
            </div>
          )}

          {/* Control buttons */}
          <div className="flex items-center gap-2">
            {sr.permissionError && !sr.isRecording && (
              <div className="text-center w-full">
                <p className="text-xs text-amber-600 font-medium">
                  {t('speaking.micPermissionDenied')}
                </p>
                <button
                  onClick={() => { sr.reset(); sr.start() }}
                  className="mt-1.5 text-xs font-semibold text-amber-700 bg-amber-100 hover:bg-amber-200 px-2.5 py-1 rounded-lg transition-colors"
                >
                  <RotateCcw size={11} className="inline mr-1" />
                  {t('speaking.micRetry')}
                </button>
              </div>
            )}
            {!sr.isRecording ? (
              <button
                onClick={() => sr.start()}
                disabled={!sr.isSupported || chatLoading}
                className="btn-primary flex-1 text-sm flex items-center justify-center gap-2 py-3 disabled:opacity-40"
              >
                <Mic size={18} /> {t('speaking.chatMicButton')}
              </button>
            ) : (
              <>
                <button
                  onClick={() => sr.stop()}
                  className="btn-secondary flex-1 text-sm flex items-center justify-center gap-2 py-3"
                >
                  <MicOff size={18} className="text-red-500" /> {t('speaking.chatStopButton')}
                </button>
              </>
            )}

            {!sr.isRecording && sr.transcript.trim() && (
              <button
                onClick={sendChatMessage}
                disabled={!canSend}
                className="btn-primary text-sm flex items-center justify-center gap-1.5 py-3 px-5 disabled:opacity-40"
              >
                <Send size={16} /> {t('speaking.chatSendButton')}
              </button>
            )}

            {!sr.isRecording && !sr.transcript.trim() && !chatLoading && (
              <button
                onClick={() => sr.reset()}
                className="btn-ghost p-3 rounded-xl text-gray-400 hover:text-gray-600"
                title={t('common.reset')}
              >
                <RotateCcw size={16} />
              </button>
            )}
          </div>

          {/* Tips */}
          <div className="mt-2 text-center">
            {srReady && !chatLoading && (
              <p className="text-[11px] text-gray-400">
                {t('speaking.chatInputTip')}
              </p>
            )}
            {chatLoading && (
              <p className="text-[11px] text-primary-500 animate-pulse">{t('speaking.chatClaudeLoading')}</p>
            )}
          </div>
        </div>
      </div>
    )
  }

  // ── CHAT FEEDBACK view ─────────────────────────────────────────────────────

  if (view === 'chat-feedback') {
    const xpEarned = Math.max(5, Math.min(30, turnCount * 3))
    const progressPct = Math.min(100, Math.max(30, turnCount * 10))

    return (
      <div className="p-3 sm:p-6 max-w-lg mx-auto">
        <div className="flex items-center gap-3 mb-5">
          <button onClick={() => setView('select')} className="btn-ghost p-2 rounded-xl">
            <ChevronLeft size={18} />
          </button>
          <h2 className="font-bold text-gray-900">{t('speaking.chatFeedbackTitle')}</h2>
        </div>

        {/* Stats */}
        <div className="card bg-gradient-to-r from-primary-50 to-b2-50 border-primary-100 text-center mb-4">
          <div className="w-12 h-12 bg-primary-200 rounded-2xl flex items-center justify-center mx-auto mb-2">
            <Sparkles size={24} className="text-primary-700" />
          </div>
          <p className="text-lg font-bold text-gray-800 dark:text-gray-200">{t('speaking.chatCompleted')}</p>
          <p className="text-xs text-gray-500 mt-1">
            {t('speaking.chatFeedbackTurnCount', { count: String(turnCount) })} · {chatTopic?.prompt.slice(0, 60)}...
          </p>
        </div>

        {/* XP & Progress */}
        <div className="grid grid-cols-2 gap-3 mb-4">
          <div className="card text-center py-4">
            <p className="text-2xl font-bold text-b2-600">+{xpEarned}</p>
            <p className="text-xs text-gray-500 mt-0.5">{t('speaking.chatXPEarned')}</p>
          </div>
          <div className="card text-center py-4">
            <p className="text-2xl font-bold text-green-600">
              {progressPct}%
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{t('speaking.chatProgressLabel')}</p>
          </div>
        </div>

        {/* Feedback */}
        {chatFeedback ? (
          <div className="card bg-primary-50 border-primary-100 mb-4">
            <p className="text-xs font-semibold text-primary-700 mb-2">{t('speaking.feedback')}</p>
            <pre className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap font-sans">
              {chatFeedback}
            </pre>
          </div>
        ) : (
          <div className="card bg-gray-50 text-center py-6 mb-4">
            <p className="text-sm text-gray-500 mb-3">{t('speaking.chatFeedbackLoading')}</p>
            <SkeletonText lines={3} />
          </div>
        )}

        {/* Checklist status */}
        <div className="card mb-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-600">{t('speaking.chatChecklistLabel')}</span>
            <span className={`text-xs font-bold ${todayChecklist.speaking ? 'text-green-600' : 'text-gray-400'}`}>
              {todayChecklist.speaking ? t('speaking.chatCompletedStatus') : t('speaking.chatNotCompletedStatus')}
            </span>
          </div>
        </div>

        {/* Conversation transcript */}
        <details className="card mb-4">
          <summary className="cursor-pointer text-sm font-semibold text-gray-700 select-none">
            {t('speaking.chatTranscript', { count: String(chatMessages.length) })}
          </summary>
          <div className="space-y-2 mt-3">
            {chatMessages.map((msg) => (
              <div key={msg.timestamp} className={`p-2 rounded-lg ${msg.role === 'user' ? 'bg-b2-50' : 'bg-gray-50'}`}>
                <p className={`text-[11px] font-semibold mb-0.5 ${msg.role === 'user' ? 'text-b2-600' : 'text-gray-500'}`}>
                  {msg.role === 'user' ? t('speaking.chatYou') : t('speaking.chatClaude')}
                </p>
                <p className="text-xs text-gray-700 leading-relaxed">{msg.content}</p>
              </div>
            ))}
          </div>
        </details>

        <button
          onClick={() => setView('select')}
          className="btn-primary w-full text-sm"
        >
          {t('speaking.chatBackButton')}
        </button>
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
          <span className={`badge text-[11px] ${CATEGORY_COLOR[prompt.category]}`}>
            {CATEGORY_LABEL[prompt.category]}
          </span>
        </div>
      </div>

      {/* Prompt */}
      <div className="card bg-b2-50 border-b2-100 mb-5">
        <div className="flex items-start gap-2">
          <button
            onClick={() => speakText(prompt.prompt)}
            className="flex-shrink-0 mt-0.5 p-1 rounded-lg hover:bg-b2-100 transition-colors"
            title={t('speaking.speakTooltip')}
          >
            <Volume2 size={16} className="text-b2-500" />
          </button>
          <p className="text-sm text-gray-800 leading-relaxed font-medium">{prompt.prompt}</p>
        </div>
      </div>

      {/* Tips */}
      <div className="mb-5">
        <p className="text-xs font-semibold text-gray-500 mb-1.5">{t('speaking.tipsHeader')}</p>
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
        {sr.permissionError && !isRecording && (
          <div className="card bg-amber-50 border-amber-100 w-full text-center">
            <p className="text-xs text-amber-700 font-medium flex items-center justify-center gap-1.5">
              <MicOff size={14} className="text-amber-500" />
              {t('speaking.micPermissionDenied')}
            </p>
            <button
              onClick={() => { sr.reset(); sr.start() }}
              className="mt-2 text-xs font-semibold text-amber-800 bg-amber-200/60 hover:bg-amber-200 px-3 py-1.5 rounded-lg transition-colors"
            >
              <RotateCcw size={12} className="inline mr-1" />
              {t('speaking.micRetry')}
            </button>
          </div>
        )}
        <button
          onClick={isRecording ? stopRecording : startRecording}
          disabled={!sr.isSupported || isEvaluating}
          aria-pressed={isRecording}
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
            <p className="text-sm font-mono text-red-500 font-semibold" aria-live="polite">
              {t('speaking.recordingTimer', { mins: String(mins), secs: String(secs).padStart(2, '0') })}
            </p>
          )}
          {!isRecording && !isDone && !sr.permissionError && (
            <p className="text-sm text-gray-400">{t('speaking.recordInstruction')}</p>
          )}
          {isDone && (
            <p className="text-sm text-green-600 font-medium">{t('speaking.recordDone', { duration: `${Math.floor(timer / 60)}:${String(timer % 60).padStart(2, '0')}` })}</p>
          )}
        </div>
      </div>

      {/* Transcript display */}
      {(sr.transcript || sr.interim) && (
        <div className="card bg-gray-50 border-gray-100">
          <p className="text-sm text-gray-700 leading-relaxed">
            {sr.transcript}
            {sr.interim && <span className="text-gray-400">{sr.interim}</span>}
          </p>
        </div>
      )}

      {/* Audio playback — qayta tinglash */}
      {isDone && ar.audioUrl && (
        <AudioPlayback audioUrl={ar.audioUrl} label="Sizning javobingiz" color="text-b2-600" />
      )}

      {/* Actions */}
      <div className="flex gap-2">
        {(isDone || isRecording) && (
          <button
            onClick={resetRecording}
            className="btn-secondary flex-1 text-sm flex items-center justify-center gap-1"
          >
            <RotateCcw size={14} /> {t('speaking.recordRewind')}
          </button>
        )}
        {isDone && sr.transcript.trim() && (
          <button
            onClick={evaluate}
            disabled={isEvaluating}
            className="btn-primary flex-1 text-sm flex items-center justify-center gap-1.5"
          >
            {isEvaluating
              ? <><Loader2 size={14} className="animate-spin" /> {t('speaking.evaluating')}</>
              : t('speaking.recordEvaluate')
            }
          </button>
        )}
      </div>

      {/* Evaluation streaming */}
      {isEvaluating && evaluation && (
        <div className="mt-4 card bg-primary-50 border-primary-100">
          <p className="text-xs font-semibold text-primary-700 mb-1">{t('speaking.evaluating')}</p>
          <pre className="text-xs text-gray-700 whitespace-pre-wrap font-sans leading-relaxed">
            {evaluation}
            <span className="inline-block w-1 h-3 bg-primary-400 ml-0.5 animate-pulse align-middle" />
          </pre>
        </div>
      )}
    </div>
  )
}
