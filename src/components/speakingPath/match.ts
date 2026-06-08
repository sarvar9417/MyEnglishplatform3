// Speaking Path — oflayn matn-moslik (Gapir/recall tekshiruvi uchun)
// Reja: docs/speaking-path-roadmap.md (Faza 3)
// STT transcript yoki yozilgan matnni maqsad jumla bilan solishtiradi.

/** Kichik harf, tinish belgilarsiz, bo'shliqlar normallashtirilgan */
export function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[.,!?;:'"()…—-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Levenshtein masofasi (ikki string orasidagi tahrir soni) */
function levenshtein(a: string, b: string): number {
  const m = a.length
  const n = b.length
  if (m === 0) return n
  if (n === 0) return m
  const dp = Array.from({ length: m + 1 }, (_, i) => i)
  for (let j = 1; j <= n; j++) {
    let prev = dp[0]
    dp[0] = j
    for (let i = 1; i <= m; i++) {
      const tmp = dp[i]
      dp[i] = Math.min(
        dp[i] + 1, // o'chirish
        dp[i - 1] + 1, // qo'shish
        prev + (a[i - 1] === b[j - 1] ? 0 : 1), // almashtirish
      )
      prev = tmp
    }
  }
  return dp[m]
}

/** 0..1 o'xshashlik (1 = aynan bir xil) */
export function similarity(a: string, b: string): number {
  const na = normalize(a)
  const nb = normalize(b)
  const maxLen = Math.max(na.length, nb.length)
  if (maxLen === 0) return 1
  return 1 - levenshtein(na, nb) / maxLen
}

/** O'xshashlik → FSRS rating (src/lib/srs.ts: ratingToGrade) */
export function similarityToRating(sim: number): string {
  if (sim >= 0.9) return 'yodladim'
  if (sim >= 0.65) return 'bildim'
  if (sim >= 0.4) return 'qiynaldim'
  return 'bilmadim'
}

/** Javob "to'g'ri" hisoblanadimi (✅/❌ chegarasi) */
export function isCorrect(sim: number): boolean {
  return sim >= 0.65
}

// ── Semantic re-export (Faza 4) ──────────────────────────────────────────────

export {
  semanticSimilarity,
  semanticToRating,
  isSemanticCorrect,
} from '../../utils/semanticMatch'
export type { SemanticMatchResult } from '../../utils/semanticMatch'
