import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          primary: "#0F0F0F",
          accent: "#C9A96E",
          "accent-light": "#F5EDD8",
          surface: "#FAFAF9",
          muted: "#F4F4F3",
          border: "#E8E8E6",
          text: "#1A1A1A",
          "text-muted": "#6B6B6B",
        },
      },
      fontFamily: {
        heading: ["var(--font-cormorant)", "Georgia", "serif"],
        body: ["var(--font-inter)", "system-ui", "sans-serif"],
      },
      borderRadius: {
        "4xl": "2rem",
      },
      screens: {
        xs: "375px",
      },
    },
  },
  plugins: [],
};

export default config;
