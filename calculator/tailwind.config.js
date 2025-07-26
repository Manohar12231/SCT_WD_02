const { fontFamily } = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Poppins', ...fontFamily.sans],
        'digital': ['"DSEG7 Classic"', ...fontFamily.sans],
      },
      colors: {
        'light-bg': '#f3f4f6',
        'light-card': '#ffffff',
        'light-btn': '#f3f4f6',
        'light-btn-text': '#374151',
        'light-display-text': '#3b4252',
        'light-primary': '#4a90e2',
        'light-secondary': '#f39c12',
        'light-accent': '#e74c3c',

        'dark-bg': '#1a1b26',
        'dark-card': '#24283b',
        'dark-btn': '#1a1b26',
        'dark-text': '#a9b1d6',
        'dark-display-text': '#c0caf5',
        'dark-primary': '#7aa2f7',
        'dark-secondary': '#ff9e64',
        'dark-accent': '#f7768e',
      },
      boxShadow: {
        'light-neumorphic': '10px 10px 20px #d1d9e6, -10px -10px 20px #ffffff',
        'dark-neumorphic': '8px 8px 16px #13141b, -8px -8px 16px #21222b',
        'light-inset': 'inset 5px 5px 10px #d1d9e6, inset -5px -5px 10px #ffffff',
        'dark-inset': 'inset 4px 4px 8px #13141b, inset -4px -4px 8px #21222b',
      },
    },
  },
  plugins: [],
}