// ═══════════════════════════════════════════════════════════════════════════
// Namunaviy dars — yangi falsafa: bitta mahorat, induktiv, kontekstli, BOY
// "Can — qobiliyat haqida gapirish" (A2)
// ═══════════════════════════════════════════════════════════════════════════

import { A2_DEMOS } from './demos/a2Demos'
import { B1_DEMOS } from './demos/b1Demos'
import { B1PLUS_DEMOS } from './demos/b1plusDemos'

export type DemoStep =
  // So'zlardan gap tuzish (word bank)
  | { type: 'build'; uz: string; words: string[]; correct: string[]; explanation: string }
  // Bo'shliqqa to'g'ri so'zni tanlash
  | { type: 'choose'; sentence: string; options: string[]; correct: string; uz: string; explanation: string }
  // Tinglab to'g'ri javobni tanlash
  | { type: 'listen'; audio: string; options: string[]; correct: string; explanation: string }
  // To'g'ri / Noto'g'ri (tez)
  | { type: 'judge'; sentence: string; isCorrect: boolean; explanation: string }
  // So'z–tarjima moslash (xotira)
  | { type: 'match'; pairs: { en: string; uz: string }[]; explanation: string }

export interface DemoVocab { en: string; uz: string; emoji: string; example: string }

export interface DemoLesson {
  id:       string
  skill:    string
  level:    string
  emoji:    string
  context:  { text: string; location: string }
  intro:    { title: string; points: string[] }     // boshida qisqa mavzu tushuntirishi
  examples: { en: string; uz: string; key: string }[]
  vocab:    DemoVocab[]                              // yangi so'zlar bo'limi
  steps:    DemoStep[]
  rule:     { title: string; body: string }
  summary:  string[]
}

export const DEMO_LESSON: DemoLesson = {
  id:    'can-ability-demo',
  skill: "Can bilan qobiliyat haqida gapirish",
  level: 'A2',
  emoji: '💪',

  // ─── Kontekst: foydalanuvchining o'z hayotiy vaziyati ──────────────────
  context: {
    text: "Tasavvur qiling — siz ish suhbatidasiz. Suhbatdor sizdan so'raydi: \"What can you do?\" Keling, \"can\" bilan o'zingizni ishonchli tanishtiramiz — nimalar qila olishingizni aytishni o'rganamiz!",
    location: 'Real vaziyat · Ish suhbati',
  },

  // ─── Mavzu haqida qisqa tushuntirish (boshida) ─────────────────────────
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "\"can\" — qobiliyatni bildiradi: \"qila olaman\"",
      "Tuzilishi juda oson: can + fe'l (I can swim)",
      "Hech qachon o'zgarmaydi — barcha shaxslar uchun bir xil",
      "Savol, inkor va qisqa javoblarni ham ko'ramiz",
    ],
  },

  // ─── Misollar (induktiv — 4 ta, turli forma) ───────────────────────────
  examples: [
    { en: 'I can speak English.',        uz: 'Men ingliz tilida gapira olaman.',  key: 'can' },
    { en: 'She can drive a car.',        uz: 'U mashina hayday oladi.',           key: 'can' },
    { en: 'Can you use a computer?',     uz: 'Kompyuterdan foydalana olasizmi?',  key: 'Can' },
    { en: "He can't cook, but he learns.", uz: 'U pishira olmaydi, lekin o\'rganyapti.', key: "can't" },
  ],

  // ─── Yangi so'zlar (can bilan ishlatiluvchi fe'llar) ───────────────────
  vocab: [
    { en: 'swim',      uz: 'suzmoq',           emoji: '🏊', example: 'I can swim in the sea.' },
    { en: 'drive',     uz: 'haydamoq',         emoji: '🚗', example: 'She can drive a bus.' },
    { en: 'cook',      uz: 'ovqat pishirmoq',  emoji: '🍳', example: 'Can you cook plov?' },
    { en: 'dance',     uz: 'raqsga tushmoq',   emoji: '💃', example: 'They can dance very well.' },
    { en: 'paint',     uz: 'rasm chizmoq',     emoji: '🎨', example: 'He can paint beautiful pictures.' },
    { en: 'repair',    uz: 'ta\'mirlamoq',     emoji: '🔧', example: 'I can repair a computer.' },
  ],

  // ─── Mashqlar (15 ta, aralash turlar, kontekstli) ──────────────────────
  steps: [
    // 1. So'z-tarjima moslash (yangi so'zlarni mustahkamlash)
    {
      type: 'match',
      pairs: [
        { en: 'swim',  uz: 'suzmoq' },
        { en: 'drive', uz: 'haydamoq' },
        { en: 'cook',  uz: "ovqat pishirmoq" },
        { en: 'dance', uz: 'raqsga tushmoq' },
      ],
      explanation: "Yangi fe'llar — bularning hammasi 'can' bilan ishlatiladi.",
    },
    // 2. Choose
    {
      type: 'choose',
      sentence: 'I ___ swim very well.',
      options: ['can', 'cans', 'can to'],
      correct: 'can',
      uz: 'Men juda yaxshi suza olaman.',
      explanation: "Can + asosiy fe'l (V1). 'can' hech qachon o'zgarmaydi — 'cans' yo'q.",
    },
    // 3. Build
    {
      type: 'build',
      uz: 'U piano chala oladi.',
      words: ['She', 'can', 'play', 'the', 'piano'],
      correct: ['She', 'can', 'play', 'the', 'piano'],
      explanation: "Tartib: Ega + can + fe'l. 'She can play' — to'g'ri.",
    },
    // 4. Judge
    {
      type: 'judge',
      sentence: 'He can to cook.',
      isCorrect: false,
      explanation: "Noto'g'ri! Can'dan keyin 'to' ishlatilmaydi. To'g'risi: 'He can cook.'",
    },
    // 5. Listen
    {
      type: 'listen',
      audio: 'Can you help me?',
      options: ['Can you help me?', 'Can you helps me?', 'You can help me?'],
      correct: 'Can you help me?',
      explanation: "Savol: Can + ega + fe'l. 'Can you help?' — to'g'ri tartib.",
    },
    // 6. Choose (inkor)
    {
      type: 'choose',
      sentence: "I ___ drive. I have no license.",
      options: ["can't", "can", "don't can"],
      correct: "can't",
      uz: 'Men hayday olmayman. Pravam yo\'q.',
      explanation: "Inkor: can't (= cannot). 'don't can' noto'g'ri.",
    },
    // 7. Build
    {
      type: 'build',
      uz: 'Men yaxshi ovqat pishira olaman.',
      words: ['I', 'can', 'cook', 'well'],
      correct: ['I', 'can', 'cook', 'well'],
      explanation: "'I can cook well' — Ega + can + fe'l + qo'shimcha.",
    },
    // 8. Judge
    {
      type: 'judge',
      sentence: 'She can paints pictures.',
      isCorrect: false,
      explanation: "Noto'g'ri! Can'dan keyin fe'l o'zgarmaydi: 'can paint' (paints emas).",
    },
    // 9. Choose (savol)
    {
      type: 'choose',
      sentence: '___ you dance?',
      options: ['Can', 'Do', 'Are'],
      correct: 'Can',
      uz: 'Raqsga tusha olasizmi?',
      explanation: "Qobiliyat savoli — 'Can' bilan boshlanadi.",
    },
    // 10. Listen
    {
      type: 'listen',
      audio: 'I can repair computers.',
      options: ['I can repair computers.', 'I can repairs computers.', 'I repair can computers.'],
      correct: 'I can repair computers.',
      explanation: "'I can repair' — Ega + can + fe'l (V1).",
    },
    // 11. Build (savol)
    {
      type: 'build',
      uz: 'Siz shaxmat o\'ynay olasizmi?',
      words: ['Can', 'you', 'play', 'chess'],
      correct: ['Can', 'you', 'play', 'chess'],
      explanation: "Savol tartibi: Can + ega + fe'l. 'Can you play chess?'",
    },
    // 12. Judge
    {
      type: 'judge',
      sentence: 'I can speak three languages.',
      isCorrect: true,
      explanation: "To'g'ri! 'Can + V1' — qobiliyatni ifodalaydi. Mukammal!",
    },
    // 13. Choose
    {
      type: 'choose',
      sentence: 'They ___ paint very well.',
      options: ['can', 'can to', 'cans'],
      correct: 'can',
      uz: 'Ular juda yaxshi rasm chiza oladi.',
      explanation: "Ko'plik bilan ham 'can' o'zgarmaydi: 'They can paint'.",
    },
    // 14. Match (ikkinchi to'plam)
    {
      type: 'match',
      pairs: [
        { en: 'paint',  uz: 'rasm chizmoq' },
        { en: 'repair', uz: "ta'mirlamoq" },
        { en: "can't",  uz: 'qila olmaslik' },
        { en: 'well',   uz: "yaxshi (ravish)" },
      ],
      explanation: "So'z-ma'no juftliklarini eslab qoling.",
    },
    // 15. Build (yakuniy — dialog)
    {
      type: 'build',
      uz: 'Men ingliz tilida gapira olaman va kompyuterdan foydalanaman.',
      words: ['I', 'can', 'speak', 'English', 'and', 'use', 'a', 'computer'],
      correct: ['I', 'can', 'speak', 'English', 'and', 'use', 'a', 'computer'],
      explanation: "Ish suhbatida shunday javob bering! Bitta 'can' ikki fe'lga ishlaydi.",
    },
  ],

  // ─── Qoida ("💡 Nega?" tugma ostida) ───────────────────────────────────
  rule: {
    title: 'Can — to\'liq qoida',
    body: "Can — modal fe'l, qobiliyatni bildiradi (\"qila olaman\").\n\n✅ Can + V1 (asosiy fe'l): I can swim\n❌ 'to' ISHLATILMAYDI: I can to swim\n❌ Fe'l o'zgarmaydi: she can swim (cans/swims emas)\n\n❓ Savol: Can + ega + fe'l? → Can you help?\n🚫 Inkor: cannot / can't → I can't swim\n\n💡 Bitta 'can' bir nechta fe'lga ishlaydi:\n   I can sing and dance.",
  },

  // ─── Dars yakuni — mustahkamlash ───────────────────────────────────────
  summary: [
    "can + V1 — qobiliyat (\"qila olaman\")",
    "'to' va '-s' ishlatilmaydi: can swim (can to swim / cans emas)",
    "Savol: Can you...? · Inkor: can't",
    "6 ta yangi fe'l: swim, drive, cook, dance, paint, repair",
  ],
}

// ═══════════════════════════════════════════════════════════════════════════
// Simple Present — har kungi ish, odat, faktlar (A1-A2)
// ═══════════════════════════════════════════════════════════════════════════

export const SIMPLE_PRESENT_LESSON: DemoLesson = {
  id:    'simple-present-demo',
  skill: 'Simple Present — kundalik ishlar haqida gapirish',
  level: 'A1',
  emoji: '🔄',

  // ─── Kontekst: foydalanuvchining o'z hayotiy vaziyati ──────────────────
  context: {
    text: "Tasavvur qiling — siz yangi ishga keldingiz. Hamkasblaringizga o'zingiz va boshqalar har kuni nima qilishini aytasiz. Keling, \"har kuni\" qiladigan ishlar haqida gapirishni o'rganamiz!",
    location: 'Real vaziyat · Yangi ish',
  },

  // ─── Mavzu haqida qisqa tushuntirish (boshida) ─────────────────────────
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Simple Present — har kungi ish, odat va faktlar uchun",
      "I / You / We / They bilan: fe'l o'zgarmaydi (I work)",
      "He / She / It bilan: fe'lga -s qo'shiladi (She works)",
      "Savol: Do / Does · Inkor: don't / doesn't",
    ],
  },

  // ─── Misollar (induktiv — 4 ta, turli forma) ───────────────────────────
  examples: [
    { en: 'I work in an office.',      uz: 'Men ofisda ishlayman.',           key: 'work' },
    { en: 'She works every day.',      uz: 'U har kuni ishlaydi.',            key: 'works' },
    { en: 'Do you like coffee?',       uz: 'Qahvani yoqtirasizmi?',           key: 'Do' },
    { en: "He doesn't eat meat.",      uz: 'U go\'sht yemaydi.',              key: "doesn't" },
  ],

  // ─── Yangi so'zlar (kundalik fe'llar) ──────────────────────────────────
  vocab: [
    { en: 'work',  uz: 'ishlamoq',           emoji: '💼', example: 'I work from 9 to 6.' },
    { en: 'study', uz: 'o\'qimoq',           emoji: '📚', example: 'She studies medicine.' },
    { en: 'live',  uz: 'yashamoq',           emoji: '🏠', example: 'They live in Tashkent.' },
    { en: 'like',  uz: 'yoqtirmoq',          emoji: '❤️', example: 'I like tea.' },
    { en: 'watch', uz: 'tomosha qilmoq',     emoji: '📺', example: 'He watches TV at night.' },
    { en: 'play',  uz: 'o\'ynamoq',          emoji: '⚽', example: 'We play football on Sundays.' },
    { en: 'go',    uz: 'bormoq',             emoji: '🚶', example: 'She goes to work by bus.' },
    { en: 'eat',   uz: 'yemoq',              emoji: '🍽️', example: 'He eats breakfast at 8.' },
  ],

  // ─── Mashqlar (22 ta — V1, -s, do/does, don't/doesn't, frequency) ──────
  steps: [
    // 1. So'z-moslash
    {
      type: 'match',
      pairs: [
        { en: 'work',  uz: 'ishlamoq' },
        { en: 'study', uz: "o'qimoq" },
        { en: 'live',  uz: 'yashamoq' },
        { en: 'like',  uz: 'yoqtirmoq' },
      ],
      explanation: "Yangi fe'llar — har kungi ishlarni bildiradi.",
    },
    // 2. choose — he/she/it + s
    {
      type: 'choose',
      sentence: 'She ___ every day.',
      options: ['work', 'works', 'working'],
      correct: 'works',
      uz: 'U har kuni ishlaydi.',
      explanation: "He/She/It bilan fe'lga -s qo'shiladi: she works.",
    },
    // 3. judge
    {
      type: 'judge',
      sentence: 'He work every day.',
      isCorrect: false,
      explanation: "Noto'g'ri! He/She/It bilan -s kerak: 'He works every day.'",
    },
    // 4. build — I + V1
    {
      type: 'build',
      uz: 'Men ofisda ishlayman.',
      words: ['I', 'work', 'in', 'an', 'office'],
      correct: ['I', 'work', 'in', 'an', 'office'],
      explanation: "I/You/We/They bilan fe'l o'zgarmaydi: 'I work'.",
    },
    // 5. choose — do/does savol
    {
      type: 'choose',
      sentence: '___ you like tea?',
      options: ['Do', 'Does', 'Are'],
      correct: 'Do',
      uz: 'Choyni yoqtirasizmi?',
      explanation: "I/You/We/They bilan savol: Do. 'Do you like...?'",
    },
    // 6. listen
    {
      type: 'listen',
      audio: 'She watches TV every evening.',
      options: ['She watches TV every evening.', 'She watch TV every evening.', 'She watching TV every evening.'],
      correct: 'She watches TV every evening.',
      explanation: "watch → watches (-ch bilan tugasa -es qo'shiladi).",
    },
    // 7. choose — doesn't inkor
    {
      type: 'choose',
      sentence: "He ___ eat meat.",
      options: ["doesn't", "don't", "not"],
      correct: "doesn't",
      uz: 'U go\'sht yemaydi.',
      explanation: "He/She/It inkori: doesn't + V1. 'He doesn't eat'.",
    },
    // 8. build — she + studies
    {
      type: 'build',
      uz: 'U ingliz tilini o\'rganadi.',
      words: ['She', 'studies', 'English'],
      correct: ['She', 'studies', 'English'],
      explanation: "study → studies (-y → -ies undosh bilan).",
    },
    // 9. judge
    {
      type: 'judge',
      sentence: 'I works hard.',
      isCorrect: false,
      explanation: "Noto'g'ri! I bilan -s yo'q: 'I work hard.' (-s faqat he/she/it).",
    },
    // 10. choose — does savol
    {
      type: 'choose',
      sentence: '___ she live here?',
      options: ['Does', 'Do', 'Is'],
      correct: 'Does',
      uz: 'U shu yerda yashaydimi?',
      explanation: "He/She/It savoli: Does. 'Does she live...?' (fe'l -s siz!).",
    },
    // 11. listen
    {
      type: 'listen',
      audio: 'They play football on Sundays.',
      options: ['They play football on Sundays.', 'They plays football on Sundays.', 'They playing football on Sundays.'],
      correct: 'They play football on Sundays.',
      explanation: "They bilan fe'l o'zgarmaydi: 'They play'.",
    },
    // 12. build — Do savol
    {
      type: 'build',
      uz: 'Siz ingliz tilida gapirasizmi?',
      words: ['Do', 'you', 'speak', 'English'],
      correct: ['Do', 'you', 'speak', 'English'],
      explanation: "Savol: Do + ega + V1. 'Do you speak English?'",
    },
    // 13. judge
    {
      type: 'judge',
      sentence: 'My brother lives in London.',
      isCorrect: true,
      explanation: "To'g'ri! 'brother' = he, demak lives (-s bilan). Mukammal!",
    },
    // 14. match — ikkinchi to'plam
    {
      type: 'match',
      pairs: [
        { en: 'watch',   uz: 'tomosha qilmoq' },
        { en: 'play',    uz: "o'ynamoq" },
        { en: "doesn't", uz: 'qilmaydi (he/she)' },
        { en: 'every day', uz: 'har kuni' },
      ],
      explanation: "So'z-ma'no juftliklarini eslab qoling.",
    },
    // 15. build — doesn't inkor (yakuniy)
    {
      type: 'build',
      uz: 'U qahvani yoqtirmaydi.',
      words: ['He', "doesn't", 'like', 'coffee'],
      correct: ['He', "doesn't", 'like', 'coffee'],
      explanation: "Inkor: doesn't + V1 (o'zgarmaydi). 'He doesn't like'.",
    },
    // 16. choose — go → goes (maxsus -es)
    {
      type: 'choose',
      sentence: 'She ___ to work by bus.',
      options: ['goes', 'go', 'gos'],
      correct: 'goes',
      uz: 'U ishga avtobusda boradi.',
      explanation: "go → goes (-o bilan tugasa -es qo'shiladi).",
    },
    // 17. judge — has
    {
      type: 'judge',
      sentence: 'He have a car.',
      isCorrect: false,
      explanation: "Noto'g'ri! have → has (he/she/it bilan). 'He has a car.'",
    },
    // 18. choose — frequency adverb
    {
      type: 'choose',
      sentence: 'I ___ drink coffee in the morning.',
      options: ['always', 'am always', 'always am'],
      correct: 'always',
      uz: 'Men ertalab doim qahva ichaman.',
      explanation: "Takror so'zlar (always, usually, never) fe'ldan oldin keladi: I always drink.",
    },
    // 19. listen — eats
    {
      type: 'listen',
      audio: 'He eats breakfast at eight.',
      options: ['He eats breakfast at eight.', 'He eat breakfast at eight.', 'He eating breakfast at eight.'],
      correct: 'He eats breakfast at eight.',
      explanation: "eat → eats (he bilan -s qo'shiladi).",
    },
    // 20. build — Does savol
    {
      type: 'build',
      uz: 'U futbol o\'ynaydimi?',
      words: ['Does', 'he', 'play', 'football'],
      correct: ['Does', 'he', 'play', 'football'],
      explanation: "Savol: Does + he + V1 (fe'l -s siz!). 'Does he play?'",
    },
    // 21. judge — never
    {
      type: 'judge',
      sentence: 'She never eats meat.',
      isCorrect: true,
      explanation: "To'g'ri! 'never' fe'ldan oldin, 'eats' he/she bilan -s. Mukammal!",
    },
    // 22. build — don't (yakuniy)
    {
      type: 'build',
      uz: 'Biz dushanba kuni ishlamaymiz.',
      words: ['We', "don't", 'work', 'on', 'Monday'],
      correct: ['We', "don't", 'work', 'on', 'Monday'],
      explanation: "I/You/We/They inkori: don't + V1. 'We don't work'.",
    },
  ],

  // ─── Qoida ───────────────────────────────────────────────────────────
  rule: {
    title: 'Simple Present — to\'liq qoida',
    body: "Simple Present — kundalik ish, odat, fakt uchun ishlatiladi.\n\n✅ I / You / We / They + V1: I work\n✅ He / She / It + V+s: She works\n\n📝 -s qo'shilishi:\n   • Oddiy: work → works\n   • -ch/-sh/-s/-x/-o: watch → watches\n   • undosh + y: study → studies\n\n❓ Savol: Do/Does + ega + V1?\n   Do you work? · Does she work? (fe'l -s siz!)\n\n🚫 Inkor: don't / doesn't + V1\n   I don't work · He doesn't work",
  },

  // ─── Dars yakuni ──────────────────────────────────────────────────────
  summary: [
    "He/She/It bilan fe'lga -s: she works",
    "I/You/We/They bilan o'zgarmaydi: I work",
    "Savol: Do/Does...? · Inkor: don't/doesn't",
    "6 ta fe'l: work, study, live, like, watch, play",
  ],
}

// ═══════════════════════════════════════════════════════════════════════════
// Present Continuous — hozir sodir bo'layotgan harakat (A1)
// ═══════════════════════════════════════════════════════════════════════════

export const PRESENT_CONTINUOUS_LESSON: DemoLesson = {
  id:    'present-continuous-demo',
  skill: 'Present Continuous — hozir nima qilayotganingizni aytish',
  level: 'A1',
  emoji: '🏃',

  context: {
    text: "Tasavvur qiling — do'stingiz qo'ng'iroq qildi va so'rayapti: \"What are you doing?\" Keling, hozir aynan shu paytda nima qilayotganingizni aytishni o'rganamiz!",
    location: 'Real vaziyat · Telefon suhbati',
  },

  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Present Continuous — HOZIR, aynan shu paytda sodir bo'layotgan harakat",
      "Tuzilishi: am / is / are + fe'l-ing (I am working)",
      "I bilan am, He/She/It bilan is, You/We/They bilan are",
      "Savol va inkor shakllarini ham ko'ramiz",
    ],
  },

  examples: [
    { en: 'I am working now.',         uz: 'Men hozir ishlayapman.',          key: 'am working' },
    { en: 'She is cooking dinner.',    uz: 'U kechki ovqat pishiryapti.',     key: 'is cooking' },
    { en: 'Are you studying?',         uz: 'Siz o\'qiyapsizmi?',              key: 'Are' },
    { en: "They aren't sleeping.",     uz: 'Ular uxlamayapti.',               key: "aren't" },
  ],

  vocab: [
    { en: 'read',   uz: 'o\'qimoq',         emoji: '📖', example: 'I am reading a book.' },
    { en: 'write',  uz: 'yozmoq',           emoji: '✍️', example: 'She is writing a letter.' },
    { en: 'run',    uz: 'yugurmoq',         emoji: '🏃', example: 'He is running in the park.' },
    { en: 'sleep',  uz: 'uxlamoq',          emoji: '😴', example: 'The baby is sleeping.' },
    { en: 'listen', uz: 'tinglamoq',        emoji: '🎧', example: 'We are listening to music.' },
    { en: 'wait',   uz: 'kutmoq',           emoji: '⏳', example: 'They are waiting for the bus.' },
    { en: 'drink',  uz: 'ichmoq',           emoji: '🥤', example: 'I am drinking tea.' },
    { en: 'sit',    uz: 'o\'tirmoq',        emoji: '🪑', example: 'She is sitting on the chair.' },
  ],

  steps: [
    { type: 'match', pairs: [{ en: 'read', uz: "o'qimoq" }, { en: 'write', uz: 'yozmoq' }, { en: 'run', uz: 'yugurmoq' }, { en: 'sleep', uz: 'uxlamoq' }], explanation: "Yangi fe'llar — bularning -ing shaklini o'rganamiz." },
    { type: 'choose', sentence: 'I ___ reading a book.', options: ['am', 'is', 'are'], correct: 'am', uz: 'Men kitob o\'qiyapman.', explanation: "I bilan doim 'am' ishlatiladi: I am reading." },
    { type: 'choose', sentence: 'She ___ cooking now.', options: ['is', 'am', 'are'], correct: 'is', uz: 'U hozir ovqat pishiryapti.', explanation: "He/She/It bilan 'is': She is cooking." },
    { type: 'judge', sentence: 'They is playing football.', isCorrect: false, explanation: "Noto'g'ri! They bilan 'are': They are playing." },
    { type: 'build', uz: 'Men musiqa tinglayapman.', words: ['I', 'am', 'listening', 'to', 'music'], correct: ['I', 'am', 'listening', 'to', 'music'], explanation: "I + am + fe'l-ing: 'I am listening'." },
    { type: 'choose', sentence: 'We ___ waiting for you.', options: ['are', 'is', 'am'], correct: 'are', uz: 'Biz sizni kutyapmiz.', explanation: "We/You/They bilan 'are': We are waiting." },
    { type: 'listen', audio: 'He is running in the park.', options: ['He is running in the park.', 'He is run in the park.', 'He running in the park.'], correct: 'He is running in the park.', explanation: "run → running (oxirgi harf takrorlanadi): is running." },
    { type: 'judge', sentence: 'The baby is sleeping.', isCorrect: true, explanation: "To'g'ri! is + sleeping. Mukammal!" },
    { type: 'choose', sentence: 'What ___ you doing?', options: ['are', 'is', 'am'], correct: 'are', uz: 'Siz nima qilyapsiz?', explanation: "Savol: are + you. 'What are you doing?'" },
    { type: 'build', uz: 'U xat yozyapti.', words: ['She', 'is', 'writing', 'a', 'letter'], correct: ['She', 'is', 'writing', 'a', 'letter'], explanation: "write → writing (e tushadi): She is writing." },
    { type: 'judge', sentence: 'I am study English.', isCorrect: false, explanation: "Noto'g'ri! Fe'lga -ing kerak: 'I am studying English.'" },
    { type: 'choose', sentence: 'The dog ___ running fast.', options: ['is', 'are', 'am'], correct: 'is', uz: 'It tez yuguryapti.', explanation: "It (dog) bilan 'is': is running." },
    { type: 'listen', audio: 'We are drinking tea.', options: ['We are drinking tea.', 'We is drinking tea.', 'We are drink tea.'], correct: 'We are drinking tea.', explanation: "We + are + drinking: 'We are drinking'." },
    { type: 'build', uz: 'Ular avtobus kutyapti.', words: ['They', 'are', 'waiting', 'for', 'the', 'bus'], correct: ['They', 'are', 'waiting', 'for', 'the', 'bus'], explanation: "They + are + waiting: 'They are waiting'." },
    { type: 'judge', sentence: 'She is sitting on the chair.', isCorrect: true, explanation: "To'g'ri! sit → sitting (t takrorlanadi). Mukammal!" },
    { type: 'choose', sentence: 'I ___ not watching TV.', options: ['am', 'is', 'are'], correct: 'am', uz: 'Men televizor ko\'rmayapman.', explanation: "Inkor: I am not watching." },
    { type: 'match', pairs: [{ en: 'listen', uz: 'tinglamoq' }, { en: 'wait', uz: 'kutmoq' }, { en: 'drink', uz: 'ichmoq' }, { en: 'now', uz: 'hozir' }], explanation: "So'z-ma'no juftliklarini eslab qoling." },
    { type: 'build', uz: 'Siz kitob o\'qiyapsizmi?', words: ['Are', 'you', 'reading', 'a', 'book'], correct: ['Are', 'you', 'reading', 'a', 'book'], explanation: "Savol: Are + you + fe'l-ing. 'Are you reading?'" },
    { type: 'judge', sentence: 'He are working now.', isCorrect: false, explanation: "Noto'g'ri! He bilan 'is': 'He is working now.'" },
    { type: 'choose', sentence: 'They ___ sleeping now.', options: ['are', 'is', 'am'], correct: 'are', uz: 'Ular hozir uxlayapti.', explanation: "They + are + sleeping." },
    { type: 'build', uz: 'Men hozir choy ichyapman.', words: ['I', 'am', 'drinking', 'tea', 'now'], correct: ['I', 'am', 'drinking', 'tea', 'now'], explanation: "I + am + drinking + now (hozir). Mukammal yakun!" },
  ],

  rule: {
    title: 'Present Continuous — to\'liq qoida',
    body: "Present Continuous — HOZIR, aynan shu paytda sodir bo'layotgan harakat.\n\n✅ Tuzilishi: am/is/are + fe'l-ing\n   • I → am: I am working\n   • He/She/It → is: She is cooking\n   • You/We/They → are: They are playing\n\n📝 -ing qo'shilishi:\n   • Oddiy: work → working\n   • -e tushadi: write → writing\n   • Oxirgi harf takrorlanadi: run → running, sit → sitting\n\n❓ Savol: am/is/are + ega + fe'l-ing?\n   Are you working?\n\n🚫 Inkor: am/is/are + not + fe'l-ing\n   I am not working · She isn't cooking",
  },

  summary: [
    "am/is/are + fe'l-ing — hozir sodir bo'layotgan harakat",
    "I→am, He/She/It→is, You/We/They→are",
    "-ing qoidalari: write→writing, run→running",
    "Savol: Are you...? · Inkor: isn't/aren't",
  ],
}

// ═══════════════════════════════════════════════════════════════════════════
// Simple Past — o'tgan zamondagi harakat (A1)
// ═══════════════════════════════════════════════════════════════════════════

export const SIMPLE_PAST_LESSON: DemoLesson = {
  id:    'simple-past-demo',
  skill: 'Simple Past — o\'tmishda nima bo\'lganini aytish',
  level: 'A1',
  emoji: '⏪',

  context: {
    text: "Tasavvur qiling — do'stingiz so'rayapti: \"What did you do yesterday?\" Keling, kecha yoki o'tmishda nima qilganingizni aytishni o'rganamiz!",
    location: 'Real vaziyat · Do\'st bilan suhbat',
  },

  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Simple Past — o'tmishda tugagan harakat (kecha, o'tgan hafta)",
      "Oddiy fe'llar: fe'l + ed (worked, played)",
      "Noto'g'ri fe'llar: maxsus shakl (go→went, eat→ate)",
      "Savol: Did...? · Inkor: didn't",
    ],
  },

  examples: [
    { en: 'I worked yesterday.',       uz: 'Men kecha ishladim.',             key: 'worked' },
    { en: 'She went to school.',       uz: 'U maktabga bordi.',               key: 'went' },
    { en: 'Did you eat breakfast?',    uz: 'Nonushta qildingizmi?',           key: 'Did' },
    { en: "He didn't come home.",      uz: 'U uyga kelmadi.',                 key: "didn't" },
  ],

  vocab: [
    { en: 'go → went',    uz: 'bordi',      emoji: '🚶', example: 'I went to the market.' },
    { en: 'eat → ate',    uz: 'yedi',       emoji: '🍽️', example: 'She ate an apple.' },
    { en: 'see → saw',    uz: 'ko\'rdi',    emoji: '👀', example: 'We saw a film.' },
    { en: 'buy → bought', uz: 'sotib oldi', emoji: '🛒', example: 'He bought a car.' },
    { en: 'play → played',uz: 'o\'ynadi',   emoji: '⚽', example: 'They played football.' },
    { en: 'visit → visited',uz: 'tashrif buyurdi', emoji: '🏠', example: 'I visited my friend.' },
    { en: 'watch → watched',uz: 'tomosha qildi', emoji: '📺', example: 'She watched TV.' },
    { en: 'come → came',  uz: 'keldi',      emoji: '🚪', example: 'He came late.' },
  ],

  steps: [
    { type: 'match', pairs: [{ en: 'went', uz: 'bordi' }, { en: 'ate', uz: 'yedi' }, { en: 'saw', uz: "ko'rdi" }, { en: 'came', uz: 'keldi' }], explanation: "Noto'g'ri fe'llarning o'tgan shakli — yodlash kerak." },
    { type: 'choose', sentence: 'I ___ football yesterday.', options: ['played', 'play', 'playing'], correct: 'played', uz: 'Men kecha futbol o\'ynadim.', explanation: "Oddiy fe'l: play → played (-ed qo'shiladi)." },
    { type: 'choose', sentence: 'She ___ to school.', options: ['went', 'goed', 'go'], correct: 'went', uz: 'U maktabga bordi.', explanation: "go — noto'g'ri fe'l: go → went ('goed' yo'q!)." },
    { type: 'judge', sentence: 'He eated an apple.', isCorrect: false, explanation: "Noto'g'ri! eat → ate (noto'g'ri fe'l). 'He ate an apple.'" },
    { type: 'build', uz: 'Men do\'stimga tashrif buyurdim.', words: ['I', 'visited', 'my', 'friend'], correct: ['I', 'visited', 'my', 'friend'], explanation: "visit → visited (-ed): 'I visited'." },
    { type: 'choose', sentence: 'We ___ a film last night.', options: ['saw', 'seen', 'see'], correct: 'saw', uz: 'Biz kecha film ko\'rdik.', explanation: "see → saw (noto'g'ri fe'l)." },
    { type: 'listen', audio: 'He bought a new car.', options: ['He bought a new car.', 'He buyed a new car.', 'He buy a new car.'], correct: 'He bought a new car.', explanation: "buy → bought (noto'g'ri fe'l, 'buyed' yo'q)." },
    { type: 'judge', sentence: 'She watched TV yesterday.', isCorrect: true, explanation: "To'g'ri! watch → watched (-ed). Mukammal!" },
    { type: 'choose', sentence: '___ you eat breakfast?', options: ['Did', 'Do', 'Was'], correct: 'Did', uz: 'Nonushta qildingizmi?', explanation: "O'tgan zamon savoli: Did + ega + V1." },
    { type: 'build', uz: 'U bozorga bordi.', words: ['He', 'went', 'to', 'the', 'market'], correct: ['He', 'went', 'to', 'the', 'market'], explanation: "go → went: 'He went to the market'." },
    { type: 'judge', sentence: 'I goed home.', isCorrect: false, explanation: "Noto'g'ri! go → went. 'I went home.'" },
    { type: 'choose', sentence: 'They ___ a big house.', options: ['bought', 'buyed', 'buy'], correct: 'bought', uz: 'Ular katta uy sotib olishdi.', explanation: "buy → bought (noto'g'ri fe'l)." },
    { type: 'listen', audio: 'She came home late.', options: ['She came home late.', 'She comed home late.', 'She come home late.'], correct: 'She came home late.', explanation: "come → came (noto'g'ri fe'l)." },
    { type: 'build', uz: 'Did bilan savol: Siz filmni ko\'rdingizmi?', words: ['Did', 'you', 'see', 'the', 'film'], correct: ['Did', 'you', 'see', 'the', 'film'], explanation: "Savol: Did + you + V1 (saw emas, see!). 'Did you see?'" },
    { type: 'judge', sentence: 'Did you went home?', isCorrect: false, explanation: "Noto'g'ri! Did dan keyin V1: 'Did you go home?' (went emas)." },
    { type: 'choose', sentence: 'He ___ come to the party.', options: ["didn't", "doesn't", "wasn't"], correct: "didn't", uz: 'U bazmga kelmadi.', explanation: "O'tgan zamon inkori: didn't + V1." },
    { type: 'match', pairs: [{ en: 'bought', uz: 'sotib oldi' }, { en: 'watched', uz: 'tomosha qildi' }, { en: 'yesterday', uz: 'kecha' }, { en: "didn't", uz: 'qilmadi' }], explanation: "So'z-ma'no juftliklarini eslab qoling." },
    { type: 'build', uz: 'Men olma yedim.', words: ['I', 'ate', 'an', 'apple'], correct: ['I', 'ate', 'an', 'apple'], explanation: "eat → ate: 'I ate an apple'." },
    { type: 'judge', sentence: 'They played in the park.', isCorrect: true, explanation: "To'g'ri! play → played (-ed). Mukammal!" },
    { type: 'choose', sentence: 'I ___ TV last night.', options: ['watched', 'watch', 'watching'], correct: 'watched', uz: 'Men kecha televizor ko\'rdim.', explanation: "watch → watched (-ed)." },
    { type: 'build', uz: 'U uyga kelmadi.', words: ['He', "didn't", 'come', 'home'], correct: ['He', "didn't", 'come', 'home'], explanation: "Inkor: didn't + V1 (come, came emas). Mukammal yakun!" },
  ],

  rule: {
    title: 'Simple Past — to\'liq qoida',
    body: "Simple Past — o'tmishda tugagan harakat (kecha, o'tgan hafta).\n\n✅ Oddiy fe'llar: fe'l + ed\n   • work → worked · play → played\n   • -e: like → liked\n   • undosh+y: study → studied\n\n⚠️ Noto'g'ri fe'llar (yodlash kerak):\n   go → went · eat → ate · see → saw\n   buy → bought · come → came · have → had\n\n❓ Savol: Did + ega + V1? (asosiy shakl!)\n   Did you go? (went emas!)\n\n🚫 Inkor: didn't + V1\n   I didn't go · He didn't eat",
  },

  summary: [
    "Oddiy fe'l: + ed (worked, played)",
    "Noto'g'ri fe'l: maxsus shakl (go→went, eat→ate)",
    "Savol: Did + V1? · Inkor: didn't + V1",
    "8 ta noto'g'ri fe'l o'rgandingiz",
  ],
}

// ═══════════════════════════════════════════════════════════════════════════
// Simple Future — kelajakdagi harakat: will / going to (A1)
// ═══════════════════════════════════════════════════════════════════════════

export const SIMPLE_FUTURE_LESSON: DemoLesson = {
  id:    'simple-future-demo',
  skill: 'Simple Future — kelajak rejalaringizni aytish',
  level: 'A1',
  emoji: '⏩',

  context: {
    text: "Tasavvur qiling — do'stingiz so'rayapti: \"What will you do tomorrow?\" Keling, ertaga yoki kelajakda nima qilishingizni \"will\" va \"going to\" bilan aytishni o'rganamiz!",
    location: 'Real vaziyat · Reja tuzish',
  },

  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Simple Future — kelajakdagi harakat (ertaga, kelasi hafta)",
      "will + fe'l: to'satdan qaror yoki bashorat (I will call)",
      "be going to + fe'l: oldindan rejalashtirilgan (I am going to study)",
      "Savol va inkor (won't) shakllarini ko'ramiz",
    ],
  },

  examples: [
    { en: 'I will call you tomorrow.',    uz: 'Ertaga sizga qo\'ng\'iroq qilaman.', key: 'will call' },
    { en: 'She is going to study.',        uz: 'U o\'qimoqchi.',                key: 'going to' },
    { en: 'Will you come to the party?',   uz: 'Bazmga kelasizmi?',             key: 'Will' },
    { en: "He won't be late.",             uz: 'U kechikmaydi.',                key: "won't" },
  ],

  vocab: [
    { en: 'tomorrow',  uz: 'ertaga',          emoji: '📅', example: 'I will work tomorrow.' },
    { en: 'next week',  uz: 'kelasi hafta',    emoji: '🗓️', example: 'She will travel next week.' },
    { en: 'travel',    uz: 'sayohat qilmoq',  emoji: '✈️', example: 'We are going to travel.' },
    { en: 'meet',      uz: 'uchrashmoq',      emoji: '🤝', example: 'I will meet my friend.' },
    { en: 'call',      uz: 'qo\'ng\'iroq qilmoq', emoji: '📞', example: 'He will call later.' },
    { en: 'rain',      uz: 'yomg\'ir yog\'moq', emoji: '🌧️', example: 'It will rain tomorrow.' },
    { en: 'start',     uz: 'boshlamoq',       emoji: '🏁', example: 'The class will start soon.' },
    { en: 'finish',    uz: 'tugatmoq',        emoji: '✅', example: 'I will finish the work.' },
  ],

  steps: [
    { type: 'match', pairs: [{ en: 'tomorrow', uz: 'ertaga' }, { en: 'travel', uz: 'sayohat qilmoq' }, { en: 'meet', uz: 'uchrashmoq' }, { en: 'call', uz: "qo'ng'iroq qilmoq" }], explanation: "Kelajak haqida gapirishda kerakli so'zlar." },
    { type: 'choose', sentence: 'I ___ call you tomorrow.', options: ['will', 'am', 'do'], correct: 'will', uz: 'Ertaga sizga qo\'ng\'iroq qilaman.', explanation: "will + fe'l (V1): I will call. Kelajak uchun." },
    { type: 'choose', sentence: 'She ___ to study medicine.', options: ['is going', 'will going', 'going'], correct: 'is going', uz: 'U tibbiyot o\'qimoqchi.', explanation: "be going to: She is going to study (reja)." },
    { type: 'judge', sentence: 'I will to call you.', isCorrect: false, explanation: "Noto'g'ri! will dan keyin 'to' yo'q: 'I will call you.'" },
    { type: 'build', uz: 'Men ertaga do\'stim bilan uchrashaman.', words: ['I', 'will', 'meet', 'my', 'friend', 'tomorrow'], correct: ['I', 'will', 'meet', 'my', 'friend', 'tomorrow'], explanation: "will + V1 + tomorrow: 'I will meet'." },
    { type: 'choose', sentence: 'It ___ rain tomorrow.', options: ['will', 'is', 'does'], correct: 'will', uz: 'Ertaga yomg\'ir yog\'adi.', explanation: "Bashorat: will rain. 'It will rain'." },
    { type: 'listen', audio: 'We are going to travel.', options: ['We are going to travel.', 'We will going to travel.', 'We are going travel.'], correct: 'We are going to travel.', explanation: "be going to: 'We are going to travel' (reja)." },
    { type: 'judge', sentence: 'He will be late.', isCorrect: true, explanation: "To'g'ri! will + be. 'He will be late'. Mukammal!" },
    { type: 'choose', sentence: '___ you come to the party?', options: ['Will', 'Do', 'Are'], correct: 'Will', uz: 'Bazmga kelasizmi?', explanation: "Kelajak savoli: Will + ega + V1." },
    { type: 'build', uz: 'U kelasi hafta sayohat qiladi.', words: ['She', 'will', 'travel', 'next', 'week'], correct: ['She', 'will', 'travel', 'next', 'week'], explanation: "will + V1 + next week: 'She will travel'." },
    { type: 'judge', sentence: 'I will finished the work.', isCorrect: false, explanation: "Noto'g'ri! will + V1 (asosiy shakl): 'I will finish the work.'" },
    { type: 'choose', sentence: 'They ___ start the class soon.', options: ['will', 'are', 'do'], correct: 'will', uz: 'Ular tez orada darsni boshlaydi.', explanation: "will + V1: 'They will start'." },
    { type: 'listen', audio: 'He will call you later.', options: ['He will call you later.', 'He will calls you later.', 'He will to call you later.'], correct: 'He will call you later.', explanation: "will + V1 (call): 'He will call'." },
    { type: 'build', uz: 'Siz menga yordam berasizmi?', words: ['Will', 'you', 'help', 'me'], correct: ['Will', 'you', 'help', 'me'], explanation: "Savol: Will + you + V1. 'Will you help me?'" },
    { type: 'judge', sentence: 'She is going to travels.', isCorrect: false, explanation: "Noto'g'ri! going to + V1: 'She is going to travel.' (travels emas)." },
    { type: 'choose', sentence: 'He ___ be late. He left early.', options: ["won't", "doesn't", "isn't"], correct: "won't", uz: 'U kechikmaydi. Erta chiqdi.', explanation: "Inkor: won't (= will not) + V1." },
    { type: 'match', pairs: [{ en: 'next week', uz: 'kelasi hafta' }, { en: 'rain', uz: "yomg'ir yog'moq" }, { en: 'finish', uz: 'tugatmoq' }, { en: "won't", uz: 'qilmaydi (kelajak)' }], explanation: "So'z-ma'no juftliklarini eslab qoling." },
    { type: 'build', uz: 'Men ishni tugataman.', words: ['I', 'will', 'finish', 'the', 'work'], correct: ['I', 'will', 'finish', 'the', 'work'], explanation: "will + finish: 'I will finish the work'." },
    { type: 'judge', sentence: 'I am going to meet her tomorrow.', isCorrect: true, explanation: "To'g'ri! be going to + V1 (reja). Mukammal!" },
    { type: 'choose', sentence: 'We ___ travel next month.', options: ['will', 'are', 'do'], correct: 'will', uz: 'Biz kelasi oy sayohat qilamiz.', explanation: "will + V1: 'We will travel'." },
    { type: 'build', uz: 'U kechikmaydi.', words: ['He', "won't", 'be', 'late'], correct: ['He', "won't", 'be', 'late'], explanation: "Inkor: won't + V1. 'He won't be late'. Mukammal yakun!" },
  ],

  rule: {
    title: 'Simple Future — to\'liq qoida',
    body: "Simple Future — kelajakdagi harakat (ertaga, kelasi hafta).\n\n✅ will + fe'l (V1):\n   • To'satdan qaror: I will help you\n   • Bashorat: It will rain\n   • 'to' YO'Q: I will call (will to call emas)\n\n✅ be going to + fe'l (V1):\n   • Oldindan reja: I am going to study\n   • She is going to travel\n\n❓ Savol: Will + ega + V1?\n   Will you come?\n\n🚫 Inkor: won't (= will not) + V1\n   I won't go · He won't be late",
  },

  summary: [
    "will + V1 — qaror yoki bashorat (I will call)",
    "be going to + V1 — oldindan reja (I am going to study)",
    "'to' yo'q: will call (will to call emas)",
    "Savol: Will you...? · Inkor: won't",
  ],
}

// ═══════════════════════════════════════════════════════════════════════════
// Past Continuous — o'tmishda davom etgan harakat: was/were + V-ing (A2)
// ═══════════════════════════════════════════════════════════════════════════

export const PAST_CONTINUOUS_LESSON: DemoLesson = {
  id:    'past-continuous-demo',
  skill: 'Past Continuous — o\'tmishda nima qilayotgan paytingizni aytish',
  level: 'A2',
  emoji: '🎬',

  context: {
    text: "Tasavvur qiling — kecha soat 8 da telefon jiringladi. O'sha paytda siz ovqat pishirayotgan edingiz. Keling, o'tmishning ma'lum bir lahzasida nima qilib turganingizni aytishni o'rganamiz!",
    location: 'Real vaziyat · Kechagi voqea',
  },

  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Past Continuous — o'tmishning bir lahzasida davom etgan harakat",
      "Tuzilishi: was/were + fe'l + ing (I was reading)",
      "I/he/she/it → was · you/we/they → were",
      "Ko'pincha 'when' (Simple Past bilan) va 'while' bilan ishlatiladi",
    ],
  },

  examples: [
    { en: 'I was cooking at 8 pm.',          uz: 'Soat 8 da men ovqat pishirayotgan edim.', key: 'was cooking' },
    { en: 'They were playing football.',     uz: 'Ular futbol o\'ynayotgan edilar.',        key: 'were playing' },
    { en: 'What were you doing?',            uz: 'Siz nima qilayotgan edingiz?',            key: 'were' },
    { en: "She wasn't sleeping.",            uz: 'U uxlayotgani yo\'q edi.',                key: "wasn't" },
  ],

  vocab: [
    { en: 'was/were',  uz: 'edi / edilar',     emoji: '⏳', example: 'I was at home.' },
    { en: 'while',     uz: 'paytida (davomida)',emoji: '🔄', example: 'While I was reading...' },
    { en: 'when',      uz: 'qachonki',          emoji: '⚡', example: 'When the phone rang...' },
    { en: 'rain',      uz: 'yomg\'ir yog\'moq', emoji: '🌧️', example: 'It was raining.' },
    { en: 'wait',      uz: 'kutmoq',            emoji: '⏰', example: 'I was waiting for the bus.' },
    { en: 'study',     uz: 'o\'qimoq',          emoji: '📚', example: 'She was studying English.' },
    { en: 'happen',    uz: 'sodir bo\'lmoq',    emoji: '❗', example: 'What was happening?' },
    { en: 'sleep',     uz: 'uxlamoq',           emoji: '😴', example: 'He was sleeping at noon.' },
  ],

  steps: [
    { type: 'match', pairs: [{ en: 'was', uz: 'edi (I/he/she)' }, { en: 'were', uz: 'edilar (you/we/they)' }, { en: 'while', uz: 'paytida' }, { en: 'when', uz: 'qachonki' }], explanation: "Past Continuous'ning asosiy so'zlari — was/were va while/when." },
    { type: 'choose', sentence: 'I ___ reading a book at 9 pm.', options: ['was', 'were', 'is'], correct: 'was', uz: 'Soat 9 da men kitob o\'qiyotgan edim.', explanation: "I bilan 'was' ishlatiladi: I was reading." },
    { type: 'choose', sentence: 'They ___ playing in the garden.', options: ['were', 'was', 'are'], correct: 'were', uz: 'Ular bog\'da o\'ynayotgan edilar.', explanation: "They bilan 'were': They were playing." },
    { type: 'judge', sentence: 'She were cooking dinner.', isCorrect: false, explanation: "Noto'g'ri! She bilan 'was': 'She was cooking dinner.'" },
    { type: 'build', uz: 'Men avtobus kutayotgan edim.', words: ['I', 'was', 'waiting', 'for', 'the', 'bus'], correct: ['I', 'was', 'waiting', 'for', 'the', 'bus'], explanation: "was + waiting (V-ing): 'I was waiting'." },
    { type: 'choose', sentence: 'It ___ raining all morning.', options: ['was', 'were', 'did'], correct: 'was', uz: 'Butun ertalab yomg\'ir yog\'ayotgan edi.', explanation: "It bilan 'was': It was raining." },
    { type: 'listen', audio: 'We were watching a film.', options: ['We were watching a film.', 'We was watching a film.', 'We were watch a film.'], correct: 'We were watching a film.', explanation: "We → were + watching (V-ing)." },
    { type: 'judge', sentence: 'He was sleeping at noon.', isCorrect: true, explanation: "To'g'ri! He → was + sleeping. Mukammal!" },
    { type: 'choose', sentence: 'What ___ you doing at 7?', options: ['were', 'was', 'did'], correct: 'were', uz: 'Soat 7 da nima qilayotgan edingiz?', explanation: "You bilan savol: Were you doing? 'What were you doing?'" },
    { type: 'build', uz: 'U ingliz tilini o\'rganayotgan edi.', words: ['She', 'was', 'studying', 'English'], correct: ['She', 'was', 'studying', 'English'], explanation: "She → was + studying: 'She was studying English'." },
    { type: 'judge', sentence: 'They was running fast.', isCorrect: false, explanation: "Noto'g'ri! They bilan 'were': 'They were running fast.'" },
    { type: 'choose', sentence: 'While I ___ TV, the phone rang.', options: ['was watching', 'watched', 'watch'], correct: 'was watching', uz: 'Men televizor ko\'rayotganimda telefon jiringladi.', explanation: "while + davom etgan harakat (was watching), keyin Simple Past (rang)." },
    { type: 'listen', audio: 'I was waiting for you.', options: ['I was waiting for you.', 'I were waiting for you.', 'I was wait for you.'], correct: 'I was waiting for you.', explanation: "I → was + waiting (V-ing)." },
    { type: 'build', uz: 'Qachonki u keldi, biz ovqat yeyayotgan edik.', words: ['When', 'he', 'came', 'we', 'were', 'eating'], correct: ['When', 'he', 'came', 'we', 'were', 'eating'], explanation: "When + Simple Past (came), asosiy harakat Past Continuous (were eating)." },
    { type: 'judge', sentence: 'Were you studying last night?', isCorrect: true, explanation: "To'g'ri! Savol: Were + you + V-ing? Mukammal!" },
    { type: 'choose', sentence: 'He ___ working when I called.', options: ['was', 'were', 'is'], correct: 'was', uz: 'Men qo\'ng\'iroq qilganimda u ishlayotgan edi.', explanation: "He → was + working." },
    { type: 'match', pairs: [{ en: 'was raining', uz: 'yomg\'ir yog\'ayotgan edi' }, { en: 'were waiting', uz: 'kutayotgan edilar' }, { en: 'wasn\'t', uz: 'qilmayotgan edi' }, { en: 'happen', uz: 'sodir bo\'lmoq' }], explanation: "Iboralarni eslab qoling." },
    { type: 'choose', sentence: 'She ___ sleeping when we arrived.', options: ["wasn't", "weren't", "didn't"], correct: "wasn't", uz: 'Biz kelganimizda u uxlayotgani yo\'q edi.', explanation: "Inkor: wasn't + V-ing (She wasn't sleeping)." },
    { type: 'build', uz: 'Biz nima sodir bo\'layotganini bilmasdik... biz tomosha qilayotgan edik.', words: ['We', 'were', 'watching', 'the', 'game'], correct: ['We', 'were', 'watching', 'the', 'game'], explanation: "We → were + watching: 'We were watching the game'." },
    { type: 'judge', sentence: 'I was cook dinner at 8.', isCorrect: false, explanation: "Noto'g'ri! V-ing kerak: 'I was cooking dinner at 8.'" },
    { type: 'build', uz: 'U telefon jiringlaganda uxlayotgani yo\'q edi.', words: ['He', "wasn't", 'sleeping'], correct: ['He', "wasn't", 'sleeping'], explanation: "Inkor: wasn't + sleeping (V-ing). Mukammal yakun!" },
  ],

  rule: {
    title: 'Past Continuous — to\'liq qoida',
    body: "Past Continuous — o'tmishning bir lahzasida DAVOM etgan harakat.\n\n✅ Tuzilishi: was/were + fe'l + ing\n   • I / he / she / it → was\n   • you / we / they → were\n   • I was reading · They were playing\n\n🔄 'while' va 'when' bilan:\n   • While I was cooking, he arrived.\n   • When the phone rang, I was sleeping.\n   (davomli harakat — was/were +ing, qisqa harakat — Simple Past)\n\n❓ Savol: Was/Were + ega + V-ing?\n   What were you doing?\n\n🚫 Inkor: wasn't / weren't + V-ing\n   She wasn't sleeping · They weren't working",
  },

  summary: [
    "was/were + fe'l + ing (I was reading)",
    "I/he/she/it → was · you/we/they → were",
    "while + Past Continuous, when + Simple Past",
    "Savol: Were you...? · Inkor: wasn't/weren't",
  ],
}

// ═══════════════════════════════════════════════════════════════════════════
// Present Perfect — o'tmish bilan hozir bog'liqligi: have/has + V3 (A2)
// ═══════════════════════════════════════════════════════════════════════════

export const PRESENT_PERFECT_LESSON: DemoLesson = {
  id:    'present-perfect-demo',
  skill: 'Present Perfect — tajriba va natija haqida gapirish',
  level: 'A2',
  emoji: '✅',

  context: {
    text: "Tasavvur qiling — do'stingiz so'rayapti: \"Have you ever been to London?\" Aniq vaqt muhim emas — muhimi siz BORGANMISIZ yoki yo'q. Keling, tajriba va natijalar haqida gapirishni o'rganamiz!",
    location: 'Real vaziyat · Tajriba haqida suhbat',
  },

  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Present Perfect — o'tmish bilan HOZIRni bog'laydi (natija/tajriba)",
      "Tuzilishi: have/has + fe'lning 3-shakli (V3)",
      "I/you/we/they → have · he/she/it → has",
      "Belgilar: ever, never, just, already, yet, for, since",
    ],
  },

  examples: [
    { en: 'I have finished my work.',        uz: 'Men ishimni tugatdim (hozir tayyor).',   key: 'have finished' },
    { en: 'She has gone to the shop.',       uz: 'U do\'konga ketdi (hali u yerda).',       key: 'has gone' },
    { en: 'Have you ever eaten sushi?',      uz: 'Hech sushi yeb ko\'rganmisiz?',           key: 'Have' },
    { en: "He hasn't called me yet.",        uz: 'U hali menga qo\'ng\'iroq qilmadi.',      key: "hasn't" },
  ],

  vocab: [
    { en: 'have/has',  uz: 'ega bo\'lmoq (yordamchi)', emoji: '🤝', example: 'I have done it.' },
    { en: 'ever',      uz: 'hech (savolda)',     emoji: '❓', example: 'Have you ever been there?' },
    { en: 'never',     uz: 'hech qachon',         emoji: '🚫', example: 'I have never seen snow.' },
    { en: 'just',      uz: 'hozirgina',           emoji: '⏱️', example: 'She has just left.' },
    { en: 'already',   uz: 'allaqachon',          emoji: '👍', example: 'I have already eaten.' },
    { en: 'yet',       uz: 'hali (inkor/savol)',  emoji: '⌛', example: 'He hasn\'t come yet.' },
    { en: 'for',       uz: 'davomida (muddat)',   emoji: '📏', example: 'I have lived here for 5 years.' },
    { en: 'since',     uz: 'beri (boshlanish)',   emoji: '📅', example: 'She has worked since 2020.' },
  ],

  steps: [
    { type: 'match', pairs: [{ en: 'have', uz: 'I/you/we/they' }, { en: 'has', uz: 'he/she/it' }, { en: 'ever', uz: 'hech (savol)' }, { en: 'never', uz: 'hech qachon' }], explanation: "Present Perfect'ning asoslari — have/has va ever/never." },
    { type: 'choose', sentence: 'I ___ finished my homework.', options: ['have', 'has', 'am'], correct: 'have', uz: 'Men uy ishimni tugatdim.', explanation: "I bilan 'have': I have finished." },
    { type: 'choose', sentence: 'She ___ gone to school.', options: ['has', 'have', 'is'], correct: 'has', uz: 'U maktabga ketdi.', explanation: "She bilan 'has': She has gone." },
    { type: 'judge', sentence: 'He have eaten lunch.', isCorrect: false, explanation: "Noto'g'ri! He bilan 'has': 'He has eaten lunch.'" },
    { type: 'choose', sentence: 'They have ___ the film.', options: ['seen', 'saw', 'see'], correct: 'seen', uz: 'Ular filmni ko\'rishdi.', explanation: "have + V3 (3-shakl): see → seen (saw emas!)." },
    { type: 'build', uz: 'Men ishimni tugatdim.', words: ['I', 'have', 'finished', 'my', 'work'], correct: ['I', 'have', 'finished', 'my', 'work'], explanation: "have + finished (V3): 'I have finished'." },
    { type: 'judge', sentence: 'She has just arrived.', isCorrect: true, explanation: "To'g'ri! has + just + arrived (V3). 'just' = hozirgina. Mukammal!" },
    { type: 'choose', sentence: '___ you ever been to Paris?', options: ['Have', 'Has', 'Did'], correct: 'Have', uz: 'Hech Parijda bo\'lganmisiz?', explanation: "Savol: Have + you + ever + V3? Tajriba haqida." },
    { type: 'choose', sentence: 'I have ___ seen snow.', options: ['never', 'ever', 'yet'], correct: 'never', uz: 'Men hech qachon qor ko\'rmaganman.', explanation: "have + never + V3 — hech qachon bo'lmagan tajriba." },
    { type: 'build', uz: 'U hozirgina ketdi.', words: ['She', 'has', 'just', 'left'], correct: ['She', 'has', 'just', 'left'], explanation: "has + just + left (V3): 'She has just left'." },
    { type: 'listen', audio: 'I have already eaten.', options: ['I have already eaten.', 'I have already ate.', 'I has already eaten.'], correct: 'I have already eaten.', explanation: "have + already + eaten (V3, 'ate' emas)." },
    { type: 'judge', sentence: 'They has lived here for years.', isCorrect: false, explanation: "Noto'g'ri! They bilan 'have': 'They have lived here for years.'" },
    { type: 'choose', sentence: 'He ___ called me yet.', options: ["hasn't", "haven't", "didn't"], correct: "hasn't", uz: 'U hali menga qo\'ng\'iroq qilmadi.', explanation: "Inkor: He → hasn't + V3. 'yet' inkor bilan ishlatiladi." },
    { type: 'build', uz: 'Siz uy ishingizni qildingizmi?', words: ['Have', 'you', 'done', 'your', 'homework'], correct: ['Have', 'you', 'done', 'your', 'homework'], explanation: "Savol: Have + you + done (V3, do→done)?" },
    { type: 'choose', sentence: 'I have lived here ___ 2020.', options: ['since', 'for', 'yet'], correct: 'since', uz: 'Men bu yerda 2020 yildan beri yashayman.', explanation: "since + boshlanish nuqtasi (2020). for + muddat (5 years)." },
    { type: 'judge', sentence: 'I have lived here for five years.', isCorrect: true, explanation: "To'g'ri! for + muddat (five years). Mukammal!" },
    { type: 'match', pairs: [{ en: 'just', uz: 'hozirgina' }, { en: 'already', uz: 'allaqachon' }, { en: 'yet', uz: 'hali' }, { en: 'gone', uz: 'ketgan (go→gone)' }], explanation: "Present Perfect belgilarini eslab qoling." },
    { type: 'choose', sentence: 'We ___ never visited Japan.', options: ['have', 'has', 'are'], correct: 'have', uz: 'Biz hech qachon Yaponiyaga bormaganmiz.', explanation: "We → have + never + V3." },
    { type: 'build', uz: 'U allaqachon ovqatlandi.', words: ['He', 'has', 'already', 'eaten'], correct: ['He', 'has', 'already', 'eaten'], explanation: "has + already + eaten (V3): 'He has already eaten'." },
    { type: 'judge', sentence: 'Have you saw this film?', isCorrect: false, explanation: "Noto'g'ri! V3 kerak: 'Have you seen this film?' (saw emas, seen)." },
    { type: 'build', uz: 'Men hech qachon sushi yemaganman.', words: ['I', 'have', 'never', 'eaten', 'sushi'], correct: ['I', 'have', 'never', 'eaten', 'sushi'], explanation: "have + never + eaten (V3). Mukammal yakun!" },
  ],

  rule: {
    title: 'Present Perfect — to\'liq qoida',
    body: "Present Perfect — o'tmishdagi harakatni HOZIR bilan bog'laydi (aniq vaqt muhim emas).\n\n✅ Tuzilishi: have/has + V3 (3-shakl)\n   • I / you / we / they → have\n   • he / she / it → has\n   • I have finished · She has gone\n\n📝 V3 (3-shakl):\n   go→gone · see→seen · eat→eaten · do→done\n   (oddiy fe'l: + ed — worked, lived)\n\n🔑 Belgilar:\n   • ever / never — tajriba (Have you ever...?)\n   • just — hozirgina · already — allaqachon\n   • yet — hali (inkor/savol)\n   • for + muddat (5 years) · since + nuqta (2020)\n\n❓ Savol: Have/Has + ega + V3?\n🚫 Inkor: haven't / hasn't + V3",
  },

  summary: [
    "have/has + V3 (I have finished, she has gone)",
    "I/you/we/they → have · he/she/it → has",
    "ever, never, just, already, yet bilan",
    "for + muddat · since + boshlanish nuqtasi",
  ],
}

// ─── Barcha namunaviy darslar (key = asl dars id) ──────────────────────────
export const DEMO_LESSONS: Record<string, DemoLesson> = {
  ...A2_DEMOS,
  ...B1_DEMOS,
  ...B1PLUS_DEMOS,
  'can-ability-demo':    DEMO_LESSON,
  'simple-present':      SIMPLE_PRESENT_LESSON,
  'present-continuous':  PRESENT_CONTINUOUS_LESSON,
  'simple-past':         SIMPLE_PAST_LESSON,
  'simple-future':       SIMPLE_FUTURE_LESSON,
  // A2 darslar
  'past-continuous':     PAST_CONTINUOUS_LESSON,
  'present-perfect':     PRESENT_PERFECT_LESSON,
  // Eski demo id'lar ham ishlasin (LearnHub bannerlari uchun)
  'simple-present-demo': SIMPLE_PRESENT_LESSON,
}
