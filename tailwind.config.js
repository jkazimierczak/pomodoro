const defaultTheme = require("tailwindcss/defaultTheme");

/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("@tailwindcss/forms")],
  theme: {
    extend: {
      height: {
        screen: ["100vh", "100svh"],
      },
      transitionProperty: ({ theme }) => ({
        "opacity-transform": `${defaultTheme.transitionProperty.opacity}, ${defaultTheme.transitionProperty.transform}`,
      }),
      transitionDuration: {
        250: "250ms",
      },
    },
  },
};
