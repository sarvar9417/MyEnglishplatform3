import { useState, useEffect, useMemo } from 'react'
import {
  ArrowLeft, CheckCircle, XCircle, Star,
  Sparkles, RotateCcw, ChevronRight, Lightbulb, Trophy,
} from 'lucide-react'
import type { DailyLesson, DailyExercise } from '../data/dailyLessons'
import { useStore } from '../store/useStore'
import { pushLessonProgress, getLessonProgress } from '../services/lessonService'
import { getTodayTashkent } from '../utils/tashkentDate'

const COLOR_STYLES: Record<string, { bg: string; text: string; border: string }> = {
  blue:   { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200' },
  purple: { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200' },
  green:  { bg: 'bg-teal-50',   text: 'text-teal-700',   border: 'border-teal-200' },
  orange: { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200' },
}

function normalizeAnswer(s: string): string {
  return s
    .toLowerCase().trim()
    .replace(/[.,!?;:]/g, '')
    .replace(/\s+/g, ' ')
    .replace(/n't/g, ' not')
    .replace(/\s+/g, ' ')
    .trim()
}

function checkAnswer(ex: DailyExercise, userAns: string[]): boolean {
  if (!userAns || userAns.length === 0) return false
  switch (ex.type) {
    case 'fill-blank':
      return ex.blanks.every((b, i) => normalizeAnswer(userAns[i] ?? '') === normalizeAnswer(b))
    case 'multiple-choice':
      return normalizeAnswer(userAns[0] ?? '') === normalizeAnswer(ex.correct)
    case 'error-correction':
    case 'transformation':
      return normalizeAnswer(userAns[0] ?? '') === normalizeAnswer(ex.correct)
    case 'fill-table': {
      const expected = ex.rows.flatMap((r) => [r.comp, r.sup])
      return expected.every((b, i) => b === '' || normalizeAnswer(userAns[i] ?? '') === normalizeAnswer(b))
    }
  }
}

const OPTION_LABELS = ['A', 'B', 'C', 'D']

function ExerciseCard({
  ex, num, answers, onChange, submitted,
}: {
  ex: DailyExercise
  num: number
  answers: string[]
  onChange: (idx: number, val: string) => void
  submitted: boolean
}) {
  const isCorrect = submitted ? checkAnswer(ex, answers) : false

  const borderCls = submitted
    ? isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
    : ''

  return (
    <div className={`relative rounded-2xl border p-4 transition-colors ${borderCls}`}>
      <div className={`absolute -left-3 -top-3 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
        submitted
          ? isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
          : 'bg-primary-600 text-white'
      }`}>
        {submitted ? (isCorrect ? '✓' : '✗') : num}
      </div>

      {ex.type === 'fill-blank' && (
        <div>
          <p className="text-[11px] font-bold text-blue-600 uppercase tracking-wider mb-3">
            📝 Bo'sh joyni to'ldiring
          </p>
          <p className="text-sm text-gray-700 leading-loose">
            {ex.question.split('_____').map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <input
                    type="text"
                    value={answers[i] ?? ''}
                    onChange={(e) => onChange(i, e.target.value)}
                    disabled={submitted}
                    placeholder="___"
                    className={`inline-block border-b-2 w-32 text-center text-sm font-semibold outline-none bg-transparent transition-colors ${
                      submitted
                        ? normalizeAnswer(answers[i] ?? '') === normalizeAnswer(ex.blanks[i] ?? '')
                          ? 'border-green-500 text-green-700'
                          : 'border-red-400 text-red-700'
                        : 'border-primary-400 text-primary-700 focus:border-primary-600'
                    }`}
                  />
                )}
              </span>
            ))}
          </p>
          {submitted && (
            <div className={`mt-3 text-xs ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {!isCorrect && (
                <p className="font-semibold">✅ To'g'ri javob: <span className="font-mono">{ex.blanks.join(' / ')}</span></p>
              )}
              <p className="mt-1 text-gray-600">💡 {ex.explanation}</p>
            </div>
          )}
        </div>
      )}

      {ex.type === 'multiple-choice' && (
        <div>
          <p className="text-[11px] font-bold text-violet-600 uppercase tracking-wider mb-3">
            🔘 To'g'ri variantni tanlang
          </p>
          <p className="text-sm font-semibold text-gray-800 mb-3 leading-relaxed">{ex.question}</p>
          <div className="grid grid-cols-2 gap-2">
            {ex.options.map((opt, i) => {
              const selected = answers[0] === opt
              const correctOpt = opt === ex.correct
              let cls = 'border border-gray-200 bg-white text-gray-700 hover:border-violet-400 hover:bg-violet-50'
              if (submitted) {
                if (correctOpt) cls = 'border-green-400 bg-green-100 text-green-800 font-bold'
                else if (selected && !correctOpt) cls = 'border-red-400 bg-red-100 text-red-700'
                else cls = 'border-gray-100 bg-gray-50 text-gray-400'
              } else if (selected) {
                cls = 'border-violet-500 bg-violet-100 text-violet-800 font-semibold'
              }
              return (
                <button
                  key={opt}
                  disabled={submitted}
                  onClick={() => onChange(0, opt)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${cls}`}
                >
                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                    {OPTION_LABELS[i]}
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>
          {submitted && !isCorrect && (
            <p className="mt-3 text-xs text-gray-600">💡 {ex.explanation}</p>
          )}
        </div>
      )}

      {ex.type === 'error-correction' && (
        <div>
          <p className="text-[11px] font-bold text-amber-600 uppercase tracking-wider mb-3">
            🔍 Xatoni toping va to'g'irlang
          </p>
          <div className="bg-white border border-amber-200 rounded-xl px-3 py-2 mb-3">
            <p className="text-sm text-gray-700 leading-relaxed">
              {ex.question.split(ex.errorPart).map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className="bg-red-100 text-red-700 font-bold px-1 rounded underline decoration-red-400">
                      {ex.errorPart}
                    </span>
                  )}
                </span>
              ))}
            </p>
          </div>
          <input
            type="text"
            value={answers[0] ?? ''}
            onChange={(e) => onChange(0, e.target.value)}
            disabled={submitted}
            placeholder="To'g'ri gapni yozing..."
            className="input text-sm"
          />
          {submitted && (
            <div className={`mt-3 text-xs ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {!isCorrect && (
                <p className="font-semibold">✅ To'g'ri variant: <span className="font-mono">{ex.correct}</span></p>
              )}
              <p className="mt-1 text-gray-600">💡 {ex.explanation}</p>
            </div>
          )}
        </div>
      )}

      {ex.type === 'transformation' && (
        <div>
          <p className="text-[11px] font-bold text-teal-600 uppercase tracking-wider mb-3">
            🔄 Gapni o'zgartiring
          </p>
          <div className="bg-white border border-teal-200 rounded-xl px-3 py-2 mb-2">
            <p className="text-sm text-gray-800 font-medium">{ex.question}</p>
          </div>
          <p className="text-xs text-teal-600 mb-2 font-medium flex items-center gap-1">
            <span>Boshlang'ich:</span>
            <span className="font-mono font-bold">{ex.hint}</span>
          </p>
          <input
            type="text"
            value={answers[0] ?? ''}
            onChange={(e) => onChange(0, e.target.value)}
            disabled={submitted}
            placeholder="To'liq javobni yozing..."
            className="input text-sm"
          />
          {submitted && (
            <div className={`mt-3 text-xs ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {!isCorrect && (
                <p className="font-semibold">✅ Namuna javob: <span className="font-mono">{ex.correct}</span></p>
              )}
              <p className="mt-1 text-gray-600">💡 {ex.explanation}</p>
            </div>
          )}
        </div>
      )}

      {ex.type === 'fill-table' && (
        <div>
          <p className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider mb-3">
            📊 Jadvalni to'ldiring
          </p>
          <p className="text-sm text-gray-700 mb-3">{ex.instruction}</p>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 text-left text-xs text-gray-500 uppercase tracking-wider">
                  <th className="pb-2 pr-3 font-semibold">Adjective</th>
                  <th className="pb-2 pr-3 font-semibold">Comparative</th>
                  <th className="pb-2 font-semibold">Superlative</th>
                </tr>
              </thead>
              <tbody>
                {ex.rows.map((row, rowIdx) => {
                  const compIdx = rowIdx * 2
                  const supIdx = rowIdx * 2 + 1
                  return (
                    <tr key={rowIdx} className="border-b border-gray-50">
                      <td className="py-2 pr-3 font-semibold text-gray-900">{row.adj}</td>
                      <td className="py-2 pr-3">
                        {row.comp ? (
                          <span className={`font-mono text-sm ${
                            submitted
                              ? normalizeAnswer(answers[compIdx] ?? '') === normalizeAnswer(row.comp)
                                ? 'text-green-600 font-bold'
                                : 'text-red-600'
                              : 'text-gray-400'
                          }`}>
                            {submitted ? (answers[compIdx] ?? '—') : (
                              <input
                                type="text"
                                value={answers[compIdx] ?? ''}
                                onChange={(e) => onChange(compIdx, e.target.value)}
                                disabled={submitted}
                                placeholder="___"
                                className="w-28 border-b-2 border-dashed border-indigo-300 text-center text-sm font-semibold outline-none bg-transparent focus:border-indigo-600 transition-colors"
                              />
                            )}
                          </span>
                        ) : <span className="text-gray-300 italic">—</span>}
                      </td>
                      <td className="py-2">
                        {row.sup ? (
                          <span className={`font-mono text-sm ${
                            submitted
                              ? normalizeAnswer(answers[supIdx] ?? '') === normalizeAnswer(row.sup)
                                ? 'text-green-600 font-bold'
                                : 'text-red-600'
                              : 'text-gray-400'
                          }`}>
                            {submitted ? (answers[supIdx] ?? '—') : (
                              <input
                                type="text"
                                value={answers[supIdx] ?? ''}
                                onChange={(e) => onChange(supIdx, e.target.value)}
                                disabled={submitted}
                                placeholder="___"
                                className="w-28 border-b-2 border-dashed border-indigo-300 text-center text-sm font-semibold outline-none bg-transparent focus:border-indigo-600 transition-colors"
                              />
                            )}
                          </span>
                        ) : <span className="text-gray-300 italic">—</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {submitted && (
            <div className="mt-3 text-xs text-gray-600">
              <p>💡 {ex.explanation}</p>
              <div className="mt-2 flex flex-wrap gap-4">
                {ex.rows.map((row, rowIdx) => {
                  if (!row.comp && !row.sup) return null
                  const compOk = normalizeAnswer(answers[rowIdx * 2] ?? '') === normalizeAnswer(row.comp)
                  const supOk = normalizeAnswer(answers[rowIdx * 2 + 1] ?? '') === normalizeAnswer(row.sup)
                  if (compOk && supOk) return null
                  return (
                    <div key={rowIdx} className="text-xs">
                      <span className="font-semibold text-gray-800">{row.adj}</span>
                      {!compOk && <span className="ml-1 text-red-500">C: {row.comp}</span>}
                      {!supOk && <span className="ml-1 text-red-500">S: {row.sup}</span>}
                    </div>
                  )
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ── VocabLearner (interaktiv lug'at yodlash) ────────────────────────────────────

const RULE_LABELS: Record<string, { label: string; color: string }> = {
  qisqa:   { label: 'Qisqa (-er/-est)', color: 'bg-blue-100 text-blue-700' },
  uzun:    { label: 'Uzun (more/most)', color: 'bg-violet-100 text-violet-700' },
  'y bilan': { label: '-y → -ier/-iest', color: 'bg-teal-100 text-teal-700' },
  'e bilan': { label: '-e → -r/-st',   color: 'bg-amber-100 text-amber-700' },
  cvc:     { label: 'CVC (undosh×2)',  color: 'bg-orange-100 text-orange-700' },
  notogri: { label: 'Noto\'g\'ri',     color: 'bg-rose-100 text-rose-700' },
}

const RULE_ORDER = ['qisqa', 'cvc', 'y bilan', 'e bilan', 'uzun', 'notogri']

const RULE_EMOJI: Record<string, string> = {
  qisqa: '🔤', cvc: '🔁', 'y bilan': '💛', 'e bilan': '➖', uzun: '📏', notogri: '⚡',
}

function VocabLearner({ vocab, addXP }: { vocab: { en: string; uz: string; example: string; rule: string }[]; addXP: (n: number) => void }) {
  const [mode, setMode] = useState<'browse' | 'flashcard' | 'quiz'>('browse')
  const [cardIdx, setCardIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [knownIds, setKnownIds] = useState<Set<number>>(new Set())

  const grouped = RULE_ORDER
    .filter((r) => vocab.some((v) => v.rule === r))
    .map((r) => ({ rule: r, words: vocab.filter((v) => v.rule === r) }))

  // ── Browse (guruhlangan jadval) ──
  if (mode === 'browse') {
    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-1">
          {(['browse', 'flashcard', 'quiz'] as const).map((m) => (
            <button key={m} onClick={() => { setMode(m); setCardIdx(0); setFlipped(false) }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                mode === m ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {m === 'browse' ? '📖 Ko\'rish' : m === 'flashcard' ? '🃏 Flashcard' : '✍️ Test'}
            </button>
          ))}
        </div>

        {grouped.map((g) => {
          const rc = RULE_LABELS[g.rule] ?? { label: g.rule, color: 'bg-gray-100 text-gray-600' }
          return (
            <div key={g.rule}>
              <div className="flex items-center gap-1.5 mb-2">
                <span className={`badge text-xs font-bold ${rc.color}`}>{RULE_EMOJI[g.rule]} {rc.label}</span>
                <span className="text-xs text-gray-400">{g.words.length} ta so'z</span>
              </div>
              <div className="overflow-x-auto rounded-xl border border-gray-100">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="bg-gray-50 text-left text-[10px] text-gray-500 uppercase tracking-wider">
                      <th className="py-2 px-3 font-semibold">English</th>
                      <th className="py-2 px-3 font-semibold">O'zbek</th>
                      <th className="py-2 px-3 font-semibold hidden md:table-cell">Example</th>
                    </tr>
                  </thead>
                  <tbody>
                    {g.words.map((v, i) => (
                      <tr key={i} className="border-t border-gray-50">
                        <td className="py-1.5 px-3 font-semibold text-gray-900 text-xs">{v.en}</td>
                        <td className="py-1.5 px-3 text-gray-600 text-xs">{v.uz}</td>
                        <td className="py-1.5 px-3 text-gray-400 italic text-[11px] hidden md:table-cell">{v.example}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )
        })}
        <div className="card bg-primary-50 border-primary-100">
          <p className="text-xs text-primary-700 flex items-center gap-1">
            <Lightbulb size={13} /> So'zlar qoida guruhlariga ajratilgan — guruh bo'lib o'rganish osonroq yodlanadi. <strong>Flashcard</strong> yoki <strong>Test</strong> rejimida sinab ko'ring!
          </p>
        </div>
      </div>
    )
  }

  // ── Flashcard ──
  if (mode === 'flashcard') {
    const word = vocab[cardIdx]
    if (!word) return null
    const isKnown = knownIds.has(cardIdx)
    const remaining = vocab.length - knownIds.size

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-1">
          {(['browse', 'flashcard', 'quiz'] as const).map((m) => (
            <button key={m} onClick={() => { setMode(m); setCardIdx(0); setFlipped(false) }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                mode === m ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {m === 'browse' ? '📖 Ko\'rish' : m === 'flashcard' ? '🃏 Flashcard' : '✍️ Test'}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">{cardIdx + 1} / {vocab.length}</p>
          {remaining > 0 && <p className="text-xs text-green-600 font-medium">✅ {knownIds.size} bilaman</p>}
          {remaining === 0 && <p className="text-xs text-green-600 font-bold">🎉 Hammasini bilasiz!</p>}
        </div>

        <div className="progress-bar">
          <div className="progress-fill bg-primary-500" style={{ width: `${(knownIds.size / vocab.length) * 100}%` }} />
        </div>

        {/* Card */}
        <div
          onClick={() => setFlipped(!flipped)}
          className="cursor-pointer select-none"
        >
          <div className={`relative w-full min-h-[200px] rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center p-6 ${
            flipped
              ? 'bg-primary-50 border-primary-300'
              : 'bg-white border-gray-200 hover:border-primary-300 hover:shadow-md'
          }`}>
            <div className="text-center">
              {!flipped ? (
                <>
                  <p className="text-xs text-gray-400 mb-2">🇬🇧 Inglizcha</p>
                  <p className="text-3xl font-bold text-gray-900 mb-2">{word.en}</p>
                  <p className="text-xs text-gray-400 mt-4">👆 bosing — tarjimasini ko'rish</p>
                </>
              ) : (
                <>
                  <p className="text-xs text-primary-500 mb-2">🇺🇿 O'zbekcha</p>
                  <p className="text-2xl font-bold text-primary-700 mb-2">{word.uz}</p>
                  <p className="text-xs text-gray-500 italic mt-2">"{word.example}"</p>
                  <div className="mt-3">
                    <span className={`badge text-xs ${RULE_LABELS[word.rule]?.color ?? 'bg-gray-100 text-gray-600'}`}>
                      {RULE_EMOJI[word.rule]} {RULE_LABELS[word.rule]?.label ?? word.rule}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-4">👆 bosing — yana yashirish</p>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-center gap-3">
          <button
            onClick={() => {
              if (cardIdx > 0) { setCardIdx((i) => i - 1); setFlipped(false) }
            }}
            disabled={cardIdx === 0}
            className="btn-secondary px-4 py-2 text-sm"
          >
            ← Oldingi
          </button>

          <button
            onClick={() => {
              setKnownIds((prev) => new Set(prev).add(cardIdx))
              if (cardIdx < vocab.length - 1) { setCardIdx((i) => i + 1); setFlipped(false) }
            }}
            disabled={isKnown}
            className="btn-primary px-4 py-2 text-sm"
          >
            {isKnown ? '✅ Bilaman' : 'Bilaman! →'}
          </button>

          <button
            onClick={() => {
              if (cardIdx < vocab.length - 1) { setCardIdx((i) => i + 1); setFlipped(false) }
            }}
            disabled={cardIdx === vocab.length - 1}
            className="btn-secondary px-4 py-2 text-sm"
          >
            Keyingi →
          </button>
        </div>

        <div className="flex flex-wrap gap-1.5 justify-center">
          {vocab.map((_, i) => (
            <button key={i} onClick={() => { setCardIdx(i); setFlipped(false) }}
              className={`w-6 h-6 rounded-full text-[10px] font-bold transition-all ${
                knownIds.has(i) ? 'bg-green-200 text-green-800' :
                i === cardIdx ? 'bg-primary-600 text-white' :
                'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}>
              {i + 1}
            </button>
          ))}
        </div>

        {knownIds.size === vocab.length && (
          <div className="card bg-green-50 border-green-200 text-center py-4">
            <p className="font-bold text-green-700 text-lg">🎉 Tabriklaymiz!</p>
            <p className="text-sm text-green-600">Barcha {vocab.length} ta so'zni o'zlashtirdingiz!</p>
            <button onClick={() => { setMode('quiz'); setCardIdx(0) }} className="btn-primary mt-3 text-sm">
              ✍️ Test rejimida sinab ko'ring
            </button>
          </div>
        )}
      </div>
    )
  }

  // ── Quiz ──
  if (mode === 'quiz') {
    const [quizMode, setQuizMode] = useState<'en2uz' | 'uz2en'>('en2uz')
    const [quizIndex, setQuizIndex] = useState(0)
    const [quizAnswered, setQuizAnswered] = useState(false)
    const [quizCorrect, setQuizCorrect] = useState(false)
    const [quizScore, setQuizScore] = useState(0)
    const [quizDone, setQuizDone] = useState(false)

    const shuffled = useMemo(() => {
      const arr = [...vocab]
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]]
      }
      return arr
    }, [vocab])

    const currentQ = shuffled[quizIndex]
    if (!currentQ) return null

    const allOptions = useMemo(() => {
      if (!currentQ) return []
      const pool = quizMode === 'en2uz' ? vocab.map((v) => v.uz) : vocab.map((v) => v.en)
      const correct = quizMode === 'en2uz' ? currentQ.uz : currentQ.en
      const others = pool.filter((o) => o !== correct).sort(() => Math.random() - 0.5).slice(0, 3)
      const opts = [correct, ...others].sort(() => Math.random() - 0.5)
      return opts
    }, [currentQ, quizMode, vocab])

    const handleQuizAnswer = (opt: string) => {
      if (quizAnswered) return
      const correct = quizMode === 'en2uz' ? currentQ.uz : currentQ.en
      const ok = opt === correct
      setQuizCorrect(ok)
      setQuizAnswered(true)
      if (ok) {
        setQuizScore((s) => s + 1)
        addXP(5)
      }
    }

    const nextQuestion = () => {
      if (quizIndex < shuffled.length - 1) {
        setQuizIndex((i) => i + 1)
        setQuizAnswered(false)
      } else {
        setQuizDone(true)
      }
    }

    if (quizDone) {
      return (
        <div className="space-y-4">
          <div className="flex items-center gap-2 mb-1">
            {(['browse', 'flashcard', 'quiz'] as const).map((m) => (
              <button key={m} onClick={() => { setMode(m); setCardIdx(0); setFlipped(false) }}
                className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                  mode === m ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}>
                {m === 'browse' ? '📖 Ko\'rish' : m === 'flashcard' ? '🃏 Flashcard' : '✍️ Test'}
              </button>
            ))}
          </div>
          <div className="card text-center py-6 bg-gradient-to-b from-green-50 to-white border-green-200">
            <p className="text-5xl mb-2">🏆</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">{quizScore}/{vocab.length}</p>
            <p className="text-sm text-gray-600">
              {quizScore === vocab.length ? 'Mukammal! Barcha so\'zlarni bilasiz!' :
               quizScore >= 15 ? 'Zo\'r! Juda yaxshi natija!' :
               quizScore >= 10 ? 'Yaxshi! Bir oz ko\'proq mashq kerak.' :
               'Qayta urinib ko\'ring — flashcard rejimida o\'rganing.'}
            </p>
            <div className="flex items-center justify-center gap-3 mt-3">
              <button onClick={() => { setQuizIndex(0); setQuizScore(0); setQuizDone(false); setQuizAnswered(false) }}
                className="btn-secondary text-sm">
                <RotateCcw size={14} /> Qayta boshlash
              </button>
              <button onClick={() => { setMode('flashcard'); setCardIdx(0); setFlipped(false) }}
                className="btn-primary text-sm">
                🃏 Flashcard
              </button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        <div className="flex items-center gap-2 mb-1">
          {(['browse', 'flashcard', 'quiz'] as const).map((m) => (
            <button key={m} onClick={() => { setMode(m); setCardIdx(0); setFlipped(false) }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
                mode === m ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}>
              {m === 'browse' ? '📖 Ko\'rish' : m === 'flashcard' ? '🃏 Flashcard' : '✍️ Test'}
            </button>
          ))}
        </div>

        <div className="flex items-center justify-between">
          <div className="flex gap-1">
            <button onClick={() => setQuizMode('en2uz')}
              className={`text-xs font-semibold px-2 py-1 rounded ${quizMode === 'en2uz' ? 'bg-primary-100 text-primary-700' : 'text-gray-400'}`}>
              🇬🇧→🇺🇿
            </button>
            <button onClick={() => setQuizMode('uz2en')}
              className={`text-xs font-semibold px-2 py-1 rounded ${quizMode === 'uz2en' ? 'bg-primary-100 text-primary-700' : 'text-gray-400'}`}>
              🇺🇿→🇬🇧
            </button>
          </div>
          <p className="text-xs text-gray-500">{quizIndex + 1} / {vocab.length}  ·  🏆 {quizScore}</p>
        </div>

        <div className="progress-bar">
          <div className="progress-fill bg-primary-500" style={{ width: `${(quizIndex / vocab.length) * 100}%` }} />
        </div>

        <div className="rounded-2xl border-2 border-primary-200 bg-primary-50 p-6 text-center">
          <p className="text-xs text-gray-400 mb-2">{quizMode === 'en2uz' ? '🇬🇧 Inglizcha' : '🇺🇿 O\'zbekcha'}</p>
          <p className="text-2xl font-bold text-gray-900 mb-2">
            {quizMode === 'en2uz' ? currentQ.en : currentQ.uz}
          </p>
          <div className="mt-2">
            <span className={`badge text-xs ${RULE_LABELS[currentQ.rule]?.color ?? 'bg-gray-100 text-gray-600'}`}>
              {RULE_EMOJI[currentQ.rule]} {RULE_LABELS[currentQ.rule]?.label ?? currentQ.rule}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2">
          {allOptions.map((opt, i) => {
            const correct = quizMode === 'en2uz' ? currentQ.uz : currentQ.en
            let cls = 'border border-gray-200 bg-white text-gray-800 hover:border-primary-400 hover:bg-primary-50'
            if (quizAnswered) {
              if (opt === correct) cls = 'border-green-400 bg-green-100 text-green-800 font-bold'
              else cls = 'border-gray-100 bg-gray-50 text-gray-400'
            }
            return (
              <button key={i} disabled={quizAnswered} onClick={() => handleQuizAnswer(opt)}
                className={`rounded-xl px-3 py-3 text-sm font-medium transition-all ${cls}`}>
                {opt}
              </button>
            )
          })}
        </div>

        {quizAnswered && (
          <div className={`card text-center py-3 ${quizCorrect ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
            <p className={`font-bold ${quizCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {quizCorrect ? '✅ To\'g\'ri! +5 XP' : '❌ Xato'}
            </p>
            {!quizCorrect && (
              <p className="text-xs text-gray-600 mt-1">
                To'g'ri javob: <strong>{quizMode === 'en2uz' ? currentQ.uz : currentQ.en}</strong>
              </p>
            )}
            <p className="text-[11px] text-gray-500 mt-1 italic">"{currentQ.example}"</p>
            <button onClick={nextQuestion} className="btn-primary mt-3 text-sm">
              {quizIndex < shuffled.length - 1 ? 'Keyingi savol →' : '🏁 Yakunlash'}
            </button>
          </div>
        )}
      </div>
    )
  }

  return null
}

// ── Special Case Card (maxsus holatlar uchun) ──────────────────────────────────

function SpecialCaseCard({ sc, addXP }: { sc: import('../data/dailyLessons').SpecialCase; addXP: (n: number) => void }) {
  const [drillAnswers, setDrillAnswers] = useState<Record<number, string[]>>({})
  const [drillSubmitted, setDrillSubmitted] = useState<Record<number, boolean>>({})
  const [drillCorrect, setDrillCorrect] = useState<Record<number, boolean>>({})

  const handleChange = (exId: number, blankIdx: number, val: string) => {
    setDrillAnswers((prev) => {
      const cur = [...(prev[exId] ?? [])]
      cur[blankIdx] = val
      return { ...prev, [exId]: cur }
    })
  }

  const handleSubmit = (ex: import('../data/dailyLessons').DailyExercise) => {
    const userAns = drillAnswers[ex.id] ?? []
    const ok = checkAnswer(ex, userAns)
    setDrillSubmitted((prev) => ({ ...prev, [ex.id]: true }))
    setDrillCorrect((prev) => ({ ...prev, [ex.id]: ok }))
    if (ok) addXP(10)
  }

  const handleRetry = (exId: number) => {
    setDrillSubmitted((prev) => ({ ...prev, [exId]: false }))
    setDrillAnswers((prev) => ({ ...prev, [exId]: [] }))
  }

  return (
    <div className="card border-primary-200 overflow-hidden">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 bg-orange-100 rounded-lg flex items-center justify-center text-sm font-bold text-orange-700 flex-shrink-0">!</div>
        <h3 className="font-bold text-gray-900 text-sm">{sc.title}</h3>
      </div>

      <div className="bg-gradient-to-r from-orange-50 to-amber-50 rounded-xl p-4 mb-3 border border-orange-100">
        <p className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-1.5">Qoida</p>
        <p className="text-sm text-gray-800 font-medium leading-relaxed">{sc.rule}</p>
        <div className="mt-2 flex items-start gap-2">
          <span className="text-xs bg-orange-200 text-orange-800 font-bold px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5">🧠 Eslab qol</span>
          <p className="text-xs text-orange-700 italic">{sc.mnemonic}</p>
        </div>
        <div className="mt-2 flex items-start gap-2">
          <span className="text-xs bg-red-100 text-red-700 font-bold px-1.5 py-0.5 rounded flex-shrink-0 mt-0.5">⚠️ Xato</span>
          <p className="text-xs text-red-600">{sc.commonMistakes}</p>
        </div>
      </div>

      <div className="mb-3 grid grid-cols-1 md:grid-cols-2 gap-1.5">
        {sc.examples.map((ex, i) => (
          <div key={i} className="border-l-[3px] border-primary-300 pl-3 py-1">
            <p className="text-xs font-semibold text-gray-900 leading-relaxed">{ex.en}</p>
            <p className="text-[11px] text-gray-500 italic">{ex.uz}</p>
          </div>
        ))}
      </div>

      <div className="border-t border-gray-100 pt-3 space-y-3">
        <p className="text-xs font-bold text-gray-500 uppercase tracking-wider">🎯 Mashqlar</p>
        {sc.drills.map((ex, i) => {
          const sub = drillSubmitted[ex.id] ?? false
          const ok = drillCorrect[ex.id] ?? false
          const answers = drillAnswers[ex.id] ?? []
          const borderCls = sub ? (ok ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50') : 'border-gray-100'

          return (
            <div key={ex.id} className={`relative rounded-xl border p-3 transition-colors ${borderCls}`}>
              <div className={`absolute -left-2 -top-2 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-sm text-white ${sub ? (ok ? 'bg-green-500' : 'bg-red-500') : 'bg-primary-600'}`}>
                {sub ? (ok ? '✓' : '✗') : i + 1}
              </div>

              <div className="ml-0">
                {ex.type === 'fill-blank' && (
                  <div>
                    <p className="text-[10px] font-bold text-blue-600 uppercase tracking-wider mb-2">📝 Bo'sh joyni to'ldiring</p>
                    <p className="text-xs text-gray-700 leading-loose">
                      {ex.question.split('_____').map((part, pi, arr) => (
                        <span key={pi}>
                          {part}
                          {pi < arr.length - 1 && (
                            <input type="text" value={answers[pi] ?? ''} onChange={(e) => handleChange(ex.id, pi, e.target.value)} disabled={sub} placeholder="___"
                              className={`inline-block border-b-2 w-24 text-center text-xs font-semibold outline-none bg-transparent ${sub ? normalizeAnswer(answers[pi] ?? '') === normalizeAnswer(ex.blanks[pi] ?? '') ? 'border-green-500 text-green-700' : 'border-red-400 text-red-700' : 'border-primary-400 text-primary-700 focus:border-primary-600'}`}
                            />
                          )}
                        </span>
                      ))}
                    </p>
                  </div>
                )}

                {ex.type === 'multiple-choice' && (
                  <div>
                    <p className="text-[10px] font-bold text-violet-600 uppercase tracking-wider mb-2">🔘 To'g'ri variantni tanlang</p>
                    <p className="text-xs font-semibold text-gray-800 mb-2">{ex.question}</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {ex.options.map((opt, oi) => {
                        const selected = answers[0] === opt
                        const correctOpt = opt === ex.correct
                        let cls = 'border border-gray-200 bg-white text-gray-700 hover:border-violet-400'
                        if (sub) {
                          if (correctOpt) cls = 'border-green-400 bg-green-100 text-green-800 font-bold'
                          else if (selected) cls = 'border-red-400 bg-red-100 text-red-700'
                          else cls = 'border-gray-100 bg-gray-50 text-gray-400'
                        } else if (selected) {
                          cls = 'border-violet-500 bg-violet-100 text-violet-800 font-semibold'
                        }
                        return (
                          <button key={opt} disabled={sub} onClick={() => handleChange(ex.id, 0, opt)}
                            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs transition-all ${cls}`}>
                            <span className="w-4 h-4 rounded-full border border-current flex items-center justify-center text-[9px] font-bold flex-shrink-0">{['A','B','C','D'][oi]}</span>
                            {opt}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )}

                {ex.type === 'error-correction' && (
                  <div>
                    <p className="text-[10px] font-bold text-amber-600 uppercase tracking-wider mb-2">🔍 Xatoni toping</p>
                    <div className="bg-white border border-amber-200 rounded-lg px-2.5 py-1.5 mb-2">
                      <p className="text-xs text-gray-700">
                        {ex.question.split(ex.errorPart).map((part, pi, arr) => (
                          <span key={pi}>{part}{pi < arr.length - 1 && <span className="bg-red-100 text-red-700 font-bold px-0.5 rounded">{ex.errorPart}</span>}</span>
                        ))}
                      </p>
                    </div>
                    <input type="text" value={answers[0] ?? ''} onChange={(e) => handleChange(ex.id, 0, e.target.value)} disabled={sub} placeholder="To'g'ri variant..." className="input text-xs" />
                  </div>
                )}

                {ex.type === 'transformation' && (
                  <div>
                    <p className="text-[10px] font-bold text-teal-600 uppercase tracking-wider mb-2">🔄 Gapni o'zgartiring</p>
                    <div className="bg-white border border-teal-200 rounded-lg px-2.5 py-1.5 mb-1">
                      <p className="text-xs text-gray-800 font-medium">{ex.question}</p>
                    </div>
                    <p className="text-[10px] text-teal-600 mb-1 font-medium">Boshlang'ich: <span className="font-mono font-bold">{ex.hint}</span></p>
                    <input type="text" value={answers[0] ?? ''} onChange={(e) => handleChange(ex.id, 0, e.target.value)} disabled={sub} placeholder="Javob..." className="input text-xs" />
                  </div>
                )}
              </div>

              {!sub ? (
                <button onClick={() => handleSubmit(ex)} className="mt-2 text-xs bg-primary-600 text-white px-3 py-1 rounded-lg font-semibold hover:bg-primary-700 transition-colors">
                  Tekshirish +10 XP
                </button>
              ) : (
                <div className={`mt-2 text-xs ${ok ? 'text-green-700' : 'text-red-700'}`}>
                  {ok ? '✅ To\'g\'ri! +10 XP' : <><span className="font-semibold">❌ Xato. </span><span className="text-gray-600">{ex.explanation}</span></>}
                  <button onClick={() => handleRetry(ex.id)} className="ml-2 text-primary-600 underline hover:no-underline">Qayta urinish</button>
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

type Answers = Record<number, string[]>

function LessonView({
  lesson, onBack,
}: {
  lesson: DailyLesson
  onBack: () => void
}) {
  const { addXP, updateSkillProgress, setLessonProgress } = useStore()
  const [tab, setTab] = useState<'grammar' | 'vocab' | 'examples' | 'special' | 'exercises'>('grammar')
  const [currentSection, setCurrentSection] = useState(0)
  const [answers, setAnswers] = useState<Answers>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [cumulativeScore, setCumulativeScore] = useState(0)
  const [completedSections, setCompletedSections] = useState<Record<number, number>>({})
  const [prevScore, setPrevScore] = useState<number | null>(null)

  const section = lesson.exerciseSections[currentSection]
  const sectionExercises = lesson.exercises.filter((ex) => section?.ids.includes(ex.id))
  const isLastSection = currentSection === lesson.exerciseSections.length - 1

  useEffect(() => {
    getLessonProgress(lesson.id, getTodayTashkent()).then((p) => {
      if (p !== null) setPrevScore(p)
    })
  }, [lesson.id])

  const handleChangeAnswer = (exId: number, blankIdx: number, val: string) => {
    setAnswers((prev) => {
      const cur = [...(prev[exId] ?? [])]
      cur[blankIdx] = val
      return { ...prev, [exId]: cur }
    })
  }

  const handleSubmitSection = async () => {
    let correct = 0
    for (const ex of sectionExercises) {
      const userAns = answers[ex.id] ?? []
      if (checkAnswer(ex, userAns)) correct++
    }
    setScore(correct)
    setSubmitted(true)
    setCompletedSections((prev) => ({ ...prev, [currentSection]: correct }))
    setCumulativeScore((prev) => prev + correct)
    addXP(correct * 10)

    if (isLastSection) {
      const totalCorrect = cumulativeScore + correct + Object.values(completedSections).reduce((a, b) => a + b, 0)
      const total = lesson.exercises.length
      const totalPct = Math.round((totalCorrect / total) * 100)
      setLessonProgress(lesson.id, totalPct)
      updateSkillProgress('todayGrammarPct', totalPct)
      await pushLessonProgress(lesson.id, totalCorrect, total)
    }
  }

  const handleNextSection = () => {
    setAnswers({})
    setSubmitted(false)
    setScore(0)
    setCurrentSection((prev) => prev + 1)
    setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50)
  }

  const handleRetrySection = () => {
    setAnswers({})
    setSubmitted(false)
    setScore(0)
  }

  const tabs = [
    { id: 'grammar',  label: '📚 Grammar',   desc: 'Qoidalar va formulalar' },
    { id: 'vocab',    label: '📝 Lug\'at',   desc: `${lesson.vocabulary.length} ta so'z` },
    { id: 'examples', label: '📖 Misollar',  desc: `${lesson.examples.length} ta gap` },
    { id: 'special',  label: '🎯 Maxsus',    desc: `${lesson.specialCases.length} ta mavzu` },
    { id: 'exercises', label: '✍️ Mashqlar', desc: `${lesson.exercises.length} ta` },
  ] as const

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onBack} className="btn-ghost flex items-center gap-1 text-sm">
          <ArrowLeft size={16} /> Boshqa dars
        </button>
        <div className="h-5 w-px bg-gray-200" />
        <span className="badge border bg-gray-100 text-gray-600 border-gray-200">{lesson.level}</span>
        <span className="text-xs text-gray-400">Kun {lesson.day}</span>
        {prevScore !== null && (
          <span className={`badge text-xs font-bold ${
            prevScore >= 80 ? 'bg-green-100 text-green-700' :
            prevScore >= 50 ? 'bg-yellow-100 text-yellow-700' :
            'bg-red-100 text-red-700'
          }`}>
            {prevScore}% ✅
          </span>
        )}
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-900">{lesson.title}</h1>
        <p className="text-gray-500 text-sm mt-1">{lesson.subtitle}</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-100 pb-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setSubmitted(false) }}
            className={`pb-3 px-4 text-sm font-semibold border-b-2 transition-all ${
              tab === t.id
                ? 'border-primary-600 text-primary-700'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            <span className="hidden sm:inline">{t.label}</span>
            <span className="sm:hidden">{t.desc}</span>
          </button>
        ))}
      </div>

      {/* ── Tab: Grammar ── */}
      {tab === 'grammar' && (
        <div className="space-y-5">
          <div className="bg-gradient-to-br from-primary-600 to-b2-600 rounded-2xl p-5 text-white">
            <p className="text-xs font-semibold opacity-70 mb-3 uppercase tracking-wider">
              Formulalar
            </p>
            <div className="grid grid-cols-1 gap-2">
              {lesson.formulas.map((row) => {
                const s = COLOR_STYLES[row.color] ?? COLOR_STYLES.blue
                return (
                  <div
                    key={row.label}
                    className={`flex items-center gap-3 ${s.bg} ${s.border} border rounded-xl px-3 py-2`}
                  >
                    <span className={`text-xs font-semibold ${s.text} w-32 flex-shrink-0`}>
                      {row.label}
                    </span>
                    <span className={`font-mono text-sm font-bold ${s.text}`}>{row.structure}</span>
                  </div>
                )
              })}
            </div>
          </div>

          <div className="card">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
              Qoidalar
            </p>
            <ul className="space-y-2">
              {lesson.rules.map((r, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                  <span className="text-primary-500 mt-0.5 flex-shrink-0">✦</span>
                  {r}
                </li>
              ))}
            </ul>
          </div>

          <div className="card border-primary-200">
            <p className="text-xs font-bold text-primary-600 uppercase tracking-wider mb-3 flex items-center gap-1">
              <Star size={14} /> Tezkor eslatma — yodda saqlash uchun
            </p>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b-2 border-primary-200 text-left text-xs text-primary-700 uppercase tracking-wider">
                    <th className="pb-2 pr-3">Sifat turi</th>
                    <th className="pb-2 pr-3">Comparative</th>
                    <th className="pb-2 pr-3">Superlative</th>
                    <th className="pb-2">Misol</th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { type: '1 bo\'g\'in (qisqa)', comp: 'adj + -er', sup: 'the adj + -est', ex: 'tall → taller → the tallest' },
                    { type: '-y bilan tugagan',   comp: '-y → -i + -er', sup: 'the -y → -i + -est', ex: 'happy → happier → the happiest' },
                    { type: 'CVC (undosh+unli+undosh)', comp: 'undosh ikki marta + -er', sup: 'the undosh×2 + -est', ex: 'big → bigger → the biggest' },
                    { type: '-e bilan tugagan',   comp: 'adj + -r', sup: 'the adj + -st', ex: 'large → larger → the largest' },
                    { type: '2+ bo\'g\'in (uzun)', comp: 'more + adj', sup: 'the most + adj', ex: 'expensive → more expensive → the most expensive' },
                    { type: 'Noto\'g\'ri', comp: 'maxsus shakl', sup: 'maxsus shakl', ex: 'good → better → the best' },
                  ].map((r) => (
                    <tr key={r.type} className="border-b border-gray-50">
                      <td className="py-1.5 pr-3 font-semibold text-gray-800 text-xs">{r.type}</td>
                      <td className="py-1.5 pr-3 font-mono text-xs text-purple-700">{r.comp}</td>
                      <td className="py-1.5 pr-3 font-mono text-xs text-indigo-700">{r.sup}</td>
                      <td className="py-1.5 font-mono text-xs text-gray-600">{r.ex}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="card bg-gradient-to-r from-primary-50 to-b2-50 border-primary-100">
            <p className="text-sm text-primary-800 font-medium flex items-center gap-2">
              <Lightbulb size={16} />
              Keyingi bosqichda <strong>{lesson.vocabulary.length} ta so'z</strong> va <strong>{lesson.exercises.length} ta mashq</strong> bor. Har to'g'ri javob <strong>+10 XP</strong>.
            </p>
          </div>
        </div>
      )}

      {/* ── Tab: Vocabulary ── */}
      {tab === 'vocab' && (
        <VocabLearner vocab={lesson.vocabulary} addXP={addXP} />
      )}

      {/* ── Tab: Examples ── */}
      {tab === 'examples' && (
        <div className="card">
          <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">
            Misollar
          </p>
          <div className="space-y-3">
            {lesson.examples.map((ex, i) => (
              <div key={i} className="border-l-4 border-primary-300 pl-4">
                <p className="font-semibold text-gray-900 text-sm leading-relaxed">{ex.en}</p>
                <p className="text-xs text-gray-500 mt-0.5 italic">{ex.uz}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── Tab: Maxsus holatlar ── */}
      {tab === 'special' && (
        <div className="space-y-6">
          <p className="text-xs font-bold text-primary-600 uppercase tracking-wider flex items-center gap-1">
            <Star size={14} /> Maxsus holatlar — yodda saqlash uchun alohida e'tibor
          </p>
          {lesson.specialCases.map((sc) => (
            <SpecialCaseCard key={sc.id} sc={sc} addXP={addXP} />
          ))}
        </div>
      )}

      {/* ── Tab: Exercises ── */}
      {tab === 'exercises' && (
        <div className="space-y-4">
          {/* Progress bar — bosqichlar */}
          <div className="flex items-center gap-1.5">
            {lesson.exerciseSections.map((s, i) => {
              const done = completedSections[i] !== undefined
              const active = i === currentSection
              return (
                <div key={s.title} className="flex-1">
                  <div
                    className={`h-1.5 rounded-full transition-all ${
                      done ? 'bg-green-500' : active ? 'bg-primary-500' : 'bg-gray-200'
                    }`}
                  />
                  <p className={`text-[9px] mt-0.5 text-center font-medium ${
                    active ? 'text-primary-700' : done ? 'text-green-600' : 'text-gray-400'
                  }`}>
                    {s.icon} {active && <span className="hidden sm:inline">{s.title}</span>}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Bosqich sarlavhasi */}
          {section && (
            <div className={`rounded-xl p-4 text-white ${section.color}`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-semibold opacity-80">Bosqich {currentSection + 1} / {lesson.exerciseSections.length}</p>
                  <p className="font-bold text-lg">{section.icon} {section.title}</p>
                  <p className="text-sm opacity-80">{section.desc}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold">{sectionExercises.length}</p>
                  <p className="text-xs opacity-80">ta mashq</p>
                </div>
              </div>
            </div>
          )}

          {submitted ? (
            /* Bosqich natijasi */
            <div className={`card border text-center py-5 ${
              score >= 8 ? 'bg-green-50 border-green-200' :
              score >= 5 ? 'bg-yellow-50 border-yellow-200' :
              'bg-red-50 border-red-200'
            }`}>
              <p className={`text-3xl font-bold font-mono ${
                score >= 8 ? 'text-green-600' :
                score >= 5 ? 'text-yellow-600' :
                'text-red-500'
              } mb-1`}>
                {score}<span className="text-lg text-gray-400">/{sectionExercises.length}</span>
              </p>
              <p className="text-sm text-gray-600 mb-2">
                {score === sectionExercises.length ? '🎯 Mukammal! Hech qanday xato yo\'q!' :
                 score >= 8 ? '👍 Zo\'r! Davom eting!' :
                 score >= 5 ? '📚 Yaxshi, biroz ko\'proq e\'tibor kerak' :
                 '💪 Qiyin bo\'ldimi? Qayta urinib ko\'ring'}
              </p>
              <div className="flex items-center justify-center gap-3 text-xs">
                <span className="flex items-center gap-1 text-yellow-600 font-bold">
                  <Trophy size={14} /> +{score * 10} XP
                </span>
                <span className="flex items-center gap-1 text-green-600">
                  <CheckCircle size={14} /> {score}
                </span>
                <span className="flex items-center gap-1 text-red-500">
                  <XCircle size={14} /> {sectionExercises.length - score}
                </span>
              </div>

              <div className="flex gap-2 mt-4">
                <button onClick={handleRetrySection} className="btn-secondary flex-1 text-sm py-2">
                  <RotateCcw size={14} /> Qayta urinish
                </button>
                {!isLastSection && (
                  <button onClick={handleNextSection} className="btn-primary flex-1 text-sm py-2">
                    Keyingi bosqich <ChevronRight size={14} />
                  </button>
                )}
              </div>
            </div>
          ) : (
            <>
              {/* Mashqlar */}
              <div className="space-y-4">
                {sectionExercises.map((ex, i) => (
                  <ExerciseCard
                    key={ex.id}
                    ex={ex}
                    num={i + 1}
                    answers={answers[ex.id] ?? []}
                    onChange={(blankIdx, val) => handleChangeAnswer(ex.id, blankIdx, val)}
                    submitted={false}
                  />
                ))}
              </div>

              <button
                onClick={handleSubmitSection}
                className="btn-primary w-full flex items-center justify-center gap-2 py-3"
              >
                <CheckCircle size={18} />
                Tekshirish (+{sectionExercises.length * 10} XP)
              </button>
            </>
          )}

          {/* Umumiy progress */}
          {Object.keys(completedSections).length > 0 && (
            <div className="card bg-gray-50 border-gray-100 text-center">
              <p className="text-xs text-gray-500">
                Umumiy: {Object.values(completedSections).reduce((a, b) => a + b, 0) + (submitted && isLastSection ? score : 0)} / {lesson.exercises.length} ta to'g'ri
                {' · '}
                {lesson.exerciseSections.filter((_, i) => completedSections[i] !== undefined).length + (submitted && isLastSection ? 1 : 0)} / {lesson.exerciseSections.length} bosqich
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default function DailyLesson() {
  const [selected, setSelected] = useState<string | null>(null)
  const lessonScores = useStore((s) => s.lessonProgress)
  const lessons = useStore((s) => s.lessons)
  const lessonsLoading = useStore((s) => s.lessonsLoading)
  const lessonsFetched = useStore((s) => s.lessonsFetched)
  const fetchAndSetLessons = useStore((s) => s.fetchAndSetLessons)

  useEffect(() => {
    if (!lessonsFetched && !lessonsLoading) fetchAndSetLessons()
  }, [lessonsFetched, lessonsLoading, fetchAndSetLessons])

  if (selected) {
    const lesson = lessons.find((l) => l.id === selected)
    if (lesson) return <LessonView lesson={lesson} onBack={() => setSelected(null)} />
  }

  if (lessonsLoading) {
    return (
      <div className="p-6 max-w-4xl mx-auto flex items-center justify-center min-h-[300px]">
        <div className="text-gray-400 animate-pulse">Darslar yuklanmoqda...</div>
      </div>
    )
  }

  if (lessons.length === 0) {
    return (
      <div className="p-6 max-w-4xl mx-auto flex items-center justify-center min-h-[300px]">
        <p className="text-gray-400">Hozircha darslar mavjud emas. Supabase seed SQL'ni ishga tushiring.</p>
      </div>
    )
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
          <Sparkles size={20} className="text-primary-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Kunlik Darslar</h1>
          <p className="text-xs text-gray-500">Har kuni yangi mavzu — qoida, so'zlar va mashqlar</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {lessons.map((lesson) => {
          const pct = lessonScores[lesson.id]
          return (
          <button
            key={lesson.id}
            onClick={() => setSelected(lesson.id)}
            className="card-hover text-left flex flex-col gap-3 p-5 group"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="w-8 h-8 bg-primary-100 rounded-lg flex items-center justify-center font-bold text-primary-700 text-sm">
                  {lesson.day}
                </span>
                <div>
                  <h3 className="font-bold text-gray-900 text-base leading-tight">{lesson.title}</h3>
                  <p className="text-xs text-gray-500 mt-0.5">{lesson.subtitle}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {pct !== undefined && (
                  <span className={`badge text-xs font-bold ${
                    pct >= 80 ? 'bg-green-100 text-green-700' :
                    pct >= 50 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {pct}%
                  </span>
                )}
                <span className="badge border bg-gray-100 text-gray-600 border-gray-200">{lesson.level}</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-gray-400">
              <span>📚 {lesson.formulas.length} formula</span>
              <span>📝 {lesson.vocabulary.length} ta so'z</span>
              <span>✍️ {lesson.exercises.length} ta mashq</span>
              <span>+{lesson.exercises.length * 10} XP</span>
            </div>

            <div className="flex items-center gap-1.5 text-primary-600 font-semibold text-sm group-hover:gap-3 transition-all">
              {pct !== undefined ? 'Davom etish' : 'Boshlash'} <ChevronRight size={15} />
            </div>
          </button>
          )
        })}
      </div>

      <div className="card bg-gradient-to-r from-primary-50 to-b2-50 border-primary-100">
        <p className="text-sm text-primary-800 font-medium flex items-center gap-2">
          <Lightbulb size={16} />
          Har bir darsda: grammatika qoidalari, lug'at, misollar va 20 ta mashq. Barchasini bajaring!
        </p>
      </div>
    </div>
  )
}
