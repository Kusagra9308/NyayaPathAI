/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        civic: {
          navy: '#0B192C',
          blue: '#1E3E62',
          orange: '#FF6500',
          light: '#F5F7FA',
          card: '#1E293B',
          border: '#334155'
        }
      }
    },
  },
  plugins: [],
}
