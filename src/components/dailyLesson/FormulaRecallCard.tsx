import { useState, useRef, useEffect } from 'react'
import { COLOR_STYLES } from './helpers'

export default function FormulaRecallCard({ label, structure, color }: { label: string; structure: string; color: string }) {
  const [revealed, setRevealed] = useState(false)
  const countRef = useRef(0)
  const [count, setCount] = useState(0)

  const s = COLOR_STYLES[color] ?? COLOR_STYLES.blue

  useEffect(() => {
    if (countRef.current > 0) {
      // retrieval practice view tracked
    }
  }, [count])

  const handleClick = () => {
    if (!revealed) setRevealed(true)
    countRef.current += 1
    setCount(countRef.current)
  }

  return (
    <div
      onClick={handleClick}
      className="flex items-stretch gap-0 cursor-pointer select-none transition-all hover:shadow-md active:scale-[0.98] rounded-xl overflow-hidden"
    >
      <div className={`w-1.5 flex-shrink-0 ${s.bg.replace('-50', '-500')}`} />
      <div className={`flex-1 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-y border-r ${s.border} rounded-r-xl px-3 py-2`}>
        <div className="flex items-center gap-2">
          <span className={`text-xs font-semibold ${s.text}`}>{label}</span>
          <span className="text-xs bg-yellow-200 dark:bg-yellow-700 text-yellow-800 dark:text-yellow-200 px-1.5 py-0.5 rounded-full font-medium leading-none">🧠 Eslab qol</span>
        </div>
        {revealed ? (
          <p key={count} className={`font-mono text-sm font-bold ${s.text} mt-1 animate-slide-down`}>{structure}</p>
        ) : (
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">❓ Qanday formula edi? Bosing!</p>
        )}
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Ko'rildi: {count} marta</p>
      </div>
    </div>
  )
}
