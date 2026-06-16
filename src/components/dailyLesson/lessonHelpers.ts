import { findConfusablePair } from '../../data/confusable-pairs'

export function resolveSectionItems<T extends { id: number }>(
  sections: { ids: number[] }[],
  sectionIndex: number,
  pool: T[],
  source: T[],
): T[] {
  const section = sections[sectionIndex]
  if (!section) return []
  const byId = pool.filter((it) => section.ids.includes(it.id))
  if (byId.length > 0) return byId
  let cursor = 0
  for (let i = 0; i < sections.length; i++) {
    if (i === sectionIndex) return source.slice(cursor, cursor + sections[i].ids.length)
    cursor += sections[i].ids.length
  }
  return []
}

export function getConfusablePairs(vocabulary: { en: string }[]): { pairId: string; uzTitle: string; words: string[] }[] {
  const seen = new Set<string>()
  const result: { pairId: string; uzTitle: string; words: string[] }[] = []
  for (const v of vocabulary) {
    const pair = findConfusablePair(v.en)
    if (pair && !seen.has(pair.id)) {
      seen.add(pair.id)
      result.push({ pairId: pair.id, uzTitle: pair.uzTitle, words: pair.words })
    }
  }
  return result
}
