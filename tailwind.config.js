import animDelay from 'tailwindcss-animation-delay'
import transforms from '@xpd/tailwind-3dtransforms'
import strokes from '@designbycode/tailwindcss-text-stroke'

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
            animation: {
                'border': 'border 4s linear infinite',
            },
            keyframes: {
                'border': {
                    to: { '--border-angle': '360deg' },
                }
            },
            colors: {
                main: {
                    light: "#fff",
                    dark: "#191919",
                },
                primary: {
                    light: "#0094ff",
                    dark: "#0094ff",
                },
                secondary: {
                    light: "#0087e7",
                    dark: "#007fd7",
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
        transforms,
        strokes
    ],
}