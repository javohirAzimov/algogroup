import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Lightbulb, MessageSquare, Users, ArrowRight } from 'lucide-react'
import SuggestionForm from '../components/suggestions/SuggestionForm'
import { getSuggestionStats } from '../services/api'

const CATEGORIES = ['Culture', 'Product', 'HR', 'Operations', 'IT', 'Other']

const TIPS = [
  'Be specific about the problem you want to solve',
  'Include examples or references if possible',
  'All submissions are reviewed by the team',
  'Anonymous feedback is welcome',
]

const HOW_IT_WORKS = [
  { step: '1', label: 'Submit',  desc: 'Share your idea or concern using the form — anonymously if you prefer.' },
  { step: '2', label: 'Review',  desc: 'Management reads every submission and evaluates feasibility.' },
  { step: '3', label: 'Act',     desc: 'Approved ideas are implemented and the team is notified.' },
]

export default function Suggestions() {
  const [total, setTotal] = useState(null)

  useEffect(() => {
    getSuggestionStats().then(r => setTotal(r.data.total)).catch(() => {})
  }, [])

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

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.28, delay: 0.1 }}
          className="glass rounded-xl p-4"
        >
          <p className="text-ink-subtle text-[10px] font-semibold uppercase tracking-[0.12em] mb-3">Feedback Stats</p>
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-indigo-400/10 flex items-center justify-center flex-shrink-0">
              <MessageSquare size={13} className="text-indigo-400" />
            </div>
            <p className="text-ink-muted text-xs flex-1">Total Submitted</p>
            <span className="text-indigo-400 text-sm font-bold">
              {total === null ? '—' : total}
            </span>
          </div>
        </motion.div>

        {/* How it works */}
        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.28, delay: 0.16 }}
          className="glass rounded-xl p-4"
        >
          <p className="text-ink-subtle text-[10px] font-semibold uppercase tracking-[0.12em] mb-4">How It Works</p>
          <div className="flex flex-col gap-3">
            {HOW_IT_WORKS.map(({ step, label, desc }, i) => (
              <div key={step} className="flex gap-3">
                <div className="flex flex-col items-center gap-1 flex-shrink-0">
                  <div className="w-6 h-6 rounded-full bg-brand/15 border border-brand/30 flex items-center justify-center">
                    <span className="text-brand text-[10px] font-bold">{step}</span>
                  </div>
                  {i < HOW_IT_WORKS.length - 1 && (
                    <div className="w-px flex-1 bg-edge min-h-[12px]" />
                  )}
                </div>
                <div className="pb-3">
                  <p className="text-ink text-xs font-semibold leading-none mb-1">{label}</p>
                  <p className="text-ink-muted text-[11px] leading-relaxed">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Categories */}
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

        {/* Tips */}
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
