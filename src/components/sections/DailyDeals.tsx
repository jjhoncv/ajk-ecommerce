import { ProductSearchItem } from "@/backend/search";
import ProductCard from "@/components/ui/ProductCard";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import React from "react";

interface DailyDealsProps {
  bannerImage?: string;
  bannerTitle?: string;
  products: ProductSearchItem[];
}

const DailyDeals: React.FC<DailyDealsProps> = ({
  bannerImage = "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  bannerTitle = "Trae la naturaleza a tu hogar",
  products,
}) => {
  return (
    <section className="max-w-screen-4xl mx-auto px-12 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Mejores Ventas del Día</h2>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">Termina en:</span>
          <div className="flex gap-2">
            {["10d", "22h", "57m", "28s"].map((time, index) => (
              <div key={index} className="text-gray-700 px-0 py-1 rounded-lg">
                {index === 0 ? <></> : <span className="pr-2">:</span>}
                <span className="font-bold">{time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Banner */}
        <div className="md:col-span-2">
          <div className="relative rounded-lg overflow-hidden h-[400px] md:h-full">
            <Image
              src={bannerImage}
              alt="Daily Deals"
              fill
              sizes="(max-width: 768px) 100vw, 25vw"
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent p-6 flex flex-col justify-end">
              <h3 className="text-white text-2xl font-bold mb-2">
                {bannerTitle}
              </h3>
              <button className="border border-white text-white px-6 py-2 rounded-lg hover:bg-white hover:text-black transition-colors inline-flex items-center gap-2">
                Comprar ahora
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        <div className="md:col-span-10">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
            {products?.map((item) => (
              <ProductCard
                key={item.variantId || item.id}
                product={item}
              />
            )) || (
                <div className="col-span-4 text-center py-8 text-gray-500">
                  No hay ofertas disponibles
                </div>
              )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DailyDeals;
