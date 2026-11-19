import { onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'
import { getAdminAuth } from '@/services/firebaseClient'
import { dataSource } from '@/services/endpoints'

// Firestore (production) checks the password with Firebase Auth, so Firestore rules can
// require request.auth for writes. Mock and api modes are local dev only and keep the
// simple VITE_ADMIN_PASSWORD compare.
const usesFirebase = () => dataSource === 'firestore'

const WRONG_PASSWORD = new Set(['auth/invalid-credential', 'auth/wrong-password'])

/** true = signed in, false = wrong password. Other failures (network, rate limit) throw. */
export async function signInAdmin(password: string): Promise<boolean> {
  if (!usesFirebase()) return password === import.meta.env.VITE_ADMIN_PASSWORD
  try {
    await signInWithEmailAndPassword(getAdminAuth(), import.meta.env.VITE_ADMIN_EMAIL, password)
    return true
  } catch (error) {
    if (WRONG_PASSWORD.has((error as { code?: string }).code ?? '')) return false
    throw error
  }
}

export async function signOutAdmin(): Promise<void> {
  if (usesFirebase()) await signOut(getAdminAuth())
}

/** Calls onChange with the Firebase session state; returns an unsubscribe function. */
export function watchAdmin(onChange: (isAdmin: boolean) => void): () => void {
  if (!usesFirebase()) return () => {}
  return onAuthStateChanged(getAdminAuth(), (user) => onChange(user !== null))
}
