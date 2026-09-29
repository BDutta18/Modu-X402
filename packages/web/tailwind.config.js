/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Instrument Sans"', 'Inter', 'system-ui', '-apple-system', 'sans-serif'],
        display: ['"Instrument Serif"', 'Georgia', 'serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
        poppins: ['Poppins', 'sans-serif'],
      },
      colors: {
        background: '#ffffff',
        foreground: '#09090b',
        card: '#ffffff',
        'card-foreground': '#09090b',
        muted: '#f4f4f5',
        'muted-foreground': '#71717a',
        border: '#e4e4e7',
        'border-subtle': '#f4f4f5',
        primary: {
          DEFAULT: '#09090b',
          foreground: '#ffffff',
        },
        secondary: {
          DEFAULT: '#f4f4f5',
          foreground: '#09090b',
        },
        accent: {
          DEFAULT: '#14b8a6',
          foreground: '#ffffff',
        },
      },
      boxShadow: {
        glass: '0 8px 32px 0 rgba(0, 0, 0, 0.05)',
        macbook: '0 25px 60px -15px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(0, 0, 0, 0.08)',
      },
      animation: {
        'char-in': 'char-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) forwards',
        'line-reveal': 'line-reveal 0.8s cubic-bezier(0.77, 0, 0.175, 1) forwards',
        marquee: 'marquee 35s linear infinite',
        'marquee-reverse': 'marquee-reverse 30s linear infinite',
        'terminal-blink': 'blink 1s step-end infinite',
      },
      keyframes: {
        'char-in': {
          '0%': { opacity: '0', filter: 'blur(30px)', transform: 'translateY(100%)' },
          '100%': { opacity: '1', filter: 'blur(0)', transform: 'translateY(0)' },
        },
        'line-reveal': {
          to: { clipPath: 'inset(0 0 0 0)' },
        },
        marquee: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        'marquee-reverse': {
          '0%': { transform: 'translateX(-50%)' },
          '100%': { transform: 'translateX(0)' },
        },
        blink: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0' },
        },
      },
    },
  },
  plugins: [],
};
