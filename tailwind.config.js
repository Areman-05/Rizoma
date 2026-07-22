/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        rizoma: {
          brand: "#01B763",
          brandSoft: "#E8F8F0",
          red: "#EF4444",
          yellow: "#F1B826",
          black: "#2B2B2B",
          white: "#FFFFFF",
          gray: "#EEF2F6",
          grayText: "#9CA3AF",
          border: "#E5E7EB",
          canvas: "#FFFFFF",
          canvasSoft: "#EEF2F6",
          primary: "#01B763",
          secondaryText: "#6B7280",
          accent: "#01B763",
        },
      },
      fontFamily: {
        sans: ["Inter_400Regular"],
        "sans-medium": ["Inter_500Medium"],
        "sans-semibold": ["Inter_600SemiBold"],
        "sans-bold": ["Inter_700Bold"],
      },
      borderRadius: {
        "4xl": "24px",
      },
    },
  },
  plugins: [],
};
