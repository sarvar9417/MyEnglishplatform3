// Speaking Path — 14 kunlik narvon (MVP kontenti)
// Reja: docs/speaking-path-roadmap.md (5-bo'lim)
// Authoring: A0 dan i+1, yuqori chastotali bloklar, gapiriladigan jumlalar (so'z emas)
// Eslatma: o'zbekcha matnda apostrof (o', g', yo') bor — barcha matn maydonlari
// qo'sh tirnoq (") ichida yoziladi.

import type { SpeakingDay } from './types'

const day1: SpeakingDay = {
  day: 1, cefr: 'A0',
  title: "Salomlashish va tanishish",
  subtitle: "Birinchi suhbat — salom va ism",
  goalUz: "Birovni salomlay olasiz, ismingizni ayta olasiz va xayrlasha olasiz.",
  estMinutes: 12,
  pronunciationFocus: {
    sound: '/h/',
    ipaExample: '/h/ — hello, how, who',
    tipUz: "Tilingizni orqaga torting va nafas chiqaring — 'h' tovushi tomoqdan emas, nafas yo'lidan chiqadi.",
    tipEn: "Pull your tongue back and breathe out — the /h/ sound comes from your breath, not your throat.",
    commonError: "O'zbeklar /h/ ni ko'pincha 'x' bilan almashtiradi (xello → hello). 'H' yumshoqroq, tomoqdan emas.",
  },
  chunks: [
    { id: 'sp-d1-c1', en: "Hello!", uz: "Salom!", ipa: "/həˈloʊ/", grammarTip: "'Hello' — norasmiy salom. Rasmiy: 'Good morning/afternoon/evening'." },
    { id: 'sp-d1-c2', en: "My name is Aziz.", uz: "Mening ismim Aziz.", pattern: "My name is …", ipa: "/maɪ neɪm ɪz/", grammarTip: "'My name is …' — o'zingizni tanishtirish. Ism o'rniga istalgan ism qo'ying." },
    { id: 'sp-d1-c3', en: "Nice to meet you.", uz: "Tanishganimdan xursandman.", ipa: "/naɪs tə miːt juː/", grammarTip: "'Nice to meet you' — birinchi uchrashuvda ishlatiladi. 'Meet' = uchrashmoq (noto'g'ri fe'l: meet → met → met)." },
    { id: 'sp-d1-c4', en: "How are you?", uz: "Qalaysiz?", ipa: "/haʊ ɑːr juː/", grammarTip: "'How are you?' — so'rashda 'are' fe'li ishlatiladi. 'You' bilan 'are' birga keladi." },
    { id: 'sp-d1-c5', en: "I'm fine, thank you.", uz: "Yaxshi, rahmat.", ipa: "/aɪm faɪn θæŋk juː/", grammarTip: "'I'm' = 'I am' ning qisqartmasi. 'Thank you' — 'you' dan keyin 'thank' keladi." },
    { id: 'sp-d1-c6', en: "Goodbye!", uz: "Xayr!", ipa: "/ɡʊdˈbaɪ/", grammarTip: "'Goodbye' = 'God be with you' dan kelib chiqqan. Norasmiy: 'Bye!', 'See you!'" },
  ],
  scenario: {
    topic: "meeting someone new and introducing yourself",
    aiRole: "a friendly person at a party",
    userRole: "someone introducing themselves",
    opening: "Hi there! I don't think we've met. What's your name?",
    goalUz: "Salomlashing, ismingizni ayting va 'tanishganimdan xursandman' deng.",
  },
}

const day2: SpeakingDay = {
  day: 2, cefr: 'A0',
  title: "O'zingiz haqingizda",
  subtitle: "Yurt, shahar va kasb haqida",
  goalUz: "Qayerdan ekaningizni va nima ish qilishingizni ayta olasiz.",
  estMinutes: 12,
  pronunciationFocus: {
    sound: '/w/',
    ipaExample: '/w/ — where, what, welcome',
    tipUz: "Lablaringizni 'o' shakliga keltiring va tezda oching — /w/ tovushi lablar orqali chiqadi.",
    tipEn: "Round your lips like 'o' and quickly open them — the /w/ sound comes through your lips.",
    commonError: "O'zbeklar /w/ ni /v/ bilan almashtiradi (vat → what). Lablar yumaloq bo'lishi kerak!",
  },
  recycledChunkIds: ['sp-d1-c1', 'sp-d1-c4', 'sp-d1-c5'],
  chunks: [
    { id: 'sp-d2-c1', en: "I am from Uzbekistan.", uz: "Men O'zbekistondanman.", pattern: "I am from …", ipa: "/aɪ æm frəm/", grammarTip: "'I am from + place' — qayerdanligingizni aytish. 'I am' + 'from' + shahar/mamlakat." },
    { id: 'sp-d2-c2', en: "I live in Tashkent.", uz: "Men Toshkentda yashayman.", pattern: "I live in …", grammarTip: "'I live in + city' — qayerda yashashingizni aytish. 'In' shahar va mamlakatlar bilan ishlatiladi." },
    { id: 'sp-d2-c3', en: "I am a student.", uz: "Men talabaman.", pattern: "I am a …", grammarTip: "'I am a + kasb' — kasbingizni aytish. 'A' artikli kasb oldidan qo'yiladi." },
    { id: 'sp-d2-c4', en: "I work in an office.", uz: "Men ofisda ishlayman.", grammarTip: "'I work in …' — qayerda ishlashingizni aytish. 'An' unli bilan boshlangan so'z oldidan ('an office')." },
    { id: 'sp-d2-c5', en: "Where are you from?", uz: "Siz qayerdansiz?", ipa: "/wɛr ɑːr juː frəm/", grammarTip: "'Where are you from?' — so'roq so'zi 'Where' (qayer). So'roqda 'are' fe'l oldidan keladi." },
    { id: 'sp-d2-c6', en: "What do you do?", uz: "Nima ish qilasiz?", grammarTip: "'What do you do?' — kasb haqida so'rash. 'Do you do' — ikki marta 'do' ishlatiladi: birinchisi yordamchi, ikkinchisi asosiy fe'l." },
  ],
  scenario: {
    topic: "talking about where you are from and your job",
    aiRole: "a new colleague",
    userRole: "someone telling about themselves",
    opening: "Welcome! So, where are you from?",
    goalUz: "Qayerdan ekaningiz, qayerda yashashingiz va kasbingizni ayting.",
  },
}

const day3: SpeakingDay = {
  day: 3, cefr: 'A0',
  title: "Raqamlar, yosh, telefon",
  subtitle: "Ma'lumot almashish",
  goalUz: "Yoshingiz va telefon raqamingizni ayta olasiz, raqamlarni so'ray olasiz.",
  estMinutes: 13,
  pronunciationFocus: {
    sound: '/ð/',
    ipaExample: '/ð/ — the, this, that',
    tipUz: "Tilingizni tishlaringiz orasiga qo'ying va ovoz chiqaring — /ð/ tovushi 'd' va 'z' oralig'idagi tovush.",
    tipEn: "Place your tongue between your teeth and vibrate your vocal cords — /ð/ sounds between 'd' and 'z'.",
    commonError: "O'zbeklar /ð/ ni /d/ yoki /z/ bilan almashtiradi (dis → this, zis → this). Til tishlar orasida bo'lishi kerak!",
  },
  recycledChunkIds: ['sp-d1-c2', 'sp-d2-c1', 'sp-d2-c5'],
  chunks: [
    { id: 'sp-d3-c1', en: "I am twenty years old.", uz: "Men yigirma yoshdaman.", pattern: "I am … years old.", grammarTip: "'I am + yosh + years old' — yosh haqida gapirish. 'Years old' bilan yosh aytiladi. 'Twenty' = 20." },
    { id: 'sp-d3-c2', en: "How old are you?", uz: "Necha yoshdasiz?", ipa: "/haʊ oʊld ɑːr juː/", grammarTip: "'How old are you?' — yosh so'rash. 'How old' = necha yosh. 'Are' fe'l bilan so'roq yasaladi." },
    { id: 'sp-d3-c3', en: "My phone number is …", uz: "Mening telefon raqamim …", pattern: "My number is …", grammarTip: "'My phone number is …' — raqamni aytish. 'My' egalik olmoshi (mening). 'Phone number' = telefon raqam." },
    { id: 'sp-d3-c4', en: "Can you repeat that, please?", uz: "Iltimos, takrorlay olasizmi?", grammarTip: "'Can you …?' — muloyim iltimos. 'Can' modal fe'li (qila olasizmi?). 'Repeat' = takrorlamoq." },
    { id: 'sp-d3-c5', en: "What is your phone number?", uz: "Telefon raqamingiz nechi?", grammarTip: "'What is your …?' — ma'lumot so'rash. 'Your' = sizning (egalik olmoshi). So'roqda 'is' fe'l oldidan keladi." },
    { id: 'sp-d3-c6', en: "Sure, no problem.", uz: "Albatta, muammo yo'q.", grammarTip: "'Sure' = albatta. 'No problem' = muammo yo'q. Bu norasmiy ibora, do'stlar orasida ishlatiladi." },
  ],
  scenario: {
    topic: "exchanging phone numbers and ages",
    aiRole: "a new friend",
    userRole: "someone exchanging contact info",
    opening: "It was great talking to you! Can I get your phone number?",
    goalUz: "Raqamingizni ayting, unikidan so'rang va kerak bo'lsa takrorlashni so'rang.",
  },
}

const day4: SpeakingDay = {
  day: 4, cefr: 'A1',
  title: "Kafede buyurtma",
  subtitle: "Qahva va ovqat so'rash",
  goalUz: "Kafeda muloyim buyurtma bera olasiz va rahmat ayta olasiz.",
  estMinutes: 13,
  pronunciationFocus: {
    sound: '/æ/',
    ipaExample: '/æ/ — can, have, thanks',
    tipUz: "Og'zingizni katta oching — /æ/ tovushi 'a' va 'e' oralig'idagi tovush. O'zbek tilida bunday tovush yo'q!",
    tipEn: "Open your mouth wide — the /æ/ sound is between 'a' and 'e'. Uzbek doesn't have this sound.",
    commonError: "O'zbeklar /æ/ ni /a/ yoki /e/ bilan almashtiradi (ken → can, hev → have). Og'iz kattaroq ochilishi kerak!",
  },
  recycledChunkIds: ['sp-d1-c4', 'sp-d1-c5', 'sp-d3-c4'],
  chunks: [
    { id: 'sp-d4-c1', en: "Can I have a coffee, please?", uz: "Iltimos, menga qahva bering.", pattern: "Can I have …, please?", ipa: "/kæn aɪ hæv/", grammarTip: "'Can I have …?' — buyurtma berish uchun muloyim ibora. 'Please' = iltimos (oxirida yoki boshida ishlatiladi)." },
    { id: 'sp-d4-c2', en: "I'd like some water.", uz: "Men suv olmoqchiman.", pattern: "I'd like …", grammarTip: "'I'd like' = 'I would like' qisqartmasi. 'Some' = bir oz (sanalmaydigan otlar bilan). 'Would like' = xohlamoq (muloyim)." },
    { id: 'sp-d4-c3', en: "How much is it?", uz: "Bu qancha turadi?", ipa: "/haʊ mʌtʃ ɪz ɪt/", grammarTip: "'How much' = qancha (narx uchun). 'Is it' savolning oxirida: 'It is' → 'Is it?'" },
    { id: 'sp-d4-c4', en: "Here you are.", uz: "Mana, oling.", grammarTip: "'Here you are' — biror narsani uzatganda ishlatiladi. Turg'un ibora (fixed expression)." },
    { id: 'sp-d4-c5', en: "Thank you very much.", uz: "Katta rahmat.", grammarTip: "'Thank you very much' — kuchli minnatdorchilik. 'Very much' = juda ko'p (daraja bildiradi)." },
    { id: 'sp-d4-c6', en: "You are welcome.", uz: "Arzimaydi.", grammarTip: "'You are welcome' — 'rahmat' ga javob. Turg'un ibora. Norasmiy: 'No problem', 'Any time'." },
  ],
  scenario: {
    topic: "ordering a drink at a cafe",
    aiRole: "a friendly barista",
    userRole: "a customer",
    opening: "Hi! Welcome to our cafe. What can I get for you?",
    goalUz: "Qahva yoki suv buyurtma qiling, narxini so'rang va rahmat ayting.",
  },
}

const day5: SpeakingDay = {
  day: 5, cefr: 'A1',
  title: "Do'konda xarid",
  subtitle: "Narx so'rash va sotib olish",
  goalUz: "Do'konda narx so'ray olasiz va xarid qila olasiz.",
  estMinutes: 13,
  pronunciationFocus: {
    sound: '/aɪ/',
    ipaExample: '/aɪ/ — I'd, price, like',
    tipUz: "'A' dan boshlanib 'i' ga o'ting — /aɪ/ tovushi 'ay' sifatida talaffuz qilinadi. O'zbek tilidagi 'ay' ga o'xshaydi.",
    tipEn: "Start with 'a' and glide to 'i' — the /aɪ/ sound is pronounced like 'eye'. Similar to Uzbek 'ay'.",
  },
  recycledChunkIds: ['sp-d3-c4', 'sp-d4-c1', 'sp-d4-c3'],
  chunks: [
    { id: 'sp-d5-c1', en: "How much is this?", uz: "Bu qancha turadi?", pattern: "How much is …?", grammarTip: "'How much is this?' — bitta narsaning narxini so'rash. 'This' = bu (yaqin narsa uchun)." },
    { id: 'sp-d5-c2', en: "Do you have a smaller size?", uz: "Kichikroq o'lcham bormi?", pattern: "Do you have …?", grammarTip: "'Do you have …?' — biror narsa bormi deb so'rash. 'Smaller' = 'small' + '-er' (solishtirma daraja: kichikroq)." },
    { id: 'sp-d5-c3', en: "I'll take it.", uz: "Buni olaman.", grammarTip: "'I'll' = 'I will' (kelajak zamon). 'Take it' = olaman (qaror qabul qilganda ishlatiladi)." },
    { id: 'sp-d5-c4', en: "Can I pay by card?", uz: "Karta bilan to'lasam bo'ladimi?", grammarTip: "'Can I …?' — ruxsat so'rash. 'Pay by card' = karta bilan to'lash. 'By' = orqali, bilan." },
    { id: 'sp-d5-c5', en: "That is too expensive.", uz: "Bu juda qimmat.", grammarTip: "'That' = u, o'sha (uzoq narsa uchun). 'Too expensive' = juda qimmat. 'Too' = juda ham (salbiy ma'noda)." },
    { id: 'sp-d5-c6', en: "Just looking, thank you.", uz: "Shunchaki qarayapman, rahmat.", grammarTip: "'Just looking' = shunchaki qarayapman. 'Just' = shunchaki. Do'konda yordam kerak bo'lmaganda ishlatiladi." },
  ],
  scenario: {
    topic: "buying something in a shop",
    aiRole: "a shop assistant",
    userRole: "a customer",
    opening: "Hello! Can I help you find anything?",
    goalUz: "Narx so'rang, boshqa o'lcham bormi deb so'rang va sotib oling.",
  },
}

const day6: SpeakingDay = {
  day: 6, cefr: 'A1',
  title: "Yo'l so'rash",
  subtitle: "Ko'chada yo'nalish topish",
  goalUz: "Ko'chada yo'l so'ray olasiz va yo'nalishni tushuna olasiz.",
  estMinutes: 14,
  pronunciationFocus: {
    sound: '/eɪ/',
    ipaExample: '/eɪ/ — straight, take, place',
    tipUz: "'E' dan boshlanib 'i' ga o'ting — /eɪ/ tovushi o'zbek tilidagi 'ey' ga o'xshaydi.",
    tipEn: "Start with 'e' and glide to 'i' — the /eɪ/ sound is like Uzbek 'ey'.",
  },
  recycledChunkIds: ['sp-d3-c5', 'sp-d4-c3', 'sp-d5-c1'],
  chunks: [
    { id: 'sp-d6-c1', en: "Excuse me, where is the station?", uz: "Kechirasiz, bekat qayerda?", pattern: "Where is …?", grammarTip: "'Excuse me' — diqqatni jalb qilish uchun. 'Where is' + joy — biror joyni so'rash uchun asosiy qolip." },
    { id: 'sp-d6-c2', en: "How do I get to the bank?", uz: "Bankka qanday boraman?", pattern: "How do I get to …?", grammarTip: "'How do I get to …?' — biror joyga qanday borishni so'rash. 'Get to' = yetib bormoq." },
    { id: 'sp-d6-c3', en: "Go straight ahead.", uz: "To'g'riga yuring.", grammarTip: "'Go straight ahead' — to'g'riga yurish. 'Straight' = to'g'ri, 'ahead' = oldinga. Bu buyruq gap (imperative)." },
    { id: 'sp-d6-c4', en: "Turn left at the corner.", uz: "Burchakda chapga buriling.", grammarTip: "'Turn left/right' — burilish. 'At the corner' = burchakda. 'Turn' = burilmoq." },
    { id: 'sp-d6-c5', en: "It is next to the hospital.", uz: "U kasalxona yonida.", grammarTip: "'Next to' = yonida (joylashuvni ko'rsatadi). 'Is' fe'l bilan joylashuv aytiladi: 'It is + location'." },
    { id: 'sp-d6-c6', en: "Is it far from here?", uz: "Bu yerdan uzoqmi?", grammarTip: "'Is it far from …?' — biror joy uzoqligini so'rash. 'Far from' = uzoq. So'roqda 'is' boshida keladi." },
  ],
  scenario: {
    topic: "asking for and giving directions on the street",
    aiRole: "a helpful local person",
    userRole: "a tourist who is lost",
    opening: "You look a bit lost. Do you need some help?",
    goalUz: "Bekat yoki bankni qayerda deb so'rang va uzoqmi deb aniqlang.",
  },
}

const day7: SpeakingDay = {
  day: 7, cefr: 'A1',
  title: "Vaqt va uchrashuv",
  subtitle: "Soat va kun haqida",
  goalUz: "Vaqtni so'ray olasiz va uchrashuvga kelisha olasiz.",
  estMinutes: 13,
  pronunciationFocus: {
    sound: '/t/ vs /d/',
    ipaExample: '/t/ — time, meet, later / /d/ — day, good, sounds',
    tipUz: "/t/ tovushi tilsiz (ovoz chiqarmay), /d/ tovushi ovozli. Farqni sezish uchun qo'lingizni bo'g'zingizga qo'ying — /d/ da titrash seziladi.",
    tipEn: "/t/ is voiceless (no vibration), /d/ is voiced (vibration). Put your hand on your throat — /d/ vibrates.",
    commonError: "O'zbeklar so'z oxiridagi /t/ va /d/ ni farqlamaydi. 'Meet' va 'mead' bir xil talaffuz qilinmasligi kerak!",
  },
  recycledChunkIds: ['sp-d1-c4', 'sp-d2-c5', 'sp-d5-c1'],
  chunks: [
    { id: 'sp-d7-c1', en: "What time is it?", uz: "Soat necha?", ipa: "/wɒt taɪm ɪz ɪt/", grammarTip: "'What time is it?' — vaqt so'rash. 'Time' = vaqt. 'What' so'roq so'zi bilan boshlanadi." },
    { id: 'sp-d7-c2', en: "It is half past seven.", uz: "Hozir yetti yarim.", grammarTip: "'Half past + soat' = soat yarim. 'Half' = yarim. 'Past' = dan o'tdi. Masalan: 'half past two' = ikki yarim." },
    { id: 'sp-d7-c3', en: "Are you free tomorrow?", uz: "Ertaga bo'shmisiz?", pattern: "Are you free …?", grammarTip: "'Are you free …?' — bo'sh vaqtingiz bormi? 'Free' = bo'sh. 'Tomorrow' = ertaga. 'Are' fe'l so'roq boshida." },
    { id: 'sp-d7-c4', en: "Let's meet at three.", uz: "Soat uchda uchrashaylik.", pattern: "Let's meet at …", grammarTip: "'Let's' = 'Let us' (taklif). 'Meet at + vaqt' = soatda uchrashish. 'At' aniq vaqt bilan ishlatiladi." },
    { id: 'sp-d7-c5', en: "See you later!", uz: "Keyinroq ko'rishamiz!", grammarTip: "'See you later' — norasmiy xayrlashish. 'See' = ko'rmoq. 'Later' = keyinroq." },
    { id: 'sp-d7-c6', en: "Sounds good!", uz: "Yaxshi fikr!", grammarTip: "'Sounds good' — biror narsaga rozilik bildirish. 'Sound' + sifat (good, great, perfect). 'S' qo'shiladi chunki 'It sounds' dan qisqartma." },
  ],
  scenario: {
    topic: "making plans to meet a friend",
    aiRole: "a friend",
    userRole: "someone making plans",
    opening: "Hey! Are you free this weekend? I'd love to meet up.",
    goalUz: "Bo'shmisiz deb so'rang, vaqt taklif qiling va xayrlashing.",
  },
}

const day8: SpeakingDay = {
  day: 8, cefr: 'A1',
  title: "Oila va do'stlar",
  subtitle: "Yaqinlaringiz haqida gapirish",
  goalUz: "Oilangiz haqida oddiy gaplar ayta olasiz.",
  estMinutes: 13,
  pronunciationFocus: {
    sound: '/v/',
    ipaExample: '/v/ — have, very, live',
    tipUz: "Yuqori tishingizni pastki labingizga qo'ying va ovoz chiqaring — /v/ tovushi lab va tish orqali chiqadi.",
    tipEn: "Place your upper teeth on your lower lip and vibrate — the /v/ sound comes through teeth and lip.",
    commonError: "O'zbeklar /v/ ni /w/ bilan almashtiradi. 'Very' → 'wery' emas! Tish labga tegishi kerak.",
  },
  recycledChunkIds: ['sp-d1-c2', 'sp-d2-c3', 'sp-d4-c5'],
  chunks: [
    { id: 'sp-d8-c1', en: "I have a big family.", uz: "Mening katta oilam bor.", pattern: "I have …", grammarTip: "'I have' — menda bor. 'Have' ega bo'lmoq fe'li. 'A big family' = katta oila. 'Big' = katta (o'lcham/ son)." },
    { id: 'sp-d8-c2', en: "I have two brothers.", uz: "Mening ikkita akam bor.", grammarTip: "'Brothers' — ko'plik, 'brother' + 's'. Sondan keyin 's' qo'shiladi. 'Two brothers' = ikki aka (ko'plikda 's' qo'shiladi)." },
    { id: 'sp-d8-c3', en: "My father is a teacher.", uz: "Otam o'qituvchi.", pattern: "My … is a …", grammarTip: "'My father is a …' — otamning kasbini aytish. 'My' = mening. 'Is a' = -dir (artikl bilan)." },
    { id: 'sp-d8-c4', en: "Do you have any sisters?", uz: "Singillaringiz bormi?", grammarTip: "'Do you have any …?' — so'roq shakli. 'Any' = biror (so'roq gaplarda 'some' o'rnida ishlatiladi). 'Sisters' = singillar/ opalar." },
    { id: 'sp-d8-c5', en: "We live together.", uz: "Biz birga yashaymiz.", grammarTip: "'We' = biz (ko'plik olmoshi). 'Live together' = birga yashamoq. 'We' bilan fe'l o'zgarmaydi (live, not lives)." },
    { id: 'sp-d8-c6', en: "She is very kind.", uz: "U juda mehribon.", grammarTip: "'She' = u (ayol kishi). 'Very' = juda (daraja ravishi). 'Kind' = mehribon (sifat). 'She is + sifat' — kimdirning xarakteri haqida." },
  ],
  scenario: {
    topic: "talking about your family",
    aiRole: "a curious new friend",
    userRole: "someone describing their family",
    opening: "I'd love to know more about you. Do you have a big family?",
    goalUz: "Oilangiz katta yoki kichikligini, aka-uka va opa-singillaringizni ayting.",
  },
}

const day9: SpeakingDay = {
  day: 9, cefr: 'A1',
  title: "Kundalik tartib",
  subtitle: "Bir kuningizni tasvirlash",
  goalUz: "Odatda kuningiz qanday o'tishini ayta olasiz.",
  estMinutes: 14,
  pronunciationFocus: {
    sound: '/iː/ vs /ɪ/',
    ipaExample: '/iː/ — teacher, three, evening / /ɪ/ — it, in, sit',
    tipUz: "/iː/ uzun va tarang, /ɪ/ qisqa va bo'sh. 'Seat' (/iː/) va 'sit' (/ɪ/) farqiga e'tibor bering — bular butunlay boshqa so'zlar!",
    tipEn: "/iː/ is long and tense, /ɪ/ is short and relaxed. Notice the difference between 'seat' (/iː/) and 'sit' (/ɪ/) — they're different words!",
    commonError: "O'zbeklar /iː/ va /ɪ/ ni farqlamaydi. 'Ship' va 'sheep' bir xil talaffuz qilinmasligi kerak — ma'nosi butunlay boshqa!",
  },
  recycledChunkIds: ['sp-d1-c5', 'sp-d2-c4', 'sp-d7-c4'],
  chunks: [
    { id: 'sp-d9-c1', en: "I get up at seven.", uz: "Men yettida turaman.", pattern: "I get up at …", grammarTip: "'Get up' = uyg'onib turmoq (phrasal verb). 'At + vaqt' — aniq vaqtni ko'rsatadi. 'Get' → 'got' → 'got' (noto'g'ri fe'l)." },
    { id: 'sp-d9-c2', en: "I go to work by bus.", uz: "Men ishga avtobusda boraman.", grammarTip: "'Go to + joy' — biror joyga bormoq. 'Go' → 'went' → 'gone' (noto'g'ri fe'l). 'By bus' = avtobusda (transport bilan)." },
    { id: 'sp-d9-c3', en: "I have lunch at noon.", uz: "Men tushda tushlik qilaman.", grammarTip: "'Have lunch' = tushlik qilmoq. 'Have' + ovqat (have breakfast/lunch/dinner). 'At noon' = tushda, soat 12:00 da." },
    { id: 'sp-d9-c4', en: "I go home in the evening.", uz: "Men kechqurun uyga boraman.", grammarTip: "'Go home' — 'home' dan oldin 'to' qo'yilmaydi! 'In the evening' = kechqurun (vaqt qismi uchun 'in')." },
    { id: 'sp-d9-c5', en: "I go to bed at eleven.", uz: "Men o'n birda uxlayman.", grammarTip: "'Go to bed' = uxlashga yotmoq. 'Go to bed at + vaqt'. 'Eleven' = 11. 'At' aniq soat bilan ishlatiladi." },
    { id: 'sp-d9-c6', en: "What do you do every day?", uz: "Har kuni nima qilasiz?", grammarTip: "'What do you do?' — bu yerda 'do' ikki marta: birinchi 'do' yordamchi fe'l, ikkinchi 'do' asosiy fe'l. 'Every day' = har kuni." },
  ],
  scenario: {
    topic: "describing your daily routine",
    aiRole: "a friend who is curious about your day",
    userRole: "someone describing a normal day",
    opening: "So tell me, what does a normal day look like for you?",
    goalUz: "Ertalabdan kechgacha odatdagi kuningizni tartib bilan ayting.",
  },
}

const day10: SpeakingDay = {
  day: 10, cefr: 'A1',
  title: "Kichik suhbat",
  subtitle: "Salomlashish va kun haqida",
  goalUz: "Tanishlar bilan kichik suhbat qura olasiz.",
  estMinutes: 12,
  pronunciationFocus: {
    sound: '/aʊ/',
    ipaExample: '/aʊ/ — how, now, about',
    tipUz: "'A' dan boshlanib 'u' ga o'ting — /aʊ/ tovushi o'zbek tilidagi 'au' ga o'xshaydi. Lablarni yumaloqlang.",
    tipEn: "Start with 'a' and glide to 'u' — the /aʊ/ sound is like 'ow' in 'how'. Round your lips.",
  },
  recycledChunkIds: ['sp-d1-c4', 'sp-d1-c5', 'sp-d7-c5'],
  chunks: [
    { id: 'sp-d10-c1', en: "How are you doing?", uz: "Qalaysiz, ishlar qalay?", grammarTip: "'How are you doing?' — norasmiy so'rash. 'Doing' = 'do' ning davomli zamon shakli. 'How are you?' dan ko'ra norasmiyroq." },
    { id: 'sp-d10-c2', en: "Not bad, thanks.", uz: "Yomon emas, rahmat.", grammarTip: "'Not bad' = yomon emas (o'rtacha javob). 'Not' + sifat — inkor qilish. 'Thanks' = 'thank you' qisqartmasi (norasmiy)." },
    { id: 'sp-d10-c3', en: "How was your day?", uz: "Kuningiz qanday o'tdi?", grammarTip: "'How was your day?' — o'tgan zamon ('was' = Past Simple). 'Was' = 'am/is' ning o'tgan zamon shakli." },
    { id: 'sp-d10-c4', en: "It was good, thank you.", uz: "Yaxshi o'tdi, rahmat.", grammarTip: "'It was good' — javob (Past Simple). 'Was' o'tgan zamon fe'li. 'Good' = yaxshi (sifat)." },
    { id: 'sp-d10-c5', en: "See you tomorrow!", uz: "Ertaga ko'rishamiz!", grammarTip: "'See you tomorrow' — ertaga ko'rishganda ishlatiladi. 'Tomorrow' = ertaga. 'See' = ko'rmoq." },
    { id: 'sp-d10-c6', en: "Have a nice day!", uz: "Kuningiz yaxshi o'tsin!", grammarTip: "'Have a nice day' — tilak bildirish. 'Have' + 'a' + sifat + 'day'. Ayirilganda, xarid qilganda ishlatiladi." },
  ],
  scenario: {
    topic: "small talk with a neighbour",
    aiRole: "a friendly neighbour",
    userRole: "you",
    opening: "Good morning! How are you doing today?",
    goalUz: "Salomlashing, kuningiz haqida gaplashing va xayrlashing.",
  },
}

const day11: SpeakingDay = {
  day: 11, cefr: 'A1',
  title: "Sevimli mashg'ulotlar",
  subtitle: "Bo'sh vaqt va qiziqishlar",
  goalUz: "Nimani yoqtirishingizni ayta olasiz.",
  estMinutes: 13,
  pronunciationFocus: {
    sound: '/ŋ/',
    ipaExample: '/ŋ/ — playing, doing, reading',
    tipUz: "Tilingizning orqa qismini tanglayga tegizing va borun orqali nafas chiqaring — /ŋ/ tovushi 'ng' sifatida talaffuz qilinadi.",
    tipEn: "Press the back of your tongue against your soft palate and breathe through your nose — /ŋ/ is pronounced like 'ng'.",
    commonError: "O'zbeklar /ŋ/ ni /n/ yoki /g/ bilan almashtiradi. 'Playing' → 'playin' emas! Til orqada bo'lishi kerak.",
  },
  recycledChunkIds: ['sp-d3-c4', 'sp-d8-c1', 'sp-d9-c6'],
  chunks: [
    { id: 'sp-d11-c1', en: "I like playing football.", uz: "Men futbol o'ynashni yoqtiraman.", pattern: "I like …-ing", grammarTip: "'Like + -ing' — biror narsani yoqtirish. 'Play' → 'playing'. Fe'lga '-ing' qo'shiladi: like + V-ing." },
    { id: 'sp-d11-c2', en: "In my free time, I read books.", uz: "Bo'sh vaqtimda kitob o'qiyman.", grammarTip: "'In my free time' = bo'sh vaqtimda. 'Free time' = bo'sh vaqt. 'Read' → 'read' → 'read' (noto'g'ri fe'l, yozilishi bir xil, talaffuzi farq)." },
    { id: 'sp-d11-c3', en: "I don't like video games.", uz: "Men video o'yinlarni yoqtirmayman.", grammarTip: "'Don't like' = yoqtirmaslik. 'Do not' → 'don't' (inkor). 'Don't' + asosiy fe'l (do, go, like)." },
    { id: 'sp-d11-c4', en: "What do you like doing?", uz: "Nima qilishni yoqtirasiz?", grammarTip: "'What do you like doing?' — qiziqish haqida so'rash. 'Like + doing' bilan savol: What + do + you + like + V-ing?" },
    { id: 'sp-d11-c5', en: "I watch films at the weekend.", uz: "Hafta oxiri film ko'raman.", grammarTip: "'At the weekend' = hafta oxirida (Britaniya ingliz tilida). 'Watch' = ko'rmoq (TV/film). 'Films' = kinolar." },
    { id: 'sp-d11-c6', en: "That sounds fun!", uz: "Bu qiziq-ku!", grammarTip: "'That sounds + sifat' — bu … tuyuladi. 'Sound' hissiy fe'l (sensation verb), undan keyin sifat keladi (fun, great, nice)." },
  ],
  scenario: {
    topic: "chatting about hobbies",
    aiRole: "a new friend",
    userRole: "you",
    opening: "So, what do you like doing in your free time?",
    goalUz: "Sevimli mashg'ulotlaringizni ayting va do'stingizdan so'rang.",
  },
}

const day12: SpeakingDay = {
  day: 12, cefr: 'A1',
  title: "Ovqat va ichimlik",
  subtitle: "Ochlik va tanlov",
  goalUz: "Ochligingizni ayta va ovqat tanlay olasiz.",
  estMinutes: 13,
  pronunciationFocus: {
    sound: '/dʒ/',
    ipaExample: '/dʒ/ — delicious, juice, job',
    tipUz: "'J' tovushi — til uchini tanglayga tegizib, keyin keskin qo'yib yuboring. O'zbek tilidagi 'j' ga o'xshaydi, lekin kuchliroq.",
    tipEn: "The 'j' sound — touch your tongue to your palate and release sharply. Similar to Uzbek 'j' but stronger.",
  },
  recycledChunkIds: ['sp-d4-c2', 'sp-d4-c5', 'sp-d9-c3'],
  chunks: [
    { id: 'sp-d12-c1', en: "I'm hungry.", uz: "Men ochman.", grammarTip: "'I'm' = 'I am' (qisqartma). 'Hungry' = och (sifat). 'Be + hungry' — och bo'lmoq. 'I am' + sifat." },
    { id: 'sp-d12-c2', en: "What would you like to eat?", uz: "Nima yegingiz keladi?", grammarTip: "'Would you like …?' — muloyim taklif. 'Would like' = xohlamoq. 'Would you like to + V' — biror narsani xohlaysizmi?" },
    { id: 'sp-d12-c3', en: "I'd like some bread and tea.", uz: "Men non va choy istayman.", grammarTip: "'I'd like some …' = men bir oz … istayman. 'Some' = bir oz (sanalmaydigan otlar bilan). 'Bread' = non (sanalmaydi)." },
    { id: 'sp-d12-c4', en: "Do you want some water?", uz: "Suv xohlaysizmi?", grammarTip: "'Do you want …?' — taklif qilish. 'Want' = xohlamoq. 'Some water' = bir oz suv. 'Water' = suv (sanalmaydigan ot)." },
    { id: 'sp-d12-c5', en: "This food is delicious.", uz: "Bu ovqat mazali.", grammarTip: "'This food' = bu ovqat (yaqin narsa). 'Delicious' = mazali (sifat). 'This' + ot + 'is' + sifat — narsani tasvirlash." },
    { id: 'sp-d12-c6', en: "No, thank you, I'm full.", uz: "Yo'q, rahmat, to'ydim.", grammarTip: "'No, thank you' — muloyim rad etish. 'Full' = to'q. 'I'm full' = men to'ydim. 'I'm + sifat' holatni bildirish." },
  ],
  scenario: {
    topic: "offering and choosing food at home",
    aiRole: "a kind host",
    userRole: "a guest",
    opening: "You must be hungry! What would you like to eat?",
    goalUz: "Ochligingizni ayting, ovqat tanlang va fikr bildiring.",
  },
}

const day13: SpeakingDay = {
  day: 13, cefr: 'A1',
  title: "Ranglar va narsalar",
  subtitle: "Narsalarni nomlash",
  goalUz: "Narsalar va ranglarni ayta olasiz.",
  estMinutes: 12,
  pronunciationFocus: {
    sound: '/z/',
    ipaExample: '/z/ — is, his, whose, colours',
    tipUz: "/z/ tovushi ovozli — bo'g'zingiz titrashi kerak. O'zbek tilidagi 'z' ga o'xshaydi, lekin ko'pincha so'z oxirida ishlatiladi.",
    tipEn: "/z/ is voiced — your throat should vibrate. Similar to Uzbek 'z', but often used at the end of words.",
    commonError: "O'zbeklar so'z oxiridagi /z/ ni /s/ bilan almashtiradi. 'Is' → 'is' emas, 'iss' deb talaffuz qilinadi! Z ovozli.",
  },
  recycledChunkIds: ['sp-d3-c2', 'sp-d8-c3', 'sp-d11-c4'],
  chunks: [
    { id: 'sp-d13-c1', en: "What colour is it?", uz: "Bu qanday rangda?", grammarTip: "'What colour is it?' — rang so'rash. 'Colour' = rang (Britaniya). 'What colour' + 'is' + 'it'?" },
    { id: 'sp-d13-c2', en: "It is blue.", uz: "U ko'k rangda.", grammarTip: "'It is + colour' — narsaning rangini aytish. 'Is' + rang (blue, red, green). 'It' = u (jonsiz narsa)." },
    { id: 'sp-d13-c3', en: "This is my bag.", uz: "Bu mening sumkam.", pattern: "This is my …", grammarTip: "'This is my …' — bu mening … im. 'This' = bu (yaqin). 'My' = mening (egalik olmoshi)." },
    { id: 'sp-d13-c4', en: "Whose pen is this?", uz: "Bu kimning ruchkasi?", grammarTip: "'Whose' = kimning (egalik so'roq olmoshi). 'Whose + ot + is this?' — bu kimning … i?" },
    { id: 'sp-d13-c5', en: "It's mine.", uz: "Bu meniki.", grammarTip: "'Mine' = meniki (egalik olmoshi, otdan keyin ishlatilmaydi). 'My' + ot emas, 'Mine' mustaqil: 'It's mine' = bu meniki." },
    { id: 'sp-d13-c6', en: "I like the red one.", uz: "Menga qizili yoqadi.", grammarTip: "'The red one' = qizili. 'One' so'zi avvalgi otning o'rnida ishlatiladi (noun substitution). 'I like + the + colour + one'." },
  ],
  scenario: {
    topic: "identifying objects and colours",
    aiRole: "a friend",
    userRole: "you",
    opening: "I love your bag! What colour is it?",
    goalUz: "Narsalar va ranglar haqida gapiring.",
  },
}

const day14: SpeakingDay = {
  day: 14, cefr: 'A1',
  title: "Uy va xonalar",
  subtitle: "Uyni tasvirlash",
  goalUz: "Uyingiz va xonalarni tasvirlay olasiz.",
  estMinutes: 13,
  pronunciationFocus: {
    sound: '/eə/',
    ipaExample: '/eə/ — there, where, chair',
    tipUz: "'E' dan boshlanib 'ə' ga o'ting — /eə/ tovushi 'ea' sifatida talaffuz qilinadi. O'zbek tilida bu tovush yo'q.",
    tipEn: "Start with 'e' and glide to 'ə' — the /eə/ sound is pronounced like 'air'. Uzbek doesn't have this sound.",
    commonError: "O'zbeklar /eə/ ni /e/ bilan almashtiradi. 'There' → 'zer' emas! Tovush cho'zilgan va ikki qismdan iborat.",
  },
  recycledChunkIds: ['sp-d6-c1', 'sp-d6-c5', 'sp-d12-c5'],
  chunks: [
    { id: 'sp-d14-c1', en: "There is a big kitchen.", uz: "Katta oshxona bor.", pattern: "There is …", grammarTip: "'There is + birlik ot' — biror narsa borligini aytish. 'There is' birlik va sanalmaydigan otlar bilan. 'A big kitchen' = katta oshxona." },
    { id: 'sp-d14-c2', en: "There are two bedrooms.", uz: "Ikkita yotoqxona bor.", pattern: "There are …", grammarTip: "'There are + ko'plik ot' — bir nechta narsa bor. 'There are' ko'plik bilan. 'Two bedrooms' = ikki yotoqxona." },
    { id: 'sp-d14-c3', en: "My room is small but nice.", uz: "Xonam kichik, lekin chiroyli.", grammarTip: "'But' = lekin (zidlov bog'lovchi). 'Small' va 'nice' — ikki sifat. 'But' ikkala sifatni bog'laydi: small BUT nice." },
    { id: 'sp-d14-c4', en: "Where is the bathroom?", uz: "Hammom qayerda?", grammarTip: "'Where is the …?' — biror joyni so'rash. 'Where' so'roq so'zi bilan boshlanadi. 'The' aniq artikl — ma'lum bir hammom." },
    { id: 'sp-d14-c5', en: "It's next to the kitchen.", uz: "U oshxona yonida.", grammarTip: "'Next to' = yonida. 'It's next to + joy'. 'The' aniq artikl — ma'lum joy. 'Next to' o'rnida 'beside' ham ishlatiladi." },
    { id: 'sp-d14-c6', en: "Welcome to my home!", uz: "Uyimga xush kelibsiz!", grammarTip: "'Welcome to …' — xush kelibsiz. 'My home' = mening uyim. 'Welcome' fe'l + 'to' + joy. Turg'un ibora." },
  ],
  scenario: {
    topic: "showing someone around your home",
    aiRole: "a guest",
    userRole: "you",
    opening: "What a lovely home! Can you show me around?",
    goalUz: "Uyingiz va xonalarni tasvirlang.",
  },
}

const day15: SpeakingDay = {
  day: 15, cefr: 'A1',
  title: "Hayvonlar",
  subtitle: "Uy hayvonlari haqida",
  goalUz: "Hayvonlar va uy hayvonlari haqida gapira olasiz.",
  estMinutes: 12,
  pronunciationFocus: {
    sound: '/k/ vs /g/',
    ipaExample: '/k/ — cat, cute / /g/ — dog, good',
    tipUz: "/k/ tilsiz (ovoz chiqmaydi), /g/ ovozli. Qo'lingizni bo'g'zingizga qo'ying: /k/ da titrash yo'q, /g/ da bor.",
    tipEn: "/k/ is voiceless (no vibration), /g/ is voiced (vibration). Put your hand on your throat: /k/ no vibration, /g/ yes.",
  },
  recycledChunkIds: ['sp-d2-c1', 'sp-d8-c1', 'sp-d13-c5'],
  chunks: [
    { id: 'sp-d15-c1', en: "I have a cat.", uz: "Mening mushugim bor.", grammarTip: "'I have a …' — menda … bor. 'A cat' = bitta mushuk. 'Cat' sanaladigan ot, shuning uchun 'a' artikli kerak." },
    { id: 'sp-d15-c2', en: "Do you have any pets?", uz: "Uy hayvoningiz bormi?", grammarTip: "'Do you have any …?' — so'roq shakli. 'Any' — so'roq va inkor gaplarda ishlatiladi. 'Pets' = uy hayvonlari (pets = uy hayvonlari)." },
    { id: 'sp-d15-c3', en: "The dog is very friendly.", uz: "It juda do'stona.", grammarTip: "'The dog' = ma'lum bir it. 'Very friendly' = juda do'stona. 'Friendly' sifat, lekin '-ly' bilan tugaydi (not adverb!)." },
    { id: 'sp-d15-c4', en: "I love animals.", uz: "Men hayvonlarni yaxshi ko'raman.", grammarTip: "'Love' = yoqtirmoq (like dan kuchli). 'Animals' = hayvonlar (ko'plik). 'I love + ko'plik' — umumiy narsani yoqtirish." },
    { id: 'sp-d15-c5', en: "Cats are cute.", uz: "Mushuklar yoqimli.", grammarTip: "'Cats are …' — umumiy gap (barcha mushuklar haqida). Ko'plik ot + 'are' + sifat. Artiklsiz ko'plik = umumiy ma'no." },
    { id: 'sp-d15-c6', en: "What's your favourite animal?", uz: "Sevimli hayvoningiz qaysi?", grammarTip: "'What's your favourite …?' — sevimli narsani so'rash. 'What's' = 'What is'. 'Favourite' = sevimli. 'Animal' = hayvon." },
  ],
  scenario: {
    topic: "talking about pets and animals",
    aiRole: "an animal lover",
    userRole: "you",
    opening: "Aww, do you have any pets at home?",
    goalUz: "Hayvonlar va uy hayvonlari haqida gapiring.",
  },
}

const day16: SpeakingDay = {
  day: 16, cefr: 'A1',
  title: "Kiyim",
  subtitle: "Kiyim haqida gapirish",
  goalUz: "Kiyimlaringiz haqida oddiy gaplar ayta olasiz.",
  estMinutes: 12,
  pronunciationFocus: {
    sound: '/ɜː/',
    ipaExample: '/ɜː/ — shirt, work, comfortable',
    tipUz: "Tilingizni o'rtaga qo'ying va lablaringizni yumaloqlamang — /ɜː/ tovushi o'zbek tilidagi 'o' ga o'xshaydi, lekin lablar yumaloq emas.",
    tipEn: "Place your tongue in the middle and don't round your lips — /ɜː/ sounds similar to Uzbek 'o' but lips are not rounded.",
  },
  recycledChunkIds: ['sp-d13-c2', 'sp-d13-c3', 'sp-d10-c1'],
  chunks: [
    { id: 'sp-d16-c1', en: "I'm wearing a blue shirt.", uz: "Men ko'k ko'ylak kiyganman.", pattern: "I'm wearing …", grammarTip: "'I'm wearing' = men kiyganman (Present Continuous). 'Wear' = kiymoq. Present Continuous hozirgi harakat uchun: am/is/are + V-ing." },
    { id: 'sp-d16-c2', en: "I need a new jacket.", uz: "Menga yangi kurtka kerak.", grammarTip: "'I need a …' = menga … kerak. 'Need' = kerak bo'lmoq. 'A new jacket' = yangi kurtka. 'New' = yangi (sifat otdan oldin)." },
    { id: 'sp-d16-c3', en: "These shoes are nice.", uz: "Bu poyabzal chiroyli.", grammarTip: "'These' = bular (ko'plik). 'These shoes' = bu poyabzallar. 'Are' ko'plik bilan. 'These' = bu (ko'plik), 'This' = bu (birlik)." },
    { id: 'sp-d16-c4', en: "It's a bit cold, take a coat.", uz: "Biroz sovuq, palto oling.", grammarTip: "'A bit' = biroz (daraja bildiradi). 'Take a coat' = palto oling. 'Take' = olmoq (buyruq gap 'you' bilan)." },
    { id: 'sp-d16-c5', en: "What size are you?", uz: "O'lchamingiz qancha?", grammarTip: "'What size are you?' — o'lcham so'rash. 'Size' = o'lcham. 'What + ot + are you?' qolipi bilan so'rash." },
    { id: 'sp-d16-c6', en: "I like comfortable clothes.", uz: "Men qulay kiyimni yoqtiraman.", grammarTip: "'Comfortable' = qulay (sifat). 'Clothes' = kiyim (har doim ko'plik). 'I like + ko'plik' = men …ni yoqtiraman." },
  ],
  scenario: {
    topic: "talking about clothes",
    aiRole: "a friend",
    userRole: "you",
    opening: "Nice jacket! Where did you get it?",
    goalUz: "Kiyimlaringiz haqida gapiring.",
  },
}

const day17: SpeakingDay = {
  day: 17, cefr: 'A1',
  title: "Hislar va kayfiyat",
  subtitle: "O'zini qanday his qilish",
  goalUz: "Hislaringizni ayta va do'stni tinchlantira olasiz.",
  estMinutes: 12,
  pronunciationFocus: {
    sound: '/ʃ/',
    ipaExample: '/ʃ/ — shirt, sure, should',
    tipUz: "Tilingizni tanglayga yaqinlashtirib, nafas chiqaring — /ʃ/ tovushi o'zbek tilidagi 'sh' ga o'xshaydi.",
    tipEn: "Bring your tongue close to the palate and breathe out — the /ʃ/ sound is like 'sh'.",
  },
  recycledChunkIds: ['sp-d1-c4', 'sp-d10-c3', 'sp-d10-c4'],
  chunks: [
    { id: 'sp-d17-c1', en: "I'm very happy today.", uz: "Bugun men juda baxtliman.", grammarTip: "'I'm + adjective' — holatni bildirish. 'Very' = juda (daraja ravishi). 'Happy' = baxtli. 'Today' = bugun (vaqt belgisi)." },
    { id: 'sp-d17-c2', en: "I feel tired.", uz: "O'zimni charchagan his qilaman.", grammarTip: "'I feel + sifat' — o'zimni … his qilaman. 'Feel' = his qilmoq (sensation verb). 'Feel' dan keyin sifat keladi: feel tired, feel happy." },
    { id: 'sp-d17-c3', en: "Are you okay?", uz: "Yaxshimisiz?", grammarTip: "'Are you okay?' — holat so'rash. 'Okay' = yaxshi. So'roq: 'Are' + 'you' + sifat. 'Okay' = OK deb yoziladi." },
    { id: 'sp-d17-c4', en: "Don't worry, it's fine.", uz: "Xavotir olmang, hammasi joyida.", grammarTip: "'Don't worry' = xavotir olmang (buyruq gap). 'Don't' + asosiy fe'l — buyruqda inkor. 'It's fine' = hammasi joyida." },
    { id: 'sp-d17-c5', en: "I'm a little nervous.", uz: "Men biroz hayajondaman.", grammarTip: "'A little' = biroz (daraja). 'Nervous' = hayajonli. 'I'm a little + sifat' = men biroz …man." },
    { id: 'sp-d17-c6', en: "Cheer up!", uz: "Xafa bo'lmang!", grammarTip: "'Cheer up!' — ruhlanishga undash. Phrasal verb: 'cheer up' = ko'ngil ko'tarmoq. Turg'un ibora, buyruq gap." },
  ],
  scenario: {
    topic: "talking about how you feel",
    aiRole: "a caring friend",
    userRole: "you",
    opening: "You look a bit down. Are you okay?",
    goalUz: "Hislaringizni ayting va do'stingizni tinchlantiring.",
  },
}

const day18: SpeakingDay = {
  day: 18, cefr: 'A1',
  title: "Maktab va o'qish",
  subtitle: "O'qish haqida oddiy gaplar",
  goalUz: "O'qish va fanlaringiz haqida gapira olasiz.",
  estMinutes: 13,
  pronunciationFocus: {
    sound: '/θ/',
    ipaExample: '/θ/ — maths, think, three',
    tipUz: "Tilingizni tishlaringiz orasiga qo'ying va nafas chiqaring, lekin ovoz chiqarmang — /θ/ tovushi tilsiz 'th'.",
    tipEn: "Place your tongue between your teeth and breathe out without vibrating — /θ/ is the voiceless 'th'.",
    commonError: "O'zbeklar /θ/ ni /s/ yoki /t/ bilan almashtiradi. 'Maths' → 'mats' emas! Til tishlar orasida bo'lishi kerak.",
  },
  recycledChunkIds: ['sp-d9-c2', 'sp-d9-c6', 'sp-d15-c4'],
  chunks: [
    { id: 'sp-d18-c1', en: "I study English every day.", uz: "Men har kuni ingliz tili o'rganaman.", grammarTip: "'I study' = men o'qiyman. 'Study' → 'studies' (he/she da -s qo'shiladi: He studies). 'Every day' = har kuni (chastota)." },
    { id: 'sp-d18-c2', en: "My favourite subject is maths.", uz: "Sevimli fanim — matematika.", grammarTip: "'My favourite … is …' = mening sevimli …im … . 'Subject' = fan/dars. 'Maths' = matematika (Britaniya, US: math)." },
    { id: 'sp-d18-c3', en: "I go to school by bus.", uz: "Maktabga avtobusda boraman.", grammarTip: "'Go to school' — maktabga bormoq (artiklsiz! 'The school' = ma'lum bino). 'By bus' = avtobusda (transport bilan 'by')." },
    { id: 'sp-d18-c4', en: "Learning is fun.", uz: "O'rganish qiziqarli.", grammarTip: "'Learning' = o'rganish (gerund — fe'lning ot shakli). Gerund egasi vazifasida: 'Learning + is + sifat'. '-ing' shakli ot sifatida." },
    { id: 'sp-d18-c5', en: "I have homework today.", uz: "Bugun uy vazifam bor.", grammarTip: "'Have homework' = uy vazifasi bor. 'Homework' = uy vazifasi (sanalmaydi, 'a' qo'yilmaydi). 'Today' = bugun." },
    { id: 'sp-d18-c6', en: "What are you studying?", uz: "Nima o'qiyapsiz?", grammarTip: "'What are you studying?' — Present Continuous. 'Are you + V-ing?' — hozirgi paytda nima qilyapsiz? 'Study' → 'studying'." },
  ],
  scenario: {
    topic: "talking about school and studies",
    aiRole: "a classmate",
    userRole: "you",
    opening: "Hey! What subjects are you studying these days?",
    goalUz: "O'qish va fanlaringiz haqida gapiring.",
  },
}

const day19: SpeakingDay = {
  day: 19, cefr: 'A2',
  title: "Yoqtirish va yoqtirmaslik",
  subtitle: "Fikr bildirish",
  goalUz: "Nimani yoqtirishingiz va yoqtirmasligingizni ayta olasiz.",
  estMinutes: 14,
  pronunciationFocus: {
    sound: '/f/ vs /v/',
    ipaExample: '/f/ — food, favourite, coffee / /v/ — very, have, live',
    tipUz: "/f/ tilsiz (ovozsiz), /v/ ovozli. Ikkalasida ham tish labga tegadi. Farq: /f/ da bo'g'iz titramaydi, /v/ da titraydi.",
    tipEn: "/f/ is voiceless, /v/ is voiced. Both have teeth on lower lip. Difference: /f/ no throat vibration, /v/ vibrates.",
    commonError: "O'zbeklar bu ikki tovushni farqlamaydi. 'Very' → 'fery' emas! Tish labga tegishi kerak.",
  },
  recycledChunkIds: ['sp-d11-c1', 'sp-d11-c4', 'sp-d12-c3'],
  chunks: [
    { id: 'sp-d19-c1', en: "I like coffee very much.", uz: "Men qahvani juda yaxshi ko'raman.", pattern: "I like …", grammarTip: "'I like + narsa + very much' = men …ni juda yoqtiraman. 'Very much' = juda (daraja bildiradi). 'Coffee' = qahva (sanalmaydi)." },
    { id: 'sp-d19-c2', en: "I don't like cold weather.", uz: "Men sovuq havoni yoqtirmayman.", pattern: "I don't like …", grammarTip: "'Don't like' = yoqtirmaslik. 'Don't' = 'do not' (inkor). 'Cold weather' = sovuq havo. 'Weather' = havo (sanalmaydi, 'a' qo'yilmaydi)." },
    { id: 'sp-d19-c3', en: "My favourite food is plov.", uz: "Mening sevimli taomim — palov.", pattern: "My favourite … is …", grammarTip: "'My favourite food is …' = sevimli taomim. 'Favourite' = sevimli. 'Food' = taom/ovqat (sanalmaydigan ot)." },
    { id: 'sp-d19-c4', en: "I prefer tea to coffee.", uz: "Men qahvadan ko'ra choyni afzal ko'raman.", grammarTip: "'Prefer A to B' = A ni B dan afzal ko'rmoq. 'Prefer' = afzal ko'rmoq. 'To' solishtirish uchun ishlatiladi." },
    { id: 'sp-d19-c5', en: "What do you like to do?", uz: "Nima qilishni yoqtirasiz?", grammarTip: "'What do you like to do?' — qiziqish so'rash. 'Like to do' = 'like doing' bilan bir xil ma'no. 'Like + to V' yoki 'like + V-ing'." },
    { id: 'sp-d19-c6', en: "That is my favourite!", uz: "Bu mening sevimlim!", grammarTip: "'That' = u (uzoq narsa). 'My favourite' = mening sevimlim. 'Favourite' otdan keyin mustaqil ishlatilishi mumkin." },
  ],
  scenario: {
    topic: "talking about food and things you like",
    aiRole: "a friend at a restaurant",
    userRole: "someone sharing preferences",
    opening: "This place has everything! What kind of food do you like?",
    goalUz: "Yoqtirgan va yoqtirmagan narsalaringizni, sevimli taomingizni ayting.",
  },
}

const day20: SpeakingDay = {
  day: 20, cefr: 'A2',
  title: "Kecha nima qildingiz",
  subtitle: "O'tgan zamon (Past Simple)",
  goalUz: "O'tgan kuningiz haqida oddiy gaplar ayta olasiz.",
  estMinutes: 14,
  pronunciationFocus: {
    sound: '/d/ vs /t/ (past endings)',
    ipaExample: '/d/ — played, stayed, called / /t/ — watched, walked, missed',
    tipUz: "O'tgan zamonda '-ed' qo'shimchasi uch xil talaffuz qilinadi: /d/ (ovozlilardan keyin: played), /t/ (tilsizlardan keyin: watched), /ɪd/ ('t' va 'd' dan keyin: wanted).",
    tipEn: "The '-ed' ending has three pronunciations: /d/ (after voiced: played), /t/ (after voiceless: watched), /ɪd/ (after 't' and 'd': wanted).",
    commonError: "O'zbeklar '-ed' ni har doim /d/ deb talaffuz qiladi. 'Watched' → 'watch-d' emas, 'watch-t'! So'nggi tovushga qarab o'zgaradi.",
  },
  recycledChunkIds: ['sp-d9-c2', 'sp-d10-c3', 'sp-d10-c4'],
  chunks: [
    { id: 'sp-d20-c1', en: "Yesterday I went to the park.", uz: "Kecha men parkka bordim.", pattern: "Yesterday I …", grammarTip: "'Went' = 'go' ning o'tgan zamon shakli (noto'g'ri fe'l: go → went → gone). 'Yesterday' = kecha (o'tgan zamon belgisi)." },
    { id: 'sp-d20-c2', en: "I had a great time.", uz: "Men juda yaxshi vaqt o'tkazdim.", grammarTip: "'Had' = 'have' ning o'tgan zamon shakli (have → had → had). 'Have a great time' = yaxshi vaqt o'tkazmoq (turg'un ibora)." },
    { id: 'sp-d20-c3', en: "I met my friends.", uz: "Men do'stlarim bilan uchrashdim.", grammarTip: "'Met' = 'meet' ning o'tgan zamon shakli (meet → met → met). Noto'g'ri fe'l: yozilishi o'zgaradi, '-ed' qo'shilmaydi." },
    { id: 'sp-d20-c4', en: "We watched a film.", uz: "Biz film ko'rdik.", grammarTip: "'Watched' = 'watch' + '-ed' (to'g'ri fe'l). '-ed' qo'shimchasi /t/ deb talaffuz qilinadi (watch oxiridagi /tʃ/ tilsiz)." },
    { id: 'sp-d20-c5', en: "What did you do yesterday?", uz: "Kecha nima qildingiz?", pattern: "What did you …?", grammarTip: "'What did you do?' — o'tgan zamon so'rog'i. 'Did' yordamchi fe'l + asosiy fe'l (do). 'Did' dan keyin fe'l o'zgarmaydi (do, went emas!)." },
    { id: 'sp-d20-c6', en: "It was a lot of fun.", uz: "Juda qiziqarli bo'ldi.", grammarTip: "'Was' = 'is' ning o'tgan zamon shakli. 'A lot of fun' = juda qiziqarli. 'Fun' = qiziq (sifat/ ot). 'A lot of' = ko'p (miqdor)." },
  ],
  scenario: {
    topic: "talking about what you did yesterday",
    aiRole: "a friend catching up with you",
    userRole: "someone describing their day off",
    opening: "Hey! I didn't see you yesterday. What did you get up to?",
    goalUz: "Kecha qayerga borganingiz va nima qilganingizni ayting.",
  },
}

const day21: SpeakingDay = {
  day: 21, cefr: 'A2',
  title: "Kelajak rejalar",
  subtitle: "Going to — rejalar haqida",
  goalUz: "Yaqin kelajakdagi rejalaringizni ayta olasiz.",
  estMinutes: 14,
  pronunciationFocus: {
    sound: '/əʊ/',
    ipaExample: '/əʊ/ — go, home, phone',
    tipUz: "'O' dan boshlanib 'u' ga o'ting — /əʊ/ tovushi o'zbek tilidagi 'ou' ga o'xshaydi. Britaniya ingliz tilida lablar yumaloq.",
    tipEn: "Start with 'ə' and glide to 'ʊ' — the /əʊ/ sound is like 'oh'. In British English, round your lips.",
  },
  recycledChunkIds: ['sp-d11-c4', 'sp-d15-c6', 'sp-d20-c5'],
  chunks: [
    { id: 'sp-d21-c1', en: "I am going to visit my family.", uz: "Men oilamni ko'rgani boraman.", pattern: "I am going to …", grammarTip: "'Going to + V' — kelajak reja. 'Am going to visit' = ko'rgani bormoqchi. 'Going to' rejalashtirilgan harakatlar uchun." },
    { id: 'sp-d21-c2', en: "We are going to travel next week.", uz: "Biz keyingi hafta sayohatga chiqamiz.", grammarTip: "'We are going to' = biz …moqchimiz. 'Next week' = keyingi hafta (kelajak vaqt). 'Travel' = sayohat qilmoq." },
    { id: 'sp-d21-c3', en: "What are your plans?", uz: "Rejalaringiz qanday?", grammarTip: "'What are your plans?' — rejalarni so'rash. 'Plans' = rejalar (ko'plik). 'Your' = sizning." },
    { id: 'sp-d21-c4', en: "I want to learn English well.", uz: "Men ingliz tilini yaxshi o'rganmoqchiman.", pattern: "I want to …", grammarTip: "'Want to + V' = xohlamoq. 'Want to learn' = o'rganmoqchi. 'Well' = yaxshi (ravish — 'good' sifat, 'well' ravish)." },
    { id: 'sp-d21-c5', en: "Maybe I will stay home.", uz: "Balki uyda qolarman.", grammarTip: "'Will + V' — kelajak zamon (noaniq). 'Maybe' = balki. 'Will' + asosiy fe'l. 'Stay home' = uyda qolmoq ('at' qo'yilmaydi)." },
    { id: 'sp-d21-c6', en: "That sounds exciting!", uz: "Bu juda qiziq!", grammarTip: "'Sounds + -ing sifat' = … tuyuladi. 'Exciting' = qiziqarli. 'Sound' hissiy fe'l, undan keyin sifat keladi." },
  ],
  scenario: {
    topic: "talking about weekend or future plans",
    aiRole: "a friend making weekend plans",
    userRole: "someone sharing their plans",
    opening: "The weekend is almost here! Do you have any plans?",
    goalUz: "Hafta oxiri yoki kelajak rejalaringizni 'going to' bilan ayting.",
  },
}

const day22: SpeakingDay = {
  day: 22, cefr: 'A2',
  title: "Muammo va shikoyat",
  subtitle: "Muloyim shikoyat qilish",
  goalUz: "Muammoni muloyim tarzda ayta olasiz va yordam so'ray olasiz.",
  estMinutes: 14,
  pronunciationFocus: {
    sound: '/uː/',
    ipaExample: '/uː/ — room, food, you',
    tipUz: "Lablaringizni dumaloq va oldinga cho'zing — /uː/ tovushi uzun 'u'. O'zbek tilidagi 'u' dan cho'ziqroq.",
    tipEn: "Round your lips and push them forward — /uː/ is a long 'u' sound. Longer than Uzbek 'u'.",
  },
  recycledChunkIds: ['sp-d14-c1', 'sp-d14-c4', 'sp-d12-c6'],
  chunks: [
    { id: 'sp-d22-c1', en: "Excuse me, there is a problem.", uz: "Kechirasiz, bir muammo bor.", pattern: "There is a problem …", grammarTip: "'Excuse me' = kechirasiz (diqqat jalb qilish). 'There is a problem (with) + narsa' — muammo borligini aytish." },
    { id: 'sp-d22-c2', en: "The room is too cold.", uz: "Xona juda sovuq.", pattern: "The … is too …", grammarTip: "'Too + sifat' = juda ham (salbiy ma'no). 'Too cold' = juda sovuq. 'Too' haddan tashqari ma'nosida." },
    { id: 'sp-d22-c3', en: "Could you help me, please?", uz: "Iltimos, menga yordam bera olasizmi?", grammarTip: "'Could you …?' — 'Can you' dan muloyimroq. 'Could you help me' = menga yordam bera olasizmi? 'Could' modal fe'l." },
    { id: 'sp-d22-c4', en: "This isn't what I ordered.", uz: "Bu men buyurtma qilgan narsa emas.", grammarTip: "'This isn't what …' = bu … narsa emas. 'Ordered' = buyurtma qildim (Past Simple). 'Isn't' = 'is not'." },
    { id: 'sp-d22-c5', en: "Can you fix it?", uz: "Buni tuzata olasizmi?", grammarTip: "'Can you fix it?' — biror narsani tuzatishni so'rash. 'Fix' = tuzatmoq. 'It' = uni (muammo)." },
    { id: 'sp-d22-c6', en: "Thank you for your help.", uz: "Yordamingiz uchun rahmat.", grammarTip: "'Thank you for + ot/-ing' = … uchun rahmat. 'For your help' = yordamingiz uchun. 'For' sabab ko'rsatadi." },
  ],
  scenario: {
    topic: "making a polite complaint at a hotel",
    aiRole: "a hotel receptionist",
    userRole: "a guest with a problem",
    opening: "Good evening. How is everything with your room?",
    goalUz: "Muammoni muloyim ayting (sovuq xona va h.k.) va yordam so'rang.",
  },
}

const day23: SpeakingDay = {
  day: 23, cefr: 'A2',
  title: "Telefon suhbati",
  subtitle: "Restoranda stol band qilish",
  goalUz: "Telefon orqali stol band qila olasiz.",
  estMinutes: 15,
  pronunciationFocus: {
    sound: '/b/ vs /p/',
    ipaExample: '/b/ — book, table / /p/ — please, problem',
    tipUz: "/b/ ovozli, /p/ tilsiz. Ikkalasida ham lablar bir-biriga tegadi. /p/ da kuchli nafas chiqadi (aspiration).",
    tipEn: "/b/ is voiced, /p/ is voiceless. Both have lips together. /p/ has a strong puff of air (aspiration).",
  },
  recycledChunkIds: ['sp-d4-c1', 'sp-d7-c4', 'sp-d22-c3'],
  chunks: [
    { id: 'sp-d23-c1', en: "Hello, I'd like to book a table.", uz: "Salom, men stol band qilmoqchiman.", pattern: "I'd like to book …", grammarTip: "'I'd like to book a …' = men … band qilmoqchiman. 'Book' bu yerda fe'l (band qilmoq). 'I'd like to + V'." },
    { id: 'sp-d23-c2', en: "A table for two, please.", uz: "Iltimos, ikki kishilik stol.", pattern: "A table for …", grammarTip: "'A table for + son' = … kishilik stol. 'For' = uchun. 'A table' = stol (sanaladigan ot). 'For two' = ikki kishilik." },
    { id: 'sp-d23-c3', en: "For tonight at eight.", uz: "Bugun kechqurun sakkizda.", grammarTip: "'At + vaqt' + aniq soat. 'Tonight' = bugun kechqurun. Vaqt: 'at' + soat (at eight). 'For' = uchun (maqsad)." },
    { id: 'sp-d23-c4', en: "Can I have your name?", uz: "Ismingizni ayta olasizmi?", grammarTip: "'Can I have …?' — ma'lumot so'rash (norasmiy). 'Your name' = sizning ismingiz. 'Have' bu yerda 'olmoq' emas, 'bilmoq' ma'nosida." },
    { id: 'sp-d23-c5', en: "See you this evening.", uz: "Kechqurun ko'rishamiz.", grammarTip: "'See you + vaqt' = … ko'rishamiz. 'This evening' = bugun kechqurun. 'This' + vaqt qismi (this morning/afternoon/evening)." },
    { id: 'sp-d23-c6', en: "Thank you, goodbye.", uz: "Rahmat, xayr.", grammarTip: "'Goodbye' = xayr. 'Goodbye' rasmiy, 'Bye' norasmiy. Telefonda: 'Goodbye' ishlatiladi." },
  ],
  scenario: {
    topic: "booking a table at a restaurant by phone",
    aiRole: "a restaurant host answering the phone",
    userRole: "a customer booking a table",
    opening: "Good afternoon, Bella Restaurant. How can I help you?",
    goalUz: "Stol band qiling: nechta kishi, qaysi vaqt va ismingizni ayting.",
  },
}

const day24: SpeakingDay = {
  day: 24, cefr: 'A2',
  title: "Restoranda to'liq suhbat",
  subtitle: "Tavsiya so'rash va hisob",
  goalUz: "Tavsiya so'ray olasiz, taom buyurtma qilasiz va hisobni so'raysiz.",
  estMinutes: 14,
  pronunciationFocus: {
    sound: '/r/',
    ipaExample: '/r/ — recommend, restaurant, water',
    tipUz: "Tilingizni orqaga buking va hech narsaga tegizmang — /r/ tovushi o'zbek tilidagi 'r' dan yumshoqroq.",
    tipEn: "Curl your tongue back and don't touch anything — the /r/ sound is softer than Uzbek 'r'.",
    commonError: "O'zbeklar /r/ ni qattiq talaffuz qiladi. Ingliz /r/ yumshoq — til hech narsaga tegmaydi.",
  },
  recycledChunkIds: ['sp-d4-c1', 'sp-d12-c5', 'sp-d23-c1'],
  chunks: [
    { id: 'sp-d24-c1', en: "What do you recommend?", uz: "Nimani tavsiya qilasiz?", grammarTip: "'What do you recommend?' — tavsiya so'rash. 'Recommend' = tavsiya qilmoq. 'Do you' + asosiy fe'l so'rog'i." },
    { id: 'sp-d24-c2', en: "I'll have the chicken, please.", uz: "Menga tovuq bering, iltimos.", pattern: "I'll have …", grammarTip: "'I'll have …' = men … olaman (buyurtma). 'I'll' = 'I will'. 'The chicken' = tovuq (ma'lum bir taom)." },
    { id: 'sp-d24-c3', en: "Is this dish spicy?", uz: "Bu taom achchiqmi?", grammarTip: "'Is this …?' — so'roq. 'Dish' = taom. 'Spicy' = achchiq. 'Is' + 'this' + sifat — narsaning sifatini so'rash." },
    { id: 'sp-d24-c4', en: "Could we have the bill, please?", uz: "Hisobni keltira olasizmi, iltimos?", grammarTip: "'Could we have …?' = muloyim so'rov. 'The bill' = hisob. 'Could' modal fe'li 'can' dan muloyimroq. 'We' ko'plik." },
    { id: 'sp-d24-c5', en: "Everything was delicious.", uz: "Hammasi mazali edi.", grammarTip: "'Everything' = hamma narsa (birlik). 'Was' = o'tgan zamon ('is' ning o'tgani). 'Delicious' = mazali. 'Everything + was' birlik." },
    { id: 'sp-d24-c6', en: "Could I have some water?", uz: "Menga suv bera olasizmi?", grammarTip: "'Could I have some …?' = menga bir oz … bera olasizmi? 'Some water' = bir oz suv. 'Water' sanalmaydigan ot." },
  ],
  scenario: {
    topic: "ordering a full meal at a restaurant",
    aiRole: "a polite waiter",
    userRole: "a customer",
    opening: "Good evening! Are you ready to order, or do you need a few minutes?",
    goalUz: "Tavsiya so'rang, taom buyurtma qiling va oxirida hisobni so'rang.",
  },
}

const day25: SpeakingDay = {
  day: 25, cefr: 'A2',
  title: "Aeroportda",
  subtitle: "Ro'yxatdan o'tish va reys",
  goalUz: "Aeroportda ro'yxatdan o'ta olasiz va reys haqida so'raysiz.",
  estMinutes: 14,
  pronunciationFocus: {
    sound: '/aɪə/',
    ipaExample: '/aɪə/ — flight, time, nice',
    tipUz: "/aɪ/ dan /ə/ ga o'ting: 'a' + 'i' + 'ə' — tovush silliq o'tishi kerak. Bu diftong + schwa birikmasi.",
    tipEn: "Glide from /aɪ/ to /ə/ — the sound transitions smoothly. This is a diphthong + schwa combination.",
  },
  recycledChunkIds: ['sp-d6-c1', 'sp-d22-c1', 'sp-d7-c1'],
  chunks: [
    { id: 'sp-d25-c1', en: "Where is the check-in desk?", uz: "Ro'yxatdan o'tish joyi qayerda?", grammarTip: "'Where is the …?' — joy so'rash. 'Check-in desk' = ro'yxatdan o'tish joyi. 'Check-in' ikki so'z birlashmasi." },
    { id: 'sp-d25-c2', en: "Here is my passport.", uz: "Mana mening pasportim.", grammarTip: "'Here is …' = mana … . 'Here' + 'is' + ot — biror narsani uzatish. 'My passport' = mening pasportim." },
    { id: 'sp-d25-c3', en: "I have one suitcase.", uz: "Menda bitta chamadon bor.", grammarTip: "'One' = bitta (son). 'Suitcase' = chamadon. Sondan keyin ot har doim birlikda: 'one suitcase' ('suitcases' emas)." },
    { id: 'sp-d25-c4', en: "Which gate is it?", uz: "Qaysi darvoza?", grammarTip: "'Which' = qaysi (tanlov so'roq olmoshi). 'Which gate' = qaysi darvoza. 'Is it' so'roqning oxirida." },
    { id: 'sp-d25-c5', en: "What time does the flight leave?", uz: "Reys soat nechada uchadi?", grammarTip: "'What time does …?' = soat nechada? 'Does' yordamchi fe'l (he/she/it bilan). 'The flight leaves' → 'Does the flight leave?' (s tushadi)." },
    { id: 'sp-d25-c6', en: "Is the flight on time?", uz: "Reys o'z vaqtidami?", grammarTip: "'On time' = o'z vaqtida (rejalashtirilgan vaqtda). 'In time' = vaqtida (kechikmasdan). 'On time' aniq vaqt uchun." },
  ],
  scenario: {
    topic: "checking in at the airport",
    aiRole: "a check-in agent",
    userRole: "a traveller",
    opening: "Good morning! May I see your passport and ticket, please?",
    goalUz: "Pasportingizni bering, chamadon va darvoza haqida so'rang.",
  },
}

const day26: SpeakingDay = {
  day: 26, cefr: 'A2',
  title: "Mehmonxonada",
  subtitle: "Xona band qilish va so'rovlar",
  goalUz: "Mehmonxonaga joylasha olasiz va xizmatlar haqida so'raysiz.",
  estMinutes: 14,
  pronunciationFocus: {
    sound: '/l/',
    ipaExample: '/l/ — lift, call, welcome',
    tipUz: "Tilingizni yuqori tishlaringiz orqasiga tegizib, ovoz chiqaring — /l/ tovushi ikki xil: 'light L' (so'z boshida) va 'dark L' (so'z oxirida).",
    tipEn: "Touch your tongue behind your upper teeth — the /l/ sound has two types: 'light L' (start) and 'dark L' (end).",
    commonError: "O'zbeklar so'z oxiridagi /l/ ni yutib yuboradi. 'Call' → 'cal' emas! Til tishga tegishi kerak.",
  },
  recycledChunkIds: ['sp-d22-c2', 'sp-d22-c5', 'sp-d25-c1'],
  chunks: [
    { id: 'sp-d26-c1', en: "I have a reservation.", uz: "Menda bron bor.", grammarTip: "'Reservation' = bron. 'Have a reservation' = bron qilingan. 'A' artikli, chunki 'reservation' sanaladigan ot." },
    { id: 'sp-d26-c2', en: "I'd like a room for two nights.", uz: "Menga ikki kechaga xona kerak.", pattern: "I'd like a room for …", grammarTip: "'A room for + vaqt' = … vaqtga xona. 'For two nights' = ikki kechaga. 'For' vaqt davomiyligi uchun." },
    { id: 'sp-d26-c3', en: "Does the room have wifi?", uz: "Xonada wifi bormi?", grammarTip: "'Does … have …?' — so'roq. 'Does' yordamchi fe'l (he/she/it). 'Have' asosiy fe'l (does dan keyin have, has emas!)." },
    { id: 'sp-d26-c4', en: "What time is breakfast?", uz: "Nonushta soat nechada?", grammarTip: "'What time is …?' = soat nechada? 'Breakfast' = nonushta. Vaqt so'rash uchun asosiy qolip: What time is + ot?" },
    { id: 'sp-d26-c5', en: "Could I have a wake-up call?", uz: "Meni uyg'otib qo'ya olasizmi?", grammarTip: "'Could I have …?' — muloyim iltimos. 'Wake-up call' = uyg'otish qo'ng'iroq'i. 'Call' bu yerda ot (qo'ng'iroq)." },
    { id: 'sp-d26-c6', en: "Where is the lift?", uz: "Lift qayerda?", grammarTip: "'Lift' — Britaniya ingliz tilida. AQSH ingliz tilida 'elevator'. 'Where is the …?' qolipi." },
  ],
  scenario: {
    topic: "checking in at a hotel",
    aiRole: "a hotel receptionist",
    userRole: "a guest",
    opening: "Welcome! Do you have a reservation with us?",
    goalUz: "Bron borligini ayting, xona va nonushta haqida so'rang.",
  },
}

const day27: SpeakingDay = {
  day: 27, cefr: 'A2',
  title: "Shifokorda",
  subtitle: "Shikoyat va dori",
  goalUz: "Qayeringiz og'riyotganini ayta olasiz va maslahat so'raysiz.",
  estMinutes: 14,
  pronunciationFocus: {
    sound: '/ɔː/',
    ipaExample: '/ɔː/ — all, water, call',
    tipUz: "Lablaringizni dumaloq va kichkina qiling — /ɔː/ tovushi 'o' va 'a' oralig'idagi tovush. O'zbek tilidagi 'o' dan ochiqroq.",
    tipEn: "Round your lips into a small circle — /ɔː/ is between 'o' and 'a'. More open than Uzbek 'o'.",
  },
  recycledChunkIds: ['sp-d17-c2', 'sp-d17-c3', 'sp-d24-c5'],
  chunks: [
    { id: 'sp-d27-c1', en: "I don't feel well.", uz: "O'zimni yaxshi his qilmayapman.", grammarTip: "'Feel well' = o'zini yaxshi his qilmoq. 'Don't feel well' = yaxshi his qilmayapman. 'Well' sifat (sog'lom ma'nosida)." },
    { id: 'sp-d27-c2', en: "I have a headache.", uz: "Boshim og'riyapti.", pattern: "I have a …", grammarTip: "'Have a headache' = bosh og'rig'i. 'Have a + og'riq': a headache, a toothache, a stomachache. 'Headache' = bosh og'rig'i." },
    { id: 'sp-d27-c3', en: "It hurts here.", uz: "Bu yer og'riyapti.", grammarTip: "'It hurts' = og'riyapti. 'Hurts' = 'hurt' + 's' (he/she/it bilan). 'Here' = bu yerda. 'Hurt' → 'hurt' → 'hurt' (noto'g'ri fe'l)." },
    { id: 'sp-d27-c4', en: "I have had it for two days.", uz: "Ikki kundan beri shunday.", grammarTip: "'Have had' = Present Perfect. 'For two days' = ikki kundan beri. 'For' + vaqt davomiyligi. 'Have had' = ega bo'lganman (hozirgacha)." },
    { id: 'sp-d27-c5', en: "Do I need medicine?", uz: "Menga dori kerakmi?", grammarTip: "'Do I need …?' = menga … kerakmi? 'Need' = kerak bo'lmoq. 'Medicine' = dori (sanalmaydigan ot, 'a' qo'yilmaydi)." },
    { id: 'sp-d27-c6', en: "Take this twice a day.", uz: "Buni kuniga ikki marta iching.", grammarTip: "'Twice a day' = kuniga ikki marta. 'Once' = bir marta, 'twice' = ikki marta, 'three times' = uch marta. Chastota ko'rsatkichi." },
  ],
  scenario: {
    topic: "visiting a doctor about feeling unwell",
    aiRole: "a kind doctor",
    userRole: "a patient",
    opening: "Hello, please sit down. What seems to be the problem?",
    goalUz: "Qayeringiz og'riyotganini ayting va dori kerakmi deb so'rang.",
  },
}

const day28: SpeakingDay = {
  day: 28, cefr: 'A2',
  title: "Ob-havo va kiyim",
  subtitle: "Ob-havoni tasvirlash",
  goalUz: "Ob-havoni tasvirlay olasiz va nima kiyganingizni aytasiz.",
  estMinutes: 13,
  pronunciationFocus: {
    sound: '/m/',
    ipaExample: '/m/ — warm, weather, umbrella',
    tipUz: "Lablaringizni bir-biriga yoping va burun orqali ovoz chiqaring — /m/ tovushi lablar orqali chiqadi.",
    tipEn: "Close your lips together and let the sound come through your nose — the /m/ sound is nasal.",
  },
  recycledChunkIds: ['sp-d9-c4', 'sp-d16-c1', 'sp-d10-c1'],
  chunks: [
    { id: 'sp-d28-c1', en: "What's the weather like today?", uz: "Bugun ob-havo qanday?", grammarTip: "'What's … like?' = … qanday? 'What's the weather like?' = ob-havo qanday? 'Like' bu yerda 'similar to' emas, 'how' ma'nosida." },
    { id: 'sp-d28-c2', en: "It's sunny and warm.", uz: "Quyoshli va issiq.", grammarTip: "'It's + sifat' — ob-havo haqida. 'Sunny' = quyoshli. 'Warm' = issiq. 'And' ikki sifatni bog'laydi." },
    { id: 'sp-d28-c3', en: "It might rain later.", uz: "Keyinroq yomg'ir yog'ishi mumkin.", grammarTip: "'Might + V' = ehtimol … (50% ehtimol). 'Might' modal fe'l (may dan noaniqroq). 'Rain' = yomg'ir yog'moq (fe'l)." },
    { id: 'sp-d28-c4', en: "Take an umbrella.", uz: "Soyabon oling.", grammarTip: "'Take' = olmoq (buyruq). 'An umbrella' — 'an' unli bilan boshlangan ot oldidan ('umbrella' /ʌ/ bilan boshlanadi)." },
    { id: 'sp-d28-c5', en: "I'm wearing a warm coat.", uz: "Men issiq palto kiyganman.", grammarTip: "'I'm wearing' = men kiyganman (Present Continuous). 'A warm coat' = issiq palto. Sifat (warm) + ot (coat) — qat'iy tartib." },
    { id: 'sp-d28-c6', en: "It's cold outside.", uz: "Tashqarida sovuq.", grammarTip: "'It's cold' = sovuq. 'Outside' = tashqarida. Joylashuv: 'outside' = tashqari, 'inside' = ichkari. 'It's + sifat + joy'." },
  ],
  scenario: {
    topic: "chatting about the weather and clothes",
    aiRole: "a friend",
    userRole: "you",
    opening: "Brr, it looks chilly today! What's the weather like where you are?",
    goalUz: "Ob-havoni tasvirlang va nima kiyganingizni ayting.",
  },
}

const day29: SpeakingDay = {
  day: 29, cefr: 'A2',
  title: "Kiyim do'konida",
  subtitle: "Kiyib ko'rish va o'lcham",
  goalUz: "Kiyib ko'rishni so'ray olasiz va rang/o'lcham haqida so'raysiz.",
  estMinutes: 13,
  pronunciationFocus: {
    sound: '/ɪ/',
    ipaExample: '/ɪ/ — fit, this, in',
    tipUz: "/ɪ/ qisqa va bo'sh — og'zingizni katta ochmang. 'Fit' (/ɪ/) va 'feet' (/iː/) farqiga e'tibor bering.",
    tipEn: "/ɪ/ is short and relaxed — don't open your mouth wide. Notice the difference between 'fit' (/ɪ/) and 'feet' (/iː/).",
    commonError: "O'zbeklar /ɪ/ ni /i/ bilan almashtiradi. 'This' → 'zis' emas! /ɪ/ qisqa, og'iz bo'sh.",
  },
  recycledChunkIds: ['sp-d5-c2', 'sp-d16-c5', 'sp-d13-c6'],
  chunks: [
    { id: 'sp-d29-c1', en: "Can I try this on?", uz: "Buni kiyib ko'rsam bo'ladimi?", grammarTip: "'Try on' = kiyib ko'rmoq (phrasal verb). 'This' = buni. 'Can I …?' = ruxsat so'rash. Phrasal verb: 'try on' — 'on' ajraladigan." },
    { id: 'sp-d29-c2', en: "Do you have this in blue?", uz: "Bu ko'k rangda bormi?", pattern: "Do you have this in …?", grammarTip: "'In + rang' = … rangda. 'Do you have this in blue?' = bu ko'k rangda bormi? 'In' rang/ o'lcham bilan ishlatiladi." },
    { id: 'sp-d29-c3', en: "It's too small.", uz: "Bu juda kichik.", grammarTip: "'Too small' = juda kichik (kerakli darajadan kichik). 'Too' + sifat — haddan tashqari (salbiy ma'no). 'Small' = kichik." },
    { id: 'sp-d29-c4', en: "Where is the fitting room?", uz: "Kiyinish xonasi qayerda?", grammarTip: "'Fitting room' = kiyinish xonasi. Britaniya ingliz tilida, AQSH da 'dressing room'. 'Where is …?' qolipi." },
    { id: 'sp-d29-c5', en: "I'd like to return this.", uz: "Buni qaytarmoqchiman.", grammarTip: "'I'd like to return …' = men … qaytarmoqchiman. 'Return' = qaytarmoq. 'I'd like to + V' istak bildiradi." },
    { id: 'sp-d29-c6', en: "It fits perfectly.", uz: "Aynan o'lchamida.", grammarTip: "'It fits' = o'lchamiga to'g'ri keldi. 'Fits' = 'fit' + 's' (he/she/it). 'Perfectly' = mukammal (ravish - 'perfect' sifat, 'perfectly' ravish)." },
  ],
  scenario: {
    topic: "shopping for clothes",
    aiRole: "a shop assistant",
    userRole: "a customer",
    opening: "Hi there! Let me know if you'd like to try anything on.",
    goalUz: "Kiyib ko'rishni so'rang, rang va o'lcham haqida so'rang.",
  },
}

const day30: SpeakingDay = {
  day: 30, cefr: 'A2',
  title: "Ishda tanishtirish",
  subtitle: "Kasb va vazifalar",
  goalUz: "Ishingiz va vazifangizni tushuntira olasiz.",
  estMinutes: 14,
  pronunciationFocus: {
    sound: '/s/ vs /z/',
    ipaExample: '/s/ — sales, nice / /z/ — responsible, team, years',
    tipUz: "/s/ tilsiz (ilon kabi), /z/ ovozli (ari kabi). Ikkalasida ham til tishlarga yaqin. Farq: bo'g'iz titrashi.",
    tipEn: "/s/ is voiceless (like a snake), /z/ is voiced (like a bee). Both have tongue near teeth. Difference: throat vibration.",
  },
  recycledChunkIds: ['sp-d2-c3', 'sp-d2-c6', 'sp-d27-c5'],
  chunks: [
    { id: 'sp-d30-c1', en: "I work as a teacher.", uz: "Men o'qituvchi bo'lib ishlayman.", pattern: "I work as a …", grammarTip: "'Work as a + kasb' = … bo'lib ishlayman. 'As' = sifatida. 'I work as a teacher' = o'qituvchi bo'lib ishlayman." },
    { id: 'sp-d30-c2', en: "I'm responsible for the sales team.", uz: "Men sotuv jamoasiga javobgarman.", grammarTip: "'Responsible for + narsa' = … uchun javobgar. 'Responsible' = javobgar (sifat). 'For' sabab/mas'uliyat ko'rsatadi." },
    { id: 'sp-d30-c3', en: "I've worked here for three years.", uz: "Men bu yerda uch yildan beri ishlayman.", grammarTip: "'I've worked' = 'I have worked' — Present Perfect. 'For three years' = uch yildan beri. 'Since' dan farqli: 'for' + davr, 'since' + nuqta." },
    { id: 'sp-d30-c4', en: "It's nice to be on the team.", uz: "Jamoada bo'lganimdan xursandman.", grammarTip: "'It's nice to + V' = … yaxshi. 'To be on the team' = jamoada bo'lmoq. 'On the team' — 'in' emas, 'on' ishlatiladi (jamoa a'zosi)." },
    { id: 'sp-d30-c5', en: "What do you work on?", uz: "Siz nima ustida ishlaysiz?", grammarTip: "'What do you work on?' — nima ustida ishlaysiz? 'Work on' = ustida ishlamoq. 'Work on + narsa'." },
    { id: 'sp-d30-c6', en: "Let me know if you need help.", uz: "Yordam kerak bo'lsa, ayting.", grammarTip: "'Let me know if …' = agar …, ayting. 'Let me know' = menga xabar bering. 'If + gap' — shartli qism." },
  ],
  scenario: {
    topic: "introducing yourself at a new job",
    aiRole: "a friendly colleague",
    userRole: "a new employee",
    opening: "Welcome aboard! So, what will you be working on here?",
    goalUz: "Kasbingiz va vazifangizni ayting, hamkasbingizga savol bering.",
  },
}

const day31: SpeakingDay = {
  day: 31, cefr: 'A2',
  title: "Bo'sh vaqt rejalari",
  subtitle: "Hafta oxiri rejalari",
  goalUz: "Hafta oxiri rejalaringizni ayta va taklif qila olasiz.",
  estMinutes: 14,
  pronunciationFocus: {
    sound: '/n/',
    ipaExample: '/n/ — plan, nice, friend',
    tipUz: "Tilingizni yuqori tishlaringiz orqasiga tegizing va burun orqali nafas chiqaring — /n/ tovushi burun tovushi.",
    tipEn: "Touch your tongue behind your upper teeth and breathe through your nose — /n/ is a nasal sound.",
  },
  recycledChunkIds: ['sp-d21-c1', 'sp-d21-c3', 'sp-d7-c4'],
  chunks: [
    { id: 'sp-d31-c1', en: "What are you doing this weekend?", uz: "Bu hafta oxiri nima qilyapsiz?", grammarTip: "'What are you doing + vaqt?' — Present Continuous kelajak reja uchun. 'This weekend' = bu hafta oxiri. Present Continuous kelajak ma'nosida." },
    { id: 'sp-d31-c2', en: "I'm going to visit my friends.", uz: "Do'stlarimni ko'rgani boraman.", grammarTip: "'Going to + V' — kelajak reja. 'Going to visit' = ko'rgani bormoqchi. 'My friends' = do'stlarim." },
    { id: 'sp-d31-c3', en: "Do you want to come with us?", uz: "Biz bilan kelasizmi?", grammarTip: "'Do you want to + V?' = xohlaysizmi? 'Come with us' = biz bilan kelmoq. 'With' = bilan." },
    { id: 'sp-d31-c4', en: "Maybe we can go to the park.", uz: "Balki parkka borarmiz.", grammarTip: "'Maybe' = balki (ehtimol). 'Can + V' = qila olamiz (taklif). 'Go to the park' = parkka bormoq. 'The' ma'lum park." },
    { id: 'sp-d31-c5', en: "Sounds like a plan!", uz: "Yaxshi reja!", grammarTip: "'Sounds like a plan' = yaxshi reja (norasmiy rozilik). 'Sounds like' = … ga o'xshaydi. Turg'un ibora." },
    { id: 'sp-d31-c6', en: "Let's meet at ten.", uz: "Soat o'nda uchrashaylik.", grammarTip: "'Let's meet at + vaqt' = soatda uchrashaylik. 'Let's' = 'Let us' (taklif). 'At ten' = soat o'nda. 'At' aniq vaqt bilan." },
  ],
  scenario: {
    topic: "making weekend plans with a friend",
    aiRole: "a friend",
    userRole: "you",
    opening: "Any plans for the weekend?",
    goalUz: "Hafta oxiri rejalaringizni ayting va do'stingizni taklif qiling.",
  },
}

const day32: SpeakingDay = {
  day: 32, cefr: 'A2',
  title: "Bayram va tabrik",
  subtitle: "Tabriklash va tadbirlar",
  goalUz: "Tabriklay va bayram haqida gapira olasiz.",
  estMinutes: 13,
  pronunciationFocus: {
    sound: '/h/',
    ipaExample: '/h/ — happy, hope, have',
    tipUz: "Og'zingizni oching va nafas chiqaring — /h/ tovushi yumshoq, tomoqdan emas. O'zbek tilidagi 'h' dan yumshoqroq.",
    tipEn: "Open your mouth and breathe out — the /h/ sound is soft, not from the throat. Softer than Uzbek 'h'.",
  },
  recycledChunkIds: ['sp-d17-c1', 'sp-d22-c6', 'sp-d31-c3'],
  chunks: [
    { id: 'sp-d32-c1', en: "Happy birthday!", uz: "Tug'ilgan kuningiz bilan!", grammarTip: "'Happy birthday!' = tug'ilgan kun muborak! 'Happy' + hodisa (Happy New Year, Happy anniversary). Turg'un tabrik iborasi." },
    { id: 'sp-d32-c2', en: "Congratulations!", uz: "Tabriklayman!", grammarTip: "'Congratulations!' = tabriklayman! Ko'plikda ishlatiladi. 'Congratulation' (singular) ishlatilmaydi, har doim 'congratulations'." },
    { id: 'sp-d32-c3', en: "I hope you have a great day.", uz: "Ajoyib kun tilayman.", grammarTip: "'I hope + gap' = umid qilaman. 'Hope' = umid qilmoq. 'You have a great day' = ajoyib kun o'tkazishingizni. 'You have' emas, 'you'll have' bo'lishi mumkin." },
    { id: 'sp-d32-c4', en: "Thank you for the gift.", uz: "Sovg'a uchun rahmat.", grammarTip: "'Thank you for + ot' = … uchun rahmat. 'For the gift' = sovg'a uchun. 'Gift' = sovg'a (sanaladigan ot, 'present' bilan sinonim)." },
    { id: 'sp-d32-c5', en: "We're having a party on Saturday.", uz: "Shanba kuni bazm qilamiz.", grammarTip: "'We're having' = biz qilmoqchimiz (Present Continuous kelajak ma'nosida). 'On Saturday' = shanba kuni. 'On' kunlar bilan ishlatiladi." },
    { id: 'sp-d32-c6', en: "I wouldn't miss it!", uz: "Albatta kelaman!", grammarTip: "'Wouldn't miss it' = albatta kelaman (o'tkazib yubormayman). 'Would' modal fe'l (shart ma'nosida). 'Miss' = o'tkazib yubormoq." },
  ],
  scenario: {
    topic: "a birthday and celebration",
    aiRole: "a friend celebrating a birthday",
    userRole: "you",
    opening: "It's my birthday on Saturday — I'm having a little party!",
    goalUz: "Tabriklang va bayram/tadbir haqida gapiring.",
  },
}

const day33: SpeakingDay = {
  day: 33, cefr: 'A2',
  title: "Jamoat transporti",
  subtitle: "Avtobus va poezd",
  goalUz: "Transport, chipta va yo'nalish haqida so'ray olasiz.",
  estMinutes: 14,
  pronunciationFocus: {
    sound: '/e/',
    ipaExample: '/e/ — centre, desk, get',
    tipUz: "Og'zingizni o'rtacha oching va tilni oldinga — /e/ tovushi o'zbek tilidagi 'e' ga o'xshaydi, lekin qisqaroq.",
    tipEn: "Open your mouth moderately and keep your tongue forward — /e/ is similar to Uzbek 'e' but shorter.",
  },
  recycledChunkIds: ['sp-d4-c3', 'sp-d22-c1', 'sp-d25-c4'],
  chunks: [
    { id: 'sp-d33-c1', en: "Which bus goes to the centre?", uz: "Markazga qaysi avtobus boradi?", grammarTip: "'Which bus goes to …?' = qaysi avtobus … ga boradi? 'Which' = qaysi (tanlov). 'Goes' = 'go' + 'es' (he/she/it). 'To the centre' = markazga." },
    { id: 'sp-d33-c2', en: "How much is a ticket?", uz: "Chipta qancha turadi?", grammarTip: "'How much is a …?' = … qancha? 'A ticket' = bitta chipta (sanaladigan ot). Narx so'rash uchun qolip. 'A' artikli bilan." },
    { id: 'sp-d33-c3', en: "Does this train stop at the station?", uz: "Bu poezd bekatda to'xtaydimi?", grammarTip: "'Does this train stop …?' = … to'xtaydimi? 'Does' yordamchi fe'l. 'Stop at + joy' = … da to'xtamoq. 'Does' bilan 'stop' o'zgarmaydi." },
    { id: 'sp-d33-c4', en: "I missed my bus.", uz: "Avtobusimni o'tkazib yubordim.", grammarTip: "'Missed' = o'tkazib yubordim (Past Simple). 'Miss' + transport: miss the bus, miss the train. 'My bus' = mening avtobusim." },
    { id: 'sp-d33-c5', en: "Excuse me, is this seat free?", uz: "Kechirasiz, bu joy bo'shmi?", grammarTip: "'Is this … free?' = bu … bo'shmi? 'Free' = bo'sh (band emas). 'Seat' = o'rindiq. 'Excuse me' diqqatni jalb qilish uchun." },
    { id: 'sp-d33-c6', en: "Have a good journey!", uz: "Yaxshi yo'l!", grammarTip: "'Have a good journey!' = yaxshi yo'l! 'Have a good + ot' — tilak bildirish. 'Journey' = sayohat (Britaniya), US: 'trip'." },
  ],
  scenario: {
    topic: "using public transport",
    aiRole: "a helpful passenger",
    userRole: "a traveller",
    opening: "You look a little lost — where are you trying to go?",
    goalUz: "Transport, chipta va yo'nalish haqida so'rang.",
  },
}

const day34: SpeakingDay = {
  day: 34, cefr: 'A2',
  title: "Bank va pochta",
  subtitle: "Oddiy xizmatlar",
  goalUz: "Bank/pochtada xizmat so'ray olasiz.",
  estMinutes: 14,
  pronunciationFocus: {
    sound: '/ə/ (schwa)',
    ipaExample: '/ə/ — letter, about, paper',
    tipUz: "/ə/ eng keng tarqalgan ingliz tovushi. Og'zingizni bo'shashtiring va qisqa 'a' chiqaring. Bu tovush ingliz tilida eng ko'p ishlatiladi!",
    tipEn: "/ə/ is the most common English sound. Relax your mouth and produce a short 'a'. This is the most frequent sound in English!",
    commonError: "O'zbeklar schwa ni har doim to'liq talaffuz qiladi. 'Letter' → 'leter' emas! /ə/ qisqa va bo'sh.",
  },
  recycledChunkIds: ['sp-d22-c3', 'sp-d5-c4', 'sp-d30-c1'],
  chunks: [
    { id: 'sp-d34-c1', en: "I'd like to send a letter.", uz: "Men xat jo'natmoqchiman.", grammarTip: "'I'd like to send …' = men … jo'natmoqchiman. 'Send' = jo'natmoq (send → sent → sent). 'A letter' = xat." },
    { id: 'sp-d34-c2', en: "How much does it cost?", uz: "Bu qancha turadi?", grammarTip: "'How much does it cost?' — narx so'rashning to'liq shakli. 'Cost' = turmoq (cost → cost → cost, noto'g'ri fe'l). 'Does' + 'it' + 'cost'." },
    { id: 'sp-d34-c3', en: "Can I change some money?", uz: "Pul almashtirsam bo'ladimi?", grammarTip: "'Can I change …?' = almashtirsam bo'ladimi? 'Change money' = pul almashtirmoq. 'Some money' = bir oz pul (sanalmaydi)." },
    { id: 'sp-d34-c4', en: "I need to withdraw cash.", uz: "Menga naqd pul yechish kerak.", grammarTip: "'Need to + V' = … kerak. 'Withdraw' = yechmoq/pul yechmoq. 'Cash' = naqd pul (sanalmaydi, 'a' qo'yilmaydi)." },
    { id: 'sp-d34-c5', en: "Where do I sign?", uz: "Qayerga imzo qo'yaman?", grammarTip: "'Where do I + V?' = qayerda … y? 'Sign' = imzo qo'ymoq. So'roq: 'Where' + 'do' + 'I' + asosiy fe'l." },
    { id: 'sp-d34-c6', en: "Here is your receipt.", uz: "Mana chekingiz.", grammarTip: "'Here is your …' = mana sizning … . 'Receipt' = chek (PI SILENT! Ovoz chiqarmaydi — /rɪˈsiːt/). 'Your' = sizning." },
  ],
  scenario: {
    topic: "at the bank or post office",
    aiRole: "a clerk",
    userRole: "a customer",
    opening: "Good afternoon, how can I help you?",
    goalUz: "Xizmat so'rang va narx haqida so'rang.",
  },
}

const day35: SpeakingDay = {
  day: 35, cefr: 'A2',
  title: "Xaridni qaytarish",
  subtitle: "Qaytarish va almashtirish",
  goalUz: "Mahsulotni qaytara yoki almashtira olasiz.",
  estMinutes: 13,
  pronunciationFocus: {
    sound: '/aʊ/',
    ipaExample: '/aʊ/ — about, exchange, refund',
    tipUz: "'A' dan 'u' ga silliq o'ting — /aʊ/ tovushi og'izni katta ochib, keyin lablarni yumaloqlash orqali chiqadi.",
    tipEn: "Glide smoothly from 'a' to 'u' — the /aʊ/ sound starts with mouth wide and ends with lips rounded.",
  },
  recycledChunkIds: ['sp-d29-c5', 'sp-d29-c1', 'sp-d5-c1'],
  chunks: [
    { id: 'sp-d35-c1', en: "Can I return this, please?", uz: "Buni qaytarsam bo'ladimi?", grammarTip: "'Can I return …?' = qaytarsam bo'ladimi? 'Return' = qaytarmoq. 'This' = buni. 'Return' ikki ma'noda: qaytmoq va qaytarmoq." },
    { id: 'sp-d35-c2', en: "It doesn't fit.", uz: "Bu menga to'g'ri kelmadi.", grammarTip: "'Doesn't fit' = to'g'ri kelmadi. 'Does not' → 'doesn't'. 'Fit' = o'lchami to'g'ri kelmoq. 'It + doesn't + fit' (does dan keyin fit, fits emas!)." },
    { id: 'sp-d35-c3', en: "Can I exchange it?", uz: "Almashtirsam bo'ladimi?", grammarTip: "'Can I exchange …?' = almashtirsam bo'ladimi? 'Exchange' = almashtirmoq. 'It' = uni. 'Exchange for + narsa' = ga almashtirmoq." },
    { id: 'sp-d35-c4', en: "Do you have the receipt?", uz: "Chekingiz bormi?", grammarTip: "'Do you have …?' = bormi? 'The receipt' = chek (ma'lum chek). 'Receipt' — 'p' talaffuz qilinmaydi: /rɪˈsiːt/." },
    { id: 'sp-d35-c5', en: "Can I have a refund?", uz: "Pulimni qaytarib olsam bo'ladimi?", grammarTip: "'Can I have a refund?' — pulni qaytarib olishni so'rash. 'Refund' = pulni qaytarish. 'A refund' = bir qaytarish." },
    { id: 'sp-d35-c6', en: "Of course, no problem.", uz: "Albatta, muammo yo'q.", grammarTip: "'Of course' = albatta. 'No problem' = muammo yo'q. Ikkalasi ham norasmiy. 'Of course' rasmiyroq: 'Certainly'." },
  ],
  scenario: {
    topic: "returning a product to a shop",
    aiRole: "a shop assistant",
    userRole: "a customer",
    opening: "Hello, is there a problem with your purchase?",
    goalUz: "Mahsulotni qaytaring yoki almashtiring.",
  },
}

const day36: SpeakingDay = {
  day: 36, cefr: 'A2',
  title: "Fikr bildirish",
  subtitle: "Oddiy fikr va rozilik",
  goalUz: "Oddiy fikr bildira va rozilik/e'tiroz ayta olasiz.",
  estMinutes: 13,
  pronunciationFocus: {
    sound: '/aɪ/',
    ipaExample: '/aɪ/ — idea, right, I'm',
    tipUz: "/aɪ/ tovushi 'a' dan boshlanib 'i' ga o'tadi. O'zbek tilidagi 'ay' ga o'xshaydi, lekin tezroq talaffuz qilinadi.",
    tipEn: "The /aɪ/ sound starts with 'a' and glides to 'i'. Similar to Uzbek 'ay' but quicker.",
  },
  recycledChunkIds: ['sp-d19-c2', 'sp-d19-c5', 'sp-d5-c5'],
  chunks: [
    { id: 'sp-d36-c1', en: "I think it's a good idea.", uz: "Menimcha, bu yaxshi fikr.", grammarTip: "'I think + gap' = menimcha. 'Think' = o'ylamoq. 'It's a good idea' = bu yaxshi fikr. Fikr bildirish: I think + sub'ekt + fe'l." },
    { id: 'sp-d36-c2', en: "In my opinion, it's too expensive.", uz: "Mening fikrimcha, bu juda qimmat.", grammarTip: "'In my opinion' = mening fikrimcha (rasmiy fikr bildirish). 'Too expensive' = juda qimmat. 'Too' = haddan tashqari." },
    { id: 'sp-d36-c3', en: "Do you agree?", uz: "Rozimisiz?", grammarTip: "'Do you agree?' = rozimisiz? 'Agree' = rozi bo'lmoq. 'Do you + V?' — so'roq shakli. 'Agree with + person' = kim bilandir rozi bo'lmoq." },
    { id: 'sp-d36-c4', en: "I don't really think so.", uz: "Men unday deb o'ylamayman.", grammarTip: "'I don't really think so' = men unday deb o'ylamayman. 'Really' = haqiqatan (intensifier). 'Think so' = shunday o'ylamoq." },
    { id: 'sp-d36-c5', en: "You're right.", uz: "Siz haqsiz.", grammarTip: "'You're right' = siz haqsiz. 'You're' = 'You are'. 'Right' = haq (to'g'ri). Opposite: 'You're wrong' = siz noto'g'ri." },
    { id: 'sp-d36-c6', en: "What's your opinion?", uz: "Sizning fikringiz qanday?", grammarTip: "'What's your opinion?' = sizning fikringiz qanday? 'Opinion' = fikr. 'Your opinion' = sizning fikringiz. 'What's' = 'What is'." },
  ],
  scenario: {
    topic: "sharing simple opinions about a choice",
    aiRole: "a friend",
    userRole: "you",
    opening: "I think we should eat out tonight. What do you think?",
    goalUz: "Oddiy fikr bildiring va rozilik yoki e'tirozingizni ayting.",
  },
}

const day37: SpeakingDay = {
  day: 37, cefr: 'B1',
  title: "Rasmiy telefon so'rovi",
  subtitle: "E'lon bo'yicha qo'ng'iroq",
  goalUz: "Rasmiy qo'ng'iroq qila olasiz va ma'lumot so'raysiz.",
  estMinutes: 15,
  pronunciationFocus: {
    sound: '/ɒ/',
    ipaExample: '/ɒ/ — office, call, job',
    tipUz: "Og'zingizni katta oching va lablarni yumaloqlang — /ɒ/ tovushi Britaniya ingliz tilida qisqa 'o'. AQSH da /ɑː/ ga o'zgaradi.",
    tipEn: "Open your mouth wide and round your lips — /ɒ/ is a short 'o' in British English. In US it changes to /ɑː/.",
  },
  recycledChunkIds: ['sp-d22-c3', 'sp-d22-c6', 'sp-d10-c1'],
  chunks: [
    { id: 'sp-d37-c1', en: "I'm calling about the advertisement.", uz: "Men e'lon bo'yicha qo'ng'iroq qilyapman.", grammarTip: "'Calling about' = … haqida qo'ng'iroq qilmoq. 'About' = haqida. 'Advertisement' = e'lon. 'I'm calling' Present Continuous (hozirgi harakat)." },
    { id: 'sp-d37-c2', en: "Could you tell me more about it?", uz: "Bu haqda ko'proq ayta olasizmi?", grammarTip: "'Could you tell me more about …?' = … haqida ko'proq ayta olasizmi? 'More' = ko'proq. 'Tell me' = menga ayting. 'Tell' + me (indirect object) + about." },
    { id: 'sp-d37-c3', en: "When would be a good time?", uz: "Qachon qulay bo'ladi?", grammarTip: "'When would be a good time?' = qachon qulay bo'ladi? 'Would' modal fe'l (muloyim). 'A good time' = qulay vaqt." },
    { id: 'sp-d37-c4', en: "Could you put me through to the manager?", uz: "Meni menejerga ulay olasizmi?", grammarTip: "'Put me through' = meni ulang (telefon qo'ng'irog'i). Phrasal verb: 'put through to'. 'The manager' = menejer." },
    { id: 'sp-d37-c5', en: "I'll call back later.", uz: "Keyinroq qayta qo'ng'iroq qilaman.", grammarTip: "'Call back' = qayta qo'ng'iroq qilmoq (phrasal verb). 'Later' = keyinroq. 'I'll' = 'I will'." },
    { id: 'sp-d37-c6', en: "I appreciate your assistance.", uz: "Yordamingiz uchun minnatdorman.", grammarTip: "'I appreciate …' = men … ni qadrlayman/minnatdorman. 'Your assistance' = sizning yordamingiz. Rasmiy ibora: 'appreciate' = minnatdor bo'lmoq." },
  ],
  scenario: {
    topic: "making a formal phone enquiry about a job advert",
    aiRole: "a company receptionist",
    userRole: "a caller",
    opening: "Good morning, ABC Company. How can I help you?",
    goalUz: "E'lon haqida so'rang va menejerga ulashni so'rang.",
  },
}

const day38: SpeakingDay = {
  day: 38, cefr: 'B1',
  title: "Rozilik va e'tiroz",
  subtitle: "Fikr bildirish",
  goalUz: "Rozilik yoki e'tirozingizni muloyim bildira olasiz.",
  estMinutes: 14,
  pronunciationFocus: {
    sound: '/tʃ/',
    ipaExample: '/tʃ/ — check, change, question',
    tipUz: "'T' + 'sh' birikmasi — til uchini tanglayga tegizib, keskin qo'yib yuboring. O'zbek tilidagi 'ch' ga o'xshaydi.",
    tipEn: "'T' + 'sh' combined — touch your tongue to the palate and release sharply. Similar to Uzbek 'ch'.",
  },
  recycledChunkIds: ['sp-d36-c1', 'sp-d36-c6', 'sp-d36-c4'],
  chunks: [
    { id: 'sp-d38-c1', en: "I completely agree with you.", uz: "Men siz bilan to'liq roziman.", grammarTip: "'Completely agree' = to'liq roziman. 'Completely' = to'liq (intensifier). 'Agree with' = bilan rozi bo'lmoq. 'With' + person." },
    { id: 'sp-d38-c2', en: "I see your point, but…", uz: "Fikringizni tushunaman, lekin…", grammarTip: "'I see your point' = fikringizni tushunaman. 'See' = tushunmoq (ko'z bilan emas). 'But' = lekin (ziddiyat kiritish)." },
    { id: 'sp-d38-c3', en: "I'm not sure about that.", uz: "Bunga ishonchim komil emas.", grammarTip: "'I'm not sure about …' = … ga ishonchim komil emas. 'Sure' = aniq, ishonchli. 'Not sure' = noaniq. 'About' = haqida." },
    { id: 'sp-d38-c4', en: "That's a good point.", uz: "Bu yaxshi fikr.", grammarTip: "'That's a good point' = bu yaxshi fikr (muhokamada). 'Point' = nuqta/fikr. Diskussiyada fikrni ma'qullash uchun ishlatiladi." },
    { id: 'sp-d38-c5', en: "I'd say it depends.", uz: "Menimcha, vaziyatga bog'liq.", grammarTip: "'I'd say' = 'I would say' (muloyim fikr). 'It depends' = vaziyatga bog'liq. 'Depends on' = ga bog'liq. 'It depends' turg'un ibora." },
    { id: 'sp-d38-c6', en: "What do you think?", uz: "Siz qanday o'ylaysiz?", grammarTip: "'What do you think?' = nima deb o'ylaysiz? 'Think' = o'ylamoq. 'What' + 'do' + 'you' + 'think' — so'roq qolipi. 'Think about/of' = haqida o'ylamoq." },
  ],
  scenario: {
    topic: "discussing an opinion with a friend",
    aiRole: "a friend with an opinion",
    userRole: "you",
    opening: "I think mornings are the best time to study. Do you agree?",
    goalUz: "Rozilik yoki e'tirozingizni muloyim bildiring va sabab ayting.",
  },
}

const day39: SpeakingDay = {
  day: 39, cefr: 'B1',
  title: "Taklif: qabul va rad",
  subtitle: "Taklif qilish va javob",
  goalUz: "Taklifni muloyim qabul qila yoki rad eta olasiz.",
  estMinutes: 14,
  pronunciationFocus: {
    sound: '/eɪ/',
    ipaExample: '/eɪ/ — make, take, invitation',
    tipUz: "/eɪ/ — 'e' dan 'i' ga silliq o'tish. O'zbek tilidagi 'ey' ga o'xshaydi. Lablar yumshoq, og'iz ochiq.",
    tipEn: "/eɪ/ — glide smoothly from 'e' to 'i'. Similar to Uzbek 'ey'. Lips relaxed, mouth open.",
  },
  recycledChunkIds: ['sp-d21-c3', 'sp-d31-c1', 'sp-d32-c6'],
  chunks: [
    { id: 'sp-d39-c1', en: "Would you like to join us?", uz: "Biz bilan qo'shilasizmi?", grammarTip: "'Would you like to + V?' = taklif qilish. 'Would' + 'you' + 'like' + 'to' + V. 'Join us' = bizga qo'shiling. 'Join' = qo'shilmoq." },
    { id: 'sp-d39-c2', en: "I'd love to, thank you.", uz: "Mamnuniyat bilan, rahmat.", grammarTip: "'I'd love to' = men mamnuniyat bilan. 'I'd' = 'I would'. 'Love to' = juda xohlash. Taklifni qabul qilish uchun eng yaxshi ibora." },
    { id: 'sp-d39-c3', en: "I'm afraid I can't make it.", uz: "Afsuski, kela olmayman.", grammarTip: "'I'm afraid' = afsuski (muloyim rad etish). 'Can't make it' = kela olmayman. 'Make it' = biror joyga yetib bormoq (turg'un ibora)." },
    { id: 'sp-d39-c4', en: "Maybe another time.", uz: "Balki boshqa safar.", grammarTip: "'Maybe another time' = balki boshqa safar. 'Another' = boshqa. 'Time' bu yerda 'safar' ma'nosida. Taklifni muloyim rad etish." },
    { id: 'sp-d39-c5', en: "What time should I come?", uz: "Soat nechada kelay?", grammarTip: "'What time should I + V?' = soat nechada … y? 'Should' modal fe'l (kerak/ma'qul). 'Come' = kelmoq." },
    { id: 'sp-d39-c6', en: "Thanks for the invitation.", uz: "Taklif uchun rahmat.", grammarTip: "'Thanks for …' = … uchun rahmat (norasmiy). 'Invitation' = taklif. 'For' + ot/-ing. 'Thank you' rasmiy, 'thanks' norasmiy." },
  ],
  scenario: {
    topic: "inviting and being invited to an event",
    aiRole: "a friend",
    userRole: "you",
    opening: "We're having dinner on Friday — would you like to come?",
    goalUz: "Taklifni qabul qiling yoki muloyim rad eting va sabab ayting.",
  },
}

const day40: SpeakingDay = {
  day: 40, cefr: 'B1',
  title: "Tajriba haqida",
  subtitle: "Present Perfect",
  goalUz: "Hayot tajribalaringiz haqida gapira olasiz.",
  estMinutes: 14,
  pronunciationFocus: {
    sound: '/v/ vs /w/',
    ipaExample: '/v/ — ever, never, have / /w/ — was, work',
    tipUz: "/v/ da tish labga tegadi, /w/ da lablar yumaloq. 'Very' vs 'wary' — butunlay boshqa so'zlar!",
    tipEn: "/v/ has teeth on lip, /w/ has rounded lips. 'Very' vs 'wary' — completely different words!",
    commonError: "O'zbeklar /v/ va /w/ ni farqlamaydi. 'Very' → 'wery' emas! Tish labga tegishi kerak.",
  },
  recycledChunkIds: ['sp-d20-c5', 'sp-d30-c3', 'sp-d36-c1'],
  chunks: [
    { id: 'sp-d40-c1', en: "Have you ever been to London?", uz: "Hech Londonda bo'lganmisiz?", pattern: "Have you ever …?", grammarTip: "'Have you ever + Past Participle?' — Present Perfect so'rog'i. 'Ever' = hech qachon. 'Been' = 'be' ning PP (Past Participle)." },
    { id: 'sp-d40-c2', en: "I've never tried sushi.", uz: "Men hech sushi tatib ko'rmaganman.", grammarTip: "'I've never + PP' = men hech …maganman. 'Never' = hech qachon. 'Tried' = 'try' ning PP (try → tried → tried). 'Never' 've dan keyin keladi." },
    { id: 'sp-d40-c3', en: "I've already finished my work.", uz: "Men ishimni allaqachon tugatdim.", grammarTip: "'Already' = allaqachon (Present Perfect bilan). 'Already' gap o'rtasida: have + already + PP. 'Finished' = finish + -ed (to'g'ri fe'l)." },
    { id: 'sp-d40-c4', en: "She has just left.", uz: "U hozirgina ketdi.", grammarTip: "'Has just + PP' = hozirgina. 'Just' = hozirgina. 'Has' = 'have' ning he/she/it shakli. 'Left' = 'leave' ning PP (leave → left → left)." },
    { id: 'sp-d40-c5', en: "I haven't seen that film yet.", uz: "Men u filmni hali ko'rmaganman.", grammarTip: "'Haven't ... yet' = hali …maganman. 'Seen' = 'see' ning PP (see → saw → seen). 'Yet' gap oxirida (inkor va so'roqda)." },
    { id: 'sp-d40-c6', en: "It's the best food I've ever had.", uz: "Bu men tatib ko'rgan eng zo'r taom.", grammarTip: "'The best + ot + I've ever + PP' = men … eng yaxshisi. 'Best' = 'good' ning superlativi. 'Ever had' = hech qachon …gan." },
  ],
  scenario: {
    topic: "talking about life experiences",
    aiRole: "a curious friend",
    userRole: "you",
    opening: "So, have you ever travelled abroad? Tell me about it!",
    goalUz: "Tajribalaringiz haqida present perfect bilan gapiring.",
  },
}

const day41: SpeakingDay = {
  day: 41, cefr: 'B1',
  title: "Uchrashuv kelishish",
  subtitle: "Reja va tasdiq",
  goalUz: "Uchrashuv vaqtini kelishib, tasdiqlay olasiz.",
  estMinutes: 14,
  pronunciationFocus: {
    sound: '/ʃ/',
    ipaExample: '/ʃ/ — shall, schedule, confirm',
    tipUz: "/ʃ/ — 'sh' tovushi. Til tanglayga yaqin, nafas chiqariladi. O'zbek tilidagi 'sh' ga o'xshaydi.",
    tipEn: "/ʃ/ — the 'sh' sound. Tongue close to the palate, air is released. Similar to Uzbek 'sh'.",
  },
  recycledChunkIds: ['sp-d22-c3', 'sp-d31-c6', 'sp-d37-c5'],
  chunks: [
    { id: 'sp-d41-c1', en: "Let's arrange a meeting.", uz: "Keling, uchrashuv tashkil qilaylik.", grammarTip: "'Let's + V' = taklif. 'Arrange' = tashkil qilmoq. 'A meeting' = uchrashuv. 'Arrange a meeting' rasmiy ibora." },
    { id: 'sp-d41-c2', en: "Shall we meet on Monday?", uz: "Dushanba kuni uchrashaylikmi?", grammarTip: "'Shall we + V?' = taklif (Britaniya). 'Shall' = 'will' ning varianti, taklif uchun. 'On Monday' = dushanba kuni. 'On' + kun." },
    { id: 'sp-d41-c3', en: "That works for me.", uz: "Bu menga to'g'ri keladi.", grammarTip: "'That works for me' = bu menga mos keladi. 'Works' = ishlaydi/mos keladi. Turg'un ibora. 'For me' = men uchun." },
    { id: 'sp-d41-c4', en: "Can we change the time?", uz: "Vaqtni o'zgartira olamizmi?", grammarTip: "'Can we change …?' = o'zgartira olamizmi? 'Change the time' = vaqtni o'zgartirmoq. 'The time' = belgilangan vaqt." },
    { id: 'sp-d41-c5', en: "Let me check my schedule.", uz: "Jadvalimni tekshirib ko'ray.", grammarTip: "'Let me + V' = ruxsat bering … y. 'Check' = tekshirmoq. 'My schedule' = mening jadvalim. Britaniya: 'diary', AQSH: 'schedule'." },
    { id: 'sp-d41-c6', en: "I'll confirm by email.", uz: "Email orqali tasdiqlayman.", grammarTip: "'Confirm' = tasdiqlash. 'By email' = email orqali. 'By' + vosita (by phone, by email). 'I'll' = 'I will'." },
  ],
  scenario: {
    topic: "arranging a meeting with a colleague",
    aiRole: "a colleague",
    userRole: "you",
    opening: "We need to discuss the project. When are you free to meet?",
    goalUz: "Uchrashuv vaqtini kelishing va tasdiqlang.",
  },
}

const day42: SpeakingDay = {
  day: 42, cefr: 'B1',
  title: "Maslahat berish",
  subtitle: "should / could",
  goalUz: "Muloyim maslahat bera va so'ray olasiz.",
  estMinutes: 14,
  pronunciationFocus: {
    sound: '/ʊ/',
    ipaExample: '/ʊ/ — good, could, should',
    tipUz: "/ʊ/ qisqa va bo'sh — lablarni yumaloqlang, lekin tarang emas. 'Good' (/gʊd/) va 'food' (/fuːd/) farqiga e'tibor bering.",
    tipEn: "/ʊ/ is short and relaxed — round your lips but don't tense them. Note the difference between 'good' (/gʊd/) and 'food' (/fuːd/).",
  },
  recycledChunkIds: ['sp-d38-c2', 'sp-d38-c3', 'sp-d36-c1'],
  chunks: [
    { id: 'sp-d42-c1', en: "What should I do?", uz: "Men nima qilishim kerak?", grammarTip: "'What should I + V?' = nima qilishim kerak? 'Should' modal fe'l (maslahat). 'Should I' so'roqda: should + sub'ekt + V." },
    { id: 'sp-d42-c2', en: "You should see a doctor.", uz: "Siz shifokorga ko'rinishingiz kerak.", pattern: "You should …", grammarTip: "'You should + V' = siz … kerak. 'Should' + asosiy fe'l (to'siz). 'See a doctor' = shifokorga ko'rinmoq." },
    { id: 'sp-d42-c3', en: "You could try this.", uz: "Buni sinab ko'rsangiz bo'ladi.", grammarTip: "'Could' = mumkin (should dan zaifroq maslahat). 'Could try' = sinab ko'rsangiz bo'ladi. 'Try' = sinab ko'rmoq." },
    { id: 'sp-d42-c4', en: "If I were you, I'd wait.", uz: "Sizning o'rningizda bo'lsam, kutardim.", grammarTip: "'If I were you' = sizning o'rningizda bo'lsam (Second Conditional). 'Were' — birlikda 'was' emas, 'were' ishlatiladi! 'I'd' = 'I would'." },
    { id: 'sp-d42-c5', en: "That's good advice.", uz: "Bu yaxshi maslahat.", grammarTip: "'Good advice' = yaxshi maslahat. 'Advice' = maslahat (sanalmaydigan ot, 'advices' emas!). 'A piece of advice' = bitta maslahat." },
    { id: 'sp-d42-c6', en: "Maybe you should rest.", uz: "Balki dam olishingiz kerak.", grammarTip: "'Maybe + gap' = balki. 'You should rest' = dam olishingiz kerak. 'Rest' = dam olmoq (fe'l). 'Maybe' gap boshida keladi." },
  ],
  scenario: {
    topic: "giving advice to a friend with a problem",
    aiRole: "a friend with a problem",
    userRole: "an adviser",
    opening: "I'm so tired lately and I can't sleep well. What should I do?",
    goalUz: "Muloyim maslahat bering (should / could).",
  },
}

const day43: SpeakingDay = {
  day: 43, cefr: 'B1',
  title: "Rejalar va orzular",
  subtitle: "Kelajak haqida",
  goalUz: "Kelajak rejalaringiz va orzularingizni ayta olasiz.",
  estMinutes: 14,
  pronunciationFocus: {
    sound: '/ɜː/',
    ipaExample: '/ɜː/ — world, work, journey',
    tipUz: "/ɜː/ — tilni o'rtaga qo'ying va lablarni yumaloqlamang. O'zbek tilida bu tovush yo'q. 'World' va 'word' farqiga e'tibor bering.",
    tipEn: "/ɜː/ — tongue in the middle, lips not rounded. Uzbek doesn't have this sound. Note the difference between 'world' and 'word'.",
  },
  recycledChunkIds: ['sp-d21-c4', 'sp-d21-c5', 'sp-d40-c6'],
  chunks: [
    { id: 'sp-d43-c1', en: "I hope to study abroad.", uz: "Men chet elda o'qishni umid qilaman.", grammarTip: "'Hope to + V' = … ni umid qilmoq. 'Hope' = umid qilmoq. 'Study abroad' = chet elda o'qimoq. 'Abroad' = chet el (oldidan 'to/in' qo'yilmaydi)." },
    { id: 'sp-d43-c2', en: "I'm planning to start a business.", uz: "Men biznes boshlashni rejalashtiryapman.", grammarTip: "'Planning to + V' = rejalashtirmoq. 'Plan to + V' = …moqchi. 'Start a business' = biznes boshlash. 'A business' = biznes (sanaladigan)." },
    { id: 'sp-d43-c3', en: "I might move to a new city.", uz: "Men yangi shaharga ko'chishim mumkin.", grammarTip: "'Might + V' = ehtimol (50% ehtimol). 'Might' 'may' dan noaniqroq. 'Move to' = ko'chib bormoq. 'A new city' = yangi shahar." },
    { id: 'sp-d43-c4', en: "In five years, I want to grow.", uz: "Besh yildan keyin men o'sishni istayman.", grammarTip: "'In + vaqt' = …dan keyin (kelajak). 'In five years' = besh yildan keyin. 'Want to grow' = o'sishni istamoq. 'Grow' = o'smoq/rivojlanmoq." },
    { id: 'sp-d43-c5', en: "My dream is to travel the world.", uz: "Mening orzuim — dunyoni aylanib chiqish.", grammarTip: "'My dream is to + V' = mening orzuyim … . 'Travel the world' = dunyoni sayohat qilmoq. 'The world' = dunyo (har doim 'the' bilan)." },
    { id: 'sp-d43-c6', en: "What are your goals?", uz: "Maqsadlaringiz qanday?", grammarTip: "'What are your goals?' = maqsadlaringiz qanday? 'Goals' = maqsadlar (ko'plik). 'Your goals' = sizning maqsadlaringiz." },
  ],
  scenario: {
    topic: "talking about dreams and future goals",
    aiRole: "a curious friend",
    userRole: "you",
    opening: "If you could do anything in the future, what would it be?",
    goalUz: "Kelajak rejalaringiz va orzularingizni ayting.",
  },
}

const day44: SpeakingDay = {
  day: 44, cefr: 'B1',
  title: "Sabab va natija",
  subtitle: "because / so",
  goalUz: "Qaror va sabablaringizni tushuntira olasiz.",
  estMinutes: 14,
  pronunciationFocus: {
    sound: '/aɪ/',
    ipaExample: '/aɪ/ — tired, why, I'm',
    tipUz: "/aɪ/ — 'a' dan 'i' ga silliq o'tish. 'Tired' ikki bo'g'in: ti-red (/taɪəd/). 'Why' bir bo'g'in: /waɪ/.",
    tipEn: "/aɪ/ — glide smoothly from 'a' to 'i'. 'Tired' is two syllables: ti-red (/taɪəd/). 'Why' is one syllable: /waɪ/.",
  },
  recycledChunkIds: ['sp-d40-c2', 'sp-d43-c1', 'sp-d38-c5'],
  chunks: [
    { id: 'sp-d44-c1', en: "I'm tired because I worked late.", uz: "Charchadim, chunki kech ishladim.", grammarTip: "'Because' = chunki (sabab bog'lovchisi). 'Because + to'liq gap'. 'Worked' = 'work' + '-ed' (to'g'ri fe'l o'tgan zamon). 'Late' = kech." },
    { id: 'sp-d44-c2', en: "It was raining, so we stayed home.", uz: "Yomg'ir yog'ayotgandi, shuning uchun uyda qoldik.", grammarTip: "'So' = shuning uchun (natija bog'lovchisi). 'Was raining' = Past Continuous. 'Stayed home' = uyda qoldik ('at' qo'yilmaydi)." },
    { id: 'sp-d44-c3', en: "I learn English so I can travel.", uz: "Men sayohat qilish uchun ingliz tilini o'rganaman.", grammarTip: "'So I can + V' = … uchun (maqsad). 'Learn' = o'rganmoq. 'So that' — maqsad bildiradi. 'So I can travel' = sayohat qilishim uchun." },
    { id: 'sp-d44-c4', en: "Why did you choose this?", uz: "Nega buni tanladingiz?", grammarTip: "'Why did you + V?' = nega … dingiz? 'Why' = nega. 'Did' + sub'ekt + asosiy fe'l — o'tgan zamon so'rog'i. 'Choose' = tanlamoq (choose → chose → chosen)." },
    { id: 'sp-d44-c5', en: "The reason is simple.", uz: "Sababi oddiy.", grammarTip: "'The reason is …' = sababi … . 'Reason' = sabab. 'Simple' = oddiy. 'The reason + is + sifat' — sababni tushuntirish." },
    { id: 'sp-d44-c6', en: "That's why I'm here.", uz: "Shuning uchun men shu yerdaman.", grammarTip: "'That's why' = shuning uchun. 'That's' = 'That is'. 'Why' bu yerda 'nega' emas, 'shuning uchun' ma'nosida. 'I'm here' = men shu yerdaman." },
  ],
  scenario: {
    topic: "explaining a decision and its reasons",
    aiRole: "a curious friend",
    userRole: "you",
    opening: "I'm curious — why did you decide to learn English?",
    goalUz: "Qaror va sabablaringizni because va so bilan tushuntiring.",
  },
}

const day45: SpeakingDay = {
  day: 45, cefr: 'B1',
  title: "Intervyu asoslari",
  subtitle: "O'zini taqdim etish",
  goalUz: "Oddiy ish intervyusida o'zingizni taqdim eta olasiz.",
  estMinutes: 15,
  pronunciationFocus: {
    sound: '/θ/',
    ipaExample: '/θ/ — strength, nothing, think',
    tipUz: "/θ/ — til tishlar orasida, nafas chiqaring (ovozsiz). 'Strength' = /streŋθ/ — /ŋ/ va /θ/ birikmasi qiyin.",
    tipEn: "/θ/ — tongue between teeth, breathe out (voiceless). 'Strength' = /streŋθ/ — the /ŋ/ + /θ/ combination is tricky.",
    commonError: "O'zbeklar 'strength' ni /strɛng/ deb talaffuz qiladi. So'z oxiridagi /θ/ ni unutmang!",
  },
  recycledChunkIds: ['sp-d30-c1', 'sp-d38-c1', 'sp-d42-c2'],
  chunks: [
    { id: 'sp-d45-c1', en: "Tell me about yourself.", uz: "O'zingiz haqingizda gapiring.", grammarTip: "'Tell me about …' = … haqida gapiring. 'Tell' = aytmoq (tell → told → told). 'Yourself' = o'zingiz (reflexive pronoun)." },
    { id: 'sp-d45-c2', en: "My strength is teamwork.", uz: "Mening kuchli tomonim — jamoada ishlash.", grammarTip: "'My strength is …' = mening kuchli tomonim. 'Strength' = kuchli tomon. 'Teamwork' = jamoada ishlash (bir so'z)." },
    { id: 'sp-d45-c3', en: "I'm good at solving problems.", uz: "Men muammolarni hal qilishda yaxshiman.", grammarTip: "'Good at + V-ing' = … da yaxshi. 'Good at' = …da mohir. 'Solving' = 'solve' + '-ing'. 'Problems' = muammolar." },
    { id: 'sp-d45-c4', en: "Why do you want this job?", uz: "Nega bu ishni xohlaysiz?", grammarTip: "'Why do you want …?' = nega xohlaysiz? 'Want' = xohlamoq. 'This job' = bu ish. Intervyuda eng ko'p beriladigan savol." },
    { id: 'sp-d45-c5', en: "I'm a quick learner.", uz: "Men tez o'rganaman.", grammarTip: "'A quick learner' = tez o'rganuvchi. 'Quick' = tez (sifat). 'Learner' = o'rganuvchi (so'z oxirida -er). 'Quickly' ravish, 'quick' sifat." },
    { id: 'sp-d45-c6', en: "Do you have any questions?", uz: "Savollaringiz bormi?", grammarTip: "'Do you have any …?' = bormi? 'Any questions' = biror savol. 'Any' so'roq gaplarda 'some' o'rnida. 'Questions' = savollar." },
  ],
  scenario: {
    topic: "a basic job interview",
    aiRole: "an interviewer",
    userRole: "a candidate",
    opening: "Thanks for coming in. So, tell me a little about yourself.",
    goalUz: "O'zingizni taqdim eting, kuchli tomoningizni ayting va savol bering.",
  },
}

const day46: SpeakingDay = {
  day: 46, cefr: 'B1',
  title: "Bankda hisob ochish",
  subtitle: "Hujjatlar va to'lovlar",
  goalUz: "Bankda hisob ocha olasiz va shartlar haqida so'raysiz.",
  estMinutes: 15,
  chunks: [
    { id: 'sp-d46-c1', en: "I'd like to open an account.", uz: "Men hisob ochmoqchiman." },
    { id: 'sp-d46-c2', en: "What documents do I need?", uz: "Menga qanday hujjatlar kerak?" },
    { id: 'sp-d46-c3', en: "How long does it take?", uz: "Bu qancha vaqt oladi?" },
    { id: 'sp-d46-c4', en: "Is there a monthly fee?", uz: "Oylik to'lov bormi?" },
    { id: 'sp-d46-c5', en: "Can I check my balance?", uz: "Balansimni tekshira olamanmi?" },
    { id: 'sp-d46-c6', en: "I'd like to transfer money.", uz: "Men pul o'tkazmoqchiman." },
  ],
  scenario: {
    topic: "opening a bank account",
    aiRole: "a bank clerk",
    userRole: "a customer",
    opening: "Good morning! How can I help you today?",
    goalUz: "Hisob ochishni so'rang, kerakli hujjat va to'lov haqida so'rang.",
  },
}

const day47: SpeakingDay = {
  day: 47, cefr: 'B1',
  title: "Pochtada",
  subtitle: "Posilka jo'natish",
  goalUz: "Posilka jo'nata olasiz va narx/vaqt haqida so'raysiz.",
  estMinutes: 14,
  chunks: [
    { id: 'sp-d47-c1', en: "I'd like to send this parcel.", uz: "Men bu posilkani jo'natmoqchiman." },
    { id: 'sp-d47-c2', en: "How much does it cost to send?", uz: "Jo'natish qancha turadi?" },
    { id: 'sp-d47-c3', en: "How long will it take to arrive?", uz: "Yetib borishi qancha vaqt oladi?" },
    { id: 'sp-d47-c4', en: "Is there a cheaper option?", uz: "Arzonroq variant bormi?" },
    { id: 'sp-d47-c5', en: "I'd like to track my package.", uz: "Men posilkamni kuzatmoqchiman." },
    { id: 'sp-d47-c6', en: "It's fragile, please be careful.", uz: "U mo'rt, ehtiyot bo'ling, iltimos." },
  ],
  scenario: {
    topic: "sending a parcel at the post office",
    aiRole: "a postal clerk",
    userRole: "a customer",
    opening: "Hello! What can I do for you?",
    goalUz: "Posilka jo'nating, narx va yetkazib berish vaqtini so'rang.",
  },
}

const day48: SpeakingDay = {
  day: 48, cefr: 'B1',
  title: "Kvartira ijarasi",
  subtitle: "Ijara shartlari",
  goalUz: "Ijara haqida so'ray olasiz va shartlarni aniqlaysiz.",
  estMinutes: 15,
  chunks: [
    { id: 'sp-d48-c1', en: "I'm looking for a flat to rent.", uz: "Men ijaraga kvartira qidiryapman." },
    { id: 'sp-d48-c2', en: "How much is the rent per month?", uz: "Oyiga ijara qancha?" },
    { id: 'sp-d48-c3', en: "Are bills included?", uz: "Kommunal to'lovlar kiradimi?" },
    { id: 'sp-d48-c4', en: "Can I see the flat?", uz: "Kvartirani ko'rsam bo'ladimi?" },
    { id: 'sp-d48-c5', en: "When can I move in?", uz: "Qachon ko'chib o'ta olaman?" },
    { id: 'sp-d48-c6', en: "Is there a deposit?", uz: "Garov puli bormi?" },
  ],
  scenario: {
    topic: "renting a flat",
    aiRole: "a landlord",
    userRole: "a tenant",
    opening: "Hi, you called about the flat? What would you like to know?",
    goalUz: "Ijara narxi, kommunal va ko'chib o'tish haqida so'rang.",
  },
}

const day49: SpeakingDay = {
  day: 49, cefr: 'B1',
  title: "Ish suhbati: tajriba",
  subtitle: "Tajriba va sharoit",
  goalUz: "Ish tajribangizni tushuntira olasiz.",
  estMinutes: 15,
  chunks: [
    { id: 'sp-d49-c1', en: "I have five years of experience.", uz: "Mening besh yillik tajribam bor." },
    { id: 'sp-d49-c2', en: "In my last job, I managed a team.", uz: "Oxirgi ishimda men jamoani boshqardim." },
    { id: 'sp-d49-c3', en: "I'm looking for a new challenge.", uz: "Men yangi sinov izlayapman." },
    { id: 'sp-d49-c4', en: "I work well under pressure.", uz: "Men bosim ostida yaxshi ishlayman." },
    { id: 'sp-d49-c5', en: "What are the working hours?", uz: "Ish vaqti qanday?" },
    { id: 'sp-d49-c6', en: "When will you make a decision?", uz: "Qachon qaror qabul qilasiz?" },
  ],
  scenario: {
    topic: "a job interview about experience",
    aiRole: "an interviewer",
    userRole: "a candidate",
    opening: "So, tell me about your work experience so far.",
    goalUz: "Tajribangizni ayting va ish sharoiti haqida so'rang.",
  },
}

const day50: SpeakingDay = {
  day: 50, cefr: 'B1',
  title: "Texnik yordam",
  subtitle: "Muammoni hal qilish",
  goalUz: "Texnik muammoni tushuntira olasiz va yechim so'raysiz.",
  estMinutes: 14,
  chunks: [
    { id: 'sp-d50-c1', en: "My internet isn't working.", uz: "Mening internetim ishlamayapti." },
    { id: 'sp-d50-c2', en: "I've already tried restarting it.", uz: "Men uni qayta yoqib ko'rdim allaqachon." },
    { id: 'sp-d50-c3', en: "When will it be fixed?", uz: "Qachon tuzatiladi?" },
    { id: 'sp-d50-c4', en: "Can you send a technician?", uz: "Texnik yubora olasizmi?" },
    { id: 'sp-d50-c5', en: "How long will it take?", uz: "Bu qancha vaqt oladi?" },
    { id: 'sp-d50-c6', en: "Thank you for your patience.", uz: "Sabringiz uchun rahmat." },
  ],
  scenario: {
    topic: "calling tech support about the internet",
    aiRole: "a support agent",
    userRole: "a customer",
    opening: "Tech support, how can I help you today?",
    goalUz: "Muammoni ayting, nima qilganingizni tushuntiring va yechim so'rang.",
  },
}

const day51: SpeakingDay = {
  day: 51, cefr: 'B1',
  title: "Sayohat rejasi",
  subtitle: "Sayohatni rejalashtirish",
  goalUz: "Sayohatingizni rejalashtira olasiz va maslahat so'raysiz.",
  estMinutes: 15,
  chunks: [
    { id: 'sp-d51-c1', en: "I'm planning a trip to Turkey.", uz: "Men Turkiyaga sayohat rejalashtiryapman." },
    { id: 'sp-d51-c2', en: "What's the best time to visit?", uz: "Borishning eng yaxshi vaqti qachon?" },
    { id: 'sp-d51-c3', en: "How do I get from the airport?", uz: "Aeroportdan qanday boraman?" },
    { id: 'sp-d51-c4', en: "Do I need a visa?", uz: "Menga viza kerakmi?" },
    { id: 'sp-d51-c5', en: "Can you recommend a hotel?", uz: "Mehmonxona tavsiya qila olasizmi?" },
    { id: 'sp-d51-c6', en: "I can't wait to go.", uz: "Borishni intiqlik bilan kutyapman." },
  ],
  scenario: {
    topic: "planning a holiday trip",
    aiRole: "a travel agent",
    userRole: "a traveller",
    opening: "So, where are you thinking of going on holiday?",
    goalUz: "Rejangizni ayting; vaqt, viza va mehmonxona haqida so'rang.",
  },
}

const day52: SpeakingDay = {
  day: 52, cefr: 'B1',
  title: "Restoranda shikoyat",
  subtitle: "Muloyim shikoyat",
  goalUz: "Restoranda muloyim shikoyat qila olasiz va yechim so'raysiz.",
  estMinutes: 14,
  chunks: [
    { id: 'sp-d52-c1', en: "Excuse me, this isn't what I ordered.", uz: "Kechirasiz, bu men buyurtma qilgan narsa emas." },
    { id: 'sp-d52-c2', en: "The food is cold.", uz: "Ovqat sovuq." },
    { id: 'sp-d52-c3', en: "We've been waiting a long time.", uz: "Biz uzoq vaqt kutyapmiz." },
    { id: 'sp-d52-c4', en: "Could you bring the manager?", uz: "Menejerni chaqira olasizmi?" },
    { id: 'sp-d52-c5', en: "Could we get a discount?", uz: "Chegirma olsak bo'ladimi?" },
    { id: 'sp-d52-c6', en: "Thank you for sorting it out.", uz: "Hal qilganingiz uchun rahmat." },
  ],
  scenario: {
    topic: "making a polite complaint at a restaurant",
    aiRole: "a waiter",
    userRole: "a customer",
    opening: "Is everything alright with your meal?",
    goalUz: "Muloyim shikoyat qiling va yechim so'rang.",
  },
}

const day53: SpeakingDay = {
  day: 53, cefr: 'B1',
  title: "Dorixonada",
  subtitle: "Dori so'rash",
  goalUz: "Dorixonada belgini ayta olasiz va dori so'raysiz.",
  estMinutes: 14,
  chunks: [
    { id: 'sp-d53-c1', en: "Do you have something for a cough?", uz: "Yo'tal uchun biror narsa bormi?" },
    { id: 'sp-d53-c2', en: "I need something for a headache.", uz: "Menga bosh og'rig'i uchun dori kerak." },
    { id: 'sp-d53-c3', en: "How often should I take it?", uz: "Buni qancha vaqtda bir ichishim kerak?" },
    { id: 'sp-d53-c4', en: "Are there any side effects?", uz: "Yon ta'sirlari bormi?" },
    { id: 'sp-d53-c5', en: "Do I need a prescription?", uz: "Menga retsept kerakmi?" },
    { id: 'sp-d53-c6', en: "How much do I owe you?", uz: "Sizga qancha qarzdorman?" },
  ],
  scenario: {
    topic: "buying medicine at the pharmacy",
    aiRole: "a pharmacist",
    userRole: "a customer",
    opening: "Hello, how can I help you today?",
    goalUz: "Belgini ayting, dori va uni qanday ichish haqida so'rang.",
  },
}

const day54: SpeakingDay = {
  day: 54, cefr: 'B1',
  title: "Sport va sog'liq",
  subtitle: "Sog'lom turmush",
  goalUz: "Sog'lom turmush odatlaringiz haqida gapira olasiz.",
  estMinutes: 14,
  chunks: [
    { id: 'sp-d54-c1', en: "I'm trying to get fit.", uz: "Men sog'lom bo'lishga harakat qilyapman." },
    { id: 'sp-d54-c2', en: "I go to the gym three times a week.", uz: "Men haftada uch marta sport zaliga boraman." },
    { id: 'sp-d54-c3', en: "I've started running in the mornings.", uz: "Men ertalab yugurishni boshladim." },
    { id: 'sp-d54-c4', en: "I'm trying to eat healthier.", uz: "Men sog'lomroq ovqatlanishga harakat qilyapman." },
    { id: 'sp-d54-c5', en: "How do you stay in shape?", uz: "Siz qanday formada qolasiz?" },
    { id: 'sp-d54-c6', en: "It's good for your health.", uz: "Bu sog'lig'ingiz uchun foydali." },
  ],
  scenario: {
    topic: "chatting about fitness and health",
    aiRole: "a friend",
    userRole: "you",
    opening: "You look great! Have you been working out?",
    goalUz: "Sog'lom turmush odatlaringizni ayting va savol bering.",
  },
}

const day55: SpeakingDay = {
  day: 55, cefr: 'B1',
  title: "Film va kitob",
  subtitle: "Tavsiya berish",
  goalUz: "Film yoki kitob haqida fikr bildira va tavsiya bera olasiz.",
  estMinutes: 14,
  chunks: [
    { id: 'sp-d55-c1', en: "Have you seen this film?", uz: "Bu filmni ko'rganmisiz?" },
    { id: 'sp-d55-c2', en: "It's about a true story.", uz: "U haqiqiy voqea haqida." },
    { id: 'sp-d55-c3', en: "The acting was amazing.", uz: "Aktyorlik o'yini ajoyib edi." },
    { id: 'sp-d55-c4', en: "I'd highly recommend it.", uz: "Men buni qattiq tavsiya qilaman." },
    { id: 'sp-d55-c5', en: "What kind of films do you like?", uz: "Qanday filmlarni yoqtirasiz?" },
    { id: 'sp-d55-c6', en: "The ending was surprising.", uz: "Yakuni kutilmagan edi." },
  ],
  scenario: {
    topic: "discussing a film or book",
    aiRole: "a friend",
    userRole: "you",
    opening: "I just watched a great film last night. Do you like films?",
    goalUz: "Film yoki kitob haqida fikringizni ayting va tavsiya bering.",
  },
}

const day56: SpeakingDay = {
  day: 56, cefr: 'B1',
  title: "Yangiliklar haqida fikr",
  subtitle: "Fikr bildirish",
  goalUz: "Yangilik haqida fikr bildira va sabab ayta olasiz.",
  estMinutes: 14,
  chunks: [
    { id: 'sp-d56-c1', en: "Did you hear the news?", uz: "Yangilikni eshitdingizmi?" },
    { id: 'sp-d56-c2', en: "In my opinion, it's a good thing.", uz: "Mening fikrimcha, bu yaxshi narsa." },
    { id: 'sp-d56-c3', en: "I'm not sure it will work.", uz: "Bu ishlashiga ishonchim yo'q." },
    { id: 'sp-d56-c4', en: "It depends on how you look at it.", uz: "Bu qanday qarashingizga bog'liq." },
    { id: 'sp-d56-c5', en: "Many people disagree.", uz: "Ko'pchilik rozi emas." },
    { id: 'sp-d56-c6', en: "Only time will tell.", uz: "Faqat vaqt ko'rsatadi." },
  ],
  scenario: {
    topic: "discussing a piece of news",
    aiRole: "a friend",
    userRole: "you",
    opening: "Did you see the news about the new project in the city? What do you think?",
    goalUz: "Yangilik haqida fikr bildiring va sabab ayting.",
  },
}

const day57: SpeakingDay = {
  day: 57, cefr: 'B1',
  title: "Atrof-muhit",
  subtitle: "Tabiatni asrash",
  goalUz: "Atrof-muhit haqida fikr bildira olasiz.",
  estMinutes: 14,
  chunks: [
    { id: 'sp-d57-c1', en: "We should protect the environment.", uz: "Biz atrof-muhitni himoya qilishimiz kerak." },
    { id: 'sp-d57-c2', en: "I try to save water and electricity.", uz: "Men suv va elektrni tejashga harakat qilaman." },
    { id: 'sp-d57-c3', en: "Pollution is a big problem.", uz: "Ifloslanish katta muammo." },
    { id: 'sp-d57-c4', en: "We use too much plastic.", uz: "Biz juda ko'p plastik ishlatamiz." },
    { id: 'sp-d57-c5', en: "Small changes can help.", uz: "Kichik o'zgarishlar yordam berishi mumkin." },
    { id: 'sp-d57-c6', en: "Everyone should do their part.", uz: "Har kim o'z hissasini qo'shishi kerak." },
  ],
  scenario: {
    topic: "talking about the environment",
    aiRole: "a friend",
    userRole: "you",
    opening: "I've been thinking about how much we waste. Do you care about the environment?",
    goalUz: "Atrof-muhit haqida fikringizni va nima qilishingizni ayting.",
  },
}

const day58: SpeakingDay = {
  day: 58, cefr: 'B1',
  title: "Texnologiya va tarmoq",
  subtitle: "Ijtimoiy tarmoq odatlari",
  goalUz: "Texnologiya odatlaringiz haqida gapira olasiz.",
  estMinutes: 14,
  chunks: [
    { id: 'sp-d58-c1', en: "I spend too much time on my phone.", uz: "Men telefonimda juda ko'p vaqt sarflayman." },
    { id: 'sp-d58-c2', en: "Social media can be useful.", uz: "Ijtimoiy tarmoqlar foydali bo'lishi mumkin." },
    { id: 'sp-d58-c3', en: "But it can also waste time.", uz: "Lekin u vaqtni behuda sarflashi ham mumkin." },
    { id: 'sp-d58-c4', en: "I follow a lot of accounts.", uz: "Men ko'p akkauntlarni kuzataman." },
    { id: 'sp-d58-c5', en: "Technology changes so fast.", uz: "Texnologiya juda tez o'zgaradi." },
    { id: 'sp-d58-c6', en: "How often do you check it?", uz: "Siz uni qancha tez-tez tekshirasiz?" },
  ],
  scenario: {
    topic: "discussing technology and social media habits",
    aiRole: "a friend",
    userRole: "you",
    opening: "I feel like I'm always on my phone these days. Are you the same?",
    goalUz: "Texnologiya va tarmoq odatlaringiz haqida gapiring.",
  },
}

const day59: SpeakingDay = {
  day: 59, cefr: 'B1',
  title: "Ta'lim va o'rganish",
  subtitle: "O'qish haqida",
  goalUz: "O'qish va o'rganish haqida gapira olasiz.",
  estMinutes: 14,
  chunks: [
    { id: 'sp-d59-c1', en: "I'm studying to improve my skills.", uz: "Men ko'nikmalarimni oshirish uchun o'qiyapman." },
    { id: 'sp-d59-c2', en: "Learning a language takes time.", uz: "Til o'rganish vaqt talab qiladi." },
    { id: 'sp-d59-c3', en: "I study a little every day.", uz: "Men har kuni ozgina o'qiyman." },
    { id: 'sp-d59-c4', en: "Practice is the most important thing.", uz: "Amaliyot eng muhim narsa." },
    { id: 'sp-d59-c5', en: "I want to continue learning.", uz: "Men o'qishni davom ettirmoqchiman." },
    { id: 'sp-d59-c6', en: "What are you learning these days?", uz: "Hozir nima o'rganyapsiz?" },
  ],
  scenario: {
    topic: "talking about learning and education",
    aiRole: "a friend",
    userRole: "you",
    opening: "You're always learning something! What are you working on now?",
    goalUz: "O'qish va o'rganish haqida gapiring.",
  },
}

const day60: SpeakingDay = {
  day: 60, cefr: 'B1',
  title: "Pul va byudjet",
  subtitle: "Tejash haqida",
  goalUz: "Pul tejash va byudjet haqida gapira olasiz.",
  estMinutes: 14,
  chunks: [
    { id: 'sp-d60-c1', en: "I'm trying to save money.", uz: "Men pul tejashga harakat qilyapman." },
    { id: 'sp-d60-c2', en: "I made a budget this month.", uz: "Men bu oy byudjet tuzdim." },
    { id: 'sp-d60-c3', en: "It's too expensive for me.", uz: "Bu men uchun juda qimmat." },
    { id: 'sp-d60-c4', en: "I'm saving for a holiday.", uz: "Men ta'til uchun pul yig'yapman." },
    { id: 'sp-d60-c5', en: "Prices keep going up.", uz: "Narxlar oshib bormoqda." },
    { id: 'sp-d60-c6', en: "It's worth the money.", uz: "U pulga arziydi." },
  ],
  scenario: {
    topic: "talking about money and saving",
    aiRole: "a friend",
    userRole: "you",
    opening: "Everything is so expensive lately! How do you manage your money?",
    goalUz: "Pul tejash va byudjet haqida gapiring.",
  },
}

const day61: SpeakingDay = {
  day: 61, cefr: 'B1',
  title: "Ish-hayot muvozanati",
  subtitle: "Dam olish va ish",
  goalUz: "Ish va dam olish muvozanati haqida gapira olasiz.",
  estMinutes: 14,
  chunks: [
    { id: 'sp-d61-c1', en: "I work long hours.", uz: "Men uzoq soat ishlayman." },
    { id: 'sp-d61-c2', en: "I try to relax at the weekend.", uz: "Men hafta oxirida dam olishga harakat qilaman." },
    { id: 'sp-d61-c3', en: "It's important to take breaks.", uz: "Tanaffus qilish muhim." },
    { id: 'sp-d61-c4', en: "I don't have much free time.", uz: "Mening ko'p bo'sh vaqtim yo'q." },
    { id: 'sp-d61-c5', en: "I need a better balance.", uz: "Menga yaxshiroq muvozanat kerak." },
    { id: 'sp-d61-c6', en: "How do you relax after work?", uz: "Ishdan keyin qanday dam olasiz?" },
  ],
  scenario: {
    topic: "discussing work-life balance",
    aiRole: "a friend",
    userRole: "you",
    opening: "You seem really busy lately. How do you find time to relax?",
    goalUz: "Ish va dam olish muvozanati haqida gapiring.",
  },
}

const day62: SpeakingDay = {
  day: 62, cefr: 'B1',
  title: "Madaniy farqlar",
  subtitle: "An'analar haqida",
  goalUz: "Madaniyat va an'analaringiz haqida gapira olasiz.",
  estMinutes: 14,
  chunks: [
    { id: 'sp-d62-c1', en: "In my country, we do it differently.", uz: "Mening yurtimda biz buni boshqacha qilamiz." },
    { id: 'sp-d62-c2', en: "It's a tradition here.", uz: "Bu yerda bu an'ana." },
    { id: 'sp-d62-c3', en: "I find that interesting.", uz: "Men buni qiziqarli deb bilaman." },
    { id: 'sp-d62-c4', en: "We usually eat dinner late.", uz: "Biz odatda kechki ovqatni kech yeymiz." },
    { id: 'sp-d62-c5', en: "Every culture is different.", uz: "Har bir madaniyat har xil." },
    { id: 'sp-d62-c6', en: "What's it like in your country?", uz: "Sizning yurtingizda qanday?" },
  ],
  scenario: {
    topic: "discussing cultural differences",
    aiRole: "a foreign friend",
    userRole: "you",
    opening: "I love learning about other cultures. Tell me about a tradition in your country.",
    goalUz: "Madaniyatingiz va an'analaringiz haqida gapiring.",
  },
}

const day63: SpeakingDay = {
  day: 63, cefr: 'B1',
  title: "Ishda kelishuv",
  subtitle: "Murosa topish",
  goalUz: "Muammoni muhokama qilib, murosa yechimi taklif qila olasiz.",
  estMinutes: 15,
  chunks: [
    { id: 'sp-d63-c1', en: "Can we find a solution?", uz: "Yechim topa olamizmi?" },
    { id: 'sp-d63-c2', en: "Let's discuss the options.", uz: "Variantlarni muhokama qilaylik." },
    { id: 'sp-d63-c3', en: "I understand your concern.", uz: "Tashvishingizni tushunaman." },
    { id: 'sp-d63-c4', en: "Maybe we can compromise.", uz: "Balki murosaga kela olamiz." },
    { id: 'sp-d63-c5', en: "What do you suggest?", uz: "Nimani taklif qilasiz?" },
    { id: 'sp-d63-c6', en: "Let's meet halfway.", uz: "Keling, o'rtaga kelaylik." },
  ],
  scenario: {
    topic: "negotiating a solution at work",
    aiRole: "a colleague",
    userRole: "you",
    opening: "We have different ideas about this project. How should we move forward?",
    goalUz: "Muammoni muhokama qiling va murosa yechimini taklif qiling.",
  },
}

const day64: SpeakingDay = {
  day: 64, cefr: 'B1',
  title: "Taqdimot qilish",
  subtitle: "Mavzuni tanishtirish",
  goalUz: "Qisqa taqdimot qila olasiz.",
  estMinutes: 15,
  chunks: [
    { id: 'sp-d64-c1', en: "Today I'm going to talk about my idea.", uz: "Bugun men o'z g'oyam haqida gapiraman." },
    { id: 'sp-d64-c2', en: "First, let me give you an overview.", uz: "Avval umumiy ma'lumot beray." },
    { id: 'sp-d64-c3', en: "As you can see here…", uz: "Bu yerda ko'rib turganingizdek…" },
    { id: 'sp-d64-c4', en: "Let me explain why.", uz: "Nima uchunligini tushuntiray." },
    { id: 'sp-d64-c5', en: "Does anyone have questions?", uz: "Kimda savol bor?" },
    { id: 'sp-d64-c6', en: "Thank you for listening.", uz: "Tinglaganingiz uchun rahmat." },
  ],
  scenario: {
    topic: "giving a short presentation",
    aiRole: "an audience member",
    userRole: "a presenter",
    opening: "We're ready when you are. Please, go ahead with your presentation.",
    goalUz: "Mavzuni tanishtiring, tushuntiring va savollarni so'rang.",
  },
}

const day65: SpeakingDay = {
  day: 65, cefr: 'B1',
  title: "Kelishmovchilikni hal qilish",
  subtitle: "Xotirjam suhbat",
  goalUz: "Kelishmovchilikni xotirjam hal qila olasiz.",
  estMinutes: 14,
  chunks: [
    { id: 'sp-d65-c1', en: "I think there's been a misunderstanding.", uz: "Menimcha, tushunmovchilik bo'lgan." },
    { id: 'sp-d65-c2', en: "Let's talk about it calmly.", uz: "Keling, buni xotirjam gaplashaylik." },
    { id: 'sp-d65-c3', en: "I see it differently.", uz: "Men buni boshqacha ko'raman." },
    { id: 'sp-d65-c4', en: "I'm sorry if I upset you.", uz: "Agar xafa qilgan bo'lsam, kechirasiz." },
    { id: 'sp-d65-c5', en: "Let's not argue.", uz: "Keling, janjallashmaylik." },
    { id: 'sp-d65-c6', en: "I hope we can move on.", uz: "Umid qilamanki, davom eta olamiz." },
  ],
  scenario: {
    topic: "resolving a small conflict with a friend",
    aiRole: "a friend",
    userRole: "you",
    opening: "I felt a bit upset about what happened earlier. Can we talk?",
    goalUz: "Kelishmovchilikni xotirjam hal qiling.",
  },
}

const day66: SpeakingDay = {
  day: 66, cefr: 'B1',
  title: "Hikoya aytib berish",
  subtitle: "Voqeani so'zlash",
  goalUz: "Boshingizdan o'tgan voqeani aytib bera olasiz.",
  estMinutes: 14,
  chunks: [
    { id: 'sp-d66-c1', en: "Let me tell you what happened.", uz: "Nima bo'lganini aytib beray." },
    { id: 'sp-d66-c2', en: "It all started when I was young.", uz: "Hammasi men yosh paytimda boshlandi." },
    { id: 'sp-d66-c3', en: "Suddenly, something strange happened.", uz: "To'satdan g'alati narsa yuz berdi." },
    { id: 'sp-d66-c4', en: "In the end, everything was fine.", uz: "Oxir-oqibat, hammasi yaxshi bo'ldi." },
    { id: 'sp-d66-c5', en: "You won't believe what happened.", uz: "Nima bo'lganiga ishonmaysiz." },
    { id: 'sp-d66-c6', en: "It was the funniest moment.", uz: "Bu eng kulgili lahza edi." },
  ],
  scenario: {
    topic: "telling a friend a story",
    aiRole: "a friend",
    userRole: "you",
    opening: "You look like you have a story to tell! What happened?",
    goalUz: "Boshingizdan o'tgan voqeani aytib bering.",
  },
}

const day67: SpeakingDay = {
  day: 67, cefr: 'B1',
  title: "Taxmin va ehtimollik",
  subtitle: "might / must / can't",
  goalUz: "Vaziyat haqida taxmin qila olasiz.",
  estMinutes: 14,
  chunks: [
    { id: 'sp-d67-c1', en: "He might be at work.", uz: "U ishda bo'lishi mumkin." },
    { id: 'sp-d67-c2', en: "She must be tired.", uz: "U charchagan bo'lsa kerak." },
    { id: 'sp-d67-c3', en: "It can't be true.", uz: "Bu rost bo'lishi mumkin emas." },
    { id: 'sp-d67-c4', en: "Maybe they forgot.", uz: "Balki ular unutgandir." },
    { id: 'sp-d67-c5', en: "I'm not sure, but I think so.", uz: "Ishonchim komil emas, lekin shunday deb o'ylayman." },
    { id: 'sp-d67-c6', en: "It's probably going to rain.", uz: "Ehtimol, yomg'ir yog'adi." },
  ],
  scenario: {
    topic: "speculating about a situation",
    aiRole: "a friend",
    userRole: "you",
    opening: "Our friend is late and not answering. Where do you think he is?",
    goalUz: "Vaziyat haqida taxmin qiling (might / must / can't).",
  },
}

const day68: SpeakingDay = {
  day: 68, cefr: 'B1',
  title: "Afsus va o'tmish",
  subtitle: "should have",
  goalUz: "Afsus va o'tmish haqida gapira olasiz.",
  estMinutes: 14,
  chunks: [
    { id: 'sp-d68-c1', en: "I should have studied more.", uz: "Men ko'proq o'qishim kerak edi." },
    { id: 'sp-d68-c2', en: "I shouldn't have said that.", uz: "Men buni aytmasligim kerak edi." },
    { id: 'sp-d68-c3', en: "I wish I had more time.", uz: "Koshki ko'proq vaqtim bo'lsa edi." },
    { id: 'sp-d68-c4', en: "It was a mistake.", uz: "Bu xato edi." },
    { id: 'sp-d68-c5', en: "Next time I'll do better.", uz: "Keyingi safar yaxshiroq qilaman." },
    { id: 'sp-d68-c6', en: "I regret not trying.", uz: "Urinib ko'rmaganimga afsuslanaman." },
  ],
  scenario: {
    topic: "talking about regrets",
    aiRole: "a friend",
    userRole: "you",
    opening: "Is there anything you wish you had done differently?",
    goalUz: "Afsus va o'tmish haqida gapiring (should have).",
  },
}

const day69: SpeakingDay = {
  day: 69, cefr: 'B1',
  title: "Faraziy holatlar",
  subtitle: "if + would",
  goalUz: "Faraziy holatlar haqida gapira olasiz.",
  estMinutes: 15,
  chunks: [
    { id: 'sp-d69-c1', en: "If I had more money, I would travel.", uz: "Agar ko'proq pulim bo'lsa, sayohat qilardim." },
    { id: 'sp-d69-c2', en: "If I were you, I would accept.", uz: "Sizning o'rningizda bo'lsam, qabul qilardim." },
    { id: 'sp-d69-c3', en: "What would you do?", uz: "Siz nima qilardingiz?" },
    { id: 'sp-d69-c4', en: "If it rains, we'll stay home.", uz: "Agar yomg'ir yog'sa, uyda qolamiz." },
    { id: 'sp-d69-c5', en: "I would help if I could.", uz: "Imkonim bo'lsa, yordam berardim." },
    { id: 'sp-d69-c6', en: "It would be nice to travel more.", uz: "Ko'proq sayohat qilish yaxshi bo'lardi." },
  ],
  scenario: {
    topic: "discussing hypothetical situations",
    aiRole: "a friend",
    userRole: "you",
    opening: "If you could change one thing about your life, what would it be?",
    goalUz: "Faraziy holatlar haqida gapiring (if + would).",
  },
}

const day70: SpeakingDay = {
  day: 70, cefr: 'B1',
  title: "Tavsiya va did",
  subtitle: "Tavsiya berish",
  goalUz: "Tavsiya bera va fikringizni ayta olasiz.",
  estMinutes: 14,
  chunks: [
    { id: 'sp-d70-c1', en: "I would recommend trying it.", uz: "Men buni sinab ko'rishni tavsiya qilaman." },
    { id: 'sp-d70-c2', en: "It's definitely worth it.", uz: "Bu albatta arziydi." },
    { id: 'sp-d70-c3', en: "You should give it a go.", uz: "Siz buni sinab ko'rishingiz kerak." },
    { id: 'sp-d70-c4', en: "I'm not a big fan of it.", uz: "Men uni unchalik yoqtirmayman." },
    { id: 'sp-d70-c5', en: "It's a matter of taste.", uz: "Bu did masalasi." },
    { id: 'sp-d70-c6', en: "What would you recommend?", uz: "Siz nimani tavsiya qilasiz?" },
  ],
  scenario: {
    topic: "giving recommendations",
    aiRole: "a friend asking for tips",
    userRole: "you",
    opening: "I want to try something new this weekend. Any recommendations?",
    goalUz: "Tavsiya bering va fikringizni ayting.",
  },
}

const day71: SpeakingDay = {
  day: 71, cefr: 'B1',
  title: "Shahar va qishloq",
  subtitle: "Solishtirish",
  goalUz: "Shahar va qishloqni solishtira olasiz.",
  estMinutes: 14,
  chunks: [
    { id: 'sp-d71-c1', en: "I prefer living in the city.", uz: "Men shaharda yashashni afzal ko'raman." },
    { id: 'sp-d71-c2', en: "The countryside is more peaceful.", uz: "Qishloq tinchroq." },
    { id: 'sp-d71-c3', en: "There's more to do in the city.", uz: "Shaharda qiladigan ish ko'proq." },
    { id: 'sp-d71-c4', en: "But it's also more crowded.", uz: "Lekin u gavjumroq ham." },
    { id: 'sp-d71-c5', en: "Life is slower in the village.", uz: "Qishloqda hayot sekinroq." },
    { id: 'sp-d71-c6', en: "Where would you rather live?", uz: "Qayerda yashashni xohlardingiz?" },
  ],
  scenario: {
    topic: "comparing city and countryside life",
    aiRole: "a friend",
    userRole: "you",
    opening: "Do you prefer city life or the countryside? I can never decide!",
    goalUz: "Shahar va qishloqni solishtiring, afzalligingizni ayting.",
  },
}

const day72: SpeakingDay = {
  day: 72, cefr: 'B1',
  title: "Kelajak bashorati",
  subtitle: "will / might",
  goalUz: "Kelajak haqida bashorat qila olasiz.",
  estMinutes: 14,
  chunks: [
    { id: 'sp-d72-c1', en: "In the future, cars might drive themselves.", uz: "Kelajakda mashinalar o'zini o'zi haydashi mumkin." },
    { id: 'sp-d72-c2', en: "Technology will keep improving.", uz: "Texnologiya yaxshilanishda davom etadi." },
    { id: 'sp-d72-c3', en: "I think robots will do more jobs.", uz: "Menimcha, robotlar ko'proq ish qiladi." },
    { id: 'sp-d72-c4', en: "It's hard to predict.", uz: "Bashorat qilish qiyin." },
    { id: 'sp-d72-c5', en: "Some things will never change.", uz: "Ba'zi narsalar hech qachon o'zgarmaydi." },
    { id: 'sp-d72-c6', en: "What do you think the future holds?", uz: "Kelajak nima olib keladi deb o'ylaysiz?" },
  ],
  scenario: {
    topic: "making predictions about the future",
    aiRole: "a friend",
    userRole: "you",
    opening: "Imagine the world in 50 years. What do you think will be different?",
    goalUz: "Kelajak haqida bashorat qiling (will / might).",
  },
}

const day73: SpeakingDay = {
  day: 73, cefr: 'B1',
  title: "Kuchli va zaif tomon",
  subtitle: "Intervyu savoli",
  goalUz: "Kuchli va zaif tomonlaringizni muvozanatli ayta olasiz.",
  estMinutes: 15,
  chunks: [
    { id: 'sp-d73-c1', en: "My greatest strength is patience.", uz: "Mening eng kuchli tomonim — sabr." },
    { id: 'sp-d73-c2', en: "I sometimes work too hard.", uz: "Men ba'zan haddan tashqari ko'p ishlayman." },
    { id: 'sp-d73-c3', en: "I'm working on improving it.", uz: "Men buni yaxshilash ustida ishlayapman." },
    { id: 'sp-d73-c4', en: "I learn from my mistakes.", uz: "Men xatolarimdan o'rganaman." },
    { id: 'sp-d73-c5', en: "I'm a good team player.", uz: "Men yaxshi jamoa a'zosiman." },
    { id: 'sp-d73-c6', en: "I always try my best.", uz: "Men har doim qo'limdan kelganini qilaman." },
  ],
  scenario: {
    topic: "an interview about strengths and weaknesses",
    aiRole: "an interviewer",
    userRole: "a candidate",
    opening: "What would you say are your greatest strengths and weaknesses?",
    goalUz: "Kuchli va zaif tomonlaringizni muvozanatli ayting.",
  },
}

const day74: SpeakingDay = {
  day: 74, cefr: 'B1',
  title: "Maqsad va motivatsiya",
  subtitle: "Rag'bat haqida",
  goalUz: "Maqsad va motivatsiyangiz haqida gapira olasiz.",
  estMinutes: 14,
  chunks: [
    { id: 'sp-d74-c1', en: "I set goals for myself.", uz: "Men o'zimga maqsadlar qo'yaman." },
    { id: 'sp-d74-c2', en: "I stay motivated by small wins.", uz: "Men kichik g'alabalar bilan rag'batlanaman." },
    { id: 'sp-d74-c3', en: "I never give up easily.", uz: "Men oson taslim bo'lmayman." },
    { id: 'sp-d74-c4', en: "Hard work pays off.", uz: "Mehnat o'z samarasini beradi." },
    { id: 'sp-d74-c5', en: "I believe in myself.", uz: "Men o'zimga ishonaman." },
    { id: 'sp-d74-c6', en: "What motivates you?", uz: "Sizni nima rag'batlantiradi?" },
  ],
  scenario: {
    topic: "talking about goals and motivation",
    aiRole: "a mentor",
    userRole: "you",
    opening: "How do you stay motivated when things get hard?",
    goalUz: "Maqsad va motivatsiyangiz haqida gapiring.",
  },
}

const day75: SpeakingDay = {
  day: 75, cefr: 'B1',
  title: "Yakuniy taqdimot",
  subtitle: "O'zini ishonch bilan taqdim etish",
  goalUz: "O'zingizni ishonch bilan to'liq taqdim eta olasiz — 60-kun yakuni!",
  estMinutes: 15,
  chunks: [
    { id: 'sp-d75-c1', en: "Let me introduce myself properly.", uz: "O'zimni to'liq tanishtiray." },
    { id: 'sp-d75-c2', en: "I'm passionate about learning.", uz: "Men o'rganishga qiziqaman." },
    { id: 'sp-d75-c3', en: "I've come a long way.", uz: "Men uzoq yo'l bosib o'tdim." },
    { id: 'sp-d75-c4', en: "I'm confident speaking English now.", uz: "Men endi ingliz tilida ishonch bilan gapiraman." },
    { id: 'sp-d75-c5', en: "I'm ready for new challenges.", uz: "Men yangi sinovlarga tayyorman." },
    { id: 'sp-d75-c6', en: "Thank you for this opportunity.", uz: "Bu imkoniyat uchun rahmat." },
  ],
  scenario: {
    topic: "a confident full self-presentation",
    aiRole: "an interviewer",
    userRole: "you",
    opening: "This is your moment — tell me all about yourself and why you're here.",
    goalUz: "O'zingizni ishonch bilan to'liq taqdim eting — tabriklaymiz, 60-kun!",
  },
}

export const SPEAKING_DAYS: SpeakingDay[] = [
  day1, day2, day3, day4, day5, day6, day7, day8,
  day9, day10, day11, day12, day13, day14, day15, day16,
  day17, day18, day19, day20, day21, day22, day23, day24,
  day25, day26, day27, day28, day29, day30, day31, day32,
  day33, day34, day35, day36, day37, day38, day39, day40,
  day41, day42, day43, day44, day45, day46, day47, day48,
  day49, day50, day51, day52, day53, day54, day55, day56,
  day57, day58, day59, day60, day61, day62, day63, day64,
  day65, day66, day67, day68, day69, day70, day71, day72,
  day73, day74, day75,
]
