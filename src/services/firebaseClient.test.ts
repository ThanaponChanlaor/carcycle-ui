import { expect, it, vi } from 'vitest'

const getAuth = vi.hoisted(() => vi.fn(() => ({ name: 'auth' })))
vi.mock('firebase/app', () => ({ initializeApp: () => ({}) }))
vi.mock('firebase/firestore/lite', () => ({ getFirestore: () => ({}) }))
vi.mock('firebase/auth', () => ({ getAuth }))

// Mock and api builds have no Firebase config; getAuth throws auth/invalid-api-key without one,
// which blanked the whole app. Auth must start only when something asks for it.
it('does not start Firebase Auth on import', async () => {
  const client = await import('@/services/firebaseClient')
  expect(getAuth).not.toHaveBeenCalled()

  expect(client.getAdminAuth()).toEqual({ name: 'auth' })
  expect(getAuth).toHaveBeenCalledTimes(1)
})
