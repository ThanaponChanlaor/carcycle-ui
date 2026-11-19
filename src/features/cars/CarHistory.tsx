import { useState } from 'react'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { fetchCarHistory } from '@/features/cars/carsSlice'
import { fieldLabels } from '@/features/cars/carFields'
import Button from '@/components/ui/Button'
import ErrorMessage from '@/components/ui/ErrorMessage'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { formatDateTime, formatFieldValue } from '@/utils/format'
import type { CarUpdateInput } from '@/types'

interface CarHistoryProps {
  carId: string
}

export default function CarHistory({ carId }: CarHistoryProps) {
  const dispatch = useAppDispatch()
  const { history, historyLoading } = useAppSelector((state) => state.cars)
  const [isOpen, setIsOpen] = useState(false)
  const [loadFailed, setLoadFailed] = useState(false)

  const loadHistory = () => {
    setLoadFailed(false)
    dispatch(fetchCarHistory(carId))
      .unwrap()
      .catch(() => setLoadFailed(true))
  }

  const handleToggle = () => {
    if (!isOpen) loadHistory()
    setIsOpen((open) => !open)
  }

  const ToggleIcon = isOpen ? ChevronUp : ChevronDown

  return (
    <section aria-labelledby="history-heading" className="print:hidden">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 id="history-heading">ประวัติการแก้ไข</h2>
        <Button variant="secondary" aria-expanded={isOpen} aria-controls="history-panel" onClick={handleToggle}>
          <ToggleIcon aria-hidden="true" className="h-6 w-6" />
          {isOpen ? 'ซ่อนประวัติ' : 'ดูประวัติ'}
        </Button>
      </div>

      <div id="history-panel" hidden={!isOpen} className="mt-4">
        {historyLoading && <LoadingSpinner label="กำลังโหลดประวัติ…" className="py-6" />}
        {!historyLoading && loadFailed && (
          <ErrorMessage
            message="โหลดประวัติการแก้ไขไม่สำเร็จ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองอีกครั้ง"
            onRetry={loadHistory}
          />
        )}
        {!historyLoading && !loadFailed && history.length === 0 && <p>ยังไม่มีประวัติการแก้ไข</p>}
        {!historyLoading && !loadFailed && history.length > 0 && (
          <ol>
            {history.map((entry) => (
              <li key={entry.id} className="border-b border-slate-200 py-4">
                <p className="font-semibold">{formatDateTime(entry.changedAt)}</p>
                <p className="text-slate-600">แก้ไขโดย {entry.changedBy}</p>
                <ul className="mt-2 space-y-2">
                  {entry.changes.map((change, i) => (
                    <li key={i}>
                      <span className="font-medium">
                        {fieldLabels[change.field as keyof CarUpdateInput] ?? change.field}
                      </span>
                      {' จาก '}
                      {formatFieldValue(change.field, change.oldValue)}
                      {' เป็น '}
                      {formatFieldValue(change.field, change.newValue)}
                    </li>
                  ))}
                </ul>
                {entry.note && <p className="mt-2 text-slate-600">หมายเหตุ: {entry.note}</p>}
              </li>
            ))}
          </ol>
        )}
      </div>
    </section>
  )
}
