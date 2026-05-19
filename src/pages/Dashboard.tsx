import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStore, type DailyChecklist } from '../store/useStore'
import { useAuth } from '../hooks/useAuth'
import { useProgress } from '../hooks/useProgress'
import { supabase } from '../db/supabase'
import { getTodayTashkent } from '../utils/tashkentDate'
import {
  BookOpen, BookMarked, Headphones, PenLine,
  BookText, Mic, CheckSquare, Square,
  Flame, Zap, Star, BookCopy, Sun,
  Play, Pause, ChevronRight, LogOut,
} from 'lucide-react'


// ═══════════════════════════════════════════════════════════════════════════
// 1. TOP BAR
// ═══════════════════════════════════════════════════════════════════════════

function TopBar() {
  const { currentLevel, currentWeek, currentDay, streak: localStreak, targetDate, userName: localName } = useStore()
  const { displayName, signOut } = useAuth()
  const { dbStreak } = useProgress()

  const userName = displayName || localName
  const streak   = dbStreak   || localStreak

  // hafta ichidagi kun: 1–7
  const dayInWeek = ((currentDay - 1) % 7) + 1

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
    <header className="bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between flex-shrink-0">
      {/* Left: greeting */}
      <div>
        <p className="text-xs text-gray-400 font-medium">{greeting}</p>
        <h1 className="text-base font-bold text-gray-900 leading-tight">
          {userName || 'Foydalanuvchi'} 👋
        </h1>
      </div>

      {/* Center: level pill */}
      <div className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border font-semibold text-sm ${levelColor}`}>
        <span>{currentLevel}</span>
        <span className="text-xs opacity-60">·</span>
        <span className="text-xs font-medium opacity-80">{currentWeek}-hafta</span>
        <span className="text-xs opacity-60">·</span>
        <span className="text-xs font-medium opacity-80">{dayInWeek}-kun</span>
      </div>

      {/* Right: streak + days left + sign out */}
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-1.5">
          <span className="text-lg leading-none">🔥</span>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-tight">{streak} kun</p>
            <p className="text-[10px] text-gray-400">streak</p>
          </div>
        </div>
        <div className="h-7 w-px bg-gray-100" />
        <div className="text-right">
          <p className="text-sm font-bold text-gray-900 leading-tight">{daysLeft} kun</p>
          <p className="text-[10px] text-gray-400">maqsadgacha</p>
        </div>
        <div className="h-7 w-px bg-gray-100" />
        <button
          onClick={signOut}
          title="Chiqish"
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut size={16} />
        </button>
      </div>
    </header>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// 2. TODAY PROGRESS — 4 skill rings
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
}

function SkillRing({ pct, stroke, track, label, hours, Icon, iconColor }: RingConfig) {
  const SIZE = 96
  const R    = 38
  const C    = 2 * Math.PI * R
  const offset = C * (1 - Math.min(pct, 100) / 100)

  return (
    <div className="flex flex-col items-center gap-2.5">
      <div className="relative" style={{ width: SIZE, height: SIZE }}>
        {/* Background glow when >80% */}
        {pct >= 80 && (
          <div
            className="absolute inset-0 rounded-full opacity-20 blur-md"
            style={{ background: stroke }}
          />
        )}
        <svg width={SIZE} height={SIZE} className="-rotate-90 relative z-10">
          <circle cx={SIZE/2} cy={SIZE/2} r={R} fill="none" stroke={track}  strokeWidth={9} />
          <circle
            cx={SIZE/2} cy={SIZE/2} r={R} fill="none"
            stroke={stroke} strokeWidth={9} strokeLinecap="round"
            strokeDasharray={C} strokeDashoffset={offset}
            style={{ transition: 'stroke-dashoffset 0.7s cubic-bezier(0.34,1.56,0.64,1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center z-10">
          <Icon size={14} className={iconColor} />
          <span className="text-sm font-bold text-gray-800 mt-0.5 leading-none">
            {Math.round(pct)}%
          </span>
        </div>
      </div>
      <div className="text-center">
        <p className="text-xs font-semibold text-gray-700">{label}</p>
        <p className="text-[10px] text-gray-400">{hours}</p>
      </div>
    </div>
  )
}

function TodayProgress() {
  const { todayGrammarPct, todayVocabPct, todayListeningPct, todayReadingPct, todaySpeakingPct, todayWritingPct } = useStore()
  const { todayProgress } = useProgress()

  const gPct = todayProgress?.grammar_pct   ?? todayGrammarPct
  const vPct = todayProgress?.vocab_pct     ?? todayVocabPct
  const lPct = todayProgress?.listening_pct ?? todayListeningPct
  const wPct = todayProgress?.writing_pct   ?? todayWritingPct

  const rings: RingConfig[] = [
    {
      key: 'grammar', label: 'Grammar',    hours: '3 soat',
      pct: gPct,
      stroke: '#1a56db', track: '#dbeafe',
      Icon: BookOpen, iconColor: 'text-primary-600',
    },
    {
      key: 'vocab', label: "Lug'at",       hours: '2 soat',
      pct: vPct,
      stroke: '#0f766e', track: '#ccfbf1',
      Icon: BookMarked, iconColor: 'text-b1-600',
    },
    {
      key: 'listening', label: 'Listening', hours: '2 soat',
      pct: lPct,
      stroke: '#f97316', track: '#ffedd5',
      Icon: Headphones, iconColor: 'text-orange-500',
    },
    {
      key: 'reading', label: 'Reading',     hours: '1.5 soat',
      pct: todayReadingPct,
      stroke: '#06b6d4', track: '#cffafe',
      Icon: BookText, iconColor: 'text-cyan-600',
    },
    {
      key: 'speaking', label: 'Speaking',   hours: '1.5 soat',
      pct: todaySpeakingPct,
      stroke: '#e11d48', track: '#ffe4e6',
      Icon: Mic, iconColor: 'text-rose-500',
    },
    {
      key: 'writing', label: 'Writing',     hours: '2 soat',
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
          <p className="text-xs text-gray-400 mt-0.5">4 soha — parallel rivojlanish</p>
        </div>
        <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${avgColor}`}>
          O'rtacha {avg}%
        </span>
      </div>
      <div className="grid grid-cols-6 gap-2">
        {rings.map((r) => <SkillRing key={r.key} pct={r.pct} stroke={r.stroke} track={r.track} label={r.label} hours={r.hours} Icon={r.Icon} iconColor={r.iconColor} />)}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// 3. TIME TRACKER — real-time soat + progress bar
// ═══════════════════════════════════════════════════════════════════════════

function useRealTimeClock() {
  const { todayMinutes } = useStore()
  const [seconds, setSeconds] = useState(0)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => setSeconds((s) => s + 1), 1000)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [running])

  const total = todayMinutes * 60 + seconds

  const fmt = (sec: number) => {
    const h = Math.floor(sec / 3600)
    const m = Math.floor((sec % 3600) / 60)
    const s = sec % 60
    return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }

  return { total, display: fmt(total), running, setRunning }
}

function TimeTracker() {
  const navigate = useNavigate()
  const { dailyGoalMinutes, setTodayMinutes, addXP, incrementStreak } = useStore()
  const { total, display, running, setRunning } = useRealTimeClock()
  const totalRef = useRef(total)
  totalRef.current = total

  const goalSeconds = dailyGoalMinutes * 60
  const pct = Math.min(100, (total / goalSeconds) * 100)

  // Progress bar rengi: yashil → sariq → qizil (maqsadga yaqinlashganda)
  // 0–40%: yashil (boshlang'ich), 40–75%: sariq (o'rta), 75–100%: ko'k (maqsadga yaqin), 100%+: zangori
  const barColor =
    pct >= 100 ? 'from-b1-400 to-b1-600'      :
    pct >= 75  ? 'from-primary-400 to-primary-600' :
    pct >= 40  ? 'from-yellow-400 to-orange-500'   :
                 'from-green-400 to-emerald-500'

  const goalDisplay = `${String(Math.floor(goalSeconds / 3600)).padStart(2, '0')}:00:00`

  // Har daqiqada store va Supabase ga yozish
  useEffect(() => {
    if (!running) return
    const id = setInterval(async () => {
      const newMinutes = Math.floor(totalRef.current / 60) + 1
      setTodayMinutes(newMinutes)
      addXP(2)
      incrementStreak()

      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) return
        const today = getTodayTashkent()
        await supabase.from('daily_progress').upsert(
          {
            user_id:       session.user.id,
            date:          today,
            total_minutes: newMinutes,
          },
          { onConflict: 'user_id,date' }
        )
      } catch { /* ignore network errors */ }
    }, 60_000)
    return () => clearInterval(id)
  }, [running, setTodayMinutes, addXP, incrementStreak])

  const remainSec = Math.max(0, goalSeconds - total)
  const remH = Math.floor(remainSec / 3600)
  const remM = Math.floor((remainSec % 3600) / 60)

  return (
    <section className="card flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-gray-900 text-sm">Vaqt Tracker</h2>
        {pct >= 100
          ? <span className="badge badge-b1">Maqsad bajarildi 🎉</span>
          : <span className="text-xs text-gray-400 font-mono">{remH}s {remM}d qoldi</span>
        }
      </div>

      {/* Real-time soat */}
      <div className="text-center py-3">
        <div className="inline-flex items-baseline gap-2">
          <span className="text-4xl font-mono font-bold tracking-tight text-gray-900 tabular-nums">
            {display}
          </span>
          <span className="text-lg font-mono text-gray-300 font-light">/ {goalDisplay}</span>
        </div>
        <p className="text-xs text-gray-400 mt-1">
          {pct >= 100 ? '✅ Kunlik maqsad — BAJARILDI!' : `Bugungi o'quv vaqti`}
        </p>
      </div>

      {/* Progress bar: yashil → sariq → qizil */}
      <div className="relative">
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${barColor} transition-all duration-1000 ease-linear relative overflow-hidden`}
            style={{ width: `${pct}%` }}
          >
            {/* shimmer */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_ease-in-out_infinite]" />
          </div>
        </div>
        {/* 25%, 50%, 75% markers */}
        {[25, 50, 75].map((mark) => (
          <div
            key={mark}
            className="absolute top-0 bottom-0 w-px bg-white/60"
            style={{ left: `${mark}%` }}
          />
        ))}
      </div>

      {/* Foiz va milestone */}
      <div className="flex justify-between text-[10px] text-gray-400 -mt-1 px-0.5">
        <span>0</span>
        <span>3:30</span>
        <span>7:00</span>
        <span>10:30</span>
        <span>14:00</span>
      </div>

      {/* Tugmalar */}
      <div className="flex gap-3 mt-1">
        <button
          onClick={() => setRunning((r) => !r)}
          className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm transition-all
            ${running
              ? 'bg-orange-100 text-orange-700 hover:bg-orange-200'
              : 'bg-primary-600 text-white hover:bg-primary-700 shadow-sm hover:shadow-md'
            }`}
        >
          {running
            ? <><Pause size={16} /> Pauza</>
            : <><Play  size={16} /> Darsni davom ettir</>
          }
        </button>
        <button
          onClick={() => navigate('/lesson')}
          className="flex items-center gap-1.5 px-4 py-3 rounded-xl bg-gray-100
            hover:bg-gray-200 text-gray-700 font-medium text-sm transition-colors"
        >
          Darslar <ChevronRight size={15} />
        </button>
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// 4. TODAY PLAN — chek-list
// ═══════════════════════════════════════════════════════════════════════════

interface PlanItem {
  key:     keyof DailyChecklist
  label:   string
  detail:  string
  hours:   string
  xp:      number
  Icon:    typeof BookOpen
  color:   string
  bgDone:  string
}

const PLAN_ITEMS: PlanItem[] = [
  {
    key: 'grammar',    label: 'Grammar',    detail: 'Conditionals (if I, II, III)',
    hours: '3 soat',   xp: 150,
    Icon: BookOpen,   color: 'text-primary-600', bgDone: 'bg-primary-50',
  },
  {
    key: 'vocabulary', label: 'Vocabulary', detail: "100 ta yangi so'z (Anki)",
    hours: '2 soat',   xp: 100,
    Icon: BookMarked, color: 'text-b1-600',      bgDone: 'bg-b1-50',
  },
  {
    key: 'listening',  label: 'Listening',  detail: 'BBC 6 Minute + Shadowing',
    hours: '2 soat',   xp: 100,
    Icon: Headphones, color: 'text-orange-500',  bgDone: 'bg-orange-50',
  },
  {
    key: 'reading',    label: 'Reading',    detail: '2 ta B1 matn + comprehension',
    hours: '1.5 soat', xp: 75,
    Icon: BookText,   color: 'text-cyan-600',    bgDone: 'bg-cyan-50',
  },
  {
    key: 'writing',    label: 'Writing',    detail: 'Essay: 200 so\'z, B1 topic',
    hours: '2 soat',   xp: 100,
    Icon: PenLine,    color: 'text-b2-600',      bgDone: 'bg-b2-50',
  },
  {
    key: 'speaking',   label: 'Speaking',   detail: 'Italki tutor bilan suhbat',
    hours: '1.5 soat', xp: 75,
    Icon: Mic,        color: 'text-rose-500',    bgDone: 'bg-rose-50',
  },
]

function TodayPlan() {
  const { todayChecklist, toggleChecklistItem, addXP } = useStore()

  const doneCount = Object.values(todayChecklist).filter(Boolean).length
  const totalXP   = PLAN_ITEMS.filter((i) => todayChecklist[i.key]).reduce((s, i) => s + i.xp, 0)
  const totalHrs  = 12  // 3+2+2+1.5+2+1.5

  const handleToggle = (item: PlanItem) => {
    const wasDone = todayChecklist[item.key]
    toggleChecklistItem(item.key)
    if (!wasDone) addXP(item.xp)
  }

  return (
    <section className="card flex flex-col gap-0">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="font-bold text-gray-900 text-sm">Bugungi Plan</h2>
          <p className="text-[10px] text-gray-400 mt-0.5">
            {totalHrs} soat · +{totalXP} XP qo'shildi
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-gray-700">{doneCount}/{PLAN_ITEMS.length}</span>
          <div className="flex gap-1">
            {PLAN_ITEMS.map((item) => (
              <div
                key={item.key}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  todayChecklist[item.key] ? 'bg-b1-500 scale-110' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Mini progress strip */}
      <div className="h-1.5 bg-gray-100 rounded-full mb-4 overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-primary-500 to-b1-500 rounded-full transition-all duration-500"
          style={{ width: `${(doneCount / PLAN_ITEMS.length) * 100}%` }}
        />
      </div>

      {/* Items */}
      <div className="space-y-1.5">
        {PLAN_ITEMS.map((item) => {
          const done = todayChecklist[item.key]
          return (
            <button
              key={item.key}
              onClick={() => handleToggle(item)}
              className={`w-full flex items-center gap-3 px-3.5 py-3 rounded-xl
                text-left transition-all duration-200 group
                ${done ? item.bgDone : 'hover:bg-gray-50 active:bg-gray-100'}`}
            >
              {/* Checkbox */}
              <div className={`flex-shrink-0 transition-transform duration-200 ${done ? 'scale-110' : 'group-hover:scale-105'}`}>
                {done
                  ? <CheckSquare size={18} className="text-b1-500" />
                  : <Square      size={18} className="text-gray-300" />
                }
              </div>

              {/* Icon */}
              <item.Icon
                size={15}
                className={`flex-shrink-0 ${done ? item.color : 'text-gray-400'}`}
              />

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-semibold leading-tight truncate
                  ${done ? 'line-through text-gray-400' : 'text-gray-800'}`}>
                  {item.label}
                  <span className={`ml-1.5 font-normal text-xs ${done ? 'text-gray-400' : 'text-gray-500'}`}>
                    {item.detail}
                  </span>
                </p>
              </div>

              {/* Right meta */}
              <div className="flex-shrink-0 flex flex-col items-end gap-0.5">
                <span className={`text-[10px] font-medium ${done ? 'text-b1-500' : 'text-gray-400'}`}>
                  {done ? `+${item.xp} XP` : item.hours}
                </span>
              </div>
            </button>
          )
        })}
      </div>

      {/* Footer */}
      {doneCount === PLAN_ITEMS.length && (
        <div className="mt-4 py-3 bg-gradient-to-r from-b1-50 to-primary-50
          border border-b1-100 rounded-xl text-center">
          <p className="text-sm font-bold text-b1-700">🎉 Barcha vazifalar bajarildi!</p>
          <p className="text-xs text-b1-500 mt-0.5">+{totalXP} XP qo'shildi bugun</p>
        </div>
      )}
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// 5. QUICK STATS
// ═══════════════════════════════════════════════════════════════════════════

function QuickStats() {
  const { totalWordsLearned, todayXP, lastMock: localMock, streak: localStreak } = useStore()
  const { lastMockTest, dbStreak } = useProgress()

  const streak = dbStreak || localStreak

  const mockValue = lastMockTest
    ? `${lastMockTest.type} (${lastMockTest.score}%)`
    : localMock
    ? `${localMock.level} (${localMock.score}%)`
    : '—'
  const mockSub = (lastMockTest || localMock) ? 'oxirgi natija' : 'hali topshirilmagan'

  const stats = [
    {
      label:   'Jami so\'zlar',
      value:   totalWordsLearned.toLocaleString(),
      sub:     "o'rganilgan",
      Icon:    BookCopy,
      color:   'text-b1-600',
      bg:      'bg-b1-50',
      border:  'border-b1-100',
    },
    {
      label:   'Bugungi XP',
      value:   `+${todayXP}`,
      sub:     'ball olindi',
      Icon:    Zap,
      color:   'text-yellow-600',
      bg:      'bg-yellow-50',
      border:  'border-yellow-100',
    },
    {
      label:   'Mock Test',
      value:   mockValue,
      sub:     mockSub,
      Icon:    Star,
      color:   'text-b2-600',
      bg:      'bg-b2-50',
      border:  'border-b2-100',
    },
    {
      label:   'Streak',
      value:   `${streak}`,
      sub:     'ketma-ket kun',
      Icon:    Flame,
      color:   'text-orange-600',
      bg:      'bg-orange-50',
      border:  'border-orange-100',
    },
  ]

  return (
    <section className="grid grid-cols-4 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className={`card ${s.bg} border ${s.border} flex items-center gap-3 py-3.5`}
        >
          <div className={`w-10 h-10 rounded-xl ${s.bg} border ${s.border} flex items-center justify-center flex-shrink-0`}>
            <s.Icon size={20} className={s.color} />
          </div>
          <div className="min-w-0">
            <p className="text-lg font-bold text-gray-900 leading-tight truncate">{s.value}</p>
            <p className="text-[10px] text-gray-500 leading-tight">{s.label}</p>
            <p className="text-[10px] text-gray-400">{s.sub}</p>
          </div>
        </div>
      ))}
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// 6. LESSON PROGRESS (kunlik darslar)
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
          onClick={() => navigate('/daily-lesson')}
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
            onClick={() => navigate('/daily-lesson')}
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
          </button>
        ))}
      </div>
    </section>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// ROOT DASHBOARD
// ═══════════════════════════════════════════════════════════════════════════

export default function Dashboard() {
  return (
    <div className="flex flex-col h-full">
      {/* 1. TopBar — sticky */}
      <TopBar />

      {/* Scroll area */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-5 space-y-4 max-w-5xl mx-auto">

          {/* 2. Skill progress rings */}
          <TodayProgress />

          {/* 3. Daily lesson progress */}
          <LessonProgressCard />

          {/* 4. Time tracker + 5. Today plan — side by side */}
          <div className="grid grid-cols-5 gap-4">
            <div className="col-span-2">
              <TimeTracker />
            </div>
            <div className="col-span-3">
              <TodayPlan />
            </div>
          </div>

          {/* 6. Quick stats */}
          <QuickStats />
        </div>
      </div>
    </div>
  )
}
