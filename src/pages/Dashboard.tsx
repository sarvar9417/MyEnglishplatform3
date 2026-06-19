import { useEffect, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useAuth } from '../hooks/useAuth'
import { useProgress } from '../hooks/useProgress'
import { useInView } from '../hooks/useInView'
import { useI18n } from '../i18n'
import { useTandemStore } from '../store/tandemSlice'
import { getSpeakingStats, type SpeakingStats } from '../services/speakingPathService'
import { getAllChunks, TOTAL_SPEAKING_DAYS } from '../data/speakingPath'
import { monitoring } from '../lib/monitoring'
import {
  BookOpen, BookMarked, Headphones, PenLine, Target,
  BookText, Mic, Sun, ChevronRight, LogOut, MessageCircle,
} from 'lucide-react'
import AiInsightsWidget from '../components/dashboard/AiInsightsWidget'
import TandemCard from '../components/dashboard/TandemCard'
import ConfusablePairsCard from '../components/dashboard/ConfusablePairsCard'
import { ReviewOverview } from './GrammarReview'
import GrammarSrsCard from '../components/dashboard/GrammarSrsCard'
import StreakWarning from '../components/notifications/StreakWarning'
import ReviewReminder from '../components/notifications/ReviewReminder'
import WeakSpotsWidget from '../components/dashboard/WeakSpotsWidget'
import AdaptivePlan from '../components/dashboard/AdaptivePlan'
import ProgressMap from '../components/dashboard/ProgressMap'
import { IDIOMS } from '../data/idioms'
import type { QuickWeakSpot } from '../services/analyticsService'
import { getStoryBeat, STORY_BEATS, resolveActDisplay } from '../data/narrative/storyline'
import { AVATARS } from '../components/ui/AvatarSelector'
import { LESSON_INDEX } from '../data/daily/lessonsIndex'

// ═══════════════════════════════════════════════════════════════════════════
// 1. TOP BAR
// ═══════════════════════════════════════════════════════════════════════════

function TopBar() {
  const { t } = useI18n()
  const { currentLevel, currentWeek, currentDay, streak: localStreak, targetDate, userName: localName, avatarId, totalWordsLearned } = useStore()
  const { displayName, signOut } = useAuth()
  const { dbStreak } = useProgress()

  const userName = displayName || localName
  const streak   = dbStreak   || localStreak

  const dayNum = Math.max(1, currentDay || 1)
  const dayInWeek = ((dayNum - 1) % 7) + 1

  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(targetDate).getTime() - Date.now()) / 86_400_000)
  )

  const levelColor =
    currentLevel === 'B2'         ? 'bg-b2-100 text-b2-700 border-b2-200' :
    currentLevel.startsWith('B1') ? 'bg-b1-100 text-b1-700 border-b1-200' :
                                    'bg-primary-100 text-primary-700 border-primary-200'

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? t('dashboard.greetingMorning') :
    hour < 18 ? t('dashboard.greetingAfternoon')  : t('dashboard.greetingEvening')

  return (
    <header className="bg-white border-b border-gray-100 px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between flex-shrink-0 gap-2">
      <div className="min-w-0">
        <p className="text-xs text-gray-400 font-medium">{greeting}</p>
        <h1 className="text-sm sm:text-base font-bold text-gray-900 leading-tight truncate flex items-center gap-1.5">
          <span className="text-lg">{AVATARS.find(a => a.id === avatarId)?.emoji ?? '👤'}</span>
          {t('dashboard.greetingUser', { name: userName || t('sidebar.userFallback') })}
        </h1>
      </div>

      <div className={`flex items-center gap-1 px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-full border font-semibold text-xs sm:text-sm flex-shrink-0 ${levelColor}`}>
        <span>{t('dashboard.topBarLevel', { level: currentLevel })}</span>
        <span className="text-xs opacity-60 hidden sm:inline">·</span>
        <span className="text-xs font-medium opacity-80 hidden sm:inline">{t('dashboard.topBarWeek', { week: currentWeek })}</span>
        <span className="text-xs opacity-60 hidden sm:inline">·</span>
        <span className="text-xs font-medium opacity-80">{t('dashboard.topBarDay', { dayInWeek })}</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className="text-base sm:text-lg leading-none">🔥</span>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-tight">{t('dashboard.topBarStreak', { streak })}</p>
            <p className="text-xs text-gray-400">{t('dashboard.streakLabel')}</p>
          </div>
          <span className="text-xs font-bold text-gray-900 sm:hidden">{streak}</span>
        </div>
        <div className="h-7 w-px bg-gray-100 hidden sm:block" />
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-gray-900 leading-tight">{t('dashboard.topBarDaysLeft', { daysLeft })}</p>
          <p className="text-xs text-gray-400">{t('dashboard.daysLeftLabel')}</p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="text-base leading-none">📚</span>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-tight">{totalWordsLearned}</p>
            <p className="text-xs text-gray-400">{t('dashboard.totalWordsLabel')}</p>
          </div>
        </div>
        <div className="h-7 w-px bg-gray-100" />
        <button
          onClick={signOut}
          title={t('dashboard.signOutTitle')}
          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. TODAY PROGRESS — 6 skill rings
// ═══════════════════════════════════════════════════════════════════════════

interface RingConfig {
  key:        string
  label:      string
  pct:        number
  stroke:     string
  track:      string
  Icon:       typeof BookOpen
  iconColor:  string
  hours:      string
  route:      string
}

function SkillRing({ pct, stroke, track, label, hours, Icon, iconColor, onClick }: Omit<RingConfig, 'key'> & { onClick?: () => void }) {
  const { t } = useI18n()
  const SIZE = typeof window !== 'undefined' && window.innerWidth < 640 ? 72 : 96
  const R    = SIZE === 72 ? 28 : 38
  const C    = 2 * Math.PI * R
  const offset = C * (1 - Math.min(pct, 100) / 100)

  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 sm:gap-2.5 transition-transform hover:scale-105 active:scale-95 focus:outline-none" aria-label={t('dashboard.skillRingAria', { label })}>
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        {pct >= 80 && (
          <div
            className="absolute inset-0 rounded-full opacity-20 blur-md"
            style={{ background: stroke }}
          />
        )}
        <svg width={SIZE} height={SIZE} className="-rotate-90 relative z-10">
          <circle cx={SIZE/2} cy={SIZE/2} r={R} fill="none" stroke={track}  strokeWidth={SIZE === 72 ? 6 : 9} />
          <circle
            cx={SIZE/2} cy={SIZE/2} r={R} fill="none"
            stroke={stroke} strokeWidth={SIZE === 72 ? 6 : 9} strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(0.34,1.56,0.64,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <Icon size={SIZE === 72 ? 11 : 14} className={iconColor} />
          <span className="text-xs sm:text-sm font-bold text-gray-800 mt-0.5 leading-none">
            {Math.round(pct)}%
          </span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs sm:text-xs font-semibold text-gray-700">{label}</p>
        <p className="text-xs sm:text-xs text-gray-400">{hours}</p>
      </div>
    </button>
  )
}

function TodayProgress() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { todayGrammarPct, todayVocabPct, todayListeningPct, todayReadingPct, todaySpeakingPct, todayWritingPct } = useStore()
  const { todayProgress } = useProgress()

  const gPct = todayProgress?.grammar_pct   ?? todayGrammarPct
  const vPct = todayProgress?.vocab_pct     ?? todayVocabPct
  const lPct = todayProgress?.listening_pct ?? todayListeningPct
  const rPct = (todayProgress as Record<string, unknown> | null)?.reading_pct   as number ?? todayReadingPct
  const sPct = (todayProgress as Record<string, unknown> | null)?.speaking_pct   as number ?? todaySpeakingPct
  const wPct = todayProgress?.writing_pct   ?? todayWritingPct

  const rings: RingConfig[] = [
    {
      key: 'grammar', label: t('dashboard.skillRingGrammar'),    hours: t('dashboard.skillRingGrammarHours'), route: '/lesson',
      pct: gPct,
      stroke: '#1a56db', track: '#dbeafe',
      Icon: BookOpen, iconColor: 'text-primary-600',
    },
    {
      key: 'vocab', label: t('dashboard.skillRingVocab'),       hours: t('dashboard.skillRingVocabHours'), route: '/vocabulary',
      pct: vPct,
      stroke: '#0f766e', track: '#ccfbf1',
      Icon: BookMarked, iconColor: 'text-b1-600',
    },
    {
      key: 'listening', label: t('dashboard.skillRingListening'), hours: t('dashboard.skillRingListeningHours'), route: '/listening',
      pct: lPct,
      stroke: '#f97316', track: '#ffedd5',
      Icon: Headphones, iconColor: 'text-orange-500',
    },
    {
      key: 'reading', label: t('dashboard.skillRingReading'),     hours: t('dashboard.skillRingReadingHours'), route: '/reading',
      pct: rPct,
      stroke: '#06b6d4', track: '#cffafe',
      Icon: BookText, iconColor: 'text-cyan-600',
    },
    {
      key: 'speaking', label: t('dashboard.skillRingSpeaking'),   hours: t('dashboard.skillRingSpeakingHours'), route: '/speaking',
      pct: sPct,
      stroke: '#e11d48', track: '#ffe4e6',
      Icon: Mic, iconColor: 'text-rose-500',
    },
    {
      key: 'writing', label: t('dashboard.skillRingWriting'),     hours: t('dashboard.skillRingWritingHours'), route: '/writing',
      pct: wPct,
      stroke: '#7c3aed', track: '#ede9fe',
      Icon: PenLine, iconColor: 'text-b2-600',
    },
  ]

  const avg = Math.round(rings.reduce((s, r) => s + r.pct, 0) / rings.length)

  const avgColor =
    avg >= 80 ? 'text-b1-600 bg-b1-50'    :
    avg >= 50 ? 'text-yellow-600 bg-yellow-50' :
                'text-gray-500 bg-gray-100'

  return (
    <section className="card">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h2 className="font-bold text-gray-900 text-sm">{t('dashboard.skillProgressTitle')}</h2>
          <p className="text-xs text-gray-400 mt-0.5">{t('dashboard.skillProgressSubtitle')}</p>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${avgColor}`}>
          {t('dashboard.skillProgressAvg', { avg })}
        </span>
      </div>
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 sm:gap-2">
        {rings.map(({ key, ...rest }) => <SkillRing key={key} {...rest} onClick={() => navigate(rest.route)} />)}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. LESSON PROGRESS
// ═══════════════════════════════════════════════════════════════════════════

function LessonProgressCard() {
  const { t } = useI18n()
  const lessonProgress = useStore((s) => s.lessonProgress)
  const lessons = useStore((s) => s.lessons)
  const navigate = useNavigate()
  if (lessons.length === 0) return null
  const pcts = lessons.map((l) => ({
    id: l.id,
    title: l.title,
    pct: lessonProgress[l.id] ?? 0,
    done: lessonProgress[l.id] !== undefined,
  }))
  const completed = pcts.filter((p) => p.done).length
  const avgPct = pcts.length > 0 ? Math.round(pcts.reduce((a, p) => a + p.pct, 0) / pcts.length) : 0

  return (
    <section className="card">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Sun size={18} className="text-primary-600" />
          <h3 className="font-bold text-gray-900 text-sm">{t('dashboard.lessonProgressTitle')}</h3>
        </div>
        <button
          onClick={() => navigate('/lesson')}
          className="text-xs text-primary-600 font-semibold flex items-center gap-0.5 hover:gap-1.5 transition-all"
        >
          {t('dashboard.lessonProgressViewAll')} <ChevronRight size={12} />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-3 pb-3 border-b border-gray-50">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500">{t('dashboard.lessonProgressCompleted')}</span>
          <span className="font-bold text-gray-900">{completed}/{pcts.length}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500">{t('dashboard.lessonProgressAverage')}</span>
          <span className={`font-bold ${
            avgPct >= 80 ? 'text-green-600' : avgPct >= 50 ? 'text-yellow-600' : 'text-red-500'
          }`}>{avgPct}%</span>
        </div>
      </div>

      <div className="flex gap-1.5 flex-wrap">
        {pcts.map((p) => (
          <button
            key={p.id}
            onClick={() => navigate('/lesson')}
            className="flex items-center gap-1 px-2 py-1 rounded-lg border text-xs transition-all
              hover:border-primary-200 hover:bg-primary-50 group"
            title={`${p.title}: ${p.pct}%`}
          >
            <div
              className={`w-1.5 h-1.5 rounded-full ${
                p.pct >= 80 ? 'bg-green-500' :
                p.pct >= 50 ? 'bg-yellow-500' :
                p.done ? 'bg-red-400' : 'bg-gray-200'
              }`}
            />
            <span className="text-gray-600 group-hover:text-primary-700">{p.title}</span>
            {p.done && (
              <span className={`text-xs font-bold ml-auto ${
                p.pct >= 80 ? 'text-green-600' :
                p.pct >= 50 ? 'text-yellow-600' :
                'text-red-500'
              }`}>{p.pct}%</span>
            )}
          </button>
        ))}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. DAILY IDIOM
// ═══════════════════════════════════════════════════════════════════════════

function DailyIdiomCard() {
  const { t } = useI18n()
  const navigate = useNavigate()

  // Deterministic daily pick based on day of year
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  const idiom = IDIOMS[dayOfYear % IDIOMS.length]

  if (!idiom) return null

  return (
    <button
      onClick={() => navigate('/idioms')}
      className="card w-full text-left group hover:shadow-md hover:border-primary-200 dark:hover:border-primary-700
        transition-all active:scale-[0.98]"
    >
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 rounded-xl bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center flex-shrink-0 text-lg">
          💡
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400">
              {t('dashboard.dailyIdiomTitle')}
            </span>
            <span className={`text-xs font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
              idiom.level === 'B2'
                ? 'bg-b2-100 text-b2-700 dark:bg-b2-900/30 dark:text-b2-300'
                : 'bg-primary-100 text-primary-700 dark:bg-primary-900/30 dark:text-primary-300'
            }`}>
              {idiom.level}
            </span>
          </div>
          <p className="text-lg font-bold text-gray-900 dark:text-gray-100 mb-0.5">
            {idiom.idiom}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {idiom.actualMeaning}
          </p>
          <div className="flex items-center gap-1 mt-1.5 text-xs text-gray-400 dark:text-gray-500 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            <MessageCircle size={12} />
            <span>{t('dashboard.dailyIdiomViewAll')}</span>
          </div>
        </div>
        <span className="text-sm flex-shrink-0 text-gray-300 dark:text-gray-600 group-hover:text-primary-400 transition-colors">
          →
        </span>
      </div>
    </button>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. START LESSON BUTTON
// ═══════════════════════════════════════════════════════════════════════════

function StartLessonButton() {
  const { t } = useI18n()
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate('/lesson')}
      className="w-full rounded-2xl p-4 flex items-center gap-4 text-left
        bg-gradient-to-r from-primary-600 to-primary-700
        hover:from-primary-700 hover:to-primary-800 transition-all
        shadow-lg active:scale-[0.98]"
    >
      <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shrink-0">
        📚
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-black text-base">{t('dashboard.startLessonTitle')}</p>
        <p className="text-white/80 text-xs">{t('dashboard.startLessonSubtitle')}</p>
      </div>
      <span className="text-white/90 font-bold text-sm bg-white/20 px-3 py-1.5 rounded-xl flex-shrink-0">
        {t('dashboard.startLessonButton')}
      </span>
    </button>
  )
}

function SpeakingPathCard() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [stats, setStats] = useState<SpeakingStats | null>(null)

  useEffect(() => {
    const uid = user?.id
    if (!uid) return
    let active = true
    getSpeakingStats(uid, getAllChunks())
      .then(s => { if (active) setStats(s) })
      .catch((e: unknown) => {
        monitoring.captureMessage('getSpeakingStats failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
      })
    return () => { active = false }
  }, [user?.id])

  const day = stats ? Math.min(stats.currentDay, TOTAL_SPEAKING_DAYS) : 0

  return (
    <button
      onClick={() => navigate('/speaking-path')}
      className="w-full rounded-2xl p-4 flex items-center gap-4 text-left
        bg-gradient-to-r from-rose-500 to-orange-500
        hover:from-rose-600 hover:to-orange-600 transition-all
        shadow-lg active:scale-[0.98]"
    >
      <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shrink-0">
        🗣️
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-black text-base">{t('dashboard.speakingPathTitle')}</p>
        {stats ? (
          <div className="flex items-center gap-2.5 text-white/85 text-xs font-semibold mt-0.5 flex-wrap">
            <span>{t('dashboard.speakingPathDay', { day, total: TOTAL_SPEAKING_DAYS })}</span>
            {stats.streakDays > 0 && <span>{t('dashboard.speakingPathStreak', { days: stats.streakDays })}</span>}
            <span>{t('dashboard.speakingPathMinutes', { minutes: stats.todayMinutes, target: 15 })}</span>
            {stats.dueCount > 0 && <span>{t('dashboard.speakingPathReview', { count: stats.dueCount })}</span>}
          </div>
        ) : (
          <p className="text-white/80 text-xs">{t('dashboard.speakingPathSubtitle')}</p>
        )}
      </div>
      <span className="text-white/90 font-bold text-sm bg-white/20 px-3 py-1.5 rounded-xl flex-shrink-0">
        {t('dashboard.speakingPathButton')}
      </span>
    </button>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. CEFR PROGRESS
// ═══════════════════════════════════════════════════════════════════════════

function CefrProgressCard() {
  const { t } = useI18n()
  const lessonProgress = useStore((s) => s.lessonProgress)
  const navigate = useNavigate()
  const { ref, isInView } = useInView()

  const levels = ['A0', 'A1', 'A2', 'B1', 'B1+', 'B2'] as const
  const levelColors: Record<string, string> = {
    A0: 'bg-gray-400',
    A1: 'bg-blue-500',
    A2: 'bg-teal-500',
    B1: 'bg-amber-500',
    'B1+': 'bg-orange-500',
    B2: 'bg-purple-600',
  }

  const levelData = levels.map((level) => {
    const levelLessons = LESSON_INDEX.filter((l) => l.level === level)
    const total = levelLessons.length
    const done = levelLessons.filter((l) => lessonProgress[l.id] !== undefined).length
    const pct = total > 0 ? Math.round((done / total) * 100) : 0
    return { level, total, done, pct }
  })

  const totalAll = levelData.reduce((s, d) => s + d.total, 0)
  const doneAll = levelData.reduce((s, d) => s + d.done, 0)
  const overallPct = totalAll > 0 ? Math.round((doneAll / totalAll) * 100) : 0

  return (
    <section ref={ref} className="card">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Target size={18} className="text-emerald-600" />
          <h3 className="font-bold text-gray-900 text-sm">{t('cefrProgress.title')}</h3>
        </div>
        <button
          onClick={() => navigate('/lesson')}
          className="text-xs text-primary-600 font-semibold flex items-center gap-0.5 hover:gap-1.5 transition-all"
        >
          {t('cefrProgress.viewAll')} <ChevronRight size={12} />
        </button>
      </div>

      <div className="flex items-center gap-3 mb-4 pb-3 border-b border-gray-50 dark:border-gray-700">
        <div className="flex-1">
          <div className="h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div
              className={`h-full bg-emerald-500 rounded-full transition-all duration-1000 ease-out`}
              style={{ width: `${isInView ? overallPct : 0}%` }}
            />
          </div>
        </div>
        <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">{doneAll}/{totalAll}</span>
      </div>

      <div className="space-y-2.5">
        {levelData.map(({ level, total, done, pct }, i) => (
          <div key={level} className="flex items-center gap-2.5">
            <span className="text-xs font-bold text-gray-500 dark:text-gray-400 w-8 flex-shrink-0">{level}</span>
            <div className="flex-1 h-2 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ease-out ${levelColors[level] ?? 'bg-gray-400'}`}
                style={{
                  width: `${isInView ? pct : 0}%`,
                  transitionDelay: `${isInView ? 150 + i * 80 : 0}ms`,
                }}
              />
            </div>
            <span className="text-xs font-medium text-gray-500 dark:text-gray-400 w-12 text-right flex-shrink-0">
              {done}/{total}
            </span>
          </div>
        ))}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. STORY BEAT CARD
// ═══════════════════════════════════════════════════════════════════════════

function StoryBeatCard() {
  const { t } = useI18n()
  const { currentDay } = useStore()
  const beat = getStoryBeat(currentDay)
  const act = resolveActDisplay(beat.act)
  const progress = Math.min(100, Math.round((currentDay / 126) * 100))

  const currentActIndex = STORY_BEATS.findIndex(b => b.act === beat.act)
  const actZoneStart = currentActIndex >= 0
    ? Math.round((STORY_BEATS[currentActIndex].dayRange[0] / 126) * 100)
    : 0
  const actZoneEnd = currentActIndex >= 0
    ? Math.round((STORY_BEATS[currentActIndex].dayRange[1] / 126) * 100)
    : 100

  const STOPS = [
    { day: 1,  label: 'Toshkent',  emoji: '🏠', x: 4 },
    { day: 27, label: 'A2 ✓',     emoji: '📚', x: 27 },
    { day: 55, label: 'B1 ✓',     emoji: '💼', x: 55 },
    { day: 78, label: 'B1+ ✓',    emoji: '✈️',  x: 78 },
    { day: 126, label: 'London',   emoji: '🏙️', x: 94 },
  ]

  return (
    <section className={`card border-l-4 overflow-hidden`}
      style={{ borderLeftColor: act.color }}>
      <div className="flex items-center gap-2 mb-4">
        <span className={`text-xs font-bold px-2 py-0.5 rounded-full text-white ${act.bgClass}`}>
          {act.emoji} {act.label}
        </span>
        <span className="text-xs font-medium text-gray-400">
          {beat.title}
        </span>
        <span className="text-xs text-gray-300">·</span>
        <span className="text-xs text-gray-400">
          {beat.location}
        </span>
      </div>

      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
        {beat.context}
      </p>

      <div className="relative pt-2 pb-7">
        <div
          className="absolute h-full rounded-full opacity-10 pointer-events-none"
          style={{
            left: `${actZoneStart}%`,
            width: `${actZoneEnd - actZoneStart}%`,
            backgroundColor: act.color,
            top: 0,
            bottom: 0,
          }}
        />

        <div className="relative h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full mx-2">
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(90deg, ${act.color}, ${act.color}cc)`,
            }}
          />

          <div
            className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10 transition-all duration-700"
            style={{ left: `${progress}%` }}
          >
            <div
              className="w-6 h-6 rounded-full border-2 border-white dark:border-gray-800 shadow-lg flex items-center justify-center"
              style={{ backgroundColor: act.color }}
            >
              <span className="text-xs">👤</span>
            </div>
          </div>
        </div>

        {STOPS.map(stop => {
          const reached = currentDay >= stop.day
          return (
            <div
              key={stop.day}
              className="absolute bottom-0 flex flex-col items-center gap-0.5 transition-all duration-300"
              style={{ left: `calc(${stop.x}% + 8px)`, transform: 'translateX(-50%)' }}
            >
              <div
                className={`w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-300
                  ${reached ? 'shadow-sm' : 'opacity-60'}`}
                style={{ backgroundColor: reached ? act.color : '#e5e7eb' }}
              >
                <span className="text-xs leading-none">{stop.emoji}</span>
              </div>
              <span className={`text-xs font-semibold whitespace-nowrap
                ${reached ? `${act.textClass}` : 'text-gray-400 dark:text-gray-500'}`}>
                {stop.label}
              </span>
              <span className={`text-[8px] whitespace-nowrap
                ${reached ? 'text-gray-400' : 'text-gray-300 dark:text-gray-600'}`}>
                {t('dashboard.storyBeatDay', { day: stop.day })}
              </span>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between text-xs text-gray-400 mt-1 pt-2 border-t border-gray-50 dark:border-gray-700">
        <span>{t('dashboard.storyBeatProgress', { pct: progress })}</span>
        <span className="font-medium text-gray-500 dark:text-gray-400">
          {t('dashboard.storyBeatDay', { day: currentDay })}
        </span>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOT DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════

// Bo'lim sarlavhasi — yengil, izchil ierarxiya uchun
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1 pt-1">
      {children}
    </p>
  )
}

export default function Dashboard() {
  const { t } = useI18n()
  const navigate = useNavigate()
  const { fetchAndSetLessons } = useStore()
  const handleWeakSpotsLoaded = useCallback((_spots: QuickWeakSpot[]) => {}, [])
  const { pendingOpponentDuels, loadDuels } = useTandemStore()
  const [activeTab, setActiveTab] = useState<'today' | 'all'>('today')

  useEffect(() => {
    fetchAndSetLessons()
    loadDuels()
  }, [fetchAndSetLessons, loadDuels])

  return (
    <div className="flex flex-col h-full">
      <TopBar />
      <div className="flex-1 overflow-y-auto scrollbar-hide mobile-safe-bottom">
        <div className="p-3 sm:p-5 space-y-3 sm:space-y-4 max-w-3xl mx-auto">
          {/* Pending duel banner */}
          {pendingOpponentDuels.length > 0 && (
            <button
              onClick={() => navigate('/tandem')}
              className="w-full flex items-center gap-3 p-3 sm:p-4 rounded-2xl bg-gradient-to-r from-rose-50 to-orange-50 dark:from-rose-950/30 dark:to-orange-950/20 border border-rose-200 dark:border-rose-800/50 text-left hover:shadow-md active:scale-[0.98] transition-all group"
            >
              <div className="w-10 h-10 rounded-xl bg-rose-100 dark:bg-rose-900/40 flex items-center justify-center flex-shrink-0">
                <span className="text-lg">⚔️</span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-sm text-rose-800 dark:text-rose-200">
                  {t('dashboard.duelTitle', { count: pendingOpponentDuels.length })}
                </p>
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
                  {t('dashboard.duelSubtitle')}
                </p>
              </div>
              <span className="text-sm text-rose-600 dark:text-rose-400 font-semibold group-hover:gap-1.5 transition-all flex items-center gap-0.5 flex-shrink-0">
                {t('dashboard.duelButton')} <ChevronRight size={15} />
              </span>
            </button>
          )}

          {/* Bildirishnomalar — faqat kerak bo'lganda ko'rinadi */}
          <StreakWarning />
          <ReviewReminder />

          {/* ── Tab bar ── */}
          <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl">
            <button
              onClick={() => setActiveTab('today')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'today'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              📖 {t('dashboard.tabToday')}
            </button>
            <button
              onClick={() => setActiveTab('all')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-semibold transition-all ${
                activeTab === 'all'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              📋 {t('dashboard.tabAll')}
            </button>
          </div>

          {activeTab === 'today' ? (
            <>
              {/* ── Bugungi dars — asosiy ── */}
              <StartLessonButton />
              <SpeakingPathCard />
              <TodayProgress />
              <CefrProgressCard />
              <SectionLabel>{t('dashboard.sectionToday')}</SectionLabel>
              <LessonProgressCard />
              <ReviewOverview />
              <GrammarSrsCard />
            </>
          ) : (
            <>
              {/* ── Barchasi — to'liq dashboard ── */}
              <StartLessonButton />
              <SpeakingPathCard />
              <TodayProgress />
              <CefrProgressCard />
              <SectionLabel>{t('dashboard.sectionToday')}</SectionLabel>
              <LessonProgressCard />
              <ReviewOverview />
              <GrammarSrsCard />
              <SectionLabel>{t('dashboard.sectionRecommended')}</SectionLabel>
              <WeakSpotsWidget onSpotsLoaded={handleWeakSpotsLoaded} />
              <AdaptivePlan />
              <AiInsightsWidget />
              <TandemCard />
              <DailyIdiomCard />
              <ConfusablePairsCard />
              <StoryBeatCard />
              <ProgressMap />
            </>
          )}
        </div>
      </div>
    </div>
  )
}
