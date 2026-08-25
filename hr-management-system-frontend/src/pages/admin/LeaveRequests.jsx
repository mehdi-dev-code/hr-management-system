import { useEffect, useState } from 'react'
import { Check, X as XIcon } from 'lucide-react'
import api from '../../api/client'
import { PageHeader, LedgerRow, Badge, Button } from '../../components/ui'

export default function LeaveRequests() {
  const [requests, setRequests] = useState([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('pending')
  const [busyId, setBusyId] = useState(null)

  const load = async (status) => {
    setLoading(true)
    const { data } = await api.get('/leave-requests', {
      params: status === 'all' ? {} : { status },
    })
    setRequests(data.data ?? [])
    setLoading(false)
  }

  useEffect(() => {
    load(filter)
  }, [filter])

  const review = async (id, status) => {
    setBusyId(id)
    try {
      await api.patch(`/leave-requests/${id}/review`, { status })
      load(filter)
    } finally {
      setBusyId(null)
    }
  }

  const tabs = ['pending', 'approved', 'rejected', 'all']

  return (
    <div>
      <PageHeader eyebrow="Approvals" title="Leave requests" />

      <div className="flex gap-1 mb-5 bg-line/50 p-1 rounded-lg w-fit">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setFilter(t)}
            className={`px-3.5 py-1.5 rounded-md text-sm font-medium capitalize transition-colors ${
              filter === t ? 'bg-surface text-ink shadow-sm' : 'text-ink-soft hover:text-ink'
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-2">
        {requests.map((r) => (
          <LedgerRow key={r.id} status={r.status}>
            <div className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm font-medium">{r.employee?.user?.name}</p>
                <p className="text-xs text-ink-soft font-mono mt-0.5">
                  {r.start_date} → {r.end_date}
                </p>
                <p className="text-sm text-ink-soft mt-1.5">{r.reason}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {r.status === 'pending' ? (
                  <>
                    <button
                      onClick={() => review(r.id, 'approved')}
                      disabled={busyId === r.id}
                      className="p-2 rounded-lg bg-pine-soft text-pine-deep hover:bg-pine hover:text-white transition-colors disabled:opacity-50"
                      title="Approve"
                    >
                      <Check size={16} />
                    </button>
                    <button
                      onClick={() => review(r.id, 'rejected')}
                      disabled={busyId === r.id}
                      className="p-2 rounded-lg bg-clay-soft text-clay hover:bg-clay hover:text-white transition-colors disabled:opacity-50"
                      title="Reject"
                    >
                      <XIcon size={16} />
                    </button>
                  </>
                ) : (
                  <Badge status={r.status} />
                )}
              </div>
            </div>
          </LedgerRow>
        ))}
        {!loading && requests.length === 0 && (
          <p className="text-sm text-ink-soft py-8 text-center">
            No {filter !== 'all' ? filter : ''} leave requests.
          </p>
        )}
      </div>
    </div>
  )
}
