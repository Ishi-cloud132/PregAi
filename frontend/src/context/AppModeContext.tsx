import { createContext, useContext, useState, type ReactNode } from 'react'
import { MOCK_API_ENABLED } from '@/constants'

interface AppModeContextValue {
  isDemoMode: boolean
  backendReachable: boolean
  setBackendReachable: (v: boolean) => void
}

const AppModeContext = createContext<AppModeContextValue | undefined>(undefined)

export function AppModeProvider({ children }: { children: ReactNode }) {
  const [backendReachable, setBackendReachable] = useState(!MOCK_API_ENABLED)

  const isDemoMode = MOCK_API_ENABLED || !backendReachable

  return (
    <AppModeContext.Provider value={{ isDemoMode, backendReachable, setBackendReachable }}>
      {children}
    </AppModeContext.Provider>
  )
}

export function useAppMode() {
  const ctx = useContext(AppModeContext)
  if (!ctx) throw new Error('useAppMode must be used within AppModeProvider')
  return ctx
}
