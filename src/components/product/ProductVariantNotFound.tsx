import Layout from "@/components/layout/Layout"
import Link from "next/link"

export const ProductVariantNotFound = () => {
  return (
    <Layout>
      <main className="max-w-[1920px] mx-auto px-12 py-8">
        <div className="text-center py-12">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Producto no encontrado
          </h1>
          <p className="text-gray-600 mb-6">
            El producto o variante que estás buscando no existe o ha sido eliminado.
          </p>
          <div className="space-x-4">
            <Link
              href="/"
              className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-lg transition-colors inline-block"
            >
              Volver al inicio
            </Link>
            <Link
              href="/search"
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors inline-block"
            >
              Buscar productos
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  )
}
