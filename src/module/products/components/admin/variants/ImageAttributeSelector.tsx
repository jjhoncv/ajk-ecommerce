'use client'
import { type FC } from 'react'

interface Attribute {
  id: number
  name: string
  displayType: string
}

interface ImageAttributeSelectorProps {
  attributes: Attribute[]
  selectedImageAttributeId?: number | null
  onChange: (attributeId: number | null) => void
}

export const ImageAttributeSelector: FC<ImageAttributeSelectorProps> = ({
  attributes,
  selectedImageAttributeId,
  onChange
}) => {
  return (
    <div className="rounded-lg border border-blue-200 bg-blue-50 p-4">
      <h3 className="mb-2 text-sm font-semibold text-blue-900">
        Control de Imágenes
      </h3>
      <p className="mb-3 text-xs text-blue-700">
        Selecciona qué atributo controlará las imágenes de esta variante
      </p>

      <select
        value={selectedImageAttributeId ?? ''}
        onChange={(e) => {
          const value = e.target.value
          onChange(value === '' ? null : Number(value))
        }}
        className="w-full rounded border border-blue-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
      >
        <option value="">
          Ninguno (usar imágenes propias de la variante)
        </option>
        {attributes.map((attr) => (
          <option key={attr.id} value={attr.id}>
            {attr.name} ({attr.displayType})
          </option>
        ))}
      </select>

      {selectedImageAttributeId && (
        <div className="mt-2 rounded bg-blue-100 p-2 text-xs text-blue-800">
          ℹ️ Las imágenes se mostrarán desde las opciones del atributo
          seleccionado
        </div>
      )}

      {!selectedImageAttributeId && (
        <div className="mt-2 rounded bg-gray-100 p-2 text-xs text-gray-700">
          ℹ️ Las imágenes se subirán directamente a esta variante
        </div>
      )}
    </div>
  )
}
