import { useState } from 'react'

export function InfoTooltip({ text }: { text: string }) {
  const [open, setOpen] = useState(false)

  return (
    <span
      className="relative inline-flex"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
      onFocus={() => setOpen(true)}
      onBlur={() => setOpen(false)}
    >
      <button
        type="button"
        tabIndex={0}
        className="flex h-3.5 w-3.5 items-center justify-center rounded-full border border-border text-[9px] text-ink-faint transition-colors hover:border-brand hover:text-brand"
        aria-label="More information"
      >
        i
      </button>
      <span
        role="tooltip"
        className={`pointer-events-none absolute bottom-full left-1/2 z-20 mb-2 w-56 -translate-x-1/2 rounded-md border border-border bg-surface-elevated p-2.5 text-xs leading-relaxed text-ink-muted shadow-lg transition-all duration-150 ${
          open ? 'translate-y-0 opacity-100' : 'translate-y-1 opacity-0'
        }`}
      >
        {text}
      </span>
    </span>
  )
}
