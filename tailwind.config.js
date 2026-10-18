/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50: '#F0F4F8',
          100: '#D9E2EC',
          200: '#BCCCDC',
          300: '#9FB3C8',
          400: '#829AB1',
          500: '#627D98',
          600: '#486581',
          700: '#334E68',
          800: '#102A43',
          900: '#0B192C',
          950: '#060E18',
        },
        gold: {
          50: '#FCF9F2',
          100: '#F7F0DF',
          200: '#EDDCB5',
          300: '#DEC488',
          400: '#CEAA5B',
          500: '#B89035',
          600: '#9E7427',
          700: '#7F571F',
          800: '#63421C',
          900: '#4A3117',
        },
        sand: {
          50: '#FAF8F5',
          100: '#F5EFE6',
          200: '#ECE3D4',
          300: '#DFD2BE',
          400: '#CCBBA2',
          500: '#B5A083',
        }
      },
      fontFamily: {
        sans: ['Cairo', 'Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        'card': '0 4px 20px -2px rgba(11, 25, 44, 0.06), 0 2px 6px -1px rgba(11, 25, 44, 0.04)',
        'card-hover': '0 20px 30px -4px rgba(11, 25, 44, 0.12), 0 8px 10px -2px rgba(11, 25, 44, 0.06)',
      }
    },
  },
  plugins: [],
}
