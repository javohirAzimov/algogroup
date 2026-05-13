// Real-time search input for knowledge category filtering
import { Search } from 'lucide-react'

export default function SearchBar({ value, onChange }) {
  return (
    <div className="relative">
      <Search size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2
                                   text-ink-subtle pointer-events-none" />
      <input
        type="text" value={value} onChange={e => onChange(e.target.value)}
        placeholder="Search categories…"
        className="w-full bg-card border border-edge rounded-lg pl-10 pr-4 py-2.5
                   text-sm text-ink placeholder-ink-subtle
                   focus:outline-none focus:border-brand focus:shadow-focus
                   transition-colors duration-150"
      />
    </div>
  )
}
