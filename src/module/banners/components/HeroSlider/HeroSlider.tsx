'use client'
import { cn } from '@/lib/utils'
import { type Banner } from '@/module/banners/service/banner/types'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

// Hooks y helpers
import {
  getGridClasses,
  getPromotionButtonClasses,
  getPromotionContentClasses,
  getPromotionImageSizes,
  getPromotionItemClasses,
  getPromotionLayoutClasses,
  getPromotionSubtitleClasses,
  getPromotionTitleClasses,
  getSliderClasses,
  getStandalonePromotionClasses,
  getStandalonePromotionItemClasses
} from './HeroSlider.helpers'
import { type SideBanner } from './HeroSlider.interfaces'
import { useHeroSlider } from './use-hero-slider.hook'

interface HeroSliderProps {
  slides: Banner[]
  sideBanners?: SideBanner[]
  autoPlay?: boolean
  autoPlayInterval?: number
  className?: string
}

const HeroSlider: React.FC<HeroSliderProps> = ({
  slides,
  sideBanners = [],
  autoPlay = false,
  autoPlayInterval = 5000,
  className
}) => {
  const {
    currentSlide,
    layout,
    shouldRender,
    nextSlide,
    prevSlide,
    goToSlide,
    canGoPrev,
    canGoNext
  } = useHeroSlider({
    slides,
    sideBanners,
    autoPlay,
    autoPlayInterval
  })

  // No renderizar si no hay contenido
  if (!shouldRender) {
    return null
  }

  const { hasSlides, hasSideBanners, promotionCount } = layout

  return (
    <section className={cn('relative', className)}>
      <div className="mx-auto max-w-screen-4xl px-12 pb-0 pt-6">
        {/* Layout con banners y promociones o solo banners */}
        {hasSlides && (
          <div className={getGridClasses(layout)}>
            {/* Slider Principal */}
            <div className={getSliderClasses(layout)}>
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={cn(
                    'absolute inset-0 transition-opacity duration-500',
                    index === currentSlide ? 'opacity-100' : 'opacity-0'
                  )}
                >
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 66vw"
                    priority={index === 0}
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent">
                    <div className="flex h-full items-center px-12">
                      <div className="max-w-lg">
                        <div className="mb-2 font-medium text-yellow-400">
                          {slide.subtitle}
                        </div>
                        <h1 className="mb-4 text-5xl font-bold text-white">
                          {slide.title}
                        </h1>
                        <p className="mb-6 text-gray-200">
                          {slide.description}
                        </p>
                        <Link
                          href={slide.ctaLink}
                          className="inline-block border border-secondary bg-secondary px-8 py-3 text-white transition-colors hover:border hover:border-secondary hover:bg-transparent"
                        >
                          {slide.cta}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Controles del Slider - Solo si hay múltiples slides */}
              {slides.length > 1 && (
                <>
                  <button
                    onClick={prevSlide}
                    disabled={!canGoPrev && !autoPlay}
                    className={cn(
                      'absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 transition-all hover:bg-white',
                      'disabled:cursor-not-allowed disabled:opacity-50'
                    )}
                  >
                    <ChevronLeft className="h-6 w-6" />
                  </button>
                  <button
                    onClick={nextSlide}
                    disabled={!canGoNext && !autoPlay}
                    className={cn(
                      'absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 transition-all hover:bg-white',
                      'disabled:cursor-not-allowed disabled:opacity-50'
                    )}
                  >
                    <ChevronRight className="h-6 w-6" />
                  </button>

                  {/* Dots */}
                  <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
                    {slides.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          goToSlide(index)
                        }}
                        className={cn(
                          'h-3 w-3 rounded-full transition-colors',
                          index === currentSlide ? 'bg-white' : 'bg-white/50'
                        )}
                        aria-label={`Ir al slide ${index + 1}`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Promociones Laterales - Solo cuando hay banners */}
            {hasSideBanners && (
              <div className={getPromotionLayoutClasses(promotionCount)}>
                {promotionCount === 3 ? (
                  // Layout especial para 3 promociones
                  <>
                    {/* Primera fila: 2 promociones */}
                    <div className="grid grid-cols-2 gap-4">
                      {sideBanners.slice(0, 2).map((banner, index) => (
                        <PromotionCard
                          key={index}
                          banner={banner}
                          className={getPromotionItemClasses(
                            index,
                            promotionCount
                          )}
                          sizes={getPromotionImageSizes(promotionCount, false)}
                          promotionCount={promotionCount}
                          index={index}
                          isStandalone={false}
                        />
                      ))}
                    </div>

                    {/* Segunda fila: 1 promoción completa */}
                    <PromotionCard
                      banner={sideBanners[2]}
                      className={getPromotionItemClasses(2, promotionCount)}
                      sizes={getPromotionImageSizes(promotionCount, false)}
                      promotionCount={promotionCount}
                      index={2}
                      isStandalone={false}
                    />
                  </>
                ) : (
                  // Layout normal para 1 o 2 promociones
                  sideBanners.map((banner, index) => (
                    <PromotionCard
                      key={index}
                      banner={banner}
                      className={getPromotionItemClasses(index, promotionCount)}
                      sizes={getPromotionImageSizes(promotionCount, false)}
                      promotionCount={promotionCount}
                      index={index}
                      isStandalone={false}
                    />
                  ))
                )}
              </div>
            )}
          </div>
        )}

        {/* Layout especial: Solo promociones (sin banners) */}
        {!hasSlides && hasSideBanners && (
          <div className="mt-6">
            <div className={getStandalonePromotionClasses(promotionCount)}>
              {sideBanners.map((banner, index) => (
                <PromotionCard
                  key={index}
                  banner={banner}
                  className={getStandalonePromotionItemClasses(
                    index,
                    promotionCount
                  )}
                  sizes={getPromotionImageSizes(promotionCount, true)}
                  promotionCount={promotionCount}
                  index={index}
                  isStandalone={true}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

// Componente auxiliar para las tarjetas de promoción
interface PromotionCardProps {
  banner: SideBanner
  className?: string
  sizes: string
  promotionCount: number
  index: number
  isStandalone: boolean
}

const PromotionCard: React.FC<PromotionCardProps> = ({
  banner,
  className,
  sizes,
  promotionCount,
  index,
  isStandalone
}) => {
  return (
    <div className={className}>
      <Image
        src={banner.image}
        alt={banner.title}
        fill
        sizes={sizes}
        className="object-cover"
      />
      <div className={getPromotionContentClasses(isStandalone)}>
        {isStandalone && (
          <div className="max-w-2xl">
            <div className={getPromotionSubtitleClasses(isStandalone)}>
              {banner.subtitle}
            </div>
            <h3
              className={getPromotionTitleClasses(
                promotionCount,
                isStandalone,
                index
              )}
            >
              {banner.title}
            </h3>
            <Link
              href={banner.link}
              className={getPromotionButtonClasses(isStandalone)}
            >
              Ver más
            </Link>
          </div>
        )}

        {!isStandalone && (
          <>
            <div className={getPromotionSubtitleClasses(isStandalone)}>
              {banner.subtitle}
            </div>
            <h3
              className={getPromotionTitleClasses(
                promotionCount,
                isStandalone,
                index
              )}
            >
              {banner.title}
            </h3>
            <Link
              href={banner.link}
              className={getPromotionButtonClasses(isStandalone)}
            >
              Ver más
            </Link>
          </>
        )}
      </div>
    </div>
  )
}

export default HeroSlider
