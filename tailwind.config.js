/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          50: '#f0fdf4',
          100: '#dcfce7',
          200: '#bbf7d0',
          300: '#86efac',
          400: '#4ade80',
          500: '#22c55e',
          600: '#16a34a',
          700: '#15803d',
          800: '#166534',
          850: '#0e5a32',
          900: '#0b4a2b',
          950: '#062817',
        },
        harvest: {
          50: '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
        },
        parchment: {
          50: '#fbfbf9',
          100: '#f7f6f0',
          200: '#eeebe1',
          300: '#ded9c9',
        }
      },
      fontFamily: {
        sans: ['Plus Jakarta Sans', 'Inter', 'system-ui', 'sans-serif'],
        script: ['Caveat', 'cursive'],
      },
      boxShadow: {
        'card-soft': '0 2px 12px -2px rgba(22, 40, 26, 0.06), 0 1px 3px -1px rgba(22, 40, 26, 0.04)',
        'card-hover': '0 12px 32px -8px rgba(14, 90, 50, 0.12), 0 4px 12px -2px rgba(14, 90, 50, 0.06)',
        'header': '0 4px 20px -2px rgba(6, 40, 23, 0.15)',
        'drawer': '-8px 0 32px rgba(6, 40, 23, 0.15)',
      }
    },
  },
  plugins: [],
}

