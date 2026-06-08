// Speaking Path — SRS takror sessiyasi (due bloklar)
// Reja: docs/speaking-path-roadmap.md (Faza 5)
// Bugun takrorlash kerak bo'lgan bloklarni ovozli recall qiladi (RecallPanel).

import { useState, useRef, useCallback } from 'react'
import { X, Sparkles } from 'lucide-react'
import RecallPanel from './RecallPanel'
import type { SpeakingChunk } from '../../data/speakingPath/types'

interface Props {
  chunks: SpeakingChunk[]
  userId?: string
  onExit: () => void
}

export default function SpeakingReviewSession({ chunks, userId, onExit }: Props) {
  const [index, setIndex] = useState(0)
  const [done, setDone] = useState(false)
  const scoresRef = useRef<number[]>([])

  const chunk = chunks[index]
  const isLast = index >= chunks.length - 1

  const handleDone = useCallback((bestSim: number) => {
    scoresRef.current.push(Math.round(bestSim * 100))
    if (isLast) setDone(true)
    else setIndex(i => i + 1)
  }, [isLast])

  const avg = scoresRef.current.length
    ? Math.round(scoresRef.current.reduce((s, x) => s + x, 0) / scoresRef.current.length)
    : 0

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-4 mobile-safe-bottom">
      {/* Header */}
      <div className="flex items-center gap-3">
        <button onClick={onExit} className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 shrink-0">
          <X size={18} />
        </button>
        <div className="min-w-0 flex-1">
          <p className="font-black text-sm text-gray-900 dark:text-gray-100">🔁 Takrorlash</p>
          {!done && <p className="text-xs text-gray-500 dark:text-gray-400">{index + 1} / {chunks.length} ibora</p>}
        </div>
      </div>

      {done ? (
        <div className="rounded-2xl p-6 bg-gradient-to-br from-primary-50 to-emerald-50 dark:from-primary-900/20 dark:to-emerald-900/20 border border-primary-200 dark:border-primary-800/50 text-center">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-emerald-500 flex items-center justify-center">
            <Sparkles size={28} className="text-white" />
          </div>
          <p className="mt-3 font-black text-gray-900 dark:text-gray-100">Takror tugadi! 🎉</p>
          <p className="text-sm text-gray-600 dark:text-gray-300 mt-1">{chunks.length} ibora · o'rtacha {avg}%</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Natijalar FSRS rejasiga yozildi — keyingi takror sanasi yangilandi.</p>
          <button onClick={onExit} className="mt-4 w-full py-3 rounded-2xl bg-primary-600 text-white font-bold text-sm hover:bg-primary-700 active:scale-[0.98] transition-all">
            Narvonga qaytish
          </button>
        </div>
      ) : (
        <RecallPanel key={chunk.id} chunk={chunk} userId={userId} isLast={isLast} onDone={handleDone} />
      )}
    </div>
  )
}
