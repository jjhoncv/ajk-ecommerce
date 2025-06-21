import { formatPrice } from '@/helpers/utils'
import Link from 'next/link'
import { type FC } from 'react'

interface CartContentThinPurchaseProps {
  totalPrice: number
  onClose: () => void
}

export const CartContentThinPurchase: FC<CartContentThinPurchaseProps> = ({
  totalPrice
}) => {
  return (
    <>
      <div>
        <div className="mb-2 flex justify-center">
          {/* <span className="font-medium">Subtotal:</span> */}
          <span className="text-sm font-bold">
            {formatPrice(Number(totalPrice))}
          </span>
        </div>
        <Link
          href="/checkout"
          className="flex w-full justify-center bg-primary py-1.5 text-[15px] font-semibold text-white transition-colors hover:bg-primary/90"
        >
          Continuar
        </Link>
        <Link
          href="/cart"
          className="mt-2 flex w-full justify-center border border-gray-300 py-1.5 text-[15px] font-semibold transition-colors hover:bg-gray-50"
        >
          Ir al carrito
        </Link>
      </div>
      <div className="border-b border-gray-200"></div>
    </>
  )
}
