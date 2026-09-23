import type { MonitoringSession, Patient } from '@/types'
import { mockPatients, mockSessions } from './mockData'
import { delay } from './delay'

export const mockPatientService = {
  async list(): Promise<Patient[]> {
    await delay()
    return mockPatients
  },
  async get(id: string): Promise<Patient> {
    await delay()
    const p = mockPatients.find((p) => p.id === id)
    if (!p) throw new Error('NOT_FOUND')
    return p
  },
  async sessions(id: string): Promise<MonitoringSession[]> {
    await delay()
    return mockSessions[id] || []
  },
  async create(patient: Partial<Patient>): Promise<Patient> {
    await delay()
    const created: Patient = {
      id: `PT-${1000 + mockPatients.length}`,
      name: patient.name || 'Unnamed Patient',
      age: patient.age || 28,
      gestationalAgeWeeks: patient.gestationalAgeWeeks || 28,
      gravida: patient.gravida || 1,
      para: patient.para || 0,
      riskFlag: 'normal',
      lastSessionAt: null,
      assignedClinician: patient.assignedClinician || 'Unassigned',
      tags: [],
    }
    mockPatients.push(created)
    return created
  },
}
