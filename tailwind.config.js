/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#141414",
                secondary: "#1f1f1f",
                accent: "#3b82f6", // Blue
                textMain: "#ffffff",
                textMuted: "#a3a3a3",
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
            },
        },
    },
    plugins: [],
}
