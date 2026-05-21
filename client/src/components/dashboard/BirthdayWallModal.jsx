import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Send, Loader } from 'lucide-react'
import { getBirthdayMessages, postBirthdayMessage } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function formatBirthdayDate(str) {
  if (!str) return ''
  const [mm, dd] = str.split('-').map(Number)
  return `${MONTHS[mm - 1]} ${dd}`
}

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
  return (
    <div className={`w-${size} h-${size} rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center flex-shrink-0`}>
      <span className="text-brand text-xs font-bold">{initials}</span>
    </div>
  )
}

export default function BirthdayWallModal({ person, onClose }) {
  const { user } = useAuth()
  const [messages, setMessages]   = useState([])
  const [text, setText]           = useState('')
  const [loading, setLoading]     = useState(true)
  const [sending, setSending]     = useState(false)
  const [error, setError]         = useState('')
  const bottomRef                 = useRef(null)

  useEffect(() => {
    getBirthdayMessages(person.id)
      .then(r => setMessages(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [person.id])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  async function handleSend() {
    const trimmed = text.trim()
    if (!trimmed || sending) return
    setSending(true)
    setError('')
    try {
      const { data } = await postBirthdayMessage(person.id, trimmed)
      setMessages(prev => [data, ...prev])
      setText('')
    } catch (e) {
      setError(e.response?.data?.error || 'Could not send message')
    } finally {
      setSending(false)
    }
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend() }
  }

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

        <motion.div
          className="relative w-full max-w-lg bg-surface border border-edge rounded-2xl shadow-lg overflow-hidden flex flex-col"
          style={{ maxHeight: '80vh' }}
          initial={{ scale: 0.95, opacity: 0, y: 16 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 16 }}
          transition={{ duration: 0.2, ease: 'easeOut' }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-edge">
            <div className="flex items-center gap-3">
              <span className="text-2xl">🎂</span>
              <div>
                <p className="text-ink font-semibold text-sm">{person.name}'s Birthday Wall</p>
                <p className="text-ink-muted text-xs">{formatBirthdayDate(person.birthday)}</p>
              </div>
            </div>
            <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-white/10 flex items-center justify-center transition-colors">
              <X size={15} className="text-ink-muted" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto px-5 py-4 space-y-3">
            {loading ? (
              <div className="flex justify-center py-8">
                <Loader size={20} className="text-ink-subtle animate-spin" />
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center py-10">
                <p className="text-3xl mb-2">🎈</p>
                <p className="text-ink-muted text-sm">No messages yet — be the first to wish them!</p>
              </div>
            ) : (
              [...messages].reverse().map(msg => (
                <motion.div
                  key={msg.id}
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <Avatar name={msg.from.name} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline gap-2 mb-0.5">
                      <span className="text-ink text-xs font-semibold">{msg.from.name}</span>
                      <span className="text-ink-subtle text-[10px]">{timeAgo(msg.createdAt)}</span>
                    </div>
                    <p className="text-ink-muted text-sm leading-relaxed break-words">{msg.message}</p>
                  </div>
                </motion.div>
              ))
            )}
            <div ref={bottomRef} />
          </div>

          {/* Input */}
          <div className="border-t border-edge px-4 py-3">
            {error && <p className="text-danger text-xs mb-2">{error}</p>}
            <div className="flex gap-2">
              <Avatar name={user?.name} size={8} />
              <div className="flex-1 flex gap-2">
                <textarea
                  value={text}
                  onChange={e => setText(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Write a birthday message…"
                  maxLength={300}
                  rows={2}
                  className="flex-1 bg-canvas border border-edge rounded-lg px-3 py-2 text-sm text-ink placeholder:text-ink-subtle focus:outline-none focus:border-brand transition-colors resize-none"
                />
                <button
                  onClick={handleSend}
                  disabled={!text.trim() || sending}
                  className="w-9 h-9 mt-auto rounded-lg bg-brand flex items-center justify-center disabled:opacity-40 hover:bg-brand-h transition-colors flex-shrink-0"
                >
                  {sending ? <Loader size={14} className="text-ink-on animate-spin" /> : <Send size={14} className="text-ink-on" />}
                </button>
              </div>
            </div>
            <p className="text-ink-subtle text-[10px] mt-1.5 text-right">{text.length}/300</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
}
