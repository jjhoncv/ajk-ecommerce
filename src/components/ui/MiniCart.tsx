"use client";
import React from "react";
import { useCartContext } from "@/providers/CartProvider";
import SlidePage from "@/components/ui/SlidePage";
import CartContent from "@/components/ui/CartContent";
import Toast from "@/components/ui/Toast";

const MiniCart: React.FC = () => {
  const {
    items,
    totalPrice,
    removeItem,
    incrementQuantity,
    decrementQuantity,
    isCartOpen,
    closeCart,
    toastMessage,
  } = useCartContext();

  return (
    <>
      <SlidePage
        isOpen={isCartOpen}
        onClose={closeCart}
        title="Tu Carrito"
        direction="right"
        width={400}
      >
        <CartContent
          items={items}
          totalPrice={totalPrice}
          removeItem={removeItem}
          incrementQuantity={incrementQuantity}
          decrementQuantity={decrementQuantity}
          onClose={closeCart}
        />
      </SlidePage>
      {toastMessage && <Toast message={toastMessage} />}
    </>
  );
};

export default MiniCart;
