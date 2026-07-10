/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#0E1116",
        "ink-soft": "#161B22",
        "ink-line": "#242B36",
        paper: "#FAFAF8",
        "paper-soft": "#F1F0EA",
        "paper-line": "#E4E2D9",
        accent: "#F5B429",
        "accent-dim": "#B98A22",
        mint: "#33D6A6",
        coral: "#F26D6D",
        slate: {
          50: "#F6F7F8",
          200: "#D6DAE0",
          400: "#8A93A3",
          600: "#4B5563",
          800: "#1F2530",
        },
      },
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      keyframes: {
        blink: { "0%,100%": { opacity: 1 }, "50%": { opacity: 0 } },
        rise: { from: { opacity: 0, transform: "translateY(8px)" }, to: { opacity: 1, transform: "translateY(0)" } },
      },
      animation: {
        blink: "blink 1s step-end infinite",
        rise: "rise 0.4s ease-out both",
      },
    },
  },
  plugins: [],
};
