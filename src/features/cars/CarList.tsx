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
import LicensePlate from '@/components/ui/LicensePlate'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { buttonClasses } from '@/components/ui/buttonStyles'
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
      <h1>รถทั้งหมด</h1>

      {loading && items.length === 0 && <LoadingSpinner className="py-20" />}

      {error && (
        <ErrorMessage
          message="โหลดรายการรถไม่สำเร็จ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองอีกครั้ง"
          onRetry={() => dispatch(fetchCars())}
        />
      )}

      {!error && items.length > 0 && (
        <>
          <div className="space-y-2">
            <div className="flex flex-wrap items-end gap-4">
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
            <p role="status" className="text-ink-muted">
              {searchQuery ? `พบ ${filteredCars.length} คัน จากทั้งหมด ${items.length} คัน` : `มีรถทั้งหมด ${items.length} คัน`}
            </p>
          </div>

          <ul className="border-t-2 border-ink">
            {filteredCars.map((car) => (
              <li key={car.id} className="border-b border-rule py-2">
                <Link
                  to={`/cars/${car.id}`}
                  className="flex flex-wrap items-center gap-6 rounded-lg px-2 py-4 transition-colors duration-150 hover:bg-primary-tint"
                >
                  <CarImage
                    src={car.imageUrl}
                    alt={`${car.brand} ${car.name}`}
                    className="h-36 w-full flex-1 basis-[12rem] sm:aspect-[4/3] sm:h-auto sm:max-w-[14rem]"
                  />
                  <div className="flex-[2] basis-[16rem] space-y-2">
                    <h2 className="text-xl">
                      {car.brand} {car.name}
                    </h2>
                    <LicensePlate plate={car.licensePlate} />
                    <p className="text-ink-muted">
                      {fieldLabels.color}: {car.color}
                    </p>
                    <p>
                      {fieldLabels.insuranceRenewalDate}{' '}
                      <span className="font-semibold">{formatDate(car.insuranceRenewalDate)}</span>
                    </p>
                  </div>
                  <span className={buttonClasses('secondary')}>
                    ดูข้อมูลรถ
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
