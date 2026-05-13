// Root layout — fixed sidebar + top bar + scrollable page content
import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import TopBar from './TopBar'

export default function Layout() {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="min-h-screen bg-canvas transition-colors duration-200">
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
