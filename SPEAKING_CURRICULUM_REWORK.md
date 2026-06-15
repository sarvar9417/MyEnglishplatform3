# Speaking Path — To'liq Curriculum Qayta Tashkil Qilish

> **Maqsad:** Har bir CEFR darajasini (A1, A2, B1, B1+, B2) speakingda tugatganda, foydalanuvchi shu darajadagi **barcha grammar qoidalar, daily lessons va lug'atni** gapirib o'zlashtirgan bo'lishi kerak.
>
> **Asosiy tamoyil:** Mavjud speaking kunlari saqlanadi, faqat **gap bo'lgan kunlar** qo'shiladi va **review kunlari** qo'shiladi.
>
> **Hozirgi holat:** Committed 75 kunga +4 A2 kun qo'shildi (79 kun). Barcha 79 kunga `linkedLessonId` ulandi (100% coverage).

---

## 1. Hozirgi Holat (Verified from Codebase)

### 1.1. Speaking Path — 79 kun, 4 daraja

| Daraja | Kunlar | Kun raqamlari | Label |
|--------|--------|---------------|-------|
| A0 | 3 | 1–3 | Boshlang'ich |
| A1 | 15 | 4–18 | Asosiy |
| A2 | 22 | 19–40 | O'rta |
| B1 | 39 | 41–79 | Yuqori o'rta |
| **Jami** | **79** | | |

> Eslatma: Committed fayl (75 kun, A0-B1) asosida ishlanmoqda. B1+/B2 darajalari hali qo'shilmagan.

### 1.2. Daily Lessons — 100 content + 26 review = 126 ta

| Daraja | Content | Review | Jami |
|--------|---------|--------|------|
| A1 | 23 | 4 | 27 |
| A2 | 21 | 5 | 26 |
| B1 | 18 | 4 | 22 |
| B1+ | 16 | 5 | 21 |
| B2 | 22 | 8 | 30 |
| **Jami** | **100** | **26** | **126** |

### 1.3. Grammar Topics — 36 ta

| Daraja | Soni | ID'lar |
|--------|------|--------|
| A1 | 8 | verb-to-be, have-got, can-cannot, present-simple-i-you-we-they, present-simple-he-she, there-is-there-are, question-words, basic-prepositions |
| A2 | 8 | comparatives-superlatives, first-conditional, present-continuous, past-simple, future-forms, there-is-there-are, possessives, some-any-no-every |
| B1 | 7 | second-conditional, present-perfect, passive-voice, reported-speech, relative-clauses, gerunds-infinitives, first-conditional-full |
| B1+ | 3 | third-conditional, wish-if-only, advanced-modals |
| B2 | 10 | inversion, mixed-conditionals, advanced-passive, cleft-sentences, advanced-relative-clauses, advanced-reported-speech, advanced-wish-if-only, phrasal-verbs, linking-devices, hedging-stance |

### 1.4. Vocabulary — 354 ta seed word

| Daraja | So'zlar |
|--------|---------|
| A1 | 219 |
| A2 | 44 |
| B1 | 52 |
| B1+ | 19 |
| B2 | 20 |

### 1.5. Muammolar va Yechilganlar

| # | Muammo | Holat |
|---|--------|-------|
| 1 | **A1:** 15 kun bor, 23 lesson kerak → 8 ta lesson covered emas | ⏳ hali qo'shilmagan |
| 2 | **A2:** 18 kun bor, 21 lesson kerak → 4 ta yangi kun qo'shildi (37-40) | ✅ 4/3 bajarildi |
| 3 | **B1:** 39 kun bor (keragidan 16 ta ortiq) → split B1+/B2 | ⏳ committed faylda B1 yagona |
| 4 | **Review kunlari yo'q** → 0 ta spiral review | ⏳ hali yo'q |
| 5 | **`linkedLessonId` yetishmaydi** → content bog'lanmagan | ✅ 79/79 (100%) |

---

## 2. Maqsadli Holat

### 2.1. Prinsip

```
Har bir daily lesson  =  1 ta speaking kuni (6 chunk bilan)
Har 5-6 content kundan keyin  =  1 ta review kuni (spiral recycling)
Har bir daraja tugallanganda  =  100% grammar + vocabulary coverage
```

### 2.2. Daraja maqsadlari

| Daraja | Content Kunlari | Review Kunlari | Jami | Coverage |
|--------|-----------------|----------------|------|----------|
| A0 | 3 | 0 | 3 | ✅ 100% |
| A1 | 23 | 3 | 26 | ✅ 100% |
| A2 | 21 | 3 | 24 | ✅ 100% |
| B1 | 21 | 2 | 23 | ✅ 100% |
| B1+ | 18 | 2 | 20 | ✅ 100% |
| B2 | 25 | 4 | 29 | ✅ 100% |
| **Jami** | **111** | **14** | **125** | |

### 2.3. Farq (Hozirgi → Maqsadli)

| Daraja | Hozirgi | Maqsadli | Farq |
|--------|---------|----------|------|
| A0 | 3 | 3 | 0 |
| A1 | 15 | 26 | **+11** |
| A2 | 18 | 24 | **+6** |
| B1 | 39 | 23 | **-16** (18 kun B1+ ga o'tkaziladi) |
| B1+ | 18 | 20 | **+2** |
| B2 | 25 | 29 | **+4** |
| **Jami** | **118** | **125** | **+7** |

---

## 3. Har Bir Daraja Uchun To'liq Reja

### 3.1. A0 — 3 kun (o'zgarishsiz)

| Kun | Mavzu | linkedLessonId | Status |
|-----|-------|----------------|--------|
| 1 | Salomlashish va tanishish | — | ✅ mavjud |
| 2 | O'zingiz haqingizda | — | ✅ mavjud |
| 3 | Raqamlar, yosh, telefon | — | ✅ mavjud |

---

### 3.2. A1 — 26 kun (15 → 26, +11 kun)

#### Mavjud kunlar (saqlanadi, kun 4–18)

| Kun | Mavzu | linkedLessonId | Grammar |
|-----|-------|----------------|---------|
| 4 | Kafede buyurtma | `alphabet-greetings` | be (am/is/are) |
| 5 | Do'konda xarid | `numbers-1-100` | be + from/live |
| 6 | Yo'l so'rash | `prepositions-of-place` | prepositions of place |
| 7 | Vaqt va uchrashuv | `time-routines` | prepositions of time |
| 8 | Oila va do'stlar | `family` | possessive 's, my/your/his/her |
| 9 | Kundalik tartib | `simple-present` | present simple |
| 10 | Kichik suhbat | `alphabet-greetings` | be + adjective |
| 11 | Sevimli mashg'ulot | `food-drinks` | like + gerund |
| 12 | Ovqat va ichimlik | `food-drinks` | some/any |
| 13 | Ranglar va narsalar | `colors-shapes` | this/that/these/those |
| 14 | Uy va xonalar | `there-is-are` | there is/are |
| 15 | Hayvonlar | `animals` | have got |
| 16 | Kiyim | `clothes` | adjectives |
| 17 | Hislar va kayfiyat | `basic-adjectives` | how are you |
| 18 | Maktab va o'qish | `time-routines` | simple present (review) |

#### Yangi content kunlar (+8)

| Kun | Mavzu | linkedLessonId | Grammar Point | Tushuntirish |
|-----|-------|----------------|---------------|--------------|
| 19 | Have got / Has got | `have-got` | have got / has got | A1 grammar topic, hali covered emas |
| 20 | Can / Can't | `can-cant` | can / can't | A1 grammar topic |
| 21 | Present Continuous | `present-continuous` | am/is/are + V-ing | A1 daily lesson |
| 22 | Simple Past (irregular) | `simple-past` | V2 (went, saw, ate) | A1 daily lesson |
| 23 | Simple Future (will) | `simple-future` | will + V1 | A1 daily lesson |
| 24 | Question Words | `question-words` | what/where/when/who/how | A1 grammar topic |
| 25 | conjunctions (and, but, or) | `conjunctions` | and, but, or, because | A1 daily lesson |
| 26 | Body Parts | `body-parts` | have got (review) | A1 daily lesson |

#### Review kunlar (+3)

| Kun | Mavzu | Qamrab olinadigan kunlar | Tarkibi |
|-----|-------|--------------------------|---------|
| R1 | A1 Review 1 | kun 4–13 | 12 ta recycled chunk + 12 ta yangi gap |
| R2 | A1 Review 2 | kun 14–18 + yangi kunlar | 12 ta recycled chunk + 12 ta yangi gap |
| R3 | A1 Final Review | barcha A1 | 18 ta mixed chunk + AI scenario |

#### A1 Yakuniy Tartib

```
kun 4–18:   mavjud 15 kun (saqlanadi)
kun 19–26:  yangi 8 content kun
kun R1–R3:  3 ta review kun
Jami:       26 kun
```

---

### 3.3. A2 — 26 kun (18 → 22 content + 4 review, +4 kun qo'shildi)

#### Mavjud kunlar (saqlanadi, kun 19–36)

| Kun | Mavzu | linkedLessonId | Grammar |
|-----|-------|----------------|---------|
| 19 | Yoqtirish/yoqtirmaslik | ✅ `gerunds-infinitives` | like + V-ing / to + V |
| 20 | Kecha nima qildingiz | ✅ `simple-past` | past simple (regular) |
| 21 | Kelajak rejalar | ✅ `present-continuous-future` | going to |
| 22 | Muammo/shikoyat | ✅ `modal-verbs` | can/could/may |
| 23 | Telefon suhbati | ✅ `prepositions` | prepositions (review) |
| 24 | Restoranda suhbat | ✅ `articles` | a/an/the |
| 25 | Aeroportda | ✅ `questions` | question forms |
| 26 | Mehmonxonada | ✅ `there-is-are` | there is/are (review) |
| 27 | Shifokorda | ✅ `have-got` | have got (review) |
| 28 | Ob-havo/kiyim | ✅ `adjective-adverb` | adjective vs adverb |
| 29 | Kiyim do'konida | ✅ `demonstratives` | this/that/these/those |
| 30 | Ishda tanishtirish | ✅ `present-perfect` | have/has + V3 |
| 31 | Bo'sh vaqt rejalari | ✅ `present-continuous-future` | present continuous for future |
| 32 | Bayram/tabrik | ✅ `possessives` | my/your/his/her/its |
| 33 | Jamoat transporti | ✅ `quantifiers` | much/many/a lot of |
| 34 | Bank/pochta | ✅ `countable-uncountable` | countable vs uncountable |
| 35 | Xaridni qaytarish | ✅ `modal-verbs` | must/have to/should |
| 36 | Fikr bildirish | ✅ `so-such` | gerunds vs infinitives |

#### Yangi content kunlar (+4) — ✅ QO'SHILDI

| Kun | Mavzu | linkedLessonId | Grammar Point |
|-----|-------|----------------|---------------|
| 37 | Comparatives/Superlatives | ✅ `comparatives-superlatives` | -er than, more than, as...as |
| 38 | Passive Voice | ✅ `passive-voice` | Present/Past Passive |
| 39 | Reported Speech | ✅ `reported-speech` | Say/Tell, backshift |
| 40 | Some/Any/No/Every | ✅ `some-any-no-every` | compounds, double negative |

#### Review kunlar (+4) — ⏳ hali qo'shilmagan

| Kun | Mavzu | Qamrab olinadigan kunlar |
|-----|-------|--------------------------|
| R4 | A2 Review 1 | kun 19–27 |
| R5 | A2 Review 2 | kun 28–40 |
| R6 | A2 Final Review | barcha A1+A2 mixed |
| R7 | A2 Speaking yakuniy | barcha A2 |

#### A2 Yakuniy Tartib

```
kun 19–36:  mavjud 18 kun (saqlanadi)
kun 37–40:  yangi 4 content kun (✅ bajarildi)
kun R4–R7:  4 ta review kun (⏳)
Jami:       26 kun
```

---

### 3.4. B1 — 23 kun (39 → 23, -16 kun ajratiladi)

#### Muammo
- Hozirgi B1 da 39 kun bor (kun 37–57 + kun 101–118)
- Kun 37–57 (21 kun) haqiqiy B1 content
- Kun 101–118 (18 kun) aslida B1+ bo'lishi kerak

#### Yangi tartib

| Kun | Mavzu | linkedLessonId | Grammar |
|-----|-------|----------------|---------|
| 37 | Rasmiy telefon so'rovi | `modal-verbs` | must/have to/should (review) |
| 38 | Rozilik va e'tiroz | `questions` | question forms (review) |
| 39 | Taklif qabul/rad | `modal-verbs` | could/would like |
| 40 | Tajriba (Present Perfect) | `present-perfect` | have/has + V3 (review) |
| 41 | Uchrashuv kelishish | `time-prepositions` | at/on/in (time) |
| 42 | Maslahat (should/could) | `modal-verbs` | should/could/might |
| 43 | Rejalar/orzular | `first-conditional` | if + present, will + V1 |
| 44 | Sabab/natija | `conjunctions` | because/so/therefore |
| 45 | Intervyu asoslari | `questions` | question forms (advanced) |
| 46 | Bankda hisob | `countable-uncountable` | much/many/a lot of (review) |
| 47 | Pochtada | `prepositions` | prepositions (review) |
| 48 | Kvartira ijarasi | `there-is-there-are` | there is/are (review) |
| 49 | Ish suhbati | `present-perfect` | present perfect (review) |
| 50 | Texnik yordam | `modal-verbs` | can/could (polite) |
| 51 | Sayohat rejasi | `first-conditional` | if + present, will + V1 |
| 52 | Restoranda shikoyat | `modal-verbs` | I want to/I'd like to |
| 53 | Dorixonada | `countable-uncountable` | some/any (review) |
| 54 | Sport/sog'liq | `gerunds-infinitives` | enjoy + V-ing, want + to V |
| 55 | Film/kitob | `present-perfect` | ever/never + V3 |
| 56 | Yangiliklar | `verb-patterns` | verb + gerund/infinitive |
| 57 | Atrof-muhit | `modal-verbs` | should/shouldn't |

#### Review kunlar (+2)

| Kun | Mavzu | Qamrab olinadigan kunlar |
|-----|-------|--------------------------|
| R7 | B1 Review 1 | kun 37–47 |
| R8 | B1 Review 2 | kun 48–57 + barcha B1 |

#### B1 Yakuniy Tartib

```
kun 37–57:  mavjud 21 kun (saqlanadi)
kun R7–R8:  2 ta review kun
Jami:       23 kun
```

**Eslatma:** Kun 101–118 (18 kun) B1+ ga o'tkaziladi.

---

### 3.5. B1+ — 20 kun (18 → 20, +2 kun)

#### Mavjud kunlar (saqlanadi, kun 58–75)

| Kun | Mavzu | linkedLessonId | Grammar |
|-----|-------|----------------|---------|
| 58 | Texnologiya/tarmoq | `narrative-tenses-b1plus` | past simple/continuous/perfect |
| 59 | Ta'lim/o'rganish | `infinitive-gerund-advanced-b1plus` | to V vs V-ing (advanced) |
| 60 | Pul/byudjet | `collocations-make-do-have-take-b1plus` | collocations |
| 61 | Ish-hayot muvozanati | `concession-b1plus` | although/even though |
| 62 | Madaniy farqlar | `idioms-common-b1plus` | common idioms |
| 63 | Ishda kelishuv | `reporting-verbs-b1plus` | say/tell/ask + object |
| 64 | Taqdimot | `linking-words-advanced-b1plus` | however/furthermore/moreover |
| 65 | Kelishmovchilik | `determiners-advanced-b1plus` | each/every/all/both |
| 66 | Hikoya aytish | `narrative-tenses-b1plus` | storytelling tenses |
| 67 | Taxmin/ehtimollik | `modal-perfects-b1plus` | might/could/should + have + V3 |
| 68 | Afsus/o'tmish | `ellipsis-substitution-b1plus` | I wish I had... |
| 69 | Faraziy holatlar | `participle-clauses-b1plus` | V-ing/Ved clauses |
| 70 | Tavsiya/did | `infinitive-gerund-advanced-b1plus` | recommend/suggest + V-ing |
| 71 | Shahar/qishloq | `prepositional-phrases-b1plus` | in terms of, on behalf of |
| 72 | Kelajak bashorati | `word-formation-b1plus` | suffixes: -tion, -ment, -ness |
| 73 | Kuchli/zaif tomon | `emphasis-does-b1plus` | do/does/did + V1 |
| 74 | Maqsad/motivatsiya | `collocations-make-do-have-take-b1plus` | collocations (review) |
| 75 | Yakuniy taqdimot | — |综合 |

#### Qo'shimcha kunlar (kun 101–118 dan o'tkaziladi)

| Kun | Mavzu | linkedLessonId | Grammar |
|-----|-------|----------------|---------|
| 76 | Technology debate | `narrative-tenses-b1plus` | past tenses (review) |
| 77 | Education systems | `infinitive-gerund-advanced-b1plus` | to V vs V-ing (review) |
| 78 | Money management | `collocations-make-do-have-take-b1plus` | collocations (review) |
| 79 | Work-life debate | `concession-b1plus` | although/even though (review) |
| 80 | Cultural exchange | `idioms-common-b1plus` | idioms (review) |
| 81 | Workplace negotiation | `reporting-verbs-b1plus` | reported speech (review) |
| 82 | Presentation Q&A | `linking-words-advanced-b1plus` | linking words (review) |
| 83 | Conflict resolution | `determiners-advanced-b1plus` | determiners (review) |
| 84 | Storytelling contest | `narrative-tenses-b1plus` | narrative tenses (review) |
| 85 | Speculation debate | `modal-perfects-b1plus` | modal perfects (review) |
| 86 | Regret discussion | `ellipsis-substitution-b1plus` | ellipsis (review) |
| 87 | Hypothetical planning | `participle-clauses-b1plus` | participle clauses (review) |
| 88 | Recommendation exchange | `infinitive-gerund-advanced-b1plus` | gerunds/infinitives (review) |
| 89 | City vs village debate | `prepositional-phrases-b1plus` | prepositional phrases (review) |
| 90 | Future predictions | `word-formation-b1plus` | word formation (review) |
| 91 | Strengths/weaknesses | `emphasis-does-b1plus` | emphasis (review) |
| 92 | Purpose discussion | `collocations-make-do-have-take-b1plus` | collocations (review) |
| 93 | Final presentation | — | 综合 |

#### Review kunlar (+2)

| Kun | Mavzu | Qamrab olinadigan kunlar |
|-----|-------|--------------------------|
| R9 | B1+ Review 1 | kun 58–75 |
| R10 | B1+ Review 2 | kun 76–93 + barcha B1+ |

#### B1+ Yakuniy Tartib

```
kun 58–75:   mavjud 18 kun (saqlanadi)
kun 76–93:   18 kun (kun 101–118 dan o'tkaziladi)
kun R9–R10:  2 ta review kun
Jami:        20 kun (content) + 2 kun (review) = 22 kun
```

**Eslatma:** Kun 101–118 dagi 18 kun B1+ ga o'tkaziladi, lekin ularning 8 tasi review sifatida qayta tashkil etiladi.

---

### 3.6. B2 — 29 kun (25 → 29, +4 kun)

#### Mavjud kunlar (saqlanadi, kun 76–100)

| Kun | Mavzu | linkedLessonId | Grammar |
|-----|-------|----------------|---------|
| 76 | Unreal Past (wish/if only) | `unreal-past-b2` | wish/if only + V2 |
| 77 | Advanced Conditionals | `advanced-conditionals-b2` | mixed conditionals |
| 78 | Future Perfect Continuous | `future-perfect-continuous` | will have been V-ing |
| 79 | Nominalization | `nominalization-b2` | verb → noun (-tion, -ment) |
| 80 | Subjunctive Mood | `subjunctive-b2` | if I were... / I suggest he go |
| 81 | Advanced Passive | `advanced-passive-b2` | passive + modals / perfect |
| 82 | Hedging | `hedging-b2` | it seems/might/perhaps |
| 83 | Complex Prepositions | `complex-prepositions-b2` | in spite of / on account of |
| 84 | Cohesion | `cohesion-b2` | linking paragraphs |
| 85 | Register | `register-b2` | formal vs informal |
| 86 | Complex Sentences | `complex-sentences-b2` | noun/relative/adverbial clauses |
| 87 | Advanced Modals | `advanced-modals-b2` | must have/could have/should have |
| 88 | Contrastive Structures | `contrastive-structures-b2` | whereas/while/although |
| 89 | Inversion | `inversion-b2` | Never have I seen... |
| 90 | Cleft Sentences | `cleft-sentences-b2` | It is... that... / What... is |
| 91 | Punctuation | `punctuation-b2` | semicolons, colons, dashes |
| 92 | Academic Collocations | `academic-collocations-b2` | conduct research, draw conclusions |
| 93 | Academic Vocabulary | `academic-vocabulary-b2` | academic word list |
| 94 | Critical Thinking | `critical-thinking-b2` | evaluating arguments |
| 95 | Argument Structure | `argument-structure-b2` | thesis, evidence, counterargument |
| 96 | Stance Markers | `stance-markers-b2` | I believe/It is clear that |
| 97 | Paraphrasing | `paraphrasing-b2` | rewriting without changing meaning |
| 98 | Advanced Verb Patterns | `advanced-verb-patterns-b2` | complex verb + complement |
| 99 | B2 Review | `b2-review` | mixed review |
| 100 | B2 Comprehensive Review | `b2-comprehensive-review` | IELTS prep |

#### Review kunlar (+4)

| Kun | Mavzu | Qamrab olinadigan kunlar |
|-----|-------|--------------------------|
| R11 | B2 Review 1 | kun 76–82 |
| R12 | B2 Review 2 | kun 83–90 |
| R13 | B2 Review 3 | kun 91–98 |
| R14 | B2 Final Review | barcha B1+B2 mixed |

#### B2 Yakuniy Tartib

```
kun 76–100:  mavjud 25 kun (saqlanadi)
kun R11–R14: 4 ta review kun
Jami:        29 kun
```

---

## 4. Yakuniy Hisob

| Daraja | Eski Kunlar | Yangi Content | Review | **Jami** |
|--------|-------------|---------------|--------|----------|
| A0 | 3 | 0 | 0 | **3** |
| A1 | 15 | +8 | +3 | **26** |
| A2 | 18 | +3 | +3 | **24** |
| B1 | 21 | 0 | +2 | **23** |
| B1+ | 18 | 0 | +2 | **20** |
| B2 | 25 | 0 | +4 | **29** |
| **Jami** | **100** | **+11** | **+14** | **125** |

**Kun raqamlari:**
```
A0:   kun 1–3        (3 kun)
A1:   kun 4–29       (26 kun)
A2:   kun 30–53      (24 kun)
B1:   kun 54–76      (23 kun)
B1+:  kun 77–96      (20 kun)
B2:   kun 97–125     (29 kun)
Jami: kun 1–125      (125 kun)
```

---

## 5. Implementation Bosqichlari

### Bosqich 1: Foundation (1–2 hafta)

| # | Task | Fayl | Tavsif | Holat |
|---|------|------|--------|-------|
| 1.1 | Kun raqamlarini qayta tashkil etish | `src/data/speakingPath/days.ts` | 75→79 kun (+4 A2): A0=3, A1=15, A2=22, B1=39 | ✅ |
| 1.2 | `linkedLessonId` larni qo'shish | `src/data/speakingPath/days.ts` | 79/79 (100%) | ✅ |
| 1.3 | `cefr` label larni to'g'rilash | `src/data/speakingPath/days.ts` | A2: 19-40, B1: 41-79 | ✅ |
| 1.4 | `index.ts` helper larni yangilash | `src/data/speakingPath/index.ts` | `getDaysByLevel()` va helper'lar | ✅ |
| 1.5 | Validation script yangilash | `scripts/validate-speaking-grammar-map.ts` | 100% coverage, B1+/B2 dead code tozalandi | ✅ |

### Bosqich 2: A1 Content (2–3 hafta)

| # | Kun | Mavzu | linkedLessonId | Chunks |
|---|-----|-------|----------------|--------|
| 2.1 | 19 | Have got / Has got | `have-got` | 6 |
| 2.2 | 20 | Can / Can't | `can-cant` | 6 |
| 2.3 | 21 | Present Continuous | `present-continuous` | 6 |
| 2.4 | 22 | Simple Past | `simple-past` | 6 |
| 2.5 | 23 | Simple Future | `simple-future` | 6 |
| 2.6 | 24 | Question Words | `question-words` | 6 |
| 2.7 | 25 | Conjunctions | `conjunctions` | 6 |
| 2.8 | 26 | Body Parts | `body-parts` | 6 |

**Har bir kun tarkibi:**
```typescript
{
  day: number,
  cefr: 'A1',
  title: string,           // o'zbekcha mavzu
  subtitle: string,        // qisqa tavsif
  goalUz: string,          // "Bu kun oxirida nima qila olasiz"
  estMinutes: 12,
  linkedLessonId: string,  // daily lesson ID
  grammarPoint: string,    // grammar punkt nomi
  vocab: VocabItem[4],     // 4 ta vocabulary
  pronunciationFocus: PronunciationFocus,
  recycledChunkIds: string[],  // oldingi kunlardan 2-3 ta chunk
  chunks: SpeakingChunk[6],    // 6 ta yangi chunk
  scenario: SpeakingScenario   // AI suhbat stsenariysi
}
```

### Bosqich 3: A2 Content (1–2 hafta)

| # | Kun | Mavzu | linkedLessonId | Chunks |
|---|-----|-------|----------------|--------|
| 3.1 | 37 | Comparatives/Superlatives | `comparatives-superlatives` | 6 | ✅ |
| 3.2 | 38 | Passive Voice | `passive-voice` | 6 | ✅ |
| 3.3 | 39 | Reported Speech | `reported-speech` | 6 | ✅ |
| 3.4 | 40 | Some/Any/No/Every | `some-any-no-every` | 6 | ✅ |

### Bosqich 4: Review Days (2–3 hafta)

| # | Kun | Daraja | Qamrab olinadigan kunlar | Chunks |
|---|-----|--------|--------------------------|--------|
| 4.1 | R1 | A1 | kun 4–13 | 12 recycled + 12 yangi |
| 4.2 | R2 | A1 | kun 14–18 + yangi | 12 recycled + 12 yangi |
| 4.3 | R3 | A1 | barcha A1 | 18 mixed |
| 4.4 | R4 | A2 | kun 19–27 | 12 recycled + 12 yangi |
| 4.5 | R5 | A2 | kun 28–36 + yangi | 12 recycled + 12 yangi |
| 4.6 | R6 | A2 | barcha A1+A2 | 18 mixed |
| 4.7 | R7 | B1 | kun 37–47 | 12 recycled + 12 yangi |
| 4.8 | R8 | B1 | kun 48–57 | 12 recycled + 12 yangi |
| 4.9 | R9 | B1+ | kun 58–75 | 12 recycled + 12 yangi |
| 4.10 | R10 | B1+ | kun 76–93 | 12 recycled + 12 yangi |
| 4.11 | R11 | B2 | kun 76–82 | 12 recycled + 12 yangi |
| 4.12 | R12 | B2 | kun 83–90 | 12 recycled + 12 yangi |
| 4.13 | R13 | B2 | kun 91–98 | 12 recycled + 12 yangi |
| 4.14 | R14 | B2 | barcha B1+B2 | 18 mixed |

**Review kun tarkibi:**
```typescript
{
  day: number,
  cefr: string,
  title: string,           // "A1 Review 1" / "B2 Final Review"
  subtitle: string,        // "Kun 4–13 dan recycled chunks"
  goalUz: string,          // "Oldingi kunlardagi jumlalarni takrorlang"
  estMinutes: 15,
  isReviewDay: true,       // ← MUHIM: review kuni belgisi
  recycledChunkIds: [...],  // 12-18 ta recycled chunk
  chunks: SpeakingChunk[6], // 6 ta yangi gap (oldingi grammar bilan)
  scenario: SpeakingScenario // AI scenario (mixed topic)
}
```

### Bosqich 5: Testing (1 hafta)

| # | Task | Kriteriya | Holat |
|---|------|-----------|-------|
| 5.1 | Coverage validation | Har bir daily lesson → speaking kun bilan bog'langan (100%) | ✅ |
| 5.2 | TypeScript check | 0 error | ✅ |
| 5.3 | Lint check | 0 error | ⏳ |
| 5.4 | Unit testlar | Barcha mavjud testlar o'tadi | ✅ |
| 5.5 | Component testlar | SpeakingLadder, SpeakingDaySession | ⏳ |
| 5.6 | Manual QA | Har bir daraja bosqichma-bosqich tekshiriladi | ⏳ |

---

## 6. Timeline

| Bosqich | Davomiylik | Sana |
|---------|-----------|------|
| 1. Foundation | 1–2 hafta | — |
| 2. A1 Content | 2–3 hafta | — |
| 3. A2 Content | 1–2 hafta | — |
| 4. Review Days | 2–3 hafta | — |
| 5. Testing | 1 hafta | — |
| **Jami** | **7–11 hafta** | |

---

## 7. Natija

### Foydalanuvchi tajribasi:

```
A0 (kun 1–3)      → 3 kun, asosiy salomlashish
A1 (kun 4–29)     → 26 kun, barcha A1 grammar + vocabulary
A2 (kun 30–53)    → 24 kun, barcha A2 grammar + vocabulary
B1 (kun 54–76)    → 23 kun, barcha B1 grammar + vocabulary
B1+ (kun 77–96)   → 20 kun, barcha B1+ grammar + vocabulary
B2 (kun 97–125)   → 29 kun, barcha B2 grammar + vocabulary + IELTS prep
```

### Har bir daraja tugallanganda:

- ✅ Barcha grammar qoidalarini gapirib o'zlashtirgan
- ✅ Barcha lug'atni ishlatishni bilgan
- ✅ Spiral review orqali mustahkamlangan
- ✅ AI scenario bilan real hayotda qo'llay olagan
- ✅ Pronunciation fokusida tovushlarni to'g'ri aytgan

---

## 8. Fayl Tuzilishi

```
src/data/speakingPath/
├── types.ts                    // SpeakingDay, SpeakingChunk, etc.
├── index.ts                    // helper functions
├── days.ts                     // 125 kun (asosiy kontent)
└── __tests__/
    └── speakingDays.test.ts    // data integrity tests

src/services/
├── speakingPathService.ts      // SRS, progress, Free↔Track sync
└── __tests__/
    └── speakingPathService.test.ts

src/components/speakingPath/
├── SpeakingLadder.tsx          // CEFR zone display
├── SpeakingDaySession.tsx      // 6-step daily session
├── FreePractice.tsx            // Free mode
└── steps/
    ├── WarmupStep.tsx
    ├── ListenStep.tsx
    ├── ShadowStep.tsx
    ├── SpeakStep.tsx
    ├── ConverseStep.tsx
    └── CooldownStep.tsx

scripts/
└── validate-speaking-grammar-map.ts  // coverage validation
```
