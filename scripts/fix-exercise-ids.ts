/**
 * Auto-generate unique exercise IDs for all lessons.
 * 
 * ID Schema (non-overlapping ranges per file):
 * - A1 files:  1001-4999
 * - A2 files: 14001-38999
 * - B1 files: 40001-49999
 * - B1+ files: 50001-53999
 * - B2 files: 54001-75999
 * - Review:    80001-89999
 */

import { readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'

interface LessonFile {
  path: string
  level: 'A1' | 'A2' | 'B1' | 'B1+' | 'B2' | 'REVIEW'
  idRange: [number, number]
}

const LESSON_FILES: LessonFile[] = [
  // A1
  { path: 'src/data/daily/a1Part1.ts', level: 'A1', idRange: [1001, 4999] },
  { path: 'src/data/daily/a1Part2.ts', level: 'A1', idRange: [1001, 4999] },
  { path: 'src/data/tenses/tensesData.ts', level: 'A1', idRange: [1001, 4999] },
  // A2
  { path: 'src/data/daily/a2Part1.ts', level: 'A2', idRange: [14001, 38999] },
  { path: 'src/data/daily/a2Part2.ts', level: 'A2', idRange: [14001, 38999] },
  { path: 'src/data/daily/a2Part3.ts', level: 'A2', idRange: [14001, 38999] },
  { path: 'src/data/daily/a2Part4.ts', level: 'A2', idRange: [14001, 38999] },
  // B1
  { path: 'src/data/daily/b1Part1.ts', level: 'B1', idRange: [40001, 49999] },
  { path: 'src/data/daily/b1Extra.ts', level: 'B1', idRange: [40001, 49999] },
  // B1+
  { path: 'src/data/daily/b1plusPart1.ts', level: 'B1+', idRange: [50001, 53999] },
  { path: 'src/data/daily/b1plusPart2.ts', level: 'B1+', idRange: [50001, 53999] },
  // B2
  { path: 'src/data/daily/b2Part1.ts', level: 'B2', idRange: [54001, 75999] },
  { path: 'src/data/daily/b2Part2.ts', level: 'B2', idRange: [54001, 75999] },
  { path: 'src/data/daily/b2Part3.ts', level: 'B2', idRange: [54001, 75999] },
  { path: 'src/data/daily/b2Extra.ts', level: 'B2', idRange: [54001, 75999] },
  // Review
  { path: 'src/data/daily/reviewLessons.ts', level: 'REVIEW', idRange: [80001, 89999] },
]

function assignIds(content: string, range: [number, number]): string {
  const [start, end] = range
  const idMap = new Map<number, number>()
  let nextId = start
  let usedCount = 0

  // Match id: NNNN only when it's a property (preceded by { or , and followed by , or })
  // This avoids matching id: inside strings
  const result = content.replace(
    /([{,]\s*)(id:\s*)(\d+)(?=\s*[,}])/g,
    (match, prefix, idPrefix, oldId) => {
      const oldIdNum = parseInt(oldId, 10)
      if (idMap.has(oldIdNum)) {
        return `${prefix}${idPrefix}${idMap.get(oldIdNum)}`
      }
      if (nextId > end) {
        throw new Error(`ID range exhausted for ${range[0]}-${range[1]}`)
      }
      idMap.set(oldIdNum, nextId)
      usedCount++
      const assigned = nextId
      nextId++
      return `${prefix}${idPrefix}${assigned}`
    }
  )

  console.log(`  Assigned ${usedCount} unique IDs (${start}-${nextId - 1})`)
  return result
}

function main(): void {
  console.log('🔧 Exercise ID auto-generation\n')

  // Group files by level to share ID ranges
  const byLevel = new Map<string, LessonFile[]>()
  for (const file of LESSON_FILES) {
    const existing = byLevel.get(file.level) ?? []
    existing.push(file)
    byLevel.set(file.level, existing)
  }

  for (const [level, files] of byLevel) {
    console.log(`\n📚 ${level} lessons:`)
    const range: [number, number] = files[0].idRange
    const globalNextId = { value: range[0] }

    for (const file of files) {
      const fullPath = join(process.cwd(), file.path)
      console.log(`  Processing ${file.path}...`)

      let content: string
      try {
        content = readFileSync(fullPath, 'utf-8')
      } catch (err) {
        console.warn(`    ⚠️  File not found, skipping`)
        continue
      }

      try {
        const newContent = assignIds(content, file.idRange)
        writeFileSync(fullPath, newContent, 'utf-8')
        console.log(`    ✅ Updated`)
      } catch (err) {
        console.error(`    ❌ Error: ${err}`)
      }
    }
  }

  console.log('\n✅ Done! Run validate:ids to verify.')
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
