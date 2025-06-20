import { siteConfig } from '@/config'
import Image from 'next/image'
import React from 'react'

const Newsletter: React.FC = () => {
  return (
    <section className="bg-gray-100 py-16">
      <div className="mx-auto max-w-screen-4xl px-12">
        <div className="relative overflow-hidden bg-secondary p-8 md:p-12">
          <div className="relative z-10 max-w-2xl">
            <h2 className="mb-4 text-3xl font-bold text-white md:text-4xl">
              Mantente en casa y consigue tu entrega diaria desde nuestra tienda
            </h2>
            <p className="mb-8 text-gray-200">
              Comienza tus compras diarias con {siteConfig.name}
            </p>
            <div className="flex gap-4">
              <div className="relative max-w-md flex-1">
                <input
                  type="email"
                  placeholder="Tu dirección de email"
                  className="w-full px-4 py-3"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent px-6 py-2 text-white transition-colors hover:bg-accent/90">
                  Suscribirse
                </button>
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-0 hidden h-full w-1/3 md:block">
            <Image
              src="https://images.unsplash.com/photo-1542838132-92c53300491e?w=400&h=400&fit=crop"
              alt="Delivery"
              width={500}
              height={500}
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </div>
    </section>
  )
}

export default Newsletter
