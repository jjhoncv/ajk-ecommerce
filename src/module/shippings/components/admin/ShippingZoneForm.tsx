'use client'
import { type District } from '@/module/districts/core'
import { FetchCustomBody } from '@/module/shared/lib/FetchCustomBody'
import { ToastFail, ToastSuccess } from '@/module/shared/lib/splash'
import { Loader2, Plus, Trash2, MapPin } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type FC, useState, useEffect } from 'react'

interface ShippingZoneFormProps {
  type: 'create' | 'edit'
  initialData?: {
    id: number
    name: string
    districtIds: number[]
    isActive: number
  }
}

// Nombres amigables para las zonas
const zoneLabels: Record<string, string> = {
  lima_centro: 'Lima Centro',
  lima_norte: 'Lima Norte',
  lima_sur: 'Lima Sur',
  lima_este: 'Lima Este',
  callao: 'Callao'
}

export const ShippingZoneForm: FC<ShippingZoneFormProps> = ({ type, initialData }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [loadingDistricts, setLoadingDistricts] = useState(true)

  const [formData, setFormData] = useState({
    name: initialData?.name ?? '',
    isActive: initialData?.isActive ?? 1
  })

  // Distritos seleccionados (IDs)
  const [selectedDistrictIds, setSelectedDistrictIds] = useState<number[]>(
    initialData?.districtIds ?? []
  )

  // Distritos disponibles agrupados por zona
  const [districtsGrouped, setDistrictsGrouped] = useState<Record<string, District[]>>({})
  const [allDistricts, setAllDistricts] = useState<District[]>([])

  // Zona seleccionada para agregar
  const [selectedZone, setSelectedZone] = useState('')
  const [selectedDistrictId, setSelectedDistrictId] = useState<number>(0)

  // Cargar distritos al montar
  useEffect(() => {
    const loadDistricts = async () => {
      try {
        const response = await fetch('/api/districts/grouped')
        if (response.ok) {
          const data = await response.json()
          setDistrictsGrouped(data.districts || {})

          // Flatten para búsqueda rápida
          const all: District[] = []
          Object.values(data.districts || {}).forEach((group) => {
            all.push(...(group as District[]))
          })
          setAllDistricts(all)
        }
      } catch (error) {
        console.error('Error loading districts:', error)
        ToastFail('Error al cargar los distritos')
      } finally {
        setLoadingDistricts(false)
      }
    }
    loadDistricts()
  }, [])

  // Obtener nombre del distrito por ID
  const getDistrictById = (id: number): District | undefined => {
    return allDistricts.find(d => d.id === id)
  }

  // Distritos disponibles para la zona seleccionada (no ya seleccionados)
  const availableDistrictsForZone = selectedZone
    ? (districtsGrouped[selectedZone] || []).filter(d => !selectedDistrictIds.includes(d.id))
    : []

  const handleAddDistrict = () => {
    if (!selectedDistrictId) {
      ToastFail('Selecciona un distrito')
      return
    }

    if (selectedDistrictIds.includes(selectedDistrictId)) {
      ToastFail('Este distrito ya está agregado')
      return
    }

    setSelectedDistrictIds([...selectedDistrictIds, selectedDistrictId])
    setSelectedDistrictId(0)
  }

  const handleAddAllFromZone = () => {
    if (!selectedZone) {
      ToastFail('Selecciona una zona')
      return
    }

    const zoneDistricts = districtsGrouped[selectedZone] || []
    const newIds = zoneDistricts
      .filter(d => !selectedDistrictIds.includes(d.id))
      .map(d => d.id)

    if (newIds.length === 0) {
      ToastFail('Todos los distritos de esta zona ya están agregados')
      return
    }

    setSelectedDistrictIds([...selectedDistrictIds, ...newIds])
    ToastSuccess(`Se agregaron ${newIds.length} distritos`)
  }

  const handleRemoveDistrict = (districtId: number) => {
    setSelectedDistrictIds(selectedDistrictIds.filter(id => id !== districtId))
  }

  const handleRemoveAllFromZone = (zoneName: string) => {
    const zoneDistrictIds = (districtsGrouped[zoneName] || []).map(d => d.id)
    setSelectedDistrictIds(selectedDistrictIds.filter(id => !zoneDistrictIds.includes(id)))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name.trim()) {
      ToastFail('El nombre es requerido')
      return
    }

    if (selectedDistrictIds.length === 0) {
      ToastFail('Agrega al menos un distrito')
      return
    }

    setLoading(true)

    try {
      const payload = {
        ...(type === 'edit' && { id: initialData?.id }),
        name: formData.name,
        districtIds: selectedDistrictIds,
        isActive: formData.isActive
      }

      const message = await FetchCustomBody({
        url: '/api/admin/shippings/zones',
        method: type === 'create' ? 'POST' : 'PATCH',
        data: payload
      })

      ToastSuccess(message)
      router.push('/admin/shippings/zones')
      router.refresh()
    } catch (error: any) {
      ToastFail(error.message || 'Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  // Agrupar distritos seleccionados por zona
  const selectedDistrictsGrouped = selectedDistrictIds.reduce((acc, districtId) => {
    const district = getDistrictById(districtId)
    if (district) {
      const zoneName = district.zone
      if (!acc[zoneName]) {
        acc[zoneName] = []
      }
      acc[zoneName].push(district)
    }
    return acc
  }, {} as Record<string, District[]>)

  if (loadingDistricts) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        <span className="ml-2 text-gray-500">Cargando distritos...</span>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-gray-700">
            Nombre de la zona *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            placeholder="Ej: Lima Centro Premium, Zona Express, etc."
            className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="flex items-center gap-3">
            <input
              type="checkbox"
              checked={formData.isActive === 1}
              onChange={(e) => setFormData({ ...formData, isActive: e.target.checked ? 1 : 0 })}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <span className="text-sm font-medium text-gray-700">Zona activa</span>
          </label>
        </div>
      </div>

      {/* Información de cobertura */}
      <div className="rounded-lg bg-blue-50 p-4">
        <div className="flex items-start gap-3">
          <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Cobertura: Lima Metropolitana</p>
            <p className="text-xs text-blue-700 mt-1">
              Selecciona los distritos de Lima y Callao que formarán parte de esta zona de envío.
            </p>
          </div>
        </div>
      </div>

      {/* Sección de distritos */}
      <div className="border-t pt-6">
        <h3 className="mb-4 text-lg font-semibold">Distritos incluidos</h3>

        {/* Formulario para agregar distrito */}
        <div className="mb-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
          <div className="grid gap-3 md:grid-cols-3">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Zona geográfica</label>
              <select
                value={selectedZone}
                onChange={(e) => {
                  setSelectedZone(e.target.value)
                  setSelectedDistrictId(0)
                }}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">Seleccionar zona...</option>
                {Object.keys(districtsGrouped).map((zoneName) => (
                  <option key={zoneName} value={zoneName}>
                    {zoneLabels[zoneName] || zoneName}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Distrito</label>
              <select
                value={selectedDistrictId}
                onChange={(e) => setSelectedDistrictId(parseInt(e.target.value) || 0)}
                disabled={!selectedZone}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value={0}>Seleccionar distrito...</option>
                {availableDistrictsForZone.map((district) => (
                  <option key={district.id} value={district.id}>
                    {district.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={handleAddDistrict}
                disabled={!selectedDistrictId}
                className="flex items-center justify-center gap-1 rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Plus size={16} />
                Agregar
              </button>
            </div>
          </div>

          {/* Botón para agregar todos los distritos de la zona */}
          {selectedZone && (
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddAllFromZone}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                + Agregar todos los distritos de {zoneLabels[selectedZone] || selectedZone}
              </button>
              <span className="text-xs text-gray-400">
                ({availableDistrictsForZone.length} disponibles)
              </span>
            </div>
          )}
        </div>

        {/* Lista de distritos agrupados por zona */}
        {selectedDistrictIds.length === 0 ? (
          <p className="text-center text-sm text-gray-500">
            No hay distritos agregados. Agrega al menos uno para que la zona funcione.
          </p>
        ) : (
          <div className="space-y-3">
            {Object.entries(selectedDistrictsGrouped).map(([zoneName, districts]) => (
              <div
                key={zoneName}
                className="rounded-lg border border-gray-200 bg-white"
              >
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      {zoneLabels[zoneName] || zoneName}
                    </span>
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                      {districts.length} distrito{districts.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAllFromZone(zoneName)}
                    className="text-xs text-red-500 hover:text-red-700 hover:underline"
                  >
                    Eliminar todos
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 p-3">
                  {districts.map((district) => (
                    <span
                      key={district.id}
                      className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                    >
                      {district.name}
                      <button
                        type="button"
                        onClick={() => handleRemoveDistrict(district.id)}
                        className="ml-1 rounded-full p-0.5 text-gray-400 hover:bg-gray-200 hover:text-red-500"
                      >
                        <Trash2 size={12} />
                      </button>
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="mt-3 text-xs text-gray-500">
          {selectedDistrictIds.length} distrito{selectedDistrictIds.length !== 1 ? 's' : ''} en esta zona
        </p>
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
          {type === 'create' ? 'Crear Zona' : 'Guardar Cambios'}
        </button>
      </div>
    </form>
  )
}
