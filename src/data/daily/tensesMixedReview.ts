import type { DailyLesson } from '../dailyLessons'

export const tensesMixedReview: DailyLesson = {
  id: 'tenses-mixed-review',
  title: '6 Zamon Aralash Takrorlash',
  subtitle: 'Present Simple, Present Continuous, Present Perfect, Past Simple, Past Continuous, Future Simple — barchasini birga takrorlang',
  level: 'A2',
  day: 30,
  listening: {
    transcript: `Ali: Hey Bobur, what are you doing?
Bobur: I'm reading about history. What about you?
Ali: I'm preparing for my English exam. I've been studying tenses all day.
Bobur: Oh, tenses are confusing. Which ones do you know well?
Ali: I understand Present Simple and Past Simple. But Present Perfect is hard.
Bobur: When did you start learning English?
Ali: I started three years ago. I've studied every day since then.
Bobur: That's great! What were you doing yesterday evening?
Ali: I was watching a movie when my teacher called me.
Bobur: What will you do tomorrow?
Ali: I will review all six tenses. I always review before exams.`,
    vocabulary: [
      { word: 'tenses', definition: 'fe\'l zamonlari' },
      { word: 'confusing', definition: 'chalkashtiruvchi' },
      { word: 'prepare', definition: 'tayyorlanmoq' },
      { word: 'since', definition: 'shundan beri' },
      { word: 'review', definition: 'takrorlamoq' },
    ],
    questions: [
      { id: 99001, type: 'multiple-choice', question: "What is Ali doing now?", options: ["Reading", "Studying English", "Watching a movie", "Sleeping"], correctIndex: 1, explanation: "'I'm preparing for my English exam' — Present Continuous (hozir)." },
      { id: 99002, type: 'multiple-choice', question: "When did Ali start learning English?", options: ["One year ago", "Two years ago", "Three years ago", "Four years ago"], correctIndex: 2, explanation: "'I started three years ago' — Past Simple (aniq vaqt)." },
      { id: 99003, type: 'true-false', question: "Ali has studied every day since then.", answer: true, explanation: "'I've studied every day since then' — Present Perfect (davom etayotgan)." },
      { id: 99004, type: 'multiple-choice', question: "What was Ali doing when the teacher called?", options: ["Studying", "Eating", "Watching a movie", "Reading"], correctIndex: 2, explanation: "'I was watching a movie when my teacher called' — Past Continuous (uzilgan harakat)." },
      { id: 99005, type: 'multiple-choice', question: "What will Ali do tomorrow?", options: ["Start learning", "Review all tenses", "Take the exam", "Read history"], correctIndex: 1, explanation: "'I will review all six tenses' — Future Simple (reja)." },
    ],
    difficulty: 'medium',
    topic: '6 zamon aralash — barcha zamonlarni tanish',
  },
  formulas: [
    { label: 'Present Simple', structure: 'I/You/We/They + V1\nHe/She/It + V1+s/-es', color: 'green',
      explanation: "Odatiy harakatlar, haqiqatlar, jadvallar. 'Har kuni', 'doim', 'ba'zida' kabi so'zlar bilan ishlatiladi.",
      whenToUse: "Odatlar (I drink tea), haqiqatlar (Water boils at 100°C), jadvallar (The train leaves at 7).",
      example: "I drink tea every morning. / She works at a hospital." },
    { label: 'Present Continuous', structure: 'I + am + V-ing\nHe/She/It + is + V-ing\nYou/We/They + are + V-ing', color: 'blue',
      explanation: "Hozir aynan sodir bo'layotgan harakatlar. 'Hozir', 'shu payt' ma'nosida.",
      whenToUse: "Hozirgi harakatlar (I am eating), vaqtinchalik holatlar (She is staying here), rejalashgan kelajak (I am meeting him tomorrow).",
      example: "I am eating lunch right now. / It is raining." },
    { label: 'Present Perfect', structure: 'I/You/We/They + have + V3\nHe/She/It + has + V3', color: 'purple',
      explanation: "O'tmishda sodir bo'lgan, lekin hozirgi hayotga bog'langan harakatlar. 'Tajriba', 'natija', 'davom etish' ma'nosida.",
      whenToUse: "Tajriba (I have been to Paris), natija (She has lost her key), davom etish (We have lived here for 5 years).",
      example: "I have visited London three times. / He has just arrived." },
    { label: 'Past Simple', structure: 'I/You/We/They + V2\nHe/She/It + V2', color: 'amber',
      explanation: "O'tmishda tugallangan harakatlar. Aniq vaqt bilan ishlatiladi: 'kecha', 'otgan hafta', '2020-yilda'.",
      whenToUse: "Tugallangan harakatlar (I went yesterday), ketma-ketlik (He woke up and went out), o'tmishdagi odatlar (She played tennis every Sunday).",
      example: "I went to school yesterday. / She studied English last year." },
    { label: 'Past Continuous', structure: 'I/He/She/It + was + V-ing\nYou/We/They + were + V-ing', color: 'cyan',
      explanation: "O'tmishdagi davom etayotgan harakatlar. Ko'pincha 'when' va 'while' bilan keladi.",
      whenToUse: "Davom etgan harakatlar (I was reading at 8 PM), uzilgan harakatlar (I was sleeping when he called), parallel harakatlar (She was cooking while I was cleaning).",
      example: "I was watching TV when the phone rang. / They were playing football all afternoon." },
    { label: 'Future Simple', structure: 'I/You/We/They + will + V1\nHe/She/It + will + V1', color: 'rose',
      explanation: "Kelajakdagi harakatlar, taxminlar, va'dalar. 'Bugun', 'ertaga', 'kelajakda' ma'nosida.",
      whenToUse: "Taxminlar (It will rain tomorrow), va'dalar (I will help you), spontan qarorlar (I will order pizza).",
      example: "I will call you tomorrow. / She will be 20 next year." },
  ],
  rules: [
    "1️⃣ QAYSI ZAMON? — ASOSIY FARQLAR\n\n🔴 Present Simple vs Present Continuous:\n  • Simple = Odat (I drink tea every day)\n  • Continuous = Hozir (I am drinking tea now)\n  • Simple: always, usually, often, never\n  • Continuous: now, right now, at the moment\n\n🔵 Past Simple vs Past Continuous:\n  • Simple = Tugallangan (I watched a movie)\n  • Continuous = Davom etgan (I was watching a movie)\n  • Simple: yesterday, last week, in 2020\n  • Continuous: at 8 PM yesterday, when...\n\n🟣 Present Perfect vs Past Simple:\n  • Perfect = Hozirgi natija (I have lost my key = hozir kalitim yo'q)\n  • Simple = O'tmish voqeasi (I lost my key yesterday)\n  • Perfect: ever, never, already, yet, just, since, for\n  • Simple: yesterday, last, ago, in + year\n\n🟢 Future Simple vs Present Continuous:\n  • Future Simple = Taxmin, va'da (I will call you)\n  • Present Continuous = Rejalashgan (I am calling you at 3 PM)\n  • Simple: tomorrow, next week, in the future\n  • Continuous: at 7 o'clock tomorrow, this evening",
    "2️⃣ ANIQ VAQT vs NOANIQ VAQT\n\nPast Simple → ANIQ o'tmish vaqt:\n  I went to school yesterday. ✅\n  I went to school last Monday. ✅\n  I went to school. ✅ (vaqt aytilmagan, lekin tugallangan)\n\nPresent Perfect → NOANIQ vaqt yoki HOZIRGI NATIJA:\n  I have been to Paris. ✅ (necha marta? qachon? muhim emas)\n  I have lost my key. ✅ (hozir kalitim yo'q)\n  ❌ I have been to Paris yesterday. ❌ (aniq vaqt = Past Simple)\n\nPast Continuous → DAVOMIYLIK o'tmishda:\n  I was reading at 9 PM. ✅\n  I was reading when she came. ✅\n  ❌ I was reading the whole book. ❌ (tugallangan = Past Simple)",
    "3️⃣ STATE VERBS — QAYSI ZAMONDA?\n\nBa'zi fe'llar Present Continuous OLmaydi:\n  ✅ I know the answer. ✅\n  ❌ I am knowing the answer. ❌\n\nState verbs: know, understand, believe, like, love, want, need, have (ega), see, hear, feel\n\nLEKIN: Ba'zi fe'llar ikkala ma'noda:\n  I have a car. (egalik → Simple Present)\n  I am having dinner. (harakat → Present Continuous)\n  I think it's true. (fikr → Simple Present)\n  I am thinking about you. (jarayon → Present Continuous)",
    "4️⃣ SIGNAL SO'ZLAR — QAYSI ZAMON?\n\nPresent Simple: always, usually, often, sometimes, rarely, never, every day, on Mondays\nPresent Continuous: now, right now, at the moment, currently, Look!, Listen!\nPresent Perfect: ever, never, already, yet, just, so far, since, for, recently\nPast Simple: yesterday, last week/month/year, ago, in 2020, when I was young\nPast Continuous: while, when, at that moment, at 8 o'clock yesterday, all day yesterday\nFuture Simple: tomorrow, next week/month/year, in the future, soon, later, I think",
    "5️⃣ BIRGA ISHLATISH (COMPOUND SENTENCES)\n\nPast Continuous + Past Simple (uzilgan harakat):\n  I was sleeping when the alarm went off.\n  She was cooking while I was setting the table.\n  While we were playing, it started to rain.\n\nPresent Perfect + Present Simple (tajriba + odat):\n  I have visited many countries. I usually go to Europe.\n  She has lived in Tashkent for years. She works at a bank.\n\nPresent Continuous + Future Simple (hozirgi reja + kelajak):\n  I am meeting him tomorrow. He will come at 3.\n  We are traveling next week. The flight leaves at 6 AM.\n\nPast Simple + Future Simple (o'tmish + kelajak):\n  I studied hard, so I will pass the exam.\n  She was tired because she had worked all day.",
    "6️⃣ O'ZBEK TILIDAGI FARQLAR\n\nO'zbek tilida zamon ko'pincha aniq ko'rinmaydi:\n  'Men ishlayman' → Simple Present (odat)\n  'Men ishlayapman' → Present Continuous (hozir)\n  'Men ishladim' → Past Simple (tugallangan)\n  'Men ishlayotgan edim' → Past Continuous (davom etgan)\n  'Men ishladim' → Present Perfect (hozirgi natija)\n  'Men ishlayman' → Future Simple (kelajak)\n\nEng ko'p xatolar:\n  • I have visited Paris yesterday ❌ (aniq vaqt = Past Simple)\n  • I am knowing the answer ❌ (state verb = Simple Present)\n  • I was reading the book when I finished ❌ (tugallangan = Past Simple)\n  • I will can help you ❌ (will dan keyin V1: I will help you)",
    "7️⃣ TAQQOSLASH JADVALI — TEZKOR ESLATMA\n\n┌─────────────────┬──────────────────┬─────────────────┐\n│ ZAMON           │ QACHON?          │ SIGNAL SO'ZLAR  │\n├─────────────────┼──────────────────┼─────────────────┤\n│ Present Simple  │ Odat, haqiqat    │ always, every   │\n│ Present Cont.   │ Hozir            │ now, Look!,     │\n│ Present Perfect │ Natija, tajriba  │ ever, since,    │\n│ Past Simple     │ O'tmish          │ yesterday, ago  │\n│ Past Cont.      │ Davom etgan      │ when, while,    │\n│ Future Simple   │ Kelajak          │ tomorrow, will  │\n└─────────────────┴──────────────────┴─────────────────┘",
    "8️⃣ TAQQOSLASH MASALALARI — QAYSI ZAMON TO'G'RI?\n\n1. She ___ (work) here since 2020. → Present Perfect (since)\n2. She ___ (work) here yesterday. → Past Simple (yesterday)\n3. What ___ you ___ (do) right now? → Present Continuous (right now)\n4. What ___ you ___ (do) last night? → Past Simple (last night)\n5. I ___ (read) when he called. → Past Continuous (uzildi)\n6. I ___ (read) three books this month. → Present Perfect (experience)\n7. It ___ (rain) tomorrow. → Future Simple (tomorrow)\n8. It ___ (rain) at the moment. → Present Continuous (at the moment)\n9. She ___ (live) in London for 10 years. → Present Perfect (for)\n10. She ___ (live) in London in 2015. → Past Simple (in 2015)",
  ],
  vocabulary: [
    { en: 'tense', uz: 'fe\'l zamon', example: 'English has 12 tenses.', rule: 'grammar' },
    { en: 'habit', uz: 'odat', example: 'I drink tea every morning. (Simple Present)', rule: 'usage' },
    { en: 'experience', uz: 'tajriba', example: 'I have visited Paris three times. (Present Perfect)', rule: 'usage' },
    { en: 'interrupt', uz: 'uzish, aralashish', example: 'I was reading when he called. (Past Continuous)', rule: 'usage' },
    { en: 'progress', uz: 'jarayon, davom etish', example: 'I am studying English. (Present Continuous)', rule: 'usage' },
    { en: 'routine', uz: 'kundalik tartib', example: 'She wakes up at 6 every day. (Simple Present)', rule: 'usage' },
    { en: 'result', uz: 'natija', example: 'I have finished my homework. (Present Perfect)', rule: 'usage' },
    { en: 'signal word', uz: 'signal so\'z', example: '"Yesterday" signals Past Simple.', rule: 'grammar' },
    { en: 'frequency adverb', uz: 'chastota ravishi', example: 'always, usually, often, sometimes, never', rule: 'grammar' },
    { en: 'since', uz: 'shundan beri', example: 'I have lived here since 2015.', rule: 'signal' },
    { en: 'for', uz: '...davomida', example: 'I have lived here for 5 years.', rule: 'signal' },
    { en: 'ago', uz: '...oldin', example: 'I went there two years ago.', rule: 'signal' },
    { en: 'while', uz: '...paytida', example: 'I was cooking while she was cleaning.', rule: 'signal' },
    { en: 'already', uz: 'allaqachon', example: 'I have already eaten.', rule: 'signal' },
    { en: 'yet', uz: 'hali (emash)', example: 'I haven\'t finished yet.', rule: 'signal' },
  ],
  examples: [
    { en: "A: What do you do every day? (Simple Present — odat)\nB: I wake up at 7, go to work, and come back at 6.", uz: "A: Har kuni nima qilasiz? (Simple Present — odat)\nB: Soat 7 da uyg'onaman, ishga boraman va soat 6 da qaytaman." },
    { en: "A: What are you doing right now? (Present Continuous — hozir)\nB: I am reading a book about history.", uz: "A: Hozir nima qilyapsan? (Present Continuous — hozir)\nB: Men tarix haqida kitob o'qiyapman." },
    { en: "A: Have you ever been to London? (Present Perfect — tajriba)\nB: Yes, I have been there twice. I went there in 2019 and 2022.", uz: "A: Hech qachon Londonda bo'lganmisiz? (Present Perfect — tajriba)\nB: Ha, ikki marta. 2019 va 2022-yillarda bordim." },
    { en: "A: What did you do yesterday? (Past Simple — o'tmish)\nB: I went to the cinema and watched a new film.", uz: "A: Kecha nima qilding? (Past Simple — o'tmish)\nB: Kinoteatrga bordim va yangi film ko'rdim." },
    { en: "A: What were you doing at 9 PM last night? (Past Continuous — davom)\nB: I was doing my homework when my friend called.", uz: "A: Kecha soat 9 da nima qilyarding? (Past Continuous — davom)\nB: Uy vazifasini qilyardim, do'stim qo'ng'iroq qildi." },
    { en: "A: What will you do this weekend? (Future Simple — kelajak)\nB: I will visit my grandparents and help my mother cook.", uz: "A: Shu hafta oxiri nima qilasiz? (Future Simple — kelajak)\nB: Bobom-buvimni ziyorat qilaman va onamga ovqat tayyorlashda yordam beraman." },
    { en: "I was walking to school when it started to rain. (Past Continuous + Past Simple)", uz: "Maktabga yurayotganimda, yog'inch boshlandi. (Past Continuous + Past Simple)" },
    { en: "She has lived in Tashkent for 10 years, so she knows every street. (Present Perfect + Present Simple)", uz: "U Toshkentda 10 yil yashagan, shuning uchun har bir ko'chani biladi. (Present Perfect + Present Simple)" },
  ],
  specialCases: [
    {
      id: 'been-vs-gone',
      title: 'Been vs Gone — farqi nima?',
      rule: "BEEN = boringa borgan va qaytgan\nGONE = boringa ketgan, hali qaytmagan\n\n  He has been to London. = U Londonda bo'lgan va hozir yerda. (qaytgan)\n  He has gone to London. = U Londonga ketdi. (hozir yo'q)\n\n  ❌ He has gone to London twice. ❌ (been bo'lishi kerak — tajriba)\n  ✅ He has been to London twice. ✓\n\n  ❌ Where has been Tom? ❌\n  ✅ Where has Tom gone? ✓ (qayerga ketdi?)\n  ✅ Where has Tom been? ✓ (qayerda bo'lgan?)",
      mnemonic: "🎯 BEEN = B = BORGA (borib qaytgan)\nGONE = G = KETGAN (ketdi, yo'q)",
      commonMistakes: "• He has gone to Paris three times. ❌ → He has been to Paris three times. ✓\n• She has been to the shop. She'll be back soon. ❌ → She has gone to the shop. ✓\n• Where has been my phone? ❌ → Where has my phone been? ✓",
      examples: [
        { en: 'I have been to Japan. It was amazing.', uz: 'Men Yaponiyada bo\'lganman. Ajoyib edi.' },
        { en: 'My father has gone to work. He will be back at 6.', uz: 'Otam ishga ketdi. Soat 6 da qaytadi.' },
      ],
      drills: [
        { id: 80001, type: 'multiple-choice', instruction: 'Been yoki Gone?', question: 'She ___ to the supermarket. She\'ll be back in 10 minutes.', options: ['has been', 'has gone', 'went', 'goes'], correct: 'has gone', explanation: 'Hali qaytmagan → has gone' },
        { id: 80002, type: 'multiple-choice', instruction: 'Been yoki Gone?', question: 'I ___ to Paris twice. It\'s beautiful.', options: ['have been', 'have gone', 'went', 'go'], correct: 'have been', explanation: 'Tajriba (borib qaytgan) → have been' },
        { id: 80003, type: 'fill-blank', instruction: 'Been yoki Gone?', question: 'Where ___ Tom? I can\'t find him.', blanks: ['has gone'], explanation: 'Yo\'qolgan → has gone' },
        { id: 80004, type: 'fill-blank', instruction: 'Been yoki Gone?', question: 'We ___ to that restaurant many times.', blanks: ['have been'], explanation: 'Tajriba → have been' },
      ],
    },
    {
      id: 'for-vs-since',
      title: 'For vs Since — farqi nima?',
      rule: "FOR = davomiylik (VAQT ORALIG'I)\n  for 5 minutes, for 2 hours, for 3 days, for 2 years\n  for a long time, for ages, for ever\n\nSINCE = boshlanish nuqtasi (ANIQ DAN)\n  since Monday, since January, since 2020\n  since I was a child, since last week\n\n  I have lived here FOR 5 years. (5 yil davomida)\n  I have lived here SINCE 2019. (2019-dan beri)\n\n  ❌ I have lived here since 5 years. ❌\n  ✅ I have lived here for 5 years. ✓\n  ✅ I have lived here since 2019. ✓",
      mnemonic: "🎯 FOR = For how long? (qancha vaqt)\nSINCE = Since when? (qachondan beri)",
      commonMistakes: "• I have been here since 3 hours. ❌ → for 3 hours ✓\n• She has worked here for 2020. ❌ → since 2020 ✓\n• We have known each other since a long time. ❌ → for a long time ✓",
      examples: [
        { en: 'I have been waiting for two hours.', uz: 'Men ikki soatdan beri kutaman.' },
        { en: 'She has worked here since January.', uz: 'U yanvardan beri bu yerda ishlaydi.' },
      ],
      drills: [
        { id: 80005, type: 'multiple-choice', instruction: 'For yoki Since?', question: 'I have been studying English ___ 2018.', options: ['for', 'since', 'from', 'ago'], correct: 'since', explanation: 'Aniq boshlanish → since 2018' },
        { id: 80006, type: 'multiple-choice', instruction: 'For yoki Since?', question: 'She has lived here ___ three years.', options: ['for', 'since', 'from', 'ago'], correct: 'for', explanation: 'Davomiylik → for three years' },
        { id: 80007, type: 'fill-blank', instruction: 'For yoki Since?', question: 'We have known each other ___ we were children.', blanks: ['since'], explanation: 'Boshlanish nuqtasi → since' },
        { id: 80008, type: 'fill-blank', instruction: 'For yoki Since?', question: 'He has been waiting ___ 30 minutes.', blanks: ['for'], explanation: 'Davomiylik → for 30 minutes' },
      ],
    },
    {
      id: 'when-vs-while',
      title: 'When vs While — qachon ishlatiladi?',
      rule: "WHEN = bir zumda sodir bo'lgan (Past Simple yoki Past Continuous)\n  I was sleeping WHEN the alarm went off.\n  (Past Continuous + when + Past Simple)\n\nWHILE = uzoq davom etgan (Past Continuous)\n  I was reading WHILE she was cooking.\n  (Past Continuous + while + Past Continuous)\n\n  ✅ When I arrived, they were eating. (kelgan paytimda)\n  ✅ While I was cooking, the phone rang. (ovqat pishirayotganda)\n  ✅ When it started to rain, we were playing football.\n  ❌ While it started to rain... ❌ (while = davomiylik, started = tugallangan)",
      mnemonic: "🎯 WHEN = BIR LAHZADA (punctual)\nWHILE = DAVOMIYLIK (duration)",
      commonMistakes: "• While I was sleeping, the phone rings. ❌ → rang ✓ (o'tmish)\n• When I was cooking, she was cleaning. ❌ → While ✓ (davomiylik)\n• I was reading while he arrived. ❌ → when ✓ (punctual)",
      examples: [
        { en: 'When the teacher came in, the students were talking.', uz: 'O\'qituvchi kirganda, o\'quvchilar gaplashayotgan edi.' },
        { en: 'While we were having dinner, the lights went out.', uz: 'Biz ovqat yeyotganda, chiroq o\'chdi.' },
      ],
      drills: [
        { id: 80009, type: 'multiple-choice', instruction: 'When yoki While?', question: '___ I was walking home, it started to snow.', options: ['When', 'While', 'If', 'Because'], correct: 'While', explanation: 'While = davomiylik (walking = davom etgan)' },
        { id: 80010, type: 'multiple-choice', instruction: 'When yoki While?', question: 'She was reading ___ I was cooking.', options: ['When', 'While', 'If', 'Because'], correct: 'While', explanation: 'While = ikkala davomiylik' },
        { id: 80011, type: 'fill-blank', instruction: 'When yoki While?', question: '___ he arrived, we were watching TV.', blanks: ['When'], explanation: 'When = bir lahzada (arrived = tugallangan)' },
        { id: 80012, type: 'fill-blank', instruction: 'When yoki While?', question: '___ she was studying, her brother was playing.', blanks: ['While'], explanation: 'While = davomiylik (studying + playing)' },
      ],
    },
  ],
  exercises: [
    // ── ODDIY: Bitta zamoni aniqlash ──
    { id: 5001, type: 'fill-blank', instruction: 'To\'g\'ri zamoni yozing:', question: 'I ___ (drink) tea every morning.', blanks: ['drink'], explanation: 'Simple Present — odat (every morning)' },
    { id: 5002, type: 'fill-blank', instruction: 'To\'g\'ri zamoni yozing:', question: 'She ___ (work) at a hospital.', blanks: ['works'], explanation: 'Simple Present — She + works' },
    { id: 5003, type: 'fill-blank', instruction: 'To\'g\'ri zamoni yozing:', question: 'Look! It ___ (rain) outside.', blanks: ['is raining'], explanation: 'Present Continuous — hozir (Look!)' },
    { id: 5004, type: 'fill-blank', instruction: 'To\'g\'ri zamoni yozing:', question: 'I ___ (go) to school yesterday.', blanks: ['went'], explanation: 'Past Simple — yesterday' },
    { id: 5005, type: 'fill-blank', instruction: 'To\'g\'ri zamoni yozing:', question: 'They ___ (play) football at 5 PM yesterday.', blanks: ['were playing'], explanation: 'Past Continuous — at 5 PM yesterday' },
    { id: 5006, type: 'fill-blank', instruction: 'To\'g\'ri zamoni yozing:', question: 'I ___ (call) you tomorrow.', blanks: ['will call'], explanation: 'Future Simple — tomorrow' },
    { id: 5007, type: 'fill-blank', instruction: 'To\'g\'ri zamoni yozing:', question: 'She ___ (never/visit) London.', blanks: ['has never visited'], explanation: 'Present Perfect — never' },
    { id: 5008, type: 'fill-blank', instruction: 'To\'g\'ri zamoni yozing:', question: 'We ___ (live) here since 2018.', blanks: ['have lived'], explanation: 'Present Perfect — since 2018' },

    // ── O'RTACHA: Taqqoslash ──
    { id: 5009, type: 'multiple-choice', instruction: 'Qaysi zamon to\'g\'ri?', question: 'She ___ (work) here since 2020.', options: ['works', 'is working', 'has worked', 'worked'], correct: 'has worked', explanation: 'Since = Present Perfect' },
    { id: 5010, type: 'multiple-choice', instruction: 'Qaysi zamon to\'g\'ri?', question: 'What ___ you ___ (do) last night?', options: ['are...doing', 'do...do', 'did...do', 'were...doing'], correct: 'did...do', explanation: 'Last night = Past Simple' },
    { id: 5011, type: 'multiple-choice', instruction: 'Qaysi zamon to\'g\'ri?', question: 'I ___ (read) when the phone rang.', options: ['read', 'was reading', 'am reading', 'have read'], correct: 'was reading', explanation: 'Uzilgan harakat → Past Continuous' },
    { id: 5012, type: 'multiple-choice', instruction: 'Qaysi zamon to\'g\'ri?', question: 'It ___ (rain) tomorrow.', options: ['rains', 'is raining', 'will rain', 'has rained'], correct: 'will rain', explanation: 'Tomorrow = Future Simple' },
    { id: 5013, type: 'multiple-choice', instruction: 'Qaysi zamon to\'g\'ri?', question: 'She ___ (eat) lunch right now.', options: ['eats', 'is eating', 'ate', 'has eaten'], correct: 'is eating', explanation: 'Right now = Present Continuous' },
    { id: 5014, type: 'multiple-choice', instruction: 'Qaysi zamon to\'g\'ri?', question: 'I ___ (visit) Paris three times.', options: ['visited', 'visit', 'have visited', 'was visiting'], correct: 'have visited', explanation: 'Tajriba (three times) = Present Perfect' },
    { id: 5015, type: 'multiple-choice', instruction: 'Qaysi zamon to\'g\'ri?', question: 'He ___ (not/finish) his homework yet.', options: ['didn\'t finish', 'doesn\'t finish', 'hasn\'t finished', 'wasn\'t finishing'], correct: 'hasn\'t finished', explanation: 'Yet = Present Perfect' },
    { id: 5016, type: 'multiple-choice', instruction: 'Qaysi zamon to\'g\'ri?', question: 'While I ___ (cook), the smoke alarm went off.', options: ['cooked', 'was cooking', 'cook', 'have cooked'], correct: 'was cooking', explanation: 'While + davomiylik → Past Continuous' },
    { id: 5017, type: 'multiple-choice', instruction: 'Qaysi zamon to\'g\'ri?', question: 'We ___ (go) to the cinema last Friday.', options: ['go', 'have gone', 'went', 'were going'], correct: 'went', explanation: 'Last Friday = Past Simple' },
    { id: 5018, type: 'multiple-choice', instruction: 'Qaysi zamon to\'g\'ri?', question: 'She ___ (work) right now. Don\'t disturb her.', options: ['works', 'is working', 'worked', 'has worked'], correct: 'is working', explanation: 'Right now = Present Continuous' },

    // ── O'RTACHA: Xato tuzatish ──
    { id: 5019, type: 'error-correction', instruction: 'Xatoni toping:', question: 'I have visited Paris yesterday.', errorPart: 'have visited', correct: 'I visited Paris yesterday.', explanation: 'Yesterday = Past Simple, Present Perfect emas' },
    { id: 5020, type: 'error-correction', instruction: 'Xatoni toping:', question: 'She is knowing the answer.', errorPart: 'is knowing', correct: 'She knows the answer.', explanation: 'Know = state verb, Simple Present' },
    { id: 5021, type: 'error-correction', instruction: 'Xatoni toping:', question: 'I was reading the book when I have finished it.', errorPart: 'have finished', correct: 'I was reading the book when I finished it.', explanation: 'Past Simple (tugallangan) kerak' },
    { id: 5022, type: 'error-correction', instruction: 'Xatoni toping:', question: 'He will can help you.', errorPart: 'will can', correct: 'He will help you.', explanation: 'Will dan keyin V1, modal emas' },
    { id: 5023, type: 'error-correction', instruction: 'Xatoni toping:', question: 'She has went to school.', errorPart: 'has went', correct: 'She has gone to school.', explanation: 'V3 kerak: go → gone (went emas!)' },

    // ── O'RTACHA: Qayta yozish ──
    { id: 5024, type: 'transformation', instruction: 'Inkoriyga o\'zgartiring:', question: 'She works every day.', hint: 'Negative:', correct: "She doesn't work every day.", explanation: 'Simple Present inkor: doesn\'t + V1' },
    { id: 5025, type: 'transformation', instruction: 'Savolga o\'zgartiring:', question: 'He has finished his homework.', hint: 'Question:', correct: 'Has he finished his homework?', explanation: 'Present Perfect savol: Has + S + V3?' },
    { id: 5026, type: 'transformation', instruction: 'Past Continuous ga o\'zgartiring:', question: 'I read a book at 8 PM yesterday.', hint: 'Past Continuous:', correct: 'I was reading a book at 8 PM yesterday.', explanation: 'Past Continuous: was/were + V-ing' },
    { id: 5027, type: 'transformation', instruction: 'Future Simple ga o\'zgartiring:', question: 'I go to school every day.', hint: 'Future (tomorrow):', correct: 'I will go to school tomorrow.', explanation: 'Future Simple: will + V1' },

    // ── QIYIN: Murakkab taqqoslash ──
    { id: 5028, type: 'fill-blank', instruction: '2 ta zamon kerak:', question: 'I ___ (study) when my mother ___ (call) me.', blanks: ['was studying', 'called'], explanation: 'Past Continuous + Past Simple (uzilgan harakat)' },
    { id: 5029, type: 'fill-blank', instruction: '2 ta zamon kerak:', question: 'She ___ (live) in London for 10 years, so she ___ (know) every street.', blanks: ['has lived', 'knows'], explanation: 'Present Perfect + Present Simple (natija + odat)' },
    { id: 5030, type: 'fill-blank', instruction: '2 ta zamon kerak:', question: 'I ___ (visit) many countries. I usually ___ (travel) in summer.', blanks: ['have visited', 'travel'], explanation: 'Present Perfect (tajriba) + Simple Present (odat)' },
    { id: 5031, type: 'fill-blank', instruction: 'To\'g\'ri zamoni yozing:', question: 'While she ___ (cook), I ___ (set) the table.', blanks: ['was cooking', 'was setting'], explanation: 'Past Continuous + while + Past Continuous' },
    { id: 5032, type: 'fill-blank', instruction: 'To\'g\'ri zamoni yozing:', question: 'I ___ (read) for two hours, but I still ___ (not/finish) the book.', blanks: ['have been reading', "haven't finished"], explanation: 'Present Perfect Continuous + Present Perfect' },

    // ── QIYIN: Context-based choice ──
    { id: 5033, type: 'multiple-choice', instruction: 'Qaysi gap to\'g\'ri?', question: 'Which sentence is correct?', options: ['I have seen him yesterday', 'I saw him yesterday', 'I see him yesterday', 'I was seeing him yesterday'], correct: 'I saw him yesterday', explanation: 'Yesterday = Past Simple' },
    { id: 5034, type: 'multiple-choice', instruction: 'Qaysi gap to\'g\'ri?', question: 'Which sentence is correct?', options: ['She has been to Paris twice', 'She has gone to Paris twice', 'She went Paris twice', 'She is going Paris twice'], correct: 'She has been to Paris twice', explanation: 'Tajriba = has been (borib qaytgan)' },
    { id: 5035, type: 'multiple-choice', instruction: 'Qaysi gap to\'g\'ri?', question: 'Which sentence is correct?', options: ['I was sleeping when he arrived', 'I was sleeping when he has arrived', 'I slept when he arrived', 'I have slept when he arrived'], correct: 'I was sleeping when he arrived', explanation: 'Past Continuous + when + Past Simple' },

    // ── QIYIN: Passage (matn) ──
    { id: 5036, type: 'passage', instruction: 'Bo\'sh joylarni to\'ldiring:', passage: 'Last summer, I ___ (travel) to Istanbul. I ___ (stay) there for two weeks. On the first day, I ___ (visit) the Blue Mosque. While I ___ (walk) through the old city, I ___ (meet) my old friend. We ___ (not/see) each other for five years! We ___ (have) dinner together and ___ (talk) about our lives. I ___ (enjoy) the trip so much that I ___ (decide) to go back next year.', blanks: ['traveled', 'stayed', 'visited', 'was walking', 'met', "hadn't seen", 'had', 'talked', 'enjoyed', 'decided'], explanation: 'Past Simple: traveled, stayed, visited, met, talked, enjoyed, decided. Past Continuous: was walking. Past Perfect: hadn\'t seen. Past Simple: had, decided.' },
  ],
  exerciseSections: [
    { title: 'Oddiy', desc: 'Bitta zamoni aniqlang', color: 'bg-emerald-500', icon: '🌱', ids: [5001, 5002, 5003, 5004, 5005, 5006, 5007, 5008] },
    { title: 'O\'rtacha — Taqqoslash', desc: 'Qaysi zamon to\'g\'ri?', color: 'bg-blue-500', icon: '📘', ids: [5009, 5010, 5011, 5012, 5013, 5014, 5015, 5016, 5017, 5018] },
    { title: 'O\'rtacha — Tuzatish', desc: 'Xatolarni toping va tuzating', color: 'bg-purple-500', icon: '🔧', ids: [5019, 5020, 5021, 5022, 5023, 5024, 5025, 5026, 5027] },
    { title: 'Qiyin', desc: 'Murakkab taqqoslash', color: 'bg-violet-500', icon: '💪', ids: [5028, 5029, 5030, 5031, 5032, 5033, 5034, 5035] },
    { title: 'Murakkab', desc: 'Matn — yakuniy sinov', color: 'bg-rose-500', icon: '🏆', ids: [5036] },
  ],
  tests: [
    // ── OSON ──
    { id: 5101, type: 'multiple-choice', instruction: 'Asosiy qoidalar', question: 'Simple Present qanday yasaladi?', options: ['I/You/We/They + V1', 'am/is/are + V-ing', 'have/has + V3', 'will + V1'], correct: 'I/You/We/They + V1', explanation: 'Simple Present = V1 (odat, haqiqat)' },
    { id: 5102, type: 'multiple-choice', instruction: 'Asosiy qoidalar', question: 'Present Continuous qanday yasaladi?', options: ['I + V1', 'I + am + V-ing', 'I + have + V3', 'I + will + V1'], correct: 'I + am + V-ing', explanation: 'Present Continuous = am/is/are + V-ing (hozir)' },
    { id: 5103, type: 'multiple-choice', instruction: 'Asosiy qoidalar', question: 'Past Simple qanday yasaladi?', options: ['I + was + V-ing', 'I + have + V3', 'I + V2 (went, saw)', 'I + will + V1'], correct: 'I + V2 (went, saw)', explanation: 'Past Simple = V2 (o\'tmish)' },
    { id: 5104, type: 'multiple-choice', instruction: 'Asosiy qoidalar', question: 'Future Simple qanday yasaladi?', options: ['I + V1', 'I + am + V-ing', 'I + have + V3', 'I + will + V1'], correct: 'I + will + V1', explanation: 'Future Simple = will + V1 (kelajak)' },
    { id: 5105, type: 'multiple-choice', instruction: 'Asosiy qoidalar', question: 'Present Perfect qanday yasaladi?', options: ['I + V1', 'I + am + V-ing', 'I + have/has + V3', 'I + was + V-ing'], correct: 'I + have/has + V3', explanation: 'Present Perfect = have/has + V3 (tajriba, natija)' },
    { id: 5106, type: 'multiple-choice', instruction: 'Asosiy qoidalar', question: 'Past Continuous qanday yasaladi?', options: ['I + V2', 'I + was + V-ing', 'I + have + V3', 'I + will + V1'], correct: 'I + was + V-ing', explanation: 'Past Continuous = was/were + V-ing (davom etgan)' },

    // ── O'RTACHA ──
    { id: 5107, type: 'multiple-choice', instruction: 'Signal so\'zlar', question: '"Every day" — qaysi zamon signal so\'zi?', options: ['Present Simple', 'Present Continuous', 'Past Simple', 'Future Simple'], correct: 'Present Simple', explanation: 'Every day = odat = Simple Present' },
    { id: 5108, type: 'multiple-choice', instruction: 'Signal so\'zlar', question: '"Yesterday" — qaysi zamon signal so\'zi?', options: ['Present Simple', 'Present Perfect', 'Past Simple', 'Future Simple'], correct: 'Past Simple', explanation: 'Yesterday = aniq o\'tmish = Past Simple' },
    { id: 5109, type: 'multiple-choice', instruction: 'Signal so\'zlar', question: '"Since 2020" — qaysi zamon signal so\'zi?', options: ['Present Simple', 'Present Perfect', 'Past Simple', 'Past Continuous'], correct: 'Present Perfect', explanation: 'Since = Present Perfect (shundan beri)' },
    { id: 5110, type: 'multiple-choice', instruction: 'Signal so\'zlar', question: '"Right now" — qaysi zamon signal so\'zi?', options: ['Present Simple', 'Present Continuous', 'Past Simple', 'Future Simple'], correct: 'Present Continuous', explanation: 'Right now = hozir = Present Continuous' },
    { id: 5111, type: 'multiple-choice', instruction: 'Signal so\'zlar', question: '"When I was young" — qaysi zamon?', options: ['Present Simple', 'Present Perfect', 'Past Simple', 'Future Simple'], correct: 'Past Simple', explanation: 'When I was young = o\'tmish = Past Simple' },
    { id: 5112, type: 'multiple-choice', instruction: 'Signal so\'zlar', question: '"Tomorrow" — qaysi zamon signal so\'zi?', options: ['Present Simple', 'Past Simple', 'Future Simple', 'Present Perfect'], correct: 'Future Simple', explanation: 'Tomorrow = kelajak = Future Simple' },

    // ── O'RTACHA: Taqqoslash ──
    { id: 5113, type: 'multiple-choice', instruction: 'Taqqoslash', question: '"I drink tea" vs "I am drinking tea" — farq?', options: ['Ikkalasi ham bir xil', 'Birinchi = hozir, ikkinchi = odat', 'Birinchi = odat, ikkinchi = hozir', 'Birinchi = o\'tmish, ikkinchi = hozir'], correct: 'Birinchi = odat, ikkinchi = hozir', explanation: 'Simple = odat, Continuous = hozirgi harakat' },
    { id: 5114, type: 'multiple-choice', instruction: 'Taqqoslash', question: '"I went" vs "I have gone" — farq?', options: ['Ikkalasi ham bir xil', 'Birinchi = o\'tmish tugallangan, ikkinchi = hozirgi natija', 'Birinchi = hozir, ikkinchi = o\'tmish', 'Ikkalasi ham hozir'], correct: 'Birinchi = o\'tmish tugallangan, ikkinchi = hozirgi natija', explanation: 'Past Simple = tugallangan, Present Perfect = natija' },
    { id: 5115, type: 'multiple-choice', instruction: 'Taqqoslash', question: '"I was reading" vs "I read" — farq?', options: ['Ikkalasi ham bir xil', 'Birinchi = davom etgan, ikkinchi = tugallangan', 'Birinchi = hozir, ikkinchi = o\'tmish', 'Birinchi = kelajak, ikkinchi = o\'tmish'], correct: 'Birinchi = davom etgan, ikkinchi = tugallangan', explanation: 'Past Continuous = davom, Past Simple = tugallangan' },

    // ── QIYIN ──
    { id: 5116, type: 'multiple-choice', instruction: 'Murakkab', question: 'Which is correct?', options: ['She has been to Paris yesterday', 'She went to Paris yesterday', 'She goes to Paris yesterday', 'She was going to Paris yesterday'], correct: 'She went to Paris yesterday', explanation: 'Yesterday = Past Simple' },
    { id: 5117, type: 'multiple-choice', instruction: 'Murakkab', question: 'Which is correct?', options: ['I am knowing the answer', 'I know the answer', 'I known the answer', 'I knowing the answer'], correct: 'I know the answer', explanation: 'Know = state verb, Simple Present' },
    { id: 5118, type: 'multiple-choice', instruction: 'Murakkab', question: 'Which is correct?', options: ['While I was sleeping, the phone rang', 'While I slept, the phone was ringing', 'While I was sleeping, the phone was ringed', 'While I sleeping, the phone rang'], correct: 'While I was sleeping, the phone rang', explanation: 'While + Past Continuous + when + Past Simple' },
    { id: 5119, type: 'multiple-choice', instruction: 'Murakkab', question: '"I ___ this book three times." — qaysi zamon?', options: ['read', 'am reading', 'have read', 'was reading'], correct: 'have read', explanation: 'Three times = tajriba = Present Perfect' },
    { id: 5120, type: 'multiple-choice', instruction: 'Murakkab', question: '"She ___ dinner when I ___ home."', options: ['cooked...came', 'was cooking...came', 'was cooking...was coming', 'cooked...was coming'], correct: 'was cooking...came', explanation: 'Past Continuous + when + Past Simple' },
    { id: 5121, type: 'multiple-choice', instruction: 'Murakkab', question: 'Which is correct?', options: ['He has went to school', 'He has gone to school', 'He has go to school', 'He has going to school'], correct: 'He has gone to school', explanation: 'V3: go → gone (went emas!)' },
    { id: 5122, type: 'multiple-choice', instruction: 'Murakkab', question: '"I ___ in Tashkent ___ 2015."', options: ['live...since', 'have lived...since', 'have lived...for', 'am living...since'], correct: 'have lived...since', explanation: 'Since = boshlanish nuqtasi = Present Perfect' },
    { id: 5123, type: 'multiple-choice', instruction: 'Murakkab', question: 'Which is correct?', options: ['She doesn\'t likes coffee', 'She doesn\'t like coffee', 'She not like coffee', 'She isn\'t like coffee'], correct: 'She doesn\'t like coffee', explanation: 'doesn\'t + V1 (like, likes emas!)' },

    // ── YUQORI DARAJA ──
    { id: 5124, type: 'multiple-choice', instruction: 'Yuqori daraja', question: '"By the time I arrived, she ___."', options: ['left', 'has left', 'had left', 'was leaving'], correct: 'had left', explanation: 'Past Perfect — oldin tugallangan (darajali o\'tmish)' },
    { id: 5125, type: 'multiple-choice', instruction: 'Yuqori daraja', question: '"I ___ English for five years, but I still can\'t speak fluently."', options: ['study', 'am studying', 'have been studying', 'studied'], correct: 'have been studying', explanation: 'Davom etayotgan = Present Perfect Continuous' },
    { id: 5126, type: 'multiple-choice', instruction: 'Yuqori daraja', question: '"She would rather ___ at home tonight."', options: ['staying', 'stay', 'to stay', 'stayed'], correct: 'stay', explanation: 'would rather + V1 (maslahat)' },
    { id: 5127, type: 'multiple-choice', instruction: 'Yuqori daraja', question: '"If it ___ tomorrow, we will stay home."', options: ['rains', 'will rain', 'rained', 'is raining'], correct: 'rains', explanation: 'Zero/First conditional: if + Simple Present' },
    { id: 5128, type: 'multiple-choice', instruction: 'Yuqori daraja', question: '"He asked me where I ___."', options: ['live', 'lived', 'am living', 'have lived'], correct: 'lived', explanation: 'Reported speech: Simple Present → Past Simple' },
    { id: 5129, type: 'multiple-choice', instruction: 'Yuqori daraja', question: '"She ___ all her life in this city."', options: ['lived', 'has lived', 'lives', 'is living'], correct: 'has lived', explanation: 'All her life = davom = Present Perfect' },
  ],
  testSections: [
    { title: 'Oson', desc: 'Asosiy qoidalar', color: 'bg-emerald-500', icon: '🌱', ids: [5101, 5102, 5103, 5104, 5105, 5106] },
    { title: "O'rtacha", desc: 'Signal so\'zlar', color: 'bg-blue-500', icon: '📘', ids: [5107, 5108, 5109, 5110, 5111, 5112, 5113, 5114, 5115] },
    { title: 'Qiyin', desc: 'Taqqoslash', color: 'bg-violet-500', icon: '💪', ids: [5116, 5117, 5118, 5119, 5120, 5121, 5122, 5123] },
    { title: 'Murakkab', desc: 'Yuqori daraja', color: 'bg-rose-500', icon: '🏆', ids: [5124, 5125, 5126, 5127, 5128, 5129] },
  ],
}
