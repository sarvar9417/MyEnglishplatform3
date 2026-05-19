import { useEffect, useState } from 'react'
import { BarChart2, Award, Flame, TrendingUp } from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine, Legend,
} from 'recharts'
import { db, type DailyProgress, type MockTest } from '@/db/database'
import { useStore } from '@/store/useStore'

// ── Types ─────────────────────────────────────────────────────────────────────

interface DayData {
  date:         string
  label:        string   // "Kun N" or short date
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
  mockScore:    number   // 0 = no test
  hasReal:      boolean
}

// ── Seeded sample data (fills empty days so charts look meaningful) ────────────

const HOUR_PATTERN = [9, 12, 13, 14, 11, 14, 8, 13, 14, 10, 12, 14, 11, 13, 14, 9, 12, 14]
const WORD_PATTERN = [8, 12, 15, 10, 18, 14, 6, 12, 16, 11, 9, 14, 18, 10, 12, 15, 13, 8]
const SKILL_PATTERNS = {
  grammar:   [70, 80, 75, 85, 60, 90, 50, 80, 85, 75, 70, 80, 90, 65, 80, 85, 75, 90],
  vocab:     [60, 75, 80, 70, 85, 65, 90, 70, 75, 80, 85, 60, 75, 90, 65, 80, 75, 85],
  listening: [50, 70, 60, 80, 75, 65, 70, 80, 85, 60, 70, 75, 80, 65, 90, 70, 80, 75],
  writing:   [65, 55, 75, 70, 80, 75, 60, 85, 70, 80, 65, 75, 70, 85, 65, 80, 75, 70],
  speaking:  [55, 65, 70, 75, 60, 80, 65, 75, 80, 60, 70, 75, 65, 80, 70, 75, 80, 65],
  reading:   [70, 75, 80, 65, 75, 80, 70, 85, 75, 70, 80, 65, 75, 80, 85, 70, 75, 80],
}

function sampleDay(i: number, base = 0) {
  const p = i % HOUR_PATTERN.length
  return {
    hours:        HOUR_PATTERN[p],
    xp:           Math.round(HOUR_PATTERN[p] * 22 + base),
    newWords:     WORD_PATTERN[p],
    grammarPct:   SKILL_PATTERNS.grammar[p],
    vocabPct:     SKILL_PATTERNS.vocab[p],
    listeningPct: SKILL_PATTERNS.listening[p],
    writingPct:   SKILL_PATTERNS.writing[p],
    speakingPct:  SKILL_PATTERNS.speaking[p],
    readingPct:   SKILL_PATTERNS.reading[p],
    mockScore:    0,
  }
}

function addDays(dateStr: string, n: number) {
  const d = new Date(dateStr + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().split('T')[0]
}

// ── Build 90-day timeline ─────────────────────────────────────────────────────

function buildTimeline(
  startDate: string,
  currentDay: number,
  dbRows: DailyProgress[],
  mockTests: MockTest[],
): DayData[] {
  const rowMap = new Map<string, DailyProgress>()
  dbRows.forEach((r) => rowMap.set(r.date, r))
  const testMap = new Map<string, number>()
  mockTests.forEach((t) => testMap.set(t.date, t.totalScore))

  const days: DayData[] = []
  let cumXP = 0
  let cumWords = 0

  for (let d = 1; d <= Math.min(currentDay, 90); d++) {
    const date = addDays(startDate, d - 1)
    const real = rowMap.get(date)
    const sample = sampleDay(d - 1)

    const hours    = real ? real.totalMinutes / 60 : sample.hours
    const xp       = real ? real.xpEarned          : sample.xp
    const newWords = real ? 0                       : sample.newWords  // vocab count not in DailyProgress
    cumXP    += xp
    cumWords += newWords

    days.push({
      date,
      label:        d % 7 === 1 || d <= 5 ? `K${d}` : '',
      day:          d,
      hours:        parseFloat(hours.toFixed(1)),
      xp,
      grammarPct:   real ? real.grammarPct   : sample.grammarPct,
      vocabPct:     real ? real.vocabPct     : sample.vocabPct,
      listeningPct: real ? real.listeningPct : sample.listeningPct,
      writingPct:   real ? real.writingPct   : sample.writingPct,
      speakingPct:  sample.speakingPct,
      readingPct:   sample.readingPct,
      cumulativeXP: cumXP,
      newWords,
      totalWords:   cumWords,
      mockScore:    testMap.get(date) ?? 0,
      hasReal:      !!real,
    })
  }
  return days
}

// ── Streak Calendar (GitHub-style) ────────────────────────────────────────────

function heatColor(hours: number) {
  if (hours === 0)  return 'bg-gray-100'
  if (hours < 4)    return 'bg-green-200'
  if (hours < 8)    return 'bg-green-300'
  if (hours < 11)   return 'bg-green-400'
  if (hours < 14)   return 'bg-green-600'
  return 'bg-green-800'
}

function StreakCalendar({ days }: { days: DayData[] }) {
  const weeks: DayData[][] = []
  for (let i = 0; i < days.length; i += 7) {
    weeks.push(days.slice(i, i + 7))
  }
  const dayLabels = ['Dt', 'Se', 'Ch', 'Pa', 'Ju', 'Sh', 'Ya']

  return (
    <div className="overflow-x-auto">
      <div className="flex gap-1 min-w-0">
        {/* Day labels */}
        <div className="flex flex-col gap-1 mr-1">
          <div className="h-4" />
          {dayLabels.map((lbl) => (
            <div key={lbl} className="h-3 flex items-center">
              <span className="text-[9px] text-gray-400 w-4">{lbl}</span>
            </div>
          ))}
        </div>
        {/* Weeks */}
        {weeks.map((week, wi) => (
          <div key={wi} className="flex flex-col gap-1">
            <span className="text-[9px] text-gray-400 h-4 flex items-center">
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
      {/* Legend */}
      <div className="flex items-center gap-1.5 mt-3">
        <span className="text-[10px] text-gray-400">Kam</span>
        {['bg-gray-100', 'bg-green-200', 'bg-green-400', 'bg-green-600', 'bg-green-800'].map((cls) => (
          <div key={cls} className={`w-3 h-3 rounded-sm ${cls}`} />
        ))}
        <span className="text-[10px] text-gray-400">Ko'p (14h+)</span>
      </div>
    </div>
  )
}

// ── Chart card wrapper ─────────────────────────────────────────────────────────

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

// ── Custom tooltip ─────────────────────────────────────────────────────────────

function HoursTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-100 shadow-card rounded-xl px-3 py-2 text-xs">
      <p className="font-semibold text-gray-700 mb-1">{label}</p>
      <p className="text-primary-600">{payload[0]?.value} soat</p>
    </div>
  )
}

// ── Main ──────────────────────────────────────────────────────────────────────

export default function Progress() {
  const { totalXP, streak, currentDay, startDate } = useStore()
  const [timeline, setTimeline]   = useState<DayData[]>([])
  const [radarData, setRadarData] = useState<{ subject: string; value: number }[]>([])
  const [mockData,  setMockData]  = useState<{ week: string; score: number }[]>([])
  const [loading,   setLoading]   = useState(true)

  useEffect(() => {
    async function load() {
      const [dbRows, dbTests] = await Promise.all([
        db.dailyProgress.toArray(),
        db.mockTests.toArray(),
      ])
      const tl = buildTimeline(startDate, currentDay, dbRows, dbTests)
      setTimeline(tl)

      // Radar: average of last 14 days
      const recent = tl.slice(-14)
      const avg = (key: keyof DayData) =>
        recent.length ? Math.round(recent.reduce((s, d) => s + (d[key] as number), 0) / recent.length) : 0
      setRadarData([
        { subject: 'Grammar',   value: avg('grammarPct')   },
        { subject: 'Vocab',     value: avg('vocabPct')      },
        { subject: 'Listening', value: avg('listeningPct')  },
        { subject: 'Speaking',  value: avg('speakingPct')   },
        { subject: 'Reading',   value: avg('readingPct')    },
        { subject: 'Writing',   value: avg('writingPct')    },
      ])

      // Mock test line
      const tests = dbTests
        .sort((a, b) => a.day - b.day)
        .map((t) => ({ week: `H${t.week}`, score: t.totalScore }))
      if (tests.length === 0) {
        setMockData([
          { week: 'H1', score: 42 }, { week: 'H2', score: 51 },
          { week: 'H3', score: 58 }, { week: 'H4', score: 65 },
          { week: 'H5', score: 71 }, { week: 'H6', score: 74 },
        ])
      } else {
        setMockData(tests)
      }
      setLoading(false)
    }
    load()
  }, [startDate, currentDay])

  // Top stats
  const avgHours = timeline.length
    ? (timeline.reduce((s, d) => s + d.hours, 0) / timeline.length).toFixed(1)
    : '0.0'
  const bestStreak = streak

  // Visible days for charts (label every 7th)
  const barData = timeline.map((d, i) => ({
    ...d,
    label: i % 7 === 0 ? `K${d.day}` : '',
  }))

  const vocabData = timeline.map((d) => ({
    label:     d.label || '',
    newWords:  d.newWords,
    totalWords: d.totalWords,
  }))

  const xpData = timeline.map((d) => ({
    label:        d.label || '',
    cumulativeXP: d.cumulativeXP,
  }))

  const logRows = [...timeline].reverse().slice(0, 30)

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="p-4 max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-b2-100 rounded-xl flex items-center justify-center">
          <BarChart2 size={20} className="text-b2-600" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-900">Tahlil va Statistika</h1>
          <p className="text-xs text-gray-500">{currentDay}/90 kun · {startDate} dan</p>
        </div>
      </div>

      {/* Top stat cards */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { icon: <Award size={16} />,   color: 'text-b2-600',     label: 'Jami XP',     value: totalXP.toLocaleString()        },
          { icon: <Flame size={16} />,   color: 'text-orange-500', label: 'Streak',      value: `${bestStreak} kun`             },
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

      {/* Row 1: Bar chart + Radar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* 1. Kunlik soatlar — Bar chart */}
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

        {/* 2. Skill Radar */}
        <ChartCard title="Skill Radar" sub="So'nggi 14 kun o'rtachasi">
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

      {/* Row 2: Vocab growth + Mock test */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* 3. Vocabulary o'sishi */}
        <ChartCard title="Vocabulary o'sishi" sub="Yangi va jami so'zlar">
          <ResponsiveContainer width="100%" height={180}>
            <LineChart data={vocabData} margin={{ top: 4, right: 8, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="label" tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <YAxis tick={{ fontSize: 10 }} tickLine={false} axisLine={false} />
              <Tooltip contentStyle={{ fontSize: 11, borderRadius: 8 }} />
              <Legend iconType="circle" wrapperStyle={{ fontSize: 10 }} />
              <Line
                type="monotone" dataKey="totalWords" name="Jami so'z"
                stroke="#0694a2" strokeWidth={2} dot={false}
              />
              <Line
                type="monotone" dataKey="newWords" name="Yangi so'z"
                stroke="#84e1bc" strokeWidth={1.5} dot={false}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 4. Mock test natijalari */}
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
      </div>

      {/* Row 3: Streak calendar */}
      <ChartCard title="Streak Kalendarь" sub="Har kuni o'qilgan soat (ko'k=maqsad)">
        <StreakCalendar days={timeline} />
      </ChartCard>

      {/* Row 4: XP area chart */}
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
                {['Sana', 'Soat', "O'tilgan mavzular", 'XP', 'Ball'].map((h) => (
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
                    <td className="py-2 pr-4 text-gray-600 whitespace-nowrap">
                      {d.date}
                      {!d.hasReal && (
                        <span className="ml-1 text-[9px] text-gray-300">(namuna)</span>
                      )}
                    </td>
                    <td className="py-2 pr-4 font-semibold text-gray-800">{d.hours}h</td>
                    <td className="py-2 pr-4 text-gray-600">
                      {topics.length > 0 ? topics.join(' · ') : <span className="text-gray-300">—</span>}
                    </td>
                    <td className="py-2 pr-4 font-semibold text-primary-600">{d.xp}</td>
                    <td className="py-2 text-gray-600">
                      {d.mockScore > 0
                        ? <span className="font-semibold text-b2-600">{d.mockScore}%</span>
                        : <span className="text-gray-300">—</span>}
                    </td>
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
