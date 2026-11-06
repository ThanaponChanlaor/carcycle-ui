import { useState } from 'react'
import { useAppSelector } from '@/app/hooks'
import AdminLoginModal from '@/features/auth/AdminLoginModal'
import Button from '@/components/ui/Button'

export default function Footer() {
  const role = useAppSelector((state) => state.auth.role)
  const [showLogin, setShowLogin] = useState(false)

  return (
    <footer className="mt-auto border-t-2 border-rule print:hidden">
      <div className="container-app flex flex-wrap items-center justify-between gap-x-6 gap-y-2 py-6">
        <p className="text-sm text-ink-muted">&copy; {new Date().getFullYear()} CarCycle</p>
        {role !== 'admin' && (
          <Button variant="quiet" onClick={() => setShowLogin(true)}>
            สำหรับผู้ดูแลระบบ
          </Button>
        )}
      </div>
      {showLogin && <AdminLoginModal onClose={() => setShowLogin(false)} />}
    </footer>
  )
}
