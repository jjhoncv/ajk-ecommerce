import brandModel from '@/module/brands/core'
import userModel from '@/module/users/core/User.model'
import { type Brand } from './types'

export interface BrandWithAudit {
  brand: Brand
  audit: {
    createdAt: Date | null
    createdByName: string | null
    updatedAt: Date | null
    updatedByName: string | null
  }
}

export const getBrands = async (): Promise<Brand[]> => {
  try {
    const brandsData = await brandModel.getBrands()

    if (brandsData == null || brandsData.length === 0) {
      return []
    }

    return brandsData.map((brand) => ({
      id: brand.id,
      name: brand.name,
      imageUrl: brand.imageUrl ?? null,
      createdBy: brand.createdBy ?? null,
      updatedBy: brand.updatedBy ?? null
    }))
  } catch (error) {
    throw new Error(
      `Error al obtener getBrands ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

export const getBrand = async (id: number): Promise<Brand | undefined> => {
  try {
    const brandData = await brandModel.getBrandById(id)
    if (brandData === undefined) {
      return undefined
    }

    return {
      id: brandData.id,
      name: brandData.name,
      imageUrl: brandData.imageUrl ?? null,
      createdBy: brandData.createdBy ?? null,
      updatedBy: brandData.updatedBy ?? null
    }
  } catch (error) {
    throw new Error(
      `Error al obtener getBrand ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

export const getBrandWithAudit = async (id: number): Promise<BrandWithAudit | null> => {
  try {
    const brandData = await brandModel.getBrandById(id)
    if (brandData === undefined) return null

    const brand: Brand = {
      id: brandData.id,
      name: brandData.name,
      imageUrl: brandData.imageUrl ?? null,
      createdBy: brandData.createdBy ?? null,
      updatedBy: brandData.updatedBy ?? null
    }

    // Obtener nombres de usuarios
    const [createdByName, updatedByName] = await Promise.all([
      brandData.createdBy ? userModel.getUserFullName(brandData.createdBy) : null,
      brandData.updatedBy ? userModel.getUserFullName(brandData.updatedBy) : null
    ])

    return {
      brand,
      audit: {
        createdAt: null, // Brand type doesn't include timestamps
        createdByName,
        updatedAt: null,
        updatedByName
      }
    }
  } catch (error) {
    throw new Error(
      `Error al obtener getBrandWithAudit ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}

export const searchBrands = async (query: string): Promise<Brand[]> => {
  try {
    const brandsData = await brandModel.getBrands()

    if (brandsData == null || brandsData.length === 0) {
      return []
    }

    const lowerQuery = query.toLowerCase()
    return brandsData
      .filter((brand) => brand.name.toLowerCase().includes(lowerQuery))
      .map((brand) => ({
        id: brand.id,
        name: brand.name,
        imageUrl: brand.imageUrl ?? null,
        createdBy: brand.createdBy ?? null,
        updatedBy: brand.updatedBy ?? null
      }))
  } catch (error) {
    throw new Error(
      `Error al buscar marcas ${error instanceof Error ? error.message : 'Unknown error'}`
    )
  }
}
