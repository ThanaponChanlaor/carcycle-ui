export const NO_DATA = 'ไม่มีข้อมูล'

const isValidDate = (date: Date) => !Number.isNaN(date.getTime())

/** 15 มีนาคม 2570 */
export const formatDate = (value: string) => {
  if (!value) return NO_DATA
  const date = new Date(value)
  if (!isValidDate(date)) return value
  return date.toLocaleDateString('th-TH', { day: 'numeric', month: 'long', year: 'numeric' })
}

/** 15 มีนาคม 2570 เวลา 11:30 น. */
export const formatDateTime = (value: string) => {
  const date = new Date(value)
  if (!isValidDate(date)) return value
  const time = date.toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })
  return `${formatDate(value)} เวลา ${time} น.`
}

/** 48,000 กม. */
export const formatMileage = (value: number) => `${value.toLocaleString('th-TH')} กม.`

/** Shows a logged field value the way the rest of the app shows it. */
export const formatFieldValue = (field: string, value: string) => {
  if (!value) return NO_DATA
  if (field.endsWith('Date')) return formatDate(value)
  if (field.endsWith('Mileage')) {
    const mileage = Number(value.replace(/,/g, ''))
    return Number.isNaN(mileage) ? value : formatMileage(mileage)
  }
  return value
}
