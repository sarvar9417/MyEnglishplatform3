import { supabase } from '../lib/supabase'
import { addDaysTashkent } from '../utils/tashkentDate'
import { useToastStore } from '../utils/toastStore'
import { monitoring } from '../lib/monitoring'
import { createDefaultFSRSState, computeNextReviewFSRS } from '../lib/srs'
import type { PersonalWord, AddWordDTO, UpdateWordDTO, VocabRating } from '../types/personalVocabulary'

// ═══════════════════════════════════════════════════════════════════════════
// Personal Vocabulary Service
// ═══════════════════════════════════════════════════════════════════════════

const SRS_INTERVALS = [1, 3, 7, 14, 30, 90]
const MAX_BOX = 6

export function computePersonalVocabNextReview(
  box: number,
  rating: VocabRating
): { box: number; next_review: string; is_learned: boolean } {
  let newBox: number

  if (rating === 'yodladim') {
    newBox = Math.min(box + 2, MAX_BOX)
  } else if (rating === 'bildim') {
    newBox = Math.min(box + 1, MAX_BOX)
  } else if (rating === 'qiynaldim') {
    newBox = box  // Keep at current level
  } else {
    newBox = 1  // bilmadim - reset to box 1
  }

  const intervalDays = SRS_INTERVALS[newBox - 1]
  const isLearned = newBox >= MAX_BOX

  return { box: newBox, next_review: addDaysTashkent(intervalDays), is_learned: isLearned }
}

// ─── CRUD Operations ──────────────────────────────────────────────────────

export async function addPersonalWordToDB(
  userId: string,
  wordData: AddWordDTO
): Promise<PersonalWord> {
  const now = new Date().toISOString()
  const defaultFSRS = createDefaultFSRSState()
  
  const { data, error } = await (supabase
    .from('personal_vocabulary' as never)
    .insert({
      user_id: userId,
      english: wordData.english,
      uzbek: wordData.uzbek,
      phonetic: wordData.phonetic || null,
      example: wordData.example || null,
      category: wordData.category || 'custom',
      level: wordData.level || 'A2',
      source: wordData.source || 'manual',
      ai_suggested_translation: wordData.ai_suggested_translation || null,
      box: 1,
      next_review: addDaysTashkent(1),
      is_learned: false,
      correct_count: 0,
      wrong_count: 0,
      fsrs_stability: defaultFSRS.stability,
      fsrs_difficulty: defaultFSRS.difficulty,
      fsrs_reps: 0,
      fsrs_lapses: 0,
      created_at: now,
      updated_at: now,
    } as never)
    .select()
    .single() as unknown as Promise<{ data: PersonalWord | null; error: unknown }>)

  if (error) {
    monitoring.captureMessage('addPersonalWordToDB error: ' + (error instanceof Error ? error.message : String(error)), 'error')
    useToastStore.getState().toast("So'z qo'shishda xatolik", 'error')
    throw error instanceof Error ? error : new Error(String(error))
  }

  if (!data) throw new Error('No data returned')
  return data
}

export async function updatePersonalWordInDB(
  userId: string,
  wordId: number,
  updates: UpdateWordDTO
): Promise<void> {
  const { error } = await (supabase
    .from('personal_vocabulary' as never)
    .update({
      ...updates,
      updated_at: new Date().toISOString(),
    } as never)
    .eq('user_id', userId)
    .eq('id', wordId) as unknown as Promise<{ error: unknown }>)

  if (error) {
    monitoring.captureMessage('updatePersonalWordInDB error: ' + (error instanceof Error ? error.message : String(error)), 'error')
    useToastStore.getState().toast("So'zni yangilashda xatolik", 'error')
    throw error instanceof Error ? error : new Error(String(error))
  }
}

export async function deletePersonalWordFromDB(
  userId: string,
  wordId: number
): Promise<void> {
  const { error } = await (supabase
    .from('personal_vocabulary' as never)
    .delete()
    .eq('user_id', userId)
    .eq('id', wordId) as unknown as Promise<{ error: unknown }>)

  if (error) {
    monitoring.captureMessage('deletePersonalWordFromDB error: ' + (error instanceof Error ? error.message : String(error)), 'error')
    useToastStore.getState().toast("So'zni o'chirishda xatolik", 'error')
    throw error instanceof Error ? error : new Error(String(error))
  }
}

export async function fetchPersonalWordsFromDB(userId: string): Promise<PersonalWord[]> {
  const { data, error } = await (supabase
    .from('personal_vocabulary' as never)
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false }) as unknown as Promise<{ data: PersonalWord[] | null; error: unknown }>)

  if (error) {
    monitoring.captureMessage('fetchPersonalWordsFromDB error: ' + (error instanceof Error ? error.message : String(error)), 'error')
    return []
  }

  return data ?? []
}

export async function fetchWordsForReviewFromDB(userId: string): Promise<PersonalWord[]> {
  const today = new Date().toISOString().split('T')[0]
  
  const { data, error } = await (supabase
    .from('personal_vocabulary' as never)
    .select('*')
    .eq('user_id', userId)
    .eq('is_learned', false)
    .lte('next_review', today)
    .order('next_review', { ascending: true }) as unknown as Promise<{ data: PersonalWord[] | null; error: unknown }>)

  if (error) {
    monitoring.captureMessage('fetchWordsForReviewFromDB error: ' + (error instanceof Error ? error.message : String(error)), 'error')
    return []
  }

  return data ?? []
}

export async function ratePersonalWordInDB(
  userId: string,
  wordId: number,
  rating: VocabRating
): Promise<PersonalWord> {
  // Compute FSRS client-side (our TypeScript algorithm)
  const { data: existing, error: fetchError } = await (supabase
    .from('personal_vocabulary' as never)
    .select('fsrs_stability, fsrs_difficulty, next_review, fsrs_reps, fsrs_lapses')
    .eq('user_id', userId)
    .eq('id', wordId)
    .single() as unknown as Promise<{ data: { fsrs_stability: number | null; fsrs_difficulty: number | null; next_review: string; fsrs_reps: number | null; fsrs_lapses: number | null } | null; error: unknown }>)

  let fsrsStability: number | undefined
  let fsrsDifficulty: number | undefined
  let fsrsReps: number | undefined
  let fsrsLapses: number | undefined

  if (!fetchError && existing) {
    const fsrsState = computeNextReviewFSRS(
      {
        stability: existing.fsrs_stability ?? 0,
        difficulty: existing.fsrs_difficulty ?? 5,
        due: existing.next_review,
        reps: existing.fsrs_reps ?? 0,
        lapses: existing.fsrs_lapses ?? 0,
      },
      rating
    )
    fsrsStability = fsrsState.state.stability
    fsrsDifficulty = fsrsState.state.difficulty
    fsrsReps = fsrsState.state.reps
    fsrsLapses = fsrsState.state.lapses
  }

  // Atomic RPC call with FSRS params — no race condition on box/score update
  const s = supabase as unknown as { rpc: (name: string, params: Record<string, unknown>) => Promise<{ data: Record<string, unknown> | null; error: unknown }> }
  const { data, error } = await s.rpc('rate_personal_vocab_word', {
    p_user_id: userId,
    p_word_id: wordId,
    p_rating: rating,
    p_fsrs_stability: fsrsStability ?? null,
    p_fsrs_difficulty: fsrsDifficulty ?? null,
    p_fsrs_reps: fsrsReps ?? null,
    p_fsrs_lapses: fsrsLapses ?? null,
  })

  if (error || !data) {
    monitoring.captureMessage('ratePersonalWordInDB error: ' + (error instanceof Error ? error.message : String(error ?? 'no data')), 'error')
    useToastStore.getState().toast("Baho saqlashda xatolik", 'error')
    throw error instanceof Error ? error : new Error('Rating failed')
  }

  return data as unknown as PersonalWord
}

export async function batchAddPersonalWordsToDB(
  userId: string,
  wordsData: AddWordDTO[]
): Promise<PersonalWord[]> {
  if (wordsData.length === 0) return []

  const now = new Date().toISOString()
  const defaultFSRS = createDefaultFSRSState()
  const rows = wordsData.map((w) => ({
    user_id: userId,
    english: w.english,
    uzbek: w.uzbek,
    phonetic: w.phonetic || null,
    example: w.example || null,
    category: w.category || 'custom',
    level: w.level || 'A2',
    source: w.source || 'imported',
    ai_suggested_translation: w.ai_suggested_translation || null,
    box: 1,
    next_review: addDaysTashkent(1),
    is_learned: false,
    correct_count: 0,
    wrong_count: 0,
    fsrs_stability: defaultFSRS.stability,
    fsrs_difficulty: defaultFSRS.difficulty,
    fsrs_reps: 0,
    fsrs_lapses: 0,
    created_at: now,
    updated_at: now,
  }))

  const { data, error } = await (supabase
    .from('personal_vocabulary' as never)
    .insert(rows as never)
    .select() as unknown as Promise<{ data: PersonalWord[] | null; error: unknown }>)

  if (error) {
    monitoring.captureMessage('batchAddPersonalWordsToDB error: ' + (error instanceof Error ? error.message : String(error)), 'error')
    useToastStore.getState().toast("So'zlarni qo'shishda xatolik", 'error')
    throw error instanceof Error ? error : new Error(String(error))
  }

  return data ?? []
}

// ─── AI Translation Helper ────────────────────────────────────────────────

export async function generateAITranslation(
  word: string,
  context?: string
): Promise<{ uzbek: string; phonetic?: string; example?: string }> {
  try {
    const prompt = `You are an English-Uzbek dictionary assistant. Translate the English word "${word}"${context ? ` in the context of "${context}"` : ''}.

Respond with ONLY a valid JSON object (no markdown, no extra text):
{
  "uzbek": "Uzbek translation",
  "phonetic": "IPA pronunciation if applicable",
  "example": "Example sentence in English using this word"
}

Rules:
- uzbek: concise Uzbek translation (1-3 words max)
- phonetic: IPA notation like /ˈwɜːrd/ or empty string if not applicable
- example: a simple English sentence showing the word in context
- Respond ONLY with the JSON object, nothing else`

    const response = await fetch('/api/claude', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        max_tokens: 200,
        messages: [{ role: 'user', content: prompt }],
      }),
    })

    if (!response.ok) {
      throw new Error(`AI translation failed: ${response.status}`)
    }

    const data = await response.json()
    const content = data.content?.[0]?.text ?? data.text ?? '{}'
    
    // Parse JSON from response
    const jsonMatch = content.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      return { uzbek: '' }
    }

    const parsed = JSON.parse(jsonMatch[0])
    return {
      uzbek: parsed.uzbek || '',
      phonetic: parsed.phonetic || undefined,
      example: parsed.example || undefined,
    }
  } catch (e) {
    monitoring.captureMessage('generateAITranslation error: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return { uzbek: '' }
  }
}

// ─── Import/Export ─────────────────────────────────────────────────────────

export function exportPersonalVocabulary(words: PersonalWord[]): string {
  const exportData = words.map((w) => ({
    english: w.english,
    uzbek: w.uzbek,
    phonetic: w.phonetic,
    example: w.example,
    category: w.category,
    level: w.level,
  }))
  return JSON.stringify(exportData, null, 2)
}

export function importPersonalVocabulary(jsonString: string): AddWordDTO[] {
  try {
    const data = JSON.parse(jsonString)
    if (!Array.isArray(data)) throw new Error('Invalid format')
    return data.map((item: Record<string, unknown>) => ({
      english: String(item.english || ''),
      uzbek: String(item.uzbek || ''),
      phonetic: item.phonetic ? String(item.phonetic) : undefined,
      example: item.example ? String(item.example) : undefined,
      category: (item.category as AddWordDTO['category']) || 'custom',
      level: (item.level as AddWordDTO['level']) || 'A2',
      source: 'imported' as const,
    }))
  } catch (e) {
    monitoring.captureMessage('importPersonalVocabulary error: ' + (e instanceof Error ? e.message : String(e)), 'error')
    return []
  }
}
