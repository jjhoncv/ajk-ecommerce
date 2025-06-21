'use client'
import { type ProductVariantData } from '@/services/product/productVariant'
import { type ProductVariants } from '@/types/domain'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import React, { useMemo, useState } from 'react'

interface ProductVariantAttributeSelectorProps {
  data: ProductVariantData
  allVariants: ProductVariants[]
  variant?: ProductVariants
  onVariantChange?: (newData: ProductVariantData) => void
  handleVariantChangePreview?: (attributeId: number, optionId: number) => void
  preview?: boolean
}

interface AttributeGroup {
  attributeId: number
  name: string
  displayType: string
  selectedValue: string
  selectedOptionId: number
  availableOptions: Array<{
    optionId: number
    value: string
    variantId: number
    image?: {
      imageUrlThumb: string
      altText?: string
    }
  }>
}

const ProductVariantAttributeSelector: React.FC<
  ProductVariantAttributeSelectorProps
> = ({
  allVariants,
  variant,
  onVariantChange,
  preview = false,
  handleVariantChangePreview
}) => {
  const router = useRouter()

  // Obtener la variante actual desde las variantes del producto usando el ID pasado como prop
  const currentVariant = variant || allVariants[0]

  const [loading, setLoading] = useState(false)

  // Calcular grupos de atributos inmediatamente usando useMemo
  const attributeGroups = useMemo(() => {
    const groups: Record<number, AttributeGroup> = {}

    if (!allVariants || allVariants.length === 0 || !currentVariant) {
      return groups
    }

    // Primero, identificar todos los atributos únicos desde la variante actual
    currentVariant?.variantAttributeOptions?.forEach((vao) => {
      if (vao?.attributeOption?.attribute) {
        const attr = vao.attributeOption.attribute
        const attributeId = attr.id

        if (!groups[attributeId]) {
          groups[attributeId] = {
            attributeId,
            name: attr.name,
            displayType: attr.displayType,
            selectedValue: vao.attributeOption.value,
            selectedOptionId: vao.attributeOption.id,
            availableOptions: []
          }
        }
      }
    })

    // Llenar opciones disponibles para cada atributo desde todas las variantes
    Object.keys(groups).forEach((attrIdStr) => {
      const attributeId = parseInt(attrIdStr)
      const optionsSet = new Set<string>()

      allVariants.forEach((v) => {
        if (!v?.variantAttributeOptions) {
          return
        }

        // Buscar si esta variante tiene este atributo
        const vao = v.variantAttributeOptions.find(
          (vao) => vao?.attributeOption?.attributeId === attributeId
        )

        if (vao?.attributeOption) {
          const optionKey = `${vao.attributeOption.id}-${vao.attributeOption.value}`
          if (!optionsSet.has(optionKey)) {
            optionsSet.add(optionKey)

            // Buscar imagen para esta opción desde attributeOptionImages
            const optionImage = vao.attributeOption.attributeOptionImages?.[0]

            groups[attributeId].availableOptions.push({
              optionId: vao.attributeOption.id,
              value: vao.attributeOption.value,
              variantId: v.id,
              image: optionImage
                ? {
                    imageUrlThumb: optionImage.imageUrlThumb,
                    altText: optionImage.altText || undefined
                  }
                : undefined
            })
          }
        }
      })
    })

    return groups
  }, [allVariants, currentVariant?.id])

  // Manejar cambio de atributo
  const handleAttributeChange = async (
    attributeId: number,
    optionId: number
  ) => {
    if (preview) {
      handleVariantChangePreview?.(attributeId, optionId)
      return
    }

    // Encontrar la variante que tiene esta opción específica
    const targetVariant = allVariants.find((v) => {
      return v?.variantAttributeOptions?.some(
        (vao) => vao?.attributeOption?.id === optionId
      )
    })

    if (targetVariant && targetVariant.id !== currentVariant?.id) {
      try {
        setLoading(true)

        // Obtener datos completos de la nueva variante
        const response = await fetch(
          `/api/productos/variante/${targetVariant.id}`
        )

        if (response.ok) {
          const newVariantData = await response.json()

          // Actualizar URL sin recargar la página
          router.push(`/productos/variante/${targetVariant.id}`, {
            scroll: false
          })

          // Notificar al componente padre para actualizar los datos
          onVariantChange?.(newVariantData)
        } else {
          console.error('Error loading variant data:', response.statusText)
        }
      } catch (error) {
        console.error('Error loading variant:', error)
      } finally {
        setLoading(false)
      }
    }
  }

  // Verificar si una opción está disponible considerando las combinaciones válidas
  const isOptionAvailable = (
    attributeId: number,
    optionId: number
  ): boolean => {
    if (!allVariants || allVariants.length === 0 || !currentVariant) {
      return true
    }

    // Obtener los otros atributos de la variante actual (excluyendo el atributo que estamos evaluando)
    const currentOtherAttributes =
      currentVariant.variantAttributeOptions
        ?.filter((vao) => vao?.attributeOption?.attributeId !== attributeId)
        ?.map((vao) => vao?.attributeOption?.id)
        ?.filter(Boolean) || []

    // Buscar si existe alguna variante que tenga esta opción Y todos los otros atributos actuales
    return allVariants.some((variant) => {
      if (!variant?.variantAttributeOptions) return false

      // Verificar si esta variante tiene la opción que estamos evaluando
      const hasTargetOption = variant.variantAttributeOptions.some(
        (vao) => vao?.attributeOption?.id === optionId
      )

      if (!hasTargetOption) return false

      // Verificar si esta variante también tiene todos los otros atributos actuales
      const variantOptionIds =
        variant.variantAttributeOptions
          ?.map((vao) => vao?.attributeOption?.id)
          ?.filter(Boolean) || []

      return currentOtherAttributes.every((optionId) =>
        variantOptionIds.includes(optionId)
      )
    })
  }

  // Renderizar selector según el tipo de display
  const renderAttributeSelector = (group: AttributeGroup) => {
    switch (group.displayType.toLowerCase()) {
      case 'color':
        return (
          <div key={group.attributeId} className="mb-6">
            <h3 className="mb-3 text-sm font-medium text-gray-900">
              {group.name}:{' '}
              <span className="font-normal text-gray-600">
                {group.selectedValue}
              </span>
            </h3>
            <div className="flex flex-wrap gap-3">
              {group.availableOptions.map((option) => {
                const isSelected = group.selectedOptionId === option.optionId
                // const isAvailable = isOptionAvailable(group.attributeId, option.optionId);
                const isAvailable = true

                return (
                  <button
                    key={option.optionId}
                    onClick={async () => {
 await (isAvailable &&
                      handleAttributeChange(group.attributeId, option.optionId))
}
                    }
                    disabled={!isAvailable || loading}
                    className={`relative h-16 w-16 overflow-hidden border-2 ${
                      isSelected
                        ? 'border-primary'
                        : 'border-gray-200 hover:border-gray-500'
                    } ${!isAvailable ? 'cursor-not-allowed opacity-50' : ''} ${loading ? 'opacity-50' : ''}`}
                    title={option.value}
                  >
                    {option.image ? (
                      <Image
                        src={option.image.imageUrlThumb}
                        alt={option.image.altText || option.value}
                        fill
                        sizes="64px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-100 text-xs text-gray-500">
                        {option.value}
                      </div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>
        )

      case 'pills':
        return (
          <div key={group.attributeId} className="mb-6">
            <h3 className="mb-3 text-sm font-medium text-gray-900">
              {group.name}:{' '}
              <span className="font-normal text-gray-600">
                {group.selectedValue}
              </span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {group.availableOptions.map((option) => {
                const isSelected = group.selectedOptionId === option.optionId
                const isAvailable = isOptionAvailable(
                  group.attributeId,
                  option.optionId
                )

                return (
                  <button
                    key={option.optionId}
                    onClick={async () =>
                      await (isAvailable &&
                      handleAttributeChange(group.attributeId, option.optionId))
                    }
                    disabled={!isAvailable || loading}
                    className={`border px-4 py-2 text-sm font-medium ${
                      isSelected
                        ? 'border-primary bg-primary text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    } ${!isAvailable ? 'cursor-not-allowed opacity-50' : ''} ${loading ? 'opacity-50' : ''}`}
                  >
                    {option.value}
                  </button>
                )
              })}
            </div>
          </div>
        )

      case 'radio':
        return (
          <div key={group.attributeId} className="mb-6">
            <h3 className="mb-3 text-sm font-medium text-gray-900">
              {group.name}:{' '}
              <span className="font-normal text-gray-600">
                {group.selectedValue}
              </span>
            </h3>
            <div className="grid grid-cols-3 gap-2">
              {group.availableOptions.map((option) => {
                const isSelected = group.selectedOptionId === option.optionId
                const isAvailable = isOptionAvailable(
                  group.attributeId,
                  option.optionId
                )

                return (
                  <button
                    key={option.optionId}
                    onClick={async () =>
                      await (isAvailable &&
                      handleAttributeChange(group.attributeId, option.optionId))
                    }
                    disabled={!isAvailable || loading}
                    className={`rounded border px-3 py-2 text-sm ${
                      isSelected
                        ? 'border-primary bg-black text-white'
                        : 'border-gray-300 bg-white text-gray-700 hover:bg-gray-50'
                    } ${!isAvailable ? 'cursor-not-allowed opacity-50' : ''} ${loading ? 'opacity-50' : ''}`}
                  >
                    {option.value}
                  </button>
                )
              })}
            </div>
          </div>
        )

      default:
        return (
          <div key={group.attributeId} className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-900">
              {group.name}
            </label>
            <select
              value={group.selectedOptionId}
              onChange={async (e) => {
 await handleAttributeChange(
                  group.attributeId,
                  parseInt(e.target.value)
                )
}
              }
              disabled={loading}
              className="block w-full border border-gray-300 bg-white px-3 py-2 shadow-sm focus:border-black focus:outline-none focus:ring-black disabled:opacity-50"
            >
              {group.availableOptions.map((option) => {
                const isAvailable = isOptionAvailable(
                  group.attributeId,
                  option.optionId
                )
                return (
                  <option
                    key={option.optionId}
                    value={option.optionId}
                    disabled={!isAvailable}
                  >
                    {option.value} {!isAvailable && '(No disponible)'}
                  </option>
                )
              })}
            </select>
          </div>
        )
    }
  }

  if (loading && Object.keys(attributeGroups).length === 0) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="mb-3 h-4 w-1/4 rounded bg-gray-200"></div>
          <div className="flex gap-3">
            <div className="h-16 w-16 rounded-lg bg-gray-200"></div>
            <div className="h-16 w-16 rounded-lg bg-gray-200"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {Object.values(attributeGroups).map(renderAttributeSelector)}
    </div>
  )
}

export default ProductVariantAttributeSelector
