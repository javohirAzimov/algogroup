import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot, AlertCircle } from 'lucide-react'
import Avatar from '../ui/Avatar'
import { sendAIMessage } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

function TypingDots() {
  return (
    <div className="flex items-end gap-2.5">
      <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center flex-shrink-0 mb-0.5">
        <Bot size={13} className="text-white" />
      </div>
      <div className="px-4 py-3 rounded-xl rounded-bl-sm glass border border-edge flex items-center gap-1.5">
        {[0, 1, 2].map(i => (
          <motion.span
            key={i}
            className="w-1.5 h-1.5 rounded-full bg-ink-muted"
            animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
            transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }}
          />
        ))}
      </div>
    </div>
  )
}

function Bubble({ message }) {
  const isUser = message.role === 'user'
  const isError = message.role === 'error'

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={`flex items-end gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {isUser ? (
        <div className="w-7 h-7 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center flex-shrink-0 mb-0.5">
          <span className="text-brand text-[10px] font-bold">ME</span>
        </div>
      ) : (
        <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center flex-shrink-0 mb-0.5">
          {isError ? <AlertCircle size={13} className="text-white" /> : <Bot size={13} className="text-white" />}
        </div>
      )}

      <div className={`max-w-[78%] px-4 py-3 rounded-xl text-sm leading-relaxed whitespace-pre-wrap
        ${isUser
          ? 'bg-brand text-white rounded-br-sm'
          : isError
            ? 'bg-danger/10 border border-danger/30 text-danger rounded-bl-sm'
            : 'glass border border-edge text-ink rounded-bl-sm'
        }`}>
        {message.content}
      </div>
    </motion.div>
  )
}

const SUGGESTIONS = [
  'What are the company leave policies?',
  'How do I submit an expense report?',
  'What is the code of conduct?',
  'Tell me about the benefits program',
]

export default function AIAssistantChat() {
  const { user } = useAuth()
  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'ME'

  const [messages, setMessages] = useState([
    { id: 0, role: 'assistant', content: `Hello${user?.name ? `, ${user.name.split(' ')[0]}` : ''}! I'm the ALGO Group AI Assistant. I can help you with company policies, HR questions, event information, and more. What can I help you with today?` },
  ])
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  async function send(text) {
    const content = (text || input).trim()
    if (!content || loading) return

    const userMsg = { id: Date.now(), role: 'user', content }
    setMessages(prev => [...prev, userMsg])
    setInput('')
    setLoading(true)

    // Build history for the API (exclude error messages)
    const history = [...messages, userMsg]
      .filter(m => m.role === 'user' || m.role === 'assistant')
      .map(m => ({ role: m.role, content: m.content }))

    try {
      const { data } = await sendAIMessage(history)
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: data.reply }])
    } catch (err) {
      const errText = err.response?.data?.error || 'Something went wrong. Please try again.'
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'error', content: errText }])
    } finally {
      setLoading(false)
      setTimeout(() => textareaRef.current?.focus(), 50)
    }
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  const showSuggestions = messages.length === 1 && !loading

  return (
    <div className="flex flex-col h-[calc(100vh-11rem)] max-h-[720px]">
      {/* Message list */}
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 py-4 pr-1">
        <AnimatePresence initial={false}>
          {messages.map(m => <Bubble key={m.id} message={m} />)}
          {loading && (
            <motion.div key="typing" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <TypingDots />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Suggestion chips */}
        {showSuggestions && (
          <motion.div
            initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap gap-2 pl-9 mt-1"
          >
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => send(s)}
                className="px-3 py-1.5 rounded-full glass border border-edge text-ink-muted
                           text-xs font-medium hover:border-brand/40 hover:text-ink
                           transition-colors duration-150"
              >
                {s}
              </button>
            ))}
          </motion.div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* Input area */}
      <div className="pt-4 border-t border-edge flex-shrink-0">
        <div className="flex items-end gap-3">
          <textarea
            ref={textareaRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKey}
            rows={1}
            placeholder="Ask anything about ALGO Group…"
            disabled={loading}
            className="flex-1 glass border border-edge rounded-xl px-4 py-3
                       text-sm text-ink placeholder-ink-subtle resize-none
                       focus:outline-none focus:border-brand/50
                       transition-colors duration-150 leading-relaxed
                       disabled:opacity-50"
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            className="w-10 h-10 rounded-xl bg-brand hover:bg-brand/90 disabled:opacity-40
                       flex items-center justify-center flex-shrink-0
                       transition-all duration-150 active:scale-95"
          >
            <Send size={15} className="text-white" />
          </button>
        </div>
        <p className="text-ink-subtle text-xs mt-2 text-center">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
