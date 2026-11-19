import { useRef, useState, type FormEvent } from 'react'
import { useAppDispatch } from '@/app/hooks'
import { setRole } from '@/features/auth/authSlice'
import { signInAdmin } from '@/services/adminAuth'
import Button from '@/components/ui/Button'
import Dialog from '@/components/ui/Dialog'
import Field from '@/components/ui/Field'

interface AdminLoginModalProps {
  onClose: () => void
}

export default function AdminLoginModal({ onClose }: AdminLoginModalProps) {
  const dispatch = useAppDispatch()
  const passwordRef = useRef<HTMLInputElement>(null)
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    try {
      if (await signInAdmin(password)) {
        dispatch(setRole('admin'))
        onClose()
        return
      }
      setError('รหัสผ่านไม่ถูกต้อง กรุณาตรวจสอบแล้วลองอีกครั้ง')
    } catch {
      setError('เข้าสู่ระบบไม่สำเร็จ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองอีกครั้ง')
    }
    passwordRef.current?.focus()
  }

  return (
    <Dialog title="เข้าสู่ระบบผู้ดูแล" onClose={onClose}>
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
        <Field
          ref={passwordRef}
          id="admin-password"
          label="รหัสผ่าน"
          type="password"
          autoComplete="current-password"
          data-autofocus
          value={password}
          error={error ?? undefined}
          onChange={(e) => {
            setPassword(e.target.value)
            setError(null)
          }}
        />
        <div className="flex flex-wrap gap-4">
          <Button type="submit">เข้าสู่ระบบ</Button>
          <Button variant="secondary" onClick={onClose}>
            ยกเลิก
          </Button>
        </div>
      </form>
    </Dialog>
  )
}
