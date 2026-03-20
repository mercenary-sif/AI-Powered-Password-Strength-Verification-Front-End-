/** @type {import('tailwindcss').Config} */
export default {
  content: [
     "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "font-1": ["SN Pro", "sans-serif"],
        "font-2": ["Winky Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
}

