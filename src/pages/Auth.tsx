import { useState, useRef, useCallback, useEffect } from 'react'
import { useAuth } from '../hooks/useAuth'
import { X, MailCheck, RefreshCw, AlertTriangle, Eye } from 'lucide-react'

type Tab = 'login' | 'signup'
type SignupState = 'form' | 'sent' | 'resent'

export default function Auth() {
  const { signIn, signUp, resetPassword, resendConfirmation } = useAuth()

  const [tab,           setTab]           = useState<Tab>('login')
  const [name,          setName]          = useState('')
  const [email,         setEmail]         = useState('')
  const [password,      setPassword]      = useState('')
  const [loading,       setLoading]       = useState(false)
  const [error,         setError]         = useState<string | null>(null)

  // Post-signup confirmation state
  const [signupState,   setSignupState]   = useState<SignupState>('form')
  const [signedUpEmail, setSignedUpEmail] = useState('')

  // Resend cooldown
  const [resendCooldown, setResendCooldown] = useState(0)
  const cooldownRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const clearCooldown = useCallback(() => {
    if (cooldownRef.current) {
      clearInterval(cooldownRef.current)
      cooldownRef.current = null
    }
    setResendCooldown(0)
  }, [])

  useEffect(() => {
    return () => clearCooldown()
  }, [clearCooldown])

  // Forgot password modal
  const [showReset,     setShowReset]     = useState(false)
  const [resetEmail,    setResetEmail]    = useState('')
  const [resetSent,     setResetSent]     = useState(false)
  const [resetLoading,  setResetLoading]  = useState(false)
  const [resetError,    setResetError]    = useState<string | null>(null)

  const switchTab = (t: Tab) => {
    setTab(t)
    setError(null)
    setSignupState('form')
    clearCooldown()
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)

    if (tab === 'login') {
      const { error } = await signIn(email, password)
      if (error) {
        setError(
          error.message.includes('Invalid login')
            ? "Email yoki parol noto'g'ri"
            : error.message.includes('Email not confirmed')
            ? 'Email tasdiqlanmagan. Avval emailingizni tasdiqlang.'
            : error.message
        )
      }
    } else {
      const { error } = await signUp(email, password, name.trim())
      if (error) {
        setError(
          error.message.includes('already registered')
            ? 'Bu email allaqachon ro\'yxatdan o\'tgan. Kirish tabini oching.'
            : error.message
        )
      } else {
        setSignupState('sent')
        setSignedUpEmail(email)
        startResendCooldown()
      }
    }

    setLoading(false)
  }

  function startResendCooldown() {
    clearCooldown()
    setResendCooldown(60)
    cooldownRef.current = setInterval(() => {
      setResendCooldown((prev) => {
        if (prev <= 1) {
          clearCooldown()
          return 0
        }
        return prev - 1
      })
    }, 1000)
  }

  async function handleResend() {
    if (resendCooldown > 0) return
    setError(null)

    const { error } = await resendConfirmation(signedUpEmail)

    if (error) {
      setError(error.message)
    } else {
      setSignupState('resent')
      startResendCooldown()
    }
  }

  async function handleResetPassword(e: React.FormEvent) {
    e.preventDefault()
    setResetLoading(true)
    setResetError(null)

    const { error } = await resetPassword(resetEmail.trim())

    if (error) {
      setResetError(
        error.message.includes('not found')
          ? 'Bu email tizimda topilmadi'
          : error.message
      )
    } else {
      setResetSent(true)
    }

    setResetLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-b2-50 dark:from-gray-900 dark:via-gray-950 dark:to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">📚</div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">EnglishPath</h1>
          <p className="text-gray-500 text-sm mt-1">A2+ dan B2 sari — 126 kunlik intensiv yo'l</p>
        </div>

        <div className="card shadow-xl">
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-gray-100 dark:bg-gray-800 rounded-xl mb-6">
            {([
              { id: 'login',  label: 'Kirish' },
              { id: 'signup', label: "Ro'yxatdan o'tish" },
            ] as { id: Tab; label: string }[]).map((t) => (
              <button
                key={t.id}
                onClick={() => switchTab(t.id)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  tab === t.id
                    ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {tab === 'signup' && signupState !== 'form' ? (
            /* ─── Post-Signup Success Screen ───────────────────────── */
            <div className="text-center py-6">
              <div className="w-20 h-20 mx-auto mb-5 relative">
                <div className="absolute inset-0 bg-gradient-to-br from-green-100 to-emerald-50 rounded-full animate-pulse" />
                <div className="relative w-full h-full flex items-center justify-center">
                  <MailCheck size={40} className="text-green-600" />
                </div>
              </div>

              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                {signupState === 'resent' ? "Xat qayta yuborildi! ✅" : "Ro'yxatdan o'tdingiz! 🎉"}
              </h2>

              <p className="text-sm text-gray-500 mb-6 leading-relaxed">
                <strong className="text-primary-600 font-semibold">{signedUpEmail}</strong> manziliga
                tasdiqlash xatini yubordik.
              </p>

              {/* Instructions */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl p-5 mb-5 text-left border border-blue-100 dark:border-blue-800">
                <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">1</span>
                  Emailingizni oching
                </h4>
                <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 mb-3 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">2</span>
                  Tasdiqlash havolasini bosing
                </h4>
                <h4 className="font-semibold text-sm text-gray-800 dark:text-gray-200 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-600">3</span>
                  Platformaga qaytib kiring
                </h4>
              </div>

              {/* Spam folder tip */}
              <div className="flex items-start gap-2.5 p-3 bg-amber-50 border border-amber-100 rounded-xl text-left mb-5">
                <AlertTriangle size={16} className="text-amber-500 mt-0.5 shrink-0" />
                <p className="text-xs text-amber-700 leading-relaxed">
                  Xat topilmadimi? <strong>Spam / Reklama</strong> papkasini tekshiring.
                  Agar 2 daqiqa ichida xat kelmasa, pastdagi tugma orqali qayta yuboring.
                </p>
              </div>

              {/* Error in success screen */}
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600 mb-4">
                  {error}
                </div>
              )}

              {/* Resend button */}
              <button
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
                  border border-primary-200 text-primary-700 font-medium text-sm
                  hover:bg-primary-50 hover:border-primary-300 transition-all
                  disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <RefreshCw size={16} className={`${resendCooldown > 0 ? 'animate-spin' : ''}`} />
                {resendCooldown > 0
                  ? `${resendCooldown} soniyada qayta yuborish`
                  : 'Tasdiqlash xatini qayta yuborish'}
              </button>

              {/* Back to login */}
              <button
                onClick={() => switchTab('login')}
                className="mt-4 text-sm text-gray-400 hover:text-primary-600 transition-colors"
              >
                Kirish sahifasiga o'tish →
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {tab === 'signup' && (
                <div>
                  <label htmlFor="auth-name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Ism</label>
                  <input
                    id="auth-name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Ismingiz..."
                    required
                    minLength={2}
                    className="input"
                  />
                </div>
              )}

              <div>
                <label htmlFor="auth-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                <input
                  id="auth-email"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="email@example.com"
                  required
                  className="input"
                />
              </div>

              <div>
                <label htmlFor="auth-password" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Parol</label>
                <input
                  id="auth-password"
                  type="password"
                  inputMode="text"
                  autoComplete={tab === 'login' ? 'current-password' : 'new-password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="input"
                />
                {tab === 'login' && (
                  <button
                    type="button"
                    onClick={() => { setShowReset(true); setResetEmail(email); setResetSent(false); setResetError(null) }}
                    className="text-xs text-primary-600 hover:text-primary-700 hover:underline mt-1.5 transition-colors"
                  >
                    Parolni unutdingizmi?
                  </button>
                )}
              </div>

              {error && (
                <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading
                  ? 'Yuklanmoqda...'
                  : tab === 'login'
                  ? 'Kirish →'
                  : "Ro'yxatdan o'tish 🚀"}
              </button>
            </form>
          )}

          {/* Demo mode CTA */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-700" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white dark:bg-gray-950 px-2 text-gray-400">yoki</span>
            </div>
          </div>
          <button
            onClick={() => { localStorage.setItem('demo-mode', 'true'); window.location.href = '/lesson' }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl
              border-2 border-dashed border-primary-300 text-primary-700 font-medium text-sm
              hover:bg-primary-50 hover:border-primary-400 transition-all"
          >
            <Eye size={18} />
            Kirishsiz sinab ko'rish
          </button>
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Savollar? <a href="mailto:support@englishpath.uz" className="text-primary-600 hover:underline">Bog'laning</a>
        </p>
      </div>

      {/* ─── Forgot Password Modal ───────────────────────────────────── */}
      {showReset && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4" onClick={() => setShowReset(false)}>
          <div
            className="w-full max-w-sm bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 relative animate-slide-in"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowReset(false)}
              aria-label="Modalni yopish"
              className="absolute top-3 right-3 p-1.5 rounded-lg text-gray-400 hover:text-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
            >
              <X size={18} />
            </button>

            <div className="text-center mb-5">
              <div className="text-4xl mb-2">🔑</div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">Parolni tiklash</h3>
              <p className="text-sm text-gray-500 mt-1">
                Email manzilingizga tiklash havolasini yuboramiz.
              </p>
            </div>

            {resetSent ? (
              <div className="text-center py-4">
                <div className="text-4xl mb-3">📧</div>
                <p className="text-sm font-semibold text-gray-900 dark:text-white mb-1">Xat yuborildi!</p>
                <p className="text-xs text-gray-500">
                  <strong className="text-primary-600">{resetEmail}</strong> manziliga parolni tiklash
                  havolasini yubordik. Emailingizni tekshiring.
                </p>
                <button
                  onClick={() => setShowReset(false)}
                  className="btn-primary w-full mt-5"
                >
                  Tushunarli
                </button>
              </div>
            ) : (
              <form onSubmit={handleResetPassword} className="space-y-4">
                <div>
                  <label htmlFor="reset-email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email</label>
                  <input
                    id="reset-email"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    value={resetEmail}
                    onChange={(e) => setResetEmail(e.target.value)}
                    placeholder="email@example.com"
                    required
                    className="input"
                    autoFocus
                  />
                </div>

                {resetError && (
                  <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                    {resetError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={resetLoading}
                  className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {resetLoading ? 'Yuborilmoqda...' : 'Tiklash havolasini yuborish →'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
