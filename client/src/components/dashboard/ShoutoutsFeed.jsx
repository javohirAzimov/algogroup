import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Megaphone, Send, Loader, ChevronDown, X } from 'lucide-react'
import { getShoutouts, postShoutout, getUpcomingBirthdays } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

function Avatar({ name, size = 8 }) {
  const initials = name ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?'
  const s = `w-${size} h-${size}`
  return (
    <div className={`${s} rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center flex-shrink-0`}>
      <span className="text-brand text-xs font-bold">{initials}</span>
    </div>
  )
}

function PostShoutoutModal({ onClose, onPosted }) {
  const { user } = useAuth()
  const [users, setUsers]     = useState([])
  const [toUser, setToUser]   = useState('')
  const [message, setMessage] = useState('')
  const [sending, setSending] = useState(false)
  const [error, setError]     = useState('')

  useEffect(() => {
    import('../../services/api').then(({ getUsers }) => {
      getUsers().then(r => setUsers(r.data.filter(u => u.id !== user?.id))).catch(() => {})
    })
  }, [user])

  async function handleSend() {
    if (!toUser || !message.trim() || sending) return
    setSending(true)
    setError('')
    try {
      const selected = users.find(u => String(u.id) === String(toUser))
      const isBirthday = selected?.birthday
        ? (() => {
            const [mm, dd] = selected.birthday.split('-').map(Number)
            const now = new Date()
            return now.getMonth() + 1 === mm && now.getDate() === dd
          })()
        : false
      const { data } = await postShoutout({ toUserId: Number(toUser), message: message.trim(), isBirthday })
      onPosted(data)
      onClose()
    } catch (e) {
      setError(e.response?.data?.error || 'Could not post shoutout')
      setSending(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        className="relative w-full max-w-md bg-surface border border-edge rounded-2xl shadow-lg p-5"
        initial={{ scale: 0.95, opacity: 0, y: 12 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.18 }}
      >
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">📣</span>
            <p className="text-ink font-semibold">Give a Shoutout</p>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center">
            <X size={15} className="text-ink-muted" />
          </button>
        </div>

        <div className="space-y-3">
          <div>
            <label className="text-ink-muted text-xs font-medium block mb-1.5">To</label>
            <select
              value={toUser}
              onChange={e => setToUser(e.target.value)}
              className="w-full bg-canvas border border-edge rounded-lg px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand transition-colors"
            >
              <option value="">Select teammate…</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name}{u.department ? ` · ${u.department}` : ''}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-ink-muted text-xs font-medium block mb-1.5">Message</label>
            <textarea
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Shout them out for something awesome…"
              maxLength={300}
              rows={3}
              className="w-full bg-canvas border border-edge rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:border-brand transition-colors resize-none"
            />
            <p className="text-ink-subtle text-[10px] text-right mt-1">{message.length}/300</p>
          </div>

          {error && <p className="text-danger text-xs">{error}</p>}

          <button
            onClick={handleSend}
            disabled={!toUser || !message.trim() || sending}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg bg-brand text-ink-on text-sm font-semibold disabled:opacity-40 hover:bg-brand-h transition-colors"
          >
            {sending ? <Loader size={14} className="animate-spin" /> : <Send size={14} />}
            {sending ? 'Posting…' : 'Post Shoutout'}
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default function ShoutoutsFeed() {
  const [shoutouts, setShoutouts] = useState([])
  const [loading, setLoading]     = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [expanded, setExpanded]   = useState(false)

  useEffect(() => {
    getShoutouts()
      .then(r => setShoutouts(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const visible = expanded ? shoutouts : shoutouts.slice(0, 4)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className="glass rounded-xl border border-edge overflow-hidden"
      >
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-edge">
          <div className="flex items-center gap-2">
            <Megaphone size={14} className="text-brand" />
            <span className="text-ink text-sm font-semibold">Shoutouts</span>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-brand/10 border border-brand/20 text-brand text-xs font-semibold hover:bg-brand/20 transition-colors"
          >
            <Send size={11} />
            Give Shoutout
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-6">
            <Loader size={18} className="text-ink-subtle animate-spin" />
          </div>
        ) : shoutouts.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-2xl mb-1.5">📣</p>
            <p className="text-ink-muted text-sm">No shoutouts yet — give one!</p>
          </div>
        ) : (
          <>
            <div className="divide-y divide-edge">
              <AnimatePresence>
                {visible.map((s, i) => (
                  <motion.div
                    key={s.id}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="px-5 py-3.5"
                  >
                    <div className="flex items-start gap-2.5">
                      <Avatar name={s.from.name} size={8} />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                          <span className="text-ink text-xs font-semibold">{s.from.name}</span>
                          <span className="text-ink-subtle text-xs">→</span>
                          <span className="text-brand text-xs font-semibold">{s.to.name}</span>
                          {s.isBirthday && <span className="text-sm">🎂</span>}
                          <span className="text-ink-subtle text-[10px] ml-auto">{timeAgo(s.createdAt)}</span>
                        </div>
                        <p className="text-ink-muted text-sm leading-relaxed break-words">{s.message}</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
            {shoutouts.length > 4 && (
              <button
                onClick={() => setExpanded(x => !x)}
                className="w-full flex items-center justify-center gap-1.5 py-3 text-ink-muted text-xs hover:text-ink transition-colors border-t border-edge"
              >
                <ChevronDown size={13} className={`transition-transform ${expanded ? 'rotate-180' : ''}`} />
                {expanded ? 'Show less' : `Show ${shoutouts.length - 4} more`}
              </button>
            )}
          </>
        )}
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <PostShoutoutModal
            onClose={() => setShowModal(false)}
            onPosted={s => setShoutouts(prev => [s, ...prev])}
          />
        )}
      </AnimatePresence>
    </>
  )
}
