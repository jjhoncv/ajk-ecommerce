'use client'

import { type JSX } from 'react'
import { KeyRound, Search } from 'lucide-react'

interface MainOptionsProps {
  onResetPasswordClick: () => void
  onFindAccountClick: () => void
  onClose: () => void
}

export const MainOptions = ({
  onResetPasswordClick,
  onFindAccountClick,
  onClose
}: MainOptionsProps): JSX.Element => {
  return (
    <div className="space-y-4">
      <p className="text-sm text-gray-600">
        Si recuerdas tu email, puedes restablecer tu contraseña.
      </p>
      <button
        type="button"
        onClick={onResetPasswordClick}
        className="flex w-full items-center justify-center gap-2 border border-gray-300 bg-white py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        <KeyRound className="h-4 w-4" />
        Restablecer contraseña
      </button>

      <div className="relative py-2">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-200"></div>
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-white px-3 text-gray-400">o</span>
        </div>
      </div>

      <p className="text-sm text-gray-600">
        Si olvidaste tu cuenta, recupérala con tu email o teléfono.
      </p>
      <button
        type="button"
        onClick={onFindAccountClick}
        className="flex w-full items-center justify-center gap-2 border border-gray-300 bg-white py-3 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
      >
        <Search className="h-4 w-4" />
        Encuentra tu cuenta
      </button>

      <button
        type="button"
        onClick={onClose}
        className="w-full pt-2 text-sm text-gray-500 hover:text-gray-700"
      >
        Volver
      </button>
    </div>
  )
}
