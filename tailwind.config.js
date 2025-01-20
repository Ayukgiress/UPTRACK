/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}', 
  ],
  theme: {
    extend: {
      keyframes: {
        fadeOutLeft: {
          '0%': { opacity: '1', transform: 'translateX(0)' },
          '100%': { opacity: '0', transform: 'translateX(-100%)' },
        },
      },
      animation: {
        fadeOutLeft: 'fadeOutLeft 1s forwards',
      },
      screens: {
        '3xl': '2560px',
        'screen': '1920px',
      },
      colors: {
        'custom-background': 'rgb(197,226,251)',  
      },
      backgroundImage: {
        'custom-gradient': 'radial-gradient(circle, rgba(199,220,238,1) 0%, rgba(243,248,249,1) 100%)', 
      },
      fontFamily: {
        sans: ["Roboto Slab", "serif"],
      },
    },
  },
  plugins: [],
}
