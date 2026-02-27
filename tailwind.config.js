/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        brand: '#16a34a',
        panel: '#f3f4f6',
      },
      boxShadow: {
        soft: '0 4px 14px rgba(15, 23, 42, 0.08)',
      },
    },
  },
  darkMode: 'class',
  plugins: [],
}
