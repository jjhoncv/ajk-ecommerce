import { type ProductSearchItem } from '@/module/search/core'
import ProductCard from '@/components/ui/ProductCard'
import { ChevronRight } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

interface DailyDealsProps {
  bannerImage?: string
  bannerTitle?: string
  products: ProductSearchItem[]
}

const DailyDeals: React.FC<DailyDealsProps> = ({
  bannerImage = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff',
  bannerTitle = 'Trae la naturaleza a tu hogar',
  products
}) => {
  return (
    <section className="mx-auto max-w-screen-4xl px-12 py-8">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl font-bold">Mejores Ventas del Día</h2>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Termina en:</span>
          <div className="flex gap-2">
            {['10d', '22h', '57m', '28s'].map((time, index) => (
              <div key={index} className="px-0 py-1 text-gray-700">
                {index === 0 ? <></> : <span className="pr-2">:</span>}
                <span className="font-bold">{time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        {/* Banner */}
        <div className="md:col-span-2">
          <div className="relative h-[400px] overflow-hidden md:h-full">
            <Image
              src={bannerImage}
              alt="Daily Deals"
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/80 to-transparent p-6">
              <h3 className="mb-2 text-2xl font-bold text-white">
                {bannerTitle}
              </h3>
              <button className="inline-flex items-center gap-2 border border-white px-6 py-2 text-white transition-colors hover:bg-white hover:text-black">
                Comprar ahora
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="md:col-span-10">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
            {products?.map((item) => (
              <ProductCard key={item.variantId || item.id} product={item} />
            )) || (
              <div className="col-span-4 py-8 text-center text-gray-500">
                No hay ofertas disponibles
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default DailyDeals
