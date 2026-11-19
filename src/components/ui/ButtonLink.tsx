import { Link, type LinkProps } from 'react-router-dom'
import { buttonClasses, type ButtonVariant } from '@/components/ui/buttonStyles'

interface ButtonLinkProps extends LinkProps {
  variant?: ButtonVariant
}

export default function ButtonLink({ variant = 'primary', className = '', ...props }: ButtonLinkProps) {
  return <Link className={`${buttonClasses(variant)} ${className}`} {...props} />
}
