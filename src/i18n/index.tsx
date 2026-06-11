import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react'
import type { Locale, TranslationStrings } from './types'
import { monitoring } from '../lib/monitoring'

/* ─── Storage ─── */

const STORAGE_KEY = 'locale'

function getStoredLocale(): Locale {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'uz' || stored === 'en' || stored === 'ru') return stored
  } catch { /* ignore */ }
  return 'uz'  // default
}

function setStoredLocale(locale: Locale) {
  try {
    localStorage.setItem(STORAGE_KEY, locale)
  } catch { /* ignore */ }
}

/* ─── Loader ─── */

const cache = new Map<Locale, TranslationStrings>()

async function loadLocale(locale: Locale): Promise<TranslationStrings> {
  const cached = cache.get(locale)
  if (cached) return cached

  let data: TranslationStrings
  switch (locale) {
    case 'en':
      data = (await import('./en.json')).default as unknown as TranslationStrings
      break
    case 'ru':
      data = (await import('./ru.json')).default as unknown as TranslationStrings
      break
    case 'uz':
    default:
      data = (await import('./uz.json')).default as unknown as TranslationStrings
      break
  }
  cache.set(locale, data)
  return data
}

/* ─── Interpolation ─── */

type Params = Record<string, string | number>

function interpolate(template: string, params?: Params): string {
  if (!params) return template
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const val = params[key]
    return val !== undefined ? String(val) : `{${key}}`
  })
}

/* ─── Context ─── */

interface I18nContextValue {
  locale: Locale
  loading: boolean
  t: (key: keyof TranslationStrings, params?: Params) => string
  setLocale: (locale: Locale) => void
}

const I18nContext = createContext<I18nContextValue | null>(null)

/* ─── Provider ─── */

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(getStoredLocale)
  const [dict, setDict] = useState<TranslationStrings | null>(null)
  const [loading, setLoading] = useState(true)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => { mountedRef.current = false }
  }, [])

  useEffect(() => {
    setLoading(true)
    loadLocale(locale).then((data) => {
      if (mountedRef.current) {
        setDict(data)
        setLoading(false)
      }
    }).catch((err) => {
      monitoring.captureMessage('i18n load failed: ' + (err instanceof Error ? err.message : String(err)), 'warn')
      if (mountedRef.current) {
        // Fallback to empty dict — app still works, just shows missing strings
        setDict(null)
        setLoading(false)
      }
    })
  }, [locale])

  const t = useCallback((key: keyof TranslationStrings, params?: Params): string => {
    const template = dict?.[key]
    if (template === undefined) return key // fallback: show the key name
    return interpolate(template, params)
  }, [dict])

  const setLocale = useCallback((newLocale: Locale) => {
    setStoredLocale(newLocale)
    setLocaleState(newLocale)
  }, [])

  return (
    <I18nContext.Provider value={{ locale, loading, t, setLocale }}>
      {children}
    </I18nContext.Provider>
  )
}

/* ─── Hook ─── */

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext)
  if (!ctx) {
    throw new Error('useI18n must be used inside <I18nProvider>')
  }
  return ctx
}

/* ─── Re-export types ─── */

export type { Locale, TranslationStrings }
export { LOCALES } from './types'
