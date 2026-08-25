import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import api from '../../api/client'
import { PageHeader, Button, Modal, Field, inputClass } from '../../components/ui'

export default function Departments() {
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ name: '', description: '' })
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    const { data } = await api.get('/departments')
    setDepartments(data)
    setLoading(false)
  }

  useEffect(() => {
    load()
  }, [])

  const handleCreate = async (e) => {
    e.preventDefault()
    setSaving(true)
    setErrors({})
    try {
      await api.post('/departments', form)
      setShowModal(false)
      setForm({ name: '', description: '' })
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
        eyebrow="Structure"
        title="Departments"
        action={
          <Button onClick={() => setShowModal(true)}>
            <span className="flex items-center gap-1.5">
              <Plus size={16} /> New department
            </span>
          </Button>
        }
      />

      <div className="bg-surface border border-line rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs text-ink-soft uppercase tracking-wide">
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Description</th>
              <th className="px-5 py-3 font-medium text-right">Headcount</th>
            </tr>
          </thead>
          <tbody>
            {departments.map((d) => (
              <tr key={d.id} className="border-b border-line last:border-0">
                <td className="px-5 py-3.5 font-medium">{d.name}</td>
                <td className="px-5 py-3.5 text-ink-soft">{d.description || '—'}</td>
                <td className="px-5 py-3.5 text-right font-mono text-ink-soft">
                  {d.employees_count}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && departments.length === 0 && (
          <p className="text-sm text-ink-soft px-5 py-6 text-center">
            No departments yet — add one to get started.
          </p>
        )}
      </div>

      {showModal && (
        <Modal title="New department" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate}>
            <Field label="Name">
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Engineering"
                required
              />
              {errors.name && (
                <p className="text-xs text-clay mt-1">{errors.name[0]}</p>
              )}
            </Field>
            <Field label="Description">
              <input
                className={inputClass}
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                placeholder="What this team owns"
              />
            </Field>
            <div className="flex justify-end gap-2 mt-5">
              <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Create department'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
