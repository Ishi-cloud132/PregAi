import type { ComparisonInsight } from '@/types'
import { Card } from '@/components/common/Card'

export function InsightsList({ insights }: { insights: ComparisonInsight[] }) {
  return (
    <Card title="Signal Insights" eyebrow="Analytical observations, not clinical conclusions">
      <ul className="space-y-3">
        {insights.map((insight) => (
          <li key={insight.id} className="flex gap-2.5 text-sm">
            <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-secondary" />
            <p className="text-ink-muted">{insight.text}</p>
          </li>
        ))}
      </ul>
    </Card>
  )
}
