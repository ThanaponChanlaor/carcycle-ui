import { type InputHTMLAttributes, type ReactNode, type Ref } from 'react'
import { CircleAlert } from 'lucide-react'

interface FieldProps extends InputHTMLAttributes<HTMLInputElement> {
  ref?: Ref<HTMLInputElement>
  id: string
  label: string
  hint?: ReactNode
  error?: string
  /** Shown under the input, for example a date read back in Thai. */
  note?: ReactNode
}

export default function Field({ ref, id, label, hint, error, note, className = '', ...inputProps }: FieldProps) {
  const hintId = `${id}-hint`
  const errorId = `${id}-error`
  const noteId = `${id}-note`
  const describedBy =
    [hint && hintId, error && errorId, note && noteId].filter(Boolean).join(' ') || undefined

  return (
    <div className={className}>
      <label htmlFor={id} className="block font-semibold">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="text-sm text-ink-muted">
          {hint}
        </p>
      )}
      <input
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`mt-2 block min-h-13 w-full rounded-lg border-2 bg-surface px-4 py-2 text-base text-ink ${
          error ? 'border-error' : 'border-border-control'
        }`}
        {...inputProps}
      />
      {note && (
        <p id={noteId} className="mt-1 text-sm text-ink-muted">
          {note}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-2 flex items-start gap-2 font-medium text-error">
          <CircleAlert aria-hidden="true" className="mt-1 h-6 w-6 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}
