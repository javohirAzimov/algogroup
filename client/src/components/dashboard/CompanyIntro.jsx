// Company culture blurb beside the management photo
import { motion } from 'framer-motion'

export default function CompanyIntro() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: 0.05, ease: 'easeOut' }}
      className="flex flex-col justify-center gap-3"
    >
      <h3 className="text-lg font-semibold text-ink">About ALGO Group</h3>
      <p className="text-ink-muted text-sm leading-relaxed">
        At ALGO Group, great results come from great people working together.
        Our culture is built on trust, continuous growth, and a shared commitment
        to professionalism — where every team member's contribution matters.
      </p>
      <p className="text-ink-muted text-sm leading-relaxed">
        From office events to day-to-day collaboration, we strive to create a
        workplace that feels like a community — one where ambition and belonging
        go hand in hand.
      </p>
    </motion.div>
  )
}
