import type { MonitoringSession } from '@/types'
import { delay } from './delay'

const activeSessions = new Map<string, MonitoringSession>()

export const mockMonitoringService = {
  async start(patientId: string): Promise<MonitoringSession> {
    await delay(400)
    const session: MonitoringSession = {
      id: `SES-${patientId}-live-${Date.now()}`,
      patientId,
      startedAt: new Date().toISOString(),
      endedAt: null,
      status: 'active',
      durationSeconds: 0,
      connection: 'demo',
      mode: 'demo',
    }
    activeSessions.set(session.id, session)
    return session
  },
  async pause(sessionId: string): Promise<MonitoringSession> {
    await delay(200)
    const s = activeSessions.get(sessionId)
    if (!s) throw new Error('NOT_FOUND')
    s.status = 'paused'
    return s
  },
  async stop(sessionId: string): Promise<MonitoringSession> {
    await delay(300)
    const s = activeSessions.get(sessionId)
    if (!s) throw new Error('NOT_FOUND')
    s.status = 'completed'
    s.endedAt = new Date().toISOString()
    return s
  },
}
