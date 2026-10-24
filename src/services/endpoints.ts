import { mockGetCarById, mockGetCarHistory, mockGetCars, mockUpdateCar } from '@/services/mockData'
import {
  firestoreGetCarById,
  firestoreGetCarHistory,
  firestoreGetCars,
  firestoreUpdateCar,
} from '@/services/firestoreData'
import { apiGetCarById, apiGetCarHistory, apiGetCars, apiUpdateCar } from '@/services/apiData'
import type { CarUpdateInput } from '@/types'

// Pick the data source with VITE_DATA_SOURCE in .env: "mock" (default),
// "firestore", or "api" (CarCycleService at VITE_API_BASE_URL). The older
// VITE_USE_MOCK_DATA=false still means Firestore when VITE_DATA_SOURCE is unset.
type DataSource = 'mock' | 'firestore' | 'api'

const dataSource: DataSource =
  (import.meta.env.VITE_DATA_SOURCE as DataSource | undefined) ||
  (import.meta.env.VITE_USE_MOCK_DATA === 'false' ? 'firestore' : 'mock')

const firestoreCarsApi = {
  getAll: () => firestoreGetCars(),
  getById: (id: string) => firestoreGetCarById(id),
  getHistory: (id: string) => firestoreGetCarHistory(id),
  update: (id: string, changes: CarUpdateInput) => firestoreUpdateCar(id, changes),
}

const mockCarsApi = {
  getAll: () => mockGetCars(),
  getById: (id: string) => mockGetCarById(id),
  getHistory: (id: string) => mockGetCarHistory(id),
  update: (id: string, changes: CarUpdateInput) => mockUpdateCar(id, changes),
}

const httpCarsApi = {
  getAll: () => apiGetCars(),
  getById: (id: string) => apiGetCarById(id),
  getHistory: (id: string) => apiGetCarHistory(id),
  update: (id: string, changes: CarUpdateInput) => apiUpdateCar(id, changes),
}

export const carsApi = { mock: mockCarsApi, firestore: firestoreCarsApi, api: httpCarsApi }[dataSource] ?? mockCarsApi
