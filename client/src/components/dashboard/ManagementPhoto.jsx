import { motion } from 'framer-motion'

export default function ManagementPhoto({ imageUrl }) {
  const isReal = !!imageUrl
  const src = imageUrl || '/Onboarding-bro.svg'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
      className="relative group rounded-xl overflow-hidden card-float glass w-full"
    >
      {/* 16:9 cinematic banner */}
      <div className="relative w-full aspect-video overflow-hidden">
        {/* Ambient corner glows */}
        <div className="absolute top-0 left-0 w-48 h-48 bg-brand/12 blur-3xl rounded-full pointer-events-none z-10" />
        <div className="absolute bottom-0 right-0 w-40 h-40 bg-brand/8 blur-2xl rounded-full pointer-events-none z-10" />

        {!isReal && (
          <div className="absolute inset-0 bg-gradient-to-br from-brand/8 via-transparent to-[#001a00]/30" />
        )}

        <img
          src={src}
          alt="ALGO Group team"
          className={`w-full h-full transition-transform duration-700 group-hover:scale-[1.03]
                     ${isReal ? 'object-cover' : 'object-contain p-8'}`}
        />

        {/* Bottom fade for real photos */}
        {isReal && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-black/10 to-transparent" />
        )}

        {/* Label badge */}
        <div className="absolute bottom-3 left-4 z-20 flex items-center gap-2
                        px-3 py-1 rounded-full bg-black/55 backdrop-blur-md
                        border border-brand/25">
          <span className="w-1.5 h-1.5 rounded-full bg-brand shadow-[0_0_6px_rgba(0,200,83,0.8)]" />
          <span className="text-white text-[10px] font-semibold uppercase tracking-wider">ALGO Group Team</span>
        </div>
      </div>
    </motion.div>
  )
}
