import type { AuthResponse, User } from '@/types'
import { delay } from './delay'

const DEMO_USERS: Record<string, { password: string; user: User }> = {
  'admin@pregai.demo': {
    password: 'demo1234',
    user: { id: 'U-1', name: 'Aditi Rao', email: 'admin@pregai.demo', role: 'admin', avatarInitials: 'AR' },
  },
  'clinician@pregai.demo': {
    password: 'demo1234',
    user: { id: 'U-2', name: 'Dr. R. Chandran', email: 'clinician@pregai.demo', role: 'clinician', avatarInitials: 'RC' },
  },
  'researcher@pregai.demo': {
    password: 'demo1234',
    user: { id: 'U-3', name: 'Vikram Sethi', email: 'researcher@pregai.demo', role: 'researcher', avatarInitials: 'VS' },
  },
}

export const mockAuthService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    await delay(500)
    const entry = DEMO_USERS[email.toLowerCase()]
    if (!entry || entry.password !== password) {
      throw new Error('INVALID_CREDENTIALS')
    }
    return { user: entry.user, token: `demo-token-${entry.user.id}` }
  },
  async me(token: string): Promise<User> {
    await delay(150)
    const match = Object.values(DEMO_USERS).find((e) => `demo-token-${e.user.id}` === token)
    if (!match) throw new Error('UNAUTHORIZED')
    return match.user
  },
  async logout(): Promise<void> {
    await delay(100)
  },
}
