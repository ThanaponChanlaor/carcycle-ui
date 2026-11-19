import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { CarFront, House, Info, LogIn, LogOut } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setRole } from '@/features/auth/authSlice'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import AdminLoginModal from '@/features/auth/AdminLoginModal'

const navLinks = [
  { to: '/', label: 'หน้าหลัก', icon: House },
  { to: '/about', label: 'เกี่ยวกับระบบ', icon: Info, adminOnly: true },
]

export default function Header() {
  const dispatch = useAppDispatch()
  const role = useAppSelector((state) => state.auth.role)
  const [confirmLogout, setConfirmLogout] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const visibleLinks = navLinks.filter((link) => !link.adminOnly || role === 'admin')

  return (
    <header className="border-b border-slate-200 bg-white print:hidden">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary-700 focus:px-6 focus:py-3 focus:font-semibold focus:text-white"
      >
        ข้ามไปเนื้อหาหลัก
      </a>

      <div className="container-app flex flex-wrap items-center gap-x-6 gap-y-2 py-3">
        <Link to="/" className="inline-flex min-h-12 items-center gap-2 rounded-lg text-2xl font-bold text-primary-700">
          <CarFront aria-hidden="true" className="h-8 w-8" />
          CarCycle
        </Link>

        <nav aria-label="เมนูหลัก" className="flex flex-wrap gap-2">
          {visibleLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `inline-flex min-h-12 items-center gap-2 rounded-lg px-4 py-1 transition-colors duration-150 ${
                  isActive ? 'bg-primary-50 font-semibold text-primary-800' : 'font-medium text-primary-700 hover:bg-primary-50'
                }`
              }
            >
              <Icon aria-hidden="true" className="h-6 w-6" />
              {label}
            </NavLink>
          ))}
        </nav>

        {role === 'admin' ? (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:ml-auto">
            <span className="text-slate-600">ผู้ดูแลระบบ</span>
            <Button variant="secondary" onClick={() => setConfirmLogout(true)}>
              <LogOut aria-hidden="true" className="h-6 w-6" />
              ออกจากระบบ
            </Button>
          </div>
        ) : (
          <Button variant="secondary" className="sm:ml-auto" onClick={() => setShowLogin(true)}>
            <LogIn aria-hidden="true" className="h-6 w-6" />
            เข้าสู่ระบบผู้ดูแล
          </Button>
        )}
      </div>

      {showLogin && <AdminLoginModal onClose={() => setShowLogin(false)} />}

      {confirmLogout && (
        <ConfirmDialog
          title="ออกจากระบบใช่ไหม"
          confirmLabel="ออกจากระบบ"
          cancelLabel="ยังไม่ออก"
          onConfirm={() => {
            setConfirmLogout(false)
            dispatch(setRole('user'))
          }}
          onCancel={() => setConfirmLogout(false)}
        >
          <p>ถ้ากำลังแก้ไขข้อมูลอยู่ ข้อมูลที่ยังไม่ได้บันทึกจะหายไป</p>
        </ConfirmDialog>
      )}
    </header>
  )
}
