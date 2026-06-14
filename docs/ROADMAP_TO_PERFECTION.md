# EnglishPath — Mukammallik Yo'l Xaritasi
### Barcha tahlillardan 10/10 ga yetish uchun to'liq rejа

> **Manbalar:** `PLATFORM_ANALYSIS.md` (asosiy tahlil), `professional-roadmap.md` (professional daraja roadmapi) — 2026-06-10 da birlashtirildi
> **Maqsad:** Har 6+ nuqtai nazardan 10/10
> **Fayllar:** `tahlil-xulosa.md` va `professional-roadmap.md` dagi barcha qo'shimcha content shu faylga integratsiya qilindi
> **Yondashuv:** Kritik → Muhim → Kengayish → Kamolot

---

## ✅ BAJARILISH HOLATI (2026-06-10 — kod bazasida ikki marta tekshirilgan)

> Har bir F-band sarlavhasi holat belgisiga ega: **✅** bajarilgan · **⚠️** qisman · **❌** hali yo'q

**To'liq bajarilgan (✅) — 17 ta**
- **F1-1** Exercise ID auto-generatsiya (4479 unique, 0 duplicate — script + validation)
- **F1-2** exerciseSections "Inkor" → "Kengaytirish" (kodda qolmagan)
- **F1-3** Build fix (manualChunks vite.config.ts)
- **F1-5** Noaniq mashqlar audit (skript mavjud)
- **F1-6** CI/CD GitHub Actions
- **F1-7** E2E Playwright (auth + lesson spec)
- **F1-8** Test coverage (~66% lines, 30% threshold met ✅)
- **F1-9** Conflict resolution (smart merge)
- **F1-10** Offline banner
- **F2-1** Grammar SRS (FSRS-5, `/review` page, WeakAreasCard, localStorage)
- **F2-3** Produktiv ko'nikmalar (107 writing section, AI evaluation, speech rec, 75d path)
- **F2-4** Audio TTS (AudioButton + useSpeechSynthesis)
- **F2-6** "90 kunda B2" yumshatish (kod bazasida olib tashlangan)
- **F7-1** Grammar Review widget (GrammarReview.tsx + grammarSrs)
- **F7-2** Confusable pairs (10 juftlik, to'liq UI + quiz + SRS partner delay ✅)
- **F8-4** Hearts qayta ko'rib chiqish (darslardan olib tashlangan, dead code qolgan)
- **Shaxsiy Lug'at** (Personal Vocabulary — to'liq backend + UI + SRS + AI tarjima)

**Qisman bajarilgan (⚠️) — 17 ta**
- **F1-4** Auth lokalizatsiya (4 string t() ga o'tkazildi, ~500+ qoldiq)
- **F2-2** Interleaved (MixedReview page bor, lekin Section 4-5 interleaved emas)
- **F2-5** Mini-passages (A1=20, A2=8, B1=13, B1+=9, B2=19 — B1+ da 9/18 darsda) ⚠️
- **F2-7** Mnemonika UI (MnemonicCard mavjud, faqat SpecialCases da)
- **F2-8** Writing AI (level-based eval)
- **F2-9** Speaking integratsiya (LessonView da tab bor)
- **F3-1** CMS migratsiya (126 dars DB'da, seed script + fetchLessons() ga cache qo'shildi)
- **F3-2** claude.ts split (src/lib/ai/ mavjud, claudePrompts.ts o'chirilgan, lekin claude.ts hali monolit)
- **F3-6** Adaptive engine (adaptiveService.ts + AdaptivePlan.tsx bor, lekin BKT/IRT yo'q)
- **F3-8** Analytics dashboard (AiInsightsWidget, WeakSpotsWidget bor, lekin AnalyticsSection.tsx yo'q)
- **F4-2** Terminologiya lug'ati (grammarGlossary.ts ga description + helper funksiyalar qo'shildi, GrammarGlossary.tsx da description ko'rsatiladi, Grammar.tsx da ikki tilda terminlar ✅)
- **F8-1** Demo (butunlay olib tashlandi — platforma tekin, guest mode kerak emas)
- **F8-3** Onboarding (OnboardingFlow.tsx bor, lekin 5-step roadmap spec'iga mos emas)
- **F3-9** Error detection (sentryProvider, ErrorDisplay bor)
- **F3-10** Performance monitoring (monitoring.ts + chunk limits bor)
- **F9-1** Listening section sustainability (backup URL, monitoring script yo'q)
- **F9-2** Speaking AI baholash (prosodik tahlil yo'q)

**Bajarilmagan (❌) — 11 ta**
- **F2-10** Curriculum gap (CEFR audit skripti yo'q)
- **F3-3** Test coverage oshirish (lessonData.test.ts yo'q)
- **F3-4** Incremental seed
- **F3-5** `any` tipidan voz kechish (ishlab chiqarish kodida 0 ta, test + dynamic wrapper da 6 ta)
- **F3-7** AI Tutor 2.0 (real-time feedback, weekly report yo'q)
- **F4-1** Murojaat (check-murojaat.ts yo'q; lekin "siz" allaqachon ishlatiladi)
- **F4-4** i18n avtomatlashtirish (Crowdin yo'q)
- **F6-1** Ichki motivatsiya (Personal Why, Progress Journal yo'q)
- **F7-3** Elaborative encoding (ConnectionExercise yo'q)
- **F7-4** Active recall (Blank Slate section yo'q)
- **F10** (React Native, Kids, Community — hammasi yo'q)

**Qo'shimcha (roadmapda yo'q, lekin bajarilgan):** kun sonini 126 ga birlashtirish, kunlik quest 91–126 qamrovi, lesson_abandoned analytics funnel, AdaptivePlan dashboard widget, AiInsightsWidget, WeakSpotsWidget, Shaxsiy Lug'at (Personal Vocabulary) to'liq tizim.

---

## JORIY HOLAT vs MAQSAD

| Nuqtai Nazar | Hozir | Maqsad |
|---|---|---|
| Ingliz tili pedagog | 7.5/10 | 10/10 |
| Dasturchi | 8/10 | 10/10 |
| O'zbek tili ustozi | 6.5/10 | 10/10 |
| Yangi boshlovchi | 6.5/10 | 10/10 |
| Faylasuf | 5/10 | 10/10 |
| Yodlash olimi | 6.5/10 | 10/10 |
| **O'rtacha** | **6.5/10** | **10/10** |

---

# FAZA 1 — KRITIK TUZATISHLAR
### Muddat: 1–2 hafta · Baho ta'siri: +1.5 umumiy ball

---

## F1-1. ✅ ️ Exercise ID auto-generatsiya (script + validation)
**Muammo:** ID lar qo'lda boshqariladi → duplikat xavfi
**Yechim:** `scripts/fix-exercise-ids.ts` — barcha dars fayllarini ID avtogeneratsiyasi (4479 unikal ID, 0 duplikat)
**Ta'sir:** Dasturchi 10/10

### Amalga oshirish:

**`src/data/daily/validateLessons.ts`** faylini yarating:
```typescript
// Barcha dars fayllaridan ID larni yig'ib, duplikatlarni aniqlaydi
import { getAllLessons } from './index'

export function validateLessonIds(): void {
  const lessons = getAllLessons()
  const seen = new Map<number, string>()
  
  for (const lesson of lessons) {
    for (const ex of [...lesson.exercises, ...lesson.tests]) {
      if (seen.has(ex.id)) {
        throw new Error(
          `Duplicate exercise ID ${ex.id} in ${lesson.id} (also in ${seen.get(ex.id)})`
        )
      }
      seen.set(ex.id, lesson.id)
    }
  }
  console.log(`✅ ${seen.size} ta unique exercise ID tekshirildi`)
}
```

**`package.json`** ga qo'shing:
```json
"validate:ids": "tsx scripts/validate-lesson-ids.ts",
"prebuild": "npm run validate:ids"
```

**ID schema standartlashtirish:**
```
A1:   1001–1999  (a1Part1), 1100–1999 (a1Part2)
A2:  14001–38999  (a2Part1–4)
B1:  40001–55000  (b1Part1, b1plusPart1–2)
B2:  54001–75999  (b2Part1–3)
```

---

## F1-2. ✅ ️ exerciseSections "Inkor" nomi — Semantik tuzatish
**Muammo:** A1 darslari (sonlar, ranglar, hayvonlar) da Section 4 = "🚫 Inkor" — bu mantiqan noto'g'ri
**Ta'sir:** Ingliz tili pedagog +0.3, O'zbek tili ustozi +0.3

### Yangi 5-bo'lim nomlar:

**A1 darslari (5 bo'lim) uchun:**
```typescript
const A1_SECTIONS = [
  { title: "Boshlang'ich", icon: '🌱', color: 'bg-emerald-500' },
  { title: "O'rtacha",     icon: '📘', color: 'bg-blue-500' },
  { title: "Qiyin",        icon: '🎯', color: 'bg-violet-500' },
  { title: "Kengaytish",   icon: '🔤', color: 'bg-amber-500' },  // "Inkor" o'rniga
  { title: "O'zgartirish", icon: '🔄', color: 'bg-teal-500' },
]
```

**A2–B2 darslari (5 bo'lim, agar 4-bo'lim haqiqatan negation bo'lsa):**
- Negation mashqlar bor → "🚫 Inkor" to'g'ri
- Negation mashqlar yo'q → "🔍 Tahlil" yoki "📋 Amaliyot"

**`scripts/normalize-sections.ts`** ni yangilang:
```typescript
// A1 files uchun position 3 → "Kengaytish", not "Inkor"
const A1_FILES = ['a1Part1.ts', 'a1Part2.ts']
const slot3Title = A1_FILES.includes(filename) ? 'Kengaytish' : 'Inkor'
const slot3Icon  = A1_FILES.includes(filename) ? '🔤' : '🚫'
const slot3Color = A1_FILES.includes(filename) ? 'bg-amber-500' : 'bg-red-500'
```

---

## F1-3. ✅ Build ogohlantirishlarini tuzatish
**Muammo:** Circular chunk: `vendor → react-vendor → vendor`
**Ta'sir:** Dasturchi +0.2

**`vite.config.ts`** ni yangilang:
```typescript
build: {
  rollupOptions: {
    output: {
      manualChunks: (id) => {
        // React alohida
        if (id.includes('node_modules/react') || 
            id.includes('node_modules/react-dom') ||
            id.includes('node_modules/react-router')) {
          return 'react-core'
        }
        // Charts alohida
        if (id.includes('recharts') || id.includes('d3-')) {
          return 'charts'
        }
        // Supabase alohida (dynamic import bo'lmasligi kerak)
        if (id.includes('@supabase')) {
          return 'supabase'
        }
        // Dars ma'lumotlari level bo'yicha
        if (id.includes('/data/daily/a1')) return 'lessons-a1'
        if (id.includes('/data/daily/a2')) return 'lessons-a2'
        if (id.includes('/data/daily/b1')) return 'lessons-b1'
        if (id.includes('/data/daily/b2')) return 'lessons-b2'
        // Qolgan vendor
        if (id.includes('node_modules')) return 'vendor'
      }
    }
  }
}
```

---

## F1-4. ✅ ️ O'zbek tilidagi to'liq lokalizatsiya
**Muammo:** "Sign In", "Sign Up", "Dashboard" ingliz tilida qolgan
**Ta'sir:** Yangi boshlovchi +0.5, O'zbek tili ustozi +0.3

**Bajarilgan:** `src/i18n/` toʻliq tizim (3 til, provider, hook, LanguageSwitcher). `TranslationStrings` ~700+ kalit. **30/32 sahifa toʻliq lokalizatsiya qilingan** — Dictionary va Vocabulary sub-komponentlari (AddWordModal, WordCard, LevelGroup) va error messagelari ham t() ga oʻtkazildi.

**Sahifalar holati:**
- ✅ **To'liq (28 sahifa):** Auth, Dashboard, LearnHub, NotFound, Profile, Confusable, Idioms, SpeakingPath, PhrasalVerbs, MixedReview, GrammarReview, ResetPassword, InvitePage, SkillsPage, PlacementTest, Speaking, Listening, Reading, Writing, Grammar, VocabHub, Phrases, Chat, Conversation, Pronunciation, MockTest, AiPractice, PhraseDictionary
- ✅ **Toʻliq (30 sahifa):** Auth, Dashboard, LearnHub, NotFound, Profile, Confusable, Idioms, SpeakingPath, PhrasalVerbs, MixedReview, GrammarReview, ResetPassword, InvitePage, SkillsPage, PlacementTest, Speaking, Listening, Reading, Writing, Grammar, VocabHub, Phrases, Chat, Conversation, Pronunciation, MockTest, AiPractice, PhraseDictionary, **Dictionary**, **Vocabulary**
- ⏭️ **Skip (2 sahifa):** TandemPage, LessonDemoPage (subkomponentda i18n, asosiy string yoʻq)

**Ishlatilgan kalitlar:** `auth.*`, `dashboard.*`, `learnHub.*`, `notFound.*`, `profile.*`, `speaking.*`, `listening.*`, `reading.*`, `writing.*`, `grammar.*`, `vocabHub.*`, `phrases.*`, `confusable.*`, `idioms.*`, `chat.*`, `conversation.*`, `pronunciation.*`, `speakingPath.*`, `mockTest.*`, `phrasalVerbs.*`, `skills.*`, `mixedReview.*`, `grammarReview.*`, `placementTest.*`, `aiPractice.*`, `dictionary.*`, `phraseDict.*`, `resetPassword.*`, `invitePage.*`, `vocabPage.*`, `common.*`, `offline.*`, `pwa.*`, `seo.*`, `nav.*`, `sidebar.*`, `bottomNav.*`

**`src/i18n/uz.json`** ga qo'shimcha (allaqachon bor):
```json
{
  "auth": {
    "signIn": "Kirish",
    "signUp": "Ro'yxatdan o'tish",
    "signOut": "Chiqish",
    "forgotPassword": "Parolni unutdingizmi?",
    "email": "Elektron pochta",
    "password": "Parol",
    "confirmPassword": "Parolni tasdiqlang",
    "createAccount": "Akkaunt yaratish",
    "alreadyHaveAccount": "Akkountingiz bormi? Kiring",
    "dontHaveAccount": "Akkountingiz yo'qmi? Ro'yxatdan o'ting"
  },
  "nav": {
    "dashboard": "Bosh sahifa",
    "lessons": "Darslar",
    "vocabulary": "Lug'at",
    "grammar": "Grammatika",
    "speaking": "Gapirish",
    "writing": "Yozish",
    "listening": "Tinglash",
    "reading": "O'qish",
    "mockTest": "Sinov imtihon",
    "profile": "Profil",
    "settings": "Sozlamalar"
  },
  "loading": {
    "ai": "AI tahlil qilmoqda...",
    "lesson": "Dars yuklanmoqda...",
    "estimated": "Taxminan {{seconds}} soniya"
  }
}
```

---

## F1-5. ✅ Noaniq (Ko'p Javobli) Mashqlarni Aniqlash va Tuzatish
**Muammo:** `fill-blank` mashqlarda kontekst yetarli bo'lmaganda bir nechta javob to'g'ri bo'ladi, lekin tizim faqat bittasini to'g'ri deb belgilaydi.

**Real misol:**
```
❌ Noto'g'ri savol:
  "___ is my book."
  Kutilgan javob: "This"
  Lekin "That" ham 100% grammatik to'g'ri!

✅ To'g'ri savol:
  "___ is my book. (yaqin narsa haqida)"
  Yoki: "You are holding a book. Say: '___ is my book.'"
```

**Ta'sir:** Ingliz tili pedagog +1.0, Yangi boshlovchi +0.8, O'zbek tili ustozi +0.3

---

### Qaysi holatlar noaniq bo'ladi?

| Tur | Misol | Nima noto'g'ri |
|-----|-------|----------------|
| This / That / These / Those | "___ is my book." | Ikkalasi ham to'g'ri |
| A / An / The | "___ apple is red." | Kontekstga qarab ikkalasi ham |
| Present Simple / Present Cont | "She ___ tea every morning." | drinks/is drinking — kontekstsiz |
| Will / Going to | "I ___ help you." | Ikkalasi ham to'g'ri |
| Some / Any | "Do you have ___ milk?" | Any standart, some ham mumkin |
| Much / Many | "There is ___ water." | Much to'g'ri, a lot of ham |
| Can / Could / May | "___ you help me?" | Uchalasi ham to'g'ri |
| Say / Tell | "___ me the truth." | Tell to'g'ri, lekin "say" ham foydalaniladi |

---

### Yechim 1: Ko'p To'g'ri Javoblar (`acceptedAnswers`)

**`DailyExercise` interfeysi ga yangi maydon qo'shing:**
```typescript
interface FillBlankExercise {
  id: number
  type: 'fill-blank'
  question: string
  blanks: string[]          // Asosiy to'g'ri javoblar
  acceptedAnswers?: string[][] // Har blank uchun qabul qilinadigan barcha variantlar
  explanation: string
}

// Misol:
{
  id: 1001,
  type: 'fill-blank',
  question: "___ is my book.",
  blanks: ['This'],
  acceptedAnswers: [['This', 'That']],  // blank[0] uchun ikkala ham to'g'ri
  explanation: "'This' yaqin, 'That' uzoq — ikkalasi ham grammatik to'g'ri"
}
```

**`ExerciseCard.tsx` da tekshirish logikasini yangilang:**
```typescript
function checkFillBlank(
  userAnswers: string[],
  exercise: FillBlankExercise
): { correct: boolean; feedback: string } {
  const allCorrect = userAnswers.every((ans, i) => {
    const accepted = exercise.acceptedAnswers?.[i] ?? [exercise.blanks[i]]
    return accepted.some(a => a.toLowerCase().trim() === ans.toLowerCase().trim())
  })
  
  if (allCorrect) {
    // Agar asosiy javobdan farqli (lekin to'g'ri) javob bergan bo'lsa
    const isAlternative = userAnswers.some((ans, i) => 
      ans.toLowerCase() !== exercise.blanks[i].toLowerCase()
    )
    return {
      correct: true,
      feedback: isAlternative
        ? `✅ To'g'ri! (${exercise.blanks.join(', ')} ham ishlatish mumkin)`
        : '✅ To'g'ri!'
    }
  }
  return { correct: false, feedback: `❌ To'g'ri javob: ${exercise.blanks.join(', ')}` }
}
```

---

### Yechim 2: Kontekst Qo'shish (Afzalroq)

Ko'p hollarda to'g'ri yechim — savolni aniqlashtirish:

```typescript
// ❌ Noaniq:
{ question: "___ is my book." }

// ✅ Aniq — kontekst bilan:
{ question: "You are pointing at a book on the desk in front of you: '___ is my book.'" }

// ✅ Aniq — rasmli yoki klue bilan:
{ question: "___ is my book. (yaqin, qo'lingizda)",
  instruction: "Yaqin narsa uchun qaysi so'z ishlatiladi?" }

// ✅ Aniq — multiple-choice ga o'tkazish:
{ type: 'multiple-choice',
  question: "You are holding a book. Which is correct?",
  options: ['This is my book', 'That is my book', 'These is my book', 'Those is my book'],
  correct: 'This is my book' }
```

---

### Amalga oshirish: Audit Skript

**`scripts/find-ambiguous-exercises.ts`** faylini yarating:

```typescript
import { getAllLessons } from '../src/data/daily/index'

// Noaniq bo'lishi mumkin bo'lgan pattern lar
const AMBIGUOUS_PATTERNS = [
  {
    pattern: /^(this|that|these|those)\s/i,
    words: ['this', 'that', 'these', 'those'],
    reason: 'Demonstrative pronouns — kontekstsiz ikkalasi ham to'g'ri'
  },
  {
    pattern: /^(a|an|the)\s/i,
    words: ['a', 'an', 'the'],
    reason: 'Articles — kontekstsiz ikkalasi ham mumkin'
  },
  {
    pattern: /\b(will|going to)\b/i,
    words: ['will', 'going to', "'ll"],
    reason: 'Future forms — ko\'pincha ikkalasi ham to\'g\'ri'
  },
  {
    pattern: /\b(can|could|may|might)\b/i,
    words: ['can', 'could', 'may', 'might'],
    reason: 'Modal verbs — kontekstsiz bir nechta to'g'ri'
  },
  {
    pattern: /\b(some|any)\b/i,
    words: ['some', 'any'],
    reason: 'Quantifiers — muhit farqsiz ikkalasi mumkin'
  },
]

export function findAmbiguousExercises() {
  const lessons = getAllLessons()
  const flagged: Array<{
    lessonId: string; exerciseId: number;
    question: string; blank: string; reason: string
  }> = []

  for (const lesson of lessons) {
    for (const ex of lesson.exercises) {
      if (ex.type !== 'fill-blank') continue

      for (const blank of ex.blanks) {
        for (const p of AMBIGUOUS_PATTERNS) {
          if (p.words.some(w => w.toLowerCase() === blank.toLowerCase())) {
            // Kontekst so'zi savolda bormi?
            const hasContext = /\b(near|far|close|here|there|always|every day|now|at the moment)\b/i
              .test(ex.question + ' ' + (ex.instruction ?? ''))

            if (!hasContext) {
              flagged.push({
                lessonId: lesson.id,
                exerciseId: ex.id,
                question: ex.question,
                blank,
                reason: p.reason
              })
            }
            break
          }
        }
      }
    }
  }

  console.log(`\n🔍 ${flagged.length} ta noaniq mashq topildi:\n`)
  for (const f of flagged) {
    console.log(`  [${f.lessonId}] ID:${f.exerciseId}`)
    console.log(`  Savol: "${f.question}"`)
    console.log(`  Blank: "${f.blank}" — ${f.reason}`)
    console.log()
  }

  return flagged
}

findAmbiguousExercises()
```

**`package.json`** ga qo'shing:
```json
"audit:ambiguous": "tsx scripts/find-ambiguous-exercises.ts",
"audit:ambiguous:fix": "tsx scripts/find-ambiguous-exercises.ts --auto-fix"
```

---

### Tuzatish Prioriteti

| Tur | Usul | Miqdor (taxminiy) |
|-----|------|-------------------|
| This/That/These/Those | Kontekst qo'sh yoki `acceptedAnswers` | ~50–80 ta |
| A/An/The | Kontekst aniqlashtir | ~30–50 ta |
| Will/Going to | Kontekst yoki multiple-choice | ~20–40 ta |
| Modal verbs | Multiple-choice ga o'tkazish afzal | ~15–25 ta |
| Some/Any | `acceptedAnswers` ga ikkalasini qo'sh | ~10–20 ta |
| **JAMI** | | **~125–215 ta** |

---

### "Partial Credit" (Qisman To'g'ri) Logikasi

Ba'zi mashqlarda foydalanuvchi to'g'ri grammatik javob beradi, lekin o'rganilayotgan qoida boshqa so'z talab qiladi. Bunday holda:

```typescript
// Misol: will ni o'rgatish uchun savol
{
  question: "Oh no! I forgot my wallet. I ___ go back and get it!",
  blanks: ["'ll"],           // To'g'ri: will (spontan qaror)
  acceptedAnswers: [["'ll", "will"]],
  partialCredit: ["am going to"],  // Grammatik to'g'ri, lekin bu darsda will kerak
  partialFeedback: "Grammatik to'g'ri, lekin bu holatda 'will' aniqroq — spontan qaror!"
}
```

---

## F1-6. ✅ CI/CD — GitHub Actions
**Muammo:** Har bir PR/commit da test va typecheck o'tkazilmaydi — regression xavfi
**Ta'sir:** Dasturchi +1.0

### Amalga oshirish:

**`.github/workflows/ci.yml`** yarating:
```yaml
name: CI
on: [push, pull_request]
jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm ci
      - run: npm run lint
      - run: npx tsc --noEmit
      - run: npm test -- --run
      - run: npm run build
```

**`package.json`** ga qo'shing:
```json
"validate:all": "npm run lint && npx tsc --noEmit && npm test -- --run && npm run build"
```

---

## F1-7. ✅ E2E Test (Playwright)
**Muammo:** Integration va E2E testlar yo'q — muhim user flow lar sinovdan o'tmaydi
**Ta'sir:** Dasturchi +0.8

### Amalga oshirish:

**`e2e/`** papkasi yarating:
```typescript
// e2e/auth-flow.spec.ts
import { test, expect } from '@playwright/test'

test('user can sign up, take a lesson, and see progress', async ({ page }) => {
  await page.goto('/')
  await page.click('text=Ro'yxatdan o'tish')
  await page.fill('[name=email]', 'test@test.com')
  await page.fill('[name=password]', 'Test123!')
  await page.click('text=Yaratish')
  
  await expect(page.locator('text=Bosh sahifa')).toBeVisible()
  await page.click('text=Kun 1')
  await page.waitForSelector('.exercise-card')
  
  // Complete an exercise
  await page.fill('input[type=text]', 'am')
  await page.click('text=Tekshirish')
  await expect(page.locator('.feedback-correct')).toBeVisible()
})
```

**`playwright.config.ts`** yarating va CI ga qo'shing.

---

## F1-8. ✅ Test Coverage Reporting
**Muammo:** Coverage threshold 30% (lib/services/store) — joriy 66% lines, 68% functions — **threshold met**
**Ta'sir:** Dasturchi +0.5

### Amalga oshirish:

**`vitest.config.ts`** ga qo'shing:
```typescript
test: {
  coverage: {
    provider: 'v8',
    reporter: ['text', 'lcov', 'html'],
    include: ['src/**/*.{ts,tsx}'],
    exclude: ['src/**/*.test.*', 'src/data/**', 'src/types/**'],
    thresholds: {
      statements: 30,
      branches: 20,
      functions: 25,
      lines: 30
    }
  }
}
```

**CI ga codecov integratsiyasi:** PR larda coverage o'zgarishi ko'rsatilsin.

---

## F1-9. ✅ Dexie IndexedDB Sync Conflict Resolution
**Muammo:** Supabase ↔ Dexie sync da conflict bo'lsa, "last-write-wins" — ma'lumot yo'qolishi mumkin
**Ta'sir:** Dasturchi +0.3

### Amalga oshirish:

**`src/lib/sync.ts`** da smart merge strategiyasi:
```typescript
interface SyncConflict {
  local: any
  remote: any
  field: string
}

function resolveConflict(conflict: SyncConflict): any {
  // 1. If one is null → other wins
  // 2. If timestamps differ by > 5s → latest wins
  // 3. If close → merge (max of progress fields)
  const timeDiff = Math.abs(
    new Date(conflict.local.updated_at).getTime() - 
    new Date(conflict.remote.updated_at).getTime()
  )
  if (timeDiff > 5000) {
    return timeDiff > 0 ? conflict.remote : conflict.local
  }
  // Smart merge: take max of numeric fields, union of arrays
  return { ...conflict.local, ...conflict.remote,
    xp: Math.max(conflict.local.xp, conflict.remote.xp),
    streak: Math.max(conflict.local.streak, conflict.remote.streak)
  }
}
```

---

## F1-10. ✅ Offline Banner UX
**Muammo:** Hozirgi offline banner oddiy — qaysi funksiyalar ishlashini ko'rsatmaydi
**Ta'sir:** Yangi boshlovchi +0.3, Dasturchi +0.2

### Amalga oshirish:

```tsx
// src/components/OfflineBanner.tsx
function OfflineBanner({ online }: { online: boolean }) {
  if (online) return null
  return (
    <div className="offline-banner fixed bottom-20 left-4 right-4 z-50">
      <p>❌ Internet yo'q</p>
      <small>✅ Darslar ishlaydi · ❌ AI Chat · ❌ Tandem · ✅ Lug'at</small>
    </div>
  )
}
```

---

# FAZA 2 — PEDAGOGIK MUKAMMALLASH
### Muddat: 3–6 hafta · Baho ta'siri: +1.8 umumiy ball

---

## F2-1. ✅ Grammar SRS — Eng Muhim Yaxshilanish
**Muammo:** FSRS-5 faqat lug'at uchun ishlaydi. Grammatika qoidalari unutiladi (Ebbinghaus: 1 kundan keyin ~50% yo'qoladi)
**Ta'sir:** Yodlash olimi +2.0, Ingliz tili pedagog +0.5

**Bajarilgan:** `grammarSrs.ts` FSRS-5 bilan, `/review` page, WeakAreasCard, MixedReview, 138 test. localStorage da ishlaydi (Supabase emas).

### Loyiha arxitekturasi (kelajakdagi yaxshilanish uchun):

**Supabase da yangi jadval:**
```sql
CREATE TABLE grammar_srs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  rule_key TEXT NOT NULL,        -- 'future-forms-review:rule-1'
  lesson_id TEXT NOT NULL,
  rule_index INTEGER NOT NULL,   -- rules[] massividagi o'rni
  -- FSRS maydonlari
  stability REAL DEFAULT 1.0,
  difficulty REAL DEFAULT 5.0,
  due DATE DEFAULT CURRENT_DATE,
  reps INTEGER DEFAULT 0,
  lapses INTEGER DEFAULT 0,
  last_review TIMESTAMPTZ,
  UNIQUE(user_id, rule_key)
);
```

**Yangi `DailyLesson` interfeysi:**
```typescript
// src/data/dailyLessons.ts ga qo'shing
export interface GrammarRule {
  key: string           // unique: 'future-will-rule'
  title: string         // qisqa nom: 'Will — Spontan qarorlar'
  content: string       // to'liq qoida matni
  reviewQuestion: string // 'Will qachon ishlatiladi?'
  reviewAnswer: string   // 'Spontan qarorlar, va\'dalar, bashoratlar uchun'
  srsEnabled: boolean
}
```

**`src/services/grammarSrsService.ts`** yarating:
```typescript
import { supabase } from '../lib/supabase'
import { scheduleReview, ratingToGrade } from '../lib/srs'

export async function getDueGrammarRules(userId: string): Promise<GrammarSrsCard[]> {
  const today = new Date().toISOString().split('T')[0]
  const { data } = await supabase
    .from('grammar_srs')
    .select('*')
    .eq('user_id', userId)
    .lte('due', today)
    .order('due')
    .limit(20)
  return data ?? []
}

export async function reviewGrammarRule(
  userId: string,
  ruleKey: string,
  rating: 'bilmadim' | 'qiynaldim' | 'bildim' | 'yodladim'
): Promise<void> {
  const grade = ratingToGrade(rating)
  const { data: existing } = await supabase
    .from('grammar_srs')
    .select('*')
    .eq('user_id', userId)
    .eq('rule_key', ruleKey)
    .single()

  const newState = scheduleReview(
    existing ? { stability: existing.stability, difficulty: existing.difficulty,
                 reps: existing.reps, lapses: existing.lapses } : null,
    grade
  )
  
  await supabase.from('grammar_srs').upsert({
    user_id: userId,
    rule_key: ruleKey,
    ...newState,
    last_review: new Date().toISOString()
  })
}
```

**`src/components/dailyLesson/GrammarReviewCard.tsx`** yarating:
```tsx
// Dars o'tilgandan 2 kun, 7 kun, 21 kun keyin qayta ko'rsatiluvchi
// qoida kartochkasi. Foydalanuvchi 'Bildim / Qiynaldim / Bilmadim' ni
// bosadi va FSRS keyingi ko'rsatish vaqtini hisoblab beradi.
export default function GrammarReviewCard({ rule, onRate }) {
  const [revealed, setRevealed] = useState(false)
  return (
    <div className="card">
      <p className="question">{rule.reviewQuestion}</p>
      {!revealed ? (
        <button onClick={() => setRevealed(true)}>Javobni ko'rish</button>
      ) : (
        <>
          <p className="answer">{rule.reviewAnswer}</p>
          <div className="rating-buttons">
            <button onClick={() => onRate('bilmadim')}>Bilmadim 😟</button>
            <button onClick={() => onRate('qiynaldim')}>Qiynaldim 🤔</button>
            <button onClick={() => onRate('bildim')}>Bildim 😊</button>
            <button onClick={() => onRate('yodladim')}>Yodladim 🌟</button>
          </div>
        </>
      )}
    </div>
  )
}
```

**Dashboard ga "Bugungi Grammar Review" widget qo'shing:**
```
📚 Bugungi grammatika takrorlash: 5 ta qoida kutmoqda
   [Will — Spontan qarorlar] [Going to — Rejalar] ...
```

---

## F2-2. ✅ ️ Interleaved Practice (Aralash Mashqlar)
**Muammo:** Barcha mashqlar bir mavzuda ketma-ket (massed practice). Tadqiqotlar: interleaved practice 40–60% samaraliroq
**Ta'sir:** Yodlash olimi +1.5

### Amalga oshirish:

**Har bir darsning Section 4 va 5 ni o'zgartiriladi:**

Hozir:
```
Section 3 (Qiyin): [will: 5 ta mashq]
Section 4 (Inkor): [will: 5 ta mashq]
Section 5 (O'zgartirish): [will: 5 ta mashq]
```

Kerak:
```
Section 3 (Qiyin):        [will: 3 + going_to: 2]
Section 4 (Inkor):        [will_vs_going_to: 3 + present_cont: 2]
Section 5 (O'zgartirish): [will: 1 + going_to: 1 + present_cont: 1 + present_simple: 2]
```

**`scripts/add-interleaved-exercises.ts`** skript yozing — bu skript qo'lda yozilgan aralash mashqlarni Section 4–5 ga qo'shadi.

**Har bir A2–B2 darsi uchun qo'shilishi kerak bo'lgan interleaved mashqlar:**
```typescript
// B1 Future Forms darsi — Section 5 ga qo'shing:
{ id: 40021, type: 'multiple-choice',
  instruction: "To'g'ri kelasi zamon shaklini tanlang:",
  question: 'The bus ___ at 8:30. (jadval)',
  options: ['will leave', 'is going to leave', 'leaves', 'is leaving'],
  correct: 'leaves',
  explanation: "Jadval → Present Simple for Future" },

{ id: 40022, type: 'multiple-choice',
  instruction: "To'g'ri kelasi zamon shaklini tanlang:",
  question: 'Oh no, I forgot my wallet. I ___ back and get it! (spontan qaror)',
  options: ['am going to go', 'will go', 'am going', 'go'],
  correct: 'will go',
  explanation: "Hozir qabul qilingan qaror → Will" },
```

---

## F2-3. ✅ Produktiv Ko'nikmalar Integratsiyasi
**Muammo:** Speaking/Writing darslarga integratsiyalashmagan — alohida tab
**Ta'sir:** Ingliz tili pedagog +1.0

**Bajarilgan:** 107 writing section + AI evaluation (IELTS-style 4 criteria), speech recognition + AI evaluation (acoustic analysis), 75 kunlik speaking path, har darsda writing/speaking tab.

### Kelajakdagi yaxshilanish (microTasks):



**`DailyLesson` interfeysi ga yangi maydon:**
```typescript
microTasks?: {
  speaking: {
    prompt: string       // "Will ishlatib, 3 ta bashorat aytib ko'ring"
    duration: 30         // sekund
    level: 'A1'|'A2'|'B1'|'B1+'|'B2'
  }
  writing: {
    prompt: string       // "Going to ishlatib, hafta rejangizni 3 gapda yozing"
    wordLimit: number    // 30–50 words
    keyStructures: string[] // ['going to', 'next week', 'I plan to']
  }
}
```

**LessonView.tsx da "Darsni Yakunlash" tugmasidan oldin mikro-task:**
```tsx
{lesson.microTasks && (
  <div className="micro-task-card">
    <h3>✍️ Qo'llang!</h3>
    <p>{lesson.microTasks.writing.prompt}</p>
    <textarea placeholder="Bu yerga yozing..." maxLength={200} />
    <button onClick={handleMicroTaskSubmit}>AI bilan tekshir</button>
  </div>
)}
```

**Barcha 89+ dars uchun micro-task namunasi:**

| Dars | Writing mikro-task |
|------|-------------------|
| Future Forms (B1) | "Ertangi kuningizni 4 turli shaklda tasvirlab bering: will, going to, present cont, jadval" |
| Present Perfect (A2) | "Hayotingizda 3 ta ish: 'I have never...', 'I have already...', 'Have you ever...?'" |
| Conditionals (B1+) | "Agar ingliz tilini yaxshi bilsangiz, nima qilgan bo'lar edingiz? 3 ta gap" |
| Argument Structure (B2) | "Exercise is important. PEEL paragraph yozing" |

---

## F2-4. ✅ Audio Qo'shish — A1/A2 Darslari
**Muammo:** Yangi boshlovchi talaffuzni eshitmasdan o'rganadi
**Ta'sir:** Yangi boshlovchi +1.5

### Yechim: Web Speech API + Premium TTS

**`src/lib/tts.ts` ni kengaytiring:**
```typescript
export async function speakFormula(text: string, rate = 0.85): Promise<void> {
  // Avval browser TTS ishlatiladi (bepul)
  // Premium: ElevenLabs yoki Google TTS API
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'en-US'
  utterance.rate = rate
  utterance.pitch = 1.0
  
  // US aksenti uchun eng yaxshi ovoz
  const voices = speechSynthesis.getVoices()
  const preferred = voices.find(v => 
    v.lang === 'en-US' && v.name.includes('Google')
  ) || voices.find(v => v.lang === 'en-US')
  
  if (preferred) utterance.voice = preferred
  speechSynthesis.speak(utterance)
}
```

**ExerciseCard.tsx da har bir savolga audio tugma:**
```tsx
// Har bir fill-blank va error-correction savoli yonida
<button 
  onClick={() => speakFormula(exercise.question, 0.8)}
  className="audio-btn"
  aria-label="Eshiting"
>
  🔊
</button>
```

**Formula kartochalari uchun:**
```tsx
// FormulaCard.tsx da har bir formula yonida
<AudioButton text={formula.structure} rate={0.75} />
```

---

## F2-5. ✅ Kontekstli Mashqlar (Mini-Passages) — BAJARILDI
**Muammo:** ~80% mashqlar izolyatsiyalangan jumlalar. Kontekstda o'rganish 3x samaraliroq
**Ta'sir:** Ingliz tili pedagog +0.8

**Holat:** `passage` mashq turi to'liq qo'shildi — `DailyExercise` union (dailyLessons.ts),
ExerciseCard render (matn ichida inline inputlar, `___(n)` markerlari), `checkAnswer`
(blanks + acceptedAnswers), va markazlashtirilgan `getExerciseContext`/`getCorrectText`
helper'lari orqali LessonView/ReviewView/SpecialCaseCard'da xavfsiz ko'rsatish. Birinchi
namuna kontent comparatives darsiga qo'shildi ("Chuqur o'rganish" bo'limi). Test'lar bilan
qoplangan (helpers.test.ts). Qolgan darslarga kontent inkremental qo'shilishi mumkin.

### Yangi mashq turi: `passage`

```typescript
// DailyExercise ga yangi type qo'shing
interface PassageExercise {
  id: number
  type: 'passage'
  instruction: string
  passage: string      // 3–5 jumlali matn, ___ bo'sh joy bilan
  blanks: string[]     // barcha bo'sh joylarning javoblari
  options?: string[]   // agar multiple-choice bo'lsa
  explanation: string
}
```

**Misol (B1 Future Forms darsi uchun):**
```typescript
{ id: 40025, type: 'passage',
  instruction: "Matn ichidagi bo'sh joylarni to'ldiring:",
  passage: `Sarah has a busy week ahead. She ___(1) meet her doctor on Monday 
  — she arranged it last week. On Tuesday, she ___(2) probably attend a 
  conference, but she's not sure yet. She ___(3) start her new diet on 
  Wednesday — she's been planning it for months. Her train ___(4) at 6 AM 
  on Friday — she already has the ticket.`,
  blanks: ['is meeting', 'will', 'is going to', 'leaves'],
  explanation: "(1) kelishuv → PC, (2) ishonchsiz bashorat → will probably, (3) aniq reja → going to, (4) jadval → PS" }
```

---

## F2-6. ✅ "90 kunda B2" Da'vosini O'zgartirish
**Muammo:** Realistik emas — CEFR A2→B2 uchun 400–600 soat kerak. Kutishlarni noto'g'ri shakllantiradi
**Ta'sir:** Faylasuf +0.5, Yangi boshlovchi +0.3

### Onboarding o'zgarishlari:

**Hozirgi:** "90 kunda A2+ dan B2 ga"

**Tavsiya qilingan:**
```
"90 kunlik Intensiv Kurs"
subtext: "Har kuni 45–60 daqiqa × 90 kun = B1/B2 ga mustahkam poydevor"
note: "CEFR darajangiz o'rganish sur'atiga qarab farq qiladi"
```

**Placement test natijasiga qarab maqsad:**
```
A1 → 90 kunda A2+ (realistic)
A2 → 90 kunda B1+ (realistic)  
B1 → 90 kunda B2  (challenging, achievable)
```

---

## F2-7. ✅ ️ Mnemonika UI
**Muammo:** `mnemonic` maydoni bor, lekin faqat SpecialCases da ko'rsatiladi. Rules/Exercises uchun yo'q. Vizual mnemonikalar 3x samaraliroq
**Ta'sir:** Yodlash olimi +1.0

### Amalga oshirish:

**`src/components/dailyLesson/MnemonicCard.tsx`** yarating:
```tsx
interface MnemonicCardProps {
  rule: string
  mnemonic: string
  visual?: string  // emoji yoki SVG
  acronym?: string // FANBOYS, PEEL, etc.
}

export default function MnemonicCard({ rule, mnemonic, visual, acronym }: MnemonicCardProps) {
  return (
    <div className="mnemonic-card bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg">
      {visual && <span className="text-4xl">{visual}</span>}
      {acronym && (
        <div className="acronym-display">
          {acronym.split('').map((char, i) => (
            <span key={i} className="acronym-char">{char}</span>
          ))}
        </div>
      )}
      <p className="mnemonic-text">{mnemonic}</p>
    </div>
  )
}
```

**Har bir maxsus qoida uchun mnemonic yarating:**

| Qoida | Mnemonic |
|-------|----------|
| Be verb | "**I A**m **al**ways **right**! He/She/It **IS** king. **YOU**, **WE**, **THEY are** fine." → IAright → IS → THEY ARE |
| Good morning times | "M-A-E-N: Morning(06), Afternoon(12), Evening(18), Night(uyqu)" |
| PEEL paragraph | 🍎 PEEL = Olma. Point=po'choq, Evidence=meva, Explanation=shira, Link=dum |
| Will vs Going to | "WILL = Hozir qaror ⚡. GOING TO = Allaqachon reja 📅" |
| Present Perfect signal words | "JAFAR: Just, Already, For/since, Already, Recently" |

---

## F2-8. ✅ ️ Writing AI Evaluation — Barcha Darslarga
**Muammo:** Writing evaluation faqat IELTS style da — A1/A2 darajasi uchun soddaroq evaluation kerak
**Ta'sir:** Ingliz tili pedagog +0.5

### Amalga oshirish:

**`src/lib/claude.ts`** ga qo'shimcha:
```typescript
const WRITING_PROMPTS: Record<string, string> = {
  A1: `Foydalanuvchi ingliz tilida yozdi. Daraja: A1.
  Baholang: (1) Grammatik to'g'rilik (1-5), (2) Vazifani bajarish (1-5).
  ​Faqat 1 ta eng muhim xatoni tuzating. Javob o'zbek tilida.`,
  A2: `Daraja: A2.
  Baholang: (1) Grammatik to'g'rilik (1-5), (2) Leksika xilma-xilligi (1-5),
  (3) Vazifani bajarish (1-5). 2 ta xatoni tuzating.`,
  B1: `Daraja: B1.
  Baholang: (1) Grammatik to'g'rilik, (2) Leksika, (3) Bog'liqlik (coherence),
  (4) Vazifani bajarish. 3 ta xatoni tuzating.`
}

export async function evaluateWritingLevel(
  text: string, level: string, prompt: string
): Promise<WritingFeedback> {
  return callClaude(WRITING_PROMPTS[level] ?? WRITING_PROMPTS.B1,
    `Prompt: ${prompt}\nFoydalanuvchi: ${text}`)
}
```

**`src/services/writingService.ts`** da `evaluateWriting` chaqiruvini level bo'yicha yangilash.

---

## F2-9. ✅ ️ Speaking Bo'limini Daily Lessons ga Integratsiya
**Muammo:** SpeakingPath alohida — daily lesson da speaking prompt yo'q
**Ta'sir:** Ingliz tili pedagog +0.5, Yodlash olimi +0.3

### Amalga oshirish:

**`DailyLesson` interfeysi** ga yangi maydon:
```typescript
microTasks?: {
  speaking?: {
    prompt: string      // "Will ishlatib 3 ta bashorat aytib ko'ring"
    duration: 30        // sekund
  }
  writing?: {
    prompt: string
    wordLimit: number
  }
}
```

**Har bir darsga micro-task qo'shish (A2+ dan yuqori):**

| Dars | Speaking Prompt |
|------|-----------------|
| Future Forms (B1) | "Ertangi kuningizni 4 turda: will, going to, PC, jadval" |
| Present Perfect (A2) | "3 ta gap: I have never..., I have already..., Have you ever...?" |
| Conditionals (B1+) | "Agar ingliz tilini bilsangiz, nima qilgan bo'lar edingiz?" |

---

## F2-10. ⚠️ Curriculum Gap Analysis
**Muammo:** CEFR can-do statements va vocabulary frequency audit qilinmagan
**Ta'sir:** Ingliz tili pedagog +0.5, Yodlash olimi +0.3

### Amalga oshirish:

**`scripts/cefr-audit.ts`**:
```typescript
// Har bir darsning goalUz/subtitle ni CEFR checklists bilan solishtirish
const CEFR_CAN_DO: Record<string, string[]> = {
  A1: ['Can introduce myself', 'Can understand basic phrases',
       'Can ask simple questions', 'Can write short notes'],
  A2: ['Can describe my background', 'Can handle short social exchanges',
       'Can understand simple directions', 'Can write short letters'],
  // ...
}

export function auditCEFR(lesson: DailyLesson): string[] {
  const missing = []
  const levelCanDo = CEFR_CAN_DO[lesson.level]
  for (const cando of levelCanDo) {
    const matched = lesson.exercises.some(ex =>
      ex.question.toLowerCase().includes(cando.toLowerCase().slice(0, 30))
    )
    if (!matched) missing.push(cando)
  }
  return missing
}
```

**Vocabulary frequency audit:**
```typescript
// BNC/COCA top-2000 so'zlar bilan dars vocabulary sini solishtirish
// Kam uchraydigan so'zlarni almashtirish
```

---

# FAZA 3 — TEXNIK MUKAMMALLASH
### Muddat: 4–8 hafta · Baho ta'siri: +1.2 umumiy ball

---

## F3-1. ⚠️ Kontent TypeScript Fayllaridan CMS ga Ko'chirish (boshlangan ✅)
**Muammo:** 106 dars TS fayllarida hardcode. Kontent tahrirlash uchun dasturchi kerak. ~40,000+ qator TypeScript
**Ta'sir:** Dasturchi +1.0

### Migratsiya rejasi:

**Bosqich 1: Supabase ni asosiy manba sifatida qayta loyihalash**

Hozirgi `lessons` jadvali — faqat seed ma'lumotlari. Yangi arxitektura:

```sql
-- Asosiy kontent jadvali
CREATE TABLE lessons_content (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  subtitle TEXT,
  level TEXT NOT NULL,        -- 'A1', 'A2', 'B1', 'B1+', 'B2'
  day INTEGER NOT NULL,
  category TEXT,
  formulas JSONB DEFAULT '[]',
  rules JSONB DEFAULT '[]',   -- string[]
  vocabulary JSONB DEFAULT '[]',
  examples JSONB DEFAULT '[]',
  special_cases JSONB DEFAULT '[]',
  exercises JSONB DEFAULT '[]',
  exercise_sections JSONB DEFAULT '[]',
  tests JSONB DEFAULT '[]',
  test_sections JSONB DEFAULT '[]',
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  version INTEGER DEFAULT 1
);

-- Admin faqat Supabase Dashboard orqali tahrirlaydi
-- Yoki maxsus admin paneli orqali
```

**Bosqich 2: `lessonService.ts` ni yangilash**

```typescript
// Hozirgi: TS fayllardan import
// Yangi: Supabase dan fetch + IndexedDB cache

export async function loadLesson(lessonId: string): Promise<DailyLesson> {
  // 1. IndexedDB cache tekshir
  const cached = await getCachedLesson(lessonId)
  if (cached && !isStale(cached.updatedAt)) return cached.data
  
  // 2. Supabase dan yuklash
  const { data } = await supabase
    .from('lessons_content')
    .select('*')
    .eq('id', lessonId)
    .single()
  
  // 3. Cache'ga saqlash
  await cacheLesson(lessonId, data)
  return castLesson(data)
}
```

**Bosqich 3: Migration script**

```typescript
// scripts/migrate-to-cms.ts
import { getAllLessons } from '../src/data/daily/index'
import { supabaseAdmin } from './supabase-admin'

async function migrateLessons() {
  const lessons = getAllLessons()
  
  for (const lesson of lessons) {
    await supabaseAdmin.from('lessons_content').upsert({
      id: lesson.id,
      title: lesson.title,
      // ... barcha maydonlar
      exercises: lesson.exercises,
      exercise_sections: lesson.exerciseSections,
      // ...
    })
    console.log(`Migrated: ${lesson.id}`)
  }
}
```

---

## F3-2. ✅ `claude.ts` ni Modullarga Ajratish — BAJARILDI
**Muammo:** `src/lib/claude.ts` 1300+ qator — Single Responsibility buzilgan
**Ta'sir:** Dasturchi +0.5

**Holat:** `claude.ts` (59 qator) toza barrel/re-export. Monolit `claudePrompts.ts`
(1018 qator) domen modullariga bo'lindi: `src/lib/ai/claude-grammar.ts`,
`claude-vocab.ts`, `claude-speaking.ts`, `claude-exercises.ts`, `claude-writing.ts`,
`claude-duel.ts`. Har biri faqat o'ziga kerakli `claudeClient` importlarini oladi.
26 ta consumer barrel orqali ishlaydi — birortasi o'zgartirilmadi. tsc 0, lint 0,
46 ta AI testi yashil. (`claudeClient.ts` 121q, `claudeChat.ts` 395q allaqachon ajratilgan edi.)

### Yangi struktura:
```
src/lib/ai/
├── index.ts              — re-exports
├── claude-client.ts      — base fetch, streaming, error handling
├── claude-chat.ts        — AI buddy suhbat
├── claude-grammar.ts     — grammar check & exercise evaluation
├── claude-writing.ts     — IELTS writing feedback
├── claude-speaking.ts    — speaking assessment
├── claude-exercises.ts   — exercise auto-check
└── prompts/
    ├── grammar-prompts.ts
    ├── writing-prompts.ts
    └── speaking-prompts.ts
```

**`claude-client.ts`:**
```typescript
export async function callClaude<T>(
  systemPrompt: string,
  userMessage: string,
  options: ClaudeOptions = {}
): Promise<T> {
  const response = await fetch('/api/claude', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      model: options.model ?? import.meta.env.VITE_CLAUDE_MODEL,
      max_tokens: options.maxTokens ?? 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }]
    })
  })
  if (!response.ok) throw new AppError('AI_ERROR', await response.text())
  return response.json()
}
```

---

## F3-3. ⚠️ Test Coverage oshirish (ExerciseCard qoplandi ✅, LessonView qoldi)
**Muammo:** Komponent testlari juda kam. `LessonView.tsx`, `ExerciseCard.tsx` kabi murakkab komponentlar test qilinmagan
**Ta'sir:** Dasturchi +0.5

**Holat:** `ExerciseCard.test.tsx` qo'shildi (12 test) — barcha mashq turlari uchun
render + interaksiya: fill-blank, multiple-choice, va yangi `passage`/`connection`
(input/onChange, to'g'ri/noto'g'ri submit feedback, namuna javob). AudioButton va
gameFeel mock qilingan. `LessonView.tsx` (juda katta, Supabase'ga bog'liq) keng mock
talab qiladi — keyingi bosqichda. Jami test: 1108 yashil.

### Qo'shilishi kerak bo'lgan testlar:

**`src/data/daily/__tests__/lessonData.test.ts`:**
```typescript
import { getAllLessons } from '../index'

describe('Lesson Data Integrity', () => {
  const lessons = getAllLessons()

  test('No duplicate exercise IDs across all lessons', () => {
    const ids = new Map<number, string>()
    for (const lesson of lessons) {
      for (const ex of [...lesson.exercises, ...lesson.tests]) {
        expect(ids.has(ex.id)).toBe(false) // if fails, shows which lesson
        ids.set(ex.id, lesson.id)
      }
    }
  })

  test('All exerciseSection IDs exist in exercises', () => {
    for (const lesson of lessons) {
      const exerciseIds = new Set(lesson.exercises.map(e => e.id))
      for (const section of lesson.exerciseSections) {
        for (const id of section.ids) {
          expect(exerciseIds.has(id)).toBe(true)
        }
      }
    }
  })

  test('fill-blank exercises have matching blank count', () => {
    for (const lesson of lessons) {
      for (const ex of lesson.exercises) {
        if (ex.type === 'fill-blank') {
          const blanksInQuestion = (ex.question.match(/___/g) || []).length
          expect(ex.blanks.length).toBe(blanksInQuestion)
        }
      }
    }
  })

  test('error-correction errorPart exists in question', () => {
    for (const lesson of lessons) {
      for (const ex of lesson.exercises) {
        if (ex.type === 'error-correction') {
          expect(ex.question.toLowerCase()).toContain(ex.errorPart.toLowerCase())
        }
      }
    }
  })
})
```

**`src/components/dailyLesson/__tests__/ExerciseCard.test.tsx`:**
```typescript
describe('ExerciseCard', () => {
  it('renders fill-blank with correct number of inputs', () => {
    const exercise = mockFillBlank({ question: 'I ___ a student.', blanks: ['am'] })
    render(<ExerciseCard exercise={exercise} onAnswer={vi.fn()} />)
    expect(screen.getAllByRole('textbox')).toHaveLength(1)
  })

  it('shows correct answer feedback after submission', async () => {
    const exercise = mockMultipleChoice({ correct: 'is' })
    const onAnswer = vi.fn()
    render(<ExerciseCard exercise={exercise} onAnswer={onAnswer} />)
    await userEvent.click(screen.getByText('is'))
    expect(onAnswer).toHaveBeenCalledWith(['is'])
  })
})
```

---

## F3-4. ❌ Incremental Seed (Faqat O'zgarganlarni Yuklash)
**Muammo:** `npm run seed:all` har safar 106 darsni yuklaydi
**Ta'sir:** Dasturchi +0.2

**`scripts/seed-supabase.ts`** ni yangilash:
```typescript
async function seedIncremental() {
  const lessons = getAllLessons()
  
  // Supabase dan mavjud version raqamlarini oling
  const { data: existing } = await supabase
    .from('lessons')
    .select('id, updated_at')
  
  const existingMap = new Map(existing?.map(r => [r.id, r.updated_at]))
  
  const toUpdate = lessons.filter(lesson => {
    // Mavjud bo'lmasa yoki hash farqli bo'lsa yuklash
    const hash = computeHash(lesson)
    return !existingMap.has(lesson.id) || existingMap.get(lesson.id) !== hash
  })
  
  console.log(`📊 ${toUpdate.length}/${lessons.length} dars yangilanishi kerak`)
  // Faqat o'zgarganlarni upsert qiling
}
```

---

## F3-5. ✅ TypeScript `any` ni Bartaraf Etish — BAJARILDI
**Muammo:** `claude.ts` va ba'zi xizmatlarda `any` tipi ishlatilgan
**Ta'sir:** Dasturchi +0.3

**Holat:** Ishlab chiqarish kodida `any` 0 ta. Oxirgi haqiqiy `any`
(`contentService.ts` saveScore dinamik jadval upserti) minimal tiplangan
`UpsertableTable` interfeysiga almashtirildi — `eslint-disable` ham olib tashlandi.
Qolgan yagona `any` test infratuzilmasida (`test/setup.ts` console mock) — qoldirildi.
claude.ts F3-2 da modullarga bo'linib, u yerdagi `any`lar ham tozalangan edi.

```typescript
// Hozir (noto'g'ri):
async function checkAnswer(exercise: any): Promise<any> { ... }

// To'g'ri:
async function checkAnswer(exercise: DailyExercise): Promise<ExerciseCheckResult> {
  // ...
}

interface ExerciseCheckResult {
  correct: boolean
  feedback: string
  suggestion?: string
  score?: number
}
```

---

## F3-6. ⚠️ ️ Adaptive Learning Engine
**Muammo:** Hamma o'quvchilar bir xil curriculum dan o'tadi — personalizatsiya yo'q
**Ta'sir:** Dasturchi +1.0, Yodlash olimi +0.5
**Ta'sir:** Dasturchi +1.0, Yodlash olimi +0.5

### Amalga oshirish:

**Knowledge Tracing:**
```typescript
// src/lib/knowledge-tracing.ts
// Bayesian Knowledge Tracing (BKT) — har bir rule ni o'zlashtirish ehtimolini hisoblash
interface BKTParams {
  pLearn: number   // o'rganish ehtimoli
  pGuess: number   // taxmin qilish ehtimoli
  pSlip: number    // xato qilish ehtimoli
  pKnown: number   // hozir bilish ehtimoli
}

export function updateBKT(params: BKTParams, correct: boolean): BKTParams {
  if (correct) {
    // P(K|correct) = P(K)*1 + P(~K)*P(L) / P(correct)
  } else {
    // P(K|incorrect) = P(K)*P(S) / P(incorrect)
  }
  return params
}
```

**Item Response Theory (IRT):**
```typescript
// 3PL model: P(correct) = c + (1-c) / (1 + exp(-a*(theta - b)))
// a=discrimination, b=difficulty, c=guessing, theta=ability
```

**Adaptive difficulty:**
```typescript
// Agar 3 ta ketma-ket to'g'ri → qiyinroq variant
// Agar 2 ta ketma-ket xato → osonroq variant
```

---

## F3-7. ⚠️ AI Tutor 2.0
**Muammo:** AI hozir faqat so'ralganda ishlaydi (Chat, Writing, Speaking). Real-time feedback yo'q
**Ta'sir:** Ingliz tili pedagog +0.8, Dasturchi +0.3

### Amalga oshirish:

**Real-time error feedback:**
```typescript
// Mashq bajarishda xato bo'lsa, darhol AI explanation
async function getRealTimeFeedback(
  exercise: DailyExercise, userAnswer: string
): Promise<string | null> {
  if (!isWrong(userAnswer, exercise)) return null
  return callClaude('Qisqa tushuntirish bering (1-2 gap, o'zbek tilida)', 
    `Savol: ${exercise.question}\nJavob: ${userAnswer}\nTo'g'ri: ${exercise.blanks[0]}`)
}
```

**AI conversation partner (Scenario-based):**
```typescript
// SpeakingPath dan olingan scenario → Chat.tsx ga integratsiya
interface Scenario {
  context: string
  role: string
  goal: string
  keyPhrases: string[]
}
```

**Weekly AI report:**
```
"Sizning kuchli tomonlaringiz: Present Perfect ✅
  Zaif joylar: Conditionals (62% accuracy) ⚠️
  Tavsiya: Day 82-83 ni qayta o'ting"
```

---

## F3-8. ⚠️ ️ Learning Analytics Dashboard
**Muammo:** Hozirgi dashboard faqat XP va streak ko'rsatadi — chuqur analytics yo'q
**Ta'sir:**, Dasturchi +0.3

### Amalga oshirish:

**`src/components/dashboard/AnalyticsSection.tsx`:**
```tsx
// 1. Accuracy by grammar topic chart (Recharts)
// 2. Learning speed (words/day, exercises/day)
// 3. Time spent per skill (reading, writing, listening, speaking)
// 4. Forgetting curve visualization (FSRS-5 ma'lumotlari asosida)
// 5. Cohort analytics: "B1 o'quvchilari o'rtacha 45 kunda B1+ ga o'tadi"
```

**Event tracking:**
```typescript
// src/lib/analytics.ts
interface AnalyticsEvent {
  event: 'lesson_started' | 'exercise_answered' | 'lesson_abandoned' |
         'ai_chat_message' | 'speaking_practice'
  lessonId?: string
  exerciseId?: number
  result?: 'correct' | 'incorrect'
  timeSpent?: number
}

export async function trackEvent(event: AnalyticsEvent) {
  await supabase.from('analytics_events').insert(event)
}
```

---

## F3-9. ⚠️ ️ Error Detection & Prevention
**Muammo:** Sentry ulangan, lekin alert va monitoring tizimi yo'q
**Ta'sir:** Dasturchi +0.5

### Amalga oshirish:

**Sentry alert:**
```typescript
// Critical errors (Auth failure, Lesson load failure) → Telegram/Email
Sentry.init({
  dsn: import.meta.env.VITE_SENTRY_DSN,
  beforeSend(event) {
    if (event.exception && isCritical(event)) {
      notifyAdmin(event) // Telegram bot or email
    }
    return event
  }
})
```

**Error boundary monitoring:**
- Har bir page `ErrorBoundary` bilan o'ralganmi tekshirish
- UI da "Report error" button

---

## F3-10. ⚠️ ️ Performance Monitoring
**Muammo:** Web Vitals tracking bor, lekin budjet va benchmark yo'q
**Ta'sir:** Dasturchi +0.3

### Amalga oshirish:

```typescript
// Build size budget
// max 500kb per chunk
// Web Vitals targets:
// LCP < 2.5s, FID < 100ms, CLS < 0.1
```

**`vite.config.ts`:**
```typescript
export default defineConfig({
  build: {
    chunkSizeWarningLimit: 500,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules/react')) return 'react-core'
          if (id.includes('@supabase')) return 'supabase'
          if (id.includes('/data/daily/a1')) return 'lessons-a1'
          if (id.includes('/data/daily/a2')) return 'lessons-a2'
          if (id.includes('/data/daily/b1')) return 'lessons-b1'
          if (id.includes('/data/daily/b2')) return 'lessons-b2'
        }
      }
    }
  }
})
```

---

# FAZA 4 — O'ZBEK TILI SIFATINI OSHIRISH
### Muddat: 2–4 hafta · Baho ta'siri: +1.0 umumiy ball

---

## F4-1. ⚠️ Murojaat Shakli Standartlashtirish
**Muammo:** Ba'zi joylarda "siz" (rasmiy), ba'zida "sen" (norasmiy). Izchillik yo'q
**Ta'sir:** O'zbek tili ustozi +0.5

### Qaror: Butun platforma "siz" (rasmiy, hurmatli) shaklida

**Tekshirilishi kerak bo'lgan fayllar:**
- `src/i18n/uz.json` — barcha UI matnlar
- `src/data/daily/*.ts` — barcha `instruction`, `explanation` maydonlari
- `src/lib/prompts.ts` — AI prompt lar

**Script yarating:**
```typescript
// scripts/check-murojaat.ts
import { readFileSync, readdirSync } from 'fs'

const SEN_FORMS = [
  'saning', 'sanga', 'sandan', 'senda', 
  'senga', 'sendan', 'senda', 'seni',
  "o'rgan", "bil", "yoz" // buyruq mayli (sen ga qaratilgan)
]

// Sen shakllarini toping va ro'yxat bering
```

**`instruction` va `explanation` uchun rasmiy shakl namunasi:**
```
❌ "To'g'ri javobni top"          → ✅ "To'g'ri javobni toping"
❌ "Bu gapni o'zgartir"           → ✅ "Bu gapni o'zgartiring"  
❌ "Xatoni topdingmi?"            → ✅ "Xatoni topdingizmi?"
❌ "Yaxshi ishlading!"            → ✅ "Yaxshi ishlashingiz!"
```

---

## F4-2. ✅ ️ Terminologiya Lug'ati Yaratish
**Muammo:** "Present Perfect" ba'zi joylarda lotin, ba'zi joylarda o'zbek tilida
**Ta'sir:** O'zbek tili ustozi +0.5

**Bajarilgan:** `src/data/terminology-uz.ts` mavjud (274q, 37+ atama) + `grammarGlossary.ts`, lekin hech qayerda import qilinmagan.

**`src/data/terminology-uz.ts`** fayl mavjud, quyidagi ma'lumotlar bilan:
```typescript
export const GRAMMAR_TERMS: Record<string, { uz: string; short: string }> = {
  'Present Simple':        { uz: "Oddiy hozirgi zamon",          short: "hozirgi oddiy" },
  'Present Continuous':    { uz: "Davom etayotgan hozirgi zamon", short: "davomiy hozirgi" },
  'Present Perfect':       { uz: "Tugallangan hozirgi zamon",     short: "tugallangan hozirgi" },
  'Past Simple':           { uz: "Oddiy o'tgan zamon",            short: "o'tgan oddiy" },
  'Past Continuous':       { uz: "Davomiy o'tgan zamon",          short: "davomiy o'tgan" },
  'Past Perfect':          { uz: "Tugallangan o'tgan zamon",      short: "tugallangan o'tgan" },
  'Future Simple':         { uz: "Oddiy kelasi zamon",            short: "kelasi oddiy" },
  'Modal verb':            { uz: "Modal fe'l",                    short: "modal" },
  'Conditional':           { uz: "Shart gap",                     short: "shart" },
  'Passive voice':         { uz: "Majhul nisbat",                 short: "majhul" },
  'Active voice':          { uz: "Ma'lum nisbat",                 short: "ma'lum" },
  'Relative clause':       { uz: "Aniqlovchi gap",                short: "aniqlovchi" },
  'Reported speech':       { uz: "Bilvosita nutq",                short: "bilvosita" },
  'Gerund':                { uz: "Gerundiy",                      short: "gerundiy" },
  'Infinitive':            { uz: "Infinitiv",                     short: "infinitiv" },
  'Subject':               { uz: "Ega",                          short: "ega" },
  'Predicate':             { uz: "Kesim",                        short: "kesim" },
  'Object':                { uz: "To'ldiruvchi",                 short: "to'ldiruvchi" },
  'Adjective':             { uz: "Sifat",                        short: "sifat" },
  'Adverb':                { uz: "Ravish",                       short: "ravish" },
  'Noun':                  { uz: "Ot",                           short: "ot" },
  'Verb':                  { uz: "Fe'l",                         short: "fe'l" },
  'Preposition':           { uz: "Predlog (ko'makchi)",          short: "predlog" },
  'Conjunction':           { uz: "Bog'lovchi",                   short: "bog'lovchi" },
  'Article':               { uz: "Artikl",                       short: "artikl" },
  'Tense':                 { uz: "Zamon",                        short: "zamon" },
}
```

**Barcha dars fayllarida terminlarni normalizatsiya qiladigan skript:**
```typescript
// scripts/normalize-terms.ts
// "Present Perfect" → "Tugallangan hozirgi zamon (Present Perfect)"
// Birinchi marta to'liq yoziladi, keyingilari qisqa
```

---

## F4-3. ⚠️ ️ Tarjimalar Sifatini Oshirish
**Muammo:** "Fine", "well", "good" uchala ham "yaxshi". Rus kalka iboralar
**Ta'sir:** O'zbek tili ustozi +0.3

### Lug'at qayta ko'rib chiqish:

```typescript
// Hozir (noto'g'ri):
{ en: 'fine', uz: 'yaxshi' }
{ en: 'well', uz: 'yaxshi, sog\'-salomat' }
{ en: 'good', uz: 'yaxshi' }

// To'g'ri:
{ en: 'fine', uz: 'yaxshi, qoniqarli (mediocre nuance bilan)', 
  note: "'I am fine' = Men yaxshiman (unchalik zo'r emas)" }
{ en: 'well', uz: 'sog\'lom, a\'lo (health yoki quality bo\'yicha)',
  note: "'I am well' = Men sog\'lom/a\'lo" }
{ en: 'good', uz: 'yaxshi, ajoyib (sifat jihati bilan)',
  note: "'I am good' = Men yaxshiman (sog\'liq va holat)" }
```

**Rus kalka iboralarni almashtirish:**

| Rus kalka | O'zbekcha to'g'ri |
|-----------|-------------------|
| "To'g'ri keladi" | "kerak bo'ladi / lozim" |
| "Bajarish mumkin" | "bajara olasiz / bajaring" |
| "Qo'llash joiz" | "ishlatish mumkin" |
| "Hisobga olish kerak" | "e'tiborga olish kerak" |

---

## F4-4. ❌ i18n avtomatlashtirish (Crowdin / Lokalise)
**Muammo:** Tarjimalar qo'lda yoziladi — yangi tillar qo'shish qiyin
**Ta'sir:** O'zbek tili ustozi +0.3

### Amalga oshirish:

**Crowdin integratsiyasi:**
```
1. Crowdin da project ochish
2. src/i18n/en.json ni source file sifatida ulash
3. Auto-translate (DeepL) + human review
4. Har hafta sync: Crowdin → PR → merge
```

**Yangi tillar:**
```
Faza 4.4 oyi:  russian (to'ldirish)
3 oy:           korean (Koreya O'zbekiston bozorida kuchli)
6 oy:           turkish, chinese
12 oy:          qoraqalpoq, tojik, qozoq (markaziy Osiyo ekspansiyasi)
```


# FAZA 6 — FALSAFIY VA MOTIVATSION CHUQURLIK
### Muddat: 2–4 hafta · Baho ta'siri: +1.0 faylasuf ball

---

## F6-1. ⚠️ ️ Ichki Motivatsiya Elementlari
**Muammo:** Faqat tashqi motivatsiya (XP, streak) — ichki motivatsiyani so'ndirishi mumkin
**Ta'sir:** Faylasuf +1.0, Yangi boshlovchi +0.3

### Amalga oshirish:

**"Mening Sababim" (Personal Why) onboarding:**
```tsx
// Onboarding 3-qadami
<div className="my-why-card">
  <h2>Ingliz tilini nega o'rganmoqchisiz?</h2>
  <div className="options-grid">
    <button>✈️ Chet elda ishlash/o'qish</button>
    <button>💼 Karyeramni rivojlantirish</button>
    <button>📚 Xorijiy kitob/kino tushunish</button>
    <button>🌍 Sayohat qilish</button>
    <button>🎓 IELTS/TOEFL olish</button>
    <button>💬 Ingliz tilida erkin gaplashish</button>
  </div>
  <input placeholder="O'z sababingizni yozing..." />
</div>
```

**Progress Journal (Kunlik Fikr Daftari):**
```tsx
// Har dars oxirida 1 ta savol:
const REFLECTION_QUESTIONS = [
  "Bugun nimani o'rgandingiz?",
  "Bu bilim sizga qanday foydali bo'ladi?",
  "Bugun eng qiyin nima edi?",
  "Ertaga nimani mashq qilmoqchisiz?",
  "Bu grammatikani real hayotda qachon ishlatishingiz mumkin?"
]
```

**"Real Hayot Bog'lanishi" komponenti:**
```tsx
// Har dars uchun 1 ta real hayot konteksti
realLifeConnection?: {
  scenario: string  // "Airbnb da xona band qilayotganda..."
  dialogSample: string  // "Host: What are your plans for tomorrow? 
                        //  You: I am going to visit the museum..."
}
```

---

## F6-2. ⚠️ ️ "Til Sarguzasht" Narrativ Qatlam
**Muammo:** Darslar mexanik — transformativ o'rganish yo'q
**Ta'sir:** Faylasuf +0.5, Yangi boshlovchi +0.5

### Amalga oshirish:

**Mavjud `storyline.ts` ni chuqurlashtirish:**

Hozir: A va B o'rtasidagi oddiy hikoya

**Yangilash:**
```typescript
interface StoryBeat {
  day: number
  title: string
  context: string      // Hayotiy vaziyat
  culturalInsight: string  // "Ingliz tilida bu qanday farq qiladi..."
  languageMoment: string  // "Bu jumlani aytganingizda, ingliz tillik odam..."
}

// Misol:
{
  day: 48,
  title: "Londonga sayohat",
  context: "Aziz xorijiy hamkasbi bilan uchrashadigan bo'ladi",
  culturalInsight: "Inglizlar juda aniq jadval tuzishadi. 'I will be there' o'rniga 'I am meeting you at 3 PM at Covent Garden' deyishadi.",
  languageMoment: "Bu darsda o'rganilgan Present Continuous for Future — haqiqiy hayotda shu qadar ko'p ishlatiladi."
}
```

---

# FAZA 7 — YODLASH ILMINI TO'LDIRISHSH
### Muddat: 3–5 hafta · Baho ta'siri: +1.2 yodlash olimi ball

---

## F7-1. ✅ Spaced Review — Grammar Review Widget
**Muammo:** Grammar qoidalari FSRS'dan tashqarida qolgan
(F2-1 bilan birgalikda — yuqorida to'liq ko'rsatilgan)

---

## F7-2. ✅ Confusable Pairs Alohida Kuzatuv
**Muammo:** O'xshash so'zlar (make/do, lend/borrow, say/tell) bir vaqtda o'rganilganda interference paydo bo'ladi
**Ta'sir:** Yodlash olimi +0.5

### Amalga oshirish:

**`src/data/confusable-pairs.ts`:**
```typescript
export const CONFUSABLE_PAIRS = [
  {
    words: ['make', 'do'],
    rule: "MAKE: yaratish/ishlab chiqarish. DO: harakatni bajarish",
    memoryHook: "MAKE → Material (nimadir yaratiladi). DO → Do-ing (harakatni bajarishingiz)",
    exercises: [
      "Can you ___ me a coffee? (make)",
      "I need to ___ my homework. (do)",
    ]
  },
  {
    words: ['lend', 'borrow'],
    rule: "LEND: bermoq (sen → boshqa). BORROW: olmoq (boshqa → sen)",
    memoryHook: "LEND = Leave (ketishiga qo'yish). BORROW = Bring to yourself"
  },
  {
    words: ['say', 'tell'],
    rule: "TELL + kimga: Tell ME. SAY + nima: Say THAT",
    memoryHook: "Tell has a 'T' for 'To someone'. Say has no person needed."
  }
]
```

**SRS tizimida: confusable pair biri o'rganilganda, juftini keyingacha kechiktirish:**
```typescript
// vocabulary SRS da:
if (isConfusablePair(newWord, lastLearnedWord)) {
  // 3 kun kechiktir — interference oldini olish
  postponeReview(lastLearnedWord, 3)
}
```

---

## F7-3. ✅ Elaborative Encoding Mashqlari — BAJARILDI
**Muammo:** Yangi ma'lumotni mavjud bilim bilan bog'lash mashqlari yo'q
**Ta'sir:** Yodlash olimi +0.5

**Holat:** `connection` mashq turi to'liq qo'shildi — ochiq javobli self-reflection
(prompt + hints chiplari + textarea), submit qilingach namuna javob ko'rsatiladi.
`checkAnswer` bo'sh bo'lmagan javobni "bajarilgan" deb hisoblaydi (baholanmaydi —
elaborative encoding effort-based). Birinchi namuna comparatives darsiga qo'shildi.
Test'lar bilan qoplangan.

### Yangi mashq turi: `connection`

```typescript
interface ConnectionExercise {
  id: number
  type: 'connection'
  instruction: string
  prompt: string    // "Will ning 3 ta ishlatilishini o'z hayotingizdan misol keltiring"
  hints: string[]   // ["Va'da bergan vaqtingiz", "Hozir qaror qilgan vaqtingiz"]
  exampleAnswer: string
}
```

**Mashq namunalari:**
```typescript
{ id: 40030, type: 'connection',
  instruction: "O'z hayotingizdan misol yozing:",
  prompt: "Will ishlatib, 3 ta real va'da bering:",
  hints: ["Do'stingizga", "Oilangizga", "O'zingizga"],
  exampleAnswer: "I will call my mother every Sunday. I will help my friend move next month. I will study English every day." }
```

---

## F7-4. ✅ Active Recall — Blank Slate Testing
**Muammo:** Ko'pchilik mashqlar recognition-based (tanlash). Recall-based (yodlash) mashqlar ko'p emas
**Ta'sir:** Yodlash olimi +0.5

**Har bir darsga "Blank Slate" section qo'shing:**

```typescript
// Dars oxirida — barcha bo'sh joylar, hech qanday ko'mak yo'q
blankSlateReview?: {
  title: "O'zingizni sinab ko'ring — ko'mak yo'q!",
  prompts: [
    "Will ning 3 ta ishlatilishini aytib bering:",
    "Going to va Will ni farqini misolda ko'rsating:",
    "When/If gapida qaysi zamon ishlatiladi?"
  ]
}
```

---

# FAZA 8 — YANGI BOSHLOVCHI UCHUN MAXSUS
### Muddat: 2–3 hafta · Baho ta'siri: +1.0 yangi boshlovchi ball

---

## F8-1. 🚫 Demo — BEKOR QILINDI (kerak emas, butunlay olib tashlandi)
**Qaror:** Platforma mutlaqo tekin — ro'yxatdan o'tishsiz demo/guest mode kerak emas.

**O'chirilgan fayllar (6):**
- `src/pages/LessonDemoPage.tsx`
- `src/data/lessonDemoContent.ts`
- `src/components/dailyLesson/LessonDemo.tsx`
- `src/data/demos/a2Demos.ts`, `b1Demos.ts`, `b1plusDemos.ts`

**Yangilangan fayllar (5):**
- `src/App.tsx` — `/lesson-demo` route, demo-mode banner, `isDemo` logikasi olib tashlandi
- `src/components/dailyLesson/LessonView.tsx` — demoMode, DEMO_LESSONS, demo tugmasi olib tashlandi
- `src/components/onboarding/OnboardingFlow.tsx` — `tutorial` fazasi olib tashlandi
- `src/pages/GrammarReview.tsx` — `DemoLesson`/`LessonDemo` bog'liqligi olib tashlandi
- `src/services/aiInsightsService.ts` — `getWeakGrammarLabels` soddalashtirildi

---

## F8-2. ✅ Yuklash Muammosini Hal Qilish
**Muammo:** AI so'rovlari 5–10 soniya vaqt oladi, foydalanuvchi nima bo'layotganini bilmaydi
**Ta'sir:** Yangi boshlovchi +0.5

### Skeleton + Progress Indicator:

**`src/components/ui/AILoadingIndicator.tsx`:**
```tsx
export function AILoadingIndicator({ message = "AI tahlil qilmoqda..." }) {
  const [dots, setDots] = useState('.')
  const [tip, setTip] = useState(getRandomTip())
  
  // Animatsiya
  useEffect(() => {
    const i = setInterval(() => setDots(d => d.length >= 3 ? '.' : d + '.'), 500)
    return () => clearInterval(i)
  }, [])
  
  return (
    <div className="ai-loading">
      <div className="spinner-ring" />
      <p className="loading-message">{message}{dots}</p>
      <p className="loading-tip">💡 {tip}</p>
      <div className="progress-bar">
        <div className="progress-fill" style={{ animation: 'fill 8s linear forwards' }} />
      </div>
    </div>
  )
}

function getRandomTip(): string {
  const tips = [
    "Will ishlatib bashorat qilib ko'ring: 'I think it will rain...'",
    "Present Perfect uchun eslab qoling: HAVE + V3",
    "Going to = oldindan o'ylangan reja",
  ]
  return tips[Math.floor(Math.random() * tips.length)]
}
```

---

## F8-3. ⚠️ ️ Onboarding Yaxshilash
**Muammo:** Onboarding juda texnik, yangi boshlovchi uchun mo'ljallanmagan
**Ta'sir:** Yangi boshlovchi +0.5

### 5 qadam onboarding:

```
Qadam 1: Maqsad
  "Ingliz tilini nega o'rganmoqchisiz?" [6 ta tanlov]

Qadam 2: Daraja
  "Placement Test yoki Daraja tanlash" [A1/A2/B1/B1+/B2]
  [Bilmayman → 10 savollik placement test]

Qadam 3: Vaqt
  "Kuniga qancha vaqt ajrata olasiz?"
  [15 daqiqa / 30 daqiqa / 45 daqiqa / 1 soat]

Qadam 4: Demo dars
  "Keling, birgalikda bir mashq qilib ko'ramiz"
  [Birinchi mashq — qo'llanma bilan]

Qadam 5: Yo'l
  "Sizning 90 kunlik yo'lingiz tayyor!"
  [Darajaga qarab maqsadni ko'rsat]
```

---

## F8-4. ✅ Hearts Tizimini Qayta Ko'rib Chiqish
**Muammo:** Hearts yo'qotish = stress. O'rganishda xato qilish tabiiy
**Ta'sir:** Yangi boshlovchi +0.3, Faylasuf +0.2

**Bajarilgan:** `loseHeart` hech qayerda chaqirilmaydi, darslarda hearts tekshirilmaydi. "Xatolar ustida ishlash" (LessonDemo.tsx L68-77, L286-303) o'rnatilgan. Hearts kodi dead code sifatida qolgan.

### Yangi model: "Ustida Ishlash" sistema

```
Eski: 5 heart → xato qilsa yo'qoladi → 0 bo'lsa to'xtat
Yangi: "Ustida Ishlash" rejimi
  - Xato qilsangiz → "Yana bir bor urinib ko'ring" (hearts yo'q)
  - 3 marta xato → mini hint ko'rsatiladi
  - Dars oxirida necha xato qilganligingiz statistikasi
  - "Zo'r! 80% to'g'ri javob berdingiz. Keyingi safar 85% ga urining!"
```

**Faqat "Challenge" va "Tandem Duel" rejimlarida hearts qolsin** — raqobat elementida stress motivatsiya sifatida ishlaydi.

---

# FAZA 9 — UX VA PERFORMANCE
### Muddat: 2–3 hafta · Baho ta'siri: +0.5 umumiy ball

---

## F9-1. ⚠️ ️ Listening Section Sustainability
**Muammo:** YouTube videolar o'chishi mumkin
**Ta'sir:** Ingliz tili pedagog +0.3

### Yechim:

```typescript
interface ListeningSection {
  // Hozirgi:
  youtubeId?: string
  
  // Yangi:
  youtubeId?: string      // primary
  backupUrl?: string      // Cloudflare R2 yoki Supabase Storage
  transcript: string
  offlineAvailable: boolean  // service worker tomonidan cache langan
}
```

**Monitoring script:**
```typescript
// scripts/check-youtube-availability.ts
// Har hafta YouTube ID larni tekshiradi va broken linklar haqida xabar beradi
```

---

## F9-2. ⚠️ ️ Speaking AI Baholashni Yaxshilash
**Muammo:** AI intonatsiya, stress, rhythm baha bermaydi
**Ta'sir:** Ingliz tili pedagog +0.5

### Web Speech API + Claude kombinatsiyasi:

```typescript
// Hozirgi: faqat matn transcript → Claude
// Yangi: matn + prosodik ma'lumotlar

interface SpeechAnalysisRequest {
  transcript: string
  duration: number      // gapirish vaqti
  wordsPerMinute: number // tezlik
  pauseCount: number    // to'xtalishlar soni
  // Agar Web Audio API mavjud bo'lsa:
  pitchVariation?: number  // intonatsiya o'zgarishi
}

// Claude ga yuborilgan prompt yangilanadi:
const prompt = `
  Foydalanuvchi ingliz tilida gapirdi:
  Matn: "${transcript}"
  Vaqt: ${duration}s, Tezlik: ${wordsPerMinute} so'z/daqiqa
  To'xtalishlar: ${pauseCount} ta
  
  Baholang:
  1. Grammatik to'g'rilik (1–10)
  2. Leksika xilma-xilligi (1–10)
  3. Ravonlik (fluency) (1–10)
  4. Aniq tavsiya (o'zbek tilida)
`
```

---

# YAKUNIY BAHO VA MAQSAD

# FAZA 10 — SCALE & ECOSYSTEM
### Muddat: 6-12 oy · Baho ta'siri: +1.5 umumiy ball

---

## F10-1. ❌ React Native Mobile App
**Muammo:** PWA yaxshi, lekin native features (push notifications, speech recognition) cheklangan
**Ta'sir:**, Yangi boshlovchi +0.5

### Amalga oshirish:

```
1. Core shared logic: Zustand store, services, lib (claude, supabase, srs)
2. React Native bilan mosligini tekshirish
3. Native speech recognition: Web Speech API → React Native Voice
4. Offline-first mobile: Dexie IndexedDB → Async Storage / SQLite
5. Push notifications: Firebase Cloud Messaging
```

---

## F10-2. ❌ Kids English Module
**Muammo:** Bolalar uchun content yo'q — bozorda katta segment
### Amalga oshirish:

```
- A1 level gamification: more images, short animations
- Parent dashboard: child progress tracking
- 20 lessons: colors, animals, family, food, toys
- Voice-only exercises (reading yozish o'rniga)
```

---

## F10-3. ❌ Community & Social
**Muammo:** Yakkama-yakka o'rganish — community elementi yo'q
**Ta'sir:**, Faylasuf +0.3

### Amalga oshirish:

**Leaderboards:**
```typescript
// Weekly challenges
// Friends leaderboard (follow system)
// Streak competition
// XP milestones badges
```

**Study groups:**
```typescript
// Groups of 5-10 learners
// Group chat
// Tandem (real user, not AI)
// Group challenges
```

---

## F10-4. ❌ Content Creator Mode
**Muammo:** Yangi dars yaratish uchun dasturchi kerak — CMS yo'q
**Ta'sir:**, Dasturchi +0.5

### Amalga oshirish:

```
1. Lesson builder: drag-drop exercise editor
2. Exercise templates: fill-blank, MC, error-correction, transformation
3. Preview mode: real-time lesson preview
4. Publish flow: draft → review → published
5. Teacher dashboard: student progress, custom assignments
```

---

## F10-5. ❌ Infrastructure & DevOps
**Muammo:** Vercel free tier — agar user base > 10,000 bo'lsa, yetarli emas
**Ta'sir:**, Dasturchi +0.5

### Amalga oshirish:

```
1. Vercel → dedicated hosting (AWS/DigitalOcean) + Docker
2. Database: Supabase → PostgreSQL + Redis + S3
3. CDN: Lesson data (JSON) + images/audio ni CDN orqali serve
4. Auto-scaling: Horizontal pod autoscaling (HPA)
5. Monitoring: Grafana + Prometheus
```

---

## Har Faza So'ng Kutilgan Baholar

| Nuqtai Nazar | Hozir | Faza 1–2 | Faza 3–4 | Faza 5–6 | Faza 7–9 | Maqsad |
|---|---|---|---|---|---|---|
| Ingliz pedagog | 7.5 | 8.5 | 9.0 | 9.3 | **10** | 10 |
| Dasturchi | 8.0 | 8.8 | **10** | 10 | 10 | 10 |
| O'zbek ustozi | 6.5 | 7.5 | 8.5 | **10** | 10 | 10 |
| Yangi boshlovchi | 6.5 | 7.5 | 8.5 | 9.0 | **10** | 10 |
| Faylasuf | 5.0 | 5.5 | 6.0 | **9.0** | 9.5 | 10 |
| Yodlash olimi | 6.5 | 8.0 | 8.5 | 9.0 | **10** | 10 |
| **O'rtacha** | **6.5** | **7.6** | **8.6** | **9.5** | **10** | **10** |

---

## Ish Jadvali

| Faza | Muddat | Asosiy ishlar | Baho o'sishi |
|------|--------|---------------|-------------|
| **F1** — Kritik tuzatishlar | 1–2 hafta | ID validation, semantic labels, build fix, lokalizatsiya | +0.8 |
| **F2** — Pedagogik | 3–6 hafta | Grammar SRS, interleaved, audio, micro-tasks, passages | +1.5 |
| **F3** — Texnik | 4–8 hafta | CMS migratsiya, claude split, test coverage, incremental seed | +1.0 |
| **F4** — O'zbek tili | 2–4 hafta | Murojaat, terminologiya, tarjimalar | +0.8 |
| **F6** — Falsafiy | 2–4 hafta | Ichki motivatsiya, narrativ, real hayot | +0.5 |
| **F7** — Yodlash | 3–5 hafta | Confusable pairs, elaborative, active recall | +0.7 |
| **F8** — Boshlovchi | 2–3 hafta | Demo, loading, onboarding, hearts | +0.5 |
| **F9** — UX/Performance | 2–3 hafta | Listening backup, speaking AI | +0.5 |
| **JAMI** | ~6 oy | | **+6.3** (6.5 → 10) |

---

## Minimal Viable Perfection (MVP to 10/10)

Agar faqat **eng muhim 10 ta o'zgarish** amalga oshirilsa, baho 6.5 dan 9.0 ga chiqadi:

1. ⚠️ **Grammar SRS** — Ebbinghaus egri chizig'iga qarshi (F2-1) — qisman, GrammarReviewCard + Supabase jadvali kerak
2. ✅ **Audio** — A1/A2 da talaffuz (F2-4)
3. ⚠️ **Interleaved practice** — MixedReview page bor (F2-2)
4. ⚠️ **Writing & Speaking** — darslarda integratsiya qilingan (F2-3, F2-8, F2-9)
5. ❌ **Mnemonika UI** — `mnemonic` maydon ko'rsatilmaydi (F2-7)
6. ⚠️ **Demo** — LessonDemoPage + onboarding tutorial bor, lekin guest mode yo'q (F8-1)
7. ❌ **O'zbek terminologiya lug'ati** — terminology-uz.ts yo'q (F4-2)
8. ⚠️ **ID validation** — skript bor, lekin auto-generatsiya yo'q (F1-1)
9. ✅ **Conflict resolution** — IndexedDB sync smart merge (F1-9)
10. ✅ **Offline UX** — offline rejim banneri (F1-10)

## 📊 KPI va Metrikalar

| KPI | Hozir | 3 oy | 6 oy | 12 oy |
|-----|-------|------|------|-------|
| **Test pass rate** | 91% | 100% | 100% | 100% |
| **Code coverage** | ~20% | 30% | 40% | 55% |
| **Nazariya→Mashq qamrovi** | 65-75% | 85% | 92% | 98% |
| **Skills bo'limi qamrovi** | ~30% | 45% | 70% | 90% |
| **Darslarda vocab test** | 0% | 30% | 60% | 100% |
| **AI personalizatsiya** | Basic | Adaptive | Full | Full |
| **Mobile UX** | PWA | PWA+ | React Native Beta | React Native |

## 📅 Choraklik Implementatsiya Rejasi

### Q1 (0-3 oy) — Foundation
| Oy | Vazifalar | Baho o'sishi |
|----|-----------|-------------|
| 1 | F1-1–F1-5 (ID validation, "Inkor" fix, build, lokalizatsiya, noaniq mashqlar audit) | +0.5 |
| 2 | F1-6–F1-10 (CI/CD, E2E, coverage, sync, offline) + F2-1 (Grammar SRS) | +0.6 |
| 3 | F2-2–F2-4 (Interleaved, micro-tasks, audio) + F2-5 (Mini-passages) | +0.5 |

### Q2 (3-6 oy) — Content
| Oy | Vazifalar | Baho o'sishi |
|----|-----------|-------------|
| 4 | F2-6–F2-10 (90-day claim, mnemonics, writing AI, speaking, curriculum gap) | +0.5 |
| 5 | F3-1–F3-3 (CMS migratsiya, claude split, test coverage) + F4 (O'zbek tili) | +0.6 |
| 6 | F3-4–F3-10 (Incremental seed, any, adaptive, AI tutor, analytics, error, perf) | +0.7 |

### Q3 (6-9 oy) — AI & Yodlash
| Oy | Vazifalar | Baho o'sishi |
|----|-----------|-------------|
| 7 | F6-1–F6-2 (Ichki motivatsiya, narrativ) | +0.3 |
| 8 | F7-1–F7-4 (Grammar SRS, confusable, elaborative, active recall) | +0.7 |
| 9 | F8-1–F8-4 (Demo, loading, onboarding, hearts) + F10 (Scale) | +0.6 |

### Q4 (9-12 oy) — Scale
| Oy | Vazifalar | Baho o'sishi |
|----|-----------|-------------|
| 10 | F9 (UX/Performance: listening, speaking AI) + F10-1 (React Native) | +0.5 |
| 11 | F10-2, F10-3 (Kids, Community) + F10-4 (Content creator mode) | +0.6 |
| 12 | F10-5 (Infrastructure) + Yakuniy audit + 10/10 sertifikatsiya | +0.4 |

---


---

> *"Mukammallik bir marta amalga oshirilgan narsa emas — u doimiy jarayon. Bu roadmap platformani statik mahsulotdan tirik, o'suvchi ta'lim ekotizimiga aylantiradi."*
