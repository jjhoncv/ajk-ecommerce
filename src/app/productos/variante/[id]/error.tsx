'use client'

import Layout from '@/components/layout/Layout'
import Link from 'next/link'

interface ErrorPageProps {
    error: Error & { digest?: string }
    reset: () => void
}

export default function ProductVariantError({ error, reset }: ErrorPageProps) {
    return (
        <Layout>
            <main className="max-w-[1920px] mx-auto px-12 py-8">
                <div className="text-center py-12">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">
                        Error al cargar el producto
                    </h1>
                    <p className="text-gray-600 mb-6">
                        Ocurrió un error al intentar cargar la información del producto.
                        Por favor, inténtalo de nuevo más tarde.
                    </p>
                    <div className="space-x-4">
                        <button
                            onClick={reset}
                            className="bg-primary hover:bg-primary/90 text-white py-2 px-4 rounded-lg transition-colors"
                        >
                            Intentar de nuevo
                        </button>
                        <Link
                            href="/"
                            className="bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-lg transition-colors inline-block"
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
