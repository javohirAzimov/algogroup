import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Pin, TrendingUp, Bell } from 'lucide-react'
import FeaturedEventCard from '../components/announcements/FeaturedEventCard'
import NoticeCard from '../components/announcements/NoticeCard'
import { getAnnouncements } from '../services/api'

const PINNED = [
  { title: 'Company Handbook Updated',   date: 'May 1, 2025' },
  { title: 'New Benefits Portal Live',   date: 'Apr 15, 2025' },
  { title: 'Holiday Schedule Published', date: 'Apr 1, 2025' },
]

const TRENDING = [
  'Q2 Performance Reviews Start',
  'New Remote Work Policy',
  'Team Building Registration Open',
  'Wellness Program Launch',
]

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
      className="grid grid-cols-1 xl:grid-cols-3 gap-6"
    >
      {/* Main content */}
      <div className="xl:col-span-2 space-y-8">
        <section>
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
            <div className="glass rounded-xl py-10 text-center">
              <p className="text-ink-muted text-sm">No upcoming events.</p>
            </div>
          )}
        </section>

        {notices.length > 0 && (
          <section>
            <div className="flex items-center gap-4 mb-5">
              <div className="flex-1 h-px bg-edge" />
              <span className="text-ink-subtle text-xs font-medium uppercase tracking-widest whitespace-nowrap">
                Internal Notices
              </span>
              <div className="flex-1 h-px bg-edge" />
            </div>
            <div className="flex flex-col gap-3">
              {notices.map((notice, i) => (
                <NoticeCard key={notice.id} notice={notice} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>

      {/* Sidebar */}
      <div className="flex flex-col gap-4">
        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.28, delay: 0.1 }}
          className="glass rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Pin size={12} className="text-brand" />
            <p className="text-ink-subtle text-[10px] font-semibold uppercase tracking-[0.12em]">Pinned</p>
          </div>
          <div className="flex flex-col">
            {PINNED.map(({ title, date }) => (
              <div key={title} className="flex items-start gap-2.5 py-2.5 border-b border-edge last:border-0">
                <span className="w-1 h-1 rounded-full bg-brand mt-1.5 flex-shrink-0" />
                <div>
                  <p className="text-ink text-xs font-medium leading-snug">{title}</p>
                  <p className="text-ink-subtle text-[10px] mt-0.5">{date}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.28, delay: 0.16 }}
          className="glass rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <TrendingUp size={12} className="text-amber-400" />
            <p className="text-ink-subtle text-[10px] font-semibold uppercase tracking-[0.12em]">Trending</p>
          </div>
          <div className="flex flex-col gap-2.5">
            {TRENDING.map((item, i) => (
              <div key={item} className="flex items-center gap-2.5">
                <span className="text-ink-subtle text-[10px] font-bold w-4 flex-shrink-0">{i + 1}</span>
                <p className="text-ink-muted text-xs leading-snug">{item}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.28, delay: 0.22 }}
          className="glass rounded-xl p-4"
        >
          <div className="flex items-center gap-2 mb-3">
            <Bell size={12} className="text-indigo-400" />
            <p className="text-ink-subtle text-[10px] font-semibold uppercase tracking-[0.12em]">Stay Updated</p>
          </div>
          <p className="text-ink-muted text-xs leading-relaxed">
            Check this page regularly for the latest company announcements,
            events, and internal notices from the ALGO Group team.
          </p>
          <div className="mt-3 p-2.5 rounded-lg bg-brand/5 border border-brand/15">
            <p className="text-brand text-[11px] font-medium">Next Event</p>
            <p className="text-ink-muted text-xs mt-0.5">Q2 All-Hands Meeting — May 15</p>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}
