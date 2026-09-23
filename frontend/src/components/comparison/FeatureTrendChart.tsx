import { useEffect, useMemo, useState } from 'react'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { FirmwareFeatureSet, MonitoringSession } from '@/types'
import { comparisonService } from '@/services/comparisonService'
import { FIRMWARE_FEATURE_META } from '@/services/mock/comparisonEngine'
import { Card } from '@/components/common/Card'
import { Spinner } from '@/components/common/Spinner'
import { useChartColors } from '@/hooks/useChartColors'

export function FeatureTrendChart({
  patientId,
  sessionAId,
  sessionBId,
}: {
  patientId: string
  sessionAId: string
  sessionBId: string
}) {
  const [series, setSeries] = useState<{ session: MonitoringSession; features: FirmwareFeatureSet }[] | null>(null)
  const [featureKey, setFeatureKey] = useState<keyof FirmwareFeatureSet>('energy')

  useEffect(() => {
    setSeries(null)
    comparisonService.getFeatureTrendSeries(patientId).then(setSeries)
  }, [patientId])

  const data = useMemo(() => {
    if (!series) return []
    return series.map((s) => ({
      label: new Date(s.session.startedAt).toLocaleDateString([], { day: '2-digit', month: 'short' }),
      value: s.features[featureKey],
      sessionId: s.session.id,
    }))
  }, [series, featureKey])

  const meta = FIRMWARE_FEATURE_META.find((f) => f.key === featureKey)!
  const c = useChartColors()

  return (
    <Card
      title="Feature Trends"
      eyebrow="Selected feature across this patient's recorded sessions"
      action={
        <select
          value={featureKey}
          onChange={(e) => setFeatureKey(e.target.value as keyof FirmwareFeatureSet)}
          className="rounded-md border border-border bg-surface-elevated px-2.5 py-1.5 text-xs text-ink focus:border-brand focus:outline-none"
        >
          {FIRMWARE_FEATURE_META.map((f) => (
            <option key={f.key} value={f.key}>{f.label}</option>
          ))}
        </select>
      }
    >
      {!series ? (
        <div className="flex h-52 items-center justify-center"><Spinner size={22} /></div>
      ) : (
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={data} margin={{ top: 8, right: 8, bottom: 0, left: 0 }}>
            <CartesianGrid stroke={c.grid} strokeDasharray="3 3" vertical={false} />
            <XAxis dataKey="label" stroke={c.tick} tick={{ fontSize: 10 }} tickLine={false} axisLine={{ stroke: c.axisLine }} />
            <YAxis stroke={c.tick} tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }} tickLine={false} axisLine={false} width={44} />
            <Tooltip
              contentStyle={{ background: c.tooltipBg, border: `1px solid ${c.tooltipBorder}`, borderRadius: 8, fontSize: 12 }}
              labelStyle={{ color: c.tooltipLabel }}
              formatter={(v: number) => [`${v}${meta.unit ? ` ${meta.unit}` : ''}`, meta.label]}
            />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {data.map((d) => (
                <Cell
                  key={d.sessionId}
                  fill={d.sessionId === sessionAId ? c.brand : d.sessionId === sessionBId ? c.secondary : c.barInactive}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
