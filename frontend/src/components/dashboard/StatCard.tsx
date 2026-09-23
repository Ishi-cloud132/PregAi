import { useRef, type ReactNode } from 'react'
import { useCountUp } from '@/hooks/useCountUp'
import { InfoTooltip } from '@/components/common/InfoTooltip'

export type StatAccent = 'brand' | 'secondary' | 'gold' | 'purple'

// Distinct hover/icon treatment per accent so the four dashboard stat cards
// don't all read as "the same navy card" — each keeps its own identity
// on hover while staying within the deck's restrained, non-clinical palette
// (these are decorative, not status colors; red/green stay reserved for
// StatusBadge/ConnectionIndicator semantics elsewhere).
const ACCENT_STYLES: Record<StatAccent, { border: string; shadow: string; icon: string }> = {
  brand: { border: 'hover:border-brand/40', shadow: 'hover:shadow-glow', icon: 'group-hover:text-brand' },
  secondary: { border: 'hover:border-secondary/40', shadow: 'hover:shadow-glow-secondary', icon: 'group-hover:text-secondary' },
  gold: { border: 'hover:border-gold/40', shadow: 'hover:shadow-glow-gold', icon: 'group-hover:text-gold' },
  purple: { border: 'hover:border-purple/40', shadow: 'hover:shadow-glow-purple', icon: 'group-hover:text-purple' },
}

export function StatCard({
  label,
  value,
  unit,
  hint,
  icon,
  tooltip,
  decimals = 0,
  accent = 'brand',
}: {
  label: string
  value: string | number
  unit?: string
  hint?: string
  icon?: ReactNode
  tooltip?: string
  decimals?: number
  accent?: StatAccent
}) {
  const valueRef = useRef<HTMLSpanElement>(null)
  const isNumeric = typeof value === 'number'
  useCountUp(isNumeric ? value : 0, valueRef, decimals)
  const styles = ACCENT_STYLES[accent]

  return (
    <div className={`card group p-4 transition-all duration-200 hover:-translate-y-0.5 ${styles.border} ${styles.shadow}`}>
      <div className="mb-3 flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <p className="text-xs text-ink-muted">{label}</p>
          {tooltip && <InfoTooltip text={tooltip} />}
        </div>
        {icon && <span className={`text-ink-faint transition-colors ${styles.icon}`}>{icon}</span>}
      </div>
      <p className="font-display text-2xl font-semibold text-ink tabular">
        {isNumeric ? <span ref={valueRef}>0</span> : value}
        {unit && <span className="ml-1 text-sm font-normal text-ink-faint">{unit}</span>}
      </p>
      {hint && <p className="mt-1 text-xs text-ink-faint">{hint}</p>}
    </div>
  )
}
