import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-canvas transition-colors duration-200 relative">
      {/* Ambient background — dark mode only */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none">
        <div className="dark:block hidden">
          {/* Primary green orb — top left */}
          <div className="animate-orb-1 absolute -top-48 -left-48 w-[700px] h-[700px] rounded-full
                          bg-[#006000]/25 blur-[130px]" />
          {/* Secondary orb — bottom right */}
          <div className="animate-orb-2 absolute -bottom-64 -right-32 w-[600px] h-[600px] rounded-full
                          bg-[#004400]/20 blur-[120px]" />
          {/* Accent orb — top right area */}
          <div className="animate-orb-3 absolute top-1/3 right-1/4 w-[350px] h-[350px] rounded-full
                          bg-[#002200]/15 blur-[90px]" />
          {/* Subtle grid overlay */}
          <div className="absolute inset-0 opacity-[0.025]"
               style={{
                 backgroundImage: `linear-gradient(rgba(0,200,83,0.4) 1px, transparent 1px),
                                   linear-gradient(90deg, rgba(0,200,83,0.4) 1px, transparent 1px)`,
                 backgroundSize: '60px 60px'
               }} />
        </div>
      </div>

      <Sidebar mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <TopBar onMenuClick={() => setMobileOpen(true)} />

      <main className="pt-14 lg:pl-60 min-h-screen">
        <div className="max-w-5xl mx-auto px-5 sm:px-7 py-8">
          <Outlet />
        </div>
      </main>
    </div>
  )
}
