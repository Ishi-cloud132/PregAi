import type { ConnectionState, SignalQuality } from '@/types'
import { Card } from '@/components/common/Card'
import { ConnectionIndicator } from '@/components/common/ConnectionIndicator'

function qualityWord(score: number): { label: string; tone: string } {
  if (score >= 80) return { label: 'Good', tone: 'text-status-normal' }
  if (score >= 60) return { label: 'Fair', tone: 'text-status-warning' }
  return { label: 'Poor', tone: 'text-status-critical' }
}

export function SystemStatusStrip({
  quality,
  connection,
  continuity = 'Stable',
}: {
  quality: SignalQuality
  connection: ConnectionState
  continuity?: 'Stable' | 'Interrupted'
}) {
  const q = qualityWord(quality.score)
  const contactTone = quality.electrodeContact === 'good' ? 'text-status-normal' : quality.electrodeContact === 'fair' ? 'text-status-warning' : 'text-status-critical'
  const artifactTone = quality.motionArtifact === 'none' ? 'text-status-normal' : quality.motionArtifact === 'mild' ? 'text-status-warning' : 'text-status-critical'

  return (
    <Card title="System / Signal Quality">
      <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
        <div>
          <p className="text-xs text-ink-faint">Electrode Contact</p>
          <p className={`mt-1 text-sm font-medium capitalize ${contactTone}`}>{quality.electrodeContact}</p>
        </div>
        <div>
          <p className="text-xs text-ink-faint">Signal Quality</p>
          <p className={`mt-1 text-sm font-medium ${q.tone}`}>{q.label} · {quality.score}%</p>
        </div>
        <div>
          <p className="text-xs text-ink-faint">Motion Artifact</p>
          <p className={`mt-1 text-sm font-medium capitalize ${artifactTone}`}>{quality.motionArtifact}</p>
        </div>
        <div>
          <p className="text-xs text-ink-faint">Data Continuity</p>
          <p className={`mt-1 text-sm font-medium ${continuity === 'Stable' ? 'text-status-normal' : 'text-status-warning'}`}>{continuity}</p>
        </div>
        <div>
          <p className="text-xs text-ink-faint">Connection</p>
          <div className="mt-1"><ConnectionIndicator state={connection} size="sm" /></div>
        </div>
      </div>
    </Card>
  )
}
