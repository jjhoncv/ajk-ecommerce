'use client'

import { type Categories } from '@/types/domain'
import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

interface CategoryBannerProps {
  category: Categories
}

export const CategoryBanner = ({ category }: CategoryBannerProps) => {
  const hasBanner = category.bannerImage || category.bannerImageMobile

  if (!hasBanner) {
    // Banner por defecto sin imagen
    return (
      <div className="relative w-full bg-gradient-to-r from-gray-900 to-gray-700">
        <div className="mx-auto max-w-screen-4xl px-6 py-12 lg:px-12 lg:py-16">
          <div className="max-w-2xl">
            <h1 className="text-3xl font-bold text-white lg:text-4xl">
              {category.bannerTitle || category.name}
            </h1>
            {category.bannerSubtitle && (
              <p className="mt-2 text-lg text-gray-300">
                {category.bannerSubtitle}
              </p>
            )}
            {category.bannerDescription && (
              <p className="mt-4 text-gray-400">
                {category.bannerDescription}
              </p>
            )}
            {category.bannerCtaText && category.bannerCtaLink && (
              <Link
                href={category.bannerCtaLink}
                className="mt-6 inline-flex items-center gap-2 bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100"
              >
                {category.bannerCtaText}
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full overflow-hidden">
      {/* Desktop Banner */}
      {category.bannerImage && (
        <div className="relative hidden md:block">
          <div className="relative aspect-[1920/400] w-full">
            <Image
              src={category.bannerImage}
              alt={category.bannerTitle || category.name}
              fill
              className="object-cover"
              priority
            />
            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
          </div>
          {/* Content overlay */}
          <div className="absolute inset-0 flex items-center">
            <div className="mx-auto w-full max-w-screen-4xl px-6 lg:px-12">
              <div className="max-w-xl">
                <h1 className="text-3xl font-bold text-white lg:text-4xl xl:text-5xl">
                  {category.bannerTitle || category.name}
                </h1>
                {category.bannerSubtitle && (
                  <p className="mt-2 text-lg text-gray-200 lg:text-xl">
                    {category.bannerSubtitle}
                  </p>
                )}
                {category.bannerDescription && (
                  <p className="mt-4 text-gray-300 lg:text-lg">
                    {category.bannerDescription}
                  </p>
                )}
                {category.bannerCtaText && category.bannerCtaLink && (
                  <Link
                    href={category.bannerCtaLink}
                    className="mt-6 inline-flex items-center gap-2 bg-white px-6 py-3 text-sm font-semibold text-gray-900 transition-colors hover:bg-gray-100"
                  >
                    {category.bannerCtaText}
                    <ChevronRight className="h-4 w-4" />
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Mobile Banner */}
      <div className="relative md:hidden">
        <div className="relative aspect-[800/400] w-full">
          <Image
            src={category.bannerImageMobile || category.bannerImage || ''}
            alt={category.bannerTitle || category.name}
            fill
            className="object-cover"
            priority
          />
          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
        </div>
        {/* Content overlay */}
        <div className="absolute inset-0 flex items-end pb-6">
          <div className="w-full px-4">
            <h1 className="text-2xl font-bold text-white">
              {category.bannerTitle || category.name}
            </h1>
            {category.bannerSubtitle && (
              <p className="mt-1 text-sm text-gray-200">
                {category.bannerSubtitle}
              </p>
            )}
            {category.bannerCtaText && category.bannerCtaLink && (
              <Link
                href={category.bannerCtaLink}
                className="mt-4 inline-flex items-center gap-2 bg-white px-4 py-2 text-sm font-semibold text-gray-900"
              >
                {category.bannerCtaText}
                <ChevronRight className="h-4 w-4" />
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Fallback: Only desktop banner, show on mobile too */}
      {category.bannerImage && !category.bannerImageMobile && (
        <div className="relative md:hidden">
          <div className="relative aspect-[800/400] w-full">
            <Image
              src={category.bannerImage}
              alt={category.bannerTitle || category.name}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          </div>
          <div className="absolute inset-0 flex items-end pb-6">
            <div className="w-full px-4">
              <h1 className="text-2xl font-bold text-white">
                {category.bannerTitle || category.name}
              </h1>
              {category.bannerSubtitle && (
                <p className="mt-1 text-sm text-gray-200">
                  {category.bannerSubtitle}
                </p>
              )}
              {category.bannerCtaText && category.bannerCtaLink && (
                <Link
                  href={category.bannerCtaLink}
                  className="mt-4 inline-flex items-center gap-2 bg-white px-4 py-2 text-sm font-semibold text-gray-900"
                >
                  {category.bannerCtaText}
                  <ChevronRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
