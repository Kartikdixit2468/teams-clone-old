/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        teams: {
          purple: "#6264A7",
          darkpurple: "#464775",
          lightpurple: "#E2E2F6",
          gray: "#F3F2F1",
          darkgray: "#484644",
        },
      },
    },
  },
  plugins: [],
};
