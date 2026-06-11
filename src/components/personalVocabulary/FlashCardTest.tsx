import { useState, useEffect, useCallback } from 'react'
import type { PersonalWord, WordSessionResult, VocabRating } from '../../types/personalVocabulary'
import { ChevronLeft, ChevronRight, X, CheckCircle2, XCircle, HelpCircle, Star } from 'lucide-react'
import { useI18n } from '../../i18n'

interface FlashCardTestProps {
  words: PersonalWord[]
  onComplete: (results: WordSessionResult[]) => void
  onExit: () => void
}

type TestMode = 'translation' | 'fill-blank' | 'type-answer' | 'definition'

const RATING_OPTIONS: { value: VocabRating; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'bilmadim', label: 'Bilmadim', icon: <XCircle size={18} />, color: 'bg-red-100 dark:bg-red-900/30 text-red-600 hover:bg-red-200 dark:hover:bg-red-900/50' },
  { value: 'qiynaldim', label: 'Qiynaldim', icon: <HelpCircle size={18} />, color: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 hover:bg-yellow-200 dark:hover:bg-yellow-900/50' },
  { value: 'bildim', label: 'Bildim', icon: <CheckCircle2 size={18} />, color: 'bg-blue-100 dark:bg-blue-900/30 text-blue-600 hover:bg-blue-200 dark:hover:bg-blue-900/50' },
  { value: 'yodladim', label: 'Yodladim', icon: <Star size={18} />, color: 'bg-green-100 dark:bg-green-900/30 text-green-600 hover:bg-green-200 dark:hover:bg-green-900/50' },
]

export default function FlashCardTest({ words, onComplete, onExit }: FlashCardTestProps) {
  const { t } = useI18n()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [mode, setMode] = useState<TestMode>('translation')
  const [userAnswer, setUserAnswer] = useState('')
  const [showAnswer, setShowAnswer] = useState(false)
  const [results, setResults] = useState<WordSessionResult[]>([])
  const [isFlipped, setIsFlipped] = useState(false)

  const currentWord = words[currentIndex]
  const totalWords = words.length
  const progress = ((currentIndex) / totalWords) * 100

  const resetCard = useCallback(() => {
    setUserAnswer('')
    setShowAnswer(false)
    setIsFlipped(false)
  }, [])

  useEffect(() => {
    resetCard()
  }, [currentIndex, resetCard])

  const handleShowAnswer = () => {
    setShowAnswer(true)
    setIsFlipped(true)
  }

  const handleRate = (rating: VocabRating) => {
    const result: WordSessionResult = {
      vocabId: currentWord.id,
      english: currentWord.english,
      uzbek: currentWord.uzbek,
      level: currentWord.level,
      box: currentWord.box,
      result: rating === 'bilmadim' ? 'wrong' : 'correct',
      rating,
    }
    const newResults = [...results, result]
    setResults(newResults)

    if (currentIndex + 1 < totalWords) {
      setCurrentIndex(currentIndex + 1)
    } else {
      onComplete(newResults)
    }
  }

  const handleSkip = () => {
    const result: WordSessionResult = {
      vocabId: currentWord.id,
      english: currentWord.english,
      uzbek: currentWord.uzbek,
      level: currentWord.level,
      box: currentWord.box,
      result: 'wrong',
    }
    const newResults = [...results, result]
    setResults(newResults)

    if (currentIndex + 1 < totalWords) {
      setCurrentIndex(currentIndex + 1)
    } else {
      onComplete(newResults)
    }
  }

  const handleTypeAnswer = () => {
    const isCorrect = userAnswer.trim().toLowerCase() === currentWord.uzbek.trim().toLowerCase()
    if (isCorrect) {
      handleRate('bildim')
    } else {
      setShowAnswer(true)
    }
  }

  const getQuestion = (): { question: string; answer: string } => {
    switch (mode) {
      case 'translation':
        return { question: currentWord.english, answer: currentWord.uzbek }
      case 'fill-blank': {
        const sentence = currentWord.example || `I want to learn the word ${currentWord.english}.`
        const blanked = sentence.replace(
          new RegExp(`\\b${currentWord.english}\\b`, 'i'),
          '_____'
        )
        return { question: blanked, answer: currentWord.english }
      }
      case 'type-answer':
        return { question: currentWord.english, answer: currentWord.uzbek }
      case 'definition':
        return { question: currentWord.uzbek, answer: currentWord.english }
      default:
        return { question: currentWord.english, answer: currentWord.uzbek }
    }
  }

  const { question, answer } = getQuestion()

  if (totalWords === 0) {
    return (
      <div className="max-w-2xl mx-auto p-6 text-center">
        <p className="text-gray-500 mb-4">{t('personalVocab.noWordsForReview') || 'Takrorlash uchun so\'zlar topilmadi'}</p>
        <button onClick={onExit} className="px-4 py-2 rounded-xl bg-gray-200 text-gray-700">
          Orqaga
        </button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">
             {t('personalVocab.flashCardTest') || 'Flash Card Test'}
           </h2>
          <p className="text-sm text-gray-500">
            {currentIndex + 1} / {totalWords}
          </p>
        </div>
        <button
          onClick={onExit}
          className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500"
        >
          <X size={20} />
        </button>
      </div>

      {/* Progress Bar */}
      <div className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-primary-500 transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>

      {/* Mode Selector */}
      <div className="flex flex-wrap gap-2">
        {([
          { value: 'translation', label: 'Tarjima' },
          { value: 'fill-blank', label: "Bo'sh joy" },
          { value: 'type-answer', label: 'Yozish' },
          { value: 'definition', label: "Tafsilot" },
        ] as { value: TestMode; label: string }[]).map((m) => (
          <button
            key={m.value}
            onClick={() => { setMode(m.value); resetCard() }}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
              mode === m.value
                ? 'bg-primary-500 text-white'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {/* Card */}
      <div
        className={`relative bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg min-h-[300px] flex flex-col items-center justify-center transition-all duration-500 ${
          isFlipped ? 'bg-primary-50 dark:bg-primary-900/20' : ''
        }`}
      >
        {!showAnswer ? (
          <>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">
              {question}
            </p>
            {mode === 'type-answer' && (
              <div className="w-full max-w-md">
                <input
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleTypeAnswer()}
                  placeholder="Javobni yozing..."
                  className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 text-center text-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                  autoFocus
                />
                <button
                  onClick={handleTypeAnswer}
                  disabled={!userAnswer.trim()}
                  className="w-full mt-3 px-4 py-2.5 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600 disabled:opacity-50"
                >
                  Tekshirish
                </button>
              </div>
            )}
            {(mode === 'translation' || mode === 'definition') && (
              <button
                onClick={handleShowAnswer}
                className="px-6 py-3 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600"
              >
                Javobni ko'rish
              </button>
            )}
            {mode === 'fill-blank' && (
              <button
                onClick={handleShowAnswer}
                className="px-6 py-3 rounded-xl bg-primary-500 text-white font-medium hover:bg-primary-600"
              >
                Javobni ko'rish
              </button>
            )}
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500 mb-2">Javob:</p>
            <p className="text-3xl font-bold text-primary-600 dark:text-primary-400 mb-4">
              {answer}
            </p>
            {currentWord.example && (
              <p className="text-sm text-gray-500 italic mb-6">
                "{currentWord.example}"
              </p>
            )}
            <p className="text-sm text-gray-500 mb-4">
              Siz bu so'zni qanchalik yaxshi bilasiz?
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {RATING_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => handleRate(opt.value)}
                  className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-medium transition-colors ${opt.color}`}
                >
                  {opt.icon}
                  {opt.label}
                </button>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentIndex(Math.max(0, currentIndex - 1))}
          disabled={currentIndex === 0}
          className="flex items-center gap-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={18} />
          Oldingi
        </button>
        <button
          onClick={handleSkip}
          className="flex items-center gap-1 px-4 py-2 rounded-xl bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700"
        >
          O'tkazib yuborish
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  )
}
