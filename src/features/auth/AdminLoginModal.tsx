import { useState, type FormEvent } from 'react'
import { useAppDispatch } from '@/app/hooks'
import { setRole } from '@/features/auth/authSlice'
import Card from '@/components/ui/Card'
import Button from '@/components/ui/Button'
import ErrorMessage from '@/components/ui/ErrorMessage'

interface AdminLoginModalProps {
  onClose: () => void
}

export default function AdminLoginModal({ onClose }: AdminLoginModalProps) {
  const dispatch = useAppDispatch()
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (password === import.meta.env.VITE_ADMIN_PASSWORD) {
      dispatch(setRole('admin'))
      onClose()
    } else {
      setError('รหัสผ่านไม่ถูกต้อง')
    }
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-900/40 p-4">
      <Card className="w-full max-w-sm">
        <h2 className="text-lg font-semibold text-slate-900">เข้าสู่ระบบผู้ดูแล</h2>
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <label className="block text-sm">
            <span className="mb-1 block text-slate-600">รหัสผ่าน</span>
            <input
              type="password"
              autoFocus
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:border-primary-500 focus:outline-none focus:ring-2 focus:ring-primary-200"
            />
          </label>
          {error && <ErrorMessage message={error} />}
          <div className="flex gap-2">
            <Button type="submit" size="sm">
              เข้าสู่ระบบ
            </Button>
            <Button type="button" variant="ghost" size="sm" onClick={onClose}>
              ยกเลิก
            </Button>
          </div>
        </form>
      </Card>
    </div>
  )
}
