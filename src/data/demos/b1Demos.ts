// ═══════════════════════════════════════════════════════════════════════════
// B1 darajadagi barcha grammatika darslari uchun namunaviy (demo) darslar.
// Falsafa: bitta mahorat, induktiv, kontekstli, "Siz"-fokusli, BOY kontent.
// Har bir dars: kontekst → izoh → misollar → so'zlar → mashqlar → qoida → xulosa
// Kalit = asl dars id (DEMO_LESSONS bilan mos). SRS avtomatik ishlaydi.
// ═══════════════════════════════════════════════════════════════════════════

import type { DemoLesson } from '../lessonDemoContent'

// ─── 1. Present Perfect Continuous ──────────────────────────────────────────
const PRESENT_PERFECT_CONTINUOUS: DemoLesson = {
  id: 'present-perfect-continuous-demo',
  skill: 'Present Perfect Continuous — davom etayotgan harakat va natija',
  level: 'B1',
  emoji: '🔁',
  context: {
    text: "Tasavvur qiling — do'stingiz qo'llaringiz iflosligini ko'rib so'rayapti: \"Nima qilyapsan?\" Siz: \"Ertalabdan beri bog'da ISHLAYAPMAN\" deysiz — harakat o'tmishda boshlangan va hali davom etyapti. Keling, Present Perfect Continuous'ni o'rganamiz!",
    location: 'Real vaziyat · Davomli ish',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "have/has been + fe'l + ing — o'tmishdan hozirgacha davom etgan harakat",
      "Davomiylik yoki natija ko'rinadigan paytda ishlatiladi",
      "for / since bilan: I have been waiting for an hour",
      "Present Perfect (natija) vs Continuous (jarayon) farqi",
    ],
  },
  examples: [
    { en: 'I have been working all day.',      uz: 'Men kun bo\'yi ishlayapman.',          key: 'have been working' },
    { en: 'She has been studying for hours.',  uz: 'U soatlab o\'qiyapti.',                key: 'has been studying' },
    { en: 'How long have you been waiting?',   uz: 'Qancha vaqtdan beri kutyapsiz?',        key: 'have you been' },
    { en: "It has been raining since morning.",uz: 'Ertalabdan beri yomg\'ir yog\'yapti.', key: 'has been raining' },
  ],
  vocab: [
    { en: 'have been + ing', uz: 'davom etib kelmoqda', emoji: '🔁', example: 'I have been reading.' },
    { en: 'for',      uz: 'davomida (muddat)', emoji: '📏', example: 'for two hours' },
    { en: 'since',    uz: 'beri (nuqta)',      emoji: '📅', example: 'since 9 am' },
    { en: 'all day',  uz: 'kun bo\'yi',        emoji: '☀️', example: 'working all day' },
    { en: 'lately',   uz: 'so\'nggi paytda',   emoji: '🕐', example: 'feeling tired lately' },
    { en: 'how long', uz: 'qancha vaqtdan beri', emoji: '⏳', example: 'How long...?' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'have been', uz: 'davom etmoqda' }, { en: 'for', uz: 'muddat' }, { en: 'since', uz: 'nuqta' }, { en: 'how long', uz: 'qancha vaqtdan beri' }], explanation: "Present Perfect Continuous asoslari." },
    { type: 'choose', sentence: 'I ___ working since 8 am.', options: ['have been', 'have', 'am'], correct: 'have been', uz: 'Men soat 8 dan beri ishlayapman.', explanation: "have been + ing — davomli, hozirgacha." },
    { type: 'choose', sentence: 'She has been ___ for two hours.', options: ['studying', 'study', 'studied'], correct: 'studying', uz: 'U ikki soatdan beri o\'qiyapti.', explanation: "has been + V-ing (studying)." },
    { type: 'judge', sentence: 'I have been work all day.', isCorrect: false, explanation: "Noto'g'ri! V-ing kerak: 'I have been working all day'." },
    { type: 'build', uz: 'Ertalabdan beri yomg\'ir yog\'yapti.', words: ['It', 'has', 'been', 'raining', 'since', 'morning'], correct: ['It', 'has', 'been', 'raining', 'since', 'morning'], explanation: "has been + raining + since (nuqta)." },
    { type: 'choose', sentence: 'They ___ been living here for years.', options: ['have', 'has', 'are'], correct: 'have', uz: 'Ular yillardan beri shu yerda yashashyapti.', explanation: "They → have been living." },
    { type: 'choose', sentence: 'How long ___ you been learning English?', options: ['have', 'has', 'do'], correct: 'have', uz: 'Qancha vaqtdan beri ingliz tili o\'rganasiz?', explanation: "Savol: How long have you been + ing?" },
    { type: 'judge', sentence: 'He has been waiting for an hour.', isCorrect: true, explanation: "To'g'ri! has been + waiting + for (muddat). Mukammal!" },
    { type: 'choose', sentence: 'My eyes hurt. I ___ reading all day.', options: ['have been', 'have', 'had'], correct: 'have been', uz: 'Ko\'zlarim og\'riyapti. Kun bo\'yi o\'qidim.', explanation: "Natija ko'rinadi (charchoq) → have been reading." },
    { type: 'build', uz: 'Men sizni soatlab kutyapman.', words: ['I', 'have', 'been', 'waiting', 'for', 'hours'], correct: ['I', 'have', 'been', 'waiting', 'for', 'hours'], explanation: "have been + waiting + for (muddat)." },
    { type: 'judge', sentence: 'She has been studied since morning.', isCorrect: false, explanation: "Noto'g'ri! V-ing: 'has been studying' (studied emas)." },
    { type: 'choose', sentence: 'We ___ been travelling for a month.', options: ['have', 'has', 'are'], correct: 'have', uz: 'Biz bir oydan beri sayohat qilyapmiz.', explanation: "We → have been travelling." },
    { type: 'choose', sentence: 'It has been ___ since Monday.', options: ['snowing', 'snow', 'snowed'], correct: 'snowing', uz: 'Dushanbadan beri qor yog\'yapti.', explanation: "has been + V-ing (snowing)." },
    { type: 'build', uz: 'U so\'nggi paytda yomon his qilyapti.', words: ['She', 'has', 'been', 'feeling', 'ill', 'lately'], correct: ['She', 'has', 'been', 'feeling', 'ill', 'lately'], explanation: "has been + feeling + lately. Mukammal yakun!" },
  ],
  rule: {
    title: 'Present Perfect Continuous — to\'liq qoida',
    body: "O'tmishda boshlanib HOZIRgacha davom etgan (yoki yaqinda tugagan) harakat.\n\n✅ Tuzilishi: have/has + been + V-ing\n   • I/you/we/they → have been\n   • he/she/it → has been\n   • I have been working · She has been studying\n\n🔑 Qachon ishlatiladi:\n   • Davomiylikni ta'kidlash: I've been waiting for an hour.\n   • Natija/asar ko'rinadi: I'm tired — I've been running.\n\n📏 for / since bilan:\n   • for + muddat: for two hours\n   • since + nuqta: since morning\n\n🆚 Present Perfect bilan farqi:\n   • have done → NATIJA (I've written 3 emails)\n   • have been doing → JARAYON (I've been writing emails)",
  },
  summary: [
    "have/has been + V-ing (davomli, hozirgacha)",
    "Davomiylik yoki ko'rinadigan natija uchun",
    "for (muddat) · since (nuqta)",
    "have been doing (jarayon) vs have done (natija)",
  ],
}

// ─── 2. Past Perfect ────────────────────────────────────────────────────────
const PAST_PERFECT: DemoLesson = {
  id: 'past-perfect-demo',
  skill: 'Past Perfect — o\'tmishdan oldingi o\'tmish',
  level: 'B1',
  emoji: '⏮️',
  context: {
    text: "Tasavvur qiling — kechagi voqeani aytyapsiz: \"Men vokzalga yetib kelganimda, poyezd ALLAQACHON KETGAN EDI\". Bir ish boshqasidan oldin sodir bo'lgan. Keling, o'tmishdagi ikki voqea tartibini ifodalashni o'rganamiz!",
    location: 'Real vaziyat · Kechagi voqea',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Past Perfect — o'tmishdagi ikki harakatdan BIRINCHISI",
      "Tuzilishi: had + fe'lning 3-shakli (V3)",
      "Ko'pincha when, before, after, by the time bilan",
      "The train had left when I arrived (avval ketgan)",
    ],
  },
  examples: [
    { en: 'The train had left when I arrived.', uz: 'Men kelganimda poyezd ketgan edi.',   key: 'had left' },
    { en: 'She had finished before he came.',   uz: 'U kelishidan oldin u tugatgan edi.',  key: 'had finished' },
    { en: 'I had never seen snow before.',      uz: 'Men avval hech qor ko\'rmagan edim.', key: 'had seen' },
    { en: 'They had eaten by 8 pm.',            uz: 'Ular soat 8 ga ovqatlanib bo\'lgan edilar.', key: 'had eaten' },
  ],
  vocab: [
    { en: 'had + V3', uz: 'qilgan edi (oldin)', emoji: '⏮️', example: 'had gone' },
    { en: 'before',   uz: 'oldin',              emoji: '⬅️', example: 'before he came' },
    { en: 'after',    uz: 'keyin',              emoji: '➡️', example: 'after she left' },
    { en: 'by the time', uz: 'paytiga kelib',   emoji: '⏰', example: 'by the time I arrived' },
    { en: 'already',  uz: 'allaqachon',         emoji: '✅', example: 'had already gone' },
    { en: 'just',     uz: 'hozirgina (o\'shanda)', emoji: '⏱️', example: 'had just left' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'had gone', uz: 'ketgan edi' }, { en: 'before', uz: 'oldin' }, { en: 'after', uz: 'keyin' }, { en: 'by the time', uz: 'paytiga kelib' }], explanation: "Past Perfect asoslari." },
    { type: 'choose', sentence: 'When I arrived, the train ___ left.', options: ['had', 'has', 'have'], correct: 'had', uz: 'Men kelganimda poyezd ketgan edi.', explanation: "Avval bo'lgan ish → had + left (V3)." },
    { type: 'choose', sentence: 'She had ___ before he came.', options: ['finished', 'finish', 'finishing'], correct: 'finished', uz: 'U kelishidan oldin tugatgan edi.', explanation: "had + V3 (finished)." },
    { type: 'judge', sentence: 'I had saw that film before.', isCorrect: false, explanation: "Noto'g'ri! V3 kerak: 'I had seen that film' (saw → seen)." },
    { type: 'build', uz: 'Ular soat 8 ga ovqatlanib bo\'lgan edilar.', words: ['They', 'had', 'eaten', 'by', '8', 'pm'], correct: ['They', 'had', 'eaten', 'by', '8', 'pm'], explanation: "had + eaten (V3) + by (paytiga kelib)." },
    { type: 'choose', sentence: 'I had never ___ sushi before that day.', options: ['eaten', 'ate', 'eat'], correct: 'eaten', uz: 'O\'sha kungacha men hech sushi yemagan edim.', explanation: "had never + V3 (eaten)." },
    { type: 'choose', sentence: 'By the time we got there, the show ___ started.', options: ['had', 'has', 'was'], correct: 'had', uz: 'Biz yetib borganimizda, shou boshlanib bo\'lgan edi.', explanation: "Avvalroq sodir → had started." },
    { type: 'judge', sentence: 'He had already left when she called.', isCorrect: true, explanation: "To'g'ri! had already + left (V3). Mukammal!" },
    { type: 'choose', sentence: 'After she ___ finished, she went home.', options: ['had', 'has', 'was'], correct: 'had', uz: 'U tugatgandan keyin uyga ketdi.', explanation: "Avvalgi ish → had finished, keyin went." },
    { type: 'build', uz: 'Men kalitni yo\'qotganimni angladim.', words: ['I', 'realised', 'I', 'had', 'lost', 'the', 'key'], correct: ['I', 'realised', 'I', 'had', 'lost', 'the', 'key'], explanation: "realised (keyin) — had lost (avval)." },
    { type: 'judge', sentence: 'When I got home, my brother had cook dinner.', isCorrect: false, explanation: "Noto'g'ri! V3: 'had cooked dinner' (cook → cooked)." },
    { type: 'choose', sentence: 'The room was empty. Everyone ___ gone.', options: ['had', 'has', 'have'], correct: 'had', uz: 'Xona bo\'sh edi. Hamma ketgan edi.', explanation: "Avval bo'lgan → had gone (V3)." },
    { type: 'choose', sentence: 'She had ___ the book before the film came out.', options: ['read', 'readed', 'reading'], correct: 'read', uz: 'U film chiqishidan oldin kitobni o\'qigan edi.', explanation: "read → read (V3 bir xil yoziladi, 'red' o'qiladi)." },
    { type: 'build', uz: 'U kelishidan oldin biz allaqachon ketgan edik.', words: ['We', 'had', 'already', 'left', 'before', 'he', 'arrived'], correct: ['We', 'had', 'already', 'left', 'before', 'he', 'arrived'], explanation: "had already left (avval), before he arrived. Mukammal yakun!" },
  ],
  rule: {
    title: 'Past Perfect — to\'liq qoida',
    body: "Past Perfect — o'tmishdagi ikki harakatdan AVVAL sodir bo'lganini bildiradi.\n\n✅ Tuzilishi: had + V3 (3-shakl)\n   • barcha shaxslar uchun bir xil: had\n   • I had gone · She had finished\n\n🔑 Ikki o'tmish voqeasi tartibi:\n   • The train HAD LEFT (1-avval) when I ARRIVED (2-keyin).\n   • avvalgi ish → Past Perfect (had + V3)\n   • keyingi ish → Simple Past\n\n🕐 Belgilar: before, after, by the time,\n   when, already, just, never\n\n📝 V3: go→gone · see→seen · eat→eaten\n   write→written · do→done · leave→left",
  },
  summary: [
    "had + V3 (o'tmishdan oldingi o'tmish)",
    "Avvalgi ish → Past Perfect, keyingi → Simple Past",
    "The train had left when I arrived",
    "before, after, by the time, already bilan",
  ],
}

// ─── 3. Past Perfect Continuous ─────────────────────────────────────────────
const PAST_PERFECT_CONTINUOUS: DemoLesson = {
  id: 'past-perfect-continuous-demo',
  skill: 'Past Perfect Continuous — o\'tmishgacha davom etgan harakat',
  level: 'B1',
  emoji: '⏳',
  context: {
    text: "Tasavvur qiling — sababini tushuntiryapsiz: \"U charchagan edi, chunki uzoq vaqt YUGURAYOTGAN EDI\". O'tmishdagi bir lahzagacha davom etgan harakat. Keling, Past Perfect Continuous'ni o'rganamiz!",
    location: 'Real vaziyat · Sababni tushuntirish',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "had been + fe'l + ing — o'tmishdagi nuqtagacha davom etgan harakat",
      "Ko'pincha natija/sababni tushuntiradi (charchoq, ho'llik)",
      "for / since bilan davomiylik: had been waiting for an hour",
      "Past Perfect (had done) vs Continuous (had been doing)",
    ],
  },
  examples: [
    { en: 'He was tired because he had been running.', uz: 'U charchagan edi, chunki yugurayotgan edi.', key: 'had been running' },
    { en: 'I had been waiting for an hour.',     uz: 'Men bir soat kutayotgan edim.',          key: 'had been waiting' },
    { en: 'The ground was wet; it had been raining.', uz: 'Yer ho\'l edi; yomg\'ir yog\'ayotgan edi.', key: 'had been raining' },
    { en: 'She had been studying before the exam.', uz: 'U imtihondan oldin o\'qiyotgan edi.',  key: 'had been studying' },
  ],
  vocab: [
    { en: 'had been + ing', uz: 'davom etayotgan edi', emoji: '⏳', example: 'had been working' },
    { en: 'because',  uz: 'chunki',            emoji: '🔗', example: 'tired because...' },
    { en: 'for',      uz: 'davomida',          emoji: '📏', example: 'for two hours' },
    { en: 'since',    uz: 'beri',              emoji: '📅', example: 'since noon' },
    { en: 'exhausted',uz: 'holdan toygan',     emoji: '😫', example: 'felt exhausted' },
    { en: 'wet',      uz: 'ho\'l',             emoji: '💧', example: 'the ground was wet' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'had been', uz: 'davom etayotgan edi' }, { en: 'because', uz: 'chunki' }, { en: 'for', uz: 'muddat' }, { en: 'exhausted', uz: 'holdan toygan' }], explanation: "Past Perfect Continuous asoslari." },
    { type: 'choose', sentence: 'He was tired because he ___ been working.', options: ['had', 'has', 'was'], correct: 'had', uz: 'U charchagan edi, chunki ishlayotgan edi.', explanation: "had been + working — o'tmishgacha davom." },
    { type: 'choose', sentence: 'I had been ___ for an hour.', options: ['waiting', 'wait', 'waited'], correct: 'waiting', uz: 'Men bir soat kutayotgan edim.', explanation: "had been + V-ing (waiting)." },
    { type: 'judge', sentence: 'She had been study all night.', isCorrect: false, explanation: "Noto'g'ri! V-ing: 'had been studying all night'." },
    { type: 'build', uz: 'Yer ho\'l edi; yomg\'ir yog\'ayotgan edi.', words: ['The', 'ground', 'was', 'wet', 'it', 'had', 'been', 'raining'], correct: ['The', 'ground', 'was', 'wet', 'it', 'had', 'been', 'raining'], explanation: "Natija (ho'l) sababi → had been raining." },
    { type: 'choose', sentence: 'They were hungry; they ___ been travelling all day.', options: ['had', 'has', 'were'], correct: 'had', uz: 'Ular och edilar; kun bo\'yi sayohat qilayotgan edilar.', explanation: "had been + travelling." },
    { type: 'choose', sentence: 'How long ___ you been waiting before the bus came?', options: ['had', 'have', 'did'], correct: 'had', uz: 'Avtobus kelishidan oldin qancha kutayotgan edingiz?', explanation: "O'tmish savoli: How long had you been + ing?" },
    { type: 'judge', sentence: 'He had been driving for hours, so he was tired.', isCorrect: true, explanation: "To'g'ri! had been driving (sabab) → tired (natija). Mukammal!" },
    { type: 'choose', sentence: 'Her eyes were red. She ___ been crying.', options: ['had', 'has', 'was'], correct: 'had', uz: 'Ko\'zlari qizargan edi. U yig\'layotgan edi.', explanation: "Natija (qizil ko'z) → had been crying." },
    { type: 'build', uz: 'Men imtihondan oldin soatlab o\'qiyotgan edim.', words: ['I', 'had', 'been', 'studying', 'for', 'hours'], correct: ['I', 'had', 'been', 'studying', 'for', 'hours'], explanation: "had been + studying + for." },
    { type: 'judge', sentence: 'We had been waited a long time.', isCorrect: false, explanation: "Noto'g'ri! V-ing: 'had been waiting'." },
    { type: 'choose', sentence: 'The players were muddy; they ___ been playing football.', options: ['had', 'has', 'were'], correct: 'had', uz: 'O\'yinchilar loyga belangan edi; futbol o\'ynayotgan edilar.', explanation: "had been + playing." },
    { type: 'choose', sentence: 'She had been ___ in London before she moved.', options: ['living', 'live', 'lived'], correct: 'living', uz: 'U ko\'chishdan oldin Londonda yashayotgan edi.', explanation: "had been + V-ing (living)." },
    { type: 'build', uz: 'U holdan toygan edi, chunki uzoq yugurayotgan edi.', words: ['He', 'was', 'exhausted', 'because', 'he', 'had', 'been', 'running'], correct: ['He', 'was', 'exhausted', 'because', 'he', 'had', 'been', 'running'], explanation: "exhausted (natija) because had been running. Mukammal yakun!" },
  ],
  rule: {
    title: 'Past Perfect Continuous — to\'liq qoida',
    body: "O'tmishdagi bir nuqtagacha DAVOM etgan harakat (ko'pincha sababni tushuntiradi).\n\n✅ Tuzilishi: had been + V-ing\n   • barcha shaxslar uchun: had been\n   • I had been working · She had been waiting\n\n🔑 Qachon ishlatiladi:\n   • Natija/sababni tushuntirish:\n     He was tired because he had been running.\n     The ground was wet; it had been raining.\n   • Davomiylik (for/since): had been waiting for an hour\n\n🆚 Past Perfect bilan farqi:\n   • had done → tugagan natija (had run 5 km)\n   • had been doing → jarayon (had been running)",
  },
  summary: [
    "had been + V-ing (o'tmishgacha davom)",
    "Ko'pincha sabab/natijani tushuntiradi",
    "He was tired because he had been running",
    "had been doing (jarayon) vs had done (natija)",
  ],
}

// ─── 4. Future Continuous ───────────────────────────────────────────────────
const FUTURE_CONTINUOUS: DemoLesson = {
  id: 'future-continuous-demo',
  skill: 'Future Continuous — kelajakda davom etadigan harakat',
  level: 'B1',
  emoji: '🔮',
  context: {
    text: "Tasavvur qiling — do'stingiz ertaga qo'ng'iroq qilmoqchi. Siz: \"Ertaga soat 10 da men UCHIB KETAYOTGAN BO'LAMAN\" deysiz — kelajakning aniq lahzasida davom etadigan harakat. Keling, Future Continuous'ni o'rganamiz!",
    location: 'Real vaziyat · Kelajak rejasi',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "will be + fe'l + ing — kelajakning bir lahzasida davom etadigan harakat",
      "At 10 am tomorrow I will be flying (o'sha paytda jarayonda)",
      "Muloyim savol uchun ham: Will you be using the car?",
      "Simple Future (will do) vs Continuous (will be doing) farqi",
    ],
  },
  examples: [
    { en: 'This time tomorrow I will be flying.', uz: 'Ertaga shu paytda men uchib ketayotgan bo\'laman.', key: 'will be flying' },
    { en: 'She will be working at 9 am.',         uz: 'U soat 9 da ishlayotgan bo\'ladi.',     key: 'will be working' },
    { en: 'Will you be using the car tonight?',   uz: 'Bugun kechqurun mashinani ishlatasizmi?', key: 'Will you be' },
    { en: "They will be waiting for us.",         uz: 'Ular bizni kutayotgan bo\'lishadi.',     key: 'will be waiting' },
  ],
  vocab: [
    { en: 'will be + ing', uz: 'qilayotgan bo\'ladi', emoji: '🔮', example: 'will be working' },
    { en: 'this time tomorrow', uz: 'ertaga shu paytda', emoji: '⏰', example: 'this time tomorrow' },
    { en: 'at 9 am',  uz: 'soat 9 da',         emoji: '🕘', example: 'at 9 am' },
    { en: 'soon',     uz: 'tez orada',         emoji: '⏩', example: 'see you soon' },
    { en: 'all evening', uz: 'kechqurun bo\'yi',emoji: '🌙', example: 'all evening' },
    { en: 'on the way', uz: 'yo\'lda',         emoji: '🛣️', example: 'on the way home' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'will be', uz: 'qilayotgan bo\'ladi' }, { en: 'this time tomorrow', uz: 'ertaga shu paytda' }, { en: 'soon', uz: 'tez orada' }, { en: 'all evening', uz: 'kechqurun bo\'yi' }], explanation: "Future Continuous asoslari." },
    { type: 'choose', sentence: 'At 10 tomorrow, I ___ be flying.', options: ['will', 'am', 'have'], correct: 'will', uz: 'Ertaga soat 10 da men uchib ketayotgan bo\'laman.', explanation: "will be + flying — kelajak lahzasida jarayon." },
    { type: 'choose', sentence: 'She will be ___ at 9 am.', options: ['working', 'work', 'worked'], correct: 'working', uz: 'U soat 9 da ishlayotgan bo\'ladi.', explanation: "will be + V-ing (working)." },
    { type: 'judge', sentence: 'I will be cook dinner at 7.', isCorrect: false, explanation: "Noto'g'ri! V-ing: 'I will be cooking dinner at 7'." },
    { type: 'build', uz: 'Ular bizni kutayotgan bo\'lishadi.', words: ['They', 'will', 'be', 'waiting', 'for', 'us'], correct: ['They', 'will', 'be', 'waiting', 'for', 'us'], explanation: "will be + waiting (V-ing)." },
    { type: 'choose', sentence: '___ you be using the car tonight?', options: ['Will', 'Do', 'Are'], correct: 'Will', uz: 'Bugun kechqurun mashinani ishlatasizmi?', explanation: "Muloyim savol: Will you be + ing?" },
    { type: 'choose', sentence: 'This time next week we ___ be relaxing on a beach.', options: ['will', 'are', 'have'], correct: 'will', uz: 'Kelasi hafta shu paytda biz plyajda dam olayotgan bo\'lamiz.', explanation: "will be + relaxing." },
    { type: 'judge', sentence: 'I will be working all evening.', isCorrect: true, explanation: "To'g'ri! will be + working (V-ing). Mukammal!" },
    { type: 'choose', sentence: 'Don\'t call at 8 — I ___ be having dinner.', options: ['will', 'am', 'do'], correct: 'will', uz: 'Soat 8 da qo\'ng\'iroq qilmang — men ovqatlanayotgan bo\'laman.', explanation: "will be + having." },
    { type: 'build', uz: 'U ertaga butun kun dars berayotgan bo\'ladi.', words: ['She', 'will', 'be', 'teaching', 'all', 'day'], correct: ['She', 'will', 'be', 'teaching', 'all', 'day'], explanation: "will be + teaching (V-ing)." },
    { type: 'judge', sentence: 'Will you be join us tonight?', isCorrect: false, explanation: "Noto'g'ri! V-ing: 'Will you be joining us tonight?'" },
    { type: 'choose', sentence: 'At midnight they ___ be travelling.', options: ['will', 'are', 'have'], correct: 'will', uz: 'Yarim tunda ular sayohat qilayotgan bo\'lishadi.', explanation: "will be + travelling." },
    { type: 'choose', sentence: 'I ___ be thinking of you.', options: ['will', 'am', 'do'], correct: 'will', uz: 'Men sizni o\'ylab turaman.', explanation: "will be + thinking." },
    { type: 'build', uz: 'Ertaga shu paytda men uchib ketayotgan bo\'laman.', words: ['This', 'time', 'tomorrow', 'I', 'will', 'be', 'flying'], correct: ['This', 'time', 'tomorrow', 'I', 'will', 'be', 'flying'], explanation: "will be + flying. Mukammal yakun!" },
  ],
  rule: {
    title: 'Future Continuous — to\'liq qoida',
    body: "Future Continuous — kelajakning bir LAHZASIDA davom etadigan harakat.\n\n✅ Tuzilishi: will be + V-ing\n   • barcha shaxslar uchun: will be\n   • I will be working · She will be flying\n\n🔑 Qachon ishlatiladi:\n   • Kelajakdagi aniq paytda jarayon:\n     At 10 am I will be flying.\n     This time tomorrow we'll be relaxing.\n   • Muloyim savol: Will you be using the car?\n\n🆚 Simple Future bilan farqi:\n   • will do → butun harakat (I will call at 8)\n   • will be doing → jarayon (I'll be sleeping at 8)\n\n❓ Savol: Will + ega + be + V-ing?",
  },
  summary: [
    "will be + V-ing (kelajak lahzasida jarayon)",
    "At 10 am I will be flying",
    "Muloyim savol: Will you be using...?",
    "will be doing (jarayon) vs will do (butun)",
  ],
}

// ─── 5. Future Perfect ──────────────────────────────────────────────────────
const FUTURE_PERFECT: DemoLesson = {
  id: 'future-perfect-demo',
  skill: 'Future Perfect — kelajakdagi muddatgacha tugaydigan ish',
  level: 'B1',
  emoji: '🏁',
  context: {
    text: "Tasavvur qiling — loyiha muddatini aytyapsiz: \"Kelasi juma kunigacha men bu ishni TUGATGAN BO'LAMAN\". Kelajakning ma'lum bir nuqtasidan oldin tugaydigan harakat. Keling, Future Perfect'ni o'rganamiz!",
    location: 'Real vaziyat · Loyiha muddati',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "will have + V3 — kelajakdagi nuqtagacha tugaydigan harakat",
      "by + vaqt bilan: by Friday, by 2030, by then",
      "By next year I will have finished my studies",
      "Future Perfect (tugagan) vs Future Continuous (jarayonda)",
    ],
  },
  examples: [
    { en: 'By Friday I will have finished.',     uz: 'Jumagacha men tugatgan bo\'laman.',      key: 'will have finished' },
    { en: 'She will have left by then.',         uz: 'O\'shanda u ketib bo\'lgan bo\'ladi.',  key: 'will have left' },
    { en: 'By 2030 they will have built it.',    uz: '2030 yilgacha ular uni qurib bo\'lishadi.', key: 'will have built' },
    { en: 'Will you have eaten by 8?',           uz: 'Soat 8 ga ovqatlanib bo\'lasizmi?',     key: 'Will you have' },
  ],
  vocab: [
    { en: 'will have + V3', uz: 'qilib bo\'lgan bo\'ladi', emoji: '🏁', example: 'will have finished' },
    { en: 'by',       uz: 'gacha (muddat oxiri)', emoji: '⌛', example: 'by Friday' },
    { en: 'by then',  uz: 'o\'shangacha',        emoji: '⏰', example: 'by then' },
    { en: 'by the time', uz: 'paytiga kelib',   emoji: '🕐', example: 'by the time you come' },
    { en: 'soon',     uz: 'tez orada',          emoji: '⏩', example: 'soon' },
    { en: 'in a week', uz: 'bir haftadan keyin',emoji: '📅', example: 'in a week' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'will have', uz: 'qilib bo\'lgan bo\'ladi' }, { en: 'by', uz: 'gacha (oxiri)' }, { en: 'by then', uz: 'o\'shangacha' }, { en: 'by the time', uz: 'paytiga kelib' }], explanation: "Future Perfect asoslari." },
    { type: 'choose', sentence: 'By Friday I ___ have finished the report.', options: ['will', 'am', 'have'], correct: 'will', uz: 'Jumagacha men hisobotni tugatgan bo\'laman.', explanation: "will have + finished (V3)." },
    { type: 'choose', sentence: 'She will have ___ by the time you arrive.', options: ['left', 'leave', 'leaving'], correct: 'left', uz: 'Siz kelguningizgacha u ketib bo\'lgan bo\'ladi.', explanation: "will have + V3 (left)." },
    { type: 'judge', sentence: 'By 2030 they will have build the bridge.', isCorrect: false, explanation: "Noto'g'ri! V3: 'will have built the bridge' (build → built)." },
    { type: 'build', uz: 'O\'shanda u ketib bo\'lgan bo\'ladi.', words: ['She', 'will', 'have', 'left', 'by', 'then'], correct: ['She', 'will', 'have', 'left', 'by', 'then'], explanation: "will have + left (V3) + by then." },
    { type: 'choose', sentence: 'By next year I ___ have graduated.', options: ['will', 'am', 'have'], correct: 'will', uz: 'Kelasi yilgacha men bitirib bo\'laman.', explanation: "will have + graduated (V3)." },
    { type: 'choose', sentence: '___ you have eaten by 8 pm?', options: ['Will', 'Do', 'Are'], correct: 'Will', uz: 'Soat 8 ga ovqatlanib bo\'lasizmi?', explanation: "Savol: Will + ega + have + V3?" },
    { type: 'judge', sentence: 'I will have written 10 emails by lunch.', isCorrect: true, explanation: "To'g'ri! will have + written (V3) + by. Mukammal!" },
    { type: 'choose', sentence: 'By the time the film ends, I ___ have fallen asleep.', options: ['will', 'am', 'do'], correct: 'will', uz: 'Film tugaganda men uxlab qolgan bo\'laman.', explanation: "will have + fallen (V3)." },
    { type: 'build', uz: '2030 yilgacha ular uni qurib bo\'lishadi.', words: ['By', '2030', 'they', 'will', 'have', 'built', 'it'], correct: ['By', '2030', 'they', 'will', 'have', 'built', 'it'], explanation: "By + vaqt, will have + built (V3)." },
    { type: 'judge', sentence: 'By Monday she will have finish the course.', isCorrect: false, explanation: "Noto'g'ri! V3: 'will have finished the course'." },
    { type: 'choose', sentence: 'In ten years we ___ have saved enough money.', options: ['will', 'are', 'have'], correct: 'will', uz: 'O\'n yilda biz yetarli pul yig\'gan bo\'lamiz.', explanation: "will have + saved (V3)." },
    { type: 'choose', sentence: 'They will have ___ home by midnight.', options: ['gone', 'go', 'went'], correct: 'gone', uz: 'Yarim tungacha ular uyga ketib bo\'lishadi.', explanation: "will have + V3 (gone)." },
    { type: 'build', uz: 'Jumagacha men ishni tugatgan bo\'laman.', words: ['By', 'Friday', 'I', 'will', 'have', 'finished'], correct: ['By', 'Friday', 'I', 'will', 'have', 'finished'], explanation: "By + vaqt, will have + finished (V3). Mukammal yakun!" },
  ],
  rule: {
    title: 'Future Perfect — to\'liq qoida',
    body: "Future Perfect — kelajakning bir nuqtasidan OLDIN tugaydigan harakat.\n\n✅ Tuzilishi: will have + V3 (3-shakl)\n   • barcha shaxslar uchun: will have\n   • I will have finished · She will have left\n\n🔑 Qachon ishlatiladi:\n   • Kelajakdagi muddatgacha tugash:\n     By Friday I will have finished.\n     By 2030 they will have built it.\n\n⌛ 'by' bilan ishlatiladi:\n   • by + vaqt: by Monday, by then, by the time...\n   • ⚠️ until EMAS — by!\n\n🆚 Future Continuous bilan farqi:\n   • will be doing → jarayon (at 8 I'll be working)\n   • will have done → tugagan (by 8 I'll have finished)",
  },
  summary: [
    "will have + V3 (muddatgacha tugaydi)",
    "by + vaqt: by Friday, by then, by 2030",
    "By Friday I will have finished",
    "will have done (tugagan) vs will be doing (jarayon)",
  ],
}

// ─── 6. Future Forms Review ─────────────────────────────────────────────────
const FUTURE_FORMS_REVIEW: DemoLesson = {
  id: 'future-forms-review-demo',
  skill: 'Kelajak shakllari — will, going to, Present Continuous',
  level: 'B1',
  emoji: '🗓️',
  context: {
    text: "Tasavvur qiling — kelajak haqida gapiryapsiz: \"Yomg'ir yog'adi (bashorat), do'stim bilan uchrashaman (reja), seni kutib turaman (qaror)\". Har biri uchun boshqa kelajak shakli kerak. Keling, qaysi birini qachon ishlatishni o'rganamiz!",
    location: 'Real vaziyat · Kelajak rejalari',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "will — to'satdan qaror, bashorat, va'da (I'll help you)",
      "be going to — oldindan reja, dalilli bashorat (It's going to rain)",
      "Present Continuous — kelishilgan aniq reja (I'm meeting John)",
      "Present Simple — jadval/dastur (The train leaves at 6)",
    ],
  },
  examples: [
    { en: "I'll help you with that.",        uz: 'Men sizga buni yordam beraman.',       key: "I'll" },
    { en: "It's going to rain.",             uz: 'Yomg\'ir yog\'adi (osmon qora).',       key: 'going to' },
    { en: "I'm meeting John at 6.",          uz: 'Soat 6 da Jon bilan uchrashaman.',     key: "I'm meeting" },
    { en: 'The train leaves at 9 am.',       uz: 'Poyezd soat 9 da jo\'naydi.',          key: 'leaves' },
  ],
  vocab: [
    { en: 'will',     uz: 'qaror/bashorat',   emoji: '➡️', example: "I'll call you." },
    { en: 'going to', uz: 'reja/dalilli',     emoji: '🎯', example: 'going to study' },
    { en: 'Present Cont.', uz: 'kelishilgan reja', emoji: '📅', example: "I'm leaving soon." },
    { en: 'Present Simple', uz: 'jadval',     emoji: '🕐', example: 'It opens at 8.' },
    { en: 'predict',  uz: 'bashorat qilmoq',  emoji: '🔮', example: 'I predict rain.' },
    { en: 'decide',   uz: 'qaror qilmoq',     emoji: '✅', example: 'decide now' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'will', uz: 'qaror/bashorat' }, { en: 'going to', uz: 'reja/dalil' }, { en: "I'm meeting", uz: 'kelishilgan reja' }, { en: 'leaves', uz: 'jadval' }], explanation: "Kelajak shakllarining ma'nolari." },
    { type: 'choose', sentence: 'Look at those clouds! It ___ rain.', options: ['is going to', 'will', 'leaves'], correct: 'is going to', uz: 'Anavi bulutlarga qara! Yomg\'ir yog\'adi.', explanation: "Dalil bor (bulutlar) → be going to." },
    { type: 'choose', sentence: "The phone is ringing. I ___ answer it.", options: ["'ll", "'m going to", 'answer'], correct: "'ll", uz: 'Telefon jiringlayapti. Men javob beraman.', explanation: "To'satdan qaror → will." },
    { type: 'judge', sentence: "I will meet John tomorrow at 6 (already arranged).", isCorrect: false, explanation: "Kelishilgan reja uchun Present Continuous tabiiyroq: 'I'm meeting John at 6'." },
    { type: 'build', uz: 'Poyezd soat 9 da jo\'naydi.', words: ['The', 'train', 'leaves', 'at', '9'], correct: ['The', 'train', 'leaves', 'at', '9'], explanation: "Jadval → Present Simple (leaves)." },
    { type: 'choose', sentence: "I've decided. I ___ study medicine.", options: ['am going to', 'will', 'leave'], correct: 'am going to', uz: 'Qaror qildim. Men tibbiyot o\'qiyman.', explanation: "Oldindan qaror/reja → be going to." },
    { type: 'choose', sentence: "I'm tired. I think I ___ go to bed.", options: ["'ll", "'m going to", 'go'], correct: "'ll", uz: 'Charchadim. Uxlagani boraman shekilli.', explanation: "Hozir qaror (I think) → will." },
    { type: 'judge', sentence: "I'm flying to Dubai next week (ticket booked).", isCorrect: true, explanation: "To'g'ri! Kelishilgan reja (chipta bor) → Present Continuous. Mukammal!" },
    { type: 'choose', sentence: 'The film ___ at 8 pm tonight.', options: ['starts', 'will start', 'is starting'], correct: 'starts', uz: 'Film bugun soat 8 da boshlanadi.', explanation: "Dastur/jadval → Present Simple (starts)." },
    { type: 'build', uz: 'Men sizga yordam beraman.', words: ['I', 'will', 'help', 'you'], correct: ['I', 'will', 'help', 'you'], explanation: "Taklif/va'da → will." },
    { type: 'judge', sentence: "Watch out! You will fall!", isCorrect: false, explanation: "Dalil bor (xavf ko'rinyapti) → 'You're going to fall!'" },
    { type: 'choose', sentence: "We ___ dinner with friends tonight (arranged).", options: ['are having', 'will have', 'have'], correct: 'are having', uz: 'Bugun kechqurun do\'stlar bilan ovqatlanamiz (kelishilgan).', explanation: "Kelishilgan reja → Present Continuous." },
    { type: 'choose', sentence: "Maybe I ___ visit my grandma next month.", options: ['will', 'am going to', 'visit'], correct: 'will', uz: 'Balki kelasi oy buvimnikiga boraman.', explanation: "Aniq emas (maybe) → will." },
    { type: 'build', uz: 'Osmonga qara — yomg\'ir yog\'adi.', words: ['Look', 'it', 'is', 'going', 'to', 'rain'], correct: ['Look', 'it', 'is', 'going', 'to', 'rain'], explanation: "Dalilli bashorat → be going to. Mukammal yakun!" },
  ],
  rule: {
    title: 'Future Forms — to\'liq qoida',
    body: "Kelajakni ifodalashning 4 asosiy yo'li:\n\n➡️ will:\n   • To'satdan qaror: I'll answer the phone.\n   • Va'da/taklif: I'll help you.\n   • Aniq bo'lmagan bashorat: Maybe it will rain.\n\n🎯 be going to:\n   • Oldindan reja/niyat: I'm going to study law.\n   • Dalilli bashorat: Look — it's going to rain!\n\n📅 Present Continuous:\n   • Kelishilgan, aniq reja: I'm meeting John at 6.\n\n🕐 Present Simple:\n   • Jadval/dastur: The train leaves at 9.\n\n⚠️ Asosiy farq: reja oldinmi (going to / Present Cont.)\n   yoki hozir qaror qilindimi (will)?",
  },
  summary: [
    "will — qaror, va'da, aniqmas bashorat",
    "be going to — reja, dalilli bashorat",
    "Present Continuous — kelishilgan aniq reja",
    "Present Simple — jadval (train leaves at 9)",
  ],
}

// ─── 7. Modals of Obligation ────────────────────────────────────────────────
const MODALS_OBLIGATION: DemoLesson = {
  id: 'modals-obligation-demo',
  skill: 'Majburiyat modallari — must, have to, should, needn\'t',
  level: 'B1',
  emoji: '📋',
  context: {
    text: "Tasavvur qiling — yangi mamlakatga borib qoidalarni o'rganyapsiz: \"Pasport olib yurish SHART, lekin chayqovga pul berish SHART EMAS\". Majburiyat darajalarini aniq ifodalash kerak. Keling, majburiyat modallarini o'rganamiz!",
    location: 'Real vaziyat · Qoidalar',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "must / have to — majburiyat (ichki vs tashqi)",
      "mustn't — taqiq · don't have to / needn't — shart emas",
      "should / ought to — maslahat",
      "had to — o'tmishdagi majburiyat (must o'tmishi yo'q)",
    ],
  },
  examples: [
    { en: 'You must show your passport.',     uz: 'Pasportingizni ko\'rsatishingiz shart.', key: 'must' },
    { en: "You don't have to pay.",           uz: 'To\'lashingiz shart emas.',              key: "don't have to" },
    { en: "You mustn't smoke here.",          uz: 'Bu yerda chekish taqiqlanadi.',          key: "mustn't" },
    { en: 'I had to work late yesterday.',    uz: 'Kecha kechgacha ishlashga majbur edim.',  key: 'had to' },
  ],
  vocab: [
    { en: 'must',      uz: 'shart (ichki)',     emoji: '❗', example: 'I must rest.' },
    { en: 'have to',   uz: 'majbur (tashqi)',   emoji: '📋', example: 'I have to work.' },
    { en: "mustn't",   uz: 'taqiq',             emoji: '🚫', example: "mustn't lie" },
    { en: "don't have to", uz: 'shart emas',    emoji: '🆓', example: "don't have to go" },
    { en: 'should',    uz: 'kerak (maslahat)',  emoji: '💡', example: 'You should rest.' },
    { en: 'had to',    uz: 'majbur edi (o\'tmish)', emoji: '⏪', example: 'I had to leave.' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'must', uz: 'shart' }, { en: "mustn't", uz: 'taqiq' }, { en: "don't have to", uz: 'shart emas' }, { en: 'had to', uz: 'majbur edi' }], explanation: "Majburiyat modallari." },
    { type: 'choose', sentence: 'You ___ wear a seatbelt. It\'s the law.', options: ['have to', 'should', "don't have to"], correct: 'have to', uz: 'Xavfsizlik kamarini taqishingiz shart. Bu qonun.', explanation: "Tashqi qoida/qonun → have to." },
    { type: 'choose', sentence: "It's Sunday. You ___ get up early.", options: ["don't have to", "mustn't", 'must'], correct: "don't have to", uz: 'Yakshanba. Erta turishingiz shart emas.', explanation: "Majburiyat yo'q → don't have to." },
    { type: 'judge', sentence: "You don't have to park here — it's forbidden.", isCorrect: false, explanation: "Taqiq → mustn't: 'You mustn't park here'. (don't have to = ixtiyoriy)." },
    { type: 'build', uz: 'Kecha kechgacha ishlashga majbur edim.', words: ['I', 'had', 'to', 'work', 'late'], correct: ['I', 'had', 'to', 'work', 'late'], explanation: "O'tmish majburiyati → had to (must o'tmishi yo'q)." },
    { type: 'choose', sentence: "You ___ tell anyone. It's a secret.", options: ["mustn't", "don't have to", 'should'], correct: "mustn't", uz: 'Hech kimga aytmasligingiz kerak. Bu sir.', explanation: "Taqiq → mustn't." },
    { type: 'choose', sentence: 'You ___ see a doctor about that cough.', options: ['should', 'mustn\'t', "don't have to"], correct: 'should', uz: 'O\'sha yo\'tal uchun shifokorga ko\'rinishingiz kerak.', explanation: "Maslahat → should." },
    { type: 'judge', sentence: "I must finish this today (my own decision).", isCorrect: true, explanation: "To'g'ri! Ichki majburiyat (o'z qarorim) → must. Mukammal!" },
    { type: 'choose', sentence: "We ___ hurry. We have plenty of time.", options: ["needn't", "mustn't", 'must'], correct: "needn't", uz: 'Shoshilishimiz shart emas. Vaqtimiz ko\'p.', explanation: "Shart emas → needn't (= don't need to)." },
    { type: 'build', uz: 'Siz pasportingizni ko\'rsatishingiz shart.', words: ['You', 'must', 'show', 'your', 'passport'], correct: ['You', 'must', 'show', 'your', 'passport'], explanation: "Kuchli majburiyat → must." },
    { type: 'judge', sentence: "Yesterday I must work late.", isCorrect: false, explanation: "Noto'g'ri! must o'tmishi yo'q → 'Yesterday I had to work late'." },
    { type: 'choose', sentence: "Students ___ submit homework by Friday.", options: ['have to', "don't have to", "mustn't"], correct: 'have to', uz: 'Talabalar uy ishini juma kunigacha topshirishlari shart.', explanation: "Tashqi qoida → have to." },
    { type: 'choose', sentence: "You ___ be so rude to people.", options: ["shouldn't", "don't have to", 'must'], correct: "shouldn't", uz: 'Odamlarga bunchalik qo\'pol bo\'lmasligingiz kerak.', explanation: "Maslahat inkori → shouldn't." },
    { type: 'build', uz: 'To\'lashingiz shart emas — bu bepul.', words: ['You', "don't", 'have', 'to', 'pay'], correct: ['You', "don't", 'have', 'to', 'pay'], explanation: "Majburiyat yo'q → don't have to. Mukammal yakun!" },
  ],
  rule: {
    title: 'Modals of Obligation — to\'liq qoida',
    body: "Majburiyat darajalarini ifodalaydi.\n\n❗ must / have to — MAJBURIYAT:\n   • must — ichki his/kuchli: I must stop smoking.\n   • have to — tashqi qoida: I have to wear a uniform.\n\n🚫 mustn't — TAQIQ (mumkin emas):\n   • You mustn't smoke here.\n\n🆓 don't have to / needn't — SHART EMAS:\n   • You don't have to come. (ixtiyoriy)\n   ⚠️ mustn't (taqiq) ≠ don't have to (ixtiyoriy)!\n\n💡 should / ought to — MASLAHAT:\n   • You should rest. · You ought to apologise.\n\n⏪ O'tmish: must → had to\n   (must o'tmish shakli yo'q!)",
  },
  summary: [
    "must (ichki) / have to (tashqi) — majburiyat",
    "mustn't = taqiq · don't have to = ixtiyoriy",
    "should / ought to — maslahat",
    "O'tmish: had to (must o'tmishi yo'q)",
  ],
}

// ─── 8. Modals of Speculation ───────────────────────────────────────────────
const MODALS_SPECULATION: DemoLesson = {
  id: 'modals-speculation-demo',
  skill: 'Taxmin modallari — must, might, can\'t be',
  level: 'B1',
  emoji: '🕵️',
  context: {
    text: "Tasavvur qiling — eshik qo'ng'irog'i jiringladi, lekin hech kimni kutmayapsiz: \"Bu pochtachi BO'LSA KERAK... yoki qo'shni BO'LISHI MUMKIN... lekin Aliboy BO'LISHI MUMKIN EMAS, u chet elda\". Ishonch darajalarini ifodalash. Keling, taxmin modallarini o'rganamiz!",
    location: 'Real vaziyat · Taxmin qilish',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "must be — ishonchli xulosa (90% rost): He must be tired",
      "might / may / could be — ehtimol (50%): She might be home",
      "can't be — ishonchli inkor (rost emas): It can't be true",
      "Hammasidan keyin asosiy fe'l asl shaklda (be, know...)",
    ],
  },
  examples: [
    { en: 'He must be tired.',          uz: 'U charchagan bo\'lsa kerak.',           key: 'must be' },
    { en: 'She might be at work.',      uz: 'U ishda bo\'lishi mumkin.',             key: 'might be' },
    { en: "That can't be right.",       uz: 'Bu to\'g\'ri bo\'lishi mumkin emas.',   key: "can't be" },
    { en: 'They could be lost.',        uz: 'Ular adashgan bo\'lishlari mumkin.',    key: 'could be' },
  ],
  vocab: [
    { en: 'must be',   uz: 'bo\'lsa kerak (ishonchli)', emoji: '✅', example: 'must be true' },
    { en: 'might be',  uz: 'bo\'lishi mumkin (ehtimol)', emoji: '🤔', example: 'might be late' },
    { en: 'may be',    uz: 'bo\'lishi mumkin',  emoji: '🤷', example: 'may be right' },
    { en: 'could be',  uz: 'bo\'lishi mumkin',  emoji: '💭', example: 'could be wrong' },
    { en: "can't be",  uz: 'bo\'lishi mumkin emas', emoji: '❌', example: "can't be him" },
    { en: 'probably',  uz: 'ehtimol',           emoji: '📊', example: 'probably true' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'must be', uz: 'ishonchli (bo\'lsa kerak)' }, { en: 'might be', uz: 'ehtimol' }, { en: "can't be", uz: 'mumkin emas' }, { en: 'could be', uz: 'mumkin' }], explanation: "Taxmin modallarining ishonch darajasi." },
    { type: 'choose', sentence: "He's been working all day. He ___ be tired.", options: ['must', 'might', "can't"], correct: 'must', uz: 'U kun bo\'yi ishladi. Charchagan bo\'lsa kerak.', explanation: "Ishonchli xulosa (dalil bor) → must be." },
    { type: 'choose', sentence: "I'm not sure where she is. She ___ be at home.", options: ['might', 'must', "can't"], correct: 'might', uz: 'Qayerdaligini bilmayman. Uyda bo\'lishi mumkin.', explanation: "Aniq emas → might be." },
    { type: 'judge', sentence: "That can be true — I saw it myself! (impossible)", isCorrect: false, explanation: "Ishonchli inkor → can't: 'That can't be true' degani noto'g'ri ishlatilgan; ishonch → 'must be true'." },
    { type: 'build', uz: 'Bu to\'g\'ri bo\'lishi mumkin emas.', words: ['That', "can't", 'be', 'right'], correct: ['That', "can't", 'be', 'right'], explanation: "Ishonchli inkor → can't be." },
    { type: 'choose', sentence: "The lights are off. They ___ be out.", options: ['must', 'might', "couldn't"], correct: 'must', uz: 'Chiroqlar o\'chgan. Ular tashqarida bo\'lsa kerak.', explanation: "Dalil (chiroq o'chiq) → must be out." },
    { type: 'choose', sentence: "He failed every exam. He ___ be a good student.", options: ["can't", 'must', 'might'], correct: "can't", uz: 'U har imtihondan yiqildi. Yaxshi talaba bo\'lishi mumkin emas.', explanation: "Dalil → ishonchli inkor: can't be." },
    { type: 'judge', sentence: "She might be stuck in traffic.", isCorrect: true, explanation: "To'g'ri! Ehtimol → might be. Mukammal!" },
    { type: 'choose', sentence: "I'm not sure. The answer ___ be 42.", options: ['could', 'must', "can't"], correct: 'could', uz: 'Ishonchim komil emas. Javob 42 bo\'lishi mumkin.', explanation: "Ehtimol → could be." },
    { type: 'build', uz: 'U charchagan bo\'lsa kerak.', words: ['He', 'must', 'be', 'tired'], correct: ['He', 'must', 'be', 'tired'], explanation: "Ishonchli xulosa → must be." },
    { type: 'judge', sentence: "It's only 5 minutes away. It must take an hour.", isCorrect: false, explanation: "Mantiqsiz! Yaqin (5 daqiqa) → 'It can't take an hour'." },
    { type: 'choose', sentence: "Whose bag is this? It ___ be Tom's — he just left.", options: ['might', 'must', "can't"], correct: 'might', uz: 'Bu kimning sumkasi? Tomniki bo\'lishi mumkin — u hozir ketdi.', explanation: "Ehtimol → might be." },
    { type: 'choose', sentence: "She speaks perfect French. She ___ be from France.", options: ['must', 'might', "can't"], correct: 'must', uz: 'U mukammal frantsuzcha gapiradi. Fransiyalik bo\'lsa kerak.', explanation: "Kuchli dalil → must be." },
    { type: 'build', uz: 'Ular adashgan bo\'lishlari mumkin.', words: ['They', 'could', 'be', 'lost'], correct: ['They', 'could', 'be', 'lost'], explanation: "Ehtimol → could be. Mukammal yakun!" },
  ],
  rule: {
    title: 'Modals of Speculation — to\'liq qoida',
    body: "Hozirgi vaziyat haqida ishonch darajasini bildiradi.\n\n✅ must be — ISHONCHLI xulosa (~90%):\n   • He's yawning. He must be tired.\n   (kuchli dalil bor)\n\n🤔 might / may / could be — EHTIMOL (~50%):\n   • She might be at work.\n   • It may be true. · They could be late.\n\n❌ can't be — ISHONCHLI inkor (rost emas):\n   • That can't be right!\n   ⚠️ mustn't EMAS — can't!\n\n📝 Barchasidan keyin asosiy fe'l ASL shaklda:\n   must BE, might KNOW, can't BE\n\n🆚 Faqat ehtimollik — majburiyat emas!",
  },
  summary: [
    "must be — ishonchli xulosa (dalil bor)",
    "might/may/could be — ehtimol (~50%)",
    "can't be — ishonchli inkor (rost emas)",
    "Hammasidan keyin fe'l asl shaklda (be, know)",
  ],
}

// ─── 9. Past Habits (used to / would) ───────────────────────────────────────
const PAST_HABITS: DemoLesson = {
  id: 'past-habits-demo',
  skill: 'O\'tmish odatlari — used to, would, Past Simple',
  level: 'B1',
  emoji: '📜',
  context: {
    text: "Tasavvur qiling — bolaligingizni eslayapsiz: \"Men har yozda buvimnikiga BORARDIM, daryoda suzARDIM\". O'tmishda takrorlangan, endi yo'q odatlar. Keling, o'tmish odatlarini ifodalashni o'rganamiz!",
    location: 'Real vaziyat · Bolalik xotiralari',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "used to + V1 — o'tmishdagi odat yoki holat (endi yo'q)",
      "would + V1 — takrorlangan o'tmish harakati (holat uchun emas!)",
      "I used to live / I would visit — har yili",
      "Holat fe'llari (be, have, know) bilan faqat used to",
    ],
  },
  examples: [
    { en: 'I used to live in a village.',     uz: 'Men avval qishloqda yashardim.',        key: 'used to' },
    { en: 'We would play outside all day.',   uz: 'Biz kun bo\'yi tashqarida o\'ynardik.', key: 'would' },
    { en: "I didn't use to like coffee.",     uz: 'Avval qahvani yoqtirmasdim.',           key: "didn't use to" },
    { en: 'Did you use to have long hair?',   uz: 'Avval sochingiz uzun edimi?',           key: 'use to' },
  ],
  vocab: [
    { en: 'used to',  uz: 'avval ... edi/qilardi', emoji: '📜', example: 'used to smoke' },
    { en: 'would',    uz: 'qilardi (takror)',  emoji: '🔁', example: 'would visit' },
    { en: "didn't use to", uz: 'avval ...masdi', emoji: '🚫', example: "didn't use to" },
    { en: 'as a child', uz: 'bolaligida',      emoji: '👶', example: 'as a child' },
    { en: 'no longer', uz: 'endi ... emas',    emoji: '⛔', example: 'no longer here' },
    { en: 'these days', uz: 'hozirgi kunda',   emoji: '📆', example: 'these days' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'used to', uz: 'avval qilardi' }, { en: 'would', uz: 'takror qilardi' }, { en: "didn't use to", uz: 'avval qilmasdi' }, { en: 'as a child', uz: 'bolaligida' }], explanation: "O'tmish odati shakllari." },
    { type: 'choose', sentence: 'I ___ live in London, but now I live here.', options: ['used to', 'would', 'use to'], correct: 'used to', uz: 'Men avval Londonda yashardim, lekin hozir bu yerda.', explanation: "O'tmish holati → used to (would holat uchun ishlamaydi)." },
    { type: 'choose', sentence: 'Every summer we ___ go to the seaside.', options: ['would', 'use to', 'are'], correct: 'would', uz: 'Har yozda biz dengiz bo\'yiga borardik.', explanation: "Takrorlangan harakat → would (yoki used to)." },
    { type: 'judge', sentence: 'I would be very shy as a child.', isCorrect: false, explanation: "Noto'g'ri! Holat (shy) → used to: 'I used to be very shy'. (would holat uchun emas!)" },
    { type: 'build', uz: 'Men avval qahvani yoqtirmasdim.', words: ['I', "didn't", 'use', 'to', 'like', 'coffee'], correct: ['I', "didn't", 'use', 'to', 'like', 'coffee'], explanation: "Inkor: didn't use to (used emas, use!)." },
    { type: 'choose', sentence: 'She ___ have a red bicycle.', options: ['used to', 'would', 'uses to'], correct: 'used to', uz: 'Uning avval qizil velosipedi bor edi.', explanation: "have = egalik (holat) → used to (would emas)." },
    { type: 'choose', sentence: '___ you use to play football?', options: ['Did', 'Do', 'Were'], correct: 'Did', uz: 'Avval futbol o\'ynardingizmi?', explanation: "Savol: Did + ega + use to + V1?" },
    { type: 'judge', sentence: 'We used to spend hours playing games.', isCorrect: true, explanation: "To'g'ri! O'tmish odati → used to. Mukammal!" },
    { type: 'choose', sentence: 'My grandfather ___ tell us stories every night.', options: ['would', 'use to', 'is'], correct: 'would', uz: 'Bobom har kechasi bizga hikoya aytib berardi.', explanation: "Takror harakat → would." },
    { type: 'build', uz: 'Men avval qishloqda yashardim.', words: ['I', 'used', 'to', 'live', 'in', 'a', 'village'], correct: ['I', 'used', 'to', 'live', 'in', 'a', 'village'], explanation: "O'tmish holati → used to live." },
    { type: 'judge', sentence: 'Did you used to smoke?', isCorrect: false, explanation: "Noto'g'ri! Did + use to (used emas): 'Did you use to smoke?'" },
    { type: 'choose', sentence: 'There ___ be a cinema here, but it closed.', options: ['used to', 'would', 'uses to'], correct: 'used to', uz: 'Bu yerda avval kinoteatr bor edi, lekin yopildi.', explanation: "O'tmish holati (there be) → used to." },
    { type: 'choose', sentence: 'On Sundays we ___ visit our grandparents.', options: ['would', 'use to', 'are'], correct: 'would', uz: 'Yakshanba kunlari biz buvalarimiznikiga borardik.', explanation: "Takror harakat → would." },
    { type: 'build', uz: 'Biz kun bo\'yi tashqarida o\'ynardik.', words: ['We', 'would', 'play', 'outside', 'all', 'day'], correct: ['We', 'would', 'play', 'outside', 'all', 'day'], explanation: "Takror harakat → would play. Mukammal yakun!" },
  ],
  rule: {
    title: 'Past Habits — to\'liq qoida',
    body: "O'tmishda takrorlangan, endi yo'q odatlar.\n\n📜 used to + V1:\n   • O'tmish ODATI: I used to smoke.\n   • O'tmish HOLATI: I used to live here. There used to be a shop.\n   • Inkor: didn't use to · Savol: Did you use to...?\n   ⚠️ savol/inkorda 'use to' (used EMAS)!\n\n🔁 would + V1:\n   • Takrorlangan HARAKAT: Every summer we would travel.\n   ⚠️ HOLAT fe'llari bilan ISHLAMAYDI:\n   • I would be shy ✗ → I used to be shy ✓\n   • (be, have, know, like — faqat used to)\n\n✅ Past Simple ham bo'ladi (aniq vaqt bilan):\n   • Last year I lived in Paris.",
  },
  summary: [
    "used to + V1 — o'tmish odati VA holati",
    "would + V1 — takror harakat (holat uchun emas!)",
    "Inkor/savol: use to (used emas)",
    "be/have/know → faqat used to",
  ],
}

// ─── 10. Causatives (have/get something done) ───────────────────────────────
const CAUSATIVES: DemoLesson = {
  id: 'causatives-demo',
  skill: 'Kauzativ — have/get something done',
  level: 'B1',
  emoji: '🛠️',
  context: {
    text: "Tasavvur qiling — sochingizni o'zingiz kesmadingiz, sartarosh kesdi: \"Men sochimni KESTIRDIM\". Ish boshqa odam tomonidan bajariladi. Keling, 'have/get something done' tuzilmasini o'rganamiz!",
    location: 'Real vaziyat · Xizmat ko\'rsatish',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "have/get + ob'ekt + V3 — ishni birovga qildirish",
      "I had my hair cut (o'zim emas, sartarosh kesdi)",
      "have = neytral · get = norasmiy (so'zlashuv)",
      "Turli zamonlarda: had it repaired, will get it fixed",
    ],
  },
  examples: [
    { en: 'I had my hair cut yesterday.',      uz: 'Kecha sochimni kestirdim.',             key: 'had ... cut' },
    { en: 'She got her car repaired.',         uz: 'U mashinasini ta\'mirlattirdi.',        key: 'got ... repaired' },
    { en: 'We are having our house painted.',  uz: 'Biz uyimizni bo\'yattiryapmiz.',        key: 'having ... painted' },
    { en: 'You should get your eyes tested.',  uz: 'Ko\'zingizni tekshirtirishingiz kerak.', key: 'get ... tested' },
  ],
  vocab: [
    { en: 'have ... done', uz: 'qildirmoq (neytral)', emoji: '🛠️', example: 'have it fixed' },
    { en: 'get ... done',  uz: 'qildirmoq (norasmiy)', emoji: '🔧', example: 'get it cut' },
    { en: 'repair',   uz: 'ta\'mirlamoq',     emoji: '🔩', example: 'get it repaired' },
    { en: 'cut',      uz: 'kesmoq',           emoji: '✂️', example: 'have hair cut' },
    { en: 'paint',    uz: 'bo\'yamoq',        emoji: '🎨', example: 'have it painted' },
    { en: 'deliver',  uz: 'yetkazmoq',        emoji: '📦', example: 'have it delivered' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'have ... done', uz: 'qildirmoq' }, { en: 'cut', uz: 'kesmoq' }, { en: 'repair', uz: 'ta\'mirlamoq' }, { en: 'paint', uz: 'bo\'yamoq' }], explanation: "Kauzativ tuzilma so'zlari." },
    { type: 'choose', sentence: 'I had my hair ___ yesterday.', options: ['cut', 'cutted', 'cutting'], correct: 'cut', uz: 'Kecha sochimni kestirdim.', explanation: "have + ob'ekt + V3 (cut → cut)." },
    { type: 'choose', sentence: 'She ___ her car repaired.', options: ['got', 'get', 'getting'], correct: 'got', uz: 'U mashinasini ta\'mirlattirdi.', explanation: "get + ob'ekt + V3 (o'tmish: got)." },
    { type: 'judge', sentence: 'I cut my hair yesterday (at the barber).', isCorrect: false, explanation: "Sartarosh kesgan bo'lsa → 'I had my hair cut' (o'zim emas)." },
    { type: 'build', uz: 'Biz uyimizni bo\'yattiryapmiz.', words: ['We', 'are', 'having', 'our', 'house', 'painted'], correct: ['We', 'are', 'having', 'our', 'house', 'painted'], explanation: "be + having + ob'ekt + V3 (painted)." },
    { type: 'choose', sentence: 'You should ___ your eyes tested.', options: ['get', 'got', 'getting'], correct: 'get', uz: 'Ko\'zingizni tekshirtirishingiz kerak.', explanation: "should + get + ob'ekt + V3 (tested)." },
    { type: 'choose', sentence: 'I need to have my phone ___.', options: ['fixed', 'fix', 'fixing'], correct: 'fixed', uz: 'Telefonimni tuzattirishim kerak.', explanation: "have + ob'ekt + V3 (fixed)." },
    { type: 'judge', sentence: 'She had her photo taken at the studio.', isCorrect: true, explanation: "To'g'ri! had + ob'ekt + V3 (taken). Mukammal!" },
    { type: 'choose', sentence: 'We are going to ___ the carpet cleaned.', options: ['get', 'got', 'getting'], correct: 'get', uz: 'Biz gilamni tozalattirmoqchimiz.', explanation: "going to + get + ob'ekt + V3." },
    { type: 'build', uz: 'U mashinasini yuvdirdi.', words: ['He', 'had', 'his', 'car', 'washed'], correct: ['He', 'had', 'his', 'car', 'washed'], explanation: "had + ob'ekt + V3 (washed)." },
    { type: 'judge', sentence: 'I had my house paint last week.', isCorrect: false, explanation: "Noto'g'ri! V3 kerak: 'I had my house painted' (paint → painted)." },
    { type: 'choose', sentence: "I'll get the documents ___ tomorrow.", options: ['delivered', 'deliver', 'delivering'], correct: 'delivered', uz: 'Hujjatlarni ertaga yetkaztiraman.', explanation: "get + ob'ekt + V3 (delivered)." },
    { type: 'choose', sentence: 'Where did you have your suit ___?', options: ['made', 'make', 'making'], correct: 'made', uz: 'Kostyumingizni qayerda tikdirdingiz?', explanation: "have + ob'ekt + V3 (made)." },
    { type: 'build', uz: 'Men mashinamni ta\'mirlattirishim kerak.', words: ['I', 'need', 'to', 'get', 'my', 'car', 'repaired'], correct: ['I', 'need', 'to', 'get', 'my', 'car', 'repaired'], explanation: "get + ob'ekt + V3 (repaired). Mukammal yakun!" },
  ],
  rule: {
    title: 'Causatives — to\'liq qoida',
    body: "Ishni o'zingiz emas, BOSHQA odam bajaradi.\n\n✅ Tuzilishi: have/get + OB'EKT + V3\n   • I had my hair cut. (sartarosh kesdi)\n   • She got her car repaired. (usta tuzatdi)\n\n🔑 have vs get:\n   • have — neytral/rasmiy: have it done\n   • get — norasmiy/so'zlashuv: get it done\n   (ma'no bir xil)\n\n🕐 Har zamonda:\n   • Hozir: I have my car washed every week.\n   • O'tmish: I had it repaired.\n   • Kelajak: I'll get it fixed.\n   • Davom: We are having the house painted.\n\n⚠️ OB'EKT + V3 tartibi muhim (V3 oxirida!)",
  },
  summary: [
    "have/get + ob'ekt + V3 — birovga qildirish",
    "I had my hair cut (o'zim emas)",
    "have (neytral) = get (norasmiy)",
    "V3 oxirida: had it repaired, get it fixed",
  ],
}

// ─── 11. Question Tags ──────────────────────────────────────────────────────
const QUESTION_TAGS: DemoLesson = {
  id: 'question-tags-demo',
  skill: 'Savol qo\'shimchalari — question tags (isn\'t it?)',
  level: 'B1',
  emoji: '🔖',
  context: {
    text: "Tasavvur qiling — suhbatda tasdiq qidiryapsiz: \"Bugun havo ajoyib, SHUNDAYMI? Siz ham kelasiz, SHUNDAY EMASMI?\". Gap oxiriga qo'shilgan qisqa savol. Keling, question tag'larni o'rganamiz!",
    location: 'Real vaziyat · Suhbat',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Question tag — gap oxiriga qo'shilgan qisqa savol",
      "Ijobiy gap → inkor tag: You're happy, aren't you?",
      "Inkor gap → ijobiy tag: He isn't here, is he?",
      "Yordamchi fe'l takrorlanadi (be, do, have, will, can)",
    ],
  },
  examples: [
    { en: "It's a nice day, isn't it?",        uz: 'Havo ajoyib, shundaymi?',               key: "isn't it" },
    { en: "You don't smoke, do you?",          uz: 'Siz chekmaysiz, shundaymi?',            key: 'do you' },
    { en: 'She can swim, can\'t she?',         uz: 'U suza oladi, shunday emasmi?',         key: "can't she" },
    { en: "They'll come, won't they?",         uz: 'Ular kelishadi, shunday emasmi?',       key: "won't they" },
  ],
  vocab: [
    { en: "isn't it?", uz: 'shundaymi?',       emoji: '❓', example: 'nice, isn\'t it?' },
    { en: 'do you?',   uz: 'shundaymi?',       emoji: '🔄', example: 'you like it, don\'t you?' },
    { en: "don't you?", uz: 'shunday emasmi?', emoji: '✅', example: 'you know, don\'t you?' },
    { en: "can't she?", uz: 'shunday emasmi?', emoji: '🎯', example: 'she can, can\'t she?' },
    { en: 'tag',      uz: 'qo\'shimcha savol', emoji: '🔖', example: 'question tag' },
    { en: 'confirm',  uz: 'tasdiqlamoq',       emoji: '✔️', example: 'confirm an idea' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: "isn't it?", uz: 'shundaymi? (be)' }, { en: "don't you?", uz: 'shundaymi? (do)' }, { en: "can't she?", uz: 'shunday emasmi? (can)' }, { en: "won't they?", uz: 'shunday emasmi? (will)' }], explanation: "Question tag turlari." },
    { type: 'choose', sentence: "It's cold today, ___?", options: ["isn't it", "is it", "doesn't it"], correct: "isn't it", uz: 'Bugun sovuq, shundaymi?', explanation: "Ijobiy (is) → inkor tag (isn't it)." },
    { type: 'choose', sentence: "You don't like fish, ___?", options: ['do you', "don't you", 'are you'], correct: 'do you', uz: 'Siz baliqni yoqtirmaysiz, shundaymi?', explanation: "Inkor (don't) → ijobiy tag (do you)." },
    { type: 'judge', sentence: "She is a doctor, isn't it?", isCorrect: false, explanation: "Noto'g'ri! Ega 'she' → tag 'she': 'She is a doctor, isn't SHE?'" },
    { type: 'build', uz: 'U suza oladi, shunday emasmi?', words: ['She', 'can', 'swim', "can't", 'she'], correct: ['She', 'can', 'swim', "can't", 'she'], explanation: "Ijobiy (can) → inkor tag (can't she)." },
    { type: 'choose', sentence: "They won't be late, ___?", options: ['will they', "won't they", 'do they'], correct: 'will they', uz: 'Ular kechikmaydi, shundaymi?', explanation: "Inkor (won't) → ijobiy tag (will they)." },
    { type: 'choose', sentence: "He's finished, ___?", options: ["hasn't he", "isn't he", "doesn't he"], correct: "hasn't he", uz: 'U tugatdi, shunday emasmi?', explanation: "He's finished = has finished → tag hasn't he." },
    { type: 'judge', sentence: "You're coming, aren't you?", isCorrect: true, explanation: "To'g'ri! Ijobiy (are) → inkor tag (aren't you). Mukammal!" },
    { type: 'choose', sentence: "She doesn't work here, ___?", options: ['does she', "doesn't she", 'is she'], correct: 'does she', uz: 'U bu yerda ishlamaydi, shundaymi?', explanation: "Inkor (doesn't) → ijobiy tag (does she)." },
    { type: 'build', uz: 'Havo ajoyib, shundaymi?', words: ["It's", 'a', 'nice', 'day', "isn't", 'it'], correct: ["It's", 'a', 'nice', 'day', "isn't", 'it'], explanation: "Ijobiy (is) → inkor tag (isn't it)." },
    { type: 'judge', sentence: "Let's go, shall we?", isCorrect: true, explanation: "To'g'ri! Let's → maxsus tag 'shall we?'. Mukammal!" },
    { type: 'choose', sentence: "You can drive, ___?", options: ["can't you", 'can you', "don't you"], correct: "can't you", uz: 'Siz hayday olasiz, shunday emasmi?', explanation: "Ijobiy (can) → inkor tag (can't you)." },
    { type: 'choose', sentence: "There's a problem, ___?", options: ["isn't there", "isn't it", "aren't there"], correct: "isn't there", uz: 'Muammo bor, shunday emasmi?', explanation: "There's → tag 'isn't there'." },
    { type: 'build', uz: 'Ular kelishadi, shunday emasmi?', words: ["They'll", 'come', "won't", 'they'], correct: ["They'll", 'come', "won't", 'they'], explanation: "Ijobiy (will) → inkor tag (won't they). Mukammal yakun!" },
  ],
  rule: {
    title: 'Question Tags — to\'liq qoida',
    body: "Question tag — gap oxiriga qo'shilgan qisqa savol (tasdiq so'rash).\n\n✅ Asosiy qoida — TESKARI:\n   • Ijobiy gap → INKOR tag:\n     You're happy, aren't you?\n   • Inkor gap → IJOBIY tag:\n     He isn't here, is he?\n\n🔑 Yordamchi fe'l takrorlanadi:\n   • be: It's cold, isn't it?\n   • do (oddiy fe'l): You like it, don't you?\n   • have (perfect): She's gone, hasn't she?\n   • modal: He can swim, can't he?\n\n🎯 Ega olmosh bo'ladi: Tom → he, the girls → they\n\n⚠️ Maxsus holatlar:\n   • Let's go, shall we?\n   • I am..., aren't I?\n   • There's..., isn't there?",
  },
  summary: [
    "Ijobiy gap → inkor tag (aren't you?)",
    "Inkor gap → ijobiy tag (is he?)",
    "Yordamchi fe'l takrorlanadi (be/do/have/modal)",
    "Let's → shall we? · I am → aren't I?",
  ],
}

// ─── 12. Both / Either / Neither ────────────────────────────────────────────
const BOTH_EITHER_NEITHER: DemoLesson = {
  id: 'both-either-neither-demo',
  skill: 'Both / Either / Neither — ikkitasi haqida gapirish',
  level: 'B1',
  emoji: '⚖️',
  context: {
    text: "Tasavvur qiling — ikkita ish taklifi oldingiz: \"IKKALASI ham yaxshi, lekin BIRORTASI ham menga to'g'ri kelmaydi\". Ikki narsa haqida aniq gapirish. Keling, both/either/neither'ni o'rganamiz!",
    location: 'Real vaziyat · Tanlov qilish',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "both — ikkalasi ham (+ ko'plik fe'l): Both are good",
      "either — ikkalasidan biri (+ birlik): Either is fine",
      "neither — ikkalasi ham emas (+ birlik): Neither is good",
      "both...and / either...or / neither...nor bog'lovchilari",
    ],
  },
  examples: [
    { en: 'Both options are good.',           uz: 'Ikkala variant ham yaxshi.',            key: 'Both' },
    { en: 'Either day works for me.',         uz: 'Ikkala kun ham menga to\'g\'ri keladi.', key: 'Either' },
    { en: 'Neither answer is correct.',       uz: 'Ikkala javob ham noto\'g\'ri.',         key: 'Neither' },
    { en: 'I like both tea and coffee.',      uz: 'Men choy ham, qahva ham yoqtraman.',    key: 'both...and' },
  ],
  vocab: [
    { en: 'both',     uz: 'ikkalasi ham',     emoji: '✌️', example: 'both of them' },
    { en: 'either',   uz: 'ikkisidan biri',   emoji: '🤷', example: 'either one' },
    { en: 'neither',  uz: 'ikkisi ham emas',  emoji: '🚫', example: 'neither of them' },
    { en: 'both...and', uz: 'ham ... ham',    emoji: '➕', example: 'both A and B' },
    { en: 'either...or', uz: 'yo ... yo',     emoji: '🔀', example: 'either A or B' },
    { en: 'neither...nor', uz: 'na ... na',   emoji: '❌', example: 'neither A nor B' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'both', uz: 'ikkalasi ham' }, { en: 'either', uz: 'biri' }, { en: 'neither', uz: 'hech qaysi' }, { en: 'neither...nor', uz: 'na...na' }], explanation: "Both/either/neither ma'nolari." },
    { type: 'choose', sentence: '___ restaurants are excellent.', options: ['Both', 'Either', 'Neither'], correct: 'Both', uz: 'Ikkala restoran ham ajoyib.', explanation: "Ikkalasi ham (ko'plik fe'l: are) → Both." },
    { type: 'choose', sentence: '___ day is fine — Monday or Tuesday.', options: ['Either', 'Both', 'Neither'], correct: 'Either', uz: 'Ikkala kun ham yaxshi — dushanba yoki seshanba.', explanation: "Ikkisidan biri (birlik: is) → Either." },
    { type: 'judge', sentence: 'Both of the answers is correct.', isCorrect: false, explanation: "Noto'g'ri! Both → ko'plik fe'l: 'Both of the answers ARE correct'." },
    { type: 'build', uz: 'Ikkala javob ham noto\'g\'ri.', words: ['Neither', 'answer', 'is', 'correct'], correct: ['Neither', 'answer', 'is', 'correct'], explanation: "Neither + birlik ot + birlik fe'l (is)." },
    { type: 'choose', sentence: 'I like ___ tea and coffee.', options: ['both', 'either', 'neither'], correct: 'both', uz: 'Men choy ham, qahva ham yoqtiraman.', explanation: "both ... and (ham ... ham)." },
    { type: 'choose', sentence: 'You can have ___ the red or the blue one.', options: ['either', 'both', 'neither'], correct: 'either', uz: 'Qizil yoki ko\'kini olishingiz mumkin.', explanation: "either ... or (yo ... yo)." },
    { type: 'judge', sentence: 'Neither of them was at home.', isCorrect: true, explanation: "To'g'ri! Neither + birlik fe'l (was). Mukammal!" },
    { type: 'choose', sentence: '___ Tom nor Jerry came to the party.', options: ['Neither', 'Either', 'Both'], correct: 'Neither', uz: 'Na Tom, na Jerri bazmga keldi.', explanation: "neither ... nor (na ... na)." },
    { type: 'build', uz: 'Ikkala variant ham yaxshi.', words: ['Both', 'options', 'are', 'good'], correct: ['Both', 'options', 'are', 'good'], explanation: "Both + ko'plik ot + ko'plik fe'l (are)." },
    { type: 'judge', sentence: 'I don\'t like either of them.', isCorrect: true, explanation: "To'g'ri! don't + either (inkor bilan) = neither ma'no. Mukammal!" },
    { type: 'choose', sentence: '___ of my parents speaks English.', options: ['Neither', 'Both', 'Either'], correct: 'Neither', uz: 'Ota-onamning hech biri ingliz tilini bilmaydi.', explanation: "Neither + birlik fe'l (speaks) — inkor ma'no." },
    { type: 'choose', sentence: 'We can meet ___ today or tomorrow.', options: ['either', 'both', 'neither'], correct: 'either', uz: 'Bugun yoki ertaga uchrasha olamiz.', explanation: "either ... or." },
    { type: 'build', uz: 'Na u, na men javobni bilamiz.', words: ['Neither', 'he', 'nor', 'I', 'know', 'the', 'answer'], correct: ['Neither', 'he', 'nor', 'I', 'know', 'the', 'answer'], explanation: "neither ... nor. Mukammal yakun!" },
  ],
  rule: {
    title: 'Both / Either / Neither — to\'liq qoida',
    body: "Ikki narsa/odam haqida gapirish.\n\n✌️ both — IKKALASI HAM (+ ko'plik fe'l):\n   • Both books are good.\n   • both of them · both...and: both tea and coffee\n\n🤷 either — IKKISIDAN BIRI (+ birlik fe'l):\n   • Either day is fine.\n   • either...or: either Monday or Tuesday\n   • inkor bilan: I don't like either (= neither)\n\n🚫 neither — IKKISI HAM EMAS (+ birlik, ijobiy fe'l):\n   • Neither answer is correct.\n   • neither...nor: neither Tom nor Jerry\n   ⚠️ neither o'zi inkor — fe'l ijobiy bo'ladi!\n\n📝 of + the/them: both of them, neither of us",
  },
  summary: [
    "both — ikkalasi ham (+ ko'plik fe'l)",
    "either — biri (+ birlik) · either...or",
    "neither — hech qaysi (+ birlik, ijobiy fe'l)",
    "both...and / either...or / neither...nor",
  ],
}

// ─── 13. Time Clauses ───────────────────────────────────────────────────────
const TIME_CLAUSES: DemoLesson = {
  id: 'time-clauses-demo',
  skill: 'Vaqt ergash gaplari — when, as soon as, until',
  level: 'B1',
  emoji: '⏱️',
  context: {
    text: "Tasavvur qiling — rejangizni aytyapsiz: \"Uyga YETIB BORGACH, sizga qo'ng'iroq qilaman\". Kelajak haqida, lekin vaqt gapida Present zamon ishlatiladi! Keling, vaqt ergash gaplarini o'rganamiz!",
    location: 'Real vaziyat · Reja aytish',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "when, as soon as, until, before, after — vaqt bog'lovchilari",
      "Vaqt gapida kelajak uchun Present Simple ishlatiladi!",
      "I'll call you when I arrive (will arrive EMAS)",
      "as soon as — ...ishi bilanoq · until — ...gacha",
    ],
  },
  examples: [
    { en: "I'll call you when I arrive.",      uz: 'Yetib borgach sizga qo\'ng\'iroq qilaman.', key: 'when I arrive' },
    { en: 'Wait here until I come back.',      uz: 'Men qaytgunimgacha bu yerda kuting.',    key: 'until' },
    { en: "As soon as it stops, we'll go.",    uz: 'To\'xtashi bilan boramiz.',             key: 'as soon as' },
    { en: 'Call me before you leave.',         uz: 'Ketishingizdan oldin menga qo\'ng\'iroq qiling.', key: 'before' },
  ],
  vocab: [
    { en: 'when',     uz: 'qachonki, ...gach', emoji: '🕐', example: 'when I arrive' },
    { en: 'as soon as', uz: '...ishi bilanoq', emoji: '⚡', example: 'as soon as I can' },
    { en: 'until',    uz: '...gacha',           emoji: '🏁', example: 'until you finish' },
    { en: 'before',   uz: '...dan oldin',      emoji: '⬅️', example: 'before you go' },
    { en: 'after',    uz: '...dan keyin',      emoji: '➡️', example: 'after we eat' },
    { en: 'by the time', uz: '...paytiga kelib', emoji: '⏰', example: 'by the time you come' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'when', uz: '...gach' }, { en: 'as soon as', uz: '...bilanoq' }, { en: 'until', uz: '...gacha' }, { en: 'before', uz: '...dan oldin' }], explanation: "Vaqt bog'lovchilari." },
    { type: 'choose', sentence: "I'll text you when I ___.", options: ['arrive', 'will arrive', 'arrived'], correct: 'arrive', uz: 'Yetib borganimda sizga yozaman.', explanation: "Vaqt gapida kelajak uchun Present Simple (arrive, will EMAS)!" },
    { type: 'choose', sentence: 'Wait here until I ___ back.', options: ['come', 'will come', 'came'], correct: 'come', uz: 'Men qaytgunimgacha bu yerda kuting.', explanation: "until + Present Simple (come)." },
    { type: 'judge', sentence: "I'll call you when I will arrive.", isCorrect: false, explanation: "Noto'g'ri! Vaqt gapida will yo'q: 'when I arrive'." },
    { type: 'build', uz: 'To\'xtashi bilan biz boramiz.', words: ['As', 'soon', 'as', 'it', 'stops', 'we', 'will', 'go'], correct: ['As', 'soon', 'as', 'it', 'stops', 'we', 'will', 'go'], explanation: "as soon as + Present (stops), bosh gap will + go." },
    { type: 'choose', sentence: 'Call me before you ___.', options: ['leave', 'will leave', 'left'], correct: 'leave', uz: 'Ketishingizdan oldin menga qo\'ng\'iroq qiling.', explanation: "before + Present Simple (leave)." },
    { type: 'choose', sentence: "After I ___ dinner, I'll wash up.", options: ['finish', 'will finish', 'finished'], correct: 'finish', uz: 'Ovqatni tugatgach, idishlarni yuvaman.', explanation: "after + Present Simple (finish)." },
    { type: 'judge', sentence: "As soon as the bus comes, I'll get on.", isCorrect: true, explanation: "To'g'ri! as soon as + Present (comes), bosh gap will. Mukammal!" },
    { type: 'choose', sentence: "By the time you arrive, I ___ cooking.", options: ["'ll have finished", 'finish', 'finished'], correct: "'ll have finished", uz: 'Siz kelguningizgacha men pishirib bo\'lgan bo\'laman.', explanation: "by the time + Present (arrive), bosh gap kelajak (will have finished)." },
    { type: 'build', uz: 'Yetib borgach sizga qo\'ng\'iroq qilaman.', words: ['I', 'will', 'call', 'you', 'when', 'I', 'arrive'], correct: ['I', 'will', 'call', 'you', 'when', 'I', 'arrive'], explanation: "Bosh gap will, vaqt gapi Present (arrive)." },
    { type: 'judge', sentence: "Don't leave until the rain will stop.", isCorrect: false, explanation: "Noto'g'ri! until + Present: 'until the rain stops'." },
    { type: 'choose', sentence: "When you ___ ready, let me know.", options: ['are', 'will be', 'were'], correct: 'are', uz: 'Tayyor bo\'lganingizda menga ayting.', explanation: "when + Present (are), will EMAS." },
    { type: 'choose', sentence: "I won't go ___ you come with me.", options: ['until', 'when', 'before'], correct: 'until', uz: 'Siz men bilan kelmaguningizcha bormayman.', explanation: "until = ...gacha (shart)." },
    { type: 'build', uz: 'Men qaytgunimgacha bu yerda kuting.', words: ['Wait', 'here', 'until', 'I', 'come', 'back'], correct: ['Wait', 'here', 'until', 'I', 'come', 'back'], explanation: "until + Present Simple (come). Mukammal yakun!" },
  ],
  rule: {
    title: 'Time Clauses — to\'liq qoida',
    body: "Vaqt ergash gaplari — when, as soon as, until, before, after, by the time.\n\n⚠️ ENG MUHIM qoida:\n   • Vaqt gapida KELAJAK uchun PRESENT SIMPLE ishlatiladi!\n   • I'll call you when I ARRIVE. (will arrive ✗)\n   • As soon as it STOPS, we'll go.\n\n✅ Bosh gap → kelajak (will / be going to)\n   Vaqt gapi → Present Simple\n\n🕐 Bog'lovchilar:\n   • when — qachonki, ...gach\n   • as soon as — ...ishi bilanoq\n   • until — ...gacha (Don't go until I come)\n   • before / after — oldin / keyin\n   • by the time — paytiga kelib\n\n💡 by the time bilan ko'pincha Future Perfect:\n   By the time you arrive, I'll have finished.",
  },
  summary: [
    "Vaqt gapida kelajak uchun Present Simple!",
    "I'll call you when I arrive (will arrive emas)",
    "when, as soon as, until, before, after",
    "Bosh gap will, vaqt gapi Present",
  ],
}

// ─── 14. Indirect Questions ─────────────────────────────────────────────────
const INDIRECT_QUESTIONS: DemoLesson = {
  id: 'indirect-questions-demo',
  skill: 'Bilvosita savollar — muloyim so\'rash',
  level: 'B1',
  emoji: '🙏',
  context: {
    text: "Tasavvur qiling — notanish odamdan yo'l so'rayapsiz. \"Bank qayerda?\" o'rniga muloyimroq: \"Bank qayerda ekanini AYTA OLASIZMI?\". Bilvosita savollar muloyimroq eshitiladi. Keling, ularni o'rganamiz!",
    location: 'Real vaziyat · Muloyim so\'rov',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Bilvosita savol — muloyimroq (Could you tell me...?)",
      "So'z tartibi to'g'ri gapdek (ega + fe'l), savoldek EMAS",
      "Do/does/did yordamchisi YO'QOLADI",
      "Yes/No savollar uchun if/whether qo'shiladi",
    ],
  },
  examples: [
    { en: 'Could you tell me where the bank is?', uz: 'Bank qayerda ekanini ayta olasizmi?', key: 'where the bank is' },
    { en: 'Do you know what time it is?',      uz: 'Soat nechaligini bilasizmi?',           key: 'what time it is' },
    { en: 'I wonder if she is coming.',        uz: 'U kelyaptimi-yo\'qmi qiziq.',            key: 'if she is' },
    { en: 'Can you tell me how this works?',   uz: 'Bu qanday ishlashini ayta olasizmi?',   key: 'how this works' },
  ],
  vocab: [
    { en: 'Could you tell me...', uz: '...ayta olasizmi', emoji: '🙏', example: 'Could you tell me...?' },
    { en: 'Do you know...', uz: '...bilasizmi',  emoji: '❓', example: 'Do you know where...?' },
    { en: 'I wonder...', uz: '...qiziq',         emoji: '🤔', example: 'I wonder if...' },
    { en: 'if / whether', uz: '...mi-yo\'qmi',  emoji: '🔀', example: 'if it is true' },
    { en: 'polite',   uz: 'muloyim',            emoji: '😊', example: 'a polite question' },
    { en: 'word order', uz: 'so\'z tartibi',    emoji: '🔤', example: 'correct word order' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'Could you tell me', uz: 'ayta olasizmi' }, { en: 'Do you know', uz: 'bilasizmi' }, { en: 'I wonder', uz: 'qiziq' }, { en: 'if/whether', uz: 'mi-yo\'qmi' }], explanation: "Bilvosita savol boshlanishlari." },
    { type: 'choose', sentence: 'Could you tell me where the station ___?', options: ['is', 'is it', 'does'], correct: 'is', uz: 'Vokzal qayerda ekanini ayta olasizmi?', explanation: "Bilvosita: ega + fe'l (where the station IS), 'is it' EMAS." },
    { type: 'choose', sentence: 'Do you know what time the shop ___?', options: ['opens', 'does open', 'open'], correct: 'opens', uz: 'Do\'kon necha da ochilishini bilasizmi?', explanation: "do/does yo'qoladi → opens (oddiy tartib)." },
    { type: 'judge', sentence: 'Do you know where is the toilet?', isCorrect: false, explanation: "Noto'g'ri! Bilvosita → 'where the toilet IS' (is oxirida)." },
    { type: 'build', uz: 'U kelyaptimi-yo\'qmi qiziq.', words: ['I', 'wonder', 'if', 'she', 'is', 'coming'], correct: ['I', 'wonder', 'if', 'she', 'is', 'coming'], explanation: "Yes/No savol → if + ega + fe'l." },
    { type: 'choose', sentence: 'Can you tell me how this ___?', options: ['works', 'does work', 'work'], correct: 'works', uz: 'Bu qanday ishlashini ayta olasizmi?', explanation: "do yo'qoladi → works." },
    { type: 'choose', sentence: 'I\'d like to know ___ the meeting is today.', options: ['whether', 'what', 'how'], correct: 'whether', uz: 'Yig\'ilish bugunmi-yo\'qmi bilmoqchiman.', explanation: "Yes/No → whether (yoki if)." },
    { type: 'judge', sentence: 'Do you know what he wants?', isCorrect: true, explanation: "To'g'ri! Bilvosita: what he WANTS (oddiy tartib). Mukammal!" },
    { type: 'choose', sentence: 'Could you tell me where she ___?', options: ['lives', 'does live', 'live'], correct: 'lives', uz: 'U qayerda yashashini ayta olasizmi?', explanation: "do yo'qoladi → lives." },
    { type: 'build', uz: 'Soat nechaligini bilasizmi?', words: ['Do', 'you', 'know', 'what', 'time', 'it', 'is'], correct: ['Do', 'you', 'know', 'what', 'time', 'it', 'is'], explanation: "Bilvosita: what time it IS (oddiy tartib)." },
    { type: 'judge', sentence: 'I wonder if does he know.', isCorrect: false, explanation: "Noto'g'ri! if + ega + fe'l: 'I wonder if he knows' (does yo'q)." },
    { type: 'choose', sentence: 'Can you tell me why the train ___ late?', options: ['is', 'is it', 'does'], correct: 'is', uz: 'Poyezd nega kechikayotganini ayta olasizmi?', explanation: "Bilvosita: why the train IS late." },
    { type: 'choose', sentence: 'I\'m not sure ___ he will come.', options: ['whether', 'what', 'where'], correct: 'whether', uz: 'U keladimi-yo\'qmi ishonchim komil emas.', explanation: "Yes/No → whether/if." },
    { type: 'build', uz: 'Bank qayerda ekanini ayta olasizmi?', words: ['Could', 'you', 'tell', 'me', 'where', 'the', 'bank', 'is'], correct: ['Could', 'you', 'tell', 'me', 'where', 'the', 'bank', 'is'], explanation: "where the bank IS (oddiy tartib). Mukammal yakun!" },
  ],
  rule: {
    title: 'Indirect Questions — to\'liq qoida',
    body: "Bilvosita savol — muloyimroq va rasmiyroq.\n\n🙏 Boshlanishlar:\n   • Could you tell me...? · Do you know...?\n   • I wonder... · I'd like to know...\n\n⚠️ ENG MUHIM — SO'Z TARTIBI:\n   • To'g'ri gapdek: ega + fe'l (savoldek EMAS!)\n   • Where IS the bank? → ...where the bank IS.\n   • do/does/did YO'QOLADI:\n     What does he want? → ...what he WANTS.\n\n🔀 Yes/No savollar → if yoki whether:\n   • Is she coming? → I wonder IF she is coming.\n   • Will he help? → ...whether he will help.\n\n💡 Wh- so'z saqlanadi: where, what, why, how, when",
  },
  summary: [
    "Could you tell me...? — muloyimroq",
    "So'z tartibi: ega + fe'l (savoldek emas)",
    "do/does/did yo'qoladi (what he wants)",
    "Yes/No savol → if / whether",
  ],
}

// ─── 15. So / Neither + Auxiliaries ─────────────────────────────────────────
const SO_NEITHER_AUX: DemoLesson = {
  id: 'so-neither-auxiliaries-demo',
  skill: 'So / Neither + yordamchi — "men ham" deyish',
  level: 'B1',
  emoji: '🤝',
  context: {
    text: "Tasavvur qiling — do'stingiz: \"Men charchadim\" deydi, siz: \"MEN HAM\" deysiz. Yoki u: \"Men qahva ichmayman\", siz: \"MEN HAM ichmayman\". Qisqa rozilik bildirish. Keling, so/neither tuzilmasini o'rganamiz!",
    location: 'Real vaziyat · Rozilik bildirish',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "So + yordamchi + ega — ijobiyga rozilik (So am I = men ham)",
      "Neither + yordamchi + ega — inkorga rozilik (Neither do I)",
      "Yordamchi fe'l gapga moslashadi (be, do, have, can...)",
      "Teskari tartib: yordamchi EGADAN oldin keladi",
    ],
  },
  examples: [
    { en: '"I\'m tired." "So am I."',          uz: '"Men charchadim." "Men ham."',          key: 'So am I' },
    { en: '"I don\'t smoke." "Neither do I."', uz: '"Men chekmayman." "Men ham."',          key: 'Neither do I' },
    { en: '"I can swim." "So can I."',         uz: '"Men suza olaman." "Men ham."',         key: 'So can I' },
    { en: '"I haven\'t eaten." "Neither have I."', uz: '"Men ovqatlanmadim." "Men ham."',   key: 'Neither have I' },
  ],
  vocab: [
    { en: 'So am I',  uz: 'men ham (be)',     emoji: '✅', example: '"I\'m happy." "So am I."' },
    { en: 'So do I',  uz: 'men ham (do)',     emoji: '🔄', example: '"I like it." "So do I."' },
    { en: 'Neither do I', uz: 'men ham (inkor)', emoji: '🚫', example: '"Neither do I."' },
    { en: 'So can I', uz: 'men ham (modal)',  emoji: '🎯', example: '"So can I."' },
    { en: 'Me too',   uz: 'men ham (norasmiy)', emoji: '👍', example: '"Me too."' },
    { en: 'Me neither', uz: 'men ham emas (norasmiy)', emoji: '👎', example: '"Me neither."' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'So am I', uz: 'men ham (be)' }, { en: 'So do I', uz: 'men ham (do)' }, { en: 'Neither do I', uz: 'men ham (inkor)' }, { en: 'So can I', uz: 'men ham (can)' }], explanation: "So/Neither + yordamchi." },
    { type: 'choose', sentence: '"I\'m hungry." "So ___ I."', options: ['am', 'do', 'have'], correct: 'am', uz: '"Men ochman." "Men ham."', explanation: "be (I'm) → So AM I." },
    { type: 'choose', sentence: '"I love pizza." "So ___ I."', options: ['do', 'am', 'have'], correct: 'do', uz: '"Men pitsani yaxshi ko\'raman." "Men ham."', explanation: "Oddiy fe'l (love) → So DO I." },
    { type: 'judge', sentence: '"I don\'t like it." "So do I."', isCorrect: false, explanation: "Noto'g'ri! Inkorga → Neither: 'Neither do I'." },
    { type: 'build', uz: '"Men chekmayman." "Men ham."', words: ['Neither', 'do', 'I'], correct: ['Neither', 'do', 'I'], explanation: "Inkor (don't) → Neither do I." },
    { type: 'choose', sentence: '"I can\'t swim." "Neither ___ I."', options: ['can', 'do', 'am'], correct: 'can', uz: '"Men suza olmayman." "Men ham."', explanation: "can't → Neither CAN I." },
    { type: 'choose', sentence: '"I have finished." "So ___ I."', options: ['have', 'do', 'am'], correct: 'have', uz: '"Men tugatdim." "Men ham."', explanation: "have finished → So HAVE I." },
    { type: 'judge', sentence: '"I\'m bored." "So am I."', isCorrect: true, explanation: "To'g'ri! be → So am I. Mukammal!" },
    { type: 'choose', sentence: '"I didn\'t go." "Neither ___ I."', options: ['did', 'do', 'was'], correct: 'did', uz: '"Men bormadim." "Men ham."', explanation: "didn't → Neither DID I." },
    { type: 'build', uz: '"Men suza olaman." "Men ham."', words: ['So', 'can', 'I'], correct: ['So', 'can', 'I'], explanation: "can → So can I." },
    { type: 'judge', sentence: '"I won\'t come." "So will I."', isCorrect: false, explanation: "Noto'g'ri! Inkorga → Neither: 'Neither will I'." },
    { type: 'choose', sentence: '"I work hard." "So ___ I."', options: ['do', 'am', 'work'], correct: 'do', uz: '"Men qattiq ishlayman." "Men ham."', explanation: "Oddiy fe'l → So DO I." },
    { type: 'choose', sentence: '"I haven\'t seen it." "Neither ___ I."', options: ['have', 'did', 'do'], correct: 'have', uz: '"Men uni ko\'rmadim." "Men ham."', explanation: "haven't → Neither HAVE I." },
    { type: 'build', uz: '"Men ovqatlanmadim." "Men ham."', words: ['Neither', 'have', 'I'], correct: ['Neither', 'have', 'I'], explanation: "haven't eaten → Neither have I. Mukammal yakun!" },
  ],
  rule: {
    title: 'So / Neither + Auxiliaries — to\'liq qoida',
    body: "Boshqa odamning gapiga qisqa rozilik bildirish.\n\n✅ So + yordamchi + ega — IJOBIYGA:\n   • \"I'm tired.\" → \"So am I.\"\n   • \"I like it.\" → \"So do I.\"\n   • \"I can swim.\" → \"So can I.\"\n\n🚫 Neither + yordamchi + ega — INKORGA:\n   • \"I don't smoke.\" → \"Neither do I.\"\n   • \"I can't go.\" → \"Neither can I.\"\n   ⚠️ Neither o'zi inkor — fe'l ijobiy!\n\n⚡ Yordamchi fe'l gapga moslashadi:\n   • be → am/is/are · oddiy fe'l → do/does/did\n   • have (perfect) → have/has · modal → can/will\n\n👍 Norasmiy: Me too (ijobiy) · Me neither (inkor)",
  },
  summary: [
    "So + yordamchi + ega (ijobiyga): So am I",
    "Neither + yordamchi + ega (inkorga): Neither do I",
    "Yordamchi gapga moslashadi (be/do/have/can)",
    "Norasmiy: Me too / Me neither",
  ],
}

// ─── 16. Wishes & Regrets ───────────────────────────────────────────────────
const WISHES_REGRETS: DemoLesson = {
  id: 'wishes-regrets-demo',
  skill: 'Istaklar va afsus — wish, if only',
  level: 'B1',
  emoji: '🌠',
  context: {
    text: "Tasavvur qiling — hozirgi yoki o'tmishdagi narsadan afsuslanyapsiz: \"Koshki KATTAROQ uyim BO'LSA edi... Koshki o'sha imtihonga TAYYORLANGAN BO'LSAM edi\". Hozir va o'tmish haqida istak. Keling, wish/if only'ni o'rganamiz!",
    location: 'Real vaziyat · Afsus va orzu',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "wish + Past Simple — hozirgi holatdan afsus (I wish I had...)",
      "wish + Past Perfect — o'tmishdagi afsus (I wish I had gone)",
      "wish + would — boshqalarning bezovta qiluvchi odati",
      "if only — kuchliroq afsus (= I wish)",
    ],
  },
  examples: [
    { en: 'I wish I had a car.',               uz: 'Koshki mashinam bo\'lsa edi.',          key: 'wish I had' },
    { en: 'I wish I had studied harder.',      uz: 'Koshki qattiqroq o\'qiganimda edi.',    key: 'had studied' },
    { en: 'I wish you would stop shouting.',   uz: 'Koshki baqirishni to\'xtatsangiz edi.', key: 'would stop' },
    { en: 'If only I were taller!',            uz: 'Koshki balandroq bo\'lganimda!',        key: 'If only' },
  ],
  vocab: [
    { en: 'wish + Past', uz: 'koshki ... bo\'lsa', emoji: '🌠', example: 'I wish I knew' },
    { en: 'wish + Past Perfect', uz: 'koshki ... qilganimda', emoji: '⏮️', example: 'I wish I had gone' },
    { en: 'wish + would', uz: 'koshki ... qilsa', emoji: '🙄', example: 'I wish he would stop' },
    { en: 'if only', uz: 'koshki (kuchli)',  emoji: '💫', example: 'If only I could!' },
    { en: 'were',     uz: 'bo\'lsa edi (wish bilan)', emoji: '🔮', example: 'I wish I were rich' },
    { en: 'regret',   uz: 'afsuslanmoq',      emoji: '😔', example: 'I regret it' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'wish + Past', uz: 'hozirgi afsus' }, { en: 'wish + Past Perfect', uz: 'o\'tmish afsusi' }, { en: 'wish + would', uz: 'bezovta odat' }, { en: 'if only', uz: 'kuchli afsus' }], explanation: "Wish turlari." },
    { type: 'choose', sentence: 'I wish I ___ a bigger house.', options: ['had', 'have', 'will have'], correct: 'had', uz: 'Koshki kattaroq uyim bo\'lsa edi.', explanation: "Hozirgi afsus → wish + Past Simple (had)." },
    { type: 'choose', sentence: 'I wish I ___ harder for the exam.', options: ['had studied', 'studied', 'study'], correct: 'had studied', uz: 'Koshki imtihonga qattiqroq tayyorlanganimda edi.', explanation: "O'tmish afsusi → wish + Past Perfect (had studied)." },
    { type: 'judge', sentence: 'I wish I have more time.', isCorrect: false, explanation: "Noto'g'ri! wish + Past: 'I wish I had more time'." },
    { type: 'build', uz: 'Koshki balandroq bo\'lganimda!', words: ['If', 'only', 'I', 'were', 'taller'], correct: ['If', 'only', 'I', 'were', 'taller'], explanation: "if only + were (wish bilan was o'rniga were)." },
    { type: 'choose', sentence: 'I wish you ___ stop interrupting me.', options: ['would', 'will', 'had'], correct: 'would', uz: 'Koshki menni to\'xtatishni bas qilsangiz edi.', explanation: "Boshqaning bezovta odati → wish + would." },
    { type: 'choose', sentence: 'She wishes she ___ to the party last night.', options: ['had gone', 'went', 'goes'], correct: 'had gone', uz: 'U kecha bazmga borganida edi deb afsuslanyapti.', explanation: "O'tmish afsusi → wish + Past Perfect (had gone)." },
    { type: 'judge', sentence: 'I wish I knew the answer.', isCorrect: true, explanation: "To'g'ri! Hozirgi afsus → wish + Past (knew). Mukammal!" },
    { type: 'choose', sentence: 'If only I ___ speak French!', options: ['could', 'can', 'will'], correct: 'could', uz: 'Koshki fransuzcha gapira olsam edi!', explanation: "if only + could (qobiliyat istagi)." },
    { type: 'build', uz: 'Koshki mashinam bo\'lsa edi.', words: ['I', 'wish', 'I', 'had', 'a', 'car'], correct: ['I', 'wish', 'I', 'had', 'a', 'car'], explanation: "Hozirgi afsus → wish + had." },
    { type: 'judge', sentence: 'I wish I had listened to your advice.', isCorrect: true, explanation: "To'g'ri! O'tmish afsusi → wish + Past Perfect. Mukammal!" },
    { type: 'choose', sentence: 'I wish it ___ raining. We could go out.', options: ['would stop', 'stops', 'stopped'], correct: 'would stop', uz: 'Koshki yomg\'ir to\'xtasa edi. Sayrga chiqardik.', explanation: "Bezovta holat o'zgarishi → wish + would stop." },
    { type: 'choose', sentence: 'I wish I ___ richer.', options: ['were', 'am', 'will be'], correct: 'were', uz: 'Koshki boyroq bo\'lganimda edi.', explanation: "wish + were (rasmiy, was o'rniga)." },
    { type: 'build', uz: 'Koshki qattiqroq o\'qiganimda edi.', words: ['I', 'wish', 'I', 'had', 'studied', 'harder'], correct: ['I', 'wish', 'I', 'had', 'studied', 'harder'], explanation: "O'tmish afsusi → wish + had studied. Mukammal yakun!" },
  ],
  rule: {
    title: 'Wishes & Regrets — to\'liq qoida',
    body: "Hozirgi yoki o'tmishdagi narsadan afsus/istak.\n\n🌠 wish + Past Simple — HOZIRGI holat afsusi:\n   • I wish I had a car. (hozir yo'q)\n   • I wish I knew the answer.\n   • wish + were (rasmiy): I wish I were taller.\n\n⏮️ wish + Past Perfect — O'TMISH afsusi:\n   • I wish I had studied harder. (o'tmishda qilmadim)\n   • She wishes she had gone.\n\n🙄 wish + would — boshqaning bezovta ODATI:\n   • I wish you would stop shouting.\n   (faqat boshqa odam/narsa uchun, o'zing emas)\n\n💫 if only — KUCHLIROQ afsus (= I wish):\n   • If only I were rich! · If only I had known!",
  },
  summary: [
    "wish + Past Simple — hozirgi afsus (I wish I had)",
    "wish + Past Perfect — o'tmish afsusi (had studied)",
    "wish + would — boshqaning bezovta odati",
    "if only — kuchliroq afsus",
  ],
}

// ─── 17. First Conditional (Full) ───────────────────────────────────────────
const FIRST_CONDITIONAL_B1: DemoLesson = {
  id: 'first-conditional-b1-demo',
  skill: 'Birinchi shart (to\'liq) — if, unless, as long as, in case',
  level: 'B1',
  emoji: '🔑',
  context: {
    text: "Tasavvur qiling — kelishuv shartlarini muhokama qilyapsiz: \"AGAR vaqtida to'lasangiz, chegirma bor. To'lamaSANGIZ, shartnoma bekor\". Real shartlarni turli bog'lovchilar bilan ifodalash. Keling, to'liq first conditional'ni o'rganamiz!",
    location: 'Real vaziyat · Shartlarni kelishish',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "If + Present Simple, will + V1 (real kelajak sharti)",
      "unless = if...not (agar ...masa)",
      "as long as / provided that — sharti bilan",
      "in case — har ehtimolga qarshi (oldindan ehtiyot)",
    ],
  },
  examples: [
    { en: 'If you pay on time, you get a discount.', uz: 'Vaqtida to\'lasangiz, chegirma olasiz.', key: 'If you pay' },
    { en: "Unless you hurry, you'll be late.",  uz: 'Shoshilmasangiz, kechikasiz.',          key: 'Unless' },
    { en: 'You can stay as long as you are quiet.', uz: 'Jim bo\'lsangiz, qola olasiz.',      key: 'as long as' },
    { en: 'Take an umbrella in case it rains.',  uz: 'Yomg\'ir yog\'sa deb soyabon oling.',   key: 'in case' },
  ],
  vocab: [
    { en: 'if',       uz: 'agar',             emoji: '🔀', example: 'if it rains' },
    { en: 'unless',   uz: 'agar ...masa',     emoji: '⛔', example: 'unless you try' },
    { en: 'as long as', uz: 'sharti bilan',   emoji: '🤝', example: 'as long as you pay' },
    { en: 'provided that', uz: 'rasmiy shart', emoji: '📜', example: 'provided that...' },
    { en: 'in case',  uz: 'har ehtimolga qarshi', emoji: '☂️', example: 'in case it rains' },
    { en: 'otherwise', uz: 'aks holda',       emoji: '↪️', example: 'hurry, otherwise...' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'if', uz: 'agar' }, { en: 'unless', uz: 'agar ...masa' }, { en: 'as long as', uz: 'sharti bilan' }, { en: 'in case', uz: 'har ehtimolga qarshi' }], explanation: "Shart bog'lovchilari." },
    { type: 'choose', sentence: 'If you ___ hard, you will succeed.', options: ['work', 'will work', 'worked'], correct: 'work', uz: 'Qattiq ishlasangiz, muvaffaqiyatga erishasiz.', explanation: "Shart qismida Present Simple (work), will EMAS." },
    { type: 'choose', sentence: '___ you leave now, you\'ll miss the bus.', options: ['Unless', 'If', 'In case'], correct: 'Unless', uz: 'Hozir ketmasangiz, avtobusga kech qolasiz.', explanation: "unless = if...not (agar ketmaSANGIZ)." },
    { type: 'judge', sentence: 'Unless you don\'t study, you will fail.', isCorrect: false, explanation: "Noto'g'ri! unless o'zi inkor — qo'sh inkor bo'lmaydi: 'Unless you study, you will fail'." },
    { type: 'build', uz: 'Jim bo\'lsangiz, qola olasiz.', words: ['You', 'can', 'stay', 'as', 'long', 'as', 'you', 'are', 'quiet'], correct: ['You', 'can', 'stay', 'as', 'long', 'as', 'you', 'are', 'quiet'], explanation: "as long as + Present (are quiet) — sharti bilan." },
    { type: 'choose', sentence: 'Take a key ___ you get locked out.', options: ['in case', 'unless', 'if'], correct: 'in case', uz: 'Tashqarida qolib ketsangiz deb kalit oling.', explanation: "in case — oldindan ehtiyot (har ehtimolga qarshi)." },
    { type: 'choose', sentence: 'You\'ll get the job ___ you have experience.', options: ['provided that', 'unless', 'otherwise'], correct: 'provided that', uz: 'Tajribangiz bo\'lsa, ishni olasiz.', explanation: "provided that — rasmiy shart (sharti bilan)." },
    { type: 'judge', sentence: "If it rains, we'll stay home.", isCorrect: true, explanation: "To'g'ri! If + Present (rains), will + V1 (stay). Mukammal!" },
    { type: 'choose', sentence: 'Hurry up, ___ you\'ll be late.', options: ['otherwise', 'unless', 'in case'], correct: 'otherwise', uz: 'Shoshiling, aks holda kechikasiz.', explanation: "otherwise — aks holda (natija)." },
    { type: 'build', uz: 'Shoshilmasangiz, kechikasiz.', words: ['Unless', 'you', 'hurry', 'you', 'will', 'be', 'late'], correct: ['Unless', 'you', 'hurry', 'you', 'will', 'be', 'late'], explanation: "Unless + Present (hurry), will + be late." },
    { type: 'judge', sentence: 'In case it will rain, take an umbrella.', isCorrect: false, explanation: "Noto'g'ri! in case + Present: 'in case it rains' (will yo'q)." },
    { type: 'choose', sentence: 'I\'ll lend you money ___ you pay it back.', options: ['as long as', 'unless', 'otherwise'], correct: 'as long as', uz: 'Qaytarib bersangiz, pul qarz beraman.', explanation: "as long as — sharti bilan." },
    { type: 'choose', sentence: 'If she ___ me, I\'ll help her.', options: ['asks', 'will ask', 'asked'], correct: 'asks', uz: 'Agar u mendan so\'rasa, yordam beraman.', explanation: "Shart qismida Present Simple (asks)." },
    { type: 'build', uz: 'Vaqtida to\'lasangiz, chegirma olasiz.', words: ['If', 'you', 'pay', 'on', 'time', 'you', 'get', 'a', 'discount'], correct: ['If', 'you', 'pay', 'on', 'time', 'you', 'get', 'a', 'discount'], explanation: "If + Present (pay), Present natija (get) — doimiy haqiqat ham bo'ladi. Mukammal yakun!" },
  ],
  rule: {
    title: 'First Conditional (Full) — to\'liq qoida',
    body: "Real, mumkin bo'lgan kelajak sharti + turli bog'lovchilar.\n\n✅ Asosiy: If + Present Simple, will + V1\n   • If you study, you will pass.\n   ⚠️ Shart qismida WILL ishlatilmaydi!\n\n⛔ unless = if ... not:\n   • Unless you hurry, you'll be late.\n   (qo'sh inkor BO'LMAYDI!)\n\n🤝 as long as / provided that — SHARTI BILAN:\n   • You can stay as long as you're quiet.\n\n☂️ in case — HAR EHTIMOLGA QARSHI (oldindan):\n   • Take an umbrella in case it rains.\n   (if emas — oldindan ehtiyot chorasi)\n\n↪️ otherwise — AKS HOLDA:\n   • Hurry, otherwise you'll be late.",
  },
  summary: [
    "If + Present Simple, will + V1 (shartda will yo'q)",
    "unless = if...not (qo'sh inkor yo'q)",
    "as long as / provided that — sharti bilan",
    "in case — oldindan ehtiyot · otherwise — aks holda",
  ],
}

// ─── 18. Reported Speech (Full) ─────────────────────────────────────────────
const REPORTED_SPEECH_B1: DemoLesson = {
  id: 'reported-speech-b1-demo',
  skill: 'O\'zlashtirma gap (to\'liq) — gaplar, savollar, buyruqlar',
  level: 'B1',
  emoji: '🗣️',
  context: {
    text: "Tasavvur qiling — suhbatni boshqasiga yetkazyapsiz: U \"Qayerda yashaysan?\" deb SO'RADI, keyin \"Menga yordam ber\" deb AYTDI. Gaplar, savollar va buyruqlarni qayta aytish. Keling, to'liq reported speech'ni o'rganamiz!",
    location: 'Real vaziyat · Suhbatni yetkazish',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Gaplar: zamon orqaga (is → was, will → would)",
      "Savollar: ask + if/whether yoki wh-so'z, oddiy tartib",
      "Buyruqlar: tell/ask + odam + to + V1 (told me to wait)",
      "Olmosh, vaqt va joy so'zlari ham o'zgaradi",
    ],
  },
  examples: [
    { en: 'He said he was busy.',              uz: 'U band ekanini aytdi.',                 key: 'said he was' },
    { en: 'She asked where I lived.',          uz: 'U menga qayerda yashashimi so\'radi.',  key: 'asked where' },
    { en: 'He asked if I was ready.',          uz: 'U tayyormiman deb so\'radi.',           key: 'asked if' },
    { en: 'She told me to wait.',              uz: 'U menga kutishni aytdi.',               key: 'told me to' },
  ],
  vocab: [
    { en: 'say (that)', uz: 'aytmoq (gap)',   emoji: '💬', example: 'He said that...' },
    { en: 'ask if/whether', uz: 'so\'ramoq (yes/no)', emoji: '❓', example: 'asked if...' },
    { en: 'ask + wh-', uz: 'so\'ramoq (wh)',  emoji: '🔍', example: 'asked where...' },
    { en: 'tell sb to', uz: 'buyurmoq',       emoji: '👉', example: 'told me to go' },
    { en: 'ask sb to', uz: 'iltimos qilmoq',  emoji: '🙏', example: 'asked me to wait' },
    { en: 'tell sb not to', uz: 'taqiqlamoq', emoji: '🚫', example: 'told me not to' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'say', uz: 'aytmoq (gap)' }, { en: 'ask if', uz: 'so\'ramoq (yes/no)' }, { en: 'tell sb to', uz: 'buyurmoq' }, { en: 'ask sb to', uz: 'iltimos qilmoq' }], explanation: "Reported speech fe'llari." },
    { type: 'choose', sentence: 'He said he ___ busy.', options: ['was', 'is', 'will be'], correct: 'was', uz: 'U band ekanini aytdi.', explanation: "is → was (zamon orqaga)." },
    { type: 'choose', sentence: 'She asked where I ___.', options: ['lived', 'live', 'do live'], correct: 'lived', uz: 'U qayerda yashashimi so\'radi.', explanation: "Savol → oddiy tartib (where I lived), do yo'q." },
    { type: 'judge', sentence: 'He asked me where do I work.', isCorrect: false, explanation: "Noto'g'ri! Reported savol → oddiy tartib: 'where I worked' (do yo'q)." },
    { type: 'build', uz: 'U menga kutishni aytdi.', words: ['She', 'told', 'me', 'to', 'wait'], correct: ['She', 'told', 'me', 'to', 'wait'], explanation: "Buyruq → tell + odam + to + V1." },
    { type: 'choose', sentence: 'He asked ___ I was ready.', options: ['if', 'that', 'what'], correct: 'if', uz: 'U tayyormiman deb so\'radi.', explanation: "Yes/No savol → ask if/whether." },
    { type: 'choose', sentence: 'She told me ___ touch it.', options: ['not to', "don't", 'to not'], correct: 'not to', uz: 'U menga unga tegmaslikni aytdi.', explanation: "Taqiq → tell + odam + NOT to + V1." },
    { type: 'judge', sentence: 'She said she would come the next day.', isCorrect: true, explanation: "To'g'ri! will → would, tomorrow → the next day. Mukammal!" },
    { type: 'choose', sentence: 'They said they ___ finished.', options: ['had', 'have', 'has'], correct: 'had', uz: 'Ular tugatdik deb aytishdi.', explanation: "have finished → had finished (Present Perfect → Past Perfect)." },
    { type: 'build', uz: 'U menga qayerda yashashimi so\'radi.', words: ['He', 'asked', 'me', 'where', 'I', 'lived'], correct: ['He', 'asked', 'me', 'where', 'I', 'lived'], explanation: "ask + odam + wh + oddiy tartib (where I lived)." },
    { type: 'judge', sentence: 'He told to me to sit down.', isCorrect: false, explanation: "Noto'g'ri! tell + odam (to YO'Q oldidan): 'He told me to sit down'." },
    { type: 'choose', sentence: 'She asked me ___ help her.', options: ['to', 'that', 'if to'], correct: 'to', uz: 'U mendan yordam berishni so\'radi.', explanation: "Iltimos → ask + odam + to + V1." },
    { type: 'choose', sentence: 'He said he ___ swim well.', options: ['could', 'can', 'will'], correct: 'could', uz: 'U yaxshi suza olishini aytdi.', explanation: "can → could." },
    { type: 'build', uz: 'U band ekanini aytdi.', words: ['He', 'said', 'he', 'was', 'busy'], correct: ['He', 'said', 'he', 'was', 'busy'], explanation: "said + he was (is → was). Mukammal yakun!" },
  ],
  rule: {
    title: 'Reported Speech (Full) — to\'liq qoida',
    body: "Gaplar, savollar va buyruqlarni qayta aytish.\n\n💬 GAPLAR — say/tell + zamon orqaga:\n   • is→was, do→did, will→would, can→could\n   • have done → had done\n   • \"I'm tired\" → He said he was tired.\n\n❓ SAVOLLAR — ask:\n   • Yes/No → ask if/whether: He asked if I was ready.\n   • Wh- → ask + wh + ODDIY tartib (do yo'q):\n     \"Where do you live?\" → She asked where I lived.\n\n👉 BUYRUQLAR — tell/ask + odam + (not) to + V1:\n   • \"Wait!\" → She told me to wait.\n   • \"Don't go!\" → He told me not to go.\n\n🕐 O'zgarishlar: now→then, today→that day,\n   tomorrow→the next day, here→there",
  },
  summary: [
    "Gaplar: zamon orqaga (is→was, will→would)",
    "Savollar: ask if/wh + oddiy tartib (do yo'q)",
    "Buyruqlar: tell/ask + odam + (not) to + V1",
    "now→then, tomorrow→the next day",
  ],
}

// ─── 19. Relative Clauses ───────────────────────────────────────────────────
const RELATIVE_CLAUSES: DemoLesson = {
  id: 'relative-clauses-b1-demo',
  skill: 'Sifatlovchi ergash gaplar — who, which, that, where',
  level: 'B1',
  emoji: '🔗',
  context: {
    text: "Tasavvur qiling — kimnidir ta'riflayapsiz: \"Bu menga yordam BERGAN odam... bu men o'sgan uy...\". Ikki gapni bitta qilib bog'lash. Keling, relative clauses (sifatlovchi gaplar)ni o'rganamiz!",
    location: 'Real vaziyat · Ta\'riflash',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "who — odamlar uchun · which — narsalar uchun",
      "that — odam yoki narsa (norasmiy) · where — joy",
      "whose — egalik · when — vaqt",
      "Defining (zarur) vs non-defining (qo'shimcha, vergulli)",
    ],
  },
  examples: [
    { en: 'The man who helped me was kind.',   uz: 'Menga yordam bergan odam mehribon edi.', key: 'who' },
    { en: 'The book which I read was great.',  uz: 'Men o\'qigan kitob ajoyib edi.',         key: 'which' },
    { en: 'This is the house where I grew up.', uz: 'Bu men o\'sgan uy.',                    key: 'where' },
    { en: "That's the girl whose dog ran away.", uz: 'Bu iti qochib ketgan qiz.',           key: 'whose' },
  ],
  vocab: [
    { en: 'who',      uz: 'kim (odam)',       emoji: '🧑', example: 'the man who...' },
    { en: 'which',    uz: 'qaysi (narsa)',    emoji: '📦', example: 'the book which...' },
    { en: 'that',     uz: 'ki (odam/narsa)',  emoji: '🔗', example: 'the thing that...' },
    { en: 'where',    uz: 'qayerda (joy)',    emoji: '📍', example: 'the place where...' },
    { en: 'whose',    uz: 'kimning (egalik)', emoji: '🔑', example: 'the boy whose...' },
    { en: 'when',     uz: 'qachon (vaqt)',    emoji: '🕐', example: 'the day when...' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'who', uz: 'odam' }, { en: 'which', uz: 'narsa' }, { en: 'where', uz: 'joy' }, { en: 'whose', uz: 'egalik' }], explanation: "Sifatlovchi olmoshlar." },
    { type: 'choose', sentence: 'The woman ___ lives next door is a doctor.', options: ['who', 'which', 'where'], correct: 'who', uz: 'Qo\'shnimda yashaydigan ayol shifokor.', explanation: "Odam → who." },
    { type: 'choose', sentence: 'The phone ___ I bought is expensive.', options: ['which', 'who', 'where'], correct: 'which', uz: 'Men sotib olgan telefon qimmat.', explanation: "Narsa → which (yoki that)." },
    { type: 'judge', sentence: 'The man which called you is here.', isCorrect: false, explanation: "Noto'g'ri! Odam → who: 'The man who called you'." },
    { type: 'build', uz: 'Bu men o\'sgan uy.', words: ['This', 'is', 'the', 'house', 'where', 'I', 'grew', 'up'], correct: ['This', 'is', 'the', 'house', 'where', 'I', 'grew', 'up'], explanation: "Joy → where." },
    { type: 'choose', sentence: "That's the boy ___ bike was stolen.", options: ['whose', 'who', 'which'], correct: 'whose', uz: 'Bu velosipedi o\'g\'irlangan bola.', explanation: "Egalik → whose." },
    { type: 'choose', sentence: 'Do you remember the day ___ we met?', options: ['when', 'where', 'which'], correct: 'when', uz: 'Biz uchrashgan kunni eslaysizmi?', explanation: "Vaqt → when." },
    { type: 'judge', sentence: 'My sister, who lives in Paris, is a nurse.', isCorrect: true, explanation: "To'g'ri! Non-defining (qo'shimcha ma'lumot) — vergullar bilan. Mukammal!" },
    { type: 'choose', sentence: 'The restaurant ___ we ate was lovely.', options: ['where', 'which', 'who'], correct: 'where', uz: 'Biz ovqatlangan restoran yoqimli edi.', explanation: "Joy → where." },
    { type: 'build', uz: 'Menga yordam bergan odam mehribon edi.', words: ['The', 'man', 'who', 'helped', 'me', 'was', 'kind'], correct: ['The', 'man', 'who', 'helped', 'me', 'was', 'kind'], explanation: "Odam → who helped me." },
    { type: 'judge', sentence: 'The car who I want is red.', isCorrect: false, explanation: "Noto'g'ri! Narsa → which/that: 'The car which I want'." },
    { type: 'choose', sentence: 'She is the person ___ I trust most.', options: ['who', 'which', 'where'], correct: 'who', uz: 'U men eng ishonadigan odam.', explanation: "Odam → who (yoki that)." },
    { type: 'choose', sentence: 'Paris, ___ is in France, is beautiful.', options: ['which', 'who', 'where'], correct: 'which', uz: 'Fransiyada joylashgan Parij go\'zal.', explanation: "Narsa/joy nomi (non-defining) → which." },
    { type: 'build', uz: 'Men o\'qigan kitob ajoyib edi.', words: ['The', 'book', 'which', 'I', 'read', 'was', 'great'], correct: ['The', 'book', 'which', 'I', 'read', 'was', 'great'], explanation: "Narsa → which I read. Mukammal yakun!" },
  ],
  rule: {
    title: 'Relative Clauses — to\'liq qoida',
    body: "Sifatlovchi gaplar — otni ta'riflaydi (ikki gapni bog'laydi).\n\n🔗 Olmoshlar:\n   • who — odamlar: the man who helped me\n   • which — narsalar: the book which I read\n   • that — odam/narsa (norasmiy): the thing that...\n   • where — joy: the house where I live\n   • whose — egalik: the boy whose dog...\n   • when — vaqt: the day when we met\n\n📌 Defining (zarur ma'lumot) — vergulSIZ:\n   • The man who called is my boss.\n   (kim ekanini aniqlaydi)\n\n📝 Non-defining (qo'shimcha) — VERGUL bilan:\n   • My boss, who is 40, is kind.\n   ⚠️ non-defining'da 'that' ISHLATILMAYDI!",
  },
  summary: [
    "who (odam) · which (narsa) · that (ikkalasi)",
    "where (joy) · whose (egalik) · when (vaqt)",
    "Defining — vergulsiz (zarur ma'lumot)",
    "Non-defining — vergul bilan (that yo'q)",
  ],
}

// ─── 20. Gerunds & Infinitives (Advanced) ───────────────────────────────────
const GERUNDS_INFINITIVES_B1: DemoLesson = {
  id: 'gerunds-infinitives-b1-demo',
  skill: 'Gerundiy va infinitiv (kengaytirilgan) — ma\'no farqi',
  level: 'B1',
  emoji: '🔀',
  context: {
    text: "Tasavvur qiling — \"Eshikni yopishni esladim\" va \"Eshikni yopishni UNUTDIM\" — remember/forget + ing yoki to bilan ma'no o'zgaradi! Ayrim fe'llar ikkala shaklni ham oladi, lekin ma'nosi farq qiladi. Keling, o'rganamiz!",
    location: 'Real vaziyat · Aniq ma\'no',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "remember/forget/stop — ing (o'tmish) yoki to (kelajak) bilan ma'no farq qiladi",
      "stop doing (to'xtatmoq) vs stop to do (... uchun to'xtamoq)",
      "Predloglardan keyin doim -ing (good at cooking)",
      "like + ing (umuman) vs would like + to (aniq holat)",
    ],
  },
  examples: [
    { en: 'I remember locking the door.',      uz: 'Eshikni yopganimi eslayman.',           key: 'remember locking' },
    { en: 'Remember to lock the door.',        uz: 'Eshikni yopishni unutmang.',            key: 'remember to lock' },
    { en: 'He stopped smoking.',               uz: 'U chekishni tashladi.',                 key: 'stopped smoking' },
    { en: 'He stopped to smoke.',              uz: 'U chekish uchun to\'xtadi.',            key: 'stopped to smoke' },
  ],
  vocab: [
    { en: 'remember + ing', uz: 'qilganini eslamoq', emoji: '🔙', example: 'remember doing' },
    { en: 'remember + to', uz: 'qilishni eslamoq', emoji: '🔜', example: 'remember to do' },
    { en: 'stop + ing', uz: 'to\'xtatmoq',    emoji: '🛑', example: 'stop talking' },
    { en: 'stop + to', uz: '...uchun to\'xtamoq', emoji: '⏸️', example: 'stop to rest' },
    { en: 'try + ing', uz: 'sinab ko\'rmoq',  emoji: '🧪', example: 'try restarting' },
    { en: 'try + to',  uz: 'harakat qilmoq',  emoji: '💪', example: 'try to win' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'remember + ing', uz: 'qilganini eslamoq' }, { en: 'remember + to', uz: 'qilishni eslamoq' }, { en: 'stop + ing', uz: 'to\'xtatmoq' }, { en: 'stop + to', uz: '...uchun to\'xtamoq' }], explanation: "Ma'no o'zgaradigan fe'llar." },
    { type: 'choose', sentence: 'I remember ___ this film before — it\'s familiar.', options: ['seeing', 'to see', 'see'], correct: 'seeing', uz: 'Men bu filmni avval ko\'rganimi eslayman — tanish.', explanation: "O'tmish xotirasi → remember + ing (seeing)." },
    { type: 'choose', sentence: 'Please remember ___ the milk on your way home.', options: ['to buy', 'buying', 'buy'], correct: 'to buy', uz: 'Uyga kelishda sut olishni unutmang.', explanation: "Kelajak vazifasi → remember + to (to buy)." },
    { type: 'judge', sentence: 'He stopped to smoke years ago (gave up).', isCorrect: false, explanation: "Tashlash ma'nosida → stop + ing: 'He stopped smoking years ago'." },
    { type: 'build', uz: 'U chekishni tashladi.', words: ['He', 'stopped', 'smoking'], correct: ['He', 'stopped', 'smoking'], explanation: "Odatni tashlash → stop + ing." },
    { type: 'choose', sentence: 'On the trip, we stopped ___ photos.', options: ['to take', 'taking', 'take'], correct: 'to take', uz: 'Sayohatda biz surat olish uchun to\'xtadik.', explanation: "Maqsad uchun to'xtash → stop + to (to take)." },
    { type: 'choose', sentence: 'I\'m good at ___ problems.', options: ['solving', 'to solve', 'solve'], correct: 'solving', uz: 'Men muammolarni hal qilishda yaxshiman.', explanation: "Predlogdan keyin (at) → doim -ing (solving)." },
    { type: 'judge', sentence: 'I forgot to call her — sorry!', isCorrect: true, explanation: "To'g'ri! Kelajak vazifasini bajarmaslik → forget + to. Mukammal!" },
    { type: 'choose', sentence: 'Try ___ the computer — it might fix the problem.', options: ['restarting', 'to restart', 'restart'], correct: 'restarting', uz: 'Kompyuterni qayta yoqib ko\'ring — muammoni hal qilishi mumkin.', explanation: "Yechim sinab ko'rish → try + ing (restarting)." },
    { type: 'build', uz: 'Eshikni yopishni unutmang.', words: ['Remember', 'to', 'lock', 'the', 'door'], correct: ['Remember', 'to', 'lock', 'the', 'door'], explanation: "Kelajak vazifasi → remember + to." },
    { type: 'judge', sentence: 'She is interested in to learn Spanish.', isCorrect: false, explanation: "Noto'g'ri! Predlogdan keyin -ing: 'interested in learning'." },
    { type: 'choose', sentence: 'I\'ll never forget ___ the Eiffel Tower for the first time.', options: ['seeing', 'to see', 'see'], correct: 'seeing', uz: 'Eyfel minorasi birinchi marta ko\'rganimi hech unutmayman.', explanation: "O'tmish xotirasi → forget + ing (seeing)." },
    { type: 'choose', sentence: 'He\'s thinking about ___ a new car.', options: ['buying', 'to buy', 'buy'], correct: 'buying', uz: 'U yangi mashina olishni o\'ylayapti.', explanation: "Predlogdan keyin (about) → -ing (buying)." },
    { type: 'build', uz: 'U chekish uchun to\'xtadi.', words: ['He', 'stopped', 'to', 'smoke'], correct: ['He', 'stopped', 'to', 'smoke'], explanation: "Maqsad → stop + to (chekish uchun to'xtadi). Mukammal yakun!" },
  ],
  rule: {
    title: 'Gerunds & Infinitives (Advanced) — to\'liq qoida',
    body: "Ayrim fe'llar -ing yoki to bilan MA'NOSI o'zgaradi.\n\n🔄 remember / forget:\n   • + ing → O'TMISH xotirasi: I remember locking it. (yopdim, eslayman)\n   • + to → KELAJAK vazifasi: Remember to lock it. (yopishni unutma)\n\n🛑 stop:\n   • + ing → to'xtatmoq: He stopped smoking. (tashladi)\n   • + to → ...uchun to'xtamoq: He stopped to smoke. (chekish uchun)\n\n🧪 try:\n   • + ing → sinab ko'rmoq: Try restarting it.\n   • + to → harakat qilmoq: Try to win.\n\n📌 Predloglardan keyin DOIM -ing:\n   • good at cooking · interested in learning\n   • think about going · instead of waiting",
  },
  summary: [
    "remember/forget + ing (o'tmish) vs + to (kelajak)",
    "stop + ing (tashlamoq) vs + to (...uchun)",
    "try + ing (sinab) vs + to (harakat)",
    "Predlogdan keyin doim -ing (good at cooking)",
  ],
}

// ─── 21. Phrasal Verbs ──────────────────────────────────────────────────────
const PHRASAL_VERBS_B1: DemoLesson = {
  id: 'phrasal-verbs-b1-demo',
  skill: 'Frazal fe\'llar — fe\'l + predlog/ravish',
  level: 'B1',
  emoji: '🧩',
  context: {
    text: "Tasavvur qiling — kundalik suhbat: \"Ertalab soat 7 da TURAMAN, kiyimlarimni KIYAMAN, do'stim bilan UCHRASHAMAN\". Frazal fe'llar so'zlashuv tilida juda ko'p. Keling, eng keraklilarini o'rganamiz!",
    location: 'Real vaziyat · Kundalik hayot',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Frazal fe'l = fe'l + predlog/ravish (get up, turn on)",
      "Ma'no ko'pincha alohida so'zlardan farq qiladi",
      "Ajraladigan: turn it on / turn on the TV (ikkalasi)",
      "Ajralmaydigan: look after the baby (look the baby after ✗)",
    ],
  },
  examples: [
    { en: 'I get up at 7 every day.',          uz: 'Men har kuni soat 7 da turaman.',       key: 'get up' },
    { en: 'Please turn on the light.',         uz: 'Iltimos chiroqni yoqing.',              key: 'turn on' },
    { en: 'She looks after her sister.',       uz: 'U singlisini parvarishlaydi.',          key: 'looks after' },
    { en: 'We ran out of milk.',               uz: 'Bizda sut tugadi.',                     key: 'ran out of' },
  ],
  vocab: [
    { en: 'get up',   uz: 'turmoq (uyqudan)', emoji: '⏰', example: 'get up early' },
    { en: 'turn on/off', uz: 'yoqmoq/o\'chirmoq', emoji: '💡', example: 'turn off the TV' },
    { en: 'look after', uz: 'parvarishlamoq', emoji: '🤱', example: 'look after kids' },
    { en: 'give up',  uz: 'tashlamoq/voz kechmoq', emoji: '🏳️', example: 'give up smoking' },
    { en: 'run out of', uz: 'tugamoq',        emoji: '📉', example: 'run out of time' },
    { en: 'put off',  uz: 'keyinga qoldirmoq', emoji: '⏭️', example: 'put off the meeting' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'get up', uz: 'turmoq' }, { en: 'turn on', uz: 'yoqmoq' }, { en: 'look after', uz: 'parvarishlamoq' }, { en: 'give up', uz: 'tashlamoq' }], explanation: "Asosiy frazal fe'llar." },
    { type: 'choose', sentence: 'I ___ at 6 am every morning.', options: ['get up', 'get on', 'get off'], correct: 'get up', uz: 'Men har ertalab soat 6 da turaman.', explanation: "Uyqudan turish → get up." },
    { type: 'choose', sentence: 'Can you ___ the TV? I want to watch news.', options: ['turn on', 'turn off', 'look after'], correct: 'turn on', uz: 'Televizorni yoqa olasizmi? Yangiliklarni ko\'rmoqchiman.', explanation: "Yoqmoq → turn on." },
    { type: 'judge', sentence: 'She looks her children after.', isCorrect: false, explanation: "Noto'g'ri! look after ajralmaydi: 'She looks after her children'." },
    { type: 'build', uz: 'Bizda sut tugadi.', words: ['We', 'ran', 'out', 'of', 'milk'], correct: ['We', 'ran', 'out', 'of', 'milk'], explanation: "Tugamoq → run out of." },
    { type: 'choose', sentence: 'He decided to ___ smoking for his health.', options: ['give up', 'give in', 'get up'], correct: 'give up', uz: 'U sog\'lig\'i uchun chekishni tashlashga qaror qildi.', explanation: "Voz kechmoq → give up." },
    { type: 'choose', sentence: 'Don\'t ___ until tomorrow what you can do today.', options: ['put off', 'put on', 'turn off'], correct: 'put off', uz: 'Bugun qila oladigan ishni ertagaga qoldirmang.', explanation: "Keyinga qoldirmoq → put off." },
    { type: 'judge', sentence: 'Turn off the lights when you leave.', isCorrect: true, explanation: "To'g'ri! O'chirmoq → turn off (ajraladi: turn the lights off ham). Mukammal!" },
    { type: 'choose', sentence: 'I need to ___ these new shoes.', options: ['try on', 'try out', 'put off'], correct: 'try on', uz: 'Men bu yangi tuflini kiyib ko\'rishim kerak.', explanation: "Kiyib ko'rmoq → try on." },
    { type: 'build', uz: 'U singlisini parvarishlaydi.', words: ['She', 'looks', 'after', 'her', 'sister'], correct: ['She', 'looks', 'after', 'her', 'sister'], explanation: "Parvarishlamoq → look after (ajralmaydi)." },
    { type: 'judge', sentence: "We've run out of time.", isCorrect: true, explanation: "To'g'ri! Tugamoq → run out of. Mukammal!" },
    { type: 'choose', sentence: 'Can you ___ the music? It\'s too loud.', options: ['turn down', 'turn up', 'get up'], correct: 'turn down', uz: 'Musiqani pasaytira olasizmi? Juda baland.', explanation: "Ovozni pasaytirmoq → turn down." },
    { type: 'choose', sentence: 'The meeting was ___ until next week.', options: ['put off', 'put on', 'given up'], correct: 'put off', uz: 'Yig\'ilish kelasi haftaga qoldirildi.', explanation: "Keyinga qoldirmoq → put off." },
    { type: 'build', uz: 'Iltimos chiroqni yoqing.', words: ['Please', 'turn', 'on', 'the', 'light'], correct: ['Please', 'turn', 'on', 'the', 'light'], explanation: "Yoqmoq → turn on. Mukammal yakun!" },
  ],
  rule: {
    title: 'Phrasal Verbs — to\'liq qoida',
    body: "Frazal fe'l = fe'l + predlog/ravish (yangi ma'no).\n\n🧩 Ma'no ko'pincha alohida so'zlardan FARQ qiladi:\n   • give up = voz kechmoq (give + up emas)\n   • look after = parvarishlamoq\n   • run out of = tugamoq\n\n↔️ Ajraladigan (separable):\n   • turn on the TV = turn the TV on ✓\n   • olmosh bilan FAQAT o'rtada: turn it on ✓ (turn on it ✗)\n\n🔒 Ajralmaydigan (inseparable):\n   • look after the baby ✓ (look the baby after ✗)\n   • run out of milk · get on the bus\n\n📚 Eng kerakli: get up, turn on/off, look after,\n   give up, run out of, put off, try on, turn down",
  },
  summary: [
    "Frazal fe'l = fe'l + predlog (yangi ma'no)",
    "Ajraladigan: turn on the TV / turn it on",
    "Ajralmaydigan: look after the baby",
    "get up, give up, run out of, put off...",
  ],
}

// ─── 22. All Conditionals (Comparison) ──────────────────────────────────────
const CONDITIONALS_COMPARISON: DemoLesson = {
  id: 'conditionals-comparison-b1-demo',
  skill: 'Barcha shart gaplar — zero, first, second, third',
  level: 'B1',
  emoji: '🎚️',
  context: {
    text: "Tasavvur qiling — turli shartlarni ifodalayapsiz: \"Suvni qizdirsang, qaynaydi (doimiy haqiqat). Yomg'ir yog'sa, uyda qolaman (real). Boy bo'lsam, sayohat qilardim (xayoliy). O'qiganimda edi, o'tgan bo'lardim (o'tmish afsusi)\". To'rt xil shart! Keling, hammasi ni solishtiramiz!",
    location: 'Real vaziyat · Turli shartlar',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Zero: If + Present, Present (doimiy haqiqat — water boils)",
      "First: If + Present, will + V1 (real kelajak)",
      "Second: If + Past, would + V1 (xayoliy hozir)",
      "Third: If + Past Perfect, would have + V3 (o'tmish afsusi)",
    ],
  },
  examples: [
    { en: 'If you heat ice, it melts.',         uz: 'Muzni qizdirsang, eriydi.',             key: 'Zero' },
    { en: 'If it rains, I will stay home.',     uz: 'Yomg\'ir yog\'sa, uyda qolaman.',       key: 'First' },
    { en: 'If I were rich, I would travel.',    uz: 'Boy bo\'lsam, sayohat qilardim.',       key: 'Second' },
    { en: 'If I had studied, I would have passed.', uz: 'O\'qiganimda, o\'tgan bo\'lardim.', key: 'Third' },
  ],
  vocab: [
    { en: 'Zero cond.', uz: 'doimiy haqiqat', emoji: '🔬', example: 'water boils at 100' },
    { en: 'First cond.', uz: 'real kelajak',  emoji: '🔮', example: 'if it rains...' },
    { en: 'Second cond.', uz: 'xayoliy hozir', emoji: '💭', example: 'if I were...' },
    { en: 'Third cond.', uz: 'o\'tmish afsusi', emoji: '⏮️', example: 'if I had known...' },
    { en: 'would',    uz: 'edi/bo\'lardi',    emoji: '🎚️', example: 'I would go' },
    { en: 'would have', uz: 'qilgan bo\'lardi', emoji: '🕰️', example: 'would have gone' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'Zero', uz: 'doimiy haqiqat' }, { en: 'First', uz: 'real kelajak' }, { en: 'Second', uz: 'xayoliy hozir' }, { en: 'Third', uz: 'o\'tmish afsusi' }], explanation: "To'rt shart turi." },
    { type: 'choose', sentence: 'If you heat water to 100°C, it ___.', options: ['boils', 'will boil', 'would boil'], correct: 'boils', uz: 'Suvni 100°C gacha qizdirsangiz, qaynaydi.', explanation: "Doimiy haqiqat (Zero) → If + Present, Present (boils)." },
    { type: 'choose', sentence: 'If it rains tomorrow, I ___ stay home.', options: ['will', 'would', 'would have'], correct: 'will', uz: 'Ertaga yomg\'ir yog\'sa, uyda qolaman.', explanation: "Real kelajak (First) → will + V1." },
    { type: 'choose', sentence: 'If I ___ rich, I would buy a yacht.', options: ['were', 'am', 'had been'], correct: 'were', uz: 'Boy bo\'lsam, yaxta sotib olardim.', explanation: "Xayoliy hozir (Second) → If + Past (were), would." },
    { type: 'judge', sentence: 'If I was you, I will tell the truth.', isCorrect: false, explanation: "Aralashib ketgan! Second: 'If I were you, I would tell the truth'." },
    { type: 'build', uz: 'O\'qiganimda, o\'tgan bo\'lardim.', words: ['If', 'I', 'had', 'studied', 'I', 'would', 'have', 'passed'], correct: ['If', 'I', 'had', 'studied', 'I', 'would', 'have', 'passed'], explanation: "O'tmish afsusi (Third) → If + Past Perfect (had studied), would have + V3 (passed)." },
    { type: 'choose', sentence: 'If she had left earlier, she ___ caught the train.', options: ['would have', 'would', 'will have'], correct: 'would have', uz: 'Ertaroq chiqganida, poyezdga ulgurgan bo\'lardi.', explanation: "Third → would have + V3 (caught)." },
    { type: 'choose', sentence: 'Plants die if they ___ water.', options: ["don't get", "won't get", "didn't get"], correct: "don't get", uz: 'O\'simliklar suv olmasa, nobud bo\'ladi.', explanation: "Doimiy haqiqat (Zero) → If + Present (don't get)." },
    { type: 'judge', sentence: 'If I had more time, I would learn the guitar.', isCorrect: true, explanation: "To'g'ri! Xayoliy hozir (Second) → If + Past (had), would + V1. Mukammal!" },
    { type: 'choose', sentence: 'If you ___ harder, you will get a better job.', options: ['work', 'worked', 'had worked'], correct: 'work', uz: 'Qattiqroq ishlasangiz, yaxshiroq ish topasiz.', explanation: "Real kelajak (First) → If + Present (work), will." },
    { type: 'build', uz: 'Boy bo\'lsam, sayohat qilardim.', words: ['If', 'I', 'were', 'rich', 'I', 'would', 'travel'], correct: ['If', 'I', 'were', 'rich', 'I', 'would', 'travel'], explanation: "Second → If + were, would + V1." },
    { type: 'judge', sentence: 'If I would know, I would tell you.', isCorrect: false, explanation: "Noto'g'ri! Shart qismida would yo'q: 'If I knew, I would tell you' (Second)." },
    { type: 'choose', sentence: 'If they had invited me, I ___ gone.', options: ['would have', 'would', 'will have'], correct: 'would have', uz: 'Meni taklif qilganlarida, borgan bo\'lardim.', explanation: "Third (o'tmish afsusi) → would have + V3 (gone)." },
    { type: 'build', uz: 'Yomg\'ir yog\'sa, uyda qolaman.', words: ['If', 'it', 'rains', 'I', 'will', 'stay', 'home'], correct: ['If', 'it', 'rains', 'I', 'will', 'stay', 'home'], explanation: "First → If + Present (rains), will + V1. Mukammal yakun!" },
  ],
  rule: {
    title: 'All Conditionals — to\'liq qoida',
    body: "To'rt xil shart gap — har biri boshqa vaziyat uchun.\n\n🔬 ZERO — doimiy haqiqat (ilm, qoida):\n   If + Present, Present\n   • If you heat ice, it melts.\n\n🔮 FIRST — real kelajak sharti:\n   If + Present, will + V1\n   • If it rains, I will stay home.\n\n💭 SECOND — xayoliy/haqiqatga zid HOZIR:\n   If + Past Simple, would + V1\n   • If I were rich, I would travel.\n   (were — barcha shaxslar uchun)\n\n⏮️ THIRD — o'tmish AFSUSI (bo'lmagan):\n   If + Past Perfect, would have + V3\n   • If I had studied, I would have passed.\n\n⚠️ Shart (if) qismida WILL/WOULD ishlatilmaydi!",
  },
  summary: [
    "Zero: If + Present, Present (doimiy haqiqat)",
    "First: If + Present, will + V1 (real kelajak)",
    "Second: If + Past, would + V1 (xayoliy hozir)",
    "Third: If + Past Perfect, would have + V3 (afsus)",
  ],
}

// ─── 23. Passive Voice (All Tenses) ─────────────────────────────────────────
const PASSIVE_VOICE_B1: DemoLesson = {
  id: 'passive-voice-b1-demo',
  skill: 'Majhul nisbat (barcha zamonlar) — passive voice',
  level: 'B1',
  emoji: '🔄',
  context: {
    text: "Tasavvur qiling — kompaniya tarixini aytyapsiz: \"Bu mahsulot 1990-da ISHLAB CHIQARILGAN, hozir ham ISHLAB CHIQARILADI, kelajakda ham ISHLAB CHIQARILADI\". Passive har zamonda ishlaydi. Keling, barcha zamonlarda passive'ni o'rganamiz!",
    location: 'Real vaziyat · Jarayon tavsifi',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Passive = be (kerakli zamonda) + V3",
      "Present: is made · Past: was made · Future: will be made",
      "Perfect: has been made · Modal: must be made",
      "Continuous passive: is being made (hozir qilinmoqda)",
    ],
  },
  examples: [
    { en: 'The car is washed every week.',      uz: 'Mashina har hafta yuviladi.',           key: 'is washed' },
    { en: 'The house was built in 1990.',       uz: 'Uy 1990-da qurilgan.',                  key: 'was built' },
    { en: 'The bridge will be finished soon.',  uz: 'Ko\'prik tez orada tugatiladi.',        key: 'will be finished' },
    { en: 'The work has been done.',            uz: 'Ish bajarilgan.',                       key: 'has been done' },
  ],
  vocab: [
    { en: 'is/are + V3', uz: 'hozir (passive)', emoji: '⏳', example: 'is made' },
    { en: 'was/were + V3', uz: 'o\'tmish',     emoji: '⏪', example: 'was built' },
    { en: 'will be + V3', uz: 'kelajak',       emoji: '⏩', example: 'will be sent' },
    { en: 'has/have been + V3', uz: 'perfect', emoji: '✅', example: 'has been done' },
    { en: 'is being + V3', uz: 'hozir qilinmoqda', emoji: '🔄', example: 'is being built' },
    { en: 'modal + be + V3', uz: 'modal passive', emoji: '🔑', example: 'must be paid' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'is made', uz: 'hozir' }, { en: 'was made', uz: 'o\'tmish' }, { en: 'will be made', uz: 'kelajak' }, { en: 'has been made', uz: 'perfect' }], explanation: "Passive zamonlari." },
    { type: 'choose', sentence: 'The office ___ cleaned every day.', options: ['is', 'was', 'will be'], correct: 'is', uz: 'Ofis har kuni tozalanadi.', explanation: "Present passive: is + cleaned (V3)." },
    { type: 'choose', sentence: 'The letter ___ sent yesterday.', options: ['was', 'is', 'will be'], correct: 'was', uz: 'Xat kecha yuborilgan.', explanation: "Past passive: was + sent (V3)." },
    { type: 'judge', sentence: 'The bridge will built next year.', isCorrect: false, explanation: "Noto'g'ri! be kerak: 'will be built' (will + be + V3)." },
    { type: 'build', uz: 'Ish bajarilgan.', words: ['The', 'work', 'has', 'been', 'done'], correct: ['The', 'work', 'has', 'been', 'done'], explanation: "Present Perfect passive: has been + done (V3)." },
    { type: 'choose', sentence: 'The new road ___ built right now.', options: ['is being', 'is', 'was'], correct: 'is being', uz: 'Yangi yo\'l hozir qurilmoqda.', explanation: "Present Continuous passive: is being + built (V3)." },
    { type: 'choose', sentence: 'The bill ___ be paid by Friday.', options: ['must', 'is', 'was'], correct: 'must', uz: 'Hisob jumagacha to\'lanishi kerak.', explanation: "Modal passive: must + be + paid (V3)." },
    { type: 'judge', sentence: 'These cars are made in Germany.', isCorrect: true, explanation: "To'g'ri! Present passive: are + made (V3). Mukammal!" },
    { type: 'choose', sentence: 'The results ___ announced tomorrow.', options: ['will be', 'are', 'were'], correct: 'will be', uz: 'Natijalar ertaga e\'lon qilinadi.', explanation: "Future passive: will be + announced (V3)." },
    { type: 'build', uz: 'Uy 1990-da qurilgan.', words: ['The', 'house', 'was', 'built', 'in', '1990'], correct: ['The', 'house', 'was', 'built', 'in', '1990'], explanation: "Past passive: was + built (V3)." },
    { type: 'judge', sentence: 'The report has been wrote.', isCorrect: false, explanation: "Noto'g'ri! V3: 'has been written' (write → written, wrote emas)." },
    { type: 'choose', sentence: 'The problem ___ being investigated.', options: ['is', 'has', 'will'], correct: 'is', uz: 'Muammo tekshirilmoqda.', explanation: "Present Continuous passive: is being + investigated." },
    { type: 'choose', sentence: 'All the cakes ___ been eaten.', options: ['have', 'has', 'are'], correct: 'have', uz: 'Barcha tortlar yeyilgan.', explanation: "Present Perfect passive (ko'plik): have been + eaten." },
    { type: 'build', uz: 'Ko\'prik tez orada tugatiladi.', words: ['The', 'bridge', 'will', 'be', 'finished', 'soon'], correct: ['The', 'bridge', 'will', 'be', 'finished', 'soon'], explanation: "Future passive: will be + finished (V3). Mukammal yakun!" },
  ],
  rule: {
    title: 'Passive Voice (All Tenses) — to\'liq qoida',
    body: "Passive har zamonda: be (kerakli zamonda) + V3.\n\n📋 Asosiy zamonlar:\n   • Present: is/are + V3 → English is spoken.\n   • Past: was/were + V3 → It was built.\n   • Future: will be + V3 → It will be sent.\n\n✅ Perfect:\n   • Present Perfect: has/have been + V3 → has been done.\n   • Past Perfect: had been + V3 → had been finished.\n\n🔄 Continuous:\n   • Present Cont: is/are being + V3 → is being built.\n   • Past Cont: was/were being + V3 → was being repaired.\n\n🔑 Modal passive: modal + be + V3:\n   • must be paid · can be seen · should be done\n\n👤 by — bajaruvchi: written by Tolstoy",
  },
  summary: [
    "Passive = be (zamonda) + V3",
    "is made / was made / will be made",
    "has been made (perfect) · is being made (cont.)",
    "Modal: must be paid, can be seen",
  ],
}

// ═══════════════════════════════════════════════════════════════════════════
export const B1_DEMOS: Record<string, DemoLesson> = {
  'present-perfect-continuous': PRESENT_PERFECT_CONTINUOUS,
  'past-perfect':               PAST_PERFECT,
  'past-perfect-continuous':    PAST_PERFECT_CONTINUOUS,
  'future-continuous':          FUTURE_CONTINUOUS,
  'future-perfect':             FUTURE_PERFECT,
  'future-forms-review':        FUTURE_FORMS_REVIEW,
  'modals-obligation':          MODALS_OBLIGATION,
  'modals-speculation':         MODALS_SPECULATION,
  'past-habits':                PAST_HABITS,
  'causatives':                 CAUSATIVES,
  'question-tags':              QUESTION_TAGS,
  'both-either-neither':        BOTH_EITHER_NEITHER,
  'time-clauses':               TIME_CLAUSES,
  'indirect-questions':         INDIRECT_QUESTIONS,
  'so-neither-auxiliaries':     SO_NEITHER_AUX,
  'wishes-regrets':             WISHES_REGRETS,
  'first-conditional-b1':       FIRST_CONDITIONAL_B1,
  'reported-speech-b1':         REPORTED_SPEECH_B1,
  'relative-clauses-b1':        RELATIVE_CLAUSES,
  'gerunds-infinitives-b1':     GERUNDS_INFINITIVES_B1,
  'phrasal-verbs-b1':           PHRASAL_VERBS_B1,
  'conditionals-comparison-b1': CONDITIONALS_COMPARISON,
  'passive-voice-b1':           PASSIVE_VOICE_B1,
}
