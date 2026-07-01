import type { Config } from "tailwindcss";

// NOTE: color KEYS are kept as teal/cream/terracotta so we don't have to touch
// every component class. Only the HEX VALUES are remapped to the barbershop
// palette: charcoal ink (teal), warm bone (cream), classic barber gold (terracotta).
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        // "teal" slot → deep charcoal / ink (dark backgrounds, headings, body text)
        teal: {
          50: "#EDEDEC",
          100: "#D6D6D4",
          400: "#6E6E6A",
          600: "#3A3A37",
          700: "#2A2A27",
          800: "#1B1B19",
          900: "#111110",
        },
        // "cream" slot → warm bone / off-white (light section backgrounds)
        cream: {
          50: "#FAF8F3",
          100: "#F2EEE5",
          200: "#E7E0D2",
          300: "#D8CDB8",
        },
        // "terracotta" slot → classic barber gold (accent)
        terracotta: {
          400: "#D9B34C",
          500: "#C69A2E",
          600: "#A67F1F",
        },
      },
      fontFamily: {
        // "serif" slot now points to Oswald (condensed, masculine display face)
        serif: ["var(--font-display)", "Oswald", "Impact", "sans-serif"],
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
      },
      animation: {
        "fade-in-up": "fadeInUp 0.6s ease-out forwards",
        "fade-in": "fadeIn 0.8s ease-out forwards",
      },
      keyframes: {
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
