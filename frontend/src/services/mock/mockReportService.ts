import type { Report } from '@/types'
import { mockReports } from './mockData'
import { delay } from './delay'

export const mockReportService = {
  async list(): Promise<Report[]> {
    await delay()
    return mockReports
  },
  async get(id: string): Promise<Report> {
    await delay()
    const r = mockReports.find((r) => r.id === id)
    if (!r) throw new Error('NOT_FOUND')
    return r
  },
  async exportUrl(id: string): Promise<string> {
    await delay(200)
    // In demo mode there is no real file — the UI should communicate this clearly.
    return ''
  },
}
