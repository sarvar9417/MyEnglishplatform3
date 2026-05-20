import { useState, useEffect, useMemo, useRef } from 'react'
import {
  ArrowLeft, CheckCircle, XCircle, Star,
  Sparkles, RotateCcw, ChevronRight, Lightbulb, Trophy,
  BookOpen,
} from 'lucide-react'
import type { DailyLesson, DailyExercise } from '../data/dailyLessons'
import { useStore } from '../store/useStore'
import {
  pushLessonProgress, pushTestProgress, getLessonProgress,
  loadLessonSessionFromDB, saveExerciseAnswersToDB,
  saveViewedTabsToDB, loadViewedTabsFromDB,
  loadLessonVocabProgressFromDB, saveLessonVocabProgressToDB,
} from '../services/lessonService'
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
            {ex.question.split(/_{3,}/).map((part, i, arr) => (
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
                <>
                  <p className="font-semibold">✍️ Sizning javobingiz: <span className="font-mono">{answers.join(' / ') || "(bo'sh)"}</span></p>
                  <p className="font-semibold">✅ To'g'ri javob: <span className="font-mono">{ex.blanks.join(' / ')}</span></p>
                </>
              )}
              {isCorrect && <p className="font-semibold">✅ To'g'ri! +10 XP</p>}
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
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
          {submitted && (
            <div className={`mt-3 text-xs ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {!isCorrect && (
                <>
                  <p className="font-semibold">✍️ Sizning javobingiz: <span className="font-mono">{answers[0] || "(tanlanmadi)"}</span></p>
                  <p className="font-semibold">✅ To'g'ri javob: <span className="font-mono">{ex.correct}</span></p>
                </>
              )}
              {isCorrect && <p className="font-semibold">✅ To'g'ri! +10 XP</p>}
              <p className="mt-1 text-gray-600">💡 {ex.explanation}</p>
            </div>
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
                <>
                  <p className="font-semibold">✍️ Sizning javobingiz: <span className="font-mono">{answers[0] || "(bo'sh)"}</span></p>
                  <p className="font-semibold">✅ To'g'ri variant: <span className="font-mono">{ex.correct}</span></p>
                </>
              )}
              {isCorrect && <p className="font-semibold">✅ To'g'ri! +10 XP</p>}
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
                <>
                  <p className="font-semibold">✍️ Sizning javobingiz: <span className="font-mono">{answers[0] || "(bo'sh)"}</span></p>
                  <p className="font-semibold">✅ Namuna javob: <span className="font-mono">{ex.correct}</span></p>
                </>
              )}
              {isCorrect && <p className="font-semibold">✅ To'g'ri! +10 XP</p>}
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
            <div className={`mt-3 text-xs ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
              {!isCorrect && (
                <>
                  <p className="font-semibold">✍️ Sizning javobingiz:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {ex.rows.map((row, rowIdx) => {
                      const compAns = answers[rowIdx * 2] ?? ''
                      const supAns = answers[rowIdx * 2 + 1] ?? ''
                      const compOk = normalizeAnswer(compAns) === normalizeAnswer(row.comp)
                      const supOk = normalizeAnswer(supAns) === normalizeAnswer(row.sup)
                      return (
                        <div key={rowIdx} className={`text-xs px-2 py-1 rounded ${(!compOk || !supOk) ? 'bg-red-50' : 'bg-green-50'}`}>
                          <span className="font-semibold">{row.adj}</span>
                          {row.comp && <span className={`ml-1 ${compOk ? 'text-green-600' : 'text-red-500'}`}>C: {compAns || '—'}</span>}
                          {row.sup && <span className={`ml-1 ${supOk ? 'text-green-600' : 'text-red-500'}`}>S: {supAns || '—'}</span>}
                        </div>
                      )
                    })}
                  </div>
                  <p className="font-semibold mt-2">✅ To'g'ri javob:</p>
                  <div className="flex flex-wrap gap-2 mt-1">
                    {ex.rows.map((row, rowIdx) => {
                      const compOk = normalizeAnswer(answers[rowIdx * 2] ?? '') === normalizeAnswer(row.comp)
                      const supOk = normalizeAnswer(answers[rowIdx * 2 + 1] ?? '') === normalizeAnswer(row.sup)
                      if (compOk && supOk) return null
                      return (
                        <div key={rowIdx} className="text-xs px-2 py-1 rounded bg-green-50">
                          <span className="font-semibold text-gray-800">{row.adj}</span>
                          {!compOk && <span className="ml-1 text-green-600">C: {row.comp}</span>}
                          {!supOk && <span className="ml-1 text-green-600">S: {row.sup}</span>}
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
              {isCorrect && <p className="font-semibold">✅ To'g'ri! +10 XP</p>}
              <p className="mt-1 text-gray-600">💡 {ex.explanation}</p>
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

function VocabLearner({ vocab, addXP, lessonId }: { vocab: { en: string; uz: string; example: string; rule: string }[]; addXP: (n: number) => void; lessonId: string }) {
  const [mode, setMode] = useState<'browse' | 'flashcard' | 'vocabTest'>('browse')
  const [cardIdx, setCardIdx] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [knownIds, setKnownIds] = useState<Set<number>>(new Set())

  // Test state (defined at top level to avoid hooks-in-conditionals issues)
  const [testSectionIdx, setTestSectionIdx] = useState(0)
  const [testIdx, setTestIdx] = useState(0)
  const [testScore, setTestScore] = useState(0)
  const [testResults, setTestResults] = useState<Record<number, boolean>>({})
  const [testSubmitted, setTestSubmitted] = useState<Record<number, boolean>>({})
  const [testDone, setTestDone] = useState(false)
  const [testShuffleKey, setTestShuffleKey] = useState(0)

  // Persist vocab progress to localStorage
  const storageKey = `vocab-progress-${lessonId}`

  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (!saved) {
        // Fallback: load known words from Supabase
        loadLessonVocabProgressFromDB(lessonId).then(items => {
          if (items.length > 0) {
            const knownIdsArr = items.filter(i => i.known).map(i => i.wordIndex)
            if (knownIdsArr.length > 0) setKnownIds(new Set(knownIdsArr))
          }
        })
        return
      }
      const data = JSON.parse(saved)
      if (data.knownIds) setKnownIds(new Set(data.knownIds))
      if (data.testScore != null) setTestScore(data.testScore)
      if (data.testSectionIdx != null) setTestSectionIdx(data.testSectionIdx)
      if (data.testIdx != null) setTestIdx(data.testIdx)
      if (data.testResults) setTestResults(data.testResults)
      if (data.testSubmitted) setTestSubmitted(data.testSubmitted)
      if (data.testDone != null) setTestDone(data.testDone)
      if (data.testShuffleKey != null) setTestShuffleKey(data.testShuffleKey)
    } catch { /* ignore parse errors */ }
  }, [storageKey, lessonId])

  const prevStateRef = useRef({ knownIds, testScore, testSectionIdx, testIdx, testResults, testSubmitted, testDone, testShuffleKey })
  useEffect(() => {
    const cur = { knownIds, testScore, testSectionIdx, testIdx, testResults, testSubmitted, testDone, testShuffleKey }
    if (JSON.stringify(cur) === JSON.stringify(prevStateRef.current)) return
    prevStateRef.current = cur
    try {
      localStorage.setItem(storageKey, JSON.stringify({
        knownIds: [...knownIds],
        testScore,
        testSectionIdx,
        testIdx,
        testResults,
        testSubmitted,
        testDone,
        testShuffleKey,
      }))
    } catch { /* ignore quota errors */ }
  }, [knownIds, testScore, testSectionIdx, testIdx, testResults, testSubmitted, testDone, testShuffleKey, storageKey])

  // Sync knownIds to Supabase when they change
  useEffect(() => {
    if (knownIds.size === 0) return
    const items = [...knownIds].map(wordIndex => ({
      wordIndex,
      known: true,
      quizCorrect: 0,
      quizWrong: 0,
    }))
    saveLessonVocabProgressToDB(lessonId, items)
  }, [knownIds, lessonId])

  const testSections = useMemo(() => [
    { title: '🇬🇧→🇺🇿', desc: 'Inglizcha so\'zni o\'zbekcha tarjimasini toping', ids: [] as number[], icon: '🌱' },
    { title: '🇺🇿→🇬🇧', desc: 'O\'zbekcha so\'zni inglizcha tarjimasini toping', ids: [] as number[], icon: '📘' },
    { title: '📝 Misol', desc: 'So\'zning to\'g\'ri qo\'llanilishini toping', ids: [] as number[], icon: '💪' },
    { title: '🏆 Aralash', desc: 'Barcha turdagi savollar aralash', ids: [] as number[], icon: '🏆' },
  ], [])

  const allQuestions = useMemo(() => {
    const qs: { section: number; stem: string; options: string[]; correct: string; word: typeof vocab[0] }[] = []
    const shuffled = [...vocab].sort(() => Math.random() - 0.5)
    shuffled.forEach((v) => {
      const others = vocab.filter(o => o.uz !== v.uz).sort(() => Math.random() - 0.5)
      const distractUz = others.slice(0, 3).map(o => o.uz)
      const distractEn = others.slice(0, 3).map(o => o.en)

      qs.push({
        section: 0, stem: v.en,
        options: [v.uz, ...distractUz].sort(() => Math.random() - 0.5),
        correct: v.uz, word: v,
      })
      qs.push({
        section: 1, stem: v.uz,
        options: [v.en, ...distractEn].sort(() => Math.random() - 0.5),
        correct: v.en, word: v,
      })
      const blanked = v.example.replace(v.en, '______')
      if (blanked !== v.example) {
        const disturbEx = others.slice(0, 3).map(o => o.en)
        qs.push({
          section: 2, stem: blanked,
          options: [v.en, ...disturbEx].sort(() => Math.random() - 0.5),
          correct: v.en, word: v,
        })
      }
    })

    const shuffledQs = qs.sort(() => Math.random() - 0.5)
    const sectionSize = Math.ceil(shuffledQs.length / 4)
    testSections.forEach((_, si) => {
      const start = si * sectionSize
      const end = start + sectionSize
      testSections[si].ids = shuffledQs.slice(start, end).map((_, qi) => start + qi)
    })

    return shuffledQs
  }, [vocab, testShuffleKey])

  const currentSectionQuestions = useMemo(() => {
    const ids = testSections[testSectionIdx]?.ids ?? []
    return ids.map(i => allQuestions[i]).filter(Boolean)
  }, [testSectionIdx, allQuestions, testSections])

  const currentQ = currentSectionQuestions[testIdx]

  const handleTestAnswer = (opt: string) => {
    if (!currentQ || testSubmitted[testIdx]) return
    const ok = opt === currentQ.correct
    setTestResults(prev => ({ ...prev, [testIdx]: ok }))
    setTestSubmitted(prev => ({ ...prev, [testIdx]: true }))
    if (ok) {
      setTestScore(s => s + 1)
      addXP(5)
    }
  }

  const nextTest = () => {
    if (testIdx < currentSectionQuestions.length - 1) {
      setTestIdx(i => i + 1)
    } else if (testSectionIdx < testSections.length - 1) {
      setTestSectionIdx(si => si + 1)
      setTestIdx(0)
      setTestResults({})
      setTestSubmitted({})
    } else {
      setTestDone(true)
    }
  }

  const retakeTest = () => {
    setTestShuffleKey(k => k + 1)
    setTestSectionIdx(0)
    setTestIdx(0)
    setTestScore(0)
    setTestResults({})
    setTestSubmitted({})
    setTestDone(false)
  }

  const startTest = () => {
    setMode('vocabTest')
    setCardIdx(0)
    setFlipped(false)
    setTestShuffleKey(k => k + 1)
    setTestSectionIdx(0)
    setTestIdx(0)
    setTestScore(0)
    setTestResults({})
    setTestSubmitted({})
    setTestDone(false)
  }

  const mods = [
    { key: 'browse', label: '📖 Ko\'rish' },
    { key: 'flashcard', label: '🃏 Flashcard' },
    { key: 'vocabTest', label: '✍️ Test' },
  ] as const

  const tabBar = (
    <div className="flex items-center gap-2 mb-1">
      {mods.map(m => (
        <button key={m.key} onClick={m.key === 'vocabTest' ? startTest : () => { setMode(m.key); setCardIdx(0); setFlipped(false) }}
          className={`text-xs font-semibold px-3 py-1.5 rounded-full transition-all ${
            mode === m.key ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
          }`}>
          {m.label}
        </button>
      ))}
    </div>
  )

  const mappedRules = new Set(RULE_ORDER)
  const allRules = [...new Set(vocab.map((v) => v.rule))]
  const grouped = [
    ...RULE_ORDER
      .filter((r) => vocab.some((v) => v.rule === r))
      .map((r) => ({ rule: r, words: vocab.filter((v) => v.rule === r) })),
    ...allRules
      .filter((r) => !mappedRules.has(r))
      .map((r) => ({ rule: r, words: vocab.filter((v) => v.rule === r) })),
  ]

  // ── Browse ──
  if (mode === 'browse') {
    return (
      <div className="space-y-4">
        {tabBar}
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
        {tabBar}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">{cardIdx + 1} / {vocab.length}</p>
          {remaining > 0 && <p className="text-xs text-green-600 font-medium">✅ {knownIds.size} bilaman</p>}
          {remaining === 0 && <p className="text-xs text-green-600 font-bold">🎉 Hammasini bilasiz!</p>}
        </div>
        <div className="progress-bar">
          <div className="progress-fill bg-primary-500" style={{ width: `${(knownIds.size / vocab.length) * 100}%` }} />
        </div>
        <div onClick={() => setFlipped(!flipped)} className="cursor-pointer select-none">
          <div className={`relative w-full min-h-[200px] rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center p-3 sm:p-6 ${
            flipped ? 'bg-primary-50 border-primary-300' : 'bg-white border-gray-200 hover:border-primary-300 hover:shadow-md'
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
        <div className="flex items-center justify-center gap-3">
          <button onClick={() => { if (cardIdx > 0) { setCardIdx(i => i - 1); setFlipped(false) } }}
            disabled={cardIdx === 0} className="btn-secondary px-4 py-2 text-sm">← Oldingi</button>
          <button onClick={() => {
            setKnownIds(prev => new Set(prev).add(cardIdx))
            if (cardIdx < vocab.length - 1) { setCardIdx(i => i + 1); setFlipped(false) }
          }} disabled={isKnown} className="btn-primary px-4 py-2 text-sm">
            {isKnown ? '✅ Bilaman' : 'Bilaman! →'}
          </button>
          <button onClick={() => { if (cardIdx < vocab.length - 1) { setCardIdx(i => i + 1); setFlipped(false) } }}
            disabled={cardIdx === vocab.length - 1} className="btn-secondary px-4 py-2 text-sm">Keyingi →</button>
        </div>
        <div className="flex flex-wrap gap-1.5 justify-center">
          {vocab.map((_, i) => (
            <button key={i} onClick={() => { setCardIdx(i); setFlipped(false) }}
              className={`w-6 h-6 rounded-full text-[10px] font-bold transition-all ${
                knownIds.has(i) ? 'bg-green-200 text-green-800' :
                i === cardIdx ? 'bg-primary-600 text-white' :
                'bg-gray-100 text-gray-400 hover:bg-gray-200'
              }`}>{i + 1}</button>
          ))}
        </div>
        {knownIds.size === vocab.length && (
          <div className="card bg-green-50 border-green-200 text-center py-4">
            <p className="font-bold text-green-700 text-lg">🎉 Tabriklaymiz!</p>
            <p className="text-sm text-green-600">Barcha {vocab.length} ta so'zni o'zlashtirdingiz!</p>
            <button onClick={startTest} className="btn-primary mt-3 text-sm">
              ✍️ Test rejimida sinab ko'ring
            </button>
          </div>
        )}
      </div>
    )
  }

  // ── VOCAB TEST ──
  if (mode === 'vocabTest') {
    if (vocab.length === 0) {
      return <div className="card text-center py-6 text-gray-500">Bu darsda lug'at so'zlari mavjud emas.</div>
    }

    if (testDone) {
      const total = allQuestions.length
      const pct = total > 0 ? Math.round((testScore / total) * 100) : 0
      return (
        <div className="space-y-4">
          {tabBar}
          <div className="card text-center py-6 bg-gradient-to-b from-green-50 to-white border-green-200">
            <p className="text-5xl mb-2">🏆</p>
            <p className="text-2xl font-bold text-gray-900 mb-1">{testScore}/{total}</p>
            <p className="text-lg font-bold text-primary-600 mb-2">{pct}%</p>
            <p className="text-sm text-gray-600">
              {pct === 100 ? 'Mukammal! Barcha so\'zlarni bilasiz!' :
               pct >= 80 ? 'Zo\'r! Juda yaxshi natija!' :
               pct >= 60 ? 'Yaxshi! Bir oz ko\'proq mashq kerak.' :
               'Qayta urinib ko\'ring — flashcard rejimida o\'rganing.'}
            </p>
            <div className="flex items-center justify-center gap-3 mt-3">
              <button onClick={retakeTest} className="btn-secondary text-sm">
                <RotateCcw size={14} /> Qayta boshlash
              </button>
              <button onClick={() => setMode('flashcard')} className="btn-primary text-sm">🃏 Flashcard</button>
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {tabBar}

        {/* Section tabs */}
        <div className="flex gap-1 overflow-x-auto pb-1">
          {testSections.map((s, si) => (
            <button key={si} onClick={() => { setTestSectionIdx(si); setTestIdx(0); setTestResults({}); setTestSubmitted({}) }}
              className={`text-xs font-semibold px-3 py-1.5 rounded-full whitespace-nowrap transition-all ${
                si === testSectionIdx ? 'bg-primary-600 text-white' : 'bg-gray-100 text-gray-600'
              }`}>
              {s.icon} {s.title}
            </button>
          ))}
        </div>

        {/* Progress */}
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">{testSectionIdx + 1} / {testSections.length} bo'lim</p>
          <p className="text-xs text-gray-500">🏆 {testScore} / {allQuestions.length}</p>
        </div>
        <div className="progress-bar">
          <div className="progress-fill bg-primary-500" style={{ width: `${(testIdx / Math.max(currentSectionQuestions.length, 1)) * 100}%` }} />
        </div>

        {currentSectionQuestions.length === 0 ? (
          <div className="card text-center py-6 text-gray-500">
            Bu bo'limda savollar mavjud emas. Keyingi bo'limga o'ting.
            <button onClick={nextTest} className="btn-primary mt-3 text-sm block mx-auto">Keyingi bo'lim →</button>
          </div>
        ) : currentQ ? (
          <>
            {/* Question card */}
            <div className="rounded-2xl border-2 border-primary-200 bg-primary-50 p-3 sm:p-6 text-center">
              <p className="text-xs text-gray-400 mb-2">{testSections[testSectionIdx]?.title}</p>
              <p className="text-xl sm:text-2xl font-bold text-gray-900 mb-1">{currentQ.stem}</p>
              {testSectionIdx === 2 && (
                <p className="text-[11px] text-gray-500 mt-1 italic">Bo'sh joyga mos so'zni toping</p>
              )}
            </div>

            {/* Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {currentQ.options.map((opt, oi) => {
                let cls = 'border border-gray-200 bg-white text-gray-800 hover:border-primary-400 hover:bg-primary-50'
                if (testSubmitted[testIdx]) {
                  if (opt === currentQ.correct) cls = 'border-green-400 bg-green-100 text-green-800 font-bold'
                  else cls = 'border-gray-100 bg-gray-50 text-gray-400'
                }
                return (
                  <button key={oi} disabled={!!testSubmitted[testIdx]} onClick={() => handleTestAnswer(opt)}
                    className={`rounded-xl px-3 py-3 text-sm font-medium transition-all ${cls}`}>
                    {opt}
                  </button>
                )
              })}
            </div>

            {/* Feedback */}
            {testSubmitted[testIdx] && (
              <div className={`card text-center py-3 ${testResults[testIdx] ? 'bg-green-50 border-green-200' : 'bg-red-50 border-red-200'}`}>
                <p className={`font-bold ${testResults[testIdx] ? 'text-green-700' : 'text-red-700'}`}>
                  {testResults[testIdx] ? '✅ To\'g\'ri! +5 XP' : '❌ Xato'}
                </p>
                {!testResults[testIdx] && (
                  <p className="text-xs text-gray-600 mt-1">
                    To'g'ri javob: <strong>{currentQ.correct}</strong>
                  </p>
                )}
                <p className="text-[11px] text-gray-500 mt-1 italic">"{currentQ.word.example}"</p>
                <button onClick={nextTest} className="btn-primary mt-3 text-sm">
                  {testIdx < currentSectionQuestions.length - 1
                    ? 'Keyingi savol →'
                    : testSectionIdx < testSections.length - 1
                    ? `Keyingi bo'lim →`
                    : '🏁 Yakunlash'}
                </button>
              </div>
            )}
          </>
        ) : null}
      </div>
    )
  }

  return null
}

// ── Special Case Card (maxsus holatlar uchun) ──────────────────────────────────

function SpecialCaseCard({ sc, addXP, lessonId }: { sc: import('../data/dailyLessons').SpecialCase; addXP: (n: number) => void; lessonId: string }) {
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
    saveExerciseAnswersToDB(lessonId, -1, 'drill', [
      { exerciseId: ex.id, exerciseType: ex.type, answer: userAns, isCorrect: ok },
    ])
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
                      {ex.question.split(/_{3,}/).map((part, pi, arr) => (
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
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
                  <div className="flex items-center gap-2">
                    {ok ? (
                      <span className="font-semibold">✅ To\'g\'ri! +10 XP</span>
                    ) : (
                      <span className="font-semibold">❌ Xato.</span>
                    )}
                    <button onClick={() => handleRetry(ex.id)} className="text-primary-600 underline hover:no-underline">Qayta urinish</button>
                  </div>
                  {!ok && (
                    <div className="flex flex-wrap gap-3 mt-1">
                      <p className="font-semibold">✍️ Sizning javobingiz: <span className="font-mono">{answers.length > 0 ? answers.join(' / ') : "(bo'sh)"}</span></p>
                      <p className="font-semibold">✅ To'g'ri javob: <span className="font-mono">{ex.type === 'fill-blank' ? ex.blanks.join(' / ') : (ex.type !== 'fill-table' ? ex.correct : '')}</span></p>
                    </div>
                  )}
                  {!ok && <p className="text-gray-600 mt-1">💡 {ex.explanation}</p>}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function RuleCard({ rule, index }: { rule: string; index: number }) {
  const sections = rule.split('\n\n').filter(Boolean)
  const titleRaw = sections[0]?.trim() || ''
  const titleClean = titleRaw.replace(/^[0-9#️⃣]+️?\s*/, '').replace(/[—\-].*$/, '').replace(/\(.*?\)/, '').trim()

  const subSections = sections.slice(1).filter(s => {
    if (sections.length <= 2) return true
    return s.length > 15 || s.startsWith('📌') || s.startsWith('🔴') || s.startsWith('🔥')
  })

  return (
    <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-100">
        <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold text-white"
          style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
          {index + 1}
        </span>
        <p className="text-sm font-bold text-gray-900 leading-tight">{titleClean || 'Qoida'}</p>
      </div>

      <div className="px-4 py-3 space-y-4">
        {subSections.length === 0 && sections.length > 1 ? (
          <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">{sections.slice(1).join('\n\n')}</p>
        ) : null}

        {subSections.map((sec, si) => {
          const lines = sec.split('\n').map(l => l.trim()).filter(Boolean)
          if (lines.length === 0) return null

          const firstLine = lines[0]
          const emoji = firstLine.match(/^([📌🔴🔥🎯⭐📍])/)
          const isErrorSection = firstLine.includes('❌') || firstLine.includes('✅')
          const isPercentageSection = firstLine.includes('100%') || firstLine.includes('%')

          if (emoji) {
            const titleLine = lines.find(l => l.match(/^[📌🔴🔥🎯⭐📍]/))
            const title = titleLine ? titleLine.replace(/^[📌🔴🔥🎯⭐📍]\s*/, '').trim() : ''

            const exampleLines = lines.filter(l => l.startsWith('→') || l.startsWith('  →'))
            const errorLines = lines.filter(l => l.includes('❌') || l.includes('✅'))
            const bulletLines = lines.filter(l => l.startsWith('•') || l.startsWith('  •'))
            const otherLines = lines.filter(l => {
              const t = l.replace(/^[📌🔴🔥🎯⭐📍]\s*/, '')
              return !t.startsWith('→') && !t.includes('❌') && !t.includes('✅') && !t.startsWith('•') && t !== title && !l.match(/^[📌🔴🔥🎯⭐📍]/) && !l.match(/^\d+%/)
            })

            const percentageLines = lines.filter(l => l.match(/^\d+%/) || l.match(/^  \d+%/))

            return (
              <div key={si} className="bg-blue-50/50 rounded-lg p-3 border border-blue-100">
                {title && (
                  <p className="font-bold text-gray-800 text-sm mb-2 flex items-center gap-1.5">
                    <span className="text-base">{emoji[1]}</span>
                    <span>{title}</span>
                  </p>
                )}

                {otherLines.length > 0 && otherLines.map((l, li) => (
                  <p key={`o-${li}`} className="text-sm text-gray-700 leading-relaxed mb-1">{l}</p>
                ))}

                {percentageLines.length > 0 && (
                  <div className="space-y-1 mb-2">
                    {percentageLines.map((l, li) => {
                      const m = l.match(/^(\s*)(\d+)%\s*→\s*(.+)/)
                      if (m) {
                        const pct = parseInt(m[2])
                        let barColor = 'bg-green-400'
                        if (pct <= 20) barColor = 'bg-red-400'
                        else if (pct <= 50) barColor = 'bg-yellow-400'
                        else if (pct <= 80) barColor = 'bg-blue-400'
                        else barColor = 'bg-green-500'
                        return (
                          <div key={li} className="flex items-center gap-2">
                            <div className="flex-shrink-0 w-10 text-xs text-gray-500 font-mono text-right">{m[2]}%</div>
                            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                            </div>
                            <div className="text-sm text-gray-700 w-full">{m[3]}</div>
                          </div>
                        )
                      }
                      return <p key={li} className="text-sm text-gray-700">{l.replace(/^\s*/, '')}</p>
                    })}
                  </div>
                )}

                {bulletLines.length > 0 && (
                  <div className="space-y-1 mb-2">
                    {bulletLines.map((l, li) => (
                      <p key={`b-${li}`} className="text-sm text-gray-600 flex items-start gap-2 pl-1">
                        <span className="text-gray-400 mt-0.5 flex-shrink-0">•</span>
                        <span>{l.replace(/^[•\s]+/, '')}</span>
                      </p>
                    ))}
                  </div>
                )}

                {exampleLines.length > 0 && (
                  <div className="space-y-1.5 mt-2">
                    {exampleLines.map((l, li) => (
                      <div key={`e-${li}`} className="flex items-start gap-2 pl-1">
                        <span className="text-indigo-400 font-bold flex-shrink-0 mt-0.5 text-xs">→</span>
                        <code className="text-sm bg-white px-3 py-1.5 rounded-lg text-gray-800 font-mono w-full border border-gray-200 shadow-sm">
                          {l.replace(/^→\s*/, '').replace(/^  →\s*/, '')}
                        </code>
                      </div>
                    ))}
                  </div>
                )}

                {errorLines.length > 0 && (
                  <div className="space-y-1 mt-2">
                    {errorLines.map((l, li) => {
                      const parts = l.split(/([❌✅])/g)
                      return (
                        <div key={`er-${li}`} className="bg-red-50 rounded-lg px-3 py-2 border border-red-100">
                          <p className="flex items-start gap-1.5 text-sm">
                            {parts.map((part, pi2) => {
                              if (part === '❌') return <span key={pi2} className="text-red-500 font-bold flex-shrink-0 text-lg">✕</span>
                              if (part === '✅') return <span key={pi2} className="text-green-500 font-bold flex-shrink-0 text-lg">✓</span>
                              return <span key={pi2} className={part.includes('noto\'g\'ri') || part.includes('NOTO\'G\'RI') ? 'line-through text-red-600' : ''}>{part}</span>
                            })}
                          </p>
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          }

          if (isErrorSection) {
            return (
              <div key={si} className="bg-red-50 rounded-lg p-3 border border-red-100 space-y-1">
                {lines.map((l, li) => {
                  const parts = l.split(/([❌✅])/g)
                  return (
                    <p key={li} className="flex items-start gap-1.5 text-sm">
                      {parts.map((part, pi) => {
                        if (part === '❌') return <span key={pi} className="text-red-500 font-bold text-lg">✕</span>
                        if (part === '✅') return <span key={pi} className="text-green-500 font-bold text-lg">✓</span>
                        if (l.includes('❌') && part.includes('noto\'g\'ri') || part.includes('NOTO\'G\'RI')) return <span key={pi} className="line-through text-red-600">{part}</span>
                        return <span key={pi}>{part}</span>
                      })}
                    </p>
                  )
                })}
              </div>
            )
          }

          if (isPercentageSection) {
            return (
              <div key={si} className="space-y-1">
                {lines.map((l, li) => {
                  const m = l.match(/^(\d+)%\s*→\s*(.+)/)
                  if (m) {
                    const pct = parseInt(m[1])
                    let barColor = 'bg-green-400'
                    if (pct <= 20) barColor = 'bg-red-400'
                    else if (pct <= 50) barColor = 'bg-yellow-400'
                    else if (pct <= 80) barColor = 'bg-blue-400'
                    return (
                      <div key={li} className="flex items-center gap-2">
                        <div className="flex-shrink-0 w-10 text-xs text-gray-500 font-mono text-right">{m[1]}%</div>
                        <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className={`h-full rounded-full ${barColor}`} style={{ width: `${pct}%` }} />
                        </div>
                        <div className="text-sm text-gray-700">{m[2]}</div>
                      </div>
                    )
                  }
                  return <p key={li} className="text-sm text-gray-700">{l}</p>
                })}
              </div>
            )
          }

          return (
            <div key={si} className="space-y-1">
              {lines.filter(l => {
                if (lines[0] === titleClean && l === lines[0]) return false
                return true
              }).map((l, li) => (
                <p key={li} className="text-sm text-gray-700 whitespace-pre-line">{l}</p>
              ))}
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
  const { addXP, updateSkillProgress, setLessonProgress, saveLessonSession, clearLessonSession, lessonSessions } = useStore()
  const savedSession = lessonSessions[lesson.id]

  const [tab, setTab] = useState<'grammar' | 'vocab' | 'examples' | 'special' | 'exercises' | 'tests'>(
    (savedSession?.tab as any) ?? 'grammar'
  )
  const [currentSection, setCurrentSection] = useState(savedSession?.currentSection ?? 0)
  const [testSection, setTestSection] = useState(savedSession?.testSection ?? 0)
  const [testShuffleKey, setTestShuffleKey] = useState(0)
  const [testAnswers, setTestAnswers] = useState<Record<number, string>>({})
  const [testSubmitted, setTestSubmitted] = useState(false)
  const [testScore, setTestScore] = useState(0)
  const [testResults, setTestResults] = useState<Record<number, boolean>>({})
  const [completedTestSections, setCompletedTestSections] = useState<Record<number, number>>(savedSession?.completedTestSections ?? {})
  const [answers, setAnswers] = useState<Answers>({})
  const [submitted, setSubmitted] = useState(false)
  const [score, setScore] = useState(0)
  const [cumulativeScore, setCumulativeScore] = useState(0)
  const [completedSections, setCompletedSections] = useState<Record<number, number>>(savedSession?.completedSections ?? {})
  const [prevScore, setPrevScore] = useState<number | null>(null)
  const [viewedTabs, setViewedTabs] = useState<string[]>([])

  const section = lesson.exerciseSections[currentSection]
  const sectionExercises = lesson.exercises.filter((ex) => section?.ids.includes(ex.id))
  const isLastSection = currentSection === lesson.exerciseSections.length - 1

  // Test variantlarini har safar aralashtirish (shuffle)
  const shuffledTestOptionsMap = useMemo(() => {
    const map = new Map<number, string[]>()
    const sec = lesson.testSections[testSection]
    if (!sec) return map
    const tests = lesson.tests.filter((t): t is Extract<DailyExercise, { type: 'multiple-choice' }> => sec.ids.includes(t.id))
    for (const t of tests) {
      const opts = [...t.options]
      for (let i = opts.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
        ;[opts[i], opts[j]] = [opts[j], opts[i]]
      }
      map.set(t.id, opts)
    }
    return map
  }, [lesson.id, lesson.tests, lesson.testSections, testSection, testShuffleKey])

  useEffect(() => {
    getLessonProgress(lesson.id, getTodayTashkent()).then((p) => {
      if (p !== null) setPrevScore(p)
    })
  }, [lesson.id])

  // Boshqa qurilmadagi sessiyani yuklash (agar yangiroq bo'lsa)
  useEffect(() => {
    loadLessonSessionFromDB(lesson.id).then((remote) => {
      if (!remote) return
      const localUpdated = savedSession?.updatedAt ?? 0
      if (remote.updatedAt <= localUpdated) return
      setTab(remote.tab as any)
      setCurrentSection(remote.currentSection)
      setTestSection(remote.testSection)
      setCompletedSections(remote.completedSections)
      setCompletedTestSections(remote.completedTestSections)
    })
  }, [lesson.id])

  // Yuklash: viewed tabs
  useEffect(() => {
    loadViewedTabsFromDB(lesson.id).then((tabs) => {
      if (tabs.length > 0) setViewedTabs(tabs)
    })
  }, [lesson.id])

  // Ko'rilgan tablarni kuzatish
  const prevTabRef = useRef(tab)
  useEffect(() => {
    if (prevTabRef.current !== tab) {
      prevTabRef.current = tab
      const newViewed = viewedTabs.includes(tab) ? viewedTabs : [...viewedTabs, tab]
      setViewedTabs(newViewed)
      saveViewedTabsToDB(lesson.id, newViewed)
    }
  }, [tab])

  // Avtomatik sessiyani saqlash
  useEffect(() => {
    saveLessonSession(lesson.id, {
      tab, currentSection, testSection,
      completedSections, completedTestSections,
      updatedAt: Date.now(),
    })
  }, [tab, currentSection, testSection, completedSections, completedTestSections])

  // ── Exercise answers persistence ──
  const exerciseStorageKey = `exercise-answers-${lesson.id}-${currentSection}`
  useEffect(() => {
    try {
      const saved = localStorage.getItem(exerciseStorageKey)
      if (!saved) return
      const data = JSON.parse(saved)
      if (data.answers) setAnswers(data.answers)
      if (data.submitted != null) setSubmitted(data.submitted)
      if (data.score != null) setScore(data.score)
    } catch { /* ignore */ }
  }, [exerciseStorageKey])

  const prevExerciseStateRef = useRef({ answers, submitted, score })
  useEffect(() => {
    const cur = { answers, submitted, score }
    if (JSON.stringify(cur) === JSON.stringify(prevExerciseStateRef.current)) return
    prevExerciseStateRef.current = cur
    try {
      localStorage.setItem(exerciseStorageKey, JSON.stringify(cur))
    } catch { /* ignore */ }
  }, [answers, submitted, score, exerciseStorageKey])

  // ── Test answers persistence ──
  const testStorageKey = `test-state-${lesson.id}-${testSection}`
  useEffect(() => {
    try {
      const saved = localStorage.getItem(testStorageKey)
      if (!saved) return
      const data = JSON.parse(saved)
      if (data.testAnswers) setTestAnswers(data.testAnswers)
      if (data.testSubmitted != null) setTestSubmitted(data.testSubmitted)
      if (data.testScore != null) setTestScore(data.testScore)
      if (data.testResults) setTestResults(data.testResults)
    } catch { /* ignore */ }
  }, [testStorageKey])

  const prevTestStateRef = useRef({ testAnswers, testSubmitted, testScore, testResults })
  useEffect(() => {
    const cur = { testAnswers, testSubmitted, testScore, testResults }
    if (JSON.stringify(cur) === JSON.stringify(prevTestStateRef.current)) return
    prevTestStateRef.current = cur
    try {
      localStorage.setItem(testStorageKey, JSON.stringify(cur))
    } catch { /* ignore */ }
  }, [testAnswers, testSubmitted, testScore, testResults, testStorageKey])

  const handleChangeAnswer = (exId: number, blankIdx: number, val: string) => {
    setAnswers((prev) => {
      const cur = [...(prev[exId] ?? [])]
      cur[blankIdx] = val
      return { ...prev, [exId]: cur }
    })
  }

  const handleSubmitSection = async () => {
    let correct = 0
    const answerPayloads: {
      exerciseId: number
      exerciseType: string
      answer: string[]
      isCorrect: boolean
    }[] = []
    for (const ex of sectionExercises) {
      const userAns = answers[ex.id] ?? []
      const ok = checkAnswer(ex, userAns)
      if (ok) correct++
      answerPayloads.push({ exerciseId: ex.id, exerciseType: ex.type, answer: userAns, isCorrect: ok })
    }
    setScore(correct)
    setSubmitted(true)
    setCompletedSections((prev) => ({ ...prev, [currentSection]: correct }))
    setCumulativeScore((prev) => prev + correct)
    addXP(correct * 10)

    // Har bir mashq javobini saqlash
    saveExerciseAnswersToDB(lesson.id, currentSection, 'exercise', answerPayloads)

    if (isLastSection) {
      const totalCorrect = cumulativeScore + correct + Object.values(completedSections).reduce((a, b) => a + b, 0)
      const total = lesson.exercises.length
      const totalPct = Math.round((totalCorrect / total) * 100)
      setLessonProgress(lesson.id, totalPct)
      updateSkillProgress('todayGrammarPct', totalPct)
      await pushLessonProgress(lesson.id, totalCorrect, total)
      clearLessonSession(lesson.id)
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
    { id: 'tests', label: '🧪 Testlar', desc: `${lesson.tests.length} ta` },
  ] as const

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto space-y-4 sm:space-y-5">
      {/* Header */}
      <div className="flex items-center gap-2 sm:gap-3">
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
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{lesson.title}</h1>
        <p className="text-gray-500 text-xs sm:text-sm mt-1">{lesson.subtitle}</p>
      </div>

      {/* Tabs — scrollable on mobile */}
      <div className="flex gap-2 border-b border-gray-100 pb-0 overflow-x-auto scrollbar-hide -mx-3 px-3 sm:mx-0 sm:px-0">
        {tabs.map((t) => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setSubmitted(false) }}
            className={`pb-3 px-3 sm:px-4 text-xs sm:text-sm font-semibold border-b-2 transition-all whitespace-nowrap ${
              tab === t.id
                ? 'border-primary-600 text-primary-700'
                : 'border-transparent text-gray-400 hover:text-gray-600'
            }`}
          >
            {t.label}
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

          <div className="space-y-4">
            <p className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
              <BookOpen size={14} /> Qoidalar
            </p>
            {lesson.rules.map((r, i) => (
              <RuleCard key={i} rule={r} index={i} />
            ))}
          </div>

          {/* Tezkor eslatma — faqat Comparatives & Superlatives darsiga tegishli */}
          {lesson.id === 'comparatives-superlatives' && (
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
          )}

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
        <VocabLearner vocab={lesson.vocabulary} addXP={addXP} lessonId={lesson.id} />
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
            <SpecialCaseCard key={sc.id} sc={sc} addXP={addXP} lessonId={lesson.id} />
          ))}
        </div>
      )}

      {/* ── Tab: Tests ── */}
      {tab === 'tests' && (
        <div className="space-y-4">
          {/* Test bosqichlari progress */}
          <div className="flex items-center gap-1.5">
            {lesson.testSections.map((s, i) => {
              const done = completedTestSections[i] !== undefined
              const active = i === testSection
              return (
                <div key={s.title} className="flex-1">
                  <div className={`h-1.5 rounded-full transition-all ${done ? 'bg-green-500' : active ? 'bg-yellow-500' : 'bg-gray-200'}`} />
                  <p className={`text-[9px] mt-0.5 text-center font-medium ${active ? 'text-yellow-700' : done ? 'text-green-600' : 'text-gray-400'}`}>
                    {s.icon} {active && <span className="hidden sm:inline">{s.title}</span>}
                  </p>
                </div>
              )
            })}
          </div>

          {/* Test bosqich sarlavhasi */}
          {(() => {
            const section = lesson.testSections[testSection]
            if (!section) return null
            const sectionTests = lesson.tests.filter((t): t is Extract<DailyExercise, { type: 'multiple-choice' }> => section.ids.includes(t.id))
            return (
              <>
                <div className={`rounded-xl p-4 text-white ${section.color}`}>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xs font-semibold opacity-80">Test {testSection + 1} / {lesson.testSections.length}</p>
                      <p className="font-bold text-lg">{section.icon} {section.title}</p>
                      <p className="text-sm opacity-80">{section.desc}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold">{sectionTests.length}</p>
                      <p className="text-xs opacity-80">savol</p>
                    </div>
                  </div>
                </div>

                {testSubmitted ? (
                  <>
                    {/* Bali xulosasi */}
                    <div className={`card border text-center py-5 ${
                      testScore >= 8 ? 'bg-green-50 border-green-200' :
                      testScore >= 5 ? 'bg-yellow-50 border-yellow-200' :
                      'bg-red-50 border-red-200'
                    }`}>
                      <p className={`text-3xl font-bold font-mono ${testScore >= 8 ? 'text-green-600' : testScore >= 5 ? 'text-yellow-600' : 'text-red-500'} mb-1`}>
                        {testScore}<span className="text-lg text-gray-400">/{sectionTests.length}</span>
                      </p>
                      <p className="text-sm text-gray-600 mb-2">
                        {testScore === sectionTests.length ? '🎯 Mukammal! Barcha savollarga to\'g\'ri javob berdingiz!' :
                         testScore >= 8 ? '👍 Zo\'r! Davom eting!' :
                         testScore >= 5 ? '📚 Yaxshi, biroz ko\'proq takrorlash kerak' :
                         '💪 Qayta urinib ko\'ring — qoidalarni takrorlang'}
                      </p>
                      <div className="flex items-center justify-center gap-3 text-xs">
                        <span className="flex items-center gap-1 text-yellow-600 font-bold">
                          <Trophy size={14} /> +{testScore * 10} XP
                        </span>
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle size={14} /> {testScore}
                        </span>
                        <span className="flex items-center gap-1 text-red-500">
                          <XCircle size={14} /> {sectionTests.length - testScore}
                        </span>
                      </div>
                      <div className="flex gap-2 mt-4">
                        <button onClick={() => { setTestAnswers({}); setTestSubmitted(false); setTestScore(0); setTestResults({}); setTestShuffleKey((k) => k + 1) }} className="btn-secondary flex-1 text-sm py-2">
                          <RotateCcw size={14} /> Qayta urinish
                        </button>
                        {testSection < lesson.testSections.length - 1 && (
                          <button onClick={() => { setTestSection((p) => p + 1); setTestAnswers({}); setTestSubmitted(false); setTestScore(0); setTestResults({}); setTimeout(() => window.scrollTo({ top: 0, behavior: 'smooth' }), 50) }} className="btn-primary flex-1 text-sm py-2">
                            Keyingi bosqich <ChevronRight size={14} />
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Batafsil natija jadvali */}
                    <div className="card border-gray-200 overflow-hidden">
                      <div className="flex items-center justify-between mb-4">
                        <p className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
                          <Trophy size={14} className="text-yellow-600" /> Batafsil natija
                        </p>
                        <span className="text-[10px] text-gray-400">{sectionTests.length} ta savol</span>
                      </div>
                      <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                          <thead>
                            <tr className="border-b-2 border-gray-100 text-left text-[10px] text-gray-500 uppercase tracking-wider">
                              <th className="pb-2 pr-2 font-semibold w-8">#</th>
                              <th className="pb-2 pr-3 font-semibold">Savol</th>
                              <th className="pb-2 pr-3 font-semibold">Sizning javobingiz</th>
                              <th className="pb-2 pr-3 font-semibold">To\'g\'ri javob</th>
                              <th className="pb-2 pr-3 font-semibold w-10">Natija</th>
                              <th className="pb-2 font-semibold hidden sm:table-cell">Izoh</th>
                            </tr>
                          </thead>
                          <tbody>
                            {sectionTests.map((t, i) => {
                              const ans = testAnswers[t.id] || ''
                              const ok = testResults[t.id]
                              return (
                                <tr key={t.id} className={`border-b border-gray-50 ${
                                  ok ? 'bg-green-50/40' : 'bg-red-50/40'
                                }`}>
                                  <td className="py-2.5 pr-2 text-xs font-bold text-gray-600">{i + 1}</td>
                                  <td className="py-2.5 pr-3">
                                    <p className="text-xs text-gray-800 font-medium leading-snug line-clamp-2">{t.question}</p>
                                  </td>
                                  <td className="py-2.5 pr-3">
                                    <span className={`inline-block text-xs font-mono font-semibold px-1.5 py-0.5 rounded ${
                                      ok
                                        ? 'text-green-700'
                                        : ans
                                          ? 'bg-red-100 text-red-700'
                                          : 'bg-gray-100 text-gray-500'
                                    }`}>
                                      {ans || '(tanlanmadi)'}
                                    </span>
                                  </td>
                                  <td className="py-2.5 pr-3">
                                    <span className="inline-block text-xs font-mono font-semibold text-green-700 bg-green-100 px-1.5 py-0.5 rounded">
                                      {t.correct}
                                    </span>
                                  </td>
                                  <td className="py-2.5 pr-3">
                                    <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                                      ok ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                                    }`}>
                                      {ok ? '✓' : '✗'}
                                    </span>
                                  </td>
                                  <td className="py-2.5 hidden sm:table-cell">
                                    <p className="text-[11px] text-gray-500 leading-snug line-clamp-2">{t.explanation}</p>
                                  </td>
                                </tr>
                              )
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="space-y-4">
                      {sectionTests.map((t, i) => {
                        const selected = testAnswers[t.id] || ''
                        const isCorrect = testResults[t.id]
                        const correctOpt = t.correct
                        return (
                          <div key={t.id} className={`relative rounded-2xl border p-4 transition-colors ${
                            testSubmitted
                              ? isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                              : ''
                          }`}>
                            <div className={`absolute -left-3 -top-3 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm ${
                              testSubmitted
                                ? isCorrect ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                                : 'bg-yellow-600 text-white'
                            }`}>
                              {i + 1}
                            </div>
                            <p className="text-[11px] font-bold text-yellow-600 uppercase tracking-wider mb-3">🧪 Test savoli</p>
                            <p className="text-sm font-semibold text-gray-800 mb-3 leading-relaxed">{t.question}</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              {(shuffledTestOptionsMap.get(t.id) ?? t.options).map((opt, oi) => {
                                const sel = selected === opt
                                let cls = 'border border-gray-200 bg-white text-gray-700 hover:border-yellow-400 hover:bg-yellow-50'
                                if (testSubmitted) {
                                  if (opt === correctOpt) cls = 'border-green-400 bg-green-100 text-green-800 font-bold'
                                  else if (sel) cls = 'border-red-400 bg-red-100 text-red-700'
                                  else cls = 'border-gray-100 bg-gray-50 text-gray-400'
                                } else if (sel) {
                                  cls = 'border-yellow-500 bg-yellow-100 text-yellow-800 font-semibold'
                                }
                                return (
                                  <button
                                    key={opt}
                                    disabled={testSubmitted}
                                    onClick={() => setTestAnswers((prev) => ({ ...prev, [t.id]: opt }))}
                                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${cls}`}
                                  >
                                    <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                                      {['A','B','C','D'][oi]}
                                    </span>
                                    {opt}
                                  </button>
                                )
                              })}
                            </div>
                            {testSubmitted && (
                              <div className={`mt-3 text-xs ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                                <p className="font-semibold">✍️ Sizning javobingiz: <span className="font-mono">{selected || "(tanlanmadi)"}</span></p>
                                {!isCorrect && <p className="font-semibold">✅ To\'g\'ri javob: <span className="font-mono">{correctOpt}</span></p>}
                                {isCorrect && <p className="font-semibold">✅ To\'g\'ri! +10 XP</p>}
                                <p className="mt-1 text-gray-600">💡 {t.explanation}</p>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>

                    <button
                      onClick={() => {
                        let correct = 0
                        const results: Record<number, boolean> = {}
                        const answerPayloads: {
                          exerciseId: number
                          exerciseType: string
                          answer: string[]
                          isCorrect: boolean
                        }[] = []
                        for (const t of sectionTests) {
                          const ans = testAnswers[t.id] || ''
                          const ok = ans === t.correct
                          results[t.id] = ok
                          if (ok) correct++
                          answerPayloads.push({ exerciseId: t.id, exerciseType: t.type, answer: [ans], isCorrect: ok })
                        }
                        setTestScore(correct)
                        setTestResults(results)
                        setTestSubmitted(true)
                        const newCompleted = { ...completedTestSections, [testSection]: correct }
                        setCompletedTestSections(newCompleted)
                        addXP(correct * 10)
                        saveExerciseAnswersToDB(lesson.id, testSection, 'test', answerPayloads)
                        pushTestProgress(lesson.id, section.title, correct, sectionTests.length)
                        if (Object.keys(newCompleted).length === lesson.testSections.length) {
                          const totalCorrect = Object.values(newCompleted).reduce((a, b) => a + b, 0)
                          pushTestProgress(lesson.id, '__all__', totalCorrect, lesson.tests.length)
                          clearLessonSession(lesson.id)
                        }
                      }}
                      disabled={Object.keys(testAnswers).length < sectionTests.length}
                      className={`btn-primary w-full flex items-center justify-center gap-2 py-3 ${
                        Object.keys(testAnswers).length < sectionTests.length ? 'opacity-50 cursor-not-allowed' : ''
                      }`}
                    >
                      <CheckCircle size={18} />
                      Testni tekshirish (+{sectionTests.length * 10} XP)
                    </button>
                  </>
                )}

                {/* Umumiy progress */}
                {Object.keys(completedTestSections).length > 0 && (
                  <div className="card bg-gray-50 border-gray-100 text-center">
                    <p className="text-xs text-gray-500">
                      Umumiy: {Object.values(completedTestSections).reduce((a, b) => a + b, 0) + (testSubmitted && testSection >= 0 ? testScore : 0)} / {lesson.tests.length} ta to\'g\'ri
                      {' · '}
                      {lesson.testSections.filter((_, i) => completedTestSections[i] !== undefined).length + (testSubmitted ? 1 : 0)} / {lesson.testSections.length} bosqich
                    </p>
                  </div>
                )}
              </>
            )
          })()}
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
            <>
              {/* Bosqich natijasi */}
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

              {/* Batafsil natija jadvali */}
              <div className="card border-gray-200 overflow-hidden">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider flex items-center gap-1.5">
                    <Trophy size={14} className="text-yellow-600" /> Batafsil natija
                  </p>
                  <span className="text-[10px] text-gray-400">{sectionExercises.length} ta mashq</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b-2 border-gray-100 text-left text-[10px] text-gray-500 uppercase tracking-wider">
                        <th className="pb-2 pr-2 font-semibold w-8">#</th>
                        <th className="pb-2 pr-3 font-semibold">Savol</th>
                        <th className="pb-2 pr-3 font-semibold">Sizning javobingiz</th>
                        <th className="pb-2 pr-3 font-semibold">To\'g\'ri javob</th>
                        <th className="pb-2 font-semibold w-10">Natija</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sectionExercises.map((ex, i) => {
                        const userAnsArr = answers[ex.id] ?? []
                        const ok = checkAnswer(ex, userAnsArr)
                        let userAnsStr: string
                        let correctStr: string
                        if (ex.type === 'fill-blank') {
                          userAnsStr = userAnsArr.join(' / ') || "(bo'sh)"
                          correctStr = ex.blanks.join(' / ')
                        } else if (ex.type === 'fill-table') {
                          const parts = ex.rows.map((r, idx) => {
                            const ci = idx * 2
                            const si = ci + 1
                            return `${r.adj}: C=${userAnsArr[ci] ?? '—'} S=${userAnsArr[si] ?? '—'}`
                          })
                          userAnsStr = parts.join('; ')
                          const correctParts = ex.rows.map((r) => `${r.adj}: C=${r.comp || '—'} S=${r.sup || '—'}`)
                          correctStr = correctParts.join('; ')
                        } else {
                          userAnsStr = userAnsArr[0] || "(bo'sh)"
                          correctStr = ex.correct
                        }
                        return (
                          <tr key={ex.id} className={`border-b border-gray-50 ${
                          ok ? 'bg-green-50/40' : 'bg-red-50/40'
                          }`}>
                            <td className="py-2.5 pr-2 text-xs font-bold text-gray-600">{i + 1}</td>
                            <td className="py-2.5 pr-3">
                              <p className="text-xs text-gray-800 font-medium leading-snug line-clamp-2">
                                {ex.type === 'fill-blank' ? ex.question.replace(/_{3,}/g, '___') :
                                 ex.type === 'fill-table' ? ex.instruction :
                                 ex.question}
                              </p>
                            </td>
                            <td className="py-2.5 pr-3">
                              <span className={`inline-block text-xs font-mono font-semibold px-1.5 py-0.5 rounded max-w-[180px] truncate ${
                                ok ? 'text-green-700' : 'bg-red-100 text-red-700'
                              }`}>
                                {userAnsStr}
                              </span>
                            </td>
                            <td className="py-2.5 pr-3">
                              <span className="inline-block text-xs font-mono font-semibold text-green-700 bg-green-100 px-1.5 py-0.5 rounded max-w-[180px] truncate">
                                {correctStr}
                              </span>
                            </td>
                            <td className="py-2.5">
                              <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${
                                ok ? 'bg-green-200 text-green-800' : 'bg-red-200 text-red-800'
                              }`}>
                                {ok ? '✓' : '✗'}
                              </span>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
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
  const lessonSessions = useStore((s) => s.lessonSessions)
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
      <div className="p-3 sm:p-6 max-w-4xl mx-auto flex items-center justify-center min-h-[300px]">
        <div className="text-gray-400 animate-pulse">Darslar yuklanmoqda...</div>
      </div>
    )
  }

  if (lessons.length === 0) {
    return (
      <div className="p-3 sm:p-6 max-w-4xl mx-auto flex items-center justify-center min-h-[300px]">
        <p className="text-gray-400">Hozircha darslar mavjud emas. Supabase seed SQL'ni ishga tushiring.</p>
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto space-y-5">
      {/* ── Header ── */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
          <Sparkles size={20} className="text-primary-600" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Kunlik Darslar</h1>
          <p className="text-xs text-gray-500">Har kuni yangi mavzu — qoida, so'zlar va mashqlar</p>
        </div>
      </div>

      {/* ── Progress Overview ── */}
      {(() => {
        const completed = lessons.filter(l => lessonScores[l.id] !== undefined).length
        const notStarted = lessons.filter(l => lessonScores[l.id] === undefined && !lessonSessions[l.id]).length
        const inProgress = lessons.filter(l => lessonScores[l.id] === undefined && lessonSessions[l.id]).length
        const total = lessons.length
        const avgPct = total > 0 ? Math.round(lessons.reduce((a, l) => a + (lessonScores[l.id] ?? 0), 0) / total) : 0
        const totalXp = lessons.reduce((a, l) => {
          const s = lessonScores[l.id]
          if (s === undefined) return a
          return a + Math.round((s / 100) * l.exercises.length * 10)
        }, 0)
        return (
          <div className="card bg-gradient-to-br from-gray-50 to-white border-gray-200">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-1.5">
                <Trophy size={16} className="text-amber-500" />
                <span className="text-sm font-bold text-gray-900">Umumiy progress</span>
              </div>
              <span className="text-xs text-gray-400">{totalXp > 0 ? `+${totalXp} XP` : ''}</span>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              <div className="text-center">
                <p className="text-xl font-bold text-green-600">{completed}</p>
                <p className="text-[10px] text-gray-500">Bajarildi</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-amber-500">{inProgress}</p>
                <p className="text-[10px] text-gray-500">Jarayonda</p>
              </div>
              <div className="text-center">
                <p className="text-xl font-bold text-gray-300">{notStarted}</p>
                <p className="text-[10px] text-gray-500">Kutilmoqda</p>
              </div>
            </div>

            {/* Big progress bar */}
            <div className="mb-3">
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="text-gray-500">O'rtacha natija</span>
                <span className={`font-bold ${
                  avgPct >= 80 ? 'text-green-600' : avgPct >= 50 ? 'text-amber-600' : 'text-red-500'
                }`}>{avgPct}%</span>
              </div>
              <div className="h-2.5 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full rounded-full bg-gradient-to-r from-red-400 via-amber-400 to-green-500 transition-all duration-500"
                  style={{ width: `${avgPct}%` }} />
              </div>
            </div>

            {/* Mini lesson dots */}
            <div className="flex flex-wrap gap-1.5">
              {lessons.map((l) => {
                const pct = lessonScores[l.id]
                const hasSession = !!lessonSessions[l.id]
                const color = pct !== undefined
                  ? pct >= 80 ? 'bg-green-500'
                    : pct >= 50 ? 'bg-amber-400'
                    : 'bg-red-400'
                  : hasSession ? 'bg-blue-400'
                  : 'bg-gray-200'
                return (
                  <div key={l.id}
                    className={`w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold text-white cursor-help transition-transform hover:scale-125 ${color}`}
                    title={`${l.title}: ${pct !== undefined ? pct + '%' : hasSession ? 'Jarayonda' : 'Boshlamagan'}`}>
                    {l.day}
                  </div>
                )
              })}
            </div>
          </div>
        )
      })()}

      {/* ── Lesson list ── */}
      <div className="grid grid-cols-1 gap-6">
        {(() => {
          const groups: { category: string; label: string; lessons: typeof lessons }[] = []
          const uncategorized = lessons.filter(l => !l.category)
          if (uncategorized.length > 0) {
            groups.push({ category: '', label: 'Asosiy', lessons: uncategorized })
          }
          const tenses = lessons.filter(l => l.category === 'tenses')
          if (tenses.length > 0) {
            groups.push({ category: 'tenses', label: "Zamonlar", lessons: tenses })
          }
          return groups
        })().map(group => (
          <div key={group.category || 'default'} className="space-y-3">
            <div className="flex items-center gap-2 px-1">
              <span className="text-xs font-bold uppercase tracking-wider text-gray-500">
                {group.label}
              </span>
              <div className="h-px flex-1 bg-gray-100" />
              <span className="text-xs text-gray-400">{group.lessons.length} ta dars</span>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {group.lessons.map((lesson) => {
                const pct = lessonScores[lesson.id]
                const session = lessonSessions[lesson.id]
                const tabLabels: Record<string, string> = {
                  grammar: '📚 Qoidalar', vocab: '📝 Lug\'at', examples: '📖 Misollar',
                  special: '🎯 Maxsus', exercises: '✍️ Mashqlar', tests: '🧪 Testlar',
                }
                return (
                <button
                  key={lesson.id}
                  onClick={() => setSelected(lesson.id)}
                  className="card-hover text-left flex flex-col gap-3 p-3 sm:p-5 group"
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

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 text-primary-600 font-semibold text-sm group-hover:gap-3 transition-all">
                      {pct !== undefined ? 'Davom etish' : 'Boshlash'} <ChevronRight size={15} />
                    </div>
                    {session && (
                      <span className="text-[10px] text-gray-400">
                        {tabLabels[session.tab] ?? session.tab}
                        {session.tab === 'exercises' && ` · ${session.currentSection + 1}-bo'lim`}
                        {session.tab === 'tests' && ` · ${session.testSection + 1}-bo'lim`}
                      </span>
                    )}
                  </div>
                </button>
                )
              })}
            </div>
          </div>
        ))}
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
