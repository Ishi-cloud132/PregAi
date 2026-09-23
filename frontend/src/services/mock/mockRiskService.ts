import type { RiskAssessment } from '@/types'
import { generateRisk } from './mockData'
import { delay } from './delay'

export const mockRiskService = {
  async getForSession(sessionId: string, patientId: string): Promise<RiskAssessment> {
    await delay(400)
    return generateRisk(sessionId, patientId)
  },
  async history(patientId: string): Promise<RiskAssessment[]> {
    await delay(300)
    return Array.from({ length: 4 }).map((_, i) => generateRisk(`SES-${patientId}-${i}`, patientId))
  },
}
