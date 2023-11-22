/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        'true-white': '#FFFFFF',
        'cool-neutral': '#F9F9F9',
        'warm-neutral': 'F2F0EB',
        ceramic: '#EDEBE9',
        'true-black': '#000000',
        'house-green': '#1E3932',
        'accent-green': '#00754A',
        'starbucks-green': '#006241',
        'green-stroke': '#8E9C99',
        'rewards-gold': '#CBA258',
        'error-red': '#d62b1f',
        'light-gray': '#879298',
        'transparent-green': '#D2D7D6',
      },
      fontFamily: {
        pretendard: ['pretendard'],
      },
      fontSize: {
        s: '0.75rem',
        r: '0.875rem',
        m: '1rem',
        ml: '1.125rem',
        l: '1.5rem',
      },
    },
  },
  plugins: [],
};
