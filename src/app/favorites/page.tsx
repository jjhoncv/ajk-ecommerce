import React from 'react'
import { getServerSession } from 'next-auth'
import { redirect } from 'next/navigation'
import TopBar from '@/components/layout/TopBar'
import Header from '@/components/layout/Header'
import Footer from '@/components/layout/Footer'
import { getHomeData } from '@/services/homeService'
import { Heart, ShoppingCart, Trash2 } from 'lucide-react'

// Datos de ejemplo para productos favoritos
const mockFavorites = [
  {
    id: 'prod-1',
    name: 'Laptop Ultrabook Pro',
    price: 3499.99,
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Laptop',
    rating: 4.8,
    reviews: 124
  },
  {
    id: 'prod-2',
    name: 'Smartphone Galaxy X',
    price: 1299.99,
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Smartphone',
    rating: 4.5,
    reviews: 89
  },
  {
    id: 'prod-3',
    name: 'Auriculares Inalámbricos',
    price: 249.99,
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Auriculares',
    rating: 4.7,
    reviews: 56
  },
  {
    id: 'prod-4',
    name: 'Smartwatch Series 5',
    price: 399.99,
    image: 'https://placehold.co/600x400/e2e8f0/1e293b?text=Smartwatch',
    rating: 4.6,
    reviews: 42
  }
]

export default async function FavoritesPage() {
  // Obtener la sesión del usuario
  const session = await getServerSession()

  // Si no hay sesión, redirigir al inicio
  // Esto es una doble verificación, ya que el middleware debería manejar esto
  if (!session) {
    redirect('/')
  }

  // Obtener datos para el header y footer
  const data = await getHomeData()

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header megaMenuCategories={data.megaMenuCategories} />

      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Mis Favoritos</h1>
          <p className="text-gray-600">{mockFavorites.length} productos</p>
        </div>

        {mockFavorites.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
            {mockFavorites.map((product) => (
              <div
                key={product.id}
                className="overflow-hidden rounded-lg border bg-white transition-shadow hover:shadow-lg"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-48 w-full object-cover"
                  />
                  <button
                    className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-md hover:bg-red-50"
                    aria-label="Eliminar de favoritos"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="mb-1 font-medium text-gray-900">
                    {product.name}
                  </h3>

                  <div className="mb-2 flex items-center">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? 'fill-yellow-400 text-yellow-400'
                              : 'text-gray-300'
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <span className="ml-1 text-sm text-gray-500">
                      ({product.reviews})
                    </span>
                  </div>

                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-lg font-bold text-primary">
                      S/ {product.price.toFixed(2)}
                    </span>
                    <button className="flex items-center justify-center rounded-full bg-secondary p-2 text-white hover:bg-secondary/90">
                      <ShoppingCart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-lg bg-white p-8 text-center shadow-md">
            <Heart className="mx-auto mb-4 h-12 w-12 text-gray-400" />
            <h3 className="mb-2 text-lg font-medium text-gray-900">
              No tienes productos favoritos
            </h3>
            <p className="mb-4 text-gray-500">
              Agrega productos a tus favoritos para verlos aquí.
            </p>
            <button className="inline-flex items-center rounded-md border border-transparent bg-primary px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2">
              Explorar productos
            </button>
          </div>
        )}
      </main>

      <Footer sections={data.footerSections} socialLinks={data.socialLinks} />
    </div>
  )
}
