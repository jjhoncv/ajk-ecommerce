// generated
import { type Products as ProductRaw } from '@/types/database'
import { type Products as Product, type VariantAttributeOptions } from '@/types/domain'

// me
import { ProductMapper, ProductsMapper } from './Product.mapper'
import oProductRep from './Product.repository'

// others
import brandModel from '@/backend/brand'
import categoryModel from '@/backend/category'
import filtersModel from '@/backend/filters'
import productVariantModel from '@/backend/product-variant'
import promotionVariantModel from '@/backend/promotion-variant'
import searchModel, {
  type ProductSearchFilters,
  type ProductSearchResult
} from '@/backend/search'
import variantAttributeOptionModel from '@/backend/variant-attribute-option'
import variantImageModel from '@/backend/variant-image'
import variantRatingModel, {
  type VariantRatingWithCustomer
} from '@/backend/variant-rating'

export class ProductModel {
  public async getProducts(): Promise<Product[] | undefined> {
    const productsRaw = await oProductRep.getProducts()
    const products = ProductsMapper(productsRaw)

    if (!products) return undefined

    // Cargar la marca y categorías de cada producto
    const productsWithData = await Promise.all(
      products.map(async (product) => {
        // Cargar marca
        if (product.brandId) {
          const brand = await brandModel.getBrandById(product.brandId)
          if (brand) product.brand = brand
        }

        // Cargar categorías
        const categories = await categoryModel.getCategoriesByProductId(product.id)
        if (categories) {
          product.productCategories = categories.map((category) => ({
            categoryId: category.id,
            productId: product.id,
            categories
          }))
        }

        return product
      })
    )

    return productsWithData
  }

  /**
   * Obtiene productos con estadísticas para el panel de administración
   * Incluye: conteo de variantes, stock total, rango de precios, imagen principal
   */
  public async getProductsForAdmin(): Promise<any[] | undefined> {
    const productsRaw = await oProductRep.getProducts()
    const products = ProductsMapper(productsRaw)

    if (!products) return undefined

    const productsWithStats = await Promise.all(
      products.map(async (product) => {
        // Cargar marca
        let brand = null
        if (product.brandId) {
          brand = await brandModel.getBrandById(product.brandId)
        }

        // Cargar variantes con sus datos
        const variants = await productVariantModel.getProductVariantsByProductId(product.id)

        // Calcular estadísticas de variantes
        const variantsCount = variants?.length ?? 0
        let totalStock = 0
        let minPrice = product.basePrice ?? 0
        let maxPrice = product.basePrice ?? 0
        let mainImage: string | null = null

        if (variants && variants.length > 0) {
          // Calcular stock total y rango de precios
          for (const variant of variants) {
            totalStock += variant.stock ?? 0
            const variantPrice = variant.price ?? 0
            if (variantPrice > 0) {
              if (minPrice === 0 || variantPrice < minPrice) minPrice = variantPrice
              if (variantPrice > maxPrice) maxPrice = variantPrice
            }
          }

          // Obtener imagen de la primera variante
          const firstVariantImages = await variantImageModel.getVariantImages(variants[0].id)
          if (firstVariantImages && firstVariantImages.length > 0) {
            // Buscar imagen principal o usar la primera
            const primaryImage = firstVariantImages.find(img => img.isPrimary) ?? firstVariantImages[0]
            mainImage = primaryImage.imageUrlThumb
          }
        }

        return {
          id: product.id,
          name: product.name,
          description: product.description,
          basePrice: product.basePrice,
          brand: brand ? { id: brand.id, name: brand.name } : null,
          variantsCount,
          totalStock,
          minPrice,
          maxPrice,
          mainImage,
          createdAt: product.createdAt
        }
      })
    )

    return productsWithStats
  }

  public async getProductFullById(id: number): Promise<Product | undefined> {
    const productRaw = await oProductRep.getProductById(id)
    if (!productRaw) return undefined
    const product = ProductMapper(productRaw)

    if (!product.brandId) return product
    const brand = await brandModel.getBrandById(product.brandId)
    if (!brand) return product
    product.brand = brand

    const categories = await categoryModel.getCategoriesByProductId(product.id)
    if (!categories) return product

    product.productCategories = categories.map((category) => ({
      categoryId: category.id,
      productId: product.id,
      categories
    }))

    const productVariants =
      await productVariantModel.getProductVariantsByProductId(product.id)

    if (!productVariants) return product

    product.productVariants = await Promise.all(
      productVariants.map(async (productVariant) => {
        const variantAttributeOptionWithDetails =
          await variantAttributeOptionModel.getVariantAttributeOptionsWithDetailsById(
            productVariant.id
          )

        const attributeOptions: VariantAttributeOptions[] =
          variantAttributeOptionWithDetails?.map((option) => ({
            variantId: option.variantId,
            productAttributeOptionId: option.productAttributeOptionId,
            additionalCost: option.additionalCost,
            productAttributeOption: option.productAttributeOption
          })) || []

        // Obtener imágenes de la variante
        const images = await variantImageModel.getVariantImages(id)

        return {
          ...productVariant,
          variantAttributeOptions: attributeOptions,
          variantImages: images
        }
      })
    )

    return product
  }

  public async getProductById(id: number): Promise<Product | undefined> {
    const productRaw = await oProductRep.getProductById(id)
    if (!productRaw) return undefined
    const product = ProductMapper(productRaw)

    if (!product.brandId) return product
    const brand = await brandModel.getBrandById(product.brandId)
    if (!brand) return product
    product.brand = brand

    const categories = await categoryModel.getCategoriesByProductId(product.id)
    if (!categories) return product

    product.productCategories = categories.map((category) => ({
      categoryId: category.id,
      productId: product.id,
      categories
    }))

    const productVariants =
      await productVariantModel.getProductVariantsByProductId(product.id)

    if (!productVariants) return product

    product.productVariants = productVariants.map((productVariant) => ({
      ...productVariant,
      price: productVariant.price,
      id: productVariant.id
    }))

    product.productVariants = await Promise.all(
      productVariants.map(async (productVariant) => {
        const variantAttributeOptions =
          await productVariantModel.getVariantAttributeOptions(
            productVariant.id
          )

        const promotionsVariant =
          await promotionVariantModel.getPromotionsForVariant(productVariant.id)

        const variantImages = await variantImageModel.getVariantImages(
          productVariant.id
        )

        const variantRatingSearch =
          await variantRatingModel.getRatingsByVariantId(productVariant.id)

        const variantRatings: VariantRatingWithCustomer[] =
          variantRatingSearch.ratings.map((rating) => ({
            ...rating
          }))

        return {
          ...productVariant,
          variantAttributeOptions,
          promotionVariants: promotionsVariant,
          variantImages,
          variantRatings
        }
      })
    )

    return product
  }

  public async getProductsByBrandId(
    brandId: number
  ): Promise<Product[] | undefined> {
    const productsRaw = await oProductRep.getProductsByBrandId(brandId)
    return ProductsMapper(productsRaw)
  }

  public async searchProductsByName(
    searchTerm: string
  ): Promise<Product[] | undefined> {
    const productsRaw = await oProductRep.searchProductsByName(searchTerm)
    const products = ProductsMapper(productsRaw)

    if (!products) return undefined

    // Cargar la marca y categorías de cada producto
    const productsWithData = await Promise.all(
      products.map(async (product) => {
        // Cargar marca
        if (product.brandId) {
          const brand = await brandModel.getBrandById(product.brandId)
          if (brand) product.brand = brand
        }

        // Cargar categorías
        const categories = await categoryModel.getCategoriesByProductId(product.id)
        if (categories) {
          product.productCategories = categories.map((category) => ({
            categoryId: category.id,
            productId: product.id,
            categories
          }))
        }

        return product
      })
    )

    return productsWithData
  }

  public async getProductsPaginated(
    limit: number,
    offset: number
  ): Promise<Product[] | undefined> {
    const productsRaw = await oProductRep.getProductsPaginated(limit, offset)
    return ProductsMapper(productsRaw)
  }

  public async getProductsCount(): Promise<number> {
    return await oProductRep.getProductsCount()
  }

  public async createProduct(
    productData: Omit<ProductRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Product | undefined> {
    const created = await oProductRep.createProduct(productData)
    if (!created) return undefined
    return ProductMapper(created)
  }

  public async updateProduct(
    productData: Partial<Omit<ProductRaw, 'id' | 'created_at' | 'updated_at'>>,
    id: number
  ): Promise<Product | undefined> {
    const updated = await oProductRep.updateProduct(productData, id)
    if (!updated) return undefined
    return ProductMapper(updated)
  }

  public async deleteProduct(id: number): Promise<void> {
    await oProductRep.deleteProduct(id)
  }

  // ============================================================================
  // MÉTODOS CON COMPOSICIÓN (nueva estructura)
  // ============================================================================

  // public async getProductsWithVariants(): Promise<
  //   ProductWithVariants[] | undefined
  // > {
  //   const productsRaw = await oProductRep.getProducts()
  //   const products = ProductsMapper(productsRaw)

  //   if (!products) return undefined

  //   const productIds = products.map((product) => product.id)
  //   const variantsByProductId =
  //     await productVariantModel.getProductVariantsByProductIds(productIds)

  //   return products.map((product) => ({
  //     ...product,
  //     productVariants: variantsByProductId.get(product.id) || []
  //   }))
  // }

  public async getProductsWithBrands(): Promise<Product[] | undefined> {
    const productsRaw = await oProductRep.getProducts()
    const products = ProductsMapper(productsRaw)

    if (!products) return undefined

    const brandIds = [...new Set(products.map((product) => product.brandId))]
    const brandsMap = new Map()

    for (const brandId of brandIds) {
      if (brandId) {
        const brand = await brandModel.getBrandById(brandId)
        if (brand) {
          brandsMap.set(brandId, brand)
        }
      }
    }

    return products.map((product) => ({
      ...product,
      brands: brandsMap.get(product.brandId)
        ? [brandsMap.get(product.brandId)]
        : []
    }))
  }

  // public async getProductsWithCategories(): Promise<
  //   ProductWithCategories[] | undefined
  // > {
  //   const productsRaw = await oProductRep.getProducts()
  //   const products = ProductsMapper(productsRaw)

  //   if (!products) return undefined

  //   const productsWithCategories = await Promise.all(
  //     products.map(async (product) => {
  //       const categories = await categoryModel.getCategoriesByProductId(
  //         product.id
  //       )
  //       return {
  //         ...product,
  //         categories: categories || []
  //       }
  //     })
  //   )

  //   return productsWithCategories
  // }

  // public async getProductsComplete(): Promise<ProductComplete2[] | undefined> {
  //   const productsRaw = await oProductRep.getProducts()
  //   const products = ProductsMapper(productsRaw)

  //   if (!products) return undefined

  //   const productIds = products.map((product) => product.id)
  //   const variantsByProductId =
  //     await productVariantModel.getProductVariantsByProductIds(productIds)

  //   const brandIds = [...new Set(products.map((product) => product.brandId))]
  //   const brandsMap = new Map()

  //   for (const brandId of brandIds) {
  //     if (brandId) {
  //       const brand = await brandModel.getBrandById(brandId)
  //       if (brand) {
  //         brandsMap.set(brandId, brand)
  //       }
  //     }
  //   }

  //   const productsComplete = await Promise.all(
  //     products.map(async (product) => {
  //       const categories = await categoryModel.getCategoriesByProductId(
  //         product.id
  //       )
  //       return {
  //         ...product,
  //         productVariants: variantsByProductId.get(product.id) || [],
  //         brands: brandsMap.get(product.brandId)
  //           ? [brandsMap.get(product.brandId)]
  //           : [],
  //         categories: categories || []
  //       }
  //     })
  //   )

  //   return productsComplete
  // }

  // public async getProductByIdWithVariants(
  //   id: number
  // ): Promise<ProductWithVariants | undefined> {
  //   const productRaw = await oProductRep.getProductById(id)
  //   if (!productRaw) return undefined

  //   const product = ProductMapper(productRaw)
  //   const variants = await productVariantModel.getProductVariantsByProductId(id)

  //   return {
  //     ...product,
  //     productVariants: variants || []
  //   }
  // }

  // public async getProductByIdWithBrand(
  //   id: number
  // ): Promise<ProductWithBrand | undefined> {
  //   const productRaw = await oProductRep.getProductById(id)
  //   if (!productRaw) return undefined

  //   const product = ProductMapper(productRaw)

  //   if (product.brandId) {
  //     const brand = await brandModel.getBrandById(product.brandId)
  //     return {
  //       ...product,
  //       brands: brand ? [brand] : []
  //     }
  //   }

  //   return {
  //     ...product,
  //     brands: []
  //   }
  // }

  // public async getProductByIdWithCategories(
  //   id: number
  // ): Promise<ProductWithCategories | undefined> {
  //   const productRaw = await oProductRep.getProductById(id)
  //   if (!productRaw) return undefined

  //   const product = ProductMapper(productRaw)
  //   const categories = await categoryModel.getCategoriesByProductId(id)

  //   return {
  //     ...product,
  //     categories: categories || []
  //   }
  // }

  // public async getProductByIdComplete(
  //   id: number
  // ): Promise<ProductComplete | undefined> {
  //   const productRaw = await oProductRep.getProductById(id)
  //   if (!productRaw) return undefined

  //   const product = ProductMapper(productRaw)
  //   const variants =
  //     await productVariantModel.getProductVariantsByProductIdWithAttributeOptions(
  //       id
  //     )

  //   const brand = product.brandId
  //     ? await brandModel.getBrandById(product.brandId)
  //     : undefined
  //   const categories = await categoryModel.getCategoriesByProductId(id)

  //   return {
  //     ...product,
  //     productVariants: variants || [],
  //     brands: brand ? [brand] : [],
  //     categories: categories || []
  //   }
  // }

  // ============================================================================
  // MÉTODOS DE BÚSQUEDA Y FILTROS (delegación a modelos especializados)
  // ============================================================================

  public async searchProducts(
    filters: ProductSearchFilters
  ): Promise<ProductSearchResult> {
    const result = await searchModel.searchProducts(filters)

    // Obtener filtros disponibles y añadirlos al resultado
    const availableFilters = await filtersModel.getAvailableFilters()

    return {
      ...result,
      filters: availableFilters
    }
  }

  public async searchProductVariants(
    filters: ProductSearchFilters
  ): Promise<ProductSearchResult> {
    return await this.searchProducts(filters)
  }

  public async getAvailableFilters() {
    return await filtersModel.getAvailableFilters()
  }
}

const productModel = new ProductModel()
export default productModel
