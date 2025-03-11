/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        customRed: '#9b2226',
        customBlue: '#3a0ca3',
        customLila: '#5a189a',
        customGreen: '#006400',
        customOrange: '#ff7d00',
        customCoffe: '#78290f',
        customPurple: '#89023e',
        customTurkuaz: '#156064',
        customOrangeDark: '#ff5400',
        customGray: '#343a40',
        customDarkBlue: '#002855',
        customDefault: ""
      },
      backgroundImage: {
        'custom-gradient': "linear-gradient(90deg, rgba(1,6,27,1) 0%, rgba(67,17,39,1) 34%, rgba(147,30,54,1) 100%)",
      },
      spacing: {
        'custom-right': 'calc(50% - 110px)',
      },
    },
  },
  plugins: [],
}

