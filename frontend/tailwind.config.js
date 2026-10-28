/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        jawa: {
          dark: '#050505',      // Almost pure black for max contrast with images
          wood: '#140c08',      // Very deep brown-black
          card: '#1f130d',      // Slightly lighter wooden card bg
          gold: '#d4af37',      // Antique Javanese gold
          goldlight: '#f5d77f', // Metallic gold highlight
          golddark: '#8c6b12',  // Deep brass gold
          cream: '#ebdcc8',     // Javanese parchment cream
          accent: '#7a1f1d',    // Deep classic Javanese red/maroon
        }
      },
      fontFamily: {
        cinzel: ['Cinzel', 'serif'],
        cormorant: ['"Cormorant Infant"', 'serif'],
        pinyon: ['"Pinyon Script"', 'cursive'],
        lora: ['Lora', 'serif'],
        script: ['"Great Vibes"', 'cursive'],
        sans: ['"Plus Jakarta Sans"', 'sans-serif'],
      },
      backgroundImage: {
        'batik-pattern': "url('https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=1000&auto=format&fit=crop')",
      },
      animation: {
        'spin-slow': 'spin 14s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        }
      }
    },
  },
  plugins: [],
}
