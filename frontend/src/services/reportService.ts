import type { Report } from '@/types'
import { MOCK_API_ENABLED } from '@/constants'
import { apiClient } from './api'
import { mockReportService } from './mock/mockReportService'

export const reportService = {
  async list(): Promise<Report[]> {
    if (MOCK_API_ENABLED) return mockReportService.list()
    return apiClient.get<Report[]>('/reports')
  },
  async get(id: string): Promise<Report> {
    if (MOCK_API_ENABLED) return mockReportService.get(id)
    return apiClient.get<Report>(`/reports/${id}`)
  },
  async exportUrl(id: string): Promise<string> {
    if (MOCK_API_ENABLED) return mockReportService.exportUrl(id)
    return apiClient.get<{ url: string }>(`/reports/${id}/export`).then((r) => r.url)
  },
}
