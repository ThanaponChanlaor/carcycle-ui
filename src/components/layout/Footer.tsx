import { Link } from 'react-router-dom'
import { useAppSelector } from '@/app/hooks'

export default function Footer() {
  const role = useAppSelector((state) => state.auth.role)

  return (
    <footer className="mt-auto border-t border-slate-200 bg-white print:hidden">
      <div className="container-app py-8">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-slate-500">
            &copy; {new Date().getFullYear()} CarCycle. Built with React, Redux & Tailwind.
          </p>
          <div className="flex gap-6">
            {role === 'admin' && (
              <Link to="/about" className="text-sm text-slate-500 hover:text-primary-600">
                About
              </Link>
            )}
            <a href="https://github.com" className="text-sm text-slate-500 hover:text-primary-600" target="_blank" rel="noreferrer">
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
