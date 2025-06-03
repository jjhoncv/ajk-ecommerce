import React from "react";
import { ChevronRight } from "lucide-react";
import Image from "next/image";
import ProductCard from "@/components/ui/ProductCard";

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
              <ProductCard
                key={deal.id}
                product={{
                  product: {
                    id: Number(deal.id),
                    name: deal.name,
                    description: "",
                    brandId: 1,
                    brandName: "TechStore",
                    basePrice: deal.originalPrice,
                    minVariantPrice: deal.price,
                    categories: [],
                    variants: [
                      {
                        id: Number(deal.id),
                        productId: Number(deal.id),
                        sku: `SKU-${deal.id}`,
                        price: deal.price,
                        stock: deal.stock,
                        attributes: [],
                        images: [
                          {
                            id: 1,
                            variantId: Number(deal.id),
                            imageType: "front" as const,
                            imageUrlThumb: deal.image,
                            imageUrlNormal: deal.image,
                            imageUrlZoom: deal.image,
                            isPrimary: true,
                            displayOrder: 0,
                            altText: deal.name,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                          },
                        ],
                        attributeImages: [],
                        promotion:
                          deal.discount > 0
                            ? {
                                id: 1,
                                name: "Oferta del día",
                                discountType: "percentage" as const,
                                discountValue: deal.discount,
                                promotionPrice: deal.price,
                                startDate: new Date(),
                                endDate: new Date(),
                                stockLimit: null,
                              }
                            : undefined,
                      },
                    ],
                    mainImage: deal.image,
                  },
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DailyDeals;
