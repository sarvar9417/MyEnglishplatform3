import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Film, ChevronRight, X, BarChart3 } from 'lucide-react'
import { FILMS, searchFilms, type FilmVocabulary } from '../data/filmVocabulary'

export default function FilmHub() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const films = useMemo(() => query.trim() ? searchFilms(query) : FILMS, [query])

  const stats = useMemo(() => {
    const total = FILMS.reduce((s, f) => s + f.words.length, 0)
    const levels: Record<string, number> = {}
    FILMS.forEach(f => f.words.forEach(w => { levels[w.level] = (levels[w.level] || 0) + 1 }))
    return { total, levels, filmCount: FILMS.length }
  }, [])

  return (
    <div className="p-3 sm:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
            <Film size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-gray-100">
              Film Vocabulary
            </h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Kinolardan o'rganing — so'z boyligingizni oshiring
            </p>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="grid grid-cols-3 gap-3 mb-5">
        <div className="card !p-3 text-center">
          <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{stats.filmCount}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Filmlar</p>
        </div>
        <div className="card !p-3 text-center">
          <p className="text-2xl font-bold text-primary-600 dark:text-primary-400">{stats.total}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Jami so'zlar</p>
        </div>
        <div className="card !p-3 text-center">
          <p className="text-2xl font-bold text-pink-600 dark:text-pink-400">{Object.keys(stats.levels).length}</p>
          <p className="text-[10px] text-gray-400 mt-0.5">Darajalar</p>
        </div>
      </div>

      {/* Level distribution */}
      <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1">
        <BarChart3 size={14} className="text-gray-400 shrink-0" />
        {Object.entries(stats.levels).sort(([a], [b]) => a.localeCompare(b)).map(([lv, count]) => (
          <span key={lv} className="shrink-0 px-2 py-1 rounded-lg text-[10px] font-medium bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
            {lv}: {count}
          </span>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Film qidirish..."
          className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-gray-200 dark:border-gray-700
            bg-white dark:bg-gray-900 text-sm text-gray-900 dark:text-gray-100
            placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
        {query && (
          <button
            onClick={() => setQuery('')}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            <X size={18} />
          </button>
        )}
      </div>

      {/* Films grid */}
      {films.length === 0 ? (
        <div className="card text-center py-12">
          <Film size={40} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Film topilmadi</p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Boshqa so'z bilan qidiring</p>
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {films.map((film) => (
            <FilmCard key={film.id} film={film} onClick={() => navigate(`/films/${film.id}`)} />
          ))}
        </div>
      )}
    </div>
  )
}

function FilmCard({ film, onClick }: { film: FilmVocabulary; onClick: () => void }) {
  const levelCounts = useMemo(() => {
    const counts: Record<string, number> = {}
    film.words.forEach(w => { counts[w.level] = (counts[w.level] || 0) + 1 })
    return counts
  }, [film.words])

  return (
    <button
      onClick={onClick}
      className="card !p-4 text-left hover:shadow-md hover:border-primary-200 dark:hover:border-primary-700
        transition-all focus:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 group"
    >
      <div className="flex items-start gap-3">
        <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100
          dark:from-purple-900/30 dark:to-pink-900/30 flex items-center justify-center text-2xl shrink-0">
          {film.posterEmoji}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-gray-900 dark:text-gray-100 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
            {film.title}
          </h3>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
            {film.titleUz} • {film.year} • {film.genre}
          </p>
          <p className="text-xs text-gray-400 dark:text-gray-500 mt-1 line-clamp-2">
            {film.descriptionUz}
          </p>
          <div className="flex items-center gap-1.5 mt-2 flex-wrap">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold
              bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
              {film.words.length} so'z
            </span>
            {Object.entries(levelCounts).sort(([a], [b]) => a.localeCompare(b)).map(([lv, count]) => (
              <span key={lv} className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-medium
                bg-gray-100 dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                {lv} ({count})
              </span>
            ))}
          </div>
        </div>
        <ChevronRight size={18}
          className="text-gray-300 dark:text-gray-600 group-hover:text-primary-500 transition-colors mt-1 shrink-0" />
      </div>
    </button>
  )
}
