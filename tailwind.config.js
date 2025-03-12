/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [
    function ({ addUtilities }) {
      addUtilities({
        ".scrollbar-hide": {
          "scrollbar-width": "none", // Firefox
          "-ms-overflow-style": "none", // Internet Explorer
        },
        ".scrollbar-hide::-webkit-scrollbar": {
          display: "none", // Chrome & Safari
        },
      });
    },
  ],
}