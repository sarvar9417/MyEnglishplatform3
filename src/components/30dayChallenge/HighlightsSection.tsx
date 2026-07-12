import { useState } from 'react'
import { ChevronDown, ChevronUp, Lightbulb, Target, Sparkles } from 'lucide-react'
import type { LessonHighlight } from '../../data/30dayChallenge'

interface Props {
  highlights: LessonHighlight[]
}

const HIGHLIGHT_ICONS = ['📘', '🗣️', '💡', '🎯', '⭐']

export default function HighlightsSection({ highlights }: Props) {
  const [expanded, setExpanded] = useState<number>(0) // First one open by default

  return (
    <div className="space-y-3">
      <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
        <Lightbulb size={18} className="text-amber-500" />
        Dars bo'limlari
      </h3>

      <div className="space-y-2">
        {highlights.map((h, i) => {
          const isOpen = expanded === i

          return (
            <div
              key={i}
              className="rounded-2xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 overflow-hidden transition-all duration-200 hover:shadow-md"
            >
              {/* Header button */}
              <button
                onClick={() => setExpanded(isOpen ? -1 : i)}
                className={`
                  w-full flex items-center gap-3 p-4 text-left transition-colors
                  ${isOpen ? 'bg-gradient-to-r from-primary-50 to-indigo-50 dark:from-primary-900/20 dark:to-indigo-900/20 border-b border-gray-200 dark:border-gray-700' : 'hover:bg-gray-50 dark:hover:bg-gray-750'}
                `}
              >
                <span className="text-xl shrink-0">{HIGHLIGHT_ICONS[i] ?? '📌'}</span>
                <span className="flex-1 font-bold text-sm sm:text-base text-gray-900 dark:text-gray-100">{h.title}</span>
                <div className={`p-1.5 rounded-lg transition-all ${isOpen ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-600' : 'text-gray-400'}`}>
                  {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                </div>
              </button>

              {/* Content */}
              {isOpen && (
                <div className="p-4 space-y-4 animate-slide-down">
                  {/* Description */}
                  <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">{h.content}</p>

                  {/* Key points */}
                  {h.points && h.points.length > 0 && (
                    <div className="space-y-1.5">
                      {h.points.map((p, j) => (
                        <div key={j} className="flex items-start gap-2.5 p-2 rounded-lg bg-gray-50 dark:bg-gray-700/30">
                          <div className="w-5 h-5 rounded-full bg-primary-100 dark:bg-primary-900/40 flex items-center justify-center shrink-0 mt-0.5">
                            <Target size={10} className="text-primary-600" />
                          </div>
                          <p className="text-sm text-gray-700 dark:text-gray-300">{p}</p>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Phrases */}
                  {h.phrases && h.phrases.length > 0 && (
                    <div className="space-y-1.5 bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-750 rounded-xl p-3 border border-gray-200 dark:border-gray-700">
                      <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase flex items-center gap-1">
                        <Sparkles size={12} /> Muhim iboralar
                      </p>
                      {h.phrases.map((p, j) => (
                        <div key={j} className="flex items-center justify-between gap-2 text-sm py-1 border-b border-gray-100 dark:border-gray-700 last:border-0">
                          <span className="text-primary-600 dark:text-primary-400 font-medium">{p.phrase}</span>
                          <span className="text-gray-500 dark:text-gray-400 text-xs shrink-0 ml-2">{p.meaning}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
