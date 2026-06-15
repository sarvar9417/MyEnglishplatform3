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
]

let nextBase = 95001

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
