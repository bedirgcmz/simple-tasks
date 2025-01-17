/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        customRed: '#9b2226',
        customBlue: '#3a0ca3',
        customLila: '#5a189a',
        customGreen: '#008000',
        customOrange: '#ff7d00',
        customCoffe: '#78290f',
        customPurple: '#89023e',
      },
    },
  },
  plugins: [],
}

