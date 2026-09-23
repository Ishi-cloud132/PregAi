import { useAppMode } from '@/context/AppModeContext'

export function DemoModeBanner() {
  const { isDemoMode } = useAppMode()
  if (!isDemoMode) return null

  return (
    <div className="flex items-center gap-2 border-b border-status-demo/25 bg-status-demo/10 px-6 py-1.5 text-xs text-status-demo">
      <span className="h-1.5 w-1.5 rounded-full bg-status-demo animate-pulseDot" aria-hidden />
      <span className="font-medium">DEMO MODE</span>
      <span className="text-status-demo/80">— viewing simulated data. No live FastAPI backend connection is active.</span>
    </div>
  )
}
