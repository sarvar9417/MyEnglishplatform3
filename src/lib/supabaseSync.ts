import { monitoring } from './monitoring'

export async function syncUserField(field: string, value: unknown): Promise<void> {
  try {
    const { supabase } = await import('./supabase')
    const { data: { session } } = await supabase.auth.getSession()
    if (session?.user.id) {
      const payload: Record<string, unknown> = { [field]: value }
      // Supabase typed client requires a specific row type; dynamic field needs `as never`
      const { error } = await supabase.from('users').update(payload as never).eq('id', session.user.id)
      if (error) monitoring.captureMessage(`syncUserField ${field} error: ${error.message}`, 'warn')
    }
  } catch (e) {
    monitoring.captureMessage(`syncUserField ${field} failed: ${e instanceof Error ? e.message : String(e)}`, 'warn')
  }
}

export async function getSessionUserId(): Promise<string | null> {
  try {
    const { supabase } = await import('./supabase')
    const { data: { session } } = await supabase.auth.getSession()
    return session?.user.id ?? null
  } catch (e) {
    monitoring.captureMessage('getSessionUserId failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return null
  }
}
