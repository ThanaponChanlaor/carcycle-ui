export type ButtonVariant = 'primary' | 'secondary' | 'quiet'

const base =
  'inline-flex min-h-12 min-w-12 items-center justify-center gap-2 rounded-lg px-5 py-2 text-center text-base font-semibold transition-colors duration-150 disabled:cursor-not-allowed'

const variants: Record<ButtonVariant, string> = {
  primary: 'bg-primary-600 text-white hover:bg-primary-700 disabled:bg-slate-200 disabled:text-slate-600',
  secondary:
    'border-2 border-primary-600 bg-white text-primary-700 hover:bg-primary-50 disabled:border-slate-400 disabled:bg-slate-200 disabled:text-slate-600',
  quiet: 'text-primary-700 underline underline-offset-4 hover:bg-primary-50 disabled:text-slate-600',
}

export const buttonClasses = (variant: ButtonVariant = 'primary') => `${base} ${variants[variant]}`
