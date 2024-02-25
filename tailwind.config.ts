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
          "0%": {
            transform: "scale(1)",
            animationTimingFunction: "cubic-bezier(0.8,0,1,1)",
          },
          "50%": {
            transform: "scale(0.75)",
            animationTimingFunction: "cubic-bezier(0,0,0.2,1)",
          },
          "100%": {
            transform: "scale(1)",
            animationTimingFunction: "cubic-bezier(0.8,0,1,1)",
          },
        },
        pop: {
          "0%": {
            transform: "scale(1.5)",
            animationTimingFunction: "cubic-bezier(0.8,0,1,1)",
          },
          "50%": {
            transform: "scale(0.90)",
            animationTimingFunction: "cubic-bezier(0,0,0.2,1)",
          },
          "100%": {
            transform: "scale(1)",
            animationTimingFunction: "cubic-bezier(0.8,0,1,1)",
          },
        },
      },
      animation: {
        "pulse-once": "pulse 3s ease-in-out 1",
        "bounce-once": "bounce 1s ease-in-out 1",
        "push-pull": "pushPull 1s ease-in-out infinite",
        "push-pull-once": "pushPull 1s ease-in-out 1",
        "pop-once": "pop 1s ease-in-out 1",
      },
    },
  },
  plugins: [],
};
export default config;
