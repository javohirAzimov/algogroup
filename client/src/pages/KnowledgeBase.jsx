// Knowledge Base page — searchable grid of category cards
import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  ScrollText, Users, ClipboardList, ShieldCheck,
  BookMarked, GraduationCap, CalendarDays, Building2,
} from 'lucide-react'
import SearchBar from '../components/knowledge/SearchBar'
import CategoryCard from '../components/knowledge/CategoryCard'

const categories = [
  { id: 1, title: 'Company Policies',    icon: ShieldCheck,    articleCount: 12 },
  { id: 2, title: 'HR Guidelines',       icon: Users,          articleCount: 8  },
  { id: 3, title: 'Work Procedures',     icon: ClipboardList,  articleCount: 15 },
  { id: 4, title: 'Internal Rules',      icon: ScrollText,     articleCount: 6  },
  { id: 5, title: 'Employee Guides',     icon: BookMarked,     articleCount: 10 },
  { id: 6, title: 'Training Materials',  icon: GraduationCap,  articleCount: 9  },
  { id: 7, title: 'Event Guidelines',    icon: CalendarDays,   articleCount: 4  },
  { id: 8, title: 'Workplace Standards', icon: Building2,      articleCount: 7  },
]

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
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-[#f1f1f1] [.light_&]:text-[#111111]">
          Knowledge Base
        </h2>
        <p className="text-[#888888] text-sm mt-0.5">
          Browse company resources, policies, and guides.
        </p>
      </div>

      {/* Search */}
      <div className="mb-7 max-w-md">
        <SearchBar value={query} onChange={setQuery} />
      </div>

      {/* Category grid */}
      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((cat, i) => (
            <CategoryCard key={cat.id} category={cat} index={i} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16">
          <p className="text-[#888888] text-sm">No categories match "{query}"</p>
        </div>
      )}
    </motion.div>
  )
}
