import { Outlet } from 'react-router-dom'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'

export default function Layout() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />
      <main className="container-app flex-1 py-8 md:py-12">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
