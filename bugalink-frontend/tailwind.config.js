/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',

    // Or if using `src` directory:
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    colors: {
      'bg-base': '#f1f1f1',
      black: '#000000',
      'light-grey': '#d7d7d7',
      gray: '#696969', // nice
      'dark-grey': '#464646',
      white: '#ffffff',
      red: '#d00000',
      'red-dark': '#da0000',
      'red-button': '#ff7e7e',
      turquoise: '#38a3a5',
      green: '#75a538',
      yellow: '#f9c200',
      'border-color': '#DADADA',
    },
    extend: {
      fontFamily: {
        lato: ['Lato'],
      },
    },
  },
  plugins: [],
};
