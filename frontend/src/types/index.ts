// ---------------------------------------------------------------------------
// PREG AI — API contract types
// These mirror the FastAPI / Pydantic schemas the backend team will finalize.
// Kept intentionally simple/flat so they're easy to update once the real
// backend contracts land — nothing here should require touching components.
// ---------------------------------------------------------------------------

export type UserRole = 'admin' | 'clinician' | 'researcher'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatarInitials?: string
}

export interface AuthResponse {
  user: User
  token: string
}

// ---------------------------------------------------------------------------
export type RiskLevel = 'normal' | 'warning' | 'critical'
export type ConnectionState =
  | 'connected'
  | 'reconnecting'
  | 'disconnected'
  | 'stale'
  | 'demo'

export interface Patient {
  id: string
  name: string
  age: number
  gestationalAgeWeeks: number
  gravida: number
  para: number
  riskFlag: RiskLevel
  lastSessionAt: string | null
  assignedClinician: string
  tags: string[]
}

export interface MonitoringSession {
  id: string
  patientId: string
  startedAt: string
  endedAt: string | null
  status: 'active' | 'paused' | 'completed' | 'aborted'
  durationSeconds: number
  connection: ConnectionState
  mode: 'live' | 'demo'
}

export interface SignalQuality {
  score: number // 0-100
  electrodeContact: 'good' | 'fair' | 'poor'
  motionArtifact: 'none' | 'mild' | 'severe'
  snrDb: number | null
}

export interface EHGSamplePoint {
  t: number // seconds, relative to window start
  raw: number
  filtered: number
}

export interface EHGSignalWindow {
  sessionId: string
  windowSeconds: number
  sampleRateHz: number
  generatedAt: string
  points: EHGSamplePoint[]
  quality: SignalQuality
}

export interface SignalFeatures {
  sessionId: string
  rmsAmplitude: number
  peakAmplitude: number
  contractionDurationSec: number
  snrDb: number
  riseTimeMs: number
  fallTimeMs: number
  dominantFrequencyHz: number
  phaseLagMs: number | null
  filterType: string
  filterOrder: number
  processingDelayMs: number
  extractedAt: string
}

export interface RiskAssessment {
  sessionId: string
  patientId: string
  riskCategory: RiskLevel
  label: string // e.g. "Low preterm-risk likelihood"
  probability: number // 0-1
  modelName: string
  modelVersion: string
  timestamp: string
  contributingFeatures: { name: string; value: string; weight: number }[]
}

export interface Report {
  id: string
  patientId: string
  sessionId: string
  createdAt: string
  monitoringDurationSeconds: number
  signalQualityScore: number
  riskCategory: RiskLevel
  modelName: string
  modelVersion: string
  status: 'ready' | 'generating'
}

export type AlertSeverity = 'info' | 'warning' | 'critical'

export interface Alert {
  id: string
  severity: AlertSeverity
  message: string
  timestamp: string
  patientId?: string
  acknowledged: boolean
}

// ---------------------------------------------------------------------------
// The actual feature set currently extracted by the ESP32 firmware. This is
// the feature vocabulary Signal EDA and session Comparison are built around.
// ---------------------------------------------------------------------------
export interface FirmwareFeatureSet {
  variance: number
  energy: number
  mav: number // Mean Absolute Value
  peakToPeak: number
  lineLength: number
  crestFactor: number
  peakFrequencyHz: number
  medianFrequencyHz: number
  skewness: number
  kurtosis: number
}

export type ChangeDirection = 'increased' | 'decreased' | 'stable'

export interface FeatureDelta {
  key: keyof FirmwareFeatureSet
  label: string
  unit?: string
  a: number
  b: number
  percentChange: number
  direction: ChangeDirection
}

export interface SessionComparisonSide {
  session: MonitoringSession
  quality: SignalQuality
  features: FirmwareFeatureSet
  signal: EHGSignalWindow
  risk: RiskAssessment | null
}

export interface ComparisonInsight {
  id: string
  text: string
}

export interface SessionComparison {
  patientId: string
  a: SessionComparisonSide
  b: SessionComparisonSide
  featureDeltas: FeatureDelta[]
  insights: ComparisonInsight[]
}

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  text: string
  timestamp: string
}

export interface ReportContext {
  report: Report
  patientName: string
  risk: RiskAssessment
  features: SignalFeatures
}

export interface SystemStatus {
  backendReachable: boolean
  mode: 'live' | 'demo'
  activeSessions: number
  totalPatients: number
  lastSyncAt: string
}
