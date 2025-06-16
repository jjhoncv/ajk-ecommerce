"use client";
import { ModalContent } from "@/components/ui/Modal/ModalContent";
import { ModalTitle } from "@/components/ui/Modal/ModalTitle";
import { User } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
import LoginForm from "./LoginForm";
import { Modal } from "./Modal";
import RegisterForm from "./RegisterForm";
import UserMenu from "./UserMenu";

interface ClientAuthButtonProps {
  initialIsAuthenticated: boolean;
  initialUserName: string;
  initialUserEmail: string;
  initialUserId: string;
}

const ClientAuthButton: React.FC<ClientAuthButtonProps> = ({
  initialIsAuthenticated,
  initialUserName,
  initialUserEmail,
  initialUserId,
}) => {
  const { data: session, status } = useSession();
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // 👈 ESTADO HÍBRIDO: Usar valores iniciales del servidor hasta que el cliente se hidrate
  const [authState, setAuthState] = useState({
    isAuthenticated: initialIsAuthenticated,
    userName: initialUserName,
    userEmail: initialUserEmail,
    userId: initialUserId,
  });

  // 👈 ACTUALIZAR SOLO CUANDO LA SESIÓN CAMBIE (no durante hydration)
  useEffect(() => {
    if (status === "loading") return; // No hacer nada mientras carga

    // Solo actualizar si hay un cambio real en la autenticación
    const newIsAuthenticated = !!session;

    if (newIsAuthenticated !== authState.isAuthenticated) {
      setAuthState({
        isAuthenticated: newIsAuthenticated,
        userName: session?.user?.name || "",
        userEmail: session?.user?.email || "",
        userId: session?.user?.id || "",
      });
    }
  }, [session, status]); // No incluir authState para evitar loops

  // Crear objeto de sesión para UserMenu
  const sessionData = authState.isAuthenticated ? {
    user: {
      id: authState.userId,
      name: authState.userName,
      email: authState.userEmail,
    },
    expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
  } : null;

  const handleAuthClick = () => {
    if (authState.isAuthenticated) {
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
          {authState.isAuthenticated ? "Mi cuenta" : "Iniciar sesión"}
        </span>
      </button>

      {/* Modal de login */}
      <Modal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
      >
        <ModalTitle
          onClose={() => setIsLoginModalOpen(false)}
          title="Iniciar sesión"
        />
        <ModalContent>
          <LoginForm
            onSuccess={() => {
              setIsLoginModalOpen(false);
              // La sesión se actualizará automáticamente vía useSession
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
        <ModalTitle
          onClose={() => setIsRegisterModalOpen(false)}
          title="Crear cuenta"
        />
        <ModalContent>
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
        </ModalContent>
      </Modal>

      {/* Menú de usuario */}
      {authState.isAuthenticated && sessionData && (
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