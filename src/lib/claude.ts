import { buildSystemPrompt, type TutorMode } from './prompts'
import { monitoring } from './monitoring'
import { AppError, ERROR_CODES, USER_MESSAGES } from './errors'
import { withCachedStream } from './aiCache'

const PROXY_URL = '/api/claude'
const MODEL = (import.meta.env.VITE_CLAUDE_MODEL as string | undefined) ?? 'claude-sonnet-4-5'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

async function proxyFetch(body: Record<string, unknown>): Promise<Response> {
  let res: Response
  try {
    res = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    })
  } catch {
    // Tarmoq uzilishi — internet yo'q
    throw new AppError(ERROR_CODES.NETWORK_ERROR, USER_MESSAGES.NETWORK_ERROR, 'error')
  }
  if (!res.ok) {
    // AI proxy/server xatosi
    throw new AppError(ERROR_CODES.AI_UNAVAILABLE, USER_MESSAGES.AI_UNAVAILABLE, 'error')
  }
  return res
}

export async function sendMessage(
  messages: ChatMessage[],
  mode: TutorMode = 'general'
): Promise<string> {
  const res = await proxyFetch({
    model: MODEL,
    max_tokens: 1024,
    system: buildSystemPrompt(mode),
    messages: messages.map((m) => ({ role: m.role, content: m.content })),
    stream: false,
  })
  const data = await res.json()
  const block = data.content?.[0]
  return block?.type === 'text' ? block.text : ''
}

async function streamResponse(
  params: { system: string; messages: { role: string; content: string }[]; maxTokens: number },
  onDelta: (token: string) => void,
  onDone: (full: string) => void,
  onError: (err: Error) => void
): Promise<void> {
  try {
    const res = await fetch(PROXY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        model: MODEL,
        max_tokens: params.maxTokens,
        system: params.system,
        messages: params.messages,
        stream: true,
      }),
    })

    if (!res.ok) {
      throw new AppError(ERROR_CODES.AI_UNAVAILABLE, USER_MESSAGES.AI_UNAVAILABLE, 'error')
    }

    let full = ''
    const reader = res.body?.getReader()
    if (!reader) { onDone(''); return }

    const decoder = new TextDecoder()
    let buffer = ''

    while (true) {
      const { done, value } = await reader.read()
      if (done) break

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() || ''

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const data = line.slice(6).trim()
        if (!data || data === '[DONE]') continue
        try {
          const parsed = JSON.parse(data)
          if (parsed.type === 'content_block_delta' && parsed.delta?.type === 'text_delta') {
            full += parsed.delta.text
            onDelta(parsed.delta.text)
          }
        } catch (err) {
          monitoring.captureException(err instanceof Error ? err : new Error(String(err)), { context: 'streamResponse:parseLine' })
        }
      }
    }

    onDone(full)
  } catch (err) {
    onError(err as Error)
  }
}

export async function sendMessageStream(
  messages: ChatMessage[],
  mode: TutorMode = 'general',
  onDelta: (token: string) => void,
  onDone: (fullText: string) => void,
  onError: (err: Error) => void
): Promise<void> {
  return streamResponse(
    { system: buildSystemPrompt(mode), messages: messages.map((m) => ({ role: m.role, content: m.content })), maxTokens: 1024 },
    onDelta, onDone, onError
  )
}

export async function checkGrammar(text: string): Promise<string> {
  return sendMessage(
    [{ role: 'user', content: `Please check my grammar:\n\n${text}` }],
    'grammar-check'
  )
}

export async function getWritingFeedback(essay: string): Promise<string> {
  return sendMessage(
    [{ role: 'user', content: `Please give detailed feedback on my writing:\n\n${essay}` }],
    'writing-feedback'
  )
}

export async function explainWord(word: string): Promise<string> {
  return sendMessage(
    [{ role: 'user', content: `Explain the word: "${word}"` }],
    'vocabulary'
  )
}

export interface GrammarResult {
  qNum: number
  type: string
  question: string
  userAnswer: string
  correct: string
  isCorrect: boolean
}

export async function getGrammarFeedback(
  topicTitle: string,
  level: string,
  results: GrammarResult[],
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void
): Promise<void> {
  const wrong = results.filter((r) => !r.isCorrect)
  const score = results.filter((r) => r.isCorrect).length

  const lines = results.map((r) => {
    const mark = r.isCorrect ? '✅' : '❌'
    if (r.isCorrect) return `Q${r.qNum} [${r.type}] ${mark} Correct`
    return `Q${r.qNum} [${r.type}] ${mark} WRONG
  Question : ${r.question}
  Student  : ${r.userAnswer || '(blank)'}
  Correct  : ${r.correct}`
  }).join('\n\n')

  const system = `You are an expert English grammar teacher. \
Your student is at ${level} level (Uzbek speaker). \
Be warm, encouraging, and concise. Use simple B1-level English.`

  const prompt = `My student just completed a "${topicTitle}" exercise. Score: ${score}/${results.length}.

${lines}

Please provide:
${wrong.length === 0
  ? '✨ All answers were correct! Write a short congratulation (2-3 sentences) and one advanced tip about this grammar point.'
  : `For each ❌ WRONG answer:
  - Quote the student's answer
  - Explain the error in 1-2 simple sentences
  - Give the rule / memory tip

Then add a 2-sentence summary of the main weakness and one practice suggestion.`}

Keep the total response under 300 words. Use emojis sparingly (📌 for rules, 💡 for tips).`

  return streamResponse({ system, messages: [{ role: 'user', content: prompt }], maxTokens: 700 }, onDelta, onDone, onError)
}

export async function generateReadingQuestions(
  text: string,
  level: string,
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void
): Promise<void> {
  const system = `You are an English teacher creating reading comprehension questions for ${level}-level students.
Write clear, unambiguous multiple-choice questions that test genuine understanding of the text.`

  const prompt = `Based on the following text, create exactly 5 new multiple-choice comprehension questions.

Format each question as:
Q1. [question]
A) [option]
B) [option]
C) [option]
D) [option]
✓ Answer: [letter]

Text:
${text}`

  return streamResponse({ system, messages: [{ role: 'user', content: prompt }], maxTokens: 700 }, onDelta, onDone, onError)
}

export async function evaluateWriting(
  prompt: string,
  essay: string,
  level: string,
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void
): Promise<void> {
  const system = `You are an encouraging English writing tutor evaluating a ${level}-level student's essay.
Use IELTS-style criteria. Be constructive and specific.

Respond ONLY in this exact format:

TASK_ACHIEVEMENT: [1-10]
[One sentence about how well the prompt was addressed]

COHERENCE: [1-10]
[One sentence about organisation, paragraphing, and linking]

VOCABULARY: [1-10]
[One sentence about range and accuracy of vocabulary]

GRAMMAR: [1-10]
[One sentence about grammatical accuracy and range]

FEEDBACK:
[2–3 sentences: highlight one genuine strength, give the single most important improvement tip]

IMPROVED:
[Rewrite the student's essay with improved language, structure, and vocabulary — keep their ideas intact. Match the same approximate length.]`

  const userPrompt = `Writing prompt: "${prompt}"

Student's essay:
"${essay}"`

  return streamResponse({ system, messages: [{ role: 'user', content: userPrompt }], maxTokens: 1200 }, onDelta, onDone, onError)
}

export async function evaluateSpeech(
  prompt: string,
  transcript: string,
  level: string,
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void,
  acoustic?: { speechRate: number; pauseCount: number; avgPauseDuration: number; totalPauseRatio: number; pitchMean: number; pitchStddev: number }
): Promise<void> {
  const system = `You are an experienced English speaking coach evaluating a ${level}-level student.
Respond ONLY in this exact format — no other text before or after:

FLUENCY: [1-10]
[One sentence about fluency — pace, hesitation, flow]

GRAMMAR: [1-10]
[One sentence about grammatical accuracy]

VOCABULARY: [1-10]
[One sentence about range and appropriateness of vocabulary]

FEEDBACK:
[2–3 encouraging sentences: highlight one strength, give one specific improvement tip]

IMPORTANT - Use these ACTUAL acoustic measurements from the recording for the FLUENCY score:
- Speech rate: measured words per minute directly from audio
- Pauses: count and duration detected in the audio signal
- Pitch variation: indicates intonation (monotone speech → lower fluency)`

  let userPrompt = `Speaking prompt: "${prompt}"

Student's spoken response: "${transcript || '(no speech detected)'}"`

  if (acoustic) {
    userPrompt += `\n\nAcoustic measurements from audio:
- Speech rate: ${acoustic.speechRate} words/min
- Pauses detected: ${acoustic.pauseCount} (avg ${acoustic.avgPauseDuration}ms, ${acoustic.totalPauseRatio}% of speaking time)
- Mean pitch: ${acoustic.pitchMean}Hz (variation: ±${acoustic.pitchStddev}Hz)

Use these measurements to inform your FLUENCY score. Fast speech with few pauses = higher fluency.`
  }

  return streamResponse({ system, messages: [{ role: 'user', content: userPrompt }], maxTokens: 350 }, onDelta, onDone, onError)
}

export async function generateExamples(
  word: string,
  level: string,
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void
): Promise<void> {
  const system = `You are a concise English vocabulary teacher. \
Create clear, natural example sentences for ${level}-level learners.`

  const prompt = `Write exactly 3 example sentences using the word "${word}".
Each sentence must be natural, at ${level} level, and show a different context.
Format:
1. [sentence]
2. [sentence]
3. [sentence]
Only the numbered sentences, nothing else.`

  return streamResponse({ system, messages: [{ role: 'user', content: prompt }], maxTokens: 250 }, onDelta, onDone, onError)
}

export interface WordCard {
  translation: string
  phonetic:    string
  example:     string
}

export async function generateWordCard(word: string, level: string): Promise<WordCard> {
  const system = `You are a concise English–Uzbek dictionary assistant for ${level}-level learners.
Respond ONLY in this exact format — nothing else:
TRANSLATION: [Uzbek translation, 3-6 words max]
PHONETIC: [IPA pronunciation, e.g. /əˈbʌndənt/]
EXAMPLE: [One natural ${level}-level English sentence using the word]`

  const res = await proxyFetch({
    model: MODEL,
    max_tokens: 120,
    system,
    messages: [{ role: 'user', content: `Word: "${word}"` }],
    stream: false,
  })

  const data = await res.json()
  const text = data.content?.[0]?.type === 'text' ? data.content[0].text : ''
  const get  = (key: string) =>
    text.match(new RegExp(`${key}:\\s*(.+)`))?.[1]?.trim() ?? ''

  return {
    translation: get('TRANSLATION'),
    phonetic:    get('PHONETIC'),
    example:     get('EXAMPLE'),
  }
}

export async function checkVocabAnswer(
  uzbek: string,
  correctEnglish: string,
  userAnswer: string
): Promise<boolean> {
  const res = await proxyFetch({
    model: MODEL,
    max_tokens: 5,
    system: 'You are a strict vocabulary checker. Reply ONLY with CORRECT or WRONG.',
    messages: [{
      role: 'user',
      content: `Uzbek word: "${uzbek}" | Expected English: "${correctEnglish}" | Student wrote: "${userAnswer}"\nIs the student's answer a valid English translation of this Uzbek word? Consider synonyms and alternate forms. Reply ONLY: CORRECT or WRONG`,
    }],
    stream: false,
  })

  const data = await res.json()
  const text = data.content?.[0]?.type === 'text'
    ? data.content[0].text.trim().toUpperCase()
    : 'WRONG'
  return text.startsWith('CORRECT')
}

/**
 * Checks if a student's English translation of an Uzbek sentence is semantically correct.
 * Used as fallback when exact database match fails — the student may have written
 * a valid alternative translation that differs from the stored one.
 */
export async function checkPhraseTranslation(
  uzbek: string,
  correctEnglish: string,
  userAnswer: string
): Promise<boolean> {
  const res = await proxyFetch({
    model: MODEL,
    max_tokens: 5,
    system: 'You are a strict sentence translation checker. Reply ONLY with CORRECT or WRONG.',
    messages: [{
      role: 'user',
      content: `Uzbek sentence: "${uzbek}" | Expected English: "${correctEnglish}" | Student wrote: "${userAnswer}"\nIs the student's English translation semantically correct for this Uzbek sentence? Consider alternative valid translations, synonyms, and different phrasing — as long as the core meaning is preserved, accept it. Reply ONLY: CORRECT or WRONG`,
    }],
    stream: false,
  })

  const data = await res.json()
  const text = data.content?.[0]?.type === 'text'
    ? data.content[0].text.trim().toUpperCase()
    : 'WRONG'
  return text.startsWith('CORRECT')
}

const LEVEL_SENTENCE_GUIDE: Record<string, string> = {
  A1: '5-7 so\'zli, juda oddiy, hozirgi zamon',
  A2: '7-10 so\'zli, kundalik hayot mavzusi',
  B1: '10-14 so\'zli, biroz murakkabroq, birikmali',
  B2: '12-16 so\'zli, murakkab, qo\'shma gap mumkin',
}

export async function generateUzbekSentence(
  englishWord: string,
  uzbekWord: string,
  level: string
): Promise<string> {
  const guide = LEVEL_SENTENCE_GUIDE[level] ?? '8-12 so\'zli'

  const res = await proxyFetch({
    model: MODEL,
    max_tokens: 120,
    system: `You are an Uzbek sentence composer. Your only job is to compose complete, natural Uzbek sentences. You never give instructions — you only write the sentence itself.`,
    messages: [{
      role: 'user',
      content: `Compose one complete Uzbek sentence at ${level} level (${guide}) that naturally includes the Uzbek word "${uzbekWord}" (which means "${englishWord}" in English). Reply with only the Uzbek sentence — no explanations, no quotes, no labels.`,
    }],
    stream: false,
  })

  const data = await res.json()
  const raw = data.content?.[0]?.type === 'text' ? data.content[0].text.trim() : ''
  const text = raw.replace(/^["'«»\d.\-–\s]+/, '').replace(/["'»]+$/, '').trim()
  return text || `U kecha ko'p pul ${uzbekWord}.`
}

export interface SentenceCheckResult {
  correct: boolean
  explanation: string
  correctAnswer: string
}

export async function checkSentenceTranslation(
  uzbekSentence: string,
  targetWord: string,
  userTranslation: string,
  level: string
): Promise<SentenceCheckResult> {
  const res = await proxyFetch({
    model: MODEL,
    max_tokens: 350,
    system: `Siz ${level} darajasidagi ingliz tili o'qituvchisisiz. O'quvchi o'zbekcha gapni ingliz tiliga tarjima qilgan.

Tekshirish QOIDALARI (uchala shart bajarilsa — to'g'ri):
1. O'quvchi gapida "${targetWord}" so'zi yoki uning grammatik shakli (ed, ing, s, er va h.k.) bo'lishi kerak.
2. Tarjima o'zbekcha gap ma'nosiga mos bo'lishi kerak.
3. Grammatika ${level} darajasiga mos qabul qilinadi (kichik xatolar ok).

JAVOB FORMATI — faqat quyidagi 3 qatorni yoz, boshqa hech narsa yozma:
CORRECT: yes
yoki:
CORRECT: no
EXPLANATION: [o'zbekcha — nima noto'g'ri, qisqa va aniq]
CORRECT_ANSWER: [to'g'ri inglizcha tarjima]`,
    messages: [{
      role: 'user',
      content: `O'zbekcha gap: "${uzbekSentence}"
Kerakli ingliz so'zi: "${targetWord}"
O'quvchi yozdi: "${userTranslation}"`,
    }],
    stream: false,
  })

  const data = await res.json()
  const text = data.content?.[0]?.type === 'text' ? data.content[0].text.trim() : ''

  const getBlock = (key: string, nextKey?: string): string => {
    const pattern = nextKey
      ? new RegExp(`^${key}:\\s*(.+?)(?=\\n${nextKey}:|$)`, 'ms')
      : new RegExp(`^${key}:\\s*(.+)`, 'm')
    const match = text.match(pattern)
    return match ? match[1].trim() : ''
  }

  const correctRaw = getBlock('CORRECT', 'EXPLANATION').toLowerCase()
  const correct = correctRaw.startsWith('yes') || correctRaw === 'ha'
  const explanation = correct ? '' : getBlock('EXPLANATION', 'CORRECT_ANSWER')
  const correctAnswer = correct ? '' : getBlock('CORRECT_ANSWER')

  return { correct, explanation, correctAnswer }
}

export async function analyzeGrammar(
  uzbekSentence: string,
  userTranslation: string,
  level: string,
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void
): Promise<void> {
  const system = `Siz ${level} darajasidagi ingliz tili grammatikasi ekspertisiz. O'quvchi o'zbekcha gapni ingliz tiliga tarjima qilgan. Siz uning tarjimasini CHUQUR grammatik tahlil qilasiz. BARCHA javoblar O'ZBEKCHA bo'lishi shart.

Quyidagi FORMAT bo'yicha yozing (har bir bo'lim uchun aniq belgilardan foydalaning):

📌 ZAMON
→ Ishlatilgan zamon: [zamon nomi]
→ Formula: [S + V + ... ko'rinishida]
→ Nima uchun: [bu gapda nima uchun aynan shu zamon ishlatilganini tushuntir]
→ Boshqa zamon ishlatilsa: [boshqa zamon ishlatilganda ma'no qanday o'zgarardi]

📌 ARTIKL
[Gapda har bir artikl uchun alohida qator:]
→ "[so'z]" oldidagi artikl: [qaysi artikl: a/an/the/zero] — [nima uchun aynan shu artikl, qoidasi]
[Agar artikl yo'q bo'lsa: → Bu gapda artikl ishlatilmagan — [sababi]]

📌 BOG'LOVCHILAR VA ALOQA SO'ZLARI
[Gapda ishlatilgan har bir bog'lovchi uchun:]
→ "[bog'lovchi]" — [nima bilan nima ni bog'layapti, qanday ma'no beradi]
[Agar yo'q bo'lsa: → Bu oddiy gap — bog'lovchi ishlatilmagan]

📌 SO'Z TARTIBI VA TUZILISH
→ Gapning tuzilishi: [Subject] + [Predicate] + [boshqa qismlar]
→ Asosiy qismlar: [har bir qismni tahlil qil]
→ [so'z tartibiga oid muhim qoida]

📌 XATOLAR VA TAVSIYALAR
[Agar xato yo'q bo'lsa: → ✅ Grammatik jihatdan to'g'ri yozilgan]
[Agar xato bo'lsa, har bir xato uchun:]
→ ❌ Xato: "[xato qism]"
   ✅ To'g'ri shakl: "[to'g'ri shakl]"
   📖 Sababi: [nima uchun xato, qaysi qoida buzilgan]

📌 UMUMIY BAHO
[2-3 jumla: tarjima sifati, o'quvchiga foydali maslahat, kuchli va zaif tomonlari]`

  const userPrompt = `O'zbekcha gap: "${uzbekSentence}"
O'quvchi yozgan inglizcha tarjima: "${userTranslation}"
Daraja: ${level}

Iltimos, o'quvchining tarjimasini yuqoridagi format bo'yicha chuqur grammatik tahlil qiling.`

  return streamResponse({ system, messages: [{ role: 'user', content: userPrompt }], maxTokens: 900 }, onDelta, onDone, onError)
}

/** Start a speaking chat conversation — Claude responds conversationally */
export async function startSpeakingChat(
  topic: string,
  level: string,
  history: { role: 'user' | 'assistant'; content: string }[],
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void
): Promise<void> {
  const system = `You are a friendly English conversation partner for a ${level}-level learner.

RULES:
1. Respond conversationally — like a friend, NOT a teacher.
2. Keep responses SHORT: 2-4 sentences max.
3. Use ${level}-level English. Define any harder word immediately.
4. End each turn with a natural follow-up question.
5. Do NOT give scores or evaluations during conversation.
6. Topic: ${topic}`

  const messages = history.length === 0
    ? [{ role: 'user' as const, content: `Let's talk about ${topic}. Start the conversation with a friendly greeting and a question to get me talking.` }]
    : history

  return streamResponse({ system, messages, maxTokens: 300 }, onDelta, onDone, onError)
}

/** Get overall feedback after a speaking chat session */
export async function getSpeakingChatFeedback(
  level: string,
  history: { role: 'user' | 'assistant'; content: string }[]
): Promise<string> {
  const system = `You are an encouraging English speaking coach for a ${level}-level UZBEK learner.
Provide brief, constructive feedback on the conversation that just ended.

IMPORTANT: Write the ENTIRE feedback in UZBEK (Latin script). Keep English ONLY for
specific words/phrases the learner used as examples.

Use these EXACT Uzbek labels and format:
✅ Kuchli tomon: [yaxshi bajargan bir narsa]
📌 Yaxshilash kerak: [ustida ishlash kerak bo'lgan aniq bir narsa]
💡 Maslahat: [keyingi safar uchun bitta amaliy maslahat]

120 so'zdan oshmasin. Iliq va rag'batlantiruvchi bo'l. Hammasi o'zbek tilida.`

  const transcript = history.map(m => `${m.role === 'user' ? 'Student' : 'You'}: ${m.content}`).join('\n')

  try {
    const res = await proxyFetch({
      model: MODEL,
      max_tokens: 300,
      system,
      messages: [{ role: 'user', content: `Here is the conversation transcript:\n\n${transcript}\n\nIltimos, qisqa fikr-mulohaza bering — HAMMASI o'zbek tilida.` }],
      stream: false,
    })
    const data = await res.json()
    const block = data.content?.[0]
    return block?.type === 'text' ? block.text : ''
  } catch (err) {
    monitoring.captureException(err instanceof Error ? err : new Error(String(err)), { context: 'getSpeakingChatFeedback' })
    return ''
  }
}

// ── AI Suhbat Hamrohi (Scenario Roleplay) ───────────────────────────────────

export interface ScenarioContext {
  aiRole:   string
  userRole: string
  opening:  string
  title:    string
}

/**
 * Stsenariy asosida rol o'ynash suhbati. Claude personaj rolini o'ynaydi
 * (ofitsiant, intervyu beruvchi va h.k.) va vaziyatni maqsad sari yo'naltiradi.
 */
export async function startScenarioConversation(
  scenario: ScenarioContext,
  level: string,
  history: { role: 'user' | 'assistant'; content: string }[],
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void
): Promise<void> {
  const system = `You are role-playing as ${scenario.aiRole}. The user is ${scenario.userRole}. \
Scenario: "${scenario.title}".

RULES:
1. STAY in character at all times — you ARE ${scenario.aiRole}, not an AI or teacher.
2. Speak natural, real-world English at ${level} level. Keep it simple if the level is low.
3. Keep each reply SHORT: 1-3 sentences. React naturally to what the user says.
4. Gently move the situation forward toward a natural conclusion (the user completing their task).
5. NEVER correct the user's grammar or break character to teach — that happens later in a report.
6. If the user makes a mistake but you understand them, just respond naturally.
7. When the task is clearly complete, give a warm, natural closing line.`

  const messages = history.length === 0
    ? [{ role: 'assistant' as const, content: scenario.opening }, { role: 'user' as const, content: '(Begin)' }]
    : history

  // Kesh: bir xil stsenariy + level + history → qayta fetch qilmaymiz (AI xarajatini kamaytirish)
  const cacheKey = `scenario:${scenario.title}:${scenario.aiRole}:${scenario.userRole}:${level}:${JSON.stringify(history)}`
  return withCachedStream(
    cacheKey,
    (d, done, e) => streamResponse({ system, messages, maxTokens: 250 }, d, done, e),
    onDelta, onDone, onError,
  )
}

export interface ScenarioReport {
  fluency:    number        // 1-10
  taskSuccess: number       // 1-10 — maqsadga erishildimi
  newWords:   { word: string; meaning: string }[]
  mistakes:   { wrong: string; correct: string; tip: string }[]
  encouragement: string
}

/**
 * Suhbat tugagach, o'quvchining ishlashini tahlil qiladi va tuzilgan hisobot
 * beradi: ravonlik, maqsad bajarilishi, yangi so'zlar, grammatika xatolari.
 */
export async function getScenarioReport(
  scenario: ScenarioContext,
  goalUz: string,
  level: string,
  history: { role: 'user' | 'assistant'; content: string }[]
): Promise<ScenarioReport> {
  const transcript = history
    .filter(m => m.content !== '(Begin)')
    .map(m => `${m.role === 'user' ? 'Learner' : scenario.aiRole}: ${m.content}`)
    .join('\n')

  const system = `You are an encouraging English coach analysing a ${level}-level learner's performance in a roleplay conversation. \
The learner played "${scenario.userRole}" and their goal was: "${goalUz}".

Respond ONLY with valid JSON in EXACTLY this shape (no markdown, no extra text):
{
  "fluency": <1-10 integer>,
  "taskSuccess": <1-10 integer — did they accomplish the goal?>,
  "newWords": [{"word": "<useful word/phrase the learner could learn>", "meaning": "<short Uzbek meaning>"}],
  "mistakes": [{"wrong": "<exact learner phrase with an error>", "correct": "<corrected version>", "tip": "<1 short Uzbek tip>"}],
  "encouragement": "<2 warm sentences in Uzbek about what they did well and one thing to focus on>"
}

Rules:
- newWords: 2-4 items, slightly above the learner's level (help them grow).
- mistakes: only REAL errors from the learner's lines (max 4). If none, use an empty array.
- Keep all Uzbek text natural and warm.`

  const res = await proxyFetch({
    model: MODEL,
    max_tokens: 900,
    system,
    messages: [{ role: 'user', content: `Conversation transcript:\n\n${transcript}\n\nAnalyse the learner's performance and respond with JSON only.` }],
    stream: false,
  })

  const data = await res.json()
  const text = data.content?.[0]?.type === 'text' ? data.content[0].text.trim() : '{}'

  const fallback: ScenarioReport = {
    fluency: 0, taskSuccess: 0, newWords: [], mistakes: [],
    encouragement: "Suhbat tugadi! Mashq qilganingiz uchun rahmat — har bir urinish sizni kuchaytiradi.",
  }

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return fallback
    const parsed = JSON.parse(jsonMatch[0])
    return {
      fluency:     Math.max(0, Math.min(10, Number(parsed.fluency) || 0)),
      taskSuccess: Math.max(0, Math.min(10, Number(parsed.taskSuccess) || 0)),
      newWords:    Array.isArray(parsed.newWords) ? parsed.newWords.slice(0, 4).map((w: { word?: string; meaning?: string }) => ({ word: String(w.word ?? ''), meaning: String(w.meaning ?? '') })) : [],
      mistakes:    Array.isArray(parsed.mistakes) ? parsed.mistakes.slice(0, 4).map((m: { wrong?: string; correct?: string; tip?: string }) => ({ wrong: String(m.wrong ?? ''), correct: String(m.correct ?? ''), tip: String(m.tip ?? '') })) : [],
      encouragement: String(parsed.encouragement || fallback.encouragement),
    }
  } catch (err) {
    monitoring.captureException(err instanceof Error ? err : new Error(String(err)), { context: 'getScenarioReport:jsonParse' })
    return fallback
  }
}

export interface DailyExerciseCheckItem {
  id: number
  context: string
  correct: string
  userAnswer: string
  type: string
}

export async function checkDailyExerciseAnswers(
  items: DailyExerciseCheckItem[]
): Promise<boolean[]> {
  if (items.length === 0) return []

  const exerciseList = items.map((item, i) =>
    `[${i + 1}] Type: ${item.type}\nContext: ${item.context}\nExpected answer: ${item.correct}\nStudent's answer: ${item.userAnswer}`
  ).join('\n\n')

  const res = await proxyFetch({
    model: MODEL,
    max_tokens: 50 + items.length * 30,
    system: `You are a strict but fair English grammar exercise checker for daily language lessons. Your job: determine if a student's answer is an ACCEPTABLE ALTERNATIVE even when it differs from the expected answer.

RULES:
1. ACCEPT contractions as fully equivalent to their full forms and vice versa:
   I'll = I will, he's = he is, she's = she is, it's = it is, they're = they are,
   we've = we have, I've = I have, won't = will not, can't = cannot / can not,
   don't = do not, doesn't = does not, didn't = did not, isn't = is not, aren't = are not,
   I'm = I am, he'd = he would, I'd = I would. NEVER mark an answer wrong only because
   the student used a contraction or the full form.
2. ACCEPT synonyms and close alternatives (e.g., "big" ≈ "large", "quickly" ≈ "fast")
3. ACCEPT alternate correct grammatical forms
4. ACCEPT minor typos (1 letter off) if the word is still clearly recognizable
5. REJECT answers that change the meaning or are grammatically incorrect
6. REJECT answers that mix comparative+more (e.g., "more bigger" is WRONG)
7. For fill-table exercises: each cell comparison is separate, accept if at least half the cells match in spirit

Respond ONLY with a JSON array of booleans, e.g.: [true, false, true, ...]
Where each value corresponds to the exercise at that position (index 1 = first exercise).
true = student's answer is acceptable, false = it is NOT acceptable.`,
    messages: [{
      role: 'user',
      content: `Check if each student's answer is an acceptable alternative for these daily English grammar exercises:\n\n${exerciseList}\n\nRespond ONLY with a JSON array of booleans.`,
    }],
    stream: false,
  })

  const data = await res.json()
  const text = data.content?.[0]?.type === 'text' ? data.content[0].text.trim() : '[]'

  try {
    const jsonMatch = text.match(/\[[\s\S]*\]/)
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0])
      if (Array.isArray(parsed)) {
        return parsed.map((v: unknown) => Boolean(v))
      }
    }
  } catch (err) {
    monitoring.captureException(err instanceof Error ? err : new Error(String(err)), { context: 'checkDailyExerciseAnswers:jsonParse' })
  }

  return items.map(() => false)
}

// ── Faza 5.2: IELTS Writing Analysis ─────────────────────────────────────

export interface WritingAnalysis {
  taskAchievement: number  // 1-9
  coherence:       number
  lexicalResource: number
  grammar:         number
  overallBand:     number  // IELTS 1-9
  feedback:        string
  improvedVersion: string
}

/**
 * IELTS-specific writing analysis with band scores (1-9).
 * Uses streaming response to show partial analysis in real-time.
 */
export async function analyzeWritingIELTS(
  prompt: string,
  essay: string,
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void
): Promise<void> {
  const system = `You are an expert IELTS writing examiner (former Cambridge examiner).
Evaluate the essay using official IELTS Writing Task 2 band descriptors.

Respond ONLY in this exact format — no other text:

TASK_ACHIEVEMENT: [1-9]
[One sentence: how well does the essay address all parts of the prompt? Consider position, development, and relevance of main ideas.]

COHERENCE: [1-9]
[One sentence: paragraphing, logical progression, use of cohesive devices.]

VOCABULARY: [1-9]
[One sentence: vocabulary range, precision, collocations, word formation control.]

GRAMMAR: [1-9]
[One sentence: sentence structures, tense control, punctuation, error frequency.]

OVERALL_BAND: [1-9]
OVERALL_BAND_DESC: [One sentence summary of overall performance]

FEEDBACK:
[3-4 sentences: highlight one key strength, one critical weakness, and the single most impactful change the student can make to raise their band by 0.5-1.0]

IMPROVED:
[Rewrite the student's essay at a band 7+ level — keep all original ideas and arguments intact, but improve expression, structure, and vocabulary. Show only the improved essay text, no extra commentary.]`

  const userPrompt = `IELTS Writing Task 2 prompt:
"${prompt}"

Student's essay:
"${essay}"

Please evaluate and provide band scores.`

  // streamResponse is defined above in this module
  return streamResponse(
    { system, messages: [{ role: 'user', content: userPrompt }], maxTokens: 1500 },
    onDelta, onDone, onError
  )
}

// ── Dars uchun Speaking topshirig'i (mavzuga oid) ────────────────────────────

export interface SpeakingTask {
  prompt:     string                                   // gapirish topshirig'i
  tips:       string[]                                 // o'zbekcha maslahatlar
  keyPhrases: { phrase: string; translation: string }[] // foydali iboralar
}

/**
 * Dars mavzusiga mos speaking topshirig'i yaratadi (prompt + maslahat + iboralar).
 */
export async function generateSpeakingTask(
  topic: string,
  level: string
): Promise<SpeakingTask> {
  const system = `You are an English speaking coach creating a SHORT speaking task for a ${level}-level Uzbek learner, \
based on the grammar/lesson topic they just studied. The task must make them USE that grammar while speaking.

Respond ONLY with valid JSON in EXACTLY this shape (no markdown):
{
  "prompt": "<one clear speaking task (1-2 sentences) that makes the learner practise the topic by speaking ~30-60 seconds>",
  "tips": ["<2-3 short UZBEK tips on what to include / how to use the grammar>"],
  "keyPhrases": [{"phrase": "<useful English phrase for this task>", "translation": "<short Uzbek>"}]
}

Rules:
- The prompt must clearly relate to the topic "${topic}" and be ${level}-appropriate.
- 3-5 keyPhrases. All tips/translations in natural Uzbek.`

  const res = await proxyFetch({
    model: MODEL,
    max_tokens: 600,
    system,
    messages: [{ role: 'user', content: `Lesson topic: "${topic}". Create a speaking task. JSON only.` }],
    stream: false,
  })

  const data = await res.json()
  const text = data.content?.[0]?.type === 'text' ? data.content[0].text.trim() : '{}'

  const fallback: SpeakingTask = {
    prompt: `Talk about "${topic}" for 30-60 seconds. Use what you learned in this lesson.`,
    tips: ["O'rgangan grammatikani ishlatishga harakat qiling.", 'Sekin va aniq gapiring.'],
    keyPhrases: [],
  }

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return fallback
    const parsed = JSON.parse(jsonMatch[0])
    return {
      prompt: String(parsed.prompt || fallback.prompt),
      tips: Array.isArray(parsed.tips) ? parsed.tips.slice(0, 4).map(String) : fallback.tips,
      keyPhrases: Array.isArray(parsed.keyPhrases)
        ? parsed.keyPhrases.slice(0, 6).map((k: { phrase?: string; translation?: string }) => ({ phrase: String(k.phrase ?? ''), translation: String(k.translation ?? '') })).filter((k: { phrase: string }) => k.phrase)
        : [],
    }
  } catch (err) {
    monitoring.captureException(err instanceof Error ? err : new Error(String(err)), { context: 'generateSpeakingTask:jsonParse' })
    return fallback
  }
}

// ── AI Cheksiz Mashq Generatori ──────────────────────────────────────────────

export interface GeneratedExercise {
  question:    string    // gap (___) bilan
  options:     string[]  // 4 variant
  correct:     string    // to'g'ri variant (options ichidan)
  explanation: string    // o'zbekcha izoh
}

/**
 * Berilgan grammatika mavzusi va mavzu/tema bo'yicha yangi mashqlar yaratadi.
 * Har safar yangi, takrorlanmaydigan savollar — cheksiz mashq.
 */
export async function generatePracticeExercises(
  topic: string,
  theme: string,
  level: string,
  count = 6
): Promise<GeneratedExercise[]> {
  const themeLine = theme && theme !== 'Umumiy'
    ? `Make the sentences about the theme "${theme}" to keep it engaging.`
    : 'Use varied everyday contexts.'

  const system = `You are an expert English exercise writer for ${level}-level Uzbek learners. \
Create FRESH, original multiple-choice grammar exercises on the given topic. ${themeLine}

Respond ONLY with valid JSON in EXACTLY this shape (no markdown, no extra text):
{
  "exercises": [
    {
      "question": "<one sentence with a single gap marked as ___ >",
      "options": ["<opt1>", "<opt2>", "<opt3>", "<opt4>"],
      "correct": "<exactly one of the options — the right answer>",
      "explanation": "<1 short UZBEK sentence explaining why it is correct>"
    }
  ]
}

Rules:
- Exactly ${count} exercises. Each tests the topic "${topic}".
- Exactly ONE gap (___) per question. Exactly 4 plausible options. "correct" MUST be one of the options.
- Vary difficulty appropriately for ${level}. Make options tricky but fair.
- explanation in natural Uzbek, short.`

  const res = await proxyFetch({
    model: MODEL,
    max_tokens: 1600,
    system,
    messages: [{ role: 'user', content: `Topic: "${topic}". Generate ${count} fresh multiple-choice exercises. Respond with JSON only.` }],
    stream: false,
  })

  const data = await res.json()
  const text = data.content?.[0]?.type === 'text' ? data.content[0].text.trim() : '{}'

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return []
    const parsed = JSON.parse(jsonMatch[0])
    if (!Array.isArray(parsed.exercises)) return []
    return parsed.exercises
      .map((e: { question?: string; options?: unknown; correct?: string; explanation?: string }) => ({
        question:    String(e.question ?? ''),
        options:     Array.isArray(e.options) ? e.options.map(String).slice(0, 4) : [],
        correct:     String(e.correct ?? ''),
        explanation: String(e.explanation ?? ''),
      }))
      // Yaroqli: 4 variant + to'g'ri javob options ichida
      .filter((e: GeneratedExercise) => e.question && e.options.length === 4 && e.options.includes(e.correct))
  } catch (err) {
    monitoring.captureException(err instanceof Error ? err : new Error(String(err)), { context: 'generatePracticeExercises:jsonParse' })
    return []
  }
}

// ── AI Shaxsiy Tahlil (Learning Insights) ────────────────────────────────────

export interface LearningSignals {
  level:      string
  streak:     number
  skills:     { name: string; pct: number }[]   // grammar, vocab, listening...
  weakGrammar: string[]                          // zaif grammatika mavzulari
}

export interface LearningInsights {
  strengths:      string[]    // kuchli tomonlar (o'zbekcha)
  focusArea:      string      // asosiy diqqat (o'zbekcha)
  recommendation: string      // aniq tavsiya (o'zbekcha)
  motivation:     string      // motivatsiya (o'zbekcha, 1-2 jumla)
}

/**
 * Foydalanuvchining ko'rsatkichlari asosida shaxsiy AI tahlil beradi:
 * kuchli tomonlar, asosiy zaiflik, aniq tavsiya, motivatsiya.
 */
export async function generateLearningInsights(
  signals: LearningSignals
): Promise<LearningInsights> {
  const skillsLine = signals.skills.map(s => `${s.name}: ${s.pct}%`).join(', ')
  const weakLine = signals.weakGrammar.length ? signals.weakGrammar.join(', ') : 'aniqlanmagan'

  const system = `You are a supportive personal English coach for an Uzbek learner. \
Analyse their progress data and give SHORT, specific, actionable insights — all in UZBEK.

Respond ONLY with valid JSON in EXACTLY this shape (no markdown, no extra text):
{
  "strengths": ["<1-2 strong areas, short Uzbek phrases>"],
  "focusArea": "<the single most important area to improve, short Uzbek phrase>",
  "recommendation": "<1 concrete, specific action in Uzbek — e.g. which skill to practise and how>",
  "motivation": "<1-2 warm, motivating sentences in Uzbek>"
}

Rules:
- Base everything on the actual data. Lower % = weaker skill.
- Be specific and encouraging. Keep each field short.
- All text in natural Uzbek.`

  const res = await proxyFetch({
    model: MODEL,
    max_tokens: 500,
    system,
    messages: [{ role: 'user', content: `Learner data:
- CEFR level: ${signals.level}
- Streak: ${signals.streak} kun
- Skill scores: ${skillsLine}
- Weak grammar topics: ${weakLine}

Analyse and respond with JSON only.` }],
    stream: false,
  })

  const data = await res.json()
  const text = data.content?.[0]?.type === 'text' ? data.content[0].text.trim() : '{}'

  const fallback: LearningInsights = {
    strengths: [], focusArea: '', recommendation: '',
    motivation: "Har kuni bir oz mashq — katta natijaga olib keladi. Davom eting! 💪",
  }

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return fallback
    const parsed = JSON.parse(jsonMatch[0])
    return {
      strengths:      Array.isArray(parsed.strengths) ? parsed.strengths.slice(0, 3).map(String) : [],
      focusArea:      String(parsed.focusArea || ''),
      recommendation: String(parsed.recommendation || ''),
      motivation:     String(parsed.motivation || fallback.motivation),
    }
  } catch (err) {
    monitoring.captureException(err instanceof Error ? err : new Error(String(err)), { context: 'generateLearningInsights:jsonParse' })
    return fallback
  }
}

// ── AI Talaffuz Murabbiysi ───────────────────────────────────────────────────

export interface PronunciationIssue {
  word: string    // muammoli so'z
  heard: string   // tizim nima eshitgani (yoki taxminiy noto'g'ri talaffuz)
  ipa: string     // to'g'ri IPA
  tip: string     // o'zbekcha maslahat
}

export interface PronunciationAnalysis {
  score: number               // 0-100 aniqlik
  issues: PronunciationIssue[]
  encouragement: string       // o'zbekcha
}

/**
 * Foydalanuvchi aytishi kerak bo'lgan iborani (target) va nutq tanish
 * tizimi eshitganini (transcript) solishtirib, talaffuz muammolarini aniqlaydi.
 */
export async function analyzePronunciation(
  target: string,
  transcript: string,
  ipa: string,
  level: string,
  acoustic?: { pitchMean: number; pitchStddev: number; avgEnergy: number; energyVariation: number }
): Promise<PronunciationAnalysis> {
  const system = `You are an expert English pronunciation coach for ${level}-level UZBEK speakers. \
The learner tried to say a target phrase. A speech-recognition system transcribed what it heard. \
By comparing the TARGET with the HEARD transcript, infer which words were likely MISPRONOUNCED \
(if the recogniser heard a different word, the learner probably mispronounced it).

Focus on sounds Uzbek speakers struggle with: th (θ/ð), w vs v, short/long vowels (ship/sheep), \
-ed endings, word stress, silent letters, /æ/, /ŋ/.

Respond ONLY with valid JSON in EXACTLY this shape (no markdown, no extra text):
{
  "score": <0-100 — overall pronunciation accuracy>,
  "issues": [
    {"word": "<the target word likely mispronounced>", "heard": "<what was heard, or '—' if just unclear>", "ipa": "<correct IPA for that word>", "tip": "<1 short UZBEK tip on how to say it>"}
  ],
  "encouragement": "<2 warm UZBEK sentences: what was good + one focus area>"
}

Rules:
- If TARGET and HEARD match closely, score high (85-100) and issues can be empty.
- Max 4 issues, the most important ones.
- All tips and encouragement in natural Uzbek.`

  let userContent = `TARGET phrase: "${target}"\nCorrect IPA: ${ipa}\nHEARD (speech recognition): "${transcript || '(nothing detected)'}"\n\nAnalyse the pronunciation and respond with JSON only.`
  if (acoustic) {
    userContent += `\n\nAcoustic measurements from the recording:
- Mean pitch: ${acoustic.pitchMean}Hz (variation: ±${acoustic.pitchStddev}Hz)
- Mean energy: ${acoustic.avgEnergy} (variation: ±${acoustic.energyVariation})
Consider these for word stress and intonation accuracy in your score.`
  }

  const res = await proxyFetch({
    model: MODEL,
    max_tokens: 700,
    system,
    messages: [{ role: 'user', content: userContent }],
    stream: false,
  })

  const data = await res.json()
  const text = data.content?.[0]?.type === 'text' ? data.content[0].text.trim() : '{}'

  const fallback: PronunciationAnalysis = {
    score: 0, issues: [],
    encouragement: "Mashq qilganingiz uchun rahmat! Yana urinib ko'ring — talaffuz takror bilan yaxshilanadi.",
  }

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return fallback
    const parsed = JSON.parse(jsonMatch[0])
    return {
      score: Math.max(0, Math.min(100, Number(parsed.score) || 0)),
      issues: Array.isArray(parsed.issues) ? parsed.issues.slice(0, 4).map((i: { word?: string; heard?: string; ipa?: string; tip?: string }) => ({
        word:  String(i.word ?? ''),
        heard: String(i.heard ?? '—'),
        ipa:   String(i.ipa ?? ''),
        tip:   String(i.tip ?? ''),
      })).filter((i: PronunciationIssue) => i.word) : [],
      encouragement: String(parsed.encouragement || fallback.encouragement),
    }
  } catch (err) {
    monitoring.captureException(err instanceof Error ? err : new Error(String(err)), { context: 'analyzePronunciation:jsonParse' })
    return fallback
  }
}

// ── Aniq yozma xatolar tahlili (inline, Grammarly uslubi) ────────────────────

export interface WritingError {
  wrong:       string   // o'quvchining aynan yozgan qismi
  correct:     string   // to'g'ri shakli
  explanation: string   // o'zbekcha — nega xato
  category:    string   // 'Grammatika' | 'Lug\'at' | 'Artikl' | 'Imlo' | 'Punktuatsiya' | ...
}

/**
 * Esseydan aniq xatolarni ajratib oladi (har biri: xato → to'g'ri → sabab).
 * Tuzilgan JSON qaytaradi — UI da inline tuzatishlar ko'rsatish uchun.
 */
export async function analyzeWritingErrors(
  prompt: string,
  essay: string,
  level: string
): Promise<WritingError[]> {
  const system = `You are a meticulous English writing teacher analysing a ${level}-level (Uzbek speaker) student's essay. \
Find the SPECIFIC errors and return them as actionable corrections.

Respond ONLY with valid JSON in EXACTLY this shape (no markdown, no extra text):
{
  "errors": [
    {
      "wrong": "<the exact phrase the student wrote that contains the error>",
      "correct": "<the corrected phrase>",
      "explanation": "<1 short sentence in UZBEK explaining why it is wrong>",
      "category": "<one of: Grammatika, Lug'at, Artikl, Imlo, Punktuatsiya, So'z tartibi, Predlog>"
    }
  ]
}

Rules:
- Only include REAL errors actually present in the essay. Quote the student's exact words in "wrong".
- Maximum 8 most important errors. Prioritise errors that affect meaning or are repeated.
- If the essay is essentially error-free, return {"errors": []}.
- "explanation" must be in natural Uzbek, short and clear.`

  const res = await proxyFetch({
    model: MODEL,
    max_tokens: 1400,
    system,
    messages: [{ role: 'user', content: `Writing prompt: "${prompt}"\n\nStudent's essay:\n"${essay}"\n\nFind the specific errors and respond with JSON only.` }],
    stream: false,
  })

  const data = await res.json()
  const text = data.content?.[0]?.type === 'text' ? data.content[0].text.trim() : '{}'

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return []
    const parsed = JSON.parse(jsonMatch[0])
    if (!Array.isArray(parsed.errors)) return []
    return parsed.errors.slice(0, 8).map((e: { wrong?: string; correct?: string; explanation?: string; category?: string }) => ({
      wrong:       String(e.wrong ?? ''),
      correct:     String(e.correct ?? ''),
      explanation: String(e.explanation ?? ''),
      category:    String(e.category ?? 'Grammatika'),
    })).filter((e: WritingError) => e.wrong && e.correct)
  } catch (err) {
    monitoring.captureException(err instanceof Error ? err : new Error(String(err)), { context: 'analyzeWritingErrors:jsonParse' })
    return []
  }
}

// ── Tandem Duel AI hakam ───────────────────────────────────────────────────

/**
 * Duel natijalari asosida AI hakam bahosi: grammar/vocab/topic ball + feedback.
 * Har bir foydalanuvchi uchun alohida chaqiriladi.
 */
export async function generateDuelVerdict(
  playerLevel: string,
  mode: string,
  totalQuestions: number,
  correctCount: number,
  questionSummary: string  // "vocab: 8/10, grammar focus: past simple" kabi
): Promise<{ grammar_score: number; vocab_score: number; topic_score: number; feedback: string }> {
  const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0

  const system = `You are a fair English assessment AI evaluating a ${playerLevel}-level learner's duel performance.
Analyse their results and provide scores in EXACTLY this JSON format (no markdown, no extra text):
{
  "grammar_score": <1-10 integer — grammatical accuracy demonstrated>,
  "vocab_score": <1-10 integer — vocabulary range and precision>,
  "topic_score": <1-10 integer — topic understanding / task completion>,
  "feedback": "<1-2 encouraging UZBEK sentences: highlight one strength and one improvement area>"
}

Scoring guide:
- 1-3: needs significant improvement
- 4-6: developing, some errors
- 7-8: good, minor errors
- 9-10: excellent, near-native for this level

Base your assessment on: the duel mode (${mode}), total questions (${totalQuestions}), correct answers (${correctCount}, ${accuracy}% accuracy), and the question summary (${questionSummary}).
Higher accuracy = higher scores, but a student who got 7/10 hard questions deserves higher topic_score than 10/10 easy ones.`

  const res = await proxyFetch({
    model: MODEL,
    max_tokens: 400,
    system,
    messages: [{ role: 'user', content: `Duel mode: ${mode}
Questions: ${totalQuestions}
Correct: ${correctCount} (${accuracy}%)
Level: ${playerLevel}
Question types: ${questionSummary}

Analyse this learner's duel performance and respond with JSON only.` }],
    stream: false,
  })

  const data = await res.json()
  const text = data.content?.[0]?.type === 'text' ? data.content[0].text.trim() : '{}'

  const fallback = {
    grammar_score: Math.max(1, Math.min(10, Math.round(accuracy / 10))),
    vocab_score: Math.max(1, Math.min(10, Math.round(accuracy / 10))),
    topic_score: Math.max(1, Math.min(10, Math.round(accuracy / 10))),
    feedback: accuracy >= 70
      ? `Yaxshi natija! ${accuracy}% to'g'ri javob berdingiz. Davom eting! 💪`
      : `Yana mashq qilish kerak. ${accuracy}% to'g'ri — takrorlang va qayta urinib ko'ring. 📚`,
  }

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return fallback
    const parsed = JSON.parse(jsonMatch[0])
    return {
      grammar_score: Math.max(1, Math.min(10, Number(parsed.grammar_score) || fallback.grammar_score)),
      vocab_score: Math.max(1, Math.min(10, Number(parsed.vocab_score) || fallback.vocab_score)),
      topic_score: Math.max(1, Math.min(10, Number(parsed.topic_score) || fallback.topic_score)),
      feedback: String(parsed.feedback || fallback.feedback),
    }
  } catch (err) {
    monitoring.captureException(err instanceof Error ? err : new Error(String(err)), { context: 'generateDuelVerdict:jsonParse' })
    return fallback
  }
}

// ─── Tandem AI Roleplay Duo hakam ────────────────────────────────────────────

/**
 * Roleplay Duo yakunida ikkala o'yinchini alohida baholaydi.
 * Har bir foydalanuvchining ScenarioReport'ini qaytaradi.
 */
export async function generateDuoRoleplayReport(
  scenarioA: ScenarioContext,
  goalUz: string,
  level: string,
  userAName: string,
  userBName: string,
  userAHistory: { role: 'user' | 'assistant'; content: string }[],
  userBHistory: { role: 'user' | 'assistant'; content: string }[],
): Promise<{
  userA: ScenarioReport
  userB: ScenarioReport
}> {
  const userATranscript = userAHistory
    .filter(m => m.content !== '(Begin)')
    .map(m => `${m.role === 'user' ? userAName : scenarioA.aiRole}: ${m.content}`)
    .join('\n')

  const userBTranscript = userBHistory
    .filter(m => m.content !== '(Begin)')
    .map(m => `${m.role === 'user' ? userBName : scenarioA.aiRole}: ${m.content}`)
    .join('\n')

  const combinedUserBContext = userBHistory.length > 0
    ? userBTranscript
    : `${userBName} hali suhbat qilmagan (faqat ${userAName} o'ynagan).`

  const system = `You are an encouraging English coach analysing TWO ${level}-level learners in a TANDEM ROLEPLAY DUO.

Scenario: "${scenarioA.title}"
${scenarioA.userRole}: ${userAName} and ${userBName}
${scenarioA.aiRole}: the AI character

Goal: "${goalUz}"

You must evaluate EACH learner independently based on their conversation with the AI character.

Respond ONLY with valid JSON in EXACTLY this shape (no markdown, no extra text):
{
  "userA": {
    "fluency": <1-10 integer>,
    "taskSuccess": <1-10 integer — did they accomplish the goal in their role?>,
    "newWords": [{"word": "<useful word/phrase>", "meaning": "<short Uzbek meaning>"}],
    "mistakes": [{"wrong": "<exact learner phrase with error>", "correct": "<corrected version>", "tip": "<1 short Uzbek tip>"}],
    "encouragement": "<2 warm Uzbek sentences about their performance and one focus area>"
  },
  "userB": {
    "fluency": <1-10 integer>,
    "taskSuccess": <1-10 integer>,
    "newWords": [{"word": "<useful word/phrase>", "meaning": "<short Uzbek meaning>"}],
    "mistakes": [{"wrong": "<exact learner phrase with error>", "correct": "<corrected version>", "tip": "<1 short Uzbek tip>"}],
    "encouragement": "<2 warm Uzbek sentences about their performance and one focus area>"
  }
}

Rules:
- newWords: 2-4 per person, slightly above their level
- mistakes: only REAL errors from that person's lines (max 4). If none, empty array.
- If a person hasn't spoken yet, give them fluency=0, taskSuccess=0, empty newWords, empty mistakes, and encouragement saying they still need to play.
- Be fair and independent for each learner.
- All Uzbek text natural and warm.`

  const res = await proxyFetch({
    model: MODEL,
    max_tokens: 1500,
    system,
    messages: [{ role: 'user', content: `Conversation transcript for ${userAName}:\n\n${userATranscript}\n\n---\n\nConversation transcript for ${userBName}:\n\n${combinedUserBContext}\n\nAnalyse both learners' performances and respond with JSON only.` }],
    stream: false,
  })

  const data = await res.json()
  const text = data.content?.[0]?.type === 'text' ? data.content[0].text.trim() : '{}'

  const fallbackEval = {
    fluency: 0, taskSuccess: 0, newWords: [], mistakes: [],
    encouragement: "Suhbat tugadi! Mashq qilganingiz uchun rahmat — har bir urinish sizni kuchaytiradi.",
  }

  try {
    const jsonMatch = text.match(/\{[\s\S]*\}/)
    if (!jsonMatch) return { userA: fallbackEval, userB: fallbackEval }
    const parsed = JSON.parse(jsonMatch[0])

    const parseEval = (obj: unknown): ScenarioReport => {
      const o = obj as Record<string, unknown>
      return {
        fluency:     Math.max(0, Math.min(10, Number(o.fluency) || 0)),
        taskSuccess: Math.max(0, Math.min(10, Number(o.taskSuccess) || 0)),
        newWords:    Array.isArray(o.newWords) ? o.newWords.slice(0, 4).map((w: { word?: string; meaning?: string }) => ({ word: String(w.word ?? ''), meaning: String(w.meaning ?? '') })) : [],
        mistakes:    Array.isArray(o.mistakes) ? o.mistakes.slice(0, 4).map((m: { wrong?: string; correct?: string; tip?: string }) => ({ wrong: String(m.wrong ?? ''), correct: String(m.correct ?? ''), tip: String(m.tip ?? '') })) : [],
        encouragement: String((o.encouragement ?? fallbackEval.encouragement)),
      }
    }

    return {
      userA: parseEval(parsed.userA),
      userB: parseEval(parsed.userB),
    }
  } catch (err) {
    monitoring.captureException(err instanceof Error ? err : new Error(String(err)), { context: 'generateDuoRoleplayReport:jsonParse' })
    return { userA: fallbackEval, userB: fallbackEval }
  }
}

export { MODEL }
