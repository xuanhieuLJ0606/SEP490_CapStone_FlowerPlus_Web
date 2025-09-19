/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: { extend: {} },
  plugins: [require('daisyui')],
  daisyui: {
    themes: [
      {
        flowerplus: {
          "primary": "#16a34a",
          "secondary": "#22c55e",
          "accent": "#65a30d",
          "neutral": "#111827",
          "base-100": "#ffffff",
        },
      },
      "light",
    ],
  },
};
