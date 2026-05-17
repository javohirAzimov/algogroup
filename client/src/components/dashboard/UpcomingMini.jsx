import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CalendarDays } from 'lucide-react'
import { getAnnouncements } from '../../services/api'

const MONTH = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function UpcomingMini() {
  const [events, setEvents] = useState([])

  useEffect(() => {
    getAnnouncements()
      .then(({ data }) => {
        const today = new Date()
        today.setHours(0, 0, 0, 0)
        const upcoming = data
          .filter(a => new Date(a.date) >= today)
          .sort((a, b) => new Date(a.date) - new Date(b.date))
          .slice(0, 3)
        setEvents(upcoming)
      })
      .catch(() => {})
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: 0.14 }}
      className="glass rounded-xl p-4"
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-ink-subtle text-[10px] font-semibold uppercase tracking-[0.12em]">Upcoming</p>
        <CalendarDays size={12} className="text-ink-subtle" />
      </div>

      {events.length === 0 ? (
        <p className="text-ink-subtle text-xs text-center py-2">No upcoming events</p>
      ) : (
        <div className="flex flex-col gap-3">
          {events.map(({ id, title, date, type }) => {
            const d = new Date(date)
            return (
              <div key={id} className="flex items-start gap-2.5">
                <div className="w-8 text-center flex-shrink-0 pt-0.5">
                  <p className="text-brand text-[10px] font-bold leading-none">{MONTH[d.getMonth()]}</p>
                  <p className="text-ink-subtle text-[9px]">{d.getDate()}</p>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-ink text-xs font-medium leading-snug truncate">{title}</p>
                  <p className="text-ink-subtle text-[10px]">{type}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
