/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Game theme colors
        carrot: {
          DEFAULT: '#ff6b35',
          light: '#ff8c61',
          dark: '#e85a28',
        },
        golden: {
          DEFAULT: '#ffd700',
          light: '#ffe033',
          dark: '#ccac00',
        },
        // Rarity colors
        rarity: {
          common: '#9ca3af',      // gray-400
          uncommon: '#10b981',    // green-500
          rare: '#3b82f6',        // blue-500
          epic: '#a855f7',        // purple-500
          legendary: '#f59e0b',   // amber-500
          mythical: '#ec4899',    // pink-500
        },
      },
      animation: {
        'bounce-slow': 'bounce 2s infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'spin-slow': 'spin 3s linear infinite',
      },
    },
  },
  plugins: [],
}
