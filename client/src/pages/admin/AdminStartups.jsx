import { useState, useEffect } from 'react'
import { Rocket, Plus, Pencil, Trash2, X, Check } from 'lucide-react'
import { getStartups, createStartup, updateStartup, deleteStartup } from '../../services/api'

const STAGES = ['Idea', 'MVP', 'Growth', 'Scale']

const EMPTY = { name: '', tagline: '', description: '', logoUrl: '', stage: 'Idea', teamLead: '', website: '' }

function StartupForm({ initial = EMPTY, onSave, onCancel, saving }) {
  const [form, setForm] = useState(initial)
  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  const inputCls = `w-full bg-canvas border border-edge rounded-lg px-3 py-2 text-sm text-ink
                    placeholder-ink-subtle focus:outline-none focus:border-brand transition-colors`

  return (
    <form onSubmit={e => { e.preventDefault(); onSave(form) }}
          className="bg-card border border-edge rounded-xl p-5 flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="text-xs font-medium text-ink-muted mb-1 block">Name *</label>
          <input value={form.name} onChange={set('name')} placeholder="Startup name" required className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-medium text-ink-muted mb-1 block">Tagline</label>
          <input value={form.tagline} onChange={set('tagline')} placeholder="One-line pitch" className={inputCls} />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-ink-muted mb-1 block">Description *</label>
        <textarea value={form.description} onChange={set('description')} rows={3}
                  placeholder="What does this startup do?" required
                  className={`${inputCls} resize-none`} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label className="text-xs font-medium text-ink-muted mb-1 block">Stage</label>
          <select value={form.stage} onChange={set('stage')} className={inputCls}>
            {STAGES.map(s => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
        <div>
          <label className="text-xs font-medium text-ink-muted mb-1 block">Team Lead *</label>
          <input value={form.teamLead} onChange={set('teamLead')} placeholder="Full name" required className={inputCls} />
        </div>
        <div>
          <label className="text-xs font-medium text-ink-muted mb-1 block">Website</label>
          <input value={form.website} onChange={set('website')} placeholder="https://..." className={inputCls} />
        </div>
      </div>

      <div>
        <label className="text-xs font-medium text-ink-muted mb-1 block">Logo URL</label>
        <input value={form.logoUrl} onChange={set('logoUrl')} placeholder="https://..." className={inputCls} />
      </div>

      <div className="flex gap-2 justify-end">
        <button type="button" onClick={onCancel}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm text-ink-muted hover:bg-white/5 transition-colors">
          <X size={14} /> Cancel
        </button>
        <button type="submit" disabled={saving}
                className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-sm bg-brand text-white font-medium
                           hover:bg-brand/90 disabled:opacity-60 transition-colors">
          <Check size={14} /> {saving ? 'Saving…' : 'Save'}
        </button>
      </div>
    </form>
  )
}

export default function AdminStartups() {
  const [startups, setStartups] = useState([])
  const [loading, setLoading]   = useState(true)
  const [adding, setAdding]     = useState(false)
  const [editId, setEditId]     = useState(null)
  const [saving, setSaving]     = useState(false)
  const [error, setError]       = useState('')

  function load() {
    getStartups().then(r => setStartups(r.data)).catch(() => {}).finally(() => setLoading(false))
  }
  useEffect(load, [])

  async function handleCreate(form) {
    setSaving(true); setError('')
    try {
      await createStartup(form)
      setAdding(false)
      load()
    } catch (e) { setError(e.response?.data?.error || 'Failed to save') }
    finally { setSaving(false) }
  }

  async function handleUpdate(id, form) {
    setSaving(true); setError('')
    try {
      await updateStartup(id, form)
      setEditId(null)
      load()
    } catch (e) { setError(e.response?.data?.error || 'Failed to save') }
    finally { setSaving(false) }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this startup?')) return
    try { await deleteStartup(id); load() } catch { setError('Failed to delete') }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Rocket size={20} className="text-brand" />
          <h1 className="text-xl font-semibold text-ink">Start-Ups</h1>
        </div>
        {!adding && (
          <button onClick={() => { setAdding(true); setEditId(null) }}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand/90 transition-colors">
            <Plus size={14} /> Add Startup
          </button>
        )}
      </div>

      {error && <p className="text-danger text-sm mb-4">{error}</p>}

      {adding && (
        <div className="mb-6">
          <StartupForm onSave={handleCreate} onCancel={() => setAdding(false)} saving={saving} />
        </div>
      )}

      {loading ? (
        <p className="text-ink-muted text-sm">Loading…</p>
      ) : startups.length === 0 && !adding ? (
        <div className="text-center py-16 text-ink-muted text-sm">No start-ups yet. Add one above.</div>
      ) : (
        <div className="flex flex-col gap-3">
          {startups.map(s => (
            <div key={s.id}>
              {editId === s.id ? (
                <StartupForm
                  initial={{ name: s.name, tagline: s.tagline || '', description: s.description,
                             logoUrl: s.logoUrl || '', stage: s.stage, teamLead: s.teamLead, website: s.website || '' }}
                  onSave={(form) => handleUpdate(s.id, form)}
                  onCancel={() => setEditId(null)}
                  saving={saving}
                />
              ) : (
                <div className="bg-card border border-edge rounded-xl p-4 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="text-ink font-semibold text-sm">{s.name}</p>
                      <span className="px-2 py-0.5 rounded-full bg-brand/10 text-brand text-[10px] font-medium border border-brand/20">
                        {s.stage}
                      </span>
                    </div>
                    {s.tagline && <p className="text-brand text-xs mb-1">{s.tagline}</p>}
                    <p className="text-ink-muted text-xs truncate max-w-lg">{s.description}</p>
                    <p className="text-ink-subtle text-[11px] mt-1">Lead: {s.teamLead}</p>
                  </div>
                  <div className="flex gap-1 flex-shrink-0">
                    <button onClick={() => { setEditId(s.id); setAdding(false) }}
                            className="p-1.5 rounded-lg text-ink-subtle hover:text-ink hover:bg-white/5 transition-colors">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(s.id)}
                            className="p-1.5 rounded-lg text-ink-subtle hover:text-danger hover:bg-danger/10 transition-colors">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
