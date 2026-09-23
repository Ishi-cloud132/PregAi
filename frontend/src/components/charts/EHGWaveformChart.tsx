import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { EHGSamplePoint } from '@/types'
import { useChartColors } from '@/hooks/useChartColors'

export function EHGWaveformChart({
  points,
  showRaw = true,
  showFiltered = true,
  height = 260,
}: {
  points: EHGSamplePoint[]
  showRaw?: boolean
  showFiltered?: boolean
  height?: number
}) {
  const c = useChartColors()

  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={points} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
        <CartesianGrid stroke={c.grid} strokeDasharray="3 3" vertical={false} />
        <XAxis
          dataKey="t"
          tickFormatter={(v) => `${Math.round(v)}s`}
          stroke={c.tick}
          tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}
          tickLine={false}
          axisLine={{ stroke: c.axisLine }}
          minTickGap={40}
        />
        <YAxis
          stroke={c.tick}
          tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}
          tickLine={false}
          axisLine={false}
          width={36}
          domain={['dataMin - 0.2', 'dataMax + 0.2']}
        />
        <Tooltip
          contentStyle={{ background: c.tooltipBg, border: `1px solid ${c.tooltipBorder}`, borderRadius: 6, fontSize: 12 }}
          labelStyle={{ color: c.tooltipLabel }}
          labelFormatter={(v) => `t = ${Number(v).toFixed(1)}s`}
        />
        {showRaw && (
          <Line type="monotone" dataKey="raw" stroke={c.mutedLine} strokeWidth={1} dot={false} isAnimationActive={false} name="Raw" />
        )}
        {showFiltered && (
          <Line type="monotone" dataKey="filtered" stroke={c.brand} strokeWidth={1.75} dot={false} isAnimationActive={false} name="Filtered" />
        )}
      </LineChart>
    </ResponsiveContainer>
  )
}
