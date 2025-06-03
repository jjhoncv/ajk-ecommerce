import React from "react";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import ProductCard from "@/components/ui/ProductCard";
import { ProductDTO } from "@/dto";

interface PopularProductsProps {
  // Solo necesitamos productos hidratados
  hydratedProducts: { product: ProductDTO }[];
}

const PopularProducts: React.FC<PopularProductsProps> = ({
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
        {hydratedProducts?.map((item) => (
          <ProductCard
            key={item.product.variants[0]?.id || item.product.id}
            product={item}
          />
        )) || (
          <div className="col-span-5 text-center py-8 text-gray-500">
            No hay productos disponibles
          </div>
        )}
      </div>
    </section>
  );
};

export default PopularProducts;
