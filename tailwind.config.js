/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ['"Baloo 2"', '"Comic Sans MS"', "system-ui", "sans-serif"],
        body: ['"Nunito"', "system-ui", "sans-serif"],
      },
      colors: {
        lab: {
          bg: "#0e1430",
          bg2: "#151c44",
          card: "#1c2456",
          ink: "#eaf0ff",
          mute: "#9fb0e6",
          line: "#2b357a",
        },
        candy: {
          pink: "#ff7eb3",
          grape: "#a78bfa",
          sky: "#5ec8ff",
          mint: "#5eead4",
          sun: "#ffd166",
          coral: "#ff9e6d",
          lime: "#b6f36b",
        },
      },
      gridTemplateColumns: {
        lab: "260px minmax(0, 1fr) 340px",
      },
      boxShadow: {
        glow: "0 0 40px -8px rgba(167,139,250,0.55)",
        bubble: "0 10px 30px -10px rgba(10,15,40,0.6)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        jiggle: {
          "0%,100%": { transform: "rotate(-2deg) scale(1)" },
          "50%": { transform: "rotate(2deg) scale(1.03)" },
        },
        pulseGlow: {
          "0%,100%": { opacity: "0.55", transform: "scale(1)" },
          "50%": { opacity: "1", transform: "scale(1.06)" },
        },
        drift: {
          "0%": { transform: "translate(0,0)" },
          "33%": { transform: "translate(6px,-6px)" },
          "66%": { transform: "translate(-5px,4px)" },
          "100%": { transform: "translate(0,0)" },
        },
      },
      animation: {
        float: "float 6s ease-in-out infinite",
        jiggle: "jiggle 2.4s ease-in-out infinite",
        pulseGlow: "pulseGlow 3.5s ease-in-out infinite",
        drift: "drift 12s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
