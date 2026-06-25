import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        background: "#0A0A0A",
        foreground: "#F5F5F5",
        gold: {
          DEFAULT: "#D4AF37",
          light: "#F0D060",
          dark: "#8B6B2E",
        },
        card: {
          DEFAULT: "#111111",
          foreground: "#F5F5F5",
        },
        popover: {
          DEFAULT: "#111111",
          foreground: "#F5F5F5",
        },
        primary: {
          DEFAULT: "#D4AF37",
          foreground: "#0A0A0A",
        },
        secondary: {
          DEFAULT: "#1A1A1A",
          foreground: "#F5F5F5",
        },
        muted: {
          DEFAULT: "#1A1A1A",
          foreground: "#888888",
        },
        accent: {
          DEFAULT: "#8B6B2E",
          foreground: "#F5F5F5",
        },
        destructive: {
          DEFAULT: "#8B0000",
          foreground: "#F5F5F5",
        },
        border: "#222222",
        input: "#222222",
        ring: "#D4AF37",
      },
      borderRadius: {
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
      fontFamily: {
        serif: ["Noto Serif SC", "Cormorant Garamond", "serif"],
        display: ["Cormorant Garamond", "serif"],
      },
      keyframes: {
        "gold-shimmer": {
          "0%": { backgroundPosition: "-200% center" },
          "100%": { backgroundPosition: "200% center" },
        },
        "fade-in-up": {
          "0%": { opacity: "0", transform: "translateY(30px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        glow: {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "gold-shimmer": "gold-shimmer 3s ease infinite",
        "fade-in-up": "fade-in-up 0.8s ease-out",
        "fade-in": "fade-in 1s ease-out",
        glow: "glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
