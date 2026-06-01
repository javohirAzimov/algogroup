import { useLocation } from 'react-router-dom'
import { Menu } from 'lucide-react'
import ThemeToggle from '../ui/ThemeToggle'
import Avatar from '../ui/Avatar'
import { useAuth } from '../../context/AuthContext'

const pageTitles = {
  '/dashboard':     'Dashboard',
  '/announcements': 'Announcements',
  '/suggestions':   'Suggestions',
  '/knowledge':     'Knowledge Base',
  '/ai':            'AI Assistant',
  '/settings':      'Settings',
}

export default function TopBar({ onMenuClick }) {
  const { pathname } = useLocation()
  const { user }     = useAuth()
  const title        = pageTitles[pathname] ?? 'ALGO Group Portal'
  const initials     = user?.name
    ? user.name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase()
    : 'AG'

  return (
    <header className="fixed top-0 left-0 lg:left-60 right-0 h-14 z-20
                       bg-surface/80 backdrop-blur-xl border-b border-edge
                       flex items-center px-4 gap-3">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-black/5 dark:hover:bg-white/5 transition-colors"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      <div className="flex-1 flex items-center gap-2">
        <h1 className="text-ink font-semibold text-sm tracking-tight">{title}</h1>
        <span className="hidden sm:flex items-center gap-1.5 px-2 py-0.5 rounded-full
                         bg-brand/10 border border-brand/20 text-brand text-[10px] font-medium
                         shadow-[0_0_10px_rgba(0,200,83,0.08)]">
          <span className="w-1.5 h-1.5 rounded-full bg-brand shadow-[0_0_4px_rgba(0,200,83,0.8)]" />
          Live
        </span>
      </div>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <div className="flex items-center gap-2.5 pl-2 border-l border-edge">
          <span className="hidden sm:block text-ink-muted text-xs font-medium">{user?.name}</span>
          <Avatar initials={initials} size="sm" />
        </div>
      </div>
    </header>
  )
}
