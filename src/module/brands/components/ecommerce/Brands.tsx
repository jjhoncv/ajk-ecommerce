import { type Brand } from '@/module/brands/service/brand/types'
import Image from 'next/image'
import React from 'react'

interface BrandsProps {
  brands: Brand[]
}

const Brands: React.FC<BrandsProps> = ({ brands }) => {
  // No mostrar la sección si no hay marcas
  if (!brands || brands.length === 0) {
    return null
  }

  return (
    <section className="mx-auto max-w-screen-4xl px-12 py-8">
      <h2 className="mb-6 text-2xl font-bold">Nuestras Marcas</h2>
      <div className="grid grid-cols-3 gap-6 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8">
        {brands.map((brand) => (
          <div
            key={brand.id}
            className="group flex items-center justify-center rounded-lg border border-gray-200 bg-white p-4 transition-shadow hover:shadow-md"
          >
            {brand.imageUrl ? (
              <Image
                src={brand.imageUrl}
                alt={brand.name}
                width={80}
                height={80}
                className="h-16 w-auto object-contain grayscale transition-all group-hover:grayscale-0"
              />
            ) : (
              <span className="text-center text-sm font-medium text-gray-600">
                {brand.name}
              </span>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}

export default Brands
