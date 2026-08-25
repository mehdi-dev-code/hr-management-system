import { useEffect, useState } from 'react'
import { Plus } from 'lucide-react'
import api from '../../api/client'
import { PageHeader, Button, Modal, Field, inputClass, Badge } from '../../components/ui'

const emptyForm = {
  name: '',
  email: '',
  password: '',
  department_id: '',
  employee_code: '',
  designation: '',
  joining_date: '',
  salary: '',
}

export default function Employees() {
  const [employees, setEmployees] = useState([])
  const [departments, setDepartments] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [errors, setErrors] = useState({})
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    const [empRes, deptRes] = await Promise.all([
      api.get('/employees'),
      api.get('/departments'),
    ])
    setEmployees(empRes.data.data ?? [])
    setDepartments(deptRes.data)
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
      await api.post('/employees', form)
      setShowModal(false)
      setForm(emptyForm)
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
        eyebrow="People"
        title="Employees"
        action={
          <Button onClick={() => setShowModal(true)}>
            <span className="flex items-center gap-1.5">
              <Plus size={16} /> New employee
            </span>
          </Button>
        }
      />

      <div className="bg-surface border border-line rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-line text-left text-xs text-ink-soft uppercase tracking-wide">
              <th className="px-5 py-3 font-medium">Code</th>
              <th className="px-5 py-3 font-medium">Name</th>
              <th className="px-5 py-3 font-medium">Designation</th>
              <th className="px-5 py-3 font-medium">Department</th>
              <th className="px-5 py-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((emp) => (
              <tr key={emp.id} className="border-b border-line last:border-0">
                <td className="px-5 py-3.5 font-mono text-xs text-ink-soft">
                  {emp.employee_code}
                </td>
                <td className="px-5 py-3.5 font-medium">{emp.user?.name}</td>
                <td className="px-5 py-3.5 text-ink-soft">{emp.designation}</td>
                <td className="px-5 py-3.5 text-ink-soft">
                  {emp.department?.name || '—'}
                </td>
                <td className="px-5 py-3.5">
                  <Badge status={emp.status} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && employees.length === 0 && (
          <p className="text-sm text-ink-soft px-5 py-6 text-center">
            No employees yet — add one to get started.
          </p>
        )}
      </div>

      {showModal && (
        <Modal title="New employee" onClose={() => setShowModal(false)}>
          <form onSubmit={handleCreate}>
            <Field label="Full name">
              <input
                className={inputClass}
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              {errors.name && <p className="text-xs text-clay mt-1">{errors.name[0]}</p>}
            </Field>
            <Field label="Email">
              <input
                type="email"
                className={inputClass}
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                required
              />
              {errors.email && <p className="text-xs text-clay mt-1">{errors.email[0]}</p>}
            </Field>
            <Field label="Temporary password">
              <input
                type="password"
                className={inputClass}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                required
              />
              {errors.password && (
                <p className="text-xs text-clay mt-1">{errors.password[0]}</p>
              )}
            </Field>
            <Field label="Employee code">
              <input
                className={inputClass}
                value={form.employee_code}
                onChange={(e) => setForm({ ...form, employee_code: e.target.value })}
                placeholder="EMP-003"
                required
              />
              {errors.employee_code && (
                <p className="text-xs text-clay mt-1">{errors.employee_code[0]}</p>
              )}
            </Field>
            <Field label="Designation">
              <input
                className={inputClass}
                value={form.designation}
                onChange={(e) => setForm({ ...form, designation: e.target.value })}
                required
              />
            </Field>
            <Field label="Department">
              <select
                className={inputClass}
                value={form.department_id}
                onChange={(e) => setForm({ ...form, department_id: e.target.value })}
              >
                <option value="">— None —</option>
                {departments.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.name}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Joining date">
              <input
                type="date"
                className={inputClass}
                value={form.joining_date}
                onChange={(e) => setForm({ ...form, joining_date: e.target.value })}
                required
              />
            </Field>
            <Field label="Salary (optional)">
              <input
                type="number"
                className={inputClass}
                value={form.salary}
                onChange={(e) => setForm({ ...form, salary: e.target.value })}
              />
            </Field>
            <div className="flex justify-end gap-2 mt-5">
              <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={saving}>
                {saving ? 'Saving…' : 'Add employee'}
              </Button>
            </div>
          </form>
        </Modal>
      )}
    </div>
  )
}
