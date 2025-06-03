import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { ProductDTO } from "@/dto";

interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  rating: number;
  reviews: number;
}

interface PopularProductsProps {
  products: Product[];
  // Agregar prop para productos hidratados
  hydratedProducts?: { product: ProductDTO }[];
}

const PopularProducts: React.FC<PopularProductsProps> = ({
  products,
  hydratedProducts,
}) => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Productos Populares</h2>
        <Link
          href="/populares"
          className="text-primary hover:text-secondary flex items-center gap-1"
        >
          Ver todos
          <ChevronRight className="h-4 w-4" />
        </Link>
      </div>
      <div className="grid grid-cols-5 gap-6">
        {hydratedProducts
          ? // Usar productos hidratados si están disponibles
            hydratedProducts.map((item) => (
              <ProductCard
                key={item.product.variants[0]?.id || item.product.id}
                product={item}
              />
            ))
          : // Fallback a productos simples
            products.map((product) => (
              <ProductCard
                key={product.id}
                product={{
                  product: {
                    id: Number(product.id),
                    name: product.name,
                    description: "",
                    brandId: 1,
                    brandName: "TechStore",
                    basePrice: product.originalPrice || product.price,
                    minVariantPrice: product.price,
                    categories: [],
                    variants: [
                      {
                        id: Number(product.id),
                        productId: Number(product.id),
                        sku: `SKU-${product.id}`,
                        price: product.price,
                        stock: 10,
                        attributes: [],
                        images: [
                          {
                            id: 1,
                            variantId: Number(product.id),
                            imageType: "front" as const,
                            imageUrlThumb: product.image,
                            imageUrlNormal: product.image,
                            imageUrlZoom: product.image,
                            isPrimary: true,
                            displayOrder: 0,
                            altText: product.name,
                            createdAt: new Date(),
                            updatedAt: new Date(),
                          },
                        ],
                        attributeImages: [],
                        ratings: {
                          totalRatings: product.reviews,
                          averageRating: product.rating,
                          fiveStar: 0,
                          fourStar: 0,
                          threeStar: 0,
                          twoStar: 0,
                          oneStar: 0,
                          verifiedPurchases: 0,
                        },
                      },
                    ],
                    mainImage: product.image,
                  },
                }}
              />
            ))}
      </div>
    </section>
  );
};

export default PopularProducts;
