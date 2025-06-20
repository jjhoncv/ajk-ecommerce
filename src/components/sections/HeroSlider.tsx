'use client'
import { Hero } from '@/services/hero'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

interface SideBanner {
  title: string
  subtitle: string
  image: string
  link: string
}

interface HeroSliderProps {
  slides: Hero[]
  sideBanners?: SideBanner[]
}

const HeroSlider: React.FC<HeroSliderProps> = ({
  slides,
  sideBanners = []
}) => {
  const [currentSlide, setCurrentSlide] = useState(0)

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length)
  }

  return (
    <section className="relative">
      <div className="mx-auto max-w-screen-4xl py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Slider */}
          <div className="relative col-span-8 h-[400px] overflow-hidden">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentSlide ? 'opacity-100' : 'opacity-0'
                }`}
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
                      <p className="mb-6 text-gray-200">{slide.description}</p>
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

            {/* Slider Controls */}
            <button
              onClick={prevSlide}
              className="absolute left-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 rounded-full bg-white/80 p-2 hover:bg-white"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`h-3 w-3 rounded-full ${
                    index === currentSlide ? 'bg-white' : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </div>

          {/* Side Banners */}
          {sideBanners.length > 0 && (
            <div className="col-span-4 space-y-4">
              {sideBanners.map((banner, index) => (
                <div key={index} className="relative h-[192px] overflow-hidden">
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent p-6">
                    <div className="mb-1 font-medium text-yellow-400">
                      {banner.subtitle}
                    </div>
                    <h3 className="mb-2 text-xl font-bold text-white">
                      {banner.title}
                    </h3>
                    <Link
                      href={banner.link}
                      className="text-white hover:underline"
                    >
                      Ver más
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default HeroSlider
