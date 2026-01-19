import { ArrowLeft, ShoppingBag } from 'lucide-react'
import Link from 'next/link'

export const CartPageEmpty = () => {
  return (
    <div className="mx-auto max-w-screen-4xl px-12 py-16">
      <div className="text-center">
        <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-gray-100">
          <ShoppingBag className="h-12 w-12 text-gray-400" />
        </div>
        <h1 className="mb-4 text-3xl font-bold text-gray-900">
          Tu carrito está vacío
        </h1>
        <p className="mx-auto mb-8 max-w-md text-gray-600">
          Parece que aún no has agregado ningún producto a tu carrito. ¡Explora
          nuestros productos y encuentra algo que te guste!
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary px-8 py-3 font-medium text-white transition-colors hover:bg-primary-700"
        >
          <ArrowLeft className="h-5 w-5" />
          Continuar comprando
        </Link>
      </div>
    </div>
  )
}
