# Yangi Dars Qo'shish Bo'yicha Qo'llanma

## Kirish

Bu qo'llanma EnglishPath platformasiga yangi dars qo'shish jarayonini bosqichma-bosqich tushuntiradi.

## Bosqich 1: Dars Ma'lumotlarini Yaratish

### 1.1 Fayl Yaratish

Yangi dars faylini `src/data/daily/` papkasida yarating. Fayl nomi daraja bo'yicha tizimlashtirilgan:

```
src/data/daily/
├── a1Part1.ts      # A1 kun 1-10
├── a1Part2.ts      # A1 kun 11-27
├── a2Part1.ts      # A2 kun 28-32
├── a2Part2.ts      # A2 kun 33-40
├── a2Part3.ts      # A2 kun 41-45
├── a2Part4.ts      # A2 kun 46-53
├── b1Part1.ts      # B1 kun 54-75
├── b1plusPart1.ts  # B1+ kun 76-81
├── b1plusPart2.ts  # B1+ kun 82-96
├── b2Part1.ts      # B2 kun 97-108
├── b2Part2.ts      # B2 kun 109-119
└── b2Part3.ts      # B2 kun 120-126
```

**Misol:** Agar siz B2 darajasiga yangi dars qo'shmoqchi bo'lsangiz, faylni `b2Part3.ts` ga qo'shing yoki yangi fayl yarating.

### 1.2 DailyLesson Turini Import Qiling

```typescript
import type { DailyLesson } from '../dailyLessons'
```

## Bosqich 2: DailyLesson Turini Belgilash

`DailyLesson` interfeysi quyidagi maydonlarni talab qiladi:

```typescript
export interface DailyLesson {
  id: string                    // Noyob ID (masalan: 'modal-verbs')
  title: string                 // Dars nomi (masalan: 'Modal Verbs')
  subtitle: string              // Dars tavsifi (uz)
  level: string                 // CEFR darajasi: 'A1', 'A2', 'B1', 'B1+', 'B2'
  day: number                   // Kun raqami (1-126)
  category?: string             // Kategoriya (masalan: 'Tenses', 'Grammar')

  // Asosiy kontent
  formulas: Formula[]           // Grammatika formulalari
  rules: string[]               // Qoidalar (uz tilida, batafsil)
  vocabulary: Vocabulary[]      // Lug'at so'zlari
  examples: Example[]           // Misol gaplar

  // Mashqlar
  specialCases: SpecialCase[]   // Maxsus holatlar
  exercises: DailyExercise[]    // Mashqlar
  exerciseSections: Section[]   // Mashqlar bo'limlari
  tests: DailyExercise[]        // Testlar
  testSections: Section[]       // Test bo'limlari

  // Ixtiyoriy kontent
  image?: string                // Rasm URL
  reading?: ReadingSection      // O'qish bo'limi
  writing?: WritingSection      // Yozish topshirig'i
  listening?: ListeningSection  // Tinglash bo'limi
  speaking?: SpeakingSection    // Gapirish topshirig'i
  dialogues?: Dialogue[]        // Dialoglar
  culturalNotes?: CulturalNote[] // Madaniy eslatmalar
}
```

## Bosqich 3: Har bir Maydonni To'ldirish

### 3.1 Asosiy Maydonlar

```typescript
export const myNewLesson: DailyLesson = {
  id: 'my-new-lesson',              // Noyob ID, kichik harflar, defis bilan
  title: 'My New Lesson',           // Ingliz tilida dars nomi
  subtitle: "Darsning o'zbekcha tavsifi — batafsil va qiziqarli",
  level: 'B2',                      // CEFR darajasi
  day: 130,                         // Kun raqami (1-126 oralig'ida)
  category: 'Advanced Grammar',     // Kategoriya (ixtiyoriy)
```

### 3.2 Formulalar (Formulas)

Har bir formula 3 ta maydondan iborat:

```typescript
formulas: [
  {
    label: 'Formula nomi',           // Masalan: 'First Conditional'
    structure: 'If + Present Simple, will + V1', // Formula tuzilishi
    color: 'green'                   // Rang: 'green', 'red', 'blue', 'orange'
  },
  {
    label: 'Second Conditional',
    structure: 'If + Past Simple, would + V1',
    color: 'blue'
  },
],
```

**Ranglar ma'nosi:**
- `green` — Asosiy formula
- `blue` — Qo'shimcha formula
- `red` — Muhim qoida / taqiq
- `orange` — Ogohlantirish / istisno

### 3.3 Qoidalar (Rules)

Qoidalar O'zbek tilida yozilishi kerak. Har bir qoida batafsil va tushunarli bo'lishi kerak:

```typescript
rules: [
  "1️⃣ SAVOL SO'ZLARI (Question Words)\n\nWhat — nima\nWhere — qayerda\nWho — kim\nWhen — qachon\nWhy — nega\nHow — qanday\n\nMisol:\nWhat is your name? — Isming nima?\nWhere do you live? — Qayerda yashaysan?\nWho is that? — U kim?\nWhen is the meeting? — Yig'ilish qachon?\nWhy are you late? — Nega kechiktir?\nHow are you? — Qandaysan?",
  "2️⃣ SAVOL TUZISH QOIDALARI\n\n1. Modal fe'l bo'lsa → modal oldinga:\n   Can you help me?\n   Should I call him?\n\n2. Do/Does/Did bo'lsa → oldinga:\n   Do you like coffee?\n   Does she speak English?\n   Did you go yesterday?\n\n3. Boshqa hollarda → do/does qo'shish:\n   I like coffee → Do you like coffee?\n   She speaks English → Does she speak English?",
  // ... boshqa qoidalar
],
```

### 3.4 Lug'at (Vocabulary)

Har bir lug'at so'zi 4 ta maydondan iborat:

```typescript
vocabulary: [
  {
    en: 'can',                        // Inglizcha so'z
    uz: 'qila olmoq, mumkin',        // O'zbekcha tarjima
    example: 'I can speak English.',  // Misol gap
    rule: 'ability/permission'        // Qoida/tavsif
  },
  {
    en: 'must',
    uz: 'kerak (majburiy)',
    example: 'You must wear a seatbelt.',
    rule: 'obligation'
  },
  // ... boshqa so'zlar
],
```

### 3.5 Misollar (Examples)

```typescript
examples: [
  {
    en: 'I can swim very well.',           // Inglizcha misol
    uz: "Men juda yaxshi suza olaman."     // O'zbekcha tarjima
  },
  {
    en: 'You must wear a helmet.',
    uz: "Dubulg'a taqishingiz kerak."
  },
],
```

### 3.6 Maxsus Holatlar (SpecialCases)

Maxsus holatlar — bu darsdagi muhim grammatik farqlar yoki ogohlantirishlar:

```typescript
specialCases: [
  {
    id: 'can-vs-be-able-to',          // Noyob ID
    title: 'Can va Be Able To farqi',  // Sarlavha
    rule: 'Can — hozirgi zamonda qobiliyat uchun.\nBe able to — barcha zamonlarda.\n\nCan: I can swim.\nPast: I could swim when I was 5.\nFuture: I will be able to drive next year.', // Batafsil qoida
    mnemonic: 'Can=hozir, Could=o\'tgan, Will be able to=future.', // Yodlash usuli
    commonMistakes: "❌ I caned swim ❌\n❌ I will can swim ❌\n❌ I have could swim ❌", // Tez-tez uchraydigan xatolar
    examples: [
      { en: 'I can swim.', uz: 'Men suza olaman.' },
      { en: 'I could swim when I was five.', uz: 'Men besh yoshimda suza olardim.' },
    ],
    drills: [                           // Maxsus mashqlar
      {
        id: 14001,
        type: 'fill-blank',
        instruction: "Can yoki be able to — to'g'ri shaklni qo'ying:",
        question: 'I ___ speak two languages.',
        blanks: ['can'],
        explanation: "Hozirgi qobiliyat uchun 'can' ishlatiladi."
      },
    ],
  },
],
```

## Bosqich 4: Mashqlarni Qo'shish (7 xil turi)

### 4.1 Multiple Choice (Ko'p Tanlovli)

```typescript
{
  id: 14015,
  type: 'multiple-choice',
  instruction: "To'g'ri variantni tanlang:",
  question: 'I ___ help you with your homework.',
  options: ['can', 'cans', 'can to', 'am can'],  // 4 ta variant
  correct: 'can',                                  // To'g'ri javob
  explanation: "Modal fe'l + V1"                   // Tushuntirish
}
```

### 4.2 Fill in the Blank (Bo'sh joyni to'ldirish)

```typescript
{
  id: 14010,
  type: 'fill-blank',
  instruction: "To'g'ri modal fe'l bilan to'ldiring:",
  question: 'I ___ speak three languages.',
  blanks: ['can'],                                 // To'g'ri javob
  acceptedAnswers: [['can', 'could', 'may', 'might']], // Qabul qilinadigan javoblar (ixtiyoriy)
  explanation: "Can + V1 — qobiliyat"
}
```

### 4.3 Error Correction (Xatoni topish va tuzatish)

```typescript
{
  id: 14018,
  type: 'error-correction',
  instruction: "Xatoni toping va to'g'rilang:",
  question: 'He cans play football well.',
  errorPart: 'cans',                               // Xato qism
  correct: 'He can play football well.',           // To'g'ri shakl
  explanation: "Modal fe'lga -s qo'shilmaydi"
}
```

### 4.4 Transformation (Gapni o'zgartirish)

```typescript
{
  id: 14025,
  type: 'transformation',
  instruction: 'Inkoriyga o\'zgartiring:',
  question: 'You must go there.',
  hint: "Negative:",                               // Maslahat
  correct: "You mustn't go there.",               // To'g'ri javob
  explanation: "Must → mustn't"
}
```

### 4.5 Passage (Matnni to'ldirish)

```typescript
{
  id: 99001,
  type: 'passage',
  instruction: "Matnni to'ldiring:",
  passage: "Ali is talking to his friend.\nAli: ___(1) I borrow your pen?\nFriend: Sure, you ___(2). But you must give it back.",
  blanks: ['Can', 'can'],                          // Har bir bo'sh joy uchun javob
  acceptedAnswers: [['Can'], ['can']],              // Qabul qilinadigan javoblar
  explanation: "Can — ruxsat so'rash va qobiliyat."
}
```

### 4.6 Connection (Bog'lovchi topshiriq)

```typescript
{
  id: 99003,
  type: 'connection',
  instruction: "Nima qila olishingiz haqida yozing",
  prompt: "Can va could ishlatib, o'zingiz haqida 4-5 jumla yozing.",
  hints: ['I can ... (hozirgi qobiliyat)', 'I could ... (o\'tgan qobiliyat)'],
  exampleAnswer: "I can speak English and Russian. I can play the guitar."
}
```

### 4.7 Vocab Match (Lug'at Moslashtirish)

```typescript
{
  id: 14040,
  type: 'vocab-match',
  instruction: "Modal fe'l va ma'nosini moslang:",
  word: 'can',
  options: ['qobiliyat/ruxsat', 'majburiyat', 'maslahat', 'ehtimol'],
  correct: 'qobiliyat/ruxsat',
  explanation: "Can — qobiliyat yoki ruxsat uchun."
}
```

## Bosqich 5: Mashqlar Bo'limlarini Tashkil Etish

### 5.1 Exercise Sections

Mashqlarni mantiqiy bo'limlarga ajrating:

```typescript
exerciseSections: [
  {
    title: "Asosiy mashqlar",
    desc: "Modal fe'llarni to'g'ri ishlating",
    color: "blue",
    icon: "✏️",
    ids: [14010, 14011, 14012, 14013, 14014, 14015, 14016, 14017]
  },
  {
    title: "Xatolarni toping",
    desc: "Grammatik xatolarni aniqlang va tuzating",
    color: "red",
    icon: "🔍",
    ids: [14018, 14019, 14020]
  },
  {
    title: "Gaplarni o'zgartiring",
    desc: "Berilgan gaplarni talab qilingan shaklga o'zgartiring",
    color: "green",
    icon: "🔄",
    ids: [14025, 14026, 14031, 14037]
  },
],
```

### 5.2 Test Sections

Testlarni ham bo'limlarga ajrating:

```typescript
testSections: [
  {
    title: "Grammatika testi",
    desc: "Modal fe'llar grammatikasini tekshiring",
    color: "purple",
    icon: "📝",
    ids: [14010, 14011, 14012, 14013, 14014]
  },
  {
    title: "Lug'at testi",
    desc: "Lug'at bilimingizni sinang",
    color: "orange",
    icon: "📚",
    ids: [14040, 14041, 14042, 14043]
  },
],
```

## Bosqich 6: Ixtiyoriy Kontent Qo'shish

### 6.1 Listening (Tinglash)

```typescript
listening: {
  transcript: "Mum: Ali, can you help me in the kitchen?\nAli: Sure, Mum.",
  vocabulary: [
    { word: 'kitchen', definition: 'oshxona' },
    { word: 'sharp', definition: "o'tkir" },
  ],
  questions: [
    {
      id: 90141,
      type: 'multiple-choice',
      question: "What can Ali do to help?",
      options: ["Cut the vegetables", "Wash the vegetables"],
      correctIndex: 1,
      explanation: "'You can wash the vegetables'"
    },
  ],
  difficulty: 'easy',
  topic: "Modal fe'llar — can / must / might",
}
```

### 6.2 Writing (Yozish)

```typescript
writing: {
  prompt: "Write about your abilities and rules at home.",
  wordLimit: 60,
  tips: [
    "Use 'can' for ability: 'I can swim.'",
    "Use 'must' for rules: 'I must do my homework.'",
  ],
  modelAnswer: "I can speak English and Russian...",
  keyPhrases: [
    { phrase: 'I can', translation: 'Men qila olaman' }
  ],
  structure: ['Introduction', 'Main body', 'Conclusion'],
}
```

### 6.3 Speaking (Gapirish)

```typescript
speaking: {
  prompt: "Talk about your abilities for 30-60 seconds.",
  tips: ["O'rgangan grammatikani ishlatishga harakat qiling."],
  keyPhrases: [
    { phrase: 'I can', translation: 'Men qila olaman' }
  ],
  sampleAnswer: "I can speak English and Russian...",
}
```

## Bosqich 7: LessonsIndex'ga Ro'yxatdan O'tkazish

### 7.1 Avto-Generatsiya (Tavsiya etiladi)

`lessonsIndex.ts` avto-generatsiya qilinadi. Quyidagi buyruqni ishga tushiring:

```bash
UPDATE_INDEX=1 npx vitest run src/data/__tests__/lessonsIndex.test.ts
```

Bu buyruq:
1. Barcha dars fayllarini o'qiydi
2. Yangi darsni aniqlaydi
3. `lessonsIndex.ts` faylini yangilaydi
4. `LessonMeta` formatida yozadi

### 7.2 Qo'lda Qo'shish (Agar avto-generatsiya ishlamasa)

`src/data/daily/lessonsIndex.ts` fayliga qo'lda qo'shing:

```typescript
{
  "id": "my-new-lesson",
  "title": "My New Lesson",
  "subtitle": "Darsning o'zbekcha tavsifi",
  "level": "B2",
  "day": 130,
  "isReview": false,
  "formulas": 3,
  "vocabulary": 20,
  "exercises": 35,
  "tests": 15
}
```

### 7.3 Index Faylini Import Qiling

Agar yangi fayl yaratgan bo'lsangiz, uni `src/data/daily/index.ts` ga import qiling:

```typescript
// Yangi import qo'shing
export {
  myNewLesson,
} from './b2Part3'

// Yoki boshqa faylga qo'shing
```

## Bosqich 8: Index.ts'ga Export Qo'shish

`src/data/daily/index.ts` fayliga yangi darsni export qiling:

```typescript
// Yangi export qo'shing
export {
  myNewLesson,
} from './b2Part3'

// Yoki getAllLessons() funksiyasiga qo'shing:
export function getAllLessons(): DailyLesson[] {
  return [
    ...A1_LESSONS_NEW,
    ...A2_LESSONS,
    ...B1_LESSONS_NEW,
    ...B1PLUS_LESSONS_NEW,
    ...B2_LESSONS_NEW,
    myNewLesson,  // ← shu yerga qo'shing
  ]
}
```

## Bosqich 9: i18n Kalitlarini Qo'shish (Agar kerak bo'lsa)

Agar darsda yangi UI elementlar bo'lsa, `src/i18n/uz.json` ga kalitlar qo'shing:

```json
{
  "myNewLesson": {
    "title": "My New Lesson",
    "description": "Dars tavsifi"
  }
}
```

## Bosqich 10: Tekshirish va Sinov

### 10.1 Xatoliklarni Tekshirish

```bash
# ID larini tekshirish
npm run validate:ids

# Mashqlarni audit qilish
npm run audit:exercises

# Tarjimalarni tekshirish
npm run check:i18n

# YouTube mavjudligini tekshirish
npm run check:youtube
```

### 10.2 Testlarni Ishga Tushirish

```bash
# Barcha testlar
npm test

# Coverage bilan
npm run test:coverage

# Watch rejimida
npm run watch
```

### 10.3 Build Qilish

```bash
npm run build
```

### 10.4 Dev Server'da Sinash

```bash
npm run dev
```

Brauzerida `http://localhost:5173` manziliga o'ting va yangi darsni sinab ko'ring.

## Tez-tez Uchraydigan Xatolar

### 1. ID Takrorlanishi
```typescript
// ❌ Noto'g'ri — ID takrorlangan
{ id: 'modal-verbs', ... }
{ id: 'modal-verbs', ... }  // XATO!

// ✅ To'g'ri — noyob ID
{ id: 'modal-verbs', ... }
{ id: 'modal-verbs-advanced', ... }
```

### 2. Exercise ID Takrorlanishi
```typescript
// ❌ Noto'g'ri — exercise ID takrorlangan
{ id: 14010, type: 'fill-blank', ... }
{ id: 14010, type: 'multiple-choice', ... }  // XATO!

// ✅ To'g'ri — noyob ID
{ id: 14010, type: 'fill-blank', ... }
{ id: 14011, type: 'multiple-choice', ... }
```

### 3. DailyLesson Turiga Mos Kelmagan Maydon
```typescript
// ❌ Noto'g'ri — ixtiyoriy maydon noto'g'ri formatda
{ image: 123 }  // XATO! (string bo'lishi kerak)

// ✅ To'g'ri
{ image: '/images/lesson.png' }
```

### 4. Exercises va Tests Bo'sh
```typescript
// ❌ Noto'g'ri — mashqlar yo'q
{
  exercises: [],
  tests: [],
}

// ✅ To'g'ri — kamida bitta mashq
{
  exercises: [
    { id: 14010, type: 'fill-blank', instruction: "...", question: "...", blanks: ['can'], explanation: "..." }
  ],
  tests: [
    { id: 14010, type: 'fill-blank', instruction: "...", question: "...", blanks: ['can'], explanation: "..." }
  ],
}
```

## To'liq Misol

Quyida to'liq dars misolini ko'rishingiz mumkin:

```typescript
import type { DailyLesson } from '../dailyLessons'

export const myNewLesson: DailyLesson = {
  id: 'my-new-lesson',
  title: 'My New Lesson',
  subtitle: "Darsning batafsil o'zbekcha tavsifi — qiziqarli va tushunarli",
  level: 'B2',
  day: 130,
  category: 'Advanced Grammar',

  formulas: [
    { label: 'Asosiy formula', structure: 'If + Present Simple, will + V1', color: 'green' },
    { label: 'Qo\'shimcha formula', structure: 'If + Past Simple, would + V1', color: 'blue' },
  ],

  rules: [
    "1️⃣ ASOSIY QOIDA\n\nBu yerda batafsil qoida yoziladi...",
    "2️⃣ XATOLAR\n\nO'zbeklarning eng ko'p uchraydigan xatolari...",
  ],

  vocabulary: [
    { en: 'example', uz: 'misol', example: 'This is an example.', rule: 'noun' },
    { en: 'important', uz: 'muhim', example: 'This is important.', rule: 'adjective' },
  ],

  examples: [
    { en: 'This is an example sentence.', uz: 'Bu misol gap.' },
    { en: 'Another example.', uz: 'Boshqa misol.' },
  ],

  specialCases: [
    {
      id: 'special-case-1',
      title: 'Maxsus holat',
      rule: 'Bu yerda maxsus holat tavsiflanadi...',
      mnemonic: 'Yodlash usuli',
      commonMistakes: "❌ Noto'g'ri misol ❌",
      examples: [
        { en: 'Correct example', uz: "To'g'ri misol" },
      ],
      drills: [
        {
          id: 50001,
          type: 'fill-blank',
          instruction: "To'g'ri javobni kiriting:",
          question: 'This is ___ example.',
          blanks: ['an'],
          explanation: "An — unli harf bilan boshlangan otlar oldida."
        },
      ],
    },
  ],

  exercises: [
    {
      id: 50010,
      type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: 'This ___ an important lesson.',
      options: ['is', 'are', 'am', 'be'],
      correct: 'is',
      explanation: "This — 3-shaxs, ishlatiladi."
    },
    {
      id: 50011,
      type: 'fill-blank',
      instruction: "Bo'sh joyni to'ldiring:",
      question: 'I ___ speak English.',
      blanks: ['can'],
      explanation: "Can — qobiliyat."
    },
  ],

  exerciseSections: [
    {
      title: "Asosiy mashqlar",
      desc: "Grammatikani sinang",
      color: "blue",
      icon: "✏️",
      ids: [50010, 50011]
    },
  ],

  tests: [
    {
      id: 50010,
      type: 'multiple-choice',
      instruction: "Test savoli:",
      question: 'Which is correct?',
      options: ['This are', 'This is', 'This am', 'This be'],
      correct: 'This is',
      explanation: "This — 3-shaxs."
    },
  ],

  testSections: [
    {
      title: "Grammatika testi",
      desc: "Bilimingizni sinang",
      color: "purple",
      icon: "📝",
      ids: [50010]
    },
  ],
}
```

## Xulosa

Yangi dars qo'shish uchun:

1. **Fayl yarating** — `src/data/daily/` papkasida
2. **DailyLesson turini to'ldiring** — barcha majburiy maydonlarni
3. **Mashqlar qo'shing** — 7 xil turda (multiple-choice, fill-blank, error-correction, transformation, passage, connection, vocab-match)
4. **LessonsIndex'ga qo'shing** — avto-generatsiya yoki qo'lda
5. **Export qiling** — `index.ts` faylida
6. **Tekshiring** — `npm run validate:ids` va `npm test`

Agar savol bo'lsa, `src/data/daily/` papkasidagi mavjud darslarni namuna sifatida ishlating.
