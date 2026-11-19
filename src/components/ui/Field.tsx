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
      <label htmlFor={id} className="block font-semibold text-slate-700">
        {label}
      </label>
      {hint && (
        <p id={hintId} className="text-slate-600">
          {hint}
        </p>
      )}
      <input
        ref={ref}
        id={id}
        aria-invalid={error ? true : undefined}
        aria-describedby={describedBy}
        className={`mt-2 block min-h-13 w-full rounded-lg border bg-white px-4 py-2 text-base text-slate-900 placeholder:text-slate-600 ${
          error ? 'border-red-700' : 'border-slate-500'
        }`}
        {...inputProps}
      />
      {note && (
        <p id={noteId} className="mt-1 text-slate-600">
          {note}
        </p>
      )}
      {error && (
        <p id={errorId} className="mt-2 flex items-start gap-2 font-medium text-red-700">
          <CircleAlert aria-hidden="true" className="mt-1 h-6 w-6 shrink-0" />
          <span>{error}</span>
        </p>
      )}
    </div>
  )
}
