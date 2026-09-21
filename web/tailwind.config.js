/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#114d96',
        secondary: '#111928',
        light: '#637381',
      },
    },
  },
  plugins: [],
};
