'use client'
import React from 'react'
import { ProductCardVariantsProps } from './ProductCard.interfaces'
import { groupAttributesByName } from './ProductCard.helpers'

const ProductCardVariants: React.FC<ProductCardVariantsProps> = ({
  variantProduct,
  selectedVariantIndex,
  setSelectedVariantIndex
}) => {
  const selectedVariant = variantProduct.variants[selectedVariantIndex]

  // Agrupar atributos por nombre para mostrar opciones
  const attributeGroups = groupAttributesByName(variantProduct.variants)

  return (
    <div className="space-y-2">
      {Object.entries(attributeGroups).map(([attrName, values]) => (
        <div key={attrName} className="flex items-center text-sm">
          <span className="mr-2 text-gray-500">{attrName}:</span>
          <div className="flex flex-wrap gap-1">
            {Array.from(values).map((value) => {
              // Verificar si la variante seleccionada tiene este atributo con este valor
              const isSelected = selectedVariant.attributes.some(
                (attr) => attr.name === attrName && attr.value === value
              )

              // Encontrar variantes con este atributo
              const variantWithAttr = variantProduct.variants.findIndex(
                (variant) =>
                  variant.attributes.some(
                    (attr) => attr.name === attrName && attr.value === value
                  )
              )

              // Determinar el tipo de visualización para este atributo
              const attribute = selectedVariant.attributes.find(
                (attr) => attr.name === attrName
              )
              const displayType = attribute?.display_type || 'pills'

              // Clases según el tipo de visualización
              let buttonClasses = 'text-xs px-2 py-0.5 rounded cursor-pointer '

              if (displayType === 'color') {
                // Para atributos de tipo color
                buttonClasses += isSelected
                  ? 'ring-2 ring-primary border border-white'
                  : 'ring-1 ring-gray-300 border border-white'

                // Intentar interpretar el valor como un color
                const isColorValue =
                  /^#([0-9A-F]{3}){1,2}$/i.test(value) ||
                  [
                    'black',
                    'white',
                    'red',
                    'blue',
                    'green',
                    'yellow',
                    'purple',
                    'gray',
                    'silver'
                  ].includes(value.toLowerCase())

                if (isColorValue) {
                  return (
                    <button
                      key={value}
                      title={value}
                      className={buttonClasses}
                      style={{
                        backgroundColor: value.toLowerCase(),
                        width: '24px',
                        height: '24px',
                        borderRadius: '50%'
                      }}
                      onClick={(e) => {
                        e.preventDefault()
                        if (variantWithAttr >= 0) {
                          setSelectedVariantIndex(variantWithAttr)
                        }
                      }}
                    />
                  )
                }
              }

              // Para otros tipos de atributos (pills, radio, select, custom)
              buttonClasses += isSelected
                ? 'bg-primary/10 text-primary border border-primary'
                : 'bg-gray-100 text-gray-700 border border-transparent'

              return (
                <button
                  key={value}
                  className={buttonClasses}
                  onClick={(e) => {
                    e.preventDefault()
                    if (variantWithAttr >= 0) {
                      setSelectedVariantIndex(variantWithAttr)
                    }
                  }}
                >
                  {value}
                </button>
              )
            })}
          </div>
        </div>
      ))}

      {/* Precio */}
      <div className="mt-3 flex items-center gap-2">
        <span className="text-lg font-bold text-primary">
          S/{' '}
          {selectedVariant.promotion?.promotionPrice || selectedVariant.price}
        </span>

        {/* Mostrar precio original si hay promoción */}
        {selectedVariant.promotion && (
          <span className="text-sm text-gray-500 line-through">
            S/ {selectedVariant.price}
          </span>
        )}
      </div>
    </div>
  )
}

export default ProductCardVariants
