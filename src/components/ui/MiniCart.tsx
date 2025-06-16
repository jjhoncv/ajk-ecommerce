"use client";
import { CartContentThin } from "@/components/ui/CartContent/CartContentThin";
import { Modal } from "@/components/ui/Modal";
import { ModalContent } from "@/components/ui/Modal/ModalContent";
import { ModalTitle } from "@/components/ui/Modal/ModalTitle";
import SidePage from "@/components/ui/SidePage";
import Toast from "@/components/ui/Toast";
import { useCartContext } from "@/providers/CartProvider";
import React, { useState } from "react";

const MiniCart: React.FC = () => {
  const {
    items,
    totalPrice,
    updateQuantity,
    removeItem, // 👈 Asegúrate de incluir esto
    isCartOpen,
    closeCart,
    toastMessage,
  } = useCartContext();

  // Estados para el modal de confirmación
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<{ id: number; name: string } | null>(null);

  // Función para mostrar el modal de confirmación
  const handleDeleteConfirmation = (id: number, name: string) => {
    setProductToDelete({ id, name });
    setIsDeleteModalOpen(true);
  };

  // 👈 Aquí está la función confirmDelete
  const confirmDelete = () => {
    if (productToDelete) {
      removeItem(productToDelete.id); // Elimina el item del carrito
      setIsDeleteModalOpen(false);    // Cierra el modal
      setProductToDelete(null);       // Limpia el estado
    }
  };

  // Función para cancelar la eliminación
  const cancelDelete = () => {
    setIsDeleteModalOpen(false);
    setProductToDelete(null);
  };

  return (
    <>
      <SidePage
        isOpen={isCartOpen}
        direction="right"
        width={215}
      >
        <CartContentThin
          items={items}
          totalPrice={totalPrice}
          updateQuantity={updateQuantity}
          onDelete={handleDeleteConfirmation} // Pasa la función para mostrar confirmación
          onClose={closeCart}
        />
      </SidePage>

      {toastMessage && <Toast message={toastMessage} />}

      {/* Modal de confirmación */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={cancelDelete}
      >
        <ModalTitle
          onClose={cancelDelete}
          title="Eliminar producto"
        />
        <ModalContent>
          <div className="space-y-4">
            <p className="text-gray-700">
              ¿Estás seguro de eliminar <strong>{productToDelete?.name}</strong> del carrito?
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 border border-gray-300 hover:bg-gray-50 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete} // 👈 Aquí se llama la función
                className="px-4 py-2 bg-primary text-white hover:bg-red-700 transition-colors"
              >
                Sí, eliminar
              </button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
};

export default MiniCart;