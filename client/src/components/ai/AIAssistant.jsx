// Chat-style AI assistant UI — ready to wire to a real API
import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Bot } from 'lucide-react'
import Avatar from '../ui/Avatar'

const REPLY = 'AI Assistant coming soon. This interface will be connected to a live model in the next update.'

function Bubble({ message }) {
  const isUser = message.role === 'user'
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.18 }}
      className={`flex items-end gap-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
    >
      {isUser
        ? <Avatar initials="AG" size="sm" />
        : (
          <div className="w-7 h-7 rounded-pill bg-brand flex items-center justify-center flex-shrink-0 mb-0.5">
            <Bot size={13} className="text-ink-on" />
          </div>
        )
      }
      <div className={`max-w-[75%] px-4 py-2.5 rounded-xl text-sm leading-relaxed
        ${isUser
          ? 'bg-brand text-ink-on rounded-br-sm'
          : 'bg-card border border-edge text-ink rounded-bl-sm'
        }`}>
        {message.content}
      </div>
    </motion.div>
  )
}

export default function AIAssistantChat() {
  const [messages, setMessages] = useState([
    { id: 0, role: 'assistant', content: 'Hello! How can I help you today?' },
  ])
  const [input, setInput] = useState('')
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function send() {
    const text = input.trim()
    if (!text) return
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', content: text }])
    setInput('')
    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, role: 'assistant', content: REPLY }])
    }, 600)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-h-[680px]">
      <div className="flex-1 overflow-y-auto flex flex-col gap-4 py-2 pr-1">
        <AnimatePresence initial={false}>
          {messages.map(m => <Bubble key={m.id} message={m} />)}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      <div className="pt-4 border-t border-edge">
        <div className="flex items-end gap-3">
          <textarea
            value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            rows={1} placeholder="Type a message…"
            className="flex-1 bg-card border border-edge rounded-xl px-4 py-2.5
                       text-sm text-ink placeholder-ink-subtle resize-none
                       focus:outline-none focus:border-brand focus:shadow-focus
                       transition-colors duration-150 leading-relaxed"
          />
          <button onClick={send} disabled={!input.trim()}
                  className="w-10 h-10 rounded-xl bg-brand hover:bg-brand-h disabled:opacity-40
                             flex items-center justify-center flex-shrink-0 transition-colors duration-150">
            <Send size={15} className="text-ink-on" />
          </button>
        </div>
        <p className="text-ink-subtle text-xs mt-2 text-center">
          Enter to send · Shift+Enter for new line
        </p>
      </div>
    </div>
  )
}
