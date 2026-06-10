import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useAuth } from '../hooks/useAuth'
import { supabase } from '../lib/supabase'
import type { Level } from '../store/types'
import {
  User, Mail, Medal, Target, Calendar,
  Flame, Trophy, LogOut, Save, CheckCircle,
  ChevronRight, BarChart2, Award, TrendingUp,
  Lock, Sparkles, ChevronDown, Users,
  Zap, BookCopy, Crown, Loader2, Search,
  Bot, MessageCircle, Swords, GraduationCap,
} from 'lucide-react'
import NotificationSettings from '../components/notifications/NotificationSettings'
import GameFeelSettings from '../components/ui/GameFeelSettings'
import { ACHIEVEMENTS, CATEGORY_INFO, type AchievementCategory } from '../data/achievements'
import { AvatarSelector, AVATARS } from '../components/ui/AvatarSelector'
import { Certificate } from '../components/ui/Certificate'
import ErrorState from '../components/ui/ErrorState'
import AIBuddyChatModal from '../components/study/AIBuddyChatModal'
import { monitoring } from '../lib/monitoring'
import ProfileBadges from '../components/profile/ProfileBadge'
import { getClaimedRewardIds, claimPendingRewards } from '../services/rewardService'
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine,
} from 'recharts'

// ── Types ─────────────────────────────────────────────────────────────────────

type ProfileTab = 'info' | 'progress' | 'achievements' | 'leaders'

interface DayData {
  date:         string
  label:        string
  day:          number
  hours:        number
  xp:           number
  grammarPct:   number
  vocabPct:     number
  listeningPct: number
  writingPct:   number
  speakingPct:  number
  readingPct:   number
  cumulativeXP: number
  newWords:     number
  totalWords:   number
  mockScore:    number
  hasReal:      boolean
}

interface SkillSummary {
  date:  string
  score: number
}

interface DailyRow {
  date: string
  xp_earned?: number
  total_minutes?: number
  grammar_pct?: number
  vocab_pct?: number
  listening_pct?: number
  reading_pct?: number
  writing_pct?: number
  words_learned?: number
}

interface LeaderRow {
  id:               string
  name:             string | null
  total_xp:         number
  streak:           number
  words_learned:    number
}

type SortBy = 'xp' | 'streak' | 'words'

// ── Constants ─────────────────────────────────────────────────────────────────

const LEVELS: { value: Level; label: string; desc: string; color: string }[] = [
  { value: 'A2+', label: 'A2+', desc: 'Boshlang\'ich',    color: 'bg-gray-100 text-gray-600 border-gray-200' },
  { value: 'B1',  label: 'B1',  desc: 'O\'rta',            color: 'bg-b1-100 text-b1-700 border-b1-200' },
  { value: 'B1+', label: 'B1+', desc: 'O\'rta yuqori',     color: 'bg-b1-100 text-b1-800 border-b1-200' },
  { value: 'B2',  label: 'B2',  desc: 'Yuqori (maqsad)',   color: 'bg-b2-100 text-b2-700 border-b2-200' },
]

const PROFILE_TABS: { id: ProfileTab; label: string; emoji: string }[] = [
  { id: 'info',         label: 'Profil',    emoji: '👤' },
  { id: 'progress',     label: 'Progress',  emoji: '📊' },
  { id: 'achievements', label: 'Nishonlar', emoji: '🏆' },
  { id: 'leaders',      label: 'Reyting',   emoji: '🏅' },
]

const CATEGORIES: AchievementCategory[] = ['day', 'xp', 'streak', 'words', 'games', 'mocktest']

const LEADER_TABS: { key: SortBy; label: string; Icon: typeof Trophy; color: string; bg: string }[] = [
  { key: 'xp',     label: 'XP Reyting',     Icon: Zap,      color: 'text-yellow-600', bg: 'bg-yellow-50' },
  { key: 'streak', label: 'Streak',          Icon: Flame,    color: 'text-orange-600', bg: 'bg-orange-50' },
  { key: 'words',  label: "So'zlar",         Icon: BookCopy, color: 'text-b1-600',    bg: 'bg-b1-50' },
]

// ── Progress Helpers ──────────────────────────────────────────────────────────

function addDays(dateStr: string, n: number) {
  const d = new Date(dateStr + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().split('T')[0]
}

function buildTimeline(
  startDate: string,
  currentDay: number,
  dbRows: DailyRow[],
  mockTests: { date: string; total_score: number }[],
  skillMap: Record<string, SkillSummary[]>,
): DayData[] {
  const rowMap = new Map<string, DailyRow>()
  dbRows.forEach((r) => rowMap.set(r.date, r))
  const testMap = new Map<string, number>()
  mockTests.forEach((t) => testMap.set(t.date, t.total_score))

  const days: DayData[] = []
  let cumXP = 0
  let cumWords = 0

  for (let d = 1; d <= Math.min(currentDay, 90); d++) {
    const date = addDays(startDate, d - 1)
    const real = rowMap.get(date)

    const g = skillMap.grammar?.filter((s) => s.date === date)
    const l = skillMap.listening?.filter((s) => s.date === date)
    const r = skillMap.reading?.filter((s) => s.date === date)
    const s = skillMap.speaking?.filter((s) => s.date === date)
    const w = skillMap.writing?.filter((s) => s.date === date)

    const avg = (arr: SkillSummary[] | undefined): number =>
      arr && arr.length > 0 ? Math.round(arr.reduce((a, b) => a + b.score, 0) / arr.length) : 0

    const hours    = real ? (real.total_minutes ?? 0) / 60 : 0
    const xp       = real ? (real.xp_earned ?? 0) : 0
    const newWords = real ? (real.words_learned ?? 0) : 0
    cumXP    += xp
    cumWords += newWords

    days.push({
      date,
      label:        d % 7 === 1 || d <= 5 ? `K${d}` : '',
      day:          d,
      hours:        parseFloat(hours.toFixed(1)),
      xp,
      grammarPct:   real?.grammar_pct ?? avg(g),
      vocabPct:     real?.vocab_pct ?? 0,
      listeningPct: real?.listening_pct ?? avg(l),
      writingPct:   real?.writing_pct ?? avg(w),
      speakingPct:  avg(s),
      readingPct:   avg(r),
      cumulativeXP: cumXP,
      newWords,
      totalWords:   cumWords,
      mockScore:    testMap.get(date) ?? 0,
      hasReal:      !!real,
    })
  }
  return days
}

function heatColor(hours: number) {
  if (hours === 0)  return 'bg-gray-100 dark:bg-gray-800'
  if (hours < 4)    return 'bg-green-200 dark:bg-green-900/40'
  if (hours < 8)    return 'bg-green-300 dark:bg-green-800/50'
  if (hours < 11)   return 'bg-green-400 dark:bg-green-700/60'
  if (hours < 14)   return 'bg-green-600 dark:bg-green-600/70'
  return 'bg-green-800 dark:bg-green-500/80'
}

// ── Progress Sub-Components ────────────────────────────────────────────────────

function StreakCalendar({ days }: { days: DayData[] }) {
  const weeks: DayData[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }
  const dayLabels = ['Dt', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1 min-w-0">
        <div className="flex flex-col gap-1 mr-1">
          <div className="h-4" />
          {dayLabels.map((lbl) => (
            <div key={lbl} className="h-3 flex items-center">
              <span className="text-[11px] text-gray-400 w-4">{lbl}</span>
            </div>
          ))}
        </div>
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            <span className="text-[11px] text-gray-400 h-4 flex items-center">
              {wi % 2 === 0 ? `${wi + 1}h` : ''}
            </span>
            {[0, 1, 2, 3, 4, 5, 6].map((di) => {
              const d = week[di]
              return d ? (
                <div
                  key={di}
                  className={`w-3 h-3 rounded-sm cursor-default ${heatColor(d.hours)}`}
                  title={`${d.date}: ${d.hours}h, ${d.xp} XP`}
                />
              ) : (
                <div key={di} className="w-3 h-3 rounded-sm bg-gray-50" />
              )
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-3">
        <span className="text-[11px] text-gray-400">Kam</span>
        {['bg-gray-100', 'bg-green-200', 'bg-green-400', 'bg-green-600', 'bg-green-800'].map((cls) => (
          <div key={cls} className={`w-3 h-3 rounded-sm ${cls}`} />
        ))}
        <span className="text-[11px] text-gray-400">Ko'p (14h+)</span>
      </div>
    </div>
  )
}

function ChartCard({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="card">
      <div className="mb-3">
        <p className="font-semibold text-gray-800 text-sm">{title}</p>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      {children}
    </div>
  )
}

function HoursTip({ active, payload, label }: { active?: boolean; payload?: { value: number }[]; label?: string }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 shadow-card rounded-xl px-3 py-2 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      <p className="text-primary-600">{payload[0]?.value} soat</p>
    </div>
  )
}

// ── Achievements Sub-Components ───────────────────────────────────────────────

function CategoryIcon({ cat }: { cat: AchievementCategory }) {
  const info = CATEGORY_INFO[cat]
  return <span className="text-lg">{info.icon}</span>
}

function AchievementCard({
  achievement,
  unlocked,
  isNew,
  unlockCount,
  totalUsers,
}: {
  achievement: typeof ACHIEVEMENTS[number]
  unlocked: boolean
  isNew: boolean
  unlockCount: number
  totalUsers: number
}) {
  const [animate, setAnimate] = useState(false)

  useEffect(() => {
    if (isNew) {
      const t = setTimeout(() => setAnimate(true), 100)
      return () => clearTimeout(t)
    }
  }, [isNew])

  return (
    <div
      className={`relative rounded-xl border-2 p-4 transition-all duration-500 ${
        unlocked
          ? isNew
            ? 'border-yellow-300 bg-gradient-to-br from-yellow-50 to-amber-50 shadow-lg shadow-yellow-200/50 scale-[1.02]'
            : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
          : 'border-gray-100 bg-gray-50/50 opacity-60'
      } ${animate ? 'scale-100' : ''}`}
    >
      {isNew && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="relative">
            <Sparkles size={28} className="text-yellow-500 animate-pulse" />
            <span className="absolute inset-0 flex items-center justify-center text-[8px] font-bold text-white">
              NEW
            </span>
          </div>
        </div>
      )}

      <div className="flex items-start gap-3">
        <div
          className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0 ${
            unlocked
              ? 'bg-gradient-to-br from-yellow-100 to-amber-100 shadow-sm'
              : 'bg-gray-100'
          }`}
        >
          {unlocked ? achievement.icon : <Lock size={18} className="text-gray-300" />}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <h3 className={`font-bold text-sm ${unlocked ? 'text-gray-900' : 'text-gray-500'}`}>
              {achievement.title}
            </h3>
            {unlocked && (
              <Award size={14} className="text-yellow-500 flex-shrink-0" />
            )}
          </div>
          <p className={`text-xs mt-0.5 ${unlocked ? 'text-gray-600' : 'text-gray-400'}`}>
            {achievement.description}
          </p>

          {unlockCount > 0 && (
            <div className="flex items-center gap-1 mt-2">
              <Users size={11} className="text-gray-400" />
              <span className="text-[11px] text-gray-400">
                {unlockCount} / {totalUsers} foydalanuvchi
              </span>
              <div className="flex-1 max-w-[60px] ml-1">
                <div className="h-1 bg-gray-100 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      unlockCount / totalUsers < 0.3
                        ? 'bg-yellow-500'
                        : unlockCount / totalUsers < 0.6
                        ? 'bg-green-400'
                        : 'bg-b1-500'
                    }`}
                    style={{ width: `${(unlockCount / totalUsers) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

// ── Leaders Sub-Components ────────────────────────────────────────────────────

function getField(row: LeaderRow, sort: SortBy): number {
  if (sort === 'xp')     return row.total_xp
  if (sort === 'streak') return row.streak
  return row.words_learned
}

function formatValue(val: number, sort: SortBy): string {
  if (sort === 'xp')     return `${val.toLocaleString()} XP`
  if (sort === 'streak') return `${val} kun`
  return `${val.toLocaleString()} ta`
}

function rankIcon(index: number) {
  if (index === 0) return <Crown size={16} className="text-yellow-500" />
  if (index === 1) return <Medal size={16} className="text-gray-400" />
  if (index === 2) return <Medal size={16} className="text-amber-600" />
  return null
}

function LeaderRow({
  row, index, sort, isMe, achievementCount,
}: {
  row:   LeaderRow
  index: number
  sort:  SortBy
  isMe:  boolean
  achievementCount: number
}) {
  const value   = getField(row, sort)
  const icon    = rankIcon(index)
  const initial = (row.name ?? 'Foydalanuvchi').charAt(0).toUpperCase()

  return (
    <div
      className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all
        ${isMe
          ? 'bg-primary-50 dark:bg-primary-900/30 border border-primary-200 dark:border-primary-700 ring-1 ring-primary-200 dark:ring-primary-700'
          : 'hover:bg-gray-50 dark:hover:bg-gray-800 border border-transparent'
        }`}
    >
      <div className="w-7 flex-shrink-0 text-center">
        {icon ?? (
          <span className={`text-xs font-bold ${isMe ? 'text-primary-600 dark:text-primary-400' : 'text-gray-400 dark:text-gray-500'}`}>
            #{index + 1}
          </span>
        )}
      </div>

      <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0
        ${isMe ? 'bg-primary-200 dark:bg-primary-800 text-primary-700 dark:text-primary-300' : 'bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400'}`}>
        {initial}
      </div>

      <div className="flex-1 min-w-0">
        <p className={`text-sm font-semibold truncate ${isMe ? 'text-primary-700 dark:text-primary-300' : 'text-gray-800 dark:text-gray-200'}`}>
          {row.name ?? 'Foydalanuvchi'}
          {isMe && <span className="ml-1.5 text-[11px] text-primary-500 dark:text-primary-400 font-normal">(siz)</span>}
        </p>
        <p className="text-[11px] text-gray-400 dark:text-gray-500">
          {formatValue(value, sort)}
          {achievementCount > 0 && (
            <span className="ml-1.5">· {achievementCount} 🏆</span>
          )}
        </p>
      </div>

      {sort === 'xp' && value >= 1000 && (
        <span className="text-[11px] px-2 py-0.5 rounded-full bg-yellow-50 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 font-semibold border border-yellow-100 dark:border-yellow-800">
          VIP
        </span>
      )}
    </div>
  )
}

// ── Main Profile Component ────────────────────────────────────────────────────

export default function Profile() {
  const [activeTab, setActiveTab] = useState<ProfileTab>('info')

  const { user, signOut } = useAuth()
  const navigate = useNavigate()
  const {
    userName, setUserName,
    currentLevel, setLevel,
    startDate, targetDate,
    totalXP, streak, currentDay,
    avatarId, setAvatarId,
    totalWordsLearned, todayXP, weeklyXP, todayMinutes,
  } = useStore()

  // Info tab state
  const [name,      setName]      = useState(userName)
  const [level,     setLevelSel]  = useState<Level>(currentLevel)
  const [saving,    setSaving]    = useState(false)
  const [showCert,  setShowCert]  = useState(false)
  const [saved,     setSaved]     = useState(false)
  const [error,     setError]     = useState<string | null>(null)

  // Progress tab state
  const [timeline, setTimeline]      = useState<DayData[]>([])
  const [radarData, setRadarData]    = useState<{ subject: string; value: number }[]>([])
  const [mockData,  setMockData]     = useState<{ week: string; score: number }[]>([])
  const [progressLoading, setProgressLoading] = useState(true)
  const [supaStreak, setSupaStreak] = useState(0)

  // Achievements tab state
  const {
    unlockedAchievements,
    lastUnlockedAchievement,
    clearLastUnlocked,
  } = useStore()
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'all'>('all')
  const [showUnlockedOnly, setShowUnlockedOnly] = useState(false)
  const [showNewBanner, setShowNewBanner] = useState(true)

  // Weekly Duel state
  const [weeklyWins, setWeeklyWins] = useState(0)
  const [weeklyWinsLoading, setWeeklyWinsLoading] = useState(false)

  // Reward state
  const [claimedRewardIds, setClaimedRewardIds] = useState<string[]>([])
  const [rewardsLoading, setRewardsLoading] = useState(true)

  // Leaders tab state
  const [leaders, setLeaders]         = useState<LeaderRow[]>([])
  const [leadersLoading, setLeadersLoading] = useState(true)
  const [sortBy, setSortBy]           = useState<SortBy>('xp')
  const [search, setSearch]           = useState('')
  const [leadersError, setLeadersError] = useState<string | null>(null)
  const [retryKey, setRetryKey]       = useState(0)
  const [showAIChat, setShowAIChat] = useState(false)

  // Shared achievements count state
  const [achievementCounts, setAchievementCounts] = useState<Record<string, number>>({})
  const [totalUsers, setTotalUsers] = useState(1)

  // Info tab sync
  useEffect(() => {
    setName(userName)
    setLevelSel(currentLevel)
  }, [userName, currentLevel])

  const daysLeft = Math.max(0, Math.ceil(
    (new Date(targetDate).getTime() - Date.now()) / 86400000
  ))

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Xayrli tong' : hour < 18 ? 'Xayrli kun' : 'Xayrli kech'

  // ── Progress Tab Effects ────────────────────────────────────────────────────

  useEffect(() => {
    async function load() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { setProgressLoading(false); return }
        const uid = session.user.id

        const [
          { data: profile },
          { data: daily },
          { data: mocks },
          { data: grammarRows },
          { data: listeningRows },
          { data: readingRows },
          { data: speakingRows },
          { data: writingRows },
          { data: vocabRows },
        ] = await Promise.all([
          supabase.from('users').select('*').eq('id', uid).single(),
          supabase.from('daily_progress').select('*').eq('user_id', uid).order('date'),
          supabase.from('mock_tests').select('*').eq('user_id', uid).order('created_at'),
          supabase.from('grammar_progress').select('date, score').eq('user_id', uid).order('completed_at'),
          supabase.from('listening_progress').select('date, score').eq('user_id', uid).order('completed_at'),
          supabase.from('reading_progress').select('date, score').eq('user_id', uid).order('completed_at'),
          supabase.from('speaking_progress').select('date, avg_score').eq('user_id', uid).order('completed_at'),
          supabase.from('writings').select('date, score').eq('user_id', uid).order('created_at'),
          supabase.from('vocabulary_sessions').select('session_date, score, words_json').eq('user_id', uid).order('id'),
        ])

        const start = profile?.start_date ?? startDate
        const day   = profile?.current_day ?? currentDay
        const streakVal = profile?.streak ?? streak

        setSupaStreak(streakVal)

        type Row = Record<string, unknown>
        const skillMap: Record<string, SkillSummary[]> = {
          grammar:   (grammarRows ?? []).map((r: Row) => ({ date: r.date as string, score: r.score as number })),
          listening: (listeningRows ?? []).map((r: Row) => ({ date: r.date as string, score: r.score as number })),
          reading:   (readingRows ?? []).map((r: Row) => ({ date: r.date as string, score: r.score as number })),
          speaking:  (speakingRows ?? []).map((r: Row) => ({ date: r.date as string, score: ((r.avg_score as number) ?? 0) * 10 })),
          writing:   (writingRows ?? []).map((r: Row) => ({ date: r.date as string, score: ((r.score as number) ?? 0) * 10 })),
          vocab:     (vocabRows ?? []).map((r: Row) => {
            const wj = r.words_json as Record<string, unknown> | undefined
            const cnt = wj ? Object.keys(wj).length : 1
            return { date: r.session_date as string, score: Math.round(((r.score as number) ?? 0) / cnt * 100) }
          }),
        }

        const tl = buildTimeline(start, day, daily ?? [], mocks ?? [], skillMap)
        setTimeline(tl)

        function avgSkill(arr: SkillSummary[]): number {
          const recent = arr.slice(-14)
          return recent.length ? Math.round(recent.reduce((s, d) => s + d.score, 0) / recent.length) : 0
        }
        setRadarData([
          { subject: 'Grammar',   value: avgSkill(skillMap.grammar)   },
          { subject: 'Vocab',     value: avgSkill(skillMap.vocab ?? []) },
          { subject: 'Listening', value: avgSkill(skillMap.listening) },
          { subject: 'Speaking',  value: avgSkill(skillMap.speaking)  },
          { subject: 'Reading',   value: avgSkill(skillMap.reading)   },
          { subject: 'Writing',   value: avgSkill(skillMap.writing)   },
        ])

        const tests = (mocks ?? [])
          .sort((a: Record<string, unknown>, b: Record<string, unknown>) => (a.day as number) - (b.day as number))
          .map((t: Record<string, unknown>) => ({ week: `H${t.week}`, score: t.total_score as number }))
        if (tests.length === 0) {
          setMockData([
            { week: 'H1', score: 0 }, { week: 'H2', score: 0 },
            { week: 'H3', score: 0 }, { week: 'H4', score: 0 },
          ])
        } else {
          setMockData(tests)
        }
      } catch (e) {
        monitoring.captureMessage('Progress load error: ' + (e instanceof Error ? e.message : String(e)), 'error')
      } finally {
        setProgressLoading(false)
      }
    }
    load()
  }, [startDate, currentDay, totalXP, streak])

  // ── Weekly Duel Wins + Rewards (load + claim) ──────────────────────────
  useEffect(() => {
    if (!user?.id) return

    // Weekly wins
    setWeeklyWinsLoading(true)
    import('../services/tandemService').then(({ getWeeklyDuelWins }) => {
      getWeeklyDuelWins(user.id).then((count) => {
        setWeeklyWins(count)
        setWeeklyWinsLoading(false)
      })
    }).catch(() => setWeeklyWinsLoading(false))

    // Load reward badges + claim pending
    setRewardsLoading(true)
    getClaimedRewardIds(user.id).then((ids) => {
      setClaimedRewardIds(ids)
      setRewardsLoading(false)

      // Claim any pending rewards based on current streak
      claimPendingRewards(user.id, streak, ids).then((newRewards) => {
        if (newRewards.length > 0) {
          setClaimedRewardIds(prev => [...prev, ...newRewards.map(r => r.id)])
          import('../utils/toastStore').then(({ useToastStore }) => {
            useToastStore.getState().toast(
              `🎉 ${newRewards[0].title}!${newRewards[0].xpBonus ? ` +${newRewards[0].xpBonus} XP` : ''}`,
              'success', 5000,
            )
          })
        }
      }).catch(() => {})
    }).catch(() => setRewardsLoading(false))
  }, [user?.id, streak])

  // ── Achievements Tab Effects ────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false
    ;(async () => {
      const { count: userCount } = await supabase
        .from('users')
        .select('*', { count: 'exact', head: true })
      if (!cancelled) setTotalUsers(userCount ?? 1)

      const { data: achievements } = await supabase
        .from('achievements')
        .select('achievement_id')
      if (cancelled) return

      if (achievements) {
        const counts: Record<string, number> = {}
        for (const row of achievements) {
          counts[row.achievement_id] = (counts[row.achievement_id] ?? 0) + 1
        }
        setAchievementCounts(counts)
      }
    })()
    return () => { cancelled = true }
  }, [])

  // ── Leaders Tab Effects ─────────────────────────────────────────────────────

  useEffect(() => {
    let cancelled = false
    setLeadersLoading(true)
    setLeadersError(null)

    ;(async () => {
      const { data, error: err } = await supabase
        .from('users')
        .select('id, name, total_xp, streak, words_learned')
        .order(sortBy, { ascending: false })
        .limit(100)

      if (cancelled) return
      if (err) {
        setLeadersLoading(false)
        setLeadersError(err.message)
        return
      }

      const users = (data ?? []) as LeaderRow[]

      const userIds = new Set(users.map(u => u.id))
      if (user?.id) userIds.add(user.id)
      const { data: achievements } = await supabase
        .from('achievements')
        .select('user_id, achievement_id')
        .in('user_id', [...userIds])

      if (!cancelled && achievements) {
        const counts: Record<string, number> = {}
        for (const row of achievements) {
          counts[row.user_id] = (counts[row.user_id] ?? 0) + 1
        }
        setAchievementCounts(counts)
      }

      if (!cancelled) {
        setLeaders(users)
        setLeadersLoading(false)
      }
    })()

    return () => { cancelled = true }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortBy, retryKey])

  // ── Info Tab Handlers ───────────────────────────────────────────────────────

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setError(null)
    setSaved(false)

    const trimmedName = name.trim()
    if (trimmedName.length < 2) {
      setError("Ism kamida 2 belgidan iborat bo'lishi kerak")
      setSaving(false)
      return
    }

    setUserName(trimmedName)
    setLevel(level)

    try {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { error: dbError } = await supabase
          .from('users')
          .upsert({
            id: session.user.id,
            name: trimmedName,
            level,
            email: session.user.email ?? '',
          } as never, { onConflict: 'id' })

        if (dbError) throw dbError

        await supabase.auth.updateUser({
          data: { name: trimmedName },
        })
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Saqlashda xatolik')
      setSaving(false)
      return
    }

    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  // ── Render Helpers ──────────────────────────────────────────────────────────

  function StudyBuddySection({ userId }: { userId?: string }) {
    const [buddy, setBuddy] = useState<{ id: string; name: string } | null>(null)
    const [buddyEmail, setBuddyEmail] = useState('')
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [buddyXP, setBuddyXP] = useState(0)
    const [buddyStreak, setBuddyStreak] = useState(0)
    const [buddyWords, setBuddyWords] = useState(0)
    const [duoStreakToday, setDuoStreakToday] = useState(false)
    const [challengeSent, setChallengeSent] = useState(false)
    const [buddyLoading, setBuddyLoading] = useState(true)

    useEffect(() => {
      if (!userId) { setLoading(false); return }
      import('../services/studyBuddyService').then(({ getStudyBuddy }) =>
        getStudyBuddy(userId).then(async (b) => {
          setBuddy(b)
          setLoading(false)
          if (!b) { setBuddyLoading(false); return }
          try {
            const { data: buddyData } = await supabase
              .from('users')
              .select('total_xp, streak, words_learned, name')
              .eq('id', b.id)
              .single()
            if (buddyData) {
              setBuddyXP(buddyData.total_xp ?? 0)
              setBuddyStreak(buddyData.streak ?? 0)
              setBuddyWords(buddyData.words_learned ?? 0)
            }
            const { checkDuoStreak } = await import('../services/studyBuddyService')
            const bothDone = await checkDuoStreak(userId, b.id)
            setDuoStreakToday(bothDone)
          } catch { /* ignore */ }
          setBuddyLoading(false)
        })
      )
    }, [userId])

    function handleSendChallenge() {
      setChallengeSent(true)
      setTimeout(() => setChallengeSent(false), 3000)
    }

    // Comparison bars
    const myBar = (myVal: number, buddyVal: number) => {
      const max = Math.max(myVal, buddyVal, 1)
      return (
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-10 text-right text-gray-400 font-medium">Siz</span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-primary-500 rounded-full" style={{ width: `${(myVal / max) * 100}%` }} />
            </div>
          </div>
          <div className="flex items-center gap-2 text-[11px]">
            <span className="w-10 text-right text-gray-400 font-medium">Buddy</span>
            <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
              <div className="h-full bg-green-500 rounded-full" style={{ width: `${(buddyVal / max) * 100}%` }} />
            </div>
          </div>
        </div>
      )
    }

    return (
      <div className="card">
        <h3 className="font-semibold text-sm text-gray-900 mb-3 flex items-center gap-2">
          🤝 Birga o'qish
        </h3>
        {loading ? (
          <div className="text-sm text-gray-400">Yuklanmoqda...</div>
        ) : buddy ? (
          <div className="space-y-4">
            {/* Buddy header */}
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-xl border border-green-100 dark:border-green-800">
              <div className="w-10 h-10 rounded-xl bg-green-200 dark:bg-green-700 flex items-center justify-center text-lg">
                👥
              </div>
              <div className="flex-1">
                <p className="text-sm font-bold text-gray-800 dark:text-white">{buddy.name}</p>
                <p className="text-[11px] text-green-600 dark:text-green-400">
                  Birgalikda o'qiyapsizlar
                </p>
              </div>
              {/* Duo streak */}
              <div className={`flex flex-col items-center px-2 py-1 rounded-lg ${duoStreakToday ? 'bg-yellow-100 dark:bg-yellow-900/30' : 'bg-gray-100 dark:bg-gray-700'}`}>
                <div className="flex items-center gap-1">
                  <Flame size={12} className={duoStreakToday ? 'text-orange-500' : 'text-gray-400'} />
                  <span className={`text-xs font-bold ${duoStreakToday ? 'text-orange-600' : 'text-gray-400'}`}>
                    {duoStreakToday ? '🔥 Bugun' : '⏸️ Bugun emas'}
                  </span>
                </div>
                <span className="text-[11px] text-gray-400">Duo streak</span>
              </div>
            </div>

            {/* Progress comparison */}
            {!buddyLoading && (
              <div className="space-y-3">
                <p className="text-xs font-semibold text-gray-700 dark:text-gray-300">📊 Progress solishtirish</p>
                <div className="grid grid-cols-3 gap-2 text-center">
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-2 border border-gray-100 dark:border-gray-700">
                    <p className="text-[11px] text-gray-400">XP</p>
                    <p className="text-sm font-bold text-primary-600">{totalXP.toLocaleString()}</p>
                    <p className="text-[11px] text-green-600">{buddyXP.toLocaleString()}</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-2 border border-gray-100 dark:border-gray-700">
                    <p className="text-[11px] text-gray-400">Streak</p>
                    <p className="text-sm font-bold text-orange-500">{streak} kun</p>
                    <p className="text-[11px] text-green-600">{buddyStreak} kun</p>
                  </div>
                  <div className="bg-white dark:bg-gray-800 rounded-xl p-2 border border-gray-100 dark:border-gray-700">
                    <p className="text-[11px] text-gray-400">So'zlar</p>
                    <p className="text-sm font-bold text-b1-600">{totalWordsLearned}</p>
                    <p className="text-[11px] text-green-600">{buddyWords}</p>
                  </div>
                </div>

                {/* XP Bar comparison */}
                <div className="bg-gray-50 dark:bg-gray-800/50 rounded-xl p-3">
                  <p className="text-[11px] font-semibold text-gray-500 mb-2">XP taqqoslash</p>
                  {myBar(totalXP, buddyXP)}
                </div>
              </div>
            )}

            {/* Send Challenge */}
            <div className="flex gap-2">
              <button
                onClick={handleSendChallenge}
                className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  challengeSent
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gradient-to-r from-orange-400 to-red-500 text-white hover:shadow-md active:scale-[0.98]'
                }`}
              >
                {challengeSent ? (
                  <>✅ Challenge yuborildi!</>
                ) : (
                  <><Zap size={14} /> Challenge yuborish</>
                )}
              </button>
            </div>
          </div>
        ) : (
          <div>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Do'stingizning email..."
                value={buddyEmail}
                onChange={e => setBuddyEmail(e.target.value)}
                className="input flex-1 text-sm"
              />
              <button
                onClick={async () => {
                  if (!userId || !buddyEmail.trim()) return
                  setError('')
                  const { addStudyBuddy } = await import('../services/studyBuddyService')
                  const ok = await addStudyBuddy(userId, buddyEmail.trim())
                  if (ok) {
                    setBuddy({ id: '', name: buddyEmail.trim() })
                  } else {
                    setError('Foydalanuvchi topilmadi. Emailni tekshiring.')
                  }
                }}
                className="btn-primary text-sm px-4"
              >
                Qo'shish
              </button>
            </div>
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
          </div>
        )}

        {/* AI Study Buddy */}
        <div className="mt-3 p-3 rounded-xl bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-900/10 dark:to-indigo-900/10 border border-purple-200 dark:border-purple-800">
          <div className="flex items-center gap-2.5 mb-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-purple-500 to-indigo-600 flex items-center justify-center">
              <Bot size={14} className="text-white" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold text-gray-800 dark:text-gray-200">AI bilan o'qish</p>
              <p className="text-[11px] text-gray-400">Zaif tomonlaringizni tahlil qiladi, maslahat beradi, ovozli suhbat</p>
            </div>
          </div>
          <button
            onClick={() => setShowAIChat(true)}
            className="w-full flex items-center justify-center gap-1.5 py-2 rounded-lg bg-white dark:bg-gray-800 text-purple-600 dark:text-purple-400 text-xs font-semibold hover:bg-purple-50 dark:hover:bg-purple-900/30 border border-purple-200 dark:border-purple-700 transition-colors"
          >
            <MessageCircle size={14} />
            AI bilan suhbatlashish
          </button>
        </div>
      </div>
    )
  }

  function renderInfoTab() {
    return (
      <div className="space-y-4 sm:space-y-6">
        {/* Rewards Badges */}
        {user?.id && (
          <div className="card">
            <div className="flex items-center gap-2 mb-3">
              <Trophy size={16} className="text-yellow-500" />
              <h3 className="font-bold text-sm text-gray-900">
                Profil Badgelari
              </h3>
            </div>
            <ProfileBadges
              streak={streak}
              claimedRewardIds={claimedRewardIds}
              loading={rewardsLoading}
            />
          </div>
        )}

        {/* Quick Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { icon: Flame, value: `${streak}`, label: 'Streak', color: 'text-orange-500', bg: 'bg-orange-50' },
            { icon: Trophy, value: totalXP.toLocaleString(), label: 'Jami XP', color: 'text-b2-600', bg: 'bg-b2-50' },
            { icon: Target, value: `Kun ${currentDay}/126`, label: 'Kun', color: 'text-primary-600', bg: 'bg-primary-50' },
            { icon: Calendar, value: `${daysLeft}`, label: 'Kun qoldi', color: 'text-b1-600', bg: 'bg-b1-50' },
          ].map((stat) => (
            <div key={stat.label} className="card !p-3 sm:!p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center`}>
                <stat.icon size={20} className={stat.color} />
              </div>
              <div>
                <p className="text-lg font-bold text-gray-900 leading-tight">{stat.value}</p>
                <p className="text-[11px] text-gray-500">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Weekly Duel Wins */}
        {weeklyWins > 0 && (
          <div className="card !p-3 sm:!p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center">
              <Swords size={20} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-lg font-bold text-gray-900 leading-tight">
                {weeklyWinsLoading ? '...' : weeklyWins}
              </p>
              <p className="text-[11px] text-gray-500">Tandem Haftalik G'alabalar</p>
            </div>
          </div>
        )}

        {/* Featured Avatar Card */}
        <div className="card bg-gradient-to-br from-primary-50 via-purple-50 to-indigo-50 dark:from-primary-900/20 dark:via-purple-900/20 dark:to-indigo-900/20 border-primary-100 dark:border-primary-800/50">
          {(() => {
            const av = AVATARS.find(a => a.id === avatarId)
            if (!av) return null
            return (
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white dark:bg-gray-800 shadow-md flex items-center justify-center text-4xl sm:text-5xl">
                    {av.emoji}
                  </div>
                  {av.isSpecial && (
                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-yellow-400 to-amber-500 rounded-full flex items-center justify-center">
                      <Crown size={10} className="text-white" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-bold text-base text-gray-900 dark:text-white">{av.label}</h3>
                    <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/70 dark:bg-gray-800/70 text-primary-600 dark:text-primary-400 font-semibold border border-primary-200 dark:border-primary-700">
                      {av.personality}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 leading-relaxed">
                    "{av.trait}"
                  </p>
                  {av.achievementHint && av.isSpecial && (
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1.5 flex items-center gap-1">
                      <Sparkles size={10} />
                      {av.achievementHint}
                    </p>
                  )}
                </div>
              </div>
            )
          })()}
        </div>

        {/* Profile Form */}
        <form onSubmit={handleSave} className="card space-y-5">
          <h2 className="font-bold text-gray-900 text-sm flex items-center gap-2">
            <User size={16} className="text-primary-600" />
            Shaxsiy ma'lumotlar
          </h2>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <div className="flex items-center gap-1.5">
                <User size={14} className="text-gray-400" />
                Ism
              </div>
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Ismingiz..."
              required
              minLength={2}
              className="input"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <div className="flex items-center gap-1.5">
                <Mail size={14} className="text-gray-400" />
                Email
              </div>
            </label>
            <input
              type="email"
              value={user?.email ?? ''}
              disabled
              className="input opacity-60 cursor-not-allowed"
            />
            <p className="text-[11px] text-gray-400 mt-1">Emailni o'zgartirish uchun support bilan bog'laning</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              <div className="flex items-center gap-1.5">
                <Medal size={14} className="text-gray-400" />
                Hozirgi daraja
              </div>
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {LEVELS.map((l) => (
                <button
                  key={l.value}
                  type="button"
                  onClick={() => setLevelSel(l.value)}
                  className={`px-3 py-2.5 rounded-xl border text-center transition-all duration-200
                    ${level === l.value
                      ? `${l.color} ring-2 ring-offset-1 scale-105`
                      : 'border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                >
                  <p className={`font-bold text-sm ${level === l.value ? '' : 'text-gray-700'}`}>{l.label}</p>
                  <p className="text-[11px] mt-0.5 opacity-70">{l.desc}</p>
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => navigate('/placement-test')}
              className="mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-xl border border-dashed border-primary-300 dark:border-primary-700 text-primary-600 dark:text-primary-400 font-semibold text-sm hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors"
            >
              <GraduationCap size={15} /> Daraja aniqlash testini topshirish
            </button>
          </div>

          <AvatarSelector current={avatarId} onChange={setAvatarId} userXP={totalXP} userStreak={streak} userWords={totalWordsLearned} userDay={currentDay} />

          <div className="bg-gradient-to-r from-primary-50 to-b1-50 rounded-xl p-4 border border-primary-100">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <Target size={16} className="text-primary-600" />
                <span className="font-semibold text-sm text-gray-900">Maqsad</span>
              </div>
              <span className="text-xs font-bold text-primary-600">
                {currentDay}/126 kun
              </span>
            </div>
            <div className="progress-bar">
              <div
                className="progress-fill bg-gradient-to-r from-primary-500 to-b1-500"
                style={{ width: `${(currentDay / 126) * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[11px] text-gray-500 mt-1.5">
              <span>Boshlangan: {startDate}</span>
              <span>Maqsad: {targetDate} ({daysLeft} kun qoldi)</span>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
              {error}
            </div>
          )}

          {/* 126-kun sertifikat tugmasi */}
          {currentDay >= 126 && (
            <button
              type="button"
              onClick={() => setShowCert(true)}
              className="w-full flex items-center justify-center gap-2 py-3
                bg-gradient-to-r from-yellow-400 to-orange-500
                text-white font-bold rounded-2xl hover:opacity-90 transition-opacity"
            >
              🏆 B2 Sertifikatni ko'rish
            </button>
          )}

          <div className="flex items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Save size={16} />
              {saving ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>

            {saved && (
              <div className="flex items-center gap-1.5 text-sm text-green-600 font-medium animate-slide-in">
                <CheckCircle size={16} />
                Saqlandi
              </div>
            )}
          </div>
        </form>

        {/* Account Info */}
        <div className="card">
          <h3 className="font-semibold text-sm text-gray-900 mb-3 flex items-center gap-2">
            <User size={15} className="text-gray-400" />
            Hisob ma'lumotlari
          </h3>
          <div className="space-y-2.5 text-sm">
            <div className="flex items-center justify-between py-1.5">
              <span className="text-gray-500">Foydalanuvchi ID</span>
              <span className="text-gray-700 font-mono text-xs truncate ml-4 max-w-[200px]">
                {user?.id ?? '—'}
              </span>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex items-center justify-between py-1.5">
              <span className="text-gray-500">Email tasdiqlangan</span>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                user?.email_confirmed_at ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
              }`}>
                {user?.email_confirmed_at ? 'Ha' : "Yo'q"}
              </span>
            </div>
            <div className="h-px bg-gray-100" />
            <div className="flex items-center justify-between py-1.5">
              <span className="text-gray-500">Ro'yxatdan o'tgan</span>
              <span className="text-gray-700 text-xs">
                {user?.created_at ? new Date(user.created_at).toLocaleDateString('uz-UZ') : '—'}
              </span>
            </div>
          </div>
        </div>

        {/* Game Feel Settings */}
        <GameFeelSettings />

        {/* Notification Settings */}
        <NotificationSettings />

        {/* Study Buddy */}
        <StudyBuddySection userId={user?.id} />

        {/* AI Study Buddy Chat Modal */}
        {showAIChat && (
          <AIBuddyChatModal
            context={{
              userName: userName || 'Student',
              currentLevel,
              currentDay,
              streak,
              totalXP,
              todayXP,
              weeklyXP: weeklyXP ?? 0,
              todayMinutes,
              totalWordsLearned,
            }}
            onClose={() => setShowAIChat(false)}
          />
        )}

        {/* Password Reset Link */}
        <div className="card flex items-center justify-between">
          <div>
            <p className="font-semibold text-sm text-gray-900">Parolni o'zgartirish</p>
            <p className="text-xs text-gray-500 mt-0.5">Email orqali parolni tiklash havolasini oling</p>
          </div>
          <button
            onClick={async () => {
              const email = user?.email
              if (!email) return
              const { supabase } = await import('../lib/supabase')
              await supabase.auth.resetPasswordForEmail(email, {
                redirectTo: `${window.location.origin}/reset-password`,
              })
              alert('Parolni tiklash havolasi emailingizga yuborildi!')
            }}
            className="flex items-center gap-1 text-sm text-primary-600 font-semibold hover:gap-2 transition-all"
          >
            Tiklash <ChevronRight size={14} />
          </button>
        </div>
      </div>
    )
  }

  function GrowthSnapshot() {
    if (timeline.length < 5) return null
    const firstWeek = timeline.filter(d => d.day <= 7)
    const startDay = firstWeek.length > 0 ? firstWeek[0].day : 1
    const startXP = firstWeek.length > 0 ? firstWeek[0].cumulativeXP - firstWeek[0].xp : 0
    const startWords = firstWeek.length > 0 ? firstWeek[0].totalWords - firstWeek[0].newWords : 0
    const last = timeline[timeline.length - 1]

    if (currentDay - startDay < 10) return null

    const items = [
      { label: 'Darslar',  before: `${startDay}`,  after: `${currentDay}` },
      { label: 'XP',       before: `${startXP}`,   after: `${last.cumulativeXP.toLocaleString()}` },
      { label: "So'zlar",  before: `${startWords}`, after: `${last.totalWords}` },
    ]

    return (
      <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-2xl p-5 border border-green-100 dark:border-green-800">
        <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-3">
          📈 {currentDay - startDay} kunda siz shu qadar o'sdingiz!
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {items.map(item => (
            <div key={item.label} className="text-center bg-white dark:bg-gray-800 rounded-xl p-2.5">
              <p className="text-[11px] text-gray-400 mb-1">{item.label}</p>
              <p className="text-xs text-gray-400 line-through">{item.before}</p>
              <p className="text-base font-bold text-green-600 dark:text-green-400">{item.after}</p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  function PredictionCard() {
    const totalDays = 126
    const remaining = totalDays - currentDay
    const weeksWithData = Math.max(1, Math.ceil(timeline.length / 7))
    const daysWithActivity = timeline.filter(d => d.hours > 0).length
    const avgDaysPerWeek = +(daysWithActivity / weeksWithData).toFixed(1)
    const daysUntilDone = avgDaysPerWeek > 0
      ? Math.ceil(remaining / (avgDaysPerWeek / 7))
      : null
    const finishDate = daysUntilDone
      ? new Date(Date.now() + daysUntilDone * 86_400_000).toLocaleDateString('uz-UZ')
      : null
    const faster = avgDaysPerWeek > 0
      ? Math.ceil(remaining / ((avgDaysPerWeek + 1) / 7))
      : null
    const fasterDate = faster
      ? new Date(Date.now() + faster * 86_400_000).toLocaleDateString('uz-UZ')
      : null

    return (
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-5 border border-blue-100 dark:border-blue-800">
        <h3 className="text-sm font-bold text-gray-800 dark:text-white mb-3 flex items-center gap-2">
          🔮 B2 ga qachon yetasiz?
        </h3>
        {finishDate ? (
          <>
            <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mb-1">
              ~{daysUntilDone} kun
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Taxminan: <span className="font-semibold text-gray-700 dark:text-gray-300">{finishDate}</span>
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Hozirgi tezlik: haftada {avgDaysPerWeek} kun
            </p>
            {fasterDate && (
              <p className="text-xs text-indigo-500 mt-2">
                Haftada 1 ta ko'proq dars qilsangiz → {fasterDate} da tugatgan bo'lasiz ⚡
              </p>
            )}
          </>
        ) : (
          <p className="text-sm text-gray-400">Hisoblash uchun ko'proq ma'lumot kerak</p>
        )}
      </div>
    )
  }

  function renderProgressTab() {
    const activeDays = timeline.filter(d => d.hours > 0).length
    const avgHours = activeDays
      ? (timeline.reduce((s, d) => s + d.hours, 0) / activeDays).toFixed(1)
      : '0.0'

    const barData = timeline.map((d, i) => ({
      ...d,
      label: i % 7 === 0 ? `K${d.day}` : '',
    }))

    const xpData = timeline.map((d) => ({
      label:        d.label || '',
      cumulativeXP: d.cumulativeXP,
    }))

    const logRows = [...timeline].reverse().slice(0, 30)

    if (progressLoading) {
      return (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent" />
        </div>
      )
    }

    return (
      <div className="space-y-4">
        {/* Growth snapshot */}
        <GrowthSnapshot />

        {/* Top stat cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
          {[
            { icon: <Award size={16} />,   color: 'text-b2-600',     label: 'Jami XP',     value: totalXP.toLocaleString()        },
            { icon: <Flame size={16} />,   color: 'text-orange-500', label: 'Streak',      value: `${supaStreak || streak} kun`   },
            { icon: <BarChart2 size={16}/>, color: 'text-primary-600',label: "O'rtacha",   value: `${avgHours}h/kun`              },
            { icon: <TrendingUp size={16}/>,color: 'text-green-600',  label: 'Joriy daraja',value: `Kun ${currentDay}`            },
          ].map((s) => (
            <div key={s.label} className="card text-center py-3">
              <div className={`flex justify-center mb-1 ${s.color}`}>{s.icon}</div>
              <p className="text-lg font-bold text-gray-900">{s.value}</p>
              <p className="text-[11px] text-gray-500">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Prediction card */}
        <PredictionCard />

        {/* Row 1: Bar chart + Radar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            <ChartCard title="Kunlik o'qish soatlari" sub="Ko'k pog'ona = maqsad (14 soat)">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={barData} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="label" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <YAxis domain={[0, 16]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<HoursTip />} />
                  <ReferenceLine
                    y={14}
                    stroke="#f59e0b"
                    strokeDasharray="5 3"
                    label={{ value: '14h', fill: '#f59e0b', fontSize: 10, position: 'right' }}
                  />
                  <Bar dataKey="hours" fill="#1a56db" radius={[3, 3, 0, 0]} maxBarSize={12} />
                </BarChart>
              </ResponsiveContainer>
            </ChartCard>
          </div>

          <ChartCard title="Skill Radar" sub="Real natijalar bo'yicha">
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData} margin={{ top: 10, right: 20, bottom: 10, left: 20 }}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#6b7280' }} />
                <PolarRadiusAxis domain={[0, 100]} tick={false} axisLine={false} />
                <Radar
                  name="Ko'nikmalar"
                  dataKey="value"
                  stroke="#1a56db"
                  fill="#1a56db"
                  fillOpacity={0.25}
                />
                <Tooltip
                  formatter={(v: number) => [`${v}%`, 'Ball']}
                  contentStyle={{ fontSize: 11, borderRadius: 8 }}
                />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>

        {/* Row 2: Mock test */}
        <ChartCard title="Mock test natijalari" sub="Haftalik ball o'zgarishi">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={mockData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="week" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis domain={[0, 100]} tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(v: number) => [`${v}%`, 'Ball']}
                contentStyle={{ fontSize: 11, borderRadius: 8 }}
              />
              <ReferenceLine y={60} stroke="#10b981" strokeDasharray="4 2"
                label={{ value: 'B1', fill: '#10b981', fontSize: 9, position: 'right' }} />
              <ReferenceLine y={80} stroke="#1a56db" strokeDasharray="4 2"
                label={{ value: 'B2', fill: '#1a56db', fontSize: 9, position: 'right' }} />
              <Line
                type="monotone" dataKey="score" name="Ball"
                stroke="#7e3af2" strokeWidth={2.5}
                dot={{ fill: '#7e3af2', r: 4 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Streak calendar */}
        <ChartCard title="Streak Kalendar" sub="Har kuni o'qilgan soat (ko'k=maqsad)">
          <StreakCalendar days={timeline} />
        </ChartCard>

        {/* XP area chart */}
        <ChartCard title="XP Tarixi" sub="Kumulativ tajriba ballari">
          <ResponsiveContainer width="100%" height={160}>
            <AreaChart data={xpData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="xpGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#7e3af2" stopOpacity={0.35} />
                  <stop offset="95%" stopColor="#7e3af2" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip
                formatter={(v: number) => [`${v.toLocaleString()} XP`, 'Jami XP']}
                contentStyle={{ fontSize: 11, borderRadius: 8 }}
              />
              <Area
                type="monotone" dataKey="cumulativeXP" name="Jami XP"
                stroke="#7e3af2" fill="url(#xpGrad)" strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Daily log table */}
        <div className="card">
          <p className="font-semibold text-gray-800 text-sm mb-3">Kunlik Log</p>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead>
                <tr className="border-b border-gray-100">
                  {['Sana', 'Soat', "O'tilgan mavzular", 'XP'].map((h) => (
                    <th key={h} className="text-left py-2 pr-4 text-gray-400 font-medium whitespace-nowrap">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {logRows.map((d) => {
                  const topics: string[] = []
                  if (d.grammarPct   >= 20) topics.push('📚 Grammar')
                  if (d.vocabPct     >= 20) topics.push('📝 Vocab')
                  if (d.listeningPct >= 20) topics.push('🎧 Listening')
                  if (d.writingPct   >= 20) topics.push('✍️ Writing')
                  if (d.speakingPct  >= 20) topics.push('🎤 Speaking')
                  if (d.readingPct   >= 20) topics.push('📖 Reading')

                  return (
                    <tr key={d.date} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                      <td className="py-2 pr-4 text-gray-600 whitespace-nowrap">{d.date}</td>
                      <td className="py-2 pr-4 font-semibold text-gray-800">{d.hours}h</td>
                      <td className="py-2 pr-4 text-gray-600">
                        {topics.length > 0 ? topics.join(' · ') : <span className="text-gray-300">—</span>}
                      </td>
                      <td className="py-2 font-semibold text-primary-600">{d.xp}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    )
  }

  function renderAchievementsTab() {
    const newAchievementId = lastUnlockedAchievement
    const newAchievement = newAchievementId
      ? ACHIEVEMENTS.find((a) => a.id === newAchievementId)
      : null

    const dismissNew = () => {
      setShowNewBanner(false)
      clearLastUnlocked()
    }

    let filtered = ACHIEVEMENTS
    if (selectedCategory !== 'all') {
      filtered = filtered.filter((a) => a.category === selectedCategory)
    }
    if (showUnlockedOnly) {
      filtered = filtered.filter((a) => unlockedAchievements.includes(a.id))
    }

    const unlockedCount = unlockedAchievements.length
    const totalCount = ACHIEVEMENTS.length
    const progressPct = Math.round((unlockedCount / totalCount) * 100)

    const categoryStats = CATEGORIES.map((cat) => {
      const total = ACHIEVEMENTS.filter((a) => a.category === cat).length
      const unlocked = ACHIEVEMENTS.filter(
        (a) => a.category === cat && unlockedAchievements.includes(a.id)
      ).length
      return { cat, total, unlocked }
    })

    return (
      <div className="space-y-5 sm:space-y-6">
        {/* New Achievement Banner */}
        {showNewBanner && newAchievement && (
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-yellow-400 via-amber-400 to-orange-400 p-5 sm:p-6 text-white shadow-xl animate-slide-in">
            <div className="absolute -top-6 -right-6 w-24 h-24 rounded-full bg-white/10" />
            <div className="absolute -bottom-4 -left-4 w-16 h-16 rounded-full bg-white/10" />

            <div className="relative z-10 flex items-start gap-4">
              <div className="text-5xl animate-bounce">{newAchievement.icon}</div>
              <div className="flex-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-yellow-100">
                  Yangi Nishon!
                </p>
                <h2 className="text-xl font-bold mt-1 leading-tight">{newAchievement.title}</h2>
                <p className="text-sm text-yellow-100 mt-1">{newAchievement.description}</p>

                <div className="flex gap-3 mt-4">
                  <button
                    onClick={dismissNew}
                    className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white
                      text-sm font-semibold transition-all backdrop-blur-sm"
                  >
                    Ajoyib! 🎉
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900 flex items-center gap-2">
              <Trophy size={22} className="text-yellow-500" />
              Nishonlar
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {unlockedCount}/{totalCount} ta yechilgan
            </p>
          </div>
        </div>

        {/* Main Progress Bar */}
        <div className="card">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Medal size={18} className="text-yellow-500" />
              <span className="font-bold text-sm text-gray-900">Umumiy Progress</span>
            </div>
            <span className="text-xs font-bold text-gray-600">{progressPct}%</span>
          </div>
          <div className="progress-bar h-3">
            <div
              className="progress-fill bg-gradient-to-r from-yellow-400 via-amber-400 to-orange-400"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>

        {/* Category Stats */}
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {categoryStats.map(({ cat, total, unlocked }) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(selectedCategory === cat ? 'all' : cat)}
              className={`card !p-3 text-center transition-all duration-200 ${
                selectedCategory === cat
                  ? 'ring-2 ring-primary-500 ring-offset-2 scale-105'
                  : 'hover:border-gray-300'
              }`}
            >
              <CategoryIcon cat={cat} />
              <p className="text-xs font-bold text-gray-800 mt-1">{CATEGORY_INFO[cat].label}</p>
              <p className="text-[11px] text-gray-400">{unlocked}/{total}</p>
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowUnlockedOnly(!showUnlockedOnly)}
            className={`text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
              showUnlockedOnly
                ? 'bg-primary-100 text-primary-700 border-primary-200'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
            }`}
          >
            {showUnlockedOnly ? 'Faqat yechilganlar' : 'Barchasi'}
          </button>

          {selectedCategory !== 'all' && (
            <button
              onClick={() => setSelectedCategory('all')}
              className="text-xs px-3 py-1.5 rounded-full border border-gray-200 text-gray-400 hover:text-gray-600"
            >
              Filtrni tozalash ✕
            </button>
          )}
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {filtered.map((achievement) => (
            <AchievementCard
              key={achievement.id}
              achievement={achievement}
              unlocked={unlockedAchievements.includes(achievement.id)}
              isNew={achievement.id === newAchievementId}
              unlockCount={achievementCounts[achievement.id] ?? 0}
              totalUsers={totalUsers}
            />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="card text-center py-10">
            <Trophy size={40} className="mx-auto text-gray-200 mb-3" />
            <p className="text-gray-500 font-medium">Hech qanday nishon topilmadi</p>
            <p className="text-xs text-gray-400 mt-1">
              {showUnlockedOnly
                ? 'Hali hech qanday nishon yechilmagan. Darslarni boshlang!'
                : 'Bu kategoriyada nishonlar mavjud emas'}
            </p>
          </div>
        )}

        {/* Quick Progress */}
        <details className="card">
          <summary className="flex items-center justify-between cursor-pointer text-sm font-semibold text-gray-700">
            <span>Tezkor statistika</span>
            <ChevronDown size={16} className="text-gray-400" />
          </summary>
          <div className="mt-4 space-y-3 text-sm">
            {[
              { label: "Kun", value: currentDay, target: 90 },
              { label: 'Jami XP', value: totalXP, target: 10000 },
              { label: 'Streak', value: streak, target: 90 },
              { label: "So'zlar", value: totalWordsLearned, target: 1000 },
            ].map((stat) => {
              const pct = Math.min(100, Math.round((stat.value / stat.target) * 100))
              return (
                <div key={stat.label}>
                  <div className="flex justify-between text-xs mb-1">
                    <span className="text-gray-600">{stat.label}</span>
                    <span className="text-gray-900 font-medium">
                      {stat.value.toLocaleString()} / {stat.target.toLocaleString()}
                    </span>
                  </div>
                  <div className="progress-bar h-2">
                    <div
                      className="progress-fill bg-gradient-to-r from-primary-400 to-b1-500"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </details>
      </div>
    )
  }

  function renderLeadersTab() {
    const filtered = search.trim()
      ? leaders.filter((r) =>
          (r.name ?? '').toLowerCase().includes(search.toLowerCase())
        )
      : leaders

    const myIndex = user ? leaders.findIndex((r) => r.id === user.id) : -1
    const me      = user ? leaders.find((r) => r.id === user.id) ?? null : null

    return (
      <div className="flex flex-col h-full">
        {/* Search */}
        <div className="relative mb-3">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Foydalanuvchi qidirish..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl
              bg-gray-50 focus:bg-white focus:border-primary-300 focus:ring-2 focus:ring-primary-100
              outline-none transition-all placeholder:text-gray-400"
          />
        </div>

        {/* Sort Tabs */}
        <div className="flex gap-1.5 bg-gray-100 p-1 rounded-xl mb-4">
          {LEADER_TABS.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setSortBy(tab.key)}
              className={`flex-1 flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold
                transition-all duration-200
                ${sortBy === tab.key
                  ? `${tab.bg} ${tab.color} shadow-sm`
                  : 'text-gray-400 hover:text-gray-600 hover:bg-gray-50'
                }`}
            >
              <tab.Icon size={14} />
              {tab.label}
            </button>
          ))}
        </div>

        {/* Loading */}
        {leadersLoading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <Loader2 size={24} className="animate-spin text-gray-300" />
            <p className="text-xs text-gray-400">Reyting yuklanmoqda...</p>
          </div>
        )}

        {/* Error */}
        {leadersError && !leadersLoading && (
          <ErrorState
            icon={Users}
            title="Yuklashda xatolik"
            error={leadersError}
            onRetry={() => setRetryKey((k) => k + 1)}
            size="sm"
          />
        )}

        {/* Empty state */}
        {!leadersLoading && !leadersError && filtered.length === 0 && (
          <div className="text-center py-8">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
              <Search size={20} className="text-gray-400" />
            </div>
            <p className="text-sm font-semibold text-gray-800">Hech narsa topilmadi</p>
            <p className="text-xs text-gray-400 mt-1">
              {search.trim()
                ? `"${search}" bo'yicha foydalanuvchi yo'q`
                : 'Hali hech kim reytingga qo\'shilmagan'}
            </p>
            {search.trim() && (
              <button
                onClick={() => setSearch('')}
                className="mt-3 text-xs text-primary-600 font-semibold hover:underline"
              >
                Filtrni tozalash
              </button>
            )}
          </div>
        )}

        {/* Leader list */}
        {!leadersLoading && !leadersError && filtered.length > 0 && (
          <div className="space-y-1.5">
            {filtered.map((row, index) => (
              <LeaderRow
                key={row.id}
                row={row}
                index={index}
                sort={sortBy}
                isMe={user?.id === row.id}
                achievementCount={achievementCounts[row.id] ?? 0}
              />
            ))}
          </div>
        )}

        {/* My position */}
        {!leadersLoading && !leadersError && me && myIndex >= 100 && (
          <div className="mt-4 pt-4 border-t border-gray-100">
            <p className="text-[11px] text-gray-400 mb-2 text-center">Sizning joyingiz</p>
            <LeaderRow row={me} index={myIndex} sort={sortBy} isMe achievementCount={achievementCounts[me.id] ?? 0} />
          </div>
        )}

        {/* Info footer */}
        <div className="text-center pt-2 pb-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-50 rounded-full border border-gray-100">
            <Users size={11} className="text-gray-400" />
            <span className="text-[11px] text-gray-400">
              {leaders.length} ta faol foydalanuvchi
            </span>
          </div>
        </div>
      </div>
    )
  }

  // ── Main Render ─────────────────────────────────────────────────────────────

  return (
    <div className="max-w-2xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {showCert && (
        <Certificate
          userName={userName || 'Foydalanuvchi'}
          completionDate={targetDate || new Date().toISOString().split('T')[0]}
          totalXP={totalXP}
          onClose={() => setShowCert(false)}
        />
      )}
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-gray-900">Profil Sozlamalari</h1>
          <p className="text-sm text-gray-500 mt-0.5">{greeting}, {userName || 'Foydalanuvchi'}! 👋</p>
        </div>
        {activeTab === 'info' && (
          <button
            onClick={signOut}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-red-50 text-red-600
              hover:bg-red-100 transition-colors text-sm font-medium"
          >
            <LogOut size={16} />
            Chiqish
          </button>
        )}
      </div>

      {/* Tab Bar */}
      <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-2xl sticky top-14 z-10">
        {PROFILE_TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`
              flex-1 flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl
              text-xs sm:text-sm font-medium transition-all duration-200
              ${activeTab === tab.id
                ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                : 'text-gray-500 dark:text-gray-400 hover:text-gray-700'
              }
            `}
          >
            <span>{tab.emoji}</span>
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab Content */}
      {activeTab === 'info' && renderInfoTab()}
      {activeTab === 'progress' && renderProgressTab()}
      {activeTab === 'achievements' && renderAchievementsTab()}
      {activeTab === 'leaders' && renderLeadersTab()}
    </div>
  )
}
