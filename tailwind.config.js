const icons = require("rocketicons/tailwind");
/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{ts,tsx,js,jsx}"],
  theme: {
    extend: {
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)"
      },
      colors: {
        appPrimary: "#5a3295",
        appSecondary: "#31259d",
        appAccent: "#e75a76",
        appEasy: "#27AE60",
        appMedium: "#E2B93B",
        appHard: "#EB5757",
        appFadedPrimary: "#D8B3F2",
        appFadedAccent: "#FFD5DE",
        appAIFrom: "#e75a76",
        appAITo: "#fb7cf2",
        gray1: "#333333",
        gray2: "#4F4F4F",
        gray3: "#828282",
        gray4: "#BDBDBD",
        gray5: "#E0E0E0",
        gray6: "#EBEBEB",
        gray7: "#DEDEDE",
        black1: "#01000f",
        gold: "#FFC13F",
        bronze: "#EB8657",
        appOutputBG: "#2a2a2a",
        appLightThemeText: "#FFFFFF",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))"
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))"
        },
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))"
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))"
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))"
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))"
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))"
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          1: "hsl(var(--chart-1))",
          2: "hsl(var(--chart-2))",
          3: "hsl(var(--chart-3))",
          4: "hsl(var(--chart-4))",
          5: "hsl(var(--chart-5))"
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))"
        }
      },
      backgroundImage: {
        "gradient-conic": "conic-gradient(var(--tw-gradient-stops))"
      },
      keyframes: {
        disco: {
          "0%": {
            transform: "translateY(-50%) rotate(0deg)"
          },
          "100%": {
            transform: "translateY(-50%) rotate(360deg)"
          }
        }
      },
      animation: {
        disco: "disco 1.5s linear infinite"
      },
      boxShadow: {
        gold: "0 4px 6px 0 rgba(255, 215, 0, 0.1), 0 2px 4px 0 rgba(255, 215, 0, 0.06)",
        bronze: "0 4px 6px 0 rgba(205, 127, 50, 0.1), 0 2px 4px 0 rgba(205, 127, 50, 0.06)",
        gray3: "0 4px 6px 0 rgba(128, 128, 128, 0.1), 0 2px 4px 0 rgba(128, 128, 128, 0.06)"
      }
    }
  },
  plugins: [require("tailwindcss-animate"), require("tailwind-scrollbar-hide"), icons],
  components: {
    icon: {
      default: "gray-500-base",
      variants: {
        filled: "",
        outlined: ""
      },
      sizes: {
        xs: "size-2",
        sm: "size-4",
        base: "size-5",
        lg: "size-6",
        xl: "size-7",
        "2xl": "size-8",
        "3xl": "size-9",
        "4xl": "size-10",
        "5xl": "size-11",
        "6xl": "size-12",
        "7xl": "size-14"
      }
    }
  }
};
