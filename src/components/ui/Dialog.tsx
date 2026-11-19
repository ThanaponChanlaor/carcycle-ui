import { useId, useLayoutEffect, useRef, type ReactNode } from 'react'

interface DialogProps {
  title: string
  onClose: () => void
  children: ReactNode
}

// Native <dialog> gives the focus trap, Esc to close and focus return for free,
// and sits in the top layer so no parent can clip or reposition it. Focus starts on
// the title so long content reads from the top and a stray Enter confirms nothing;
// mark a child with data-autofocus to start there instead.
export default function Dialog({ title, onClose, children }: DialogProps) {
  const ref = useRef<HTMLDialogElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const titleId = useId()

  useLayoutEffect(() => {
    const dialog = ref.current
    if (dialog && !dialog.open) {
      dialog.showModal()
      const target = dialog.querySelector<HTMLElement>('[data-autofocus]') ?? titleRef.current
      target?.focus()
    }
    return () => dialog?.close()
  }, [])

  return (
    <dialog
      ref={ref}
      aria-labelledby={titleId}
      onCancel={(e) => {
        e.preventDefault()
        onClose()
      }}
      className="m-auto max-h-[calc(100dvh-2rem)] w-[calc(100%-2rem)] max-w-[36rem] overflow-y-auto rounded-xl border border-slate-200 bg-white p-6 text-slate-900 shadow-xl backdrop:bg-slate-900/60 sm:p-8"
    >
      <h2 ref={titleRef} id={titleId} tabIndex={-1} className="outline-none">
        {title}
      </h2>
      <div className="mt-4">{children}</div>
    </dialog>
  )
}
