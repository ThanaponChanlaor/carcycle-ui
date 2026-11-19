import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronRight, X } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchCars } from '@/features/cars/carsSlice'
import { fieldLabels } from '@/features/cars/carFields'
import Button from '@/components/ui/Button'
import CarImage from '@/components/ui/CarImage'
import ErrorMessage from '@/components/ui/ErrorMessage'
import Field from '@/components/ui/Field'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { formatDate } from '@/utils/format'

export default function CarList() {
  const dispatch = useAppDispatch()
  const { items, loading, error } = useAppSelector((state) => state.cars)
  const searchRef = useRef<HTMLInputElement>(null)

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

  const clearSearch = () => {
    setSearchQuery('')
    searchRef.current?.focus()
  }

  return (
    <div className="space-y-8">
      {(error || items.length === 0) && <h1>รถทั้งหมด</h1>}

      {loading && items.length === 0 && <LoadingSpinner className="py-20" />}

      {error && (
        <ErrorMessage
          message="โหลดรายการรถไม่สำเร็จ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองอีกครั้ง"
          onRetry={() => dispatch(fetchCars())}
        />
      )}

      {!error && items.length > 0 && (
        <>
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-4">
            <div>
              <h1>รถทั้งหมด</h1>
              <p role="status" className="text-slate-600">
                {searchQuery
                  ? `พบ ${filteredCars.length} คัน จากทั้งหมด ${items.length} คัน`
                  : `มีรถทั้งหมด ${items.length} คัน`}
              </p>
            </div>
            <div className="flex w-full flex-wrap items-end gap-4 sm:w-auto sm:basis-[28rem]">
              <Field
                ref={searchRef}
                id="car-search"
                label="ค้นหารถ"
                hint="พิมพ์ชื่อรถ ยี่ห้อ สี หรือทะเบียน"
                type="search"
                enterKeyHint="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 basis-[16rem]"
              />
              {searchQuery && (
                <Button variant="secondary" onClick={clearSearch}>
                  <X aria-hidden="true" className="h-6 w-6" />
                  ล้างคำค้นหา
                </Button>
              )}
            </div>
          </div>

          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredCars.map((car) => (
              <li key={car.id}>
                <Link
                  to={`/cars/${car.id}`}
                  className="flex h-full flex-col rounded-xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow duration-150 hover:border-primary-600 hover:shadow-md"
                >
                  <CarImage src={car.imageUrl} alt={`${car.brand} ${car.name}`} className="aspect-video w-full" />
                  <h2 className="mt-4">
                    {car.brand} {car.name}
                  </h2>
                  <p className="text-slate-600">
                    {fieldLabels.color} {car.color}
                  </p>
                  <div className="my-3 border-t border-slate-200" />
                  <p className="font-semibold">ทะเบียน {car.licensePlate}</p>
                  <p className="text-slate-600">ประกันหมดอายุ {formatDate(car.insuranceRenewalDate)}</p>
                  <span className="mt-auto inline-flex items-center gap-1 pt-3 font-semibold text-primary-700">
                    ดูรายละเอียด
                    <ChevronRight aria-hidden="true" className="h-6 w-6" />
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          {filteredCars.length === 0 && (
            <div className="space-y-4 py-8">
              <p>ไม่พบรถที่ตรงกับ “{searchQuery}” ลองตรวจสอบคำที่พิมพ์ หรือล้างคำค้นหาเพื่อดูรถทั้งหมด</p>
            </div>
          )}
        </>
      )}

      {!error && !loading && items.length === 0 && <p>ยังไม่มีรถในระบบ</p>}
    </div>
  )
}
