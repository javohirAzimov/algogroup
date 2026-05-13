// Time-aware greeting with today's date
import { motion } from 'framer-motion'
import { getGreeting, getTodayFormatted } from '../../utils/formatDate'

export default function WelcomeBanner({ name = 'Team' }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="mb-6"
    >
      <h2 className="text-2xl font-semibold text-ink">{getGreeting()}, {name}</h2>
      <p className="text-ink-muted text-sm mt-1">{getTodayFormatted()}</p>
    </motion.div>
  )
}
