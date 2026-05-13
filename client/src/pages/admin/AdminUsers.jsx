import { useState, useEffect } from 'react'
import { ShieldCheck, ShieldOff, UserX, UserCheck, Search } from 'lucide-react'
import { getUsers, toggleUserActive, promoteUser, demoteUser } from '../../services/api'
import { useAuth } from '../../context/AuthContext'

function roleBadge(role) {
  return role === 'admin'
    ? 'bg-brand-soft text-brand border border-brand/20'
    : 'bg-surface text-ink-muted border border-edge'
}

export default function AdminUsers() {
  const { user: me }      = useAuth()
  const [users, setUsers] = useState([])
  const [query, setQuery] = useState('')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getUsers().then(r => setUsers(r.data)).finally(() => setLoading(false))
  }, [])

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(query.toLowerCase()) ||
    u.email.toLowerCase().includes(query.toLowerCase()) ||
    (u.department || '').toLowerCase().includes(query.toLowerCase())
  )

  async function doToggle(id) {
    const { data } = await toggleUserActive(id)
    setUsers(prev => prev.map(u => u.id === id ? data : u))
  }

  async function doPromote(id) {
    const { data } = await promoteUser(id)
    setUsers(prev => prev.map(u => u.id === id ? data : u))
  }

  async function doDemote(id) {
    const { data } = await demoteUser(id)
    setUsers(prev => prev.map(u => u.id === id ? data : u))
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-ink font-semibold text-xl">Users</h1>
          <p className="text-ink-muted text-sm mt-0.5">{users.length} registered account{users.length !== 1 ? 's' : ''}</p>
        </div>
        <div className="relative">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink-subtle" />
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search users…"
            className="bg-card border border-edge rounded-md pl-8 pr-3 py-1.5 text-sm text-ink
                       placeholder:text-ink-subtle focus:outline-none focus:border-brand transition-colors w-52"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center py-16">
          <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <div className="bg-card border border-edge rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-edge text-ink-subtle text-xs font-medium uppercase tracking-wider">
                <th className="text-left px-4 py-3">User</th>
                <th className="text-left px-4 py-3">Department</th>
                <th className="text-left px-4 py-3">Role</th>
                <th className="text-left px-4 py-3">Status</th>
                <th className="text-left px-4 py-3">Joined</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-edge">
              {filtered.map(u => (
                <tr key={u.id} className="hover:bg-surface/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-full bg-brand flex items-center justify-center flex-shrink-0">
                        <span className="text-ink-on text-xs font-semibold">{u.name[0]?.toUpperCase()}</span>
                      </div>
                      <div>
                        <p className="text-ink font-medium">{u.name}</p>
                        <p className="text-ink-subtle text-xs">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-ink-muted">{u.department || '—'}</td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${roleBadge(u.role)}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`text-xs px-2 py-0.5 rounded-full font-medium
                      ${u.isActive ? 'bg-success/10 text-success border border-success/20' : 'bg-danger/10 text-danger border border-danger/20'}`}>
                      {u.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-ink-subtle text-xs">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    {u.id !== me?.id && (
                      <div className="flex items-center gap-1 justify-end">
                        {u.role !== 'admin'
                          ? <button onClick={() => doPromote(u.id)} title="Promote to admin"
                              className="p-1.5 text-ink-subtle hover:text-brand transition-colors rounded">
                              <ShieldCheck size={14} />
                            </button>
                          : <button onClick={() => doDemote(u.id)} title="Demote to user"
                              className="p-1.5 text-ink-subtle hover:text-warning transition-colors rounded">
                              <ShieldOff size={14} />
                            </button>
                        }
                        <button onClick={() => doToggle(u.id)} title={u.isActive ? 'Deactivate' : 'Activate'}
                          className={`p-1.5 transition-colors rounded
                            ${u.isActive ? 'text-ink-subtle hover:text-danger' : 'text-ink-subtle hover:text-success'}`}>
                          {u.isActive ? <UserX size={14} /> : <UserCheck size={14} />}
                        </button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-12 text-center text-ink-muted text-sm">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
