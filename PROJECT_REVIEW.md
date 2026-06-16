# EnglishPath — Loyiha Tanqidiy Xulosasi

**Sana:** 2026-06-16  
**Versiya:** 1.1.0  
**Holat:** Tsc 0 xato · Testlar 1264/1264 o'tdi · Build muvaffaqiyatli

---

## Bir jumlada

Texnik jihatdan boy, zamonaviy va ambitsion mahsulot — poydevor kuchli, lekin "feature qo'shish" tezligi "muhandislik intizomi"dan o'zib ketgan. Hozir holati yashil, ammo barqarorligi mo'rt.

---

## Umumiy metrikalar

| Metrika | Qiymat | Baho |
|---------|--------|------|
| Manba fayllari (TS/TSX) | ~440 | — |
| Jami satrlar | ~140,000 | katta |
| data/ ulushi | ~42% | qattiq-kodlangan |
| Eng katta fayl | ListeningSection.tsx · Profile.tsx 460 | monolit |
| tsc xatolari | 0 | ✅ |
| as any / @ts-ignore / TODO | 0 / 0 / 0 | ✅ a'lo |
| eslint-disable | 29 fayl | ⚠️ |
| Test fayllari | 98 / ~330 manba ≈ 30% | ⚠️ past |
| Jami testlar | 1,264 | ✅ |
| Mashq auditi | 5,595 mashq → 0 muammo | ✅ |
| Speaking kunlari | 125 (A0→A1→A2→B1→B2) | ✅ boy |
| Daily lessonlar | 126 | ✅ |
| i18n kalitlari | 1,230+ (uz/en/ru) | ✅ |
| npm audit | 0 zaiflik | ✅ |
| Ish daraxti | 14 o'zgargan + 1 kuzatilmagan | ⚠️ ifloslangan |

---

## Kuchli tomonlar

### 1. Tip xavfsizligi namunali

Butun production'da `0 as any`, `0 @ts-ignore`, `0 TODO`. `tsconfig.json` da `strict: true`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch` yoqilgan. Ko'p yetuk loyihada bunday emas.

```
tsconfig.json:
  "strict": true
  "noUnusedLocals": true
  "noUnusedParameters": true
  "noFallthroughCasesInSwitch": true
```

### 2. Offline-first arxitektura

Uch qatlamli offline saqlash tizimi ishlangan:

| Qatlam | Texnologiya | Vazifa |
|--------|-------------|--------|
| 1-qatlam | localStorage | Theme, auth, SRS state |
| 2-qatlam | IndexedDB (Dexie) | Darslar, progress, vocabulary, writings |
| 3-qatlam | Supabase (PostgreSQL) | Cloud sync, real-time |

- Cross-user data isolation: `partialize` orqali user-specific ma'umotlar localStorage'dan chiqarilgan
- Foydalanuvchi almashganda tozalash: `localStorage.clear()` + IndexedDB wipe + hard redirect
- Conflict resolution: `src/services/conflictResolution.ts` — smart merge strategiyalari

### 3. Modulli funksional tuzilma

```
src/
├── components/          # 155 ta komponent (20 papka)
│   ├── dailyLesson/     # 22 fayl — dars ko'rish tizimi
│   ├── speakingPath/    # 19 fayl — speaking curriculum
│   ├── vocabulary/      # 17 fayl — flashcard, games, analytics
│   ├── ui/              # 17 fayl — qayta ishlatiladigan primitive'lar
│   ├── phrases/         # 11 fayl — phrase flashcards, games
│   └── tandem/          # 9 fayl — social features
├── data/                # 74 fayl — statik kontent
├── services/            # 57 fayl — backend/API service qatlami
├── pages/               # 47 fayl — sahifa komponentlari
├── lib/                 # 34 fayl — utilitlar, Supabase client, AI
├── store/               # 16 fayl — Zustand state management
├── hooks/               # 18 fayl — custom React hook'lar
├── utils/               # 10 fayl — sof utilitar funksiyalar
├── i18n/                # 6 fayl — xalqaro lashtirish
└── types/               # 5 fayl — TypeScript turli aniqlashlar
```

### 4. Kontent boyligi

| Modul | Miqdor | Tavsif |
|-------|--------|--------|
| Daily lessons | 126 dars | A0→B2, har biri vocabulary, exercises, tests |
| Speaking path | 125 kun | CEFR-ordered, chunks, vocab, grammar, scenario |
| Listening | 100% qamrov | Har bir darsda listening section |
| Grammar topics | 36+ | Tenses, conditionals, passive, reported speech |
| Vocabulary | 354+ so'z | SEED_WORDS + dars vocab |
| Confusable pairs | 30+ | Common English mistakes |
| Phrasal verbs | 50+ | Idiomatic expressions |
| Idioms | 50+ | Cultural expressions |
| Mock tests | 100+ savol | CEFR-style assessment |
| AI features | 6 modul | Chat, speaking, writing, grammar, vocab, duel |

### 5. AI integratsiyasi

- Anthropic Claude API proxy orqali (`/api/claude`)
- 6 ta ixtisoslashgan Claude moduli: `claude-duel`, `claude-exercises`, `claude-grammar`, `claude-speaking`, `claude-vocab`, `claude-writing`
- Streaming va non-streaming xabarlar
- AI study buddy, AI insights, AI chat, AI conversation
- Dev serverda API key server-side qoladi (proxy plugin)

### 6. i18n tizimi

- 3 til: O'zbek (asosiy), English, Russian
- Custom provider (`src/i18n/index.tsx`) — kutubxona bog'liqligi yo'q
- Type-safe: 1,230+ kalit `TranslationStrings` interfeysida
- Lazy-loaded locale fayllari
- `{variable}` interpolatsiya
- Locale persistence localStorage'da
- `check:i18n.ts` orqali kalitlar paritysi tekshiriladi

### 7. Xavfsizlik asoslari

- API keylar kodda emas — `.env` faylda, `.gitignore` da
- Supabase RLS (Row Level Security) ishlatilgan
- Auth flow: Supabase Auth + onAuthStateChange listener
- Foydalanuvchi almashganda tozalash — cross-user leakage oldini oladi

### 8. Monitoring

- Sentry integration (lazy initialization)
- Pluggable monitoring provider pattern
- Core Web Vitals budget tracking (LCP, FID, CLS, FCP)
- Chunk load error handling with auto-recovery

### 9. PWA

- Service Worker (Workbox) — offline fallback
- CacheFirst for static assets (30-day)
- StaleWhileRevalidate for Supabase data
- VitePWA plugin with `injectManifest`

### 10. Audit madaniyati

`package.json` da 8 ta validate/audit scripti:

| Script | Vazifa |
|--------|--------|
| `validate:ids` | ID unikalligini tekshirish |
| `validate:speaking` | Speaking path strukturasini tekshirish |
| `audit:ambiguous` | Noto'g'ri javoblarni aniqlash |
| `check:i18n` | i18n kalitlar paritysini tekshirish |
| `audit:cefr` | CEFR level mosligini tekshirish |
| `check:youtube` | YouTube havolalarini tekshirish |
| `audit:exercises` | Mashq sifatini tekshirish (5,595 mashq) |

---

## Zaif tomonlar — jiddiylik bo'yicha

### P0 — Eng dolzarb

#### 1. Monolit fayllar

| Fayl | Hajm | Muammo |
|------|------|--------|
| ~~`src/data/speakingPath/days.ts`~~ | ~~5,135 qator~~ | ✅ `a0Days`-`b2Days` ga bo'lingan |
| ~~`src/pages/Profile.tsx`~~ | ~~1,922 qator~~ | ✅ 460 qator — 4 widgetga bo'lingan |
| ~~`src/components/dailyLesson/LessonView.tsx`~~ | ~~1,680 qator~~ | ✅ **120 qator** — 10 komponent + 1 hook bo'lingan |
| `src/components/dailyLesson/ListeningSection.tsx` | 52KB+ | ⚠️ Qolgan eng katta monolit |
| `src/components/phrases/Phrases.tsx` | 40KB+ | Yangi dev uchun kirish og'ir |

**Oqibat:** Refactor qiyin, bug fix'da regressiya xavfi yuqori, yangi developer uchun kirish qiyin, test yozish murakkablashadi.

#### 2. Kontent mo'rtligi (42% qattiq-kod)

```
src/data/daily/a1Part1.ts — 237KB
src/data/daily/b1Part1.ts — 355KB
src/data/daily/b2Part1.ts — 257KB
src/data/mockTestData.ts  — 109KB
src/data/speakingPrompts.ts — 48KB
src/data/writingPrompts.ts  — 49KB
```

**Oqibat:** Bitta missing brace yoki noto'g'ri quote butun app buildini buzadi. Bu shu sessiyada 2 marta jonli ko'rildi (`days.ts:2614`, `:4521`).

#### 3. ~~npm audit: 13 zaiflik~~ ✅ **0 zaiflik**

Oldingi kritik zaifliklar `npm audit fix` bilan to'liq tuzatilgan.

#### 4. Parallel jarayon tartibsizligi

Sessiya davomida `HEAD d38ef41` ga ko'chib, keyin `ffe775e` ga qaytdi; tasdiqlanmagan ish commit qilindi, branch vaqtincha buzildi. Bir vaqtda ikki yozuvchi `days.ts` ni buzmoqda.

**Oqibat:** Merge conflict, yo'qolgan ish, barqarorsizlik.

---

### P1 — Yuqori

#### 5. Test qoplamasi past (~29%)

| Modul | Qamrov | Holat |
|-------|--------|-------|
| Servislar | 26/29 (90%) | ✅ yaxshi |
| Store | 6/8 (75%) | ✅ yaxshi |
| Komponentlar | 7/19 (37%) | ⚠️ yetarli emas |
| Sahifalar | 10/34 (29%) | ❌ juda kam |
| Hooks | 5/13 (39%) | ⚠️ yetarli emas |
| Lib | 6/24 (25%) | ❌ juda kam |
| Utils | 2/8 (25%) | ❌ juda kam |

**Testlanmagan yirik modullar:**
- `src/pages/Dashboard.tsx`
- `src/pages/Profile.tsx`
- `src/pages/SpeakingPath.tsx`
- `src/pages/Grammar.tsx`
- `src/pages/Chat.tsx`
- `src/components/dailyLesson/LessonView.tsx`
- `src/components/dailyLesson/ListeningSection.tsx`
- `src/lib/ai/` — 6 ta Claude integration moduli
- `src/services/stateSync.ts` — sync mantiqi murakkab, lekin yetarli testlanmagan
- `src/components/dailyLesson/__tests__/SectionProgressBar.test.tsx` ✅ (yangi)

#### 6. Tugallanmagan oqimlar

- `src/pages/PersonalVocabulary.tsx` — 7 qator wrapper, feature component bor lekin to'liq product flow emas
- `src/pages/TandemPage.tsx` — 9 qator wrapper, minimal fayl
- Ba'zi featurelar component-level mavjud, lekin product flow sifatida hali to'liq emas

#### 7. Kontent sifati faqat strukturaviy tekshiriladi

Mexanik bug'lar (input soni, takror, bo'sh javob) avtomat aniqlanadi. Lekin semantik sifat hali inson/AI tekshiruvini talab qiladi:
- Tabiiy jumla
- To'g'ri tarjima
- CEFR mosligi
- Distractor mantig'i
- YouTube mavjudligi
- Audio URL mavjudligi

#### 8. Supabase schema governance yetarli emas

Client tarafda ko'plab table/column nomlari bor, lekin SQL migratsiya fayllari hamma domain uchun bir joyda standartlashtirilmagan:

```
scripts/create_speaking_path_tables.sql
scripts/create_tandem_tables.sql
scripts/personal_vocabulary_setup.sql
```

Barcha yangi featurelar uchun schema, index, trigger, RLS policy bir joyda tekshirilmaydi.

#### 9. Local va remote sync mantiqi murakkab

`src/services/lessonService.ts`, `src/services/stateSync.ts`, `src/services/conflictResolution.ts` da smart merge strategiyalari bor. Lekin quyidagilar hali yetarli testlanmagan:
- Offline → online sync
- Two-device concurrency
- Stale update
- User switching
- Token expire
- Supabase write error fallback

---

### P2 — O'rta

#### 10. scripts/ ifloslangan

- 62 fayl `scripts/` papkasida
- 21 bir martalik `fix-*.py` fayl
- 17 kuzatilmagan `.py` fayl ish daraxtida
- Branch vaqtincha buzildi

#### 11. Type assertion bypass

Production kodida 72 ta `as unknown as` + 24 ta `as never` ishlatilgan. Supabase generated types to'liq ishlatilmayapti:

| Fayl | `as unknown as` | `as never` |
|------|-----------------|------------|
| `personalVocabularyService.ts` | 11 | 11 |
| `tandemService.ts` | 11 | 4 |
| `lessonService.ts` | 6 | — |
| `phrasesService.ts` | 4 | — |
| `i18n/index.tsx` | 4 | — |
| Boshqalar | 36 | 9 |

**Oqibat:** Compile vaqtida xato topilmaydi, runtime'da qulab tushishi mumkin.

#### 12. Xatoliklar yutilgan

136+ ta `catch {}` blokida hech qanday logging yo'q:

| Fayl | Silent catch soni |
|------|-------------------|
| `speakingPathService.ts` | 9 |
| `tandemService.ts` | 8 |
| `useSpeechRecognition.ts` | 6 |
| `aiBuddyService.ts` | 3 |
| `speakingAchievementService.ts` | 3 |
| Boshqalar | 107+ |

**Oqibat:** Foydalanuvchi xatosini tushunib bo'lmaydi, debugging qiyin.

#### 13. Kod takrorlanishi

- SSE streaming logigi 4 joyda bir xil nusxa (`claudeClient.ts`, `aiBuddyService.ts`)
- `proxyFetch()` 2 joyda takrorlangan
- `ChatMessage` interfeysi 3 joyda aniqlangan
- `MODEL` konstantasi 2 joyda takrorlangan

#### 14. Xavfsizlik muammolari

- 6 ta `dangerouslySetInnerHTML` — aksari i18n, lekin `Auth.tsx` da email inject qilinadi
- API xabar xatolari clientga uzatiladi (`api/claude.js:59`)
- `.bak` fayl manba daraxtida (`tandemService.ts.bak`)
- Suhbatda ulashilgan Supabase sbp_ token — rotate qilinishi shart

#### 15. Accessibility kamchiliklari

- 88+ ta aria-label bor, lekin 15+ joyda hardcoded o'zbekcha: `aria-label="Orqaga"`, `aria-label="Yuborish"`
- `<html lang>` atributi o'zgarmaydi
- Skip-to-content link yo'q
- `aria-current="page"` navigatsiyada ishlatilmayapti

#### 16. Store hajmi

- `progressSlice.ts` — 567 qator (achievements, streaks, hearts, XP, game feel — hammasi birga)
- `vocabularyStore.ts` va `phrasesStore.ts` deyarli bir xil — DRY buzilgan
- Dynamic imports store action'larida — circular dependency concern

#### 17. Dark mode CSS

342 qator qo'lda yozilgan dark-mode override. CSS custom properties ishlatilsa 70% ga qisqartirish mumkin.

#### 18. App.tsx — god component

396 qator — routing, auth, hydration, sync, SEO, mobile UI, layout, notification, offline banner hammasi bitta faylda. 28 ta route flat tartibda — nested routes ishlatilmagan.

#### 19. Developer docs yo'q

- Architecture overview
- Data schema
- Sync flow
- How to add lesson
- How to add speaking day
- How to run validations

Barchasi hujjatlashtirilmagan.

---

## Xavfsizlik tahlili

| Soha | Holat | Tavsif |
|------|-------|--------|
| API keylar | ✅ To'g'ri | `.env` faylda, `.gitignore` da |
| Supabase token | ⚠️ Xavfli | Suhbatda ulashilgan — rotate kerak |
| npm audit | ✅ 0 zaiflik | To'liq tuzatilgan |
| XSS | ⚠️ O'rtacha | 6 ta `dangerouslySetInnerHTML` |
| Error message leak | ⚠️ O'rtacha | API xatolari clientga uzatiladi |
| Cross-user leakage | ✅ Yaxshi | Partialize + user-switch cleanup |
| RLS | ✅ Bor | Lekin audit qilinmagan |
| Branch hygiene | ⚠️ Ifloslangan | 14 o'zgargan + 1 kuzatilmagan fayl |

---

## Bu sessiyada nima yaxshilandi

### Speaking Path content alignment (A0→B2)

| Daraja | Kunlar | Tuzatilgan |
|--------|--------|------------|
| A0 | 3 | Vocab A0 darajaga moslashtirildi |
| A1 | 26 | 23 kun content daily lesson bilan moslashtirildi |
| A2 | 28 | 12 kun content tuzatildi |
| B1 | 41 | 16 kun grammarPoint + linkedLesson tuzatildi |
| B2 | 27 | 13 kun vocab daily lesson bilan moslashtirildi |

### Strukturaviy tuzatishlar

- B1+ yo'q qilindi — B1 ga birlashtirildi
- CEFR order to'g'rilandi: A0→A1→A2→B1→B2
- `getCefrForDay()` helper yaratildi — takroriy kod yo'q qilindi
- B2 ikonkasi tuzatildi 📙 (A1 bilan bir xil emas)

### RecycledChunkIds tuzatish

136 ta muammo tuzatildi:
- 27 ta duplicate recycledChunkIds
- ~90 ta self-referencing recycledChunkIds
- ~30 ta empty recycledChunkIds

### Content sifati

- 5,595 mashq auditi qilindi → 0 muammo
- 45 ta haqiqiy mashq bug'i topildi va tuzatildi
- `audit:exercises` gate qurildi

### Testlar

- TypeScript: 0 xato ✅
- Testlar: 1,112/1,112 o'tdi ✅
- Speaking days test: 23/23 o'tdi ✅
- SpeakingLadder test: 16/16 o'tdi ✅

---

## Umumiy baho

| Yo'nalish | Baho | Asosiy muammo |
|-----------|------|---------------|
| **Arxitektura** | B+ | Modulli, lekin katta fayllar (80KB+) |
| **Type Safety** | A- | 0 as any, lekin 96 ta type assertion bypass |
| **Xatolik boshqaruvi** | C | ErrorBoundary bor, lekin 136+ catch yutilgan |
| **Test qamrovi** | B- | Servislar yaxshi (90%), sahifalar juda kam (29%) |
| **Ma'lumotlar sifati** | B | Content xatoliklari tuzatildi, lekin katta fayllar qoldi |
| **Xavfsizlik** | B+ | API key to'g'ri, lekin npm audit zaifliklar bor |
| **Performance** | A- | Code splitting yaxshi, lekin og'ir sahifalar |
| **Offline/PWA** | A | 3 qatlamli offline, Dexie + Supabase |
| **i18n** | B+ | 3 til, 1,230+ kalit, lekin pluralization yo'q |
| **Accessibility** | B- | Aria bor, lekin hardcoded til, skip-link yo'q |
| **Schema governance** | C | SQL migratsiyalar tarqalgan, RLS audit yo'q |
| **Monitoring** | B+ | Sentry bor, lekin dashboard yo'q |
| **Hujjatlar** | D | Architecture docs, sync flow docs yo'q |
| **Audit madaniyati** | A- | 8 ta validate/audit scripti |

**Umumiy baho: B+** — Yaxshi asos, ammo muammolar to'planib ketgan.

---

## Ustuvor yo'l xaritasi

### ✅ Bajarildi

1. ✅ `LessonView.tsx` → 10 komponent + 1 hook ga bo'lingan
2. ✅ `days.ts` → `a0Days`-`b2Days` ga bo'lingan
3. ✅ `Profile.tsx` → 4 widgetga bo'lingan (460 qator)
4. ✅ `npm audit` — 0 zaiflik
5. ✅ `.bak` fayllar tozalangan
8. ✅ `useLessonState` hook ekstraksiyasi
9. ✅ DRY prinsipi (ConfusableBanner, ExerciseResultsView)

### Keyingi qadam

1. `ListeningSection.tsx` (52KB+) — monolitdan ajratish
2. `Phrases.tsx` (40KB+) — monolitdan ajratish
3. `App.tsx` (396 qator) — routing/state yuklama
4. `lib/ai/` — 6 ta Claude integration moduliga test yozish
5. Test qamrovini oshirish (maqsad: 40%+)

### 3-hafta — Type safety

11. Supabase generated types to'liq ishlatish
12. `as never` / `as unknown as` larni yo'q qilish
13. Supabase query uchun umumiy typed helper yaratish

### 1-oy — Test qamrovi

14. Sahifalar test qamrovini 50%+ ga oshirish
15. `lib/ai/` — 6 ta Claude integration modulini test qilish
16. Sync conflict testlar yozish
17. E2E testlarni kengaytirish (speaking, vocabulary, grammar)

### 2-oy — Kontent arxitekturasi

18. Data fayllarni `.ts` dan JSON/generatorga ko'chirish
19. Content validation pipeline qo'shish (build paytida zod check)
20. Monitoring dashboard qurish (chunk load, Supabase errors, AI costs)

### 3-oy — Sifat

21. Developer docs yozish (architecture, sync flow, how-to)
22. Feature flags qo'shish (gradual rollout)
23. Performance budget belgilash (har sahifa uchun)
24. Accessibility to'g'rilash (aria-label i18n, skip-link, lang attr)

### Doimiy

25. Test qamrovini oshirish (maqsad: 60%+)
26. Content semantik sifat tekshiruvi
27. RLS audit
28. i18n to'liq qamrov (pluralization qo'shish)

---

## Yakuniy fikr

EnglishPath — offline-first, adaptive, CEFR-asosli, kontentga boy platforma arxitekturasi. Mahsulot sifatida katta potensialga ega.

**Eng katta kuch:** Offline-first, data-driven, adaptive learning platform arxitekturasi + namunali tip-xavfsizligi.

**Eng katta zaiflik:** Ulkan fayllar + 42% qattiq-kodlangan mo'rt kontent + parallel jarayon barqarorsizligi.

Loyiha production-grade EdTech platformaga aylanish uchun yaxshi poydevorga ega. Lekin keyingi bosqich **yangi feature emas** — **refactor, kontent-validatsiya, test va jarayon intizomi** bo'lishi shart.

> "Feature qo'shish tezligi muhandislik intizomidan o'zib ketgan. Hozir refactor vaqti."
