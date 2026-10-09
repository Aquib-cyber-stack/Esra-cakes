import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        cream: "#FBF1E6",
        blush: "#F3DAD1",
        "blush-soft": "#F8E7E0",
        berry: "#7A1F3D",
        "berry-dark": "#4A1226",
        gold: "#C89B3C",
        pistachio: "#8FA97D",
        ink: "#2E1C16",
        "ink-soft": "#6B5850",
        paper: "#FFFDF9",
      },
      fontFamily: {
        serif: ["Fraunces", "serif"],
        sans: ["DM Sans", "sans-serif"],
      },
      borderRadius: {
        card: "22px",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        flicker: {
          "0%, 100%": { transform: "translateX(-50%) scale(1) rotate(-2deg)" },
          "50%": { transform: "translateX(-50%) scale(1.08) rotate(3deg)" },
        },
      },
      animation: {
        float: "float 5s ease-in-out infinite",
        flicker: "flicker 1.6s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
