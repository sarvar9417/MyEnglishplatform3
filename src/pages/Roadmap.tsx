import { useStore } from '../store/useStore'
import { Map, CheckCircle, Lock, Play } from 'lucide-react'

const weeks = Array.from({ length: 13 }, (_, i) => ({
  week: i + 1,
  theme: [
    'Foundation Reset', 'Present & Past Mastery', 'Future & Conditionals',
    'Vocabulary Sprint', 'Reading & Listening', 'Grammar Deep Dive',
    'Writing Workshop', 'Mock Test Prep', 'B1 Consolidation',
    'B1+ Push', 'Advanced Grammar', 'B2 Introduction', 'Final Sprint',
  ][i],
}))

export default function Roadmap() {
  const { currentWeek, currentDay, currentLevel } = useStore()

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex items-center gap-3 mb-6">
        <Map className="text-primary-600" size={28} />
        <div>
          <h1 className="text-2xl font-bold text-gray-900">90-Kunlik Yo'l Xaritasi</h1>
          <p className="text-sm text-gray-500">A2+ → B2 • Hozirgi holat: <span className="font-semibold text-primary-600">{currentLevel}</span></p>
        </div>
      </div>

      <div className="space-y-3">
        {weeks.map(({ week, theme }) => {
          const isCompleted = week < currentWeek
          const isCurrent = week === currentWeek
          const isLocked = week > currentWeek

          return (
            <div
              key={week}
              className={`card flex items-center gap-4 ${isCurrent ? 'ring-2 ring-primary-500' : ''} ${isLocked ? 'opacity-60' : ''}`}
            >
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-lg font-bold
                ${isCompleted ? 'bg-b1-100 text-b1-700' : isCurrent ? 'bg-primary-100 text-primary-700' : 'bg-gray-100 text-gray-400'}`}>
                {isCompleted ? <CheckCircle size={22} /> : isLocked ? <Lock size={18} /> : <Play size={18} />}
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-gray-900">Hafta {week}</span>
                  {isCurrent && <span className="badge badge-primary">Joriy</span>}
                  {isCompleted && <span className="badge badge-b1">Tugatildi</span>}
                </div>
                <p className="text-sm text-gray-500 mt-0.5">{theme}</p>
                {isCurrent && (
                  <div className="mt-2 progress-bar">
                    <div
                      className="progress-fill bg-primary-500"
                      style={{ width: `${((currentDay - (week - 1) * 7) / 7) * 100}%` }}
                    />
                  </div>
                )}
              </div>
              <div className="text-sm text-gray-400 font-mono">
                {week * 7 - 6}–{week * 7} kun
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
