import { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import gsap from 'gsap'
import { useAuth } from '@/context/AuthContext'
import { Spinner } from '@/components/common/Spinner'

const DEMO_ACCOUNTS = [
  { role: 'Admin', email: 'admin@pregai.demo' },
  { role: 'Clinician', email: 'clinician@pregai.demo' },
  { role: 'Researcher', email: 'researcher@pregai.demo' },
]

export default function LoginPage() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const cardRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (cardRef.current) {
      gsap.fromTo(cardRef.current, { opacity: 0, y: 14 }, { opacity: 1, y: 0, duration: 0.6, ease: 'power2.out' })
    }
  }, [])

  if (user) {
    const from = (location.state as { from?: Location })?.from?.pathname || '/dashboard'
    return <Navigate to={from} replace />
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setStatus('loading')
    setErrorMsg('')
    try {
      await login(email, password)
      navigate('/dashboard', { replace: true })
    } catch (err) {
      setStatus('error')
      setErrorMsg(
        err instanceof Error && err.message === 'INVALID_CREDENTIALS'
          ? 'Incorrect email or password. Please try again.'
          : 'Unable to reach the authentication service. The backend may be unavailable.',
      )
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-base px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex h-11 w-11 items-center justify-center rounded-lg bg-brand/15 text-brand">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5">
              <path d="M3 14h3l2-6 4 12 3-9 2 3h4" />
            </svg>
          </div>
          <div>
            <h1 className="font-display text-xl font-semibold text-ink">PREG AI</h1>
            <p className="mt-1 text-sm text-ink-muted">EHG-based pregnancy monitoring platform</p>
          </div>
        </div>

        <div ref={cardRef} className="card p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">Email</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="clinician@pregai.demo"
                className="w-full rounded-md border border-border bg-surface-elevated px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-brand focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-medium text-ink-muted">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-md border border-border bg-surface-elevated px-3 py-2 text-sm text-ink placeholder:text-ink-faint focus:border-brand focus:outline-none"
              />
            </div>

            {status === 'error' && (
              <div className="rounded-md border border-status-critical/30 bg-status-critical/10 px-3 py-2 text-xs text-status-critical">
                {errorMsg}
              </div>
            )}

            <button
              type="submit"
              disabled={status === 'loading'}
              className="flex w-full items-center justify-center gap-2 rounded-md bg-brand px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-brand-dim disabled:opacity-60"
            >
              {status === 'loading' && <Spinner size={14} />}
              {status === 'loading' ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <div className="mt-5 rounded-md border border-border-subtle bg-surface/50 p-3">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-wide text-ink-faint">Demo accounts (password: demo1234)</p>
          <div className="space-y-1">
            {DEMO_ACCOUNTS.map((a) => (
              <button
                key={a.email}
                type="button"
                onClick={() => { setEmail(a.email); setPassword('demo1234') }}
                className="flex w-full items-center justify-between rounded px-2 py-1 text-left text-xs text-ink-muted transition-colors hover:bg-surface-hover hover:text-ink"
              >
                <span>{a.role}</span>
                <span className="font-mono text-[11px] text-ink-faint">{a.email}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
