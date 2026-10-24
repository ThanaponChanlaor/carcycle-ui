import type { Car, CarHistoryEntry, CarUpdateInput } from '@/types'

const now = () => new Date().toISOString()

const seedCars: Car[] = [
  {
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
  },
  {
    id: 'car-002',
    name: 'CR-V',
    brand: 'Honda',
    color: 'Modern Steel',
    licensePlate: 'ขค 5678 นนทบุรี',
    insuranceRenewalDate: '2026-08-20',
    insuranceProvider: 'กรุงเทพประกันภัย ชั้น 1',
    actInsuranceRenewalDate: '2026-08-05',
    lastGearOilChangeMileage: 55000,
    lastGearOilChangeDate: '2025-11-05',
    lastEngineOilChangeMileage: 62000,
    lastEngineOilChangeDate: '2026-05-12',
    lastBrakeOilChangeDate: '2025-09-15',
    lastTireChangeMileage: 50000,
    lastTireChangeDate: '2025-10-01',
    createdAt: '2025-04-18T02:00:00.000Z',
    updatedAt: '2026-07-20T07:15:00.000Z',
  },
  {
    id: 'car-003',
    name: 'Ranger',
    brand: 'Ford',
    color: 'Race Red',
    licensePlate: 'คง 9012 ชลบุรี',
    insuranceRenewalDate: '2027-06-01',
    insuranceProvider: 'เมืองไทยประกันภัย ชั้น 1',
    actInsuranceRenewalDate: '2027-05-01',
    lastGearOilChangeMileage: 15000,
    lastGearOilChangeDate: '2026-04-01',
    lastEngineOilChangeMileage: 18000,
    lastEngineOilChangeDate: '2026-07-01',
    lastBrakeOilChangeDate: '2026-07-05',
    lastTireChangeMileage: 10000,
    lastTireChangeDate: '2026-05-01',
    createdAt: '2026-02-05T02:00:00.000Z',
    updatedAt: '2026-07-01T02:00:00.000Z',
  },
  {
    id: 'car-004',
    name: 'CX-5',
    brand: 'Mazda',
    color: 'Soul Red Crystal',
    licensePlate: 'งจ 3456 เชียงใหม่',
    insuranceRenewalDate: '2026-09-10',
    insuranceProvider: 'ทิพยประกันภัย ชั้น 2+',
    actInsuranceRenewalDate: '2026-09-01',
    lastGearOilChangeMileage: 78000,
    lastGearOilChangeDate: '2025-12-15',
    lastEngineOilChangeMileage: 95000,
    lastEngineOilChangeDate: '2026-06-30',
    lastBrakeOilChangeDate: '2025-08-20',
    lastTireChangeMileage: 70000,
    lastTireChangeDate: '2025-11-01',
    createdAt: '2024-03-10T02:00:00.000Z',
    updatedAt: '2026-07-25T09:00:00.000Z',
  },
  {
    id: 'car-005',
    name: 'Seltos',
    brand: 'Kia',
    color: 'Gravity Gray',
    licensePlate: 'จฉ 7890 ปทุมธานี',
    insuranceRenewalDate: '2027-02-14',
    insuranceProvider: 'สินมั่นคงประกันภัย ชั้น 1',
    actInsuranceRenewalDate: '2027-01-20',
    lastGearOilChangeMileage: 20000,
    lastGearOilChangeDate: '2026-03-01',
    lastEngineOilChangeMileage: 24000,
    lastEngineOilChangeDate: '2026-06-10',
    lastBrakeOilChangeDate: '2026-04-01',
    lastTireChangeMileage: 18000,
    lastTireChangeDate: '2026-02-15',
    createdAt: '2025-06-01T02:00:00.000Z',
    updatedAt: '2026-07-10T05:00:00.000Z',
  },
  {
    id: 'car-006',
    name: 'D-Max',
    brand: 'Isuzu',
    color: 'Silver Metallic',
    licensePlate: 'ฉช 2345 สมุทรปราการ',
    insuranceRenewalDate: '2027-07-01',
    insuranceProvider: 'แอกซ่าประกันภัย ชั้น 1',
    actInsuranceRenewalDate: '2027-06-15',
    lastGearOilChangeMileage: 60000,
    lastGearOilChangeDate: '2026-01-20',
    lastEngineOilChangeMileage: 65000,
    lastEngineOilChangeDate: '2026-07-10',
    lastBrakeOilChangeDate: '2026-06-01',
    lastTireChangeMileage: 55000,
    lastTireChangeDate: '2025-12-01',
    createdAt: '2025-07-15T02:00:00.000Z',
    updatedAt: '2026-07-15T02:00:00.000Z',
  },
  {
    id: 'car-007',
    name: 'Tucson',
    brand: 'Hyundai',
    color: 'Amazon Gray',
    licensePlate: 'ชซ 6789 ขอนแก่น',
    insuranceRenewalDate: '2026-08-10',
    insuranceProvider: 'ธนชาตประกันภัย ชั้น 2+',
    actInsuranceRenewalDate: '2026-08-01',
    lastGearOilChangeMileage: 42000,
    lastGearOilChangeDate: '2025-10-05',
    lastEngineOilChangeMileage: 50000,
    lastEngineOilChangeDate: '2026-04-25',
    lastBrakeOilChangeDate: '2025-10-10',
    lastTireChangeMileage: 38000,
    lastTireChangeDate: '2025-09-20',
    createdAt: '2024-04-02T02:00:00.000Z',
    updatedAt: '2026-04-25T06:45:00.000Z',
  },
  {
    id: 'car-008',
    name: 'C300',
    brand: 'Mercedes-Benz',
    color: 'Obsidian Black',
    licensePlate: 'ซฌ 0123 ภูเก็ต',
    insuranceRenewalDate: '2027-04-05',
    insuranceProvider: 'อลิอันซ์ อยุธยา ชั้น 1',
    actInsuranceRenewalDate: '2027-03-01',
    lastGearOilChangeMileage: 12000,
    lastGearOilChangeDate: '2026-03-20',
    lastEngineOilChangeMileage: 14000,
    lastEngineOilChangeDate: '2026-06-05',
    lastBrakeOilChangeDate: '2026-03-15',
    lastTireChangeMileage: 8000,
    lastTireChangeDate: '2026-04-10',
    createdAt: '2025-06-20T02:00:00.000Z',
    updatedAt: '2026-06-05T03:00:00.000Z',
  },
]

const seedHistory: CarHistoryEntry[] = [
  {
    id: 'hist-001',
    carId: 'car-001',
    changedAt: '2026-06-20T04:30:00.000Z',
    changedBy: 'ช่างบริการ - สมชาย',
    changes: [
      { field: 'lastEngineOilChangeMileage', oldValue: '40000', newValue: '48000' },
      { field: 'lastEngineOilChangeDate', oldValue: '2026-01-15', newValue: '2026-06-20' },
    ],
    note: 'เปลี่ยนน้ำมันเครื่องตามกำหนด',
  },
  {
    id: 'hist-002',
    carId: 'car-002',
    changedAt: '2026-07-20T07:15:00.000Z',
    changedBy: 'ฝ่ายธุรการ - นภา',
    changes: [
      { field: 'insuranceRenewalDate', oldValue: '2025-08-20', newValue: '2026-08-20' },
      { field: 'insuranceProvider', oldValue: 'วิริยะประกันภัย ชั้น 1', newValue: 'กรุงเทพประกันภัย ชั้น 1' },
    ],
    note: 'เปลี่ยนบริษัทประกันเมื่อต่ออายุ',
  },
  {
    id: 'hist-003',
    carId: 'car-002',
    changedAt: '2025-11-05T01:00:00.000Z',
    changedBy: 'ช่างบริการ - วิชัย',
    changes: [
      { field: 'lastGearOilChangeMileage', oldValue: '48000', newValue: '55000' },
      { field: 'lastGearOilChangeDate', oldValue: '2025-05-01', newValue: '2025-11-05' },
    ],
  },
  {
    id: 'hist-004',
    carId: 'car-004',
    changedAt: '2026-07-25T09:00:00.000Z',
    changedBy: 'ฝ่ายธุรการ - นภา',
    changes: [{ field: 'actInsuranceRenewalDate', oldValue: '2025-09-01', newValue: '2026-09-01' }],
  },
  {
    id: 'hist-005',
    carId: 'car-007',
    changedAt: '2026-04-25T06:45:00.000Z',
    changedBy: 'ช่างบริการ - สมชาย',
    changes: [
      { field: 'lastEngineOilChangeMileage', oldValue: '44000', newValue: '50000' },
      { field: 'lastEngineOilChangeDate', oldValue: '2025-11-01', newValue: '2026-04-25' },
    ],
  },
  {
    id: 'hist-006',
    carId: 'car-005',
    changedAt: '2026-07-10T05:00:00.000Z',
    changedBy: 'ฝ่ายธุรการ - นภา',
    changes: [{ field: 'insuranceRenewalDate', oldValue: '2026-02-14', newValue: '2027-02-14' }],
  },
]

const cars: Car[] = seedCars.map((car) => ({ ...car }))
let history: CarHistoryEntry[] = seedHistory.map((entry) => ({ ...entry }))

const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms))

export async function mockGetCars(): Promise<{ data: Car[] }> {
  await delay()
  return { data: cars }
}

export async function mockGetCarById(id: string): Promise<{ data: Car }> {
  await delay()
  const car = cars.find((item) => item.id === id)
  if (!car) {
    return Promise.reject({ message: `Car "${id}" was not found`, status: 404 })
  }
  return { data: car }
}

export async function mockGetCarHistory(carId: string): Promise<{ data: CarHistoryEntry[] }> {
  await delay()
  const entries = history
    .filter((entry) => entry.carId === carId)
    .sort((a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime())
  return { data: entries }
}

export async function mockUpdateCar(id: string, changes: CarUpdateInput): Promise<{ data: Car }> {
  await delay()
  const index = cars.findIndex((item) => item.id === id)
  if (index === -1) {
    return Promise.reject({ message: `Car "${id}" was not found`, status: 404 })
  }

  const current = cars[index]
  const fields = Object.keys(changes) as (keyof CarUpdateInput)[]
  const changeRecords = fields
    .filter((field) => changes[field] !== undefined && String(changes[field]) !== String(current[field] ?? ''))
    .map((field) => ({
      field,
      oldValue: String(current[field] ?? ''),
      newValue: String(changes[field]),
    }))

  const updated: Car = { ...current, ...changes, updatedAt: now() }
  cars[index] = updated

  if (changeRecords.length > 0) {
    history = [
      {
        id: `hist-${Date.now()}`,
        carId: id,
        changedAt: updated.updatedAt,
        changedBy: 'CarCycle Staff',
        changes: changeRecords,
      },
      ...history,
    ]
  }

  return { data: updated }
}
