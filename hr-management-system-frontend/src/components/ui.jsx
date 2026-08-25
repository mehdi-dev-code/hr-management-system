import { X } from 'lucide-react'

export function PageHeader({ eyebrow, title, action }) {
  return (
    <div className="flex items-start justify-between mb-7">
      <div>
        {eyebrow && (
          <p className="text-xs font-mono uppercase tracking-wider text-pine mb-1.5">
            {eyebrow}
          </p>
        )}
        <h1 className="font-display text-2xl font-semibold tracking-tight text-ink">
          {title}
        </h1>
      </div>
      {action}
    </div>
  )
}

export function StatCard({ label, value, sublabel }) {
  return (
    <div className="bg-surface border border-line rounded-xl p-5">
      <p className="text-xs font-medium text-ink-soft mb-2">{label}</p>
      <p className="font-display text-3xl font-semibold text-ink">{value}</p>
      {sublabel && <p className="text-xs text-ink-soft mt-1">{sublabel}</p>}
    </div>
  )
}

const statusStyles = {
  active: 'bg-pine-soft text-pine-deep',
  present: 'bg-pine-soft text-pine-deep',
  approved: 'bg-pine-soft text-pine-deep',
  pending: 'bg-amber-soft text-amber',
  on_leave: 'bg-amber-soft text-amber',
  half_day: 'bg-amber-soft text-amber',
  rejected: 'bg-clay-soft text-clay',
  absent: 'bg-clay-soft text-clay',
  terminated: 'bg-clay-soft text-clay',
  admin: 'bg-ink text-white',
  hr: 'bg-pine-soft text-pine-deep',
  employee: 'bg-line text-ink-soft',
}

export function Badge({ status }) {
  const style = statusStyles[status] || 'bg-line text-ink-soft'
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium capitalize ${style}`}
    >
      {status?.replace('_', ' ')}
    </span>
  )
}

// Signature element: a ledger-style record row with a colored status stub on
// the left edge, echoing a stamped personnel-file tab.
export function LedgerRow({ status, children }) {
  const stubColor =
    {
      approved: 'bg-pine',
      present: 'bg-pine',
      active: 'bg-pine',
      pending: 'bg-amber',
      on_leave: 'bg-amber',
      half_day: 'bg-amber',
      rejected: 'bg-clay',
      absent: 'bg-clay',
      terminated: 'bg-clay',
    }[status] || 'bg-line'

  return (
    <div className="flex bg-surface border border-line rounded-lg overflow-hidden">
      <div className={`w-1.5 shrink-0 ${stubColor}`} />
      <div className="flex-1 min-w-0 px-5 py-4">{children}</div>
    </div>
  )
}

export function Modal({ title, onClose, children }) {
  return (
    <div className="fixed inset-0 bg-ink/40 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">
      <div className="bg-surface rounded-xl border border-line w-full max-w-md shadow-xl">
        <div className="flex items-center justify-between px-5 py-4 border-b border-line">
          <h2 className="font-display font-semibold text-base">{title}</h2>
          <button
            onClick={onClose}
            className="text-ink-soft hover:text-ink p-1 rounded-md hover:bg-paper"
          >
            <X size={18} />
          </button>
        </div>
        <div className="p-5">{children}</div>
      </div>
    </div>
  )
}

export function Button({ children, variant = 'primary', className = '', ...props }) {
  const variants = {
    primary: 'bg-pine text-white hover:bg-pine-deep',
    secondary: 'bg-paper text-ink border border-line hover:bg-line',
    danger: 'bg-clay text-white hover:bg-clay/90',
  }
  return (
    <button
      className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}

export function Field({ label, children }) {
  return (
    <label className="block mb-3.5">
      <span className="block text-xs font-medium text-ink-soft mb-1.5">{label}</span>
      {children}
    </label>
  )
}

export const inputClass =
  'w-full px-3 py-2 rounded-lg border border-line bg-paper text-sm text-ink placeholder:text-ink-soft/60 focus:outline-none focus:ring-2 focus:ring-pine/30 focus:border-pine transition-colors'
