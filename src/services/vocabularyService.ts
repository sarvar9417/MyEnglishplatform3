import { supabase } from '../db/supabase'
import { addDaysTashkent } from '../utils/tashkentDate'

export type WordLevel = 'A1' | 'A2' | 'B1' | 'B2'

export interface DailyWordRow {
  word_id:      number
  english:      string
  uzbek:        string
  level:        WordLevel
  box:          number
  next_review:  string
  is_learned:   boolean
  correct_count: number
  wrong_count:   number
  is_new:       boolean
  example?:    string
  phonetic?:   string
  last_rating?: string
}

export interface SessionWordResult {
  word_id:  number
  english:  string
  uzbek:    string
  level:    WordLevel
  box:      number
  result:   'correct' | 'wrong'
}

export type Rating = 'bildim' | 'qiynaldim' | 'bilmadim' | 'yodladim'

// SRS intervallar: Box 1→1kun, 2→3kun, 3→7kun, 4→14kun, 5→30kun, 6→90kun
const SRS_INTERVALS = [1, 3, 7, 14, 30, 90]
const MAX_BOX = 6

export function computeNextReview(
  box: number,
  rating: Rating
): { box: number; next_review: string; is_learned: boolean } {
  let newBox: number

  if (rating === 'yodladim') {
    newBox = Math.min(box + 2, MAX_BOX) // bir qadam o'tkazib yuborish
  } else if (rating === 'bildim') {
    newBox = Math.min(box + 1, MAX_BOX) // keyingi qadamga
  } else if (rating === 'qiynaldim') {
    newBox = Math.max(box, 1)           // shu qadamda qolish
  } else {
    newBox = 1                          // boshidan boshlash
  }

  const intervalDays = SRS_INTERVALS[newBox - 1]
  const isLearned = newBox >= MAX_BOX

  return { box: newBox, next_review: addDaysTashkent(intervalDays), is_learned: isLearned }
}

export async function upsertProgress(
  userId: string,
  wordId: number,
  box: number,
  nextReview: string,
  correctCount: number,
  wrongCount: number,
  isLearned: boolean
) {
  const { error } = await supabase.from('vocabulary_progress').upsert({
    user_id: userId,
    word_id: wordId,
    box,
    next_review: nextReview,
    correct_count: correctCount,
    wrong_count: wrongCount,
    is_learned: isLearned,
    last_reviewed: new Date().toISOString(),
  } as never, { onConflict: 'user_id,word_id' })

  if (error) console.error('upsertProgress error:', error)
}

export async function saveSession(
  userId: string,
  batchNumber: number,
  wordsJson: Record<string, Rating>,
  score: number,
  timeSpent: number,
  sessionDate?: string
) {
  // Avvalgi sessiyani o'chirish (dublikat oldini olish)
  const dateToUse = sessionDate ?? new Date().toISOString().split('T')[0]
  await supabase
    .from('vocabulary_sessions')
    .delete()
    .eq('user_id', userId)
    .eq('session_date', dateToUse)
    .eq('batch_number', batchNumber)

  const payload: Record<string, unknown> = {
    user_id: userId,
    session_date: dateToUse,
    batch_number: batchNumber,
    words_json: wordsJson,
    score,
    time_spent: timeSpent,
    completed: true,
  }

  const { error } = await supabase.from('vocabulary_sessions').insert(payload as never)

  if (error) console.error('saveSession error:', error)
}

export interface DaySession {
  session_date: string
  completed_batches: number
  total_score: number
  total_words: number
  all_completed: boolean
}

export async function fetchMonthSessions(
  userId: string,
  year: number,
  month: number
): Promise<Map<string, DaySession>> {
  const startDate = `${year}-${String(month + 1).padStart(2, '0')}-01`
  const endDateStr = month === 11
    ? `${year + 1}-01-01`
    : `${year}-${String(month + 2).padStart(2, '0')}-01`

  const { data, error } = await supabase
    .from('vocabulary_sessions')
    .select('id, session_date, batch_number, score, words_json')
    .gte('session_date', startDate)
    .lt('session_date', endDateStr)
    .eq('user_id', userId)
    .order('id', { ascending: true })

  if (error) {
    console.error('fetchMonthSessions error:', error)
    return new Map()
  }

  // Group rows by (date, batch_number), keep only the LAST row for each batch
  const byDayBatch = new Map<string, Map<number, (typeof data)['0']>>()
  for (const row of data ?? []) {
    const d = row.session_date
    if (!byDayBatch.has(d)) byDayBatch.set(d, new Map())
    const batchMap = byDayBatch.get(d)!
    if (row.batch_number != null) {
      batchMap.set(row.batch_number, row) // keeps last occurrence
    }
  }

  const result = new Map<string, DaySession>()
  for (const [d, batchMap] of byDayBatch) {
    let totalScore = 0
    let totalWords = 0
    for (const [, row] of batchMap) {
      totalScore += row.score ?? 0
      totalWords += row.words_json ? Object.keys(row.words_json as Record<string, unknown>).length : 0
    }
    const completedBatches = batchMap.size
    result.set(d, {
      session_date: d,
      completed_batches: completedBatches,
      total_score: totalScore,
      total_words: totalWords,
      all_completed: completedBatches >= 4,
    })
  }
  return result
}

export async function fetchProgressStats(userId: string) {
  const { data, error } = await supabase
    .from('vocabulary_progress')
    .select('word_id, box, is_learned, correct_count')
    .eq('user_id', userId)

  if (error) {
    console.error('fetchProgressStats error:', error)
    return []
  }
  return data ?? []
}

export interface LevelTotal {
  level: string
  total: number
}

export interface LevelLearned {
  level: string
  learned: number
}

export async function fetchLevelCounts(): Promise<LevelTotal[]> {
  const { data, error } = await supabase.rpc('get_word_counts_by_level')
  if (error) {
    console.error('fetchLevelCounts error:', error)
    return []
  }
  return (data ?? []) as LevelTotal[]
}

export async function fetchLearnedCounts(userId: string): Promise<LevelLearned[]> {
  const { data, error } = await supabase.rpc('get_learned_counts_by_level', { user_uuid: userId })
  if (error) {
    console.error('fetchLearnedCounts error:', error)
    return []
  }
  return (data ?? []) as LevelLearned[]
}
