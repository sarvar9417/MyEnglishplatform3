// ═══════════════════════════════════════════════════════════════════════════
// B1+ darajadagi barcha grammatika/lug'at darslari uchun namunaviy demolar.
// Falsafa: bitta mahorat, induktiv, kontekstli, "Siz"-fokusli, BOY kontent.
// Kalit = asl dars id (DEMO_LESSONS bilan mos). SRS avtomatik ishlaydi.
// ═══════════════════════════════════════════════════════════════════════════

import type { DemoLesson } from '../lessonDemoContent'

// ─── 1. Third Conditional ───────────────────────────────────────────────────
const THIRD_CONDITIONAL: DemoLesson = {
  id: 'third-conditional-b1plus-demo',
  skill: 'Uchinchi shart — o\'tmishdagi xayoliy vaziyat',
  level: 'B1+',
  emoji: '⏳',
  context: {
    text: "Tasavvur qiling — o'tmishdagi qarordan afsuslanyapsiz: \"Agar ertaroq chiqqanimda, poyezdga ulgurardim\". Lekin chiqmadingiz va ulgurmadingiz — bu xayoliy o'tmish. Keling, third conditional'ni o'rganamiz!",
    location: 'Real vaziyat · O\'tmish tahlili',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Third conditional — o'tmishdagi BO'LMAGAN vaziyat (afsus/tanqid)",
      "Tuzilishi: If + Past Perfect, would have + V3",
      "If I had known, I would have helped (bilmadim, yordam bermadim)",
      "could have / might have ham bo'ladi (imkoniyat)",
    ],
  },
  examples: [
    { en: 'If I had studied, I would have passed.', uz: 'O\'qiganimda, o\'tgan bo\'lardim.',  key: 'would have passed' },
    { en: 'If she had left earlier, she would have caught it.', uz: 'Ertaroq chiqqanida, ulgurardi.', key: 'would have caught' },
    { en: "If you had asked, I could have helped.", uz: 'So\'raganingizda, yordam bera olardim.', key: 'could have' },
    { en: "I wouldn't have come if I'd known.", uz: 'Bilganimda, kelmagan bo\'lardim.',         key: "wouldn't have" },
  ],
  vocab: [
    { en: 'If + had + V3', uz: 'agar qilganida', emoji: '⏮️', example: 'if I had known' },
    { en: 'would have + V3', uz: 'qilgan bo\'lardi', emoji: '🔮', example: 'would have gone' },
    { en: 'could have + V3', uz: 'qila olardi', emoji: '💪', example: 'could have helped' },
    { en: 'might have + V3', uz: 'qilishi mumkin edi', emoji: '🤔', example: 'might have won' },
    { en: "wouldn't have", uz: 'qilmagan bo\'lardi', emoji: '🚫', example: "wouldn't have failed" },
    { en: 'regret',   uz: 'afsuslanmoq',      emoji: '😔', example: 'I regret it' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'had known', uz: 'bilganida' }, { en: 'would have', uz: 'qilgan bo\'lardi' }, { en: 'could have', uz: 'qila olardi' }, { en: "wouldn't have", uz: 'qilmagan bo\'lardi' }], explanation: "Third conditional bo'laklari." },
    { type: 'choose', sentence: 'If I had studied, I ___ have passed.', options: ['would', 'will', 'had'], correct: 'would', uz: 'O\'qiganimda, o\'tgan bo\'lardim.', explanation: "Natija → would have + V3 (passed)." },
    { type: 'choose', sentence: 'If she ___ left earlier, she would have caught the train.', options: ['had', 'has', 'would have'], correct: 'had', uz: 'Ertaroq chiqqanida, poyezdga ulgurardi.', explanation: "Shart → If + Past Perfect (had left)." },
    { type: 'judge', sentence: 'If I would have known, I would have come.', isCorrect: false, explanation: "Noto'g'ri! Shart qismida would yo'q: 'If I had known, I would have come'." },
    { type: 'build', uz: 'So\'raganingizda, yordam bera olardim.', words: ['If', 'you', 'had', 'asked', 'I', 'could', 'have', 'helped'], correct: ['If', 'you', 'had', 'asked', 'I', 'could', 'have', 'helped'], explanation: "If + had asked, could have + V3 (helped)." },
    { type: 'choose', sentence: 'If they had trained harder, they ___ have won.', options: ['might', 'will', 'had'], correct: 'might', uz: 'Qattiqroq mashq qilganlarida, yutishlari mumkin edi.', explanation: "Imkoniyat → might have + V3." },
    { type: 'choose', sentence: "I wouldn't have been late if I ___ taken a taxi.", options: ['had', 'have', 'would have'], correct: 'had', uz: 'Taksi olganimda, kechikmagan bo\'lardim.', explanation: "Shart → had taken (Past Perfect)." },
    { type: 'judge', sentence: 'If we had booked earlier, we would have got better seats.', isCorrect: true, explanation: "To'g'ri! If + Past Perfect, would have + V3. Mukammal!" },
    { type: 'choose', sentence: 'If he ___ harder, he would have got the job.', options: ['had tried', 'tried', 'would try'], correct: 'had tried', uz: 'Ko\'proq harakat qilganida, ishni olardi.', explanation: "Shart → had tried (Past Perfect)." },
    { type: 'build', uz: 'Bilganimda, kelmagan bo\'lardim.', words: ['If', 'I', 'had', 'known', 'I', "wouldn't", 'have', 'come'], correct: ['If', 'I', 'had', 'known', 'I', "wouldn't", 'have', 'come'], explanation: "If + had known, wouldn't have + V3 (come)." },
    { type: 'judge', sentence: 'If she had study, she would passed.', isCorrect: false, explanation: "Noto'g'ri! 'had studied' va 'would have passed' (V3 + have kerak)." },
    { type: 'choose', sentence: 'We would have enjoyed it if it ___ rained.', options: ["hadn't", "didn't", "wouldn't have"], correct: "hadn't", uz: 'Yomg\'ir yog\'masaganida, rohatlanardik.', explanation: "Shart inkori → hadn't rained (Past Perfect)." },
    { type: 'choose', sentence: 'If I had seen you, I ___ have said hello.', options: ['would', 'will', 'had'], correct: 'would', uz: 'Sizni ko\'rganimda, salomlashardim.', explanation: "Natija → would have + V3." },
    { type: 'build', uz: 'O\'qiganimda, o\'tgan bo\'lardim.', words: ['If', 'I', 'had', 'studied', 'I', 'would', 'have', 'passed'], correct: ['If', 'I', 'had', 'studied', 'I', 'would', 'have', 'passed'], explanation: "If + Past Perfect, would have + V3. Mukammal yakun!" },
  ],
  rule: {
    title: 'Third Conditional — to\'liq qoida',
    body: "Third conditional — o'tmishdagi BO'LMAGAN, xayoliy vaziyat (afsus/tanqid).\n\n✅ Tuzilishi:\n   If + Past Perfect, would have + V3\n   • If I had studied, I would have passed.\n   (o'qimadim → o'tmadim)\n\n🔑 Variantlar (natija qismida):\n   • would have — natija: would have passed\n   • could have — imkoniyat: could have helped\n   • might have — ehtimol: might have won\n   • wouldn't have — inkor: wouldn't have failed\n\n⚠️ Shart (if) qismida WOULD ishlatilmaydi!\n   • If I would have known ✗ → If I had known ✓\n\n💡 Ma'no: o'tmish o'zgarmaydi — faqat tasavvur/afsus.",
  },
  summary: [
    "If + Past Perfect, would have + V3",
    "O'tmishdagi bo'lmagan vaziyat (afsus)",
    "could/might have — imkoniyat/ehtimol",
    "Shart qismida would yo'q!",
  ],
}

// ─── 2. Mixed Conditionals ──────────────────────────────────────────────────
const MIXED_CONDITIONALS: DemoLesson = {
  id: 'mixed-conditionals-b1plus-demo',
  skill: 'Aralash shartlar — o\'tmish sharti, hozirgi natija',
  level: 'B1+',
  emoji: '🔀',
  context: {
    text: "Tasavvur qiling — o'tmish va hozir bog'liq: \"Agar o'sha pulni tejaganimda (o'tmish), hozir boy bo'lardim (hozir)\". Shart o'tmishda, natija hozir. Keling, aralash shartlarni o'rganamiz!",
    location: 'Real vaziyat · O\'tmish va hozir',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Mixed conditional — shart va natija turli vaqtda",
      "1-tur: o'tmish sharti → hozirgi natija (had + would)",
      "If I had saved, I would be rich now",
      "2-tur: hozirgi holat → o'tmish natijasi (kamroq)",
    ],
  },
  examples: [
    { en: "If I had saved money, I would be rich now.", uz: 'Pul tejaganimda, hozir boy bo\'lardim.', key: 'had saved / would be' },
    { en: "If she had studied medicine, she would be a doctor.", uz: 'Tibbiyot o\'qiganida, hozir shifokor bo\'lardi.', key: 'would be' },
    { en: "If I weren't so tired, I would have gone out.", uz: 'Bunchalik charchamaganimda, sayrga chiqardim.', key: "weren't / would have" },
    { en: "If he were taller, he would have been a model.", uz: 'Balandroq bo\'lganida, model bo\'lardi.', key: 'were / would have been' },
  ],
  vocab: [
    { en: 'had + V3 → would', uz: 'o\'tmish→hozir', emoji: '⏮️', example: 'had saved → would be' },
    { en: 'would be now', uz: 'hozir bo\'lardi', emoji: '🕐', example: 'would be rich now' },
    { en: 'were → would have', uz: 'hozir→o\'tmish', emoji: '🔄', example: 'were → would have' },
    { en: 'now',      uz: 'hozir',             emoji: '⏰', example: 'rich now' },
    { en: 'still',    uz: 'hali ham',          emoji: '➿', example: 'still here' },
    { en: 'because of', uz: '...tufayli',      emoji: '🔗', example: 'because of that' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'had saved', uz: 'tejaganida (o\'tmish)' }, { en: 'would be', uz: 'bo\'lardi (hozir)' }, { en: 'now', uz: 'hozir' }, { en: 'were', uz: 'bo\'lsa (hozir)' }], explanation: "Aralash shart bo'laklari." },
    { type: 'choose', sentence: 'If I had saved money, I ___ rich now.', options: ['would be', 'would have been', 'will be'], correct: 'would be', uz: 'Pul tejaganimda, hozir boy bo\'lardim.', explanation: "O'tmish sharti → HOZIRGI natija: would be (now)." },
    { type: 'choose', sentence: 'If she ___ harder at school, she would have a good job now.', options: ['had worked', 'worked', 'works'], correct: 'had worked', uz: 'Maktabda ko\'proq ishlaganida, hozir yaxshi ishi bo\'lardi.', explanation: "O'tmish sharti → If + Past Perfect (had worked)." },
    { type: 'judge', sentence: 'If I had taken that job, I would be happier now.', isCorrect: true, explanation: "To'g'ri! O'tmish sharti (had taken) → hozirgi natija (would be now). Mukammal!" },
    { type: 'build', uz: 'Tibbiyot o\'qiganida, hozir shifokor bo\'lardi.', words: ['If', 'she', 'had', 'studied', 'medicine', 'she', 'would', 'be', 'a', 'doctor'], correct: ['If', 'she', 'had', 'studied', 'medicine', 'she', 'would', 'be', 'a', 'doctor'], explanation: "had studied (o'tmish) → would be (hozir)." },
    { type: 'choose', sentence: "If I ___ so busy, I would have called you.", options: ["weren't", "hadn't been", "am not"], correct: "weren't", uz: 'Bunchalik band bo\'lmaganimda, sizga qo\'ng\'iroq qilardim.', explanation: "Hozirgi holat (weren't) → o'tmish natijasi (would have called)." },
    { type: 'choose', sentence: "He would be famous now if he ___ that role.", options: ['had taken', 'took', 'takes'], correct: 'had taken', uz: 'O\'sha rolni olganida, hozir mashhur bo\'lardi.', explanation: "O'tmish sharti → had taken." },
    { type: 'judge', sentence: 'If I would have saved money, I would be rich now.', isCorrect: false, explanation: "Noto'g'ri! Shart → had saved (would yo'q): 'If I had saved money...'" },
    { type: 'choose', sentence: 'If they hadn\'t missed the flight, they ___ here now.', options: ['would be', 'would have been', 'will be'], correct: 'would be', uz: 'Reysni o\'tkazib yubormaganlarida, hozir shu yerda bo\'lardilar.', explanation: "O'tmish sharti → hozirgi natija (would be now)." },
    { type: 'build', uz: 'Pul tejaganimda, hozir boy bo\'lardim.', words: ['If', 'I', 'had', 'saved', 'I', 'would', 'be', 'rich', 'now'], correct: ['If', 'I', 'had', 'saved', 'I', 'would', 'be', 'rich', 'now'], explanation: "had saved → would be rich now (aralash)." },
    { type: 'judge', sentence: 'If I were more organised, I wouldn\'t have missed the deadline.', isCorrect: true, explanation: "To'g'ri! Hozirgi holat (were) → o'tmish natijasi (wouldn't have missed). Mukammal!" },
    { type: 'choose', sentence: 'I would speak French now if I ___ in Paris as a child.', options: ['had lived', 'lived', 'live'], correct: 'had lived', uz: 'Bolaligimda Parijda yashaganimda, hozir fransuzcha gapirardim.', explanation: "O'tmish sharti → had lived." },
    { type: 'choose', sentence: 'If she weren\'t afraid of flying, she ___ to Japan last year.', options: ['would have gone', 'would go', 'will go'], correct: 'would have gone', uz: 'Uchishdan qo\'rqmaganida, o\'tgan yili Yaponiyaga borardi.', explanation: "Hozirgi holat (weren't) → o'tmish natijasi (would have gone)." },
    { type: 'build', uz: 'O\'sha ishni qabul qilganimda, hozir baxtliroq bo\'lardim.', words: ['If', 'I', 'had', 'accepted', 'the', 'job', 'I', 'would', 'be', 'happier', 'now'], correct: ['If', 'I', 'had', 'accepted', 'the', 'job', 'I', 'would', 'be', 'happier', 'now'], explanation: "had accepted → would be happier now. Mukammal yakun!" },
  ],
  rule: {
    title: 'Mixed Conditionals — to\'liq qoida',
    body: "Aralash shart — shart va natija TURLI vaqtda.\n\n🔀 1-tur (eng keng tarqalgan):\n   O'TMISH sharti → HOZIRGI natija\n   If + Past Perfect, would + V1 (now)\n   • If I had saved money, I would be rich now.\n   (o'tmishda tejamadim → hozir boy emasman)\n\n🔄 2-tur:\n   HOZIRGI holat → O'TMISH natijasi\n   If + Past Simple, would have + V3\n   • If I weren't so shy, I would have spoken.\n   (doimiy uyatchanlik → o'tmishda gapirmadim)\n\n💡 Belgilar: now, today (hozirgi natija uchun)\n\n⚠️ Toza third (If had..., would have...) o'tmish→o'tmish;\n   mixed esa vaqtlarni ARALASHTIRADI.",
  },
  summary: [
    "Shart va natija turli vaqtda (aralash)",
    "O'tmish sharti → hozirgi natija: had + would be now",
    "Hozirgi holat → o'tmish natijasi: were + would have",
    "now/today belgisi bilan",
  ],
}

// ─── 3. Wish & If Only (Advanced) ───────────────────────────────────────────
const WISH_IF_ONLY: DemoLesson = {
  id: 'wish-if-only-b1plus-demo',
  skill: 'Wish & If Only — istak va afsusning barcha turlari',
  level: 'B1+',
  emoji: '🌟',
  context: {
    text: "Tasavvur qiling — turli istaklarni bildiryapsiz: \"Koshki vaqtim ko'p bo'lsa (hozir)... Koshki o'qiganimda edi (o'tmish)... Koshki yomg'ir to'xtasa (bezovta)\". Har biri uchun boshqa tuzilma. Keling, wish/if only'ning barcha turlarini o'rganamiz!",
    location: 'Real vaziyat · Istak va afsus',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "wish + Past Simple — hozirgi holatdan afsus",
      "wish + Past Perfect — o'tmishdagi afsus",
      "wish + would — boshqaning bezovta qiluvchi odati",
      "wish + could — qobiliyat istagi · if only — kuchliroq",
    ],
  },
  examples: [
    { en: 'I wish I had more free time.',       uz: 'Koshki ko\'proq bo\'sh vaqtim bo\'lsa.', key: 'wish I had' },
    { en: 'I wish I had taken that chance.',     uz: 'Koshki o\'sha imkoniyatni qo\'lga olganimda.', key: 'had taken' },
    { en: 'I wish you would listen to me.',      uz: 'Koshki meni eshitsangiz.',              key: 'wish you would' },
    { en: 'If only I could fly!',                uz: 'Koshki ucha olsam!',                    key: 'If only could' },
  ],
  vocab: [
    { en: 'wish + Past', uz: 'koshki ... bo\'lsa (hozir)', emoji: '🌟', example: 'I wish I knew' },
    { en: 'wish + Past Perfect', uz: 'koshki ... qilganimda', emoji: '⏮️', example: 'wish I had gone' },
    { en: 'wish + would', uz: 'koshki ... qilsa', emoji: '🙄', example: 'wish he would stop' },
    { en: 'wish + could', uz: 'koshki ... qila olsam', emoji: '💫', example: 'wish I could swim' },
    { en: 'if only',  uz: 'koshki (kuchli)',  emoji: '✨', example: 'If only I knew!' },
    { en: 'were',     uz: 'bo\'lsa edi',      emoji: '🔮', example: 'wish I were taller' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'wish + Past', uz: 'hozirgi afsus' }, { en: 'wish + Past Perfect', uz: 'o\'tmish afsusi' }, { en: 'wish + would', uz: 'bezovta odat' }, { en: 'wish + could', uz: 'qobiliyat istagi' }], explanation: "Wish turlari." },
    { type: 'choose', sentence: 'I wish I ___ more time to relax.', options: ['had', 'have', 'will have'], correct: 'had', uz: 'Koshki dam olishga ko\'proq vaqtim bo\'lsa.', explanation: "Hozirgi afsus → wish + Past Simple (had)." },
    { type: 'choose', sentence: 'I wish I ___ that opportunity last year.', options: ['had taken', 'took', 'take'], correct: 'had taken', uz: 'Koshki o\'tgan yili o\'sha imkoniyatni qo\'lga olganimda.', explanation: "O'tmish afsusi → wish + Past Perfect (had taken)." },
    { type: 'judge', sentence: 'I wish you will stop complaining.', isCorrect: false, explanation: "Noto'g'ri! Boshqaning odati → wish + would: 'I wish you would stop complaining'." },
    { type: 'build', uz: 'Koshki ucha olsam!', words: ['If', 'only', 'I', 'could', 'fly'], correct: ['If', 'only', 'I', 'could', 'fly'], explanation: "Qobiliyat istagi → if only + could." },
    { type: 'choose', sentence: 'I wish it ___ raining so we could go out.', options: ['would stop', 'stops', 'stopped'], correct: 'would stop', uz: 'Koshki yomg\'ir to\'xtasa, sayrga chiqardik.', explanation: "Bezovta holat o'zgarishi → wish + would stop." },
    { type: 'choose', sentence: 'She wishes she ___ to university.', options: ['had gone', 'went', 'goes'], correct: 'had gone', uz: 'U universitetga borganida edi deb afsuslanadi.', explanation: "O'tmish afsusi → wish + Past Perfect (had gone)." },
    { type: 'judge', sentence: 'I wish I were better at maths.', isCorrect: true, explanation: "To'g'ri! Hozirgi afsus → wish + were (was o'rniga). Mukammal!" },
    { type: 'choose', sentence: 'If only I ___ speak Chinese fluently!', options: ['could', 'can', 'would'], correct: 'could', uz: 'Koshki xitoycha ravon gapira olsam!', explanation: "Qobiliyat istagi → if only + could." },
    { type: 'build', uz: 'Koshki meni eshitsangiz.', words: ['I', 'wish', 'you', 'would', 'listen', 'to', 'me'], correct: ['I', 'wish', 'you', 'would', 'listen', 'to', 'me'], explanation: "Boshqaning odati → wish + would." },
    { type: 'judge', sentence: "I wish I hadn't said that yesterday.", isCorrect: true, explanation: "To'g'ri! O'tmish afsusi → wish + Past Perfect (hadn't said). Mukammal!" },
    { type: 'choose', sentence: 'I wish my neighbours ___ so much noise.', options: ["wouldn't make", "don't make", "didn't made"], correct: "wouldn't make", uz: 'Koshki qo\'shnilarim bunchalik shovqin qilmasalar.', explanation: "Boshqaning bezovta odati → wish + wouldn't make." },
    { type: 'choose', sentence: 'If only we ___ known about the traffic!', options: ['had', 'have', 'did'], correct: 'had', uz: 'Koshki tirbandlik haqida bilganimizda edi!', explanation: "O'tmish afsusi → if only + Past Perfect (had known)." },
    { type: 'build', uz: 'Koshki ko\'proq bo\'sh vaqtim bo\'lsa.', words: ['I', 'wish', 'I', 'had', 'more', 'free', 'time'], correct: ['I', 'wish', 'I', 'had', 'more', 'free', 'time'], explanation: "Hozirgi afsus → wish + had. Mukammal yakun!" },
  ],
  rule: {
    title: 'Wish & If Only — to\'liq qoida',
    body: "Istak va afsusning barcha turlari.\n\n🌟 wish + Past Simple — HOZIRGI holatdan afsus:\n   • I wish I had more money. (hozir yo'q)\n   • wish + were (rasmiy): I wish I were taller.\n\n⏮️ wish + Past Perfect — O'TMISH afsusi:\n   • I wish I had studied harder.\n   • I wish I hadn't said that.\n\n🙄 wish + would — boshqaning bezovta ODATI:\n   • I wish you would stop shouting.\n   (faqat boshqa odam/narsa — o'zing emas!)\n\n💫 wish + could — QOBILIYAT istagi:\n   • I wish I could swim.\n\n✨ if only — KUCHLIROQ afsus (= I wish):\n   • If only I had known! · If only I could!",
  },
  summary: [
    "wish + Past Simple — hozirgi afsus",
    "wish + Past Perfect — o'tmish afsusi",
    "wish + would — boshqaning bezovta odati",
    "wish + could / if only — qobiliyat, kuchli afsus",
  ],
}

// ─── 4. Advanced Modals ─────────────────────────────────────────────────────
const ADVANCED_MODALS: DemoLesson = {
  id: 'advanced-modals-b1plus-demo',
  skill: 'Murakkab modallar — nozik ma\'nolar',
  level: 'B1+',
  emoji: '🎭',
  context: {
    text: "Tasavvur qiling — nozik ma'no farqlarini ifodalayapsiz: \"Bormasligim ham mumkin (ehtimol)... Borishim kerak edi, lekin bormadim (tanqid)... Borgan bo'lsang bo'lardi (taklif)\". Modallar nozik tuyg'ularni beradi. Keling, murakkab modallarni o'rganamiz!",
    location: 'Real vaziyat · Nozik ma\'no',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "may/might as well — boshqa ilojsizlikdan (mayli, qilaqolaylik)",
      "should/ought to — kutilgan, lekin amalga oshmagan",
      "would rather — afzal ko'rmoq (would rather stay)",
      "had better — kuchli maslahat/ogohlantirish",
    ],
  },
  examples: [
    { en: "We may as well start now.",          uz: 'Hozir boshlaqolsak ham bo\'ladi.',       key: 'may as well' },
    { en: "I'd rather stay home tonight.",       uz: 'Bugun kechqurun uyda qolganni afzal ko\'raman.', key: "'d rather" },
    { en: "You'd better hurry up.",              uz: 'Yaxshisi shoshiling.',                   key: "'d better" },
    { en: "She ought to be here by now.",        uz: 'U allaqachon shu yerda bo\'lishi kerak edi.', key: 'ought to' },
  ],
  vocab: [
    { en: 'may/might as well', uz: 'qilaqolsak ham bo\'ladi', emoji: '🤷', example: 'may as well go' },
    { en: 'would rather', uz: 'afzal ko\'rmoq', emoji: '⚖️', example: "'d rather walk" },
    { en: 'had better', uz: 'yaxshisi (ogohlantirish)', emoji: '⚠️', example: "'d better leave" },
    { en: 'ought to', uz: 'kerak (kutilgan)', emoji: '📐', example: 'ought to know' },
    { en: 'be supposed to', uz: 'kerak edi (mas\'uliyat)', emoji: '📋', example: 'supposed to call' },
    { en: 'can\'t help', uz: 'o\'zini tutolmaslik', emoji: '😅', example: "can't help laughing" },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'may as well', uz: 'qilaqolsak ham' }, { en: 'would rather', uz: 'afzal ko\'rmoq' }, { en: 'had better', uz: 'yaxshisi' }, { en: 'ought to', uz: 'kerak (kutilgan)' }], explanation: "Murakkab modallar." },
    { type: 'choose', sentence: 'No one else is coming, so we ___ as well start.', options: ['may', 'would', 'had'], correct: 'may', uz: 'Boshqa hech kim kelmayapti, boshlaqolsak ham bo\'ladi.', explanation: "Ilojsizlikdan → may/might as well." },
    { type: 'choose', sentence: "I'd ___ walk than take the bus.", options: ['rather', 'better', 'ought'], correct: 'rather', uz: 'Avtobusda ketgandan piyoda yurganni afzal ko\'raman.', explanation: "Afzal ko'rish → would rather + V1 (than)." },
    { type: 'judge', sentence: "You'd better to leave now.", isCorrect: false, explanation: "Noto'g'ri! had better + V1 (to YO'Q): 'You'd better leave now'." },
    { type: 'build', uz: 'Yaxshisi shoshiling.', words: ['You', "'d", 'better', 'hurry', 'up'], correct: ['You', "'d", 'better', 'hurry', 'up'], explanation: "had better + V1 (kuchli maslahat)." },
    { type: 'choose', sentence: 'She ___ to be here by now — she left an hour ago.', options: ['ought', 'would', 'had'], correct: 'ought', uz: 'U allaqachon shu yerda bo\'lishi kerak edi — bir soat oldin chiqdi.', explanation: "Kutilgan → ought to." },
    { type: 'choose', sentence: "I ___ rather you didn't smoke here.", options: ['would', 'had', 'ought'], correct: 'would', uz: 'Bu yerda chekmaganingizni afzal ko\'rardim.', explanation: "would rather + ega + Past (boshqa odam uchun)." },
    { type: 'judge', sentence: "We might as well take a taxi — it's raining.", isCorrect: true, explanation: "To'g'ri! Boshqa iloj yo'qligidan → might as well. Mukammal!" },
    { type: 'choose', sentence: "You ___ better see a doctor about that.", options: ["'d", 'would', 'ought'], correct: "'d", uz: 'Yaxshisi shu haqida shifokorga ko\'rining.', explanation: "had better → 'd better + V1." },
    { type: 'build', uz: 'Bugun kechqurun uyda qolganni afzal ko\'raman.', words: ['I', "'d", 'rather', 'stay', 'home', 'tonight'], correct: ['I', "'d", 'rather', 'stay', 'home', 'tonight'], explanation: "would rather + V1 (afzal ko'rish)." },
    { type: 'judge', sentence: "I couldn't help laughing at his joke.", isCorrect: true, explanation: "To'g'ri! can't help + ing — o'zini tutolmaslik. Mukammal!" },
    { type: 'choose', sentence: 'You ___ to call her — she\'s waiting.', options: ['ought', 'would', 'had'], correct: 'ought', uz: 'Unga qo\'ng\'iroq qilishingiz kerak — u kutyapti.', explanation: "Maslahat/burch → ought to." },
    { type: 'choose', sentence: "I was ___ to meet him, but he didn't show up.", options: ['supposed', 'ought', 'rather'], correct: 'supposed', uz: 'Men u bilan uchrashishim kerak edi, lekin u kelmadi.', explanation: "Mas'uliyat/reja → be supposed to." },
    { type: 'build', uz: 'Hozir boshlaqolsak ham bo\'ladi.', words: ['We', 'may', 'as', 'well', 'start', 'now'], correct: ['We', 'may', 'as', 'well', 'start', 'now'], explanation: "may as well (ilojsizlikdan). Mukammal yakun!" },
  ],
  rule: {
    title: 'Advanced Modals — to\'liq qoida',
    body: "Modallarning nozik ma'nolari.\n\n🤷 may/might as well — boshqa iloj yo'qligidan (mayli):\n   • Nobody's coming, we may as well go home.\n\n⚖️ would rather — AFZAL ko'rmoq:\n   • I'd rather walk than drive. (+ V1)\n   • I'd rather you didn't go. (boshqa odam → Past)\n\n⚠️ had better — kuchli maslahat/OGOHLANTIRISH:\n   • You'd better hurry. (+ V1, to YO'Q)\n   • (aks holda yomon bo'ladi degan ma'no)\n\n📐 ought to / be supposed to — kutilgan/mas'uliyat:\n   • She ought to be here. · I'm supposed to work.\n\n😅 can't help + ing — o'zini tutolmaslik:\n   • I can't help laughing.",
  },
  summary: [
    "may/might as well — boshqa iloj yo'qligidan",
    "would rather + V1 — afzal ko'rmoq",
    "had better + V1 — kuchli ogohlantirish (to yo'q)",
    "ought to / be supposed to — kutilgan, mas'uliyat",
  ],
}

// ─── 5. Modal Perfects ──────────────────────────────────────────────────────
const MODAL_PERFECTS: DemoLesson = {
  id: 'modal-perfects-b1plus-demo',
  skill: 'Modal perfect — o\'tmish haqida taxmin va tanqid',
  level: 'B1+',
  emoji: '🔍',
  context: {
    text: "Tasavvur qiling — o'tmishdagi voqea haqida taxmin qilyapsiz: \"U charchagan BO'LSA KERAK (taxmin)... Menga aytishing KERAK EDI (tanqid)... Yiqilib tushishing MUMKIN EDI (yaqin xavf)\". O'tmish haqida nozik fikrlar. Keling, modal perfect'larni o'rganamiz!",
    location: 'Real vaziyat · O\'tmishni tahlil',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "must have + V3 — o'tmish haqida ishonchli taxmin",
      "might/could have + V3 — o'tmish ehtimoli",
      "should have + V3 — o'tmishdagi afsus/tanqid (qilish kerak edi)",
      "can't have + V3 — o'tmishni ishonchli inkor",
    ],
  },
  examples: [
    { en: 'He must have missed the bus.',        uz: 'U avtobusni o\'tkazib yuborgan bo\'lsa kerak.', key: 'must have' },
    { en: 'You should have told me.',            uz: 'Menga aytishing kerak edi.',             key: 'should have' },
    { en: "She can't have finished already.",    uz: 'U allaqachon tugatgan bo\'lishi mumkin emas.', key: "can't have" },
    { en: 'They might have got lost.',           uz: 'Ular adashib qolgan bo\'lishlari mumkin.', key: 'might have' },
  ],
  vocab: [
    { en: 'must have + V3', uz: 'qilgan bo\'lsa kerak', emoji: '✅', example: 'must have left' },
    { en: 'might have + V3', uz: 'qilgan bo\'lishi mumkin', emoji: '🤔', example: 'might have known' },
    { en: 'should have + V3', uz: 'qilishing kerak edi', emoji: '😔', example: 'should have called' },
    { en: "shouldn't have + V3", uz: 'qilmasliging kerak edi', emoji: '🚫', example: "shouldn't have said" },
    { en: "can't have + V3", uz: 'qilgan bo\'lishi mumkin emas', emoji: '❌', example: "can't have gone" },
    { en: 'could have + V3', uz: 'qila olardi', emoji: '💭', example: 'could have won' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'must have', uz: 'qilgan bo\'lsa kerak' }, { en: 'should have', uz: 'qilishing kerak edi' }, { en: "can't have", uz: 'qilgani mumkin emas' }, { en: 'might have', uz: 'qilgani mumkin' }], explanation: "Modal perfect ma'nolari." },
    { type: 'choose', sentence: "He's not answering. He ___ have left already.", options: ['must', 'should', "can't"], correct: 'must', uz: 'U javob bermayapti. Allaqachon ketgan bo\'lsa kerak.', explanation: "O'tmish ishonchli taxmin → must have + V3." },
    { type: 'choose', sentence: 'You ___ have told me about the meeting!', options: ['should', 'must', 'might'], correct: 'should', uz: 'Yig\'ilish haqida menga aytishing kerak edi!', explanation: "O'tmish tanqidi/afsus → should have + V3." },
    { type: 'judge', sentence: "She must left without saying goodbye.", isCorrect: false, explanation: "Noto'g'ri! have + V3 kerak: 'She must have left'." },
    { type: 'build', uz: 'U allaqachon tugatgan bo\'lishi mumkin emas.', words: ['She', "can't", 'have', 'finished', 'already'], correct: ['She', "can't", 'have', 'finished', 'already'], explanation: "O'tmishni ishonchli inkor → can't have + V3." },
    { type: 'choose', sentence: "I don't know where they are. They ___ have got lost.", options: ['might', 'should', 'must'], correct: 'might', uz: 'Qayerda ekanlarini bilmayman. Adashib qolgan bo\'lishlari mumkin.', explanation: "O'tmish ehtimoli → might have + V3." },
    { type: 'choose', sentence: "You ___ have eaten so much — now you feel sick.", options: ["shouldn't", "can't", 'must'], correct: "shouldn't", uz: 'Bunchalik ko\'p yemasliging kerak edi — endi o\'zingni yomon his qilyapsan.', explanation: "O'tmishda noto'g'ri ish → shouldn't have + V3." },
    { type: 'judge', sentence: "He can't have stolen it — he was with me all day.", isCorrect: true, explanation: "To'g'ri! Dalil bor (men bilan edi) → can't have (ishonchli inkor). Mukammal!" },
    { type: 'choose', sentence: 'The ground is wet. It ___ have rained last night.', options: ['must', 'should', "can't"], correct: 'must', uz: 'Yer ho\'l. Kecha yomg\'ir yog\'gan bo\'lsa kerak.', explanation: "Dalil → must have + V3." },
    { type: 'build', uz: 'Menga aytishing kerak edi.', words: ['You', 'should', 'have', 'told', 'me'], correct: ['You', 'should', 'have', 'told', 'me'], explanation: "O'tmish afsusi → should have + V3." },
    { type: 'judge', sentence: "I could have won if I had tried harder.", isCorrect: true, explanation: "To'g'ri! O'tmish imkoniyati → could have + V3. Mukammal!" },
    { type: 'choose', sentence: "She looks happy. She ___ have passed the exam.", options: ['must', 'should', "shouldn't"], correct: 'must', uz: 'U xursand ko\'rinyapti. Imtihondan o\'tgan bo\'lsa kerak.', explanation: "Dalil (xursand) → must have + V3." },
    { type: 'choose', sentence: "We ___ have booked earlier — now it's full.", options: ['should', 'must', "can't"], correct: 'should', uz: 'Ertaroq band qilishimiz kerak edi — endi to\'lib qoldi.', explanation: "O'tmish afsusi → should have + V3." },
    { type: 'build', uz: 'U avtobusni o\'tkazib yuborgan bo\'lsa kerak.', words: ['He', 'must', 'have', 'missed', 'the', 'bus'], correct: ['He', 'must', 'have', 'missed', 'the', 'bus'], explanation: "Ishonchli taxmin → must have + V3. Mukammal yakun!" },
  ],
  rule: {
    title: 'Modal Perfects — to\'liq qoida',
    body: "O'tmish haqida taxmin, afsus va tanqid: modal + have + V3.\n\n✅ must have + V3 — ISHONCHLI taxmin:\n   • The ground is wet. It must have rained.\n\n🤔 might / could have + V3 — EHTIMOL:\n   • They might have got lost.\n   • I could have won (but I didn't).\n\n😔 should have + V3 — AFSUS/TANQID (qilish kerak edi):\n   • You should have told me. (aytmading)\n   • I shouldn't have eaten so much.\n\n❌ can't have + V3 — ISHONCHLI INKOR:\n   • He can't have stolen it — he was with me.\n\n⚠️ Hammasida: modal + HAVE + V3\n   (must left ✗ → must have left ✓)",
  },
  summary: [
    "must have + V3 — o'tmish ishonchli taxmini",
    "might/could have + V3 — o'tmish ehtimoli",
    "should have + V3 — afsus/tanqid (kerak edi)",
    "can't have + V3 — o'tmishni ishonchli inkor",
  ],
}

// ─── 6. Narrative Tenses ────────────────────────────────────────────────────
const NARRATIVE_TENSES: DemoLesson = {
  id: 'narrative-tenses-b1plus-demo',
  skill: 'Hikoya zamonlari — o\'tmish zamonlarni birlashtirish',
  level: 'B1+',
  emoji: '📖',
  context: {
    text: "Tasavvur qiling — qiziqarli hikoya aytyapsiz: \"Quyosh CHARAQLAB TURARDI (fon). Men ko'chada KETAYOTGAN EDIM (davom). To'satdan eski do'stimni KO'RIB QOLDIM (asosiy voqea). U meni bir yildan beri KUTAYOTGAN EKAN (avvalgi)\". To'rt o'tmish zamoni birga. Keling, hikoya zamonlarini o'rganamiz!",
    location: 'Real vaziyat · Hikoya aytish',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Past Simple — asosiy ketma-ket voqealar (I saw, went)",
      "Past Continuous — fon, davom etgan harakat (was walking)",
      "Past Perfect — avvalroq bo'lgan (had left)",
      "Past Perfect Continuous — avvalroq davom etgan (had been waiting)",
    ],
  },
  examples: [
    { en: 'The sun was shining when I went out.', uz: 'Men chiqqanimda quyosh charaqlab turardi.', key: 'was shining / went' },
    { en: 'I was walking when I saw her.',       uz: 'Men ketayotganimda uni ko\'rdim.',       key: 'was walking / saw' },
    { en: 'She had already left when I arrived.', uz: 'Men kelganimda u allaqachon ketgan edi.', key: 'had left' },
    { en: 'He was tired; he had been working.',   uz: 'U charchagan edi; ishlayotgan edi.',     key: 'had been working' },
  ],
  vocab: [
    { en: 'Past Simple', uz: 'asosiy voqea',  emoji: '➡️', example: 'I went, I saw' },
    { en: 'Past Continuous', uz: 'fon/davom', emoji: '🎬', example: 'was raining' },
    { en: 'Past Perfect', uz: 'avvalroq',     emoji: '⏮️', example: 'had gone' },
    { en: 'Past Perfect Cont.', uz: 'avval davom etgan', emoji: '⏳', example: 'had been waiting' },
    { en: 'suddenly',  uz: 'to\'satdan',      emoji: '⚡', example: 'suddenly stopped' },
    { en: 'while',     uz: '...paytida',      emoji: '🔄', example: 'while I slept' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'Past Simple', uz: 'asosiy voqea' }, { en: 'Past Continuous', uz: 'fon/davom' }, { en: 'Past Perfect', uz: 'avvalroq' }, { en: 'suddenly', uz: 'to\'satdan' }], explanation: "Hikoya zamonlari." },
    { type: 'choose', sentence: 'I ___ TV when the phone rang.', options: ['was watching', 'watched', 'had watched'], correct: 'was watching', uz: 'Telefon jiringlaganda men televizor ko\'rayotgan edim.', explanation: "Davom etgan fon → Past Continuous (was watching)." },
    { type: 'choose', sentence: 'When I arrived, the film ___ already started.', options: ['had', 'was', 'has'], correct: 'had', uz: 'Men kelganimda film allaqachon boshlangan edi.', explanation: "Avvalroq sodir → Past Perfect (had started)." },
    { type: 'judge', sentence: 'While I was cooking, I cut my finger.', isCorrect: true, explanation: "To'g'ri! Fon (was cooking) + asosiy voqea (cut). Mukammal!" },
    { type: 'build', uz: 'U charchagan edi; ishlayotgan edi.', words: ['He', 'was', 'tired', 'he', 'had', 'been', 'working'], correct: ['He', 'was', 'tired', 'he', 'had', 'been', 'working'], explanation: "Natija (tired) sababi → Past Perfect Continuous (had been working)." },
    { type: 'choose', sentence: 'The sun ___ when we left the house.', options: ['was shining', 'shone', 'had shone'], correct: 'was shining', uz: 'Biz uydan chiqqanimizda quyosh charaqlab turardi.', explanation: "Fon manzarasi → Past Continuous." },
    { type: 'choose', sentence: 'She ___ for an hour before the bus finally came.', options: ['had been waiting', 'waited', 'was waiting'], correct: 'had been waiting', uz: 'Avtobus kelgunidan oldin u bir soat kutgan edi.', explanation: "Avvalroq davom etgan → Past Perfect Continuous." },
    { type: 'judge', sentence: 'I was walking and suddenly I was falling.', isCorrect: false, explanation: "To'satdan voqea → Past Simple: 'suddenly I fell' (was falling emas)." },
    { type: 'choose', sentence: 'They ___ dinner when we arrived, so they invited us.', options: ['were having', 'had', 'have had'], correct: 'were having', uz: 'Biz kelganimizda ular ovqatlanayotgan edilar.', explanation: "Davom etgan harakat → Past Continuous." },
    { type: 'build', uz: 'Men ketayotganimda uni ko\'rdim.', words: ['I', 'was', 'walking', 'when', 'I', 'saw', 'her'], correct: ['I', 'was', 'walking', 'when', 'I', 'saw', 'her'], explanation: "Fon (was walking) + asosiy voqea (saw)." },
    { type: 'judge', sentence: 'By the time we got there, everyone had gone home.', isCorrect: true, explanation: "To'g'ri! Avvalroq sodir → Past Perfect (had gone). Mukammal!" },
    { type: 'choose', sentence: 'It ___ heavily, so the streets were flooded.', options: ['had been raining', 'rained', 'was rain'], correct: 'had been raining', uz: 'Qattiq yomg\'ir yog\'gan edi, shuning uchun ko\'chalar suvga to\'lgan.', explanation: "Natija sababi → Past Perfect Continuous." },
    { type: 'choose', sentence: 'When the alarm ___, everyone ran outside.', options: ['went off', 'was going off', 'had gone off'], correct: 'went off', uz: 'Signal chalinganda hamma tashqariga yugurdi.', explanation: "Asosiy ketma-ket voqealar → Past Simple." },
    { type: 'build', uz: 'Men kelganimda u allaqachon ketgan edi.', words: ['She', 'had', 'already', 'left', 'when', 'I', 'arrived'], correct: ['She', 'had', 'already', 'left', 'when', 'I', 'arrived'], explanation: "Avvalroq (had left) + keyingi (arrived). Mukammal yakun!" },
  ],
  rule: {
    title: 'Narrative Tenses — to\'liq qoida',
    body: "Hikoyada o'tmish zamonlari birga ishlatiladi.\n\n➡️ Past Simple — ASOSIY ketma-ket voqealar:\n   • I woke up, got dressed and left.\n\n🎬 Past Continuous — FON / davom etgan harakat:\n   • The sun was shining. I was walking...\n   • (asosiy voqea bo'lganda davom etayotgan edi)\n\n⏮️ Past Perfect — AVVALROQ bo'lgan:\n   • When I arrived, she had already left.\n\n⏳ Past Perfect Continuous — avvalroq DAVOM etgan:\n   • He was tired; he had been working all day.\n\n💡 Tipik tuzilma:\n   Fon (Past Cont.) + to'satdan voqea (Past Simple)\n   + sabab/avvalgi (Past Perfect).",
  },
  summary: [
    "Past Simple — asosiy ketma-ket voqealar",
    "Past Continuous — fon, davom etgan harakat",
    "Past Perfect — avvalroq bo'lgan (had left)",
    "Past Perfect Cont. — avvalroq davom etgan",
  ],
}

// ─── 7. Advanced Relative Clauses ───────────────────────────────────────────
const ADVANCED_RELATIVE_CLAUSES: DemoLesson = {
  id: 'advanced-relative-clauses-b1plus-demo',
  skill: 'Murakkab sifatlovchi gaplar — predlog, quantifier, which',
  level: 'B1+',
  emoji: '🔗',
  context: {
    text: "Tasavvur qiling — rasmiy yozyapsiz: \"Bu men ishonadigan odam... bularning ba'zilari foydali bo'lgan g'oyalar... u kech keldi, BU esa hammani bezovta qildi\". Murakkab sifatlovchi gaplar nutqni boyitadi. Keling, ularni o'rganamiz!",
    location: 'Real vaziyat · Rasmiy yozuv',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Predlog + which/whom: the man to whom I spoke",
      "Quantifier + of which/whom: many of whom, some of which",
      "which butun gapga ishora: He was late, which annoyed me",
      "Rasmiy uslub: whom (odam), of which (narsa)",
    ],
  },
  examples: [
    { en: 'The person to whom I spoke was helpful.', uz: 'Men gaplashgan odam yordamchi edi.',  key: 'to whom' },
    { en: 'I have many friends, some of whom live abroad.', uz: 'Mening ko\'p do\'stlarim bor, ba\'zilari chet elda yashaydi.', key: 'some of whom' },
    { en: 'He arrived late, which annoyed everyone.', uz: 'U kech keldi, bu hammani bezovta qildi.', key: 'which' },
    { en: 'The house, the roof of which is red, is mine.', uz: 'Tomi qizil bo\'lgan uy meniki.',     key: 'of which' },
  ],
  vocab: [
    { en: 'to whom',  uz: '...gaplashgan odam', emoji: '🗣️', example: 'the man to whom...' },
    { en: 'of whom',  uz: '...laridan',        emoji: '👥', example: 'some of whom' },
    { en: 'of which', uz: '...ning (narsa)',   emoji: '📦', example: 'the cover of which' },
    { en: 'which (gap)', uz: 'bu (butun gapga)', emoji: '🔁', example: '..., which is good' },
    { en: 'in which', uz: '...da (joy/holat)', emoji: '📍', example: 'the way in which' },
    { en: 'whereby',  uz: 'shu yo\'l bilan',   emoji: '⚙️', example: 'a system whereby...' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'to whom', uz: '...ga (odam)' }, { en: 'of whom', uz: '...laridan' }, { en: 'of which', uz: '...ning (narsa)' }, { en: 'which (gap)', uz: 'butun gapga' }], explanation: "Murakkab sifatlovchi bo'laklar." },
    { type: 'choose', sentence: 'The colleague ___ whom I work is very kind.', options: ['with', 'to', 'of'], correct: 'with', uz: 'Men birga ishlaydigan hamkasbim juda mehribon.', explanation: "work WITH → with whom (predlog + whom)." },
    { type: 'choose', sentence: 'She has three sons, all of ___ are doctors.', options: ['whom', 'which', 'who'], correct: 'whom', uz: 'Uning uchta o\'g\'li bor, hammasi shifokor.', explanation: "Odam + quantifier → all of whom." },
    { type: 'judge', sentence: 'He passed the exam, which made his parents proud.', isCorrect: true, explanation: "To'g'ri! which — butun gapga ishora (imtihondan o'tgani). Mukammal!" },
    { type: 'build', uz: 'U kech keldi, bu hammani bezovta qildi.', words: ['He', 'arrived', 'late', 'which', 'annoyed', 'everyone'], correct: ['He', 'arrived', 'late', 'which', 'annoyed', 'everyone'], explanation: "which — oldingi butun gapga (kech kelgani)." },
    { type: 'choose', sentence: 'The report, the conclusion ___ which was clear, impressed us.', options: ['of', 'to', 'in'], correct: 'of', uz: 'Xulosasi aniq bo\'lgan hisobot bizni hayratda qoldirdi.', explanation: "the conclusion OF which (narsa egaligi)." },
    { type: 'choose', sentence: 'I met some experts, none of ___ agreed.', options: ['whom', 'which', 'them'], correct: 'whom', uz: 'Men bir nechta ekspert bilan uchrashdim, hech biri rozi bo\'lmadi.', explanation: "Odam + none of → none of whom." },
    { type: 'judge', sentence: 'The man who I spoke to him was helpful.', isCorrect: false, explanation: "Noto'g'ri! Qo'sh ob'ekt: 'The man to whom I spoke' yoki 'who I spoke to' (him yo'q)." },
    { type: 'choose', sentence: 'This is the method by ___ we solved it.', options: ['which', 'whom', 'that'], correct: 'which', uz: 'Bu biz uni hal qilgan usul.', explanation: "by which (usul/vosita)." },
    { type: 'build', uz: 'Men gaplashgan odam yordamchi edi.', words: ['The', 'person', 'to', 'whom', 'I', 'spoke', 'was', 'helpful'], correct: ['The', 'person', 'to', 'whom', 'I', 'spoke', 'was', 'helpful'], explanation: "speak to → to whom (rasmiy)." },
    { type: 'judge', sentence: 'I have many books, most of which are old.', isCorrect: true, explanation: "To'g'ri! Narsa + quantifier → most of which. Mukammal!" },
    { type: 'choose', sentence: 'She didn\'t reply, ___ surprised me.', options: ['which', 'who', 'that'], correct: 'which', uz: 'U javob bermadi, bu meni hayron qoldirdi.', explanation: "which — butun gapga (javob bermagani)." },
    { type: 'choose', sentence: 'The students, many of ___ were tired, kept working.', options: ['whom', 'which', 'who'], correct: 'whom', uz: 'Ko\'pchiligi charchagan talabalar ishlashda davom etdi.', explanation: "Odam + many of → many of whom." },
    { type: 'build', uz: 'Ba\'zilari chet elda yashaydigan ko\'p do\'stlarim bor.', words: ['I', 'have', 'many', 'friends', 'some', 'of', 'whom', 'live', 'abroad'], correct: ['I', 'have', 'many', 'friends', 'some', 'of', 'whom', 'live', 'abroad'], explanation: "some of whom (odam + quantifier). Mukammal yakun!" },
  ],
  rule: {
    title: 'Advanced Relative Clauses — to\'liq qoida',
    body: "Rasmiy va murakkab sifatlovchi gaplar.\n\n🗣️ Predlog + whom/which (rasmiy):\n   • The man to whom I spoke. (= who I spoke to)\n   • The tool with which I work.\n\n👥 Quantifier + of whom/which:\n   • I have friends, some of whom live abroad.\n   • books, many of which are old.\n   • (all/some/none/most/many of whom/which)\n\n🔁 which — BUTUN GAPGA ishora (non-defining):\n   • He was late, which annoyed me.\n   • She passed, which was great.\n\n📍 in/by/for + which:\n   • the way in which · the method by which\n\n⚠️ whom — odam (rasmiy ob'ekt) · of which — narsa egaligi",
  },
  summary: [
    "Predlog + whom/which: to whom I spoke",
    "Quantifier + of whom/which: some of whom",
    "which — butun gapga ishora (..., which annoyed me)",
    "Rasmiy: whom (odam), of which (narsa)",
  ],
}

// ─── 8. Participle Clauses ──────────────────────────────────────────────────
const PARTICIPLE_CLAUSES: DemoLesson = {
  id: 'participle-clauses-b1plus-demo',
  skill: 'Sifatdosh oborotlar — gapni qisqartirish',
  level: 'B1+',
  emoji: '✂️',
  context: {
    text: "Tasavvur qiling — yozma nutqni ixchamlashtiryapsiz: \"U kirگach, o'tirdi\" o'rniga \"Kirib, o'tirdi (Entering, he sat down)\". Sifatdosh oborotlar gapni qisqa va chiroyli qiladi. Keling, participle clauses'ni o'rganamiz!",
    location: 'Real vaziyat · Ixcham yozuv',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "-ing (active): Feeling tired, I went to bed",
      "-ed/V3 (passive): Built in 1990, the bridge is old",
      "Having + V3 (avvalgi ish): Having finished, she left",
      "Ikki gapni bitta qilib qisqartiradi (bir xil ega bilan)",
    ],
  },
  examples: [
    { en: 'Feeling tired, I went to bed.',       uz: 'Charchab, men uxlagani yotdim.',         key: 'Feeling' },
    { en: 'Built in 1990, the house is old.',    uz: '1990-da qurilgan uy eski.',              key: 'Built' },
    { en: 'Having finished work, she went home.', uz: 'Ishni tugatib, u uyga ketdi.',          key: 'Having finished' },
    { en: 'The man standing there is my boss.',   uz: 'U yerda turgan odam mening boshlig\'im.', key: 'standing' },
  ],
  vocab: [
    { en: '-ing (active)', uz: 'qilib (faol)', emoji: '🏃', example: 'Running, he fell' },
    { en: '-ed/V3 (passive)', uz: 'qilingan', emoji: '📦', example: 'Made in Japan' },
    { en: 'Having + V3', uz: 'qilib bo\'lib', emoji: '✅', example: 'Having eaten' },
    { en: 'Not + ing',  uz: 'qilmasdan',      emoji: '🚫', example: 'Not knowing' },
    { en: 'reduce',     uz: 'qisqartirmoq',   emoji: '✂️', example: 'reduce a clause' },
    { en: 'simultaneous', uz: 'bir vaqtda',   emoji: '⏱️', example: 'happening at once' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: '-ing', uz: 'qilib (faol)' }, { en: '-ed/V3', uz: 'qilingan (passiv)' }, { en: 'Having + V3', uz: 'qilib bo\'lib' }, { en: 'Not + ing', uz: 'qilmasdan' }], explanation: "Sifatdosh turlari." },
    { type: 'choose', sentence: '___ tired, I decided to rest.', options: ['Feeling', 'Felt', 'To feel'], correct: 'Feeling', uz: 'Charchab, dam olishga qaror qildim.', explanation: "Faol, bir vaqtda → -ing (Feeling)." },
    { type: 'choose', sentence: '___ in 1990, the bridge needs repair.', options: ['Built', 'Building', 'To build'], correct: 'Built', uz: '1990-da qurilgan ko\'prik ta\'mirni talab qiladi.', explanation: "Passiv → V3 (Built = qurilgan)." },
    { type: 'judge', sentence: 'Having finished his work, he went home.', isCorrect: true, explanation: "To'g'ri! Avvalgi ish → Having + V3 (finished). Mukammal!" },
    { type: 'build', uz: 'Kirib, u o\'tirdi.', words: ['Entering', 'the', 'room', 'he', 'sat', 'down'], correct: ['Entering', 'the', 'room', 'he', 'sat', 'down'], explanation: "Bir vaqtda harakat → -ing (Entering)." },
    { type: 'choose', sentence: '___ what to do, she asked for help.', options: ['Not knowing', 'Not know', "Don't know"], correct: 'Not knowing', uz: 'Nima qilishni bilmasdan, u yordam so\'radi.', explanation: "Inkor → Not + ing (Not knowing)." },
    { type: 'choose', sentence: 'The woman ___ the piano is famous.', options: ['playing', 'played', 'plays'], correct: 'playing', uz: 'Piano chalayotgan ayol mashhur.', explanation: "Faol (= who is playing) → -ing." },
    { type: 'judge', sentence: 'Written in French, I couldn\'t read the letter.', isCorrect: false, explanation: "Ega mos emas! Xat fransuzcha — 'Written in French, the letter...' bo'lishi kerak." },
    { type: 'choose', sentence: '___ the news, she burst into tears.', options: ['Having heard', 'Hearing to', 'Heard'], correct: 'Having heard', uz: 'Yangilikni eshitib, u yig\'lab yubordi.', explanation: "Avvalgi ish → Having + V3 (heard)." },
    { type: 'build', uz: 'Ishni tugatib, u uyga ketdi.', words: ['Having', 'finished', 'work', 'she', 'went', 'home'], correct: ['Having', 'finished', 'work', 'she', 'went', 'home'], explanation: "Having + V3 (avval tugatib)." },
    { type: 'judge', sentence: 'Surrounded by friends, he felt happy.', isCorrect: true, explanation: "To'g'ri! Passiv (= who was surrounded) → V3 (Surrounded). Mukammal!" },
    { type: 'choose', sentence: 'The products ___ in China are cheap.', options: ['made', 'making', 'make'], correct: 'made', uz: 'Xitoyda ishlab chiqarilgan mahsulotlar arzon.', explanation: "Passiv (= which are made) → V3 (made)." },
    { type: 'choose', sentence: '___ for hours, we finally arrived.', options: ['Having driven', 'Driving to', 'Drove'], correct: 'Having driven', uz: 'Soatlab mashina haydab, nihoyat yetib keldik.', explanation: "Avvalgi davom etgan ish → Having + V3." },
    { type: 'build', uz: 'Charchab, men uxlagani yotdi.', words: ['Feeling', 'tired', 'I', 'went', 'to', 'bed'], correct: ['Feeling', 'tired', 'I', 'went', 'to', 'bed'], explanation: "Faol holat → -ing (Feeling). Mukammal yakun!" },
  ],
  rule: {
    title: 'Participle Clauses — to\'liq qoida',
    body: "Sifatdosh oborotlar — gapni qisqartiradi (bir xil ega bilan).\n\n🏃 -ing (FAOL, bir vaqtda yoki sabab):\n   • Feeling tired, I went to bed. (= Because I felt...)\n   • The man standing there... (= who is standing)\n\n📦 -ed/V3 (PASSIV):\n   • Built in 1990, the house is old. (= which was built)\n   • Made in Japan, it's reliable.\n\n✅ Having + V3 (AVVALGI ish):\n   • Having finished, she left. (avval tugatib)\n\n🚫 Inkor: Not + ing:\n   • Not knowing the way, we got lost.\n\n⚠️ EGA bir xil bo'lishi shart!\n   • Built in 1990, the house... ✓ (uy qurildi)\n   • Built in 1990, I saw the house ✗ (men qurilmadim!)",
  },
  summary: [
    "-ing — faol (Feeling tired, I...)",
    "-ed/V3 — passiv (Built in 1990, ...)",
    "Having + V3 — avvalgi ish (Having finished)",
    "Ega bir xil bo'lishi shart!",
  ],
}

// ─── 9. Infinitive vs Gerund (Advanced) ─────────────────────────────────────
const INFINITIVE_GERUND_ADVANCED: DemoLesson = {
  id: 'infinitive-gerund-advanced-b1plus-demo',
  skill: 'Infinitiv va gerundiy (murakkab) — nozik holatlar',
  level: 'B1+',
  emoji: '🎚️',
  context: {
    text: "Tasavvur qiling — nozik ma'no farqlarini ifodalayapsiz: \"Uni ko'rdim, u KETAyoTGANDA (jarayon) va u KETGANINI (to'liq)\". Sezgi fe'llari, perfect infinitiv va boshqa murakkab holatlar. Keling, ularni o'rganamiz!",
    location: 'Real vaziyat · Aniq ifoda',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Sezgi fe'llari: see/hear + odam + V1 (to'liq) yoki + ing (jarayon)",
      "Perfect infinitive: seems to have left (avval bo'lgan)",
      "Passive infinitive/gerund: to be done, being done",
      "be/get used to + ing (ko'nikmoq) — to'g'ri ishlatish",
    ],
  },
  examples: [
    { en: 'I saw him leave the building.',       uz: 'Uni binodan chiqganini ko\'rdim (to\'liq).', key: 'saw him leave' },
    { en: 'I saw him leaving the building.',     uz: 'Uni binodan chiqayotganini ko\'rdim (jarayon).', key: 'saw him leaving' },
    { en: 'She seems to have forgotten.',        uz: 'U unutgan ko\'rinadi.',                   key: 'to have forgotten' },
    { en: "I'm used to working late.",           uz: 'Men kech ishlashga ko\'nikganman.',        key: 'used to working' },
  ],
  vocab: [
    { en: 'see sb V1', uz: 'to\'liq ko\'rmoq', emoji: '👁️', example: 'saw her fall' },
    { en: 'see sb + ing', uz: 'jarayonda ko\'rmoq', emoji: '🎬', example: 'saw her falling' },
    { en: 'to have + V3', uz: 'avval qilgan', emoji: '⏮️', example: 'seems to have gone' },
    { en: 'to be + V3', uz: 'qilinishi (passiv inf.)', emoji: '📥', example: 'wants to be paid' },
    { en: 'used to + ing', uz: 'ko\'nikmoq',  emoji: '🔄', example: 'used to driving' },
    { en: 'being + V3', uz: 'qilinish (passiv ger.)', emoji: '📦', example: 'avoid being seen' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'see sb V1', uz: 'to\'liq ko\'rmoq' }, { en: 'see sb + ing', uz: 'jarayonda ko\'rmoq' }, { en: 'to have + V3', uz: 'avval qilgan' }, { en: 'used to + ing', uz: 'ko\'nikmoq' }], explanation: "Murakkab holatlar." },
    { type: 'choose', sentence: 'I heard someone ___ on the door, then it stopped.', options: ['knock', 'knocking', 'to knock'], correct: 'knock', uz: 'Kimdir eshikni taqillatganini eshitdim, keyin to\'xtadi.', explanation: "To'liq harakat (boshidan oxiriga) → see/hear + V1 (knock)." },
    { type: 'choose', sentence: 'She seems ___ already left.', options: ['to have', 'to', 'having'], correct: 'to have', uz: 'U allaqachon ketgan ko\'rinadi.', explanation: "Avval bo'lgan → perfect infinitive (to have left)." },
    { type: 'judge', sentence: "I'm used to work late now.", isCorrect: false, explanation: "Noto'g'ri! be used to + ING: 'I'm used to working late' (ko'nikmoq)." },
    { type: 'build', uz: 'Uni binodan chiqayotganini ko\'rdim (jarayon).', words: ['I', 'saw', 'him', 'leaving', 'the', 'building'], correct: ['I', 'saw', 'him', 'leaving', 'the', 'building'], explanation: "Jarayonda ko'rish → see + ing (leaving)." },
    { type: 'choose', sentence: 'He wants ___ for his work.', options: ['to be paid', 'to pay', 'being paid'], correct: 'to be paid', uz: 'U ishi uchun haq olishni xohlaydi.', explanation: "Passiv infinitive → to be + V3 (paid)." },
    { type: 'choose', sentence: 'I avoid ___ in photos.', options: ['being seen', 'to be seen', 'seeing'], correct: 'being seen', uz: 'Men suratlarda ko\'rinishdan qochaman.', explanation: "Passiv gerund → being + V3 (seen)." },
    { type: 'judge', sentence: 'I watched the sun set behind the hills.', isCorrect: true, explanation: "To'g'ri! To'liq harakat → watch + V1 (set). Mukammal!" },
    { type: 'choose', sentence: "It's getting easier — I'm getting used to ___ here.", options: ['living', 'live', 'to live'], correct: 'living', uz: 'Osonlashyapti — men bu yerda yashashga ko\'nikyapman.', explanation: "get used to + ING (ko'nika boshlamoq)." },
    { type: 'build', uz: 'U unutgan ko\'rinadi.', words: ['She', 'seems', 'to', 'have', 'forgotten'], correct: ['She', 'seems', 'to', 'have', 'forgotten'], explanation: "Avval bo'lgan → seems to have + V3." },
    { type: 'judge', sentence: "I'd like to have been told earlier.", isCorrect: true, explanation: "To'g'ri! Passiv perfect infinitive (avval aytilishni xohlardim). Mukammal!" },
    { type: 'choose', sentence: 'We saw the thieves ___ into the house (the whole act).', options: ['break', 'breaking', 'to break'], correct: 'break', uz: 'O\'g\'rilarni uyga buzib kirganini ko\'rdik (butun harakat).', explanation: "To'liq harakat → see + V1 (break)." },
    { type: 'choose', sentence: 'He appears ___ a lot of money.', options: ['to have made', 'to make', 'making'], correct: 'to have made', uz: 'U ko\'p pul ishlab topgan ko\'rinadi.', explanation: "Avval bo'lgan → appears to have + V3." },
    { type: 'build', uz: 'Men kech ishlashga ko\'nikganman.', words: ['I', 'am', 'used', 'to', 'working', 'late'], correct: ['I', 'am', 'used', 'to', 'working', 'late'], explanation: "be used to + ing (ko'nikmoq). Mukammal yakun!" },
  ],
  rule: {
    title: 'Infinitive vs Gerund (Advanced) — to\'liq qoida',
    body: "Nozik holatlar va murakkab shakllar.\n\n👁️ Sezgi fe'llari (see/hear/watch/feel):\n   • + odam + V1 → TO'LIQ harakat: I saw him fall.\n   • + odam + ing → JARAYON: I saw him falling.\n\n⏮️ Perfect infinitive — AVVAL bo'lgan:\n   • She seems to have left. (avval ketgan)\n\n📥 Passiv shakllar:\n   • to be + V3: He wants to be paid.\n   • being + V3: I avoid being seen.\n   • to have been + V3: I'd like to have been told.\n\n🔄 be/get used to + ING — KO'NIKMOQ:\n   • I'm used to working late. (ko'nikkanman)\n   ⚠️ used to + V1 (o'tmish odati) bilan ADASHTIRMANG!\n   • I used to work (o'tmishda) ≠ I'm used to working (ko'nikkanman)",
  },
  summary: [
    "see sb V1 (to'liq) vs see sb + ing (jarayon)",
    "Perfect inf: seems to have left (avval)",
    "Passiv: to be paid, being seen",
    "be used to + ing (ko'nikmoq) ≠ used to + V1 (odat)",
  ],
}

// ─── 10. Emphasis: do/does/did ──────────────────────────────────────────────
const EMPHASIS_DOES: DemoLesson = {
  id: 'emphasis-does-b1plus-demo',
  skill: 'Ta\'kid — do/does/did va cleft gaplar',
  level: 'B1+',
  emoji: '❗',
  context: {
    text: "Tasavvur qiling — kimdir sizni ishonmayotganda ta'kidlayapsiz: \"Men ROSTDAN HAM aytdim!\" yoki \"Aynan SIZ menga yordam berdingiz\". Gapni kuchaytirib ta'kidlash. Keling, emphasis (ta'kid) usullarini o'rganamiz!",
    location: 'Real vaziyat · Ta\'kidlash',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "do/does/did + V1 — ijobiy gapni kuchaytirish (I DO like it)",
      "It is/was ... that — cleft (aynan ... edi)",
      "What ... is — cleft (... narsa shuki)",
      "Inversiya bilan ta'kid (Never have I seen...)",
    ],
  },
  examples: [
    { en: 'I do like your idea!',                uz: 'G\'oyangiز menga ROSTDAN ham yoqdi!',     key: 'do like' },
    { en: 'She did call you, I promise.',        uz: 'U sizga qo\'ng\'iroq qildi, ishoning.',  key: 'did call' },
    { en: 'It was John who broke it.',           uz: 'Aynan John uni sindirdi.',                key: 'It was ... who' },
    { en: 'What I need is some rest.',           uz: 'Menga kerak bo\'lgan narsa — biroz dam.', key: 'What ... is' },
  ],
  vocab: [
    { en: 'do/does + V1', uz: 'rostdan ham (ta\'kid)', emoji: '❗', example: 'I do agree' },
    { en: 'did + V1', uz: 'haqiqatan qildi', emoji: '✅', example: 'She did come' },
    { en: 'It is...that', uz: 'aynan ... edi', emoji: '🎯', example: 'It was him that...' },
    { en: 'What...is', uz: '... narsa shuki', emoji: '💬', example: 'What I want is...' },
    { en: 'The reason...is', uz: 'sabab shuki', emoji: '🔑', example: 'The reason is...' },
    { en: 'emphasis', uz: 'ta\'kid',          emoji: '⭐', example: 'add emphasis' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'do + V1', uz: 'rostdan ham' }, { en: 'did + V1', uz: 'haqiqatan qildi' }, { en: 'It is...that', uz: 'aynan ... edi' }, { en: 'What...is', uz: '... narsa shuki' }], explanation: "Ta'kid usullari." },
    { type: 'choose', sentence: 'I ___ understand, but I disagree.', options: ['do', 'am', 'did'], correct: 'do', uz: 'Men ROSTDAN ham tushunaman, lekin rozi emasman.', explanation: "Ijobiyni ta'kid → do + V1 (do understand)." },
    { type: 'choose', sentence: 'She ___ apologise, but it was too late.', options: ['did', 'do', 'was'], correct: 'did', uz: 'U HAQIQATAN ham uzr so\'radi, lekin kech bo\'ldi.', explanation: "O'tmish ta'kidi → did + V1 (did apologise)." },
    { type: 'judge', sentence: 'I do agreed with you.', isCorrect: false, explanation: "Noto'g'ri! do + V1 (asl shakl): 'I do agree' (agreed emas)." },
    { type: 'build', uz: 'Aynan John uni sindirdi.', words: ['It', 'was', 'John', 'who', 'broke', 'it'], correct: ['It', 'was', 'John', 'who', 'broke', 'it'], explanation: "Cleft: It was + ta'kid + who/that." },
    { type: 'choose', sentence: '___ I really want is a holiday.', options: ['What', 'That', 'It'], correct: 'What', uz: 'Men chinakam istagan narsa — ta\'til.', explanation: "What-cleft: What I want is..." },
    { type: 'choose', sentence: 'It was in Paris ___ they first met.', options: ['that', 'who', 'which'], correct: 'that', uz: 'Aynan Parijda ular birinchi marta uchrashdi.', explanation: "Joy ta'kidi → It was ... that." },
    { type: 'judge', sentence: 'He does works very hard.', isCorrect: false, explanation: "Noto'g'ri! does + V1: 'He does work very hard' (works emas)." },
    { type: 'choose', sentence: 'They ___ enjoy the party, despite the rain.', options: ['did', 'do', 'were'], correct: 'did', uz: 'Yomg\'irga qaramay, ular bazmdan HAQIQATAN rohatlandi.', explanation: "O'tmish ta'kidi → did + V1 (did enjoy)." },
    { type: 'build', uz: 'Menga kerak bo\'lgan narsa — biroz dam.', words: ['What', 'I', 'need', 'is', 'some', 'rest'], correct: ['What', 'I', 'need', 'is', 'some', 'rest'], explanation: "What-cleft: What I need is..." },
    { type: 'judge', sentence: 'It was my sister who called you.', isCorrect: true, explanation: "To'g'ri! Cleft: It was + odam + who. Mukammal!" },
    { type: 'choose', sentence: 'The reason ___ I left is that I was bored.', options: ['why', 'that', 'what'], correct: 'why', uz: 'Ketishimning sababi — zerikganim edi.', explanation: "The reason why ... is that ..." },
    { type: 'choose', sentence: 'Do come in! We ___ want to see you.', options: ['do', 'are', 'did'], correct: 'do', uz: 'Kiring! Sizni ROSTDAN ham ko\'rmoqchimiz.', explanation: "Ta'kid → do + V1 (do want)." },
    { type: 'build', uz: 'G\'oyangiز menga ROSTDAN ham yoqdi!', words: ['I', 'do', 'like', 'your', 'idea'], correct: ['I', 'do', 'like', 'your', 'idea'], explanation: "Ta'kid → do + V1 (do like). Mukammal yakun!" },
  ],
  rule: {
    title: 'Emphasis: do/does/did — to\'liq qoida',
    body: "Gapni kuchaytirib ta'kidlash usullari.\n\n❗ do/does/did + V1 — ijobiy gapni KUCHAYTIRISH:\n   • I DO like it! (rostdan ham)\n   • She DOES work hard.\n   • They DID come. (o'tmish)\n   ⚠️ Doim + V1 (asl shakl): do like, does work, did come\n\n🎯 It is/was ... that/who — CLEFT (aynan):\n   • It was John who broke it. (aynan John)\n   • It was yesterday that I saw her.\n\n💬 What ... is — CLEFT:\n   • What I need is rest. (kerak bo'lgan narsa — dam)\n\n🔑 The reason why ... is that ...:\n   • The reason why I left is that I was tired.\n\n💡 Bularning hammasi ma'lum bo'lakka urg'u beradi.",
  },
  summary: [
    "do/does/did + V1 — ijobiy ta'kid (I DO like)",
    "It is/was ... that/who — aynan (cleft)",
    "What ... is — ... narsa shuki (cleft)",
    "Hammasi + V1 asl shaklda (do like, did come)",
  ],
}

// ─── 11. Concession ─────────────────────────────────────────────────────────
const CONCESSION: DemoLesson = {
  id: 'concession-b1plus-demo',
  skill: 'Qarama-qarshilik — although, despite, however',
  level: 'B1+',
  emoji: '🔁',
  context: {
    text: "Tasavvur qiling — kutilmagan natijani aytyapsiz: \"Charchagan bo'lsam HAM, ishlashda davom etdim. Yomg'irga QARAMAY, sayrga chiqdik\". Ikki qarama-qarshi fikrni bog'lash. Keling, concession (qarama-qarshilik) bog'lovchilarini o'rganamiz!",
    location: 'Real vaziyat · Kutilmagan natija',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "although / even though + gap (... bo'lsa ham)",
      "despite / in spite of + ot/ing (... ga qaramay)",
      "however / nevertheless — alohida gap (lekin, shunga qaramay)",
      "Tuzilish farqi: although + gap, despite + ot",
    ],
  },
  examples: [
    { en: 'Although it was cold, we went out.',  uz: 'Sovuq bo\'lsa ham, biz sayrga chiqdik.', key: 'Although' },
    { en: 'Despite the rain, we played.',        uz: 'Yomg\'irga qaramay, o\'ynadik.',         key: 'Despite' },
    { en: 'It was hard. However, I finished.',   uz: 'Qiyin edi. Shunga qaramay, tugatdim.',   key: 'However' },
    { en: 'In spite of being tired, she worked.', uz: 'Charchagan bo\'lishiga qaramay, ishladi.', key: 'In spite of' },
  ],
  vocab: [
    { en: 'although', uz: '... bo\'lsa ham (+gap)', emoji: '🔀', example: 'although it rained' },
    { en: 'even though', uz: '... bo\'lsa ham (kuchli)', emoji: '💢', example: 'even though...' },
    { en: 'despite', uz: '... ga qaramay (+ot)', emoji: '🛡️', example: 'despite the cost' },
    { en: 'in spite of', uz: '... ga qaramay', emoji: '⛔', example: 'in spite of rain' },
    { en: 'however', uz: 'lekin (alohida gap)', emoji: '↪️', example: '...; however, ...' },
    { en: 'nevertheless', uz: 'shunga qaramay', emoji: '🔁', example: 'nevertheless, ...' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'although', uz: '... bo\'lsa ham (+gap)' }, { en: 'despite', uz: '... ga qaramay (+ot)' }, { en: 'however', uz: 'lekin (alohida gap)' }, { en: 'even though', uz: 'kuchli although' }], explanation: "Qarama-qarshilik bog'lovchilari." },
    { type: 'choose', sentence: '___ it was raining, we went for a walk.', options: ['Although', 'Despite', 'However'], correct: 'Although', uz: 'Yomg\'ir yog\'ayotgan bo\'lsa ham, sayrga chiqdik.', explanation: "+ GAP (it was raining) → Although." },
    { type: 'choose', sentence: '___ the rain, we went for a walk.', options: ['Despite', 'Although', 'However'], correct: 'Despite', uz: 'Yomg\'irga qaramay, sayrga chiqdik.', explanation: "+ OT (the rain) → Despite/In spite of." },
    { type: 'judge', sentence: 'Despite it was late, we continued.', isCorrect: false, explanation: "Noto'g'ri! Despite + ot/ing. Gap bilan → Although: 'Although it was late' yoki 'Despite being late'." },
    { type: 'build', uz: 'Charchagan bo\'lishimga qaramay, ishladim.', words: ['Despite', 'being', 'tired', 'I', 'worked'], correct: ['Despite', 'being', 'tired', 'I', 'worked'], explanation: "Despite + ing (being tired)." },
    { type: 'choose', sentence: 'The film was long. ___, it was interesting.', options: ['However', 'Although', 'Despite'], correct: 'However', uz: 'Film uzun edi. Shunga qaramay, qiziqarli edi.', explanation: "Alohida gap → However (vergullar bilan)." },
    { type: 'choose', sentence: '___ he had little money, he was happy.', options: ['Even though', 'Despite', 'However'], correct: 'Even though', uz: 'Puli kam bo\'lsa ham, u baxtli edi.', explanation: "+ GAP, kuchliroq → Even though." },
    { type: 'judge', sentence: 'In spite of the traffic, we arrived on time.', isCorrect: true, explanation: "To'g'ri! In spite of + ot (the traffic). Mukammal!" },
    { type: 'choose', sentence: 'She failed the test, ___ she had studied hard.', options: ['although', 'despite', 'however'], correct: 'although', uz: 'Qattiq o\'qigan bo\'lsa ham, u testdan yiqildi.', explanation: "+ GAP (she had studied) → although." },
    { type: 'build', uz: 'Yomg\'irga qaramay, o\'ynadik.', words: ['Despite', 'the', 'rain', 'we', 'played'], correct: ['Despite', 'the', 'rain', 'we', 'played'], explanation: "Despite + ot (the rain)." },
    { type: 'judge', sentence: 'Although tired, he kept going.', isCorrect: true, explanation: "To'g'ri! Although + (being) tired — qisqargan shakl ham bo'ladi. Mukammal!" },
    { type: 'choose', sentence: 'The plan was risky. ___, they decided to try.', options: ['Nevertheless', 'Although', 'Despite'], correct: 'Nevertheless', uz: 'Reja xavfli edi. Shunga qaramay, sinab ko\'rishga qaror qildilar.', explanation: "Alohida gap → Nevertheless." },
    { type: 'choose', sentence: '___ of his age, he is very active.', options: ['In spite', 'Although', 'However'], correct: 'In spite', uz: 'Yoshiga qaramay, u juda faol.', explanation: "In spite OF + ot (his age)." },
    { type: 'build', uz: 'Sovuq bo\'lsa ham, biz sayrga chiqdik.', words: ['Although', 'it', 'was', 'cold', 'we', 'went', 'out'], correct: ['Although', 'it', 'was', 'cold', 'we', 'went', 'out'], explanation: "Although + gap (it was cold). Mukammal yakun!" },
  ],
  rule: {
    title: 'Concession — to\'liq qoida',
    body: "Qarama-qarshilik — kutilmagan natija (... bo'lsa ham).\n\n🔀 although / even though + GAP (ega + fe'l):\n   • Although it was cold, we went out.\n   • Even though he tried, he failed.\n\n🛡️ despite / in spite of + OT yoki ING:\n   • Despite the rain, we played.\n   • In spite of being tired, she worked.\n   ⚠️ despite + that ✗ → despite the FACT that ✓\n\n↪️ however / nevertheless — ALOHIDA gap (urg'u):\n   • It was hard. However, I finished.\n   • (nuqta yoki nuqtali vergul + vergul bilan)\n\n📌 Asosiy farq:\n   • although + GAP · despite + OT\n   • Although it rained = Despite the rain",
  },
  summary: [
    "although / even though + gap (bo'lsa ham)",
    "despite / in spite of + ot/ing (ga qaramay)",
    "however / nevertheless — alohida gap",
    "although + gap ≠ despite + ot",
  ],
}

// ─── 12. Fronting ───────────────────────────────────────────────────────────
const FRONTING: DemoLesson = {
  id: 'fronting-b1plus-demo',
  skill: 'Fronting va inversiya — gap boshiga urg\'u',
  level: 'B1+',
  emoji: '🔝',
  context: {
    text: "Tasavvur qiling — dramatik ta'sir istaysiz: \"Men bunday narsani hech ko'rmaganman\" o'rniga \"HECH QACHON bunday narsani ko'rmaganman!\". Salbiy so'zni gap boshiga chiqarganda inversiya bo'ladi. Keling, fronting va inversiyani o'rganamiz!",
    location: 'Real vaziyat · Dramatik ta\'kid',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Salbiy ravishlar gap boshida → inversiya (yordamchi + ega)",
      "Never, Rarely, Hardly, No sooner, Not only...",
      "Never have I seen... (yordamchi egadan oldin)",
      "Rasmiy va dramatik uslubda ishlatiladi",
    ],
  },
  examples: [
    { en: 'Never have I seen such a mess.',      uz: 'Men hech qachon bunday tartibsizlikni ko\'rmaganman.', key: 'Never have I' },
    { en: 'Rarely do we get such a chance.',     uz: 'Biz bunday imkoniyatni kam olamiz.',      key: 'Rarely do we' },
    { en: 'No sooner had I left than it rained.', uz: 'Men chiqishim bilan yomg\'ir yog\'di.',    key: 'No sooner had' },
    { en: 'Not only is she clever, but kind too.', uz: 'U nafaqat aqlli, balki mehribon ham.',  key: 'Not only is' },
  ],
  vocab: [
    { en: 'Never + inv.', uz: 'hech qachon (boshda)', emoji: '🚫', example: 'Never have I...' },
    { en: 'Rarely/Seldom', uz: 'kamdan-kam',  emoji: '🔻', example: 'Rarely do they...' },
    { en: 'Hardly...when', uz: 'zo\'rg\'a ...da', emoji: '⏱️', example: 'Hardly had I...' },
    { en: 'No sooner...than', uz: '...ishi bilanoq', emoji: '⚡', example: 'No sooner had...' },
    { en: 'Not only...but', uz: 'nafaqat ... balki', emoji: '➕', example: 'Not only is...' },
    { en: 'inversion', uz: 'teskari tartib',  emoji: '🔄', example: 'subject-verb inversion' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'Never', uz: 'hech qachon' }, { en: 'Rarely', uz: 'kamdan-kam' }, { en: 'No sooner...than', uz: '...bilanoq' }, { en: 'Not only...but', uz: 'nafaqat...balki' }], explanation: "Inversiya so'zlari." },
    { type: 'choose', sentence: 'Never ___ I seen such beauty.', options: ['have', 'I have', 'did'], correct: 'have', uz: 'Men hech qachon bunday go\'zallikni ko\'rmaganman.', explanation: "Never (boshda) → inversiya: have + I (yordamchi egadan oldin)." },
    { type: 'choose', sentence: 'Rarely ___ we see such talent.', options: ['do', 'we do', 'are'], correct: 'do', uz: 'Biz bunday iste\'dodni kam ko\'ramiz.', explanation: "Rarely (boshda) → do + we (inversiya)." },
    { type: 'judge', sentence: 'Never I have been so happy.', isCorrect: false, explanation: "Noto'g'ri! Inversiya kerak: 'Never have I been so happy' (have + I)." },
    { type: 'build', uz: 'Men chiqishim bilan yomg\'ir yog\'di.', words: ['No', 'sooner', 'had', 'I', 'left', 'than', 'it', 'rained'], correct: ['No', 'sooner', 'had', 'I', 'left', 'than', 'it', 'rained'], explanation: "No sooner had + ega + V3 ... than ..." },
    { type: 'choose', sentence: 'Not only ___ she sing, but she also dances.', options: ['does', 'she does', 'is'], correct: 'does', uz: 'U nafaqat kuylaydi, balki raqsga ham tushadi.', explanation: "Not only (boshda) → does + she (inversiya)." },
    { type: 'choose', sentence: 'Hardly ___ I arrived when the show began.', options: ['had', 'I had', 'did'], correct: 'had', uz: 'Men zo\'rg\'a yetib keldim, shou boshlandi.', explanation: "Hardly (boshda) → had + I (inversiya)." },
    { type: 'judge', sentence: 'Seldom do we hear such good news.', isCorrect: true, explanation: "To'g'ri! Seldom (boshda) → do + we (inversiya). Mukammal!" },
    { type: 'choose', sentence: 'Little ___ he know what awaited him.', options: ['did', 'he did', 'does'], correct: 'did', uz: 'Uni nima kutayotganini u bilmasdi.', explanation: "Little (boshda) → did + he (inversiya)." },
    { type: 'build', uz: 'Men hech qachon bunday tartibsizlikni ko\'rmaganman.', words: ['Never', 'have', 'I', 'seen', 'such', 'a', 'mess'], correct: ['Never', 'have', 'I', 'seen', 'such', 'a', 'mess'], explanation: "Never + have + I + V3 (inversiya)." },
    { type: 'judge', sentence: 'No sooner had he arrived than he left.', isCorrect: true, explanation: "To'g'ri! No sooner had + ega + V3 ... than. Mukammal!" },
    { type: 'choose', sentence: 'Only after the meeting ___ I understand.', options: ['did', 'I did', 'do'], correct: 'did', uz: 'Faqat yig\'ilishdan keyin men tushundim.', explanation: "Only after (boshda) → did + I (inversiya)." },
    { type: 'choose', sentence: 'Not until midnight ___ they finish.', options: ['did', 'they did', 'do'], correct: 'did', uz: 'Faqat yarim tunda ular tugatdi.', explanation: "Not until (boshda) → did + they (inversiya)." },
    { type: 'build', uz: 'U nafaqat aqlli, balki mehribon ham.', words: ['Not', 'only', 'is', 'she', 'clever', 'but', 'also', 'kind'], correct: ['Not', 'only', 'is', 'she', 'clever', 'but', 'also', 'kind'], explanation: "Not only + is + she (inversiya) ... but also. Mukammal yakun!" },
  ],
  rule: {
    title: 'Fronting & Inversion — to\'liq qoida',
    body: "Salbiy/cheklovchi so'z gap boshida → INVERSIYA (savoldek tartib).\n\n🔝 Qoida: salbiy ravish + yordamchi + ega + ...\n   • Normal: I have never seen it.\n   • Inversiya: Never HAVE I seen it.\n\n🚫 Inversiyani keltiruvchi so'zlar:\n   • Never, Rarely, Seldom, Hardly, Little\n   • No sooner ... than: No sooner had I left than...\n   • Hardly/Scarcely ... when: Hardly had I sat when...\n   • Not only ... but also: Not only is she...\n   • Only after/when/then: Only then did I see...\n   • Not until: Not until later did he know.\n\n⭐ Ta'sir: rasmiy, dramatik, ta'kidli uslub.\n\n⚠️ Yordamchi fe'l ishlatiladi (do/does/did/have/be).",
  },
  summary: [
    "Salbiy so'z boshda → inversiya (yordamchi + ega)",
    "Never have I... · Rarely do we...",
    "No sooner had I... than · Not only is...",
    "Rasmiy, dramatik ta'kid uchun",
  ],
}

// ─── 13. Ellipsis & Substitution ────────────────────────────────────────────
const ELLIPSIS_SUBSTITUTION: DemoLesson = {
  id: 'ellipsis-substitution-b1plus-demo',
  skill: 'Ellipsis va o\'rin almashtirish — takrorni kamaytirish',
  level: 'B1+',
  emoji: '➖',
  context: {
    text: "Tasavvur qiling — tabiiy gapiryapsiz: \"Choy xohlaysanmi?\" — \"Ha, xohlayman (yes, I'd love TO)\". So'zni takrorlamasdan, qisqartirilgan javob. Keling, ellipsis va substitution (so/one/do)ni o'rganamiz!",
    location: 'Real vaziyat · Tabiiy suhbat',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Ellipsis — takror so'zni tushirib qoldirish (I can swim and she can too)",
      "so — gapni almashtiradi: I think so",
      "one/ones — otni almashtiradi: the red one",
      "do/did — fe'lni almashtiradi: He runs faster than I do",
    ],
  },
  examples: [
    { en: 'I can come, but she can\'t.',          uz: 'Men kela olaman, lekin u yo\'q.',         key: "she can't (∅)" },
    { en: '"Is it raining?" "I think so."',       uz: '"Yomg\'ir yog\'yaptimi?" "Shunday deb o\'ylayman."', key: 'so' },
    { en: 'I prefer the blue one.',               uz: 'Men ko\'kini afzal ko\'raman.',           key: 'one' },
    { en: 'She works harder than I do.',          uz: 'U mendan ko\'ra qattiqroq ishlaydi.',     key: 'do' },
  ],
  vocab: [
    { en: 'so',       uz: 'shunday (gap o\'rni)', emoji: '💬', example: 'I think so' },
    { en: 'one/ones', uz: 'biri/lari (ot o\'rni)', emoji: '🔵', example: 'the big one' },
    { en: 'do/does/did', uz: 'fe\'l o\'rni',   emoji: '🔄', example: 'I do too' },
    { en: 'neither/nor', uz: 'ham emas',       emoji: '🚫', example: 'neither do I' },
    { en: 'not',      uz: 'yo\'q (gap o\'rni)', emoji: '❌', example: 'I hope not' },
    { en: 'ellipsis', uz: 'tushirib qoldirish', emoji: '➖', example: 'omit repeated words' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'so', uz: 'shunday (gap o\'rni)' }, { en: 'one', uz: 'biri (ot o\'rni)' }, { en: 'do', uz: 'fe\'l o\'rni' }, { en: 'not', uz: 'yo\'q (gap o\'rni)' }], explanation: "O'rin almashtirish so'zlari." },
    { type: 'choose', sentence: '"Will it rain?" "I hope ___."', options: ['not', 'no', "don't"], correct: 'not', uz: '"Yomg\'ir yog\'adimi?" "Yo\'q deb umid qilaman."', explanation: "Salbiy gap o'rni → hope not." },
    { type: 'choose', sentence: 'I don\'t need a big bag, just a small ___.', options: ['one', 'it', 'so'], correct: 'one', uz: 'Menga katta sumka kerak emas, kichkinasi yetarli.', explanation: "Sanaladigan ot o'rni → one (a small one)." },
    { type: 'judge', sentence: '"Is she coming?" "I think yes."', isCorrect: false, explanation: "Noto'g'ri! Gap o'rni → so: 'I think so' (yes emas)." },
    { type: 'build', uz: 'Men kela olaman, lekin u yo\'q.', words: ['I', 'can', 'come', 'but', 'she', "can't"], correct: ['I', 'can', 'come', 'but', 'she', "can't"], explanation: "Ellipsis: she can't (come tushirildi)." },
    { type: 'choose', sentence: 'He earns more than I ___.', options: ['do', 'am', 'have'], correct: 'do', uz: 'U mendan ko\'ra ko\'proq pul topadi.', explanation: "Fe'l o'rni (earn) → do (than I do)." },
    { type: 'choose', sentence: 'These apples are fresh, but those ___ aren\'t.', options: ['ones', 'one', 'so'], correct: 'ones', uz: 'Bu olmalar yangi, lekin anavilari yo\'q.', explanation: "Ko'plik ot o'rni → ones (those ones)." },
    { type: 'judge', sentence: '"Do you like it?" "Yes, I do."', isCorrect: true, explanation: "To'g'ri! Fe'l o'rni → do (like tushirildi). Mukammal!" },
    { type: 'choose', sentence: '"Are they ready?" "I believe ___."', options: ['so', 'it', 'yes'], correct: 'so', uz: '"Ular tayyormi?" "Shunday deb o\'ylayman."', explanation: "Gap o'rni → believe so." },
    { type: 'build', uz: 'Men ko\'kini afzal ko\'raman.', words: ['I', 'prefer', 'the', 'blue', 'one'], correct: ['I', 'prefer', 'the', 'blue', 'one'], explanation: "Ot o'rni → the blue one." },
    { type: 'judge', sentence: 'She likes coffee and so do I.', isCorrect: true, explanation: "To'g'ri! so do I — ham (substitution + inversiya). Mukammal!" },
    { type: 'choose', sentence: 'I haven\'t finished, and ___ has she.', options: ['neither', 'so', 'either'], correct: 'neither', uz: 'Men tugatmadim, u ham yo\'q.', explanation: "Inkorga → neither has she." },
    { type: 'choose', sentence: 'I wanted to call you but I forgot ___.', options: ['to', 'so', 'it'], correct: 'to', uz: 'Sizga qo\'ng\'iroq qilmoqchi edim, lekin unutdim.', explanation: "Infinitiv ellipsis → forgot to (call tushirildi)." },
    { type: 'build', uz: '"Yomg\'ir yog\'yaptimi?" "Shunday deb o\'ylayman."', words: ['I', 'think', 'so'], correct: ['I', 'think', 'so'], explanation: "Gap o'rni → think so. Mukammal yakun!" },
  ],
  rule: {
    title: 'Ellipsis & Substitution — to\'liq qoida',
    body: "Takrorni kamaytirish — so'zni tushirish yoki almashtirish.\n\n➖ Ellipsis — takror so'zni TUSHIRISH:\n   • I can swim and she can (swim) too.\n   • I wanted to go but I forgot to (go).\n\n💬 so / not — GAP o'rni:\n   • \"Is it true?\" \"I think so / I hope not.\"\n   • (think, hope, believe, suppose, guess bilan)\n\n🔵 one / ones — OT o'rni:\n   • the red one · the big ones\n   • (sanaladigan ot; sanalmaydigan bilan emas!)\n\n🔄 do/does/did — FE'L o'rni:\n   • He runs faster than I do.\n   • \"Do you like it?\" \"Yes, I do.\"\n\n🚫 so/neither + inversiya — qisqa rozilik:\n   • So do I · Neither do I",
  },
  summary: [
    "Ellipsis — takror so'zni tushirish (she can too)",
    "so/not — gap o'rni (I think so)",
    "one/ones — ot o'rni (the red one)",
    "do/did — fe'l o'rni (than I do)",
  ],
}

// ─── 14. Linking Words (Advanced) ───────────────────────────────────────────
const LINKING_WORDS_ADVANCED: DemoLesson = {
  id: 'linking-words-advanced-b1plus-demo',
  skill: 'Murakkab bog\'lovchilar — sabab, natija, qo\'shimcha',
  level: 'B1+',
  emoji: '🔗',
  context: {
    text: "Tasavvur qiling — insho yozyapsiz va fikrlarni silliq bog'laysiz: \"Yomg'ir yog'di; SHU SABABLI o'yin bekor qilindi. BUNDAN TASHQARI, sovuq ham edi\". Murakkab bog'lovchilar yozuvni professional qiladi. Keling, ularni o'rganamiz!",
    location: 'Real vaziyat · Insho yozish',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Sabab: due to, owing to, because of (+ ot)",
      "Natija: therefore, thus, consequently, as a result",
      "Qo'shimcha: moreover, furthermore, in addition",
      "Qarama-qarshilik: on the other hand, whereas, while",
    ],
  },
  examples: [
    { en: 'It rained; therefore, we stayed in.', uz: 'Yomg\'ir yog\'di; shu sababli uyda qoldik.', key: 'therefore' },
    { en: 'The game was cancelled due to rain.', uz: 'O\'yin yomg\'ir tufayli bekor qilindi.',   key: 'due to' },
    { en: "It's cheap; moreover, it's reliable.", uz: 'U arzon; bundan tashqari, ishonchli.',     key: 'moreover' },
    { en: 'He likes tea, whereas I prefer coffee.', uz: 'U choy yoqtiradi, men esa qahva.',      key: 'whereas' },
  ],
  vocab: [
    { en: 'due to / owing to', uz: '... tufayli (+ot)', emoji: '⬅️', example: 'due to the rain' },
    { en: 'therefore / thus', uz: 'shu sababli', emoji: '➡️', example: 'therefore, we left' },
    { en: 'consequently', uz: 'natijada',     emoji: '🎯', example: 'consequently, ...' },
    { en: 'moreover / furthermore', uz: 'bundan tashqari', emoji: '➕', example: 'moreover, ...' },
    { en: 'whereas / while', uz: '... esa',   emoji: '🔀', example: 'whereas I think...' },
    { en: 'nonetheless', uz: 'shunga qaramay', emoji: '🔁', example: 'nonetheless, ...' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'due to', uz: '... tufayli' }, { en: 'therefore', uz: 'shu sababli' }, { en: 'moreover', uz: 'bundan tashqari' }, { en: 'whereas', uz: '... esa' }], explanation: "Murakkab bog'lovchilar." },
    { type: 'choose', sentence: 'The flight was delayed ___ the storm.', options: ['due to', 'therefore', 'whereas'], correct: 'due to', uz: 'Reys bo\'ron tufayli kechikdi.', explanation: "Sabab + OT (the storm) → due to." },
    { type: 'choose', sentence: 'It was raining; ___, we cancelled the trip.', options: ['therefore', 'due to', 'whereas'], correct: 'therefore', uz: 'Yomg\'ir yog\'ayotgan edi; shu sababli, sayohatni bekor qildik.', explanation: "Natija → therefore (alohida gap)." },
    { type: 'judge', sentence: 'We stayed home because of it was raining.', isCorrect: false, explanation: "Noto'g'ri! because of + ot. Gap bilan → because: 'because it was raining'." },
    { type: 'build', uz: 'U arzon; bundan tashqari, ishonchli.', words: ['It', 'is', 'cheap', 'moreover', 'it', 'is', 'reliable'], correct: ['It', 'is', 'cheap', 'moreover', 'it', 'is', 'reliable'], explanation: "Qo'shimcha fikr → moreover." },
    { type: 'choose', sentence: 'He works hard; ___, he rarely gets promoted.', options: ['nevertheless', 'therefore', 'moreover'], correct: 'nevertheless', uz: 'U qattiq ishlaydi; shunga qaramay, kam ko\'tariladi.', explanation: "Qarama-qarshilik → nevertheless." },
    { type: 'choose', sentence: 'Sales fell sharply. ___, profits dropped.', options: ['Consequently', 'Whereas', 'Moreover'], correct: 'Consequently', uz: 'Savdo keskin tushdi. Natijada, foyda kamaydi.', explanation: "Natija → Consequently." },
    { type: 'judge', sentence: 'She is tall, whereas her brother is short.', isCorrect: true, explanation: "To'g'ri! Taqqoslash/qarama-qarshilik → whereas. Mukammal!" },
    { type: 'choose', sentence: 'The hotel is modern. ___, it is well-located.', options: ['Furthermore', 'Due to', 'Whereas'], correct: 'Furthermore', uz: 'Mehmonxona zamonaviy. Bundan tashqari, joylashuvi qulay.', explanation: "Qo'shimcha → Furthermore." },
    { type: 'build', uz: 'Yomg\'ir yog\'di; shu sababli uyda qoldik.', words: ['It', 'rained', 'therefore', 'we', 'stayed', 'in'], correct: ['It', 'rained', 'therefore', 'we', 'stayed', 'in'], explanation: "Natija → therefore." },
    { type: 'judge', sentence: 'Owing to the strike, trains were cancelled.', isCorrect: true, explanation: "To'g'ri! Sabab + ot (the strike) → owing to. Mukammal!" },
    { type: 'choose', sentence: 'Some prefer cities, ___ others like the countryside.', options: ['while', 'due to', 'therefore'], correct: 'while', uz: 'Ba\'zilar shaharni afzal ko\'radi, boshqalar esa qishloqni.', explanation: "Qarama-qarshilik → while." },
    { type: 'choose', sentence: 'The project failed ___ poor planning.', options: ['owing to', 'therefore', 'whereas'], correct: 'owing to', uz: 'Loyiha yomon rejalashtirish tufayli barbod bo\'ldi.', explanation: "Sabab + ot → owing to." },
    { type: 'build', uz: 'U choy yoqtiradi, men esa qahva.', words: ['He', 'likes', 'tea', 'whereas', 'I', 'prefer', 'coffee'], correct: ['He', 'likes', 'tea', 'whereas', 'I', 'prefer', 'coffee'], explanation: "Taqqoslash → whereas. Mukammal yakun!" },
  ],
  rule: {
    title: 'Linking Words (Advanced) — to\'liq qoida',
    body: "Fikrlarni professional bog'lash.\n\n⬅️ SABAB (+ OT):\n   • due to / owing to / because of + ot\n   • due to the rain (because of emas — ot bilan)\n\n➡️ NATIJA (alohida gap):\n   • therefore, thus, consequently, as a result\n   • It rained; therefore, we left.\n\n➕ QO'SHIMCHA:\n   • moreover, furthermore, in addition, besides\n   • It's cheap; moreover, it's good.\n\n🔀 QARAMA-QARSHILIK:\n   • however, nevertheless, nonetheless (alohida gap)\n   • whereas, while (ikki fikrni taqqoslash)\n   • on the other hand\n\n⚠️ due to/because of + OT · because + GAP",
  },
  summary: [
    "Sabab: due to/owing to + ot",
    "Natija: therefore, consequently, thus",
    "Qo'shimcha: moreover, furthermore, in addition",
    "Qarama-qarshilik: whereas, while, nevertheless",
  ],
}

// ─── 15. Determiners (Advanced) ─────────────────────────────────────────────
const DETERMINERS_ADVANCED: DemoLesson = {
  id: 'determiners-advanced-b1plus-demo',
  skill: 'Murakkab aniqlovchilar — all, whole, each, every, none',
  level: 'B1+',
  emoji: '🎯',
  context: {
    text: "Tasavvur qiling — aniq miqdor ifodalayapsiz: \"BUTUN kun ishladim, HAR BIR vazifani bajardim, lekin HECH BIRი oson emas edi\". Aniqlovchilarning nozik farqlari muhim. Keling, murakkab aniqlovchilarni o'rganamiz!",
    location: 'Real vaziyat · Aniq miqdor',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "all / whole — butun (all the day vs the whole day)",
      "each / every — har biri (each — alohida, every — umumiy)",
      "none / no — hech biri (none of + ot vs no + ot)",
      "both / all / most + of the bilan ishlatish",
    ],
  },
  examples: [
    { en: 'I worked the whole day.',             uz: 'Men butun kun ishladim.',                 key: 'whole' },
    { en: 'Each student has a desk.',            uz: 'Har bir talaba stolga ega.',              key: 'Each' },
    { en: 'None of the answers were right.',     uz: 'Javoblarning hech biri to\'g\'ri emas edi.', key: 'None of' },
    { en: 'Every child needs love.',             uz: 'Har bir bola muhabbat talab qiladi.',     key: 'Every' },
  ],
  vocab: [
    { en: 'all the',  uz: 'butun/barcha',     emoji: '🌐', example: 'all the time' },
    { en: 'the whole', uz: 'butun (yagona)',  emoji: '⭕', example: 'the whole day' },
    { en: 'each',     uz: 'har biri (alohida)', emoji: '☝️', example: 'each one' },
    { en: 'every',    uz: 'har bir (umumiy)', emoji: '🔢', example: 'every day' },
    { en: 'none of',  uz: 'hech biri',        emoji: '🚫', example: 'none of them' },
    { en: 'no',       uz: 'hech (ot oldidan)', emoji: '❌', example: 'no money' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'the whole', uz: 'butun (yagona)' }, { en: 'each', uz: 'har biri (alohida)' }, { en: 'every', uz: 'har bir (umumiy)' }, { en: 'none of', uz: 'hech biri' }], explanation: "Murakkab aniqlovchilar." },
    { type: 'choose', sentence: 'I spent the ___ weekend studying.', options: ['whole', 'all', 'every'], correct: 'whole', uz: 'Men butun hafta oxirini o\'qib o\'tkazdim.', explanation: "the whole + ot (the whole weekend) = all the weekend." },
    { type: 'choose', sentence: '___ student received a certificate.', options: ['Each', 'All', 'None'], correct: 'Each', uz: 'Har bir talaba sertifikat oldi.', explanation: "Alohida har biri → Each + birlik ot (student)." },
    { type: 'judge', sentence: 'None of the students was late. (formal)', isCorrect: true, explanation: "To'g'ri! none of + ot, rasmiy uslubda birlik fe'l (was). Mukammal!" },
    { type: 'build', uz: 'Javoblarning hech biri to\'g\'ri emas edi.', words: ['None', 'of', 'the', 'answers', 'were', 'right'], correct: ['None', 'of', 'the', 'answers', 'were', 'right'], explanation: "None of the + ot (hech biri)." },
    { type: 'choose', sentence: '___ child in the class passed.', options: ['Every', 'Each of', 'All'], correct: 'Every', uz: 'Sinfdagi har bir bola o\'tdi.', explanation: "Umumiy (hammasi) → Every + birlik ot." },
    { type: 'choose', sentence: 'There was ___ milk left in the fridge.', options: ['no', 'none', 'not'], correct: 'no', uz: 'Sovutgichda hech sut qolmagan edi.', explanation: "no + ot (no milk) = not any milk." },
    { type: 'judge', sentence: 'All the students has finished.', isCorrect: false, explanation: "Noto'g'ri! all the + ko'plik → ko'plik fe'l: 'All the students HAVE finished'." },
    { type: 'choose', sentence: '___ of the two options is acceptable.', options: ['Each', 'Every', 'All'], correct: 'Each', uz: 'Ikki variantdan har biri maqbul.', explanation: "Ikki narsa uchun → each (every emas, every 3+ uchun)." },
    { type: 'build', uz: 'Men butun kun ishladim.', words: ['I', 'worked', 'the', 'whole', 'day'], correct: ['I', 'worked', 'the', 'whole', 'day'], explanation: "the whole + ot (the whole day)." },
    { type: 'judge', sentence: 'Every of the rooms is clean.', isCorrect: false, explanation: "Noto'g'ri! every + ot (of yo'q): 'Every room is clean' yoki 'Each of the rooms'." },
    { type: 'choose', sentence: 'Most ___ the people agreed.', options: ['of', 'the', 'in'], correct: 'of', uz: 'Odamlarning ko\'pchiligi rozi bo\'ldi.', explanation: "Most of the + ot." },
    { type: 'choose', sentence: '___ the information was useful.', options: ['All', 'Every', 'Each'], correct: 'All', uz: 'Barcha ma\'lumot foydali edi.', explanation: "Sanalmaydigan (information) → All (every/each emas)." },
    { type: 'build', uz: 'Har bir bola muhabbat talab qiladi.', words: ['Every', 'child', 'needs', 'love'], correct: ['Every', 'child', 'needs', 'love'], explanation: "Every + birlik ot + birlik fe'l (needs). Mukammal yakun!" },
  ],
  rule: {
    title: 'Determiners (Advanced) — to\'liq qoida',
    body: "Aniqlovchilarning nozik farqlari.\n\n🌐 all vs whole:\n   • all the + ot: all the day\n   • the whole + ot: the whole day (yagona, ta'kid)\n   • all + sanalmaydigan: all information\n\n☝️ each vs every:\n   • each — ALOHIDA har biri (2+ uchun, ko'pincha 2):\n     Each of the two... · each student\n   • every — UMUMIY hammasi (3+): every day\n   • ikkalasi + BIRLIK ot + BIRLIK fe'l\n\n🚫 none vs no:\n   • none of + the + ot: None of them came.\n   • no + ot (the yo'q): No students came.\n\n📊 of the bilan: both of, all of, most of, none of\n   • all of the / most of the / none of the students",
  },
  summary: [
    "all the day = the whole day (butun)",
    "each — alohida (2+) · every — umumiy (3+)",
    "none of + ot · no + ot (the yo'q)",
    "Most of / all of / none of the + ot",
  ],
}

// ─── 16. Reporting Verbs ────────────────────────────────────────────────────
const REPORTING_VERBS: DemoLesson = {
  id: 'reporting-verbs-b1plus-demo',
  skill: 'Xabar fe\'llari — suggest, admit, refuse, offer',
  level: 'B1+',
  emoji: '🗨️',
  context: {
    text: "Tasavvur qiling — kimningdir so'zini aniqroq yetkazyapsiz: \"U xato qilganini TAN OLdi... Yordam berishni TAKLIF qildi... Borishni RAD etdi\". say/tell o'rniga aniq fe'llar nutqni boyitadi. Keling, reporting verbs (xabar fe'llari)ni o'rganamiz!",
    location: 'Real vaziyat · Aniq xabar',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Har xil fe'l har xil tuzilma talab qiladi",
      "+ to V1: offer, refuse, promise, agree (offered to help)",
      "+ ing: suggest, admit, deny, recommend (admitted stealing)",
      "+ odam + to V1: advise, warn, remind, encourage",
    ],
  },
  examples: [
    { en: 'He offered to help me.',               uz: 'U menga yordam berishni taklif qildi.',  key: 'offered to' },
    { en: 'She admitted breaking the vase.',       uz: 'U vazani sindirganini tan oldi.',        key: 'admitted breaking' },
    { en: 'They advised me to wait.',              uz: 'Ular menga kutishni maslahat berdi.',    key: 'advised me to' },
    { en: 'He refused to apologise.',              uz: 'U uzr so\'rashni rad etdi.',             key: 'refused to' },
  ],
  vocab: [
    { en: 'offer/refuse + to', uz: 'taklif/rad (+to)', emoji: '🤝', example: 'offered to pay' },
    { en: 'suggest/admit + ing', uz: 'taklif/tan (+ing)', emoji: '💭', example: 'suggested going' },
    { en: 'advise/warn sb + to', uz: 'maslahat (+odam+to)', emoji: '⚠️', example: 'warned me to stop' },
    { en: 'accuse sb of + ing', uz: 'ayblamoq (+of+ing)', emoji: '👉', example: 'accused him of lying' },
    { en: 'apologise for + ing', uz: 'uzr (+for+ing)', emoji: '🙏', example: 'apologised for being late' },
    { en: 'insist on + ing', uz: 'turib olmoq (+on+ing)', emoji: '✊', example: 'insisted on paying' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'offer + to', uz: 'taklif (+to)' }, { en: 'admit + ing', uz: 'tan olmoq (+ing)' }, { en: 'advise sb + to', uz: 'maslahat (+odam+to)' }, { en: 'accuse of + ing', uz: 'ayblamoq (+of+ing)' }], explanation: "Xabar fe'llari tuzilmasi." },
    { type: 'choose', sentence: 'He offered ___ me with my bags.', options: ['to help', 'helping', 'help'], correct: 'to help', uz: 'U menga sumkalarimda yordam berishni taklif qildi.', explanation: "offer + to + V1 (to help)." },
    { type: 'choose', sentence: 'She admitted ___ the money.', options: ['taking', 'to take', 'take'], correct: 'taking', uz: 'U pulni olganini tan oldi.', explanation: "admit + ing (taking)." },
    { type: 'judge', sentence: 'They suggested to go to the cinema.', isCorrect: false, explanation: "Noto'g'ri! suggest + ing: 'They suggested going to the cinema'." },
    { type: 'build', uz: 'Ular menga kutishni maslahat berdi.', words: ['They', 'advised', 'me', 'to', 'wait'], correct: ['They', 'advised', 'me', 'to', 'wait'], explanation: "advise + odam + to + V1 (me to wait)." },
    { type: 'choose', sentence: 'He refused ___ his mistake.', options: ['to admit', 'admitting', 'admit'], correct: 'to admit', uz: 'U xatosini tan olishni rad etdi.', explanation: "refuse + to + V1 (to admit)." },
    { type: 'choose', sentence: 'She accused him ___ lying.', options: ['of', 'to', 'for'], correct: 'of', uz: 'U uni yolg\'on gapirishda aybladi.', explanation: "accuse + odam + OF + ing (of lying)." },
    { type: 'judge', sentence: 'He apologised for being late.', isCorrect: true, explanation: "To'g'ri! apologise + FOR + ing (for being late). Mukammal!" },
    { type: 'choose', sentence: 'The doctor warned me ___ smoking.', options: ['to stop', 'stopping', 'stop'], correct: 'to stop', uz: 'Shifokor menga chekishni to\'xtatishni ogohlantirdi.', explanation: "warn + odam + to + V1 (to stop)." },
    { type: 'build', uz: 'U vazani sindirganini tan oldi.', words: ['She', 'admitted', 'breaking', 'the', 'vase'], correct: ['She', 'admitted', 'breaking', 'the', 'vase'], explanation: "admit + ing (breaking)." },
    { type: 'judge', sentence: 'He insisted on paying the bill.', isCorrect: true, explanation: "To'g'ri! insist + ON + ing (on paying). Mukammal!" },
    { type: 'choose', sentence: 'They denied ___ anything wrong.', options: ['doing', 'to do', 'do'], correct: 'doing', uz: 'Ular biror yomon ish qilganini inkor etdi.', explanation: "deny + ing (doing)." },
    { type: 'choose', sentence: 'She reminded me ___ the door.', options: ['to lock', 'locking', 'lock'], correct: 'to lock', uz: 'U menga eshikni qulflashni eslatdi.', explanation: "remind + odam + to + V1 (to lock)." },
    { type: 'build', uz: 'U uzr so\'rashni rad etdi.', words: ['He', 'refused', 'to', 'apologise'], correct: ['He', 'refused', 'to', 'apologise'], explanation: "refuse + to + V1 (to apologise). Mukammal yakun!" },
  ],
  rule: {
    title: 'Reporting Verbs — to\'liq qoida',
    body: "say/tell o'rniga aniq fe'llar — har biri o'z tuzilmasi bilan.\n\n🤝 + to + V1:\n   offer, refuse, promise, agree, threaten, decide\n   • He offered to help. · She refused to go.\n\n💭 + ing:\n   suggest, admit, deny, recommend, mention\n   • He admitted stealing. · I suggest going.\n\n⚠️ + odam + to + V1:\n   advise, warn, remind, encourage, persuade, tell\n   • She advised me to wait.\n\n👉 + odam + of/for + ing (predlog bilan):\n   • accuse sb OF + ing: accused him of lying\n   • apologise FOR + ing: apologised for being late\n   • insist ON + ing: insisted on paying\n   • blame sb FOR · congratulate sb ON",
  },
  summary: [
    "+ to V1: offer, refuse, promise, agree",
    "+ ing: suggest, admit, deny, recommend",
    "+ odam + to: advise, warn, remind, tell",
    "+ predlog + ing: accuse of, apologise for, insist on",
  ],
}

// ─── 17. Word Formation ─────────────────────────────────────────────────────
const WORD_FORMATION: DemoLesson = {
  id: 'word-formation-b1plus-demo',
  skill: 'So\'z yasash — prefiks va suffikslar',
  level: 'B1+',
  emoji: '🧱',
  context: {
    text: "Tasavvur qiling — bitta o'zakdan ko'p so'z yasaysiz: care → careFUL → careLESS → careFULLY. Prefiks va suffikslar so'z boyligini keskin oshiradi. Keling, so'z yasashni o'rganamiz!",
    location: 'Real vaziyat · So\'z boyligi',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Suffiks: ot yasash (-ness, -tion, -ment, -ity)",
      "Suffiks: sifat yasash (-ful, -less, -able, -ive)",
      "Prefiks: inkor (un-, in-, im-, dis-, ir-)",
      "Bir o'zakdan turli so'z turkumlari (care/careful/carefully)",
    ],
  },
  examples: [
    { en: 'happy → happiness (noun)',            uz: 'baxtli → baxt (ot)',                     key: '-ness' },
    { en: 'care → careful → careless',           uz: 'g\'amxo\'rlik → ehtiyotkor → beparvo',   key: '-ful/-less' },
    { en: 'possible → impossible',               uz: 'mumkin → mumkin emas',                   key: 'im-' },
    { en: 'decide → decision (noun)',            uz: 'qaror qilmoq → qaror (ot)',              key: '-sion' },
  ],
  vocab: [
    { en: '-ness/-ity', uz: 'ot yasaydi',     emoji: '📦', example: 'kindness, ability' },
    { en: '-tion/-ment', uz: 'ot yasaydi',    emoji: '🏷️', example: 'action, payment' },
    { en: '-ful/-less', uz: 'sifat (bilan/siz)', emoji: '🎨', example: 'useful, useless' },
    { en: '-able/-ive', uz: 'sifat yasaydi',  emoji: '✨', example: 'comfortable, active' },
    { en: 'un-/in-/im-', uz: 'inkor prefiksi', emoji: '🚫', example: 'unhappy, impossible' },
    { en: 'dis-/ir-', uz: 'inkor prefiksi',   emoji: '❌', example: 'disagree, irregular' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: '-ness', uz: 'ot yasaydi' }, { en: '-ful', uz: 'sifat (bilan)' }, { en: '-less', uz: 'sifat (siz)' }, { en: 'un-', uz: 'inkor prefiksi' }], explanation: "So'z yasash qo'shimchalari." },
    { type: 'choose', sentence: 'She showed great ___ (kind).', options: ['kindness', 'kindful', 'kindly'], correct: 'kindness', uz: 'U katta mehribonlik ko\'rsatdi.', explanation: "kind + ness = kindness (ot)." },
    { type: 'choose', sentence: 'Be ___! The floor is wet. (care)', options: ['careful', 'careless', 'carefully'], correct: 'careful', uz: 'Ehtiyot bo\'l! Pol ho\'l. (sifat)', explanation: "care + ful = careful (sifat — ehtiyotkor)." },
    { type: 'judge', sentence: 'It is unpossible to finish today.', isCorrect: false, explanation: "Noto'g'ri! possible → IMpossible (un- emas, im- p oldidan)." },
    { type: 'build', uz: 'Bu xato beparvolik tufayli sodir bo\'ldi.', words: ['It', 'happened', 'due', 'to', 'carelessness'], correct: ['It', 'happened', 'due', 'to', 'carelessness'], explanation: "care + less + ness = carelessness (beparvolik, ot)." },
    { type: 'choose', sentence: 'They reached an important ___ (decide).', options: ['decision', 'decisive', 'decidement'], correct: 'decision', uz: 'Ular muhim qarorga keldilar.', explanation: "decide → decision (ot, -sion)." },
    { type: 'choose', sentence: 'This sofa is very ___ (comfort).', options: ['comfortable', 'comfortful', 'comforted'], correct: 'comfortable', uz: 'Bu divan juda qulay.', explanation: "comfort + able = comfortable (sifat)." },
    { type: 'judge', sentence: 'He behaved in a very childish way.', isCorrect: true, explanation: "To'g'ri! child + ish = childish (bolalarcha, sifat). Mukammal!" },
    { type: 'choose', sentence: 'I completely ___ with you. (agree)', options: ['disagree', 'unagree', 'misagree'], correct: 'disagree', uz: 'Men siz bilan butunlay rozi emasman.', explanation: "agree → disagree (inkor, dis-)." },
    { type: 'build', uz: 'Uning rejasi muvaffaqiyatli bo\'ldi.', words: ['His', 'plan', 'was', 'successful'], correct: ['His', 'plan', 'was', 'successful'], explanation: "success + ful = successful (sifat)." },
    { type: 'judge', sentence: 'The instructions were unclear and irregular.', isCorrect: true, explanation: "To'g'ri! un- (unclear) va ir- (irregular, r oldidan). Mukammal!" },
    { type: 'choose', sentence: 'Her ___ to learn is amazing. (able)', options: ['ability', 'ableness', 'ablement'], correct: 'ability', uz: 'Uning o\'rganish qobiliyati ajoyib.', explanation: "able → ability (ot, -ity)." },
    { type: 'choose', sentence: 'The medicine had no ___ effect. (harm)', options: ['harmful', 'harmless', 'harmness'], correct: 'harmful', uz: 'Dori zararli ta\'sir ko\'rsatmadi.', explanation: "harm + ful = harmful (zararli, sifat)." },
    { type: 'build', uz: 'baxtli → baxt (ot).', words: ['happy', 'becomes', 'happiness'], correct: ['happy', 'becomes', 'happiness'], explanation: "happy → happiness (y→i+ness, ot). Mukammal yakun!" },
  ],
  rule: {
    title: 'Word Formation — to\'liq qoida',
    body: "Prefiks va suffikslar bilan yangi so'z yasash.\n\n📦 OT yasaydigan suffikslar:\n   • -ness: kind → kindness\n   • -tion/-sion: act → action, decide → decision\n   • -ment: pay → payment\n   • -ity: able → ability\n\n🎨 SIFAT yasaydigan suffikslar:\n   • -ful (bilan): careful, useful\n   • -less (siz): careless, useless\n   • -able/-ible: comfortable, possible\n   • -ive: active, creative\n\n🚫 INKOR prefikslari:\n   • un-: unhappy, unable\n   • in-/im-/il-/ir-: incorrect, impossible, illegal, irregular\n   • dis-: disagree, dishonest\n\n💡 Bir o'zak: care → careful → carefully → carelessness",
  },
  summary: [
    "Ot: -ness, -tion, -ment, -ity",
    "Sifat: -ful (bilan), -less (siz), -able, -ive",
    "Inkor: un-, in-/im-/ir-, dis-",
    "care → careful → carefully → carelessness",
  ],
}

// ─── 18. Collocations & Idioms ──────────────────────────────────────────────
const COLLOCATIONS_IDIOMS: DemoLesson = {
  id: 'collocations-idioms-b1plus-demo',
  skill: 'Kollokatsiya va idiomalar — tabiiy so\'z birikmalari',
  level: 'B1+',
  emoji: '🎲',
  context: {
    text: "Tasavvur qiling — tabiiy gapirmoqchisiz: \"qaror QABUL QILMOQ\" (make a decision), \"e'tibor BERMOQ\" (pay attention). Inglizcha so'zlar ma'lum juftliklar bilan keladi. Keling, kollokatsiya va idiomalarni o'rganamiz!",
    location: 'Real vaziyat · Tabiiy nutq',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Kollokatsiya — tabiiy so'z juftligi (make a mistake, NOT do a mistake)",
      "Idioma — alohida so'zlardan kelib chiqmaydigan ibora",
      "make/do farqi: make a decision, do homework",
      "Keng tarqalgan idiomalar: piece of cake, break the ice",
    ],
  },
  examples: [
    { en: 'make a decision',                     uz: 'qaror qabul qilmoq',                     key: 'make' },
    { en: 'pay attention',                       uz: 'e\'tibor bermoq',                        key: 'pay attention' },
    { en: "It's a piece of cake.",               uz: 'Bu juda oson (suvdek).',                 key: 'piece of cake' },
    { en: 'break the ice',                       uz: 'muzni sindirmoq (suhbat boshlamoq)',     key: 'break the ice' },
  ],
  vocab: [
    { en: 'make a decision', uz: 'qaror qilmoq', emoji: '✅', example: 'make a choice' },
    { en: 'pay attention', uz: 'e\'tibor bermoq', emoji: '👀', example: 'pay a visit' },
    { en: 'take a risk', uz: 'tavakkal qilmoq', emoji: '🎲', example: 'take a break' },
    { en: 'piece of cake', uz: 'juda oson',   emoji: '🍰', example: "it's easy" },
    { en: 'break the ice', uz: 'muloqotni boshlamoq', emoji: '🧊', example: 'start talking' },
    { en: 'cost an arm and a leg', uz: 'juda qimmat', emoji: '💸', example: 'very expensive' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'make a decision', uz: 'qaror qilmoq' }, { en: 'pay attention', uz: 'e\'tibor bermoq' }, { en: 'piece of cake', uz: 'juda oson' }, { en: 'break the ice', uz: 'suhbat boshlamoq' }], explanation: "Kollokatsiya va idiomalar." },
    { type: 'choose', sentence: 'You need to ___ a decision soon.', options: ['make', 'do', 'take'], correct: 'make', uz: 'Tez orada qaror qabul qilishingiz kerak.', explanation: "make a decision (do a decision EMAS)." },
    { type: 'choose', sentence: 'Please ___ attention to the road.', options: ['pay', 'make', 'do'], correct: 'pay', uz: 'Iltimos, yo\'lga e\'tibor bering.', explanation: "pay attention (kollokatsiya)." },
    { type: 'judge', sentence: 'I did a mistake in the test.', isCorrect: false, explanation: "Noto'g'ri! make a mistake (do EMAS): 'I made a mistake'." },
    { type: 'build', uz: 'Keling, tavakkal qilaylik.', words: ["Let's", 'take', 'a', 'risk'], correct: ["Let's", 'take', 'a', 'risk'], explanation: "take a risk (kollokatsiya)." },
    { type: 'choose', sentence: 'The exam was easy — a piece of ___.', options: ['cake', 'bread', 'pie'], correct: 'cake', uz: 'Imtihon oson edi — suvdek.', explanation: "Idioma: a piece of cake (juda oson)." },
    { type: 'choose', sentence: 'He told a joke to ___ the ice.', options: ['break', 'cut', 'make'], correct: 'break', uz: 'U muloqotni boshlash uchun hazil aytdi.', explanation: "Idioma: break the ice." },
    { type: 'judge', sentence: 'She made her homework before dinner.', isCorrect: false, explanation: "Noto'g'ri! do homework (make EMAS): 'She did her homework'." },
    { type: 'choose', sentence: 'That car costs an arm and a ___.', options: ['leg', 'hand', 'foot'], correct: 'leg', uz: 'U mashina juda qimmat.', explanation: "Idioma: cost an arm and a leg (juda qimmat)." },
    { type: 'build', uz: 'Iltimos, e\'tibor bering.', words: ['Please', 'pay', 'attention'], correct: ['Please', 'pay', 'attention'], explanation: "pay attention (kollokatsiya)." },
    { type: 'judge', sentence: "Let's take a break for ten minutes.", isCorrect: true, explanation: "To'g'ri! take a break (tanaffus qilmoq). Mukammal!" },
    { type: 'choose', sentence: 'I need to ___ some research first.', options: ['do', 'make', 'take'], correct: 'do', uz: 'Avval biroz tadqiqot o\'tkazishim kerak.', explanation: "do research (make EMAS)." },
    { type: 'choose', sentence: 'Stop pulling my ___ — be serious!', options: ['leg', 'arm', 'hand'], correct: 'leg', uz: 'Meni ustimdan kulma — jiddiy bo\'l!', explanation: "Idioma: pull someone's leg (hazillashmoq)." },
    { type: 'build', uz: 'Siz qaror qabul qilishingiz kerak.', words: ['You', 'must', 'make', 'a', 'decision'], correct: ['You', 'must', 'make', 'a', 'decision'], explanation: "make a decision. Mukammal yakun!" },
  ],
  rule: {
    title: 'Collocations & Idioms — to\'liq qoida',
    body: "Kollokatsiya va idiomalar — tabiiy ingliz nutqi.\n\n🤝 Kollokatsiya — TABIIY so'z juftligi:\n   • make: a decision, a mistake, an effort, money\n   • do: homework, research, a favour, business\n   • pay: attention, a visit, a compliment\n   • take: a risk, a break, a photo, place\n   ⚠️ make a mistake ✓ (do a mistake ✗)\n\n🎲 Idioma — alohida so'zlardan kelib CHIQMAYDIGAN ibora:\n   • a piece of cake = juda oson\n   • break the ice = muloqotni boshlamoq\n   • cost an arm and a leg = juda qimmat\n   • pull someone's leg = hazillashmoq\n\n💡 Idiomani so'zma-so'z tarjima qilmang — ma'noni yodlang!",
  },
  summary: [
    "make a decision/mistake · do homework/research",
    "pay attention · take a risk/break",
    "Idioma: piece of cake (oson), break the ice",
    "Idiomani so'zma-so'z tarjima qilmang",
  ],
}

// ─── 19. Collocations: Make, Do, Have, Take ─────────────────────────────────
const COLLOCATIONS_MAKE_DO: DemoLesson = {
  id: 'collocations-make-do-have-take-b1plus-demo',
  skill: 'Make / Do / Have / Take kollokatsiyalari',
  level: 'B1+',
  emoji: '🔧',
  context: {
    text: "Tasavvur qiling — kunini ta'riflayapsiz: \"Dush QABUL QILDIM (have a shower), nonushta QILDIM (have breakfast), uy ishini BAJARDIM (do homework), foto OLDIM (take a photo)\". make/do/have/take to'g'ri tanlash muhim. Keling, ularni o'rganamiz!",
    location: 'Real vaziyat · Kun tartibi',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "make — yaratish/natija (make a cake, make a plan)",
      "do — harakat/vazifa (do homework, do the dishes)",
      "have — tajriba/egalik (have breakfast, have a shower)",
      "take — olish/vaqt (take a photo, take a break)",
    ],
  },
  examples: [
    { en: 'have breakfast / a shower',           uz: 'nonushta qilmoq / dush qabul qilmoq',    key: 'have' },
    { en: 'make a plan / a cake',                uz: 'reja tuzmoq / tort pishirmoq',           key: 'make' },
    { en: 'do the dishes / homework',            uz: 'idish yuvmoq / uy ishi qilmoq',          key: 'do' },
    { en: 'take a photo / a break',              uz: 'foto olmoq / tanaffus qilmoq',           key: 'take' },
  ],
  vocab: [
    { en: 'make',     uz: 'yaratmoq (natija)', emoji: '🏗️', example: 'make a cake' },
    { en: 'do',       uz: 'bajarmoq (vazifa)', emoji: '✔️', example: 'do the work' },
    { en: 'have',     uz: 'qilmoq (tajriba)', emoji: '🍽️', example: 'have lunch' },
    { en: 'take',     uz: 'olmoq (harakat)',  emoji: '📸', example: 'take a photo' },
    { en: 'make an effort', uz: 'harakat qilmoq', emoji: '💪', example: 'make an effort' },
    { en: 'have a rest', uz: 'dam olmoq',     emoji: '😌', example: 'have a rest' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'make', uz: 'yaratmoq' }, { en: 'do', uz: 'bajarmoq' }, { en: 'have', uz: 'qilmoq (tajriba)' }, { en: 'take', uz: 'olmoq' }], explanation: "make/do/have/take farqi." },
    { type: 'choose', sentence: 'I usually ___ breakfast at 8.', options: ['have', 'make', 'do'], correct: 'have', uz: 'Men odatda soat 8 da nonushta qilaman.', explanation: "have breakfast (tajriba/iste'mol)." },
    { type: 'choose', sentence: 'Can you ___ the dishes, please?', options: ['do', 'make', 'have'], correct: 'do', uz: 'Iltimos, idishlarni yuva olasizmi?', explanation: "do the dishes (uy vazifasi)." },
    { type: 'judge', sentence: 'I need to make my homework.', isCorrect: false, explanation: "Noto'g'ri! do homework: 'I need to do my homework'." },
    { type: 'build', uz: 'Keling, foto olaylik.', words: ["Let's", 'take', 'a', 'photo'], correct: ["Let's", 'take', 'a', 'photo'], explanation: "take a photo (kollokatsiya)." },
    { type: 'choose', sentence: 'We need to ___ a plan for the weekend.', options: ['make', 'do', 'take'], correct: 'make', uz: 'Hafta oxiri uchun reja tuzishimiz kerak.', explanation: "make a plan (yaratish)." },
    { type: 'choose', sentence: 'You look tired — ___ a break.', options: ['take', 'make', 'do'], correct: 'take', uz: 'Charchagan ko\'rinasiz — tanaffus qiling.', explanation: "take a break." },
    { type: 'judge', sentence: 'She had a shower before work.', isCorrect: true, explanation: "To'g'ri! have a shower (dush qabul qilmoq). Mukammal!" },
    { type: 'choose', sentence: 'Please ___ an effort to be on time.', options: ['make', 'do', 'take'], correct: 'make', uz: 'Iltimos, vaqtida kelishga harakat qiling.', explanation: "make an effort (harakat qilmoq)." },
    { type: 'build', uz: 'Men biroz dam olmoqchiman.', words: ['I', 'want', 'to', 'have', 'a', 'rest'], correct: ['I', 'want', 'to', 'have', 'a', 'rest'], explanation: "have a rest (dam olmoq)." },
    { type: 'judge', sentence: 'He makes a lot of mistakes.', isCorrect: true, explanation: "To'g'ri! make a mistake (xato qilmoq). Mukammal!" },
    { type: 'choose', sentence: 'I have to ___ some shopping today.', options: ['do', 'make', 'take'], correct: 'do', uz: 'Bugun xarid qilishim kerak.', explanation: "do the shopping (do EMAS make)." },
    { type: 'choose', sentence: "Let's ___ a conversation about it.", options: ['have', 'make', 'do'], correct: 'have', uz: 'Keling, bu haqda suhbat quraylik.', explanation: "have a conversation (tajriba)." },
    { type: 'build', uz: 'Tort pishiraman.', words: ['I', 'will', 'make', 'a', 'cake'], correct: ['I', 'will', 'make', 'a', 'cake'], explanation: "make a cake (yaratish). Mukammal yakun!" },
  ],
  rule: {
    title: 'Make / Do / Have / Take — to\'liq qoida',
    body: "Eng ko'p ishlatiladigan to'rt fe'l kollokatsiyalari.\n\n🏗️ make — YARATISH/natija:\n   • make a cake, a plan, a decision, a mistake\n   • make money, noise, an effort, a phone call\n\n✔️ do — VAZIFA/harakat:\n   • do homework, the dishes, the shopping\n   • do research, a favour, business, exercise\n\n🍽️ have — TAJRIBA/iste'mol:\n   • have breakfast/lunch, a shower, a rest\n   • have a party, a conversation, a good time\n\n📸 take — OLISH/vaqt:\n   • take a photo, a break, a taxi, a shower\n   • take time, place, an exam, notes\n\n⚠️ have a shower = take a shower (ikkalasi to'g'ri)",
  },
  summary: [
    "make — yaratish (a cake, a plan, a mistake)",
    "do — vazifa (homework, the dishes, research)",
    "have — tajriba (breakfast, a shower, a rest)",
    "take — olish (a photo, a break, an exam)",
  ],
}

// ─── 20. Advanced Phrasal Verbs ─────────────────────────────────────────────
const ADVANCED_PHRASAL_VERBS: DemoLesson = {
  id: 'advanced-phrasal-verbs-b1plus-demo',
  skill: 'Murakkab frazal fe\'llar — uch qismli va idiomatik',
  level: 'B1+',
  emoji: '🧩',
  context: {
    text: "Tasavvur qiling — tabiiy gapiryapsiz: \"Men buni TO'QIB CHIQARDIM (made up), do'stim bilan KELISHOLMAY qoldim (fell out with), pulim TUGADI (ran out of)\". Murakkab frazal fe'llar nutqni tabiiy qiladi. Keling, ularni o'rganamiz!",
    location: 'Real vaziyat · Tabiiy nutq',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Uch qismli frazal fe'llar: put up with, look forward to",
      "Idiomatik ma'no: make up (to'qib chiqarmoq), take after",
      "fall out with (urishib qolmoq), come up with (o'ylab topmoq)",
      "Ko'p frazal fe'l ajralmaydi (uch qismli har doim ajralmas)",
    ],
  },
  examples: [
    { en: 'I look forward to seeing you.',       uz: 'Sizni ko\'rishni intizorlik bilan kutaman.', key: 'look forward to' },
    { en: "I can't put up with the noise.",      uz: 'Men shovqinga chidolmayman.',            key: 'put up with' },
    { en: 'She takes after her mother.',         uz: 'U onasiga o\'xshايdi.',                   key: 'takes after' },
    { en: 'He came up with a great idea.',       uz: 'U ajoyib g\'oya o\'ylab topdi.',          key: 'came up with' },
  ],
  vocab: [
    { en: 'look forward to', uz: 'intizorlik bilan kutmoq', emoji: '😊', example: 'look forward to it' },
    { en: 'put up with', uz: 'chidamoq',      emoji: '😤', example: 'put up with noise' },
    { en: 'take after', uz: 'o\'xshamoq (qarindosh)', emoji: '👨‍👦', example: 'take after dad' },
    { en: 'come up with', uz: 'o\'ylab topmoq', emoji: '💡', example: 'come up with ideas' },
    { en: 'fall out with', uz: 'urishib qolmoq', emoji: '💔', example: 'fall out with a friend' },
    { en: 'get on with', uz: 'chiqishmoq / davom etmoq', emoji: '🤝', example: 'get on with people' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'look forward to', uz: 'intizorlik bilan kutmoq' }, { en: 'put up with', uz: 'chidamoq' }, { en: 'take after', uz: 'o\'xshamoq' }, { en: 'come up with', uz: 'o\'ylab topmoq' }], explanation: "Murakkab frazal fe'llar." },
    { type: 'choose', sentence: 'I look forward ___ hearing from you.', options: ['to', 'for', 'at'], correct: 'to', uz: 'Sizdan xabar olishni intizorlik bilan kutaman.', explanation: "look forward TO + ing (uch qismli)." },
    { type: 'choose', sentence: "I can't put up ___ this noise!", options: ['with', 'to', 'on'], correct: 'with', uz: 'Men bu shovqinga chidolmayman!', explanation: "put up WITH (chidamoq, uch qismli)." },
    { type: 'judge', sentence: 'I look forward to see you soon.', isCorrect: false, explanation: "Noto'g'ri! look forward to + ING: 'to seeing you' (to bu yerda predlog)." },
    { type: 'build', uz: 'U ajoyib g\'oya o\'ylab topdi.', words: ['He', 'came', 'up', 'with', 'a', 'great', 'idea'], correct: ['He', 'came', 'up', 'with', 'a', 'great', 'idea'], explanation: "come up with (o'ylab topmoq)." },
    { type: 'choose', sentence: 'She ___ after her father — same eyes.', options: ['takes', 'puts', 'comes'], correct: 'takes', uz: 'U otasiga o\'xshايdi — ko\'zlari bir xil.', explanation: "take after (qarindoshga o'xshamoq)." },
    { type: 'choose', sentence: 'I fell ___ with my best friend.', options: ['out', 'off', 'down'], correct: 'out', uz: 'Men eng yaqin do\'stim bilan urishib qoldim.', explanation: "fall out with (urishib qolmoq)." },
    { type: 'judge', sentence: 'How do you get on with your colleagues?', isCorrect: true, explanation: "To'g'ri! get on with (chiqishmoq). Mukammal!" },
    { type: 'choose', sentence: "We've ___ out of milk again.", options: ['run', 'gone', 'put'], correct: 'run', uz: 'Bizda yana sut tugadi.', explanation: "run out of (tugamoq, uch qismli)." },
    { type: 'build', uz: 'Men shovqinga chidolmayman.', words: ['I', "can't", 'put', 'up', 'with', 'the', 'noise'], correct: ['I', "can't", 'put', 'up', 'with', 'the', 'noise'], explanation: "put up with (chidamoq)." },
    { type: 'judge', sentence: 'She came up with an excuse.', isCorrect: true, explanation: "To'g'ri! come up with (o'ylab topmoq). Mukammal!" },
    { type: 'choose', sentence: 'I need to ___ up on my English.', options: ['brush', 'take', 'put'], correct: 'brush', uz: 'Men ingliz tilimni yangilashim kerak.', explanation: "brush up on (bilimni yangilamoq)." },
    { type: 'choose', sentence: 'He had to ___ up with a new plan quickly.', options: ['come', 'put', 'take'], correct: 'come', uz: 'U tezda yangi reja o\'ylab topishi kerak edi.', explanation: "come up with (o'ylab topmoq)." },
    { type: 'build', uz: 'Sizni ko\'rishni intizorlik bilan kutaman.', words: ['I', 'look', 'forward', 'to', 'seeing', 'you'], correct: ['I', 'look', 'forward', 'to', 'seeing', 'you'], explanation: "look forward to + ing. Mukammal yakun!" },
  ],
  rule: {
    title: 'Advanced Phrasal Verbs — to\'liq qoida',
    body: "Uch qismli va idiomatik frazal fe'llar.\n\n🔗 Uch qismli (fe'l + ravish + predlog) — AJRALMAYDI:\n   • look forward to + ing: I look forward to seeing you.\n   • put up with: I can't put up with it. (chidamoq)\n   • come up with: come up with an idea (o'ylab topmoq)\n   • run out of: run out of time (tugamoq)\n   • get on with: get on with people (chiqishmoq)\n\n👨‍👦 Idiomatik ma'no (so'zma-so'z emas):\n   • take after = qarindoshga o'xshamoq\n   • make up = to'qib chiqarmoq / yarashmoq\n   • fall out with = urishib qolmoq\n   • brush up on = bilimni yangilamoq\n\n⚠️ look forward TO + ING (to — predlog, infinitiv emas!)",
  },
  summary: [
    "Uch qismli: look forward to, put up with",
    "come up with (o'ylab topmoq), run out of (tugamoq)",
    "take after (o'xshamoq), fall out with (urishmoq)",
    "look forward to + ING (to — predlog)",
  ],
}

// ─── 21. Common Idioms ──────────────────────────────────────────────────────
const IDIOMS_COMMON: DemoLesson = {
  id: 'idioms-common-b1plus-demo',
  skill: 'Keng tarqalgan idiomalar — kundalik iboralar',
  level: 'B1+',
  emoji: '💬',
  context: {
    text: "Tasavvur qiling — ona tilidek gapiryapsiz: \"Bu menga tushli emas (not my cup of tea)... O'zingni tut (pull yourself together)... Omadni sınab ko'r (break a leg!)\". Idiomalar nutqni jonli qiladi. Keling, eng keng tarqalgan idiomalarni o'rganamiz!",
    location: 'Real vaziyat · Jonli nutq',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Idioma — so'zlardan to'g'ridan-to'g'ri kelib chiqmaydi",
      "once in a blue moon — juda kam",
      "under the weather — betob · hit the books — qattiq o'qimoq",
      "Ma'noni yodlash kerak, so'zma-so'z tarjima qilmaslik",
    ],
  },
  examples: [
    { en: "It's not my cup of tea.",             uz: 'Bu mening didima to\'g\'ri kelmaydi.',    key: 'cup of tea' },
    { en: 'I feel under the weather.',           uz: 'Men o\'zimni yomon his qilyapman.',       key: 'under the weather' },
    { en: 'Break a leg!',                        uz: 'Omad! (muvaffaqiyat tilayman)',          key: 'break a leg' },
    { en: 'Once in a blue moon.',                uz: 'Juda kam, deyarli hech.',                key: 'blue moon' },
  ],
  vocab: [
    { en: 'cup of tea', uz: 'did/yoqtirish',  emoji: '☕', example: 'not my cup of tea' },
    { en: 'under the weather', uz: 'betob',   emoji: '🤒', example: 'feel under the weather' },
    { en: 'break a leg', uz: 'omad tilayman', emoji: '🍀', example: 'good luck!' },
    { en: 'hit the books', uz: 'qattiq o\'qimoq', emoji: '📚', example: 'study hard' },
    { en: 'once in a blue moon', uz: 'juda kam', emoji: '🌙', example: 'very rarely' },
    { en: 'on cloud nine', uz: 'juda baxtli', emoji: '☁️', example: 'extremely happy' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'cup of tea', uz: 'did/yoqtirish' }, { en: 'under the weather', uz: 'betob' }, { en: 'break a leg', uz: 'omad tilayman' }, { en: 'hit the books', uz: 'qattiq o\'qimoq' }], explanation: "Keng tarqalgan idiomalar." },
    { type: 'choose', sentence: 'Opera is not my cup of ___.', options: ['tea', 'coffee', 'milk'], correct: 'tea', uz: 'Opera mening didima to\'g\'ri kelmaydi.', explanation: "not my cup of tea (yoqmaydi)." },
    { type: 'choose', sentence: "I'm feeling under the ___ today.", options: ['weather', 'sky', 'cloud'], correct: 'weather', uz: 'Bugun o\'zimni yomon his qilyapman.', explanation: "under the weather (betob)." },
    { type: 'judge', sentence: "Before the exam, I need to hit the books.", isCorrect: true, explanation: "To'g'ri! hit the books = qattiq o'qimoq. Mukammal!" },
    { type: 'build', uz: 'Omad! (sahnaga chiqishdan oldin)', words: ['Break', 'a', 'leg'], correct: ['Break', 'a', 'leg'], explanation: "break a leg = omad tilayman (teatrda)." },
    { type: 'choose', sentence: 'He visits us once in a blue ___.', options: ['moon', 'sky', 'day'], correct: 'moon', uz: 'U biznikiga juda kam keladi.', explanation: "once in a blue moon (juda kam)." },
    { type: 'choose', sentence: "She got the job and she's on cloud ___.", options: ['nine', 'ten', 'seven'], correct: 'nine', uz: 'U ishni oldi va juda baxtli.', explanation: "on cloud nine (juda baxtli)." },
    { type: 'judge', sentence: "It costs a fortune to live there.", isCorrect: true, explanation: "To'g'ri! cost a fortune = juda qimmat. Mukammal!" },
    { type: 'choose', sentence: 'Stop worrying — pull yourself ___.', options: ['together', 'up', 'over'], correct: 'together', uz: 'Xavotır olma — o\'zingni qo\'lga ol.', explanation: "pull yourself together (o'zini tutmoq)." },
    { type: 'build', uz: 'Men o\'zimni yomon his qilyapman.', words: ['I', 'feel', 'under', 'the', 'weather'], correct: ['I', 'feel', 'under', 'the', 'weather'], explanation: "under the weather (betob)." },
    { type: 'judge', sentence: "Let's call it a day — we've worked enough.", isCorrect: true, explanation: "To'g'ri! call it a day = ishni tugatmoq. Mukammal!" },
    { type: 'choose', sentence: "I'm a bit rusty, I need to ___ the books.", options: ['hit', 'kick', 'punch'], correct: 'hit', uz: 'Biroz unutibman, qattiq o\'qishim kerak.', explanation: "hit the books (qattiq o'qimoq)." },
    { type: 'choose', sentence: "That exam was a piece of ___.", options: ['cake', 'pie', 'bread'], correct: 'cake', uz: 'O\'sha imtihon suvdek oson edi.', explanation: "a piece of cake (juda oson)." },
    { type: 'build', uz: 'Bu mening didima to\'g\'ri kelmaydi.', words: ["It's", 'not', 'my', 'cup', 'of', 'tea'], correct: ["It's", 'not', 'my', 'cup', 'of', 'tea'], explanation: "not my cup of tea (yoqmaydi). Mukammal yakun!" },
  ],
  rule: {
    title: 'Common Idioms — to\'liq qoida',
    body: "Eng keng tarqalgan idiomalar (ma'noni yodlang!).\n\n☕ His-tuyg'u va holat:\n   • not my cup of tea = yoqmaydi\n   • under the weather = betob\n   • on cloud nine = juda baxtli\n   • pull yourself together = o'zingni tut\n\n📚 Ish va o'qish:\n   • hit the books = qattiq o'qimoq\n   • call it a day = ishni tugatmoq\n   • a piece of cake = juda oson\n\n🌙 Chastota va pul:\n   • once in a blue moon = juda kam\n   • cost a fortune / an arm and a leg = juda qimmat\n\n🍀 Boshqa:\n   • break a leg = omad tilayman\n\n⚠️ So'zma-so'z TARJIMA QILMANG — butun ma'noni yodlang!",
  },
  summary: [
    "not my cup of tea (yoqmaydi), under the weather (betob)",
    "hit the books (o'qimoq), a piece of cake (oson)",
    "once in a blue moon (kam), break a leg (omad)",
    "Idiomani so'zma-so'z tarjima qilmang",
  ],
}

// ─── 22. Prepositional Phrases ──────────────────────────────────────────────
const PREPOSITIONAL_PHRASES: DemoLesson = {
  id: 'prepositional-phrases-b1plus-demo',
  skill: 'Predlogli iboralar — at, in, on, by bilan turg\'un birikmalar',
  level: 'B1+',
  emoji: '📎',
  context: {
    text: "Tasavvur qiling — rasmiy gapiryapsiz: \"O'z VAQTIDA keldim (on time), TASODIFAN uchratdim (by chance), UMUMAN olganda yaxshi (in general)\". Predlogli turg'un iboralar nutqni aniq qiladi. Keling, ularni o'rganamiz!",
    location: 'Real vaziyat · Aniq ifoda',
  },
  intro: {
    title: "Bu darsda nimani o'rganamiz?",
    points: [
      "Turg'un predlogli iboralar — yodlanadi",
      "on: on time, on purpose, on the whole",
      "in: in time, in general, in fact, in danger",
      "by: by chance, by mistake, by heart",
    ],
  },
  examples: [
    { en: 'I arrived on time.',                  uz: 'Men o\'z vaqtida keldim.',                key: 'on time' },
    { en: 'We met by chance.',                   uz: 'Biz tasodifan uchrashdik.',                key: 'by chance' },
    { en: 'In general, it was good.',            uz: 'Umuman olganda, yaxshi edi.',            key: 'in general' },
    { en: 'I learned it by heart.',              uz: 'Men uni yodlab oldim.',                   key: 'by heart' },
  ],
  vocab: [
    { en: 'on time',  uz: 'o\'z vaqtida',     emoji: '⏰', example: 'arrive on time' },
    { en: 'in time',  uz: 'ulgurib',          emoji: '🏃', example: 'just in time' },
    { en: 'by chance', uz: 'tasodifan',       emoji: '🎲', example: 'meet by chance' },
    { en: 'on purpose', uz: 'ataylab',        emoji: '🎯', example: 'do it on purpose' },
    { en: 'in fact',  uz: 'aslida',           emoji: '💡', example: 'in fact, ...' },
    { en: 'by mistake', uz: 'xato bilan',     emoji: '❌', example: 'took it by mistake' },
  ],
  steps: [
    { type: 'match', pairs: [{ en: 'on time', uz: 'o\'z vaqtida' }, { en: 'by chance', uz: 'tasodifan' }, { en: 'on purpose', uz: 'ataylab' }, { en: 'by heart', uz: 'yodlab' }], explanation: "Predlogli turg'un iboralar." },
    { type: 'choose', sentence: 'The train left exactly ___ time.', options: ['on', 'in', 'by'], correct: 'on', uz: 'Poyezd aynan o\'z vaqtida jo\'nadi.', explanation: "on time (o'z vaqtida, aniq)." },
    { type: 'choose', sentence: 'We bumped into each other ___ chance.', options: ['by', 'on', 'in'], correct: 'by', uz: 'Biz tasodifan uchrashib qoldik.', explanation: "by chance (tasodifan)." },
    { type: 'judge', sentence: 'He broke it on accident.', isCorrect: false, explanation: "Noto'g'ri! by accident (on emas): 'He broke it by accident'." },
    { type: 'build', uz: 'Men uni yodlab oldim.', words: ['I', 'learned', 'it', 'by', 'heart'], correct: ['I', 'learned', 'it', 'by', 'heart'], explanation: "by heart (yodlab)." },
    { type: 'choose', sentence: '___ fact, I disagree completely.', options: ['In', 'On', 'By'], correct: 'In', uz: 'Aslida, men butunlay rozi emasman.', explanation: "in fact (aslida)." },
    { type: 'choose', sentence: 'Did you do that ___ purpose?', options: ['on', 'by', 'in'], correct: 'on', uz: 'Buni ataylab qildingizmi?', explanation: "on purpose (ataylab)." },
    { type: 'judge', sentence: 'We arrived just in time to catch the train.', isCorrect: true, explanation: "To'g'ri! in time = ulgurib (poyezdga). Mukammal!" },
    { type: 'choose', sentence: 'I took your umbrella ___ mistake.', options: ['by', 'on', 'in'], correct: 'by', uz: 'Men soyaboningizni xato bilan oldim.', explanation: "by mistake (xato bilan)." },
    { type: 'build', uz: 'Umuman olganda, yaxshi edi.', words: ['In', 'general', 'it', 'was', 'good'], correct: ['In', 'general', 'it', 'was', 'good'], explanation: "in general (umuman olganda)." },
    { type: 'judge', sentence: 'The building is on fire!', isCorrect: true, explanation: "To'g'ri! on fire (yonyapti). Mukammal!" },
    { type: 'choose', sentence: 'The patient is ___ danger.', options: ['in', 'on', 'by'], correct: 'in', uz: 'Bemor xavf ostida.', explanation: "in danger (xavf ostida)." },
    { type: 'choose', sentence: 'She is ___ holiday this week.', options: ['on', 'in', 'by'], correct: 'on', uz: 'U bu hafta ta\'tilda.', explanation: "on holiday (ta'tilda)." },
    { type: 'build', uz: 'Biz tasodifan uchrashdik.', words: ['We', 'met', 'by', 'chance'], correct: ['We', 'met', 'by', 'chance'], explanation: "by chance (tasodifan). Mukammal yakun!" },
  ],
  rule: {
    title: 'Prepositional Phrases — to\'liq qoida',
    body: "Turg'un predlogli iboralar — yodlanadi (qoidasi yo'q).\n\n⏰ ON bilan:\n   • on time (o'z vaqtida) · on purpose (ataylab)\n   • on the whole (umuman) · on holiday · on fire\n   • on foot · on the phone\n\n💡 IN bilan:\n   • in time (ulgurib) · in fact (aslida)\n   • in general (umuman) · in danger (xavfda)\n   • in advance · in particular · in the end\n\n🎲 BY bilan:\n   • by chance (tasodifan) · by mistake (xato bilan)\n   • by heart (yodlab) · by accident · by hand\n\n⚠️ FARQ: on time (aniq vaqt) ≠ in time (ulgurib)\n   • The train left on time. (aniq jadval)\n   • I arrived in time to catch it. (ulgurdim)",
  },
  summary: [
    "on: on time, on purpose, on holiday, on fire",
    "in: in time, in fact, in general, in danger",
    "by: by chance, by mistake, by heart",
    "on time (aniq) ≠ in time (ulgurib)",
  ],
}

// ═══════════════════════════════════════════════════════════════════════════
export const B1PLUS_DEMOS: Record<string, DemoLesson> = {
  'third-conditional-b1plus':   THIRD_CONDITIONAL,
  'mixed-conditionals-b1plus':  MIXED_CONDITIONALS,
  'wish-if-only-b1plus':        WISH_IF_ONLY,
  'advanced-modals-b1plus':     ADVANCED_MODALS,
  'modal-perfects-b1plus':      MODAL_PERFECTS,
  'narrative-tenses-b1plus':    NARRATIVE_TENSES,
  'advanced-relative-clauses-b1plus': ADVANCED_RELATIVE_CLAUSES,
  'participle-clauses-b1plus':  PARTICIPLE_CLAUSES,
  'infinitive-gerund-advanced-b1plus': INFINITIVE_GERUND_ADVANCED,
  'emphasis-does-b1plus':       EMPHASIS_DOES,
  'concession-b1plus':          CONCESSION,
  'fronting-b1plus':            FRONTING,
  'ellipsis-substitution-b1plus': ELLIPSIS_SUBSTITUTION,
  'linking-words-advanced-b1plus': LINKING_WORDS_ADVANCED,
  'determiners-advanced-b1plus': DETERMINERS_ADVANCED,
  'reporting-verbs-b1plus':     REPORTING_VERBS,
  'word-formation-b1plus':      WORD_FORMATION,
  'collocations-idioms-b1plus': COLLOCATIONS_IDIOMS,
  'collocations-make-do-have-take-b1plus': COLLOCATIONS_MAKE_DO,
  'advanced-phrasal-verbs-b1plus': ADVANCED_PHRASAL_VERBS,
  'idioms-common-b1plus':       IDIOMS_COMMON,
  'prepositional-phrases-b1plus': PREPOSITIONAL_PHRASES,
}
