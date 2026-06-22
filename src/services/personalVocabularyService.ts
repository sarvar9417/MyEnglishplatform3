import { supabase } from '../lib/supabase'
import { db } from '../lib/db'
import { addDaysTashkent, getTodayTashkent } from '../utils/tashkentDate'
import { useToastStore } from '../utils/toastStore'
import { monitoring } from '../lib/monitoring'
import { createDefaultFSRSState, computeNextReviewFSRS } from '../lib/srs'
import type { PersonalWord, AddWordDTO, UpdateWordDTO, VocabRating, PartOfSpeech } from '../types/personalVocabulary'

// ═══════════════════════════════════════════════════════════════════════════
// Personal Vocabulary Service
// ═══════════════════════════════════════════════════════════════════════════

// 'guest' (yoki bo'sh) userId — auth.users'ga FK + RLS uchun yaroqsiz.
// Mutatsiyalardan oldin tekshiramiz: jim FK xatosi o'rniga aniq xabar.
function requireAuthedUser(userId: string): void {
  if (!userId || userId === 'guest') {
    useToastStore.getState().toast('Iltimos, avval tizimga kiring', 'error')
    throw new Error('Not authenticated')
  }
}

// ─── CRUD Operations ──────────────────────────────────────────────────────

async function checkDuplicateWord(userId: string, english: string): Promise<boolean> {
  const { data } = await supabase
    .from('personal_vocabulary')
    .select('id')
    .eq('user_id', userId)
    .ilike('english', english.trim())
    .maybeSingle()
  return !!data
}

export async function addPersonalWordToDB(
  userId: string,
  wordData: AddWordDTO
): Promise<PersonalWord> {
  requireAuthedUser(userId)

  if (await checkDuplicateWord(userId, wordData.english)) {
    useToastStore.getState().toast("Bu so'z allaqachon qo'shilgan", 'warning')
    throw new Error('Duplicate word')
  }

  const now = new Date().toISOString()
  const defaultFSRS = createDefaultFSRSState()

  const { data, error } = await supabase
    .from('personal_vocabulary')
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
      // @ts-expect-error part_of_speech column may not exist in generated types yet
      part_of_speech: wordData.part_of_speech || null,
    })
    .select()
    .single()

  if (error) {
    monitoring.captureMessage('addPersonalWordToDB error: ' + (error instanceof Error ? error.message : String(error)), 'error')
    useToastStore.getState().toast("So'z qo'shishda xatolik", 'error')
    throw error instanceof Error ? error : new Error(String(error))
  }

  if (!data) throw new Error('No data returned')
  return data as PersonalWord
}

export async function updatePersonalWordInDB(
  userId: string,
  wordId: number,
  updates: UpdateWordDTO
): Promise<void> {
  const payload: {
    updated_at: string
    english?: string
    uzbek?: string
    phonetic?: string
    example?: string
    category?: string
    level?: string
  } = { updated_at: new Date().toISOString() }
  if (updates.english !== undefined) payload.english = updates.english
  if (updates.uzbek !== undefined) payload.uzbek = updates.uzbek
  if (updates.phonetic !== undefined) payload.phonetic = updates.phonetic
  if (updates.example !== undefined) payload.example = updates.example
  if (updates.category !== undefined) payload.category = updates.category
  if (updates.level !== undefined) payload.level = updates.level

  const { error } = await supabase
    .from('personal_vocabulary')
    .update(payload)
    .eq('user_id', userId)
    .eq('id', wordId)

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
  const { error } = await supabase
    .from('personal_vocabulary')
    .delete()
    .eq('user_id', userId)
    .eq('id', wordId)

  if (error) {
    monitoring.captureMessage('deletePersonalWordFromDB error: ' + (error instanceof Error ? error.message : String(error)), 'error')
    useToastStore.getState().toast("So'zni o'chirishda xatolik", 'error')
    throw error instanceof Error ? error : new Error(String(error))
  }
}

export async function fetchPersonalWordsFromDB(userId: string): Promise<PersonalWord[]> {
  const { data, error } = await supabase
    .from('personal_vocabulary')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) {
    monitoring.captureMessage('fetchPersonalWordsFromDB error: ' + (error instanceof Error ? error.message : String(error)), 'error')
    return []
  }

  return (data ?? []) as PersonalWord[]
}

export async function fetchWordsForReviewFromDB(userId: string): Promise<PersonalWord[]> {
  // Tashkent vaqti bilan (next_review ham Tashkent sanasi bilan o'rnatiladi) —
  // aks holda yarim tunda off-by-one bo'lardi.
  const today = getTodayTashkent()

  const { data, error } = await supabase
    .from('personal_vocabulary')
    .select('*')
    .eq('user_id', userId)
    .eq('is_learned', false)
    .lte('next_review', today)
    .order('next_review', { ascending: true })

  if (error) {
    monitoring.captureMessage('fetchWordsForReviewFromDB error: ' + (error instanceof Error ? error.message : String(error)), 'error')
    return []
  }

  return (data ?? []) as PersonalWord[]
}

export async function ratePersonalWordInDB(
  userId: string,
  wordId: number,
  rating: VocabRating
): Promise<PersonalWord> {
  requireAuthedUser(userId)
  // Compute FSRS client-side (our TypeScript algorithm)
  const { data: existing, error: fetchError } = await supabase
    .from('personal_vocabulary')
    .select('fsrs_stability, fsrs_difficulty, next_review, fsrs_reps, fsrs_lapses')
    .eq('user_id', userId)
    .eq('id', wordId)
    .single()

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
  const { data, error } = await supabase.rpc('rate_personal_vocab_word', {
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

  return db.cast<PersonalWord>(data)
}

export async function batchAddPersonalWordsToDB(
  userId: string,
  wordsData: AddWordDTO[]
): Promise<PersonalWord[]> {
  if (wordsData.length === 0) return []
  requireAuthedUser(userId)

  // Filter out duplicates: fetch existing words for this user
  const { data: existing } = await supabase
    .from('personal_vocabulary')
    .select('english')
    .eq('user_id', userId)
  const existingSet = new Set((existing ?? []).map(e => e.english.toLowerCase().trim()))
  const uniqueWords = wordsData.filter(w => !existingSet.has(w.english.toLowerCase().trim()))

  if (uniqueWords.length === 0) {
    useToastStore.getState().toast("Barcha so'zlar allaqachon qo'shilgan", 'warning')
    return []
  }

  if (uniqueWords.length < wordsData.length) {
    useToastStore.getState().toast(`${wordsData.length - uniqueWords.length} ta dublikat o'tkazib yuborildi`, 'warning')
  }

  const now = new Date().toISOString()
  const wordsToInsert = uniqueWords
  const defaultFSRS = createDefaultFSRSState()
  const rows = wordsToInsert.map((w) => ({
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
    part_of_speech: w.part_of_speech || null,
  }))

  const { data, error } = await supabase
    .from('personal_vocabulary')
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    .insert(rows as any)
    .select()

  if (error) {
    monitoring.captureMessage('batchAddPersonalWordsToDB error: ' + (error instanceof Error ? error.message : String(error)), 'error')
    useToastStore.getState().toast("So'zlarni qo'shishda xatolik", 'error')
    throw error instanceof Error ? error : new Error(String(error))
  }

  return (data ?? []) as PersonalWord[]
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
    import('../utils/toastStore').then(({ useToastStore }) => {
      useToastStore.getState().toast('AI tarjima yuklanmadi — qayta urinib ko\'ring', 'warning', 4000)
    }).catch(() => {})
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
    part_of_speech: w.part_of_speech,
    category: w.category,
    level: w.level,
  }))
  return JSON.stringify(exportData, null, 2)
}

export function importPersonalVocabulary(jsonString: string): AddWordDTO[] {
  try {
    const data = JSON.parse(jsonString)
    if (!Array.isArray(data)) throw new Error('Invalid format')
    return data
      .map((item: Record<string, unknown>) => ({
        english: String(item.english || '').trim(),
        uzbek: String(item.uzbek || '').trim(),
        phonetic: item.phonetic ? String(item.phonetic) : undefined,
        example: item.example ? String(item.example) : undefined,
        part_of_speech: (item.part_of_speech as PartOfSpeech) || undefined,
        category: (item.category as AddWordDTO['category']) || 'custom',
        level: (item.level as AddWordDTO['level']) || 'A2',
        source: 'imported' as const,
      }))
      // Bo'sh english/uzbek bo'lgan yozuvlarni o'tkazib yuboramiz
      .filter((w) => w.english.length > 0 && w.uzbek.length > 0)
  } catch (e) {
    monitoring.captureMessage('importPersonalVocabulary error: ' + (e instanceof Error ? e.message : String(e)), 'error')
    return []
  }
}
