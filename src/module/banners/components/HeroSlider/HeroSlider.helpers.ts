import { type HeroSliderLayout } from './HeroSlider.interfaces'
import { cn } from '@/lib/utils'

/**
 * Clases base para diferentes layouts
 */
export const baseClasses = {
  grid: {
    withBoth: 'grid grid-cols-12 gap-6',
    slidesOnly: 'grid grid-cols-1',
    promotionsOnly: ''
  },
  slider: {
    withSideBanners: 'col-span-8',
    fullWidth: 'col-span-1',
    base: 'relative h-[400px] overflow-hidden'
  },
  promotion: {
    base: 'relative overflow-hidden',
    heights: {
      small: 'h-[192px]',
      medium: 'h-[300px]',
      large: 'h-[400px]',
      tall: 'h-[250px]'
    },
    layouts: {
      single: 'col-span-4 h-[400px]',
      double: 'col-span-4 space-y-4',
      triple: 'col-span-4 grid grid-rows-2 gap-4 h-[400px]',
      default: 'col-span-4 space-y-4'
    }
  },
  standalone: {
    single: 'relative h-[400px] overflow-hidden rounded-lg',
    grid2: 'grid grid-cols-1 gap-6 md:grid-cols-2',
    grid3: 'grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3'
  }
}

/**
 * Determina las clases CSS para el grid principal
 */
export const getGridClasses = (
  layout: HeroSliderLayout,
  className?: string
): string => {
  const { hasSlides, hasSideBanners } = layout

  let gridClass = baseClasses.grid.promotionsOnly

  if (hasSlides && hasSideBanners) {
    gridClass = baseClasses.grid.withBoth
  } else if (hasSlides && !hasSideBanners) {
    gridClass = baseClasses.grid.slidesOnly
  }

  return cn(gridClass, className)
}

/**
 * Determina las clases CSS para el slider principal
 */
export const getSliderClasses = (
  layout: HeroSliderLayout,
  className?: string
): string => {
  const { hasSlides, hasSideBanners } = layout

  const sliderLayoutClass =
    hasSlides && hasSideBanners
      ? baseClasses.slider.withSideBanners
      : baseClasses.slider.fullWidth

  return cn(baseClasses.slider.base, sliderLayoutClass, className)
}

/**
 * Determina las clases CSS para el layout de promociones según la cantidad
 */
export const getPromotionLayoutClasses = (
  promotionCount: number,
  className?: string
): string => {
  let layoutClass = baseClasses.promotion.layouts.default

  switch (promotionCount) {
    case 1:
      layoutClass = baseClasses.promotion.layouts.single
      break
    case 2:
      layoutClass = baseClasses.promotion.layouts.double
      break
    case 3:
      layoutClass = baseClasses.promotion.layouts.triple
      break
  }

  return cn(layoutClass, className)
}

/**
 * Determina las clases CSS para cada item de promoción individual
 */
export const getPromotionItemClasses = (
  index: number,
  promotionCount: number,
  className?: string
): string => {
  let itemClass = cn(
    baseClasses.promotion.base,
    baseClasses.promotion.heights.small
  )

  switch (promotionCount) {
    case 1:
      itemClass = cn(baseClasses.promotion.base, 'h-full')
      break
    case 2:
      itemClass = cn(
        baseClasses.promotion.base,
        baseClasses.promotion.heights.small
      )
      break
    case 3:
      if (index < 2) {
        itemClass = cn(baseClasses.promotion.base)
      } else {
        itemClass = cn(baseClasses.promotion.base, 'row-span-1')
      }
      break
  }

  return cn(itemClass, className)
}

/**
 * Determina las clases CSS para promociones standalone según la cantidad
 */
export const getStandalonePromotionClasses = (
  promotionCount: number,
  className?: string
): string => {
  let standaloneClass = ''

  switch (promotionCount) {
    case 1:
      standaloneClass = baseClasses.standalone.single
      break
    case 2:
      standaloneClass = baseClasses.standalone.grid2
      break
    case 3:
      standaloneClass = baseClasses.standalone.grid2
      break
    default:
      standaloneClass = baseClasses.standalone.grid3
      break
  }

  return cn(standaloneClass, className)
}

/**
 * Determina las clases CSS para cada item de promoción standalone
 */
export const getStandalonePromotionItemClasses = (
  index: number,
  promotionCount: number,
  className?: string
): string => {
  let itemClass = ''

  switch (promotionCount) {
    case 1:
      itemClass = '' // No necesita clases adicionales para el contenedor
      break
    case 2:
      itemClass = cn(
        baseClasses.promotion.base,
        baseClasses.promotion.heights.medium,
        'rounded-lg'
      )
      break
    case 3:
      if (index === 0) {
        itemClass = cn(
          baseClasses.promotion.base,
          baseClasses.promotion.heights.tall,
          'rounded-lg md:col-span-2'
        )
      } else {
        itemClass = cn(
          baseClasses.promotion.base,
          baseClasses.promotion.heights.tall,
          'rounded-lg'
        )
      }
      break
    default:
      itemClass = cn(
        baseClasses.promotion.base,
        baseClasses.promotion.heights.medium,
        'rounded-lg'
      )
      break
  }

  return cn(itemClass, className)
}

/**
 * Determina las clases CSS para el tamaño del título
 */
export const getPromotionTitleClasses = (
  promotionCount: number,
  isStandalone: boolean = false,
  index: number = 0,
  className?: string
): string => {
  let titleSize = 'text-xl'

  if (isStandalone) {
    switch (promotionCount) {
      case 1:
        titleSize = 'text-4xl'
        break
      case 2:
        titleSize = 'text-2xl'
        break
      case 3:
        titleSize = index === 0 ? 'text-3xl' : 'text-xl'
        break
      default:
        titleSize = 'text-xl'
        break
    }
  } else {
    // Cuando están junto a banners
    switch (promotionCount) {
      case 1:
        titleSize = 'text-2xl'
        break
      case 2:
        titleSize = 'text-xl'
        break
      case 3:
        titleSize = index < 2 ? 'text-lg' : 'text-xl'
        break
    }
  }

  return cn('font-bold text-white mb-2', titleSize, className)
}

/**
 * Determina las clases CSS para el subtítulo
 */
export const getPromotionSubtitleClasses = (
  isStandalone: boolean = false,
  className?: string
): string => {
  const baseSubtitle = 'font-medium text-yellow-400'
  const size = isStandalone ? 'text-lg mb-2' : 'text-sm mb-1'

  return cn(baseSubtitle, size, className)
}

/**
 * Determina las clases CSS para el contenedor de contenido de promoción
 */
export const getPromotionContentClasses = (
  isStandalone: boolean = false,
  className?: string
): string => {
  const baseContent =
    'absolute inset-0 bg-gradient-to-r from-black/60 to-transparent'
  const padding = isStandalone ? 'p-8' : 'p-6'
  const layout = isStandalone ? 'flex h-full items-center' : ''

  return cn(baseContent, padding, layout, className)
}

/**
 * Determina las clases CSS para el botón de promoción
 */
export const getPromotionButtonClasses = (
  isStandalone: boolean = false,
  className?: string
): string => {
  if (isStandalone) {
    return cn(
      'inline-block border border-secondary bg-secondary px-8 py-3 text-white transition-colors hover:border hover:border-secondary hover:bg-transparent',
      className
    )
  }

  return cn('text-white hover:underline text-sm', className)
}

/**
 * Determina el tamaño de imagen para Next.js Image según el tipo de promoción
 */
export const getPromotionImageSizes = (
  promotionCount: number,
  isStandalone: boolean = false
): string => {
  if (isStandalone) {
    switch (promotionCount) {
      case 1:
        return '100vw'
      case 2:
        return '(max-width: 768px) 100vw, 50vw'
      case 3:
        return '(max-width: 768px) 100vw, 50vw'
      default:
        return '(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw'
    }
  } else {
    switch (promotionCount) {
      case 1:
        return '(max-width: 768px) 100vw, 33vw'
      case 2:
        return '(max-width: 768px) 100vw, 33vw'
      case 3:
        return '(max-width: 768px) 100vw, 16vw'
      default:
        return '(max-width: 768px) 100vw, 33vw'
    }
  }
}

/**
 * Crea el layout de información del slider
 */
export const createSliderLayout = (
  slidesLength: number,
  sideBannersLength: number
): HeroSliderLayout => {
  return {
    hasSlides: slidesLength > 0,
    hasSideBanners: sideBannersLength > 0,
    promotionCount: sideBannersLength
  }
}

/**
 * Valida si el componente debe renderizarse
 */
export const shouldRenderSlider = (layout: HeroSliderLayout): boolean => {
  return layout.hasSlides || layout.hasSideBanners
}
