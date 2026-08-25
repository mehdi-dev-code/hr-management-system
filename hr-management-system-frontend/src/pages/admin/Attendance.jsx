import { useEffect, useState } from 'react'
import api from '../../api/client'
import { PageHeader, LedgerRow, Badge } from '../../components/ui'

export default function Attendance() {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const { data } = await api.get('/attendance')
      setRecords(data.data ?? [])
      setLoading(false)
    }
    load()
  }, [])

  return (
    <div>
      <PageHeader eyebrow="Records" title="Attendance log" />

      <div className="space-y-2">
        {records.map((r) => (
          <LedgerRow key={r.id} status={r.status}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium">{r.employee?.user?.name}</p>
                <p className="text-xs text-ink-soft font-mono mt-0.5">
                  {r.date} · in {r.check_in ?? '—'} · out {r.check_out ?? '—'}
                </p>
              </div>
              <Badge status={r.status} />
            </div>
          </LedgerRow>
        ))}
        {!loading && records.length === 0 && (
          <p className="text-sm text-ink-soft py-8 text-center">
            No attendance records yet.
          </p>
        )}
      </div>
    </div>
  )
}
