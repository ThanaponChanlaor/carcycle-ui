import { beforeEach, describe, expect, it, vi } from 'vitest'

const mode = vi.hoisted(() => ({ value: 'firestore' }))
vi.mock('@/services/endpoints', () => ({
  get dataSource() {
    return mode.value
  },
}))

const initialRole = async () => {
  vi.resetModules()
  const { default: reducer } = await import('@/features/auth/authSlice')
  return reducer(undefined, { type: '@@init' }).role
}

describe('authSlice starting role', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', { getItem: () => 'admin', setItem: vi.fn() })
  })

  // In firestore mode only the Firebase session (watchAdmin) may make someone admin,
  // so a stale localStorage value must not flash the admin controls.
  it('ignores a stored admin role in firestore mode', async () => {
    mode.value = 'firestore'
    expect(await initialRole()).toBe('user')
  })

  it('keeps the stored role in mock mode', async () => {
    mode.value = 'mock'
    expect(await initialRole()).toBe('admin')
  })
})
