interface LoadingSpinnerProps {
  label?: string
  className?: string
}

export default function LoadingSpinner({ label = 'กำลังโหลด…', className = '' }: LoadingSpinnerProps) {
  return (
    <div role="status" className={`flex items-center justify-center gap-4 ${className}`}>
      <span
        aria-hidden="true"
        className="h-8 w-8 animate-spin rounded-full border-4 border-primary-100 border-t-primary-600"
      />
      <span>{label}</span>
    </div>
  )
}
