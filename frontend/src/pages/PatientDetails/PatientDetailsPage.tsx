import { Link, useNavigate, useParams } from 'react-router-dom'
import { usePatient } from '@/hooks/usePatient'
import { Card } from '@/components/common/Card'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Spinner } from '@/components/common/Spinner'
import { ErrorState } from '@/components/common/ErrorState'
import { monitoringService } from '@/services/monitoringService'
import { useState } from 'react'

export default function PatientDetailsPage() {
  const { id } = useParams<{ id: string }>()
  const { patient, sessions, loading, error } = usePatient(id)
  const navigate = useNavigate()
  const [starting, setStarting] = useState(false)

  if (loading) return <div className="flex justify-center py-16"><Spinner size={24} /></div>
  if (error || !patient) return <ErrorState message={error || 'Patient not found.'} />

  async function handleStartMonitoring() {
    if (!patient) return
    setStarting(true)
    try {
      const session = await monitoringService.start(patient.id)
      navigate(`/monitoring/${session.id}`)
    } finally {
      setStarting(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <Link to="/patients" className="text-xs text-ink-faint hover:text-ink">← Back to Patients</Link>
      </div>

      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="font-display text-xl font-semibold text-ink">{patient.name}</h1>
            <StatusBadge level={patient.riskFlag} />
          </div>
          <p className="mt-1 text-sm text-ink-muted">
            {patient.id} · Age {patient.age} · {patient.gestationalAgeWeeks} weeks gestation · G{patient.gravida}P{patient.para}
          </p>
        </div>
        <button
          onClick={handleStartMonitoring}
          disabled={starting}
          className="flex items-center gap-2 rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dim disabled:opacity-60"
        >
          {starting && <Spinner size={14} />}
          Start Monitoring
        </button>
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-3">
        <Card title="Patient Information" className="xl:col-span-1">
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-ink-faint">Assigned clinician</dt><dd className="text-ink">{patient.assignedClinician}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-faint">Gravida / Para</dt><dd className="text-ink">G{patient.gravida}P{patient.para}</dd></div>
            <div className="flex justify-between"><dt className="text-ink-faint">Gestational age</dt><dd className="text-ink">{patient.gestationalAgeWeeks} weeks</dd></div>
            <div className="flex justify-between"><dt className="text-ink-faint">Last session</dt><dd className="text-ink">{patient.lastSessionAt ? new Date(patient.lastSessionAt).toLocaleDateString() : '—'}</dd></div>
          </dl>
          {patient.tags.length > 0 && (
            <div className="mt-4 flex flex-wrap gap-1.5 border-t border-border-subtle pt-4">
              {patient.tags.map((t) => (
                <span key={t} className="rounded border border-border px-2 py-0.5 text-xs capitalize text-ink-muted">{t}</span>
              ))}
            </div>
          )}
        </Card>

        <Card title="Monitoring History" className="xl:col-span-2">
          <div className="divide-y divide-border-subtle">
            {sessions.map((s) => (
              <div key={s.id} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <div>
                  <p className="text-sm text-ink">{new Date(s.startedAt).toLocaleString()}</p>
                  <p className="text-xs text-ink-faint">
                    Duration {Math.round(s.durationSeconds / 60)} min · {s.status}
                  </p>
                </div>
                <Link to={`/monitoring/${s.id}`} className="text-xs font-medium text-brand hover:underline">
                  View session →
                </Link>
              </div>
            ))}
            {sessions.length === 0 && <p className="py-6 text-center text-sm text-ink-faint">No monitoring sessions yet.</p>}
          </div>
        </Card>
      </div>
    </div>
  )
}
