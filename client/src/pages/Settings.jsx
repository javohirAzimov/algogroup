import { motion } from 'framer-motion'
import { Sun, Moon, Globe, Info, Bell, Shield, Palette, Mail, Briefcase, Building } from 'lucide-react'
import { useTheme } from '../hooks/useTheme'
import { useAuth } from '../context/AuthContext'

function SectionLabel({ children }) {
  return (
    <p className="text-ink-subtle text-xs font-medium uppercase tracking-widest mb-3">
      {children}
    </p>
  )
}

function SettingsCard({ children }) {
  return (
    <div className="glass rounded-xl border border-edge divide-y divide-edge overflow-hidden">
      {children}
    </div>
  )
}

function Row({ icon: Icon, label, description, children }) {
  return (
    <div className="flex items-center justify-between gap-4 px-5 py-4">
      <div className="flex items-start gap-3">
        <div className="w-8 h-8 rounded-md bg-white/5 border border-edge flex items-center justify-center flex-shrink-0 mt-0.5">
          <Icon size={15} className="text-ink-muted" />
        </div>
        <div>
          <p className="text-sm font-medium text-ink">{label}</p>
          {description && <p className="text-xs text-ink-muted mt-0.5">{description}</p>}
        </div>
      </div>
      {children && <div className="flex-shrink-0">{children}</div>}
    </div>
  )
}

function Toggle({ on, onToggle }) {
  return (
    <button
      onClick={onToggle}
      className={`relative w-10 h-5 rounded-full transition-colors duration-200 ${on ? 'bg-brand' : 'bg-edge-strong'}`}
    >
      <span className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 ${on ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  )
}

export default function Settings() {
  const { theme, toggleTheme } = useTheme()
  const { user } = useAuth()

  const initials = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'AG'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.22, ease: 'easeOut' }}
    >
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Main settings */}
        <div className="xl:col-span-2 space-y-6">
          {/* Profile */}
          <section>
            <SectionLabel>Profile</SectionLabel>
            <SettingsCard>
              <div className="px-5 py-5 flex items-center gap-4">
                <div className="relative w-14 h-14 flex-shrink-0">
                  <div className="absolute inset-0 rounded-full bg-brand/20 blur-md" />
                  <div className="relative w-14 h-14 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center">
                    <span className="text-brand text-lg font-bold">{initials}</span>
                  </div>
                </div>
                <div>
                  <p className="text-ink font-semibold">{user?.name || 'Team Member'}</p>
                  <p className="text-ink-muted text-sm">{user?.email || '—'}</p>
                  <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full bg-brand/10 border border-brand/20 text-brand text-[11px] font-medium capitalize">
                    {user?.role || 'employee'}
                  </span>
                </div>
              </div>
              <Row icon={Mail}     label="Email"      description={user?.email      || 'Not set'} />
              <Row icon={Briefcase} label="Role"      description={user?.role       || 'Employee'} />
              <Row icon={Building}  label="Department" description={user?.department || 'Not assigned'} />
            </SettingsCard>
          </section>

          {/* Appearance */}
          <section>
            <SectionLabel>Appearance</SectionLabel>
            <SettingsCard>
              <Row
                icon={theme === 'dark' ? Moon : Sun}
                label="Theme"
                description={`Currently using ${theme} mode`}
              >
                <Toggle on={theme === 'dark'} onToggle={toggleTheme} />
              </Row>
              <Row icon={Palette} label="Color scheme" description="Green accent (default)" />
            </SettingsCard>
          </section>

          {/* Notifications */}
          <section>
            <SectionLabel>Notifications</SectionLabel>
            <SettingsCard>
              <Row icon={Bell} label="Announcements" description="Notify when new announcements are posted">
                <Toggle on={true} onToggle={() => {}} />
              </Row>
              <Row icon={Bell} label="Events" description="Notify me about upcoming events">
                <Toggle on={true} onToggle={() => {}} />
              </Row>
              <Row icon={Bell} label="Suggestions" description="Updates on submitted suggestions">
                <Toggle on={false} onToggle={() => {}} />
              </Row>
            </SettingsCard>
          </section>

          {/* Security */}
          <section>
            <SectionLabel>Security</SectionLabel>
            <SettingsCard>
              <Row icon={Shield} label="Password" description="Manage your account password">
                <button className="px-3 py-1.5 rounded-lg glass border border-edge text-ink-muted text-xs font-medium hover:text-ink transition-colors">
                  Change
                </button>
              </Row>
              <Row icon={Shield} label="Active Session" description="Session active on this device" />
            </SettingsCard>
          </section>

          {/* Language */}
          <section>
            <SectionLabel>Language</SectionLabel>
            <SettingsCard>
              <Row icon={Globe} label="Display language" description="Localisation support coming soon">
                <select disabled className="bg-surface border border-edge text-ink-muted text-sm rounded-md px-3 py-1.5 cursor-not-allowed opacity-60">
                  <option>English</option>
                  <option>Russian</option>
                </select>
              </Row>
            </SettingsCard>
          </section>
        </div>

        {/* Right panel */}
        <div className="flex flex-col gap-4">
          <motion.div
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.28, delay: 0.1 }}
            className="glass rounded-xl p-4"
          >
            <p className="text-ink-subtle text-[10px] font-semibold uppercase tracking-[0.12em] mb-3">Account</p>
            <div className="flex flex-col gap-2.5">
              {[
                { label: 'Status',         value: 'Active' },
                { label: 'Plan',           value: 'Employee' },
                { label: 'Portal Version', value: 'v1.0.0' },
              ].map(({ label, value }) => (
                <div key={label} className="flex items-center justify-between">
                  <span className="text-ink-muted text-xs">{label}</span>
                  <span className="px-2.5 py-1 rounded-full glass border border-edge text-ink-muted text-xs font-medium">{value}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.28, delay: 0.16 }}
            className="glass rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Info size={12} className="text-ink-subtle" />
              <p className="text-ink-subtle text-[10px] font-semibold uppercase tracking-[0.12em]">About</p>
            </div>
            <p className="text-ink-muted text-xs leading-relaxed">
              ALGO Group Internal Portal — the central hub for employee engagement,
              announcements, knowledge sharing, and suggestions.
            </p>
            <p className="text-ink-subtle text-[11px] mt-3">
              Built for ALGO Group · 2025 · All rights reserved.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.28, delay: 0.22 }}
            className="glass rounded-xl p-4"
          >
            <p className="text-ink-subtle text-[10px] font-semibold uppercase tracking-[0.12em] mb-3">Quick Actions</p>
            <div className="flex flex-col gap-1">
              {['Edit Profile', 'Export Data', 'Contact Support'].map(action => (
                <button key={action} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left w-full">
                  <span className="w-1 h-1 rounded-full bg-brand flex-shrink-0" />
                  <span className="text-ink-muted text-xs font-medium">{action}</span>
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
