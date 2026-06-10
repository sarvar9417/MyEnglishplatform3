# EnglishPath Platform — Ko'p Nuqtai Nazardan Chuqur Tahlil

> **Tahlilchilar:** Ingliz tili ustozi · Dasturchi · O'zbek tili ustozi · Yangi boshlovchi · Faylasuf · Tadbirkor · Yodlash olimi
> **Tahlil sanasi:** 2026-06-09
> **Daraja:** A1 → B2, 90+ kun, 106 asosiy dars + 17 takrorlash darsi = 123 dars
> **Eslatma:** `tahlil-xulosa.md` ning 6 nuqtai nazardan tahlili (Ingliz ustozi, Dasturchi, O'zbek ustozi, Yangi boshlovchi, Faylasuf, Yodlash olimi) ushbu faylga integratsiya qilindi — 2026-06-10

---

## 1. PROFESSINAL INGLIZ TILI USTOZI NUQTAI NAZARI

### ✅ Kuchli tomonlari

**Strukturaviy to'g'rilik:**
Darslar CEFR qatlamlanishiga asosan qurilgan — A1 dan B2 gacha mantiqan ketma-ket. Har bir darsda: `formulas → rules → vocabulary → specialCases → exercises → tests` — bu "Presentation → Practice → Production" pedagogik modeliga to'g'ri keladi.

**Ko'p qirrali mashq turlari:**
`fill-blank`, `multiple-choice`, `error-correction`, `transformation` — to'rtta turli mashq turi bilimni passiv tanib olishdan aktiv ishlatishga ko'taradi. Error-correction xususan qimmatli: talaba nafaqat to'g'risini biladi, balki noto'g'risini ham tahlil qiladi.

**SpecialCases + Drills:**
`mnemonic` va `commonMistakes` maydoni pedagogik jihatdan maqtovga loyiq. Masalan, `"I AM, He/She/It IS, You/We/They ARE"` — bu formula talabaning xato qilishi mumkin bo'lgan aniq nuqtalarni nishonga oladi.

**B1–B2 darajasidagi uyg'unlik:**
`b1Part1.ts` dagi Future Forms darsi 8 ta qoidani chuqur tushuntiradi — Present Simple for Future ni vaqt gaplarida (when/if) to'g'ri qo'llash kabi nozik farqlar ham yoritilgan. Bu ko'p platformalarda e'tibordan qoladi.

### ❌ Kamchiliklari

**1. Produktiv ko'nikmalar integratsiyasi zaif:**
Grammatika darslari asosan retseptiv (o'qish/tanlash) mashqlar. Har bir darsda kamida bitta `speaking prompt` (og'zaki gap tuzish) va `writing task` (yozma ishlatish) bo'lishi kerak. Hozir `writing` va `speaking` alohida tab, grammatika mashqlaridan uzilgan.

**Misol:** B1 "Future Forms" darsi 8 ta qoida, 20 mashq, lekin birorta ham "Bugun kechqurun nima qilasiz? Uchta gapda yozing" tipidagi produktiv mashq yo'q.

**2. Kontekstga asoslangan mashqlar yetishmayapti:**
Mashqlarning ~80% izolyatsiyalangan jumlalar. Til o'rganish tadqiqotlari ko'rsatadiki, kontekst (matn, dialog, vaziyat) ichidagi mashqlar uzoqroq esda qoladi. 

**Tavsiya:** Har bir darsga 2–3 ta "mini passage" (3–5 jumlali matncha) qo'shib, o'sha matn ichidan `fill-blank` mashqlari yasash.

**3. CEFR A1 va A2 o'rtasidagi tafovut keskin:**
A1 ning oxirgi darslari (kiyim, tana a'zolari) bilan A2 ning birinchi darslari (Modal verbs) o'rtasida katta sakrash bor. A1 oxiriga `Simple Past` kiritilishi A2 ga tayyorgarlik uchun zarur edi.

**4. Mashq soni tengsizligi:**
- A1 Alphabet darsi: 41 mashq (juda ko'p)
- A1 ba'zi darslari: 20–25 mashq (o'rtacha)
- B2 ba'zi darslari: 25 mashq (B2 uchun kam — murakkab fikrlash talab etadi)

**Tavsiya:** B2 darajada har bir dars 35–40 mashqdan kam bo'lmasin, chunki akademik til murakkab.

**5. "Inkor" bo'lim nomi semantik xato:**
A1 darslari (sonlar, ranglar, hayvonlar) uchun "🚫 Inkor" bo'lim nomi noto'g'ri — bu bo'limlarda aslida negation mashqlari emas, balki kengaytirilgan leksika mashqlari bor. Masalan, "Asosiy sonlar" darsida Section 4 = "Inkor" — bu esa o'quvchini chalg'itadi.

**6. Formallik darajasi nomuvofiq:**
Ba'zi A2 mashqlar "What time does the shop close?" — bu B1 darajasidagi leksika ishlatadi. Exercises va vocabulary words o'rtasidagi daraja nazorati yo'q.

**7. Talaffuz ko'rsatmasi yo'q:**
`/ey/`, `/bi:/`, `/si:/` kabi fonetik transkriptsiyalar A1 darsida bor, lekin mashqlar ichida talaffuz tekshiruvi yo'q. Web Speech API mavjud, lekin faqat Speaking Path da.

---

## 2. PROFESSIONAL DASTURCHI NUQTAI NAZARI

### ✅ Kuchli tomonlari

**Zamonaviy tech stack:**
React 18 + TypeScript 5 + Vite 5 + Tailwind CSS + Zustand + Supabase — 2024–2025 yil uchun optimal tanlov. Ayniqsa Zustand persist + slices arxitekturasi state boshqaruvini toza saqlagan.

**FSRS-5 algoritmi:**
`src/lib/srs.ts` da FSRS-5 (Free Spaced Repetition Scheduler) to'liq implementatsiya qilingan — 19 ta og'irlik parametri, stability va difficulty hisoblash. Bu professional daraja — ko'p startuplar oddiygina Leitner tizimini ishlatadi.

**Offline-first arxitektura:**
Dexie (IndexedDB wrapper) + Supabase sync — internet uzilganda ham ishlaydi. PWA manifest + Service Worker — installable. Bu O'zbekiston kabi internet beqaror bo'lgan joylarda kritik muhim.

**AI integratsiya:**
Claude API Vercel serverless orqali proxy — client-side API key ochiq emas. `checkDailyExerciseAnswers` transformation mashqlarni AI bilan tekshiradi — boshqa platformalarda yo'q.

### ❌ Kamchiliklari

**1. Kontent TypeScript fayllarida — KATTA MUAMMO:**
```
src/data/daily/a1Part1.ts   — ~1600 qator
src/data/daily/b1Part1.ts   — ~4000+ qator
src/data/daily/b2Part3.ts   — ~3500+ qator
```
106 ta darsning ma'lumotlari TypeScript fayllarida hardcode qilingan. Bu degani:
- Mazmun tahrirlash uchun dasturchi kerak
- Git history faqat kontent o'zgarishlari bilan to'lib ketadi
- IDE sekinlashadi (4000 qatorli fayllarni parse qilish)
- Type-check vaqti ortadi
- CMS yo'q — kontent menejeri ishlata olmaydi

**Tavsiya:** Supabase da `lessons` jadvali allaqachon bor — kontent to'liq CMS ga ko'chirilsin. Faqat `seed-supabase.ts` orqali emas, permanent storage sifatida.

**2. Exercise ID lari qo'lda boshqariladi:**
```typescript
{ id: 1401, ... }
{ id: 1402, ... }
...
{ id: 1420, ... }
```
ID collision xavfi real. Shu session davomida `a2Part1.ts` da `id:1110` duplikati topildi va tuzatildi. Auto-increment yoki UUID kerak.

**Tavsiya:** `generateId()` utility yoki UUID: `crypto.randomUUID()`.

**3. Build ogohlantirishlari:**
```
Circular chunk: vendor -> react-vendor -> vendor
Dynamic import + static import aralashuvi (supabase.ts, useStore.ts)
```
Bu production da bundle size va load time muammolariga olib kelishi mumkin. `vendor` va `react-vendor` circular dependency — bundles to'g'ri split qilinmagan.

**4. `normalize-sections.ts` skriptidagi regex xatosi:**
Shu session da aniqlandi: `'Boshlang\'ich'` (escaped apostrophe) uchun regex `'[^']*'` notog'ri ishladi — `"Boshlang'ich"ich'` kabi buzilgan satrlar paydo bo'ldi. Bu production da ma'lumotlar buzilishiga olib kelgan edi.

**Tavsiya:** Har qanday lexer-level parse uchun `(?:[^'\\]|\\.)*` patternini ishlatish.

**5. Test coverage past:**
```
src/components/tandem/__tests__/  — 6 ta test fayli
src/components/speakingPath/__tests__/ — 4 ta test fayli
src/data/daily/                    — NOLYA test!
```
106 darsning ma'lumotlari uchun hech qanday test yo'q. `id` uniqueness, `blanks` count va `question` ichida `___ ` sonining mos kelishi tekshirilmaydi.

**6. exerciseSections.ids va exercises.id lar mos kelmasligi:**
```typescript
exerciseSections: [
  { ids: [1411, 1413, 1416, 1417, 1419] }  // Section 5 — duplicate IDs
]
exercises: [
  { id: 1411, ... }  // Section 3 da ham bor
]
```
Section 5 ("O'zgartirish") da Section 3 va 4 ning IDlari takrorlangan — bu "aralash sinov" sifatida qilingan, lekin progress tracking da ikki marta hisoblanadi.

**7. Supabase seed har safar 106 darsni yuklaydi:**
```typescript
// seed-supabase.ts
for (const batch of batches) {
  await supabase.from('lessons').upsert(batch)
}
```
Incremental diff yo'q — har safar barcha 106 dars upsert qilinadi. 1 ta darsni o'zgartirish uchun butun 106 ta dars yuboriladi.

---

## 3. PROFESSIONAL O'ZBEK TILI USTOZI NUQTAI NAZARI

### ✅ Kuchli tomonlari

**O'zbek tilida tushuntirishlar:**
Grammatika qoidalari va mashq tushuntirishlari o'zbek tilida — bu O'zbek foydalanuvchilari uchun psixologik to'siqni kamaytiradi. "I am → I'm → Men ..." kabi parallel struktura — o'quvchi ona tilida tushunadi.

**Xato tahlili (commonMistakes):**
O'zbek tillik o'quvchilarning xos xatolari qayd etilgan:
- "I am Ali ismim" → "My name is Ali" 
- "Where are you from? = Qayerda yashaysan?" (noto'g'ri tarjima)
Bu O'zbek ona tili interferentsiyasini hisobga olish — metodologik jihatdan to'g'ri.

### ❌ Kamchiliklari

**1. Murojaat shakli nomuvofiqlik:**
Ba'zi mashqlar `"Siz"` (rasmiy), ba'zilari `"sen"` (norasmiy) ishlatadi. Bir platformada izchillik bo'lishi kerak.

**Misol:**
```
"Qandaysiz?" (rasmiy "siz" shakli) — A1 darsi
"Ismingiz nima?" (rasmiy)
"O'zgartiring" (buyruq mayli — neytral)
```
Ammo ba'zi tushuntirishlarda: "Men 20 yoshdaman" — "men" kirill harfida emas, lotin harfida, bu esa Kirillcha yozayotgan foydalanuvchilar uchun noqulay.

**2. O'zbek grammatikasiga asoslanmagan tushuntirishlar:**
```
"I am → I'm (apostrof bilan qisqartma)"
```
O'zbek tilida apostrof tushunchasi yo'q — bu nima ekanini alohida tushuntirish kerak.

**3. Ba'zi tushuntirishlar juda qisqa:**
```typescript
explanation: "She + is"
explanation: "I + am"  
```
Bu texnik jihatdan to'g'ri, lekin pedagogik jihatdan yetarli emas. "Nega She + is?" degan savol javobsiz qoladi.

**Tavsiya:** Eng muhim 20–30 ta tushuntirish uchun to'liq Uzbek izoh yozilsin:
"She — uchinchi shaxs birlik (3rd person singular), shuning uchun 'is' ishlatiladi, 'are' emas."

**4. "Inkor" terminini noto'g'ri qo'llash:**
O'zbek tilida "inkor" = "negation" (rad etish). Lekin platformada "Inkor" bo'limi sonlar, ranglar, hayvonlar darslarining 4-bo'limi sifatida ishlatiladi — bu mantiqan noto'g'ri. "Qo'shimcha" yoki "Kengaytirish" deyilsa to'g'riroq bo'lar edi.

**5. Lug'at tarjimalari ba'zan noaniq:**
```
'fine' → "yaxshi"  (sifat, lekin "yaxshi" o'zbek tilidagi "good" ham)
'well' → "yaxshi, sog'-salomat"  (bir xil)
'good' → "yaxshi"  (sifat)
```
"Fine", "well", "good" — uchtalasi ham "yaxshi" deb tarjima qilingan. Farqlar: `fine` = qoniqarli (mediocre), `well` = sog'liq jihatdan, `good` = sifat jihatdan yaxshi. Bu farq tushuntirilmagan.

---

## 4. INGLIZ TILIDAN HECH NARSANI BILMAYDIGAN ODDIY ODAM NUQTAI NAZARI

### Birinchi kun tajribasi (A1, Kun 1):

**"Alphabet & Greetings" — Qabul:**
✅ Birinchi darsda oddiy, foydali narsa — salomlashish. Darhol ishlatish mumkin.
✅ "Hello, my name is..." — herculean boshlang'ich emas, haqiqiy hayotda kerak.
✅ Ikonalar va ranglar — "🌱 Boshlang'ich" deyilsa, "Men yangi boshlovchiman, bu men uchun" deb tushunadi.

**Muammolar:**

❓ **"VOWEL" va "CONSONANT" nima?** — A1 ning birinchi darsida grammatik termin. Oddiy odam uchun bu so'zlar ingliz tilida ham, o'zbek tilida ham tushunarsiz bo'lishi mumkin.

❓ **Mashqlar intellektual, lekin hissiyotsiz:** "It is 8 AM. You say:" — bu test, hayot emas. Yangi boshlovchi uchun "Qo'shningiz bilan salomlashasiz. U soat 8 da keldi. Nima deyasiz?" — ko'proq real.

❓ **Bir kunda 41 mashq + 20 test = 61 savol** — bu juda ko'p. Yangi boshlovchi uchun kun 1 da 20 ta savol maksimum bo'lishi kerak. Qolganlari keyingi kunlarga tarqatilishi mumkin.

❓ **Progress ko'rinmayapti:** "Siz 34/41 mashqni bajardingiz" — lekin "Siz endi 'Good morning' ni to'g'ri ishlata olasiz" kabi ruhiy reward yo'q.

❓ **Audio yo'q:** "Good morning" ni to'g'ri talaffuz qilishni bilmaydi. Harf va so'z tovushlarini eshitishsiz o'rganish qiyin.

**90 kunlik yo'l haqida fikr:**
Oddiy odam uchun "90 kunda B2" da'vosi motivatsion bo'lishi mumkin, ammo xavfli ham — 90 kun o'tgach B2 bo'lmasa, umidsizlik paydo bo'ladi. "Sekin o'rganasiz — bu normal" degan psixologik xabar yo'q.

---

## 5. BUYUK FAYLASUF NUQTAI NAZARI

### Til o'rganish va insoniy bo'lish to'g'risida

**Instrumental vs Transformativ o'rganish:**
Platform ingliz tilini *vosita* sifatida o'rgatadi — IELTS, ish, chet el. Bu instrumentaldir. Lekin til o'rganishning chuqurroq ma'nosi bor: boshqa til orqali boshqa dunyoqarashga kirish. "The weather is beautiful" va "Havo go'zal" bir xil emas — ingliz tili tabiatni boshqacha ko'radi. Platform bu o'lchamni e'tiborsiz qoldiradi.

**Gamifikatsiya va haqiqiy motivatsiya paradoksi:**
XP, streak, hearts — bu *tashqi* motivatsiya. Psixolog Deci va Ryan ko'rsatganidek, tashqi motivatsiya uzoq muddatda ichki motivatsiyani *yo'q qiladi*. Odam XP uchun o'rganadi — XP to'xtasa, o'rganish ham to'xtaydi. 

**Savolga savol:** Platforma foydalanuvchining *til uchun sevgisini* o'stiradimi yoki faqat *ball to'plash odatini*?

**Chiziqli yo'l va til o'rganishning murakkabligi:**
90 kunlik chiziqli yo'l — bu hayotning o'zi emas. Til o'rganish spiral bo'ladi: bir mavzuni bir qator marta, har safar chuqurroq o'rganish kerak. A1 da o'rganilgan "be" fe'li B2 da ham yangi qirralar kashf etadi. Platform esa har bir mavzuga bir marta qaytadi.

**Xato va o'sish fal safi:**
Platforma xatoni "yo'q qilish" kerak deb hisoblaydi (to'g'ri javob = reward). Lekin falsafiy jihatdan, **xato — bilimning chegarasini topish** demak. Xato qilgan o'quvchi o'z chegarasini topgan — bu muvaffaqiyat.

**Mashhur so'z:** Sokrat "Men faqat bilmayman deb bilaman" degan. Platforma har bir to'g'ri javobni "bilasiz" deb qayd etadi — ammo erta muddatda "bilish" da'vosi noto'g'ri ishonch berishi mumkin.

---

## 6. MUVAFFAQIYATLI TADBIRKOR NUQTAI NAZARI

### Bozor va raqobat tahlili

**Raqobatchilarga nisbatan:**
| Xususiyat | EnglishPath | Duolingo | Babbel | Rosetta Stone |
|-----------|-------------|----------|--------|---------------|
| O'zbek interfeysi | ✅ | ❌ | ❌ | ❌ |
| FSRS SRS | ✅ | Partial | ❌ | ❌ |
| AI suhbat (Claude) | ✅ | ❌ | ❌ | Partial |
| Offline | ✅ | Partial | ❌ | ✅ |
| Tandem/duel | ✅ | ❌ | ❌ | ❌ |
| B2 darajasi | ✅ | ❌ | Partial | Partial |

**Differensiatsiya aniq va kuchli** — O'zbekiston bozorida raqib yo'q.

### ❌ Biznes Muammolari

**1. Monetizatsiya modeli ko'rinmayapti:**
Kod bazasida `premium`, `subscription`, `payment` so'zlari yo'q. "90 kunda B2" da'vosi bor, lekin buning narxi nima? Freemium? Bir martalik to'lov? Bu muhim strategik qaror hal qilinmagan.

**2. "90 kunda B2" da'vosi xavfli:**
Bu da'vo bajarilmasa — ishonch yo'qoladi, refund talabi. Bajarilsa — "menga boshqa narsa kerak emas" deydi. Yaxshiroq framing: "90 kunda B2 ga yo'l" — jarayon, natija emas.

**3. Foydalanuvchi retention strategiyasi:**
- Streak ✅ (lekin streak yo'qolsa, umidsizlik)
- Hearts ✅ (punishment-based)
- Tandem ✅ (kuchli)
- Do'stlar ✅

Lekin: 30 kunlik sertifikat, 60 kunlik progress report, email/push notification campaign — yo'q.

**4. Kontent scalability muammosi:**
Barcha 106 dars TypeScript fayllarida hardcode. Yangi dars qo'shish uchun dasturchi kerak. Bu **bottleneck** — kontent ustozi (pedagog) mustaqil ishlay olmaydi.

**5. Analytics yo'q:**
Qaysi darsda eng ko'p odamlar to'xtab qoladi? Qaysi mashqda eng ko'p xato? Bu ma'lumotlar ko'rsatilmaydi. Biznes qarorlari ma'lumotlarsiz qilinadi.

**6. A/B testing infratuzilmasi yo'q:**
"Will" darsini 5 bo'limda o'qitish yaxshimi yoki 8 bo'limda? Buni faqat eksperiment ko'rsatadi. Hozir faqat intuitsiya bilan qaror qilinadi.

**7. Virality mexanizmi zaif:**
Foydalanuvchi A bilan B o'rtasida challenge bor (Tandem), lekin "Do'stingni taklif qil — ikkalingizga bonus" tipidagi referral yo'q.

---

## 7. YODLASH ILMINING YETUK OLIMI NUQTAI NAZARI

### Kognitiv psixologiya va xotira fani nuqtai nazaridan

**FSRS-5 implementatsiyasi — A+:**
```typescript
// src/lib/srs.ts
export const FSRS_WEIGHTS: readonly number[] = [0.40255, 1.18385, ...]
```
FSRS-5 ning 19 ta parametri to'g'ri implementatsiya qilingan. Stability va difficulty alohida kuzatiladi. Retention maqsadi 90% — bu ilmiy jihatdan asosli.

### ❌ Xotira ilmidan kelib chiqadigan muammolar

**1. Grammatika darslari SRS ni ishlatmaydi — faqat lug'at:**
```
vocabulary_progress jadval → FSRS ✅
grammar_progress jadval → faqat % ✅
lesson_progress jadval → completed ✅
```
Lug'at so'zlari FSRS bilan qayta ko'rsatiladi — lekin grammatika qoidalari ko'rsatilmaydi. Masalan, "When/If gaplarida Future Simple ishlatilmaydi" qoidasini 3 kun, 7 kun, 14 kun keyin test qilmaydi.

**Bu qancha muammo?** Ebbinghaus unutish egri chizig'i bo'yicha, 1 kundan keyin ~50%, haftadan keyin ~75% o'rganilgan narsalar unutiladi. FSRS siz grammatika darslari ham unutiladi.

**2. Massed practice muammosi (Blocked practice):**
```typescript
exerciseSections: [
  { title: "Boshlang'ich", ids: [1401–1405] },  // 5 ta will/going to
  { title: "O'rtacha",     ids: [1406–1410] },  // 5 ta will/going to
  { title: "Qiyin",        ids: [1411–1415] },  // 5 ta will/going to
  ...
]
```
Bir mavzudagi barcha mashqlar ketma-ket (massed practice). Tadqiqotlar ko'rsatadiki, **interleaved practice** (aralash, har xil mavzulardan) massed practice dan 40–60% samaraliroq uzoq muddatli xotira uchun.

**Yaxshiroq yondashuv:** Section 3–5 da faqat "will" emas, balki "will vs going to vs present continuous" aralash mashqlar bo'lsin.

**3. Retrieval practice yetarli emas:**
Ebbinghaus va Roediger tadqiqotlari: **qayta o'qish** o'rganilganini kam yaxshilaydi, **retrieval (esga olish)** esa kuchli. `exercises[]` da retrieval bor, lekin `rules[]` va `formulas[]` uchun retrieval yo'q — foydalanuvchi uni o'qiydi, lekin eslay olmaydi.

**Tavsiya:** Har bir `rule` uchun "Ushbu qoidani o'z so'zlaringiz bilan ifodalang" yoki "Qoidani 3 misolda ko'rsating" tipidagi retrieval mashq.

**4. Spacing effect ishlatilmayapti (grammar uchun):**
- Kun 48: Will vs Going to darsi o'tiladi
- Kun 49: Modals of Obligation darsi
- Kun 55: Will va Going to qayta ko'rsatilmaydi (review darsida emas)

Optimal spacing uchun: Will vs Going to → 2 kundan keyin qisqa test, 7 kundan keyin to'liqroq test, 21 kundan keyin final review. Hozir faqat review darslari bor (17 ta), lekin ular mavzuga asoslanmagan, vaqtga asoslanmagan.

**5. Mnemonic maydonlari underutilized:**
```typescript
specialCases: [{
  mnemonic: "I AM, He/She/It IS, You/We/They ARE. 'I' — birinchi shaxs birlik..."
}]
```
Mnemonic maydoni bor — lekin UI da alohida ko'rsatilmaydi (faqat RuleCard da umumiy ko'rinish). Vizual mnemonic (rasmlar, akronim, lug'atlar) ilmiy jihatdan og'zaki mnemonic dan 3x samaraliroq.

**6. Elaborative encoding yo'q:**
Chuqur o'rganish = yangi ma'lumotni mavjud bilim bilan bog'lash. "Can = qobiliyat" ni o'rganayotgan talabaga "Qanday qilolasiz va qilolmaysiz? 3 ta misol yozing" — bu elaborative encoding. Hozir bunday ochiq savollar yo'q.

**7. Testing effect to'liq qo'llanmayapti:**
`tests[]` mavjud va yaxshi — lekin kuniga faqat o'sha kundagi dars testi. Old darslardagi testlar qayta berilmaydi (FSRS bunday qiladi lug'at uchun, lekin grammar uchun emas).

---

## XULOSAVIY JADVAL

| Sohа | Baho | Asosiy muammo |
|------|------|----------------|
| Ingliz tili pedagog. | 7.5/10 | Produktiv ko'nikmalar integratsiyasi zaif |
| Dasturlash sifati | 7/10 | Kontent TS fayllarida, ID boshqaruvi qo'lda |
| O'zbek tili sifati | 7/10 | Murojaat noaniq, ba'zi tarjimalar bir xil |
| Yangi boshlovchi uchun | 6.5/10 | Audio yo'q, birinchi kunda juda ko'p |
| Falsafiy chuqurlik | 5/10 | Instrumental o'rganish, transformativ yo'q |
| Biznes modeli | 5/10 | Monetizatsiya, analytics, scalability yo'q |
| Xotira ilmi | 6/10 | Grammar uchun SRS yo'q, massed practice |

---

## TOP-10 USTUVOR TAVSIYALAR

### Kritik (darhol hal qilinishi kerak)
1. **Grammar SRS**: `grammar_progress` ga FSRS qo'shilsin — har bir dars qoidasi 2/7/21 kunda qayta test qilinsin
2. **Kontent CMS ga ko'chirish**: TypeScript fayllarini Supabase `lessons` jadvalidagi to'liq kontent boshqaruv tizimiga o'tkazish
3. **Exercise ID auto-generation**: Manual ID o'rniga `crypto.randomUUID()` yoki auto-increment
4. **Audio**: A1–A2 darslari uchun key vocabulary va formula tovushlari (TTS yoki real audio)

### Muhim (keyingi 2–4 hafta)
5. **Interleaved sections**: Section 4–5 da aralash mavzu mashqlar (will + going to + present continuous birgalikda)
6. **Produktiv mashqlar**: Har bir darsga 1 ta speaking prompt + 1 ta mini writing task
7. **Analytics dashboard**: Qaysi dars, qaysi mashqda foydalanuvchilar to'xtashi kuzatilsin
8. **Monetizatsiya modeli**: Freemium chegarasi aniqlash, payment integration

### Foydali (uzoq muddatli)
9. **Contextual exercises**: Izolyatsiyalangan jumlalar o'rniga mini-matn ichidagi mashqlar
10. **Mnemonic vizualizatsiya**: `mnemonic` maydonlari uchun alohida UI — rasmlar, ranglar, akronimlar bilan

---

## YAKUNIY BAHO

**EnglishPath** — O'zbekiston bozori uchun texnik jihatdan kuchli, pedagogik jihatdan solim, ammo bir qancha tizimli muammolari bor platforma. Raqobatchilardan aniq farqlanuvchi xususiyatlari (FSRS, Claude AI, Uzbek, offline, tandem) kuchli asosdir. Asosiy zaiflik — kontent boshqaruvi (TS fayllar), grammar SRS yo'qligi va produktiv ko'nikmalar integratsiyasi. Bu muammolar hal qilinsa, O'rta Osiyo mintaqasi uchun eng kuchli ingliz tili o'rganish platformasiga aylanishi mumkin.

> *"Til — bu nafaqat kommunikatsiya vositasi, balki dunyoqarash tuzilmasi. Platform ushbu chuqurlikni kashf etishga yo'naltirilsa, haqiqiy o'zgarish bo'ladi."*
