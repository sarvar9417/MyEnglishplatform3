# Shaxsiy Lug'at (Personal Vocabulary) Xususiyati — Loyiha Hisoboti

## 1. Foydalanuvchi Talabi (Qisqacha)

> "Lu'gat va iboralar qismida user yangi lu'gat qo'shish qismi bo'lsin. Har bir user o'zi uchun alohida lug'at qo'shish imkoni bo'lishi kerak. U lug'atlarni faqat har bir user o'ziga ko'rinadi. Lug'at tarjimasini AI yoki userning o'zi yozish imkoni bo'lishi kerak. User o'zi qo'shgan lug'atlardan ham flash card test ishlay olishi kerak."

**Talablar:**
1. Foydalanuvchi o'ziga xos shaxsiy lug'at yarata olishi
2. Lug'at so'zlari faqat shu foydalanuvchiga tegishli (boshqalarga ko'rinmas)
3. Tarjima AI yordamida yoki qo'lda kiritish imkoniyati
4. Qo'shilgan so'zlardan flash card testi o'tkazish imkoniyati
5. Mavjud lug'at/ibora tizimi bilan integratsiya

---

## 2. Joriy Tizim Tahlili

### 2.1 Mavjud Lug'at Tizimi (`vocabularyService.ts`)

| Jihat | Tafsilot |
|-------|----------|
| **Ma'lumotlar manbasi** | Supabase — `vocabulary_progress` jadvali |
| **FSRS algoritmi** | `computeNextReviewFSRS`, `createDefaultFSRSState` |
| **SRS intervallari** | 1, 3, 7, 14, 30, 90 kun (Box 1-6) |
| **Kurish rejimlari** | translation, fill-blank, type-answer, definition |
| **State boshqaruvi** | Zustand + localStorage (`englishpath-store`) |
| **Konflikt yechimi** | `mergeVocabProgress` — qurilmalararo sync |

**Joriy `DailyWordRow` modeli:**
```typescript
interface DailyWordRow {
  word_id: number
  english: string
  uzbek: string
  level: WordLevel  // 'A1' | 'A2' | 'B1' | 'B2'
  box: number
  next_review: string
  is_learned: boolean
  correct_count: number
  wrong_count: number
  is_new: boolean
  example?: string
  phonetic?: string
  last_rating?: string
}
```

### 2.2 Mavjud Iboralar Tizimi (`phrasesService.ts`)

| Jihat | Tafsilot |
|-------|----------|
| **Ma'lumotlar manbasi** | Supabase — `phrase_progress` jadvali |
| **Kategoriyalar** | 21 ta (everyday, grammar, travel, formal, ielts, business, ...) |
| **FSRS algoritmi** | `computePhraseNextReview` — vocabulary bilan bir xil |
| **State boshqaruvi** | Zustand + localStorage |

**Joriy `DailyPhraseRow` modeli:**
```typescript
interface DailyPhraseRow {
  phrase_id: number
  english: string
  uzbek: string
  level: PhraseLevel
  category: PhraseCategory
  box: number
  next_review: string
  is_learned: boolean
  correct_count: number
  wrong_count: number
  is_new: boolean
  last_rating?: string
}
```

### 2.3 Mavjud UI Komponentlar

| Komponent | Vazifasi |
|-----------|----------|
| `PhraseFlashCard.tsx` | Flash card oynasi (oldingi/Keyingi, o'rtasida tarjima) |
| `PhraseTypingGame.tsx` | So'zni yozib topish o'yini |
| `PhraseScrambleGame.tsx` | Harflarni aralashtirish |
| `PhraseTest.tsx` | Test rejimi |
| `PhraseQuickRating.tsx` | Tezkor baholash (bildim/qiynaldim/bilmadim) |
| `PhraseProgress.tsx` | Progress ko'rsatkichlari |
| `PhraseRow.tsx` | Bitta ibora qatori |
| `PhraseCalendar.tsx` | Kalendar ko'rinishi |
| `PhraseAnalytics.tsx` | Analitika |
| `PhraseExportModal.tsx` | Export qilish |

### 2.4 State Boshqaruvi (Zustand)

```typescript
// src/store/useStore.ts
export const useStore = create<AppState>()(
  persist(
    (...a) => ({
      ...createAuthSlice(...a),
      ...createProgressSlice(...a),
      ...createLessonSlice(...a),
    }),
    {
      name: 'englishpath-store',
      storage: createJSONStorage(() => localStorage),
      partialize: (s) => {
        // lessons va lessonProgress saqlanmaydi (cross-user leakage oldini olish)
        const { lessons: _l, lessonsLoading: _ll, lessonsFetched: _lf, _hydrated: _h, lessonProgress: _lp, lessonSessions: _ls, ...rest } = s
        return rest as AppState
      },
    }
  )
)
```

**Muhim:** `partialize` orqali faqat kerakli qismlar saqlanadi. Shaxsiy lug'at uchun alohida slice yaratish va uni `partialize` ga qo'shish kerak.

---

## 3. Ma'lumotlar Bazasi Tuzilishi (Taxminiy)

Joriy tizimda Supabase ishlatilgan. Shaxsiy lug'at uchun quyidagi jadvallar kerak bo'ladi:

### 3.1 `personal_vocabulary` Jadvali

```sql
CREATE TABLE personal_vocabulary (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  english TEXT NOT NULL,
  uzbek TEXT NOT NULL,
  phonetic TEXT,
  example TEXT,
  category TEXT DEFAULT 'custom',  -- 'custom' | 'grammar' | 'travel' | ...
  level TEXT DEFAULT 'A2',         -- 'A1' | 'A2' | 'B1' | 'B2'
  source TEXT DEFAULT 'manual',    -- 'manual' | 'ai_generated' | 'imported'
  ai_suggested_translation TEXT,   -- AI tomonidan taklif qilingan tarjima
  box INTEGER DEFAULT 1,
  next_review DATE DEFAULT CURRENT_DATE,
  is_learned BOOLEAN DEFAULT FALSE,
  correct_count INTEGER DEFAULT 0,
  wrong_count INTEGER DEFAULT 0,
  last_rating TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indekslar
CREATE INDEX idx_personal_vocab_user ON personal_vocabulary(user_id);
CREATE INDEX idx_personal_vocab_user_review ON personal_vocabulary(user_id, next_review) WHERE is_learned = FALSE;

-- RLS (Row Level Security)
ALTER TABLE personal_vocabulary ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own vocabulary" ON personal_vocabulary
  FOR ALL USING (auth.uid() = user_id);
```

### 3.2 `personal_vocabulary_sessions` Jadvali (ixtiyoriy)

```sql
CREATE TABLE personal_vocabulary_sessions (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  vocab_id BIGINT NOT NULL REFERENCES personal_vocabulary(id) ON DELETE CASCADE,
  session_date DATE DEFAULT CURRENT_DATE,
  result TEXT CHECK (result IN ('correct', 'wrong')),
  rating TEXT CHECK (rating IN ('bildim', 'qiynaldim', 'bilmadim', 'yodladim')),
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_pv_sessions_user_date ON personal_vocabulary_sessions(user_id, session_date);
```

---

## 4. Loyiha Arxitekturasi

### 4.1 Yangi Fayl va Papkalar

```
src/
├── types/
│   └── personalVocabulary.ts          # Yangi type'lar
├── services/
│   └── personalVocabularyService.ts   # CRUD + SRS logikasi
├── store/
│   └── personalVocabularySlice.ts     # Zustand slice
├── components/
│   └── personalVocabulary/
│       ├── PersonalVocabularyPage.tsx     # Asosiy sahifa
│       ├── AddWordForm.tsx                # So'z qo'shish formasi
│       ├── WordList.tsx                   # So'zlar ro'yxati
│       ├── FlashCardTest.tsx              # Flash card testi
│       ├── WordCard.tsx                   # Bitta so'z kartasi
│       └── AITranslationModal.tsx         # AI tarjima yordamchisi
└── data/
    └── personalVocabularyCategories.ts    # Kategoriyalar ro'yxati
```

### 4.2 Type'lar (`src/types/personalVocabulary.ts`)

```typescript
export type VocabSource = 'manual' | 'ai_generated' | 'imported'
export type VocabCategory = 
  | 'custom' | 'grammar' | 'travel' | 'formal' | 'ielts' | 'business'
  | 'food' | 'health' | 'education' | 'social' | 'work' | 'shopping'
  | 'relationships' | 'environment' | 'economy' | 'culture' | 'feelings'
  | 'discussion' | 'technology' | 'communication'

export interface PersonalWord {
  id: number
  user_id: string
  english: string
  uzbek: string
  phonetic?: string
  example?: string
  category: VocabCategory
  level: 'A1' | 'A2' | 'B1' | 'B2'
  source: VocabSource
  ai_suggested_translation?: string
  box: number
  next_review: string
  is_learned: boolean
  correct_count: number
  wrong_count: number
  last_rating?: string
  created_at: string
  updated_at: string
}

export interface PersonalVocabSession {
  id: number
  user_id: string
  vocab_id: number
  session_date: string
  result: 'correct' | 'wrong'
  rating?: string
  created_at: string
}
```

### 4.3 Zustand Slice (`src/store/personalVocabularySlice.ts`)

```typescript
import { createSlice } from 'zustand'

export interface PersonalVocabularySlice {
  // State
  personalWords: PersonalWord[]
  personalWordsLoading: boolean
  personalWordsFetched: boolean
  
  // Actions
  setPersonalWords: (words: PersonalWord[]) => void
  addPersonalWord: (word: Omit<PersonalWord, 'id' | 'created_at' | 'updated_at'>) => Promise<void>
  updatePersonalWord: (id: number, updates: Partial<PersonalWord>) => Promise<void>
  deletePersonalWord: (id: number) => Promise<void>
  ratePersonalWord: (id: number, rating: string) => Promise<void>
  fetchPersonalWords: (userId: string) => Promise<void>
  fetchWordsForReview: (userId: string) => Promise<PersonalWord[]>
  clearPersonalVocabulary: () => void
}

export const createPersonalVocabularySlice: createSlice<PersonalVocabularySlice> = (set, get) => ({
  // Initial state
  personalWords: [],
  personalWordsLoading: false,
  personalWordsFetched: false,

  // Actions
  setPersonalWords: (words) => set({ personalWords: words }),
  
  addPersonalWord: async (wordData) => {
    set({ personalWordsLoading: true })
    // Supaga qo'shish + state yangilash
  },
  
  // ... boshqa action'lar
})
```

### 4.4 Service (`src/services/personalVocabularyService.ts`)

```typescript
// Asosiy funksiyalar:
export async function addPersonalWord(userId: string, wordData: AddWordDTO): Promise<PersonalWord>
export async function updatePersonalWord(userId: string, wordId: number, updates: UpdateWordDTO): Promise<void>
export async function deletePersonalWord(userId: string, wordId: number): Promise<void>
export async function fetchPersonalWords(userId: string): Promise<PersonalWord[]>
export async function fetchWordsForReview(userId: string): Promise<PersonalWord[]>
export async function ratePersonalWord(userId: string, wordId: number, rating: string): Promise<void>
export async function generateAITranslation(word: string, context?: string): Promise<{ uzbek: string; phonetic?: string; example?: string }>
```

### 4.5 AI Tarjima Integratsiyasi

**Variant 1: Supabase Edge Function (tavsiya etiladi)**
```typescript
// Supabase ichida edge function yaratish
// POST /functions/v1/translate-vocab
// Body: { word: string, context?: string }
// Response: { uzbek: string, phonetic: string, example: string }
```

**Variant 2: Client-side AI (fallback)**
```typescript
// Agar Supabase Edge Function bo'lmasa, 
// AIBuddy service'dan foydalanish
import { generateTranslation } from '../services/aiBuddyService'
```

### 4.6 Flash Card Testi (`src/components/personalVocabulary/FlashCardTest.tsx`)

Mavjud `PhraseFlashCard.tsx` dan foydalanish yoki alohida komponent yaratish:

```typescript
interface FlashCardTestProps {
  words: PersonalWord[]
  onComplete: (results: WordSessionResult[]) => void
  onExit: () => void
}
```

**Test rejimlari:**
1. **Translation** — Inglizcha ko'rinib, o'zbekcha topish
2. **Fill-blank** — Misolda bo'sh joyni to'ldirish
3. **Type-answer** — To'liq javobni yozish
4. **Definition** — Ta'rif berish

---

## 5. Navbatdagi Qadamlar (Implementation Plan)

### Bosqich 1: Backend va Ma'lumotlar (1-2 kun)
- [ ] Supabase'da `personal_vocabulary` jadvali yaratish
- [ ] RLS siyosatlarini sozlash
- [ ] `personalVocabularyService.ts` yozish (CRUD + SRS)
- [ ] `personalVocabularySlice.ts` yozish (Zustand)

### Bosqich 2: UI — So'z Qo'shish (1 kun)
- [ ] `AddWordForm.tsx` — manual kiritish formasi
- [ ] `AITranslationModal.tsx` — AI yordamchi
- [ ] `WordList.tsx` — so'zlar ro'yxati (filter, search, delete)
- [ ] `WordCard.tsx` — bitta so'z kartasi

### Bosqich 3: UI — Test Rejimlari (2-3 kun)
- [ ] `FlashCardTest.tsx` — asosiy test komponenti
- [ ] Translation rejimi
- [ ] Fill-blank rejimi
- [ ] Type-answer rejimi
- [ ] Rating tugmalari (bildim/qiynaldim/bilmadim/yodladim)

### Bosqich 4: Integratsiya va Yaxshilash (1-2 kun)
- [ ] Navigatsiya: Lug'at sahifasiga "Shaxsiy lug'atim" bo'limi qo'shish
- [ ] i18n tarjimalari (uz/en/ru)
- [ ] Offline qo'llab-quvvatlash (Service Worker + IndexedDB fallback)
- [ ] Import/Export funksiyasi (CSV, JSON)
- [ ] Test qilish va bug'lar tuzatish

---

## 6. Texnik Qarorlar

| Qaror | Tanlov | Sabab |
|-------|--------|-------|
| **Saqlash** | Supabase + localStorage fallback | Mavjud tizim bilan mos kelish |
| **State** | Alohida Zustand slice | `partialize` orqali alohida boshqarish |
| **SRS** | Mavjud FSRS algoritmini qayta ishlatish | Ishlab chiqilgan, testdan o'tgan |
| **AI Tarjima** | Supabase Edge Function | Server-side, xavfsiz, tez |
| **Test UI** | Mavjud `PhraseFlashCard` dan foydalanish | Qayta ishlashni kamaytirish |
| **Offline** | IndexedDB fallback | Offline rejimda ishlash |

---

## 7. Xavflar va Cheklovlar

| Xavf | Yechim |
|------|--------|
| **Katta lug'atlar** (1000+ so'z) | Virtual scroll (`react-window`) |
| **AI xatolari** | User tomonidan tahrir qilish imkoniyati |
| **Cross-user leakage** | RLS + user_id filter |
| **Offline sync** | IndexedDB + conflict resolution (mavjud `mergeVocabProgress`) |
| **Performance** | Lazy loading, pagination |

---

## 8. Xulosa

Ushbu loyiha quyidagilarni ta'minlaydi:
1. ✅ Har bir foydalanuvchi o'ziga xos shaxsiy lug'at
2. ✅ AI yordamida yoki qo'lda tarjima kiritish
3. ✅ Flash card testi (mavjud tizim bilan integratsiya)
4. ✅ FSRS algoritmi bilan intervallik takrorlash
5. ✅ Faqat shaxsiy ma'lumotlar (boshqalarga ko'rinmas)

**Tavsiya etiladigan navbat:** Backend → UI (qo'shish) → UI (test) → Integratsiya

---

*Hisobot tayyorlandi: 2026-06-11*
*Loyiha: EnglishPath — Shaxsiy Lug'at Xususiyati*
