import { ProductSearchFilters, ProductSearchResult } from '@/types/search'

// Importar modelos para composición
import brandModel from '@/models/Brand.model'
import categoryModel from '@/models/Category.model'
import productVariantModel from '@/models/ProductVariant.model'

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
          await productVariantModel.getProductVariantByIdWithAttributeOptions(
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
        return mapToProductSearchItem(
          variantResult,
          variantDetail,
          brand?.name || '',
          categories?.map((cat) => ({
            id: cat.id,
            name: cat.name
          })) || [],
          mainImage
        )
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

    return {
      products: filteredProductSearchItems,
      totalCount,
      page,
      totalPages,
      filters: {
        categories: [],
        brands: [],
        priceRange: { min: 0, max: 0 },
        attributes: []
      }
    }
  }

  public async searchProductVariants(filters: ProductSearchFilters) {
    return await this.searchProducts(filters)
  }
}

const searchModel = new SearchModel()
export default searchModel
