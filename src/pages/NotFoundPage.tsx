import { House } from 'lucide-react'
import ButtonLink from '@/components/ui/ButtonLink'

export default function NotFoundPage() {
  return (
    <div className="space-y-6 py-8">
      <title>ไม่พบหน้านี้ - CarCycle</title>
      <h1>ไม่พบหน้านี้</h1>
      <p className="max-w-[40rem]">
        ลิงก์หรือคิวอาร์โค้ดนี้อาจไม่ถูกต้อง กดปุ่มด้านล่างเพื่อกลับไปดูรถทั้งหมด
      </p>
      <ButtonLink to="/">
        <House aria-hidden="true" className="h-6 w-6" />
        กลับหน้าหลัก
      </ButtonLink>
    </div>
  )
}
