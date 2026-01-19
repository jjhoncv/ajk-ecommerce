import { type CartItem } from '@/module/cart/hooks/useCart/useCart'
import { ArrowLeft } from 'lucide-react'
import Link from 'next/link'
import { type FC } from 'react'

interface CartPageHeaderProps {
  items: CartItem[]
}

export const CartPageHeader: FC<CartPageHeaderProps> = ({ items }) => {
  return (
    <div className="mb-8">
      <div className="mb-4 flex items-center gap-4">
        <Link
          href="/"
          className="flex items-center gap-2 text-gray-600 transition-colors hover:text-gray-900"
        >
          <ArrowLeft className="h-5 w-5" />
          Continuar comprando
        </Link>
      </div>
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Carrito de Compras</h1>
        <div className="text-sm text-gray-600">
          {items.length} {items.length === 1 ? 'producto' : 'productos'} en tu
          carrito
        </div>
      </div>
    </div>
  )
}
