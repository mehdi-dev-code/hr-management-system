import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutGrid,
  Building2,
  Users,
  CalendarClock,
  ClipboardList,
  LogOut,
  Fingerprint,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const staffNav = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutGrid },
  { to: '/departments', label: 'Departments', icon: Building2 },
  { to: '/employees', label: 'Employees', icon: Users },
  { to: '/attendance', label: 'Attendance log', icon: CalendarClock },
  { to: '/leave-requests', label: 'Leave requests', icon: ClipboardList },
]

const employeeNav = [
  { to: '/my-attendance', label: 'My attendance', icon: Fingerprint },
  { to: '/my-leaves', label: 'My leave', icon: ClipboardList },
]

export default function Layout({ children }) {
  const { user, logout, isStaff } = useAuth()
  const navigate = useNavigate()
  const nav = isStaff ? staffNav : employeeNav

  const handleLogout = async () => {
    await logout()
    navigate('/login')
  }

  const initials = user?.name
    ?.split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  return (
    <div className="min-h-screen flex bg-paper">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r border-line bg-surface flex flex-col">
        <div className="h-16 flex items-center gap-2.5 px-5 border-b border-line">
          <div className="w-8 h-8 rounded-md bg-pine flex items-center justify-center">
            <span className="font-display font-bold text-white text-sm">B</span>
          </div>
          <div className="leading-tight">
            <p className="font-display font-semibold text-sm tracking-tight">BitcraftX</p>
            <p className="text-[11px] text-ink-soft -mt-0.5">HR System</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-5 space-y-0.5">
          {nav.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-pine-soft text-pine-deep'
                    : 'text-ink-soft hover:bg-paper hover:text-ink'
                }`
              }
            >
              <Icon size={17} strokeWidth={2} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-line">
          <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-ink text-white flex items-center justify-center text-xs font-semibold shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium truncate">{user?.name}</p>
              <p className="text-[11px] text-ink-soft capitalize">{user?.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-medium text-ink-soft hover:bg-clay-soft hover:text-clay transition-colors"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-w-0">
        <div className="max-w-6xl mx-auto px-8 py-8">{children}</div>
      </main>
    </div>
  )
}
