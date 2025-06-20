import Layout from '@/components/layout/Layout'
import Link from 'next/link'

export const ProductVariantNotFound = () => {
  return (
    <Layout>
      <main className="py-8">
        <div className="py-12 text-center">
          <h1 className="mb-4 text-2xl font-bold text-gray-800">
            Producto no encontrado
          </h1>
          <p className="mb-6 text-gray-600">
            El producto o variante que estás buscando no existe o ha sido
            eliminado.
          </p>
          <div className="space-x-4">
            <Link
              href="/"
              className="inline-block rounded-lg bg-primary px-4 py-2 text-white transition-colors hover:bg-primary/90"
            >
              Volver al inicio
            </Link>
            <Link
              href="/search"
              className="inline-block rounded-lg bg-gray-200 px-4 py-2 text-gray-800 transition-colors hover:bg-gray-300"
            >
              Buscar productos
            </Link>
          </div>
        </div>
      </main>
    </Layout>
  )
}
