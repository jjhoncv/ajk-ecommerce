import { ShoppingBag } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

interface Category {
  id: number
  name: string
  slug: string
  imageUrl: string
  description: string
}

interface CategoriesProps {
  categories: Category[]
}

const Categories: React.FC<CategoriesProps> = ({ categories }) => {
  return (
    <section className="bg-gray-50 py-12">
      <div className="mx-auto max-w-screen-4xl px-12">
        <div className="mb-10 text-center">
          <div className="mb-4 flex items-center justify-center gap-3">
            <ShoppingBag className="h-8 w-8 text-primary" />
            <h2 className="font-roboto text-3xl font-bold text-gray-900">
              Explora Nuestras Categorías
            </h2>
          </div>
          <p className="mx-auto max-w-2xl font-roboto text-lg text-gray-600">
            Descubre la mejor tecnología organizada por categorías para
            encontrar exactamente lo que necesitas
          </p>
        </div>

        <div className="grid grid-cols-2 gap-6 md:grid-cols-4 lg:grid-cols-5">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categoria/${category.slug}`}
              className="group border border-gray-100 bg-white p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="flex flex-col items-center text-center">
                <div className="mb-4 rounded-full bg-gray-50 p-4 transition-colors group-hover:bg-primary/10">
                  {category.imageUrl === '' ? (
                    <Image
                      alt={category.name}
                      src="/no-image.webp"
                      width={60}
                      height={60}
                      className=""
                    />
                  ) : (
                    <Image
                      src={category.imageUrl}
                      width={60}
                      height={60}
                      alt={category.name}
                      className="transition-transform duration-300 group-hover:scale-110"
                    />
                  )}
                </div>
                <span className="text-sm font-semibold text-gray-800 transition-colors group-hover:text-primary">
                  {category.name}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Categories
