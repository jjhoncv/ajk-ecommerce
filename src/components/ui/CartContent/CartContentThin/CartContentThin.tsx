"use client";
import { CartContentThinEmpty } from "./CartContentThinEmpty";
import { CartContentThinItem } from "./CartContentThinItem";
import { CartContentThinPurchase } from "./CartContentThinPurchase";

import { CartItem } from "@/hooks/useCart";
import React, { JSX } from "react";

interface CartContentThinProps {
  items: CartItem[];
  totalPrice: number;
  updateQuantity: (id: number, quantity: number) => void;
  onDelete: (id: number) => void; // Nueva prop
  onClose: () => void;
}

export const CartContentThin: React.FC<CartContentThinProps> = ({
  items,
  totalPrice,
  updateQuantity,
  onDelete,
  onClose
}): JSX.Element => {
  const hasNotItems = items.length === 0

  if (hasNotItems) {
    return <CartContentThinEmpty />
  }

  return (
    <div className="h-full flex flex-col overflow-hidden gap-4 p-4">
      <CartContentThinPurchase onClose={onClose} totalPrice={totalPrice} />
      <div className="flex flex-col h-full max-h-[calc(100%-144px)] overflow-y-auto">
        <div className="grid grid-cols-2 gap-4 gap-y-5">
          {items.map((item) => (
            <CartContentThinItem
              key={item.id}
              item={item}
              updateQuantity={updateQuantity}
              onDelete={onDelete} // Pasar la función
            />
          ))}
        </div>
      </div>
    </div>
  );
};

