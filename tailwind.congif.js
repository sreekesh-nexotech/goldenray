// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,ts,jsx,tsx}', // Ensure this matches your project structure
  ],
  theme: {
    extend: {
      fontFamily: {
        // Sets DM Sans as the default sans-serif font using the Next.js font variable
        sans: ['var(--font-dm-sans)', 'sans-serif'],
        // Define a custom font family for Switzer
        switzer: ['Switzer', 'sans-serif'],
      },
    },
  },
  plugins: [],
};