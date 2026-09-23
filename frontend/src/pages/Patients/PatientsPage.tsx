import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { usePatients } from '@/hooks/usePatients'
import { StatusBadge } from '@/components/common/StatusBadge'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { Spinner } from '@/components/common/Spinner'
import type { RiskLevel } from '@/types'

type SortKey = 'name' | 'gestationalAgeWeeks' | 'lastSessionAt'

export default function PatientsPage() {
  const { patients, loading, error, reload } = usePatients()
  const [query, setQuery] = useState('')
  const [riskFilter, setRiskFilter] = useState<RiskLevel | 'all'>('all')
  const [sortKey, setSortKey] = useState<SortKey>('name')

  const filtered = useMemo(() => {
    let list = patients.filter((p) => p.name.toLowerCase().includes(query.toLowerCase()) || p.id.toLowerCase().includes(query.toLowerCase()))
    if (riskFilter !== 'all') list = list.filter((p) => p.riskFlag === riskFilter)
    list = [...list].sort((a, b) => {
      if (sortKey === 'name') return a.name.localeCompare(b.name)
      if (sortKey === 'gestationalAgeWeeks') return b.gestationalAgeWeeks - a.gestationalAgeWeeks
      return (b.lastSessionAt || '').localeCompare(a.lastSessionAt || '')
    })
    return list
  }, [patients, query, riskFilter, sortKey])

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink">Patients</h1>
          <p className="mt-1 text-sm text-ink-muted">{patients.length} patients under monitoring</p>
        </div>
        <button className="rounded-md bg-brand px-3.5 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dim">
          + New Patient
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name or ID…"
          className="w-64 rounded-md border border-border bg-surface-elevated px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-brand focus:outline-none"
        />
        <select
          value={riskFilter}
          onChange={(e) => setRiskFilter(e.target.value as RiskLevel | 'all')}
          className="rounded-md border border-border bg-surface-elevated px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
        >
          <option value="all">All risk levels</option>
          <option value="normal">Normal</option>
          <option value="warning">Needs Attention</option>
          <option value="critical">Critical</option>
        </select>
        <select
          value={sortKey}
          onChange={(e) => setSortKey(e.target.value as SortKey)}
          className="rounded-md border border-border bg-surface-elevated px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
        >
          <option value="name">Sort: Name</option>
          <option value="gestationalAgeWeeks">Sort: Gestational Age</option>
          <option value="lastSessionAt">Sort: Last Session</option>
        </select>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size={24} /></div>
      ) : error ? (
        <ErrorState message={error} onRetry={reload} />
      ) : filtered.length === 0 ? (
        <EmptyState title="No patients found" description="Try adjusting your search or filters." />
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-ink-faint">
                <th className="px-4 py-3 font-medium">Patient</th>
                <th className="px-4 py-3 font-medium">Gestational Age</th>
                <th className="px-4 py-3 font-medium">Gravida / Para</th>
                <th className="px-4 py-3 font-medium">Clinician</th>
                <th className="px-4 py-3 font-medium">Last Session</th>
                <th className="px-4 py-3 font-medium">Risk</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((p) => (
                <tr key={p.id} className="border-b border-border-subtle transition-colors last:border-0 hover:bg-surface-hover">
                  <td className="px-4 py-3">
                    <Link to={`/patients/${p.id}`} className="font-medium text-ink hover:text-brand">
                      {p.name}
                    </Link>
                    <p className="text-xs text-ink-faint">{p.id} · Age {p.age}</p>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{p.gestationalAgeWeeks} wks</td>
                  <td className="px-4 py-3 text-ink-muted">G{p.gravida}P{p.para}</td>
                  <td className="px-4 py-3 text-ink-muted">{p.assignedClinician}</td>
                  <td className="px-4 py-3 text-ink-muted">
                    {p.lastSessionAt ? new Date(p.lastSessionAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3"><StatusBadge level={p.riskFlag} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
