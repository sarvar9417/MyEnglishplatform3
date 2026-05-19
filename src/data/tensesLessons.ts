import type { DailyLesson } from './dailyLessons'

// ════════════════════════════════════════════════════════════════════════════
// 1. SIMPLE PRESENT (Simple Present Tense)
// ════════════════════════════════════════════════════════════════════════════
const simplePresent: DailyLesson = {
  id: 'simple-present',
  title: 'Simple Present Tense',
  subtitle: 'Har kuni takrorlaniladigan harakatlar, odatiy vakiyalar va to\'liq haqiqatlar',
  level: 'A1',
  day: 2,
  formulas: [
    { label: 'Affirmative (Ijobiy)', structure: 'I/You/We/They + verb | He/She/It + verb+s', color: 'green' },
    { label: 'Negative (Inkoriy)', structure: "I/You/We/They + don't + verb | He/She/It + doesn't + verb", color: 'red' },
    { label: 'Question (Savol)', structure: "Do/Does + subject + verb? | What does he do?", color: 'blue' },
  ],
  rules: [
    "Simple Present — har kuni takroriladigan harakatlar, odatiy vakiyalar va to'liq haqiqatlar uchun ishlatiladi.",
    "He/She/It bilan -s/-es qo'shimchasi qo'shiladi: He plays, She works, It rains.",
    "Inkoriy: don't (I/you/we/they), doesn't (he/she/it). Orqali verb shaklida o'zgarish bo'lmaydi.",
    "Savollarda: Do I like? Does he like? Does + he/she/it, do + boshqalar.",
    "Frequency adverbs bilan: always, usually, often, sometimes, rarely, never — odatiy haraka orqasida yoki verbning orqasida.",
  ],
  vocabulary: [
    { en: 'play', uz: "o'yna", example: 'I play football every day.', rule: 'base form' },
    { en: 'work', uz: 'ishlash', example: 'She works in an office.', rule: 'base form' },
    { en: 'study', uz: "o'qish", example: 'He studies English.', rule: 'y->ies' },
    { en: 'go', uz: 'borish', example: 'They go to school.', rule: 'base form' },
    { en: 'eat', uz: "ovqat qabul qilish", example: 'We eat lunch at noon.', rule: 'base form' },
    { en: 'sleep', uz: 'uxlash', example: 'The baby sleeps 8 hours.', rule: 'base form' },
    { en: 'like', uz: 'yoqtirish', example: 'I like pizza.', rule: 'base form' },
    { en: 'watch', uz: "ko'rish", example: 'He watches TV every night.', rule: 'ch->ches' },
    { en: 'live', uz: 'yasash', example: 'We live in Tashkent.', rule: 'base form' },
    { en: 'speak', uz: 'gapirib', example: 'She speaks English well.', rule: 'base form' },
  ],
  examples: [
    { en: 'I go to work every morning.', uz: 'Men har kuni ertalab ishga boraман.' },
    { en: 'She likes reading books.', uz: 'Unga kitob o\'qish yoqadi.' },
    { en: 'We play football on weekends.', uz: 'Biz hafta oxiride futbol o\'ynaymiz.' },
    { en: 'He does not drink coffee.', uz: 'U qahva ichmaydi.' },
    { en: 'Does she speak Russian?', uz: 'U rus tilida gapiradimi?' },
    { en: 'They always arrive on time.', uz: 'Ular doim vaqtida kelishadi.' },
  ],
  specialCases: [
    {
      id: 'third-person-s',
      title: 'He/She/It bilan -s/-es qo\'shimchasi',
      rule: 'He/She/It bilan -s yoki -es qo\'shimchasi qo\'shiladi. Qoidalar: x, z, ch, sh, s bilan tugagan so\'zlarga -es qo\'shiladi, -y bilan tugagan so\'zlarda y→i + -es',
      mnemonic: 'He/She/It = Has qisqartmasi (H.S.I = HAS). Shuning uchun -s qo\'shimchasi. CHESS = ch, s, sh bilan tugasa -es (watches, buses, rushes).',
      commonMistakes: 'go → gos ❌ (goes), play → plays ✓, study → studys ❌ (studies), watch → watchs ❌ (watches)',
      examples: [
        { en: 'He goes to school.', uz: 'U maktabga boradi.' },
        { en: 'She studies hard.', uz: 'U qattiq o\'qiydi.' },
        { en: 'It rains every day.', uz: 'U har kuni yomg\'ir yog\'adi.' },
      ],
      drills: [
        { id: 201, type: 'fill-blank', instruction: 'He/She/It uchun to\'g\'ri shaklni yozing:', question: 'He ___ (play) tennis.', blanks: ['plays'], explanation: "Play + s = plays" },
        { id: 202, type: 'fill-blank', instruction: 'He/She/It uchun to\'g\'ri shaklni yozing:', question: 'She ___ (study) English.', blanks: ['studies'], explanation: "Study: y → i + es = studies" },
        { id: 203, type: 'fill-blank', instruction: 'He/She/It uchun to\'g\'ri shaklni yozing:', question: 'The cat ___ (watch) birds.', blanks: ['watches'], explanation: "Watch: ch bilan tugasa -es qo'shiladi: watches" },
        { id: 204, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: 'He ___ coffee every morning.', options: ['drink', 'drinks', 'drinkes', 'drinking'], correct: 'drinks', explanation: "He/She/It bilan -s qo'shimchasi: drinks" },
        { id: 205, type: 'error-correction', instruction: 'Xatoni toping va to\'g\'irlang:', question: 'She go to the office every day.', errorPart: 'go', correct: 'She goes to the office every day.', explanation: 'She bilan goes (go + es emas, go → goes)' },
      ],
    },
    {
      id: 'do-does',
      title: "Don't / Doesn't va Do / Does savollar",
      rule: "Inkoriy: I/you/we/they + don't; He/she/it + doesn't. Savollarda: Do I/you/we/they...? Does he/she/it...?",
      mnemonic: "Does = He/She/It uchun. Do = boshqalarning barchasi. D-S: Does-She/He",
      commonMistakes: "I don't likes ❌ (I don't like), He don't ❌ (He doesn't), Does you speak? ❌ (Do you speak?)",
      examples: [
        { en: "I don't like spicy food.", uz: "Mening o'tkir ovqatga yoqtirmaydi." },
        { en: "She doesn't watch TV.", uz: "U telekanalda qarmaymaydi." },
        { en: 'Do you speak English?', uz: 'Siz ingliz tilida gapirasizmi?' },
      ],
      drills: [
        { id: 206, type: 'fill-blank', instruction: "Don't/Doesn't bilan to'ldiring:", question: "I ___ (not/like) coffee.", blanks: ["don't like"], explanation: "I bilan don't qo'shiladi" },
        { id: 207, type: 'fill-blank', instruction: "Do/Does savoli bilan to'ldiring:", question: "___ you speak French?", blanks: ['Do'], explanation: "You bilan Do ishlatiladi" },
        { id: 208, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: "He ___ play video games.", options: ['do not', "doesn't", 'does not', 'ikki va uch to\'g\'ri'], correct: 'ikki va uch to\'g\'ri', explanation: "He + doesn't yoki does not — bir xil ma'noli" },
        { id: 209, type: 'transformation', instruction: 'Ijobiydan inkoriy yapying:', question: 'She likes ice cream.', hint: "She ___ ice cream.", correct: "She doesn't like ice cream.", explanation: "Ijobiy → inkoriy: She doesn't..." },
      ],
    },
  ],
  exercises: [
    { id: 1, type: 'fill-blank', instruction: 'To\'liq gapni yozing:', question: 'I ___ (go) to school every day.', blanks: ['go'], explanation: 'Simple Present: I + base form' },
    { id: 2, type: 'fill-blank', instruction: 'To\'liq gapni yozing:', question: 'He ___ (like) playing football.', blanks: ['likes'], explanation: 'He/She/It + verb + s: likes' },
    { id: 3, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: 'She ___ coffee every morning.', options: ['drink', 'drinks', 'is drinking', 'drinking'], correct: 'drinks', explanation: 'She bilan drinks (Simple Present)' },
    { id: 4, type: 'fill-blank', instruction: "Don't/Doesn't bilan to'ldiring:", question: "I ___ (not/eat) meat.", blanks: ["don't eat"], explanation: "I bilan don't qo'shiladi" },
    { id: 5, type: 'error-correction', instruction: 'Xatoni toping:', question: 'He go to the gym every day.', errorPart: 'go', correct: 'He goes to the gym every day.', explanation: 'He bilan -s qo\'shimchasi kerak' },
    { id: 6, type: 'fill-blank', instruction: 'Savolni yozing:', question: '___ they play chess?', blanks: ['Do'], explanation: 'They bilan Do ishlatiladi' },
    { id: 7, type: 'transformation', instruction: 'Qayta yozing:', question: 'We eat lunch at 12.', hint: 'Negative:', correct: "We don't eat lunch at 12.", explanation: "We bilan don't" },
    { id: 8, type: 'fill-blank', instruction: "He/She/It qoidasiga amal qiling:", question: 'The cat ___ (sleep) all day.', blanks: ['sleeps'], explanation: 'It (the cat) bilan -s: sleeps' },
  ],
  exerciseSections: [
    { title: 'Boshlang\'ich', desc: 'Asosiy formalar', color: 'bg-emerald-500', icon: '🌱', ids: [1, 2, 3, 4] },
    { title: 'O\'rganish', desc: 'Inkoriy va savollar', color: 'bg-blue-500', icon: '📘', ids: [5, 6, 7, 8] },
  ],
}

// ════════════════════════════════════════════════════════════════════════════
// 2. PRESENT CONTINUOUS (Present Continuous Tense)
// ════════════════════════════════════════════════════════════════════════════
const presentContinuous: DailyLesson = {
  id: 'present-continuous',
  title: 'Present Continuous Tense',
  subtitle: 'Hozirgi vaqtda sodir bo\'llayotgan harakatlar — "HOZIR, SHUNGA ISHLAYAPTI"',
  level: 'A1',
  day: 3,
  formulas: [
    { label: 'Affirmative (Ijobiy)', structure: 'am/is/are + verb+ing', color: 'green' },
    { label: 'Negative (Inkoriy)', structure: "am not/isn't/aren't + verb+ing", color: 'red' },
    { label: 'Question (Savol)', structure: "Am/Is/Are + subject + verb+ing?", color: 'blue' },
  ],
  rules: [
    "Present Continuous — hozirgi vaqtda sodir bo\'llayotgan harakatlar uchun. I + am, he/she/it + is, you/we/they + are",
    "Verb + -ing qo'shimchasi: play → playing, run → running, sit → sitting",
    "-e bilan tugagan so'zlarda -e tashlanadi: make → making, come → coming",
    "-ie bilan tugagan so'zlarda -ie → y + ing: lie → lying, die → dying",
    "Bir undosh orqasidagi unli + undosh: stop → stopping, sit → sitting (CVC qoidasi)",
  ],
  vocabulary: [
    { en: 'run', uz: 'yugurish', example: 'She is running in the park.', rule: 'base + ing' },
    { en: 'sit', uz: "o'tirish", example: 'They are sitting on the bench.', rule: 'CVC: t→tt' },
    { en: 'eat', uz: "ovqat qabul qilish", example: 'We are eating lunch now.', rule: 'base + ing' },
    { en: 'sleep', uz: 'uxlash', example: 'The baby is sleeping.', rule: 'base + ing' },
    { en: 'write', uz: 'yozish', example: 'I am writing an email.', rule: '-e tashlanadi: writing' },
    { en: 'make', uz: 'yasash', example: 'He is making a cake.', rule: '-e tashlanadi: making' },
    { en: 'teach', uz: "ta'lim berish", example: 'She is teaching English.', rule: 'base + ing' },
    { en: 'swim', uz: 'sho\'ninch', example: 'We are swimming now.', rule: 'CVC: m→mm' },
  ],
  examples: [
    { en: "I'm reading a book right now.", uz: 'Hozir men kitob o\'qiyapman.' },
    { en: 'She is watching TV at the moment.', uz: 'U hozir televizo ko\'rayapti.' },
    { en: 'They are playing football.', uz: 'Ular futbol o\'ynayotishadi.' },
    { en: "He isn't listening to me.", uz: 'U menga eshitmaypti.' },
    { en: 'Are you studying for the exam?', uz: 'Siz imtihonga tayyorlanayapsizmi?' },
  ],
  specialCases: [
    {
      id: 'am-is-are',
      title: 'am/is/are bilan qarama-qarshi harakat',
      rule: "I am + verb+ing, He/She/It is + verb+ing, You/We/They are + verb+ing",
      mnemonic: "A.I.A: I Am, He/sHe Is, All others Are. 'Am' = I uchun, 'Is' = u/shu/bu uchun, 'Are' = biz/siz/ular uchun",
      commonMistakes: "I is playing ❌ (I am), He are playing ❌ (He is), We is playing ❌ (We are)",
      examples: [
        { en: "I'm working on the project.", uz: "Men loyihada ishlamoqchiman." },
        { en: 'She is cooking dinner.', uz: 'U kechki ovqat tayyorlamoqda.' },
        { en: 'We are having a meeting.', uz: 'Biz yig\'ilishda bo\'lmoqdamiz.' },
      ],
      drills: [
        { id: 301, type: 'fill-blank', instruction: 'am/is/are ni tanlang:', question: 'I ___ listening to music.', blanks: ['am'], explanation: 'I bilan am' },
        { id: 302, type: 'fill-blank', instruction: 'am/is/are ni tanlang:', question: 'He ___ playing tennis.', blanks: ['is'], explanation: 'He bilan is' },
        { id: 303, type: 'fill-blank', instruction: 'am/is/are ni tanlang:', question: 'They ___ eating lunch.', blanks: ['are'], explanation: 'They bilan are' },
      ],
    },
    {
      id: 'ing-rules',
      title: 'Verb + -ing qo\'shimchasi qoidalari',
      rule: "Shunchaki -ing qo'shish: go → going. -e bilan tugasa e tashlanadi: make → making. CVC qoidasi: sit → sitting (t ikki marta)",
      mnemonic: "GIVE = -e tashlanadi (giving). STOP = CVC (stopping - p ikki marta). GO = shunchaki -ing: going.",
      commonMistakes: "makeing ❌ (making), comming ❌ (coming), stoping ❌ (stopping)",
      examples: [
        { en: 'She is making breakfast.', uz: 'U nonushtani tayyorlamoqda.' },
        { en: 'We are coming soon.', uz: 'Biz tez kelamiz.' },
        { en: 'He is stopping the car.', uz: "U mashinani to'xtamoqda." },
      ],
      drills: [
        { id: 304, type: 'fill-blank', instruction: 'Verb + ing qo\'shimchasi:', question: 'They are ___ (run) fast.', blanks: ['running'], explanation: "Run: n ikki marta (CVC) → running" },
        { id: 305, type: 'fill-blank', instruction: 'Verb + ing qo\'shimchasi:', question: "I'm ___ (make) dinner.", blanks: ['making'], explanation: "-e tashlanadi: make → making" },
      ],
    },
  ],
  exercises: [
    { id: 1, type: 'fill-blank', instruction: 'am/is/are bilan to\'ldiring:', question: "I ___ writing an email.", blanks: ['am'], explanation: 'I + am' },
    { id: 2, type: 'fill-blank', instruction: 'Verb + ing qo\'shimchasi:', question: 'She ___ (play) the piano.', blanks: ['is playing'], explanation: 'is + playing' },
    { id: 3, type: 'multiple-choice', instruction: "To'g'ri variantni tanlang:", question: 'They ___ studying for the test.', options: ['is', 'am', 'are', 'be'], correct: 'are', explanation: 'They bilan are' },
    { id: 4, type: 'error-correction', instruction: 'Xatoni toping:', question: 'He is make a sandwich.', errorPart: 'make', correct: 'He is making a sandwich.', explanation: "Verb + ing: make → making (-e tashlanadi)" },
    { id: 5, type: 'fill-blank', instruction: "Inkoriy: aren't/isn't", question: "I ___ (not/listen) to you.", blanks: ["am not listening"], explanation: "I + am not + verb+ing" },
  ],
  exerciseSections: [
    { title: 'Boshlang\'ich', desc: 'am/is/are formalar', color: 'bg-emerald-500', icon: '🌱', ids: [1, 2, 3] },
    { title: 'Mashq', desc: 'Inkoriy va savollar', color: 'bg-blue-500', icon: '📘', ids: [4, 5] },
  ],
}

// ════════════════════════════════════════════════════════════════════════════
// 3. SIMPLE PAST (Simple Past Tense)
// ════════════════════════════════════════════════════════════════════════════
const simplePast: DailyLesson = {
  id: 'simple-past',
  title: 'Simple Past Tense',
  subtitle: "O'tgan vaqtda tugagan harakatlar va vakiyalar — 'KECHA QILDIM, ERTA QILDIM'",
  level: 'A1',
  day: 4,
  formulas: [
    { label: 'Regular (To\'g\'ri)', structure: 'base verb + -ed (played, worked, wanted)', color: 'green' },
    { label: 'Irregular (Noto\'g\'ri)', structure: 'go → went, eat → ate, see → saw', color: 'orange' },
    { label: 'Negative & Question', structure: "didn't + verb | Did + subject + verb?", color: 'red' },
  ],
  rules: [
    "Simple Past — o'tgan vaqtda tugagan harakatlar uchun.",
    "Regular verbs: base + -ed (play → played, work → worked)",
    "-e bilan tugagan so'zlarga faqat -d qo'shiladi: like → liked, move → moved",
    "Consonant + -y bilan tugasa: y → i + -ed (study → studied, try → tried)",
    "Irregular verbs: go → went, eat → ate, see → saw, take → took, come → came (yodda saqlash kerak)",
  ],
  vocabulary: [
    { en: 'play', uz: "o'yna", example: 'I played football yesterday.', rule: 'regular' },
    { en: 'work', uz: 'ishlash', example: 'She worked hard last week.', rule: 'regular' },
    { en: 'want', uz: 'xohish qilish', example: 'He wanted to go home.', rule: 'regular' },
    { en: 'go', uz: 'borish', example: 'They went to the cinema.', rule: 'went' },
    { en: 'eat', uz: "ovqat qabul qilish", example: 'We ate dinner at 7.', rule: 'ate' },
    { en: 'see', uz: "ko'rish", example: 'I saw him last night.', rule: 'saw' },
    { en: 'take', uz: "olib borish", example: 'She took a taxi to work.', rule: 'took' },
    { en: 'come', uz: 'borish', example: 'He came to the party.', rule: 'came' },
  ],
  examples: [
    { en: 'I went to the park yesterday.', uz: "Kecha men parkka bordim." },
    { en: 'She worked late last night.', uz: 'U kecha kech ishladimi.' },
    { en: 'They played football together.', uz: 'Ular birgalikda futbol o\'ynashdi.' },
    { en: "We didn't go to school.", uz: 'Biz maktabga bormadik.' },
    { en: 'Did you eat breakfast?', uz: 'Nonushtani qabul qildingizmi?' },
  ],
  specialCases: [
    {
      id: 'regular-past',
      title: 'Regular verbs: base + -ed',
      rule: "Ko'pchilik verblar: base form + -ed. -e bilan tugasa: like → liked. Consonant+-y: study → studied",
      mnemonic: "PAST = -ed. Most verbs + ed kuni: played, worked, wanted. Remember: -e before -d, y→i before -ed",
      commonMistakes: "playd ❌ (played), likeed ❌ (liked), studyed ❌ (studied)",
      examples: [
        { en: 'I played tennis yesterday.', uz: 'Kecha men tennisda o\'ynashim.' },
        { en: 'She liked the movie.', uz: 'Unga film yoqdi.' },
        { en: 'He studied English all night.', uz: 'U butun kech ingliz tilini o\'qidi.' },
      ],
      drills: [
        { id: 401, type: 'fill-blank', instruction: 'Simple Past + -ed:', question: 'I ___ (play) football yesterday.', blanks: ['played'], explanation: 'play → played' },
        { id: 402, type: 'fill-blank', instruction: 'Simple Past + -ed:', question: 'She ___ (like) the cake.', blanks: ['liked'], explanation: 'like → liked (-e bilan, faqat -d)' },
        { id: 403, type: 'fill-blank', instruction: 'Simple Past: y → i + -ed', question: 'He ___ (study) hard.', blanks: ['studied'], explanation: 'study → studied (y → i)' },
      ],
    },
    {
      id: 'irregular-past',
      title: 'Irregular verbs — noto\'g\'ri o\'tgan shakllari',
      rule: "Irregular verbs: go → went, eat → ate, see → saw, take → took, come → came, give → gave, have → had, do → did, say → said",
      mnemonic: "Go-Went (G-W), Eat-Ate (E-A), See-Saw (S-S). VILE = Go Went, Have Had, Do Did. Key 5: go/went, eat/ate, see/saw, come/came, be/was-were",
      commonMistakes: "goed ❌ (went), eated ❌ (ate), taked ❌ (took), comed ❌ (came)",
      examples: [
        { en: 'I went to the market.', uz: 'Men bozorga bordim.' },
        { en: 'She took her keys with her.', uz: 'U kalit olib turdi.' },
        { en: 'He came home late.', uz: 'U uyga kech keldi.' },
      ],
      drills: [
        { id: 404, type: 'fill-blank', instruction: 'Irregular past:', question: 'They ___ (go) to the beach.', blanks: ['went'], explanation: 'go → went' },
        { id: 405, type: 'fill-blank', instruction: 'Irregular past:', question: 'I ___ (see) a beautiful rainbow.', blanks: ['saw'], explanation: 'see → saw' },
        { id: 406, type: 'multiple-choice', instruction: 'Irregular past:',  question: 'He ___ (take) the bus to work.', options: ['taked', 'took', 'tooked', 'take'], correct: 'took', explanation: 'take → took' },
      ],
    },
    {
      id: 'did-didnot',
      title: "Didn't — inkoriy va savollar",
      rule: "Inkoriy va savollarda: did + not (didn't) + base form. Verb -ed shaklida bo'lmaydi!",
      mnemonic: "Did = o'tgan vaqta. Didn't + base form (played EMAS, play). Do/Does kabidir, lekin o'tganda did.",
      commonMistakes: "He didn't played ❌ (didn't play), Did he played? ❌ (Did he play?)",
      examples: [
        { en: "I didn't go to school yesterday.", uz: "Kecha maktabga bormasim." },
        { en: 'She did not eat breakfast.', uz: 'U nonushtani qabul qilmadi.' },
        { en: 'Did you see the match?', uz: 'Siz maorni ko\'rdingizmi?' },
      ],
      drills: [
        { id: 407, type: 'fill-blank', instruction: "Didn't + base form:", question: "I ___ (not/like) the food.", blanks: ["didn't like"], explanation: "Didn't + base form (liked emas)" },
        { id: 408, type: 'fill-blank', instruction: "Did savollar:", question: "___ you sleep well?", blanks: ['Did'], explanation: 'Did + subject + base form' },
      ],
    },
  ],
  exercises: [
    { id: 1, type: 'fill-blank', instruction: 'Simple Past + -ed:', question: 'I ___ (work) hard yesterday.', blanks: ['worked'], explanation: 'work → worked' },
    { id: 2, type: 'fill-blank', instruction: 'Irregular past:', question: 'She ___ (go) to Paris last year.', blanks: ['went'], explanation: 'go → went' },
    { id: 3, type: 'error-correction', instruction: 'Xatoni toping:', question: 'He taked the book from the shelf.', errorPart: 'taked', correct: 'He took the book from the shelf.', explanation: 'take → took' },
    { id: 4, type: 'fill-blank', instruction: "Didn't:", question: "We ___ (not/finish) the homework.", blanks: ["didn't finish"], explanation: "Didn't + base form" },
    { id: 5, type: 'multiple-choice', instruction: 'Simple Past:', question: 'They ___ chess yesterday.', options: ['played', 'plaied', 'plays', 'play'], correct: 'played', explanation: 'play → played' },
  ],
  exerciseSections: [
    { title: 'Regular Past', desc: 'base + -ed formalar', color: 'bg-emerald-500', icon: '🌱', ids: [1] },
    { title: 'Irregular', desc: 'Noto\'g\'ri o\'tgan shakllari', color: 'bg-orange-500', icon: '🔥', ids: [2, 3] },
    { title: 'Inkoriy/Savol', desc: 'Didn\'t va Did', color: 'bg-blue-500', icon: '📘', ids: [4, 5] },
  ],
}

// ════════════════════════════════════════════════════════════════════════════
// 4. PAST CONTINUOUS (Past Continuous Tense)
// ════════════════════════════════════════════════════════════════════════════
const pastContinuous: DailyLesson = {
  id: 'past-continuous',
  title: 'Past Continuous Tense',
  subtitle: "O'tganda bir vaqtda sodir bo'llayotgan harakatlari — 'MEN KO'CHADA YUGURGAN PAYTDA...'",
  level: 'A2',
  day: 5,
  formulas: [
    { label: 'Structure', structure: 'was/were + verb+ing', color: 'blue' },
    { label: 'Subject Agreement', structure: 'I/He/She/It was | You/We/They were', color: 'green' },
    { label: 'Negative & Question', structure: "wasn't/weren't + verb+ing | Was/Were + subject + verb+ing?", color: 'red' },
  ],
  rules: [
    "Past Continuous — o'tganda bir vaqtda davom etgan harakatlar uchun.",
    "I/He/She/It + was + verb+ing. You/We/They + were + verb+ing",
    "Often ikki Past harakati bo'lsa, Simple Past + Past Continuous: When I called, she was sleeping.",
    "Time expressions: at 3 o'clock, last night, yesterday afternoon, when...",
  ],
  vocabulary: [
    { en: 'sleep', uz: 'uxlash', example: 'I was sleeping when you called.', rule: 'was + sleeping' },
    { en: 'work', uz: 'ishlash', example: 'He was working in the garden.', rule: 'was + working' },
    { en: 'watch', uz: "ko'rish", example: 'They were watching TV last night.', rule: 'were + watching' },
    { en: 'read', uz: "o'qish", example: 'She was reading a book.', rule: 'was + reading' },
    { en: 'write', uz: 'yozish', example: 'I was writing emails all day.', rule: 'was + writing' },
  ],
  examples: [
    { en: "I was sleeping when the phone rang.", uz: "Telefon shon edi, men uxlab turgan edim." },
    { en: 'She was cooking dinner when he arrived.', uz: 'U kelgan paytda u tushlik tayyorlanardi.' },
    { en: 'They were playing football at 3 PM.', uz: 'Ular soat 3 da futbol o\'ynashardi.' },
    { en: "We weren't listening to him.", uz: 'Biz unga eshitmaydik.' },
  ],
  specialCases: [
    {
      id: 'was-were',
      title: 'was/were tanlash',
      rule: "I/He/She/It + was, You/We/They + were",
      mnemonic: "WAS = singular (I, he, she, it). WERE = plural (you, we, they)",
      commonMistakes: "I were playing ❌ (I was), He were working ❌ (He was)",
      examples: [
        { en: 'I was working.', uz: 'Men ishlayotgan edim.' },
        { en: 'He was studying.', uz: 'U o\'qiyotgan edi.' },
        { en: 'We were playing.', uz: 'Biz o\'ynayotgan edik.' },
      ],
      drills: [
        { id: 501, type: 'fill-blank', instruction: 'was/were tanlang:', question: 'I ___ sleeping at 10 PM.', blanks: ['was'], explanation: 'I bilan was' },
        { id: 502, type: 'fill-blank', instruction: 'was/were tanlang:', question: 'They ___ playing football.', blanks: ['were'], explanation: 'They bilan were' },
      ],
    },
  ],
  exercises: [
    { id: 1, type: 'fill-blank', instruction: 'was/were + verb+ing:', question: 'I ___ (read) a book at 8 PM.', blanks: ['was reading'], explanation: 'I + was + reading' },
    { id: 2, type: 'fill-blank', instruction: 'was/were + verb+ing:', question: 'They ___ (play) in the park.', blanks: ['were playing'], explanation: 'They + were + playing' },
    { id: 3, type: 'error-correction', instruction: 'Xatoni toping:', question: 'He were working on the project.', errorPart: 'were', correct: 'He was working on the project.', explanation: 'He bilan was' },
  ],
  exerciseSections: [
    { title: 'Asosiy', desc: 'was/were + ing', color: 'bg-blue-500', icon: '📘', ids: [1, 2, 3] },
  ],
}

// ════════════════════════════════════════════════════════════════════════════
// 5. PRESENT PERFECT (Present Perfect Tense)
// ════════════════════════════════════════════════════════════════════════════
const presentPerfect: DailyLesson = {
  id: 'present-perfect',
  title: 'Present Perfect Tense',
  subtitle: "O'tganda boshlanib hozir natijasi bor harakatlar — 'MEN KITOB O'QIDIM VA HOZIR OXIRI BOR'",
  level: 'A2',
  day: 6,
  formulas: [
    { label: 'Structure', structure: 'have/has + past participle', color: 'purple' },
    { label: 'Subject', structure: 'I/You/We/They have | He/She/It has', color: 'green' },
  ],
  rules: [
    "Present Perfect — o'tganda boshlanib, hozir oxiri hali tugamagan yoki o'tga natijasi hozir yangi bo'lgan harakatlar.",
    "Regular: have/has + base + -ed (have played, has worked)",
    "Irregular: have/has + past participle (have gone, has eaten, has seen)",
    "Just, already, yet, ever, never bilan ishlatiladigan vaqtlar.",
  ],
  vocabulary: [
    { en: 'go', uz: 'borish', example: 'I have never been to Japan.', rule: 'have/has gone' },
    { en: 'eat', uz: "ovqat qabul qilish", example: 'Have you eaten lunch?', rule: 'have/has eaten' },
    { en: 'see', uz: "ko'rish", example: 'She has seen that movie.', rule: 'have/has seen' },
    { en: 'live', uz: 'yasash', example: 'We have lived here for 10 years.', rule: 'have/has lived' },
  ],
  examples: [
    { en: 'I have finished my homework.', uz: 'Men uy vazifamni tugatdim.' },
    { en: 'She has never visited Paris.', uz: 'U hech qachon Parizga bormagan.' },
    { en: 'Have you eaten breakfast?', uz: 'Nonushtani qabul qildingizmi?' },
    { en: 'We have just arrived.', uz: 'Biz hozirgina keldik.' },
  ],
  specialCases: [
    {
      id: 'have-has',
      title: 'have/has tanlash',
      rule: "I/You/We/They + have, He/She/It + has",
      mnemonic: "Has 's' = He/She/It (3 xonali). Have = qolganlarning barchasi",
      commonMistakes: "I has done ❌ (I have done), He have gone ❌ (He has gone)",
      examples: [
        { en: 'I have completed the task.', uz: 'Men vazifani tugatdim.' },
        { en: 'He has finished his work.', uz: 'U o\'z ishini tugatdi.' },
      ],
      drills: [
        { id: 601, type: 'fill-blank', instruction: 'have/has:', question: 'I ___ seen that movie.', blanks: ['have'], explanation: 'I bilan have' },
        { id: 602, type: 'fill-blank', instruction: 'have/has:', question: 'She ___ lived here for years.', blanks: ['has'], explanation: 'She bilan has' },
      ],
    },
  ],
  exercises: [
    { id: 1, type: 'fill-blank', instruction: 'Present Perfect:', question: 'I ___ (finish) my work.', blanks: ['have finished'], explanation: 'I + have + finished' },
    { id: 2, type: 'fill-blank', instruction: 'Present Perfect:', question: 'She ___ (never/see) snow.', blanks: ['has never seen'], explanation: 'She + has + never + seen' },
    { id: 3, type: 'error-correction', instruction: 'Xatoni toping:', question: 'He have gone to the store.', errorPart: 'have', correct: 'He has gone to the store.', explanation: 'He bilan has' },
  ],
  exerciseSections: [
    { title: 'Asosiy', desc: 'have/has + past participle', color: 'bg-purple-500', icon: '👑', ids: [1, 2, 3] },
  ],
}

// ════════════════════════════════════════════════════════════════════════════
// 6. PRESENT PERFECT CONTINUOUS
// ════════════════════════════════════════════════════════════════════════════
const presentPerfectContinuous: DailyLesson = {
  id: 'present-perfect-continuous',
  title: 'Present Perfect Continuous Tense',
  subtitle: "O'tganda boshlanib hozir davom etadigan harakatlar — 'MEN SHUNAQA 3 SOAT O'QIYAPMAN'",
  level: 'B1',
  day: 7,
  formulas: [
    { label: 'Structure', structure: 'have/has + been + verb+ing', color: 'indigo' },
  ],
  rules: [
    "O'tganda boshlanib, hozir davom etayotgan va duration muhim bo'lgan harakatlar.",
    "Duration: for (1 year), since (2020)",
    "Present Perfect (natija): I have slept. Present Perfect Continuous (davom): I have been sleeping.",
  ],
  vocabulary: [
    { en: 'study', uz: "o'qish", example: 'I have been studying for 2 hours.', rule: 'have/has been studying' },
    { en: 'work', uz: 'ishlash', example: 'She has been working here since 2020.', rule: 'have/has been working' },
  ],
  examples: [
    { en: 'I have been working on this project for 3 hours.', uz: 'Men bu loyihada 3 soat ishlamoqchiman.' },
    { en: 'She has been living in London since 2019.', uz: 'U 2019 yildan buyon Londonda yashamoqda.' },
    { en: 'Have you been waiting long?', uz: 'Siz uzoq vaqt kutib turganmisiz?' },
  ],
  specialCases: [
    {
      id: 'duration',
      title: 'for va since bilan ishlash',
      rule: "for + time period (2 hours, 3 days, 1 year). since + point in time (2020, Monday, morning)",
      mnemonic: "FOR = gamodiy vaqt (for 2 hours). SINCE = boshlanish nuqtasi (since 2020)",
      commonMistakes: "I have been working since 2 hours ❌ (for 2 hours), I have been here for 2020 ❌ (since 2020)",
      examples: [
        { en: 'I have been studying for 3 hours.', uz: 'Men 3 soat o\'qiyapman.' },
        { en: 'She has been here since Monday.', uz: 'U dushanba kunidan buyon shunaqa.' },
      ],
      drills: [
        { id: 701, type: 'fill-blank', instruction: 'for yoki since:', question: 'I have been waiting ___ 2 hours.', blanks: ['for'], explanation: 'Time period → for' },
        { id: 702, type: 'fill-blank', instruction: 'for yoki since:', question: 'She has lived here ___ 2020.', blanks: ['since'], explanation: 'Point in time → since' },
      ],
    },
  ],
  exercises: [
    { id: 1, type: 'fill-blank', instruction: 'Present Perfect Continuous:', question: 'I ___ (study) English for 5 years.', blanks: ['have been studying'], explanation: 'have/has + been + verb+ing' },
    { id: 2, type: 'fill-blank', instruction: 'for / since:', question: 'They have been living in this city ___ 2015.', blanks: ['since'], explanation: 'Point in time → since' },
  ],
  exerciseSections: [
    { title: 'Asosiy', desc: 'have/has + been + ing', color: 'bg-indigo-500', icon: '💎', ids: [1, 2] },
  ],
}

// ════════════════════════════════════════════════════════════════════════════
// 7. PAST PERFECT
// ════════════════════════════════════════════════════════════════════════════
const pastPerfect: DailyLesson = {
  id: 'past-perfect',
  title: 'Past Perfect Tense',
  subtitle: "O'tganing o'tasi — 'MEN KLAUBGA BORGACH, U KETGAN EDI'",
  level: 'B1',
  day: 8,
  formulas: [
    { label: 'Structure', structure: 'had + past participle', color: 'teal' },
  ],
  rules: [
    "Ikkita o'tgan harakati bo'lsa, birinchisi Past Perfect, ikkinchisi Simple Past.",
    "Ketma-ketlik muhim bo'lgan paytda ishlatiladi.",
    "By the time, before, after va hokazo bilan ishlatiladigan vaqtlar.",
  ],
  vocabulary: [
    { en: 'finish', uz: 'tugatish', example: 'I had finished my work before he arrived.', rule: 'had finished' },
    { en: 'leave', uz: 'ketish', example: 'She had left when I called.', rule: 'had left' },
  ],
  examples: [
    { en: 'He had eaten before the meeting started.', uz: 'U yig\'ilish boshlanishidan oldin ovqat qabul qilgan edi.' },
    { en: 'By the time we arrived, they had already left.', uz: 'Biz kelgach, ular ketib qolgan ediler.' },
    { en: 'I had never seen such a beautiful sunset.', uz: 'Men bunday chiroyli quyosh botishni hech ko\'rmagadim.' },
  ],
  specialCases: [
    {
      id: 'had-past-participle',
      title: 'had + past participle — ketma-ketlik',
      rule: "Ikkita o'tgan harakati: birinchisi had + pp, ikkinchisi past simple. 'I had eaten when he arrived.'",
      mnemonic: "Had = o'tganing o'tasi. Had happened FIRST, then the other past thing happened.",
      commonMistakes: "I had went ❌ (I had gone), She had eat ❌ (She had eaten)",
      examples: [
        { en: 'I had gone home when the party started.', uz: 'Ziyofat boshlanishidan oldin men uyga ketgan edim.' },
        { en: 'She had finished cooking when the guests arrived.', uz: 'Mehmonlar kelgach, u pishirishni tugatgan edi.' },
      ],
      drills: [
        { id: 801, type: 'fill-blank', instruction: 'Past Perfect:', question: 'I ___ (leave) before you arrived.', blanks: ['had left'], explanation: 'had + left (past participle)' },
        { id: 802, type: 'fill-blank', instruction: 'Past Perfect:', question: 'She ___ (finish) her work by 5 PM.', blanks: ['had finished'], explanation: 'had + finished' },
      ],
    },
  ],
  exercises: [
    { id: 1, type: 'fill-blank', instruction: 'Past Perfect:', question: 'I ___ (eat) before he came.', blanks: ['had eaten'], explanation: 'had + past participle' },
    { id: 2, type: 'transformation', instruction: 'Qayta yozing:', question: 'She went to the store. Then she went home.', hint: 'She had ___ to the store ___', correct: 'She had gone to the store, then she went home.', explanation: 'Birinchi → Past Perfect' },
  ],
  exerciseSections: [
    { title: 'Ketma-ketlik', desc: 'had + past participle', color: 'bg-teal-500', icon: '🌊', ids: [1, 2] },
  ],
}

// ════════════════════════════════════════════════════════════════════════════
// 8. PAST PERFECT CONTINUOUS
// ════════════════════════════════════════════════════════════════════════════
const pastPerfectContinuous: DailyLesson = {
  id: 'past-perfect-continuous',
  title: 'Past Perfect Continuous Tense',
  subtitle: "O'tgada davom etgan harakatlari — 'MEN 1 SOT KUTIB TURGAN EDIM, SOʻNG U KELDI'",
  level: 'B1',
  day: 9,
  formulas: [
    { label: 'Structure', structure: 'had + been + verb+ing', color: 'cyan' },
  ],
  rules: [
    "O'tgada boshlanib, biron nuqtagacha davom etgan harakatlar.",
    "Duration oldin, keyin natija yoki boshqa harakati.",
  ],
  vocabulary: [
    { en: 'work', uz: 'ishlash', example: 'I had been working for 2 hours before I took a break.', rule: 'had been working' },
    { en: 'wait', uz: 'kutish', example: 'She had been waiting for him all day.', rule: 'had been waiting' },
  ],
  examples: [
    { en: 'I had been waiting for 30 minutes when she finally arrived.', uz: 'U kelgach, men 30 daqiqa kutib turgan edim.' },
    { en: 'They had been working on the project since morning.', uz: 'Ular ertalabdan boshlab loyihada ishlab turgan ediler.' },
  ],
  specialCases: [],
  exercises: [
    { id: 1, type: 'fill-blank', instruction: 'Past Perfect Continuous:', question: 'I ___ (wait) for 2 hours.', blanks: ['had been waiting'], explanation: 'had + been + waiting' },
  ],
  exerciseSections: [
    { title: 'Davom', desc: 'had + been + ing', color: 'bg-cyan-500', icon: '💧', ids: [1] },
  ],
}

// ════════════════════════════════════════════════════════════════════════════
// 9. SIMPLE FUTURE (will)
// ════════════════════════════════════════════════════════════════════════════
const simpleFuture: DailyLesson = {
  id: 'simple-future',
  title: 'Simple Future Tense (will)',
  subtitle: "Kelajakda sodir bo'ladigan harakatlar va rejalar — 'MEN ERTA KELAMAN'",
  level: 'A1',
  day: 10,
  formulas: [
    { label: 'Affirmative', structure: 'will + base verb', color: 'green' },
    { label: 'Negative', structure: "won't (will not) + base verb", color: 'red' },
    { label: 'Question', structure: "Will + subject + base verb?", color: 'blue' },
  ],
  rules: [
    "Simple Future (will) — qat'iy rejalar, bashoratlar, taklif va xat.",
    "Will + base form (verb -s/-ed bo'lmaydi)",
    "'ll = will (I'll, you'll, he'll)",
    "Won't = will not",
  ],
  vocabulary: [
    { en: 'go', uz: 'borish', example: "I'll go to the party tomorrow.", rule: 'will + go' },
    { en: 'see', uz: "ko'rish", example: 'You will see the difference.', rule: 'will + see' },
    { en: 'help', uz: "yordam berish", example: "I'll help you with your project.", rule: "will + help" },
    { en: 'win', uz: 'yutish', example: 'Our team will win the match.', rule: 'will + win' },
  ],
  examples: [
    { en: "I will call you tomorrow.", uz: "Erta men sizi chaqiraman." },
    { en: "She won't be late.", uz: "U kech bo'lmaydi." },
    { en: "Will you help me?", uz: "Siz menga yordam berasizmi?" },
    { en: "They will arrive at 5 PM.", uz: "Ular soat 5 da kelishadi." },
  ],
  specialCases: [
    {
      id: 'will-vs-be-going-to',
      title: "will vs. 'going to'",
      rule: "Will = taklif, bashorat, qaror. Be going to = rejalashtirilgan harakatlar, ko'ringan belgilar.",
      mnemonic: "Will = sudden decision (tez). Going to = planned (rejalashtirilgan)",
      commonMistakes: "I will go to Paris next week, but I don't have tickets yet (should be 'going to')",
      examples: [
        { en: "The weather will be sunny tomorrow. (prediction)", uz: "Erta ob-havo jonli bo'ladi." },
        { en: "I'm going to study English. (plan)", uz: "Men ingliz tilini o'qiymoqchi." },
      ],
      drills: [
        { id: 901, type: 'fill-blank', instruction: "will vs. 'going to':", question: "I ___ (buy) a new car next month. (planned)", blanks: ['am going to buy'], explanation: "Planned → be going to" },
        { id: 902, type: 'fill-blank', instruction: "will vs. 'going to':", question: "It ___ (rain) soon. (prediction)", blanks: ['will rain'], explanation: "Prediction → will" },
      ],
    },
  ],
  exercises: [
    { id: 1, type: 'fill-blank', instruction: 'will + base:', question: "I ___ (call) you tomorrow.", blanks: ['will call'], explanation: "will + call" },
    { id: 2, type: 'fill-blank', instruction: "won't:", question: "She ___ (not/come) to the party.", blanks: ["won't come"], explanation: "won't + base verb" },
    { id: 3, type: 'multiple-choice', instruction: "will + base form:", question: "He ___ the competition.", options: ['will win', 'will wins', 'wins', 'winning'], correct: 'will win', explanation: "will + base form (wins emas)" },
    { id: 4, type: 'transformation', instruction: "Savolga o'zgartiring:", question: "I will eat pizza tomorrow.", hint: "Will I ___?", correct: "Will I eat pizza tomorrow?", explanation: "Will + subject + base form" },
  ],
  exerciseSections: [
    { title: 'Ijobiy', desc: 'will + base form', color: 'bg-green-500', icon: '✅', ids: [1] },
    { title: 'Inkoriy/Savol', desc: "won't va Will", color: 'bg-blue-500', icon: '❓', ids: [2, 3, 4] },
  ],
}

// ════════════════════════════════════════════════════════════════════════════
// 10. FUTURE CONTINUOUS (will be + ing)
// ════════════════════════════════════════════════════════════════════════════
const futureContinuous: DailyLesson = {
  id: 'future-continuous',
  title: 'Future Continuous Tense',
  subtitle: "Kelajakda bir vaqtda sodir bo'ladigan harakatlar — 'SOAT 3 DA MEN O'QIYAPMAN BO'LAMAN'",
  level: 'B1',
  day: 11,
  formulas: [
    { label: 'Structure', structure: 'will be + verb+ing', color: 'blue' },
  ],
  rules: [
    "Kelajakda biron vaqtda davom etayotgan harakatlar.",
    "Future Continuous har vaqt sodir bo'ladigan harakatlar (Simple Future) bilan farq.",
  ],
  vocabulary: [
    { en: 'work', uz: 'ishlash', example: 'I will be working at 2 PM tomorrow.', rule: 'will be + working' },
    { en: 'study', uz: "o'qish", example: 'She will be studying all night.', rule: 'will be + studying' },
  ],
  examples: [
    { en: "I will be sleeping at 10 PM.", uz: "Soat 10 da men uxlab bo'laman." },
    { en: "Will you be home this afternoon?", uz: "Siz bugun kunduzi uyda bo'lasizmi?" },
  ],
  specialCases: [],
  exercises: [
    { id: 1, type: 'fill-blank', instruction: 'Future Continuous:', question: "I ___ (work) on the project tomorrow.", blanks: ['will be working'], explanation: "will be + verb+ing" },
    { id: 2, type: 'fill-blank', instruction: 'Future Continuous:', question: "They ___ (play) football at 5 PM.", blanks: ['will be playing'], explanation: "will be + playing" },
  ],
  exerciseSections: [
    { title: 'Asosiy', desc: 'will be + ing', color: 'bg-blue-500', icon: '📘', ids: [1, 2] },
  ],
}

// ════════════════════════════════════════════════════════════════════════════
// 11. FUTURE PERFECT (will have + past participle)
// ════════════════════════════════════════════════════════════════════════════
const futurePerfect: DailyLesson = {
  id: 'future-perfect',
  title: 'Future Perfect Tense',
  subtitle: "Kelajakdagi bir vaqtga qadar tugatilgan harakatlar — 'SOAT 5 GA QADAR MEN TUGAT BO'LAMAN'",
  level: 'B1',
  day: 12,
  formulas: [
    { label: 'Structure', structure: 'will have + past participle', color: 'purple' },
  ],
  rules: [
    "Kelajakda bir vaqtga qadar tugatilgan bo'ladigan harakatlar.",
    "By + future time: By next Monday, I will have finished.",
  ],
  vocabulary: [
    { en: 'finish', uz: 'tugatish', example: 'I will have finished by 5 PM.', rule: 'will have + finished' },
    { en: 'complete', uz: "yakunlash", example: "We will have completed the project by Friday.", rule: 'will have + completed' },
  ],
  examples: [
    { en: "I will have eaten lunch by noon.", uz: "Tushni soatiga qadar men obedni qabul qilgan bo'laman." },
    { en: "By next week, she will have finished her studies.", uz: "Keyingi hafta, u o'qishni tugatgan bo'ladi." },
  ],
  specialCases: [],
  exercises: [
    { id: 1, type: 'fill-blank', instruction: 'Future Perfect:', question: "I ___ (finish) my work by 6 PM.", blanks: ['will have finished'], explanation: "will have + past participle" },
    { id: 2, type: 'fill-blank', instruction: 'Future Perfect:', question: "By next year, they ___ (live) here for 5 years.", blanks: ['will have lived'], explanation: "will have + lived" },
  ],
  exerciseSections: [
    { title: 'Asosiy', desc: 'will have + past participle', color: 'bg-purple-500', icon: '👑', ids: [1, 2] },
  ],
}

// ════════════════════════════════════════════════════════════════════════════
// 12. FUTURE PERFECT CONTINUOUS
// ════════════════════════════════════════════════════════════════════════════
const futurePerfectContinuous: DailyLesson = {
  id: 'future-perfect-continuous',
  title: 'Future Perfect Continuous Tense',
  subtitle: "Kelajakda boshlanib davom etadigan harakatlar — 'SOAT 8 GA QADAR MEN 2 SOAT ISHLAB BO'LAMAN'",
  level: 'B2',
  day: 13,
  formulas: [
    { label: 'Structure', structure: 'will have been + verb+ing', color: 'indigo' },
  ],
  rules: [
    "Kelajakda boshlanib, biron vaqtga qadar davom etadigan harakatlar.",
    "Duration muhim bo'lgan paytda ishlatiladi.",
  ],
  vocabulary: [
    { en: 'work', uz: 'ishlash', example: 'I will have been working for 10 hours.', rule: 'will have been + working' },
  ],
  examples: [
    { en: "By 5 PM, I will have been working for 8 hours.", uz: "Soat 5 ga qadar men 8 soat ishlab bo'laman." },
    { en: "She will have been studying English for 10 years.", uz: "U ingliz tilini 10 yil o'qiyapti bo'ladi." },
  ],
  specialCases: [],
  exercises: [
    { id: 1, type: 'fill-blank', instruction: 'Future Perfect Continuous:', question: "By next week, I ___ (study) for a month.", blanks: ['will have been studying'], explanation: "will have been + studying" },
  ],
  exerciseSections: [
    { title: 'Murakkab', desc: 'will have been + ing', color: 'bg-indigo-500', icon: '💎', ids: [1] },
  ],
}

export const TENSES_LESSONS: DailyLesson[] = [
  simplePresent,
  presentContinuous,
  simplePast,
  pastContinuous,
  presentPerfect,
  presentPerfectContinuous,
  pastPerfect,
  pastPerfectContinuous,
  simpleFuture,
  futureContinuous,
  futurePerfect,
  futurePerfectContinuous,
]
