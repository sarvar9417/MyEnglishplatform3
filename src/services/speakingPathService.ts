// Speaking Path — persistence servisi
// Reja: docs/speaking-path-roadmap.md (4.5-bo'lim)
//
// Dual persistence: Supabase ASOSIY (cross-device), localStorage OFLAYN fallback/kesh.
// Har Supabase chaqiruvi try/catch bilan o'ralgan — xato/oflaynda localStorage ishlaydi
// (roadmap: 1–3 qadamlar internetsiz ishlasin). Pattern: src/services/vocabularyService.ts.
// Jadvallar: user_speaking_progress, user_speaking_chunks (migratsiya 20250611000000).

import { supabase } from '../lib/supabase'
import { createDefaultFSRSState, computeNextReviewFSRS, type FSRSState } from '../lib/srs'
import type { SpeakingChunk, SpeakingDayProgress } from '../data/speakingPath/types'

// ── localStorage kalitlari — userId bilan prefikslanadi (multi-user izolatsiya) ──
const progressKey = (uid: string) => `sp_progress_${uid}`
const srsKey = (uid: string) => `sp_srs_${uid}`

type SrsMap = Record<string, FSRSState>

function readJSON<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

function writeJSON(key: string, val: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(val))
  } catch {
    /* quota / private mode — jim o'tkazib yuboriladi */
  }
}

// ── Kunlik progress ──────────────────────────────────────────────────────────

/** Foydalanuvchining barcha kun progressi (Supabase → localStorage fallback) */
export async function getSpeakingProgress(userId: string): Promise<SpeakingDayProgress[]> {
  try {
    const { data, error } = await supabase
      .from('user_speaking_progress')
      .select('day, completed, best_speak_score, spoken_seconds, completed_at')
      .eq('user_id', userId)
    if (error) throw error
    if (data) {
      const mapped: SpeakingDayProgress[] = data.map(r => ({
        day: r.day,
        completed: r.completed,
        bestSpeakScore: r.best_speak_score ?? undefined,
        spokenSeconds: r.spoken_seconds,
        completedAt: r.completed_at ?? undefined,
      }))
      writeJSON(progressKey(userId), mapped) // oflayn kesh
      return mapped
    }
  } catch {
    /* fall through → localStorage */
  }
  return readJSON<SpeakingDayProgress[]>(progressKey(userId), [])
}

/** Bitta kun progressini saqlash (Supabase upsert + localStorage) */
export async function saveSpeakingDayProgress(userId: string, p: SpeakingDayProgress): Promise<void> {
  // localStorage (darhol, oflayn)
  const all = readJSON<SpeakingDayProgress[]>(progressKey(userId), [])
  const idx = all.findIndex(x => x.day === p.day)
  if (idx >= 0) all[idx] = p
  else all.push(p)
  writeJSON(progressKey(userId), all)

  // Supabase
  try {
    await supabase.from('user_speaking_progress').upsert({
      user_id: userId,
      day: p.day,
      completed: p.completed,
      best_speak_score: p.bestSpeakScore ?? null,
      spoken_seconds: p.spokenSeconds,
      completed_at: p.completedAt ?? null,
    })
  } catch {
    /* oflayn — localStorage da saqlandi, keyingi onlaynda sinxronlanadi */
  }
}

/** Keyingi ochilgan kun raqami (eng katta tugatilgan kun + 1; hech narsa bo'lmasa 1) */
export async function getUnlockedDay(userId: string): Promise<number> {
  const all = await getSpeakingProgress(userId)
  const maxCompleted = all.filter(p => p.completed).reduce((m, p) => Math.max(m, p.day), 0)
  return maxCompleted + 1
}

// ── Jumla darajasidagi SRS (FSRS) ─────────────────────────────────────────────

/** Joriy SRS xaritasini olish (Supabase → localStorage fallback) */
async function loadSrsMap(userId: string): Promise<SrsMap> {
  try {
    const { data, error } = await supabase
      .from('user_speaking_chunks')
      .select('chunk_id, stability, difficulty, due, reps, lapses')
      .eq('user_id', userId)
    if (error) throw error
    if (data) {
      const map: SrsMap = {}
      for (const r of data) {
        map[r.chunk_id] = {
          stability: r.stability,
          difficulty: r.difficulty,
          due: r.due,
          reps: r.reps,
          lapses: r.lapses,
        }
      }
      writeJSON(srsKey(userId), map)
      return map
    }
  } catch {
    /* fall through */
  }
  return readJSON<SrsMap>(srsKey(userId), {})
}

/** Yangi bloklarni SRS ga kiritish (faqat hali yo'qlari) */
export async function enrollChunks(userId: string, chunkIds: string[]): Promise<void> {
  const map = readJSON<SrsMap>(srsKey(userId), {})
  const newRows: { user_id: string; chunk_id: string; stability: number; difficulty: number; due: string; reps: number; lapses: number }[] = []
  for (const id of chunkIds) {
    if (!map[id]) {
      const st = createDefaultFSRSState()
      map[id] = st
      newRows.push({ user_id: userId, chunk_id: id, stability: st.stability, difficulty: st.difficulty, due: st.due, reps: st.reps, lapses: st.lapses })
    }
  }
  if (newRows.length === 0) return
  writeJSON(srsKey(userId), map)
  try {
    // mavjudlarni o'zgartirmaydi (FSRS holatini saqlaydi)
    await supabase.from('user_speaking_chunks').upsert(newRows, {
      onConflict: 'user_id,chunk_id',
      ignoreDuplicates: true,
    })
  } catch {
    /* oflayn */
  }
}

/** Blokni baholash → FSRS keyingi takrorni hisoblaydi va saqlaydi.
 *  rating: 'bilmadim' | 'qiynaldim' | 'bildim' | 'yodladim' (src/lib/srs.ts) */
export async function gradeChunk(userId: string, chunkId: string, rating: string): Promise<void> {
  const map = readJSON<SrsMap>(srsKey(userId), {})
  const current = map[chunkId] ?? createDefaultFSRSState()
  const { state } = computeNextReviewFSRS(current, rating)
  map[chunkId] = state
  writeJSON(srsKey(userId), map)
  try {
    await supabase.from('user_speaking_chunks').upsert({
      user_id: userId,
      chunk_id: chunkId,
      stability: state.stability,
      difficulty: state.difficulty,
      due: state.due,
      reps: state.reps,
      lapses: state.lapses,
      updated_at: new Date().toISOString(),
    })
  } catch {
    /* oflayn */
  }
}

/** Bugun takrorlash kerak bo'lgan bloklar (due <= bugun) */
export async function getDueChunks(
  userId: string,
  allChunks: SpeakingChunk[],
  preloadedMap?: SrsMap,
): Promise<SpeakingChunk[]> {
  const map = preloadedMap ?? await loadSrsMap(userId)
  const today = new Date().toISOString().split('T')[0]
  return allChunks.filter(c => {
    const st = map[c.id]
    return !!st && st.due <= today
  })
}

/** Jami o'zlashtirilgan (SRS ga kiritilgan) bloklar soni */
export async function getLearnedChunkCount(userId: string): Promise<number> {
  const map = await loadSrsMap(userId)
  return Object.keys(map).length
}

export interface SpeakingStats {
  /** keyingi ochilgan kun (1..N+1) */
  currentDay: number
  /** tugatilgan kunlar soni */
  totalCompleted: number
  /** bugun takrorlash kerak bo'lgan bloklar */
  dueCount: number
  /** bugun gapirilgan daqiqalar */
  todayMinutes: number
  /** ketma-ket kunlar (gapirish streak'i) */
  streakDays: number

  // ── Trend metrikalari ─────────────────────────────────────────────────────
  /** So'nggi 7 kundagi o'rtacha speak ball (STT accuracy trend) */
  avgSpeakScore7d: number
  /** So'nggi 30 kundagi o'rtacha speak ball */
  avgSpeakScore30d: number
  /** So'nggi 7 kunda kuniga o'rtacha gapirilgan daqiqa */
  avgMinutesPerDay7d: number
  /** SRS da stability >= 30 bo'lgan o'zlashtirilgan bloklar soni */
  chunksMastered: number
  /** SRS dagi barcha bloklarning o'rtacha stability si */
  avgChunkStability: number
}

/** Dashboard ko'rsatkichi uchun jamlangan statistika */
export async function getSpeakingStats(userId: string, allChunks: SpeakingChunk[]): Promise<SpeakingStats> {
  const [progress, srsMap] = await Promise.all([
    getSpeakingProgress(userId),
    loadSrsMap(userId),
  ])
  const due = await getDueChunks(userId, allChunks, srsMap)
  const completed = progress.filter(p => p.completed)
  const maxDay = completed.reduce((m, p) => Math.max(m, p.day), 0)
  const todayStr = new Date().toISOString().split('T')[0]

  const todaySeconds = completed
    .filter(p => (p.completedAt ?? '').slice(0, 10) === todayStr)
    .reduce((s, p) => s + (p.spokenSeconds || 0), 0)

  // streak — ketma-ket kalendar kunlari (bugun yoki kechagiga bog'lab).
  // UTC bilan ishlaymiz: completedAt/todayStr ham UTC sanasi (mintaqa bug'idan saqlanish).
  const dateSet = new Set(completed.map(p => (p.completedAt ?? '').slice(0, 10)).filter(Boolean))
  const cursor = new Date(todayStr + 'T00:00:00Z')
  if (!dateSet.has(todayStr)) cursor.setUTCDate(cursor.getUTCDate() - 1)
  let streak = 0
  while (dateSet.has(cursor.toISOString().split('T')[0])) {
    streak++
    cursor.setUTCDate(cursor.getUTCDate() - 1)
  }

  // ── Trend metrikalari ─────────────────────────────────────────────────────
  const now = new Date(todayStr + 'T00:00:00Z')
  const daysAgo = (n: number) => {
    const d = new Date(now)
    d.setUTCDate(d.getUTCDate() - n)
    return d.toISOString().split('T')[0]
  }

  const scores7d = completed
    .filter(p => p.bestSpeakScore != null && (p.completedAt ?? '') >= daysAgo(7))
    .map(p => p.bestSpeakScore!)
  const scores30d = completed
    .filter(p => p.bestSpeakScore != null && (p.completedAt ?? '') >= daysAgo(30))
    .map(p => p.bestSpeakScore!)

  const avgScore = (scores: number[]) =>
    scores.length > 0 ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 0

  // Kuniga o'rtacha gapirilgan daqiqa (so'nggi 7 kun)
  let totalMins7d = 0
  for (let i = 0; i < 7; i++) {
    const day = daysAgo(i)
    const daySeconds = completed
      .filter(p => (p.completedAt ?? '').slice(0, 10) === day)
      .reduce((s, p) => s + (p.spokenSeconds || 0), 0)
    totalMins7d += Math.round(daySeconds / 60)
  }
  const avgMinutesPerDay7d = Math.round(totalMins7d / 7)

  // SRS metrikalari
  const entries = Object.entries(srsMap)
  const mastered = entries.filter(([_, st]) => st.stability >= 30).length
  const avgStability = entries.length > 0
    ? Math.round(entries.reduce((s, [_, st]) => s + st.stability, 0) / entries.length * 10) / 10
    : 0

  return {
    currentDay: maxDay + 1,
    totalCompleted: completed.length,
    dueCount: due.length,
    todayMinutes: Math.round(todaySeconds / 60),
    streakDays: streak,
    avgSpeakScore7d: avgScore(scores7d),
    avgSpeakScore30d: avgScore(scores30d),
    avgMinutesPerDay7d,
    chunksMastered: mastered,
    avgChunkStability: avgStability,
  }
}
