"use client";
import CartContent from "@/components/ui/CartContent";
import SlidePage from "@/components/ui/SlidePage";
import Toast from "@/components/ui/Toast";
import { useCartContext } from "@/providers/CartProvider";
import React from "react";

const MiniCart: React.FC = () => {
  const {
    items,
    totalPrice,
    removeItem,
    updateQuantity,
    isCartOpen,
    closeCart,
    toastMessage,
  } = useCartContext();

  return (
    <>
      <SlidePage
        isOpen={isCartOpen}
        onClose={closeCart}
        // title="Tu Carrito"
        direction="right"
        width={400}

      >
        <CartContent
          items={items}
          totalPrice={totalPrice}
          removeItem={removeItem}
          updateQuantity={updateQuantity}
          onClose={closeCart}
        />
      </SlidePage>
      {toastMessage && <Toast message={toastMessage} />}
    </>
  );
};

export default MiniCart;
