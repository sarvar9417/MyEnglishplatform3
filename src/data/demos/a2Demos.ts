// ═══════════════════════════════════════════════════════════════════════════
// A2 darajadagi barcha grammatika darslari uchun namunaviy (demo) darslar.
// Falsafa: bitta mahorat, induktiv, kontekstli, "Siz"-fokusli, BOY kontent.
// Har bir dars: kontekst → izoh → misollar → so'zlar → mashqlar → qoida → xulosa
// Kalit = asl dars id (DEMO_LESSONS bilan mos). SRS avtomatik ishlaydi.
// ═══════════════════════════════════════════════════════════════════════════

import type { DemoLesson } from '../lessonDemoContent'

// ─── 1. Modal Verbs ─────────────────────────────────────────────────────────
const MODAL_VERBS: DemoLesson = {
  id: 'modal-verbs-demo',
  skill: 'Modal fe\'llar — majburiyat, ruxsat va maslahat',
  level: 'A2',
  emoji: '🔑',
  context: {
    text: "Tasavvur qiling — yangi ishga kirdingiz. Rahbar qoidalarni tushuntiryapti: \"Siz erta kelishingiz KERAK, telefon ishlatishingiz MUMKIN emas...\". Keling, majburiyat, ruxsat va maslahatni modal fe'llar bilan ifodalashni o'rganamiz!",
    location: 'Real vaziyat · Ish qoidalari',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "must / have to — majburiyat (kerak, shart)",
      "should — maslahat (yaxshi bo'lardi)",
      "can / may — ruxsat va imkoniyat",
      "Modal'dan keyin fe'l doim asl shaklda (to YO'Q): You must go",
    ],
  },
  examples: [
    { en: 'You must wear a uniform.',   uz: 'Siz forma kiyishingiz shart.',       key: 'must' },
    { en: 'You should rest more.',      uz: 'Siz ko\'proq dam olishingiz kerak.', key: 'should' },
    { en: 'Can I open the window?',     uz: 'Derazani ochsam bo\'ladimi?',        key: 'Can' },
    { en: "You mustn't smoke here.",    uz: 'Bu yerda chekish mumkin emas.',      key: "mustn't" },
  ],
  vocab: [
    { en: 'must',      uz: 'shart, kerak (kuchli)', emoji: '❗', example: 'You must stop.' },
    { en: 'have to',   uz: 'majbur (qoida)',        emoji: '📋', example: 'I have to work.' },
    { en: 'should',    uz: 'kerak (maslahat)',      emoji: '💡', example: 'You should sleep.' },
    { en: 'can',       uz: 'mumkin / qila olmoq',   emoji: '✅', example: 'Can I help?' },
    { en: 'may',       uz: 'mumkin (rasmiy ruxsat)',emoji: '🙏', example: 'May I come in?' },
    { en: "mustn't",   uz: 'mumkin emas (taqiq)',   emoji: '🚫', example: "You mustn't run." },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'must', uz: 'shart' }, { en: 'should', uz: 'maslahat' }, { en: 'can', uz: 'mumkin' }, { en: "mustn't", uz: 'taqiq' }], explanation: "Modal fe'llarning asosiy ma'nolari." },
    { type: 'choose', sentence: 'You ___ wear a seatbelt. It\'s the law.', options: ['must', 'should', 'can'], correct: 'must', uz: 'Siz xavfsizlik kamarini taqishingiz shart. Bu qonun.', explanation: "Qonun/majburiyat — must (kuchli)." },
    { type: 'choose', sentence: 'You ___ see a doctor.', options: ['should', 'must', 'can'], correct: 'should', uz: 'Siz shifokorga ko\'rinishingiz kerak.', explanation: "Maslahat — should." },
    { type: 'judge', sentence: 'You must to go now.', isCorrect: false, explanation: "Noto'g'ri! Modal'dan keyin 'to' yo'q: 'You must go now.'" },
    { type: 'build', uz: 'Men hozir ketishim kerak.', words: ['I', 'have', 'to', 'go', 'now'], correct: ['I', 'have', 'to', 'go', 'now'], explanation: "have to — majburiyat. 'I have to go'." },
    { type: 'choose', sentence: '___ I use your phone?', options: ['Can', 'Must', 'Should'], correct: 'Can', uz: 'Telefoningizdan foydalansam bo\'ladimi?', explanation: "Ruxsat so'rash — Can I...?" },
    { type: 'listen', audio: 'You should drink more water.', options: ['You should drink more water.', 'You should to drink water.', 'You shoulds drink water.'], correct: 'You should drink more water.', explanation: "should + V1 (to yo'q, -s yo'q)." },
    { type: 'judge', sentence: "You mustn't park here.", isCorrect: true, explanation: "To'g'ri! mustn't — taqiq (mumkin emas). Mukammal!" },
    { type: 'choose', sentence: 'She ___ work on Sundays.', options: ["doesn't have to", "mustn't", "shouldn't"], correct: "doesn't have to", uz: 'U yakshanba ishlashi shart emas.', explanation: "doesn't have to — majburiyat yo'q (mustn't = taqiq, farqi bor!)." },
    { type: 'build', uz: 'Siz bu yerda chekmasligingiz kerak.', words: ['You', "mustn't", 'smoke', 'here'], correct: ['You', "mustn't", 'smoke', 'here'], explanation: "mustn't + V1 — taqiq." },
    { type: 'choose', sentence: '___ I come in?', options: ['May', 'Must', 'Should'], correct: 'May', uz: 'Kirsam bo\'ladimi?', explanation: "Rasmiy/muloyim ruxsat — May I...?" },
    { type: 'judge', sentence: 'He should studies harder.', isCorrect: false, explanation: "Noto'g'ri! should + V1: 'He should study harder' (studies emas)." },
    { type: 'choose', sentence: 'You ___ be late. The boss is angry.', options: ["shouldn't", "don't have to", 'can'], correct: "shouldn't", uz: 'Kechikmasligingiz kerak. Boshliq jahli chiqqan.', explanation: "shouldn't — yaxshi emas (maslahat inkori)." },
    { type: 'build', uz: 'Sizga yordam bera olamanmi?', words: ['Can', 'I', 'help', 'you'], correct: ['Can', 'I', 'help', 'you'], explanation: "Can I help you? — taklif/ruxsat." },
    { type: 'judge', sentence: 'You must wear a helmet on a bike.', isCorrect: true, explanation: "To'g'ri! must — xavfsizlik majburiyati. Mukammal yakun!" },
  ],
  rule: {
    title: 'Modal Verbs — to\'liq qoida',
    body: "Modal fe'llar — majburiyat, ruxsat, maslahat, imkoniyatni bildiradi.\n\n✅ Asosiy qoida: modal + V1 (asl shakl, 'to' YO'Q, -s YO'Q)\n   You must go · She should study · I can swim\n\n❗ must / have to — majburiyat:\n   • You must stop (kuchli, ichki)\n   • I have to work (qoida, tashqi)\n\n💡 should — maslahat: You should rest\n\n✅ can / may — ruxsat: Can I...? May I...? (may rasmiyroq)\n\n🚫 Inkor farqi:\n   • mustn't = TAQIQ (mumkin emas)\n   • don't have to = majburiyat YO'Q (ixtiyoriy)",
  },
  summary: [
    "modal + V1 (to yo'q, -s yo'q)",
    "must/have to — majburiyat · should — maslahat",
    "can/may — ruxsat (may rasmiyroq)",
    "mustn't = taqiq · don't have to = ixtiyoriy",
  ],
}

// ─── 2. Articles (a / an / the) ─────────────────────────────────────────────
const ARTICLES: DemoLesson = {
  id: 'articles-demo',
  skill: 'Artikllar — a, an, the',
  level: 'A2',
  emoji: '🔤',
  context: {
    text: "Tasavvur qiling — hikoya aytyapsiz: \"Men BIR it ko'rdim. O'SHA it juda katta edi.\" Birinchi marta — 'a', tanish bo'lganda — 'the'. Keling, qachon a/an/the ishlatishni o'rganamiz!",
    location: 'Real vaziyat · Hikoya aytish',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "a / an — noaniq (birinchi marta, qaysidir biri)",
      "an — unli tovush oldidan (an apple, an hour)",
      "the — aniq (ma'lum, takroran, yagona)",
      "Artikl yo'q — ko'plik/umumiy ma'no (I like dogs)",
    ],
  },
  examples: [
    { en: 'I saw a cat.',            uz: 'Men bir mushuk ko\'rdim.',            key: 'a' },
    { en: 'She is an engineer.',     uz: 'U muhandis.',                         key: 'an' },
    { en: 'The sun is hot.',         uz: 'Quyosh issiq.',                       key: 'The' },
    { en: 'I like music.',           uz: 'Men musiqani yaxshi ko\'raman.',      key: '∅' },
  ],
  vocab: [
    { en: 'a',        uz: 'bir (undosh oldidan)', emoji: '1️⃣', example: 'a book, a car' },
    { en: 'an',       uz: 'bir (unli oldidan)',   emoji: '🅰️', example: 'an apple, an egg' },
    { en: 'the',      uz: 'o\'sha, aniq',          emoji: '🎯', example: 'the moon' },
    { en: 'an hour',  uz: 'bir soat (h jim)',      emoji: '⏰', example: 'an hour ago' },
    { en: 'a university', uz: 'universitet (you tovushi)', emoji: '🎓', example: 'a university' },
    { en: 'unique',   uz: 'yagona',                emoji: '⭐', example: 'the only one' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'a', uz: 'undosh oldidan' }, { en: 'an', uz: 'unli oldidan' }, { en: 'the', uz: 'aniq narsa' }, { en: '∅', uz: 'umumiy ma\'no' }], explanation: "Artikllarning asosiy farqi." },
    { type: 'choose', sentence: 'I have ___ apple.', options: ['an', 'a', 'the'], correct: 'an', uz: 'Menda bir olma bor.', explanation: "apple unli (a) bilan boshlanadi → an." },
    { type: 'choose', sentence: 'She bought ___ car yesterday.', options: ['a', 'an', 'the'], correct: 'a', uz: 'U kecha mashina sotib oldi.', explanation: "car undosh (c) bilan → a. Birinchi marta → noaniq." },
    { type: 'judge', sentence: 'I saw a elephant.', isCorrect: false, explanation: "Noto'g'ri! elephant unli bilan → 'an elephant'." },
    { type: 'choose', sentence: '___ sun rises in the east.', options: ['The', 'A', 'An'], correct: 'The', uz: 'Quyosh sharqdan chiqadi.', explanation: "sun yagona narsa → the." },
    { type: 'build', uz: 'Menda bir it bor. O\'sha it qora.', words: ['The', 'dog', 'is', 'black'], correct: ['The', 'dog', 'is', 'black'], explanation: "Ikkinchi marta (tanish) → the dog." },
    { type: 'choose', sentence: 'He waited for ___ hour.', options: ['an', 'a', 'the'], correct: 'an', uz: 'U bir soat kutdi.', explanation: "hour'da 'h' jim, tovush unli (our) → an." },
    { type: 'judge', sentence: 'I like the music.', isCorrect: false, explanation: "Umumiy ma'noda artikl yo'q: 'I like music' (musiqani umuman)." },
    { type: 'choose', sentence: 'She is ___ honest person.', options: ['an', 'a', 'the'], correct: 'an', uz: 'U halol odam.', explanation: "honest'da 'h' jim → tovush unli (o) → an." },
    { type: 'build', uz: 'U universitetda o\'qiydi.', words: ['She', 'studies', 'at', 'a', 'university'], correct: ['She', 'studies', 'at', 'a', 'university'], explanation: "university 'yu' tovushi bilan (undosh) → a." },
    { type: 'choose', sentence: 'Can you close ___ door, please?', options: ['the', 'a', 'an'], correct: 'the', uz: 'Eshikni yopa olasizmi?', explanation: "Ma'lum eshik (ikkalamiz bilamiz) → the." },
    { type: 'judge', sentence: 'I want a egg for breakfast.', isCorrect: false, explanation: "Noto'g'ri! egg unli → 'an egg'." },
    { type: 'choose', sentence: 'Dogs are ___ good friends.', options: ['∅ (artikl yo\'q)', 'the', 'a'], correct: '∅ (artikl yo\'q)', uz: 'Itlar yaxshi do\'st.', explanation: "Ko'plik + umumiy ma'no → artikl yo'q." },
    { type: 'build', uz: 'Bu yagona javob.', words: ['It', 'is', 'the', 'only', 'answer'], correct: ['It', 'is', 'the', 'only', 'answer'], explanation: "the only — yagona, aniq. Mukammal yakun!" },
  ],
  rule: {
    title: 'Articles — to\'liq qoida',
    body: "Artikllar — ot oldidan keladi va uni aniq/noaniq qiladi.\n\n✅ a / an — NOANIQ (birinchi marta, qaysidir biri):\n   • a + undosh tovush: a book, a car, a university (yu)\n   • an + unli tovush: an apple, an hour (h jim), an honest\n   (yozilishi emas, TOVUSHi muhim!)\n\n🎯 the — ANIQ:\n   • Takroran/tanish: I saw a dog. The dog was big.\n   • Yagona narsa: the sun, the moon\n   • Ikkalasi biladi: close the door\n\n🚫 Artikl YO'Q:\n   • Ko'plik + umumiy: I like dogs\n   • Mavhum/umumiy: I love music",
  },
  summary: [
    "a (undosh) / an (unli TOVUSH) — noaniq",
    "an hour, a university — tovushga qarab",
    "the — aniq, tanish, yagona narsa",
    "Ko'plik/umumiy → artikl yo'q",
  ],
}

// ─── 3. Prepositions of Time & Place ────────────────────────────────────────
const PREPOSITIONS: DemoLesson = {
  id: 'prepositions-demo',
  skill: 'Predloglar — vaqt va joy (in, on, at)',
  level: 'A2',
  emoji: '📍',
  context: {
    text: "Tasavvur qiling — do'stingizga uchrashuvni tushuntiryapsiz: \"Dushanba kuni, soat 5 da, kafeda uchrashamiz\". Har biri uchun boshqa predlog kerak! Keling, in / on / at ni to'g'ri ishlatishni o'rganamiz!",
    location: 'Real vaziyat · Uchrashuv belgilash',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "at — aniq nuqta (at 5, at the door)",
      "on — sirt yoki kun (on Monday, on the table)",
      "in — ichkari yoki davr (in May, in the box)",
      "Vaqt va joy uchun bir xil predloglar, lekin qoidasi farq qiladi",
    ],
  },
  examples: [
    { en: 'See you at 6 pm.',         uz: 'Soat 6 da ko\'rishamiz.',          key: 'at' },
    { en: 'I work on Monday.',        uz: 'Men dushanba kuni ishlayman.',     key: 'on' },
    { en: 'My birthday is in May.',   uz: 'Tug\'ilgan kunim mayda.',          key: 'in' },
    { en: 'The cat is on the table.', uz: 'Mushuk stol ustida.',              key: 'on' },
  ],
  vocab: [
    { en: 'at',       uz: 'da (aniq nuqta)',  emoji: '🎯', example: 'at noon, at home' },
    { en: 'on',       uz: 'ustida / kunda',   emoji: '📅', example: 'on Friday' },
    { en: 'in',       uz: 'ichida / davrda',  emoji: '📦', example: 'in summer' },
    { en: 'under',    uz: 'tagida',           emoji: '⬇️', example: 'under the bed' },
    { en: 'next to',  uz: 'yonida',           emoji: '↔️', example: 'next to the bank' },
    { en: 'between',  uz: 'orasida',          emoji: '🔀', example: 'between two shops' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'at', uz: 'aniq nuqta/vaqt' }, { en: 'on', uz: 'kun/sirt' }, { en: 'in', uz: 'davr/ichkari' }, { en: 'under', uz: 'tagida' }], explanation: "Asosiy predloglar." },
    { type: 'choose', sentence: 'The meeting is ___ 3 o\'clock.', options: ['at', 'on', 'in'], correct: 'at', uz: 'Uchrashuv soat 3 da.', explanation: "Aniq soat → at (at 3 o'clock)." },
    { type: 'choose', sentence: 'I have a class ___ Monday.', options: ['on', 'at', 'in'], correct: 'on', uz: 'Dushanba kuni darsim bor.', explanation: "Kun → on (on Monday)." },
    { type: 'choose', sentence: 'It\'s cold ___ winter.', options: ['in', 'on', 'at'], correct: 'in', uz: 'Qishda sovuq.', explanation: "Fasl/davr → in (in winter)." },
    { type: 'judge', sentence: 'I was born in 1990.', isCorrect: true, explanation: "To'g'ri! Yil → in (in 1990)." },
    { type: 'build', uz: 'Kitob stol ustida.', words: ['The', 'book', 'is', 'on', 'the', 'table'], correct: ['The', 'book', 'is', 'on', 'the', 'table'], explanation: "Sirt ustida → on (on the table)." },
    { type: 'choose', sentence: 'The keys are ___ the box.', options: ['in', 'on', 'at'], correct: 'in', uz: 'Kalitlar qutining ichida.', explanation: "Ichkari → in (in the box)." },
    { type: 'judge', sentence: 'See you at Monday.', isCorrect: false, explanation: "Noto'g'ri! Kun → on: 'See you on Monday'." },
    { type: 'choose', sentence: 'I wake up ___ 7 am.', options: ['at', 'on', 'in'], correct: 'at', uz: 'Men soat 7 da uyg\'onaman.', explanation: "Aniq vaqt → at (at 7 am)." },
    { type: 'choose', sentence: 'The bank is ___ to the shop.', options: ['next', 'on', 'in'], correct: 'next', uz: 'Bank do\'kon yonida.', explanation: "Yonida → next to." },
    { type: 'judge', sentence: 'My birthday is in 15 May.', isCorrect: false, explanation: "Noto'g'ri! Aniq sana → on: 'on 15 May' (lekin in May — faqat oy)." },
    { type: 'build', uz: 'Mushuk krovat tagida.', words: ['The', 'cat', 'is', 'under', 'the', 'bed'], correct: ['The', 'cat', 'is', 'under', 'the', 'bed'], explanation: "Tagida → under." },
    { type: 'choose', sentence: 'He lives ___ Tashkent.', options: ['in', 'on', 'at'], correct: 'in', uz: 'U Toshkentda yashaydi.', explanation: "Shahar → in (in Tashkent)." },
    { type: 'build', uz: 'Do\'kon ikki bino orasida.', words: ['The', 'shop', 'is', 'between', 'two', 'buildings'], correct: ['The', 'shop', 'is', 'between', 'two', 'buildings'], explanation: "Ikki narsa orasida → between. Mukammal yakun!" },
  ],
  rule: {
    title: 'Prepositions — to\'liq qoida',
    body: "in / on / at — vaqt va joy uchun (qoidasi farq qiladi).\n\n⏰ VAQT:\n   • at — aniq vaqt: at 5, at noon, at night\n   • on — kun/sana: on Monday, on 15 May\n   • in — davr: in May, in 2020, in summer\n\n📍 JOY:\n   • at — nuqta: at home, at the door, at school\n   • on — sirt: on the table, on the wall\n   • in — ichkari: in the box, in Tashkent\n\n📦 Boshqa joy predloglari:\n   under (tagida) · next to (yonida)\n   between (orasida) · behind (orqasida)",
  },
  summary: [
    "Vaqt: at (soat) · on (kun) · in (davr)",
    "Joy: at (nuqta) · on (sirt) · in (ichkari)",
    "at home, on Monday, in May",
    "under, next to, between — joy predloglari",
  ],
}

// ─── 4. Questions ───────────────────────────────────────────────────────────
const QUESTIONS: DemoLesson = {
  id: 'questions-demo',
  skill: 'Savol tuzish — Wh- va Yes/No savollari',
  level: 'A2',
  emoji: '❓',
  context: {
    text: "Tasavvur qiling — yangi tanishingiz bilan suhbatlashyapsiz: \"Qayerda yashaysiz? Nima ish qilasiz? Sayohatni yoqtirasizmi?\" Yaxshi savollar suhbatni jonlantiradi. Keling, to'g'ri savol tuzishni o'rganamiz!",
    location: 'Real vaziyat · Tanishuv suhbati',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Yes/No savollari: yordamchi fe'l oldinga (Do you...? Are you...?)",
      "Wh- savollari: What, Where, When, Who, Why, How",
      "Tartib: Wh + yordamchi + ega + fe'l (Where do you live?)",
      "to be bilan: Are you...? Where is...? (do kerak emas)",
    ],
  },
  examples: [
    { en: 'Do you like coffee?',     uz: 'Qahvani yoqtirasizmi?',          key: 'Do' },
    { en: 'Where do you live?',      uz: 'Qayerda yashaysiz?',             key: 'Where' },
    { en: 'What is your name?',      uz: 'Ismingiz nima?',                 key: 'What' },
    { en: 'Are you a student?',      uz: 'Siz talabami?',                  key: 'Are' },
  ],
  vocab: [
    { en: 'What',     uz: 'nima',     emoji: '❔', example: 'What is this?' },
    { en: 'Where',    uz: 'qayerda',  emoji: '📍', example: 'Where are you?' },
    { en: 'When',     uz: 'qachon',   emoji: '🕐', example: 'When do we start?' },
    { en: 'Who',      uz: 'kim',      emoji: '🧑', example: 'Who is she?' },
    { en: 'Why',      uz: 'nega',     emoji: '🤔', example: 'Why are you sad?' },
    { en: 'How',      uz: 'qanday',   emoji: '🔧', example: 'How do you do it?' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'What', uz: 'nima' }, { en: 'Where', uz: 'qayerda' }, { en: 'When', uz: 'qachon' }, { en: 'Why', uz: 'nega' }], explanation: "Wh- savol so'zlari." },
    { type: 'choose', sentence: '___ you speak English?', options: ['Do', 'Are', 'Is'], correct: 'Do', uz: 'Ingliz tilida gapirasizmi?', explanation: "Oddiy fe'l (speak) → Do you...?" },
    { type: 'choose', sentence: '___ is your teacher?', options: ['Who', 'What', 'Where'], correct: 'Who', uz: 'O\'qituvchingiz kim?', explanation: "Odam haqida → Who." },
    { type: 'judge', sentence: 'Where you live?', isCorrect: false, explanation: "Noto'g'ri! Yordamchi kerak: 'Where do you live?'" },
    { type: 'build', uz: 'Qayerda yashaysiz?', words: ['Where', 'do', 'you', 'live'], correct: ['Where', 'do', 'you', 'live'], explanation: "Wh + do + ega + V1: 'Where do you live?'" },
    { type: 'choose', sentence: '___ you a doctor?', options: ['Are', 'Do', 'Does'], correct: 'Are', uz: 'Siz shifokormisiz?', explanation: "to be (a doctor) → Are you...? (do kerak emas)." },
    { type: 'choose', sentence: '___ does the film start?', options: ['When', 'Who', 'What'], correct: 'When', uz: 'Film qachon boshlanadi?', explanation: "Vaqt haqida → When." },
    { type: 'judge', sentence: 'What is your name?', isCorrect: true, explanation: "To'g'ri! What + is (to be). Mukammal!" },
    { type: 'choose', sentence: '___ does she work?', options: ['Where', 'Who', 'Are'], correct: 'Where', uz: 'U qayerda ishlaydi?', explanation: "Joy → Where + does (she)." },
    { type: 'build', uz: 'Qahvani yoqtirasizmi?', words: ['Do', 'you', 'like', 'coffee'], correct: ['Do', 'you', 'like', 'coffee'], explanation: "Yes/No: Do + ega + V1?" },
    { type: 'judge', sentence: 'Does he plays football?', isCorrect: false, explanation: "Noto'g'ri! Does'dan keyin V1: 'Does he play football?' (plays emas)." },
    { type: 'choose', sentence: '___ are you late?', options: ['Why', 'What', 'Who'], correct: 'Why', uz: 'Nega kechikdingiz?', explanation: "Sabab → Why." },
    { type: 'choose', sentence: '___ do you go to work?', options: ['How', 'Who', 'Is'], correct: 'How', uz: 'Ishga qanday borasiz?', explanation: "Usul → How (how do you...)." },
    { type: 'build', uz: 'U qayerdan?', words: ['Where', 'is', 'she', 'from'], correct: ['Where', 'is', 'she', 'from'], explanation: "Where is she from? — to be bilan. Mukammal yakun!" },
  ],
  rule: {
    title: 'Questions — to\'liq qoida',
    body: "Savol tuzish — yordamchi fe'l ega oldiga chiqadi.\n\n✅ Yes/No savollar (oddiy fe'l):\n   • Do/Does + ega + V1? → Do you like...? Does he work...?\n   • Did + ega + V1? (o'tgan zamon)\n\n✅ to be bilan (do KERAK EMAS):\n   • Are you...? Is she...? Were they...?\n\n❓ Wh- savollar:\n   What (nima) · Where (qayerda) · When (qachon)\n   Who (kim) · Why (nega) · How (qanday)\n   Tartib: Wh + yordamchi + ega + fe'l\n   → Where do you live? What is your name?\n\n⚠️ Does/Did dan keyin fe'l ASL shaklda (V1)!",
  },
  summary: [
    "Yes/No: Do/Does + ega + V1?",
    "to be: Are you...? Is she...? (do yo'q)",
    "Wh-: What/Where/When/Who/Why/How",
    "Wh + yordamchi + ega + fe'l",
  ],
}

// ─── 5. Countable & Uncountable Nouns ───────────────────────────────────────
const COUNTABLE_UNCOUNTABLE: DemoLesson = {
  id: 'countable-uncountable-demo',
  skill: 'Sanaladigan va sanalmaydigan otlar',
  level: 'A2',
  emoji: '🧮',
  context: {
    text: "Tasavvur qiling — do'konda ro'yxat tuzyapsiz: \"3 ta olma, biroz suv, ko'p guruch\". Olmani sanash mumkin, suvni esa yo'q! Keling, sanaladigan va sanalmaydigan otlarni farqlashni o'rganamiz!",
    location: 'Real vaziyat · Xarid ro\'yxati',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Sanaladigan (countable): a book, two books (ko'plik bor)",
      "Sanalmaydigan (uncountable): water, rice (ko'plik yo'q)",
      "much (sanalmaydigan) / many (sanaladigan)",
      "some / any — ikkalasi bilan ham ishlatiladi",
    ],
  },
  examples: [
    { en: 'I have three apples.',      uz: 'Menda uchta olma bor.',          key: 'apples' },
    { en: 'There is some water.',      uz: 'Biroz suv bor.',                 key: 'water' },
    { en: 'How many books?',           uz: 'Nechta kitob?',                  key: 'many' },
    { en: 'How much sugar?',           uz: 'Qancha shakar?',                 key: 'much' },
  ],
  vocab: [
    { en: 'many',     uz: 'ko\'p (sanaladigan)',  emoji: '🔢', example: 'many cars' },
    { en: 'much',     uz: 'ko\'p (sanalmaydigan)',emoji: '💧', example: 'much water' },
    { en: 'a few',    uz: 'bir nechta (sanaladigan)', emoji: '✋', example: 'a few friends' },
    { en: 'a little', uz: 'ozgina (sanalmaydigan)',   emoji: '🤏', example: 'a little milk' },
    { en: 'some',     uz: 'biroz / bir nechta',   emoji: '➕', example: 'some bread' },
    { en: 'any',      uz: 'hech / biror (inkor/savol)', emoji: '❔', example: 'any money?' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'many', uz: 'sanaladigan ko\'p' }, { en: 'much', uz: 'sanalmaydigan ko\'p' }, { en: 'a few', uz: 'bir nechta' }, { en: 'a little', uz: 'ozgina' }], explanation: "Miqdor so'zlari — sanaladigan/sanalmaydiganga qarab." },
    { type: 'choose', sentence: 'How ___ apples do you want?', options: ['many', 'much', 'a little'], correct: 'many', uz: 'Nechta olma xohlaysiz?', explanation: "apples — sanaladigan → many." },
    { type: 'choose', sentence: 'How ___ water do you drink?', options: ['much', 'many', 'a few'], correct: 'much', uz: 'Qancha suv ichasiz?', explanation: "water — sanalmaydigan → much." },
    { type: 'judge', sentence: 'I have three waters.', isCorrect: false, explanation: "Noto'g'ri! water sanalmaydi: 'three glasses of water' deyiladi." },
    { type: 'choose', sentence: 'There is ___ milk in the fridge.', options: ['some', 'many', 'a few'], correct: 'some', uz: 'Muzlatgichda biroz sut bor.', explanation: "milk sanalmaydigan, ijobiy gap → some." },
    { type: 'build', uz: 'Menda bir nechta do\'st bor.', words: ['I', 'have', 'a', 'few', 'friends'], correct: ['I', 'have', 'a', 'few', 'friends'], explanation: "friends — sanaladigan → a few." },
    { type: 'choose', sentence: 'Add ___ little salt.', options: ['a', 'many', 'few'], correct: 'a', uz: 'Ozgina tuz qo\'shing.', explanation: "salt sanalmaydigan → a little." },
    { type: 'judge', sentence: 'How much books do you read?', isCorrect: false, explanation: "Noto'g'ri! books sanaladigan → 'How many books?'" },
    { type: 'choose', sentence: 'Is there ___ bread?', options: ['any', 'many', 'a few'], correct: 'any', uz: 'Non bormi?', explanation: "Savol → any (bread sanalmaydigan)." },
    { type: 'choose', sentence: 'I don\'t have ___ money.', options: ['any', 'some', 'many'], correct: 'any', uz: 'Menda pul yo\'q.', explanation: "Inkor → any (money sanalmaydigan)." },
    { type: 'judge', sentence: 'There are many cars in the street.', isCorrect: true, explanation: "To'g'ri! cars sanaladigan → many. Mukammal!" },
    { type: 'choose', sentence: 'We need ___ information.', options: ['some', 'a few', 'many'], correct: 'some', uz: 'Bizga biroz ma\'lumot kerak.', explanation: "information sanalmaydigan! (informations yo'q) → some." },
    { type: 'build', uz: 'Stakanda ozgina sut bor.', words: ['There', 'is', 'a', 'little', 'milk'], correct: ['There', 'is', 'a', 'little', 'milk'], explanation: "milk sanalmaydigan → a little." },
    { type: 'judge', sentence: 'I bought a few oranges.', isCorrect: true, explanation: "To'g'ri! oranges sanaladigan → a few. Mukammal yakun!" },
  ],
  rule: {
    title: 'Countable & Uncountable — to\'liq qoida',
    body: "Otlar ikkiga bo'linadi: sanaladigan va sanalmaydigan.\n\n🔢 Sanaladigan (countable):\n   • a book → two books (ko'plik bor)\n   • many, a few bilan: many cars, a few friends\n   • How many...?\n\n💧 Sanalmaydigan (uncountable):\n   • water, rice, milk, money, information, bread\n   • ko'plik YO'Q (waters ✗), a/an YO'Q\n   • much, a little bilan: much water, a little milk\n   • How much...?\n\n➕ some / any (ikkalasi bilan):\n   • some — ijobiy: I have some bread\n   • any — inkor/savol: any money? not any\n\n⚠️ Diqqat: information, advice, news — sanalmaydigan!",
  },
  summary: [
    "Sanaladigan: many, a few, How many?",
    "Sanalmaydigan: much, a little, How much?",
    "some (ijobiy) · any (inkor/savol)",
    "water, money, information — sanalmaydigan",
  ],
}

// ─── 6. Adjective vs Adverb ─────────────────────────────────────────────────
const ADJECTIVE_ADVERB: DemoLesson = {
  id: 'adjective-adverb-demo',
  skill: 'Sifat va ravish — adjective vs adverb',
  level: 'A2',
  emoji: '🎨',
  context: {
    text: "Tasavvur qiling — do'stingizni ta'riflaysiz: \"U YAXSHI haydovchi — juda EHTIYOTKORLIK bilan haydaydi\". 'Yaxshi' — qanaqa (sifat), 'ehtiyotkorlik bilan' — qanday (ravish). Keling, sifat va ravishni farqlashni o'rganamiz!",
    location: 'Real vaziyat · Odamni ta\'riflash',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Sifat (adjective) — otni ta'riflaydi: a good car (qanaqa?)",
      "Ravish (adverb) — fe'lni ta'riflaydi: drive well (qanday?)",
      "Ko'pincha: sifat + ly = ravish (quick → quickly)",
      "Istisnolar: good → well, fast → fast, hard → hard",
    ],
  },
  examples: [
    { en: 'She is a careful driver.',  uz: 'U ehtiyotkor haydovchi.',         key: 'careful' },
    { en: 'She drives carefully.',     uz: 'U ehtiyotkorlik bilan haydaydi.', key: 'carefully' },
    { en: 'He is a good singer.',      uz: 'U yaxshi qo\'shiqchi.',           key: 'good' },
    { en: 'He sings well.',            uz: 'U yaxshi kuylaydi.',              key: 'well' },
  ],
  vocab: [
    { en: 'quick → quickly', uz: 'tez → tez(lik bilan)', emoji: '⚡', example: 'He runs quickly.' },
    { en: 'slow → slowly',   uz: 'sekin → sekin',        emoji: '🐌', example: 'Drive slowly.' },
    { en: 'good → well',     uz: 'yaxshi → yaxshi',      emoji: '👍', example: 'She sings well.' },
    { en: 'careful → carefully', uz: 'ehtiyotkor → ehtiyotkorlik bilan', emoji: '🧐', example: 'Listen carefully.' },
    { en: 'fast → fast',     uz: 'tez (o\'zgarmaydi)',   emoji: '🏎️', example: 'He drives fast.' },
    { en: 'happy → happily', uz: 'baxtli → baxtli',      emoji: '😊', example: 'They live happily.' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'quickly', uz: 'tez (ravish)' }, { en: 'good', uz: 'yaxshi (sifat)' }, { en: 'well', uz: 'yaxshi (ravish)' }, { en: 'slowly', uz: 'sekin (ravish)' }], explanation: "Sifat otni, ravish fe'lni ta'riflaydi." },
    { type: 'choose', sentence: 'She is a ___ student.', options: ['good', 'well', 'goodly'], correct: 'good', uz: 'U yaxshi talaba.', explanation: "student (ot) → sifat 'good'." },
    { type: 'choose', sentence: 'He speaks English ___.', options: ['well', 'good', 'goodly'], correct: 'well', uz: 'U ingliz tilida yaxshi gapiradi.', explanation: "speaks (fe'l) → ravish 'well' (good emas!)." },
    { type: 'judge', sentence: 'She sings beautiful.', isCorrect: false, explanation: "Noto'g'ri! sings (fe'l) → ravish: 'She sings beautifully'." },
    { type: 'build', uz: 'Iltimos, sekin haydang.', words: ['Please', 'drive', 'slowly'], correct: ['Please', 'drive', 'slowly'], explanation: "drive (fe'l) → ravish 'slowly'." },
    { type: 'choose', sentence: 'This is a ___ car.', options: ['fast', 'fastly', 'well'], correct: 'fast', uz: 'Bu tez mashina.', explanation: "car (ot) → sifat 'fast'." },
    { type: 'choose', sentence: 'He runs ___.', options: ['fast', 'fastly', 'good'], correct: 'fast', uz: 'U tez yuguradi.', explanation: "fast ravish ham, sifat ham — o'zgarmaydi (fastly YO'Q)." },
    { type: 'judge', sentence: 'Listen carefully, please.', isCorrect: true, explanation: "To'g'ri! Listen (fe'l) → ravish 'carefully'. Mukammal!" },
    { type: 'choose', sentence: 'She is a ___ dancer.', options: ['careful', 'carefully', 'well'], correct: 'careful', uz: 'U ehtiyotkor raqqosa.', explanation: "dancer (ot) → sifat 'careful'." },
    { type: 'build', uz: 'U baxtli yashaydi.', words: ['She', 'lives', 'happily'], correct: ['She', 'lives', 'happily'], explanation: "lives (fe'l) → ravish 'happily' (happy → y→i+ly)." },
    { type: 'judge', sentence: 'He is a quickly runner.', isCorrect: false, explanation: "Noto'g'ri! runner (ot) → sifat: 'a quick runner'." },
    { type: 'choose', sentence: 'The test was ___.', options: ['easy', 'easily', 'well'], correct: 'easy', uz: 'Imtihon oson edi.', explanation: "was (to be) dan keyin sifat: easy." },
    { type: 'choose', sentence: 'I solved it ___.', options: ['easily', 'easy', 'good'], correct: 'easily', uz: 'Men buni osongina hal qildim.', explanation: "solved (fe'l) → ravish 'easily'." },
    { type: 'build', uz: 'U yaxshi kuylaydi.', words: ['She', 'sings', 'well'], correct: ['She', 'sings', 'well'], explanation: "sings (fe'l) → ravish 'well'. Mukammal yakun!" },
  ],
  rule: {
    title: 'Adjective vs Adverb — to\'liq qoida',
    body: "Sifat otni, ravish fe'lni ta'riflaydi.\n\n🎨 Sifat (adjective) — qanaqa? (otni):\n   • a good car · a fast runner · a careful driver\n   • to be dan keyin: She is happy. It was easy.\n\n🏃 Ravish (adverb) — qanday? (fe'lni):\n   • drive carefully · run quickly · sing well\n\n✅ Yasalishi: sifat + ly\n   quick → quickly · slow → slowly\n   easy → easily (y→i) · happy → happily\n\n⚠️ Istisnolar:\n   • good → well (yaxshi)\n   • fast → fast · hard → hard (o'zgarmaydi)\n   • He works hard (qattiq) ≠ hardly (deyarli yo'q)",
  },
  summary: [
    "Sifat otni: a good car (qanaqa?)",
    "Ravish fe'lni: drive well (qanday?)",
    "sifat + ly = ravish (quick → quickly)",
    "good → well, fast → fast (istisno)",
  ],
}

// ─── 7. Gerunds & Infinitives ───────────────────────────────────────────────
const GERUNDS_INFINITIVES: DemoLesson = {
  id: 'gerunds-infinitives-demo',
  skill: 'Gerundiy va infinitiv — -ing yoki to + fe\'l',
  level: 'A2',
  emoji: '🔀',
  context: {
    text: "Tasavvur qiling — sevimli mashg'ulotlaringiz haqida gapiryapsiz: \"Men o'qishni yoqtiraman, sayohat qilmoqchiman\". Ba'zi fe'llardan keyin -ing, ba'zilaridan keyin to kerak. Keling, qaysi birini qachon ishlatishni o'rganamiz!",
    location: 'Real vaziyat · Qiziqishlar haqida',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Gerundiy: fe'l + ing (swimming, reading)",
      "Infinitiv: to + fe'l (to swim, to read)",
      "like, enjoy, finish → -ing (I enjoy reading)",
      "want, decide, need, hope → to (I want to go)",
    ],
  },
  examples: [
    { en: 'I enjoy reading books.',    uz: 'Men kitob o\'qishni yoqtiraman.', key: 'reading' },
    { en: 'She wants to travel.',      uz: 'U sayohat qilmoqchi.',            key: 'to travel' },
    { en: 'They finished working.',    uz: 'Ular ishni tugatishdi.',          key: 'working' },
    { en: 'I decided to leave.',       uz: 'Men ketishga qaror qildim.',      key: 'to leave' },
  ],
  vocab: [
    { en: 'enjoy + ing',  uz: 'rohatlanmoq',  emoji: '😍', example: 'enjoy dancing' },
    { en: 'finish + ing', uz: 'tugatmoq',     emoji: '🏁', example: 'finish eating' },
    { en: 'want + to',    uz: 'xohlamoq',     emoji: '🙋', example: 'want to go' },
    { en: 'decide + to',  uz: 'qaror qilmoq', emoji: '🎯', example: 'decide to stay' },
    { en: 'need + to',    uz: 'kerak bo\'lmoq', emoji: '⚠️', example: 'need to rest' },
    { en: 'like + ing/to', uz: 'yoqtirmoq (ikkalasi)', emoji: '👍', example: 'like swimming' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'enjoy', uz: '+ ing' }, { en: 'want', uz: '+ to' }, { en: 'finish', uz: '+ ing' }, { en: 'decide', uz: '+ to' }], explanation: "Qaysi fe'l qaysi shaklni oladi." },
    { type: 'choose', sentence: 'I enjoy ___ to music.', options: ['listening', 'to listen', 'listen'], correct: 'listening', uz: 'Men musiqa tinglashni yoqtiraman.', explanation: "enjoy + ing (listening)." },
    { type: 'choose', sentence: 'She wants ___ a doctor.', options: ['to be', 'being', 'be'], correct: 'to be', uz: 'U shifokor bo\'lmoqchi.', explanation: "want + to (to be)." },
    { type: 'judge', sentence: 'I finished to read the book.', isCorrect: false, explanation: "Noto'g'ri! finish + ing: 'I finished reading the book'." },
    { type: 'build', uz: 'Men sayohat qilmoqchiman.', words: ['I', 'want', 'to', 'travel'], correct: ['I', 'want', 'to', 'travel'], explanation: "want + to + V1 (to travel)." },
    { type: 'choose', sentence: 'They decided ___ at home.', options: ['to stay', 'staying', 'stay'], correct: 'to stay', uz: 'Ular uyda qolishga qaror qilishdi.', explanation: "decide + to (to stay)." },
    { type: 'choose', sentence: 'He enjoys ___ football.', options: ['playing', 'to play', 'play'], correct: 'playing', uz: 'U futbol o\'ynashni yoqtiradi.', explanation: "enjoy + ing (playing)." },
    { type: 'judge', sentence: 'I need to rest.', isCorrect: true, explanation: "To'g'ri! need + to (to rest). Mukammal!" },
    { type: 'choose', sentence: 'Do you like ___ early?', options: ['getting up', 'to getting up', 'get up'], correct: 'getting up', uz: 'Erta turishni yoqtirasizmi?', explanation: "like + ing (yoki to). 'getting up' to'g'ri." },
    { type: 'build', uz: 'Ular gaplashishni tugatishdi.', words: ['They', 'finished', 'talking'], correct: ['They', 'finished', 'talking'], explanation: "finish + ing (talking)." },
    { type: 'judge', sentence: 'She wants going home.', isCorrect: false, explanation: "Noto'g'ri! want + to: 'She wants to go home'." },
    { type: 'choose', sentence: 'I hope ___ you soon.', options: ['to see', 'seeing', 'see'], correct: 'to see', uz: 'Sizni tez orada ko\'rishni umid qilaman.', explanation: "hope + to (to see)." },
    { type: 'choose', sentence: 'Stop ___! It\'s dangerous.', options: ['running', 'to run', 'run'], correct: 'running', uz: 'Yugurishni to\'xtating! Bu xavfli.', explanation: "stop + ing (harakatni to'xtatish)." },
    { type: 'build', uz: 'Men ketishga qaror qildim.', words: ['I', 'decided', 'to', 'leave'], correct: ['I', 'decided', 'to', 'leave'], explanation: "decide + to (to leave). Mukammal yakun!" },
  ],
  rule: {
    title: 'Gerunds & Infinitives — to\'liq qoida',
    body: "Fe'ldan keyin boshqa fe'l: -ing yoki to + fe'l.\n\n🔵 Gerundiy (+ ing) bilan keladigan fe'llar:\n   enjoy, finish, stop, mind, avoid, practise\n   • I enjoy reading · They finished working\n\n🔴 Infinitiv (to +) bilan keladigan fe'llar:\n   want, decide, need, hope, plan, would like\n   • I want to go · She decided to stay\n\n🟢 Ikkalasi ham (ma'no o'zgarmaydi):\n   like, love, hate, start, begin\n   • I like swimming = I like to swim\n\n⚠️ Predloglardan keyin doim -ing:\n   • good at cooking · interested in learning",
  },
  summary: [
    "enjoy, finish, stop → + ing",
    "want, decide, need, hope → + to",
    "like, love, start → ikkalasi ham",
    "Predlogdan keyin doim -ing (good at cooking)",
  ],
}

// ─── 8. Passive Voice ───────────────────────────────────────────────────────
const PASSIVE_VOICE: DemoLesson = {
  id: 'passive-voice-demo',
  skill: 'Majhul nisbat — passive voice',
  level: 'A2',
  emoji: '🔄',
  context: {
    text: "Tasavvur qiling — yangilik o'qiyapsiz: \"Bu ko'prik 1990-yilda QURILGAN\". Kim qurgani muhim emas — harakatning O'ZI muhim. Keling, majhul nisbatni (passive) o'rganamiz!",
    location: 'Real vaziyat · Yangilik o\'qish',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Passive — ob'ekt muhim, kim qilgani emas",
      "Tuzilishi: be + fe'lning 3-shakli (V3)",
      "English is spoken here (ingliz tilida gapiriladi)",
      "by — kim qilganini ko'rsatadi (by Shakespeare)",
    ],
  },
  examples: [
    { en: 'English is spoken here.',       uz: 'Bu yerda ingliz tilida gapiriladi.', key: 'is spoken' },
    { en: 'The house was built in 1990.',  uz: 'Uy 1990-yilda qurilgan.',            key: 'was built' },
    { en: 'Coffee is grown in Brazil.',    uz: 'Qahva Braziliyada yetishtiriladi.',  key: 'is grown' },
    { en: 'The book was written by him.',  uz: 'Kitob u tomonidan yozilgan.',        key: 'was written' },
  ],
  vocab: [
    { en: 'is/are + V3', uz: 'hozir (passive)',  emoji: '⏳', example: 'is made' },
    { en: 'was/were + V3', uz: 'o\'tmish (passive)', emoji: '⏪', example: 'was built' },
    { en: 'by',          uz: 'tomonidan',        emoji: '👤', example: 'by Picasso' },
    { en: 'made',        uz: 'qilingan (make→made)', emoji: '🏭', example: 'made in China' },
    { en: 'built',       uz: 'qurilgan (build→built)', emoji: '🏗️', example: 'was built' },
    { en: 'written',     uz: 'yozilgan (write→written)', emoji: '✍️', example: 'was written' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'made', uz: 'qilingan' }, { en: 'built', uz: 'qurilgan' }, { en: 'written', uz: 'yozilgan' }, { en: 'by', uz: 'tomonidan' }], explanation: "Passive uchun V3 shakllari." },
    { type: 'choose', sentence: 'This car ___ in Japan.', options: ['is made', 'makes', 'making'], correct: 'is made', uz: 'Bu mashina Yaponiyada ishlangan.', explanation: "Passive hozir: is + made (V3)." },
    { type: 'choose', sentence: 'The bridge ___ in 1990.', options: ['was built', 'built', 'is build'], correct: 'was built', uz: 'Ko\'prik 1990-yilda qurilgan.', explanation: "Passive o'tmish: was + built (V3)." },
    { type: 'judge', sentence: 'English is speak here.', isCorrect: false, explanation: "Noto'g'ri! V3 kerak: 'English is spoken here' (speak→spoken)." },
    { type: 'build', uz: 'Bu yerda ingliz tilida gapiriladi.', words: ['English', 'is', 'spoken', 'here'], correct: ['English', 'is', 'spoken', 'here'], explanation: "is + spoken (V3) — passive." },
    { type: 'choose', sentence: 'These rooms ___ every day.', options: ['are cleaned', 'clean', 'is cleaned'], correct: 'are cleaned', uz: 'Bu xonalar har kuni tozalanadi.', explanation: "rooms ko'plik → are + cleaned (V3)." },
    { type: 'choose', sentence: 'The letter ___ yesterday.', options: ['was sent', 'sent', 'is sent'], correct: 'was sent', uz: 'Xat kecha yuborilgan.', explanation: "O'tmish passive: was + sent (V3)." },
    { type: 'judge', sentence: 'The book was written by Tolstoy.', isCorrect: true, explanation: "To'g'ri! was + written (V3) + by. Mukammal!" },
    { type: 'choose', sentence: 'Coffee ___ in Brazil.', options: ['is grown', 'grows', 'grow'], correct: 'is grown', uz: 'Qahva Braziliyada yetishtiriladi.', explanation: "is + grown (V3, grow→grown)." },
    { type: 'build', uz: 'Uy o\'tgan yili sotilgan.', words: ['The', 'house', 'was', 'sold', 'last', 'year'], correct: ['The', 'house', 'was', 'sold', 'last', 'year'], explanation: "was + sold (V3, sell→sold)." },
    { type: 'judge', sentence: 'The cake was make by my mother.', isCorrect: false, explanation: "Noto'g'ri! V3: 'was made' (make→made)." },
    { type: 'choose', sentence: 'These photos ___ by a professional.', options: ['were taken', 'took', 'take'], correct: 'were taken', uz: 'Bu suratlar professional tomonidan olingan.', explanation: "photos ko'plik o'tmish → were + taken (V3)." },
    { type: 'choose', sentence: 'Rice ___ in Asia.', options: ['is grown', 'grows', 'grew'], correct: 'is grown', uz: 'Guruch Osiyoda yetishtiriladi.', explanation: "is + grown (V3)." },
    { type: 'build', uz: 'Rasm Pikasso tomonidan chizilgan.', words: ['The', 'picture', 'was', 'painted', 'by', 'Picasso'], correct: ['The', 'picture', 'was', 'painted', 'by', 'Picasso'], explanation: "was + painted (V3) + by. Mukammal yakun!" },
  ],
  rule: {
    title: 'Passive Voice — to\'liq qoida',
    body: "Passive (majhul) — ob'ekt muhim, kim qilgani emas.\n\n✅ Tuzilishi: be + V3 (3-shakl)\n   • Hozir: is/are + V3 → English is spoken\n   • O'tmish: was/were + V3 → It was built\n\n🔄 Active → Passive:\n   • They make cars here. (active)\n   • Cars are made here. (passive)\n\n👤 'by' — kim qilganini ko'rsatadi (kerak bo'lsa):\n   • The book was written by Tolstoy.\n   (ko'pincha by qism tushiriladi)\n\n📝 V3 yodda tuting:\n   make→made · build→built · write→written\n   speak→spoken · take→taken · grow→grown",
  },
  summary: [
    "Passive: be + V3 (is made, was built)",
    "Hozir: is/are + V3 · O'tmish: was/were + V3",
    "by — kim qilgani (was written by him)",
    "Ob'ekt muhim, bajaruvchi emas",
  ],
}

// ─── 9. Reported Speech ─────────────────────────────────────────────────────
const REPORTED_SPEECH: DemoLesson = {
  id: 'reported-speech-demo',
  skill: 'O\'zlashtirma gap — reported speech',
  level: 'A2',
  emoji: '💬',
  context: {
    text: "Tasavvur qiling — do'stingiz aytgan gapni boshqasiga yetkazyapsiz: U \"Men charchadim\" dedi → \"U charchaganini AYTDI\". Gap o'zgaradi! Keling, kimningdir so'zlarini qayta aytishni o'rganamiz!",
    location: 'Real vaziyat · Gap yetkazish',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "To'g'ri gap → o'zlashtirma gap (qaytadan aytish)",
      "Zamon bir pog'ona orqaga suriladi (present → past)",
      "say / tell — aytmoq (tell + odam)",
      "Olmoshlar ham o'zgaradi (I → he/she)",
    ],
  },
  examples: [
    { en: 'He said he was tired.',           uz: 'U charchaganini aytdi.',          key: 'said' },
    { en: 'She told me she was busy.',       uz: 'U menga band ekanini aytdi.',     key: 'told' },
    { en: 'They said they liked it.',        uz: 'Ular buni yoqtirishlarini aytishdi.', key: 'said' },
    { en: 'He said he would come.',          uz: 'U kelishini aytdi.',              key: 'would' },
  ],
  vocab: [
    { en: 'say',      uz: 'aytmoq (odam yo\'q)', emoji: '🗣️', example: 'He said (that)...' },
    { en: 'tell',     uz: 'aytmoq (+ odam)',     emoji: '👉', example: 'She told me...' },
    { en: 'is → was', uz: 'hozir → o\'tmish',    emoji: '⏪', example: 'is tired → was tired' },
    { en: 'will → would', uz: 'kelajak → o\'tmish', emoji: '🔄', example: 'will go → would go' },
    { en: 'can → could',  uz: 'mumkin → o\'tmish',  emoji: '🔁', example: 'can swim → could swim' },
    { en: 'now → then',   uz: 'hozir → o\'shanda',  emoji: '🕐', example: 'now → then' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'say', uz: 'aytmoq' }, { en: 'tell', uz: 'aytmoq (+odam)' }, { en: 'is → was', uz: 'zamon orqaga' }, { en: 'will → would', uz: 'kelajak orqaga' }], explanation: "O'zlashtirma gapning asoslari." },
    { type: 'choose', sentence: 'He said he ___ tired.', options: ['was', 'is', 'will be'], correct: 'was', uz: 'U charchaganini aytdi.', explanation: "is → was (zamon bir pog'ona orqaga)." },
    { type: 'choose', sentence: 'She ___ me she was happy.', options: ['told', 'said', 'say'], correct: 'told', uz: 'U menga xursand ekanini aytdi.', explanation: "tell + odam (told me). say'da odam bo'lmaydi." },
    { type: 'judge', sentence: 'He said me he was busy.', isCorrect: false, explanation: "Noto'g'ri! say bilan odam yo'q: 'He told me' yoki 'He said he was busy'." },
    { type: 'build', uz: 'U band ekanini aytdi.', words: ['He', 'said', 'he', 'was', 'busy'], correct: ['He', 'said', 'he', 'was', 'busy'], explanation: "said + he was (is → was)." },
    { type: 'choose', sentence: 'She said she ___ come tomorrow.', options: ['would', 'will', 'is'], correct: 'would', uz: 'U ertaga kelishini aytdi.', explanation: "will → would (o'zlashtirma)." },
    { type: 'choose', sentence: 'They said they ___ the film.', options: ['liked', 'like', 'will like'], correct: 'liked', uz: 'Ular filmni yoqtirishlarini aytishdi.', explanation: "like → liked (present → past)." },
    { type: 'judge', sentence: 'She told me she was tired.', isCorrect: true, explanation: "To'g'ri! told + me + was (zamon orqaga). Mukammal!" },
    { type: 'choose', sentence: 'He said he ___ swim well.', options: ['could', 'can', 'will'], correct: 'could', uz: 'U yaxshi suza olishini aytdi.', explanation: "can → could." },
    { type: 'build', uz: 'U menga charchaganini aytdi.', words: ['She', 'told', 'me', 'she', 'was', 'tired'], correct: ['She', 'told', 'me', 'she', 'was', 'tired'], explanation: "told + me + she was." },
    { type: 'judge', sentence: 'He said he will help.', isCorrect: false, explanation: "Noto'g'ri! will → would: 'He said he would help'." },
    { type: 'choose', sentence: 'I ___ him I was ready.', options: ['told', 'said', 'say'], correct: 'told', uz: 'Men unga tayyor ekanimni aytdim.', explanation: "tell + odam (told him)." },
    { type: 'choose', sentence: 'She said she ___ a new car.', options: ['had', 'has', 'will have'], correct: 'had', uz: 'U yangi mashinasi borligini aytdi.', explanation: "have → had." },
    { type: 'build', uz: 'Ular kelishlarini aytishdi.', words: ['They', 'said', 'they', 'would', 'come'], correct: ['They', 'said', 'they', 'would', 'come'], explanation: "said + would come (will → would). Mukammal yakun!" },
  ],
  rule: {
    title: 'Reported Speech — to\'liq qoida',
    body: "O'zlashtirma gap — kimningdir so'zini qayta aytish.\n\n🗣️ say vs tell:\n   • say (odam YO'Q): He said (that) he was tired.\n   • tell (+ odam): He told me (that) he was tired.\n\n⏪ Zamon bir pog'ona orqaga:\n   • am/is → was · are → were\n   • do/does → did · will → would\n   • can → could · have → had\n   • like → liked (present → past)\n\n👤 Olmoshlar o'zgaradi:\n   • \"I am happy\" → He said he was happy.\n   • \"my\" → his/her\n\n🕐 Vaqt so'zlari: now → then, today → that day",
  },
  summary: [
    "say (odam yo'q) · tell + odam (told me)",
    "Zamon orqaga: is→was, will→would, can→could",
    "Olmoshlar: I → he/she, my → his/her",
    "He said he was tired (\"I am tired\")",
  ],
}

// ─── 10. First Conditional ──────────────────────────────────────────────────
const FIRST_CONDITIONAL: DemoLesson = {
  id: 'first-conditional-demo',
  skill: 'Birinchi shart gap — first conditional',
  level: 'A2',
  emoji: '🔮',
  context: {
    text: "Tasavvur qiling — rejalashtiryapsiz: \"AGAR ertaga ob-havo yaxshi BO'LSA, biz piknikka boramiz\". Real, mumkin bo'lgan shart. Keling, kelajakdagi real shartlarni ifodalashni o'rganamiz!",
    location: 'Real vaziyat · Reja tuzish',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "First conditional — real, mumkin bo'lgan kelajak sharti",
      "Tuzilishi: If + Present Simple, will + fe'l",
      "If it rains, I will stay home (agar yog'sa, qolaman)",
      "Shart qismida 'will' ishlatilmaydi! (If it WILL rain ✗)",
    ],
  },
  examples: [
    { en: 'If it rains, I will stay home.', uz: 'Agar yomg\'ir yog\'sa, uyda qolaman.', key: 'will stay' },
    { en: 'If you study, you will pass.',   uz: 'Agar o\'qisangiz, o\'tasiz.',          key: 'will pass' },
    { en: 'She will come if she is free.',  uz: 'Agar bo\'sh bo\'lsa, u keladi.',        key: 'will come' },
    { en: "If you don't hurry, you'll be late.", uz: 'Shoshilmasangiz, kechikasiz.',    key: "you'll" },
  ],
  vocab: [
    { en: 'if',       uz: 'agar',           emoji: '🔀', example: 'if it rains' },
    { en: 'will',     uz: 'kelajak natija', emoji: '➡️', example: 'I will go' },
    { en: 'won\'t',   uz: 'qilmaydi',       emoji: '🚫', example: "won't come" },
    { en: 'pass',     uz: 'imtihondan o\'tmoq', emoji: '✅', example: 'pass the exam' },
    { en: 'hurry',    uz: 'shoshilmoq',     emoji: '⏱️', example: 'hurry up' },
    { en: 'unless',   uz: 'agar ...masa',   emoji: '⛔', example: 'unless you go' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'if', uz: 'agar' }, { en: 'will', uz: 'natija (kelajak)' }, { en: "won't", uz: 'qilmaydi' }, { en: 'pass', uz: 'o\'tmoq' }], explanation: "First conditional so'zlari." },
    { type: 'choose', sentence: 'If it rains, I ___ stay home.', options: ['will', 'am', 'do'], correct: 'will', uz: 'Agar yomg\'ir yog\'sa, uyda qolaman.', explanation: "Natija qismida → will + V1." },
    { type: 'choose', sentence: 'If you ___ hard, you will pass.', options: ['study', 'will study', 'studied'], correct: 'study', uz: 'Qattiq o\'qisangiz, o\'tasiz.', explanation: "Shart (if) qismida → Present Simple (study), will EMAS!" },
    { type: 'judge', sentence: 'If it will rain, I will stay home.', isCorrect: false, explanation: "Noto'g'ri! Shartda will yo'q: 'If it rains, I will stay home'." },
    { type: 'build', uz: 'Agar shoshilsangiz, avtobusga yetasiz.', words: ['If', 'you', 'hurry', 'you', 'will', 'catch', 'the', 'bus'], correct: ['If', 'you', 'hurry', 'you', 'will', 'catch', 'the', 'bus'], explanation: "If + Present (hurry), will + V1 (will catch)." },
    { type: 'choose', sentence: 'She will call you if she ___ time.', options: ['has', 'will have', 'had'], correct: 'has', uz: 'Agar vaqti bo\'lsa, u sizga qo\'ng\'iroq qiladi.', explanation: "if qismi → Present Simple (has)." },
    { type: 'choose', sentence: 'If you don\'t hurry, you ___ late.', options: ['will be', 'are', 'were'], correct: 'will be', uz: 'Shoshilmasangiz, kechikasiz.', explanation: "Natija → will be." },
    { type: 'judge', sentence: 'If I see her, I will tell her.', isCorrect: true, explanation: "To'g'ri! If + Present (see), will + V1 (tell). Mukammal!" },
    { type: 'choose', sentence: 'We will go out if it ___ sunny.', options: ['is', 'will be', 'was'], correct: 'is', uz: 'Agar quyoshli bo\'lsa, sayrga chiqamiz.', explanation: "if qismi → Present (is)." },
    { type: 'build', uz: 'Agar o\'qisangiz, imtihondan o\'tasiz.', words: ['If', 'you', 'study', 'you', 'will', 'pass'], correct: ['If', 'you', 'study', 'you', 'will', 'pass'], explanation: "If + study (Present), will + pass." },
    { type: 'judge', sentence: 'If he comes, I tell him.', isCorrect: false, explanation: "Noto'g'ri! Natija → will: 'If he comes, I will tell him'." },
    { type: 'choose', sentence: 'If they win, they ___ happy.', options: ['will be', 'are', 'were'], correct: 'will be', uz: 'Agar yutsalar, xursand bo\'lishadi.', explanation: "Natija → will be." },
    { type: 'choose', sentence: 'I won\'t go ___ you come with me.', options: ['unless', 'if', 'will'], correct: 'unless', uz: 'Siz men bilan bormasangiz, men bormayman.', explanation: "unless = if...not (agar ...masa)." },
    { type: 'build', uz: 'Agar yomg\'ir yog\'sa, biz uyda qolamiz.', words: ['If', 'it', 'rains', 'we', 'will', 'stay', 'home'], correct: ['If', 'it', 'rains', 'we', 'will', 'stay', 'home'], explanation: "If + rains (Present), will + stay. Mukammal yakun!" },
  ],
  rule: {
    title: 'First Conditional — to\'liq qoida',
    body: "First conditional — real, mumkin bo'lgan kelajak sharti.\n\n✅ Tuzilishi:\n   If + Present Simple, will + V1\n   • If it rains, I will stay home.\n   • You will pass if you study.\n   (tartibni almashtirsa bo'ladi, vergul faqat if oldinda kelsa)\n\n⚠️ ENG MUHIM qoida:\n   • Shart (if) qismida WILL ishlatilmaydi!\n   • If it WILL rain ✗ → If it rains ✓\n   • will faqat NATIJA qismida\n\n🚫 Inkor: won't (= will not)\n   If you don't hurry, you'll be late.\n\n⛔ unless = if ... not:\n   I won't go unless you come. (agar kelmasangiz)",
  },
  summary: [
    "If + Present Simple, will + V1",
    "If it rains, I will stay home",
    "Shart qismida WILL yo'q! (eng muhim)",
    "unless = if ... not (agar ...masa)",
  ],
}

// ─── 11. There is / There are ───────────────────────────────────────────────
const THERE_IS_ARE: DemoLesson = {
  id: 'there-is-there-are-demo',
  skill: 'There is / There are — biror narsa bor',
  level: 'A2',
  emoji: '🏠',
  context: {
    text: "Tasavvur qiling — yangi xonadoningizni do'stingizga tasvirlaysiz: \"Bu yerda bitta divan BOR, derazada gullar BOR\". Nimadir borligini aytish. Keling, there is / there are ni o'rganamiz!",
    location: 'Real vaziyat · Xonani tasvirlash',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "There is — bitta narsa (birlik): There is a book",
      "There are — ko'p narsa (ko'plik): There are books",
      "Inkor: There isn't / There aren't",
      "Savol: Is there...? Are there...?",
    ],
  },
  examples: [
    { en: 'There is a cat on the sofa.',  uz: 'Divanda mushuk bor.',           key: 'There is' },
    { en: 'There are five rooms.',        uz: 'Beshta xona bor.',              key: 'There are' },
    { en: "There isn't any milk.",        uz: 'Sut yo\'q.',                    key: "isn't" },
    { en: 'Are there any shops near?',    uz: 'Yaqinda do\'konlar bormi?',     key: 'Are there' },
  ],
  vocab: [
    { en: 'There is',  uz: 'bor (birlik)',   emoji: '1️⃣', example: 'There is a dog.' },
    { en: 'There are', uz: 'bor (ko\'plik)', emoji: '🔢', example: 'There are dogs.' },
    { en: "There isn't", uz: 'yo\'q (birlik)', emoji: '❌', example: "There isn't time." },
    { en: "There aren't", uz: 'yo\'q (ko\'plik)', emoji: '🚫', example: "There aren't seats." },
    { en: 'some',      uz: 'biroz',          emoji: '➕', example: 'There are some apples.' },
    { en: 'any',       uz: 'biror (inkor/savol)', emoji: '❔', example: 'Is there any bread?' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'There is', uz: 'bor (birlik)' }, { en: 'There are', uz: 'bor (ko\'plik)' }, { en: "isn't", uz: 'yo\'q (birlik)' }, { en: "aren't", uz: 'yo\'q (ko\'plik)' }], explanation: "There is/are ning shakllari." },
    { type: 'choose', sentence: '___ a book on the table.', options: ['There is', 'There are', 'It is'], correct: 'There is', uz: 'Stolda kitob bor.', explanation: "a book — birlik → There is." },
    { type: 'choose', sentence: '___ three chairs in the room.', options: ['There are', 'There is', 'It is'], correct: 'There are', uz: 'Xonada uchta stul bor.', explanation: "three chairs — ko'plik → There are." },
    { type: 'judge', sentence: 'There is two windows.', isCorrect: false, explanation: "Noto'g'ri! two windows ko'plik → 'There are two windows'." },
    { type: 'build', uz: 'Bog\'da ko\'p daraxt bor.', words: ['There', 'are', 'many', 'trees', 'in', 'the', 'garden'], correct: ['There', 'are', 'many', 'trees', 'in', 'the', 'garden'], explanation: "many trees — ko'plik → There are." },
    { type: 'choose', sentence: '___ any sugar?', options: ['Is there', 'Are there', 'There is'], correct: 'Is there', uz: 'Shakar bormi?', explanation: "sugar sanalmaydigan (birlik) → Is there?" },
    { type: 'choose', sentence: 'There ___ a problem.', options: ['is', 'are', 'be'], correct: 'is', uz: 'Muammo bor.', explanation: "a problem — birlik → There is." },
    { type: 'judge', sentence: 'There are some apples in the bag.', isCorrect: true, explanation: "To'g'ri! apples ko'plik → There are. Mukammal!" },
    { type: 'choose', sentence: 'There ___ any people here.', options: ["aren't", "isn't", 'not'], correct: "aren't", uz: 'Bu yerda odam yo\'q.', explanation: "people ko'plik → There aren't." },
    { type: 'build', uz: 'Sovutgichda sut yo\'q.', words: ['There', "isn't", 'any', 'milk'], correct: ['There', "isn't", 'any', 'milk'], explanation: "milk sanalmaydigan → There isn't." },
    { type: 'judge', sentence: 'Are there a hospital near?', isCorrect: false, explanation: "Noto'g'ri! a hospital birlik → 'Is there a hospital near?'" },
    { type: 'choose', sentence: '___ many students in class.', options: ['There are', 'There is', 'It is'], correct: 'There are', uz: 'Sinfda ko\'p talaba bor.', explanation: "many students — ko'plik → There are." },
    { type: 'choose', sentence: 'There ___ a good film tonight.', options: ['is', 'are', 'be'], correct: 'is', uz: 'Bugun kechqurun yaxshi film bor.', explanation: "a film — birlik → There is." },
    { type: 'build', uz: 'Yaqinda do\'konlar bormi?', words: ['Are', 'there', 'any', 'shops', 'near'], correct: ['Are', 'there', 'any', 'shops', 'near'], explanation: "shops ko'plik savol → Are there? Mukammal yakun!" },
  ],
  rule: {
    title: 'There is / There are — to\'liq qoida',
    body: "There is/are — biror joyda nimadir borligini aytadi.\n\n✅ There is — BIRLIK (bitta):\n   • There is a book / a cat / some milk\n   • Sanalmaydigan bilan ham: There is water\n\n✅ There are — KO'PLIK:\n   • There are books / three cats / many people\n\n❌ Inkor:\n   • There isn't (a book) · There aren't (any seats)\n\n❓ Savol:\n   • Is there a...? → Yes, there is. / No, there isn't.\n   • Are there any...? → Yes, there are.\n\n➕ some/any: ijobiyda some, inkor/savolda any",
  },
  summary: [
    "There is — birlik (a book, water)",
    "There are — ko'plik (books, people)",
    "Inkor: isn't/aren't · Savol: Is/Are there?",
    "some (ijobiy) · any (inkor/savol)",
  ],
}

// ─── 12. Possessives ────────────────────────────────────────────────────────
const POSSESSIVES: DemoLesson = {
  id: 'possessives-demo',
  skill: 'Egalik — possessive (my, mine, \'s)',
  level: 'A2',
  emoji: '🔑',
  context: {
    text: "Tasavvur qiling — narsalar kimniki ekanini aytyapsiz: \"Bu MENING kitobim, u SENING emas. Bu kitob MENIKI\". Egalikni ifodalashning bir nechta usuli bor. Keling, ularni o'rganamiz!",
    location: 'Real vaziyat · Narsalar egasi',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Egalik sifatlari: my, your, his, her, our, their (+ ot)",
      "Egalik olmoshlari: mine, yours, his, hers, ours, theirs",
      "'s — odam egaligi: Tom's car (Tomning mashinasi)",
      "my book = mine (ot takrorlanmaydi)",
    ],
  },
  examples: [
    { en: 'This is my book.',        uz: 'Bu mening kitobim.',         key: 'my' },
    { en: 'This book is mine.',      uz: 'Bu kitob meniki.',           key: 'mine' },
    { en: "It's Tom's car.",         uz: 'Bu Tomning mashinasi.',      key: "Tom's" },
    { en: 'Her bag is red.',         uz: 'Uning sumkasi qizil.',       key: 'Her' },
  ],
  vocab: [
    { en: 'my / mine',   uz: 'mening / meniki',  emoji: '🙋', example: 'my pen / it\'s mine' },
    { en: 'your / yours',uz: 'sening / seniki',  emoji: '👉', example: 'your book / yours' },
    { en: 'his',         uz: 'uning (erkak)',    emoji: '👨', example: 'his hat' },
    { en: 'her / hers',  uz: 'uning (ayol)',     emoji: '👩', example: 'her bag / hers' },
    { en: 'our / ours',  uz: 'bizning / bizniki',emoji: '👥', example: 'our house / ours' },
    { en: "'s",          uz: 'egalik (odam)',    emoji: '🔖', example: "Ali's phone" },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'my', uz: 'mening (+ot)' }, { en: 'mine', uz: 'meniki' }, { en: 'her', uz: 'uning (ayol)' }, { en: "Tom's", uz: 'Tomning' }], explanation: "Egalik shakllari." },
    { type: 'choose', sentence: 'This is ___ pen.', options: ['my', 'mine', 'me'], correct: 'my', uz: 'Bu mening ruchkam.', explanation: "ot (pen) oldidan → my (egalik sifati)." },
    { type: 'choose', sentence: 'This pen is ___.', options: ['mine', 'my', 'me'], correct: 'mine', uz: 'Bu ruchka meniki.', explanation: "ot takrorlanmaydi → mine (egalik olmoshi)." },
    { type: 'judge', sentence: 'This is mine book.', isCorrect: false, explanation: "Noto'g'ri! ot oldidan 'my': 'This is my book'." },
    { type: 'build', uz: 'Bu Tomning mashinasi.', words: ['This', 'is', "Tom's", 'car'], correct: ['This', 'is', "Tom's", 'car'], explanation: "Odam egaligi: Tom + 's + ot." },
    { type: 'choose', sentence: '___ bag is red.', options: ['Her', 'Hers', 'She'], correct: 'Her', uz: 'Uning sumkasi qizil.', explanation: "ot (bag) oldidan → Her." },
    { type: 'choose', sentence: 'That bag is ___.', options: ['hers', 'her', 'she'], correct: 'hers', uz: 'U sumka uniki.', explanation: "ot takrorlanmaydi → hers." },
    { type: 'judge', sentence: "It's his hat.", isCorrect: true, explanation: "To'g'ri! his — uning (erkak) + ot. Mukammal!" },
    { type: 'choose', sentence: 'This house is ___.', options: ['ours', 'our', 'us'], correct: 'ours', uz: 'Bu uy bizniki.', explanation: "ot yo'q → ours (egalik olmoshi)." },
    { type: 'build', uz: 'Bu bizning maktabimiz.', words: ['This', 'is', 'our', 'school'], correct: ['This', 'is', 'our', 'school'], explanation: "ot (school) oldidan → our." },
    { type: 'judge', sentence: 'This is the car of Tom.', isCorrect: false, explanation: "Tabiiyroq: 'Tom's car' (odam uchun 's ishlatiladi)." },
    { type: 'choose', sentence: 'Those books are ___.', options: ['theirs', 'their', 'them'], correct: 'theirs', uz: 'U kitoblar ularniki.', explanation: "ot yo'q → theirs." },
    { type: 'choose', sentence: 'Is this ___ phone?', options: ['your', 'yours', 'you'], correct: 'your', uz: 'Bu sizning telefoningizmi?', explanation: "ot (phone) oldidan → your." },
    { type: 'build', uz: 'Bu ruchka seniki.', words: ['This', 'pen', 'is', 'yours'], correct: ['This', 'pen', 'is', 'yours'], explanation: "ot takrorlanmaydi → yours. Mukammal yakun!" },
  ],
  rule: {
    title: 'Possessives — to\'liq qoida',
    body: "Egalik — narsa kimniki ekanini bildiradi.\n\n🔖 Egalik sifatlari (+ OT keladi):\n   my, your, his, her, its, our, their\n   • my book · her bag · our house\n\n🔑 Egalik olmoshlari (OT YO'Q):\n   mine, yours, his, hers, ours, theirs\n   • This book is mine. · The bag is hers.\n   (ot takrorlanmaydi!)\n\n👤 's — odam egaligi:\n   • Tom's car (Tomning mashinasi)\n   • my sister's name\n   • ko'plik: the students' books (s')\n\n⚠️ its (egalik) ≠ it's (= it is)!",
  },
  summary: [
    "Egalik sifati + ot: my book, her bag",
    "Egalik olmoshi (ot yo'q): mine, hers, ours",
    "'s — odam egaligi: Tom's car",
    "its (egalik) ≠ it's (it is)",
  ],
}

// ─── 13. Some / Any / No / Every ────────────────────────────────────────────
const SOME_ANY_NO_EVERY: DemoLesson = {
  id: 'some-any-no-every-demo',
  skill: 'Some / Any / No / Every va qo\'shma shakllar',
  level: 'A2',
  emoji: '🧩',
  context: {
    text: "Tasavvur qiling — kvartirani qidiryapsiz: \"BIROR kishi uydami? HECH KIM yo'q. HAMMA narsa joyida\". some-, any-, no-, every- so'zlari odam, narsa va joyni bildiradi. Keling, ularni o'rganamiz!",
    location: 'Real vaziyat · Uy izlash',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "some — ijobiy (something, someone, somewhere)",
      "any — inkor/savol (anything, anyone, anywhere)",
      "no — inkor ma'no (nothing, no one, nowhere)",
      "every — hamma (everything, everyone, everywhere)",
    ],
  },
  examples: [
    { en: 'I need something to eat.',   uz: 'Menga yeyishga nimadir kerak.',  key: 'something' },
    { en: 'Is there anyone here?',      uz: 'Bu yerda kimdir bormi?',         key: 'anyone' },
    { en: 'There is nothing here.',     uz: 'Bu yerda hech narsa yo\'q.',     key: 'nothing' },
    { en: 'Everyone is happy.',         uz: 'Hamma xursand.',                 key: 'Everyone' },
  ],
  vocab: [
    { en: 'something', uz: 'nimadir',     emoji: '📦', example: 'I see something.' },
    { en: 'someone',   uz: 'kimdir',      emoji: '🧑', example: 'Someone is calling.' },
    { en: 'anything',  uz: 'hech narsa / nimadir', emoji: '❔', example: 'anything else?' },
    { en: 'nothing',   uz: 'hech narsa',  emoji: '🚫', example: 'Nothing happened.' },
    { en: 'everyone',  uz: 'hamma',       emoji: '👥', example: 'Everyone knows.' },
    { en: 'nowhere',   uz: 'hech qayerda',emoji: '📍', example: 'go nowhere' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'something', uz: 'nimadir' }, { en: 'anyone', uz: 'kimdir (savol)' }, { en: 'nothing', uz: 'hech narsa' }, { en: 'everywhere', uz: 'hamma joyda' }], explanation: "some/any/no/every + thing/one/where." },
    { type: 'choose', sentence: 'I want ___ to drink.', options: ['something', 'anything', 'nothing'], correct: 'something', uz: 'Men ichishga nimadir xohlayman.', explanation: "Ijobiy gap → something." },
    { type: 'choose', sentence: 'Is there ___ in the box?', options: ['anything', 'something', 'nothing'], correct: 'anything', uz: 'Qutida nimadir bormi?', explanation: "Savol → anything." },
    { type: 'judge', sentence: "I don't have nothing.", isCorrect: false, explanation: "Noto'g'ri! Ikki inkor bo'lmaydi: 'I don't have anything' yoki 'I have nothing'." },
    { type: 'build', uz: 'Bu yerda hech kim yo\'q.', words: ['There', 'is', 'no', 'one', 'here'], correct: ['There', 'is', 'no', 'one', 'here'], explanation: "no one — hech kim (ijobiy fe'l bilan inkor ma'no)." },
    { type: 'choose', sentence: '___ knows the answer.', options: ['Everyone', 'Anyone', 'Nothing'], correct: 'Everyone', uz: 'Hamma javobni biladi.', explanation: "Hamma → Everyone (birlik fe'l: knows)." },
    { type: 'choose', sentence: 'I looked ___ but found nothing.', options: ['everywhere', 'somewhere', 'anywhere'], correct: 'everywhere', uz: 'Men hamma joyga qaradim, lekin hech narsa topmadim.', explanation: "Hamma joy → everywhere." },
    { type: 'judge', sentence: 'Someone is knocking on the door.', isCorrect: true, explanation: "To'g'ri! someone — kimdir (ijobiy). Mukammal!" },
    { type: 'choose', sentence: 'There is ___ in the fridge. It\'s empty.', options: ['nothing', 'something', 'anything'], correct: 'nothing', uz: 'Sovutgichda hech narsa yo\'q. U bo\'sh.', explanation: "Inkor ma'no (ijobiy fe'l) → nothing." },
    { type: 'build', uz: 'Hamma narsa joyida.', words: ['Everything', 'is', 'okay'], correct: ['Everything', 'is', 'okay'], explanation: "everything — hamma narsa (birlik fe'l: is)." },
    { type: 'judge', sentence: 'Do you need anything?', isCorrect: true, explanation: "To'g'ri! Savol → anything. Mukammal!" },
    { type: 'choose', sentence: 'I have ___ to tell you.', options: ['something', 'anything', 'nowhere'], correct: 'something', uz: 'Sizga aytadigan narsam bor.', explanation: "Ijobiy → something." },
    { type: 'choose', sentence: 'She went ___. She stayed home.', options: ['nowhere', 'somewhere', 'everywhere'], correct: 'nowhere', uz: 'U hech qayerga bormadi. Uyda qoldi.', explanation: "Hech qayer → nowhere (ijobiy fe'l bilan)." },
    { type: 'build', uz: 'Bu yerda kimdir bormi?', words: ['Is', 'there', 'anyone', 'here'], correct: ['Is', 'there', 'anyone', 'here'], explanation: "Savol → anyone. Mukammal yakun!" },
  ],
  rule: {
    title: 'Some / Any / No / Every — to\'liq qoida',
    body: "Bu so'zlar + thing/one/where = odam, narsa, joy.\n\n➕ some- — IJOBIY gaplar:\n   something, someone, somewhere\n   • I need something.\n\n❔ any- — INKOR va SAVOL:\n   anything, anyone, anywhere\n   • Is there anything? · I don't see anyone.\n\n🚫 no- — INKOR ma'no (ijobiy fe'l bilan):\n   nothing, no one, nowhere\n   • There is nothing. (= isn't anything)\n   ⚠️ Ikki inkor BO'LMAYDI: don't have nothing ✗\n\n👥 every- — HAMMA (birlik fe'l):\n   everything, everyone, everywhere\n   • Everyone is here. (is, are emas!)",
  },
  summary: [
    "some- → ijobiy (something, someone)",
    "any- → inkor/savol (anything, anyone)",
    "no- → inkor ma'no (nothing) — ikki inkor yo'q!",
    "every- → hamma (everyone is, birlik)",
  ],
}

// ─── 14. Verb Patterns ──────────────────────────────────────────────────────
const VERB_PATTERNS: DemoLesson = {
  id: 'verb-patterns-demo',
  skill: 'Fe\'l birikmalari — verb patterns',
  level: 'A2',
  emoji: '🔗',
  context: {
    text: "Tasavvur qiling — kelajak rejalaringizni aytyapsiz: \"Men sayohat qilishni REJALASHTIRYAPMAN, yangi til o'rganishdan QO'RQMAYMAN\". Har bir fe'l o'zidan keyin maxsus shakl talab qiladi. Keling, eng muhim birikmalarni o'rganamiz!",
    location: 'Real vaziyat · Reja va his-tuyg\'ular',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "verb + to + fe'l: plan to, hope to, promise to",
      "verb + ing: avoid, suggest, can't stand, look forward to",
      "verb + odam + to: ask/tell/want someone to do",
      "let / make + odam + V1 (to YO'Q): let me go",
    ],
  },
  examples: [
    { en: 'I plan to study abroad.',     uz: 'Men chet elda o\'qishni rejalashtiraman.', key: 'to study' },
    { en: 'She avoids eating sugar.',    uz: 'U shakar yeyishdan qochadi.',              key: 'eating' },
    { en: 'He asked me to help.',        uz: 'U mendan yordam so\'radi.',                key: 'me to help' },
    { en: 'Let me go.',                  uz: 'Meni qo\'yib yubor.',                      key: 'Let me go' },
  ],
  vocab: [
    { en: 'plan to',    uz: 'rejalashtirmoq',  emoji: '📅', example: 'plan to travel' },
    { en: 'avoid + ing',uz: 'qochmoq',         emoji: '🙅', example: 'avoid driving' },
    { en: 'promise to', uz: 'va\'da bermoq',   emoji: '🤝', example: 'promise to come' },
    { en: 'suggest + ing', uz: 'taklif qilmoq', emoji: '💡', example: 'suggest going' },
    { en: 'ask sb to',  uz: 'kimdandir so\'ramoq', emoji: '🙏', example: 'ask him to wait' },
    { en: 'let sb V1',  uz: 'ruxsat bermoq',   emoji: '✅', example: 'let me see' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'plan', uz: '+ to' }, { en: 'avoid', uz: '+ ing' }, { en: 'ask sb', uz: '+ to' }, { en: 'let sb', uz: '+ V1' }], explanation: "Fe'l birikmalarining shakllari." },
    { type: 'choose', sentence: 'I plan ___ a new language.', options: ['to learn', 'learning', 'learn'], correct: 'to learn', uz: 'Men yangi til o\'rganishni rejalashtiraman.', explanation: "plan + to (to learn)." },
    { type: 'choose', sentence: 'She avoids ___ late.', options: ['being', 'to be', 'be'], correct: 'being', uz: 'U kechikishdan qochadi.', explanation: "avoid + ing (being)." },
    { type: 'judge', sentence: 'He promised coming early.', isCorrect: false, explanation: "Noto'g'ri! promise + to: 'He promised to come early'." },
    { type: 'build', uz: 'U mendan kutishni so\'radi.', words: ['He', 'asked', 'me', 'to', 'wait'], correct: ['He', 'asked', 'me', 'to', 'wait'], explanation: "ask + odam + to (asked me to wait)." },
    { type: 'choose', sentence: 'I suggest ___ to the cinema.', options: ['going', 'to go', 'go'], correct: 'going', uz: 'Men kinoga borishni taklif qilaman.', explanation: "suggest + ing (going)." },
    { type: 'choose', sentence: 'My parents let me ___ out.', options: ['go', 'to go', 'going'], correct: 'go', uz: 'Ota-onam meni tashqariga chiqishga ruxsat berishadi.', explanation: "let + odam + V1 (to YO'Q): let me go." },
    { type: 'judge', sentence: 'I hope to see you soon.', isCorrect: true, explanation: "To'g'ri! hope + to (to see). Mukammal!" },
    { type: 'choose', sentence: 'She wants me ___ her.', options: ['to call', 'calling', 'call'], correct: 'to call', uz: 'U mendan unga qo\'ng\'iroq qilishimni xohlaydi.', explanation: "want + odam + to (me to call)." },
    { type: 'build', uz: 'Bu meni kulishimga majbur qiladi.', words: ['It', 'makes', 'me', 'laugh'], correct: ['It', 'makes', 'me', 'laugh'], explanation: "make + odam + V1 (to YO'Q): makes me laugh." },
    { type: 'judge', sentence: 'They asked us wait.', isCorrect: false, explanation: "Noto'g'ri! ask + odam + to: 'They asked us to wait'." },
    { type: 'choose', sentence: 'I can\'t stand ___ in queues.', options: ['waiting', 'to wait', 'wait'], correct: 'waiting', uz: 'Men navbatda kutishga toqat qila olmayman.', explanation: "can't stand + ing (waiting)." },
    { type: 'choose', sentence: 'He decided ___ the job.', options: ['to take', 'taking', 'take'], correct: 'to take', uz: 'U ishni qabul qilishga qaror qildi.', explanation: "decide + to (to take)." },
    { type: 'build', uz: 'U menga yordam berishni taklif qildi.', words: ['He', 'offered', 'to', 'help', 'me'], correct: ['He', 'offered', 'to', 'help', 'me'], explanation: "offer + to (to help). Mukammal yakun!" },
  ],
  rule: {
    title: 'Verb Patterns — to\'liq qoida',
    body: "Fe'ldan keyin qaysi shakl kelishini bilish kerak.\n\n🔴 verb + to + V1:\n   plan, hope, promise, decide, offer, want, agree\n   • I plan to study · He decided to leave\n\n🔵 verb + ing:\n   avoid, suggest, can't stand, enjoy, finish, mind\n   • She avoids eating · I suggest going\n\n👤 verb + odam + to:\n   ask, tell, want, would like\n   • He asked me to help · I want you to come\n\n✅ let / make + odam + V1 (to YO'Q!):\n   • Let me go. · It makes me laugh.\n   • (help + odam + (to) V1 — ikkalasi ham bo'ladi)",
  },
  summary: [
    "plan, hope, promise, decide → + to",
    "avoid, suggest, can't stand → + ing",
    "ask/tell/want + odam + to (me to go)",
    "let/make + odam + V1 (let me go — to yo'q)",
  ],
}

// ─── 15. Time Prepositions ──────────────────────────────────────────────────
const TIME_PREPOSITIONS: DemoLesson = {
  id: 'time-prepositions-demo',
  skill: 'Vaqt predloglari — for, since, ago, during...',
  level: 'A2',
  emoji: '⏰',
  context: {
    text: "Tasavvur qiling — tajribangiz haqida gapiryapsiz: \"Men 5 YIL DAVOMIDA ingliz tilini o'rganaman, 2020-YILDAN BERI shu shaharda yashayman\". Vaqtni aniq ifodalash muhim. Keling, vaqt predloglarini o'rganamiz!",
    location: 'Real vaziyat · Tajriba haqida',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "for — muddat (for 5 years — 5 yil davomida)",
      "since — boshlanish nuqtasi (since 2020 — 2020 yildan beri)",
      "ago — necha vaqt oldin (2 days ago)",
      "during — davomida · until — gacha · by — gacha (muddat)",
    ],
  },
  examples: [
    { en: 'I have lived here for 5 years.', uz: 'Men bu yerda 5 yil yashayman.',       key: 'for' },
    { en: 'She has worked since 2020.',     uz: 'U 2020 yildan beri ishlaydi.',        key: 'since' },
    { en: 'He left two days ago.',          uz: 'U ikki kun oldin ketdi.',             key: 'ago' },
    { en: 'I will stay until Friday.',      uz: 'Men jumagacha qolaman.',              key: 'until' },
  ],
  vocab: [
    { en: 'for',      uz: 'davomida (muddat)', emoji: '📏', example: 'for two hours' },
    { en: 'since',    uz: 'beri (nuqta)',      emoji: '📅', example: 'since Monday' },
    { en: 'ago',      uz: 'oldin',             emoji: '⏪', example: 'a week ago' },
    { en: 'during',   uz: 'davomida (voqea)',  emoji: '🎬', example: 'during the film' },
    { en: 'until',    uz: 'gacha',             emoji: '🏁', example: 'until 6 pm' },
    { en: 'by',       uz: 'gacha (muddat oxiri)', emoji: '⌛', example: 'by Monday' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'for', uz: 'muddat' }, { en: 'since', uz: 'boshlanish nuqtasi' }, { en: 'ago', uz: 'oldin' }, { en: 'until', uz: 'gacha' }], explanation: "Vaqt predloglari." },
    { type: 'choose', sentence: 'I have studied English ___ 3 years.', options: ['for', 'since', 'ago'], correct: 'for', uz: 'Men 3 yil davomida ingliz tili o\'rganaman.', explanation: "Muddat (3 years) → for." },
    { type: 'choose', sentence: 'She has lived here ___ 2019.', options: ['since', 'for', 'ago'], correct: 'since', uz: 'U 2019 yildan beri shu yerda yashaydi.', explanation: "Boshlanish nuqtasi (2019) → since." },
    { type: 'judge', sentence: 'I have worked here since 5 years.', isCorrect: false, explanation: "Noto'g'ri! Muddat → for: 'for 5 years' (since 2019 — nuqta)." },
    { type: 'build', uz: 'U bir hafta oldin keldi.', words: ['He', 'arrived', 'a', 'week', 'ago'], correct: ['He', 'arrived', 'a', 'week', 'ago'], explanation: "ago — gap oxirida (a week ago)." },
    { type: 'choose', sentence: 'I waited ___ two hours.', options: ['for', 'since', 'during'], correct: 'for', uz: 'Men ikki soat kutdim.', explanation: "Muddat → for (two hours)." },
    { type: 'choose', sentence: 'I fell asleep ___ the film.', options: ['during', 'for', 'since'], correct: 'during', uz: 'Men film davomida uxlab qoldim.', explanation: "Voqea davomida → during (during the film)." },
    { type: 'judge', sentence: 'He has been here since Monday.', isCorrect: true, explanation: "To'g'ri! since + nuqta (Monday). Mukammal!" },
    { type: 'choose', sentence: 'The shop is open ___ 9 pm.', options: ['until', 'for', 'since'], correct: 'until', uz: 'Do\'kon soat 9 gacha ochiq.', explanation: "...gacha (oxirgi nuqta) → until." },
    { type: 'build', uz: 'Men dushanbagacha bu ishni tugataman.', words: ['I', 'will', 'finish', 'by', 'Monday'], correct: ['I', 'will', 'finish', 'by', 'Monday'], explanation: "by — muddat oxirigacha (vazifa tugashi)." },
    { type: 'judge', sentence: 'She came home two hours during.', isCorrect: false, explanation: "Noto'g'ri! 'two hours ago' (oldin) — during emas." },
    { type: 'choose', sentence: 'We talked ___ an hour.', options: ['for', 'since', 'ago'], correct: 'for', uz: 'Biz bir soat gaplashdik.', explanation: "Muddat → for (an hour)." },
    { type: 'choose', sentence: 'I haven\'t seen him ___ last week.', options: ['since', 'for', 'during'], correct: 'since', uz: 'Men uni o\'tgan haftadan beri ko\'rmadim.', explanation: "Boshlanish nuqtasi (last week) → since." },
    { type: 'build', uz: 'U uch kun oldin ketdi.', words: ['She', 'left', 'three', 'days', 'ago'], correct: ['She', 'left', 'three', 'days', 'ago'], explanation: "ago — gap oxirida. Mukammal yakun!" },
  ],
  rule: {
    title: 'Time Prepositions — to\'liq qoida',
    body: "Vaqt predloglari — qancha, qachondan, qachongacha.\n\n📏 for — MUDDAT (qancha vaqt):\n   • for 5 years · for two hours · for a long time\n\n📅 since — BOSHLANISH nuqtasi (qachondan beri):\n   • since 2020 · since Monday · since I was a child\n\n⏪ ago — necha vaqt OLDIN (gap oxirida):\n   • two days ago · a week ago (Simple Past bilan)\n\n🎬 during — voqea DAVOMIDA:\n   • during the film · during the holiday\n\n🏁 until — ...GACHA: open until 9 pm\n⌛ by — muddat OXIRIGACHA: finish by Monday",
  },
  summary: [
    "for — muddat (for 5 years)",
    "since — boshlanish nuqtasi (since 2020)",
    "ago — oldin (two days ago, gap oxirida)",
    "during (davomida) · until (gacha) · by (oxirigacha)",
  ],
}

// ─── 16. Present Continuous for Future ──────────────────────────────────────
const PRESENT_CONTINUOUS_FUTURE: DemoLesson = {
  id: 'present-continuous-future-demo',
  skill: 'Present Continuous kelajak uchun — rejalashtirgan ishlar',
  level: 'A2',
  emoji: '📆',
  context: {
    text: "Tasavvur qiling — do'stingiz so'rayapti: \"Shanba kuni nima qilyapsan?\" Siz: \"Men do'stlarim bilan UCHRASHYAPMAN\" deysiz — bu kelajak reja! Present Continuous nafaqat hozir, balki rejalashtirilgan kelajakni ham bildiradi. Keling, o'rganamiz!",
    location: 'Real vaziyat · Hafta oxiri rejalari',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Present Continuous (am/is/are + ing) kelajak rejasini bildiradi",
      "Aniq, kelishilgan rejalar uchun ishlatiladi",
      "I'm meeting John tomorrow (reja allaqachon bor)",
      "Vaqt so'zlari bilan: tonight, tomorrow, next week",
    ],
  },
  examples: [
    { en: "I'm meeting friends tonight.",  uz: 'Men bugun kechqurun do\'stlarim bilan uchrashyapman.', key: "I'm meeting" },
    { en: 'She is flying to Dubai tomorrow.', uz: 'U ertaga Dubayga uchadi.',         key: 'is flying' },
    { en: 'What are you doing this weekend?', uz: 'Hafta oxiri nima qilyapsiz?',      key: 'are you doing' },
    { en: 'We are having a party on Friday.', uz: 'Juma kuni bazm qilyapmiz.',        key: 'are having' },
  ],
  vocab: [
    { en: 'meet',     uz: 'uchrashmoq',  emoji: '🤝', example: "I'm meeting her." },
    { en: 'fly',      uz: 'uchmoq',      emoji: '✈️', example: 'flying tomorrow' },
    { en: 'visit',    uz: 'tashrif buyurmoq', emoji: '🏠', example: 'visiting grandma' },
    { en: 'leave',    uz: 'jo\'namoq',   emoji: '🚪', example: 'leaving at 6' },
    { en: 'tonight',  uz: 'bugun kechqurun', emoji: '🌙', example: 'tonight' },
    { en: 'next week',uz: 'kelasi hafta',emoji: '📅', example: 'next week' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'meet', uz: 'uchrashmoq' }, { en: 'fly', uz: 'uchmoq' }, { en: 'tonight', uz: 'bugun kechqurun' }, { en: 'next week', uz: 'kelasi hafta' }], explanation: "Kelajak rejasi uchun so'zlar." },
    { type: 'choose', sentence: "I ___ John tomorrow.", options: ["'m meeting", 'meet', 'met'], correct: "'m meeting", uz: 'Men ertaga Jon bilan uchrashyapman.', explanation: "Kelishilgan reja → am + meeting (Present Continuous)." },
    { type: 'choose', sentence: 'She ___ to Paris next week.', options: ['is flying', 'flies', 'flew'], correct: 'is flying', uz: 'U kelasi hafta Parijga uchadi.', explanation: "Reja → is + flying." },
    { type: 'judge', sentence: 'What you doing tonight?', isCorrect: false, explanation: "Noto'g'ri! yordamchi kerak: 'What are you doing tonight?'" },
    { type: 'build', uz: 'Biz juma kuni bazm qilyapmiz.', words: ['We', 'are', 'having', 'a', 'party', 'on', 'Friday'], correct: ['We', 'are', 'having', 'a', 'party', 'on', 'Friday'], explanation: "Reja → are + having." },
    { type: 'choose', sentence: 'They ___ tomorrow morning.', options: ['are leaving', 'leave', 'left'], correct: 'are leaving', uz: 'Ular ertaga ertalab jo\'nashadi.', explanation: "Belgilangan reja → are + leaving." },
    { type: 'choose', sentence: '___ you coming to the meeting?', options: ['Are', 'Do', 'Is'], correct: 'Are', uz: 'Yig\'ilishga kelyapsizmi?', explanation: "Savol: Are + you + V-ing?" },
    { type: 'judge', sentence: "I'm visiting my grandma on Sunday.", isCorrect: true, explanation: "To'g'ri! Reja → am + visiting. Mukammal!" },
    { type: 'choose', sentence: 'We ___ dinner at 8 tonight.', options: ['are having', 'have', 'had'], correct: 'are having', uz: 'Biz bugun soat 8 da kechki ovqat qilyapmiz.', explanation: "Belgilangan vaqt rejasi → are + having." },
    { type: 'build', uz: 'U ertaga kelyapti.', words: ['He', 'is', 'coming', 'tomorrow'], correct: ['He', 'is', 'coming', 'tomorrow'], explanation: "Reja → is + coming." },
    { type: 'judge', sentence: 'She is fly to Dubai next month.', isCorrect: false, explanation: "Noto'g'ri! V-ing kerak: 'She is flying to Dubai'." },
    { type: 'choose', sentence: 'I ___ the doctor at 3 pm.', options: ['am seeing', 'see', 'saw'], correct: 'am seeing', uz: 'Men soat 3 da shifokorga ko\'rinaman.', explanation: "Uchrashuv rejasi → am + seeing." },
    { type: 'choose', sentence: 'What ___ they doing this weekend?', options: ['are', 'do', 'is'], correct: 'are', uz: 'Ular hafta oxiri nima qilyaptilar?', explanation: "they → are + doing." },
    { type: 'build', uz: 'Men bugun kechqurun do\'stlarim bilan uchrashyapman.', words: ["I'm", 'meeting', 'friends', 'tonight'], correct: ["I'm", 'meeting', 'friends', 'tonight'], explanation: "Reja → I'm meeting. Mukammal yakun!" },
  ],
  rule: {
    title: 'Present Continuous for Future — to\'liq qoida',
    body: "Present Continuous nafaqat hozir, balki KELAJAK rejasini ham bildiradi.\n\n✅ Tuzilishi: am/is/are + fe'l + ing\n   • I'm meeting John tomorrow.\n   • She is flying to Dubai next week.\n\n🔑 Qachon ishlatiladi:\n   • ANIQ, kelishilgan reja (kun/vaqt belgilangan)\n   • I'm seeing the doctor at 3 (uchrashuv bor)\n\n🆚 will bilan farqi:\n   • Present Continuous — oldindan reja (I'm meeting)\n   • will — hozir qaror (I'll meet)\n\n🕐 Vaqt so'zlari: tonight, tomorrow,\n   this weekend, next week, on Friday",
  },
  summary: [
    "am/is/are + ing = kelajak rejasi",
    "Aniq, kelishilgan rejalar uchun",
    "I'm meeting John tomorrow",
    "tonight, tomorrow, next week bilan",
  ],
}

// ─── 17. Quantifiers ────────────────────────────────────────────────────────
const QUANTIFIERS: DemoLesson = {
  id: 'quantifiers-demo',
  skill: 'Miqdor so\'zlari — quantifiers (a lot of, much, few...)',
  level: 'A2',
  emoji: '📊',
  context: {
    text: "Tasavvur qiling — kun tartibingizni aytyapsiz: \"Menda KO'P ish bor, lekin OZ vaqt. BIR NECHA daqiqa dam olaman\". Miqdorni aniq ifodalash kerak. Keling, miqdor so'zlarini o'rganamiz!",
    location: 'Real vaziyat · Kun tartibi',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "a lot of / lots of — ko'p (ikkalasi bilan)",
      "much (sanalmaydigan) / many (sanaladigan) — ko'p",
      "(a) little — ozgina · (a) few — bir nechta",
      "little/few = kam (salbiy) · a little/a few = ozgina (ijobiy)",
    ],
  },
  examples: [
    { en: 'I have a lot of work.',     uz: 'Menda ko\'p ish bor.',           key: 'a lot of' },
    { en: "There isn't much time.",    uz: 'Ko\'p vaqt yo\'q.',              key: 'much' },
    { en: 'I have a few friends.',     uz: 'Menda bir nechta do\'st bor.',   key: 'a few' },
    { en: 'There is little water.',    uz: 'Suv kam.',                       key: 'little' },
  ],
  vocab: [
    { en: 'a lot of', uz: 'ko\'p (ikkalasi)',  emoji: '📈', example: 'a lot of money' },
    { en: 'much',     uz: 'ko\'p (sanalmaydigan)', emoji: '💧', example: 'much time' },
    { en: 'many',     uz: 'ko\'p (sanaladigan)',   emoji: '🔢', example: 'many people' },
    { en: 'a few',    uz: 'bir nechta (ijobiy)', emoji: '✋', example: 'a few books' },
    { en: 'a little', uz: 'ozgina (ijobiy)',   emoji: '🤏', example: 'a little milk' },
    { en: 'few/little', uz: 'kam (salbiy)',    emoji: '📉', example: 'few people came' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'a lot of', uz: 'ko\'p' }, { en: 'much', uz: 'ko\'p (sanalmaydigan)' }, { en: 'a few', uz: 'bir nechta' }, { en: 'a little', uz: 'ozgina' }], explanation: "Miqdor so'zlari." },
    { type: 'choose', sentence: 'I have ___ work today.', options: ['a lot of', 'many', 'a few'], correct: 'a lot of', uz: 'Bugun menda ko\'p ish bor.', explanation: "work sanalmaydigan, ijobiy → a lot of (much rasmiyroq)." },
    { type: 'choose', sentence: 'There aren\'t ___ people here.', options: ['many', 'much', 'a little'], correct: 'many', uz: 'Bu yerda ko\'p odam yo\'q.', explanation: "people sanaladigan → many." },
    { type: 'judge', sentence: "There isn't many time.", isCorrect: false, explanation: "Noto'g'ri! time sanalmaydigan → 'much time'." },
    { type: 'build', uz: 'Menda bir nechta savol bor.', words: ['I', 'have', 'a', 'few', 'questions'], correct: ['I', 'have', 'a', 'few', 'questions'], explanation: "questions sanaladigan → a few." },
    { type: 'choose', sentence: 'Add ___ sugar to the tea.', options: ['a little', 'a few', 'many'], correct: 'a little', uz: 'Choyga ozgina shakar qo\'shing.', explanation: "sugar sanalmaydigan → a little." },
    { type: 'choose', sentence: 'She has ___ money. She is rich.', options: ['a lot of', 'few', 'little'], correct: 'a lot of', uz: 'Uning ko\'p puli bor. U boy.', explanation: "Ijobiy ko'p → a lot of." },
    { type: 'judge', sentence: 'I have a few books about history.', isCorrect: true, explanation: "To'g'ri! books sanaladigan → a few. Mukammal!" },
    { type: 'choose', sentence: 'Hurry! We have ___ time.', options: ['little', 'a little', 'few'], correct: 'little', uz: 'Shoshiling! Bizda vaqt kam.', explanation: "little (a yo'q) = kam, deyarli yo'q (salbiy ma'no)." },
    { type: 'build', uz: 'Bu yerda ko\'p restoran bor.', words: ['There', 'are', 'a', 'lot', 'of', 'restaurants'], correct: ['There', 'are', 'a', 'lot', 'of', 'restaurants'], explanation: "restaurants sanaladigan, ijobiy → a lot of." },
    { type: 'judge', sentence: 'How much apples do you want?', isCorrect: false, explanation: "Noto'g'ri! apples sanaladigan → 'How many apples?'" },
    { type: 'choose', sentence: 'Only ___ students passed. It was hard.', options: ['few', 'a few', 'a little'], correct: 'few', uz: 'Faqat kam talaba o\'tdi. Qiyin edi.', explanation: "few (a yo'q) = kam (salbiy ma'no)." },
    { type: 'choose', sentence: 'I drink ___ coffee every day.', options: ['a lot of', 'many', 'a few'], correct: 'a lot of', uz: 'Men har kuni ko\'p qahva ichaman.', explanation: "coffee sanalmaydigan, ijobiy → a lot of." },
    { type: 'build', uz: 'Stakanda ozgina sut bor.', words: ['There', 'is', 'a', 'little', 'milk'], correct: ['There', 'is', 'a', 'little', 'milk'], explanation: "milk sanalmaydigan → a little. Mukammal yakun!" },
  ],
  rule: {
    title: 'Quantifiers — to\'liq qoida',
    body: "Miqdor so'zlari — qancha ko'p yoki kam.\n\n📈 KO'P:\n   • a lot of / lots of — ikkalasi bilan (ijobiy):\n     a lot of money, a lot of friends\n   • much — sanalmaydigan (ko'proq inkor/savol): much time\n   • many — sanaladigan: many people\n\n🤏 OZ/KAM:\n   • a little — ozgina, sanalmaydigan (ijobiy): a little milk\n   • a few — bir nechta, sanaladigan (ijobiy): a few books\n\n📉 'a' farqi MUHIM:\n   • a little/a few = ozgina, yetarli (ijobiy)\n   • little/few = kam, deyarli yo'q (salbiy)\n   → I have a few friends (yaxshi) ≠ few friends (yolg'iz)",
  },
  summary: [
    "a lot of — ko'p (ikkalasi bilan, ijobiy)",
    "much (sanalmaydigan) / many (sanaladigan)",
    "a little / a few = ozgina (ijobiy)",
    "little / few = kam, deyarli yo'q (salbiy)",
  ],
}

// ─── 18. Too and Enough ─────────────────────────────────────────────────────
const TOO_ENOUGH: DemoLesson = {
  id: 'too-enough-demo',
  skill: 'Too va Enough — haddan ortiq va yetarli',
  level: 'A2',
  emoji: '⚖️',
  context: {
    text: "Tasavvur qiling — do'koningiz kiyim tanlayapsiz: \"Bu juda KICHIK, bu YETARLICHA katta emas\". too — haddan ortiq (yomon), enough — yetarli. Keling, ularning farqini o'rganamiz!",
    location: 'Real vaziyat · Xarid qilish',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "too — haddan ortiq (salbiy): too small (juda kichik)",
      "enough — yetarli: big enough (yetarlicha katta)",
      "too + sifat (too hot) · sifat + enough (warm enough)",
      "enough + ot (enough money) — ot oldidan keladi",
    ],
  },
  examples: [
    { en: 'This coffee is too hot.',     uz: 'Bu qahva juda issiq.',          key: 'too' },
    { en: 'He is tall enough.',          uz: 'U yetarlicha baland.',          key: 'enough' },
    { en: "I don't have enough money.",  uz: 'Menda yetarli pul yo\'q.',      key: 'enough money' },
    { en: 'It is too expensive.',        uz: 'Bu juda qimmat.',               key: 'too' },
  ],
  vocab: [
    { en: 'too',      uz: 'juda (haddan ortiq)', emoji: '🔥', example: 'too hot' },
    { en: 'enough',   uz: 'yetarli',             emoji: '✅', example: 'big enough' },
    { en: 'too much', uz: 'juda ko\'p (sanalmaydigan)', emoji: '💧', example: 'too much salt' },
    { en: 'too many', uz: 'juda ko\'p (sanaladigan)',   emoji: '🔢', example: 'too many people' },
    { en: 'expensive',uz: 'qimmat',              emoji: '💰', example: 'too expensive' },
    { en: 'tired',    uz: 'charchagan',          emoji: '😫', example: 'too tired' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'too', uz: 'haddan ortiq' }, { en: 'enough', uz: 'yetarli' }, { en: 'too much', uz: 'juda ko\'p (suyuq)' }, { en: 'too many', uz: 'juda ko\'p (dona)' }], explanation: "too va enough farqi." },
    { type: 'choose', sentence: 'This soup is ___ salty.', options: ['too', 'enough', 'very much'], correct: 'too', uz: 'Bu sho\'rva juda sho\'r.', explanation: "Haddan ortiq (yomon) → too + sifat." },
    { type: 'choose', sentence: 'He is old ___ to drive.', options: ['enough', 'too', 'much'], correct: 'enough', uz: 'U haydash uchun yetarlicha katta.', explanation: "sifat + enough (old enough)." },
    { type: 'judge', sentence: 'This box is enough big.', isCorrect: false, explanation: "Noto'g'ri! enough sifatdan KEYIN: 'big enough'." },
    { type: 'build', uz: 'Menda yetarli pul yo\'q.', words: ['I', "don't", 'have', 'enough', 'money'], correct: ['I', "don't", 'have', 'enough', 'money'], explanation: "enough + ot (enough money)." },
    { type: 'choose', sentence: 'You put ___ salt in the soup.', options: ['too much', 'too many', 'enough'], correct: 'too much', uz: 'Siz sho\'rvaga juda ko\'p tuz solibsiz.', explanation: "salt sanalmaydigan → too much." },
    { type: 'choose', sentence: 'There are ___ cars on the road.', options: ['too many', 'too much', 'enough'], correct: 'too many', uz: 'Yo\'lda juda ko\'p mashina bor.', explanation: "cars sanaladigan → too many." },
    { type: 'judge', sentence: "I'm too tired to work.", isCorrect: true, explanation: "To'g'ri! too + sifat + to (haddan tashqari charchagan). Mukammal!" },
    { type: 'choose', sentence: 'This shirt isn\'t big ___.', options: ['enough', 'too', 'much'], correct: 'enough', uz: 'Bu ko\'ylak yetarlicha katta emas.', explanation: "sifat + enough (big enough)." },
    { type: 'build', uz: 'Bu mashina juda qimmat.', words: ['This', 'car', 'is', 'too', 'expensive'], correct: ['This', 'car', 'is', 'too', 'expensive'], explanation: "too + sifat (too expensive)." },
    { type: 'judge', sentence: 'We have enough time to finish.', isCorrect: true, explanation: "To'g'ri! enough + ot (enough time). Mukammal!" },
    { type: 'choose', sentence: 'It\'s ___ cold to swim today.', options: ['too', 'enough', 'too many'], correct: 'too', uz: 'Bugun suzish uchun juda sovuq.', explanation: "Haddan ortiq → too + sifat (too cold)." },
    { type: 'choose', sentence: 'Do we have ___ chairs for everyone?', options: ['enough', 'too', 'too much'], correct: 'enough', uz: 'Hammaga yetarli stul bormi?', explanation: "enough + ot (enough chairs)." },
    { type: 'build', uz: 'U yetarlicha baland.', words: ['He', 'is', 'tall', 'enough'], correct: ['He', 'is', 'tall', 'enough'], explanation: "sifat + enough (tall enough). Mukammal yakun!" },
  ],
  rule: {
    title: 'Too and Enough — to\'liq qoida',
    body: "too — haddan ortiq (yomon), enough — yetarli.\n\n🔥 too — HADDAN ORTIQ (salbiy):\n   • too + sifat: too hot, too expensive, too small\n   • too + sifat + to: too tired to work\n\n✅ enough — YETARLI:\n   • sifat/ravish + enough (KEYIN): big enough, fast enough\n   • enough + ot (OLDIN): enough money, enough time\n\n💧 too much / too many — juda ko'p:\n   • too much + sanalmaydigan: too much salt\n   • too many + sanaladigan: too many people\n\n⚠️ Joylashuv:\n   • too sifatdan OLDIN: too big\n   • enough sifatdan KEYIN: big enough\n   • enough otdan OLDIN: enough food",
  },
  summary: [
    "too + sifat = haddan ortiq (too hot)",
    "sifat + enough = yetarli (big enough)",
    "enough + ot (enough money)",
    "too much (suyuq) / too many (dona)",
  ],
}

// ─── 19. So and Such ────────────────────────────────────────────────────────
const SO_SUCH: DemoLesson = {
  id: 'so-such-demo',
  skill: 'So va Such — kuchaytirish (juda)',
  level: 'A2',
  emoji: '💥',
  context: {
    text: "Tasavvur qiling — taassurotingizni aytyapsiz: \"Film JUDA yaxshi edi! Bu SHUNAQA ajoyib kun edi!\". so va such — gapni kuchaytiradi. Keling, ularni to'g'ri ishlatishni o'rganamiz!",
    location: 'Real vaziyat · Taassurot bildirish',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "so + sifat/ravish: so good, so quickly (juda)",
      "such + (a) + sifat + ot: such a nice day",
      "so = sifat oldidan (yolg'iz) · such = ot bilan",
      "Natija bilan: so ... that (shunchalik ... ki)",
    ],
  },
  examples: [
    { en: 'The film was so good.',       uz: 'Film juda yaxshi edi.',          key: 'so' },
    { en: 'It was such a nice day.',     uz: 'Bu shunaqa yaxshi kun edi.',     key: 'such a' },
    { en: 'She is so kind.',             uz: 'U juda mehribon.',               key: 'so' },
    { en: 'They are such good friends.', uz: 'Ular shunaqa yaxshi do\'stlar.', key: 'such' },
  ],
  vocab: [
    { en: 'so',       uz: 'juda (+ sifat)',     emoji: '⬆️', example: 'so beautiful' },
    { en: 'such a',   uz: 'shunaqa (+ sifat+ot)', emoji: '🎁', example: 'such a good idea' },
    { en: 'so ... that', uz: 'shunchalik ... ki', emoji: '➡️', example: 'so tired that...' },
    { en: 'kind',     uz: 'mehribon',           emoji: '💛', example: 'so kind' },
    { en: 'amazing',  uz: 'ajoyib',             emoji: '🤩', example: 'such an amazing film' },
    { en: 'boring',   uz: 'zerikarli',          emoji: '😴', example: 'so boring' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'so', uz: '+ sifat (juda)' }, { en: 'such a', uz: '+ sifat + ot' }, { en: 'so...that', uz: 'shunchalik...ki' }, { en: 'amazing', uz: 'ajoyib' }], explanation: "so va such ning ishlatilishi." },
    { type: 'choose', sentence: 'The weather is ___ nice today.', options: ['so', 'such', 'such a'], correct: 'so', uz: 'Bugun ob-havo juda yaxshi.', explanation: "so + sifat (yolg'iz, ot yo'q) → so nice." },
    { type: 'choose', sentence: 'It was ___ beautiful day.', options: ['such a', 'so', 'such'], correct: 'such a', uz: 'Bu shunaqa go\'zal kun edi.', explanation: "such + a + sifat + ot (such a beautiful day)." },
    { type: 'judge', sentence: 'She is such kind.', isCorrect: false, explanation: "Noto'g'ri! ot yo'q → so: 'She is so kind'." },
    { type: 'build', uz: 'Bu shunaqa yaxshi g\'oya.', words: ['It', 'is', 'such', 'a', 'good', 'idea'], correct: ['It', 'is', 'such', 'a', 'good', 'idea'], explanation: "such + a + sifat + ot (such a good idea)." },
    { type: 'choose', sentence: 'He runs ___ fast.', options: ['so', 'such', 'such a'], correct: 'so', uz: 'U juda tez yuguradi.', explanation: "so + ravish (so fast)." },
    { type: 'choose', sentence: 'They are ___ good friends.', options: ['such', 'so', 'such a'], correct: 'such', uz: 'Ular shunaqa yaxshi do\'stlar.', explanation: "such + sifat + KO'PLIK ot (a yo'q): such good friends." },
    { type: 'judge', sentence: 'The book was so interesting.', isCorrect: true, explanation: "To'g'ri! so + sifat (so interesting). Mukammal!" },
    { type: 'choose', sentence: 'It was ___ amazing film.', options: ['such an', 'such a', 'so'], correct: 'such an', uz: 'Bu shunaqa ajoyib film edi.', explanation: "amazing unli → such + AN + sifat + ot." },
    { type: 'build', uz: 'U juda charchagan edi.', words: ['She', 'was', 'so', 'tired'], correct: ['She', 'was', 'so', 'tired'], explanation: "so + sifat (so tired)." },
    { type: 'judge', sentence: 'It was so a nice party.', isCorrect: false, explanation: "Noto'g'ri! ot bor → such: 'such a nice party'." },
    { type: 'choose', sentence: 'I was ___ tired that I slept early.', options: ['so', 'such', 'such a'], correct: 'so', uz: 'Men shunchalik charchagan edimki, erta uxladim.', explanation: "so + sifat + that (natija): so tired that..." },
    { type: 'choose', sentence: 'This is ___ delicious food.', options: ['such', 'so', 'such a'], correct: 'such', uz: 'Bu shunaqa mazali ovqat.', explanation: "food sanalmaydigan (a yo'q) → such delicious food." },
    { type: 'build', uz: 'Bu shunaqa yaxshi kun edi.', words: ['It', 'was', 'such', 'a', 'good', 'day'], correct: ['It', 'was', 'such', 'a', 'good', 'day'], explanation: "such + a + sifat + ot. Mukammal yakun!" },
  ],
  rule: {
    title: 'So and Such — to\'liq qoida',
    body: "so va such — gapni kuchaytiradi (juda, shunaqa).\n\n⬆️ so + sifat/ravish (OT YO'Q):\n   • so good · so beautiful · so quickly\n   • She is so kind. · He runs so fast.\n\n🎁 such + (a/an) + sifat + OT:\n   • such a nice day (birlik ot → a/an)\n   • such an amazing film (unli → an)\n   • such good friends (ko'plik → a yo'q)\n   • such delicious food (sanalmaydigan → a yo'q)\n\n➡️ Natija bilan (so/such ... that):\n   • I was so tired that I slept.\n   • It was such a good book that I read it twice.\n\n⚠️ ot bormi? → such. ot yo'qmi? → so.",
  },
  summary: [
    "so + sifat (ot yo'q): so good, so kind",
    "such a + sifat + ot: such a nice day",
    "such an (unli) · such (ko'plik/suyuq, a yo'q)",
    "so/such ... that — natija (shunchalik...ki)",
  ],
}

// ═══════════════════════════════════════════════════════════════════════════
// ─── Comparatives & Superlatives ────────────────────────────────────────────
const COMPARATIVES_SUPERLATIVES: DemoLesson = {
  id: 'comparatives-superlatives-demo',
  skill: 'Qiyosiy va orttirma daraja — comparatives & superlatives',
  level: 'A2',
  emoji: '📊',
  context: {
    text: "Tasavvur qiling — do'stingiz bilan telefon tanlayapsiz: \"Bu telefon ARZONROQ, lekin u TEZROQ. Bularning ichida ENG YAXSHISI qaysi?\". Narsalarni solishtirish kundalik hayotda kerak. Keling, qiyosiy va orttirma darajani o'rganamiz!",
    location: 'Real vaziyat · Tanlov qilish',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Qisqa sifat + er = qiyosiy: cheap → cheaper (than)",
      "Uzun sifat: more + sifat: expensive → more expensive",
      "Orttirma: the + sifat + est / the most: the cheapest, the most expensive",
      "Noto'g'ri shakllar: good→better→best, bad→worse→worst",
    ],
  },
  examples: [
    { en: 'This phone is cheaper than that one.',  uz: 'Bu telefon u telefondan arzonroq.',      key: 'cheaper than' },
    { en: 'She is more careful than her brother.', uz: 'U akasidan ko\'ra ehtiyotkorroq.',        key: 'more careful' },
    { en: 'This is the best restaurant in town.',  uz: 'Bu shahardagi eng yaxshi restoran.',      key: 'the best' },
    { en: 'Today is the hottest day of the year.', uz: 'Bugun yilning eng issiq kuni.',           key: 'the hottest' },
  ],
  vocab: [
    { en: 'cheaper',      uz: 'arzonroq',          emoji: '💸', example: 'cheaper than this' },
    { en: 'more expensive', uz: 'qimmatroq',       emoji: '💰', example: 'more expensive than' },
    { en: 'the biggest',  uz: 'eng katta',         emoji: '🐘', example: 'the biggest one' },
    { en: 'the most beautiful', uz: 'eng go\'zal', emoji: '🌸', example: 'the most beautiful' },
    { en: 'better → best',uz: 'yaxshiroq → eng yaxshi', emoji: '👍', example: 'the best choice' },
    { en: 'worse → worst',uz: 'yomonroq → eng yomon', emoji: '👎', example: 'the worst day' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'cheaper', uz: 'arzonroq' }, { en: 'more expensive', uz: 'qimmatroq' }, { en: 'the biggest', uz: 'eng katta' }, { en: 'better', uz: 'yaxshiroq' }], explanation: "Qisqa sifat +er, uzun sifat more+sifat." },
    { type: 'choose', sentence: 'A car is ___ than a bicycle.', options: ['faster', 'more fast', 'fastest'], correct: 'faster', uz: 'Mashina velosipeddan tezroq.', explanation: "Qisqa sifat: fast → faster (more ishlatilmaydi)." },
    { type: 'choose', sentence: 'This book is ___ than that one.', options: ['more interesting', 'interestinger', 'most interesting'], correct: 'more interesting', uz: 'Bu kitob u kitobdan qiziqroq.', explanation: "Uzun sifat (interesting): more + sifat." },
    { type: 'judge', sentence: 'She is more taller than me.', isCorrect: false, explanation: "Noto'g'ri! tall qisqa → taller (more YO'Q): 'She is taller than me.'" },
    { type: 'build', uz: 'Bu telefon u telefondan arzonroq.', words: ['This', 'phone', 'is', 'cheaper', 'than', 'that', 'one'], correct: ['This', 'phone', 'is', 'cheaper', 'than', 'that', 'one'], explanation: "cheap → cheaper + than." },
    { type: 'choose', sentence: 'Mount Everest is ___ mountain in the world.', options: ['the highest', 'the most high', 'highest'], correct: 'the highest', uz: 'Everest dunyodagi eng baland tog\'.', explanation: "Orttirma (qisqa): the + sifat + est." },
    { type: 'choose', sentence: 'This is ___ film I have ever seen.', options: ['the most boring', 'the boringest', 'most boring'], correct: 'the most boring', uz: 'Bu men ko\'rgan eng zerikarli film.', explanation: "Orttirma (uzun): the most + sifat." },
    { type: 'judge', sentence: 'He is the better student in the class.', isCorrect: false, explanation: "Noto'g'ri! Orttirma → the best: 'He is the best student in the class.'" },
    { type: 'choose', sentence: 'My new phone is ___ than my old one.', options: ['better', 'gooder', 'best'], correct: 'better', uz: 'Yangi telefonim eskisidan yaxshiroq.', explanation: "good — noto'g'ri shakl: good → better → best." },
    { type: 'build', uz: 'Bugun yilning eng issiq kuni.', words: ['Today', 'is', 'the', 'hottest', 'day', 'of', 'the', 'year'], correct: ['Today', 'is', 'the', 'hottest', 'day', 'of', 'the', 'year'], explanation: "hot → hottest (undosh ikkilanadi: hot→hotter→hottest)." },
    { type: 'judge', sentence: 'This exam was worse than the last one.', isCorrect: true, explanation: "To'g'ri! bad → worse (noto'g'ri shakl). Mukammal!" },
    { type: 'choose', sentence: 'Russia is ___ country in the world.', options: ['the biggest', 'the bigest', 'the most big'], correct: 'the biggest', uz: 'Rossiya dunyodagi eng katta davlat.', explanation: "big → biggest (undosh ikkilanadi)." },
    { type: 'choose', sentence: 'She works ___ than her colleagues.', options: ['harder', 'more hard', 'hardest'], correct: 'harder', uz: 'U hamkasblaridan ko\'ra qattiqroq ishlaydi.', explanation: "hard → harder (qisqa)." },
    { type: 'build', uz: 'Bu shahardagi eng yaxshi restoran.', words: ['This', 'is', 'the', 'best', 'restaurant', 'in', 'town'], correct: ['This', 'is', 'the', 'best', 'restaurant', 'in', 'town'], explanation: "good → the best (orttirma). Mukammal yakun!" },
  ],
  rule: {
    title: 'Comparatives & Superlatives — to\'liq qoida',
    body: "Narsalarni solishtirish — qiyosiy (2 ta) va orttirma (eng).\n\n📊 QIYOSIY (comparative) — ikkitasini solishtirish:\n   • Qisqa sifat (1 bo'g'in) + er: cheap → cheaper, fast → faster\n   • -e: nice → nicer · undosh+y: easy → easier\n   • qisqa unli+undosh: big → bigger, hot → hotter (ikkilanadi)\n   • Uzun sifat (2+ bo'g'in): more + sifat: more expensive\n   • + than: cheaper THAN, more careful THAN\n\n🏆 ORTTIRMA (superlative) — eng (3+ orasidan):\n   • Qisqa: the + sifat + est: the cheapest, the biggest\n   • Uzun: the most + sifat: the most expensive\n\n⚠️ NOTO'G'RI shakllar (yodlang):\n   • good → better → the best\n   • bad → worse → the worst\n   • far → further → the furthest",
  },
  summary: [
    "Qisqa: +er / the +est (cheaper, the cheapest)",
    "Uzun: more / the most (more expensive)",
    "Qiyosiyda 'than': cheaper than",
    "good→better→best · bad→worse→worst",
  ],
}

export const A2_DEMOS: Record<string, DemoLesson> = {
  'comparatives-superlatives': COMPARATIVES_SUPERLATIVES,
  'modal-verbs':            MODAL_VERBS,
  'articles':               ARTICLES,
  'prepositions':           PREPOSITIONS,
  'questions':              QUESTIONS,
  'countable-uncountable':  COUNTABLE_UNCOUNTABLE,
  'adjective-adverb':       ADJECTIVE_ADVERB,
  'gerunds-infinitives':    GERUNDS_INFINITIVES,
  'passive-voice':          PASSIVE_VOICE,
  'reported-speech':        REPORTED_SPEECH,
  'first-conditional':      FIRST_CONDITIONAL,
  'there-is-there-are':     THERE_IS_ARE,
  'possessives':            POSSESSIVES,
  'some-any-no-every':      SOME_ANY_NO_EVERY,
  'verb-patterns':          VERB_PATTERNS,
  'time-prepositions':      TIME_PREPOSITIONS,
  'present-continuous-future': PRESENT_CONTINUOUS_FUTURE,
  'quantifiers':            QUANTIFIERS,
  'too-enough':             TOO_ENOUGH,
  'so-such':                SO_SUCH,
}
