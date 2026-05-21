import { ChevronRight } from 'lucide-react'
import type { GameWord } from '../../store/vocabularyStore'

const BOX_COLORS: Record<number, string> = {
  1: 'bg-gray-100 border-gray-200',
  2: 'bg-green-50 border-green-200',
  3: 'bg-blue-50 border-blue-200',
  4: 'bg-purple-50 border-purple-200',
  5: 'bg-yellow-50 border-yellow-200',
  6: 'bg-orange-50 border-orange-300',
}

const BOX_LABELS: Record<number, string> = {
  1: '1 kun',
  2: '3 kun',
  3: '7 kun',
  4: '14 kun',
  5: '30 kun',
  6: '90 kun',
}

const LEVEL_BADGES: Record<string, string> = {
  A1: 'bg-gray-100 text-gray-600',
  A2: 'bg-primary-100 text-primary-700',
  B1: 'bg-b1-100 text-b1-700',
  B2: 'bg-b2-100 text-b2-700',
}

export default function FlashCard({
  word,
  flipped,
  onFlip,
}: {
  word: GameWord
  flipped: boolean
  onFlip: () => void
}) {
  return (
    <div
      className="w-full cursor-pointer select-none"
      onClick={!flipped ? onFlip : undefined}
    >
      <div className="relative w-full min-h-[260px] sm:min-h-[280px]">
        <div
          className={`absolute inset-0 rounded-2xl border-2 transition-all duration-500 ${
            flipped ? 'opacity-0 pointer-events-none rotate-y-180' : 'opacity-100'
          } ${BOX_COLORS[word.box] || BOX_COLORS[1]} flex flex-col items-center justify-center p-6 sm:p-8`}
        >
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full mb-4 ${LEVEL_BADGES[word.level] || LEVEL_BADGES.A1}`}>
            {word.level}
          </span>
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 text-center mb-2">{word.english}</p>
          {word.phonetic && (
            <p className="text-sm text-gray-400 font-mono mb-2">/{word.phonetic}/</p>
          )}
          {word.is_new && (
            <span className="text-[10px] font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
              Yangi
            </span>
          )}
          <div className="flex items-center gap-1.5 mt-4">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div
                key={n}
                className={`w-2 h-2 rounded-full ${
                  n <= word.box
                    ? word.box >= 6 ? 'bg-orange-500'
                    : word.box >= 5 ? 'bg-yellow-500'
                    : word.box >= 4 ? 'bg-purple-500'
                    : word.box >= 3 ? 'bg-blue-500'
                    : word.box >= 2 ? 'bg-green-500'
                    : 'bg-gray-400'
                    : 'bg-gray-200'
                }`}
              />
            ))}
            <span className="text-[10px] text-gray-400 ml-1">
              Box {word.box}/6 · {BOX_LABELS[word.box] ?? '90 kun'}
            </span>
          </div>
          {!flipped && (
            <button
              onClick={(e) => { e.stopPropagation(); onFlip() }}
              className="btn-primary mt-6 text-sm flex items-center gap-2"
            >
              Ko'rish <ChevronRight size={14} />
            </button>
          )}
        </div>

        <div
          className={`absolute inset-0 rounded-2xl border-2 transition-all duration-500 ${
            flipped ? 'opacity-100 rotate-y-0' : 'opacity-0 pointer-events-none -rotate-y-180'
          } border-b1-200 bg-b1-50 flex flex-col p-6`}
        >
          <div className="flex items-start justify-between mb-3">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${LEVEL_BADGES[word.level] || LEVEL_BADGES.A1}`}>
              {word.level}
            </span>
            {word.is_new && (
              <span className="text-[10px] font-semibold text-primary-600 bg-primary-50 px-2 py-0.5 rounded-full">
                Yangi
              </span>
            )}
          </div>
          <p className="text-xl font-bold text-gray-900 mb-0.5">{word.english}</p>
          {word.phonetic && (
            <p className="text-sm text-gray-400 font-mono mb-2">/{word.phonetic}/</p>
          )}
          <div className="bg-white rounded-xl px-4 py-3 mt-2">
            <p className="text-base font-semibold text-b1-700">{word.uzbek}</p>
          </div>
          {word.example && (
            <div className="bg-white/60 rounded-xl px-4 py-3 mt-2 italic text-sm text-gray-600 border border-b1-100">
              “{word.example}”
            </div>
          )}
          <div className="mt-auto pt-4 flex items-center justify-between text-xs text-gray-400">
            {word.is_learned ? (
              <span className="text-yellow-600 font-semibold">⭐ Yodlagan</span>
            ) : (
              <span>Box {word.box}</span>
            )}
            <span>✅ {word.correct_count} | ❌ {word.wrong_count}</span>
          </div>
        </div>
      </div>
    </div>
  )
}
