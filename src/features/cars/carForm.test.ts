import { describe, expect, it } from 'vitest'
import { getChangedFields, toChanges, toForm, validateField } from '@/features/cars/carForm'
import { seedCar } from '@/test/fixtures'

describe('carForm', () => {
  it('treats a mileage typed with commas as the same stored number', () => {
    expect(getChangedFields(seedCar, { ...toForm(seedCar), lastEngineOilChangeMileage: '48,000' })).toEqual([])
  })

  it('lists a real change with its old and new value', () => {
    expect(getChangedFields(seedCar, { ...toForm(seedCar), name: 'Corolla' })).toEqual([
      { field: 'name', oldValue: 'Camry', newValue: 'Corolla' },
    ])
  })

  it('saves a comma mileage as a number', () => {
    expect(toChanges({ ...toForm(seedCar), lastTireChangeMileage: '35,500' }).lastTireChangeMileage).toBe(35500)
  })

  it('rejects a mileage that is not a number', () => {
    expect(validateField('lastTireChangeMileage', { ...toForm(seedCar), lastTireChangeMileage: 'abc' })).toBe(
      'กรุณากรอกเฉพาะตัวเลข เช่น 48000'
    )
  })

  it('requires the car name', () => {
    expect(validateField('name', { ...toForm(seedCar), name: '  ' })).toBe('กรุณากรอกชื่อรถ')
  })
})
