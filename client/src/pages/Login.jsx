import { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { LogIn, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const location  = useLocation()
  const from      = location.state?.from?.pathname || '/'

  const [form, setForm]       = useState({ email: '', password: '' })
  const [showPw, setShowPw]   = useState(false)
  const [error, setError]     = useState('')
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(form.email, form.password)
      navigate(from, { replace: true })
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, ease: 'easeOut' }}
        className="w-full max-w-sm"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-9 h-9 rounded-lg bg-brand flex items-center justify-center">
            <span className="text-ink-on font-bold text-base leading-none">A</span>
          </div>
          <span className="font-semibold text-ink text-lg">ALGO Group Portal</span>
        </div>

        <div className="bg-card border border-edge rounded-lg p-6 shadow-sm">
          <h1 className="text-ink font-semibold text-lg mb-1">Sign in</h1>
          <p className="text-ink-muted text-sm mb-6">Welcome back. Enter your credentials to continue.</p>

          {error && (
            <div className="bg-danger/10 border border-danger/20 text-danger text-sm rounded-md px-3 py-2 mb-4">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="text-ink text-sm font-medium mb-1.5 block">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={set('email')}
                placeholder="you@algogroup.com"
                required
                className="w-full bg-canvas border border-edge rounded-md px-3 py-2 text-sm text-ink
                           placeholder:text-ink-subtle focus:outline-none focus:border-brand transition-colors"
              />
            </div>

            <div>
              <label className="text-ink text-sm font-medium mb-1.5 block">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  value={form.password}
                  onChange={set('password')}
                  placeholder="••••••••"
                  required
                  className="w-full bg-canvas border border-edge rounded-md px-3 py-2 pr-9 text-sm text-ink
                             placeholder:text-ink-subtle focus:outline-none focus:border-brand transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(p => !p)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-ink-subtle hover:text-ink-muted"
                >
                  {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-brand hover:bg-brand-h text-ink-on font-medium text-sm
                         py-2 rounded-md transition-colors disabled:opacity-60 flex items-center justify-center gap-2"
            >
              <LogIn size={15} />
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="text-center text-ink-muted text-sm mt-5">
          Don't have an account?{' '}
          <Link to="/register" className="text-brand hover:underline font-medium">
            Create one
          </Link>
        </p>
      </motion.div>
    </div>
  )
}
