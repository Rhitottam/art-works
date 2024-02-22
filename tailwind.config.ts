import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      fontFamily: {
        mont: ["Montserrat", "sans-serif"],
      },
      keyframes: {
        pushPull: {
          "0%, 100%": { transform: "translateY(0rem)" },
          "50%": { transform: "traslateY(20px))" },
        },
      },
      animation: {
        "pulse-once": "pulse 3s ease-in-out 1",
        "bounce-once": "bounce 1s ease-in-out 1",
        "push-pull": "pushPull 1s ease-in-out 1",
      },
    },
  },
  plugins: [],
};
export default config;
