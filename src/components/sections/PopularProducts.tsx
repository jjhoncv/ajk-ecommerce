import React from "react";
import Link from "next/link";
import Image from "next/image";
import { ChevronRight, Heart, Star } from "lucide-react";

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
}

const PopularProducts: React.FC<PopularProductsProps> = ({ products }) => {
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
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white border rounded-lg p-4 hover:shadow-lg transition-shadow border-gray-200"
          >
            <div className="relative mb-4">
              <Image
                src={product.image}
                alt={product.name}
                width={400}
                height={300}
                className="w-full h-48 object-cover rounded-lg"
              />
              <button className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100">
                <Heart className="h-4 w-4" />
              </button>
            </div>
            <h3 className="font-medium mb-1">{product.name}</h3>
            <div className="flex items-center mb-2">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${
                    i < Math.floor(product.rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="text-sm text-gray-500 ml-1">
                ({product.reviews})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold text-primary">
                S/ {product.price}
              </span>
              {product.originalPrice && (
                <span className="text-sm text-gray-500 line-through">
                  S/ {product.originalPrice}
                </span>
              )}
            </div>
            <button className="w-full mt-3 bg-secondary border-secondary border text-white py-2 rounded-lg hover:bg-transparent hover:border-secondary hover:border hover:text-secondary transition-colors">
              Agregar al carrito
            </button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default PopularProducts;
