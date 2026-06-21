import { useI18n } from '../../i18n'
import { useStore } from '../../store/useStore'
import { useAuth } from '../../hooks/useAuth'
import { useProgress } from '../../hooks/useProgress'
import { AVATARS } from '../ui/AvatarSelector'
import { LogOut } from 'lucide-react'

export default function TopBar() {
  const { t } = useI18n()
  const { currentLevel, currentWeek, currentDay, streak: localStreak, targetDate, userName: localName, avatarId, totalWordsLearned } = useStore()
  const { displayName, signOut } = useAuth()
  const { dbStreak } = useProgress()

  const userName = displayName || localName
  const streak   = dbStreak   || localStreak

  const dayNum = Math.max(1, currentDay || 1)
  const dayInWeek = ((dayNum - 1) % 7) + 1

  const daysLeft = Math.max(
    0,
    Math.ceil((new Date(targetDate).getTime() - Date.now()) / 86_400_000)
  )

  const levelColor =
    currentLevel === 'B2'         ? 'bg-b2-100 text-b2-700 border-b2-200' :
    currentLevel.startsWith('B1') ? 'bg-b1-100 text-b1-700 border-b1-200' :
                                    'bg-primary-100 text-primary-700 border-primary-200'

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? t('dashboard.greetingMorning') :
    hour < 18 ? t('dashboard.greetingAfternoon')  : t('dashboard.greetingEvening')

  return (
    <header className="bg-white border-b border-gray-100 px-3 sm:px-6 py-2.5 sm:py-3.5 flex items-center justify-between flex-shrink-0 gap-2">
      <div className="min-w-0">
        <p className="text-xs text-gray-400 font-medium">{greeting}</p>
        <h1 className="text-sm sm:text-base font-bold text-gray-900 leading-tight truncate flex items-center gap-1.5">
          <span className="text-lg">{AVATARS.find(a => a.id === avatarId)?.emoji ?? '👤'}</span>
          {t('dashboard.greetingUser', { name: userName || t('sidebar.userFallback') })}
        </h1>
      </div>

      <div className={`flex items-center gap-1 px-2 sm:px-3.5 py-1 sm:py-1.5 rounded-full border font-semibold text-xs sm:text-sm flex-shrink-0 ${levelColor}`}>
        <span>{t('dashboard.topBarLevel', { level: currentLevel })}</span>
        <span className="text-xs opacity-60 hidden sm:inline">·</span>
        <span className="text-xs font-medium opacity-80 hidden sm:inline">{t('dashboard.topBarWeek', { week: currentWeek })}</span>
        <span className="text-xs opacity-60 hidden sm:inline">·</span>
        <span className="text-xs font-medium opacity-80">{t('dashboard.topBarDay', { dayInWeek })}</span>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <div className="flex items-center gap-1 sm:gap-1.5">
          <span className="text-base sm:text-lg leading-none">🔥</span>
          <div className="hidden sm:block">
            <p className="text-sm font-bold text-gray-900 leading-tight">{t('dashboard.topBarStreak', { streak })}</p>
            <p className="text-xs text-gray-400">{t('dashboard.streakLabel')}</p>
          </div>
          <span className="text-xs font-bold text-gray-900 sm:hidden">{streak}</span>
        </div>
        <div className="h-7 w-px bg-gray-100 hidden sm:block" />
        <div className="text-right hidden sm:block">
          <p className="text-sm font-bold text-gray-900 leading-tight">{t('dashboard.topBarDaysLeft', { daysLeft })}</p>
          <p className="text-xs text-gray-400">{t('dashboard.daysLeftLabel')}</p>
        </div>
        <div className="hidden sm:flex items-center gap-1.5">
          <span className="text-base leading-none">📚</span>
          <div>
            <p className="text-sm font-bold text-gray-900 leading-tight">{totalWordsLearned}</p>
            <p className="text-xs text-gray-400">{t('dashboard.totalWordsLabel')}</p>
          </div>
        </div>
        <div className="h-7 w-px bg-gray-100" />
        <button
          onClick={signOut}
          title={t('dashboard.signOutTitle')}
          aria-label={t('dashboard.signOutTitle')}
          className="p-2 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors min-h-[44px] min-w-[44px] flex items-center justify-center"
        >
          <LogOut size={18} />
        </button>
      </div>
    </header>
  )
}
