import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { toggleSidebar, setSidebarOpen } from '@/features/ui/uiSlice'
import { setRole } from '@/features/auth/authSlice'
import AdminLoginModal from '@/features/auth/AdminLoginModal'
import Button from '@/components/ui/Button'

const navLinks = [
  { to: '/', label: 'CarCycle' },
  { to: '/about', label: 'About', adminOnly: true },
]

export default function Header() {
  const dispatch = useAppDispatch()
  const sidebarOpen = useAppSelector((state) => state.ui.sidebarOpen)
  const role = useAppSelector((state) => state.auth.role)
  const [showLogin, setShowLogin] = useState(false)
  const visibleLinks = navLinks.filter((link) => !link.adminOnly || role === 'admin')

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/95 backdrop-blur-sm print:hidden">
      <div className="container-app flex h-16 items-center justify-between gap-4">
        <Link to="/" className="text-xl font-bold text-primary-600">
          🚗 CarCycle
        </Link>

        <nav className="hidden md:flex md:items-center md:gap-1">
          {visibleLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-700'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
                }`
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2 md:ml-0">
          {role === 'admin' ? (
            <>
              <span className="hidden text-sm text-slate-500 sm:inline">ผู้ดูแลระบบ</span>
              <Button variant="ghost" size="sm" onClick={() => dispatch(setRole('user'))}>
                ออกจากระบบ
              </Button>
            </>
          ) : (
            <Button variant="outline" size="sm" onClick={() => setShowLogin(true)}>
              เข้าสู่ระบบผู้ดูแล
            </Button>
          )}
        </div>

        {showLogin && <AdminLoginModal onClose={() => setShowLogin(false)} />}

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-lg p-2 text-slate-600 hover:bg-slate-100 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={sidebarOpen}
          onClick={() => dispatch(toggleSidebar())}
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {sidebarOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {sidebarOpen && (
        <nav className="border-t border-slate-200 bg-white md:hidden">
          <div className="container-app flex flex-col gap-1 py-3">
            {visibleLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => dispatch(setSidebarOpen(false))}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-3 text-sm font-medium ${
                    isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-100'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  )
}
