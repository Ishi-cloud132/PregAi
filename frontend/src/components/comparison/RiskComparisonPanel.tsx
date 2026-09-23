import type { SessionComparisonSide } from '@/types'
import { Card } from '@/components/common/Card'
import { StatusBadge } from '@/components/common/StatusBadge'

function RiskColumn({ label, side, accent }: { label: string; side: SessionComparisonSide; accent: 'a' | 'b' }) {
  const { risk } = side
  if (!risk) {
    return (
      <div>
        <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-ink-faint">
          <span className={`h-1.5 w-1.5 rounded-full ${accent === 'a' ? 'bg-brand' : 'bg-secondary'}`} />{label}
        </p>
        <p className="text-sm text-ink-faint">No risk assessment available for this session.</p>
      </div>
    )
  }
  return (
    <div>
      <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-ink-faint">
        <span className={`h-1.5 w-1.5 rounded-full ${accent === 'a' ? 'bg-brand' : 'bg-secondary'}`} />{label}
      </p>
      <StatusBadge level={risk.riskCategory} label={risk.label} />
      <p className="mt-3 font-display text-2xl font-semibold text-ink tabular">
        {(risk.probability * 100).toFixed(0)}<span className="ml-1 text-sm font-normal text-ink-faint">% probability</span>
      </p>
      <dl className="mt-4 space-y-2 text-sm">
        <div className="flex justify-between"><dt className="text-ink-faint">Model</dt><dd className="text-ink">{risk.modelName}</dd></div>
        <div className="flex justify-between"><dt className="text-ink-faint">Version</dt><dd className="text-ink">{risk.modelVersion}</dd></div>
        <div className="flex justify-between"><dt className="text-ink-faint">Assessed</dt><dd className="text-ink">{new Date(risk.timestamp).toLocaleString()}</dd></div>
      </dl>
    </div>
  )
}

export function RiskComparisonPanel({ a, b }: { a: SessionComparisonSide; b: SessionComparisonSide }) {
  return (
    <Card title="Risk Assessment Comparison" eyebrow="AI-assisted risk assessment · not a medical diagnosis">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <RiskColumn label="Session A" side={a} accent="a" />
        <RiskColumn label="Session B" side={b} accent="b" />
      </div>
    </Card>
  )
}
