import { useEffect, useState } from 'react'
import { BarChart2, Award, Flame, TrendingUp } from 'lucide-react'
import {
  BarChart, Bar, LineChart, Line, AreaChart, Area,
  RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  ReferenceLine,
} from 'recharts'
import { supabase } from '../db/supabase'
import { useStore } from '../store/useStore'

// ── Types ─────────────────────────────────────────────────────────────────────

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

// ── Helpers ───────────────────────────────────────────────────────────────────

function addDays(dateStr: string, n: number) {
  const d = new Date(dateStr + 'T00:00:00Z')
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().split('T')[0]
}

// ── Build 90-day timeline ─────────────────────────────────────────────────────

function buildTimeline(
  startDate: string,
  currentDay: number,
  dbRows: any[],
  mockTests: any[],
  skillMap: Record<string, SkillSummary[]>,
): DayData[] {
  const rowMap = new Map<string, any>()
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

    const hours = real ? real.total_minutes / 60 : 0
    const xp    = real ? real.xp_earned : 0
    cumXP += xp

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
      newWords:     0,
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
  const [supaStreak, setSupaStreak] = useState(0)

  useEffect(() => {
    async function load() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) { setLoading(false); return }
        const uid = session.user.id

        // Fetch all data in parallel
        const [
          { data: profile },
          { data: daily },
          { data: mocks },
          { data: grammarRows },
          { data: listeningRows },
          { data: readingRows },
          { data: speakingRows },
          { data: writingRows },
        ] = await Promise.all([
          supabase.from('users').select('*').eq('id', uid).single(),
          supabase.from('daily_progress').select('*').eq('user_id', uid).order('date'),
          supabase.from('mock_tests').select('*').eq('user_id', uid).order('created_at'),
          supabase.from('grammar_progress').select('date, score').eq('user_id', uid).order('completed_at'),
          supabase.from('listening_progress').select('date, score').eq('user_id', uid).order('completed_at'),
          supabase.from('reading_progress').select('date, score').eq('user_id', uid).order('completed_at'),
          supabase.from('speaking_progress').select('date, avg_score').eq('user_id', uid).order('completed_at'),
          supabase.from('writings').select('date, score').eq('user_id', uid).order('created_at'),
        ])

        const start = profile?.start_date ?? startDate
        const day   = profile?.current_day ?? currentDay
        const streakVal = profile?.streak ?? streak

        setSupaStreak(streakVal)

        const skillMap: Record<string, SkillSummary[]> = {
          grammar:   (grammarRows ?? []).map((r: any) => ({ date: r.date, score: r.score })),
          listening: (listeningRows ?? []).map((r: any) => ({ date: r.date, score: r.score })),
          reading:   (readingRows ?? []).map((r: any) => ({ date: r.date, score: r.score })),
          speaking:  (speakingRows ?? []).map((r: any) => ({ date: r.date, score: (r.avg_score ?? 0) * 10 })),
          writing:   (writingRows ?? []).map((r: any) => ({ date: r.date, score: (r.score ?? 0) * 10 })),
        }

        const tl = buildTimeline(start, day, daily ?? [], mocks ?? [], skillMap)
        setTimeline(tl)

        // Radar: average of last 14 available skill records
        function avgSkill(arr: SkillSummary[]): number {
          const recent = arr.slice(-14)
          return recent.length ? Math.round(recent.reduce((s, d) => s + d.score, 0) / recent.length) : 0
        }
        setRadarData([
          { subject: 'Grammar',   value: avgSkill(skillMap.grammar)   },
          { subject: 'Vocab',     value: 0 },
          { subject: 'Listening', value: avgSkill(skillMap.listening) },
          { subject: 'Speaking',  value: avgSkill(skillMap.speaking)  },
          { subject: 'Reading',   value: avgSkill(skillMap.reading)   },
          { subject: 'Writing',   value: avgSkill(skillMap.writing)   },
        ])

        // Mock test line
        const tests = (mocks ?? [])
          .sort((a: any, b: any) => a.day - b.day)
          .map((t: any) => ({ week: `H${t.week}`, score: t.total_score }))
        if (tests.length === 0) {
          // Placeholder so chart doesn't break
          setMockData([
            { week: 'H1', score: 0 }, { week: 'H2', score: 0 },
            { week: 'H3', score: 0 }, { week: 'H4', score: 0 },
          ])
        } else {
          setMockData(tests)
        }
      } catch (e) {
        console.error('Progress load error:', e)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [startDate, currentDay, totalXP, streak])

  // Top stats
  const avgHours = timeline.length
    ? (timeline.reduce((s, d) => s + d.hours, 0) / timeline.length).toFixed(1)
    : '0.0'

  // Visible days for charts
  const barData = timeline.map((d, i) => ({
    ...d,
    label: i % 7 === 0 ? `K${d.day}` : '',
  }))

  const xpData = timeline.map((d) => ({
    label:        d.label || '',
    cumulativeXP: d.cumulativeXP,
  }))

  const logRows = [...timeline].reverse().slice(0, 30)

  if (loading) {
    return (
      <div className="p-3 sm:p-6 max-w-4xl mx-auto flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-2 border-primary-600 border-t-transparent" />
      </div>
    )
  }

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto space-y-4">
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 bg-b2-100 rounded-xl flex items-center justify-center">
          <BarChart2 size={20} className="text-b2-600" />
        </div>
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-900">Tahlil va Statistika</h1>
          <p className="text-xs text-gray-500">{currentDay}/90 kun · {startDate} dan</p>
        </div>
      </div>

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
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-4">
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
                    <td className="py-2 pr-4 text-gray-600 whitespace-nowrap">
                      {d.date}
                    </td>
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
