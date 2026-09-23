import { useEffect, useState } from 'react'
import { Card } from '@/components/common/Card'
import { EHGWaveformChart } from '@/components/charts/EHGWaveformChart'
import { FirmwareFeatureGrid } from '@/components/common/FirmwareFeatureGrid'
import { useEHGBuffer } from '@/hooks/useEHGBuffer'
import { signalService } from '@/services/signalService'
import { FIRMWARE_FEATURE_META } from '@/services/mock/comparisonEngine'
import type { FirmwareFeatureSet } from '@/types'

// Rough per-feature scale used only to draw a relative visual profile —
// not a clinical normalization, just enough to make bars comparable.
const ROUGH_MAX: Record<keyof FirmwareFeatureSet, number> = {
  variance: 0.07,
  energy: 3.7,
  mav: 0.033,
  peakToPeak: 0.9,
  lineLength: 19,
  crestFactor: 4,
  peakFrequencyHz: 0.7,
  medianFrequencyHz: 0.7,
  skewness: 0.6,
  kurtosis: 3.9,
}

export default function SignalEDAPage() {
  const sessionId = 'SES-DEMO-EDA'
  const { points, quality } = useEHGBuffer(sessionId)
  const [firmwareFeatures, setFirmwareFeatures] = useState<FirmwareFeatureSet | null>(null)

  useEffect(() => {
    signalService.getFirmwareFeatures(sessionId).then(setFirmwareFeatures)
  }, [])

  const amplitudes = points.map((p) => p.filtered)
  const buckets = 10
  const min = Math.min(...amplitudes, 0)
  const max = Math.max(...amplitudes, 1)
  const histogram = Array.from({ length: buckets }, (_, i) => {
    const lo = min + ((max - min) / buckets) * i
    const hi = lo + (max - min) / buckets
    return amplitudes.filter((a) => a >= lo && a < hi).length
  })
  const maxCount = Math.max(...histogram, 1)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink">Signal EDA</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Exploratory analysis of the converted EHG waveform, using the current ESP32 firmware feature set.
        </p>
      </div>

      <Card title="Waveform Analysis" eyebrow="Post-conversion, current buffered window">
        <EHGWaveformChart points={points} height={220} />
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Amplitude Distribution" eyebrow="Current buffered window">
          <div className="flex h-40 items-end gap-1.5">
            {histogram.map((c, i) => (
              <div key={i} className="flex-1 rounded-t bg-brand/60 transition-all hover:bg-brand" style={{ height: `${(c / maxCount) * 100}%` }} />
            ))}
          </div>
          <p className="mt-3 text-xs text-ink-faint">Distribution of filtered amplitude values across the current rolling buffer.</p>
        </Card>

        <Card title="Signal Quality &amp; Artifact Analysis">
          <dl className="space-y-3 text-sm">
            <Row label="Quality score" value={quality ? `${quality.score}/100` : '—'} />
            <Row label="Electrode contact" value={quality?.electrodeContact || '—'} capitalize />
            <Row label="Motion artifact" value={quality?.motionArtifact || '—'} capitalize />
            <Row label="SNR" value={quality?.snrDb ? `${quality.snrDb.toFixed(1)} dB` : '—'} />
          </dl>
          {quality && quality.motionArtifact !== 'none' && (
            <p className="mt-3 rounded-md border border-status-warning/25 bg-status-warning/5 px-3 py-2 text-xs text-status-warning">
              Motion artifact detected in part of the current window — features derived from this segment may be less reliable.
            </p>
          )}
        </Card>
      </div>

      <Card title="Statistical Features" eyebrow="Current ESP32 firmware feature set">
        {firmwareFeatures ? (
          <FirmwareFeatureGrid features={firmwareFeatures} />
        ) : (
          <p className="text-sm text-ink-faint">Loading…</p>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Card title="Feature Profile" eyebrow="Relative magnitude, not clinically normalized">
          {firmwareFeatures ? (
            <div className="space-y-2.5">
              {FIRMWARE_FEATURE_META.map((meta) => {
                const value = firmwareFeatures[meta.key]
                const pct = Math.min(100, (Math.abs(value) / ROUGH_MAX[meta.key]) * 100)
                return (
                  <div key={meta.key}>
                    <div className="mb-1 flex justify-between text-xs">
                      <span className="text-ink-muted">{meta.label}</span>
                      <span className="font-mono text-ink-faint">{value}</span>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-surface-elevated">
                      <div className="h-full rounded-full bg-secondary" style={{ width: `${pct}%` }} />
                    </div>
                  </div>
                )
              })}
            </div>
          ) : (
            <p className="text-sm text-ink-faint">Loading…</p>
          )}
        </Card>

        <Card title="Frequency-Domain Analysis" eyebrow="Available spectral features">
          {firmwareFeatures ? (
            <dl className="space-y-3 text-sm">
              <Row label="Peak frequency" value={`${firmwareFeatures.peakFrequencyHz} Hz`} />
              <Row label="Median frequency" value={`${firmwareFeatures.medianFrequencyHz} Hz`} />
            </dl>
          ) : (
            <p className="text-sm text-ink-faint">Loading…</p>
          )}
          <div className="mt-4 flex h-24 items-center justify-center rounded-md border border-dashed border-border text-center text-xs text-ink-faint">
            Full FFT / power-spectral-density visualization will render once the backend exposes it.
          </div>
        </Card>
      </div>
    </div>
  )
}

function Row({ label, value, capitalize }: { label: string; value: string; capitalize?: boolean }) {
  return (
    <div className="flex justify-between border-b border-border-subtle pb-2.5 last:border-0 last:pb-0">
      <dt className="text-ink-faint">{label}</dt>
      <dd className={`text-ink ${capitalize ? 'capitalize' : ''}`}>{value}</dd>
    </div>
  )
}
