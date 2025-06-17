import { CartItem } from "@/hooks/useCart"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { FC } from "react"

interface CartPageHeaderProps {
  items: CartItem[]
}

export const CartPageHeader: FC<CartPageHeaderProps> = ({ items }) => {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-4 mb-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Continuar comprando
        </Link>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Carrito de Compras</h1>
        <div className="text-sm text-gray-600">
          {items.length} {items.length === 1 ? 'producto' : 'productos'} en tu carrito
        </div>
      </div>
    </div>
  )
}
