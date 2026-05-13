// AI Assistant page — wraps the chat UI component
import { motion } from 'framer-motion'
import AIAssistantChat from '../components/ai/AIAssistant'

export default function AIAssistant() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-[#f1f1f1] [.light_&]:text-[#111111]">
          AI Assistant
        </h2>
        <p className="text-[#888888] text-sm mt-0.5">
          Ask anything about ALGO Group policies, events, or procedures.
        </p>
      </div>
      <AIAssistantChat />
    </motion.div>
  )
}
