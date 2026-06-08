import { useNavigate, useSearchParams } from 'react-router-dom'
import LessonDemo from '../components/dailyLesson/LessonDemo'
import { DEMO_LESSONS, DEMO_LESSON } from '../data/lessonDemoContent'

export default function LessonDemoPage() {
  const navigate = useNavigate()
  const [params] = useSearchParams()
  const id = params.get('id') ?? 'can-ability-demo'
  const lesson = DEMO_LESSONS[id] ?? DEMO_LESSON

  return (
    <div className="p-3 sm:p-6">
      <LessonDemo lesson={lesson} onExit={() => navigate('/lesson')} />
    </div>
  )
}
