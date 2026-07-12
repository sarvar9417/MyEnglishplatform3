import { useState, useMemo, useCallback } from 'react'
import { Search, Copy, Check, Volume2, Filter } from 'lucide-react'
import type { SentenceBank } from '../../data/30dayChallenge'

interface Props {
  sentenceBank: SentenceBank
}

export default function SentenceBankSection({ sentenceBank }: Props) {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState<string | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showFilters, setShowFilters] = useState(false)

  const categories = sentenceBank.categories

  const filtered = useMemo(() => {
    const source = activeCategory
      ? categories.find(c => c.category === activeCategory)?.phrases ?? sentenceBank.all
      : sentenceBank.all

    if (!search.trim()) return source

    const q = search.toLowerCase()
    return source.filter(s => s.toLowerCase().includes(q))
  }, [search, activeCategory, categories, sentenceBank.all])

  const handleCopy = useCallback(async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text)
      setCopiedId(id)
      setTimeout(() => setCopiedId(null), 1500)
    } catch {}
  }, [])

  const handleSpeak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      // Cancel any ongoing speech
      window.speechSynthesis.cancel()
      const u = new SpeechSynthesisUtterance(text)
      u.lang = 'en-US'
      u.rate = 0.85
      u.pitch = 1
      window.speechSynthesis.speak(u)
    }
  }, [])

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <h3 className="font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
          💬 Barcha jumlalar
          <span className="text-sm font-normal text-gray-500">({sentenceBank.all.length} ta)</span>
        </h3>
        <button
          onClick={() => setShowFilters(!showFilters)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors ${
            showFilters ? 'bg-primary-100 dark:bg-primary-900/40 text-primary-700 dark:text-primary-300' : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400'
          }`}
        >
          <Filter size={12} />
          Kategoriyalar
        </button>
      </div>

      {/* Search */}
      <div className="relative group">
        <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-500 transition-colors" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Jumlalarni qidirish..."
          className="w-full pl-10 pr-4 py-3 rounded-xl bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 text-sm text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all placeholder-gray-400"
        />
        {search && (
          <button
            onClick={() => setSearch('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      {/* Category filters - animated expand */}
      {showFilters && (
        <div className="flex gap-1.5 flex-wrap animate-slide-down">
          <button
            onClick={() => { setActiveCategory(null); setShowFilters(false) }}
            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
              !activeCategory
                ? 'bg-primary-600 text-white shadow-md'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            Hammasi ({sentenceBank.all.length})
          </button>
          {categories.map(c => (
            <button
              key={c.category}
              onClick={() => { setActiveCategory(c.category); setShowFilters(false) }}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeCategory === c.category
                  ? 'bg-primary-600 text-white shadow-md'
                  : 'bg-gray-100 dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-700'
              }`}
            >
              {c.category} ({c.phrases.length})
            </button>
          ))}
        </div>
      )}

      {/* Results count */}
      {search && (
        <p className="text-xs text-gray-400">
          {filtered.length} ta natija topildi
        </p>
      )}

      {/* Sentences grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
        {filtered.map((s, i) => {
          const id = `sent-${activeCategory ?? 'all'}-${i}`
          return (
            <div
              key={id}
              className="group relative flex items-center justify-between gap-2 p-3.5 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 hover:border-primary-200 dark:hover:border-primary-700 hover:shadow-md transition-all duration-200"
            >
              <p className="text-sm text-gray-800 dark:text-gray-200 flex-1 leading-relaxed">{s}</p>
              <div className="flex items-center gap-0.5 opacity-30 group-hover:opacity-100 transition-all duration-200">
                <button
                  onClick={() => handleSpeak(s)}
                  className="p-2 rounded-lg text-gray-400 hover:text-primary-600 hover:bg-primary-50 dark:hover:bg-primary-900/30 transition-colors active:scale-90"
                  title="Ovoz chiqarib o'qish"
                >
                  <Volume2 size={14} />
                </button>
                <button
                  onClick={() => handleCopy(s, id)}
                  className="p-2 rounded-lg text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/30 transition-colors active:scale-90"
                  title="Nusxa olish"
                >
                  {copiedId === id ? (
                    <Check size={14} className="text-green-600 animate-pop-in" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
              </div>

              {/* Copy toast */}
              {copiedId === id && (
                <div className="absolute -top-2 right-2 px-2 py-0.5 rounded-md bg-green-600 text-white text-xs font-bold animate-pop-in shadow-lg">
                  Nusxalandi!
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-12 text-gray-400 dark:text-gray-500">
          <p className="text-2xl mb-2">🔍</p>
          <p className="font-medium">"{search}" bo'yicha hech narsa topilmadi</p>
          <button
            onClick={() => setSearch('')}
            className="mt-3 text-sm text-primary-600 hover:underline font-medium"
          >
            Qidiruvni tozalash
          </button>
        </div>
      )}
    </div>
  )
}
