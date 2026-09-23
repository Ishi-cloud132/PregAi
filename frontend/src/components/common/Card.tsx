import type { ReactNode } from 'react'

export function Card({
  title,
  eyebrow,
  action,
  children,
  className = '',
  interactive = false,
  onClick,
}: {
  title?: string
  eyebrow?: string
  action?: ReactNode
  children: ReactNode
  className?: string
  interactive?: boolean
  onClick?: () => void
}) {
  return (
    <div
      onClick={onClick}
      className={`card p-5 transition-all duration-200 ${
        interactive
          ? 'cursor-pointer hover:-translate-y-0.5 hover:border-brand/40 hover:shadow-glow'
          : ''
      } ${className}`}
    >
      {(title || action) && (
        <div className="mb-4 flex items-start justify-between gap-3">
          <div>
            {eyebrow && <p className="text-xs text-ink-muted">{eyebrow}</p>}
            {title && <h3 className="text-sm font-semibold text-ink">{title}</h3>}
          </div>
          {action}
        </div>
      )}
      {children}
    </div>
  )
}
