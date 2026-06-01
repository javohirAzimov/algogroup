/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        canvas:  'var(--bg)',
        surface: 'var(--surface)',
        card:    'var(--surface-2)',

        edge: {
          DEFAULT: 'var(--border)',
          strong:  'var(--border-strong)',
        },

        ink: {
          DEFAULT: 'var(--fg)',
          muted:   'var(--fg-muted)',
          subtle:  'var(--fg-subtle)',
          on:      'var(--fg-on-accent)',
        },

        brand: {
          DEFAULT: 'var(--accent)',
          h:       'var(--accent-hover)',
          soft:    'var(--accent-soft)',
        },

        success: 'var(--success)',
        warning: 'var(--warning)',
        danger:  'var(--danger)',
        info:    'var(--info)',
      },

      fontFamily: {
        sans:    ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Syne', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        data:    ['"Fira Code"', '"Fira Mono"', 'ui-monospace', 'monospace'],
      },

      boxShadow: {
        sm:       'var(--shadow-sm)',
        md:       'var(--shadow-md)',
        lg:       'var(--shadow-lg)',
        focus:    'var(--shadow-focus)',
        glow:     'var(--glow-brand)',
        'glow-sm':'var(--glow-brand-sm)',
      },

      borderRadius: {
        sm:   '6px',
        md:   '10px',
        lg:   '14px',
        xl:   '18px',
        '2xl':'24px',
        pill: '999px',
      },

      backdropBlur: {
        xs: '4px',
        sm: '8px',
        md: '16px',
        lg: '24px',
        xl: '32px',
      },

      transitionTimingFunction: {
        'ease-out-expo': 'cubic-bezier(0.22, 1, 0.36, 1)',
      },

      transitionDuration: {
        250: '250ms',
        350: '350ms',
      },
    },
  },
  plugins: [],
}
