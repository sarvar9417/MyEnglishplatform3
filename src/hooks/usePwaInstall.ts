import { useState, useEffect, useCallback } from 'react'

export interface PwaInstallState {
  /** Whether the app can be installed (beforeinstallprompt fired) */
  canInstall: boolean
  /** Whether the app has been installed */
  isInstalled: boolean
  /** Trigger the install prompt */
  promptInstall: () => Promise<boolean>
  /** Dismiss/decline the install prompt for this session */
  dismiss: () => void
}

export function usePwaInstall(): PwaInstallState {
  const [deferredPrompt, setDeferredPrompt] = useState<Event | null>(null)
  const [canInstall, setCanInstall] = useState(false)
  const [isInstalled, setIsInstalled] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    // Check if already installed (display-mode: standalone)
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true)
      return
    }

    const handleBeforeInstall = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e)
      setCanInstall(true)
    }

    const handleAppInstalled = () => {
      setIsInstalled(true)
      setCanInstall(false)
      setDeferredPrompt(null)
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstall)
    window.addEventListener('appinstalled', handleAppInstalled)

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall)
      window.removeEventListener('appinstalled', handleAppInstalled)
    }
  }, [])

  const promptInstall = useCallback(async (): Promise<boolean> => {
    if (!deferredPrompt) return false
    const promptEvent = deferredPrompt as Event & { prompt: () => Promise<void>; userChoice: Promise<{ outcome: string }> }

    try {
      await promptEvent.prompt()
      const choice = await promptEvent.userChoice
      setDeferredPrompt(null)
      setCanInstall(false)
      return choice.outcome === 'accepted'
    } catch {
      setDeferredPrompt(null)
      return false
    }
  }, [deferredPrompt])

  const dismiss = useCallback(() => {
    setDismissed(true)
    setCanInstall(false)
  }, [])

  return {
    canInstall: canInstall && !dismissed,
    isInstalled,
    promptInstall,
    dismiss,
  }
}
