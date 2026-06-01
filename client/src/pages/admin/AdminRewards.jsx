import { useState, useEffect, useCallback } from 'react'
import { motion } from 'framer-motion'
import {
  Gift, Plus, Edit2, Trash2, CheckCircle2, XCircle, Truck,
  Clock, Star, Loader2, Users, Trophy, ChevronDown,
} from 'lucide-react'
import {
  adminGetAllRewards, adminCreateReward, adminUpdateReward, adminDeleteReward,
  adminGetRedemptions, adminUpdateRedemption,
  adminGrantPoints, adminAwardTournamentPts,
  getUsers, getTournaments,
} from '../../services/api'

const TIER_OPTIONS = [
  { value: 'merch', label: 'Merch'    },
  { value: 'mid',   label: 'Mid-tier' },
  { value: 'high',  label: 'Premium'  },
]

const TIER_COLORS = {
  merch: 'text-brand      bg-brand/10      border-brand/20',
  mid:   'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
  high:  'text-amber-400  bg-amber-400/10  border-amber-400/20',
}

const STATUS_ACTIONS = {
  pending:  ['approved', 'rejected'],
  approved: ['shipped',  'rejected'],
  shipped:  [],
  rejected: [],
}

const STATUS_COLORS = {
  pending:  'text-amber-400  bg-amber-400/10  border-amber-400/20',
  approved: 'text-brand      bg-brand/10      border-brand/20',
  shipped:  'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
  rejected: 'text-danger     bg-danger/10     border-danger/20',
}

function formatDate(d) { return new Date(d).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }) }

// ── Prize form ────────────────────────────────────────────────────────
const BLANK = { name: '', description: '', imageUrl: '', tier: 'merch', cost: '', stock: '-1', isActive: true }

function PrizeForm({ initial = BLANK, onSave, onCancel, saving }) {
  const [f, setF] = useState({ ...BLANK, ...initial, cost: String(initial.cost ?? ''), stock: String(initial.stock ?? '-1') })
  const set = (k, v) => setF(p => ({ ...p, [k]: v }))

  function submit(e) {
    e.preventDefault()
    onSave({
      name:        f.name.trim(),
      description: f.description.trim(),
      imageUrl:    f.imageUrl.trim() || null,
      tier:        f.tier,
      cost:        Number(f.cost),
      stock:       Number(f.stock),
      isActive:    f.isActive,
    })
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-medium text-ink-muted mb-1">Name *</label>
          <input value={f.name} onChange={e => set('name', e.target.value)} required
            className="w-full glass border border-edge rounded-xl px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand/50" />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-muted mb-1">Tier *</label>
          <select value={f.tier} onChange={e => set('tier', e.target.value)}
            className="w-full glass border border-edge rounded-xl px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand/50 bg-surface">
            {TIER_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-muted mb-1">Cost (pts) *</label>
          <input type="number" min={1} value={f.cost} onChange={e => set('cost', e.target.value)} required
            className="w-full glass border border-edge rounded-xl px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand/50" />
        </div>
        <div>
          <label className="block text-xs font-medium text-ink-muted mb-1">Stock (-1 = unlimited)</label>
          <input type="number" min={-1} value={f.stock} onChange={e => set('stock', e.target.value)}
            className="w-full glass border border-edge rounded-xl px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand/50" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-medium text-ink-muted mb-1">Image URL (or /public path)</label>
        <input value={f.imageUrl} onChange={e => set('imageUrl', e.target.value)} placeholder="/filename.jfif or https://…"
          className="w-full glass border border-edge rounded-xl px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand/50" />
      </div>
      <div>
        <label className="block text-xs font-medium text-ink-muted mb-1">Description</label>
        <textarea value={f.description} onChange={e => set('description', e.target.value)} rows={2}
          className="w-full glass border border-edge rounded-xl px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand/50 resize-none" />
      </div>
      <div className="flex items-center gap-2">
        <input type="checkbox" id="isActive" checked={f.isActive} onChange={e => set('isActive', e.target.checked)}
          className="accent-brand" />
        <label htmlFor="isActive" className="text-sm text-ink-muted cursor-pointer">Active (visible in store)</label>
      </div>
      <div className="flex gap-3 pt-1">
        <button type="button" onClick={onCancel}
          className="flex-1 py-2 rounded-xl border border-edge text-sm text-ink-muted hover:text-ink hover:bg-white/5 transition-colors">
          Cancel
        </button>
        <button type="submit" disabled={saving}
          className="flex-1 py-2 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand/90 disabled:opacity-60 transition-colors flex items-center justify-center gap-1.5">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <CheckCircle2 size={14} />}
          Save
        </button>
      </div>
    </form>
  )
}

// ── Tab: Prize Catalog ────────────────────────────────────────────────
function CatalogTab() {
  const [rewards, setRewards] = useState([])
  const [loading, setLoading] = useState(true)
  const [adding,  setAdding]  = useState(false)
  const [editing, setEditing] = useState(null)
  const [saving,  setSaving]  = useState(false)

  const load = useCallback(() => {
    setLoading(true)
    adminGetAllRewards().then(r => setRewards(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [])
  useEffect(() => { load() }, [load])

  async function handleSave(data) {
    setSaving(true)
    try {
      if (editing) await adminUpdateReward(editing.id, data)
      else          await adminCreateReward(data)
      setAdding(false); setEditing(null)
      load()
    } catch {/* handled */} finally { setSaving(false) }
  }

  async function handleDelete(id) {
    if (!window.confirm('Deactivate this prize?')) return
    await adminDeleteReward(id)
    load()
  }

  if (loading) return <div className="flex justify-center py-10"><Loader2 size={20} className="text-brand animate-spin" /></div>

  return (
    <div className="space-y-4">
      {(adding || editing) && (
        <div className="glass border border-brand/20 rounded-2xl p-5">
          <h4 className="text-sm font-semibold text-ink mb-4">{editing ? 'Edit Prize' : 'New Prize'}</h4>
          <PrizeForm
            initial={editing || BLANK}
            onSave={handleSave}
            onCancel={() => { setAdding(false); setEditing(null) }}
            saving={saving}
          />
        </div>
      )}

      {!adding && !editing && (
        <button onClick={() => setAdding(true)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand/10 border border-brand/20
                     text-brand text-sm font-medium hover:bg-brand/20 transition-colors cursor-pointer">
          <Plus size={15} />
          Add Prize
        </button>
      )}

      <div className="space-y-3">
        {rewards.map(r => (
          <div key={r.id} className={`glass border border-edge rounded-xl px-4 py-3 flex items-center gap-3 ${!r.isActive ? 'opacity-50' : ''}`}>
            {r.imageUrl && (
              <img src={r.imageUrl} alt={r.name} className="w-10 h-10 rounded-lg object-cover flex-shrink-0 border border-edge" />
            )}
            {!r.imageUrl && (
              <div className="w-10 h-10 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center flex-shrink-0">
                <Gift size={16} className="text-brand" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <p className="text-sm font-medium text-ink truncate">{r.name}</p>
                <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${TIER_COLORS[r.tier]}`}>
                  {r.tier}
                </span>
                {!r.isActive && <span className="text-[10px] text-danger border border-danger/20 px-1.5 py-0.5 rounded">Inactive</span>}
              </div>
              <div className="flex items-center gap-3 mt-0.5">
                <span className="text-xs text-brand font-semibold flex items-center gap-0.5">
                  <Star size={10} className="fill-brand" />{r.cost.toLocaleString()} pts
                </span>
                <span className="text-xs text-ink-subtle">Stock: {r.stock === -1 ? '∞' : r.stock}</span>
                <span className="text-xs text-ink-subtle">{r._count.redemptions} redeemed</span>
              </div>
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              <button onClick={() => { setEditing(r); setAdding(false) }}
                className="p-1.5 rounded-lg text-ink-subtle hover:text-ink hover:bg-white/5 transition-colors cursor-pointer">
                <Edit2 size={13} />
              </button>
              <button onClick={() => handleDelete(r.id)}
                className="p-1.5 rounded-lg text-ink-subtle hover:text-danger hover:bg-danger/10 transition-colors cursor-pointer">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// ── Tab: Redemption Requests ──────────────────────────────────────────
function RedemptionsTab() {
  const [redemptions, setRedemptions] = useState([])
  const [loading,     setLoading]     = useState(true)
  const [filter,      setFilter]      = useState('pending')
  const [updating,    setUpdating]    = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    adminGetRedemptions(filter || undefined).then(r => setRedemptions(r.data)).catch(() => {}).finally(() => setLoading(false))
  }, [filter])
  useEffect(() => { load() }, [load])

  async function handleStatus(id, status) {
    setUpdating(id)
    try {
      await adminUpdateRedemption(id, { status })
      load()
    } catch {/* handled */} finally { setUpdating(null) }
  }

  return (
    <div className="space-y-4">
      {/* Filter pills */}
      <div className="flex gap-1.5 flex-wrap">
        {['pending', 'approved', 'shipped', 'rejected', ''].map(s => (
          <button key={s || 'all'} onClick={() => setFilter(s)}
            className={`px-3 py-1 rounded-full text-xs font-medium transition-all border
              ${filter === s
                ? 'bg-brand text-white border-brand'
                : 'border-edge text-ink-muted hover:text-ink hover:border-brand/30'
              }`}
          >
            {s || 'All'}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex justify-center py-10"><Loader2 size={20} className="text-brand animate-spin" /></div>
      ) : redemptions.length === 0 ? (
        <p className="text-center text-ink-muted text-sm py-10">No redemptions found</p>
      ) : (
        <div className="space-y-3">
          {redemptions.map(r => {
            const actions = STATUS_ACTIONS[r.status] || []
            return (
              <div key={r.id} className="glass border border-edge rounded-xl p-4">
                <div className="flex items-start justify-between gap-3 flex-wrap">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 flex-wrap mb-1">
                      <p className="text-sm font-semibold text-ink">{r.reward.name}</p>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${TIER_COLORS[r.reward.tier]}`}>
                        {r.reward.tier}
                      </span>
                      <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-semibold border ${STATUS_COLORS[r.status]}`}>
                        {r.status}
                      </span>
                    </div>
                    <p className="text-xs text-ink-muted">{r.user.name} · {r.user.department || r.user.email}</p>
                    <p className="text-xs text-ink-subtle mt-0.5">{formatDate(r.createdAt)}</p>
                  </div>
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <span className="text-xs text-brand font-semibold flex items-center gap-0.5">
                      <Star size={10} className="fill-brand" />{r.reward.cost.toLocaleString()} pts
                    </span>
                    {actions.map(action => (
                      <button
                        key={action}
                        onClick={() => handleStatus(r.id, action)}
                        disabled={updating === r.id}
                        className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors disabled:opacity-50 cursor-pointer
                          ${action === 'rejected'
                            ? 'border-danger/30 text-danger hover:bg-danger/10'
                            : 'border-brand/30 text-brand hover:bg-brand/10'
                          }`}
                      >
                        {updating === r.id ? <Loader2 size={10} className="animate-spin" /> : action}
                      </button>
                    ))}
                  </div>
                </div>
                {r.notes && <p className="text-xs text-ink-subtle mt-2 italic">{r.notes}</p>}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

// ── Tab: Grant Points ─────────────────────────────────────────────────
function GrantTab() {
  const [users,        setUsers]        = useState([])
  const [tournaments,  setTournaments]  = useState([])
  const [loading,      setLoading]      = useState(true)
  const [grantForm,    setGrantForm]    = useState({ userId: '', amount: '', note: '' })
  const [granting,     setGranting]     = useState(false)
  const [grantMsg,     setGrantMsg]     = useState(null)
  const [awarTournId,  setAwarTournId]  = useState('')
  const [awarding,     setAwarding]     = useState(false)
  const [awardMsg,     setAwardMsg]     = useState(null)

  useEffect(() => {
    Promise.allSettled([getUsers(), getTournaments()])
      .then(([u, t]) => {
        if (u.status === 'fulfilled') setUsers(u.value.data)
        if (t.status === 'fulfilled') setTournaments(t.value.data)
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleGrant(e) {
    e.preventDefault()
    setGranting(true); setGrantMsg(null)
    try {
      const { data } = await adminGrantPoints(grantForm)
      setGrantMsg({ type: 'success', text: `Granted ${grantForm.amount} pts to ${data.name} (balance: ${data.points})` })
      setGrantForm({ userId: '', amount: '', note: '' })
    } catch (err) {
      setGrantMsg({ type: 'error', text: err.response?.data?.error || 'Failed to grant points' })
    } finally { setGranting(false) }
  }

  async function handleAwardTournament(e) {
    e.preventDefault()
    if (!awarTournId) return
    setAwarding(true); setAwardMsg(null)
    try {
      const { data } = await adminAwardTournamentPts(awarTournId)
      setAwardMsg({ type: 'success', text: `Awarded points to ${data.awarded} players in "${data.tournament}"` })
    } catch (err) {
      setAwardMsg({ type: 'error', text: err.response?.data?.error || 'Failed to award points' })
    } finally { setAwarding(false) }
  }

  if (loading) return <div className="flex justify-center py-10"><Loader2 size={20} className="text-brand animate-spin" /></div>

  return (
    <div className="space-y-6">
      {/* Manual grant */}
      <div className="glass border border-edge rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Users size={16} className="text-brand" />
          <h4 className="text-sm font-semibold text-ink">Grant Points to User</h4>
        </div>
        <form onSubmit={handleGrant} className="space-y-3">
          <div>
            <label className="block text-xs font-medium text-ink-muted mb-1">User</label>
            <select value={grantForm.userId} onChange={e => setGrantForm(p => ({ ...p, userId: e.target.value }))} required
              className="w-full glass border border-edge rounded-xl px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand/50 bg-surface">
              <option value="">Select user…</option>
              {users.map(u => <option key={u.id} value={u.id}>{u.name} — {u.department || u.email}</option>)}
            </select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1">Amount (pts)</label>
              <input type="number" value={grantForm.amount} onChange={e => setGrantForm(p => ({ ...p, amount: e.target.value }))} required
                className="w-full glass border border-edge rounded-xl px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand/50" />
            </div>
            <div>
              <label className="block text-xs font-medium text-ink-muted mb-1">Note</label>
              <input value={grantForm.note} onChange={e => setGrantForm(p => ({ ...p, note: e.target.value }))} placeholder="Reason…"
                className="w-full glass border border-edge rounded-xl px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand/50" />
            </div>
          </div>
          {grantMsg && (
            <p className={`text-xs font-medium ${grantMsg.type === 'error' ? 'text-danger' : 'text-brand'}`}>{grantMsg.text}</p>
          )}
          <button type="submit" disabled={granting}
            className="w-full py-2 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand/90 disabled:opacity-60 transition-colors flex items-center justify-center gap-1.5">
            {granting ? <Loader2 size={14} className="animate-spin" /> : <Star size={14} />}
            Grant Points
          </button>
        </form>
      </div>

      {/* Tournament points */}
      <div className="glass border border-edge rounded-2xl p-5">
        <div className="flex items-center gap-2 mb-4">
          <Trophy size={16} className="text-brand" />
          <h4 className="text-sm font-semibold text-ink">Award Tournament Points</h4>
          <span className="text-xs text-ink-subtle ml-1">1st: 500 · 2nd: 250 · 3rd: 100 · 4th-10th: 50</span>
        </div>
        <form onSubmit={handleAwardTournament} className="space-y-3">
          <select value={awarTournId} onChange={e => setAwarTournId(e.target.value)} required
            className="w-full glass border border-edge rounded-xl px-3 py-2 text-sm text-ink focus:outline-none focus:border-brand/50 bg-surface">
            <option value="">Select tournament…</option>
            {tournaments.map(t => <option key={t.id} value={t.id}>{t.title}</option>)}
          </select>
          {awardMsg && (
            <p className={`text-xs font-medium ${awardMsg.type === 'error' ? 'text-danger' : 'text-brand'}`}>{awardMsg.text}</p>
          )}
          <button type="submit" disabled={awarding || !awarTournId}
            className="w-full py-2 rounded-xl bg-brand text-white text-sm font-semibold hover:bg-brand/90 disabled:opacity-60 transition-colors flex items-center justify-center gap-1.5">
            {awarding ? <Loader2 size={14} className="animate-spin" /> : <Trophy size={14} />}
            Award Points to Top Players
          </button>
        </form>
      </div>
    </div>
  )
}

// ── Main admin page ───────────────────────────────────────────────────
const ADMIN_TABS = [
  { key: 'catalog',     label: 'Prize Catalog',         icon: Gift   },
  { key: 'redemptions', label: 'Redemption Requests',   icon: Clock  },
  { key: 'grant',       label: 'Grant Points',          icon: Star   },
]

export default function AdminRewards() {
  const [tab, setTab] = useState('catalog')

  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.2 }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-brand flex items-center justify-center">
          <Gift size={18} className="text-white" />
        </div>
        <div>
          <h1 className="text-lg font-semibold text-ink">Rewards Store</h1>
          <p className="text-xs text-ink-subtle">Manage prizes, redemptions and points</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b border-edge">
        {ADMIN_TABS.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 px-3 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors
              ${tab === key
                ? 'border-brand text-brand'
                : 'border-transparent text-ink-muted hover:text-ink'
              }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}
      </div>

      {tab === 'catalog'     && <CatalogTab />}
      {tab === 'redemptions' && <RedemptionsTab />}
      {tab === 'grant'       && <GrantTab />}
    </motion.div>
  )
}
