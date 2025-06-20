'use client'
import { CartContentThin } from '@/components/ui/CartContent/CartContentThin'
import { Modal } from '@/components/ui/Modal'
import { ModalContent } from '@/components/ui/Modal/ModalContent'
import { ModalTitle } from '@/components/ui/Modal/ModalTitle'
import SidePage from '@/components/ui/SidePage'
import Toast from '@/components/ui/Toast'
import { useCartContext } from '@/providers/cart'
import React from 'react'

const MiniCart: React.FC = () => {
  const {
    items,
    totalPrice,
    updateQuantity,
    isCartOpen,
    closeCart,
    toastMessage,
    canShowMinicart, // 👈 Tu función del hook
    deleteConfirmation,
    openDeleteConfirmation,
    closeDeleteConfirmation,
    confirmDelete
  } = useCartContext()

  return (
    <>
      {canShowMinicart() && (
        <SidePage
          closeOnClickOutside={false}
          onClose={closeCart}
          isOpen={isCartOpen}
          direction="right"
          width={215}
        >
          <CartContentThin
            items={items}
            totalPrice={totalPrice}
            updateQuantity={updateQuantity}
            onDelete={openDeleteConfirmation} // 👈 Usar la función del provider
            onClose={closeCart}
          />
        </SidePage>
      )}

      {toastMessage && <Toast message={toastMessage} position="bottom-right" />}

      {/* 👈 MODAL DE CONFIRMACIÓN */}
      <Modal
        isOpen={deleteConfirmation.isOpen}
        onClose={closeDeleteConfirmation}
        className="p-4 pt-4"
      >
        <ModalTitle onClose={closeDeleteConfirmation} className="mb-5 p-0">
          <p className="pl-2 font-bold">Quitar articulo</p>
        </ModalTitle>
        <ModalContent className="p-0">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div>
                <p className="text-sm text-gray-700">
                  {deleteConfirmation.message ||
                    `¿Estás seguro de que quieres eliminar el artículo de tu cesta?`}
                </p>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <button
                onClick={closeDeleteConfirmation}
                className="font-semibol border border-gray-300 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="bg-red-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-red-700"
              >
                Quitar
              </button>
            </div>
          </div>
        </ModalContent>
      </Modal>
    </>
  )
}

export default MiniCart
