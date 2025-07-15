/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{ts,tsx}', './pages/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'Inter', 'sans-serif'],
      },
      animation: {
        fadeIn: 'fadeIn 0.6s ease-out forwards',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0, transform: 'translateY(12px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
      colors: {
        background: '#0f172a',
        foreground: '#ffffff',
        card: '#1e293b',
        cardForeground: '#f4f4f5',
        primary: '#7c3aed',
        primaryForeground: '#ffffff',
        border: '#334155',
        input: '#475569',
        ring: '#6366f1',
        mutedForeground: '#94a3b8',
        accent: '#8b5cf6',
        accentForeground: '#ffffff',
        popover: '#1e1e2f',
        popoverForeground: '#f4f4f5',
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};