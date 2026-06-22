import { useState } from 'react'
import type { AddWordDTO, VocabCategory, PartOfSpeech } from '../../types/personalVocabulary'
import { Sparkles, Loader2 } from 'lucide-react'
import { monitoring } from '../../lib/monitoring'

interface AddWordFormProps {
  onAdd: (wordData: AddWordDTO) => Promise<void>
  onCancel: () => void
  onAITranslate: (word: string, context?: string) => Promise<{ uzbek: string; phonetic?: string; example?: string; level?: 'A1' | 'A2' | 'B1' | 'B2'; category?: string; part_of_speech?: string }>
  editWord?: { english: string; uzbek: string; phonetic?: string; example?: string; category: VocabCategory; level: 'A1' | 'A2' | 'B1' | 'B2'; part_of_speech?: PartOfSpeech } | null
}

const CATEGORIES: { value: VocabCategory; label: string }[] = [
  { value: 'custom', label: 'Shaxsiy' },
  { value: 'grammar', label: 'Grammar' },
  { value: 'travel', label: 'Travel' },
  { value: 'formal', label: 'Formal' },
  { value: 'ielts', label: 'IELTS' },
  { value: 'business', label: 'Business' },
  { value: 'food', label: 'Food' },
  { value: 'health', label: 'Health' },
  { value: 'education', label: 'Education' },
  { value: 'social', label: 'Social' },
  { value: 'work', label: 'Work' },
  { value: 'shopping', label: 'Shopping' },
  { value: 'relationships', label: 'Relationships' },
  { value: 'environment', label: 'Environment' },
  { value: 'economy', label: 'Economy' },
  { value: 'culture', label: 'Culture' },
  { value: 'feelings', label: 'Feelings' },
  { value: 'discussion', label: 'Discussion' },
  { value: 'technology', label: 'Technology' },
  { value: 'communication', label: 'Communication' },
]

const VALID_CATEGORIES = new Set(CATEGORIES.map(c => c.value))

const LEVELS = [
  { value: 'A1', label: 'A1' },
  { value: 'A2', label: 'A2' },
  { value: 'B1', label: 'B1' },
  { value: 'B2', label: 'B2' },
]

const VALID_LEVELS = new Set(['A1', 'A2', 'B1', 'B2'])

const PARTS_OF_SPEECH: { value: PartOfSpeech; label: string }[] = [
  { value: 'noun', label: 'Ot (Noun)' },
  { value: 'verb', label: "Fe'l (Verb)" },
  { value: 'adjective', label: 'Sifat (Adjective)' },
  { value: 'adverb', label: 'Ravish (Adverb)' },
  { value: 'preposition', label: 'Predlog (Preposition)' },
  { value: 'conjunction', label: "Bog'lovchi (Conjunction)" },
  { value: 'pronoun', label: "O'zlik (Pronoun)" },
  { value: 'interjection', label: 'Undov (Interjection)' },
  { value: 'other', label: 'Boshqa (Other)' },
]

const VALID_POS = new Set(PARTS_OF_SPEECH.map(p => p.value))

export default function AddWordForm({ onAdd, onCancel, onAITranslate, editWord }: AddWordFormProps) {
  const [english, setEnglish] = useState(editWord?.english || '')
  const [uzbek, setUzbek] = useState(editWord?.uzbek || '')
  const [phonetic, setPhonetic] = useState(editWord?.phonetic || '')
  const [example, setExample] = useState(editWord?.example || '')
  const [category, setCategory] = useState<VocabCategory>(editWord?.category || 'custom')
  const [level, setLevel] = useState<'A1' | 'A2' | 'B1' | 'B2'>(editWord?.level || 'A2')
  const [partOfSpeech, setPartOfSpeech] = useState<PartOfSpeech>(editWord?.part_of_speech || 'other')
  const [aiLoading, setAiLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  const isEditing = !!editWord

  const handleAITranslate = async () => {
    if (!english.trim()) return
    setAiLoading(true)
    try {
      const result = await onAITranslate(english)
      if (result.uzbek && !uzbek) setUzbek(result.uzbek)
      if (result.phonetic && !phonetic) setPhonetic(result.phonetic)
      if (result.example && !example) setExample(result.example)
      if (result.level && VALID_LEVELS.has(result.level)) setLevel(result.level)
      if (result.category && VALID_CATEGORIES.has(result.category as VocabCategory)) setCategory(result.category as VocabCategory)
      if (result.part_of_speech && VALID_POS.has(result.part_of_speech as PartOfSpeech)) setPartOfSpeech(result.part_of_speech as PartOfSpeech)
    } catch (e) {
      monitoring.captureMessage('AI translation failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    } finally {
      setAiLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!english.trim() || !uzbek.trim()) return
    setSubmitting(true)
    try {
      await onAdd({
        english: english.trim(),
        uzbek: uzbek.trim(),
        phonetic: phonetic.trim() || undefined,
        example: example.trim() || undefined,
        category,
        level,
        part_of_speech: partOfSpeech,
        source: 'manual',
      })
    } catch (e) {
      monitoring.captureMessage('Add word failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm space-y-4">
      <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
        {isEditing ? "So'zni tahrirlash" : "Yangi so'z qo'shish"}
      </h3>

      {/* English Word */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Inglizcha so'z *
        </label>
        <div className="flex gap-2">
          <input
            type="text"
            value={english}
            onChange={(e) => setEnglish(e.target.value)}
            placeholder="Masalan: serendipity"
            className="flex-1 px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            required
          />
          <button
            type="button"
            onClick={handleAITranslate}
            disabled={aiLoading || !english.trim()}
            className="flex items-center gap-1 px-4 py-2.5 rounded-xl bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 hover:bg-purple-200 dark:hover:bg-purple-900/50 disabled:opacity-50"
          >
            {aiLoading ? <Loader2 size={18} className="animate-spin" /> : <Sparkles size={18} />}
            <span className="hidden sm:inline">AI</span>
          </button>
        </div>
      </div>

      {/* Uzbek Translation */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          O'zbekcha tarjima *
        </label>
        <input
          type="text"
          value={uzbek}
          onChange={(e) => setUzbek(e.target.value)}
          placeholder="Masalan: kutilmagan baxt"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          required
        />
      </div>

      {/* Phonetic */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Fonetik (ixtiyoriy)
        </label>
        <input
          type="text"
          value={phonetic}
          onChange={(e) => setPhonetic(e.target.value)}
          placeholder="Masalan: /ˌserənˈdɪpəti/"
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Example */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Misol (ixtiyoriy)
        </label>
        <input
          type="text"
          value={example}
          onChange={(e) => setExample(e.target.value)}
          placeholder="Masalan: Finding that rare book in the bookstore was a moment of serendipity."
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
      </div>

      {/* Category & Level */}
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Kategoriya
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as VocabCategory)}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Daraja
          </label>
          <select
            value={level}
            onChange={(e) => setLevel(e.target.value as 'A1' | 'A2' | 'B1' | 'B2')}
            className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {LEVELS.map((lvl) => (
              <option key={lvl.value} value={lvl.value}>{lvl.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Part of Speech */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          So'z turi (ixtiyoriy)
        </label>
        <select
          value={partOfSpeech}
          onChange={(e) => setPartOfSpeech(e.target.value as PartOfSpeech)}
          className="w-full px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        >
          {PARTS_OF_SPEECH.map((pos) => (
            <option key={pos.value} value={pos.value}>{pos.label}</option>
          ))}
        </select>
      </div>

      {/* Actions */}
      <div className="flex gap-3 pt-2">
        <button
          type="submit"
          disabled={submitting || !english.trim() || !uzbek.trim()}
          className="flex-1 px-4 py-2.5 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {submitting ? 'Saqlanmoqda...' : (isEditing ? "Saqlash" : "So'zni qo'shish")}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
        >
          Bekor qilish
        </button>
      </div>
    </form>
  )
}
