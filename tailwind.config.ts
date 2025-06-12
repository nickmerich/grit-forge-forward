
import type { Config } from "tailwindcss";

export default {
	darkMode: ["class"],
	content: [
		"./pages/**/*.{ts,tsx}",
		"./components/**/*.{ts,tsx}",
		"./app/**/*.{ts,tsx}",
		"./src/**/*.{ts,tsx}",
	],
	prefix: "",
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				// Neo-brutalist color system - only black, white, and green
				brutalist: {
					black: '#000000',
					white: '#FFFFFF',
					green: '#00FF00',
				},
				// Override all default colors to brutalist palette
				border: '#000000',
				input: '#000000',
				ring: '#00FF00',
				background: '#FFFFFF',
				foreground: '#000000',
				primary: {
					DEFAULT: '#000000',
					foreground: '#FFFFFF'
				},
				secondary: {
					DEFAULT: '#FFFFFF',
					foreground: '#000000'
				},
				destructive: {
					DEFAULT: '#000000',
					foreground: '#FFFFFF'
				},
				muted: {
					DEFAULT: '#FFFFFF',
					foreground: '#000000'
				},
				accent: {
					DEFAULT: '#00FF00',
					foreground: '#000000'
				},
				popover: {
					DEFAULT: '#FFFFFF',
					foreground: '#000000'
				},
				card: {
					DEFAULT: '#FFFFFF',
					foreground: '#000000'
				},
			},
			borderRadius: {
				// No rounded corners in neo-brutalism
				lg: '0px',
				md: '0px',
				sm: '0px',
				none: '0px'
			},
			fontFamily: {
				'brutalist': ['Arial Black', 'Helvetica Bold', 'sans-serif'],
				'sans': ['Arial', 'Helvetica', 'sans-serif'],
			},
			fontSize: {
				'brutalist-h1': ['32px', { lineHeight: '1.2', letterSpacing: '2px' }],
				'brutalist-h2': ['24px', { lineHeight: '1.3', letterSpacing: '1px' }],
				'brutalist-button': ['18px', { lineHeight: '1.4', letterSpacing: '1px' }],
			},
			boxShadow: {
				'brutalist': '8px 8px 0px #000000',
				'brutalist-lg': '12px 12px 0px #000000',
				'brutalist-green': '8px 8px 0px #00FF00',
			},
			keyframes: {
				'brutalist-pulse': {
					'0%, 100%': { transform: 'scale(1)' },
					'50%': { transform: 'scale(1.05)' },
				},
				'progress-fill': {
					'0%': { width: '0%' },
					'100%': { width: 'var(--progress-width)' },
				}
			},
			animation: {
				'brutalist-pulse': 'brutalist-pulse 2s ease-in-out infinite',
				'progress-fill': 'progress-fill 1s ease-out forwards',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
