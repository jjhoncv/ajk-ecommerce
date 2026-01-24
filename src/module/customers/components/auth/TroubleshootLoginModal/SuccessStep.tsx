'use client'

import { type JSX } from 'react'
import { CheckCircle } from 'lucide-react'

interface SuccessStepProps {
  message: string
  onClose: () => void
}

export const SuccessStep = ({
  message,
  onClose
}: SuccessStepProps): JSX.Element => {
  return (
    <div className="space-y-6 text-center">
      <div className="flex justify-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <CheckCircle className="h-10 w-10 text-green-500" />
        </div>
      </div>

      <p className="text-gray-600">{message}</p>

      <button
        type="button"
        onClick={onClose}
        className="w-full bg-black py-3 text-base font-medium text-white transition-colors hover:bg-gray-800"
      >
        Iniciar sesión
      </button>
    </div>
  )
}
