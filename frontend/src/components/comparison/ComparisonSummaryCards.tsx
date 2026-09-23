import type { SessionComparisonSide } from '@/types'

function fmtDate(iso: string) {
  return new Date(iso).toLocaleString([], { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })
}

function SideCard({ label, side, accent }: { label: string; side: SessionComparisonSide; accent: 'a' | 'b' }) {
  return (
    <div className="card stagger-in p-5">
      <div className="mb-3 flex items-center gap-2">
        <span className={`h-2 w-2 rounded-full ${accent === 'a' ? 'bg-brand' : 'bg-secondary'}`} />
        <p className="text-xs font-medium uppercase tracking-wide text-ink-faint">{label}</p>
      </div>
      <p className="font-display text-lg font-semibold text-ink">{fmtDate(side.session.startedAt)}</p>
      <div className="mt-4 grid grid-cols-2 gap-4 border-t border-border-subtle pt-4">
        <div>
          <p className="text-xs text-ink-faint">Signal Quality</p>
          <p className="mt-0.5 font-display text-xl font-semibold text-ink tabular">{side.quality.score}<span className="text-sm font-normal text-ink-faint">%</span></p>
        </div>
        <div>
          <p className="text-xs text-ink-faint">Duration</p>
          <p className="mt-0.5 font-display text-xl font-semibold text-ink tabular">{Math.round(side.session.durationSeconds / 60)}<span className="text-sm font-normal text-ink-faint"> min</span></p>
        </div>
      </div>
    </div>
  )
}

export function ComparisonSummaryCards({ a, b }: { a: SessionComparisonSide; b: SessionComparisonSide }) {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      <SideCard label="Session A" side={a} accent="a" />
      <SideCard label="Session B" side={b} accent="b" />
    </div>
  )
}
