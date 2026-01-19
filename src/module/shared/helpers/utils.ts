import { type PromotionVariants } from '@/types/domain'

/**
 * Formatea un precio en formato de moneda
 * @param price - El precio a formatear
 * @param currency - La moneda (por defecto PEN)
 * @returns El precio formateado
 */
export function formatPrice(price: number, currency: string = 'PEN'): string {
  const formatter = new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2, // ✅ Mínimo 2 decimales
    maximumFractionDigits: 2
  }) // ✅ Máximo 2 decimales  })

  return formatter.format(price)
}

/**
 * Calcula el porcentaje de descuento entre dos precios
 * @param originalPrice - El precio original
 * @param discountedPrice - El precio con descuento
 * @returns El porcentaje de descuento
 */
export function calculateDiscount(
  originalPrice: number,
  discountedPrice: number
): number {
  if (originalPrice <= 0 || discountedPrice <= 0) return 0
  if (discountedPrice >= originalPrice) return 0

  const discount = ((originalPrice - discountedPrice) / originalPrice) * 100
  return Math.round(discount)
}

/**
 * Trunca un texto a una longitud máxima
 * @param text - El texto a truncar
 * @param maxLength - La longitud máxima
 * @returns El texto truncado
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

/**
 * Genera un slug a partir de un texto
 * @param text - El texto a convertir en slug
 * @returns El slug generado
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w ]+/g, '')
    .replace(/ +/g, '-')
}

/**
 * Obtiene una URL de imagen con dimensiones específicas
 * @param url - La URL de la imagen
 * @param width - El ancho deseado
 * @param height - La altura deseada
 * @returns La URL de la imagen con las dimensiones especificadas
 */
export function getImageUrl(
  url: string,
  width: number,
  height: number
): string {
  // Si la URL ya contiene parámetros de dimensiones, los reemplazamos
  if (url.includes('?w=') || url.includes('&w=')) {
    return url.replace(/([?&])(w=\d+)(&h=\d+)?/g, `$1w=${width}&h=${height}`)
  }

  // Si la URL ya tiene parámetros, agregamos las dimensiones
  if (url.includes('?')) {
    return `${url}&w=${width}&h=${height}`
  }

  // Si la URL no tiene parámetros, agregamos las dimensiones
  return `${url}?w=${width}&h=${height}`
}

export const getPromotions = (
  _pvs?: Array<PromotionVariants | null> | null
): PromotionVariants[] | undefined => {
  if (!_pvs) return []
  const pvsNotEmpty: PromotionVariants[] = _pvs.filter((pv) => !!pv)
  return pvsNotEmpty
}
