import type { MonitoringSession } from '@/types'
import { MOCK_API_ENABLED } from '@/constants'
import { apiClient } from './api'
import { mockMonitoringService } from './mock/mockMonitoringService'

export const monitoringService = {
  async start(patientId: string): Promise<MonitoringSession> {
    if (MOCK_API_ENABLED) return mockMonitoringService.start(patientId)
    return apiClient.post<MonitoringSession>('/monitoring/start', { patientId })
  },
  async pause(sessionId: string): Promise<MonitoringSession> {
    if (MOCK_API_ENABLED) return mockMonitoringService.pause(sessionId)
    return apiClient.post<MonitoringSession>(`/monitoring/${sessionId}/pause`)
  },
  async stop(sessionId: string): Promise<MonitoringSession> {
    if (MOCK_API_ENABLED) return mockMonitoringService.stop(sessionId)
    return apiClient.post<MonitoringSession>(`/monitoring/${sessionId}/stop`)
  },
}
