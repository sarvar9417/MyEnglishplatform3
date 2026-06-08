// Speaking Path — kontent kirish nuqtasi (getter'lar)
// Reja: docs/speaking-path-roadmap.md (5/7-bo'lim)

import { SPEAKING_DAYS } from './days'
import type { SpeakingChunk, SpeakingDay } from './types'

export { SPEAKING_DAYS }
export type { SpeakingChunk, SpeakingDay, SpeakingScenario, SpeakingDayProgress } from './types'

/** Jami kunlar soni */
export const TOTAL_SPEAKING_DAYS = SPEAKING_DAYS.length

/** Bitta kunni raqami bo'yicha olish */
export function getSpeakingDay(day: number): SpeakingDay | undefined {
  return SPEAKING_DAYS.find(d => d.day === day)
}

/** Barcha bloklarni tekis ro'yxat sifatida (SRS uchun) */
export function getAllChunks(): SpeakingChunk[] {
  return SPEAKING_DAYS.flatMap(d => d.chunks)
}

/** Blokni id bo'yicha topish */
export function getChunkById(id: string): SpeakingChunk | undefined {
  for (const d of SPEAKING_DAYS) {
    const c = d.chunks.find(ch => ch.id === id)
    if (c) return c
  }
  return undefined
}

/** Berilgan kungacha (shu kun ham) ochilgan barcha bloklar */
export function getChunksUpToDay(day: number): SpeakingChunk[] {
  return SPEAKING_DAYS.filter(d => d.day <= day).flatMap(d => d.chunks)
}
