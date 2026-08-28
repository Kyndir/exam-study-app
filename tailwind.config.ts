import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        teal: {
          DEFAULT: '#00c9a7',
          dim: 'rgba(0,201,167,0.12)',
        },
        'brand-dark': '#0b0b0e',
        'surface-1': '#131317',
        'surface-2': '#1a1a1f',
        'surface-3': '#222228',
        'surface-4': '#2a2a32',
      },
    },
  },
  plugins: [],
}

export default config
