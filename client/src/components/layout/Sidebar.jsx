import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  LayoutDashboard, Megaphone, MessageSquare,
  BookOpen, Bot, Settings, X, ShieldCheck, LogOut,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/dashboard',     label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/announcements', label: 'Announcements',  icon: Megaphone },
  { to: '/suggestions',   label: 'Suggestions',    icon: MessageSquare },
  { to: '/knowledge',     label: 'Knowledge Base', icon: BookOpen },
  { to: '/ai',            label: 'AI Assistant',   icon: Bot },
  { to: '/settings',      label: 'Settings',       icon: Settings },
]

function NavItem({ to, label, Icon, onClose }) {
  return (
    <NavLink
      to={to}
      onClick={onClose}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
         transition-colors duration-150
         ${isActive
           ? 'bg-brand text-ink-on'
           : 'text-ink-muted hover:text-ink hover:bg-card'
         }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon size={17} className={isActive ? 'text-ink-on' : ''} />
          {label}
        </>
      )}
    </NavLink>
  )
}

function SidebarShell({ onClose }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  function handleLogout() {
    logout()
    navigate('/login')
  }

  return (
    <aside className="flex flex-col w-60 h-full bg-surface border-r border-edge">
      {/* Header */}
      <div className="px-5 py-5 border-b border-edge flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-md bg-brand flex items-center justify-center flex-shrink-0">
            <span className="text-ink-on font-bold text-sm">A</span>
          </div>
          <div>
            <p className="text-ink font-semibold text-sm leading-tight">ALGO Group</p>
            <p className="text-ink-subtle text-xs">Internal Portal</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-ink-muted hover:text-ink transition-colors">
            <X size={17} />
          </button>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-1 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavItem key={to} to={to} label={label} Icon={Icon} onClose={onClose} />
        ))}

        {user?.role === 'admin' && (
          <>
            <div className="mx-3 my-2 h-px bg-edge" />
            <NavLink
              to="/admin"
              onClick={onClose}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                         text-ink-muted hover:text-ink hover:bg-card transition-colors duration-150"
            >
              <ShieldCheck size={17} />
              Admin Panel
            </NavLink>
          </>
        )}
      </nav>

      {/* User footer */}
      <div className="px-3 py-3 border-t border-edge flex-shrink-0">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg">
          <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center flex-shrink-0">
            <span className="text-ink-on text-xs font-semibold">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-ink text-xs font-medium truncate">{user?.name || 'User'}</p>
            <p className="text-ink-subtle text-xs truncate">{user?.department || user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="text-ink-subtle hover:text-danger transition-colors p-1 rounded"
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  )
}

function MobileSidebar({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 bg-black/60 z-40 lg:hidden"
            onClick={onClose}
          />
          <motion.div
            initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
            transition={{ duration: 0.22, ease: 'easeOut' }}
            className="fixed top-0 left-0 h-full z-50 lg:hidden"
          >
            <SidebarShell onClose={onClose} />
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

export default function Sidebar({ mobileOpen, onMobileClose }) {
  return (
    <>
      <div className="hidden lg:flex fixed top-0 left-0 h-full z-30">
        <SidebarShell />
      </div>
      <MobileSidebar open={mobileOpen} onClose={onMobileClose} />
    </>
  )
}
