import type { FeatureDelta } from '@/types'
import { Card } from '@/components/common/Card'
import { ChangeChip } from './ChangeChip'

function fmt(v: number) {
  return Math.abs(v) < 1 ? v.toFixed(4) : v.toFixed(2)
}

export function FeatureComparisonTable({ deltas }: { deltas: FeatureDelta[] }) {
  return (
    <Card title="EHG Feature Comparison" eyebrow="Current ESP32 firmware feature set">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] text-sm">
          <thead>
            <tr className="border-b border-border-subtle text-left text-xs text-ink-faint">
              <th className="py-2.5 pr-4 font-medium">Feature</th>
              <th className="py-2.5 pr-4 font-medium">
                <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-brand" />Session A</span>
              </th>
              <th className="py-2.5 pr-4 font-medium">
                <span className="inline-flex items-center gap-1.5"><span className="h-1.5 w-1.5 rounded-full bg-secondary" />Session B</span>
              </th>
              <th className="py-2.5 font-medium">Change</th>
            </tr>
          </thead>
          <tbody>
            {deltas.map((d, i) => (
              <tr
                key={d.key}
                className={`border-b border-border-subtle last:border-0 ${i % 2 === 1 ? 'bg-surface-elevated/40' : ''} transition-colors hover:bg-surface-hover`}
              >
                <td className="py-2.5 pr-4 text-ink">{d.label}</td>
                <td className="py-2.5 pr-4 font-mono text-ink-muted tabular">{fmt(d.a)}{d.unit ? ` ${d.unit}` : ''}</td>
                <td className="py-2.5 pr-4 font-mono text-ink-muted tabular">{fmt(d.b)}{d.unit ? ` ${d.unit}` : ''}</td>
                <td className="py-2.5"><ChangeChip direction={d.direction} percentChange={d.percentChange} compact /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  )
}
