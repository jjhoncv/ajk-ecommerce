import { AlertCircle } from 'lucide-react'

export const ProductVariantShippingNotAvailable = () => {
  return (
    <div className="border-b border-gray-200 px-6 py-4">
      <div className="py-4 text-center">
        <AlertCircle className="mx-auto mb-2 h-8 w-8 text-orange-400" />
        <p className="text-sm text-gray-600">
          No hay envío disponible a esta dirección
        </p>
      </div>
    </div>
  )
}
