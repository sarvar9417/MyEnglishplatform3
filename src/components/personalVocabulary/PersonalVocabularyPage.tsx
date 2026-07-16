import { useState, useEffect, useRef, useMemo } from 'react'
import { useStore } from '../../store/useStore'
import { useI18n } from '../../i18n'
import { exportPersonalVocabulary, importPersonalVocabulary, generateAITranslation } from '../../services/personalVocabularyService'
import { supabase } from '../../lib/supabase'
import { getTodayTashkent } from '../../utils/tashkentDate'
import { useToastStore } from '../../utils/toastStore'
import type { PersonalWord, AddWordDTO, UpdateWordDTO } from '../../types/personalVocabulary'
import type { VocabRating } from '../../types/personalVocabulary'
import { 
  Plus, Search, Download, Upload, Play, BookOpen, Filter, Loader2, 
  ChevronLeft, ChevronRight, LayoutGrid, List, ArrowUpDown, 
  BookMarked, Brain, Trophy, GraduationCap, X as XIcon,
  Clock, BarChart3
} from 'lucide-react'
import AddWordForm from './AddWordForm'
import WordList from './WordList'
import FlashCardTest from './FlashCardTest'

type ViewMode = 'list' | 'add' | 'test'
type SortField = 'created_at' | 'english' | 'next_review' | 'level' | 'box'
type SortDirection = 'asc' | 'desc'
type ListLayout = 'list' | 'grid'

const PAGE_SIZE = 20

const CATEGORIES = [
  { value: 'all', label: 'Barcha kategoriyalar' },
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

const LEVEL_TAGS = [
  { value: 'all', label: 'Barcha' },
  { value: 'A1', label: 'A1' },
  { value: 'A2', label: 'A2' },
  { value: 'B1', label: 'B1' },
  { value: 'B2', label: 'B2' },
]

const SORT_OPTIONS: { value: SortField; label: string }[] = [
  { value: 'created_at', label: 'Qo\'shilgan sana' },
  { value: 'english', label: 'Alifbo' },
  { value: 'next_review', label: 'Takrorlash vaqti' },
  { value: 'level', label: 'Daraja' },
  { value: 'box', label: 'Box' },
]

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
        <div key={i} className="bg-white dark:bg-gray-800/90 rounded-xl p-4 shadow-sm animate-pulse border border-gray-100 dark:border-gray-700/50">
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
  const [sortField, setSortField] = useState<SortField>('created_at')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [layout, setLayout] = useState<ListLayout>('list')
  const [loading, setLoading] = useState(false)
  const [importLoading, setImportLoading] = useState(false)
  const [testWords, setTestWords] = useState<PersonalWord[]>([])
  const [editingWord, setEditingWord] = useState<PersonalWord | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
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
  }, [searchQuery, filterCategory, filterLevel, showDueOnly, sortField, sortDirection])

  // Filter and sort words
  const filteredWords = useMemo(() => {
    let result = personalWords.filter((w) => {
      const q = searchQuery.toLowerCase()
      const matchesSearch = !q || w.english.toLowerCase().includes(q) || w.uzbek.toLowerCase().includes(q)
      const matchesCategory = filterCategory === 'all' || w.category === filterCategory
      const matchesLevel = filterLevel === 'all' || w.level === filterLevel
      const matchesDue = !showDueOnly || (!w.is_learned && w.next_review <= getTodayTashkent())
      return matchesSearch && matchesCategory && matchesLevel && matchesDue
    })

    result.sort((a, b) => {
      let cmp = 0
      switch (sortField) {
        case 'english':
          cmp = a.english.localeCompare(b.english)
          break
        case 'next_review':
          cmp = a.next_review.localeCompare(b.next_review)
          break
        case 'level':
          cmp = a.level.localeCompare(b.level)
          break
        case 'box':
          cmp = a.box - b.box
          break
        case 'created_at':
        default:
          cmp = new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
          break
      }
      return sortDirection === 'desc' ? -cmp : cmp
    })

    return result
  }, [personalWords, searchQuery, filterCategory, filterLevel, showDueOnly, sortField, sortDirection])

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
  const learningProgress = totalWords > 0 ? Math.round((learnedWords / totalWords) * 100) : 0
  const masteredWords = personalWords.filter(w => w.box >= 5 && w.is_learned).length

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

  const handleAITranslation = async (word: string, context?: string) => {
    return await generateAITranslation(word, context)
  }

  const toggleSortDirection = () => {
    setSortDirection(d => d === 'asc' ? 'desc' : 'asc')
  }

  const clearAllFilters = () => {
    setSearchQuery('')
    setFilterCategory('all')
    setFilterLevel('all')
    setShowDueOnly(false)
  }

  const hasActiveFilters = searchQuery || filterCategory !== 'all' || filterLevel !== 'all' || showDueOnly

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
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <BookMarked size={24} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {t('personalVocab.title') || "Shaxsiy Lug'atim"}
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {t('personalVocab.subtitle') || "O'zingiz uchun shaxsiy lug'at yarating"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExport}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all text-sm font-medium shadow-sm"
          >
            <Download size={15} />
            <span className="hidden sm:inline">{t('personalVocab.export') || 'Export'}</span>
          </button>
          <label className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:border-gray-300 dark:hover:border-gray-600 transition-all text-sm font-medium cursor-pointer shadow-sm ${importLoading ? 'opacity-50 pointer-events-none' : ''}`}>
            {importLoading ? <Loader2 size={15} className="animate-spin" /> : <Upload size={15} />}
            <span className="hidden sm:inline">{importLoading ? 'Import qilinmoqda...' : (t('personalVocab.import') || 'Import')}</span>
            <input type="file" accept=".json" className="hidden" onChange={handleImport} />
          </label>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        <div className="bg-white dark:bg-gray-800/90 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary-50 dark:bg-primary-900/20 flex items-center justify-center">
              <BookMarked size={18} className="text-primary-600 dark:text-primary-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{totalWords}</div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('personalVocab.totalWords') || "Jami so'zlar"}</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800/90 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 dark:bg-green-900/20 flex items-center justify-center">
              <Trophy size={18} className="text-green-600 dark:text-green-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{learnedWords}</div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('personalVocab.learned') || "O'rganilgan"}</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800/90 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-50 dark:bg-orange-900/20 flex items-center justify-center">
              <Brain size={18} className="text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{dueWords}</div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">{t('personalVocab.due') || 'Takrorlash vaqti'}</div>
            </div>
          </div>
        </div>
        <div className="bg-white dark:bg-gray-800/90 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-violet-50 dark:bg-violet-900/20 flex items-center justify-center">
              <GraduationCap size={18} className="text-violet-600 dark:text-violet-400" />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-900 dark:text-gray-100">{masteredWords}</div>
              <div className="text-[11px] text-gray-500 dark:text-gray-400 uppercase tracking-wider">O'zlashtirilgan</div>
            </div>
          </div>
        </div>
      </div>

      {/* Learning Progress Bar */}
      {totalWords > 0 && (
        <div className="bg-white dark:bg-gray-800/90 rounded-xl p-4 shadow-sm border border-gray-100 dark:border-gray-700/50">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <BarChart3 size={15} className="text-gray-400" />
              <span className="text-xs font-medium text-gray-600 dark:text-gray-400 uppercase tracking-wider">O'rganish jarayoni</span>
            </div>
            <span className="text-xs font-bold text-primary-600 dark:text-primary-400">{learningProgress}%</span>
          </div>
          <div className="w-full h-2.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-primary-500 to-primary-400 rounded-full transition-all duration-700 ease-out" style={{ width: `${learningProgress}%` }} />
          </div>
          <div className="flex justify-between mt-1.5 text-[10px] text-gray-400 dark:text-gray-500">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-3">
        <button
          onClick={() => { setEditingWord(null); setViewMode('add') }}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/20 hover:shadow-primary-500/30 transition-all active:scale-[0.98]"
        >
          <Plus size={18} />
          {t('personalVocab.addWord') || "So'z qo'shish"}
        </button>
        <button
          onClick={handleStartTest}
          disabled={personalWords.length === 0}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-b2-500 to-b2-600 text-white font-medium hover:from-b2-600 hover:to-b2-700 shadow-lg shadow-b2-500/20 hover:shadow-b2-500/30 transition-all disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
        >
          <Play size={18} />
          {t('personalVocab.startTest') || 'Flash card testi'}
        </button>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all text-sm font-medium ${
            showFilters || hasActiveFilters
              ? 'bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-800 text-primary-700 dark:text-primary-300'
              : 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'
          }`}
        >
          <Filter size={16} />
          Filtrlar
          {hasActiveFilters && (
            <span className="w-2 h-2 rounded-full bg-primary-500" />
          )}
        </button>
      </div>

      {/* Search & Filters Panel */}
      <div className={`space-y-3 overflow-hidden transition-all duration-300 ${showFilters || hasActiveFilters ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'}`}>
        {/* Search */}
        <div className="relative flex-1 min-w-0">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t('personalVocab.searchPlaceholder') || "So'z qidirish..."}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/90 text-gray-800 dark:text-gray-200 focus:ring-2 focus:ring-primary-500 focus:border-transparent text-sm placeholder:text-gray-400 dark:placeholder:text-gray-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <XIcon size={16} />
            </button>
          )}
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Level Tags */}
          <div className="flex items-center gap-1">
            {LEVEL_TAGS.map((lvl) => (
              <button
                key={lvl.value}
                onClick={() => setFilterLevel(lvl.value)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                  filterLevel === lvl.value
                    ? 'bg-primary-500 text-white shadow-sm'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {lvl.label}
              </button>
            ))}
          </div>

          <div className="w-px h-6 bg-gray-200 dark:bg-gray-700" />

          {/* Due Only Toggle */}
          <button
            onClick={() => setShowDueOnly(!showDueOnly)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
              showDueOnly
                ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300 border border-orange-200 dark:border-orange-800'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            <Clock size={13} />
            {t('personalVocab.dueOnly') || 'Faqat takrorlash'}
          </button>

          {/* Category Select */}
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-1.5 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/90 text-gray-700 dark:text-gray-300 focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          >
            {CATEGORIES.map((cat) => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-xs text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
          >
            <XIcon size={12} />
            Filtrlarni tozalash
          </button>
        )}
      </div>

      {/* Toolbar: Sort + Layout + Result Count */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            {filteredWords.length} {filteredWords.length === 1 ? "so'z" : "ta so'z"}
          </span>
          {dueWords > 0 && (
            <span className="text-xs text-orange-600 dark:text-orange-400 font-medium bg-orange-50 dark:bg-orange-900/20 px-2 py-0.5 rounded-md">
              {dueWords} ta muddati o'tgan
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Sort */}
          <div className="flex items-center gap-1">
            <select
              value={sortField}
              onChange={(e) => setSortField(e.target.value as SortField)}
              className="px-2.5 py-1.5 rounded-lg text-xs border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/90 text-gray-600 dark:text-gray-400 focus:ring-1 focus:ring-primary-500 focus:border-transparent"
            >
              {SORT_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <button
              onClick={toggleSortDirection}
              className="p-1.5 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800/90 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
              title={sortDirection === 'asc' ? 'O\'sish' : 'Kamayish'}
            >
              <ArrowUpDown size={14} className={`transition-transform ${sortDirection === 'asc' ? 'rotate-180' : ''}`} />
            </button>
          </div>

          {/* Layout Toggle */}
          <div className="flex items-center border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden bg-white dark:bg-gray-800/90">
            <button
              onClick={() => setLayout('list')}
              className={`p-1.5 transition-colors ${layout === 'list' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              title="Ro'yxat"
            >
              <List size={15} />
            </button>
            <button
              onClick={() => setLayout('grid')}
              className={`p-1.5 transition-colors ${layout === 'grid' ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400' : 'text-gray-400 hover:text-gray-600 dark:hover:text-gray-300'}`}
              title="Katak"
            >
              <LayoutGrid size={15} />
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {viewMode === 'add' && (
        <div className="animate-fadeIn">
          <AddWordForm
            onAdd={handleAddWord}
            onCancel={() => { setEditingWord(null); setViewMode('list') }}
            onAITranslate={handleAITranslation}
            editWord={editingWord}
          />
        </div>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-2">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {(currentPage - 1) * PAGE_SIZE + 1}–{Math.min(currentPage * PAGE_SIZE, filteredWords.length)} / {filteredWords.length}
              </p>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400 transition-colors"
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
                      className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${
                        page === currentPage
                          ? 'bg-primary-500 text-white shadow-sm'
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
                  className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 disabled:opacity-40 disabled:cursor-not-allowed text-gray-600 dark:text-gray-400 transition-colors"
                >
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-16">
          <div className="w-20 h-20 mx-auto bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <BookOpen size={36} className="text-gray-300 dark:text-gray-600" />
          </div>
          <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
            {searchQuery || filterCategory !== 'all' || filterLevel !== 'all'
              ? t('personalVocab.noResults') || 'Hech narsa topilmadi'
              : t('personalVocab.emptyState') || "Hali so'zlar qo'shilmagan."}
          </p>
          {!searchQuery && filterCategory === 'all' && filterLevel === 'all' && (
            <>
              <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
                Birinchi so'zingizni qo'shing!
              </p>
              <button
                onClick={() => { setEditingWord(null); setViewMode('add') }}
                className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-primary-600 text-white font-medium hover:from-primary-600 hover:to-primary-700 shadow-lg shadow-primary-500/20 transition-all active:scale-[0.98]"
              >
                <Plus size={18} />
                Birinchi so'zni qo'shish
              </button>
            </>
          )}
        </div>
      )}

      {/* CSS Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(8px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
