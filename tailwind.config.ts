import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Modern Restaurant Menu Palette - Minimal & Elegant
        menu: {
          // Cream/Parchment backgrounds (like menu paper)
          cream: {
            50: '#FEFDFB',
            100: '#FBF9F4',
            200: '#F7F3EB',
            300: '#F0EAE0',
            400: '#E8DFD0',
            500: '#DDD1BC', // Main cream
            600: '#C9BAA3',
            700: '#B5A68A',
            800: '#9A8A71',
            900: '#7D6F59',
          },
          // Deep charcoal (primary text)
          charcoal: {
            50: '#F7F7F7',
            100: '#E3E3E3',
            200: '#C8C8C8',
            300: '#A4A4A4',
            400: '#717171',
            500: '#4A4A4A',
            600: '#3A3A3A',
            700: '#2D2D2D', // Main charcoal
            800: '#1F1F1F',
            900: '#141414',
          },
          // Elegant gold accent (one sophisticated color)
          gold: {
            50: '#FEFBF3',
            100: '#FDF6E3',
            200: '#FAEDC4',
            300: '#F6E19F',
            400: '#F0D166',
            500: '#D4AF37', // Main gold - sophisticated
            600: '#C19A2E',
            700: '#A38327',
            800: '#866B20',
            900: '#6B551A',
          },
        },
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
      },
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        display: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      // Minimal, clean borders
      borderRadius: {
        'none': '0',
        'sm': '0.125rem',
        DEFAULT: '0.25rem',
        'md': '0.375rem',
        'lg': '0.5rem',
        'xl': '0.75rem',
        '2xl': '1rem',
        '3xl': '1.5rem',
      },
      // Menu-style elegant shadows
      boxShadow: {
        'menu-sm': '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
        'menu': '0 2px 8px 0 rgba(0, 0, 0, 0.08)',
        'menu-lg': '0 4px 16px 0 rgba(0, 0, 0, 0.12)',
        'menu-xl': '0 8px 32px 0 rgba(0, 0, 0, 0.16)',
        'menu-border': '0 0 0 1px rgba(212, 175, 55, 0.2)',
      },
      // Menu divider borders
      borderWidth: {
        'menu': '1.5px',
      },
      animation: {
        'slide-in-left': 'slideInLeft 0.5s ease-out',
        'slide-in-right': 'slideInRight 0.5s ease-out',
        'fade-in-up': 'fadeInUp 0.6s ease-out',
        'angle-float': 'angleFloat 3s ease-in-out infinite',
      },
      keyframes: {
        slideInLeft: {
          '0%': { transform: 'translateX(-100px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        slideInRight: {
          '0%': { transform: 'translateX(100px)', opacity: '0' },
          '100%': { transform: 'translateX(0)', opacity: '1' },
        },
        fadeInUp: {
          '0%': { transform: 'translateY(30px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        angleFloat: {
          '0%, 100%': { transform: 'translateY(0) rotate(0deg)' },
          '50%': { transform: 'translateY(-10px) rotate(2deg)' },
        },
      },
    },
  },
  plugins: [],
};

export default config;

