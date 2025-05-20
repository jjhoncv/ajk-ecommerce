import React from "react";
import Link from "next/link";
import { Category } from "@/types/navigation";

interface CategoriesProps {
  categories: Category[];
}

const Categories: React.FC<CategoriesProps> = ({ categories }) => {
  // Función para obtener la clase de color de fondo basada en el índice
  const getBgColorClass = (index: number) => {
    const colorClasses = [
      "bg-red-100",
      "bg-blue-100",
      "bg-purple-100",
      "bg-green-100",
      "bg-yellow-100",
      "bg-pink-100",
      "bg-indigo-100",
      "bg-sky-100",
    ];
    return colorClasses[index % colorClasses.length];
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">Comprar por Categorías</h2>
      <div className="grid grid-cols-8 gap-4">
        {categories.map((category, index) => (
          <Link
            key={category.name}
            href={`/categoria/${category.name.toLowerCase()}`}
            className="flex flex-col items-center p-4 rounded-lg hover:shadow-md transition-shadow group"
          >
            <div
              className={`w-20 h-20 rounded-lg flex items-center justify-center text-3xl mb-3 ${getBgColorClass(
                index
              )}`}
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
