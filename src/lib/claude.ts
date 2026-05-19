import Anthropic from '@anthropic-ai/sdk'
import { buildSystemPrompt, type TutorMode } from './prompts'

const MODEL = (import.meta.env.VITE_CLAUDE_MODEL as string | undefined)
  ?? 'claude-sonnet-4-5'

const API_KEY = import.meta.env.VITE_ANTHROPIC_API_KEY as string | undefined

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

function getClient(): Anthropic {
  if (!API_KEY || API_KEY === 'your_key_here') {
    throw new Error(
      'VITE_ANTHROPIC_API_KEY topilmadi. .env fayliga API kalitingizni kiriting.'
    )
  }
  return new Anthropic({
    apiKey: API_KEY,
    dangerouslyAllowBrowser: true,
  })
}

// ─── Non-streaming send (simple) ─────────────────────────────────────────────

export async function sendMessage(
  messages: ChatMessage[],
  mode: TutorMode = 'general'
): Promise<string> {
  const client = getClient()

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: buildSystemPrompt(mode),
    messages: messages.map((m) => ({
      role: m.role,
      content: m.content,
    })),
  })

  const block = response.content[0]
  if (block.type !== 'text') return ''
  return block.text
}

// ─── Streaming send ───────────────────────────────────────────────────────────

export async function sendMessageStream(
  messages: ChatMessage[],
  mode: TutorMode = 'general',
  onDelta: (token: string) => void,
  onDone: (fullText: string) => void,
  onError: (err: Error) => void
): Promise<void> {
  let client: Anthropic
  try {
    client = getClient()
  } catch (err) {
    onError(err as Error)
    return
  }

  let full = ''

  try {
    const stream = await client.messages.stream({
      model: MODEL,
      max_tokens: 1024,
      system: buildSystemPrompt(mode),
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
      })),
    })

    for await (const event of stream) {
      if (
        event.type === 'content_block_delta' &&
        event.delta.type === 'text_delta'
      ) {
        full += event.delta.text
        onDelta(event.delta.text)
      }
    }

    onDone(full)
  } catch (err) {
    onError(err as Error)
  }
}

// ─── Grammar check shortcut ──────────────────────────────────────────────────

export async function checkGrammar(text: string): Promise<string> {
  return sendMessage(
    [{ role: 'user', content: `Please check my grammar:\n\n${text}` }],
    'grammar-check'
  )
}

// ─── Writing feedback shortcut ───────────────────────────────────────────────

export async function getWritingFeedback(essay: string): Promise<string> {
  return sendMessage(
    [{ role: 'user', content: `Please give detailed feedback on my writing:\n\n${essay}` }],
    'writing-feedback'
  )
}

// ─── Vocabulary explain shortcut ─────────────────────────────────────────────

export async function explainWord(word: string): Promise<string> {
  return sendMessage(
    [{ role: 'user', content: `Explain the word: "${word}"` }],
    'vocabulary'
  )
}

// ─── Grammar exercise feedback (streaming) ───────────────────────────────────

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
  let client: Anthropic
  try { client = getClient() } catch (e) { onError(e as Error); return }

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

  let full = ''
  try {
    const stream = await client.messages.stream({
      model: MODEL,
      max_tokens: 700,
      system,
      messages: [{ role: 'user', content: prompt }],
    })
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        full += event.delta.text
        onDelta(event.delta.text)
      }
    }
    onDone(full)
  } catch (err) {
    onError(err as Error)
  }
}

// ─── Reading: generate extra comprehension questions (streaming) ─────────────

export async function generateReadingQuestions(
  text: string,
  level: string,
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void
): Promise<void> {
  let client: Anthropic
  try { client = getClient() } catch (e) { onError(e as Error); return }

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

  let full = ''
  try {
    const stream = await client.messages.stream({
      model: MODEL,
      max_tokens: 700,
      system,
      messages: [{ role: 'user', content: prompt }],
    })
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        full += event.delta.text
        onDelta(event.delta.text)
      }
    }
    onDone(full)
  } catch (err) {
    onError(err as Error)
  }
}

// ─── Writing: evaluate essay with IELTS criteria (streaming) ─────────────────

export async function evaluateWriting(
  prompt: string,
  essay: string,
  level: string,
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void
): Promise<void> {
  let client: Anthropic
  try { client = getClient() } catch (e) { onError(e as Error); return }

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

  let full = ''
  try {
    const stream = await client.messages.stream({
      model: MODEL,
      max_tokens: 1200,
      system,
      messages: [{ role: 'user', content: userPrompt }],
    })
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        full += event.delta.text
        onDelta(event.delta.text)
      }
    }
    onDone(full)
  } catch (err) {
    onError(err as Error)
  }
}

// ─── Speaking: evaluate spoken response (streaming) ─────────────────────────

export async function evaluateSpeech(
  prompt: string,
  transcript: string,
  level: string,
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void
): Promise<void> {
  let client: Anthropic
  try { client = getClient() } catch (e) { onError(e as Error); return }

  const system = `You are an experienced English speaking coach evaluating a ${level}-level student.
Respond ONLY in this exact format — no other text before or after:

FLUENCY: [1-10]
[One sentence about fluency — pace, hesitation, flow]

GRAMMAR: [1-10]
[One sentence about grammatical accuracy]

VOCABULARY: [1-10]
[One sentence about range and appropriateness of vocabulary]

FEEDBACK:
[2–3 encouraging sentences: highlight one strength, give one specific improvement tip]`

  const userPrompt = `Speaking prompt: "${prompt}"

Student's spoken response: "${transcript || '(no speech detected)'}"`

  let full = ''
  try {
    const stream = await client.messages.stream({
      model: MODEL,
      max_tokens: 350,
      system,
      messages: [{ role: 'user', content: userPrompt }],
    })
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        full += event.delta.text
        onDelta(event.delta.text)
      }
    }
    onDone(full)
  } catch (err) {
    onError(err as Error)
  }
}

// ─── Vocabulary: generate example sentences (streaming) ──────────────────────

export async function generateExamples(
  word: string,
  level: string,
  onDelta: (token: string) => void,
  onDone:  (full: string)  => void,
  onError: (err: Error)    => void
): Promise<void> {
  let client: Anthropic
  try { client = getClient() } catch (e) { onError(e as Error); return }

  const system = `You are a concise English vocabulary teacher. \
Create clear, natural example sentences for ${level}-level learners.`

  const prompt = `Write exactly 3 example sentences using the word "${word}".
Each sentence must be natural, at ${level} level, and show a different context.
Format:
1. [sentence]
2. [sentence]
3. [sentence]
Only the numbered sentences, nothing else.`

  let full = ''
  try {
    const stream = await client.messages.stream({
      model: MODEL,
      max_tokens: 250,
      system,
      messages: [{ role: 'user', content: prompt }],
    })
    for await (const event of stream) {
      if (event.type === 'content_block_delta' && event.delta.type === 'text_delta') {
        full += event.delta.text
        onDelta(event.delta.text)
      }
    }
    onDone(full)
  } catch (err) {
    onError(err as Error)
  }
}

// ─── Word card: translation + phonetic + example (non-streaming, cached) ────────

export interface WordCard {
  translation: string
  phonetic:    string
  example:     string
}

export async function generateWordCard(word: string, level: string): Promise<WordCard> {
  const client = getClient()

  const system = `You are a concise English–Uzbek dictionary assistant for ${level}-level learners.
Respond ONLY in this exact format — nothing else:
TRANSLATION: [Uzbek translation, 3-6 words max]
PHONETIC: [IPA pronunciation, e.g. /əˈbʌndənt/]
EXAMPLE: [One natural ${level}-level English sentence using the word]`

  const response = await client.messages.create({
    model:      MODEL,
    max_tokens: 120,
    system,
    messages:   [{ role: 'user', content: `Word: "${word}"` }],
  })

  const text = response.content[0]?.type === 'text' ? response.content[0].text : ''
  const get  = (key: string) =>
    text.match(new RegExp(`${key}:\\s*(.+)`))?.[1]?.trim() ?? ''

  return {
    translation: get('TRANSLATION'),
    phonetic:    get('PHONETIC'),
    example:     get('EXAMPLE'),
  }
}

// ─── Vocab game: so'z javobini tekshirish ────────────────────────────────────

export async function checkVocabAnswer(
  uzbek: string,
  correctEnglish: string,
  userAnswer: string
): Promise<boolean> {
  const client = getClient()

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 5,
    system: 'You are a strict vocabulary checker. Reply ONLY with CORRECT or WRONG.',
    messages: [{
      role: 'user',
      content: `Uzbek word: "${uzbek}" | Expected English: "${correctEnglish}" | Student wrote: "${userAnswer}"\nIs the student's answer a valid English translation of this Uzbek word? Consider synonyms and alternate forms. Reply ONLY: CORRECT or WRONG`,
    }],
  })

  const text = response.content[0]?.type === 'text'
    ? response.content[0].text.trim().toUpperCase()
    : 'WRONG'
  return text.startsWith('CORRECT')
}

export { MODEL }
