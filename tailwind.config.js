/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Primary brand colors - Yellow/Black scheme
        primary: {
          DEFAULT: '#FFD700',    // Gold yellow
          light: '#FFE44D',      // Light yellow
          dark: '#FFC107',       // Darker yellow
        },
        accent: {
          DEFAULT: '#000000',    // Black
          soft: '#1a1a1a',       // Soft black
        },
        // Background colors - Cream/Beige
        cream: {
          DEFAULT: '#FFF4E6',    // Light cream
          light: '#FFFAF0',      // Ivory
        },
        // Game currency colors (maintain compatibility)
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
          common: '#9ca3af',
          uncommon: '#10b981',
          rare: '#3b82f6',
          epic: '#a855f7',
          legendary: '#f59e0b',
          mythical: '#ec4899',
        },
      },
      borderRadius: {
        'xl': '1.5rem',      // 24px
        '2xl': '2rem',       // 32px
        '3xl': '2.5rem',     // 40px
      },
      boxShadow: {
        'bold': '0 6px 16px rgba(0, 0, 0, 0.15)',
        'bold-lg': '0 12px 24px rgba(0, 0, 0, 0.18)',
        'bold-xl': '0 20px 40px rgba(0, 0, 0, 0.22)',
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
