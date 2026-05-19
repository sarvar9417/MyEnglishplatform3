/**
 * Words jadvalini to'ldirish skripti
 * Ishga tushirish: npx tsx scripts/seed-words-table.ts
 *
 * .env faylida VITE_SUPABASE_URL va SUPABASE_SERVICE_KEY bo'lishi kerak:
 *   VITE_SUPABASE_URL=https://xxx.supabase.co
 *   SUPABASE_SERVICE_KEY=service_role_key
 */
import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const serviceKey  = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !serviceKey) {
  console.error('.env da VITE_SUPABASE_URL va SUPABASE_SERVICE_KEY ni belgilang')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceKey, { auth: { persistSession: false } })

import { A1_RAW } from './words/a1'
import { A2_RAW } from './words/a2'
import { B1_GENERAL_RAW, B1_PHRASAL_RAW } from './words/b1'
import { B2_ACADEMIC_RAW, B2_GENERAL_RAW, B2_IDIOM_RAW } from './words/b2'

type Level = 'A1' | 'A2' | 'B1' | 'B2'
type Raw = [string, string, string, string]

interface WordRow {
  english: string
  uzbek:   string
  level:   Level
  example: string
}

function buildAll(): WordRow[] {
  function map(raw: Raw[], level: Level): WordRow[] {
    return raw.map(([word, translation, _phonetic, example]) => ({
      english: word.trim().toLowerCase(),
      uzbek:   translation,
      example: example ?? '',
      level,
    }))
  }
  const all = [
    ...map(A1_RAW,          'A1'),
    ...map(A2_RAW,          'A2'),
    ...map(B1_GENERAL_RAW,  'B1'),
    ...map(B1_PHRASAL_RAW,  'B1'),
    ...map(B2_ACADEMIC_RAW, 'B2'),
    ...map(B2_GENERAL_RAW,  'B2'),
    ...map(B2_IDIOM_RAW,    'B2'),
  ]

  const seen = new Set<string>()
  const unique: WordRow[] = []
  for (const w of all) {
    const key = `${w.english}|${w.level}`
    if (seen.has(key)) continue
    seen.add(key)
    unique.push(w)
  }
  return unique
}

async function seed() {
  const words = buildAll()
  console.log(`Jami so'zlar: ${words.length}`)

  const byLevel: Record<string, number> = {}
  words.forEach((w) => { byLevel[w.level] = (byLevel[w.level] ?? 0) + 1 })
  for (const [lvl, count] of Object.entries(byLevel)) {
    console.log(`  ${lvl}: ${count} ta`)
  }

  const BATCH = 200
  let done = 0
  for (let i = 0; i < words.length; i += BATCH) {
    const batch = words.slice(i, i + BATCH)
    const { error } = await supabase.from('words').upsert(
      batch.map(w => ({
        english: w.english,
        uzbek:   w.uzbek,
        level:   w.level,
        example: w.example,
      })),
      { onConflict: 'english,level' }
      // Note: if upsert fails with "no unique constraint", run the migration SQL which adds `words_english_level_key`
    )

    if (error) {
      console.error(`Batch ${i}-${i + batch.length} xato:`, error.message)
      process.exit(1)
    }
    done += batch.length
    console.log(`✓ ${done}/${words.length}`)
  }

  console.log(`\n✅ Barcha ${done} ta so'z words jadvaliga yuklandi!`)
}

seed()
