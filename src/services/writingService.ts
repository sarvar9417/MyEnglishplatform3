import { supabase } from '../db/supabase'
import { WRITING_PROMPTS, TYPE_LABEL, TYPE_COLOR } from '../data/writingPrompts'
import type { WritingPrompt } from '../data/writingPrompts'

export { TYPE_LABEL, TYPE_COLOR }
export type { WritingPrompt }

/** Save writing evaluation result to Supabase */
export async function saveWritingResult(params: {
  userId:     string
  day:        number
  prompt:     string
  essay:      string
  wordCount:  number
  feedback:   string
  avgScore:   number
  xpEarned:   number
}) {
  const { userId, day, prompt, essay, wordCount, feedback, avgScore } = params
  const today = new Date().toISOString().split('T')[0]

  const { error } = await supabase.from('writings').insert({
    user_id:     userId,
    date:        today,
    day,
    prompt,
    user_text:   essay,
    word_count:  wordCount,
    ai_feedback: feedback?.slice(0, 5000) ?? '',
    score:       avgScore,
    created_at:  new Date().toISOString(),
  })
  if (error) console.error('saveWritingResult error:', error.message)
}

export async function fetchWritingPrompts(): Promise<WritingPrompt[]> {
  const { data, error } = await supabase
    .from('writing_prompts')
    .select('*')

  if (error) {
    console.warn('Supabase writing_prompts fetch failed, using fallback:', error.message)
    return WRITING_PROMPTS
  }

  if (!data || data.length === 0) return WRITING_PROMPTS

  return data.map((r) => r.data as unknown as WritingPrompt)
}

export function getDailyWritingPrompt(dayNumber: number, prompts: WritingPrompt[]): WritingPrompt {
  const idx = (dayNumber - 1) % prompts.length
  return prompts[idx]
}
