import { formatPrice } from "@/helpers/utils";
import Link from "next/link";
import { FC } from "react";

interface CartContentPurchaseProps {
  totalPrice: number
  onClose: () => void;
}

export const CartContentPurchase: FC<CartContentPurchaseProps> = ({ totalPrice }) => {
  return (
    <div className="border-t border-gray-200 p-4 mt-auto">
      <div className="flex justify-between mb-4">
        <span className="font-medium">Subtotal:</span>
        <span className="font-bold">{formatPrice(Number(totalPrice))}</span>
      </div>
      <Link href="/checkout"
        className="w-full flex justify-center bg-primary text-white py-3 hover:bg-primary/90 transition-colors"
      >
        Continuar
      </Link>
      <Link href="/cart"
        className="w-full flex justify-center mt-2 border border-gray-300 py-3 hover:bg-gray-50 transition-colors"
      >
        Ir al carrito
      </Link>
    </div>
  )
}
