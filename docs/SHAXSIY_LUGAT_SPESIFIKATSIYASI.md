# Shaxsiy Lug'at Tizimi — Loyiha Spesifikatsiyasi

> **Muallif:** AI tahlil
> **Sana:** 2026-06-11
> **Holat:** Loyiha (tasdiqlanishi kerak)

---

## 1. Maqsad

Har bir foydalanuvchi darslarda uchratgan yoki mustaqil oʻrganmoqchi boʻlgan soʻz/iboralarni oʻz shaxsiy lugʻatiga qoʻshishi, AI yordamida tarjima qildirishi va shu soʻzlardan flashcard/test ishlashi.

---

## 2. Mavjud Infratuzilma

| Komponent | Status | Izoh |
|-----------|--------|------|
| `user_words` jadvali (Supabase) | ✅ Bor | `id, user_id, english, uzbek, level, example, phonetic` |
| `dictionaryService.ts` — `addUserWord()` | ✅ Bor | user_words ga yozadi, duplicate tekshiradi |
| `vocabularyStore.ts` — SRS tizimi | ✅ Bor | SM-2 box (1-6), FSRS-5, batch tizimi |
| `FlashCard`, `WordTest`, `WordGame` | ✅ Bor | Flashcard, test, oʻyin komponentlari |
| `VocabExportModal` (import/export) | ✅ Bor | CSV, Anki, JSON |
| AI tarjima (`claude.ts`) | ✅ Bor | `generateUzbekSentence()`, `evaluateWriting()` |
| `vocabularyService.ts` — `loadDailyData()` | ⚠️ Cheklangan | `user_words` ni yuklamaydi (skip qiladi) |

**Asosiy boʻshliq:** `user_words` mavjud, lekin SRS tizimiga ulangan emas, UI yoʻq, AI tarjima yoʻq.

---

## 3. Data Model

### 3.1 `user_words` jadvaliga yangi ustunlar

```sql
ALTER TABLE user_words ADD COLUMN IF NOT EXISTS source TEXT DEFAULT 'manual';
-- source: 'manual' | 'ai_translated' | 'lesson'

ALTER TABLE user_words ADD COLUMN IF NOT EXISTS example_en TEXT DEFAULT '';

ALTER TABLE user_words ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
-- tags: {'food', 'travel', 'business', ...}

ALTER TABLE user_words ADD COLUMN IF NOT EXISTS folder TEXT DEFAULT 'default';
-- folder: foydalanuvchi guruhlashi uchun
```

### 3.2 SRS uchun mapping

`user_words` → `vocabulary_progress` ga word_id orqali ulanadi.

Yangi `user_words` qoʻshilganda, parallel ravishda `vocabulary_progress` ga `word_id` bilan yoziladi (box=1, next_review=bugun).

**Muammo:** `vocabulary_progress` da `UNIQUE(user_id, word_id)` bor. `user_words.id` va `words.id` bir-biriga aralashmasligi kerak.

**Yechim:** `vocabulary_progress` ga `source` ustuni qoʻshiladi:

```sql
ALTER TABLE vocabulary_progress ADD COLUMN source TEXT DEFAULT 'system';
-- source: 'system' | 'user'
```

Bu minimal oʻzgarish — mavjud SRS logikasini qayta ishlatadi.

---

## 4. Arxitektura

```
┌──────────────────────────────────────────────────────┐
│                 VocabHub (tab container)               │
│  ┌──────┬──────────┬─────────┬──────────┬──────────┐  │
│  │Learn │Dictionary│ Phrases │Phrases-Di│SHAXSIY   │  │
│  │      │          │         │ct        │LUG'AT    │  │
│  └──────┴──────────┴─────────┴──────────┴──────────┘  │
└──────────────────────────────────────────────────────┘
                           │
                    ┌──────┴──────┐
                    ▼             ▼
          ┌─────────────────┐  ┌──────────────────┐
          │ MyWordsPage      │  │ AddWordModal      │
          │ (lug'at ro'yxati)│  │ (so'z qo'shish)   │
          │                  │  │                   │
          │ - filter/search  │  │ - English input   │
          │ - folder tabs    │  │ - Uzbek (AI/man) │
          │ - flashcard btn  │  │ - AI tarjima btn │
          │ - test btn       │  │ - example         │
          │ - delete/edit    │  │ - tags/folder     │
          └────────┬─────────┘  └──────────────────┘
                   │
                   ▼
          ┌──────────────────┐
          │ SRS integration   │
          │ (mavjud tizimga)  │
          │                   │
          │ computeNextReview │
          │ upsertProgress    │
          │ batch/tab system  │
          └──────────────────┘
```

---

## 5. UI/UX Dizayni

### 5.1 VocabHub da yangi tab: "Mening lug'atim"

```tsx
// VocabHub.tsx ga yangi tab
const TABS = [
  { id: 'learn', label: "O'rganish", icon: BookOpen },
  { id: 'dictionary', label: "Lug'at", icon: BookText },
  { id: 'phrases', label: "Ibora", icon: MessagesSquare },
  { id: 'phrases-dict', label: "Iboralar", icon: BookMarked },
  { id: 'my-words', label: "Mening lug'atim", icon: UserPlus },  // NEW
]
```

### 5.2 MyWordsPage — Asosiy sahifa

**Layout:**
```
┌─────────────────────────────────────────────────┐
│ [Qidirish...]  [Filter: Folder ▼]  [+ Yangi so'z] │
├─────────────────────────────────────────────────┤
│ Folder: [All] [Food] [Travel] [Business] [+]    │
├─────────────────────────────────────────────────┤
│ ┌─────────────────────────────────────────────┐ │
│ │ English    Uzbek         Folder   Progress  │ │
│ │─────────────────────────────────────────────│ │
| | apple      olma          default  ■■■■□□□  │ │
│ │                    60%                     │ │
│ │              ☰ [Flashcard] [Test] [✏️] [🗑] │ │
│ │─────────────────────────────────────────────│ │
│ │ serendipity  kutilmagan   default  ■■■□□□□ │ │
│ │     topilma                       40%      │ │
│ └─────────────────────────────────────────────┘ │
│                                                 │
│ [📇 Flashcard bilan o'rganish] [✍️ Test] [🎮 O'yin] │
└─────────────────────────────────────────────────┘
```

### 5.3 AddWordModal — So'z qo'shish

```
┌───────────────────────────────────────┐
│  ✏️ Yangi so'z qo'shish               │
│                                       │
│  Ingliz tili:  [________________]     │
│                                       │
│  O'zbek tili:  [________________]     │
│                 [🤖 AI tarjima]       │
│                                       │
│  Misol:        [________________]     │
│                 [🤖 AI misol yarat]   │
│                                       │
│  Papka:        [default ▼]            │
│  Teglar:       [#food] [#travel]      │
│                                       │
│  [Bekor qilish]        [➕ Qo'shish]  │
└───────────────────────────────────────┘
```

**AI tarjima flow:**
1. User inglizcha so'zni yozadi
2. "AI tarjima" tugmasini bosadi
3. `claude.ts` dan `translateWord(word: string)` chaqiriladi
4. Qaytaradi: `{ uzbek, example, phonetic }`
5. Maydonlar avtomatik to'ldiriladi
6. User tahrirlashi mumkin

### 5.4 Flashcard/Test integration

Mavjud `FlashCard.tsx`, `WordTest.tsx`, `WordGame.tsx` qayta ishlatiladi:

```
MyWordsPage ──→ [Flashcard bilan o'rganish]
                     │
                     ▼
              ┌─────────────────┐
              │ FlashCardRenderer │ (qayta ishlatiladi)
              │                   │
              │ user_words dan    │
              │ batch yig'adi     │
              │                   │
              │ rateWord()        │
              │ → computeNextReview│
              │ → upsertProgress  │
              └─────────────────┘
```

**Farqi:** `loadDailyData()` dan emas, to'g'ridan-to'g'ri `user_words` + `vocabulary_progress` dan yuklanadi.

---

## 6. Data Flow

### 6.1 So'z qo'shish flow

```
User input (english, uzbek?, folder?, tags?)
    │
    ▼
[AI tarjima?] ──Yes──→ claude.ts translateWord()
    │                       │
    No                      ▼
    │                 Tarjima + misol
    ▼                       │
    ◄───────────────────────┘
    │
    ▼
dictionaryService.addUserWord({...})
    │
    ▼
Supabase: INSERT INTO user_words
Supabase: INSERT INTO vocabulary_progress (box=1, next_review=today, source='user')
    │
    ▼
vocabularyStore.dailyWords ga qo'shiladi (keyingi batch da)
```

### 6.2 O'rganish flow (mavjud SRS ni qayta ishlatadi)

```
MyWordsPage → [Flashcard bilan o'rganish]
    │
    ▼
getUserWordsForReview(userId):
  SELECT uw.*, vp.box, vp.next_review, vp.stability
  FROM user_words uw
  LEFT JOIN vocabulary_progress vp
    ON vp.word_id = uw.id AND vp.source = 'user'
  WHERE uw.user_id = $1
    AND (vp.next_review <= TODAY OR vp.next_review IS NULL)
    AND (vp.is_learned = FALSE OR vp.is_learned IS NULL)
    │
    ▼
useVocabStore ga yuklanadi (dailyWords dan alohida)
    │
    ▼
FlashCardRenderer (qayta ishlatiladi)
  → rateWord() → computeNextReview()
  → upsertProgress(source='user')
```

### 6.3 Privacy isolation

Har bir so'z `user_words.user_id` bilan bog'langan:
- `SELECT` har doim `WHERE user_id = auth.user_id()` bilan
- RLS polisi: `user_id = auth.uid()`
- Hech qanday user boshqa userning so'zini ko'ra olmaydi

---

## 7. Implementatsiya Bosqichlari

### Faza 1 — Asos (1-2 kun)

| # | Task | Fayl |
|---|------|------|
| 1 | `user_words` jadvaliga yangi ustunlar (source, tags, folder) | SQL migration |
| 2 | `dictionaryService.ts` ni kengaytirish (folder, tags, source, edit, delete) | `src/services/dictionaryService.ts` |
| 3 | `AddWordModal` komponenti (asosiy form) | `src/components/vocabulary/AddWordModal.tsx` |
| 4 | `MyWordsPage` — so'zlar ro'yxati | `src/pages/MyWordsPage.tsx` |
| 5 | VocabHub ga "Mening lug'atim" tab | `src/pages/VocabHub.tsx` |
| 6 | Routing (`/my-words`) | `src/App.tsx` |

### Faza 2 — AI Tarjima (1 kun)

| # | Task | Fayl |
|---|------|------|
| 7 | `claude.ts` ga `translateWord()` funksiyasi | `src/lib/claude.ts` |
| 8 | `claudePrompts.ts` ga translate prompt | `src/lib/claudePrompts.ts` |
| 9 | AddWordModal ga "AI tarjima" tugmasi + integration | `AddWordModal.tsx` |
| 10 | AI misol jumla yaratish | `AddWordModal.tsx` |

### Faza 3 — SRS Integratsiyasi (1 kun)

| # | Task | Fayl |
|---|------|------|
| 11 | `vocabularyService.ts` ga `loadUserWordsForReview()` | `src/services/vocabularyService.ts` |
| 12 | `vocabularyStore.ts` ga `userWords` state + actions | `src/store/vocabularyStore.ts` |
| 13 | `FlashCardRenderer` ni user_words bilan ishlashga moslash | `src/pages/vocabulary/FlashCardRenderer.tsx` |
| 14 | MyWordsPage dan flashcard/test ga o'tish | `MyWordsPage.tsx` |
| 15 | `vocabulary_progress` ga `source` ustuni migration | SQL |

### Faza 4 — Qo'shimcha (1 kun)

| # | Task | Fayl |
|---|------|------|
| 16 | Folder tizimi (yaratish, o'chirish, rename) | `MyWordsPage.tsx` |
| 17 | Tag filter | `MyWordsPage.tsx` |
| 18 | So'z tahrirlash (edit modal) | `AddWordModal.tsx` (reuse) |
| 19 | So'z o'chirish (delete with confirm) | `dictionaryService.ts` |
| 20 | Search/qidiruv | `MyWordsPage.tsx` |
| 21 | Testlar | `__tests__/` |

---

## 8. Yangi/Modified Fayllar Ro'yxati

### Yangi fayllar (7 ta)

| Fayl | Vazifasi |
|------|----------|
| `src/components/vocabulary/AddWordModal.tsx` | So'z qo'shish/tahrirlash modal |
| `src/pages/MyWordsPage.tsx` | Shaxsiy lug'at sahifasi |
| `src/services/__tests__/dictionaryService.test.ts` | Dictionary service testlari |
| `src/components/vocabulary/__tests__/AddWordModal.test.tsx` | Modal testlari |
| `src/pages/__tests__/MyWordsPage.test.tsx` | Sahifa testlari |
| `supabase/migrations/xxxxx_user_words_ext.sql` | Database migration |
| `scripts/seed-demo-user-words.ts` | Demo so'zlar (test uchun) |

### Modified fayllar (8 ta)

| Fayl | O'zgarish |
|------|-----------|
| `src/pages/VocabHub.tsx` | + "Mening lug'atim" tab (my-words) |
| `src/services/dictionaryService.ts` | + folder, tags, source, delete, edit, update |
| `src/lib/claude.ts` | + `translateWord()` eksport |
| `src/lib/claudePrompts.ts` | + translate prompt template |
| `src/services/vocabularyService.ts` | + `loadUserWordsForReview()` |
| `src/store/vocabularyStore.ts` | + `userWords` state + actions |
| `src/pages/vocabulary/FlashCardRenderer.tsx` | + user_words source support |
| `src/App.tsx` | + `/my-words` route |

---

## 9. Xavf va Cheklovlar

| Xavf | Daraja | Yechim |
|------|--------|--------|
| `user_words.id` va `words.id` conflict `vocabulary_progress` da | **High** | `source` ustuni bilan ajratish yoki alohida `user_vocab_progress` jadvali |
| AI tarjima xato bo'lishi mumkin | Medium | User har doim tahrirlashi mumkin, "manual" source bilan yozib qo'yadi |
| So'z soni cheksiz o'sishi (performance) | Low | Pagination (20 tadan), search, folder filter |
| Offline rejim (Dexie) | Low | localStorage cache + Dexie sync (mavjud tizimga o'xshab) |
| Mavjud `vocabulary_progress` UNIQUE constraint | **High** | `user_words.id` manfiy qiymat bilan ishlatiladi yoki composite key ga `source` qo'shiladi |

---

## 10. Xulosa

**Jami taxminiy vaqt: 4-6 kun**

Platformada 80% infratuzilma tayyor:
- ✅ `user_words` jadvali
- ✅ `dictionaryService` (CRUD)
- ✅ To'liq SRS tizimi (SM-2 + FSRS-5)
- ✅ Flashcard, Test, O'yin komponentlari
- ✅ AI (Claude) integrastiyasi
- ❌ UI (modal, sahifa, tab)
- ❌ AI tarjima funksiyasi
- ❌ SRS ga ulash
- ❌ Folder/tag filter
