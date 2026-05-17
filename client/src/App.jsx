import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { AuthProvider } from './context/AuthContext'
import { SocketProvider } from './context/SocketContext'
import ProtectedRoute from './components/layout/ProtectedRoute'
import AdminRoute from './components/layout/AdminRoute'
import Layout from './components/layout/Layout'
import AdminLayout from './pages/admin/AdminLayout'

import MainPage        from './pages/MainPage'
import Dashboard       from './pages/Dashboard'
import Announcements   from './pages/Announcements'
import Suggestions     from './pages/Suggestions'
import KnowledgeBase   from './pages/KnowledgeBase'
import AIAssistant     from './pages/AIAssistant'
import Settings        from './pages/Settings'
import StartUps        from './pages/StartUps'
import Login           from './pages/Login'
import Register        from './pages/Register'

import AdminAnnouncements from './pages/admin/AdminAnnouncements'
import AdminSpotlight     from './pages/admin/AdminSpotlight'
import AdminUsers         from './pages/admin/AdminUsers'
import AdminMedia         from './pages/admin/AdminMedia'
import AdminStartups      from './pages/admin/AdminStartups'

export default function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <SocketProvider>
          <BrowserRouter>
            <Routes>
              {/* Public auth pages */}
              <Route path="/login"    element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* Protected main portal */}
              <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
                <Route index element={<Navigate to="/home" replace />} />
                <Route path="home"          element={<MainPage />} />
                <Route path="dashboard"     element={<Dashboard />} />
                <Route path="announcements" element={<Announcements />} />
                <Route path="suggestions"   element={<Suggestions />} />
                <Route path="knowledge"     element={<KnowledgeBase />} />
                <Route path="ai"            element={<AIAssistant />} />
                <Route path="settings"      element={<Settings />} />
                <Route path="startups"      element={<StartUps />} />
              </Route>

              {/* Admin panel */}
              <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
                <Route index element={<Navigate to="/admin/announcements" replace />} />
                <Route path="announcements" element={<AdminAnnouncements />} />
                <Route path="spotlight"     element={<AdminSpotlight />} />
                <Route path="users"         element={<AdminUsers />} />
                <Route path="media"         element={<AdminMedia />} />
                <Route path="startups"      element={<AdminStartups />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </SocketProvider>
      </AuthProvider>
    </ThemeProvider>
  )
}
