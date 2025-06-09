import { mapProduct, mapProducts } from '@/mappers/mapProduct'
import brandModel from '@/models/Brand.model' // Asumiendo que ya existe
import productVariantModel from '@/models/ProductVariant.model'
import oProductRep from '@/repository/Product.repository'

import { products as ProductRaw } from '@/types/database'
import { Brands, Products as Product, ProductVariants } from '@/types/domain'

export interface ProductWithVariants extends Product {
  productVariants: ProductVariants[]
}

export interface ProductWithBrand extends Product {
  brands: Brands[]
}

export interface ProductComplete extends Product {
  productVariants: ProductVariants[]
  brands: Brands[]
}

export class ProductModel {
  // ✅ Obtener todos los products (SIN relaciones por defecto)
  public async getProducts(): Promise<Product[] | undefined> {
    const productsRaw = await oProductRep.getProducts()
    return mapProducts(productsRaw)
  }

  // ✅ Obtener todos los products CON variants (lógica de negocio)
  public async getProductsWithVariants(): Promise<
    ProductWithVariants[] | undefined
  > {
    const productsRaw = await oProductRep.getProducts()
    const products = mapProducts(productsRaw)

    if (!products) return undefined

    // Obtener variants para todos los products (batch loading)
    const productIds = products.map((product) => product.id)
    const variantsByProductId =
      await productVariantModel.getProductVariantsByProductIds(productIds)

    // Combinar products con sus variants
    return products.map((product) => ({
      ...product,
      productVariants: variantsByProductId.get(product.id) || []
    }))
  }

  // ✅ Obtener todos los products CON brands (lógica de negocio)
  public async getProductsWithBrands(): Promise<
    ProductWithBrand[] | undefined
  > {
    const productsRaw = await oProductRep.getProducts()
    const products = mapProducts(productsRaw)

    if (!products) return undefined

    // Obtener brands únicos
    const brandIds = [...new Set(products.map((product) => product.brandId))]
    const brandsMap = new Map()

    for (const brandId of brandIds) {
      const brand = await brandModel.getBrandById(brandId)
      if (brand) {
        brandsMap.set(brandId, brand)
      }
    }

    // Combinar products con sus brands
    return products.map((product) => ({
      ...product,
      brands: brandsMap.get(product.brandId)
        ? [brandsMap.get(product.brandId)]
        : []
    }))
  }

  // ✅ Obtener todos los products COMPLETOS (con variants y brands)
  public async getProductsComplete(): Promise<ProductComplete[] | undefined> {
    const productsRaw = await oProductRep.getProducts()
    const products = mapProducts(productsRaw)

    if (!products) return undefined

    // Obtener variants para todos los products (batch loading)
    const productIds = products.map((product) => product.id)
    const variantsByProductId =
      await productVariantModel.getProductVariantsByProductIds(productIds)

    // Obtener brands únicos
    const brandIds = [...new Set(products.map((product) => product.brandId))]
    const brandsMap = new Map()

    for (const brandId of brandIds) {
      const brand = await brandModel.getBrandById(brandId)
      if (brand) {
        brandsMap.set(brandId, brand)
      }
    }

    // Combinar products con variants y brands
    return products.map((product) => ({
      ...product,
      productVariants: variantsByProductId.get(product.id) || [],
      brands: brandsMap.get(product.brandId)
        ? [brandsMap.get(product.brandId)]
        : []
    }))
  }

  // ✅ Obtener product por ID (SIN relaciones por defecto)
  public async getProductById(id: number): Promise<Product | undefined> {
    const productRaw = await oProductRep.getProductById(id)

    if (!productRaw) return undefined

    return mapProduct(productRaw)
  }

  // ✅ Obtener product por ID CON variants (lógica de negocio)
  public async getProductByIdWithVariants(
    id: number
  ): Promise<ProductWithVariants | undefined> {
    const productRaw = await oProductRep.getProductById(id)

    if (!productRaw) return undefined

    const product = mapProduct(productRaw)

    // Obtener variants del product
    const variants = await productVariantModel.getProductVariantsByProductId(id)

    return {
      ...product,
      productVariants: variants || []
    }
  }

  // ✅ Obtener product por ID CON variants Y attribute options (lógica de negocio completa)
  public async getProductByIdWithVariantsAndAttributes(
    id: number
  ): Promise<ProductWithVariants | undefined> {
    const productRaw = await oProductRep.getProductById(id)

    if (!productRaw) return undefined

    const product = mapProduct(productRaw)

    // Obtener variants CON attribute options
    const variants =
      await productVariantModel.getProductVariantsByProductIdWithAttributeOptions(
        id
      )

    return {
      ...product,
      productVariants: variants || []
    }
  }

  // ✅ Obtener product COMPLETO por ID (con todo)
  public async getProductByIdComplete(
    id: number
  ): Promise<ProductComplete | undefined> {
    const productRaw = await oProductRep.getProductById(id)

    if (!productRaw) return undefined

    const product = mapProduct(productRaw)

    // Obtener variants con attribute options
    const variants =
      await productVariantModel.getProductVariantsByProductIdWithAttributeOptions(
        id
      )

    // Obtener brand
    const brand = await brandModel.getBrandById(product.brandId)

    return {
      ...product,
      productVariants: variants || [],
      brands: brand ? [brand] : []
    }
  }

  // ✅ Obtener products por brand ID
  public async getProductsByBrandId(
    brandId: number
  ): Promise<Product[] | undefined> {
    const productsRaw = await oProductRep.getProductsByBrandId(brandId)
    return mapProducts(productsRaw)
  }

  // ✅ Buscar products por nombre
  public async searchProductsByName(
    searchTerm: string
  ): Promise<Product[] | undefined> {
    const productsRaw = await oProductRep.searchProductsByName(searchTerm)
    return mapProducts(productsRaw)
  }

  // ✅ Obtener products con paginación
  public async getProductsPaginated(
    limit: number,
    offset: number
  ): Promise<Product[] | undefined> {
    const productsRaw = await oProductRep.getProductsPaginated(limit, offset)
    return mapProducts(productsRaw)
  }

  // ✅ Contar total de products
  public async getProductsCount(): Promise<number> {
    return await oProductRep.getProductsCount()
  }

  // ✅ Crear product
  public async createProduct(
    productData: Omit<ProductRaw, 'id' | 'created_at' | 'updated_at'>
  ): Promise<Product | undefined> {
    const created = await oProductRep.createProduct(productData)

    if (!created) return undefined

    return mapProduct(created)
  }

  // ✅ Actualizar product
  public async updateProduct(
    productData: Partial<Omit<ProductRaw, 'id' | 'created_at' | 'updated_at'>>,
    id: number
  ): Promise<Product | undefined> {
    const updated = await oProductRep.updateProduct(productData, id)

    if (!updated) return undefined

    return mapProduct(updated)
  }

  // ✅ Eliminar product
  public async deleteProduct(id: number): Promise<void> {
    return await oProductRep.deleteProduct(id)
  }
}

const productModel = new ProductModel()
export default productModel
