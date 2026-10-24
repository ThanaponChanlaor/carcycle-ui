import { QRCodeSVG } from 'qrcode.react'

interface QRCodeProps {
  value: string
  size?: number
  className?: string
}

export default function QRCode({ value, size = 168, className = '' }: QRCodeProps) {
  return (
    <div className={`inline-flex rounded-xl border border-slate-200 bg-white p-4 ${className}`}>
      <QRCodeSVG value={value} size={size} />
    </div>
  )
}
