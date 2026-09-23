import { useEffect, useState } from 'react'
import { Card } from '@/components/common/Card'
import { ConnectionIndicator } from '@/components/common/ConnectionIndicator'
import { EHGWaveformChart } from '@/components/charts/EHGWaveformChart'
import { FirmwareFeatureGrid } from '@/components/common/FirmwareFeatureGrid'
import { useEHGBuffer } from '@/hooks/useEHGBuffer'
import { signalService } from '@/services/signalService'
import { ELECTRODE_POINTS } from '@/components/monitoring/electrodePoints'
import type { FirmwareFeatureSet, SignalFeatures } from '@/types'

type ViewMode = 'raw' | 'filtered' | 'both'

const SIGNAL_CHANNELS = ELECTRODE_POINTS.filter((p) => p.role === 'signal').length

export default function EHGSignalPage() {
  const sessionId = 'SES-DEMO-EHG-VIEWER'
  const { points, connection, quality } = useEHGBuffer(sessionId)
  const [view, setView] = useState<ViewMode>('both')
  const [features, setFeatures] = useState<SignalFeatures | null>(null)
  const [firmwareFeatures, setFirmwareFeatures] = useState<FirmwareFeatureSet | null>(null)

  useEffect(() => {
    signalService.getFeatures(sessionId).then(setFeatures)
    signalService.getFirmwareFeatures(sessionId).then(setFirmwareFeatures)
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink">EHG Signal</h1>
          <p className="mt-1 text-sm text-ink-muted">Raw and filtered uterine electromyographic signal.</p>
        </div>
        <ConnectionIndicator state={connection} />
      </div>

      <Card
        title="Waveform"
        eyebrow={`Window: last ${points.length ? Math.round(points[points.length - 1].t - points[0].t) : 0}s`}
        action={
          <div className="flex items-center gap-1 rounded-md border border-border p-0.5">
            {(['raw', 'filtered', 'both'] as ViewMode[]).map((v) => (
              <button
                key={v}
                onClick={() => setView(v)}
                className={`rounded px-2.5 py-1 text-xs capitalize transition-colors ${
                  view === v ? 'bg-brand/15 text-brand' : 'text-ink-muted hover:text-ink'
                }`}
              >
                {v === 'both' ? 'Compare' : v} {v !== 'both' && 'Signal'}
              </button>
            ))}
          </div>
        }
      >
        <EHGWaveformChart points={points} showRaw={view !== 'filtered'} showFiltered={view !== 'raw'} height={320} />
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card title="Signal Quality">
          <dl className="space-y-3 text-sm">
            <Row label="Quality score" value={quality ? `${quality.score}/100` : '—'} />
            <Row label="Electrode contact" value={quality?.electrodeContact || '—'} capitalize />
            <Row label="Motion artifact" value={quality?.motionArtifact || '—'} capitalize />
            <Row label="SNR" value={quality?.snrDb ? `${quality.snrDb.toFixed(1)} dB` : '—'} />
          </dl>
        </Card>

        <Card title="Processing">
          <dl className="space-y-3 text-sm">
            <Row label="Filter type" value={features?.filterType || '—'} />
            <Row label="Filter order" value={features ? String(features.filterOrder) : '—'} />
            <Row label="Processing delay" value={features ? `${features.processingDelayMs.toFixed(1)} ms` : '—'} />
            <Row label="Phase lag" value={features?.phaseLagMs != null ? `${features.phaseLagMs} ms` : 'Not Available'} />
          </dl>
        </Card>

        <Card title="Session Metadata">
          <dl className="space-y-3 text-sm">
            <Row label="Sampling rate" value="20 Hz (windowed / downsampled)" />
            <Row label="Buffer window" value="30 s rolling" />
            <Row label="Channels" value={`${SIGNAL_CHANNELS} signal + 1 reference`} />
            <Row label="Mode" value={connection === 'demo' ? 'Demo' : 'Live'} />
          </dl>
        </Card>
      </div>

      <Card title="Extracted Features" eyebrow="Current ESP32 firmware feature set">
        {firmwareFeatures ? (
          <FirmwareFeatureGrid features={firmwareFeatures} />
        ) : (
          <p className="text-sm text-ink-faint">Loading…</p>
        )}
      </Card>
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
