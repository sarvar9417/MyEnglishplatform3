# F2-10 — Curriculum Gap Analysis (avtomatik hisobot)

**Sana:** 2026-06-14  
**Skript:** `npm run audit:cefr` (`scripts/cefr-audit.ts`)  
**Jami darslar:** 106

## Daraja bo'yicha qoplama

| Daraja | Darslar | Lug'at | Mashqlar | reading | writing | listening |
|--------|---------|--------|----------|---------|---------|-----------|
| A1     | 23      | 534    | 592      | 19/23   | 19/23   | **19/23** |
| A2     | 22      | 343    | 581      | 9/22    | 20/22   | **1/22**  |
| B1     | 18      | 268    | 472      | 13/18   | 11/18   | **0/18**  |
| B1+    | 18      | 282    | 380      | 9/18    | 18/18   | **0/18**  |
| B2     | 25      | 389    | 611      | 19/25   | 19/25   | **0/25**  |

## Asosiy topilmalar (e'tibor talab qiladi)

1. **🔴 Listening gap (eng katta):** Listening bo'limi A1'da yaxshi (19/23), ammo
   A2'da deyarli yo'q (1/22), B1/B1+/B2'da **umuman yo'q (0)**. Bu F9-1 topilmasi
   (69 ta ishlamayotgan video) bilan bog'liq — listening kontenti zaif. Yuqori
   darajalarga listening qo'shish eng yuqori ustuvorlik.
2. **🟡 reading qoplamasi notekis:** A2 (9/22) va B1+ (9/18) reading'i kam.
3. **🟡 Takrorlangan kun raqamlari:** 35, 74, 75, 76, 78 — curriculum day
   numbering izchil emas (bir necha dars bir xil `day` raqamiga ega).

## Yangi mashq turlari (F2-5/F7-3) integratsiyasi

`passage` va `connection` turlari kurrikulumда ko'rinmoqda (A1: passage×2, connection×1;
A2: passage×1, connection×1). Bu turlar yuqori darajalarga ham qo'shilishi mumkin.

## Eslatma

Bu **strukturaviy** audit (kontent miqdori va to'liqligi). CEFR can-do
bayonotlariga **semantik** moslik (masalan "dars haqiqatan ham 'o'zini tanishtirish'ni
o'rgatadimi?") pedagog tomonidan qo'lда tekshirilishi kerak — buni skript avtomatlashtira olmaydi.
