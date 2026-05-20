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

export async function pushTestProgress(
  lessonId: string,
  _sectionTitle: string,
  correctCount: number,
  totalQuestions: number
): Promise<void> {
  const testLessonId = `${lessonId}__test`
  const pct = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0
  const date = getTodayTashkent()

  const { data: { session } } = await supabase.auth.getSession()
  if (session) {
    await supabase
      .from('lesson_progress')
      .upsert({
        user_id: session.user.id,
        date,
        lesson_id: testLessonId,
        score: pct,
        correct_count: correctCount,
        total_exercises: totalQuestions,
        xp_earned: correctCount * 10,
        completed_at: new Date().toISOString(),
      }, { onConflict: 'user_id,date,lesson_id' })
  }

  await dbUpsert({
    lessonId: testLessonId,
    date,
    score: pct,
    correctCount,
    totalExercises: totalQuestions,
    xpEarned: correctCount * 10,
    completedAt: Date.now(),
  })
}

export async function getTestProgress(lessonId: string, date?: string): Promise<number | null> {
  const testLessonId = `${lessonId}__test`
  return getLessonProgressRaw(testLessonId, date)
}

async function getLessonProgressRaw(lessonId: string, date?: string): Promise<number | null> {
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

export async function getLessonProgress(lessonId: string, date?: string): Promise<number | null> {
  return getLessonProgressRaw(lessonId, date)
}

// ─── Lesson sessions (cross-device resume) ───────────────────────────────

interface SessionPayload {
  tab: string
  currentSection: number
  testSection: number
  completedSections: Record<number, number>
  completedTestSections: Record<number, number>
}

export async function saveLessonSessionToDB(
  lessonId: string,
  data: SessionPayload
): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return

  await supabase.from('lesson_sessions').upsert({
    user_id: session.user.id,
    lesson_id: lessonId,
    tab: data.tab,
    current_section: data.currentSection,
    test_section: data.testSection,
    completed_sections: data.completedSections as never,
    completed_test_sections: data.completedTestSections as never,
    updated_at: new Date().toISOString(),
  }, { onConflict: 'user_id,lesson_id' })
}

export async function clearLessonSessionFromDB(lessonId: string): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return

  await supabase
    .from('lesson_sessions')
    .delete()
    .eq('user_id', session.user.id)
    .eq('lesson_id', lessonId)
}

export interface LoadedLessonSession {
  tab: string
  currentSection: number
  testSection: number
  completedSections: Record<number, number>
  completedTestSections: Record<number, number>
  updatedAt: number
}

export async function loadLessonSessionFromDB(lessonId: string): Promise<LoadedLessonSession | null> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return null

  const { data } = await supabase
    .from('lesson_sessions')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('lesson_id', lessonId)
    .maybeSingle()

  if (!data) return null

  return {
    tab: data.tab as string,
    currentSection: data.current_section as number,
    testSection: data.test_section as number,
    completedSections: data.completed_sections as Record<number, number>,
    completedTestSections: data.completed_test_sections as Record<number, number>,
    updatedAt: new Date(data.updated_at as string).getTime(),
  }
}

// ─── Exercise answers (per-exercise granularity) ─────────────────────────

export interface ExerciseAnswerPayload {
  exerciseId: number
  exerciseType: string
  answer: string[]
  isCorrect: boolean
}

export async function saveExerciseAnswersToDB(
  lessonId: string,
  sectionIndex: number,
  sectionType: 'exercise' | 'test' | 'drill',
  answers: ExerciseAnswerPayload[]
): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return

  const rows = answers.map(a => ({
    user_id: session.user.id,
    lesson_id: lessonId,
    section_index: sectionIndex,
    exercise_id: a.exerciseId,
    exercise_type: a.exerciseType,
    section_type: sectionType,
    answer: JSON.stringify(a.answer),
    is_correct: a.isCorrect,
    submitted_at: new Date().toISOString(),
  }))

  if (rows.length === 0) return

  await supabase.from('lesson_exercise_answers').upsert(
    rows as never,
    { onConflict: 'user_id,lesson_id,exercise_id,section_type', ignoreDuplicates: false }
  )
}

export interface LoadedExerciseAnswer {
  exerciseId: number
  exerciseType: string
  answer: string[]
  isCorrect: boolean
  sectionIndex: number
  sectionType: string
}

export async function loadExerciseAnswersFromDB(lessonId: string): Promise<LoadedExerciseAnswer[]> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return []

  const { data } = await supabase
    .from('lesson_exercise_answers')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('lesson_id', lessonId)
    .order('exercise_id', { ascending: true })

  if (!data) return []

  return (data as any[]).map(d => ({
    exerciseId: d.exercise_id,
    exerciseType: d.exercise_type,
    answer: typeof d.answer === 'string' ? JSON.parse(d.answer) : d.answer,
    isCorrect: d.is_correct,
    sectionIndex: d.section_index,
    sectionType: d.section_type,
  }))
}

// ─── Lesson vocab progress ───────────────────────────────────────────────

export interface VocabProgressPayload {
  wordIndex: number
  known: boolean
  quizCorrect: number
  quizWrong: number
}

export async function saveLessonVocabProgressToDB(
  lessonId: string,
  items: VocabProgressPayload[]
): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return

  for (const item of items) {
    await supabase.from('lesson_vocab_progress').upsert({
      user_id: session.user.id,
      lesson_id: lessonId,
      word_index: item.wordIndex,
      known: item.known,
      quiz_correct: item.quizCorrect,
      quiz_wrong: item.quizWrong,
      updated_at: new Date().toISOString(),
    } as never, { onConflict: 'user_id,lesson_id,word_index' })
  }
}

export interface LoadedVocabProgress {
  wordIndex: number
  known: boolean
  quizCorrect: number
  quizWrong: number
}

export async function loadLessonVocabProgressFromDB(lessonId: string): Promise<LoadedVocabProgress[]> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return []

  const { data } = await supabase
    .from('lesson_vocab_progress')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('lesson_id', lessonId)
    .order('word_index', { ascending: true })

  if (!data) return []

  return (data as any[]).map(d => ({
    wordIndex: d.word_index,
    known: d.known,
    quizCorrect: d.quiz_correct,
    quizWrong: d.quiz_wrong,
  }))
}

// ─── Viewed tabs ─────────────────────────────────────────────────────────

export async function saveViewedTabsToDB(
  lessonId: string,
  viewedTabs: string[]
): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return

  await supabase.from('lesson_viewed_tabs').upsert({
    user_id: session.user.id,
    lesson_id: lessonId,
    viewed_tabs: JSON.stringify(viewedTabs),
    updated_at: new Date().toISOString(),
  } as never, { onConflict: 'user_id,lesson_id' })
}

export async function loadViewedTabsFromDB(lessonId: string): Promise<string[]> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) return []

  const { data } = await supabase
    .from('lesson_viewed_tabs')
    .select('viewed_tabs')
    .eq('user_id', session.user.id)
    .eq('lesson_id', lessonId)
    .maybeSingle()

  if (!data) return []

  const tabs = typeof data.viewed_tabs === 'string' ? JSON.parse(data.viewed_tabs) : data.viewed_tabs
  return Array.isArray(tabs) ? tabs : []
}
