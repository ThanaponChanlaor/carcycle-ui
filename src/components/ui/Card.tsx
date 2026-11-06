import { type ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
}

export default function Card({ children, className = '' }: CardProps) {
  return <div className={`rounded-lg border-2 border-rule bg-surface p-6 ${className}`}>{children}</div>
}
