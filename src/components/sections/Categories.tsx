import { MainCategory } from "@/services/mainCategories";
import { ShoppingBag } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface CategoriesProps {
  categories: MainCategory[];
}

const Categories: React.FC<CategoriesProps> = ({ categories }) => {
  return (
    <section className="py-12 bg-gray-50">
      <div className="text-center mb-10">
        <div className="flex items-center justify-center gap-3 mb-4">
          <ShoppingBag className="h-8 w-8 text-primary" />
          <h2 className="text-3xl font-bold text-gray-900">
            Explora Nuestras Categorías
          </h2>
        </div>
        <p className="text-gray-600 text-lg max-w-2xl mx-auto">
          Descubre la mejor tecnología organizada por categorías para encontrar exactamente lo que necesitas
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/categoria/${category.name.toLowerCase()}`}
            className="group bg-white  p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-gray-100"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 p-4 bg-gray-50 rounded-full group-hover:bg-primary/10 transition-colors">
                {category.image === null ? (
                  <Image
                    alt={category.name}
                    src="/no-image.webp"
                    width={60}
                    height={60}
                    className=""
                  />
                ) : (
                  <Image
                    src={category.image}
                    width={60}
                    height={60}
                    alt={category.name}
                    className=" group-hover:scale-110 transition-transform duration-300"
                  />
                )}
              </div>
              <span className="text-sm font-semibold text-gray-800 group-hover:text-primary transition-colors">
                {category.name}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;
