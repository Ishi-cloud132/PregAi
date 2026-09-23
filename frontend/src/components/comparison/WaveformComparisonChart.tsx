import { useMemo, useState } from 'react'
import { CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { EHGSignalWindow } from '@/types'
import { Card } from '@/components/common/Card'
import { useChartColors } from '@/hooks/useChartColors'

type Mode = 'raw' | 'filtered'

export function WaveformComparisonChart({ signalA, signalB }: { signalA: EHGSignalWindow; signalB: EHGSignalWindow }) {
  const [showA, setShowA] = useState(true)
  const [showB, setShowB] = useState(true)
  const [mode, setMode] = useState<Mode>('filtered')
  const c = useChartColors()

  const data = useMemo(() => {
    const n = Math.min(signalA.points.length, signalB.points.length)
    const rows = []
    for (let i = 0; i < n; i++) {
      rows.push({
        t: signalA.points[i].t,
        a: signalA.points[i][mode],
        b: signalB.points[i][mode],
      })
    }
    return rows
  }, [signalA, signalB, mode])

  return (
    <Card
      title="EHG Waveform Comparison"
      eyebrow="Overlaid session recordings"
      action={
        <div className="flex items-center gap-1 rounded-md border border-border p-0.5">
          {(['raw', 'filtered'] as Mode[]).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              className={`rounded px-2.5 py-1 text-xs capitalize transition-colors ${
                mode === m ? 'bg-brand/15 text-brand' : 'text-ink-muted hover:text-ink'
              }`}
            >
              {m}
            </button>
          ))}
        </div>
      }
    >
      <div className="mb-3 flex flex-wrap items-center gap-4">
        <label className="flex items-center gap-2 text-xs text-ink-muted">
          <input type="checkbox" checked={showA} onChange={(e) => setShowA(e.target.checked)} className="accent-brand" />
          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-brand" /> Session A</span>
        </label>
        <label className="flex items-center gap-2 text-xs text-ink-muted">
          <input type="checkbox" checked={showB} onChange={(e) => setShowB(e.target.checked)} className="accent-secondary" />
          <span className="inline-flex items-center gap-1.5"><span className="h-2 w-2 rounded-full bg-secondary" /> Session B</span>
        </label>
      </div>

      <ResponsiveContainer width="100%" height={340}>
        <LineChart data={data} margin={{ top: 4, right: 8, bottom: 0, left: 0 }}>
          <CartesianGrid stroke={c.grid} strokeDasharray="3 3" vertical={false} />
          <XAxis
            dataKey="t"
            tickFormatter={(v) => `${Math.round(v)}s`}
            stroke={c.tick}
            tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}
            tickLine={false}
            axisLine={{ stroke: c.axisLine }}
            minTickGap={40}
            label={{ value: 'Time (s)', position: 'insideBottomRight', offset: -2, fill: c.tick, fontSize: 10 }}
          />
          <YAxis
            stroke={c.tick}
            tick={{ fontSize: 10, fontFamily: 'JetBrains Mono' }}
            tickLine={false}
            axisLine={false}
            width={40}
            domain={['dataMin - 0.2', 'dataMax + 0.2']}
            label={{ value: 'Amplitude', angle: -90, position: 'insideLeft', fill: c.tick, fontSize: 10 }}
          />
          <Tooltip
            contentStyle={{ background: c.tooltipBg, border: `1px solid ${c.tooltipBorder}`, borderRadius: 8, fontSize: 12 }}
            labelStyle={{ color: c.tooltipLabel }}
            labelFormatter={(v) => `t = ${Number(v).toFixed(1)}s`}
          />
          <Legend wrapperStyle={{ fontSize: 11, color: c.tooltipLabel }} />
          {showA && (
            <Line type="monotone" dataKey="a" name="Session A" stroke={c.brand} strokeWidth={1.75} dot={false} isAnimationActive={false} />
          )}
          {showB && (
            <Line type="monotone" dataKey="b" name="Session B" stroke={c.secondary} strokeWidth={1.75} dot={false} isAnimationActive={false} />
          )}
        </LineChart>
      </ResponsiveContainer>
    </Card>
  )
}
