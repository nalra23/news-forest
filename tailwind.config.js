/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      // 색상 토큰은 CSS 변수 (rgb 트리플) 로 정의 — runtime 테마 전환 위해
      // 변수는 src/index.css 에 :root + .theme-dark 로 선언
      colors: {
        primary: {
          50: 'rgb(var(--color-primary-50) / <alpha-value>)',
          100: 'rgb(var(--color-primary-100) / <alpha-value>)',
          200: 'rgb(var(--color-primary-200) / <alpha-value>)',
          300: 'rgb(var(--color-primary-300) / <alpha-value>)',
          500: 'rgb(var(--color-primary-500) / <alpha-value>)',
          700: 'rgb(var(--color-primary-700) / <alpha-value>)',
          DEFAULT: 'rgb(var(--color-primary-500) / <alpha-value>)',
        },
        secondary: {
          DEFAULT: 'rgb(var(--color-secondary) / <alpha-value>)',
        },
        accent: {
          100: 'rgb(var(--color-accent-100) / <alpha-value>)',
          500: 'rgb(var(--color-accent-500) / <alpha-value>)',
          DEFAULT: 'rgb(var(--color-accent-500) / <alpha-value>)',
        },
        background: 'rgb(var(--color-background) / <alpha-value>)',
        surface: 'rgb(var(--color-surface) / <alpha-value>)',
        muted: 'rgb(var(--color-muted) / <alpha-value>)',
        foreground: 'rgb(var(--color-foreground) / <alpha-value>)',
        'fg-muted': 'rgb(var(--color-fg-muted) / <alpha-value>)',
        'fg-faint': 'rgb(var(--color-fg-faint) / <alpha-value>)',
        success: 'rgb(var(--color-success) / <alpha-value>)',
        warn: 'rgb(var(--color-warn) / <alpha-value>)',
        error: 'rgb(var(--color-error) / <alpha-value>)',
      },
      borderColor: {
        DEFAULT: 'rgb(var(--color-border) / <alpha-value>)',
        strong: 'rgb(var(--color-border-strong) / <alpha-value>)',
      },
      fontFamily: {
        sans: ['Pretendard', 'system-ui', '-apple-system', 'sans-serif'],
        serif: ['"Noto Serif KR"', 'serif'],
      },
      screens: {
        mobile: '320px',
        tablet: '768px',
        desktop: '1024px',
        wide: '1440px',
      },
      keyframes: {
        leaf: {
          '0%': { opacity: '0', transform: 'scale(0.85) translateY(8px)' },
          '60%': { opacity: '1', transform: 'scale(1.05) translateY(-2px)' },
          '100%': { opacity: '1', transform: 'scale(1.0) translateY(0)' },
        },
        countup: {
          '0%': { transform: 'translateY(6px)', opacity: '0.4' },
          '100%': { transform: 'translateY(0)', opacity: '1.0' },
        },
        shimmer: {
          '0%, 100%': { opacity: '0.6' },
          '50%': { opacity: '1.0' },
        },
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'stage-transition': {
          '0%': { opacity: '0', transform: 'scale(0.92)' },
          '60%': { opacity: '1', transform: 'scale(1.04)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        fadeUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        leaf: 'leaf 350ms ease-out',
        countup: 'countup 350ms ease-out',
        shimmer: 'shimmer 1.5s ease-in-out infinite',
        'fade-in': 'fade-in 200ms ease-out',
        'stage-transition': 'stage-transition 350ms ease-out',
        'stage-transition-lg': 'stage-transition 500ms ease-out',
      },
      boxShadow: {
        soft: '0 1px 3px rgba(0,0,0,.06), 0 6px 18px rgba(0,0,0,.08)',
        lift: '0 6px 14px rgba(0,0,0,.08), 0 22px 48px rgba(0,0,0,.14)',
      },
    },
  },
  plugins: [],
}
