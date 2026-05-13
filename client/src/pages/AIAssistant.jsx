import { motion } from 'framer-motion'
import { Bot } from 'lucide-react'
import AIAssistantChat from '../components/ai/AIAssistant'

export default function AIAssistant() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-9 h-9 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center">
          <Bot size={16} className="text-brand" />
        </div>
        <div>
          <h2 className="text-lg font-semibold text-ink">AI Assistant</h2>
          <p className="text-ink-muted text-sm">Ask anything about ALGO Group policies, events, or procedures.</p>
        </div>
      </div>
      <AIAssistantChat />
    </motion.div>
  )
}
