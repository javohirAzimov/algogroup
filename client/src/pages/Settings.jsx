// Settings — theme toggle, language placeholder, about section
import { motion } from 'framer-motion'
import { Sun, Moon, Globe, Info } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'

function Row({ icon: Icon, label, description, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4
                    border-b border-edge last:border-0">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-md bg-card border border-edge
                        flex items-center justify-center flex-shrink-0 mt-0.5">
          <Icon size={15} className="text-ink-muted" />
        </div>
        <div>
          <p className="text-sm font-medium text-ink">{label}</p>
          {description && <p className="text-xs text-ink-muted mt-0.5">{description}</p>}
        </div>
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  )
}

function Toggle({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-10 h-5 rounded-pill transition-colors duration-200
                  ${on ? 'bg-brand' : 'bg-edge-strong'}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-pill shadow
                        transition-transform duration-200
                        ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  )
}

function SectionLabel({ children }) {
  return (
    <p className="text-ink-subtle text-xs font-medium uppercase tracking-widest mb-3">
      {children}
    </p>
  )
}

export default function Settings() {
  const { theme, toggleTheme } = useTheme()

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
      className="max-w-xl"
    >
      <section className="mb-8">
        <SectionLabel>Appearance</SectionLabel>
        <div className="bg-card border border-edge rounded-lg px-5 shadow-sm">
          <Row
            icon={theme === 'dark' ? Moon : Sun}
            label="Theme"
            description={`Currently using ${theme} mode`}
          >
            <Toggle on={theme === 'dark'} onToggle={toggleTheme} />
          </Row>
        </div>
      </section>

      <section className="mb-8">
        <SectionLabel>Language</SectionLabel>
        <div className="bg-card border border-edge rounded-lg px-5 shadow-sm">
          <Row icon={Globe} label="Display language"
               description="Localisation support coming in a future release">
            <select disabled
                    className="bg-surface border border-edge text-ink-muted text-sm
                               rounded-md px-3 py-1.5 cursor-not-allowed opacity-60">
              <option>English</option>
              <option>Russian</option>
            </select>
          </Row>
        </div>
      </section>

      <section>
        <SectionLabel>About</SectionLabel>
        <div className="bg-card border border-edge rounded-lg px-5 shadow-sm">
          <Row icon={Info} label="About this portal" description="">
            <span className="text-ink-muted text-xs">v1.0.0</span>
          </Row>
          <div className="pb-5 text-sm text-ink-muted leading-relaxed">
            <p>ALGO Group Internal Portal is the central hub for employee engagement,
               announcements, knowledge sharing, and suggestions.</p>
            <p className="mt-2 text-xs text-ink-subtle">
              Built for ALGO Group · 2025 · All rights reserved.
            </p>
          </div>
        </div>
      </section>
    </motion.div>
  )
}
