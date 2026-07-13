import { openaiStreamResponse } from './openaiClient'

// ── Types ─────────────────────────────────────────────────────────────────────

interface DayContent {
  day: number
  title: string
  level: string
  vocabulary: { word: string; meaning: string; example: string; translation?: string }[]
  sentenceBank: { categories: { category: string; phrases: { en: string; uz: string }[] }[] }
  learningObjectives: string[]
  speaking: { prompt: string; tips: string[] }
  highlights: { title: string; points?: string[] }[]
}

// ── 30-Day Challenge Conversation ──────────────────────────────────────────

export async function startDayConversation(
  dayContent: DayContent,
  history: { role: 'user' | 'assistant'; content: string }[],
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void,
  userFacts?: string
): Promise<void> {
  const { day, title, level, vocabulary, sentenceBank, learningObjectives, speaking, highlights } = dayContent

  const factsBlock = userFacts
    ? `
ABOUT THE STUDENT — Personal facts to make the conversation natural. Reference these naturally, but don't mention them all at once:
${userFacts}

If the student says something new about themselves, remember it for future conversations.`
    : ''

  const vocabLines = vocabulary
    .slice(0, 12)
    .map((v, i) => `  ${i + 1}. "${v.word}" — ${v.meaning} — e.g. "${v.example}"`)
    .join('\n')
  const vocabBlock = vocabulary.length > 0
    ? `
TODAY'S VOCABULARY — Naturally weave these words into your replies:
${vocabLines}

If the student uses any of these words, acknowledge it positively.`
    : ''

  const keySentences = sentenceBank.categories
    .slice(0, 4)
    .map(c => `  [${c.category}] "${c.phrases.slice(0, 3).map(p => p.en).join('" / "')}"`)
    .join('\n')
  const sentenceBlock = sentenceBank.categories.length > 0
    ? `
KEY SENTENCE STRUCTURES — Model these naturally in your side of the conversation:
${keySentences}`
    : ''

  const objectivesBlock = learningObjectives.length > 0
    ? `
LEARNING OBJECTIVES — Steer the conversation to help practise these:
${learningObjectives.map((o, i) => `  ${i + 1}. ${o}`).join('\n')}`
    : ''

  const speakingBlock = speaking?.prompt
    ? `
SPEAKING PRACTICE CONTEXT — The student practised answering:
  "${speaking.prompt}"
  Tips they received: ${speaking.tips?.slice(0, 3).map(t => `"${t}"`).join(', ') || 'none'}

  Ask them about their experience with this topic.`
    : ''

  const highlightScenarios = highlights
    ?.slice(0, 3)
    .map(h => `  • ${h.title}: ${h.points?.slice(0, 2).join('; ') || ''}`)
    .join('\n') || ''
  const highlightsBlock = highlightScenarios
    ? `
SCENARIOS COVERED IN THE LESSON — You can role-play or reference these:
${highlightScenarios}`
    : ''

  const system = `You are a friendly English conversation partner for a ${level}-level learner who just completed Day ${day} of a 30-Day Speaking Challenge.

TODAY'S TOPIC: ${title}${factsBlock}${vocabBlock}${sentenceBlock}${objectivesBlock}${speakingBlock}${highlightsBlock}

CONVERSATION RULES:
1. Speak conversationally — like a friend, NOT a teacher or examiner.
2. Keep responses SHORT: 2-4 sentences max.
3. Use ${level}-level English. If you need a harder word, define it immediately.
4. NATURALLY INCORPORATE today's vocabulary words into your side of the conversation.
5. If the student uses any of today's vocabulary, react warmly ("Great word!" / "Exactly!").
6. End each turn with a natural follow-up question to keep the conversation flowing.
7. Do NOT give scores, corrections, or grammar lessons during the conversation.
8. If the student hesitates or makes a mistake, just respond naturally — never correct them.
9. When relevant, draw from the scenarios (e.g. restaurant role-play, directions, meeting a friend).
10. Use the student's personal facts to make conversation more natural — ask follow-up questions about their interests, studies, or experiences.`

  const messages = history.length === 0
    ? [{ role: 'user' as const, content: `The student just finished Day ${day}: "${title}". Start a friendly conversation about today's topic. Greet them warmly and ask a natural question to get them speaking about what they learned today.` }]
    : history

  return openaiStreamResponse({ system, messages, maxTokens: 350 }, onDelta, onDone, onError)
}

// ── Vocabulary Practice Game ──────────────────────────────────────────────

export async function startVocabPractice(
  word: { word: string; meaning: string; example: string; translation?: string },
  history: { role: 'user' | 'assistant'; content: string }[],
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void,
): Promise<void> {
  const system = `Siz ingliz tili o'qituvchisisiz. O'quvchi bilan lug'at o'yini o'ynayapsiz.

O'YIN QOIDALARI:
1. O'quvchiga quyidagi so'zni o'rgatishingiz kerak: "${word.word}" (ma'nosi: ${word.meaning})
2. Avval o'zbekcha gap tuzib bering — bu gapda "${word.word}" so'zi ishlatilgan bo'lsin.
3. O'quvchi shu gapni ingliz tiliga tarjima qiladi.
4. TEKSHIRISH:
   - AGAR TO'G'RI BO'LSA: maqtang va "Endi o'zingiz "${word.word}" so'zini ishlatib yangi gap tuzib ko'ring" deb so'rang.
   - AGAR XATO BO'LSA: o'zbekcha tushuntiring, nima xato ekanini ayting va qayta urinib ko'rishni so'rang.
5. O'quvchi o'z gapini tuzganda:
   - TO'G'RI BO'LSA: maqtang va keyingi bosqichga o'ting
   - XATO BO'LSA: to'g'rilab, o'zbekcha izoh bering va qayta urinishni so'rang

MUHIM:
- Har doim o'zbekcha gap bering va o'zbekcha izoh bering
- O'quvchining inglizcha javobini tekshirganda, to'liq tahlil qiling: grammatika, so'z tanlash, so'z tartibi
- Xato bo'lsa, to'g'ri variantni ko'rsating va nima uchun xato ekanini o'zbekcha tushuntiring
- Rag'batlantirib turing, lekin xatoni ham aniq ko'rsating
- Javoblaringiz qisqa va tushunarli bo'lsin

NAMUNA:
AI: Keling "${word.word}" so'zini o'rganamiz. Men o'zbekcha gap aytaman, siz ingliz tiliga tarjima qiling.
AI: Men har kuni ingliz tilini "${word.word}" qilaman.
(O'quvchi javobini kutish)
AI: "I practice English every day." — Ajoyib! To'g'ri tarjima. Endi o'zingiz "${word.word}" so'zini ishlatib yangi gap tuzib ko'ring.`

  const messages = history.length === 0
    ? [{ role: 'user' as const, content: 'O\'yinni boshlaylik. Menga o\'zbekcha gap bering, men ingliz tiliga tarjima qilaman.' }]
    : history

  return openaiStreamResponse({ system, messages, maxTokens: 300 }, onDelta, onDone, onError)
}

// ── 30-Day Challenge Role-Play ───────────────────────────────────────────

export async function startDayRoleplay(
  scenario: {
    title: string
    aiRole: string
    userRole: string
    opening: string
  },
  level: string,
  dayTitle: string,
  vocabulary: { word: string; meaning: string; example: string }[],
  history: { role: 'user' | 'assistant'; content: string }[],
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void
): Promise<void> {
  const vocabLines = vocabulary
    .slice(0, 6)
    .map((v, i) => `  ${i + 1}. "${v.word}" — ${v.meaning}`)
    .join('\n')
  const vocabBlock = vocabulary.length > 0
    ? `\nTODAY'S VOCABULARY — Naturally weave these words into the role-play where relevant:\n${vocabLines}`
    : ''

  const system = `You are role-playing as ${scenario.aiRole}. The user is ${scenario.userRole}.

SCENARIO: ${scenario.title}

LESSON CONTEXT: This role-play is part of Day of "${dayTitle}" in a 30-Day English Speaking Challenge.${vocabBlock}

RULES:
1. STAY in character at all times — you ARE ${scenario.aiRole}, NOT an AI assistant or teacher.
2. Speak natural, real-world English at ${level} level. Keep sentences short and simple.
3. Keep each reply VERY SHORT: 1-3 sentences. React naturally to what the user says.
4. Gently move the scene forward toward a natural conclusion.
5. NEVER correct the student's grammar or break character.
6. If the user makes a mistake but you understand, just respond naturally.
7. When the task is clearly complete, give a warm closing line.`

  const messages = history.length === 0
    ? [
        { role: 'assistant' as const, content: scenario.opening },
        { role: 'user' as const, content: '(Begin)' },
      ]
    : history

  return openaiStreamResponse({ system, messages, maxTokens: 250 }, onDelta, onDone, onError)
}

// ── Role-Play Game ───────────────────────────────────────────────────────

export async function startRoleplayGame(
  scenario: {
    title: string
    aiRole: string
    userRole: string
  },
  phase: 1 | 2,
  history: { role: 'user' | 'assistant'; content: string }[],
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void
): Promise<void> {
  const system = phase === 1
    ? `Siz ingliz tili o'qituvchisisiz. O'quvchi bilan rolli o'yin o'ynayapsiz.

SCENARIO: ${scenario.title}

Sizning rolingiz: ${scenario.aiRole}
O'quvchining roli: ${scenario.userRole}

1-BOSQICH — SAVOL BERUVCHI SIZ:
- Siz ${scenario.aiRole} sifatida savol bering (ingliz tilida)
- O'quvchi ${scenario.userRole} sifatida ingliz tilida javob beradi
- Har bir savoldan keyin o'quvchining javobini tekshiring

TEKSHIRISH QOIDALARI:
- AGAR TO'G'RI BO'LSA: "✅ To'g'ri!" deb maqtang va keyingi savolga o'ting
- AGAR XATO BO'LSA: o'zbekcha tushuntiring, nima xato ekanini ayting va "Qayta urinib ko'ring" deb so'rang
- O'quvchi to'g'ri javob bermaguncha savolni takrorlang
- Hammasi to'g'ri bo'lgach: "Mubarak! Barcha savollarga to'g'ri javob berdingiz!" deb aytib, keyingi bosqichga o'ting

MUHIM: Javoblaringiz qisqa va tushunarli bo'lsin. Savollarni birma-bir bering.`
    : `Siz ingliz tili o'qituvchisisiz. O'quvchi bilan rolli o'yin o'ynaysiz.

SCENARIO: ${scenario.title}

2-BOSQICH — SAVOL BERUVCHI O'QUVCHI:
- Endi o'quvchi ${scenario.aiRole} rolida savol beradi
- Siz ${scenario.userRole} rolida tabiiy javob qaytarasiz
- O'quvchining har bir savoliga qisqa va tabiiy javob bering
- Grammatikasini TO'G'IRLAMANG — tabiiy suhbatdosh sifatida javob qaytaring
- Suhbat tabiiy yakunlanganda: "🎉 Ajoyib! Siz a'lo darajada savol berdingiz!" deb yakunlang`

  const messages = history.length === 0
    ? [{ role: 'user' as const, content: 'O\'yinni boshlaylik. Menga vaziyatga mos savol bering.' }]
    : history

  return openaiStreamResponse({ system, messages, maxTokens: 350 }, onDelta, onDone, onError)
}

// ── Conversation Feedback ────────────────────────────────────────────────

export async function generateConversationFeedback(
  userMessages: string[],
  level: string,
  dayTitle: string,
  vocabulary: { word: string; meaning: string }[],
  learningObjectives: string[],
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void
): Promise<void> {
  const vocabWords = vocabulary.map(v => v.word).join(', ')

  const transcript = userMessages
    .map((m, i) => `[Student ${i + 1}] ${m}`)
    .join('\n')

  const system = `You are an encouraging English speaking coach evaluating a ${level}-level student's conversation.

The student just finished a conversation as part of "${dayTitle}" in their 30-Day Speaking Challenge.

Today's vocabulary words: ${vocabWords}
Today's learning objectives: ${learningObjectives.join('; ')}

Respond ONLY in this exact format — no other text before or after:

GRAMMAR: [1-9]
[One sentence about grammatical accuracy observed in the conversation. Be specific — mention what they did correctly or what tense/structure they used well.]

VOCABULARY: [1-9]
[One sentence about vocabulary range. Mention if they used any of today's words naturally.]

FLUENCY: [1-9]
[One sentence about how naturally the student expressed themselves — sentence length, hesitation, flow.]

STRENGTHS:
• [Strong point 1 — specific example from their messages]
• [Strong point 2 — specific example from their messages]
• [Strong point 3 — specific example if applicable]

IMPROVE:
• [One actionable suggestion — what to focus on next and why]
• [One specific practice tip related to today's topic]

OVERALL_BAND: [1-9]

OVERALL_BAND_DESC: [One sentence summary of overall performance]

FEEDBACK:
[3-4 sentences in a warm, encouraging tone: highlight one key strength, one critical weakness, and the single most impactful change the student can make to raise their band by 0.5-1.0]

IMPROVED:
[Rewrite the student's conversation at a band 7+ level — keep all original ideas and arguments intact, but improve expression, structure, and vocabulary. Show only the improved conversation text, no extra commentary.]`

  const messages = [{ role: 'user' as const, content: transcript }]

  return openaiStreamResponse({ system, messages, maxTokens: 1500 }, onDelta, onDone, onError)
}