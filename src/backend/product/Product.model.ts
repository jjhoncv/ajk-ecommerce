// generated
import { Products as ProductRaw } from '@/types/database'
import { Products as Product, VariantAttributeOptions } from '@/types/domain'

// me
import { ProductMapper, ProductsMapper } from './Product.mapper'
import oProductRep from './Product.repository'

// others
import brandModel from '@/backend/brand'
import categoryModel from '@/backend/category'
import filtersModel from '@/backend/filters'
import productVariantModel from '@/backend/product-variant'
import promotionModel from '@/backend/promotion'
import promotionVariantModel from '@/backend/promotion-variant'
import searchModel, {
  ProductSearchFilters,
  ProductSearchResult
} from '@/backend/search'
import variantAttributeOptionModel from '@/backend/variant-attribute-option'
import variantImageModel from '@/backend/variant-image'
import variantRatingModel, {
  VariantRatingWithCustomer
} from '@/backend/variant-rating'

export class ProductModel {
  public async getProducts(): Promise<Product[] | undefined> {
    const productsRaw = await oProductRep.getProducts()
    return ProductsMapper(productsRaw)
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
            attributeOptionId: option.attributeOptionId,
            attributeOption: option.attributeOption
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
      id: productVariant.id
    }))

    product.productVariants = await Promise.all(
      productVariants.map(async (productVariant) => {
        const variantAttributeOptions =
          await productVariantModel.getVariantAttributeOptions(
            productVariant.id
          )

        const promotionVariantsByVariantId =
          await promotionVariantModel.getPromotionVariantsByVariantId(
            productVariant.id
          )

        if (!promotionVariantsByVariantId)
          return {
            ...productVariant,
            variantAttributeOptions: variantAttributeOptions,
            promotionVariants: []
          }

        const promotionVariants =
          (await Promise.all(
            promotionVariantsByVariantId.map(async (promotionVariant) => ({
              ...promotionVariant,
              promotion: await promotionModel.getPromotionById(
                promotionVariant.promotionId
              )
            }))
          )) || []

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
          variantAttributeOptions: variantAttributeOptions,
          promotionVariants: promotionVariants,
          variantImages: variantImages,
          variantRatings: variantRatings
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
    return ProductsMapper(productsRaw)
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
    return await oProductRep.deleteProduct(id)
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

  // ============================================================================
  // MÉTODOS PARA COMPATIBILIDAD CON ProductModel.ts ORIGINAL
  // ============================================================================

  public async ProductMapperToDTO(product: Product) {
    const brand = await brandModel.getBrandById(product.brandId || 0)
    const categories = await categoryModel.getCategoriesByProductId(product.id)

    let variants =
      await productVariantModel.getProductVariantsByProductIdWithAttributeOptions(
        product.id
      )

    if (variants) {
      variants = await Promise.all(
        variants.map(async (variant) => {
          const bestPromotion =
            await promotionVariantModel.getBestPromotionForVariant(variant.id)

          if (bestPromotion) {
            let promotionPrice = bestPromotion.promotionPrice

            if (promotionPrice === null || promotionPrice === undefined) {
              // Usar el precio promocional del objeto si existe
              promotionPrice =
                bestPromotion.promotionPrice || Number(variant.price)
            }

            return {
              ...variant,
              promotion: {
                id: bestPromotion.promotionId,
                name: `Promotion ${bestPromotion.promotionId}`,
                discountType: 'percentage' as const,
                discountValue: 0,
                promotionPrice: promotionPrice,
                startDate: new Date(),
                endDate: new Date(),
                stockLimit: bestPromotion.stockLimit ?? null
              }
            }
          }

          return variant
        })
      )
    }

    let mainImage: string | undefined
    if (
      variants &&
      variants.length > 0 &&
      variants[0].variantImages &&
      variants[0].variantImages.length > 0
    ) {
      const primaryImage = variants[0].variantImages.find(
        (img) => img?.isPrimary
      )
      mainImage = primaryImage
        ? primaryImage.imageUrlNormal
        : variants[0].variantImages[0]?.imageUrlNormal
    }

    const prices =
      variants?.map((variant) => {
        const variantWithPromotion = variant as any
        if (
          variantWithPromotion.promotion &&
          variantWithPromotion.promotion.promotionPrice !== null
        ) {
          return Number(variantWithPromotion.promotion.promotionPrice)
        }
        return Number(variant.price)
      }) || []

    const minVariantPrice =
      prices.length > 0 ? Math.min(...prices) : Number(product.basePrice)

    return {
      id: Number(product.id),
      name: product.name,
      description: product.description,
      brandId: Number(product.brandId),
      brandName: brand?.name || '',
      basePrice: Number(product.basePrice),
      minVariantPrice,
      categories:
        categories?.map((cat) => ({
          id: Number(cat.id),
          name: cat.name
        })) || [],
      variants: variants || [],
      mainImage
    }
  }
}

const productModel = new ProductModel()
export default productModel
