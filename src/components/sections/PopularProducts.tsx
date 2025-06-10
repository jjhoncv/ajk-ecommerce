import ProductCard from "@/components/ui/ProductCard";
import { ProductSearchItem } from "@/types/search";
import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";

interface PopularProductsProps {
  // Solo necesitamos productos hidratados
  popularProducts: ProductSearchItem[];
}

const PopularProducts: React.FC<PopularProductsProps> = ({
  popularProducts,
}) => {

  console.log("popularProducts", popularProducts)

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
        {popularProducts?.map((item) => (
          <ProductCard
            key={item.variants[0].id}
            product={{
              type: "variant",
              product: {
                productVariants: item.variants,
                name: item.name
              }
            }}

          // basePrice?: Maybe<Scalars['Float']['output']>;
          // brandId?: Maybe<Scalars['Int']['output']>;
          // brands?: Maybe<Array<Maybe<Brands>>>;
          // createdAt: Scalars['Timestamp']['output'];
          // description?: Maybe<Scalars['String']['output']>;
          // id: Scalars['Int']['output'];
          // name: Scalars['String']['output'];
          // productVariants?: Maybe<Array<Maybe<ProductVariants>>>;
          // updatedAt: Scalars['Timestamp']['output'];


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
