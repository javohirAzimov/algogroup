import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { CalendarDays, ChevronRight, Clock } from 'lucide-react'
import { getAnnouncements } from '../../services/api'

const MONTH = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

const TYPE_STYLE = {
  event:        'text-brand    bg-brand/10    border-brand/20',
  announcement: 'text-amber-400 bg-amber-400/10 border-amber-400/20',
  meeting:      'text-indigo-400 bg-indigo-400/10 border-indigo-400/20',
  deadline:     'text-rose-400  bg-rose-400/10  border-rose-400/20',
}

function getDaysUntil(date) {
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  const target = new Date(date)
  target.setHours(0, 0, 0, 0)
  return Math.round((target - today) / (1000 * 60 * 60 * 24))
}

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
      className="glass rounded-xl overflow-hidden"
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b border-edge">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-brand/10 border border-brand/20 flex items-center justify-center">
            <CalendarDays size={11} className="text-brand" />
          </div>
          <span className="font-data text-ink text-[11px] font-semibold uppercase tracking-[0.10em]">
            Upcoming
          </span>
        </div>
        {events.length > 0 && (
          <span className="w-5 h-5 rounded-full bg-brand/15 border border-brand/25 flex items-center justify-center text-brand text-[10px] font-bold font-data">
            {events.length}
          </span>
        )}
      </div>

      {events.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
          <Clock size={18} className="text-ink-subtle opacity-30" />
          <p className="text-ink-subtle text-xs">No upcoming events</p>
        </div>
      ) : (
        <div className="flex flex-col">
          {events.map(({ id, title, date, type }, i) => {
            const d = new Date(date)
            const daysUntil = getDaysUntil(date)
            const isToday = daysUntil === 0
            const isTomorrow = daysUntil === 1
            const isSoon = daysUntil <= 3
            const typeCls = TYPE_STYLE[type] || TYPE_STYLE.event

            return (
              <div
                key={id}
                className={`flex items-center gap-3 px-4 py-3 transition-colors duration-150 hover:bg-brand/[0.04]
                            ${i < events.length - 1 ? 'border-b border-edge' : ''}`}
              >
                {/* Date pill */}
                <div className={`flex-shrink-0 w-10 rounded-lg text-center py-1.5 border
                                  ${isToday
                                    ? 'bg-brand/20 border-brand/40'
                                    : 'bg-card border-edge'}`}>
                  <p className={`text-[8px] font-data font-bold uppercase leading-none tracking-wide
                                  ${isToday ? 'text-brand' : 'text-ink-subtle'}`}>
                    {MONTH[d.getMonth()]}
                  </p>
                  <p className={`text-[15px] font-display font-black leading-tight mt-0.5
                                  ${isToday ? 'text-brand' : 'text-ink'}`}>
                    {d.getDate()}
                  </p>
                </div>

                {/* Event details */}
                <div className="flex-1 min-w-0">
                  <p className="text-ink text-[11px] font-semibold truncate leading-snug">{title}</p>
                  <div className="flex items-center gap-1.5 mt-1">
                    <span className={`inline-flex items-center px-1.5 py-px rounded border text-[9px] font-semibold font-data uppercase tracking-wide ${typeCls}`}>
                      {type || 'event'}
                    </span>
                    {isToday && (
                      <span className="text-brand text-[9px] font-data font-bold">Today!</span>
                    )}
                    {isTomorrow && (
                      <span className="text-amber-400 text-[9px] font-data font-semibold">Tomorrow</span>
                    )}
                    {isSoon && !isToday && !isTomorrow && (
                      <span className="text-amber-400 text-[9px] font-data">in {daysUntil}d</span>
                    )}
                  </div>
                </div>

                <ChevronRight size={11} className="text-ink-subtle flex-shrink-0 opacity-35" />
              </div>
            )
          })}
        </div>
      )}
    </motion.div>
  )
}
