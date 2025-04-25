/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "custom-dark-green": "#3b5555",
        "custom-other-green": "#415b5c",
        "custom-light-green": "#e2edec",
        "custom-yellow": "#d7a30f",
        "custom-bg-color": "#b1d9d8",
        "custom-bg-white": "#e9f2f4",
        "cutom-orange": "#e86345",
        //admin colors
        "main-yellow": "#FBC034",
        "hover-yellow": "#e2ad2f",

      }
    },
  },
  plugins: [],
}

