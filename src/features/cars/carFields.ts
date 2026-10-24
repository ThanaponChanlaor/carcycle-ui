import type { CarUpdateInput } from '@/types'

export const fieldLabels: Record<keyof CarUpdateInput, string> = {
  name: 'ชื่อรถ',
  brand: 'ยี่ห้อรถ',
  color: 'สีรถ',
  imageUrl: 'รูปภาพ (URL)',
  licensePlate: 'ทะเบียน',
  insuranceRenewalDate: 'วันที่ต่อประกันรถ',
  insuranceProvider: 'ประกันรถที่ทำ',
  actInsuranceRenewalDate: 'วันที่ต่อ พ.ร.บ.',
  lastGearOilChangeMileage: 'เลขไมล์ล่าสุดที่เปลี่ยนน้ำมันเกียร์',
  lastGearOilChangeDate: 'วันที่เปลี่ยนน้ำมันเกียร์ล่าสุด',
  lastEngineOilChangeMileage: 'เลขไมล์ล่าสุดที่เปลี่ยนน้ำมันเครื่อง',
  lastEngineOilChangeDate: 'วันที่เปลี่ยนน้ำมันเครื่องล่าสุด',
  lastBrakeOilChangeDate: 'วันที่เปลี่ยนน้ำมันเบรกล่าสุด',
  lastTireChangeMileage: 'เลขไมล์ล่าสุดที่เปลี่ยนยาง',
  lastTireChangeDate: 'วันที่เปลี่ยนยางล่าสุด',
}
