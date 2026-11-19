import { beforeEach, describe, expect, it, vi } from 'vitest'
import { seedCar } from '@/test/fixtures'

const fake = vi.hoisted(() => {
  const fake = {
    batch: { update: vi.fn(), set: vi.fn(), commit: vi.fn() },
    stored: {} as Record<string, unknown>,
    updateDoc: vi.fn(),
    addDoc: vi.fn(),
  }
  // Same fakes for the full SDK and Lite, so the test judges behaviour, not the import path.
  const sdk = () => ({
    collection: (...path: unknown[]) => ({ path }),
    doc: (...path: unknown[]) => ({ path }),
    getDoc: async () => ({ exists: () => true, data: () => fake.stored }),
    getDocs: async () => ({ docs: [] }),
    orderBy: vi.fn(),
    query: vi.fn(),
    updateDoc: fake.updateDoc,
    addDoc: fake.addDoc,
    writeBatch: () => fake.batch,
  })
  return { ...fake, sdk }
})
vi.mock('firebase/firestore', () => fake.sdk())
vi.mock('firebase/firestore/lite', () => fake.sdk())
vi.mock('@/services/firebaseClient', () => ({ db: {} }))

const { firestoreUpdateCar } = await import('@/services/firestoreData')

describe('firestoreUpdateCar', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    const { id: _id, ...car } = seedCar
    void _id
    Object.assign(fake.stored, car)
    fake.batch.commit.mockResolvedValue(undefined)
  })

  it('saves car and history in one commit', async () => {
    const { data } = await firestoreUpdateCar('car-001', { name: 'Corolla' })

    expect(fake.batch.update).toHaveBeenCalledTimes(1)
    expect(fake.batch.set).toHaveBeenCalledTimes(1)
    expect(fake.batch.set.mock.calls[0][1]).toMatchObject({
      carId: 'car-001',
      changedBy: 'CarCycle Staff',
      changes: [{ field: 'name', oldValue: 'Camry', newValue: 'Corolla' }],
    })
    expect(fake.batch.commit).toHaveBeenCalledTimes(1)
    expect(fake.updateDoc).not.toHaveBeenCalled()
    expect(fake.addDoc).not.toHaveBeenCalled()
    expect(data.name).toBe('Corolla')
  })

  it('writes no history when nothing changed', async () => {
    await firestoreUpdateCar('car-001', { name: 'Camry' })

    expect(fake.batch.set).not.toHaveBeenCalled()
    expect(fake.batch.commit).toHaveBeenCalledTimes(1)
  })

  it('rejects when the commit fails', async () => {
    fake.batch.commit.mockRejectedValue(new Error('offline'))

    await expect(firestoreUpdateCar('car-001', { name: 'Corolla' })).rejects.toThrow('offline')
  })
})
