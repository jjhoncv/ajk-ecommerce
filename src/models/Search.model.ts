import { ProductSearchFilters, ProductSearchResult } from '@/types/search'

// Importar modelos para composición
import attributeModel from '@/models/Attribute.model'
import brandModel from '@/models/Brand.model'
import categoryModel from '@/models/Category.model'
import productVariantModel from '../backend/product-variant/ProductVariant.model'

// Importar repository y mappers
import {
  mapToProductSearchItem,
  mapVariantSearchResults
} from '@/mappers/mapSearch'
import oSearchRep from '@/repository/Search.repository'

export class SearchModel {
  public async searchProducts(
    filters: ProductSearchFilters
  ): Promise<ProductSearchResult> {
    // Obtener resultados de búsqueda de variantes
    const { results, totalCount } =
      await oSearchRep.searchProductVariants(filters)

    // Mapear los resultados
    const mappedResults = mapVariantSearchResults(results)

    // Procesar cada variante como un producto individual
    const productSearchItems = await Promise.all(
      mappedResults.map(async (variantResult) => {
        // Obtener detalles completos de la variante

        const variantDetail =
          await productVariantModel.getProductVariantComplete(
            variantResult.variantId
          )

        if (!variantDetail) {
          return null
        }

        // Obtener la marca
        const brand = await brandModel.getBrandById(variantResult.brandId)

        // Obtener las categorías
        const categories = await categoryModel.getCategoriesByProductId(
          variantResult.productId
        )

        // Encontrar la imagen principal de la variante
        let mainImage: string | undefined

        if (
          variantDetail.variantImages &&
          variantDetail.variantImages.length > 0
        ) {
          const primaryImage = variantDetail.variantImages.find(
            (img) => img?.isPrimary
          )
          mainImage = primaryImage
            ? primaryImage.imageUrlNormal
            : variantDetail.variantImages[0]?.imageUrlNormal
        }

        // Crear ProductSearchItem usando el mapper
        const mappedItem = mapToProductSearchItem(
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

    // Calcular información de paginación
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

  // Método privado para generar filtros con contadores
  private async generateFiltersFromProducts(products: any[]) {
    // Obtener todos los atributos para mapear nombres
    const allAttributes = await attributeModel.getAttributes()
    const attributeNameMap = new Map<number, string>()
    allAttributes?.forEach((attr) => {
      attributeNameMap.set(attr.id, attr.name)
    })

    // Contadores para categorías
    const categoryCount = new Map<number, { name: string; count: number }>()

    // Contadores para marcas
    const brandCount = new Map<number, { name: string; count: number }>()

    // Rango de precios
    let minPrice = Infinity
    let maxPrice = 0

    // Contadores para atributos
    const attributeCount = new Map<
      number,
      { name: string; options: Map<number, { value: string; count: number }> }
    >()

    products.forEach((product) => {
      // Contar categorías
      if (product.categories) {
        product.categories.forEach((category: any) => {
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

      // Calcular rango de precios
      const price = product.minVariantPrice || product.basePrice || 0
      if (price > 0) {
        minPrice = Math.min(minPrice, price)
        maxPrice = Math.max(maxPrice, price)
      }

      // Contar atributos únicos por valor (evitar duplicados)
      const processedAttributeValues = new Set<string>()

      if (product.variants) {
        product.variants.forEach((variant: any) => {
          if (variant.variantAttributeOptions) {
            variant.variantAttributeOptions.forEach((variantAttr: any) => {
              if (
                variantAttr.attributeOptions &&
                variantAttr.attributeOptions[0]
              ) {
                const option = variantAttr.attributeOptions[0]
                const attributeId = option.attributeId
                const uniqueKey = `${product.id}-${attributeId}-${option.value}`

                // Solo procesar si no hemos visto esta combinación producto-atributo-valor
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

                  // Buscar si ya existe una opción con el mismo valor
                  let existingOptionEntry = null
                  for (const [
                    optionId,
                    optionData
                  ] of attribute.options.entries()) {
                    if (optionData.value === option.value) {
                      existingOptionEntry = [optionId, optionData]
                      break
                    }
                  }

                  if (existingOptionEntry) {
                    // Incrementar contador de la opción existente
                    ;(
                      existingOptionEntry[1] as { value: string; count: number }
                    ).count++
                  } else {
                    // Crear nueva opción
                    attribute.options.set(option.id, {
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
          ([optionId, optionData]) => ({
            id: optionId,
            value: optionData.value,
            count: optionData.count
          })
        )
      }))
    }
  }
}

const searchModel = new SearchModel()
export default searchModel
