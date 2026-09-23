// ---------------------------------------------------------------------------
// realtimeService — the ONLY place that knows how live data actually arrives.
//
// The hardware/transport story (ESP32 -> TCP/UDP/MQTT -> FastAPI ingestion)
// is entirely a backend concern. This module exposes a transport-agnostic
// subscription API that today is implemented with polling against the mock
// signal service, and tomorrow can be swapped for WebSocket/SSE without any
// component or chart needing to change.
//
// It is also responsible for the honesty requirement: components subscribing
// here get an explicit ConnectionState ('connected' | 'reconnecting' |
// 'disconnected' | 'stale' | 'demo') alongside the data, so the UI can never
// accidentally show DEMO data under a LIVE label.
// ---------------------------------------------------------------------------
import type { ConnectionState, EHGSignalWindow } from '@/types'
import { MOCK_API_ENABLED, REALTIME_ENABLED } from '@/constants'
import { signalService } from './signalService'

type Listener = (window: EHGSignalWindow, connection: ConnectionState) => void

export function subscribeToSignal(sessionId: string, onData: Listener): () => void {
  let cancelled = false
  let tOffset = 0
  let consecutiveFailures = 0

  const connection: ConnectionState = MOCK_API_ENABLED ? 'demo' : 'connected'

  async function tick() {
    if (cancelled) return
    if (!REALTIME_ENABLED) return

    try {
      const window = await signalService.getWindow(sessionId, tOffset)
      tOffset += window.windowSeconds
      consecutiveFailures = 0
      onData(window, connection)
    } catch {
      consecutiveFailures += 1
      // Surface degraded connectivity rather than silently freezing the chart.
      const state: ConnectionState = consecutiveFailures > 3 ? 'disconnected' : 'reconnecting'
      onData({ sessionId, windowSeconds: 0, sampleRateHz: 0, generatedAt: new Date().toISOString(), points: [], quality: { score: 0, electrodeContact: 'poor', motionArtifact: 'none', snrDb: null } }, state)
    }

    if (!cancelled) setTimeout(tick, 1500)
  }

  tick()

  return () => {
    cancelled = true
  }
}
