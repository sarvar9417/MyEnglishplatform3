import { Flame } from 'lucide-react'

interface LevelStat {
  level: string
  total: number
  learned: number
  color: string
}

interface Props {
  stats: LevelStat[]
  totalLearned: number
  totalWords: number
  dueCount: number
  streak: number
}

export default function VocabProgress({ stats, totalLearned, totalWords, dueCount, streak }: Props) {
  return (
    <div className="card p-4">
      <div className="space-y-2.5">
        {stats.map((s) => {
          const pct = s.total > 0 ? Math.round((s.learned / s.total) * 100) : 0
          return (
            <div key={s.level}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="font-semibold text-gray-700">{s.level}</span>
                <span className="text-xs text-gray-500">
                  {s.learned.toLocaleString()} / {s.total.toLocaleString()}
                </span>
              </div>
              <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${s.color}`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100 gap-2">
        <div className="text-center">
          <p className="text-lg font-bold text-gray-900">{totalLearned.toLocaleString()}</p>
          <p className="text-[10px] text-gray-500">{totalWords.toLocaleString()} ta so'zdan</p>
        </div>
        <div className="text-center">
          <p className="text-lg font-bold text-orange-600">{dueCount}</p>
          <p className="text-[10px] text-gray-500">Takror</p>
        </div>
        <div className="flex items-center gap-1">
          <Flame size={16} className="text-orange-500" />
          <p className="text-lg font-bold text-gray-900">{streak}</p>
          <p className="text-[10px] text-gray-500">kun</p>
        </div>
      </div>
    </div>
  )
}
