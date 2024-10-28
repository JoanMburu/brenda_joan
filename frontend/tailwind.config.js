// tailwind.config.js
module.exports = {
  darkMode: 'class', // Enable dark mode with a class on the root element (e.g., 'dark')
  content: [
    './src/**/*.{js,jsx,ts,tsx}', // Ensure all source files are scanned for Tailwind classes
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Roboto', 'sans-serif'], // Add 'Roboto' as the primary font
      },
      colors: {
        primary: '#1E40AF', // Custom primary color
        accent: '#FB891F',  // Custom accent color
        darkBackground: '#1F2937', // Background color for dark mode
        darkCard: '#374151',       // Card color for dark mode
        darkText: '#D1D5DB',       // Text color for dark mode
      },
      boxShadow: {
        'card': '0 4px 6px rgba(0, 0, 0, 0.1)', // Subtle shadow for cards
        'cardHover': '0 6px 8px rgba(0, 0, 0, 0.2)', // Hover shadow for cards
      },
      transitionProperty: {
        width: 'width', // Transition for width, helpful for sidebar animations
      },
      spacing: {
        6: '1.5rem', // Padding and margin adjustments
      },
    },
  },
  variants: {
    extend: {
      backgroundColor: ['dark', 'hover', 'focus'], // Dark mode support for background colors
      textColor: ['dark'], // Dark mode support for text colors
      boxShadow: ['hover'], // Box shadow on hover for a polished look
    },
  },
  plugins: [],
};
