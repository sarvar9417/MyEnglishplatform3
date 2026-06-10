/**
 * Auto-generate unique exercise IDs for all lessons.
 * 
 * ID Schema:
 * - A1:      1001-4999   (a1Part1, a1Part2, tensesData)
 * - A2:    14001-38999   (a2Part1-4)
 * - B1:    40001-54999   (b1Part1, b1Extra)
 * - B1+:   50001-64999   (b1plusPart1-2)
 * - B2:    54001-75999   (b2Part1-3, b2Extra)
 * - Review: 80001-89999  (reviewLessons)
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
  { path: 'src/data/daily/b1Part1.ts', level: 'B1', idRange: [40001, 54999] },
  { path: 'src/data/daily/b1Extra.ts', level: 'B1', idRange: [40001, 54999] },
  // B1+
  { path: 'src/data/daily/b1plusPart1.ts', level: 'B1+', idRange: [50001, 64999] },
  { path: 'src/data/daily/b1plusPart2.ts', level: 'B1+', idRange: [50001, 64999] },
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

  // Replace exercise/test IDs sequentially
  const result = content.replace(
    /(id:\s*)(\d+)/g,
    (match, prefix, oldId) => {
      const oldIdNum = parseInt(oldId, 10)
      if (idMap.has(oldIdNum)) {
        return `${prefix}${idMap.get(oldIdNum)}`
      }
      if (nextId > end) {
        throw new Error(`ID range exhausted for ${range[0]}-${range[1]}`)
      }
      idMap.set(oldIdNum, nextId)
      usedCount++
      return `${prefix}${nextId++}`
    }
  )

  console.log(`  Assigned ${usedCount} unique IDs (${start}-${nextId - 1})`)
  return result
}

function main(): void {
  console.log('🔧 Exercise ID auto-generation\n')

  for (const file of LESSON_FILES) {
    const fullPath = join(process.cwd(), file.path)
    console.log(`Processing ${file.path} (${file.level})...`)

    let content: string
    try {
      content = readFileSync(fullPath, 'utf-8')
    } catch (err) {
      console.warn(`  ⚠️  File not found, skipping`)
      continue
    }

    try {
      const newContent = assignIds(content, file.idRange)
      writeFileSync(fullPath, newContent, 'utf-8')
      console.log(`  ✅ Updated`)
    } catch (err) {
      console.error(`  ❌ Error: ${err}`)
    }
  }

  console.log('\n✅ Done! Run validate:ids to verify.')
}

if (import.meta.url === `file://${process.argv[1]}`) {
  main()
}
