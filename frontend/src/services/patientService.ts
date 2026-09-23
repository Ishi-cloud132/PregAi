import type { MonitoringSession, Patient } from '@/types'
import { MOCK_API_ENABLED } from '@/constants'
import { apiClient } from './api'
import { mockPatientService } from './mock/mockPatientService'

export const patientService = {
  async list(): Promise<Patient[]> {
    if (MOCK_API_ENABLED) return mockPatientService.list()
    return apiClient.get<Patient[]>('/patients')
  },
  async get(id: string): Promise<Patient> {
    if (MOCK_API_ENABLED) return mockPatientService.get(id)
    return apiClient.get<Patient>(`/patients/${id}`)
  },
  async sessions(id: string): Promise<MonitoringSession[]> {
    if (MOCK_API_ENABLED) return mockPatientService.sessions(id)
    return apiClient.get<MonitoringSession[]>(`/patients/${id}/sessions`)
  },
  async create(patient: Partial<Patient>): Promise<Patient> {
    if (MOCK_API_ENABLED) return mockPatientService.create(patient)
    return apiClient.post<Patient>('/patients', patient)
  },
}
