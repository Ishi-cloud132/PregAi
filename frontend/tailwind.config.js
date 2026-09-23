/** @type {import('tailwindcss').Config} */
function themeColor(name) {
  return `rgb(var(${name}) / <alpha-value>)`
}

export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        base: {
          DEFAULT: themeColor('--c-base'),
          raised: themeColor('--c-base-raised'),
        },
        surface: {
          DEFAULT: themeColor('--c-surface'),
          elevated: themeColor('--c-surface-elevated'),
          hover: themeColor('--c-surface-hover'),
        },
        border: {
          DEFAULT: themeColor('--c-border'),
          subtle: themeColor('--c-border-subtle'),
        },
        ink: {
          DEFAULT: themeColor('--c-ink'),
          muted: themeColor('--c-ink-muted'),
          faint: themeColor('--c-ink-faint'),
        },
        // Primary accent — deep navy blue, matching the NIRMAY / SIH deck's
        // title color. Used for primary actions, active navigation, and
        // the main brand identity.
        brand: {
          DEFAULT: themeColor('--c-brand'),
          dim: themeColor('--c-brand-dim'),
          glow: themeColor('--c-brand-glow'),
        },
        // Secondary analytical accent — teal, matching the deck's teal
        // outline boxes. Used strategically for comparative/analytical
        // contexts (e.g. "Session B" in a two-series chart).
        secondary: {
          DEFAULT: themeColor('--c-secondary'),
          dim: themeColor('--c-secondary-dim'),
        },
        // Decorative accent variety for reactive/interactive surfaces
        // (stat card icons, avatars, chips), pulled from the rest of the
        // deck's palette — violet/purple and warm gold — so hover states
        // aren't all one hue. Not tied to any clinical meaning.
        purple: {
          DEFAULT: themeColor('--c-accent-purple'),
          dim: themeColor('--c-accent-purple-dim'),
        },
        gold: {
          DEFAULT: themeColor('--c-accent-gold'),
          dim: themeColor('--c-accent-gold-dim'),
        },
        status: {
          normal: themeColor('--c-status-normal'),
          warning: themeColor('--c-status-warning'),
          critical: themeColor('--c-status-critical'),
          disconnected: themeColor('--c-status-disconnected'),
          demo: themeColor('--c-status-demo'),
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        sans: ['Inter', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'card-sheen': 'linear-gradient(180deg, rgb(var(--c-brand) / 0.05) 0%, rgb(var(--c-brand) / 0) 40%)',
        'brand-fade': 'linear-gradient(135deg, rgb(var(--c-brand) / 0.14) 0%, rgb(var(--c-secondary) / 0.06) 100%)',
      },
      boxShadow: {
        glow: '0 0 0 1px rgb(var(--c-brand) / 0.35), 0 0 24px -4px rgb(var(--c-brand) / 0.4)',
        'glow-sm': '0 0 0 1px rgb(var(--c-brand) / 0.25), 0 0 12px -4px rgb(var(--c-brand) / 0.35)',
        'glow-secondary': '0 0 0 1px rgb(var(--c-secondary) / 0.3), 0 0 20px -4px rgb(var(--c-secondary) / 0.4)',
        'glow-gold': '0 0 0 1px rgb(var(--c-accent-gold) / 0.3), 0 0 20px -4px rgb(var(--c-accent-gold) / 0.4)',
        'glow-purple': '0 0 0 1px rgb(var(--c-accent-purple) / 0.3), 0 0 20px -4px rgb(var(--c-accent-purple) / 0.4)',
      },
      keyframes: {
        pulseDot: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.35 },
        },
        fadeInUp: {
          '0%': { opacity: 0, transform: 'translateY(6px)' },
          '100%': { opacity: 1, transform: 'translateY(0)' },
        },
      },
      animation: {
        pulseDot: 'pulseDot 1.8s ease-in-out infinite',
        fadeInUp: 'fadeInUp 0.45s ease-out both',
      },
    },
  },
  plugins: [],
}
