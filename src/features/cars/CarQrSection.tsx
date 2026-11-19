import { Printer } from 'lucide-react'
import Button from '@/components/ui/Button'
import QRCode from '@/components/ui/QRCode'
import type { Car } from '@/types'

interface CarQrSectionProps {
  car: Car
}

export default function CarQrSection({ car }: CarQrSectionProps) {
  const detailUrl = `${window.location.origin}/cars/${car.id}`

  return (
    <section
      aria-labelledby="qr-heading"
      className="flex flex-col items-center text-center print:gap-4 print:p-12"
    >
      <h2 id="qr-heading" className="print:hidden">
        ป้ายคิวอาร์โค้ด
      </h2>
      <p className="mt-4 print:hidden">สแกนคิวอาร์โค้ดนี้ด้วยมือถือเพื่อเปิดหน้านี้ หรือพิมพ์ติดไว้ที่รถ</p>
      <QRCode value={detailUrl} className="mt-4 print:mt-0" />
      <p className="hidden font-semibold print:block">
        {car.brand} {car.name}
      </p>
      <div className="mt-4 print:hidden">
        <Button variant="secondary" onClick={() => window.print()}>
          <Printer aria-hidden="true" className="h-6 w-6" />
          พิมพ์ป้ายคิวอาร์โค้ด
        </Button>
      </div>
    </section>
  )
}
