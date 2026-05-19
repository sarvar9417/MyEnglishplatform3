import { supabase } from '../db/supabase'
import { GRAMMAR_TOPICS } from '../data/grammarTopics'
import type { GrammarTopic } from '../data/grammarTopics'

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
