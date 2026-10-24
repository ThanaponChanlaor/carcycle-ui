import { Navigate, Outlet } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'

// Route guard for admin-only pages: anyone who isn't logged in as admin
// (including someone who logs out while on the page) is sent back home.
export default function AdminRoute() {
  const role = useAppSelector((state) => state.auth.role)
  return role === 'admin' ? <Outlet /> : <Navigate to="/" replace />
}
