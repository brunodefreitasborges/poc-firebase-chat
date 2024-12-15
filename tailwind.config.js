/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  important: true,
  theme: {
    extend: {
      backgroundColor: {
        'primary': '#0C1017',
        'secondary': '#b2b2b2',
        'background': '#05070A'
      }
    },
  },
  plugins: [],
}

