import type { MonitoringSession, Patient } from '@/types'

function sessionLabel(s: MonitoringSession) {
  return new Date(s.startedAt).toLocaleString([], {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function SessionSelector({
  patients,
  patientId,
  sessions,
  sessionAId,
  sessionBId,
  onPatientChange,
  onSessionAChange,
  onSessionBChange,
  onCompare,
  onUseLatestTwo,
  canCompare,
}: {
  patients: Patient[]
  patientId: string
  sessions: MonitoringSession[]
  sessionAId: string
  sessionBId: string
  onPatientChange: (id: string) => void
  onSessionAChange: (id: string) => void
  onSessionBChange: (id: string) => void
  onCompare: () => void
  onUseLatestTwo: () => void
  canCompare: boolean
}) {
  return (
    <div className="card p-5">
      <div className="grid grid-cols-1 items-end gap-4 lg:grid-cols-[1.2fr_1fr_auto_1fr_auto]">
        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-muted">Patient</label>
          <select
            value={patientId}
            onChange={(e) => onPatientChange(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-elevated px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
          >
            {patients.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-muted">Session A</label>
          <select
            value={sessionAId}
            onChange={(e) => onSessionAChange(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-elevated px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
          >
            <option value="">Select session</option>
            {sessions.map((s) => (
              <option key={s.id} value={s.id} disabled={s.id === sessionBId}>{sessionLabel(s)}</option>
            ))}
          </select>
        </div>

        <p className="hidden pb-2.5 text-center text-xs font-medium text-ink-faint lg:block">VS</p>

        <div>
          <label className="mb-1.5 block text-xs font-medium text-ink-muted">Session B</label>
          <select
            value={sessionBId}
            onChange={(e) => onSessionBChange(e.target.value)}
            className="w-full rounded-md border border-border bg-surface-elevated px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
          >
            <option value="">Select session</option>
            {sessions.map((s) => (
              <option key={s.id} value={s.id} disabled={s.id === sessionAId}>{sessionLabel(s)}</option>
            ))}
          </select>
        </div>

        <button
          onClick={onCompare}
          disabled={!canCompare}
          className="rounded-md bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dim disabled:cursor-not-allowed disabled:opacity-40"
        >
          Compare
        </button>
      </div>

      <button
        onClick={onUseLatestTwo}
        disabled={sessions.length < 2}
        className="mt-3 text-xs font-medium text-secondary transition-colors hover:text-secondary/80 disabled:cursor-not-allowed disabled:opacity-40"
      >
        Use current session vs. previous session
      </button>
    </div>
  )
}
