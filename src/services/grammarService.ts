import { supabase } from '../db/supabase'
import { GRAMMAR_TOPICS } from '../data/grammarTopics'
import type { GrammarTopic } from '../data/grammarTopics'

/** Save grammar exercise result to Supabase */
export async function saveGrammarResult(params: {
  userId:       string
  topicId:      string
  topicTitle:   string
  correctCount: number
  total:        number
  xpEarned:     number
}) {
  const { userId, topicId, topicTitle, correctCount, total, xpEarned } = params
  const score = total > 0 ? Math.round((correctCount / total) * 100) : 0
  const today = new Date().toISOString().split('T')[0]

  const { error } = await supabase.from('grammar_progress').upsert(
    {
      user_id:        userId,
      date:           today,
      topic_id:       topicId,
      topic_title:    topicTitle,
      score,
      correct_count:  correctCount,
      total_exercises: total,
      xp_earned:      xpEarned,
      completed_at:   new Date().toISOString(),
    },
    { onConflict: 'user_id,date,topic_id' }
  )
  if (error) console.error('saveGrammarResult error:', error.message)
}

export async function fetchGrammarTopics(): Promise<GrammarTopic[]> {
  const { data, error } = await supabase
    .from('grammar_topics')
    .select('*')
    .order('order_index', { ascending: true })

  if (error) {
    console.warn('Supabase grammar_topics fetch failed, using fallback:', error.message)
    return GRAMMAR_TOPICS
  }

  if (!data || data.length === 0) return GRAMMAR_TOPICS

  return data.map((r) => r.data as unknown as GrammarTopic)
}
