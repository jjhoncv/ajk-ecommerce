import React from "react";
import { ChevronRight, Clock } from "lucide-react";
import Image from "next/image";

interface Deal {
  id: string;
  name: string;
  originalPrice: number;
  price: number;
  discount: number;
  image: string;
  timer: string;
  stock: number;
}

interface DailyDealsProps {
  deals: Deal[];
  bannerImage?: string;
  bannerTitle?: string;
}

const DailyDeals: React.FC<DailyDealsProps> = ({
  deals,
  bannerImage = "https://images.unsplash.com/photo-1542291026-7eec264c27ff",
  bannerTitle = "Trae la naturaleza a tu hogar",
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
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
        <div className="md:col-span-3">
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
        <div className="md:col-span-9">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {deals.map((deal) => (
              <div
                key={deal.id}
                className="bg-white border rounded-lg p-4 hover:shadow-lg transition-shadow border-gray-200"
              >
                <div className="relative aspect-square mb-4">
                  <Image
                    src={deal.image}
                    alt={deal.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover rounded-lg"
                  />
                  <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                    {deal.discount}% OFF
                  </span>
                </div>
                <h3 className="font-medium mb-2">{deal.name}</h3>
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-lg font-bold text-primary">
                    S/ {deal.price}
                  </span>
                  <span className="text-sm text-gray-500 line-through">
                    S/ {deal.originalPrice}
                  </span>
                </div>
                <div className="mb-3">
                  <div className="flex justify-between text-sm text-gray-600 mb-1">
                    <span>Vendidos: {30 - deal.stock}</span>
                    <span>Disponible: {deal.stock}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-secondary h-2 rounded-full"
                      style={{ width: `${((30 - deal.stock) / 30) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="flex items-center justify-center gap-2 text-sm font-medium text-gray-600 mb-3">
                  <Clock className="h-4 w-4" />
                  <span>Oferta termina en: {deal.timer}</span>
                </div>
                <button className="w-full bg-secondary border-secondary border text-white py-2 rounded-lg hover:bg-transparent hover:border-secondary hover:border hover:text-secondary transition-colors">
                  Agregar al carrito
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DailyDeals;
