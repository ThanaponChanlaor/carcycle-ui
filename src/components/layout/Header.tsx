import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { CarFront, House, Info, LogIn, LogOut } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setRole } from '@/features/auth/authSlice'
import { signOutAdmin } from '@/services/adminAuth'
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

      {/* Below md: logo + account button on row 1, menu stretched across row 2. md and up: one row. */}
      <div className="container-app flex flex-wrap items-center gap-x-3 gap-y-2 py-3 md:gap-x-6">
        <Link
          to="/"
          className="order-1 inline-flex min-h-12 items-center gap-2 rounded-lg text-xl font-bold text-primary-700 sm:text-2xl"
        >
          <CarFront aria-hidden="true" className="h-8 w-8" />
          CarCycle
        </Link>

        <nav aria-label="เมนูหลัก" className="order-3 flex w-full gap-2 md:order-2 md:w-auto">
          {visibleLinks.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `inline-flex min-h-12 flex-1 items-center justify-center gap-2 rounded-lg px-4 py-1 transition-colors duration-150 md:flex-none ${
                  isActive ? 'bg-primary-50 font-semibold text-primary-800' : 'font-semibold text-primary-700 hover:bg-primary-50'
                }`
              }
            >
              <Icon aria-hidden="true" className="h-6 w-6" />
              {label}
            </NavLink>
          ))}
        </nav>

        {role === 'admin' ? (
          <div className="order-2 ml-auto flex items-center gap-x-4 md:order-3">
            <span className="hidden text-slate-600 lg:inline">ผู้ดูแลระบบ</span>
            <Button variant="secondary" onClick={() => setConfirmLogout(true)}>
              <LogOut aria-hidden="true" className="h-6 w-6" />
              ออกจากระบบ
            </Button>
          </div>
        ) : (
          <Button variant="secondary" className="order-2 ml-auto md:order-3" onClick={() => setShowLogin(true)}>
            <LogIn aria-hidden="true" className="h-6 w-6" />
            <span className="md:hidden">เข้าสู่ระบบ</span>
            <span className="hidden md:inline">เข้าสู่ระบบผู้ดูแล</span>
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
            signOutAdmin()
              .catch(() => {})
              .finally(() => dispatch(setRole('user')))
          }}
          onCancel={() => setConfirmLogout(false)}
        >
          <p>ถ้ากำลังแก้ไขข้อมูลอยู่ ข้อมูลที่ยังไม่ได้บันทึกจะหายไป</p>
        </ConfirmDialog>
      )}
    </header>
  )
}
