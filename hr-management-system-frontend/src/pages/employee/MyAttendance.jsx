import { useState } from 'react'
import { LogIn, LogOut, Fingerprint } from 'lucide-react'
import api from '../../api/client'
import { PageHeader, Button } from '../../components/ui'

export default function MyAttendance() {
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState(null)
  const [lastAction, setLastAction] = useState(null)

  const today = new Date().toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  const checkIn = async () => {
    setBusy(true)
    setMessage(null)
    try {
      const { data } = await api.post('/attendance/check-in')
      setMessage({ type: 'ok', text: `Checked in at ${data.check_in}` })
      setLastAction('in')
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Could not check in.',
      })
    } finally {
      setBusy(false)
    }
  }

  const checkOut = async () => {
    setBusy(true)
    setMessage(null)
    try {
      const { data } = await api.post('/attendance/check-out')
      setMessage({ type: 'ok', text: `Checked out at ${data.check_out}` })
      setLastAction('out')
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Could not check out.',
      })
    } finally {
      setBusy(false)
    }
  }

  return (
    <div>
      <PageHeader eyebrow={today} title="My attendance" />

      <div className="bg-surface border border-line rounded-xl p-8 flex flex-col items-center text-center max-w-md mx-auto mt-6">
        <div className="w-14 h-14 rounded-full bg-pine-soft flex items-center justify-center mb-4">
          <Fingerprint className="text-pine" size={26} />
        </div>
        <p className="text-sm text-ink-soft mb-6 max-w-xs">
          Mark your check-in when you start work, and check-out when you're
          done for the day.
        </p>

        <div className="flex gap-3 w-full">
          <Button onClick={checkIn} disabled={busy} className="flex-1">
            <span className="flex items-center justify-center gap-1.5">
              <LogIn size={15} /> Check in
            </span>
          </Button>
          <Button
            variant="secondary"
            onClick={checkOut}
            disabled={busy}
            className="flex-1"
          >
            <span className="flex items-center justify-center gap-1.5">
              <LogOut size={15} /> Check out
            </span>
          </Button>
        </div>

        {message && (
          <p
            className={`text-sm mt-5 font-medium ${
              message.type === 'ok' ? 'text-pine-deep' : 'text-clay'
            }`}
          >
            {message.text}
          </p>
        )}
      </div>

      <p className="text-xs text-ink-soft text-center mt-6 font-mono">
        Full attendance history is visible to HR under Attendance log.
      </p>
    </div>
  )
}
