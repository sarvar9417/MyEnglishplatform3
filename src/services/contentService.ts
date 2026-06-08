import { supabase } from '../lib/supabase'
import { useToastStore } from '../utils/toastStore'
import { monitoring } from '../lib/monitoring'

export async function requireSession(): Promise<string> {
  const { data: { session } } = await supabase.auth.getSession()
  if (!session?.user?.id) throw new Error('auth required')
  return session.user.id
}

export function todayDate(): string {
  return new Date().toISOString().split('T')[0]
}

export async function fetchContent<T>(
  table: string,
  fallback: T[],
  order?: string,
): Promise<T[]> {
  let query = supabase.from(table as never).select('data' as never)
  if (order) query = query.order(order)
  const { data, error } = await query
  if (error) {
    monitoring.captureMessage(`${table} fetch error: ${error.message}`, 'warn')
    return fallback
  }
  if (!data || data.length === 0) return fallback
  if (!Array.isArray(data)) return []
  return (data as unknown as { data: T }[]).map(row => row.data)
}

export async function saveScore(
  table: string,
  conflictCols: string[],
  payload: Record<string, unknown>,
): Promise<void> {
  const { error } = await supabase
    .from(table as never)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .upsert(payload as any, { onConflict: conflictCols.join(',') })
  if (error) {
    monitoring.captureMessage(`${table} upsert error: ${error.message}`, 'error')
    useToastStore.getState().toast(`Natijani saqlashda xatolik: ${error.message}`, 'error')
  }
}
