import { useEffect, useState } from 'react'
import api from '../../api/client'
import { PageHeader, StatCard, LedgerRow, Badge } from '../../components/ui'

export default function Dashboard() {
  const [departments, setDepartments] = useState([])
  const [employeeTotal, setEmployeeTotal] = useState(null)
  const [pendingLeave, setPendingLeave] = useState([])
  const [pendingTotal, setPendingTotal] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    async function load() {
      const [deptRes, empRes, leaveRes] = await Promise.all([
        api.get('/departments'),
        api.get('/employees'),
        api.get('/leave-requests', { params: { status: 'pending' } }),
      ])
      if (cancelled) return
      setDepartments(deptRes.data)
      setEmployeeTotal(empRes.data.total ?? empRes.data.data?.length ?? 0)
      setPendingLeave((leaveRes.data.data ?? []).slice(0, 4))
      setPendingTotal(leaveRes.data.total ?? 0)
      setLoading(false)
    }
    load()
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <PageHeader eyebrow="Overview" title="Dashboard" />

      <div className="grid grid-cols-3 gap-4 mb-8">
        <StatCard label="Total employees" value={loading ? '—' : employeeTotal} />
        <StatCard label="Departments" value={loading ? '—' : departments.length} />
        <StatCard
          label="Pending leave requests"
          value={loading ? '—' : pendingTotal}
          sublabel={pendingTotal > 0 ? 'Needs review' : 'All clear'}
        />
      </div>

      <div className="grid grid-cols-2 gap-6">
        <div>
          <h2 className="font-display font-semibold text-sm mb-3 text-ink-soft uppercase tracking-wide">
            Departments
          </h2>
          <div className="space-y-2">
            {departments.map((d) => (
              <div
                key={d.id}
                className="flex items-center justify-between bg-surface border border-line rounded-lg px-4 py-3"
              >
                <div>
                  <p className="text-sm font-medium">{d.name}</p>
                  <p className="text-xs text-ink-soft">{d.description}</p>
                </div>
                <span className="font-mono text-xs text-ink-soft bg-paper px-2 py-1 rounded">
                  {d.employees_count} {d.employees_count === 1 ? 'person' : 'people'}
                </span>
              </div>
            ))}
            {!loading && departments.length === 0 && (
              <p className="text-sm text-ink-soft">No departments yet.</p>
            )}
          </div>
        </div>

        <div>
          <h2 className="font-display font-semibold text-sm mb-3 text-ink-soft uppercase tracking-wide">
            Awaiting your review
          </h2>
          <div className="space-y-2">
            {pendingLeave.map((l) => (
              <LedgerRow key={l.id} status={l.status}>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium">{l.employee?.user?.name}</p>
                    <p className="text-xs text-ink-soft font-mono">
                      {l.start_date} → {l.end_date}
                    </p>
                  </div>
                  <Badge status={l.status} />
                </div>
              </LedgerRow>
            ))}
            {!loading && pendingLeave.length === 0 && (
              <p className="text-sm text-ink-soft">Nothing pending. Nice.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
