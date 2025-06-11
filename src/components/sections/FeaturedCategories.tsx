import { ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface FeaturedCategory {
  title: string;
  subtitle: string;
  image: string;
  link?: string;
}

interface FeaturedCategoriesProps {
  categories: FeaturedCategory[];
}

const FeaturedCategories: React.FC<FeaturedCategoriesProps> = ({
  categories,
}) => {
  return (
    <section className="max-w-screen-4xl mx-auto px-12 py-8">
      <h2 className="text-2xl font-bold mb-6">Categorías Destacadas</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {categories.map((category, index) => (
          <div
            key={index}
            className="relative rounded-lg overflow-hidden group h-48"
          >
            <Image
              src={category.image}
              alt={category.title}
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover"
              priority={index < 2}
            />
            <div className="absolute inset-0 bg-gradient-to-r from-black/70 to-transparent p-6 flex flex-col justify-end">
              <h3 className="text-white text-xl font-bold mb-1">
                {category.title}
              </h3>
              <p className="text-gray-200">{category.subtitle}</p>
              <Link
                href={
                  category.link ||
                  `/categoria/${category.title
                    .toLowerCase()
                    .replace(/\s+/g, "-")}`
                }
                className="mt-4 px-4 py-2 text-white border border-white rounded-lg 
                  hover:bg-white hover:text-black transition-colors inline-flex items-center gap-2 w-fit"
              >
                Comprar ahora
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default FeaturedCategories;
