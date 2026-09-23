import { useLocation } from 'react-router-dom'
import { NAV_ITEMS } from '@/components/navigation/navItems'
import { useAppMode } from '@/context/AppModeContext'
import { ConnectionIndicator } from '@/components/common/ConnectionIndicator'

export function Topbar() {
  const location = useLocation()
  const { isDemoMode } = useAppMode()
  const current = NAV_ITEMS.find((i) => location.pathname.startsWith(i.path))

  return (
    <header className="flex h-14 shrink-0 items-center justify-between border-b border-border px-6">
      <div>
        <p className="text-sm font-medium text-ink">{current?.label || 'PREG AI'}</p>
      </div>
      <div className="flex items-center gap-4">
        <ConnectionIndicator state={isDemoMode ? 'demo' : 'connected'} />
        <div className="h-4 w-px bg-border" />
        <p className="font-mono text-xs text-ink-faint">
          {new Date().toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
        </p>
      </div>
    </header>
  )
}
