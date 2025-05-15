import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pattern-green': '#D8E373',
      },
    },
  },
  plugins: [],
}
export default config