// Suggestion form — subject, message, anonymous toggle, success state
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, Send, EyeOff } from 'lucide-react'
import Button from '../ui/Button'
import { submitSuggestion } from '../../services/api'

const INIT = { subject: '', message: '', isAnonymous: false }

const inputCls = `w-full bg-canvas border border-edge rounded-lg px-4 py-2.5
                  text-sm text-ink placeholder-ink-subtle
                  focus:outline-none focus:border-brand focus:shadow-focus
                  transition-colors duration-150`

export default function SuggestionForm() {
  const [form, setForm]       = useState(INIT)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError]     = useState('')

  function handleChange(e) {
    const { name, value, type, checked } = e.target
    setForm(p => ({ ...p, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.subject.trim() || !form.message.trim()) {
      setError('Please fill in both subject and message.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await submitSuggestion(form)
      setSuccess(true)
      setForm(INIT)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <AnimatePresence mode="wait">
      {success ? (
        <motion.div
          key="success"
          initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }} transition={{ duration: 0.22 }}
          className="bg-card border border-edge rounded-lg p-10 flex flex-col
                     items-center justify-center gap-4 text-center shadow-sm"
        >
          <div className="w-12 h-12 rounded-pill bg-[rgba(16,185,129,0.12)]
                          flex items-center justify-center">
            <CheckCircle size={26} className="text-success" />
          </div>
          <div>
            <p className="text-ink font-semibold text-lg">Thank you!</p>
            <p className="text-ink-muted text-sm mt-1">
              Your message was received. We read every suggestion.
            </p>
          </div>
          <button onClick={() => setSuccess(false)}
                  className="text-brand text-sm hover:underline">
            Submit another
          </button>
        </motion.div>
      ) : (
        <motion.form
          key="form"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }} transition={{ duration: 0.22 }}
          onSubmit={handleSubmit}
          className="bg-card border border-edge rounded-lg p-6 flex flex-col gap-5 shadow-sm"
        >
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink">Subject</label>
            <input type="text" name="subject" value={form.subject}
                   onChange={handleChange}
                   placeholder="Brief subject of your suggestion"
                   className={inputCls} />
          </div>

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-ink">Message</label>
            <textarea name="message" value={form.message} onChange={handleChange}
                      rows={5} placeholder="Share your idea or feedback in detail…"
                      className={`${inputCls} resize-none`} />
          </div>

          {/* Anonymous toggle */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              onClick={() => setForm(p => ({ ...p, isAnonymous: !p.isAnonymous }))}
              className={`relative w-10 h-5 rounded-pill transition-colors duration-200
                          ${form.isAnonymous ? 'bg-brand' : 'bg-edge-strong'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-pill shadow
                                transition-transform duration-200
                                ${form.isAnonymous ? 'translate-x-5' : 'translate-x-0.5'}`} />
            </div>
            <div className="flex items-center gap-2">
              <EyeOff size={14} className="text-ink-muted" />
              <span className="text-sm text-ink-muted">Submit anonymously</span>
            </div>
          </label>

          {error && <p className="text-danger text-sm">{error}</p>}

          <Button type="submit" disabled={loading} fullWidth>
            <Send size={14} />
            {loading ? 'Sending…' : 'Send suggestion'}
          </Button>
        </motion.form>
      )}
    </AnimatePresence>
  )
}
