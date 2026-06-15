# EnglishPath — Loyiha Hujjati

> **Platforma:** Ingliz tili o'quv platformasi (A0 → B2), O'zbekiston bozori uchun
> **Tech Stack:** React 18 · TypeScript 5 · Vite 5 · Tailwind CSS · Zustand · Supabase · Dexie · PWA · Claude API
> **Oxirgi yangilanish:** 2026-06-15
> **Holat:** tsc 0 · lint 0 · test 1111/1111 · build ✓

Bu hujjat barcha eski `.md` fayllar (ROADMAP_TO_PERFECTION, PLATFORM_ANALYSIS, CRITICAL_ANALYSIS, SPEAKING_CURRICULUM_REWORK, speaking.md, speaking_curriculum_roadmap, personal-vocabulary-feature-report, SHAXSIY_LUGAT_SPESIFIKATSIYASI, F2-10/F9-1 hisobotlar, TODO) o'rnini bosadi — **yagona manba**.

---

## 1. Umumiy Manzara

EnglishPath — A0 dan B2 gacha ingliz tilini o'rgatuvchi zamonaviy, offline-first web platforma. To'liq o'zbek tilida, FSRS-5 spaced repetition, AI integratsiya (Claude) va PWA bilan.

### Joriy ko'rsatkichlar (koddan tasdiqlangan, 2026-06-15)

| Metrika | Qiymat | Manba |
|---------|--------|-------|
| Daily darslar | 106 content + 26 review | `cefr-audit` |
| Listening qoplama | **100%** (A1 23/23 · A2 22/22 · B1 18/18 · B1+ 18/18 · B2 25/25) | `cefr-audit` |
| Interleaved (aralash) mashqlar | **51 dars / 255 mashq** (B1 11 + A2 20 + B2 20) | `id: 95xxx` |
| i18n kalitlar | 1137 (uz/en/ru — to'liq parite) | `check:i18n` |
| Speaking kunlari | ~97–100 (A0–B1+) — ⚠️ faol qayta ishlanmoqda | `days.ts` |
| Test | 1111 passed · tsc 0 · lint 0 · build ✓ | gate |

> ⚠️ **Speaking Path hozir faol qayta ishlanmoqda** (3-bo'lim) — kun soni va qoplama beqaror.

---

## 2. Arxitektura

```
src/
├── components/
│   ├── dailyLesson/      # ExerciseCard, LessonView, ReviewView, ListeningSection
│   ├── speakingPath/     # SpeakingLadder, ShadowStep, RecallPanel, HoldMicButton
│   └── vocabulary/       # FlashCard, WordTest, VocabBattle
├── data/
│   ├── daily/            # 106 dars (a1Part1-2, a2Part1-4, b1Part1, b1plusPart1-2, b2Part1-3, b2Extra)
│   ├── speakingPath/     # SpeakingDay'lar + types + tests
│   ├── tenses/           # 12 zamon darsi
│   └── i18n/             # uz/en/ru (1137 kalit)
├── lib/
│   ├── ai/               # claude-grammar/vocab/speaking/exercises/writing/duel (F3-2 split)
│   ├── srs.ts            # FSRS-5 algoritmi
│   └── performance.ts    # Web Vitals + budjet
├── hooks/                # useSpeechRecognition, useAudioRecorder, useSpeechSynthesis
├── services/             # speakingPathService, contentService, personalVocabularyService
├── store/                # Zustand (persist)
└── pages/
scripts/                  # check:i18n, check:murojaat, check:youtube, audit:cefr,
                          # seed-interleaved, validate-speaking-grammar-map, cefr-audit
e2e/                      # Playwright
```

### Mashq turlari (`DailyExercise` union)
`fill-blank` · `multiple-choice` · `error-correction` · `transformation` · `fill-table` · `vocab-match` · `passage` (kontekstli) · `connection` (elaborative encoding)

---

## 3. Speaking Path — Curriculum Rework (FAOL — IN PROGRESS)

> ⚠️ Bu bo'lim **hozir faol ishlab chiqilmoqda** (`days.ts`, `SpeakingLadder`, validatsiya o'zgartirilmoqda). Quyidagi — **target reja** (v4), holat beqaror.

### 3.1. Maqsad (tasdiqlangan)
Foydalanuvchi har CEFR darajasini speaking'da tugatganda, shu darajaning **barcha grammar qoidalari va barcha lug'atini** gapirib, tushunib, **yodlab** o'zlashtirgan bo'lishi shart.

### 3.2. Tasdiqlangan qarorlar
1. **Qamrov 1:1** — har qamralmagan daily darsga 1 ta speaking kun (grammatikasi + barcha lug'ati).
2. **To'liq lug'at** — har darajaning HAR vocab id'si ≥1 speaking kunда (`usedVocabIds`).
3. **Mastery gate** — darajani tugatish uchun barcha grammar point + barcha vocab o'zlashtirilishi shart.

### 3.3. Asosiy gap (`validate:speaking` oxirgi barqaror o'lchov)
**37 daily dars** hech qaysi speaking kunга bog'lanmagan edi:

| Daraja | Bog'lanmagan | Soni |
|--------|--------------|------|
| A1 | can-cant, present-continuous, simple-future, question-words ... | 7 |
| A2 | comparatives, past-continuous, passive, reported-speech ... | 8 |
| **B1** | **BARCHA B1 grammatikasi** (modals, causatives, perfect tenses ...) | **18** |
| B1+ | advanced-relative-clauses, fronting, advanced-phrasal-verbs ... | 4 |

➡️ Eng katta ta'sir: **B1** (0/18). B2 esa to'liq qoplangan edi.

### 3.4. Reja (5 faza)
1. **Kontent:** 37 yangi grammar-driven speaking kun (1:1) — har biri `linkedLessonId` + `grammarPoint` + 5–8 chunk + `usedVocabIds` (to'liq lug'at) + scenario.
2. **Vocab qamrov:** har vocab id ≥1 kunда (validatsiya bilan).
3. **Mastery gate:** `getLevelMastery()` — grammar (≥70) + vocab recall; 100% bo'lmaguncha daraja "tugadi" bermaydi. Eski progress saqlanadi.
4. **Validatsiya:** `validate-speaking-grammar-map.ts` — gap bo'lsa FAIL (hozir ogohlantiradi).
5. **Tooling:** `seed-speaking-days.ts` (idempotent, auto-id, tekshiruvli).

> Tavsiya: B1 batch'dan boshlash. Har batch: tsc/lint/validate/test → commit.

---

## 4. Funksiya holati

### ✅ Bajarilgan (mustahkam, tekshirilgan)

| Soha | Tafsilot |
|------|----------|
| Listening | **Barcha 106 darsга** TTS audio + transkript + savollar (100%). YouTube'siz ishlaydi |
| Interleaved | **51 dars** (B1+A2+B2), 255 aralash mashq, unik ID, dublikatsiz |
| i18n parite | uz/en/ru 1137 kalit, guard test (drift bloklanadi) |
| Mashq turlari | `passage` + `connection` qo'shildi; `acceptedAnswers` (muqobil javoblar) |
| AI modullari | `claude.ts` → 6 ta `ai/` domen moduli (SRS-toza) |
| `any` tipsizlik | Production'da 0 (faqat test-infra'da) |
| Mobil speech-to-text | Android STT mikrofon talashuvi tuzatildi (eksklyuziv mic) |
| Web Vitals budjeti | LCP/FID/CLS/FCP chegaradan oshsa `warn` |
| Audit vositalari | i18n, murojaat (rasmiy "siz"), youtube, cefr, seed-interleaved |
| FSRS-5 | 19-parametrli professional spaced repetition |
| Offline-first | Dexie ↔ Supabase sync, PWA |
| Shaxsiy lug'at | user_words, FSRS, FlashCard/Test/Game, CSV/Anki/JSON eksport, AI tarjima |

### ⚠️ Qisman / davom etmoqda

| Soha | Holat | Qoldiq |
|------|-------|--------|
| Speaking curriculum | faol rework | 3-bo'lim: 37 dars + mastery gate |
| Interleaved | 51/106 | A1 (0/23) + B1+ (0/18) |
| Lokalizatsiya | 30/32 sahifa | Dictionary/Vocabulary sub-komponentlar (~500 string) |
| Mini-passages | qisman | B1+ 9/18, A2 8/22 da kam |
| CMS migratsiya | qisman | DB'da bor, lekin to'liq cutover yo'q |
| Listening fallback | TTS ishlaydi | 69 dead YouTube video almashtirilishi kerak |
| Test coverage | ~66% | LessonView komponent testi yo'q |

---

## 5. Bajarilmagan ishlar (yagona ro'yxat)

### ❌ To'liq bajarilmagan

| # | Vazifa | Hajm |
|---|--------|------|
| 1 | Test coverage oshirish (LessonView, lesson-level) | 2–3 kun |
| 2 | Incremental seed (faqat o'zgargan darslar) | 1–2 kun |
| 3 | AI Tutor 2.0 (real-time feedback, weekly report) | 2–3 hafta |
| 4 | i18n avtomatlashtirish (Crowdin/Lokalise) | 1 hafta |
| 5 | Adaptive engine (BKT/IRT) | 2 hafta |
| 6 | Analytics dashboard (`AnalyticsSection`) | 1 hafta |
| 7 | Ichki motivatsiya (Personal Why, Progress Journal) | 1 hafta |
| 8 | Speaking AI prosodik baholash (intonatsiya/stress/rhythm) | 2 hafta |
| 9 | CEFR semantic audit (can-do mosligi) | 1 hafta |
| 10 | Onboarding yaxshilash (5-step) | 1 hafta |
| 11 | Accessibility audit (ARIA, screen reader) | 1 hafta |
| 12 | Monetizatsiya modeli | 2 hafta |
| 13 | Scale (React Native, Kids, Community) | 3+ oy |
| 14 | "Til Sarguzasht" narrativ qatlam | katta |
| 15 | Error Detection & Prevention (to'liq) | 1 hafta |
| 16 | i18n Crowdin (tashqi SaaS) | — |

### 🔴 Tezlik talab qiladigan
1. **Speaking curriculum rework** (3-bo'lim) — B1 0/18, mastery gate
2. **Interleaved A1/B1+** (0/23, 0/18) — qolgan darajalar
3. **LessonView test coverage**
4. **Noaniq fill-blank mashqlar** — `acceptedAnswers` qo'shish (qisman boshlangan)
5. **69 dead YouTube video** almashtirish

---

## 6. Texnik qarorlar

| Qaror | Tanlov | Sabab |
|-------|--------|-------|
| State | Zustand + persist | Yengil, TS-friendly |
| SRS | FSRS-5 | Professional (19 parametr), Leitner'dan ustun |
| Offline | Dexie + Supabase | IndexedDB + background sync |
| AI | Claude API (Vercel proxy) | Client-side kalit yo'q |
| Build | Vite 5 | Tez, HMR |
| Test | Vitest + Playwright | Unit + E2E |
| CSS | Tailwind | Utility-first, dark mode |
| Listening audio | Browser TTS (SpeechSynthesis) | YouTube'ga bog'liqlikni yo'qotadi |

---

## 7. Keyingi qadamlar

**Qisqa (1–2 hafta):** Speaking rework (B1 batch) · Interleaved A1/B1+ · LessonView test · noaniq mashqlar.
**O'rta (1–3 oy):** Speaking mastery gate · Analytics dashboard · Adaptive engine · CMS cutover · test 80%.
**Uzoq (3–12 oy):** AI Tutor 2.0 · React Native · Community · Monetizatsiya.

---

## 8. Sifat darvozalari (har o'zgarishdan keyin)

```bash
npx tsc --noEmit                    # 0 xato
npm run lint                        # 0 ogohlantirish
npm test                            # 1111 passed
npm run build                       # ✓ (dublikat-ID tekshiruvi bilan)
npm run check:i18n                  # tarjima parite
npm run validate:speaking          # speaking ↔ grammar qoplama
npm run audit:cefr                  # kurrikulum strukturasi
```

---

> *Yagona loyiha hujjati. Eski tarqoq `.md` fayllar shu faylga birlashtirildi.*
