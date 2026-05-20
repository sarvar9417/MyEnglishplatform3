import { supabase } from '../db/supabase'
import { LISTENING_LESSONS } from '../data/listeningLessons'
import type { ListeningLesson } from '../data/listeningLessons'

/** Save listening exercise result to Supabase */
export async function saveListeningResult(params: {
  userId:       string
  lessonId:     string
  lessonTitle:  string
  fillCorrect:  number
  fillTotal:    number
  tfCorrect:    number
  tfTotal:      number
  summaryDone:  boolean
  xpEarned:     number
}) {
  const { userId, lessonId, lessonTitle, fillCorrect, fillTotal, tfCorrect, tfTotal, summaryDone, xpEarned } = params
  const total = fillTotal + tfTotal + 1
  const correct = fillCorrect + tfCorrect + (summaryDone ? 1 : 0)
  const score = total > 0 ? Math.round((correct / total) * 100) : 0
  const today = new Date().toISOString().split('T')[0]

  const { error } = await supabase.from('listening_progress').upsert(
    {
      user_id:       userId,
      date:          today,
      lesson_id:     lessonId,
      lesson_title:  lessonTitle,
      score,
      fill_correct:  fillCorrect,
      fill_total:    fillTotal,
      tf_correct:    tfCorrect,
      tf_total:      tfTotal,
      summary_done:  summaryDone,
      xp_earned:     xpEarned,
      completed_at:  new Date().toISOString(),
    },
    { onConflict: 'user_id,date,lesson_id' }
  )
  if (error) console.error('saveListeningResult error:', error.message)
}

export async function fetchListeningLessons(): Promise<ListeningLesson[]> {
  const { data, error } = await supabase
    .from('listening_lessons')
    .select('*')

  if (error) {
    console.warn('Supabase listening_lessons fetch failed, using fallback:', error.message)
    return LISTENING_LESSONS
  }

  if (!data || data.length === 0) return LISTENING_LESSONS

  return data.map((r) => r.data as unknown as ListeningLesson)
}
