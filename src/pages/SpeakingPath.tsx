// Speaking Path — "0 dan Gapirishgacha" asosiy sahifa
// Reja: docs/speaking-path-roadmap.md (Faza 1–2, 5)

import { useEffect, useState, useCallback } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { ArrowLeft, Mic, Flame, Trophy, RotateCcw, ChevronRight } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { SPEAKING_DAYS, TOTAL_SPEAKING_DAYS, getSpeakingDay, getAllChunks, type SpeakingChunk, type SpeakingDayProgress } from '../data/speakingPath'
import { getSpeakingProgress, getDueChunks, getSpeakingStats, loadSrsMap, computeTrend, computeSRSDistribution, type SpeakingStats, type TrendPoint, type SRSDistribution } from '../services/speakingPathService'
import SpeakingLadder from '../components/speakingPath/SpeakingLadder'
import SpeakingDaySession from '../components/speakingPath/SpeakingDaySession'
import SpeakingReviewSession from '../components/speakingPath/SpeakingReviewSession'
import SpeakingMetricsPanel from '../components/speakingPath/SpeakingMetricsPanel'
import SpeakingCharts from '../components/speakingPath/SpeakingCharts'
import SpeakingAchievements from '../components/speakingPath/SpeakingAchievements'
import FreePractice from '../components/speakingPath/FreePractice'
import { useStore } from '../store/useStore'

export default function SpeakingPath() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const userId = user?.id

  const [completed, setCompleted] = useState<Set<number>>(new Set())
  const [dayProgress, setDayProgress] = useState<SpeakingDayProgress[]>([])
  const [unlockedDay, setUnlockedDay] = useState(1)
  const [dueChunks, setDueChunks] = useState<SpeakingChunk[]>([])
  const [speakingStats, setSpeakingStats] = useState<SpeakingStats | null>(null)
  const [trend, setTrend] = useState<TrendPoint[]>([])
  const [srsDistribution, setSrsDistribution] = useState<SRSDistribution[]>([])
  const [expandedDay, setExpandedDay] = useState<number | null>(null)
  const [activeDay, setActiveDay] = useState<number | null>(null)
  const [reviewMode, setReviewMode] = useState(false)
  const unlockedAchievements = useStore(s => s.unlockedAchievements)
  const [loading, setLoading] = useState(true)

  // Tab: 'path' (narvon) | 'free' (erkin amaliyot). /speaking → ?tab=free redirect.
  const [searchParams, setSearchParams] = useSearchParams()
  const [tab, setTab] = useState<'path' | 'free'>(searchParams.get('tab') === 'free' ? 'free' : 'path')

  const loadProgress = useCallback(async () => {
    if (!userId) return
    // Load SRS map ONCE and share it
    const srsMap = await loadSrsMap(userId)
    const [progress, due, stats] = await Promise.all([
      getSpeakingProgress(userId),
      getDueChunks(userId, getAllChunks(), srsMap),
      getSpeakingStats(userId, getAllChunks(), srsMap),
    ])
    setCompleted(new Set(progress.filter(p => p.completed).map(p => p.day)))
    setDayProgress(progress)
    setUnlockedDay(stats.currentDay)
    setDueChunks(due)
    setSpeakingStats(stats)
    setExpandedDay(prev => prev ?? Math.min(stats.currentDay, TOTAL_SPEAKING_DAYS))

    // Compute chart data from the same SRS map
    setTrend(computeTrend(progress, 21))
    setSrsDistribution(computeSRSDistribution(srsMap))
  }, [userId])

  useEffect(() => {
    let active = true
    loadProgress().finally(() => active && setLoading(false))
    return () => { active = false }
  }, [loadProgress])

  const handleToggle = useCallback((day: number) => {
    setExpandedDay(prev => (prev === day ? null : day))
  }, [])

  const handleStart = useCallback((day: number) => {
    setActiveDay(day)
    window.scrollTo({ top: 0 })
  }, [])

  const handleExitSession = useCallback(() => {
    setActiveDay(null)
    setReviewMode(false)
    loadProgress()
  }, [loadProgress])

  // ── Takror rejimi ──
  if (reviewMode && dueChunks.length > 0) {
    return <SpeakingReviewSession chunks={dueChunks} userId={userId} onExit={handleExitSession} />
  }

  // ── Kunlik sessiya rejimi ──
  const sessionDay = activeDay != null ? getSpeakingDay(activeDay) : undefined
  if (sessionDay) {
    return <SpeakingDaySession day={sessionDay} userId={userId} onExit={handleExitSession} />
  }

  const currentDay = Math.min(unlockedDay, TOTAL_SPEAKING_DAYS)
  const completedCount = completed.size

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4 mobile-safe-bottom">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={() => navigate('/')} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0">
          <ArrowLeft size={18} />
        </button>
        <div className="min-w-0">
          <h1 className="text-lg sm:text-xl font-black text-gray-900 dark:text-gray-100 flex items-center gap-2">
            <Mic size={20} className="text-primary-600" /> Gapirish Yo'li
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400">0 dan suhbatgacha — har kuni 15 daqiqa</p>
        </div>
      </div>

      {/* Tab: Narvon | Erkin amaliyot */}
      <div className="flex gap-1 p-1 rounded-2xl bg-gray-100 dark:bg-gray-800">
        <button
          onClick={() => { setTab('path'); setSearchParams({}) }}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${tab === 'path' ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-300 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
        >
          🪜 Narvon
        </button>
        <button
          onClick={() => { setTab('free'); setSearchParams({ tab: 'free' }) }}
          className={`flex-1 py-2 rounded-xl text-sm font-bold transition-colors ${tab === 'free' ? 'bg-white dark:bg-gray-700 text-primary-600 dark:text-primary-300 shadow-sm' : 'text-gray-500 dark:text-gray-400'}`}
        >
          🎤 Erkin amaliyot
        </button>
      </div>

      {tab === 'free' ? (
        <FreePractice />
      ) : (
      <>
      {/* Statistika */}
      <div className="grid grid-cols-2 gap-3">
        <div className="rounded-2xl p-4 bg-gradient-to-br from-primary-600 to-primary-700 text-white">
          <div className="flex items-center gap-1.5 text-white/80 text-xs font-semibold"><Flame size={14} /> JORIY KUN</div>
          <p className="text-2xl font-black mt-1">{currentDay} <span className="text-base font-bold text-white/70">/ {TOTAL_SPEAKING_DAYS}</span></p>
        </div>
        <div className="rounded-2xl p-4 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
          <div className="flex items-center gap-1.5 text-gray-400 text-xs font-semibold"><Trophy size={14} /> TUGATILGAN</div>
          <p className="text-2xl font-black mt-1 text-gray-900 dark:text-gray-100">{completedCount} <span className="text-base font-bold text-gray-400">kun</span></p>
        </div>
      </div>

      {/* Takrorlash kartasi (due bloklar bo'lsa) */}
      {dueChunks.length > 0 && (
        <button
          onClick={() => { setReviewMode(true); window.scrollTo({ top: 0 }) }}
          className="w-full flex items-center gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600 active:scale-[0.98] transition-all shadow-md"
        >
          <div className="w-11 h-11 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
            <RotateCcw size={20} />
          </div>
          <div className="flex-1 min-w-0 text-left">
            <p className="font-black text-sm">Takrorlash vaqti keldi</p>
            <p className="text-white/80 text-xs">{dueChunks.length} ta ibora takrorga tayyor</p>
          </div>
          <ChevronRight size={18} className="shrink-0" />
        </button>
      )}

      {/* Batafsil statistika */}
      {speakingStats && (
        <SpeakingMetricsPanel stats={speakingStats} />
      )}

      {/* Grafiklar */}
      {speakingStats && (
        <SpeakingCharts
          trend={trend}
          srsDistribution={srsDistribution}
          avgScore7d={speakingStats.avgSpeakScore7d}
          avgStability={speakingStats.avgChunkStability}
        />
      )}

      {/* Yutuqlar */}
      {userId && (
        <SpeakingAchievements
          unlockedIds={unlockedAchievements}
          progress={{
            daysCompleted: speakingStats?.totalCompleted ?? 0,
            speakingStreak: speakingStats?.streakDays ?? 0,
            chunksMastered: speakingStats?.chunksMastered ?? 0,
            bestSpeakScore: speakingStats?.avgSpeakScore7d ?? 0,
            cefr: unlockedDay >= 64 ? 'B2' : unlockedDay >= 36 ? 'B1' : unlockedDay >= 19 ? 'A2' : unlockedDay >= 7 ? 'A1' : 'A0',
          }}
        />
      )}

      {/* Narvon */}
      {loading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-[72px] rounded-2xl bg-gray-100 dark:bg-gray-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <SpeakingLadder
          days={SPEAKING_DAYS}
          unlockedDay={unlockedDay}
          completed={completed}
          progress={dayProgress}
          expandedDay={expandedDay}
          onToggle={handleToggle}
          onStart={handleStart}
          userId={userId}
        />
      )}
      </>
      )}
    </div>
  )
}
