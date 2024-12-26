/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        BeVietnamPro: ["Be Vietnam Pro", "serif"],
      },
      colors: {
        foreground: "#EEF0F2",
        background: "#ECEBE4",
        primary: "#1C1C1C",
        secondary: "#DADDD8",
        darker_secondary: "#b3b9af",
        sol_purple: "#512da8",
      },
    },
  },
  plugins: [],
};

// foreground: "#D2D5DD",
// background: "#B8BACF",
// primary: "#191716",
// secondary: "#999AC6",

// foreground: "#EEF0F2",
// background: "#ECEBE4",
// primary: "#1C1C1C",
// secondary: "#DADDD8",

// foreground: "#F7F7F2",
// background: "#E4E6C3",
// primary: "#222725",
// secondary: "#899878",
