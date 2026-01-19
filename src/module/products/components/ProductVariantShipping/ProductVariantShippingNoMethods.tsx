import { Truck } from 'lucide-react'

export const ProductVariantShippingNoMethods = () => {
  return (
    <div className="border-b border-gray-200 px-6 py-4">
      <div className="py-4 text-center">
        <Truck className="mx-auto mb-2 h-8 w-8 text-gray-400" />
        <p className="mb-1 text-sm font-medium text-gray-700">
          Envío no disponible
        </p>
        <p className="text-xs text-gray-500">
          No hay opciones de envío configuradas para tu zona
        </p>
      </div>
    </div>
  )
}
