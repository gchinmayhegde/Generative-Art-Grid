/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: 'selector',
  theme: {
    extend: {
      animation: {
        'glow': 'glow 1.5s ease-in-out infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        glow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '1' },
        }
      },
      backdropBlur: {
        xs: '2px',
      },
      colors: {
        glass: {
          light: 'rgba(255, 255, 255, 0.1)',
          dark: 'rgba(255, 255, 255, 0.05)',
        }
      },
      fontFamily: {
        'export-safe': [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          'Oxygen-Sans',
          'Ubuntu',
          'Cantarell',
          '"Helvetica Neue"',
          'sans-serif'
        ],
      },
      aspectRatio: {
        'square': '1 / 1',
        'card': '3 / 4',
      },
      boxShadow: {
        'glow': '0 0 20px rgba(124, 58, 237, 0.3)',
        'glow-lg': '0 0 40px rgba(124, 58, 237, 0.4)',
        'export': '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
      },
      backgroundImage: {
        'gradient-glass': 'linear-gradient(180deg, rgba(255,255,255,0.03), rgba(255,255,255,0.01))',
        'gradient-btn': 'linear-gradient(90deg, #7c3aed, #06b6d4)',
        'gradient-dark': 'linear-gradient(180deg, #0f172a 0%, #0b1220 70%)',
        'gradient-light': 'linear-gradient(180deg, #f8fafc 0%, #eef2ff 70%)',
      }
    },
  },
  plugins: [],
}