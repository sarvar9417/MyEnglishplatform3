import { useState, useRef, useEffect } from 'react'
import { CheckCircle, XCircle, ArrowRight, RotateCcw, X, Loader2, FlaskConical } from 'lucide-react'
import { supabase } from '../../lib/supabase'
import { monitoring } from '../../lib/monitoring'
import { generateUzbekSentence, checkSentenceTranslation, analyzeGrammar } from '../../lib/claude'
import GrammarAnalysisPanel from './GrammarAnalysisPanel'

type Level = 'A1' | 'A2' | 'B1' | 'B2'
type Phase = 'level-select' | 'playing' | 'result'

interface Word {
  id: number
  english: string
  uzbek: string
  level: string
  example?: string
}

interface RoundData {
  word: Word
  uzbekSentence: string
  userAnswer: string
  correct: boolean
  explanation: string
  correctAnswer: string
}

const LEVEL_STYLES: Record<Level, { bg: string; text: string; border: string; badge: string; btn: string }> = {
  A1: { bg: 'bg-gray-50 dark:bg-gray-800', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-300 dark:border-gray-600', badge: 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400', btn: 'hover:bg-gray-100 hover:border-gray-400 dark:hover:bg-gray-700 dark:hover:border-gray-500' },
  A2: { bg: 'bg-blue-50 dark:bg-blue-900/20', text: 'text-blue-700 dark:text-blue-300', border: 'border-blue-200 dark:border-blue-700', badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300', btn: 'hover:bg-blue-100 hover:border-blue-400 dark:hover:bg-blue-900/30 dark:hover:border-blue-500' },
  B1: { bg: 'bg-indigo-50 dark:bg-indigo-900/20', text: 'text-indigo-700 dark:text-indigo-300', border: 'border-indigo-200 dark:border-indigo-700', badge: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300', btn: 'hover:bg-indigo-100 hover:border-indigo-400 dark:hover:bg-indigo-900/30 dark:hover:border-indigo-500' },
  B2: { bg: 'bg-purple-50 dark:bg-purple-900/20', text: 'text-purple-700 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-700', badge: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300', btn: 'hover:bg-purple-100 hover:border-purple-400 dark:hover:bg-purple-900/30 dark:hover:border-purple-500' },
}

const LEVEL_DESC: Record<Level, string> = {
  A1: 'Boshlang\'ich',
  A2: 'Elementar',
  B1: 'O\'rta',
  B2: 'O\'rta-yuqori',
}

const QUESTION_COUNT = 20

export default function VocabSentenceGame({ onClose }: { onClose: () => void }) {
  const [phase, setPhase] = useState<Phase>('level-select')
  const [selectedLevel, setSelectedLevel] = useState<Level | null>(null)
  const [words, setWords] = useState<Word[]>([])
  const [currentIdx, setCurrentIdx] = useState(0)
  const [input, setInput] = useState('')
  const [rounds, setRounds] = useState<RoundData[]>([])
  const [loading, setLoading] = useState(false)
  const [generating, setGenerating] = useState(false)
  const [uzbekSentence, setUzbekSentence] = useState('')
  const [currentWord, setCurrentWord] = useState<Word | null>(null)
  const [flash, setFlash] = useState<'correct' | 'wrong' | null>(null)
  const [locked, setLocked] = useState(false)
  const [checking, setChecking] = useState(false)
  const [feedback, setFeedback] = useState<{ explanation: string; correctAnswer: string } | null>(null)
  const [analysisText, setAnalysisText] = useState('')
  const [analysisLoading, setAnalysisLoading] = useState(false)
  const [showAnalysis, setShowAnalysis] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const pendingRef = useRef<{ rounds: RoundData[]; nextIdx: number; finished: boolean } | null>(null)
  const wordsRef = useRef<Word[]>([])
  const lastAnswerRef = useRef<{ sentence: string; translation: string; level: string } | null>(null)

  useEffect(() => {
    if (phase === 'playing' && !locked) {
      setTimeout(() => inputRef.current?.focus(), 80)
    }
  }, [phase, currentIdx, locked])

  async function startGame(level: Level) {
    setLoading(true)
    setSelectedLevel(level)

    const { data, error } = await supabase
      .from('words')
      .select('id, english, uzbek, level, example')
      .eq('level', level)
      .limit(300)

    if (error || !data || data.length === 0) {
      setLoading(false)
      return
    }

    const shuffled = [...data].sort(() => Math.random() - 0.5).slice(0, QUESTION_COUNT)
    wordsRef.current = shuffled
    setWords(shuffled)
    setCurrentIdx(0)
    setRounds([])
    setInput('')
    setFlash(null)
    setLocked(false)
    setPhase('playing')
    setLoading(false)

    // First round word
    await loadRound(shuffled[0], 0)
  }

  async function loadRound(word: Word, idx: number) {
    setGenerating(true)
    setCurrentWord(word)
    setUzbekSentence('')
    setFlash(null)
    setFeedback(null)
    setShowAnalysis(false)
    setAnalysisText('')
    lastAnswerRef.current = null
    try {
      const sentence = await generateUzbekSentence(word.english, word.uzbek, word.level)
      setUzbekSentence(sentence)
    } catch (err) {
      monitoring.captureException(err instanceof Error ? err : new Error(String(err)), { context: 'VocabSentenceGame:generateUzbekSentence' })
      setUzbekSegmentFallback(word)
    }
    setGenerating(false)
    setInput('')
    setLocked(false)
    setCurrentIdx(idx)
  }

  function setUzbekSegmentFallback(word: Word) {
    setUzbekSentence(`${word.uzbek} — bu so'zni ishlatib gap tuzing.`)
  }

  function handleAnalysis() {
    const ans = lastAnswerRef.current
    if (!ans) return
    setShowAnalysis(true)
    if (analysisText) return   // already fetched
    setAnalysisLoading(true)
    analyzeGrammar(
      ans.sentence,
      ans.translation,
      ans.level,
      (token) => setAnalysisText((p) => p + token),
      () => setAnalysisLoading(false),
      (err) => { monitoring.captureException(err instanceof Error ? err : new Error(String(err)), { context: 'analyzeGrammar:VocabSentenceGame' }); setAnalysisLoading(false) }
    )
  }

  function goNext() {
    const pending = pendingRef.current
    if (!pending) return
    pendingRef.current = null
    setFlash(null)
    setFeedback(null)
    setShowAnalysis(false)
    setAnalysisText('')
    setLocked(false)
    setRounds(pending.rounds)
    setInput('')
    if (pending.finished) {
      setPhase('result')
    } else {
      const nextWord = wordsRef.current[pending.nextIdx]
      if (nextWord) {
        loadRound(nextWord, pending.nextIdx)
      }
    }
  }

  async function handleSubmit() {
    const trimmed = input.trim()
    if (!trimmed || locked || !currentWord || !uzbekSentence) return

    setLocked(true)
    setChecking(true)
    setShowAnalysis(false)
    setAnalysisText('')
    lastAnswerRef.current = { sentence: uzbekSentence, translation: trimmed, level: selectedLevel! }

    try {
      const result = await checkSentenceTranslation(
        uzbekSentence,
        currentWord.english,
        trimmed,
        selectedLevel!
      )
      setChecking(false)
      setFlash(result.correct ? 'correct' : 'wrong')
      setFeedback({ explanation: result.explanation, correctAnswer: result.correctAnswer })

      const newRounds = [...rounds, {
        word: currentWord,
        uzbekSentence,
        userAnswer: trimmed,
        correct: result.correct,
        explanation: result.explanation,
        correctAnswer: result.correctAnswer,
      }]
      const nextIdx = currentIdx + 1
      pendingRef.current = { rounds: newRounds, nextIdx, finished: nextIdx >= wordsRef.current.length }
    } catch {
      setChecking(false)
      setFlash('wrong')
      const fallback = `To'g'ri javob: "${currentWord.english}" so'zini ishlatib, o'zbekcha gapni ingliz tiliga tarjima qiling.`
      setFeedback({ explanation: 'AI tekshirishda xatolik yuz berdi. Qayta urinib ko\'ring.', correctAnswer: fallback })

      const newRounds = [...rounds, {
        word: currentWord,
        uzbekSentence,
        userAnswer: trimmed,
        correct: false,
        explanation: 'AI xatosi',
        correctAnswer: fallback,
      }]
      const nextIdx = currentIdx + 1
      pendingRef.current = { rounds: newRounds, nextIdx, finished: nextIdx >= wordsRef.current.length }
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') handleSubmit()
  }

  const score = rounds.filter(r => r.correct).length
  const wrongRounds = rounds.filter(r => !r.correct)

  // ── Level tanlash ──
  if (phase === 'level-select') {
    return (
      <div className="p-4 max-w-md mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-900">Gap tarjima o'yini</h2>
            <p className="text-sm text-gray-500 mt-0.5">
              AI gap tuzadi · Siz ingliz tiliga o'girasiz · {QUESTION_COUNT} savol
            </p>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-gray-100 transition-all">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
          Daraja tanlang
        </p>

        <div className="grid grid-cols-2 gap-3">
          {(['A1', 'A2', 'B1', 'B2'] as Level[]).map((lvl) => {
            const s = LEVEL_STYLES[lvl]
            return (
              <button
                key={lvl}
                onClick={() => startGame(lvl)}
                disabled={loading}
                className={`rounded-2xl border-2 py-8 text-center transition-all ${s.bg} ${s.border} ${s.btn} disabled:opacity-50`}
              >
                <span className={`text-4xl font-black ${s.text}`}>{lvl}</span>
                <p className="text-xs text-gray-400 mt-1.5">{LEVEL_DESC[lvl]}</p>
                <p className="text-[10px] text-gray-300 mt-0.5">{QUESTION_COUNT} ta savol</p>
              </button>
            )
          })}
        </div>

        {loading && (
          <div className="flex items-center justify-center gap-2 mt-6 text-gray-400">
            <Loader2 size={16} className="animate-spin" />
            <span className="text-sm">So'zlar yuklanmoqda...</span>
          </div>
        )}
      </div>
    )
  }

  // ── O'yin ──
  if (phase === 'playing') {
    const progressPct = (currentIdx / words.length) * 100
    const lvlStyle = LEVEL_STYLES[selectedLevel!]

    return (
      <div className="p-4 max-w-md mx-auto">
        {/* Sarlavha */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${lvlStyle.badge}`}>
              {selectedLevel}
            </span>
            <span className="text-sm text-gray-500 font-medium">
              {currentIdx + 1} / {words.length}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-green-600">{score} ball</span>
            <button onClick={onClose} className="p-1.5 rounded-xl hover:bg-gray-100">
              <X size={16} className="text-gray-400" />
            </button>
          </div>
        </div>

        {/* Progress bar */}
        <div className="w-full h-1.5 bg-gray-100 rounded-full mb-5 overflow-hidden">
          <div
            className="h-full bg-indigo-500 rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>

        {/* So'z va kontekst */}
        <div className="rounded-2xl border-2 border-indigo-200 bg-indigo-50 py-6 px-4 text-center mb-4">
          <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">
            Inglizcha so'z
          </p>
          {currentWord && (
            <p className="text-3xl font-bold text-gray-900 mb-4">{currentWord.english}</p>
          )}
          <div className="border-t border-indigo-200 pt-3">
            <p className="text-[11px] font-semibold text-indigo-500 uppercase tracking-wider mb-2">
              🇺🇿 AI tuzgan o'zbekcha gap
            </p>
            {generating ? (
              <div className="flex items-center justify-center gap-2 text-indigo-600 text-sm font-medium">
                <Loader2 size={16} className="animate-spin" /> Gap tuzilmoqda...
              </div>
            ) : (
              <p className="text-lg font-medium text-indigo-800 leading-relaxed">{uzbekSentence}</p>
            )}
          </div>
        </div>

        {/* Natija kartochkasi */}
        {!generating && (
          <div
            className={`rounded-2xl border-2 py-6 px-4 text-center mb-4 transition-all duration-300 ${
              checking
                ? 'bg-yellow-50 border-yellow-200'
                : flash === 'correct'
                ? 'bg-green-50 border-green-300'
                : flash === 'wrong'
                ? 'bg-red-50 border-red-300'
                : 'bg-white border-gray-200'
            }`}
          >
            {checking && (
              <div className="flex items-center justify-center gap-2 text-yellow-600 text-sm font-medium">
                <Loader2 size={16} className="animate-spin" /> Tekshirilmoqda...
              </div>
            )}

            {!checking && flash === 'correct' && (
              <div>
                <div className="flex items-center justify-center gap-1.5 text-green-600 font-semibold text-sm">
                  <CheckCircle size={18} /> To'g'ri! +1 ball
                </div>
              </div>
            )}

            {!checking && flash === 'wrong' && feedback && (
              <div className="text-left">
                <p className="text-red-500 text-sm font-semibold flex items-center justify-center gap-1.5 mb-2">
                  <XCircle size={16} /> Noto'g'ri
                </p>
                <p className="text-sm text-gray-700 bg-red-50 rounded-xl p-3 mb-2">
                  {feedback.explanation || 'Tarjima noto\'g\'ri.'}
                </p>
                {feedback.correctAnswer && (
                  <p className="text-sm text-green-700 bg-green-50 rounded-xl p-3 font-medium">
                    ✅ To'g'ri javob: {feedback.correctAnswer}
                  </p>
                )}
              </div>
            )}

            {/* Grammatik tahlil tugmasi — javob tekshirilgandan keyin ko'rinadi */}
            {!checking && flash && (
              <button
                onClick={handleAnalysis}
                className={`w-full mt-3 py-2 px-3 rounded-xl border-2 text-sm font-semibold flex items-center justify-center gap-2 transition-all ${
                  showAnalysis
                    ? 'border-indigo-400 bg-indigo-50 text-indigo-700'
                    : 'border-indigo-200 text-indigo-600 hover:bg-indigo-50 hover:border-indigo-400'
                }`}
              >
                <FlaskConical size={15} />
                {showAnalysis ? 'Tahlil ko\'rilmoqda' : 'Grammatik tahlil ko\'rish'}
                {analysisLoading && <Loader2 size={13} className="animate-spin ml-1" />}
              </button>
            )}

            {/* Tahlil paneli */}
            {showAnalysis && (
              <GrammarAnalysisPanel text={analysisText} loading={analysisLoading} />
            )}
          </div>
        )}

        {/* Input */}
        {!generating && (
          <>
            <div className="flex gap-2">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                disabled={locked}
                placeholder="Inglizcha tarjimani yozing..."
                autoComplete="off"
                autoCorrect="off"
                spellCheck={false}
                className="flex-1 px-4 py-3 rounded-xl border-2 border-gray-200 focus:border-indigo-400 focus:outline-none text-gray-900 font-medium transition-all disabled:opacity-50 disabled:bg-gray-50"
              />
              <button
                onClick={handleSubmit}
                disabled={!input.trim() || locked}
                className="px-5 py-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-600 disabled:opacity-40 transition-all"
              >
                <ArrowRight size={20} />
              </button>
            </div>

            {locked ? (
              <button
                onClick={goNext}
                className="w-full mt-3 py-2.5 border-2 border-indigo-200 text-indigo-600 font-semibold rounded-xl hover:bg-indigo-50 transition-all text-sm flex items-center justify-center gap-2"
              >
                Keyingi <ArrowRight size={15} />
              </button>
            ) : (
              <p className="text-center text-[11px] text-gray-300 mt-3">
                Enter tugmasini bosing
              </p>
            )}
          </>
        )}
      </div>
    )
  }

  // ── Natija ──
  if (phase === 'result') {
    const pct = Math.round((score / words.length) * 100)
    const emoji = pct >= 90 ? '🏆' : pct >= 70 ? '🎉' : pct >= 50 ? '👍' : '💪'

    return (
      <div className="p-4 max-w-md mx-auto">
        {/* Natija */}
        <div className="text-center mb-6">
          <div className="text-5xl mb-3">{emoji}</div>
          <h2 className="text-3xl font-black text-gray-900">
            {score}
            <span className="text-gray-300">/{words.length}</span>
          </h2>
          <p className="text-gray-500 mt-1">{pct}% to'g'ri</p>
          <span className={`inline-block mt-2 text-xs font-bold px-3 py-1 rounded-full ${LEVEL_STYLES[selectedLevel!].badge}`}>
            {selectedLevel} · {LEVEL_DESC[selectedLevel!]}
          </span>
        </div>

        {/* Tugmalar */}
        <div className="flex gap-3 mb-6">
          <button
            onClick={() => startGame(selectedLevel!)}
            className="flex-1 py-3 bg-indigo-500 text-white font-bold rounded-xl hover:bg-indigo-600 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw size={16} /> Qayta o'ynash
          </button>
          <button
            onClick={() => setPhase('level-select')}
            className="flex-1 py-3 border-2 border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all"
          >
            Daraja o'zgartir
          </button>
        </div>

        {/* Xatolar */}
        {wrongRounds.length > 0 ? (
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
              Xatolar — {wrongRounds.length} ta
            </p>
            <div className="space-y-3">
              {wrongRounds.map((r, i) => (
                <div key={i} className="rounded-xl border border-gray-100 bg-gray-50 py-3 px-4">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-sm font-bold text-indigo-600">{r.word.english}</span>
                    <span className="text-[10px] text-gray-400">{r.word.level}</span>
                  </div>
                  <p className="text-xs text-indigo-500 italic mb-2">🇺🇿 {r.uzbekSentence}</p>
                  <div className="flex flex-col gap-1">
                    <p className="text-xs text-red-500 flex items-center gap-1">
                      <XCircle size={11} />
                      Siz: <span className="font-mono font-semibold">{r.userAnswer || '(bo\'sh)'}</span>
                    </p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <CheckCircle size={11} />
                      To'g'ri: <span className="font-bold">{r.correctAnswer || r.word.english}</span>
                    </p>
                    {r.explanation && !r.explanation.includes('AI xatosi') && (
                      <p className="text-[11px] text-gray-500 mt-1">{r.explanation}</p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-8">
            <CheckCircle size={36} className="text-green-500 mx-auto mb-3" />
            <p className="font-bold text-green-700 text-lg">Mukammal natija!</p>
            <p className="text-sm text-gray-400 mt-1">Barcha tarjimalar to'g'ri</p>
          </div>
        )}

        <button onClick={onClose} className="w-full mt-5 py-3 text-gray-400 text-sm hover:text-gray-600 transition-all">
          Yopish
        </button>
      </div>
    )
  }

  return null
}
