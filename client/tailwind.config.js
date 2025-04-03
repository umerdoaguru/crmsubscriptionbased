/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      screens: {
        's':'200p',
        'xs': '480p',      // Extra small screens, like very small phones
        'sm': '640px',      // Small screens (phones)
        'md': '768px',      // Medium screens (tablets)
        'lg': '1024px',     // Large screens (laptops)
        'xl': '1280px',     // Extra large screens (desktops)
        '2xl': '1536px',    // 2x extra large screens
        '3xl': '1920px',    // Custom extra large screens (e.g., 4K displays)
      },
    },
  },
  plugins: [],
} 