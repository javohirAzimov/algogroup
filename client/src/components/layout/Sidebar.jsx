import { NavLink, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Home, LayoutDashboard, Megaphone, MessageSquare,
  BookOpen, Bot, Settings, X, ShieldCheck, LogOut, Rocket, Keyboard,
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const navItems = [
  { to: '/home',          label: 'Home',           icon: Home },
  { to: '/dashboard',     label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/announcements', label: 'Announcements',  icon: Megaphone },
  { to: '/suggestions',   label: 'Suggestions',    icon: MessageSquare },
  { to: '/knowledge',     label: 'Knowledge Base', icon: BookOpen },
  { to: '/ai',            label: 'AI Assistant',   icon: Bot },
  { to: '/startups',      label: 'Start-Ups',      icon: Rocket },
  { to: '/agtype',        label: 'AG Type',        icon: Keyboard },
  { to: '/settings',      label: 'Settings',       icon: Settings },
]

function NavItem({ to, label, Icon, onClose }) {
  return (
    <NavLink
      to={to}
      onClick={onClose}
      className={({ isActive }) =>
        `relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
         transition-all duration-200
         ${isActive
           ? 'nav-active'
           : 'text-ink-muted hover:text-ink hover:bg-white/5'
         }`
      }
    >
      {({ isActive }) => (
        <>
          {isActive && (
            <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-brand
                             shadow-[0_0_8px_rgba(0,200,83,0.8)]" />
          )}
          <Icon size={16} className={isActive ? 'text-brand' : ''} strokeWidth={isActive ? 2.5 : 2} />
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
    <aside className="flex flex-col w-60 h-full glass-sidebar">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-edge flex items-center justify-between flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 flex-shrink-0 rounded-lg overflow-hidden bg-white shadow-[0_0_10px_rgba(0,200,83,0.25)]">
            <img src="/logo.png" alt="ALGO Group" className="w-full h-full object-cover" />
          </div>
          <div>
            <p className="text-ink font-semibold text-sm leading-tight tracking-tight">ALGO Group</p>
            <p className="text-ink-subtle text-[11px] tracking-wide">Internal Portal</p>
          </div>
        </div>
        {onClose && (
          <button onClick={onClose} className="text-ink-muted hover:text-ink transition-colors p-1 rounded-md hover:bg-white/5">
            <X size={16} />
          </button>
        )}
      </div>

      {/* Nav label */}
      <div className="px-4 pt-4 pb-1">
        <span className="text-ink-subtle text-[10px] font-semibold uppercase tracking-[0.12em]">Navigation</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-2 flex flex-col gap-0.5 overflow-y-auto">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavItem key={to} to={to} label={label} Icon={Icon} onClose={onClose} />
        ))}

        {user?.role === 'admin' && (
          <>
            <div className="mx-1 my-3 divider-glow" />
            <div className="px-1 pb-1">
              <span className="text-ink-subtle text-[10px] font-semibold uppercase tracking-[0.12em]">Admin</span>
            </div>
            <NavLink
              to="/admin"
              onClick={onClose}
              className={({ isActive }) =>
                `relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                 transition-all duration-200
                 ${isActive ? 'nav-active' : 'text-ink-muted hover:text-ink hover:bg-white/5'}`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 rounded-full bg-brand
                                     shadow-[0_0_8px_rgba(0,200,83,0.8)]" />
                  )}
                  <ShieldCheck size={16} className={isActive ? 'text-brand' : ''} />
                  Admin Panel
                </>
              )}
            </NavLink>
          </>
        )}
      </nav>

      {/* User footer */}
      <div className="px-3 py-3 border-t border-edge flex-shrink-0">
        <div className="flex items-center gap-2.5 px-2 py-2 rounded-lg hover:bg-white/5 transition-colors">
          <div className="relative w-7 h-7 flex-shrink-0">
            <div className="absolute inset-0 rounded-full bg-brand/30 blur-sm" />
            <div className="relative w-7 h-7 rounded-full bg-brand/20 border border-brand/30
                            flex items-center justify-center">
              <span className="text-brand text-xs font-semibold">
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </span>
            </div>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-ink text-xs font-medium truncate">{user?.name || 'User'}</p>
            <p className="text-ink-subtle text-[11px] truncate">{user?.department || user?.role}</p>
          </div>
          <button
            onClick={handleLogout}
            title="Sign out"
            className="text-ink-subtle hover:text-danger transition-colors p-1.5 rounded-md hover:bg-danger/10"
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
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden"
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
