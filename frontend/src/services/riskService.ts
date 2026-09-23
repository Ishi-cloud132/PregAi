import type { RiskAssessment } from '@/types'
import { MOCK_API_ENABLED } from '@/constants'
import { apiClient } from './api'
import { mockRiskService } from './mock/mockRiskService'

export const riskService = {
  async getForSession(sessionId: string, patientId: string): Promise<RiskAssessment> {
    if (MOCK_API_ENABLED) return mockRiskService.getForSession(sessionId, patientId)
    return apiClient.get<RiskAssessment>(`/risk/${sessionId}`)
  },
  async history(patientId: string): Promise<RiskAssessment[]> {
    if (MOCK_API_ENABLED) return mockRiskService.history(patientId)
    return apiClient.get<RiskAssessment[]>(`/patients/${patientId}/risk-history`)
  },
}
