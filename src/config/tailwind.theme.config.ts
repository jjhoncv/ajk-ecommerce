import type { Config } from 'tailwindcss'

// Función para generar variaciones de un color base
function generateColorVariations(baseColor: string) {
  // Función auxiliar para mezclar colores (simula color-mix)
  function mixColor(color: string, mixWith: string, amount: number): string {
    // Convertir color hexadecimal a componentes RGB
    const parseHex = (hex: string): [number, number, number] => {
      const r = parseInt(hex.slice(1, 3), 16)
      const g = parseInt(hex.slice(3, 5), 16)
      const b = parseInt(hex.slice(5, 7), 16)
      return [r, g, b]
    }

    // Convertir RGB a hexadecimal
    const toHex = (r: number, g: number, b: number): string => {
      return `#${Math.round(r).toString(16).padStart(2, '0')}${Math.round(g)
        .toString(16)
        .padStart(2, '0')}${Math.round(b).toString(16).padStart(2, '0')}`
    }

    // Obtener componentes RGB
    const [r1, g1, b1] = parseHex(color)
    const [r2, g2, b2] = parseHex(mixWith)

    // Mezclar colores según el porcentaje
    const r = r1 * (1 - amount) + r2 * amount
    const g = g1 * (1 - amount) + g2 * amount
    const b = b1 * (1 - amount) + b2 * amount

    return toHex(r, g, b)
  }

  // Crear variaciones mezclando con blanco (más claro) y negro (más oscuro)
  return {
    DEFAULT: baseColor,
    50: mixColor(baseColor, '#FFFFFF', 0.95), // 95% blanco
    100: mixColor(baseColor, '#FFFFFF', 0.9), // 90% blanco
    200: mixColor(baseColor, '#FFFFFF', 0.8), // 80% blanco
    300: mixColor(baseColor, '#FFFFFF', 0.7), // 70% blanco
    400: mixColor(baseColor, '#FFFFFF', 0.4), // 40% blanco
    500: baseColor, // Color base
    600: mixColor(baseColor, '#000000', 0.1), // 10% negro
    700: mixColor(baseColor, '#000000', 0.2), // 20% negro
    800: mixColor(baseColor, '#000000', 0.3), // 30% negro
    900: mixColor(baseColor, '#000000', 0.4), // 40% negro
    950: mixColor(baseColor, '#000000', 0.5) // 50% negro
  }
}

export const themes = {
  'modern-ecommerce': {
    colors: {
      primary: generateColorVariations('#334155'),
      secondary: generateColorVariations('#4A3AD7'),
      accent: generateColorVariations('#22C55E')
    },
    borderRadius: {
      small: '0.25rem',
      medium: '0.5rem',
      large: '1rem'
    },
    fontSizes: {
      small: '0.875rem',
      medium: '1rem',
      large: '1.25rem',
      xlarge: '1.5rem',
      xxlarge: '2rem'
    },
    spacing: {
      small: '0.5rem',
      medium: '1rem',
      large: '1.5rem',
      xlarge: '2rem'
    }
  }
  // Puedes agregar más temas aquí
}

export type ThemeName = keyof typeof themes

// Crear un preset de Tailwind para el tema actual
export function createTailwindPreset(themeName: ThemeName): Partial<Config> {
  const theme = themes[themeName]

  return {
    theme: {
      extend: {
        colors: {
          primary: theme.colors.primary,
          secondary: theme.colors.secondary,
          accent: theme.colors.accent
        },
        borderRadius: {
          sm: theme.borderRadius.small,
          md: theme.borderRadius.medium,
          lg: theme.borderRadius.large
        },
        fontSize: {
          sm: theme.fontSizes.small,
          base: theme.fontSizes.medium,
          lg: theme.fontSizes.large,
          xl: theme.fontSizes.xlarge,
          '2xl': theme.fontSizes.xxlarge
        },
        spacing: {
          sm: theme.spacing.small,
          md: theme.spacing.medium,
          lg: theme.spacing.large,
          xl: theme.spacing.xlarge
        },
        screens: {
          '3xl': '1700px', // 5x5 grid
          '4xl': '1920px' // 6x6 grid
        }
      }
    }
  }
}
