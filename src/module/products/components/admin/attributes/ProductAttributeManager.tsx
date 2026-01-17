'use client'
import { Alert } from '@/module/shared/components/Alert/Alert'
import { ToastFail, ToastSuccess } from '@/module/shared/lib/splash'
import { type Attributes } from '@/types/domain'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { type FC, useState } from 'react'

interface AssignedAttribute {
  id: number
  name: string
  displayType: string
  options: Array<{
    id: number
    value: string
    displayOrder?: number
  }>
}

interface UsageStat {
  id: number
  product_id: number
  attribute_id: number
  attribute_name: string
  display_type: string
  option_value: string
  variants_using: number
}

interface ProductAttributeManagerProps {
  productId: number
  productName: string
  attributes: Attributes[] // Solo atributos base (Color, Almacenamiento, etc.)
  assignedAttributes: AssignedAttribute[]
  usageStats: UsageStat[]
}

export const ProductAttributeManager: FC<ProductAttributeManagerProps> = ({
  productId,
  productName,
  attributes,
  assignedAttributes: initialAssigned,
  usageStats: initialStats
}) => {
  const router = useRouter()
  const [assignedAttributes, setAssignedAttributes] = useState(initialAssigned)
  const [usageStats, setUsageStats] = useState(initialStats)

  // Estado para crear nueva opción
  const [selectedAttribute, setSelectedAttribute] = useState<number | null>(null)
  const [newOptionValue, setNewOptionValue] = useState('')
  const [isCreating, setIsCreating] = useState(false)

  // Estado para editar opción
  const [editingOption, setEditingOption] = useState<{ id: number, value: string, attributeId: number } | null>(null)
  const [editOptionValue, setEditOptionValue] = useState('')

  // Estado para eliminar opción
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [optionToDelete, setOptionToDelete] = useState<{ id: number, name: string } | null>(null)

  // Estado para auditoría
  const [showAudit, setShowAudit] = useState(false)
  const [auditData, setAuditData] = useState<any>(null)
  const [showCleanupDialog, setShowCleanupDialog] = useState(false)

  // Obtener estadística de uso de una opción
  const getUsageCount = (optionId: number): number => {
    const stat = usageStats.find((s: any) => s.id === optionId)
    return stat?.variants_using || 0
  }

  // Crear nueva opción
  const handleCreateOption = async () => {
    if (!selectedAttribute || !newOptionValue.trim()) {
      ToastFail('Selecciona un atributo e ingresa un valor')
      return
    }

    setIsCreating(true)

    try {
      const response = await fetch(`/api/admin/products/${productId}/attributes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          attributeId: selectedAttribute,
          value: newOptionValue.trim()
        })
      })

      const result = await response.json()

      if (!result.success) {
        ToastFail(result.error || 'Error al crear la opción')
        setIsCreating(false)
        return
      }

      // Actualizar estado local
      const attribute = attributes.find(a => a.id === selectedAttribute)
      if (attribute) {
        setAssignedAttributes(prevAssigned => {
          const existingAttr = prevAssigned.find(a => a.id === selectedAttribute)
          if (existingAttr) {
            return prevAssigned.map(a => {
              if (a.id === selectedAttribute) {
                return {
                  ...a,
                  options: [
                    ...a.options,
                    {
                      id: result.data.id,
                      value: newOptionValue.trim(),
                      displayOrder: result.data.displayOrder
                    }
                  ]
                }
              }
              return a
            })
          } else {
            return [
              ...prevAssigned,
              {
                id: selectedAttribute,
                name: attribute.name,
                displayType: attribute.displayType,
                options: [{
                  id: result.data.id,
                  value: newOptionValue.trim(),
                  displayOrder: result.data.displayOrder
                }]
              }
            ]
          }
        })
      }

      ToastSuccess(`Opción "${newOptionValue}" creada exitosamente`)
      setNewOptionValue('')
      setSelectedAttribute(null)
      setIsCreating(false)
    } catch (error) {
      ToastFail(error instanceof Error ? error.message : 'Error al crear opción')
      setIsCreating(false)
    }
  }

  // Iniciar edición de opción
  const startEditOption = (optionId: number, optionValue: string, attributeId: number) => {
    setEditingOption({ id: optionId, value: optionValue, attributeId })
    setEditOptionValue(optionValue)
  }

  // Guardar edición de opción
  const handleSaveEditOption = async () => {
    if (!editingOption || !editOptionValue.trim()) {
      ToastFail('El valor no puede estar vacío')
      return
    }

    try {
      const response = await fetch(`/api/admin/products/${productId}/attributes`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          optionId: editingOption.id,
          value: editOptionValue.trim()
        })
      })

      const result = await response.json()

      if (!result.success) {
        ToastFail('Error al actualizar la opción')
        return
      }

      // Actualizar estado local
      setAssignedAttributes(prevAssigned =>
        prevAssigned.map(attr => ({
          ...attr,
          options: attr.options.map(opt =>
            opt.id === editingOption.id
              ? { ...opt, value: editOptionValue.trim() }
              : opt
          )
        }))
      )

      ToastSuccess('Opción actualizada exitosamente')
      setEditingOption(null)
      setEditOptionValue('')
    } catch (error) {
      ToastFail('Error al actualizar la opción')
    }
  }

  // Confirmar eliminación de opción
  const confirmDelete = (optionId: number, optionName: string) => {
    setOptionToDelete({ id: optionId, name: optionName })
    setShowDeleteDialog(true)
  }

  // Eliminar opción
  const handleDeleteOption = async () => {
    if (!optionToDelete) return

    try {
      const response = await fetch(`/api/admin/products/${productId}/attributes`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          optionId: optionToDelete.id
        })
      })

      const result = await response.json()

      if (!result.success) {
        ToastFail('Error al eliminar opción')
        return
      }

      // Actualizar estado local
      setAssignedAttributes(prevAssigned =>
        prevAssigned.map(attr => ({
          ...attr,
          options: attr.options.filter(opt => opt.id !== optionToDelete.id)
        })).filter(attr => attr.options.length > 0)
      )

      ToastSuccess('Opción eliminada exitosamente')
      setShowDeleteDialog(false)
      setOptionToDelete(null)
    } catch (error) {
      ToastFail(error instanceof Error ? error.message : 'Error al eliminar opción')
    }
  }

  // Obtener auditoría
  const handleAudit = async () => {
    try {
      const response = await fetch(`/api/admin/products/${productId}/attributes/audit`)
      const result = await response.json()

      if (result.success) {
        setAuditData(result.data)
        setShowAudit(true)
      } else {
        ToastFail('Error al obtener auditoría')
      }
    } catch (error) {
      ToastFail('Error al obtener auditoría')
    }
  }

  // Limpiar opciones no usadas
  const handleCleanup = async () => {
    try {
      const response = await fetch(`/api/admin/products/${productId}/attributes/audit`, {
        method: 'DELETE'
      })
      const result = await response.json()

      if (result.success) {
        const unusedOptionIds = usageStats
          .filter((s: any) => s.variants_using === 0)
          .map((s: any) => s.id)

        setAssignedAttributes(prevAssigned =>
          prevAssigned.map(attr => ({
            ...attr,
            options: attr.options.filter(opt => !unusedOptionIds.includes(opt.id))
          })).filter(attr => attr.options.length > 0)
        )

        ToastSuccess(result.message)
        setShowCleanupDialog(false)
      } else {
        ToastFail('Error al limpiar opciones')
      }
    } catch (error) {
      ToastFail('Error al limpiar opciones')
    }
  }

  return (
    <div className="space-y-6">
      {/* Header con información */}
      <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
        <h3 className="mb-2 text-sm font-semibold text-blue-900">
          ℹ️ Opciones Específicas de {productName}
        </h3>
        <p className="mb-2 text-xs text-blue-800">
          Aquí defines las opciones específicas de este producto. Por ejemplo:
        </p>
        <ul className="mb-3 list-inside list-disc space-y-1 text-xs text-blue-700">
          <li>Si es un iPhone 15: Color (Negro, Blanco, Azul) y Almacenamiento (128GB, 256GB)</li>
          <li>Si es un iPhone 16: Color (Titanio Negro, Titanio Blanco) y Almacenamiento (512GB, 1TB)</li>
        </ul>
        <p className="text-xs font-medium text-blue-900">
          ⚠️ IMPORTANTE: Cada producto tiene sus propias opciones independientes. Las opciones del iPhone 15 NO afectan al iPhone 16.
        </p>
      </div>

      {/* Herramientas de Auditoría */}
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Herramientas</h3>
            <p className="text-xs text-gray-600">Auditar y limpiar opciones no usadas</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleAudit}
              className="rounded-md border border-blue-600 px-3 py-1.5 text-sm font-medium text-blue-600 transition-colors hover:bg-blue-50"
            >
              📊 Ver Auditoría
            </button>
            <button
              onClick={() => { setShowCleanupDialog(true) }}
              className="rounded-md bg-red-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-red-700"
            >
              🧹 Limpiar No Usadas
            </button>
          </div>
        </div>
      </div>

      {/* Opciones Configuradas */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">
            Opciones Configuradas ({assignedAttributes.length} atributos)
          </h2>
          <Link
            href={`/admin/products/${productId}/variants`}
            className="text-sm text-blue-600 hover:text-blue-700"
          >
            Ver Variantes →
          </Link>
        </div>

        {assignedAttributes.length === 0 ? (
          <div className="rounded-lg border-2 border-dashed border-gray-300 p-8 text-center">
            <p className="mb-2 text-sm font-medium text-gray-700">
              No hay opciones configuradas
            </p>
            <p className="text-xs text-gray-500">
              Agrega opciones abajo para poder crear variantes
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {assignedAttributes.map((attribute) => (
              <div
                key={attribute.id}
                className="rounded-lg border border-gray-200 bg-gray-50 p-4"
              >
                <h3 className="mb-3 font-medium text-gray-900">
                  {attribute.name}
                  <span className="ml-2 text-xs text-gray-500">
                    ({attribute.options.length} opciones)
                  </span>
                </h3>
                <div className="flex flex-wrap gap-2">
                  {attribute.options.map((option) => {
                    const usageCount = getUsageCount(option.id)
                    return (
                      <div
                        key={option.id}
                        className="group relative flex items-center gap-2 rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm"
                      >
                        <span className="text-gray-700">{option.value}</span>
                        {usageCount > 0 && (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                            {usageCount} {usageCount === 1 ? 'variante' : 'variantes'}
                          </span>
                        )}
                        <div className="flex gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                          <button
                            onClick={() => { startEditOption(option.id, option.value, attribute.id) }}
                            className="text-blue-500 hover:text-blue-700"
                            title="Editar opción"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                              />
                            </svg>
                          </button>
                          <button
                            onClick={() => { confirmDelete(option.id, option.value) }}
                            className="text-red-500 hover:text-red-700"
                            title="Eliminar opción"
                          >
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                              />
                            </svg>
                          </button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Crear Nueva Opción */}
      <div className="rounded-lg border border-gray-200 bg-white p-6">
        <h2 className="mb-4 text-lg font-semibold text-gray-900">
          Crear Nueva Opción
        </h2>

        <div className="grid grid-cols-2 gap-4">
          {/* Selector de Atributo */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Atributo
            </label>
            <select
              value={selectedAttribute || ''}
              onChange={(e) => { setSelectedAttribute(Number(e.target.value) || null) }}
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
            >
              <option value="">-- Selecciona un atributo --</option>
              {attributes.map((attr) => (
                <option key={attr.id} value={attr.id}>
                  {attr.name} ({attr.displayType})
                </option>
              ))}
            </select>
          </div>

          {/* Input de Valor */}
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Valor
            </label>
            <input
              type="text"
              value={newOptionValue}
              onChange={(e) => { setNewOptionValue(e.target.value) }}
              placeholder="Ej: Titanio Negro, 128GB, etc."
              className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              disabled={!selectedAttribute}
              onKeyPress={(e) => {
                if (e.key === 'Enter' && !isCreating) {
                  handleCreateOption()
                }
              }}
            />
          </div>
        </div>

        <div className="mt-4">
          <button
            onClick={handleCreateOption}
            disabled={!selectedAttribute || !newOptionValue.trim() || isCreating}
            className="w-full rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isCreating ? 'Creando...' : 'Crear Opción'}
          </button>
        </div>
      </div>

      {/* Modal de Editar Opción */}
      {editingOption && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="w-full max-w-md rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                Editar Opción
              </h3>
              <button
                onClick={() => {
                  setEditingOption(null)
                  setEditOptionValue('')
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <p className="mb-3 text-sm text-gray-600">
                Editando:{' '}
                <strong className="text-gray-900">{editingOption.value}</strong>
              </p>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Nuevo valor
              </label>
              <input
                type="text"
                value={editOptionValue}
                onChange={(e) => { setEditOptionValue(e.target.value) }}
                placeholder="Ej: Titanio Azul Claro"
                className="w-full rounded-md border border-gray-300 px-3 py-2 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSaveEditOption()
                  }
                }}
              />
            </div>

            <div className="rounded-lg border border-blue-200 bg-blue-50 p-3 mb-4">
              <p className="text-xs text-blue-700">
                ℹ️ Este cambio solo afecta a este producto ({productName})
              </p>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => {
                  setEditingOption(null)
                  setEditOptionValue('')
                }}
                className="flex-1 rounded-md border border-gray-300 px-4 py-2 font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveEditOption}
                disabled={!editOptionValue.trim()}
                className="flex-1 rounded-md bg-blue-600 px-4 py-2 font-medium text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Dialog de confirmación de eliminación */}
      {showDeleteDialog && optionToDelete && (
        <Alert
          message={`¿Eliminar la opción "${optionToDelete.name}" de este producto?\n\nEsta acción es permanente y eliminará todas las imágenes asociadas si las hay.`}
          onSuccess={handleDeleteOption}
          onCancel={() => {
            setShowDeleteDialog(false)
            setOptionToDelete(null)
          }}
        />
      )}

      {/* Dialog de confirmación de limpieza */}
      {showCleanupDialog && (
        <Alert
          message="¿Eliminar todas las opciones no usadas en variantes?"
          onSuccess={handleCleanup}
          onCancel={() => { setShowCleanupDialog(false) }}
        />
      )}

      {/* Modal de Auditoría */}
      {showAudit && auditData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-lg bg-white p-6">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-900">
                📊 Auditoría de Atributos
              </h2>
              <button
                onClick={() => { setShowAudit(false) }}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Resumen */}
            <div className="mb-6 grid grid-cols-3 gap-4">
              <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
                <p className="text-sm text-blue-700">Total Atributos</p>
                <p className="text-2xl font-bold text-blue-900">{auditData.totalAttributes}</p>
              </div>
              <div className="rounded-lg border border-green-200 bg-green-50 p-4">
                <p className="text-sm text-green-700">Total Opciones</p>
                <p className="text-2xl font-bold text-green-900">{auditData.totalOptions}</p>
              </div>
              <div className="rounded-lg border border-red-200 bg-red-50 p-4">
                <p className="text-sm text-red-700">Opciones Sin Usar</p>
                <p className="text-2xl font-bold text-red-900">{auditData.unusedOptions}</p>
              </div>
            </div>

            {/* Detalles por Atributo */}
            <div className="space-y-4">
              {auditData.attributeGroups?.map((group: any) => (
                <div key={group.attributeId} className="rounded-lg border border-gray-200 p-4">
                  <div className="mb-3 flex items-center justify-between">
                    <h3 className="font-semibold text-gray-900">
                      {group.attributeName}
                      <span className="ml-2 text-sm text-gray-500">({group.displayType})</span>
                    </h3>
                    <div className="flex gap-3 text-sm">
                      <span className="text-green-600">
                        ✓ {group.usedOptions} usadas
                      </span>
                      {group.unusedOptions > 0 && (
                        <span className="text-red-600">
                          ✗ {group.unusedOptions} sin usar
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {group.options?.map((option: any) => (
                      <div
                        key={option.id}
                        className={`rounded border p-2 ${
                          option.isUsed
                            ? 'border-green-200 bg-green-50'
                            : 'border-red-200 bg-red-50'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className={`text-sm ${
                            option.isUsed ? 'text-green-900' : 'text-red-900'
                          }`}>
                            {option.optionValue}
                          </span>
                          {option.isUsed ? (
                            <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-700">
                              {option.variantsUsing} {option.variantsUsing === 1 ? 'variante' : 'variantes'}
                            </span>
                          ) : (
                            <span className="text-xs text-red-600">Sin usar</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex justify-end">
              <button
                onClick={() => { setShowAudit(false) }}
                className="rounded-md bg-gray-600 px-4 py-2 font-medium text-white transition-colors hover:bg-gray-700"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
