import { type Products as ProductRaw } from '@/types/database'
import {
  type Products as Product,
  type VariantAttributeOptions
} from '@/types/domain'

import { ProductMapper, ProductsMapper } from './Product.mapper'
import oProductRep from './Product.repository'

// Module dependencies
import { brandModel } from '@/module/brands/core'
import { categoryModel } from '@/module/categories/core'
import { promotionVariantModel } from '@/module/promotions/core'
import {
  filtersModel,
  searchModel,
  type ProductSearchFilters,
  type ProductSearchResult
} from '@/module/search/core'
import productVariantModel from './ProductVariant.model'
import variantAttributeOptionModel from './VariantAttributeOption.model'
import variantImageModel from './VariantImage.model'
import variantRatingModel from './VariantRating.model'
import { type VariantRatingWithCustomer } from './VariantRating.interfaces'

export class ProductModel {
  public async getProducts(): Promise<Product[] | undefined> {
    const productsRaw = await oProductRep.getProducts()
    const products = ProductsMapper(productsRaw)

    if (!products) return undefined

    // Load brand and categories for each product
    const productsWithData = await Promise.all(
      products.map(async (product) => {
        // Load brand
        if (product.brandId) {
          const brand = await brandModel.getBrandById(product.brandId)
          if (brand) product.brand = brand
        }

        // Load categories
        const categories = await categoryModel.getCategoriesByProductId(
          product.id
        )
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
   * Get products with statistics for admin panel
   * Includes: variant count, total stock, price range, main image
   */
  public async getProductsForAdmin(): Promise<any[] | undefined> {
    const productsRaw = await oProductRep.getProducts()
    const products = ProductsMapper(productsRaw)

    if (!products) return undefined

    const productsWithStats = await Promise.all(
      products.map(async (product) => {
        // Load brand
        let brand = null
        if (product.brandId) {
          brand = await brandModel.getBrandById(product.brandId)
        }

        // Load variants with their data
        const variants =
          await productVariantModel.getProductVariantsByProductId(product.id)

        // Calculate variant statistics
        const variantsCount = variants?.length ?? 0
        let totalStock = 0
        let minPrice = product.basePrice ?? 0
        let maxPrice = product.basePrice ?? 0
        let mainImage: string | null = null

        if (variants && variants.length > 0) {
          // Calculate total stock and price range
          for (const variant of variants) {
            totalStock += variant.stock ?? 0
            const variantPrice = variant.price ?? 0
            if (variantPrice > 0) {
              if (minPrice === 0 || variantPrice < minPrice) {
                minPrice = variantPrice
              }
              if (variantPrice > maxPrice) maxPrice = variantPrice
            }
          }

          // Get image from first variant
          const firstVariantImages = await variantImageModel.getVariantImages(
            variants[0].id
          )
          if (firstVariantImages && firstVariantImages.length > 0) {
            // Find primary image or use the first one
            const primaryImage =
              firstVariantImages.find((img) => img.isPrimary) ??
              firstVariantImages[0]
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
          createdAt: (product as any).createdAt
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

        // Get variant images
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

    // Load brand and categories for each product
    const productsWithData = await Promise.all(
      products.map(async (product) => {
        // Load brand
        if (product.brandId) {
          const brand = await brandModel.getBrandById(product.brandId)
          if (brand) product.brand = brand
        }

        // Load categories
        const categories = await categoryModel.getCategoriesByProductId(
          product.id
        )
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
  // COMPOSITION METHODS
  // ============================================================================

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

  // ============================================================================
  // SEARCH AND FILTER METHODS (delegation to specialized models)
  // ============================================================================

  public async searchProducts(
    filters: ProductSearchFilters
  ): Promise<ProductSearchResult> {
    const result = await searchModel.searchProducts(filters)

    // Get available filters and add to result
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
