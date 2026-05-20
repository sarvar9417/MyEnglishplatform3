import { supabase } from '../db/supabase'
import { upsertLessonProgress as dbUpsert, getLessonProgress as dbGet } from '../db/database'
import { getTodayTashkent } from '../utils/tashkentDate'
import type { DailyLesson, SpecialCase } from '../data/dailyLessons'
import { DAILY_LESSONS } from '../data/dailyLessons'

interface LessonRow {
  id: string
  title: string
  subtitle: string
  level: string
  day: number
  data: {
    formulas: { label: string; structure: string; color: string }[]
    rules: string[]
    vocabulary: { en: string; uz: string; example: string; rule: string }[]
    examples: { en: string; uz: string }[]
    specialCases: SpecialCase[]
    exercises: import('../data/dailyLessons').DailyExercise[]
    exerciseSections: { title: string; desc: string; color: string; icon: string; ids: number[] }[]
    tests: import('../data/dailyLessons').DailyExercise[]
    testSections: { title: string; desc: string; color: string; icon: string; ids: number[] }[]
  }
}

function castLesson(row: LessonRow): DailyLesson {
  return {
    id: row.id,
    title: row.title,
    subtitle: row.subtitle,
    level: row.level,
    day: row.day,
    formulas: row.data.formulas ?? [],
    rules: row.data.rules ?? [],
    vocabulary: row.data.vocabulary ?? [],
    examples: row.data.examples ?? [],
    specialCases: row.data.specialCases ?? [],
    exercises: row.data.exercises ?? [],
    exerciseSections: row.data.exerciseSections ?? [],
    tests: row.data.tests ?? [],
    testSections: row.data.testSections ?? [],
  }
}

export async function fetchLessons(): Promise<DailyLesson[]> {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .order('day', { ascending: true })

  if (error) {
    console.warn('Supabase lessons fetch failed, using local fallback:', error.message)
    return DAILY_LESSONS
  }

  if (!data || data.length === 0) {
    console.warn('No lessons found in Supabase, using local fallback')
    return DAILY_LESSONS
  }

  const supabaseLessons = (data as unknown as LessonRow[]).map(castLesson)
  const supabaseIds = new Set(supabaseLessons.map(l => l.id))
  const localExtraLessons = DAILY_LESSONS.filter(l => !supabaseIds.has(l.id))
  
  if (localExtraLessons.length > 0) {
    console.warn(`Adding ${localExtraLessons.length} local lessons not found in Supabase`)
    return [...supabaseLessons, ...localExtraLessons]
  }

  return supabaseLessons
}

export async function fetchLesson(id: string): Promise<DailyLesson | null> {
  const { data, error } = await supabase
    .from('lessons')
    .select('*')
    .eq('id', id)
    .maybeSingle()

  if (error || !data) {
    console.warn('Supabase lesson fetch failed, searching local lessons:', error?.message)
    // Search in local DAILY_LESSONS array
    return DAILY_LESSONS.find(l => l.id === id) || null
  }

  return castLesson(data as unknown as LessonRow)
}

export async function pushLessonProgress(
  lessonId: string,
  correctCount: number,
  totalExercises: number
): Promise<void> {
  const pct = totalExercises > 0 ? Math.round((correctCount / totalExercises) * 100) : 0
  const date = getTodayTashkent()

  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    await supabase
      .from('lesson_progress')
      .upsert({
        user_id: session.user.id,
        date,
        lesson_id: lessonId,
        score: pct,
        correct_count: correctCount,
        total_exercises: totalExercises,
        xp_earned: correctCount * 10,
        completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id,date,lesson_id' })
  }

  await dbUpsert({
    lessonId,
    date,
    score: pct,
    correctCount,
    totalExercises,
    xpEarned: correctCount * 10,
    completedAt: Date.now(),
  })
}

export async function getLessonProgress(lessonId: string, date?: string): Promise<number | null> {
  const d = date ?? getTodayTashkent()

  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    const { data } = await supabase
      .from('lesson_progress')
      .select('score')
      .eq('user_id', session.user.id)
      .eq('date', d)
      .eq('lesson_id', lessonId)
      .maybeSingle()

    if (data) return data.score
  }

  const local = await dbGet(lessonId, d)
  return local?.score ?? null
}
