import { Link } from 'react-router-dom'

export default function NotFoundPage() {
  return (
    <div className="flex h-screen flex-col items-center justify-center gap-3 bg-base text-center">
      <p className="font-display text-2xl font-semibold text-ink">Page not found</p>
      <p className="text-sm text-ink-muted">The page you're looking for doesn't exist.</p>
      <Link to="/dashboard" className="mt-2 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dim">
        Back to Dashboard
      </Link>
    </div>
  )
}
