import type { FirmwareFeatureSet, MonitoringSession, SessionComparison } from '@/types'
import { MOCK_API_ENABLED } from '@/constants'
import { apiClient } from './api'
import { mockComparisonService } from './mock/mockComparisonService'

export const comparisonService = {
  async getSessions(patientId: string): Promise<MonitoringSession[]> {
    if (MOCK_API_ENABLED) return mockComparisonService.getSessions(patientId)
    return apiClient.get<MonitoringSession[]>(`/patients/${patientId}/sessions`)
  },
  async compare(patientId: string, sessionAId: string, sessionBId: string): Promise<SessionComparison> {
    if (MOCK_API_ENABLED) return mockComparisonService.compare(patientId, sessionAId, sessionBId)
    return apiClient.get<SessionComparison>(
      `/patients/${patientId}/compare?sessionA=${sessionAId}&sessionB=${sessionBId}`,
    )
  },
  async getFeatureTrendSeries(patientId: string): Promise<{ session: MonitoringSession; features: FirmwareFeatureSet }[]> {
    if (MOCK_API_ENABLED) return mockComparisonService.getFeatureTrendSeries(patientId)
    return apiClient.get(`/patients/${patientId}/feature-trend`)
  },
}
