import type {
  Alert,
  EHGSamplePoint,
  EHGSignalWindow,
  FirmwareFeatureSet,
  MonitoringSession,
  Patient,
  Report,
  RiskAssessment,
  SignalFeatures,
  SignalQuality,
} from '@/types'
import { SIGNAL_SAMPLE_RATE_HZ, SIGNAL_WINDOW_SECONDS } from '@/constants'

const NAMES = [
  'Anjali Verma', 'Priya Nair', 'Simran Kaur', 'Fatima Sheikh', 'Kavya Reddy',
  'Neha Sharma', 'Ritu Malhotra', 'Sanya Kapoor', 'Divya Iyer', 'Meera Joshi',
]

export function seededRandom(seed: number) {
  let s = seed
  return () => {
    s = (s * 9301 + 49297) % 233280
    return s / 233280
  }
}

// Deterministic string -> numeric seed, so the same session ID always
// produces the same "recorded" signal/features/risk — important for
// Comparison, where re-selecting the same two sessions should be stable
// rather than reshuffling on every fetch.
export function hashSeed(str: string): number {
  let h = 0
  for (let i = 0; i < str.length; i++) h = (h * 31 + str.charCodeAt(i)) >>> 0
  return (h % 233280) || 1
}

export const mockPatients: Patient[] = NAMES.map((name, i) => {
  const rng = seededRandom(i + 1)
  const risk = rng()
  return {
    id: `PT-${1000 + i}`,
    name,
    age: 22 + Math.floor(rng() * 15),
    gestationalAgeWeeks: 26 + Math.floor(rng() * 12),
    gravida: 1 + Math.floor(rng() * 3),
    para: Math.floor(rng() * 2),
    riskFlag: risk > 0.85 ? 'critical' : risk > 0.6 ? 'warning' : 'normal',
    lastSessionAt: new Date(Date.now() - i * 3600_000 * 7).toISOString(),
    assignedClinician: 'Dr. R. Chandran',
    tags: risk > 0.85 ? ['high-risk', 'follow-up'] : risk > 0.6 ? ['monitor'] : [],
  }
})

export const mockSessions: Record<string, MonitoringSession[]> = Object.fromEntries(
  mockPatients.map((p, i) => {
    const rng = seededRandom(i + 50)
    const sessions: MonitoringSession[] = Array.from({ length: 3 }).map((_, j) => ({
      id: `SES-${p.id}-${j}`,
      patientId: p.id,
      startedAt: new Date(Date.now() - (j + 1) * 86_400_000).toISOString(),
      endedAt: new Date(Date.now() - (j + 1) * 86_400_000 + 20 * 60_000).toISOString(),
      status: 'completed',
      durationSeconds: 1200 + Math.floor(rng() * 600),
      connection: 'demo',
      mode: 'demo',
    }))
    return [p.id, sessions]
  }),
)

// Deterministic "recorded" snapshot for a completed session — used by
// Comparison and anywhere else that needs a stable (not continuously live)
// window for a historical session.
export function generateStaticSignalWindow(sessionId: string): EHGSignalWindow {
  const rng = seededRandom(hashSeed(sessionId))
  const points: EHGSamplePoint[] = []
  const n = SIGNAL_WINDOW_SECONDS * SIGNAL_SAMPLE_RATE_HZ
  for (let i = 0; i < n; i++) {
    const t = i / SIGNAL_SAMPLE_RATE_HZ
    const envelope = 0.5 + 0.5 * Math.sin(t * 0.05)
    const carrier = Math.sin(t * 2.1) * 0.6 + Math.sin(t * 4.7) * 0.25
    const noise = (rng() - 0.5) * 0.15
    const raw = envelope * carrier + noise
    const filtered = envelope * carrier * 0.92
    points.push({ t, raw: Number(raw.toFixed(4)), filtered: Number(filtered.toFixed(4)) })
  }
  const qRng = seededRandom(hashSeed(sessionId) + 999)
  const quality: SignalQuality = {
    score: 72 + Math.round(qRng() * 22),
    electrodeContact: qRng() > 0.85 ? 'fair' : 'good',
    motionArtifact: qRng() > 0.85 ? 'mild' : 'none',
    snrDb: Number((12 + qRng() * 7).toFixed(1)),
  }
  return {
    sessionId,
    windowSeconds: SIGNAL_WINDOW_SECONDS,
    sampleRateHz: SIGNAL_SAMPLE_RATE_HZ,
    generatedAt: new Date().toISOString(),
    points,
    quality,
  }
}

// The actual ESP32 firmware feature set (Variance, Energy, MAV, Peak-to-Peak,
// Line Length, Crest Factor, Peak Frequency, Median Frequency, Skewness,
// Kurtosis) — seeded per session so repeat lookups are stable.
export function generateFirmwareFeatures(sessionId: string): FirmwareFeatureSet {
  const rng = seededRandom(hashSeed(sessionId) + 500)
  return {
    variance: Number((0.015 + rng() * 0.05).toFixed(4)),
    energy: Number((1.1 + rng() * 2.6).toFixed(3)),
    mav: Number((0.012 + rng() * 0.02).toFixed(4)),
    peakToPeak: Number((0.35 + rng() * 0.55).toFixed(3)),
    lineLength: Number((10 + rng() * 9).toFixed(2)),
    crestFactor: Number((2.3 + rng() * 1.7).toFixed(2)),
    peakFrequencyHz: Number((0.28 + rng() * 0.42).toFixed(3)),
    medianFrequencyHz: Number((0.32 + rng() * 0.38).toFixed(3)),
    skewness: Number((-0.6 + rng() * 1.2).toFixed(3)),
    kurtosis: Number((2.1 + rng() * 1.8).toFixed(3)),
  }
}

export function generateSignalWindow(sessionId: string, tOffset = 0): EHGSignalWindow {
  const points: EHGSamplePoint[] = []
  const n = SIGNAL_WINDOW_SECONDS * SIGNAL_SAMPLE_RATE_HZ
  for (let i = 0; i < n; i++) {
    const t = i / SIGNAL_SAMPLE_RATE_HZ
    const globalT = t + tOffset
    // Simulated uterine EHG-like burst pattern: slow envelope + higher-freq carrier + noise
    const envelope = 0.5 + 0.5 * Math.sin(globalT * 0.05)
    const carrier = Math.sin(globalT * 2.1) * 0.6 + Math.sin(globalT * 4.7) * 0.25
    const noise = (Math.random() - 0.5) * 0.15
    const raw = envelope * carrier + noise
    const filtered = envelope * carrier * 0.92
    points.push({ t, raw: Number(raw.toFixed(4)), filtered: Number(filtered.toFixed(4)) })
  }
  const quality: SignalQuality = {
    score: 78 + Math.round(Math.random() * 15),
    electrodeContact: 'good',
    motionArtifact: Math.random() > 0.85 ? 'mild' : 'none',
    snrDb: 14 + Math.random() * 6,
  }
  return {
    sessionId,
    windowSeconds: SIGNAL_WINDOW_SECONDS,
    sampleRateHz: SIGNAL_SAMPLE_RATE_HZ,
    generatedAt: new Date().toISOString(),
    points,
    quality,
  }
}

export function generateFeatures(sessionId: string): SignalFeatures {
  return {
    sessionId,
    rmsAmplitude: Number((0.2 + Math.random() * 0.3).toFixed(3)),
    peakAmplitude: Number((0.6 + Math.random() * 0.4).toFixed(3)),
    contractionDurationSec: Number((45 + Math.random() * 30).toFixed(1)),
    snrDb: Number((12 + Math.random() * 8).toFixed(1)),
    riseTimeMs: Number((180 + Math.random() * 60).toFixed(0)),
    fallTimeMs: Number((210 + Math.random() * 70).toFixed(0)),
    dominantFrequencyHz: Number((0.3 + Math.random() * 0.5).toFixed(2)),
    phaseLagMs: null, // not invented — populated once backend/DSP provides it
    filterType: 'Butterworth band-pass',
    filterOrder: 4,
    processingDelayMs: Number((12 + Math.random() * 8).toFixed(1)),
    extractedAt: new Date().toISOString(),
  }
}

export function generateRisk(sessionId: string, patientId: string): RiskAssessment {
  const rng = seededRandom(hashSeed(sessionId) + 250)
  const p = rng()
  const riskCategory = p > 0.85 ? 'critical' : p > 0.6 ? 'warning' : 'normal'
  return {
    sessionId,
    patientId,
    riskCategory,
    label:
      riskCategory === 'critical'
        ? 'Elevated preterm-risk likelihood'
        : riskCategory === 'warning'
        ? 'Borderline risk indicators present'
        : 'Low preterm-risk likelihood',
    probability: Number(p.toFixed(2)),
    modelName: 'BiGRU-LSTM-EHG-v1',
    modelVersion: '0.2.0-dev',
    timestamp: new Date().toISOString(),
    contributingFeatures: [
      { name: 'RMS amplitude', value: '0.31', weight: 0.28 },
      { name: 'Dominant frequency', value: '0.42 Hz', weight: 0.24 },
      { name: 'Contraction duration', value: '58.2 s', weight: 0.19 },
      { name: 'SNR', value: '15.1 dB', weight: 0.14 },
    ],
  }
}

export const mockReports: Report[] = mockPatients.slice(0, 6).map((p, i) => ({
  id: `RPT-${2000 + i}`,
  patientId: p.id,
  sessionId: mockSessions[p.id][0].id,
  createdAt: new Date(Date.now() - i * 86_400_000).toISOString(),
  monitoringDurationSeconds: 1400,
  signalQualityScore: 80,
  riskCategory: p.riskFlag,
  modelName: 'BiGRU-LSTM-EHG-v1',
  modelVersion: '0.2.0-dev',
  status: 'ready',
}))

export const mockAlerts: Alert[] = [
  {
    id: 'ALT-1',
    severity: 'warning',
    message: 'Signal quality degraded during session SES-PT-1002-0 (motion artifact detected).',
    timestamp: new Date(Date.now() - 25 * 60_000).toISOString(),
    patientId: 'PT-1002',
    acknowledged: false,
  },
  {
    id: 'ALT-2',
    severity: 'critical',
    message: 'Risk assessment flagged elevated preterm-risk likelihood for Kavya Reddy.',
    timestamp: new Date(Date.now() - 90 * 60_000).toISOString(),
    patientId: 'PT-1004',
    acknowledged: false,
  },
  {
    id: 'ALT-3',
    severity: 'info',
    message: 'System running in Demo Mode — no live FastAPI backend detected.',
    timestamp: new Date().toISOString(),
    acknowledged: true,
  },
]
