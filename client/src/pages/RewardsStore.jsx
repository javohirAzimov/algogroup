import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Gift, Star, Coins, ChevronRight, X, CheckCircle2,
  Package, Truck, XCircle, Clock, Loader2, ShoppingBag,
} from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import {
  getRewardsStore, redeemReward as apiRedeem, getMyRedemptions,
} from '../services/api'

// ── Tier config ───────────────────────────────────────────────────────
const TIER = {
  merch: { label: 'Merch',    color: 'text-brand',      bg: 'bg-brand/10',      border: 'border-brand/20',      gradient: 'from-brand/20 to-brand/5'   },
  mid:   { label: 'Mid-tier', color: 'text-indigo-400', bg: 'bg-indigo-400/10', border: 'border-indigo-400/20', gradient: 'from-indigo-500/20 to-indigo-500/5' },
  high:  { label: 'Premium',  color: 'text-amber-400',  bg: 'bg-amber-400/10',  border: 'border-amber-400/20',  gradient: 'from-amber-400/20 to-amber-400/5'   },
}

const STATUS_CONFIG = {
  pending:  { icon: Clock,        label: 'Pending',   cls: 'text-amber-400  bg-amber-400/10  border-amber-400/20'  },
  approved: { icon: CheckCircle2, label: 'Approved',  cls: 'text-brand      bg-brand/10      border-brand/20'      },
  shipped:  { icon: Truck,        label: 'Shipped',   cls: 'text-indigo-400 bg-indigo-400/10 border-indigo-400/20' },
  rejected: { icon: XCircle,      label: 'Rejected',  cls: 'text-danger     bg-danger/10     border-danger/20'     },
}

const TABS = [
  { key: 'all',   label: 'All Rewards' },
  { key: 'merch', label: 'Merch'       },
  { key: 'mid',   label: 'Mid-tier'    },
  { key: 'high',  label: 'Premium'     },
]

function formatDate(d) {
  return new Date(d).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })
}

// ── Prize image with tier gradient fallback ───────────────────────────
function PrizeImage({ imageUrl, tier, name }) {
  const t = TIER[tier] || TIER.merch
  const [imgErr, setImgErr] = useState(false)
  if (!imageUrl || imgErr) {
    return (
      <div className={`w-full h-40 flex items-center justify-center bg-gradient-to-br ${t.gradient} border-b border-edge`}>
        <Gift size={40} className={`${t.color} opacity-60`} />
      </div>
    )
  }
  return (
    <img
      src={imageUrl}
      alt={name}
      onError={() => setImgErr(true)}
      className="w-full h-40 object-cover border-b border-edge"
    />
  )
}

// ── Stock indicator ───────────────────────────────────────────────────
function StockBadge({ stock }) {
  if (stock === -1) return null
  if (stock === 0) return <span className="text-[10px] font-semibold text-danger">Out of stock</span>
  if (stock <= 3)  return <span className="text-[10px] font-semibold text-amber-400">Only {stock} left</span>
  return <span className="text-[10px] text-ink-subtle">{stock} in stock</span>
}

// ── Prize card ────────────────────────────────────────────────────────
function PrizeCard({ reward, userPoints, onRedeem, redeeming }) {
  const t         = TIER[reward.tier] || TIER.merch
  const canAfford = userPoints >= reward.cost
  const inStock   = reward.stock !== 0
  const disabled  = !canAfford || !inStock || redeeming

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y:  0 }}
      className="glass border border-edge rounded-2xl overflow-hidden flex flex-col hover:border-brand/20 transition-all duration-200 group"
    >
      <PrizeImage imageUrl={reward.imageUrl} tier={reward.tier} name={reward.name} />

      <div className="p-4 flex flex-col flex-1 gap-3">
        {/* Tier + stock */}
        <div className="flex items-center justify-between">
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold border ${t.color} ${t.bg} ${t.border}`}>
            {t.label}
          </span>
          <StockBadge stock={reward.stock} />
        </div>

        {/* Name + description */}
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-ink leading-tight">{reward.name}</h3>
          {reward.description && (
            <p className="text-ink-subtle text-xs mt-1 line-clamp-2 leading-relaxed">{reward.description}</p>
          )}
        </div>

        {/* Cost + redeem */}
        <div className="flex items-center justify-between gap-2 pt-1 border-t border-edge">
          <div className="flex items-center gap-1">
            <Star size={12} className="text-brand fill-brand" />
            <span className="text-sm font-bold text-brand tabular-nums">{reward.cost.toLocaleString()}</span>
            <span className="text-xs text-ink-subtle">pts</span>
          </div>
          <button
            onClick={() => onRedeem(reward)}
            disabled={disabled}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold
                       bg-brand text-white hover:bg-brand/90 disabled:opacity-40 disabled:cursor-not-allowed
                       transition-all duration-150 active:scale-95 cursor-pointer"
          >
            {redeeming ? <Loader2 size={11} className="animate-spin" /> : <Gift size={11} />}
            Redeem
          </button>
        </div>

        {!canAfford && inStock && (
          <p className="text-[10px] text-ink-subtle text-center -mt-1">
            Need {(reward.cost - userPoints).toLocaleString()} more pts
          </p>
        )}
      </div>
    </motion.div>
  )
}

// ── Confirm modal ─────────────────────────────────────────────────────
function ConfirmModal({ reward, userPoints, onConfirm, onClose, loading }) {
  if (!reward) return null
  const t = TIER[reward.tier] || TIER.merch
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.92, opacity: 0, y: 16 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.92, opacity: 0, y: 16 }}
        transition={{ duration: 0.2 }}
        className="glass border border-edge rounded-2xl p-6 max-w-sm w-full shadow-2xl"
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-ink">Confirm Redemption</h3>
          <button onClick={onClose} className="text-ink-subtle hover:text-ink transition-colors p-1 rounded-lg hover:bg-white/5">
            <X size={16} />
          </button>
        </div>

        <div className={`rounded-xl border ${t.border} ${t.bg} p-4 mb-4`}>
          <p className="text-sm font-semibold text-ink">{reward.name}</p>
          <p className="text-xs text-ink-muted mt-0.5 line-clamp-2">{reward.description}</p>
        </div>

        <div className="flex items-center justify-between text-sm mb-6">
          <span className="text-ink-muted">Your balance</span>
          <div className="flex items-center gap-1">
            <Star size={13} className="text-brand fill-brand" />
            <span className="font-bold text-brand">{userPoints.toLocaleString()} pts</span>
          </div>
        </div>
        <div className="flex items-center justify-between text-sm mb-1">
          <span className="text-ink-muted">Cost</span>
          <span className="font-bold text-danger">− {reward.cost.toLocaleString()} pts</span>
        </div>
        <div className="h-px bg-edge mb-3" />
        <div className="flex items-center justify-between text-sm mb-6">
          <span className="text-ink-muted">After redemption</span>
          <span className="font-bold text-ink">{(userPoints - reward.cost).toLocaleString()} pts</span>
        </div>

        <p className="text-xs text-ink-subtle mb-5 leading-relaxed">
          Your request will be reviewed by an admin. Once approved, you'll be notified and the item will be shipped/delivered.
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 py-2 rounded-xl border border-edge text-sm text-ink-muted hover:text-ink hover:bg-white/5 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 py-2 rounded-xl bg-brand text-white text-sm font-semibold
                       hover:bg-brand/90 disabled:opacity-60 transition-colors flex items-center justify-center gap-1.5"
          >
            {loading ? <Loader2 size={14} className="animate-spin" /> : <Gift size={14} />}
            Confirm
          </button>
        </div>
      </motion.div>
    </motion.div>
  )
}

// ── Redemption history row ────────────────────────────────────────────
function RedemptionRow({ r }) {
  const cfg = STATUS_CONFIG[r.status] || STATUS_CONFIG.pending
  const Icon = cfg.icon
  return (
    <div className="flex items-center gap-3 py-3 border-b border-edge/50 last:border-0">
      <div className="w-9 h-9 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center flex-shrink-0">
        <Package size={14} className="text-brand" />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-ink truncate">{r.reward.name}</p>
        <p className="text-xs text-ink-subtle">{formatDate(r.createdAt)}</p>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-xs text-ink-subtle">
          <Star size={10} className="text-brand fill-brand" />
          <span>{r.reward.cost.toLocaleString()}</span>
        </div>
        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${cfg.cls}`}>
          <Icon size={10} />
          {cfg.label}
        </span>
      </div>
    </div>
  )
}

// ── Main page ─────────────────────────────────────────────────────────
export default function RewardsStore() {
  const { user, setUser } = useAuth()
  const [activeTab,    setActiveTab]    = useState('all')
  const [rewards,      setRewards]      = useState([])
  const [userPoints,   setUserPoints]   = useState(user?.points ?? 0)
  const [redemptions,  setRedemptions]  = useState([])
  const [loading,      setLoading]      = useState(true)
  const [redeemTarget, setRedeemTarget] = useState(null)
  const [redeeming,    setRedeeming]    = useState(false)
  const [redeemingId,  setRedeemingId]  = useState(null)
  const [toast,        setToast]        = useState(null)

  const load = useCallback(() => {
    setLoading(true)
    Promise.allSettled([getRewardsStore(), getMyRedemptions()])
      .then(([store, hist]) => {
        if (store.status === 'fulfilled') {
          setRewards(store.value.data.rewards)
          setUserPoints(store.value.data.userPoints)
          setUser(prev => ({ ...prev, points: store.value.data.userPoints }))
        }
        if (hist.status === 'fulfilled') setRedemptions(hist.value.data)
      })
      .finally(() => setLoading(false))
  }, [setUser])

  useEffect(() => { load() }, [load])

  function showToast(msg, type = 'success') {
    setToast({ msg, type })
    setTimeout(() => setToast(null), 3500)
  }

  async function handleConfirmRedeem() {
    if (!redeemTarget) return
    setRedeeming(true)
    setRedeemingId(redeemTarget.id)
    try {
      await apiRedeem(redeemTarget.id)
      showToast(`"${redeemTarget.name}" redemption submitted! Pending admin approval.`)
      setRedeemTarget(null)
      load()
    } catch (err) {
      showToast(err.response?.data?.error || 'Redemption failed', 'error')
    } finally {
      setRedeeming(false)
      setRedeemingId(null)
    }
  }

  const filtered = activeTab === 'all' ? rewards : rewards.filter(r => r.tier === activeTab)
  const pendingCount = redemptions.filter(r => r.status === 'pending').length

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center gap-4">
        <div className="w-11 h-11 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center">
          <Gift size={20} className="text-brand" />
        </div>
        <div>
          <h2 className="text-xl font-semibold text-ink">Rewards Store</h2>
          <p className="text-ink-muted text-sm mt-0.5">Redeem your points for exclusive ALGO Group prizes</p>
        </div>
      </div>

      {/* Points balance banner */}
      <div className="glass border border-brand/20 rounded-2xl p-5 flex items-center justify-between
                      bg-gradient-to-r from-brand/5 to-transparent">
        <div>
          <p className="text-xs text-ink-subtle uppercase tracking-widest font-semibold mb-1">Your Balance</p>
          <div className="flex items-center gap-2">
            <Star size={22} className="text-brand fill-brand" />
            <span className="text-3xl font-black text-brand tabular-nums">{userPoints.toLocaleString()}</span>
            <span className="text-ink-muted text-sm font-medium">points</span>
          </div>
          <p className="text-xs text-ink-subtle mt-1.5">
            Earn points through tournaments, badges &amp; achievements
          </p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-400/10 border border-amber-400/20">
            <Clock size={14} className="text-amber-400" />
            <span className="text-xs font-semibold text-amber-400">{pendingCount} pending</span>
          </div>
        )}
      </div>

      {/* Tier tabs */}
      <div className="flex gap-1 p-1 glass border border-edge rounded-xl">
        {TABS.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-semibold transition-all duration-150
              ${activeTab === key
                ? 'bg-brand text-white shadow-[0_0_10px_rgba(0,200,83,0.3)]'
                : 'text-ink-muted hover:text-ink'
              }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Prize grid */}
      {loading ? (
        <div className="flex justify-center py-16">
          <Loader2 size={22} className="text-brand animate-spin" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <ShoppingBag size={36} className="text-ink-subtle mx-auto mb-3" />
          <p className="text-ink-muted text-sm font-medium">No rewards in this tier yet</p>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(reward => (
            <PrizeCard
              key={reward.id}
              reward={reward}
              userPoints={userPoints}
              onRedeem={setRedeemTarget}
              redeeming={redeemingId === reward.id}
            />
          ))}
        </motion.div>
      )}

      {/* Redemption history */}
      {redemptions.length > 0 && (
        <div className="glass border border-edge rounded-2xl overflow-hidden">
          <div className="px-5 py-4 border-b border-edge flex items-center gap-3">
            <Package size={16} className="text-brand" />
            <h3 className="text-sm font-semibold text-ink">My Redemptions</h3>
            <span className="ml-auto text-xs text-ink-subtle">{redemptions.length} total</span>
          </div>
          <div className="px-5 divide-y divide-edge/30">
            {redemptions.map(r => <RedemptionRow key={r.id} r={r} />)}
          </div>
        </div>
      )}

      {/* Confirm modal */}
      <AnimatePresence>
        {redeemTarget && (
          <ConfirmModal
            reward={redeemTarget}
            userPoints={userPoints}
            onConfirm={handleConfirmRedeem}
            onClose={() => !redeeming && setRedeemTarget(null)}
            loading={redeeming}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`fixed bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-xl shadow-xl
                        flex items-center gap-2.5 text-sm font-medium border
                        ${toast.type === 'error'
                          ? 'bg-danger/10 border-danger/20 text-danger'
                          : 'bg-brand/10 border-brand/20 text-brand'
                        }`}
          >
            {toast.type === 'error' ? <XCircle size={15} /> : <CheckCircle2 size={15} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
