import type { Car, CarHistoryEntry, CarUpdateInput } from '@/types'

// Talks to CarCycleService (Go). Same `{ data }` / `{ message, status }`
// shape as mockData.ts and firestoreData.ts so callers don't care which
// source is active.
const baseUrl = (import.meta.env.VITE_API_BASE_URL ?? '').replace(/\/+$/, '')

async function request<T>(path: string, init?: RequestInit): Promise<{ data: T }> {
  let response: Response
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    })
  } catch {
    return Promise.reject({ message: 'Could not reach the CarCycle API', status: 0 })
  }

  const body = await response.json().catch(() => null)
  if (!response.ok) {
    return Promise.reject({
      message: body?.message ?? `Request failed (${response.status})`,
      status: response.status,
    })
  }
  return { data: body as T }
}

export function apiGetCars(): Promise<{ data: Car[] }> {
  return request<Car[]>('/cars')
}

export function apiGetCarById(id: string): Promise<{ data: Car }> {
  return request<Car>(`/cars/${encodeURIComponent(id)}`)
}

export function apiGetCarHistory(carId: string): Promise<{ data: CarHistoryEntry[] }> {
  return request<CarHistoryEntry[]>(`/cars/${encodeURIComponent(carId)}/history`)
}

export function apiUpdateCar(id: string, changes: CarUpdateInput): Promise<{ data: Car }> {
  return request<Car>(`/cars/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(changes),
  })
}
