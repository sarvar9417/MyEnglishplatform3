import { supabase } from '../db/supabase'
import {
  B1_QUESTIONS,
  B2_QUESTIONS,
  IELTS_WRITING_TASK1,
  IELTS_WRITING_TASK2,
  IELTS_LISTENING_TEXT,
  IELTS_LISTENING_MCQ,
  pctToBand,
  scoreToBand,
  roundBand,
} from '../data/mockTestData'
import type { TQ, ListeningMCQ } from '../data/mockTestData'

export { pctToBand, scoreToBand, roundBand }
export type { TQ, ListeningMCQ }

export interface MockTestData {
  questions: TQ[]
  writingTask1: { prompt: string; instruction: string }
  writingTask2: { prompt: string; instruction: string }
  listeningText: string
  listeningMCQ: ListeningMCQ[]
}

interface MockTestRow {
  id: string
  data: {
    writingTask1: { prompt: string; instruction: string }
    writingTask2: { prompt: string; instruction: string }
  }
}

async function fetchQuestions(level: string): Promise<TQ[]> {
  const { data, error } = await supabase
    .from('mocktest_questions')
    .select('*')
    .eq('level', level)

  if (error || !data || data.length === 0) {
    return level === 'B2' ? B2_QUESTIONS : B1_QUESTIONS
  }

  return data.map((r) => r.data as unknown as TQ)
}

async function fetchListening(level: string): Promise<{ text: string; mcq: ListeningMCQ[] } | null> {
  const { data, error } = await supabase
    .from('mocktest_listening')
    .select('*')
    .eq('level', level)
    .maybeSingle()

  if (error || !data) {
    return { text: IELTS_LISTENING_TEXT, mcq: IELTS_LISTENING_MCQ }
  }

  return data.data as unknown as { text: string; mcq: ListeningMCQ[] }
}

async function fetchWriting(): Promise<{ writingTask1: { prompt: string; instruction: string }; writingTask2: { prompt: string; instruction: string } }> {
  const { data, error } = await supabase
    .from('mocktest_writing')
    .select('*')
    .eq('id', 'ielts-writing')
    .maybeSingle()

  if (error || !data) {
    return { writingTask1: { prompt: IELTS_WRITING_TASK1.prompt, instruction: IELTS_WRITING_TASK1.title }, writingTask2: { prompt: IELTS_WRITING_TASK2.prompt, instruction: IELTS_WRITING_TASK2.title } }
  }

  const d = data as unknown as MockTestRow
  return d.data
}

export async function fetchMockTestData(level: string): Promise<MockTestData> {
  const [questions, listening, writing] = await Promise.all([
    fetchQuestions(level),
    fetchListening(level),
    fetchWriting(),
  ])

  return {
    questions,
    writingTask1: writing.writingTask1,
    writingTask2: writing.writingTask2,
    listeningText: listening?.text ?? '',
    listeningMCQ: listening?.mcq ?? [],
  }
}
