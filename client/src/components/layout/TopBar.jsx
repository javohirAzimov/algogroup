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
                       bg-surface/90 backdrop-blur-sm border-b border-edge
                       flex items-center px-4 gap-3">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-ink-muted hover:text-ink hover:bg-card transition-colors"
        aria-label="Open menu"
      >
        <Menu size={18} />
      </button>

      <h1 className="flex-1 text-ink font-semibold text-base truncate">{title}</h1>

      <div className="flex items-center gap-2">
        <ThemeToggle />
        <div className="flex items-center gap-2">
          <span className="hidden sm:block text-ink-muted text-sm">{user?.name}</span>
          <Avatar initials={initials} size="sm" />
        </div>
      </div>
    </header>
  )
}
