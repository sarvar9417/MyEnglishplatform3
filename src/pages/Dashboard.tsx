import { useEffect, useCallback, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../store/useStore'
import { useAuth } from '../hooks/useAuth'
import { useProgress } from '../hooks/useProgress'
import { useTandemStore } from '../store/tandemSlice'
import { getSpeakingStats, type SpeakingStats } from '../services/speakingPathService'
import { getAllChunks, TOTAL_SPEAKING_DAYS } from '../data/speakingPath'
import {
  BookOpen, BookMarked, Headphones, PenLine,
  BookText, Mic, Sun, ChevronRight, ChevronDown, LogOut, MessageCircle,
} from 'lucide-react'
import AiInsightsWidget from '../components/dashboard/AiInsightsWidget'
import TandemCard from '../components/dashboard/TandemCard'
import ConfusablePairsCard from '../components/dashboard/ConfusablePairsCard'
import { ReviewOverview } from './GrammarReview'
import StreakWarning from '../components/notifications/StreakWarning'
import ReviewReminder from '../components/notifications/ReviewReminder'
import WeakSpotsWidget from '../components/dashboard/WeakSpotsWidget'
import AdaptivePlan from '../components/dashboard/AdaptivePlan'
import ProgressMap from '../components/dashboard/ProgressMap'
import { IDIOMS } from '../data/idioms'
import type { QuickWeakSpot } from '../services/analyticsService'
import { getStoryBeat, ACT_DISPLAY, STORY_BEATS } from '../data/narrative/storyline'
import { AVATARS } from '../components/ui/AvatarSelector'

// ═══════════════════════════════════════════════════════════════════════════
// 1. TOP BAR
// ═══════════════════════════════════════════════════════════════════════════

function TopBar() {
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
    hour < 12 ? 'Xayrli tong' :
    hour < 18 ? 'Xayrli kun'  : 'Xayrli kech'

  return (
    <header className="bg-white border-b border-gray-100 px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between flex-shrink-0 gap-2">
      <div className="min-w-0">
        <p className="text-xs text-gray-400 font-medium">{greeting}</p>
        <h1 className="text-sm sm:text-base font-bold text-gray-900 leading-tight truncate flex items-center gap-1.5">
          <span className="text-lg">{AVATARS.find(a => a.id === avatarId)?.emoji ?? '👤'}</span>
          {userName || 'Foydalanuvchi'} 👋
        </h1>
      </div>

      <div className={`flex items-center gap-1 px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-full border font-semibold text-[11px] sm:text-sm flex-shrink-0 ${levelColor}`}>
        <span>{currentLevel}</span>
        <span className="text-xs opacity-60 hidden sm:inline">·</span>
        <span className="text-xs font-medium opacity-80 hidden sm:inline">{currentWeek}-hafta</span>
        <span className="text-xs opacity-60 hidden sm:inline">·</span>
        <span className="text-xs font-medium opacity-80">{dayInWeek}-kun</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className="text-base sm:text-lg leading-none">🔥</span>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-tight">{streak} kun</p>
            <p className="text-[11px] text-gray-400">streak</p>
          </div>
          <span className="text-xs font-bold text-gray-900 sm:hidden">{streak}</span>
        </div>
        <div className="h-7 w-px bg-gray-100 hidden sm:block" />
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-gray-900 leading-tight">{daysLeft} kun</p>
          <p className="text-[11px] text-gray-400">maqsadgacha</p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="text-base leading-none">📚</span>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-tight">{totalWordsLearned}</p>
            <p className="text-[11px] text-gray-400">jami so'z</p>
          </div>
        </div>
        <div className="h-7 w-px bg-gray-100" />
        <button
          onClick={signOut}
          title="Chiqish"
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
  const SIZE = typeof window !== 'undefined' && window.innerWidth < 640 ? 72 : 96
  const R    = SIZE === 72 ? 28 : 38
  const C    = 2 * Math.PI * R
  const offset = C * (1 - Math.min(pct, 100) / 100)

  return (
    <button onClick={onClick} className="flex flex-col items-center gap-1.5 sm:gap-2.5 transition-transform hover:scale-105 active:scale-95 focus:outline-none" aria-label={`${label} bo'limiga o'tish`}>
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
        <p className="text-[11px] sm:text-xs font-semibold text-gray-700">{label}</p>
        <p className="text-[11px] sm:text-xs text-gray-400">{hours}</p>
      </div>
    </button>
  )
}

function TodayProgress() {
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
      key: 'grammar', label: 'Grammar',    hours: '3 soat', route: '/grammar',
      pct: gPct,
      stroke: '#1a56db', track: '#dbeafe',
      Icon: BookOpen, iconColor: 'text-primary-600',
    },
    {
      key: 'vocab', label: "Lug'at",       hours: '2 soat', route: '/vocabulary',
      pct: vPct,
      stroke: '#0f766e', track: '#ccfbf1',
      Icon: BookMarked, iconColor: 'text-b1-600',
    },
    {
      key: 'listening', label: 'Listening', hours: '2 soat', route: '/listening',
      pct: lPct,
      stroke: '#f97316', track: '#ffedd5',
      Icon: Headphones, iconColor: 'text-orange-500',
    },
    {
      key: 'reading', label: 'Reading',     hours: '1.5 soat', route: '/reading',
      pct: rPct,
      stroke: '#06b6d4', track: '#cffafe',
      Icon: BookText, iconColor: 'text-cyan-600',
    },
    {
      key: 'speaking', label: 'Speaking',   hours: '1.5 soat', route: '/speaking',
      pct: sPct,
      stroke: '#e11d48', track: '#ffe4e6',
      Icon: Mic, iconColor: 'text-rose-500',
    },
    {
      key: 'writing', label: 'Writing',     hours: '2 soat', route: '/writing',
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
          <h2 className="font-bold text-gray-900 text-sm">Bugungi Skill Progress</h2>
          <p className="text-xs text-gray-400 mt-0.5">Har bir ko'nikmaga bosing → mashq qiling</p>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${avgColor}`}>
          O'rtacha {avg}%
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
          <h3 className="font-bold text-gray-900 text-sm">Kunlik Darslar</h3>
        </div>
        <button
          onClick={() => navigate('/lesson')}
          className="text-xs text-primary-600 font-semibold flex items-center gap-0.5 hover:gap-1.5 transition-all"
        >
          Barchasi <ChevronRight size={12} />
        </button>
      </div>

      <div className="flex items-center gap-4 mb-3 pb-3 border-b border-gray-50">
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500">Bajarildi:</span>
          <span className="font-bold text-gray-900">{completed}/{pcts.length}</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-gray-500">O'rtacha:</span>
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
              <span className={`text-[11px] font-bold ml-auto ${
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
            <span className="text-[11px] font-bold uppercase tracking-wider text-yellow-600 dark:text-yellow-400">
              Kunning Idiomasi
            </span>
            <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full flex-shrink-0 ${
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
            <span>Barcha idiomalar →</span>
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
        <p className="text-white font-black text-base">Bugungi Dars</p>
        <p className="text-white/80 text-xs">Grammatika, lug'at va ko'nikmalar</p>
      </div>
      <span className="text-white/90 font-bold text-sm bg-white/20 px-3 py-1.5 rounded-xl flex-shrink-0">
        Boshlash →
      </span>
    </button>
  )
}

function SpeakingPathCard() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [stats, setStats] = useState<SpeakingStats | null>(null)

  useEffect(() => {
    const uid = user?.id
    if (!uid) return
    let active = true
    getSpeakingStats(uid, getAllChunks())
      .then(s => { if (active) setStats(s) })
      .catch(() => {})
    return () => { active = false }
  }, [user?.id])

  const day = stats ? Math.min(stats.currentDay, TOTAL_SPEAKING_DAYS) : null

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
        <p className="text-white font-black text-base">Gapirish Yo'li</p>
        {stats ? (
          <div className="flex items-center gap-2.5 text-white/85 text-xs font-semibold mt-0.5 flex-wrap">
            <span>Kun {day}/{TOTAL_SPEAKING_DAYS}</span>
            {stats.streakDays > 0 && <span>🔥 {stats.streakDays} kun</span>}
            <span>🎙️ {stats.todayMinutes}/15 daq</span>
            {stats.dueCount > 0 && <span>🔁 {stats.dueCount} takror</span>}
          </div>
        ) : (
          <p className="text-white/80 text-xs">0 dan suhbatgacha — har kuni 15 daqiqa</p>
        )}
      </div>
      <span className="text-white/90 font-bold text-sm bg-white/20 px-3 py-1.5 rounded-xl flex-shrink-0">
        Boshlash →
      </span>
    </button>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. STORY BEAT CARD
// ═══════════════════════════════════════════════════════════════════════════

function StoryBeatCard() {
  const { currentDay } = useStore()
  const beat = getStoryBeat(currentDay)
  const act = ACT_DISPLAY[beat.act] ?? ACT_DISPLAY.prologue
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
        <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full text-white ${act.bgClass}`}>
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
              <span className="text-[11px]">👤</span>
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
              <span className={`text-[11px] font-semibold whitespace-nowrap
                ${reached ? `${act.textClass}` : 'text-gray-400 dark:text-gray-500'}`}>
                {stop.label}
              </span>
              <span className={`text-[8px] whitespace-nowrap
                ${reached ? 'text-gray-400' : 'text-gray-300 dark:text-gray-600'}`}>
                Kun {stop.day}
              </span>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between text-[11px] text-gray-400 mt-1 pt-2 border-t border-gray-50 dark:border-gray-700">
        <span>🏁 {progress}% yakunlandi</span>
        <span className="font-medium text-gray-500 dark:text-gray-400">
          Kun {currentDay}/126
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
    <p className="text-[11px] font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider px-1 pt-1">
      {children}
    </p>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const { fetchAndSetLessons } = useStore()
  const handleWeakSpotsLoaded = useCallback((_spots: QuickWeakSpot[]) => {}, [])
  const { pendingOpponentDuels, loadDuels } = useTandemStore()
  const [showMore, setShowMore] = useState(false)

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
                  Sizni {pendingOpponentDuels.length} ta duel kutmoqda!
                </p>
                <p className="text-xs text-rose-600 dark:text-rose-400 mt-0.5">
                  Javob berish uchun 24 soat vaqtingiz bor
                </p>
              </div>
              <span className="text-sm text-rose-600 dark:text-rose-400 font-semibold group-hover:gap-1.5 transition-all flex items-center gap-0.5 flex-shrink-0">
                Tandem <ChevronRight size={15} />
              </span>
            </button>
          )}

          {/* Bildirishnomalar — faqat kerak bo'lganda ko'rinadi */}
          <StreakWarning />
          <ReviewReminder />

          {/* ── 1. Asosiy harakat ── */}
          <StartLessonButton />

          {/* Gapirish Yo'li — 0 dan suhbatgacha */}
          <SpeakingPathCard />

          {/* ── 2. Ko'nikma halqalari ── */}
          <TodayProgress />

          {/* ── 3. Bugun ── */}
          <SectionLabel>Bugun</SectionLabel>
          <LessonProgressCard />
          <ReviewOverview />

          {/* ── 4. Tavsiya ── */}
          <SectionLabel>Tavsiya</SectionLabel>
          <WeakSpotsWidget onSpotsLoaded={handleWeakSpotsLoaded} />
          <AdaptivePlan />
          <AiInsightsWidget />

          {/* ── 5. Ko'proq (yig'iladigan ikkilamchi) ── */}
          <div className="pt-1">
            <button
              onClick={() => setShowMore(v => !v)}
              className="w-full flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-sm font-semibold text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
            >
              {showMore ? 'Kamroq ko\'rsatish' : 'Ko\'proq'}
              <ChevronDown size={16} className={`transition-transform ${showMore ? 'rotate-180' : ''}`} />
            </button>
            {showMore && (
              <div className="space-y-3 sm:space-y-4 mt-2 animate-slide-up">
                <TandemCard />
                <DailyIdiomCard />
                <ConfusablePairsCard />
                <StoryBeatCard />
                <ProgressMap />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
