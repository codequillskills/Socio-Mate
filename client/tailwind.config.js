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
          light: '#4F46E5', // Main brand color (Indigo)
          DEFAULT: '#4F46E5',
          dark: '#4338CA',
        },
        background: {
          light: '#F3F4F6', // Light gray background
          dark: '#111827', // Dark background
        },
        card: {
          light: '#FFFFFF', // White card background
          dark: '#1F2937', // Dark card background
        },
        text: {
          primary: {
            light: '#111827', // Dark text for light mode
            dark: '#F9FAFB', // Light text for dark mode
          },
          secondary: {
            light: '#4B5563', // Gray text for light mode
            dark: '#9CA3AF', // Gray text for dark mode
          }
        }
      },
      animation: {
        'fadeIn': 'fadeIn 0.3s ease-in-out',
        'slideIn': 'slideIn 0.3s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideIn: {
          '0%': { transform: 'translateX(-10px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
      },
    },
  },
  plugins: [],
}

