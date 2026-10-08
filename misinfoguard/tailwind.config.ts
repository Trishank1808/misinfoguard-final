import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        base: {
          950: "#F6F7FB",
          900: "#FFFFFF",
          850: "#FFFFFF",
          800: "#F0F2F8",
          700: "#E6E9F2",
          600: "#D7DBE8",
        },
        signal: {
          DEFAULT: "#0D9488",
          dim: "#0B7A70",
          glow: "#2DD4BF",
        },
        risk: {
          low: "#0D9488",
          mid: "#D97706",
          high: "#EA580C",
          critical: "#DC2626",
        },
        ink: {
          100: "#14161F",
          300: "#454A5E",
          500: "#6E7387",
          700: "#9BA0B4",
          900: "#0B0D14",
        },
        violet: {
          500: "#6D5CE0",
          600: "#5A46D1",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        "aurora-1":
          "radial-gradient(60% 60% at 20% 10%, rgba(109,92,224,0.14) 0%, rgba(109,92,224,0) 60%)",
        "aurora-2":
          "radial-gradient(50% 50% at 85% 20%, rgba(13,148,136,0.12) 0%, rgba(13,148,136,0) 60%)",
        "grid-fade":
          "linear-gradient(to bottom, rgba(11,13,20,0.045) 1px, transparent 1px), linear-gradient(to right, rgba(11,13,20,0.045) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
      boxShadow: {
        glass: "0 8px 28px rgba(20,25,45,0.08)",
        glow: "0 0 0 1px rgba(13,148,136,0.18), 0 0 32px rgba(13,148,136,0.12)",
      },
      animation: {
        shimmer: "shimmer 2s infinite linear",
        float: "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 3.5s ease-in-out infinite",
      },
      keyframes: {
        shimmer: {
          "0%": { backgroundPosition: "-700px 0" },
          "100%": { backgroundPosition: "700px 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-14px)" },
        },
      },
      borderRadius: {
        "2xl": "1.25rem",
        "3xl": "1.75rem",
      },
    },
  },
  plugins: [],
};
export default config;
