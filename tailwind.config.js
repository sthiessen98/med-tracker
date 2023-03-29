/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [  "./src/*.{js,jsx,ts,tsx}",
              "./src/Components/*.{js,jsx,ts,tsx}",
              "./src/Screens/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors:{
        primary: '#059669',
        background: '#f1f5f9'
      }
    },
  },
  plugins: [],
}
