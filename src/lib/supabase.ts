import { createClient } from '@supabase/supabase-js'
import type { Database } from '../types/supabase'
import type {
  DbUser, DbSession, DbVocabWord,
  DbDailyProgress, DbWriting, DbMockTest,
} from '../types/database'

const SUPABASE_URL      = import.meta.env.VITE_SUPABASE_URL      as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  throw new Error(
    'Supabase kalitlari topilmadi. .env faylidan VITE_SUPABASE_URL va VITE_SUPABASE_ANON_KEY ni tekshiring.\n' +
    '.env.example faylini .env ga copy qilib, ichidagi kalitlarni o\'zingizniki bilan almashtiring.'
  )
}

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_ANON_KEY)

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
    .upsert(profile as never, { onConflict: 'id' })
  return error
}

export async function getUserProfile(userId: string): Promise<DbUser | null> {
  const { data } = await supabase
    .from('users')
    .select('*')
    .eq('id', userId)
    .maybeSingle()
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
