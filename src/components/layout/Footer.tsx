export default function Footer() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white print:hidden">
      <div className="container-app py-6">
        <p className="text-slate-600">&copy; {new Date().getFullYear()} CarCycle</p>
      </div>
    </footer>
  )
}
