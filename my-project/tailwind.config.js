/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto"],
      },
      colors(theme) {
        return {
          btnPrimaryActive: "#000",
          btnPrimaryHover: " #C6FF00",
          btnPrimaryRegular: "#BCEC30",
          btnPrimaryInactive: "#F7F7F7",
          btnSecondaryActive: "#E9ECED",
          btnSecondaryHover: " #F7F7F7",
          btnSecondaryRegular: "#fff",
          btnSecondaryInactive: "#fff",
          borderInputPrimary: "#D0CECE"
        };
      },
      animation: {
        err: "pulse 20ms 20",
      },
      screens: {
          'tablet': '375px',
          'laptop': '768px',
          'desktop': '1440px',
            },
    },
  },
  plugins: [],
};