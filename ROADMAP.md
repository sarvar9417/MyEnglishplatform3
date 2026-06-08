# Roadmap: Lug'atlar va Mashqlarni To'liq Qilish

## Muammo Tahlili

### Muammo 1 — Lug'atlar to'liq emas
Har bir darsda `vocabulary: VocabWord[]` array mavjud. Lekin dars `rules` matni va
`specialCases` ichida o'qitilgan so'zlarning ko'pchiligi bu arrayda yo'q.
`VocabLearner` komponenti faqat shu arraydagi so'zlarni ko'rsatadi — qolgan
o'rgatilgan so'zlar flashcard/test bo'limida umuman chiqmaydi.

### Muammo 2 — Mashqlar to'liq emas
`exercises` va `tests` arraylari hardcoded (qo'lda yozilgan). Ular darsning barcha
`rules` (6-7 ta qoida) va barcha `vocabulary` so'zlarini qamrab olmagan. Ba'zi
qoidalar uchun mashq yo'q, ba'zilari esa faqat bir xil turdagi savollar bilan
cheklangan.

### Ko'lam
Jami **~89 ta dars** tarqalishi:

| Daraja | Fayllar | Darslar |
|--------|---------|---------|
| A1 | a1Part1.ts, a1Part2.ts | 20 ta |
| A2 | a2Part1.ts – a2Part4.ts | 20 ta |
| B1 | b1Part1.ts | 11 ta |
| B1+ | b1plusPart1.ts, b1plusPart2.ts | 18 ta |
| B2 | b2Part1.ts – b2Part3.ts | 20 ta |

---

## Texnik Tuzilma (Eslatma)

```
DailyLesson {
  rules: string[]           ← bu yerda so'zlar o'qitiladi, lekin vocab arrayda yo'q
  vocabulary: VocabWord[]   ← VocabLearner faqat SHUNI ko'rsatadi
  specialCases: []          ← har birida drills[] bor, lekin kam
  exercises: []             ← barcha qoidalarni qamrab olmagan
  tests: []                 ← barcha qoidalarni qamrab olmagan
}

VocabWord { en, uz, example, rule }
DailyExercise turlar: fill-blank | multiple-choice | error-correction | transformation | fill-table
```

---

## Bosqichlar

### Bosqich 1 — Tahlil va Etalon Yaratish
**Maqsad:** Bitta darsni qo'lda to'liq qilib, keyingi bosqichlar uchun standart belgilash.

- [ ] Bitta darsni (masalan `alphabetAndGreetings` — a1Part1.ts) etalon sifatida to'liq qilish
- [ ] Etalon darsda standartlarni belgilash:
  - `rules[]` matnidagi **barcha o'qitilgan so'zlar** `vocabulary[]` arrayda bo'lishi shart
  - Har bir `rule` elementi uchun **kamida 2 ta mashq** (har xil turdagi)
  - Har bir `specialCase` uchun **kamida 3 ta drill**
  - `exercises` va `tests` araylari barcha grammar qoidalarni qamrab olishi shart
- [ ] `DailyLesson` type o'zgartirish kerak emasligini tasdiqlash (mavjud struktura yetarli)

---

### Bosqich 2 — Avtomatlashtirish Skripti
**Maqsad:** Claude API yordamida 89 ta darsni avtomatik to'ldiruvchi skript yozish.

**Fayl:** `scripts/fix-lessons.ts`

Skript algoritmi:
```
Har bir dars uchun:
  1. rules[] matnini o'qiydi
  2. Undagi barcha o'rgatilgan so'zlarni extrakt qiladi
  3. vocabulary[] da yo'q so'zlarni aniqlaydi
  4. { en, uz, example, rule } formatida yangi so'zlar qo'shadi
  5. Har bir rule uchun 2-3 ta yangi exercise generatsiya qiladi
  6. Har bir specialCase uchun 2-3 ta yangi drill generatsiya qiladi
  7. Yangilangan lesson ma'lumotini qaytaradi
  8. TypeScript fayl sifatida yozadi
```

- [ ] `scripts/fix-lessons.ts` skriptini yozish
- [ ] Bitta darsda sinab ko'rish (dry-run)
- [ ] Natijani tekshirib tasdiqlash

---

### Bosqich 3 — Darslarni Darajalarga Bo'lib Ishlash
**Maqsad:** Barcha dars fayllarini yangilash, har biridan so'ng tekshirish.

- [ ] **Kun 1:** A1 darslari — `a1Part1.ts`, `a1Part2.ts` (20 ta dars)
- [ ] **Kun 2:** A2 darslari — `a2Part1.ts` – `a2Part4.ts` (20 ta dars)
- [ ] **Kun 3:** B1 darslari — `b1Part1.ts` (11 ta dars)
- [ ] **Kun 4:** B1+ darslari — `b1plusPart1.ts`, `b1plusPart2.ts` (18 ta dars)
- [ ] **Kun 5:** B2 darslari — `b2Part1.ts` – `b2Part3.ts` (20 ta dars)

Har bir fayldan so'ng: frontend'da VocabLearner va Exercise bo'limlarini ochib tekshirish.

---

### Bosqich 4 — Supabase Sync
**Maqsad:** Yangilangan lokal fayllarni Supabase ma'lumot bazasiga push qilish.

- [ ] Mavjud `scripts/seed-supabase.ts` ni ko'rib chiqish
- [ ] Yangilangan dars fayllarini Supabase `lessons` jadvaliga push qilish
- [ ] Supabase'dagi ma'lumot lokal TypeScript bilan bir xilligini tekshirish

---

### Bosqich 5 — Test va Nazorat
**Maqsad:** Hamma narsa to'g'ri ishlayotganini tasdiqlash.

- [ ] Har bir daraja uchun (A1, A2, B1, B1+, B2) bitta darsni to'liq ochib tekshirish
- [ ] VocabLearner — barcha so'zlar (rules'dagi ham) ko'rinishini tasdiqlash
- [ ] Mashqlar — barcha qoidalarni qamrab olishini tasdiqlash
- [ ] SRS tizimiga so'zlar to'g'ri push bo'lishini tekshirish
- [ ] Hech qanday TypeScript xatosi yo'qligini tasdiqlash (`npm run build`)

---

## Muvaffaqiyat Mezoni

| Mezon | Hozir | Maqsad |
|-------|-------|--------|
| Dars lug'ati to'liqligi | ~40% | 100% |
| Har bir rule uchun mashq | ~1 ta | 2-3 ta |
| SpecialCase drills | ~2 ta | 3-5 ta |
| Mashq turlari xilma-xilligi | asosan fill-blank | barcha 5 tur |

---

## Taxminiy Vaqt

| Bosqich | Vaqt |
|---------|------|
| Bosqich 1 (etalon) | 0.5 kun |
| Bosqich 2 (skript) | 1-2 kun |
| Bosqich 3 (barcha darslar) | 3-5 kun |
| Bosqich 4 (Supabase) | 1 kun |
| Bosqich 5 (test) | 0.5 kun |
| **Jami** | **~7-9 ish kuni** |
