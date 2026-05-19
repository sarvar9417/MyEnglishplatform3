import { supabase } from '../db/supabase'
import { WRITING_PROMPTS, TYPE_LABEL, TYPE_COLOR } from '../data/writingPrompts'
import type { WritingPrompt } from '../data/writingPrompts'

export { TYPE_LABEL, TYPE_COLOR }
export type { WritingPrompt }

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
