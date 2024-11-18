/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          light: '#4F46E5', // Indigo
          dark: '#6366F1',
        },
        secondary: {
          light: '#EC4899', // Pink
          dark: '#F472B6',
        },
        accent: {
          light: '#10B981', // Emerald
          dark: '#34D399',
        },
        background: {
          light: '#FFFFFF',
          dark: '#1F2937',
        },
        text: {
          light: '#1F2937',
          dark: '#F9FAFB',
        }
      },
    },
  },
  plugins: [],
}

