"use client";
import { Hero } from "@/services/hero";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState } from "react";

interface SideBanner {
  title: string;
  subtitle: string;
  image: string;
  link: string;
}

interface HeroSliderProps {
  slides: Hero[];
  sideBanners?: SideBanner[];
}

const HeroSlider: React.FC<HeroSliderProps> = ({
  slides,
  sideBanners = [],
}) => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  return (
    <section className="relative">
      <div className="max-w-screen-4xl mx-auto px-12 py-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Slider */}
          <div className="col-span-8 relative  overflow-hidden h-[400px]">
            {slides.map((slide, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${index === currentSlide ? "opacity-100" : "opacity-0"
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
                  <div className="h-full flex items-center px-12">
                    <div className="max-w-lg">
                      <div className="text-yellow-400 font-medium mb-2">
                        {slide.subtitle}
                      </div>
                      <h1 className="text-5xl font-bold text-white mb-4">
                        {slide.title}
                      </h1>
                      <p className="text-gray-200 mb-6">{slide.description}</p>
                      <Link
                        href={slide.ctaLink}
                        className="inline-block  bg-secondary border border-secondary text-white px-8 py-3  hover:bg-transparent hover:border-secondary hover:border transition-colors"
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
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
            >
              <ChevronLeft className="h-6 w-6" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
            >
              <ChevronRight className="h-6 w-6" />
            </button>

            {/* Dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {slides.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full ${index === currentSlide ? "bg-white" : "bg-white/50"
                    }`}
                />
              ))}
            </div>
          </div>

          {/* Side Banners */}
          {sideBanners.length > 0 && (
            <div className="col-span-4 space-y-4">
              {sideBanners.map((banner, index) => (
                <div
                  key={index}
                  className="relative  overflow-hidden h-[192px]"
                >
                  <Image
                    src={banner.image}
                    alt={banner.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent p-6">
                    <div className="text-yellow-400 font-medium mb-1">
                      {banner.subtitle}
                    </div>
                    <h3 className="text-white text-xl font-bold mb-2">
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
  );
};

export default HeroSlider;
