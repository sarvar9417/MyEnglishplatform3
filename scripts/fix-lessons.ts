/**
 * scripts/fix-lessons.ts
 *
 * Har bir dars uchun:
 *  1. rules[] matni va vocabulary[] ni taqqoslaydi
 *  2. Yetishmayotgan so'zlarni aniqlaydi
 *  3. Barcha qoidalarni qamrab olmagan mashqlarni aniqlaydi
 *  4. Claude API orqali additions generatsiya qiladi
 *  5. TypeScript manba fayliga insertatsiya qiladi
 *
 * Usage:
 *   tsx scripts/fix-lessons.ts                      # barcha fayllar
 *   tsx scripts/fix-lessons.ts --file=a1Part1       # bitta fayl
 *   tsx scripts/fix-lessons.ts --file=a1Part1 --lesson=alphabet-greetings
 *   tsx scripts/fix-lessons.ts --file=a1Part1 --dry-run
 */

import { readFileSync, writeFileSync } from 'fs'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))

// ─── Config ──────────────────────────────────────────────────────────────────

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY
const CLAUDE_MODEL = 'claude-sonnet-4-6'

const ALL_LESSON_FILES = [
  'a1Part1', 'a1Part2',
  'a2Part1', 'a2Part2', 'a2Part3', 'a2Part4',
  'b1Part1',
  'b1plusPart1', 'b1plusPart2',
  'b2Part1', 'b2Part2', 'b2Part3',
]

// ─── Types ────────────────────────────────────────────────────────────────────

interface VocabWord {
  en: string
  uz: string
  example: string
  rule: string
}

interface Exercise {
  id: number
  type: 'fill-blank' | 'multiple-choice' | 'error-correction' | 'transformation'
  instruction: string
  question: string
  blanks?: string[]
  options?: [string, string, string, string]
  correct?: string
  errorPart?: string
  hint?: string
  explanation: string
}

interface ExerciseSection {
  title: string
  desc: string
  color: string
  icon: string
  ids: number[]
}

interface LessonAdditions {
  vocabulary: VocabWord[]
  exercises: Exercise[]
  newSections: ExerciseSection[]
  specialCaseDrills: Record<string, Exercise[]>
}

interface LessonSnapshot {
  id: string
  title: string
  level: string
  day: number
  rulesText: string
  currentVocab: string[]
  currentExerciseIds: number[]
  currentExerciseSummary: string
  specialCaseSummary: string
  maxId: number
}

// ─── Claude API ──────────────────────────────────────────────────────────────

async function callClaude(prompt: string): Promise<string> {
  if (!ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY env var kerak!')

  const res = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: CLAUDE_MODEL,
      max_tokens: 8000,
      messages: [{ role: 'user', content: prompt }],
    }),
  })

  if (!res.ok) {
    const err = await res.text()
    throw new Error(`Claude API xatosi: ${res.status} — ${err}`)
  }

  const data = await res.json() as any
  return data.content?.[0]?.text ?? ''
}

// ─── Lesson parsing (from source text) ───────────────────────────────────────

/** Fayl ichidagi barcha export const nomi va lessonId larini topadi */
function findLessonsInFile(content: string): { exportName: string; lessonId: string }[] {
  const pattern = /export\s+const\s+(\w+)\s*:\s*DailyLesson\s*=\s*\{[^}]*id\s*:\s*['"]([^'"]+)['"]/g
  const results: { exportName: string; lessonId: string }[] = []
  let m: RegExpExecArray | null
  while ((m = pattern.exec(content)) !== null) {
    results.push({ exportName: m[1], lessonId: m[2] })
  }
  return results
}

/** Lesson blokining boshlanish indeksini topadi */
function findLessonStart(content: string, exportName: string): number {
  const pattern = new RegExp(`export\\s+const\\s+${exportName}\\s*:\\s*DailyLesson`)
  const m = content.match(pattern)
  if (!m || m.index === undefined) return -1
  return m.index
}

/** vocabulary[] massividagi en qiymatlarni extrakt qiladi */
function extractCurrentVocab(lessonBlock: string): string[] {
  const pattern = /en\s*:\s*['"]([^'"]+)['"]/g
  // vocabulary: [ ... ] blokini topib undan oldingi qismni qirqamiz
  const vocabStart = lessonBlock.indexOf('vocabulary:')
  const examplesStart = lessonBlock.indexOf('examples:', vocabStart)
  if (vocabStart === -1 || examplesStart === -1) return []
  const vocabSection = lessonBlock.slice(vocabStart, examplesStart)
  const words: string[] = []
  let m: RegExpExecArray | null
  while ((m = pattern.exec(vocabSection)) !== null) {
    words.push(m[1])
  }
  return words
}

/** exercises[] dagi barcha id larni extrakt qiladi */
function extractExerciseIds(lessonBlock: string): number[] {
  // exercises: [ ... ] qismini topamiz (exerciseSections dan oldin)
  const exStart = lessonBlock.indexOf('\n  exercises:')
  const secStart = lessonBlock.indexOf('exerciseSections:', exStart)
  if (exStart === -1 || secStart === -1) return []
  const exSection = lessonBlock.slice(exStart, secStart)
  const ids: number[] = []
  const idPattern = /\bid\s*:\s*(\d+)/g
  let m: RegExpExecArray | null
  while ((m = idPattern.exec(exSection)) !== null) {
    ids.push(parseInt(m[1]))
  }
  return ids
}

/** rules[] matnini extrakt qiladi */
function extractRulesText(lessonBlock: string): string {
  const rulesStart = lessonBlock.indexOf('rules:')
  const vocabStart = lessonBlock.indexOf('vocabulary:', rulesStart)
  if (rulesStart === -1 || vocabStart === -1) return ''
  return lessonBlock.slice(rulesStart, vocabStart).substring(0, 3000)
}

/** exercises[] qisqacha xulosasi */
function extractExerciseSummary(lessonBlock: string): string {
  const exStart = lessonBlock.indexOf('\n  exercises:')
  const secStart = lessonBlock.indexOf('exerciseSections:', exStart)
  if (exStart === -1 || secStart === -1) return ''
  const section = lessonBlock.slice(exStart, secStart)
  const lines = section.split('\n')
    .filter(l => l.includes('type:') || l.includes('question:'))
    .slice(0, 30)
  return lines.join('\n')
}

/** specialCases qisqacha xulosasi */
function extractSpecialCaseSummary(lessonBlock: string): string {
  const scStart = lessonBlock.indexOf('specialCases:')
  const exStart = lessonBlock.indexOf('\n  exercises:', scStart)
  if (scStart === -1 || exStart === -1) return 'yo\'q'
  const section = lessonBlock.slice(scStart, exStart)
  const ids = [...section.matchAll(/id\s*:\s*['"]([^'"]+)['"]/g)].map(m => m[1])
  const drillCounts = [...section.matchAll(/drills\s*:\s*\[/g)].length
  return `${ids.length} ta specialCase, jami ${drillCounts} ta drills bloki`
}

function buildSnapshot(content: string, exportName: string, lessonId: string): LessonSnapshot | null {
  const start = findLessonStart(content, exportName)
  if (start === -1) return null

  // Lesson bloki: keyingi export const gacha
  const nextExport = content.indexOf('\nexport const', start + 1)
  const lessonBlock = nextExport === -1 ? content.slice(start) : content.slice(start, nextExport)

  const currentVocab = extractCurrentVocab(lessonBlock)
  const currentExerciseIds = extractExerciseIds(lessonBlock)
  const maxId = currentExerciseIds.length > 0 ? Math.max(...currentExerciseIds) : 0

  // title va level ni extrakt qilish
  const titleMatch = lessonBlock.match(/title\s*:\s*['"]([^'"]+)['"]/)
  const levelMatch = lessonBlock.match(/level\s*:\s*['"]([^'"]+)['"]/)
  const dayMatch = lessonBlock.match(/day\s*:\s*(\d+)/)

  return {
    id: lessonId,
    title: titleMatch?.[1] ?? exportName,
    level: levelMatch?.[1] ?? '?',
    day: parseInt(dayMatch?.[1] ?? '0'),
    rulesText: extractRulesText(lessonBlock),
    currentVocab,
    currentExerciseIds,
    currentExerciseSummary: extractExerciseSummary(lessonBlock),
    specialCaseSummary: extractSpecialCaseSummary(lessonBlock),
    maxId,
  }
}

// ─── Claude prompt ────────────────────────────────────────────────────────────

function buildPrompt(snap: LessonSnapshot): string {
  return `Sen ingliz tili o'rganish ilovasida kontent yaratuvchi yordam berasan (O'zbek o'quvchilar uchun, A1-B2 daraja).

DARS MA'LUMOTI:
- ID: ${snap.id}
- Sarlavha: ${snap.title}
- Daraja: ${snap.level}
- Kun: ${snap.day}

DARSDA O'QITILAYOTGAN QOIDALAR (rules[]):
${snap.rulesText}

JORIY LEKSIKA (${snap.currentVocab.length} ta so'z allaqachon bor):
${snap.currentVocab.join(', ')}

JORIY MASHQLAR (${snap.currentExerciseIds.length} ta, max ID: ${snap.maxId}):
${snap.currentExerciseSummary}

SPECIAL CASES: ${snap.specialCaseSummary}

═══ TOPSHIRIQ ═══

1. LEKSIKA: rules matni ichida o'qitilgan barcha muhim so'zlarni topib, hali vocabulary[] da yo'qlarini qo'sh.
   Faqat shu mezonlar bo'yicha:
   - Ot, fe'l, sifat, ravish (mazmunli so'zlar)
   - Grammar termlar (vowel, consonant, plural, singular va h.k.) agar darsda o'qitilsa
   - Grammatik yordamchi so'zlarni (the, a, is, are) qo'shma, ular allaqachon bor deb hisoblash

2. MASHQLAR: Quyidagi qoidalar uchun exercises qo'sh (agar ular hali to'liq qamrab olinmagan bo'lsa):
   - Har bir rule elementi uchun kamida 2 ta mashq bo'lishi kerak
   - Yangi mashq ID lari ${snap.maxId + 1} dan boshlansin
   - Ko'proq xilma-xillik: fill-blank, multiple-choice, error-correction turlari

3. SEKSIYALAR: Yangi exercises uchun mos exerciseSection(lar) yarat.

4. DRILL LAR: specialCase lar uchun (agar kerak bo'lsa) qo'shimcha drills qo'sh.

═══ JAVOB FORMATI ═══

Faqat quyidagi JSON formatda qaytargin (hech qanday izoh yoki markdown blok yo'q):

{
  "vocabulary": [
    {"en": "word", "uz": "tarjima", "example": "Example sentence.", "rule": "kategoriya"}
  ],
  "exercises": [
    {"id": ${snap.maxId + 1}, "type": "fill-blank", "instruction": "Uzbekcha ko'rsatma:", "question": "Savol ___.", "blanks": ["javob"], "explanation": "Izoh"},
    {"id": ${snap.maxId + 2}, "type": "multiple-choice", "instruction": "Ko'rsatma:", "question": "Savol?", "options": ["a","b","c","d"], "correct": "a", "explanation": "Izoh"},
    {"id": ${snap.maxId + 3}, "type": "error-correction", "instruction": "Ko'rsatma:", "question": "Xato gap.", "errorPart": "xato qism", "correct": "To'g'ri gap.", "explanation": "Izoh"}
  ],
  "newSections": [
    {"title": "Bo'lim nomi", "desc": "Nima qamraydi", "color": "bg-amber-500", "icon": "🔤", "ids": [${snap.maxId + 1}, ${snap.maxId + 2}]}
  ],
  "specialCaseDrills": {
    "special-case-id": [
      {"id": ${snap.maxId + 10}, "type": "fill-blank", "instruction": "...", "question": "...", "blanks": ["..."], "explanation": "..."}
    ]
  }
}

MUHIM QOIDALAR:
- multiple-choice da options DOIM 4 ta element bo'lishi shart
- Uzbekcha tarjimalar aniq va grammatik to'g'ri bo'lsin
- Ko'rsatmalar (instruction) o'zbek tilida
- Agar qo'shimcha narsa kerak bo'lmasa, bo'sh massiv qaytargin: "vocabulary": [], "exercises": []
- JSON toza bo'lsin: hech qanday // izoh yo'q, trailing comma yo'q`
}

// ─── Response parsing ─────────────────────────────────────────────────────────

function parseAdditions(raw: string, snap: LessonSnapshot): LessonAdditions {
  // JSON ni topamiz
  const jsonMatch = raw.match(/\{[\s\S]*\}/)
  if (!jsonMatch) {
    console.warn(`  ⚠️  JSON topilmadi: ${snap.id}`)
    return { vocabulary: [], exercises: [], newSections: [], specialCaseDrills: {} }
  }

  try {
    const parsed = JSON.parse(jsonMatch[0])
    return {
      vocabulary: Array.isArray(parsed.vocabulary) ? parsed.vocabulary : [],
      exercises: Array.isArray(parsed.exercises) ? parsed.exercises : [],
      newSections: Array.isArray(parsed.newSections) ? parsed.newSections : [],
      specialCaseDrills: typeof parsed.specialCaseDrills === 'object' ? parsed.specialCaseDrills : {},
    }
  } catch (e) {
    console.warn(`  ⚠️  JSON parse xatosi (${snap.id}):`, (e as Error).message)
    // Backup: validate JSON ni tuzatishga harakat
    try {
      const fixed = jsonMatch[0].replace(/,(\s*[}\]])/g, '$1')
      const parsed = JSON.parse(fixed)
      return {
        vocabulary: Array.isArray(parsed.vocabulary) ? parsed.vocabulary : [],
        exercises: Array.isArray(parsed.exercises) ? parsed.exercises : [],
        newSections: Array.isArray(parsed.newSections) ? parsed.newSections : [],
        specialCaseDrills: typeof parsed.specialCaseDrills === 'object' ? parsed.specialCaseDrills : {},
      }
    } catch {
      return { vocabulary: [], exercises: [], newSections: [], specialCaseDrills: {} }
    }
  }
}

// ─── TypeScript source manipulation ──────────────────────────────────────────

function serializeVocabWord(w: VocabWord): string {
  const en = `'${w.en}'`
  const uz = w.uz.includes("'") ? `"${w.uz}"` : `'${w.uz}'`
  const example = w.example.includes("'") ? `"${w.example}"` : `'${w.example}'`
  const rule = `'${w.rule}'`
  return `    { en: ${en}, uz: ${uz}, example: ${example}, rule: ${rule} },`
}

function serializeExercise(ex: Exercise, indent = '    '): string {
  let s = `${indent}{ id: ${ex.id}, type: '${ex.type}', instruction: `

  // instruction va question uchun ' vs " tanlash
  const instr = ex.instruction.includes("'") ? `"${ex.instruction}"` : `'${ex.instruction}'`
  const q = ex.question.includes("'") ? `"${ex.question}"` : `'${ex.question}'`
  s += `${instr}, question: ${q},`

  if (ex.type === 'fill-blank' && ex.blanks) {
    const blanks = ex.blanks.map(b => b.includes("'") ? `"${b}"` : `'${b}'`).join(', ')
    s += ` blanks: [${blanks}],`
  } else if (ex.type === 'multiple-choice' && ex.options) {
    const opts = ex.options.map(o => o.includes("'") ? `"${o}"` : `'${o}'`).join(', ')
    const cor = ex.correct?.includes("'") ? `"${ex.correct}"` : `'${ex.correct}'`
    s += ` options: [${opts}], correct: ${cor},`
  } else if (ex.type === 'error-correction') {
    const ep = ex.errorPart?.includes("'") ? `"${ex.errorPart}"` : `'${ex.errorPart}'`
    const cor = ex.correct?.includes("'") ? `"${ex.correct}"` : `'${ex.correct}'`
    s += ` errorPart: ${ep}, correct: ${cor},`
  } else if (ex.type === 'transformation') {
    const h = ex.hint?.includes("'") ? `"${ex.hint}"` : `'${ex.hint}'`
    const cor = ex.correct?.includes("'") ? `"${ex.correct}"` : `'${ex.correct}'`
    s += ` hint: ${h}, correct: ${cor},`
  }

  const expl = ex.explanation.includes("'") ? `"${ex.explanation}"` : `'${ex.explanation}'`
  s += ` explanation: ${expl} },`
  return s
}

function serializeSection(sec: ExerciseSection): string {
  const ids = sec.ids.join(', ')
  const title = sec.title.includes("'") ? `"${sec.title}"` : `'${sec.title}'`
  const desc = sec.desc.includes("'") ? `"${sec.desc}"` : `'${sec.desc}'`
  return `    { title: ${title}, desc: ${desc}, color: '${sec.color}', icon: '${sec.icon}', ids: [${ids}] },`
}

/**
 * lessonStart dan boshlab arrayName: [ ... ], blokining yopilish joyi ( ],\n  nextKey: )
 * oldidan yangi satrlarni qo'shadi.
 */
function insertBeforeArrayEnd(
  content: string,
  lessonStart: number,
  nextKeyword: string,
  newLines: string
): string {
  const after = content.slice(lessonStart)
  // `  ],\n  nextKeyword:` yoki `  ],\r\n  nextKeyword:` ni topamiz
  const pattern = new RegExp(`(\\s*\\],\\s*\\n\\s*${nextKeyword}:)`)
  const m = after.match(pattern)
  if (!m || m.index === undefined) {
    console.warn(`    ⚠️  "${nextKeyword}:" marker topilmadi`)
    return content
  }
  const insertAt = lessonStart + m.index
  return content.slice(0, insertAt) + '\n' + newLines + content.slice(insertAt)
}

/** vocabulary[] ga yangi so'zlar qo'shadi (examples: dan oldin) */
function insertVocab(content: string, lessonStart: number, words: VocabWord[]): string {
  if (words.length === 0) return content
  const newLines = words.map(serializeVocabWord).join('\n')
  return insertBeforeArrayEnd(content, lessonStart, 'examples', newLines)
}

/** exercises[] ga yangi mashqlar qo'shadi (exerciseSections: dan oldin) */
function insertExercises(content: string, lessonStart: number, exercises: Exercise[]): string {
  if (exercises.length === 0) return content
  const newLines = exercises.map(ex => serializeExercise(ex)).join('\n')
  return insertBeforeArrayEnd(content, lessonStart, 'exerciseSections', newLines)
}

/** exerciseSections[] ga yangi seksiyalar qo'shadi (tests: dan oldin) */
function insertSections(content: string, lessonStart: number, sections: ExerciseSection[]): string {
  if (sections.length === 0) return content
  const newLines = sections.map(serializeSection).join('\n')
  return insertBeforeArrayEnd(content, lessonStart, 'tests', newLines)
}

/** specialCase drills[] ga yangi drills qo'shadi */
function insertSpecialCaseDrills(
  content: string,
  lessonStart: number,
  lessonEnd: number,
  drillPatches: Record<string, Exercise[]>
): string {
  let result = content
  let offset = 0

  for (const [caseId, drills] of Object.entries(drillPatches)) {
    if (drills.length === 0) continue

    // specialCase id ni topamiz
    const block = result.slice(lessonStart + offset, lessonEnd + offset)
    const caseIdPattern = new RegExp(`id\\s*:\\s*['"]${caseId}['"]`)
    const caseStart = block.search(caseIdPattern)
    if (caseStart === -1) {
      console.warn(`    ⚠️  specialCase "${caseId}" topilmadi`)
      continue
    }

    // drills: [...] blokining oxirini topamiz
    // examples: bilan ifodalanmagan — drills oxiri } , bilan tugaydi specialCase blok ichida
    // Drills arraydan keyingi pattern: `      ],\n    },` yoki `      ],\n    }`
    const afterCase = block.slice(caseStart)
    const drillsEndPattern = /(\s*\],\s*\n\s*\},)/
    const drillsEndMatch = afterCase.match(drillsEndPattern)
    if (!drillsEndMatch || drillsEndMatch.index === undefined) continue

    const insertAt = lessonStart + offset + caseStart + drillsEndMatch.index
    const newDrillLines = drills.map(d => serializeExercise(d, '        ')).join('\n')
    result = result.slice(0, insertAt) + '\n' + newDrillLines + result.slice(insertAt)
    offset += newDrillLines.length + 1
  }

  return result
}

// ─── Main processing ──────────────────────────────────────────────────────────

async function fixFile(fileName: string, targetLessonId?: string, isDryRun = false) {
  const filePath = join(__dirname, '../src/data/daily', `${fileName}.ts`)
  console.log(`\n📂 ${fileName}.ts`)

  let content = readFileSync(filePath, 'utf-8')
  const lessons = findLessonsInFile(content)

  console.log(`   ${lessons.length} ta dars topildi: ${lessons.map(l => l.lessonId).join(', ')}`)

  for (const { exportName, lessonId } of lessons) {
    if (targetLessonId && lessonId !== targetLessonId) continue

    const snap = buildSnapshot(content, exportName, lessonId)
    if (!snap) {
      console.warn(`  ⚠️  ${lessonId} snapshot olinmadi`)
      continue
    }

    console.log(`\n  📖 ${lessonId} (${snap.title})`)
    console.log(`     Daraja: ${snap.level} | Kun: ${snap.day}`)
    console.log(`     Joriy vocab: ${snap.currentVocab.length} | Mashqlar: ${snap.currentExerciseIds.length} | Max ID: ${snap.maxId}`)

    console.log(`     → Claude so'ralmoqda...`)
    const raw = await callClaude(buildPrompt(snap))
    const additions = parseAdditions(raw, snap)

    console.log(`     → Vocab qo'shiladi: ${additions.vocabulary.length} ta`)
    console.log(`     → Mashqlar qo'shiladi: ${additions.exercises.length} ta`)
    console.log(`     → Seksiyalar qo'shiladi: ${additions.newSections.length} ta`)

    if (isDryRun) {
      if (additions.vocabulary.length > 0) {
        console.log(`     [DRY-RUN] Vocab:`, additions.vocabulary.map(v => v.en).join(', '))
      }
      if (additions.exercises.length > 0) {
        console.log(`     [DRY-RUN] Ex IDs:`, additions.exercises.map(e => e.id).join(', '))
      }
      continue
    }

    // Haqiqiy lesson start pozitsiyasini qayta hisoblash (har iteratsiyada content o'zgaradi)
    const lessonStart = findLessonStart(content, exportName)
    if (lessonStart === -1) continue

    const nextExport = content.indexOf('\nexport const', lessonStart + 1)
    const lessonEnd = nextExport === -1 ? content.length : nextExport

    // Insertatsiya qilish (tartib muhim: avval vocab, keyin exercises, keyin sections)
    content = insertVocab(content, lessonStart, additions.vocabulary)
    content = insertExercises(content, lessonStart, additions.exercises)
    content = insertSections(content, lessonStart, additions.newSections)
    if (Object.keys(additions.specialCaseDrills).length > 0) {
      const updatedLessonStart = findLessonStart(content, exportName)
      const updatedNextExport = content.indexOf('\nexport const', updatedLessonStart + 1)
      content = insertSpecialCaseDrills(
        content,
        updatedLessonStart,
        updatedNextExport === -1 ? content.length : updatedNextExport,
        additions.specialCaseDrills
      )
    }

    console.log(`     ✅ Qo'shildi`)
  }

  if (!isDryRun) {
    writeFileSync(filePath, content, 'utf-8')
    console.log(`\n  💾 Fayl saqlandi: ${fileName}.ts`)
  }
}

// ─── Entry point ──────────────────────────────────────────────────────────────

const args = process.argv.slice(2)
const fileArg = args.find(a => a.startsWith('--file='))?.split('=')[1]
const lessonArg = args.find(a => a.startsWith('--lesson='))?.split('=')[1]
const isDryRun = args.includes('--dry-run')

if (!ANTHROPIC_API_KEY) {
  console.error('❌ ANTHROPIC_API_KEY muhit o\'zgaruvchisi kerak!')
  console.error('   Masalan: ANTHROPIC_API_KEY=sk-ant-... tsx scripts/fix-lessons.ts')
  process.exit(1)
}

const filesToProcess = fileArg ? [fileArg] : ALL_LESSON_FILES

console.log('🚀 fix-lessons skripti ishga tushdi')
console.log(`   Fayllar: ${filesToProcess.join(', ')}`)
if (lessonArg) console.log(`   Faqat dars: ${lessonArg}`)
console.log(`   Dry-run: ${isDryRun}`)
console.log(`   Model: ${CLAUDE_MODEL}`)

for (const file of filesToProcess) {
  await fixFile(file, lessonArg, isDryRun)
}

console.log('\n✅ Skript muvaffaqiyatli tugadi!')
