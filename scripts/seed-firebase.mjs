// One-time helper: writes a single example car into Firestore so the app has
// something to show/edit. Run with: npm run seed:firebase
// Reads Firebase config from .env (same VITE_FIREBASE_* keys the app uses).
import { readFileSync } from 'node:fs'
import { initializeApp } from 'firebase/app'
import { doc, getFirestore, setDoc } from 'firebase/firestore'

function loadDotEnv(path) {
  const env = {}
  let raw
  try {
    raw = readFileSync(path, 'utf8')
  } catch {
    return env
  }
  for (const line of raw.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eq = trimmed.indexOf('=')
    if (eq === -1) continue
    env[trimmed.slice(0, eq).trim()] = trimmed.slice(eq + 1).trim()
  }
  return env
}

const env = loadDotEnv(new URL('../.env', import.meta.url))

const firebaseConfig = {
  apiKey: env.VITE_FIREBASE_API_KEY,
  authDomain: env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.VITE_FIREBASE_APP_ID,
}

if (!firebaseConfig.projectId) {
  console.error('Missing VITE_FIREBASE_* values in .env — fill those in first.')
  process.exit(1)
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

const now = new Date().toISOString()

const exampleCar = {
  name: 'My Car',
  brand: 'Toyota',
  color: 'White',
  imageUrl: '',
  licensePlate: 'กข 1234 กรุงเทพมหานคร',
  insuranceRenewalDate: '2027-01-01',
  insuranceProvider: '',
  actInsuranceRenewalDate: '2027-01-01',
  lastGearOilChangeMileage: 0,
  lastGearOilChangeDate: now.slice(0, 10),
  lastEngineOilChangeMileage: 0,
  lastEngineOilChangeDate: now.slice(0, 10),
  lastBrakeOilChangeDate: now.slice(0, 10),
  lastTireChangeMileage: 0,
  lastTireChangeDate: now.slice(0, 10),
  createdAt: now,
  updatedAt: now,
}

await setDoc(doc(db, 'cars', 'car-001'), exampleCar)
console.log('Seeded 1 car (car-001) into Firestore project:', firebaseConfig.projectId)
console.log('Edit its real details from the app (admin login > edit).')
process.exit(0)
