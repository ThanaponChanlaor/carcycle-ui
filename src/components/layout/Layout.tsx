import { useEffect, useRef } from 'react'
import { Outlet, ScrollRestoration, useLocation } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function Layout() {
  const { pathname } = useLocation()
  const mainRef = useRef<HTMLElement>(null)
  const previousPath = useRef(pathname)

  // After a page change, screen readers and keyboard users start at the new content.
  useEffect(() => {
    if (previousPath.current === pathname) return
    previousPath.current = pathname
    mainRef.current?.focus({ preventScroll: true })
  }, [pathname])

  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main ref={mainRef} id="main" tabIndex={-1} className="container-app flex-1 py-8 outline-none md:py-12">
        <Outlet />
      </main>
      <Footer />
      <ScrollRestoration />
    </div>
  )
}
