import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        elastic: {
          blue: "#0077CC",
          dark: "#1B1F36",
          darker: "#141628",
          card: "#1E2243",
          border: "#2A2F52",
          accent: "#00BFB3",
          green: "#00BFB3",
          yellow: "#FEC514",
          red: "#F04E98",
          orange: "#F5A623",
          purple: "#B298DC",
          text: "#E8E8F0",
          muted: "#8B8FA8",
        },
      },
      animation: {
        "pulse-slow": "pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "slide-up": "slideUp 0.5s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        "fade-in": "fadeIn 0.5s ease-out",
        "glow": "glow 2s ease-in-out infinite alternate",
      },
      keyframes: {
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        slideIn: {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        glow: {
          "0%": { boxShadow: "0 0 5px rgba(0, 191, 179, 0.2)" },
          "100%": { boxShadow: "0 0 20px rgba(0, 191, 179, 0.4)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
