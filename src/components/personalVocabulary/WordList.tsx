import type { PersonalWord, VocabRating } from '../../types/personalVocabulary'
import { Trash2, Star, Clock, CheckCircle2, XCircle } from 'lucide-react'

interface WordListProps {
  words: PersonalWord[]
  onDelete: (id: number) => void
  onRate: (id: number, rating: VocabRating) => void
}

const CATEGORY_LABELS: Record<string, string> = {
  custom: 'Shaxsiy',
  grammar: 'Grammar',
  travel: 'Travel',
  formal: 'Formal',
  ielts: 'IELTS',
  business: 'Business',
  food: 'Food',
  health: 'Health',
  education: 'Education',
  social: 'Social',
  work: 'Work',
  shopping: 'Shopping',
  relationships: 'Relationships',
  environment: 'Environment',
  economy: 'Economy',
  culture: 'Culture',
  feelings: 'Feelings',
  discussion: 'Discussion',
  technology: 'Technology',
  communication: 'Communication',
}

export default function WordList({ words, onDelete, onRate }: WordListProps) {
  if (words.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        Hech narsa topilmadi
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {words.map((word) => (
        <div
          key={word.id}
          className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 truncate">
                  {word.english}
                </h3>
                {word.phonetic && (
                  <span className="text-sm text-gray-500 italic">{word.phonetic}</span>
                )}
                {word.is_learned && (
                  <CheckCircle2 size={16} className="text-green-500 shrink-0" />
                )}
              </div>
              <p className="text-gray-600 dark:text-gray-400 mb-2">{word.uzbek}</p>
              {word.example && (
                <p className="text-sm text-gray-500 dark:text-gray-500 italic mb-2">
                  "{word.example}"
                </p>
              )}
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span className="px-2 py-1 rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300">
                  {word.level}
                </span>
                <span className="px-2 py-1 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400">
                  {CATEGORY_LABELS[word.category] || word.category}
                </span>
                <span className="flex items-center gap-1 text-gray-500">
                  <Star size={12} />
                  Box {word.box}
                </span>
                {!word.is_learned && (
                  <span className="flex items-center gap-1 text-orange-600">
                    <Clock size={12} />
                    {new Date(word.next_review).toLocaleDateString('uz-UZ')}
                  </span>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              {!word.is_learned && (
                <div className="flex gap-1">
                  <button
                    onClick={() => onRate(word.id, 'bildim')}
                    className="p-1.5 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600 hover:bg-green-200 dark:hover:bg-green-900/50"
                    title="Bildim"
                  >
                    <CheckCircle2 size={16} />
                  </button>
                  <button
                    onClick={() => onRate(word.id, 'bilmadim')}
                    className="p-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/50"
                    title="Bilmadim"
                  >
                    <XCircle size={16} />
                  </button>
                </div>
              )}
              <button
                onClick={() => onDelete(word.id)}
                className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-red-100 dark:hover:bg-red-900/30 hover:text-red-600"
                title="O'chirish"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
