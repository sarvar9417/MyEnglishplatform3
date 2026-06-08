# 🗣️ Speaking Path — To'liq Takomillashtirish Roadmap

> **Maqsad:** "Gapirish Yo'li" ni professional darajadagi speaking kursiga aylantirish
> **Jami kun:** 90 kun (hozir 75)
> **Jami feature:** ~40 ta
> **Darajalar:** A0 → A1 → A2 → B1 → B2

---

## 📋 **FAZA 1: Content Foundation (Kontent Asoslari)**
> *Eng muhim — pedagogik sifatni oshirish*

### 1.1 Spiral Curriculum — Vocabulary Recycling
- **Nima:** Har bir kun avvalgi kunlardan 2-3 chunkni recycled qiladi
- **Nega:** Duolingo va Babbel standardi — yangi so'zlarni unutmaslik
- **Fayllar:** `src/data/speakingPath/days.ts`, `src/data/speakingPath/types.ts`
- **Ish:** Har bir `SpeakingDay` ga `recycledChunks` maydoni qo'shish va `SpeakingDaySession` da ularni qayta ko'rsatish
- **Estimated:** 2-3 kun

### 1.2 Grammar Labels
- **Nima:** Har bir chunk ga grammatika izohi qo'shish (`"went = go ning o'tgan zamon shakli"`)
- **Nega:** Babbel usuli — foydalanuvchi nima uchun aynan shu shakl ishlatilganini tushunadi
- **Fayllar:** `src/data/speakingPath/types.ts` → `SpeakingChunk` ga `grammarTip?: string`
- **Foydalanish:** `SpeakStep` va `RecallPanel` da natijadan keyin ko'rsatish
- **Estimated:** 1 kun

### 1.3 Daily Pronunciation Focus
- **Nima:** Har bir kunda bitta tovushga e'tibor qaratish (masalan day 1: /h/ sound)
- **Nega:** ELSA Speak eng kuchli feature'i — fonema darajasida ishlash
- **Fayllar:** `src/data/speakingPath/types.ts` → `SpeakingDay` ga `pronunciationFocus` maydoni
- **UI:** `SpeakingDaySession` da ListenStep ga pronunciation tip qo'shish
- **Foydalanish:** `ShadowStep` da pronunciationFocus bilan analyzePronunciation ishlatish
- **Estimated:** 1 kun

### 1.4 Common Mistakes for Uzbek Learners
- **Nima:** O'zbeklar uchun tipik xatolarni oldindan ko'rsatish
- **Masalan:** "I **am** 20 years old" (am ni unutish), "I like play**ing**" (-ing ni unutish)
- **Nega:** ELSA Speak va Babbel standardi
- **Fayllar:** `src/data/speakingPath/types.ts` → `SpeakingChunk` ga `commonMistake?: string`
- **Estimated:** 1 kun

### 1.5 Just-in-Time Vocabulary
- **Nima:** Scenario uchun kerakli, lekin chunk larda yo'q so'zlarni qo'shimcha qilish
- **Masalan:** Day 6 scenario "lost tourist" → "lost" so'zini chunk larga qo'shish
- **Fayllar:** `src/data/speakingPath/days.ts` — scenario bilan chunk larni moslashtirish
- **Estimated:** 1 kun

### 1.6 Intonation & Stress Guides
- **Nima:** Qaysi so'zga urg'u berish kerakligini ko'rsatish
- **Masalan:** "How **ARE** you?" vs "I'm **FINE**, thank you"
- **Fayllar:** `src/data/speakingPath/types.ts` → `SpeakingChunk` ga `stressWord?: string`
- **UI:** `SpeakStep` da urg'u so'zini highlight qilish
- **Estimated:** 1 kun

---

## 📋 **FAZA 2: Content Expansion (Kontent Kengaytirish)**
> *Kontent hajmini va darajalarni to'ldirish*

### 2.1 A0 ni Kengaytirish (3 kun → 7 kun)
- **Hozir:** Kun 1-3 (faqat salomlashish, ism, yosh)
- **Yangi:** Kun 1-7
  - Day 1: Salomlashish (Hello, Goodbye, How are you)
  - Day 2: Ism va tanishish (My name is, Nice to meet you)
  - Day 3: Sonlar 1-10 (How many?, numbers)
  - Day 4: Ranglar (What colour?, red, blue, green)
  - Day 5: Oilam (mother, father, sister, brother)
  - Day 6: Mening narsalarim (This is my..., Whose)
  - Day 7: A0 Review Day (faqat recycled)
- **Fayllar:** `src/data/speakingPath/days.ts`
- **Estimated:** 2 kun

### 2.2 B1 ni Qayta Taqsimlash (39 kun → 28 kun)
- **Hozir:** Kun 37-75 — juda ko'p (39 kun)
- **Yangi:** Kun 37-64 — 28 kun
  - Formal situations (calls, meetings, interviews) → 10 kun
  - Opinions & discussions → 8 kun
  - Narratives & stories → 5 kun
  - Hypothetical & advanced → 5 kun
- **Fayllar:** `src/data/speakingPath/days.ts`
- **Estimated:** 3 kun

### 2.3 B2 Yangi Kontent (Kun 65-82)
- **Yangi daraja:** B2 — 18 kun
- **Mavzular:**
  - Debates & arguments (agreeing/disagreeing strongly)
  - Professional presentations
  - Complex problem-solving
  - Abstract ideas & concepts
  - Idiomatic expressions in conversation
  - Diplomacy & tactful language
  - Persuasion & negotiation
  - Giving detailed instructions
  - Expressing nuanced emotions
  - Cultural commentary
  - Current events discussion
  - Future scenarios & predictions (advanced)
  - Leadership & management talk
  - Giving constructive criticism
  - Handling difficult conversations
  - Storytelling with advanced vocabulary
  - B2 Review Day
  - B2 Graduation Day
- **Fayllar:** `src/data/speakingPath/days.ts` (yangi fayl: `daysB2.ts`)
- **Estimated:** 5-7 kun

### 2.4 Review Days (Har 10 kunda bir)
- **Nima:** Faqat avvalgi chunklarni recall qiladigan kunlar (yangi chunk yo'q)
- **Jami:** 8 ta review day (kun 8, 18, 28, 38, 48, 58, 68, 78)
- **Nega:** FSRS dan tashqari, content darajasida majburiy takrorlash
- **Fayllar:** `src/data/speakingPath/days.ts`
- **Estimated:** 1 kun

### 2.5 Graduation & Certificate
- **Nima:** 90-kunni tugatganda sertifikat va celebration
- **Fayllar:** `src/components/ui/Certificate.tsx` (allaqachon bor)
- **UI:** `SpeakingDaySession` da 90-kundan keyin `Certificate` komponentini ko'rsatish
- **Estimated:** 0.5 kun

---

## 📋 **FAZA 3: Session UX (Sessiya Tajribasi)**
> *4 qadamli sessiyani professional darajaga olib chiqish*

### 3.1 Warm-up Step
- **Nima:** ListenStep dan oldin 30 soniyalik warm-up
- **Kontent:** "Today we'll learn how to order at a cafe. What's your favourite drink?"
- **Fayllar:** `src/components/speakingPath/SpeakingDaySession.tsx`
- **UI:** Yangi `WarmupStep` komponenti
- **Estimated:** 0.5 kun

### 3.2 Cool-down Step
- **Nima:** ConverseStep dan keyin reflection
- **Kontent:** "Great job! Today you learned 6 new phrases. Can you remember...?"
- **Fayllar:** `src/components/speakingPath/SpeakingDaySession.tsx`
- **UI:** `CooldownStep` komponenti + chunk recall mini-quiz
- **Estimated:** 0.5 kun

### 3.3 Mastery Check (Har 5 kunda)
- **Nima:** 5-kunning oxirida avvalgi 5 kun bo'yicha mini-test
- **Format:** 5-10 ta random chunk → recall qilish
- **Fayllar:** `src/components/speakingPath/MasteryCheck.tsx` (yangi)
- **UI:** `SpeakStep` ga o'xshash, lekin random chunklar bilan
- **Estimated:** 1 kun

### 3.4 Audio Waveform Visualization
- **Nima:** Ovoz yozishda waveform ko'rsatish
- **Nega:** ELSA Speak standardi — foydalanuvchi o'z ovozini vizual ko'radi
- **Fayllar:** `src/components/speaking/AudioPlayback.tsx` ni kengaytirish
- **Yangi:** `WaveformPlayer.tsx` komponenti
- **Estimated:** 1.5 kun

### 3.5 Filler Word Detection
- **Nima:** STT transcript dan "um", "uh", "like", "you know" ni aniqlash
- **Nega:** Professional speaking tool standard feature'i
- **Fayllar:** `src/utils/fillerDetection.ts` (yangi)
- **UI:** `SpeakingMetricsPanel` da ko'rsatish
- **Estimated:** 0.5 kun

### 3.6 Recording Level Indicator
- **Nima:** Mikrofon darajasini real-time ko'rsatish
- **Fayllar:** `src/components/speakingPath/MicButton.tsx` ni kengaytirish
- **UI:** `useAudioAnalyser` hook dan foydalanish
- **Estimated:** 0.5 kun

---

## 📋 **FAZA 4: Analytics & Progress (Tahlil va Progress)**
> *Foydalanuvchi o'z progressini vizual ko'rishi*

### 4.1 Progress Chart (Recharts)
- **Nima:** Speaking score trend grafigi (haftalik/oylik)
- **Nega:** Eng muhim missing feature — `recharts` npm da bor, ishlatilmagan
- **Fayllar:**
  - `src/components/speakingPath/SpeakingProgressChart.tsx` (yangi)
  - `src/pages/SpeakingPath.tsx` → dashboard ga qo'shish
- **Chartlar:**
  - Score trend (hafta bo'yicha o'rtacha score)
  - Minutes trend (kuniga gapirilgan daqiqa)
  - Chunks mastered growth
  - Streak timeline
- **Estimated:** 2 kun

### 4.2 Speaking Heatmap
- **Nima:** GitHub contribution heatmap uslubida speaking faollik
- **Fayllar:** `src/components/speakingPath/SpeakingHeatmap.tsx` (yangi)
- **UI:** Kalendar ko'rinishida har kunning rangi
- **Estimated:** 1.5 kun

### 4.3 SRS Visualization
- **Nima:** Foydalanuvchi FSRS holatini ko'radi
- **Ko'rsatkichlar:**
  - Stability distribution (bar chart)
  - Due chunks timeline (next 7 days)
  - Mastery level per chunk
- **Fayllar:** `src/components/speakingPath/SrsDashboard.tsx` (yangi)
- **Estimated:** 1.5 kun

### 4.4 Weekly/Monthly Report
- **Nima:** Avtomatik "Haftalik hisobot" — o'tgan haftaga nisbatan progress
- **Fayllar:** `src/components/speakingPath/WeeklyReport.tsx` (yangi)
- **Estimated:** 1 kun

### 4.5 Error History Page
- **Nima:** Foydalanuvchi pronunciationErrorService dan o'z xatolarini ko'radi
- **Fayllar:**
  - `src/pages/PronunciationErrors.tsx` (yangi)
  - `src/App.tsx` → route qo'shish
- **Estimated:** 1 kun

### 4.6 Goal Setting
- **Nima:** Foydalanuvchi kunlik/ haftalik speaking maqsad qo'yadi
- **Masalan:** "Kuniga 15 daqiqa gapirish", "Haftada 5 kun"
- **Fayllar:** `src/components/speakingPath/GoalSetting.tsx` (yangi)
- **Estimated:** 1 kun

---

## 📋 **FAZA 5: Features & Gamification**
> *O'yin elementlari va qo'shimcha feature'lar*

### 5.1 Speaking Achievements
- **Nega:** 10+ ta speaking uchun maxsus yutuq
- **Fayllar:** `src/data/achievements.ts`
- **Yutuqlar:**
  - "First Words" — 1-kun tugatildi
  - "7-Day Streak" — 7 kun ketma-ket speaking
  - "30-Day Streak" — 30 kun ketma-ket
  - "Chunk Master" — 50 chunk mastered
  - "Perfect Day" — 90%+ score bilan kun
  - "Conversation Starter" — 10 ta suhbat
  - "B1 Graduate" — B1 darajasi tugatildi
  - "B2 Graduate" — B2 darajasi tugatildi
  - "Early Bird" — 5 kun ertalab speaking
  - "Night Owl" — 5 kun kechqurun speaking
- **Estimated:** 1 kun

### 5.2 Daily Speaking Reminders
- **Nega:** `useNotifications` hook bor, speaking uchun ishlatilmagan
- **Fayllar:** `src/components/notifications/StreakWarning.tsx` → speaking variant
- **Push:** "Bugun 15 daqiqa speaking qilishni unutmang!"
- **Estimated:** 0.5 kun

### 5.3 Tandem Integration
- **Nima:** Do'st bilan speaking challenge
- **Featurelar:**
  - Duo speaking duel (kim ko'proq gapirdi)
  - Combined streak (ikkala do'st speaking qilsa)
  - Weekly speaking competition
- **Fayllar:** `src/pages/TandemPage.tsx`, `src/services/tandemService.ts`
- **Estimated:** 3 kun

### 5.4 Onboarding Tutorial
- **Nima:** SpeakingPath ni birinchi marta ishlatganda tutorial
- **Fayllar:** `src/components/onboarding/` ga qo'shish
- **Estimated:** 1 kun

### 5.5 Offline Mode Indicator
- **Nima:** Offline bo'lganida "Speaking Path offline ishlaydi" xabari
- **Fayllar:** `src/pages/SpeakingPath.tsx`
- **Estimated:** 0.5 kun

---

## 📋 **FAZA 6: UI/UX Polish**
> *Vizual va interaktiv sifatni oshirish*

### 6.1 Better Loading States
- **Nima:** Barcha transition lar uchun skeleton loading
- **Fayllar:** `src/components/speakingPath/*.tsx`
- **Estimated:** 1 kun

### 6.2 Dark Mode Fixes
- **Nima:** `FreePractice.tsx` va `ConverseStep.tsx` da dark mode tuzatish
- **Estimated:** 0.5 kun

### 6.3 i18n — English va Russian
- **Nima:** Barcha SpeakingPath matnlarini `en.json` va `ru.json` ga qo'shish
- **Fayllar:** `src/i18n/en.json`, `src/i18n/ru.json`
- **Matnlar:** title, subtitle, goalUz, scenario matnlari, button label lar
- **Estimated:** 1.5 kun

### 6.4 Performance — Lazy Load
- **Nima:** 75 kunlik narvonni lazy load qilish (virtualization)
- **Fayllar:** `src/components/speakingPath/SpeakingLadder.tsx`
- **Estimated:** 1 kun

### 6.5 Micro-interactions
- **Nima:** Hover/click animatsiyalar, haptic feedback
- **Fayllar:** `src/components/speakingPath/*.tsx`
- **Estimated:** 1 kun

---

## 📋 **FAZA 7: Technical Improvement**
> *Code arxitekturasi va testlar*

### 7.1 Content Tests
- **Nima:** `days.ts` uchun validation testlar
- **Testlar:**
  - Har bir chunk da `en`, `uz` bor
  - Har bir chunk `id` unikal
  - Review day larda chunks.length === 0
  - Barcha `pattern` lar to'g'ri formatda
  - `day` raqamlari ketma-ket
  - `cefr` to'g'ri
- **Fayllar:** `src/data/speakingPath/__tests__/days.test.ts` (yangi)
- **Estimated:** 0.5 kun

### 7.2 Component Tests
- **Nima:** Mavjud testlarni to'ldirish (hozir 9 ta test fayl)
- **Fayllar:** `src/components/speakingPath/__tests__/*`
- **Estimated:** 1.5 kun

### 7.3 Semantic Matching Improvement
- **Nima:** `src/utils/semanticMatch.ts` ni yaxshilash
- **Qo'shimchalar:**
  - Uzbek-specific sinonimlar
  - Better word order detection
  - Common grammar error tolerance (am/are/is)
- **Estimated:** 1 kun

### 7.4 Pronunciation Service Enhancement
- **Nima:** `pronunciationErrorService` ni kengaytirish
- **Qo'shimchalar:**
  - "Most improved sounds" (haftalik)
  - "Worst sounds" ranking
  - Personalized drill recommendations
- **Estimated:** 1 kun

---

## ⏳ **JAMI VAQT VA PRIORITETLAR**

| Prioritet | Faza | Ish | Kun |
|:---------:|:----:|-----|:---:|
| 🔴 **P0** | 1.1 | Spiral curriculum | 2-3 |
| 🔴 **P0** | 1.2 | Grammar labels | 1 |
| 🔴 **P0** | 1.3 | Daily pronunciation focus | 1 |
| 🔴 **P0** | 4.1 | Progress chart (Recharts) | 2 |
| 🔴 **P0** | 5.1 | Speaking achievements | 1 |
| 🔴 **P0** | 3.1 | Warm-up step | 0.5 |
| 🔴 **P0** | 3.2 | Cool-down step | 0.5 |
| 🟠 **P1** | 2.1 | A0 expansion (3→7 kun) | 2 |
| 🟠 **P1** | 2.2 | B1 redistribution (39→28 kun) | 3 |
| 🟠 **P1** | 2.3 | B2 content (18 kun) | 5-7 |
| 🟠 **P1** | 2.4 | Review days | 1 |
| 🟠 **P1** | 1.4 | Common mistakes | 1 |
| 🟠 **P1** | 1.6 | Intonation guides | 1 |
| 🟠 **P1** | 4.2 | Speaking heatmap | 1.5 |
| 🟠 **P1** | 5.2 | Daily reminders | 0.5 |
| 🟠 **P1** | 6.3 | i18n English/Russian | 1.5 |
| 🟠 **P1** | 3.3 | Mastery check | 1 |
| 🟠 **P1** | 4.3 | SRS visualization | 1.5 |
| 🟡 **P2** | 2.5 | Certificate | 0.5 |
| 🟡 **P2** | 3.4 | Waveform visualization | 1.5 |
| 🟡 **P2** | 3.5 | Filler word detection | 0.5 |
| 🟡 **P2** | 4.4 | Weekly report | 1 |
| 🟡 **P2** | 4.5 | Error history page | 1 |
| 🟡 **P2** | 5.3 | Tandem integration | 3 |
| 🟡 **P2** | 5.4 | Onboarding tutorial | 1 |
| 🟡 **P2** | 1.5 | Just-in-time vocabulary | 1 |
| 🟢 **P3** | 4.6 | Goal setting | 1 |
| 🟢 **P3** | 5.5 | Offline indicator | 0.5 |
| 🟢 **P3** | 6.1 | Loading states | 1 |
| 🟢 **P3** | 6.2 | Dark mode fixes | 0.5 |
| 🟢 **P3** | 6.4 | Performance lazy load | 1 |
| 🟢 **P3** | 6.5 | Micro-interactions | 1 |
| 🟢 **P3** | 7.1 | Content tests | 0.5 |
| 🟢 **P3** | 7.2 | Component tests | 1.5 |
| 🟢 **P3** | 7.3 | Semantic matching | 1 |
| 🟢 **P3** | 7.4 | Pronunciation service | 1 |
| | **JAMI** | | **~45-55 kun** |

---

## 🚀 **BOSQICHMA-BOSQICH REJA**

### 1-bosqich: "Pedagogik Asos" (7-10 kun)
> *Kontent sifatini oshirish + eng muhim feature'lar*
- 1.1 Spiral curriculum
- 1.2 Grammar labels
- 1.3 Daily pronunciation focus
- 1.4 Common mistakes
- 5.1 Speaking achievements
- 3.1 Warm-up
- 3.2 Cool-down

### 2-bosqich: "Kontent Kengaytma" (10-14 kun)
> *Yangi kontent va darajalar*
- 2.1 A0 expansion
- 2.2 B1 redistribution
- 2.3 B2 content
- 2.4 Review days
- 2.5 Certificate

### 3-bosqich: "Analytics Dashboard" (5-7 kun)
> *Foydalanuvchi progressni vizual ko'rishi*
- 4.1 Progress chart
- 4.2 Heatmap
- 4.3 SRS visualization
- 4.4 Weekly report
- 4.5 Error history
- 4.6 Goal setting

### 4-bosqich: "Sessiya Tajribasi" (4-6 kun)
> *Sessiyani professional darajaga olib chiqish*
- 3.3 Mastery check
- 3.4 Waveform
- 3.5 Filler detection
- 3.6 Recording level indicator
- 1.5 Just-in-time vocab
- 1.6 Intonation guides

### 5-bosqich: "Gamification & Integratsiya" (5-7 kun)
> *O'yin elementlari va tandem*
- 5.2 Reminders
- 5.3 Tandem integration
- 5.4 Onboarding
- 5.5 Offline indicator

### 6-bosqich: "UI/UX Polish" (4-5 kun)
> *Vizual va texnik sifat*
- 6.1 Loading states
- 6.2 Dark mode
- 6.3 i18n
- 6.4 Performance
- 6.5 Micro-interactions
- 7.1-7.4 Tests & tech debt

---

## 📐 **TYPES UPDATES (Arxitektura o'zgarishlari)**

```typescript
// src/data/speakingPath/types.ts — yangi maydonlar

export interface SpeakingChunk {
  id: string
  en: string
  uz: string
  ipa?: string
  pattern?: string
  // YANGI:
  grammarTip?: string          // "Went = go ning o'tgan zamon shakli"
  commonMistake?: string       // "I go → I WENT (go emas!)"
  stressWord?: string          // "ARE" — urg'u beriladigan so'z
  recycledFrom?: string[]      // ["sp-d1-c2"] — qaysi kundan recycleda
}

export interface PronunciationFocus {
  sound: string                // "θ"
  ipaExample: string           // "/θ/ - think, three, thank"
  tipUz: string                // "Tilingizni tishlaringiz orasiga qo'ying"
  tipEn: string                // "Place your tongue between your teeth"
  commonError?: string         // "O'zbeklar /θ/ ni /s/ yoki /t/ bilan almashtiradi"
}

export interface SpeakingDay {
  // ... existing fields
  pronunciationFocus?: PronunciationFocus  // YANGI
  recycledChunkIds?: string[]              // YANGI
  isReviewDay?: boolean                    // YANGI (faqat recycled chunklar)
}
```

---

> **Keyingi qadam:** 1-bosqichdan boshlaymiz — Spiral curriculum + Grammar labels + Pronunciation focus
