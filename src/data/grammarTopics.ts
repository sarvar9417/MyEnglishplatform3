// ─── Exercise types ───────────────────────────────────────────────────────────

export interface FillBlankQ {
  id: number
  type: 'fill-blank'
  instruction: string
  question: string   // "If I _____ (have) time, I _____ (go)."
  blanks: string[]   // ["had", "would go"]
  explanation: string
}

export interface MCQ {
  id: number
  type: 'multiple-choice'
  instruction: string
  question: string
  options: [string, string, string, string]
  correct: string
  explanation: string
}

export interface ErrorQ {
  id: number
  type: 'error-correction'
  instruction: string
  question: string   // wrong sentence
  errorPart: string  // the incorrect fragment (for UI hint)
  correct: string    // corrected sentence
  explanation: string
}

export interface TransformQ {
  id: number
  type: 'transformation'
  instruction: string
  question: string   // source sentence
  hint: string       // start of the answer, e.g. "If I had..."
  correct: string    // expected output
  explanation: string
}

export type Exercise = FillBlankQ | MCQ | ErrorQ | TransformQ

// ─── Topic type ───────────────────────────────────────────────────────────────

export interface FormulaRow {
  label: string
  structure: string
  color: 'blue' | 'purple' | 'green' | 'orange'
}

export interface GrammarTopic {
  id: string
  title: string
  subtitle: string
  level: 'A2' | 'B1' | 'B1+' | 'B2'
  week: number
  tag: string
  formula: string          // one-line formula text
  formulaRows: FormulaRow[]
  usedFor: string[]
  examples: { en: string; uz: string }[]
  exercises: Exercise[]
}

// ─── Topic 1: Second Conditional ─────────────────────────────────────────────

const secondConditional: GrammarTopic = {
  id: 'second-conditional',
  title: 'Second Conditional',
  subtitle: 'Xayoliy va gipotetik vaziyatlar',
  level: 'B1',
  week: 3,
  tag: 'Conditionals',
  formula: 'If + Past Simple , would + V¹',
  formulaRows: [
    { label: 'If clause (shart)',   structure: 'If + Subject + V₂',         color: 'blue'   },
    { label: 'Main clause (natija)', structure: 'Subject + would + V¹ (+ ...)', color: 'purple' },
  ],
  usedFor: [
    'Hozir yoki kelajakdagi xayoliy/real bo\'lmagan vaziyatlar uchun',
    "Maslahat berish uchun: \"If I were you, I would...\"",
    "Orzu va xayollarni ifodalash uchun",
  ],
  examples: [
    { en: 'If I had more money, I would buy a car.',              uz: "Agar menda ko'proq pul bo'lsa, mashina sotib olardim." },
    { en: 'She would be happier if she lived near the sea.',      uz: "Agar u dengiz yaqinida yashaganda, baxtliroq bo'lardi." },
    { en: "If we didn't have school, we would travel the world.", uz: "Agar maktabimiz bo'lmaganda, dunyoni kezardik." },
  ],
  exercises: [
    // ── Fill-blank (1–3) ──────────────────────────────────────────────────────
    {
      id: 1, type: 'fill-blank',
      instruction: "Bo'sh joylarni to'g'ri fe'l shaklida to'ldiring:",
      question: "If I _____ (have) more free time, I _____ (learn) to play the guitar.",
      blanks: ['had', 'would learn'],
      explanation: "'If' qismida Past Simple (had), natija qismida 'would + V¹' (would learn) ishlatiladi.",
    },
    {
      id: 2, type: 'fill-blank',
      instruction: "Bo'sh joylarni to'g'ri fe'l shaklida to'ldiring:",
      question: "She _____ (travel) more often if she _____ (not have) so much work.",
      blanks: ['would travel', "didn't have"],
      explanation: "Natija qismi birinchi kelsa ham qoida o'zgarmaydi: 'would + V¹' va 'Past Simple negative'.",
    },
    {
      id: 3, type: 'fill-blank',
      instruction: "Bo'sh joylarni to'g'ri fe'l shaklida to'ldiring:",
      question: "If it _____ (not rain) today, we _____ (go) for a picnic in the park.",
      blanks: ["didn't rain", 'would go'],
      explanation: "Inkor shakli: 'if it didn't rain' (Past Simple negative) + 'would go'.",
    },
    // ── Multiple choice (4–6) ─────────────────────────────────────────────────
    {
      id: 4, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "If I ___ a million dollars, I would travel around the world.",
      options: ['had', 'have', 'will have', 'would have'],
      correct: 'had',
      explanation: "'If' qismida Past Simple ishlatiladi — 'had'. 'Would have' XATO: 'would' 'if' qismida ishlatilmaydi.",
    },
    {
      id: 5, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "What would you do if you ___ a wallet on the street?",
      options: ['find', 'found', 'will find', 'would find'],
      correct: 'found',
      explanation: "'If' qismida Past Simple: 'found'. 'Would find' xato — 'would' natija qismiga tegishli.",
    },
    {
      id: 6, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "If she worked harder, she ___ get a promotion.",
      options: ['would', 'will', 'should', 'had'],
      correct: 'would',
      explanation: "Natija qismida 'would + V¹' ishlatiladi. 'Will' Present/Future real shartlar uchun (First Conditional).",
    },
    // ── Error correction (7–8) ────────────────────────────────────────────────
    {
      id: 7, type: 'error-correction',
      instruction: "Grammatik xatoni toping va gapni to'g'irlang:",
      question: "If I would have more money, I would buy a bigger house.",
      errorPart: 'would have',
      correct: "If I had more money, I would buy a bigger house.",
      explanation: "'If' qismida 'would' ISHLATILMAYDI. To'g'ri shakl: 'If I had...' (Past Simple).",
    },
    {
      id: 8, type: 'error-correction',
      instruction: "Grammatik xatoni toping va gapni to'g'irlang:",
      question: "If he studied more, he will pass the exam easily.",
      errorPart: 'will pass',
      correct: "If he studied more, he would pass the exam easily.",
      explanation: "Second Conditional natija qismida 'will' emas 'would' ishlatiladi: 'would pass'.",
    },
    // ── Transformation (9–10) ─────────────────────────────────────────────────
    {
      id: 9, type: 'transformation',
      instruction: "Quyidagi gapni Second Conditional shaklida yozing:",
      question: "I don't have a car, so I can't drive to work.",
      hint: "If I had a car, ...",
      correct: "If I had a car, I would drive to work.",
      explanation: "Real holat ('don't have' → 'had') xayoliyga o'tadi, natija: 'would drive' (would + V¹).",
    },
    {
      id: 10, type: 'transformation',
      instruction: "Quyidagi gapni Second Conditional shaklida yozing:",
      question: "She doesn't know the answer, so she can't help you.",
      hint: "If she knew ...",
      correct: "If she knew the answer, she would help you.",
      explanation: "'doesn't know' → 'knew' (Past Simple); 'can't help' → 'would help' (would + V¹).",
    },
  ],
}

// ─── Topic 2: Present Perfect ─────────────────────────────────────────────────

const presentPerfect: GrammarTopic = {
  id: 'present-perfect',
  title: 'Present Perfect',
  subtitle: "O'tmish va hozir o'rtasidagi bog'liqlik",
  level: 'B1',
  week: 1,
  tag: 'Tenses',
  formula: 'have / has + Past Participle (V³)',
  formulaRows: [
    { label: 'I / You / We / They', structure: 'have + V³',  color: 'blue'   },
    { label: 'He / She / It',       structure: 'has + V³',   color: 'purple' },
    { label: 'Negative',            structure: "haven't / hasn't + V³", color: 'orange' },
  ],
  usedFor: [
    "Tugallanmagan vaqt davomida bo'lgan hodisalar (for, since)",
    "Hozirda natijasi ko'rinib turgan harakatlar (just, already, yet)",
    "Hayotdagi tajribalar — necha marta (ever, never, three times)",
  ],
  examples: [
    { en: "I have lived in Tashkent for five years.",   uz: "Men besh yildan beri Toshkentda yashayman." },
    { en: "She has just finished her homework.",         uz: "U hozirgina uy vazifasini tugatdi." },
    { en: "We have never been to Australia.",            uz: "Biz hech qachon Avstraliyaga bormagan edik." },
  ],
  exercises: [
    {
      id: 1, type: 'fill-blank',
      instruction: "Present Perfect bilan bo'sh joylarni to'ldiring:",
      question: "I _____ (live) in Tashkent for five years.",
      blanks: ['have lived'],
      explanation: "'For five years' = davom etayotgan vaqt → Present Perfect (have + lived).",
    },
    {
      id: 2, type: 'fill-blank',
      instruction: "Present Perfect bilan bo'sh joylarni to'ldiring:",
      question: "She _____ (already / finish) the project. It looks great!",
      blanks: ['has already finished'],
      explanation: "'Already' Present Perfect bilan ishlatiladi: has + already + V³.",
    },
    {
      id: 3, type: 'fill-blank',
      instruction: "Present Perfect bilan bo'sh joylarni to'ldiring:",
      question: "They _____ (visit) Paris three times in their lives.",
      blanks: ['have visited'],
      explanation: "'Three times' = necha marta (tajriba) → Present Perfect.",
    },
    {
      id: 4, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "I ___ this film before — it's absolutely brilliant!",
      options: ['have seen', 'saw', 'see', 'was seeing'],
      correct: 'have seen',
      explanation: "'Before' = aniq vaqtsiz tajriba → Present Perfect: 'have seen'.",
    },
    {
      id: 5, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "She ___ to the market this morning. (It is now 3pm.)",
      options: ['went', 'has gone', 'has went', 'goes'],
      correct: 'went',
      explanation: "'This morning' = tugallangan vaqt (hozir tushdan keyin) → Past Simple: 'went'.",
    },
    {
      id: 6, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "How long ___ you known each other?",
      options: ['have', 'did', 'do', 'had'],
      correct: 'have',
      explanation: "'How long' + davom etayotgan holat → Present Perfect: 'How long have you known...?'",
    },
    {
      id: 7, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: "I have saw this movie last night with my friends.",
      errorPart: 'have saw',
      correct: "I saw this movie last night with my friends.",
      explanation: "'Last night' = aniq tugallangan vaqt → Past Simple kerak, Present Perfect emas.",
    },
    {
      id: 8, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: "He has finished his work two hours ago.",
      errorPart: 'has finished',
      correct: "He finished his work two hours ago.",
      explanation: "'Two hours ago' = aniq o'tmish → Past Simple. Present Perfect bilan 'ago' ishlatilmaydi.",
    },
    {
      id: 9, type: 'transformation',
      instruction: "Present Perfect bilan yozing:",
      question: "The last time I ate pizza was a month ago.",
      hint: "I haven't eaten ...",
      correct: "I haven't eaten pizza for a month.",
      explanation: "O'tmishdan hozirga qadar yuz bermagan holat → Present Perfect negative + 'for'.",
    },
    {
      id: 10, type: 'transformation',
      instruction: "Present Perfect bilan yozing:",
      question: "This is my first visit to London.",
      hint: "I have never ...",
      correct: "I have never been to London before.",
      explanation: "Birinchi marta → 'have never + been to + place + before'.",
    },
  ],
}

// ─── Topic 3: Passive Voice ───────────────────────────────────────────────────

const passiveVoice: GrammarTopic = {
  id: 'passive-voice',
  title: 'Passive Voice',
  subtitle: "Kim qilganini emas, nima bo'lganini aytish",
  level: 'B1',
  week: 5,
  tag: 'Passive',
  formula: 'be (am / is / are / was / were) + V³',
  formulaRows: [
    { label: 'Present Simple',   structure: 'am / is / are + V³',        color: 'blue'   },
    { label: 'Past Simple',      structure: 'was / were + V³',           color: 'purple' },
    { label: 'Present Perfect',  structure: 'have / has been + V³',      color: 'green'  },
    { label: 'Future Simple',    structure: 'will be + V³',              color: 'orange' },
  ],
  usedFor: [
    "Harakat bajaruvchi noma'lum yoki muhim bo'lmaganda",
    "Rasmiy, ilmiy va yangiliklar uslubida",
    "Diqqatni ob'ektga (natijaga) qaratish uchun",
  ],
  examples: [
    { en: "English is spoken all over the world.",         uz: "Ingliz tili butun dunyoda gapirilaadi." },
    { en: "The Eiffel Tower was built in 1889.",           uz: "Eyfel minorasi 1889-yilda qurilgan." },
    { en: "The report has been written by the manager.",   uz: "Hisobot menejer tomonidan yozilgan." },
  ],
  exercises: [
    {
      id: 1, type: 'fill-blank',
      instruction: "Passive Voice (Present Simple) bilan to'ldiring:",
      question: "English _____ (speak) as an official language in over 50 countries.",
      blanks: ['is spoken'],
      explanation: "Present Simple Passive: is/am/are + V³. Subject 'English' → yakkama, demak 'is spoken'.",
    },
    {
      id: 2, type: 'fill-blank',
      instruction: "Passive Voice (Past Simple) bilan to'ldiring:",
      question: "The first iPhone _____ (introduce) by Steve Jobs in 2007.",
      blanks: ['was introduced'],
      explanation: "Past Simple Passive: was/were + V³. 'The first iPhone' → yakka → 'was introduced'.",
    },
    {
      id: 3, type: 'fill-blank',
      instruction: "Passive Voice (Present Perfect) bilan to'ldiring:",
      question: "The new policy _____ (approve) by the board this week.",
      blanks: ['has been approved'],
      explanation: "Present Perfect Passive: have/has + been + V³. Yakka subject → 'has been approved'.",
    },
    {
      id: 4, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "The movie ___ directed by Christopher Nolan.",
      options: ['was', 'is', 'were', 'has'],
      correct: 'was',
      explanation: "Past Simple Passive: 'was + directed'. 'Were' ko'plik uchun; 'is' Present uchun.",
    },
    {
      id: 5, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "Thousands of cars ___ produced in this factory every month.",
      options: ['are', 'is', 'were', 'be'],
      correct: 'are',
      explanation: "'Thousands of cars' = ko'plik → Present Simple Passive: 'are + produced'.",
    },
    {
      id: 6, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "The exam results ___ announced tomorrow morning.",
      options: ['will be', 'are', 'were', 'have been'],
      correct: 'will be',
      explanation: "'Tomorrow' = kelajak → Future Simple Passive: 'will be + announced'.",
    },
    {
      id: 7, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: "The dinner was cook by my mother last night.",
      errorPart: 'cook',
      correct: "The dinner was cooked by my mother last night.",
      explanation: "Passive Voice da Past Participle (V³) kerak: 'cook' → 'cooked'.",
    },
    {
      id: 8, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: "Many books has been wrote by this famous author.",
      errorPart: 'has been wrote',
      correct: "Many books have been written by this famous author.",
      explanation: "'Many books' = ko'plik → 'have' (has emas). 'Wrote' → 'written' (V³ — wrote xato).",
    },
    {
      id: 9, type: 'transformation',
      instruction: "Active gapni Passive shakliga o'tkazing:",
      question: "Shakespeare wrote Romeo and Juliet in the 1590s.",
      hint: "Romeo and Juliet was ...",
      correct: "Romeo and Juliet was written by Shakespeare in the 1590s.",
      explanation: "Active ob'ekt → Passive subject. 'wrote' → 'was written'. Ijrochi: 'by Shakespeare'.",
    },
    {
      id: 10, type: 'transformation',
      instruction: "Active gapni Passive shakliga o'tkazing:",
      question: "Scientists around the world are researching new treatments.",
      hint: "New treatments are being ...",
      correct: "New treatments are being researched by scientists around the world.",
      explanation: "Present Continuous Passive: 'are being + V³'. Active ob'ekt → Passive subject.",
    },
  ],
}

// ─── Export ───────────────────────────────────────────────────────────────────

export const GRAMMAR_TOPICS: GrammarTopic[] = [
  secondConditional,
  presentPerfect,
  passiveVoice,
]
