import { supabase } from '../lib/supabase'
import { WRITING_PROMPTS, TYPE_LABEL, TYPE_COLOR } from '../data/writingPrompts'
import type { WritingPrompt } from '../data/writingPrompts'
import { todayDate, fetchContent } from './contentService'
import { useToastStore } from '../utils/toastStore'
import { monitoring } from '../lib/monitoring'

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

  const { error } = await supabase.from('writings').insert({
    user_id:     userId,
    date:        todayDate(),
    day,
    prompt,
    user_text:   essay,
    word_count:  wordCount,
    ai_feedback: feedback?.slice(0, 5000) ?? '',
    score:       avgScore,
    created_at:  new Date().toISOString(),
  })
  if (error) {
    monitoring.captureMessage('saveWritingResult error: ' + error.message, 'error')
    useToastStore.getState().toast('Writing natijasini saqlashda xatolik', 'error')
  }
}

export async function fetchWritingPrompts(): Promise<WritingPrompt[]> {
  return fetchContent<WritingPrompt>('writing_prompts', WRITING_PROMPTS)
}

export function getDailyWritingPrompt(dayNumber: number, prompts: WritingPrompt[]): WritingPrompt {
  if (prompts.length === 0) throw new Error('No writing prompts available')
  const idx = (dayNumber - 1) % prompts.length
  return prompts[idx]
}
