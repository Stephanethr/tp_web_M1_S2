/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#4B5563',
        secondary: '#1F2937',
        accent: '#3B82F6',
        danger: '#EF4444',
        success: '#10B981',
      },
    },
  },
  plugins: [],
}
