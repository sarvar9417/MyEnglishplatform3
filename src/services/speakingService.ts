import { supabase } from '../db/supabase'
import { SPEAKING_PROMPTS, CATEGORY_LABEL, CATEGORY_COLOR } from '../data/speakingPrompts'
import type { SpeakingPrompt } from '../data/speakingPrompts'

export { CATEGORY_LABEL, CATEGORY_COLOR }
export type { SpeakingPrompt }

/** Save speaking evaluation result to Supabase */
export async function saveSpeakingResult(params: {
  userId:           string
  promptId:         string
  promptText:       string
  fluencyScore:     number
  grammarScore:     number
  vocabularyScore:  number
  avgScore:         number
  xpEarned:         number
  feedback:         string
}) {
  const { userId, promptId, promptText, fluencyScore, grammarScore, vocabularyScore, avgScore, xpEarned, feedback } = params
  const today = new Date().toISOString().split('T')[0]

  const { error } = await supabase.from('speaking_progress').insert({
    user_id:           userId,
    date:              today,
    prompt_id:         promptId,
    prompt_text:       promptText,
    fluency_score:     fluencyScore,
    grammar_score:     grammarScore,
    vocabulary_score:  vocabularyScore,
    avg_score:         avgScore,
    xp_earned:         xpEarned,
    feedback:          feedback?.slice(0, 2000) ?? '',
    completed_at:      new Date().toISOString(),
  })
  if (error) console.error('saveSpeakingResult error:', error.message)
}

export async function fetchSpeakingPrompts(): Promise<SpeakingPrompt[]> {
  const { data, error } = await supabase
    .from('speaking_prompts')
    .select('*')

  if (error) {
    console.warn('Supabase speaking_prompts fetch failed, using fallback:', error.message)
    return SPEAKING_PROMPTS
  }

  if (!data || data.length === 0) return SPEAKING_PROMPTS

  return data.map((r) => r.data as unknown as SpeakingPrompt)
}

export function getDailyPrompts(dayNumber: number, prompts: SpeakingPrompt[]): SpeakingPrompt[] {
  const categories = [...new Set(prompts.map((p) => p.category))]
  const count = Math.min(3, prompts.length)
  const result: SpeakingPrompt[] = []
  for (let i = 0; i < count; i++) {
    const cat = categories[i % categories.length]
    const catPrompts = prompts.filter((p) => p.category === cat)
    const idx = (dayNumber + i) % catPrompts.length
    result.push(catPrompts[idx])
  }
  return result
}
