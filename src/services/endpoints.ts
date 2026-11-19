import { mockGetCarById, mockGetCarHistory, mockGetCars, mockUpdateCar } from '@/services/mockData'
import {
  firestoreGetCarById,
  firestoreGetCarHistory,
  firestoreGetCars,
  firestoreUpdateCar,
} from '@/services/firestoreData'
import { apiGetCarById, apiGetCarHistory, apiGetCars, apiUpdateCar } from '@/services/apiData'

// Pick the data source with VITE_DATA_SOURCE in .env: "mock" (default),
// "firestore", or "api" (CarCycleService at VITE_API_BASE_URL).
export type DataSource = 'mock' | 'firestore' | 'api'

export const dataSource: DataSource = import.meta.env.VITE_DATA_SOURCE || 'mock'

const sources = {
  mock: { getAll: mockGetCars, getById: mockGetCarById, getHistory: mockGetCarHistory, update: mockUpdateCar },
  firestore: {
    getAll: firestoreGetCars,
    getById: firestoreGetCarById,
    getHistory: firestoreGetCarHistory,
    update: firestoreUpdateCar,
  },
  api: { getAll: apiGetCars, getById: apiGetCarById, getHistory: apiGetCarHistory, update: apiUpdateCar },
}

export const carsApi = sources[dataSource] ?? sources.mock
