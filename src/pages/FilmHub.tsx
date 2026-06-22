import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Search, Film, ChevronRight } from 'lucide-react'
import { FILMS, searchFilms } from '../data/filmVocabulary'

export default function FilmHub() {
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  const films = query.trim() ? searchFilms(query) : FILMS

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
      </div>

      {/* Films grid */}
      {films.length === 0 ? (
        <div className="text-center py-16">
          <Film size={48} className="mx-auto text-gray-300 dark:text-gray-600 mb-3" />
          <p className="text-gray-500 dark:text-gray-400">Film topilmadi</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {films.map((film) => (
            <button
              key={film.id}
              onClick={() => navigate(`/films/${film.id}`)}
              className="group text-left p-4 rounded-2xl border border-gray-100 dark:border-gray-800
                bg-white dark:bg-gray-900 hover:border-primary-200 dark:hover:border-primary-800
                hover:shadow-md transition-all duration-200"
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
                  <div className="flex items-center gap-2 mt-2">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                      bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">
                      {film.words.length} so'z
                    </span>
                  </div>
                </div>
                <ChevronRight size={18}
                  className="text-gray-300 dark:text-gray-600 group-hover:text-primary-500 transition-colors mt-1 shrink-0" />
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
