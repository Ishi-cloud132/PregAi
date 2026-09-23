import type { RiskLevel } from '@/types'
import { RISK_LABELS } from '@/constants'

const ICON: Record<RiskLevel, string> = {
  normal: '●',
  warning: '▲',
  critical: '✕',
}

const STYLE: Record<RiskLevel, string> = {
  normal: 'text-status-normal bg-status-normal/10 border-status-normal/30',
  warning: 'text-status-warning bg-status-warning/10 border-status-warning/30',
  critical: 'text-status-critical bg-status-critical/10 border-status-critical/30',
}

export function StatusBadge({ level, label }: { level: RiskLevel; label?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded border px-2 py-0.5 text-xs font-medium ${STYLE[level]}`}
    >
      <span aria-hidden className="text-[10px]">{ICON[level]}</span>
      {label || RISK_LABELS[level]}
    </span>
  )
}
