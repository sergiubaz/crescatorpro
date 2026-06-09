/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        sage: {
          50: '#E6F4EE',
          100: '#C2E3D1',
          500: '#2F6B4A',
          600: '#25593D',
          700: '#1A3D2B',
        },
        gold: {
          50: '#FEF9E7',
          400: '#C9A227',
          500: '#A88520',
        },
      },
      fontFamily: {
        sans: ['var(--font-dm-sans)', 'sans-serif'],
        serif: ['var(--font-playfair)', 'serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
}
