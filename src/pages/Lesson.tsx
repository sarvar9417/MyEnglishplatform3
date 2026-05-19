import { useNavigate } from 'react-router-dom'
import { BookOpen, BookMarked, Headphones, PenLine, ChevronRight, Sparkles, GanttChartSquare } from 'lucide-react'

const LESSON_TYPES = [
  {
    id:    'grammar',
    label: 'Grammar',
    sub:   'Conditionals, Tenses, Passive...',
    emoji: '📚',
    Icon:  BookOpen,
    color: 'text-primary-600',
    bg:    'bg-primary-50 hover:bg-primary-100 border-primary-100',
    to:    '/grammar',
  },
  {
    id:    'vocabulary',
    label: 'Vocabulary',
    sub:   "Spaced Repetition (SRS) bilan 100 so'z",
    emoji: '📝',
    Icon:  BookMarked,
    color: 'text-b1-600',
    bg:    'bg-b1-50 hover:bg-b1-100 border-b1-100',
    to:    '/vocabulary',
  },
  {
    id:    'listening',
    label: 'Listening',
    sub:   'YouTube + Transcript + Shadowing',
    emoji: '🎧',
    Icon:  Headphones,
    color: 'text-orange-600',
    bg:    'bg-orange-50 hover:bg-orange-100 border-orange-100',
    to:    '/listening',
  },
  {
    id:    'speaking',
    label: 'Speaking',
    sub:   'Web Speech API · Claude baholaydi',
    emoji: '🎤',
    Icon:  PenLine,
    color: 'text-b2-600',
    bg:    'bg-b2-50 hover:bg-b2-100 border-b2-100',
    to:    '/speaking',
  },
  {
    id:    'reading',
    label: 'Reading',
    sub:   'Timed · Comprehension · Vocabulary',
    emoji: '📖',
    Icon:  BookOpen,
    color: 'text-green-600',
    bg:    'bg-green-50 hover:bg-green-100 border-green-100',
    to:    '/reading',
  },
  {
    id:    'writing',
    label: 'Writing',
    sub:   'AI feedback · Yaxshilangan versiya',
    emoji: '✍️',
    Icon:  GanttChartSquare,
    color: 'text-purple-600',
    bg:    'bg-purple-50 hover:bg-purple-100 border-purple-100',
    to:    '/writing',
  },
]

export default function Lesson() {
  const navigate = useNavigate()

  return (
    <div className="p-3 sm:p-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-primary-100 rounded-xl flex items-center justify-center">
          <Sparkles size={20} className="text-primary-600" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Dars tanlang</h1>
          <p className="text-xs text-gray-500">Qaysi soha bo'yicha mashq qilmoqchisiz?</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
        {LESSON_TYPES.map((type) => (
          <button
            key={type.id}
            onClick={() => type.to ? navigate(type.to) : undefined}
            disabled={!type.to}
             className={`relative flex flex-col gap-3 p-3 sm:p-5 rounded-2xl border text-left
              transition-all duration-200 group
              ${type.to
                ? `${type.bg} cursor-pointer hover:shadow-md hover:-translate-y-0.5`
                : 'bg-gray-50 border-gray-100 cursor-not-allowed opacity-60'
              }`}
          >
            {/* Coming soon badge */}
            {!type.to && (
              <span className="absolute top-3 right-3 text-[10px] font-bold text-gray-400
                bg-gray-100 px-2 py-0.5 rounded-full">
                Tez kunda
              </span>
            )}

            <span className="text-3xl">{type.emoji}</span>

            <div>
              <p className={`font-bold text-base ${type.color}`}>{type.label}</p>
              <p className="text-xs text-gray-500 mt-0.5">{type.sub}</p>
            </div>

            {type.to && (
              <div className={`flex items-center gap-1 text-xs font-semibold ${type.color}
                group-hover:gap-2 transition-all`}>
                Boshlash <ChevronRight size={13} />
              </div>
            )}
          </button>
        ))}
      </div>

      <div className="mt-5 card bg-gradient-to-r from-primary-50 to-b2-50 border-primary-100">
        <p className="text-sm text-gray-700 font-medium flex items-center gap-2">
          💡 <span>Har kuni kamida 4 ta darsni bajaring: Grammar + Vocabulary + Listening + Writing</span>
        </p>
      </div>
    </div>
  )
}
