/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{ts,tsx,js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: "#10b981",       /
        primaryDark: "#059669",   /
      }
    },
  },
  plugins: [],
}
