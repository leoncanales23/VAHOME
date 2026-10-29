import type { Config } from 'tailwindcss';
export default {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        obsidian: '#0B0D10', charcoal: '#171B20', gold: '#D9B26A', ivory: '#F5F1E9', steel: '#8B929C',
      },
      fontFamily: {
        display: ['"Plus Jakarta Sans"', 'Inter', 'system-ui', 'sans-serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
        script: ['Caveat', 'cursive'],
      },
      letterSpacing: { brand: '0.18em' },
    },
  },
  plugins: [],
} satisfies Config;
