/**
 * seed-interleaved.ts — Interleaved (aralash) takror mashqlarini qo'shish
 *
 * Har darsga 5 ta mashq: dars mavzusini AVVAL o'rganilgan grammatika bilan
 * aralashtiradi (interleaving — retrieval va farqlashni kuchaytiradi).
 * + "🔀 Aralash" exerciseSection.
 *
 * MUHIM: barcha apostrofli matnlar QO'SHTIRNOQda (parallel skript bir tirnoq +
 * apostrof bilan sintaksisni buzgandi). ID'lar 95001+ (barcha mavjuddan yuqori).
 *
 * Ishlatish: npx tsx scripts/seed-interleaved.ts  (idempotent)
 */
import { readFileSync, writeFileSync } from 'fs'

interface Lesson { id: string; name: string; section: string; exercises: string }

// b1Part1.ts darslari — har biri mavzusini boshqa grammatika bilan aralashtiradi
const B1: Lesson[] = [
  {
    id: 'pastHabits', name: 'Past Habits',
    section: "Past habits + Past Simple/Continuous farqi",
    exercises: `    // ── Interleaved Practice: Past Habits + Past Simple/Continuous ──
    { id: ID0, type: 'multiple-choice', instruction: "O'tgan odat va aniq voqeani farqlang:", question: "When I was a child, I _____ in this park every day. Last week, I _____ my old friend here.", options: ["used to play / met", "played / would meet", "would play / used to meet", "was playing / have met"], correct: "used to play / met", explanation: "Har kuni bolalikda = o'tgan odat → used to play. Last week = aniq voqea → Past Simple (met)." },
    { id: ID1, type: 'fill-blank', instruction: "Used to (odat) va Past Simple (bitta voqea):", question: "I _____ in a small village, but last year I _____ to the city.", blanks: ["used to live", "moved"], explanation: "Qishloqda yashash = o'tgan holat → used to live. Last year I moved = aniq voqea → Past Simple." },
    { id: ID2, type: 'error-correction', instruction: "Would xatosi — state fe'llar bilan would ishlatilmaydi:", question: "When I was young, I would have a red bicycle.", errorPart: "would have", correct: "When I was young, I used to have a red bicycle.", explanation: "Have = state fe'l (egalik). Would faqat action fe'llar bilan; state uchun used to." },
    { id: ID3, type: 'multiple-choice', instruction: "Past Continuous (fon) va Past Simple (uzilish):", question: "I _____ TV when the phone suddenly _____.", options: ["was watching / rang", "watched / was ringing", "used to watch / rang", "would watch / rang"], correct: "was watching / rang", explanation: "Davom etgan fon harakat → Past Continuous; uni uzgan qisqa voqea → Past Simple." },
    { id: ID4, type: 'transformation', instruction: "Past Simple ni Used to ga o'zgartiring (odat ekanini ko'rsatish):", question: "He walked to school every day when he was a child.", hint: "He used to ...", correct: "He used to walk to school every day when he was a child.", explanation: "Har kuni yurish = o'tgan odat → used to walk (endi qilmasligini ta'kidlaydi)." },`,
  },
  {
    id: 'causatives', name: 'Causatives',
    section: "Causative + Active/Passive farqi",
    exercises: `    // ── Interleaved Practice: Causatives + Active/Passive ──
    { id: ID0, type: 'multiple-choice', instruction: "Have something done va o'zi qilish:", question: "I can't cut hair myself, so I _____ at the salon. My sister _____ her own hair.", options: ["have it cut / cuts", "have cut it / cut", "get cut it / is cutting", "had cut / has cut"], correct: "have it cut / cuts", explanation: "Boshqa qildiradi → have it cut (causative). O'zi qiladi → cuts (oddiy active)." },
    { id: ID1, type: 'fill-blank', instruction: "Causative (have/get sth done) ni to'ldiring:", question: "We are _____ our house _____ next month (someone else does it).", blanks: ["having", "painted"], explanation: "Have + object + V3 = boshqaga qildirish: having our house painted." },
    { id: ID2, type: 'error-correction', instruction: "Causative tartibi xatosi:", question: "I had cut my hair yesterday by a barber.", errorPart: "had cut my hair", correct: "I had my hair cut yesterday by a barber.", explanation: "To'g'ri tartib: have + OBJECT + V3 → had my hair cut (object fe'ldan oldin)." },
    { id: ID3, type: 'multiple-choice', instruction: "Passive va Causative farqi:", question: "The window _____ by a thief. Then we _____ by a professional.", options: ["was broken / had it repaired", "broke / repaired it", "is broken / repair it", "had broken / was repaired"], correct: "was broken / had it repaired", explanation: "Oddiy passive (kim sindirgani noma'lum) → was broken. Boshqaga tuzattirish → had it repaired." },
    { id: ID4, type: 'transformation', instruction: "Active ni causative (get something done) ga aylantiring:", question: "A mechanic checks my car every year.", hint: "I get my car ...", correct: "I get my car checked every year.", explanation: "Get + object + V3 = boshqaga qildirish: get my car checked." },`,
  },
  {
    id: 'questionTags', name: 'Question Tags',
    section: "Tag question + Direct/Indirect question farqi",
    exercises: `    // ── Interleaved Practice: Question Tags + Direct/Indirect questions ──
    { id: ID0, type: 'multiple-choice', instruction: "Tag question va direct question:", question: "You are from Tashkent, _____? _____ you live near the centre?", options: ["aren't you / Do", "isn't it / Are", "don't you / Did", "are you / Do"], correct: "aren't you / Do", explanation: "Tasdiq gap → inkor tag (aren't you). Direct question → Do + subject + verb." },
    { id: ID1, type: 'fill-blank', instruction: "Tag qo'shing (inkor gap → tasdiq tag):", question: "She hasn't finished yet, _____?", blanks: ["has she"], explanation: "Inkor gap (hasn't) → tasdiq tag (has she). Auxiliary mosligi: have/has." },
    { id: ID2, type: 'error-correction', instruction: "Indirect question tartibi xatosi:", question: "Can you tell me where is the station?", errorPart: "where is the station", correct: "Can you tell me where the station is?", explanation: "Indirect question'da inversiya yo'q: where the station IS (subject + verb)." },
    { id: ID3, type: 'multiple-choice', instruction: "Tag — to be va to do mosligi:", question: "They went home early, _____? He doesn't smoke, _____?", options: ["didn't they / does he", "don't they / does he", "weren't they / is he", "didn't they / is he"], correct: "didn't they / does he", explanation: "Past Simple (went) → didn't they. Present (doesn't) → does he. Tag auxiliary'ga mos kelishi kerak." },
    { id: ID4, type: 'transformation', instruction: "Direct question ni indirect qiling:", question: "What time does the bus leave?", hint: "Do you know what time ...", correct: "Do you know what time the bus leaves?", explanation: "Indirect: inversiya yo'q, 's' qaytadi → what time the bus leaves." },`,
  },
  {
    id: 'modalsSpeculation', name: 'Modals of Speculation',
    section: "Speculation (taxmin) + Obligation (majburiyat) farqi",
    exercises: `    // ── Interleaved Practice: Modals of Speculation + Obligation ──
    { id: ID0, type: 'multiple-choice', instruction: "Speculation va obligation (bir xil so'z, ikki ma'no):", question: "He _____ be at work now (I'm sure). You _____ finish this by 5 PM (rule).", options: ["must / have to", "might / must", "can't / should", "could / need to"], correct: "must / have to", explanation: "Must be = taxmin (100% ishonch). Have to finish = tashqi majburiyat." },
    { id: ID1, type: 'fill-blank', instruction: "Can't (imkonsiz taxmin) ni to'ldiring:", question: "The lights are off, so they _____ be at home.", blanks: ["can't"], explanation: "Dalilga asoslangan imkonsizlik → can't be (mustn't emas — mustn't = taqiq)." },
    { id: ID2, type: 'error-correction', instruction: "Speculation xatosi — mustn't vs can't:", question: "She speaks perfect French, so she mustn't be a beginner.", errorPart: "mustn't be", correct: "She speaks perfect French, so she can't be a beginner.", explanation: "Imkonsiz taxmin → can't be. Mustn't = taqiq (ruxsat yo'q), taxmin emas." },
    { id: ID3, type: 'multiple-choice', instruction: "Might (ehtimol) va must (majburiyat):", question: "It _____ rain later, take an umbrella. You _____ wear a seatbelt — it's the law.", options: ["might / must", "must / might", "can't / should", "should / might"], correct: "might / must", explanation: "Ehtimollik → might rain. Qonuniy majburiyat → must wear." },
    { id: ID4, type: 'transformation', instruction: "Aniq gapni taxminga (must be) aylantiring:", question: "I'm sure he is tired after the trip.", hint: "He must ...", correct: "He must be tired after the trip.", explanation: "Dalilga asoslangan ishonchli taxmin → must be tired." },`,
  },
  {
    id: 'wishesRegrets', name: 'Wishes and Regrets',
    section: "Wish/regret + Conditionals farqi",
    exercises: `    // ── Interleaved Practice: Wishes/Regrets + Conditionals ──
    { id: ID0, type: 'multiple-choice', instruction: "Wish (hozirgi orzu) va wish (o'tmish afsus):", question: "I wish I _____ taller. I wish I _____ harder for the last exam.", options: ["were / had studied", "was / studied", "am / studied", "were / studied"], correct: "were / had studied", explanation: "Hozirgi orzu → wish + Past (were). O'tmish afsus → wish + Past Perfect (had studied)." },
    { id: ID1, type: 'fill-blank', instruction: "If only (kuchli afsus) + Past Perfect:", question: "If only I _____ (not / miss) the train, I wouldn't be late now.", blanks: ["hadn't missed"], explanation: "O'tmishdagi afsus → if only + Past Perfect (hadn't missed)." },
    { id: ID2, type: 'error-correction', instruction: "Wish xatosi — hozirgi orzu uchun Past:", question: "I wish I have more free time these days.", errorPart: "have", correct: "I wish I had more free time these days.", explanation: "Hozirgi (real bo'lmagan) orzu → wish + Past Simple (had), 'have' emas." },
    { id: ID3, type: 'multiple-choice', instruction: "Wish va third conditional (o'tmish):", question: "I wish I _____ you earlier. If I _____ you, I would have helped.", options: ["had called / had called", "called / called", "have called / called", "had called / called"], correct: "had called / had called", explanation: "Ikkalasi ham o'tmishdagi real bo'lmagan holat → Past Perfect (had called)." },
    { id: ID4, type: 'transformation', instruction: "Real holatni wish (afsus) ga aylantiring:", question: "I didn't buy the tickets, and now they are sold out.", hint: "I wish I ...", correct: "I wish I had bought the tickets.", explanation: "O'tmishdagi qilinmagan ish afsusi → wish + Past Perfect (had bought)." },`,
  },
  {
    id: 'futureFormsReview', name: 'Future Forms',
    section: "Will / Going to / Present Continuous / Present Simple farqi",
    exercises: `    // ── Interleaved Practice: Future Forms (will / going to / PC / PS) ──
    { id: ID0, type: 'multiple-choice', instruction: "Dalilli bashorat (going to) va va'da (will):", question: "Look at those clouds! It _____ rain. Don't worry, I _____ carry your bag.", options: ["is going to / will", "will / is going to", "is going to / is going to", "will / will"], correct: "is going to / will", explanation: "Hozirgi dalil → is going to rain. O'sha onda berilgan va'da → will carry." },
    { id: ID1, type: 'fill-blank', instruction: "Arrangement (PC) va timetable (PS):", question: "I _____ the dentist at 3 tomorrow (arranged). The film _____ at 7 pm (schedule).", blanks: ["am meeting", "starts"], explanation: "Kelishilgan uchrashuv → Present Continuous (am meeting). Jadval → Present Simple (starts)." },
    { id: ID2, type: 'error-correction', instruction: "Spontan qaror — will, going to emas:", question: "The phone is ringing. I am going to answer it.", errorPart: "am going to answer", correct: "The phone is ringing. I will answer it.", explanation: "O'sha onda qabul qilingan qaror → will. Going to oldindan rejalashtirilgan uchun." },
    { id: ID3, type: 'multiple-choice', instruction: "Reja (going to) va kelishuv (Present Continuous):", question: "I _____ start a new course next month. We _____ dinner with friends on Friday.", options: ["am going to / are having", "will / will have", "am having / am going to", "are going to / will have"], correct: "am going to / are having", explanation: "Niyat/reja → am going to start. Aniq kelishilgan tadbir → are having dinner." },
    { id: ID4, type: 'transformation', instruction: "Dalilga asoslangan bashoratni 'going to' bilan yozing:", question: "Be careful! You / fall!", hint: "You ...", correct: "You are going to fall!", explanation: "Hozirgi dalil asosida darhol sodir bo'ladigan bashorat → are going to fall." },`,
  },
  {
    id: 'modalsObligation', name: 'Modals of Obligation',
    section: "Obligation (must/have to) + Speculation (must = taxmin) farqi",
    exercises: `    // ── Interleaved Practice: Obligation + Speculation/Advice ──
    { id: ID0, type: 'multiple-choice', instruction: "Must (majburiyat) va must (taxmin):", question: "You _____ wear a helmet — it's the law. He's not answering; he _____ be asleep.", options: ["must / must", "have to / might", "must / should", "should / must"], correct: "must / must", explanation: "Birinchi must = majburiyat (qonun). Ikkinchi must = ishonchli taxmin. Bir so'z, ikki ma'no." },
    { id: ID1, type: 'fill-blank', instruction: "Mustn't (taqiq) va don't have to (majburiy emas):", question: "You _____ smoke here (it is forbidden), but you _____ wear a tie (it is optional).", blanks: ["mustn't", "don't have to"], explanation: "Taqiq → mustn't. Majburiy emas (ixtiyoriy) → don't have to. Ikkisi butunlay farq qiladi." },
    { id: ID2, type: 'error-correction', instruction: "Should (maslahat) vs must (majburiyat):", question: "You must drink more water if you want, it's just my advice.", errorPart: "must", correct: "You should drink more water if you want, it's just my advice.", explanation: "Maslahat → should. Must = kuchli majburiyat, maslahat uchun emas." },
    { id: ID3, type: 'multiple-choice', instruction: "Have to (tashqi majburiyat) va must (ichki/shaxsiy):", question: "I _____ wear a uniform at work (company rule). I really _____ call my mother — I miss her.", options: ["have to / must", "must / have to", "should / must", "have to / should"], correct: "have to / must", explanation: "Tashqi qoidalar → have to. Ichki, shaxsiy his → must." },
    { id: ID4, type: 'transformation', instruction: "Past majburiyatni 'had to' bilan yozing:", question: "It was necessary for me to work late yesterday.", hint: "I ...", correct: "I had to work late yesterday.", explanation: "O'tmishdagi majburiyat → had to (must'ning o'tgan shakli)." },`,
  },
  {
    id: 'bothEitherNeither', name: 'Both / Either / Neither',
    section: "Both/either/neither + Quantifiers (all/none/every) farqi",
    exercises: `    // ── Interleaved Practice: Both/Either/Neither + Quantifiers ──
    { id: ID0, type: 'multiple-choice', instruction: "Neither (ikkitadan hech qaysi) va none (uchdan ko'pdan hech qaysi):", question: "I have two pens, but _____ of them works. There are six chairs, but _____ of them is free.", options: ["neither / none", "none / neither", "either / none", "neither / either"], correct: "neither / none", explanation: "Ikkita → neither of them. Ikkidan ko'p (olti) → none of them." },
    { id: ID1, type: 'fill-blank', instruction: "Both (ikkalasi) va all (hammasi):", question: "_____ of my two brothers are tall. _____ of the students passed the exam (all of them).", blanks: ["Both", "All"], explanation: "Ikkalasi → Both. Hammasi (ko'plik) → All." },
    { id: ID2, type: 'error-correction', instruction: "Either fe'l mosligi:", question: "Either of the answers are correct.", errorPart: "are", correct: "Either of the answers is correct.", explanation: "Either + birlik fe'l → is correct (each one). 'Are' noto'g'ri." },
    { id: ID3, type: 'multiple-choice', instruction: "Neither...nor va either...or:", question: "_____ Tom _____ Sam came (both absent). You can have _____ tea _____ coffee (one choice).", options: ["Neither / nor / either / or", "Either / or / neither / nor", "Neither / or / either / nor", "Both / and / either / or"], correct: "Neither / nor / either / or", explanation: "Ikkalasi ham yo'q → neither...nor. Ikkidan biri → either...or." },
    { id: ID4, type: 'transformation', instruction: "'Not...and not' ni neither...nor bilan qisqartiring:", question: "She doesn't eat meat and she doesn't eat fish.", hint: "She eats ...", correct: "She eats neither meat nor fish.", explanation: "Ikki inkorni birlashtirish → neither meat nor fish." },`,
  },
  {
    id: 'timeClauses', name: 'Time Clauses',
    section: "Time clauses + Tenses (present/future) farqi",
    exercises: `    // ── Interleaved Practice: Time Clauses + Present/Future ──
    { id: ID0, type: 'multiple-choice', instruction: "Time clause'da kelasi zamon ishlatilmaydi:", question: "I will call you when I _____ home. As soon as the rain _____, we will go out.", options: ["get / stops", "will get / will stop", "get / will stop", "will get / stops"], correct: "get / stops", explanation: "When/as soon as'dan keyin Present Simple (get, stops) — 'will' emas, garchi ma'no kelasi bo'lsa ham." },
    { id: ID1, type: 'fill-blank', instruction: "Until (gacha) + Present Simple:", question: "Wait here until I _____ back. I won't leave until the work _____ finished.", blanks: ["come", "is"], explanation: "Until'dan keyin Present Simple (come) / present passive (is finished) — kelasi ma'noда." },
    { id: ID2, type: 'error-correction', instruction: "While + davomli harakat:", question: "While I will cook dinner, you can set the table.", errorPart: "will cook", correct: "While I cook dinner, you can set the table.", explanation: "While'dan keyin kelasida ham Present Simple/Continuous — 'will' emas." },
    { id: ID3, type: 'multiple-choice', instruction: "Before/after time clause + Past:", question: "After she _____ her homework, she went out. Before we _____, we locked the door.", options: ["had finished / left", "finished / had left", "will finish / leave", "finishes / leaves"], correct: "had finished / left", explanation: "Avval tugagan harakat → Past Perfect (had finished), keyin Past Simple (went/left)." },
    { id: ID4, type: 'transformation', instruction: "Ikki gapni 'as soon as' bilan birlashtiring (kelasi):", question: "The bus will arrive. Then we will get on it.", hint: "As soon as the bus ...", correct: "As soon as the bus arrives, we will get on it.", explanation: "As soon as + Present Simple (arrives), asosiy gap will + V1." },`,
  },
  {
    id: 'indirectQuestions', name: 'Indirect Questions',
    section: "Indirect questions + Reported speech / tags farqi",
    exercises: `    // ── Interleaved Practice: Indirect Questions + Reported Speech ──
    { id: ID0, type: 'multiple-choice', instruction: "Direct va indirect question tartibi:", question: "Direct: 'Where does she live?' Indirect: 'Do you know where she _____?' '_____ she live near here?' (direct)", options: ["lives / Does", "does live / Do", "lives / Is", "live / Does"], correct: "lives / Does", explanation: "Indirect: inversiya yo'q → where she lives. Direct: Does + subject + verb." },
    { id: ID1, type: 'fill-blank', instruction: "If/whether bilan indirect yes/no question:", question: "I wonder _____ the shop is open. Could you tell me _____ this bus goes to the centre.", blanks: ["if", "whether"], explanation: "Indirect yes/no question → if yoki whether bilan boshlanadi." },
    { id: ID2, type: 'error-correction', instruction: "Indirect question'da do/does olib tashlanadi:", question: "Can you tell me what time does the train leave?", errorPart: "does the train leave", correct: "Can you tell me what time the train leaves?", explanation: "Indirect: do/does yo'q, 's' qaytadi → what time the train leaves." },
    { id: ID3, type: 'multiple-choice', instruction: "Indirect question vs question tag:", question: "Do you know who _____ this? You don't know the answer, _____?", options: ["wrote / do you", "did write / don't you", "wrote / did you", "did wrote / do you"], correct: "wrote / do you", explanation: "Indirect → who wrote (inversiyasiz). Inkor gap → tasdiq tag (do you)." },
    { id: ID4, type: 'transformation', instruction: "Direct question'ni indirect (polite) qiling:", question: "How much does this cost?", hint: "Could you tell me how much ...", correct: "Could you tell me how much this costs?", explanation: "Indirect: inversiyasiz, 's' qaytadi → how much this costs." },`,
  },
  {
    id: 'soNeitherAuxiliaries', name: 'So / Neither + Auxiliaries',
    section: "So/Neither agreement + Tenses (auxiliary mosligi)",
    exercises: `    // ── Interleaved Practice: So/Neither + Auxiliary agreement ──
    { id: ID0, type: 'multiple-choice', instruction: "So (tasdiq rozilik) va neither (inkor rozilik):", question: "'I like tea.' '_____ I.' 'I can't swim.' '_____ I.'", options: ["So do / Neither can", "So am / Neither do", "Neither do / So can", "So do / So can"], correct: "So do / Neither can", explanation: "Tasdiqqa rozilik → So + auxiliary (do). Inkorga rozilik → Neither + auxiliary (can)." },
    { id: ID1, type: 'fill-blank', instruction: "Auxiliary zamonni mos qiladi:", question: "'I went to Paris.' 'So _____ I.' 'She has finished.' 'So _____ he.'", blanks: ["did", "has"], explanation: "Past Simple (went) → did. Present Perfect (has finished) → has. Auxiliary asl zamonga mos." },
    { id: ID2, type: 'error-correction', instruction: "So/neither dan keyin inversiya:", question: "'I am tired.' 'So I am.'", errorPart: "So I am", correct: "'I am tired.' 'So am I.'", explanation: "Rozilikda inversiya: So + auxiliary + subject → So am I. ('So I am' = boshqa ma'no)." },
    { id: ID3, type: 'multiple-choice', instruction: "Neither (inkor) — auxiliary tanlash:", question: "'I haven't seen it.' '_____ I.' 'They won't come.' '_____ we.'", options: ["Neither have / Neither will", "Neither did / Neither do", "So have / So will", "Neither has / Neither will"], correct: "Neither have / Neither will", explanation: "Present Perfect inkor (haven't) → Neither have. Future inkor (won't) → Neither will." },
    { id: ID4, type: 'transformation', instruction: "Roziligini 'So' bilan qisqa javob qiling:", question: "A: 'I would love to travel more.' B agrees (short answer).", hint: "So ...", correct: "So would I.", explanation: "Would + rozilik → So would I (auxiliary 'would' takrorlanadi)." },`,
  },
]

// nextBase'ni mavjud 95xxx ID'lardan avtomatik aniqlaymiz — takroriy ishlashda kolliziyasiz.
import { readdirSync } from 'fs'
function computeNextBase(): number {
  let max = 95000
  for (const f of readdirSync('src/data/daily')) {
    if (!f.endsWith('.ts')) continue
    const s = readFileSync(`src/data/daily/${f}`, 'utf-8')
    for (const m of s.matchAll(/id:\s*(95\d{3})/g)) max = Math.max(max, Number(m[1]))
  }
  // keyingi o'nlikdan boshlaymiz (har dars 10 ID bloki)
  return Math.floor(max / 10) * 10 + 10 + 1
}
let nextBase = computeNextBase()

function seed(path: string, lessons: Lesson[]) {
  let content = readFileSync(path, 'utf-8')
  for (const lesson of lessons) {
    const marker = `export const ${lesson.id}: DailyLesson`
    const idx = content.indexOf(marker)
    if (idx === -1) { console.log(`❌ ${lesson.id}: topilmadi`); continue }
    // FAQAT shu darsning o'z bloki (keyingi `export const` gacha) — lookahead overlap'siz
    const nextExport = content.indexOf('\nexport const ', idx + marker.length)
    const block = content.substring(idx, nextExport === -1 ? content.length : nextExport)
    if (block.includes('// ── Interleaved Practice:')) { console.log(`⏭️  ${lesson.id}: mavjud`); continue }

    const base = nextBase; nextBase += 10
    let exText = lesson.exercises
    for (let i = 0; i < 5; i++) exText = exText.split(`ID${i}`).join(String(base + i))
    const ids = [base, base + 1, base + 2, base + 3, base + 4]

    // 1) Mashqlarni exercises massivining yopuvchi `]` idan oldin
    const exEnd = block.indexOf('  ],\n  exerciseSections:')
    if (exEnd === -1) { console.log(`❌ ${lesson.id}: exercises massivi topilmadi`); continue }
    const exAt = idx + exEnd
    content = content.substring(0, exAt) + `\n\n${exText}\n` + content.substring(exAt)

    // 2) Aralash section'ni exerciseSections yopuvchi `]` idan oldin
    const nIdx = content.indexOf(marker)
    const b2 = content.substring(nIdx, nIdx + 60000)
    const secOpen = b2.indexOf('exerciseSections:')
    const secClose = b2.indexOf('\n  ],', secOpen)
    if (secClose === -1) { console.log(`❌ ${lesson.id}: section yopilishi topilmadi`); continue }
    const secAt = nIdx + secClose
    const sectionObj = `\n    { title: "🔀 Aralash", desc: "${lesson.section}", color: 'bg-fuchsia-500', icon: '🔄', ids: [${ids.join(', ')}] },`
    content = content.substring(0, secAt) + sectionObj + content.substring(secAt)

    console.log(`✅ ${lesson.name}: 5 mashq (${base}-${base + 4}) + Aralash`)
  }
  writeFileSync(path, content, 'utf-8')
  console.log(`📁 ${path}: tayyor`)
}

seed('src/data/daily/b1Part1.ts', B1)

const A2_P1: Lesson[] = [
  {
    id: 'modalVerbs', name: 'Modal Verbs',
    section: "Modal fe'llar + Present Simple (odat) farqi",
    exercises: `    // ── Interleaved Practice: Modals + Present Simple ──
    { id: ID0, type: 'multiple-choice', instruction: "Can (qobiliyat) va Present Simple (odat):", question: "She _____ swim very well, and she _____ every morning before work.", options: ["can / swims", "cans / swim", "can / swim", "can to / swims"], correct: "can / swims", explanation: "Qobiliyat → can + V1 (swim). Odat → Present Simple, 3-shaxs +s (swims)." },
    { id: ID1, type: 'fill-blank', instruction: "Must (majburiyat) va don't have to:", question: "You _____ wear a seatbelt in the car. You _____ pay — it is free.", blanks: ["must", "don't have to"], explanation: "Majburiyat → must. Majburiy emas → don't have to." },
    { id: ID2, type: 'error-correction', instruction: "Can + V1 (to'g'ri shakl):", question: "I can to play the guitar.", errorPart: "can to play", correct: "I can play the guitar.", explanation: "Modal + V1 (to'siz). 'Can to' noto'g'ri → can play." },
    { id: ID3, type: 'multiple-choice', instruction: "Might (ehtimol) va must (ishonchli taxmin):", question: "It _____ rain later (not sure). He isn't here; he _____ be ill (I'm sure).", options: ["might / must", "must / might", "can / must", "might / can"], correct: "might / must", explanation: "Ehtimol → might. Dalilli ishonchli taxmin → must be." },
    { id: ID4, type: 'transformation', instruction: "Qobiliyatni 'can' bilan ifodalang:", question: "She knows how to drive a car.", hint: "She ...", correct: "She can drive a car.", explanation: "Qobiliyat → can + V1 (can drive)." },`,
  },
  {
    id: 'articles', name: 'Articles',
    section: "Artikllar (a/an/the) + Countable/Uncountable farqi",
    exercises: `    // ── Interleaved Practice: Articles + Countable/Uncountable ──
    { id: ID0, type: 'multiple-choice', instruction: "A/an (birinchi marta) va the (aniq):", question: "I saw _____ cat in the garden. _____ cat was black.", options: ["a / The", "the / A", "an / The", "a / A"], correct: "a / The", explanation: "Birinchi eslatish → a cat. Endi aniq (o'sha) → The cat." },
    { id: ID1, type: 'fill-blank', instruction: "A va an (tovush qoidasi):", question: "She is _____ honest person and _____ university student.", blanks: ["an", "a"], explanation: "Tovush bo'yicha: honest [o] → an. University [yu] → a (undosh tovush)." },
    { id: ID2, type: 'error-correction', instruction: "Umumiy ma'noда the ishlatilmaydi (uncountable):", question: "The water is important for the health.", errorPart: "the health", correct: "The water is important for health.", explanation: "Umumiy tushuncha (health) → artiklsiz. Bu yerda 'the' kerak emas." },
    { id: ID3, type: 'multiple-choice', instruction: "Zero article (umumiy ko'plik) va the:", question: "_____ dogs are loyal animals. _____ dogs in this house are big.", options: ["Zero / The", "The / Zero", "A / The", "The / A"], correct: "Zero / The", explanation: "Umumiy (barcha itlar) → artiklsiz. Aniq (bu uydagi) → The dogs." },
    { id: ID4, type: 'transformation', instruction: "To'g'ri artikl bilan to'ldiring (birinchi eslatish):", question: "I bought ___ apple and ___ orange.", hint: "...", correct: "I bought an apple and an orange.", explanation: "Tovush bilan boshlanadi (apple, orange) → an." },`,
  },
  {
    id: 'prepositions', name: 'Prepositions of Time and Place',
    section: "Predloglar (in/on/at) + Present Simple farqi",
    exercises: `    // ── Interleaved Practice: Prepositions + Present Simple ──
    { id: ID0, type: 'multiple-choice', instruction: "Vaqt predloglari (at/on/in):", question: "We have a meeting _____ Monday _____ 9 o'clock _____ the morning.", options: ["on / at / in", "at / on / in", "in / at / on", "on / in / at"], correct: "on / at / in", explanation: "Kun → on Monday. Soat → at 9. Qism → in the morning." },
    { id: ID1, type: 'fill-blank', instruction: "Joy predloglari (in/on/at):", question: "The keys are _____ the table. She lives _____ Tashkent _____ Navoi Street.", blanks: ["on", "in", "on"], explanation: "Sirt → on the table. Shahar → in Tashkent. Ko'cha → on Navoi Street." },
    { id: ID2, type: 'error-correction', instruction: "At + soat (in emas):", question: "The film starts in 8 o'clock.", errorPart: "in 8 o'clock", correct: "The film starts at 8 o'clock.", explanation: "Aniq soat → at 8 o'clock ('in' oy/yil uchun)." },
    { id: ID3, type: 'multiple-choice', instruction: "Present Simple + predlog (jadval):", question: "The train _____ at 7 and _____ in London at noon.", options: ["leaves / arrives", "leave / arrive", "is leaving / arrives", "leaves / arrive"], correct: "leaves / arrives", explanation: "Jadval → Present Simple 3-shaxs +s (leaves, arrives) + at/in." },
    { id: ID4, type: 'transformation', instruction: "To'g'ri predlog bilan yozing:", question: "My birthday is ___ June, ___ the 12th.", hint: "...", correct: "My birthday is in June, on the 12th.", explanation: "Oy → in June. Sana → on the 12th." },`,
  },
  {
    id: 'questionsLesson', name: 'Questions',
    section: "Savollar (wh/yes-no) + Present/Past farqi",
    exercises: `    // ── Interleaved Practice: Questions + Present/Past ──
    { id: ID0, type: 'multiple-choice', instruction: "Present va Past savol (do/does/did):", question: "_____ she live here now? _____ you call me yesterday?", options: ["Does / Did", "Do / Does", "Did / Do", "Does / Do"], correct: "Does / Did", explanation: "Present 3-shaxs → Does she live. Past → Did you call." },
    { id: ID1, type: 'fill-blank', instruction: "Savol so'zi (wh-) to'ldiring:", question: "_____ do you live? (place) _____ time does it start? (time)", blanks: ["Where", "What"], explanation: "Joy → Where. Vaqt → What time." },
    { id: ID2, type: 'error-correction', instruction: "Savolда so'z tartibi:", question: "Where you are going?", errorPart: "you are", correct: "Where are you going?", explanation: "Savol tartibi: wh- + auxiliary + subject → Where are you going?" },
    { id: ID3, type: 'multiple-choice', instruction: "Yes/no savol — to be va to do:", question: "_____ they happy? _____ they like coffee?", options: ["Are / Do", "Do / Are", "Are / Are", "Do / Do"], correct: "Are / Do", explanation: "Sifat (happy) → Are they. Fe'l (like) → Do they." },
    { id: ID4, type: 'transformation', instruction: "Gapni savolga aylantiring (Past):", question: "She went to the market.", hint: "Where ...", correct: "Where did she go?", explanation: "Past savol → did + subject + V1 (go), 'went' emas." },`,
  },
  {
    id: 'countableUncountable', name: 'Countable and Uncountable',
    section: "Sanaladigan/sanalmaydigan + Artikl/quantifier farqi",
    exercises: `    // ── Interleaved Practice: Countable/Uncountable + Quantifiers ──
    { id: ID0, type: 'multiple-choice', instruction: "Much (uncountable) va many (countable):", question: "How _____ water do we need? How _____ apples are there?", options: ["much / many", "many / much", "much / much", "many / many"], correct: "much / many", explanation: "Uncountable (water) → much. Countable (apples) → many." },
    { id: ID1, type: 'fill-blank', instruction: "Some (tasdiq) va any (inkor/savol):", question: "I need _____ sugar. There isn't _____ milk in the fridge.", blanks: ["some", "any"], explanation: "Tasdiq → some sugar. Inkor → not any milk." },
    { id: ID2, type: 'error-correction', instruction: "Uncountable bilan 'a' ishlatilmaydi:", question: "Can you give me an information?", errorPart: "an information", correct: "Can you give me some information?", explanation: "Information = uncountable → 'an' yo'q. → some information." },
    { id: ID3, type: 'multiple-choice', instruction: "A few (countable) va a little (uncountable):", question: "I have _____ friends here and _____ free time.", options: ["a few / a little", "a little / a few", "a few / a few", "a little / a little"], correct: "a few / a little", explanation: "Countable (friends) → a few. Uncountable (time) → a little." },
    { id: ID4, type: 'transformation', instruction: "Uncountable otni 'a piece of' bilan sanang:", question: "I want to give you advice (make it countable).", hint: "I want to give you a ...", correct: "I want to give you a piece of advice.", explanation: "Uncountable (advice) → a piece of advice bilan sanaladi." },`,
  },
]
seed('src/data/daily/a2Part1.ts', A2_P1)

const A2_P2: Lesson[] = [
  {
    id: 'adjectiveAdverb', name: 'Adjective vs Adverb',
    section: "Sifat/ravish + Comparative farqi",
    exercises: `    // ── Interleaved Practice: Adjective/Adverb + Comparatives ──
    { id: ID0, type: 'multiple-choice', instruction: "Sifat (be bilan) va ravish (fe'l bilan):", question: "She is a _____ driver. She drives very _____.", options: ["careful / carefully", "carefully / careful", "careful / careful", "carefully / carefully"], correct: "careful / carefully", explanation: "Ot oldida sifat → careful driver. Fe'lni tavsiflaydi → drives carefully (ravish)." },
    { id: ID1, type: 'fill-blank', instruction: "Good (sifat) va well (ravish):", question: "He is a _____ student and he speaks English _____.", blanks: ["good", "well"], explanation: "Ot → good student (sifat). Fe'l → speaks well (ravish, 'good'ning ravishi)." },
    { id: ID2, type: 'error-correction', instruction: "Fe'ldan keyin ravish:", question: "She sings beautiful.", errorPart: "beautiful", correct: "She sings beautifully.", explanation: "Fe'lni (sings) tavsiflaydi → ravish: beautifully." },
    { id: ID3, type: 'multiple-choice', instruction: "Comparative (sifat va ravish):", question: "My car is _____ than yours, and it runs _____.", options: ["faster / faster", "more fast / faster", "faster / more fast", "fast / fast"], correct: "faster / faster", explanation: "Qisqa sifat/ravish → +er (faster) ikkala holда." },
    { id: ID4, type: 'transformation', instruction: "Sifatni ravishga aylantiring:", question: "He is a quick worker.", hint: "He works ...", correct: "He works quickly.", explanation: "Sifat (quick) → ravish (quickly) fe'l bilan." },`,
  },
  {
    id: 'gerundsInfinitives', name: 'Gerunds and Infinitives',
    section: "Gerund/infinitiv + Like/want farqi",
    exercises: `    // ── Interleaved Practice: Gerunds/Infinitives + verb patterns ──
    { id: ID0, type: 'multiple-choice', instruction: "Enjoy + V-ing va want + to V:", question: "I enjoy _____ books, but I want _____ a new hobby.", options: ["reading / to start", "to read / starting", "reading / starting", "to read / to start"], correct: "reading / to start", explanation: "Enjoy + V-ing (reading). Want + to V (to start)." },
    { id: ID1, type: 'fill-blank', instruction: "Decide + to V va finish + V-ing:", question: "She decided _____ (study) medicine. He finished _____ (write) the report.", blanks: ["to study", "writing"], explanation: "Decide + to V. Finish + V-ing." },
    { id: ID2, type: 'error-correction', instruction: "Like + V-ing/to V (avoid + V-ing):", question: "I avoid to eat late at night.", errorPart: "to eat", correct: "I avoid eating late at night.", explanation: "Avoid + V-ing (eating), to V emas." },
    { id: ID3, type: 'multiple-choice', instruction: "Preposition + V-ing:", question: "She is good at _____, and she is interested in _____ a language.", options: ["cooking / learning", "to cook / to learn", "cooking / to learn", "cook / learn"], correct: "cooking / learning", explanation: "Predlogdan keyin (at, in) → V-ing (cooking, learning)." },
    { id: ID4, type: 'transformation', instruction: "Want + to V shaklida yozing:", question: "Her plan is a trip to London. (use 'want')", hint: "She wants ...", correct: "She wants to travel to London.", explanation: "Want + to V (to travel)." },`,
  },
  {
    id: 'passiveVoice', name: 'Passive Voice',
    section: "Passive + Active/Tenses farqi",
    exercises: `    // ── Interleaved Practice: Passive + Active/Tenses ──
    { id: ID0, type: 'multiple-choice', instruction: "Active va passive farqi:", question: "Shakespeare _____ Hamlet. Hamlet _____ by Shakespeare.", options: ["wrote / was written", "was written / wrote", "writes / is written", "wrote / wrote"], correct: "wrote / was written", explanation: "Active: Shakespeare wrote. Passive: Hamlet was written by..." },
    { id: ID1, type: 'fill-blank', instruction: "Present va past passive:", question: "Rice _____ (grow) in Asia. This bridge _____ (build) in 1900.", blanks: ["is grown", "was built"], explanation: "Present passive → is grown. Past passive → was built." },
    { id: ID2, type: 'error-correction', instruction: "Passive V3 shakli:", question: "The window was break by the storm.", errorPart: "was break", correct: "The window was broken by the storm.", explanation: "Passive: be + V3 (broken), 'break' emas." },
    { id: ID3, type: 'multiple-choice', instruction: "Qachon passive (agent muhim emas):", question: "My car _____ yesterday. Someone _____ it from the street.", options: ["was stolen / stole", "stole / was stolen", "is stolen / steals", "was stole / stolen"], correct: "was stolen / stole", explanation: "Kim qilgani noma'lum/muhim emas → passive (was stolen). Active: someone stole." },
    { id: ID4, type: 'transformation', instruction: "Active gapni passivega aylantiring:", question: "They clean the office every day.", hint: "The office ...", correct: "The office is cleaned every day.", explanation: "Present passive → is cleaned." },`,
  },
  {
    id: 'reportedSpeech', name: 'Reported Speech',
    section: "Reported speech + Tenses (backshift) farqi",
    exercises: `    // ── Interleaved Practice: Reported Speech + Tense backshift ──
    { id: ID0, type: 'multiple-choice', instruction: "Direct va reported (zamon orqaga):", question: "Direct: 'I am tired.' Reported: He said he _____ tired. Direct: 'I will come.' Reported: She said she _____ come.", options: ["was / would", "is / will", "was / will", "is / would"], correct: "was / would", explanation: "Reported'da zamon orqaga: am → was, will → would." },
    { id: ID1, type: 'fill-blank', instruction: "Reported question (if/that):", question: "She asked _____ I was free. He told me _____ he was busy.", blanks: ["if", "that"], explanation: "Reported yes/no question → if. Reported statement → that." },
    { id: ID2, type: 'error-correction', instruction: "Reported question — inversiya yo'q:", question: "He asked where was I.", errorPart: "where was I", correct: "He asked where I was.", explanation: "Reported question'da inversiya yo'q → where I was." },
    { id: ID3, type: 'multiple-choice', instruction: "Say va tell farqi:", question: "She _____ that she was happy. She _____ me that she was happy.", options: ["said / told", "told / said", "said / said", "told / told"], correct: "said / told", explanation: "Say + that (object yo'q). Tell + object (me) + that." },
    { id: ID4, type: 'transformation', instruction: "Direct gapni reported qiling:", question: "Tom said: 'I live in Tashkent.'", hint: "Tom said that he ...", correct: "Tom said that he lived in Tashkent.", explanation: "Present → past (live → lived), I → he." },`,
  },
  {
    id: 'firstConditional', name: 'First Conditional',
    section: "First conditional + Time clauses / future farqi",
    exercises: `    // ── Interleaved Practice: First Conditional + Future/Time clauses ──
    { id: ID0, type: 'multiple-choice', instruction: "If + present, will + V1:", question: "If it _____ tomorrow, we _____ at home.", options: ["rains / will stay", "will rain / stay", "rains / stay", "will rain / will stay"], correct: "rains / will stay", explanation: "First conditional: if + Present Simple (rains), asosiy gap will + V1 (will stay)." },
    { id: ID1, type: 'fill-blank', instruction: "When (time clause) va if (shart):", question: "I will call you when I _____ home. I will help if you _____ me.", blanks: ["get", "ask"], explanation: "When/if dan keyin Present Simple (get, ask) — 'will' emas." },
    { id: ID2, type: 'error-correction', instruction: "If qismida 'will' ishlatilmaydi:", question: "If you will study hard, you will pass.", errorPart: "will study", correct: "If you study hard, you will pass.", explanation: "If qismida Present Simple (study). 'Will' faqat asosiy gapда." },
    { id: ID3, type: 'multiple-choice', instruction: "Unless (agar ...masa):", question: "You will be late _____ you hurry. _____ it stops raining, we will stay in.", options: ["unless / Unless", "if / If", "unless / If", "if / Unless"], correct: "unless / Unless", explanation: "Unless = if...not (agar shoshilmasangiz). Unless it stops = agar to'xtamasa." },
    { id: ID4, type: 'transformation', instruction: "Ikki gapni first conditional bilan birlashtiring:", question: "Maybe you will be tired. Then you should rest.", hint: "If you ...", correct: "If you are tired, you should rest.", explanation: "If + Present Simple (are tired), asosiy gap (should rest)." },`,
  },
]
seed('src/data/daily/a2Part2.ts', A2_P2)
