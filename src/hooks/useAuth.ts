import { useState, useEffect } from 'react'
import type { Session, User } from '@supabase/supabase-js'
import { supabase } from '../db/supabase'

export interface AuthState {
  session: Session | null
  user:    User    | null
  loading: boolean
}

export function useAuth() {
  const [session, setSession] = useState<Session | null>(null)
  const [user,    setUser]    = useState<User    | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  async function signUp(email: string, password: string, name: string) {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    })
    if (!error && data.user) {
      // Upsert into public.users so the trigger or RLS-protected insert lands
      await supabase.from('users').upsert(
        { id: data.user.id, email, name },
        { onConflict: 'id' }
      )
    }
    return { error }
  }

  async function signIn(email: string, password: string) {
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    return { error }
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  const displayName =
    user?.user_metadata?.name as string | undefined

  return { session, user, loading, displayName, signUp, signIn, signOut }
}
