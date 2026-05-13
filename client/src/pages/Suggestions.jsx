import { motion } from 'framer-motion'
import { Lightbulb, TrendingUp, MessageSquare, CheckCircle, Clock, Users } from 'lucide-react'
import SuggestionForm from '../components/suggestions/SuggestionForm'

const STATS = [
  { icon: MessageSquare, label: 'Total Submitted', value: '24', color: 'text-indigo-400', bg: 'bg-indigo-400/10' },
  { icon: CheckCircle,   label: 'Implemented',     value: '8',  color: 'text-brand',      bg: 'bg-brand/10' },
  { icon: Clock,         label: 'Under Review',    value: '12', color: 'text-amber-400',  bg: 'bg-amber-400/10' },
]

const RECENT = [
  { text: 'Add a team calendar feature',              category: 'Product',    time: '2d ago' },
  { text: 'Improve onboarding docs for new hires',    category: 'HR',         time: '4d ago' },
  { text: 'Monthly team lunch proposal',              category: 'Culture',    time: '1w ago' },
]

const CATEGORIES = ['Culture', 'Product', 'HR', 'Operations', 'IT', 'Other']

const TIPS = [
  'Be specific about the problem you want to solve',
  'Include examples or references if possible',
  'All submissions are reviewed by the team',
  'Anonymous feedback is welcome',
]

export default function Suggestions() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="grid grid-cols-1 xl:grid-cols-3 gap-6"
    >
      {/* Main: form */}
      <div className="xl:col-span-2">
        <div className="flex items-start gap-4 mb-6">
          <div className="w-10 h-10 rounded-lg bg-indigo-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
            <Lightbulb size={18} className="text-indigo-400" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-ink">Share a Suggestion</h2>
            <p className="text-ink-muted text-sm mt-1 leading-relaxed">
              Your ideas help improve ALGO Group. We read every message and take your
              feedback seriously — nothing is too small.
            </p>
          </div>
        </div>
        <SuggestionForm />
      </div>

      {/* Sidebar */}
      <div className="flex flex-col gap-4">
        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.28, delay: 0.1 }}
          className="glass rounded-xl p-4"
        >
          <p className="text-ink-subtle text-[10px] font-semibold uppercase tracking-[0.12em] mb-3">Feedback Stats</p>
          <div className="flex flex-col gap-3">
            {STATS.map(({ icon: Icon, label, value, color, bg }) => (
              <div key={label} className="flex items-center gap-3">
                <div className={`w-7 h-7 rounded-lg ${bg} flex items-center justify-center flex-shrink-0`}>
                  <Icon size={13} className={color} />
                </div>
                <p className="text-ink-muted text-xs flex-1">{label}</p>
                <span className={`${color} text-sm font-bold`}>{value}</span>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.28, delay: 0.16 }}
          className="glass rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={12} className="text-brand" />
            <p className="text-ink-subtle text-[10px] font-semibold uppercase tracking-[0.12em]">Recent</p>
          </div>
          <div className="flex flex-col">
            {RECENT.map(({ text, category, time }) => (
              <div key={text} className="py-2.5 border-b border-edge last:border-0">
                <p className="text-ink text-xs font-medium leading-snug">{text}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="px-1.5 py-0.5 rounded bg-brand/10 text-brand text-[10px] font-medium">{category}</span>
                  <span className="text-ink-subtle text-[10px]">{time}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.28, delay: 0.2 }}
          className="glass rounded-xl p-4"
        >
          <p className="text-ink-subtle text-[10px] font-semibold uppercase tracking-[0.12em] mb-3">Categories</p>
          <div className="flex flex-wrap gap-1.5">
            {CATEGORIES.map(cat => (
              <span key={cat} className="px-2.5 py-1 rounded-full bg-white/5 border border-edge text-ink-muted text-[11px] font-medium">
                {cat}
              </span>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.28, delay: 0.24 }}
          className="glass rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Users size={12} className="text-indigo-400" />
            <p className="text-ink-subtle text-[10px] font-semibold uppercase tracking-[0.12em]">Tips</p>
          </div>
          <div className="flex flex-col gap-2">
            {TIPS.map((tip, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="text-brand text-xs mt-0.5 flex-shrink-0">•</span>
                <p className="text-ink-muted text-xs leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
