import type { Config } from "tailwindcss";

export default {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        glass: {
          bg: "#0A0A0C",
          card: "rgba(255,255,255,0.02)",
          border: "rgba(255,255,255,0.06)",
          hover: "rgba(255,255,255,0.08)",
        },
        accent: {
          indigo: "#6366f1",
          rose: "#f43f5e",
          cyan: "#06b6d4",
          violet: "#8b5cf6",
          orange: "#f97316",
          pink: "#ec4899",
          green: "#22c55e",
        },
      },
      fontFamily: {
        sans: ["var(--font-plus-jakarta)", "system-ui", "sans-serif"],
        syne: ["var(--font-syne)", "sans-serif"],
      },
      backdropBlur: {
        glass: "24px",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.3)",
        "glass-lg": "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        "glow-amber": "0 0 40px rgba(245, 158, 11, 0.15)",
        "glow-cyan": "0 0 40px rgba(6, 182, 212, 0.15)",
        "glow-violet": "0 0 40px rgba(139, 92, 246, 0.15)",
      },
    },
  },
  plugins: [],
} satisfies Config;
