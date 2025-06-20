import { formatPrice } from '@/helpers/utils'
import Link from 'next/link'
import { FC } from 'react'

interface CartContentPurchaseProps {
  totalPrice: number
  onClose: () => void
}

export const CartContentPurchase: FC<CartContentPurchaseProps> = ({
  totalPrice
}) => {
  return (
    <div className="mt-auto border-t border-gray-200 p-4">
      <div className="mb-4 flex justify-between">
        <span className="font-medium">Subtotal:</span>
        <span className="font-bold">{formatPrice(Number(totalPrice))}</span>
      </div>
      <Link
        href="/checkout"
        className="flex w-full justify-center bg-primary py-3 text-white transition-colors hover:bg-primary/90"
      >
        Continuar
      </Link>
      <Link
        href="/cart"
        className="mt-2 flex w-full justify-center border border-gray-300 py-3 transition-colors hover:bg-gray-50"
      >
        Ir al carrito
      </Link>
    </div>
  )
}
