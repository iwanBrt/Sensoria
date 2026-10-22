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
        sensoria: {
          blue: '#1E3A8A',
          teal: '#0D9488',
          amber: '#F59E0B',
          navy: '#0F172A',
        },
        // Dedicated high contrast tokens (WCAG AAA compliant)
        hc: {
          bg: '#000000',
          text: '#FFFF00', // High contrast yellow
          accent: '#00FFFF', // Cyan for secondary
          border: '#FFFF00',
          card: '#121212',
          highlight: '#FFD700',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
    },
  },
  plugins: [],
};
