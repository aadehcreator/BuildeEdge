/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  theme: {
    container: { center: true, padding: '2rem', screens: { '2xl': '1400px' } },
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E87722',
          dark: '#C45E00',
          foreground: '#ffffff',
        },
        secondary: { DEFAULT: '#1A1A1A', foreground: '#ffffff' },
        accent: { DEFAULT: '#16A34A', foreground: '#ffffff' },
        surface: '#F5F5F5',
        card: { DEFAULT: '#FFFFFF', foreground: '#1A1A1A' },
        border: '#E5E7EB',
        muted: { DEFAULT: '#F3F4F6', foreground: '#6B7280' },
        destructive: { DEFAULT: '#EF4444', foreground: '#ffffff' },
        background: '#F5F5F5',
        foreground: '#1A1A1A',
        input: '#E5E7EB',
        ring: '#E87722',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-poppins)', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: '0.75rem',
        md: '0.5rem',
        sm: '0.25rem',
      },
      keyframes: {
        'accordion-down': { from: { height: 0 }, to: { height: 'var(--radix-accordion-content-height)' } },
        'accordion-up': { from: { height: 'var(--radix-accordion-content-height)' }, to: { height: 0 } },
        'slide-in-right': { from: { transform: 'translateX(100%)' }, to: { transform: 'translateX(0)' } },
        'slide-out-right': { from: { transform: 'translateX(0)' }, to: { transform: 'translateX(100%)' } },
        'fade-in': { from: { opacity: 0 }, to: { opacity: 1 } },
        'bounce-once': { '0%,100%': { transform: 'scale(1)' }, '50%': { transform: 'scale(1.3)' } },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'slide-in-right': 'slide-in-right 0.3s ease-out',
        'slide-out-right': 'slide-out-right 0.3s ease-in',
        'fade-in': 'fade-in 0.2s ease-out',
        'bounce-once': 'bounce-once 0.4s ease',
      },
      boxShadow: {
        card: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
        'card-hover': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};
