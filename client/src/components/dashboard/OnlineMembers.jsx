import { motion } from 'framer-motion'
import { Wifi } from 'lucide-react'
import { useSocket } from '../../context/SocketContext'

function initials(name) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(w => w[0].toUpperCase())
    .join('')
}

export default function OnlineMembers() {
  const { onlineCount, onlineUsers } = useSocket()

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: 0.18 }}
      className="glass rounded-xl p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-ink-subtle text-[10px] font-semibold uppercase tracking-[0.12em]">Online Now</p>
        <div className="flex items-center gap-1">
          <Wifi size={9} className="text-brand" />
          <span className="text-brand text-[10px] font-medium">{onlineCount} active</span>
        </div>
      </div>

      {onlineUsers.length === 0 ? (
        <p className="text-ink-subtle text-xs text-center py-2">No one online yet</p>
      ) : (
        <div className="flex flex-col gap-2.5">
          {onlineUsers.map(({ id, name, department }) => (
            <div key={id} className="flex items-center gap-2.5">
              <div className="relative flex-shrink-0">
                <div className="w-6 h-6 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center">
                  <span className="text-brand text-[9px] font-semibold">{initials(name)}</span>
                </div>
                <span className="absolute -bottom-0.5 -right-0.5 w-2 h-2 rounded-full bg-brand border border-[var(--bg)]" />
              </div>
              <div>
                <p className="text-ink text-xs font-medium leading-none">{name}</p>
                <p className="text-ink-subtle text-[10px]">{department}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  )
}
