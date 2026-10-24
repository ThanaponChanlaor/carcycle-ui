import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import HomePage from '@/pages/HomePage'
import CarCyclePage from '@/pages/CarCyclePage'
import AboutPage from '@/pages/AboutPage'
import AdminRoute from '@/features/auth/AdminRoute'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="cars/:carId" element={<CarCyclePage />} />
          <Route element={<AdminRoute />}>
            <Route path="about" element={<AboutPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
