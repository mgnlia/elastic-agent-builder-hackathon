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
          teal: "#00BFB3",
          blue: "#0077CC",
          pink: "#F04E98",
          yellow: "#FEC514",
          green: "#00BFB3",
          orange: "#FF6C2F",
        },
        surface: {
          0: "#0a0e17",
          1: "#0f1520",
          2: "#151d2c",
          3: "#1b2538",
          4: "#222e44",
        },
        accent: {
          triage: "#F04E98",
          diagnosis: "#0077CC",
          remediation: "#00BFB3",
          communication: "#FEC514",
        },
      },
      fontFamily: {
        mono: ["JetBrains Mono", "Fira Code", "monospace"],
      },
      animation: {
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
        "slide-in": "slide-in 0.5s ease-out",
        "fade-up": "fade-up 0.6s ease-out",
        "scan-line": "scan-line 3s linear infinite",
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        "slide-in": {
          "0%": { transform: "translateX(-20px)", opacity: "0" },
          "100%": { transform: "translateX(0)", opacity: "1" },
        },
        "fade-up": {
          "0%": { transform: "translateY(10px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
        "scan-line": {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(100%)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;
