// Tailwind config — CSS-variable-backed design tokens, class-based dark mode
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // Surface layers
        canvas:  'var(--bg)',
        surface: 'var(--surface)',
        card:    'var(--surface-2)',

        // Borders
        edge: {
          DEFAULT: 'var(--border)',
          strong:  'var(--border-strong)',
        },

        // Text
        ink: {
          DEFAULT: 'var(--fg)',
          muted:   'var(--fg-muted)',
          subtle:  'var(--fg-subtle)',
          on:      'var(--fg-on-accent)',
        },

        // Brand / accent (forest green)
        brand: {
          DEFAULT: 'var(--accent)',
          h:       'var(--accent-hover)',
          soft:    'var(--accent-soft)',
        },

        // Semantic states
        success: 'var(--success)',
        warning: 'var(--warning)',
        danger:  'var(--danger)',
        info:    'var(--info)',
      },

      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },

      boxShadow: {
        sm:    'var(--shadow-sm)',
        md:    'var(--shadow-md)',
        lg:    'var(--shadow-lg)',
        focus: 'var(--shadow-focus)',
      },

      borderRadius: {
        sm:   '6px',
        md:   '10px',
        lg:   '12px',
        xl:   '16px',
        pill: '999px',
      },
    },
  },
  plugins: [],
}
