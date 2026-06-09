import { useMemo, useEffect, useRef } from 'react'
import type { DailyExercise } from '../../data/dailyLessons'
import { normalizeAnswer, OPTION_LABELS } from './helpers'
import { feelAnswer } from '../../lib/gameFeel'
import { AudioButton } from '../ui/AudioButton'

export default function ExerciseCard({
  ex, num, total, answers, onChange, submitted,
}: {
  ex: DailyExercise
  num: number
  total?: number
  answers: string[]
  onChange: (idx: number, val: string) => void
  submitted: boolean
}) {
  const cardRef = useRef<HTMLDivElement>(null)

  // Auto-focus first input when card mounts
  useEffect(() => {
    if (!submitted && cardRef.current) {
      const firstInput = cardRef.current.querySelector('input')
      if (firstInput) setTimeout(() => firstInput.focus(), 100)
    }
  }, [ex.id, submitted])

  // GameFeel when submitted
  // feelAnswer() already handles haptic: 'light' on correct, 'medium' on wrong
  useEffect(() => {
    if (submitted) {
      const correct = checkAnswer(ex, answers)
      feelAnswer({ correct })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submitted])

  const shuffledOptions = useMemo(() => {
    if (ex.type !== 'multiple-choice') return []
    const arr = [...ex.options]
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]]
    }
    return arr
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ex.id])

  const isCorrect = submitted ? checkAnswer(ex, answers) : false

  // Dynamic animation classes on submit
  const animateCls = submitted
    ? isCorrect
      ? 'animate-correct-flash'
      : 'animate-wrong-shake'
    : ''

  const borderCls = submitted
    ? isCorrect ? 'border-green-200 bg-green-50 dark:bg-green-900/20' : 'border-red-200 bg-red-50 dark:bg-red-900/20'
    : ''

  return (
    <div ref={cardRef} className={`relative rounded-2xl border p-4 transition-all duration-300 animate-pop-in ${animateCls} ${borderCls} ${
      submitted
        ? 'scale-[1.01] shadow-md'
        : 'hover:shadow-sm'
    }`}>
      {/* Progress indicator badge */}
      {total !== undefined && total > 0 && !submitted && (
        <div className="absolute -right-2 -top-2 z-10 bg-gray-800 dark:bg-gray-200 text-white dark:text-gray-800 text-[11px] font-bold px-2 py-0.5 rounded-full shadow-sm">
          {num}/{total}
        </div>
      )}

      {/* Question number / result badge */}
      <div className={`absolute -left-3 -top-3 z-10 w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shadow-sm transition-all duration-300 ${
        submitted
          ? isCorrect ? 'bg-green-500 text-white scale-110' : 'bg-red-500 text-white scale-110'
          : 'bg-primary-600 text-white'
      }`}>
        {submitted ? (isCorrect ? '✓' : '✗') : num}
      </div>

      {ex.type === 'fill-blank' && (
        <div>
          <p className="text-[11px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">📝 Bo'sh joyni to'ldiring</p>
          {ex.instruction && <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 italic">{ex.instruction}</p>}
          <div className="flex items-start gap-1.5 mb-1">
            <AudioButton text={ex.question.replace(/_{3,}/g, '___ ')} size="sm" />
            <p className="text-sm text-gray-700 dark:text-gray-300 leading-loose">
            {ex.question.split(/_{3,}/).map((part, i, arr) => (
              <span key={i}>
                {part}
                {i < arr.length - 1 && (
                  <input type="text" value={answers[i] ?? ''} onChange={(e) => onChange(i, e.target.value)} disabled={submitted} placeholder="___"
                    className={`inline-block border-b-2 w-32 text-center text-sm font-semibold outline-none bg-transparent transition-all duration-200 ${
                      submitted
                        ? normalizeAnswer(answers[i] ?? '') === normalizeAnswer(ex.blanks[i] ?? '')
                          ? 'border-green-500 text-green-700 dark:text-green-400'
                          : 'border-red-400 text-red-700 dark:text-red-400'
                        : 'border-primary-400 text-primary-700 dark:text-primary-300 focus:border-primary-600 focus:scale-105'
                    }`}
                    autoFocus={i === 0 && !submitted}
                  />
                )}
              </span>
            ))}
          </p>
          </div>
          {submitted && feedbackBlock(ex, answers, isCorrect)}
        </div>
      )}

      {ex.type === 'multiple-choice' && (
        <div>
          <p className="text-[11px] font-bold text-violet-600 dark:text-violet-400 uppercase tracking-wider mb-1">🔘 To'g'ri variantni tanlang</p>
          {ex.instruction && <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 italic">{ex.instruction}</p>}
          <div className="flex items-start gap-1.5 mb-3">
            <AudioButton text={ex.question} size="sm" />
            <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 leading-relaxed">{ex.question}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {shuffledOptions.map((opt, i) => {
              const selected = answers[0] === opt
              const correctOpt = opt === ex.correct
              let cls = 'border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-violet-400 hover:bg-violet-50 dark:hover:bg-violet-900/30'
              if (submitted) {
                if (correctOpt) cls = 'border-green-400 bg-green-100 dark:bg-green-900/40 text-green-800 dark:text-green-300 font-bold'
                else if (selected && !correctOpt) cls = 'border-red-400 bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-300'
                else cls = 'border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-400 dark:text-gray-500'
              } else if (selected) {
                cls = 'border-violet-500 bg-violet-100 dark:bg-violet-900/40 text-violet-800 dark:text-violet-300 font-semibold ring-2 ring-violet-300 dark:ring-violet-600 ring-offset-1 animate-pulse-glow'
              }
              return (
                <button key={opt} disabled={submitted} onClick={() => onChange(0, opt)}
                  className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm transition-all ${cls}`}>
                  <span className="w-5 h-5 rounded-full border border-current flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                    {OPTION_LABELS[i]}
                  </span>
                  {opt}
                </button>
              )
            })}
          </div>
          {submitted && feedbackBlock(ex, answers, isCorrect)}
        </div>
      )}

      {ex.type === 'error-correction' && (
        <div>
          <p className="text-[11px] font-bold text-amber-600 dark:text-amber-400 uppercase tracking-wider mb-1">🔍 Xatoni toping va to'g'irlang</p>
          {ex.instruction && <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 italic">{ex.instruction}</p>}
          <div className="bg-white dark:bg-gray-800 border border-amber-200 dark:border-amber-800 rounded-xl px-3 py-2 mb-3">
            <div className="flex items-start gap-1.5 mb-1">
              <AudioButton text={ex.question} size="sm" />
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              {ex.question.split(ex.errorPart).map((part, i, arr) => (
                <span key={i}>
                  {part}
                  {i < arr.length - 1 && (
                    <span className="bg-red-100 dark:bg-red-900/50 text-red-700 dark:text-red-400 font-bold px-1 rounded underline decoration-red-400">{ex.errorPart}</span>
                  )}
                </span>
              ))}
            </p>
            </div>
          </div>
          <input type="text" value={answers[0] ?? ''} onChange={(e) => onChange(0, e.target.value)} disabled={submitted}
            placeholder="To'g'ri gapni yozing..." className="input text-sm" autoFocus={!submitted} />
          {submitted && feedbackBlock(ex, answers, isCorrect)}
        </div>
      )}

      {ex.type === 'transformation' && (
        <div>
          <p className="text-[11px] font-bold text-teal-600 dark:text-teal-400 uppercase tracking-wider mb-1">🔄 Gapni o'zgartiring</p>
          {ex.instruction && <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 italic">{ex.instruction}</p>}
          <div className="bg-white dark:bg-gray-800 border border-teal-200 dark:border-teal-800 rounded-xl px-3 py-2 mb-2">
            <div className="flex items-start gap-1.5">
              <AudioButton text={ex.question} size="sm" />
              <p className="text-sm text-gray-800 dark:text-gray-200 font-medium">{ex.question}</p>
            </div>
          </div>
          <p className="text-xs text-teal-600 dark:text-teal-400 mb-2 font-medium flex items-center gap-1">
            <span>Boshlang'ich:</span>
            <span className="font-mono font-bold">{ex.hint}</span>
          </p>
          <input type="text" value={answers[0] ?? ''} onChange={(e) => onChange(0, e.target.value)} disabled={submitted}
            placeholder="To'liq javobni yozing..." className="input text-sm" autoFocus={!submitted} />
          {submitted && feedbackBlock(ex, answers, isCorrect)}
        </div>
      )}

      {ex.type === 'fill-table' && (
        <div>
          <p className="text-[11px] font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">📊 Jadvalni to'ldiring</p>
          {ex.instruction && <p className="text-xs text-gray-500 dark:text-gray-400 mb-3 italic">{ex.instruction}</p>}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b-2 border-gray-200 dark:border-gray-700 text-left text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">
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
                    <tr key={rowIdx} className="border-b border-gray-50 dark:border-gray-800">
                      <td className="py-2 pr-3 font-semibold text-gray-900 dark:text-gray-100">{row.adj}</td>
                      <td className="py-2 pr-3">
                        {row.comp ? (
                          <span className={`font-mono text-sm ${
                            submitted
                              ? normalizeAnswer(answers[compIdx] ?? '') === normalizeAnswer(row.comp)
                                ? 'text-green-600 dark:text-green-400 font-bold'
                                : 'text-red-600 dark:text-red-400'
                              : 'text-gray-400 dark:text-gray-500'
                          }`}>
                            {submitted ? (answers[compIdx] ?? '—') : (
                              <input type="text" value={answers[compIdx] ?? ''} onChange={(e) => onChange(compIdx, e.target.value)} disabled={submitted}
                                placeholder="___" className="w-28 border-b-2 border-dashed border-indigo-300 dark:border-indigo-600 text-center text-sm font-semibold outline-none bg-transparent focus:border-indigo-600 dark:focus:border-indigo-400 transition-colors" />
                            )}
                          </span>
                        ) : <span className="text-gray-300 dark:text-gray-600 italic">—</span>}
                      </td>
                      <td className="py-2">
                        {row.sup ? (
                          <span className={`font-mono text-sm ${
                            submitted
                              ? normalizeAnswer(answers[supIdx] ?? '') === normalizeAnswer(row.sup)
                                ? 'text-green-600 dark:text-green-400 font-bold'
                                : 'text-red-600 dark:text-red-400'
                              : 'text-gray-400 dark:text-gray-500'
                          }`}>
                            {submitted ? (answers[supIdx] ?? '—') : (
                              <input type="text" value={answers[supIdx] ?? ''} onChange={(e) => onChange(supIdx, e.target.value)} disabled={submitted}
                                placeholder="___" className="w-28 border-b-2 border-dashed border-indigo-300 dark:border-indigo-600 text-center text-sm font-semibold outline-none bg-transparent focus:border-indigo-600 dark:focus:border-indigo-400 transition-colors" />
                            )}
                          </span>
                        ) : <span className="text-gray-300 dark:text-gray-600 italic">—</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
          {submitted && (
            <div className={`mt-3 text-xs ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
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
                        <div key={rowIdx} className={`text-xs px-2 py-1 rounded ${(!compOk || !supOk) ? 'bg-red-50 dark:bg-red-900/30' : 'bg-green-50 dark:bg-green-900/30'}`}>
                          <span className="font-semibold">{row.adj}</span>
                          {row.comp && <span className={`ml-1 ${compOk ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>C: {compAns || '—'}</span>}
                          {row.sup && <span className={`ml-1 ${supOk ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400'}`}>S: {supAns || '—'}</span>}
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
                        <div key={rowIdx} className="text-xs px-2 py-1 rounded bg-green-50 dark:bg-green-900/30">
                          <span className="font-semibold text-gray-800 dark:text-gray-200">{row.adj}</span>
                          {!compOk && <span className="ml-1 text-green-600 dark:text-green-400">C: {row.comp}</span>}
                          {!supOk && <span className="ml-1 text-green-600 dark:text-green-400">S: {row.sup}</span>}
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
              {isCorrect && <p className="font-semibold">✅ To'g'ri! +10 XP</p>}
              <p className="mt-1 text-gray-600 dark:text-gray-400">💡 {ex.explanation}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function checkAnswer(ex: DailyExercise, userAns: string[]): boolean {
  return submittedCheck(ex, userAns)
}

function submittedCheck(ex: DailyExercise, userAns: string[]): boolean {
  if (!userAns || userAns.length === 0) return false
  switch (ex.type) {
    case 'fill-blank':
      return ex.blanks.every((b, i) => {
        const cleaned = normalizeAnswer(userAns[i] ?? '')
        return b.split('/').some(alt => normalizeAnswer(alt) === cleaned)
      })
    case 'multiple-choice':
    case 'error-correction':
    case 'transformation':
      return normalizeAnswer(userAns[0] ?? '') === normalizeAnswer(ex.correct)
    case 'fill-table': {
      const expected = ex.rows.flatMap((r) => [r.comp, r.sup])
      return expected.every((b, i) => b === '' || normalizeAnswer(userAns[i] ?? '') === normalizeAnswer(b))
    }
  }
}

function feedbackBlock(ex: DailyExercise, answers: string[], isCorrect: boolean) {
  return (
    <div className={`mt-3 text-xs ${isCorrect ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
      {!isCorrect && (
        <>
          <p className="font-semibold">✍️ Sizning javobingiz: <span className="font-mono">{
            ex.type === 'fill-blank'
              ? (answers.join(' / ') || "(bo'sh)")
              : (answers[0] || "(bo'sh)")
          }</span></p>
          <p className="font-semibold">✅ To'g'ri javob: <span className="font-mono">{
            ex.type === 'fill-blank' ? ex.blanks.join(' / ') :
            ex.type === 'fill-table' ? 'jadvalda ko\'rsatilgan' :
            ex.correct
          }</span></p>
        </>
      )}
      {isCorrect && <p className="font-semibold">✅ To'g'ri! +10 XP</p>}
      <p className="mt-1 text-gray-600 dark:text-gray-400">💡 {ex.explanation}</p>
    </div>
  )
}
