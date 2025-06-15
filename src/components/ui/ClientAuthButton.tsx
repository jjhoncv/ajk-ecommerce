"use client";
import { ModalContent } from "@/components/ui/Modal/ModalContent";
import { ModalTitle } from "@/components/ui/Modal/ModalTitle";
import { User } from "lucide-react";
import { Session } from "next-auth";
import React, { useState } from "react";
import LoginForm from "./LoginForm";
import { Modal } from "./Modal";
import RegisterForm from "./RegisterForm";
import UserMenu from "./UserMenu";

interface ClientAuthButtonProps {
  isAuthenticated: boolean;
  userName: string;
  userEmail: string;
  userId: string;
}

const ClientAuthButton: React.FC<ClientAuthButtonProps> = ({
  isAuthenticated,
  userName,
  userEmail,
  userId,
}) => {
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Crear un objeto de sesión para pasar al UserMenu
  const sessionData: Session = {
    user: {
      id: userId,
      name: userName,
      email: userEmail,
    },
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(), // 30 días
  };

  const handleAuthClick = () => {
    if (isAuthenticated) {
      setIsUserMenuOpen(true);
    } else {
      setIsLoginModalOpen(true);
    }
  };

  return (
    <>
      <button
        onClick={handleAuthClick}
        className="flex flex-col items-center relative"
      >
        <User className="h-6 w-6" />
        <span className="text-xs mt-1">
          {isAuthenticated ? "Mi cuenta" : "Iniciar sesión"}
        </span>
      </button>

      {/* Modal de login */}
      <Modal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      >
        <ModalTitle onClose={() => { setIsLoginModalOpen(false) }} title="Iniciar sesión" />
        <ModalContent>
          <LoginForm
            onSuccess={() => {
              setIsLoginModalOpen(false);
              // Recargar la página para actualizar la sesión
              window.location.reload();
            }}
            onClose={() => setIsLoginModalOpen(false)}
            onSwitchToRegister={() => {
              setIsLoginModalOpen(false);
              setIsRegisterModalOpen(true);
            }}
          />
        </ModalContent>
      </Modal>

      {/* Modal de registro */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
      >
        <ModalTitle onClose={() => { setIsLoginModalOpen(false) }} title="Crear cuenta" />
        <ModalContent>
          <RegisterForm
            onSuccess={() => {
              setIsRegisterModalOpen(false);
              window.location.reload();
            }}
            onClose={() => setIsRegisterModalOpen(false)}
            onSwitchToLogin={() => {
              setIsRegisterModalOpen(false);
              setIsLoginModalOpen(true);
            }}
          />
        </ModalContent>
      </Modal>

      {/* Menú de usuario */}
      {isAuthenticated && (
        <UserMenu
          isOpen={isUserMenuOpen}
          onClose={() => setIsUserMenuOpen(false)}
          session={sessionData}
        />
      )}
    </>
  );
};

export default ClientAuthButton;
