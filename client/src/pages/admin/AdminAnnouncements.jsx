import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Plus, Pencil, Trash2, X, Check, Upload } from 'lucide-react'
import { getAnnouncements, createAnnouncement, updateAnnouncement, deleteAnnouncement, uploadFile } from '../../services/api'

const EMPTY = { title: '', description: '', date: '', type: 'event', imageUrl: '' }

function AnnouncementForm({ initial, onSave, onCancel }) {
  const [form, setForm]         = useState(initial)
  const [loading, setLoading]   = useState(false)
  const [uploading, setUploading] = useState(false)
  const [error, setError]       = useState('')

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleFileUpload(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const { data } = await uploadFile(file)
      setForm(f => ({ ...f, imageUrl: data.url }))
    } catch {
      setError('Image upload failed. Max 5 MB, images only.')
    } finally {
      setUploading(false)
    }
  }

  async function submit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await onSave(form)
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed')
    } finally {
      setLoading(false)
    }
  }

  const inp = "w-full bg-canvas border border-edge rounded-md px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand transition-colors"

  return (
    <form onSubmit={submit} className="bg-card border border-edge rounded-lg p-5 space-y-4">
      {error && <p className="text-danger text-sm">{error}</p>}
      <div className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="text-ink text-xs font-medium mb-1 block">Title</label>
          <input className={inp} value={form.title} onChange={set('title')} required placeholder="Announcement title" />
        </div>
        <div>
          <label className="text-ink text-xs font-medium mb-1 block">Date</label>
          <input className={inp} type="date" value={form.date ? form.date.slice(0, 10) : ''} onChange={set('date')} required />
        </div>
        <div>
          <label className="text-ink text-xs font-medium mb-1 block">Type</label>
          <select className={inp} value={form.type} onChange={set('type')}>
            <option value="event">Event</option>
            <option value="notice">Notice</option>
          </select>
        </div>
        <div className="col-span-2">
          <label className="text-ink text-xs font-medium mb-1 block">Description</label>
          <textarea className={inp + ' resize-none h-24'} value={form.description} onChange={set('description')} required placeholder="Description…" />
        </div>
        <div className="col-span-2">
          <label className="text-ink text-xs font-medium mb-1 block">
            Banner image <span className="text-ink-subtle font-normal">(optional)</span>
          </label>
          <div className="flex gap-2">
            <input
              className={inp + ' flex-1'}
              value={form.imageUrl}
              onChange={set('imageUrl')}
              placeholder="Paste URL or upload a file →"
            />
            <label className={`flex-shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-md text-sm border
                               transition-colors cursor-pointer
                               ${uploading
                                 ? 'border-edge text-ink-subtle opacity-60 cursor-not-allowed'
                                 : 'border-edge text-ink-muted hover:text-ink hover:border-brand bg-surface'}`}>
              <Upload size={13} />
              {uploading ? 'Uploading…' : 'Upload'}
              <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
            </label>
          </div>
          {form.imageUrl && (
            <img src={form.imageUrl} alt="preview"
                 className="mt-2 h-20 w-full object-cover rounded-md border border-edge" />
          )}
        </div>
      </div>
      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm text-ink-muted hover:text-ink hover:bg-surface transition-colors">
          <X size={14} /> Cancel
        </button>
        <button type="submit" disabled={loading || uploading}
          className="flex items-center gap-1.5 px-4 py-1.5 rounded-md text-sm bg-brand text-ink-on hover:bg-brand-h transition-colors disabled:opacity-60">
          <Check size={14} /> {loading ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  )
}

export default function AdminAnnouncements() {
  const [items, setItems]     = useState([])
  const [editing, setEditing] = useState(null)   // null | 'new' | item.id
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnnouncements().then(r => setItems(r.data)).finally(() => setLoading(false))
  }, [])

  async function handleCreate(form) {
    const { data } = await createAnnouncement(form)
    setItems(prev => [data, ...prev])
    setEditing(null)
  }

  async function handleUpdate(id, form) {
    const { data } = await updateAnnouncement(id, form)
    setItems(prev => prev.map(i => i.id === id ? data : i))
    setEditing(null)
  }

  async function handleDelete(id) {
    if (!confirm('Delete this announcement?')) return
    await deleteAnnouncement(id)
    setItems(prev => prev.filter(i => i.id !== id))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-ink font-semibold text-xl">Announcements</h1>
          <p className="text-ink-muted text-sm mt-0.5">Create and manage company announcements</p>
        </div>
        {editing !== 'new' && (
          <button
            onClick={() => setEditing('new')}
            className="flex items-center gap-2 px-4 py-2 bg-brand text-ink-on text-sm font-medium rounded-md hover:bg-brand-h transition-colors"
          >
            <Plus size={15} /> New announcement
          </button>
        )}
      </div>

      <AnimatePresence>
        {editing === 'new' && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="mb-4">
            <AnnouncementForm initial={EMPTY} onSave={handleCreate} onCancel={() => setEditing(null)} />
          </motion.div>
        )}
      </AnimatePresence>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="space-y-3">
          {items.map(item => (
            <motion.div key={item.id} layout className="bg-card border border-edge rounded-lg overflow-hidden">
              {editing === item.id ? (
                <div className="p-1">
                  <AnnouncementForm
                    initial={{ ...item, date: item.date?.slice(0, 10) || '' }}
                    onSave={(form) => handleUpdate(item.id, form)}
                    onCancel={() => setEditing(null)}
                  />
                </div>
              ) : (
                <div className="flex items-start gap-4 p-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className={`text-xs font-medium px-2 py-0.5 rounded-full
                        ${item.type === 'event' ? 'bg-brand-soft text-brand' : 'bg-warning/10 text-warning'}`}>
                        {item.type}
                      </span>
                      <span className="text-ink-subtle text-xs">{new Date(item.date).toLocaleDateString()}</span>
                    </div>
                    <p className="text-ink font-medium text-sm">{item.title}</p>
                    <p className="text-ink-muted text-xs mt-0.5 line-clamp-2">{item.description}</p>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <button onClick={() => setEditing(item.id)}
                      className="p-1.5 text-ink-subtle hover:text-ink rounded-md hover:bg-surface transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(item.id)}
                      className="p-1.5 text-ink-subtle hover:text-danger rounded-md hover:bg-surface transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
          {items.length === 0 && (
            <p className="text-ink-muted text-sm text-center py-12">No announcements yet. Create one above.</p>
          )}
        </div>
      )}
    </div>
  )
}
