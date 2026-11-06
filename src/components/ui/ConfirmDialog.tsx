import { type ReactNode } from 'react'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'

interface ConfirmDialogProps {
  title: string
  children: ReactNode
  confirmLabel: string
  cancelLabel: string
  onConfirm: () => void
  onCancel: () => void
  isLoading?: boolean
  loadingText?: string
}

export default function ConfirmDialog({
  title,
  children,
  confirmLabel,
  cancelLabel,
  onConfirm,
  onCancel,
  isLoading,
  loadingText,
}: ConfirmDialogProps) {
  return (
    <Dialog title={title} onClose={onCancel}>
      {children}
      <div className="mt-6 flex flex-wrap gap-4">
        <Button onClick={onConfirm} isLoading={isLoading} loadingText={loadingText}>
          {confirmLabel}
        </Button>
        <Button variant="secondary" onClick={onCancel} disabled={isLoading}>
          {cancelLabel}
        </Button>
      </div>
    </Dialog>
  )
}
