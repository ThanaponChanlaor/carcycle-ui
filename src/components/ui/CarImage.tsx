import { useState } from 'react'

interface CarImageProps {
  src?: string
  alt: string
  className?: string
}

export default function CarImage({ src, alt, className = '' }: CarImageProps) {
  const [failed, setFailed] = useState(false)

  if (!src || failed) {
    return (
      <div className={`flex items-center justify-center rounded-lg bg-slate-100 text-5xl ${className}`}>
        🚗
      </div>
    )
  }

  return (
    <img
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
      className={`rounded-lg bg-slate-100 object-cover ${className}`}
    />
  )
}
