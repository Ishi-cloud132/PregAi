import { useEffect, useState } from 'react'
import type { Report } from '@/types'
import { reportService } from '@/services/reportService'
import { patientService } from '@/services/patientService'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Spinner } from '@/components/common/Spinner'
import { useAppMode } from '@/context/AppModeContext'
import { ReportDetailDrawer } from '@/components/reports/ReportDetailDrawer'

export default function ReportsPage() {
  const [reports, setReports] = useState<Report[]>([])
  const [names, setNames] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [selected, setSelected] = useState<Report | null>(null)
  const { isDemoMode } = useAppMode()

  useEffect(() => {
    reportService.list().then(async (rs) => {
      setReports(rs)
      const entries = await Promise.all(
        [...new Set(rs.map((r) => r.patientId))].map(async (id) => [id, (await patientService.get(id)).name] as const),
      )
      setNames(Object.fromEntries(entries))
      setLoading(false)
    })
  }, [])

  async function handleExport(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    const url = await reportService.exportUrl(id)
    if (!url) {
      alert('Report export requires a connected FastAPI backend. This report cannot be exported in Demo Mode.')
      return
    }
    window.open(url, '_blank')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink">Reports</h1>
        <p className="mt-1 text-sm text-ink-muted">
          Session summaries and exportable clinical reports. Click a row to open the report and ask the assistant about it.
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center py-16"><Spinner size={24} /></div>
      ) : (
        <div className="card overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border text-left text-xs text-ink-faint">
                <th className="px-4 py-3 font-medium">Patient</th>
                <th className="px-4 py-3 font-medium">Session</th>
                <th className="px-4 py-3 font-medium">Duration</th>
                <th className="px-4 py-3 font-medium">Signal Quality</th>
                <th className="px-4 py-3 font-medium">Risk</th>
                <th className="px-4 py-3 font-medium">Created</th>
                <th className="px-4 py-3 font-medium"></th>
              </tr>
            </thead>
            <tbody>
              {reports.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => setSelected(r)}
                  className="cursor-pointer border-b border-border-subtle transition-colors last:border-0 hover:bg-surface-hover"
                >
                  <td className="px-4 py-3 text-ink">{names[r.patientId] || r.patientId}</td>
                  <td className="px-4 py-3 font-mono text-xs text-ink-muted">{r.sessionId}</td>
                  <td className="px-4 py-3 text-ink-muted">{Math.round(r.monitoringDurationSeconds / 60)} min</td>
                  <td className="px-4 py-3 text-ink-muted">{r.signalQualityScore}/100</td>
                  <td className="px-4 py-3"><StatusBadge level={r.riskCategory} /></td>
                  <td className="px-4 py-3 text-ink-muted">{new Date(r.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={(e) => handleExport(e, r.id)} className="text-xs font-medium text-brand hover:underline">
                      Export
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {isDemoMode && (
        <p className="text-xs text-ink-faint">
          Report generation and export are performed by the FastAPI backend. In Demo Mode, exports are disabled —
          the frontend only visualizes report metadata.
        </p>
      )}

      {selected && <ReportDetailDrawer report={selected} onClose={() => setSelected(null)} />}
    </div>
  )
}
