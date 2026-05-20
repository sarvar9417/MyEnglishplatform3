import { supabase } from '../db/supabase'
import { READING_TEXTS } from '../data/readingTexts'
import type { ReadingText } from '../data/readingTexts'

/** Save reading quiz result to Supabase */
export async function saveReadingResult(params: {
  userId:         string
  textId:         string
  textTitle:      string
  correctCount:   number
  totalQuestions: number
  xpEarned:       number
}) {
  const { userId, textId, textTitle, correctCount, totalQuestions, xpEarned } = params
  const score = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0
  const today = new Date().toISOString().split('T')[0]

  const { error } = await supabase.from('reading_progress').upsert(
    {
      user_id:         userId,
      date:            today,
      text_id:         textId,
      text_title:      textTitle,
      score,
      correct_count:   correctCount,
      total_questions: totalQuestions,
      xp_earned:       xpEarned,
      completed_at:    new Date().toISOString(),
    },
    { onConflict: 'user_id,date,text_id' }
  )
  if (error) console.error('saveReadingResult error:', error.message)
}

export async function fetchReadingTexts(): Promise<ReadingText[]> {
  const { data, error } = await supabase
    .from('reading_texts')
    .select('*')

  if (error) {
    console.warn('Supabase reading_texts fetch failed, using fallback:', error.message)
    return READING_TEXTS
  }

  if (!data || data.length === 0) return READING_TEXTS

  return data.map((r) => r.data as unknown as ReadingText)
}
