import { Card } from '@/components/common/Card'

const MODELS = [
  {
    name: 'Bidirectional GRU/LSTM',
    status: 'Planned — Primary Architecture',
    notes: 'Sequential model over windowed/raw EHG input. This is the architecture PREG AI is being built around for risk assessment.',
    primary: true,
  },
  {
    name: 'Random Forest',
    status: 'Baseline / Comparison',
    notes: 'Baseline classifier over hand-engineered EHG features, used as a comparison point during model evaluation.',
    primary: false,
  },
  {
    name: 'MLP',
    status: 'Baseline / Comparison',
    notes: 'Feed-forward network over the same feature set, used as a secondary comparison point.',
    primary: false,
  },
]

export default function ModelInfoPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink">Model Information</h1>
        <p className="mt-1 text-sm text-ink-muted">Current and candidate models used for preterm-risk assessment.</p>
      </div>

      <div className="rounded-md border border-border bg-surface/50 px-4 py-3 text-xs text-ink-muted">
        The frontend is model-agnostic — it renders whatever <code className="rounded bg-surface-elevated px-1 py-0.5">risk_category</code>,
        <code className="mx-1 rounded bg-surface-elevated px-1 py-0.5">probability</code>, and
        <code className="rounded bg-surface-elevated px-1 py-0.5">model_name</code> / <code className="rounded bg-surface-elevated px-1 py-0.5">model_version</code> the
        backend returns. No model logic runs in React.
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {MODELS.map((m) => (
          <Card
            key={m.name}
            title={m.name}
            eyebrow={m.status}
            className={m.primary ? 'border-brand/40 shadow-glow-sm' : ''}
          >
            <p className="text-sm text-ink-muted">{m.notes}</p>
          </Card>
        ))}
      </div>

      <Card title="Current Project Status">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3 text-sm">
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-status-normal">Working / Demonstrated</p>
            <ul className="space-y-1 text-ink-muted">
              <li>AD620 amplifier + ADS1115 ADC acquisition chain</li>
              <li>ESP32-S3 signal capture</li>
              <li>Analog calibration &amp; feature extraction (offline)</li>
            </ul>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-brand">Software Prototype</p>
            <ul className="space-y-1 text-ink-muted">
              <li>PREG AI dashboard &amp; patient/session UI</li>
              <li>EHG visualization interface</li>
              <li>Risk-assessment &amp; reporting UI</li>
            </ul>
          </div>
          <div>
            <p className="mb-2 text-xs font-medium uppercase tracking-wide text-status-warning">Future / Integration Stage</p>
            <ul className="space-y-1 text-ink-muted">
              <li>Live hardware → FastAPI → React pipeline</li>
              <li>Bidirectional GRU/LSTM training &amp; end-to-end inference</li>
              <li>Clinical validation</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  )
}
