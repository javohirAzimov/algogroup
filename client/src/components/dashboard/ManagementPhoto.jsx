import { motion } from 'framer-motion'

export default function ManagementPhoto({ imageUrl }) {
  const src = imageUrl || '/Onboarding-bro.svg'
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -3 }}
      className="relative group rounded-xl overflow-hidden card-float glass"
      style={{ minHeight: '240px' }}
    >
      {/* Green corner accent */}
      <div className="absolute top-0 left-0 w-24 h-24 bg-brand/10 blur-2xl rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-20 h-20 bg-brand/8 blur-xl rounded-full pointer-events-none" />

      <div className="relative h-full w-full flex items-center justify-center p-4"
           style={{ minHeight: '240px' }}>
        <img
          src={src}
          alt="ALGO Group team"
          className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105"
          style={{ maxHeight: '300px' }}
        />
      </div>
    </motion.div>
  )
}
