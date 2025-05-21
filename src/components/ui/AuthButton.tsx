"use client";
import React, { useState } from "react";
import { User } from "lucide-react";
import { useSession } from "next-auth/react";
import Modal from "./Modal";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import UserMenu from "./UserMenu";

const AuthButton: React.FC = () => {
  const { data: session, status } = useSession();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  const isAuthenticated = status === "authenticated";
  const isLoading = status === "loading";

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
        disabled={isLoading}
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
        title="Iniciar sesión"
      >
        <LoginForm
          onSuccess={() => {
            setIsLoginModalOpen(false);
          }}
          onClose={() => setIsLoginModalOpen(false)}
          onSwitchToRegister={() => {
            setIsLoginModalOpen(false);
            setIsRegisterModalOpen(true);
          }}
        />
      </Modal>

      {/* Modal de registro */}
      <Modal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        title="Crear cuenta"
      >
        <RegisterForm
          onSuccess={() => {
            setIsRegisterModalOpen(false);
          }}
          onClose={() => setIsRegisterModalOpen(false)}
          onSwitchToLogin={() => {
            setIsRegisterModalOpen(false);
            setIsLoginModalOpen(true);
          }}
        />
      </Modal>

      {/* Menú de usuario */}
      {session && (
        <UserMenu
          isOpen={isUserMenuOpen}
          onClose={() => setIsUserMenuOpen(false)}
          session={session}
        />
      )}
    </>
  );
};

export default AuthButton;
