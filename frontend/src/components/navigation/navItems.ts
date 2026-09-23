import type { NavItemId } from '@/constants'

export interface NavItem {
  id: NavItemId
  label: string
  path: string
  icon: string // inline SVG path data, kept minimal/custom (no icon library dependency)
  group: 'primary' | 'research' | 'system'
}

export const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', path: '/dashboard', group: 'primary',
    icon: 'M3 12h4v8H3v-8Zm7-6h4v14h-4V6Zm7 3h4v11h-4V9Z' },
  { id: 'patients', label: 'Patients', path: '/patients', group: 'primary',
    icon: 'M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8Zm-7 9a7 7 0 0 1 14 0' },
  { id: 'monitoring', label: 'Monitoring', path: '/monitoring', group: 'primary',
    icon: 'M3 12h3l2-7 4 14 3-9 2 4h4' },
  { id: 'ehg-signal', label: 'EHG Signal', path: '/ehg-signal', group: 'primary',
    icon: 'M2 12h3l2 5 3-10 2 7 2-4 3 0 2 2h3' },
  { id: 'risk-assessment', label: 'Risk Assessment', path: '/risk-assessment', group: 'primary',
    icon: 'M12 2 2 20h20L12 2Zm0 7v5m0 3h.01' },
  { id: 'reports', label: 'Reports', path: '/reports', group: 'primary',
    icon: 'M6 2h9l5 5v15H6V2Zm9 0v5h5M9 13h6M9 17h6M9 9h2' },
  { id: 'signal-eda', label: 'Signal EDA', path: '/signal-eda', group: 'research',
    icon: 'M4 19h16M7 19V9m5 10V4m5 15v-7' },
  { id: 'comparison', label: 'Comparison', path: '/comparison', group: 'research',
    icon: 'M8 3v18M16 3v18M4 8h4M4 16h4M16 8h4M16 16h4' },
  { id: 'model-info', label: 'Model Information', path: '/model-info', group: 'research',
    icon: 'M12 2 3 7v10l9 5 9-5V7l-9-5Zm0 7v10M3 7l9 5 9-5' },
]
