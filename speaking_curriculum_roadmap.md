# Speaking Curriculum — To'liq Roadmap

> **Maqsad**: Speaking path'ni (75 kun) grammar-driven CEFR-based curriculum'ga aylantirish,
> free↔track sync bilan. Hajm: **75F + 37–39N + 14R = 126–128 kun**

---

## 1. Hozirgi Status

| Aspekt | Qiymat |
|--------|--------|
| **Speaking days** | 82 (A0=3, A1=15, A2=18, B1=21, B1+=18, B2=7) |
| **CEFR types** | `'A0' \| 'A1' \| 'A2' \| 'B1' \| 'B1+' \| 'B2'` |
| **Daily lessons** | 106 (A1=23, A2=22, B1=18, B1+=18, B2=25) |
| **Speaking prompts (free)** | 99 (A1=19, A2=23, B1=31, B1+=6, B2=20) |
| **Tests** | 23/23 passed (speaking path), 0 failed |
| **TypeScript** | 0 errors |
| **Lint** | 0 errors, `--max-warnings 0` |

---

## 2. O'zgarishlar

### 2.1. CEFR kengayishi

```
Old:    'A0' | 'A1' | 'A2' | 'B1'
New:    'A0' | 'A1' | 'A2' | 'B1' | 'B1+' | 'B2'
```

### 2.2. B1 → B1/B1+ split (39 → 21 + 18)

| | Old B1 | New B1 | New B1+ |
|---|---|---|---|
| Days | 37–75 (39 kun) | 37–57 (21 kun) | 58–75 (18 kun) |
| cefr label | `B1` | `B1` | `B1+'` |
| Content | unchanged | unchanged | unchanged |
| Chunks | 234 | 126 | 108 |

### 2.3. types.ts ga qo'shilgan field'lar

```typescript
// SpeakingDay
linkedLessonId?: string      // daily lesson ID bilan bog'lash
grammarPoint?: string        // grammar tavsifi
usedVocabIds?: string[]       // qayta ishlatilgan vocab ID'lari

// SpeakingDayProgress
grammarScore?: number
practicedLessonIds?: string[]

// NEW: GrammarProgress interface
{
  lessonId: string
  grammarPoint: string
  level: string
  status: 'not-started' | 'practice' | 'mastered'
  bestScore: number
  practiceCount: number
  lastPracticedAt?: string
  usedInFreeMode: boolean
}
```

---

## 3. CEFR Mapping (75 kun → linkedLessonId)

### 3.1. A0 — 3 kun (no daily lessons)

| Day | Title | linkedLessonId |
|-----|-------|----------------|
| 1 | Salomlashish | — |
| 2 | O'zingiz haqingizda | — |
| 3 | Raqamlar, yosh, telefon | — |

### 3.2. A1 — 15 kun (daily lesson IDs)

| Day | Mavzu | linkedLessonId | Daily Lesson Manbai |
|-----|-------|----------------|----------------------|
| 4 | Kafede buyurtma | `alphabet-greetings` | `a1Part1.ts` |
| 5 | Do'konda xarid | `numbers-1-100` | `a1Part1.ts` |
| 6 | Yo'l so'rash | `prepositions-of-place` | `a1Part2.ts:169` |
| 7 | Vaqt va uchrashuv | `time-routines` | `a1Part1.ts` |
| 8 | Oila va do'stlar | `family` | `a1Part1.ts` |
| 9 | Kundalik tartib | `simple-present` | `tensesData.ts:6` |
| 10 | Kichik suhbat | `alphabet-greetings` | `a1Part1.ts` |
| 11 | Sevimli mashg'ulot | `food-drinks` | `a1Part1.ts` |
| 12 | Ovqat va ichimlik | `food-drinks` | `a1Part1.ts` |
| 13 | Ranglar va narsalar | `colors-shapes` | `a1Part1.ts` |
| 14 | Uy va xonalar | `there-is-are` | `a1Part2.ts:546` |
| 15 | Hayvonlar | `animals` | `a1Part1.ts` |
| 16 | Kiyim | `clothes` | `a1Part1.ts` |
| 17 | Hislar va kayfiyat | `basic-adjectives` | `a1Part2.ts:358` |
| 18 | Maktab va o'qish | `time-routines` | `a1Part1.ts` |

**Eslatma**: `simple-present` — tenses lesson, daily lesson emas. `present-continuous`, `simple-past`, `simple-future` A1 dagi so'zlar uchun emas, balki A1 reviewing (A1 speaking path real hayot mavzulari bilan ishlaydi).

### 3.3. A2 — 18 kun

| Day | Mavzu | linkedLessonId | Daily Lesson Manbai |
|-----|-------|----------------|----------------------|
| 19 | Yoqtirish/yoqtirmaslik | `gerunds-infinitives` | `a2Part1.ts` |
| 20 | Kecha nima qildingiz | `simple-past` | `tensesData.ts:432` |
| 21 | Kelajak rejalar | `present-continuous-future` | `a2Part1.ts` |
| 22 | Muammo/shikoyat | `modal-verbs` | `a2Part1.ts:4` |
| 23 | Telefon suhbati | `prepositions` | `a2Part1.ts` |
| 24 | Restoranda suhbat | `articles` | `a2Part1.ts` |
| 25 | Aeroportda | `questions` | `a2Part1.ts` |
| 26 | Mehmonxonada | `there-is-there-are` | `a1Part2.ts:546` |
| 27 | Shifokorda | `have-got` | `a1Part2.ts:877` |
| 28 | Ob-havo/kiyim | `adjective-adverb` | `a2Part2.ts` |
| 29 | Kiyim do'konida | `demonstratives` | `a1Part2.ts:4` |
| 30 | Ishda tanishtirish | `present-perfect` | `a2Part2.ts` |
| 31 | Bo'sh vaqt rejalari | `present-continuous-future` | `a2Part1.ts` |
| 32 | Bayram/tabrik | `possessives` | `a2Part2.ts` |
| 33 | Jamoat transporti | `quantifiers` | `a2Part2.ts` |
| 34 | Bank/pochta | `countable-uncountable` | `a2Part1.ts` |
| 35 | Xaridni qaytarish | `modal-verbs` | `a2Part1.ts:4` |
| 36 | Fikr bildirish | `gerunds-infinitives` | `a2Part1.ts` |

### 3.4. B1 — 21 kun (days 37–57)

| Day | Mavzu | linkedLessonId | Daily Lesson |
|-----|-------|----------------|--------------|
| 37 | Rasmiy telefon so'rovi | `modal-verbs` | a2 |
| 38 | Rozilik va e'tiroz | `questions` | a2 |
| 39 | Taklif qabul/rad | `modal-verbs` | a2 |
| 40 | Tajriba (Present Perfect) | `present-perfect` | a2 |
| 41 | Uchrashuv kelishish | `time-prepositions` | a2 |
| 42 | Maslahat (should/could) | `modal-verbs` | a2 |
| 43 | Rejalar/orzular | `first-conditional` | a2 |
| 44 | Sabab/natija | `conjunctions` | a2 |
| 45 | Intervyu asoslari | `questions` | a2 |
| 46 | Bankda hisob | `countable-uncountable` | a2 |
| 47 | Pochtada | `prepositions` | a2 |
| 48 | Kvartira ijarasi | `there-is-there-are` | a1 |
| 49 | Ish suhbati | `present-perfect` | a2 |
| 50 | Texnik yordam | `modal-verbs` | a2 |
| 51 | Sayohat rejasi | `first-conditional` | a2 |
| 52 | Restoranda shikoyat | `modal-verbs` | a2 |
| 53 | Dorixonada | `countable-uncountable` | a2 |
| 54 | Sport/sog'liq | `gerunds-infinitives` | a2 |
| 55 | Film/kitob | `present-perfect` | a2 |
| 56 | Yangiliklar | `verb-patterns` | a2 |
| 57 | Atrof-muhit | `modal-verbs` | a2 |

### 3.5. B1+ — 18 kun (days 58–75)

| Day | Mavzu | linkedLessonId | Manba |
|-----|-------|----------------|-------|
| 58 | Texnologiya/tarmoq | `narrative-tenses-b1plus` | b1plusPart1 |
| 59 | Ta'lim/o'rganish | `infinitive-gerund-advanced-b1plus` | b1plusPart1 |
| 60 | Pul/byudjet | `collocations-make-do-have-take-b1plus` | b1plusPart2 |
| 61 | Ish-hayot muvozanati | `concession-b1plus` | b1plusPart1 |
| 62 | Madaniy farqlar | `idioms-common-b1plus` | b1plusPart2 |
| 63 | Ishda kelishuv | `reporting-verbs-b1plus` | b1plusPart2 |
| 64 | Taqdimot | `linking-words-advanced-b1plus` | b1plusPart2 |
| 65 | Kelishmovchilik | `determiners-advanced-b1plus` | b1plusPart2 |
| 66 | Hikoya aytish | `narrative-tenses-b1plus` | b1plusPart1 |
| 67 | Taxmin/ehtimollik | `modal-perfects-b1plus` | b1plusPart1 |
| 68 | Afsus/o'tmish | `ellipsis-substitution-b1plus` | b1plusPart1 |
| 69 | Faraziy holatlar | `participle-clauses-b1plus` | b1plusPart1 |
| 70 | Tavsiya/did | `infinitive-gerund-advanced-b1plus` | b1plusPart1 |
| 71 | Shahar/qishloq | `prepositional-phrases-b1plus` | b1plusPart2 |
| 72 | Kelajak bashorati | `word-formation-b1plus` | b1plusPart2 |
| 73 | Kuchli/zaif tomon | `emphasis-does-b1plus` | b1plusPart1 |
| 74 | Maqsad/motivatsiya | `collocations-make-do-have-take-b1plus` | b1plusPart2 |
| 75 | Yakuniy taqdimot | — | — |

---

## 4. B2 Content Generation (NEW days 76–96+)

### 4.1. B2 Lesson ID'lari (25 ta, src/data/daily/b2Part*.ts dan)

```
unreal-past-b2                (b2Part1.ts:4)
advanced-conditionals-b2       (b2Part1.ts:227)
future-perfect-continuous      (tensesData.ts:2395) — NOT b2 suffix
nominalization-b2              (b2Part1.ts:460)
subjunctive-b2                 (b2Part1.ts:684)
advanced-passive-b2            (b2Extra.ts:1735)
hedging-b2                     (b2Part1.ts:905)
complex-prepositions-b2        (b2Part1.ts:1117)
cohesion-b2                    (b2Part1.ts:1328)
register-b2                    (b2Part1.ts:1541)
complex-sentences-b2           (b2Part2.ts:4)
advanced-modals-b2             (b2Part2.ts:226)
contrastive-structures-b2      (b2Part2.ts:444)
inversion-b2                   (b2Extra.ts:6)
cleft-sentences-b2             (b2Extra.ts:867)
punctuation-b2                 (b2Part2.ts:668)
academic-collocations-b2       (b2Part2.ts:886)
academic-vocabulary-b2         (b2Extra.ts:2614)
critical-thinking-b2           (b2Part2.ts:1104)
argument-structure-b2          (b2Part3.ts:5)
stance-markers-b2              (b2Part3.ts:227)
paraphrasing-b2                (b2Part3.ts:448)
advanced-verb-patterns-b2      (b2Part3.ts:668)
b2-review                      (b2Part2.ts:1322)
b2-comprehensive-review        (b2Part3.ts:892)

Auto-review: auto-review-16 (day 102), auto-review-17 (day 108),
             auto-review-18 (day 154), auto-review-19 (day 119),
             auto-review-20 (day 125)
```

### 4.2. B2 Speaking Day Structure

```typescript
const day76: SpeakingDay = {
  day: 76, cefr: 'B2',
  title: "...",
  subtitle: "...",
  goalUz: "...",
  estMinutes: 15,
  linkedLessonId: 'unreal-past-b2',
  grammarPoint: 'Unreal Past — wish, if only, would rather',
  usedVocabIds: ['ielts-p3-tourism-impact', 'social-media-opinion'],
  vocab: [ /* 4 items */ ],
  pronunciationFocus: { sound: '/ə/', ... },
  recycledChunkIds: ['sp-d69-c1', 'sp-d68-c3'],
  chunks: [
    { id: 'sp-d76-c1', en: "...", uz: "...", grammarTip: "...", commonMistake: "...", stressWord: "..." },
    // ... 6 chunks per day
  ],
  scenario: {
    topic: "...",
    aiRole: "...",
    userRole: "...",
    opening: "...",
    goalUz: "...",
  },
}
```

### 4.3. ✅ B2 Content (BATCH 1 — first 7 days) — DONE

| Day | Lesson ID | Topic | Status |
|-----|-----------|-------|--------|
| 76 | `unreal-past-b2` | Wish/if only — afsus va orzular | ✅ |
| 77 | `advanced-conditionals-b2` | Mixed conditionals — faraziy vaziyatlar | ✅ |
| 78 | `future-perfect-continuous` | Kelajakda davom etayotgan ishlar | ✅ |
| 79 | `nominalization-b2` | Otlashtirish — rasmiy nutq | ✅ |
| 80 | `subjunctive-b2` | Subjunctive — taklif/talab/zarurat | ✅ |
| 81 | `advanced-passive-b2` | Passive voice (advanced) | ✅ |
| 82 | `hedging-b2` | Ehtiyotkorlik — it seems, might | ✅ |

### 4.4. B2 Content Daily Lesson ↔ Chunk Mapping

Har bir B2 daily lesson dan 6 ta chunk:

```typescript
chunk 1 → Pattern introduction (grammar rule)
chunk 2 → Real-life example 1 (personal)
chunk 3 → Real-life example 2 (work/academic)
chunk 4 → Common error (O'zbek learners)
chunk 5 → Question form / Interactive
chunk 6 → Full sentence / Complex expression
```

---

## 5. Free ↔ Track Sync Architecture

```
┌─────────────────────────────────────────────────────┐
│                  SPEAKING SERVICE                    │
├─────────────────────────────────────────────────────┤
│                                                     │
│  FREE MODE                    TRACKED MODE           │
│  (prompts)                    (75 days)              │
│       │                            │                 │
│       ▼                            ▼                 │
│  extractGrammarFromTranscript()    linkedLessonId    │
│       │                            │                 │
│       └──────────┬─────────────────┘                 │
│                  ▼                                   │
│         updateGrammarProgress()                      │
│                  │                                   │
│                  ▼                                   │
│         GrammarProgress[]                            │
│         (localStorage / Supabase)                    │
└─────────────────────────────────────────────────────┘
```

### 5.1. extractGrammarFromTranscript()

Regex pattern matching — transkriptda qaysi grammar point'lar ishlatilganini aniqlaydi.

```typescript
const GRAMMAR_PATTERNS: { id: string; regex: RegExp }[] = [
  // A1 patterns (5)
  { id: 'have-got', regex: /\b(have|has) got\b/i },
  { id: 'there-is-are', regex: /\bthere (is|are)\b/i },
  { id: 'simple-present', regex: /\b(?:I|you|we|they) \w+\b|(?:he|she|it) \w+s\b/i },
  { id: 'present-continuous', regex: /\b(am|is|are) \w+ing\b/i },
  { id: 'can-cant', regex: /\bcan('t| not)?\b/i },

  // A2 patterns (12)
  { id: 'simple-past', regex: /\b(did|was|were|had|went|saw|ate|took|made|said)\b/i },
  { id: 'simple-future', regex: /\bwill\b|\bgoing to\b/i },
  { id: 'present-perfect', regex: /\b(have|has) (been|seen|done|had|gone|taken)\b/i },
  { id: 'modal-verbs', regex: /\b(can|could|should|must|might|may)\b/i },
  { id: 'first-conditional', regex: /\bif .+, .+ will\b/i },
  { id: 'comparatives', regex: /\b(more|most|er than|better|best|worse|worst)\b/i },
  { id: 'gerunds-infinitives', regex: /\b(enjoy|like|love|hate|don't mind) \w+ing\b/i },
  { id: 'articles', regex: /\b(a|an|the) \w+\b/ },  // Basic check
  { id: 'prepositions', regex: /\b(in|on|at|to|for|with|about)\b/ },
  { id: 'questions', regex: /^(Do|Does|Did|Is|Are|Was|Were|Can|Will|Have|Has) /m },
  { id: 'adjective-adverb', regex: /\b(quickly|slowly|carefully|badly|well|hard)\b/i },
  { id: 'quantifiers', regex: /\b(some|any|much|many|a lot of|a few|a little)\b/i },

  // B1 patterns (10)
  { id: 'present-perfect-continuous', regex: /\b(have|has) been \w+ing\b/i },
  { id: 'past-perfect', regex: /\bhad (been|done|seen|gone|taken|made|said)\b/i },
  { id: 'future-continuous', regex: /\bwill be \w+ing\b/i },
  { id: 'passive-voice', regex: /\b(am|is|are|was|were|been|being) \w+en\b|\b(am|is|are|was|were) \w+ed\b/i },
  { id: 'reported-speech', regex: /\b(said|told|asked) (that|me|him|her|us|them)\b/i },
  { id: 'second-conditional', regex: /\bif .+ (were|did|had|could), .+ would\b/i },
  { id: 'relative-clauses', regex: /\b(who|which|that|whom|whose) \w+\b/ },
  { id: 'time-prepositions', regex: /\b(at \d|on \w+day|in \w+ber|in \w+uary)\b/i },
  { id: 'verb-patterns', regex: /\b(want|need|expect|hope|decide|promise) to \w+\b/i },
  { id: 'conjunctions', regex: /\b(although|however|therefore|moreover|nevertheless)\b/i },

  // B1+ patterns (5)
  { id: 'modal-perfects', regex: /\b(must|could|might|may|should|would) have \w+en\b/i },
  { id: 'narrative-tenses', regex: /\b(was \w+ing|were \w+ing|had \w+ed)\b/ },
  { id: 'participle-clauses', regex: /\b(having|being) \w+en\b|\b(Having|Being) \w+ed\b/i },
  { id: 'emphasis-does', regex: /\b(do|does|did) \w+\b(?!\?)/ },  // Emphasis in affirmation
  { id: 'infinitive-gerund', regex: /\b(avoid|suggest|recommend|consider|admit) \w+ing\b/i },

  // B2 patterns (5)
  { id: 'unreal-past', regex: /\b(wish|if only|would rather|it's time) \w+\b/i },
  { id: 'advanced-conditionals', regex: /\b(had \w+ed|had \w+en), .+ (would|could) have\b/i },
  { id: 'hedging', regex: /\b(it seems|it appears|tends to|likely to|arguably)\b/i },
  { id: 'inversion', regex: /\b(Not only|Never have|Rarely do|No sooner|Hardly had)\b/i },
  { id: 'cleft-sentences', regex: /\b(What I|The reason why|The thing that|It is .+ that)\b/i },
]
```

### 5.2. updateGrammarProgress()

```typescript
async function updateGrammarProgress(
  userId: string,
  progress: GrammarProgress
): Promise<void> {
  const key = `grammar:${userId}`
  const existing: GrammarProgress[] = JSON.parse(localStorage.getItem(key) || '[]')
  const idx = existing.findIndex(g => g.lessonId === progress.lessonId)

  if (idx >= 0) {
    existing[idx].practiceCount++
    existing[idx].lastPracticedAt = new Date().toISOString()
    existing[idx].usedInFreeMode = true
    if (progress.bestScore > existing[idx].bestScore) {
      existing[idx].bestScore = progress.bestScore
    }
  } else {
    existing.push({ ...progress, practiceCount: 1, lastPracticedAt: new Date().toISOString() })
  }

  localStorage.setItem(key, JSON.stringify(existing))
}
```

### 5.3. Sync Logic

```
Track mode day completed:
  → day.linkedLessonId → grammar progress update → "practice"
  → day.grammarPoint → display & track

Free mode prompt completed:
  → transcript → extractGrammarFromTranscript()
  → har bir grammar ID → grammar progress update
  → grammarProgress.usedInFreeMode = true
```

---

## 6. Validation Script (`scripts/validate-speaking-grammar-map.ts`)

```
1. DAILY_LESSONS dan barcha lesson ID'larini olish
2. SPEAKING_DAYS dan barcha linkedLessonId'larini olish
3. Qaysi daily lesson'lar speaking day'ga bog'lanmagan?
4. Qaysi speaking day'larda linkedLessonId yo'q?
5. Coverage % hisoblash
6. B1 split to'g'riligini tekshirish (39 → 21 B1 + 18 B1+)
```

---

## 7. To'liq Timeline (Ishlar ro'yxati)

| Faza | Vazifa | Status |
|------|--------|--------|
| **1** | `types.ts` yangilash | ✅ |
| **2** | A1 daily lesson ID'larini tekshirish | ✅ |
| **3** | A2 mapping aniqlandi | ✅ |
| **5** | 75 kunga `linkedLessonId` qo'shish | ✅ |
| **6** | B1 39 → 21+18 split (`cefr` label) | ✅ |
| **4** | B2 content (BATCH 1: unreal-past → hedging, days 76–82) | ✅ |
| **7** | Free↔Track sync implementation | ✅ |
| **8** | Validation script (`scripts/validate-speaking-grammar-map.ts`) | ✅ |
| **9** | Testlar (B2 uchun yangilangan) | ✅ |
| **10** | B2 content (BATCH 2: complex-prepositions → comprehensive-review) | ⏳ |
| **11** | Yakuniy review | ⏳ |

---

## 8. O'zgaradigan Fayllar

| Fayl | O'zgarish | Hajm |
|------|-----------|------|
| `src/data/speakingPath/types.ts` | ✅ CEFR, linkedLessonId, GrammarProgress | Done |
| `src/data/speakingPath/days.ts` | ✅ linkedLessonId + cefr label + B2 content (days 76–82) | ~3400 lines |
| `src/data/speakingPath/__tests__/speakingDays.test.ts` | ✅ CEFR_ORDER + B2 testlar qo'shildi | ~226 lines |
| `src/services/speakingPathService.ts` | ✅ extractGrammarFromTranscript + sync | +~200 lines |
| `scripts/validate-speaking-grammar-map.ts` | ✅ Validation script | ~200 lines |
| `package.json` | ✅ `validate:speaking` script qo'shildi | 1 line |

---

## 9. Files Reference

| Manba | Path | Tavsif |
|-------|------|--------|
| A1 daily lessons | `src/data/daily/a1Part1.ts` | alphabet-greetings, numbers, family, body-parts, etc. |
| A1 daily cont. | `src/data/daily/a1Part2.ts` | demonstratives, prepositions, adjectives, there-is-are, etc. |
| A2 daily lessons | `src/data/daily/a2Part1.ts` | modal-verbs, articles, prepositions, questions, etc. |
| A2 daily cont. | `src/data/daily/a2Part2.ts` | adjective-adverb, passive-voice, first-conditional, etc. |
| B1+ daily | `src/data/daily/b1plusPart1.ts` | narrative-tenses, participle-clauses, modal-perfects, etc. |
| B1+ daily cont. | `src/data/daily/b1plusPart2.ts` | collocations, phrasal-verbs, idioms, word-formation, etc. |
| B2 daily | `src/data/daily/b2Part1.ts` | unreal-past, advanced-conditionals, nominalization, etc. |
| B2 daily cont. | `src/data/daily/b2Part2.ts` | complex-sentences, advanced-modals, punctuation, etc. |
| B2 daily cont. | `src/data/daily/b2Part3.ts` | argument-structure, stance-markers, paraphrasing, etc. |
| B2 extra | `src/data/daily/b2Extra.ts` | inversion, cleft-sentences, advanced-passive, academic-vocab |
| Tenses | `src/data/tenses/tensesData.ts` | simple-present → future-perfect (A1→B1 tenses) |
| Speaking path | `src/data/speakingPath/days.ts` | 82 kun (A0=3, A1=15, A2=18, B1=21, B1+=18, B2=7) |
| Speaking types | `src/data/speakingPath/types.ts` | ✅ kengaytirilgan |
| Speaking prompts | `src/data/speakingPrompts.ts` | 99 prompt (A1=19, A2=23, B1=31, B1+=6, B2=20) |
| Service | `src/services/speakingPathService.ts` | Free↔Track sync (yozilishi kerak) |
| Index | `src/data/daily/lessonsIndex.ts` | Barcha daily lesson'lar metadata |
| Index | `src/data/daily/index.ts` | Re-export constants |

---

## 10. Next Steps (Keyingi qadam)

1. **So'rov 10** — B2 content BATCH 2 (complex-prepositions → b2-comprehensive-review = 18 kun)
2. **So'rov 11** — Yakuniy tekshiruv + testlar

> *Mukammal roadmap. Har bir qadam aniq, manbalar ko'rsatilgan, o'zgarish hajmi belgilangan.*
