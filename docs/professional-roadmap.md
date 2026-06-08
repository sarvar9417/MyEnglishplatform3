# EnglishPath — Professional darajaga chiqish uchun Roadmap

> **Muallif**: Professional dasturchi, olim (SLA/CALL), ingliz tili ustasi
> **Maqsad**: EnglishPath ni hozirgi "yaxshi MVP" dan "world-class language learning platform" ga aylantirish
> **Muddati**: 12-18 oy, 4 faza

---

## Qisqacha holat tahlili

| O'lchov | Hozirgi holat | Maqsad (Professional) |
|---------|---------------|----------------------|
| **Nazariya → Mashq qamrovi** | 65-75% | 95-100% |
| **Skills bo'limlari** | Faqat B2 da, 50% darsda | Barcha darslarda, 100% |
| **Vocabulary tizimi** | SRS bor, lekin darsda test yo'q | Dars ichida integratsiyalangan |
| **Listening** | Ba'zi darslarda | Barcha darslarda, progressiv |
| **Speaking** | SpeakingPath alohida | Daily lesson ga integratsiyalangan |
| **Test qamrovi** | 91% pass, 1 test failure | 100% pass, CI/CD |
| **Offline** | Service Worker + Dexie | To'liq offline rejim |
| **AI integratsiyasi** | Claude API, 30+ funksiya | Adaptive AI tutor, personalizatsiya |
| **Analytics** | Basic (XP, streak) | Learning analytics, ELO, IRT |
| **i18n** | uz/en/ru | uz/en/ru/ko/zh/tr (10+ til) |

---

## FAZA 1: Foundation & Fixes (0-3 oy)

> **Maqsad**: Mavjud tizimdagi bo'shliqlarni to'ldirish, CI/CD ni barqarorlashtirish, foydalanuvchi tajribasini professional darajaga ko'tarish

### 1.1. Test va CI/CD infrastrukturasi

| # | Vazifa | Batafsil | Prioritet |
|---|--------|----------|-----------|
| 1.1.1 | `lessonsIndex.test.ts` ni tuzatish | `UPDATE_INDEX=1 npx vitest run src/data/__tests__/lessonsIndex.test.ts` orqali LESSON_INDEX ni qayta generatsiya qilish. Auto-generatsiyani `prebuild` script ga qo'shish | 🔴 Critical |
| 1.1.2 | GitHub Actions CI qo'shish | Har bir PR/commit da: `npm run lint && npm run typecheck && npm test && npm run build`. Code coverage threshold: 30% (hozir ~20%) | 🔴 Critical |
| 1.1.3 | E2E test qo'shish | Playwright yoki Cypress bilan: (1) Auth flow, (2) Dars ochish va mashq bajarish, (3) SpeakingPath recording, (4) Offline rejim | 🟡 High |
| 1.1.4 | Test coverage reporting | Vitest `--coverage` ni CI ga qo'shish, `codecov` yoki `coveralls` integratsiyasi | 🟡 High |

### 1.2. Nazariya → Mashq qamrovini to'ldirish

| # | Vazifa | Fayllar | Prioritet |
|---|--------|---------|-----------|
| 1.2.1 | **B1 Future Forms** — Time Expressions (R7) uchun 5 ta mashq | `b1Part1.ts` → exercises ga 5 ta fill-blank/MC qo'shish (probably, definitely, tonight, next week, Look!/Listen!) | 🔴 Critical |
| 1.2.2 | **B2 Conditionals** — `as long as`, `otherwise`, `in case`, `were to` uchun 4 ta mashq | `b2Part1.ts` → Advanced Conditionals exercises ga qo'shish | 🔴 Critical |
| 1.2.3 | **B2 Conditionals** — Mixed conditional present→past yo'nalishi uchun 2 ta qo'shimcha mashq | `b2Part1.ts` → transformation/error-correction | 🟡 High |
| 1.2.4 | **Rule 7 (O'zbek xatolari)** auditi va to'ldirish | Har bir darsdagi Rule 7 ni o'qib, barcha listed xatolarga kamida 1 tadan mashq borligini tekshirish. Yo'q bo'lsa, qo'shish | 🟡 High |
| 1.2.5 | **Vocabulary exercise type** qo'shish | `DailyExercise` union ga yangi `vocab-match` type qo'shish: `{ type: 'vocab-match', word: string, options: string[], correct: string }`. `ExerciseCard` ga yangi render qo'shish | 🟡 High |

### 1.3. Offline va PWA yaxshilash

| # | Vazifa | Prioritet |
|---|--------|-----------|
| 1.3.1 | Service Worker ni Workbox ga ko'chirish | Hozirgi `public/sw.js` qo'lda yozilgan. Workbox avtomatik strategiyalar (CacheFirst, NetworkFirst, StaleWhileRevalidate) ni qo'llab-quvvatlaydi | 🟡 High |
| 1.3.2 | Offline banner UX ni yaxshilash | Hozir oddiy banner. Offline rejimda qaysi funksiyalar ishlashini ko'rsatuvchi UI qo'shish | 🟢 Medium |
| 1.3.3 | Dexie IndexedDB sync conflict resolution | Supabase ↔ Dexie sync da conflict bo'lsa, "last-write-wins" emas, smart merge strategiyasi | 🟢 Medium |

---

## FAZA 2: Content & Curriculum (3-6 oy)

> **Maqsad**: Barcha darslarga skills bo'limlarini qo'shish, curriculum ni CEFR standartlariga moslashtirish

### 2.1. Reading bo'limi — Barcha darslarga

| # | Vazifa | Batafsil | Prioritet |
|---|--------|----------|-----------|
| 2.1.1 | **A1 darslar** (1-27) → 5 ta reading passage | Topic: greetings dialog, family, school, animals, colors. 50-80 words, 3 MC questions | 🟡 High |
| 2.1.2 | **A2 darslar** (28-53) → 8 ta reading passage | Topic: daily routine, shopping, travel, weather, food. 80-120 words, 4 MC questions | 🟡 High |
| 2.1.3 | **B1 darslar** (54-75) → 8 ta reading passage | Topic: work, education, technology, culture. 120-200 words, 5 MC questions | 🟡 High |
| 2.1.4 | **B1+ darslar** (76-96) → 8 ta reading passage | Topic: society, environment, health, media. 200-300 words, 5-6 MC + 1 main idea | 🟡 High |

### 2.2. Dictation (Listening) — Barcha darslarga

| # | Vazifa | Texnika | Prioritet |
|---|--------|---------|-----------|
| 2.2.1 | **A1 darslar** → 5 ta dictation | SpeakingPath dan dictation texnologiyasini olish (`ListeningSection.dictation`). Oddiy: 2-3 jumla, 10-15 so'z. `youtubeId` orqali audio | 🟡 High |
| 2.2.2 | **A2 darslar** → 8 ta dictation | O'rtacha: 3-4 jumla, 15-25 so'z | 🟡 High |
| 2.2.3 | **B1 darslar** → 8 ta dictation | Murakkab: 4-5 jumla, 25-40 so'z | 🟡 High |
| 2.2.4 | **TTS-generated dictation** | YouTube video topish qiyin bo'lgan darslar uchun TTS (AWS Polly / Google TTS) dan foydalanib audio generatsiya qilish | 🟢 Medium |

### 2.3. Writing bo'limi — A2 va undan yuqori

| # | Vazifa | Batafsil | Prioritet |
|---|--------|----------|-----------|
| 2.3.1 | **A2 darslar** → 5 ta writing prompt | Minimal: 3-4 gap. Topic: describe your family, your room, your day. `WritingSection` type ishlatiladi | 🟡 High |
| 2.3.2 | **B1 darslar** → 8 ta writing prompt | O'rtacha: paragraph (50-100 words). Topic: opinion, experience, plan | 🟡 High |
| 2.3.3 | **B1+ darslar** → 8 ta writing prompt | Uzun: 100-150 words, essay structure. Topic: argumentative, descriptive | 🟡 High |
| 2.3.4 | **Writing AI evaluation** ni barcha writing prompt larga ulash | `evaluateWriting` funksiyasi (`claude.ts`) hozir IELTS style da. A1/A2 uchun soddaroq evaluation qo'shish | 🟢 Medium |

### 2.4. Speaking bo'limi — Daily Lessons ga integratsiya

| # | Vazifa | Texnika | Prioritet |
|---|--------|---------|-----------|
| 2.4.1 | **SpeakingSection** ni SpeakingPath dan olish | `SpeakingSection.tsx` komponenti allaqachon mavjud, lekin dailyLessons da ishlatilmayapti. Lesson ga `speaking` field qo'shish | 🟡 High |
| 2.4.2 | **A2-B1** ga 5 tadan speaking prompt | SpeakingPath curriculum dan topic lar bilan bog'lab qo'yish. Misol: "Ordering food" → A2 Food lesson | 🟡 High |
| 2.4.3 | **AI speaking evaluation** ni ulash | `evaluateSpeech` funksiyasi orqali fluency/grammar/vocabulary ball berish | 🟢 Medium |

### 2.5. Curriculum gap analysis — To'liq audit

| # | Vazifa | Prioritet |
|---|--------|-----------|
| 2.5.1 | **CEFR can-do statements** bilan solishtirish | Har bir darsning `goalUz` va `subtitle` ni CEFR checklists bilan solishtirish. Yo'qotilgan kompetensiyalarni aniqlash | 🟡 High |
| 2.5.2 | **Grammar scope & sequence** auditi | A1→B2 grammatika ketma-ketligi CEFR tavsiyalariga mosligini tekshirish (masalan: Present Perfect B1 da, Mixed Conditionals B2 da — to'g'ri) | 🟢 Medium |
| 2.5.3 | **Vocabulary frequency audit** | Eng ko'p ishlatiladigan 2000 so'z (BNC/COCA) bilan dars vocabulary sini solishtirish. KAM uchraydigan so'zlarni almashtirish | 🟢 Medium |

---

## FAZA 3: AI & Personalizatsiya (6-12 oy)

> **Maqsad**: Platformani "adaptive learning assistant" ga aylantirish

### 3.1. Adaptive Learning Engine

| # | Vazifa | Texnologiya | Prioritet |
|---|--------|-------------|-----------|
| 3.1.1 | **Knowledge tracing** | Bayesian Knowledge Tracing (BKT) yoki Deep Knowledge Tracing (DKT) modeli. Har bir mashq natijasiga qarab, qaysi rule ni o'zlashtirganini aniqlash | 🟡 High |
| 3.1.2 | **IRT (Item Response Theory)** | 3-parameter logistic model (3PL): discrimination, difficulty, guessing parametrlari. Test natijalarini kalibrlash | 🟢 Medium |
| 3.1.3 | **Adaptive difficulty** | Mashq qiyinchiligini o'quvchi darajasiga moslashtirish. Agar 3 ta ketma-ket to'g'ri javob → qiyinroq variant | 🟡 High |
| 3.1.4 | **Personalized review scheduling** | FSRS-5 faqat vocabulary uchun. Grammar rules uchun ham SRS qo'shish. Har kuni eng zaif 5 ta rule ni takrorlash | 🟡 High |

### 3.2. AI Tutor 2.0

| # | Vazifa | Batafsil | Prioritet |
|---|--------|----------|-----------|
| 3.2.1 | **Real-time error feedback** | Mashq bajarishda xato bo'lsa, darhol AI explanation ko'rsatish (hozir faqat yakuniy explanation bor) | 🟡 High |
| 3.2.2 | **AI conversation partner** | Hozirgi `Chat.tsx` va `Conversation.tsx` ni birlashtirish. Scenario-based roleplay (SpeakingPath dan olingan) | 🟡 High |
| 3.2.3 | **Writing assistant** | Writing prompt da foydalanuvchi yozayotganda real-time grammar check va suggestion | 🟢 Medium |
| 3.2.4 | **AI-generated exercises** | `generatePracticeExercises` dan foydalanib, o'quvchining zaif mavzulariga mos mashqlar generatsiya qilish | 🟢 Medium |
| 3.2.5 | **Weekly AI report** | Har hafta: "Sizning kuchli tomonlaringiz: Present Perfect, Weak areas: Conditionals (62% accuracy). Tavsiya: Day 82-83 ni qayta o'ting" | 🟢 Medium |

### 3.3. Learning Analytics

| # | Vazifa | Batafsil | Prioritet |
|---|--------|----------|-----------|
| 3.3.1 | **Detailed analytics dashboard** | Hozirgi `Dashboard.tsx` ga qo'shimcha: (1) Accuracy by grammar topic chart, (2) Learning speed (words/day, exercises/day), (3) Time spent per skill | 🟡 High |
| 3.3.2 | **Forgetting curve visualization** | FSRS-5 ma'lumotlari asosida: qaysi so'zlar/rules tez unutilayotganini ko'rsatuvchi chart | 🟢 Medium |
| 3.3.3 | **Cohort analytics** | O'quvchilar guruhlari bo'yicha progress: "B1 o'quvchilari o'rtacha 45 kunda B1+ ga o'tadi" | 🟢 Medium |
| 3.3.4 | **A/B testing framework** | Feature flag tizimi + analytics. "AI feedback bilan vs without" — qaysi biri samarali? | 🟢 Medium |

### 3.4. Error Detection & Prevention

| # | Vazifa | Batafsil | Prioritet |
|---|--------|----------|-----------|
| 3.4.1 | **Sentry error grouping** va alert | Hozir Sentry ulangan, lekin alert yo'q. Critical errors (Auth failure, Lesson load failure) → Telegram/Email | 🟡 High |
| 3.4.2 | **Error boundary monitoring** | Har bir page `ErrorBoundary` bilan o'ralganmi? UI da "Report error" button | 🟢 Medium |
| 3.4.3 | **Performance monitoring** | Web Vitals (LCP, FID, CLS) tracking + build size budget (500kb per chunk max) | 🟢 Medium |

---

## FAZA 4: Scale & Ecosystem (12-18 oy)

> **Maqsad**: Platformani ko'p tilli, ko'p platformali ekosistemaga aylantirish

### 4.1. Mobile App (React Native)

| # | Vazifa | Batafsil | Prioritet |
|---|--------|----------|-----------|
| 4.1.1 | **Core shared logic** | Zustand store, services, lib (claude, supabase, srs) — React Native bilan mosligini tekshirish | 🟢 Medium |
| 4.1.2 | **Native speech recognition** | Web Speech API o'rniga React Native Voice (iOS: Siri, Android: Google Speech) | 🟢 Medium |
| 4.1.3 | **Offline-first mobile** | Dexie IndexedDB → React Native Async Storage / SQLite. Full offline sync | 🟢 Medium |

### 4.2. Content Expansion

| # | Vazifa | Batafsil | Prioritet |
|---|--------|----------|-----------|
| 4.2.1 | **IELTS preparation module** | Hozirgi `MockTest.tsx` ni kengaytirish: Full IELTS mock tests (Academic/General), timed, band score prediction | 🟡 High |
| 4.2.2 | **Business English** | Emails, meetings, presentations, negotiations. A2-B2, 30 lessons | 🟢 Medium |
| 4.2.3 | **Kids English** | A1 level gamification: more images, short animations, parent dashboard | 🟢 Low |
| 4.2.4 | **Uzbek → English** emas, boshqa tillar uchun | Russian, Korean, Turkish, Chinese speakers uchun. `i18n` tizimi allaqachon tayyor | 🟢 Low |

### 4.3. Community & Social

| # | Vazifa | Batafsil | Prioritet |
|---|--------|----------|-----------|
| 4.3.1 | **Leaderboards** | Hozirgi ELO tizimini kengaytirish: weekly challenges, friends leaderboard, streak competition | 🟢 Medium |
| 4.3.2 | **Study groups** | O'quvchilar guruh bo'lib o'rganishi: guruh chat, tandem (AI emas, real user) | 🟢 Low |
| 4.3.3 | **Content creator mode** | O'qituvchilar o'z darslarini yaratishi: lesson builder, drag-drop exercise editor | 🟢 Low |

### 4.4. Infrastructure & DevOps

| # | Vazifa | Batafsil | Prioritet |
|---|--------|----------|-----------|
| 4.4.1 | **Vercel → dedicated hosting** | Agar user base > 10,000 bo'lsa, dedicated server (AWS/DigitalOcean) + Docker | 🟢 Medium |
| 4.4.2 | **Database migration** | Supabase dan chiqish (agar cost yuqori bo'lsa): PostgreSQL + Redis + S3. Yoki Supabase Pro ga upgrade | 🟢 Low |
| 4.4.3 | **CDN optimization** | Lesson data (JSON) ni CDN ga ko'chirish. Images/audio ni CDN (Cloudinary/Imgix) orqali serve qilish | 🟢 Low |
| 4.4.4 | **i18n automation** | Crowdin / Lokalise integratsiyasi. Translatorlar uchun web interface. Auto-translate (DeepL) + human review | 🟢 Medium |

---

## IMPLEMENTATSIYA REJASI (12 oy)

### Quarter 1 (0-3 oy) — 🎯 Foundation
```
Month 1:  🔴 1.1.1, 1.1.2, 1.2.1, 1.2.2
Month 2:  🟡 1.1.3, 1.2.3, 1.2.4, 1.2.5
Month 3:  🟡 1.3.1, 1.3.2, review + fixes
```

### Quarter 2 (3-6 oy) — 📚 Content
```
Month 4:  🟡 2.1.1, 2.1.2, 2.2.1 (A1-A2 reading + dictation)
Month 5:  🟡 2.1.3, 2.2.2, 2.3.1, 2.3.2 (B1 reading, A2 writing)
Month 6:  🟡 2.1.4, 2.2.3, 2.3.3, 2.4.1, 2.4.2 (B1+ reading, B1 writing, speaking)
```

### Quarter 3 (6-9 oy) — 🤖 AI & Analytics
```
Month 7:  🟡 3.1.1, 3.1.2, 3.1.3 (Knowledge tracing + IRT)
Month 8:  🟡 3.2.1, 3.2.2, 3.3.1 (AI feedback + analytics)
Month 9:  🟡 3.1.4, 3.2.3, 3.2.4, 3.2.5 (Grammar SRS + AI generated)
```

### Quarter 4 (9-12 oy) — 🚀 Scale
```
Month 10: 🟡 4.2.1 (IELTS module)
Month 11: 🟢 3.3.2, 3.3.3, 3.3.4, 3.4.1, 3.4.2 (Analytics + monitoring)
Month 12: 🟢 4.2.2, 4.3.1, 4.4.1 (Biz English + leaderboard + infra)
```

---

## METRIKALAR (KPI)

| KPI | Hozir | 3 oy | 6 oy | 12 oy |
|-----|-------|------|------|-------|
| **Test pass rate** | 91% (1005/1011) | 100% | 100% | 100% |
| **Code coverage** | ~20% | 30% | 40% | 55% |
| **Nazariya→Mashq qamrovi** | 65-75% | 85% | 92% | 98% |
| **Skills bo'limi qamrovi** | ~30% | 45% | 70% | 90% |
| **Darslarda vocab test** | 0% | 30% | 60% | 100% |
| **Offline rejim** | Asosiy | Yaxshilangan | To'liq | To'liq |
| **AI personalizatsiya** | Basic | Adaptive | Full | Full |
| **Mobile UX** | PWA | PWA+ | React Native Beta | React Native |

---

## XULOSA

EnglishPath allaqachon kuchli poydevorga ega:
- ✅ FSRS-5 spaced repetition
- ✅ 30+ AI funksiya (Claude)
- ✅ 126 kunlik curriculum
- ✅ Offline-first arxitektura
- ✅ PWA + Service Worker
- ✅ Zustand + Supabase + Dexie

**Professional darajaga chiqish uchun eng muhim 3 qadam:**
1. **Test va CI** — Professional darajadagi birinchi belgi: har bir commit da testlar o'tadi
2. **Skills bo'limlari** — Hech bir professional til platformasi faqat grammar drills bilan cheklanmaydi
3. **Adaptive learning** — "Bir o'lcham hammaga mos" emas, har bir o'quvchiga mos curriculum

> *"The best language learning platform is not the one with the most content, but the one that adapts to each learner's unique path."*
