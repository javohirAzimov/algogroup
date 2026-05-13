// Knowledge category card — icon, title, article count, "coming soon" modal on click
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { FileText } from 'lucide-react'

export default function CategoryCard({ category, index = 0 }) {
  const { title, icon: Icon = FileText, articleCount } = category
  const [open, setOpen] = useState(false)

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.22, delay: index * 0.05, ease: 'easeOut' }}
        whileHover={{ scale: 1.02 }}
        onClick={() => setOpen(true)}
        className="bg-card border border-edge rounded-lg p-5 cursor-pointer
                   hover:border-brand transition-colors duration-200 shadow-sm"
      >
        <div className="w-9 h-9 rounded-md bg-brand-soft flex items-center justify-center mb-4">
          <Icon size={17} className="text-brand" />
        </div>
        <p className="text-ink font-semibold text-sm mb-1">{title}</p>
        <p className="text-ink-subtle text-xs">
          {articleCount} {articleCount === 1 ? 'article' : 'articles'}
        </p>
      </motion.div>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.18 }}
              className="fixed inset-0 bg-black/60 z-40"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.96 }} transition={{ duration: 0.18 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-6"
            >
              <div className="bg-surface border border-edge rounded-xl p-8
                              max-w-xs w-full text-center shadow-lg">
                <div className="w-11 h-11 rounded-md bg-brand-soft flex items-center
                                justify-center mx-auto mb-4">
                  <Icon size={20} className="text-brand" />
                </div>
                <p className="text-ink font-semibold mb-2">{title}</p>
                <p className="text-ink-muted text-sm">Articles coming soon.</p>
                <button onClick={() => setOpen(false)}
                        className="mt-5 text-brand text-sm hover:underline">
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
