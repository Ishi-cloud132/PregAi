import type { AuthResponse, User } from '@/types'
import { MOCK_API_ENABLED } from '@/constants'
import { apiClient } from './api'
import { mockAuthService } from './mock/mockAuthService'

// Domain service: components/hooks call THIS, never fetch() or apiClient directly.
// Swapping VITE_ENABLE_MOCK_API swaps the implementation without touching callers.
export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    if (MOCK_API_ENABLED) return mockAuthService.login(email, password)
    return apiClient.post<AuthResponse>('/auth/login', { email, password })
  },
  async me(token: string): Promise<User> {
    if (MOCK_API_ENABLED) return mockAuthService.me(token)
    return apiClient.get<User>('/auth/me')
  },
  async logout(): Promise<void> {
    if (MOCK_API_ENABLED) return mockAuthService.logout()
    return apiClient.post<void>('/auth/logout')
  },
}
