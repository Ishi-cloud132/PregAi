import { lazy, Suspense } from 'react'
import { Spinner } from '@/components/common/Spinner'

// Three.js is heavy — load it only when this viewer actually mounts, rather
// than bundling it into every page's initial chunk.
const ElectrodePlacementModel = lazy(() =>
  import('./ElectrodePlacementModel').then((m) => ({ default: m.ElectrodePlacementModel })),
)

export function LazyElectrodePlacementModel(props: { height?: number }) {
  return (
    <Suspense
      fallback={
        <div
          style={{ height: props.height ?? 320 }}
          className="flex items-center justify-center rounded-md border border-border-subtle bg-surface-elevated"
        >
          <Spinner size={22} />
        </div>
      }
    >
      <ElectrodePlacementModel {...props} />
    </Suspense>
  )
}
