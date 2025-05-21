"use client";
import React from "react";
import Image from "next/image";
import { Plus, Minus, Trash2, ShoppingBag } from "lucide-react";
import { CartItem } from "@/hooks/useCart";

interface CartContentProps {
  items: CartItem[];
  totalPrice: number;
  removeItem: (id: string) => void;
  incrementQuantity: (id: string) => void;
  decrementQuantity: (id: string) => void;
  onClose: () => void;
}

const CartContent: React.FC<CartContentProps> = ({
  items,
  totalPrice,
  removeItem,
  incrementQuantity,
  decrementQuantity,
  onClose,
}) => {
  return (
    <div className="flex flex-col h-full">
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center flex-grow p-4">
          <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
          <p className="text-gray-500 text-center">
            Tu carrito está vacío. Agrega algunos productos para continuar.
          </p>
        </div>
      ) : (
        <>
          <div className="p-4 flex-grow overflow-auto">
            {items.map((item) => (
              <div key={item.id} className="flex border-b border-gray-100 py-4">
                <div className="w-20 h-20 relative flex-shrink-0">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="80px"
                    className="object-cover rounded-md"
                  />
                </div>
                <div className="ml-4 flex-grow">
                  <h3 className="font-medium">{item.name}</h3>
                  <p className="text-primary font-bold">S/ {item.price}</p>
                  <div className="flex items-center mt-2">
                    <button
                      onClick={() => decrementQuantity(item.id)}
                      className="p-1 border border-gray-300 rounded-l-md hover:bg-gray-100"
                      aria-label="Disminuir cantidad"
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <span className="px-3 py-1 border-t border-b border-gray-300">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => incrementQuantity(item.id)}
                      className="p-1 border border-gray-300 rounded-r-md hover:bg-gray-100"
                      aria-label="Aumentar cantidad"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
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

          <div className="border-t border-gray-200 p-4 mt-auto">
            <div className="flex justify-between mb-4">
              <span className="font-medium">Subtotal:</span>
              <span className="font-bold">S/ {totalPrice.toFixed(2)}</span>
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
      )}
    </div>
  );
};

export default CartContent;
