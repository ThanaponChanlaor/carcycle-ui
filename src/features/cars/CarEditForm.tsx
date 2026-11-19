import { useEffect, useRef, useState, type FormEvent } from 'react'
import { useBlocker } from 'react-router-dom'
import { CircleAlert, ExternalLink, Save } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { updateCar } from '@/features/cars/carsSlice'
import { fieldLabels } from '@/features/cars/carFields'
import {
  formSections,
  getChangedFields,
  toChanges,
  toForm,
  validateField,
  validateForm,
  type FieldName,
  type FormErrors,
  type FormState,
} from '@/features/cars/carForm'
import Button from '@/components/ui/Button'
import Card from '@/components/ui/Card'
import CarImage from '@/components/ui/CarImage'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import ErrorMessage from '@/components/ui/ErrorMessage'
import Field from '@/components/ui/Field'
import { buttonClasses } from '@/components/ui/buttonStyles'
import { toDriveDirectImageUrl } from '@/utils/googleDrive'
import { formatDate, formatFieldValue } from '@/utils/format'
import type { Car, CarChangeRecord } from '@/types'

const driveFolderUrl = import.meta.env.VITE_GOOGLE_DRIVE_FOLDER_URL

const fieldId = (name: FieldName) => `car-${name}`

interface CarEditFormProps {
  car: Car
  onCancel: () => void
  onSaved: () => void
}

export default function CarEditForm({ car, onCancel, onSaved }: CarEditFormProps) {
  const dispatch = useAppDispatch()
  const updating = useAppSelector((state) => state.cars.updating)

  const [form, setForm] = useState<FormState>(() => toForm(car))
  const [errors, setErrors] = useState<FormErrors>({})
  const [failedAttempts, setFailedAttempts] = useState(0)
  const [noChanges, setNoChanges] = useState(false)
  const [review, setReview] = useState<CarChangeRecord[] | null>(null)
  const [saveFailed, setSaveFailed] = useState(false)
  const [confirmDiscard, setConfirmDiscard] = useState(false)

  const headingRef = useRef<HTMLHeadingElement>(null)
  const summaryRef = useRef<HTMLDivElement>(null)

  const isDirty = getChangedFields(car, form).length > 0
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) => isDirty && currentLocation.pathname !== nextLocation.pathname
  )

  useEffect(() => {
    headingRef.current?.focus()
  }, [])

  useEffect(() => {
    if (failedAttempts > 0) summaryRef.current?.focus()
  }, [failedAttempts])

  // Also warn on tab close or reload, which the router can't intercept.
  useEffect(() => {
    if (!isDirty) return
    const warn = (e: BeforeUnloadEvent) => e.preventDefault()
    window.addEventListener('beforeunload', warn)
    return () => window.removeEventListener('beforeunload', warn)
  }, [isDirty])

  const setValue = (name: FieldName, value: string) => {
    setForm((current) => ({ ...current, [name]: value }))
    setErrors((current) => ({ ...current, [name]: undefined }))
    setNoChanges(false)
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    const nextErrors = validateForm(form)
    setErrors(nextErrors)

    if (Object.keys(nextErrors).length > 0) {
      setFailedAttempts((count) => count + 1)
      return
    }

    const changed = getChangedFields(car, form)
    if (changed.length === 0) {
      setNoChanges(true)
      return
    }
    setSaveFailed(false)
    setReview(changed)
  }

  const handleSave = () => {
    setSaveFailed(false)
    dispatch(updateCar({ id: car.id, changes: toChanges(form) }))
      .unwrap()
      .then(onSaved)
      .catch(() => setSaveFailed(true))
  }

  const handleCancel = () => {
    if (isDirty) setConfirmDiscard(true)
    else onCancel()
  }

  const errorList = (Object.entries(errors) as [FieldName, string | undefined][]).filter(([, message]) => message)

  return (
    <Card className="space-y-8">
      <div className="space-y-4">
        <h1 ref={headingRef} tabIndex={-1} className="outline-none">
          แก้ไขข้อมูล {car.brand} {car.name}
        </h1>
        <p className="text-lg font-semibold">ทะเบียน {car.licensePlate}</p>
      </div>

      {failedAttempts > 0 && errorList.length > 0 && (
        <div
          ref={summaryRef}
          tabIndex={-1}
          role="alert"
          className="rounded-xl border border-red-200 bg-red-50 p-6 text-red-700"
        >
          <p className="flex items-start gap-3 font-semibold">
            <CircleAlert aria-hidden="true" className="mt-1 h-6 w-6 shrink-0" />
            ยังบันทึกไม่ได้ กรุณาแก้ไข {errorList.length} รายการนี้
          </p>
          <ul className="mt-2 space-y-2">
            {errorList.map(([name, message]) => (
              <li key={name}>
                <a
                  href={`#${fieldId(name)}`}
                  className="inline-block min-h-12 py-2 underline underline-offset-4"
                  onClick={(e) => {
                    e.preventDefault()
                    document.getElementById(fieldId(name))?.focus()
                  }}
                >
                  {fieldLabels[name]}: {message}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate className="space-y-12">
        {formSections.map((section) => (
          <section key={section.title} className="space-y-6">
            <h2 className="border-b border-slate-200 pb-2">{section.title}</h2>
            <div className="grid gap-6 md:grid-cols-2">
              {section.fields.map(({ name, kind }) => (
                <Field
                  key={name}
                  id={fieldId(name)}
                  label={fieldLabels[name]}
                  value={form[name]}
                  type={kind === 'date' ? 'date' : 'text'}
                  inputMode={kind === 'mileage' ? 'numeric' : undefined}
                  hint={kind === 'mileage' ? 'กรอกเป็นกิโลเมตร เช่น 48000' : undefined}
                  note={
                    kind === 'date' && form[name] ? `วันที่เลือก: ${formatDate(form[name])}` : undefined
                  }
                  error={errors[name]}
                  onChange={(e) => setValue(name, e.target.value)}
                  onBlur={() => setErrors((current) => ({ ...current, [name]: validateField(name, form) }))}
                />
              ))}
            </div>

            {section.title === 'ข้อมูลรถ' && (
              <div className="max-w-[36rem] space-y-4">
                <Field
                  id={fieldId('imageUrl')}
                  label={fieldLabels.imageUrl}
                  type="url"
                  value={form.imageUrl}
                  hint="อัปโหลดรูปใน Google Drive ตั้งค่าแชร์เป็น “ทุกคนที่มีลิงก์” คัดลอกลิงก์ แล้ววางที่นี่"
                  onChange={(e) => setValue('imageUrl', e.target.value)}
                  onBlur={(e) => setValue('imageUrl', toDriveDirectImageUrl(e.target.value))}
                />
                {driveFolderUrl && (
                  <a
                    href={driveFolderUrl}
                    target="_blank"
                    rel="noreferrer"
                    className={buttonClasses('secondary')}
                  >
                    <ExternalLink aria-hidden="true" className="h-6 w-6" />
                    เปิด Google Drive
                  </a>
                )}
                {form.imageUrl && (
                  <CarImage
                    src={form.imageUrl}
                    alt="ตัวอย่างรูปรถ"
                    className="aspect-[4/3] w-full max-w-[20rem]"
                  />
                )}
              </div>
            )}
          </section>
        ))}

        {noChanges && (
          <p role="status" className="font-medium">
            ยังไม่มีข้อมูลที่เปลี่ยนแปลง จึงไม่ต้องบันทึก
          </p>
        )}

        <div className="flex flex-wrap gap-4 border-t border-slate-200 pt-6">
          <Button type="submit">
            <Save aria-hidden="true" className="h-6 w-6" />
            ตรวจสอบก่อนบันทึก
          </Button>
          <Button variant="secondary" onClick={handleCancel}>
            ยกเลิก
          </Button>
        </div>
      </form>

      {review && (
        <ConfirmDialog
          title="ตรวจสอบการเปลี่ยนแปลง"
          confirmLabel="ยืนยันการบันทึก"
          cancelLabel="กลับไปแก้ไข"
          loadingText="กำลังบันทึก…"
          isLoading={updating}
          onConfirm={handleSave}
          onCancel={() => setReview(null)}
        >
          <p>กรุณาตรวจสอบ {review.length} รายการนี้ก่อนบันทึก</p>
          <ul className="mt-4">
            {review.map((change) => (
              <li key={change.field} className="border-b border-slate-200 py-3">
                <p className="font-semibold">{fieldLabels[change.field as FieldName]}</p>
                <p className="text-slate-600">จาก {formatFieldValue(change.field, change.oldValue)}</p>
                <p>เป็น {formatFieldValue(change.field, change.newValue)}</p>
              </li>
            ))}
          </ul>
          {saveFailed && (
            <div className="mt-4">
              <ErrorMessage message="บันทึกไม่สำเร็จ ข้อมูลที่แก้ไขยังอยู่ครบ กรุณาตรวจสอบอินเทอร์เน็ตแล้วกดยืนยันอีกครั้ง" />
            </div>
          )}
        </ConfirmDialog>
      )}

      {(confirmDiscard || blocker.state === 'blocked') && (
        <ConfirmDialog
          title="ทิ้งข้อมูลที่แก้ไขไว้ใช่ไหม"
          confirmLabel="ทิ้งข้อมูลที่แก้ไข"
          cancelLabel="กลับไปแก้ไขต่อ"
          onConfirm={() => {
            setConfirmDiscard(false)
            if (blocker.state === 'blocked') blocker.proceed()
            else onCancel()
          }}
          onCancel={() => {
            setConfirmDiscard(false)
            if (blocker.state === 'blocked') blocker.reset()
          }}
        >
          <p>ข้อมูลที่แก้ไขไว้ยังไม่ได้บันทึก ถ้าออกตอนนี้ข้อมูลเหล่านี้จะหายไป</p>
        </ConfirmDialog>
      )}
    </Card>
  )
}
