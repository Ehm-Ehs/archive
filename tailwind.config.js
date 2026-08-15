/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class", '[data-theme="dark"]'],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        chalkboard: {
          DEFAULT: "#1C372E",
          dark: "#122821",
          light: "#284C40",
        },
        paper: {
          DEFAULT: "#FAF5E8",
          dark: "#182823",
          lines: "#E8E1D0",
        },
        crayon: {
          red: "#EA4335",
          "red-hover": "#D93025",
          yellow: "#F2B705",
          green: "#10B981",
        },
        brand: {
          green: "#1C372E",
          "green-hover": "#122821",
          "green-light": "rgba(28, 55, 46, 0.15)",
          gold: "#F2B705",
          "gold-light": "rgba(242, 183, 5, 0.15)",
          terracotta: "#EA4335",
          "terracotta-light": "rgba(234, 67, 53, 0.15)",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "sans-serif"],
        heading: ["Outfit", "sans-serif"],
        handwriting: ["Caveat", "Patrick Hand", "cursive"],
      },
      borderRadius: {
        lg: "1.25rem",
        md: "0.875rem",
        sm: "0.5rem",
      },
      boxShadow: {
        notebook: "0 16px 40px rgba(0, 0, 0, 0.35)",
        coral: "0 8px 24px rgba(234, 67, 53, 0.35)",
      },
    },
  },
  plugins: [],
};
