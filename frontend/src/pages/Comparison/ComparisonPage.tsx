import { useEffect, useState } from 'react'
import { usePatients } from '@/hooks/usePatients'
import { comparisonService } from '@/services/comparisonService'
import type { MonitoringSession, SessionComparison } from '@/types'
import { useAppMode } from '@/context/AppModeContext'

import { SessionSelector } from '@/components/comparison/SessionSelector'
import { ComparisonSummaryCards } from '@/components/comparison/ComparisonSummaryCards'
import { DeltaSummary } from '@/components/comparison/DeltaSummary'
import { WaveformComparisonChart } from '@/components/comparison/WaveformComparisonChart'
import { FeatureComparisonTable } from '@/components/comparison/FeatureComparisonTable'
import { FeatureTrendChart } from '@/components/comparison/FeatureTrendChart'
import { RiskComparisonPanel } from '@/components/comparison/RiskComparisonPanel'
import { InsightsList } from '@/components/comparison/InsightsList'
import { SystemStatusStrip } from '@/components/common/SystemStatusStrip'
import { EmptyState } from '@/components/common/EmptyState'
import { ErrorState } from '@/components/common/ErrorState'
import { Spinner } from '@/components/common/Spinner'

export default function ComparisonPage() {
  const { patients, loading: patientsLoading } = usePatients()
  const { isDemoMode } = useAppMode()

  const [patientId, setPatientId] = useState('')
  const [sessions, setSessions] = useState<MonitoringSession[]>([])
  const [sessionsLoading, setSessionsLoading] = useState(false)
  const [sessionAId, setSessionAId] = useState('')
  const [sessionBId, setSessionBId] = useState('')

  const [comparison, setComparison] = useState<SessionComparison | null>(null)
  const [comparing, setComparing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Default to the first patient once loaded.
  useEffect(() => {
    if (!patientId && patients[0]) setPatientId(patients[0].id)
  }, [patients])

  // Load sessions for the selected patient and reset comparison state.
  useEffect(() => {
    if (!patientId) return
    setSessionsLoading(true)
    setComparison(null)
    setError(null)
    comparisonService.getSessions(patientId).then((s) => {
      setSessions(s)
      setSessionsLoading(false)
      if (s.length >= 2) {
        setSessionAId(s[0].id) // most recent
        setSessionBId(s[1].id) // previous
      } else {
        setSessionAId('')
        setSessionBId('')
      }
    })
  }, [patientId])

  // Convenient default: automatically compare current vs. previous once both are set.
  useEffect(() => {
    if (sessionAId && sessionBId && sessionAId !== sessionBId) {
      runCompare(sessionAId, sessionBId)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [patientId, sessions.length])

  async function runCompare(aId: string, bId: string) {
    if (!aId || !bId || aId === bId) return
    setComparing(true)
    setError(null)
    try {
      const result = await comparisonService.compare(patientId, aId, bId)
      setComparison(result)
    } catch {
      setError('Unable to compare these sessions right now.')
    } finally {
      setComparing(false)
    }
  }

  function handleUseLatestTwo() {
    if (sessions.length < 2) return
    setSessionAId(sessions[0].id)
    setSessionBId(sessions[1].id)
    runCompare(sessions[0].id, sessions[1].id)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-display text-xl font-semibold text-ink">Comparison</h1>
        <p className="mt-1 text-sm text-ink-muted">Compare EHG monitoring sessions for a patient.</p>
      </div>

      {patientsLoading ? (
        <div className="flex justify-center py-16"><Spinner size={24} /></div>
      ) : (
        <SessionSelector
          patients={patients}
          patientId={patientId}
          sessions={sessions}
          sessionAId={sessionAId}
          sessionBId={sessionBId}
          onPatientChange={setPatientId}
          onSessionAChange={setSessionAId}
          onSessionBChange={setSessionBId}
          onCompare={() => runCompare(sessionAId, sessionBId)}
          onUseLatestTwo={handleUseLatestTwo}
          canCompare={!!sessionAId && !!sessionBId && sessionAId !== sessionBId}
        />
      )}

      {sessionsLoading ? (
        <div className="flex justify-center py-16"><Spinner size={24} /></div>
      ) : sessions.length < 2 ? (
        <EmptyState
          title="Not enough sessions to compare"
          description="Only one monitoring session is available for this patient. At least two completed sessions are required to run a comparison."
        />
      ) : error ? (
        <ErrorState message={error} onRetry={() => runCompare(sessionAId, sessionBId)} />
      ) : comparing || !comparison ? (
        <div className="flex flex-col items-center justify-center gap-3 py-16">
          <Spinner size={24} />
          <p className="text-sm text-ink-faint">
            {comparing ? 'Comparing sessions…' : 'Select two monitoring sessions to begin comparison.'}
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <ComparisonSummaryCards a={comparison.a} b={comparison.b} />
          <DeltaSummary a={comparison.a} b={comparison.b} featureDeltas={comparison.featureDeltas} />
          <WaveformComparisonChart signalA={comparison.a.signal} signalB={comparison.b.signal} />
          <FeatureComparisonTable deltas={comparison.featureDeltas} />
          <FeatureTrendChart patientId={patientId} sessionAId={comparison.a.session.id} sessionBId={comparison.b.session.id} />
          <RiskComparisonPanel a={comparison.a} b={comparison.b} />
          <InsightsList insights={comparison.insights} />
          <SystemStatusStrip
            quality={comparison.b.quality}
            connection={isDemoMode ? 'demo' : 'connected'}
          />

          <p className="text-center text-xs text-ink-faint">
            AI-assisted analysis · Not a medical diagnosis
          </p>
        </div>
      )}
    </div>
  )
}
