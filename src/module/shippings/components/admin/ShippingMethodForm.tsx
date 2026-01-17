'use client'
import { FetchCustomBody } from '@/module/shared/lib/FetchCustomBody'
import { ToastFail, ToastSuccess } from '@/module/shared/lib/splash'
import { Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type FC, useState } from 'react'

interface ShippingMethodFormProps {
  type: 'create' | 'edit'
  initialData?: {
    id: number
    name: string
    description: string | null
    baseCost: number
    estimatedDaysMin: number | null
    estimatedDaysMax: number | null
    isActive: number
  }
}

export const ShippingMethodForm: FC<ShippingMethodFormProps> = ({ type, initialData }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: initialData?.name ?? '',
    description: initialData?.description ?? '',
    baseCost: initialData?.baseCost ?? 0,
    estimatedDaysMin: initialData?.estimatedDaysMin ?? 1,
    estimatedDaysMax: initialData?.estimatedDaysMax ?? 3,
    isActive: initialData?.isActive ?? 1
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      ToastFail('El nombre es requerido')
      return
    }

    setLoading(true)

    try {
      const payload = {
        ...(type === 'edit' && { id: initialData?.id }),
        name: formData.name,
        description: formData.description || null,
        baseCost: formData.baseCost,
        estimatedDaysMin: formData.estimatedDaysMin,
        estimatedDaysMax: formData.estimatedDaysMax,
        isActive: formData.isActive
      }

      const message = await FetchCustomBody({
        url: '/api/admin/shippings/methods',
        method: type === 'create' ? 'POST' : 'PATCH',
        data: payload
      })

      ToastSuccess(message)
      router.push('/admin/shippings/methods')
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
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Nombre del método *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Envío Estándar"
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Descripción
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Descripción opcional del método de envío"
            rows={3}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Costo base (S/)
          </label>
          <input
            type="number"
            step="0.01"
            min="0"
            value={formData.baseCost}
            onChange={(e) => setFormData({ ...formData, baseCost: parseFloat(e.target.value) || 0 })}
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
          <p className="mt-1 text-xs text-gray-500">Costo por defecto si no hay precio específico por zona</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Días mínimos
            </label>
            <input
              type="number"
              min="1"
              value={formData.estimatedDaysMin}
              onChange={(e) => setFormData({ ...formData, estimatedDaysMin: parseInt(e.target.value) || 1 })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Días máximos
            </label>
            <input
              type="number"
              min="1"
              value={formData.estimatedDaysMax}
              onChange={(e) => setFormData({ ...formData, estimatedDaysMax: parseInt(e.target.value) || 1 })}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.isActive === 1}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked ? 1 : 0 })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Método activo</span>
          </label>
          <p className="ml-7 text-xs text-gray-500">Solo los métodos activos se muestran a los clientes</p>
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
