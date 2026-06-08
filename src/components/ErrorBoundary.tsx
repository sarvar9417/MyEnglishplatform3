import { Component } from 'react'
import ErrorDisplay from './ui/ErrorDisplay'
import { monitoring } from '../lib/monitoring'
import type { LucideIcon } from 'lucide-react'
import { Bug } from 'lucide-react'

interface Props {
  children: React.ReactNode
  fallback?: React.ReactNode
  icon?: LucideIcon
  title?: string
  message?: string
}

interface State {
  hasError: boolean
  error?: Error
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    monitoring.captureException(error, { componentStack: info.componentStack })
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: undefined })
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback

      return (
        <div className="min-h-[300px] flex items-center justify-center bg-white dark:bg-gray-900">
          <ErrorDisplay
            icon={this.props.icon ?? Bug}
            title={this.props.title ?? 'Nimadir xato ketdi'}
            message={this.props.message ?? 'Kutilmagan xatolik yuz berdi. Iltimos, qayta urinib ko\'ring.'}
            detail={this.state.error?.stack ?? this.state.error?.message}
            variant="error"
            retry={this.handleRetry}
            retryLabel="Qayta urinish"
            size="md"
          />
        </div>
      )
    }
    return this.props.children
  }
}
