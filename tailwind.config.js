import animDelay from 'tailwindcss-animation-delay'
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        main: {
          light: "#fff",
          dark: "#191919",
        },
        primary: {
          light: "#0094ff",
          dark: "#0094ff",
        }
      },
      fontFamily: {
        'montserrat': ['Montserrat', "none"],
        'rubik': ['Rubik', "none"],
        'fira': ['"Fira Code"', "none"],
        'onest': ['"Onest"', "none"],
      },
    },
  },
  plugins: [
    animDelay,
  ],
}