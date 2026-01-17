'use client'
import { FetchCustomBody } from '@/module/shared/lib/FetchCustomBody'
import { ToastFail, ToastSuccess } from '@/module/shared/lib/splash'
import { Check, Edit2, Loader2, Plus, Trash2, X } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type FC, useState } from 'react'

interface ShippingMethod {
  id: number
  name: string
  isActive: number
}

interface ShippingZone {
  id: number
  name: string
  isActive: number
}

interface ZoneMethodPricing {
  id: number
  shippingMethodId: number
  shippingZoneId: number
  cost: number
  freeShippingThreshold: number | null
  estimatedDaysMin: number | null
  estimatedDaysMax: number | null
  isActive: number
  methodName?: string
  zoneName?: string
}

interface ZoneMethodPricingManagerProps {
  methods: ShippingMethod[]
  zones: ShippingZone[]
  zoneMethods: ZoneMethodPricing[]
}

interface EditingPrice {
  methodId: number
  zoneId: number
  existingId?: number
  cost: string
  freeShippingThreshold: string
  estimatedDaysMin: string
  estimatedDaysMax: string
}

export const ZoneMethodPricingManager: FC<ZoneMethodPricingManagerProps> = ({
  methods,
  zones,
  zoneMethods
}) => {
  const router = useRouter()
  const [editingPrice, setEditingPrice] = useState<EditingPrice | null>(null)
  const [loading, setLoading] = useState(false)

  const activeMethods = methods.filter((m) => m.isActive === 1)
  const activeZones = zones.filter((z) => z.isActive === 1)

  // Obtener el precio configurado para un método y zona específicos
  const getZoneMethodPrice = (methodId: number, zoneId: number): ZoneMethodPricing | undefined => {
    return zoneMethods.find(
      (zm) => zm.shippingMethodId === methodId && zm.shippingZoneId === zoneId
    )
  }

  const handleEditPrice = (methodId: number, zoneId: number) => {
    const existing = getZoneMethodPrice(methodId, zoneId)
    setEditingPrice({
      methodId,
      zoneId,
      existingId: existing?.id,
      cost: existing?.cost?.toString() ?? '',
      freeShippingThreshold: existing?.freeShippingThreshold?.toString() ?? '',
      estimatedDaysMin: existing?.estimatedDaysMin?.toString() ?? '',
      estimatedDaysMax: existing?.estimatedDaysMax?.toString() ?? ''
    })
  }

  const handleCancelEdit = () => {
    setEditingPrice(null)
  }

  const handleSavePrice = async () => {
    if (!editingPrice) return

    const cost = parseFloat(editingPrice.cost)
    if (isNaN(cost) || cost < 0) {
      ToastFail('El costo debe ser un número válido')
      return
    }

    setLoading(true)

    try {
      const payload = {
        ...(editingPrice.existingId && { id: editingPrice.existingId }),
        shippingMethodId: editingPrice.methodId,
        shippingZoneId: editingPrice.zoneId,
        cost,
        freeShippingThreshold: editingPrice.freeShippingThreshold
          ? parseFloat(editingPrice.freeShippingThreshold)
          : 0,
        estimatedDaysMin: editingPrice.estimatedDaysMin
          ? parseInt(editingPrice.estimatedDaysMin)
          : 1,
        estimatedDaysMax: editingPrice.estimatedDaysMax
          ? parseInt(editingPrice.estimatedDaysMax)
          : 3,
        isActive: 1
      }

      const message = await FetchCustomBody({
        url: '/api/admin/shippings/zone-methods',
        method: editingPrice.existingId ? 'PATCH' : 'POST',
        data: payload
      })

      ToastSuccess(message)
      setEditingPrice(null)
      router.refresh()
    } catch (error: any) {
      ToastFail(error.message || 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  const handleDeletePrice = async (id: number) => {
    if (!confirm('¿Eliminar esta configuración de precio?')) return

    setLoading(true)

    try {
      const message = await FetchCustomBody({
        url: '/api/admin/shippings/zone-methods',
        method: 'DELETE',
        data: { id }
      })

      ToastSuccess(message)
      router.refresh()
    } catch (error: any) {
      ToastFail(error.message || 'Error al eliminar')
    } finally {
      setLoading(false)
    }
  }

  if (activeMethods.length === 0 || activeZones.length === 0) {
    return (
      <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-6 text-center">
        <p className="text-yellow-700">
          {activeMethods.length === 0 && activeZones.length === 0
            ? 'Necesitas crear métodos de envío y zonas activas para configurar precios.'
            : activeMethods.length === 0
              ? 'Necesitas crear al menos un método de envío activo.'
              : 'Necesitas crear al menos una zona de envío activa.'}
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr>
            <th className="border border-gray-200 bg-gray-100 px-4 py-3 text-left text-sm font-semibold text-gray-700">
              Zona / Método
            </th>
            {activeMethods.map((method) => (
              <th
                key={method.id}
                className="border border-gray-200 bg-gray-100 px-4 py-3 text-center text-sm font-semibold text-gray-700"
              >
                {method.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {activeZones.map((zone) => (
            <tr key={zone.id} className="hover:bg-gray-50">
              <td className="border border-gray-200 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700">
                {zone.name}
              </td>
              {activeMethods.map((method) => {
                const pricing = getZoneMethodPrice(method.id, zone.id)
                const isEditing =
                  editingPrice?.methodId === method.id && editingPrice?.zoneId === zone.id

                return (
                  <td
                    key={`${zone.id}-${method.id}`}
                    className="border border-gray-200 px-2 py-2 text-center"
                  >
                    {isEditing ? (
                      <div className="space-y-2">
                        <div>
                          <label className="mb-1 block text-xs text-gray-500">Costo (S/)</label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editingPrice.cost}
                            onChange={(e) =>
                              setEditingPrice({ ...editingPrice, cost: e.target.value })
                            }
                            className="w-full rounded border border-gray-300 px-2 py-1 text-center text-sm"
                            placeholder="0.00"
                            autoFocus
                          />
                        </div>
                        <div>
                          <label className="mb-1 block text-xs text-gray-500">
                            Envío gratis desde (S/)
                          </label>
                          <input
                            type="number"
                            step="0.01"
                            min="0"
                            value={editingPrice.freeShippingThreshold}
                            onChange={(e) =>
                              setEditingPrice({
                                ...editingPrice,
                                freeShippingThreshold: e.target.value
                              })
                            }
                            className="w-full rounded border border-gray-300 px-2 py-1 text-center text-sm"
                            placeholder="Opcional"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-1">
                          <div>
                            <label className="mb-1 block text-xs text-gray-500">Días mín</label>
                            <input
                              type="number"
                              min="1"
                              value={editingPrice.estimatedDaysMin}
                              onChange={(e) =>
                                setEditingPrice({
                                  ...editingPrice,
                                  estimatedDaysMin: e.target.value
                                })
                              }
                              className="w-full rounded border border-gray-300 px-2 py-1 text-center text-sm"
                              placeholder="1"
                            />
                          </div>
                          <div>
                            <label className="mb-1 block text-xs text-gray-500">Días máx</label>
                            <input
                              type="number"
                              min="1"
                              value={editingPrice.estimatedDaysMax}
                              onChange={(e) =>
                                setEditingPrice({
                                  ...editingPrice,
                                  estimatedDaysMax: e.target.value
                                })
                              }
                              className="w-full rounded border border-gray-300 px-2 py-1 text-center text-sm"
                              placeholder="3"
                            />
                          </div>
                        </div>
                        <div className="flex justify-center gap-1">
                          <button
                            onClick={handleSavePrice}
                            disabled={loading}
                            className="rounded bg-green-600 p-1.5 text-white hover:bg-green-700 disabled:bg-gray-400"
                          >
                            {loading ? (
                              <Loader2 size={14} className="animate-spin" />
                            ) : (
                              <Check size={14} />
                            )}
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="rounded bg-gray-500 p-1.5 text-white hover:bg-gray-600"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      </div>
                    ) : pricing ? (
                      <div className="group relative">
                        <div className="text-sm">
                          <span className="font-semibold text-gray-900">
                            S/ {pricing.cost.toFixed(2)}
                          </span>
                          {pricing.freeShippingThreshold && (
                            <div className="text-xs text-green-600">
                              Gratis desde S/ {pricing.freeShippingThreshold.toFixed(2)}
                            </div>
                          )}
                          {pricing.estimatedDaysMin && pricing.estimatedDaysMax && (
                            <div className="text-xs text-gray-500">
                              {pricing.estimatedDaysMin === pricing.estimatedDaysMax
                                ? `${pricing.estimatedDaysMin} día${pricing.estimatedDaysMin !== 1 ? 's' : ''}`
                                : `${pricing.estimatedDaysMin}-${pricing.estimatedDaysMax} días`}
                            </div>
                          )}
                        </div>
                        <div className="absolute -right-1 -top-1 hidden gap-1 group-hover:flex">
                          <button
                            onClick={() => handleEditPrice(method.id, zone.id)}
                            className="rounded bg-blue-600 p-1 text-white hover:bg-blue-700"
                          >
                            <Edit2 size={12} />
                          </button>
                          <button
                            onClick={() => handleDeletePrice(pricing.id)}
                            className="rounded bg-red-600 p-1 text-white hover:bg-red-700"
                          >
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => handleEditPrice(method.id, zone.id)}
                        className="flex w-full items-center justify-center gap-1 rounded border border-dashed border-gray-300 py-2 text-xs text-gray-400 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
                      >
                        <Plus size={14} />
                        Configurar
                      </button>
                    )}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
