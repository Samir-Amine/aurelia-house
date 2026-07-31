/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx}",
    "./components/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0E2A2B",
        forest: "#163832",
        brass: "#B8935A",
        "brass-light": "#D8BD8C",
        stone: "#EDEAE1",
        linen: "#F7F5F1",
        charcoal: "#1B2420",
        sage: "#8FA898",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        body: ["Work Sans", "sans-serif"],
        mono: ["IBM Plex Mono", "monospace"],
      },
      backgroundImage: {
        "grain": "radial-gradient(circle, rgba(0,0,0,0.03) 1px, transparent 1px)",
      },
    },
  },
  plugins: [],
};
