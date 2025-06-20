import { formatPrice } from '@/helpers/utils'
import { ChevronRight, MapPin, Package, RotateCcw, Shield } from 'lucide-react'

export const ProductVariantShippingLogout = () => {
  return (
    <div className="border-b border-gray-200 px-6 py-4">
      <div className="mb-4 flex items-center justify-between">
        <span className="text-sm font-medium text-gray-900">Envío a</span>
        <div className="flex items-center space-x-1 text-gray-600">
          <MapPin className="h-4 w-4" />
          <span className="text-sm">Perú</span>
        </div>
      </div>

      <div className="space-y-3 bg-gray-50 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Package className="h-4 w-4 text-gray-600" />
            <div>
              <div className="text-sm font-medium text-gray-900">
                Envío: Desde {formatPrice(15.0)}
              </div>
              <div className="text-xs text-gray-600">
                <span className="font-medium">
                  Inicia sesión para ver costo exacto
                </span>
              </div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-gray-400" />
        </div>

        <div className="space-y-2 border-t border-gray-200 pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <RotateCcw className="h-4 w-4 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">
                Política de devoluciones y reembolsos
              </span>
            </div>
            <ChevronRight className="h-3 w-3 text-gray-400" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">
                Seguridad & Privacidad
              </span>
            </div>
            <ChevronRight className="h-3 w-3 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  )
}
