import { supabase } from '../db/supabase'
import { LISTENING_LESSONS } from '../data/listeningLessons'
import type { ListeningLesson } from '../data/listeningLessons'

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
