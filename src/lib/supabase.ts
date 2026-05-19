import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL      as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Supabase kalitlari topilmadi. .env faylidan VITE_SUPABASE_URL va VITE_SUPABASE_ANON_KEY ni tekshiring.\n' +
    '.env.example faylini .env ga copy qilib, ichidagi kalitlarni o\'zingizniki bilan almashtiring.'
  )
}

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// ─── Database types (matches Supabase schema below) ───────────────────────────

export interface DbUser {
  id:            string   // uuid (auth.users.id)
  name:          string
  email:         string
  level:         'A2+' | 'B1' | 'B1+' | 'B2'
  start_date:    string   // YYYY-MM-DD
  target_date:   string
  current_day:   number
  current_week:  number
  total_xp:      number
  streak:        number
  last_active:   string
  words_learned: number
  created_at:    string
}

export interface DbSession {
  id:               number
  user_id:          string
  date:             string
  type:             'grammar' | 'vocabulary' | 'listening' | 'writing' | 'mock-test' | 'ai-chat'
  duration_minutes: number
  xp_earned:        number
  notes?:           string
  created_at:       string
}

export interface DbVocabWord {
  id:               number
  user_id:          string
  word:             string
  translation:      string
  phonetic?:        string
  example_sentence?:string
  level:            'A2' | 'B1' | 'B2'
  category:         string
  srs_interval:     number
  srs_repetitions:  number
  srs_ease_factor:  number
  next_review_at:   string  // ISO timestamp
  mastery_level:    0 | 1 | 2 | 3 | 4 | 5
  learned_at:       string
}

export interface DbDailyProgress {
  id:                  number
  user_id:             string
  date:                string
  day:                 number
  week:                number
  total_minutes:       number
  grammar_minutes:     number
  vocab_minutes:       number
  listening_minutes:   number
  writing_minutes:     number
  xp_earned:           number
  streak:              number
  grammar_pct:         number
  vocab_pct:           number
  listening_pct:       number
  writing_pct:         number
  checklist_completed: number
}

export interface DbWriting {
  id:             number
  user_id:        string
  date:           string
  day:            number
  prompt:         string
  user_text:      string
  word_count:     number
  ai_feedback?:   string
  score?:         number
  created_at:     string
}

export interface DbMockTest {
  id:               number
  user_id:          string
  date:             string
  day:              number
  week:             number
  type:             'weekly' | 'monthly' | 'final'
  reading_score:    number
  listening_score:  number
  grammar_score:    number
  writing_score:    number
  total_score:      number
  level:            string
  feedback?:        string
  created_at:       string
}

// ─── Auth helpers ─────────────────────────────────────────────────────────────

export async function signUp(email: string, password: string, name: string) {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { name } },
  })
  return { data, error }
}

export async function signIn(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })
  return { data, error }
}

export async function signOut() {
  return supabase.auth.signOut()
}

export async function getSession() {
  const { data: { session } } = await supabase.auth.getSession()
  return session
}

// ─── User profile helpers ─────────────────────────────────────────────────────

export async function upsertUserProfile(profile: Omit<DbUser, 'created_at'>) {
  const { error } = await supabase
    .from('users')
    .upsert(profile, { onConflict: 'id' })
  return error
}

export async function getUserProfile(userId: string): Promise<DbUser | null> {
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .single()
  return data
}

// ─── Session helpers ──────────────────────────────────────────────────────────

export async function saveSession(session: Omit<DbSession, 'id' | 'created_at'>) {
  const { error } = await supabase.from('sessions').insert(session)
  return error
}

// ─── Vocabulary helpers ───────────────────────────────────────────────────────

export async function syncVocabWord(word: Omit<DbVocabWord, 'id'>) {
  const { error } = await supabase
    .from('vocabulary')
    .upsert(word, { onConflict: 'user_id,word' })
  return error
}

export async function getUserVocab(userId: string): Promise<DbVocabWord[]> {
  const { data } = await supabase
    .from('vocabulary')
    .select('*')
    .eq('user_id', userId)
    .order('word')
  return data ?? []
}

// ─── Daily progress helpers ───────────────────────────────────────────────────

export async function saveDailyProgress(progress: Omit<DbDailyProgress, 'id'>) {
  const { error } = await supabase
    .from('daily_progress')
    .upsert(progress, { onConflict: 'user_id,date' })
  return error
}

export async function getProgressRange(
  userId: string,
  from: string,
  to: string
): Promise<DbDailyProgress[]> {
  const { data } = await supabase
    .from('daily_progress')
    .select('*')
    .eq('user_id', userId)
    .gte('date', from)
    .lte('date', to)
    .order('date')
  return data ?? []
}

// ─── Writing helpers ──────────────────────────────────────────────────────────

export async function saveWriting(writing: Omit<DbWriting, 'id'>) {
  const { data, error } = await supabase
    .from('writings')
    .insert(writing)
    .select()
    .single()
  return { data, error }
}

// ─── Mock test helpers ────────────────────────────────────────────────────────

export async function saveMockTest(test: Omit<DbMockTest, 'id'>) {
  const { data, error } = await supabase
    .from('mock_tests')
    .insert(test)
    .select()
    .single()
  return { data, error }
}

export async function getUserMockTests(userId: string): Promise<DbMockTest[]> {
  const { data } = await supabase
    .from('mock_tests')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  return data ?? []
}
