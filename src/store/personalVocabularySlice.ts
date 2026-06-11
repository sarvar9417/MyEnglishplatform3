import type { StateCreator } from 'zustand'
import { monitoring } from '../lib/monitoring'
import type { PersonalWord, AddWordDTO, UpdateWordDTO, VocabRating } from '../types/personalVocabulary'
import type { AppState } from './appState'

// ═══════════════════════════════════════════════════════════════════════════
// Personal Vocabulary Slice
// ═══════════════════════════════════════════════════════════════════════════

export interface PersonalVocabularySlice {
  // State
  personalWords: PersonalWord[]
  personalWordsLoading: boolean
  personalWordsFetched: boolean
  
  // Actions
  setPersonalWords: (words: PersonalWord[]) => void
  addPersonalWord: (wordData: AddWordDTO, userId?: string) => Promise<void>
  batchAddPersonalWords: (wordsData: AddWordDTO[], userId?: string) => Promise<void>
  updatePersonalWord: (id: number, updates: UpdateWordDTO, userId?: string) => Promise<void>
  deletePersonalWord: (id: number, userId?: string) => Promise<void>
  ratePersonalWord: (id: number, rating: VocabRating, userId?: string) => Promise<void>
  fetchPersonalWords: (userId: string) => Promise<void>
  fetchWordsForReview: (userId: string) => Promise<PersonalWord[]>
  clearPersonalVocabulary: () => void
}

export const createPersonalVocabularySlice: StateCreator<AppState, [], [], PersonalVocabularySlice> = (set) => ({
  // Initial state
  personalWords: [],
  personalWordsLoading: false,
  personalWordsFetched: false,

  setPersonalWords: (words) => set({ personalWords: words }),

  batchAddPersonalWords: async (wordsData, userId = 'guest') => {
    set({ personalWordsLoading: true })
    try {
      const { batchAddPersonalWordsToDB } = await import('../services/personalVocabularyService')
      const newWords = await batchAddPersonalWordsToDB(userId, wordsData)
      set((s) => ({
        personalWords: [...s.personalWords, ...newWords],
        personalWordsLoading: false,
      }))
    } catch (e) {
      monitoring.captureMessage(`batchAddPersonalWords error: ${e instanceof Error ? e.message : String(e)}`, 'error')
      set({ personalWordsLoading: false })
    }
  },

  addPersonalWord: async (wordData, userId = 'guest') => {
    set({ personalWordsLoading: true })
    try {
      const { addPersonalWordToDB } = await import('../services/personalVocabularyService')
      const newWord = await addPersonalWordToDB(userId, wordData)
      set((s) => ({
        personalWords: [...s.personalWords, newWord],
        personalWordsLoading: false,
      }))
    } catch (e) {
      monitoring.captureMessage(`addPersonalWord error: ${e instanceof Error ? e.message : String(e)}`, 'error')
      set({ personalWordsLoading: false })
    }
  },

  updatePersonalWord: async (id, updates, userId = 'guest') => {
    try {
      const { updatePersonalWordInDB } = await import('../services/personalVocabularyService')
      await updatePersonalWordInDB(userId, id, updates)
      set((s) => ({
        personalWords: s.personalWords.map((w) =>
          w.id === id ? { ...w, ...updates, updated_at: new Date().toISOString() } : w
        ),
      }))
    } catch (e) {
      monitoring.captureMessage(`updatePersonalWord error: ${e instanceof Error ? e.message : String(e)}`, 'error')
    }
  },

  deletePersonalWord: async (id, userId = 'guest') => {
    try {
      const { deletePersonalWordFromDB } = await import('../services/personalVocabularyService')
      await deletePersonalWordFromDB(userId, id)
      set((s) => ({
        personalWords: s.personalWords.filter((w) => w.id !== id),
      }))
    } catch (e) {
      monitoring.captureMessage(`deletePersonalWord error: ${e instanceof Error ? e.message : String(e)}`, 'error')
    }
  },

  ratePersonalWord: async (id, rating, userId = 'guest') => {
    try {
      const { ratePersonalWordInDB } = await import('../services/personalVocabularyService')
      const updated = await ratePersonalWordInDB(userId, id, rating)
      set((s) => ({
        personalWords: s.personalWords.map((w) => (w.id === id ? updated : w)),
      }))
    } catch (e) {
      monitoring.captureMessage(`ratePersonalWord error: ${e instanceof Error ? e.message : String(e)}`, 'error')
    }
  },

  fetchPersonalWords: async (userId) => {
    set({ personalWordsLoading: true, personalWordsFetched: false })
    try {
      const { fetchPersonalWordsFromDB } = await import('../services/personalVocabularyService')
      const words = await fetchPersonalWordsFromDB(userId)
      set({ personalWords: words, personalWordsLoading: false, personalWordsFetched: true })
    } catch (e) {
      monitoring.captureMessage(`fetchPersonalWords error: ${e instanceof Error ? e.message : String(e)}`, 'error')
      set({ personalWordsLoading: false, personalWordsFetched: true })
    }
  },

  fetchWordsForReview: async (userId) => {
    try {
      const { fetchWordsForReviewFromDB } = await import('../services/personalVocabularyService')
      return await fetchWordsForReviewFromDB(userId)
    } catch (e) {
      monitoring.captureMessage(`fetchWordsForReview error: ${e instanceof Error ? e.message : String(e)}`, 'error')
      return []
    }
  },

  clearPersonalVocabulary: () => set({ personalWords: [], personalWordsFetched: false }),
})
