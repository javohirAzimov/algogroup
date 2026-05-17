import { createContext, useContext, useEffect, useState } from 'react'
import { io } from 'socket.io-client'
import { useAuth } from './AuthContext'

const SocketContext = createContext({ socket: null, onlineCount: 0, onlineUsers: [] })

// In production the React app is served by Express on the same origin.
// In dev, Vite runs on :3000 and the backend on :5000.
const SOCKET_URL = import.meta.env.PROD
  ? window.location.origin
  : 'http://localhost:5000'

export function SocketProvider({ children }) {
  const { user } = useAuth()
  const [socket, setSocket] = useState(null)
  const [onlineCount, setOnlineCount] = useState(0)
  const [onlineUsers, setOnlineUsers] = useState([])

  useEffect(() => {
    if (!user) {
      setSocket(null)
      return
    }
    const token = localStorage.getItem('algo-token')
    const s = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
    })

    s.on('online_count', count => setOnlineCount(count))
    s.on('online_users', users => setOnlineUsers(users))

    setSocket(s)
    return () => {
      s.disconnect()
      setSocket(null)
      setOnlineCount(0)
      setOnlineUsers([])
    }
  }, [user])

  return (
    <SocketContext.Provider value={{ socket, onlineCount, onlineUsers }}>
      {children}
    </SocketContext.Provider>
  )
}

export function useSocket() {
  return useContext(SocketContext)
}
