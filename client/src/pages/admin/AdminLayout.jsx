import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Megaphone, Star, Users, ImageIcon, ArrowLeft, LogOut, Rocket, Trophy, Gift } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'

const links = [
  { to: '/admin/announcements', icon: Megaphone,  label: 'Announcements' },
  { to: '/admin/spotlight',     icon: Star,        label: 'Spotlight'     },
  { to: '/admin/users',         icon: Users,       label: 'Users'         },
  { to: '/admin/media',         icon: ImageIcon,   label: 'Media'         },
  { to: '/admin/startups',      icon: Rocket,      label: 'Start-Ups'     },
  { to: '/admin/tournaments',   icon: Trophy,      label: 'Tournaments'   },
  { to: '/admin/rewards',       icon: Gift,        label: 'Rewards'       },
]

export default function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-canvas flex">
      {/* Admin sidebar */}
      <aside className="w-56 bg-surface border-r border-edge flex-shrink-0 flex flex-col">
        <div className="p-5 border-b border-edge">
          <div className="flex items-center gap-2 mb-0.5">
            <div className="w-7 h-7 rounded bg-brand flex items-center justify-center">
              <span className="text-ink-on font-bold text-sm leading-none">A</span>
            </div>
            <span className="text-ink font-semibold text-sm">Admin Panel</span>
          </div>
          <p className="text-ink-subtle text-xs mt-1 pl-9">{user?.name}</p>
        </div>

        <nav className="flex-1 p-3 space-y-0.5">
          {links.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors
                 ${isActive
                   ? 'bg-brand text-ink-on'
                   : 'text-ink-muted hover:text-ink hover:bg-card'}`
              }
            >
              <Icon size={15} />
              {label}
            </NavLink>
          ))}
        </nav>

        <div className="p-3 border-t border-edge space-y-0.5">
          <button
            onClick={() => navigate('/')}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm
                       text-ink-muted hover:text-ink hover:bg-card transition-colors"
          >
            <ArrowLeft size={15} />
            Back to portal
          </button>
          <button
            onClick={() => { logout(); navigate('/login') }}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-md text-sm
                       text-ink-muted hover:text-danger transition-colors"
          >
            <LogOut size={15} />
            Sign out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 min-h-screen">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
