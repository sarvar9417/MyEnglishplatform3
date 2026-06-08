// ═══════════════════════════════════════════════════════════════════════════
// Grammar Spaced Repetition — kunlar oralab grammatika takrori (Ebbinghaus)
// localStorage asosida — offline ishlaydi, oddiy, ishonchli.
//
// Falsafa: bugun o'rgangan → ertaga 70% unutiladi. Oraliq takror bilan
// uzoq muddatli xotiraga o'tkaziladi.
// ═══════════════════════════════════════════════════════════════════════════

export interface GrammarReview {
  lessonId:     string
  box:          number   // 0..5 (Leitner darajasi)
  nextReview:   string   // ISO sana (YYYY-MM-DD)
  lastReviewed: string
  lapses:       number   // necha marta zaif natija (qiyinchilik)
}

// Leitner intervallari (kun) — Ebbinghaus unutish egri chizig'iga mos
const BOX_INTERVALS = [1, 3, 7, 14, 30, 90]
const MAX_BOX = BOX_INTERVALS.length - 1
const STORAGE_KEY = 'grammar-srs-v1'

// ─── Saqlash / o'qish ────────────────────────────────────────────────────────
function loadAll(): Record<string, GrammarReview> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}

function saveAll(data: Record<string, GrammarReview>): void {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch { /* ignore */ }
}

function todayISO(): string {
  return new Date().toISOString().split('T')[0]
}

function addDays(iso: string, days: number): string {
  const d = new Date(iso)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

// ─── Asosiy API ──────────────────────────────────────────────────────────────

/**
 * Dars tugagach takror jadvaliga qo'shadi/yangilaydi.
 * @param score 0-100 — natija foizi (yuqori = keyingi box, past = qaytadan)
 */
export function scheduleReview(lessonId: string, score: number): void {
  const all = loadAll()
  const today = todayISO()
  const existing = all[lessonId]

  let box: number
  let lapses = existing?.lapses ?? 0

  if (score >= 80) {
    // Yaxshi natija — keyingi box (uzoqroq oraliq)
    box = Math.min((existing?.box ?? -1) + 1, MAX_BOX)
  } else if (score >= 50) {
    // O'rtacha — shu box'da qoladi
    box = existing?.box ?? 0
  } else {
    // Zaif — boshidan (1 kundan keyin qaytadan)
    box = 0
    lapses += 1
  }

  all[lessonId] = {
    lessonId,
    box,
    nextReview:   addDays(today, BOX_INTERVALS[box]),
    lastReviewed: today,
    lapses,
  }
  saveAll(all)
}

/** Bugun (yoki o'tib ketgan) takrorlash kerak bo'lgan darslar */
export function getDueReviews(): GrammarReview[] {
  const all = loadAll()
  const today = todayISO()
  return Object.values(all)
    .filter(r => r.nextReview <= today)
    .sort((a, b) => a.nextReview.localeCompare(b.nextReview))
}

/** Takrorlash kerak bo'lgan darslar soni */
export function getDueCount(): number {
  return getDueReviews().length
}

/** Kelgusi (hali vaqti kelmagan) takrorlar soni */
export function getScheduledCount(): number {
  const all = loadAll()
  const today = todayISO()
  return Object.values(all).filter(r => r.nextReview > today).length
}

/** Bitta darsning holati */
export function getReviewStatus(lessonId: string): GrammarReview | null {
  return loadAll()[lessonId] ?? null
}

/** Box → "qanchalik mustahkam" foizi (progress bar uchun) */
export function boxToStrength(box: number): number {
  return Math.round((box / MAX_BOX) * 100)
}

/** Keyingi takrorgacha qancha kun qolgani */
export function daysUntilReview(review: GrammarReview): number {
  const today = todayISO()
  const diff = (new Date(review.nextReview).getTime() - new Date(today).getTime()) / 86_400_000
  return Math.max(0, Math.round(diff))
}

/** Barcha takror yozuvlari */
export function getAllReviews(): GrammarReview[] {
  return Object.values(loadAll())
}

/** Eng zaif grammatika darslari (lapses/box bo'yicha) — id ro'yxati */
export function getWeakGrammarLessonIds(limit = 5): string[] {
  return Object.values(loadAll())
    .filter(r => r.lapses > 0 || r.box <= 1)
    .sort((a, b) => (b.lapses - a.lapses) || (a.box - b.box))
    .slice(0, limit)
    .map(r => r.lessonId)
}

export { BOX_INTERVALS, MAX_BOX }
