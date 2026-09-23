import { Navigate, Route, Routes } from 'react-router-dom'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from '@/components/layout/ProtectedRoute'
import { RoleRoute } from '@/components/layout/RoleRoute'

import LoginPage from '@/pages/Login/LoginPage'
import DashboardPage from '@/pages/Dashboard/DashboardPage'
import PatientsPage from '@/pages/Patients/PatientsPage'
import PatientDetailsPage from '@/pages/PatientDetails/PatientDetailsPage'
import MonitoringPage from '@/pages/Monitoring/MonitoringPage'
import EHGSignalPage from '@/pages/EHGSignal/EHGSignalPage'
import RiskAssessmentPage from '@/pages/RiskAssessment/RiskAssessmentPage'
import ReportsPage from '@/pages/Reports/ReportsPage'
import SignalEDAPage from '@/pages/SignalEDA/SignalEDAPage'
import ComparisonPage from '@/pages/Comparison/ComparisonPage'
import ModelInfoPage from '@/pages/ModelInfo/ModelInfoPage'
import SettingsPage from '@/pages/Settings/SettingsPage'
import NotFoundPage from '@/pages/NotFoundPage'

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/dashboard" element={<DashboardPage />} />

          <Route element={<RoleRoute requires="patients" />}>
            <Route path="/patients" element={<PatientsPage />} />
            <Route path="/patients/:id" element={<PatientDetailsPage />} />
          </Route>

          <Route element={<RoleRoute requires="monitoring" />}>
            <Route path="/monitoring" element={<MonitoringPage />} />
            <Route path="/monitoring/:sessionId" element={<MonitoringPage />} />
          </Route>

          <Route element={<RoleRoute requires="ehg-signal" />}>
            <Route path="/ehg-signal" element={<EHGSignalPage />} />
          </Route>

          <Route element={<RoleRoute requires="risk-assessment" />}>
            <Route path="/risk-assessment" element={<RiskAssessmentPage />} />
          </Route>

          <Route element={<RoleRoute requires="reports" />}>
            <Route path="/reports" element={<ReportsPage />} />
          </Route>

          <Route element={<RoleRoute requires="signal-eda" />}>
            <Route path="/signal-eda" element={<SignalEDAPage />} />
          </Route>

          <Route element={<RoleRoute requires="comparison" />}>
            <Route path="/comparison" element={<ComparisonPage />} />
          </Route>

          <Route element={<RoleRoute requires="model-info" />}>
            <Route path="/model-info" element={<ModelInfoPage />} />
          </Route>

          <Route path="/settings" element={<SettingsPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}
