import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import FeaturedEventCard from '../components/announcements/FeaturedEventCard'
import NoticeCard from '../components/announcements/NoticeCard'
import { getAnnouncements } from '../services/api'

export default function Announcements() {
  const [events,  setEvents]  = useState([])
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    getAnnouncements()
      .then(r => {
        setEvents(r.data.filter(a => a.type === 'event'))
        setNotices(r.data.filter(a => a.type === 'notice'))
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="flex justify-center py-24">
        <div className="w-6 h-6 border-2 border-brand border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      {/* Featured events */}
      <section className="mb-10">
        <div className="mb-5">
          <h2 className="text-lg font-semibold text-ink">Upcoming Events</h2>
          <p className="text-ink-muted text-sm mt-0.5">
            Stay in the loop with what's happening at ALGO Group.
          </p>
        </div>

        {events.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {events.map((event, i) => (
              <FeaturedEventCard key={event.id} event={event} index={i} />
            ))}
          </div>
        ) : (
          <p className="text-ink-muted text-sm py-8 text-center">No upcoming events.</p>
        )}
      </section>

      {notices.length > 0 && (
        <>
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-edge" />
            <span className="text-ink-subtle text-xs font-medium uppercase tracking-widest whitespace-nowrap">
              Internal Notices
            </span>
            <div className="flex-1 h-px bg-edge" />
          </div>

          <section className="flex flex-col gap-3">
            {notices.map((notice, i) => (
              <NoticeCard key={notice.id} notice={notice} index={i} />
            ))}
          </section>
        </>
      )}
    </motion.div>
  )
}
