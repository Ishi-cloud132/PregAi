import { ELECTRODE_POINTS } from './electrodePoints'

export function ElectrodeLegend({ activeId }: { activeId?: string | null }) {
  return (
    <ul className="space-y-2">
      {ELECTRODE_POINTS.map((pt) => (
        <li
          key={pt.id}
          className={`flex items-start gap-2.5 rounded-md border px-2.5 py-2 text-xs transition-colors ${
            activeId === pt.id ? 'border-brand/40 bg-brand/5' : 'border-transparent'
          }`}
        >
          <span
            className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
              pt.role === 'reference' ? 'bg-status-warning' : 'bg-brand'
            }`}
          />
          <div>
            <p className="font-medium text-ink">{pt.label}</p>
            <p className="mt-0.5 text-ink-faint">{pt.description}</p>
          </div>
        </li>
      ))}
    </ul>
  )
}
