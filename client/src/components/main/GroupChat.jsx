import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Send, Users, Wifi } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useSocket } from '../../context/SocketContext'

function timeAgo(date) {
  const secs = Math.floor((Date.now() - new Date(date)) / 1000)
  if (secs < 60) return 'just now'
  const mins = Math.floor(secs / 60)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return new Date(date).toLocaleDateString()
}

function formatTime(date) {
  return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

function shouldShowHeader(messages, index) {
  if (index === 0) return true
  const prev = messages[index - 1]
  const curr = messages[index]
  if (prev.userId !== curr.userId) return true
  // Show header again if more than 5 minutes apart
  return new Date(curr.createdAt) - new Date(prev.createdAt) > 5 * 60 * 1000
}

function ChatBubble({ message, isOwn, showHeader }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.15 }}
      className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'}`}
    >
      {showHeader && (
        <div className={`flex items-center gap-1.5 mb-1 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
          <div className="w-5 h-5 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center flex-shrink-0">
            <span className="text-brand text-[8px] font-bold">
              {message.user?.name?.[0]?.toUpperCase() || '?'}
            </span>
          </div>
          <span className="text-[11px] font-medium text-ink-muted">{message.user?.name}</span>
          <span className="text-[10px] text-ink-subtle">{formatTime(message.createdAt)}</span>
        </div>
      )}
      <div
        className={`max-w-[80%] px-3 py-2 rounded-xl text-sm leading-relaxed whitespace-pre-wrap break-words
          ${isOwn
            ? 'bg-brand text-white rounded-tr-sm'
            : 'glass border border-edge text-ink rounded-tl-sm'
          }`}
      >
        {message.content}
      </div>
    </motion.div>
  )
}

function DateDivider({ date }) {
  const label = (() => {
    const d = new Date(date)
    const today = new Date()
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    if (d.toDateString() === today.toDateString()) return 'Today'
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
    return d.toLocaleDateString([], { month: 'long', day: 'numeric' })
  })()

  return (
    <div className="flex items-center gap-2 my-2">
      <div className="flex-1 h-px bg-edge" />
      <span className="text-[10px] text-ink-subtle font-medium px-2">{label}</span>
      <div className="flex-1 h-px bg-edge" />
    </div>
  )
}

function shouldShowDateDivider(messages, index) {
  if (index === 0) return true
  const prev = new Date(messages[index - 1].createdAt)
  const curr = new Date(messages[index].createdAt)
  return prev.toDateString() !== curr.toDateString()
}

export default function GroupChat() {
  const { user } = useAuth()
  const { socket, onlineCount } = useSocket()
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const [connected, setConnected] = useState(false)
  const bottomRef = useRef(null)
  const textareaRef = useRef(null)

  useEffect(() => {
    if (!socket) return

    setConnected(socket.connected)
    socket.on('connect',    () => setConnected(true))
    socket.on('disconnect', () => setConnected(false))
    socket.on('history',    msgs => setMessages(msgs))
    socket.on('new_message', msg => setMessages(prev => [...prev, msg]))

    return () => {
      socket.off('connect')
      socket.off('disconnect')
      socket.off('history')
      socket.off('new_message')
    }
  }, [socket])

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  function send() {
    const text = input.trim()
    if (!text || !socket || !connected) return
    socket.emit('send_message', { content: text })
    setInput('')
    setTimeout(() => textareaRef.current?.focus(), 30)
  }

  function handleKey(e) {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      send()
    }
  }

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-edge flex-shrink-0">
        <div className="flex items-center gap-2">
          <Users size={15} className="text-brand" />
          <span className="text-sm font-semibold text-ink">Group Chat</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Wifi size={12} className={connected ? 'text-brand' : 'text-ink-subtle'} />
          <span className="text-[11px] text-ink-muted font-medium">{onlineCount} online</span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-1 min-h-0">
        {messages.length === 0 && (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-12">
            <Users size={28} className="text-ink-subtle mb-3" />
            <p className="text-ink-muted text-sm font-medium">No messages yet</p>
            <p className="text-ink-subtle text-xs mt-1">Say hello to the team!</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((msg, i) => (
            <div key={msg.id}>
              {shouldShowDateDivider(messages, i) && (
                <DateDivider date={msg.createdAt} />
              )}
              <ChatBubble
                message={msg}
                isOwn={msg.userId === user?.id}
                showHeader={shouldShowHeader(messages, i)}
              />
            </div>
          ))}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 border-t border-edge flex items-end gap-2 flex-shrink-0">
        <textarea
          ref={textareaRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKey}
          rows={1}
          placeholder={connected ? 'Type a message… (Enter to send)' : 'Connecting…'}
          disabled={!connected}
          className="flex-1 glass border border-edge rounded-xl px-3 py-2.5 text-sm text-ink
                     placeholder-ink-subtle resize-none focus:outline-none focus:border-brand/50
                     transition-colors leading-relaxed disabled:opacity-50"
        />
        <button
          onClick={send}
          disabled={!input.trim() || !connected}
          className="w-9 h-9 rounded-xl bg-brand hover:bg-brand/90 disabled:opacity-40
                     flex items-center justify-center flex-shrink-0
                     transition-all duration-150 active:scale-95"
        >
          <Send size={14} className="text-white" />
        </button>
      </div>
    </div>
  )
}
