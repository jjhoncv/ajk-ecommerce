'use client'
import { FetchCustomBody } from '@/module/shared/lib/FetchCustomBody'
import { ToastFail, ToastSuccess } from '@/module/shared/lib/splash'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type FC, useState } from 'react'

interface PaymentMethodFormProps {
  type: 'create' | 'edit'
  initialData?: {
    id: number
    name: string
    code: string
    description: string | null
    iconUrl: string | null
    processingFeeType: 'fixed' | 'percentage' | null
    processingFeeValue: number | null
    minAmount: number | null
    maxAmount: number | null
    isActive: number
    requiresVerification: number
    displayOrder: number
  }
}

export const PaymentMethodForm: FC<PaymentMethodFormProps> = ({ type, initialData }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: initialData?.name ?? '',
    code: initialData?.code ?? '',
    description: initialData?.description ?? '',
    iconUrl: initialData?.iconUrl ?? '',
    processingFeeType: initialData?.processingFeeType ?? 'fixed',
    processingFeeValue: initialData?.processingFeeValue ?? 0,
    minAmount: initialData?.minAmount ?? 0,
    maxAmount: initialData?.maxAmount ?? '',
    isActive: initialData?.isActive ?? 1,
    requiresVerification: initialData?.requiresVerification ?? 0,
    displayOrder: initialData?.displayOrder ?? 0
  })

  const generateCode = (name: string) => {
    return name
      .toLowerCase()
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
  }

  const handleNameChange = (name: string) => {
    setFormData({
      ...formData,
      name,
      ...(type === 'create' && { code: generateCode(name) })
    })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      ToastFail('El nombre es requerido')
      return
    }

    if (!formData.code.trim()) {
      ToastFail('El código es requerido')
      return
    }

    setLoading(true)

    try {
      const payload = {
        ...(type === 'edit' && { id: initialData?.id }),
        name: formData.name,
        code: formData.code,
        description: formData.description || null,
        iconUrl: formData.iconUrl || null,
        processingFeeType: formData.processingFeeType,
        processingFeeValue: formData.processingFeeValue,
        minAmount: formData.minAmount || 0,
        maxAmount: formData.maxAmount ? Number(formData.maxAmount) : null,
        isActive: formData.isActive,
        requiresVerification: formData.requiresVerification,
        displayOrder: formData.displayOrder
      }

      const message = await FetchCustomBody({
        url: '/api/admin/payments/methods',
        method: type === 'create' ? 'POST' : 'PATCH',
        data: payload
      })

      ToastSuccess(message)
      router.push('/admin/payments/methods')
      router.refresh()
    } catch (error: any) {
      ToastFail(error.message || 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        {/* Nombre */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Nombre del método *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => handleNameChange(e.target.value)}
            placeholder="Ej: Tarjeta de Crédito"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* Código */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Código único *
          </label>
          <input
            type="text"
            value={formData.code}
            onChange={(e) => setFormData({ ...formData, code: e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, '_') })}
            placeholder="Ej: credit_card"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 font-mono text-sm focus:border-blue-500 focus:outline-none"
          />
          <p className="mt-1 text-xs text-gray-500">Identificador único para el sistema</p>
        </div>

        {/* Descripción */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Descripción opcional del método de pago"
            rows={2}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        {/* URL del ícono */}
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            URL del ícono
          </label>
          <input
            type="text"
            value={formData.iconUrl}
            onChange={(e) => setFormData({ ...formData, iconUrl: e.target.value })}
            placeholder="https://ejemplo.com/icono.png"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
          <p className="mt-1 text-xs text-gray-500">URL de la imagen del método de pago</p>
        </div>
      </div>

      {/* Sección de comisiones */}
      <div className="border-t pt-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Comisiones</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Tipo de comisión
            </label>
            <select
              value={formData.processingFeeType}
              onChange={(e) => setFormData({ ...formData, processingFeeType: e.target.value as 'fixed' | 'percentage' })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            >
              <option value="fixed">Monto fijo (S/)</option>
              <option value="percentage">Porcentaje (%)</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Valor de la comisión {formData.processingFeeType === 'percentage' ? '(%)' : '(S/)'}
            </label>
            <input
              type="number"
              step={formData.processingFeeType === 'percentage' ? '0.01' : '0.01'}
              min="0"
              value={formData.processingFeeValue}
              onChange={(e) => setFormData({ ...formData, processingFeeValue: parseFloat(e.target.value) || 0 })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">
              {formData.processingFeeType === 'percentage'
                ? 'Porcentaje que se agrega al total de la compra'
                : 'Monto fijo que se agrega al total de la compra'}
            </p>
          </div>
        </div>
      </div>

      {/* Sección de límites */}
      <div className="border-t pt-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Límites de monto</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Monto mínimo (S/)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.minAmount}
              onChange={(e) => setFormData({ ...formData, minAmount: parseFloat(e.target.value) || 0 })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">Monto mínimo requerido para usar este método</p>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Monto máximo (S/)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              value={formData.maxAmount}
              onChange={(e) => setFormData({ ...formData, maxAmount: e.target.value })}
              placeholder="Sin límite"
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">Dejar vacío para sin límite máximo</p>
          </div>
        </div>
      </div>

      {/* Sección de configuración */}
      <div className="border-t pt-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Configuración</h3>
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Orden de visualización
            </label>
            <input
              type="number"
              min="0"
              value={formData.displayOrder}
              onChange={(e) => setFormData({ ...formData, displayOrder: parseInt(e.target.value) || 0 })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
            <p className="mt-1 text-xs text-gray-500">Menor número aparece primero</p>
          </div>

          <div className="flex flex-col justify-end space-y-4">
            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.isActive === 1}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked ? 1 : 0 })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Método activo</span>
                <p className="text-xs text-gray-500">Solo los métodos activos se muestran a los clientes</p>
              </div>
            </label>

            <label className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={formData.requiresVerification === 1}
                onChange={(e) => setFormData({ ...formData, requiresVerification: e.target.checked ? 1 : 0 })}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <div>
                <span className="text-sm font-medium text-gray-700">Requiere verificación</span>
                <p className="text-xs text-gray-500">El pago debe ser verificado manualmente</p>
              </div>
            </label>
          </div>
        </div>
      </div>

      <div className="flex justify-end gap-3 border-t pt-6">
        <button
          type="button"
          onClick={() => router.back()}
          className="rounded-lg border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading && <Loader2 size={16} className="animate-spin" />}
          {type === 'create' ? 'Crear Método' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  )
}
