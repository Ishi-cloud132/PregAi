import type { FirmwareFeatureSet, MonitoringSession, SessionComparison, SessionComparisonSide } from '@/types'
import { mockSessions, generateStaticSignalWindow, generateFirmwareFeatures, generateRisk } from './mockData'
import { computeFeatureDeltas, generateInsights } from './comparisonEngine'
import { delay } from './delay'

function buildSide(session: MonitoringSession): SessionComparisonSide {
  const signal = generateStaticSignalWindow(session.id)
  const features = generateFirmwareFeatures(session.id)
  const risk = generateRisk(session.id, session.patientId)
  return { session, quality: signal.quality, features, signal, risk }
}

export const mockComparisonService = {
  async getSessions(patientId: string): Promise<MonitoringSession[]> {
    await delay(200)
    return mockSessions[patientId] || []
  },

  async compare(patientId: string, sessionAId: string, sessionBId: string): Promise<SessionComparison> {
    await delay(500)
    const sessions = mockSessions[patientId] || []
    const sessionA = sessions.find((s) => s.id === sessionAId)
    const sessionB = sessions.find((s) => s.id === sessionBId)
    if (!sessionA || !sessionB) throw new Error('SESSION_NOT_FOUND')

    const a = buildSide(sessionA)
    const b = buildSide(sessionB)
    const featureDeltas = computeFeatureDeltas(a.features, b.features)
    const insights = generateInsights(a, b, featureDeltas)

    return { patientId, a, b, featureDeltas, insights }
  },

  async getFeatureTrendSeries(patientId: string): Promise<{ session: MonitoringSession; features: FirmwareFeatureSet }[]> {
    await delay(200)
    const sessions = [...(mockSessions[patientId] || [])].sort(
      (x, y) => new Date(x.startedAt).getTime() - new Date(y.startedAt).getTime(),
    )
    return sessions.map((session) => ({ session, features: generateFirmwareFeatures(session.id) }))
  },
}
