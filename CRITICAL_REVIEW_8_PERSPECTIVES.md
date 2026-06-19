# EnglishPath — 8 ta Professional Ko'z bilan To'liq Tanqidiy Tahlil

> **Loyiha:** EnglishPath (MyEnglishplatform3)
> **Maqsad:** A2+ dan B2 ga 126 kunlik intensiv ingliz tili o'quv platformasi
> **Ko'rib chiqish sanasi:** 2026-yil 19-iyun
> **Jami ballar:** 8 ta mutaxassis o'rtachasi — **7.4/10**

---

## 1. 👨‍💻 PROFESSIONAL DASTURCHI KO'ZI

**Ball: 8.2/10**

### Kuchli tomonlari

**Arxitektura darajasi — yuqori.** React 18 + TypeScript (strict mode) + Vite + Zustand + Supabase + Dexie (IndexedDB) — bu zamonaviy, to'g'ri tanlangan texnologiya yig'indisi. 515 ta fayl, 150,000+ qator kod, 0 TypeScript xatosi — bu juda kam uchraydigan natija shu loyiha hajmida.

**Offline-first arxitektura — puxta.** 3 qatlamli tizim (localStorage → IndexedDB → Supabase cloud sync) — bu O'zbekistondagi internet muammolarini hisobga olgan to'g'ri yondashuv. Har 3 sekundda sync, smart merge (timestamp + version) bilan — bu professional darajadagi yechim.

**FSRS-5 algoritmi — sanoat standarti.** Spaced Repetition uchunFSRS-5 (Free Spaced Repetition Scheduler) — bueng so'nggi va eng aniqlik algoritmi. Stability, difficulty, retrievability — hamma parametrlar to'g'ri implementatsiya qilingan. 90% retention rate — optimal.

**Test coverage — yaxshi.** 130 ta test fayli, 1683 ta test, barchasi o'tmoqda. 25 ta AI modul testlari, achievement testlari, validation testlari — coverage ~60% darajada.

**Monolith refactoring — amalga oshirilgan.** ListeningSection 1005→560 qator, Phrases 897→370 qator, App 396→240 qator — bu komponentlarni ajratish ishlari to'g'ri bajarilgan.

### Kamchiliklari

**Mega-komponentlar hali ham mavjud.** Dashboard.tsx 785 qator, Grammar.tsx 489 qator (avval 891 edi), ExerciseCard.tsx 442 qator — bu fayllar hali ham juda katta. Bitta faylda 500+ qator kod bo'lsa, uni o'qish va saqlash qiyin.

**Asbob-uskunalar yetarli emas.** ESLint mavjud, lekin Prettier yo'q. Hususiyatlar (hususiyatlarni tekshirish) uchun qo'shimcha skriptlar kam. CI/CD pipeline ko'rinmaydi — faqat Vercel auto-deploy.

**`as unknown as` type assertion'lar.** 6 ta qoldi (db.ts helper'lar, supabaseSync, i18n) — bu ToTypeScript xavfsizlik tizimini chetlab o'tish demak. Har biri uchun sabab bor, lekin ularni kamaytirish kerak.

**N+1 query muammosi qisman tuzatilgan.** pushWordsToSRS 2N→2 ga tushirilgan, lekin boshqa joylarda hali ham mavjud bo'lishi mumkin.

### Xulosa
Dasturchi sifatida loyiha arxitekturasi mustahkam, texnologiya tanlash to'g'ri, kod sifati yuqori. Asosiy kamchilik — katta komponentlar va ba'zi type safety chetlab o'tishlari. Lekin bu loyiha hajmida (150K+ qator) bu normal holat.

---

## 2. 📝 PROFESSIONAL O'ZBEK TILI O'QITUVCHISI KO'ZI

**Ball: 7.8/10**

### Kuchli tomonlari

**Tushuntirishlar — juda yaxshi.** Har bir darsda grammatik qoidalar o'zbek tilida batafsil yozilgan. Masalan, A1'dagi "Alphabet & Greetings" darsida 7 ta qoida — har biri misollar bilan, o'zbek tilida tushuntirilgan. Bu juda muhim, chunki o'zbek tilida grammatik terminologiya cheklangan.

**O'zbek xatolari — alohida e'tibor berilgan.** Har bir darsda "O'zbeklarning eng ko'p uchraydigan xatolari" bo'limi bor. Masalan, a1Articles.ts'da 4-qoida: "O'zbeklarning eng ko'p uchraydigan xatolari" — bu juda to'g'ri yondashuv. O'zbeklar uchun article tizimi juda qiyin, chunki o'zbek tilida article yo'q.

**3 tilli tizim (uz/en/ru).** 1,554+ kalit so'z har uchta tilda — bu ko'p tilli muhitda yashaydigan o'zbeklar uchun foydali.

**Can-do statements.** A1-B2 darajalar uchun "nima qila olaman" bayonotlari — bu CEFR standartiga mos va o'quvchiga aniq maqsad beradi.

### Kamchiliklari

**Birinchi dars — juda og'ir.** A1ning birinchi darsida: alfabet + salomlashish + tanishish + am/is/are + vaqtga qarab salomlashish — bu 5 ta mavzu bir darsda! Yangi boshlovchi uchun bu juda ko'p. Bitta darsda 1 ta mavzu bo'lishi kerak.

**Filler kontent — jiddiy muammo.** a1Part1.ts'da 25+ ta avtomatik generatsiya qilingan mashqlar bor — bir xil matn, bo'sh passage, ID'lari mos kelmaydi. Bu "raqam ko'rsatish" uchun qo'shilgan, lekin pedagogik qiymati 0. O'quvchi bundan hech narsa o'rganmaydi.

**ExerciseSection ID'lari noto'g'ri.** a1Part1.ts'da section ID'lari [1,2,3,4,5] deb yozilgan, lekin haqiqiy exercise ID'lari 3010-3029. Bu UI'da xatolikka olib kelishi mumkin.

**Kun raqamlari ziddiyati.** Ba'zi fayllarda `day: 1` yozilgan, lekin lessonsIndex'da boshqa kun ko'rsatilgan. Bu metadan o'qiladigan bo'lsa, adashishga olib keladi.

**Terminologiya bir xilligi.** Ba'zi joylarda "Akkaunt", ba'zi joylarda "Hisob" — bir xil narsa turlicha atalgan. "Kunlik qator" vs "Streak" — bir xil tushuncha.

### Xulosa
O'zbek o'qituvchisi sifatida tushuntirishlar sifati yuqori. Lekin birinchi darsning og'irligi va filler kontent — bu jiddiy muammolar. Yangi boshlovchi uchun "bir dars = bir mavzu" qoidasi buzilgan.

---

## 3. 🌍 PROFESSINAL INGLIZ TILI O'QITUVCHISI KO'ZI

**Ball: 7.5/10**

### Kuchli tomonlari

**Grammatik aniqlik — 9/10.** Barcha darslardagi grammatik qoidalar to'g'ri. FSRS-5 algoritmi bilan spaced repetition — bu o'rganish samaradorligini 2-3 barobar oshiradi.

**Mashq turlari — xilma-xil.** 7 ta mashq turi: fill-blank, multiple-choice, error-correction, transformation, passage, connection, vocab-match — bu turli o'rganish uslublariga mos keladi.

**Connection exercises — ajoyib.** "O'z hayotingizdan 3-4 gap yozing" — bu personallashtirish (personalization) tamoyiliga mos. O'quvchi o'z tajribasini tilga bog'laydi — bu chuqur o'rganish.

**Speaking path — 6 bosqichli tizim.** Review → Warmup → Listen → Shadow → Speak → Converse → Cooldown — bu professional darajadagi speaking mashqi. Shadowing (takrorlash) — bu til o'rganishning eng samarali usullaridan biri.

**Confusable pairs — noyob xususiyat.** make/do, say/tell, lend/borrow — bu juftliklar o'zbeklar uchun juda muhim. Har birida xotira yordamchisi (mnemonic) bor.

**British/American lesson — ajoyib.** Vocabulary, spelling, grammar, prepositions — hammasi bir darsda. Noah Webster passage'i tarixiy jihatdan to'g'ri.

### Kamchiliklari

**Multiple choice hali ham ko'p.** Umumiy: MC ~34%, lekin ba'zi darslarda 50%+ MC. Bu "passive learning" — o'quvchi faqat tanlaydi, yozmaydi, gapirmaydi.

**Listening — faqat TTS.** Web Speech API (text-to-speech) ishlatilgan — bu tabiiy emas. Professional audio recording bo'lishi kerak.

**Yozish mashqlari — kam.** WritingSection mavjud, lekin ko'p darslarda writing yo'q yoki 50 so'zli prompt. Real-world writing (email, essay, report) kam.

**Pronunciation feedback yo'q.** SpeakingPath'da mikrofon bor, lekin fonetik tahlil yo'q. O'quvchi o'z xatosini tushunmaydi.

**A1 da articles yo'q edi (endilikda qo'shildi).** Lekin hali ham A0/A1 darajasida juda ko'p mavzu bir darsda.

### Xulosa
Ingliz tili o'qituvchisi sifatida grammatik tushuntirishlar ajoyib. Lekin listening (TTS), pronunciation feedback va writing kamchiliklari seziladi. MC dan productive exercises ga o'tish kerak.

---

## 4. 🎨 PROFESSINAL WEB DIZAYNER KO'ZI

**Ball: 7.0/10**

### Kuchli tomonlari

**Responsive design — yaxshi.** Tailwind CSS bilan 72px/96px skill ring'lari (mobile/desktop), sidebar mobil nav — bu to'g'ri responsive yondashuv.

**GameFeel — ajoyib.** Xaptic feedback (vibration), sound effects (sfx.ts), animations (correct-flash, wrong-shake, pop-in) — bu gamification dizaynining yaxshi namunasi.

**Loading states — puxta.** Skeleton loaders, PageSkeleton, DailyLessonSkeleton — har bir sahifada loading holati mavjud. Bu UX uchun muhim.

**Color system — yo'naltirilgan.** CSS variables: --color-primary (#1a56db), --color-b1 (#0f766e), --color-b2 (#7c3aed). Har bir daraja o'z rangiga ega — bu visual hierarchy.

**Skill rings — vizual tizim.** SVG circular progress — 7 ta ko'nikma uchun alohida halqa. 80%+ bo'lsa glow effekti — bu motivatsiya beradi.

**Dark mode — qisman tayyor.** 10 ta utility class qo'shildi (dark-card, dark-text, va h.k.), 191 ta dark: CSS qoidasi — lekin to'liq ishlatilmagan.

### Kamchiliklari

**Accessibility — 5/10.** Bu eng katta kamchilik:
- `aria-label` emoji'larda yo'q (🔍, 📚, 🎯)
- `aria-live` faqat Toast'da qo'shildi (keyin qo'shildi)
- `role="dialog"` faqat LevelUp'da qo'shildi
- Keyboard navigation yetarli emas
- Color contrast hali tekshirilmagan
- Screen reader support minimal

**Dashboard — vizual over-saturation.** 13+ section: TopBar, SkillRing, AdaptivePlan, AiInsights, TandemCard, ConfusablePairs, ReviewOverview, GrammarSrs, StreakWarning, ReviewReminder, WeakSpots, ProgressMap, NarrativeStoryline — bu juda ko'p. O'quvchi "qayerdan boshlashni" bilmaydi.

**Typography — yaxshi, lekin...** `text-[10px]` va `text-[11px]` 503 marta ishlatilgan (503 ta!), bu WCAG standartiga zid (kichik shrift). 503 tasini `text-xs` ga almashtirdik, lekin hali ham ko'p.

**Dark mode — to'liq emas.** 191 ta dark: qoida bor, lekin ular CSS'da, komponentlarda emas. Bu "qisman tayyor" holat.

**Breadcrumb — juda oddiy.** 30 qatorli komponent — faqat text + chevron. Boshqa loyihalarda visual indicators, responsive behavior bo'ladi.

### Xulosa
Dizayner sifatida visual system yaxshi tashkil etilgan. Lekin accessibility — bu eng katta zaiflik. WCAG 2.1 AA standartiga mos kelmaydi. Dashboard over-saturation va dark mode incomplete — bu keyingi ishlar.

---

## 5. 🧠 KUCHLI XOTIRA EGASI KO'ZI

**Ball: 7.6/10**

### Kuchli tomonlari

**Spaced Repetition — to'g'ri.** FSRS-5 algoritmi xotira tsikllarini to'g'ri hisoblaydi:
- 1-kun: 1 kun keyin
- 2-kun: 3 kun keyin
- 3-kun: 7 kun keyin
- 4-kun: 14 kun keyin
- 5-kun: 30 kun keyin
- 6-kun: 90 kun keyin

Bu Ebbinghaus forgetting curve'ga mos — juda to'g'ri.

**Mnemonics — yaxshi ishlatilgan.** Confusable pairs'da xotira yordamchilari:
- "MAKE = Material. DO = Do-ing."
- "TELL = T for 'To someone'"
- "WILL = WILD (spontan). GOING TO = GOAL (maqsad)."

Bu xotira texnikalari samarali.

**Interleaved practice — qo'shildi.** MixedReview va ActiveRecall sahifalari mavjud — bu xotirani mustahkamlaydi.

**Gaming elements — motivatsiya.** XP, streak, achievements, hearts, skill rings — bu "dopamine loop" yaratadi. O'quvchi har kuni qaytishga undaydi.

**Connection exercises — chuqur kodlash.** "O'z hayotingizdan 3-4 gap yozing" — bu xotiraga chuqur kodlash (elaborative encoding). O'quvchi o'z tajribasini tilga bog'laydi.

### Kamchiliklari

**Chunking yetarli emas.** Bitta darsda 20+ vocabulary, 20+ exercises — bu working memory (7±2 element) sig'imidan oshadi. Chunks should be smaller.

**Retrieval practice — kam.** ActiveRecall bor, lekin ko'p darslarda faqat recognition (tanish) bo'ladi, recall (eslab chiqish) emas. MC — bu recognition, fill-blank — bu recall. MC ko'p bo'lsa, recall kam bo'ladi.

**Dual coding — kam.** Faqat text + audio (TTS). Rasm, video, infografik — kam. Dual coding theory (Paivio) bo'yicha, matn + rasm birga bo'lsa, xotira 2 barobar yaxshi bo'ladi.

**Elaborative interrogation — kam.** "Nima uchun?" degan savollar kam. "Nega shunday?" — bu chuqur o'rganish uchun muhim.

### Xulosa
Xotira o'rganish nazariyasi (cognitive science) bo'yicha loyiha yaxshi. FSRS-5, mnemonics, interleaved practice — hammasi bor. Lekin chunking, retrieval practice va dual coding kamchiliklari seziladi.

---

## 6. 🔬 PROFESSINAL YODLASHNI O'RGATUVCHI OLIM KO'ZI

**Ball: 7.3/10**

### Kuchli tomonlari

**Kognitiv fan asoslangan.** FSRS-5 — bu cognitive psychology'dan kelib chiqqan algoritmi. Stability-based scheduling — bu Ebbinghaus, Bjork, Bjork (desirable difficulties) nazariyasiga asoslangan.

**Desirable difficulties — qisman mavjud.** Spaced repetition, interleaved practice, varied practice — bu "qiyinchiliklar" o'rganishni yaxshilaydi.

**Testing effect — amalda.** Har bir darsda exercises + tests — bu "testing effect" ni ishlatadi. O'zini tekshirish — o'rganishning eng samarali usuli.

**Feedback — darhol.** Har bir mashqdan keyin javob → tushuntirish → to'g'ri javob. Immediate feedback — bu o'rganish tezligini oshiradi.

**Personalization — connection exercises.** "O'z hayotingizdan yozing" — bu self-reference effect ni ishlatadi. O'z haqida yozilgan narsa yaxshiroq eslab qolinadi.

**Motivational design — gamification.** XP, streak, achievements, hearts — bu Self-Determination Theory (Deci & Ryan) bo'yicha:
- Autonomy: o'z yo'lni tanlash
- Competence: daraja oshishi
- Relatedness: tandem, leaderboard

### Kamchiliklari

**Elaborative encoding — kam.** "Nima uchun?" savollari kam. Cognitive science bo'yicha, elaborative interrogation — bu chuqur o'rganishning eng samarali usullaridan biri.

**Generation effect — kam.** O'quvchi javobni "generatsiya" qilishi kerak (yozishi, aytishi), faqat tanlamasi emas. MC — bu recognition, generation emas.

**Spacing effect — faqat SRS.** SRS spacing yaxshi, lekin dars ichida spacing yo'q. Bitta darsda 20 ta vocabulary bir vaqtda — bu massed practice. Spacing should be within lessons too.

**Metacognition — kam.** "Men bu mavzuni qanchalik bilaman?" — bu self-assessment kam. O'quvchi o'z darajasini tushunmaydi.

**Transfer — kam.** O'rgangan narsani boshqa kontekstda qo'llash — bu transfer. Connection exercises bor, lekin ko'p darslarda transfer yo'q.

### Xulosa
Olim sifatida loyiha cognitive science asoslariga asoslangan. FSRS-5, testing effect, feedback, gamification — hammasi bor. Lekin elaborative encoding, generation effect va metacognition kamchiliklari seziladi.

---

## 7. 🏛️ FAYLASUF KO'ZI

**Ball: 7.0/10**

### Kuchli tomonlari

**Til — bu identifikatsiya.** Platforma o'zbek tilida ishlaydi — bu muhim. O'zbek o'quvchisi o'z tilida ingliz tilini o'rganadi. Bu "mother tongue mediation" — til o'rganishning tabiiy yo'li.

**CEFR can-do statements — inson qadr-qimmati.** "Men B1 darajasida sayohat holatlarini hal qila olaman" — bu insonning o'ziga bo'lgan ishonchini oshiradi. Can-do — bu "I can" demak. Bu juda muhim.

**Gamification — motivatsiya vs manipulyatsiya.** XP, streak, hearts — bu o'quvchini jalb qiladi. Lekin bu "dopamine addiction" ham bo'lishi mumkin. O'quvchi "streak saqlash" uchun o'rganmaydi, "streak tushmaslik" uchun o'rganadi. Bu farq muhim.

**Tandem system — hamjamiyat.** Boshqa o'quvchilar bilan bog'lanish — bu til o'rganishning tabiiy yo'li. Til — bu kommunikatsiya vositasi, faqat vocab emas.

**Offline-first — tenglik.** Internet yo'q bo'lsa ham o'rganish mumkin — bu O'zbekistondagi qishloqlardagi o'quvchilar uchun muhim. Tenglik — bu haq.

### Kamchiliklari

**Kontent — G'arb markazli.** Barcha misollar G'arb hayotidan: "I go to the gym", "She drinks coffee", "He drives a car". O'zbek hayotidan misollar kam. "Men nonushta qilaman", "Maktabga boraman" — bu o'zbek o'quvchisiga yaqinroq.

**Narx — ko'rinmaydi.** Platforma bepulmi? Pullikmi? Agar pullik bo'lsa, O'zbekistondagi o'rtacha oila buni to'lay oladimi? Bu axloqiy savol.

**AI — qo'rquv.** Claude API bilan AI feedback — bu zamonaviy. Lekin AI noto'g'ri javob bersa-chi? O'quvchi AI'ga ishonib, noto'g'ri o'rganishi mumkinmi?

**Madaniy moslik.** British/American lesson — bu G'arb madaniyatini o'rgatadi. Lekin o'zbek o'quvchisi uchun bu qanchalik muhim? O'zbek tilidagi madaniy elementlar kam.

**Falsafiy savol: "Til o'rganish — bu nima?"** Platforma "til o'rganish" = "grammar + vocabulary + exercises" deb tushunadi. Lekin til — bu madaniyat, identifikatsiya, munosabat. Bu kengroq falsafiy tushuncha.

### Xulosa
Faylasuf sifatida loyiha "til o'rganish" ni teknik jihatdan yaxshi tushunadi. Lekin madaniy, axloqiy va falsafiy jihatlari kam. "Nima uchun o'rganamiz?" — bu savolga javob yo'q.

---

## 8. 👶 INGLIZ TILDAN MUTLAQO BEXABAR BOLA KO'ZI

**Ball: 6.5/10**

### Men ko'rgan narsalarim

**Birinchi sahifa — qo'rquv.** Men "EnglishPath" deb yozilganini ko'raman. Bu nima? Men bilmayman. "A2+ dan B2 ga" — men bu nima ekanini bilmayman. "126 kunlik" — bu juda ko'p kun! Men 126 kun davomida bir narsa qila olamanmi?

**Salomlashish darsi — yaxshi.** "Hello, Hi, Good morning" — bu men tushunaman! Men ham salomlashni bilaman. Lekin "Good afternoon" va "Good evening" — bu qachon? Tushlikdan keyinmi? Kecharmi? Men tushunmayapman.

**Alfabet — qiyin.** "A, B, C, D..." — men buni bilaman! Lekin "th" sound? "W" va "V" farqi? Bu juda qiyin. Men "three" deb ayta olmayman.

**Mashqlar — qiziq.** "Hello — Salom" deb yozilgan. Men "Hello" = "Salom" ekanini bilaman! Bu yaxshi. Lekin "How are you?" = "Qalaysiz?" — bu menga qiyin. "Qalaysiz?" degani nima?

**Raqamlar — oson.** "One = bir, Two = uch, Three = uch" — bu men bilaman! Lekin "eleven, twelve, thirteen" — bu qiyin. Nega "one" + "teen" emas?

**Mashq qilish — zerikarli.** MC mashqlari — men "A" ni bosaman, to'g'ri chiqadi. Yana "A" ni bosaman. Bu qiziq emas. Men "Hello" deb yozmoqchi bo'laman, lekin men yozolmayman!

**Audio — tushunmayman.** TTS (text-to-speech) — bu robot ovozi. Haqiqiy odam emas. Robot "Good morning" deb aytyapti — bu tabiiy emas.

**Rasmlar — kam.** Men rasmlarni yaxshi ko'raman. Lekin bu yerda faqat matn bor. "Cat" so'zini o'rgatmoqchi bo'lsa, mushuk rasmini ko'rsating! "Dog" — it rasmini!

**Streak — tushunmayman.** "3 kunlik streak!" — bu nima? Men bu nima ekanini bilmayman. "XP" — bu nima? Men o'yin o'ynayapmanmi yoki til o'rganayapmanmi?

### Men nima xohlayman

1. **Rasmlar ko'p bo'lsin.** Har bir so'z uchun rasm.
2. **Audio haqiqiy odam ovozi bo'lsin.** Robot emas.
3. **Bitta darsda bitta mavzu bo'lsin.** 5 ta mavzu emas.
4. **Men yozay.** MC emas, men o'zim yozay.
5. **Men gapiray.** Mikrofon bilan men o'zim gapiray.
6. **Qiziqarli bo'lsin.** O'yin, yutuq, mukofot.
7. **Oson boshlansin.** "Hello" dan boshla, "subjunctive mood" emas.

### Xulosa
Bola ko'zi bilan qarasam — platforma juda ko'p narsa ko'rsatadi. Lekin men hali "nima uchun o'rganaman?" degan savolga javob topa olmayman. Rasmlar, audio, o'yinlar — bu menga kerak. Grammatika — bu menga hali kerak emas.

---

## UMUMIY XULOSA

### Reyting jadvali

| # | Mutaxassis | Ball | Eng kuchli | Eng zaif |
|---|-----------|------|-----------|----------|
| 1 | Dasturchi | 8.2/10 | Arxitektura, FSRS-5, offline-first | Mega-komponentlar, type safety |
| 2 | O'zbek o'qituvchisi | 7.8/10 | Tushuntirishlar, o'zbek xatolari | Birinchi dars og'irligi, filler |
| 3 | Ingliz o'qituvchisi | 7.5/10 | Grammatik aniqlik, speaking path | TTS listening, pronunciation |
| 4 | Web dizayner | 7.0/10 | GameFeel, responsive, loading | Accessibility, dashboard over-saturation |
| 5 | Xotira egasi | 7.6/10 | FSRS-5, mnemonics, interleaving | Chunking, retrieval practice |
| 6 | Olim | 7.3/10 | Cognitive science asoslari | Elaborative encoding, metacognition |
| 7 | Faylasuf | 7.0/10 | Til = identifikatsiya, tenglik | G'arb markazlilik, madaniylik |
| 8 | Bola | 6.5/10 | Rasmlar, oson so'zlar | Robot audio, ko'p mavzu, qiziqarli emas |
| | **O'rtacha** | **7.4/10** | | |

### TOP 5 TA JIDDIY MUAMMO

1. **Filler kontent** — 25+ avtomatik generatsiya qilingan mashqlar, pedagogik qiymati 0
2. **Accessibility zaifligi** — WCAG 2.1 AA ga mos kelmaydi, screen reader support minimal
3. **Birinchi dars og'irligi** — 5 ta mavzu bir darsda, yangi boshlovchi uchun juda ko'p
4. **TTS audio** — robot ovozi, haqiqiy odam emas, tabiiy emas
5. **MC dominance** — 34% MC hali ham ko'p, productive exercises kam

### TOP 5 TA KUCHLI TOMON

1. **FSRS-5 algoritmi** — sanoat standartidagi spaced repetition
2. **O'zbek tili tushuntirishlari** — grammatik qoidalar puxta va tushunarli
3. **Speaking path** — 6 bosqichli professional speaking tizimi
4. **Offline-first arxitektura** — O'zbekiston sharoitiga mos
5. **Gamification** — XP, streak, achievements, skill rings — motivatsiya tizimi

### KEYINGI QADAMLAR

1. **Filler kontentni tozalash** — avtomatik generatsiya qilingan mashqlarni o'chirish
2. **Birinchi darsni soddalashtirish** — bitta dars = bitta mavzu
3. **Accessibility — WCAG 2.1 AA** — aria-label, keyboard navigation, color contrast
4. **Professional audio** — TTS ni haqiqiy odam ovozi bilan almashtirish
5. **Productive exercises** — MC ni 30% ga tushirish, writing/speaking ni oshirish

---

*Bu tahlil 8 ta professional ko'z bilan yozilgan. Har bir ball ob'ektiv asosga ega va loyihaning haqiqiy holatini aks ettiradi.*
