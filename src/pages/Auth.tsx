import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'

type Tab = 'login' | 'signup'

export default function Auth() {
  const { signIn, signUp } = useAuth()

  const [tab,      setTab]      = useState<Tab>('login')
  const [name,     setName]     = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [loading,  setLoading]  = useState(false)
  const [error,    setError]    = useState<string | null>(null)
  const [info,     setInfo]     = useState<string | null>(null)

  const switchTab = (t: Tab) => { setTab(t); setError(null); setInfo(null) }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    setInfo(null)

    const { error } = tab === 'login'
      ? await signIn(email, password)
      : await signUp(email, password, name.trim())

    if (error) {
      setError(
        error.message.includes('Invalid login')
          ? "Email yoki parol noto'g'ri"
          : error.message.includes('already registered')
          ? 'Bu email allaqachon ro\'yxatdan o\'tgan. Kirish tabini oching.'
          : error.message
      )
    } else if (tab === 'signup') {
      setInfo("Emailingizni tekshiring — tasdiqlash xati yuborildi. Keyin kiring.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-b2-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Branding */}
        <div className="text-center mb-8">
          <div className="text-5xl mb-3">📚</div>
          <h1 className="text-2xl font-bold text-gray-900">EnglishPath</h1>
          <p className="text-gray-500 text-sm mt-1">A2+ darajasidan B2 ga 90 kunda</p>
        </div>

        <div className="card shadow-xl">
          {/* Tabs */}
          <div className="flex gap-1 p-1 bg-gray-100 rounded-xl mb-6">
            {([
              { id: 'login',  label: 'Kirish' },
              { id: 'signup', label: "Ro'yxatdan o'tish" },
            ] as { id: Tab; label: string }[]).map((t) => (
              <button
                key={t.id}
                onClick={() => switchTab(t.id)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  tab === t.id
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {tab === 'signup' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Ism</label>
                <input
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                required
                className="input"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Parol</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                minLength={6}
                className="input"
              />
            </div>

            {error && (
              <div className="p-3 bg-red-50 border border-red-100 rounded-xl text-sm text-red-600">
                {error}
              </div>
            )}

            {info && (
              <div className="p-3 bg-green-50 border border-green-100 rounded-xl text-sm text-green-700">
                {info}
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
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Savollar? <a href="mailto:support@englishpath.uz" className="text-primary-600 hover:underline">Bog'laning</a>
        </p>
      </div>
    </div>
  )
}
