import { supabase } from '../lib/supabase'
import type { DailyLesson } from '../data/dailyLessons'

interface DbLessonRow {
  id: string
  title: string
  subtitle: string
  level: string
  day: number
  category: string | null
  data: Record<string, unknown>
}

async function fetchFromSupabase(): Promise<DailyLesson[]> {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .order('day', { ascending: true })

  if (error) throw error
  if (!data) return []

  return (data as DbLessonRow[]).map((row) => ({
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    level: row.level,
    day: row.day,
    category: row.category ?? undefined,
    formulas: (row.data.formulas ?? []) as DailyLesson['formulas'],
    rules: (row.data.rules ?? []) as DailyLesson['rules'],
    vocabulary: (row.data.vocabulary ?? []) as DailyLesson['vocabulary'],
    examples: (row.data.examples ?? []) as DailyLesson['examples'],
    specialCases: (row.data.specialCases ?? []) as DailyLesson['specialCases'],
    exercises: (row.data.exercises ?? []) as DailyLesson['exercises'],
    exerciseSections: (row.data.exerciseSections ?? []) as DailyLesson['exerciseSections'],
    tests: (row.data.tests ?? []) as DailyLesson['tests'],
    testSections: (row.data.testSections ?? []) as DailyLesson['testSections'],
    ...(row.data.reading ? { reading: row.data.reading as DailyLesson['reading'] } : {}),
    ...(row.data.writing ? { writing: row.data.writing as DailyLesson['writing'] } : {}),
    ...(row.data.listening ? { listening: row.data.listening as DailyLesson['listening'] } : {}),
    ...(row.data.dialogues ? { dialogues: row.data.dialogues as DailyLesson['dialogues'] } : {}),
    ...(row.data.culturalNotes ? { culturalNotes: row.data.culturalNotes as DailyLesson['culturalNotes'] } : {}),
    ...(row.data.speaking ? { speaking: row.data.speaking as DailyLesson['speaking'] } : {}),
    ...(row.data.image ? { image: row.data.image as string } : {}),
  })) as DailyLesson[]
}

let cachedLessons: DailyLesson[] | null = null

export async function loadLessonsFromDb(): Promise<DailyLesson[]> {
  if (cachedLessons) return cachedLessons

  try {
    cachedLessons = await fetchFromSupabase()
    return cachedLessons
  } catch {
    const { loadAllLessons } = await import('../data/dailyLessons')
    const all = await loadAllLessons()
    cachedLessons = all.filter((l): l is DailyLesson => !('type' in l && l.type === 'review'))
    return cachedLessons
  }
}

export function clearLessonCache(): void {
  cachedLessons = null
}
