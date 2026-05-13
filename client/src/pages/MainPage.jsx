import { motion } from 'framer-motion'
import { Home, Wifi } from 'lucide-react'
import NewsPanel from '../components/main/NewsPanel'
import GroupChat from '../components/main/GroupChat'
import { useSocket } from '../context/SocketContext'

export default function MainPage() {
  const { onlineCount } = useSocket()

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col"
      style={{ height: 'calc(100vh - 7.5rem)' }}
    >
      {/* Page header */}
      <div className="flex items-center justify-between mb-4 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-brand/10 border border-brand/20 flex items-center justify-center">
            <Home size={16} className="text-brand" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-ink">Home</h2>
            <p className="text-ink-muted text-sm">Latest news and team chat</p>
          </div>
        </div>
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass border border-edge">
          <Wifi size={12} className="text-brand" />
          <span className="text-xs text-ink-muted font-medium">{onlineCount} online</span>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="flex-1 flex gap-5 overflow-hidden min-h-0">
        {/* Left — News feed (wider) */}
        <div className="flex-[3] glass border border-edge rounded-xl overflow-hidden flex flex-col min-h-0">
          <NewsPanel />
        </div>

        {/* Right — Group chat */}
        <div className="flex-[2] glass border border-edge rounded-xl overflow-hidden flex flex-col min-h-0">
          <GroupChat />
        </div>
      </div>
    </motion.div>
  )
}
