// components/StockValidationModal.tsx - Adaptado para usar tu Modal
'use client'
import { Modal, ModalContent, ModalTitle } from '@/components/ui/Modal' // Ajusta la ruta según tu estructura

interface StockError {
  variantId: number
  productName: string
  requestedQuantity: number
  availableStock: number
  message: string
}

interface ValidationResult {
  isValid: boolean
  errors: StockError[]
  hasOutOfStock: boolean
  hasReducedStock: boolean
}

interface StockValidationModalProps {
  isOpen: boolean
  result: ValidationResult | null
  onConfirm: (() => void) | null
  onCancel: (() => void) | null
}

export default function StockValidationModal({
  isOpen,
  result,
  onConfirm,
  onCancel
}: StockValidationModalProps) {
  if (!result) return null

  const { errors, hasOutOfStock, hasReducedStock } = result

  const outOfStockItems = errors.filter((error) => error.availableStock === 0)
  const reducedStockItems = errors.filter(
    (error) =>
      error.availableStock > 0 && error.availableStock < error.requestedQuantity
  )

  const getModalTitle = () => {
    if (hasOutOfStock && hasReducedStock) {
      return 'Problemas con el stock'
    } else if (hasOutOfStock) {
      return 'Productos no disponibles'
    } else {
      return 'Stock insuficiente'
    }
  }

  const getModalMessage = () => {
    if (hasOutOfStock && hasReducedStock) {
      return 'Algunos productos no están disponibles y otros tienen stock limitado. Por favor, ajusta las cantidades en tu carrito.'
    } else if (hasOutOfStock) {
      return 'Algunos productos ya no están disponibles. Por favor, retíralos de tu carrito.'
    } else {
      return 'Algunos productos tienen menos stock del solicitado. Por favor, reduce las cantidades en tu carrito.'
    }
  }

  const handleClose = () => {
    onCancel?.()
  }

  const handleUnderstood = () => {
    // ✅ Solo informar al usuario, NO hacer cambios automáticos
    onConfirm?.()
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      className="max-w-lg p-4 pt-4" // Un poco más ancho para el contenido
    >
      {/* Header con icono de advertencia */}
      <ModalTitle onClose={handleClose} className="mb-5 p-0">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-yellow-100">
            <svg
              className="h-5 w-5 text-yellow-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
          </div>
          <p className="font-bold text-gray-900">{getModalTitle()}</p>
        </div>
      </ModalTitle>

      <ModalContent className="p-0">
        <div className="space-y-4">
          {/* Mensaje explicativo */}
          <div className="mb-4">
            <p className="text-sm text-gray-600">{getModalMessage()}</p>
          </div>

          {/* Lista de problemas de stock */}
          <div className="max-h-80 space-y-4 overflow-y-auto">
            {' '}
            {/* Scroll si hay muchos productos */}
            {/* Productos sin stock */}
            {outOfStockItems.length > 0 && (
              <div>
                <h4 className="mb-3 text-sm font-semibold text-red-800">
                  Sin stock disponible:
                </h4>
                <div className="space-y-2">
                  {outOfStockItems.map((error) => (
                    <div
                      key={error.variantId}
                      className="rounded-md border border-red-200 bg-red-50 p-3"
                    >
                      <p className="mb-1 text-sm font-medium text-red-800">
                        {error.productName}
                      </p>
                      <p className="mb-1 text-xs text-red-600">
                        Solicitado:{' '}
                        <span className="font-medium">
                          {error.requestedQuantity}
                        </span>{' '}
                        • Disponible:{' '}
                        <span className="font-medium">
                          {error.availableStock}
                        </span>
                      </p>
                      <p className="text-xs text-red-600">
                        ❌ Por favor, remueve este producto del carrito
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {/* Productos con stock reducido */}
            {reducedStockItems.length > 0 && (
              <div>
                <h4 className="mb-3 text-sm font-semibold text-orange-800">
                  Stock limitado:
                </h4>
                <div className="space-y-2">
                  {reducedStockItems.map((error) => (
                    <div
                      key={error.variantId}
                      className="rounded-md border border-orange-200 bg-orange-50 p-3"
                    >
                      <p className="mb-1 text-sm font-medium text-orange-800">
                        {error.productName}
                      </p>
                      <p className="mb-1 text-xs text-orange-600">
                        Solicitado:{' '}
                        <span className="font-medium">
                          {error.requestedQuantity}
                        </span>{' '}
                        • Disponible:{' '}
                        <span className="font-medium">
                          {error.availableStock}
                        </span>
                      </p>
                      <p className="text-xs text-orange-600">
                        ⚠️ Por favor, reduce la cantidad a máximo{' '}
                        {error.availableStock} unidad
                        {error.availableStock !== 1 ? 'es' : ''}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="flex justify-end gap-3 border-t pt-4">
            <button
              onClick={() => onCancel?.()}
              className="rounded-md border border-gray-300 px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
            >
              Cancelar
            </button>

            <button
              onClick={handleUnderstood}
              className="rounded-md bg-indigo-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-indigo-700"
            >
              Entendido
            </button>
          </div>
        </div>
      </ModalContent>
    </Modal>
  )
}
