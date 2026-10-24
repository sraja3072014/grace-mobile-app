/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        warm: {
          900: '#1c130c',
          800: '#2a1b10',
          700: '#422817',
          500: '#f97316',
          400: '#fb923c',
          glow: 'rgba(251, 146, 60, 0.15)',
        }
      },
      backdropBlur: {
        xs: '2px',
      }
    },
  },
  plugins: [],
}