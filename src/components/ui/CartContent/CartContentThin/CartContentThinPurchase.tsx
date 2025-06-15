import { formatPrice } from "@/helpers/utils";
import Link from "next/link";
import { FC } from "react";

interface CartContentThinPurchaseProps {
  totalPrice: number
  onClose: () => void;
}

export const CartContentThinPurchase: FC<CartContentThinPurchaseProps> = ({ totalPrice }) => {
  return (
    <>
      <div>
        <div className="flex justify-center mb-2">
          {/* <span className="font-medium">Subtotal:</span> */}
          <span className="font-bold text-sm">{formatPrice(Number(totalPrice))}</span>
        </div>
        <Link href="/checkout"
          className="w-full flex justify-center bg-primary text-[15px] font-semibold text-white py-1.5 hover:bg-primary/90 transition-colors"
        >
          Continuar
        </Link>
        <Link href="/cart"
          className="w-full flex justify-center mt-2 border text-[15px] border-gray-300 font-semibold py-1.5 hover:bg-gray-50 transition-colors"
        >
          Ir al carrito
        </Link>
      </div>
      <div className="border-b border-gray-200"></div>
    </>




  )
}
