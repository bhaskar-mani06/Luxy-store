/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        gold: {
          50: '#FFF9E6',
          100: '#FEEFC3',
          200: '#FEE59F',
          300: '#FCDA7C',
          400: '#F8CE5B',
          500: '#D4AF37', // Main gold color
          600: '#B3931F',
          700: '#917816',
          800: '#70600E',
          900: '#4E4106',
        },
        luxury: {
          50: '#F5F5F5',
          100: '#E9E9E9',
          200: '#D9D9D9',
          300: '#C4C4C4',
          400: '#9D9D9D',
          500: '#111111', // Primary dark color
          600: '#0D0D0D',
          700: '#0A0A0A',
          800: '#070707',
          900: '#000000',
        }
      }
    },
  },
  plugins: [],
};