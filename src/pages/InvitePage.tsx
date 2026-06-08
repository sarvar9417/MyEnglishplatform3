// ═══════════════════════════════════════════════════════════════════════════
// InvitePage — /add/:code deep-link orqali do'st qo'shish
// ═══════════════════════════════════════════════════════════════════════════

import { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Users, Check, Loader2, ArrowRight } from 'lucide-react'
import { addFriendByCode } from '../services/tandemService'
import { useToastStore } from '../utils/toastStore'

type InviteState = 'processing' | 'success' | 'error' | 'auth_required'

export default function InvitePage() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const [state, setState] = useState<InviteState>('processing')
  const [message, setMessage] = useState('')

  useEffect(() => {
    if (!code) {
      setState('error')
      setMessage('Taklif kodi topilmadi')
      return
    }

    const processInvite = async () => {
      // Wait a moment for auth to initialize
      await new Promise(r => setTimeout(r, 500))

      const result = await addFriendByCode(code)
      if (result.success) {
        setState('success')
        setMessage('Do\'stingiz muvaffaqiyatli qo\'shildi!')
        useToastStore.getState().toast('✅ Do\'st qo\'shildi!', 'success')
      } else if (result.error?.includes('Auth')) {
        setState('auth_required')
        setMessage('Do\'st qo\'shish uchun tizimga kiring')
      } else if (result.error?.includes('allaqachon')) {
        setState('success')
        setMessage('Bu foydalanuvchi allaqachon do\'stingiz')
      } else {
        setState('error')
        setMessage(result.error || 'Xatolik yuz berdi')
      }
    }

    processInvite()
  }, [code])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50 dark:from-gray-950 dark:to-gray-900 p-4">
      <div className="bg-white dark:bg-gray-900 rounded-2xl shadow-xl max-w-sm w-full p-8 text-center space-y-4">
        <div className="flex justify-center">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl ${
            state === 'success'
              ? 'bg-green-100 dark:bg-green-900/30'
              : state === 'error'
                ? 'bg-red-100 dark:bg-red-900/30'
                : 'bg-purple-100 dark:bg-purple-900/30'
          }`}>
            {state === 'processing' ? (
              <Loader2 size={32} className="animate-spin text-purple-500" />
            ) : state === 'success' ? (
              <Check size={32} className="text-green-500" />
            ) : state === 'auth_required' ? (
              <Users size={32} className="text-purple-500" />
            ) : (
              <span className="text-4xl">😕</span>
            )}
          </div>
        </div>

        <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100">
          {state === 'processing' ? 'Do\'st qo\'shilmoqda...' :
           state === 'success' ? 'Tabriklaymiz! 🎉' :
           state === 'auth_required' ? 'Tizimga kiring' :
           'Xatolik'}
        </h2>

        <p className="text-sm text-gray-500">{message}</p>

        {state === 'success' && (
          <button
            onClick={() => navigate('/tandem')}
            className="btn-primary w-full py-3 text-sm flex items-center justify-center gap-2"
          >
            Tandem sahifasiga o'tish <ArrowRight size={16} />
          </button>
        )}

        {state === 'auth_required' && (
          <button
            onClick={() => navigate('/')}
            className="btn-primary w-full py-3 text-sm"
          >
            Tizimga kirish
          </button>
        )}

        {state === 'error' && (
          <button
            onClick={() => navigate('/')}
            className="btn-secondary w-full py-3 text-sm"
          >
            Bosh sahifaga qaytish
          </button>
        )}
      </div>
    </div>
  )
}
