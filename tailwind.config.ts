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
        // Direction B — "The Wall": letterpress editorial palette
        // Every scale is named at its source (see design-lab/NOTES.md §3).
        menu: {
          // Paper — offset litho paper stock (ground #F2ECDF at the 200 step)
          paper: {
            50: '#FDFBF6',
            100: '#F8F4EA',
            200: '#F2ECDF', // main ground — letterpress paper
            300: '#E9E1D0',
            400: '#DDD2BC',
            500: '#C9BBA0',
            600: '#B3A488',
            700: '#97886C',
            800: '#7B6E54',
            900: '#5F5540',
          },
          // Ink — letterpress black (text ink #17140F at the 700 step)
          ink: {
            50: '#F6F4F0',
            100: '#E6E2DA',
            200: '#C9C3B8', // hairline borders on paper
            300: '#A29B90',
            400: '#7A736A',
            500: '#565049', // secondary text — 7:1 on paper
            600: '#3D372F',
            700: '#17140F', // body ink
            800: '#12100C',
            900: '#0B0906', // display ink — deep bite
          },
          // Stamp — red rubber stamp ink (accent #C4311F at the 500 step,
          // lifted #E86B55 at 400 for small accents on ink grounds)
          stamp: {
            50: '#FDF3F1',
            100: '#FAE3DF',
            200: '#F4C7C0',
            300: '#EBA69C',
            400: '#E86B55',
            500: '#C4311F', // main accent
            600: '#A82818', // hover / small text on paper — 6:1
            700: '#8C2114',
            800: '#6E1A10',
            900: '#52130C',
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
        sans: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        // Kept as a true serif for the six menu templates — the restaurant's
        // product output keeps its own voice; MenuCraft's chrome does not.
        serif: ['Georgia', 'Cambria', 'Times New Roman', 'Times', 'serif'],
        display: ['"Bricolage Grotesque"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      // Flat, square geometry — rules over shadows
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
      // Shadows are reserved for floating elements only (headers, modals);
      // content cards use hairline borders instead.
      boxShadow: {
        'menu-sm': '0 1px 2px 0 rgba(11, 9, 6, 0.06)',
        'menu': '0 2px 8px 0 rgba(11, 9, 6, 0.08)',
        'menu-lg': '0 4px 16px 0 rgba(11, 9, 6, 0.12)',
        'menu-xl': '0 8px 32px 0 rgba(11, 9, 6, 0.16)',
        'menu-border': '0 0 0 1px rgba(196, 49, 31, 0.25)',
      },
      // Hairline rules
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
