import {
  ProductSearchItemMapper,
  VariantSearchResultsMapper
} from './Search.mapper'
import oSearchRep from './Search.repository'

// Module dependencies
import { attributeModel } from '@/module/attributes/core'
import { brandModel } from '@/module/brands/core'
import { categoryModel } from '@/module/categories/core'
import { productVariantModel } from '@/module/products/core'

import { type AvailableFilters } from './Filters.interfaces'
import {
  type ProductSearchFilters,
  type ProductSearchItem,
  type ProductSearchResult
} from './Search.interfaces'

export class SearchModel {
  public async searchProducts(
    filters: ProductSearchFilters
  ): Promise<ProductSearchResult> {
    // Obtener resultados de busqueda de variantes
    const { results, totalCount } =
      await oSearchRep.searchProductVariants(filters)

    // Mapear los resultados
    const mappedResults = VariantSearchResultsMapper(results)

    // Procesar cada variante como un producto individual
    const productSearchItems = await Promise.all(
      mappedResults.map(async (variantResult) => {
        // Obtener detalles completos de la variante
        const variantDetail = await productVariantModel.getProductVariant(
          variantResult.variantId
        )

        if (!variantDetail) {
          return null
        }

        // Obtener la marca
        const brand = await brandModel.getBrandById(variantResult.brandId)

        // Obtener las categorias
        const categories = await categoryModel.getCategoriesByProductId(
          variantResult.productId
        )

        // Encontrar la imagen principal de la variante
        let mainImage: string | undefined
        let imagesToUse = variantDetail.variantImages || []

        // Si la variante tiene imageAttributeId, obtener imagenes del atributo
        if (variantDetail.imageAttributeId && variantDetail.variantAttributeOptions) {
          // Buscar la opcion del atributo que controla las imagenes
          const imageControlOption = variantDetail.variantAttributeOptions.find(
            (attr) => attr?.productAttributeOption?.attributeId === variantDetail.imageAttributeId
          )

          if (imageControlOption?.productAttributeOption?.productAttributeOptionImages) {
            const attributeImages = imageControlOption.productAttributeOption.productAttributeOptionImages
            if (attributeImages && attributeImages.length > 0) {
              imagesToUse = attributeImages as typeof imagesToUse
            }
          }
        }

        if (imagesToUse && imagesToUse.length > 0) {
          const primaryImage = imagesToUse.find(
            (img) => img?.isPrimary
          )
          mainImage = primaryImage
            ? primaryImage.imageUrlNormal
            : imagesToUse[0]?.imageUrlNormal
        }

        // Crear ProductSearchItem usando el mapper
        const mappedItem = ProductSearchItemMapper(
          variantResult,
          variantDetail,
          brand?.name || '',
          categories?.map((cat) => ({
            id: cat.id,
            name: cat.name
          })) || [],
          mainImage
        )

        return mappedItem
      })
    )

    // Filtrar posibles nulos
    const filteredProductSearchItems = productSearchItems
      .filter((item): item is NonNullable<typeof item> => item !== null)
      .map((item) => ({
        ...item,
        minVariantPrice: item.minVariantPrice || item.basePrice || 0
      }))

    // Calcular informacion de paginacion
    const page = filters.page || 1
    const limit = filters.limit || 10
    const totalPages = Math.ceil(totalCount / limit)

    // Generar filtros con contadores basados en los productos encontrados
    const generatedFilters = await this.generateFiltersFromProducts(
      filteredProductSearchItems
    )

    return {
      products: filteredProductSearchItems,
      totalCount,
      page,
      totalPages,
      filters: generatedFilters
    }
  }

  public async searchProductVariants(filters: ProductSearchFilters) {
    return await this.searchProducts(filters)
  }

  public async getSearchSuggestions(
    query: string,
    limit: number = 10
  ): Promise<string[]> {
    return await oSearchRep.getSearchSuggestions(query, limit)
  }

  // Metodo privado para generar filtros con contadores
  private async generateFiltersFromProducts(
    products: ProductSearchItem[]
  ): Promise<AvailableFilters> {
    // Obtener todos los atributos para mapear nombres
    const allAttributes = await attributeModel.getAttributes()
    const attributeNameMap = new Map<number, string>()
    allAttributes?.forEach((attr) => {
      attributeNameMap.set(attr.id, attr.name)
    })

    // Contadores para categorias
    const categoryCount = new Map<
      number,
      {
        name: string
        count: number
      }
    >()

    // Contadores para marcas
    const brandCount = new Map<
      number,
      {
        name: string
        count: number
      }
    >()

    // Contadores para promociones
    const promotionCount = new Map<
      number,
      {
        name: string
        type: string
        count: number
      }
    >()

    // Rango de precios
    let minPrice = Infinity
    let maxPrice = 0

    // Contadores para atributos (agrupados por valor, no por ID)
    const attributeCount = new Map<
      number,
      {
        name: string
        options: Map<
          string, // Clave es el valor del atributo (ej: "Blanco")
          {
            ids: Set<number> // Todos los IDs de product_attribute_options con este valor
            value: string
            count: number
          }
        >
      }
    >()

    products.forEach((product) => {
      // Contar categorias
      if (product.categories) {
        product.categories.forEach((category) => {
          const existing = categoryCount.get(category.id)
          if (existing) {
            existing.count++
          } else {
            categoryCount.set(category.id, { name: category.name, count: 1 })
          }
        })
      }

      // Contar marcas
      if (product.brandId && product.brandName) {
        const existing = brandCount.get(product.brandId)
        if (existing) {
          existing.count++
        } else {
          brandCount.set(product.brandId, { name: product.brandName, count: 1 })
        }
      }

      // Contar promociones
      if (product.variants) {
        product.variants.forEach((variant) => {
          if (
            variant.promotionVariants &&
            variant.promotionVariants.length > 0
          ) {
            variant.promotionVariants.forEach((promotionVariant) => {
              if (promotionVariant?.promotion) {
                const promotion = promotionVariant.promotion
                const existing = promotionCount.get(promotion.id)

                if (existing) {
                  existing.count++
                } else {
                  promotionCount.set(promotion.id, {
                    name: promotion.name ?? '',
                    type: promotion.type ?? '',
                    count: 1
                  })
                }
              }
            })
          }
        })
      }

      // Calcular rango de precios
      const price = product.minVariantPrice || product.basePrice || 0
      if (price > 0) {
        minPrice = Math.min(minPrice, price)
        maxPrice = Math.max(maxPrice, price)
      }

      // Contar atributos unicos por valor (evitar duplicados)
      const processedAttributeValues = new Set<string>()

      if (product.variants) {
        product.variants.forEach((variant) => {
          if (variant.variantAttributeOptions) {
            variant.variantAttributeOptions.forEach((variantAttr) => {
              if (variantAttr?.productAttributeOption) {
                const option = variantAttr.productAttributeOption
                const attributeId = option.attributeId
                const uniqueKey = `${product.id}-${attributeId}-${option.value}`

                // Solo procesar si no hemos visto esta combinacion producto-atributo-valor
                if (!processedAttributeValues.has(uniqueKey)) {
                  processedAttributeValues.add(uniqueKey)

                  if (!attributeCount.has(attributeId)) {
                    // Usar el nombre real del atributo
                    const attributeName =
                      attributeNameMap.get(attributeId) ||
                      `Atributo ${attributeId}`
                    attributeCount.set(attributeId, {
                      name: attributeName,
                      options: new Map()
                    })
                  }

                  const attribute = attributeCount.get(attributeId)!

                  // Buscar si ya existe una opcion con el mismo valor (agrupando por valor)
                  const existingOption = attribute.options.get(option.value)

                  if (existingOption) {
                    // Agregar el ID a la lista y incrementar contador
                    existingOption.ids.add(option.id)
                    existingOption.count++
                  } else {
                    // Crear nueva opcion con el valor como clave
                    attribute.options.set(option.value, {
                      ids: new Set([option.id]),
                      value: option.value,
                      count: 1
                    })
                  }
                }
              }
            })
          }
        })
      }
    })

    return {
      categories: Array.from(categoryCount.entries()).map(([id, data]) => ({
        id,
        name: data.name,
        count: data.count
      })),
      brands: Array.from(brandCount.entries()).map(([id, data]) => ({
        id,
        name: data.name,
        count: data.count
      })),
      priceRange: {
        min: minPrice === Infinity ? 0 : minPrice,
        max: maxPrice
      },
      attributes: Array.from(attributeCount.entries()).map(([id, data]) => ({
        id,
        name: data.name,
        displayType: 'pills' as const,
        options: Array.from(data.options.entries()).map(
          ([, optionData]) => ({
            // Combinar todos los IDs en un string separado por comas
            id: Array.from(optionData.ids).join(','),
            value: optionData.value,
            count: optionData.count
          })
        )
      })),
      promotions: Array.from(promotionCount.entries()).map(([id, data]) => ({
        id,
        name: data.name,
        type: data.type,
        count: data.count
      }))
    }
  }
}

const searchModel = new SearchModel()
export default searchModel
