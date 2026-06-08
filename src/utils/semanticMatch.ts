// Semantic matching — Levenshtein o'rniga ma'noga asoslangan matn mosligi
// Fazali yondashuv: normalizatsiya → keyword → sinonim → word order

const STOP_WORDS = new Set([
  'a', 'an', 'the', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
  'my', 'your', 'his', 'its', 'our', 'their',
  'this', 'that', 'these', 'those',
  'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 'from', 'about', 'into',
  'and', 'or', 'but', 'so', 'if', 'because', 'when', 'while', 'than',
  'do', 'does', 'did', 'have', 'has', 'had',
  'no', 'not', 'yes',
  'some', 'any', 'every', 'each', 'both', 'few', 'many', 'much', 'lots',
  'also', 'just', 'only', 'very', 'too', 'really', 'quite',
])

// Multi-word sinonimlarni avval almashtirish uchun (uzunidan qisqasiga)
const SYNONYM_PHRASES: [string, string][] = [
  ['would like', 'want'],
  ['be able to', 'can'],
  ['a lot of', 'many'],
  ['a little', 'some'],
  ['plenty of', 'many'],
  ['kind of', 'sort of'],
  ['on the other hand', 'but'],
  ['as well', 'also'],
  ['in addition', 'also'],
  ['due to', 'because'],
  ['for example', 'example'],
  ['need to', 'must'],
  ['have to', 'must'],
  ['ought to', 'should'],
]

function normalize(s: string): string {
  return s
    .toLowerCase()
    .replace(/[.,!?;:'"()…—-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function substituteSynonyms(text: string): string {
  let result = text
  for (const [phrase, replacement] of SYNONYM_PHRASES) {
    const regex = new RegExp(`\\b${phrase}\\b`, 'gi')
    result = result.replace(regex, replacement)
  }
  return result
}

function tokenize(s: string): string[] {
  return normalize(s).split(/\s+/).filter(Boolean)
}

function keywordSimilarity(student: string, target: string): number {
  const normStudent = substituteSynonyms(normalize(student))
  const normTarget = substituteSynonyms(normalize(target))

  const targetTokens = tokenize(normTarget)
  const studentTokens = tokenize(normStudent)

  const targetKeywords = targetTokens.filter(w => !STOP_WORDS.has(w))
  const studentSet = new Set(studentTokens)

  if (targetKeywords.length === 0) return 0.5

  let matchCount = 0
  for (const tkw of targetKeywords) {
    if (studentSet.has(tkw)) {
      matchCount++
    }
  }

  return matchCount / targetKeywords.length
}

function wordOrderSimilarity(student: string, target: string): number {
  const studentWords = tokenize(substituteSynonyms(normalize(student)))
  const targetWords = tokenize(substituteSynonyms(normalize(target)))

  if (targetWords.length < 2) return 1

  let matchCount = 0
  let prevIdx = -1
  for (const tw of targetWords) {
    const idx = studentWords.indexOf(tw, prevIdx + 1)
    if (idx > prevIdx) {
      matchCount++
      prevIdx = idx
    }
  }

  return targetWords.length > 0 ? matchCount / targetWords.length : 1
}

function lengthRatio(student: string, target: string): number {
  const sLen = tokenize(student).length
  const tLen = tokenize(target).length
  if (tLen === 0) return 0.5
  const ratio = sLen / tLen
  if (ratio <= 0.3) return 0
  if (ratio >= 2.5) return 0.2
  return Math.min(ratio, 1 / ratio, 1)
}

export interface SemanticMatchResult {
  score: number
  details: {
    keyword: number
    wordOrder: number
    length: number
  }
}

export function semanticSimilarity(student: string, target: string): SemanticMatchResult {
  const ns = normalize(student)
  const nt = normalize(target)

  if (ns === nt) return { score: 1, details: { keyword: 1, wordOrder: 1, length: 1 } }
  if (!ns || !nt) return { score: 0, details: { keyword: 0, wordOrder: 0, length: 0 } }

  const keywordScore = keywordSimilarity(ns, nt)
  const orderScore = wordOrderSimilarity(ns, nt)
  const lengthScore = lengthRatio(ns, nt)

  const score = keywordScore * 0.6 + orderScore * 0.3 + lengthScore * 0.1

  return {
    score: Math.max(0, Math.min(1, Math.round(score * 1000) / 1000)),
    details: {
      keyword: Math.round(keywordScore * 1000) / 1000,
      wordOrder: Math.round(orderScore * 1000) / 1000,
      length: Math.round(lengthScore * 1000) / 1000,
    },
  }
}

export function semanticToRating(score: number): string {
  if (score >= 0.85) return 'yodladim'
  if (score >= 0.6) return 'bildim'
  if (score >= 0.35) return 'qiynaldim'
  return 'bilmadim'
}

export function isSemanticCorrect(score: number): boolean {
  return score >= 0.6
}
