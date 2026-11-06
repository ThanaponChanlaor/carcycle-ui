export type ButtonVariant = 'primary' | 'secondary' | 'quiet'

const base =
  'inline-flex min-h-13 min-w-12 items-center justify-center gap-2 rounded-lg px-6 py-2 text-center text-base font-semibold transition-colors duration-150 disabled:cursor-not-allowed'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-hover disabled:bg-disabled-bg disabled:text-ink-muted',
  secondary:
    'border-2 border-primary bg-surface text-primary hover:bg-primary-tint disabled:border-border-control disabled:bg-disabled-bg disabled:text-ink-muted',
  quiet: 'text-primary underline underline-offset-4 hover:bg-primary-tint disabled:text-ink-muted',
}

export const buttonClasses = (variant: ButtonVariant = 'primary') => `${base} ${variants[variant]}`
