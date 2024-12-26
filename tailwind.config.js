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
    colors: {
      main: {
        light: "#fff",
        dark: "#191919",
      }
    },
    extend: {
      fontFamily: {
        'montserrat': ['Montserrat', "none"],
        'rubik': ['Rubik', "none"],
        'fira': ['"Fira Code"', "none"],
        'onest': ['"Onest"', "none"],
      },
    },
  },
  plugins: [],
}