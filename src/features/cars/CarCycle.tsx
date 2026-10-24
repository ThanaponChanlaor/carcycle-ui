import { useEffect, useState, type FormEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { clearSelectedCar, fetchCarById, fetchCarHistory, updateCar } from '@/features/cars/carsSlice'
import { fieldLabels } from '@/features/cars/carFields'
import Card from '@/components/ui/Card'
import CarImage from '@/components/ui/CarImage'
import Button from '@/components/ui/Button'
import QRCode from '@/components/ui/QRCode'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import ErrorMessage from '@/components/ui/ErrorMessage'
import { toDriveDirectImageUrl } from '@/utils/googleDrive'
import type { CarUpdateInput } from '@/types'

const driveFolderUrl = import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_URL

interface FormState {
  name: string
  brand: string
  color: string
  imageUrl: string
  licensePlate: string
  insuranceRenewalDate: string
  insuranceProvider: string
  actInsuranceRenewalDate: string
  lastGearOilChangeMileage: string
  lastGearOilChangeDate: string
  lastEngineOilChangeMileage: string
  lastEngineOilChangeDate: string
  lastBrakeOilChangeDate: string
  lastTireChangeMileage: string
  lastTireChangeDate: string
}

const emptyForm: FormState = {
  name: '',
  brand: '',
  color: '',
  imageUrl: '',
  licensePlate: '',
  insuranceRenewalDate: '',
  insuranceProvider: '',
  actInsuranceRenewalDate: '',
  lastGearOilChangeMileage: '',
  lastGearOilChangeDate: '',
  lastEngineOilChangeMileage: '',
  lastEngineOilChangeDate: '',
  lastBrakeOilChangeDate: '',
  lastTireChangeMileage: '',
  lastTireChangeDate: '',
}

const formatDate = (value: string) => (value ? new Date(value).toLocaleDateString('th-TH') : '—')

export default function CarCycle() {
  const { carId } = useParams<{ carId: string }>()
  const dispatch = useAppDispatch()
  const { selectedCar: car, history, loading, historyLoading, updating, error } = useAppSelector(
    (state) => state.cars
  )
  const role = useAppSelector((state) => state.auth.role)
  const isAdmin = role === 'admin'

  const [isEditing, setIsEditing] = useState(false)
  const [showHistory, setShowHistory] = useState(false)
  const [form, setForm] = useState<FormState>(emptyForm)

  useEffect(() => {
    if (!carId) return
    dispatch(fetchCarById(carId))
    return () => {
      dispatch(clearSelectedCar())
      setShowHistory(false)
    }
  }, [dispatch, carId])

  const handleToggleHistory = () => {
    if (!showHistory && carId) {
      dispatch(fetchCarHistory(carId))
    }
    setShowHistory((prev) => !prev)
  }

  useEffect(() => {
    if (car) {
      setForm({
        name: car.name,
        brand: car.brand,
        color: car.color,
        imageUrl: car.imageUrl ?? '',
        licensePlate: car.licensePlate,
        insuranceRenewalDate: car.insuranceRenewalDate,
        insuranceProvider: car.insuranceProvider,
        actInsuranceRenewalDate: car.actInsuranceRenewalDate,
        lastGearOilChangeMileage: String(car.lastGearOilChangeMileage),
        lastGearOilChangeDate: car.lastGearOilChangeDate,
        lastEngineOilChangeMileage: String(car.lastEngineOilChangeMileage),
        lastEngineOilChangeDate: car.lastEngineOilChangeDate,
        lastBrakeOilChangeDate: car.lastBrakeOilChangeDate,
        lastTireChangeMileage: String(car.lastTireChangeMileage),
        lastTireChangeDate: car.lastTireChangeDate,
      })
    }
  }, [car])

  if (loading && !car) {
    return <LoadingSpinner size="lg" className="py-20" />
  }

  if (error && !car) {
    return (
      <div className="space-y-4 py-12 text-center">
        <ErrorMessage message={error} />
        <Link to="/" className="inline-block text-sm font-medium text-primary-600 hover:text-primary-700">
          ← Back to CarCycle
        </Link>
      </div>
    )
  }

  if (!car) {
    return null
  }

  const detailUrl = `${window.location.origin}/cars/${car.id}`

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const changes: CarUpdateInput = {
      name: form.name,
      brand: form.brand,
      color: form.color,
      imageUrl: form.imageUrl,
      licensePlate: form.licensePlate,
      insuranceRenewalDate: form.insuranceRenewalDate,
      insuranceProvider: form.insuranceProvider,
      actInsuranceRenewalDate: form.actInsuranceRenewalDate,
      lastGearOilChangeMileage: Number(form.lastGearOilChangeMileage),
      lastGearOilChangeDate: form.lastGearOilChangeDate,
      lastEngineOilChangeMileage: Number(form.lastEngineOilChangeMileage),
      lastEngineOilChangeDate: form.lastEngineOilChangeDate,
      lastBrakeOilChangeDate: form.lastBrakeOilChangeDate,
      lastTireChangeMileage: Number(form.lastTireChangeMileage),
      lastTireChangeDate: form.lastTireChangeDate,
    }
    dispatch(updateCar({ id: car.id, changes }))
      .unwrap()
      .then(() => setIsEditing(false))
      .catch(() => {})
  }

  const inputClass =
    'w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200'

  return (
    <div className="space-y-6">
      <Link
        to="/"
        className="print:hidden inline-flex items-center gap-1 text-sm font-medium text-primary-600 hover:text-primary-700"
      >
        ← Back to CarCycle
      </Link>

      <div className="grid gap-6 lg:grid-cols-3 print:block">
        <Card className="lg:col-span-2 print:hidden">
          <CarImage src={car.imageUrl} alt={`${car.brand} ${car.name}`} className="h-48 w-full" />
          <div className="mt-4 flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">
                {car.brand} {car.name}
              </h1>
              <p className="mt-1 font-mono text-sm text-slate-500">{car.licensePlate}</p>
            </div>
          </div>

          {!isEditing || !isAdmin ? (
            <>
              <div className="mt-6 space-y-6">
                <section>
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">ข้อมูลรถ</h2>
                  <dl className="mt-2 grid grid-cols-2 gap-4 sm:grid-cols-4">
                    <div>
                      <dt className="text-xs text-slate-400">{fieldLabels.name}</dt>
                      <dd className="text-sm text-slate-900">{car.name}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-400">{fieldLabels.brand}</dt>
                      <dd className="text-sm text-slate-900">{car.brand}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-400">{fieldLabels.color}</dt>
                      <dd className="text-sm text-slate-900">{car.color}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-400">{fieldLabels.licensePlate}</dt>
                      <dd className="font-mono text-sm text-slate-900">{car.licensePlate}</dd>
                    </div>
                  </dl>
                </section>

                <section>
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">ประกันภัย</h2>
                  <dl className="mt-2 grid grid-cols-1 gap-4 sm:grid-cols-3">
                    <div>
                      <dt className="text-xs text-slate-400">{fieldLabels.insuranceRenewalDate}</dt>
                      <dd className="text-sm text-slate-900">{formatDate(car.insuranceRenewalDate)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-400">{fieldLabels.insuranceProvider}</dt>
                      <dd className="text-sm text-slate-900">{car.insuranceProvider}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-400">{fieldLabels.actInsuranceRenewalDate}</dt>
                      <dd className="text-sm text-slate-900">{formatDate(car.actInsuranceRenewalDate)}</dd>
                    </div>
                  </dl>
                </section>

                <section>
                  <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">การบำรุงรักษา</h2>
                  <dl className="mt-2 grid grid-cols-2 gap-4">
                    <div>
                      <dt className="text-xs text-slate-400">{fieldLabels.lastGearOilChangeMileage}</dt>
                      <dd className="text-sm text-slate-900">
                        {car.lastGearOilChangeMileage.toLocaleString()} km
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-400">{fieldLabels.lastGearOilChangeDate}</dt>
                      <dd className="text-sm text-slate-900">{formatDate(car.lastGearOilChangeDate)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-400">{fieldLabels.lastEngineOilChangeMileage}</dt>
                      <dd className="text-sm text-slate-900">
                        {car.lastEngineOilChangeMileage.toLocaleString()} km
                      </dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-400">{fieldLabels.lastEngineOilChangeDate}</dt>
                      <dd className="text-sm text-slate-900">{formatDate(car.lastEngineOilChangeDate)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-400">{fieldLabels.lastBrakeOilChangeDate}</dt>
                      <dd className="text-sm text-slate-900">{formatDate(car.lastBrakeOilChangeDate)}</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-400">{fieldLabels.lastTireChangeMileage}</dt>
                      <dd className="text-sm text-slate-900">{car.lastTireChangeMileage.toLocaleString()} km</dd>
                    </div>
                    <div>
                      <dt className="text-xs text-slate-400">{fieldLabels.lastTireChangeDate}</dt>
                      <dd className="text-sm text-slate-900">{formatDate(car.lastTireChangeDate)}</dd>
                    </div>
                  </dl>
                </section>
              </div>

              <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4 text-xs text-slate-400">
                <span>Added {new Date(car.createdAt).toLocaleDateString('th-TH')}</span>
                <span>Last updated {new Date(car.updatedAt).toLocaleDateString('th-TH')}</span>
              </div>

              <div className="mt-4">
                {isAdmin ? (
                  <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                    แก้ไขข้อมูล
                  </Button>
                ) : (
                  <p className="text-xs text-slate-400">เฉพาะผู้ดูแลระบบ (Admin) เท่านั้นที่สามารถแก้ไขข้อมูลได้</p>
                )}
              </div>
            </>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-6">
              <section className="space-y-3">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">ข้อมูลรถ</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm">
                    <span className="mb-1 block text-slate-600">{fieldLabels.name}</span>
                    <input
                      value={form.name}
                      onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                      className={inputClass}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block text-slate-600">{fieldLabels.brand}</span>
                    <input
                      value={form.brand}
                      onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
                      className={inputClass}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block text-slate-600">{fieldLabels.color}</span>
                    <input
                      value={form.color}
                      onChange={(e) => setForm((f) => ({ ...f, color: e.target.value }))}
                      className={inputClass}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block text-slate-600">{fieldLabels.licensePlate}</span>
                    <input
                      value={form.licensePlate}
                      onChange={(e) => setForm((f) => ({ ...f, licensePlate: e.target.value }))}
                      className={inputClass}
                    />
                  </label>
                  <label className="block text-sm sm:col-span-2">
                    <span className="mb-1 block text-slate-600">{fieldLabels.imageUrl}</span>
                    <div className="flex flex-col gap-2 sm:flex-row">
                      <input
                        type="url"
                        value={form.imageUrl}
                        onChange={(e) => setForm((f) => ({ ...f, imageUrl: e.target.value }))}
                        onBlur={(e) => setForm((f) => ({ ...f, imageUrl: toDriveDirectImageUrl(e.target.value) }))}
                        placeholder="https://..."
                        className={inputClass}
                      />
                      {driveFolderUrl && (
                        <a
                          href={driveFolderUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex shrink-0 items-center justify-center rounded-lg border border-slate-300 px-3 py-2 text-sm font-medium text-slate-600 hover:bg-slate-50"
                        >
                          Open Google Drive
                        </a>
                      )}
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      Upload a photo in Drive, right-click it → Share → change to "Anyone with the link" →
                      Copy link, then paste it here.
                    </p>
                    {form.imageUrl && (
                      <CarImage src={form.imageUrl} alt="Preview" className="mt-2 h-32 w-full" />
                    )}
                  </label>
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">ประกันภัย</h2>
                <div className="grid gap-4 sm:grid-cols-3">
                  <label className="block text-sm">
                    <span className="mb-1 block text-slate-600">{fieldLabels.insuranceRenewalDate}</span>
                    <input
                      type="date"
                      value={form.insuranceRenewalDate}
                      onChange={(e) => setForm((f) => ({ ...f, insuranceRenewalDate: e.target.value }))}
                      className={inputClass}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block text-slate-600">{fieldLabels.insuranceProvider}</span>
                    <input
                      value={form.insuranceProvider}
                      onChange={(e) => setForm((f) => ({ ...f, insuranceProvider: e.target.value }))}
                      className={inputClass}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block text-slate-600">{fieldLabels.actInsuranceRenewalDate}</span>
                    <input
                      type="date"
                      value={form.actInsuranceRenewalDate}
                      onChange={(e) => setForm((f) => ({ ...f, actInsuranceRenewalDate: e.target.value }))}
                      className={inputClass}
                    />
                  </label>
                </div>
              </section>

              <section className="space-y-3">
                <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400">การบำรุงรักษา</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm">
                    <span className="mb-1 block text-slate-600">{fieldLabels.lastGearOilChangeMileage}</span>
                    <input
                      type="number"
                      value={form.lastGearOilChangeMileage}
                      onChange={(e) => setForm((f) => ({ ...f, lastGearOilChangeMileage: e.target.value }))}
                      className={inputClass}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block text-slate-600">{fieldLabels.lastGearOilChangeDate}</span>
                    <input
                      type="date"
                      value={form.lastGearOilChangeDate}
                      onChange={(e) => setForm((f) => ({ ...f, lastGearOilChangeDate: e.target.value }))}
                      className={inputClass}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block text-slate-600">{fieldLabels.lastEngineOilChangeMileage}</span>
                    <input
                      type="number"
                      value={form.lastEngineOilChangeMileage}
                      onChange={(e) => setForm((f) => ({ ...f, lastEngineOilChangeMileage: e.target.value }))}
                      className={inputClass}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block text-slate-600">{fieldLabels.lastEngineOilChangeDate}</span>
                    <input
                      type="date"
                      value={form.lastEngineOilChangeDate}
                      onChange={(e) => setForm((f) => ({ ...f, lastEngineOilChangeDate: e.target.value }))}
                      className={inputClass}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block text-slate-600">{fieldLabels.lastBrakeOilChangeDate}</span>
                    <input
                      type="date"
                      value={form.lastBrakeOilChangeDate}
                      onChange={(e) => setForm((f) => ({ ...f, lastBrakeOilChangeDate: e.target.value }))}
                      className={inputClass}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block text-slate-600">{fieldLabels.lastTireChangeMileage}</span>
                    <input
                      type="number"
                      value={form.lastTireChangeMileage}
                      onChange={(e) => setForm((f) => ({ ...f, lastTireChangeMileage: e.target.value }))}
                      className={inputClass}
                    />
                  </label>
                  <label className="block text-sm">
                    <span className="mb-1 block text-slate-600">{fieldLabels.lastTireChangeDate}</span>
                    <input
                      type="date"
                      value={form.lastTireChangeDate}
                      onChange={(e) => setForm((f) => ({ ...f, lastTireChangeDate: e.target.value }))}
                      className={inputClass}
                    />
                  </label>
                </div>
              </section>

              {error && <ErrorMessage message={error} />}

              <div className="flex gap-2">
                <Button type="submit" size="sm" isLoading={updating}>
                  บันทึกการเปลี่ยนแปลง
                </Button>
                <Button type="button" variant="ghost" size="sm" onClick={() => setIsEditing(false)}>
                  ยกเลิก
                </Button>
              </div>
            </form>
          )}
        </Card>

        <Card className="flex flex-col items-center gap-4 text-center print:border-none print:p-12 print:shadow-none">
          <h2 className="font-semibold text-slate-900 print:hidden">Scan for this car</h2>
          <QRCode value={detailUrl} />
          <p className="hidden font-semibold text-slate-900 print:block">
            {car.brand} {car.name}
          </p>
          <p className="break-all font-mono text-xs text-slate-400 print:hidden">{detailUrl}</p>
          <Button variant="outline" size="sm" onClick={() => window.print()} className="print:hidden">
            Print QR label
          </Button>
        </Card>
      </div>

      <Card className="print:hidden">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-semibold text-slate-900">Change History</h2>
          <Button variant="outline" size="sm" onClick={handleToggleHistory}>
            {showHistory ? 'Hide History' : 'Show History'}
          </Button>
        </div>

        {showHistory && (
          <div className="mt-4">
            {historyLoading && <LoadingSpinner size="md" className="py-6" />}
            {!historyLoading && history.length === 0 && (
              <p className="text-sm text-slate-500">No changes logged yet.</p>
            )}
            {!historyLoading && history.length > 0 && (
              <ul className="space-y-4">
                {history.map((entry) => (
                  <li key={entry.id} className="border-l-2 border-primary-200 pl-4">
                    <div className="flex flex-wrap items-baseline justify-between gap-2">
                      <span className="text-sm font-medium text-slate-900">{entry.changedBy}</span>
                      <span className="text-xs text-slate-400">
                        {new Date(entry.changedAt).toLocaleString('th-TH')}
                      </span>
                    </div>
                    <ul className="mt-1 space-y-0.5">
                      {entry.changes.map((change, i) => (
                        <li key={i} className="text-sm text-slate-600">
                          <span className="font-medium">
                            {fieldLabels[change.field as keyof CarUpdateInput] ?? change.field}
                          </span>
                          : {change.oldValue || '—'} → {change.newValue}
                        </li>
                      ))}
                    </ul>
                    {entry.note && <p className="mt-1 text-sm italic text-slate-500">{entry.note}</p>}
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
      </Card>
    </div>
  )
}
