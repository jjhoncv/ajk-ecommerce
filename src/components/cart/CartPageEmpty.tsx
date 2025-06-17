import { ArrowLeft, ShoppingBag } from "lucide-react"
import Link from "next/link"

export const CartPageEmpty = () => {
  return (
    <div className="max-w-screen-4xl mx-auto px-12 py-16">
      <div className="text-center">
        <div className="mx-auto mb-8 w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center">
          <ShoppingBag className="w-12 h-12 text-gray-400" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Tu carrito está vacío</h1>
        <p className="text-gray-600 mb-8 max-w-md mx-auto">
          Parece que aún no has agregado ningún producto a tu carrito.
          ¡Explora nuestros productos y encuentra algo que te guste!
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 bg-primary text-white px-8 py-3 hover:bg-primary-700 transition-colors font-medium"
        >
          <ArrowLeft className="w-5 h-5" />
          Continuar comprando
        </Link>
      </div>
    </div>
  )
}
