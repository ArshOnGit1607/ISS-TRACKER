/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        space: {
          900: '#0B0E14',
          800: '#151A23',
          700: '#1F2937'
        }
      }
    },
  },
  plugins: [],
}
