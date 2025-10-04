
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
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				// ExoScan custom colors
				cosmic: {
					50: 'hsl(240, 70%, 95%)',
					100: 'hsl(240, 70%, 90%)',
					500: 'hsl(var(--primary))',
					600: 'hsl(240, 70%, 45%)',
					900: 'hsl(240, 70%, 15%)',
				},
				stellar: {
					DEFAULT: 'hsl(var(--exo-star))',
					400: 'hsl(45, 93%, 70%)',
					500: 'hsl(var(--exo-star))',
					600: 'hsl(45, 93%, 55%)',
				},
				planet: {
					DEFAULT: 'hsl(var(--exo-planet))',
					400: 'hsl(190, 85%, 65%)',
					500: 'hsl(var(--exo-planet))',
					600: 'hsl(190, 85%, 50%)',
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--radix-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: '0' }
				},
				float: {
					'0%, 100%': { transform: 'translateY(0px)' },
					'50%': { transform: 'translateY(-10px)' }
				},
				'pulse-star': {
					'0%, 100%': { opacity: '1', transform: 'scale(1)' },
					'50%': { opacity: '0.7', transform: 'scale(1.05)' }
				},
				orbit: {
					from: { transform: 'rotate(0deg)' },
					to: { transform: 'rotate(360deg)' }
				},
				'fade-in': {
					from: { opacity: '0', transform: 'translateY(20px)' },
					to: { opacity: '1', transform: 'translateY(0)' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				float: 'float 6s ease-in-out infinite',
				'pulse-star': 'pulse-star 3s ease-in-out infinite',
				orbit: 'orbit 20s linear infinite',
				'fade-in': 'fade-in 0.6s ease-out'
			},
			backgroundImage: {
				'cosmic-gradient': 'linear-gradient(135deg, hsl(var(--exo-gradient-start)), hsl(var(--exo-gradient-end)))',
				'stellar-gradient': 'radial-gradient(circle, hsl(var(--exo-star)) 0%, transparent 70%)',
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
} satisfies Config;
