import { QRCodeSVG } from 'qrcode.react'

interface QRCodeProps {
  value: string
  size?: number
  className?: string
}

export default function QRCode({ value, size = 200, className = '' }: QRCodeProps) {
  return (
    <div className={`inline-flex rounded-lg border-2 border-rule bg-white p-4 ${className}`}>
      <QRCodeSVG value={value} size={size} title="คิวอาร์โค้ดของรถคันนี้" />
    </div>
  )
}
