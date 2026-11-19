import type { Car } from '@/types'

// car-001 from src/services/mockData.ts, frozen in time for tests.
export const seedCar: Car = {
  id: 'car-001',
  name: 'Camry',
  brand: 'Toyota',
  color: 'White Pearl',
  licensePlate: 'กข 1234 กรุงเทพมหานคร',
  insuranceRenewalDate: '2027-03-15',
  insuranceProvider: 'วิริยะประกันภัย ชั้น 1',
  actInsuranceRenewalDate: '2027-01-10',
  lastGearOilChangeMileage: 40000,
  lastGearOilChangeDate: '2026-02-10',
  lastEngineOilChangeMileage: 48000,
  lastEngineOilChangeDate: '2026-06-20',
  lastBrakeOilChangeDate: '2026-05-10',
  lastTireChangeMileage: 35000,
  lastTireChangeDate: '2026-01-20',
  createdAt: '2025-05-01T02:00:00.000Z',
  updatedAt: '2026-06-20T04:30:00.000Z',
}
