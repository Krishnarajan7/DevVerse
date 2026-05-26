/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tnBlack: '#0A0A0A',   // Deep Matte Black
        tnGreen: '#34A853',   // Electric Green
        tnGray: '#F5F5F7',    // Apple-style Light Gray
      },
    },
  },
  plugins: [],
}