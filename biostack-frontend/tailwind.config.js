/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#e6f7ff',
          100: '#bae7ff',
          500: '#1890ff',
          600: '#096dd9',
          700: '#0050b3',
        },
        teal: {
          50: '#e6fffb',
          100: '#b5f5ec',
          500: '#13c2c2',
          600: '#08979c',
          700: '#006d75',
        }
      }
    },
  },
  plugins: [],
}
