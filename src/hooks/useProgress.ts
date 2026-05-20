import { useState, useEffect, useCallback } from 'react'
import { supabase } from '../db/supabase'
import type { DailyProgressRow, MockTestRow } from '../types/database'
import { getTodayTashkent } from '../utils/tashkentDate'

function today(): string {
  return getTodayTashkent()
}

interface SkillResult {
  date:     string
  score:    number
  title?:   string
}

export function useProgress() {
  const [todayProgress, setTodayProgress] = useState<DailyProgressRow | null>(null)
  const [lastMockTest,  setLastMockTest]  = useState<MockTestRow       | null>(null)
  const [dbStreak,      setDbStreak]      = useState(0)
  const [loading,       setLoading]       = useState(true)
  const [error,         setError]         = useState<string | null>(null)
  const [recentGrammar,   setRecentGrammar]   = useState<SkillResult[]>([])
  const [recentListening, setRecentListening]  = useState<SkillResult[]>([])
  const [recentReading,   setRecentReading]    = useState<SkillResult[]>([])
  const [recentSpeaking,  setRecentSpeaking]   = useState<SkillResult[]>([])
  const [recentWriting,   setRecentWriting]    = useState<SkillResult[]>([])

  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (!session) { setLoading(false); return }

      const uid = session.user.id
      const dateStr = today()

      const [
        { data: progress },
        { data: mocks },
        { data: days },
        { data: grammarRows },
        { data: listeningRows },
        { data: readingRows },
        { data: speakingRows },
        { data: writingRows },
      ] = await Promise.all([
        supabase
          .from('daily_progress')
          .select('*')
          .eq('user_id', uid)
          .eq('date', dateStr)
          .maybeSingle(),

        supabase
          .from('mock_tests')
          .select('*')
          .eq('user_id', uid)
          .order('created_at', { ascending: false })
          .limit(1),

        supabase
          .from('daily_progress')
          .select('date')
          .eq('user_id', uid)
          .gte('total_minutes', 30)
          .order('date', { ascending: false })
          .limit(120),

        supabase
          .from('grammar_progress')
          .select('date, score, topic_title')
          .eq('user_id', uid)
          .order('completed_at', { ascending: false })
          .limit(30),

        supabase
          .from('listening_progress')
          .select('date, score, lesson_title')
          .eq('user_id', uid)
          .order('completed_at', { ascending: false })
          .limit(30),

        supabase
          .from('reading_progress')
          .select('date, score, text_title')
          .eq('user_id', uid)
          .order('completed_at', { ascending: false })
          .limit(30),

        supabase
          .from('speaking_progress')
          .select('date, avg_score, prompt_text')
          .eq('user_id', uid)
          .order('completed_at', { ascending: false })
          .limit(30),

        supabase
          .from('writings')
          .select('date, score, prompt')
          .eq('user_id', uid)
          .order('created_at', { ascending: false })
          .limit(30),
      ])

      setTodayProgress(progress ?? null)
      setLastMockTest(mocks?.[0] ?? null)
      setRecentGrammar((grammarRows ?? []).map((r: any) => ({ date: r.date, score: r.score, title: r.topic_title })))
      setRecentListening((listeningRows ?? []).map((r: any) => ({ date: r.date, score: r.score, title: r.lesson_title })))
      setRecentReading((readingRows ?? []).map((r: any) => ({ date: r.date, score: r.score, title: r.text_title })))
      setRecentSpeaking((speakingRows ?? []).map((r: any) => ({ date: r.date, score: r.avg_score * 10, title: r.prompt_text?.slice(0, 60) })))
      setRecentWriting((writingRows ?? []).map((r: any) => ({ date: r.date, score: (r.score ?? 0) * 10, title: r.prompt?.slice(0, 60) })))

      // Calculate streak from consecutive days
      function prevDate(s: string): string {
        const [y, m, d] = s.split('-').map(Number)
        return new Date(Date.UTC(y, m - 1, d - 1)).toISOString().split('T')[0]
      }
      let streak = 0
      let expected = dateStr
      for (const row of (days ?? [])) {
        if (row.date === expected) {
          streak++
          expected = prevDate(expected)
        } else {
          break
        }
      }
      setDbStreak(streak)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Xato yuz berdi')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  async function upsertTodayProgress(patch: Partial<Omit<DailyProgressRow, 'id' | 'user_id' | 'date' | 'created_at'>>) {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) return

    const uid     = session.user.id
    const dateStr = today()

    const { data } = await supabase
      .from('daily_progress')
      .upsert(
        { user_id: uid, date: dateStr, ...patch, updated_at: new Date().toISOString() },
        { onConflict: 'user_id,date' }
      )
      .select()
      .maybeSingle()

    if (data) setTodayProgress(data as DailyProgressRow)
  }

  return {
    todayProgress,
    lastMockTest,
    dbStreak,
    loading,
    error,
    recentGrammar,
    recentListening,
    recentReading,
    recentSpeaking,
    recentWriting,
    refresh: fetchData,
    upsertTodayProgress,
  }
}
