import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        leaf: '#16a34a',
        mint: '#dcfce7',
        sun: '#facc15',
        sky: '#38bdf8',
        berry: '#f472b6',
        ink: '#1f2937'
      },
      boxShadow: {
        soft: '0 18px 50px rgba(31, 41, 55, 0.12)'
      }
    }
  },
  plugins: []
};

export default config;
