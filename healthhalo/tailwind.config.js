/** @type {import('tailwindcss').Config} */
module.exports = {
  // IMPORTANT: Make sure this path is correct for your project structure
  content: ['./app/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      // THIS IS THE CORRECTED SECTION
      // We are defining the colors directly with their full names.
      colors: {
        'primary-green': '#2E8B57',
        'secondary-teal': '#20B2AA',
        'accent-blue': '#4169E1',
        'status-success': '#32CD32',
        'status-warning': '#FF8C00',
        'status-error': '#DC143C',
        'status-info': '#1E90FF',
        'neutral-background': '#F8F9FA',
        'neutral-card': '#FFFFFF',
        'neutral-text-primary': '#2C3E50',
        'neutral-text-secondary': '#6C757D',
        'neutral-border': '#E9ECEF'
      },
      fontFamily: {
        sans: ['Inter', 'Segoe UI', 'Roboto', 'Ubuntu', 'sans-serif']
      },
      // You can keep your font sizes as they were
      // I'll add them here for completeness
      fontSize: {
        xs: '0.75rem', // 12px
        sm: '0.875rem', // 14px
        base: '1rem', // 16px
        lg: '1.125rem', // 18px
        xl: '1.25rem', // 20px
        '2xl': '1.5rem' // 24px
      },
      keyframes: {
        fadeInUp: {
          '0%': {
            opacity: '0',
            transform: 'translateY(20px)'
          },
          '100%': {
            opacity: '1',
            transform: 'translateY(0)'
          }
        }
      },
      animation: {
        // Now you can use 'animate-fadeInUp' class in your components
        fadeInUp: 'fadeInUp 0.5s ease-in-out forwards'
      }
    }
  },
  plugins: [require('tailwind-scrollbar')]
}
