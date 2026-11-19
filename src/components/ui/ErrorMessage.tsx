import { CircleAlert, RotateCw } from 'lucide-react'
import Button from '@/components/ui/Button'

interface ErrorMessageProps {
  message: string
  onRetry?: () => void
}

export default function ErrorMessage({ message, onRetry }: ErrorMessageProps) {
  return (
    <div role="alert" className="rounded-xl border border-red-200 bg-red-50 p-6">
      <p className="flex items-start gap-3 font-semibold text-red-700">
        <CircleAlert aria-hidden="true" className="mt-1 h-6 w-6 shrink-0" />
        <span>{message}</span>
      </p>
      {onRetry && (
        <Button variant="secondary" onClick={onRetry} className="mt-4">
          <RotateCw aria-hidden="true" className="h-6 w-6" />
          ลองอีกครั้ง
        </Button>
      )}
    </div>
  )
}
