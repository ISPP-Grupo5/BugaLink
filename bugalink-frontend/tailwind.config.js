/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./pages/**/*.tsx', './components/**/*.tsx'],
  theme: {
    colors: {
      transparent: 'transparent',
      black: '#000000',
      'light-gray': '#e0e0e0',
      gray: '#696969', // nice
      'dark-grey': '#464646',
      white: '#ffffff',
      baseOrigin: '#f1f1f1',
      red: '#d00000',
      'red-dark': '#da0000',
      'red-button': '#ff7e7e',
      'light-red': '#FF6363',
      turquoise: '#38a3a5',
      'dark-turquoise': '#287F81',
      'light-turquoise': '#7cc3c4',
      green: '#75a538',
      'light-green': '#A6DE5F',
      yellow: '#f9c200',
      'border-color': '#DADADA',
      'gray-select': '#C8C4C4',
      'gray-text-select': '#666666',
      'blue-select': '#1871C9',
    },
    extend: {
      fontFamily: {
        lato: ['Lato'],
      },
      boxShadow: {
        't-sm': '0 -1px 2px 0 rgba(0, 0, 0, 0.05)',
        't-md':
          '0 -4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        't-lg':
          '0 -10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
    },
  },
  plugins: [],
};
