import { useState, useEffect, useCallback, useRef } from 'react'
import { supabase } from '../../lib/supabase'
import { monitoring } from '../../lib/monitoring'
import { useStore } from '../../store/useStore'
import { RealtimeChannel } from '@supabase/supabase-js'
import { Sword, Copy, Check, Clock, Users, Share2, Bot, Zap, Sparkles, Layers } from 'lucide-react'
import { feelTap, feelAnswer } from '../../lib/gameFeel'
import { emitXpBurst } from '../ui/XpBurst'
import type { LevelId } from '../../services/battleService'
import { LEVEL_OPTIONS, fetchBattleQuestions } from '../../services/battleService'

// ─── Types ──────────────────────────────────────────────────────────────────

type GameState = 'lobby' | 'waiting' | 'playing' | 'results' | 'error'
type PlayerId = 'host' | 'guest'
type AIDifficulty = 'easy' | 'medium' | 'hard'
type GameMode = 'multiplayer' | 'ai'

interface BattleQuestion {
  id: number
  english: string
  uzbek: string
  options: string[]
  correct: number
}

interface BattleMessage {
  type: 'join' | 'answer' | 'start'
  player: PlayerId
  answer?: number
  questionIndex?: number
  playerName?: string
}

interface AIOpponent {
  name: string
  emoji: string
  difficulty: AIDifficulty
  accuracy: number // 0-1
  delayMin: number // seconds
  delayMax: number
}

// ─── AI Opponents ───────────────────────────────────────────────────────────

const AI_OPPONENTS: Record<AIDifficulty, AIOpponent> = {
  easy: {
    name: 'Bot Junior',
    emoji: '🤖',
    difficulty: 'easy',
    accuracy: 0.6,
    delayMin: 2,
    delayMax: 5,
  },
  medium: {
    name: 'AI Challenger',
    emoji: '⚡',
    difficulty: 'medium',
    accuracy: 0.75,
    delayMin: 1.5,
    delayMax: 4,
  },
  hard: {
    name: 'Grandmaster AI',
    emoji: '🧠',
    difficulty: 'hard',
    accuracy: 0.9,
    delayMin: 1,
    delayMax: 3,
  },
}

const QUESTIONS_PER_GAME = 10
const QUESTION_TIME = 15

// ─── Helpers ────────────────────────────────────────────────────────────────

function generateRoomId(): string {
  return Math.random().toString(36).substring(2, 8).toUpperCase()
}

function aiAnswer(question: BattleQuestion, accuracy: number): number {
  if (Math.random() < accuracy) {
    return question.correct
  }
  const wrongOptions = [0, 1, 2, 3].filter(i => i !== question.correct)
  return wrongOptions[Math.floor(Math.random() * wrongOptions.length)]
}

// ─── Component ──────────────────────────────────────────────────────────────

export default function VocabBattle() {
  const userName = useStore((s) => s.userName) || 'Foydalanuvchi'
  const [gameState, setGameState] = useState<GameState>('lobby')
  const [gameMode, setGameMode] = useState<GameMode | null>(null)
  const [aiDifficulty, setAiDifficulty] = useState<AIDifficulty>('medium')
  const [selectedLevel, setSelectedLevel] = useState<LevelId>('B1')
  const [roomId, setRoomId] = useState('')
  const [joinRoomId, setJoinRoomId] = useState('')
  const [playerRole, setPlayerRole] = useState<PlayerId | null>(null)
  const [opponentName, setOpponentName] = useState('')
  const [opponentEmoji, setOpponentEmoji] = useState('👤')
  const [opponentDifficulty, setOpponentDifficulty] = useState<AIDifficulty | null>(null)
  const [questions, setQuestions] = useState<BattleQuestion[]>([])
  const [currentQ, setCurrentQ] = useState(0)
  const [selected, setSelected] = useState<number | null>(null)
  const [hostScore, setHostScore] = useState(0)
  const [guestScore, setGuestScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(QUESTION_TIME)
  const [message, setMessage] = useState('')
  const [roomCopied, setRoomCopied] = useState(false)
  const [locked, setLocked] = useState(false)
  const [aiThinking, setAiThinking] = useState(false)
  const [aiAnswered, setAiAnswered] = useState(false)

  const channelRef = useRef<RealtimeChannel | null>(null)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const aiTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const questionsRef = useRef(questions)
  questionsRef.current = questions
  const hostScoreRef = useRef(hostScore)
  hostScoreRef.current = hostScore
  const guestScoreRef = useRef(guestScore)
  guestScoreRef.current = guestScore

  // ── Pick random questions ──────────────────────────────────────────────

  const pickQuestions = useCallback(async () => {
    return fetchBattleQuestions(selectedLevel, QUESTIONS_PER_GAME)
  }, [selectedLevel])

  // ── Cleanup ────────────────────────────────────────────────────────────

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current)
    if (channelRef.current) {
      supabase.removeChannel(channelRef.current)
      channelRef.current = null
    }
  }, [])

  useEffect(() => {
    return cleanup
  }, [cleanup])

  // ── Timer ──────────────────────────────────────────────────────────────

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current)
    setTimeLeft(QUESTION_TIME)
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!)
          timerRef.current = null
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }, [])

  // ── Handle answer timeout ──────────────────────────────────────────────

  useEffect(() => {
    if (timeLeft === 0 && gameState === 'playing' && !locked) {
      handleAnswer(-1)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft])

  // ── AI answer schedule ────────────────────────────────────────────────

  const scheduleAIAnswer = useCallback((q: BattleQuestion, difficulty: AIDifficulty) => {
    const ai = AI_OPPONENTS[difficulty]
    const delay = (ai.delayMin + Math.random() * (ai.delayMax - ai.delayMin)) * 1000

    setAiThinking(true)
    setAiAnswered(false)

    aiTimerRef.current = setTimeout(() => {
      const answer = aiAnswer(q, ai.accuracy)
      setAiThinking(false)
      setAiAnswered(true)
      if (answer === q.correct) {
        setGuestScore((s) => s + 1)
      }
    }, delay)
  }, [])

  // ── Create room ────────────────────────────────────────────────────────

  const createRoom = useCallback(async () => {
    const id = generateRoomId()
    setRoomId(id)
    setPlayerRole('host')
    setGameMode('multiplayer')
    setGameState('waiting')

    const channel = supabase.channel(`vocab-battle-${id}`, {
      config: { broadcast: { self: true } },
    })

    channel.on('broadcast', { event: 'message' }, (payload) => {
      const msg = payload.payload as BattleMessage

      if (msg.type === 'join' && msg.player === 'guest') {
        setOpponentName(msg.playerName || 'Raqib')
        setOpponentEmoji('👤')
        pickQuestions().then(qs => {
          setQuestions(qs)
          setGameState('playing')
        })

        channel.send({
          type: 'broadcast',
          event: 'message',
          payload: { type: 'start', player: 'host' } as BattleMessage,
        })
      }

      if (msg.type === 'answer' && msg.player === 'guest') {
        const q = questionsRef.current[msg.questionIndex!]
        if (msg.answer === q?.correct) {
          setGuestScore((s) => s + 1)
        }
      }
    })

    channel.subscribe((status) => {
      if (status !== 'SUBSCRIBED') {
        setMessage('Xonaga ulanishda xatolik')
      }
    })

    channelRef.current = channel
  }, [pickQuestions])

  // ── Start AI game ──────────────────────────────────────────────────────

  const startAIGame = useCallback((difficulty: AIDifficulty) => {
    const ai = AI_OPPONENTS[difficulty]
    setOpponentName(ai.name)
    setOpponentEmoji(ai.emoji)
    setOpponentDifficulty(difficulty)
    setAiDifficulty(difficulty)
    setGameMode('ai')
    setPlayerRole('host')
    pickQuestions().then(qs => {
      setQuestions(qs)
      setGameState('playing')
    })
  }, [pickQuestions])

  // ── Join room ─────────────────────────────────────────────────────────

  const joinRoom = useCallback(async () => {
    if (!joinRoomId.trim()) return
    const id = joinRoomId.trim().toUpperCase()
    setRoomId(id)
    setPlayerRole('guest')
    setGameMode('multiplayer')
    setGameState('waiting')

    const channel = supabase.channel(`vocab-battle-${id}`, {
      config: { broadcast: { self: true } },
    })

    let joined = false

    channel.on('broadcast', { event: 'message' }, (payload) => {
      const msg = payload.payload as BattleMessage

      if (msg.type === 'start') {
        pickQuestions().then(qs => {
          setQuestions(qs)
          setGameState('playing')
        })
      }

      if (msg.type === 'answer' && msg.player === 'host') {
        const q = questionsRef.current[msg.questionIndex!]
        if (msg.answer === q?.correct) {
          setHostScore((s) => s + 1)
        }
      }
    })

    channel.subscribe((status) => {
      if (status === 'SUBSCRIBED' && !joined) {
        joined = true
        channel.send({
          type: 'broadcast',
          event: 'message',
          payload: { type: 'join', player: 'guest', playerName: userName } as BattleMessage,
        })
        setOpponentName(userName)
      } else if (status !== 'SUBSCRIBED') {
        setMessage('Xonaga ulanishda xatolik. Xona ID ni tekshiring.')
        setGameState('error')
      }
    })

    channelRef.current = channel
  }, [joinRoomId, userName, pickQuestions])

  // ── Handle answer ─────────────────────────────────────────────────────

  const handleAnswer = useCallback((answerIndex: number) => {
    if (locked) return
    setLocked(true)
    if (timerRef.current) clearInterval(timerRef.current)
    setSelected(answerIndex)

    const isCorrect = answerIndex === questions[currentQ]?.correct

    if (gameMode === 'multiplayer') {
      const msg: BattleMessage = {
        type: 'answer',
        player: playerRole!,
        answer: answerIndex,
        questionIndex: currentQ,
        playerName: userName,
      }
      channelRef.current?.send({
        type: 'broadcast',
        event: 'message',
        payload: msg,
      })
    }

    if (isCorrect) {
      if (playerRole === 'host' || gameMode === 'ai') setHostScore((s) => s + 1)
      else setGuestScore((s) => s + 1)
      emitXpBurst(5)
    }

    feelAnswer({ correct: isCorrect })

    setTimeout(() => {
      advanceQuestion()
    }, 1500)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locked, questions, currentQ, playerRole, userName, gameMode])

  // ── Advance question ─────────────────────────────────────────────────

  const advanceQuestion = useCallback(() => {
    const next = currentQ + 1
    if (aiTimerRef.current) clearTimeout(aiTimerRef.current)
    setAiThinking(false)

    if (next >= QUESTIONS_PER_GAME) {
      setGameState('results')
      if (timerRef.current) clearInterval(timerRef.current)
      return
    }
    setCurrentQ(next)
    setSelected(null)
    setLocked(false)
    setAiAnswered(false)
    startTimer()

    // Schedule AI answer for next question
    if (gameMode === 'ai' && opponentDifficulty) {
      scheduleAIAnswer(questions[next], opponentDifficulty)
    }
  }, [currentQ, startTimer, gameMode, opponentDifficulty, questions, scheduleAIAnswer])

  // ── Start playing ─────────────────────────────────────────────────────

  useEffect(() => {
    if (gameState === 'playing' && questions.length > 0) {
      setCurrentQ(0)
      setSelected(null)
      setLocked(false)
      setAiAnswered(false)
      startTimer()

      // Schedule first AI answer
      if (gameMode === 'ai' && opponentDifficulty) {
        scheduleAIAnswer(questions[0], opponentDifficulty)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameState, questions.length, gameMode, opponentDifficulty])

  // ── Copy room ID ─────────────────────────────────────────────────────

  const copyRoomId = () => {
    navigator.clipboard.writeText(roomId).then(() => {
      setRoomCopied(true)
      setTimeout(() => setRoomCopied(false), 2000)
    })
  }

  // ── Share room ───────────────────────────────────────────────────────

  const shareRoom = async () => {
    const shareData = {
      title: 'EnglishPath Vocabulary Battle',
      text: `Men bilan EnglishPath Vocabulary Battle o'ynang! Xona ID: ${roomId}`,
    }
    try {
      await navigator.share(shareData)
    } catch (e) {
      monitoring.captureMessage('VocabBattle share failed (fallback to copy): ' + (e instanceof Error ? e.message : String(e)), 'warn')
      copyRoomId()
    }
  }

  // ── Reset ────────────────────────────────────────────────────────────

  const reset = () => {
    cleanup()
    setGameState('lobby')
    setGameMode(null)
    setRoomId('')
    setJoinRoomId('')
    setPlayerRole(null)
    setOpponentName('')
    setOpponentEmoji('👤')
    setOpponentDifficulty(null)
    setQuestions([])
    setCurrentQ(0)
    setSelected(null)
    setHostScore(0)
    setGuestScore(0)
    setTimeLeft(QUESTION_TIME)
    setMessage('')
    setLocked(false)
    setAiThinking(false)
    setAiAnswered(false)
  }

  // ── Render lobby ─────────────────────────────────────────────────────

  if (gameState === 'lobby') {
    return (
      <div className="max-w-lg mx-auto space-y-6 animate-page-enter">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className="w-16 h-16 bg-gradient-to-br from-orange-400 to-red-500 rounded-2xl flex items-center justify-center shadow-lg">
              <Sword size={32} className="text-white" />
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Vocabulary Battle</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Do'stingiz bilan real-time so'z yarishing yoki AI ga qarshi o'ynang!
          </p>
        </div>

        {/* Level Selector */}
        <div className="card p-5 space-y-3 border-2 border-gray-100 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
              <Layers size={16} className="text-white" />
            </div>
            <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Darajani tanlang</h3>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {LEVEL_OPTIONS.map((level) => {
              const isSelected = selectedLevel === level.id
              const colors: Record<string, string> = {
                A1: 'border-green-300 bg-green-50 dark:border-green-700 dark:bg-green-900/20',
                A2: 'border-blue-300 bg-blue-50 dark:border-blue-700 dark:bg-blue-900/20',
                B1: 'border-orange-300 bg-orange-50 dark:border-orange-700 dark:bg-orange-900/20',
                B2: 'border-purple-300 bg-purple-50 dark:border-purple-700 dark:bg-purple-900/20',
              }
              const ringColors: Record<string, string> = {
                A1: 'ring-green-400',
                A2: 'ring-blue-400',
                B1: 'ring-orange-400',
                B2: 'ring-purple-400',
              }
              return (
                <button
                  key={level.id}
                  onClick={() => setSelectedLevel(level.id as LevelId)}
                  className={`p-3 rounded-xl border-2 text-left transition-all duration-200 ${
                    colors[level.id]
                  } ${isSelected ? 'ring-2 ring-offset-1 scale-[1.02] ' + ringColors[level.id] : 'opacity-70 hover:opacity-100'}`}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{level.emoji}</span>
                    <div>
                      <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{level.label}</p>
                      <p className="text-[11px] text-gray-400">
                        {level.id === 'A1' ? 'Asosiy so\'zlar' :
                         level.id === 'A2' ? 'Kundalik so\'zlar' :
                         level.id === 'B1' ? 'Akademik so\'zlar' :
                         'Yuqori daraja'}
                      </p>
                    </div>
                    {isSelected && (
                      <span className={`ml-auto w-5 h-5 rounded-full ${level.color} flex items-center justify-center`}>
                        <Check size={12} className="text-white" />
                      </span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* AI Opponent Section */}
        <div className="card p-6 space-y-4 border-2 border-primary-100 dark:border-primary-900/50 bg-gradient-to-br from-primary-50/50 to-transparent dark:from-primary-950/20">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">AI Opponent</h3>
              <p className="text-xs text-gray-400">Yakka o'zingiz mashq qiling</p>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-2">
            {(['easy', 'medium', 'hard'] as const).map((diff) => {
              const ai = AI_OPPONENTS[diff]
              const isSelected = aiDifficulty === diff
              const icons = { easy: '🤖', medium: '⚡', hard: '🧠' }
              const colors = {
                easy: 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20 hover:border-green-300',
                medium: 'border-yellow-200 bg-yellow-50 dark:border-yellow-800 dark:bg-yellow-900/20 hover:border-yellow-300',
                hard: 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20 hover:border-red-300',
              }
              return (
                <button
                  key={diff}
                  onClick={() => setAiDifficulty(diff)}
                  className={`p-3 rounded-xl border-2 text-center transition-all duration-200 ${
                    colors[diff]
                  } ${isSelected ? 'ring-2 ring-offset-1 scale-105 ' + (
                    diff === 'easy' ? 'ring-green-400' : diff === 'medium' ? 'ring-yellow-400' : 'ring-red-400'
                  ) : ''}`}
                >
                  <span className="text-2xl block mb-1">{icons[diff]}</span>
                  <p className="text-xs font-bold text-gray-800 dark:text-gray-200">{ai.name}</p>
                  <p className="text-[11px] text-gray-400">{Math.round(ai.accuracy * 100)}%</p>
                </button>
              )
            })}
          </div>

          <button
            onClick={() => startAIGame(aiDifficulty)}
            className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2"
          >
            <Zap size={18} />
            AI ga qarshi o'ynash
          </button>
        </div>

        <div className="relative flex items-center gap-2">
          <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
          <span className="text-xs text-gray-400 font-medium">YOKI</span>
          <div className="flex-1 border-t border-gray-200 dark:border-gray-700" />
        </div>

        {/* Multiplayer Section */}
        <div className="card p-6 space-y-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center">
              <Users size={20} className="text-white" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm">Multiplayer</h3>
              <p className="text-xs text-gray-400">Do'stingiz bilan real-time o'ynang</p>
            </div>
          </div>

          <button onClick={createRoom} className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2">
            <Sword size={18} />
            Yangi xona yaratish
          </button>

          <div className="space-y-2">
            <input
              className="input text-center text-lg font-mono tracking-widest"
              placeholder="XONA ID"
              value={joinRoomId}
              onChange={(e) => setJoinRoomId(e.target.value.toUpperCase())}
              maxLength={6}
            />
            <button
              onClick={joinRoom}
              disabled={joinRoomId.trim().length < 4}
              className="btn-secondary w-full py-3 text-base flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <Users size={18} />
              Xonaga qo'shilish
            </button>
          </div>
        </div>

        <p className="text-xs text-center text-gray-400">
          Ikki o'yinchi real-time Realtime orqali bog'lanadi
        </p>
      </div>
    )
  }

  // ── Render waiting ────────────────────────────────────────────────────

  if (gameState === 'waiting') {
    return (
      <div className="max-w-lg mx-auto text-center space-y-6 animate-page-enter">
        <div className="card p-8 space-y-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
          </div>

          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {playerRole === 'host' ? 'Raqib kutilmoqda...' : 'Xonaga ulanish...'}
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              {playerRole === 'host'
                ? "Quyidagi xona ID ni do'stingizga yuboring"
                : "Raqibning javobini kuting"}
            </p>
          </div>

          {playerRole === 'host' && (
            <div className="space-y-3">
              <div className="flex items-center justify-center gap-3">
                <span className="text-3xl font-bold font-mono tracking-[0.3em] text-primary-600 dark:text-primary-400">
                  {roomId}
                </span>
                <button
                  onClick={copyRoomId}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                >
                  {roomCopied ? <Check size={20} className="text-green-500" /> : <Copy size={20} className="text-gray-400" />}
                </button>
              </div>

              <div className="flex gap-2">
                <button onClick={shareRoom} className="btn-secondary flex-1 py-2 text-sm flex items-center justify-center gap-1.5">
                  <Share2 size={14} />
                  Ulashish
                </button>
                <button onClick={reset} className="btn-secondary py-2 px-4 text-sm">
                  Bekor qilish
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // ── Render playing ────────────────────────────────────────────────────

  if (gameState === 'playing' && questions.length > 0) {
    const q = questions[currentQ]
    const progress = ((currentQ + 1) / QUESTIONS_PER_GAME) * 100
    const timerPct = (timeLeft / QUESTION_TIME) * 100

    return (
      <div className="max-w-lg mx-auto space-y-4 animate-fade-in">
        {/* Top bar — players */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-green-500" />
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {userName}
            </span>
            <span className="font-bold text-primary-600">{hostScore}</span>
          </div>
          <div className="flex items-center gap-1">
            <span className="text-xs font-bold text-gray-400">{currentQ + 1}/{QUESTIONS_PER_GAME}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-primary-600">{guestScore}</span>
            <span className="font-semibold text-gray-700 dark:text-gray-300">
              {opponentName}
            </span>
            <span className="text-lg">{opponentEmoji}</span>
            {aiThinking && (
              <span className="inline-flex gap-0.5">
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </span>
            )}
            {aiAnswered && !aiThinking && (
              <Check size={14} className="text-green-500" />
            )}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary-500 rounded-full transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        {/* Timer bar */}
        <div className="h-2 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 ${
              timeLeft > 10 ? 'bg-green-500' : timeLeft > 5 ? 'bg-yellow-500' : 'bg-red-500'
            }`}
            style={{ width: `${timerPct}%` }}
          />
        </div>

        {/* Question card */}
        <div className="card p-6 space-y-4 animate-pop-in">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-orange-500 uppercase tracking-wider">
              {q.english} — ma'nosi?
            </span>
            <span className="flex items-center gap-1 text-sm font-semibold text-gray-500">
              <Clock size={14} />
              {timeLeft}s
            </span>
          </div>

          <h3 className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-center py-2">
            {q.english}
          </h3>

          <div className="space-y-2">
            {q.options.map((opt, i) => {
              let cls = 'w-full py-3 px-4 rounded-xl border-2 text-sm font-medium transition-all text-left '
              if (selected === null) {
                cls += 'border-gray-200 dark:border-gray-700 hover:border-primary-400 hover:bg-primary-50 dark:hover:bg-primary-900/20 text-gray-700 dark:text-gray-300 hover:scale-[1.02]'
              } else if (i === q.correct) {
                cls += 'border-green-500 bg-green-50 dark:bg-green-900/30 text-green-700 dark:text-green-300'
              } else if (i === selected) {
                cls += 'border-red-500 bg-red-50 dark:bg-red-900/30 text-red-700 dark:text-red-300'
              } else {
                cls += 'border-gray-100 dark:border-gray-800 text-gray-400 opacity-50'
              }
              return (
                <button
                  key={i}
                  onClick={() => { feelTap(); handleAnswer(i) }}
                  disabled={selected !== null}
                  className={cls}
                >
                  <span className="inline-block w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-800 text-center leading-6 text-xs font-bold mr-2">
                    {String.fromCharCode(65 + i)}
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // ── Render results ────────────────────────────────────────────────────

  if (gameState === 'results') {
    const hScore = hostScoreRef.current
    const gScore = guestScoreRef.current
    const isHostWinner = hScore > gScore
    const isGuestWinner = gScore > hScore
    const isTie = hScore === gScore

    return (
      <div className="max-w-lg mx-auto space-y-6 animate-page-enter">
        <div className="text-center space-y-2">
          <div className="flex justify-center">
            <div className={`w-24 h-24 rounded-full flex items-center justify-center text-5xl ${
              isTie ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-green-100 dark:bg-green-900/30'
            }`}>
              {isTie ? '🤝' : isHostWinner ? '🏆' : '😔'}
            </div>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
            {isTie ? 'Durang!' : "O'yin tugadi!"}
          </h2>
          <p className="text-sm text-gray-500">
            {isTie ? 'Ikkalangiz ham teng kuchli!' :
              isHostWinner ? 'Tabriklaymiz! Siz yutdingiz!' : 'Keyingi safar omad!'
            }
          </p>
          {gameMode === 'ai' && opponentDifficulty && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gray-100 dark:bg-gray-800 text-xs text-gray-500">
              {AI_OPPONENTS[opponentDifficulty].emoji} {AI_OPPONENTS[opponentDifficulty].name}
            </div>
          )}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className={`card p-5 text-center space-y-2 ${isHostWinner ? 'ring-2 ring-yellow-400 shadow-lg' : ''}`}>
            <span className="text-3xl block mb-1">👤</span>
            <p className="text-xs font-semibold text-gray-400 uppercase">Siz</p>
            <p className="font-bold text-gray-900 dark:text-gray-100">{userName}</p>
            <p className="text-4xl font-bold text-primary-600">{hostScore}</p>
            <p className="text-xs text-gray-400">to'g'ri</p>
          </div>
          <div className={`card p-5 text-center space-y-2 ${isGuestWinner ? 'ring-2 ring-yellow-400 shadow-lg' : ''}`}>
            <span className="text-3xl block mb-1">{opponentEmoji}</span>
            <p className="text-xs font-semibold text-gray-400 uppercase">Raqib</p>
            <p className="font-bold text-gray-900 dark:text-gray-100">{opponentName}</p>
            <p className="text-4xl font-bold text-primary-600">{guestScore}</p>
            <p className="text-xs text-gray-400">to'g'ri</p>
          </div>
        </div>

        <button onClick={reset} className="btn-primary w-full py-3 text-base flex items-center justify-center gap-2">
          <Sparkles size={18} />
          Yangi o'yin boshlash
        </button>
      </div>
    )
  }

  // ── Render error ──────────────────────────────────────────────────────

  if (gameState === 'error') {
    return (
      <div className="max-w-lg mx-auto text-center space-y-4">
        <div className="card p-8">
          <p className="text-red-500 font-semibold mb-2">{message || 'Xatolik yuz berdi'}</p>
          <button onClick={reset} className="btn-primary">
            Qaytadan urinish
          </button>
        </div>
      </div>
    )
  }

  return null
}
