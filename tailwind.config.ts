import type { Config } from "tailwindcss";
import { arkanaStyle, mapFontSizes, mapSpacing, mapRadii, mapDurations } from "./arkanaStyle.config";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: [`var(--font-${arkanaStyle.typography.fontFamilies.secondarySans.toLowerCase().replace(/[^a-z0-9]/g, '-')})`, 'Inter', 'sans-serif'],
        serif: [`var(--font-${arkanaStyle.typography.fontFamilies.primarySerif.toLowerCase().replace(/[^a-z0-9]/g, '-')})`, 'serif'],
        mono: ['JetBrains Mono', 'monospace'], // Keep existing mono
      },
      fontSize: {
        ...mapFontSizes(arkanaStyle.typography.fontSizes),
      },
      colors: {
        // Arkana Style Colors (Primary Source of Truth)
        'canvas-deep-navy': arkanaStyle.colors.canvasDeepNavy,
        'surface-dark': arkanaStyle.colors.surfaceDark,
        'card-dark': arkanaStyle.colors.cardDark,
        'accent-cyan': arkanaStyle.colors.accentCyan,
        'accent-magenta': arkanaStyle.colors.accentMagenta,
        'accent-gold': arkanaStyle.colors.accentGold,
        'danger-red': arkanaStyle.colors.dangerRed,
        'success-green': arkanaStyle.colors.successGreen,
        'warning-yellow': arkanaStyle.colors.warningYellow,
        'text-primary': arkanaStyle.colors.textPrimary,
        'text-secondary': arkanaStyle.colors.textSecondary,
        'text-disabled': arkanaStyle.colors.textDisabled,
        'noir': arkanaStyle.colors.noir,
        'dusk-gray': arkanaStyle.colors.duskGray,
        'violet-pulse': arkanaStyle.colors.violetPulse,

        'luxury-pristine-white': arkanaStyle.colors.luxuryPristineWhite,
        'luxury-warm-white': arkanaStyle.colors.luxuryWarmWhite,
        'luxury-cool-white': arkanaStyle.colors.luxuryCoolWhite,
        'luxury-charcoal': arkanaStyle.colors.luxuryCharcoal,
        'luxury-warm-charcoal': arkanaStyle.colors.luxuryWarmCharcoal,
        'luxury-cool-charcoal': arkanaStyle.colors.luxuryCoolCharcoal,
        'luxury-platinum': arkanaStyle.colors.luxuryPlatinum,
        'luxury-platinum-light': arkanaStyle.colors.luxuryPlatinumLight,
        'luxury-platinum-deep': arkanaStyle.colors.luxuryPlatinumDeep,

        'emotional-serenity': arkanaStyle.colors.emotionalSerenity,
        'emotional-warmth': arkanaStyle.colors.emotionalWarmth,
        'emotional-clarity': arkanaStyle.colors.emotionalClarity,
        'emotional-presence': arkanaStyle.colors.emotionalPresence,

        'sacred7-presence': arkanaStyle.colors.sacred7Presence,
        'sacred7-capture': arkanaStyle.colors.sacred7Capture,
        'sacred7-flow': arkanaStyle.colors.sacred7Flow,
        'sacred7-focus': arkanaStyle.colors.sacred7Focus,
        'sacred7-connections': arkanaStyle.colors.sacred7Connections,
        'sacred7-command': arkanaStyle.colors.sacred7Command,
        'sacred7-reflection': arkanaStyle.colors.sacred7Reflection,
        'sacred7-presence-light': arkanaStyle.colors.sacred7PresenceLight,
        'sacred7-capture-light': arkanaStyle.colors.sacred7CaptureLight,
        'sacred7-flow-light': arkanaStyle.colors.sacred7FlowLight,
        'sacred7-focus-light': arkanaStyle.colors.sacred7FocusLight,
        'sacred7-connections-light': arkanaStyle.colors.sacred7ConnectionsLight,
        'sacred7-command-light': arkanaStyle.colors.sacred7CommandLight,
        'sacred7-reflection-light': arkanaStyle.colors.sacred7ReflectionLight,
        'sacred7-presence-dark': arkanaStyle.colors.sacred7PresenceDark,
        'sacred7-capture-dark': arkanaStyle.colors.sacred7CaptureDark,
        'sacred7-flow-dark': arkanaStyle.colors.sacred7FlowDark,
        'sacred7-focus-dark': arkanaStyle.colors.sacred7FocusDark,
        'sacred7-connections-dark': arkanaStyle.colors.sacred7ConnectionsDark,
        'sacred7-command-dark': arkanaStyle.colors.sacred7CommandDark,
        'sacred7-reflection-dark': arkanaStyle.colors.sacred7ReflectionDark,

        interactive: {
          DEFAULT: arkanaStyle.colors.interactiveElement,
          hover: arkanaStyle.colors.accentCyan, // Example hover state
          active: arkanaStyle.colors.violetPulse, // Example active state
          disabled: arkanaStyle.colors.textDisabled,
        },

        // Website specific colors
        'brand-teal': '#16FFE1',
        'pure-black': '#000000',
        'deep-black': '#050505',
        'neutral-gray': '#9CA3AF',
        
        // Retaining existing palettes for now, to be reviewed for overlap/deprecation
        'emotional-ai': {
          void: 'var(--emotional-ai-void, #0f172a)',
          resonance: 'var(--emotional-ai-resonance, #1e293b)',
          clarity: 'var(--emotional-ai-clarity, #334155)',
          illumination: 'var(--emotional-ai-illumination, #8b5cf6)',
          activation: 'var(--emotional-ai-activation, #06b6d4)',
          50: '#f3f0ff', 100: '#e9e3ff', 200: '#d4c5ff', 300: '#b197fc', 400: '#9775fa', 500: '#845ef7', 600: '#7950f2', 700: '#6741d9', 800: '#5f3dc4', 900: '#4c2889', 950: '#3a1f66',
        },
        primary: { // This was an existing palette, review if still needed
          50: '#f0f9ff', 100: '#e0f2fe', 200: '#bae6fd', 300: '#7dd3fc', 400: '#38bdf8', 500: '#0ea5e9', 600: '#0284c7', 700: '#0369a1', 800: '#075985', 900: '#0c4a6e',
        },
        neutral: { // This was an existing palette, review if still needed
          50: '#fafafa', 100: '#f5f5f5', 200: '#e5e5e5', 300: '#d4d4d4', 400: '#a3a3a3', 500: '#737373', 600: '#525252', 700: '#404040', 800: '#262626', 900: '#171717',
        },
      },
      spacing: {
        ...mapSpacing(arkanaStyle.spacing),
        // Luxury spacing scale - 50% increase for breathing room
        '18': '4.5rem',
        '22': '5.5rem',
        '26': '6.5rem',
        '30': '7.5rem',
        '34': '8.5rem',
        '38': '9.5rem',
        '42': '10.5rem',
        '46': '11.5rem',
        '50': '12.5rem',
        '54': '13.5rem',
        '58': '14.5rem',
        '62': '15.5rem',
        // Keep existing mobile-optimized spacing if needed
        'safe': 'env(safe-area-inset-bottom)',
        'safe-top': 'env(safe-area-inset-top)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
        'tap': '44px',
        'thumb': '48px',
        'comfort': '56px',
      },
      borderRadius: {
        ...mapRadii(arkanaStyle.radii),
      },
      transitionDuration: {
        ...mapDurations(arkanaStyle.animations),
      },
      // Keep existing backgroundImage, animation, keyframes, screens
      backgroundImage: {
        'gradient-emotional-ai': 'var(--gradient-emotional-ai)',
        'gradient-awakening': 'var(--gradient-awakening)',
        'gradient-intelligence': 'var(--gradient-intelligence)',
        'gradient-depth': 'var(--gradient-depth)',
      },
      animation: {
        'pulse-slow': 'pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0) translateX(0)' },
          '50%': { transform: 'translateY(-10px) translateX(4px)' },
        },
      },
      screens: {
        'xs': '375px', 'sm': '640px', 'md': '768px', 'lg': '1024px', 'xl': '1280px', '2xl': '1536px',
        'touch': { 'raw': '(hover: none) and (pointer: coarse)' },
        'stylus': { 'raw': '(hover: none) and (pointer: fine)' },
        'mouse': { 'raw': '(hover: hover) and (pointer: fine)' },
        'portrait': { 'raw': '(orientation: portrait)' },
        'landscape': { 'raw': '(orientation: landscape)' },
      },
    },
  },
  plugins: [],
};

export default config;
