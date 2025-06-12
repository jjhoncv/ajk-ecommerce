import { ProductComplete } from "@/backend/product";
import ProductCard from "@/components/ui/ProductCard";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

interface PopularProductsProps {
  products: ProductComplete[]
}

const PopularProducts: React.FC<PopularProductsProps> = ({
  products,
}) => {

  return (
    <section className="max-w-screen-4xl mx-auto px-12 py-8">
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
      <div className="grid grid-cols-7 gap-6">
        {products?.map((item) => (
          <ProductCard
            key={item.variantId}
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
