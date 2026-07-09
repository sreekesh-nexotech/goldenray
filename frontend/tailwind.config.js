// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}", // Ensure this matches your project structure
  ],
  theme: {
    extend: {
      fontFamily: {
        "dm-sans": ["var(--font-dm-sans)", "sans-serif"],
        switzer: ["var(--font-switzer)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
