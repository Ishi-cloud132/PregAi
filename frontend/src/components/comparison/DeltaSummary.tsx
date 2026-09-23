import type { FeatureDelta, SessionComparisonSide } from '@/types'
import { percentChange } from '@/services/mock/comparisonEngine'
import { ChangeChip } from './ChangeChip'
import { Card } from '@/components/common/Card'

function directionOf(pct: number): 'increased' | 'decreased' | 'stable' {
  if (Math.abs(pct) < 2) return 'stable'
  return pct > 0 ? 'increased' : 'decreased'
}

export function DeltaSummary({ a, b, featureDeltas }: { a: SessionComparisonSide; b: SessionComparisonSide; featureDeltas: FeatureDelta[] }) {
  const qualityPct = Number(percentChange(a.quality.score, b.quality.score).toFixed(1))
  const energy = featureDeltas.find((d) => d.key === 'energy')
  const p2p = featureDeltas.find((d) => d.key === 'peakToPeak')
  const medFreq = featureDeltas.find((d) => d.key === 'medianFrequencyHz')

  const rows = [
    { label: 'Signal Quality', pct: qualityPct, dir: directionOf(qualityPct) },
    energy && { label: 'Energy', pct: energy.percentChange, dir: energy.direction },
    p2p && { label: 'Peak-to-Peak', pct: p2p.percentChange, dir: p2p.direction },
    medFreq && { label: 'Median Frequency', pct: medFreq.percentChange, dir: medFreq.direction },
  ].filter(Boolean) as { label: string; pct: number; dir: 'increased' | 'decreased' | 'stable' }[]

  return (
    <Card title="Session Comparison" eyebrow="Difference from Session A to Session B">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {rows.map((r) => (
          <div key={r.label} className="rounded-md border border-border-subtle p-3">
            <p className="text-xs text-ink-faint">{r.label}</p>
            <div className="mt-1.5">
              <ChangeChip direction={r.dir} percentChange={r.pct} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  )
}
