import * as Sentry from '@sentry/react'
import type { MonitoringProvider } from './monitoring'

export function initSentry(dsn: string) {
  Sentry.init({
    dsn,
    environment: import.meta.env.MODE,
    tracesSampleRate: 0.1,
  })
}

export function createSentryProvider(): MonitoringProvider {
  return {
    captureException(error, context) {
      Sentry.captureException(error, { extra: context })
    },
    captureMessage(message, level = 'info') {
      const sentryLevel = level === 'warn' ? 'warning' : level
      Sentry.captureMessage(message, sentryLevel)
    },
    identifyUser(userId, traits) {
      Sentry.setUser({ id: userId, ...traits })
    },
    trackEvent(name, properties) {
      Sentry.captureEvent({ message: name, extra: properties })
    },
  }
}
