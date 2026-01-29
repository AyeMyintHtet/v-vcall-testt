const colors = require("tailwindcss/colors");

module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "node_modules/@windmill/react-ui/lib/defaultTheme.js",
    "node_modules/@windmill/react-ui/dist/index.js",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        sans: ["Outfit", "Inter", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        brand: {
          300: "#818cf8",
          400: "#6366f1",
          500: "#5568FE", // Primary
          600: "#4f46e5",
          700: "#4338ca",
          glow: "rgba(85, 104, 254, 0.5)",
        },
        dark: {
          900: "#050A0E", // Deepest background
          800: "#0a0f14",
          700: "#12171d",
          600: "#1A1C22", // Card background
          500: "#252A34",
          glass: "rgba(22, 25, 30, 0.6)",
        },
        gray: {
          100: "#FFFFFF",
          150: "#3f4046",
          200: "#EFEFEF",
          300: "#DADADA",
          400: "#818181",
          500: "#6F767E",
          600: "#404B53",
          650: "#202427",
          700: "#232830",
          750: "#1A1C22",
          800: "#050A0E",
          850: "#26282C",
          900: "#95959E",
        },
        orange: {
          250: "#FF5810",
          350: "#FF5D5D",
        },
        yellow: {
          150: "#FF900C",
        },
        purple: {
          350: "#5568FE",
          550: "#596BFF",
          600: "#586FEA",
          650: "#2B3480",
          700: "#4F63D2",
          750: "#6246FB",
          300: "#4658BB",
        },
        red: { 150: "#D32F2F", 650: "#F44339" },
        pink: {
          150: "#EC4899",
          250: "#FFB5B5",
          750: "#2c1a22",
        },
        green: {
          150: "#3BA55D",
          250: "#40A954",
          350: "#34A85333",
          450: "#34A85380",
          550: "#87E5A2",
          650: "#96F3D24D",
          750: "#A3FEE3",
        },
        blue: {
          350: "#76d9e6",
        },
        customGray: {
          100: "#252A34",
          150: "#31353B",
          200: "#1E1E1E",
          300: "#454545",
          350: "#2B303499",
          400: "#282828",
          500: "#848484",
          600: "#C4C4C4",
          700: "#272727",
          800: "#343434",
          850: "#9E9DA6",
          900: "#373C43",
        },
        // Mapped colors for compatibility
        "cool-gray": colors.gray,
      },
      animation: {
        "blob": "blob 7s infinite",
        "fade-in": "fadeIn 0.5s ease-out forwards",
        "slide-up": "slideUp 0.5s ease-out forwards",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        blob: {
          "0%": { transform: "translate(0px, 0px) scale(1)" },
          "33%": { transform: "translate(30px, -50px) scale(1.1)" },
          "66%": { transform: "translate(-20px, 20px) scale(0.9)" },
          "100%": { transform: "translate(0px, 0px) scale(1)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
  ],
};
