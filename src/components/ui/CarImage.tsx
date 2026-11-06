import { useState } from 'react'
import { CarFront } from 'lucide-react'

interface CarImageProps {
  src?: string
  alt: string
  className?: string
}

export default function CarImage({ src, alt, className = '' }: CarImageProps) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-1 rounded-lg bg-tint p-4 text-center text-sm text-ink-muted ${className}`}
      >
        <CarFront aria-hidden="true" className="h-10 w-10" />
        ยังไม่มีรูปภาพ
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setFailed(true)}
      className={`rounded-lg bg-tint object-cover ${className}`}
    />
  )
}
