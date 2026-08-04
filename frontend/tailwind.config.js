/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        leetcode: {
          bg: '#1A1A1A',
          card: '#282828',
          subcard: '#333333',
          border: '#3E3E3E',
          text: '#EFF2F6',
          muted: '#9E9E9E',
          orange: '#FFA116',
          yellow: '#FFB800',
          green: {
            0: '#282828',   // 0 items
            1: '#0E4429',   // 1-4 items
            2: '#006D32',   // 5-9 items
            3: '#26A641',   // 10-14 items
            4: '#39D353',   // 15+ items (Goal hit!)
          },
          difficulty: {
            easy: '#00B8A3',
            medium: '#FFC01E',
            hard: '#FF375F',
          }
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['Fira Code', 'JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [],
}
