// Management team illustration panel
import { motion } from 'framer-motion'

export default function ManagementPhoto({ imageUrl }) {
  const src = imageUrl || '/Onboarding-bro.svg'
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, delay: 0.1, ease: 'easeOut' }}
      className="w-full rounded-lg border border-edge bg-brand-soft
                 flex items-center justify-center overflow-hidden"
      style={{ minHeight: '240px' }}
    >
      <img
        src={src}
        alt="ALGO Group team"
        className="w-full h-full object-contain"
        style={{ maxHeight: '300px' }}
      />
    </motion.div>
  )
}
