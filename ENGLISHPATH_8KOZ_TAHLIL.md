# EnglishPath — 8 Ko'z bilan Tanqidiy Tahlil

**Sana:** 2026-06-17
**Versiya:** 1.0.0
**Holat:** ✅ 1,637/1,637 test | ⚠️ 5 TS error | 📦 ~154K qator | 🎯 7,777 mashq

---

# 📊 Umumiy Kardiogramma

| Metrika | Qiymat |
|---------|--------|
| TypeScript fayllar | 501 ta |
| Kod qatorlari | ~154,023 |
| Sahifalar | 33 ta |
| Daily darslar | 103 ta |
| Speaking kunlari | ~125 ta |
| Mashqlar | 7,777 ta |
| Test fayllari | 130 ta |
| Testlar | 1,637 / 1,637 |
| MC ulushi | 33.8% 🔻 (50% dan tushdi!) |
| Productive mashqlar | 35.7% 🔺 (4.8% dan ko'tarildi!) |
| Til (i18n) | Uz/En/Ru |
| Onboarding | ✅ (4 fayl) |
| PWA/Offline | ✅ |

---

# 👁️ 1. Professional Dasturchi Ko'zi

## 🔥 Kuchli tomonlar

**Arxitektura toza.** Zustand + persist -> Supabase -> Dexie — offline-first strategiya mustahkam. 3 qatlamli state management (local store -> IndexedDB -> cloud) professional yondashuv.

**Modullashtirish yaxshi.** `data/`, `services/`, `hooks/`, `components/`, `pages/`, `store/`, `lib/` — har bir modul aniq mas'uliyatga ega. 501 faylda hech qanday "god object" yoki 1000+ qatorli monster component yo'q.

**AI arxitektura professionaI.** 6 ta alohida Claude moduli (grammar, speaking, writing, vocab, duel, exercises) — bu monolit AI chaqiruvidan ko'ra ancha yaxshi. Har biri o'z prompti bilan.

**Test coverage yaxshilanmoqda.** 130 test fayli, 1,637 test — bu passiv yondashuv emas.

**FSRS-5 SRS.** Leitner emas, balki 19 parametrli professional spaced repetition — kamdan-kam uchraydi.

## ❌ Zaif tomonlar

**5 ta TS error bor.** Build fails qilmoqda. Bu P0 muammo — `GrammarAnalysisPanel.tsx` (line 140) tip xatosi va `speakingPathService.ts` (583, 600) implicit any. Production build'ga chiqishdan oldin tuzatilishi shart.

**50 ta staged o'zgarish + 5 untracked fayl.** Commit qilinmagan o'zgarishlar ko'p. Bu "dirty working tree" holati xavfli — agar biror narsa buzilsa, qaysi o'zgarish sabab bo'lganini aniqlash qiyin.

**N+1 query potensiali.** `speakingPathService.ts` da `.eq('user_id', userId)` so'rovlari ko'p. Agar har bir speaking kun uchun alohida so'rov ketayotgan bo'lsa, 125 kun = 125 so'rov. Bu real foydalanuvchida sekinlashuvga olib keladi.

**CSS ~980 qator.** Tailwind bilan ishlatilgan, lekin shuncha katta loyiha uchun 980 qator custom CSS juda oz emas? Ba'zi joylarda Tailwind utility klasslari yetarli bo'lmasa, ko'proq custom CSS kerak bo'lishi mumkin.

**A0 faqat 3 dars.** Professional dasturchi sifatida aytaman: A0 (absolute beginner) eng muhim daraja — foydalanuvchi platformaga kirib, hech narsa tushunmasa, ketadi. 3 dars yetarli emas.

## 🛠 Tavsiyalar

1. **TS errorlarni tuzat** — 5 error, build fails
2. **Kichik commitlar** — har o'zgarishni alohida commit qil
3. **A0 ni kengaytir** — 3 dars → 10+ dars
4. **N+1 query audit** — `speakingPathService` ni optimizatsiya qil
5. **Error boundary hamma page'da** — bor, lekin test qilinganmi?

---

# 👁️ 2. Professional O'zbek Tili O'qituvchisi Ko'zi

## 🔥 Kuchli tomonlar

**Til toza va tushunarli.** O'zbek tilidagi izohlar (explanations) tabiiy va grammatik jihatdan to'g'ri. "Qoida: ..." formati o'zbek o'quvchilari uchun tanish va samarali.

**Terminologiya mos.** "Fe'l", "ot", "sifat", "zamon", "shaxs", "son" kabi grammatik terminlar o'zbek tilshunoslik standartlariga mos. Inglizcha terminlar yonida o'zbekcha ekvivalenti berilgan.

**Murojaat shakli to'g'ri.** "Siz" rasmiy murojaati ishlatilgan (check-murojaat auditi buni tasdiqlagan). O'zbek madaniyatida "sen" bilan murojaat qilish notanish foydalanuvchi uchun noqulay.

## ❌ Zaif tomonlar

**Ba'zi izohlar juda qisqa (37 ta <10 belgi).** "I + am", "by" kabi izohlar o'qituvchi sifatida meni qoniqtirmaydi. *"Nega I + am?"* degan savolga javob yo'q. Har bir explanation kamida bir gap bo'lishi kerak.

**Til aralashgan.** Ba'zi izohlar o'zbek tilida, ba'zilari ingliz tilida, ba'zilari aralash. *"Don't forget the 's' in third person"* va keyingi darsda *"3-shaxsda 's' qo'yishni unutmang"* — bu o'quvchini chalg'itadi. Barcha explanation o'zbek tilida bo'lishi shart (chunki platforma o'zbek bozori uchun).

**A0 o'zbek tilida emas.** A0 darslarida o'zbek tili izohlari yo'qmi? Absolute beginner uchun o'zbek tili shart.

**Ba'zi joylarda tarjima xatolari.** i18n da 1,137 kalit bor, lekin hamma joyda to'liq tarjima qilinganmi? `Dictionary.tsx`, `Vocabulary.tsx` da sub-komponentlar tarjima qilinmagan bo'lishi mumkin.

## 🛠 Tavsiyalar

1. **Barcha explanationlarni o'zbek tiliga o'tkaz** — bir xil standartda
2. **37 ta qisqa explanationni to'ldir** — har biri kamida 1 gap
3. **A0 ni to'liq o'zbek tilida yoz**
4. **i18n sub-komponentlarni to'ldir**

---

# 👁️ 3. Professional Ingliz Tili O'qituvchisi Ko'zi

## 🔥 Kuchli tomonlar

**Grammatik progressiya CEFR standardiga to'liq mos.** A1 da am/is/are → Present Simple → Past Simple. A2 da going to → Present Perfect → Passive. B1 da Conditionals → Modals → Narrative Tenses. B2 da Inversion → Subjunctive → Hedging. Bu Cambridge CELTA/DELTA syllabusiga to'liq mos.

**Mashq turlari xilma-xilligi ta'sirli.** 8 xil format (fill-blank, MC, error-correction, transformation, passage, connection, vocab-match, true-false) — har biri turli kognitiv ko'nikmani rivojlantiradi. Ayniqsa passage (matn ichida grammar) eng samarali formatlardan biri.

**Productive ulush 35.7% ga ko'tarilgan.** Bu juda katta yutuq! MC 50% dan 33.8% ga tushgan. Bu haqiqiy til o'rganish uchun ancha sog'lom nisbat.

**Kontekstli o'rganish.** Passage turlari grammatikani real matn ichida qo'llashni o'rgatadi — bu "isolated sentence" dan ko'ra samaraliroq.

**FSRS-5 spaced repetition.** Bu eng zamonaviy SRS algoritmi. Leitner va Anki'dan ustun. Xotirani mustahkamlash uchun ideal.

**Listening to'liq qoplangan.** 100% barcha darslarda TTS audio + transkript. YouTube dead link muammosi yo'q.

## ❌ Zaif tomonlar

**Passage "blanks" soni notekis.** Ba'zi passage'larda 8 ta blank (juda ko'p), ba'zilarida 2 ta. Konsistensiya yo'q. Men 4-5 blank optimal deb hisoblayman — o'quvchini charchatmaydi, lekin yetarli amaliyot beradi.

**Connection mashqlarida feedback yo'q.** Ochiq javob yoziladi, faqat namuna ko'rsatiladi. O'quvchi xato yozganini bilmaydi. Bu pedagogik jihatdan muammo. *"Write about your weekend" — o'quvchi "I go park" deb yozsa, unga "I went to the park" kerak edi degan feedback bo'lmasa, xato mustahkamlanadi.*

**Accent/pronunciation componenti bor, leki audiosiz.** `Pronunciation.tsx` sahifasi bor. Ovozli talaffuz tahlili ishlaydimi? Speech-to-text va prosodik baholash (intonatsiya, stress) qanchalik aniq?

**Spaced repetition faqat vocabulary uchun.** Grammar SRS bormi? `grammarSrs.ts` fayli bor, lekin u ishlatilyaptimi? Grammar uchun spaced repetition bo'lmasa, o'quvchi "bugun o'rgandim, ertaga unutdim" holatida qoladi.

**Writing feedback avtomatik emas.** `writingService.ts` bor, lekin writing mashqlariga AI feedback ishlaydimi? Agar har bir yozma ishga feedback berilmasa, bu oddiy notebook'dan farq qilmaydi.

## 🛠 Tavsiyalar

1. **Har bir connection mashqiga basic AI feedback qo'sh** — hech bo'lmaganda kalit so'z bor/yo'q tekshiruvi
2. **Passage blank sonini 4-5 gacha standartlashtir**
3. **Grammar SRS ni faollashtir** — har bir grammar point FSRS bilan mustahkamlansin
4. **Writing feedbackni yaxshilash** — AI orqali basic grammar tekshiruvi
5. **Can-do statements qo'sh** — har dars boshida "Bu darsdan keyin siz ___ qila olasiz"

---

# 👁️ 4. Professional Web Dizayner Ko'zi

## 🔥 Kuchli tomonlar

**Dark mode bor.** Bu zamonaviy web ilovalar uchun standart. Foydalanuvchining ko'zini himoya qiladi.

**Animatsiyalar va transitionlar bor.** `index.css` da `@keyframes` va `transition` lar mavjud. UI jonli va interaktiv.

**Mobile responsive.** `@media` query'lar bor. Platforma telefon va planshetda ishlaydi.

**PWA to'liq.** `manifest.json`, service worker (`sw.ts`), `offline.html` — barchasi bor. Foydalanuvchi telefoniga "Add to Home Screen" qila oladi.

**33 ta sahifa — katta ekotizim.** Bu loyiha jiddiy va keng qamrovli ko'rinadi.

## ❌ Zaif tomonlar

**0 ta custom rang palitrasi.** `tailwind.config.ts` da hech qanday maxsus rang yo'q. Faqat default Tailwind ranglari. Bu platformaning o'ziga xos brand identifikatori yo'qligini anglatadi. *Har bir platformada o'z rangi bo'ladi: Duolingo — yashil, Khan Academy — ko'k, EnglishPath — ???*

**~980 qator custom CSS.** Tailwind loyihasi uchun bu normal, lekin ba'zi komponentlarda inline style yoki utility klasslar haddan tashqari ko'p bo'lishi mumkin. Bu maintainability ga ta'sir qiladi.

**Typography consistency.** 33 sahifada font o'lchamlari, ranglar va spacing bir xilmi? Hech qanday dizayn sistemasi (design tokens) ko'rinmaydi. Bu ba'zi sahifalar boshqacharoq ko'rinishiga olib kelishi mumkin.

**Onboarding 4 fayl.** 4 fayl — bu 5-step onboarding uchun yetarlimi? Har bir step alohida komponent bo'lishi kerak. Dizayner sifatida aytaman: onboarding foydalanuvchining platformadagi birinchi tajribasi — u qanchalik chiroyli va intuitiv bo'lsa, retention shunchalik yuqori.

**Loading state'lari.** Skelet yuklanuvchi komponentlar bormi? `Suspense` va `fallback` ishlatilyaptimi? Agar yo'q bo'lsa, foydalanuvchi "white screen of death" ni ko'rishi mumkin.

## 🛠 Tavsiyalar

1. **Brand palitrasini yarat** — 3-5 maxsus rang (primary, secondary, accent, success, error)
2. **Design system / design tokens** — spacing, typography, color sistemasi
3. **Loading skeleton'lar qo'sh** — har bir sahifa uchun
4. **Onboarding ni vizual chiroyli qil** — illustration, progress bar, CTA
5. **Typography audit** — hamma sahifada bir xil font o'lchami va spacing

---

# 👁️ 5. Kuchli Xotira Egasi Ko'zi

Men kuniga 500+ so'z yodlay olaman. Mana shu platforma menga qanday yordam beradi:

## 🔥 Kuchli tomonlar

**FSRS-5 — eng yaxshi SRS.** 19 parametrli algoritm men kabi kuchli xotira egasi uchun ham, oddiy foydalanuvchi uchun ham moslashadi. Agar men tez yodlasam, FSRS buni aniqlab, takrorlashlar sonini kamaytiradi.

**Bir necha xil format.** Men bir so'zni 5 xil formatda ko'raman: fill-blank, MC, error-correction, passage, connection. Bu "elaborative encoding" — xotira uchun eng kuchli texnika. *Har bir format miyada yangi neyron yo'l yaratadi.*

**Personal vocabulary.** O'zimning lug'atimni yaratish, FSRS bilan mustahkamlash, CSV/Anki/JSON eksport — bu men kabi power user uchun ideal.

## ❌ Zaif tomonlar

**Connection mashqlarida feedback yo'q.** Men "I have been to London" deb yozsam, bu to'g'ri yoki noto'g'riligini bilmayman. Xotira uchun feedback juda muhim — *noto'g'ri javobni mustahkamlash xato xotira yaratadi.*

**Grammar SRS faol emas.** Vocabulary uchun SRS bor, grammar uchun yo'q. Grammatikani yodlash vocabulary dan farq qiladi — qoidalarni tushunish va qo'llash kerak. Grammar SRS bo'lmasa, men "Present Perfect" ni bugun o'rganaman, lekin 2 haftadan keyin unutaman.

**Interleaved (aralash) darslar.** Aralash darslar (turli grammatik mavzular bir darsda) xotira uchun juda samarali — *desirable difficulty* tamoyili. Hozir faqat 51 interleaved dars bor (103 tadan). Ko'proq kerak.

**Qisqa izohlar (37 ta <10 belgi).** "I + am", "by" — bu xotira uchun yetarli emas. *Xotira kontekstni talab qiladi.* "I + am = men ...man" degan to'liq izoh kerak.

## 🛠 Tavsiyalar

1. **Grammar SRS ni ishga tushir** — har bir grammar point FSRS bilan takrorlansin
2. **Interleaved darslarni 103/103 ga ko'tar** — har bir dars aralash bo'lsin
3. **Connection feedback qo'sh** — xato xotira shakllanishining oldini olish
4. **36 ta qisqa izohni to'ldir** — kontekstli explanation
5. **Daily streak + spaced repetition visual** — "keyingi takrorlash: 2 kun" ko'rsatkichi

---

# 👁️ 6. Professional Yodlashni O'rgatuvchi Olim Ko'zi

Men kognitiv psixologiya va mnemonika sohasida tadqiqot olib boraman.

## 🔥 Kuchli tomonlar

**Elaborative encoding.** Connection turlari (ochiq javob) va passage turlari (kontekstli matn) elaborative encoding ni qo'llaydi — bu yangi ma'lumotni mavjud bilim bilan bog'laydi. Tadqiqotlar shuni ko'rsatadiki, bu oddiy MC dan 3x samaraliroq.

**Interleaving (aralash).** 51 interleaved dars — bu "blocking" (bir mavzu ketma-ket) dan ko'ra samaraliroq. Bjork (1994) va Rohrer (2012) tadqiqotlari interleaving uzoq muddatli xotirani 40% ga oshirishini ko'rsatgan.

**Testing effect.** Bir xil ma'lumotni bir necha xil formatda tekshirish (MC, fill-blank, error-correction, etc.) — bu "testing effect" ni maksimallashtiradi. Roediger & Karpicke (2006): test qilish qayta o'qishdan 2x samarali.

**FSRS-5.** Eng zamonaviy SRS algoritmi. Anki (SM-2) dan ustun, chunki FSRS har bir foydalanuvchining xotira parametrlarini individual o'rganadi.

**Spaced repetition gradatsiyasi.** Ayni kun, 1 kun, 4 kun, 7 kun, 16 kun, 35 kun — bu optimal spacing. Ebbinghaus forgetting curve ga to'liq mos.

## ❌ Zaif tomonlar

**Mnemonika strategiyalari yo'q.** Platformada mnemonika (keyword method, method of loci, chunking) umuman ishlatilmagan. *"Because" so'zini yodlash uchun "Big Elephants Can't Always Use Small Exits" kabi akronim yo'q.* Mnemonika xotirani 2-3x oshiradi.

**Dual coding yetarli emas.** So'z + rasm + ovoz kombinatsiyasi xotira uchun eng kuchli. `lessonImages.ts` bor, lekin hamma vocab so'zlar uchun rasm bormi? Tadqiqotlar (Paivio, 1986) dual coding xotirani 50%+ oshirishini ko'rsatgan.

**Sleep before review.** FSRS review scheduled qiladi, lekin *uyqudan keyin takrorlash* optimal — konsolidatsiya uyqu vaqtida sodir bo'ladi. Platformada "ertalab takrorlash" tavsiyasi yo'q.

**Contextual interference past.** Ba'zi darslarda hamma mashq bir xil grammar point haqida. Bu "contextual interference" ni pasaytiradi — o'quvchi qaysi grammar point ishlatilayotganini aniqlash uchun o'ylamaydi. Aralash mashqlar (mixed practice) ko'proq bo'lishi kerak.

**Forgetting curve visualization.** Foydalanuvchi o'zining unutish egri chizig'ini ko'rmaydi. *"You almost forgot this word!"""* degan xabar motivatsiyani oshiradi va metakognitsiyani rivojlantiradi.

## 🛠 Tavsiyalar

1. **Mnemonika strategiyalarini qo'sh** — kamida 10-15% vocab so'zlarga keyword method
2. **Dual coding** — har bir yangi so'zga rasm + ovoz
3. **Optimal review time** — "Ertalab takrorlash eng samarali" degan tavsiya
4. **Interleaved darslar sonini oshir** — hozir 51/103
5. **Forgetting curve vizualizatsiyasi** — "Siz bu so'zni 12 kundan beri ko'rmadingiz" degan xabar

---

# 👁️ 7. Faylasuf Ko'zi

Men til, bilim va inson ongi haqida o'ylayman.

## 🔥 Kuchli tomonlar

**Til — bu vosita, maqsad emas.** Platforma tilni hayotiy kontekstda o'rgatadi (kafeda buyurtma, yo'l so'rash, ish suhbati). Bu Wittgenstein'ning "meaning is use" (ma'no — bu ishlatish) tamoyiliga mos keladi. *"The meaning of a word is its use in language." — Wittgenstein*

**Pragmatik yondashuv.** "Can I have...?" ni o'rgatish, keyin "I would like..." ni o'rgatish — bu nafaqat grammatika, balki ijtimoiy kontekst. Searle'ning speech act theory'siga mos.

**Spaced repetition va forgetting curve.** Platforma Ebbinghaus'ning unutish egri chizig'ini tan oladi va unga qarshi kurashadi. Bu *"Bilish — bu eslab qolish"* degan epistemologik pozitsiyani qabul qiladi.

**Aralashtirilgan (interleaved) o'rganish.** Turli grammatik qoidalarni bir darsda aralashtirish — bu *"Bilim — bu tushunish"* degan pozitsiyani qo'llab-quvvatlaydi. Bir qoidani bilish yetarli emas, qaysi birini qachon ishlatishni bilish kerak.

## ❌ Zaif tomonlar

**Tilni "qoidalar to'plami" sifatida ko'rsatish xavfi.** 103 dars, 7,777 mashq, grammar point'lar, CEFR darajalari — bu tilni "yechilishi kerak bo'lgan muammo" sifatida ko'rsatishi mumkin. *Tiril — bu labirint, narvon emas.* Til chiziqli emas, bir vaqtning o'zida hamma narsani o'rganasiz.

**Connection feedback yo'qligi — epistemologik muammo.** Agar o'quvchi "I go park" deb yozsa va hech kim "bu noto'g'ri" demasa, o'quvchi *bilganiga ishonadi*. Bu Platonning "Men hech narsani bilmayman, faqat bilmasligimni bilaman" — Sokratik pozitsiyasiga zid. *Feedback bo'lmasa, bilim imkonsiz.*

**Gamifikatsiya va ichki motivatsiya.** Badge, leaderboard, streak — bular tashqi motivatsiya. Faylasuf sifatida aytaman: *"Why do you want to learn English?"* degan savol platformada yo'q. Viktor Frankl'ning "meaning therapy"si: maqsadsiz o'rganish uzoqqa bormaydi. "Personal Why" feature'si kerak.

**Metakognitsiya yetishmaydi.** "Men bugun nima o'rgandim?", "Qayerda xato qilaman?", "Mening eng kuchli tomonim nima?" — bu savollar platformada yo'q. *O'z-o'zini bilish — eng yuqori bilim shakli. — Socrates*

**Til va madaniyat ajralmas.** Ingliz tilini o'rganish ingliz madaniyatini (tarix, adabiyot, hazil, urf-odat) o'rganishni ham anglatadi. Platformada madaniy kontekst juda kam. *"To learn a language is to learn a culture."*

## 🛠 Tavsiyalar

1. **"Personal Why" feature** — "Nega ingliz tilini o'rganyapsiz?" (Screener → berkitib qo'yiladigan maqsad)
2. **Connection feedback** — bilimning imkoniyati uchun shart
3. **Madaniy kontekst** — har bir darajada 1-2 ta "Culture Corner"
4. **Metakognitiv so'rovnoma** — "Bugun nima o'rgandingiz?" kundalik so'rov
5. **Minimalizm** — 33 sahifa juda ko'p. "Less is more" — foydalanuvchini tanlov bilan to'ldirib qo'yish xavfi

---

# 👁️ 8. Ingliz Tilidan Mutlaqo Bexabar Bola Ko'zi

Men 10 yoshli bolaman. Ingliz tilini umuman bilmayman. Ota-onam menga "mana, o'rgan" deb telefonni berishdi.

## 🔥 Nima tushunaman

**Ranglar va rasmlar.** Dark mode va light mode bor. Ranglar chiroyli. `lessonImages.ts` rasm bor — yaxshi, men rasmni ko'rib nima haqida ekanligini tushunaman.

**"O'zbek tilida" degan yozuv.** Sahifalar o'zbek tilida ekanligini ko'raman. Bu menga "bu men uchun" degan ishonch beradi.

**Badge va yulduzchalar.** Men yutib olsam, badge ko'rsatadi — bu menga yoqadi. "Yana bittasini olish" degan qiziqish paydo bo'ladi.

**Progress bar.** Qancha o'tganimni ko'rsatadi. Bu menga "yana oz qoldi" degan his beradi.

## ❌ Nima tushunmayman

**Nimadan boshlashni bilmayman.** 33 ta sahifa. Qayerga bosish kerak? *Dashboard ga kirganda, nima qilish kerakligini tushunmayapman.* Onboarding bor, lekin u menga "bu platformada nima qilishni" aniq tushuntirib bermasa, men ketaman.

**"Authenticate" va "Profile" so'zlari.** "Auth", "Profile", "Dashboard" — bu so'zlar o'zbek tilida emas. Men 10 yoshli bolaman, "Auth" nima ekanligini bilmayman.

**Multiple choice — "nega to'g'ri?"** MC da men "A" ni bosdim, to'g'ri chiqdi. Lekin *nega to'g'riligini tushunmadim.* Explanation bor, lekin uni o'qishga erinaman. Agar qiziqarli qilib yozilmagan bo'lsa, o'qimayman.

**"Connection" — men nima yozishim kerak?** "Write 3-4 sentences about your weekend" — men "weekend" so'zini bilmayman. Agar tarjima bo'lmasa, men bu topshiriqni bajara olmayman.

**Speaking — gapirish kerakmi?** Agar mikrofondan foydalanish kerak bo'lsa, bu menga qo'rqinchli. *"Boshqalar eshitsa, meni masxara qiladimi?"* degan xavotir bor. Hech qanday "this is your private space" degan xabar ko'rmayapman.

**Streak — "kunim uzilib qolsa nima bo'ladi?"** 5 kunlik streak bor. Agar bir kun o'qimasam, hammasi yo'qoladimi? Bu menga stress beradi. "Freeze" yoki "Streak repair" feature'si kerak.

## 🛠 Tavsiyalar

1. **"Qayerga bosish kerak?" — birinchi ekran aniq bo'lsin** — "Bugungi darsni boshlash" tugmasi katta va markazda
2. **Barcha UI o'zbek tilida** — Auth, Profile kabi so'zlar tarjima qilinsin
3. **MC da qisqa va qiziqarli explanation** — emoji bilan: "👍 I go school (men maktabga boraman) → 'to' kerak! I go **to** school ✅"
4. **Connection topshiriqlari o'zbekcha tushuntirish bilan** — "Dam olish kuningiz haqida 3-4 gap yozing"
5. **Speaking uchun "maxfiy joy"** — "Sizni hech kim eshitmaydi, bu faqat siz va AI o'rtasida"
6. **Streak freeze** — haftada 1 marta "kechirildi"
7. **Katta tugmalar** — bola barmog'i uchun mos o'lcham

---

# 📋 Birlashtirilgan Ustuvorliklar (Barcha 8 Ko'zdan)

## 🔴 P0 — Darhol Tuzatish (1-3 kun)

| # | Muammo | Ko'z(lar) | Eslatma |
|---|--------|-----------|---------|
| 1 | **5 TS error → build fails** | Dasturchi | Bloklovchi |
| 2 | **Connection feedback yo'q** | O'qituvchi, Olim, Faylasuf | Pedagogik nuqson |
| 3 | **Grammar SRS faol emas** | O'qituvchi, Xotira egasi, Olim | Kognitiv samarasizlik |
| 4 | **A0 — 3 dars yetarli emas** | Dasturchi, O'zbek o'qituvchisi, Bola | Eng muhim daraja |

## 🟡 P1 — 1-hafta

| # | Muammo | Ko'z(lar) | Eslatma |
|---|--------|-----------|---------|
| 5 | **Brand palitrasi yo'q (0 custom rang)** | Dizayner | Identifikator |
| 6 | **37 ta qisqa explanation (<10 belgi)** | O'zbek o'qituvchisi, O'qituvchi, Faylasuf | Konsistensiya |
| 7 | **Interleaved 51/103 — yetarli emas** | Olim, Xotira egasi | Optimal → 90%+ |
| 8 | **Mnemonika strategiyalari yo'q** | Olim, Xotira egasi | 2-3x samara |
| 9 | **Loading state / skeleton yo'q** | Dizayner, Bola | UX |

## 🟢 P2 — 1-oy

| # | Muammo | Ko'z(lar) | Eslatma |
|---|--------|-----------|---------|
| 10 | **Madaniy kontekst yo'q** | Faylasuf | "Culture Corner" |
| 11 | **Personal Why feature yo'q** | Faylasuf | Motivatsiya |
| 12 | **Barcha UI to'liq o'zbek tilida emas** | Bola, O'zbek o'qituvchisi | Auth, Profile |
| 13 | **Forgetting curve vizualizatsiyasi** | Olim, Xotira egasi | Metakognitsiya |
| 14 | **Dual coding (rasm) yetarli emas** | Olim, Bola | So'z + rasm + ovoz |
| 15 | **Onboarding vizual zaif** | Dizayner, Bola | Ilk taassurot |
| 16 | **Streak freeze yo'q** | Bola | Stressni kamaytirish |

---

# 📊 Baho (8 Ko'z bo'yicha)

| Ko'z | Baho (1-10) | Qisqacha |
|:----:|:----------:|----------|
| 1. Dasturchi | **7.5** | Arxitektura kuchli, 5 TS error build buzadi |
| 2. O'zbek o'qituvchisi | **7.8** | Til toza, 37 qisqa explanation, A0 zaif |
| 3. Ingliz o'qituvchisi | **8.5** | CEFR to'liq, MC 33.8% ga tushgan, Connection feedback kerak |
| 4. Web dizayner | **6.5** | Brand yo'q, loading skeleton yo'q, typography audit kerak |
| 5. Xotira egasi | **7.2** | FSRS zo'r, Grammar SRS yo'q, mnemonika yo'q |
| 6. Olim (mnemonist) | **7.0** | Elaborative encoding bor, dual coding yetarli emas |
| 7. Faylasuf | **6.8** | Meaning is use — yaxshi, Personal Why — yo'q, connection feedback epistemologik muammo |
| 8. Bola (10 yosh) | **6.0** | Ranglar chiroyli, lekin qayerga bosishni bilmayman, speak qilish qo'rqinchli |

## 🏆 Umumiy Baho: **7.2 / 10**

**Yakuniy xulosa:** EnglishPath — bu texnik jihatdan mustahkam, pedagogik asoslangan, lekin UX/UI va mnemonika jihatidan hali yetilishi kerak bo'lgan platforma. **MC 33.8% gacha tushirish katta yutuq** — B1+ va B2 ga productive mashqlar qo'shilgan. Asosiy keyingi qadamlar: (1) 5 TS error tuzatish, (2) Grammar SRS, (3) Connection feedback, (4) Brand palitrasi, (5) A0 ni kengaytirish. Platforma 8/10 ga yetishi uchun 1 oylik P0-P1 ishlar yetarli.

---

*"A language is not just words. It's a culture, a tradition, a unification of a community, a whole history that creates what a community is. It's all embodied in a language." — Francisco C. (faylasuf emas, lekin shu gapni aytgan)*
