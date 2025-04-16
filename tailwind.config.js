/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./components/**/*.{vue,js,ts}",
    "./layouts/**/*.{vue,js,ts}",
    "./pages/**/*.{vue,js,ts}",
    "./app.vue",
    
  ],
  theme: {
    extend: {
      colors: {
        primary: "#8F0EFC", // Purple color
        secondary: "#121212", // Black color
        hover: "#B55DFF", // Dark gray color
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"], // Add Inter font
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
