import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { usePatients } from '@/hooks/usePatients'
import { useEHGBuffer } from '@/hooks/useEHGBuffer'
import { Card } from '@/components/common/Card'
import { ConnectionIndicator } from '@/components/common/ConnectionIndicator'
import { EHGWaveformChart } from '@/components/charts/EHGWaveformChart'
import { LazyElectrodePlacementModel as ElectrodePlacementModel } from '@/components/monitoring/LazyElectrodePlacementModel'
import { ElectrodeLegend } from '@/components/monitoring/ElectrodeLegend'
import { monitoringService } from '@/services/monitoringService'
import type { MonitoringSession } from '@/types'
import { useAppMode } from '@/context/AppModeContext'

export default function MonitoringPage() {
  const { sessionId } = useParams<{ sessionId?: string }>()
  const { patients } = usePatients()
  const { isDemoMode } = useAppMode()
  const [session, setSession] = useState<MonitoringSession | null>(null)
  const [elapsed, setElapsed] = useState(0)

  const effectiveSessionId = session?.id || sessionId || null
  const { points, connection, quality } = useEHGBuffer(effectiveSessionId)
  const patient = patients.find((p) => p.id === session?.patientId) || patients[0]

  useEffect(() => {
    if (!session || session.status !== 'active') return
    const interval = setInterval(() => setElapsed((e) => e + 1), 1000)
    return () => clearInterval(interval)
  }, [session])

  async function handleStart() {
    if (!patient) return
    setElapsed(0)
    const s = await monitoringService.start(patient.id)
    setSession(s)
  }

  async function handlePause() {
    if (!session) return
    setSession(await monitoringService.pause(session.id))
  }

  async function handleStop() {
    if (!session) return
    setSession(await monitoringService.stop(session.id))
  }

  const mm = String(Math.floor(elapsed / 60)).padStart(2, '0')
  const ss = String(elapsed % 60).padStart(2, '0')

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink">Monitoring Session</h1>
          {patient ? (
            <p className="mt-1 text-sm text-ink-muted">
              <Link to={`/patients/${patient.id}`} className="hover:text-brand">{patient.name}</Link>
              {' · '}{patient.gestationalAgeWeeks} weeks gestation
            </p>
          ) : (
            <p className="mt-1 text-sm text-ink-muted">No patient selected</p>
          )}
        </div>
        <ConnectionIndicator state={session ? connection : isDemoMode ? 'demo' : 'disconnected'} />
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Card><p className="text-xs text-ink-faint">Session ID</p><p className="mt-1 truncate font-mono text-sm text-ink">{session?.id || '—'}</p></Card>
        <Card><p className="text-xs text-ink-faint">Duration</p><p className="mt-1 font-mono text-sm text-ink tabular">{mm}:{ss}</p></Card>
        <Card><p className="text-xs text-ink-faint">Electrode Contact</p><p className="mt-1 capitalize text-sm text-ink">{quality?.electrodeContact || '—'}</p></Card>
        <Card><p className="text-xs text-ink-faint">Motion / Artifact</p><p className="mt-1 capitalize text-sm text-ink">{quality?.motionArtifact || '—'}</p></Card>
      </div>

      <Card title="Live EHG Signal" action={<Link to="/ehg-signal" className="text-xs text-brand hover:underline">Open full viewer →</Link>}>
        {session ? (
          <EHGWaveformChart points={points} height={260} />
        ) : (
          <div className="flex h-[260px] items-center justify-center text-sm text-ink-faint">
            Start a session to view the live waveform.
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2" title="EHG Electrode Placement" eyebrow="Interactive reference">
          <ElectrodePlacementModel height={300} />
        </Card>
        <Card title="Channel Legend">
          <ElectrodeLegend />
        </Card>
      </div>

      <div className="flex gap-3">
        {!session || session.status === 'completed' ? (
          <button onClick={handleStart} className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white hover:bg-brand-dim">
            Start Monitoring
          </button>
        ) : (
          <>
            <button
              onClick={handlePause}
              disabled={session.status === 'paused'}
              className="rounded-md border border-border px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-hover disabled:opacity-50"
            >
              Pause Monitoring
            </button>
            <button onClick={handleStop} className="rounded-md border border-status-critical/40 px-4 py-2 text-sm font-medium text-status-critical transition-colors hover:bg-status-critical/10">
              Stop Monitoring
            </button>
          </>
        )}
        <Link to="/ehg-signal" className="rounded-md border border-border px-4 py-2 text-sm font-medium text-ink transition-colors hover:bg-surface-hover">
          View Signal
        </Link>
      </div>
    </div>
  )
}
