import Card from '@/components/ui/Card'

const structure = [
  {
    folder: 'src/app/',
    desc: 'Redux store configuration and typed hooks (useAppDispatch, useAppSelector)',
  },
  {
    folder: 'src/services/',
    desc: 'Firebase client, mock data, and API endpoint functions (mock/Firestore/API switch via VITE_DATA_SOURCE)',
  },
  {
    folder: 'src/features/cars/',
    desc: 'Cars feature — slice, CarCycle list, detail view, status helpers',
  },
  {
    folder: 'src/components/',
    desc: 'Shared UI and layout components (Button, Card, Badge, QRCode, Header, Footer)',
  },
  {
    folder: 'src/pages/',
    desc: 'Route-level page components that compose features',
  },
  {
    folder: 'src/types/',
    desc: 'Shared TypeScript interfaces and types',
  },
]

export default function AboutPage() {
  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 md:text-3xl">About This Project</h1>
        <p className="mt-4 text-slate-600 leading-relaxed">
          This is the CarCycle inventory system: a main page listing every car on the lot, and a
          per-car CarCycle page reachable by scanning a printed QR code. Each CarCycle page shows the
          car&apos;s current data plus a full change history log, so staff can see exactly what
          changed (price, status, mileage) and when.
        </p>
        <p className="mt-4 text-slate-600 leading-relaxed">
          The frontend runs standalone today against realistic mock data
          (<code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">VITE_DATA_SOURCE=mock</code>).
          Set <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">VITE_DATA_SOURCE=firestore</code>{' '}
          for a configured Firebase project, or{' '}
          <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">VITE_DATA_SOURCE=api</code> to use
          CarCycleService at <code className="rounded bg-slate-100 px-1.5 py-0.5 text-sm">VITE_API_BASE_URL</code>{' '}
          — no other code changes needed.
        </p>
      </div>

      <div className="space-y-4">
        <h2 className="text-xl font-semibold text-slate-900">Folder Structure</h2>
        {structure.map((item) => (
          <Card key={item.folder}>
            <code className="font-mono text-sm font-semibold text-primary-700">{item.folder}</code>
            <p className="mt-2 text-sm text-slate-600">{item.desc}</p>
          </Card>
        ))}
      </div>

      <Card>
        <h2 className="text-lg font-semibold text-slate-900">State Management Pattern</h2>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          <li><strong>Redux:</strong> Server data, shared UI state (cars, history, sidebar)</li>
          <li><strong>useState:</strong> Local form inputs, search filters, edit mode toggles</li>
          <li><strong>Firestore SDK:</strong> reads/writes via async thunks in Redux slices</li>
        </ul>
      </Card>
    </div>
  )
}
