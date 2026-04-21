/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        sand: '#d8c3a5',
        ivory: '#f6f1e8',
        gold: '#b78a43',
        coal: '#111111',
        dusk: '#1b1b1b',
      },
      fontFamily: {
        display: ['"Cormorant Garamond"', 'serif'],
        sans: ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        glow: '0 0 30px rgba(183, 138, 67, 0.25)',
      },
      backgroundImage: {
        'hero-grid':
          'radial-gradient(circle at top, rgba(183, 138, 67, 0.24), transparent 28%), linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 45%)',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        },
      },
      animation: {
        shimmer: 'shimmer 2.4s linear infinite',
      },
    },
  },
  plugins: [],
}
