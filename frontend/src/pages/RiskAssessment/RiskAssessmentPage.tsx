import { useEffect, useState } from 'react'
import { usePatients } from '@/hooks/usePatients'
import { riskService } from '@/services/riskService'
import type { RiskAssessment } from '@/types'
import { Card } from '@/components/common/Card'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Spinner } from '@/components/common/Spinner'

export default function RiskAssessmentPage() {
  const { patients } = usePatients()
  const [selectedId, setSelectedId] = useState<string>('')
  const [risk, setRisk] = useState<RiskAssessment | null>(null)
  const [history, setHistory] = useState<RiskAssessment[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!selectedId && patients[0]) setSelectedId(patients[0].id)
  }, [patients])

  useEffect(() => {
    if (!selectedId) return
    setLoading(true)
    Promise.all([
      riskService.getForSession(`SES-${selectedId}-latest`, selectedId),
      riskService.history(selectedId),
    ])
      .then(([r, h]) => {
        setRisk(r)
        setHistory(h)
      })
      .finally(() => setLoading(false))
  }, [selectedId])

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-xl font-semibold text-ink">Risk Assessment</h1>
          <p className="mt-1 text-sm text-ink-muted">AI-assisted preterm-risk decision support.</p>
        </div>
        <select
          value={selectedId}
          onChange={(e) => setSelectedId(e.target.value)}
          className="rounded-md border border-border bg-surface-elevated px-3 py-2 text-sm text-ink focus:border-brand focus:outline-none"
        >
          {patients.map((p) => (
            <option key={p.id} value={p.id}>{p.name}</option>
          ))}
        </select>
      </div>

      <div className="rounded-md border border-status-warning/30 bg-status-warning/5 px-4 py-3 text-xs text-ink-muted">
        <strong className="text-status-warning">Decision support, not diagnosis.</strong> PREG AI provides AI-assisted
        risk assessment for research and decision support. It does not replace professional medical diagnosis or
        clinical judgment.
      </div>

      {loading || !risk ? (
        <div className="flex justify-center py-16"><Spinner size={24} /></div>
      ) : (
        <>
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
            <Card className="lg:col-span-2" title="Current Assessment" eyebrow={`Session ${risk.sessionId}`}>
              <StatusBadge level={risk.riskCategory} label={risk.label} />
              <p className="mt-4 font-display text-4xl font-semibold text-ink tabular">
                {(risk.probability * 100).toFixed(0)}<span className="ml-1 text-base font-normal text-ink-faint">% probability</span>
              </p>
              <div className="mt-5 grid grid-cols-2 gap-4 border-t border-border-subtle pt-4 text-sm">
                <div><p className="text-ink-faint">Model</p><p className="mt-0.5 text-ink">{risk.modelName}</p></div>
                <div><p className="text-ink-faint">Version</p><p className="mt-0.5 text-ink">{risk.modelVersion}</p></div>
                <div><p className="text-ink-faint">Assessed</p><p className="mt-0.5 text-ink">{new Date(risk.timestamp).toLocaleString()}</p></div>
              </div>
            </Card>

            <Card title="Contributing Features">
              <ul className="space-y-3">
                {risk.contributingFeatures.map((f) => (
                  <li key={f.name}>
                    <div className="flex justify-between text-sm">
                      <span className="text-ink-muted">{f.name}</span>
                      <span className="font-mono text-ink">{f.value}</span>
                    </div>
                    <div className="mt-1 h-1 overflow-hidden rounded-full bg-surface-elevated">
                      <div className="h-full rounded-full bg-brand" style={{ width: `${f.weight * 100}%` }} />
                    </div>
                  </li>
                ))}
              </ul>
            </Card>
          </div>

          <Card title="Historical Assessments">
            <div className="divide-y divide-border-subtle">
              {history.map((h, i) => (
                <div key={i} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                  <div>
                    <p className="text-sm text-ink">{new Date(h.timestamp).toLocaleString()}</p>
                    <p className="text-xs text-ink-faint">{h.modelName} v{h.modelVersion}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <span className="font-mono text-sm text-ink-muted">{(h.probability * 100).toFixed(0)}%</span>
                    <StatusBadge level={h.riskCategory} />
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </>
      )}
    </div>
  )
}
