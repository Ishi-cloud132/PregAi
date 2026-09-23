import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePatients } from '@/hooks/usePatients'
import { useEHGBuffer } from '@/hooks/useEHGBuffer'
import { StatCard } from '@/components/dashboard/StatCard'
import { AlertsPanel } from '@/components/dashboard/AlertsPanel'
import { Card } from '@/components/common/Card'
import { StatusBadge } from '@/components/common/StatusBadge'
import { ConnectionIndicator } from '@/components/common/ConnectionIndicator'
import { EHGWaveformChart } from '@/components/charts/EHGWaveformChart'
import { LazyElectrodePlacementModel as ElectrodePlacementModel } from '@/components/monitoring/LazyElectrodePlacementModel'
import { ElectrodeLegend } from '@/components/monitoring/ElectrodeLegend'
import { mockAlerts } from '@/services/mock/mockData'
import { riskService } from '@/services/riskService'
import type { RiskAssessment } from '@/types'
import { useAppMode } from '@/context/AppModeContext'

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
      <path d={d} />
    </svg>
  )
}

export default function DashboardPage() {
  const { patients, loading } = usePatients()
  const { isDemoMode } = useAppMode()
  const demoSessionId = 'SES-DEMO-DASHBOARD'
  const { points, quality } = useEHGBuffer(demoSessionId)
  const [risk, setRisk] = useState<RiskAssessment | null>(null)

  const selectedPatient = patients[1]

  useEffect(() => {
    if (!selectedPatient) return
    riskService.getForSession(demoSessionId, selectedPatient.id).then(setRisk)
  }, [selectedPatient?.id])

  const activeSessions = 1
  const totalPatients = patients.length
  const recentSessions = useMemo(() => patients.slice(0, 4), [patients])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink">Overview</h1>
          <p className="mt-1 text-sm text-ink-muted">Monitoring summary across all active patients.</p>
        </div>
        <Link
          to="/patients"
          className="rounded-md bg-brand px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dim"
        >
          Select Patient
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <StatCard
          label="Active Sessions"
          value={activeSessions}
          hint="Currently monitoring"
          tooltip="Monitoring sessions currently in progress across all patients."
          icon={<Icon d="M3 12h3l2-7 4 14 3-9 2 3h4" />}
          accent="brand"
        />
        <StatCard
          label="Monitored Patients"
          value={loading ? '—' : totalPatients}
          hint="Total in system"
          tooltip="Total number of patients registered in PREG AI."
          icon={<Icon d="M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0" />}
          accent="secondary"
        />
        <StatCard
          label="Signal Quality"
          value={quality ? quality.score : '—'}
          unit="/100"
          hint="Current session"
          tooltip="Composite score from electrode contact, motion artifact, and SNR for the active session."
          icon={<Icon d="M4 19V10m5 9V5m5 14v-7m5 7V8" />}
          accent="gold"
        />
        <StatCard
          label="System Status"
          value={isDemoMode ? 'Demo' : 'Live'}
          hint={isDemoMode ? 'Simulated data source' : 'Connected to FastAPI'}
          tooltip="Whether the app is showing simulated data or a live FastAPI connection. Never shown ambiguously."
          icon={<Icon d="M12 2a10 10 0 1 0 10 10M12 2v10l6 3" />}
          accent="purple"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card
          className="xl:col-span-2"
          eyebrow={selectedPatient ? `${selectedPatient.name} · Session in progress` : undefined}
          title="Current Monitoring · EHG Waveform"
          action={<ConnectionIndicator state={isDemoMode ? 'demo' : 'connected'} />}
        >
          <EHGWaveformChart points={points} height={220} />
          <div className="mt-4 grid grid-cols-3 gap-3 border-t border-border-subtle pt-4 text-sm">
            <div>
              <p className="text-xs text-ink-faint">Electrode contact</p>
              <p className="mt-0.5 capitalize text-ink">{quality?.electrodeContact || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-ink-faint">Motion artifact</p>
              <p className="mt-0.5 capitalize text-ink">{quality?.motionArtifact || '—'}</p>
            </div>
            <div>
              <p className="text-xs text-ink-faint">SNR</p>
              <p className="mt-0.5 text-ink">{quality?.snrDb ? `${quality.snrDb.toFixed(1)} dB` : '—'}</p>
            </div>
          </div>
          <Link
            to="/ehg-signal"
            className="mt-4 inline-block text-xs font-medium text-brand hover:underline"
          >
            View full signal analysis →
          </Link>
        </Card>

        <AlertsPanel alerts={mockAlerts} />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card className="xl:col-span-2" title="EHG Electrode Placement" eyebrow="Where the sensors attach">
          <ElectrodePlacementModel height={280} />
        </Card>
        <Card title="Channel Legend">
          <ElectrodeLegend />
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card
          className="xl:col-span-2"
          title="Recent Sessions"
          action={<Link to="/patients" className="text-xs text-brand hover:underline">View all</Link>}
        >
          <div className="divide-y divide-border-subtle">
            {recentSessions.map((p) => (
              <Link
                key={p.id}
                to={`/patients/${p.id}`}
                className="flex items-center justify-between rounded-md px-2 py-3 -mx-2 transition-colors first:pt-0 last:pb-0 hover:bg-surface-hover"
              >
                <div>
                  <p className="text-sm text-ink">{p.name}</p>
                  <p className="text-xs text-ink-faint">
                    {p.gestationalAgeWeeks} wks · {p.lastSessionAt ? new Date(p.lastSessionAt).toLocaleDateString() : 'No sessions yet'}
                  </p>
                </div>
                <StatusBadge level={p.riskFlag} />
              </Link>
            ))}
          </div>
        </Card>

        <Card title="Risk · Latest Assessment" eyebrow={risk ? `Model ${risk.modelName} v${risk.modelVersion}` : undefined}>
          {risk ? (
            <div>
              <StatusBadge level={risk.riskCategory} label={risk.label} />
              <p className="mt-3 font-display text-2xl font-semibold text-ink tabular">
                {(risk.probability * 100).toFixed(0)}
                <span className="ml-1 text-sm font-normal text-ink-faint">% confidence</span>
              </p>
              <p className="mt-2 text-xs text-ink-faint">
                Assessed {new Date(risk.timestamp).toLocaleString()}
              </p>
              <Link to="/risk-assessment" className="mt-3 inline-block text-xs font-medium text-brand hover:underline">
                Full risk assessment →
              </Link>
            </div>
          ) : (
            <p className="text-sm text-ink-faint">Loading…</p>
          )}
        </Card>
      </div>
    </div>
  )
}
