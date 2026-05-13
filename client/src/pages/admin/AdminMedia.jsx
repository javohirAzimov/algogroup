import { useState, useEffect } from 'react'
import { Upload, Check } from 'lucide-react'
import { getSiteMedia, updateSiteMedia, uploadFile } from '../../services/api'

function MediaSlot({ label, mediaKey, currentUrl, onUpdate }) {
  const [preview, setPreview]     = useState(currentUrl || '')
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving]       = useState(false)
  const [saved, setSaved]         = useState(false)
  const [error, setError]         = useState('')

  useEffect(() => setPreview(currentUrl || ''), [currentUrl])

  async function handleFile(e) {
    const file = e.target.files[0]
    if (!file) return
    setUploading(true)
    setError('')
    try {
      const { data } = await uploadFile(file)
      setPreview(data.url)
    } catch {
      setError('Upload failed. Max size 5 MB, images only.')
    } finally {
      setUploading(false)
    }
  }

  async function handleSave() {
    if (!preview) return
    setSaving(true)
    setError('')
    try {
      await updateSiteMedia({ key: mediaKey, imageUrl: preview })
      onUpdate(mediaKey, preview)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch {
      setError('Save failed')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-card border border-edge rounded-lg p-5">
      <h3 className="text-ink font-medium text-sm mb-3">{label}</h3>

      {preview && (
        <div className="mb-3 rounded-md overflow-hidden border border-edge bg-surface flex items-center justify-center h-36">
          <img src={preview} alt={label} className="max-h-full max-w-full object-contain" />
        </div>
      )}

      {error && <p className="text-danger text-xs mb-2">{error}</p>}

      <div className="flex gap-2">
        <label className="flex-1 flex items-center justify-center gap-2 py-2 border border-dashed border-edge
                          rounded-md text-sm text-ink-muted hover:text-ink hover:border-brand cursor-pointer transition-colors">
          <Upload size={14} />
          {uploading ? 'Uploading…' : 'Choose image'}
          <input type="file" accept="image/*" className="hidden" onChange={handleFile} disabled={uploading} />
        </label>

        <button
          onClick={handleSave}
          disabled={saving || !preview || preview === currentUrl}
          className="flex items-center gap-1.5 px-4 py-2 bg-brand text-ink-on text-sm font-medium
                     rounded-md hover:bg-brand-h transition-colors disabled:opacity-50"
        >
          <Check size={14} />
          {saving ? 'Saving…' : saved ? 'Saved!' : 'Apply'}
        </button>
      </div>

      <p className="text-ink-subtle text-xs mt-2">Or paste a URL directly:</p>
      <input
        value={preview}
        onChange={e => setPreview(e.target.value)}
        placeholder="https://… or /uploads/filename.jpg"
        className="mt-1 w-full bg-canvas border border-edge rounded-md px-3 py-1.5 text-xs text-ink
                   focus:outline-none focus:border-brand transition-colors"
      />
    </div>
  )
}

export default function AdminMedia() {
  const [media, setMedia]     = useState({})
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getSiteMedia().then(r => setMedia(r.data)).finally(() => setLoading(false))
  }, [])

  function handleUpdate(key, url) {
    setMedia(prev => ({ ...prev, [key]: url }))
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
        <h1 className="text-ink font-semibold text-xl">Site Media</h1>
        <p className="text-ink-muted text-sm mt-0.5">Upload or replace images shown on the dashboard</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <MediaSlot
          label="Management / Team Photo"
          mediaKey="management_photo"
          currentUrl={media.management_photo}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  )
}
