import { streamResponse } from './claudeClient'
import { withCachedStream } from './aiCache'

// ── Grammar Feedback ───────────────────────────────────────────────────────

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

// ── Reading Questions ──────────────────────────────────────────────────────

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

// ── Evaluate Writing ───────────────────────────────────────────────────────

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

// ── Evaluate Speech ────────────────────────────────────────────────────────

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

// ── Generate Examples ──────────────────────────────────────────────────────

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

// ── Analyze Grammar ────────────────────────────────────────────────────────

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

// ── Speaking Chat ──────────────────────────────────────────────────────────

export async function startSpeakingChat(
  topic: string,
  level: string,
  history: { role: 'user' | 'assistant'; content: string }[],
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void,
  pronunciationFocus?: { sound: string; ipaExample: string; tipUz: string; tipEn: string; commonError?: string },
  grammarTips?: string[]
): Promise<void> {
  let pronunciationBlock = ''
  if (pronunciationFocus) {
    pronunciationBlock = `
PRONUNCIATION FOCUS — Today's sound: /${pronunciationFocus.sound}/
The student should practise this sound naturally. If they struggle, gently model it.
Tip for the student: ${pronunciationFocus.tipEn}`
  }

  let grammarBlock = ''
  if (grammarTips && grammarTips.length > 0) {
    const tips = grammarTips.map((t, i) => `  ${i + 1}. ${t}`).join('\n')
    grammarBlock = `
GRAMMAR POINTS TO WEAVE INTO THIS CONVERSATION:
${tips}
Naturally model correct forms when the student uses them — do NOT explicitly teach or correct during the conversation.`
  }

  const system = `You are a friendly English conversation partner for a ${level}-level learner.

RULES:
1. Respond conversationally — like a friend, NOT a teacher.
2. Keep responses SHORT: 2-4 sentences max.
3. Use ${level}-level English. Define any harder word immediately.
4. End each turn with a natural follow-up question.
5. Do NOT give scores or evaluations during conversation.
6. Topic: ${topic}${pronunciationBlock}${grammarBlock}`

  const messages = history.length === 0
    ? [{ role: 'user' as const, content: `Let's talk about ${topic}. Start the conversation with a friendly greeting and a question to get me talking.` }]
    : history

  return streamResponse({ system, messages, maxTokens: 300 }, onDelta, onDone, onError)
}

// ── Scenario Conversation ──────────────────────────────────────────────────

export interface ScenarioContext {
  aiRole:   string
  userRole: string
  opening:  string
  title:    string
}

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

  const cacheKey = `scenario:${scenario.title}:${scenario.aiRole}:${scenario.userRole}:${level}:${JSON.stringify(history)}`
  return withCachedStream(
    cacheKey,
    (d, done, e) => streamResponse({ system, messages, maxTokens: 250 }, d, done, e),
    onDelta, onDone, onError,
  )
}

// ── IELTS Writing Analysis ────────────────────────────────────────────────

export interface WritingAnalysis {
  taskAchievement: number
  coherence:       number
  lexicalResource: number
  grammar:         number
  overallBand:     number
  feedback:        string
  improvedVersion: string
}

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

  return streamResponse(
    { system, messages: [{ role: 'user', content: userPrompt }], maxTokens: 1500 },
    onDelta, onDone, onError
  )
}
