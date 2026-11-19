import { type ButtonHTMLAttributes, type ReactNode } from 'react'
import { buttonClasses, type ButtonVariant } from '@/components/ui/buttonStyles'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  children: ReactNode
  isLoading?: boolean
  loadingText?: string
}

export default function Button({
  variant = 'primary',
  children,
  isLoading = false,
  loadingText = 'กำลังดำเนินการ…',
  className = '',
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={`${buttonClasses(variant)} ${className}`}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span
          aria-hidden="true"
          className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-current border-t-transparent"
        />
      )}
      {isLoading ? loadingText : children}
    </button>
  )
}
