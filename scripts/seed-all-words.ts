import dotenv from 'dotenv'
import { createClient } from '@supabase/supabase-js'
dotenv.config()

type Level = 'A1' | 'A2' | 'B1' | 'B2'
type Category = 'general' | 'academic' | 'phrasal' | 'idiom'

type Raw = [string, string, string, string]

type WordEntry = {
  word: string
  translation: string
  phonetic: string
  example_sentence: string
  level: Level
  category: Category
  week_introduced: number
}

type VocabInsert = {
  user_id: string
  word: string
  translation: string
  phonetic?: string
  example_sentence?: string
  level: 'A2' | 'B1' | 'B2'
  category: string
}

const supabaseUrl = process.env.VITE_SUPABASE_URL
const serviceRoleKey = process.env.SUPABASE_SERVICE_KEY

if (!supabaseUrl || !serviceRoleKey) {
  console.error('Muhit o\'zgaruvchilari yo\'q. .env faylida VITE_SUPABASE_URL va SUPABASE_SERVICE_KEY ni belgilang.')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: { persistSession: false },
})

import { A1_RAW } from './words/a1'
import { A2_RAW } from './words/a2'
import { B1_GENERAL_RAW, B1_PHRASAL_RAW } from './words/b1'
import { B2_ACADEMIC_RAW, B2_GENERAL_RAW, B2_IDIOM_RAW } from './words/b2'

const SYSTEM_USER_ID = '19434012-1061-4c40-bdb8-0dc8729e2759'

function withWeeks(raw: Raw[], level: Level, category: Category, weeks: number[]): WordEntry[] {
  const perWeek = Math.ceil(raw.length / weeks.length)
  return raw.map(([word, translation, phonetic, example_sentence], i) => ({
    word: word.trim().toLowerCase(),
    translation,
    phonetic,
    example_sentence,
    level,
    category,
    week_introduced: weeks[Math.min(Math.floor(i / perWeek), weeks.length - 1)],
  }))
}

function buildAll(): WordEntry[] {
  const a1 = withWeeks(A1_RAW, 'A1', 'general', [1])
  const a2 = withWeeks(A2_RAW, 'A2', 'general', [2, 3, 4])
  const b1g = withWeeks(B1_GENERAL_RAW, 'B1', 'general', [5, 6, 7, 8])
  const b1p = withWeeks(B1_PHRASAL_RAW, 'B1', 'phrasal', [5, 6, 7, 8])
  const b2a = withWeeks(B2_ACADEMIC_RAW, 'B2', 'academic', [9, 10, 11, 12])
  const b2g = withWeeks(B2_GENERAL_RAW, 'B2', 'general', [9, 10, 11, 12])
  const b2i = withWeeks(B2_IDIOM_RAW, 'B2', 'idiom', [9, 10, 11, 12])
  const all = [...a1, ...a2, ...b1g, ...b1p, ...b2a, ...b2g, ...b2i]
  const seen = new Set<string>()
  const unique: WordEntry[] = []
  for (const w of all) {
    if (seen.has(w.word)) continue
    seen.add(w.word)
    unique.push(w)
  }
  return unique
}

async function tryDirectDBMigration(): Promise<boolean> {
  try {
    const { default: pg } = await import('pg')
    const { Pool } = pg
    const regions = ['us-east-1', 'us-west-1', 'eu-west-1', 'eu-central-1']
    for (const region of regions) {
      const pool = new Pool({
        host: `aws-0-${region}.pooler.supabase.com`,
        port: 6543,
        user: `postgres.julclavaqxzffslmaard`,
        password: serviceRoleKey,
        database: 'postgres',
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000,
      })
      try {
        const client = await pool.connect()
        await client.query('ALTER TABLE public.system_words ADD COLUMN IF NOT EXISTS translation text')
        await client.query('ALTER TABLE public.system_words ADD COLUMN IF NOT EXISTS phonetic text')
        await client.query('ALTER TABLE public.system_words ADD COLUMN IF NOT EXISTS example_sentence text')
        await client.query("ALTER TABLE public.system_words ADD COLUMN IF NOT EXISTS category text NOT NULL DEFAULT 'general'")
        await client.query('ALTER TABLE public.system_words ADD COLUMN IF NOT EXISTS week_introduced integer NOT NULL DEFAULT 1')
        await client.query('ALTER TABLE public.system_words DROP CONSTRAINT IF EXISTS system_words_word_key')
        await client.query('ALTER TABLE public.system_words ADD CONSTRAINT system_words_word_key UNIQUE (word)')
        client.release()
        await pool.end()
        console.log('✓ system_words jadvali muvaffaqiyatli yangilandi')
        return true
      } catch {
        await pool.end().catch(() => {})
      }
    }
    return false
  } catch {
    return false
  }
}

async function checkSystemWordsReady(): Promise<boolean> {
  const { error } = await supabase
    .from('system_words')
    .upsert({ word: '__probe__', translation: 'x', phonetic: '/x/', example_sentence: 'x', level: 'A2' as Level, category: 'general', week_introduced: 1 }, { onConflict: 'word' })
  await supabase.from('system_words').delete().eq('word', '__probe__')
  return !error
}

async function seed() {
  const ALL = buildAll()
  console.log(`Jami noyob so'zlar: ${ALL.length}`)

  let useSystemWords = await checkSystemWordsReady()
  if (!useSystemWords) {
    console.log('system_words jadvali to\'liq emas — kolonkalar qo\'shilmoqda...')
    useSystemWords = await tryDirectDBMigration()
    if (useSystemWords) {
      useSystemWords = await checkSystemWordsReady()
    }
  }

  if (useSystemWords) {
    await seedSystemWords(ALL)
  } else {
    console.log('Direct DB ulanish imkonsiz — vocabulary jadvaliga yuklanmoqda...')
    await seedVocabulary(ALL)
  }

  printStats(ALL)
}

async function seedSystemWords(ALL: WordEntry[]) {
  const BATCH = 100
  let done = 0
  for (let i = 0; i < ALL.length; i += BATCH) {
    const batch = ALL.slice(i, i + BATCH)
    const { error } = await supabase.from('system_words').upsert(batch, { onConflict: 'word' })
    if (error) {
      console.error(`\nXato (batch ${i}-${i + batch.length}): ${error.message}`)
      process.exit(1)
    }
    done += batch.length
    console.log(`✓ ${done}/${ALL.length}`)
  }
  console.log(`\nBarcha ${done} ta so'z system_words ga yuklandi!`)
}

async function seedVocabulary(ALL: WordEntry[]) {
  const a2b1b2 = ALL.filter(w => w.level === 'A2' || w.level === 'B1' || w.level === 'B2')
  const a1 = ALL.filter(w => w.level === 'A1')

  console.log(`  A2/B1/B2: ${a2b1b2.length} ta so'z → vocabulary`)
  console.log(`  A1: ${a1.length} ta so'z → system_words (cheklangan kolonkalar)`)

  const BATCH = 100
  let done = 0

  for (let i = 0; i < a2b1b2.length; i += BATCH) {
    const batch = a2b1b2.slice(i, i + BATCH).map(w => ({
      user_id: SYSTEM_USER_ID,
      word: w.word,
      translation: w.translation,
      phonetic: w.phonetic,
      example_sentence: w.example_sentence,
      level: w.level as 'A2' | 'B1' | 'B2',
      category: w.category,
    }))
    const { error } = await supabase.from('vocabulary').upsert(batch, { onConflict: 'user_id,word', ignoreDuplicates: true })
    if (error) {
      console.error(`\nXato vocabulary (batch ${i}-${i + batch.length}): ${error.message}`)
      process.exit(1)
    }
    done += batch.length
    console.log(`✓ ${done}/${a2b1b2.length} (vocabulary)`)
  }

  for (let i = 0; i < a1.length; i += BATCH) {
    const batch = a1.slice(i, i + BATCH).map(w => ({
      word: w.word,
      level: w.level,
    }))
    const { error } = await supabase.from('system_words').insert(batch)
    if (error) {
      console.error(`\nXato system_words (A1 batch ${i}-${i + batch.length}): ${error.message}`)
    } else {
      console.log(`✓ ${Math.min(i + BATCH, a1.length)}/${a1.length} (A1 → system_words)`)
    }
  }

  console.log(`\nBarcha done! ${done} ta so'z vocabulary ga, ${a1.length} ta so'z system_words ga yuklandi.`)
}

function printStats(ALL: WordEntry[]) {
  const by = (fn: (w: WordEntry) => boolean) => ALL.filter(fn).length
  console.log('\nStatistika:')
  console.log(`  A1 (general):   ${by(w => w.level === 'A1')}`)
  console.log(`  A2 (general):   ${by(w => w.level === 'A2')}`)
  console.log(`  B1 (jami):      ${by(w => w.level === 'B1')}`)
  console.log(`     - general:   ${by(w => w.level === 'B1' && w.category === 'general')}`)
  console.log(`     - phrasal:   ${by(w => w.level === 'B1' && w.category === 'phrasal')}`)
  console.log(`  B2 (jami):      ${by(w => w.level === 'B2')}`)
  console.log(`     - academic:  ${by(w => w.category === 'academic')}`)
  console.log(`     - general:   ${by(w => w.level === 'B2' && w.category === 'general')}`)
  console.log(`     - idiom:     ${by(w => w.category === 'idiom')}`)
  console.log('\n  Haftalar boyicha:')
  for (let wk = 1; wk <= 12; wk++) {
    console.log(`    week ${String(wk).padStart(2)}: ${by(w => w.week_introduced === wk)}`)
  }
}

seed().catch(err => {
  console.error('Seed skriptida xato:', err)
  process.exit(1)
})
