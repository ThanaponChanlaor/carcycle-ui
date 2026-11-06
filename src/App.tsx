import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Layout from '@/components/layout/Layout'
import HomePage from '@/pages/HomePage'
import CarCyclePage from '@/pages/CarCyclePage'
import AboutPage from '@/pages/AboutPage'
import NotFoundPage from '@/pages/NotFoundPage'
import AdminRoute from '@/features/auth/AdminRoute'

// A data router is what makes useBlocker (unsaved edits) and ScrollRestoration work.
const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'cars/:carId', element: <CarCyclePage /> },
      {
        element: <AdminRoute />,
        children: [{ path: 'about', element: <AboutPage /> }],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
])

export default function App() {
  return <RouterProvider router={router} />
}
