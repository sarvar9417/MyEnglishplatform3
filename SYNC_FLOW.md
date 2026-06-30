# EnglishPath — Synx Flow Arxitekturasi

## 1. Umumiy Ko'rinish

EnglishPath **offline-first** arxitektura asosida qurilgan. Ma'lumotlar avval localda (Zustand localStorage + Dexie IndexedDB) saqlanadi, keyin internet mavjud bo'lganda Supabase cloud'ga sinxronlanadi.

```
┌─────────────────────────────────────────────────────────┐
│                   FOYDALANUVCHI                         │
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
│  - syncQueue         │    │                               │
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
│  - lesson_progress (dars progresslari)                  │
└─────────────────────────────────────────────────────────┘
```

## 2. Ma'lumotlar Qatlamlari

### Qatlam 1: Zustand (localStorage)
- **Maqsad**: Tez-tez o'zgaradigan UI holati (auth, progress, settings)
- **Texnologiya**: Zustand `persist` middleware
- **Saqlanadi**: Auth ma'lumotlari, XP, streak, achievements, settings
- **Saqlanmaydi**: Darslar, lesson progress, personal vocabulary (user-scoped)
- **Partialize**: `partialize` orqali user-specific ma'lumotlar localStorage'dan chiqarilgan
- **Merging**: `merge` callback'ida lokal va remote ma'lumotlar birlashtiriladi

```typescript
// useStore.ts da partialize
partialize: (s) => {
  const { 
    lessons: _l, 
    lessonsLoading: _ll, 
    lessonsFetched: _lf, 
    _hydrated: _h,
    lessonProgress: _lp,
    lessonSessions: _ls,
    personalWords: _pw,
    ...rest 
  } = s
  return rest as AppState
}
```

### Qatlam 2: Dexie (IndexedDB)
- **Maqsad**: Katta hajmdagi offline ma'lumotlar (darslar, progress, vocabulary)
- **Texnologiya**: Dexie.js (IndexedDB wrapper)
- **Jadvallar**: 10 ta table (sessions, vocabulary, dailyProgress, writings, mockTests, stats, catalog, lessonProgress, cachedLessons, pronunciationErrors, syncQueue)
- **Migratsiya**: Version'lar orqali (hozir v7)

```typescript
// database.ts da versiya boshqaruvi
this.version(1).stores({ ... })
this.version(2).stores({ ... })
// ...
this.version(7).stores({ ... })
```

### Qatlam 3: Supabase (Cloud)
- **Maqsad**: Cross-device sync, ma'lumotlarni saqlash
- **Auth**: Supabase Auth (email/password)
- **RLS**: Row Level Security (28 jadvalda)
- **Real-time**: Supabase Realtime (istiqbolli)

## 3. Synx Jarayoni

### 3.1 Online yozish (Standard Flow)

1. Foydalanuvchi amal bajaradi (masalan: dars tugatadi)
2. `lessonService.pushLessonProgress()` chaqiriladi
3. **Smart Merge**: Avval Supabase'dan mavjud yozuvni o'qiydi
4. `conflictResolution.mergeLessonProgress()` orqali birlashtiradi
5. Supabase'ga upsert qiladi
6. Dexie'ga local backup yozadi

```typescript
// lessonService.ts — pushLessonProgress
async function pushLessonProgress(lessonId, correctCount, totalExercises) {
  // 1. Smart merge: fetch existing row
  const existing = await supabase.from('lesson_progress')
    .select('score, correct_count')
    .eq('user_id', session.user.id)
    .eq('lesson_id', lessonId)
    .eq('date', date)
    .maybeSingle()
  
  // 2. Merge local + remote
  let merged = mergeLessonProgress({ localScore, remoteScore, ... })
  
  // 3. Upsert to Supabase
  await supabase.from('lesson_progress').upsert({ ...merged })
  
  // 4. Local backup
  await dbUpsert({ ... })
}
```

### 3.2 Offline yozish (Queue-based)

1. Tarmoq xatoligi aniqlanganda (`isNetworkError()`)
2. Ma'lumot `syncQueue` jadvaliga saqlanadi
3. `initSyncQueueListener()` tarmoq qaytganini kuzatadi
4. Tarmoq qaytgach, navbatdagi elementlar priority bo'yicha yuboriladi

```typescript
// supabase.ts — isNetworkError helper
function isNetworkError(error) {
  if (!error?.message) return false
  return msg.includes('fetch') || msg.includes('Failed to fetch') || msg.includes('NetworkError')
}

// supabase.ts — addToSyncQueue
if (isNetworkError(error)) {
  await addToSyncQueue({
    table: 'users',
    operation: 'upsert',
    data: profile,
    conflictField: 'id',
    priority: 5,
  })
}
```

### 3.3 Sync Queue (src/lib/syncQueue.ts)

```typescript
interface SyncQueueItem {
  table: string          // Supabase table nomi
  operation: 'upsert' | 'insert' | 'update' | 'delete'
  data: Record<string, unknown>
  conflictField?: string // upsert uchun
  priority: number       // 1 (past) — 5 (yuqori)
  retries: number
  maxRetries: number     // 5 tagacha urinish
  lastError: string | null
  nextRetryAt: number    // exponential backoff
}
```

**Priority tizimi:**
| Priority | Ma'lumot turi |
|----------|--------------|
| 5 | Foydalanuvchi profili |
| 4 | Lug'at so'zlari |
| 3 | Sessiyalar, yozma ishlar, testlar |
| 2 | Kunlik progress |
| 1 | Boshqa ma'lumotlar |

### 3.4 Conflict Resolution (src/services/conflictResolution.ts)

**mergeLessonProgress:**
- **Score**: O'rtacha qiymat (avg)
- **Correct count**: Ikkala qiymat yig'indisi
- **Total exercises**: Ikkala qiymat yig'indisi
- **XP**: Ikkala qiymat yig'indisi
- **Completed at**: Eng so'nggi vaqt

```typescript
export function mergeLessonProgress(params: {
  localScore: number
  remoteScore: number
  localCorrectCount: number
  remoteCorrectCount: number
  localTotalExercises: number
  remoteTotalExercises: number
  localXpEarned: number
  remoteXpEarned: number
  localCompletedAt: number
  remoteCompletedAt: number
}): {
  score: number
  correctCount: number
  totalExercises: number
  xpEarned: number
  completedAt: number
}
```

**mergeLessonSession:**
- **Tab**: Eng so'nggi tab
- **Section**: Eng katta qiymat
- **Progress**: Union (ikkala qurilmadagi progress birlashtiriladi)
- **Updated at**: Eng so'nggi vaqt

## 4. Foydalanuvchi Almashganda

Foydalanuvchi chiqsa yoki almashsa, cross-user data leakage oldini olish uchun:

```typescript
// App.tsx da (useEffect ichida)
export function clearLocalUserData() {
  localStorage.clear()     // Zustand + barcha kalitlar
  db.clearLocalUserData()  // IndexedDB'dan user ma'lumotlari
  window.location.reload() // Hard redirect
}
```

Dexie'dan tozalanadigan jadvallar:
- `lessonProgress`
- `vocabulary`
- `sessions`
- `dailyProgress`
- `writings`
- `mockTests`
- `catalog`
- `stats`

**Saqlanadigan ma'lumotlar:**
- `cachedLessons` — dars kontenti (user-scoped emas)
- `syncQueue` — offline navbat

## 5. Service Worker Strategiyalari

| Strategiya | Route | Cache nomi | 
|-----------|-------|------------|
| **NetworkFirst** | Navigatsiya (HTML) | `pages` |
| **NetworkFirst** (5s timeout) | API `/api/*` | `api` |
| **CacheFirst** (30 kun) | Static assets (rasm, shrift) | `static-assets` |
| **StaleWhileRevalidate** (7 kun) | JS/CSS chunk'lar | `scripts-styles` |
| **StaleWhileRevalidate** (7 kun) | Supabase data | `supabase-data` |
| **Offline Fallback** | Barcha failed navigations | `offline-fallback` |

## 6. AI So'rovlari Proxy

Barcha AI so'rovlari **server-side proxy** orqali o'tadi:

```typescript
// claudeClient.ts
export async function proxyFetch(body) {
  return fetch('/api/claude', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

// vite.config.ts — anthropicProxyPlugin
server.middlewares.use('/api/claude', async (req, res) => {
  // API key serverda qoladi — clientga chiqmaydi
  const anthropicRes = await fetch('https://api.anthropic.com/v1/messages', {
    headers: { 'x-api-key': ANTHROPIC_API_KEY },
    body: JSON.stringify({ model, ...parsed }),
  })
  // Streaming va non-streaming
})
```

## 7. Xatoliklarga Ishlov Berish

### 7.1 Silent Catch Monitoring
Barcha `catch {}` bloklarida monitoring bo'lishi kerak:

```typescript
try { 
  // risky operation 
} catch { 
  monitoring.captureMessage('context: description', 'warn')
}
```

### 7.2 Network Error Detection
```typescript
function isNetworkError(error: { message?: string } | null): boolean {
  if (!error?.message) return false
  const msg = error.message
  return msg.includes('fetch') || 
         msg.includes('Failed to fetch') || 
         msg.includes('NetworkError')
}
```

### 7.3 Sentry Monitoring
```typescript
// Lazy initialization
const dsn = import.meta.env.VITE_SENTRY_DSN
if (dsn && typeof dsn === 'string') {
  initSentry(dsn)
  setMonitoringProvider(createSentryProvider())
}

// Monitoring API
monitoring.captureException(error, { type: 'chunk-load-failure' })
monitoring.captureMessage('description', 'warn')
monitoring.trackEvent('page.view', { path: '/dashboard' })
```

## 8. Test Strategiyasi

### 8.1 Service Testlari
- `src/services/__tests__/stateSync.test.ts` — sync flow testlari
- `src/services/__tests__/conflictResolution.test.ts` — merge strategiyalari
- `src/services/__tests__/lessonService.test.ts` — dars servisi

### 8.2 Store Testlari
- `src/store/__tests__/authSlice.test.ts`
- `src/store/__tests__/progressSlice.test.ts`
- `src/store/__tests__/lessonSlice.test.ts`

### 8.3 Validatsiya Skriptlari
```bash
npm run validate:ids          # ID unikalligini tekshirish
npm run audit:exercises       # Mashq sifatini tekshirish
npm run check:i18n            # i18n kalitlar paritysini tekshirish
npm run audit:cefr            # CEFR level mosligini tekshirish
```

## 9. Xulosa

EnglishPath sync arxitekturasi **offline-first** tamoyiliga asoslangan:

1. **Local-first**: Barcha ma'lumotlar avval localda saqlanadi
2. **Smart merge**: Conflict'lar timestamp + version asosida hal qilinadi
3. **Queue-based sync**: Offline vaqtida navbatga qo'yiladi, online'da yuboriladi
4. **Cross-device**: Supabase orqali barcha qurilmalar sinxronlanadi
5. **Cross-user safety**: User almashganda tozalanadi
6. **AI proxy**: API key serverda qoladi
