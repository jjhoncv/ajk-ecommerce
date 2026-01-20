import { attributeModel } from '../../core'
import userModel from '@/module/users/core/User.model'
import { type Attributes } from '@/types/domain'

export interface AttributeWithAudit {
  attribute: Attributes
  audit: {
    createdAt: Date | null
    createdByName: string | null
    updatedAt: Date | null
    updatedByName: string | null
  }
}

export const getAttributes = async () => {
  return await attributeModel.getAttributes()
}

export const getAttributeById = async (id: number) => {
  return await attributeModel.getAttributeById(id)
}

export const getAttributeWithAudit = async (id: number): Promise<AttributeWithAudit | null> => {
  const attribute = await attributeModel.getAttributeById(id)
  if (!attribute) return null

  // Obtener nombres de usuarios
  const [createdByName, updatedByName] = await Promise.all([
    attribute.createdBy ? userModel.getUserFullName(attribute.createdBy) : null,
    attribute.updatedBy ? userModel.getUserFullName(attribute.updatedBy) : null
  ])

  return {
    attribute,
    audit: {
      createdAt: attribute.createdAt ?? null,
      createdByName,
      updatedAt: attribute.updatedAt ?? null,
      updatedByName
    }
  }
}
