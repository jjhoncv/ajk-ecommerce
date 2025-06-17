"use client";
import { useAuthModal } from "@/providers/auth-modal";
import { User } from "lucide-react";
import { useSession } from "next-auth/react";
import React, { useEffect, useState } from "react";
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
  const { openLogin } = useAuthModal(); // 👈 Usar el provider centralizado
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
      console.log('🔄 Auth state changed:', {
        from: authState.isAuthenticated,
        to: newIsAuthenticated
      });

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
      console.log('👤 Opening user menu');
      setIsUserMenuOpen(true);
    } else {
      console.log('🔐 User not authenticated, opening login modal');
      // 👈 USAR EL PROVIDER CENTRALIZADO - Sin callbacks especiales para el header
      openLogin();
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

      {/* Menú de usuario - Solo se renderiza si está autenticado */}
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