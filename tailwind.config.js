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
        primary: "#0ea5e9",
        "primary-content": "#f7fcff",
        "primary-dark": "#0b83b9",
        "primary-light": "#37b9f3",

        secondary: "#e9520e",
        "secondary-content": "#fffaf7",
        "secondary-dark": "#b9410b",
        "secondary-light": "#f37137",

        background: "#1a1a1a",
        surface: "#262626",
        border: "#404040",

        success: "#0ee90e",
        warning: "#e9e90e",
        error: "#e90e0e",

        "success-content": "#000000",
        "warning-content": "#000000",
        "error-content": "#fff7f7",

        text: {
          DEFAULT: "#fbfbfb",
          light: "#d9d9d9",
          lighter: "#a6a6a6",
        },
      },
    },
  },
  plugins: [],
};
