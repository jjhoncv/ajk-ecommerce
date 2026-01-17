'use client'
import {
  getDepartments,
  getDistrictsByProvince,
  getProvincesByDepartment
} from '@/module/shippings/data/peru-ubigeo'
import { FetchCustomBody } from '@/module/shared/lib/FetchCustomBody'
import { ToastFail, ToastSuccess } from '@/module/shared/lib/splash'
import { Loader2, Plus, Trash2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type FC, useState, useEffect } from 'react'

interface DistrictInfo {
  name: string
  province: string
  department: string
}

interface ShippingZoneFormProps {
  type: 'create' | 'edit'
  initialData?: {
    id: number
    name: string
    districts: DistrictInfo[]
    isActive: number
  }
}

export const ShippingZoneForm: FC<ShippingZoneFormProps> = ({ type, initialData }) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const [formData, setFormData] = useState({
    name: initialData?.name ?? '',
    isActive: initialData?.isActive ?? 1
  })

  const [districts, setDistricts] = useState<DistrictInfo[]>(initialData?.districts ?? [])

  // Estados para los combos anidados
  const [selectedDepartment, setSelectedDepartment] = useState('')
  const [selectedProvince, setSelectedProvince] = useState('')
  const [selectedDistrict, setSelectedDistrict] = useState('')

  // Listas para los combos
  const [departments] = useState<string[]>(getDepartments())
  const [provinces, setProvinces] = useState<string[]>([])
  const [availableDistricts, setAvailableDistricts] = useState<string[]>([])

  // Actualizar provincias cuando cambia el departamento
  useEffect(() => {
    if (selectedDepartment) {
      const provs = getProvincesByDepartment(selectedDepartment)
      setProvinces(provs)
      setSelectedProvince('')
      setSelectedDistrict('')
      setAvailableDistricts([])
    } else {
      setProvinces([])
      setSelectedProvince('')
      setSelectedDistrict('')
      setAvailableDistricts([])
    }
  }, [selectedDepartment])

  // Actualizar distritos cuando cambia la provincia
  useEffect(() => {
    if (selectedDepartment && selectedProvince) {
      const dists = getDistrictsByProvince(selectedDepartment, selectedProvince)
      setAvailableDistricts(dists)
      setSelectedDistrict('')
    } else {
      setAvailableDistricts([])
      setSelectedDistrict('')
    }
  }, [selectedDepartment, selectedProvince])

  const handleAddDistrict = () => {
    if (!selectedDepartment || !selectedProvince || !selectedDistrict) {
      ToastFail('Selecciona departamento, provincia y distrito')
      return
    }

    // Verificar si ya existe
    const exists = districts.some(
      d =>
        d.name.toLowerCase() === selectedDistrict.toLowerCase() &&
        d.province.toLowerCase() === selectedProvince.toLowerCase() &&
        d.department.toLowerCase() === selectedDepartment.toLowerCase()
    )

    if (exists) {
      ToastFail('Este distrito ya está agregado')
      return
    }

    setDistricts([
      ...districts,
      {
        name: selectedDistrict,
        province: selectedProvince,
        department: selectedDepartment
      }
    ])

    // Limpiar selección
    setSelectedDistrict('')
  }

  const handleAddAllDistrictsFromProvince = () => {
    if (!selectedDepartment || !selectedProvince) {
      ToastFail('Selecciona departamento y provincia')
      return
    }

    const allDistricts = getDistrictsByProvince(selectedDepartment, selectedProvince)
    let addedCount = 0

    const newDistricts = [...districts]
    for (const distName of allDistricts) {
      const exists = newDistricts.some(
        d =>
          d.name.toLowerCase() === distName.toLowerCase() &&
          d.province.toLowerCase() === selectedProvince.toLowerCase() &&
          d.department.toLowerCase() === selectedDepartment.toLowerCase()
      )

      if (!exists) {
        newDistricts.push({
          name: distName,
          province: selectedProvince,
          department: selectedDepartment
        })
        addedCount++
      }
    }

    if (addedCount > 0) {
      setDistricts(newDistricts)
      ToastSuccess(`Se agregaron ${addedCount} distritos`)
    } else {
      ToastFail('Todos los distritos ya están agregados')
    }
  }

  const handleRemoveDistrict = (index: number) => {
    setDistricts(districts.filter((_, i) => i !== index))
  }

  const handleRemoveAllFromProvince = (department: string, province: string) => {
    setDistricts(
      districts.filter(
        d =>
          !(
            d.department.toLowerCase() === department.toLowerCase() &&
            d.province.toLowerCase() === province.toLowerCase()
          )
      )
    )
  }

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
        districts,
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

  // Filtrar distritos válidos y agrupar por departamento y provincia
  const validDistricts = districts.filter(
    (d) => d && d.name && d.province && d.department
  )

  const groupedDistricts = validDistricts.reduce(
    (acc, district) => {
      const key = `${district.department}|${district.province}`
      if (!acc[key]) {
        acc[key] = {
          department: district.department,
          province: district.province,
          districts: []
        }
      }
      acc[key].districts.push(district.name)
      return acc
    },
    {} as Record<string, { department: string; province: string; districts: string[] }>
  )

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
            placeholder="Ej: Lima Metropolitana"
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

      {/* Sección de distritos */}
      <div className="border-t pt-6">
        <h3 className="mb-4 text-lg font-semibold">Distritos incluidos</h3>

        {/* Formulario para agregar distrito con combos anidados */}
        <div className="mb-4 rounded-lg border border-dashed border-gray-300 bg-gray-50 p-4">
          <div className="grid gap-3 md:grid-cols-4">
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Departamento</label>
              <select
                value={selectedDepartment}
                onChange={(e) => setSelectedDepartment(e.target.value)}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="">Seleccionar...</option>
                {departments.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Provincia</label>
              <select
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
                disabled={!selectedDepartment}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Seleccionar...</option>
                {provinces.map((prov) => (
                  <option key={prov} value={prov}>
                    {prov}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-xs font-medium text-gray-600">Distrito</label>
              <select
                value={selectedDistrict}
                onChange={(e) => setSelectedDistrict(e.target.value)}
                disabled={!selectedProvince}
                className="w-full rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Seleccionar...</option>
                {availableDistricts.map((dist) => (
                  <option key={dist} value={dist}>
                    {dist}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end gap-2">
              <button
                type="button"
                onClick={handleAddDistrict}
                disabled={!selectedDistrict}
                className="flex items-center justify-center gap-1 rounded bg-blue-600 px-3 py-2 text-sm text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                <Plus size={16} />
                Agregar
              </button>
            </div>
          </div>

          {/* Botón para agregar todos los distritos de la provincia */}
          {selectedProvince && (
            <div className="mt-3 flex items-center gap-2">
              <button
                type="button"
                onClick={handleAddAllDistrictsFromProvince}
                className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
              >
                + Agregar todos los distritos de {selectedProvince}
              </button>
              <span className="text-xs text-gray-400">
                ({availableDistricts.length} distritos disponibles)
              </span>
            </div>
          )}
        </div>

        {/* Lista de distritos agrupados */}
        {validDistricts.length === 0 ? (
          <p className="text-center text-sm text-gray-500">
            No hay distritos agregados. Agrega al menos uno para que la zona funcione.
          </p>
        ) : (
          <div className="space-y-3">
            {Object.values(groupedDistricts).map((group) => (
              <div
                key={`${group.department}|${group.province}`}
                className="rounded-lg border border-gray-200 bg-white"
              >
                <div className="flex items-center justify-between border-b border-gray-100 bg-gray-50 px-4 py-2">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-gray-700">
                      {group.department} / {group.province}
                    </span>
                    <span className="rounded-full bg-blue-100 px-2 py-0.5 text-xs text-blue-700">
                      {group.districts.length} distrito{group.districts.length !== 1 ? 's' : ''}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveAllFromProvince(group.department, group.province)}
                    className="text-xs text-red-500 hover:text-red-700 hover:underline"
                  >
                    Eliminar todos
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 p-3">
                  {group.districts.map((distName) => {
                    const distIndex = districts.findIndex(
                      (d) =>
                        d.name === distName &&
                        d.province === group.province &&
                        d.department === group.department
                    )
                    const uniqueKey = `${group.department}-${group.province}-${distName}`
                    return (
                      <span
                        key={uniqueKey}
                        className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700"
                      >
                        {distName}
                        <button
                          type="button"
                          onClick={() => handleRemoveDistrict(distIndex)}
                          className="ml-1 rounded-full p-0.5 text-gray-400 hover:bg-gray-200 hover:text-red-500"
                        >
                          <Trash2 size={12} />
                        </button>
                      </span>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
        <p className="mt-3 text-xs text-gray-500">
          {validDistricts.length} distrito{validDistricts.length !== 1 ? 's' : ''} en esta zona
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
