// Speaking Path — Qadam 5: Cool-down (mulohaza + mini recall)
// Reja: docs/speaking-path-roadmap.md (3.2-bo'lim)
// Suhbatdan keyin: tabrik, chunklarni takrorlash + 2 ta recall mini-quiz

import { useState, useMemo } from 'react'
import { Sparkles, Check, X, Volume2, ArrowRight, Brain } from 'lucide-react'
import { useSpeechSynthesis } from '../../../hooks/useSpeechSynthesis'
import type { SpeakingDay } from '../../../data/speakingPath/types'

interface Props {
  day: SpeakingDay
  speakScore: number
  spokenSeconds: number
  onNext: () => void
}

/** Tasodifiy n ta elementni tanlash */
function pickRandom<T>(arr: T[], n: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5)
  return shuffled.slice(0, n)
}

export default function CooldownStep({ day, speakScore, spokenSeconds, onNext }: Props) {
  const { speak, supported } = useSpeechSynthesis()
  const [phase, setPhase] = useState<'congrats' | 'recap' | 'quiz' | 'done'>('congrats')

  // 2 ta random chunk (quiz uchun)
  const quizChunks = useMemo(() => pickRandom(day.chunks, 2), [day.chunks])
  const [quizIndex, setQuizIndex] = useState(0)
  const [quizRevealed, setQuizRevealed] = useState(false)
  const [quizResults, setQuizResults] = useState<boolean[]>([])

  const spokenLabel = spokenSeconds < 60
    ? `${spokenSeconds} soniya`
    : `${Math.round(spokenSeconds / 60)} daqiqa`

  const handleReveal = (correct: boolean) => {
    setQuizRevealed(true)
    setQuizResults(prev => [...prev, correct])
  }

  const handleNextQuiz = () => {
    if (quizIndex < quizChunks.length - 1) {
      setQuizIndex(i => i + 1)
      setQuizRevealed(false)
    } else {
      setPhase('done')
    }
  }

  // ── Congratulation ──
  if (phase === 'congrats') {
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="rounded-2xl p-6 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 border border-emerald-200 dark:border-emerald-800/50 text-center">
          <div className="w-16 h-16 mx-auto rounded-full bg-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-200 dark:shadow-emerald-900/50">
            <Sparkles size={32} className="text-white" />
          </div>
          <p className="mt-3 text-xl font-black text-gray-900 dark:text-gray-100">
            Ajoyib suhbat! 🎉
          </p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1 leading-relaxed">
            Siz bugun <strong>{day.chunks.length} ta</strong> yangi iborani o'rgandiz
            va AI bilan <strong>{day.scenario.topic}</strong> mavzusida suhbatlashdiz.
          </p>
          <div className="mt-4 flex items-center justify-center gap-6 text-sm">
            <div className="text-center">
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{speakScore}%</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Talaffuz</p>
            </div>
            <div className="w-px h-10 bg-emerald-200 dark:bg-emerald-800" />
            <div className="text-center">
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{spokenLabel}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Gapirilgan vaqt</p>
            </div>
            <div className="w-px h-10 bg-emerald-200 dark:bg-emerald-800" />
            <div className="text-center">
              <p className="text-2xl font-black text-emerald-600 dark:text-emerald-400">{day.chunks.length}</p>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider">Iboralar</p>
            </div>
          </div>
          <button
            onClick={() => setPhase('recap')}
            className="mt-5 w-full py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white font-bold text-sm hover:from-emerald-600 hover:to-green-700 active:scale-[0.98] transition-all shadow-md"
          >
            Bugungi iboralarni ko'rish
          </button>
        </div>
      </div>
    )
  }

  // ── Recap (barcha chunklarni ko'rish) ──
  if (phase === 'recap') {
    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="rounded-2xl p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-2 mb-4">
            <Brain size={18} className="text-violet-600 dark:text-violet-400" />
            <p className="font-black text-sm text-gray-900 dark:text-gray-100">Bugun o'rgangan iboralaringiz</p>
          </div>
          <div className="space-y-2">
            {day.chunks.map((c, i) => (
              <div
                key={c.id}
                className="flex items-start gap-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-700/50 border border-gray-100 dark:border-gray-600/50 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-900/40 text-primary-600 dark:text-primary-300 text-[11px] font-bold flex items-center justify-center shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="font-bold text-sm text-gray-900 dark:text-gray-100">{c.en}</p>
                    <button
                      onClick={() => supported && speak(c.en)}
                      disabled={!supported}
                      className="p-1 rounded-md bg-primary-50 dark:bg-primary-900/30 text-primary-500 hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors disabled:opacity-50"
                    >
                      <Volume2 size={12} />
                    </button>
                  </div>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{c.uz}</p>
                  {c.grammarTip && (
                    <p className="text-[10px] text-primary-600 dark:text-primary-400 mt-0.5 italic">
                      💡 {c.grammarTip}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={() => { setPhase('quiz'); setQuizIndex(0); setQuizRevealed(false); setQuizResults([]) }}
          className="w-full py-3 rounded-2xl bg-gradient-to-r from-violet-500 to-purple-600 text-white font-bold text-sm hover:from-violet-600 hover:to-purple-700 active:scale-[0.98] transition-all shadow-md"
        >
          ⚡ Tezkor recall <ArrowRight size={16} className="inline" />
        </button>
      </div>
    )
  }

  // ── Quiz (mini recall) ──
  if (phase === 'quiz') {
    const chunk = quizChunks[quizIndex]

    return (
      <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="text-center">
          <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Mini recall</p>
          <p className="text-[11px] text-gray-400 mt-0.5">{quizIndex + 1} / {quizChunks.length}</p>
        </div>

        {!quizRevealed ? (
          <div className="rounded-2xl p-6 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-900/20 dark:to-purple-900/20 border border-violet-200 dark:border-violet-800/50 text-center">
            <p className="text-[11px] font-bold text-violet-500 dark:text-violet-400 uppercase tracking-wider">Inglizchasini eslang</p>
            <p className="text-xl font-black text-gray-900 dark:text-gray-100 mt-2">{chunk.uz}</p>
            {chunk.ipa && (
              <p className="text-[11px] text-violet-400 dark:text-violet-500 mt-1 font-mono">{chunk.ipa}</p>
            )}
            <div className="mt-5 flex gap-3">
              <button
                onClick={() => handleReveal(false)}
                className="flex-1 py-3 rounded-xl bg-rose-100 dark:bg-rose-900/30 text-rose-700 dark:text-rose-300 font-bold text-sm hover:bg-rose-200 dark:hover:bg-rose-900/50 transition-colors active:scale-[0.98]"
              >
                <X size={18} className="inline mr-1" /> Esimda yo'q
              </button>
              <button
                onClick={() => handleReveal(true)}
                className="flex-1 py-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 font-bold text-sm hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors active:scale-[0.98]"
              >
                <Check size={18} className="inline mr-1" /> Esladim!
              </button>
            </div>
          </div>
        ) : (
          <div className="rounded-2xl p-5 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-center">
            <div className={`w-12 h-12 mx-auto rounded-2xl flex items-center justify-center ${quizResults[quizResults.length - 1] ? 'bg-emerald-500' : 'bg-rose-500'}`}>
              {quizResults[quizResults.length - 1] ? <Check size={24} className="text-white" /> : <X size={24} className="text-white" />}
            </div>
            <p className="text-lg font-black text-gray-900 dark:text-gray-100 mt-2">{chunk.en}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{chunk.uz}</p>
            {chunk.grammarTip && (
              <p className="text-[10px] text-primary-600 dark:text-primary-400 mt-2 italic">
                💡 {chunk.grammarTip}
              </p>
            )}
            <button
              onClick={() => supported && speak(chunk.en)}
              disabled={!supported}
              className="mt-3 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-300 text-xs font-semibold hover:bg-primary-100 dark:hover:bg-primary-900/50 transition-colors disabled:opacity-50"
            >
              <Volume2 size={13} /> Tinglash
            </button>
            <button
              onClick={handleNextQuiz}
              className="mt-4 w-full py-3 rounded-2xl bg-primary-600 text-white font-bold text-sm hover:bg-primary-700 active:scale-[0.98] transition-all"
            >
              {quizIndex < quizChunks.length - 1 ? 'Keyingi so\'z' : 'Natijani ko\'rish'}
            </button>
          </div>
        )}
      </div>
    )
  }

  // ── Done ──
  return (
    <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="rounded-2xl p-6 bg-gradient-to-br from-primary-50 to-emerald-50 dark:from-primary-900/20 dark:to-emerald-900/20 border border-primary-200 dark:border-primary-800/50 text-center">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500 flex items-center justify-center">
          <Sparkles size={28} className="text-white" />
        </div>
        <p className="mt-3 font-black text-gray-900 dark:text-gray-100">Ajoyib! {day.day}-kun yakunlandi 🎉</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Bugun {day.chunks.length} ta ibora o'rganildi · {spokenLabel} gapirildi · ⭐ {speakScore}%
        </p>
      </div>
      <button
        onClick={onNext}
        className="w-full py-3 rounded-2xl bg-primary-600 text-white font-bold text-sm hover:bg-primary-700 active:scale-[0.98] transition-all"
      >
        Kunni yakunlash
      </button>
    </div>
  )
}
