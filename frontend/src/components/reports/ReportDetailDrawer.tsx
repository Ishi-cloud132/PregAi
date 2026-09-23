import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import type { Report, ReportContext } from '@/types'
import { patientService } from '@/services/patientService'
import { riskService } from '@/services/riskService'
import { signalService } from '@/services/signalService'
import { StatusBadge } from '@/components/common/StatusBadge'
import { Spinner } from '@/components/common/Spinner'
import { ReportChatPanel } from './ReportChatPanel'

export function ReportDetailDrawer({ report, onClose }: { report: Report; onClose: () => void }) {
  const [context, setContext] = useState<ReportContext | null>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let cancelled = false
    Promise.all([
      patientService.get(report.patientId),
      riskService.getForSession(report.sessionId, report.patientId),
      signalService.getFeatures(report.sessionId),
    ]).then(([patient, risk, features]) => {
      if (cancelled) return
      setContext({ report, patientName: patient.name, risk, features })
    })
    return () => {
      cancelled = true
    }
  }, [report.id])

  useEffect(() => {
    if (panelRef.current) {
      gsap.fromTo(panelRef.current, { x: '100%' }, { x: '0%', duration: 0.35, ease: 'power3.out' })
    }
  }, [])

  function handleClose() {
    if (panelRef.current) {
      gsap.to(panelRef.current, { x: '100%', duration: 0.25, ease: 'power2.in', onComplete: onClose })
    } else {
      onClose()
    }
  }

  return (
    <div className="fixed inset-0 z-40 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={handleClose} />
      <div ref={panelRef} className="relative flex h-full w-full max-w-3xl bg-base-raised shadow-2xl">
        <div className="flex w-full max-w-sm flex-col border-r border-border p-5 overflow-y-auto">
          <div className="mb-4 flex items-start justify-between">
            <div>
              <p className="text-xs text-ink-faint">{report.id}</p>
              <h2 className="mt-0.5 font-display text-lg font-semibold text-ink">Report Detail</h2>
            </div>
            <button
              onClick={handleClose}
              className="rounded p-1.5 text-ink-faint transition-colors hover:bg-surface-hover hover:text-ink"
              aria-label="Close"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" className="h-4 w-4">
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>

          {!context ? (
            <div className="flex flex-1 items-center justify-center"><Spinner size={22} /></div>
          ) : (
            <div className="space-y-4 text-sm">
              <div>
                <p className="text-ink-faint">Patient</p>
                <p className="mt-0.5 text-ink">{context.patientName}</p>
              </div>
              <div className="flex justify-between">
                <div>
                  <p className="text-ink-faint">Duration</p>
                  <p className="mt-0.5 text-ink">{Math.round(report.monitoringDurationSeconds / 60)} min</p>
                </div>
                <div>
                  <p className="text-ink-faint">Signal quality</p>
                  <p className="mt-0.5 text-ink">{report.signalQualityScore}/100</p>
                </div>
              </div>
              <div>
                <p className="mb-1.5 text-ink-faint">Risk</p>
                <StatusBadge level={report.riskCategory} label={context.risk.label} />
              </div>
              <div>
                <p className="text-ink-faint">Model</p>
                <p className="mt-0.5 text-ink">{context.risk.modelName} v{context.risk.modelVersion}</p>
              </div>
              <div className="border-t border-border-subtle pt-3">
                <p className="text-ink-faint">Created</p>
                <p className="mt-0.5 text-ink">{new Date(report.createdAt).toLocaleString()}</p>
              </div>
            </div>
          )}
        </div>

        <div className="flex-1">
          {context ? (
            <ReportChatPanel context={context} />
          ) : (
            <div className="flex h-full items-center justify-center"><Spinner size={22} /></div>
          )}
        </div>
      </div>
    </div>
  )
}
