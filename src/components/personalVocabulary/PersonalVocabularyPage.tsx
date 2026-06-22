import { useState, useEffect, useRef, useMemo } from 'react'
import { useStore } from '../../store/useStore'
import { useI18n } from '../../i18n'
import { exportPersonalVocabulary, importPersonalVocabulary, generateAITranslation } from '../../services/personalVocabularyService'
import { supabase } from '../../lib/supabase'
import { getTodayTashkent } from '../../utils/tashkentDate'
import { useToastStore } from '../../utils/toastStore'
import type { PersonalWord, AddWordDTO, UpdateWordDTO } from '../../types/personalVocabulary'
import type { VocabRating } from '../../types/personalVocabulary'
import { Plus, Search, Download, Upload, Play, BookOpen, Filter, Loader2, ChevronLeft, ChevronRight } from 'lucide-react'
import AddWordForm from './AddWordForm'
import WordList from './WordList'
import FlashCardTest from './FlashCardTest'

type ViewMode = 'list' | 'add' | 'test'

const PAGE_SIZE = 20

let cachedUserId: string | null = null
async function getUserId(): Promise<string> {
  if (cachedUserId) return cachedUserId
  const { data: { session } } = await supabase.auth.getSession()
  cachedUserId = session?.user?.id ?? 'guest'
  return cachedUserId
}

function LoadingSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm animate-pulse">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 space-y-2">
              <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              <div className="flex gap-2 mt-2">
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-12" />
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-16" />
                <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded-full w-20" />
              </div>
            </div>
            <div className="flex flex-col gap-1 shrink-0">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-8" />
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded-lg w-8" />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function PersonalVocabularyPage() {
  const { t } = useI18n()
  const { personalWords, personalWordsFetched, deletePersonalWord, ratePersonalWord, updatePersonalWord, fetchPersonalWords, batchAddPersonalWords } = useStore()
  
  const [viewMode, setViewMode] = useState<ViewMode>('list')
  const [searchQuery, setSearchQuery] = useState('')
  const [filterCategory, setFilterCategory] = useState<string>('all')
  const [filterLevel, setFilterLevel] = useState<string>('all')
  const [showDueOnly, setShowDueOnly] = useState(false)
  const [loading, setLoading] = useState(false)
  const [importLoading, setImportLoading] = useState(false)
  const [testWords, setTestWords] = useState<PersonalWord[]>([])
  const [editingWord, setEditingWord] = useState<PersonalWord | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const mountedRef = useRef(true)

  // Fetch words on mount
  useEffect(() => {
    mountedRef.current = true
    if (!personalWordsFetched) {
      setLoading(true)
      getUserId().then((userId) => {
        if (mountedRef.current) fetchPersonalWords(userId).finally(() => {
          if (mountedRef.current) setLoading(false)
        })
      })
    }
    return () => { mountedRef.current = false }
  }, [personalWordsFetched, fetchPersonalWords])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, filterCategory, filterLevel, showDueOnly])

  // Filter words
  const filteredWords = useMemo(() => personalWords.filter((w) => {
    const matchesSearch = w.english.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         w.uzbek.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = filterCategory === 'all' || w.category === filterCategory
    const matchesLevel = filterLevel === 'all' || w.level === filterLevel
    const matchesDue = !showDueOnly || !w.is_learned && w.next_review <= getTodayTashkent()
    return matchesSearch && matchesCategory && matchesLevel && matchesDue
  }), [personalWords, searchQuery, filterCategory, filterLevel, showDueOnly])

  // Pagination
  const totalPages = Math.ceil(filteredWords.length / PAGE_SIZE)
  const paginatedWords = useMemo(() => {
    const start = (currentPage - 1) * PAGE_SIZE
    return filteredWords.slice(start, start + PAGE_SIZE)
  }, [filteredWords, currentPage])

  // Stats
  const totalWords = personalWords.length
  const learnedWords = personalWords.filter(w => w.is_learned).length
  const dueWords = personalWords.filter(w => !w.is_learned && w.next_review <= getTodayTashkent()).length

  const handleAddWord = async (wordData: AddWordDTO) => {
    const userId = await getUserId()
    if (editingWord) {
      try {
        await updatePersonalWord(editingWord.id, wordData as UpdateWordDTO, userId)
        useToastStore.getState().toast("So'z yangilandi", 'success')
      } catch {
        useToastStore.getState().toast("So'zni yangilashda xatolik", 'error')
        return
      }
    } else {
      await useStore.getState().addPersonalWord(wordData, userId)
      useToastStore.getState().toast("So'z qo'shildi", 'success')
    }
    setEditingWord(null)
    setViewMode('list')
  }

  const handleEditWord = (word: PersonalWord) => {
    setEditingWord(word)
    setViewMode('add')
  }

  const handleDeleteWord = async (id: number) => {
    const userId = await getUserId()
    await deletePersonalWord(id, userId)
    useToastStore.getState().toast("So'z o'chirildi", 'info')
  }

  const handleRateWord = async (id: number, rating: VocabRating) => {
    const userId = await getUserId()
    await ratePersonalWord(id, rating, userId)
  }

  const handleStartTest = () => {
    const today = getTodayTashkent()
    const due = personalWords.filter(w => !w.is_learned && w.next_review <= today)
    const wordsToTest = due.length > 0 ? due : personalWords.slice(0, 10)
    setTestWords(wordsToTest)
    setViewMode('test')
  }

  const handleExport = () => {
    const json = exportPersonalVocabulary(personalWords)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `personal-vocabulary-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setImportLoading(true)
    try {
      const text = await file.text()
      const words = importPersonalVocabulary(text)
      if (words.length === 0) {
        useToastStore.getState().toast("Noto'g'ri fayl formati", 'error')
        return
      }
      const userId = await getUserId()
      await batchAddPersonalWords(words, userId)
      useToastStore.getState().toast(`${words.length} ta so'z import qilindi`, 'success')
    } finally {
      setImportLoading(false)
      e.target.value = ''
    }
  }

  const handleAITranslation = async (word: string) => {
    return await generateAITranslation(word)
  }

  if (viewMode === 'test') {
    return (
      <FlashCardTest
        words={testWords}
        onComplete={(results) => {
          results.forEach((r) => {
            if (r.result === 'correct' && r.rating) {
              handleRateWord(r.vocabId, r.rating as VocabRating)
            } else if (r.result === 'correct') {
              handleRateWord(r.vocabId, 'bildim')
            } else {
              handleRateWord(r.vocabId, 'bilmadim')
            }
          })
          setViewMode('list')
        }}
        onExit={() => setViewMode('list')}
      />
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
            {t('personalVocab.title') || 'Shaxsiy Lug\'atim'}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            {t('personalVocab.subtitle') || 'O\'zingiz uchun shaxsiy lug\'at yarating'}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
          >
            <Download size={16} />
            <span className="hidden sm:inline">{t('personalVocab.export') || 'Export'}</span>
          </button>
          <label className={`flex items-center gap-1 px-3 py-2 rounded-lg bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 cursor-pointer ${importLoading ? 'opacity-50 pointer-events-none' : ''}`}>
            {importLoading ? <Loader2 size={16} className="animate-spin" /> : <Upload size={16} />}
            <span className="hidden sm:inline">{importLoading ? 'Import qilinmoqda...' : (t('personalVocab.import') || 'Import')}</span>
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-primary-600">{totalWords}</div>
          <div className="text-xs text-gray-500">{t('personalVocab.totalWords') || 'Jami so\'zlar'}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-green-600">{learnedWords}</div>
          <div className="text-xs text-gray-500">{t('personalVocab.learned') || 'O\'rganilgan'}</div>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm">
          <div className="text-2xl font-bold text-orange-600">{dueWords}</div>
          <div className="text-xs text-gray-500">{t('personalVocab.due') || 'Takrorlash vaqti'}</div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => { setEditingWord(null); setViewMode('add') }}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 shadow-sm"
        >
          <Plus size={18} />
          {t('personalVocab.addWord') || 'So\'z qo\'shish'}
        </button>
        <button
          onClick={handleStartTest}
          disabled={personalWords.length === 0}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-b2-500 text-white font-medium hover:bg-b2-600 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Play size={18} />
          {t('personalVocab.startTest') || 'Flash card testi'}
        </button>
      </div>

      {/* Search & Filters */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[200px]">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t('personalVocab.searchPlaceholder') || 'So\'z qidirish...'}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          />
        </div>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
        >
          <option value="all">{t('personalVocab.allCategories') || 'Barcha kategoriyalar'}</option>
          <option value="custom">Shaxsiy</option>
          <option value="grammar">Grammar</option>
          <option value="travel">Travel</option>
          <option value="formal">Formal</option>
          <option value="ielts">IELTS</option>
          <option value="business">Business</option>
          <option value="food">Food</option>
          <option value="health">Health</option>
          <option value="education">Education</option>
          <option value="social">Social</option>
          <option value="work">Work</option>
          <option value="shopping">Shopping</option>
          <option value="relationships">Relationships</option>
          <option value="environment">Environment</option>
          <option value="economy">Economy</option>
          <option value="culture">Culture</option>
          <option value="feelings">Feelings</option>
          <option value="discussion">Discussion</option>
          <option value="technology">Technology</option>
          <option value="communication">Communication</option>
        </select>
        <select
          value={filterLevel}
          onChange={(e) => setFilterLevel(e.target.value)}
          className="px-3 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
        >
          <option value="all">{t('personalVocab.allLevels') || 'Barcha darajalar'}</option>
          <option value="A1">A1</option>
          <option value="A2">A2</option>
          <option value="B1">B1</option>
          <option value="B2">B2</option>
        </select>
        <button
          onClick={() => setShowDueOnly(!showDueOnly)}
          className={`flex items-center gap-1 px-3 py-2.5 rounded-xl border ${
            showDueOnly
              ? 'bg-orange-100 dark:bg-orange-900/30 border-orange-300 text-orange-700 dark:text-orange-300'
              : 'border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300'
          }`}
        >
          <Filter size={16} />
          {t('personalVocab.dueOnly') || 'Faqat takrorlash'}
        </button>
      </div>

      {/* Content */}
      {viewMode === 'add' && (
        <AddWordForm
          onAdd={handleAddWord}
          onCancel={() => { setEditingWord(null); setViewMode('list') }}
          onAITranslate={handleAITranslation}
          editWord={editingWord}
        />
      )}

      {loading ? (
        <LoadingSkeleton />
      ) : filteredWords.length > 0 ? (
        <>
          <WordList
            words={paginatedWords}
            onDelete={handleDeleteWord}
            onRate={handleRateWord}
            onEdit={handleEditWord}
          />
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-gray-500">
                {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredWords.length)} / {filteredWords.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400"
                >
                  <ChevronLeft size={18} />
                </button>
                {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
                  let page: number
                  if (totalPages <= 7) {
                    page = i + 1
                  } else if (currentPage <= 4) {
                    page = i + 1
                  } else if (currentPage >= totalPages - 3) {
                    page = totalPages - 6 + i
                  } else {
                    page = currentPage - 3 + i
                  }
                  return (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-colors ${
                        page === currentPage
                          ? 'bg-primary-500 text-white'
                          : 'hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400'
                      }`}
                    >
                      {page}
                    </button>
                  )
                })}
                <button
                  onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12">
          <BookOpen size={48} className="mx-auto text-gray-300 mb-4" />
          <p className="text-gray-500">
            {searchQuery || filterCategory !== 'all' || filterLevel !== 'all'
              ? t('personalVocab.noResults') || 'Hech narsa topilmadi'
              : t('personalVocab.emptyState') || 'Hali so\'zlar qo\'shilmagan. Birinchi so\'zingizni qo\'shing!'}
          </p>
        </div>
      )}
    </div>
  )
}
