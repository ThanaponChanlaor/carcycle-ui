import { beforeEach, describe, expect, it, vi } from 'vitest'

const fake = vi.hoisted(() => ({
  mode: { value: 'firestore' },
  auth: { name: 'auth' },
  signInWithEmailAndPassword: vi.fn(),
  signOut: vi.fn(),
  onAuthStateChanged: vi.fn(),
}))

vi.mock('@/services/endpoints', () => ({
  get dataSource() {
    return fake.mode.value
  },
}))
vi.mock('@/services/firebaseClient', () => ({ db: {}, getAdminAuth: () => fake.auth }))
vi.mock('firebase/auth', () => ({
  signInWithEmailAndPassword: fake.signInWithEmailAndPassword,
  signOut: fake.signOut,
  onAuthStateChanged: fake.onAuthStateChanged,
}))

const { signInAdmin, watchAdmin } = await import('@/services/adminAuth')

describe('adminAuth in firestore mode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fake.mode.value = 'firestore'
    vi.stubEnv('VITE_ADMIN_EMAIL', 'admin@example.com')
  })

  it('signs in with the admin email and the typed password', async () => {
    fake.signInWithEmailAndPassword.mockResolvedValue({ user: {} })

    await expect(signInAdmin('pw')).resolves.toBe(true)
    expect(fake.signInWithEmailAndPassword).toHaveBeenCalledWith(fake.auth, 'admin@example.com', 'pw')
  })

  it('returns false for a wrong password', async () => {
    fake.signInWithEmailAndPassword.mockRejectedValue({ code: 'auth/invalid-credential' })

    await expect(signInAdmin('nope')).resolves.toBe(false)
  })

  it('throws a network error instead of calling it a wrong password', async () => {
    fake.signInWithEmailAndPassword.mockRejectedValue({ code: 'auth/network-request-failed' })

    await expect(signInAdmin('pw')).rejects.toEqual({ code: 'auth/network-request-failed' })
  })

  it('reports not-admin when there is no Firebase session', () => {
    fake.onAuthStateChanged.mockImplementation((_auth, callback: (user: unknown) => void) => {
      callback(null)
      return () => {}
    })
    const onChange = vi.fn()

    watchAdmin(onChange)

    expect(onChange).toHaveBeenCalledWith(false)
  })
})

describe('adminAuth in mock mode', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    fake.mode.value = 'mock'
    vi.stubEnv('VITE_ADMIN_PASSWORD', 'admin123')
  })

  it('compares with VITE_ADMIN_PASSWORD and never calls Firebase', async () => {
    await expect(signInAdmin('admin123')).resolves.toBe(true)
    await expect(signInAdmin('x')).resolves.toBe(false)
    expect(fake.signInWithEmailAndPassword).not.toHaveBeenCalled()
  })

  it('watchAdmin does nothing', () => {
    const onChange = vi.fn()
    watchAdmin(onChange)()
    expect(onChange).not.toHaveBeenCalled()
    expect(fake.onAuthStateChanged).not.toHaveBeenCalled()
  })
})
