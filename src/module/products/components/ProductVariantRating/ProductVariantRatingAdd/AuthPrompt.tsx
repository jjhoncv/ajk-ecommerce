'use client'
import { useAuthModal } from '@/module/customers/providers'
import { User } from 'lucide-react'

export const AuthPrompt: React.FC = () => {
  const { openLogin, openRegister } = useAuthModal()

  const handleLoginClick = () => {
    console.log('🔐 Opening login from rating prompt')
    openLogin({
      onLoginSuccess: () => {
        console.log('✅ Login successful, user can now rate product')
        // La UI se actualizará automáticamente porque useSession detectará el cambio
      },
      onClose: () => {
        console.log('❌ Login cancelled from rating prompt')
      }
    })
    openLogin()
  }

  const handleRegisterClick = () => {
    console.log('📝 Opening register from rating prompt')
    openRegister({
      onRegisterSuccess: () => {
        console.log('✅ Registration successful, user can now rate product')
        // La UI se actualizará automáticamente
      },
      onClose: () => {
        console.log('❌ Registration cancelled from rating prompt')
      }
    })
  }

  return (
    <div className="border border-blue-200 bg-blue-50 p-6 text-center">
      <User className="mx-auto mb-4 h-12 w-12 text-blue-500" />
      <h3 className="mb-2 text-lg font-semibold text-gray-900">
        Inicia sesión para valorar este producto
      </h3>
      <p className="mb-4 text-gray-600">
        Necesitas tener una cuenta para poder dejar tu valoración y ayudar a
        otros usuarios.
      </p>
      <div className="flex flex-col justify-center gap-3 sm:flex-row">
        <button
          onClick={handleLoginClick}
          className="bg-indigo-600 px-6 py-2 font-medium text-white transition-colors hover:bg-indigo-700"
        >
          Iniciar sesión
        </button>
        <button
          onClick={handleRegisterClick}
          className="border border-indigo-600 bg-white px-6 py-2 font-medium text-indigo-600 transition-colors hover:bg-gray-50"
        >
          Crear cuenta
        </button>
      </div>
    </div>
  )
}
