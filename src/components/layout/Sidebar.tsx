import React, { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { useStore } from '../../store/useStore'
import {
  LayoutDashboard, Map, BookOpen, BookMarked,
  BarChart2, ClipboardList, MessageSquare,
  ChevronLeft, ChevronRight, Zap, Flame,
  Trophy, Sun, X, BookText,
} from 'lucide-react'

interface NavItem {
  to: string
  icon: React.ReactNode
  label: string
}

const NAV_ITEMS: NavItem[] = [
  { to: '/',            icon: <LayoutDashboard size={20} />, label: 'Dashboard' },
  { to: '/daily-lesson', icon: <Sun size={20} />,             label: 'Kunlik Dars' },
  { to: '/roadmap',     icon: <Map size={20} />,             label: 'Yo\'l Xaritasi' },
  { to: '/lesson',      icon: <BookOpen size={20} />,        label: 'Darslar' },
  { to: '/dictionary',  icon: <BookText size={20} />,        label: 'Lug\'at' },
  { to: '/vocabulary',  icon: <BookMarked size={20} />,      label: 'So\'z o\'rganish' },
  { to: '/progress',    icon: <BarChart2 size={20} />,       label: 'Progress' },
  { to: '/mock-test',   icon: <ClipboardList size={20} />,   label: 'Mock Test' },
  { to: '/chat',        icon: <MessageSquare size={20} />,   label: 'AI Tutor' },
]

const LEVEL_COLORS: Record<string, string> = {
  'A2+': 'bg-gray-100 text-gray-600',
  'B1':  'bg-b1-100 text-b1-700',
  'B1+': 'bg-b1-100 text-b1-800',
  'B2':  'bg-b2-100 text-b2-700',
}

export default function Sidebar({ isOpen, onClose }: { isOpen?: boolean; onClose?: () => void }) {
  const [collapsed, setCollapsed] = useState(false)
  const { userName, totalXP, streak, currentLevel, currentDay, targetDate } = useStore()

  const daysLeft = Math.max(0, Math.ceil(
    (new Date(targetDate).getTime() - Date.now()) / 86400000
  ))

  const xpToNextLevel = 1000
  const xpProgress = (totalXP % xpToNextLevel) / xpToNextLevel * 100

  const handleNav = () => {
    if (onClose) onClose()
  }

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden lg:flex flex-col bg-white border-r border-gray-100 h-full
          transition-all duration-300 ease-in-out flex-shrink-0
          ${collapsed ? 'w-16' : 'w-60'}`}
      >
      {/* Logo */}
      <div className={`flex items-center px-4 py-5 border-b border-gray-100 ${collapsed ? 'justify-center' : 'gap-2.5'}`}>
        <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-sm">EP</span>
        </div>
        {!collapsed && (
          <div>
            <p className="font-bold text-gray-900 text-sm leading-tight">EnglishPath</p>
            <p className="text-xs text-gray-400">A2+ → B2</p>
          </div>
        )}
      </div>

      {/* User info */}
      {!collapsed && (
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-semibold text-gray-900 text-sm truncate max-w-[110px]">
                {userName || 'Foydalanuvchi'}
              </p>
              <span className={`badge text-xs mt-0.5 ${LEVEL_COLORS[currentLevel] ?? 'bg-gray-100 text-gray-600'}`}>
                {currentLevel}
              </span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1 text-orange-500">
                <Flame size={14} />
                <span className="text-xs font-bold">{streak}</span>
              </div>
              <div className="flex items-center gap-1 text-b2-600">
                <Trophy size={14} />
                <span className="text-xs font-bold">{totalXP.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* XP bar */}
          <div className="progress-bar mt-2">
            <div
              className="progress-fill bg-gradient-to-r from-primary-500 to-b2-500"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-1">{totalXP % xpToNextLevel} / {xpToNextLevel} XP</p>
        </div>
      )}

      {/* Navigation */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto scrollbar-hide">
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            onClick={handleNav}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'active' : ''} ${collapsed ? 'justify-center px-2' : ''}`
            }
            title={collapsed ? item.label : undefined}
          >
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </NavLink>
        ))}
      </nav>

      {/* Stats footer */}
      {!collapsed && (
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Zap size={12} className="text-primary-500" />
              <span>Kun {currentDay}/90</span>
            </div>
            <span className="text-gray-400">{daysLeft} kun qoldi</span>
          </div>
          <div className="progress-bar mt-1.5">
            <div
              className="progress-fill bg-primary-500"
              style={{ width: `${(currentDay / 90) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Collapse toggle — desktop only */}
      <button
        onClick={() => setCollapsed((c) => !c)}
        className="hidden lg:flex items-center justify-center py-3 border-t border-gray-100
          text-gray-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
        title={collapsed ? "Kengaytirish" : "Yig'ish"}
      >
        {collapsed ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
      </button>
    </aside>

      {/* Mobile drawer */}
      <aside
        className={`lg:hidden fixed inset-y-0 left-0 z-40 flex flex-col bg-white
          transition-transform duration-300 ease-in-out shadow-2xl
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
        style={{ width: '280px' }}
      >
        {/* Header with close */}
        <div className="flex items-center justify-between px-4 py-5 border-b border-gray-100">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center flex-shrink-0">
              <span className="text-white font-bold text-sm">EP</span>
            </div>
            <div>
              <p className="font-bold text-gray-900 text-sm leading-tight">EnglishPath</p>
              <p className="text-xs text-gray-400">A2+ → B2</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100"
          >
            <X size={20} />
          </button>
        </div>

        {/* User info */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="font-semibold text-gray-900 text-sm truncate max-w-[160px]">
                {userName || 'Foydalanuvchi'}
              </p>
              <span className={`badge text-xs mt-0.5 ${LEVEL_COLORS[currentLevel] ?? 'bg-gray-100 text-gray-600'}`}>
                {currentLevel}
              </span>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="flex items-center gap-1 text-orange-500">
                <Flame size={14} />
                <span className="text-xs font-bold">{streak}</span>
              </div>
              <div className="flex items-center gap-1 text-b2-600">
                <Trophy size={14} />
                <span className="text-xs font-bold">{totalXP.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* XP bar */}
          <div className="progress-bar mt-2">
            <div
              className="progress-fill bg-gradient-to-r from-primary-500 to-b2-500"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
          <p className="text-[10px] text-gray-400 mt-1">{totalXP % xpToNextLevel} / {xpToNextLevel} XP</p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto scrollbar-hide">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.to === '/'}
              onClick={handleNav}
              className={({ isActive }) =>
                `sidebar-link ${isActive ? 'active' : ''}`
              }
            >
              {item.icon}
              <span>{item.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Stats footer */}
        <div className="px-4 py-3 border-t border-gray-100">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <Zap size={12} className="text-primary-500" />
              <span>Kun {currentDay}/90</span>
            </div>
            <span className="text-gray-400">{daysLeft} kun qoldi</span>
          </div>
          <div className="progress-bar mt-1.5">
            <div
              className="progress-fill bg-primary-500"
              style={{ width: `${(currentDay / 90) * 100}%` }}
            />
          </div>
        </div>
      </aside>
    </>
  )
}
