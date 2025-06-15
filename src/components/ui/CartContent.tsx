"use client";
import { PlusMinusButton } from "@/components/ui/PlusMinusButton";
import { formatPrice } from "@/helpers/utils";
import { CartItem } from "@/hooks/useCart";
import { ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import React, { JSX } from "react";

interface CartContentProps {
  items: CartItem[];
  totalPrice: number;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void
  onClose: () => void;
}

const CartContent: React.FC<CartContentProps> = ({
  items,
  totalPrice,
  removeItem,
  updateQuantity,
  onClose,
}): JSX.Element => {
  const hasNotItems = items.length === 0

  if (hasNotItems) {
    return (<div className="h-full flex">
      <div className="flex flex-col items-center justify-center flex-grow p-4">
        <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
        <p className="text-gray-500 text-center">
          Tu carrito está vacío. Agrega algunos productos para continuar.
        </p>
      </div>
    </div>)
  }

  return (
    <>
      <div className="flex flex-col h-full max-h-[calc(100%-179px)]">
        <div className="p-4 flex-grow overflow-auto">
          {items.map((item) => (
            <div key={item.id} className="flex border-b border-gray-100 py-4">
              <div className="w-20 h-20 relative flex-shrink-0">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <div className="ml-4 flex-grow">
                <h3 className="font-medium">{item.name}</h3>
                <p className="text-primary font-bold">{formatPrice(item.price)}</p>
                <div className="flex items-center mt-2">
                  <PlusMinusButton
                    stock={item.stock}
                    initialQuantity={item.quantity}
                    onQuantityChange={(quantity: number) => updateQuantity(item.id, quantity)}
                    size="sm"
                  />
                  <button
                    onClick={() => removeItem(item.id)}
                    className="ml-auto p-1 text-red-500 hover:bg-red-50 rounded-full"
                    aria-label="Eliminar producto"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="border-t border-gray-200 p-4 mt-auto">
        <div className="flex justify-between mb-4">
          <span className="font-medium">Subtotal:</span>
          <span className="font-bold">{formatPrice(Number(totalPrice))}</span>
        </div>
        <button className="w-full bg-primary text-white py-3 rounded-lg hover:bg-primary/90 transition-colors">
          Proceder al pago
        </button>
        <button
          onClick={onClose}
          className="w-full mt-2 border border-gray-300 py-3 rounded-lg hover:bg-gray-50 transition-colors"
        >
          Continuar comprando
        </button>
      </div>
    </>
  );
};

export default CartContent;
