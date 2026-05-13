// Full-width horizontal top navbar — logo left, nav links centre, controls right
import { useState } from 'react'
import { NavLink } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  LayoutDashboard, Megaphone, MessageSquare,
  BookOpen, Bot, Settings, Menu, X,
} from 'lucide-react'
import ThemeToggle from '../ui/ThemeToggle'
import Avatar from '../ui/Avatar'

const navItems = [
  { to: '/dashboard',     label: 'Dashboard',      icon: LayoutDashboard },
  { to: '/announcements', label: 'Announcements',  icon: Megaphone },
  { to: '/suggestions',   label: 'Suggestions',    icon: MessageSquare },
  { to: '/knowledge',     label: 'Knowledge Base', icon: BookOpen },
  { to: '/ai',            label: 'AI Assistant',   icon: Bot },
  { to: '/settings',      label: 'Settings',       icon: Settings },
]

function DesktopLink({ to, label }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `relative text-sm font-medium transition-colors duration-150 px-1 pb-0.5
         ${isActive
           ? 'text-indigo-400'
           : 'text-[#888888] hover:text-[#f1f1f1] [.light_&]:hover:text-[#111111]'
         }`
      }
    >
      {({ isActive }) => (
        <>
          {label}
          {isActive && (
            <motion.span
              layoutId="nav-underline"
              className="absolute -bottom-[1px] left-0 right-0 h-[2px] bg-indigo-500 rounded-full"
              transition={{ type: 'spring', stiffness: 380, damping: 30 }}
            />
          )}
        </>
      )}
    </NavLink>
  )
}

function MobileLink({ to, label, icon: Icon, onClick }) {
  return (
    <NavLink
      to={to}
      onClick={onClick}
      className={({ isActive }) =>
        `flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors duration-150
         ${isActive
           ? 'text-indigo-400 bg-indigo-500/10'
           : 'text-[#888888] hover:text-[#f1f1f1] hover:bg-[#2a2a2a]'
         }`
      }
    >
      <Icon size={17} />
      {label}
    </NavLink>
  )
}

export default function NavBar() {
  const [open, setOpen] = useState(false)

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-30 h-14
                         bg-[#111111] border-b border-[#2a2a2a]
                         [.light_&]:bg-white [.light_&]:border-[#e5e5e5]">
        <div className="max-w-7xl mx-auto h-full px-4 sm:px-6 flex items-center gap-6">

          {/* Logo */}
          <NavLink to="/dashboard" className="flex items-center gap-2.5 flex-shrink-0">
            <div className="w-7 h-7 rounded-md bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-xs">A</span>
            </div>
            <span className="text-[#f1f1f1] font-semibold text-sm hidden sm:block
                             [.light_&]:text-[#111111]">
              ALGO Group
            </span>
          </NavLink>

          {/* Desktop nav links */}
          <nav className="hidden lg:flex items-center gap-6 flex-1 border-b border-transparent pb-0.5">
            {navItems.map(({ to, label }) => (
              <DesktopLink key={to} to={to} label={label} />
            ))}
          </nav>

          {/* Right controls */}
          <div className="flex items-center gap-2 ml-auto">
            <ThemeToggle />
            <Avatar initials="AG" size="sm" />

            {/* Mobile hamburger */}
            <button
              onClick={() => setOpen(v => !v)}
              className="lg:hidden p-2 rounded-lg text-[#888888] hover:text-[#f1f1f1]
                         hover:bg-[#2a2a2a] transition-colors ml-1"
              aria-label="Toggle menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile dropdown menu */}
      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-20 bg-black/50 lg:hidden"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className="fixed top-14 left-0 right-0 z-20 lg:hidden
                         bg-[#111111] border-b border-[#2a2a2a]
                         [.light_&]:bg-white [.light_&]:border-[#e5e5e5]"
            >
              {navItems.map(({ to, label, icon }) => (
                <MobileLink
                  key={to}
                  to={to}
                  label={label}
                  icon={icon}
                  onClick={() => setOpen(false)}
                />
              ))}
              <div className="px-4 py-3 border-t border-[#2a2a2a] [.light_&]:border-[#e5e5e5]">
                <p className="text-[#555555] text-xs">© 2025 ALGO Group</p>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
