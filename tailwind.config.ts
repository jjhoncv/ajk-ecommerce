import type { Config } from 'tailwindcss'
import { createTailwindPreset } from './src/config/tailwind.theme.config'
import { siteConfig } from './src/config'

// Obtenemos el tema actual desde la configuración del sitio
const currentTheme = siteConfig.theme

// Creamos el preset para el tema actual
const themePreset = createTailwindPreset(currentTheme)

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  presets: [themePreset],
  plugins: []
}

export default config
