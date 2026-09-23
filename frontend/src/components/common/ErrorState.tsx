export function ErrorState({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-md border border-status-critical/25 bg-status-critical/5 py-12 text-center">
      <p className="text-sm font-medium text-status-critical">{message}</p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded border border-border px-3 py-1.5 text-xs text-ink-muted transition-colors hover:border-brand hover:text-ink"
        >
          Retry
        </button>
      )}
    </div>
  )
}
