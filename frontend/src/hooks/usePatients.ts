import { useEffect, useState } from 'react'
import type { Patient } from '@/types'
import { patientService } from '@/services/patientService'

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  function reload() {
    setLoading(true)
    setError(null)
    patientService
      .list()
      .then(setPatients)
      .catch(() => setError('Unable to load patients right now.'))
      .finally(() => setLoading(false))
  }

  useEffect(reload, [])

  return { patients, loading, error, reload }
}
