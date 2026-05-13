// Base surface card using design-token colors — auto-adapts light/dark
export default function Card({ children, className = '', onClick }) {
  return (
    <div
      onClick={onClick}
      className={`bg-card border border-edge rounded-lg shadow-sm
                  transition-colors duration-150
                  ${onClick ? 'cursor-pointer' : ''}
                  ${className}`}
    >
      {children}
    </div>
  )
}
