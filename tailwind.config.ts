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
          bg: "#09090B",
          card: "rgba(255,255,255,0.03)",
          border: "rgba(255,255,255,0.06)",
          hover: "rgba(255,255,255,0.08)",
        },
        accent: {
          cyan: "#0dccf2",
          violet: "#8b5cf6",
          orange: "#f97316",
          pink: "#ec4899",
          green: "#22c55e",
        },
      },
      fontFamily: {
        sans: ["Plus Jakarta Sans", "system-ui", "sans-serif"],
      },
      backdropBlur: {
        glass: "24px",
      },
      boxShadow: {
        glass: "0 8px 32px rgba(0, 0, 0, 0.3)",
        "glass-lg": "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
        "glow-cyan": "0 0 40px rgba(13, 204, 242, 0.15)",
        "glow-violet": "0 0 40px rgba(139, 92, 246, 0.15)",
        "glow-orange": "0 0 40px rgba(249, 115, 22, 0.15)",
      },
    },
  },
  plugins: [],
} satisfies Config;
