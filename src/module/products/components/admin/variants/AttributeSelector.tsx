'use client'
import { Select } from '@/module/shared/components/Form/Input/Select'
import { type FC, useState } from 'react'

interface AttributeWithOptions {
  id: number
  name: string
  displayType: string
  options?: Array<{
    id: number
    value: string
    additionalCost: number
  }>
}

interface AttributeSelectorProps {
  attributes: AttributeWithOptions[]
  selectedAttributes?: Record<number, number> // attributeId -> optionId
  attributeCosts?: Record<number, number> // optionId -> cost
  onChange: (selectedAttributes: Record<number, number>) => void
  onCostChange?: (attributeCosts: Record<number, number>) => void
}

export const AttributeSelector: FC<AttributeSelectorProps> = ({
  attributes,
  selectedAttributes = {},
  attributeCosts = {},
  onChange,
  onCostChange
}) => {
  const [selected, setSelected] = useState<Record<number, number>>(
    selectedAttributes
  )
  const [costs, setCosts] = useState<Record<number, number>>(attributeCosts)

  const handleChange = (attributeId: number, optionId: string) => {
    const newSelected = {
      ...selected,
      [attributeId]: optionId === '' ? 0 : parseInt(optionId, 10)
    }

    // Eliminar si es 0 (no seleccionado)
    if (newSelected[attributeId] === 0) {
      delete newSelected[attributeId]
    }

    setSelected(newSelected)
    onChange(newSelected)
  }

  const handleCostChange = (optionId: number, cost: string) => {
    const costValue = cost === '' ? 0 : parseFloat(cost)
    const newCosts = {
      ...costs,
      [optionId]: costValue
    }

    // Eliminar si es 0
    if (costValue === 0) {
      delete newCosts[optionId]
    }

    setCosts(newCosts)
    if (onCostChange) {
      onCostChange(newCosts)
    }
  }

  if (!attributes || attributes.length === 0) {
    return (
      <div className="rounded-lg border border-gray-200 bg-gray-50 p-4">
        <p className="text-sm text-gray-500">
          No hay atributos disponibles. Crea atributos primero en la sección de
          Atributos.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="border-b pb-2">
        <h3 className="text-sm font-semibold uppercase text-gray-700">
          Atributos de la variante
        </h3>
        <p className="mt-1 text-xs text-gray-500">
          Selecciona las características específicas de esta variante
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {attributes.map((attribute) => (
          <div key={attribute.id} className="space-y-2">
            <Select
              label={attribute.name}
              value={selected[attribute.id]?.toString() || ''}
              onChange={(e) => handleChange(attribute.id, e.target.value)}
            >
              <option value="">Sin seleccionar</option>
              {attribute.options?.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.value}
                </option>
              ))}
            </Select>

            {selected[attribute.id] && (
              <div>
                <label className="mb-1 block text-xs font-medium text-gray-700">
                  Costo adicional (S/)
                </label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={costs[selected[attribute.id]] || ''}
                  onChange={(e) =>
                    handleCostChange(selected[attribute.id], e.target.value)
                  }
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Costo adicional para esta opción en esta variante específica
                </p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}
