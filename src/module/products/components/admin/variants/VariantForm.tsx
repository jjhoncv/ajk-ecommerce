'use client'
import { FormCreate } from '@/module/shared/components/FormCreate/FormCreate'
import { type Field } from '@/module/shared/components/FormCreate/types/fileManagement'
import { type FC, useState } from 'react'
import { AttributeSelector } from './AttributeSelector'
import { ImageAttributeSelector } from './ImageAttributeSelector'

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

interface VariantFormProps {
  type?: 'new' | 'edit'
  productId: string
  fields: Field[]
  attributes: AttributeWithOptions[]
  selectedAttributes?: Record<number, number>
  attributeCosts?: Record<number, number>
  imageAttributeId?: number | null
  customFields?: object
  redirectUrl: string
}

export const VariantForm: FC<VariantFormProps> = ({
  type = 'new',
  productId,
  fields,
  attributes,
  selectedAttributes = {},
  attributeCosts = {},
  imageAttributeId = null,
  customFields = {},
  redirectUrl
}) => {
  const [attributesSelected, setAttributesSelected] = useState<Record<number, number>>(
    selectedAttributes
  )
  const [costs, setCosts] = useState<Record<number, number>>(attributeCosts)
  const [selectedImageAttributeId, setSelectedImageAttributeId] = useState<number | null>(
    imageAttributeId ?? null
  )

  // Agregar el campo attributes, attribute_costs e image_attribute_id al customFields para enviarlo al API
  const enhancedCustomFields = {
    ...customFields,
    attributes: JSON.stringify(attributesSelected),
    attribute_costs: JSON.stringify(costs),
    image_attribute_id: selectedImageAttributeId?.toString() ?? ''
  }

  return (
    <div className="space-y-6">
      {/* Formulario de variante (SKU, Precio, Stock) */}
      <FormCreate
        type={type}
        api={{
          url: `/api/admin/products/${productId}/variants`,
          method: type === 'edit' ? 'PATCH' : 'POST',
          withFiles: true
        }}
        form={{
          redirect: redirectUrl,
          fields,
          customFields: enhancedCustomFields
        }}
      />

      {/* Selector de atributos - se muestra como una sección separada */}
      {attributes.length > 0 && (
        <div className="rounded-lg border border-gray-200 bg-white p-6">
          <AttributeSelector
            attributes={attributes}
            selectedAttributes={attributesSelected}
            attributeCosts={costs}
            onChange={setAttributesSelected}
            onCostChange={setCosts}
          />
        </div>
      )}

      {/* Selector de atributo que controla imágenes */}
      {attributes.length > 0 && (
        <ImageAttributeSelector
          attributes={attributes}
          selectedImageAttributeId={selectedImageAttributeId}
          onChange={setSelectedImageAttributeId}
        />
      )}
    </div>
  )
}
