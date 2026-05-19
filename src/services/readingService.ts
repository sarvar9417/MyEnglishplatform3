import { supabase } from '../db/supabase'
import { READING_TEXTS } from '../data/readingTexts'
import type { ReadingText } from '../data/readingTexts'

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
