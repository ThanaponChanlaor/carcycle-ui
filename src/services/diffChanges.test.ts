import { describe, expect, it } from 'vitest'
import { diffChanges } from '@/services/diffChanges'
import { seedCar } from '@/test/fixtures'

describe('diffChanges', () => {
  it('ignores a value equal to the stored one', () => {
    expect(diffChanges(seedCar, { name: 'Camry' })).toEqual([])
  })

  it('ignores a mileage number equal to the stored number', () => {
    expect(diffChanges(seedCar, { lastTireChangeMileage: 35000 })).toEqual([])
  })

  it('treats a missing imageUrl and an empty one as the same', () => {
    expect(diffChanges({ ...seedCar, imageUrl: undefined }, { imageUrl: '' })).toEqual([])
  })

  it('records real changes and skips undefined fields', () => {
    expect(diffChanges(seedCar, { color: 'Black', name: undefined })).toEqual([
      { field: 'color', oldValue: 'White Pearl', newValue: 'Black' },
    ])
  })
})
