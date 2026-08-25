import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import api from '../../api/client'
import { PageHeader, Button, Modal, Field, inputClass, LedgerRow, Badge } from '../../components/ui'

export default function MyLeaves() {
  const [leaves, setLeaves] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ start_date: '', end_date: '', reason: '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data } = await api.get('/leave-requests/mine')
    setLeaves(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      await api.post('/leave-requests', form)
      setShowModal(false)
      setForm({ start_date: '', end_date: '', reason: '' })
      load()
    } catch (err) {
      setErrors(err.response?.data?.errors || {})
    } finally {
      setSaving(false)
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Time off"
        title="My leave"
        action={
          <Button onClick={() => setShowModal(true)}>
            <span className="flex items-center gap-1.5">
              <Plus size={16} /> Request leave
            </span>
          </Button>
        }
      />

      <div className="space-y-2">
        {leaves.map((l) => (
          <LedgerRow key={l.id} status={l.status}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-mono text-ink-soft">
                  {l.start_date} → {l.end_date}
                </p>
                <p className="text-sm mt-1">{l.reason}</p>
                {l.review_note && (
                  <p className="text-xs text-ink-soft mt-1.5 italic">
                    HR note: {l.review_note}
                  </p>
                )}
              </div>
              <Badge status={l.status} />
            </div>
          </LedgerRow>
        ))}
        {!loading && leaves.length === 0 && (
          <p className="text-sm text-ink-soft py-8 text-center">
            No leave requests yet.
          </p>
        )}
      </div>

      {showModal && (
        <Modal title="Request leave" onClose={() => setShowModal(false)}>
          <form onSubmit={handleSubmit}>
            <Field label="Start date">
              <input
                type="date"
                className={inputClass}
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                required
              />
              {errors.start_date && (
                <p className="text-xs text-clay mt-1">{errors.start_date[0]}</p>
              )}
            </Field>
            <Field label="End date">
              <input
                type="date"
                className={inputClass}
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                required
              />
              {errors.end_date && (
                <p className="text-xs text-clay mt-1">{errors.end_date[0]}</p>
              )}
            </Field>
            <Field label="Reason">
              <textarea
                className={inputClass}
                rows={3}
                value={form.reason}
                onChange={(e) => setForm({ ...form, reason: e.target.value })}
                required
              />
              {errors.reason && (
                <p className="text-xs text-clay mt-1">{errors.reason[0]}</p>
              )}
            </Field>
            <div className="flex justify-end gap-2 mt-5">
              <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Submitting…' : 'Submit request'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
