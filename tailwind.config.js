/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  plugins: [require("@tailwindcss/forms")],
  theme: {
    extend: {
      colors: {
        stats: {
          1: "#262626",
          2: "#0e2f3d",
          3: "#174e66",
          4: "#2784ad",
          5: "#3ac2ff",
        },
      },
      height: {
        screen: ["100vh", "100svh"],
      },
    },
  },
};
