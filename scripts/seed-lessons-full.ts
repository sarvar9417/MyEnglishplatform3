// ═══════════════════════════════════════════════════════════════════════════
// EnglishPath — Seed all daily lessons into Supabase
// Usage: npx tsx scripts/seed-lessons-full.ts
// DAILY_LESSONS already includes TENSES_LESSONS, so we seed from it only.
// ═══════════════════════════════════════════════════════════════════════════

import { createClient } from '@supabase/supabase-js'
import { DAILY_LESSONS } from '../src/data/dailyLessons'

const SUPABASE_URL = process.env.VITE_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
  console.error('❌ VITE_SUPABASE_URL and SUPABASE_SERVICE_KEY env vars required')
  console.error('   export VITE_SUPABASE_URL=https://julclavaqxzffslmaard.supabase.co')
  console.error('   export SUPABASE_SERVICE_KEY=sb_secret_...')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY)

async function upsertLesson(lesson: any) {
  const { error } = await supabase.from('lessons').upsert({
    id: lesson.id,
    title: lesson.title,
    subtitle: lesson.subtitle,
    level: lesson.level,
    day: lesson.day,
    category: lesson.category ?? null,
    data: {
      formulas: lesson.formulas,
      rules: lesson.rules,
      vocabulary: lesson.vocabulary,
      examples: lesson.examples,
      specialCases: lesson.specialCases,
      exercises: lesson.exercises,
      exerciseSections: lesson.exerciseSections,
      tests: lesson.tests,
      testSections: lesson.testSections,
    },
  }, { onConflict: 'id' })

  if (error) {
    console.error(`  ✗ ${lesson.id}: ${error.message}`)
  } else {
    console.log(`  ✓ ${lesson.id} (day ${lesson.day}, ${lesson.level})`)
  }
}

async function main() {
  console.log(`Seeding ${DAILY_LESSONS.length} lessons...\n`)
  for (const lesson of DAILY_LESSONS) {
    await upsertLesson(lesson)
  }
  console.log('\n✅ All lessons seeded into Supabase!')
  console.log('The app will now fetch lesson content from DB instead of TypeScript.')
}

main().catch(console.error)
