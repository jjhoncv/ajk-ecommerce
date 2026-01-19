import { type FeaturedCategory } from '@/module/categories/services/featuredCategories'
import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface FeaturedCategoriesProps {
  categories: FeaturedCategory[]
}

const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({
  categories
}) => {
  return (
    <section className="mx-auto max-w-screen-4xl px-12 py-8">
      <h2 className="mb-6 text-2xl font-bold">Categorías Destacadas</h2>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {categories.map((category, index) => (
          <div key={index} className="group relative h-48 overflow-hidden">
            <Image
              src={category.image ? category.image : '/no-image.webp'}
              alt={category.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
              priority={index < 2}
            />

            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-r from-black/70 to-transparent p-6">
              <h3 className="mb-1 text-xl font-bold text-white">
                {category.title}
              </h3>
              <p className="text-gray-200">{category.subtitle}</p>
              <Link
                href={
                  category.link ||
                  `/categoria/${category.title
                    .toLowerCase()
                    .replace(/\s+/g, '-')}`
                }
                className="mt-4 inline-flex w-fit items-center gap-2 border border-white px-4 py-2 text-white transition-colors hover:bg-white hover:text-black"
              >
                Comprar ahora
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default FeaturedCategories
