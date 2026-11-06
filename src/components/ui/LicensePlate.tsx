interface LicensePlateProps {
  plate: string
  size?: 'md' | 'lg'
}

// Display only. "กข 1234 กรุงเทพมหานคร" becomes registration + province; any other
// format stays on one line rather than being guessed at.
const splitPlate = (plate: string) => {
  const parts = plate.trim().split(/\s+/)
  if (parts.length < 3) return { registration: plate.trim(), province: '' }
  return { registration: parts.slice(0, -1).join(' '), province: parts[parts.length - 1] }
}

export default function LicensePlate({ plate, size = 'md' }: LicensePlateProps) {
  const { registration, province } = splitPlate(plate)

  return (
    <p className="inline-block max-w-full rounded-lg border-2 border-ink bg-surface p-1">
      <span className="sr-only">ทะเบียน </span>
      <span className="flex flex-col items-center rounded-md border border-ink px-5 py-1 text-center">
        <span className={`font-bold ${size === 'lg' ? 'text-4xl' : 'text-2xl'}`}>{registration}</span>
        {province && <span className="text-sm font-semibold">{province}</span>}
      </span>
    </p>
  )
}
