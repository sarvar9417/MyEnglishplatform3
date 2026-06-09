# EnglishPath — Mukammallik Yo'l Xaritasi
### Barcha tahlillardan 10/10 ga yetish uchun to'liq rejа

> **Manbalar:** `PLATFORM_ANALYSIS.md` + `tahlil-xulosa.md`
> **Maqsad:** Har 7 nuqtai nazardan 10/10
> **Yondashuv:** Kritik → Muhim → Kengayish → Kamolot

---

## JORIY HOLAT vs MAQSAD

| Nuqtai Nazar | Hozir | Maqsad |
|---|---|---|
| Ingliz tili pedagog | 7.5/10 | 10/10 |
| Dasturchi | 8/10 | 10/10 |
| O'zbek tili ustozi | 6.5/10 | 10/10 |
| Yangi boshlovchi | 6.5/10 | 10/10 |
| Faylasuf | 5/10 | 10/10 |
| Tadbirkor | 5/10 | 10/10 |
| Yodlash olimi | 6.5/10 | 10/10 |
| **O'rtacha** | **6.5/10** | **10/10** |

---

# FAZA 1 — KRITIK TUZATISHLAR
### Muddat: 1–2 hafta · Baho ta'siri: +1.5 umumiy ball

---

## F1-1. Exercise ID avto-generatsiya tizimi
**Muammo:** ID lar qo'lda boshqariladi → duplikat xavfi (a2Part1 da id:1110 takrori topilgan)
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

## F1-2. exerciseSections "Inkor" nomi — Semantik tuzatish
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

## F1-3. Build ogohlantirishlarini tuzatish
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

## F1-4. O'zbek tilidagi to'liq lokalizatsiya
**Muammo:** "Sign In", "Sign Up", "Dashboard" ingliz tilida qolgan
**Ta'sir:** Yangi boshlovchi +0.5, O'zbek tili ustozi +0.3

**`src/i18n/uz.json`** ga qo'shing:
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

## F1-5. Noaniq (Ko'p Javobli) Mashqlarni Aniqlash va Tuzatish
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

# FAZA 2 — PEDAGOGIK MUKAMMALLASH
### Muddat: 3–6 hafta · Baho ta'siri: +1.8 umumiy ball

---

## F2-1. Grammar SRS — Eng Muhim Yaxshilanish
**Muammo:** FSRS-5 faqat lug'at uchun ishlaydi. Grammatika qoidalari unutiladi (Ebbinghaus: 1 kundan keyin ~50% yo'qoladi)
**Ta'sir:** Yodlash olimi +2.0, Ingliz tili pedagog +0.5

### Loyiha arxitekturasi:

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

## F2-2. Interleaved Practice (Aralash Mashqlar)
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

## F2-3. Produktiv Ko'nikmalar Integratsiyasi
**Muammo:** Speaking/Writing darslarga integratsiyalashmagan — alohida tab
**Ta'sir:** Ingliz tili pedagog +1.0

### Har bir darsga mini-production task qo'shing:

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

## F2-4. Audio Qo'shish — A1/A2 Darslari
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

## F2-5. Kontekstli Mashqlar (Mini-Passages)
**Muammo:** ~80% mashqlar izolyatsiyalangan jumlalar. Kontekstda o'rganish 3x samaraliroq
**Ta'sir:** Ingliz tili pedagog +0.8

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

## F2-6. "90 kunda B2" Da'vosini O'zgartirish
**Muammo:** Realistik emas — CEFR A2→B2 uchun 400–600 soat kerak. Kutishlarni noto'g'ri shakllantiradi
**Ta'sir:** Faylasuf +0.5, Tadbirkor +0.5, Yangi boshlovchi +0.3

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

## F2-7. Mnemonika Tizimi
**Muammo:** `mnemonic` maydoni bor, lekin UI da ko'rsatilmaydi. Vizual mnemonikalar 3x samaraliroq
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

# FAZA 3 — TEXNIK MUKAMMALLASH
### Muddat: 4–8 hafta · Baho ta'siri: +1.2 umumiy ball

---

## F3-1. Kontent TypeScript Fayllaridan CMS ga Ko'chirish
**Muammo:** 106 dars TS fayllarida hardcode. Kontent tahrirlash uchun dasturchi kerak. ~40,000+ qator TypeScript
**Ta'sir:** Dasturchi +1.0, Tadbirkor +0.5

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

## F3-2. `claude.ts` ni Modullarga Ajratish
**Muammo:** `src/lib/claude.ts` 1300+ qator — Single Responsibility buzilgan
**Ta'sir:** Dasturchi +0.5

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

## F3-3. Test Coverage oshirish
**Muammo:** Komponent testlari juda kam. `LessonView.tsx`, `ExerciseCard.tsx` kabi murakkab komponentlar test qilinmagan
**Ta'sir:** Dasturchi +0.5

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

## F3-4. Incremental Seed (Faqat O'zgarganlarni Yuklash)
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

## F3-5. TypeScript `any` ni Bartaraf Etish
**Muammo:** `claude.ts` va ba'zi xizmatlarda `any` tipi ishlatilgan
**Ta'sir:** Dasturchi +0.3

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

# FAZA 4 — O'ZBEK TILI SIFATINI OSHIRISH
### Muddat: 2–4 hafta · Baho ta'siri: +1.0 umumiy ball

---

## F4-1. Murojaat Shakli Standartlashtirish
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

## F4-2. Terminologiya Lug'ati Yaratish
**Muammo:** "Present Perfect" ba'zi joylarda lotin, ba'zi joylarda o'zbek tilida
**Ta'sir:** O'zbek tili ustozi +0.5

**`src/data/terminology-uz.ts`** fayl yarating:
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

## F4-3. Tarjimalar Sifatini Oshirish
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

# FAZA 5 — BIZNES VA MONETIZATSIYA
### Muddat: 6–10 hafta · Baho ta'siri: +1.5 tadbirkor ball

---

## F5-1. Monetizatsiya Modeli
**Muammo:** Hech qanday to'lov tizimi yo'q
**Ta'sir:** Tadbirkor +2.0

### Tavsiya qilingan Freemium model:

```
BEPUL TIER (Free):
  ✅ A1–A2 darslari (30 dars)
  ✅ Kunlik 10 ta flashcard (SRS)
  ✅ AI chat (kuniga 5 ta xabar)
  ✅ Grammar section
  ❌ B1–B2 darslari
  ❌ Mock test
  ❌ Tandem / Duel
  ❌ AI writing feedback
  ❌ Sertifikat

PREMIUM TIER — 29,000 so'm/oy (~$2.5/oy):
  ✅ Barcha 106 dars
  ✅ Cheksiz SRS va AI chat
  ✅ Mock test va sertifikat
  ✅ Tandem va real-time duel
  ✅ AI writing feedback (cheksiz)
  ✅ Progress export (PDF)
  ✅ Offline mode

TEAM/SCHOOL — 199,000 so'm/oy (klass uchun):
  ✅ Barcha premium
  ✅ O'qituvchi paneli
  ✅ Talabalar progress monitoring
  ✅ Custom kurs yaratish
```

### Amalga oshirish:

**Supabase da subscription jadval:**
```sql
CREATE TABLE subscriptions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  plan TEXT DEFAULT 'free',  -- 'free', 'premium', 'school'
  status TEXT DEFAULT 'active',
  current_period_end TIMESTAMPTZ,
  stripe_subscription_id TEXT
);
```

**`src/lib/subscription.ts`:**
```typescript
export function canAccessLesson(lesson: DailyLesson, plan: string): boolean {
  if (plan === 'premium' || plan === 'school') return true
  // Free: faqat A1–A2
  return ['A1', 'A2'].includes(lesson.level)
}

export function canUseMockTest(plan: string): boolean {
  return plan !== 'free'
}
```

**To'lov tizimi — Click yoki Payme (O'zbekiston uchun):**
```typescript
// api/payment.ts (Vercel serverless)
import Payme from 'payme-sdk'

export async function createPaymeSession(userId: string, plan: string) {
  const session = await Payme.createTransaction({
    amount: plan === 'premium' ? 29000 : 199000,
    orderId: `${userId}-${Date.now()}`,
    returnUrl: `${process.env.APP_URL}/payment/success`
  })
  return { checkoutUrl: session.url }
}
```

---

## F5-2. Analytics Dashboard
**Muammo:** Qaysi dars/mashqda foydalanuvchilar to'xtaydi — noma'lum
**Ta'sir:** Tadbirkor +1.0

### Event tracking tizimi:

**`src/lib/analytics.ts`:**
```typescript
interface AnalyticsEvent {
  event: string
  lessonId?: string
  exerciseId?: number
  result?: 'correct' | 'incorrect'
  timeSpent?: number
  userId: string
}

export async function trackEvent(event: AnalyticsEvent): Promise<void> {
  // Supabase ya yoki PostHog (GDPR compliant)
  await supabase.from('analytics_events').insert({
    ...event,
    created_at: new Date().toISOString()
  })
}

// Ishlatilishi:
trackEvent({ event: 'lesson_started', lessonId: 'future-forms', userId })
trackEvent({ event: 'exercise_answered', exerciseId: 40001, result: 'correct', userId })
trackEvent({ event: 'lesson_abandoned', lessonId: '...', timeSpent: 180, userId })
```

**Analytics jadvali:**
```sql
CREATE TABLE analytics_events (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID,
  event TEXT,
  lesson_id TEXT,
  exercise_id INTEGER,
  result TEXT,
  time_spent INTEGER,  -- seconds
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indekslar
CREATE INDEX ON analytics_events(lesson_id, event);
CREATE INDEX ON analytics_events(exercise_id, result);
```

**Admin paneli uchun query namunalari:**
```sql
-- Eng ko'p abandon bo'ladigan darslar
SELECT lesson_id, COUNT(*) as abandons
FROM analytics_events WHERE event = 'lesson_abandoned'
GROUP BY lesson_id ORDER BY abandons DESC LIMIT 10;

-- Eng qiyin mashqlar (eng ko'p xato)
SELECT exercise_id, 
       COUNT(CASE WHEN result='incorrect' THEN 1 END)::float / COUNT(*) as error_rate
FROM analytics_events WHERE event = 'exercise_answered'
GROUP BY exercise_id HAVING COUNT(*) > 10
ORDER BY error_rate DESC LIMIT 20;
```

---

## F5-3. Referral Tizimi
**Muammo:** Viral growth mexanizmi yo'q
**Ta'sir:** Tadbirkor +0.5

### Amalga oshirish:

**Supabase:**
```sql
ALTER TABLE users ADD COLUMN referral_code TEXT UNIQUE DEFAULT gen_random_uuid()::TEXT;
ALTER TABLE users ADD COLUMN referred_by UUID REFERENCES users(id);
ALTER TABLE users ADD COLUMN referral_count INTEGER DEFAULT 0;
```

**`src/components/profile/ReferralCard.tsx`:**
```tsx
export function ReferralCard({ user }: { user: User }) {
  const referralLink = `${APP_URL}/invite/${user.referralCode}`
  
  return (
    <div className="referral-card">
      <h3>🎁 Do'stingizni taklif qiling!</h3>
      <p>Har bir do'stingiz uchun <strong>7 kun Premium bepul</strong></p>
      <div className="referral-link">
        <code>{referralLink}</code>
        <button onClick={() => navigator.clipboard.writeText(referralLink)}>
          Nusxalash
        </button>
      </div>
      <p>{user.referralCount} ta do'st taklif qildingiz → {user.referralCount * 7} kun Premium</p>
    </div>
  )
}
```

---

## F5-4. Sertifikat Tizimi
**Muammo:** 90 kundan so'ng hech qanday rasmiy hujjat yo'q
**Ta'sir:** Tadbirkor +0.5, Yangi boshlovchi (motivatsiya) +0.5

**`src/components/ui/Certificate.tsx`** mavjud — faqat kengaytirish kerak:

```typescript
interface CertificateData {
  userName: string
  level: 'A1' | 'A2' | 'B1' | 'B1+' | 'B2'
  completionDate: string
  daysStudied: number
  lessonsCompleted: number
  averageScore: number
  mockTestScore?: number
  qrCode: string  // Certificate verification URL
}
```

**PDF eksport + blockchain verification (oddiy):**
```typescript
// Sertifikat ID → Supabase public table
// QR code → https://englishpath.uz/verify/{certificateId}
```

---

# FAZA 6 — FALSAFIY VA MOTIVATSION CHUQURLIK
### Muddat: 2–4 hafta · Baho ta'siri: +1.0 faylasuf ball

---

## F6-1. Ichki Motivatsiya Elementlari
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

## F6-2. "Til Sarguzasht" Narrativ Qatlam
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

## F7-1. Spaced Review — Grammar Review Widget
**Muammo:** Grammar qoidalari FSRS'dan tashqarida qolgan
(F2-1 bilan birgalikda — yuqorida to'liq ko'rsatilgan)

---

## F7-2. Confusable Pairs Alohida Kuzatuv
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

## F7-3. Elaborative Encoding Mashqlari
**Muammo:** Yangi ma'lumotni mavjud bilim bilan bog'lash mashqlari yo'q
**Ta'sir:** Yodlash olimi +0.5

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

## F7-4. Active Recall — Blank Slate Testing
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

## F8-1. Demo — Ro'yxatdan O'tmasdan Ko'rish
**Muammo:** Majburiy signup yangi foydalanuvchilarni qaytaradi
**Ta'sir:** Yangi boshlovchi +0.8, Tadbirkor +0.5

### Amalga oshirish:

**Guest mode:**
```typescript
// src/store/useStore.ts
const GUEST_MODE_LESSONS = ['alphabet-greetings', 'numbers-a1', 'colors-shapes']

export function isGuestAllowed(lessonId: string): boolean {
  return GUEST_MODE_LESSONS.includes(lessonId)
}
```

**Landing page da:**
```tsx
<div className="hero-section">
  <h1>O'zbekcha tushuntirishlar bilan ingliz tili</h1>
  <button onClick={() => navigate('/demo')}>
    ▶️ Bepul sinab ko'ring — ro'yxatdan o'tish shart emas
  </button>
</div>
```

**Demo dars (`/demo` route):**
- Alphabet & Greetings darsini to'liq o'tish imkoniyati
- Progress saqlanmaydi (localStorage)
- Dars oxirida: "Progressingizni saqlab qo'yish uchun ro'yxatdan o'ting"

---

## F8-2. Yuklash Muammosini Hal Qilish
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

## F8-3. Onboarding Yaxshilash
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

## F8-4. Hearts Tizimini Qayta Ko'rib Chiqish
**Muammo:** Hearts yo'qotish = stress. O'rganishda xato qilish tabiiy
**Ta'sir:** Yangi boshlovchi +0.3, Faylasuf +0.2

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

## F9-1. Listening Section Sustainability
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

## F9-2. Speaking AI Baholashni Yaxshilash
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

## Har Faza So'ng Kutilgan Baholar

| Nuqtai Nazar | Hozir | Faza 1–2 | Faza 3–4 | Faza 5–6 | Faza 7–9 | Maqsad |
|---|---|---|---|---|---|---|
| Ingliz pedagog | 7.5 | 8.5 | 9.0 | 9.3 | **10** | 10 |
| Dasturchi | 8.0 | 8.8 | **10** | 10 | 10 | 10 |
| O'zbek ustozi | 6.5 | 7.5 | 8.5 | **10** | 10 | 10 |
| Yangi boshlovchi | 6.5 | 7.5 | 8.5 | 9.0 | **10** | 10 |
| Faylasuf | 5.0 | 5.5 | 6.0 | **9.0** | 9.5 | 10 |
| Tadbirkor | 5.0 | 5.5 | 6.5 | **9.5** | 10 | 10 |
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
| **F5** — Biznes | 6–10 hafta | Freemium, analytics, referral, sertifikat | +1.2 |
| **F6** — Falsafiy | 2–4 hafta | Ichki motivatsiya, narrativ, real hayot | +0.5 |
| **F7** — Yodlash | 3–5 hafta | Confusable pairs, elaborative, active recall | +0.7 |
| **F8** — Boshlovchi | 2–3 hafta | Demo, loading, onboarding, hearts | +0.5 |
| **F9** — UX/Performance | 2–3 hafta | Listening backup, speaking AI | +0.5 |
| **JAMI** | ~6 oy | | **+7.5** (6.5 → 10) |

---

## Minimal Viable Perfection (MVP to 10/10)

Agar faqat **eng muhim 10 ta o'zgarish** amalga oshirilsa, baho 6.5 dan 9.0 ga chiqadi:

1. ✅ **Grammar SRS** — Ebbinghaus egri chizig'iga qarshi (Faza 2-1)
2. ✅ **Audio** — A1/A2 da talaffuz (Faza 2-4)
3. ✅ **Interleaved practice** — Section 4–5 aralash (Faza 2-2)
4. ✅ **Micro-tasks** — har darsda 1 writing prompt (Faza 2-3)
5. ✅ **Mnemonika UI** — `mnemonic` maydon ko'rsatilishi (Faza 2-7)
6. ✅ **Demo (guest mode)** — signup yo'q (Faza 8-1)
7. ✅ **O'zbek terminologiya lug'ati** (Faza 4-2)
8. ✅ **ID validation test** — duplikat aniqlash (Faza 1-1)
9. ✅ **Freemium model** — to'lov infra (Faza 5-1)
10. ✅ **Analytics events** — qaysi dars qiyin (Faza 5-2)

---

> *"Mukammallik bir marta amalga oshirilgan narsa emas — u doimiy jarayon. Bu roadmap platformani statik mahsulotdan tirik, o'suvchi ta'lim ekotizimiga aylantiradi."*
