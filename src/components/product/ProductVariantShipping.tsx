import { formatPrice } from "@/helpers/utils"
import { ChevronRight, MapPin, Package, RotateCcw, Shield } from "lucide-react"
import { FC } from "react"

interface ProductVariantShippingProps {
  shippingCost: number
}

export const ProductVariantShipping: FC<ProductVariantShippingProps> = ({ shippingCost }) => {
  return (
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <span className="font-medium text-gray-900 text-sm">Envío a</span>
        <div className="flex items-center space-x-1 text-gray-600">
          <MapPin className="w-4 h-4" />
          <span className="text-sm">Perú</span>
        </div>
      </div>

      {/* Compromiso de AJKEcommerce */}
      <div className="bg-gray-50 p-4 space-y-3">

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Package className="w-4 h-4 text-gray-600" />
            <div>
              <div className="text-sm font-medium text-gray-900">
                Envío: {formatPrice(shippingCost)}
              </div>
              <div className="text-xs text-gray-600">
                Entrega: <span className="font-medium">28 de JUN. - 11 de JUL.</span>
              </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-gray-400" />
        </div>

        <div className="space-y-2 border-t border-gray-200 pt-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <RotateCcw className="w-4 h-4 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">Política de devoluciones y reembolsos</span>
            </div>
            <ChevronRight className="w-3 h-3 text-gray-400" />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Shield className="w-4 h-4 text-gray-600" />
              <span className="text-xs font-medium text-gray-700">Seguridad & Privacidad</span>
            </div>
            <ChevronRight className="w-3 h-3 text-gray-400" />
          </div>
        </div>
      </div>
    </div>
  )
}
