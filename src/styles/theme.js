// Tema de colores y configuración para styled-components (opcional)
// Como estamos usando principalmente Tailwind CSS, este archivo es para futuras extensiones

export const theme = {
  colors: {
    primary: '#dc2626',
    secondary: '#b91c1c',
    dark: {
      0: '#000000',
      100: '#1a1a1a',
      200: '#2d2d2d',
      300: '#404040',
      400: '#525252',
      500: '#737373',
      600: '#a3a3a3',
      700: '#d4d4d4',
      800: '#e5e5e5',
      900: '#f5f5f5',
    },
    white: '#ffffff',
    gray: {
      300: '#d1d5db',
      400: '#9ca3af',
      500: '#6b7280',
    }
  },
  fonts: {
    primary: "'Inter', system-ui, sans-serif",
    sizes: {
      xs: '0.75rem',
      sm: '0.875rem',
      base: '1rem',
      lg: '1.125rem',
      xl: '1.25rem',
      '2xl': '1.5rem',
      '3xl': '1.875rem',
      '4xl': '2.25rem',
      '5xl': '3rem',
    }
  },
  spacing: {
    xs: '0.25rem',
    sm: '0.5rem',
    md: '1rem',
    lg: '1.5rem',
    xl: '2rem',
    '2xl': '3rem',
    '3xl': '4rem',
  },
  borderRadius: {
    sm: '0.25rem',
    md: '0.5rem',
    lg: '1rem',
    xl: '1.5rem',
    full: '9999px',
  },
  shadows: {
    red: '0 4px 20px rgba(220, 38, 38, 0.3)',
    'red-lg': '0 8px 40px rgba(220, 38, 38, 0.4)',
  },
  transitions: {
    default: 'all 0.3s ease',
    fast: 'all 0.15s ease',
    slow: 'all 0.5s ease',
  },
  breakpoints: {
    xs: '475px',
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  }
};

export default theme;