'use client'
import { FormCreate } from '@/module/shared/components/FormCreate/FormCreate'
import { type Field } from '@/module/shared/components/FormCreate/types/fileManagement'
import { type FC, useState } from 'react'
import { AttributeSelector } from './AttributeSelector'

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
  customFields?: object
  redirectUrl: string
}

export const VariantForm: FC<VariantFormProps> = ({
  type = 'new',
  productId,
  fields,
  attributes,
  selectedAttributes = {},
  customFields = {},
  redirectUrl
}) => {
  const [attributesSelected, setAttributesSelected] = useState<Record<number, number>>(
    selectedAttributes
  )

  // Agregar el campo attributes al customFields para enviarlo al API
  const enhancedCustomFields = {
    ...customFields,
    attributes: JSON.stringify(attributesSelected)
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
            onChange={setAttributesSelected}
          />
        </div>
      )}
    </div>
  )
}
