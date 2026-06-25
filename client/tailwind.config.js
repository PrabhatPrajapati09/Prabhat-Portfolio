/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'background': "rgba(var(--bg-color))",
        "primary-text": "rgba(var(--primary-text))",
        'secondary-text': "rgba(var(--secondary-text))",
        'card': "rgba(var(--card))",
        'base-button': "rgba(var(--base-button))",
        'active-button': "rgba(var(--active-button))",
        'disabled-button': "rgba(var(--disabled-button))",
        'border': "rgb(var(--border) / <alpha-value>)",
      },
      boxShadow: {
        'glow': '0 0 20px rgb(var(--active-button) / 0.4), inset 0 0 15px rgb(var(--active-button) / 0.2)',
      },
      dropShadow: {
        'glow': '0 0 8px rgb(var(--active-button) / 0.8)',
      }
    },
  },
  plugins: [],
}