import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { CarFront, House, Info, LogOut } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setRole } from '@/features/auth/authSlice'
import Button from '@/components/ui/Button'
import ConfirmDialog from '@/components/ui/ConfirmDialog'

const navLinks = [
  { to: '/', label: 'หน้าหลัก', icon: House },
  { to: '/about', label: 'เกี่ยวกับระบบ', icon: Info, adminOnly: true },
]

export default function Header() {
  const dispatch = useAppDispatch()
  const role = useAppSelector((state) => state.auth.role)
  const [confirmLogout, setConfirmLogout] = useState(false)
  const visibleLinks = navLinks.filter((link) => !link.adminOnly || role === 'admin')

  return (
    <header className="border-b-2 border-ink bg-surface print:hidden">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-accent focus:px-6 focus:py-3 focus:font-semibold focus:text-ink"
      >
        ข้ามไปเนื้อหาหลัก
      </a>

      <div className="container-app flex flex-wrap items-center gap-x-6 gap-y-2 py-3">
        <Link to="/" className="inline-flex min-h-12 items-center gap-2 rounded-lg text-xl font-bold text-ink">
          <CarFront aria-hidden="true" className="h-8 w-8 text-primary" />
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
                  isActive ? 'bg-accent font-semibold text-ink' : 'font-medium text-primary hover:bg-primary-tint'
                }`
              }
            >
              <Icon aria-hidden="true" className="h-6 w-6" />
              {label}
            </NavLink>
          ))}
        </nav>

        {role === 'admin' && (
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 sm:ml-auto">
            <span className="text-ink-muted">ผู้ดูแลระบบ</span>
            <Button variant="secondary" onClick={() => setConfirmLogout(true)}>
              <LogOut aria-hidden="true" className="h-6 w-6" />
              ออกจากระบบ
            </Button>
          </div>
        )}
      </div>

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
