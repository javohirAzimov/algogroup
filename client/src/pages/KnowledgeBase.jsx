import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ScrollText, Users, ClipboardList, ShieldCheck,
  BookMarked, GraduationCap, CalendarDays, Building2,
  Star, Clock, Zap, TrendingUp,
} from 'lucide-react'
import SearchBar from '../components/knowledge/SearchBar'
import CategoryCard from '../components/knowledge/CategoryCard'

const categories = [
  { id: 1, title: 'Company Policies',    icon: ShieldCheck,   articleCount: 12 },
  { id: 2, title: 'HR Guidelines',       icon: Users,         articleCount: 8  },
  { id: 3, title: 'Work Procedures',     icon: ClipboardList, articleCount: 15 },
  { id: 4, title: 'Internal Rules',      icon: ScrollText,    articleCount: 6  },
  { id: 5, title: 'Employee Guides',     icon: BookMarked,    articleCount: 10 },
  { id: 6, title: 'Training Materials',  icon: GraduationCap, articleCount: 9  },
  { id: 7, title: 'Event Guidelines',    icon: CalendarDays,  articleCount: 4  },
  { id: 8, title: 'Workplace Standards', icon: Building2,     articleCount: 7  },
]

const FEATURED = [
  { icon: Star,       title: 'Employee Handbook 2025',    desc: 'Complete guide to company policies and expectations', tag: 'Essential' },
  { icon: Zap,        title: 'Quick Start for New Hires', desc: 'Everything you need to get started at ALGO Group',   tag: 'Popular' },
  { icon: ShieldCheck, title: 'Code of Conduct',          desc: 'Our shared standards and professional expectations',  tag: 'Policy' },
]

const TRENDING = [
  { title: 'Remote Work Policy',       views: '142' },
  { title: 'Performance Review Guide', views: '98' },
  { title: 'Benefits Overview 2025',   views: '87' },
  { title: 'Leave & Time-Off Policy',  views: '74' },
]

const QUICK_LINKS = [
  { label: 'HR Contact',        icon: Users },
  { label: 'IT Support',        icon: Zap },
  { label: 'Training Schedule', icon: GraduationCap },
  { label: 'Event Calendar',    icon: CalendarDays },
]

const RECENT_DOCS = ['Travel & Expense Policy', 'Mentorship Program Guide', 'Safety Procedures 2025']

export default function KnowledgeBase() {
  const [query, setQuery] = useState('')

  const filtered = categories.filter(c =>
    c.title.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.25 }}
    >
      {/* Header */}
      <div className="mb-5">
        <h2 className="text-lg font-semibold text-ink">Knowledge Base</h2>
        <p className="text-ink-muted text-sm mt-0.5">Browse company resources, policies, and guides.</p>
      </div>

      {/* Featured resources */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-7">
        {FEATURED.map(({ icon: Icon, title, desc, tag }, i) => (
          <motion.div
            key={title}
            initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25, delay: i * 0.06 }}
            className="glass rounded-xl p-4 card-float flex items-start gap-3 cursor-pointer"
          >
            <div className="w-8 h-8 rounded-lg bg-brand/10 border border-brand/20 flex items-center justify-center flex-shrink-0">
              <Icon size={14} className="text-brand" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-1">
                <p className="text-ink text-xs font-semibold leading-snug">{title}</p>
                <span className="text-brand text-[9px] font-bold uppercase px-1.5 py-0.5 rounded bg-brand/10 border border-brand/20 flex-shrink-0">{tag}</span>
              </div>
              <p className="text-ink-muted text-[11px] leading-relaxed">{desc}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Categories + sidebar */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2">
          <div className="mb-5 max-w-md">
            <SearchBar value={query} onChange={setQuery} />
          </div>
          {filtered.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {filtered.map((cat, i) => (
                <CategoryCard key={cat.id} category={cat} index={i} />
              ))}
            </div>
          ) : (
            <div className="glass rounded-xl py-16 text-center">
              <p className="text-ink-muted text-sm">No categories match "{query}"</p>
            </div>
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
              <TrendingUp size={12} className="text-amber-400" />
              <p className="text-ink-subtle text-[10px] font-semibold uppercase tracking-[0.12em]">Trending Articles</p>
            </div>
            <div className="flex flex-col">
              {TRENDING.map(({ title, views }, i) => (
                <div key={title} className="flex items-center gap-2.5 py-2.5 border-b border-edge last:border-0">
                  <span className="text-ink-subtle text-[10px] font-bold w-4 flex-shrink-0">{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-ink text-xs font-medium truncate">{title}</p>
                    <p className="text-ink-subtle text-[10px]">{views} views</p>
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
              <Zap size={12} className="text-brand" />
              <p className="text-ink-subtle text-[10px] font-semibold uppercase tracking-[0.12em]">Quick Links</p>
            </div>
            <div className="flex flex-col gap-1">
              {QUICK_LINKS.map(({ label, icon: Icon }) => (
                <button key={label} className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-white/5 transition-colors text-left w-full">
                  <Icon size={13} className="text-ink-muted" />
                  <span className="text-ink-muted text-xs font-medium">{label}</span>
                </button>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.28, delay: 0.22 }}
            className="glass rounded-xl p-4"
          >
            <div className="flex items-center gap-2 mb-3">
              <Clock size={12} className="text-indigo-400" />
              <p className="text-ink-subtle text-[10px] font-semibold uppercase tracking-[0.12em]">Recently Added</p>
            </div>
            <div className="flex flex-col">
              {RECENT_DOCS.map(doc => (
                <div key={doc} className="flex items-start gap-2 py-2 border-b border-edge last:border-0">
                  <span className="w-1 h-1 rounded-full bg-indigo-400 mt-1.5 flex-shrink-0" />
                  <p className="text-ink-muted text-xs">{doc}</p>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}
