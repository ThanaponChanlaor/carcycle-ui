import { type ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  hover?: boolean
}

export default function Card({ children, className = '', hover = false }: CardProps) {
  return (
    <div
      className={`rounded-xl border border-slate-200 bg-white p-6 shadow-sm ${hover ? 'transition-shadow hover:shadow-md' : ''} ${className}`}
    >
      {children}
    </div>
  )
}
