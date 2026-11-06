import { useEffect, useRef, useState } from 'react'
import { useParams } from 'react-router-dom'
import { ArrowLeft, CircleCheck, House } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { clearSelectedCar, fetchCarById } from '@/features/cars/carsSlice'
import CarDetails from '@/features/cars/CarDetails'
import CarEditForm from '@/features/cars/CarEditForm'
import CarHistory from '@/features/cars/CarHistory'
import CarQrSection from '@/features/cars/CarQrSection'
import ButtonLink from '@/components/ui/ButtonLink'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'

export default function CarCycle() {
  const { carId } = useParams<{ carId: string }>()
  const dispatch = useAppDispatch()
  const { selectedCar: car, error } = useAppSelector((state) => state.cars)
  const isAdmin = useAppSelector((state) => state.auth.role) === 'admin'

  const [isEditing, setIsEditing] = useState(false)
  const [cameFromEdit, setCameFromEdit] = useState(false)
  const [savedNotice, setSavedNotice] = useState(false)
  const noticeRef = useRef<HTMLParagraphElement>(null)

  useEffect(() => {
    if (!carId) return
    dispatch(fetchCarById(carId))
    return () => {
      dispatch(clearSelectedCar())
    }
  }, [dispatch, carId])

  useEffect(() => {
    if (savedNotice) noticeRef.current?.focus()
  }, [savedNotice])

  if (error && !car) {
    return (
      <div className="space-y-6">
        <title>ไม่พบข้อมูลรถ - CarCycle</title>
        <h1>ไม่พบข้อมูลรถ</h1>
        <ErrorMessage
          message="เปิดข้อมูลรถคันนี้ไม่ได้ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองอีกครั้ง หรือกลับไปเลือกรถจากหน้าหลัก"
          onRetry={carId ? () => dispatch(fetchCarById(carId)) : undefined}
        />
        <ButtonLink to="/" variant="secondary">
          <House aria-hidden="true" className="h-6 w-6" />
          กลับหน้าหลัก
        </ButtonLink>
      </div>
    )
  }

  if (!car) {
    return (
      <>
        <title>กำลังโหลด - CarCycle</title>
        <LoadingSpinner className="py-20" />
      </>
    )
  }

  const carName = `${car.brand} ${car.name}`
  const title = <title>{`${carName} - CarCycle`}</title>

  if (isEditing && isAdmin) {
    return (
      <>
        {title}
        <CarEditForm
          car={car}
          onCancel={() => {
            setCameFromEdit(true)
            setIsEditing(false)
          }}
          onSaved={() => {
            setSavedNotice(true)
            setIsEditing(false)
          }}
        />
      </>
    )
  }

  return (
    <div className="space-y-12 print:space-y-0">
      {title}
      <ButtonLink to="/" variant="quiet" className="px-2 print:hidden">
        <ArrowLeft aria-hidden="true" className="h-6 w-6" />
        กลับหน้าหลัก
      </ButtonLink>

      {savedNotice && (
        <p
          ref={noticeRef}
          role="status"
          tabIndex={-1}
          className="flex items-start gap-3 rounded-lg border-2 border-primary bg-primary-tint p-6 font-semibold text-primary print:hidden"
        >
          <CircleCheck aria-hidden="true" className="mt-1 h-6 w-6 shrink-0" />
          บันทึกข้อมูลเรียบร้อยแล้ว
        </p>
      )}

      <CarDetails
        car={car}
        isAdmin={isAdmin}
        focusEdit={cameFromEdit}
        onEdit={() => {
          setSavedNotice(false)
          setCameFromEdit(false)
          setIsEditing(true)
        }}
      />

      <CarHistory key={car.id} carId={car.id} />
      <CarQrSection car={car} />
    </div>
  )
}
