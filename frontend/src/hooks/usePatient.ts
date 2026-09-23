import { useEffect, useState } from 'react'
import type { MonitoringSession, Patient } from '@/types'
import { patientService } from '@/services/patientService'

export function usePatient(id?: string) {
  const [patient, setPatient] = useState<Patient | null>(null)
  const [sessions, setSessions] = useState<MonitoringSession[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    setError(null)
    Promise.all([patientService.get(id), patientService.sessions(id)])
      .then(([p, s]) => {
        setPatient(p)
        setSessions(s)
      })
      .catch(() => setError('Unable to load this patient.'))
      .finally(() => setLoading(false))
  }, [id])

  return { patient, sessions, loading, error }
}
