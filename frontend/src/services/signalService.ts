import type { EHGSignalWindow, FirmwareFeatureSet, SignalFeatures } from '@/types'
import { MOCK_API_ENABLED } from '@/constants'
import { apiClient } from './api'
import { mockSignalService } from './mock/mockSignalService'

export const signalService = {
  async getWindow(sessionId: string, tOffset = 0): Promise<EHGSignalWindow> {
    if (MOCK_API_ENABLED) return mockSignalService.getWindow(sessionId, tOffset)
    return apiClient.get<EHGSignalWindow>(`/monitoring/${sessionId}/signal?offset=${tOffset}`)
  },
  async getFeatures(sessionId: string): Promise<SignalFeatures> {
    if (MOCK_API_ENABLED) return mockSignalService.getFeatures(sessionId)
    return apiClient.get<SignalFeatures>(`/monitoring/${sessionId}/features`)
  },
  async getFirmwareFeatures(sessionId: string): Promise<FirmwareFeatureSet> {
    if (MOCK_API_ENABLED) return mockSignalService.getFirmwareFeatures(sessionId)
    return apiClient.get<FirmwareFeatureSet>(`/monitoring/${sessionId}/firmware-features`)
  },
}
