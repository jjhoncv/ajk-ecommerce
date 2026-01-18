import { productModel } from '../../core'
import { type ProductAdmin } from './types'

export const getProductsForAdmin = async (): Promise<ProductAdmin[]> => {
  const products = await productModel.getProductsForAdmin()
  if (!products) return []
  return products
}

export const getProductById = async (id: number) => {
  return await productModel.getProductById(id)
}

export const deleteProduct = async (id: number): Promise<void> => {
  await productModel.deleteProduct(id)
}
