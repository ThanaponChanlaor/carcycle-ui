import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchCars } from '@/features/cars/carsSlice'
import Card from '@/components/ui/Card'
import CarImage from '@/components/ui/CarImage'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'

export default function CarList() {
  const dispatch = useAppDispatch()
  const { items, loading, error } = useAppSelector((state) => state.cars)

  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    dispatch(fetchCars())
  }, [dispatch])

  const filteredCars = items.filter((car) => {
    const query = searchQuery.toLowerCase()
    return (
      car.name.toLowerCase().includes(query) ||
      car.brand.toLowerCase().includes(query) ||
      car.color.toLowerCase().includes(query) ||
      car.licensePlate.toLowerCase().includes(query)
    )
  })

  if (loading && items.length === 0) {
    return <LoadingSpinner size="lg" className="py-20" />
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={() => dispatch(fetchCars())} />
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">CarCycle Inventory</h1>
          <p className="mt-1 text-slate-500">
            {filteredCars.length} of {items.length} cars
          </p>
        </div>
        <input
          type="search"
          placeholder="ค้นหาชื่อรถ, ยี่ห้อ, สี, ทะเบียน..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full rounded-lg border border-slate-300 px-4 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200 sm:max-w-xs"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filteredCars.map((car) => (
          <Link key={car.id} to={`/cars/${car.id}`} className="block">
            <Card hover className="h-full">
              <CarImage src={car.imageUrl} alt={`${car.brand} ${car.name}`} className="h-28 w-full" />
              <div className="mt-4">
                <h3 className="truncate font-semibold text-slate-900">
                  {car.brand} {car.name}
                </h3>
                <p className="text-sm text-slate-500">{car.color}</p>
              </div>
              <div className="mt-3 flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
                <span className="font-mono text-slate-500">{car.licensePlate}</span>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                ประกันหมดอายุ {new Date(car.insuranceRenewalDate).toLocaleDateString('th-TH')}
              </p>
            </Card>
          </Link>
        ))}
      </div>

      {filteredCars.length === 0 && (
        <p className="py-12 text-center text-slate-500">No cars match your search.</p>
      )}
    </div>
  )
}
