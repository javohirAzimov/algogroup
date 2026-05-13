import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Newspaper, Pin, PinOff, Trash2, Plus, X, ChevronDown, ChevronUp } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'
import { getNews, createNews, toggleNewsPin, deleteNews } from '../../services/api'

function timeAgo(date) {
  const secs = Math.floor((Date.now() - new Date(date)) / 1000)
  if (secs < 60) return 'just now'
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

function NewsCard({ post, isAdmin, onPin, onDelete }) {
  const [expanded, setExpanded] = useState(false)
  const isLong = post.content.length > 180

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.97 }}
      transition={{ duration: 0.18 }}
      className={`glass border rounded-xl p-4 flex flex-col gap-2 relative
        ${post.isPinned ? 'border-brand/40 bg-brand/5' : 'border-edge'}`}
    >
      {post.isPinned && (
        <span className="absolute top-3 right-3 flex items-center gap-1 text-[10px] font-semibold text-brand bg-brand/10 px-2 py-0.5 rounded-full">
          <Pin size={9} /> Pinned
        </span>
      )}

      <div className="flex items-start gap-2 pr-16">
        <div className="w-7 h-7 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center flex-shrink-0 mt-0.5">
          <span className="text-brand text-[10px] font-bold">
            {post.author?.name?.[0]?.toUpperCase() || 'A'}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-ink font-semibold text-sm leading-tight">{post.title}</p>
          <p className="text-ink-subtle text-[11px] mt-0.5">
            {post.author?.name} · {timeAgo(post.createdAt)}
          </p>
        </div>
      </div>

      <p className={`text-ink-muted text-sm leading-relaxed ml-9 ${!expanded && isLong ? 'line-clamp-3' : ''}`}>
        {post.content}
      </p>

      <div className="flex items-center justify-between ml-9">
        {isLong && (
          <button
            onClick={() => setExpanded(v => !v)}
            className="flex items-center gap-1 text-xs text-brand hover:text-brand/80 transition-colors"
          >
            {expanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
            {expanded ? 'Show less' : 'Read more'}
          </button>
        )}
        {!isLong && <span />}

        {isAdmin && (
          <div className="flex items-center gap-1">
            <button
              onClick={() => onPin(post.id)}
              title={post.isPinned ? 'Unpin' : 'Pin'}
              className="p-1.5 rounded-lg text-ink-subtle hover:text-brand hover:bg-brand/10 transition-colors"
            >
              {post.isPinned ? <PinOff size={13} /> : <Pin size={13} />}
            </button>
            <button
              onClick={() => onDelete(post.id)}
              title="Delete"
              className="p-1.5 rounded-lg text-ink-subtle hover:text-danger hover:bg-danger/10 transition-colors"
            >
              <Trash2 size={13} />
            </button>
          </div>
        )}
      </div>
    </motion.div>
  )
}

function ComposeForm({ onClose, onPosted }) {
  const [form, setForm] = useState({ title: '', content: '', isPinned: false })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  async function submit(e) {
    e.preventDefault()
    if (!form.title.trim() || !form.content.trim()) {
      setError('Title and content are required.')
      return
    }
    setSubmitting(true)
    setError('')
    try {
      await createNews(form)
      onPosted()
      onClose()
    } catch {
      setError('Failed to post. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.18 }}
      className="glass border border-brand/30 rounded-xl p-4 flex flex-col gap-3"
    >
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-ink">Post Hot News</p>
        <button onClick={onClose} className="text-ink-muted hover:text-ink p-1 rounded transition-colors">
          <X size={14} />
        </button>
      </div>

      <form onSubmit={submit} className="flex flex-col gap-2.5">
        <input
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          placeholder="Headline…"
          className="glass border border-edge rounded-lg px-3 py-2 text-sm text-ink placeholder-ink-subtle focus:outline-none focus:border-brand/50 transition-colors"
        />
        <textarea
          value={form.content}
          onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
          placeholder="Details…"
          rows={3}
          className="glass border border-edge rounded-lg px-3 py-2 text-sm text-ink placeholder-ink-subtle resize-none focus:outline-none focus:border-brand/50 transition-colors"
        />
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={form.isPinned}
            onChange={e => setForm(f => ({ ...f, isPinned: e.target.checked }))}
            className="accent-brand"
          />
          <span className="text-xs text-ink-muted">Pin this post</span>
        </label>

        {error && <p className="text-xs text-danger">{error}</p>}

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-2 rounded-lg bg-brand hover:bg-brand/90 disabled:opacity-50 text-white text-sm font-medium transition-colors"
          >
            {submitting ? 'Posting…' : 'Post'}
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg glass border border-edge text-ink-muted hover:text-ink text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </motion.div>
  )
}

export default function NewsPanel() {
  const { user } = useAuth()
  const { socket } = useSocket()
  const isAdmin = user?.role === 'admin'

  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)

  function sortPosts(list) {
    return [...list].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1
      if (!a.isPinned && b.isPinned) return 1
      return new Date(b.createdAt) - new Date(a.createdAt)
    })
  }

  useEffect(() => {
    getNews()
      .then(({ data }) => setPosts(sortPosts(data)))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    if (!socket) return
    const onNew    = post => setPosts(prev => sortPosts([post, ...prev]))
    const onUpdate = post => setPosts(prev => sortPosts(prev.map(p => p.id === post.id ? post : p)))
    const onDelete = id   => setPosts(prev => prev.filter(p => p.id !== id))

    socket.on('new_news',    onNew)
    socket.on('update_news', onUpdate)
    socket.on('delete_news', onDelete)
    return () => {
      socket.off('new_news',    onNew)
      socket.off('update_news', onUpdate)
      socket.off('delete_news', onDelete)
    }
  }, [socket])

  async function handlePin(id) {
    try {
      const { data } = await toggleNewsPin(id)
      setPosts(prev => sortPosts(prev.map(p => p.id === id ? data : p)))
    } catch {}
  }

  async function handleDelete(id) {
    try {
      await deleteNews(id)
      setPosts(prev => prev.filter(p => p.id !== id))
    } catch {}
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-edge flex-shrink-0">
        <div className="flex items-center gap-2">
          <Newspaper size={15} className="text-brand" />
          <span className="text-sm font-semibold text-ink">Hot News</span>
          {posts.length > 0 && (
            <span className="text-[10px] font-medium bg-brand/15 text-brand px-1.5 py-0.5 rounded-full">
              {posts.length}
            </span>
          )}
        </div>
        {isAdmin && (
          <button
            onClick={() => setShowForm(v => !v)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-brand/10 hover:bg-brand/20
                       text-brand text-xs font-medium transition-colors"
          >
            <Plus size={12} />
            Post
          </button>
        )}
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 min-h-0">
        <AnimatePresence>
          {showForm && (
            <ComposeForm
              key="compose"
              onClose={() => setShowForm(false)}
              onPosted={() => {}}
            />
          )}
        </AnimatePresence>

        {loading && (
          <div className="flex flex-col gap-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="glass border border-edge rounded-xl p-4 animate-pulse h-24" />
            ))}
          </div>
        )}

        {!loading && posts.length === 0 && !showForm && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <Newspaper size={28} className="text-ink-subtle mb-3" />
            <p className="text-ink-muted text-sm font-medium">No news yet</p>
            {isAdmin && (
              <p className="text-ink-subtle text-xs mt-1">Click "Post" to share the first update</p>
            )}
          </div>
        )}

        <AnimatePresence>
          {posts.map(post => (
            <NewsCard
              key={post.id}
              post={post}
              isAdmin={isAdmin}
              onPin={handlePin}
              onDelete={handleDelete}
            />
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
