import { useNavigate } from 'react-router-dom'
import { useI18n } from '../../i18n'

export default function StartLessonButton() {
  const { t } = useI18n()
  const navigate = useNavigate()

  return (
    <button
      onClick={() => navigate('/lesson')}
      aria-label={t('dashboard.startLessonTitle')}
      className="w-full rounded-2xl p-4 flex items-center gap-4 text-left
        bg-gradient-to-r from-primary-600 to-primary-700
        hover:from-primary-700 hover:to-primary-800 transition-all
        shadow-lg active:scale-[0.98]"
    >
      <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center text-2xl shrink-0">
        📚
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-white font-black text-base">{t('dashboard.startLessonTitle')}</p>
        <p className="text-white/80 text-xs">{t('dashboard.startLessonSubtitle')}</p>
      </div>
      <span className="text-white/90 font-bold text-sm bg-white/20 px-3 py-1.5 rounded-xl flex-shrink-0">
        {t('dashboard.startLessonButton')}
      </span>
    </button>
  )
}
