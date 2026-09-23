import type { UserRole } from '@/types'

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api'
export const MOCK_API_ENABLED = import.meta.env.VITE_ENABLE_MOCK_API !== 'false'
export const REALTIME_ENABLED = import.meta.env.VITE_ENABLE_REALTIME !== 'false'

// Bounded rolling buffer for live charts — never store an unbounded session in memory.
export const SIGNAL_WINDOW_SECONDS = 30
export const SIGNAL_SAMPLE_RATE_HZ = 20 // downsampled/windowed rate delivered to the frontend
export const MAX_BUFFERED_POINTS = SIGNAL_WINDOW_SECONDS * SIGNAL_SAMPLE_RATE_HZ

export type NavItemId =
  | 'dashboard'
  | 'patients'
  | 'monitoring'
  | 'ehg-signal'
  | 'risk-assessment'
  | 'reports'
  | 'signal-eda'
  | 'comparison'
  | 'model-info'
  | 'settings'

export const ROLE_PERMISSIONS: Record<UserRole, NavItemId[]> = {
  admin: [
    'dashboard',
    'patients',
    'monitoring',
    'ehg-signal',
    'risk-assessment',
    'reports',
    'signal-eda',
    'comparison',
    'model-info',
    'settings',
  ],
  clinician: [
    'dashboard',
    'patients',
    'monitoring',
    'ehg-signal',
    'risk-assessment',
    'reports',
    'comparison',
    'settings',
  ],
  researcher: [
    'dashboard',
    'ehg-signal',
    'signal-eda',
    'comparison',
    'model-info',
    'settings',
  ],
}

export const RISK_LABELS: Record<string, string> = {
  normal: 'Normal',
  warning: 'Needs Attention',
  critical: 'Critical',
}
