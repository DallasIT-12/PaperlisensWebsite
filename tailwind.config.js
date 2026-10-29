/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/admin/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/[locale]/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-plus-jakarta)', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif'],
      },
      colors: {
        dallas: {
          1: '#001D39',
          2: '#0A4174',
          3: '#49769F',
          4: '#4E8EA2',
          5: '#6EA2B3',
          6: '#7BBDE8',
          7: '#BDD8E9',
        }
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-100%)' },
        },
      },
    },
  },
  plugins: [],
}
