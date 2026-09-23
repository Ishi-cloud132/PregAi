import { Line, LineChart, ResponsiveContainer } from 'recharts'

export function TrendSparkline({ data, color = '#1E3A5F' }: { data: number[]; color?: string }) {
  const points = data.map((v, i) => ({ i, v }))
  return (
    <ResponsiveContainer width="100%" height={40}>
      <LineChart data={points}>
        <Line type="monotone" dataKey="v" stroke={color} strokeWidth={1.5} dot={false} isAnimationActive={false} />
      </LineChart>
    </ResponsiveContainer>
  )
}
