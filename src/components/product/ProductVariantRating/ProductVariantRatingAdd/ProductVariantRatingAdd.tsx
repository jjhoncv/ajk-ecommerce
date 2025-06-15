"use client";
import LoginForm from "@/components/ui/LoginForm";
import { Modal } from "@/components/ui/Modal";
import { ModalContent } from "@/components/ui/Modal/ModalContent";
import { ModalTitle } from "@/components/ui/Modal/ModalTitle";
import RegisterForm from "@/components/ui/RegisterForm";
import { ProductVariants, Products } from "@/types/domain";
import { useSession } from "next-auth/react";
import React from "react";
import { AuthPrompt } from "./AuthPrompt";
import { useAuthModals } from "./hooks/useAuthModals";
import { useVariantDisplay } from "./hooks/useVariantDisplay";
import { RatingForm } from "./RatingForm";

interface ProductVariantRatingAddProps {
  variant: ProductVariants;
  product: Products;
  onRatingAdded: () => void;
}

export const ProductVariantRatingAdd: React.FC<ProductVariantRatingAddProps> = ({
  variant,
  product,
  onRatingAdded
}) => {
  const { status } = useSession();
  const { getVariantDisplayName } = useVariantDisplay(variant, product);
  const {
    isLoginModalOpen,
    isRegisterModalOpen,
    openLoginModal,
    openRegisterModal,
    closeAllModals,
    switchToRegister,
    switchToLogin,
  } = useAuthModals();

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="bg-gray-50 p-4 rounded-lg text-center">
          <p className="text-gray-500">Cargando...</p>
        </div>
      );
    }

    if (!isAuthenticated) {
      return (
        <AuthPrompt
          onLogin={openLoginModal}
          onRegister={openRegisterModal}
        />
      );
    }

    return (
      <RatingForm
        variant={variant}
        productName={product.name}
        onRatingAdded={onRatingAdded}
      />
    );
  };

  return (
    <div className="pt-6 mt-8">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Deja tu valoración</h2>
        <div className="text-sm text-gray-600">
          Producto: <span className="font-medium">{getVariantDisplayName()}</span>
        </div>
      </div>

      {renderContent()}

      {/* Modal de login */}
      <Modal
        isOpen={isLoginModalOpen}
        onClose={closeAllModals}
      >
        <ModalTitle onClose={closeAllModals} title="Iniciar sesión" />
        <ModalContent>
          <LoginForm
            onSuccess={closeAllModals}
            onClose={closeAllModals}
            onSwitchToRegister={switchToRegister}
          />
        </ModalContent>
      </Modal>

      {/* Modal de registro */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={closeAllModals}
      >
        <ModalTitle onClose={closeAllModals} title="Crear cuenta" />
        <ModalContent>
          <RegisterForm
            onSuccess={closeAllModals}
            onClose={closeAllModals}
            onSwitchToLogin={switchToLogin}
          />
        </ModalContent>
      </Modal>
    </div>
  );
};