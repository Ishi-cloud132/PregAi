import type { FirmwareFeatureSet } from '@/types'
import { FIRMWARE_FEATURE_META } from '@/services/mock/comparisonEngine'

function fmt(v: number) {
  return Math.abs(v) < 1 ? v.toFixed(4) : v.toFixed(2)
}

export function FirmwareFeatureGrid({ features }: { features: FirmwareFeatureSet }) {
  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
      {FIRMWARE_FEATURE_META.map((meta) => (
        <div key={meta.key} className="rounded-md border border-border-subtle p-3 transition-colors hover:border-brand/30">
          <p className="truncate text-[11px] text-ink-faint">{meta.label}</p>
          <p className="mt-1 font-mono text-sm text-ink tabular">
            {fmt(features[meta.key])}
            {meta.unit && <span className="ml-1 text-[10px] text-ink-faint">{meta.unit}</span>}
          </p>
        </div>
      ))}
    </div>
  )
}
