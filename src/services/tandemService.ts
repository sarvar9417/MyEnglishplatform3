// ═══════════════════════════════════════════════════════════════════════════
// tandemService.ts — Tandem (do'st bilan o'rganish) CRUD
// ═══════════════════════════════════════════════════════════════════════════

import { supabase } from '../lib/supabase'
import { db } from '../lib/db'
import type { Json } from '../types/supabase'
import { monitoring } from '../lib/monitoring'
import { sendBrowserNotification } from '../hooks/useNotifications'
import type { TandemPair, Duel, DuelMode, FriendshipStatus, DuelQuestion, DuelResult } from '../types/tandem'
import type { DailyExercise } from '../data/dailyLessons'
import { fetchBattleQuestionsByMode } from './battleService'
import { getTodayTashkent, addDaysTashkent } from '../utils/tashkentDate'
import { calculateElo, duelScoreToEloScore, INITIAL_ELO, getEloTier } from '../utils/eloRating'

// ─── Constants ────────────────────────────────────────────────────────────────

const DUEL_EXPIRY_HOURS = 24
const QUESTIONS_PER_DUEL = 10

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function getUserId(): Promise<string | null> {
  const { data: { session } } = await supabase.auth.getSession()
  return session?.user.id ?? null
}

// ═══════════════════════════════════════════════════════════════════════════════
//  INVITE CODE (Xavfsiz — random kod, base64 emas)
// ═══════════════════════════════════════════════════════════════════════════════

/**
 * Foydalanuvchi uchun random invite code yaratadi yoki mavjudini qaytaradi.
 * Kod `crypto.getRandomValues` bilan generatsiya qilinadi (base64 emas).
 * Supabase users jadvalidagi invite_code kolonkasida saqlanadi.
 */
export async function getOrCreateInviteCode(userId: string): Promise<string> {
  try {
    // Avval mavjud kodni tekshiramiz
    const { data, error } = await supabase
      .from('users')
      .select('invite_code')
      .eq('id', userId)
      .maybeSingle()
    if (!error && data?.invite_code) return data.invite_code

    // Yangi random kod yaratamiz (8 belgi, alphanumeric uppercase, no ambiguous chars)
    const buf = new Uint8Array(6)
    crypto.getRandomValues(buf)
    const code = Array.from(buf)
      .map(b => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[b % 32])
      .join('')

    // Supabase'ga saqlaymiz
    await supabase
      .from('users')
      .update({ invite_code: code })
      .eq('id', userId)

    return code
  } catch (e) {
    monitoring.captureMessage('getOrCreateInviteCode failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    // Fallback: localStorage'da saqlaymiz (faqat bitta qurilma)
    const localKey = `invite-code-${userId}`
    try {
      const existing = localStorage.getItem(localKey)
      if (existing) return existing
      const buf = new Uint8Array(6)
      crypto.getRandomValues(buf)
      const code = Array.from(buf)
        .map(b => 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'[b % 32])
        .join('')
      localStorage.setItem(localKey, code)
      return code
    } catch {
      // Ultimate fallback
      return Math.random().toString(36).slice(2, 10).toUpperCase()
    }
  }
}

/**
 * Invite code orqali foydalanuvchi ID sini topadi.
 * @returns userId yoki null agar kod topilmasa
 */
export async function lookupUserIdByInviteCode(code: string): Promise<string | null> {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .eq('invite_code', code)
      .maybeSingle()
    if (!error && data?.id) return data.id
    return null
  } catch {
    return null
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  DO'STLIK (Friendship)
// ═══════════════════════════════════════════════════════════════════════════════

/** Invite kodi orqali do'st qo'shish (xavfsiz — random kod, base64 emas) */
export async function addFriendByCode(code: string): Promise<{ success: boolean; error?: string }> {
  const userId = await getUserId()
  if (!userId) return { success: false, error: 'Auth topilmadi' }

  // Random invite code orqali foydalanuvchini topamiz (btoa/atob emas)
  let inviterId = await lookupUserIdByInviteCode(code)

  // Agar yangi random kod topilmasa — eski base64 kod bo'lishi mumkin (backward compat)
  if (!inviterId) {
    try {
      const decoded = atob(code)
      // UUID formatiga o'xshashligini tekshiramiz (36 belgi, chiziqchalar bilan)
      if (decoded.length > 20 && decoded.includes('-')) {
        inviterId = decoded
      }
    } catch { /* base64 emas — shunchaki noto'g'ri kod */ }
  }

  if (!inviterId) {
    return { success: false, error: 'Noto\'g\'ri taklif kodi' }
  }

  if (inviterId === userId) {
    return { success: false, error: 'O\'zingizni qo\'sha olmaysiz' }
  }

  // Mavjud do'stlik yozuvlarini ikki tomondan tekshirish
  // maybeSingle() emas — limit(1) ishlatamiz (ikkita yozuv bo'lsa maybeSingle xato beradi)
  const { data: rows } = await supabase
    .from('friendships')
    .select('id, status, user_id, friend_id')
    .or(`and(user_id.eq.${userId},friend_id.eq.${inviterId}),and(user_id.eq.${inviterId},friend_id.eq.${userId})`)
    .limit(5)

  const existing = (rows ?? [])[0] ?? null
  const extras   = (rows ?? []).slice(1)

  // Agar bir nechta yozuv bo'lsa — duplikatlarni o'chiramiz
  if (extras.length > 0) {
    const ids = extras.map(r => r.id)
    const { error: deleteError } = await supabase.from('friendships').delete().in('id', ids)
    if (deleteError) monitoring.captureMessage('addFriendByCode cleanup error: ' + deleteError.message, 'warn')
  }

  if (existing) {
    if (existing.status === 'accepted') {
      return { success: false, error: 'Bu foydalanuvchi allaqachon do\'stingiz' }
    }
    // Har qanday boshqa status (pending, blocked) — accepted ga o'tkazish
    const { error: acceptError } = await supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('id', existing.id as string)

    if (acceptError) {
      monitoring.captureMessage('addFriendByCode accept error: ' + acceptError.message, 'error')
      return { success: false, error: 'Xatolik yuz berdi' }
    }

    sendBrowserNotification('🤝 Do\'stlik tasdiqlandi!', {
      body: 'Endi tandem yaratishingiz mumkin',
      url: '/tandem',
    })
    return { success: true }
  }

  // Yangi do'stlik — RLS: user_id = auth.uid() bo'lishi shart
  const { error: upsertError } = await supabase
    .from('friendships')
    .upsert(
      { user_id: userId, friend_id: inviterId, status: 'accepted' },
      { onConflict: 'user_id,friend_id' }
    )

  if (upsertError) {
    monitoring.captureMessage('addFriendByCode upsert error: ' + upsertError.message, 'error')
    return { success: false, error: 'Do\'st qo\'shishda xatolik: ' + upsertError.message }
  }

  sendBrowserNotification('🤝 Yangi do\'st!', {
    body: 'Siz do\'stlar ro\'yxatiga qo\'shildingiz',
    url: '/tandem',
  })
  return { success: true }
}

/** Do'st taklifini yuborish (user_id orqali) */
export async function sendFriendRequest(friendId: string): Promise<{ success: boolean; error?: string }> {
  const userId = await getUserId()
  if (!userId) return { success: false, error: 'Auth topilmadi' }

  // upsert — avval pending bo'lsa ham, qayta yuborilsa xato bermasin
  const { error } = await supabase
    .from('friendships')
    .upsert(
      { user_id: userId, friend_id: friendId, status: 'pending' },
      { onConflict: 'user_id,friend_id' }
    )

  if (error) {
    monitoring.captureMessage('sendFriendRequest error: ' + error.message, 'error')
    return { success: false, error: 'Taklif yuborishda xatolik' }
  }

  sendBrowserNotification('📨 Do\'stlik taklifi yuborildi', {
    body: 'Taklifingiz do\'stingizga yetkazildi',
    url: '/tandem',
  })

  return { success: true }
}

/** Do'st taklifini qabul qilish — faqat qabul qiluvchi (friend_id) qabul qila oladi */
export async function acceptFriendRequest(friendshipId: string): Promise<{ success: boolean; error?: string }> {
  const userId = await getUserId()
  if (!userId) return { success: false, error: 'Auth topilmadi' }

  // friend_id = joriy foydalanuvchi sharti — taklif YUBORUVCHI o'zi-o'zini "qabul"
  // qila olmasin (rozilik modeli). RLS ikkala tomonga ruxsat beradi, shu sabab
  // bu cheklov kodda majburlanadi.
  const { error } = await supabase
    .from('friendships')
    .update({ status: 'accepted' })
    .eq('id', friendshipId)
    .eq('friend_id', userId)

  if (error) {
    monitoring.captureMessage('acceptFriendRequest error: ' + error.message, 'error')
    return { success: false, error: 'Qabul qilishda xatolik' }
  }

  return { success: true }
}

/** Do'stni o'chirish (yozuvni to'liq o'chirish — blocked emas) */
export async function removeFriend(friendshipId: string): Promise<{ success: boolean; error?: string }> {
  const { error } = await supabase
    .from('friendships')
    .delete()
    .eq('id', friendshipId)

  if (error) {
    monitoring.captureMessage('removeFriend error: ' + error.message, 'error')
    return { success: false, error: 'O\'chirishda xatolik' }
  }

  return { success: true }
}

/** Do'stlar ro'yxatini olish (profillari bilan) */
export async function getFriends(): Promise<{ id: string; name: string; level: string; streak: number; last_active: string | null; status: FriendshipStatus; friendship_id: string }[]> {
  const userId = await getUserId()
  if (!userId) return []

  // user_id = current user bo'lgan yoki friend_id = current user bo'lgan qatorlar
  const { data, error } = await supabase
    .from('friendships')
    .select(`
      id,
      status,
      user_id,
      friend_id,
      friend:friend_id(id, name, level, streak, last_active),
      inviter:user_id(id, name, level, streak, last_active)
    `)
    .or(`user_id.eq.${userId},friend_id.eq.${userId}`)
    .in('status', ['pending', 'accepted'])

  if (error) {
    monitoring.captureMessage('getFriends error: ' + error.message, 'warn')
    return []
  }

  const friends: { id: string; name: string; level: string; streak: number; last_active: string | null; status: FriendshipStatus; friendship_id: string }[] = []

  for (const row of data ?? []) {
    const rowData = row
    const friendData = userId === rowData.user_id
      ? rowData.friend
      : rowData.inviter

    if (friendData && typeof friendData === 'object' && 'id' in friendData) {
      const f = friendData as Record<string, unknown>
      friends.push({
        id: f.id as string,
        name: f.name as string,
        level: f.level as string,
        streak: (f.streak as number) ?? 0,
        last_active: f.last_active as string | null,
        status: rowData.status as FriendshipStatus,
        friendship_id: rowData.id as string,
      })
    }
  }

  return friends
}

// ═══════════════════════════════════════════════════════════════════════════════
//  JUFTLIK (Tandem Pair)
// ═══════════════════════════════════════════════════════════════════════════════

/** Juftlikni olish (agar mavjud bo'lsa) */
export async function getTandemPair(): Promise<TandemPair | null> {
  const userId = await getUserId()
  if (!userId) return null

  const { data, error } = await supabase
    .from('tandem_pairs')
    .select('*')
    .or(`user_a.eq.${userId},user_b.eq.${userId}`)
    .maybeSingle()

  if (error) {
    monitoring.captureMessage('getTandemPair error: ' + error.message, 'warn')
    return null
  }

  return data as TandemPair
}

/** Juftlik yaratish (do'stlik qabul qilingandan keyin) */
export async function createTandemPair(friendId: string): Promise<{ success: boolean; pair?: TandemPair; error?: string }> {
  const userId = await getUserId()
  if (!userId) return { success: false, error: 'Auth topilmadi' }

  // Race condition: ikki tomon bir vaqtda yaratishga urinsalar — oldin mavjudini tekshir
  const { data: existing } = await supabase
    .from('tandem_pairs')
    .select('*')
    .or(`and(user_a.eq.${userId},user_b.eq.${friendId}),and(user_a.eq.${friendId},user_b.eq.${userId})`)
    .maybeSingle()

  if (existing) return { success: true, pair: existing as TandemPair }

  // Kanonik tartib: user_a har doim lexik kichikrog'i. Aks holda (A,B) va (B,A)
  // unique(user_a,user_b) ostida HAR XIL qator bo'lib, race'da ikkala tomon ham
  // insert qila olardi → dublikat juftlik → getTandemPair().maybeSingle() xato
  // berardi. Kanonik tartibda esa unique constraint race'ni ushlaydi (23505).
  const [ua, ub] = userId < friendId ? [userId, friendId] : [friendId, userId]

  const { data, error } = await supabase
    .from('tandem_pairs')
    .insert({
      user_a: ua,
      user_b: ub,
      combined_streak: 0,
      last_both_active: null,
      total_xp: 0,
    })
    .select()
    .single()

  if (error) {
    // Unique constraint — boshqa tomon parallel yaratgan bo'lishi mumkin
    if (error.code === '23505') {
      const { data: race } = await supabase
        .from('tandem_pairs')
        .select('*')
        .or(`and(user_a.eq.${userId},user_b.eq.${friendId}),and(user_a.eq.${friendId},user_b.eq.${userId})`)
        .maybeSingle()
      if (race) return { success: true, pair: race as TandemPair }
    }
    monitoring.captureMessage('createTandemPair error: ' + error.message, 'error')
    return { success: false, error: 'Juftlik yaratishda xatolik' }
  }

  return { success: true, pair: data as TandemPair }
}

/** Juftlik streakini yangilash (ikkalasi ham bugun dars qilgan bo'lsa) */
export async function updateTandemStreak(): Promise<void> {
  const pair = await getTandemPair()
  if (!pair) return

  // Toshkent vaqti bilan (last_active ham getTodayTashkent bilan yoziladi —
  // UTC ishlatilsa, har kuni 00:00–05:00 oralig'ida sanalar farq qilib,
  // streak noto'g'ri oshardi/reset bo'lardi).
  const today = getTodayTashkent()
  const yesterday = addDaysTashkent(-1)

  // Ikkala userning last_active ni tekshirish
  const { data: users } = await supabase
    .from('users')
    .select('id, last_active, streak')
    .in('id', [pair.user_a, pair.user_b])

  if (!users || users.length < 2) return

  const userA = users.find(u => u.id === pair.user_a)
  const userB = users.find(u => u.id === pair.user_b)
  if (!userA || !userB) return

  const aActive = userA.last_active === today
  const bActive = userB.last_active === today

  if (aActive && bActive) {
    // Bugun allaqachon hisoblangan bo'lsa, qayta oshirmaymiz (kuniga 1 marta).
    // Aks holda foydalanuvchi kuniga bir necha dars qilsa, streak va milestone
    // XP takror-takror oshib ketardi.
    if (pair.last_both_active === today) return
    // Ikkalasi ham bugun faol — streak +1
    const newStreak = pair.combined_streak + 1
    await supabase
      .from('tandem_pairs')
      .update({
        combined_streak: newStreak,
        last_both_active: today,
        freeze_used_on: null, // grace muhlatni tozalaymiz
      })
      .eq('id', pair.id)

    // ─── Juftlik Streak Milestone XP Bonus ────────────────────────
    const TANDEM_STREAK_MILESTONES: { days: number; xp: number }[] = [
      { days: 7,   xp: 30 },
      { days: 14,  xp: 60 },
      { days: 21,  xp: 100 },
      { days: 30,  xp: 150 },
      { days: 60,  xp: 300 },
      { days: 90,  xp: 500 },
    ]

    const milestone = TANDEM_STREAK_MILESTONES.find(m => m.days === newStreak)
    if (milestone) {
      import('../store/useStore').then(({ useStore }) => {
        useStore.getState().addXP(milestone.xp)
        // Award toast
        import('../utils/toastStore').then(({ useToastStore }) => {
          useToastStore.getState().toast(
            `🎉 Juftlik Streak ${milestone.days} kun! +${milestone.xp} XP!`,
            'success', 5000,
          )
        }).catch((e) => monitoring.captureMessage('tandem milestone toast failed: ' + (e instanceof Error ? e.message : String(e)), 'warn'))
      }).catch((e) => {
        monitoring.captureMessage('tandem milestone addXP failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
        import('../utils/toastStore').then(({ useToastStore }) => {
          useToastStore.getState().toast('Juftlik Streak bonusi yuklanmadi', 'warning', 4000)
        }).catch(() => {})
      })

      // Juftlik total_xp ga ham qo'shamiz
      try {
        await supabase
          .from('tandem_pairs')
          .update({ total_xp: pair.total_xp + milestone.xp })
          .eq('id', pair.id)
      } catch (e) {
        monitoring.captureMessage('tandem milestone total_xp update failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
      }
    }
  } else if (pair.last_both_active === yesterday) {
    // Kecha ikkalasi ham faol edi, bugun hali emas — hali kutamiz
  } else if (pair.last_both_active && pair.last_both_active < yesterday) {
    // Streak xavf ostida — bo'shliq HAJMIga qarab qaror qilamiz.
    // (Avval freeze_used_on !== today bilan tekshirilardi — u har kuni yangi
    //  sanaga o'rnatilgani uchun grace cheksiz takrorlanardi: bitta do'st yolg'iz
    //  dars qilib streakni abadiy ushlab turardi.)
    const dayBeforeYesterday = addDaysTashkent(-2)
    if (pair.last_both_active === dayBeforeYesterday) {
      // Aniq 1 kun (kecha) o'tkazib yuborildi — 1 kunlik grace, streak saqlanadi
      await supabase
        .from('tandem_pairs')
        .update({ freeze_used_on: today })
        .eq('id', pair.id)
    } else {
      // 2+ kun o'tkazib yuborildi (grace tugadi) — streak reset
      await supabase
        .from('tandem_pairs')
        .update({ combined_streak: 0, freeze_used_on: null, last_both_active: null })
        .eq('id', pair.id)
    }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  ASYNC DUEL
// ═══════════════════════════════════════════════════════════════════════════════

/** Duelni ID bo'yicha olish */
export async function getDuelById(duelId: string): Promise<Duel | null> {
  try {
    const { data, error } = await supabase
      .from('duels')
      .select('*')
      .eq('id', duelId)
      .single()
    if (error) throw error
    return data as unknown as Duel
  } catch (e) {
    monitoring.captureMessage('getDuelById failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return null
  }
}

/** Yangi async duel yaratish */
export async function createDuel(
  opponentId: string | null,
  mode: DuelMode,
  level: string = 'B1'
): Promise<{ success: boolean; duel?: Duel; error?: string }> {
  const userId = await getUserId()
  if (!userId) return { success: false, error: 'Auth topilmadi' }

  // Savollarni olish (mode bo'yicha)
  const questionCount = mode === 'reading' ? 4 : QUESTIONS_PER_DUEL
  const { questions, passage } = await fetchBattleQuestionsByMode(level as 'A1' | 'A2' | 'B1' | 'B2', questionCount, mode)
  if (questions.length === 0) {
    return { success: false, error: 'Savollar topilmadi' }
  }

  const questionSet: DuelQuestion[] = questions.map(q => ({
    id: q.id,
    english: q.english,
    options: q.options,
    correct: q.correct,
    ...(passage ? { passage } : {}),
  }))

  const expiresAt = new Date(Date.now() + DUEL_EXPIRY_HOURS * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from('duels')
    .insert({
      challenger: userId,
      opponent: opponentId,
      mode,
      status: 'pending',  // challenger avval o'ynaydi, keyin opponent_turn ga o'tadi
      question_set: questionSet as unknown as Json,
      challenger_score: null,
      opponent_score: null,
      is_bot: !opponentId,
      expires_at: expiresAt,
    })
    .select()
    .single()

  if (error) {
    monitoring.captureMessage('createDuel error: ' + error.message, 'error')
    return { success: false, error: 'Duel yaratishda xatolik' }
  }

  // Agar AI bot bo'lsa — darhol AI javobini hisoblash
  if (!opponentId) {
    await submitAIAnswer(data.id, questions.length)
  }
  // Friend duel: notification opponentga challenger o'ynagandan keyin yuboriladi (submitDuelAnswers da)

  return { success: true, duel: data as unknown as Duel }
}

/**
 * Kunlik darsning multiple-choice mashqlarini duel savollariga aylantiradi.
 * Faqat 'multiple-choice' turidagi mashqlar duelga mos keladi.
 */
export function lessonExercisesToDuelQuestions(
  exercises: DailyExercise[],
  max: number = QUESTIONS_PER_DUEL,
): DuelQuestion[] {
  const out: DuelQuestion[] = []
  for (const ex of exercises) {
    if (ex.type !== 'multiple-choice') continue
    const correctIdx = ex.options.indexOf(ex.correct)
    if (correctIdx < 0) continue // to'g'ri javob options ichida topilmasa — o'tkazib yuboramiz
    out.push({
      id: ex.id,
      english: ex.question,
      options: [...ex.options],
      correct: correctIdx,
    })
    if (out.length >= max) break
  }
  return out
}

/**
 * Dars duel'i yaratish — aynan tugatilgan darsning mashqlaridan.
 * questions LessonView'da lessonExercisesToDuelQuestions orqali tayyorlanadi.
 */
export async function createLessonDuel(
  opponentId: string | null,
  lessonId: string,
  lessonTitle: string,
  questions: DuelQuestion[],
): Promise<{ success: boolean; duel?: Duel; error?: string }> {
  const userId = await getUserId()
  if (!userId) return { success: false, error: 'Auth topilmadi' }
  if (questions.length === 0) {
    return { success: false, error: 'Bu darsda duel uchun yetarli savol yo\'q' }
  }

  const expiresAt = new Date(Date.now() + DUEL_EXPIRY_HOURS * 60 * 60 * 1000).toISOString()

  const { data, error } = await supabase
    .from('duels')
    .insert({
      challenger: userId,
      opponent: opponentId,
      mode: 'lesson',
      status: 'pending',
      question_set: questions as unknown as Json,
      challenger_score: null,
      opponent_score: null,
      is_bot: !opponentId,
      lesson_id: lessonId,
      lesson_title: lessonTitle,
      expires_at: expiresAt,
    })
    .select()
    .single()

  if (error) {
    monitoring.captureMessage('createLessonDuel error: ' + error.message, 'error')
    return { success: false, error: 'Dars duel yaratishda xatolik' }
  }

  // AI bot bilan duel bo'lsa — darhol AI javobini hisoblaymiz
  if (!opponentId) {
    await submitAIAnswer(data.id, questions.length)
  }

  return { success: true, duel: data as unknown as Duel }
}

/** AI botning javobini hisoblash (savol soni asosida 70% aniqlik) */
async function submitAIAnswer(duelId: string, questionCount: number): Promise<void> {
  let correctCount = 0
  for (let i = 0; i < questionCount; i++) {
    if (Math.random() < 0.7) correctCount++
  }

  const { error } = await supabase
    .from('duels')
    .update({ opponent_score: correctCount, status: 'done' })
    .eq('id', duelId)

  if (error) monitoring.captureMessage('submitAIAnswer error: ' + error.message, 'error')
}

/** Duelga javob yozish (challenger o'ynaganida) */
export async function submitDuelAnswers(
  duelId: string,
  answers: { questionIndex: number; answerIndex: number }[]
): Promise<{ success: boolean; score?: number; error?: string }> {
  const userId = await getUserId()
  if (!userId) return { success: false, error: 'Auth topilmadi' }

  // Duelni olish
  const { data: duel, error: fetchError } = await supabase
    .from('duels')
    .select('*')
    .eq('id', duelId)
    .single()

  if (fetchError || !duel) {
    return { success: false, error: 'Duel topilmadi' }
  }

  // Faqat challenger javob berishi mumkin (yoki opponent agar uning turni bo'lsa)
  const isChallenger = duel.challenger === userId
  if (!isChallenger && duel.opponent !== userId) {
    return { success: false, error: 'Bu duel sizga tegishli emas' }
  }

  // Idempotensiya: allaqachon javob berilgan bo'lsa, qayta qabul qilmaymiz.
  // Aks holda qayta yuborishda (double-click/qayta o'ynash) XP takror beriladi
  // va ball/status buziladi.
  if (isChallenger && duel.challenger_score !== null) {
    return { success: false, error: 'Siz allaqachon javob bergansiz' }
  }
  if (!isChallenger && duel.opponent_score !== null) {
    return { success: false, error: 'Siz allaqachon javob bergansiz' }
  }

  // Ballni hisoblash
  const questions = db.jsonFrom<DuelQuestion[]>(duel.question_set) ?? []
  let correctCount = 0
  for (const answer of answers) {
    const q = questions[answer.questionIndex]
    if (q && answer.answerIndex === q.correct) {
      correctCount++
    }
  }

  // Friend duel: challenger o'ynagandan keyin opponent_turn, AI duelda darhol done
  const isFriendDuel = !duel.is_bot && duel.opponent !== null
  const nextStatus = isChallenger && isFriendDuel ? 'opponent_turn' : 'done'

  const { error } = await supabase
    .from('duels')
    .update({
      status: nextStatus,
      ...(isChallenger ? { challenger_score: correctCount } : { opponent_score: correctCount }),
    })
    .eq('id', duelId)

  if (error) {
    monitoring.captureMessage('submitDuelAnswers error: ' + error.message, 'error')
    return { success: false, error: 'Javoblarni saqlashda xatolik' }
  }

  // Javob saqlangani haqida notification
  sendBrowserNotification('⚔️ Javoblaringiz saqlandi!', {
    body: isFriendDuel && isChallenger
      ? "Do'stingizning javobini kutish qoldi — u 24 soat ichida o'ynashi kerak"
      : duel.is_bot
        ? 'AI bilan duelingiz yakunlandi — natijani tekshiring!'
        : 'Duel yakunlandi — natijani tekshiring!',
    url: '/tandem',
  })

  // ─── AI hakam bahosi ───────────────────────────────
  const duelComplete = true
  if (duelComplete) {
    // Fire-and-forget: AI hakamni chaqirish vaqt talab qiladi, bloklamaymiz
    saveDuelVerdict(duelId, userId, duel.mode as DuelMode, correctCount, questions.length)
      .catch((e) => monitoring.captureMessage('saveDuelVerdict fire-and-forget failed: ' + (e instanceof Error ? e.message : String(e)), 'warn'))
  }

  // ─── XP Bonus: to'g'ri javoblar uchun ─────────────────────────────
  const xpEarned = correctCount * 10
  import('../store/useStore').then(({ useStore }) => {
    useStore.getState().addXP(xpEarned)
  }).catch((e) => {
    monitoring.captureMessage('submitDuelAnswers addXP import failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    import('../utils/toastStore').then(({ useToastStore }) => {
      useToastStore.getState().toast('XP bonusni qo\'lda qo\'shing — avtomatik yuklanmadi', 'warning', 4000)
    }).catch(() => {})
  })

  // Tandem juftlik total_xp ni oshirish
  try {
    const { data: pair } = await supabase
      .from('tandem_pairs')
      .select('id, total_xp')
      .or(`user_a.eq.${userId},user_b.eq.${userId}`)
      .maybeSingle()

    if (pair) {
      await supabase
        .from('tandem_pairs')
        .update({ total_xp: pair.total_xp + xpEarned })
        .eq('id', pair.id)
    }
  } catch (e) {
    monitoring.captureMessage('submitDuelAnswers total_xp update failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
  }

  // Duel tugadi — Elo ratingni yangilaymiz
  const isDuelDone = nextStatus === 'done' || !isChallenger
  // Ikkala o'yinchi ham o'ynagan bo'lsa, Elo hisoblanadi
  const bothPlayed = isChallenger
    ? duel.opponent_score !== null   // challenger: AI/raqib allaqachon o'ynagan
    : duel.challenger_score !== null // opponent: challenger o'ynagan (opponent_score endi yoziladi)
  if (isDuelDone && bothPlayed) {
    const oppName = duel.is_bot ? 'AI Bot' : 'Raqib'
    // always the caller's own score as myScore
    const totalMyScore = correctCount
    const totalTheirScore = isChallenger
      ? (duel.opponent_score ?? 0)     // challenger: opponent's score
      : (duel.challenger_score ?? 0)   // opponent: challenger's score
    updateEloAfterDuel(userId, duel.opponent, totalMyScore, totalTheirScore, duelId, oppName)
      .catch((e) => monitoring.captureMessage('submitDuelAnswers Elo update failed: ' + (e instanceof Error ? e.message : String(e)), 'warn'))
  }

  return { success: true, score: correctCount }
}

/** Challenger o'ynaganidan keyin, opponentga notification */
export async function getOpponentPendingDuels(): Promise<Duel[]> {
  const userId = await getUserId()
  if (!userId) return []

  const { data, error } = await supabase
    .from('duels')
    .select('*')
    .eq('opponent', userId)
    .eq('status', 'opponent_turn')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    monitoring.captureMessage('getPendingDuels error: ' + error.message, 'warn')
    return []
  }

  return (data ?? []) as unknown as Duel[]
}

/** Faol duellar ro'yxati */
export async function getActiveDuels(): Promise<Duel[]> {
  const userId = await getUserId()
  if (!userId) return []

  const { data, error } = await supabase
    .from('duels')
    .select('*')
    .or(`challenger.eq.${userId},opponent.eq.${userId}`)
    .in('status', ['pending', 'opponent_turn'])
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    monitoring.captureMessage('getActiveDuels error: ' + error.message, 'warn')
    return []
  }

  return (data ?? []) as unknown as Duel[]
}

/** Tugagan duellar tarixi */
export async function getDuelHistory(): Promise<Duel[]> {
  const userId = await getUserId()
  if (!userId) return []

  const { data, error } = await supabase
    .from('duels')
    .select('*')
    .or(`challenger.eq.${userId},opponent.eq.${userId}`)
    .eq('status', 'done')
    .order('created_at', { ascending: false })
    .limit(20)

  if (error) {
    monitoring.captureMessage('getDuelHistory error: ' + error.message, 'warn')
    return []
  }

  return (data ?? []) as unknown as Duel[]
}

// ═══════════════════════════════════════════════════════════════════════════════
//  AI HAKAM (Duel Verdict)

// ═══════════════════════════════════════════════════════════════════════════
//  ELO RATING
// ═══════════════════════════════════════════════════════════════════════════

/** Foydalanuvchining Elo ratingini olish */
export async function getUserElo(userId: string): Promise<{ rating: number; tier: string; matchesPlayed: number; wins: number; losses: number; draws: number }> {
  try {
    const { data, error } = await supabase
      .from('user_elo')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) throw error

    if (data) {
      const rating = data.rating as number
      return {
        rating,
        tier: getEloTier(rating),
        matchesPlayed: (data.matches_played as number) ?? 0,
        wins: (data.wins as number) ?? 0,
        losses: (data.losses as number) ?? 0,
        draws: (data.draws as number) ?? 0,
      }
    }

    return { rating: INITIAL_ELO, tier: getEloTier(INITIAL_ELO), matchesPlayed: 0, wins: 0, losses: 0, draws: 0 }
  } catch (e) {
    monitoring.captureMessage('getUserElo failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return { rating: INITIAL_ELO, tier: getEloTier(INITIAL_ELO), matchesPlayed: 0, wins: 0, losses: 0, draws: 0 }
  }
}

/** Duel tugagandan keyin Elo ratingni yangilash */
export async function updateEloAfterDuel(
  userId: string,
  opponentId: string | null,
  myScore: number,
  theirScore: number,
  duelId: string,
  opponentName: string = 'Raqib',
): Promise<{ myNewRating: number; change: number }> {
  try {
    const myElo = await getUserElo(userId)
    let theirRating = INITIAL_ELO

    if (opponentId && opponentId !== 'ai') {
      const theirElo = await getUserElo(opponentId)
      theirRating = theirElo.rating
    }

    const { my, their } = duelScoreToEloScore(myScore, theirScore)
    const result = calculateElo(myElo.rating, theirRating, my, their)

    const myChange = result.changeA
    const myNewRating = result.playerA

    await supabase
      .from('user_elo')
      .upsert({
        user_id: userId,
        rating: myNewRating,
        matches_played: myElo.matchesPlayed + 1,
        wins: myElo.wins + (my === 1 ? 1 : 0),
        losses: myElo.losses + (my === 0 ? 1 : 0),
        draws: myElo.draws + (my === 0.5 ? 1 : 0),
        updated_at: new Date().toISOString(),
      }, { onConflict: 'user_id' })

    const resultLabel = my === 1 ? 'win' : my === 0.5 ? 'draw' : 'loss'
    await supabase
      .from('elo_history')
      .insert({
        user_id: userId,
        duel_id: duelId,
        old_rating: myElo.rating,
        new_rating: myNewRating,
        change: myChange,
        opponent_name: opponentName,
        result: resultLabel,
      })

    if (opponentId && opponentId !== 'ai' && opponentId !== userId) {
      const theirNewRating = result.playerB
      const theirEloData = await getUserElo(opponentId)

      await supabase
        .from('user_elo')
        .upsert({
          user_id: opponentId,
          rating: theirNewRating,
          matches_played: theirEloData.matchesPlayed + 1,
          wins: theirEloData.wins + (their === 1 ? 1 : 0),
          losses: theirEloData.losses + (their === 0 ? 1 : 0),
          draws: theirEloData.draws + (their === 0.5 ? 1 : 0),
          updated_at: new Date().toISOString(),
        }, { onConflict: 'user_id' })
    }

    return { myNewRating, change: myChange }
  } catch (e) {
    monitoring.captureMessage('updateEloAfterDuel failed: ' + (e instanceof Error ? e.message : String(e)), 'error')
    return { myNewRating: INITIAL_ELO, change: 0 }
  }
}

/** Foydalanuvchining Elo tarixini olish (oxirgi 20 ta) */
export async function getEloHistory(userId: string): Promise<{ id: string; oldRating: number; newRating: number; change: number; opponentName: string; result: string; createdAt: string }[]> {
  try {
    const { data, error } = await supabase
      .from('elo_history')
      .select('id, old_rating, new_rating, change, opponent_name, result, created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) throw error

    return (data ?? []).map(r => ({
      id: r.id,
      oldRating: r.old_rating,
      newRating: r.new_rating,
      change: r.change,
      opponentName: r.opponent_name,
      result: r.result,
      createdAt: r.created_at ?? '',
    }))
  } catch (e) {
    monitoring.captureMessage('getEloHistory failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return []
  }
}

/** Do'stlar orasida Elo reytingi */
export interface EloLeaderboardEntry {
  userId: string
  name: string
  level: string
  elo: number
  tier: string
  wins: number
  losses: number
  matchesPlayed: number
  isCurrentUser: boolean
}

/** Elo bo'yicha leaderboard (do'stlar orasida) */
export async function getEloLeaderboard(): Promise<EloLeaderboardEntry[]> {
  const userId = await getUserId()
  if (!userId) return []

  try {
    const friends = await getFriends()
    const acceptedFriendIds = friends.filter(f => f.status === 'accepted').map(f => f.id)
    const allIds = [userId, ...acceptedFriendIds]

    const { data: eloData } = await supabase
      .from('user_elo')
      .select('user_id, rating, matches_played, wins, losses, draws')
      .in('user_id', allIds)

    const eloMap = new Map<string, { rating: number; matchesPlayed: number; wins: number; losses: number; draws: number }>()
    for (const row of (eloData ?? [])) {
      eloMap.set(row.user_id as string, {
        rating: (row.rating as number) ?? INITIAL_ELO,
        matchesPlayed: (row.matches_played as number) ?? 0,
        wins: (row.wins as number) ?? 0,
        losses: (row.losses as number) ?? 0,
        draws: (row.draws as number) ?? 0,
      })
    }

    const { data: usersData } = await supabase
      .from('users')
      .select('id, name, level')
      .in('id', allIds)

    const entries: EloLeaderboardEntry[] = []

    for (const user of (usersData ?? [])) {
      const uId = user.id as string
      const eloInfo = eloMap.get(uId) ?? { rating: INITIAL_ELO, matchesPlayed: 0, wins: 0, losses: 0, draws: 0 }

      entries.push({
        userId: uId,
        name: user.name as string,
        level: user.level as string,
        elo: eloInfo.rating,
        tier: getEloTier(eloInfo.rating),
        wins: eloInfo.wins,
        losses: eloInfo.losses,
        matchesPlayed: eloInfo.matchesPlayed,
        isCurrentUser: uId === userId,
      })
    }

    entries.sort((a, b) => b.elo - a.elo)

    return entries
  } catch (e) {
    monitoring.captureMessage('getEloLeaderboard failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return []
  }
}

// ═══════════════════════════════════════════════════════════════════════════════

/**
 * AI hakam bahosini generatsiya qiladi va duel_results ga saqlaydi.
 * Har bir o'yinchi uchun alohida chaqiriladi.
 */
export async function saveDuelVerdict(
  duelId: string,
  userId: string,
  mode: DuelMode,
  score: number,
  totalQuestions: number
): Promise<{ success: boolean; result?: DuelResult; error?: string }> {
  try {
    const { generateDuelVerdict } = await import('../lib/claude')

    // Qisqacha question summary — qanday turdagi savollar
    const modeMap: Record<string, string> = {
      vocab:    'vocabulary matching, word definitions',
      grammar:  'grammar structure, sentence formation',
      reading:  'reading comprehension, inference',
      speaking: 'spoken fluency, pronunciation',
      hotseat:  'hotseat rapid-fire mixed questions',
    }
    const questionSummary = modeMap[mode] ?? 'mixed vocabulary and grammar'

    const verdict = await generateDuelVerdict('B1', mode, totalQuestions, score, questionSummary)

    const { data, error } = await supabase
      .from('duel_results')
      .upsert({
        duel_id: duelId,
        user_id: userId,
        grammar_score: verdict.grammar_score,
        vocab_score: verdict.vocab_score,
        topic_score: verdict.topic_score,
        feedback: verdict.feedback,
      }, { onConflict: 'duel_id,user_id' })
      .select()
      .single()

    if (error) {
      monitoring.captureMessage('saveDuelVerdict error: ' + error.message, 'warn')
      return { success: false, error: 'Baholashda xatolik' }
    }

    return { success: true, result: data as DuelResult }
  } catch (e) {
    monitoring.captureMessage('saveDuelVerdict failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return { success: false, error: 'AI hakam xatosi' }
  }
}

/**
 * Speaking duel uchun AI baholash + natijalarni saqlash.
 * evaluateSpeech → avgScore → duel.score + duel_results
 */
export async function submitSpeakingDuelAnswer(
  duelId: string,
  prompt: string,
  transcript: string,
  level: string = 'B1'
): Promise<{ success: boolean; score?: number; feedback?: string; error?: string }> {
  const userId = await getUserId()
  if (!userId) return { success: false, error: 'Auth topilmadi' }

  // Duelni olish
  const { data: duel, error: fetchError } = await supabase
    .from('duels')
    .select('*')
    .eq('id', duelId)
    .single()

  if (fetchError || !duel) {
    return { success: false, error: 'Duel topilmadi' }
  }

  const isChallenger = duel.challenger === userId
  if (!isChallenger && duel.opponent !== userId) {
    return { success: false, error: 'Bu duel sizga tegishli emas' }
  }

  // Idempotensiya: allaqachon javob berilgan bo'lsa qayta qabul qilmaymiz
  // (aks holda qayta yuborishda XP avgScore*15 takror berilardi).
  if (isChallenger && duel.challenger_score !== null) {
    return { success: false, error: 'Siz allaqachon javob bergansiz' }
  }
  if (!isChallenger && duel.opponent_score !== null) {
    return { success: false, error: 'Siz allaqachon javob bergansiz' }
  }

  try {
    // AI eval
    let fluencyScore = 5
    let grammarScore = 5
    let vocabScore = 5
    let feedbackText = ''

    // Agar transcript bo'lmasa — minimal rekvizit
    if (!transcript || transcript.trim().length < 3) {
      fluencyScore = 0
      grammarScore = 0
      vocabScore = 0
      feedbackText = "Hech narsa eshitilmadi. Iltimos, yana urinib ko'ring va aniqroq gapiring."
    } else {
      try {
        const { evaluateSpeech } = await import('../lib/claude')
        // Non-stream evaluation
        const evalPromise = new Promise<{ fluency: number; grammar: number; vocab: number; feedback: string }>(
          (resolve) => {
            let full = ''
            const scores = { fluency: 5, grammar: 5, vocab: 5, feedback: '' }
            evaluateSpeech(
              prompt,
              transcript,
              level,
              (token) => { full += token },
              () => {
                // Parse the non-stream response
                const fluMatch = full.match(/FLUENCY:\s*(\d+)/i)
                const graMatch = full.match(/GRAMMAR:\s*(\d+)/i)
                const vocMatch = full.match(/VOCABULARY:\s*(\d+)/i)
                const fb = full.split('FEEDBACK:')[1]?.trim() ?? ''
                scores.fluency = fluMatch ? Math.max(0, Math.min(10, parseInt(fluMatch[1], 10))) : 5
                scores.grammar = graMatch ? Math.max(0, Math.min(10, parseInt(graMatch[1], 10))) : 5
                scores.vocab = vocMatch ? Math.max(0, Math.min(10, parseInt(vocMatch[1], 10))) : 5
                scores.feedback = fb.slice(0, 500)
                resolve(scores)
              },
              () => {
                resolve(scores) // defaults on error
              }
            )
          }
        )
        const result = await evalPromise
        fluencyScore = result.fluency
        grammarScore = result.grammar
        vocabScore = result.vocab
        feedbackText = result.feedback
      } catch {
        // Fallback: score based on transcript length
        const wordCount = transcript.split(/\s+/).filter(Boolean).length
        fluencyScore = Math.max(1, Math.min(10, Math.round(wordCount / 10)))
        grammarScore = Math.max(1, Math.min(10, 6))
        vocabScore = Math.max(1, Math.min(10, Math.round(wordCount / 15)))
        feedbackText = "AI baholashda xatolik. Taxminiy ball hisoblandi."
      }
    }

    // Average score (1-10 scale) → normalize to 0-10 scale
    const avgScore = Math.round((fluencyScore + grammarScore + vocabScore) / 3)

    // Save to duel — friend duelida challenger o'ynagach opponent navbati.
    // (Avval har doim 'done' edi → friend speaking duelida opponent navbatini
    //  hech qachon ololmasdi.)
    const isFriendDuel = !duel.is_bot && duel.opponent !== null
    const nextStatus = isChallenger && isFriendDuel ? 'opponent_turn' : 'done'
    const { error } = await supabase
      .from('duels')
      .update({
        status: nextStatus,
        ...(isChallenger ? { challenger_score: avgScore } : { opponent_score: avgScore }),
      })
      .eq('id', duelId)

    if (error) {
      monitoring.captureMessage('submitSpeakingDuelAnswer error: ' + error.message, 'error')
      return { success: false, error: 'Natijani saqlashda xatolik' }
    }

    // Save AI verdict to duel_results
    if (feedbackText) {
      try {
        await supabase
          .from('duel_results')
          .upsert({
            duel_id: duelId,
            user_id: userId,
            grammar_score: grammarScore,
            vocab_score: vocabScore,
            topic_score: fluencyScore,
            feedback: feedbackText.slice(0, 2000),
          }, { onConflict: 'duel_id,user_id' })
      } catch { /* non-critical */ }
    }

    // XP bonus
    const xpEarned = avgScore * 15
    import('../store/useStore').then(({ useStore }) => {
      useStore.getState().addXP(xpEarned)
    }).catch((e) => {
      monitoring.captureMessage('submitSpeakingDuelAnswer addXP failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
      import('../utils/toastStore').then(({ useToastStore }) => {
        useToastStore.getState().toast('XP bonusni qo\'lda qo\'shing — avtomatik yuklanmadi', 'warning', 4000)
      }).catch(() => {})
    })

    // ─── Speaking duel Elo rating ────────────────────────────────
    if (nextStatus === 'done') {
      const oppId = duel.opponent ?? null
      const oppName = duel.is_bot ? 'AI Bot' : 'Raqib'
      // always the caller's own score as myScore
      const totalMyScore = avgScore
      const totalTheirScore = isChallenger
        ? (duel.opponent_score ?? 5)   // challenger: opponent's AI score (avg 5)
        : (duel.challenger_score ?? 5) // opponent: challenger's score
      updateEloAfterDuel(userId, oppId, totalMyScore, totalTheirScore, duelId, oppName)
        .catch((e) => monitoring.captureMessage('submitSpeakingDuelAnswer Elo failed: ' + (e instanceof Error ? e.message : String(e)), 'warn'))
    }

    sendBrowserNotification('🎤 Speaking duelingiz baholandi!', {
      body: `${avgScore}/10 — natijani tekshiring!`,
      url: '/tandem',
    })

    return { success: true, score: avgScore, feedback: feedbackText }
  } catch (e) {
    monitoring.captureMessage('submitSpeakingDuelAnswer failed: ' + (e instanceof Error ? e.message : String(e)), 'error')
    return { success: false, error: 'Speaking duelda xatolik' }
  }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  WEEKLY DUEL
// ═══════════════════════════════════════════════════════════════════════════════

export interface WeeklyDuelData {
  id: string
  pair_id: string
  week_start: string
  user_a_xp: number
  user_b_xp: number
  winner_id: string | null
  settled_at: string | null
}

/** Joriy haftadagi weekly duelni olish yoki yaratish */
export async function getOrCreateWeeklyDuel(pairId: string): Promise<WeeklyDuelData | null> {
  try {
    const { getWeekStart } = await import('../data/leagues')
    const weekStart = getWeekStart()

    // Mavjud bo'lsa — qaytaramiz
    const { data: existing } = await supabase
      .from('weekly_duels')
      .select('*')
      .eq('pair_id', pairId)
      .eq('week_start', weekStart)
      .maybeSingle()

    if (existing) return existing as WeeklyDuelData

    // O'tgan haftani yakunlash
    await settleWeeklyDuel(pairId)

    // Yangi yaratamiz
    const { data: newDuel } = await supabase
      .from('weekly_duels')
      .insert({
        pair_id: pairId,
        week_start: weekStart,
        user_a_xp: 0,
        user_b_xp: 0,
      })
      .select()
      .single()

    return newDuel as WeeklyDuelData | null
  } catch (e) {
    monitoring.captureMessage('getOrCreateWeeklyDuel failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return null
  }
}

/** Weekly duel XP ni yangilash (tandem pair a'zosi XP oshganda) */
export async function updateWeeklyDuelXP(userId: string, xpAmount: number): Promise<void> {
  const pair = await getTandemPair()
  if (!pair) return

  const { getWeekStart } = await import('../data/leagues')
  const weekStart = getWeekStart()

  const isUserA = pair.user_a === userId
  const field = isUserA ? 'user_a_xp' : 'user_b_xp'

  try {
    await supabase.rpc('increment_weekly_xp', {
      p_pair_id: pair.id,
      p_week_start: weekStart,
      p_field: field,
      p_amount: xpAmount,
    })
  } catch {
    // RPC bo'lmasa — upsert bilan update
    try {
      const duel = await getOrCreateWeeklyDuel(pair.id)
      if (!duel) return

      const xpValue = (isUserA ? duel.user_a_xp : duel.user_b_xp) + xpAmount

      if (isUserA) {
        await supabase.from('weekly_duels').update({ user_a_xp: xpValue }).eq('id', duel.id)
      } else {
        await supabase.from('weekly_duels').update({ user_b_xp: xpValue }).eq('id', duel.id)
      }
    } catch { /* ignore */ }
  }
}

/** Hafta yakunida g'olibni aniqlash va belgilash */
export async function settleWeeklyDuel(pairId: string): Promise<{ winnerId: string | null; draw: boolean }> {
  try {
    const { getWeekStart } = await import('../data/leagues')
    const weekStart = getWeekStart()

    // O'tgan haftadagi weekly duelni olish
    const lastMonday = new Date(weekStart + 'T00:00:00Z')
    lastMonday.setUTCDate(lastMonday.getUTCDate() - 7)
    const lastWeekStart = lastMonday.toISOString().split('T')[0]

    const { data: duel } = await supabase
      .from('weekly_duels')
      .select('*')
      .eq('pair_id', pairId)
      .eq('week_start', lastWeekStart)
      .maybeSingle()

    if (!duel || duel.settled_at) return { winnerId: null, draw: false }

    const userA = duel.user_a_xp
    const userB = duel.user_b_xp

    let winnerId: string | null = null
    if (userA !== userB) {
      const { data: pair, error: pairError } = await supabase
        .from('tandem_pairs')
        .select('user_a, user_b')
        .eq('id', pairId)
        .single()
      if (pairError) {
        monitoring.captureMessage('settleWeeklyDuel pair fetch error: ' + pairError.message, 'warn')
        return { winnerId: null, draw: false }
      }
      winnerId = userA > userB ? (pair?.user_a ?? null) : (pair?.user_b ?? null)
    }

    const draw = userA === userB

    // Compare-and-swap: faqat hali yakunlanmagan (settled_at IS NULL) bo'lsa
    // yakunlaymiz. Aks holda ikki bir vaqtdagi chaqiruv (ikki qurilma yoki
    // dashboard ikki marta yuklansa) g'olibga +100 XP ni IKKI marta berardi.
    const { data: settled } = await supabase
      .from('weekly_duels')
      .update({
        winner_id: winnerId,
        settled_at: new Date().toISOString(),
      })
      .eq('id', duel.id)
      .is('settled_at', null)
      .select('id')

    // Boshqa chaqiruv allaqachon yakunlagan bo'lsa — bonus bermaymiz
    if (!settled || settled.length === 0) return { winnerId, draw }

    // G'olibga XP bonus (faqat joriy foydalanuvchi g'olib bo'lsa)
    if (winnerId) {
      const currentUserId = await getUserId()
      if (currentUserId === winnerId) {
        import('../store/useStore').then(({ useStore }) => {
          useStore.getState().addXP(100)
        }).catch((e) => {
          monitoring.captureMessage('settleWeeklyDuel addXP failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
          import('../utils/toastStore').then(({ useToastStore }) => {
            useToastStore.getState().toast('Haftalik g\'alaba bonusi yuklanmadi', 'warning', 4000)
          }).catch(() => {})
        })
      }
    }

    return { winnerId, draw }
  } catch (e) {
    monitoring.captureMessage('settleWeeklyDuel failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return { winnerId: null, draw: false }
  }
}

/** Foydalanuvchining jami g'alabalar soni */
export async function getWeeklyDuelWins(userId: string): Promise<number> {
  try {
    const { count } = await supabase
      .from('weekly_duels')
      .select('*', { count: 'exact', head: true })
      .eq('winner_id', userId)
    return count ?? 0
  } catch {
    return 0
  }
}

/** Duelni bekor qilish */
export async function cancelDuel(duelId: string): Promise<{ success: boolean; error?: string }> {
  const userId = await getUserId()
  if (!userId) return { success: false, error: 'Auth topilmadi' }

  const { error } = await supabase
    .from('duels')
    .update({ status: 'expired' })
    .eq('id', duelId)
    .eq('challenger', userId)

  if (error) {
    monitoring.captureMessage('cancelDuel error: ' + error.message, 'error')
    return { success: false, error: 'Bekor qilishda xatolik' }
  }

  return { success: true }
}

// ═══════════════════════════════════════════════════════════════════════════════
//  DARS TAVSIYALARI (Friends' Lesson Progress)
// ═══════════════════════════════════════════════════════════════════════════════

export interface FriendLessonProgress {
  friendId: string
  friendName: string
  /** Do'st o'tgan darslar (user hali o'tmagan) */
  lessons: { lessonId: string; lessonTitle: string; score: number }[]
}

/**
 * Do'stlarning dars progressini olib, foydalanuvchi hali o'tmagan darslarni qaytaradi.
 * Foydalanuvchi o'zi o'tgan darslarni chiqarib tashlaydi.
 */
export async function getFriendsLessonRecommendations(
  userProgress: Record<string, number>,
): Promise<FriendLessonProgress[]> {
  const userId = await getUserId()
  if (!userId) return []

  const friends = await getFriends()
  const acceptedFriends = friends.filter((f) => f.status === 'accepted')
  if (acceptedFriends.length === 0) return []

  const friendIds = acceptedFriends.map((f) => f.id)
  const friendNameMap = new Map(acceptedFriends.map((f) => [f.id, f.name]))

  try {
    // Do'stlarning lesson_progress ma'lumotlarini olish
    const { data } = await supabase
      .from('lesson_progress')
      .select('user_id, lesson_id, score')
      .in('user_id', friendIds)

    if (!data || data.length === 0) return []

    // Guruhlashtirish: friendId → lesson list
    const friendLessons = new Map<string, { lessonId: string; lessonTitle: string; score: number }[]>()

    for (const row of data) {
      const fId = row.user_id as string
      const lessonId = row.lesson_id as string
      // __test bilan tugaydigan darslarni chiqarib tashlaymiz (test natijalari)
      if (lessonId.endsWith('__test')) continue

      // Foydalanuvchi bu darsni o'tgan bo'lsa — tavsiya qilmaymiz
      if (userProgress[lessonId] !== undefined) continue

      if (!friendLessons.has(fId)) friendLessons.set(fId, [])
      friendLessons.get(fId)!.push({
        lessonId,
        lessonTitle: '',  // client-side lesson ma'lumotlari bilan to'ldiriladi
        score: row.score as number,
      })
    }

    const result: FriendLessonProgress[] = []
    for (const [fId, lessons] of friendLessons) {
      if (lessons.length === 0) continue
      result.push({
        friendId: fId,
        friendName: friendNameMap.get(fId) ?? 'Do\'st',
        lessons,
      })
    }

    return result
  } catch (e) {
    monitoring.captureMessage('getFriendsLessonRecommendations failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return []
  }
}

// ═══════════════════════════════════════════════════════════════════════════
//  LEADERBOARD (Do'stlar orasida XP/Streak reytingi)
// ═══════════════════════════════════════════════════════════════════════════

export interface LeaderboardEntry {
  userId: string
  name: string
  level: string
  totalXP: number
  streak: number
  isCurrentUser: boolean
}

/**
 * Joriy foydalanuvchi va do'stlarini XP bo'yicha tartiblangan leaderboard qaytaradi.
 * Reyting: eng katta XP dan kichikga.
 */
export async function getFriendLeaderboard(): Promise<LeaderboardEntry[]> {
  const userId = await getUserId()
  if (!userId) return []

  try {
    // Joriy foydalanuvchi ma'lumotlarini olish
    const { data: userData } = await supabase
      .from('users')
      .select('id, name, level, total_xp, streak')
      .eq('id', userId)
      .single()

    if (!userData) return []

    // Do'stlar ro'yxatini olish
    const friends = await getFriends()
    const friendIds = friends
      .filter(f => f.status === 'accepted')
      .map(f => f.id)

    if (friendIds.length === 0) {
      // Faqat o'zini qaytarish
      return [{
        userId: userData.id as string,
        name: userData.name as string,
        level: userData.level as string,
        totalXP: userData.total_xp as number,
        streak: userData.streak as number,
        isCurrentUser: true,
      }]
    }

    // Do'stlarning ma'lumotlarini olish
    const { data: friendsData } = await supabase
      .from('users')
      .select('id, name, level, total_xp, streak')
      .in('id', friendIds)

    const entries: LeaderboardEntry[] = []

    // Joriy foydalanuvchini qo'shamiz
    entries.push({
      userId: userData.id as string,
      name: userData.name as string,
      level: userData.level as string,
      totalXP: userData.total_xp as number,
      streak: userData.streak as number,
      isCurrentUser: true,
    })

    // Do'stlarni qo'shamiz
    for (const friend of friendsData ?? []) {
      entries.push({
        userId: friend.id as string,
        name: friend.name as string,
        level: friend.level as string,
        totalXP: friend.total_xp as number,
        streak: friend.streak as number,
        isCurrentUser: false,
      })
    }

    // XP bo'yicha kamayish tartibida saralash
    entries.sort((a, b) => b.totalXP - a.totalXP)

    return entries
  } catch (e) {
    monitoring.captureMessage('getFriendLeaderboard failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return []
  }
}

/** HotSeat natijasini saqlash (faqat mahalliy o'yinchi uchun) */
export async function saveHotSeatResult(
  playerScore: number,
  _questionsCount: number,
): Promise<boolean> {
  const userId = await getUserId()
  if (!userId) return false

  try {
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString()
    const { error } = await supabase
      .from('duels')
      .insert({
        challenger: userId,
        opponent: null,
        mode: 'hotseat',
        status: 'done',
        question_set: [],
        challenger_score: playerScore,
        opponent_score: null,
        is_bot: true,
        expires_at: expiresAt,
      })
    if (error) throw error
    return true
  } catch (e) {
    monitoring.captureMessage('saveHotSeatResult failed: ' + (e instanceof Error ? e.message : String(e)), 'warn')
    return false
  }
}
