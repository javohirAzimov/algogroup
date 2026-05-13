// Circular avatar with initials fallback and optional image
export default function Avatar({ initials = 'AG', src = null, size = 'md' }) {
  const sizes = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
    lg: 'w-14 h-14 text-lg',
    xl: 'w-20 h-20 text-2xl',
  }

  return (
    <div className={`${sizes[size]} rounded-pill bg-brand flex items-center justify-center
                     font-semibold text-ink-on flex-shrink-0 overflow-hidden`}>
      {src
        ? <img src={src} alt={initials} className="w-full h-full object-cover" />
        : <span>{initials}</span>
      }
    </div>
  )
}
