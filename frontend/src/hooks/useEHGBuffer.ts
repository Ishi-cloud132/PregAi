import { useEffect, useRef, useState } from 'react'
import type { ConnectionState, EHGSamplePoint, SignalQuality } from '@/types'
import { subscribeToSignal } from '@/services/realtimeService'
import { MAX_BUFFERED_POINTS } from '@/constants'

// Bounded rolling buffer — the last N seconds only. Never accumulate an
// entire session's samples in browser state.
export function useEHGBuffer(sessionId: string | null) {
  const [points, setPoints] = useState<EHGSamplePoint[]>([])
  const [connection, setConnection] = useState<ConnectionState>('demo')
  const [quality, setQuality] = useState<SignalQuality | null>(null)
  const offsetRef = useRef(0)

  useEffect(() => {
    if (!sessionId) return
    setPoints([])
    offsetRef.current = 0

    const unsubscribe = subscribeToSignal(sessionId, (window, state) => {
      setConnection(state)
      if (window.points.length === 0) return
      setQuality(window.quality)
      setPoints((prev) => {
        const shifted = window.points.map((p) => ({ ...p, t: p.t + offsetRef.current }))
        offsetRef.current += window.windowSeconds
        const merged = [...prev, ...shifted]
        return merged.slice(-MAX_BUFFERED_POINTS)
      })
    })

    return unsubscribe
  }, [sessionId])

  return { points, connection, quality }
}
