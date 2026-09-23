import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '@/context/AuthContext'
import { ROLE_PERMISSIONS, type NavItemId } from '@/constants'

export function RoleRoute({ requires }: { requires: NavItemId }) {
  const { user } = useAuth()
  if (!user) return <Navigate to="/login" replace />
  const allowed = ROLE_PERMISSIONS[user.role].includes(requires)
  if (!allowed) return <Navigate to="/dashboard" replace />
  return <Outlet />
}
