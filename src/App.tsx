import { useState } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useStore } from './store/useStore'
import { useAuth } from './hooks/useAuth'
import Sidebar from './components/layout/Sidebar'
import Dashboard from './pages/Dashboard'
import Roadmap from './pages/Roadmap'
import Lesson from './pages/Lesson'
import Grammar from './pages/Grammar'
import Vocabulary from './pages/Vocabulary'
import Progress from './pages/Progress'
import MockTest from './pages/MockTest'
import Chat from './pages/Chat'
import Listening from './pages/Listening'
import Speaking from './pages/Speaking'
import Reading from './pages/Reading'
import Writing from './pages/Writing'
import DailyLesson from './pages/DailyLesson'
import Auth from './pages/Auth'

// ─── Onboarding ──────────────────────────────────────────────────────────────

function Onboarding() {
  const { completeOnboarding } = useStore()
  const [name, setName] = useState('')
  const [step, setStep] = useState(0)

  const steps = [
    {
      title: "EnglishPath'ga xush kelibsiz! 🎉",
      subtitle: 'A2+ darajasidan B2 darajasiga 90 kunda yetamiz.',
      content: (
        <div className="space-y-4">
          <div className="bg-gradient-to-br from-primary-50 to-b2-50 rounded-2xl p-6 text-center">
            <div className="text-6xl mb-3">🚀</div>
            <p className="text-gray-700 font-medium">Kuniga 14 soat intensiv mashq</p>
            <p className="text-gray-500 text-sm mt-1">Grammar • Vocabulary • Listening • Writing</p>
          </div>
          <div className="grid grid-cols-3 gap-3 text-center">
            {[
              { label: '90 kun', sub: 'intensiv kurs' },
              { label: '4 skill', sub: 'parallel rivojlanish' },
              { label: 'AI tutor', sub: '24/7 yordam' },
            ].map((item) => (
              <div key={item.label} className="card py-3">
                <p className="font-bold text-primary-600">{item.label}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.sub}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
    {
      title: 'Ismingizni kiriting',
      subtitle: 'Platformani siz uchun sozlaymiz.',
      content: (
        <div className="space-y-4">
          <input
            className="input text-lg text-center"
            placeholder="Ismingiz..."
            value={name}
            onChange={(e) => setName(e.target.value)}
            autoFocus
          />
          <div className="card bg-primary-50 border-primary-100">
            <p className="text-sm text-primary-700 font-medium">
              Siz A2+ darajasidan boshlab B2 ga yetasiz:
            </p>
            <ul className="text-sm text-primary-600 mt-2 space-y-1">
              <li>✓ Haftalik testlar va AI feedback</li>
              <li>✓ Spaced Repetition lug'at tizimi</li>
              <li>✓ Real-time Pomodoro tracker</li>
              <li>✓ 90 kunlik yo'l xaritasi</li>
            </ul>
          </div>
        </div>
      ),
    },
    {
      title: `Tayyor, ${name || 'do\'st'}! 💪`,
      subtitle: "Bugundan boshlaymiz. Muvaffaqiyat tilaymiz!",
      content: (
        <div className="space-y-4">
          <div className="card text-center py-8">
            <div className="text-5xl mb-4">🎯</div>
            <p className="font-bold text-gray-900 text-lg mb-1">Maqsad: B2 darajasi</p>
            <p className="text-gray-500 text-sm">90 kundan keyin: {new Date(Date.now() + 90 * 86400000).toLocaleDateString('uz-UZ')}</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { level: 'A2+', label: 'Hozirgi daraja', color: 'bg-gray-100 text-gray-600' },
              { level: 'B1', label: '4-hafta', color: 'bg-b1-100 text-b1-700' },
              { level: 'B1+', label: '8-hafta', color: 'bg-b1-100 text-b1-800' },
              { level: 'B2', label: '13-hafta (maqsad)', color: 'bg-b2-100 text-b2-700' },
            ].map((item) => (
              <div key={item.level} className={`rounded-xl p-3 text-center ${item.color}`}>
                <p className="font-bold text-lg">{item.level}</p>
                <p className="text-xs mt-0.5 opacity-75">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      ),
    },
  ]

  const current = steps[step]
  const isLast = step === steps.length - 1
  const canProceed = step === 1 ? name.trim().length >= 2 : true

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-b2-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Progress dots */}
        <div className="flex justify-center gap-2 mb-8">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`h-2 rounded-full transition-all duration-300 ${
                i === step ? 'w-8 bg-primary-600' : i < step ? 'w-2 bg-primary-400' : 'w-2 bg-gray-200'
              }`}
            />
          ))}
        </div>

        <div className="card shadow-xl">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">{current.title}</h1>
          <p className="text-gray-500 text-sm mb-6">{current.subtitle}</p>
          {current.content}

          <div className="flex gap-3 mt-6">
            {step > 0 && (
              <button className="btn-secondary flex-1" onClick={() => setStep(s => s - 1)}>
                Orqaga
              </button>
            )}
            <button
              className="btn-primary flex-1"
              disabled={!canProceed}
              onClick={() => {
                if (isLast) {
                  completeOnboarding(name.trim() || 'Foydalanuvchi')
                } else {
                  setStep(s => s + 1)
                }
              }}
            >
              {isLast ? "Boshlash! 🚀" : "Keyingi →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── App Shell ────────────────────────────────────────────────────────────────

function AppShell() {
  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/roadmap" element={<Roadmap />} />
          <Route path="/lesson" element={<Lesson />} />
          <Route path="/grammar" element={<Grammar />} />
          <Route path="/vocabulary" element={<Vocabulary />} />
          <Route path="/progress" element={<Progress />} />
          <Route path="/mock-test" element={<MockTest />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/listening" element={<Listening />} />
          <Route path="/speaking"  element={<Speaking />}  />
          <Route path="/reading"   element={<Reading />}   />
          <Route path="/writing"      element={<Writing />}      />
          <Route path="/daily-lesson" element={<DailyLesson />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
    </div>
  )
}

// ─── Auth-aware router (must be inside BrowserRouter) ────────────────────────

function AppRouter() {
  const { session, loading } = useAuth()
  const onboardingComplete   = useStore((s) => s.onboardingComplete)

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  if (!session) return <Auth />
  if (!onboardingComplete) return <Onboarding />
  return <AppShell />
}

// ─── Root ─────────────────────────────────────────────────────────────────────

export default function App() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  )
}
