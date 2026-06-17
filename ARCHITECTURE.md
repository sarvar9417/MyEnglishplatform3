# EnglishPath Arxitektura Hujjati

## 1. Texnologiya Stacki

| Qatlam | Texnologiya | Versiya | Maqsad |
|--------|------------|--------|--------|
| UI Framework | React | 18.3.1 | Komponentlar arxitekturasi |
| Til | TypeScript | — | Typing xavfsizligi |
| Bundler | Vite | — | Tez dev server, tree-shaking |
| Styling | Tailwind CSS | — | Utility-first CSS |
| Backend | Supabase | 2.105.4 | Auth, ma'lumotlar bazasi, Realtime |
| Offline DB | Dexie (IndexedDB) | 3.2.7 | Offline ma'lumotlar saqlash |
| State | Zustand | 5.0.0 | Global holat boshqaruvchi |
| SRS | FSRS-5 | — | Spaced Repetition algoritmi |
| AI | Claude API (via proxy) | — | 6 ta AI moduli |
| Monitoring | Sentry | 10.53.1 | Xatoliklarni kuzatish |
| PWA | vite-plugin-pwa | 1.3.0 | Offline qo'llab-quvvatlash |
| Test | Vitest | — | Unit va integration testlar |
| E2E | Playwright | — | Brauzer testlari |

## 2. Loyiha Tuzilishi

```
src/
├── App.tsx                    # Asosiy komponent: routing, providers, lazy loading
├── main.tsx                   # Entry point
├── sw.ts                      # Service Worker (Workbox)
├── index.css                  # Global uslublar
│
├── components/                # UI komponentlari
│   ├── layout/                # Sidebar, MobileBottomNav, OfflineBanner
│   ├── ui/                    # Reusable UI: LevelUpCelebration, XpBurst
│   ├── onboarding/            # OnboardingFlow
│   ├── notifications/         # NotificationInitializer
│   ├── vocabulary/            # VocabBattle
│   ├── ErrorBoundary.tsx
│   ├── Toast.tsx
│   └── PwaInstallPrompt.tsx
│
├── pages/                     # Sahifa komponentlari (lazy loaded)
│   ├── Auth.tsx               # Kirish/ro'yxatdan o'tish
│   ├── Dashboard.tsx          # Bosh sahifa
│   ├── LearnHub.tsx           # Darslar markazi
│   ├── Grammar.tsx            # Grammatika
│   ├── VocabHub.tsx           # Lug'at markazi
│   ├── Chat.tsx               # AI bilan suhbat
│   ├── Listening.tsx          # Tinglash
│   ├── Reading.tsx            # O'qish
│   ├── Writing.tsx            # Yozish
│   ├── Pronunciation.tsx      # Talaffuz
│   ├── SpeakingPath.tsx       # Gapirish yo'li
│   ├── MockTest.tsx           # Sinov testlari
│   ├── Profile.tsx            # Profil
│   └── ...                    # Boshqa sahifalar
│
├── routes/
│   └── AppRoutes.tsx          # React Router marshrutlari
│
├── store/                     # Zustand state management
│   ├── useStore.ts            # Asosiy store (4 slice birlashtirilgan)
│   ├── authSlice.ts           # Autentifikatsiya holati
│   ├── progressSlice.ts       # Progress, XP, streak, hearts
│   ├── lessonSlice.ts         # Darslar va session holati
│   ├── personalVocabularySlice.ts # Shaxsiy lug'at
│   ├── types.ts               # Store turlari
│   └── appState.ts            # AppState tipi
│
├── lib/                       # Asosiy kutubxonalar
│   ├── supabase.ts            # Supabase client va auth helpers
│   ├── db.ts                  # Typed Supabase helper (NullToUndef casting)
│   ├── srs.ts                 # FSRS-5 algorithm
│   ├── claudeClient.ts        # Claude API proxy client
│   ├── prompts.ts             # AI system promptlari
│   ├── monitoring.ts          # Sentry monitoring
│   ├── errors.ts              # Xatolik kodlari va xabarlar
│   ├── gameFeel.ts            # O'yin effektlari (sound, vibration)
│   ├── performance.ts         # Web Vitals
│   └── seo.ts                 # SEO meta taglar
│
├── lib/ai/                    # AI modullari (6 ta)
│   ├── claude-exercises.ts    # Mashqlar tekshirish, exercise generatsiya
│   ├── claude-vocab.ts        # Lug'at kartochkalarini generatsiya, tarjimani tekshirish
│   ├── claude-grammar.ts      # Grammatika tekshirish, yozuv tahlili
│   ├── claude-speaking.ts     # Gapirish feedback, scenario report, talaffuz tahlili
│   ├── claude-writing.ts      # Yozuv topshiriqlari generatsiya
│   └── claude-duel.ts         # Duel natijalari, duo roleplay report
│
├── data/                      # Statik ma'lumotlar
│   ├── daily/                 # Kunlik darslar (A1→B2)
│   │   ├── a1Part1.ts         # A1 kun 1-10
│   │   ├── a1Part2.ts         # A1 kun 11-27
│   │   ├── a2Part1.ts         # A2 kun 28-32
│   │   ├── a2Part2.ts         # A2 kun 33-40
│   │   ├── a2Part3.ts         # A2 kun 41-45
│   │   ├── a2Part4.ts         # A2 kun 46-53
│   │   ├── b1Part1.ts         # B1 kun 54-75
│   │   ├── b1plusPart1.ts     # B1+ kun 76-81
│   │   ├── b1plusPart2.ts     # B1+ kun 82-96
│   │   ├── b2Part1.ts         # B2 kun 97-108
│   │   ├── b2Part2.ts         # B2 kun 109-119
│   │   ├── b2Part3.ts         # B2 kun 120-126
│   │   ├── index.ts           # Barcha darslarni birlashtirish
│   │   └── lessonsIndex.ts    # Avto-generatsiya qilingan dars indeksi
│   ├── dailyLessons.ts        # DailyLesson turlari va interfeyslar
│   ├── grammar/               # Grammatika ma'lumotlari
│   ├── tenses/                # Zamon ma'lumotlari
│   ├── reading/               # O'qish materiallari
│   └── ...                    # Boshqa statik ma'lumotlar
│
├── db/
│   └── database.ts            # Dexie IndexedDB konfiguratsiya va helperlar
│
├── hooks/                     # Custom React hooks
│   ├── useAuth.ts             # Autentifikatsiya hooki
│   ├── useOnlineStatus.ts     # Internet holati
│   └── useAppHydration.ts     # Dastur yuklash
│
├── services/                  # Biznes logika xizmatlari (31 ta)
│   ├── lessonService.ts       # Darslarni yuklash/saqlash
│   ├── vocabularyService.ts   # Lug'at operatsiyalari
│   ├── personalVocabularyService.ts # Shaxsiy lug'at
│   ├── achievementChecker.ts  # Yutuqlarni tekshirish
│   ├── tandemService.ts       # Tandem juftlik
│   ├── speakingService.ts     # Gapirish xizmati
│   ├── writingService.ts      # Yozuv xizmati
│   ├── mockTestService.ts     # Sinov testlari
│   ├── placementService.ts    # Daraja aniqlash
│   └── ...                    # Boshqa xizmatlar
│
├── i18n/                      # Xalqaroallashtirish
│   ├── index.tsx              # I18nProvider va hook
│   ├── types.ts               # Tarjima turlari
│   ├── uz.json                # O'zbek tili
│   ├── en.json                # Ingliz tili
│   └── ru.json                # Rus tili
│
├── types/                     # TypeScript turlari
│   ├── supabase.ts            # Supabase generated types
│   ├── database.ts            # DB turlari
│   ├── personalVocabulary.ts  # Shaxsiy lug'at turlari
│   └── tandem.ts              # Tandem turlari
│
├── utils/                     # Yordamchi funksiyalar
│   ├── tashkentDate.ts        # Toshkent vaqti
│   └── toastStore.ts          # Toast holati
│
├── __tests__/                 # Testlar (128 ta test fayli)
│   └── performance.test.ts
│
└── test/                      # Test konfiguratsiyalari
```

## 3. Ma'lumotlar Oqimi

### 3.1 Offline-First Arxitektura (IndeksDB → Zustand → Supabase)

```
┌─────────────────────────────────────────────────────────┐
│                    FOYDALANUVCHI                         │
│                      (Browser)                          │
└─────────────────────┬───────────────────────────────────┘
                      │
                      ▼
┌─────────────────────────────────────────────────────────┐
│              SERVICE WORKER (sw.ts)                      │
│  Workbox: precache, NetworkFirst, CacheFirst,            │
│  StaleWhileRevalidate                                    │
└──────────┬──────────────────────────────┬───────────────┘
           │                              │
           ▼                              ▼
┌─────────────────────┐    ┌──────────────────────────────┐
│   DEXIE (IndexedDB)  │    │     ZUSTAND (localStorage)    │
│  - sessions          │    │  - authSlice                  │
│  - vocabulary        │    │  - progressSlice              │
│  - dailyProgress     │    │  - lessonSlice                │
│  - writings          │    │  - personalVocabularySlice    │
│  - mockTests         │    │  (persist middleware)         │
│  - catalog           │    │                               │
│  - lessonProgress    │    │  partialize: lessons,         │
│  - cachedLessons     │    │  lessonProgress, sessions     │
│  - pronunciationErrors│   │  SAQLANMAYDI (user-scoped)   │
└──────────┬───────────┘    └──────────────┬──────────────┘
           │                               │
           └───────────┬───────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                    SUPABASE                              │
│  - users          (auth + profil)                        │
│  - sessions       (o'quv sessiyalari)                    │
│  - vocabulary     (lug'at so'zlari)                      │
│  - daily_progress (kunlik progress)                      │
│  - writings       (yozuv topshiriqlari)                  │
│  - mock_tests     (sinov testlari)                      │
│  - lesson_sessions (dars sessiyalari — cross-device)     │
│  - personal_words (shaxsiy lug'at)                      │
└─────────────────────────────────────────────────────────┘
```

### 3.2 Ma'lumotlar Oqimi Tushuntirishi

1. **Foydalanuvchi amal bajaradi** → Zustand store yangilanadi
2. **Zustand** → `persist` middleware orqali localStorage'ga yoziladi
3. **Dexie** → Offline ma'lumotlar IndexedDB'ga saqlanadi (user-scoped emas)
4. **Supabase** → Internet bo'lganda sinxronlashtiriladi (cross-device sync)
5. **Service Worker** → Build assetlari precache qilinadi, API calls NetworkFirst

### 3.3 Foydalanuvchi Almashganda

- `clearLocalUserData()` — Dexie'dagi barcha user ma'lumotlarini tozalaydi
- `clearAllLessonProgress()` — Dars progresslarini tozalaydi
- Zustand store — `partialize` orqali lessons va progress saqlanmaydi

## 4. State Management (Zustand Slices)

### 4.1 AuthSlice (`authSlice.ts`)

```typescript
interface AuthSlice {
  userName: string
  userEmail: string
  onboardingComplete: boolean
  currentWeek: number
  currentDay: number
  currentLevel: Level        // 'A1' | 'A2' | 'A2+' | 'B1' | 'B1+' | 'B2'
  avatarId: string
  startDate: string
  targetDate: string

  // Actions
  setUserName(name: string): void
  completeOnboarding(name, level?, startDay?): void
  advanceDay(): void
  setLevel(level: Level): void
  setAvatarId(id: string): void
}
```

**Muhim xususiyatlar:**
- `completeOnboarding` → Supabase'ga upsert qiladi
- `advanceDay` → Kunni oldinga suradi, kunlik progressni reset qiladi
- `setLevel` → Level o'zgarganda `levelUpPending` holatini saqlaydi (celebration uchun)

### 4.2 ProgressSlice (`progressSlice.ts`)

```typescript
interface ProgressSlice {
  totalXP: number
  todayXP: number
  weeklyXP: number
  hearts: number              // O'yin rejimi (max 5)
  streak: number              // Ketma-ketlik kunlari
  streakFreezes: number       // Streak himoyasi
  todayMinutes: number
  todayChecklist: DailyChecklist
  unlockedAchievements: string[]
  // ... boshqa progress ko'rsatkichlari

  // Actions
  addXP(amount: number): void
  incrementStreak(): void
  loseHeart(): number
  refillHearts(): void
  checkAchievements(): void
  claimStreakBonuses(): number[]
}
```

**Streak Bonus Miliestones:**
- 3 kun → +10 XP
- 7 kun → +25 XP
- 14 kun → +50 XP
- 30 kun → +100 XP
- 90 kun → +500 XP (EnglishPath Graduate)

### 4.3 LessonSlice (`lessonSlice.ts`)

```typescript
interface LessonSlice {
  lessons: (DailyLesson | ReviewLesson)[]
  lessonProgress: Record<string, number>
  lessonSessions: Record<string, LessonSessionData>
  lessonsLoading: boolean
  lessonsFetched: boolean

  // Actions
  fetchAndSetLessons(): Promise<void>
  saveLessonSession(lessonId, data): void
  clearLessonSession(lessonId): void
}
```

**Xususiyatlar:**
- `fetchAndSetLessons` → Bir marta yuklaydi, keyin cache'dan oladi
- `saveLessonSession` → localStorage + Supabase'ga sinxronlaydi
- Lessons localStorage'da saqlanmaydi (user-scoped)

### 4.4 PersonalVocabularySlice (`personalVocabularySlice.ts`)

```typescript
interface PersonalVocabularySlice {
  personalWords: PersonalWord[]

  // Actions
  addPersonalWord(wordData, userId?): Promise<void>
  batchAddPersonalWords(words, userId?): Promise<void>
  updatePersonalWord(id, updates, userId?): Promise<void>
  deletePersonalWord(id, userId?): Promise<void>
  ratePersonalWord(id, rating, userId?): Promise<void>
  fetchPersonalWords(userId): Promise<void>
}
```

## 5. AI Inteqratsiyasi (6 Claude Moduli)

### 5.1 Arxitektura

```
┌──────────────┐     ┌──────────────┐     ┌──────────────────┐
│  AI Modullari │────▶│claudeClient.ts│────▶│  /api/claude      │
│  (6 ta)       │     │ proxyFetch()  │     │  (Serverless API) │
└──────────────┘     └──────────────┘     └────────┬─────────┘
                                                   │
                                                   ▼
                                          ┌──────────────────┐
                                          │  Claude API       │
                                          │  (claude-sonnet-4-5)│
                                          └──────────────────┘
```

### 5.2 AI Modullari

| Modul | Fayl | Vazifalar |
|-------|------|-----------|
| **Exercises** | `claude-exercises.ts` | Mashqlar tekshirish, exercise generatsiya, learning insights |
| **Vocab** | `claude-vocab.ts` | Lug'at kartochkasi generatsiya, tarjima tekshirish, gap generatsiya |
| **Grammar** | `claude-grammar.ts` | Grammatika tekshirish, yozuv tahlili, xato tahlili |
| **Speaking** | `claude-speaking.ts` | Gapirish feedback, scenario report, talaffuz tahlili, speaking task |
| **Writing** | `claude-writing.ts` | Yozuv topshiriqlari generatsiya |
| **Duel** | `claude-duel.ts` | Duel natijalari, duo roleplay report |

### 5.3 Proxy Arxitekturasi

Barcha AI so'rovlari `/api/claude` endpointi orqali o'tadi:

```typescript
// claudeClient.ts
export const MODEL = 'claude-sonnet-4-5'
const PROXY_URL = '/api/claude'

export async function proxyFetch(body: Record<string, unknown>): Promise<Response> {
  const res = await fetch(PROXY_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  return res
}
```

**Savol formati (JSON parsing):**
```typescript
// Har bir AI moduli JSON javob kutadi:
const jsonMatch = text.match(/\{[\s\S]*\}/)
const parsed = JSON.parse(jsonMatch[0])
```

## 6. Offline-First Arxitektura

### 6.1 Service Worker (sw.ts)

```typescript
// Precache — barcha build assetlari
precacheAndRoute(self.__WB_MANIFEST)

// Navigation — NetworkFirst (offline'da cache'dan)
new NetworkFirst({ cacheName: 'pages' })

// API calls — NetworkFirst (5s timeout)
new NetworkFirst({ cacheName: 'api', networkTimeoutSeconds: 5 })

// Static assets — CacheFirst (rasmlar, shriftlar)
new CacheFirst({ cacheName: 'static-assets' })

// JS/CSS — StaleWhileRevalidate
new StaleWhileRevalidate({ cacheName: 'scripts-styles' })

// Supabase data — StaleWhileRevalidate
new StaleWhileRevalidate({ cacheName: 'supabase-data' })
```

### 6.2 Dexie IndexedDB

```typescript
class EnglishPathDB extends Dexie {
  sessions: Table<Session>
  vocabulary: Table<VocabularyWord>
  dailyProgress: Table<DailyProgress>
  writings: Table<Writing>
  mockTests: Table<MockTest>
  stats: Table<Stats>
  catalog: Table<CatalogEntry>
  lessonProgress: Table<LessonProgress>
  cachedLessons: Table<DailyLesson>
  pronunciationErrors: Table<PronunciationErrorRecord>
}
```

**Muhim funksiyalar:**
- `cacheLesson(lesson)` — Offline uchun darsni keshlaydi
- `getCachedLesson(id)` — Keshlangan darsni oladi
- `clearLocalUserData()` — Foydalanuvchi almashganda tozalaydi

### 6.3 FSRS-5 (Spaced Repetition)

`src/lib/srs.ts` — FSRS-5 algoritmi:

```typescript
interface FSRSState {
  stability: number    // S — xotira barqarorligi (kunlarda)
  difficulty: number   // D — element qiyinligi [1..10]
  due: string          // Keyingi takrorlash sanasi
  reps: number         // Takrorlash soni
  lapses: number       // Unutilgan soni
}

// Asosiy funksiyalar:
initStability(grade)     // Dastlabki barqarorlik
initDifficulty(grade)    // Dastlabki qiyinlik
retrievability(t, S)     # Unutish egri chizig'i
nextInterval(S, r)       // Keyingi interval
computeNextReviewFSRS(state, rating) // To'liq hisoblash
```

## 7. Testlash Strategiyasi

### 7.1 Test Tizimi

- **Framework:** Vitest
- **Test fayllari:** 128 ta (`*.test.ts`, `*.test.tsx`)
- **Coverage:** `vitest run --coverage`
- **E2E:** Playwright (`e2e/` papkasida)

### 7.2 Test Joylashuvi

```
src/
├── __tests__/                    # Umumiy testlar
├── data/__tests__/              # Darslar indeksi testlari
├── i18n/__tests__/              # Tarjima testlari
├── lib/ai/__tests__/            # AI modullari testlari
├── services/__tests__/          # Xizmatlar testlari
├── store/__tests__/             # Store testlari
└── test/                        # Test konfiguratsiyalari
```

### 7.3 Test Skriptlari

```bash
npm test                    # Barcha testlarni ishga tushirish
npm run test:watch          # Watch rejimida
npm run test:coverage       # Coverage bilan
npm run test:e2e            # Playwright E2E testlari
npm run validate:ids        # Dars IDlarini tekshirish
npm run audit:exercises     # Mashqlarni audit qilish
npm run check:i18n          # Tarjimalarni tekshirish
```

## 8. Routing

React Router v6 bilan lazy loading:

```typescript
// AppRoutes.tsx
const mainRoutes = [
  { path: '/', element: <Dashboard /> },
  { path: '/lesson', element: <LearnHub /> },
  { path: '/grammar', element: <Grammar /> },
  { path: '/vocabulary', element: <VocabHub /> },
  { path: '/mock-test', element: <MockTest /> },
  { path: '/chat', element: <Chat /> },
  { path: '/listening', element: <Listening /> },
  { path: '/reading', element: <Reading /> },
  { path: '/writing', element: <Writing /> },
  { path: '/pronunciation', element: <Pronunciation /> },
  { path: '/speaking-path', element: <SpeakingPath /> },
  { path: '/personal-vocabulary', element: <PersonalVocabulary /> },
  { path: '/profile', element: <Profile /> },
  // ... boshqa marshrutlar
]
```

## 9. Xalqaroallashtirish (i18n)

- **Tillar:** O'zbek (uz), Ingliz (en), Rus (ru)
- **Default:** O'zbek
- **Storage:** localStorage'da `locale` kaliti
- **Provider:** `<I18nProvider>` — butun ilovani o'raydi
- **Hook:** `useI18n()` — `t()` funksiyasi orqali tarjimalarni olish

## 10. Xulosa

EnglishPath — bu offline-first, AI-integretslangan ingliz tili o'quv platformasi. Asosiy xususiyatlari:

1. **Offline-first:** Service Worker + Dexie IndexedDB
2. **Cross-device sync:** Supabase + localStorage
3. **AI-powered:** 6 ta Claude moduli (exercises, vocab, grammar, speaking, writing, duel)
4. **Gamification:** XP, streak, hearts, achievements, leagues
5. **Spaced repetition:** FSRS-5 algoritmi
6. **PWA:** Offline qo'llab-quvvatlash, o'rnatish mumkin
