/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "Nunito": ['Nunito', 'sans-serif']
      }
    },
    colors: {
      "azulFuerte": "#005187",
      "navy": "#001F3F"
    }
  },
  plugins: [],
}