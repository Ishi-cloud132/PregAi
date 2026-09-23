// ---------------------------------------------------------------------------
// Pure, deterministic comparison logic shared by the mock (and eventually
// real) comparison service. Kept separate from any service/network concerns
// so it's easy to unit test and impossible to accidentally call from a
// component directly.
//
// Wording rule enforced throughout: neutral, analytical language only
// ("increased" / "decreased" / "stable") — never a clinical interpretation
// ("improving", "worsening", "going into labour"). See brief §9/§14/§26.
// ---------------------------------------------------------------------------
import type {
  ChangeDirection,
  ComparisonInsight,
  FeatureDelta,
  FirmwareFeatureSet,
  SessionComparisonSide,
} from '@/types'

export const FIRMWARE_FEATURE_META: { key: keyof FirmwareFeatureSet; label: string; unit?: string }[] = [
  { key: 'variance', label: 'Variance' },
  { key: 'energy', label: 'Energy' },
  { key: 'mav', label: 'Mean Absolute Value (MAV)' },
  { key: 'peakToPeak', label: 'Peak-to-Peak Amplitude' },
  { key: 'lineLength', label: 'Line Length' },
  { key: 'crestFactor', label: 'Crest Factor' },
  { key: 'peakFrequencyHz', label: 'Peak Frequency', unit: 'Hz' },
  { key: 'medianFrequencyHz', label: 'Median Frequency', unit: 'Hz' },
  { key: 'skewness', label: 'Skewness' },
  { key: 'kurtosis', label: 'Kurtosis' },
]

const STABLE_THRESHOLD_PCT = 2

function direction(percentChange: number): ChangeDirection {
  if (Math.abs(percentChange) < STABLE_THRESHOLD_PCT) return 'stable'
  return percentChange > 0 ? 'increased' : 'decreased'
}

export function percentChange(a: number, b: number): number {
  if (a === 0) return b === 0 ? 0 : 100
  return ((b - a) / Math.abs(a)) * 100
}

export function computeFeatureDeltas(a: FirmwareFeatureSet, b: FirmwareFeatureSet): FeatureDelta[] {
  return FIRMWARE_FEATURE_META.map(({ key, label, unit }) => {
    const change = percentChange(a[key], b[key])
    return {
      key,
      label,
      unit,
      a: a[key],
      b: b[key],
      percentChange: Number(change.toFixed(1)),
      direction: direction(change),
    }
  })
}

function verb(d: ChangeDirection) {
  return d === 'increased' ? 'increased' : d === 'decreased' ? 'decreased' : 'remained stable'
}

export function generateInsights(a: SessionComparisonSide, b: SessionComparisonSide, deltas: FeatureDelta[]): ComparisonInsight[] {
  const insights: ComparisonInsight[] = []

  const qualityChange = percentChange(a.quality.score, b.quality.score)
  const qDir = direction(qualityChange)
  insights.push({
    id: 'quality',
    text: `Signal quality ${verb(qDir)} from ${a.quality.score}% to ${b.quality.score}% between the two sessions.`,
  })

  const p2p = deltas.find((d) => d.key === 'peakToPeak')
  if (p2p && p2p.direction !== 'stable') {
    insights.push({
      id: 'p2p',
      text: `Peak-to-peak amplitude was ${p2p.direction} in Session B (${p2p.a} → ${p2p.b}).`,
    })
  }

  const medFreq = deltas.find((d) => d.key === 'medianFrequencyHz')
  if (medFreq && medFreq.direction !== 'stable') {
    insights.push({
      id: 'median-freq',
      text: `Median frequency shifted between recordings (${medFreq.a} Hz → ${medFreq.b} Hz).`,
    })
  }

  if (a.quality.motionArtifact !== 'none' || b.quality.motionArtifact !== 'none') {
    const which = a.quality.motionArtifact !== 'none' && b.quality.motionArtifact !== 'none'
      ? 'both sessions'
      : a.quality.motionArtifact !== 'none'
      ? 'Session A'
      : 'Session B'
    insights.push({
      id: 'artifact',
      text: `Motion artifact was detected during part of the recording in ${which}.`,
    })
  } else {
    insights.push({
      id: 'continuity',
      text: 'Data continuity was stable across both sessions, with no motion artifact detected.',
    })
  }

  insights.push({
    id: 'disclaimer',
    text: 'These are analytical observations, not clinical conclusions. The observed change should be reviewed alongside the complete clinical context.',
  })

  return insights
}
