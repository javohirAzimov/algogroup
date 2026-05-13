// Reusable button — primary (forest green), ghost, outline variants
export default function Button({
  children,
  variant = 'primary',
  type = 'button',
  disabled = false,
  fullWidth = false,
  onClick,
}) {
  const base = `inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg
                font-medium text-sm transition-all duration-150 disabled:opacity-50
                disabled:cursor-not-allowed focus:outline-none focus:shadow-focus
                ${fullWidth ? 'w-full' : ''}`

  const variants = {
    primary: 'bg-brand hover:bg-brand-h text-ink-on',
    ghost:   'bg-transparent hover:bg-card text-ink-muted hover:text-ink',
    outline: 'border border-edge hover:border-brand text-ink hover:text-brand',
  }

  return (
    <button type={type} disabled={disabled} onClick={onClick}
            className={`${base} ${variants[variant]}`}>
      {children}
    </button>
  )
}
