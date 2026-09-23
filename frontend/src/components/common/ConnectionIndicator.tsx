import type { ConnectionState } from '@/types'

const CONFIG: Record<ConnectionState, { label: string; dot: string; text: string; pulse?: boolean }> = {
  connected: { label: 'LIVE', dot: 'bg-status-normal', text: 'text-status-normal', pulse: true },
  reconnecting: { label: 'RECONNECTING', dot: 'bg-status-warning', text: 'text-status-warning', pulse: true },
  disconnected: { label: 'DISCONNECTED', dot: 'bg-status-critical', text: 'text-status-critical' },
  stale: { label: 'DATA STALE', dot: 'bg-status-warning', text: 'text-status-warning' },
  demo: { label: 'DEMO MODE', dot: 'bg-status-demo', text: 'text-status-demo', pulse: true },
}

export function ConnectionIndicator({ state, size = 'md' }: { state: ConnectionState; size?: 'sm' | 'md' }) {
  const c = CONFIG[state]
  return (
    <span className={`inline-flex items-center gap-1.5 font-mono ${size === 'sm' ? 'text-[10px]' : 'text-xs'} ${c.text}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${c.dot} ${c.pulse ? 'animate-pulseDot' : ''}`} aria-hidden />
      {c.label}
    </span>
  )
}
