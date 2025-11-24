/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'brand-primary': '#2C2C2C', // Deep Charcoal/Soft Black
        'brand-secondary': '#FAFAFA', // Very light Off-White/Cream
        'brand-accent': '#A68A64', // Muted Bronze/Gold
        'brand-dark': '#1A1A1A',
        'brand-light': '#FFFFFF',
        'brand-border': '#E5E5E5',
      },
      fontFamily: {
        sans: ['"Noto Sans TC"', 'sans-serif'],
        serif: ['"Noto Serif TC"', 'serif'],
      },
    },
  },
  plugins: [],
}