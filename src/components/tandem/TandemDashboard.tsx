// ═══════════════════════════════════════════════════════════════════════════
// TandemDashboard — Do'stlar, Juftlik Streak, Duellar
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react'
import { Users, UserPlus, Sword, Flame, Clock, Check,
  Trophy, Zap, Copy, Bot, Target, ArrowRight,
  UserCheck, UserX, Loader2, Link as LinkIcon,
  Award, TrendingUp, Calendar, Theater, Sword as Swords,
} from 'lucide-react'
import { useTandemStore } from '../../store/tandemSlice'
import { addFriendByCode, acceptFriendRequest, getOrCreateWeeklyDuel, getDuelById, getOrCreateInviteCode } from '../../services/tandemService'
import type { WeeklyDuelData } from '../../services/tandemService'
import { createRoleplaySession, getRoleplaySession, getRoleplaySessionsForPair } from '../../services/roleplayDuoService'
import { useToastStore } from '../../utils/toastStore'
import AsyncDuel from './AsyncDuel'
import RoleplayDuoPlayer from './RoleplayDuoPlayer'
import FriendNeyronProfile from './FriendNeyronProfile'
import HotSeatDuel from './HotSeatDuel'
import FriendLeaderboard from './FriendLeaderboard'
import RatingBadge from './RatingBadge'
import { getUserElo } from '../../services/tandemService'
import type { DuelMode, Duel, RoleplaySession } from '../../types/tandem'

// ─── Status indicator ─────────────────────────────────────────────────────────

function StatusDot({ lastActive }: { lastActive: string | null }) {
  if (lastActive) {
    const daysSince = Math.floor((Date.now() - new Date(lastActive).getTime()) / 86400000)
    if (daysSince < 1) return <span className="w-2 h-2 rounded-full bg-yellow-400 inline-block" title="Bugun faol" />
    if (daysSince < 3) return <span className="w-2 h-2 rounded-full bg-gray-400 inline-block" title={`${daysSince} kun oldin`} />
    return <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" title="Uzoq vaqt oldin" />
  }
  return <span className="w-2 h-2 rounded-full bg-gray-300 inline-block" title="Noma'lum" />
}

// ─── Days Remaining ───────────────────────────────────────────────────────

function DaysRemaining({ weekStart }: { weekStart: string }) {
  const end = new Date(weekStart + 'T00:00:00Z')
  end.setUTCDate(end.getUTCDate() + 6)
  const diff = end.getTime() - Date.now()
  const daysLeft = Math.max(0, Math.ceil(diff / 86400000))
  return (
    <div className="flex items-center justify-center gap-1.5 text-xs text-gray-400">
      <Calendar size={11} />
      <span>{weekStart} - {daysLeft} kun qoldi</span>
    </div>
  )
}

// ─── Invite Code Input ────────────────────────────────────────────────────────

function JoinByCode({ onJoined }: { onJoined: () => void }) {
  const [code, setCode] = useState('')
  const [joining, setJoining] = useState(false)

  const handleJoin = async () => {
    if (!code.trim()) return
    setJoining(true)
    const result = await addFriendByCode(code.trim())
    if (result.success) {
      useToastStore.getState().toast("✅ Do'st qo'shildi!", 'success')
      setCode('')
      onJoined()
    } else {
      useToastStore.getState().toast(result.error || 'Xatolik', 'error')
    }
    setJoining(false)
  }

  return (
    <div className="flex gap-2">
      <input
        className="input flex-1 text-center font-mono text-sm"
        placeholder="Taklif kodingizni kiriting"
        value={code}
        onChange={(e) => setCode(e.target.value)}
        maxLength={60}
      />
      <button
        onClick={handleJoin}
        disabled={joining || !code.trim()}
        className="btn-primary px-4 py-2 text-sm disabled:opacity-40"
      >
        {joining ? <Loader2 size={16} className="animate-spin" /> : <UserCheck size={16} />}
      </button>
    </div>
  )
}

// ─── Main Component ───────────────────────────────────────────────────────────

export default function TandemDashboard() {
  const {
    friends, pendingInvites, loadingFriends,
    tandemPair,
    activeDuels, duelHistory, pendingOpponentDuels,
    roleplaySessions,
    loadAll, removeFriend, initTandemPair, startDuel, cancelDuel, loadRoleplaySessions,
  } = useTandemStore()
  const [inviteCode, setInviteCode] = useState('')
  const [inviteCopied, setInviteCopied] = useState(false)
  const [showDuelModal, setShowDuelModal] = useState(false)
  const [duelOpponent, setDuelOpponent] = useState<{ id: string; name: string } | null>(null)
  const [duelMode, setDuelMode] = useState<DuelMode>('vocab')
  const [creatingDuel, setCreatingDuel] = useState(false)
  const [activeDuel, setActiveDuel] = useState<Duel | null>(null)
  const [weeklyDuel, setWeeklyDuel] = useState<WeeklyDuelData | null>(null)
  const [weeklyLoading, setWeeklyLoading] = useState(false)
  const [currentUserId, setCurrentUserId] = useState('')
  const [currentUserName, setCurrentUserName] = useState('')
  const [showRoleplayPlayer, setShowRoleplayPlayer] = useState(false)
  const [roleplaySessionData, setRoleplaySessionData] = useState<RoleplaySession | null>(null)
  const [neyronProfileFriend, setNeyronProfileFriend] = useState<{ id: string; name: string } | null>(null)
  const [showHotSeat, setShowHotSeat] = useState(false)
  const [myElo, setMyElo] = useState<{ rating: number; tier: string; matchesPlayed: number; wins: number; losses: number; draws: number } | null>(null)

  // ── Get current user ID for invite code (xavfsiz — random kod) ────────
  useEffect(() => {
    const init = async () => {
      try {
        const { supabase } = await import('../../lib/supabase')
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user.id) {
          setCurrentUserId(session.user.id)
          // Get user name
          const { data: userData } = await supabase
            .from('users')
            .select('name')
            .eq('id', session.user.id)
            .single()
          if (userData?.name) setCurrentUserName(userData.name)
          // Xavfsiz invite code — random kod, base64 emas
          const code = await getOrCreateInviteCode(session.user.id)
          setInviteCode(code)
        }
      } catch { /* ignore */ }
    }
    init()
  }, [])

  useEffect(() => {
    loadAll()
  }, [loadAll])

  // ── Load Elo rating ─────────────────────────────────
  useEffect(() => {
    if (!currentUserId) return
    getUserElo(currentUserId).then(setMyElo).catch(() => {})
  }, [currentUserId])

  // ── Load Roleplay sessions ─────────────────────────────────
  useEffect(() => {
    if (tandemPair) {
      loadRoleplaySessions()
    }
  }, [tandemPair, loadRoleplaySessions])

  // ── Weekly Duel ────────────────────────────────────────────────────
  useEffect(() => {
    if (!tandemPair) { setWeeklyDuel(null); return }
    setWeeklyLoading(true)
    getOrCreateWeeklyDuel(tandemPair.id).then((wd) => {
      setWeeklyDuel(wd)
      setWeeklyLoading(false)
    }).catch(() => setWeeklyLoading(false))
  }, [tandemPair])

  const copyInviteLink = () => {
    const link = `${window.location.origin}/add/${inviteCode}`
    navigator.clipboard.writeText(link)
    setInviteCopied(true)
    setTimeout(() => setInviteCopied(false), 2000)
    useToastStore.getState().toast('🔗 Havola nusxalandi!', 'success')
  }

  const handleStartDuel = async () => {
    if (!duelOpponent) return
    if (duelMode === 'hotseat') {
      setShowDuelModal(false)
      setShowHotSeat(true)
      return
    }
    setCreatingDuel(true)
    const duel = await startDuel(duelOpponent.id, duelMode)
    if (duel) {
      useToastStore.getState().toast('⚔️ Duel boshlandi!', 'success')
      setShowDuelModal(false)
      setActiveDuel(duel)   // Challenger avval o'ynasin
    } else {
      useToastStore.getState().toast('Duel yaratishda xatolik', 'error')
    }
    setCreatingDuel(false)
  }

  const handleAIDuel = async (mode: DuelMode) => {
    if (mode === 'hotseat') {
      setShowHotSeat(true)
      return
    }
    setCreatingDuel(true)
    const duel = await startDuel(null, mode)
    if (duel) {
      useToastStore.getState().toast('⚔️ AI bilan duel boshlandi!', 'success')
      setActiveDuel(duel)
    } else {
      useToastStore.getState().toast('Duel yaratishda xatolik', 'error')
    }
    setCreatingDuel(false)
  }

  // ── Handle Roleplay Duo button ────────────────────────────────────────
  const handleRoleplayDuo = async () => {
    if (!tandemPair) return
    setCreatingDuel(true)

    try {
      const { supabase } = await import('../../lib/supabase')
      const { data: { session } } = await supabase.auth.getSession()
      if (!session?.user.id) { setCreatingDuel(false); return }

      // Check for pending sessions first
      const pendingSessions = await getRoleplaySessionsForPair()
      const incomplete = pendingSessions.filter(s => s.status !== 'completed')

      if (incomplete.length > 0) {
        // Open the most recent pending session
        const fresh = await getRoleplaySession(incomplete[0].id)
        if (fresh) {
          // Agar sessiyani boshqa user yaratgan bo'lsa va u hali scenario tanlamagan bo'lsa
          if (fresh.creator_id !== session.user.id && fresh.scenario_id === 'pending') {
            useToastStore.getState().toast(
              "⏳ Juftingiz hali stsenariy tanlamagan. U tanlagach, sizga bildirishnoma keladi.",
              'info', 5000,
            )
            setCreatingDuel(false)
            return
          }
          setRoleplaySessionData(fresh)
          setShowRoleplayPlayer(true)
          setCreatingDuel(false)
          return
        }
      }

      // Yangi session yaratish — scenario_id ni vaqtincha 'pending' qilib qo'yamiz
      // User A scenario tanlaganida update qilinadi
      const result = await createRoleplaySession(tandemPair.id, 'pending')
      if (result.success && result.session) {
        setRoleplaySessionData(result.session)
        setShowRoleplayPlayer(true)
      } else {
        useToastStore.getState().toast(
          result.error || 'Roleplay session yaratishda xatolik. Iltimos, qayta urinib ko\'ring.',
          'error',
        )
      }
    } catch {
      useToastStore.getState().toast(
        'Roleplay yaratishda xatolik yuz berdi',
        'error',
      )
    }

    setCreatingDuel(false)
  }

  // ── Render RoleplayDuoPlayer if active ────────────────────────────────
  if (showRoleplayPlayer && roleplaySessionData) {
    return (
      <RoleplayDuoPlayer
        session={roleplaySessionData}
        currentUserId={currentUserId}
        currentUserName={currentUserName}
        isCreator={roleplaySessionData.creator_id === currentUserId}
        onBack={() => {
          setShowRoleplayPlayer(false)
          setRoleplaySessionData(null)
          loadAll()
        }}
        onComplete={() => {
          setShowRoleplayPlayer(false)
          setRoleplaySessionData(null)
          loadAll()
        }}
      />
    )
  }

  // ── Render HotSeat if active ──────────────────────────────────────
  if (showHotSeat) {
    return (
      <HotSeatDuel
        onBack={() => {
          setShowHotSeat(false)
          loadAll()
        }}
      />
    )
  }

  // ── Render AsyncDuel if active ───────────────────────────────────────
  if (activeDuel) {
    const userRole = activeDuel.challenger === currentUserId ? 'challenger' : 'opponent'
    return (
      <AsyncDuel
        duel={activeDuel}
        mode={activeDuel.mode}
        userRole={userRole}
        onComplete={() => {
          setActiveDuel(null)
          loadAll()
        }}
      />
    )
  }

  // ── Streak visualization ─────────────────────────────────────────────
  const streak = tandemPair?.combined_streak ?? 0
  const streakLevel = streak >= 30 ? 'legendary' : streak >= 14 ? 'epic' : streak >= 7 ? 'great' : streak >= 3 ? 'good' : 'none'
  const streakColors: Record<string, string> = {
    none: 'text-gray-400',
    good: 'text-orange-400',
    great: 'text-orange-500',
    epic: 'text-purple-500',
    legendary: 'text-yellow-500',
  }
  const streakIcons: Record<string, string> = {
    none: '🔥',
    good: '🔥',
    great: '🔥🔥',
    epic: '💪',
    legendary: '👑',
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6 p-4 animate-page-enter">
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-200 dark:shadow-purple-900/30">
            <Users size={32} className="text-white" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Tandem</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Do'stingiz bilan birga o'rganing — streak, duel va AI hakam
        </p>
      </div>

      {/* Invite Section */}
      <div className="card p-5 space-y-3 border-2 border-dashed border-purple-200 dark:border-purple-800 bg-gradient-to-br from-purple-50/30 to-transparent dark:from-purple-950/20">
        <div className="flex items-center gap-2">
          <UserPlus size={18} className="text-purple-500" />
          <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">Do'st taklif qilish</h3>
        </div>
        <p className="text-xs text-gray-500">
          Taklif havolangizni do'stingizga yuboring yoki uning kodini kiriting
        </p>
        <div className="flex gap-2">
          <button
            onClick={copyInviteLink}
            className="btn-primary flex-1 py-2.5 text-sm flex items-center justify-center gap-1.5"
          >
            {inviteCopied ? <Check size={16} /> : <Copy size={16} />}
            {inviteCopied ? 'Nusxalandi!' : 'Havolani nusxalash'}
          </button>
        </div>
        <JoinByCode onJoined={loadAll} />
      </div>

      {/* Tandem Streak Card */}
      {tandemPair && (
        <div className="card p-5 space-y-3 bg-gradient-to-br from-orange-50 to-amber-50 dark:from-orange-950/30 dark:to-amber-950/20 border-2 border-orange-100 dark:border-orange-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Flame size={20} className={streakColors[streakLevel]} />
              <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
                Juftlik Streak
              </h3>
            </div>
            {streak > 0 && (
              <span className="text-xs font-bold text-orange-500 bg-orange-100 dark:bg-orange-900/40 px-2 py-0.5 rounded-full">
                {streakIcons[streakLevel]} {streak} kun
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-3 bg-orange-100 dark:bg-orange-900/40 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-orange-400 to-amber-500 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(100, (streak / 30) * 100)}%` }}
              />
            </div>
            <span className="text-xs font-bold text-orange-600 dark:text-orange-400 whitespace-nowrap">
              {streak < 3 ? "Boshlang'ich" :
               streak < 7 ? `${7 - streak} kun qoldi` :
               streak < 14 ? '🔥🔥 7-kun!' :
               streak < 30 ? '💪 14-kun!' : '👑 30-kun!'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2">
              <p className="font-bold text-lg text-gray-900 dark:text-gray-100">{streak}</p>
              <p className="text-gray-400">Ketma-ket kun</p>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2">
              <p className="font-bold text-lg text-gray-900 dark:text-gray-100">{tandemPair.total_xp}</p>
              <p className="text-gray-400">Umumiy XP</p>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2">
              <p className="font-bold text-lg text-gray-900 dark:text-gray-100">
                {tandemPair.last_both_active
                  ? Math.floor((Date.now() - new Date(tandemPair.last_both_active).getTime()) / 86400000)
                  : '-'}
              </p>
              <p className="text-gray-400">Oxirgi birgalikda</p>
            </div>
          </div>

          {/* Bonus milestones */}
          <div className="flex flex-wrap gap-1.5 pt-1">
            {[3, 7, 14, 30].map((milestone) => (
              <span
                key={milestone}
                className={`text-[11px] px-2 py-0.5 rounded-full ${
                  streak >= milestone
                    ? 'bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-400'
                }`}
              >
                {streak >= milestone ? '✅' : '🔒'} {milestone} kun
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Elo Rating Card */}
      {myElo && (
        <div className="card p-5 space-y-3 bg-gradient-to-br from-purple-50 to-indigo-50 dark:from-purple-950/30 dark:to-indigo-950/20 border-2 border-purple-100 dark:border-purple-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Swords size={20} className="text-purple-600" />
              <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
                Tandem Elo Rating
              </h3>
            </div>
            <span className="text-xs font-bold text-purple-600 bg-purple-100 dark:bg-purple-900/40 px-2 py-0.5 rounded-full">
              {myElo.matchesPlayed} o\'yin
            </span>
          </div>

          <div className="flex items-center justify-center">
            <RatingBadge rating={myElo.rating} size="lg" showProgress />
          </div>

          <div className="grid grid-cols-3 gap-2 text-center text-xs">
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2">
              <p className="font-bold text-lg text-green-600">{myElo.wins}</p>
              <p className="text-gray-400">G\'alaba</p>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2">
              <p className="font-bold text-lg text-gray-900 dark:text-gray-100">{myElo.draws}</p>
              <p className="text-gray-400">Durang</p>
            </div>
            <div className="bg-white/50 dark:bg-gray-800/50 rounded-lg p-2">
              <p className="font-bold text-lg text-red-500">{myElo.losses}</p>
              <p className="text-gray-400">Mag\'lubiyat</p>
            </div>
          </div>
        </div>
      )}

      {/* Weekly Duel Card */}
      {tandemPair && (() => {
        const isUserA = currentUserId === tandemPair.user_a
        const myXP = isUserA ? (weeklyDuel?.user_a_xp ?? 0) : (weeklyDuel?.user_b_xp ?? 0)
        const theirXP = isUserA ? (weeklyDuel?.user_b_xp ?? 0) : (weeklyDuel?.user_a_xp ?? 0)
        return (
          <div className="card p-5 space-y-3 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/30 dark:to-teal-950/20 border-2 border-emerald-100 dark:border-emerald-900/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award size={20} className="text-emerald-600" />
              <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
                Haftalik Duel
              </h3>
            </div>
            {weeklyDuel?.settled_at ? (
              <span className="text-xs font-bold text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full">
                ✅ Yakunlangan
              </span>
            ) : (
              <span className="text-xs font-medium text-emerald-600 bg-emerald-100 dark:bg-emerald-900/40 px-2 py-0.5 rounded-full">
                🏃 Davom etmoqda
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500">
            Hafta davomida eng ko'p XP yig'gan g'olib bo'ladi! G'olib nomi profilingizda ko'rinadi.
          </p>

          {weeklyLoading ? (
            <div className="flex justify-center py-3">
              <Loader2 size={18} className="animate-spin text-emerald-500" />
            </div>
          ) : weeklyDuel ? (
            <>
              {/* XP Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Siz: <span className="text-emerald-600 font-bold">{myXP} XP</span>
                  </span>
                  <span className="text-gray-400 font-bold">VS</span>
                  <span className="font-semibold text-gray-700 dark:text-gray-300">
                    Juft: <span className="text-blue-600 font-bold">{theirXP} XP</span>
                  </span>
                </div>

                {/* XP bar */}
                <div className="relative h-5 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                  {(() => {
                    const total = weeklyDuel.user_a_xp + weeklyDuel.user_b_xp
                    const pctA = total > 0 ? (weeklyDuel.user_a_xp / total) * 100 : 50
                    const pctB = total > 0 ? (weeklyDuel.user_b_xp / total) * 100 : 50
                    return (
                      <>
                        <div
                          className="absolute inset-y-0 left-0 bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500"
                          style={{ width: `${pctA}%` }}
                        />
                        <div
                          className="absolute inset-y-0 right-0 bg-gradient-to-l from-blue-400 to-blue-500 rounded-full transition-all duration-500"
                          style={{ width: `${pctB}%` }}
                        />
                      </>
                    )
                  })()}
                </div>

                <div className="flex items-center justify-center gap-1 text-xs text-gray-400">
                  <TrendingUp size={12} />
                  <span>Jami: {weeklyDuel.user_a_xp + weeklyDuel.user_b_xp} XP</span>
                </div>
              </div>

              {/* Winner info */}
              {weeklyDuel.winner_id && weeklyDuel.settled_at && (
                <div className="p-3 rounded-xl bg-gradient-to-r from-yellow-50 to-amber-50 dark:from-yellow-900/20 dark:to-amber-900/20 border border-yellow-200 dark:border-yellow-800 text-center">
                  <Trophy size={18} className="mx-auto text-yellow-500 mb-1" />
                  <p className="text-xs font-bold text-yellow-700 dark:text-yellow-300">
                    🏆 Hafta g'olibi!
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">
                    {(() => {
                      const isDraw = weeklyDuel.user_a_xp === weeklyDuel.user_b_xp
                      const userWon = isUserA
                        ? weeklyDuel.user_a_xp > weeklyDuel.user_b_xp
                        : weeklyDuel.user_b_xp > weeklyDuel.user_a_xp
                      return isDraw ? "Durang!" : userWon ? 'Siz gʻalaba qozondingiz!' : "Juftingiz gʻalaba qozondi!"
                    })()}
                  </p>
                </div>
              )}

              {/* Days remaining */}
              {!weeklyDuel.settled_at && weeklyDuel.week_start && (
                <DaysRemaining weekStart={weeklyDuel.week_start} />
              )}
            </>
          ) : (
            <div className="text-center py-3">
              <p className="text-xs text-gray-400">Haftalik duel ma'lumotlari yuklanmoqda...</p>
            </div>
          )}
          </div>
        )
      })()}

      {/* Friends List */}
      <div className="card p-5 space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={18} className="text-blue-500" />
            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
              Do'stlar ({friends.length})
            </h3>
          </div>
        </div>

        {loadingFriends ? (
          <div className="flex justify-center py-4">
            <Loader2 size={20} className="animate-spin text-gray-400" />
          </div>
        ) : friends.length === 0 ? (
          <div className="text-center py-6 space-y-2">
            <UserPlus size={32} className="mx-auto text-gray-300" />
            <p className="text-sm text-gray-500">Hali do'st qo'shilmagan</p>
            <p className="text-xs text-gray-400">
              Do'stingiz bilan tandem yaratish uchun taklif havolasini yuboring
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {friends.map((friend) => (
              <div
                key={friend.friendshipId}
                className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center text-white font-bold text-sm">
                    {friend.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{friend.name}</p>
                      <StatusDot lastActive={friend.lastActive} />
                    </div>
                    <p className="text-xs text-gray-400">
                      {friend.level} · {friend.streak} kunlik streak
                    </p>
                  </div>
                </div>
                <div className="flex gap-1.5">
                  <button
                    onClick={() => setNeyronProfileFriend({ id: friend.userId, name: friend.name })}
                    className="p-2 rounded-lg bg-indigo-50 dark:bg-indigo-900/30 text-indigo-500 hover:bg-indigo-100 transition-colors"
                    title="Neyron Profil"
                  >
                    <Target size={14} />
                  </button>
                  {!tandemPair && (
                    <button
                      onClick={() => initTandemPair(friend.userId)}
                      className="p-2 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600 hover:bg-purple-200 transition-colors"
                      title="Tandem yaratish"
                    >
                      <LinkIcon size={14} />
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setDuelOpponent({ id: friend.userId, name: friend.name })
                      setShowDuelModal(true)
                    }}
                    className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600 hover:bg-orange-200 transition-colors"
                    title="Duelga chaqirish"
                  >
                    <Sword size={14} />
                  </button>
                  <button
                    onClick={() => removeFriend(friend.friendshipId)}
                    className="p-2 rounded-lg bg-red-50 dark:bg-red-900/20 text-red-400 hover:bg-red-100 transition-colors"
                    title="O'chirish"
                  >
                    <UserX size={14} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Leaderboard */}
      <FriendLeaderboard />

      {/* Pending Invites */}
      {pendingInvites.length > 0 && (
        <div className="card p-5 space-y-3 border-2 border-yellow-100 dark:border-yellow-900/50">
          <div className="flex items-center gap-2">
            <Clock size={18} className="text-yellow-500" />
            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
              Kutilayotgan takliflar ({pendingInvites.length})
            </h3>
          </div>
          {pendingInvites.map((invite) => (
            <div key={invite.friendshipId} className="flex items-center justify-between p-3 rounded-xl bg-yellow-50 dark:bg-yellow-900/20">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center text-white font-bold text-sm">
                  {invite.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">{invite.name}</p>
                  <p className="text-xs text-gray-400">{invite.level}</p>
                </div>
              </div>
              <button
                onClick={async () => {
                  await acceptFriendRequest(invite.friendshipId)
                  loadAll()
                }}
                className="btn-primary text-xs py-1.5 px-3"
              >
                Qabul qilish
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Pending Duels (Opponent's turn) */}
      {pendingOpponentDuels.length > 0 && (
        <div className="card p-5 space-y-3 border-2 border-blue-100 dark:border-blue-900/50 bg-gradient-to-br from-blue-50/30 to-transparent dark:from-blue-950/20">
          <div className="flex items-center gap-2">
            <Target size={18} className="text-blue-500" />
            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
              Sizni kutayotgan duellar ({pendingOpponentDuels.length})
            </h3>
          </div>
          {pendingOpponentDuels.map((duel) => (
            <div key={duel.id} className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-gray-800/50">
              <div className="flex items-center gap-3">
                <Sword size={16} className="text-orange-500" />
                <div>
                  <p className="font-semibold text-sm text-gray-900 dark:text-gray-100">
                    {duel.mode === 'lesson' ? (duel.lessonTitle ? `📘 ${duel.lessonTitle}` : 'Dars dueli') :
                     duel.mode === 'vocab' ? "So'z dueli" :
                     duel.mode === 'grammar' ? 'Grammatika dueli' :
                     duel.mode === 'reading' ? "O'qish dueli" :
                     'Speaking dueli'}
                  </p>
                  <p className="text-xs text-gray-400">
                    {Math.max(0, Math.floor((new Date(duel.expiresAt).getTime() - Date.now()) / 3600000))} soat qoldi
                  </p>
                </div>
              </div>
              <button
                onClick={async () => {
                  const fullDuel = await getDuelById(duel.id)
                  if (fullDuel) setActiveDuel(fullDuel)
                }}
                className="btn-primary text-xs py-1.5 px-3 flex items-center gap-1"
              >
                O'ynash <ArrowRight size={12} />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Active Duels */}
      {activeDuels.length > 0 && (
        <div className="card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Zap size={18} className="text-orange-500" />
            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
              Faol duellar
            </h3>
          </div>
          {activeDuels.map((duel) => {
            // Challenger hali o'ynamagan (pending + myScore yo'q) → o'ynash navbati
            const myTurnToPlay = duel.status === 'pending' && duel.myScore === null
            return (
              <div key={duel.id} className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50">
                <div className="flex items-center gap-3 min-w-0">
                  <Sword size={16} className="text-orange-500 shrink-0" />
                  <div className="min-w-0">
                    <p className="font-semibold text-sm text-gray-900 dark:text-gray-100 truncate">
                      {duel.mode === 'lesson' && duel.lessonTitle ? `📘 ${duel.lessonTitle}` : `${duel.opponentName} · ${duel.mode}`}
                    </p>
                    <p className="text-xs text-gray-400">
                      {myTurnToPlay ? '⏳ Sizning navbatingiz' : duel.isBot ? '🤖 AI Bot' : "👤 Do'st o'ynashini kutmoqda"}
                    </p>
                  </div>
                </div>
                {myTurnToPlay ? (
                  <button
                    onClick={async () => {
                      const fullDuel = await getDuelById(duel.id)
                      if (fullDuel) setActiveDuel(fullDuel)
                    }}
                    className="text-xs font-semibold text-white bg-orange-500 hover:bg-orange-600 px-3 py-1.5 rounded-lg flex items-center gap-1 shrink-0"
                  >
                    O'ynash <ArrowRight size={12} />
                  </button>
                ) : (
                  <button
                    onClick={() => cancelDuel(duel.id)}
                    className="text-xs text-red-400 hover:text-red-500 px-2 py-1 shrink-0"
                  >
                    Bekor qilish
                  </button>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* ── AI Roleplay Duo ────────────────────────────────────────────── */}
      {tandemPair && (
        <div className="card p-5 space-y-3 border-2 border-pink-100 dark:border-pink-900/50 bg-gradient-to-br from-pink-50/30 to-purple-50/30 dark:from-pink-950/20 dark:to-purple-950/20">
          <div className="flex items-center gap-2">
            <Theater size={18} className="text-pink-500" />
            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">AI Roleplay Duo</h3>
            <span className="ml-auto text-[10px] font-bold px-2 py-0.5 rounded-full bg-gradient-to-r from-pink-100 to-purple-100 dark:from-pink-900/40 dark:to-purple-900/40 text-pink-600 dark:text-pink-400">
              Premium
            </span>
          </div>
          <p className="text-xs text-gray-500">
            2 do'st + AI hakam. Bir scenario'da ikkalangiz ham rol o'ynang va AI dan shaxsiy baho oling.
          </p>
          <button
            onClick={handleRoleplayDuo}
            disabled={creatingDuel}
            className="btn-primary w-full py-2.5 text-sm flex items-center justify-center gap-1.5 bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
          >
            {creatingDuel ? <Loader2 size={16} className="animate-spin" /> : <Theater size={16} />}
            Roleplay Duo boshlash
          </button>
        </div>
      )}

      {/* AI Duel — Quick Start */}
      <div className="card p-5 space-y-3 border-2 border-primary-100 dark:border-primary-900/50 bg-gradient-to-br from-primary-50/30 to-transparent dark:from-primary-950/20">
        <div className="flex items-center gap-2">
          <Bot size={18} className="text-primary-500" />
          <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">AI bilan duel</h3>
        </div>
        <p className="text-xs text-gray-500">
          Do'stingiz bo'lmasa ham — AI bot bilan mashq qiling. Natijalaringizni saqlang!
        </p>
        <div className="grid grid-cols-2 gap-2">
          {(['vocab', 'grammar', 'reading', 'hotseat'] as DuelMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => handleAIDuel(mode)}
              disabled={creatingDuel}
              className="py-2.5 px-3 rounded-xl border-2 border-gray-200 dark:border-gray-700 text-sm font-medium
                         hover:border-primary-300 hover:bg-primary-50 dark:hover:bg-primary-900/20
                         transition-all text-gray-700 dark:text-gray-300 disabled:opacity-40"
            >
              {mode === 'vocab' ? "📚 So'z" :
               mode === 'grammar' ? '📖 Grammatika' :
               mode === 'reading' ? "📄 O'qish" :
               '⚡ Hot Seat'}
            </button>
          ))}
        </div>
      </div>

      {/* Roleplay Duo History */}
      {roleplaySessions.filter(s => s.status === 'completed').length > 0 && (
        <div className="card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Theater size={18} className="text-pink-500" />
            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
              Roleplay Duo tarixi ({roleplaySessions.filter(s => s.status === 'completed').length})
            </h3>
          </div>
          <div className="space-y-1.5">
            {roleplaySessions.filter(s => s.status === 'completed').slice(0, 5).map((s) => (
              <div key={s.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/30 text-xs">
                <div className="flex items-center gap-2">
                  <span>{s.scenarioEmoji}</span>
                  <span className="text-gray-600 dark:text-gray-400">{s.scenarioTitle}</span>
                </div>
                <div className="flex items-center gap-2">
                  {s.scoreA !== null && s.scoreB !== null && (
                    <span className="font-bold text-gray-900 dark:text-gray-100">
                      {s.scoreA} : {s.scoreB}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Duel History */}
      {duelHistory.length > 0 && (
        <div className="card p-5 space-y-3">
          <div className="flex items-center gap-2">
            <Trophy size={18} className="text-yellow-500" />
            <h3 className="font-bold text-sm text-gray-900 dark:text-gray-100">
              Tarix ({duelHistory.length})
            </h3>
          </div>
          <div className="space-y-1.5">
            {duelHistory.slice(0, 5).map((duel) => (
              <div key={duel.id} className="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-800/30 text-xs">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">{duel.mode === 'lesson' ? '📘' : duel.mode === 'vocab' ? '📚' : duel.mode === 'grammar' ? '📖' : '📄'}</span>
                  <span className="text-gray-600 dark:text-gray-400">{duel.mode === 'lesson' && duel.lessonTitle ? duel.lessonTitle : duel.opponentName}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-gray-900 dark:text-gray-100">
                    {duel.myScore ?? '?'} : {duel.theirScore ?? '?'}
                  </span>
                  {duel.myScore !== null && duel.theirScore !== null && (
                    <span className={duel.myScore > duel.theirScore ? 'text-green-500' : duel.myScore < duel.theirScore ? 'text-red-400' : 'text-yellow-500'}>
                      {duel.myScore > duel.theirScore ? "G'alaba" : duel.myScore < duel.theirScore ? "Mag'lubiyat" : 'Durang'}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Neyron Profil Modal */}
      {neyronProfileFriend && (
        <FriendNeyronProfile
          friendId={neyronProfileFriend.id}
          friendName={neyronProfileFriend.name}
          onClose={() => setNeyronProfileFriend(null)}
        />
      )}

      {/* Duel Modal */}
      {showDuelModal && duelOpponent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setShowDuelModal(false)}>
          <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 max-w-sm w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
            <h3 className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1">
              {duelOpponent.name} bilan duel
            </h3>
            <p className="text-sm text-gray-500 mb-4">Rejimni tanlang:</p>
            <div className="space-y-2">
              {(['vocab', 'grammar', 'reading', 'hotseat'] as DuelMode[]).map((mode) => (
                <label
                  key={mode}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    duelMode === mode
                      ? 'border-primary-400 bg-primary-50 dark:bg-primary-900/20'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="duelMode"
                    className="accent-primary-600"
                    checked={duelMode === mode}
                    onChange={() => setDuelMode(mode)}
                  />
                  <span className="font-medium text-sm text-gray-900 dark:text-gray-100">
                    {mode === 'vocab' ? "📚 So'z dueli" :
                     mode === 'grammar' ? '📖 Grammatika dueli' :
                     mode === 'reading' ? "📄 O'qish dueli" :
                     '⚡ Hot Seat'}
                  </span>
                </label>
              ))}
            </div>
            <div className="flex gap-2 mt-4">
              <button onClick={() => setShowDuelModal(false)} className="btn-secondary flex-1 py-2.5 text-sm">
                Bekor qilish
              </button>
              <button
                onClick={handleStartDuel}
                disabled={creatingDuel}
                className="btn-primary flex-1 py-2.5 text-sm flex items-center justify-center gap-1.5"
              >
                {creatingDuel ? <Loader2 size={16} className="animate-spin" /> : <Sword size={16} />}
                Boshlash
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Tandem info footer */}
      <div className="text-center text-xs text-gray-400 space-y-1 pb-4">
        <p>Tandem — do'stingiz bilan birga ingliz tilini o'rganing</p>
        <p>Juftlik Streak, Async Duel va AI hakam bilan</p>
      </div>
    </div>
  )
}
