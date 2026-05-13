import { useState, useEffect } from 'react'
import { Crown, Award, Check, Upload } from 'lucide-react'
import { getSpotlights, upsertSpotlight, uploadFile } from '../../services/api'

const now   = new Date()
const MONTH = now.getMonth() + 1
const YEAR  = now.getFullYear()

function SpotlightCard({ type, data, onSave }) {
  const [form, setForm]           = useState({
    name: data?.name || '', role: data?.role || '', quote: data?.quote || '',
    imageUrl: data?.imageUrl || '', month: MONTH, year: YEAR, type,
  })
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)
  const [error, setError]         = useState('')

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }))

  async function handleFileChange(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    try {
      const { data: res } = await uploadFile(file)
      setForm(f => ({ ...f, imageUrl: res.url }))
    } catch {
      setError('Upload failed')
    } finally {
      setUploading(false)
    }
  }

  async function handleSave(e) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      await onSave(form)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed')
    } finally {
      setSaving(false)
    }
  }

  const isQueen    = type === 'queen'
  const accent     = isQueen ? 'text-[#f43f5e]' : 'text-brand'
  const borderAcc  = isQueen ? 'border-l-[#f43f5e]' : 'border-l-brand'
  const Icon       = isQueen ? Crown : Award
  const label      = isQueen ? 'Queen of the Month' : 'Employee of the Month'

  const inp = "w-full bg-canvas border border-edge rounded-md px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand transition-colors"

  return (
    <div className={`bg-card border border-edge border-l-4 ${borderAcc} rounded-lg p-5`}>
      <div className={`flex items-center gap-1.5 mb-4 ${accent}`}>
        <Icon size={14} />
        <span className="text-xs font-semibold uppercase tracking-wider">{label}</span>
      </div>

      {error && <p className="text-danger text-xs mb-3">{error}</p>}

      <form onSubmit={handleSave} className="space-y-3">
        <div>
          <label className="text-ink text-xs font-medium mb-1 block">Name</label>
          <input className={inp} value={form.name} onChange={set('name')} required placeholder="Full name" />
        </div>
        <div>
          <label className="text-ink text-xs font-medium mb-1 block">Role / Department</label>
          <input className={inp} value={form.role} onChange={set('role')} required placeholder="e.g. Senior Operations Manager" />
        </div>
        <div>
          <label className="text-ink text-xs font-medium mb-1 block">Quote</label>
          <textarea className={inp + ' resize-none h-20'} value={form.quote} onChange={set('quote')} required placeholder="Recognition quote…" />
        </div>
        <div>
          <label className="text-ink text-xs font-medium mb-1 block">Photo</label>
          <div className="flex gap-2">
            <input className={inp + ' flex-1'} value={form.imageUrl} onChange={set('imageUrl')} placeholder="URL or upload below" />
            <label className="flex-shrink-0 flex items-center gap-1.5 px-3 py-2 bg-surface border border-edge rounded-md
                              text-xs text-ink-muted hover:text-ink cursor-pointer transition-colors">
              <Upload size={13} />
              {uploading ? 'Uploading…' : 'Upload'}
              <input type="file" accept="image/*" className="hidden" onChange={handleFileChange} disabled={uploading} />
            </label>
          </div>
          {form.imageUrl && (
            <img src={form.imageUrl} alt="preview" className="mt-2 h-16 w-16 object-cover rounded-md border border-edge" />
          )}
        </div>

        <button type="submit" disabled={saving}
          className="w-full flex items-center justify-center gap-2 py-2 rounded-md text-sm font-medium
                     bg-brand text-ink-on hover:bg-brand-h transition-colors disabled:opacity-60">
          <Check size={14} />
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Save changes'}
        </button>
      </form>
    </div>
  )
}

export default function AdminSpotlight() {
  const [spotlights, setSpotlights] = useState({ employee: null, queen: null })
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    getSpotlights().then(r => setSpotlights(r.data)).finally(() => setLoading(false))
  }, [])

  async function handleSave(form) {
    await upsertSpotlight(form)
    const { data } = await getSpotlights()
    setSpotlights(data)
  }

  if (loading) {
    return (
      <div className="flex justify-center py-16">
        <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-ink font-semibold text-xl">Monthly Spotlight</h1>
        <p className="text-ink-muted text-sm mt-0.5">
          Set the Employee of the Month and Queen of the Month for {new Date(YEAR, MONTH - 1).toLocaleString('default', { month: 'long', year: 'numeric' })}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <SpotlightCard type="employee" data={spotlights.employee} onSave={handleSave} />
        <SpotlightCard type="queen"    data={spotlights.queen}    onSave={handleSave} />
      </div>
    </div>
  )
}
