import React from "react";
import Link from "next/link";
import { Category } from "@/types/navigation";

interface CategoriesProps {
  categories: Category[];
}

const Categories: React.FC<CategoriesProps> = ({ categories }) => {
  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Comprar por Categorías</h2>
      <div className="grid grid-cols-8 gap-4">
        {categories.map((category) => (
          <Link
            key={category.name}
            href={`/categoria/${category.name.toLowerCase()}`}
            className="flex flex-col items-center p-4 rounded-lg hover:shadow-md transition-shadow group"
          >
            <div
              className="w-20 h-20 rounded-lg flex items-center justify-center text-3xl mb-3"
              style={{ backgroundColor: category.bg }}
            >
              {category.icon}
            </div>
            <span className="text-sm font-medium text-center">
              {category.name}
            </span>
          </Link>
        ))}
      </div>
    </section>
  );
};

export default Categories;
