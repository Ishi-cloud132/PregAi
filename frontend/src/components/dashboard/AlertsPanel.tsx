import type { Alert } from '@/types'
import { Card } from '@/components/common/Card'

const DOT: Record<Alert['severity'], string> = {
  info: 'bg-brand',
  warning: 'bg-status-warning',
  critical: 'bg-status-critical',
}

export function AlertsPanel({ alerts }: { alerts: Alert[] }) {
  return (
    <Card title="Alerts" eyebrow={`${alerts.filter((a) => !a.acknowledged).length} unacknowledged`}>
      <ul className="space-y-3">
        {alerts.map((a) => (
          <li key={a.id} className="flex gap-2.5">
            <span className={`mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full ${DOT[a.severity]}`} />
            <div className="min-w-0">
              <p className="text-sm text-ink">{a.message}</p>
              <p className="mt-0.5 text-[11px] text-ink-faint">
                {new Date(a.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>
          </li>
        ))}
      </ul>
    </Card>
  )
}
