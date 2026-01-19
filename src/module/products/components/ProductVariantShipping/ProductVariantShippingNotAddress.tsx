import { MapPin } from 'lucide-react'

export const ProductVariantShippingNotAddress = () => {
  return (
    <div className="border-b border-gray-200 px-6 py-4">
      <div className="py-4 text-center">
        <MapPin className="mx-auto mb-2 h-8 w-8 text-gray-400" />
        <p className="mb-3 text-sm text-gray-600">
          No tienes direcciones registradas
        </p>
        <button className="text-sm font-medium text-blue-600 hover:text-blue-700">
          Agregar dirección
        </button>
      </div>
    </div>
  )
}
