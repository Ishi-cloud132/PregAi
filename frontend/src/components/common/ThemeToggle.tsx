import { useTheme } from '@/context/ThemeContext'

export function ThemeToggle({ compact = false }: { compact?: boolean }) {
  const { theme, setTheme } = useTheme()

  return (
    <div className={`flex items-center gap-1 rounded-md border border-border p-0.5 ${compact ? '' : 'w-fit'}`}>
      <button
        type="button"
        onClick={() => setTheme('dark')}
        aria-pressed={theme === 'dark'}
        title="Dark mode"
        className={`flex items-center justify-center rounded px-2 py-1.5 transition-colors ${
          theme === 'dark' ? 'bg-brand/15 text-brand' : 'text-ink-faint hover:text-ink'
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
          <path d="M21 12.8A9 9 0 1 1 11.2 3 7 7 0 0 0 21 12.8Z" />
        </svg>
        {!compact && <span className="ml-1.5 text-xs">Dark</span>}
      </button>
      <button
        type="button"
        onClick={() => setTheme('light')}
        aria-pressed={theme === 'light'}
        title="Light mode"
        className={`flex items-center justify-center rounded px-2 py-1.5 transition-colors ${
          theme === 'light' ? 'bg-brand/15 text-brand' : 'text-ink-faint hover:text-ink'
        }`}
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-3.5 w-3.5">
          <circle cx="12" cy="12" r="4" />
          <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
        </svg>
        {!compact && <span className="ml-1.5 text-xs">Light</span>}
      </button>
    </div>
  )
}
