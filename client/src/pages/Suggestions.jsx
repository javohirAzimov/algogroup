// Suggestions page — heading, subtext, and the suggestion form
import { motion } from 'framer-motion'
import { Lightbulb } from 'lucide-react'
import SuggestionForm from '../components/suggestions/SuggestionForm'

export default function Suggestions() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
      className="max-w-2xl mx-auto"
    >
      {/* Header */}
      <div className="flex items-start gap-4 mb-8">
        <div className="w-10 h-10 rounded-lg bg-indigo-500/15 flex items-center justify-center flex-shrink-0 mt-0.5">
          <Lightbulb size={18} className="text-indigo-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-[#f1f1f1] [.light_&]:text-[#111111]">
            Share a Suggestion
          </h2>
          <p className="text-[#888888] text-sm mt-1 leading-relaxed">
            Your ideas help improve ALGO Group. We read every message and take your
            feedback seriously — nothing is too small.
          </p>
        </div>
      </div>

      <SuggestionForm />
    </motion.div>
  )
}
