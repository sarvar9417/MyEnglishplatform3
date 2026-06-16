# EnglishPath — Developer Guide

## Arxitektura

```
src/
├── components/          # 155+ React komponentlari (20 papka)
│   ├── dailyLesson/     # 30+ fayl — dars ko'rish tizimi (Listening, Exercises, etc.)
│   ├── speakingPath/    # 19 fayl — speaking kunlari
│   ├── vocabulary/      # 17 fayl — flashcard, games, analytics
│   ├── ui/              # 17 fayl — qayta ishlatiladigan primitive'lar
│   ├── phrases/         # 11 fayl — phrase flashcards, games
│   └── tandem/          # 9 fayl — social features
├── data/                # 74 fayl — statik kontent (speaking days, daily lessons, vocab)
├── services/            # 57 fayl — Supabase CRUD, sync, conflict resolution
├── pages/               # 47 fayl — sahifa komponentlari (lazy-loaded)
├── lib/                 # 34 fayl — Supabase client, AI (Claude), monitoring, SEO
│   └── ai/              # 6 Claude moduli: vocab, exercises, grammar, speaking, writing, duel
├── store/               # 16 fayl — Zustand state management
├── hooks/               # 18 fayl — custom React hook'lar
├── utils/               # 10 fayl — sof utilitar funksiyalar
├── i18n/                # 6 fayl — xalqaro lashtirish (uz/en/ru)
├── routes/              # AppRoutes.tsx — route config
└── types/               # 5 fayl — TypeScript turli aniqlashlar
```

## Tech Stack

- **Framework:** React 18 + TypeScript (strict mode)
- **Build:** Vite
- **State:** Zustand (persist with localStorage)
- **Styling:** Tailwind CSS
- **Backend:** Supabase (PostgreSQL + Auth + RLS)
- **AI:** Anthropic Claude API (proxy via `/api/claude`)
- **Offline:** Dexie (IndexedDB) + Service Worker (Workbox)
- **PWA:** VitePWA
- **Testing:** Vitest + React Testing Library
- **Monitoring:** Sentry (lazy init)

## Data Flow

```
User Action → Zustand Store → Service Layer → Supabase/IndexedDB
                ↓
        React Re-render
```

1. **Local-first:** Barcha ma'lumotlar avval IndexedDB/localStorage'da saqlanadi
2. **Sync:** Har 3 soniyada Zustand store o'zgarsa Supabase'ga sync qilinadi
3. **Conflict:** `src/services/conflictResolution.ts` — smart merge (timestamp + version)
4. **Auth:** Supabase Auth + `onAuthStateChange` listener

## Routing

`src/routes/AppRoutes.tsx` — barcha route'lar lazy-loaded:

```tsx
const Dashboard = lazyWithReload(() => import('./pages/Dashboard'))
// ... 29 ta sahifa
```

Har bir sahifa `<SafePage>` (ErrorBoundary) bilan o'ralgan — bitta sahifa crash bo'lsa, qolganlari ishlaydi.

## Offline Architecture

| Qatlam | Texnologiya | Vazifa |
|--------|-------------|--------|
| 1-qatlam | localStorage | Theme, auth, SRS state |
| 2-qatlam | IndexedDB (Dexie) | Darslar, progress, vocabulary |
| 3-qatlam | Supabase | Cloud sync, real-time |

## AI Integration

6 ta Claude moduli `src/lib/ai/` da:

| Modul | Vazifa |
|-------|--------|
| `claude-vocab` | So'z tushuntirish, word card, vocab check |
| `claude-exercises` | Mashq generatsiya, javob tekshirish, insights |
| `claude-grammar` | Grammatika tekshirish, xato tahlili |
| `claude-speaking` | Speaking feedback, roleplay |
| `claude-writing` | Writing task, feedback |
| `claude-duel` | Vocab battle, duo roleplay |

Barcha AI chaqiruvlari `/api/claude` proxy orqali — API key server-side qoladi.

## Validation Scripts

```bash
npm run validate:ids        # ID unikalligini tekshirish
npm run validate:speaking   # Speaking path strukturasini tekshirish
npm run audit:ambiguous     # Noto'g'ri javoblarni aniqlash
npm run check:i18n          # i18n kalitlar paritysini tekshirish
npm run audit:cefr          # CEFR level mosligini tekshirish
npm run check:youtube       # YouTube havolalarini tekshirish
npm run audit:exercises     # Mashq sifatini tekshirish (5,595+ mashq)
```

## Yangi Dars Qo'shish

1. `src/data/daily/` ga yangi `.ts` fayl yarating
2. `LessonsDataSource` interfeysiga mos formatda yozing
3. `src/data/lessonIndex.ts` ga qo'shing
4. `npm run validate:ids` ishga tushing — ID takrorlanmasligini tekshiradi

## Yangi Speaking Kun Qo'shish

1. `src/data/speakingPath/` dagi mos level faylini tahrirlang (masalan `a1Days.ts`)
2. `SpeakingDay` interfeysiga mos formatda yozing
3. `recycledChunkIds` — oldingi kunlardan takroriy vocabulary qo'shing
4. `npm run validate:speaking` ishga tushing

## Testing

```bash
npm test                    # Barcha testlar
npm test -- --run src/lib/ai/   # Faqat AI testlari
```

- **Test fayllari:** 110 ta test fayl, 1310+ test
- **Qamrov:** ~56% (statements), ~42% (branches)
- **Mock:** `vi.mock()` orqali Supabase, Claude API, monitoring

## Environment Variables

`.env` faylda (`.gitignore` da):

```
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

API keylar kodda EMAS — faqat `.env` da.

## Common Patterns

### Lazy Import with Chunk Recovery
```tsx
const Page = lazyWithReload(() => import('./pages/Page'))
```
Yangi deploy'dan keyin eski chunk fayllari yo'qolsa, avtomatik qayta yuklaydi.

### Zustand Store
```tsx
const { data, setData } = useStore()
```
`partialize` orqali faqat kerakli maydonlar localStorage'da saqlanadi.

### i18n
```tsx
const { t } = useI18n()
t('phrases.emptyTitleToday')  // Uzbek
```
3 til: uz (default), en, ru. Kalitlar `src/i18n/*.json` da.
