import { useNavigate } from 'react-router-dom'
import { useI18n } from '../../i18n'
import { useStore } from '../../store/useStore'
import { useProgress } from '../../hooks/useProgress'
import {
  BookOpen, BookMarked, Headphones, PenLine, BookText, Mic,
} from 'lucide-react'

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

export default function TodayProgress() {
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
