import { productModel } from '../../core'
import userModel from '@/module/users/core/User.model'
import { type ProductAdmin } from './types'
import { type Products } from '@/types/domain'

export interface ProductWithAudit {
  product: Products
  audit: {
    createdAt: Date | null
    createdByName: string | null
    updatedAt: Date | null
    updatedByName: string | null
  }
}

export const getProductsForAdmin = async (): Promise<ProductAdmin[]> => {
  const products = await productModel.getProductsForAdmin()
  if (!products) return []
  return products
}

export const getProductById = async (id: number) => {
  return await productModel.getProductById(id)
}

export const getProductWithAudit = async (id: number): Promise<ProductWithAudit | null> => {
  const product = await productModel.getProductById(id)
  if (!product) return null

  // Obtener nombres de usuarios
  const [createdByName, updatedByName] = await Promise.all([
    product.createdBy ? userModel.getUserFullName(product.createdBy) : null,
    product.updatedBy ? userModel.getUserFullName(product.updatedBy) : null
  ])

  return {
    product,
    audit: {
      createdAt: product.createdAt ?? null,
      createdByName,
      updatedAt: product.updatedAt ?? null,
      updatedByName
    }
  }
}

export const deleteProduct = async (id: number): Promise<void> => {
  await productModel.deleteProduct(id)
}
