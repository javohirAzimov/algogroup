import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Trash2, X, Loader, Trophy, Users, Clock } from 'lucide-react'
import { getTournaments, createTournament, deleteTournament } from '../../services/api'

function getStatus(t) {
  const now = new Date()
  if (now < new Date(t.startAt)) return 'upcoming'
  if (now > new Date(t.endAt))   return 'completed'
  return 'active'
}

const STATUS_STYLES = {
  upcoming:  'bg-amber-400/10 border-amber-400/30 text-amber-400',
  active:    'bg-brand/10 border-brand/30 text-brand',
  completed: 'bg-white/5 border-edge text-ink-muted',
}

function TournamentForm({ onSave, onCancel }) {
  const [form, setForm]     = useState({ title: '', description: '', startAt: '', endAt: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState('')

  const set = k => e => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.startAt || !form.endAt) {
      setError('Title, start date and end date are required')
      return
    }
    if (new Date(form.endAt) <= new Date(form.startAt)) {
      setError('End date must be after start date')
      return
    }
    setLoading(true)
    setError('')
    try {
      const { data } = await createTournament(form)
      onSave(data)
    } catch (e) {
      setError(e.response?.data?.error || 'Failed to create tournament')
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onCancel} />
      <motion.div
        initial={{ scale: 0.95, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.18 }}
        className="relative w-full max-w-md bg-surface border border-edge rounded-2xl shadow-lg p-5"
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Trophy size={16} className="text-amber-400" />
            <p className="text-ink font-semibold">New Tournament</p>
          </div>
          <button onClick={onCancel} className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center">
            <X size={15} className="text-ink-muted" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <div>
            <label className="text-ink-muted text-xs font-medium block mb-1.5">Title</label>
            <input
              value={form.title}
              onChange={set('title')}
              maxLength={100}
              placeholder="e.g. May Speed Championship"
              className="w-full bg-canvas border border-edge rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:border-brand transition-colors"
            />
          </div>
          <div>
            <label className="text-ink-muted text-xs font-medium block mb-1.5">Description (optional)</label>
            <textarea
              value={form.description}
              onChange={set('description')}
              maxLength={300}
              rows={2}
              placeholder="Brief description…"
              className="w-full bg-canvas border border-edge rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:border-brand transition-colors resize-none"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-ink-muted text-xs font-medium block mb-1.5">Start</label>
              <input
                type="datetime-local"
                value={form.startAt}
                onChange={set('startAt')}
                className="w-full bg-canvas border border-edge rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand transition-colors"
              />
            </div>
            <div>
              <label className="text-ink-muted text-xs font-medium block mb-1.5">End</label>
              <input
                type="datetime-local"
                value={form.endAt}
                onChange={set('endAt')}
                className="w-full bg-canvas border border-edge rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand transition-colors"
              />
            </div>
          </div>

          {error && <p className="text-danger text-xs">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-brand text-ink-on text-sm font-semibold disabled:opacity-40 hover:bg-brand-h transition-colors"
          >
            {loading ? <Loader size={14} className="animate-spin" /> : <Plus size={14} />}
            {loading ? 'Creating…' : 'Create Tournament'}
          </button>
        </form>
      </motion.div>
    </motion.div>
  )
}

export default function AdminTournaments() {
  const [tournaments, setTournaments] = useState([])
  const [loading, setLoading]         = useState(true)
  const [showForm, setShowForm]       = useState(false)
  const [deleting, setDeleting]       = useState(null)

  useEffect(() => {
    getTournaments()
      .then(r => setTournaments(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  function handleCreated(t) {
    setTournaments(prev => [t, ...prev])
    setShowForm(false)
  }

  async function handleDelete(id) {
    setDeleting(id)
    try {
      await deleteTournament(id)
      setTournaments(prev => prev.filter(t => t.id !== id))
    } catch (e) {
      console.error(e)
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-ink font-bold text-lg">Tournaments</p>
          <p className="text-ink-muted text-sm">Create and manage AG Type competitions</p>
        </div>
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand text-ink-on text-sm font-semibold hover:bg-brand-h transition-colors"
        >
          <Plus size={15} />
          New Tournament
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-12">
          <Loader size={22} className="text-ink-subtle animate-spin" />
        </div>
      ) : tournaments.length === 0 ? (
        <div className="glass rounded-xl border border-edge py-16 text-center">
          <p className="text-3xl mb-3">🏆</p>
          <p className="text-ink font-semibold mb-1">No tournaments yet</p>
          <p className="text-ink-muted text-sm">Create one to get started.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {tournaments.map((t, i) => {
            const status = getStatus(t)
            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass rounded-xl border border-edge px-5 py-4"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${STATUS_STYLES[status]}`}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                      </span>
                    </div>
                    <p className="text-ink font-semibold">{t.title}</p>
                    {t.description && <p className="text-ink-muted text-sm mt-0.5">{t.description}</p>}
                    <div className="flex items-center gap-4 mt-2 text-xs text-ink-muted">
                      <span className="flex items-center gap-1">
                        <Clock size={11} />
                        {new Date(t.startAt).toLocaleString()} → {new Date(t.endAt).toLocaleString()}
                      </span>
                      <span className="flex items-center gap-1">
                        <Users size={11} />
                        {t.entries?.length ?? 0} joined
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDelete(t.id)}
                    disabled={deleting === t.id}
                    className="flex-shrink-0 w-8 h-8 rounded-lg hover:bg-danger/10 flex items-center justify-center text-ink-subtle hover:text-danger transition-colors disabled:opacity-40"
                    title="Delete tournament"
                  >
                    {deleting === t.id
                      ? <Loader size={14} className="animate-spin" />
                      : <Trash2 size={14} />}
                  </button>
                </div>
              </motion.div>
            )
          })}
        </div>
      )}

      <AnimatePresence>
        {showForm && (
          <TournamentForm
            onSave={handleCreated}
            onCancel={() => setShowForm(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
