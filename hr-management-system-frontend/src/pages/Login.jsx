import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Fingerprint } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { inputClass } from '../components/ui'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { login, loading, error, isStaff } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    const ok = await login(email, password)
    if (ok) {
      navigate(isStaff ? '/dashboard' : '/my-attendance')
    }
  }

  return (
    <div className="min-h-screen bg-paper flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        <div className="flex flex-col items-center mb-8">
          <div className="w-11 h-11 rounded-xl bg-pine flex items-center justify-center mb-4">
            <Fingerprint className="text-white" size={22} />
          </div>
          <h1 className="font-display text-xl font-semibold tracking-tight text-ink">
            BitcraftX HR
          </h1>
          <p className="text-sm text-ink-soft mt-1">Sign in to your account</p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-surface border border-line rounded-xl p-6"
        >
          {error && (
            <div className="mb-4 px-3 py-2.5 rounded-lg bg-clay-soft text-clay text-sm">
              {error}
            </div>
          )}

          <label className="block mb-4">
            <span className="block text-xs font-medium text-ink-soft mb-1.5">
              Email
            </span>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@hrms.test"
              className={inputClass}
            />
          </label>

          <label className="block mb-5">
            <span className="block text-xs font-medium text-ink-soft mb-1.5">
              Password
            </span>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className={inputClass}
            />
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pine text-white py-2.5 rounded-lg text-sm font-medium hover:bg-pine-deep transition-colors disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>

        <p className="text-center text-xs text-ink-soft mt-5 font-mono">
          admin@hrms.test · hr@hrms.test · employee@hrms.test — pass: password
        </p>
      </div>
    </div>
  )
}
