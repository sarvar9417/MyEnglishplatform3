import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { useI18n } from '../i18n'
import { CheckCircle, Brain, ArrowRight, BookOpen } from 'lucide-react'
import { getDueReviews } from '../lib/grammarSrs'
import WeakAreasCard from '../components/grammar/WeakAreasCard'

export default function GrammarReview() {
  const navigate = useNavigate()
  const { t } = useI18n()
  // Bugun takrorlash kerak bo'lgan darslar (mount paytida bir marta)
  const dueCount = useMemo(() => {
    return getDueReviews().length
  }, [])

  // Hech narsa takrorlash kerak emas
  if (dueCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
        <div className="text-7xl mb-4">✅</div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
          {t('grammarReview.noReviewsTitle')}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-6">
          {t('grammarReview.noReviewsDesc')}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => navigate('/lesson')} className="btn-primary px-8 py-3 font-bold">
            {t('grammarReview.goToLessons')}
          </button>
          <button onClick={() => navigate('/mixed-review')} className="btn-ghost px-8 py-3 font-bold border border-gray-200 dark:border-gray-700 rounded-xl">
            {t('grammarReview.mixedReview')}
          </button>
        </div>
        <div className="w-full max-w-sm mt-8">
          <WeakAreasCard />
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
      <div className="text-7xl mb-4">📚</div>
      <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
        Takrorlash vaqti keldi
      </h2>
      <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-4">
        Sizda <strong>{dueCount} ta dars</strong> takrorlash uchun tayyor. Tez orada bu funksiya to'liq ishga tushadi.
      </p>
      <div className="flex items-center gap-3 mb-6">
        <Brain size={20} className="text-violet-500" />
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {dueCount} ta takror
        </span>
      </div>
      <button
        onClick={() => navigate('/lesson')}
        className="btn-primary px-8 py-3 font-bold flex items-center gap-2"
      >
        <BookOpen size={18} /> Darslarga o'tish <ArrowRight size={18} />
      </button>
      <div className="w-full max-w-sm mt-8">
        <WeakAreasCard />
      </div>
    </div>
  )
}

// Takrorlash kerak bo'lgan darslar ro'yxati (overview — ixtiyoriy)
export function ReviewOverview() {
  const navigate = useNavigate()
  const { t } = useI18n()
  const due = getDueReviews()

  if (due.length === 0) return null

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <Brain size={18} className="text-violet-500" />
        <h3 className="text-sm font-bold text-gray-800 dark:text-white">{t('grammarReview.reviewListTitle')}</h3>
      </div>
      <div className="space-y-2">
        {due.map((review, i) => (
          <div key={review.lessonId} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800">
            <span className="text-xl">{['📖', '📝', '🎯', '📚', '✍️', '🧪'][i % 6]}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{review.lessonId}</p>
              <p className="text-[10px] text-gray-400">Daraja {review.box + 1}/6 · {review.lapses > 0 ? `${review.lapses} marta qiyin` : 'yangi'}</p>
            </div>
            <CheckCircle size={16} className="text-gray-300" />
          </div>
        ))}
      </div>
      <button
        onClick={() => navigate('/review')}
        className="w-full btn-primary mt-3 py-2.5 flex items-center justify-center gap-2 font-bold"
      >
        {t('grammarReview.startReview')} <ArrowRight size={16} />
      </button>
    </div>
  )
}
