/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  prefix: 'wn-',
  theme: {
    extend: {
      colors: {
        border: "var(--background-modifier-border)",
        input: "var(--background-modifier-border)",
        ring: "hsl(var(--wn-ring))",
        background: "var(--background-primary)",
        foreground: "var(--text-normal)",
        primary: {
          DEFAULT: "var(--interactive-accent)",
          foreground: "var(--text-on-accent)",
        },
        secondary: {
          DEFAULT: "var(--background-secondary)",
          foreground: "var(--text-normal)",
        },
        destructive: {
          DEFAULT: "var(--text-error)",
          foreground: "var(--text-on-accent)",
        },
        muted: {
          DEFAULT: "var(--text-muted)",
          foreground: "var(--text-normal)",
        },
        accent: {
          DEFAULT: "var(--interactive-accent)",
          foreground: "var(--text-on-accent)",
        },
        popover: {
          DEFAULT: "var(--background-primary)",
          foreground: "var(--text-normal)",
        },
        card: {
          DEFAULT: "var(--background-primary)",
          foreground: "var(--text-normal)",
        },
      },
      borderRadius: {
        lg: "var(--wn-radius)",
        md: "calc(var(--wn-radius) - 2px)",
        sm: "calc(var(--wn-radius) - 4px)",
      },
    },
  },
  plugins: [],
}; 