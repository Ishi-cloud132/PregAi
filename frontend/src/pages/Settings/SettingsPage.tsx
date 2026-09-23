import { Card } from '@/components/common/Card'
import { useAuth } from '@/context/AuthContext'
import { useAppMode } from '@/context/AppModeContext'
import { ConnectionIndicator } from '@/components/common/ConnectionIndicator'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { API_BASE_URL } from '@/constants'

export default function SettingsPage() {
  const { user } = useAuth()
  const { isDemoMode } = useAppMode()

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink">Settings</h1>
        <p className="mt-1 text-sm text-ink-muted">Profile, appearance, and system connection information.</p>
      </div>

      <Card title="Profile">
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-ink-faint">Name</dt><dd className="mt-0.5 text-ink">{user?.name}</dd></div>
          <div><dt className="text-ink-faint">Email</dt><dd className="mt-0.5 text-ink">{user?.email}</dd></div>
          <div><dt className="text-ink-faint">Role</dt><dd className="mt-0.5 capitalize text-ink">{user?.role}</dd></div>
        </dl>
      </Card>

      <Card title="Appearance">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-ink">Theme</p>
            <p className="mt-0.5 text-xs text-ink-faint">Choose light or dark mode. Saved to this device.</p>
          </div>
          <ThemeToggle />
        </div>
      </Card>

      <Card title="System Connection">
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-ink-muted">Mode</span>
            <ConnectionIndicator state={isDemoMode ? 'demo' : 'connected'} />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-ink-muted">API base URL</span>
            <span className="font-mono text-xs text-ink">{API_BASE_URL}</span>
          </div>
          <p className="pt-2 text-xs text-ink-faint">
            Configure <code className="rounded bg-surface-elevated px-1 py-0.5">VITE_API_BASE_URL</code> and{' '}
            <code className="rounded bg-surface-elevated px-1 py-0.5">VITE_ENABLE_MOCK_API</code> in your .env file to
            connect to a live FastAPI backend.
          </p>
        </div>
      </Card>
    </div>
  )
}
