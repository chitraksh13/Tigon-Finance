/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        accent: {
          cyan: '#38bdf8',
          green: '#34d399',
          red: '#f87171',
          amber: '#fbbf24',
          purple: '#a78bfa',
        }
      },
      fontFamily: {
        syne: ['Syne', 'system-ui', 'sans-serif'],
        dm: ['DM Sans', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
