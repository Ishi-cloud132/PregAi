import type { ChangeDirection } from '@/types'

export function ChangeChip({
  direction,
  percentChange,
  compact = false,
}: {
  direction: ChangeDirection
  percentChange: number
  compact?: boolean
}) {
  const arrow = direction === 'increased' ? '↑' : direction === 'decreased' ? '↓' : '–'
  const label = direction === 'increased' ? 'Increased' : direction === 'decreased' ? 'Decreased' : 'Stable'

  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-xs ${
        direction === 'stable'
          ? 'border-border text-ink-faint'
          : 'border-secondary/30 bg-secondary/10 text-secondary'
      }`}
      title={label}
    >
      <span aria-hidden>{arrow}</span>
      {Math.abs(percentChange).toFixed(1)}%{!compact && <span className="ml-1 font-sans text-[10px] text-ink-faint">{label}</span>}
    </span>
  )
}
