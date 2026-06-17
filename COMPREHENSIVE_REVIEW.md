# EnglishPath — 6 Nafardan Chuqur Tanqidiy Tahlil

**Sana:** 2026-06-17
**Tahlilchilar:** Ingliz tili o'qituvchisi · O'zbek tili o'qituvchisi · Web-dizayner · Database mutaxassisi · Platforma tahlilchisi · Oddiy o'quvchi

---

## JADVAL: Umumiy ballar

| Nafardan | Ball | Eng kuchli tomon | Eng zaif tomon |
|---|---|---|---|
| 🎓 Ingliz tili o'qituvchisi | **7.9/10** | Grammatik aniqlik (9/10) | Mashq turi balansi (7/10) |
| 🇺🇿 O'zbek tili o'qituvchisi | **8.3/10** | Tushuntirishlar sifati (9/10) | Terminologiya izchilligi (7/10) |
| 🎨 Web-dizayner | **7.4/10** | Yuklanish holatlari (8.5/10) | Accesibility (5/10) |
| 🗄️ Database mutaxassisi | **5.0/10** | IndexedDB migratsiyasi (7/10) | Xavfsizlik (4/10) |
| 📱 Platforma tahlilchisi | **8.05/10** | Gapirish mashqi (8.5/10) | Baholash tizimi (6.5/10) |
| 👦 Oddiy o'quvchi | **6.5/10** | Birinchi dars tarkibi (8/10) | Tezlik (5/10) |
| **O'RTACHA** | **7.2/10** | | |

---

## 🔴 JIDDIY MUAMMOLAR (P0 — darhol tuzatish kerak)

### 1. XAVFSIZLIK: 28 ta jadvalda RLS yo'q
**Manba:** Database mutaxassisi (4/10)
**Muammo:** `daily_progress`, `lesson_progress`, `vocabulary`, `vocabulary_progress`, `writings`, `mock_tests` kabi 28 ta jadvalda Row Level Security yo'q. Har qanday autentifikatsiyalangan foydalanuvchi boshqa foydalanuvchilar ma'lumotlarini o'qishi/yozishi mumkin.
**Xavf:** Boshqa foydalanuvchilarning ilgari yozgan yozma ishlari, mock test natijalari, lug'at ma'lumotlari o'g'irlanishi mumkin.
**Tuzatish:** Supabase Dashboard → Table → Enable RLS → CREATE POLICY for all 28 tables.

### 2. O'QUVCHI: Birinchi dars juda og'ir
**Manba:** Oddiy o'quvchi (6.5/10)
**Muammo:** 1-dars: alphabet + greetings + introductions + am/is/are + vaqtga qarab salomlashish + keng tarqalgan xatolar = 4+ mavzu. 20 ta mashq + 15 ta test + reading + listening + writing + speaking. Yangi boshlovchi uchun juda ko'p.
**Tuzatish:** 1-darsni 3 kichik darsga bo'lish: 1) Faqat alifbo (A-Z), 2) Faqat salomlar, 3) Tanishuv.

### 3. ACCESIBILITY: Quruq qoldirilgan
**Manba:** Web-dizayner (5/10)
**Muammolar:**
- Emoji-larga `aria-label` yo'q (Dashboard dagi 🔥📚)
- Toast bildirishnomalarda `aria-live` yo'q
- LevelUpCelebration da `role="dialog"` yo'q
- HeartsIndicator va LevelUpCelebration da hardcoded o'zbek matnlari (i18n emas)
- Skip link hardcoded (i18n emas)
**Tuzatish:** Har bir emoji ga aria-label, Toast ga aria-live, dialog larga role, hardcoded matnlarni i18n ga o'tkazish.

### 4. SYNC: Offline yozishlar yo'qoladi
**Manba:** Database mutaxassisi
**Muammo:** Supabase ga yozish muvaffaqiyatsiz bo'lsa, ma'lumot butunlay yo'qoladi (faqat log yoziladi). Offline navbat (queue) yo'q. Qayta urinish (retry) logikasi yo'q.
**Tuzatish:** IndexedDB da offline queue jadvali yaratish, tarmoq tiklanganda qayta yuborish.

---

## 🟡 MUHIM MUAMMOLAR (P1 — 1-2 hafta ichida)

### 5. Mashq turi balansi: MC hali 49.4%
**Manba:** Ingliz tili o'qituvchisi
**Muammo:** MC 49.4% — audit 49% dan kamaytirishni talab qilgan. Passage 2.4%, Connection 3.3%, Vocab 1.4% — hali kam.
**Tuzatish:** Qo'shimcha 100 ta produktiv mashq qo'shish (passage/connection/vocab-match).

### 6. Dashboard haddan tashqari to'yingan
**Manba:** Oddiy o'quvchi
**Muammo:** Dashboard da 13+ bo'lim: Start Lesson, Speaking Path, Skill Rings, Lesson Progress, Review, WeakSpots, AdaptivePlan, AiInsights, Tandem, DailyIdiom, ConfusablePairs, StoryBeat, ProgressMap. Yangi boshlovchi uchun chalg'itadi.
**Tuzatish:** Dashboard ni 2 ga bo'lish: "Bugungi dars" (asosiy) va "Barchasi" (kichik tab). Boshlang'ich foydalanuvchilarga faqat 3-4 bo'lim ko'rsatish.

### 7. N+1 so'rovlar — sekinlik
**Manba:** Database mutaxassisi
**Muammolar:**
- `pushWordsToSRS`: har bir so'z uchun 2 ta so'rov (200 so'z = 400 so'rov)
- `delayConfusablePartners`: har bir so'z uchun 3 ta so'rov
- `fetchAllLessonProgress`: barcha qatorlarni yuklaydi (limit yo'q)
**Tuzatish:** Batch so'rovlar: `.in('english', [...])` operatori bilan.

### 8. Komponent hajmi — mega-fayllar
**Manba:** Web-dizayner
**Muammolar:**
- `Dashboard.tsx`: 681 qator, 8 ta inline komponent
- `Grammar.tsx`: 891 qator, 7+ ta inline komponent
- `Sidebar.tsx`: desktop/mobile takrorlash
**Tuzatish:** Har bir mega-komponentni 3-5 ta kichik komponentga ajratish.

### 9. Ingliz tili darajalari tushuntirilmagan
**Manba:** Oddiy o'quvchi
**Muammo:** Onboarding da "A1", "A2+", "B1", "B2" ko'rsatiladi, lekin bu nima deganini tushuntirmaydi. 16 yoshli o'quvchi uchun bu tartibsiz harflar.
**Tuzatish:** Har bir daraja uchun oddiy tavsif: "A1 = Boshlang'ich", "B2 = Yuqori".

### 10. Terminologiya nomuvofiq
**Manba:** O'zbek tili o'qituvchisi
**Muammolar:**
- `uz.json:10,11`: "Akkount" vs "Akkaunt" — bir xil so'z turlicha yozilgan
- `uz.json:149`: "Harfiy" — gerund uchun noto'g'ri atama
- `uz.json:237,537`: "streak", "Grammar" — tarjima qilinmagan
**Tuzatish:** Barcha atamalarni standartlashtirish.

---

## 🟢 YAXSHILASH KERAK (P2 — 1-2 oy)

### 11. Tedlik darajasi
**Manba:** Web-dizayner
**Muammo:** `text-[10px]` va `text-[11px]` 40+ marta ishlatilgan. WCAG minimumi 12px.
**Tuzatish:** Barcha kichik matnlarni `text-xs` (12px) ga o'zgartirish.

### 12. prefers-reduced-motion yo'q
**Manba:** Web-dizayner
**Muammo:** Konfetti, silkish, burst animatsiyalari vestibulyar buzilishi bo'lgan foydalanuvchilarga zararli bo'lishi mumkin.
**Tuzatish:** CSS da `@media (prefers-reduced-motion: reduce)` qo'shish.

### 13. Tab uslublari xilma-xil
**Manba:** Web-dizayner
**Muammo:** 3 xil tab uslubi: underline (VocabHub), pill (Profile), pill (LearnHub).
**Tuzatish:** 1-2 xil tab uslubiga standartlashtirish.

### 14. Ma'lumotlar validatsiyasi yo'q
**Manba:** Database mutaxassisi
**Muammo:** Foydalanuvchi kiritgan ma'lumotlar tekshirilmaydi: ball 0-100 oralig'ida ekanligi, satr uzunligi, enum qiymatlari.
**Tuzatish:** Zod yoki io-ts bilan validatsiya qatlamini qo'shish.

### 15. Dual type tizimi
**Manba:** Database mutaxassisi
**Muammo:** `database.ts` va `supabase.ts` ikki xil type tizimini defining qiladi.
**Tuzatish:** Bittasini o'chirib, faqat avtomatik generatsiya qilingan `supabase.ts` ishlatish.

### 16. O'zbek → English transfer xatolari kam
**Manba:** Ingliz tili o'qituvchisi
**Muammo:** Artikllar (a/the) bo'yicha mashqlar yetishmayapti. O'zbek tilida artikllar yo'q — bu eng katta transfer muammosi.
**Tuzatish:** A1 darajada artikllar darsini qo'shish.

### 17. Inspekt qilinmagan yozma ishlar
**Manba:** Platforma tahlilchisi
**Muammo:** Writing da rubrika (baholash mezonlari) ko'rsatilmagan. Talaba nima uchun baholanishini bilmaydi.
**Tuzatish:** Yozishdan oldin rubrika ko'rsatish.

### 18. Inson ovozi yo'q
**Manba:** Platforma tahlilchisi
**Muammo:** TTS (text-to-speech) ishlatilgan. Raqobatchilar professional ovoz aktyorlaridan foydalanadi.
**Tuzatish:** Kamida A1-A2 daraja uchun professional ovoz yozib olish.

---

## ⚪ KICHIK MUAMMOLAR (P3 — vaqt bo'lganda)

| # | Muammo | Manba |
|---|---|---|
| 19 | A1 exerciseSections ID lari haqiqiy ID larga mos kelmaydi | Ingliz tili o'qituvchisi |
| 20 | 9 PM = evening / night nomuvofiq | Ingliz tili o'qituvchisi |
| 21 | "please" so'zi A1 lug'atida yo'q | Ingliz tili o'qituvchisi |
| 22 | B2 da British/American farqlari kam | Ingliz tili o'qituvchisi |
| 23 | Dark mode 340+ qator CSS override | Web-dizayner |
| 24 | Breadcrumb navigatsiya yo'q | Web-dizayner |
| 25 | Backend da backup/recovery strategiyasi yo'q | Database mutaxassisi |
| 26 | IELTS to'liq mock test yo'q | Platforma tahlilchisi |
| 27 | Video kontent yo'q | Platforma tahlilchisi |
| 28 | Browser kengaytmasi yo'q | Platforma tahlilchisi |
| 29 | Smart watch integratsiyasi yo'q | Platforma tahlilchisi |
| 30 | Haftalik email xulosa yo'q | Platforma tahlilchisi |

---

## ✅ PLATFORMANING ENG KUCHLI TOMONLARI

| # | Kuchli tomon | Ball |
|---|---|---|
| 1 | FSRS-5 algoritmi — Anki darajasidagi takrorlash tizimi | 9/10 |
| 2 | Gapirish mashqi — 6 qadamli tizim (Review→Warmup→Listen→Shadow→Speak→Converse) | 8.5/10 |
| 3 | Tandem tizimi — juftlik seriyasi, haftalik Duel, AI Roleplay Duo | 8.5/10 |
| 4 | Gamification — XP, Streak, Yuraklar, Ligalar, Kundalik topshiriqlar | 8.5/10 |
| 5 | AI integratsiyasi — Claude bilan gapirish, yozish, grammatika tahlili | 8/10 |
| 6 | O'zbek tiliga tarjima — 1196 qator, yuqori sifat | 8.3/10 |
| 7 | Grammatik aniqlik — 10+ darajadan namuna tekshirildi, xato topilmadi | 9/10 |
| 8 | Keng tarqalgan xatolar — L1 transfer muammolari yaxshi qoplangan | 9/10 |
| 9 | Yuklanish holatlari — Skeleton tizimi, sahifa yuklanish animatsiyalari | 8.5/10 |
| 10 | Hikoya yo'li — Toshkentdan Londonga sayohat (motivatsiya) | 8/10 |

---

## 📋 BOSQICHA REJA

### Bosqich 1: Xavfsizlik + Asosiy (1-3 kun)
1. 28 ta jadvalga RLS qo'shish
2. Offline sync queue yaratish
3. N+1 so'rovlarini batch qilish

### Bosqich 2: O'quvchi tajribasi (1 hafta)
4. 1-darsni 3 ga bo'lish
5. Dashboard ni soddalashtirish
6. "Zero English" rejimini qo'shish
7. Barcha ingliz matnlarni o'zbekchaga tarjima qilish
8. Hint tugmasini qo'shish

### Bosqich 3: Sifat yaxshilash (2 hafta)
9. Komponentlarni ajratish (Dashboard, Grammar, Sidebar)
10. Accessibility tuzatishlari
11. Tedlik minimal 12px ga oshirish
12. prefers-reduced-motion qo'shish
13. Tab uslublarini standartlashtirish

### Bosqich 4: Kontent (1-2 oy)
14. Qo'shimcha 100 ta produktiv mashq
15. Artikllar darsini A1 ga qo'shish
16. Terminologiyani standartlashtirish
17. Writing rubrikasini qo'shish
18. A1-A2 uchun professional ovoz

---

## YAKUNIY XULOSA

EnglishPath **7.2/10** — yaxshi platforma, lekin mukammal emas.

**Eng kuchli:** FSRS-5, gapirish mashqi, AI integratsiyasi, gamification — bunlarning barchasi raqobatchilar darajasida yoki undan yuqori.

**Eng zaif:** Xavfsizlik (RLS yo'q), o'quvchi tajribasi (og'ir darslar), accessibility — bu jiddiy muammolar.

**Tengsiz xususiyatlar:** FSRS-5 speaking chunks da, AI Roleplay Duo, Hot Seat Duel, Tandem Pair Streak — bular hech qanday platformada yo'q.

**Maqsad:** P0 muammolarni tuzatish → P1 ni 1 hafta ichida → P2 ni 1 oy ichida → P3 ni vaqt bo'lganda.
