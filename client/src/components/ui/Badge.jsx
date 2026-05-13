// Pill label for event types and status indicators
const variants = {
  brand:   'bg-brand-soft text-brand border border-brand/20',
  green:   'bg-[rgba(16,185,129,0.12)] text-success border border-[rgba(16,185,129,0.25)]',
  amber:   'bg-[rgba(245,158,11,0.12)] text-warning border border-[rgba(245,158,11,0.25)]',
  red:     'bg-[rgba(239,68,68,0.12)] text-danger border border-[rgba(239,68,68,0.25)]',
  muted:   'bg-card text-ink-muted border border-edge',
}

export default function Badge({ children, variant = 'brand' }) {
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-pill
                      text-xs font-medium ${variants[variant]}`}>
      {children}
    </span>
  )
}
