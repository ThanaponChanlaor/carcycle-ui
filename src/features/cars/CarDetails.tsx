import { Pencil } from 'lucide-react'
import { fieldLabels } from '@/features/cars/carFields'
import Button from '@/components/ui/Button'
import CarImage from '@/components/ui/CarImage'
import LicensePlate from '@/components/ui/LicensePlate'
import { formatDate, formatMileage, NO_DATA } from '@/utils/format'
import type { Car } from '@/types'

interface CarDetailsProps {
  car: Car
  isAdmin: boolean
  focusEdit: boolean
  onEdit: () => void
}

const sectionHeading = 'border-b-2 border-ink pb-2'

export default function CarDetails({ car, isAdmin, focusEdit, onEdit }: CarDetailsProps) {
  const services = [
    {
      title: 'น้ำมันเครื่อง',
      mileage: formatMileage(car.lastEngineOilChangeMileage),
      date: car.lastEngineOilChangeDate,
    },
    {
      title: 'น้ำมันเกียร์',
      mileage: formatMileage(car.lastGearOilChangeMileage),
      date: car.lastGearOilChangeDate,
    },
    { title: 'น้ำมันเบรก', mileage: 'เช็กตามรอบปี', date: car.lastBrakeOilChangeDate },
    { title: 'ยาง', mileage: formatMileage(car.lastTireChangeMileage), date: car.lastTireChangeDate },
  ]

  const insurance = [
    { label: fieldLabels.insuranceProvider, value: car.insuranceProvider || NO_DATA },
    { label: fieldLabels.insuranceRenewalDate, value: formatDate(car.insuranceRenewalDate) },
    { label: fieldLabels.actInsuranceRenewalDate, value: formatDate(car.actInsuranceRenewalDate) },
  ]

  return (
    <div className="space-y-12 print:hidden">
      <div className="flex flex-wrap items-start gap-8">
        <div className="flex-1 basis-[20rem] space-y-4">
          <h1>
            {car.brand} {car.name}
          </h1>
          <LicensePlate plate={car.licensePlate} size="lg" />
          <p className="text-ink-muted">
            {fieldLabels.color}: {car.color || NO_DATA}
          </p>
          {isAdmin && (
            <Button onClick={onEdit} autoFocus={focusEdit}>
              <Pencil aria-hidden="true" className="h-6 w-6" />
              แก้ไขข้อมูล
            </Button>
          )}
        </div>
        <CarImage
          src={car.imageUrl}
          alt={`${car.brand} ${car.name}`}
          className="aspect-[4/3] w-full flex-1 basis-[18rem]"
        />
      </div>

      <section aria-labelledby="insurance-heading">
        <h2 id="insurance-heading" className={sectionHeading}>
          ประกันภัย
        </h2>
        <dl>
          {insurance.map((row) => (
            <div
              key={row.label}
              className="flex flex-wrap justify-between gap-x-8 border-b border-rule py-4"
            >
              <dt className="text-ink-muted">{row.label}</dt>
              <dd className="font-semibold">{row.value}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section aria-labelledby="service-heading">
        <h2 id="service-heading" className={sectionHeading}>
          การบำรุงรักษา
        </h2>
        <ul>
          {services.map((service) => (
            <li key={service.title} className="flex flex-wrap gap-x-8 gap-y-2 border-b border-rule py-4">
              <h3 className="flex-1 basis-[10rem]">{service.title}</h3>
              <dl className="flex flex-[3] basis-[20rem] flex-wrap gap-x-8 gap-y-2">
                <div className="flex-1 basis-[10rem]">
                  <dt className="text-sm text-ink-muted">เลขไมล์ล่าสุด</dt>
                  <dd className="font-semibold">{service.mileage}</dd>
                </div>
                <div className="flex-1 basis-[10rem]">
                  <dt className="text-sm text-ink-muted">เปลี่ยนล่าสุดเมื่อ</dt>
                  <dd className="font-semibold">{formatDate(service.date)}</dd>
                </div>
              </dl>
            </li>
          ))}
        </ul>
        <p className="mt-4 text-sm text-ink-muted">แก้ไขข้อมูลล่าสุดเมื่อ {formatDate(car.updatedAt)}</p>
      </section>

      {!isAdmin && <p className="text-sm text-ink-muted">เฉพาะผู้ดูแลระบบเท่านั้นที่แก้ไขข้อมูลได้</p>}
    </div>
  )
}
