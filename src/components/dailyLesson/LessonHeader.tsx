import { ArrowLeft } from 'lucide-react'
import LessonChallengeButton from './LessonChallengeButton'
import type { DailyLesson } from '../../data/dailyLessons'

interface LessonHeaderProps {
  lesson: DailyLesson
  prevScore: number | null
  allDone: boolean
  currentLessonScore: number | null
  onBack: () => void
}

export default function LessonHeader({ lesson, prevScore, allDone, currentLessonScore, onBack }: LessonHeaderProps) {
  return (
    <>
      <div className="flex items-center gap-2 sm:gap-3">
        <button onClick={onBack} className="btn-ghost flex items-center gap-1 text-sm">
          <ArrowLeft size={16} /> Boshqa dars
        </button>
        <div className="h-5 w-px bg-gray-200 dark:bg-gray-700" />
        <span className="badge border bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700">{lesson.level}</span>
        <span className="text-xs text-gray-400 dark:text-gray-500">Kun {lesson.day}</span>
        {prevScore !== null && (
          <span className={`badge text-xs font-bold ${prevScore >= 80 ? 'bg-green-100 dark:bg-green-900/40 text-green-700 dark:text-green-400' : prevScore >= 50 ? 'bg-yellow-100 dark:bg-yellow-900/40 text-yellow-700 dark:text-yellow-400' : 'bg-red-100 dark:bg-red-900/40 text-red-700 dark:text-red-400'}`}>
            {prevScore}% ✅
          </span>
        )}
      </div>

      <LessonChallengeButton
        lesson={lesson}
        lessonCompleted={allDone}
        lessonScore={currentLessonScore}
      />

      <div>
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-gray-100">{lesson.title}</h1>
        <p className="text-gray-500 dark:text-gray-400 text-xs sm:text-sm mt-1">{lesson.subtitle}</p>
      </div>
    </>
  )
}
