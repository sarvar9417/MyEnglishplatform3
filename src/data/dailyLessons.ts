export interface SpecialCase {
  id: string
  title: string
  rule: string
  mnemonic: string       // yodda saqlash uchun maslahat
  commonMistakes: string // eng ko'p uchraydigan xato
  examples: { en: string; uz: string }[]
  drills: DailyExercise[]
}

export interface DailyLesson {
  id: string
  title: string
  subtitle: string
  level: string
  day: number
  category?: string
  formulas: { label: string; structure: string; color: string }[]
  rules: string[]
  vocabulary: { en: string; uz: string; example: string; rule: string }[]
  examples: { en: string; uz: string }[]
  specialCases: SpecialCase[]
  exercises: DailyExercise[]
  exerciseSections: { title: string; desc: string; color: string; icon: string; ids: number[] }[]
  tests: DailyExercise[]
  testSections: { title: string; desc: string; color: string; icon: string; ids: number[] }[]
  image?: string
  reading?: ReadingSection
  writing?: WritingSection
  listening?: ListeningSection
  speaking?: SpeakingSection
  dialogues?: Dialogue[]
  culturalNotes?: CulturalNote[]
}

export interface Dialogue {
  id: string
  title: string
  context: string
  lines: DialogueLine[]
}

export interface DialogueLine {
  speaker: string
  text: string
  translation: string
  en?: string
  uz?: string
}

export interface CulturalNote {
  id: string
  title: string
  description: string
  icon?: string
  category?: string
}

export interface ReadingSection {
  id?: string | number
  title?: string
  passage: string
  vocabulary?: { word: string; definition: string; example?: string }[]
  questions: ReadingQuestion[]
  mainIdea?: string[]
  discussion?: { question: string; hints: string[] }[]
}

export interface ReadingQuestion {
  id: number
  type: 'multiple-choice'
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface WritingSection {
  prompt: string
  wordLimit: number
  tips: string[]
  modelAnswer?: string
  keyPhrases?: { phrase: string; translation: string }[]
  structure?: string[]
}

export interface SpeakingSection {
  prompt: string
  tips: string[]
  keyPhrases?: { phrase: string; translation: string }[]
  sampleAnswer?: string
}

export interface ListeningSection {
  youtubeId?: string
  transcript: string
  source?: string
  duration?: string
  difficulty?: 'easy' | 'medium' | 'hard'
  topic?: string
  vocabulary?: { word: string; definition: string; example?: string }[]
  questions: ListeningQuestion[]
  dictation?: { startLine: number; endLine: number }[]
  mainIdea?: string[]
  discussion?: { question: string; hints: string[] }[]
}

export type ListeningQuestionType =
  | 'multiple-choice'
  | 'true-false'
  | 'fill-blank'
  | 'multiple-answer'
  | 'ordering'
  | 'matching'

export interface ListeningQuestion {
  id: number
  type: ListeningQuestionType
  question: string
  options?: string[]
  correctIndex?: number
  correctIndices?: number[]
  correctOrder?: number[]
  blanks?: string[]
  answer?: string | boolean
  pairs?: { left: string; right: string }[]
  explanation: string
  difficulty?: 'easy' | 'medium' | 'hard'
}

export type DailyExercise =
  | { id: number; type: 'fill-blank'; instruction: string; question: string; blanks: string[]; explanation: string }
  | { id: number; type: 'multiple-choice'; instruction: string; question: string; options: [string, string, string, string]; correct: string; explanation: string }
  | { id: number; type: 'error-correction'; instruction: string; question: string; errorPart: string; correct: string; explanation: string }
  | { id: number; type: 'transformation'; instruction: string; question: string; hint: string; correct: string; explanation: string }
  | { id: number; type: 'fill-table'; instruction: string; rows: { adj: string; comp: string; sup: string }[]; explanation: string }

export const comparativesSuperlatives: DailyLesson = {
  id: 'comparatives-superlatives',
  title: 'Comparatives and Superlatives',
  subtitle: "Sifatlarning qiyosiy va ustun darajalari — taqqoslash va eng yaxshini aniqlash",
  level: 'A2',
  day: 45,
  formulas: [
    { label: 'Comparative (Qiyosiy)', structure: 'Short adj + -er + than\nmore + long adj + than', color: 'green' },
    { label: 'Superlative (Ustun)', structure: 'the + short adj + -est\nthe most + long adj', color: 'blue' },
    { label: 'Irregular (Noto\'g\'ri)', structure: 'good → better / the best\nbad → worse / the worst\nfar → farther / the farthest', color: 'orange' },
  ],
  rules: [
    "1️⃣ QACHON ISHLATILADI?\n\nComparatives va Superlatives — sifatlarning darajalarini ifodalash uchun ishlatiladi:\n\n📌 COMPARATIVE (qiyosiy daraja): Ikki narsani solishtirish uchun. 'Kimdandir ko'proq/kamroq' ma'nosida.\n  → She is taller than me. (U mendan balandroq)\n  → This book is more interesting than that one. (Bu kitob undan qiziqarliroq)\n  → A car is faster than a bicycle. (Mashina velosipeddan tezroq)\n\n📌 SUPERLATIVE (ustun daraja): Uch yoki undan ortiq narsa ichidan eng yuqorisini ko'rsatish uchun.\n  → She is the tallest girl in the class. (U sinfdagi eng baland qiz)\n  → This is the most beautiful city I have ever visited. (Bu men ko'rgan eng chiroyli shahar)\n  → July is the hottest month of the year. (Iyul — yilning eng issiq oyi)\n\n📌 TENGLIK (as...as): Ikki narsa teng ekanini ko'rsatish uchun.\n  → She is as tall as her brother. (U akasidek baland)\n  → This book is as interesting as that one. (Bu kitob o'shanchalik qiziqarli)\n\n📌 KUCHAYTIRISH: Comparative ni kuchaytirish uchun 'much', 'a lot', 'far' so'zlari ishlatiladi.\n  → This car is much more expensive than that one. (Bu mashina undan ancha qimmat)\n  → She is far more intelligent than her classmates.",
    "2️⃣ QANDAY YASALADI?\n\nSifatning turiga qarab ikkita asosiy qoida mavjud:\n\n📌 QISQA SIFATLAR (1 bo'g'in): -er / the -est\n  tall → taller → the tallest\n  fast → faster → the fastest\n  old → older → the oldest\n\n  📌 Maxsus holatlar:\n  • -e bilan tugasa → faqat -r / -st: large → larger → the largest, nice → nicer → the nicest\n  • CVC (undosh+unli+undosh) → oxirgi undosh ikki marta:\n    big → bigger → the biggest, hot → hotter → the hottest, thin → thinner → the thinnest\n  • -y bilan tugasa → y → i + er/est:\n    happy → happier → the happiest, easy → easier → the easiest, noisy → noisier → the noisiest\n\n📌 UZUN SIFATLAR (2+ bo'g'in): more / the most\n  expensive → more expensive → the most expensive\n  beautiful → more beautiful → the most beautiful\n  interesting → more interesting → the most interesting\n\n  📌 Istisnolar (2 bo'g'inli, lekin -er/-est oladi):\n    narrow → narrower → the narrowest\n    clever → cleverer → the cleverest\n    simple → simpler → the simplest\n    quiet → quieter → the quietest\n    gentle → gentler → the gentlest\n    polite → politer → the politest",
    "3️⃣ NOTO'G'RI SIFATLAR (Irregular)\n\nBa'zi sifatlar -er/-est yoki more/most qabul qilmaydi. Ularning shakli butunlay o'zgaradi:\n\n  good → better → the best (yaxshi → yaxshiroq → eng yaxshi)\n  bad → worse → the worst (yomon → yomonroq → eng yomon)\n  far → farther → the farthest (uzoq → uzoqroq → eng uzoq)\n  far → further → the furthest (majoziy ma'noda: qo'shimcha)\n  old → older/elder → the oldest/eldest (keksa, eski)\n\n  🔴 MUHIM: Bu so'zlarga -er/-est yoki more/most QO'SHILMAYDI!\n  ❌ gooder / goodest ❌\n  ❌ more good / most good ❌\n  ❌ badder / baddest ❌\n  ✅ better / the best ✓\n  ✅ worse / the worst ✓",
    "4️⃣ COMPARATIVE DA 'THAN' ISHLATILADI\n\nComparative bilan doim 'than' (dan/ga qaraganda) qo'llaniladi:\n  She is taller than me. (U mendan balandroq)\n  This book is more interesting than that one. (Bu kitob undan qiziqarliroq)\n\n  🔴 'THAN' vs 'THEN' — keng tarqalgan xato!\n  THAN = solishtirish (comparative bilan)\n  THEN = keyin (vaqt ma'nosida)\n  ❌ She is taller then me ❌\n  ✅ She is taller than me ✓\n  ✅ First I eat, then I sleep. ✓ (vaqt ketma-ketligi)\n\nSUPERLATIVEDA 'THE' VA 'IN/OF' ISHLATILADI:\n  She is the tallest in the class. (sinf ichida)\n  He is the best student in our group. (guruhimizdagi)\n  This is the most expensive of all. (hammasining ichida)\n\n  🔴 'THE' SUPERLATIVEDAN OLDIN KELADI!\n  ❌ She is tallest in the class ❌\n  ✅ She is the tallest in the class ✓",
    "5️⃣ AS...AS VA DOUBLE COMPARATIVE\n\n📌 AS + ADJECTIVE + AS (tenglik):\n  She is as tall as her brother. (U akasidek baland)\n  This book is as interesting as that one. (Bu kitob o'shanchalik qiziqarli)\n  He is not as tall as his father. (U otasidek baland emas)\n\n  🔴 'As' dan keyin sifat ASL SHAKLIDA (comparative emas) qo'llaniladi!\n  ❌ She is as taller as me ❌\n  ✅ She is as tall as me ✓\n\n📌 DOUBLE COMPARATIVE (the more... the more...):\n  The more you study, the better your English becomes. (Qancha ko'p o'qisangiz, ingliz tilingiz shuncha yaxshilanadi)\n  The sooner, the better. (Qancha tez bo'lsa, shuncha yaxshi)\n\n📌 DOUBLE COMPARATIVE XATOSI (MORE va -er birga):\n  ❌ He is more taller than me ❌\n  ✅ He is taller than me ✓\n  ❌ She is the most smartest ❌\n  ✅ She is the smartest ✓\n\n  🔴 QOIDA: Comparative uchun YOKI 'more' YOKI '-er' — ikkalasi birga EMAS!\n  Superlative uchun YOKI 'the most' YOKI 'the -est' — ikkalasi birga EMAS!",
    "6️⃣ O'ZBEKCHA FARQLAR (Uzbek vs English)\n\n  O'zbek tilida sifat darajalari qo'shimchalar orqali yasaladi:\n    baland → balandroq → eng baland\n    yaxshi → yaxshiroq → eng yaxshi\n    qimmat → qimmatroq → eng qimmat\n\n  Ingliz tilida esa sifatning turiga qarab farqlanadi:\n    Qisqa sifatlar → -er/-est\n    Uzun sifatlar → more/most\n\nO'zbeklarning eng keng tarqalgan xatolari:\n  • More bigger ❌ — 'more' VA '-er' birga ishlatilmaydi! → bigger ✓\n  • The most cheapest ❌ — 'most' VA '-est' birga emas! → the cheapest ✓\n  • She is more tall ❌ — qisqa sifat → taller ✓\n  • This is the most easy ❌ — -y qoidasi → the easiest ✓\n  • She is more happier ❌ — 'more' VA '-er' birga → happier ✓\n  • Gooder / goodest ❌ — noto'g'ri sifat → better / the best ✓\n  • She is as taller as me ❌ — as dan keyin asl shakl → as tall as ✓\n  • I am taller then you ❌ — 'then' emas, 'than' → taller than ✓",
    "7️⃣ 'MUCH', 'A LOT', 'FAR' BILAN KUCHAYTIRISH\n\n  Comparative ni kuchaytirish uchun quyidagi so'zlar ishlatiladi:\n\n  📌 MUCH = ancha (kuchli farq)\n    She is much taller than me. (U mendan ancha baland)\n    This is much more expensive. (Bu ancha qimmat)\n\n  📌 A LOT = juda ko'p (kuchli farq)\n    He is a lot older than her. (U undan ancha katta)\n    This car is a lot faster. (Bu mashina ancha tez)\n\n  📌 FAR = ancha (kuchli farq)\n    She is far more intelligent. (U ancha aqlli)\n    This is far better. (Bu ancha yaxshi)\n\n  📌 A LITTLE / SLIGHTLY = biroz (kichik farq)\n    She is a little taller than me. (U mendan biroz baland)\n    This is slightly more expensive. (Bu biroz qimmatroq)\n\n  📌 EVEN = hatto (kutilmagan darajada)\n    She is even taller than her father! (U otasidan ham baland!)\n    This is even more beautiful than I imagined.\n\n  📌 BY FAR = eng... (superlative bilan)\n    This is by far the best restaurant in the city. (Bu shahardagi eng yaxshi restoran)\n    She is by far the most talented student. (U eng iste'dodli o'quvchi)\n\n  🔴 SODDA QOIDA:\n    Comparative + much, a lot, far, a little, slightly, even\n    Superlative + by far, easily, nearly",
  ],
  vocabulary: [
    { en: 'tall', uz: 'baland (bo\'y)', example: 'She is taller than her brother.', rule: 'qisqa' },
    { en: 'short', uz: 'past (bo\'y), qisqa', example: 'This road is shorter than that one.', rule: 'qisqa' },
    { en: 'fast', uz: 'tez', example: 'A car is faster than a bicycle.', rule: 'qisqa' },
    { en: 'slow', uz: 'sekin', example: 'He is the slowest runner in the group.', rule: 'qisqa' },
    { en: 'cheap', uz: 'arzon', example: 'This phone is cheaper than that model.', rule: 'qisqa' },
    { en: 'expensive', uz: 'qimmat', example: 'The most expensive hotel in the city.', rule: 'uzun' },
    { en: 'young', uz: 'yosh', example: 'My sister is younger than me.', rule: 'qisqa' },
    { en: 'old', uz: 'keksa, eski', example: 'This is the oldest building in town.', rule: 'qisqa' },
    { en: 'good', uz: "yaxshi (sifat)", example: 'Her English is better than mine.', rule: 'notogri' },
    { en: 'bad', uz: 'yomon', example: 'This is the worst weather we have ever had.', rule: 'notogri' },
    { en: 'easy', uz: 'oson', example: 'This task is easier than the previous one.', rule: 'y bilan' },
    { en: 'difficult', uz: 'qiyin', example: 'Math is more difficult for me than English.', rule: 'uzun' },
    { en: 'beautiful', uz: 'chiroyli', example: 'She is the most beautiful girl in the class.', rule: 'uzun' },
    { en: 'important', uz: 'muhim', example: 'Health is more important than money.', rule: 'uzun' },
    { en: 'comfortable', uz: 'qulay', example: 'This chair is more comfortable than that one.', rule: 'uzun' },
    { en: 'large', uz: 'katta (hajm)', example: 'China is larger than India.', rule: 'e bilan' },
    { en: 'small', uz: 'kichik', example: 'My room is smaller than yours.', rule: 'qisqa' },
    { en: 'hot', uz: 'issiq', example: 'July is the hottest month of the year.', rule: 'cvc' },
    { en: 'cold', uz: 'sovuq', example: 'Winter is colder than autumn.', rule: 'qisqa' },
    { en: 'interesting', uz: 'qiziqarli', example: 'This book is more interesting than the film.', rule: 'uzun' },
  ],
  examples: [
    { en: 'My house is bigger than yours.', uz: "Mening uyim siznikidan kattaroq." },
    { en: 'She runs faster than me.', uz: "U mendan tezroq yuguradi." },
    { en: 'This is the most beautiful city I have ever visited.', uz: "Bu men tashrif buyurgan eng chiroyli shahar." },
    { en: 'He is the best student in the class.', uz: "U sinfdagi eng yaxshi o'quvchi." },
    { en: 'Today is colder than yesterday.', uz: "Bugun kechagidan sovuqroq." },
    { en: 'Which is cheaper: tea or coffee?', uz: "Qaysi biri arzonroq: choymi yoki kofemi?" },
    { en: 'She is happier now than before.', uz: "U avvalgidan hozir baxtliroq." },
    { en: 'This is the worst film I have ever seen.', uz: "Bu men ko'rgan eng yomon film." },
  ],
  // ═══════════════════════════════════════════════════════════════════════
  // MAXSUS HOLATLAR — yodda saqlash uchun
  // ═══════════════════════════════════════════════════════════════════════
  specialCases: [
    // ─── 1. Noto'g'ri sifatlar ────────────────────────────────────────────
    {
      id: 'irregular',
      title: 'Noto\'g\'ri sifatlar (Irregular)',
      rule: "Good → better → the best · Bad → worse → the worst · Far → farther → the farthest · Old → older/elder → the oldest/eldest",
      mnemonic: "GOOD=Better=Best — GBB deb eslab qoling (Good Better Best). BAD=Worse=Worst — BWW (Bad Worse Worst). FARda -ther/-thest qo'shimchasi.",
      commonMistakes: "Gooder / goodest, badder / baddest, more good, most bad — bularning hammasi XATO! Irregular sifatlarga -er/-est yoki more/most QO'SHILMAYDI.",
      examples: [
        { en: 'My English is getting better every day.', uz: "Ingliz tilim kundan-kunga yaxshilanmoqda." },
        { en: 'This is the worst weather this year.', uz: "Bu yilgi eng yomon ob-havo." },
        { en: 'Tashkent is farther from here than Samarkand.', uz: "Toshkent bu yerdan Samarqanddan uzoqroq." },
      ],
      drills: [
        {
          id: 101, type: 'fill-blank',
          instruction: 'Noto\'g\'ri sifatlarni to\'g\'ri shaklda yozing:',
          question: 'She is the _____ (good) student in the group.',
          blanks: ['best'],
          explanation: "'Good' → superlative: 'the best'. 'Gooder' yoki 'goodest' deyilmaydi.",
        },
        {
          id: 102, type: 'fill-blank',
          instruction: 'Noto\'g\'ri sifatlarni to\'g\'ri shaklda yozing:',
          question: "Today's weather is _____ (bad) than yesterday's.",
          blanks: ['worse'],
          explanation: "'Bad' → comparative: 'worse'. 'Badder' yoki 'more bad' XATO.",
        },
        {
          id: 103, type: 'fill-blank',
          instruction: 'Noto\'g\'ri sifatlarni to\'g\'ri shaklda yozing:',
          question: 'This is the _____ (far) point I have ever travelled.',
          blanks: ['farthest'],
          explanation: "'Far' → 'farthest'. 'Farest' yoki 'most far' XATO.",
        },
        {
          id: 104, type: 'multiple-choice',
          instruction: "To'g'ri variantni tanlang:",
          question: 'Her score is ___ than mine.',
          options: ['more good', 'gooder', 'better', 'best'],
          correct: 'better',
          explanation: "'Good' → 'better' (comparative). 'Than' → comparative kerak. 'Best' superlative.",
        },
        {
          id: 105, type: 'error-correction',
          instruction: 'Xatoni toping va to\'g\'irlang:',
          question: 'He is the more good player in the team.',
          errorPart: 'more good',
          correct: 'He is the best player in the team.',
          explanation: "'Good' → 'the best' (superlative). 'More good' deyilmaydi — 'good' noto'g'ri sifat.",
        },
      ],
    },
    // ─── 2. CVC qoidasi ───────────────────────────────────────────────────
    {
      id: 'cvc',
      title: 'CVC qoidasi (undosh+unli+undosh)',
      rule: "1 bo'g'inli, undosh+unli+undosh bilan tugagan sifatlarda oxirgi undosh ikki marta yoziladi: big → bigger, hot → hotter, thin → thinner",
      mnemonic: "B-I-G = BIG: oxirgi 3 harf CVC (undosh+unli+undosh) → undosh ikki marta: bigG + er → bigger. SHU-HU-SH = SHU (CVC) — shuning uchun shuSH + er.",
      commonMistakes: "Big → biger ❌ (bir g bilan). Hot → hottter ❌ (uch t bilan emas, ikki t: hotter). Fat → fater ❌ (ikki t: fatter).",
      examples: [
        { en: 'This box is bigger than that one.', uz: "Bu quti undan kattaroq." },
        { en: 'Today is the hottest day of the year.', uz: "Bugun yilning eng issiq kuni." },
        { en: 'She is thinner than her sister.', uz: "U opasidan ozg'inroq." },
      ],
      drills: [
        {
          id: 106, type: 'fill-blank',
          instruction: 'CVC qoidasiga amal qilib to\'ldiring:',
          question: 'July is much _____ (hot) than April.',
          blanks: ['hotter'],
          explanation: "'Hot' → CVC (undosh+unli+undosh) → 't' ikki marta: 'hotter'.",
        },
        {
          id: 107, type: 'fill-blank',
          instruction: 'CVC qoidasiga amal qilib to\'ldiring:',
          question: 'I need a _____ (big) room — this one is too small!',
          blanks: ['bigger'],
          explanation: "'Big' → CVC → 'g' ikki marta: 'bigger'.",
        },
        {
          id: 108, type: 'multiple-choice',
          instruction: "CVC qoidasiga amal qilib to'g'ri shaklni tanlang:",
          question: 'My brother is ___ than me.',
          options: ['fater', 'fatter', 'more fat', 'fattest'],
          correct: 'fatter',
          explanation: "'Fat' → CVC → 't' ikki marta: 'fatter'. 'Than' bor → comparative.",
        },
        {
          id: 109, type: 'fill-blank',
          instruction: 'CVC qoidasiga amal qilib to\'ldiring:',
          question: 'After the rain, the ground became _____ (wet) than before.',
          blanks: ['wetter'],
          explanation: "'Wet' → CVC → 't' ikki marta: 'wetter'. 'Than' bilan solishtirish.",
        },
        {
          id: 110, type: 'error-correction',
          instruction: 'Xatoni toping va to\'g\'irlang:',
          question: 'She is thinier than her best friend.',
          errorPart: 'thinier',
          correct: 'She is thinner than her best friend.',
          explanation: "'Thin' → CVC → 'n' ikki marta: 'thinner'. 'Thinier' xato — '-ier' '-y' bilan tugagan so'zlar uchun.",
        },
      ],
    },
    // ─── 3. -y → -ier/-iest ──────────────────────────────────────────────
    {
      id: 'y-rule',
      title: "-y bilan tugagan sifatlar",
      rule: "-y bilan tugagan sifatlar: y → i + er/est: happy → happier → the happiest. Uzun bo'lsa ham -y qisqartiriladi: friendly → friendlier → the friendliest",
      mnemonic: "Y ni tashla, I ni qo'sh, ER/EST ni qo'sh: happY → happI + er = happier. Yodda tuting: 'y' o'rniga 'i' keladi, 'more happy' EMAS.",
      commonMistakes: "Happy → more happy ❌ (bu -y qoidasini buzadi). Easy → easyer ❌ (y → i: easier). Noisy → noisyer ❌ (noisier).",
      examples: [
        { en: 'She is happier now than before.', uz: "U avvalgidan hozir baxtliroq." },
        { en: 'This is the easiest exam I have ever taken.', uz: "Bu men topshirgan eng oson imtihon." },
        { en: 'He is the friendliest person in the office.', uz: "U ofisdagi eng do'stona odam." },
      ],
      drills: [
        {
          id: 111, type: 'fill-blank',
          instruction: '-y qoidasiga amal qilib to\'ldiring:',
          question: 'She looks _____ (happy) than yesterday.',
          blanks: ['happier'],
          explanation: "'Happy' → 'y' → 'i' + 'er': 'happier'. 'Than' → comparative.",
        },
        {
          id: 112, type: 'fill-blank',
          instruction: '-y qoidasiga amal qilib to\'ldiring:',
          question: 'This is the _____ (easy) task in the whole book.',
          blanks: ['easiest'],
          explanation: "'Easy' → 'y' → 'i' + 'est': 'the easiest'. 'In the whole book' → superlative.",
        },
        {
          id: 113, type: 'multiple-choice',
          instruction: "To'g'ri variantni tanlang:",
          question: 'This neighbourhood is ___ than the old one.',
          options: ['more noisy', 'noisyier', 'noisier', 'noisyest'],
          correct: 'noisier',
          explanation: "'Noisy' → 'y' → 'i' + 'er': 'noisier'. 'More noisy' va 'noisyier' xato.",
        },
        {
          id: 114, type: 'fill-blank',
          instruction: '-y qoidasiga amal qilib to\'ldiring:',
          question: 'She is the _____ (pretty) girl in the class.',
          blanks: ['prettiest'],
          explanation: "'Pretty' → 'y' → 'i' + 'est': 'the prettiest'. 'The most pretty' xato.",
        },
        {
          id: 115, type: 'error-correction',
          instruction: 'Xatoni toping va to\'g\'irlang:',
          question: 'Life in the city is more busy than in the village.',
          errorPart: 'more busy',
          correct: 'Life in the city is busier than in the village.',
          explanation: "'Busy' → -y bilan tugagan → 'busier'. 'More busy' xato — -y qoidasiga rioya qiling.",
        },
      ],
    },
    // ─── 4. -e → -r/-st ──────────────────────────────────────────────────
    {
      id: 'e-rule',
      title: "-e bilan tugagan sifatlar",
      rule: "-e bilan tugagan qisqa sifatlarga faqat -r (comparative) va -st (superlative) qo'shiladi: large → larger → the largest, nice → nicer → the nicest",
      mnemonic: "-e bilan tugasa, faqat -r yoki -st: largE → largER (e ni tashlamaysan, faqat r ni qo'shasan). 'Large' → 'larger' (more large EMAS!).",
      commonMistakes: "Large → more large ❌ (qisqa, -e bilan → larger). Nice → more nice ❌ (nicer). Safe → safier ❌ (safer, safe → e → r).",
      examples: [
        { en: 'China is larger than India.', uz: "Xitoy Hindistondan kattaroq." },
        { en: 'She has the nicest smile I have ever seen.', uz: "U men ko'rgan eng yoqimli tabassumga ega." },
        { en: 'This route is safer than the mountain road.', uz: "Bu yo'l tog' yo'lidan xavfsizroq." },
      ],
      drills: [
        {
          id: 116, type: 'fill-blank',
          instruction: '-e qoidasiga amal qilib to\'ldiring:',
          question: 'Our new house is much _____ (large) than the old one.',
          blanks: ['larger'],
          explanation: "'Large' → -e bilan tugagan → +r: 'larger'. 'More large' deyilmaydi.",
        },
        {
          id: 117, type: 'fill-blank',
          instruction: '-e qoidasiga amal qilib to\'ldiring:',
          question: 'She has the _____ (cute) puppy in the neighbourhood.',
          blanks: ['cutest'],
          explanation: "'Cute' → -e bilan tugagan → +st: 'the cutest'. 'Cuteest' xato (faqat -st).",
        },
        {
          id: 118, type: 'fill-blank',
          instruction: '-e qoidasiga amal qilib to\'ldiring:',
          question: 'My brother is five years _____ (old) than me.',
          blanks: ['older'],
          explanation: "'Old' → -d bilan tugagan, CVC emas → oddiy qo'shimcha: 'older'.",
        },
        {
          id: 119, type: 'multiple-choice',
          instruction: "To'g'ri variantni tanlang:",
          question: 'This road is ___ than the highway.',
          options: ['more safe', 'safier', 'safer', 'safest'],
          correct: 'safer',
          explanation: "'Safe' → -e bilan tugagan → 'safer'. 'Than' → comparative. 'More safe' xato.",
        },
        {
          id: 120, type: 'error-correction',
          instruction: 'Xatoni toping va to\'g\'irlang:',
          question: 'Her house is more large than mine.',
          errorPart: 'more large',
          correct: 'Her house is larger than mine.',
          explanation: "'Large' → -e bilan tugaydi, qisqa sifat → 'larger'. 'More large' qo'llanilmaydi.",
        },
      ],
    },
    // ─── 5. 2 bo'g'inli istisnolar ───────────────────────────────────────
    {
      id: 'two-syllable',
      title: "Ikki bo'g'inli istisnolar",
      rule: "Ba'zi 2 bo'g'inli sifatlar ham -er/-est qabul qiladi: narrow, clever, simple, quiet, gentle, polite. 'Narrow → narrower → the narrowest' (more narrow ham ishlatiladi).",
      mnemonic: "ESLAB QOLING: narrow, clever, simple, quiet, gentle, polite — bu 6 ta so'z 2 bo'g'inli bo'lsa ham -er/-est oladi. Qolgan 2+ bo'g'inlilar MORE/MOST oladi.",
      commonMistakes: "Narrow → more narrow ❌ (narrower to'g'ri, lekin more narrow ham joiz). Clever → more cleverer ❌ (ikki xil qo'shma xato).",
      examples: [
        { en: 'This street is narrower than the main road.', uz: "Bu ko'cha asosiy yo'ldan torroq." },
        { en: 'She is the most clever student in the class.', uz: "U sinfdagi eng aqlli o'quvchi. (cleverest ham mumkin)" },
        { en: 'Could you speak more quietly?', uz: "Ko'proq jim gapira olasizmi?" },
      ],
      drills: [
        {
          id: 121, type: 'fill-blank',
          instruction: '2 bo\'g\'inli istisnolarni to\'g\'ri qo\'llang:',
          question: 'The back door is _____ (narrow) than the front door.',
          blanks: ['narrower'],
          explanation: "'Narrow' 2 bo'g'inli istisno → 'narrower' (more narrow ham mumkin).",
        },
        {
          id: 122, type: 'fill-blank',
          instruction: '2 bo\'g\'inli istisnolarni to\'g\'ri qo\'llang:',
          question: 'He is the _____ (clever) person I know.',
          blanks: ['cleverest'],
          explanation: "'Clever' → 2 bo'g'inli istisno → 'cleverest' yoki 'the most clever'.",
        },
        {
          id: 123, type: 'multiple-choice',
          instruction: "To'g'ri variantni tanlang:",
          question: 'She is much ___ than her brother.',
          options: ['more quiet', 'quieter', 'quietter', 'more quieter'],
          correct: 'quieter',
          explanation: "'Quiet' 2 bo'g'inli istisno → 'quieter' (more quiet ham mumkin). 'Quietter' xato — CVC emas.",
        },
        {
          id: 124, type: 'multiple-choice',
          instruction: "To'g'ri variantni tanlang:",
          question: 'This is the ___ problem in the test.',
          options: ['simplest', 'most simple', 'more simple', 'simple most'],
          correct: 'simplest',
          explanation: "'Simple' 2 bo'g'inli istisno → 'simplest' yoki 'the most simple'. Ikkisi ham to'g'ri.",
        },
        {
          id: 125, type: 'error-correction',
          instruction: 'Xatoni toping va to\'g\'irlang:',
          question: 'She is the more polite girl in the class.',
          errorPart: 'more polite',
          correct: 'She is the politest girl in the class.',
          explanation: "'Polite' 2 bo'g'inli istisno → 'the politest' (the most polite ham mumkin). 'In the class' → superlative.",
        },
      ],
    },
    // ─── 6. Double comparative/superlative xatolari ─────────────────────
    {
      id: 'double',
      title: 'Double comparative va superlative (qo\'sh xatolar)',
      rule: "Hech qachon MORE va -ER (yoki MOST va -EST) ni birga ishlatmang! 'More bigger' ❌ → 'bigger' ✅. 'The most hottest' ❌ → 'the hottest' ✅.",
      mnemonic: "MORE = -er (birini tanla). MOST = -est (birini tanla). 'More bigger' — bu 'oq qora' deyish bilan barobar. YOKI 'more' YOKI '-er', ikkalasi birga EMAS!",
      commonMistakes: "More bigger ❌ (bigger), more hotter ❌ (hotter), the most biggest ❌ (the biggest), the most heaviest ❌ (the heaviest).",
      examples: [
        { en: 'This box is heavier than that one. (NOT more heavier)', uz: "Bu quti undan og'irroq." },
        { en: 'She is the smartest student. (NOT the most smartest)', uz: "U eng aqlli o'quvchi." },
      ],
      drills: [
        {
          id: 126, type: 'error-correction',
          instruction: 'Double comparative xatosini toping va to\'g\'irlang:',
          question: 'This car is more faster than that one.',
          errorPart: 'more faster',
          correct: 'This car is faster than that one.',
          explanation: "'Faster' o'zi comparative. 'More' qo'shimcha qilish xato → 'double comparative'. Faqat 'faster'.",
        },
        {
          id: 127, type: 'error-correction',
          instruction: 'Double superlative xatosini toping va to\'g\'irlang:',
          question: 'This is the most cheapest restaurant in town.',
          errorPart: 'most cheapest',
          correct: 'This is the cheapest restaurant in town.',
          explanation: "'Cheapest' o'zi superlative. 'The most cheapest' → double superlative xatosi. 'The cheapest' yetarli.",
        },
        {
          id: 128, type: 'multiple-choice',
          instruction: "To'g'ri variantni tanlang:",
          question: 'Which sentence is CORRECT?',
          options: [
            'She is more taller than me.',
            'She is taller than me.',
            'She is more tall than me.',
            'She is the most tallest.',
          ],
          correct: 'She is taller than me.',
          explanation: "'Taller' o'zi comparative. 'More taller' (double) va 'more tall' xato. 'The most tallest' double superlative.",
        },
      ],
    },
    // ─── 7. than/then, as...as, much/a lot ──────────────────────────────
    {
      id: 'common-mistakes',
      title: 'Ko\'p uchraydigan boshqa xatolar',
      rule: "1) 'Than' (solishtirish) vs 'Then' (keyin): bir harf farq, butunlay boshqa ma'no. 2) 'As + adj + as' tenglik: 'as tall as'. 3) 'Much/a lot/far' comparative ni kuchaytiradi: 'much better', 'far more expensive'.",
      mnemonic: "THAN = Taqqosla (ikki narsani). THEN = vaqt (keyin). 'Than' va 'Then' ni farqlash uchun: 'ThAn' = compArison, 'ThEn' = timE. MUCH = kuchaytiruvchi: 'much better', 'much more expensive'.",
      commonMistakes: "Then vs than xatosi eng ko'p uchraydi. 'As...as' ni unutish: 'She is tall as me' ❌ → 'She is as tall as me' ✅.",
      examples: [
        { en: 'She is taller than me. (NOT then)', uz: "U mendan balandroq." },
        { en: 'This book is as interesting as that one.', uz: "Bu kitob o'shanchalik qiziqarli." },
        { en: 'This car is much more expensive than that one.', uz: "Bu mashina undan ancha qimmat." },
      ],
      drills: [
        {
          id: 129, type: 'fill-blank',
          instruction: "'than' yoki 'then' bilan to'ldiring:",
          question: 'She is older _____ my brother.',
          blanks: ['than'],
          explanation: "Solishtirish → 'than'. 'Then' vaqt uchun: 'First I eat, then I sleep.'",
        },
        {
          id: 130, type: 'fill-blank',
          instruction: "Bo'sh joyni 'than' yoki 'then' bilan to'ldiring:",
          question: 'First we studied, _____ we took the test.',
          blanks: ['then'],
          explanation: "Vaqt ketma-ketligi → 'then' (keyin). 'Than' emas!",
        },
        {
          id: 131, type: 'error-correction',
          instruction: 'Xatoni toping va to\'g\'irlang:',
          question: 'My English is getting better then before.',
          errorPart: 'then',
          correct: 'My English is getting better than before.',
          explanation: "Solishtirish → 'than'. 'Then' vaqt ma'nosida, bu yerda solishtirish ketayapti.",
        },
        {
          id: 132, type: 'transformation',
          instruction: "'as...as' yordamida qayta yozing:",
          question: 'Tom is 170cm. John is 170cm too.',
          hint: 'John is as ...',
          correct: 'John is as tall as Tom.',
          explanation: "Ikkala bo'y ham teng → 'as tall as'. 'As + adj + as' = tenglik.",
        },
        {
          id: 133, type: 'fill-blank',
          instruction: "Kuchaytiruvchi so'z bilan to'ldiring (much / a lot / far):",
          question: 'This restaurant is _____ (much / as) better than the other one.',
          blanks: ['much'],
          explanation: "'Better' comparative → kuchaytirish uchun 'much', 'a lot', 'far' ishlatiladi. 'As' bu yerda to'g'ri emas.",
        },
      ],
    },
  ],
  exercises: [
    {
      id: 1, type: 'multiple-choice',
      instruction: "To'g'ri comparative shaklni tanlang:",
      question: "A car is ___ than a bicycle.",
      options: ['faster', 'more fast', 'fastest', 'the fastest'],
      correct: 'faster',
      explanation: "'Fast' qisqa sifat (1 bo'g'in) → comparative: 'faster'. 'Than' bilan ishlatiladi.",
    },
    {
      id: 2, type: 'multiple-choice',
      instruction: "To'g'ri superlative shaklni tanlang:",
      question: "She is ___ girl in our class.",
      options: ['the most tall', 'taller', 'the tallest', 'tallest'],
      correct: 'the tallest',
      explanation: "Superlative: 'the + tallest'. 'The' kerak va '-est' qo'shimchasi qisqa sifatga qo'shiladi.",
    },
    {
      id: 3, type: 'multiple-choice',
      instruction: "To'g'ri comparative shaklni tanlang:",
      question: "This book is ___ than that one.",
      options: ['more interesting', 'interesting', 'the most interesting', 'interestinger'],
      correct: 'more interesting',
      explanation: "'Interesting' uzun sifat (3 bo'g'in) → 'more + interesting'. 'Than' bilan solishtirish.",
    },
    {
      id: 4, type: 'fill-blank',
      instruction: "Comparative yoki Superlative bilan to'ldiring:",
      question: "Mount Everest is _____ (high) mountain in the world.",
      blanks: ['the highest'],
      explanation: "'In the world' = eng yuqori → Superlative: 'the highest'.",
    },
    {
      id: 5, type: 'fill-blank',
      instruction: "Comparative yoki Superlative bilan to'ldiring:",
      question: "This exercise is _____ (easy) than the last one.",
      blanks: ['easier'],
      explanation: "'Than' bilan solishtirish → Comparative. 'Easy' → 'y' → 'i' + 'er' = 'easier'.",
    },
    {
      id: 6, type: 'fill-blank',
      instruction: "Comparative yoki Superlative bilan to'ldiring:",
      question: "She speaks English _____ (good) than me.",
      blanks: ['better'],
      explanation: "'Good' noto'g'ri shakl → 'better' (comparative). 'Than' bilan solishtirish.",
    },
    {
      id: 7, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: "She is more taller than her sister.",
      errorPart: 'more taller',
      correct: 'She is taller than her sister.',
      explanation: "'Tall' qisqa sifat → faqat '-er' qo'shimchasi kerak: 'taller'. 'More' qo'shilmaydi.",
    },
    {
      id: 8, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: "This is the most boringest film I have ever seen.",
      errorPart: 'most boringest',
      correct: 'This is the most boring film I have ever seen.',
      explanation: "Uzun sifatlar: 'the most + boring'. '-est' qo'shimchasi qisqa sifatlar uchun. Ikkalasini birga ishlatib bo'lmaydi.",
    },
    {
      id: 9, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "Qaysi gap grammatik jihatdan TO'G'RI?",
      options: [
        'He is the best player in the team.',
        'He is the goodest player in the team.',
        'He is the most best player in the team.',
        'He is the bestest player in the team.',
      ],
      correct: 'He is the best player in the team.',
      explanation: "Bu gap to'g'ri! 'Good' → 'the best' (superlative, noto'g'ri shakl). Boshqa variantlarning hammasi xato: 'goodest', 'most best', 'bestest' deyilmaydi.",
    },
    {
      id: 10, type: 'transformation',
      instruction: "Gapni Comparative shaklida qayta yozing:",
      question: "Russia is large. Canada is larger.",
      hint: "Canada is ...",
      correct: 'Canada is larger than Russia.',
      explanation: "Ikkala mamlakatni solishtirish → 'larger than'. 'Large' → 'larger' (1 bo'g'in, 'e' bilan tugaydi → faqat '-r').",
    },
    {
      id: 11, type: 'transformation',
      instruction: "Superlative bilan gap tuzing:",
      question: "No other student in the class is as tall as him.",
      hint: "He is ...",
      correct: 'He is the tallest student in the class.',
      explanation: "Eng yuqori daraja → Superlative: 'the + tallest'.",
    },
    {
      id: 12, type: 'fill-blank',
      instruction: "Comparative yoki Superlative bilan to'ldiring:",
      question: "This is _____ (bad) meal I have ever eaten. I can't eat it!",
      blanks: ['the worst'],
      explanation: "'Bad' → noto'g'ri shakl: 'the worst' (superlative). 'Ever' = hozirgacha ko'rgan eng yomoni.",
    },
    {
      id: 13, type: 'fill-blank',
      instruction: "Comparative yoki Superlative bilan to'ldiring:",
      question: "Summer is _____ (hot) than spring in Uzbekistan.",
      blanks: ['hotter'],
      explanation: "'Hot' → qisqa sifat, undosh + unli + undosh → undosh ikki marta: 'hotter'. 'Than' ko'rsatadi.",
    },
    {
      id: 14, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "Who is ___ person in your family?",
      options: ['the most old', 'the oldest', 'older', 'oldest'],
      correct: 'the oldest',
      explanation: "'In your family' = guruh ichida → Superlative. 'The oldest' (the + old + -est).",
    },
    {
      id: 15, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "Watching TV is ___ than reading books.",
      options: ['more relaxing', 'relaxing', 'the most relaxing', 'relaxinger'],
      correct: 'more relaxing',
      explanation: "'Relaxing' 3 bo'g'inli sifat → 'more + relaxing'. 'Than' = comparative.",
    },
    {
      id: 16, type: 'error-correction',
      instruction: "Grammatik xatoni toping va to'g'irlang:",
      question: "My English is getting gooder every day!",
      errorPart: 'gooder',
      correct: 'My English is getting better every day!',
      explanation: "'Good' noto'g'ri sifat — comparative: 'good' → 'better'. 'Gooder' deyilmaydi.",
    },
    {
      id: 17, type: 'transformation',
      instruction: "Gapni Superlative bilan qayta yozing:",
      question: "I have never eaten a more delicious plov than this one.",
      hint: "This is ...",
      correct: 'This is the most delicious plov I have ever eaten.',
      explanation: "'Never ... more' → 'the most' bilan o'zgartiriladi. 'Delicious' uzun sifat → 'the most delicious'.",
    },
    {
      id: 18, type: 'fill-blank',
      instruction: "Comparative yoki Superlative bilan to'ldiring:",
      question: "She drives _____ (carefully) than her husband.",
      blanks: ['more carefully'],
      explanation: "'Carefully' qo'shimcha (adverb), 3+ bo'g'in → 'more carefully'. 'Than' = comparative.",
    },
    {
      id: 19, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "This is ___ book I have ever read. I love it!",
      options: ['the better', 'the goodest', 'the best', 'better'],
      correct: 'the best',
      explanation: "'Good' → superlative: 'the best'. 'Ever' = hozirgacha -> eng yaxshisi.",
    },
    {
      id: 20, type: 'transformation',
      instruction: "Gapni Comparative bilan qayta yozing:",
      question: "This hotel is not as cheap as the other one.",
      hint: "The other hotel ...",
      correct: 'The other hotel is cheaper than this one.',
      explanation: "'Not as cheap as' = 'cheaper than'. 'Cheap' qisqa sifat → 'cheaper'.",
    },
    // ═══════════════════════════════════════════════════════════════════
    // BLOK 2: Jadval to'ldirish (memorization drill)
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 21, type: 'fill-table',
      instruction: "Quyidagi jadvalda sifatlarning comparative va superlative shakllarini yozing:",
      rows: [
        { adj: 'big', comp: 'bigger', sup: 'the biggest' },
        { adj: 'happy', comp: 'happier', sup: 'the happiest' },
        { adj: 'interesting', comp: 'more interesting', sup: 'the most interesting' },
        { adj: 'thin', comp: 'thinner', sup: 'the thinnest' },
        { adj: 'noisy', comp: 'noisier', sup: 'the noisiest' },
      ],
      explanation: "'Happy' → 'y' → 'i' + er/est: happier, the happiest. 'Interesting' uzun → more/most. 'Thin' undosh ikki marta → thinner, the thinnest. 'Noisy' → 'y' → 'i': noisier, the noisiest.",
    },
    {
      id: 22, type: 'fill-table',
      instruction: "Quyidagi noto'g'ri va qisqa sifatlarning barcha shakllarini to'ldiring:",
      rows: [
        { adj: 'good', comp: 'better', sup: 'the best' },
        { adj: 'bad', comp: 'worse', sup: 'the worst' },
        { adj: 'far', comp: 'farther', sup: 'the farthest' },
        { adj: 'hot', comp: 'hotter', sup: 'the hottest' },
        { adj: 'wet', comp: 'wetter', sup: 'the wettest' },
        { adj: 'old', comp: 'older', sup: 'the oldest' },
      ],
      explanation: "Noto'g'ri: good→better→best, bad→worse→worst, far→farther→farthest. Qisqa (CVC): hot→hotter→hottest, wet→wetter→wettest. Old→older→oldest (muntazam).",
    },
    // ═══════════════════════════════════════════════════════════════════
    // BLOK 3: Qo'shimcha MCQ
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 23, type: 'multiple-choice',
      instruction: "To'g'ri comparative shaklni tanlang:",
      question: "This year is ___ than last year.",
      options: ['more hot', 'hotter', 'more hotter', 'hottest'],
      correct: 'hotter',
      explanation: "'Hot' qisqa sifat, undosh+unli+undosh → undosh ikki marta: 'hotter'. 'More hotter' xato — 'more' va '-er' birga ishlatilmaydi.",
    },
    {
      id: 24, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "This is ___ expensive car in the showroom.",
      options: ['the more', 'the most', 'most', 'more'],
      correct: 'the most',
      explanation: "'Expensive' uzun sifat + 'in the showroom' (guruh) → Superlative: 'the most expensive'. 'The' kerak!",
    },
    {
      id: 25, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "My new job is ___ than my old one. I love it!",
      options: ['more better', 'better', 'gooder', 'the best'],
      correct: 'better',
      explanation: "'Good' → noto'g'ri comparative: 'better'. 'Than' bilan solishtirish → comparative. 'More better' xato — 'better' o'zi comparative.",
    },
    {
      id: 26, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "She speaks English ___ than before.",
      options: ['more fluently', 'fluently', 'most fluently', 'fluentlier'],
      correct: 'more fluently',
      explanation: "'Fluently' ravish (adverb), -ly bilan tugaydi → 'more fluently'. 'Than' bilan comparative.",
    },
    // ═══════════════════════════════════════════════════════════════════
    // BLOK 4: Qo'shimcha Fill-blank
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 27, type: 'fill-blank',
      instruction: "Bo'sh joyni to'ldiring (comparative yoki superlative):",
      question: "My sister is two years _____ (young) than me.",
      blanks: ['younger'],
      explanation: "'Two years' = farqni ko'rsatadi + 'than' = comparative. 'Young' → 'younger'.",
    },
    {
      id: 28, type: 'fill-blank',
      instruction: "Bo'sh joyni to'ldiring (comparative yoki superlative):",
      question: "This is _____ (delicious) cake I have ever tasted!",
      blanks: ['the most delicious'],
      explanation: "'Ever tasted' = hayotimda ko'rgan eng mazalisi → Superlative: 'the most delicious'.",
    },
    {
      id: 29, type: 'fill-blank',
      instruction: "Bo'sh joyni to'ldiring (comparative yoki superlative):",
      question: "Tashkent is _____ (big) than Samarkand, but not _____ (big) city in Uzbekistan.",
      blanks: ['bigger', 'the biggest'],
      explanation: "Birinchi bo'shliq: solishtirish → 'bigger than'. Ikkinchi: eng kattasi → 'the biggest'. 'Big' → undosh ikki marta.",
    },
    {
      id: 30, type: 'fill-blank',
      instruction: "Bo'sh joyni to'ldiring (comparative yoki superlative):",
      question: "This road is _____ (narrow) than that one, but it is _____ (safe).",
      blanks: ['narrower', 'safer'],
      explanation: "'Narrow' 2 bo'g'inli, lekin -ow bilan tugaydi → '-er' qabul qiladi: narrower. 'Safe' → 'safer' (e bilan tugaydi → r).",
    },
    {
      id: 31, type: 'fill-blank',
      instruction: "Bo'sh joyni to'ldiring (comparative yoki superlative):",
      question: "He is _____ (lazy) student in the whole class. He never does homework!",
      blanks: ['the laziest'],
      explanation: "'Lazy' → 'y' → 'i' + 'est': 'the laziest'. 'In the whole class' = guruh ichida eng.",
    },
    {
      id: 32, type: 'fill-blank',
      instruction: "Bo'sh joyni to'ldiring (comparative yoki superlative):",
      question: "A train is much _____ (comfortable) than a bus for long journeys.",
      blanks: ['more comfortable'],
      explanation: "'Comfortable' 4 bo'g'in → uzun sifat → 'more comfortable'. 'Much' comparative ni kuchaytiradi: 'much more comfortable'.",
    },
    // ═══════════════════════════════════════════════════════════════════
    // BLOK 5: Qo'shimcha Error-correction
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 33, type: 'error-correction',
      instruction: "Xatoni toping va to'g'irlang:",
      question: "February is the more coldest month of the year in Uzbekistan.",
      errorPart: 'the more coldest',
      correct: 'February is the coldest month of the year in Uzbekistan.',
      explanation: "'Cold' qisqa sifat → 'the coldest' (the + -est). 'More' qo'shimcha qilish xato — qisqa sifatlarga 'more' qo'yilmaydi.",
    },
    {
      id: 34, type: 'error-correction',
      instruction: "Xatoni toping va to'g'irlang:",
      question: "She is taller then her brother but shorter than her sister.",
      errorPart: 'then',
      correct: 'She is taller than her brother but shorter than her sister.',
      explanation: "'Then' = 'keyin', 'than' = 'dan/ga qaraganda'. Comparative bilan 'than' ishlatiladi, 'then' emas!",
    },
    {
      id: 35, type: 'error-correction',
      instruction: "Xatoni toping va to'g'irlang:",
      question: "This is the most easy test I have ever taken.",
      errorPart: 'the most easy',
      correct: 'This is the easiest test I have ever taken.',
      explanation: "'Easy' ikki bo'g'inli, '-y' bilan tugaydi → 'y' → 'i' + 'est': 'the easiest'. 'The most easy' xato.",
    },
    {
      id: 36, type: 'error-correction',
      instruction: "Xatoni toping va to'g'irlang:",
      question: "He is the most richest person in our town.",
      errorPart: 'the most richest',
      correct: 'He is the richest person in our town.',
      explanation: "'Rich' 1 bo'g'in → 'the richest' (the + -est). 'Most' bilan '-est' ikkovi birga ishlatilmaydi — bu 'double superlative' xatosi.",
    },
    // ═══════════════════════════════════════════════════════════════════
    // BLOK 6: Qo'shimcha Transformation
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 37, type: 'transformation',
      instruction: "Berilgan ikki narsani solishtirib gap yozing:",
      question: "Football / exciting / chess",
      hint: 'Football is ...',
      correct: 'Football is more exciting than chess.',
      explanation: "'Exciting' uzun sifat (3 bo'g'in) → 'more exciting + than'. Ikkala narsani solishtirish.",
    },
    {
      id: 38, type: 'transformation',
      instruction: "Comparative → Superlative ga o'zgartiring:",
      question: "Tashkent is bigger than any other city in Uzbekistan.",
      hint: 'Tashkent is ...',
      correct: 'Tashkent is the biggest city in Uzbekistan.',
      explanation: "'Bigger than any other' = eng kattasi → 'the biggest'. 'The + -est' superlative shakli.",
    },
    {
      id: 39, type: 'transformation',
      instruction: "Gapni 'as ... as' yordamida qayta yozing:",
      question: "My car is faster than yours.",
      hint: "Your car is not ...",
      correct: "Your car is not as fast as mine.",
      explanation: "'Faster than' → 'not as fast as'. 'As + adj + as' tenglikni, 'not as + adj + as' tengsizlikni bildiradi.",
    },
    {
      id: 40, type: 'transformation',
      instruction: "Berilgan ma'lumotdan foydalanib 3 ta comparative gap tuzing:",
      question: "Elephant: 5000kg, Horse: 800kg, Dog: 30kg",
      hint: "An elephant is heavier than a horse.",
      correct: "An elephant is heavier than a horse. A horse is heavier than a dog. A dog is lighter than a horse.",
      explanation: "Masshtab bo'yicha solishtirish: 'heavier than' yoki 'lighter than'. 'Heavy' → 'y' → 'i' + er: heavier.",
    },
    // ═══════════════════════════════════════════════════════════════════
    // BLOK 7: Mini-test (aralash turlar)
    // ═══════════════════════════════════════════════════════════════════
    {
      id: 41, type: 'fill-blank',
      instruction: "Bo'sh joyni to'ldiring:",
      question: "Gold is _____ (expensive) than silver, but platinum is _____ (expensive) metal of all.",
      blanks: ['more expensive', 'the most expensive'],
      explanation: "Birinchi: ikki metal solishtirish → 'more expensive than'. Ikkinchi: hammasidan qimmati → 'the most expensive'.",
    },
    {
      id: 42, type: 'fill-blank',
      instruction: "Bo'sh joyni to'ldiring:",
      question: "My English is getting _____ (good) every day because I practice _____ (hard) than before.",
      blanks: ['better', 'harder'],
      explanation: "'Good' → 'better' (noto'g'ri comparative). 'Hard' → 'harder' (qisqa sifat). 'Than' bor → comparative.",
    },
    {
      id: 43, type: 'multiple-choice',
      instruction: "To'g'ri variantni tanlang:",
      question: "Which sentence is correct?",
      options: [
        'She is more smarter than me.',
        'She is smarter than me.',
        'She is smartest than me.',
        'She is more smart than me.',
      ],
      correct: 'She is smarter than me.',
      explanation: "'Smart' 1 bo'g'in → 'smarter'. 'More smarter' double comparative xato. 'Smartest' superlative — 'than' bilan ishlatilmaydi.",
    },
    {
      id: 44, type: 'error-correction',
      instruction: "Xatoni toping va to'g'irlang:",
      question: "This is the better restaurant in the city.",
      errorPart: 'the better',
      correct: 'This is the best restaurant in the city.',
      explanation: "'Better' — comparative (ikki narsa). 'In the city' = guruh ichida eng yaxshisi → Superlative: 'the best'.",
    },
    {
      id: 45, type: 'transformation',
      instruction: "Superlative bilan qayta yozing:",
      question: "No other mountain in the world is as high as Mount Everest.",
      hint: 'Mount Everest is ...',
      correct: 'Mount Everest is the highest mountain in the world.',
      explanation: "'No other ... as high as' = eng balandi → 'the highest'. 'High' = 1 bo'g'in → 'the highest'.",
    },
  ],
  // ═══════════════════════════════════════════════════════════════════════
  // TESTLAR — 25 ta multiple-choice test, oddiydan murakkabga
  // ═══════════════════════════════════════════════════════════════════════
  tests: [
    { id: 1, type: 'multiple-choice', instruction: "Asosiy qoidalar — oson", question: 'Qisqa sifatlarning comparative shakli qanday yasaladi?', options: ['more + adj', 'adj + -er', 'the + adj + -est', 'adj + -ing'], correct: 'adj + -er', explanation: 'Qisqa sifatlar (1 bo\'g\'in) + -er: tall → taller.' },
    { id: 2, type: 'multiple-choice', instruction: "Asosiy qoidalar — oson", question: 'Uzun sifatlarning comparative shakli qanday yasaladi?', options: ['adj + -er', 'the + adj + -est', 'more + adj', 'adj + -ing'], correct: 'more + adj', explanation: 'Uzun sifatlar (2+ bo\'g\'in) → more + adj: more expensive.' },
    { id: 3, type: 'multiple-choice', instruction: "Asosiy qoidalar — oson", question: '"Tall" so\'zining comparative shaklini toping:', options: ['tall', 'taller', 'tallest', 'more tall'], correct: 'taller', explanation: 'Tall → qisqa sifat (1 bo\'g\'in) → taller.' },
    { id: 4, type: 'multiple-choice', instruction: "Asosiy qoidalar — oson", question: '"Expensive" so\'zining superlative shaklini toping:', options: ['the most expensive', 'the expensivest', 'more expensive', 'expensiver'], correct: 'the most expensive', explanation: 'Expensive → uzun sifat → the most expensive.' },
    { id: 5, type: 'multiple-choice', instruction: "Asosiy qoidalar — oson", question: '"Good" so\'zining comparative shaklini toping:', options: ['gooder', 'more good', 'better', 'best'], correct: 'better', explanation: 'Good → noto\'g\'ri sifat → better (comparative).' },
    { id: 6, type: 'multiple-choice', instruction: "Asosiy qoidalar — oson", question: '"Bad" so\'zining superlative shaklini toping:', options: ['badder', 'the worst', 'the baddest', 'worse'], correct: 'the worst', explanation: 'Bad → noto\'g\'ri sifat → the worst (superlative).' },
    { id: 7, type: 'multiple-choice', instruction: "O'rtacha — qoidani qo'llash", question: 'She is ___ (tall) than her brother.', options: ['tall', 'taller', 'tallest', 'more tall'], correct: 'taller', explanation: 'Than bilan solishtirish → comparative: taller.' },
    { id: 8, type: 'multiple-choice', instruction: "O'rtacha — qoidani qo'llash", question: 'This is ___ (beautiful) city in the world.', options: ['the most beautiful', 'more beautiful', 'beautifulest', 'the beautifulest'], correct: 'the most beautiful', explanation: 'Beautiful → uzun sifat → the most beautiful.' },
    { id: 9, type: 'multiple-choice', instruction: "O'rtacha — qoidani qo'llash", question: 'She is ___ (happy) than before.', options: ['happyer', 'happier', 'more happy', 'happy'], correct: 'happier', explanation: 'Happy → -y bilan tugagan → y→i+er: happier.' },
    { id: 10, type: 'multiple-choice', instruction: "O'rtacha — qoidani qo'llash", question: 'This box is ___ (big) than that one.', options: ['bigger', 'more big', 'biger', 'biggest'], correct: 'bigger', explanation: 'Big → CVC → undosh ikki marta: bigger.' },
    { id: 11, type: 'multiple-choice', instruction: "O'rtacha — qoidani qo'llash", question: 'Which sentence is CORRECT?', options: ['She is more smarter', 'She is smarter', 'She is smartest', 'She is more smart'], correct: 'She is smarter', explanation: 'Smart qisqa sifat → smarter. More smarter = double comparative xato.' },
    { id: 12, type: 'multiple-choice', instruction: "O'rtacha — qoidani qo'llash", question: 'Uzbekistan is ___ (large) than Kazakhstan?', options: ['larger', 'more large', 'largest', 'more larger'], correct: 'larger', explanation: 'Large → -e bilan tugagan → larger. More large deyilmaydi.' },
    { id: 13, type: 'multiple-choice', instruction: "Qiyin — murakkab holatlar", question: 'Which sentence is correct?', options: ['She is the most cleverest', 'She is the cleverest', 'She is more cleverer', 'She is clever'], correct: 'She is the cleverest', explanation: 'Clever 2 bo\'g\'inli istisno → cleverest (most clever ham mumkin).' },
    { id: 14, type: 'multiple-choice', instruction: "Qiyin — murakkab holatlar", question: 'This road is ___ (narrow) than the highway.', options: ['narrower', 'more narrow', 'narrow', 'narrowest'], correct: 'narrower', explanation: 'Narrow 2 bo\'g\'inli → narrower (more narrow ham mumkin).' },
    { id: 15, type: 'multiple-choice', instruction: "Qiyin — murakkab holatlar", question: 'Which is correct? "First I eat, ___ I sleep."', options: ['than', 'then', 'from', 'after'], correct: 'then', explanation: 'Vaqt ketma-ketligi → then (keyin). Than = solishtirish.' },
    { id: 16, type: 'multiple-choice', instruction: "Qiyin — murakkab holatlar", question: 'This is ___ restaurant in town.', options: ['the best', 'the better', 'the goodest', 'the most best'], correct: 'the best', explanation: 'Good → the best (superlative). Most best xato.' },
    { id: 17, type: 'multiple-choice', instruction: "Qiyin — murakkab holatlar", question: 'My English is getting ___ (good) every day.', options: ['better', 'gooder', 'more good', 'best'], correct: 'better', explanation: 'Good → comparative: better. Getting better = yaxshilanmoqda.' },
    { id: 18, type: 'multiple-choice', instruction: "Qiyin — murakkab holatlar", question: 'Which is the superlative of "far"?', options: ['farthest', 'furthest', 'farest', 'both farthest and furthest'], correct: 'both farthest and furthest', explanation: 'Far → farther/further → farthest/furthest. Ikkisi ham to\'g\'ri.' },
    { id: 19, type: 'multiple-choice', instruction: "Murakkab — yuqori daraja", question: 'She speaks English ___ than before.', options: ['more fluently', 'fluentlier', 'most fluently', 'fluently'], correct: 'more fluently', explanation: 'Fluently ravish → more fluently. -ly bilan tugaganlar → more.' },
    { id: 20, type: 'multiple-choice', instruction: "Murakkab — yuqori daraja", question: 'Which sentence uses "as...as" correctly?', options: ['She is as tall as me', 'She is as taller as me', 'She is as more tall as me', 'She is as tallest as me'], correct: 'She is as tall as me', explanation: 'As + adj (base) + as. As taller/as more tall xato.' },
    { id: 21, type: 'multiple-choice', instruction: "Murakkab — yuqori daraja", question: 'This is by far ___ hotel in the city.', options: ['the best', 'better', 'the better', 'best'], correct: 'the best', explanation: 'By far + superlative: the best. Eng yuqori darajani kuchaytiradi.' },
    { id: 22, type: 'multiple-choice', instruction: "Murakkab — yuqori daraja", question: 'Which sentence contains a double comparative error?', options: ['She is more taller than me', 'She is taller than me', 'She is the tallest', 'She is as tall as me'], correct: 'She is more taller than me', explanation: 'More taller = double comparative. Faqat taller yoki more tall.' },
    { id: 23, type: 'multiple-choice', instruction: "Murakkab — yuqori daraja", question: 'The more you study, ___ your English becomes.', options: ['the better', 'better', 'the best', 'gooder'], correct: 'the better', explanation: 'The more... the better... → double comparative structure.' },
    { id: 24, type: 'multiple-choice', instruction: "Murakkab — yuqori daraja", question: 'She is the ___ (polite) person I have ever met.', options: ['politest', 'most polite', 'more polite', 'both politest and most polite'], correct: 'both politest and most polite', explanation: 'Polite 2 bo\'g\'inli istisno → politest va most polite ikkisi ham to\'g\'ri.' },
    { id: 25, type: 'multiple-choice', instruction: "Murakkab — yuqori daraja", question: 'Which sentence is grammatically correct?', options: ['He is the most richest', 'He is the richest', 'He is richer', 'He is more richer'], correct: 'He is the richest', explanation: 'Rich qisqa sifat → the richest (the + -est). Most richest xato.' },
  ],
  testSections: [
    { title: "Oson", desc: "Asosiy qoidalar — boshlang'ich test", color: 'bg-emerald-500', icon: '🌱', ids: [1, 2, 3, 4, 5, 6] },
    { title: "O'rtacha", desc: "Qoidani qo'llash — o'rganish", color: 'bg-blue-500', icon: '📘', ids: [7, 8, 9, 10, 11, 12] },
    { title: "Qiyin", desc: "Murakkab holatlar — tahlil", color: 'bg-violet-500', icon: '💪', ids: [13, 14, 15, 16, 17, 18] },
    { title: "Murakkab", desc: "Yuqori daraja — sinov", color: 'bg-rose-500', icon: '🏆', ids: [19, 20, 21, 22, 23, 24, 25] },
  ],
  // ═══════════════════════════════════════════════════════════════════════
  // BOSQICHLAR — 45 ta mashqni qismlarga bo'lib berish
  // ═══════════════════════════════════════════════════════════════════════
  exerciseSections: [
    { title: 'Boshlang\'ich', desc: 'Qisqa va uzun sifatlar, asosiy qoidalar', color: 'bg-emerald-500', icon: '🌱', ids: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10] },
    { title: 'Tayyorlov', desc: 'Fill-blank, error-correction — naqshni o\'rganish', color: 'bg-blue-500', icon: '📘', ids: [11, 12, 13, 14, 15, 16, 17, 18, 19, 20] },
    { title: 'Kuchaytirish', desc: 'Jadval to\'ldirish va qo\'shimcha mashqlar', color: 'bg-violet-500', icon: '💪', ids: [21, 22, 23, 24, 25, 26, 27, 28, 29, 30] },
    { title: 'Yuqori daraja', desc: 'Murakkab gaplar va nozik farqlar', color: 'bg-orange-500', icon: '🔥', ids: [31, 32, 33, 34, 35, 36, 37, 38, 39, 40] },
    { title: 'Yakuniy sinov', desc: '45 ta mashq — to\'liq test', color: 'bg-rose-500', icon: '🏆', ids: [41, 42, 43, 44, 45] },
  ],
  reading: {
    passage: "Tashkent vs Samarkand\n\nTashkent is bigger than Samarkand, but Samarkand is older than Tashkent. Tashkent is the largest city in Uzbekistan. It has more people than any other city. The population of Tashkent is about 3 million, while Samarkand has about 800,000 people. Samarkand is much more beautiful than Tashkent because of its history. Registan Square in Samarkand is one of the most beautiful places in the world.\n\nTashkent has more modern buildings than Samarkand. It has the biggest subway system in the country. However, Samarkand has more tourists than Tashkent because people want to see the old architecture. The weather in Tashkent is hotter than in Samarkand in summer, but Samarkand is colder in winter.\n\nPublic transport in Tashkent is better than in Samarkand. The taxi service is faster and cheaper. But the food in Samarkand is more delicious than in Tashkent. Samarkand is famous for its plov — it is the best plov in the whole country!",
    questions: [
      { id: 1, type: 'multiple-choice', question: 'Which city is bigger?', options: ['Samarkand', 'Tashkent', 'Both are the same', 'It is not mentioned'], correctIndex: 1, explanation: 'Tashkent is bigger than Samarkand.' },
      { id: 2, type: 'multiple-choice', question: 'Which city is older?', options: ['Tashkent', 'Samarkand', 'Both are the same', 'Neither is old'], correctIndex: 1, explanation: 'Samarkand is older than Tashkent.' },
      { id: 3, type: 'multiple-choice', question: 'What does the writer say about Registan Square?', options: ['It is in Tashkent', 'It is not beautiful', 'It is one of the most beautiful places', 'It is modern'], correctIndex: 2, explanation: 'Registan Square in Samarkand is one of the most beautiful places in the world.' },
      { id: 4, type: 'multiple-choice', question: 'Which city has more tourists?', options: ['Tashkent', 'Samarkand', 'Both have the same number', 'Neither has tourists'], correctIndex: 1, explanation: 'Samarkand has more tourists than Tashkent.' },
      { id: 5, type: 'multiple-choice', question: 'What is the best food in the country according to the text?', options: ['Tashkent shashlik', 'Samarkand plov', 'Both are equal', 'Bread'], correctIndex: 1, explanation: 'Samarkand is famous for its plov — it is the best plov in the whole country.' },
    ],
  },
  writing: {
    prompt: 'Compare your hometown with another city you know. Write about their size, weather, food, transport, and beauty. Use comparatives and superlatives.',
    wordLimit: 150,
    tips: [
      'Use "than" for comparisons: "My city is bigger than..."',
      'Use "the most" / "the -est" for superlatives: "the most beautiful", "the hottest"',
      'Write at least 4 sentences comparing different things',
      'Check your spelling and grammar before finishing',
    ],
  },
  listening: {
    transcript: "Ali: Hey, I moved to a new neighbourhood last month!\n\nBobur: Really? Is it better than your old one?\n\nAli: Yes, it's much better. The new flat is bigger than the old one.\n\nBobur: That's great! Is the rent more expensive?\n\nAli: Actually, it's cheaper! I found a very good deal.\n\nBobur: Wow, you are so lucky. What about the area? Is it quieter than before?\n\nAli: Yes, the street is quieter. But the neighbours are louder. They have a big dog!\n\nBobur: Oh no! Is the dog the biggest problem?\n\nAli: Yes, it barks every night. But everything else is better. The supermarket is closer, the park is cleaner, and the people are friendlier.\n\nBobur: That sounds nice. Maybe I should move too!\n\nAli: You should! It's the best decision I made this year.",
    questions: [
      { id: 1, type: 'multiple-choice', question: "Is Ali's new flat bigger or smaller than the old one?", options: ['Smaller', 'Bigger', 'Same size', 'Much smaller'], correctIndex: 1, explanation: 'Ali says: "The new flat is bigger than the old one."' },
      { id: 2, type: 'multiple-choice', question: 'Is the new rent more expensive or cheaper?', options: ['More expensive', 'Cheaper', 'Same price', 'Free'], correctIndex: 1, explanation: 'Ali says: "It\'s cheaper!"' },
      { id: 3, type: 'multiple-choice', question: "What is the biggest problem in Ali's new neighbourhood?", options: ['The street is noisy', 'The neighbours have a loud dog', 'The supermarket is far', 'The park is dirty'], correctIndex: 1, explanation: 'Ali says the dog barks every night.' },
      { id: 4, type: 'multiple-choice', question: 'Which is NOT true about the new neighbourhood?', options: ['The supermarket is closer', 'The park is cleaner', 'The people are friendlier', 'The street is louder'], correctIndex: 3, explanation: 'Ali says the street is quieter, not louder.' },
      { id: 5, type: 'multiple-choice', question: "What does Ali call this move?", options: ['A big mistake', 'The worst decision', 'The best decision this year', 'An expensive choice'], correctIndex: 2, explanation: 'Ali says: "It\'s the best decision I made this year."' },
    ],
  },
  dialogues: [
    {
      id: 'comparatives-shop',
      title: 'Choosing a New Phone',
      context: 'Aziza and Kamola are at an electronics store comparing phones.',
      lines: [
        { speaker: 'Aziza', text: 'Look at these two phones. Which one do you like?', translation: 'Bu ikki telefonga qarang. Qaysi biri sizga yoqadi?' },
        { speaker: 'Kamola', text: 'The red one is more attractive than the black one.', translation: 'Qizili qorasidan ko\'ra chiroyliroq.' },
        { speaker: 'Aziza', text: 'But the black one is cheaper. It\'s the most affordable option.', translation: 'Lekin qorasi arzonroq. Bu eng arzon variant.' },
        { speaker: 'Kamola', text: 'Is the red one better quality?', translation: 'Qizili sifati yaxshiroqmi?' },
        { speaker: 'Aziza', text: 'Yes, it has a better camera and a bigger screen. The camera is the best in its class!', translation: 'Ha, kamerasi yaxshiroq va ekrani kattaroq. Kamera esa o\'z sinfidagi eng yaxshisi!' },
        { speaker: 'Kamola', text: 'Then the red one is a much better choice, even if it\'s more expensive.', translation: 'Unda qizili ancha yaxshi tanlov, qimmatroq bo\'lsa ham.' },
      ],
    },
    {
      id: 'comparatives-travel',
      title: 'Comparing Cities',
      context: 'Rustam and his friend Madina are discussing which city to visit for the holidays.',
      lines: [
        { speaker: 'Rustam', text: 'I want to go somewhere fun. Should we go to Samarkand or Bukhara?', translation: 'Qiziqarli joyga bormoqchiman. Samarqandga yoki Buxoroga boraylikmi?' },
        { speaker: 'Madina', text: 'Samarkand is more beautiful than Bukhara. It has the most famous historical sites.', translation: 'Samarqand Buxorodan chiroyliroq. U eng mashhur tarixiy joylarga ega.' },
        { speaker: 'Rustam', text: 'But Bukhara is quieter and less crowded. I prefer quieter places.', translation: 'Lekin Buxoro tinchroq va kam olomon. Men tinchroq joylarni afzal ko\'raman.' },
        { speaker: 'Madina', text: 'You\'re right. And the journey to Bukhara is shorter than to Samarkand.', translation: 'To\'g\'ri aytasiz. Buxoroga sayohat Samarqanddan qisqaroq.' },
        { speaker: 'Rustam', text: 'But the food in Samarkand is much tastier! Their plov is the best in Uzbekistan.', translation: 'Lekin Samarqandda ovqat ancha mazali! Ularning palovi O\'zbekistondagi eng yaxshisi.' },
        { speaker: 'Madina', text: 'OK, let\'s go to Samarkand then. You convinced me!', translation: 'Mayli, unda Samarqandga boraylik. Ishonch hosil qildingiz!' },
      ],
    },
  ],
  culturalNotes: [
    {
      id: 'comp-culture-sport',
      title: 'Comparing Everything',
      description: 'Uzbek people love to compare things — from the best plov in town to the fastest driver in the family. It\'s common to hear phrases like "Eng yaxshi" (the best) and "Bundan yaxshiroq" (better than this) in daily conversations, especially when discussing food, sports, and local products.',
      icon: '🇺🇿',
      category: 'culture',
    },
    {
      id: 'comp-etymology',
      title: 'Why "Better" and Not "Gooder"?',
      description: 'The words "better" and "best" come from Old English "betera" and "betst". They have been irregular for over 1,000 years! Similarly, "worse" and "worst" come from "wyrsa". These are the oldest surviving irregular comparatives in the English language.',
      icon: '📜',
      category: 'etymology',
    },
    {
      id: 'comp-usage-double',
      title: 'Double Comparatives Are Everywhere',
      description: 'Even native speakers sometimes make the mistake of using double comparatives like "more better" in casual speech. However, in formal writing and exams, it is considered incorrect. Always choose either "more" OR "-er", never both!',
      icon: '⚠️',
      category: 'usage',
    },
    {
      id: 'comp-funfact-superlative',
      title: 'The Most Used Superlative',
      description: 'The most commonly used superlative in English is "the best". It appears about 10 times more often than "the worst" in everyday conversation. People naturally focus on what\'s good rather than what\'s bad!',
      icon: '💡',
      category: 'fun-fact',
    },
  ],
}

export interface ReviewLesson {
  id: string
  type: 'review'
  title: string
  subtitle: string
  level: string
  day?: number           // progressSlice lessons array'idagi ketma-ket raqam (loadAllLessons tomonidan beriladi)
  afterDay: number
  coversDays: number[]
  coversTopics: string[]
  keyRules?: { topic: string; icon: string; color: string; rules: string[] }[]
  exercises: DailyExercise[]
  exerciseSections: { title: string; desc: string; color: string; icon: string; ids: number[] }[]
  tests: DailyExercise[]
  testSections: { title: string; desc: string; color: string; icon: string; ids: number[] }[]
}

export async function loadAllLessons(): Promise<(DailyLesson | ReviewLesson)[]> {
  const [
    { A1_LESSONS_NEW },
    { A2_LESSONS },
    { B1_LESSONS_NEW },
    { B1PLUS_LESSONS_NEW },
    { B2_LESSONS_NEW },
    { REVIEW_LESSONS },
  ] = await Promise.all([
    import('./daily'),
    import('./daily/lessonsA2'),
    import('./daily/lessonsB1'),
    import('./daily/lessonsB1plus'),
    import('./daily/lessonsB2'),
    import('./daily/reviewLessons'),
  ])

  // Har bir daraja massivi endi o'z zamonlarini va comparatives ni o'z ichiga oladi
  // (pedagogik tartibda singdirilgan) — bu yerda faqat darajalarni ketma-ket ulaymiz
  const regularLessons: DailyLesson[] = [
    ...A1_LESSONS_NEW,
    ...A2_LESSONS,
    ...B1_LESSONS_NEW,
    ...B1PLUS_LESSONS_NEW,
    ...B2_LESSONS_NEW,
  ]

  // REVIEW_LESSONS larni "regular" KETMA-KETLIK POZITSIYASI bo'yicha joylashtirish.
  // coversDays = regular (review'siz) ketma-ketlikdagi pozitsiyalar (1..N), shuning
  // uchun review max(coversDays)-pozitsiyali darsdan KEYIN chiqadi.
  // (Oldin lesson.day — manba qiymati — ishlatilardi; u final pozitsiyaga teng emas edi.)
  const reviewsByPos = new Map<number, ReviewLesson[]>()
  for (const review of REVIEW_LESSONS) {
    const pos = Math.max(...review.coversDays)
    if (!reviewsByPos.has(pos)) reviewsByPos.set(pos, [])
    reviewsByPos.get(pos)!.push(review)
  }

  const result: (DailyLesson | ReviewLesson)[] = []
  regularLessons.forEach((lesson, idx) => {
    result.push(lesson)
    const reviews = reviewsByPos.get(idx + 1)
    if (reviews) result.push(...reviews)
  })

  // Agar biror review ning coversDays dagi max day oddiy darslar orasida topilmasa,
  // uni eng oxiriga qo'shamiz
  const placedIds = new Set(result.filter((r): r is ReviewLesson => 'type' in r && r.type === 'review').map(r => r.id))
  for (const review of REVIEW_LESSONS) {
    if (!placedIds.has(review.id)) {
      result.push(review)
    }
  }

  // Ketma-ket day raqamlari — review darslari va oddiy darslar bir xil raqamlanadi
  return result.map((item, index) => ({ ...item, day: index + 1 })) as (DailyLesson | ReviewLesson)[]
}
