import { useState } from 'react'
import { Volume2, Check, RotateCw, BookOpen } from 'lucide-react'
import type { ChallengeVocab } from '../../data/30dayChallenge'

interface Props {
  vocabulary: ChallengeVocab[]
}

export default function VocabularySection({ vocabulary }: Props) {
  const [learned, setLearned] = useState<Set<string>>(new Set())
  const [flipped, setFlipped] = useState<string | null>(null)
  const [studyMode, setStudyMode] = useState<'cards' | 'list'>('cards')

  const toggleLearned = (word: string) => {
    const next = new Set(learned)
    if (next.has(word)) next.delete(word)
    else next.add(word)
    setLearned(next)
  }

  const speakWord = (text: string) => {
    if ('speechSynthesis' in window) {
      const u = new SpeechSynthesisUtterance(text)
      u.lang = 'en-US'
      u.rate = 0.85
      speechSynthesis.speak(u)
    }
  }

  const progressPct = Math.round((learned.size / vocabulary.length) * 100)

  return (
    <div className="space-y-4">
      {/* Header with progress */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          <BookOpen size={18} className="text-primary-600" />
          Lug'at ({vocabulary.length} ta so'z)
        </h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500 dark:text-gray-400 font-medium">
            {learned.size}/{vocabulary.length}
          </span>
          <button
            onClick={() => setStudyMode(studyMode === 'cards' ? 'list' : 'cards')}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            <RotateCw size={12} />
            {studyMode === 'cards' ? 'Ro' : 'Kartalar'}
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-emerald-500 rounded-full transition-all duration-500"
          style={{ width: `${progressPct}%` }}
        />
      </div>

      {studyMode === 'cards' ? (
        /* ── Flashcard mode with 3D flip ────────────────────────────── */
        <div className="animate-stagger">
          {vocabulary.map((v) => {
            const isFlipped = flipped === v.word
            const isLearned = learned.has(v.word)

            return (
              <div key={v.word} className="flashcard-scene h-36 sm:h-40 mb-3">
                <div
                  className={`flashcard-inner cursor-pointer ${isFlipped ? 'is-flipped' : ''}`}
                  onClick={() => setFlipped(isFlipped ? null : v.word)}
                >
                  {/* Front face */}
                  <div className={`
                    flashcard-face flex flex-col items-center justify-center p-5 text-center
                    ${isLearned
                      ? 'bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-2 border-green-300 dark:border-green-700'
                      : 'bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700'
                    }
                  `}>
                    <p className="text-xl font-black text-gray-900 dark:text-gray-100 mb-1">{v.word}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{v.meaning}</p>
                    <p className="text-xs text-gray-400 mt-2">Bosib misolni ko'ring</p>
                  </div>

                  {/* Back face */}
                  <div className="flashcard-face is-back bg-white dark:bg-gray-800 border-2 border-primary-300 dark:border-primary-600 p-4">
                    <div className="flex flex-col justify-center h-full">
                      <p className="text-base font-bold text-primary-600 dark:text-primary-400 italic mb-1">"{v.example}"</p>
                      {v.translation && (
                        <p className="text-sm text-gray-500 dark:text-gray-400">→ {v.translation}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Action buttons */}
                <div className="absolute bottom-2 right-2 z-10">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); speakWord(v.word) }}
                      className="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                    >
                      <Volume2 size={14} />
                    </button>
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleLearned(v.word) }}
                      className={`p-2 rounded-lg transition-colors ${isLearned ? 'text-green-600 bg-green-100 dark:bg-green-900/40' : 'text-gray-400 hover:text-green-600'}`}
                    >
                      <Check size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        /* ── List mode ────────────────────────────────────────────── */
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
          {vocabulary.map((v) => {
            const isLearned = learned.has(v.word)
            return (
              <div
                key={v.word}
                className={`
                  flex items-center justify-between p-3 rounded-xl border transition-all
                  ${isLearned
                    ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                    : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                  }
                `}
              >
                <div>
                  <p className="font-bold text-gray-900 dark:text-gray-100">{v.word}</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{v.meaning}</p>
                  <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">"{v.example}"</p>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => speakWord(v.word)}
                    className="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors"
                  >
                    <Volume2 size={14} />
                  </button>
                  <button
                    onClick={() => toggleLearned(v.word)}
                    className={`p-2 rounded-lg transition-colors ${isLearned ? 'text-green-600 bg-green-100 dark:bg-green-900/40' : 'text-gray-400 hover:text-green-600'}`}
                  >
                    <Check size={14} />
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
