// Speaking Path — Qadam 3: Gapir (ovozli active recall) ⭐
// Reja: docs/speaking-path-roadmap.md (6-bo'lim)
// Kunning bloklarini navbatma-navbat recall qiladi (RecallPanel) va o'rtacha
// ballni keyingi qadamga uzatadi.

import { useState, useRef, useCallback } from 'react'
import RecallPanel from '../RecallPanel'
import type { SpeakingDay } from '../../../data/speakingPath/types'

interface Props {
  day: SpeakingDay
  userId?: string
  /** o'rtacha ball (0–100) bilan keyingi qadamga */
  onNext: (avgScore: number) => void
}

export default function SpeakStep({ day, userId, onNext }: Props) {
  const [index, setIndex] = useState(0)
  const scoresRef = useRef<number[]>([])

  const chunk = day.chunks[index]
  const isLast = index >= day.chunks.length - 1

  const handleDone = useCallback((bestSim: number) => {
    scoresRef.current.push(Math.round(bestSim * 100))
    if (isLast) {
      const arr = scoresRef.current
      const avg = arr.length ? Math.round(arr.reduce((s, x) => s + x, 0) / arr.length) : 0
      onNext(avg)
    } else {
      setIndex(i => i + 1)
    }
  }, [isLast, onNext])

  return (
    <div className="space-y-4">
      <div className="text-center">
        <p className="text-sm font-bold text-gray-900 dark:text-gray-100">🎙️ Inglizcha ayting</p>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">{index + 1} / {day.chunks.length}</p>
      </div>
      <RecallPanel key={chunk.id} chunk={chunk} userId={userId} isLast={isLast} onDone={handleDone} />
    </div>
  )
}
