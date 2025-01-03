/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./components/**/*.{js,vue,ts}",
    "./layouts/**/*.vue",
    "./pages/**/*.vue",
    "./plugins/**/*.{js,ts}",
    "./app.vue",
    "./error.vue",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#F0FAFF",
          100: "#E0F5FE",
          200: "#BAE8FD",
          300: "#7DD5FC",
          400: "#38BCF8",
          500: "#0EA5E9",
          600: "#028AC7",
          700: "#0370A1",
          800: "#075E85",
          900: "#0C506E",
          950: "#083549",
        },
        background: "#0A0A0A",
        surface: "#1D1D1D",
        main: "#F6F6F6",
        sub: "#9F9F9F",
        footer: "#A1A1AA",
      },
    },
  },
  plugins: [],
};
