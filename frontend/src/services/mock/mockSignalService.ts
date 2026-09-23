import type { EHGSignalWindow, FirmwareFeatureSet, SignalFeatures } from '@/types'
import { generateFeatures, generateFirmwareFeatures, generateSignalWindow } from './mockData'
import { delay } from './delay'

export const mockSignalService = {
  async getWindow(sessionId: string, tOffset = 0): Promise<EHGSignalWindow> {
    await delay(150)
    return generateSignalWindow(sessionId, tOffset)
  },
  async getFeatures(sessionId: string): Promise<SignalFeatures> {
    await delay(250)
    return generateFeatures(sessionId)
  },
  async getFirmwareFeatures(sessionId: string): Promise<FirmwareFeatureSet> {
    await delay(200)
    return generateFirmwareFeatures(sessionId)
  },
}
