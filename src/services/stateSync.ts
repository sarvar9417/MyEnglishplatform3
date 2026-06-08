import { supabase } from '../lib/supabase'
import { getTodayTashkent } from '../utils/tashkentDate'
import type { Json } from '../types/supabase'

type PersistedState = Record<string, unknown>

export async function syncUserState(state: PersistedState): Promise<void> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user.id) return
  await supabase.from('users').update({ state: state as Json }).eq('id', session.user.id)
}

export async function loadUserState(): Promise<PersistedState | null> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user.id) return null
  const { data } = await supabase
    .from('users')
    .select('state')
    .eq('id', session.user.id)
    .maybeSingle()
  return (data?.state as unknown as PersistedState) ?? null
}

export async function loadTodayProgress() {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user.id) return null
  const today = getTodayTashkent()
  const { data } = await supabase
    .from('daily_progress')
    .select('*')
    .eq('user_id', session.user.id)
    .eq('date', today)
    .maybeSingle()
  return data
}
