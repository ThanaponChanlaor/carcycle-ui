import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import { mockGetCarById, mockGetCars, mockUpdateCar } from '@/services/mockData'

// Redux freezes everything it stores, including whatever the data source returned.
const deepFreeze = <T extends object>(value: T): T => {
  Object.values(value).forEach((v) => v && typeof v === 'object' && deepFreeze(v))
  return Object.freeze(value)
}

const settle = async <T,>(promise: Promise<T>) => {
  await vi.runAllTimersAsync()
  return promise
}

describe('mock data source', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })
  afterEach(() => {
    vi.useRealTimers()
  })

  it('mockUpdateCar works after returned data is frozen', async () => {
    deepFreeze((await settle(mockGetCars())).data)
    deepFreeze((await settle(mockGetCarById('car-001'))).data)

    const { data } = await settle(mockUpdateCar('car-001', { name: 'Corolla' }))
    expect(data.name).toBe('Corolla')
    expect((await settle(mockGetCarById('car-001'))).data.name).toBe('Corolla')
  })
})
