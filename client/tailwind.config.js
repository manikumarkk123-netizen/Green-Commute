/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#3b82f6",    // Blue-500
        secondary: "#1e293b",  // Slate-800
        accent: "#0ea5e9",     // Sky-500
        surface: "#0f172a",    // Slate-900
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
