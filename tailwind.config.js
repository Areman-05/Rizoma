/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        rizoma: {
          canvas: "#F4F6F4",
          canvasSoft: "#F7F9F6",
          primary: "#1E3B2B",
          secondaryText: "#60756A",
          accent: "#9AC79C",
        },
      },
      borderRadius: {
        "4xl": "32px",
      },
    },
  },
  plugins: [],
};
