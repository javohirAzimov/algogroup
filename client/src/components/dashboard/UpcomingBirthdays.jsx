import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Cake, Loader } from 'lucide-react'
import { getUpcomingBirthdays } from '../../services/api'
import BirthdayWallModal from './BirthdayWallModal'

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

function formatDate(str) {
  if (!str) return ''
  const [mm, dd] = str.split('-').map(Number)
  return `${MONTHS[mm - 1]} ${dd}`
}

function daysLabel(n) {
  if (n === 0) return { text: 'Today!', cls: 'text-warning font-bold' }
  if (n === 1) return { text: 'Tomorrow', cls: 'text-brand font-semibold' }
  return { text: `in ${n} days`, cls: 'text-ink-muted' }
}

function Avatar({ name }) {
  const initials = name ? name.split(' ').map(w => w[0]).join('').slice(0, 2).toUpperCase() : '?'
  return (
    <div className="w-9 h-9 rounded-full bg-brand/20 border border-brand/30 flex items-center justify-center flex-shrink-0">
      <span className="text-brand text-xs font-bold">{initials}</span>
    </div>
  )
}

export default function UpcomingBirthdays() {
  const [people, setPeople]     = useState([])
  const [loading, setLoading]   = useState(true)
  const [selected, setSelected] = useState(null)

  useEffect(() => {
    getUpcomingBirthdays()
      .then(r => setPeople(r.data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  if (!loading && people.length === 0) return null

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="glass rounded-xl border border-edge overflow-hidden"
      >
        <div className="flex items-center gap-2 px-5 py-3.5 border-b border-edge">
          <Cake size={14} className="text-brand" />
          <span className="text-ink text-sm font-semibold">Upcoming Birthdays</span>
        </div>

        {loading ? (
          <div className="flex justify-center py-6">
            <Loader size={18} className="text-ink-subtle animate-spin" />
          </div>
        ) : (
          <div className="divide-y divide-edge">
            {people.map((p, i) => {
              const label = daysLabel(p.daysUntil)
              return (
                <motion.div
                  key={p.id}
                  initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.06 }}
                  className="flex items-center gap-3 px-5 py-3"
                >
                  <div className="relative">
                    <Avatar name={p.name} />
                    {p.daysUntil === 0 && (
                      <span className="absolute -top-1 -right-1 text-base">🎂</span>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-ink text-sm font-medium truncate">{p.name}</p>
                    <p className="text-ink-muted text-xs">{formatDate(p.birthday)} · <span className={label.cls}>{label.text}</span></p>
                  </div>
                  <button
                    onClick={() => setSelected(p)}
                    className="px-3 py-1 rounded-lg glass border border-edge text-ink-muted text-xs font-medium hover:text-brand hover:border-brand transition-colors whitespace-nowrap"
                  >
                    {p.daysUntil === 0 ? '🎉 Wish' : 'Wall'}
                  </button>
                </motion.div>
              )
            })}
          </div>
        )}
      </motion.div>

      {selected && (
        <BirthdayWallModal person={selected} onClose={() => setSelected(null)} />
      )}
    </>
  )
}
