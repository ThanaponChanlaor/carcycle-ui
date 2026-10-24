import {
  addDoc,
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore'
import { db } from '@/services/firebaseClient'
import type { Car, CarChangeRecord, CarHistoryEntry, CarUpdateInput } from '@/types'

const carsCollection = collection(db, 'cars')
const historyCollection = (carId: string) => collection(db, 'cars', carId, 'history')

const now = () => new Date().toISOString()

const notFound = (id: string) => ({ message: `Car "${id}" was not found`, status: 404 })

export async function firestoreGetCars(): Promise<{ data: Car[] }> {
  const snapshot = await getDocs(carsCollection)
  const data = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<Car, 'id'>) }))
  return { data }
}

export async function firestoreGetCarById(id: string): Promise<{ data: Car }> {
  const snapshot = await getDoc(doc(db, 'cars', id))
  if (!snapshot.exists()) {
    return Promise.reject(notFound(id))
  }
  return { data: { id: snapshot.id, ...(snapshot.data() as Omit<Car, 'id'>) } }
}

export async function firestoreGetCarHistory(carId: string): Promise<{ data: CarHistoryEntry[] }> {
  const q = query(historyCollection(carId), orderBy('changedAt', 'desc'))
  const snapshot = await getDocs(q)
  const data = snapshot.docs.map((d) => ({ id: d.id, ...(d.data() as Omit<CarHistoryEntry, 'id'>) }))
  return { data }
}

export async function firestoreUpdateCar(id: string, changes: CarUpdateInput): Promise<{ data: Car }> {
  const ref = doc(db, 'cars', id)
  const snapshot = await getDoc(ref)
  if (!snapshot.exists()) {
    return Promise.reject(notFound(id))
  }

  const current = snapshot.data() as Omit<Car, 'id'>
  const fields = Object.keys(changes) as (keyof CarUpdateInput)[]
  const changeRecords: CarChangeRecord[] = fields
    .filter((field) => changes[field] !== undefined && String(changes[field]) !== String(current[field] ?? ''))
    .map((field) => ({
      field,
      oldValue: String(current[field] ?? ''),
      newValue: String(changes[field]),
    }))

  const updatedAt = now()
  await updateDoc(ref, { ...changes, updatedAt })

  if (changeRecords.length > 0) {
    await addDoc(historyCollection(id), {
      carId: id,
      changedAt: updatedAt,
      changedBy: 'CarCycle Staff',
      changes: changeRecords,
    })
  }

  return { data: { id, ...current, ...changes, updatedAt } as Car }
}
