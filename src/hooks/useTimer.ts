import { useEffect, useRef, useState, useCallback } from 'react'
import { useStore } from '../store/useStore'
import { supabase } from '../db/supabase'
import { getTodayTashkent } from '../utils/tashkentDate'

export type TimerMode = 'pomodoro' | 'short-break' | 'long-break' | 'stopwatch'

export interface TimerState {
  mode: TimerMode
  secondsLeft: number
  totalSeconds: number
  isRunning: boolean
  pomodoroCount: number
  elapsedSeconds: number
}

const MODE_DURATIONS: Record<TimerMode, number> = {
  'pomodoro':    25 * 60,
  'short-break': 5 * 60,
  'long-break':  15 * 60,
  'stopwatch':   0,
}

export function useTimer() {
  const [mode, setMode] = useState<TimerMode>('pomodoro')
  const [secondsLeft, setSecondsLeft] = useState(MODE_DURATIONS['pomodoro'])
  const [isRunning, setIsRunning] = useState(false)
  const [pomodoroCount, setPomodoroCount] = useState(0)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)

  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const store = useStore()
  const { setTodayMinutes, addXP, incrementStreak } = store

  // Refs to avoid stale closures
  const todayMinutesRef = useRef(store.todayMinutes)
  todayMinutesRef.current = store.todayMinutes
  const pomodoroCountRef = useRef(pomodoroCount)
  pomodoroCountRef.current = pomodoroCount

  const totalSeconds = mode === 'stopwatch' ? elapsedSeconds : MODE_DURATIONS[mode]

  const clearTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }, [])

  const handlePomodoroComplete = useCallback(() => {
    const completed = pomodoroCountRef.current + 1
    setPomodoroCount(completed)
    addXP(50)
    incrementStreak()

    // Har 4 pomodorodan keyin uzun tanaffus
    const nextMode: TimerMode = completed % 4 === 0 ? 'long-break' : 'short-break'
    setMode(nextMode)
    setSecondsLeft(MODE_DURATIONS[nextMode])
    setIsRunning(false)

    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification('Pomodoro tugadi! 🍅', {
        body: completed % 4 === 0 ? '15 daqiqa uzun tanaffus vaqti!' : '5 daqiqa dam oling.',
        icon: '/favicon.svg',
      })
    }
  }, [addXP, incrementStreak])

  // Asosiy tick
  useEffect(() => {
    if (!isRunning) return

    intervalRef.current = setInterval(() => {
      if (mode === 'stopwatch') {
        setElapsedSeconds((s) => s + 1)
        setTodayMinutes(Math.floor((todayMinutesRef.current * 60 + 1) / 60))
      } else {
        setSecondsLeft((s) => {
          if (s <= 1) {
            clearTimer()
            setIsRunning(false)
            if (mode === 'pomodoro') {
              handlePomodoroComplete()
            }
            return 0
          }
          return s - 1
        })
      }
    }, 1000)

    return clearTimer
  }, [isRunning, mode, clearTimer, handlePomodoroComplete, setTodayMinutes])

  // Vaqt o'tganda kunlik daqiqalarni yangilash + Supabase upsert
  useEffect(() => {
    if (!isRunning) return
    const id = setInterval(async () => {
      const newMinutes = todayMinutesRef.current + 1
      setTodayMinutes(newMinutes)

      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return
        await supabase.from('daily_progress').upsert(
          {
            user_id:       session.user.id,
            date:          getTodayTashkent(),
            total_minutes: newMinutes,
          },
          { onConflict: 'user_id,date' }
        )
      } catch { /* ignore network errors */ }
    }, 60_000)
    return () => clearInterval(id)
  }, [isRunning, setTodayMinutes])

  const start = useCallback(() => {
    if (mode === 'pomodoro' && 'Notification' in window) {
      Notification.requestPermission()
    }
    setIsRunning(true)
  }, [mode])

  const pause = useCallback(() => setIsRunning(false), [])

  const reset = useCallback(() => {
    clearTimer()
    setIsRunning(false)
    if (mode === 'stopwatch') {
      setElapsedSeconds(0)
    } else {
      setSecondsLeft(MODE_DURATIONS[mode])
    }
  }, [clearTimer, mode])

  const switchMode = useCallback((newMode: TimerMode) => {
    clearTimer()
    setIsRunning(false)
    setMode(newMode)
    setSecondsLeft(MODE_DURATIONS[newMode])
    if (newMode === 'stopwatch') setElapsedSeconds(0)
  }, [clearTimer])

  const formatTime = useCallback((secs: number): string => {
    const h = Math.floor(secs / 3600)
    const m = Math.floor((secs % 3600) / 60)
    const s = secs % 60
    if (h > 0) {
      return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
    }
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }, [])

  const progress = mode === 'stopwatch'
    ? 0
    : 1 - secondsLeft / MODE_DURATIONS[mode]

  return {
    mode,
    secondsLeft,
    totalSeconds,
    isRunning,
    pomodoroCount,
    elapsedSeconds,
    progress,
    start,
    pause,
    reset,
    switchMode,
    formatTime,
    displayTime: mode === 'stopwatch'
      ? formatTime(elapsedSeconds)
      : formatTime(secondsLeft),
  }
}
