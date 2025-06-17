"use client";
import { useAuthModal } from "@/providers/auth-modal";
import { User } from "lucide-react";

export const AuthPrompt: React.FC = () => {
  const { openLogin, openRegister } = useAuthModal();

  const handleLoginClick = () => {
    console.log('🔐 Opening login from rating prompt');
    openLogin({
      onLoginSuccess: () => {
        console.log('✅ Login successful, user can now rate product');
        // La UI se actualizará automáticamente porque useSession detectará el cambio
      },
      onClose: () => {
        console.log('❌ Login cancelled from rating prompt');
      }
    });
    openLogin()
  };

  const handleRegisterClick = () => {
    console.log('📝 Opening register from rating prompt');
    openRegister({
      onRegisterSuccess: () => {
        console.log('✅ Registration successful, user can now rate product');
        // La UI se actualizará automáticamente
      },
      onClose: () => {
        console.log('❌ Registration cancelled from rating prompt');
      }
    });
  };

  return (
    <div className="bg-blue-50 border border-blue-200 p-6 text-center">
      <User className="h-12 w-12 text-blue-500 mx-auto mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">
        Inicia sesión para valorar este producto
      </h3>
      <p className="text-gray-600 mb-4">
        Necesitas tener una cuenta para poder dejar tu valoración y ayudar a otros usuarios.
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <button
          onClick={handleLoginClick}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 font-medium transition-colors"
        >
          Iniciar sesión
        </button>
        <button
          onClick={handleRegisterClick}
          className="bg-white hover:bg-gray-50 text-indigo-600 border border-indigo-600 px-6 py-2 font-medium transition-colors"
        >
          Crear cuenta
        </button>
      </div>
    </div>
  );
};