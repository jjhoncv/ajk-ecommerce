import React from "react";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import TopBar from "@/components/layout/TopBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { getHomeData } from "@/services/homeService";
import { Heart, ShoppingCart, Trash2 } from "lucide-react";

// Datos de ejemplo para productos favoritos
const mockFavorites = [
  {
    id: "prod-1",
    name: "Laptop Ultrabook Pro",
    price: 3499.99,
    image: "https://placehold.co/600x400/e2e8f0/1e293b?text=Laptop",
    rating: 4.8,
    reviews: 124,
  },
  {
    id: "prod-2",
    name: "Smartphone Galaxy X",
    price: 1299.99,
    image: "https://placehold.co/600x400/e2e8f0/1e293b?text=Smartphone",
    rating: 4.5,
    reviews: 89,
  },
  {
    id: "prod-3",
    name: "Auriculares Inalámbricos",
    price: 249.99,
    image: "https://placehold.co/600x400/e2e8f0/1e293b?text=Auriculares",
    rating: 4.7,
    reviews: 56,
  },
  {
    id: "prod-4",
    name: "Smartwatch Series 5",
    price: 399.99,
    image: "https://placehold.co/600x400/e2e8f0/1e293b?text=Smartwatch",
    rating: 4.6,
    reviews: 42,
  },
];

export default async function FavoritesPage() {
  // Obtener la sesión del usuario
  const session = await getServerSession();

  // Si no hay sesión, redirigir al inicio
  // Esto es una doble verificación, ya que el middleware debería manejar esto
  if (!session) {
    redirect("/");
  }

  // Obtener datos para el header y footer
  const data = await getHomeData();

  return (
    <div className="min-h-screen bg-white">
      <TopBar />
      <Header megaMenuCategories={data.megaMenuCategories} />

      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Mis Favoritos</h1>
          <p className="text-gray-600">{mockFavorites.length} productos</p>
        </div>

        {mockFavorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {mockFavorites.map((product) => (
              <div
                key={product.id}
                className="bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover"
                  />
                  <button
                    className="absolute top-2 right-2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-red-50"
                    aria-label="Eliminar de favoritos"
                  >
                    <Trash2 className="h-4 w-4 text-red-500" />
                  </button>
                </div>

                <div className="p-4">
                  <h3 className="font-medium text-gray-900 mb-1">
                    {product.name}
                  </h3>

                  <div className="flex items-center mb-2">
                    <div className="flex items-center">
                      {[...Array(5)].map((_, i) => (
                        <svg
                          key={i}
                          className={`h-4 w-4 ${
                            i < Math.floor(product.rating)
                              ? "text-yellow-400 fill-yellow-400"
                              : "text-gray-300"
                          }`}
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                        >
                          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-sm text-gray-500 ml-1">
                      ({product.reviews})
                    </span>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="text-lg font-bold text-primary">
                      S/ {product.price.toFixed(2)}
                    </span>
                    <button className="flex items-center justify-center p-2 bg-secondary text-white rounded-full hover:bg-secondary/90">
                      <ShoppingCart className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white shadow-md rounded-lg p-8 text-center">
            <Heart className="h-12 w-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No tienes productos favoritos
            </h3>
            <p className="text-gray-500 mb-4">
              Agrega productos a tus favoritos para verlos aquí.
            </p>
            <button className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary">
              Explorar productos
            </button>
          </div>
        )}
      </main>

      <Footer sections={data.footerSections} socialLinks={data.socialLinks} />
    </div>
  );
}
