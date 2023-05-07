const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  content: ["./app/**/*.{ts,tsx,jsx,js}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Proxima Nova", ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        myLight: {
          colors: {
            primary: {
              50: "#f4f8fd",
              100: "#e8f1fb",
              200: "#c6ddf4",
              300: "#a3c8ed",
              400: "#5e9fe0",
              500: "#1976d2",
              600: "#176abd",
              700: "#13599e",
              800: "#0f477e",
              900: "#0c3a67",
            },
            secondary: {
              50: "#f4fbfa",
              100: "#e9f6f5",
              200: "#c9e9e6",
              300: "#a8dbd7",
              400: "#67c1b8",
              500: "#26a69a",
              600: "#22958b",
              700: "#1d7d74",
              800: "#17645c",
              900: "#13514b",
            },
          },
          primary: "#a3c8ed", //300,
          "primary-focus": "#5e9fe0", //400
          "primary-content": "#0c3a67", //900
          secondary: "#a8dbd7", //300
          "secondary-focus": "#67c1b8", //400
          "secondary-content": "#13514b", //900
          accent: colors.fuchsia[300],
          "accent-focus": colors.fuchsia[400],
          "accent-content": colors.fuchsia[900],
          neutral: colors.neutral[900],
          "neutral-focus": colors.neutral[700],
          "neutral-content": colors.neutral[50],
          "base-100": "#FCF9F5",
          "base-200": colors.slate[100],
          "base-300": colors.slate[200],
          "base-content": colors.slate[900],
          info: colors.sky[300],
          "info-content": colors.sky[900],
          success: colors.emerald[400],
          "success-content": colors.emerald[900],
          warning: colors.yellow[400],
          "warning-content": colors.yellow[900],
          error: colors.rose[300],
          "error-content": colors.rose[900],
        },
        myDark: {
          colors: {
            primary: {
              50: "#f4f8fd",
              100: "#e8f1fb",
              200: "#c6ddf4",
              300: "#a3c8ed",
              400: "#5e9fe0",
              500: "#1976d2",
              600: "#176abd",
              700: "#13599e",
              800: "#0f477e",
              900: "#0c3a67",
            },
            secondary: {
              50: "#f4fbfa",
              100: "#e9f6f5",
              200: "#c9e9e6",
              300: "#a8dbd7",
              400: "#67c1b8",
              500: "#26a69a",
              600: "#22958b",
              700: "#1d7d74",
              800: "#17645c",
              900: "#13514b",
            },
          },
          primary: "#13599e", //700,
          "primary-focus": "#1976d2", //500
          "primary-content": "#f4f8fd", //50
          secondary: "#1d7d74", //700
          "secondary-focus": "#26a69a", //500
          "secondary-content": "#f4fbfa", //50
          accent: colors.fuchsia[700],
          "accent-focus": colors.fuchsia[500],
          "accent-content": colors.fuchsia[50],
          neutral: colors.neutral[100],
          "neutral-focus": colors.neutral[200],
          "neutral-content": colors.neutral[900],
          "base-100": colors.slate[900],
          "base-200": colors.slate[800],
          "base-300": colors.slate[700],
          "base-content": colors.slate[50],
          info: colors.sky[300],
          "info-content": colors.sky[900],
          success: colors.emerald[400],
          "success-content": colors.emerald[900],
          warning: colors.yellow[400],
          "warning-content": colors.yellow[900],
          error: colors.rose[300],
          "error-content": colors.rose[900],
        },
      },
    ],
  },
};
