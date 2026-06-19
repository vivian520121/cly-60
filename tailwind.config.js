/** @type {import('tailwindcss').Config} */

export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    container: {
      center: true,
    },
    extend: {
      colors: {
        ancient: {
          paper: '#f5e6c8',
          paperDark: '#e8d4a8',
          text: '#4a3728',
          textLight: '#6b5344',
          accent: '#8b6914',
          edge: '#d4b896',
        },
        notebook: {
          paper: '#faf8f5',
          paperDark: '#f0ebe3',
          line: '#a8c8e8',
          text: '#2c3e50',
          textLight: '#5d6d7e',
          accent: '#3498db',
        },
        newspaper: {
          paper: '#f0ede8',
          paperDark: '#e0ddd8',
          text: '#1a1a1a',
          textLight: '#4a4a4a',
          accent: '#c0392b',
          headline: '#2c2c2c',
        },
        letter: {
          paper: '#fdfbf7',
          paperDark: '#f5f0e8',
          line: '#d0d0d0',
          text: '#1e3a5f',
          textLight: '#5a6c7d',
          accent: '#2c5282',
        },
        parchment: {
          50: '#fdf8ef',
          100: '#f9efd9',
          200: '#f3e0b8',
          300: '#ebcf92',
          400: '#e0b86a',
          500: '#d4a04a',
          600: '#b8863d',
          700: '#966b33',
          800: '#75522d',
          900: '#5a3f26',
        },
        ink: {
          50: '#f6f4f0',
          100: '#e8e4dc',
          200: '#d0c8b8',
          300: '#b0a490',
          400: '#8a7d68',
          500: '#6b5d4a',
          600: '#564a3a',
          700: '#443a2e',
          800: '#352d24',
          900: '#2a231c',
        },
      },
      fontFamily: {
        serif: ['"Noto Serif SC"', '"Source Han Serif"', '"Songti SC"', 'SimSun', 'serif'],
        sans: ['"Noto Sans SC"', '"Source Han Sans"', '"PingFang SC"', 'sans-serif'],
        handwrite: ['"Ma Shan Zheng"', '"ZCOOL KuaiLe"', 'cursive'],
        kai: ['"KaiTi"', '"STKaiti"', 'cursive'],
      },
      boxShadow: {
        'book': '0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        'page': 'inset 0 0 30px rgba(0, 0, 0, 0.05), 2px 0 8px rgba(0, 0, 0, 0.1)',
        'page-left': 'inset 0 0 30px rgba(0, 0, 0, 0.05), -2px 0 8px rgba(0, 0, 0, 0.1)',
        'spine': 'inset 0 0 20px rgba(0, 0, 0, 0.2)',
      },
      animation: {
        'page-turn': 'pageTurn 0.6s ease-in-out',
        'fade-in': 'fadeIn 0.5s ease-out',
        'book-open': 'bookOpen 0.8s ease-out',
        'float': 'float 3s ease-in-out infinite',
      },
      keyframes: {
        pageTurn: {
          '0%': { transform: 'rotateY(0deg)' },
          '100%': { transform: 'rotateY(-180deg)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        bookOpen: {
          '0%': { transform: 'perspective(2000px) rotateY(-30deg)', opacity: '0' },
          '100%': { transform: 'perspective(2000px) rotateY(0deg)', opacity: '1' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
      backgroundImage: {
        'paper-texture': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};
