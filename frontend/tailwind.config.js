/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      /* Animations */
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        fadeIn: "fadeIn 0.8s ease-out forwards",
      },

      /* Colors */
      colors: {
        brand: {
          saffron: "#FF9933",
          maple: "#D32F2F",
          cream: "#FFF7E9",
          mint: "#C8F1DD",
          text:"#4B4B4B",
          green: "#138808",
        },
      },

      /* Fonts */
      fontFamily: {
        heading: ["Poppins", "sans-serif"],
        body: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
