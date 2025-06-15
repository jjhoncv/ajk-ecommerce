import { User } from "lucide-react";

interface AuthPromptProps {
  onLogin: () => void;
  onRegister: () => void;
}

export const AuthPrompt: React.FC<AuthPromptProps> = ({
  onLogin,
  onRegister,
}) => {
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
          onClick={onLogin}
          className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 font-medium transition-colors"
        >
          Iniciar sesión
        </button>
        <button
          onClick={onRegister}
          className="bg-white hover:bg-gray-50 text-indigo-600 border border-indigo-600 px-6 py-2 font-medium transition-colors"
        >
          Crear cuenta
        </button>
      </div>
    </div>
  );
};