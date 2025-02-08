/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./app/**/*.{js,ts,jsx,tsx}" // If using App Router (Next.js 13+)
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};
