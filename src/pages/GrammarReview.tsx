import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { CheckCircle, Brain, ArrowRight } from 'lucide-react'
import LessonDemo from '../components/dailyLesson/LessonDemo'
import { DEMO_LESSONS, type DemoLesson } from '../data/lessonDemoContent'
import { getDueReviews } from '../lib/grammarSrs'
import WeakAreasCard from '../components/grammar/WeakAreasCard'

export default function GrammarReview() {
  const navigate = useNavigate()
  // Bugun takrorlash kerak bo'lgan darslar (mount paytida bir marta)
  const dueLessons = useMemo<DemoLesson[]>(() => {
    return getDueReviews()
      .map(r => Object.values(DEMO_LESSONS).find(d => d.id === r.lessonId))
      .filter((d): d is DemoLesson => !!d)
  }, [])

  const [idx, setIdx] = useState(0)
  const [done, setDone] = useState(false)

  // Hech narsa takrorlash kerak emas
  if (dueLessons.length === 0 || done) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center">
        <div className="text-7xl mb-4">{done ? '🎉' : '✅'}</div>
        <h2 className="text-2xl font-black text-gray-900 dark:text-white mb-2">
          {done ? 'Takrorlash tugadi!' : 'Hozircha takrorlash yo\'q'}
        </h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 max-w-xs mb-6">
          {done
            ? 'Ajoyib! Bilimingiz mustahkamlandi. Ertaga yana takrorlash bo\'lishi mumkin.'
            : 'Hamma narsa o\'z vaqtida. Yangi dars o\'rganing — keyin u takrorlash jadvaliga qo\'shiladi.'}
        </p>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => navigate('/lesson')} className="btn-primary px-8 py-3 font-bold">
            Darslarga o'tish →
          </button>
          <button onClick={() => navigate('/mixed-review')} className="btn-ghost px-8 py-3 font-bold border border-gray-200 dark:border-gray-700 rounded-xl">
            🔀 Aralash takror
          </button>
        </div>
        <div className="w-full max-w-sm mt-8">
          <WeakAreasCard />
        </div>
      </div>
    )
  }

  const current = dueLessons[idx]

  return (
    <LessonDemo
      key={current.id}
      lesson={current}
      onExit={() => {
        // Keyingi takror darsiga yoki tugatish
        if (idx < dueLessons.length - 1) {
          setIdx(i => i + 1)
        } else {
          setDone(true)
        }
      }}
    />
  )
}

// Takrorlash kerak bo'lgan darslar ro'yxati (overview — ixtiyoriy)
export function ReviewOverview() {
  const navigate = useNavigate()
  const due = getDueReviews()
  const lessons = due
    .map(r => ({ review: r, demo: Object.values(DEMO_LESSONS).find(d => d.id === r.lessonId) }))
    .filter(x => x.demo)

  if (lessons.length === 0) return null

  return (
    <div className="card">
      <div className="flex items-center gap-2 mb-3">
        <Brain size={18} className="text-violet-500" />
        <h3 className="text-sm font-bold text-gray-800 dark:text-white">Takrorlash kerak</h3>
      </div>
      <div className="space-y-2">
        {lessons.map(({ review, demo }) => (
          <div key={review.lessonId} className="flex items-center gap-3 p-2.5 rounded-xl bg-gray-50 dark:bg-gray-800">
            <span className="text-xl">{demo!.emoji}</span>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-800 dark:text-gray-200 truncate">{demo!.skill}</p>
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
        Takrorlashni boshlash <ArrowRight size={16} />
      </button>
    </div>
  )
}
