import { fieldLabels } from '@/features/cars/carFields'
import type { Car, CarChangeRecord, CarUpdateInput } from '@/types'

export interface FormState {
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

export type FieldName = keyof FormState
export type FormErrors = Partial<Record<FieldName, string>>
type FieldKind = 'text' | 'date' | 'mileage'

interface FieldConfig {
  name: FieldName
  kind: FieldKind
  required?: boolean
}

export const formSections: { title: string; fields: FieldConfig[] }[] = [
  {
    title: 'ข้อมูลรถ',
    fields: [
      { name: 'name', kind: 'text', required: true },
      { name: 'brand', kind: 'text', required: true },
      { name: 'color', kind: 'text' },
      { name: 'licensePlate', kind: 'text', required: true },
    ],
  },
  {
    title: 'ประกันภัย',
    fields: [
      { name: 'insuranceRenewalDate', kind: 'date' },
      { name: 'insuranceProvider', kind: 'text' },
      { name: 'actInsuranceRenewalDate', kind: 'date' },
    ],
  },
  {
    title: 'การบำรุงรักษา',
    fields: [
      { name: 'lastEngineOilChangeMileage', kind: 'mileage', required: true },
      { name: 'lastEngineOilChangeDate', kind: 'date' },
      { name: 'lastGearOilChangeMileage', kind: 'mileage', required: true },
      { name: 'lastGearOilChangeDate', kind: 'date' },
      { name: 'lastBrakeOilChangeDate', kind: 'date' },
      { name: 'lastTireChangeMileage', kind: 'mileage', required: true },
      { name: 'lastTireChangeDate', kind: 'date' },
    ],
  },
]

const allFields = formSections.flatMap((section) => section.fields)

const parseMileage = (value: string) => Number(value.replace(/,/g, ''))

export const toForm = (car: Car): FormState => ({
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

export const toChanges = (form: FormState): CarUpdateInput => ({
  ...form,
  lastGearOilChangeMileage: parseMileage(form.lastGearOilChangeMileage),
  lastEngineOilChangeMileage: parseMileage(form.lastEngineOilChangeMileage),
  lastTireChangeMileage: parseMileage(form.lastTireChangeMileage),
})

export const validateField = (name: FieldName, form: FormState): string | undefined => {
  const config = allFields.find((field) => field.name === name)
  if (!config) return undefined
  const value = form[name].trim()
  if (config.required && !value) return `กรุณากรอก${fieldLabels[name]}`
  if (config.kind === 'mileage' && !/^\d[\d,]*$/.test(value)) {
    return 'กรุณากรอกเฉพาะตัวเลข เช่น 48000'
  }
  return undefined
}

export const validateForm = (form: FormState): FormErrors => {
  const errors: FormErrors = {}
  for (const { name } of allFields) {
    const error = validateField(name, form)
    if (error) errors[name] = error
  }
  return errors
}

/** Fields whose value differs from the saved car, for the review step. */
export const getChangedFields = (car: Car, form: FormState): CarChangeRecord[] => {
  const saved = toForm(car)
  return (Object.keys(form) as FieldName[])
    .filter((name) => {
      const isMileage = name.endsWith('Mileage')
      return isMileage ? parseMileage(form[name]) !== parseMileage(saved[name]) : form[name] !== saved[name]
    })
    .map((name) => ({ field: name, oldValue: saved[name], newValue: form[name] }))
}
