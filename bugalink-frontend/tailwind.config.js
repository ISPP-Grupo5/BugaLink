/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.tsx', './components/**/*.tsx'],
  theme: {
    colors: {
      transparent: 'transparent',
      base: '#f1f1f1',
      black: '#000000',
      'light-gray': '#e0e0e0',
      gray: '#696969', // nice
      white: '#ffffff',
      red: '#d00000',
      'red-dark': '#da0000',
      'red-button': '#ff7e7e',
      turquoise: '#38a3a5',
      green: '#75a538',
      yellow: '#f9c200',
    },
    extend: {
      fontFamily: {
        lato: ['Lato'],
      },
    },
  },
  plugins: [],
};
