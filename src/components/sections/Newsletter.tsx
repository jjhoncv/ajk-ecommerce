import { siteConfig } from "@/config";
import Image from "next/image";
import React from "react";

const Newsletter: React.FC = () => {
  return (
    <section className="bg-gray-100 py-16">
      <div className="max-w-screen-4xl mx-auto px-12">
        <div className="bg-secondary  p-8 md:p-12 relative overflow-hidden">
          <div className="relative z-10 max-w-2xl">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Mantente en casa y consigue tu entrega diaria desde nuestra tienda
            </h2>
            <p className="text-gray-200 mb-8">
              Comienza tus compras diarias con {siteConfig.name}
            </p>
            <div className="flex gap-4">
              <div className="relative flex-1 max-w-md">
                <input
                  type="email"
                  placeholder="Tu dirección de email"
                  className="w-full px-4 py-3 "
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 bg-accent text-white px-6 py-2  hover:bg-accent/90 transition-colors">
                  Suscribirse
                </button>
              </div>
            </div>
          </div>
          <div className="absolute right-0 top-0 h-full w-1/3 hidden md:block">
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
  );
};

export default Newsletter;
