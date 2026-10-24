export type UserRole = 'admin' | 'user'

export interface Car {
  id: string
  name: string // ชื่อรถ
  brand: string // ยี่ห้อรถ
  color: string // สีรถ
  imageUrl?: string // ลิงก์รูปภาพรถ
  licensePlate: string // ทะเบียน
  insuranceRenewalDate: string // วันที่ต่อประกันรถ
  insuranceProvider: string // ประกันรถที่ทำ
  actInsuranceRenewalDate: string // วันที่ต่อ พ.ร.บ.
  lastGearOilChangeMileage: number // จำนวนไมล์ล่าสุดที่เปลี่ยนน้ำมันเกียร์
  lastGearOilChangeDate: string // วันที่เปลี่ยนน้ำมันเกียร์ล่าสุด
  lastEngineOilChangeMileage: number // จำนวนไมล์ล่าสุดที่เปลี่ยนน้ำมันเครื่อง
  lastEngineOilChangeDate: string // วันที่เปลี่ยนน้ำมันเครื่องล่าสุด
  lastBrakeOilChangeDate: string // วันที่เปลี่ยนน้ำมันเบรกล่าสุด (เช็ครอบตามปี)
  lastTireChangeMileage: number // จำนวนไมล์ล่าสุดที่เปลี่ยนยาง (เช็ครอบตามไมล์)
  lastTireChangeDate: string // วันที่เปลี่ยนยางล่าสุด
  createdAt: string
  updatedAt: string
}

export interface CarChangeRecord {
  field: string
  oldValue: string
  newValue: string
}

export interface CarHistoryEntry {
  id: string
  carId: string
  changedAt: string
  changedBy: string
  changes: CarChangeRecord[]
  note?: string
}

export type CarUpdateInput = Partial<Omit<Car, 'id' | 'createdAt' | 'updatedAt'>>

export interface ApiError {
  message: string
  status?: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
}
